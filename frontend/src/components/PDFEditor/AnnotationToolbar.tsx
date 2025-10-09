import React from 'react';
import { Trash2, Copy, Edit3, RotateCw, ArrowUp, ArrowDown, Palette } from 'lucide-react';

interface AnnotationToolbarProps {
  position: { x: number; y: number };
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
  onRotate: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onStyleToggle?: () => void;
  showStyleButton?: boolean;
}

const AnnotationToolbar: React.FC<AnnotationToolbarProps> = ({
  position,
  onDelete,
  onDuplicate,
  onEdit,
  onRotate,
  onBringToFront,
  onSendToBack,
  onStyleToggle,
  showStyleButton = false,
}) => {
  return (
    <div
      className="absolute bg-white border border-gray-200 rounded-xl shadow-2xl p-2 flex flex-col gap-1 min-w-32"
      style={{
        left: position.x,
        top: position.y - 50,
        transform: position.x === 0 && position.y === 0 ? 'translateX(-50%)' : 'translateX(-50%)',
        zIndex: 9999,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={onEdit}
        className="flex items-center gap-2 p-2 hover:bg-blue-50 rounded-lg text-gray-700 hover:text-blue-600 transition-all text-sm font-medium"
      >
        <Edit3 className="h-4 w-4" />
        <span>Edit</span>
      </button>
      
      <button
        onClick={onDuplicate}
        className="flex items-center gap-2 p-2 hover:bg-green-50 rounded-lg text-gray-700 hover:text-green-600 transition-all text-sm font-medium"
      >
        <Copy className="h-4 w-4" />
        <span>Duplicate</span>
      </button>
      
      <button
        onClick={onRotate}
        className="flex items-center gap-2 p-2 hover:bg-purple-50 rounded-lg text-gray-700 hover:text-purple-600 transition-all text-sm font-medium"
      >
        <RotateCw className="h-4 w-4" />
        <span>Rotate</span>
      </button>
      
      {showStyleButton && (
        <button
          onClick={onStyleToggle}
          className="flex items-center gap-2 p-2 hover:bg-orange-50 rounded-lg text-gray-700 hover:text-orange-600 transition-all text-sm font-medium"
        >
          <Palette className="h-4 w-4" />
          <span>Style</span>
        </button>
      )}
      
      <div className="h-px bg-gray-200 my-1" />
      
      <button
        onClick={onBringToFront}
        className="flex items-center gap-2 p-2 hover:bg-indigo-50 rounded-lg text-gray-700 hover:text-indigo-600 transition-all text-sm font-medium"
      >
        <ArrowUp className="h-4 w-4" />
        <span>To Front</span>
      </button>
      
      <button
        onClick={onSendToBack}
        className="flex items-center gap-2 p-2 hover:bg-indigo-50 rounded-lg text-gray-700 hover:text-indigo-600 transition-all text-sm font-medium"
      >
        <ArrowDown className="h-4 w-4" />
        <span>To Back</span>
      </button>
      
      <div className="h-px bg-gray-200 my-1" />
      
      <button
        onClick={onDelete}
        className="flex items-center gap-2 p-2 hover:bg-red-50 rounded-lg text-gray-700 hover:text-red-600 transition-all text-sm font-medium"
      >
        <Trash2 className="h-4 w-4" />
        <span>Delete</span>
      </button>
    </div>
  );
};

export default AnnotationToolbar;