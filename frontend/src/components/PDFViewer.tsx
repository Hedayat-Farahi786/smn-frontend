import React, { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Set up PDF.js worker with fallback
try {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
} catch (error) {
  console.warn("PDF.js worker setup failed, using empty string:", error);
  pdfjs.GlobalWorkerOptions.workerSrc = "";
}

interface PDFViewerProps {
  file: string;
  currentPage: number;
  scale: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  className?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  file,
  currentPage,
  scale,
  onLoadSuccess,
  onLoadError,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleLoadSuccess = useCallback(
    (data: { numPages: number }) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setIsLoading(false);
      setLoadError(null);
      onLoadSuccess(data);
    },
    [onLoadSuccess, timeoutId]
  );

  const handleLoadError = useCallback(
    (error: Error) => {
      console.error("PDF loading error:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setIsLoading(false);
      setLoadError(error.message);
      onLoadError(error);
    },
    [onLoadError, timeoutId]
  );

  // Reset state when file changes
  React.useEffect(() => {
    if (file) {
      setIsLoading(true);
      setLoadError(null);
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
    }
  }, [file, timeoutId]);

  // Set up timeout for loading
  React.useEffect(() => {
    if (isLoading && file) {
      const timeout = setTimeout(() => {
        console.warn("PDF loading timeout after 10 seconds");
        setIsLoading(false);
        setLoadError("PDF loading timeout. Please try again.");
        onLoadError(new Error("PDF loading timeout"));
      }, 10000); // 10 second timeout

      setTimeoutId(timeout);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    }
  }, [isLoading, file, onLoadError]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={`flex items-center justify-center h-64 ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️</div>
          <p className="text-sm text-red-600 mb-2">Failed to load PDF</p>
          <p className="text-xs text-muted-foreground">{loadError}</p>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setLoadError(null);
            }}
            className="mt-2 px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Document
      file={file}
      onLoadSuccess={handleLoadSuccess}
      onLoadError={handleLoadError}
      className="flex justify-center"
      loading={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">
              Loading PDF document...
            </p>
          </div>
        </div>
      }
      error={
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-red-600 mb-2">Failed to load PDF</p>
            <p className="text-xs text-muted-foreground">
              Please check the file and try again
            </p>
          </div>
        </div>
      }
    >
      <Page pageNumber={currentPage} scale={scale} className="shadow-lg" />
    </Document>
  );
};

export default PDFViewer;
