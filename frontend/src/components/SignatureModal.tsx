import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/simple-dialog";
import {
  Type,
  Pen,
  Upload,
  Camera,
  X,
  Check,
} from "lucide-react";
import SignaturePad from "signature_pad";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (signatureData: string, method: 'type' | 'draw' | 'upload' | 'camera') => void;
}

type SignatureMethod = 'type' | 'draw' | 'upload' | 'camera';

const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [method, setMethod] = useState<SignatureMethod>('type');
  const [signatureName, setSignatureName] = useState('Alex Appleseed');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [saveSignature, setSaveSignature] = useState(true);
  
  const signaturePadRef = useRef<HTMLCanvasElement>(null);
  const signaturePad = useRef<SignaturePad | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const colors = [
    '#3b82f6', '#1d4ed8', '#1e40af', '#1e3a8a',
    '#374151', '#4b5563', '#000000'
  ];

  const fonts = [
    'Allura', 'Great Vibes', 'Dancing Script', 'Pacifico',
    'Satisfy', 'Kalam', 'Caveat', 'Amatic SC',
    'Indie Flower', 'Shadows Into Light', 'Permanent Marker'
  ];

  // Initialize signature pad
  useEffect(() => {
    if (method === 'draw' && signaturePadRef.current && isOpen) {
      const canvas = signaturePadRef.current;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      // Set actual canvas size in memory (scaled for retina displays)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      // Scale the drawing context so everything draws at the correct size
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = selectedColor;
        ctx.lineWidth = 2;
      }
      
      // Initialize signature pad
      signaturePad.current = new SignaturePad(canvas, {
        backgroundColor: "rgba(255, 255, 255, 1)",
        penColor: selectedColor,
        minWidth: 1,
        maxWidth: 3,
        throttle: 8,
        minDistance: 1,
      });
      
      console.log('Signature pad initialized');
    }
  }, [method, isOpen, selectedColor]);

  const handleMethodChange = (newMethod: SignatureMethod) => {
    setMethod(newMethod);
    if (newMethod === 'draw' && signaturePad.current) {
      signaturePad.current.clear();
      console.log('Signature pad cleared for draw method');
    }
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (signaturePad.current) {
      signaturePad.current.penColor = color;
      console.log('Signature pad color changed to:', color);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    let signatureData = '';
    
    switch (method) {
      case 'type':
        // Create a canvas with typed signature
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          canvas.width = 400;
          canvas.height = 100;
          ctx.font = `24px ${fonts[selectedFont]}`;
          ctx.fillStyle = selectedColor;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(signatureName, 20, 50);
          signatureData = canvas.toDataURL('image/png');
        }
        break;
      case 'draw':
        if (signaturePad.current && !signaturePad.current.isEmpty()) {
          signatureData = signaturePad.current.toDataURL('image/png');
        }
        break;
      case 'upload':
        if (uploadedImage) {
          signatureData = uploadedImage;
        }
        break;
      case 'camera':
        // Camera functionality would be implemented here
        // For now, we'll use a placeholder
        break;
    }
    
    if (signatureData) {
      onSave(signatureData, method);
      handleClose();
    }
  };

  const handleClose = () => {
    setMethod('type');
    setSignatureName('Alex Appleseed');
    setSelectedColor('#000000');
    setSelectedFont(0);
    setUploadedImage(null);
    if (signaturePad.current) {
      signaturePad.current.clear();
      console.log('Signature pad cleared on close');
    }
    onClose();
  };

  const canSave = () => {
    switch (method) {
      case 'type':
        return signatureName.trim().length > 0;
      case 'draw':
        return signaturePad.current && !signaturePad.current.isEmpty();
      case 'upload':
        return uploadedImage !== null;
      case 'camera':
        return false; // Not implemented yet
      default:
        return false;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create signature</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Method Selection */}
          <div className="flex space-x-1">
            {[
              { id: 'type', label: 'Type', icon: Type },
              { id: 'draw', label: 'Draw', icon: Pen },
              { id: 'upload', label: 'Upload Image', icon: Upload },
              { id: 'camera', label: 'Camera', icon: Camera },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleMethodChange(item.id as SignatureMethod)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                    method === item.id
                      ? 'bg-blue-50 border-blue-200 text-primary'
                      : 'bg-white border-blue-100 text-primary hover:bg-blue-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Save Signature Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="save-signature"
              checked={saveSignature}
              onChange={(e) => setSaveSignature(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="save-signature" className="text-sm text-gray-700">
              Save signature
            </Label>
          </div>

          {/* Content based on method */}
          {method === 'type' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="signature-name" className="text-sm font-medium">
                  Name
                </Label>
                <Input
                  id="signature-name"
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  className="mt-1"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <Label className="text-sm font-medium">Color</Label>
                <div className="flex space-x-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Style</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {fonts.map((font, index) => (
                    <button
                      key={font}
                      onClick={() => setSelectedFont(index)}
                      className={`p-3 border rounded-lg text-left transition-colors ${
                        selectedFont === index
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className="text-lg"
                        style={{ 
                          fontFamily: font,
                          color: selectedColor
                        }}
                      >
                        {signatureName}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {method === 'draw' && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Draw your signature</Label>
                <div className="border border-gray-300 rounded-lg mt-2 bg-white">
                  <canvas
                    ref={signaturePadRef}
                    className="w-full h-40 cursor-crosshair block border border-gray-200"
                    style={{
                      touchAction: 'none',
                      userSelect: 'none',
                      backgroundColor: 'white'
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signaturePad.current?.clear()}
                    className="text-xs"
                  >
                    Clear
                  </Button>
                  <span className="text-xs text-gray-500">
                    {signaturePad.current && !signaturePad.current.isEmpty() ? 'Signature drawn' : 'Draw your signature above'}
                  </span>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Color</Label>
                <div className="flex space-x-2 mt-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedColor === color ? 'border-gray-400' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {method === 'upload' && (
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Upload signature image</Label>
                <div className="mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Choose File
                  </Button>
                </div>
                {uploadedImage && (
                  <div className="mt-4">
                    <img
                      src={uploadedImage}
                      alt="Uploaded signature"
                      className="max-w-full h-32 object-contain border rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {method === 'camera' && (
            <div className="text-center py-8">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Camera functionality coming soon</p>
            </div>
          )}

          {/* Legal Disclaimer */}
          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
            This application does not guarantee that the signature provided through this tool is legally binding.
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!canSave()}
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;
