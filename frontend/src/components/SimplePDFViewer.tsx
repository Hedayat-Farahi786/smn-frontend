import React, { useState, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";

// Disable worker completely to avoid CORS issues
pdfjs.GlobalWorkerOptions.workerSrc = "";

interface SimplePDFViewerProps {
  file: string;
  currentPage: number;
  scale: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  className?: string;
}

const SimplePDFViewer: React.FC<SimplePDFViewerProps> = ({
  file,
  currentPage,
  scale,
  onLoadSuccess,
  onLoadError,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleLoadSuccess = useCallback(
    (data: { numPages: number }) => {
      console.log("PDF loaded successfully:", data);
      setIsLoading(false);
      setLoadError(null);
      onLoadSuccess(data);
    },
    [onLoadSuccess]
  );

  const handleLoadError = useCallback(
    (error: Error) => {
      console.error("PDF loading error:", error);
      setIsLoading(false);
      setLoadError(error.message);
      onLoadError(error);
    },
    [onLoadError]
  );

  // Reset state when file changes
  React.useEffect(() => {
    if (file) {
      console.log("Loading PDF file:", file);
      setIsLoading(true);
      setLoadError(null);
    }
  }, [file]);

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

export default SimplePDFViewer;
