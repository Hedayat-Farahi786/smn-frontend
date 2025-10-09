import React from "react";
import { Button } from "./ui/button";
import { Pen, Type, MousePointer } from "lucide-react";

export type ToolType = 'select' | 'signature' | 'text';

interface PDFToolbarProps {
  currentTool: ToolType;
  onToolChange: (tool: ToolType) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onDownload: () => void;
  onApplyChanges: () => void;
  onClearAll: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoomLevel: number;
  hasSignatures: boolean;
}

const PDFToolbar: React.FC<PDFToolbarProps> = ({
  currentTool,
  onToolChange,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo,
  onDownload,
  onApplyChanges,
  onClearAll,
  canUndo,
  canRedo,
  zoomLevel,
  hasSignatures,
}) => {
  const tools = [
    {
      id: 'select' as ToolType,
      label: 'Select',
      icon: MousePointer,
    },
    {
      id: 'signature' as ToolType,
      label: 'Sign',
      icon: Pen,
    },
    {
      id: 'text' as ToolType,
      label: 'Text',
      icon: Type,
    },
  ];

  return (
    <div className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-40">
      <div className="w-full px-4 py-2">
        <div className="flex items-center justify-between h-14">
          {/* Left side - Tools */}
          <div className="flex items-center space-x-2">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentTool === tool.id;

              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onToolChange(tool.id)}
                  className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap ${
                    isActive
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "text-slate-700 hover:bg-blue-50 hover:text-primary"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tool.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            {/* Undo/Redo */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 text-slate-700 hover:bg-blue-50 hover:text-primary disabled:opacity-50"
              title="Undo"
            >
              ↶
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 text-slate-700 hover:bg-blue-50 hover:text-primary disabled:opacity-50"
              title="Redo"
            >
              ↷
            </Button>

            {/* Zoom */}
            <span className="text-sm text-slate-600 min-w-[60px] text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomOut}
              className="p-2 text-slate-700 hover:bg-blue-50 hover:text-primary"
              title="Zoom Out"
            >
              −
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onZoomIn}
              className="p-2 text-slate-700 hover:bg-blue-50 hover:text-primary"
              title="Zoom In"
            >
              +
            </Button>

            {/* Clear All */}
            {hasSignatures && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearAll}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-blue-50 hover:text-primary"
                title="Clear All"
              >
                🗑️
                <span className="text-sm">Clear</span>
              </Button>
            )}

            {/* Apply Changes */}
            {hasSignatures && (
              <Button
                onClick={onApplyChanges}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 font-medium"
              >
                ✓
                <span className="text-sm">Apply</span>
              </Button>
            )}

            {/* Download */}
            {hasSignatures && (
              <Button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white hover:bg-primary/90 font-medium"
              >
                ↓
                <span className="text-sm">Download</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFToolbar;
