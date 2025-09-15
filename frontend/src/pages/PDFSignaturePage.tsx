import React, { useState, useRef, useCallback, useEffect } from "react";
import SignaturePad from "signature_pad";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
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
} from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { PDFService } from "../services/pdfService";
import SimplePDFViewer from "../components/SimplePDFViewer";

// PDF.js worker is configured in SimplePDFViewer component

export interface SignaturePosition {
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  signatureData: string;
}

const PDFSignaturePage: React.FC = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2);
  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [signatures, setSignatures] = useState<SignaturePosition[]>([]);
  const [selectedSignature, setSelectedSignature] =
    useState<SignaturePosition | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [resizeHandle, setResizeHandle] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const signaturePadRef = useRef<HTMLCanvasElement>(null);
  const signaturePad = useRef<SignaturePad | null>(null);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Initialize signature pad
  useEffect(() => {
    if (signaturePadRef.current) {
      signaturePad.current = new SignaturePad(signaturePadRef.current, {
        backgroundColor: "rgba(255, 255, 255, 0)",
        penColor: "rgb(0, 0, 0)",
        minWidth: 1,
        maxWidth: 3,
      });
    }
  }, []);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file && PDFService.validatePDF(file)) {
        setPdfFile(file);
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
        setSignatures([]);
        setCurrentPage(1);
        toast({
          title: "PDF uploaded successfully",
          description: `File: ${file.name} (${PDFService.formatFileSize(
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
    if (!pdfFile) {
      toast({
        title: "No PDF loaded",
        description: "Please upload a PDF file first.",
        variant: "destructive",
      });
      return;
    }
    setIsSigning(true);
    if (signaturePad.current) {
      signaturePad.current.clear();
    }
  }, [pdfFile, toast]);

  const handleSaveSignature = useCallback(() => {
    if (!signaturePad.current || signaturePad.current.isEmpty()) {
      toast({
        title: "No signature",
        description: "Please draw a signature first.",
        variant: "destructive",
      });
      return;
    }

    const signatureData = signaturePad.current.toDataURL();
    const newSignature: SignaturePosition = {
      x: 100,
      y: 100,
      width: 200,
      height: 80,
      pageNumber: currentPage,
      signatureData,
    };

    setSignatures((prev) => [...prev, newSignature]);
    setSelectedSignature(newSignature);
    setIsSigning(false);
    signaturePad.current.clear();

    toast({
      title: "Signature added",
      description: "Signature has been added to the document.",
    });
  }, [currentPage, toast]);

  const handleCancelSigning = useCallback(() => {
    setIsSigning(false);
    if (signaturePad.current) {
      signaturePad.current.clear();
    }
  }, []);

  const handleSignatureClick = useCallback((signature: SignaturePosition) => {
    setSelectedSignature(signature);
  }, []);

  const handleDeleteSignature = useCallback(
    (signature: SignaturePosition) => {
      setSignatures((prev) => prev.filter((s) => s !== signature));
      if (selectedSignature === signature) {
        setSelectedSignature(null);
      }
      toast({
        title: "Signature deleted",
        description: "Signature has been removed from the document.",
      });
    },
    [selectedSignature, toast]
  );

  const handleMouseDown = useCallback(
    (event: React.MouseEvent, signature: SignaturePosition) => {
      if (event.target === event.currentTarget) {
        setIsDragging(true);
        setSelectedSignature(signature);
        const rect = (
          event.currentTarget as HTMLElement
        ).getBoundingClientRect();
        setDragOffset({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        });
      }
    },
    []
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent) => {
      if (isDragging && selectedSignature && pdfContainerRef.current) {
        const containerRect = pdfContainerRef.current.getBoundingClientRect();
        const newX = event.clientX - containerRect.left - dragOffset.x;
        const newY = event.clientY - containerRect.top - dragOffset.y;

        setSignatures((prev) =>
          prev.map((sig) =>
            sig === selectedSignature
              ? {
                  ...sig,
                  x: Math.max(
                    0,
                    Math.min(newX, containerRect.width - sig.width)
                  ),
                  y: Math.max(
                    0,
                    Math.min(newY, containerRect.height - sig.height)
                  ),
                }
              : sig
          )
        );
      } else if (isResizing && selectedSignature && pdfContainerRef.current) {
        const containerRect = pdfContainerRef.current.getBoundingClientRect();
        const mouseX = event.clientX - containerRect.left;
        const mouseY = event.clientY - containerRect.top;

        setSignatures((prev) =>
          prev.map((sig) => {
            if (sig === selectedSignature) {
              let newWidth = sig.width;
              let newHeight = sig.height;
              let newX = sig.x;
              let newY = sig.y;

              switch (resizeHandle) {
                case "se":
                  newWidth = Math.max(50, mouseX - sig.x);
                  newHeight = Math.max(30, mouseY - sig.y);
                  break;
                case "sw":
                  newWidth = Math.max(50, sig.x + sig.width - mouseX);
                  newHeight = Math.max(30, mouseY - sig.y);
                  newX = mouseX;
                  break;
                case "ne":
                  newWidth = Math.max(50, mouseX - sig.x);
                  newHeight = Math.max(30, sig.y + sig.height - mouseY);
                  newY = mouseY;
                  break;
                case "nw":
                  newWidth = Math.max(50, sig.x + sig.width - mouseX);
                  newHeight = Math.max(30, sig.y + sig.height - mouseY);
                  newX = mouseX;
                  newY = mouseY;
                  break;
              }

              return {
                ...sig,
                x: newX,
                y: newY,
                width: newWidth,
                height: newHeight,
              };
            }
            return sig;
          })
        );
      }
    },
    [isDragging, isResizing, selectedSignature, dragOffset, resizeHandle]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle("");
  }, []);

  const handleDownload = useCallback(async () => {
    if (!pdfFile || signatures.length === 0) {
      toast({
        title: "Cannot download",
        description: "Please upload a PDF and add at least one signature.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Processing...",
        description: "Creating signed PDF document...",
      });

      const signedPdfBlob = await PDFService.createSignedPDF(
        pdfUrl,
        signatures,
        pdfFile.name
      );

      const fileName = `signed_${pdfFile.name}`;
      PDFService.downloadBlob(signedPdfBlob, fileName);

      toast({
        title: "Download started",
        description: "Your signed PDF is being downloaded.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error creating the signed PDF.",
        variant: "destructive",
      });
    }
  }, [pdfFile, signatures, pdfUrl, toast]);

  const clearAllSignatures = useCallback(() => {
    setSignatures([]);
    setSelectedSignature(null);
    toast({
      title: "Signatures cleared",
      description: "All signatures have been removed.",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            PDF Signature Tool
          </h1>
          <p className="text-gray-600">
            Upload a PDF and add pixel-perfect signatures
          </p>
        </div>

        {/* Upload Section */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label
                htmlFor="pdf-upload"
                className="text-sm font-medium text-gray-700"
              >
                Upload PDF File
              </Label>
              <Input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                ref={fileInputRef}
                className="mt-1"
              />
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Choose File
            </Button>
          </div>
        </Card>

        {pdfFile && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* PDF Viewer */}
            <div className="lg:col-span-3">
              <Card className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      Page {currentPage} of {numPages}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setScale((prev) => Math.max(0.5, prev - 0.2))
                      }
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-[60px] text-center">
                      {Math.round(scale * 100)}%
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setScale((prev) => Math.min(3, prev + 0.2))
                      }
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div
                  ref={pdfContainerRef}
                  className="relative border border-gray-200 rounded-lg overflow-auto max-h-[800px]"
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  role="application"
                  aria-label="PDF document viewer"
                  tabIndex={0}
                >
                  <SimplePDFViewer
                    file={pdfUrl}
                    currentPage={currentPage}
                    scale={scale}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={onDocumentLoadError}
                    className=""
                  />

                  {/* Signature Overlays */}
                  {signatures
                    .filter((sig) => sig.pageNumber === currentPage)
                    .map((signature, index) => (
                      <button
                        type="button"
                        key={`signature-${signature.pageNumber}-${index}`}
                        className={`absolute border-2 cursor-move ${
                          selectedSignature === signature
                            ? "border-blue-500 bg-blue-50"
                            : "border-transparent hover:border-gray-300"
                        }`}
                        style={{
                          left: signature.x,
                          top: signature.y,
                          width: signature.width,
                          height: signature.height,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, signature)}
                        onClick={() => handleSignatureClick(signature)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleSignatureClick(signature);
                          }
                        }}
                        aria-label={`Signature on page ${signature.pageNumber}. Click to select, drag to move.`}
                      >
                        <img
                          src={signature.signatureData}
                          alt="Signature"
                          className="w-full h-full object-contain"
                          draggable={false}
                        />
                        {selectedSignature === signature && (
                          <>
                            <div className="absolute -top-8 left-0 flex gap-1">
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSignature(signature);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            {/* Resize handles */}
                            <button
                              type="button"
                              className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 cursor-se-resize border-0 p-0"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setIsResizing(true);
                                setResizeHandle("se");
                              }}
                              aria-label="Resize signature (southeast)"
                            />
                            <button
                              type="button"
                              className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 cursor-sw-resize border-0 p-0"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setIsResizing(true);
                                setResizeHandle("sw");
                              }}
                              aria-label="Resize signature (southwest)"
                            />
                            <button
                              type="button"
                              className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 cursor-ne-resize border-0 p-0"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setIsResizing(true);
                                setResizeHandle("ne");
                              }}
                              aria-label="Resize signature (northeast)"
                            />
                            <button
                              type="button"
                              className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 cursor-nw-resize border-0 p-0"
                              onMouseDown={(e) => {
                                e.stopPropagation();
                                setIsResizing(true);
                                setResizeHandle("nw");
                              }}
                              aria-label="Resize signature (northwest)"
                            />
                          </>
                        )}
                      </button>
                    ))}
                </div>

                {/* Page Navigation */}
                {numPages > 1 && (
                  <div className="flex justify-center gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm text-gray-600">
                      {currentPage} / {numPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(numPages, prev + 1))
                      }
                      disabled={currentPage === numPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </Card>
            </div>

            {/* Signature Panel */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4">Signatures</h3>

                {!isSigning ? (
                  <div className="space-y-3">
                    <Button
                      onClick={handleStartSigning}
                      className="w-full flex items-center gap-2"
                    >
                      <Pen className="h-4 w-4" />
                      Add Signature
                    </Button>

                    {signatures.length > 0 && (
                      <>
                        <Button
                          onClick={clearAllSignatures}
                          variant="outline"
                          className="w-full flex items-center gap-2"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Clear All
                        </Button>

                        <Button
                          onClick={handleDownload}
                          className="w-full flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <Download className="h-4 w-4" />
                          Download PDF
                        </Button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Draw your signature:
                      </Label>
                      <div className="border border-gray-300 rounded-lg mt-2">
                        <canvas
                          ref={signaturePadRef}
                          className="w-full h-32 cursor-crosshair"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={handleSaveSignature}
                        className="flex-1 flex items-center gap-2"
                      >
                        <Check className="h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        onClick={handleCancelSigning}
                        variant="outline"
                        className="flex-1 flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Signature List */}
                {signatures.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Added Signatures ({signatures.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {signatures.map((signature, index) => (
                        <button
                          type="button"
                          key={`signature-list-${signature.pageNumber}-${index}`}
                          className={`w-full p-2 border rounded cursor-pointer text-left ${
                            selectedSignature === signature
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                          onClick={() => handleSignatureClick(signature)}
                          aria-label={`Select signature on page ${signature.pageNumber}`}
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={signature.signatureData}
                              alt="Signature"
                              className="w-8 h-4 object-contain border"
                            />
                            <span className="text-xs text-gray-600">
                              Page {signature.pageNumber}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFSignaturePage;
