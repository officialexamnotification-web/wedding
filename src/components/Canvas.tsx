import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  CanvasItem,
  TextElement,
  ImageElement,
  StickerElement,
  QrElement,
  ShapeElement,
  AspectRatioType,
  CANVAS_SIZES,
  PhotoFilterPreset,
} from '../types/editor';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Copy,
  Trash2,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Edit3,
  Crop,
} from 'lucide-react';

interface CanvasProps {
  aspectRatio: AspectRatioType;
  backgroundType: 'color' | 'gradient' | 'pattern' | 'image';
  backgroundValue: string;
  elements: CanvasItem[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasItem>, commitToHistory?: boolean) => void;
  onCommitCurrentState?: () => void;
  onDeleteElement?: () => void;
  onDuplicateElement?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  zoom: number;
  onZoomChange?: (newZoom: number) => void;
  onOpenPhotoAdjust?: (elem: ImageElement) => void;
}

export function getImageCssFilter(elem: ImageElement): string {
  const parts: string[] = [];
  if (elem.filter && elem.filter !== 'none') {
    parts.push(elem.filter);
  }
  const preset: PhotoFilterPreset = elem.filterPreset || 'none';
  if (preset === 'royal-warm') parts.push('sepia(0.28) saturate(1.35) contrast(1.08)');
  else if (preset === 'vintage-sepia') parts.push('sepia(0.65) contrast(1.05) brightness(0.96)');
  else if (preset === 'vivid-gold') parts.push('saturate(1.5) contrast(1.12) brightness(1.04)');
  else if (preset === 'bw-classic') parts.push('grayscale(1) contrast(1.15)');
  else if (preset === 'rose-tint') parts.push('hue-rotate(-15deg) saturate(1.25) brightness(1.03)');
  else if (preset === 'high-contrast') parts.push('contrast(1.3) saturate(1.2)');

  if (elem.brightness !== undefined && elem.brightness !== 100) {
    parts.push(`brightness(${elem.brightness}%)`);
  }
  if (elem.contrast !== undefined && elem.contrast !== 100) {
    parts.push(`contrast(${elem.contrast}%)`);
  }
  if (elem.saturation !== undefined && elem.saturation !== 100) {
    parts.push(`saturate(${elem.saturation}%)`);
  }
  if (elem.blur !== undefined && elem.blur > 0) {
    parts.push(`blur(${elem.blur}px)`);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function renderShapeVisual(elem: ShapeElement) {
  const strokeColor = elem.strokeColor || '#D4AF37';
  const strokeWidth = elem.strokeWidth ?? 2;
  const fillColor = elem.fillColor || 'transparent';
  const borderStyle = elem.borderStyle || 'solid';

  switch (elem.shapeType) {
    case 'gold-frame':
      return (
        <div
          className="w-full h-full relative pointer-events-none"
          style={{
            border: `${strokeWidth}px ${borderStyle} ${strokeColor}`,
            backgroundColor: fillColor,
            borderRadius: `${elem.borderRadius ?? 8}px`,
          }}
        >
          {/* Inner corner flourishes like royal Canva frame */}
          <div
            className="absolute inset-1.5 pointer-events-none"
            style={{
              border: `1px solid ${strokeColor}`,
              opacity: 0.55,
              borderRadius: `${Math.max(0, (elem.borderRadius ?? 8) - 4)}px`,
            }}
          />
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: strokeColor }} />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: strokeColor }} />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: strokeColor }} />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: strokeColor }} />
        </div>
      );

    case 'ornate-border':
      return (
        <div
          className="w-full h-full relative pointer-events-none"
          style={{
            border: `${Math.max(2, strokeWidth)}px double ${strokeColor}`,
            backgroundColor: fillColor,
            borderRadius: `${elem.borderRadius ?? 12}px`,
            boxShadow: `inset 0 0 0 3px rgba(212,175,55,0.2)`,
          }}
        >
          <div
            className="absolute inset-2 pointer-events-none"
            style={{
              border: `1px dashed ${strokeColor}`,
              opacity: 0.65,
              borderRadius: `${Math.max(0, (elem.borderRadius ?? 12) - 4)}px`,
            }}
          />
        </div>
      );

    case 'divider-line':
      return (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-full flex items-center gap-1.5">
            <div className="w-2 h-2 rotate-45 shrink-0" style={{ backgroundColor: strokeColor }} />
            <div
              className="flex-1"
              style={{
                height: `${Math.max(1, strokeWidth)}px`,
                backgroundColor: strokeColor,
              }}
            />
            <div className="w-2.5 h-2.5 rotate-45 shrink-0 border" style={{ borderColor: strokeColor, backgroundColor: fillColor !== 'transparent' ? fillColor : strokeColor }} />
            <div
              className="flex-1"
              style={{
                height: `${Math.max(1, strokeWidth)}px`,
                backgroundColor: strokeColor,
              }}
            />
            <div className="w-2 h-2 rotate-45 shrink-0" style={{ backgroundColor: strokeColor }} />
          </div>
        </div>
      );

    case 'circle':
      return (
        <div
          className="w-full h-full rounded-full pointer-events-none"
          style={{
            border: `${strokeWidth}px ${borderStyle} ${strokeColor}`,
            backgroundColor: fillColor,
          }}
        />
      );

    case 'arch-frame':
      return (
        <div
          className="w-full h-full pointer-events-none"
          style={{
            border: `${strokeWidth}px ${borderStyle} ${strokeColor}`,
            backgroundColor: fillColor,
            borderRadius: '9999px 9999px 12px 12px',
          }}
        />
      );

    case 'pill-banner':
      return (
        <div
          className="w-full h-full rounded-full pointer-events-none flex items-center justify-center"
          style={{
            border: `${strokeWidth}px ${borderStyle} ${strokeColor}`,
            backgroundColor: fillColor === 'transparent' ? 'rgba(212, 175, 55, 0.14)' : fillColor,
          }}
        />
      );

    case 'diamond':
      return (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div
            className="w-[75%] h-[75%] rotate-45"
            style={{
              border: `${strokeWidth}px ${borderStyle} ${strokeColor}`,
              backgroundColor: fillColor,
            }}
          />
        </div>
      );

    case 'royal-badge':
      return (
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <polygon
            points="100,6 126,25 158,20 169,50 194,69 184,100 194,131 169,150 158,180 126,175 100,194 74,175 42,180 31,150 6,131 16,100 6,69 31,50 42,20 74,25"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.12)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
          <circle
            cx="100"
            cy="100"
            r="74"
            fill="none"
            stroke={strokeColor}
            strokeWidth={Math.max(1, strokeWidth)}
            strokeDasharray="4 4"
          />
        </svg>
      );

    case 'rectangle':
    default:
      return (
        <div
          className="w-full h-full pointer-events-none"
          style={{
            border: `${strokeWidth}px ${borderStyle} ${strokeColor}`,
            backgroundColor: fillColor === 'transparent' ? 'rgba(212, 175, 55, 0.08)' : fillColor,
            borderRadius: `${elem.borderRadius ?? 6}px`,
          }}
        />
      );
  }
}

