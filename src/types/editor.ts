export type AspectRatioType = 'portrait-story' | 'square' | 'portrait-classic' | 'landscape';

export interface CanvasDimensions {
  width: number;
  height: number;
  name: string;
  ratioLabel: string;
  recommendedFor: string;
}

export const CANVAS_SIZES: Record<AspectRatioType, CanvasDimensions> = {
  'portrait-story': {
    width: 450,
    height: 800,
    name: 'Story / WhatsApp Status',
    ratioLabel: '9:16',
    recommendedFor: 'WhatsApp Status, Instagram Story, Fullscreen Mobile',
  },
  'portrait-classic': {
    width: 500,
    height: 700,
    name: 'Classic Card',
    ratioLabel: '5:7',
    recommendedFor: 'Standard Printed Invitations, WhatsApp Chat share',
  },
  'square': {
    width: 600,
    height: 600,
    name: 'Square Card',
    ratioLabel: '1:1',
    recommendedFor: 'Instagram Feed, WhatsApp Square, Quick Invites',
  },
  'landscape': {
    width: 700,
    height: 500,
    name: 'Landscape Envelope Card',
    ratioLabel: '7:5',
    recommendedFor: 'Horizontal Folded Cards, Email Invites',
  },
};

export type ElementType = 'text' | 'image' | 'sticker' | 'qr' | 'shape' | 'drawing';

export type ElementAnimationType =
  | 'none'
  | 'rise'
  | 'pan'
  | 'fade'
  | 'pop'
  | 'breathe'
  | 'drift'
  | 'tumble'
  | 'neon-pulse'
  | 'typewriter';

export type BlendModeType =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'lighten'
  | 'color-dodge';

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked?: boolean;
  hidden?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  animation?: ElementAnimationType;
  animationSpeed?: number; // 0.5x to 2x
  blendMode?: BlendModeType;
  linkUrl?: string;
}

export type TextEffectType =
  | 'none'
  | 'shadow'
  | 'lift'
  | 'hollow'
  | 'splice'
  | 'outline'
  | 'echo'
  | 'glitch'
  | 'neon'
  | 'background';

export type TextListType = 'none' | 'bullet' | 'number';

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | '500' | '600' | '700' | '900' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  letterSpacing: number;
  lineHeight: number;
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
  listType?: TextListType;
  effectType?: TextEffectType;
  curveRadius?: number; // -100 to 100 (0 = straight, positive = smile/arch up, negative = arch down)
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  backgroundPadding?: number;
  backgroundRadius?: number;
  backgroundOpacity?: number;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export type PhotoMask =
  | 'none'
  | 'circle'
  | 'arch'
  | 'heart'
  | 'rounded'
  | 'diamond'
  | 'octagon'
  | 'star'
  | 'hexagon'
  | 'scallop'
  | 'lotus';

export type ObjectFitType = 'cover' | 'contain' | 'fill';

export type PhotoFilterPreset =
  | 'none'
  | 'royal-warm'
  | 'vintage-sepia'
  | 'vivid-gold'
  | 'bw-classic'
  | 'rose-tint'
  | 'high-contrast'
  | 'festive-glow'
  | 'cinematic-teal'
  | 'soft-pastel'
  | 'dramatic-noir'
  | 'golden-hour';

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt?: string;
  mask: PhotoMask;
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  filter?: string;
  filterPreset?: PhotoFilterPreset;
  brightness?: number; // 50 to 150, default 100
  contrast?: number;   // 50 to 150, default 100
  saturation?: number; // 0 to 200, default 100
  hueRotate?: number;  // -180 to 180, default 0
  sepia?: number;      // 0 to 100, default 0
  vignette?: number;   // 0 to 100, default 0
  blur?: number;       // 0 to 10, default 0
  shadowBlur?: number;
  shadowColor?: string;
  objectFit?: ObjectFitType;
  scale?: number; // Zoom inside frame (0.8 to 3.0)
  offsetX?: number; // Pan horizontal percentage (-50 to 50)
  offsetY?: number; // Pan vertical percentage (-50 to 50)
  rotationInside?: number; // Rotate image inside frame (-180 to 180)
  bgRemoved?: boolean; // Simulated Magic BG Remover studio effect
}

export interface StickerElement extends BaseElement {
  type: 'sticker';
  stickerId: string;
  name: string;
  category: 'religious' | 'wedding' | 'festive' | 'borders' | 'dividers';
  svgContent: string;
  color: string;
  glowColor?: string;
  glowBlur?: number;
}

export interface QrElement extends BaseElement {
  type: 'qr';
  qrType: 'maps' | 'rsvp' | 'custom' | 'upi';
  dataUrl: string;
  targetValue: string;
  label: string;
  color: string;
  backgroundColor: string;
  borderColor?: string;
  cornerRadius?: number;
}

export type ShapeVariant =
  | 'gold-frame'
  | 'divider-line'
  | 'ornate-border'
  | 'rectangle'
  | 'circle'
  | 'arch-frame'
  | 'royal-badge'
  | 'pill-banner'
  | 'diamond'
  | 'star'
  | 'hexagon'
  | 'triangle'
  | 'heart-shape'
  | 'scallop-badge'
  | 'ribbon-banner'
  | 'mandala-ring'
  | 'arrow-right'
  | 'octagon-frame';

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeVariant;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  gradientFill?: string;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
}

export interface DrawingElement extends BaseElement {
  type: 'drawing';
  paths: {
    d: string;
    color: string;
    strokeWidth: number;
    brushType: 'pen' | 'marker' | 'highlighter' | 'glow-gold' | 'calligraphy';
    opacity: number;
  }[];
  viewBoxWidth: number;
  viewBoxHeight: number;
}

export type CanvasItem =
  | TextElement
  | ImageElement
  | StickerElement
  | QrElement
  | ShapeElement
  | DrawingElement;

export type PageTransitionType = 'none' | 'fade' | 'slide' | 'zoom' | 'royal-curtain' | 'sparkle';

export interface CardPage {
  id: string;
  title: string;
  backgroundType: 'color' | 'gradient' | 'pattern' | 'image';
  backgroundValue: string;
  duration?: number; // Slide duration in seconds (default 4.5)
  transition?: PageTransitionType;
  notes?: string;
  elements: CanvasItem[];
}

export interface BrandKit {
  id: string;
  name: string;
  primaryColors: string[];
  headingFont: string;
  subheadingFont: string;
  bodyFont: string;
}

export interface AudioTrack {
  id: string;
  name: string;
  category: 'shehnai' | 'sitar' | 'flute' | 'dhol' | 'mantra' | 'bollywood';
  ragaNotes: number[];
  tempo: number;
  description: string;
}

export interface DrawBrushSettings {
  isEnabled: boolean;
  brushType: 'pen' | 'marker' | 'highlighter' | 'glow-gold' | 'calligraphy' | 'eraser';
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface CardTemplate {
  id: string;
  title: string;
  category: 'wedding' | 'housewarming' | 'birthday' | 'baby-shower' | 'sangeet-mehendi' | 'anniversary';
  aspectRatio: AspectRatioType;
  tags: string[];
  thumbnailGradient: string;
  pages: CardPage[];
}
