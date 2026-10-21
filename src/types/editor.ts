export type AspectRatioType =
  | 'portrait-story'
  | 'square'
  | 'portrait-classic'
  | 'landscape'
  | 'a4-print'
  | 'whatsapp-banner';

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
  'a4-print': {
    width: 520,
    height: 735,
    name: 'A4 Royal Print',
    ratioLabel: 'A4',
    recommendedFor: '300 DPI Press Print, Boxed Wedding Invitations',
  },
  'whatsapp-banner': {
    width: 720,
    height: 405,
    name: 'YouTube / Wide Video',
    ratioLabel: '16:9',
    recommendedFor: 'TV Screens, LED Reception Walls, YouTube Invites',
  },
};

export type ElementType =
  | 'text'
  | 'image'
  | 'sticker'
  | 'qr'
  | 'shape'
  | 'drawing'
  | 'table'
  | 'chart'
  | 'grid'
  | 'countdown'
  | 'barcode'
  | 'frame'
  | 'form'
  | 'sheet'
  | 'mockup'
  | 'model3d'
  | 'video'
  | 'audio';

export type ElementAnimationType =
  | 'none'
  | 'rise'
  | 'pan'
  | 'fade'
  | 'pop'
  | 'wipe'
  | 'breathe'
  | 'drift'
  | 'tumble'
  | 'neon-pulse'
  | 'typewriter'
  | 'stomp'
  | 'tectonic'
  | 'baseline'
  | 'scrapbook'
  | 'photo-zoom'
  | 'photo-flow'
  | 'float'
  | 'heartbeat'
  | 'spin-slow';

export type AnimationTimingMode = 'both' | 'enter' | 'exit' | 'loop';
export type AnimationDirectionMode = 'up' | 'down' | 'left' | 'right';

export type BlendModeType =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'lighten'
  | 'color-dodge'
  | 'difference'
  | 'soft-light';

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
  ratioLocked?: boolean;
  hidden?: boolean;
  flipX?: boolean;
  flipY?: boolean;
  animation?: ElementAnimationType;
  animationSpeed?: number; // 0.5x to 2x
  animationTiming?: AnimationTimingMode;
  animationDirection?: AnimationDirectionMode;
  blendMode?: BlendModeType;
  linkUrl?: string;
  altText?: string;
  groupId?: string;
  dropShadow?: {
    enabled: boolean;
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
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
  gradientText?: string; // CSS gradient for metallic gold / rose gold text
  fontWeight: 'normal' | '500' | '600' | '700' | '900' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration?: 'none' | 'underline' | 'line-through';
  textAlign: 'left' | 'center' | 'right' | 'justify';
  verticalAlign?: 'top' | 'middle' | 'bottom';
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
  | 'lotus'
  | 'polaroid'
  | 'phone-mockup'
  | 'envelope-mockup';

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
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
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
  caption?: string; // For polaroid mockup
}

export interface StickerElement extends BaseElement {
  type: 'sticker';
  stickerId: string;
  name: string;
  category: 'religious' | 'wedding' | 'festive' | 'borders' | 'dividers' | string;
  svgContent: string;
  color: string;
  glowColor?: string;
  glowBlur?: number;
}

