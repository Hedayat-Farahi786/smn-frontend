import React from 'react';
import { Button } from '../ui/button';
import { 
  MousePointer, 
  Type, 
  Pen, 
  CheckSquare, 
  Image, 
  Square, 
  Minus,
  Circle,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Highlighter,
  MessageSquare,
  FileText,
  Calendar,
  Link,
  Paperclip,
  ZoomIn,
  ZoomOut,
  Download,
  Undo,
  Redo,
  ChevronLeft,
  ChevronRight,
  Save,
  StickyNote,
  Star
} from 'lucide-react';
import { ToolbarProps } from '../../types/pdf-editor';

const toolGroups = [
  {
    name: 'Selection',
    tools: [
      { id: 'select', label: 'Select', icon: MousePointer, description: 'Select and move elements' },
    ]
  },
  {
    name: 'Text & Markup',
    tools: [
      { id: 'text', label: 'Text', icon: Type, description: 'Add text annotation' },
      { id: 'highlight', label: 'Highlight', icon: Highlighter, description: 'Highlight text' },
      { id: 'note', label: 'Note', icon: StickyNote, description: 'Add sticky note' },
      { id: 'comment', label: 'Comment', icon: MessageSquare, description: 'Add comment bubble' },
    ]
  },
  {
    name: 'Shapes',
    tools: [
      { id: 'rectangle', label: 'Rectangle', icon: Square, description: 'Add rectangle' },
      { id: 'circle', label: 'Circle', icon: Circle, description: 'Add circle' },
      { id: 'triangle', label: 'Triangle', icon: ArrowUp, description: 'Add triangle' },
      { id: 'star', label: 'Star', icon: Star, description: 'Add star shape' },
    ]
  },
  {
    name: 'Lines & Arrows',
    tools: [
      { id: 'line', label: 'Line', icon: Minus, description: 'Add line' },
      { id: 'arrow-right', label: 'Arrow →', icon: ArrowRight, description: 'Add right arrow' },
      { id: 'arrow-up', label: 'Arrow ↑', icon: ArrowUp, description: 'Add up arrow' },
      { id: 'arrow-down', label: 'Arrow ↓', icon: ArrowDown, description: 'Add down arrow' },
    ]
  },
  {
    name: 'Form Fields',
    tools: [
      { id: 'checkbox', label: 'Checkbox', icon: CheckSquare, description: 'Add checkbox field' },
      { id: 'textfield', label: 'Text Field', icon: FileText, description: 'Add text input field' },
      { id: 'signature', label: 'Signature', icon: Pen, description: 'Add signature field' },
      { id: 'date', label: 'Date', icon: Calendar, description: 'Add date field' },
    ]
  },
  {
    name: 'Media & Links',
    tools: [
      { id: 'image', label: 'Image', icon: Image, description: 'Add image' },
      { id: 'link', label: 'Link', icon: Link, description: 'Add hyperlink' },
      { id: 'attachment', label: 'Attachment', icon: Paperclip, description: 'Add file attachment' },
    ]
  }
];

const Toolbar: React.FC<ToolbarProps> = ({
  selectedTool,
  onToolSelect,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  scale,
  onScaleChange,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handleZoomIn = () => {
    onScaleChange(Math.min(3, scale + 0.2));
  };

  const handleZoomOut = () => {
    onScaleChange(Math.max(0.5, scale - 0.2));
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Tool Selection */}
          <div className="flex items-center space-x-4 overflow-x-auto">
            {toolGroups.map((group, groupIndex) => (
              <div key={group.name} className="flex items-center space-x-1">
                {groupIndex > 0 && <div className="w-px h-6 bg-gray-300 mx-2" />}
                <div className="flex items-center space-x-1">
                  {group.tools.map((tool) => {
                    const isActive = selectedTool === tool.id;
                    return (
                      <Button
                        key={tool.id}
                        onClick={() => onToolSelect(tool.id)}
                        variant={isActive ? "default" : "outline"}
                        size="sm"
                        className={`flex items-center space-x-1 min-w-0 ${
                          isActive 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'hover:bg-gray-50'
                        }`}
                        title={tool.description}
                      >
                        <tool.icon className="h-4 w-4 flex-shrink-0" />
                        <span className="text-xs font-medium truncate">{tool.label}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Page Navigation */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Previous</span>
            </Button>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-md">
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
            </div>
            
            <Button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleZoomOut}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-md">
              <span className="text-sm font-medium">
                {Math.round(scale * 100)}%
              </span>
            </div>
            
            <Button
              onClick={handleZoomIn}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={onUndo}
              disabled={!canUndo}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Undo className="h-4 w-4" />
              <span>Undo</span>
            </Button>
            
            <Button
              onClick={onRedo}
              disabled={!canRedo}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Redo className="h-4 w-4" />
              <span>Redo</span>
            </Button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            <Button
              onClick={onSave}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-1"
              size="sm"
            >
              <Save className="h-4 w-4" />
              <span>Save PDF</span>
            </Button>
            
            <Button
              onClick={onSave}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Download className="h-4 w-4" />
              <span>Download</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
