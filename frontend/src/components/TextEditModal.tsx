import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface TextStyle {
  fontSize: number;
  fontFamily: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  color: string;
  textAlign: 'left' | 'center' | 'right';
}

interface TextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (text: string, style: TextStyle) => void;
  initialText?: string;
  initialStyle?: TextStyle;
}

const TextEditModal: React.FC<TextEditModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialText = "Sample Text",
  initialStyle = {
    fontSize: 16,
    fontFamily: 'Arial',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textDecoration: 'none',
    color: '#000000',
    textAlign: 'left',
  }
}) => {
  const [text, setText] = useState(initialText);
  const [style, setStyle] = useState<TextStyle>(initialStyle);

  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setStyle(initialStyle);
    }
  }, [isOpen, initialText, initialStyle]);

  const handleSave = () => {
    onSave(text, style);
    onClose();
  };

  const updateStyle = (updates: Partial<TextStyle>) => {
    setStyle(prev => ({ ...prev, ...updates }));
  };

  const toggleBold = () => {
    updateStyle({ fontWeight: style.fontWeight === 'bold' ? 'normal' : 'bold' });
  };

  const toggleItalic = () => {
    updateStyle({ fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic' });
  };

  const toggleUnderline = () => {
    updateStyle({ textDecoration: style.textDecoration === 'underline' ? 'none' : 'underline' });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Text</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Text Input */}
          <div>
            <Label htmlFor="text">Text</Label>
            <Input
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text..."
            />
          </div>

          {/* Font Family */}
          <div>
            <Label>Font Family</Label>
            <Select value={style.fontFamily} onValueChange={(value) => updateStyle({ fontFamily: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Arial">Arial</SelectItem>
                <SelectItem value="Helvetica">Helvetica</SelectItem>
                <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                <SelectItem value="Courier New">Courier New</SelectItem>
                <SelectItem value="Georgia">Georgia</SelectItem>
                <SelectItem value="Verdana">Verdana</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Font Size */}
          <div>
            <Label htmlFor="fontSize">Font Size</Label>
            <Input
              id="fontSize"
              type="number"
              min="8"
              max="72"
              value={style.fontSize}
              onChange={(e) => updateStyle({ fontSize: parseInt(e.target.value) || 16 })}
            />
          </div>

          {/* Text Color */}
          <div>
            <Label htmlFor="color">Text Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color"
                type="color"
                value={style.color}
                onChange={(e) => updateStyle({ color: e.target.value })}
                className="w-16 h-10"
              />
              <Input
                value={style.color}
                onChange={(e) => updateStyle({ color: e.target.value })}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>

          {/* Formatting Buttons */}
          <div>
            <Label>Formatting</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={style.fontWeight === 'bold' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleBold}
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={style.fontStyle === 'italic' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleItalic}
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={style.textDecoration === 'underline' ? 'default' : 'outline'}
                size="sm"
                onClick={toggleUnderline}
              >
                <Underline className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Text Alignment */}
          <div>
            <Label>Text Alignment</Label>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant={style.textAlign === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle({ textAlign: 'left' })}
              >
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={style.textAlign === 'center' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle({ textAlign: 'center' })}
              >
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant={style.textAlign === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateStyle({ textAlign: 'right' })}
              >
                <AlignRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div>
            <Label>Preview</Label>
            <div 
              className="border rounded p-3 bg-gray-50 min-h-[60px] flex items-center"
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
              {text || "Sample Text"}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Text
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TextEditModal;