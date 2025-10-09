import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { configurePDFJSLocal } from '../../utils/pdfjsConfig';

// Configure PDF.js worker
configurePDFJSLocal().catch(console.error);

const PDFTestComponent: React.FC = () => {
  const [file, setFile] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      const url = URL.createObjectURL(selectedFile);
      setFile(url);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">PDF Test Component</h2>
      
      <div className="mb-4">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {file && (
        <div className="border border-gray-300 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">PDF Preview</h3>
          <Document
            file={file}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
            onLoadError={(error) => console.error('PDF load error:', error)}
            loading={
              <div className="flex items-center justify-center h-32">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <div className="text-gray-600">Loading PDF...</div>
                </div>
              </div>
            }
            error={
              <div className="flex items-center justify-center h-32 bg-red-50 border border-red-200 rounded">
                <div className="text-center">
                  <div className="text-red-600 text-lg mb-2">Failed to load PDF</div>
                  <div className="text-red-500 text-sm">Please check if the file is a valid PDF</div>
                </div>
              </div>
            }
          >
            <div className="space-y-4">
              {Array.from(new Array(numPages), (_, index) => (
                <div key={`page_${index + 1}`} className="border border-gray-200 rounded shadow-sm">
                  <Page
                    pageNumber={index + 1}
                    scale={1.0}
                    className="mx-auto"
                  />
                </div>
              ))}
            </div>
          </Document>
        </div>
      )}
    </div>
  );
};

export default PDFTestComponent;
