import React, { useState, useRef } from 'react';
import { Button } from '../ui/button';
import { X, Type, Pen, Upload } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignatureCreate: (signatureData: string, type: 'text' | 'draw' | 'image') => void;
}

const SignatureModal: React.FC<SignatureModalProps> = ({ isOpen, onClose, onSignatureCreate }) => {
  const [activeTab, setActiveTab] = useState<'type' | 'draw' | 'upload'>('type');
  const [typedSignature, setTypedSignature] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleTypeSignature = () => {
    if (typedSignature.trim()) {
      onSignatureCreate(typedSignature, 'text');
      onClose();
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveDrawnSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataURL = canvas.toDataURL();
    onSignatureCreate(dataURL, 'draw');
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      onSignatureCreate(result, 'image');
      onClose();
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Add Signature</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="flex space-x-1 mb-4">
            <Button
              variant={activeTab === 'type' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('type')}
              className="flex items-center space-x-1"
            >
              <Type className="h-4 w-4" />
              <span>Type</span>
            </Button>
            <Button
              variant={activeTab === 'draw' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('draw')}
              className="flex items-center space-x-1"
            >
              <Pen className="h-4 w-4" />
              <span>Draw</span>
            </Button>
            <Button
              variant={activeTab === 'upload' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('upload')}
              className="flex items-center space-x-1"
            >
              <Upload className="h-4 w-4" />
              <span>Upload</span>
            </Button>
          </div>

          {activeTab === 'type' && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Type your signature"
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                className="w-full p-3 border rounded-md text-2xl font-script"
                style={{ fontFamily: 'cursive' }}
              />
              <Button onClick={handleTypeSignature} className="w-full" disabled={!typedSignature.trim()}>
                Add Signature
              </Button>
            </div>
          )}

          {activeTab === 'draw' && (
            <div className="space-y-4">
              <canvas
                ref={canvasRef}
                width={320}
                height={120}
                className="border rounded-md cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
              <div className="flex space-x-2">
                <Button onClick={clearCanvas} variant="outline" className="flex-1">
                  Clear
                </Button>
                <Button onClick={saveDrawnSignature} className="flex-1">
                  Add Signature
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600 mb-2">Upload signature image</p>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                  Choose File
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignatureModal;