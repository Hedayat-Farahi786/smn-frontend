import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';
import { initializeWorker, testWorker } from '../../utils/workerConfig';

const WorkerStatusComponent: React.FC = () => {
  const [status, setStatus] = useState({
    initialized: false,
    accessible: false,
    workerSrc: '',
    version: '',
    error: null as string | null,
  });

  useEffect(() => {
    const checkWorker = async () => {
      try {
        // Initialize worker
        const initialized = await initializeWorker();
        
        // Test accessibility
        const accessible = await testWorker();
        
        setStatus({
          initialized,
          accessible,
          workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
          version: pdfjs.version,
          error: null,
        });
      } catch (error) {
        setStatus(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    checkWorker();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">PDF.js Worker Status</h3>
      <div className="space-y-2 text-sm">
        <div><strong>Initialized:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            status.initialized 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status.initialized ? 'Yes' : 'No'}
          </span>
        </div>
        <div><strong>Accessible:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            status.accessible 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {status.accessible ? 'Yes' : 'No'}
          </span>
        </div>
        <div><strong>Worker Source:</strong> {status.workerSrc}</div>
        <div><strong>Version:</strong> {status.version}</div>
        {status.error && (
          <div><strong>Error:</strong> 
            <span className="text-red-600 ml-2">{status.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerStatusComponent;
