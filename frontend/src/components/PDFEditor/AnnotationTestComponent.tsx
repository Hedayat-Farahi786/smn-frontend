import React, { useState } from 'react';
import { PDFAnnotation } from '../../types/pdf-editor';

const AnnotationTestComponent: React.FC = () => {
  const [annotations, setAnnotations] = useState<PDFAnnotation[]>([]);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  const handleAddAnnotation = (type: PDFAnnotation['type']) => {
    const newAnnotation: PDFAnnotation = {
      id: `test-${Date.now()}`,
      type,
      x: Math.random() * 200 + 50,
      y: Math.random() * 200 + 50,
      width: getDefaultWidth(type),
      height: getDefaultHeight(type),
      content: getDefaultContent(type),
      pageNumber: 1,
      style: getDefaultStyle(type),
      zIndex: annotations.length + 1,
    };

    setAnnotations(prev => [...prev, newAnnotation]);
  };

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

  const getDefaultContent = (type: PDFAnnotation['type']): string => {
    switch (type) {
      case 'text': return 'Sample Text';
      case 'signature': return 'Signature';
      case 'checkbox': return '☐';
      case 'image': return 'Image';
      case 'shape': return '';
      case 'line': return '';
      default: return '';
    }
  };

  const getDefaultStyle = (type: PDFAnnotation['type']) => {
    const baseStyle = {
      fontSize: 12,
      fontFamily: 'Arial',
      color: '#000000',
      backgroundColor: 'transparent',
      borderColor: '#000000',
      borderWidth: 1,
    };

    switch (type) {
      case 'text':
        return { ...baseStyle, backgroundColor: 'rgba(255, 255, 255, 0.8)', fontSize: 14 };
      case 'signature':
        return { ...baseStyle, borderColor: '#007bff', borderWidth: 2, fontSize: 16 };
      case 'checkbox':
        return { ...baseStyle, fontSize: 16 };
      case 'image':
        return { ...baseStyle, backgroundColor: 'rgba(0, 0, 0, 0.1)' };
      case 'shape':
        return { ...baseStyle, backgroundColor: 'rgba(0, 123, 255, 0.2)' };
      case 'line':
        return { ...baseStyle, backgroundColor: 'transparent' };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Annotation Test</h3>
      
      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => handleAddAnnotation('text')}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
          >
            Add Text
          </button>
          <button
            onClick={() => handleAddAnnotation('signature')}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm"
          >
            Add Signature
          </button>
          <button
            onClick={() => handleAddAnnotation('checkbox')}
            className="px-3 py-1 bg-purple-500 text-white rounded text-sm"
          >
            Add Checkbox
          </button>
          <button
            onClick={() => handleAddAnnotation('shape')}
            className="px-3 py-1 bg-orange-500 text-white rounded text-sm"
          >
            Add Shape
          </button>
        </div>
        
        <div className="text-sm text-gray-600">
          Annotations: {annotations.length}
        </div>
      </div>

      <div className="relative bg-white border border-gray-300 rounded h-64 overflow-hidden">
        {annotations.map((annotation) => (
          <div
            key={annotation.id}
            className="absolute border-2 border-blue-500 bg-blue-100 p-2 rounded"
            style={{
              left: annotation.x,
              top: annotation.y,
              width: annotation.width,
              height: annotation.height,
              fontSize: annotation.style?.fontSize || 12,
              fontFamily: annotation.style?.fontFamily || 'Arial',
              color: annotation.style?.color || '#000000',
              backgroundColor: annotation.style?.backgroundColor || 'transparent',
              borderColor: annotation.style?.borderColor || '#000000',
              borderWidth: annotation.style?.borderWidth || 1,
              zIndex: annotation.zIndex || 1,
            }}
          >
            {annotation.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnotationTestComponent;