export interface QrElement extends BaseElement {
  type: 'qr';
  qrType: 'maps' | 'rsvp' | 'custom' | 'upi' | 'wifi' | 'calendar';
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
  | 'octagon-frame'
  | 'line-arrow-both'
  | 'line-dashed'
  | 'line-floral'
  | 'speech-bubble'
  | 'cloud-badge'
  | 'shield-crest'
  | 'pentagon'
  | 'cross-plus'
  | 'parallelogram'
  | 'trapezoid';

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeVariant | string;
  shapeName?: string;
  svgPath?: string; // Custom SVG markup or path for 312 Shapes library
  svgFilePath?: string; // Static asset path under /assets/elements/shapes/
  strokeColor: string;
  strokeWidth: number;
  fillColor?: string;
  gradientFill?: string;
  borderRadius?: number;
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double';
  innerText?: string;
  innerTextColor?: string;
  innerFontSize?: number;
  innerFontFamily?: string;
  lineStartCap?: 'none' | 'arrow' | 'circle' | 'diamond';
  lineEndCap?: 'none' | 'arrow' | 'circle' | 'diamond';
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

// CANVA TABLE ELEMENT (Event Schedule / Itinerary / Guest Seating / Menu)
export interface TableElement extends BaseElement {
  type: 'table';
  rows: string[][];
  headerBgColor: string;
  headerTextColor: string;
  cellBgColor: string;
  altRowBgColor?: string;
  textColor: string;
  borderColor: string;
  borderWidth: number;
  fontSize: number;
  fontFamily: string;
  borderRadius?: number;
  cellPadding?: number;
}

// CANVA CHART & INFOGRAPHIC ELEMENT (RSVP Stats / Event Timeline / Budget / Seating)
export type ChartVariant =
  | 'bar'
  | 'horizontal-bar'
  | 'donut'
  | 'pie'
  | 'line'
  | 'progress-rings'
  | 'area'
  | 'radar'
  | 'stacked-bar'
  | 'gauge'
  | 'funnel';

export interface ChartDataPoint {
  label: string;
  value: number;
  color: string;
}

export interface ChartElement extends BaseElement {
  type: 'chart';
  chartType: ChartVariant;
  title: string;
  data: ChartDataPoint[];
  showLegend: boolean;
  showValues: boolean;
  textColor: string;
  backgroundColor?: string;
  borderColor?: string;
}

// CANVA PHOTO COLLAGE GRID ELEMENT
export type GridLayoutVariant =
  | '2-col'
  | '2-row'
  | '3-collage'
  | '4-quad'
  | 'polaroid-trio'
  | 'hero-split'
  | string;

export interface GridSlotRect {
  x: number;
  y: number;
  w: number;
  h: number;
  rx?: number;
}

export interface GridElement extends BaseElement {
  type: 'grid';
  gridLayout: GridLayoutVariant;
  gridName?: string;
  slots?: GridSlotRect[]; // Custom normalized slots 0..100
  images: string[];
  gap: number;
  borderRadius: number;
  borderColor: string;
  borderWidth: number;
  backgroundColor?: string;
}

// CANVA CLIPPING FRAME ELEMENT (30 Masks with Photo Drop, Zoom, Pan, Border)
export interface FrameElement extends BaseElement {
  type: 'frame';
  frameId: string;
  frameName: string;
  clipPathSvg: string; // SVG content inside <clipPath viewBox="0 0 100 100">
  borderSvg?: string; // Optional decorative border in 0..100 viewBox
  imageSrc: string;
  imageScale: number; // 0.8 to 3.0
  imageOffsetX: number; // -50 to 50
  imageOffsetY: number; // -50 to 50
  naturalImageFit?: boolean; // Keep the full photo visible without stretching; softly fill unused frame area.
  borderColor: string;
  borderWidth: number;
  placeholderColor?: string;
}

// CANVA INTERACTIVE FORM ELEMENT (RSVP / Poll / Meal Choice / Feedback)
export interface FormFieldItem {
  id: string;
  label: string;
  fieldType: 'text' | 'select' | 'radio' | 'checkbox' | 'textarea' | 'rating' | 'number';
  placeholder?: string;
  options?: string[];
  value?: string;
  required?: boolean;
}

export interface FormElement extends BaseElement {
  type: 'form';
  formId: string;
  formTitle: string;
  formSubtitle?: string;
  fields: FormFieldItem[];
  submitLabel: string;
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  submittedCount?: number;
}

// CANVA SPREADSHEET / LIVE SHEET ELEMENT (Formulas, Guest Tracker, Budget)
export interface SheetElement extends BaseElement {
  type: 'sheet';
  sheetId: string;
  sheetTitle: string;
  columns: string[];
  cells: (string | number)[][];
  headerBgColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  borderColor: string;
  showFormulas?: boolean;
}

// CANVA DEVICE & STATIONERY MOCKUP ELEMENT
export interface MockupElement extends BaseElement {
  type: 'mockup';
  mockupId: string;
  mockupName: string;
  subcategory: string;
  frameSvg: string; // 0..200 viewBox outer frame
  screenRect: { x: number; y: number; w: number; h: number; rx: number };
  contentImageSrc: string;
  caption?: string;
  accentColor: string;
  imageScale?: number;
}

// CANVA INTERACTIVE 3D MODEL ELEMENT
export interface Model3DElement extends BaseElement {
  type: 'model3d';
  modelId: string;
  modelName: string;
  geometryType: string;
  primaryColor: string;
  secondaryColor: string;
  metalness: number;
  roughness: number;
  pitch: number; // -90 to 90
  yaw: number;   // -180 to 180
  roll: number;  // -180 to 180
  autoRotate: boolean;
  wireframe?: boolean;
}

// CANVA MOTION VIDEO LOOP ELEMENT
export interface VideoElement extends BaseElement {
  type: 'video';
  videoId: string;
  videoName: string;
  visualTheme: string;
  primaryColor: string;
  secondaryColor: string;
  bgGradient: string;
  isPlaying: boolean;
  isMuted: boolean;
  loop: boolean;
  playbackSpeed: number;
  borderRadius?: number;
  borderColor?: string;
  borderWidth?: number;
}

// CANVA AUDIO PLAYER / SOUNDTRACK BADGE ELEMENT
export interface AudioElement extends BaseElement {
  type: 'audio';
  audioId: string;
  trackName: string;
  category: string;
  ragaNotes: number[];
  tempo: number;
  accentColor: string;
  backgroundColor: string;
  isPlaying?: boolean;
  volume?: number;
}

// CANVA LIVE EVENT COUNTDOWN / DATE STAMP ELEMENT
export interface CountdownElement extends BaseElement {
  type: 'countdown';
  targetDate: string; // ISO or YYYY-MM-DDTHH:mm
  eventLabel: string;
  styleVariant: 'royal-gold' | 'modern-glass' | 'minimal-serif' | 'festive-pill';
  primaryColor: string;
  backgroundColor: string;
  borderColor: string;
  showSeconds?: boolean;
}

// CANVA BARCODE / VENUE PASS TICKET ELEMENT
export interface BarcodeElement extends BaseElement {
  type: 'barcode';
  codeValue: string;
  label: string;
  subLabel?: string;
  color: string;
  backgroundColor: string;
  borderColor?: string;
  showText: boolean;
}

export type CanvasItem =
  | TextElement
  | ImageElement
  | StickerElement
  | QrElement
  | ShapeElement
  | DrawingElement
  | TableElement
  | ChartElement
  | GridElement
  | CountdownElement
  | BarcodeElement
  | FrameElement
  | FormElement
  | SheetElement
  | MockupElement
  | Model3DElement
  | VideoElement
  | AudioElement;

export type PageTransitionType =
  | 'none'
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'royal-curtain'
  | 'sparkle'
  | 'push'
  | 'wipe'
  | 'flip'
  | 'blur'
  | 'rotate'
  | 'stack'
  | 'chop'
  | 'match-move'
  | 'iris'
  | 'vertical-wipe'
  | 'cross-zoom'
  | 'page-turn'
  | 'light-sweep'
  | 'panorama';

export interface CardPage {
  id: string;
  title: string;
  locked?: boolean;
  hidden?: boolean;
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
  logoUrl?: string;
}

export interface AudioTrack {
  id: string;
  name: string;
  category: 'shehnai' | 'sitar' | 'flute' | 'dhol' | 'mantra' | 'bollywood';
  ragaNotes: number[];
  tempo: number;
  description: string;
  audioUrl?: string;
}

export interface AudioClipSettings {
  /** In point of the chosen source-music section, in seconds. */
  startSec: number;
  /** Null means the whole invitation duration. */
  durationSec: number | null;
  /** Exclusive out point in the source track. Undefined keeps legacy projects using the remaining track. */
  sourceEndSec?: number | null;
  volume: number;
  fadeInSec: number;
  fadeOutSec: number;
  loop: boolean;
  /** Indicates that this clip's in-point and length are aligned to the track beat grid. */
  beatSync?: boolean;
}

/** A music clip assigned to one slide, or to the full invitation when pageIndex is null. */
export interface AudioTimelineClip {
  id: string;
  trackId: string;
  pageIndex: number | null;
  /** Absolute position on the invitation timeline, in seconds. */
  timelineStartSec?: number;
  settings: AudioClipSettings;
}

export interface DrawBrushSettings {
  isEnabled: boolean;
  brushType: 'pen' | 'marker' | 'highlighter' | 'glow-gold' | 'calligraphy' | 'eraser';
  color: string;
  strokeWidth: number;
  opacity: number;
}

export interface SavedProject {
  id: string;
  title: string;
  updatedAt: string;
  aspectRatio: AspectRatioType;
  pages: CardPage[];
  audioTrackId?: string;
  audioClip?: AudioClipSettings;
  audioClips?: AudioTimelineClip[];
}

export interface CustomGuide {
  id: string;
  orientation: 'horizontal' | 'vertical';
  position: number; // px on artboard
}

export interface CardTemplate {
  id: string;
  title: string;
  category:
    | 'wedding'
    | 'housewarming'
    | 'birthday'
    | 'baby-shower'
    | 'sangeet-mehendi'
    | 'anniversary';
  aspectRatio: AspectRatioType;
  tags: string[];
  thumbnailGradient: string;
  pages: CardPage[];
}
