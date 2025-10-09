import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';

const PDFDebugInfo: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState({
    workerSrc: '',
    version: '',
    workerAccessible: false,
    lastError: null as string | null,
  });

  useEffect(() => {
    const checkWorker = async () => {
      try {
        const workerSrc = pdfjs.GlobalWorkerOptions.workerSrc;
        const version = pdfjs.version;
        
        // Test if worker is accessible
        let workerAccessible = false;
        try {
          const response = await fetch(workerSrc);
          workerAccessible = response.ok;
        } catch (error) {
          console.error('Worker access test failed:', error);
        }

        setDebugInfo({
          workerSrc,
          version,
          workerAccessible,
          lastError: null,
        });
      } catch (error) {
        setDebugInfo(prev => ({
          ...prev,
          lastError: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    checkWorker();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">PDF.js Debug Information</h3>
      <div className="space-y-2 text-sm">
        <div><strong>Version:</strong> {debugInfo.version}</div>
        <div><strong>Worker Source:</strong> {debugInfo.workerSrc}</div>
        <div><strong>Worker Accessible:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            debugInfo.workerAccessible 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {debugInfo.workerAccessible ? 'Yes' : 'No'}
          </span>
        </div>
        {debugInfo.lastError && (
          <div><strong>Last Error:</strong> 
            <span className="text-red-600 ml-2">{debugInfo.lastError}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFDebugInfo;
