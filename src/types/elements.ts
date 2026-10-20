import type {
  ChartVariant,
  ChartDataPoint,
  GridSlotRect,
  FormFieldItem,
  ElementAnimationType,
} from './editor';

export type MainElementCategoryId =
  | 'shapes'
  | 'graphics'
  | 'photos'
  | 'videos'
  | 'audio'
  | 'frames'
  | 'grids'
  | 'charts'
  | 'forms'
  | 'sheets'
  | 'tables'
  | 'animations'
  | 'mockups';

export type ShapeSubcategoryId =
  | 'lines'
  | 'rectangles'
  | 'basic'
  | 'arrows'
  | 'speech-bubbles'
  | 'clouds'
  | 'hearts'
  | 'stars'
  | 'bursts'
  | 'banners'
  | 'blobs'
  | 'gears'
  | 'square-stars'
  | 'organic'
  | 'abstract';

export type GraphicSubcategoryId =
  | 'torans-bandhanwar'
  | 'flowers-botanicals'
  | 'celebration-festive'
  | 'food-drinks'
  | 'people-avatars'
  | 'business-marketing'
  | 'arrows-doodles'
  | 'stickers-badges'
  | 'canva-decorative-pack';

export interface CategoryTileMeta {
  id: MainElementCategoryId;
  label: string;
  hindiSub: string;
  targetCount: number;
  accentGradient: string;
  badgeText: string;
  description: string;
}

export interface ShapeSubcategoryMeta {
  id: ShapeSubcategoryId;
  label: string;
  targetCount: number;
}

export interface ShapeAssetItem {
  id: string;
  name: string;
  category: 'shapes';
  subcategory: ShapeSubcategoryId;
  svgPath: string; // Full standalone <svg ...>...</svg>
  filePath: string; // /assets/elements/shapes/{subcategory}/{file}.svg
  defaultFill: string;
  defaultStroke: string;
  tags: string[];
}

export interface GraphicAssetItem {
  id: string;
  name: string;
  category: 'graphics';
  subcategory: GraphicSubcategoryId;
  svgContent: string;
  filePath: string; // /assets/elements/graphics/{subcategory}/{file}.svg
  defaultColor: string;
  tags: string[];
}

export interface PhotoAssetItem {
  id: string;
  name: string;
  category: 'photos';
  subcategory: string;
  src: string;
  aspectRatio: 'square' | 'portrait' | 'landscape';
  filterCSS?: string;
  tags: string[];
}

export interface VideoAssetItem {
  id: string;
  name: string;
  category: 'videos';
  subcategory: string;
  visualTheme: 'particles' | 'petals' | 'bokeh' | 'mandala-spin' | 'diya-flame' | 'fireworks' | 'light-rays' | 'gold-dust';
  primaryColor: string;
  secondaryColor: string;
  bgGradient: string;
  durationSec: number;
  tags: string[];
}

export interface AudioAssetItem {
  id: string;
  name: string;
  category: 'audio';
  subcategory: 'shehnai' | 'sitar' | 'flute' | 'dhol' | 'mantra' | 'bollywood' | 'ambient' | 'sfx';
  ragaNotes: number[];
  tempo: number;
  accentColor: string;
  durationLabel: string;
  description: string;
  tags: string[];
}

export interface FrameAssetItem {
  id: string;
  name: string;
  category: 'frames';
  subcategory: string;
  clipPathSvg: string; // Inner paths inside <clipPath viewBox="0 0 100 100">
  borderSvg?: string; // Optional decorative overlay paths in 0..100
  defaultBorderColor: string;
  tags: string[];
}

export interface GridAssetItem {
  id: string;
  name: string;
  category: 'grids';
  subcategory: string;
  slotCount: number;
  slots: GridSlotRect[]; // Normalized 0..100 coordinates
  defaultGap: number;
  defaultRadius: number;
  tags: string[];
}

export interface ChartAssetItem {
  id: string;
  name: string;
  category: 'charts';
  chartType: ChartVariant;
  title: string;
  data: ChartDataPoint[];
  tags: string[];
}

export interface FormAssetItem {
  id: string;
  name: string;
  category: 'forms';
  subcategory: string;
  formTitle: string;
  formSubtitle: string;
  fields: FormFieldItem[];
  submitLabel: string;
  accentColor: string;
  backgroundColor: string;
  borderColor: string;
  tags: string[];
}

export interface SheetAssetItem {
  id: string;
  name: string;
  category: 'sheets';
  subcategory: string;
  sheetTitle: string;
  columns: string[];
  cells: (string | number)[][];
  headerBgColor: string;
  accentColor: string;
  tags: string[];
}

export interface TableAssetItem {
  id: string;
  name: string;
  category: 'tables';
  subcategory: string;
  rows: string[][];
  headerBgColor: string;
  headerTextColor: string;
  cellBgColor: string;
  altRowBgColor: string;
  textColor: string;
  borderColor: string;
  tags: string[];
}

export interface AnimationAssetItem {
  id: string;
  name: string;
  category: 'animations';
  subcategory: 'entrance' | 'emphasis' | 'motion' | 'celebration';
  animationType: ElementAnimationType;
  speed: number;
  timing: 'both' | 'enter' | 'exit' | 'loop';
  direction: 'up' | 'down' | 'left' | 'right';
  description: string;
  badge: string;
  tags: string[];
}

export interface MockupAssetItem {
  id: string;
  name: string;
  category: 'mockups';
  subcategory: 'phone' | 'laptop' | 'tablet' | 'card' | 'envelope' | 'frame' | 'standee';
  frameSvg: string;
  screenRect: { x: number; y: number; w: number; h: number; rx: number };
  defaultCaption: string;
  accentColor: string;
  tags: string[];
}

export interface Model3DAssetItem {
  id: string;
  name: string;
  category: '3d';
  subcategory: 'geometric' | 'wedding' | 'royal' | 'celestial' | 'abstract';
  geometryType:
    | 'kalash-3d'
    | 'lotus-3d'
    | 'ring-torus'
    | 'royal-crown'
    | 'diya-3d'
    | 'mandap-pillar'
    | 'diamond-gem'
    | 'sphere-orb'
    | 'cube-matrix'
    | 'pyramid-prism'
    | 'star-poly'
    | 'heart-crystal'
    | 'chandelier-3d'
    | 'drum-dhol'
    | 'helix-spiral'
    | 'celebration-cake';
  primaryColor: string;
  secondaryColor: string;
  metalness: number;
  roughness: number;
  defaultPitch: number;
  defaultYaw: number;
  tags: string[];
}

export type UniversalElementItem =
  | ShapeAssetItem
  | GraphicAssetItem
  | PhotoAssetItem
  | VideoAssetItem
  | AudioAssetItem
  | FrameAssetItem
  | GridAssetItem
  | ChartAssetItem
  | FormAssetItem
  | SheetAssetItem
  | TableAssetItem
  | AnimationAssetItem
  | MockupAssetItem
  | Model3DAssetItem;
