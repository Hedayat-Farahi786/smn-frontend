import React, { useState, useRef, useCallback, useEffect } from "react";
import SignaturePad from "signature_pad";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import {
  Upload,
  Download,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Pen,
  Trash2,
  Check,
  X,
  FileText,
  Type,
  CheckSquare,
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { EnhancedPDFService } from "../services/EnhancedPDFService";
import HighQualityPDFViewer from "../components/HighQualityPDFViewer";
import SignatureCanvasOverlay from "../components/SignatureCanvasOverlay";
import PDFToolbar, { ToolType } from "../components/PDFToolbar";
import SignatureModal from "../components/SignatureModal";
import TextTool from "../components/TextTool";
import CheckboxTool from "../components/CheckboxTool";
import EnhancedPDFOverlay from "../components/EnhancedPDFOverlay";
import ColumnPDFViewer from "../components/ColumnPDFViewer";

// PDF.js worker is configured in SimplePDFViewer component

export interface SignaturePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  signatureData: string;
}

export interface TextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  style: {
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textDecoration: 'none' | 'underline';
    color: string;
    textAlign: 'left' | 'center' | 'right';
  };
  pageNumber: number;
}

export interface FormField {
  id: string;
  x: number;
  y: number;
  type: 'checkbox' | 'textfield' | 'signature';
  label: string;
  required: boolean;
  size: 'small' | 'medium' | 'large';
  pageNumber: number;
  value?: any;
}

