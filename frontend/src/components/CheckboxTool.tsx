import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/simple-popover";
import {
  CheckSquare,
  Square,
  Type,
  Pen,
} from "lucide-react";

interface CheckboxToolProps {
  isActive: boolean;
  onCheckboxAdd: (checkbox: CheckboxData) => void;
}

interface CheckboxData {
  id: string;
  type: 'checkbox' | 'textfield' | 'signature';
  label: string;
  required: boolean;
  size: 'small' | 'medium' | 'large';
}

const CheckboxTool: React.FC<CheckboxToolProps> = ({ isActive, onCheckboxAdd }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formType, setFormType] = useState<'checkbox' | 'textfield' | 'signature'>('checkbox');
  const [label, setLabel] = useState('');
  const [required, setRequired] = useState(false);
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');

  const formTypes = [
    { id: 'checkbox', label: 'Checkbox', icon: CheckSquare },
    { id: 'textfield', label: 'Text Field', icon: Type },
    { id: 'signature', label: 'Signature Field', icon: Pen },
  ];

  const sizes = [
    { id: 'small', label: 'Small' },
    { id: 'medium', label: 'Medium' },
    { id: 'large', label: 'Large' },
  ];

  const handleAddForm = () => {
    if (label.trim()) {
      const checkboxData: CheckboxData = {
        id: `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: formType,
        label: label.trim(),
        required,
        size,
      };
      onCheckboxAdd(checkboxData);
      setLabel('');
      setIsOpen(false);
    }
  };

  const getDefaultLabel = (type: string) => {
    switch (type) {
      case 'checkbox':
        return 'Checkbox';
      case 'textfield':
        return 'Text Field';
      case 'signature':
        return 'Signature';
      default:
        return '';
    }
  };

  const handleTypeChange = (type: 'checkbox' | 'textfield' | 'signature') => {
    setFormType(type);
    if (!label) {
      setLabel(getDefaultLabel(type));
    }
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
          <CheckSquare className="h-4 w-4" />
          <span className="text-sm font-medium">Forms</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Form Type</Label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {formTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleTypeChange(type.id as any)}
                    className={`flex items-center gap-3 p-3 border rounded-lg text-left transition-colors ${
                      formType === type.id
                        ? 'border-blue-500 bg-blue-50 text-primary'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-500">
                        {type.id === 'checkbox' && 'Add a checkbox for yes/no options'}
                        {type.id === 'textfield' && 'Add a text input field'}
                        {type.id === 'signature' && 'Add a signature field'}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <Label htmlFor="form-label" className="text-sm font-medium">
              Label
            </Label>
            <Input
              id="form-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={`Enter ${formType} label`}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="text-sm font-medium">Size</Label>
            <div className="flex space-x-2 mt-2">
              {sizes.map((sizeOption) => (
                <button
                  key={sizeOption.id}
                  onClick={() => setSize(sizeOption.id as any)}
                  className={`px-3 py-2 text-sm border rounded transition-colors ${
                    size === sizeOption.id
                      ? 'border-blue-500 bg-blue-50 text-primary'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {sizeOption.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="required"
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="required" className="text-sm text-gray-700">
              Required field
            </Label>
          </div>

          {/* Preview */}
          {label && (
            <div>
              <Label className="text-sm font-medium">Preview</Label>
              <div className="mt-2 p-3 border border-gray-200 rounded bg-gray-50">
                <div className="flex items-center space-x-2">
                  {formType === 'checkbox' && (
                    <>
                      <div className={`border-2 border-gray-400 rounded ${
                        size === 'small' ? 'w-4 h-4' : 
                        size === 'medium' ? 'w-5 h-5' : 'w-6 h-6'
                      }`}>
                        {false && <CheckSquare className="w-full h-full text-primary" />}
                      </div>
                      <span className={`text-gray-700 ${
                        size === 'small' ? 'text-sm' : 
                        size === 'medium' ? 'text-base' : 'text-lg'
                      }`}>
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                    </>
                  )}
                  {formType === 'textfield' && (
                    <>
                      <Label className="text-gray-700">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <Input
                        placeholder="Enter text..."
                        className={`${
                          size === 'small' ? 'h-8 text-sm' : 
                          size === 'medium' ? 'h-10' : 'h-12 text-lg'
                        }`}
                        disabled
                      />
                    </>
                  )}
                  {formType === 'signature' && (
                    <>
                      <Label className="text-gray-700">
                        {label}
                        {required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      <div className={`border-2 border-dashed border-gray-300 rounded flex items-center justify-center ${
                        size === 'small' ? 'w-32 h-8' : 
                        size === 'medium' ? 'w-40 h-12' : 'w-48 h-16'
                      }`}>
                        <Pen className="h-4 w-4 text-gray-400" />
                      </div>
                    </>
                  )}
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
              onClick={handleAddForm}
              disabled={!label.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              Add {formType === 'checkbox' ? 'Checkbox' : formType === 'textfield' ? 'Text Field' : 'Signature Field'}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CheckboxTool;
