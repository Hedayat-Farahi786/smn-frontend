import React, { useState } from 'react';
import { 
  Copy, RotateCw, Trash2, Minus, Plus, Scissors, RotateCcw, Type, Bold, Italic, Underline
} from 'lucide-react';

interface AnnotationEditToolbarProps {
  annotation: any;
  onEdit: () => void;
  onDuplicate: () => void;
  onRotate: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onStyleUpdate: (updates: any) => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onCut?: () => void;
  onLock?: () => void;
  onHide?: () => void;
  onFlipH?: () => void;
  onFlipV?: () => void;
  onRotateLeft?: () => void;
  onAlign?: (alignment: string) => void;
}

const AnnotationEditToolbar: React.FC<AnnotationEditToolbarProps> = ({
  annotation,
  onEdit,
  onDuplicate,
  onRotate,
  onDelete,
  onBringToFront,
  onSendToBack,
  onStyleUpdate,
  onCopy = () => {},
  onPaste = () => {},
  onCut = () => {},
  onLock = () => {},
  onHide = () => {},
  onFlipH = () => {},
  onFlipV = () => {},
  onRotateLeft = () => {},
  onAlign = () => {},
}) => {
  const [showStrokePicker, setShowStrokePicker] = useState(false);
  const [showFillPicker, setShowFillPicker] = useState(false);
  const [showTextStrokePicker, setShowTextStrokePicker] = useState(false);
  const [showTextFillPicker, setShowTextFillPicker] = useState(false);
  const [showTextBorderPicker, setShowTextBorderPicker] = useState(false);
  
  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981',
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#BE123C', '#7C2D12', '#365314', '#064E3B', '#0C4A6E'
  ];

  const currentBorderWidth = annotation.style?.borderWidth || 2;
  const currentBorderRadius = annotation.style?.borderRadius || 0;
  const isLocked = annotation.locked || false;
  const isHidden = annotation.hidden || false;
  const currentStrokeColor = annotation.style?.[annotation.type === 'line' ? 'color' : 'borderColor'] || '#000000';
  const currentFillColor = annotation.style?.backgroundColor || 'transparent';

  const ToolButton = ({ icon: Icon, label, onClick, active = false, className = "" }) => (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-md transition-all duration-200 ${
        active 
          ? 'bg-primary/10 text-primary shadow-sm' 
          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-800'
      } ${className}`}
      title={label}
    >
      <Icon className="w-4 h-4" />
      <span className="text-xs font-medium">{label}</span>
    </button>
  );

  const NumberControl = ({ label, value, onChange, min = 0, max = 100, step = 1, unit = "" }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <div className="flex items-center bg-white border border-gray-200 rounded-md">
        <button
          onClick={() => onChange(Math.max(min, value - step))}
          className="p-1 hover:bg-gray-50 text-gray-500 hover:text-gray-700 rounded-l-md"
        >
          <Minus className="w-3 h-3" />
        </button>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Math.max(min, Math.min(max, parseInt(e.target.value) || min)))}
          className="w-12 text-xs text-center border-0 focus:outline-none py-1"
          min={min}
          max={max}
        />
        <span className="text-xs text-gray-400 px-1">{unit}</span>
        <button
          onClick={() => onChange(Math.min(max, value + step))}
          className="p-1 hover:bg-gray-50 text-gray-500 hover:text-gray-700 rounded-r-md"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>
    </div>
  );

  const ColorControl = ({ label, color, onChange, showPicker, setShowPicker, allowTransparent = false }) => (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-medium text-gray-600">{label}</span>
      <div className="relative">
        <button
          onClick={() => setShowPicker(!showPicker)}
          className="flex items-center justify-center w-8 h-8 bg-white border border-gray-200 rounded-md hover:border-gray-300 transition-colors"
        >
          <div 
            className="w-6 h-6 rounded border border-gray-300" 
            style={{ 
              backgroundColor: color === 'transparent' ? '#ffffff' : color,
              backgroundImage: color === 'transparent' 
                ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
                : 'none',
              backgroundSize: color === 'transparent' ? '4px 4px' : 'auto',
              backgroundPosition: color === 'transparent' ? '0 0, 0 2px, 2px -2px, -2px 0px' : 'auto'
            }}
          />
        </button>
        
        {showPicker && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl p-3 min-w-56 z-[999999]">
            <h4 className="text-xs font-semibold text-gray-800 mb-3">{label} Color</h4>
            
            <div className="grid grid-cols-7 gap-1.5 mb-3">
              {allowTransparent && (
                <button
                  className={`w-7 h-7 rounded border-2 bg-white relative transition-all hover:scale-105 ${
                    color === 'transparent' ? 'border-blue-500 ring-1 ring-blue-200' : 'border-gray-200 hover:border-gray-400'
                  }`}
                  onClick={() => {
                    onChange('transparent');
                    setShowPicker(false);
                  }}
                  title="Transparent"
                >
                  <div className="absolute inset-1 bg-gradient-to-br from-red-500 to-red-500 opacity-60 rounded-sm" 
                       style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }} />
                </button>
              )}
              {colors.map(c => (
                <button
                  key={c}
                  className={`w-7 h-7 rounded border-2 transition-all hover:scale-105 ${
                    color === c
                      ? 'border-primary ring-1 ring-primary/20'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    onChange(c);
                    setShowPicker(false);
                  }}
                />
              ))}
            </div>
            
            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <input
                type="color"
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                value={color === 'transparent' ? '#ffffff' : color}
                onChange={(e) => onChange(e.target.value)}
              />
              <input
                type="text"
                placeholder="#000000"
                className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                value={color === 'transparent' ? '' : color}
                onChange={(e) => {
                  if (/^#[0-9A-F]{6}$/i.test(e.target.value) || e.target.value === '') {
                    onChange(e.target.value);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-white border-t border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center gap-4">
        {/* Edit Actions */}
        <div className="flex items-center gap-2">
          <ToolButton icon={Copy} label="Copy" onClick={onCopy} />
          <ToolButton icon={Scissors} label="Cut" onClick={onCut} />
          <ToolButton icon={Copy} label="Paste" onClick={onPaste} />
          <ToolButton icon={Copy} label="Duplicate" onClick={onDuplicate} />
        </div>

        <div className="w-px h-8 bg-gray-200" />

        {/* Transform Actions */}
        <div className="flex items-center gap-2">
          <ToolButton icon={RotateCcw} label="Rotate L" onClick={onRotateLeft} />
          <ToolButton icon={RotateCw} label="Rotate R" onClick={onRotate} />
        </div>

        <div className="w-px h-8 bg-gray-200" />

        {/* Style Controls */}
        <div className="flex items-center gap-4">
          {/* Text Controls */}
          {annotation.type === 'text' && (
            <>
              {/* Font Size */}
              <NumberControl
                label="Font Size"
                value={annotation.style?.fontSize || 14}
                onChange={(value) => onStyleUpdate({
                  style: { ...annotation.style, fontSize: value }
                })}
                min={8}
                max={72}
                unit="px"
              />
              
              {/* Font Weight */}
              <div className="flex items-center gap-1">
                <ToolButton 
                  icon={Bold} 
                  label="Bold" 
                  active={annotation.style?.fontWeight === 'bold'}
                  onClick={() => onStyleUpdate({
                    style: { 
                      ...annotation.style, 
                      fontWeight: annotation.style?.fontWeight === 'bold' ? 'normal' : 'bold' 
                    }
                  })}
                />
                <ToolButton 
                  icon={Italic} 
                  label="Italic" 
                  active={annotation.style?.fontStyle === 'italic'}
                  onClick={() => onStyleUpdate({
                    style: { 
                      ...annotation.style, 
                      fontStyle: annotation.style?.fontStyle === 'italic' ? 'normal' : 'italic' 
                    }
                  })}
                />
              </div>
              
              {/* Text Color */}
              <ColorControl
                label="Text Color"
                color={annotation.style?.color || '#000000'}
                onChange={(color) => onStyleUpdate({
                  style: { ...annotation.style, color }
                })}
                showPicker={showTextStrokePicker}
                setShowPicker={setShowTextStrokePicker}
              />
              
              {/* Background Color */}
              <ColorControl
                label="Background"
                color={annotation.style?.backgroundColor || 'transparent'}
                onChange={(color) => onStyleUpdate({
                  style: { ...annotation.style, backgroundColor: color }
                })}
                showPicker={showTextFillPicker}
                setShowPicker={setShowTextFillPicker}
                allowTransparent={true}
              />
              
              {/* Border Color */}
              <ColorControl
                label="Border"
                color={annotation.style?.borderColor || 'transparent'}
                onChange={(color) => onStyleUpdate({
                  style: { ...annotation.style, borderColor: color }
                })}
                showPicker={showTextBorderPicker}
                setShowPicker={setShowTextBorderPicker}
                allowTransparent={true}
              />
              
              {/* Border Width */}
              <NumberControl
                label="Border Width"
                value={annotation.style?.borderWidth || 0}
                onChange={(value) => onStyleUpdate({
                  style: { ...annotation.style, borderWidth: value }
                })}
                min={0}
                max={10}
                unit="px"
              />
            </>
          )}
          
          {/* Non-text Controls */}
          {annotation.type !== 'text' && (
            <>
              {/* Stroke Color */}
              <ColorControl
                label="Stroke"
                color={currentStrokeColor}
                onChange={(color) => onStyleUpdate({
                  style: {
                    ...annotation.style,
                    [annotation.type === 'line' ? 'color' : 'borderColor']: color
                  }
                })}
                showPicker={showStrokePicker}
                setShowPicker={setShowStrokePicker}
                allowTransparent={true}
              />
              
              {/* Stroke Size */}
              {(annotation.type === 'line' || annotation.type === 'shape' || annotation.type === 'rectangle') && (
                <NumberControl
                  label="Stroke Size"
                  value={currentBorderWidth}
                  onChange={(value) => onStyleUpdate({
                    style: { ...annotation.style, borderWidth: value }
                  })}
                  min={1}
                  max={20}
                  unit="px"
                />
              )}
              
              {/* Fill Color */}
              {(annotation.type === 'shape' || annotation.type === 'rectangle') && (
                <ColorControl
                  label="Fill"
                  color={currentFillColor}
                  onChange={(color) => onStyleUpdate({
                    style: { ...annotation.style, backgroundColor: color }
                  })}
                  showPicker={showFillPicker}
                  setShowPicker={setShowFillPicker}
                  allowTransparent={true}
                />
              )}
            </>
          )}
        </div>

        <div className="flex-1" />
        
        <div className="w-px h-8 bg-gray-200" />

        {/* Delete Action - Far Right */}
        <ToolButton 
          icon={Trash2} 
          label="Delete" 
          onClick={onDelete} 
          className="text-red-500 hover:text-red-600 hover:bg-red-50" 
        />
      </div>
      
      {/* Text Editor Panel - Below Toolbar */}
      {annotation.type === 'text' && (
        <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
          <div className="flex items-center gap-2 mb-2">
            <Type className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">Text Content</span>
          </div>
          <textarea
            value={annotation.content || ''}
            onChange={(e) => onStyleUpdate({ content: e.target.value })}
            className="w-full text-sm border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none bg-white"
            placeholder="Enter your text here..."
            rows={3}
            style={{ minHeight: '60px' }}
          />
        </div>
      )}
    </div>
  );
};

export default AnnotationEditToolbar;