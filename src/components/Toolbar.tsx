import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Lock,
  Unlock,
  ZoomIn,
  FlipHorizontal,
  FlipVertical,
  SlidersHorizontal,
  Move,
  CaseUpper,
  Sun,
  QrCode,
  PaintRoller,
  Play,
  Spline,
  Eye,
  Grid,
  Ruler,
  Wand2,
  Link2,
  ChevronDown,
  Check,
  Palette,
  Table2,
  BarChart3,
  LayoutGrid,
  Clock,
  Barcode,
  Plus,
  Minus,
  Info,
  Square,
  Upload,
} from 'lucide-react';
import {
  CanvasItem,
  TextElement,
  ImageElement,
  StickerElement,
  QrElement,
  ShapeElement,
  DrawingElement,
  TableElement,
  ChartElement,
  GridElement,
  CountdownElement,
  BarcodeElement,
  AspectRatioType,
  CANVAS_SIZES,
  PhotoFilterPreset,
  TextEffectType,
  ElementAnimationType,
  BlendModeType,
  DrawBrushSettings,
  ChartVariant,
  GridLayoutVariant,
} from '../types/editor';
import { generateQrDataUrl } from '../utils/qrHelper';

interface ToolbarProps {
  selectedElement: CanvasItem | null;
  aspectRatio: AspectRatioType;
  onUpdateElement: (updated: Partial<CanvasItem>, commitToHistory?: boolean) => void;
  onDeleteElement: () => void;
  onDuplicateElement: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onOpenPhotoAdjust?: () => void;
  copiedStyle?: Partial<CanvasItem> | null;
  onCopyStyle?: () => void;
  showRulers?: boolean;
  onToggleRulers?: () => void;
  showSafeZones?: boolean;
  onToggleSafeZones?: () => void;
  drawBrush?: DrawBrushSettings;
  onExitDrawMode?: () => void;
  onDistributeElements?: (axis: 'horizontal' | 'vertical' | 'tidy') => void;
}

export const FONT_OPTIONS = [
  { name: 'Cinzel (Royal Serif)', family: "'Cinzel', serif", sample: 'ROYAL VIVAH' },
  { name: 'Playfair Display (Luxury)', family: "'Playfair Display', serif", sample: 'Luxury Invite' },
  { name: 'Rozha One (Devanagari Royal)', family: "'Rozha One', serif", sample: 'शुभ विवाह' },
  { name: 'Tiro Devanagari (Shloka)', family: "'Tiro Devanagari Hindi', serif", sample: 'श्री गणेशाय नमः' },
  { name: 'Kalam (Handwritten Hindi)', family: "'Kalam', cursive", sample: 'स्नेहिल निमंत्रण' },
  { name: 'Alex Brush (Calligraphy)', family: "'Alex Brush', cursive", sample: 'Siddharth & Ananya' },
  { name: 'Great Vibes (Script)', family: "'Great Vibes', cursive", sample: 'Save the Date' },
  { name: 'Cormorant Garamond (Editorial)', family: "'Cormorant Garamond', serif", sample: 'The Royal Palace' },
  { name: 'Montserrat (Modern Clean)', family: "'Montserrat', sans-serif", sample: 'GRAND RECEPTION' },
  { name: 'Tangerine (Graceful Cursive)', family: "'Tangerine', cursive", sample: 'Together Forever' },
];

export const ROYAL_SWATCHES = [
  '#FFEAA7',
  '#F5D77F',
  '#D4AF37',
  '#FFF2C6',
  '#FFFFFF',
  '#FFD700',
  '#E6C665',
  '#C41E3A',
  '#E11D48',
  '#0D5C3A',
  '#10B981',
  '#1B2A4A',
  '#38BDF8',
  '#9333EA',
  '#4A0404',
  '#171717',
];

export const FILTER_PRESETS: { id: PhotoFilterPreset; label: string; badge?: string }[] = [
  { id: 'none', label: 'Normal (Original)' },
  { id: 'royal-warm', label: 'Royal Warm', badge: 'Popular' },
  { id: 'vivid-gold', label: 'Vivid Gold', badge: 'Pro' },
  { id: 'festive-glow', label: 'Festive Glow', badge: 'New' },
  { id: 'golden-hour', label: 'Golden Hour' },
  { id: 'vintage-sepia', label: 'Heritage Sepia' },
  { id: 'rose-tint', label: 'Rose Velvet' },
  { id: 'cinematic-teal', label: 'Cinematic Palace' },
  { id: 'soft-pastel', label: 'Soft Pastel' },
  { id: 'high-contrast', label: 'Studio HD' },
  { id: 'dramatic-noir', label: 'Dramatic Noir' },
  { id: 'bw-classic', label: 'B&W Classic' },
];

export const TEXT_EFFECT_PRESETS: {
  id: TextEffectType;
  label: string;
  desc: string;
  previewStyle: React.CSSProperties;
}[] = [
  {
    id: 'none',
    label: 'None',
    desc: 'Clean standard typography',
    previewStyle: { color: '#FFEAA7' },
  },
  {
    id: 'shadow',
    label: 'Shadow',
    desc: 'Classic directional drop shadow',
    previewStyle: { color: '#FFEAA7', textShadow: '2px 3px 5px rgba(0,0,0,0.9)' },
  },
  {
    id: 'lift',
    label: 'Lift',
    desc: 'Soft ambient elevation glow',
    previewStyle: { color: '#FFFFFF', textShadow: '0 6px 18px rgba(0,0,0,0.85)' },
  },
  {
    id: 'hollow',
    label: 'Hollow',
    desc: 'Transparent fill with crisp outline',
    previewStyle: {
      color: 'transparent',
      WebkitTextStroke: '1.5px #FFEAA7',
    },
  },
  {
    id: 'splice',
    label: 'Splice',
    desc: 'Outline with offset dual shadow',
    previewStyle: {
      color: '#D4AF37',
      WebkitTextStroke: '1px #FFFFFF',
      textShadow: '3px 3px 0px #800020',
    },
  },
  {
    id: 'outline',
    label: 'Outline',
    desc: 'Solid text with outer border stroke',
    previewStyle: {
      color: '#FFF2C6',
      WebkitTextStroke: '1.2px #4A0404',
    },
  },
  {
    id: 'echo',
    label: 'Echo',
    desc: 'Layered triple motion shadow',
    previewStyle: {
      color: '#FFEAA7',
      textShadow: '2px 2px 0px rgba(212,175,55,0.5), 4px 4px 0px rgba(212,175,55,0.25)',
    },
  },
  {
    id: 'glitch',
    label: 'Glitch',
    desc: 'Cyber chromatic split effect',
    previewStyle: {
      color: '#FFFFFF',
      textShadow: '-2px 0 #00FFFF, 2px 0 #FF0055',
    },
  },
  {
    id: 'neon',
    label: 'Royal Neon',
    desc: 'Luminous glowing gold aura',
    previewStyle: {
      color: '#FFF9DB',
      textShadow: '0 0 6px #FFD700, 0 0 14px #D4AF37, 0 0 24px #F59E0B',
    },
  },
  {
    id: 'background',
    label: 'Background Pill',
    desc: 'Velvet badge behind text',
    previewStyle: {
      color: '#FFEAA7',
      backgroundColor: '#4A0404',
      padding: '2px 8px',
      borderRadius: '6px',
    },
  },
];

