import React, { useState, useEffect } from 'react';
import { pdfjs } from 'react-pdf';

const VersionTestComponent: React.FC = () => {
  const [versionInfo, setVersionInfo] = useState({
    apiVersion: '',
    workerSrc: '',
    workerInitialized: false,
    error: null as string | null,
  });

  useEffect(() => {
    const testVersions = async () => {
      try {
        // Set the worker source to react-pdf's entry point
        pdfjs.GlobalWorkerOptions.workerSrc = 'react-pdf/dist/pdf.worker.entry.js';
        
        setVersionInfo({
          apiVersion: pdfjs.version,
          workerSrc: pdfjs.GlobalWorkerOptions.workerSrc,
          workerInitialized: true,
          error: null,
        });

        console.log('Version Test Results:');
        console.log('- API Version:', pdfjs.version);
        console.log('- Worker Source:', pdfjs.GlobalWorkerOptions.workerSrc);
        console.log('- Worker Initialized:', true);
      } catch (error) {
        console.error('Version test failed:', error);
        setVersionInfo(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error',
        }));
      }
    };

    testVersions();
  }, []);

  return (
    <div className="bg-gray-100 p-4 rounded-lg border">
      <h3 className="text-lg font-semibold mb-2">PDF.js Version Test</h3>
      <div className="space-y-2 text-sm">
        <div><strong>API Version:</strong> {versionInfo.apiVersion}</div>
        <div><strong>Worker Source:</strong> {versionInfo.workerSrc}</div>
        <div><strong>Worker Initialized:</strong> 
          <span className={`ml-2 px-2 py-1 rounded text-xs ${
            versionInfo.workerInitialized 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {versionInfo.workerInitialized ? 'Yes' : 'No'}
          </span>
        </div>
        {versionInfo.error && (
          <div><strong>Error:</strong> 
            <span className="text-red-600 ml-2">{versionInfo.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VersionTestComponent;
