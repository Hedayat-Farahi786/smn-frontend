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
  Trash2,
} from "lucide-react";
import SignaturePad from "signature_pad";

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignatureCreate: (signatureData: string, method: 'type' | 'draw' | 'upload' | 'camera') => void;
}

type SignatureMethod = 'type' | 'draw' | 'upload' | 'camera';

const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onSignatureCreate,
}) => {
  const [method, setMethod] = useState<SignatureMethod>('type');
  const [signatureName, setSignatureName] = useState('Alex Appleseed');
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedFont, setSelectedFont] = useState(0);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [saveSignature, setSaveSignature] = useState(true);
  const [hasDrawnSignature, setHasDrawnSignature] = useState(false);
  const [savedSignature, setSavedSignature] = useState<string | null>(null);
  
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

  // Load saved signature
  useEffect(() => {
    const saved = localStorage.getItem('savedSignature');
    if (saved) {
      setSavedSignature(saved);
    }
  }, [isOpen]);

  // Initialize signature pad
  useEffect(() => {
    if (method === 'draw' && signaturePadRef.current && isOpen) {
      // Small delay to ensure canvas is properly rendered
      const timer = setTimeout(() => {
        const canvas = signaturePadRef.current;
        if (!canvas) return;
        
        // Set canvas display size
        canvas.style.width = '100%';
        canvas.style.height = '160px';
        
        // Get actual display size
        const rect = canvas.getBoundingClientRect();
        
        // Set high-resolution canvas size (4x for ultra-high quality)
        const scaleFactor = 4;
        canvas.width = rect.width * scaleFactor;
        canvas.height = rect.height * scaleFactor;
        
        // Scale the drawing context
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(scaleFactor, scaleFactor);
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          // Enable anti-aliasing for smoother lines
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        }
        
        // Clear any existing signature pad
        if (signaturePad.current) {
          signaturePad.current.off();
        }
        
        // Initialize signature pad with high-quality settings
        signaturePad.current = new SignaturePad(canvas, {
          backgroundColor: "rgba(0, 0, 0, 0)",
          penColor: '#000000',
          minWidth: 1.5,
          maxWidth: 3.5,
          throttle: 8,
          minDistance: 2,
          velocityFilterWeight: 0.7,
          onEnd: () => {
            const isEmpty = signaturePad.current ? signaturePad.current.isEmpty() : true;
            setHasDrawnSignature(!isEmpty);
            console.log('Signature pad onEnd - isEmpty:', isEmpty, 'hasDrawnSignature:', !isEmpty);
          }
        });
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [method, isOpen]);

  const handleMethodChange = (newMethod: SignatureMethod) => {
    setMethod(newMethod);
    setHasDrawnSignature(false);
    if (newMethod === 'draw' && signaturePad.current) {
      signaturePad.current.clear();
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
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx && signatureName.trim()) {
          // High-resolution scaling for crisp text
          const scaleFactor = 4;
          const fontSize = 36 * scaleFactor;
          
          // Measure text at high resolution
          ctx.font = `${fontSize}px '${fonts[selectedFont]}', cursive`;
          const metrics = ctx.measureText(signatureName.trim());
          const textWidth = metrics.width;
          const textHeight = fontSize * 1.4; // Better height calculation
          
          // Set high-resolution canvas size
          canvas.width = textWidth + (20 * scaleFactor);
          canvas.height = textHeight + (20 * scaleFactor);
          
          // Enable high-quality rendering
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.textRenderingOptimization = 'optimizeQuality';
          
          // Clear and render text
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.font = `${fontSize}px '${fonts[selectedFont]}', cursive`;
          ctx.fillStyle = selectedColor;
          ctx.textAlign = 'left';
          ctx.textBaseline = 'middle';
          ctx.fillText(signatureName.trim(), 10 * scaleFactor, canvas.height / 2);
          
          signatureData = canvas.toDataURL('image/png', 1.0);
        }
        break;
      case 'draw':
        if (signaturePad.current && !signaturePad.current.isEmpty()) {
          const canvas = signaturePadRef.current;
          if (!canvas) break;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            // Get image data to find bounds
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            let minX = canvas.width, minY = canvas.height, maxX = 0, maxY = 0;
            
            // Find bounding box of non-transparent pixels
            for (let y = 0; y < canvas.height; y++) {
              for (let x = 0; x < canvas.width; x++) {
                const alpha = data[(y * canvas.width + x) * 4 + 3];
                if (alpha > 0) {
                  minX = Math.min(minX, x);
                  minY = Math.min(minY, y);
                  maxX = Math.max(maxX, x);
                  maxY = Math.max(maxY, y);
                }
              }
            }
            
            if (maxX > minX && maxY > minY) {
              // Create high-resolution trimmed canvas
              const trimmedCanvas = document.createElement('canvas');
              const trimmedCtx = trimmedCanvas.getContext('2d');
              if (trimmedCtx) {
                const padding = 40; // Larger padding for high-res
                trimmedCanvas.width = (maxX - minX) + (padding * 2);
                trimmedCanvas.height = (maxY - minY) + (padding * 2);
                
                // Enable high-quality rendering
                trimmedCtx.imageSmoothingEnabled = true;
                trimmedCtx.imageSmoothingQuality = 'high';
                
                // Copy trimmed signature with high quality
                trimmedCtx.drawImage(
                  canvas,
                  minX - padding, minY - padding, trimmedCanvas.width, trimmedCanvas.height,
                  0, 0, trimmedCanvas.width, trimmedCanvas.height
                );
                
                signatureData = trimmedCanvas.toDataURL('image/png', 1.0);
              }
            } else {
              signatureData = canvas.toDataURL('image/png', 1.0);
            }
          }
        }
        break;
      case 'upload':
        if (uploadedImage) {
          signatureData = uploadedImage;
        }
        break;
    }
    
    console.log('Signature data:', signatureData ? 'Generated' : 'Empty');
    console.log('Method:', method);
    console.log('Can save:', canSave());
    
    if (signatureData) {
      // Save signature if checkbox is checked and method is draw
      if (saveSignature && method === 'draw') {
        setSavedSignature(signatureData);
        localStorage.setItem('savedSignature', signatureData);
      }
      
      console.log('Calling onSignatureCreate');
      onSignatureCreate(signatureData, method);
      handleClose();
    } else {
      console.log('No signature data to save');
    }
  };

  const handleClose = () => {
    setMethod('type');
    setSignatureName('Alex Appleseed');
    setSelectedColor('#000000');
    setSelectedFont(0);
    setUploadedImage(null);
    setSaveSignature(true);
    setHasDrawnSignature(false);
    if (signaturePad.current) {
      signaturePad.current.clear();
      signaturePad.current.off(); // Clean up event listeners
      signaturePad.current = null; // Reset the reference
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
        return false;
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
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'bg-card border-border text-primary hover:bg-primary/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Save Signature Checkbox - only show for draw method */}
          {method === 'draw' && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="save-signature"
                checked={saveSignature}
                onChange={(e) => setSaveSignature(e.target.checked)}
                className="rounded border-primary text-primary focus:ring-primary"
              />
              <Label htmlFor="save-signature" className="text-sm text-gray-700">
                Save signature
              </Label>
            </div>
          )}

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
                          ? 'border-primary bg-primary/10'
                          : 'border-border hover:bg-primary/5'
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
              {/* Saved Signature */}
              {savedSignature && (
                <div>
                  <Label className="text-sm font-medium">Saved Signature</Label>
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        onSignatureCreate(savedSignature, 'draw');
                        handleClose();
                      }}
                      className="p-2 border border-border rounded-lg hover:bg-primary/5 transition-colors w-full"
                    >
                      <img src={savedSignature} alt="Saved signature" className="w-full h-12 object-contain" />
                    </button>
                  </div>
                </div>
              )}
              
              <div>
                <Label className="text-sm font-medium">Draw your signature</Label>
                <div className="border border-border rounded-lg mt-2 bg-card">
                  <canvas
                    ref={signaturePadRef}
                    className="w-full cursor-crosshair block"
                    style={{
                      touchAction: 'none',
                      userSelect: 'none',
                      backgroundColor: 'white',
                      height: '160px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      signaturePad.current?.clear();
                      setHasDrawnSignature(false);
                    }}
                    className="text-xs"
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Clear
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {hasDrawnSignature ? 'Signature drawn' : 'Draw your signature above'}
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
              className="bg-primary hover:bg-primary/90"
            >
              <Check className="h-4 w-4 mr-2" />
              Add to Document
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignatureModal;
