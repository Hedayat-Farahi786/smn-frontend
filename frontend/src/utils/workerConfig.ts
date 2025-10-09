// Simple and robust PDF.js worker configuration
import { pdfjs } from 'react-pdf';

export const configureWorker = () => {
  const workerSources = [
    // Local worker files (preferred)
    '/pdf.worker.5.3.93.js',
    '/pdf.worker.min.js',
    
    // CDN fallbacks
    `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`,
    `//cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`,
  ];

  // Set the first available worker source
  pdfjs.GlobalWorkerOptions.workerSrc = workerSources[0];
  
  console.log('PDF.js Worker Configuration:');
  console.log('- Primary Worker:', pdfjs.GlobalWorkerOptions.workerSrc);
  console.log('- PDF.js Version:', pdfjs.version);
  console.log('- Available Fallbacks:', workerSources.slice(1));
  
  return true;
};

// Test worker accessibility
export const testWorker = async (): Promise<boolean> => {
  try {
    const response = await fetch(pdfjs.GlobalWorkerOptions.workerSrc);
    return response.ok;
  } catch (error) {
    console.warn('Worker accessibility test failed:', error);
    return false;
  }
};

// Initialize with fallback
export const initializeWorker = async (): Promise<boolean> => {
  try {
    configureWorker();
    
    // Test if the worker is accessible
    const isAccessible = await testWorker();
    if (isAccessible) {
      console.log('✅ Worker is accessible');
      return true;
    } else {
      console.warn('⚠️ Primary worker not accessible, but continuing with fallback');
      return true; // Continue anyway, PDF.js will handle fallbacks
    }
  } catch (error) {
    console.error('❌ Worker initialization failed:', error);
    return false;
  }
};
