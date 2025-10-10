import React from 'react';
import { Button } from '../ui/button';
import { 
  MousePointer, 
  Type, 
  Pen, 
  Square, 
  Download,
  Undo,
  Redo
} from 'lucide-react';
import { ToolbarProps } from '../../types/pdf-editor';
import { useTranslation } from '../../hooks/useTranslation';

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
  const { t } = useTranslation();

  const tools = [
    { id: 'select', label: t('pdf.toolbar.select'), icon: MousePointer, description: t('pdf.toolbar.selectDesc') },
    { id: 'text', label: t('pdf.toolbar.text'), icon: Type, description: t('pdf.toolbar.textDesc') },
    { id: 'signature', label: t('pdf.toolbar.signature'), icon: Pen, description: t('pdf.toolbar.signatureDesc') },
    { id: 'rectangle', label: t('pdf.toolbar.rectangle'), icon: Square, description: t('pdf.toolbar.rectangleDesc') },
  ];


  return (
    <div className="bg-card border-b border-border shadow-sm">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Tool Selection */}
          <div className="flex items-center space-x-2">
            {tools.map((tool) => {
              const isActive = selectedTool === tool.id;
              return (
                <Button
                  key={tool.id}
                  onClick={() => onToolSelect(tool.id)}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center space-x-1 ${
                    isActive 
                      ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  title={tool.description}
                >
                  <tool.icon className="h-4 w-4" />
                  <span className="text-xs font-medium">{tool.label}</span>
                </Button>
              );
            })}
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
              <span>{t('pdf.toolbar.undo')}</span>
            </Button>
            
            <Button
              onClick={onRedo}
              disabled={!canRedo}
              variant="outline"
              size="sm"
              className="flex items-center space-x-1"
            >
              <Redo className="h-4 w-4" />
              <span>{t('pdf.toolbar.redo')}</span>
            </Button>
            
            <Button
              onClick={onSave}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex items-center space-x-1"
              size="sm"
            >
              <Download className="h-4 w-4" />
              <span>{t('pdf.toolbar.savePdf')}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
