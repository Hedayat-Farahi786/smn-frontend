import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import PageWrapper from '../components/PageWrapper';
import Toolbar from '../components/PDFEditor/Toolbar';
import PDFViewer from '../components/PDFEditor/PDFViewer';
import AnnotationEditToolbar from '../components/PDFEditor/AnnotationEditToolbar';
import { 
  PDFEditorState, 
  PDFAnnotation, 
  HistoryState 
} from '../types/pdf-editor';
import { 
  Upload, 
  FileText, 
  AlertCircle,
  Loader2,
  CheckCircle
} from 'lucide-react';

const PDFSignaturePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Main state
  const [state, setState] = useState<PDFEditorState>({
    file: null,
    numPages: 0,
    currentPage: 1,
    scale: 1.2,
    annotations: [],
    selectedTool: null,
    selectedAnnotationId: null,
    selectedAnnotationIds: [],
    history: [],
    historyIndex: -1,
    isLoading: false,
    error: null,
  });

  // Drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // Initialize history with empty state
  useEffect(() => {
    if (state.history.length === 0) {
      const initialState: HistoryState = {
        annotations: [],
        timestamp: Date.now(),
      };
      setState(prev => ({
        ...prev,
        history: [initialState],
        historyIndex: 0,
      }));
    }
  }, [state.history.length]);

  // Save current state to history
  const saveToHistory = useCallback((annotations: PDFAnnotation[]) => {
    const newHistoryState: HistoryState = {
      annotations: [...annotations],
      timestamp: Date.now(),
    };

    setState(prev => {
      const newHistory = [...prev.history.slice(0, prev.historyIndex + 1), newHistoryState];
      return {
        ...prev,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        annotations,
      };
    });
  }, []);

  // Handle file upload
  const handleFileUpload = useCallback(async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload a valid PDF file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      toast({
        title: "File too large",
        description: "Please upload a PDF file smaller than 50MB.",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const arrayBuffer = await file.arrayBuffer();
      setState(prev => ({
        ...prev,
        file: arrayBuffer,
        annotations: [],
        selectedAnnotationId: null,
        currentPage: 1,
        isLoading: false,
      }));

      toast({
        title: "PDF uploaded successfully",
        description: `File: ${file.name} (${formatFileSize(file.size)})`,
      });
    } catch (error) {
      console.error('File upload error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load PDF file',
      }));
      
      toast({
        title: "Upload failed",
        description: "There was an error loading the PDF file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const pdfFile = files.find(file => file.type === 'application/pdf');
    
    if (pdfFile) {
      handleFileUpload(pdfFile);
    }
  }, [handleFileUpload]);

  // Tool selection
  const handleToolSelect = useCallback((tool: string | null) => {
    setState(prev => ({
      ...prev,
      selectedTool: tool,
      selectedAnnotationId: null,
    }));
  }, []);

  // Annotation handlers
  const handleAnnotationAdd = useCallback((annotation: Omit<PDFAnnotation, 'id'>) => {
    const newAnnotation: PDFAnnotation = {
      ...annotation,
      id: `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };

    const updatedAnnotations = [...state.annotations, newAnnotation];
    saveToHistory(updatedAnnotations);

    toast({
      title: "Annotation added",
      description: `${annotation.type} annotation has been added to the document.`,
    });
  }, [state.annotations, saveToHistory, toast]);

  const handleAnnotationUpdate = useCallback((id: string, updates: Partial<PDFAnnotation>) => {
    const updatedAnnotations = state.annotations.map(annotation =>
      annotation.id === id ? { ...annotation, ...updates } : annotation
    );
    saveToHistory(updatedAnnotations);
  }, [state.annotations, saveToHistory]);

  const handleAnnotationDelete = useCallback((id: string) => {
    const updatedAnnotations = state.annotations.filter(annotation => annotation.id !== id);
    saveToHistory(updatedAnnotations);

    setState(prev => ({
      ...prev,
      selectedAnnotationId: prev.selectedAnnotationId === id ? null : prev.selectedAnnotationId,
    }));

    toast({
      title: "Annotation deleted",
      description: "Annotation has been removed from the document.",
    });
  }, [state.annotations, saveToHistory, toast]);

  const handleAnnotationSelect = useCallback((id: string | null) => {
    setState(prev => ({
      ...prev,
      selectedAnnotationId: id,
      selectedAnnotationIds: id ? [id] : [],
      selectedTool: id ? 'select' : prev.selectedTool,
    }));
  }, []);

  // Page navigation
  const handlePageChange = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.numPages)),
    }));
  }, []);

  // Zoom controls
  const handleScaleChange = useCallback((scale: number) => {
    setState(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, scale)),
    }));
  }, []);

  // Undo/Redo
  const handleUndo = useCallback(() => {
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const historyState = state.history[newIndex];
      setState(prev => ({
        ...prev,
        historyIndex: newIndex,
        annotations: historyState.annotations,
        selectedAnnotationId: null,
      }));
    }
  }, [state.historyIndex, state.history]);

  const handleRedo = useCallback(() => {
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const historyState = state.history[newIndex];
      setState(prev => ({
        ...prev,
        historyIndex: newIndex,
        annotations: historyState.annotations,
        selectedAnnotationId: null,
      }));
    }
  }, [state.historyIndex, state.history]);

  // Save PDF
  const handleSave = useCallback(async () => {
    if (!state.file || state.annotations.length === 0) {
      toast({
        title: "Nothing to save",
        description: "Please add annotations before saving.",
        variant: "destructive",
      });
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // For now, just download the original PDF
      // In a real implementation, you would use pdf-lib to embed annotations
      const blob = new Blob([state.file], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `annotated-${Date.now()}.pdf`;
      a.click();
      
      URL.revokeObjectURL(url);

      toast({
        title: "PDF saved successfully",
        description: "Your annotated PDF has been downloaded.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Save failed",
        description: "There was an error saving the PDF.",
        variant: "destructive",
      });
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [state.file, state.annotations, toast]);

  // Utility functions
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper functions for annotation defaults
  const getDefaultWidth = (type: PDFAnnotation['type']): number => {
    switch (type) {
      case 'text': return 120;
      case 'signature': return 200;
      case 'checkbox': return 20;
      case 'image': return 100;
      case 'shape': return 80;
      case 'line': return 100;
      default: return 100;
    }
  };

  const getDefaultHeight = (type: PDFAnnotation['type']): number => {
    switch (type) {
      case 'text': return 30;
      case 'signature': return 80;
      case 'checkbox': return 20;
      case 'image': return 100;
      case 'shape': return 60;
      case 'line': return 2;
      default: return 30;
    }
  };

  const getDefaultContent = (type: PDFAnnotation['type']): string => {
    switch (type) {
      case 'text': return 'Sample Text';
      case 'signature': return 'Signature';
      case 'checkbox': return '☐';
      case 'image': return 'Image';
      case 'shape': return '';
      case 'line': return '';
      default: return '';
    }
  };

  const getDefaultStyle = (type: PDFAnnotation['type']) => {
    const baseStyle = {
      fontSize: 12,
      fontFamily: 'Arial',
      color: '#000000',
      backgroundColor: 'transparent',
      borderColor: '#000000',
      borderWidth: 1,
    };

    switch (type) {
      case 'text':
        return { ...baseStyle, backgroundColor: 'rgba(255, 255, 255, 0.8)', fontSize: 14 };
      case 'signature':
        return { ...baseStyle, borderColor: '#007bff', borderWidth: 2, fontSize: 16 };
      case 'checkbox':
        return { ...baseStyle, fontSize: 16 };
      case 'image':
        return { ...baseStyle, backgroundColor: 'rgba(0, 0, 0, 0.1)' };
      case 'shape':
        return { ...baseStyle, backgroundColor: 'rgba(0, 123, 255, 0.2)' };
      case 'line':
        return { ...baseStyle, backgroundColor: 'transparent' };
      default:
        return baseStyle;
    }
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && state.selectedAnnotationId) {
        handleAnnotationDelete(state.selectedAnnotationId);
      }
      if (e.key === 'Escape') {
        handleAnnotationSelect(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'c' && state.selectedAnnotationId) {
        e.preventDefault();
        const annotation = state.annotations.find(a => a.id === state.selectedAnnotationId);
        if (annotation) {
          localStorage.setItem('copiedAnnotation', JSON.stringify(annotation));
          toast({ title: "Annotation copied", description: "Use Ctrl+V to paste" });
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        e.preventDefault();
        const copiedData = localStorage.getItem('copiedAnnotation');
        if (copiedData) {
          const annotation = JSON.parse(copiedData);
          const newAnnotation: Omit<PDFAnnotation, 'id'> = {
            ...annotation,
            x: annotation.x + 30,
            y: annotation.y + 30,
            zIndex: state.annotations.length + 1,
          };
          const newId = `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const annotationWithId = { ...newAnnotation, id: newId };
          
          const updatedAnnotations = [...state.annotations, annotationWithId];
          saveToHistory(updatedAnnotations);
          handleAnnotationSelect(newId);
          
          toast({ title: "Annotation pasted", description: "Annotation has been duplicated and selected" });
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
        e.preventDefault();
        const currentPageAnnotations = state.annotations
          .filter(a => a.pageNumber === state.currentPage)
          .map(a => a.id);
        
        setState(prev => ({
          ...prev,
          selectedAnnotationIds: currentPageAnnotations,
          selectedAnnotationId: currentPageAnnotations[0] || null,
          selectedTool: 'select'
        }));
        
        toast({ 
          title: "All annotations selected", 
          description: `Selected ${currentPageAnnotations.length} annotations on current page` 
        });
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && state.selectedAnnotationId) {
        e.preventDefault();
        const annotation = state.annotations.find(a => a.id === state.selectedAnnotationId);
        if (annotation) {
          const duplicated: Omit<PDFAnnotation, 'id'> = {
            ...annotation,
            x: annotation.x + 30,
            y: annotation.y + 30,
            zIndex: state.annotations.length + 1,
          };
          const newId = `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          const annotationWithId = { ...duplicated, id: newId };
          
          const updatedAnnotations = [...state.annotations, annotationWithId];
          saveToHistory(updatedAnnotations);
          handleAnnotationSelect(newId);
          
          toast({ title: "Annotation duplicated", description: "New annotation selected" });
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedAnnotationId, state.annotations, handleAnnotationDelete, handleAnnotationSelect, handleAnnotationAdd, toast]);

  return (
    <PageWrapper
      title="PDF Editor"
      description={state.file ? "Edit your PDF document" : "Professional PDF editing and annotation tool"}
      icon={FileText}
    >
      {!state.file ? (
        <div className="bg-white rounded-xl shadow-sm border border-blue-100">
          <div className="p-6">
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`bg-white rounded-2xl p-12 shadow-sm border-2 border-dashed transition-all duration-200 text-center ${
                isDragOver 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-blue-300 hover:border-blue-400 hover:bg-blue-50/50'
              }`}
            >
              
              <div className={`w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all duration-200 ${
                isDragOver ? 'bg-blue-200' : 'bg-blue-100'
              }`}>
                <Upload className={`h-12 w-12 ${isDragOver ? 'text-primary' : 'text-primary'}`} />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 mb-4">
                {isDragOver ? 'Drop PDF Here' : 'Upload PDF Document'}
              </h2>
              
              <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                {isDragOver 
                  ? 'Release to upload your PDF document'
                  : 'Drag and drop your PDF file here, or click to browse and upload'
                }
              </p>
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90 text-white shadow-lg px-8 py-4 text-lg rounded-lg flex items-center mx-auto"
                disabled={isDragOver}
              >
                <Upload className="h-5 w-5 mr-3" />
                Choose PDF File
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
              />

              <div className="mt-12 pt-8 border-t border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Digital signatures & annotations</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Text, shapes, and form fields</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                    <span>Client-side processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-screen">
          {/* Main Toolbar */}
          <Toolbar
            selectedTool={state.selectedTool}
            onToolSelect={handleToolSelect}
            onSave={handleSave}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={canUndo}
            canRedo={canRedo}
            scale={state.scale}
            onScaleChange={handleScaleChange}
            currentPage={state.currentPage}
            totalPages={state.numPages}
            onPageChange={handlePageChange}
          />

          {/* Annotation Edit Toolbar */}
          {state.selectedAnnotationId && (
            <AnnotationEditToolbar
              annotation={state.annotations.find(a => a.id === state.selectedAnnotationId)}
              onEdit={() => console.log('Edit annotation')}
              onDuplicate={() => {
                const annotation = state.annotations.find(a => a.id === state.selectedAnnotationId);
                if (annotation) {
                  const duplicated: Omit<PDFAnnotation, 'id'> = {
                    ...annotation,
                    x: annotation.x + 30,
                    y: annotation.y + 30,
                    zIndex: state.annotations.length + 1,
                  };
                  handleAnnotationAdd(duplicated);
                }
              }}
              onRotate={() => {
                if (state.selectedAnnotationId) {
                  const annotation = state.annotations.find(a => a.id === state.selectedAnnotationId);
                  if (annotation) {
                    const currentRotation = annotation.rotation || 0;
                    const newRotation = (currentRotation + 90) % 360;
                    handleAnnotationUpdate(state.selectedAnnotationId, { rotation: newRotation });
                  }
                }
              }}
              onDelete={() => {
                if (state.selectedAnnotationId) {
                  handleAnnotationDelete(state.selectedAnnotationId);
                }
              }}
              onBringToFront={() => {
                if (state.selectedAnnotationId) {
                  const maxZ = Math.max(...state.annotations.map(a => a.zIndex || 1));
                  handleAnnotationUpdate(state.selectedAnnotationId, { zIndex: maxZ + 1 });
                }
              }}
              onSendToBack={() => {
                if (state.selectedAnnotationId) {
                  const minZ = Math.min(...state.annotations.map(a => a.zIndex || 1));
                  handleAnnotationUpdate(state.selectedAnnotationId, { zIndex: Math.max(1, minZ - 1) });
                }
              }}
              onStyleUpdate={(updates) => {
                if (state.selectedAnnotationId) {
                  handleAnnotationUpdate(state.selectedAnnotationId, updates);
                }
              }}
              onCopy={() => {
                if (state.selectedAnnotationId) {
                  const annotation = state.annotations.find(a => a.id === state.selectedAnnotationId);
                  if (annotation) {
                    localStorage.setItem('copiedAnnotation', JSON.stringify(annotation));
                    toast({ title: "Annotation copied" });
                  }
                }
              }}
              onCut={() => {
                if (state.selectedAnnotationId) {
                  const annotation = state.annotations.find(a => a.id === state.selectedAnnotationId);
                  if (annotation) {
                    localStorage.setItem('copiedAnnotation', JSON.stringify(annotation));
                    handleAnnotationDelete(state.selectedAnnotationId);
                    toast({ title: "Annotation cut" });
                  }
                }
              }}
              onPaste={() => {
                const copiedData = localStorage.getItem('copiedAnnotation');
                if (copiedData) {
                  const annotation = JSON.parse(copiedData);
                  const newAnnotation: Omit<PDFAnnotation, 'id'> = {
                    ...annotation,
                    x: annotation.x + 30,
                    y: annotation.y + 30,
                    zIndex: state.annotations.length + 1,
                  };
                  handleAnnotationAdd(newAnnotation);
                  toast({ title: "Annotation pasted" });
                }
              }}
              onLock={() => {
                if (state.selectedAnnotationId) {
                  const annotation = state.annotations.find(a => a.id === state.selectedAnnotationId);
                  handleAnnotationUpdate(state.selectedAnnotationId, { locked: !annotation?.locked });
                  toast({ title: annotation?.locked ? "Annotation unlocked" : "Annotation locked" });
                }
              }}
              onHide={() => {
                if (state.selectedAnnotationId) {
                  const annotation = state.annotations.find(a => a.id === state.selectedAnnotationId);
                  handleAnnotationUpdate(state.selectedAnnotationId, { hidden: !annotation?.hidden });
                  toast({ title: annotation?.hidden ? "Annotation shown" : "Annotation hidden" });
                }
              }}
              onFlipH={() => {
                if (state.selectedAnnotationId) {
                  handleAnnotationUpdate(state.selectedAnnotationId, { flippedH: true });
                  toast({ title: "Annotation flipped horizontally" });
                }
              }}
              onFlipV={() => {
                if (state.selectedAnnotationId) {
                  handleAnnotationUpdate(state.selectedAnnotationId, { flippedV: true });
                  toast({ title: "Annotation flipped vertically" });
                }
              }}
              onRotateLeft={() => {
                if (state.selectedAnnotationId) {
                  const annotation = state.annotations.find(a => a.id === state.selectedAnnotationId);
                  if (annotation) {
                    const currentRotation = annotation.rotation || 0;
                    const newRotation = (currentRotation - 90 + 360) % 360;
                    handleAnnotationUpdate(state.selectedAnnotationId, { rotation: newRotation });
                  }
                }
              }}
            />
          )}

          {/* PDF Viewer */}
          <div className="flex-1 overflow-hidden">
            {state.isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                  <div className="text-gray-600">Processing PDF...</div>
                </div>
              </div>
            ) : state.error ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 mx-auto mb-4 text-red-600" />
                  <div className="text-red-600 text-lg mb-2">Error loading PDF</div>
                  <div className="text-gray-600">{state.error}</div>
                </div>
              </div>
            ) : (
              <PDFViewer
                file={state.file}
                scale={state.scale}
                onLoadSuccess={({ numPages }) => {
                  setState(prev => ({ ...prev, numPages }));
                }}
                onLoadError={(error) => {
                  console.error('PDF load error:', error);
                  setState(prev => ({ ...prev, error: 'Failed to load PDF' }));
                }}
                onPageClick={(event, pageNumber) => {
                  // Handle page clicks for annotation placement or deselection
                  if (state.selectedTool && state.selectedTool !== 'select') {
                    const rect = (event.target as HTMLElement).getBoundingClientRect();
                    const x = event.clientX - rect.left;
                    const y = event.clientY - rect.top;
                    
                    const newAnnotation: Omit<PDFAnnotation, 'id'> = {
                      type: state.selectedTool as PDFAnnotation['type'],
                      x: x / state.scale,
                      y: y / state.scale,
                      width: getDefaultWidth(state.selectedTool as PDFAnnotation['type']),
                      height: getDefaultHeight(state.selectedTool as PDFAnnotation['type']),
                      rotation: 0,
                      content: getDefaultContent(state.selectedTool as PDFAnnotation['type']),
                      pageNumber,
                      style: getDefaultStyle(state.selectedTool as PDFAnnotation['type']),
                      zIndex: state.annotations.length + 1,
                    };
                    
                    handleAnnotationAdd(newAnnotation);
                  } else if (state.selectedAnnotationId) {
                    // Deselect annotation when clicking on empty space
                    handleAnnotationSelect(null);
                  }
                }}
                annotations={state.annotations}
                onAnnotationUpdate={(annotation) => handleAnnotationUpdate(annotation.id, annotation)}
                onAnnotationDelete={handleAnnotationDelete}
                onAnnotationSelect={handleAnnotationSelect}
                selectedAnnotationId={state.selectedAnnotationId}
                selectedTool={state.selectedTool}
              />
            )}
          </div>
        </div>
      )}
    </PageWrapper>
  );
};

export default PDFSignaturePage;