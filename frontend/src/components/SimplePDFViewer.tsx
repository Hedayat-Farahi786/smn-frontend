import React, { useEffect, useRef, useState } from "react";

interface SimplePDFViewerProps {
  file: string; // URL or blob URL
  currentPage: number;
  scale: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  onPageChange?: (page: number) => void;
  className?: string;
  onPageImageRendered?: (page: number, imageDataUrl: string) => void;
}

const SimplePDFViewer: React.FC<SimplePDFViewerProps> = ({
  file,
  currentPage,
  scale,
  onLoadSuccess,
  onLoadError,
  onPageChange,
  className = "",
  onPageImageRendered,
}) => {
  const [pdfDoc, setPdfDoc] = useState<any | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pageImages, setPageImages] = useState<Record<number, string>>({});
  const containerRef = useRef<HTMLDivElement | null>(null);

  const renderPageToPng = async (doc: any, pageNumber: number, targetScale = 2) => {
    const page = await doc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: targetScale });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Cannot get canvas 2D context");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    const renderContext: any = {
      canvasContext: context,
      viewport,
    };

    await page.render(renderContext).promise;
    const dataUrl = canvas.toDataURL("image/png");
    return dataUrl;
  };

  useEffect(() => {
    let cancelled = false;
    if (!file) return;
    setLoading(true);
    setError(null);
    setPageImages({});

    (async () => {
      try {
        // dynamic import of pdfjs to avoid static type issues in build
        const pdfjs: any = await import("pdfjs-dist");
        try {
          const ver = pdfjs.version || pdfjs.default?.version || "5.4.149";
          // Use local worker first, then fallback to CDN
          // Add cache-busting parameter to ensure fresh worker file
          pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js?v=${Date.now()}`;
          console.log("PDF.js configured with worker:", pdfjs.GlobalWorkerOptions.workerSrc);
          console.log("PDF.js version:", ver);
        } catch (error) {
          console.warn("PDF.js worker configuration failed:", error);
        }

        const loadingTask = pdfjs.getDocument ? pdfjs.getDocument(file as any) : (pdfjs.default.getDocument(file as any));
        const doc = await loadingTask.promise;
        if (cancelled) return;
        setPdfDoc(doc);
        setNumPages(doc.numPages);
        onLoadSuccess({ numPages: doc.numPages });

        const firstImg = await renderPageToPng(doc, 1, Math.max(1, Math.floor(scale * 2)));
        if (cancelled) return;
        setPageImages((prev) => ({ ...prev, 1: firstImg }));
        onPageImageRendered?.(1, firstImg);

        for (let p = 2; p <= doc.numPages; p++) {
          // eslint-disable-next-line no-await-in-loop
          const img = await renderPageToPng(doc, p, Math.max(1, Math.floor(scale * 1.5)));
          if (cancelled) break;
          setPageImages((prev) => ({ ...prev, [p]: img }));
          onPageImageRendered?.(p, img);
        }

        setLoading(false);
      } catch (err: any) {
        if (cancelled) return;
        console.error("PDF load/render error:", err);
        setError(err?.message || "Failed to load PDF");
        onLoadError(err);
        setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      setPdfDoc(null);
    };
  }, [file]);

  useEffect(() => {
    let cancelled = false;
    if (!pdfDoc) return;
    if (pageImages[currentPage]) return;

    (async () => {
      try {
        const img = await renderPageToPng(pdfDoc, currentPage, Math.max(1, Math.floor(scale * 2)));
        if (cancelled) return;
        setPageImages((prev) => ({ ...prev, [currentPage]: img }));
        onPageImageRendered?.(currentPage, img);
      } catch (err) {
        console.error("Error rendering page on demand:", err);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [currentPage, pdfDoc]);

  if (!file) return null;

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white mx-auto mb-2" />
          <div className="text-sm text-neutral-600 dark:text-neutral-400">Loading PDF and generating preview...</div>
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

  return (
    <div ref={containerRef} className={`flex flex-col gap-3 ${className}`}>
      <div className="flex flex-col items-center">
        <div className="relative bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden">
          {pageImages[currentPage] ? (
            <img src={pageImages[currentPage]} alt={`Page ${currentPage}`} className="block max-w-full h-auto" />
          ) : (
            <div className="w-[600px] h-[800px] flex items-center justify-center">
              <div className="text-sm text-neutral-500">Preparing preview...</div>
            </div>
          )}

          <div className="absolute inset-0 pointer-events-none" />
        </div>

        {numPages > 1 && (
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm"
            >
              Previous
            </button>

            <div className="text-sm text-neutral-600 dark:text-neutral-400">{currentPage} / {numPages}</div>

            <button
              type="button"
              onClick={() => onPageChange?.(Math.min(numPages, currentPage + 1))}
              disabled={currentPage === numPages}
              className="px-3 py-1 border rounded text-sm"
            >
              Next
            </button>
          </div>
        )}

        {numPages > 1 && (
          <div className="mt-3 w-full overflow-x-auto">
            <div className="flex gap-2 items-start py-2">
              {Array.from({ length: numPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={`thumb-${p}`}
                  type="button"
                  onClick={() => onPageChange?.(p)}
                  className={`flex-shrink-0 border rounded ${p === currentPage ? 'border-neutral-800 dark:border-neutral-200' : 'border-neutral-200 dark:border-neutral-700'} overflow-hidden`}
                >
                  <div style={{ width: 120 }} className="bg-white dark:bg-neutral-900">
                    {pageImages[p] ? (
                      <img src={pageImages[p]} alt={`Thumb ${p}`} className="block w-full h-auto" />
                    ) : (
                      <div className="w-[120px] h-[160px] flex items-center justify-center text-xs text-neutral-400">Loading</div>
                    )}
                  </div>
                  <div className="px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400">{p}</div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimplePDFViewer;