export const Canvas: React.FC<CanvasProps> = ({
  aspectRatio,
  backgroundType,
  backgroundValue,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onCommitCurrentState,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  zoom,
  onZoomChange,
  onOpenPhotoAdjust,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [elemInitialPos, setElemInitialPos] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    fontSize?: number;
  }>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    rotation: 0,
  });

  // Smart alignment guide lines (Canva magenta snap lines)
  const [snapGuides, setSnapGuides] = useState<{
    vertical: number[];
    horizontal: number[];
  }>({ vertical: [], horizontal: [] });

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const didModifyRef = useRef<boolean>(false);

  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];

  // Calculate perfect fit zoom based on actual container size
  const calculateAutoFit = useCallback(() => {
    if (!containerRef.current || !onZoomChange) return;
    const paddingX = window.innerWidth < 640 ? 24 : 56;
    const paddingY = window.innerWidth < 640 ? 36 : 64;
    const availW = containerRef.current.clientWidth - paddingX;
    const availH = containerRef.current.clientHeight - paddingY;

    if (availW > 50 && availH > 50) {
      const scaleX = availW / dimensions.width;
      const scaleY = availH / dimensions.height;
      const bestScale = Math.min(scaleX, scaleY);
      const clamped = Math.max(0.25, Math.min(1.2, Math.round(bestScale * 100) / 100));
      onZoomChange(clamped);
    }
  }, [dimensions, onZoomChange]);

  // Auto-fit on mount and when aspect ratio changes
  useEffect(() => {
    const timer = setTimeout(() => {
      calculateAutoFit();
    }, 60);

    const handleWindowResize = () => {
      calculateAutoFit();
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [aspectRatio, calculateAutoFit]);

  // Handle click on canvas background to deselect
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || e.target === containerRef.current) {
      onSelectElement(null);
      setEditingTextId(null);
    }
  };

  // Start element dragging (Mouse)
  const handleMouseDown = (e: React.MouseEvent, elem: CanvasItem) => {
    e.stopPropagation();
    onSelectElement(elem.id);

    if (editingTextId === elem.id || elem.locked) return;

    didModifyRef.current = false;
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElemInitialPos({
      x: elem.x,
      y: elem.y,
      width: elem.width,
      height: elem.height,
      rotation: elem.rotation || 0,
      fontSize: elem.type === 'text' ? (elem as TextElement).fontSize : undefined,
    });
  };

  // Start element dragging (Touch)
  const handleTouchStart = (e: React.TouchEvent, elem: CanvasItem) => {
    e.stopPropagation();
    onSelectElement(elem.id);

    if (editingTextId === elem.id || elem.locked) return;

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      didModifyRef.current = false;
      setIsDragging(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setElemInitialPos({
        x: elem.x,
        y: elem.y,
        width: elem.width,
        height: elem.height,
        rotation: elem.rotation || 0,
        fontSize: elem.type === 'text' ? (elem as TextElement).fontSize : undefined,
      });
    }
  };

  // Start element resizing (Mouse)
  const handleResizeStart = (e: React.MouseEvent, handle: string, elem: CanvasItem) => {
    e.stopPropagation();
    if (elem.locked) return;
    didModifyRef.current = false;
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElemInitialPos({
      x: elem.x,
      y: elem.y,
      width: elem.width,
      height: elem.height,
      rotation: elem.rotation || 0,
      fontSize: elem.type === 'text' ? (elem as TextElement).fontSize : undefined,
    });
  };

  // Start element resizing (Touch)
  const handleTouchResizeStart = (e: React.TouchEvent, handle: string, elem: CanvasItem) => {
    e.stopPropagation();
    if (elem.locked) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      didModifyRef.current = false;
      setIsResizing(true);
      setResizeHandle(handle);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setElemInitialPos({
        x: elem.x,
        y: elem.y,
        width: elem.width,
        height: elem.height,
        rotation: elem.rotation || 0,
        fontSize: elem.type === 'text' ? (elem as TextElement).fontSize : undefined,
      });
    }
  };

  // Start element rotation (Mouse)
  const handleRotateStart = (e: React.MouseEvent, elem: CanvasItem) => {
    e.stopPropagation();
    if (elem.locked) return;
    didModifyRef.current = false;
    setIsRotating(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setElemInitialPos({
      x: elem.x,
      y: elem.y,
      width: elem.width,
      height: elem.height,
      rotation: elem.rotation || 0,
    });
  };

  // Start element rotation (Touch)
  const handleTouchRotateStart = (e: React.TouchEvent, elem: CanvasItem) => {
    e.stopPropagation();
    if (elem.locked) return;
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      didModifyRef.current = false;
      setIsRotating(true);
      setDragStart({ x: touch.clientX, y: touch.clientY });
      setElemInitialPos({
        x: elem.x,
        y: elem.y,
        width: elem.width,
        height: elem.height,
        rotation: elem.rotation || 0,
      });
    }
  };

  // Unified position, resize & rotation movement logic with Canva Smart Magnetic Snapping
  const processMovement = useCallback(
    (clientX: number, clientY: number) => {
      if (!selectedElementId) return;

      const currentElem = elements.find((item) => item.id === selectedElementId);
      if (!currentElem || currentElem.locked) return;

      didModifyRef.current = true;

      if (isDragging) {
        const deltaX = (clientX - dragStart.x) / zoom;
        const deltaY = (clientY - dragStart.y) / zoom;

        let rawX = Math.round(elemInitialPos.x + deltaX);
        let rawY = Math.round(elemInitialPos.y + deltaY);

        const activeVerticalGuides: number[] = [];
        const activeHorizontalGuides: number[] = [];
        const SNAP_THRESHOLD = 5;

        const elemCenterX = rawX + currentElem.width / 2;
        const elemCenterY = rawY + currentElem.height / 2;
        const canvasCenterX = dimensions.width / 2;
        const canvasCenterY = dimensions.height / 2;

        // 1. Snap to Artboard Center X & Y
        if (Math.abs(elemCenterX - canvasCenterX) < SNAP_THRESHOLD) {
          rawX = Math.round(canvasCenterX - currentElem.width / 2);
          activeVerticalGuides.push(canvasCenterX);
        }
        if (Math.abs(elemCenterY - canvasCenterY) < SNAP_THRESHOLD) {
          rawY = Math.round(canvasCenterY - currentElem.height / 2);
          activeHorizontalGuides.push(canvasCenterY);
        }

        // 2. Snap to Safe Margin (20px)
        if (Math.abs(rawX - 20) < SNAP_THRESHOLD) {
          rawX = 20;
          activeVerticalGuides.push(20);
        }
        if (Math.abs(rawX + currentElem.width - (dimensions.width - 20)) < SNAP_THRESHOLD) {
          rawX = dimensions.width - 20 - currentElem.width;
          activeVerticalGuides.push(dimensions.width - 20);
        }
        if (Math.abs(rawY - 20) < SNAP_THRESHOLD) {
          rawY = 20;
          activeHorizontalGuides.push(20);
        }
        if (Math.abs(rawY + currentElem.height - (dimensions.height - 20)) < SNAP_THRESHOLD) {
          rawY = dimensions.height - 20 - currentElem.height;
          activeHorizontalGuides.push(dimensions.height - 20);
        }

        // 3. Snap to other elements' centers/edges
        elements.forEach((other) => {
          if (other.id === currentElem.id || other.hidden) return;
          const otherCenterX = other.x + other.width / 2;
          const otherCenterY = other.y + other.height / 2;

          if (Math.abs(rawX - other.x) < SNAP_THRESHOLD) {
            rawX = other.x;
            activeVerticalGuides.push(other.x);
          } else if (Math.abs(elemCenterX - otherCenterX) < SNAP_THRESHOLD) {
            rawX = Math.round(otherCenterX - currentElem.width / 2);
            activeVerticalGuides.push(otherCenterX);
          }

          if (Math.abs(rawY - other.y) < SNAP_THRESHOLD) {
            rawY = other.y;
            activeHorizontalGuides.push(other.y);
          } else if (Math.abs(elemCenterY - otherCenterY) < SNAP_THRESHOLD) {
            rawY = Math.round(otherCenterY - currentElem.height / 2);
            activeHorizontalGuides.push(otherCenterY);
          }
        });

        setSnapGuides({
          vertical: Array.from(new Set(activeVerticalGuides)),
          horizontal: Array.from(new Set(activeHorizontalGuides)),
        });

        onUpdateElement(selectedElementId, {
          x: rawX,
          y: rawY,
        });
      } else if (isResizing && resizeHandle) {
        const deltaX = (clientX - dragStart.x) / zoom;
        const deltaY = (clientY - dragStart.y) / zoom;

        let newWidth = elemInitialPos.width;
        let newHeight = elemInitialPos.height;
        let newX = elemInitialPos.x;
        let newY = elemInitialPos.y;

        if (resizeHandle.includes('e')) {
          newWidth = Math.max(24, elemInitialPos.width + deltaX);
        }
        if (resizeHandle.includes('s')) {
          newHeight = Math.max(16, elemInitialPos.height + deltaY);
        }
        if (resizeHandle.includes('w')) {
          const possibleWidth = elemInitialPos.width - deltaX;
          if (possibleWidth >= 24) {
            newWidth = possibleWidth;
            newX = elemInitialPos.x + deltaX;
          }
        }
        if (resizeHandle.includes('n')) {
          const possibleHeight = elemInitialPos.height - deltaY;
          if (possibleHeight >= 16) {
            newHeight = possibleHeight;
            newY = elemInitialPos.y + deltaY;
          }
        }

        const updates: Partial<CanvasItem> = {
          width: Math.round(newWidth),
          height: Math.round(newHeight),
          x: Math.round(newX),
          y: Math.round(newY),
        };

        // Canva-like corner scaling for text: scale fontSize proportionally when dragging corner handles
        if (
          currentElem.type === 'text' &&
          elemInitialPos.fontSize &&
          (resizeHandle === 'se' || resizeHandle === 'nw' || resizeHandle === 'ne' || resizeHandle === 'sw')
        ) {
          const scaleRatio = newWidth / Math.max(1, elemInitialPos.width);
          (updates as Partial<TextElement>).fontSize = Math.max(
            8,
            Math.min(140, Math.round(elemInitialPos.fontSize * scaleRatio))
          );
        }

        onUpdateElement(selectedElementId, updates);
      } else if (isRotating && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const centerX = rect.left + (elemInitialPos.x + elemInitialPos.width / 2) * zoom;
        const centerY = rect.top + (elemInitialPos.y + elemInitialPos.height / 2) * zoom;
        const angleRad = Math.atan2(clientY - centerY, clientX - centerX);
        let angleDeg = Math.round((angleRad * 180) / Math.PI + 90);
        if (angleDeg < 0) angleDeg += 360;

        // Snap rotation to 0, 45, 90, 135, 180, 225, 270, 315 within 4 degrees
        const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315, 360];
        for (const snap of snapAngles) {
          if (Math.abs(angleDeg - snap) <= 4) {
            angleDeg = snap === 360 ? 0 : snap;
            break;
          }
        }

        onUpdateElement(selectedElementId, { rotation: angleDeg });
      }
    },
    [
      selectedElementId,
      elements,
      isDragging,
      isResizing,
      isRotating,
      resizeHandle,
      dragStart,
      elemInitialPos,
      zoom,
      dimensions,
      onUpdateElement,
    ]
  );

  const rafRef = useRef<number | null>(null);
  const pendingPosRef = useRef<{ clientX: number; clientY: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      pendingPosRef.current = { clientX: e.clientX, clientY: e.clientY };
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          if (pendingPosRef.current) {
            processMovement(pendingPosRef.current.clientX, pendingPosRef.current.clientY);
          }
          rafRef.current = null;
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        e.preventDefault();
        pendingPosRef.current = { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        if (!rafRef.current) {
          rafRef.current = requestAnimationFrame(() => {
            if (pendingPosRef.current) {
              processMovement(pendingPosRef.current.clientX, pendingPosRef.current.clientY);
            }
            rafRef.current = null;
          });
        }
      }
    };

    const handleEnd = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setIsDragging(false);
      setIsResizing(false);
      setIsRotating(false);
      setResizeHandle(null);
      setSnapGuides({ vertical: [], horizontal: [] });
      if (didModifyRef.current && onCommitCurrentState) {
        onCommitCurrentState();
        didModifyRef.current = false;
      }
    };

    if (isDragging || isResizing || isRotating) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleEnd);
      window.addEventListener('touchcancel', handleEnd);
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
    };
  }, [isDragging, isResizing, isRotating, processMovement, onCommitCurrentState]);

  // Keyboard navigation / nudging + Delete / Duplicate shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement;

      if (!selectedElementId || editingTextId || isInput) return;

      const currentElem = elements.find((item) => item.id === selectedElementId);
      if (!currentElem) return;

      const step = e.shiftKey ? 10 : 1;

      if (e.key === 'ArrowLeft' && !currentElem.locked) {
        e.preventDefault();
        onUpdateElement(selectedElementId, { x: currentElem.x - step }, true);
      } else if (e.key === 'ArrowRight' && !currentElem.locked) {
        e.preventDefault();
        onUpdateElement(selectedElementId, { x: currentElem.x + step }, true);
      } else if (e.key === 'ArrowUp' && !currentElem.locked) {
        e.preventDefault();
        onUpdateElement(selectedElementId, { y: currentElem.y - step }, true);
      } else if (e.key === 'ArrowDown' && !currentElem.locked) {
        e.preventDefault();
        onUpdateElement(selectedElementId, { y: currentElem.y + step }, true);
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !currentElem.locked) {
        e.preventDefault();
        if (onDeleteElement) onDeleteElement();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (onDuplicateElement) onDuplicateElement();
      } else if (e.key === 'Escape') {
        onSelectElement(null);
        setEditingTextId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedElementId,
    editingTextId,
    elements,
    onUpdateElement,
    onSelectElement,
    onDeleteElement,
    onDuplicateElement,
  ]);

  // Render individual element
  const renderElement = (elem: CanvasItem) => {
    if (elem.hidden) return null;

    const isSelected = selectedElementId === elem.id;
    const isEditing = editingTextId === elem.id;
    const isLocked = !!elem.locked;

    const flipTransform = `${elem.flipX ? ' scaleX(-1)' : ''}${elem.flipY ? ' scaleY(-1)' : ''}`;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${elem.x}px`,
      top: `${elem.y}px`,
      width: `${elem.width}px`,
      height: `${elem.height}px`,
      transform: `rotate(${elem.rotation || 0}deg)`,
      opacity: elem.opacity,
      zIndex: elem.zIndex,
      cursor: isEditing ? 'text' : isLocked ? 'default' : 'move',
      userSelect: isEditing ? 'auto' : 'none',
      touchAction: 'none',
    };

    return (
      <div
        key={elem.id}
        style={baseStyle}
        onMouseDown={(e) => handleMouseDown(e, elem)}
        onTouchStart={(e) => handleTouchStart(e, elem)}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (isLocked) return;
          if (elem.type === 'text') {
            setEditingTextId(elem.id);
          } else if (elem.type === 'image' && onOpenPhotoAdjust) {
            onOpenPhotoAdjust(elem as ImageElement);
          }
        }}
        className={`group transition-shadow duration-75 ${
          isSelected
            ? isLocked
              ? 'ring-2 ring-rose-400/90 ring-offset-1 ring-offset-transparent'
              : 'ring-2 ring-amber-400 ring-offset-1 ring-offset-transparent'
            : 'hover:ring-1 hover:ring-amber-400/50'
        }`}
      >
        {/* Flipped inner content wrapper */}
        <div className="w-full h-full" style={{ transform: flipTransform || undefined }}>
          {/* Render TEXT */}
          {elem.type === 'text' && (
            <div className="w-full h-full flex flex-col justify-center">
              {isEditing ? (
                <textarea
                  autoFocus
                  value={(elem as TextElement).text}
                  onChange={(e) => onUpdateElement(elem.id, { text: e.target.value })}
                  onBlur={() => {
                    setEditingTextId(null);
                    if (onCommitCurrentState) onCommitCurrentState();
                  }}
                  className="w-full h-full bg-neutral-900/95 text-amber-200 border-2 border-amber-400 outline-none p-1.5 rounded resize-none shadow-2xl z-50"
                  style={{
                    fontFamily: (elem as TextElement).fontFamily,
                    fontSize: `${(elem as TextElement).fontSize}px`,
                    textAlign: (elem as TextElement).textAlign,
                    letterSpacing: `${(elem as TextElement).letterSpacing}px`,
                    lineHeight: (elem as TextElement).lineHeight,
                    fontWeight: (elem as TextElement).fontWeight,
                    fontStyle: (elem as TextElement).fontStyle,
                  }}
                />
              ) : (
                <div
                  className="whitespace-pre-line break-words w-full select-none"
                  style={{
                    fontFamily: (elem as TextElement).fontFamily,
                    fontSize: `${(elem as TextElement).fontSize}px`,
                    color: (elem as TextElement).color,
                    textAlign: (elem as TextElement).textAlign,
                    fontWeight: (elem as TextElement).fontWeight,
                    fontStyle: (elem as TextElement).fontStyle,
                    textDecoration: (elem as TextElement).textDecoration || 'none',
                    letterSpacing: `${(elem as TextElement).letterSpacing}px`,
                    lineHeight: (elem as TextElement).lineHeight,
                    textTransform: (elem as TextElement).textTransform || 'none',
                    backgroundColor: (elem as TextElement).backgroundColor || undefined,
                    padding: (elem as TextElement).backgroundPadding
                      ? `${(elem as TextElement).backgroundPadding}px`
                      : undefined,
                    borderRadius: (elem as TextElement).backgroundColor ? '6px' : undefined,
                    WebkitTextStroke:
                      (elem as TextElement).strokeWidth && (elem as TextElement).strokeWidth! > 0
                        ? `${(elem as TextElement).strokeWidth}px ${(elem as TextElement).strokeColor || '#000'}`
                        : undefined,
                    textShadow: (elem as TextElement).shadow
                      ? `${(elem as TextElement).shadow?.offsetX}px ${(elem as TextElement).shadow?.offsetY}px ${(elem as TextElement).shadow?.blur}px ${(elem as TextElement).shadow?.color}`
                      : undefined,
                  }}
                >
                  {(elem as TextElement).text}
                </div>
              )}
            </div>
          )}

          {/* Render STICKER */}
          {elem.type === 'sticker' && (
            <div
              className="w-full h-full flex items-center justify-center pointer-events-none [&>svg]:w-full [&>svg]:h-full"
              style={{ color: (elem as StickerElement).color }}
              dangerouslySetInnerHTML={{ __html: (elem as StickerElement).svgContent }}
            />
          )}

          {/* Render SHAPE */}
          {elem.type === 'shape' && renderShapeVisual(elem as ShapeElement)}

          {/* Render IMAGE */}
          {elem.type === 'image' && (
            <div
              className="w-full h-full overflow-hidden relative"
              style={{
                borderRadius:
                  (elem as ImageElement).mask === 'circle'
                    ? '9999px'
                    : (elem as ImageElement).mask === 'arch'
                    ? '9999px 9999px 12px 12px'
                    : (elem as ImageElement).mask === 'rounded'
                    ? `${(elem as ImageElement).borderRadius || 16}px`
                    : '0px',
                clipPath:
                  (elem as ImageElement).mask === 'heart'
                    ? 'polygon(50% 15%, 80% 0%, 100% 25%, 100% 60%, 50% 95%, 0% 60%, 0% 25%, 20% 0%)'
                    : (elem as ImageElement).mask === 'diamond'
                    ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                    : (elem as ImageElement).mask === 'octagon'
                    ? 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                    : undefined,
                borderWidth: `${(elem as ImageElement).borderWidth || 0}px`,
                borderColor: (elem as ImageElement).borderColor || '#D4AF37',
                borderStyle: (elem as ImageElement).borderWidth ? 'solid' : 'none',
                filter: getImageCssFilter(elem as ImageElement),
              }}
            >
              <img
                src={(elem as ImageElement).src}
                alt="Invitation asset"
                referrerPolicy="no-referrer"
                className="w-full h-full select-none pointer-events-none"
                style={{
                  objectFit: (elem as ImageElement).objectFit || 'cover',
                  transform: `scale(${(elem as ImageElement).scale || 1}) translate(${
                    (elem as ImageElement).offsetX || 0
                  }%, ${(elem as ImageElement).offsetY || 0}%) rotate(${
                    (elem as ImageElement).rotationInside || 0
                  }deg)`,
                }}
              />
            </div>
          )}

          {/* Render QR CODE */}
          {elem.type === 'qr' && (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-1.5 rounded-lg shadow-md border border-amber-500/40"
              style={{ backgroundColor: (elem as QrElement).backgroundColor || '#FFF4D6' }}
            >
              <img
                src={(elem as QrElement).dataUrl}
                alt={(elem as QrElement).label}
                className="w-full h-full object-contain pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* Floating Quick Action Pill Bar (Canva Style) */}
        {isSelected && !isEditing && !isDragging && !isResizing && !isRotating && (
          <div
            onMouseDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
            className="absolute -top-11 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 bg-neutral-900/95 border border-neutral-700 text-neutral-200 px-2 py-1 rounded-full shadow-2xl backdrop-blur-md whitespace-nowrap"
          >
            {elem.type === 'text' && !isLocked && (
              <button
                onClick={() => setEditingTextId(elem.id)}
                className="p-1 hover:bg-neutral-800 hover:text-amber-300 rounded-full transition"
                title="Edit Text (Double Click)"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            {elem.type === 'image' && !isLocked && onOpenPhotoAdjust && (
              <button
                onClick={() => onOpenPhotoAdjust(elem as ImageElement)}
                className="p-1 hover:bg-neutral-800 hover:text-amber-300 rounded-full transition"
                title="Crop & Adjust Photo"
              >
                <Crop className="w-3.5 h-3.5" />
              </button>
            )}
            {onBringForward && !isLocked && (
              <button
                onClick={onBringForward}
                className="p-1 hover:bg-neutral-800 hover:text-amber-300 rounded-full transition"
                title="Bring Forward"
              >
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            )}
            {onSendBackward && !isLocked && (
              <button
                onClick={onSendBackward}
                className="p-1 hover:bg-neutral-800 hover:text-amber-300 rounded-full transition"
                title="Send Backward"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </button>
            )}
            {onDuplicateElement && !isLocked && (
              <button
                onClick={onDuplicateElement}
                className="p-1 hover:bg-neutral-800 hover:text-amber-300 rounded-full transition"
                title="Duplicate (Ctrl+D)"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onUpdateElement(elem.id, { locked: !isLocked }, true)}
              className={`p-1 rounded-full transition ${
                isLocked
                  ? 'bg-rose-500/20 text-rose-300 hover:bg-rose-500/30'
                  : 'hover:bg-neutral-800 hover:text-amber-300'
              }`}
              title={isLocked ? 'Unlock Element' : 'Lock Element Position'}
            >
              {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            </button>
            {onDeleteElement && !isLocked && (
              <button
                onClick={onDeleteElement}
                className="p-1 hover:bg-rose-950/80 text-rose-400 hover:text-rose-300 rounded-full transition"
                title="Delete (Del)"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}

        {/* 8 RESIZE HANDLES & ROTATION HANDLE when selected and unlocked */}
        {isSelected && !isEditing && !isLocked && (
          <>
            {/* 4 Corner Handles */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'nw', elem)}
              onTouchStart={(e) => handleTouchResizeStart(e, 'nw', elem)}
              className="absolute -top-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full cursor-nwse-resize z-30 shadow-md touch-none hover:scale-125 transition-transform"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'ne', elem)}
              onTouchStart={(e) => handleTouchResizeStart(e, 'ne', elem)}
              className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full cursor-nesw-resize z-30 shadow-md touch-none hover:scale-125 transition-transform"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'sw', elem)}
              onTouchStart={(e) => handleTouchResizeStart(e, 'sw', elem)}
              className="absolute -bottom-2 -left-2 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full cursor-nesw-resize z-30 shadow-md touch-none hover:scale-125 transition-transform"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'se', elem)}
              onTouchStart={(e) => handleTouchResizeStart(e, 'se', elem)}
              className="absolute -bottom-2 -right-2 w-3.5 h-3.5 bg-white border-2 border-amber-500 rounded-full cursor-nwse-resize z-30 shadow-md touch-none hover:scale-125 transition-transform"
            />

            {/* 4 Edge Pill Handles (N, S, E, W) like Canva */}
            <div
              onMouseDown={(e) => handleResizeStart(e, 'n', elem)}
              onTouchStart={(e) => handleTouchResizeStart(e, 'n', elem)}
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-2 bg-white border border-amber-500 rounded-full cursor-ns-resize z-30 shadow touch-none hover:scale-110 transition-transform"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 's', elem)}
              onTouchStart={(e) => handleTouchResizeStart(e, 's', elem)}
              className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-2 bg-white border border-amber-500 rounded-full cursor-ns-resize z-30 shadow touch-none hover:scale-110 transition-transform"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'w', elem)}
              onTouchStart={(e) => handleTouchResizeStart(e, 'w', elem)}
              className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-2 h-5 bg-white border border-amber-500 rounded-full cursor-ew-resize z-30 shadow touch-none hover:scale-110 transition-transform"
            />
            <div
              onMouseDown={(e) => handleResizeStart(e, 'e', elem)}
              onTouchStart={(e) => handleTouchResizeStart(e, 'e', elem)}
              className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-5 bg-white border border-amber-500 rounded-full cursor-ew-resize z-30 shadow touch-none hover:scale-110 transition-transform"
            />

            {/* Bottom Rotation Handle (Canva Style) */}
            <div
              onMouseDown={(e) => handleRotateStart(e, elem)}
              onTouchStart={(e) => handleTouchRotateStart(e, elem)}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-6 h-6 bg-white hover:bg-amber-100 text-neutral-900 border border-amber-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-30 shadow-lg touch-none"
              title={`Rotate (${elem.rotation || 0}°)`}
            >
              <RotateCw className="w-3 h-3" />
            </div>
            {isRotating && (
              <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 bg-neutral-900 text-amber-300 text-[10px] font-mono px-2 py-0.5 rounded shadow border border-amber-500/40 z-40">
                {elem.rotation || 0}°
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const isBgImage =
    backgroundType === 'image' ||
    backgroundValue.startsWith('url(') ||
    backgroundValue.startsWith('http') ||
    backgroundValue.startsWith('/') ||
    backgroundValue.startsWith('data:image');

  const artboardBackgroundStyle: React.CSSProperties = isBgImage
    ? {
        backgroundImage: backgroundValue.startsWith('url(')
          ? backgroundValue
          : `url("${backgroundValue}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: backgroundValue,
      };

  return (
    <div
      ref={containerRef}
      onClick={handleCanvasClick}
      className="flex-1 bg-neutral-950 overflow-auto flex flex-col items-center justify-center p-3 sm:p-6 md:p-8 relative min-h-0 w-full"
      style={{
        backgroundImage: `radial-gradient(circle, #242424 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Centered Artboard Container */}
      <div
        className="transition-transform duration-100 relative shrink-0 flex flex-col items-center justify-center"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'center center',
        }}
      >
        {/* Card Artboard */}
        <div
          ref={canvasRef}
          id="invitation-artboard"
          onClick={handleCanvasClick}
          className="relative rounded-2xl shadow-2xl shadow-black/90 overflow-hidden border border-amber-500/40 ring-1 ring-amber-400/25"
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            ...artboardBackgroundStyle,
          }}
        >
          {/* Subtle Royal Texture Sheen Overlay */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.4) 0%, transparent 60%)',
            }}
          />

          {/* Smart Magnetic Alignment Guides (Canva Pink/Magenta Lines) */}
          {snapGuides.vertical.map((xPos, idx) => (
            <div
              key={`v-${idx}`}
              className="absolute top-0 bottom-0 w-px bg-fuchsia-500 pointer-events-none z-50 shadow-[0_0_6px_#d946ef]"
              style={{ left: `${xPos}px` }}
            />
          ))}
          {snapGuides.horizontal.map((yPos, idx) => (
            <div
              key={`h-${idx}`}
              className="absolute left-0 right-0 h-px bg-fuchsia-500 pointer-events-none z-50 shadow-[0_0_6px_#d946ef]"
              style={{ top: `${yPos}px` }}
            />
          ))}

          {/* Render All Elements sorted by zIndex */}
          {[...elements]
            .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
            .map((elem) => renderElement(elem))}

          {/* Safe-print guide indicator (subtle dashed border) */}
          <div className="absolute inset-4 border border-dashed border-amber-500/15 pointer-events-none rounded" />
        </div>

        {/* Dimension indicator tag below artboard */}
        <div className="text-center mt-3 text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-2 bg-neutral-900/90 px-3 py-1 rounded-full border border-neutral-800 shadow">
          <span>{dimensions.name}</span>
          <span>•</span>
          <span>
            {dimensions.width} × {dimensions.height} px
          </span>
          <span>•</span>
          <span className="text-amber-400 font-semibold">{dimensions.ratioLabel}</span>
        </div>
      </div>

      {/* Floating Quick Fit / Zoom Controls Pill */}
      {onZoomChange && (
        <div className="fixed bottom-20 md:bottom-5 right-4 z-30 flex items-center gap-1.5 bg-neutral-900/95 hover:bg-neutral-900 border border-neutral-700/80 text-neutral-200 px-3 py-1.5 rounded-full shadow-2xl text-xs backdrop-blur-md transition select-none">
          <button
            onClick={() => onZoomChange(Math.max(0.25, zoom - 0.1))}
            className="p-1 hover:text-amber-300 rounded transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-amber-400 font-mono font-medium px-1">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(1.5, zoom + 0.1))}
            className="p-1 hover:text-amber-300 rounded transition"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <div className="h-3 w-px bg-neutral-700 mx-0.5" />
          <button
            onClick={calculateAutoFit}
            className="flex items-center gap-1 text-[11px] bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 px-2 py-0.5 rounded-full transition font-semibold"
            title="Fit invitation card to screen without clipping"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Fit Screen</span>
          </button>
        </div>
      )}
    </div>
  );
};
