import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/simple-popover";
import {
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
} from "lucide-react";

interface TextToolProps {
  isActive: boolean;
  onTextAdd: (text: string, style: TextStyle) => void;
}

interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  color: string;
  textAlign: 'left' | 'center' | 'right';
}

const TextTool: React.FC<TextToolProps> = ({ isActive, onTextAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState('');
  const [style, setStyle] = useState<TextStyle>({
    fontSize: 14,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#000000',
    textAlign: 'left',
  });

  const fonts = [
    'Arial', 'Helvetica', 'Times New Roman', 'Georgia',
    'Verdana', 'Tahoma', 'Courier New', 'Impact'
  ];

  const colors = [
    '#000000', '#333333', '#666666', '#999999',
    '#ff0000', '#00ff00', '#0000ff', '#ffff00',
    '#ff00ff', '#00ffff', '#ffa500', '#800080'
  ];

  const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

  const handleStyleChange = (property: keyof TextStyle, value: any) => {
    setStyle(prev => ({ ...prev, [property]: value }));
  };

  const handleAddText = () => {
    if (text.trim()) {
      onTextAdd(text.trim(), style);
      setText('');
      setIsOpen(false);
    }
  };

  const toggleBold = () => {
    handleStyleChange('fontWeight', style.fontWeight === 'bold' ? 'normal' : 'bold');
  };

  const toggleItalic = () => {
    handleStyleChange('fontStyle', style.fontStyle === 'italic' ? 'normal' : 'italic');
  };

  const toggleUnderline = () => {
    handleStyleChange('textDecoration', style.textDecoration === 'underline' ? 'none' : 'underline');
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={isActive ? "default" : "ghost"}
          size="sm"
          className={`flex items-center gap-2 px-3 py-2 ${
            isActive 
              ? "bg-primary text-white hover:bg-primary/90" 
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <Type className="h-4 w-4" />
          <span className="text-sm font-medium">Text</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div>
            <Label htmlFor="text-input" className="text-sm font-medium">
              Enter text
            </Label>
            <Input
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your text here..."
              className="mt-1"
            />
          </div>

          {/* Font Family */}
          <div>
            <Label className="text-sm font-medium">Font</Label>
            <select
              value={style.fontFamily}
              onChange={(e) => handleStyleChange('fontFamily', e.target.value)}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {fonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>

          {/* Font Size */}
          <div>
            <Label className="text-sm font-medium">Size</Label>
            <select
              value={style.fontSize}
              onChange={(e) => handleStyleChange('fontSize', parseInt(e.target.value))}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              {fontSizes.map(size => (
                <option key={size} value={size}>{size}px</option>
              ))}
            </select>
          </div>

          {/* Text Formatting */}
          <div>
            <Label className="text-sm font-medium">Formatting</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Button
                variant={style.fontWeight === 'bold' ? "default" : "outline"}
                size="sm"
                onClick={toggleBold}
                className="p-2"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant={style.fontStyle === 'italic' ? "default" : "outline"}
                size="sm"
                onClick={toggleItalic}
                className="p-2"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant={style.textDecoration === 'underline' ? "default" : "outline"}
                size="sm"
                onClick={toggleUnderline}
                className="p-2"
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <Label className="text-sm font-medium">Alignment</Label>
            <div className="flex items-center space-x-2 mt-2">
              <Button
                variant={style.textAlign === 'left' ? "default" : "outline"}
                size="sm"
                onClick={() => handleStyleChange('textAlign', 'left')}
                className="p-2"
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                variant={style.textAlign === 'center' ? "default" : "outline"}
                size="sm"
                onClick={() => handleStyleChange('textAlign', 'center')}
                className="p-2"
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                variant={style.textAlign === 'right' ? "default" : "outline"}
                size="sm"
                onClick={() => handleStyleChange('textAlign', 'right')}
                className="p-2"
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Color */}
          <div>
            <Label className="text-sm font-medium">Color</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => handleStyleChange('color', color)}
                  className={`w-6 h-6 rounded border-2 ${
                    style.color === color ? 'border-gray-400' : 'border-gray-200'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          {text && (
            <div>
              <Label className="text-sm font-medium">Preview</Label>
              <div className="mt-2 p-3 border border-gray-200 rounded bg-gray-50">
                <div
                  style={{
                    fontFamily: style.fontFamily,
                    fontSize: `${style.fontSize}px`,
                    fontWeight: style.fontWeight,
                    fontStyle: style.fontStyle,
                    textDecoration: style.textDecoration,
                    color: style.color,
                    textAlign: style.textAlign,
                  }}
                >
                  {text}
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddText}
              disabled={!text.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Add Text
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TextTool;
