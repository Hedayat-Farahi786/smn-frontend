import React, { useState, useCallback, useRef, useEffect } from 'react';
import { AnnotationLayerProps, PDFAnnotation } from '../../types/pdf-editor';
import { 
  Type, 
  Pen, 
  CheckSquare, 
  Image, 
  Square, 
  Minus,
  Edit3
} from 'lucide-react';

// Custom drag hook for React 18 compatibility
const useDrag = (onDrag: (x: number, y: number) => void, onDragEnd?: () => void) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; initialX: number; initialY: number } | null>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX, 
      y: e.clientY,
      initialX: e.clientX,
      initialY: e.clientY
    });
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !dragStart) return;
    
    const deltaX = e.clientX - dragStart.initialX;
    const deltaY = e.clientY - dragStart.initialY;
    onDrag(deltaX, deltaY);
    
    setDragStart(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
  }, [isDragging, dragStart, onDrag]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setDragStart(null);
    if (onDragEnd) onDragEnd();
  }, [onDragEnd]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return { handleMouseDown, isDragging };
};

const AnnotationLayer: React.FC<AnnotationLayerProps> = ({
  annotations,
  selectedTool,
  onAnnotationAdd,
  onAnnotationUpdate,
  onAnnotationDelete,
  onAnnotationSelect,
  selectedAnnotationId,
  selectedAnnotationIds = [],
  scale,
  pageNumber,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleContainerClick = useCallback((event: React.MouseEvent) => {
    // If clicking on empty space, deselect annotation
    if (selectedTool === 'select' || selectedAnnotationId) {
      onAnnotationSelect(null);
      return;
    }
    
    if (!selectedTool) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const newAnnotation: Omit<PDFAnnotation, 'id'> = {
      type: selectedTool as PDFAnnotation['type'],
      x,
      y,
      width: getDefaultWidth(selectedTool as PDFAnnotation['type']),
      height: getDefaultHeight(selectedTool as PDFAnnotation['type']),
      content: getDefaultContent(selectedTool as PDFAnnotation['type']),
      pageNumber,
      style: getDefaultStyle(selectedTool as PDFAnnotation['type']),
      zIndex: annotations.length + 1,
    };

    onAnnotationAdd(newAnnotation);
  }, [selectedTool, pageNumber, annotations.length, onAnnotationAdd, onAnnotationSelect, selectedAnnotationId]);

  const getDefaultWidth = (type: PDFAnnotation['type']): number => {
    switch (type) {
      case 'text': return 120;
      case 'signature': return 200;
      case 'checkbox': return 20;
      case 'image': return 100;
      case 'shape': return 80;
      case 'line': return 100;
      default: return 100;
    }
  };

  const getDefaultHeight = (type: PDFAnnotation['type']): number => {
    switch (type) {
      case 'text': return 30;
      case 'signature': return 80;
      case 'checkbox': return 20;
      case 'image': return 100;
      case 'shape': return 60;
      case 'line': return 2;
      default: return 30;
    }
  };


  const handleAnnotationResize = useCallback((id: string, updates: Partial<PDFAnnotation>) => {
    onAnnotationUpdate(id, updates);
  }, [onAnnotationUpdate]);

  const handleAnnotationClick = useCallback((id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    onAnnotationSelect(id);
  }, [onAnnotationSelect]);

  const handleAnnotationDoubleClick = useCallback((id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    // Handle editing - this could open a modal or inline editor
    console.log('Edit annotation:', id);
  }, []);

  const handleDuplicate = useCallback((annotation: PDFAnnotation) => {
    const duplicated: Omit<PDFAnnotation, 'id'> = {
      ...annotation,
      x: annotation.x + 30,
      y: annotation.y + 30,
      zIndex: annotations.length + 1,
    };
    const newId = `annotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const annotationWithId = { ...duplicated, id: newId };
    
    onAnnotationAdd(duplicated);
    // Select the new annotation after a brief delay to ensure it's been added
    setTimeout(() => onAnnotationSelect(newId), 50);
  }, [annotations.length, onAnnotationAdd, onAnnotationSelect]);

  const handleRotate = useCallback((id: string) => {
    const annotation = annotations.find(a => a.id === id);
    if (annotation) {
      const currentRotation = annotation.rotation || 0;
      const newRotation = (currentRotation + 90) % 360;
      onAnnotationUpdate(id, { rotation: newRotation });
    }
  }, [annotations, onAnnotationUpdate]);

  const handleBringToFront = useCallback((id: string) => {
    const maxZ = Math.max(...annotations.map(a => a.zIndex || 1));
    onAnnotationUpdate(id, { zIndex: maxZ + 1 });
  }, [annotations, onAnnotationUpdate]);

  const handleSendToBack = useCallback((id: string) => {
    const minZ = Math.min(...annotations.map(a => a.zIndex || 1));
    onAnnotationUpdate(id, { zIndex: Math.max(1, minZ - 1) });
  }, [annotations, onAnnotationUpdate]);

  // Resize functionality
  const [isResizing, setIsResizing] = useState(false);
  const [resizeData, setResizeData] = useState<{
    id: string;
    direction: string;
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    const annotation = annotations.find(a => a.id === id);
    if (!annotation) return;

    setIsResizing(true);
    setResizeData({
      id,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: annotation.width,
      startHeight: annotation.height,
      startPosX: annotation.x,
      startPosY: annotation.y
    });
  }, [annotations]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeData) return;

    const deltaX = e.clientX - resizeData.startX;
    const deltaY = e.clientY - resizeData.startY;
    
    let newWidth = resizeData.startWidth;
    let newHeight = resizeData.startHeight;
    let newX = resizeData.startPosX;
    let newY = resizeData.startPosY;

    switch (resizeData.direction) {
      case 'e':
        newWidth = Math.max(10, resizeData.startWidth + deltaX);
        break;
      case 'w':
        newWidth = Math.max(10, resizeData.startWidth - deltaX);
        newX = resizeData.startPosX + deltaX;
        break;
      case 'n':
        newHeight = Math.max(10, resizeData.startHeight - deltaY);
        newY = resizeData.startPosY + deltaY;
        break;
      case 's':
        newHeight = Math.max(10, resizeData.startHeight + deltaY);
        break;
      case 'ne':
        newWidth = Math.max(10, resizeData.startWidth + deltaX);
        newHeight = Math.max(10, resizeData.startHeight - deltaY);
        newY = resizeData.startPosY + deltaY;
        break;
      case 'nw':
        newWidth = Math.max(10, resizeData.startWidth - deltaX);
        newHeight = Math.max(10, resizeData.startHeight - deltaY);
        newX = resizeData.startPosX + deltaX;
        newY = resizeData.startPosY + deltaY;
        break;
      case 'se':
        newWidth = Math.max(10, resizeData.startWidth + deltaX);
        newHeight = Math.max(10, resizeData.startHeight + deltaY);
        break;
      case 'sw':
        newWidth = Math.max(10, resizeData.startWidth - deltaX);
        newHeight = Math.max(10, resizeData.startHeight + deltaY);
        newX = resizeData.startPosX + deltaX;
        break;
    }

    onAnnotationUpdate(resizeData.id, {
      width: newWidth,
      height: newHeight,
      x: newX,
      y: newY
    });
  }, [isResizing, resizeData, onAnnotationUpdate]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeData(null);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  const getDefaultContent = (type: PDFAnnotation['type']): string => {
    switch (type) {
      case 'text':
        return 'Text';
      case 'signature':
        return 'Signature';
      case 'checkbox':
        return '☐';
      case 'image':
        return 'Image';
      case 'shape':
        return '';
      case 'line':
        return '';
      default:
        return '';
    }
  };

  const getDefaultStyle = (type: PDFAnnotation['type']) => {
    const baseStyle = {
      fontSize: 14,
      fontFamily: 'Arial',
      color: '#000000',
      backgroundColor: 'transparent',
      borderColor: '#000000',
      borderWidth: 1,
      fontWeight: 'normal',
      fontStyle: 'normal'
    };

    switch (type) {
      case 'text':
        return { ...baseStyle, backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 0 };
      case 'signature':
        return { ...baseStyle, backgroundColor: 'transparent', borderColor: 'transparent', borderWidth: 0 };
      case 'checkbox':
        return { ...baseStyle, fontSize: 16 };
      case 'image':
        return { ...baseStyle, backgroundColor: 'rgba(0, 0, 0, 0.1)' };
      case 'shape':
        return { ...baseStyle, backgroundColor: '#3b82f6', borderColor: '#3b82f6', borderWidth: 2, borderRadius: 2 };
      case 'line':
        return { ...baseStyle, backgroundColor: 'transparent', color: '#000000', borderWidth: 2, borderRadius: 0 };
      default:
        return baseStyle;
    }
  };

  // Individual annotation component to avoid hooks in render loop
  const AnnotationItem: React.FC<{ annotation: PDFAnnotation }> = ({ annotation }) => {
    const isSelected = selectedAnnotationId === annotation.id || selectedAnnotationIds.includes(annotation.id);
    const [isHovered, setIsHovered] = useState(false);
    const style = annotation.style || getDefaultStyle(annotation.type);
    // Custom drag handler for this annotation
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    const handleDrag = useCallback((deltaX: number, deltaY: number) => {
      if (selectedTool === 'select') {
        setDragOffset({ x: deltaX, y: deltaY });
      }
    }, [selectedTool]);

    const handleDragEnd = useCallback(() => {
      if (dragOffset.x !== 0 || dragOffset.y !== 0) {
        const newX = annotation.x + dragOffset.x;
        const newY = annotation.y + dragOffset.y;
        onAnnotationUpdate(annotation.id, { x: newX, y: newY });
        setDragOffset({ x: 0, y: 0 });
      }
    }, [annotation.id, annotation.x, annotation.y, dragOffset, onAnnotationUpdate]);

    const { handleMouseDown, isDragging } = useDrag(handleDrag, handleDragEnd);

    // Show tooltip during drag for shapes
    const showTooltip = isDragging && (annotation.type === 'shape' || annotation.type === 'line');
    const tooltipX = annotation.x + dragOffset.x;
    const tooltipY = annotation.y + dragOffset.y - 30;

    const annotationStyle: React.CSSProperties = {
      position: 'absolute',
      left: annotation.x + dragOffset.x,
      top: annotation.y + dragOffset.y,
      width: annotation.width,
      height: annotation.height,
      zIndex: annotation.zIndex || 1,
      border: annotation.type === 'line' || annotation.type === 'shape' || annotation.type === 'signature' ? 'none' : `${style.borderWidth}px solid ${style.borderColor}`,
      backgroundColor: style.backgroundColor,
      color: style.color,
      fontSize: `${style.fontSize}px`,
      fontFamily: style.fontFamily,
      cursor: selectedTool === 'select' ? (isDragging ? 'grabbing' : isSelected ? 'move' : 'default') : 'crosshair',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '20px',
      minHeight: '20px',
      userSelect: 'none',
      transform: `rotate(${annotation.rotation || 0}deg)`,
      transformOrigin: 'center',
      transition: isDragging ? 'none' : 'all 0.2s ease',
      outline: isSelected ? '3px solid hsl(var(--primary))' : (isHovered ? '2px solid hsl(var(--primary) / 0.7)' : 'none'),
      outlineOffset: isSelected ? '4px' : (isHovered ? '2px' : '0'),
      boxShadow: isHovered && !isSelected ? '0 4px 12px hsl(var(--primary) / 0.15)' : 'none',
    };

    const getIcon = () => {
      switch (annotation.type) {
        case 'text':
          return <Type className="h-4 w-4" />;
        case 'signature':
          return <Pen className="h-4 w-4" />;
        case 'checkbox':
          return <CheckSquare className="h-4 w-4" />;
        case 'image':
          return <Image className="h-4 w-4" />;
        case 'shape':
          return <Square className="h-4 w-4" />;
        case 'line':
          return <Minus className="h-4 w-4" />;
        default:
          return null;
      }
    };

    return (
      <div
        key={annotation.id}
        style={annotationStyle}
        onClick={(e) => {
          e.stopPropagation();
          handleAnnotationClick(annotation.id, e);
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          handleAnnotationDoubleClick(annotation.id, e);
        }}
        onMouseDown={selectedTool === 'select' ? (e) => {
          e.stopPropagation();
          handleMouseDown(e);
        } : undefined}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`group relative transition-all duration-200 ${isDragging ? 'opacity-75' : ''}`}
      >
        {annotation.type === 'line' ? (
          <div 
            className="transition-all duration-150" 
            style={{
              width: '100%',
              height: '100%',
              minHeight: '2px',
              backgroundColor: style.color || '#000000',
              borderRadius: `${style.borderRadius || 0}px`
            }}
          />
        ) : annotation.type === 'shape' ? (
          <div 
            className="transition-all duration-150" 
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: style.backgroundColor || '#3b82f6',
              borderColor: style.borderColor || '#3b82f6',
              borderWidth: `${style.borderWidth || 2}px`,
              borderStyle: 'solid',
              borderRadius: `${style.borderRadius || 2}px`
            }}
          />
        ) : annotation.type === 'signature' && annotation.content && annotation.content.startsWith('data:image/') ? (
          <img 
            src={annotation.content} 
            alt="Signature" 
            className="w-full h-full object-contain"
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
              border: 'none'
            }}
          />

        ) : (
          <div 
            className="flex items-center justify-center w-full h-full"
            style={{
              fontSize: annotation.type === 'text' ? `${style.fontSize}px` : undefined,
              fontFamily: annotation.type === 'text' ? style.fontFamily : undefined,
              fontWeight: annotation.type === 'text' ? style.fontWeight : undefined,
              fontStyle: annotation.type === 'text' ? style.fontStyle : undefined
            }}
          >
            {annotation.content || getIcon()}
          </div>
        )}
        
        {/* Custom resize handles */}
        {isSelected && selectedTool === 'select' && (
          <>
            {annotation.type === 'line' ? (
              // Line resize handles (left and right)
              <>
                <div
                  className="absolute w-2 h-2 bg-primary border border-white rounded-full cursor-ew-resize hover:bg-primary/80 transition-colors"
                  style={{
                    left: '-4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1001
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'w', annotation.id)}
                />
                <div
                  className="absolute w-2 h-2 bg-primary border border-white rounded-full cursor-ew-resize hover:bg-primary/80 transition-colors"
                  style={{
                    right: '-4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 1001
                  }}
                  onMouseDown={(e) => handleResizeStart(e, 'e', annotation.id)}
                />
              </>
            ) : (
              // Shape resize handles (all 8 directions)
              <>
                {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map((direction) => {
                  const getPosition = () => {
                    switch (direction) {
                      case 'nw': return { left: '-4px', top: '-4px', cursor: 'nw-resize' };
                      case 'n': return { left: '50%', top: '-4px', transform: 'translateX(-50%)', cursor: 'n-resize' };
                      case 'ne': return { right: '-4px', top: '-4px', cursor: 'ne-resize' };
                      case 'e': return { right: '-4px', top: '50%', transform: 'translateY(-50%)', cursor: 'e-resize' };
                      case 'se': return { right: '-4px', bottom: '-4px', cursor: 'se-resize' };
                      case 's': return { left: '50%', bottom: '-4px', transform: 'translateX(-50%)', cursor: 's-resize' };
                      case 'sw': return { left: '-4px', bottom: '-4px', cursor: 'sw-resize' };
                      case 'w': return { left: '-4px', top: '50%', transform: 'translateY(-50%)', cursor: 'w-resize' };
                      default: return {};
                    }
                  };
                  return (
                    <div
                      key={direction}
                      className="absolute w-2 h-2 bg-primary border border-white rounded-full hover:bg-primary/80 transition-colors"
                      style={{
                        ...getPosition(),
                        zIndex: 1001
                      }}
                      onMouseDown={(e) => handleResizeStart(e, direction, annotation.id)}
                    />
                  );
                })}
              </>
            )}
          </>
        )}
        

        
        {/* Drag Tooltip */}
        {showTooltip && (
          <div
            className="absolute bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none z-50"
            style={{
              left: tooltipX,
              top: tooltipY,
              transform: 'translateY(-100%)'
            }}
          >
            {Math.round(annotation.width)} × {Math.round(annotation.height)}
          </div>
        )}

      </div>
    );
  };

  const renderAnnotation = (annotation: PDFAnnotation) => {
    return <AnnotationItem key={annotation.id} annotation={annotation} />;
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-auto"
      onClick={handleContainerClick}
      style={{ 
        pointerEvents: 'auto',
        zIndex: 10
      }}
    >
      {annotations.map(renderAnnotation)}
    </div>
  );
};

export default AnnotationLayer;
