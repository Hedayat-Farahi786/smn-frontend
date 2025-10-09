import React, { useState, useCallback, useEffect } from "react";
import HighQualityPDFViewer from "./HighQualityPDFViewer";
import EnhancedPDFOverlay from "./EnhancedPDFOverlay";

interface SignaturePosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pageNumber: number;
  signatureData: string;
}

interface TextAnnotation {
  id: string;
  x: number;
  y: number;
  text: string;
  style: {
    fontSize: number;
    fontFamily: string;
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    textDecoration: 'none' | 'underline';
    color: string;
    textAlign: 'left' | 'center' | 'right';
  };
  pageNumber: number;
}

interface FormField {
  id: string;
  x: number;
  y: number;
  type: 'checkbox' | 'textfield' | 'signature';
  label: string;
  required: boolean;
  size: 'small' | 'medium' | 'large';
  pageNumber: number;
  value?: any;
}

interface PageImageData {
  dataUrl: string;
  dimensions: { width: number; height: number };
  scale: number;
}

interface ColumnPDFViewerProps {
  file: string;
  scale: number;
  onLoadSuccess: (data: { numPages: number }) => void;
  onLoadError: (error: Error) => void;
  onPageImageRendered: (page: number, imageDataUrl: string, dimensions: { width: number; height: number }) => void;
  onImageClick: (event: React.MouseEvent<HTMLImageElement>, pageNumber: number, imageDimensions: { width: number; height: number }, imageElement: HTMLImageElement) => void;
  signatures: SignaturePosition[];
  textAnnotations: TextAnnotation[];
  formFields: FormField[];
  selectedElementId: string | null;
  onSignatureClick: (signatureId: string) => void;
  onTextClick: (textId: string) => void;
  onTextDoubleClick: (textId: string) => void;
  onFormFieldClick: (fieldId: string) => void;
  onSignatureMove: (signatureId: string, x: number, y: number) => void;
  onTextMove: (textId: string, x: number, y: number) => void;
  onFormFieldMove: (fieldId: string, x: number, y: number) => void;
  onSignatureResize: (signatureId: string, x: number, y: number, width: number, height: number) => void;
  onTextResize: (textId: string, x: number, y: number, width: number, height: number) => void;
  onFormFieldResize: (fieldId: string, x: number, y: number, width: number, height: number) => void;
  onDeleteElement: (elementId: string, type: 'signature' | 'text' | 'form') => void;
  currentTool: string;
  onAddBlankPage?: (insertAfterPage: number) => void;
  blankPages?: Record<number, { width: number; height: number }>;
  className?: string;
}

const ColumnPDFViewer: React.FC<ColumnPDFViewerProps> = ({
  file,
  scale,
  onLoadSuccess,
  onLoadError,
  onPageImageRendered,
  onImageClick,
  signatures,
  textAnnotations,
  formFields,
  selectedElementId,
  onSignatureClick,
  onTextClick,
  onTextDoubleClick,
  onFormFieldClick,
  onSignatureMove,
  onTextMove,
  onFormFieldMove,
  onSignatureResize,
  onTextResize,
  onFormFieldResize,
  onDeleteElement,
  currentTool,
  onAddBlankPage,
  blankPages = {},
  className = "",
}) => {
  const [allPageImages, setAllPageImages] = useState<Record<number, PageImageData>>({});
  const [imageRefs, setImageRefs] = useState<Record<number, React.RefObject<HTMLImageElement | null>>>({});

  const handleAllPagesRendered = useCallback((pageImages: Record<number, PageImageData>) => {
    setAllPageImages(pageImages);
    
    // Create refs for each page image (PDF pages + blank pages)
    const refs: Record<number, React.RefObject<HTMLImageElement | null>> = {};
    
    // Add refs for PDF pages
    Object.keys(pageImages).forEach(pageNum => {
      refs[parseInt(pageNum)] = React.createRef<HTMLImageElement | null>();
    });
    
    // Add refs for blank pages
    Object.keys(blankPages).forEach(pageNum => {
      if (!refs[parseInt(pageNum)]) {
        refs[parseInt(pageNum)] = React.createRef<HTMLImageElement | null>();
      }
    });
    
    setImageRefs(refs);
  }, [blankPages]);

  // Update refs when blank pages change
  useEffect(() => {
    if (Object.keys(allPageImages).length > 0) {
      const refs: Record<number, React.RefObject<HTMLImageElement | null>> = {};
      
      // Add refs for PDF pages
      Object.keys(allPageImages).forEach(pageNum => {
        refs[parseInt(pageNum)] = React.createRef<HTMLImageElement | null>();
      });
      
      // Add refs for blank pages
      Object.keys(blankPages).forEach(pageNum => {
        if (!refs[parseInt(pageNum)]) {
          refs[parseInt(pageNum)] = React.createRef<HTMLImageElement | null>();
        }
      });
      
      setImageRefs(refs);
    }
  }, [blankPages, allPageImages]);

  const handleImageClick = useCallback((event: React.MouseEvent<HTMLImageElement>, pageNumber: number, imageDimensions: { width: number; height: number }, imageElement: HTMLImageElement) => {
    onImageClick(event, pageNumber, imageDimensions, imageElement);
  }, [onImageClick]);

  return (
    <div className={`w-full ${className}`}>
      <HighQualityPDFViewer
        file={file}
        currentPage={1}
        scale={scale}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        onPageImageRendered={onPageImageRendered}
        showAllPages={true}
        onAllPagesRendered={handleAllPagesRendered}
        onAddBlankPage={onAddBlankPage}
        blankPages={blankPages}
        imageRefs={imageRefs}
        onImageClick={handleImageClick}
        signatures={signatures}
        textAnnotations={textAnnotations}
        formFields={formFields}
        selectedElementId={selectedElementId}
        onSignatureClick={onSignatureClick}
        onTextClick={onTextClick}
        onTextDoubleClick={onTextDoubleClick}
        onFormFieldClick={onFormFieldClick}
        onSignatureMove={onSignatureMove}
        onTextMove={onTextMove}
        onFormFieldMove={onFormFieldMove}
        onSignatureResize={onSignatureResize}
        onTextResize={onTextResize}
        onFormFieldResize={onFormFieldResize}
        onDeleteElement={onDeleteElement}
        currentTool={currentTool}
        className=""
      />

    </div>
  );
};

export default ColumnPDFViewer;
