import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';

const WorkerTestComponent: React.FC = () => {
  const [workerStatus, setWorkerStatus] = useState<string>('Testing...');
  const [workerSrc, setWorkerSrc] = useState<string>('');

  useEffect(() => {
    const testWorker = async () => {
      try {
        // Test local worker first
        const localWorkerSrc = '/pdf.worker.min.js';
        pdfjs.GlobalWorkerOptions.workerSrc = localWorkerSrc;
        setWorkerSrc(localWorkerSrc);
        
        // Try to create a simple PDF document to test the worker
        const loadingTask = pdfjs.getDocument({
          data: new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10]) // Minimal PDF header
        });
        
        await loadingTask.promise;
        setWorkerStatus('✅ Local worker is working');
      } catch (error) {
        console.error('Local worker failed:', error);
        
        try {
          // Fallback to CDN
          const cdnWorkerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
          pdfjs.GlobalWorkerOptions.workerSrc = cdnWorkerSrc;
          setWorkerSrc(cdnWorkerSrc);
          
          const loadingTask = pdfjs.getDocument({
            data: new Uint8Array([37, 80, 68, 70, 45, 49, 46, 52, 10])
          });
          
          await loadingTask.promise;
          setWorkerStatus('⚠️ CDN worker is working (CORS may be blocked)');
        } catch (cdnError) {
          console.error('CDN worker also failed:', cdnError);
          setWorkerStatus('❌ Both local and CDN workers failed');
        }
      }
    };

    testWorker();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-2">PDF.js Worker Test</h3>
      <div className="space-y-2">
        <div><strong>Status:</strong> {workerStatus}</div>
        <div><strong>Worker Source:</strong> {workerSrc}</div>
        <div><strong>PDF.js Version:</strong> {pdfjs.version}</div>
      </div>
    </div>
  );
};

export default WorkerTestComponent;
