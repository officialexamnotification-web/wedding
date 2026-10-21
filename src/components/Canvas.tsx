import React, { useRef, useState, useEffect, useCallback } from 'react';
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
  FrameElement,
  FormElement,
  SheetElement,
  MockupElement,
  Model3DElement,
  VideoElement,
  AudioElement,
  AspectRatioType,
  CANVAS_SIZES,
  PhotoFilterPreset,
  DrawBrushSettings,
  CustomGuide,
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
  PaintRoller,
  Layers,
  AlignCenter,
  Link2,
} from 'lucide-react';

const RealisticModel3D = React.lazy(() => import('./RealisticModel3D'));

interface CanvasProps {
  aspectRatio: AspectRatioType;
  fitRequest?: number;
  backgroundType: 'color' | 'gradient' | 'pattern' | 'image';
  backgroundValue: string;
  elements: CanvasItem[];
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasItem>, commitToHistory?: boolean) => void;
  onAddElement?: (elem: CanvasItem) => void;
  onCommitCurrentState?: () => void;
  onDeleteElement?: () => void;
  onDuplicateElement?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  zoom: number;
  onZoomChange?: (newZoom: number) => void;
  onOpenPhotoAdjust?: (elem: ImageElement) => void;
  drawBrush?: DrawBrushSettings;
  copiedStyle?: Partial<CanvasItem> | null;
  onApplyCopiedStyle?: (targetId: string) => void;
  onCopyStyle?: () => void;
  showRulers?: boolean;
  showSafeZones?: boolean;
}

export function getElementAnimationStyle(elem: CanvasItem): React.CSSProperties {
  const anim = elem.animation || 'none';
  if (anim === 'none') return {};

  const speed = elem.animationSpeed || 1;
  const baseDuration = 0.85 / speed;
  const loopDuration = 2.8 / speed;
  const isForcedLoop = elem.animationTiming === 'loop';

  // Continuous loop animations by nature, or when timing === 'loop'
  const continuousAnims: Record<string, string> = {
    breathe: `canva-breathe ${loopDuration}s ease-in-out infinite`,
    drift: `canva-drift ${loopDuration * 1.1}s ease-in-out infinite`,
    'neon-pulse': `canva-neon-pulse ${loopDuration * 0.85}s ease-in-out infinite`,
    scrapbook: `canva-scrapbook ${loopDuration * 0.9}s steps(2, end) infinite`,
    'photo-flow': `canva-photo-flow ${loopDuration * 1.3}s ease-in-out infinite`,
    float: `canva-float-up ${loopDuration * 0.9}s ease-in-out infinite`,
    heartbeat: `canva-heartbeat ${loopDuration * 0.8}s ease-in-out infinite`,
    'spin-slow': `canva-spin-slow ${loopDuration * 4.5}s linear infinite`,
  };

  if (continuousAnims[anim]) {
    return {
      animation: continuousAnims[anim],
      willChange: 'transform, filter',
    };
  }

  const iter = isForcedLoop ? 'infinite alternate' : '1 both';
  const entranceAnims: Record<string, string> = {
    rise: `canva-rise ${baseDuration}s cubic-bezier(0.22, 1, 0.36, 1) ${iter}`,
    pan: `canva-pan ${baseDuration}s cubic-bezier(0.22, 1, 0.36, 1) ${iter}`,
    fade: `canva-fade ${baseDuration * 1.1}s ease-out ${iter}`,
    pop: `canva-pop ${baseDuration * 0.95}s cubic-bezier(0.34, 1.56, 0.64, 1) ${iter}`,
    wipe: `canva-wipe ${baseDuration * 1.1}s cubic-bezier(0.22, 1, 0.36, 1) ${iter}`,
    tumble: `canva-tumble ${baseDuration * 1.05}s cubic-bezier(0.34, 1.56, 0.64, 1) ${iter}`,
    typewriter: `canva-typewriter ${baseDuration * 1.35}s steps(24, end) ${iter}`,
    stomp: `canva-stomp ${baseDuration * 0.9}s cubic-bezier(0.22, 1, 0.36, 1) ${iter}`,
    tectonic: `canva-tectonic ${baseDuration}s cubic-bezier(0.22, 1, 0.36, 1) ${iter}`,
    baseline: `canva-baseline ${baseDuration}s cubic-bezier(0.22, 1, 0.36, 1) ${iter}`,
    'photo-zoom': `canva-photo-zoom ${baseDuration * 1.25}s cubic-bezier(0.22, 1, 0.36, 1) ${iter}`,
  };

  if (entranceAnims[anim]) {
    return {
      animation: entranceAnims[anim],
      willChange: 'transform, opacity, clip-path',
    };
  }

  return {};
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
  else if (preset === 'festive-glow') parts.push('saturate(1.6) brightness(1.08) contrast(1.06)');
  else if (preset === 'cinematic-teal') parts.push('hue-rotate(12deg) contrast(1.18) saturate(1.15)');
  else if (preset === 'soft-pastel') parts.push('brightness(1.08) saturate(0.88) contrast(0.95)');
  else if (preset === 'dramatic-noir') parts.push('grayscale(0.9) contrast(1.4) brightness(0.92)');
  else if (preset === 'golden-hour') parts.push('sepia(0.35) saturate(1.55) brightness(1.05)');

  if (elem.brightness !== undefined && elem.brightness !== 100) {
    parts.push(`brightness(${elem.brightness}%)`);
  }
  if (elem.contrast !== undefined && elem.contrast !== 100) {
    parts.push(`contrast(${elem.contrast}%)`);
  }
  if (elem.saturation !== undefined && elem.saturation !== 100) {
    parts.push(`saturate(${elem.saturation}%)`);
  }
  if (elem.hueRotate !== undefined && elem.hueRotate !== 0) {
    parts.push(`hue-rotate(${elem.hueRotate}deg)`);
  }
  if (elem.sepia !== undefined && elem.sepia > 0) {
    parts.push(`sepia(${elem.sepia}%)`);
  }
  if (elem.blur !== undefined && elem.blur > 0) {
    parts.push(`blur(${elem.blur}px)`);
  }
  if (elem.bgRemoved) {
    parts.push('drop-shadow(0 6px 16px rgba(212,175,55,0.65)) contrast(1.08)');
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function getImageMaskStyle(elem: ImageElement): React.CSSProperties {
  const mask = elem.mask || 'none';
  const style: React.CSSProperties = {};

  if (mask === 'circle') {
    style.borderRadius = '9999px';
  } else if (mask === 'arch') {
    style.borderRadius = '9999px 9999px 12px 12px';
  } else if (mask === 'rounded') {
    style.borderRadius = `${elem.borderRadius || 16}px`;
  } else if (mask === 'heart') {
    style.clipPath =
      'polygon(50% 15%, 80% 0%, 100% 25%, 100% 60%, 50% 95%, 0% 60%, 0% 25%, 20% 0%)';
  } else if (mask === 'diamond') {
    style.clipPath = 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)';
  } else if (mask === 'octagon') {
    style.clipPath =
      'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)';
  } else if (mask === 'star') {
    style.clipPath =
      'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
  } else if (mask === 'hexagon') {
    style.clipPath = 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)';
  } else if (mask === 'lotus') {
    style.clipPath =
      'polygon(50% 0%, 72% 14%, 92% 8%, 90% 34%, 100% 55%, 84% 76%, 50% 100%, 16% 76%, 0% 55%, 10% 34%, 8% 8%, 28% 14%)';
  } else if (mask === 'scallop') {
    style.clipPath =
      'polygon(50% 0%, 65% 8%, 82% 6%, 89% 21%, 100% 35%, 94% 50%, 100% 65%, 89% 79%, 82% 94%, 65% 92%, 50% 100%, 35% 92%, 18% 94%, 11% 79%, 0% 65%, 6% 50%, 0% 35%, 11% 21%, 18% 6%, 35% 8%)';
  }

  return style;
}

