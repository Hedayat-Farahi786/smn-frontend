import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Download, FileText, AlertCircle } from "lucide-react";

interface SimplePDFViewerFallbackProps {
  file: string;
  fileName: string;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  className?: string;
}

const SimplePDFViewerFallback: React.FC<SimplePDFViewerFallbackProps> = ({
  file,
  fileName,
  onLoadSuccess,
  onLoadError,
  className = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDownload = useCallback(() => {
    const link = document.createElement("a");
    link.href = file;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [file, fileName]);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoadSuccess({ numPages: 1 }); // Assume 1 page for fallback
  }, [onLoadSuccess]);

  const handleError = useCallback(() => {
    onLoadError(new Error("Failed to load PDF in fallback mode"));
  }, [onLoadError]);

  return (
    <div className={`flex flex-col items-center justify-center h-64 ${className}`}>
      <div className="text-center max-w-md">
        <div className="text-blue-600 mb-4">
          <FileText className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          PDF Document Ready
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Your PDF document is ready for download. The preview feature is not available 
          in this mode, but you can download and view the document in your browser or PDF reader.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={handleDownload}
            className="w-full flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-gray-700">Note:</p>
                <p>Signature functionality is not available in fallback mode. 
                For full signature features, please ensure your browser can load PDF.js workers.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplePDFViewerFallback;

