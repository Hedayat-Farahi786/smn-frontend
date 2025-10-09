import React from 'react';
import { Palette, Square, Circle, Minus } from 'lucide-react';

interface StylePanelProps {
  annotation: any;
  onStyleUpdate: (updates: any) => void;
  position: { x: number; y: number };
}

const StylePanel: React.FC<StylePanelProps> = ({
  annotation,
  onStyleUpdate,
  position
}) => {
  const colors = [
    '#000000', '#374151', '#6B7280', '#EF4444', '#F97316', 
    '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981',
    '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6',
    '#A855F7', '#D946EF', '#EC4899', '#F43F5E', '#FFFFFF'
  ];

  const borderWidths = [1, 2, 3, 4, 6, 8];
  const borderRadii = [0, 2, 4, 6, 8, 12, 16, 20];

  return (
    <div
      className="absolute bg-white border border-gray-200 rounded-xl shadow-2xl p-4 min-w-64"
      style={{
        left: position.x + 140,
        top: position.y,
        zIndex: 10001,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          {annotation.type === 'line' ? 'Line Style' : 'Shape Style'}
        </h3>
        
        {/* Color Picker */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {annotation.type === 'line' ? 'Color' : 'Border Color'}
          </label>
          <div className="grid grid-cols-10 gap-1.5">
            {colors.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded-lg border-2 transition-all hover:scale-110 ${
                  annotation.style?.[annotation.type === 'line' ? 'color' : 'borderColor'] === color
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => onStyleUpdate({
                  style: {
                    ...annotation.style,
                    [annotation.type === 'line' ? 'color' : 'borderColor']: color
                  }
                })}
              />
            ))}
          </div>
        </div>

        {/* Background Color for Shapes */}
        {annotation.type === 'shape' && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Fill Color</label>
            <div className="grid grid-cols-10 gap-1.5">
              <button
                className={`w-6 h-6 rounded-lg border-2 bg-white relative transition-all hover:scale-110 ${
                  annotation.style?.backgroundColor === 'transparent'
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onStyleUpdate({
                  style: { ...annotation.style, backgroundColor: 'transparent' }
                })}
              >
                <Minus className="w-3 h-3 text-red-500 absolute inset-0 m-auto" />
              </button>
              {colors.map(color => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-lg border-2 transition-all hover:scale-110 ${
                    annotation.style?.backgroundColor === color + '40'
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ backgroundColor: color + '40' }}
                  onClick={() => onStyleUpdate({
                    style: { ...annotation.style, backgroundColor: color + '40' }
                  })}
                />
              ))}
            </div>
          </div>
        )}

        {/* Border Width */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {annotation.type === 'line' ? 'Thickness' : 'Border Width'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {borderWidths.map(width => (
              <button
                key={width}
                className={`px-3 py-2 text-sm rounded-lg border font-medium transition-all ${
                  annotation.style?.borderWidth === width
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
                onClick={() => onStyleUpdate({
                  style: { ...annotation.style, borderWidth: width }
                })}
              >
                {width}px
              </button>
            ))}
          </div>
        </div>

        {/* Border Radius for Shapes */}
        {annotation.type === 'shape' && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Corner Radius</label>
            <div className="grid grid-cols-4 gap-2">
              {borderRadii.map(radius => (
                <button
                  key={radius}
                  className={`px-3 py-2 text-sm rounded-lg border font-medium transition-all ${
                    annotation.style?.borderRadius === radius
                      ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                  onClick={() => onStyleUpdate({
                    style: { ...annotation.style, borderRadius: radius }
                  })}
                >
                  {radius}px
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StylePanel;