export function renderShapeVisual(elem: ShapeElement) {
  const strokeColor = elem.strokeColor || '#D4AF37';
  const strokeWidth = elem.strokeWidth ?? 2;
  const fillColor = elem.fillColor || 'transparent';
  const borderStyle = elem.borderStyle || 'solid';

  const innerTextOverlay = elem.innerText ? (
    <div
      className="absolute inset-0 flex items-center justify-center p-2 text-center pointer-events-none select-none font-bold tracking-wider"
      style={{
        color: elem.innerTextColor || '#FFEAA7',
        fontSize: `${elem.innerFontSize || 13}px`,
        fontFamily: elem.innerFontFamily || "'Cinzel', serif",
      }}
    >
      {elem.innerText}
    </div>
  ) : null;

  const wrapWithInnerText = (node: React.ReactNode) => (
    <div className="w-full h-full relative pointer-events-none">
      {node}
      {innerTextOverlay}
    </div>
  );

  // If element came from the 312 Shapes SVG Library, render its custom SVG markup directly with dynamic fill/stroke
  if (elem.svgPath && elem.svgPath.includes("<svg")) {
    const colorToUse =
      fillColor && fillColor !== "transparent" ? fillColor : strokeColor || "#D4AF37";
    return wrapWithInnerText(
      <div
        className="w-full h-full flex items-center justify-center pointer-events-none [&>svg]:w-full [&>svg]:h-full"
        style={{
          color: colorToUse,
          filter:
            strokeWidth > 2 && strokeColor
              ? `drop-shadow(0 0 ${Math.min(4, strokeWidth - 1)}px ${strokeColor})`
              : undefined,
        }}
        dangerouslySetInnerHTML={{ __html: elem.svgPath }}
      />
    );
  }

  switch (elem.shapeType) {
    case 'gold-frame':
      return wrapWithInnerText(
        <div
          className="w-full h-full relative pointer-events-none"
          style={{
            border: `${strokeWidth}px ${borderStyle} ${strokeColor}`,
            backgroundColor: fillColor,
            borderRadius: `${elem.borderRadius ?? 8}px`,
          }}
        >
          <div
            className="absolute inset-1.5 pointer-events-none"
            style={{
              border: `1px solid ${strokeColor}`,
              opacity: 0.55,
              borderRadius: `${Math.max(0, (elem.borderRadius ?? 8) - 4)}px`,
            }}
          />
          <div
            className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2"
            style={{ borderColor: strokeColor }}
          />
          <div
            className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2"
            style={{ borderColor: strokeColor }}
          />
          <div
            className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2"
            style={{ borderColor: strokeColor }}
          />
          <div
            className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2"
            style={{ borderColor: strokeColor }}
          />
        </div>
      );

    case 'ornate-border':
      return wrapWithInnerText(
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
            <div
              className="w-2.5 h-2.5 rotate-45 shrink-0 border"
              style={{
                borderColor: strokeColor,
                backgroundColor: fillColor !== 'transparent' ? fillColor : strokeColor,
              }}
            />
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

    case 'line-floral':
      return (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div className="w-full flex items-center gap-2">
            <div className="flex-1 h-0.5" style={{ backgroundColor: strokeColor }} />
            <span style={{ color: strokeColor }} className="text-sm leading-none">
              ❈ ❁ ❈
            </span>
            <div className="flex-1 h-0.5" style={{ backgroundColor: strokeColor }} />
          </div>
        </div>
      );

    case 'line-arrow-both':
      return (
        <svg viewBox="0 0 260 28" className="w-full h-full pointer-events-none">
          <polygon points="4,14 18,5 18,23" fill={strokeColor} />
          <line
            x1="18"
            y1="14"
            x2="242"
            y2="14"
            stroke={strokeColor}
            strokeWidth={Math.max(2, strokeWidth)}
          />
          <polygon points="256,14 242,5 242,23" fill={strokeColor} />
        </svg>
      );

    case 'line-dashed':
      return (
        <div className="w-full h-full flex items-center justify-center pointer-events-none">
          <div
            className="w-full border-t-2 border-dashed"
            style={{ borderColor: strokeColor, borderTopWidth: `${Math.max(2, strokeWidth)}px` }}
          />
        </div>
      );

    case 'circle':
      return wrapWithInnerText(
        <div
          className="w-full h-full rounded-full pointer-events-none"
          style={{
            border: `${strokeWidth}px ${borderStyle} ${strokeColor}`,
            backgroundColor: fillColor,
          }}
        />
      );

    case 'arch-frame':
      return wrapWithInnerText(
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
      return wrapWithInnerText(
        <div
          className="w-full h-full rounded-full pointer-events-none flex items-center justify-center"
          style={{
            border: `${strokeWidth}px ${borderStyle} ${strokeColor}`,
            backgroundColor: fillColor === 'transparent' ? 'rgba(212, 175, 55, 0.14)' : fillColor,
          }}
        />
      );

    case 'diamond':
      return wrapWithInnerText(
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
      return wrapWithInnerText(
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

    case 'scallop-badge':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <path
            d="M100,10 C115,10 125,22 140,18 C155,14 162,28 175,35 C188,42 182,58 190,72 C198,86 188,100 190,115 C192,130 180,142 175,156 C170,170 155,172 140,182 C125,192 115,185 100,190 C85,185 75,192 60,182 C45,172 30,170 25,156 C20,142 8,130 10,115 C12,100 2,86 10,72 C18,58 12,42 25,35 C38,28 45,14 60,18 C75,22 85,10 100,10 Z"
            fill={fillColor === 'transparent' ? 'rgba(196,30,58,0.22)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
          <circle
            cx="100"
            cy="100"
            r="68"
            fill="none"
            stroke={strokeColor}
            strokeWidth={Math.max(1, strokeWidth)}
          />
        </svg>
      );

    case 'ribbon-banner':
      return wrapWithInnerText(
        <svg
          viewBox="0 0 300 70"
          preserveAspectRatio="none"
          className="w-full h-full pointer-events-none"
        >
          <polygon
            points="0,10 24,35 0,60 30,60 30,10"
            fill={fillColor === 'transparent' ? '#4a0404' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <polygon
            points="300,10 276,35 300,60 270,60 270,10"
            fill={fillColor === 'transparent' ? '#4a0404' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
          <rect
            x="20"
            y="6"
            width="260"
            height="54"
            rx="6"
            fill={fillColor === 'transparent' ? '#630c1d' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.5}
          />
        </svg>
      );

    case 'mandala-ring':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <circle
            cx="100"
            cy="100"
            r="92"
            fill={fillColor === 'transparent' ? 'none' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray="6 4"
          />
          <circle
            cx="100"
            cy="100"
            r="78"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.5}
          />
          <circle
            cx="100"
            cy="100"
            r="64"
            fill="none"
            stroke={strokeColor}
            strokeWidth={1}
            strokeDasharray="2 5"
          />
        </svg>
      );

    case 'shield-crest':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 220" className="w-full h-full pointer-events-none">
          <path
            d="M100,10 L185,40 L185,115 C185,165 145,198 100,212 C55,198 15,165 15,115 L15,40 Z"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.14)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'speech-bubble':
      return wrapWithInnerText(
        <svg viewBox="0 0 220 130" className="w-full h-full pointer-events-none">
          <path
            d="M20,10 H200 A12,12 0 0 1 212,22 V85 A12,12 0 0 1 200,97 H95 L60,124 L68,97 H20 A12,12 0 0 1 8,85 V22 A12,12 0 0 1 20,10 Z"
            fill={fillColor === 'transparent' ? 'rgba(45,6,16,0.85)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 1.8}
          />
        </svg>
      );

    case 'cloud-badge':
      return wrapWithInnerText(
        <svg viewBox="0 0 220 130" className="w-full h-full pointer-events-none">
          <path
            d="M55,105 H170 A32,32 0 0 0 175,42 A42,42 0 0 0 98,25 A36,36 0 0 0 42,52 A28,28 0 0 0 55,105 Z"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.15)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'star':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <polygon
            points="100,8 123,68 188,68 136,107 156,170 100,132 44,170 64,107 12,68 77,68"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.16)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'hexagon':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <polygon
            points="50,12 150,12 192,100 150,188 50,188 8,100"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.12)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'pentagon':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <polygon
            points="100,10 190,78 156,188 44,188 10,78"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.12)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'triangle':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <polygon
            points="100,12 190,185 10,185"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.12)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'heart-shape':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <path
            d="M100,178 C100,178 18,122 18,65 C18,34 42,14 70,14 C86,14 100,24 100,38 C100,24 114,14 130,14 C158,14 182,34 182,65 C182,122 100,178 100,178 Z"
            fill={fillColor === 'transparent' ? 'rgba(196,30,58,0.2)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'octagon-frame':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <polygon
            points="60,8 140,8 192,60 192,140 140,192 60,192 8,140 8,60"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.08)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
          <polygon
            points="65,18 135,18 182,65 182,135 135,182 65,182 18,135 18,65"
            fill="none"
            stroke={strokeColor}
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        </svg>
      );

    case 'parallelogram':
      return wrapWithInnerText(
        <svg viewBox="0 0 220 90" preserveAspectRatio="none" className="w-full h-full pointer-events-none">
          <polygon
            points="28,6 214,6 192,84 6,84"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.15)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'trapezoid':
      return wrapWithInnerText(
        <svg viewBox="0 0 220 90" preserveAspectRatio="none" className="w-full h-full pointer-events-none">
          <polygon
            points="36,8 184,8 214,82 6,82"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.15)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'cross-plus':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 200" className="w-full h-full pointer-events-none">
          <polygon
            points="70,12 130,12 130,70 188,70 188,130 130,130 130,188 70,188 70,130 12,130 12,70 70,70"
            fill={fillColor === 'transparent' ? 'rgba(212,175,55,0.14)' : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth * 2}
          />
        </svg>
      );

    case 'arrow-right':
      return wrapWithInnerText(
        <svg viewBox="0 0 200 100" className="w-full h-full pointer-events-none">
          <polygon
            points="10,35 135,35 135,12 190,50 135,88 135,65 10,65"
            fill={fillColor === 'transparent' ? strokeColor : fillColor}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
          />
        </svg>
      );

    case 'rectangle':
    default:
      return wrapWithInnerText(
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

function getTextFitFontSize(t: TextElement): number {
  const availableWidth = Math.max(1, t.width - (t.backgroundPadding || 0) * 2 - 4);
  const availableHeight = Math.max(1, t.height - (t.backgroundPadding || 0) * 2);
  const lineHeight = Math.max(1, t.lineHeight || 1.2);
  const hasWideGlyphs = /[\u0900-\u0dff\u3040-\u30ff\u3400-\u9fff]/.test(t.text);
  const glyphWidth = hasWideGlyphs ? 0.68 : 0.56;
  const tracking = Math.max(0, t.letterSpacing || 0);
  const textLines = t.text.split(/\r?\n/);

  for (let size = Math.max(7, t.fontSize); size >= 7; size -= 0.5) {
    const charsPerLine = Math.max(1, Math.floor(availableWidth / (size * glyphWidth + tracking)));
    const estimatedLines = textLines.reduce(
      (count, line) => count + Math.max(1, Math.ceil(line.length / charsPerLine)),
      0,
    );
    if (estimatedLines * size * lineHeight <= availableHeight + 1) return size;
  }

  return Math.min(7, t.fontSize);
}

export function renderTextVisual(t: TextElement) {
  const isHollow = t.effectType === 'hollow';
  const curve = t.curveRadius || 0;
  const fittedFontSize = getTextFitFontSize(t);

  // If Curved Text is active, render clean SVG textPath
  if (curve !== 0) {
    const w = Math.max(120, t.width);
    const h = Math.max(60, t.height);
    const bend = (curve / 100) * (h * 0.85);
    const startY = curve > 0 ? h * 0.78 : h * 0.28;
    const ctrlY = startY - bend;
    const pathId = `curve-path-${t.id}`;
    const d = `M 10,${startY} Q ${w / 2},${ctrlY} ${w - 10},${startY}`;

    return (
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full overflow-visible pointer-events-none">
        <defs>
          <path id={pathId} d={d} fill="none" />
        </defs>
        <text
          fill={isHollow ? 'transparent' : t.color}
          stroke={t.strokeWidth && t.strokeWidth > 0 ? t.strokeColor || t.color : undefined}
          strokeWidth={t.strokeWidth || 0}
          style={{
            fontFamily: t.fontFamily,
            fontSize: `${fittedFontSize}px`,
            fontWeight: t.fontWeight,
            fontStyle: t.fontStyle,
            letterSpacing: `${t.letterSpacing}px`,
            textTransform: t.textTransform || 'none',
          }}
        >
          <textPath href={`#${pathId}`} startOffset="50%" textAnchor="middle">
            {t.text.replace(/\n/g, ' ')}
          </textPath>
        </text>
      </svg>
    );
  }

  return (
    <div
      className="whitespace-pre-line break-words w-full select-none"
      style={{
        fontFamily: t.fontFamily,
        fontSize: `${fittedFontSize}px`,
        color: isHollow ? 'transparent' : t.gradientText ? 'transparent' : t.color,
        backgroundImage: t.gradientText || undefined,
        WebkitBackgroundClip: t.gradientText ? 'text' : undefined,
        textAlign: t.textAlign,
        fontWeight: t.fontWeight,
        fontStyle: t.fontStyle,
        textDecoration: t.textDecoration || 'none',
        letterSpacing: `${t.letterSpacing}px`,
        lineHeight: t.lineHeight,
        textTransform: t.textTransform || 'none',
        backgroundColor: t.backgroundColor || undefined,
        padding: t.backgroundPadding ? `${t.backgroundPadding}px` : undefined,
        borderRadius: t.backgroundColor ? `${t.backgroundRadius || 8}px` : undefined,
        WebkitTextStroke:
          t.strokeWidth && t.strokeWidth > 0
            ? `${t.strokeWidth}px ${t.strokeColor || t.color || '#000'}`
            : undefined,
        textShadow: t.shadow
          ? `${t.shadow.offsetX}px ${t.shadow.offsetY}px ${t.shadow.blur}px ${t.shadow.color}`
          : undefined,
      }}
    >
      {t.text}
    </div>
  );
}

// Render Canva Table Element
export function renderTableVisual(tb: TableElement) {
  return (
    <div
      className="w-full h-full overflow-hidden flex flex-col pointer-events-none select-none shadow-lg"
      style={{
        borderRadius: `${tb.borderRadius ?? 10}px`,
        border: `${tb.borderWidth || 1}px solid ${tb.borderColor || '#D4AF37'}`,
        fontFamily: tb.fontFamily || "'Cinzel', serif",
        fontSize: `${tb.fontSize || 11}px`,
      }}
    >
      {tb.rows.map((row, rIdx) => {
        const isHeader = rIdx === 0;
        const bg = isHeader
          ? tb.headerBgColor || '#630c1d'
          : rIdx % 2 === 1
          ? tb.cellBgColor || 'rgba(20,5,10,0.85)'
          : tb.altRowBgColor || 'rgba(45,10,20,0.75)';
        const color = isHeader ? tb.headerTextColor || '#FFEAA7' : tb.textColor || '#FFF2C6';

        return (
          <div
            key={rIdx}
            className="flex-1 grid items-center"
            style={{
              gridTemplateColumns: `repeat(${row.length}, minmax(0, 1fr))`,
              backgroundColor: bg,
              color,
              borderBottom:
                rIdx < tb.rows.length - 1
                  ? `1px solid ${tb.borderColor || 'rgba(212,175,55,0.4)'}`
                  : 'none',
            }}
          >
            {row.map((cell, cIdx) => (
              <div
                key={cIdx}
                className={`px-2 py-1 text-center truncate ${isHeader ? 'font-bold tracking-wider' : ''}`}
                style={{
                  borderRight:
                    cIdx < row.length - 1
                      ? `1px solid ${tb.borderColor || 'rgba(212,175,55,0.25)'}`
                      : 'none',
                }}
              >
                {cell}
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

// Render Canva Chart / Infographic Element
export function renderChartVisual(ch: ChartElement) {
  const maxVal = Math.max(1, ...ch.data.map((d) => d.value));
  const totalVal = Math.max(
    1,
    ch.data.reduce((s, d) => s + d.value, 0)
  );

  return (
    <div
      className="w-full h-full p-3 rounded-xl flex flex-col justify-between pointer-events-none select-none shadow-lg"
      style={{
        backgroundColor: ch.backgroundColor || 'rgba(20, 5, 10, 0.85)',
        border: `1.5px solid ${ch.borderColor || '#D4AF37'}`,
        color: ch.textColor || '#FFEAA7',
      }}
    >
      <div className="text-[11px] font-cinzel font-bold text-center tracking-wider uppercase truncate border-b border-amber-500/20 pb-1">
        {ch.title}
      </div>

      {/* VERTICAL BAR CHART */}
      {ch.chartType === 'bar' && (
        <div className="flex-1 flex items-end justify-around gap-2 pt-3 pb-1 px-2">
          {ch.data.map((dp, i) => {
            const hPct = Math.round((dp.value / maxVal) * 100);
            return (
              <div key={i} className="flex-1 flex flex-col items-center h-full justify-end gap-1">
                {ch.showValues && (
                  <span className="text-[9px] font-mono opacity-90">{dp.value}%</span>
                )}
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${Math.max(12, hPct * 0.72)}%`,
                    backgroundColor: dp.color,
                  }}
                />
                <span className="text-[9px] truncate max-w-full">{dp.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* HORIZONTAL BAR CHART */}
      {ch.chartType === 'horizontal-bar' && (
        <div className="flex-1 flex flex-col justify-around py-1 space-y-1">
          {ch.data.map((dp, i) => {
            const wPct = Math.round((dp.value / maxVal) * 100);
            return (
              <div key={i} className="space-y-0.5">
                <div className="flex justify-between text-[9px]">
                  <span>{dp.label}</span>
                  <span className="font-mono">{dp.value}%</span>
                </div>
                <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${wPct}%`, backgroundColor: dp.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DONUT / PIE / PROGRESS RINGS */}
      {(ch.chartType === 'donut' ||
        ch.chartType === 'pie' ||
        ch.chartType === 'progress-rings' ||
        ch.chartType === 'line' ||
        ch.chartType === 'area' ||
        ch.chartType === 'radar' ||
        ch.chartType === 'stacked-bar' ||
        ch.chartType === 'gauge' ||
        ch.chartType === 'funnel') && (
        <div className="flex-1 flex items-center justify-around gap-2 py-1">
          <svg viewBox="0 0 100 100" className="w-24 h-24 shrink-0">
            {(ch.chartType === 'line' || ch.chartType === 'area') ? (
              <>
                <polyline
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="3"
                  points={ch.data
                    .map((d, idx) => {
                      const x = 12 + (idx / Math.max(1, ch.data.length - 1)) * 76;
                      const y = 85 - (d.value / maxVal) * 68;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />
                {ch.data.map((d, idx) => {
                  const x = 12 + (idx / Math.max(1, ch.data.length - 1)) * 76;
                  const y = 85 - (d.value / maxVal) * 68;
                  return <circle key={idx} cx={x} cy={y} r="4.5" fill={d.color} />;
                })}
              </>
            ) : (
              (() => {
                let cumulative = 0;
                return ch.data.map((d, idx) => {
                  const pct = (d.value / totalVal) * 100;
                  const dashArray = `${pct} ${100 - pct}`;
                  const dashOffset = 25 - cumulative;
                  cumulative += pct;
                  return (
                    <circle
                      key={idx}
                      cx="50"
                      cy="50"
                      r={ch.chartType === 'pie' ? '25' : '34'}
                      fill="transparent"
                      stroke={d.color}
                      strokeWidth={ch.chartType === 'pie' ? '50' : '14'}
                      strokeDasharray={dashArray}
                      strokeDashoffset={dashOffset}
                      pathLength={100}
                    />
                  );
                });
              })()
            )}
          </svg>

          <div className="space-y-1 text-[10px]">
            {ch.data.map((d, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: d.color }}
                />
                <span className="truncate">{d.label}:</span>
                <span className="font-mono font-bold">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Render Canva Multi-Photo Collage Grid Element
export function renderGridVisual(gr: GridElement) {
  const imgs = gr.images || [];
  const gap = `${gr.gap ?? 6}px`;
  const radius = `${gr.borderRadius ?? 12}px`;
  const border = `${gr.borderWidth ?? 2}px solid ${gr.borderColor || '#D4AF37'}`;

  if (gr.slots && gr.slots.length > 0) {
    return (
      <div
        className="w-full h-full relative overflow-hidden pointer-events-none"
        style={{
          borderRadius: radius,
          border,
          backgroundColor: gr.backgroundColor || "rgba(212,175,55,0.08)",
        }}
      >
        {gr.slots.map((slot, i) => (
          <div
            key={i}
            className="absolute overflow-hidden shadow-inner"
            style={{
              left: `${slot.x}%`,
              top: `${slot.y}%`,
              width: `${slot.w}%`,
              height: `${slot.h}%`,
              borderRadius: `${slot.rx ?? gr.borderRadius ?? 6}px`,
              border: `1px solid ${gr.borderColor || "#D4AF37"}66`,
            }}
          >
            <img
              src={imgs[i % Math.max(1, imgs.length)] || "/images/wedding_couple_1791965341379.jpg"}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    );
  }

  if (gr.gridLayout === '2-col') {
    return (
      <div
        className="w-full h-full grid grid-cols-2 p-1.5 pointer-events-none"
        style={{ gap, borderRadius: radius, border, backgroundColor: gr.backgroundColor }}
      >
        {[0, 1].map((i) => (
          <img
            key={i}
            src={imgs[i] || imgs[0]}
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (gr.gridLayout === '2-row') {
    return (
      <div
        className="w-full h-full grid grid-rows-2 p-1.5 pointer-events-none"
        style={{ gap, borderRadius: radius, border, backgroundColor: gr.backgroundColor }}
      >
        {[0, 1].map((i) => (
          <img
            key={i}
            src={imgs[i] || imgs[0]}
            alt=""
            className="w-full h-full object-cover rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (gr.gridLayout === '3-collage') {
    return (
      <div
        className="w-full h-full grid grid-cols-2 grid-rows-2 p-1.5 pointer-events-none"
        style={{ gap, borderRadius: radius, border, backgroundColor: gr.backgroundColor }}
      >
        <img
          src={imgs[0]}
          alt=""
          className="w-full h-full object-cover rounded-lg row-span-2"
        />
        <img src={imgs[1] || imgs[0]} alt="" className="w-full h-full object-cover rounded-lg" />
        <img src={imgs[2] || imgs[0]} alt="" className="w-full h-full object-cover rounded-lg" />
      </div>
    );
  }

  if (gr.gridLayout === 'polaroid-trio') {
    return (
      <div
        className="w-full h-full grid grid-cols-3 p-2 pointer-events-none items-center"
        style={{ gap, borderRadius: radius, border, backgroundColor: gr.backgroundColor }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-full bg-[#FFFDF9] p-1 pb-3 rounded shadow-md flex flex-col"
          >
            <img
              src={imgs[i] || imgs[0]}
              alt=""
              className="w-full flex-1 object-cover rounded-xs"
            />
          </div>
        ))}
      </div>
    );
  }

  if (gr.gridLayout === 'hero-split') {
    return (
      <div
        className="w-full h-full grid grid-cols-2 grid-rows-2 p-1.5 pointer-events-none"
        style={{ gap, borderRadius: radius, border, backgroundColor: gr.backgroundColor }}
      >
        <img
          src={imgs[0]}
          alt=""
          className="w-full h-full object-cover rounded-lg col-span-2"
        />
        <img src={imgs[1] || imgs[0]} alt="" className="w-full h-full object-cover rounded-lg" />
        <img src={imgs[2] || imgs[0]} alt="" className="w-full h-full object-cover rounded-lg" />
      </div>
    );
  }

  // Default 4-quad
  return (
    <div
      className="w-full h-full grid grid-cols-2 grid-rows-2 p-1.5 pointer-events-none"
      style={{ gap, borderRadius: radius, border, backgroundColor: gr.backgroundColor }}
    >
      {[0, 1, 2, 3].map((i) => (
        <img
          key={i}
          src={imgs[i] || imgs[0]}
          alt=""
          className="w-full h-full object-cover rounded-lg"
        />
      ))}
    </div>
  );
}

// Render Canva Live Countdown Timer Element
export function renderCountdownVisual(cd: CountdownElement) {
  const targetMs = new Date(cd.targetDate || '2026-12-18T19:00:00').getTime();
  const nowMs = Date.now();
  const diff = Math.max(0, targetMs - nowMs);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / 1000 / 60) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  return (
    <div
      className="w-full h-full rounded-2xl p-2.5 flex flex-col items-center justify-between pointer-events-none select-none shadow-lg"
      style={{
        backgroundColor: cd.backgroundColor || 'rgba(45, 6, 16, 0.88)',
        border: `1.5px solid ${cd.borderColor || '#D4AF37'}`,
        color: cd.primaryColor || '#FFEAA7',
      }}
    >
      <div className="text-[10px] font-cinzel font-bold tracking-widest uppercase">
        ⏳ {cd.eventLabel || 'SHUBH VIVAH MUHURAT IN'}
      </div>

      <div className="grid grid-cols-4 gap-2 w-full">
        {[
          { val: String(days).padStart(2, '0'), unit: 'DAYS' },
          { val: String(hours).padStart(2, '0'), unit: 'HRS' },
          { val: String(mins).padStart(2, '0'), unit: 'MINS' },
          { val: String(secs).padStart(2, '0'), unit: 'SECS' },
        ].map((box, i) => (
          <div
            key={i}
            className="bg-black/45 border border-amber-400/40 rounded-lg py-1 flex flex-col items-center justify-center"
          >
            <span className="font-cinzel font-extrabold text-sm sm:text-base leading-none">
              {box.val}
            </span>
            <span className="text-[8px] opacity-80 font-mono mt-0.5">{box.unit}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Render Canva Barcode / Royal Entry Pass Element
export function renderBarcodeVisual(bc: BarcodeElement) {
  // Deterministic bar pattern from codeValue
  const chars = (bc.codeValue || 'VIP-2026').split('');
  return (
    <div
      className="w-full h-full rounded-xl p-2 flex flex-col items-center justify-between pointer-events-none select-none shadow-md"
      style={{
        backgroundColor: bc.backgroundColor || '#FFF4D6',
        border: `1.5px solid ${bc.borderColor || '#D4AF37'}`,
        color: bc.color || '#1a0408',
      }}
    >
      <div className="text-[9px] font-cinzel font-bold tracking-widest uppercase">
        {bc.label || 'ROYAL ENTRY PASS'}
      </div>
      <div className="w-full flex-1 flex items-center justify-center gap-[2px] px-2 my-0.5 overflow-hidden">
        {Array.from({ length: 38 }).map((_, idx) => {
          const chCode = chars[idx % chars.length].charCodeAt(0);
          const w = (chCode + idx) % 3 === 0 ? 3 : (chCode + idx) % 2 === 0 ? 2 : 1;
          return (
            <div
              key={idx}
              className="h-full"
              style={{
                width: `${w}px`,
                backgroundColor: bc.color || '#1a0408',
              }}
            />
          );
        })}
      </div>
      {bc.showText && (
        <div className="text-[9px] font-mono tracking-widest font-bold">
          {bc.codeValue}
        </div>
      )}
    </div>
  );
}


// Evaluate spreadsheet formula cells (=SUM(B1:B4), =AVERAGE(B1:B4))
export function evaluateSheetCell(raw: string | number, allCells: (string | number)[][]): string | number {
  if (typeof raw === "number") return raw;
  const str = String(raw).trim();
  if (!str.startsWith("=")) return str;
  const upper = str.toUpperCase();
  const match = upper.match(/^=(SUM|AVERAGE|AVG|MAX|MIN)\(([A-Z])(\d+):([A-Z])(\d+)\)$/);
  if (!match) return str;
  const fn = match[1];
  const colIdx = match[2].charCodeAt(0) - 65;
  const startRow = Math.max(0, parseInt(match[3], 10) - 1);
  const endRow = Math.min(allCells.length - 1, parseInt(match[5], 10) - 1);
  const nums: number[] = [];
  for (let r = startRow; r <= endRow; r++) {
    const v = Number(allCells[r]?.[colIdx]);
    if (!Number.isNaN(v)) nums.push(v);
  }
  if (nums.length === 0) return 0;
  const sum = nums.reduce((a, b) => a + b, 0);
  if (fn === "SUM") return sum;
  if (fn === "AVERAGE" || fn === "AVG") return +(sum / nums.length).toFixed(1);
  if (fn === "MAX") return Math.max(...nums);
  if (fn === "MIN") return Math.min(...nums);
  return str;
}

// Render Canva Clipping Frame Element (30 Masks)
export function renderFrameVisual(
  fr: FrameElement,
  onPhotoMouseDown?: (event: React.MouseEvent) => void,
  onPhotoTouchStart?: (event: React.TouchEvent) => void,
) {
  const clipId = `canvas-frame-clip-${fr.id}`;
  const cssFrameClipById: Record<string, string> = {
    'frame-01': 'polygon(10% 96%, 10% 38%, 10.5% 31%, 13% 25%, 20% 19%, 31% 13%, 42% 8%, 50% 4%, 58% 8%, 69% 13%, 80% 19%, 87% 25%, 89.5% 31%, 90% 38%, 90% 96%)',
    'frame-02': 'polygon(12% 95%, 12% 42%, 13% 34%, 18% 25%, 28% 18%, 38% 10%, 50% 4%, 62% 10%, 72% 18%, 82% 25%, 87% 34%, 88% 42%, 88% 95%)',
    'frame-03': 'polygon(50% 4%, 68% 17%, 86% 38%, 86% 67%, 73% 87%, 50% 96%, 27% 87%, 14% 67%, 14% 38%, 32% 17%)',
    'frame-04': 'circle(42% at 50% 50%)',
    'frame-05': 'ellipse(38% 45% at 50% 50%)',
    'frame-06': 'polygon(50% 6%, 94% 50%, 50% 94%, 6% 50%)',
    'frame-07': 'polygon(30% 5%, 70% 5%, 95% 30%, 95% 70%, 70% 95%, 30% 95%, 5% 70%, 5% 30%)',
    'frame-08': 'polygon(50% 4%, 93% 27%, 93% 73%, 50% 96%, 7% 73%, 7% 27%)',
    'frame-09': 'polygon(50% 92%, 32% 78%, 12% 56%, 8% 39%, 15% 23%, 30% 15%, 43% 18%, 50% 28%, 57% 18%, 70% 15%, 85% 23%, 92% 39%, 88% 56%, 68% 78%)',
    'frame-10': 'polygon(50% 4%, 61% 16%, 78% 10%, 80% 27%, 95% 33%, 87% 49%, 95% 65%, 80% 71%, 78% 88%, 61% 82%, 50% 95%, 39% 82%, 22% 88%, 20% 71%, 5% 65%, 13% 49%, 5% 33%, 20% 27%, 22% 10%, 39% 16%)',
    'frame-11': 'inset(8% 10% 22% round 3%)',
    'frame-12': 'inset(7% round 18%)',
    'frame-13': 'inset(4% 16% round 999px)',
    'frame-14': 'polygon(8% 96%, 8% 48%, 9% 37%, 15% 27%, 26% 19%, 37% 13%, 46% 7%, 50% 2%, 54% 7%, 63% 13%, 74% 19%, 85% 27%, 91% 37%, 92% 48%, 92% 96%)',
  };
  const cssFrameClip = cssFrameClipById[fr.frameId] || `url(#${clipId})`;
  return (
    <div className="w-full h-full relative select-none">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
        <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <g fill="#fff" dangerouslySetInnerHTML={{ __html: fr.clipPathSvg }} />
          </clipPath>
        </defs>
      <foreignObject x="0" y="0" width="100" height="100">
        <div style={{
          width: '100%', height: '100%', overflow: 'hidden', background: fr.placeholderColor || '#2A0A12',
          clipPath: cssFrameClip,
        }}
          onMouseDown={onPhotoMouseDown}
          onTouchStart={onPhotoTouchStart}
        >
          {fr.naturalImageFit && fr.imageSrc ? (
            <img
              src={fr.imageSrc}
              alt=""
              draggable={false}
              style={{
                position: 'relative', display: 'block', width: '100%', height: '100%', maxWidth: 'none',
                objectFit: 'cover',
                objectPosition: '50% 50%',
                transform: `translate(${fr.imageOffsetX || 0}%, ${fr.imageOffsetY || 0}%) scale(${fr.imageScale || 1})`,
                transformOrigin: 'center center',
                cursor: onPhotoMouseDown ? 'grab' : 'default', touchAction: 'none',
              }}
            />
          ) : (
            <img
              src={fr.imageSrc || "/images/wedding_couple_1791965341379.jpg"}
              alt=""
              draggable={false}
              style={{
                position: 'relative', display: 'block', maxWidth: 'none', objectFit: 'cover',
                width: `${100 * (fr.imageScale || 1)}%`, height: `${100 * (fr.imageScale || 1)}%`,
                left: `${-50 * ((fr.imageScale || 1) - 1) + (fr.imageOffsetX || 0)}%`,
                top: `${-50 * ((fr.imageScale || 1) - 1) + (fr.imageOffsetY || 0)}%`,
              }}
            />
          )}
        </div>
      </foreignObject>
        {fr.borderSvg && (
          <g
            style={{ color: fr.borderColor || "#D4AF37" }}
            dangerouslySetInnerHTML={{ __html: fr.borderSvg }}
          />
        )}
      </svg>
    </div>
  );
}

function applyFramePhotoPanStyle(
  image: HTMLImageElement,
  frame: FrameElement,
  offsetX: number,
  offsetY: number,
) {
  if (frame.naturalImageFit) {
    image.style.transform = `translate(${offsetX}%, ${offsetY}%) scale(${frame.imageScale || 1})`;
  } else {
    const scale = frame.imageScale || 1;
    image.style.left = `${-50 * (scale - 1) + offsetX}%`;
    image.style.top = `${-50 * (scale - 1) + offsetY}%`;
  }
}

// Render Canva Interactive Form Element (RSVP / Poll / Meal Choice)
export function renderFormVisual(
  fm: FormElement,
  onUpdateElement?: (id: string, updates: Partial<CanvasItem>, commit?: boolean) => void
) {
  return (
    <div
      className="w-full h-full rounded-2xl p-3 flex flex-col justify-between shadow-xl overflow-hidden select-none"
      style={{
        backgroundColor: fm.backgroundColor || "rgba(20, 10, 14, 0.94)",
        border: `1.5px solid ${fm.borderColor || fm.accentColor || "#D4AF37"}`,
        color: fm.textColor || "#FFFBEB",
      }}
    >
      <div>
        <div
          className="text-xs font-cinzel font-bold tracking-wider uppercase truncate"
          style={{ color: fm.accentColor || "#D4AF37" }}
        >
          {fm.formTitle || "Royal RSVP Form"}
        </div>
        {fm.formSubtitle && (
          <div className="text-[9px] opacity-75 truncate">{fm.formSubtitle}</div>
        )}
      </div>

      <div className="space-y-1.5 my-1 flex-1 flex flex-col justify-center overflow-hidden">
        {(fm.fields || []).slice(0, 3).map((field, idx) => (
          <div key={field.id || idx} className="space-y-0.5">
            <label className="text-[9px] font-semibold opacity-90 block truncate">
              {field.label}
            </label>
            {field.fieldType === "select" || field.fieldType === "radio" ? (
              <div className="px-2 py-1 rounded bg-black/50 border border-amber-500/30 text-[9px] text-amber-200 truncate">
                ▾ {field.value || field.options?.[0] || "Select option"}
              </div>
            ) : (
              <div className="px-2 py-1 rounded bg-black/50 border border-amber-500/30 text-[9px] text-amber-100 truncate">
                {field.value || field.placeholder || "Enter response..."}
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={(e) => {
          if (!onUpdateElement) return;
          e.stopPropagation();
          onUpdateElement(
            fm.id,
            { submittedCount: (fm.submittedCount || 1) + 1 },
            true
          );
        }}
        className="w-full py-1.5 rounded-lg font-cinzel font-bold text-[10px] uppercase tracking-wider text-neutral-950 shadow transition hover:brightness-110 pointer-events-auto cursor-pointer"
        style={{ backgroundColor: fm.accentColor || "#D4AF37" }}
      >
        {fm.submitLabel || "Confirm RSVP"}{" "}
        {fm.submittedCount ? `(${fm.submittedCount})` : ""}
      </button>
    </div>
  );
}

// Render Canva Live Formula Spreadsheet Element
export function renderSheetVisual(sh: SheetElement) {
  const rows = sh.cells || [];
  return (
    <div
      className="w-full h-full rounded-xl overflow-hidden flex flex-col shadow-xl pointer-events-none select-none"
      style={{
        backgroundColor: sh.backgroundColor || "rgba(18, 8, 12, 0.94)",
        border: `1.5px solid ${sh.borderColor || "#D4AF37"}`,
        color: sh.textColor || "#FFFBEB",
      }}
    >
      <div
        className="px-2.5 py-1.5 flex items-center justify-between text-[10px] font-cinzel font-bold"
        style={{ backgroundColor: sh.headerBgColor || "#78350F", color: "#FEF3C7" }}
      >
        <span className="truncate">📊 {sh.sheetTitle || "Wedding Budget Sheet"}</span>
        <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300">
          fx LIVE
        </span>
      </div>

      <div className="grid grid-cols-4 border-b border-amber-500/30 bg-black/40 text-[8px] font-bold text-amber-300">
        {(sh.columns || ["A", "B", "C", "D"]).slice(0, 4).map((col, idx) => (
          <div key={idx} className="px-1.5 py-1 truncate border-r border-amber-500/20 last:border-r-0">
            {col}
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col divide-y divide-amber-500/15 overflow-hidden text-[9px]">
        {rows.map((r, rIdx) => {
          const isLastRow = rIdx === rows.length - 1;
          return (
            <div
              key={rIdx}
              className={`grid grid-cols-4 flex-1 items-center ${
                isLastRow ? "bg-amber-500/15 font-bold text-amber-200" : ""
              }`}
            >
              {r.slice(0, 4).map((cell, cIdx) => {
                const evaluated = evaluateSheetCell(cell, rows);
                return (
                  <div
                    key={cIdx}
                    className="px-1.5 truncate border-r border-amber-500/10 last:border-r-0 font-mono"
                  >
                    {evaluated}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Render Canva Device & Stationery Mockup Element
export function renderMockupVisual(mk: MockupElement) {
  const sr = mk.screenRect || { x: 16, y: 10, w: 68, h: 78, rx: 6 };
  return (
    <div className="w-full h-full relative pointer-events-none select-none flex flex-col items-center justify-center">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
        style={{ color: mk.accentColor || "#D4AF37" }}
      >
        <defs>
          <clipPath id={`mockup-screen-${mk.id}`}>
            <rect x={sr.x} y={sr.y} width={sr.w} height={sr.h} rx={sr.rx} />
          </clipPath>
        </defs>
        <g dangerouslySetInnerHTML={{ __html: mk.frameSvg }} />
        <g clipPath={`url(#mockup-screen-${mk.id})`}>
          <image
            href={mk.contentImageSrc || "/images/royal_mandap_cover.webp"}
            x={sr.x}
            y={sr.y}
            width={sr.w}
            height={sr.h}
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      </svg>
      {mk.caption && (
        <div className="absolute bottom-1.5 px-2 py-0.5 rounded-full bg-black/75 border border-amber-400/40 text-[8px] font-cinzel text-amber-200 truncate max-w-[90%]">
          {mk.caption}
        </div>
      )}
    </div>
  );
}

// Render a physically lit 3D object with deliberate, user-controlled orientation.
export function renderModel3DVisual(m3: Model3DElement) {
  return (
    <React.Suspense fallback={<div className="w-full h-full" />}>
      <RealisticModel3D item={m3} />
    </React.Suspense>
  );
}
// Render Canva Motion Video Loop Element
export function renderVideoVisual(vd: VideoElement) {
  if (vd.mediaSrc) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-black" style={{ borderRadius: `${vd.borderRadius ?? 10}px`, border: `${vd.borderWidth ?? 1}px solid ${vd.borderColor || '#D4AF37'}` }}>
        <video
          src={vd.mediaSrc}
          className="h-full w-full object-cover"
          autoPlay={vd.isPlaying}
          muted={vd.isMuted ?? true}
          loop={vd.loop ?? true}
          playsInline
          preload="metadata"
          style={{ pointerEvents: 'none' }}
        />
        <div className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-black/80 to-transparent px-2 pb-1.5 pt-4 text-[10px] text-white/90">{vd.videoName}</div>
      </div>
    );
  }
  const dur = 3.2 / (vd.playbackSpeed || 1);
  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center select-none pointer-events-none shadow-xl"
      style={{
        background: vd.bgGradient || "linear-gradient(135deg, #2a080c 0%, #4a1018 100%)",
        borderRadius: `${vd.borderRadius ?? 14}px`,
        border: `${vd.borderWidth ?? 2}px solid ${vd.borderColor || "#D4AF37"}`,
      }}
    >
      {/* Animated Particle / Bokeh / Mandala SVG Layer */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
        {Array.from({ length: 12 }).map((_, idx) => {
          const cx = 12 + ((idx * 23) % 78);
          const cy = 14 + ((idx * 19) % 72);
          const r = 2 + (idx % 4) * 1.8;
          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={r}
              fill={idx % 2 === 0 ? vd.primaryColor : vd.secondaryColor}
              opacity={0.65}
              style={{
                animation: vd.isPlaying
                  ? `canva-float-up ${(dur + (idx % 3) * 0.6).toFixed(1)}s ease-in-out infinite alternate`
                  : undefined,
              }}
            />
          );
        })}
        <circle
          cx="50"
          cy="50"
          r="28"
          fill="none"
          stroke={vd.primaryColor}
          strokeWidth="1.2"
          strokeDasharray="4 3"
          opacity="0.55"
          style={{
            transformOrigin: "50% 50%",
            animation: vd.isPlaying ? `canva-spin-slow ${(dur * 3).toFixed(1)}s linear infinite` : undefined,
          }}
        />
      </svg>

      <div className="relative z-10 px-2.5 py-1 rounded-full bg-black/55 border border-amber-400/50 text-[10px] font-cinzel font-bold text-amber-200 flex items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: vd.isPlaying ? "#34D399" : "#F59E0B",
            boxShadow: vd.isPlaying ? "0 0 8px #34D399" : undefined,
          }}
        />
        <span className="truncate max-w-[150px]">{vd.videoName}</span>
      </div>
    </div>
  );
}

// Render Canva Audio Soundtrack Badge Element
export function renderAudioVisual(au: AudioElement) {
  return (
    <div
      className="w-full h-full rounded-2xl px-3 py-2 flex items-center justify-between gap-2.5 shadow-xl select-none pointer-events-none"
      style={{
        backgroundColor: au.backgroundColor || "rgba(20, 8, 12, 0.94)",
        border: `1.5px solid ${au.accentColor || "#D4AF37"}`,
      }}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 border"
        style={{
          backgroundColor: `${au.accentColor || "#D4AF37"}25`,
          borderColor: au.accentColor || "#D4AF37",
          color: au.accentColor || "#D4AF37",
        }}
      >
        ♫
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-cinzel font-bold text-amber-200 truncate">
          {au.trackName || "Royal Shehnai Raga"}
        </div>
        <div className="text-[9px] text-neutral-400 font-mono">
          {au.category?.toUpperCase()} • {au.tempo || 110} BPM
        </div>
      </div>
      <div className="flex items-end gap-0.5 h-6 px-1">
        {[45, 85, 60, 95, 50, 75].map((h, i) => (
          <div
            key={i}
            className="w-1 rounded-full"
            style={{
              height: `${h}%`,
              backgroundColor: au.accentColor || "#D4AF37",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export const Canvas: React.FC<CanvasProps> = ({
  aspectRatio,
  fitRequest = 0,
  backgroundType,
  backgroundValue,
  elements,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onAddElement,
  onCommitCurrentState,
  onDeleteElement,
  onDuplicateElement,
  onBringForward,
  onSendBackward,
  onBringToFront,
  onSendToBack,
  zoom,
  onZoomChange,
  onOpenPhotoAdjust,
  drawBrush,
  copiedStyle,
  onApplyCopiedStyle,
  onCopyStyle,
  showRulers = false,
  showSafeZones = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const lastObservedCanvasSizeRef = useRef<{ width: number; height: number } | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [framePhotoAdjustId, setFramePhotoAdjustId] = useState<string | null>(null);
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

  // Freehand Drawing State
  const [isDrawingStroke, setIsDrawingStroke] = useState(false);
  const [currentDrawPoints, setCurrentDrawPoints] = useState<{ x: number; y: number }[]>([]);

  // Custom Ruler Guides State (Click top/left ruler to add custom cyan guide lines!)
  const [customGuides, setCustomGuides] = useState<CustomGuide[]>([]);

  // Right-click Canva Context Menu
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    elementId: string;
  } | null>(null);

  // Smart alignment guide lines (Canva magenta snap lines)
  const [snapGuides, setSnapGuides] = useState<{
    vertical: number[];
    horizontal: number[];
  }>({ vertical: [], horizontal: [] });

  const [editingTextId, setEditingTextId] = useState<string | null>(null);
  const [editingShapeTextId, setEditingShapeTextId] = useState<string | null>(null);
  const [dropTargetFrameId, setDropTargetFrameId] = useState<string | null>(null);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateAutoFit();
    }, 60);

    const handleWindowResize = () => {
      calculateAutoFit();
    };

    window.addEventListener('resize', handleWindowResize);
    const resizeObserver = containerRef.current
      ? new ResizeObserver((entries) => {
          const size = entries[0]?.contentRect;
          if (!size) return;

          const previousSize = lastObservedCanvasSizeRef.current;
          lastObservedCanvasSizeRef.current = { width: size.width, height: size.height };

          // Keep the artboard in place when the contextual text toolbar appears or disappears.
          // Larger workspace changes (sidebar, timeline, or viewport) still trigger a fresh fit.
          if (
            previousSize &&
            (Math.abs(size.width - previousSize.width) > 8 ||
              Math.abs(size.height - previousSize.height) > 96)
          ) {
            calculateAutoFit();
          }
        })
      : null;
    if (containerRef.current && resizeObserver) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver?.disconnect();
    };
  }, [aspectRatio, fitRequest, calculateAutoFit]);

  // Convert client mouse coordinates to artboard coordinates
  const getCanvasPoint = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: Math.round((clientX - rect.left) / zoom),
      y: Math.round((clientY - rect.top) / zoom),
    };
  };

  // Start freehand drawing stroke on artboard
  const handleDrawPointerDown = (e: React.MouseEvent) => {
    if (!drawBrush?.isEnabled) return;
    e.stopPropagation();
    const pt = getCanvasPoint(e.clientX, e.clientY);

    if (drawBrush.brushType === 'eraser') {
      const drawingElems = elements.filter((el) => el.type === 'drawing');
      if (drawingElems.length > 0 && onDeleteElement) {
        onSelectElement(drawingElems[drawingElems.length - 1].id);
        setTimeout(() => onDeleteElement(), 10);
      }
      return;
    }

    setIsDrawingStroke(true);
    setCurrentDrawPoints([pt]);
  };

  const handleDrawPointerMove = (e: React.MouseEvent) => {
    if (!isDrawingStroke || !drawBrush?.isEnabled) return;
    const pt = getCanvasPoint(e.clientX, e.clientY);
    setCurrentDrawPoints((prev) => [...prev, pt]);
  };

  const handleDrawPointerUp = () => {
    if (!isDrawingStroke || !drawBrush?.isEnabled) return;
    setIsDrawingStroke(false);

    if (currentDrawPoints.length > 1 && onAddElement) {
      const d = currentDrawPoints
        .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
        .join(' ');

      const newDrawing: DrawingElement = {
        id: `drawing-${Date.now()}`,
        type: 'drawing',
        x: 0,
        y: 0,
        width: dimensions.width,
        height: dimensions.height,
        rotation: 0,
        opacity: drawBrush.opacity,
        zIndex: (elements.length || 5) + 10,
        viewBoxWidth: dimensions.width,
        viewBoxHeight: dimensions.height,
        paths: [
          {
            d,
            color: drawBrush.color,
            strokeWidth: drawBrush.strokeWidth,
            brushType:
              drawBrush.brushType === 'eraser' ? 'pen' : drawBrush.brushType,
            opacity: drawBrush.opacity,
          },
        ],
      };

      onAddElement(newDrawing);
    }
    setCurrentDrawPoints([]);
  };

  // Handle click on canvas background to deselect
  const handleCanvasClick = (e: React.MouseEvent) => {
    setContextMenu(null);
    if (e.target === canvasRef.current || e.target === containerRef.current) {
      onSelectElement(null);
      setEditingTextId(null);
      setEditingShapeTextId(null);
    }
  };

  const getCanvasElementAtPoint = (clientX: number, clientY: number) => {
    const hitElement = document
      .elementsFromPoint(clientX, clientY)
      .map((element) => element.closest<HTMLElement>('[data-canvas-item-id]'))
      .find((element) => element?.dataset.canvasItemId);
    const id = hitElement?.dataset.canvasItemId;
    return id ? elements.find((element) => element.id === id) || null : null;
  };

  const getCanvasFrameAtPoint = (clientX: number, clientY: number) => {
    const frameIds = document
      .elementsFromPoint(clientX, clientY)
      .map((element) => element.closest<HTMLElement>('[data-canvas-item-id]')?.dataset.canvasItemId)
      .filter((id): id is string => !!id);
    return frameIds.map((id) => elements.find((element) => element.id === id))
      .find((element): element is FrameElement => element?.type === 'frame') || null;
  };

  const getDroppedImage = (event: React.DragEvent) =>
    event.dataTransfer.getData('application/x-wedding-media') || event.dataTransfer.getData('text/plain');

  const handleMediaDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    const transferTypes = Array.from(event.dataTransfer.types);
    const hasWeddingMedia = transferTypes.includes('application/x-wedding-media') || transferTypes.includes('text/plain');
    if (!hasWeddingMedia) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
    const target = getCanvasFrameAtPoint(event.clientX, event.clientY);
    setDropTargetFrameId(target?.id || null);
  };

  const handleMediaDrop = (event: React.DragEvent<HTMLDivElement>) => {
    const src = getDroppedImage(event);
    if (!src || !onAddElement) return;
    event.preventDefault();
    const target = getCanvasFrameAtPoint(event.clientX, event.clientY);
    if (target) {
      onUpdateElement(target.id, {
        imageSrc: src,
        imageScale: 1,
        imageOffsetX: 0,
        imageOffsetY: 0,
      }, true);
      onSelectElement(target.id);
    } else {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const scaleX = rect.width / dimensions.width;
        const scaleY = rect.height / dimensions.height;
        const dropX = (event.clientX - rect.left) / scaleX;
        const dropY = (event.clientY - rect.top) / scaleY;
        const sourceImage = new Image();
        sourceImage.onload = () => {
          const fit = Math.min(240 / sourceImage.naturalWidth, 280 / sourceImage.naturalHeight, 1);
          const width = Math.max(1, sourceImage.naturalWidth * fit);
          const height = Math.max(1, sourceImage.naturalHeight * fit);
          const image: ImageElement = {
            id: `img-upload-${Date.now()}`,
            type: 'image',
            src,
            mask: 'none',
            borderWidth: 0,
            borderColor: '#D4AF37',
            borderRadius: 0,
            objectFit: 'cover',
            x: Math.max(0, Math.min(dimensions.width - width, dropX - width / 2)),
            y: Math.max(0, Math.min(dimensions.height - height, dropY - height / 2)),
            width,
            height,
            rotation: 0,
            opacity: 1,
            zIndex: Math.max(0, ...elements.map((element) => element.zIndex || 0)) + 1,
          };
          onAddElement(image);
          onSelectElement(image.id);
        };
        sourceImage.src = src;
      }
    }
    setDropTargetFrameId(null);
  };

  // Start element dragging (Mouse)
  const handleMouseDown = (e: React.MouseEvent, elem: CanvasItem) => {
    if (drawBrush?.isEnabled) return;
    e.stopPropagation();
    setContextMenu(null);

    // If Copy Style Paint Roller is active, paste style onto clicked element!
    if (copiedStyle && onApplyCopiedStyle) {
      onApplyCopiedStyle(elem.id);
      onSelectElement(elem.id);
      return;
    }

    onSelectElement(elem.id);

    if (editingTextId === elem.id || editingShapeTextId === elem.id || elem.locked) return;

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
    if (drawBrush?.isEnabled) return;
    e.stopPropagation();
    onSelectElement(elem.id);

    if (editingTextId === elem.id || editingShapeTextId === elem.id || elem.locked) return;

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

  const handleFramePhotoMouseDown = (e: React.MouseEvent, frame: FrameElement) => {
    if (drawBrush?.isEnabled || frame.locked) return;
    e.preventDefault();
    e.stopPropagation();
    onSelectElement(frame.id);
    const image = e.currentTarget.querySelector('img');
    if (!image) return;
    const start = {
      id: frame.id,
      x: e.clientX,
      y: e.clientY,
      offsetX: frame.imageOffsetX || 0,
      offsetY: frame.imageOffsetY || 0,
    };
    let moved = false;
    let latestOffsetX = start.offsetX;
    let latestOffsetY = start.offsetY;
    let pendingFrame = 0;
    image.style.cursor = 'grabbing';
    const renderPendingPan = () => {
      pendingFrame = 0;
      applyFramePhotoPanStyle(image, frame, latestOffsetX, latestOffsetY);
    };
    const handleMove = (event: MouseEvent) => {
      const deltaX = ((event.clientX - start.x) / zoom / Math.max(frame.width, 1)) * 100;
      const deltaY = ((event.clientY - start.y) / zoom / Math.max(frame.height, 1)) * 100;
      if (Math.abs(deltaX) + Math.abs(deltaY) < 0.15) return;
      moved = true;
      const panLimit = Math.max(0, ((frame.imageScale || 1) - 1) * 50);
      latestOffsetX = Math.max(-panLimit, Math.min(panLimit, start.offsetX + deltaX));
      latestOffsetY = Math.max(-panLimit, Math.min(panLimit, start.offsetY + deltaY));
      if (!pendingFrame) pendingFrame = window.requestAnimationFrame(renderPendingPan);
    };
    const handleEnd = () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      if (pendingFrame) window.cancelAnimationFrame(pendingFrame);
      if (moved) {
        renderPendingPan();
        onUpdateElement(frame.id, { imageOffsetX: latestOffsetX, imageOffsetY: latestOffsetY }, true);
      }
      image.style.cursor = 'grab';
    };
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
  };

  const handleFramePhotoTouchStart = (e: React.TouchEvent, frame: FrameElement) => {
    if (drawBrush?.isEnabled || frame.locked || e.touches.length !== 1) return;
    e.stopPropagation();
    const touch = e.touches[0];
    const image = e.currentTarget.querySelector('img');
    if (!image) return;
    const start = {
      id: frame.id,
      x: touch.clientX,
      y: touch.clientY,
      offsetX: frame.imageOffsetX || 0,
      offsetY: frame.imageOffsetY || 0,
    };
    onSelectElement(frame.id);
    let moved = false;
    let latestOffsetX = start.offsetX;
    let latestOffsetY = start.offsetY;
    let pendingFrame = 0;
    image.style.cursor = 'grabbing';
    const renderPendingPan = () => {
      pendingFrame = 0;
      applyFramePhotoPanStyle(image, frame, latestOffsetX, latestOffsetY);
    };
    const handleMove = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      event.preventDefault();
      const activeTouch = event.touches[0];
      const deltaX = ((activeTouch.clientX - start.x) / zoom / Math.max(frame.width, 1)) * 100;
      const deltaY = ((activeTouch.clientY - start.y) / zoom / Math.max(frame.height, 1)) * 100;
      if (Math.abs(deltaX) + Math.abs(deltaY) < 0.15) return;
      moved = true;
      const panLimit = Math.max(0, ((frame.imageScale || 1) - 1) * 50);
      latestOffsetX = Math.max(-panLimit, Math.min(panLimit, start.offsetX + deltaX));
      latestOffsetY = Math.max(-panLimit, Math.min(panLimit, start.offsetY + deltaY));
      if (!pendingFrame) pendingFrame = window.requestAnimationFrame(renderPendingPan);
    };
    const handleEnd = () => {
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      window.removeEventListener('touchcancel', handleEnd);
      if (pendingFrame) window.cancelAnimationFrame(pendingFrame);
      if (moved) {
        renderPendingPan();
        onUpdateElement(frame.id, { imageOffsetX: latestOffsetX, imageOffsetY: latestOffsetY }, true);
      }
      image.style.cursor = 'grab';
    };
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
    window.addEventListener('touchcancel', handleEnd);
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

        if (currentElem.ratioLocked) {
          const ratio = elemInitialPos.height / Math.max(1, elemInitialPos.width);
          newHeight = Math.round(newWidth * ratio);
        }

        const updates: Partial<CanvasItem> = {
          width: Math.round(newWidth),
          height: Math.round(newHeight),
          x: Math.round(newX),
          y: Math.round(newY),
        };

        if (
          currentElem.type === 'text' &&
          elemInitialPos.fontSize &&
          (resizeHandle === 'se' ||
            resizeHandle === 'nw' ||
            resizeHandle === 'ne' ||
            resizeHandle === 'sw')
        ) {
          const scaleRatio = newWidth / Math.max(1, elemInitialPos.width);
          (updates as Partial<TextElement>).fontSize = Math.max(
            8,
            Math.min(160, Math.round(elemInitialPos.fontSize * scaleRatio))
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

      if (!selectedElementId || editingTextId || editingShapeTextId || isInput) return;

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
        setEditingShapeTextId(null);
        setContextMenu(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedElementId,
    editingTextId,
    editingShapeTextId,
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
    const isEditing = editingTextId === elem.id || editingShapeTextId === elem.id;
    const isLocked = !!elem.locked;

    const flipTransform = `${elem.flipX ? ' scaleX(-1)' : ''}${elem.flipY ? ' scaleY(-1)' : ''}`;
    const animStyle = getElementAnimationStyle(elem);
    const animReplayKey = `${elem.id}-${elem.animation || 'none'}-${elem.animationSpeed || 1}-${elem.animationTiming || 'both'}`;

    const dropShadowFilter = elem.dropShadow?.enabled
      ? `drop-shadow(${elem.dropShadow.offsetX}px ${elem.dropShadow.offsetY}px ${elem.dropShadow.blur}px ${elem.dropShadow.color})`
      : undefined;

    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: `${elem.x}px`,
      top: `${elem.y}px`,
      width: `${elem.width}px`,
      height: `${elem.height}px`,
      transform: `rotate(${elem.rotation || 0}deg)`,
      opacity: elem.opacity,
      zIndex: elem.zIndex,
      mixBlendMode: elem.blendMode || 'normal',
      filter: dropShadowFilter,
      outline: dropTargetFrameId === elem.id ? '3px solid #8B5CF6' : undefined,
      outlineOffset: dropTargetFrameId === elem.id ? '3px' : undefined,
      boxShadow: dropTargetFrameId === elem.id ? '0 0 0 6px rgba(139,92,246,.2)' : undefined,
      cursor: drawBrush?.isEnabled
        ? 'crosshair'
        : copiedStyle
        ? 'copy'
        : isEditing
        ? 'text'
        : isLocked
        ? 'default'
        : 'move',
      userSelect: isEditing ? 'auto' : 'none',
      touchAction: 'none',
    };

    const vAlign =
      elem.type === 'text'
        ? (elem as TextElement).verticalAlign === 'top'
          ? 'justify-start'
          : (elem as TextElement).verticalAlign === 'bottom'
          ? 'justify-end'
          : 'justify-center'
        : 'justify-center';

    return (
      <div
        key={elem.id}
        data-canvas-item-id={elem.id}
        style={baseStyle}
        onMouseDown={(e) => handleMouseDown(e, elem)}
        onClick={(e) => {
          e.stopPropagation();
          if (!drawBrush?.isEnabled) onSelectElement(elem.id);
        }}
        onTouchStart={(e) => handleTouchStart(e, elem)}
        onContextMenu={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onSelectElement(elem.id);
          setContextMenu({
            x: e.clientX,
            y: e.clientY,
            elementId: elem.id,
          });
        }}
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (isLocked || drawBrush?.isEnabled) return;
          if (elem.type === 'text') {
            setEditingTextId(elem.id);
          } else if (elem.type === 'shape') {
            setEditingShapeTextId(elem.id);
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
        {/* Flipped + Animated inner content wrapper */}
        <div
          key={animReplayKey}
          className="w-full h-full"
          style={{
            transform: flipTransform || undefined,
            ...animStyle,
          }}
        >
          {/* Render TEXT */}
          {elem.type === 'text' && (
            <div className={`w-full h-full flex flex-col ${vAlign}`}>
              {editingTextId === elem.id ? (
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
                    textAlign:
                      (elem as TextElement).textAlign === 'justify'
                        ? 'left'
                        : (elem as TextElement).textAlign,
                    letterSpacing: `${(elem as TextElement).letterSpacing}px`,
                    lineHeight: (elem as TextElement).lineHeight,
                    fontWeight: (elem as TextElement).fontWeight,
                    fontStyle: (elem as TextElement).fontStyle,
                  }}
                />
              ) : (
                renderTextVisual(elem as TextElement)
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

          {/* Render SHAPE (with double-click inline innerText editing!) */}
          {elem.type === 'shape' && (
            <div className="w-full h-full relative">
              {renderShapeVisual(elem as ShapeElement)}
              {editingShapeTextId === elem.id && (
                <input
                  autoFocus
                  type="text"
                  value={(elem as ShapeElement).innerText || ''}
                  onChange={(e) => onUpdateElement(elem.id, { innerText: e.target.value })}
                  onBlur={() => {
                    setEditingShapeTextId(null);
                    if (onCommitCurrentState) onCommitCurrentState();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setEditingShapeTextId(null);
                      if (onCommitCurrentState) onCommitCurrentState();
                    }
                  }}
                  placeholder="Type inside shape..."
                  className="absolute inset-1 bg-neutral-950/90 text-amber-200 text-center text-xs font-cinzel border border-amber-400 rounded outline-none z-50"
                />
              )}
            </div>
          )}

          {/* Render TABLE */}
          {elem.type === 'table' && renderTableVisual(elem as TableElement)}

          {/* Render CHART */}
          {elem.type === 'chart' && renderChartVisual(elem as ChartElement)}

          {/* Render COLLAGE GRID */}
          {elem.type === 'grid' && renderGridVisual(elem as GridElement)}

          {/* Render LIVE COUNTDOWN */}
          {elem.type === 'countdown' && renderCountdownVisual(elem as CountdownElement)}

          {/* Render BARCODE PASS */}
          {elem.type === 'barcode' && renderBarcodeVisual(elem as BarcodeElement)}

          {/* Render CLIPPING FRAME */}
          {elem.type === 'frame' && renderFrameVisual(
            elem as FrameElement,
            framePhotoAdjustId === elem.id ? (event) => handleFramePhotoMouseDown(event, elem as FrameElement) : undefined,
            framePhotoAdjustId === elem.id ? (event) => handleFramePhotoTouchStart(event, elem as FrameElement) : undefined,
          )}

          {/* Render INTERACTIVE FORM */}
          {elem.type === 'form' && renderFormVisual(elem as FormElement, onUpdateElement)}

          {/* Render LIVE SPREADSHEET */}
          {elem.type === 'sheet' && renderSheetVisual(elem as SheetElement)}

          {/* Render DEVICE / STATIONERY MOCKUP */}
          {elem.type === 'mockup' && renderMockupVisual(elem as MockupElement)}

          {/* Render INTERACTIVE 3D MODEL */}
          {elem.type === 'model3d' && renderModel3DVisual(elem as Model3DElement)}

          {/* Render MOTION VIDEO LOOP */}
          {elem.type === 'video' && renderVideoVisual(elem as VideoElement)}

          {/* Render AUDIO SOUNDTRACK BADGE */}
          {elem.type === 'audio' && renderAudioVisual(elem as AudioElement)}

          {/* Render FREEHAND DRAWING */}
          {elem.type === 'drawing' && (
            <svg
              viewBox={`0 0 ${(elem as DrawingElement).viewBoxWidth || dimensions.width} ${
                (elem as DrawingElement).viewBoxHeight || dimensions.height
              }`}
              className="w-full h-full pointer-events-none overflow-visible"
            >
              {(elem as DrawingElement).paths.map((p, idx) => (
                <path
                  key={idx}
                  d={p.d}
                  fill="none"
                  stroke={p.color}
                  strokeWidth={p.strokeWidth}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={p.opacity}
                  style={
                    p.brushType === 'glow-gold'
                      ? { filter: `drop-shadow(0 0 8px ${p.color})` }
                      : undefined
                  }
                />
              ))}
            </svg>
          )}

          {/* Render IMAGE (Supports Polaroid & Phone Mockup frames!) */}
          {elem.type === 'image' && (
            <div
              className={`w-full h-full overflow-hidden relative ${
                (elem as ImageElement).mask === 'polaroid'
                  ? 'bg-[#FFFDF7] p-2 pb-7 rounded-lg shadow-xl'
                  : (elem as ImageElement).mask === 'phone-mockup'
                  ? 'bg-neutral-950 p-2 rounded-[26px] border-4 border-neutral-700 shadow-2xl'
                  : ''
              }`}
              style={{
                ...getImageMaskStyle(elem as ImageElement),
                borderWidth:
                  (elem as ImageElement).mask === 'phone-mockup'
                    ? '4px'
                    : `${(elem as ImageElement).borderWidth || 0}px`,
                borderColor: (elem as ImageElement).borderColor || '#D4AF37',
                borderStyle:
                  (elem as ImageElement).borderStyle ||
                  ((elem as ImageElement).borderWidth ? 'solid' : 'none'),
                filter: getImageCssFilter(elem as ImageElement),
              }}
            >
              {(elem as ImageElement).mask === 'phone-mockup' && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-black rounded-full z-20" />
              )}
              <img
                src={(elem as ImageElement).src}
                alt="Invitation asset"
                referrerPolicy="no-referrer"
                className={`w-full h-full select-none pointer-events-none ${
                  (elem as ImageElement).mask === 'phone-mockup' ? 'rounded-[18px]' : ''
                }`}
                style={{
                  objectFit: (elem as ImageElement).objectFit || 'cover',
                  transform: `scale(${(elem as ImageElement).scale || 1}) translate(${
                    (elem as ImageElement).offsetX || 0
                  }%, ${(elem as ImageElement).offsetY || 0}%) rotate(${
                    (elem as ImageElement).rotationInside || 0
                  }deg)`,
                }}
              />
              {(elem as ImageElement).mask === 'polaroid' && (
                <div className="absolute bottom-1 inset-x-0 text-center text-[10px] font-alex-brush text-neutral-800 font-bold">
                  {(elem as ImageElement).caption || 'Forever Together ❤️'}
                </div>
              )}
              {/* Optional Vignette Overlay */}
              {((elem as ImageElement).vignette || 0) > 0 && (
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle, transparent 40%, rgba(0,0,0,${
                      ((elem as ImageElement).vignette || 0) / 100
                    }) 100%)`,
                  }}
                />
              )}
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

        {/* Link badge indicator if element has a URL */}
        {elem.linkUrl && (
          <div
            className="absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-amber-500 text-neutral-950 flex items-center justify-center shadow z-30 pointer-events-none"
            title={`Link: ${elem.linkUrl}`}
          >
            <Link2 className="w-3 h-3" />
          </div>
        )}

        {/* Floating Quick Action Pill Bar (Canva Style) */}
        {isSelected &&
          !isEditing &&
          !isDragging &&
          !isResizing &&
          !isRotating &&
          !drawBrush?.isEnabled && (
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
              {elem.type === 'shape' && !isLocked && (
                <button
                  onClick={() => setEditingShapeTextId(elem.id)}
                  className="p-1 hover:bg-neutral-800 hover:text-amber-300 rounded-full transition"
                  title="Edit Shape Label (Double Click)"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              )}
              {elem.type === 'image' && !isLocked && onOpenPhotoAdjust && (
                <button
                  onClick={() => onOpenPhotoAdjust(elem as ImageElement)}
                  className="p-1 hover:bg-neutral-800 hover:text-amber-300 rounded-full transition"
                  title="Edit Photo Studio"
                >
                  <Crop className="w-3.5 h-3.5" />
                </button>
              )}
              {elem.type === 'frame' && !isLocked && (elem as FrameElement).imageSrc && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={(event) => {
                      event.stopPropagation();
                      const nextMode = framePhotoAdjustId !== elem.id;
                      if (nextMode) {
                        onUpdateElement(elem.id, {
                          naturalImageFit: true,
                          imageScale: Math.max(1.2, (elem as FrameElement).imageScale || 1),
                        }, true);
                      }
                      setFramePhotoAdjustId(nextMode ? elem.id : null);
                    }}
                    className={`flex items-center gap-1 px-1.5 py-1 rounded-full transition ${
                      framePhotoAdjustId === elem.id
                        ? 'bg-amber-400 text-neutral-950'
                        : 'hover:bg-neutral-800 hover:text-amber-300'
                    }`}
                    title={framePhotoAdjustId === elem.id ? 'Done adjusting photo; drag photo in any direction' : 'Adjust photo inside frame'}
                    aria-label={framePhotoAdjustId === elem.id ? 'Done adjusting photo' : 'Adjust photo inside frame'}
                  >
                    <Crop className="w-3.5 h-3.5" />
                    {framePhotoAdjustId === elem.id && <span className="text-[10px] font-semibold">Photo</span>}
                  </button>
                  {framePhotoAdjustId === elem.id && (
                    <>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          const frame = elem as FrameElement;
                          const nextScale = Math.max(1.2, (frame.imageScale || 1.2) - 0.1);
                          const panLimit = (nextScale - 1) * 50;
                          onUpdateElement(elem.id, {
                            imageScale: nextScale,
                            imageOffsetX: Math.max(-panLimit, Math.min(panLimit, frame.imageOffsetX || 0)),
                            imageOffsetY: Math.max(-panLimit, Math.min(panLimit, frame.imageOffsetY || 0)),
                          }, true);
                        }}
                        className="grid h-5 w-5 place-items-center rounded-full hover:bg-neutral-800"
                        title="Zoom photo out"
                        aria-label="Zoom photo out"
                      >
                        <ZoomOut className="h-3 w-3" />
                      </button>
                      <span className="min-w-8 text-center text-[9px] tabular-nums">
                        {Math.round(((elem as FrameElement).imageScale || 1.2) * 100)}%
                      </span>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          const frame = elem as FrameElement;
                          onUpdateElement(elem.id, { imageScale: Math.min(3, (frame.imageScale || 1.2) + 0.1) }, true);
                        }}
                        className="grid h-5 w-5 place-items-center rounded-full hover:bg-neutral-800"
                        title="Zoom photo in"
                        aria-label="Zoom photo in"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </button>
                    </>
                  )}
                </div>
              )}
              {!isLocked && (
                <button
                  onClick={() =>
                    onUpdateElement(
                      elem.id,
                      { x: Math.round((dimensions.width - elem.width) / 2) },
                      true
                    )
                  }
                  className="p-1 hover:bg-neutral-800 hover:text-amber-300 rounded-full transition"
                  title="Center Horizontally on Card"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
              )}
              {onCopyStyle && (
                <button
                  onClick={onCopyStyle}
                  className="p-1 hover:bg-neutral-800 hover:text-amber-300 rounded-full transition"
                  title="Copy Style (Paint Roller)"
                >
                  <PaintRoller className="w-3.5 h-3.5" />
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
        {isSelected && !isEditing && !isLocked && !drawBrush?.isEnabled && (
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
      {/* Canva Interactive Pixel Rulers (Click top/left ruler to drop a cyan guide line!) */}
      {showRulers && (
        <>
          <div
            onClick={(e) => {
              e.stopPropagation();
              const pos = Math.round(dimensions.width / 2);
              setCustomGuides((prev) => [
                ...prev,
                { id: `g-${Date.now()}`, orientation: 'vertical', position: pos },
              ]);
            }}
            title="Click ruler to add a vertical cyan alignment guide"
            className="absolute top-0 left-0 right-0 h-5 bg-neutral-900/95 hover:bg-neutral-800 border-b border-neutral-800 flex items-end px-8 text-[9px] font-mono text-neutral-400 cursor-pointer z-20 overflow-hidden"
          >
            {Array.from({ length: 20 }).map((_, idx) => (
              <div key={idx} className="w-20 border-l border-neutral-700 pl-1 shrink-0">
                {idx * 100}px
              </div>
            ))}
          </div>
          <div
            onClick={(e) => {
              e.stopPropagation();
              const pos = Math.round(dimensions.height / 2);
              setCustomGuides((prev) => [
                ...prev,
                { id: `g-${Date.now()}`, orientation: 'horizontal', position: pos },
              ]);
            }}
            title="Click ruler to add a horizontal cyan alignment guide"
            className="absolute top-5 bottom-0 left-0 w-5 bg-neutral-900/95 hover:bg-neutral-800 border-r border-neutral-800 flex flex-col items-end py-8 text-[9px] font-mono text-neutral-400 cursor-pointer z-20 overflow-hidden"
          >
            {Array.from({ length: 16 }).map((_, idx) => (
              <div key={idx} className="h-20 border-t border-neutral-700 pt-0.5 pr-0.5 shrink-0">
                {idx * 100}
              </div>
            ))}
          </div>
        </>
      )}

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
          onClickCapture={(e) => {
            if (drawBrush?.isEnabled) return;
            const element = getCanvasElementAtPoint(e.clientX, e.clientY);
            if (element) onSelectElement(element.id);
          }}
          onDoubleClickCapture={(e) => {
            if (drawBrush?.isEnabled) return;
            const element = getCanvasElementAtPoint(e.clientX, e.clientY);
            if (element?.type === 'text' && !element.locked) {
              e.preventDefault();
              e.stopPropagation();
              onSelectElement(element.id);
              setEditingShapeTextId(null);
              setEditingTextId(element.id);
            }
          }}
          onMouseDown={handleDrawPointerDown}
          onMouseMove={handleDrawPointerMove}
          onMouseUp={handleDrawPointerUp}
          onDragOver={handleMediaDragOver}
          onDragLeave={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTargetFrameId(null);
          }}
          onDrop={handleMediaDrop}
          className={`relative rounded-2xl shadow-2xl shadow-black/90 overflow-hidden border border-amber-500/40 ring-1 ring-amber-400/25 ${
            drawBrush?.isEnabled ? 'cursor-crosshair' : ''
          }`}
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

          {/* User Custom Ruler Guides (Canva Cyan Lines - Click to remove) */}
          {showRulers &&
            customGuides.map((g) =>
              g.orientation === 'vertical' ? (
                <div
                  key={g.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomGuides((prev) => prev.filter((item) => item.id !== g.id));
                  }}
                  title="Click to remove guide"
                  className="absolute top-0 bottom-0 w-0.5 bg-cyan-400/80 hover:bg-rose-400 cursor-pointer z-40"
                  style={{ left: `${g.position}px` }}
                />
              ) : (
                <div
                  key={g.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCustomGuides((prev) => prev.filter((item) => item.id !== g.id));
                  }}
                  title="Click to remove guide"
                  className="absolute left-0 right-0 h-0.5 bg-cyan-400/80 hover:bg-rose-400 cursor-pointer z-40"
                  style={{ top: `${g.position}px` }}
                />
              )
            )}

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

          {/* Live Freehand Drawing Stroke Preview */}
          {isDrawingStroke && currentDrawPoints.length > 1 && drawBrush && (
            <svg
              viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
              className="absolute inset-0 w-full h-full pointer-events-none z-50"
            >
              <path
                d={currentDrawPoints
                  .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                  .join(' ')}
                fill="none"
                stroke={drawBrush.color}
                strokeWidth={drawBrush.strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={drawBrush.opacity}
              />
            </svg>
          )}

          {/* Safe-print guide indicator (subtle dashed border) */}
          {showSafeZones && (
            <div className="absolute inset-5 border border-dashed border-amber-400/25 pointer-events-none rounded" />
          )}
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

      {/* Canva Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
          className="fixed z-50 w-52 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-1.5 text-xs text-neutral-200 space-y-0.5 animate-in fade-in zoom-in-95 duration-100"
        >
          {onDuplicateElement && (
            <button
              onClick={() => {
                onDuplicateElement();
                setContextMenu(null);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-amber-400" /> Duplicate
              </span>
              <span className="text-[10px] text-neutral-500">Ctrl+D</span>
            </button>
          )}
          {onCopyStyle && (
            <button
              onClick={() => {
                onCopyStyle();
                setContextMenu(null);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <PaintRoller className="w-3.5 h-3.5 text-amber-400" /> Copy Style
              </span>
            </button>
          )}
          <button
            onClick={() => {
              const target = elements.find((el) => el.id === contextMenu.elementId);
              if (target) {
                onUpdateElement(
                  target.id,
                  {
                    x: Math.round((dimensions.width - target.width) / 2),
                    y: Math.round((dimensions.height - target.height) / 2),
                  },
                  true
                );
              }
              setContextMenu(null);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 flex items-center gap-2"
          >
            <AlignCenter className="w-3.5 h-3.5 text-amber-400" /> Align to Page Center
          </button>
          {onBringForward && (
            <button
              onClick={() => {
                onBringForward();
                setContextMenu(null);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 flex items-center gap-2"
            >
              <ArrowUp className="w-3.5 h-3.5 text-amber-400" /> Bring Forward
            </button>
          )}
          {onSendBackward && (
            <button
              onClick={() => {
                onSendBackward();
                setContextMenu(null);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 flex items-center gap-2"
            >
              <ArrowDown className="w-3.5 h-3.5 text-amber-400" /> Send Backward
            </button>
          )}
          {onBringToFront && (
            <button
              onClick={() => {
                onBringToFront();
                setContextMenu(null);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5 text-amber-400" /> Bring to Front
            </button>
          )}
          {onSendToBack && (
            <button
              onClick={() => {
                onSendToBack();
                setContextMenu(null);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 flex items-center gap-2"
            >
              <Layers className="w-3.5 h-3.5 text-neutral-400" /> Send to Back
            </button>
          )}
          <div className="border-t border-neutral-800 my-1" />
          {onDeleteElement && (
            <button
              onClick={() => {
                onDeleteElement();
                setContextMenu(null);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg hover:bg-rose-950/70 text-rose-400 flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </span>
              <span className="text-[10px] text-rose-500">Del</span>
            </button>
          )}
        </div>
      )}

      {/* Floating Quick Fit / Zoom Controls Pill */}
      {onZoomChange && (
        <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 z-30 flex items-center gap-1.5 bg-neutral-900/95 hover:bg-neutral-900 border border-neutral-700/80 text-neutral-200 px-3 py-1.5 rounded-full shadow-2xl text-xs backdrop-blur-md transition select-none">
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
