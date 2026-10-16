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

export type ElementType = 'text' | 'image' | 'sticker' | 'qr' | 'shape';

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
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  fontWeight: 'normal' | '500' | '600' | '700' | '900' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline';
  textAlign: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  textTransform?: 'none' | 'uppercase' | 'capitalize' | 'lowercase';
  strokeColor?: string;
  strokeWidth?: number;
  backgroundColor?: string;
  backgroundPadding?: number;
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
}

export type PhotoMask = 'none' | 'circle' | 'arch' | 'heart' | 'rounded' | 'diamond' | 'octagon';
export type ObjectFitType = 'cover' | 'contain' | 'fill';
export type PhotoFilterPreset =
  | 'none'
  | 'royal-warm'
  | 'vintage-sepia'
  | 'vivid-gold'
  | 'bw-classic'
  | 'rose-tint'
  | 'high-contrast';

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
  blur?: number;       // 0 to 10, default 0
  objectFit?: ObjectFitType;
  scale?: number; // Zoom inside frame (0.8 to 3.0)
  offsetX?: number; // Pan horizontal percentage (-50 to 50)
  offsetY?: number; // Pan vertical percentage (-50 to 50)
  rotationInside?: number; // Rotate image inside frame (-180 to 180)
}

export interface StickerElement extends BaseElement {
  type: 'sticker';
  stickerId: string;
  name: string;
  category: 'religious' | 'wedding' | 'festive' | 'borders' | 'dividers';
  svgContent: string;
  color: string;
}

export interface QrElement extends BaseElement {
  type: 'qr';
  qrType: 'maps' | 'rsvp' | 'custom';
  dataUrl: string;
  targetValue: string;
  label: string;
  color: string;
  backgroundColor: string;
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
  | 'diamond';

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeVariant;
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
}

export type CanvasItem = TextElement | ImageElement | StickerElement | QrElement | ShapeElement;

export interface CardPage {
  id: string;
  title: string;
  backgroundType: 'color' | 'gradient' | 'pattern' | 'image';
  backgroundValue: string;
  elements: CanvasItem[];
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