export const ANIMATION_PRESETS: {
  id: ElementAnimationType;
  label: string;
  desc: string;
  badge?: string;
}[] = [
  { id: 'none', label: 'None', desc: 'Static element' },
  { id: 'rise', label: 'Rise', desc: 'Smooth upward entrance', badge: 'Popular' },
  { id: 'pan', label: 'Pan', desc: 'Graceful horizontal slide' },
  { id: 'fade', label: 'Fade', desc: 'Gentle opacity reveal' },
  { id: 'pop', label: 'Pop', desc: 'Energetic spring bounce', badge: 'Fun' },
  { id: 'breathe', label: 'Breathe', desc: 'Continuous subtle zoom pulse', badge: 'Royal' },
  { id: 'drift', label: 'Drift', desc: 'Floating cinematic motion' },
  { id: 'tumble', label: 'Tumble', desc: 'Playful spin & entrance' },
  { id: 'neon-pulse', label: 'Golden Pulse', desc: 'Shimmering aura pulse', badge: 'Pro' },
  { id: 'typewriter', label: 'Typewriter', desc: 'Letter by letter reveal' },
  { id: 'stomp', label: 'Stomp', desc: 'Bold impact entrance' },
  { id: 'scrapbook', label: 'Scrapbook', desc: 'Handcrafted stop-motion tilt' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  selectedElement,
  aspectRatio,
  onUpdateElement,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  onOpenPhotoAdjust,
  copiedStyle,
  onCopyStyle,
  showRulers = false,
  onToggleRulers,
  showSafeZones = true,
  onToggleSafeZones,
  drawBrush,
  onExitDrawMode,
  onDistributeElements,
}) => {
  const [openPopover, setOpenPopover] = useState<
    | 'none'
    | 'font'
    | 'color'
    | 'position'
    | 'spacing'
    | 'effects'
    | 'curve'
    | 'animate'
    | 'transparency'
    | 'qr'
    | 'border'
    | 'shadow'
    | 'link'
    | 'table-edit'
    | 'chart-edit'
    | 'grid-edit'
    | 'countdown-edit'
    | 'barcode-edit'
    | 'shape-text'
    | 'info'
  >('none');

  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];

  // If Freehand Draw Mode is active, show Draw Mode status bar in Toolbar
  if (drawBrush?.isEnabled) {
    return (
      <div className="h-11 bg-gradient-to-r from-amber-950/90 via-neutral-900 to-neutral-950 border-b border-amber-500/40 px-4 flex items-center justify-between text-xs text-neutral-200 select-none z-30">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-neutral-950 font-bold text-[11px] flex items-center gap-1.5 shadow">
            <Sparkles className="w-3.5 h-3.5" />
            Canva Draw Mode Active ({drawBrush.brushType.toUpperCase()})
          </span>
          <div className="flex items-center gap-2 text-neutral-300">
            <span>Color:</span>
            <span
              className="w-4 h-4 rounded-full border border-white/40 inline-block"
              style={{ backgroundColor: drawBrush.color }}
            />
            <span>• Size: {drawBrush.strokeWidth}px</span>
            <span>• Opacity: {Math.round(drawBrush.opacity * 100)}%</span>
          </div>
        </div>
        {onExitDrawMode && (
          <button
            onClick={onExitDrawMode}
            className="px-3 py-1 bg-neutral-800 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-bold rounded-lg border border-amber-500/40 transition"
          >
            Done Drawing ✓
          </button>
        )}
      </div>
    );
  }

  // When no element is selected: show Canva Canvas View Controls bar
  if (!selectedElement) {
    return (
      <div className="h-11 bg-neutral-900/95 border-b border-neutral-800 px-3 sm:px-4 flex items-center justify-between text-xs text-neutral-400 select-none shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-neutral-200 font-medium text-[11px] sm:text-xs">
            Canva Pro Studio: Click any element on the card to unlock contextual tools
          </span>
        </div>

        {/* Right Canvas View Guides (Rulers & Print Margins) */}
        <div className="flex items-center gap-2 shrink-0">
          {onToggleRulers && (
            <button
              onClick={onToggleRulers}
              className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 transition ${
                showRulers
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
              }`}
              title="Toggle Canva Pixel Rulers"
            >
              <Ruler className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rulers</span>
            </button>
          )}
          {onToggleSafeZones && (
            <button
              onClick={onToggleSafeZones}
              className={`px-2.5 py-1 rounded-lg border text-[11px] flex items-center gap-1.5 transition ${
                showSafeZones
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
              }`}
              title="Toggle Print Bleed & Safe Margin Guides"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Guides</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  const isText = selectedElement.type === 'text';
  const isImage = selectedElement.type === 'image';
  const isSticker = selectedElement.type === 'sticker';
  const isQr = selectedElement.type === 'qr';
  const isShape = selectedElement.type === 'shape';
  const isDrawing = selectedElement.type === 'drawing';
  const isTable = selectedElement.type === 'table';
  const isChart = selectedElement.type === 'chart';
  const isGrid = selectedElement.type === 'grid';
  const isCountdown = selectedElement.type === 'countdown';
  const isBarcode = selectedElement.type === 'barcode';
  const isLocked = !!selectedElement.locked;

  // Apply Canva Text Effect Preset
  const handleSelectTextEffect = (effect: TextEffectType) => {
    const t = selectedElement as TextElement;
    if (effect === 'none') {
      onUpdateElement(
        {
          effectType: 'none',
          shadow: undefined,
          strokeWidth: 0,
          backgroundColor: undefined,
        },
        true
      );
    } else if (effect === 'shadow') {
      onUpdateElement(
        {
          effectType: 'shadow',
          shadow: { color: 'rgba(0,0,0,0.85)', blur: 8, offsetX: 2, offsetY: 4 },
          strokeWidth: 0,
          backgroundColor: undefined,
        },
        true
      );
    } else if (effect === 'lift') {
      onUpdateElement(
        {
          effectType: 'lift',
          shadow: { color: 'rgba(0,0,0,0.9)', blur: 18, offsetX: 0, offsetY: 6 },
          strokeWidth: 0,
          backgroundColor: undefined,
        },
        true
      );
    } else if (effect === 'hollow') {
      onUpdateElement(
        {
          effectType: 'hollow',
          strokeColor: t.color || '#FFEAA7',
          strokeWidth: 1.5,
          shadow: undefined,
          backgroundColor: undefined,
        },
        true
      );
    } else if (effect === 'splice') {
      onUpdateElement(
        {
          effectType: 'splice',
          strokeColor: '#FFFFFF',
          strokeWidth: 1.2,
          shadow: { color: '#800020', blur: 0, offsetX: 3, offsetY: 3 },
          backgroundColor: undefined,
        },
        true
      );
    } else if (effect === 'outline') {
      onUpdateElement(
        {
          effectType: 'outline',
          strokeColor: '#2d0610',
          strokeWidth: 2,
          shadow: undefined,
          backgroundColor: undefined,
        },
        true
      );
    } else if (effect === 'echo') {
      onUpdateElement(
        {
          effectType: 'echo',
          shadow: { color: '#D4AF37', blur: 1, offsetX: 4, offsetY: 4 },
          strokeWidth: 0,
          backgroundColor: undefined,
        },
        true
      );
    } else if (effect === 'glitch') {
      onUpdateElement(
        {
          effectType: 'glitch',
          shadow: { color: '#00F0FF', blur: 0, offsetX: -2, offsetY: 1 },
          strokeColor: '#FF0055',
          strokeWidth: 0.8,
        },
        true
      );
    } else if (effect === 'neon') {
      onUpdateElement(
        {
          effectType: 'neon',
          shadow: { color: '#FFD700', blur: 16, offsetX: 0, offsetY: 0 },
          strokeWidth: 0,
          backgroundColor: undefined,
        },
        true
      );
    } else if (effect === 'background') {
      onUpdateElement(
        {
          effectType: 'background',
          backgroundColor: 'rgba(45, 6, 16, 0.85)',
          backgroundPadding: 10,
          backgroundRadius: 10,
        },
        true
      );
    }
  };

  // Align to page helpers
  const alignElement = (mode: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (isLocked) return;
    const margin = 22;
    if (mode === 'left') onUpdateElement({ x: margin }, true);
    if (mode === 'center')
      onUpdateElement({ x: Math.round((dimensions.width - selectedElement.width) / 2) }, true);
    if (mode === 'right')
      onUpdateElement({ x: dimensions.width - selectedElement.width - margin }, true);
    if (mode === 'top') onUpdateElement({ y: margin }, true);
    if (mode === 'middle')
      onUpdateElement({ y: Math.round((dimensions.height - selectedElement.height) / 2) }, true);
    if (mode === 'bottom')
      onUpdateElement({ y: dimensions.height - selectedElement.height - margin }, true);
  };

  // Cycle text case
  const cycleTextTransform = () => {
    const t = selectedElement as TextElement;
    const order: Array<'none' | 'uppercase' | 'capitalize' | 'lowercase'> = [
      'none',
      'uppercase',
      'capitalize',
      'lowercase',
    ];
    const next = order[(order.indexOf(t.textTransform || 'none') + 1) % order.length];
    onUpdateElement({ textTransform: next }, true);
  };

  // Toggle bullet/numbered list formatting on text
  const toggleListFormat = (targetType: 'bullet' | 'number') => {
    const t = selectedElement as TextElement;
    const currentList = t.listType || 'none';
    const rawLines = t.text
      .split('\n')
      .map((line) => line.replace(/^(\s*[•\-]\s+|\s*\d+\.\s+)/, ''));

    if (currentList === targetType) {
      onUpdateElement({ listType: 'none', text: rawLines.join('\n') }, true);
    } else if (targetType === 'bullet') {
      onUpdateElement(
        {
          listType: 'bullet',
          text: rawLines.map((l) => (l.trim() ? `• ${l}` : l)).join('\n'),
        },
        true
      );
    } else {
      onUpdateElement(
        {
          listType: 'number',
          text: rawLines.map((l, idx) => (l.trim() ? `${idx + 1}. ${l}` : l)).join('\n'),
        },
        true
      );
    }
  };

  // Update QR target and regenerate QR code image
  const handleQrTargetChange = async (newValue: string, newColor?: string, newBg?: string) => {
    const qr = selectedElement as QrElement;
    const colorToUse = newColor || qr.color || '#1a0408';
    const bgToUse = newBg || qr.backgroundColor || '#FFF4D6';
    const targetToUse = newValue || qr.targetValue || 'https://maps.google.com';
    const dataUrl = await generateQrDataUrl(targetToUse, colorToUse, bgToUse);
    onUpdateElement(
      {
        targetValue: targetToUse,
        color: colorToUse,
        backgroundColor: bgToUse,
        dataUrl,
      },
      true
    );
  };

  const currentFontObj = isText
    ? FONT_OPTIONS.find((f) => f.family === (selectedElement as TextElement).fontFamily) ||
      FONT_OPTIONS[0]
    : FONT_OPTIONS[0];

  return (
    <div className="h-12 bg-neutral-900 border-b border-neutral-800 px-2.5 sm:px-3 flex items-center justify-between text-neutral-200 text-xs gap-2 select-none z-30 relative shadow-md">
      {/* Left properties specific to element type */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {/* ================= TEXT CONTROLS ================= */}
        {isText && (
          <>
            {/* Rich Font Family Selector Trigger */}
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'font' ? 'none' : 'font')}
              className={`bg-neutral-800 hover:bg-neutral-750 text-xs text-neutral-100 rounded-lg px-2.5 py-1.5 border flex items-center justify-between gap-2 w-36 sm:w-44 shrink-0 transition ${
                openPopover === 'font' ? 'border-amber-400 text-amber-300' : 'border-neutral-700'
              }`}
              title="Canva Font Picker with Live Typography Preview"
            >
              <span
                className="truncate"
                style={{ fontFamily: (selectedElement as TextElement).fontFamily }}
              >
                {currentFontObj.name.split('(')[0].trim()}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            </button>

            {/* Font size stepper */}
            <div className="flex items-center bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden shrink-0">
              <button
                disabled={isLocked}
                onClick={() =>
                  onUpdateElement(
                    {
                      fontSize: Math.max(8, (selectedElement as TextElement).fontSize - 2),
                    },
                    true
                  )
                }
                className="px-2 py-1 hover:bg-neutral-700 text-neutral-300 font-bold"
              >
                −
              </button>
              <input
                disabled={isLocked}
                type="number"
                value={(selectedElement as TextElement).fontSize}
                onChange={(e) =>
                  onUpdateElement({ fontSize: Math.max(8, parseInt(e.target.value) || 12) }, true)
                }
                className="w-10 text-center bg-transparent outline-none text-xs font-mono"
              />
              <button
                disabled={isLocked}
                onClick={() =>
                  onUpdateElement(
                    {
                      fontSize: Math.min(160, (selectedElement as TextElement).fontSize + 2),
                    },
                    true
                  )
                }
                className="px-2 py-1 hover:bg-neutral-700 text-neutral-300 font-bold"
              >
                +
              </button>
            </div>

            {/* Text Color Trigger with Palette Popover */}
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'color' ? 'none' : 'color')}
              className={`flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-750 px-2 py-1 rounded-lg border shrink-0 transition ${
                openPopover === 'color' ? 'border-amber-400' : 'border-neutral-700'
              }`}
              title="Text Color & Metallic Gold Gradients"
            >
              <div className="flex flex-col items-center">
                <span className="font-bold text-xs leading-none">A</span>
                <span
                  className="w-4 h-1 rounded-full mt-0.5"
                  style={{ backgroundColor: (selectedElement as TextElement).color }}
                />
              </div>
            </button>

            {/* Bold / Italic / Underline / Strikethrough / Case */}
            <div className="flex items-center bg-neutral-800 rounded-lg border border-neutral-700 p-0.5 shrink-0">
              <button
                disabled={isLocked}
                onClick={() =>
                  onUpdateElement(
                    {
                      fontWeight:
                        (selectedElement as TextElement).fontWeight === 'bold' ? 'normal' : 'bold',
                    },
                    true
                  )
                }
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).fontWeight === 'bold'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Bold (Ctrl+B)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isLocked}
                onClick={() =>
                  onUpdateElement(
                    {
                      fontStyle:
                        (selectedElement as TextElement).fontStyle === 'italic'
                          ? 'normal'
                          : 'italic',
                    },
                    true
                  )
                }
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).fontStyle === 'italic'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Italic (Ctrl+I)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isLocked}
                onClick={() =>
                  onUpdateElement(
                    {
                      textDecoration:
                        (selectedElement as TextElement).textDecoration === 'underline'
                          ? 'none'
                          : 'underline',
                    },
                    true
                  )
                }
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).textDecoration === 'underline'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Underline (Ctrl+U)"
              >
                <Underline className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isLocked}
                onClick={() =>
                  onUpdateElement(
                    {
                      textDecoration:
                        (selectedElement as TextElement).textDecoration === 'line-through'
                          ? 'none'
                          : 'line-through',
                    },
                    true
                  )
                }
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).textDecoration === 'line-through'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Strikethrough"
              >
                <Strikethrough className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isLocked}
                onClick={cycleTextTransform}
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).textTransform &&
                  (selectedElement as TextElement).textTransform !== 'none'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title={`Change Case: ${(selectedElement as TextElement).textTransform || 'normal'}`}
              >
                <CaseUpper className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Alignment & Lists */}
            <div className="flex items-center bg-neutral-800 rounded-lg border border-neutral-700 p-0.5 shrink-0">
              <button
                disabled={isLocked}
                onClick={() => {
                  const order: Array<'left' | 'center' | 'right' | 'justify'> = [
                    'left',
                    'center',
                    'right',
                    'justify',
                  ];
                  const curr = (selectedElement as TextElement).textAlign || 'center';
                  const next = order[(order.indexOf(curr) + 1) % order.length];
                  onUpdateElement({ textAlign: next }, true);
                }}
                className="p-1.5 rounded text-amber-300 hover:bg-neutral-700 transition"
                title={`Alignment: ${(selectedElement as TextElement).textAlign} (Click to cycle)`}
              >
                {(selectedElement as TextElement).textAlign === 'left' ? (
                  <AlignLeft className="w-3.5 h-3.5" />
                ) : (selectedElement as TextElement).textAlign === 'right' ? (
                  <AlignRight className="w-3.5 h-3.5" />
                ) : (selectedElement as TextElement).textAlign === 'justify' ? (
                  <AlignJustify className="w-3.5 h-3.5" />
                ) : (
                  <AlignCenter className="w-3.5 h-3.5" />
                )}
              </button>
              <button
                disabled={isLocked}
                onClick={() => toggleListFormat('bullet')}
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).listType === 'bullet'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Bullet List"
              >
                <List className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isLocked}
                onClick={() => toggleListFormat('number')}
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).listType === 'number'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Numbered List"
              >
                <ListOrdered className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Spacing Popover Trigger */}
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'spacing' ? 'none' : 'spacing')}
              className={`px-2 py-1.5 rounded-lg border flex items-center gap-1 transition shrink-0 ${
                openPopover === 'spacing'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title="Letter Spacing, Line Height & Vertical Anchor"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden xl:inline">Spacing</span>
            </button>

            {/* Canva Effects Popover Trigger */}
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'effects' ? 'none' : 'effects')}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition shrink-0 ${
                openPopover === 'effects'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:text-white'
              }`}
              title="Canva Text Effects (Shadow, Lift, Hollow, Splice, Neon, Glitch, Pill)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Effects</span>
            </button>

            {/* Canva Curved Text Trigger */}
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'curve' ? 'none' : 'curve')}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition shrink-0 ${
                openPopover === 'curve' || ((selectedElement as TextElement).curveRadius || 0) !== 0
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:text-white'
              }`}
              title="Curved / Arch Text Tool"
            >
              <Spline className="w-3.5 h-3.5 text-amber-400" />
              <span>Curve</span>
            </button>
          </>
        )}

        {/* ================= IMAGE CONTROLS ================= */}
        {isImage && (
          <>
            <button
              disabled={isLocked}
              onClick={onOpenPhotoAdjust}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-500/25 to-amber-500/15 hover:from-amber-500/35 hover:to-amber-500/25 text-amber-300 font-semibold rounded-lg border border-amber-500/50 transition shrink-0 shadow-sm"
              title="Open Canva Edit Photo Studio (Magic BG Remover, Filters, Adjust, Frames)"
            >
              <Wand2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Edit Photo</span>
            </button>

            {/* Filter Presets Dropdown */}
            <div className="flex items-center gap-1 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 shrink-0">
              <Sun className="w-3.5 h-3.5 text-amber-400" />
              <select
                disabled={isLocked}
                value={(selectedElement as ImageElement).filterPreset || 'none'}
                onChange={(e) =>
                  onUpdateElement({ filterPreset: e.target.value as PhotoFilterPreset }, true)
                }
                className="bg-transparent text-xs text-neutral-100 outline-none cursor-pointer"
                title="Photo Filter Preset"
              >
                {FILTER_PRESETS.map((fp) => (
                  <option key={fp.id} value={fp.id} className="bg-neutral-900">
                    {fp.label}
                  </option>
                ))}
              </select>
            </div>

            {/* In-Frame Zoom Slider */}
            <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 shrink-0">
              <ZoomIn className="w-3.5 h-3.5 text-amber-400" />
              <input
                disabled={isLocked}
                type="range"
                min="0.8"
                max="2.5"
                step="0.05"
                value={(selectedElement as ImageElement).scale || 1}
                onChange={(e) => onUpdateElement({ scale: parseFloat(e.target.value) })}
                onMouseUp={() => onUpdateElement({}, true)}
                className="w-14 accent-amber-400 cursor-pointer"
                title="Zoom photo inside frame"
              />
              <span className="text-[10px] font-mono text-neutral-300">
                {Math.round(((selectedElement as ImageElement).scale || 1) * 100)}%
              </span>
            </div>

            {/* Frame Mask Picker */}
            <div className="flex items-center bg-neutral-800 rounded-lg border border-neutral-700 p-0.5 shrink-0">
              {(
                [
                  'arch',
                  'circle',
                  'heart',
                  'lotus',
                  'polaroid',
                  'phone-mockup',
                  'rounded',
                  'none',
                ] as ImageElement['mask'][]
              ).map((mask) => (
                <button
                  disabled={isLocked}
                  key={mask}
                  onClick={() => onUpdateElement({ mask }, true)}
                  className={`px-2 py-1 rounded text-[11px] capitalize transition ${
                    (selectedElement as ImageElement).mask === mask
                      ? 'bg-amber-500/25 text-amber-300 font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {mask.replace('-mockup', '')}
                </button>
              ))}
            </div>

            {/* Canva Border & Corner Rounding Trigger */}
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'border' ? 'none' : 'border')}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition shrink-0 ${
                openPopover === 'border'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:text-white'
              }`}
              title="Border Style, Weight & Corner Rounding"
            >
              <Square className="w-3.5 h-3.5 text-amber-400" />
              <span>Border</span>
            </button>
          </>
        )}

        {/* ================= STICKER CONTROLS ================= */}
        {isSticker && (
          <>
            <span className="text-amber-300 font-semibold text-xs px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20 shrink-0">
              {(selectedElement as StickerElement).name}
            </span>
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'color' ? 'none' : 'color')}
              className="flex items-center gap-1.5 bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700 hover:border-amber-400 shrink-0"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-neutral-200 text-[11px]">Motif Color</span>
              <span
                className="w-4 h-4 rounded-full border border-neutral-600"
                style={{ backgroundColor: (selectedElement as StickerElement).color || '#D4AF37' }}
              />
            </button>
          </>
        )}

        {/* ================= DRAWING CONTROLS ================= */}
        {isDrawing && (
          <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-lg border border-neutral-700">
            <span className="text-amber-300 font-semibold">Freehand Brush Artwork</span>
            <span className="text-neutral-400 text-[11px]">
              ({(selectedElement as DrawingElement).paths?.length || 1} strokes)
            </span>
          </div>
        )}

        {/* ================= QR CODE CONTROLS ================= */}
        {isQr && (
          <>
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'qr' ? 'none' : 'qr')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/40 transition shrink-0"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Edit QR Destination URL</span>
            </button>
            <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 shrink-0">
              <span className="text-neutral-400 text-[11px]">Ink:</span>
              <input
                disabled={isLocked}
                type="color"
                value={(selectedElement as QrElement).color}
                onChange={(e) =>
                  handleQrTargetChange(
                    (selectedElement as QrElement).targetValue,
                    e.target.value,
                    (selectedElement as QrElement).backgroundColor
                  )
                }
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="text-neutral-400 text-[11px] ml-1">Card:</span>
              <input
                disabled={isLocked}
                type="color"
                value={(selectedElement as QrElement).backgroundColor || '#FFF4D6'}
                onChange={(e) =>
                  handleQrTargetChange(
                    (selectedElement as QrElement).targetValue,
                    (selectedElement as QrElement).color,
                    e.target.value
                  )
                }
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
            </div>
          </>
        )}

        {/* ================= SHAPE CONTROLS ================= */}
        {isShape && (
          <>
            <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 shrink-0">
              <span className="text-neutral-300 text-[11px]">Shape:</span>
              <select
                disabled={isLocked}
                value={(selectedElement as ShapeElement).shapeType}
                onChange={(e) =>
                  onUpdateElement({ shapeType: e.target.value as ShapeElement['shapeType'] }, true)
                }
                className="bg-transparent text-xs text-amber-300 font-medium outline-none cursor-pointer"
              >
                <option value="gold-frame" className="bg-neutral-900">Royal Corner Frame</option>
                <option value="ornate-border" className="bg-neutral-900">Double Ornate Border</option>
                <option value="divider-line" className="bg-neutral-900">Diamond Divider Line</option>
                <option value="line-floral" className="bg-neutral-900">Lotus Floral Divider</option>
                <option value="line-arrow-both" className="bg-neutral-900">Double Arrow Line</option>
                <option value="line-dashed" className="bg-neutral-900">Dashed Cut Line</option>
                <option value="arch-frame" className="bg-neutral-900">Jharokha Arch Frame</option>
                <option value="royal-badge" className="bg-neutral-900">Royal Seal Badge</option>
                <option value="scallop-badge" className="bg-neutral-900">Lotus Scallop Seal</option>
                <option value="ribbon-banner" className="bg-neutral-900">Royal Ribbon Banner</option>
                <option value="mandala-ring" className="bg-neutral-900">Mandala Sacred Ring</option>
                <option value="pill-banner" className="bg-neutral-900">Pill Label Banner</option>
                <option value="shield-crest" className="bg-neutral-900">Royal Crest Shield</option>
                <option value="speech-bubble" className="bg-neutral-900">Callout Speech Bubble</option>
                <option value="cloud-badge" className="bg-neutral-900">Cloud Blessing Tag</option>
                <option value="rectangle" className="bg-neutral-900">Rectangle Box</option>
                <option value="circle" className="bg-neutral-900">Circle Ring</option>
                <option value="diamond" className="bg-neutral-900">Diamond Frame</option>
                <option value="star" className="bg-neutral-900">Star Burst</option>
                <option value="hexagon" className="bg-neutral-900">Hexagon Gem</option>
                <option value="pentagon" className="bg-neutral-900">Royal Pentagon</option>
                <option value="triangle" className="bg-neutral-900">Triangle Pyramid</option>
                <option value="heart-shape" className="bg-neutral-900">Royal Heart</option>
                <option value="octagon-frame" className="bg-neutral-900">Octagon Palace Frame</option>
                <option value="parallelogram" className="bg-neutral-900">Slant Tag Banner</option>
                <option value="trapezoid" className="bg-neutral-900">Stage Trapezoid</option>
                <option value="cross-plus" className="bg-neutral-900">Plus Emblem</option>
                <option value="arrow-right" className="bg-neutral-900">Directional Pointer</option>
              </select>
            </div>

            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'shape-text' ? 'none' : 'shape-text')}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-amber-300 font-semibold shrink-0"
              title="Type Text Inside Shape / Banner"
            >
              + Shape Text
            </button>

            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'border' ? 'none' : 'border')}
              className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-200 flex items-center gap-1 shrink-0"
            >
              <Square className="w-3.5 h-3.5 text-amber-400" />
              <span>Stroke & Fill</span>
            </button>
          </>
        )}

        {/* ================= TABLE CONTROLS ================= */}
        {isTable && (
          <>
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'table-edit' ? 'none' : 'table-edit')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/40 transition shrink-0"
            >
              <Table2 className="w-3.5 h-3.5" />
              <span>Edit Table Cells & Rows</span>
            </button>

            <button
              disabled={isLocked}
              onClick={() => {
                const tb = selectedElement as TableElement;
                const cols = tb.rows[0]?.length || 3;
                const newRow = Array(cols).fill('New Event');
                onUpdateElement(
                  { rows: [...tb.rows, newRow], height: tb.height + 36 },
                  true
                );
              }}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-neutral-200 flex items-center gap-1 shrink-0"
            >
              <Plus className="w-3 h-3 text-amber-400" /> Row
            </button>

            <button
              disabled={isLocked}
              onClick={() => {
                const tb = selectedElement as TableElement;
                if (tb.rows.length <= 2) return;
                onUpdateElement(
                  { rows: tb.rows.slice(0, -1), height: Math.max(80, tb.height - 36) },
                  true
                );
              }}
              className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg text-neutral-200 flex items-center gap-1 shrink-0"
            >
              <Minus className="w-3 h-3 text-rose-400" /> Row
            </button>
          </>
        )}

        {/* ================= CHART CONTROLS ================= */}
        {isChart && (
          <>
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'chart-edit' ? 'none' : 'chart-edit')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/40 transition shrink-0"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Edit Chart Data & Type</span>
            </button>

            <select
              disabled={isLocked}
              value={(selectedElement as ChartElement).chartType}
              onChange={(e) =>
                onUpdateElement({ chartType: e.target.value as ChartVariant }, true)
              }
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-2 py-1 text-xs text-amber-300 outline-none"
            >
              <option value="bar">Vertical Bar</option>
              <option value="horizontal-bar">Horizontal Bar</option>
              <option value="donut">Donut Ring</option>
              <option value="pie">Pie Chart</option>
              <option value="line">Line Graph</option>
              <option value="progress-rings">Progress Rings</option>
            </select>
          </>
        )}

        {/* ================= COLLAGE GRID CONTROLS ================= */}
        {isGrid && (
          <>
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'grid-edit' ? 'none' : 'grid-edit')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/40 transition shrink-0"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Customize Grid Photos & Spacing</span>
            </button>
          </>
        )}

        {/* ================= COUNTDOWN CONTROLS ================= */}
        {isCountdown && (
          <button
            disabled={isLocked}
            onClick={() =>
              setOpenPopover(openPopover === 'countdown-edit' ? 'none' : 'countdown-edit')
            }
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/40 transition shrink-0"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Edit Muhurat Date & Countdown Style</span>
          </button>
        )}

        {/* ================= BARCODE CONTROLS ================= */}
        {isBarcode && (
          <button
            disabled={isLocked}
            onClick={() =>
              setOpenPopover(openPopover === 'barcode-edit' ? 'none' : 'barcode-edit')
            }
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/40 transition shrink-0"
          >
            <Barcode className="w-3.5 h-3.5" />
            <span>Edit Entry Pass Barcode</span>
          </button>
        )}

        {/* ================= UNIVERSAL FLIP & DROP SHADOW ================= */}
        <div className="flex items-center bg-neutral-800 rounded-lg border border-neutral-700 p-0.5 shrink-0">
          <button
            disabled={isLocked}
            onClick={() => onUpdateElement({ flipX: !selectedElement.flipX }, true)}
            className={`p-1.5 rounded transition ${
              selectedElement.flipX
                ? 'bg-amber-500/25 text-amber-300'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={isLocked}
            onClick={() => onUpdateElement({ flipY: !selectedElement.flipY }, true)}
            className={`p-1.5 rounded transition ${
              selectedElement.flipY
                ? 'bg-amber-500/25 text-amber-300'
                : 'text-neutral-400 hover:text-neutral-200'
            }`}
            title="Flip Vertical"
          >
            <FlipVertical className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Universal Drop Shadow Popover Button */}
        <button
          disabled={isLocked}
          onClick={() => setOpenPopover(openPopover === 'shadow' ? 'none' : 'shadow')}
          className={`px-2 py-1.5 rounded-lg border text-[11px] flex items-center gap-1 shrink-0 transition ${
            openPopover === 'shadow' || selectedElement.dropShadow?.enabled
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
              : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
          }`}
          title="Drop Shadow / Glow"
        >
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden 2xl:inline">Shadow</span>
        </button>
      </div>

      {/* Right Universal Canva Actions (Animate, Position, Transparency, Link, Copy Style, Lock, Duplicate, Delete) */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Canva ANIMATE Button */}
        <button
          disabled={isLocked}
          onClick={() => setOpenPopover(openPopover === 'animate' ? 'none' : 'animate')}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition ${
            openPopover === 'animate' ||
            (selectedElement.animation && selectedElement.animation !== 'none')
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
              : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700'
          }`}
          title="Canva Motion Animations (Rise, Pan, Breathe, Pop, Drift)"
        >
          <Play className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="hidden md:inline">
            {selectedElement.animation && selectedElement.animation !== 'none'
              ? selectedElement.animation.toUpperCase()
              : 'Animate'}
          </span>
        </button>

        {/* Canva POSITION Button */}
        <button
          onClick={() => setOpenPopover(openPopover === 'position' ? 'none' : 'position')}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition ${
            openPopover === 'position'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
              : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700'
          }`}
          title="Position, Align to Page, Tidy Up, Layer Order & Coordinates"
        >
          <Move className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Position</span>
        </button>

        {/* Transparency & Blend Mode Button */}
        <button
          disabled={isLocked}
          onClick={() => setOpenPopover(openPopover === 'transparency' ? 'none' : 'transparency')}
          className={`p-1.5 rounded-lg border transition flex items-center gap-1 ${
            openPopover === 'transparency' || selectedElement.opacity < 1
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border-neutral-700'
          }`}
          title={`Transparency (${Math.round(selectedElement.opacity * 100)}%) & Blend Mode`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden xl:inline text-[10px] font-mono">
            {Math.round(selectedElement.opacity * 100)}%
          </span>
        </button>

        {/* Canva Hyperlink / RSVP Link Button */}
        <button
          disabled={isLocked}
          onClick={() => setOpenPopover(openPopover === 'link' ? 'none' : 'link')}
          className={`p-1.5 rounded-lg border transition ${
            openPopover === 'link' || selectedElement.linkUrl
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-300 border-neutral-700'
          }`}
          title="Add Clickable Link (Google Maps, RSVP or Website)"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>

        {/* Canva Copy Style Painter */}
        {onCopyStyle && (
          <button
            onClick={onCopyStyle}
            className={`p-1.5 rounded-lg border transition ${
              copiedStyle
                ? 'bg-amber-500 text-neutral-950 border-amber-400 animate-pulse font-bold'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
            }`}
            title={
              copiedStyle
                ? 'Style Copied! Click any element on canvas to paste style'
                : 'Copy Style (Paint Roller)'
            }
          >
            <PaintRoller className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Element Info Button */}
        <button
          onClick={() => setOpenPopover(openPopover === 'info' ? 'none' : 'info')}
          className={`hidden lg:flex p-1.5 rounded-lg border transition ${
            openPopover === 'info'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
          }`}
          title="Element Info & Alt Text"
        >
          <Info className="w-3.5 h-3.5" />
        </button>

        {/* Lock / Unlock */}
        <button
          onClick={() => onUpdateElement({ locked: !isLocked }, true)}
          className={`p-1.5 rounded-lg border transition ${
            isLocked
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-neutral-700'
          }`}
          title={isLocked ? 'Unlock Element' : 'Lock Element'}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        {/* Duplicate */}
        <button
          disabled={isLocked}
          onClick={onDuplicateElement}
          className="p-1.5 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 text-neutral-300 rounded-lg border border-neutral-700"
          title="Duplicate Element (Ctrl+D)"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          disabled={isLocked}
          onClick={onDeleteElement}
          className="p-1.5 bg-neutral-800 hover:bg-rose-950/60 disabled:opacity-40 text-rose-400 hover:text-rose-300 rounded-lg border border-neutral-700 hover:border-rose-500/40"
          title="Delete Element (Del)"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ================= POPOVERS ================= */}
      {openPopover !== 'none' && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenPopover('none')} />

          {/* 0. CANVA FONT PICKER POPOVER */}
          {openPopover === 'font' && isText && (
            <div className="absolute left-3 top-13 w-80 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-3 z-50 space-y-2 max-h-96 overflow-y-auto">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider px-1 pb-1 border-b border-neutral-800">
                Canva Royal Font Library
              </div>
              {FONT_OPTIONS.map((f) => {
                const isSelected = (selectedElement as TextElement).fontFamily === f.family;
                return (
                  <button
                    key={f.family}
                    onClick={() => {
                      onUpdateElement({ fontFamily: f.family }, true);
                      setOpenPopover('none');
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                        : 'bg-neutral-800/70 hover:bg-neutral-800 border-neutral-700/60 text-neutral-200'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] text-neutral-400">{f.name}</div>
                      <div
                        className="text-base text-amber-100 mt-0.5"
                        style={{ fontFamily: f.family }}
                      >
                        {f.sample}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-amber-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          )}

          {/* 0B. COLOR PALETTE & METALLIC GRADIENT SWATCHES POPOVER */}
          {openPopover === 'color' && (isText || isSticker) && (
            <div className="absolute left-28 top-13 w-76 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Canva Color & Gold Foil Studio
                </span>
                <input
                  type="color"
                  value={
                    isText
                      ? (selectedElement as TextElement).color
                      : (selectedElement as StickerElement).color
                  }
                  onChange={(e) =>
                    onUpdateElement({ color: e.target.value, gradientText: undefined }, true)
                  }
                  className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                />
              </div>

              <div>
                <span className="text-[11px] text-neutral-400 block mb-2">
                  Royal Palette Swatches:
                </span>
                <div className="grid grid-cols-8 gap-1.5">
                  {ROYAL_SWATCHES.map((swatch) => (
                    <button
                      key={swatch}
                      onClick={() =>
                        onUpdateElement({ color: swatch, gradientText: undefined }, true)
                      }
                      className="w-6 h-6 rounded-lg border border-neutral-600 hover:scale-110 transition shadow-sm"
                      style={{ backgroundColor: swatch }}
                      title={swatch}
                    />
                  ))}
                </div>
              </div>

              {isText && (
                <div className="pt-2 border-t border-neutral-800">
                  <span className="text-[11px] text-amber-300 font-semibold block mb-2">
                    Metallic Foil Text Gradients:
                  </span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      {
                        label: '24K Royal Gold Foil',
                        grad: 'linear-gradient(135deg, #FFF3A8 0%, #D4AF37 50%, #AA771C 100%)',
                      },
                      {
                        label: 'Jaipur Rose Gold',
                        grad: 'linear-gradient(135deg, #FFD1DC 0%, #E6A8D7 50%, #F59E0B 100%)',
                      },
                      {
                        label: 'Platinum Silver',
                        grad: 'linear-gradient(135deg, #FFFFFF 0%, #CBD5E1 50%, #94A3B8 100%)',
                      },
                      {
                        label: 'Sunset Marigold',
                        grad: 'linear-gradient(135deg, #FEF08A 0%, #F59E0B 50%, #EA580C 100%)',
                      },
                    ].map((g, i) => (
                      <button
                        key={i}
                        onClick={() => onUpdateElement({ gradientText: g.grad }, true)}
                        className="p-2 rounded-lg border border-neutral-700 hover:border-amber-400 text-[11px] font-bold text-neutral-950 text-center"
                        style={{ background: g.grad }}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 1. POSITION & ARRANGE POPOVER (Canva Style) */}
          {openPopover === 'position' && (
            <div className="absolute right-3 top-13 w-84 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Canva Position & Arrange
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  Z-Layer: #{selectedElement.zIndex || 1}
                </span>
              </div>

              {/* Align to Page 6 Buttons */}
              <div>
                <span className="text-[11px] text-neutral-400 block mb-2">Align to Page:</span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => alignElement('left')}
                    className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-lg text-neutral-200 transition"
                  >
                    Left
                  </button>
                  <button
                    onClick={() => alignElement('center')}
                    className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-lg text-amber-300 font-semibold transition"
                  >
                    Center
                  </button>
                  <button
                    onClick={() => alignElement('right')}
                    className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-lg text-neutral-200 transition"
                  >
                    Right
                  </button>
                  <button
                    onClick={() => alignElement('top')}
                    className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-lg text-neutral-200 transition"
                  >
                    Top
                  </button>
                  <button
                    onClick={() => alignElement('middle')}
                    className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-lg text-amber-300 font-semibold transition"
                  >
                    Middle
                  </button>
                  <button
                    onClick={() => alignElement('bottom')}
                    className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-lg text-neutral-200 transition"
                  >
                    Bottom
                  </button>
                </div>
              </div>

              {/* Canva Space Evenly / Tidy Up */}
              {onDistributeElements && (
                <div>
                  <span className="text-[11px] text-neutral-400 block mb-2">
                    Space Evenly / Tidy Up:
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => onDistributeElements('vertical')}
                      className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-lg text-neutral-200 text-[11px]"
                    >
                      Tidy Vertical
                    </button>
                    <button
                      onClick={() => onDistributeElements('horizontal')}
                      className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-lg text-neutral-200 text-[11px]"
                    >
                      Tidy Horiz
                    </button>
                    <button
                      onClick={() => onDistributeElements('tidy')}
                      className="py-1.5 px-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 rounded-lg text-amber-300 font-semibold text-[11px]"
                    >
                      ✨ Smart Tidy
                    </button>
                  </div>
                </div>
              )}

              {/* Layer Order */}
              <div>
                <span className="text-[11px] text-neutral-400 block mb-2">Layer Order:</span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={onBringForward}
                    className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-lg flex items-center justify-center gap-1.5 text-neutral-200"
                  >
                    <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bring Forward</span>
                  </button>
                  <button
                    onClick={onSendBackward}
                    className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-lg flex items-center justify-center gap-1.5 text-neutral-200"
                  >
                    <ArrowDown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Send Backward</span>
                  </button>
                  {onBringToFront && (
                    <button
                      onClick={onBringToFront}
                      className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-lg text-neutral-300 text-[11px]"
                    >
                      Bring to Front
                    </button>
                  )}
                  {onSendToBack && (
                    <button
                      onClick={onSendToBack}
                      className="py-1.5 px-2 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 rounded-lg text-neutral-300 text-[11px]"
                    >
                      Send to Back
                    </button>
                  )}
                </div>
              </div>

              {/* Advanced Exact X, Y, W, H, Rotate + Ratio Lock */}
              <div className="pt-2 border-t border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-neutral-400">Coordinates & Dimensions:</span>
                  <button
                    onClick={() =>
                      onUpdateElement({ ratioLocked: !selectedElement.ratioLocked }, true)
                    }
                    className={`text-[10px] px-2 py-0.5 rounded border flex items-center gap-1 ${
                      selectedElement.ratioLocked
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400'
                    }`}
                  >
                    <Lock className="w-2.5 h-2.5" /> Lock Ratio
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-1.5">
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">X</label>
                    <input
                      type="number"
                      value={selectedElement.x}
                      onChange={(e) =>
                        onUpdateElement({ x: parseInt(e.target.value) || 0 }, true)
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1 text-center font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Y</label>
                    <input
                      type="number"
                      value={selectedElement.y}
                      onChange={(e) =>
                        onUpdateElement({ y: parseInt(e.target.value) || 0 }, true)
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1 text-center font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">W</label>
                    <input
                      type="number"
                      value={selectedElement.width}
                      onChange={(e) => {
                        const newW = Math.max(20, parseInt(e.target.value) || 20);
                        if (selectedElement.ratioLocked) {
                          const ratio = selectedElement.height / Math.max(1, selectedElement.width);
                          onUpdateElement(
                            { width: newW, height: Math.round(newW * ratio) },
                            true
                          );
                        } else {
                          onUpdateElement({ width: newW }, true);
                        }
                      }}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1 text-center font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">H</label>
                    <input
                      type="number"
                      value={selectedElement.height}
                      onChange={(e) =>
                        onUpdateElement(
                          { height: Math.max(16, parseInt(e.target.value) || 16) },
                          true
                        )
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1 text-center font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-neutral-400 block mb-1">Rot°</label>
                    <input
                      type="number"
                      value={selectedElement.rotation || 0}
                      onChange={(e) =>
                        onUpdateElement({ rotation: parseInt(e.target.value) || 0 }, true)
                      }
                      className="w-full bg-neutral-800 border border-neutral-700 rounded px-1.5 py-1 text-center font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. SPACING POPOVER (Letter Spacing, Line Height & Vertical Anchor) */}
          {openPopover === 'spacing' && isText && (
            <div className="absolute left-64 top-13 w-68 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Canva Typography Spacing
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Letter Spacing</span>
                  <span className="font-mono text-amber-300">
                    {(selectedElement as TextElement).letterSpacing || 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="-2"
                  max="16"
                  step="0.5"
                  value={(selectedElement as TextElement).letterSpacing || 0}
                  onChange={(e) =>
                    onUpdateElement({ letterSpacing: parseFloat(e.target.value) }, true)
                  }
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-300">Line Spacing</span>
                  <span className="font-mono text-amber-300">
                    {(selectedElement as TextElement).lineHeight || 1.3}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={(selectedElement as TextElement).lineHeight || 1.3}
                  onChange={(e) =>
                    onUpdateElement({ lineHeight: parseFloat(e.target.value) }, true)
                  }
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="pt-2 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400 block mb-1.5">
                  Anchor Text Box:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['top', 'middle', 'bottom'] as const).map((va) => (
                    <button
                      key={va}
                      onClick={() => onUpdateElement({ verticalAlign: va }, true)}
                      className={`py-1 rounded border capitalize ${
                        ((selectedElement as TextElement).verticalAlign || 'middle') === va
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                      }`}
                    >
                      {va}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. CANVA TEXT EFFECTS STUDIO POPOVER */}
          {openPopover === 'effects' && isText && (
            <div className="absolute left-48 sm:left-72 top-13 w-88 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-xs max-h-[82vh] overflow-y-auto">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5 flex items-center justify-between">
                <span>Canva Pro Text Effects (10 Styles)</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {TEXT_EFFECT_PRESETS.map((preset) => {
                  const isActive =
                    ((selectedElement as TextElement).effectType || 'none') === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => handleSelectTextEffect(preset.id)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col items-center justify-center gap-1 ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 ring-1 ring-amber-400/30'
                          : 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700'
                      }`}
                    >
                      <span
                        className="text-base font-bold font-cinzel tracking-wider"
                        style={preset.previewStyle}
                      >
                        Ag
                      </span>
                      <span className="text-[11px] font-semibold text-neutral-200">
                        {preset.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Fine-tune Stroke / Outline & Shadow */}
              <div className="pt-3 border-t border-neutral-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Outline Thickness & Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedElement as TextElement).strokeColor || '#000000'}
                      onChange={(e) => onUpdateElement({ strokeColor: e.target.value }, true)}
                      className="w-5 h-5 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="5"
                      step="0.5"
                      value={(selectedElement as TextElement).strokeWidth || 0}
                      onChange={(e) =>
                        onUpdateElement({ strokeWidth: parseFloat(e.target.value) }, true)
                      }
                      className="w-20 accent-amber-400"
                    />
                  </div>
                </div>

                {/* Shadow Blur & Color */}
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Shadow / Glow Blur</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedElement as TextElement).shadow?.color || '#000000'}
                      onChange={(e) =>
                        onUpdateElement(
                          {
                            shadow: {
                              color: e.target.value,
                              blur: (selectedElement as TextElement).shadow?.blur ?? 8,
                              offsetX: (selectedElement as TextElement).shadow?.offsetX ?? 2,
                              offsetY: (selectedElement as TextElement).shadow?.offsetY ?? 3,
                            },
                          },
                          true
                        )
                      }
                      className="w-5 h-5 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={(selectedElement as TextElement).shadow?.blur || 0}
                      onChange={(e) =>
                        onUpdateElement(
                          {
                            shadow: {
                              color: (selectedElement as TextElement).shadow?.color || '#D4AF37',
                              blur: parseInt(e.target.value),
                              offsetX: (selectedElement as TextElement).shadow?.offsetX ?? 0,
                              offsetY: (selectedElement as TextElement).shadow?.offsetY ?? 2,
                            },
                          },
                          true
                        )
                      }
                      className="w-20 accent-amber-400"
                    />
                  </div>
                </div>

                {/* Pill Background Box Controls */}
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Background Pill Color</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={(selectedElement as TextElement).backgroundColor || '#3d0510'}
                      onChange={(e) =>
                        onUpdateElement(
                          {
                            backgroundColor: e.target.value,
                            backgroundPadding:
                              (selectedElement as TextElement).backgroundPadding || 8,
                          },
                          true
                        )
                      }
                      className="w-5 h-5 rounded bg-transparent border-0 cursor-pointer"
                    />
                    <button
                      onClick={() => onUpdateElement({ backgroundColor: undefined }, true)}
                      className="text-[10px] px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                    >
                      Clear Pill
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3B. CANVA CURVED TEXT POPOVER */}
          {openPopover === 'curve' && isText && (
            <div className="absolute left-64 top-13 w-72 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Canva Curved Text (Arch)
                </span>
                <span className="font-mono text-amber-300">
                  {(selectedElement as TextElement).curveRadius || 0}°
                </span>
              </div>

              <input
                type="range"
                min="-100"
                max="100"
                step="5"
                value={(selectedElement as TextElement).curveRadius || 0}
                onChange={(e) =>
                  onUpdateElement({ curveRadius: parseInt(e.target.value) }, true)
                }
                className="w-full accent-amber-400"
              />

              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => onUpdateElement({ curveRadius: 55 }, true)}
                  className="py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-amber-200 border border-neutral-700"
                >
                  Top Arch ⌒
                </button>
                <button
                  onClick={() => onUpdateElement({ curveRadius: 0 }, true)}
                  className="py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-neutral-200 border border-neutral-700"
                >
                  Straight —
                </button>
                <button
                  onClick={() => onUpdateElement({ curveRadius: -55 }, true)}
                  className="py-1.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg text-amber-200 border border-neutral-700"
                >
                  Bottom Smile ⌣
                </button>
              </div>
            </div>
          )}

          {/* 3C. CANVA MOTION ANIMATIONS POPOVER (With Speed & Timing) */}
          {openPopover === 'animate' && (
            <div className="absolute right-24 top-13 w-84 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs max-h-[82vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>Canva Element Animations (12 Styles)</span>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {ANIMATION_PRESETS.map((anim) => {
                  const isActive = (selectedElement.animation || 'none') === anim.id;
                  return (
                    <button
                      key={anim.id}
                      onClick={() => onUpdateElement({ animation: anim.id }, true)}
                      className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 text-amber-200 ring-1 ring-amber-400/30'
                          : 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{anim.label}</span>
                        {anim.badge && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                            {anim.badge}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 mt-1">{anim.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Animation Speed & Timing Controls */}
              <div className="pt-2 border-t border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Animation Speed:</span>
                  <span className="font-mono text-amber-300">
                    {selectedElement.animationSpeed || 1}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.25"
                  value={selectedElement.animationSpeed || 1}
                  onChange={(e) =>
                    onUpdateElement({ animationSpeed: parseFloat(e.target.value) }, true)
                  }
                  className="w-full accent-amber-400"
                />
                <div className="grid grid-cols-3 gap-1.5">
                  {(['both', 'enter', 'exit'] as const).map((tm) => (
                    <button
                      key={tm}
                      onClick={() => onUpdateElement({ animationTiming: tm }, true)}
                      className={`py-1 rounded border text-[11px] capitalize ${
                        (selectedElement.animationTiming || 'both') === tm
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                      }`}
                    >
                      On {tm}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3D. TRANSPARENCY & BLEND MODE POPOVER */}
          {openPopover === 'transparency' && (
            <div className="absolute right-12 top-13 w-72 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Transparency & Blend Mode
                </span>
                <span className="font-mono text-amber-300">
                  {Math.round(selectedElement.opacity * 100)}%
                </span>
              </div>

              <input
                type="range"
                min="0.05"
                max="1"
                step="0.05"
                value={selectedElement.opacity}
                onChange={(e) => onUpdateElement({ opacity: parseFloat(e.target.value) })}
                onMouseUp={() => onUpdateElement({}, true)}
                className="w-full accent-amber-400 cursor-pointer"
              />

              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <label className="text-[11px] text-neutral-400 block">Layer Blend Mode:</label>
                <select
                  value={selectedElement.blendMode || 'normal'}
                  onChange={(e) =>
                    onUpdateElement({ blendMode: e.target.value as BlendModeType }, true)
                  }
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none"
                >
                  <option value="normal">Normal</option>
                  <option value="multiply">Multiply (Darken Ink)</option>
                  <option value="screen">Screen (Luminous Glow)</option>
                  <option value="overlay">Overlay (Rich Contrast)</option>
                  <option value="lighten">Lighten</option>
                  <option value="color-dodge">Gold Dodge</option>
                  <option value="soft-light">Soft Ambient Light</option>
                  <option value="difference">Difference</option>
                </select>
              </div>
            </div>
          )}

          {/* 4. QR CODE LIVE EDIT POPOVER */}
          {openPopover === 'qr' && isQr && (
            <div className="absolute left-12 top-13 w-80 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Update QR Destination URL / Location
              </div>
              <input
                type="text"
                defaultValue={(selectedElement as QrElement).targetValue}
                placeholder="Paste Google Maps link, WhatsApp link or URL..."
                onBlur={(e) => handleQrTargetChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleQrTargetChange((e.target as HTMLInputElement).value);
                    setOpenPopover('none');
                  }
                }}
                className="w-full bg-neutral-800 border border-neutral-700 focus:border-amber-400 rounded-lg px-3 py-2 text-neutral-100 outline-none"
              />
              <p className="text-[11px] text-neutral-400">
                Press Enter or click outside to regenerate the live QR code on your invitation card.
              </p>
            </div>
          )}

          {/* 5. BORDER & CORNER ROUNDING POPOVER (For Images & Shapes) */}
          {openPopover === 'border' && (isImage || isShape) && (
            <div className="absolute left-40 top-13 w-76 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3.5 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Canva Border Style & Corner Radius
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {(['solid', 'dashed', 'dotted', 'double'] as const).map((bs) => (
                  <button
                    key={bs}
                    onClick={() => onUpdateElement({ borderStyle: bs }, true)}
                    className={`py-1.5 rounded border text-[11px] capitalize ${
                      ((selectedElement as ShapeElement).borderStyle || 'solid') === bs
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-300'
                    }`}
                  >
                    {bs}
                  </button>
                ))}
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-300">Border Weight</span>
                  <span className="font-mono text-amber-300">
                    {isShape
                      ? (selectedElement as ShapeElement).strokeWidth || 2
                      : (selectedElement as ImageElement).borderWidth || 0}
                    px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="14"
                  value={
                    isShape
                      ? (selectedElement as ShapeElement).strokeWidth ?? 2
                      : (selectedElement as ImageElement).borderWidth ?? 0
                  }
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    onUpdateElement(
                      isShape ? { strokeWidth: val } : { borderWidth: val },
                      true
                    );
                  }}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-300">Corner Rounding</span>
                  <span className="font-mono text-amber-300">
                    {(selectedElement as ShapeElement | ImageElement).borderRadius || 0}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={(selectedElement as ShapeElement | ImageElement).borderRadius || 0}
                  onChange={(e) =>
                    onUpdateElement({ borderRadius: parseInt(e.target.value) }, true)
                  }
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <span className="text-neutral-300">Border Color:</span>
                <input
                  type="color"
                  value={
                    isShape
                      ? (selectedElement as ShapeElement).strokeColor || '#D4AF37'
                      : (selectedElement as ImageElement).borderColor || '#D4AF37'
                  }
                  onChange={(e) =>
                    onUpdateElement(
                      isShape ? { strokeColor: e.target.value } : { borderColor: e.target.value },
                      true
                    )
                  }
                  className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                />
              </div>

              {isShape && (
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Shape Fill Color:</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={
                        (selectedElement as ShapeElement).fillColor &&
                        (selectedElement as ShapeElement).fillColor !== 'transparent'
                          ? (selectedElement as ShapeElement).fillColor
                          : '#4A0404'
                      }
                      onChange={(e) => onUpdateElement({ fillColor: e.target.value }, true)}
                      className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                    />
                    <button
                      onClick={() => onUpdateElement({ fillColor: 'transparent' }, true)}
                      className="px-2 py-0.5 rounded bg-neutral-800 text-[10px] text-neutral-300"
                    >
                      Transparent
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. SHAPE INNER TEXT POPOVER */}
          {openPopover === 'shape-text' && isShape && (
            <div className="absolute left-32 top-13 w-76 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Canva Shape Inner Text
              </div>
              <input
                type="text"
                value={(selectedElement as ShapeElement).innerText || ''}
                onChange={(e) => onUpdateElement({ innerText: e.target.value }, true)}
                placeholder="Type label inside shape/banner..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 outline-none"
              />
              <div className="flex items-center justify-between">
                <span>Text Color & Size:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={(selectedElement as ShapeElement).innerTextColor || '#FFEAA7'}
                    onChange={(e) => onUpdateElement({ innerTextColor: e.target.value }, true)}
                    className="w-6 h-6 rounded border-0 bg-transparent"
                  />
                  <input
                    type="number"
                    value={(selectedElement as ShapeElement).innerFontSize || 13}
                    onChange={(e) =>
                      onUpdateElement({ innerFontSize: parseInt(e.target.value) || 13 }, true)
                    }
                    className="w-14 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-center"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 7. UNIVERSAL DROP SHADOW POPOVER */}
          {openPopover === 'shadow' && (
            <div className="absolute right-36 top-13 w-72 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-1.5">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Element Drop Shadow
                </span>
                <input
                  type="checkbox"
                  checked={!!selectedElement.dropShadow?.enabled}
                  onChange={(e) =>
                    onUpdateElement(
                      {
                        dropShadow: {
                          enabled: e.target.checked,
                          color: selectedElement.dropShadow?.color || '#000000',
                          blur: selectedElement.dropShadow?.blur ?? 12,
                          offsetX: selectedElement.dropShadow?.offsetX ?? 0,
                          offsetY: selectedElement.dropShadow?.offsetY ?? 6,
                        },
                      },
                      true
                    )
                  }
                  className="accent-amber-400"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Shadow Color:</span>
                <input
                  type="color"
                  value={selectedElement.dropShadow?.color || '#000000'}
                  onChange={(e) =>
                    onUpdateElement(
                      {
                        dropShadow: {
                          enabled: true,
                          color: e.target.value,
                          blur: selectedElement.dropShadow?.blur ?? 12,
                          offsetX: selectedElement.dropShadow?.offsetX ?? 0,
                          offsetY: selectedElement.dropShadow?.offsetY ?? 6,
                        },
                      },
                      true
                    )
                  }
                  className="w-6 h-6 rounded border-0 bg-transparent"
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span>Blur Radius</span>
                  <span className="font-mono text-amber-300">
                    {selectedElement.dropShadow?.blur ?? 12}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={selectedElement.dropShadow?.blur ?? 12}
                  onChange={(e) =>
                    onUpdateElement(
                      {
                        dropShadow: {
                          enabled: true,
                          color: selectedElement.dropShadow?.color || '#000000',
                          blur: parseInt(e.target.value),
                          offsetX: selectedElement.dropShadow?.offsetX ?? 0,
                          offsetY: selectedElement.dropShadow?.offsetY ?? 6,
                        },
                      },
                      true
                    )
                  }
                  className="w-full accent-amber-400"
                />
              </div>
            </div>
          )}

          {/* 8. HYPERLINK POPOVER */}
          {openPopover === 'link' && (
            <div className="absolute right-16 top-13 w-76 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Canva Clickable Link (URL / RSVP)
              </div>
              <input
                type="text"
                value={selectedElement.linkUrl || ''}
                onChange={(e) => onUpdateElement({ linkUrl: e.target.value }, true)}
                placeholder="https://maps.google.com/... or tel:+91..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-neutral-100 outline-none"
              />
              <div className="flex justify-between items-center text-[11px] text-neutral-400">
                <span>Attaches a link to this element</span>
                {selectedElement.linkUrl && (
                  <button
                    onClick={() => onUpdateElement({ linkUrl: undefined }, true)}
                    className="text-rose-400 hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          )}

          {/* 9. TABLE LIVE EDITOR POPOVER */}
          {openPopover === 'table-edit' && isTable && (
            <div className="absolute left-10 top-13 w-96 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5 flex items-center justify-between">
                <span>Canva Table Data & Style Editor</span>
                <Table2 className="w-3.5 h-3.5 text-amber-400" />
              </div>

              <div className="space-y-2">
                {(selectedElement as TableElement).rows.map((row, rIdx) => (
                  <div key={rIdx} className="grid grid-cols-3 gap-1">
                    {row.map((cell, cIdx) => (
                      <input
                        key={cIdx}
                        type="text"
                        value={cell}
                        onChange={(e) => {
                          const nextRows = (selectedElement as TableElement).rows.map((r, ri) =>
                            ri === rIdx ? r.map((c, ci) => (ci === cIdx ? e.target.value : c)) : r
                          );
                          onUpdateElement({ rows: nextRows }, true);
                        }}
                        className={`bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-[11px] outline-none focus:border-amber-400 ${
                          rIdx === 0 ? 'font-bold text-amber-300' : 'text-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <span>Header Background:</span>
                <input
                  type="color"
                  value={(selectedElement as TableElement).headerBgColor || '#630c1d'}
                  onChange={(e) => onUpdateElement({ headerBgColor: e.target.value }, true)}
                  className="w-6 h-6 rounded border-0 bg-transparent"
                />
                <span>Border:</span>
                <input
                  type="color"
                  value={(selectedElement as TableElement).borderColor || '#D4AF37'}
                  onChange={(e) => onUpdateElement({ borderColor: e.target.value }, true)}
                  className="w-6 h-6 rounded border-0 bg-transparent"
                />
              </div>
            </div>
          )}

          {/* 10. CHART LIVE DATA EDITOR POPOVER */}
          {openPopover === 'chart-edit' && isChart && (
            <div className="absolute left-10 top-13 w-88 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs max-h-[80vh] overflow-y-auto">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Canva Chart Data & Labels
              </div>
              <input
                type="text"
                value={(selectedElement as ChartElement).title}
                onChange={(e) => onUpdateElement({ title: e.target.value }, true)}
                placeholder="Chart Title..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-amber-200 font-bold"
              />
              <div className="space-y-2">
                {(selectedElement as ChartElement).data.map((dp, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={dp.color}
                      onChange={(e) => {
                        const next = (selectedElement as ChartElement).data.map((d, i) =>
                          i === idx ? { ...d, color: e.target.value } : d
                        );
                        onUpdateElement({ data: next }, true);
                      }}
                      className="w-6 h-6 rounded border-0 bg-transparent shrink-0"
                    />
                    <input
                      type="text"
                      value={dp.label}
                      onChange={(e) => {
                        const next = (selectedElement as ChartElement).data.map((d, i) =>
                          i === idx ? { ...d, label: e.target.value } : d
                        );
                        onUpdateElement({ data: next }, true);
                      }}
                      className="flex-1 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-neutral-200"
                    />
                    <input
                      type="number"
                      value={dp.value}
                      onChange={(e) => {
                        const next = (selectedElement as ChartElement).data.map((d, i) =>
                          i === idx ? { ...d, value: parseInt(e.target.value) || 0 } : d
                        );
                        onUpdateElement({ data: next }, true);
                      }}
                      className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-center font-mono text-amber-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. COLLAGE GRID PHOTO EDITOR POPOVER */}
          {openPopover === 'grid-edit' && isGrid && (
            <div className="absolute left-10 top-13 w-84 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Canva Collage Grid Layout & Photos
              </div>
              <select
                value={(selectedElement as GridElement).gridLayout}
                onChange={(e) =>
                  onUpdateElement({ gridLayout: e.target.value as GridLayoutVariant }, true)
                }
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-amber-200"
              >
                <option value="2-col">2-Column Side-by-Side</option>
                <option value="2-row">2-Row Vertical Split</option>
                <option value="3-collage">3-Photo Asymmetric</option>
                <option value="4-quad">4-Photo Quad Grid</option>
                <option value="polaroid-trio">3 Polaroid Strip</option>
                <option value="hero-split">Palace Banner Split</option>
              </select>

              <div>
                <div className="flex justify-between mb-1">
                  <span>Grid Gap Spacing</span>
                  <span className="font-mono text-amber-300">
                    {(selectedElement as GridElement).gap}px
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={(selectedElement as GridElement).gap}
                  onChange={(e) =>
                    onUpdateElement({ gap: parseInt(e.target.value) }, true)
                  }
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="space-y-1.5 pt-2 border-t border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">
                  Replace Slot Photos:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[0, 1, 2, 3].map((slotIdx) => (
                    <label
                      key={slotIdx}
                      className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 flex items-center justify-center gap-1.5 cursor-pointer text-[11px] text-amber-300"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Slot #{slotIdx + 1}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                const nextImgs = [...(selectedElement as GridElement).images];
                                nextImgs[slotIdx] = ev.target.result as string;
                                onUpdateElement({ images: nextImgs }, true);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 12. COUNTDOWN EDITOR POPOVER */}
          {openPopover === 'countdown-edit' && isCountdown && (
            <div className="absolute left-10 top-13 w-80 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Edit Live Muhurat Countdown
              </div>
              <input
                type="text"
                value={(selectedElement as CountdownElement).eventLabel}
                onChange={(e) => onUpdateElement({ eventLabel: e.target.value }, true)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
              <input
                type="datetime-local"
                value={(selectedElement as CountdownElement).targetDate}
                onChange={(e) => onUpdateElement({ targetDate: e.target.value }, true)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>
          )}

          {/* 13. BARCODE EDITOR POPOVER */}
          {openPopover === 'barcode-edit' && isBarcode && (
            <div className="absolute left-10 top-13 w-80 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-3 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Edit Venue Entry Pass Barcode
              </div>
              <input
                type="text"
                value={(selectedElement as BarcodeElement).codeValue}
                onChange={(e) => onUpdateElement({ codeValue: e.target.value }, true)}
                placeholder="Barcode ID..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100 font-mono"
              />
              <input
                type="text"
                value={(selectedElement as BarcodeElement).label}
                onChange={(e) => onUpdateElement({ label: e.target.value }, true)}
                placeholder="Pass Title..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-100"
              />
            </div>
          )}

          {/* 14. ELEMENT INFO & ALT TEXT POPOVER */}
          {openPopover === 'info' && (
            <div className="absolute right-8 top-13 w-72 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-2.5 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Canva Element Info & Accessibility
              </div>
              <div className="text-[11px] text-neutral-400 space-y-1 font-mono">
                <div>ID: {selectedElement.id}</div>
                <div>Type: {selectedElement.type.toUpperCase()}</div>
                <div>
                  Size: {selectedElement.width} × {selectedElement.height} px
                </div>
              </div>
              <input
                type="text"
                value={selectedElement.altText || ''}
                onChange={(e) => onUpdateElement({ altText: e.target.value }, true)}
                placeholder="Accessibility Alt Text / Note..."
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-200"
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
