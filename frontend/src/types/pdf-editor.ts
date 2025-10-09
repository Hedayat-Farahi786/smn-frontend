// TypeScript interfaces for PDF Editor components

export interface PDFElement {
  id: string;
  type: 'text' | 'signature' | 'checkbox' | 'image' | 'shape' | 'line';
  position: { x: number; y: number };
  size?: { width: number; height: number };
  rotation?: number;
  content?: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  };
  pageNumber: number;
  zIndex?: number;
}

export interface PDFAnnotation {
  id: string;
  type: 'text' | 'signature' | 'checkbox' | 'image' | 'shape' | 'line';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation?: number;
  content?: string;
  style?: {
    fontSize?: number;
    fontFamily?: string;
    color?: string;
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    opacity?: number;
  };
  pageNumber: number;
  zIndex?: number;
  locked?: boolean;
  hidden?: boolean;
  flippedH?: boolean;
  flippedV?: boolean;
  signatureType?: 'text' | 'draw' | 'image';
}

export interface PDFViewerProps {
  file: ArrayBuffer | string | null;
  scale?: number;
  onLoadSuccess?: (data: { numPages: number }) => void;
  onLoadError?: (error: Error) => void;
  onPageClick?: (event: React.MouseEvent, pageNumber: number) => void;
  annotations?: PDFAnnotation[];
  onAnnotationUpdate?: (annotation: PDFAnnotation) => void;
  onAnnotationDelete?: (id: string) => void;
  onAnnotationSelect?: (id: string | null) => void;
  selectedAnnotationId?: string | null;
  selectedAnnotationIds?: string[];
  selectedTool?: string | null;
}

export interface ToolbarProps {
  selectedTool: string | null;
  onToolSelect: (tool: string | null) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  scale: number;
  onScaleChange: (scale: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface AnnotationLayerProps {
  annotations: PDFAnnotation[];
  selectedTool: string | null;
  onAnnotationAdd: (annotation: Omit<PDFAnnotation, 'id'>) => void;
  onAnnotationUpdate: (id: string, updates: Partial<PDFAnnotation>) => void;
  onAnnotationDelete: (id: string) => void;
  onAnnotationSelect: (id: string | null) => void;
  selectedAnnotationId: string | null;
  selectedAnnotationIds?: string[];
  scale: number;
  pageNumber: number;
}

export interface HistoryState {
  annotations: PDFAnnotation[];
  timestamp: number;
}

export interface PDFEditorState {
  file: ArrayBuffer | null;
  numPages: number;
  currentPage: number;
  scale: number;
  annotations: PDFAnnotation[];
  selectedTool: string | null;
  selectedAnnotationId: string | null;
  selectedAnnotationIds: string[];
  history: HistoryState[];
  historyIndex: number;
  isLoading: boolean;
  error: string | null;
}
