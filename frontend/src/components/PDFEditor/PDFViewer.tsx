import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFViewerProps } from '../../types/pdf-editor';
import AnnotationLayer from './AnnotationLayer';
import { initializeWorker } from '../../utils/workerConfig';

// Import required CSS for react-pdf
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  scale = 1.0,
  onLoadSuccess,
  onLoadError,
  onPageClick,
  annotations = [],
  onAnnotationUpdate,
  onAnnotationDelete,
  onAnnotationSelect,
  selectedAnnotationId,
  selectedAnnotationIds = [],
  selectedTool,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [workerInitialized, setWorkerInitialized] = useState(false);

  // Configure PDF.js worker on component mount
  useEffect(() => {
    const initWorker = async () => {
      try {
        const success = await initializeWorker();
        setWorkerInitialized(success);
        if (success) {
          console.log("✅ PDF.js worker initialized successfully");
        } else {
          console.warn("⚠️ PDF.js worker initialization failed, but continuing...");
        }
      } catch (error) {
        console.error("❌ PDF.js worker initialization error:", error);
        setWorkerInitialized(false);
      }
    };

    initWorker();
  }, []);

  const handlePageClick = useCallback((event: React.MouseEvent, pageNumber: number) => {
    if (onPageClick) {
      onPageClick(event, pageNumber);
    }
  }, [onPageClick]);

  const handleLoadSuccess = useCallback((data: { numPages: number }) => {
    if (onLoadSuccess) {
      onLoadSuccess(data);
    }
  }, [onLoadSuccess]);

  const handleLoadError = useCallback((error: Error) => {
    console.error('PDF load error:', error);
    if (onLoadError) {
      onLoadError(error);
    }
  }, [onLoadError]);

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

  if (!file) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
        <div className="text-center">
          <div className="text-gray-500 text-lg mb-2">No PDF loaded</div>
          <div className="text-gray-400 text-sm">Upload a PDF file to get started</div>
        </div>
      </div>
    );
  }

  if (!workerInitialized) {
    return (
      <div className="flex items-center justify-center h-96 bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-blue-600 text-lg mb-2">Initializing PDF.js...</div>
          <div className="text-blue-500 text-sm">Setting up PDF rendering engine</div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-auto bg-gray-100">
      <Document
        file={file}
        onLoadSuccess={handleLoadSuccess}
        onLoadError={handleLoadError}
        loading={
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <div className="text-gray-600">Loading PDF...</div>
            </div>
          </div>
        }
        error={
          <div className="flex items-center justify-center h-96 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-center">
              <div className="text-red-600 text-lg mb-2">Failed to load PDF</div>
              <div className="text-red-500 text-sm mb-4">Please check if the file is a valid PDF</div>
              <div className="text-gray-600 text-xs">
                <div>PDF.js Worker: {pdfjs.GlobalWorkerOptions.workerSrc}</div>
                <div>Version: {pdfjs.version}</div>
                <div>Worker Initialized: {workerInitialized ? 'Yes' : 'No'}</div>
                <div>If you see version mismatch errors, the worker may not be compatible.</div>
              </div>
            </div>
          </div>
        }
      >
        {({ numPages }) => (
          <div className="w-full">
            {Array.from(new Array(numPages), (_, index) => {
              const pageNumber = index + 1;
              const pageAnnotations = annotations.filter(ann => ann.pageNumber === pageNumber);
              
              return (
                <div
                  key={`page_${pageNumber}`}
                  ref={el => pageRefs.current[pageNumber] = el}
                  className="relative bg-white w-full"
                >
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Page {pageNumber} of {numPages}</span>
                  </div>
                  <div className="w-full">
                    <Page
                      pageNumber={pageNumber}
                      width={containerRef.current?.clientWidth || window.innerWidth}
                      className="w-full block"
                      onClick={(event) => handlePageClick(event, pageNumber)}
                    />
                  </div>
                  
                  {/* Annotation Layer for this page */}
                  <div
                    className="absolute inset-0 pointer-events-auto"
                    onClick={(event) => {
                      if (selectedTool && selectedTool !== 'select') {
                        const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
                        const currentScale = containerRef.current?.clientWidth ? containerRef.current.clientWidth / 612 : 1.0;
                        const x = (event.clientX - rect.left) / currentScale;
                        const y = (event.clientY - rect.top) / currentScale;
                        
                        const newAnnotation: Omit<PDFAnnotation, 'id'> = {
                          type: selectedTool as PDFAnnotation['type'],
                          x,
                          y,
                          width: getDefaultWidth(selectedTool as PDFAnnotation['type']),
                          height: getDefaultHeight(selectedTool as PDFAnnotation['type']),
                          content: getDefaultContent(selectedTool as PDFAnnotation['type']),
                          pageNumber,
                          style: getDefaultStyle(selectedTool as PDFAnnotation['type']),
                          zIndex: pageAnnotations.length + 1,
                        };
                        
                        // Call the parent's onPageClick with the annotation data
                        if (onPageClick) {
                          onPageClick(event, pageNumber);
                        }
                      }
                    }}
                    style={{ zIndex: 10 }}
                  >
                    <AnnotationLayer
                      annotations={pageAnnotations}
                      selectedTool={selectedTool}
                      onAnnotationAdd={(annotation) => {
                        // This will be handled by the parent component
                        console.log('Add annotation:', annotation);
                      }}
                      onAnnotationUpdate={(id, updates) => {
                        if (onAnnotationUpdate) {
                          onAnnotationUpdate({ ...updates, id } as any);
                        }
                      }}
                      onAnnotationDelete={(id) => {
                        if (onAnnotationDelete) {
                          onAnnotationDelete(id);
                        }
                      }}
                      onAnnotationSelect={onAnnotationSelect}
                      selectedAnnotationId={selectedAnnotationId}
                      selectedAnnotationIds={selectedAnnotationIds}
                      scale={containerRef.current?.clientWidth ? containerRef.current.clientWidth / 612 : 1.0}
                      pageNumber={pageNumber}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Document>
    </div>
  );
};

export default PDFViewer;
