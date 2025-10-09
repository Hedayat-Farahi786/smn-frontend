import React, { useRef, useEffect, useCallback, useState } from "react";
import { CheckSquare, Square, Type, Pen, Trash2 } from "lucide-react";
import { getImageDisplayInfo, screenToImageCoords as utilScreenToImageCoords, imageToScreenCoords as utilImageToScreenCoords, imageToScreenDimensions as utilImageToScreenDimensions } from "../utils/coordinateUtils";

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
  onTextDoubleClick?: (textId: string) => void;
  onFormFieldClick: (fieldId: string) => void;
  onSignatureMove: (signatureId: string, x: number, y: number) => void;
  onTextMove: (textId: string, x: number, y: number) => void;
  onFormFieldMove: (fieldId: string, x: number, y: number) => void;
  onSignatureResize: (signatureId: string, x: number, y: number, width: number, height: number) => void;
  onTextResize: (textId: string, x: number, y: number, width: number, height: number) => void;
  onFormFieldResize: (fieldId: string, x: number, y: number, width: number, height: number) => void;
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
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [lastClickedTextId, setLastClickedTextId] = useState<string | null>(null);
  const signatureImageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Calculate the actual displayed image dimensions and position
  const getDisplayInfo = useCallback(() => {
    if (!imageRef.current) return null;
    return getImageDisplayInfo(imageRef.current, imageDimensions);
  }, [imageRef, imageDimensions]);

  // Small wrappers that call the shared utils (these pass the image element and
  // image dimensions so the util functions have everything they need).
  const screenToImageCoords = useCallback((screenX: number, screenY: number) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    return utilScreenToImageCoords(screenX, screenY, imageRef.current, imageDimensions);
  }, [imageRef, imageDimensions]);

  const imageToScreenCoords = useCallback((imageX: number, imageY: number) => {
    if (!imageRef.current) return { x: 0, y: 0 };
    return utilImageToScreenCoords(imageX, imageY, imageRef.current, imageDimensions);
  }, [imageRef, imageDimensions]);

  const imageToScreenDimensions = useCallback((imageWidth: number, imageHeight: number) => {
    if (!imageRef.current) return { width: 0, height: 0 };
    return utilImageToScreenDimensions(imageWidth, imageHeight, imageRef.current, imageDimensions);
  }, [imageRef, imageDimensions]);

  // Update canvas size and redraw
  const updateCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageRef.current) return;
    
    const img = imageRef.current;
    const rect = img.getBoundingClientRect();
    
  // Position the canvas exactly over the image using fixed positioning so
  // it remains aligned regardless of where the overlay component is mounted
  // in the DOM. Use device pixels for canvas resolution and CSS pixels for
  // layout size.
  const cssWidth = rect.width;
  const cssHeight = rect.height;

  // Ensure canvas uses device pixel ratio for crisp rendering
  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.max(1, Math.floor(cssWidth * dpr));
  canvas.height = Math.max(1, Math.floor(cssHeight * dpr));
  canvas.style.width = `${cssWidth}px`;
  canvas.style.height = `${cssHeight}px`;

  // Position overlay over the image using viewport coordinates
  canvas.style.position = 'fixed';
  canvas.style.left = `${rect.left}px`;
  canvas.style.top = `${rect.top}px`;
  canvas.style.zIndex = '1000';
    
  // Clear canvas and scale context for device pixel ratio
  const ctx = canvas.getContext('2d');
    if (!ctx) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssWidth, cssHeight);
    
    // Draw signatures
    signatures.forEach(signature => {
      if (signature.pageNumber !== currentPage) return;
      
      const screenPos = imageToScreenCoords(signature.x, signature.y);
      const screenDims = imageToScreenDimensions(signature.width, signature.height);
      const displayInfo = getDisplayInfo();
      
      if (!displayInfo) return;
      
  // Adjust coordinates relative to canvas (CSS pixels)
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
          // In some browsers the first render happens before the image is
          // loaded; request a redraw to ensure it appears.
          // We don't call updateCanvas directly here to avoid recursion.
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
      const displayInfo = getDisplayInfo();
      
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
      const displayInfo = getDisplayInfo();
      
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
  }, [signatures, textAnnotations, formFields, selectedElementId, imageToScreenCoords, imageToScreenDimensions, getDisplayInfo, imageRef, currentPage]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    // Use client coordinates so we stay consistent with fixed-position canvas
    const mouseClientX = e.clientX;
    const mouseClientY = e.clientY;
    const mouseX = mouseClientX - rect.left; // CSS pixels within image
    const mouseY = mouseClientY - rect.top;
    
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
      const now = Date.now();
      const isDoubleClick = lastClickedTextId === clickedText.id && now - lastClickTime < 300;
      
      if (isDoubleClick && onTextDoubleClick) {
        onTextDoubleClick(clickedText.id);
        setLastClickTime(0);
        setLastClickedTextId(null);
      } else {
        onTextClick(clickedText.id);
        setLastClickTime(now);
        setLastClickedTextId(clickedText.id);
        setIsDragging(true);
        setDraggedElementId(clickedText.id);
        setDraggedElementType('text');
        setDragStart({ x: mouseX, y: mouseY });
      }
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
      setDragStart({ x: mouseClientX, y: mouseClientY });
      return;
    }
    
    // If not clicking on any element and we have a tool active, handle image click
    // Note: Image clicks are handled by the parent HighQualityPDFViewer component
    // This overlay only handles interactions with existing elements
  }, [signatures, textAnnotations, formFields, imageToScreenCoords, imageToScreenDimensions, screenToImageCoords, onSignatureClick, onTextClick, onFormFieldClick, imageRef, currentTool, currentPage, imageDimensions]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedElementId || !draggedElementType || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const mouseClientX = e.clientX;
    const mouseClientY = e.clientY;

    const deltaX = mouseClientX - dragStart.x;
    const deltaY = mouseClientY - dragStart.y;

    if (draggedElementType === 'signature') {
      const signature = signatures.find(s => s.id === draggedElementId);
      if (!signature) return;

      const screenPos = imageToScreenCoords(signature.x, signature.y);
      const newScreenX = screenPos.x + deltaX;
      const newScreenY = screenPos.y + deltaY;

      const newImageCoords = screenToImageCoords(newScreenX, newScreenY);

      onSignatureMove(draggedElementId, newImageCoords.x, newImageCoords.y);
    } else if (draggedElementType === 'text') {
      const textAnnotation = textAnnotations.find(t => t.id === draggedElementId);
      if (!textAnnotation) return;

      const screenPos = imageToScreenCoords(textAnnotation.x, textAnnotation.y);
      const newScreenX = screenPos.x + deltaX;
      const newScreenY = screenPos.y + deltaY;

      const newImageCoords = screenToImageCoords(newScreenX, newScreenY);

      onTextMove(draggedElementId, newImageCoords.x, newImageCoords.y);
    } else if (draggedElementType === 'form') {
      const formField = formFields.find(f => f.id === draggedElementId);
      if (!formField) return;

      const screenPos = imageToScreenCoords(formField.x, formField.y);
      const newScreenX = screenPos.x + deltaX;
      const newScreenY = screenPos.y + deltaY;

      const newImageCoords = screenToImageCoords(newScreenX, newScreenY);
      onFormFieldMove(draggedElementId, newImageCoords.x, newImageCoords.y);
    }

    setDragStart({ x: mouseClientX, y: mouseClientY });
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

  // Throttle updates with requestAnimationFrame to avoid flooding the main thread
  const rafRef = React.useRef<number | null>(null);
  const scheduleUpdateCanvas = useCallback(() => {
    if (rafRef.current !== null) return; // already scheduled
    rafRef.current = window.requestAnimationFrame(() => {
      rafRef.current = null;
      updateCanvas();
    });
  }, [updateCanvas]);

  // Handle window resize (use scheduler)
  useEffect(() => {
    const handleResize = () => scheduleUpdateCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [scheduleUpdateCanvas]);

  // Update canvas on scroll and when the image size/position changes. Use a
  // ResizeObserver on the image element (cheaper and more targeted than a
  // global MutationObserver). All updates use RAF scheduling to keep UI
  // responsive and avoid freezes on clicks.
  useEffect(() => {
    const onScroll = () => scheduleUpdateCanvas();
    window.addEventListener('scroll', onScroll, { passive: true });

    let ro: ResizeObserver | null = null;
    if (imageRef?.current && (window as any).ResizeObserver) {
      ro = new ResizeObserver(() => scheduleUpdateCanvas());
      try {
        ro.observe(imageRef.current);
      } catch (err) {
        // Ignore observe errors on exotic elements
      }
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (ro) ro.disconnect();
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [imageRef, scheduleUpdateCanvas]);

  // Handle keyboard events
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <canvas
      ref={canvasRef}
      className={`${className}`}
      style={{
        // Only capture pointer events when in select mode so users can place
        // new elements by clicking the underlying image when in placement
        // tools such as 'signature' or 'text'.
        pointerEvents: currentTool === 'select' ? 'auto' : 'none',
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