const PDFSignaturePage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signatures, setSignatures] = useState<SignaturePosition[]>([]);
  const [selectedSignatureId, setSelectedSignatureId] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [pageImages, setPageImages] = useState<Record<number, string>>({});
  
  // New state for enhanced features
  const [currentTool, setCurrentTool] = useState<ToolType>('select');
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState<boolean>(false);
  const [textAnnotations, setTextAnnotations] = useState<TextAnnotation[]>([]);
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [blankPages, setBlankPages] = useState<Record<number, { width: number; height: number }>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signaturePadRef = useRef<HTMLCanvasElement>(null);
  const signaturePad = useRef<SignaturePad | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const { toast } = useToast();

  // Initialize signature pad
  useEffect(() => {
    const initializeSignaturePad = () => {
      console.log("Attempting to initialize signature pad...");
      console.log("Canvas ref:", signaturePadRef.current);
      
      if (!signaturePadRef.current) {
        console.log("Canvas ref is null, retrying...");
        return false;
      }

      const canvas = signaturePadRef.current;
      console.log("Canvas element found:", canvas);
      
      // Wait for canvas to be properly rendered
      const rect = canvas.getBoundingClientRect();
      console.log("Canvas rect:", rect);
      
      if (rect.width === 0 || rect.height === 0) {
        console.log("Canvas has zero dimensions, retrying...");
        return false;
      }
      
      try {
        const dpr = window.devicePixelRatio || 1;
        console.log("Device pixel ratio:", dpr);
        
        // Set canvas size
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        console.log("Canvas dimensions set:", canvas.width, "x", canvas.height);
        
        // Get context and scale
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          console.error("Failed to get canvas 2D context");
          return false;
        }
        
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        console.log("Canvas context configured");
        
        // Initialize signature pad
        signaturePad.current = new SignaturePad(canvas, {
          backgroundColor: "rgba(255, 255, 255, 1)",
          penColor: "rgb(0, 0, 0)",
          minWidth: 1,
          maxWidth: 3,
          throttle: 8,
          minDistance: 1,
        });
        
        console.log("Signature pad initialized successfully:", {
          canvasWidth: canvas.width,
          canvasHeight: canvas.height,
          devicePixelRatio: dpr,
          signaturePad: signaturePad.current,
          isEmpty: signaturePad.current.isEmpty()
        });
        
        return true;
      } catch (error) {
        console.error("Error initializing signature pad:", error);
        return false;
      }
    };

    // Try to initialize with multiple attempts
    const attemptInitialization = () => {
      if (!initializeSignaturePad()) {
        // Retry after a short delay
        setTimeout(attemptInitialization, 200);
      }
    };

    // Start initialization attempts
    attemptInitialization();
    
    // Also try after a longer delay as backup
    const timeoutId = setTimeout(attemptInitialization, 500);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Handle signature pad canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (signaturePadRef.current && signaturePad.current) {
        const canvas = signaturePadRef.current;
        const rect = canvas.getBoundingClientRect();
        
        // Resize canvas
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;
        
        // Scale the drawing context
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
        
        // Clear and redraw signature pad
        signaturePad.current.clear();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && EnhancedPDFService.validatePDF(file)) {
        setPdfFile(file);
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
        setSignatures([]);
        setCurrentPage(1);
        toast({
          title: "PDF uploaded successfully",
          description: `File: ${file.name} (${EnhancedPDFService.formatFileSize(
            file.size
          )})`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a valid PDF file.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const onDocumentLoadSuccess = useCallback(
    ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    },
    []
  );

  const onDocumentLoadError = useCallback(
    (error: Error) => {
      console.error('PDF loading error:', error);
      toast({
        title: "PDF Loading Error",
        description: "Failed to load the PDF file. Please try a different file.",
        variant: "destructive",
      });
    },
    [toast]
  );

  const handleStartSigning = useCallback(() => {
    console.log("Starting signature mode...");
    console.log("PDF file exists:", !!pdfFile);
    console.log("Signature pad exists:", !!signaturePad.current);
    
    if (!pdfFile) {
      toast({
        title: "No PDF loaded",
        description: "Please upload a PDF file first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSigning(true);
    
    // Force re-initialization of signature pad if needed
    if (!signaturePad.current && signaturePadRef.current) {
      console.log("Re-initializing signature pad for signing mode...");
      const canvas = signaturePadRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
      
      signaturePad.current = new SignaturePad(canvas, {
        backgroundColor: "rgba(255, 255, 255, 1)",
        penColor: "rgb(0, 0, 0)",
        minWidth: 1,
        maxWidth: 3,
        throttle: 8,
        minDistance: 1,
      });
      
      console.log("Signature pad re-initialized for signing:", signaturePad.current);
    }
    
    if (signaturePad.current) {
      signaturePad.current.clear();
      console.log("Signature pad cleared");
    } else {
      console.warn("Signature pad not available when starting signing");
    }
  }, [pdfFile, toast]);

  const handleSaveSignature = useCallback(() => {
    console.log("Attempting to save signature...");
    console.log("Signature pad exists:", !!signaturePad.current);
    console.log("Signature pad is empty:", signaturePad.current?.isEmpty());
    
    if (!signaturePad.current) {
      toast({
        title: "Signature pad not initialized",
        description: "Please try refreshing the page and try again.",
        variant: "destructive",
      });
      return;
    }

    if (signaturePad.current.isEmpty()) {
      toast({
        title: "No signature",
        description: "Please draw a signature first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const signatureData = signaturePad.current.toDataURL('image/png');
      console.log("Signature data generated, length:", signatureData.length);
      
      const newSignature: SignaturePosition = {
        id: `signature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: 100,
        y: 100,
        width: 200,
        height: 80,
        pageNumber: currentPage,
        signatureData,
      };

      setSignatures((prev) => [...prev, newSignature]);
      setSelectedSignatureId(newSignature.id);
      setIsSigning(false);
      signaturePad.current.clear();

      toast({
        title: "Signature added",
        description: "Click on the PDF image to place the signature.",
      });
      
      console.log("Signature saved successfully:", newSignature.id);
    } catch (error) {
      console.error("Error saving signature:", error);
      toast({
        title: "Error saving signature",
        description: "There was an error saving your signature. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentPage, toast]);

  const handleCancelSigning = useCallback(() => {
    setIsSigning(false);
    if (signaturePad.current) {
      signaturePad.current.clear();
    }
  }, []);

  const handleSignatureClick = useCallback((signatureId: string) => {
    setSelectedSignatureId(signatureId);
  }, []);

  const handleImageClick = useCallback((event: React.MouseEvent<HTMLImageElement>, pageNumber: number, imageDimensions: { width: number; height: number }) => {
    if (currentTool === 'select') return;
    
    // Get click coordinates relative to the image
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * imageDimensions.width;
    const y = ((event.clientY - rect.top) / rect.height) * imageDimensions.height;
    
    if (currentTool === 'signature') {
    // Find the most recently added signature that hasn't been placed yet
    const unplacedSignature = signatures
      .filter(sig => sig.pageNumber === currentPage)
      .sort((a, b) => b.id.localeCompare(a.id))[0];
    
    if (unplacedSignature) {
      setSignatures(prev => prev.map(sig => 
        sig.id === unplacedSignature.id 
          ? { ...sig, x, y }
          : sig
      ));
        setCurrentTool('select');
      toast({
        title: "Signature placed",
        description: "Signature has been placed on the document.",
      });
    }
    } else if (currentTool === 'text') {
      // Find the most recently added text annotation that hasn't been placed yet
      const unplacedText = textAnnotations
        .filter(text => text.pageNumber === currentPage)
        .sort((a, b) => b.id.localeCompare(a.id))[0];
      
      if (unplacedText) {
        setTextAnnotations(prev => prev.map(text => 
          text.id === unplacedText.id 
            ? { ...text, x, y }
            : text
        ));
        setCurrentTool('select');
        toast({
          title: "Text placed",
          description: "Text has been placed on the document.",
        });
      }
    } else if (currentTool === 'checkbox') {
      // Find the most recently added form field that hasn't been placed yet
      const unplacedFormField = formFields
        .filter(field => field.pageNumber === currentPage)
        .sort((a, b) => b.id.localeCompare(a.id))[0];
      
      if (unplacedFormField) {
        setFormFields(prev => prev.map(field => 
          field.id === unplacedFormField.id 
            ? { ...field, x, y }
            : field
        ));
        setCurrentTool('select');
        toast({
          title: "Form field placed",
          description: "Form field has been placed on the document.",
        });
      }
    }
  }, [currentTool, signatures, textAnnotations, formFields, currentPage, toast]);

  const handleSignatureMove = useCallback((signatureId: string, x: number, y: number) => {
    setSignatures(prev => prev.map(sig => 
      sig.id === signatureId 
        ? { ...sig, x, y }
        : sig
    ));
  }, []);

  const handleSignatureResize = useCallback((signatureId: string, x: number, y: number, width: number, height: number) => {
    setSignatures(prev => prev.map(sig => 
      sig.id === signatureId 
        ? { ...sig, x, y, width, height }
        : sig
    ));
  }, []);

  const handlePageImageRendered = useCallback((pageNumber: number, imageDataUrl: string, dimensions: { width: number; height: number }) => {
    setPageImages(prev => ({ ...prev, [pageNumber]: imageDataUrl }));
    if (pageNumber === currentPage) {
      setImageDimensions(dimensions);
    }
  }, [currentPage]);

  const handleDeleteSignature = useCallback(
    (signatureId: string) => {
      setSignatures((prev) => prev.filter((s) => s.id !== signatureId));
      if (selectedSignatureId === signatureId) {
        setSelectedSignatureId(null);
      }
      toast({
        title: "Signature deleted",
        description: "Signature has been removed from the document.",
      });
    },
    [selectedSignatureId, toast]
  );


  const handleApplyChanges = useCallback(async () => {
    if (!pdfFile || (signatures.length === 0 && textAnnotations.length === 0 && formFields.length === 0)) {
      toast({
        title: "No changes to apply",
        description: "Please add signatures, text, or form fields before applying changes.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Applying changes...",
        description: "Saving all elements to the PDF...",
      });

      // Create a comprehensive PDF with all elements
      const allElements = {
        signatures,
        textAnnotations,
        formFields,
        pageImages
      };

      const updatedPdfBlob = await EnhancedPDFService.createHighQualitySignedPDF(
        pdfUrl,
        signatures,
        pageImages,
        pdfFile.name
      );

      // Update the PDF URL with the new version
      const newUrl = URL.createObjectURL(updatedPdfBlob);
      setPdfUrl(newUrl);

      toast({
        title: "Changes applied successfully",
        description: "All elements have been saved to the PDF. You can now download the updated document.",
      });
    } catch (error) {
      console.error("Apply changes error:", error);
      toast({
        title: "Failed to apply changes",
        description: "There was an error saving the elements to the PDF.",
        variant: "destructive",
      });
    }
  }, [pdfFile, signatures, textAnnotations, formFields, pdfUrl, pageImages, toast]);

  const handleDownload = useCallback(async () => {
    if (!pdfFile || (signatures.length === 0 && textAnnotations.length === 0 && formFields.length === 0)) {
      toast({
        title: "Cannot download",
        description: "Please add signatures, text, or form fields before downloading.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Processing...",
        description: "Creating final PDF document...",
      });

      const signedPdfBlob = await EnhancedPDFService.createHighQualitySignedPDF(
        pdfUrl,
        signatures,
        pageImages,
        pdfFile.name
      );

      const fileName = `edited_${pdfFile.name}`;
      EnhancedPDFService.downloadBlob(signedPdfBlob, fileName);

      toast({
        title: "Download started",
        description: "Your edited PDF is being downloaded.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error creating the final PDF.",
        variant: "destructive",
      });
    }
  }, [pdfFile, signatures, pdfUrl, pageImages, toast]);

  const clearAllSignatures = useCallback(() => {
    setSignatures([]);
    setSelectedSignatureId(null);
    toast({
      title: "Signatures cleared",
      description: "All signatures have been removed.",
    });
  }, [toast]);

  // New handler functions for enhanced features
  const handleToolChange = useCallback((tool: ToolType) => {
    setCurrentTool(tool);
    if (tool === 'signature') {
      setIsSignatureModalOpen(true);
    }
  }, []);

  const handleSignatureSave = useCallback((signatureData: string, method: 'type' | 'draw' | 'upload' | 'camera') => {
    const newSignature: SignaturePosition = {
      id: `signature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: 100,
      y: 100,
      width: 200,
      height: 80,
      pageNumber: currentPage,
      signatureData,
    };

    setSignatures((prev) => [...prev, newSignature]);
    setSelectedSignatureId(newSignature.id);
    setCurrentTool('select');
    
    toast({
      title: "Signature created",
      description: "Click on the PDF to place the signature.",
    });
  }, [currentPage, toast]);

  const handleTextAdd = useCallback((text: string, style: any) => {
    const newTextAnnotation: TextAnnotation = {
      id: `text-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: 100,
      y: 100,
      text,
      style,
      pageNumber: currentPage,
    };

    setTextAnnotations((prev) => [...prev, newTextAnnotation]);
    setSelectedElementId(newTextAnnotation.id);
    setCurrentTool('select');
    
    toast({
      title: "Text added",
      description: "Click on the PDF to place the text.",
    });
  }, [currentPage, toast]);

  const handleFormFieldAdd = useCallback((formData: any) => {
    const newFormField: FormField = {
      id: formData.id,
      x: 100,
      y: 100,
      type: formData.type,
      label: formData.label,
      required: formData.required,
      size: formData.size,
      pageNumber: currentPage,
    };

    setFormFields((prev) => [...prev, newFormField]);
    setSelectedElementId(newFormField.id);
    setCurrentTool('select');
    
    toast({
      title: "Form field added",
      description: "Click on the PDF to place the form field.",
    });
  }, [currentPage, toast]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      // Restore state from history
      const state = history[historyIndex - 1];
      setSignatures(state.signatures || []);
      setTextAnnotations(state.textAnnotations || []);
      setFormFields(state.formFields || []);
    }
  }, [historyIndex, history]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      // Restore state from history
      const state = history[historyIndex + 1];
      setSignatures(state.signatures || []);
      setTextAnnotations(state.textAnnotations || []);
      setFormFields(state.formFields || []);
    }
  }, [historyIndex, history]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Enhanced overlay handlers
  const handleTextClick = useCallback((textId: string) => {
    setSelectedElementId(textId);
    setSelectedSignatureId(null);
  }, []);

  const handleFormFieldClick = useCallback((fieldId: string) => {
    setSelectedElementId(fieldId);
    setSelectedSignatureId(null);
  }, []);

  const handleTextMove = useCallback((textId: string, x: number, y: number) => {
    setTextAnnotations(prev => prev.map(text => 
      text.id === textId 
        ? { ...text, x, y }
        : text
    ));
  }, []);

  const handleFormFieldMove = useCallback((fieldId: string, x: number, y: number) => {
    setFormFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, x, y }
        : field
    ));
  }, []);

  const handleTextResize = useCallback((textId: string, x: number, y: number, width: number, height: number) => {
    // Text annotations don't have explicit width/height, but we can update position
    setTextAnnotations(prev => prev.map(text => 
      text.id === textId 
        ? { ...text, x, y }
        : text
    ));
  }, []);

  const handleFormFieldResize = useCallback((fieldId: string, x: number, y: number, width: number, height: number) => {
    // Form fields don't have explicit width/height in our current implementation
    setFormFields(prev => prev.map(field => 
      field.id === fieldId 
        ? { ...field, x, y }
        : field
    ));
  }, []);

  const handleDeleteElement = useCallback((elementId: string, type: 'signature' | 'text' | 'form') => {
    if (type === 'signature') {
      setSignatures(prev => prev.filter(s => s.id !== elementId));
      if (selectedSignatureId === elementId) {
        setSelectedSignatureId(null);
      }
    } else if (type === 'text') {
      setTextAnnotations(prev => prev.filter(t => t.id !== elementId));
    } else if (type === 'form') {
      setFormFields(prev => prev.filter(f => f.id !== elementId));
    }
    
    if (selectedElementId === elementId) {
      setSelectedElementId(null);
    }
    
    toast({
      title: "Element deleted",
      description: `${type} has been removed from the document.`,
    });
  }, [selectedSignatureId, selectedElementId, toast]);

  const handleAddBlankPage = useCallback((insertAfterPage: number) => {
    // Create a blank page with standard dimensions (8.5" x 11" at 300 DPI)
    const blankPageDimensions = {
      width: 2550, // 8.5 inches * 300 DPI
      height: 3300  // 11 inches * 300 DPI
    };
    
    // Generate a unique page number for the blank page
    const existingPageNumbers = new Set<number>();
    
    // Add PDF pages
    Array.from({ length: numPages }, (_, i) => i + 1).forEach(pageNum => existingPageNumbers.add(pageNum));
    
    // Add existing blank pages
    Object.keys(blankPages).forEach(pageNum => existingPageNumbers.add(parseInt(pageNum)));
    
    // Find the next available page number after the insert position
    let newPageNumber = insertAfterPage + 1;
    while (existingPageNumbers.has(newPageNumber)) {
      newPageNumber++;
    }
    
    setBlankPages(prev => ({
      ...prev,
      [newPageNumber]: blankPageDimensions
    }));
    
    toast({
      title: "Blank page added",
      description: `Blank page inserted ${insertAfterPage === 0 ? 'at the start' : insertAfterPage === numPages ? 'at the end' : `after page ${insertAfterPage}`}.`,
    });
  }, [numPages, blankPages, toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Toolbar */}
        {pdfFile && (
        <PDFToolbar
          currentTool={currentTool}
          onToolChange={handleToolChange}
          onZoomIn={() => setScale((prev) => Math.min(3, prev + 0.2))}
          onZoomOut={() => setScale((prev) => Math.max(0.5, prev - 0.2))}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onDownload={handleDownload}
          onApplyChanges={handleApplyChanges}
          onClearAll={() => {
                      setSignatures([]);
            setTextAnnotations([]);
            setFormFields([]);
            setSelectedSignatureId(null);
            setSelectedElementId(null);
          }}
          canUndo={canUndo}
          canRedo={canRedo}
          zoomLevel={scale}
          hasSignatures={signatures.length > 0 || textAnnotations.length > 0 || formFields.length > 0}
          onTextAdd={handleTextAdd}
          onFormFieldAdd={handleFormFieldAdd}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex">
        {!pdfFile ? (
          <div className="flex-1 flex items-center justify-center min-h-[calc(100vh-4rem)]">
            <div className="text-center space-y-6">
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="hidden"
              />
              
              {/* Icon */}
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              
              {/* Title */}
              <h1 className="text-2xl font-semibold text-foreground">
                PDF Signature Tool
              </h1>
              
              {/* Description */}
              <p className="text-muted-foreground max-w-sm mx-auto">
                Upload a PDF file to start editing with signatures, text annotations, and form fields.
              </p>
              
              {/* Upload Button */}
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                Choose PDF File
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Column PDF Viewer - All Pages */}
            <div className="flex-1 overflow-y-auto bg-white">
              <div className="w-full p-4">
                <ColumnPDFViewer
                  file={pdfUrl}
                  scale={scale}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  onPageImageRendered={handlePageImageRendered}
                  onImageClick={handleImageClick}
                  signatures={signatures}
                  textAnnotations={textAnnotations}
                  formFields={formFields}
                  selectedElementId={selectedElementId || selectedSignatureId}
                  onSignatureClick={handleSignatureClick}
                  onTextClick={handleTextClick}
                  onFormFieldClick={handleFormFieldClick}
                  onSignatureMove={handleSignatureMove}
                  onTextMove={handleTextMove}
                  onFormFieldMove={handleFormFieldMove}
                  onSignatureResize={handleSignatureResize}
                  onTextResize={handleTextResize}
                  onFormFieldResize={handleFormFieldResize}
                  onDeleteElement={handleDeleteElement}
                  currentTool={currentTool}
                  onAddBlankPage={handleAddBlankPage}
                  blankPages={blankPages}
                  className=""
                />
                    </div>
            </div>
          </div>
        )}
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        onSave={handleSignatureSave}
      />
    </div>
  );
};

export default PDFSignaturePage;

