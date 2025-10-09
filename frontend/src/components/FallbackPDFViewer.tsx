import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { AlertTriangle, Download } from "lucide-react";

interface FallbackPDFViewerProps {
  file: string;
  fileName: string;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  className?: string;
}

const FallbackPDFViewer: React.FC<FallbackPDFViewerProps> = ({
  file,
  fileName,
  onLoadSuccess,
  onLoadError,
  className = "",
}) => {
  const [showFallback, setShowFallback] = useState(false);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = file;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [file, fileName]);

  const handleShowFallback = useCallback(() => {
    setShowFallback(true);
    // Simulate successful load with 1 page
    onLoadSuccess({ numPages: 1 });
  }, [onLoadSuccess]);

  if (showFallback) {
    return (
      <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
        <div className="text-center max-w-md">
          <div className="text-amber-500 mb-4">
            <AlertTriangle className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            PDF Preview Unavailable
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            The PDF preview feature is currently unavailable due to network issues. 
            You can still download the PDF file to view it in your browser or PDF reader.
          </p>
          <div className="space-y-2">
            <Button
              onClick={handleDownload}
              className="w-full flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <p className="text-xs text-gray-500">
              Note: Signature functionality is not available in fallback mode.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
      <div className="text-center max-w-md">
        <div className="text-red-500 mb-4">
          <AlertTriangle className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          PDF Loading Failed
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Unable to load the PDF preview. This might be due to network issues or 
          browser compatibility problems.
        </p>
        <div className="space-y-2">
          <Button
            onClick={handleShowFallback}
            variant="outline"
            className="w-full"
          >
            Continue Without Preview
          </Button>
          <Button
            onClick={handleDownload}
            className="w-full flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FallbackPDFViewer;

