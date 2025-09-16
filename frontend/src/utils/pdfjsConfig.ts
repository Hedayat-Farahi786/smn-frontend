// PDF.js configuration utility
export const configurePDFJS = async () => {
  try {
    const pdfjs = await import("pdfjs-dist");
    
    // Get the actual version being used
    const version = pdfjs.version || "5.4.149";
    console.log("PDF.js version detected:", version);
    
    // Use local worker file first, then fallback to CDN
    // The local worker file should be compatible with the API version
    // Add cache-busting parameter to ensure fresh worker file
    pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.js?v=${Date.now()}`;
    
    // Log configuration details
    console.log("PDF.js configured with worker:", pdfjs.GlobalWorkerOptions.workerSrc);
    console.log("PDF.js version:", version);
    
    return pdfjs;
  } catch (error) {
    console.error("Failed to configure PDF.js:", error);
    throw new Error("PDF.js configuration failed");
  }
};

// Alternative configuration for local development
export const configurePDFJSLocal = async () => {
  try {
    const pdfjs = await import("pdfjs-dist");
    
    // For local development, try to use a local worker file
    // This requires the worker to be copied to the public folder
    pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
    
    return pdfjs;
  } catch (error) {
    console.error("Failed to configure PDF.js locally:", error);
    // Fallback to CDN configuration
    return configurePDFJS();
  }
};
