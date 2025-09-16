import React, { useRef, useEffect, useCallback, useState } from "react";
import { CheckSquare, Square, Type, Pen, Trash2 } from "lucide-react";

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

interface EnhancedPDFOverlayProps {
  imageRef: React.RefObject<HTMLImageElement | null>;
  imageDimensions: { width: number; height: number };
  signatures: SignaturePosition[];
  textAnnotations: TextAnnotation[];
  formFields: FormField[];
  selectedElementId: string | null;
  onSignatureClick: (signatureId: string) => void;
  onTextClick: (textId: string) => void;
  onFormFieldClick: (fieldId: string) => void;
  onSignatureMove: (signatureId: string, x: number, y: number) => void;
  onTextMove: (textId: string, x: number, y: number) => void;
  onFormFieldMove: (fieldId: string, x: number, y: number) => void;
  onSignatureResize: (signatureId: string, x: number, y: number, width: number, height: number) => void;
  onTextResize: (textId: string, x: number, y: number, width: number, height: number) => void;
  onFormFieldResize: (fieldId: string, x: number, y: number, width: number, height: number) => void;
  onImageClick: (event: React.MouseEvent<HTMLImageElement>, pageNumber: number, imageDimensions: { width: number; height: number }) => void;
  onDeleteElement: (elementId: string, type: 'signature' | 'text' | 'form') => void;
  currentTool: string;
  currentPage: number;
  className?: string;
}

