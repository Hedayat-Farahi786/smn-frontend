import React, { useRef, useEffect, useCallback, useState } from "react";
import { getImageDisplayInfo, screenToImageCoords, imageToScreenCoords, imageToScreenDimensions } from "../utils/coordinateUtils";

interface SignatureCanvasOverlayProps {
  imageRef: React.RefObject<HTMLImageElement | null>;
  imageDimensions: { width: number; height: number };
  signatures: Array<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    signatureData: string;
    pageNumber: number;
  }>;
  selectedSignatureId: string | null;
  onSignatureClick: (signatureId: string) => void;
  onSignatureMove: (signatureId: string, x: number, y: number) => void;
  onSignatureResize: (signatureId: string, x: number, y: number, width: number, height: number) => void;
  onImageClick: (event: React.MouseEvent<HTMLImageElement>, pageNumber: number, imageDimensions: { width: number; height: number }) => void;
  isSigning: boolean;
  className?: string;
}

const SignatureCanvasOverlay: React.FC<SignatureCanvasOverlayProps> = ({
  imageRef,
  imageDimensions,
  signatures,
  selectedSignatureId,
  onSignatureClick,
  onSignatureMove,
  onSignatureResize,
  onImageClick,
  isSigning,
  className = "",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string>("");
  const [draggedSignatureId, setDraggedSignatureId] = useState<string | null>(null);
  const signatureImageCache = useRef<Map<string, HTMLImageElement>>(new Map());

  // Calculate the actual displayed image dimensions and position
  const getDisplayInfo = useCallback(() => {
    if (!imageRef.current) return null;
    return getImageDisplayInfo(imageRef.current, imageDimensions);
  }, [imageRef, imageDimensions]);

  // Convert screen coordinates to image coordinates
  const screenToImageCoords = useCallback((screenX: number, screenY: number) => {
    const displayInfo = getDisplayInfo();
    if (!displayInfo) return { x: 0, y: 0 };
    
    const { displayWidth, displayHeight, offsetX, offsetY, rect } = displayInfo;
    
    // Convert to relative coordinates within the displayed image
    const relativeX = (screenX - rect.left - offsetX) / displayWidth;
    const relativeY = (screenY - rect.top - offsetY) / displayHeight;
    
    // Convert to actual image coordinates
    const imageX = relativeX * imageDimensions.width;
    const imageY = relativeY * imageDimensions.height;
    
    return { x: imageX, y: imageY };
  }, [getDisplayInfo, imageDimensions]);

  // Convert image coordinates to screen coordinates
  const imageToScreenCoords = useCallback((imageX: number, imageY: number) => {
    const displayInfo = getDisplayInfo();
    if (!displayInfo) return { x: 0, y: 0 };
    
    const { displayWidth, displayHeight, offsetX, offsetY, rect } = displayInfo;
    
    // Convert to relative coordinates
    const relativeX = imageX / imageDimensions.width;
    const relativeY = imageY / imageDimensions.height;
    
    // Convert to screen coordinates
    const screenX = rect.left + offsetX + (relativeX * displayWidth);
    const screenY = rect.top + offsetY + (relativeY * displayHeight);
    
    return { x: screenX, y: screenY };
  }, [getDisplayInfo, imageDimensions]);

  // Convert image dimensions to screen dimensions
  const imageToScreenDimensions = useCallback((imageWidth: number, imageHeight: number) => {
    const displayInfo = getDisplayInfo();
    if (!displayInfo) return { width: 0, height: 0 };
    
    const { displayWidth, displayHeight } = displayInfo;
    
    const relativeWidth = imageWidth / imageDimensions.width;
    const relativeHeight = imageHeight / imageDimensions.height;
    
    return {
      width: relativeWidth * displayWidth,
      height: relativeHeight * displayHeight
    };
  }, [getDisplayInfo, imageDimensions]);

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
      if (signature.pageNumber !== 1) return; // Only show signatures for current page
      
      const screenPos = imageToScreenCoords(signature.x, signature.y);
      const screenDims = imageToScreenDimensions(signature.width, signature.height);
      const displayInfo = getDisplayInfo();
      
      if (!displayInfo) return;
      
      // Adjust coordinates relative to canvas
      const canvasX = screenPos.x - rect.left;
      const canvasY = screenPos.y - rect.top;
      
      // Draw signature border
      ctx.strokeStyle = selectedSignatureId === signature.id ? '#3b82f6' : 'transparent';
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
  }, [signatures, selectedSignatureId, imageToScreenCoords, imageToScreenDimensions, getDisplayInfo, imageRef]);

  // Handle mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Check if clicking on a signature
    const clickedSignature = signatures.find(signature => {
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
      setDraggedSignatureId(clickedSignature.id);
      setDragStart({ x: mouseX, y: mouseY });
    } else if (isSigning && imageRef.current) {
      // Convert to image coordinates and call onImageClick
      const imageCoords = screenToImageCoords(e.clientX, e.clientY);
      const fakeEvent = {
        ...e,
        currentTarget: imageRef.current
      } as React.MouseEvent<HTMLImageElement>;
      onImageClick(fakeEvent, 1, imageDimensions);
    }
  }, [signatures, imageToScreenCoords, imageToScreenDimensions, screenToImageCoords, onSignatureClick, onImageClick, isSigning, imageRef]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !draggedSignatureId || !imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const deltaX = mouseX - dragStart.x;
    const deltaY = mouseY - dragStart.y;
    
    const signature = signatures.find(s => s.id === draggedSignatureId);
    if (!signature) return;
    
    const screenPos = imageToScreenCoords(signature.x, signature.y);
    const newScreenX = screenPos.x + deltaX;
    const newScreenY = screenPos.y + deltaY;
    
    const newImageCoords = screenToImageCoords(
      newScreenX + rect.left,
      newScreenY + rect.top
    );
    
    onSignatureMove(draggedSignatureId, newImageCoords.x, newImageCoords.y);
    setDragStart({ x: mouseX, y: mouseY });
  }, [isDragging, draggedSignatureId, dragStart, signatures, imageToScreenCoords, screenToImageCoords, onSignatureMove, imageRef]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDraggedSignatureId(null);
    setResizeHandle("");
  }, []);

  // Update canvas when signatures change with debouncing for performance
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

  return (
    <canvas
      ref={canvasRef}
      className={`absolute top-0 left-0 pointer-events-auto ${className}`}
      style={{
        zIndex: 10,
        cursor: isSigning ? 'crosshair' : isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};

export default SignatureCanvasOverlay;
