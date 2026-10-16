import React, { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Lock,
  Unlock,
  Crop,
  ZoomIn,
  FlipHorizontal,
  FlipVertical,
  SlidersHorizontal,
  Move,
  CaseUpper,
  Sun,
  QrCode,
} from 'lucide-react';
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
}

const FONT_OPTIONS = [
  { name: 'Cinzel (Royal Serif)', family: "'Cinzel', serif" },
  { name: 'Playfair Display (Luxury Editorial)', family: "'Playfair Display', serif" },
  { name: 'Rozha One (Devanagari Royal)', family: "'Rozha One', serif" },
  { name: 'Tiro Devanagari (Traditional Shloka)', family: "'Tiro Devanagari Hindi', serif" },
  { name: 'Kalam (Devanagari Handwritten)', family: "'Kalam', cursive" },
  { name: 'Alex Brush (Wedding Calligraphy)', family: "'Alex Brush', cursive" },
  { name: 'Great Vibes (Flowing Cursive)', family: "'Great Vibes', cursive" },
  { name: 'Cormorant Garamond (Fine Art)', family: "'Cormorant Garamond', serif" },
  { name: 'Montserrat (Modern Clean)', family: "'Montserrat', sans-serif" },
  { name: 'Tangerine (Graceful Script)', family: "'Tangerine', cursive" },
];

const ROYAL_SWATCHES = [
  '#FFEAA7',
  '#F5D77F',
  '#D4AF37',
  '#FFF2C6',
  '#FFFFFF',
  '#FFD700',
  '#E6C665',
  '#C41E3A',
  '#0D5C3A',
  '#1B2A4A',
  '#4A0404',
  '#171717',
];

