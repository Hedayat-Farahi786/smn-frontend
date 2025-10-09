// PDF.js Worker Configuration
// This file handles PDF.js worker setup to avoid CORS issues

import { pdfjs } from 'react-pdf';

export const configurePDFWorker = () => {
  try {
    // Use react-pdf's built-in worker entry point to avoid version mismatches
    const workerOptions = [
      // Use react-pdf's worker entry (preferred - matches API version)
      'react-pdf/dist/pdf.worker.entry.js',
      // Local worker file fallback
      '/pdf.worker.min.js',
      // CDN fallbacks
      `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
      `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
      // Alternative CDN
      `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
    ];

    // Set the first available worker source
    pdfjs.GlobalWorkerOptions.workerSrc = workerOptions[0];
    
    console.log('PDF.js Worker Configuration:');
    console.log('- Worker Source:', pdfjs.GlobalWorkerOptions.workerSrc);
    console.log('- PDF.js Version:', pdfjs.version);
    console.log('- Available fallbacks:', workerOptions.slice(1));
    
    return true;
  } catch (error) {
    console.error('Failed to configure PDF.js worker:', error);
    return false;
  }
};

// Test if the worker is accessible
export const testWorkerAccess = async (): Promise<boolean> => {
  try {
    const response = await fetch(pdfjs.GlobalWorkerOptions.workerSrc);
    return response.ok;
  } catch (error) {
    console.error('Worker access test failed:', error);
    return false;
  }
};

// Fallback configuration if primary worker fails
export const configureFallbackWorker = () => {
  const fallbackWorkers = [
    // Try react-pdf worker entry first
    'react-pdf/dist/pdf.worker.entry.js',
    // Then local worker
    '/pdf.worker.min.js',
    // Then CDN fallbacks
    `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
    `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
  ];

  for (const workerSrc of fallbackWorkers) {
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
      console.log('Using fallback worker:', workerSrc);
      return true;
    } catch (error) {
      console.error('Fallback worker failed:', workerSrc, error);
    }
  }
  
  return false;
};

// Initialize PDF.js with proper worker configuration
export const initializePDFJS = async (): Promise<boolean> => {
  try {
    // First, try to configure with local worker
    if (configurePDFWorker()) {
      // Test if the worker is accessible
      const isAccessible = await testWorkerAccess();
      if (isAccessible) {
        console.log('✅ PDF.js worker configured successfully');
        return true;
      } else {
        console.warn('⚠️ Local worker not accessible, trying fallback');
        return configureFallbackWorker();
      }
    }
    
    return false;
  } catch (error) {
    console.error('Failed to initialize PDF.js:', error);
    return false;
  }
};
