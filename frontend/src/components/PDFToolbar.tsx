import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Pen,
  Type,
  CheckSquare,
  Image,
  Link,
  FileText,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Download,
  Trash2,
  ChevronDown,
  Camera,
  Upload,
  Check,
  MousePointer,
  Square,
  Circle,
  Minus,
  ArrowRight,
  Highlighter,
  Strikethrough,
  Underline,
  Palette,
  RotateCcw,
  Save,
  Share,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Copy,
  Scissors,
  Clipboard,
  Search,
  Filter,
  Grid,
  List,
  Maximize,
  Minimize,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import TextTool from "./TextTool";
import CheckboxTool from "./CheckboxTool";

export type ToolType = 'select' | 'signature' | 'text' | 'checkbox' | 'image' | 'link' | 'form' | 'whiteout' | 'annotate' | 'shapes' | 'highlight' | 'strikethrough' | 'underline' | 'rectangle' | 'circle' | 'line' | 'arrow' | 'stamp' | 'watermark' | 'page' | 'layer';

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
  onSave?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onCopy?: () => void;
  onCut?: () => void;
  onPaste?: () => void;
  onSearch?: () => void;
  onFilter?: () => void;
  onToggleView?: () => void;
  onToggleLock?: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoomLevel: number;
  hasSignatures: boolean;
  isLocked?: boolean;
  viewMode?: 'grid' | 'list';
  onTextAdd?: (text: string, style: any) => void;
  onFormFieldAdd?: (formData: any) => void;
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
  onSave,
  onShare,
  onSettings,
  onCopy,
  onCut,
  onPaste,
  onSearch,
  onFilter,
  onToggleView,
  onToggleLock,
  canUndo,
  canRedo,
  zoomLevel,
  hasSignatures,
  isLocked = false,
  viewMode = 'grid',
  onTextAdd,
  onFormFieldAdd,
}) => {
  const [signatureMethod, setSignatureMethod] = useState<'type' | 'draw' | 'upload' | 'camera'>('type');

  const tools = [
    {
      id: 'select' as ToolType,
      label: 'Select',
      icon: MousePointer,
      hasDropdown: false,
    },
    {
      id: 'signature' as ToolType,
      label: 'Sign',
      icon: Pen,
      hasDropdown: true,
      dropdownItems: [
        { id: 'type', label: 'Type', icon: Type },
        { id: 'draw', label: 'Draw', icon: Pen },
        { id: 'upload', label: 'Upload Image', icon: Upload },
        { id: 'camera', label: 'Camera', icon: Camera },
      ],
    },
    {
      id: 'text' as ToolType,
      label: 'Text',
      icon: Type,
      hasDropdown: true,
      dropdownItems: [
        { id: 'text', label: 'Add Text', icon: Type },
        { id: 'highlight', label: 'Highlight', icon: Highlighter },
        { id: 'strikethrough', label: 'Strikethrough', icon: Strikethrough },
        { id: 'underline', label: 'Underline', icon: Underline },
      ],
    },
    {
      id: 'checkbox' as ToolType,
      label: 'Forms',
      icon: CheckSquare,
      hasDropdown: true,
      dropdownItems: [
        { id: 'checkbox', label: 'Checkbox', icon: CheckSquare },
        { id: 'radio', label: 'Radio Button', icon: Circle },
        { id: 'textfield', label: 'Text Field', icon: Type },
        { id: 'dropdown', label: 'Dropdown', icon: ChevronDown },
      ],
    },
    {
      id: 'shapes' as ToolType,
      label: 'Shapes',
      icon: Square,
      hasDropdown: true,
      dropdownItems: [
        { id: 'rectangle', label: 'Rectangle', icon: Square },
        { id: 'circle', label: 'Circle', icon: Circle },
        { id: 'line', label: 'Line', icon: Minus },
        { id: 'arrow', label: 'Arrow', icon: ArrowRight },
      ],
    },
    {
      id: 'image' as ToolType,
      label: 'Media',
      icon: Image,
      hasDropdown: true,
      dropdownItems: [
        { id: 'upload', label: 'Upload Image', icon: Upload },
        { id: 'camera', label: 'Take Photo', icon: Camera },
        { id: 'stamp', label: 'Stamp', icon: FileText },
        { id: 'watermark', label: 'Watermark', icon: Eye },
      ],
    },
    {
      id: 'link' as ToolType,
      label: 'Links',
      icon: Link,
      hasDropdown: false,
    },
    {
      id: 'whiteout' as ToolType,
      label: 'Whiteout',
      icon: Trash2,
      hasDropdown: false,
    },
    {
      id: 'page' as ToolType,
      label: 'Pages',
      icon: FileText,
      hasDropdown: true,
      dropdownItems: [
        { id: 'add', label: 'Add Page', icon: FileText },
        { id: 'delete', label: 'Delete Page', icon: Trash2 },
        { id: 'duplicate', label: 'Duplicate', icon: Copy },
        { id: 'rotate', label: 'Rotate', icon: RotateCcw },
      ],
    },
  ];

  const handleToolClick = (toolId: ToolType) => {
    onToolChange(toolId);
  };

  const handleDropdownItemClick = (toolId: ToolType, itemId: string) => {
    if (toolId === 'signature') {
      setSignatureMethod(itemId as any);
    }
    onToolChange(toolId);
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-lg">
      <div className="w-full px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Tools */}
          <div className="flex items-center space-x-1 overflow-x-auto overflow-y-hidden">
            {tools.map((tool) => {
              const Icon = tool.icon;
              const isActive = currentTool === tool.id;
              
              if (tool.hasDropdown) {
                return (
                  <DropdownMenu key={tool.id}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className={`flex items-center gap-2 px-3 py-2 whitespace-nowrap ${
                          isActive 
                            ? "bg-blue-600 text-white hover:bg-blue-700" 
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{tool.label}</span>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {tool.dropdownItems?.map((item) => {
                        const ItemIcon = item.icon;
                        return (
                          <DropdownMenuItem
                            key={item.id}
                            onClick={() => handleDropdownItemClick(tool.id, item.id)}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <ItemIcon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              // Special handling for text and checkbox tools
              if (tool.id === 'text') {
                return (
                  <TextTool
                    key={tool.id}
                    isActive={isActive}
                    onTextAdd={onTextAdd || (() => {})}
                  />
                );
              }
              
              if (tool.id === 'checkbox') {
                return (
                  <CheckboxTool
                    key={tool.id}
                    isActive={isActive}
                    onCheckboxAdd={onFormFieldAdd || (() => {})}
                  />
                );
              }

              return (
                <Button
                  key={tool.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleToolClick(tool.id)}
                  className={`flex items-center gap-2 px-3 py-2 whitespace-nowrap ${
                    isActive 
                      ? "bg-blue-600 text-white hover:bg-blue-700" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tool.label}</span>
                </Button>
              );
            })}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-1 overflow-x-auto overflow-y-hidden">
            {/* Edit Actions */}
            <div className="flex items-center border-r border-gray-200 pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopy}
                className="p-2 text-gray-700 hover:bg-gray-100"
                title="Copy"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onCut}
                className="p-2 text-gray-700 hover:bg-gray-100"
                title="Cut"
              >
                <Scissors className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onPaste}
                className="p-2 text-gray-700 hover:bg-gray-100"
                title="Paste"
              >
                <Clipboard className="h-4 w-4" />
              </Button>
            </div>

            {/* Undo/Redo */}
            <div className="flex items-center border-r border-gray-200 pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onUndo}
                disabled={!canUndo}
                className="p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                title="Undo"
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRedo}
                disabled={!canRedo}
                className="p-2 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                title="Redo"
              >
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* View Controls */}
            <div className="flex items-center border-r border-gray-200 pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleView}
                className="p-2 text-gray-700 hover:bg-gray-100"
                title="Toggle View"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleLock}
                className="p-2 text-gray-700 hover:bg-gray-100"
                title={isLocked ? "Unlock" : "Lock"}
              >
                {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
            </div>

            {/* Zoom Controls */}
            <div className="flex items-center border-r border-gray-200 pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomOut}
                className="p-2 text-gray-700 hover:bg-gray-100"
                title="Zoom Out"
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 min-w-[60px] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={onZoomIn}
                className="p-2 text-gray-700 hover:bg-gray-100"
                title="Zoom In"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="flex items-center border-r border-gray-200 pr-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onSearch}
                className="p-2 text-gray-700 hover:bg-gray-100"
                title="Search"
              >
                <Search className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onFilter}
                className="p-2 text-gray-700 hover:bg-gray-100"
                title="Filter"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            {/* Document Actions */}
            <div className="flex items-center space-x-2">
              {onSave && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSave}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100"
                  title="Save"
                >
                  <Save className="h-4 w-4" />
                  <span className="text-sm">Save</span>
                </Button>
              )}

              {onShare && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShare}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100"
                  title="Share"
                >
                  <Share className="h-4 w-4" />
                  <span className="text-sm">Share</span>
                </Button>
              )}

              {hasSignatures && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearAll}
                  className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100"
                  title="Clear All"
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="text-sm">Clear All</span>
                </Button>
              )}

              {/* Apply Changes */}
              {hasSignatures && (
                <Button
                  onClick={onApplyChanges}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 font-medium"
                >
                  <Check className="h-4 w-4" />
                  <span className="text-sm">Apply Changes</span>
                </Button>
              )}

              {/* Download */}
              {hasSignatures && (
                <Button
                  onClick={onDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 font-medium"
                >
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download PDF</span>
                </Button>
              )}

              {onSettings && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSettings}
                  className="p-2 text-gray-700 hover:bg-gray-100"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFToolbar;
