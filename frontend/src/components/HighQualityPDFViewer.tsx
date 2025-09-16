import React, { useEffect, useRef, useState, useCallback } from "react";
import { configurePDFJS } from "../utils/pdfjsConfig";
import SimplePDFViewerFallback from "./SimplePDFViewerFallback";

interface HighQualityPDFViewerProps {
  file: string; // URL or blob URL
  currentPage: number;
  scale: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  onPageChange?: (page: number) => void;
  className?: string;
  onPageImageRendered?: (page: number, imageDataUrl: string, dimensions: { width: number; height: number }) => void;
  onImageClick?: (event: React.MouseEvent<HTMLImageElement>, pageNumber: number, imageDimensions: { width: number; height: number }) => void;
  imageRef?: React.RefObject<HTMLImageElement | null>;
  showAllPages?: boolean; // New prop to show all pages in column
  onAllPagesRendered?: (pageImages: Record<number, PageImageData>) => void;
  onAddBlankPage?: (insertAfterPage: number) => void;
  blankPages?: Record<number, { width: number; height: number }>;
  imageRefs?: Record<number, React.RefObject<HTMLImageElement | null>>;
}

interface PageImageData {
  dataUrl: string;
  dimensions: { width: number; height: number };
  scale: number;
}

const HighQualityPDFViewer: React.FC<HighQualityPDFViewerProps> = ({
  file,
  currentPage,
  scale,
  onLoadSuccess,
  onLoadError,
  onPageChange,
  className = "",
  onPageImageRendered,
  onImageClick,
  imageRef,
  showAllPages = false,
  onAllPagesRendered,
  onAddBlankPage,
  blankPages = {},
  imageRefs = {},
}) => {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<Record<number, PageImageData>>({});
  const [renderingProgress, setRenderingProgress] = useState<number>(0);
  const [useFallback, setUseFallback] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // In development, we can force fallback mode for testing
  const forceFallback = process.env.NODE_ENV === 'development' && 
    (window.location.search.includes('fallback=true') || 
     localStorage.getItem('pdf-fallback') === 'true');

  // Global error handler for PDF.js worker issues
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      if (event.message && (
          event.message.includes('pdf.worker') ||
          event.message.includes('pdfjs') ||
          event.message.includes('PDF.js') ||
          event.message.includes('Failed to fetch dynamically imported module')
        )) {
        console.warn("PDF.js worker error detected globally, switching to fallback:", event.message);
        setUseFallback(true);
        setLoading(false);
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (event.reason && (
          event.reason.message?.includes('pdf.worker') ||
          event.reason.message?.includes('pdfjs') ||
          event.reason.message?.includes('PDF.js') ||
          event.reason.message?.includes('Failed to fetch dynamically imported module')
        )) {
        console.warn("PDF.js promise rejection detected, switching to fallback:", event.reason);
        setUseFallback(true);
        setLoading(false);
      }
    };

    window.addEventListener('error', handleGlobalError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  // High-quality rendering with configurable DPI and performance optimization
  const renderPageToHighQualityPng = async (
    doc: any, 
    pageNumber: number, 
    targetScale: number = 2.5, // Optimized scale for balance between quality and performance
    dpi: number = 300 // High DPI for crisp images
  ): Promise<PageImageData> => {
    const page = await doc.getPage(pageNumber);
    
    // Calculate scale based on DPI (72 DPI is default PDF DPI)
    const dpiScale = dpi / 72;
    const finalScale = targetScale * dpiScale;
    
    const viewport = page.getViewport({ scale: finalScale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    
    if (!context) throw new Error("Cannot get canvas 2D context");
    
    // Set canvas size with high resolution
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    
    // Enable high-quality rendering
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    
    const renderContext: any = {
      canvasContext: context,
      viewport,
      intent: 'display', // Optimize for display
    };

    await page.render(renderContext).promise;
    
    // Convert to high-quality PNG
    const dataUrl = canvas.toDataURL("image/png", 1.0); // Maximum quality
    
    return {
      dataUrl,
      dimensions: { width: canvas.width, height: canvas.height },
      scale: finalScale
    };
  };

  // Load and render all pages with high quality
  useEffect(() => {
    let cancelled = false;
    if (!file) return;
    
    setLoading(true);
    setError(null);
    setPageImages({});
    setRenderingProgress(0);

    (async () => {
      try {
        // Configure PDF.js with robust worker loading
        let pdfjs;
        try {
          pdfjs = await configurePDFJS();
        } catch (configError) {
          console.warn("PDF.js configuration failed, switching to fallback:", configError);
          setUseFallback(true);
          setLoading(false);
          return;
        }

        // Add error handling for document loading
        const loadingTask = pdfjs.getDocument ? pdfjs.getDocument(file as any) : (pdfjs.default.getDocument(file as any));
        
        // Add timeout to document loading
        const docPromise = loadingTask.promise;
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error("PDF loading timeout")), 10000);
        });
        
        const doc = await Promise.race([docPromise, timeoutPromise]) as any;
        
        if (cancelled) return;
        
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        onLoadSuccess({ numPages: doc.numPages });

        // Render all pages with high quality and performance optimization
        const totalPages = doc.numPages;
        const newPageImages: Record<number, PageImageData> = {};
        
        // Render pages in batches to avoid blocking the UI
        const batchSize = 3;
        for (let batchStart = 1; batchStart <= totalPages; batchStart += batchSize) {
          if (cancelled) break;
          
          const batchEnd = Math.min(batchStart + batchSize - 1, totalPages);
          const batchPromises = [];
          
          for (let p = batchStart; p <= batchEnd; p++) {
            batchPromises.push(
              renderPageToHighQualityPng(doc, p, scale, 300)
                .then(pageData => ({ pageNumber: p, pageData }))
                .catch(err => {
                  console.error(`Error rendering page ${p}:`, err);
                  return null;
                })
            );
          }
          
          // Wait for batch to complete
          const batchResults = await Promise.all(batchPromises);
          
          // Process batch results
          for (const result of batchResults) {
            if (result && !cancelled) {
              newPageImages[result.pageNumber] = result.pageData;
              
              // Update progress
              const progress = (result.pageNumber / totalPages) * 100;
              setRenderingProgress(progress);
              
              // Notify parent component
              onPageImageRendered?.(result.pageNumber, result.pageData.dataUrl, result.pageData.dimensions);
              
              // Update state incrementally for better UX
              setPageImages(prev => ({ ...prev, [result.pageNumber]: result.pageData }));
            }
          }
          
          // Small delay between batches to keep UI responsive
          if (batchEnd < totalPages && !cancelled) {
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        }
        
        if (!cancelled) {
          setLoading(false);
          setRenderingProgress(100);
          
          // Notify parent that all pages are rendered
          if (showAllPages && onAllPagesRendered) {
            onAllPagesRendered(newPageImages);
          }
        }
        
      } catch (err: any) {
        if (cancelled) return;
        console.error("PDF load/render error:", err);
        
        // Check if it's a worker-related error or any PDF.js related error
        if (err?.message?.includes('worker') || 
            err?.message?.includes('fetch') || 
            err?.message?.includes('pdf') ||
            err?.message?.includes('PDF') ||
            err?.message?.includes('timeout')) {
          console.warn("PDF.js error detected, switching to fallback mode:", err.message);
          setUseFallback(true);
          setLoading(false);
          return;
        }
        
        setError(err?.message || "Failed to load PDF");
        onLoadError(err);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [file, scale]);

  const handleImageClick = useCallback((event: React.MouseEvent<HTMLImageElement>, pageNumber: number) => {
    const imageData = pageImages[pageNumber];
    if (imageData && onImageClick) {
      onImageClick(event, pageNumber, imageData.dimensions);
    }
  }, [pageImages, onImageClick]);

  if (!file) return null;

  // Use fallback viewer if PDF.js worker fails or forced fallback
  if (useFallback || forceFallback) {
    return (
      <SimplePDFViewerFallback
        file={file}
        fileName="document.pdf"
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        className={className}
      />
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-2" />
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Converting PDF to high-quality images...
          </div>
          <div className="text-xs text-neutral-500 mt-1">
            {Math.round(renderingProgress)}% complete
          </div>
          <div className="w-48 bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${renderingProgress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-red-600 mb-2">Failed to load PDF</p>
          <p className="text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  // Show all pages in column layout
  if (showAllPages) {
    // Combine all pages (PDF pages + blank pages) and sort them
    const allPageNumbers = new Set<number>();
    
    // Add PDF pages
    Array.from({ length: numPages }, (_, i) => i + 1).forEach(pageNum => allPageNumbers.add(pageNum));
    
    // Add blank pages
    Object.keys(blankPages).forEach(pageNum => allPageNumbers.add(parseInt(pageNum)));
    
    const sortedPageNumbers = Array.from(allPageNumbers).sort((a, b) => a - b);

    return (
      <div ref={containerRef} className={`flex flex-col gap-4 ${className}`}>
        {sortedPageNumbers.map((pageNum) => {
          const isBlankPage = blankPages[pageNum];
          
          return (
            <div key={`page-${pageNum}`} className="relative">
              {/* Page number and add blank page button in same row */}
              <div className="mb-2 flex items-center justify-between">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                  Page {pageNum} {isBlankPage ? '(Blank)' : ''}
                </span>
                
                {/* Add blank page button - small and outlined */}
                {onAddBlankPage && (
                  <button
                    onClick={() => onAddBlankPage(pageNum)}
                    className="px-2 py-1 text-xs border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors flex items-center gap-1"
                    title={`Add blank page after page ${pageNum}`}
                  >
                    <span className="text-sm">+</span>
                    Add Page
                  </button>
                )}
              </div>
              
              {/* Page image or blank page */}
              <div className="relative bg-white shadow-lg border border-gray-200 rounded-lg overflow-hidden">
                {isBlankPage ? (
                  // Blank page - white rectangle
                  <div 
                    className="bg-white border-2 border-dashed border-gray-300 cursor-crosshair flex items-center justify-center"
                    style={{
                      width: '100%',
                      height: `${(isBlankPage.height / isBlankPage.width) * 600}px`,
                      maxWidth: '600px',
                      margin: '0 auto'
                    }}
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * isBlankPage.width;
                      const y = ((e.clientY - rect.top) / rect.height) * isBlankPage.height;
                      onImageClick?.(e as any, pageNum, isBlankPage);
                    }}
                  >
                    <div className="text-gray-400 text-sm">Blank Page - Click to add elements</div>
                  </div>
                ) : (
                  // PDF page
                  pageImages[pageNum] ? (
                    <img 
                      ref={imageRefs[pageNum]}
                      src={pageImages[pageNum].dataUrl} 
                      alt={`Page ${pageNum}`} 
                      className="block w-full h-auto cursor-crosshair"
                      onClick={(e) => handleImageClick(e, pageNum)}
                      style={{
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                      onLoad={() => {
                        console.log(`Image loaded for page ${pageNum}, ref:`, imageRefs[pageNum]);
                      }}
                    />
                  ) : (
                    <div className="w-full h-[800px] flex items-center justify-center bg-gray-50">
                      <div className="text-sm text-gray-500">Loading page {pageNum}...</div>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}

        {/* Add blank page button at the end */}
        {onAddBlankPage && (
          <div className="flex justify-center">
            <button
              onClick={() => onAddBlankPage(Math.max(...sortedPageNumbers, 0))}
              className="px-3 py-2 text-sm border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <span className="text-sm">+</span>
              Add Blank Page at End
            </button>
          </div>
        )}
      </div>
    );
  }

  // Original single page view
  return (
    <div ref={containerRef} className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col items-center">
        {/* Main page display */}
        <div className="relative bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden shadow-lg">
          {pageImages[currentPage] ? (
            <img 
              ref={imageRef}
              src={pageImages[currentPage].dataUrl} 
              alt={`Page ${currentPage}`} 
              className="block max-w-full h-auto cursor-crosshair"
              onClick={(e) => handleImageClick(e, currentPage)}
              style={{
                maxHeight: '80vh',
                objectFit: 'contain'
              }}
            />
          ) : (
            <div className="w-[600px] h-[800px] flex items-center justify-center">
              <div className="text-sm text-neutral-500">Preparing high-quality preview...</div>
            </div>
          )}
        </div>

        {/* Page navigation */}
        {numPages > 1 && (
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              {currentPage} / {numPages}
            </div>

            <button
              type="button"
              onClick={() => onPageChange?.(Math.min(numPages, currentPage + 1))}
              disabled={currentPage === numPages}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

        {/* Thumbnail navigation */}
        {numPages > 1 && (
          <div className="mt-3 w-full overflow-x-auto">
            <div className="flex gap-2 items-start py-2">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={`thumb-${p}`}
                  type="button"
                  onClick={() => onPageChange?.(p)}
                  className={`flex-shrink-0 border rounded overflow-hidden transition-all ${
                    p === currentPage 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div style={{ width: 120 }} className="bg-white dark:bg-neutral-900">
                    {pageImages[p] ? (
                      <img 
                        src={pageImages[p].dataUrl} 
                        alt={`Thumb ${p}`} 
                        className="block w-full h-auto" 
                      />
                    ) : (
                      <div className="w-[120px] h-[160px] flex items-center justify-center text-xs text-neutral-400">
                        Loading...
                      </div>
                    )}
                  </div>
                  <div className="px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400">
                    {p}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HighQualityPDFViewer;