const EnhancedPDFOverlay: React.FC<EnhancedPDFOverlayProps> = ({
  imageRef,
  imageDimensions,
  signatures,
  textAnnotations,
  formFields,
  selectedElementId,
  onSignatureClick,
  onTextClick,
  onFormFieldClick,
  onSignatureMove,
  onTextMove,
  onFormFieldMove,
  onSignatureResize,
  onTextResize,
  onFormFieldResize,
  onImageClick,
  onDeleteElement,
  currentTool,
  currentPage,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>("");
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [draggedElementType, setDraggedElementType] = useState<'signature' | 'text' | 'form' | null>(null);
  const signatureImageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Calculate the actual displayed image dimensions and position
  const getImageDisplayInfo = useCallback(() => {
    if (!imageRef.current) return null;
    
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    
    // Calculate the actual displayed size (considering object-fit: contain)
    const imgAspectRatio = imageDimensions.width / imageDimensions.height;
    const containerAspectRatio = rect.width / rect.height;
    
    let displayWidth, displayHeight, offsetX, offsetY;
    
    if (imgAspectRatio > containerAspectRatio) {
      // Image is wider than container
      displayWidth = rect.width;
      displayHeight = rect.width / imgAspectRatio;
      offsetX = 0;
      offsetY = (rect.height - displayHeight) / 2;
    } else {
      // Image is taller than container
      displayHeight = rect.height;
      displayWidth = rect.height * imgAspectRatio;
      offsetX = (rect.width - displayWidth) / 2;
      offsetY = 0;
    }
    
    return {
      displayWidth,
      displayHeight,
      offsetX,
      offsetY,
      rect
    };
  }, [imageRef, imageDimensions]);

  // Convert screen coordinates to image coordinates
  const screenToImageCoords = useCallback((screenX: number, screenY: number) => {
    const displayInfo = getImageDisplayInfo();
    if (!displayInfo) return { x: 0, y: 0 };
    
    const { displayWidth, displayHeight, offsetX, offsetY, rect } = displayInfo;
    
    // Convert to relative coordinates within the displayed image
    const relativeX = (screenX - rect.left - offsetX) / displayWidth;
    const relativeY = (screenY - rect.top - offsetY) / displayHeight;
    
    // Convert to actual image coordinates
    const imageX = relativeX * imageDimensions.width;
    const imageY = relativeY * imageDimensions.height;
    
    return { x: imageX, y: imageY };
  }, [getImageDisplayInfo, imageDimensions]);

  // Convert image coordinates to screen coordinates
  const imageToScreenCoords = useCallback((imageX: number, imageY: number) => {
    const displayInfo = getImageDisplayInfo();
    if (!displayInfo) return { x: 0, y: 0 };
    
    const { displayWidth, displayHeight, offsetX, offsetY, rect } = displayInfo;
    
    // Convert to relative coordinates
    const relativeX = imageX / imageDimensions.width;
    const relativeY = imageY / imageDimensions.height;
    
    // Convert to screen coordinates
    const screenX = rect.left + offsetX + (relativeX * displayWidth);
    const screenY = rect.top + offsetY + (relativeY * displayHeight);
    
    return { x: screenX, y: screenY };
  }, [getImageDisplayInfo, imageDimensions]);

  // Convert image dimensions to screen dimensions
  const imageToScreenDimensions = useCallback((imageWidth: number, imageHeight: number) => {
    const displayInfo = getImageDisplayInfo();
    if (!displayInfo) return { width: 0, height: 0 };
    
    const { displayWidth, displayHeight } = displayInfo;
    
    const relativeWidth = imageWidth / imageDimensions.width;
    const relativeHeight = imageHeight / imageDimensions.height;
    
    return {
      width: relativeWidth * displayWidth,
      height: relativeHeight * displayHeight
    };
  }, [getImageDisplayInfo, imageDimensions]);

  // Update canvas size and redraw
  const updateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    
    // Set canvas size to match the image display area
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    // Clear canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw signatures
    signatures.forEach(signature => {
      if (signature.pageNumber !== currentPage) return;
      
      const screenPos = imageToScreenCoords(signature.x, signature.y);
      const screenDims = imageToScreenDimensions(signature.width, signature.height);
      const displayInfo = getImageDisplayInfo();
      
      if (!displayInfo) return;
      
      // Adjust coordinates relative to canvas
      const canvasX = screenPos.x - rect.left;
      const canvasY = screenPos.y - rect.top;
      
      // Draw signature border
      ctx.strokeStyle = selectedElementId === signature.id ? '#3b82f6' : 'transparent';
      ctx.lineWidth = 2;
      ctx.strokeRect(canvasX, canvasY, screenDims.width, screenDims.height);
      
      // Draw signature image with caching
      let signatureImg = signatureImageCache.current.get(signature.id);
      if (!signatureImg) {
        signatureImg = new Image();
        signatureImg.onload = () => {
          if (signatureImg) {
            ctx.drawImage(signatureImg, canvasX, canvasY, screenDims.width, screenDims.height);
          }
        };
        signatureImg.src = signature.signatureData;
        signatureImageCache.current.set(signature.id, signatureImg);
      } else {
        // Image is already cached, draw immediately
        ctx.drawImage(signatureImg, canvasX, canvasY, screenDims.width, screenDims.height);
      }
    });

    // Draw text annotations
    textAnnotations.forEach(textAnnotation => {
      if (textAnnotation.pageNumber !== currentPage) return;
      
      const screenPos = imageToScreenCoords(textAnnotation.x, textAnnotation.y);
      const displayInfo = getImageDisplayInfo();
      
      if (!displayInfo) return;
      
      // Adjust coordinates relative to canvas
      const canvasX = screenPos.x - rect.left;
      const canvasY = screenPos.y - rect.top;
      
      // Set text style
      ctx.font = `${textAnnotation.style.fontStyle} ${textAnnotation.style.fontWeight} ${textAnnotation.style.fontSize}px ${textAnnotation.style.fontFamily}`;
      ctx.fillStyle = textAnnotation.style.color;
      ctx.textAlign = textAnnotation.style.textAlign;
      ctx.textBaseline = 'top';
      
      // Draw text border if selected
      if (selectedElementId === textAnnotation.id) {
        const textMetrics = ctx.measureText(textAnnotation.text);
        const textWidth = textMetrics.width;
        const textHeight = textAnnotation.style.fontSize;
        
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasX - 2, canvasY - 2, textWidth + 4, textHeight + 4);
      }
      
      // Draw text
      if (textAnnotation.style.textDecoration === 'underline') {
        ctx.fillText(textAnnotation.text, canvasX, canvasY);
        const textMetrics = ctx.measureText(textAnnotation.text);
        ctx.beginPath();
        ctx.moveTo(canvasX, canvasY + textAnnotation.style.fontSize + 2);
        ctx.lineTo(canvasX + textMetrics.width, canvasY + textAnnotation.style.fontSize + 2);
        ctx.stroke();
      } else {
        ctx.fillText(textAnnotation.text, canvasX, canvasY);
      }
    });

    // Draw form fields
    formFields.forEach(formField => {
      if (formField.pageNumber !== currentPage) return;
      
      const screenPos = imageToScreenCoords(formField.x, formField.y);
      const displayInfo = getImageDisplayInfo();
      
      if (!displayInfo) return;
      
      // Adjust coordinates relative to canvas
      const canvasX = screenPos.x - rect.left;
      const canvasY = screenPos.y - rect.top;
      
      // Calculate field size based on type and size setting
      let fieldWidth, fieldHeight;
      switch (formField.size) {
        case 'small':
          fieldWidth = formField.type === 'checkbox' ? 16 : 120;
          fieldHeight = formField.type === 'checkbox' ? 16 : 24;
          break;
        case 'large':
          fieldWidth = formField.type === 'checkbox' ? 24 : 200;
          fieldHeight = formField.type === 'checkbox' ? 24 : 40;
          break;
        default: // medium
          fieldWidth = formField.type === 'checkbox' ? 20 : 160;
          fieldHeight = formField.type === 'checkbox' ? 20 : 32;
      }
      
      // Draw field border if selected
      if (selectedElementId === formField.id) {
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(canvasX - 2, canvasY - 2, fieldWidth + 4, fieldHeight + 4);
      }
      
      // Draw form field based on type
      if (formField.type === 'checkbox') {
        // Draw checkbox
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.strokeRect(canvasX, canvasY, fieldWidth, fieldHeight);
        
        // Draw checkmark if checked
        if (formField.value) {
          ctx.strokeStyle = '#059669';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(canvasX + 4, canvasY + fieldHeight / 2);
          ctx.lineTo(canvasX + fieldWidth / 2, canvasY + fieldHeight - 4);
          ctx.lineTo(canvasX + fieldWidth - 4, canvasY + 4);
          ctx.stroke();
        }
        
        // Draw label
        ctx.font = '12px Arial';
        ctx.fillStyle = '#374151';
        ctx.textAlign = 'left';
        ctx.fillText(formField.label, canvasX + fieldWidth + 8, canvasY + fieldHeight / 2 + 4);
      } else if (formField.type === 'textfield') {
        // Draw text field
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.strokeRect(canvasX, canvasY, fieldWidth, fieldHeight);
        
        // Draw label
        ctx.font = '12px Arial';
        ctx.fillStyle = '#374151';
        ctx.textAlign = 'left';
        ctx.fillText(formField.label, canvasX, canvasY - 8);
        
        // Draw placeholder text
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px Arial';
        ctx.fillText('Enter text...', canvasX + 4, canvasY + fieldHeight / 2 + 4);
      } else if (formField.type === 'signature') {
        // Draw signature field
        ctx.strokeStyle = '#374151';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.strokeRect(canvasX, canvasY, fieldWidth, fieldHeight);
        ctx.setLineDash([]);
        
        // Draw label
        ctx.font = '12px Arial';
        ctx.fillStyle = '#374151';
        ctx.textAlign = 'left';
        ctx.fillText(formField.label, canvasX, canvasY - 8);
        
        // Draw signature icon
        ctx.fillStyle = '#9ca3af';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Sign here', canvasX + fieldWidth / 2, canvasY + fieldHeight / 2 + 4);
      }
    });
  }, [signatures, textAnnotations, formFields, selectedElementId, imageToScreenCoords, imageToScreenDimensions, getImageDisplayInfo, imageRef, currentPage]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if clicking on a signature
    const clickedSignature = signatures.find(signature => {
      if (signature.pageNumber !== currentPage) return false;
      const screenPos = imageToScreenCoords(signature.x, signature.y);
      const screenDims = imageToScreenDimensions(signature.width, signature.height);
      const canvasX = screenPos.x - rect.left;
      const canvasY = screenPos.y - rect.top;
      
      return mouseX >= canvasX && mouseX <= canvasX + screenDims.width &&
             mouseY >= canvasY && mouseY <= canvasY + screenDims.height;
    });
    
    if (clickedSignature) {
      onSignatureClick(clickedSignature.id);
      setIsDragging(true);
      setDraggedElementId(clickedSignature.id);
      setDraggedElementType('signature');
      setDragStart({ x: mouseX, y: mouseY });
      return;
    }
    
    // Check if clicking on a text annotation
    const clickedText = textAnnotations.find(textAnnotation => {
      if (textAnnotation.pageNumber !== currentPage) return false;
      const screenPos = imageToScreenCoords(textAnnotation.x, textAnnotation.y);
      const canvasX = screenPos.x - rect.left;
      const canvasY = screenPos.y - rect.top;
      
      // Approximate text bounds
      const textWidth = textAnnotation.text.length * textAnnotation.style.fontSize * 0.6;
      const textHeight = textAnnotation.style.fontSize;
      
      return mouseX >= canvasX && mouseX <= canvasX + textWidth &&
             mouseY >= canvasY && mouseY <= canvasY + textHeight;
    });
    
    if (clickedText) {
      onTextClick(clickedText.id);
      setIsDragging(true);
      setDraggedElementId(clickedText.id);
      setDraggedElementType('text');
      setDragStart({ x: mouseX, y: mouseY });
      return;
    }
    
    // Check if clicking on a form field
    const clickedFormField = formFields.find(formField => {
      if (formField.pageNumber !== currentPage) return false;
      const screenPos = imageToScreenCoords(formField.x, formField.y);
      const canvasX = screenPos.x - rect.left;
      const canvasY = screenPos.y - rect.top;
      
      // Calculate field size
      let fieldWidth, fieldHeight;
      switch (formField.size) {
        case 'small':
          fieldWidth = formField.type === 'checkbox' ? 16 : 120;
          fieldHeight = formField.type === 'checkbox' ? 16 : 24;
          break;
        case 'large':
          fieldWidth = formField.type === 'checkbox' ? 24 : 200;
          fieldHeight = formField.type === 'checkbox' ? 24 : 40;
          break;
        default:
          fieldWidth = formField.type === 'checkbox' ? 20 : 160;
          fieldHeight = formField.type === 'checkbox' ? 20 : 32;
      }
      
      return mouseX >= canvasX && mouseX <= canvasX + fieldWidth &&
             mouseY >= canvasY && mouseY <= canvasY + fieldHeight;
    });
    
    if (clickedFormField) {
      onFormFieldClick(clickedFormField.id);
      setIsDragging(true);
      setDraggedElementId(clickedFormField.id);
      setDraggedElementType('form');
      setDragStart({ x: mouseX, y: mouseY });
      return;
    }
    
    // If not clicking on any element and we have a tool active, handle image click
    if (currentTool !== 'select' && imageRef.current) {
      const imageCoords = screenToImageCoords(e.clientX, e.clientY);
      const fakeEvent = {
        ...e,
        currentTarget: imageRef.current
      } as React.MouseEvent<HTMLImageElement>;
      onImageClick(fakeEvent, currentPage, imageDimensions);
    }
  }, [signatures, textAnnotations, formFields, imageToScreenCoords, imageToScreenDimensions, screenToImageCoords, onSignatureClick, onTextClick, onFormFieldClick, onImageClick, imageRef, currentTool, currentPage, imageDimensions]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedElementId || !draggedElementType || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const deltaX = mouseX - dragStart.x;
    const deltaY = mouseY - dragStart.y;
    
    if (draggedElementType === 'signature') {
      const signature = signatures.find(s => s.id === draggedElementId);
      if (!signature) return;
      
      const screenPos = imageToScreenCoords(signature.x, signature.y);
      const newScreenX = screenPos.x + deltaX;
      const newScreenY = screenPos.y + deltaY;
      
      const newImageCoords = screenToImageCoords(
        newScreenX + rect.left,
        newScreenY + rect.top
      );
      
      onSignatureMove(draggedElementId, newImageCoords.x, newImageCoords.y);
    } else if (draggedElementType === 'text') {
      const textAnnotation = textAnnotations.find(t => t.id === draggedElementId);
      if (!textAnnotation) return;
      
      const screenPos = imageToScreenCoords(textAnnotation.x, textAnnotation.y);
      const newScreenX = screenPos.x + deltaX;
      const newScreenY = screenPos.y + deltaY;
      
      const newImageCoords = screenToImageCoords(
        newScreenX + rect.left,
        newScreenY + rect.top
      );
      
      onTextMove(draggedElementId, newImageCoords.x, newImageCoords.y);
    } else if (draggedElementType === 'form') {
      const formField = formFields.find(f => f.id === draggedElementId);
      if (!formField) return;
      
      const screenPos = imageToScreenCoords(formField.x, formField.y);
      const newScreenX = screenPos.x + deltaX;
      const newScreenY = screenPos.y + deltaY;
      
      const newImageCoords = screenToImageCoords(
        newScreenX + rect.left,
        newScreenY + rect.top
      );
      
      onFormFieldMove(draggedElementId, newImageCoords.x, newImageCoords.y);
    }
    
    setDragStart({ x: mouseX, y: mouseY });
  }, [isDragging, draggedElementId, draggedElementType, dragStart, signatures, textAnnotations, formFields, imageToScreenCoords, screenToImageCoords, onSignatureMove, onTextMove, onFormFieldMove, imageRef]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDraggedElementId(null);
    setDraggedElementType(null);
    setResizeHandle("");
  }, []);

  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedElementId && e.key === 'Delete') {
      // Determine element type and delete
      if (signatures.find(s => s.id === selectedElementId)) {
        onDeleteElement(selectedElementId, 'signature');
      } else if (textAnnotations.find(t => t.id === selectedElementId)) {
        onDeleteElement(selectedElementId, 'text');
      } else if (formFields.find(f => f.id === selectedElementId)) {
        onDeleteElement(selectedElementId, 'form');
      }
    }
  }, [selectedElementId, signatures, textAnnotations, formFields, onDeleteElement]);

  // Update canvas when elements change with debouncing for performance
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateCanvas();
    }, 16); // ~60fps debouncing
    
    return () => clearTimeout(timeoutId);
  }, [updateCanvas]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setTimeout(updateCanvas, 100); // Delay to ensure image has resized
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [updateCanvas]);

  // Handle keyboard events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 pointer-events-auto ${className}`}
      style={{
        zIndex: 10,
        cursor: currentTool === 'select' ? (isDragging ? 'grabbing' : 'grab') : 'crosshair'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default EnhancedPDFOverlay;