const FILTER_PRESETS: { id: PhotoFilterPreset; label: string }[] = [
  { id: 'none', label: 'Normal' },
  { id: 'royal-warm', label: 'Royal Warm' },
  { id: 'vivid-gold', label: 'Vivid Gold' },
  { id: 'vintage-sepia', label: 'Vintage' },
  { id: 'rose-tint', label: 'Rose Glow' },
  { id: 'high-contrast', label: 'Studio HD' },
  { id: 'bw-classic', label: 'B&W Classic' },
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
}) => {
  const [openPopover, setOpenPopover] = useState<'none' | 'position' | 'spacing' | 'effects' | 'qr'>('none');

  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];

  if (!selectedElement) {
    return (
      <div className="h-10 sm:h-11 bg-neutral-950 border-b border-neutral-800/90 px-3 sm:px-4 flex items-center justify-between text-xs text-neutral-400 select-none shrink-0 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-neutral-300 font-medium text-[11px] sm:text-xs">
            Canva Studio Ready: Click any text, photo, motif, frame, or QR code on the card to customize
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-neutral-400 text-[11px] shrink-0">
          <span>Double-click text to edit</span>
          <span>•</span>
          <span>8-handle resize & 360° rotate</span>
          <span>•</span>
          <span>Smart magnetic snap guides</span>
        </div>
      </div>
    );
  }

  const isText = selectedElement.type === 'text';
  const isImage = selectedElement.type === 'image';
  const isSticker = selectedElement.type === 'sticker';
  const isQr = selectedElement.type === 'qr';
  const isShape = selectedElement.type === 'shape';
  const isLocked = !!selectedElement.locked;

  // Align to page helpers
  const alignElement = (mode: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (isLocked) return;
    const margin = 24;
    if (mode === 'left') onUpdateElement({ x: margin }, true);
    if (mode === 'center') onUpdateElement({ x: Math.round((dimensions.width - selectedElement.width) / 2) }, true);
    if (mode === 'right') onUpdateElement({ x: dimensions.width - selectedElement.width - margin }, true);
    if (mode === 'top') onUpdateElement({ y: margin }, true);
    if (mode === 'middle') onUpdateElement({ y: Math.round((dimensions.height - selectedElement.height) / 2) }, true);
    if (mode === 'bottom') onUpdateElement({ y: dimensions.height - selectedElement.height - margin }, true);
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

  return (
    <div className="h-12 bg-neutral-900 border-b border-neutral-800 px-3 flex items-center justify-between text-neutral-200 text-xs gap-2 select-none z-30 relative">
      {/* Left properties specific to element type */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {/* ================= TEXT CONTROLS ================= */}
        {isText && (
          <>
            {/* Font family */}
            <select
              disabled={isLocked}
              value={(selectedElement as TextElement).fontFamily}
              onChange={(e) => onUpdateElement({ fontFamily: e.target.value }, true)}
              className="bg-neutral-800 text-xs text-neutral-100 rounded-lg px-2 py-1.5 border border-neutral-700 hover:border-amber-500/50 outline-none w-36 sm:w-44 truncate cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.family} value={f.family}>
                  {f.name}
                </option>
              ))}
            </select>

            {/* Font size */}
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
                      fontSize: Math.min(140, (selectedElement as TextElement).fontSize + 2),
                    },
                    true
                  )
                }
                className="px-2 py-1 hover:bg-neutral-700 text-neutral-300 font-bold"
              >
                +
              </button>
            </div>

            {/* Color Swatches */}
            <div className="flex items-center gap-1 bg-neutral-800 px-1.5 py-1 rounded-lg border border-neutral-700 shrink-0">
              <input
                disabled={isLocked}
                type="color"
                value={(selectedElement as TextElement).color}
                onChange={(e) => onUpdateElement({ color: e.target.value }, true)}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                title="Text Color"
              />
              <div className="hidden xl:flex items-center gap-1 pl-1 border-l border-neutral-700">
                {ROYAL_SWATCHES.slice(0, 6).map((swatch) => (
                  <button
                    disabled={isLocked}
                    key={swatch}
                    onClick={() => onUpdateElement({ color: swatch }, true)}
                    className="w-3.5 h-3.5 rounded-full border border-neutral-600 hover:scale-125 transition"
                    style={{ backgroundColor: swatch }}
                    title={swatch}
                  />
                ))}
              </div>
            </div>

            {/* Bold / Italic / Underline / Case */}
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
                title="Bold"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isLocked}
                onClick={() =>
                  onUpdateElement(
                    {
                      fontStyle:
                        (selectedElement as TextElement).fontStyle === 'italic' ? 'normal' : 'italic',
                    },
                    true
                  )
                }
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).fontStyle === 'italic'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Italic"
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
                title="Underline"
              >
                <Underline className="w-3.5 h-3.5" />
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
                title={`Case: ${(selectedElement as TextElement).textTransform || 'normal'}`}
              >
                <CaseUpper className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Align */}
            <div className="flex items-center bg-neutral-800 rounded-lg border border-neutral-700 p-0.5 shrink-0">
              <button
                disabled={isLocked}
                onClick={() => onUpdateElement({ textAlign: 'left' }, true)}
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).textAlign === 'left'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Align Left"
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isLocked}
                onClick={() => onUpdateElement({ textAlign: 'center' }, true)}
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).textAlign === 'center'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Align Center"
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={isLocked}
                onClick={() => onUpdateElement({ textAlign: 'right' }, true)}
                className={`p-1.5 rounded transition ${
                  (selectedElement as TextElement).textAlign === 'right'
                    ? 'bg-amber-500/25 text-amber-300'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title="Align Right"
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Spacing Popover Trigger */}
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'spacing' ? 'none' : 'spacing')}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition shrink-0 ${
                openPopover === 'spacing'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title="Letter Spacing & Line Height"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Spacing</span>
            </button>

            {/* Effects Popover Trigger (Shadow, Glow, Outline, Pill Background) */}
            <button
              disabled={isLocked}
              onClick={() => setOpenPopover(openPopover === 'effects' ? 'none' : 'effects')}
              className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 transition shrink-0 ${
                openPopover === 'effects'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                  : 'bg-neutral-800 border-neutral-700 text-neutral-300 hover:text-white'
              }`}
              title="Canva Text Effects (Shadow, Gold Glow, Outline, Background)"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Effects</span>
            </button>
          </>
        )}

        {/* ================= IMAGE CONTROLS ================= */}
        {isImage && (
          <>
            <button
              disabled={isLocked}
              onClick={onOpenPhotoAdjust}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold rounded-lg border border-amber-500/40 transition shrink-0"
              title="Fit, Crop, Pan & Zoom Photo inside Card"
            >
              <Crop className="w-3.5 h-3.5" />
              <span>Crop & Fit</span>
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
                    Filter: {fp.label}
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
                ['arch', 'circle', 'heart', 'diamond', 'rounded', 'none'] as ImageElement['mask'][]
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
                  {mask}
                </button>
              ))}
            </div>

            {/* Border Width & Color */}
            <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 shrink-0">
              <span className="text-neutral-400 text-[11px]">Border:</span>
              <input
                disabled={isLocked}
                type="color"
                value={(selectedElement as ImageElement).borderColor || '#D4AF37'}
                onChange={(e) => onUpdateElement({ borderColor: e.target.value }, true)}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                disabled={isLocked}
                type="range"
                min="0"
                max="10"
                value={(selectedElement as ImageElement).borderWidth || 0}
                onChange={(e) => onUpdateElement({ borderWidth: parseInt(e.target.value) }, true)}
                className="w-12 accent-amber-400"
              />
            </div>
          </>
        )}

        {/* ================= STICKER CONTROLS ================= */}
        {isSticker && (
          <>
            <span className="text-amber-300 font-semibold text-xs px-2 py-1 bg-amber-500/10 rounded-lg border border-amber-500/20 shrink-0">
              {(selectedElement as StickerElement).name}
            </span>
            <div className="flex items-center gap-1.5 bg-neutral-800 px-2.5 py-1 rounded-lg border border-neutral-700 shrink-0">
              <span className="text-neutral-300 text-[11px]">Motif Color:</span>
              <input
                disabled={isLocked}
                type="color"
                value={(selectedElement as StickerElement).color || '#D4AF37'}
                onChange={(e) => onUpdateElement({ color: e.target.value }, true)}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
              <div className="flex items-center gap-1 pl-1 border-l border-neutral-700">
                {ROYAL_SWATCHES.slice(0, 6).map((swatch) => (
                  <button
                    disabled={isLocked}
                    key={swatch}
                    onClick={() => onUpdateElement({ color: swatch }, true)}
                    className="w-3.5 h-3.5 rounded-full border border-neutral-600 hover:scale-125 transition"
                    style={{ backgroundColor: swatch }}
                  />
                ))}
              </div>
            </div>
          </>
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
              <span className="text-neutral-400 text-[11px]">QR Ink:</span>
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
                <option value="arch-frame" className="bg-neutral-900">Jharokha Arch Frame</option>
                <option value="royal-badge" className="bg-neutral-900">Royal Seal Badge</option>
                <option value="pill-banner" className="bg-neutral-900">Pill Label Banner</option>
                <option value="rectangle" className="bg-neutral-900">Rectangle Box</option>
                <option value="circle" className="bg-neutral-900">Circle Ring</option>
                <option value="diamond" className="bg-neutral-900">Diamond Frame</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 shrink-0">
              <span className="text-neutral-400 text-[11px]">Stroke:</span>
              <input
                disabled={isLocked}
                type="color"
                value={(selectedElement as ShapeElement).strokeColor || '#D4AF37'}
                onChange={(e) => onUpdateElement({ strokeColor: e.target.value }, true)}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
              <input
                disabled={isLocked}
                type="range"
                min="1"
                max="10"
                value={(selectedElement as ShapeElement).strokeWidth || 2}
                onChange={(e) => onUpdateElement({ strokeWidth: parseInt(e.target.value) }, true)}
                className="w-12 accent-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 shrink-0">
              <span className="text-neutral-400 text-[11px]">Fill:</span>
              <input
                disabled={isLocked}
                type="color"
                value={
                  (selectedElement as ShapeElement).fillColor &&
                  (selectedElement as ShapeElement).fillColor !== 'transparent'
                    ? (selectedElement as ShapeElement).fillColor
                    : '#2d0a14'
                }
                onChange={(e) => onUpdateElement({ fillColor: e.target.value }, true)}
                className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
              />
              <button
                disabled={isLocked}
                onClick={() => onUpdateElement({ fillColor: 'transparent' }, true)}
                className="text-[10px] text-neutral-400 hover:text-amber-300 px-1"
                title="Clear Fill (Transparent)"
              >
                Clear
              </button>
            </div>
          </>
        )}

        {/* ================= UNIVERSAL FLIP & OPACITY ================= */}
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

        {/* Opacity Slider */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-800 px-2 py-1 rounded-lg border border-neutral-700 text-[11px] text-neutral-400 shrink-0">
          <span>Opacity:</span>
          <input
            disabled={isLocked}
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={selectedElement.opacity}
            onChange={(e) => onUpdateElement({ opacity: parseFloat(e.target.value) })}
            onMouseUp={() => onUpdateElement({}, true)}
            className="w-14 accent-amber-400 cursor-pointer"
          />
          <span className="font-mono text-neutral-300 w-7">
            {Math.round(selectedElement.opacity * 100)}%
          </span>
        </div>
      </div>

      {/* Right Universal Element Actions (Position, Layer, Lock, Duplicate, Delete) */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Canva Position & Align Button */}
        <button
          onClick={() => setOpenPopover(openPopover === 'position' ? 'none' : 'position')}
          className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition ${
            openPopover === 'position'
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border-neutral-700'
          }`}
          title="Position, Align to Page & Layer Order"
        >
          <Move className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Position</span>
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
          title="Delete Element (Delete)"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ================= POPOVERS ================= */}
      {openPopover !== 'none' && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpenPopover('none')} />

          {/* 1. POSITION & ALIGN POPOVER (Canva Style) */}
          {openPopover === 'position' && (
            <div className="absolute right-3 top-13 w-72 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-xs animate-in fade-in zoom-in-95 duration-100">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="font-bold text-amber-300 uppercase tracking-wider text-[11px]">
                  Position & Align to Card
                </span>
                <span className="text-[10px] font-mono text-neutral-400">
                  X:{selectedElement.x} Y:{selectedElement.y}
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

              {/* Exact Dimensions & Rotation */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-800">
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Width</label>
                  <input
                    type="number"
                    value={selectedElement.width}
                    onChange={(e) =>
                      onUpdateElement({ width: Math.max(20, parseInt(e.target.value) || 20) }, true)
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-center font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Height</label>
                  <input
                    type="number"
                    value={selectedElement.height}
                    onChange={(e) =>
                      onUpdateElement({ height: Math.max(16, parseInt(e.target.value) || 16) }, true)
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-center font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-neutral-400 block mb-1">Rotate °</label>
                  <input
                    type="number"
                    value={selectedElement.rotation || 0}
                    onChange={(e) =>
                      onUpdateElement({ rotation: parseInt(e.target.value) || 0 }, true)
                    }
                    className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-center font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 2. SPACING POPOVER (Letter Spacing & Line Height) */}
          {openPopover === 'spacing' && isText && (
            <div className="absolute left-64 top-13 w-64 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Typography Spacing
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
                  min="-1"
                  max="12"
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
                  <span className="text-neutral-300">Line Height</span>
                  <span className="font-mono text-amber-300">
                    {(selectedElement as TextElement).lineHeight || 1.3}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.9"
                  max="2.5"
                  step="0.05"
                  value={(selectedElement as TextElement).lineHeight || 1.3}
                  onChange={(e) =>
                    onUpdateElement({ lineHeight: parseFloat(e.target.value) }, true)
                  }
                  className="w-full accent-amber-400"
                />
              </div>
            </div>
          )}

          {/* 3. TEXT EFFECTS POPOVER (Canva Effects: Shadow, Glow, Outline, Pill Background) */}
          {openPopover === 'effects' && isText && (
            <div className="absolute left-72 top-13 w-80 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-4 z-50 space-y-4 text-xs">
              <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5">
                Canva Text Effects
              </div>

              {/* Quick Style Presets */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() =>
                    onUpdateElement(
                      {
                        shadow: undefined,
                        strokeWidth: 0,
                        backgroundColor: undefined,
                      },
                      true
                    )
                  }
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-200"
                >
                  None (Clean)
                </button>
                <button
                  onClick={() =>
                    onUpdateElement(
                      {
                        shadow: { color: '#000000', blur: 8, offsetX: 0, offsetY: 3 },
                      },
                      true
                    )
                  }
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-amber-200 font-semibold"
                  style={{ textShadow: '0 3px 6px #000' }}
                >
                  Drop Shadow
                </button>
                <button
                  onClick={() =>
                    onUpdateElement(
                      {
                        shadow: { color: '#D4AF37', blur: 16, offsetX: 0, offsetY: 0 },
                      },
                      true
                    )
                  }
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-amber-300 font-semibold"
                  style={{ textShadow: '0 0 10px #D4AF37' }}
                >
                  Royal Gold Glow
                </button>
                <button
                  onClick={() =>
                    onUpdateElement(
                      {
                        backgroundColor: 'rgba(26, 4, 8, 0.78)',
                        backgroundPadding: 8,
                      },
                      true
                    )
                  }
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-amber-200"
                >
                  Velvet Pill Box
                </button>
              </div>

              {/* Text Outline / Stroke */}
              <div className="pt-2 border-t border-neutral-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-300">Text Outline (Stroke)</span>
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
                      max="4"
                      step="0.5"
                      value={(selectedElement as TextElement).strokeWidth || 0}
                      onChange={(e) =>
                        onUpdateElement({ strokeWidth: parseFloat(e.target.value) }, true)
                      }
                      className="w-20 accent-amber-400"
                    />
                  </div>
                </div>
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
        </>
      )}
    </div>
  );
};
