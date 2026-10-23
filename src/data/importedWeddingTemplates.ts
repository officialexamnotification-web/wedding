import type { CardTemplate, ImageElement, TextElement } from '../types/editor';
import { CANVAS_SIZES } from '../types/editor';

type ImportedArt = {
  slug: string;
  title: string;
  palette: keyof typeof palettes;
  layout: LayoutName;
  aspectRatio: 'portrait-classic' | 'portrait-story';
};

type LayoutName = 'classic' | 'envelope' | 'scenic-left' | 'split-suite' | 'ornate';

const palettes = {
  ivoryBurgundy: { paper: '#F5E9DA', ink: '#542632', accent: '#8A612D' },
  ivoryNavy: { paper: '#F4F0E8', ink: '#243B5A', accent: '#916A2F' },
  ivoryOlive: { paper: '#E9DDC9', ink: '#3E503C', accent: '#896936' },
  ivoryPlum: { paper: '#E5DCE8', ink: '#4D3658', accent: '#86633E' },
  emerald: { paper: '#102D23', ink: '#FFF6E4', accent: '#E6C573' },
  teal: { paper: '#082B35', ink: '#FFF5E2', accent: '#E9C879' },
  amethyst: { paper: '#29162F', ink: '#FFF2E0', accent: '#E5C174' },
  blackGold: { paper: '#1C1A18', ink: '#FFF2D8', accent: '#E8BF68' },
} as const;

const layouts: Record<LayoutName, {
  left: number;
  width: number;
  intro: number;
  title: number;
  names: number;
  message: number;
  date: number;
  venue: number;
}> = {
  classic: { left: 0.12, width: 0.76, intro: 0.18, title: 0.25, names: 0.34, message: 0.45, date: 0.57, venue: 0.65 },
  envelope: { left: 0.19, width: 0.62, intro: 0.17, title: 0.24, names: 0.33, message: 0.44, date: 0.54, venue: 0.62 },
  'scenic-left': { left: 0.06, width: 0.56, intro: 0.25, title: 0.32, names: 0.40, message: 0.49, date: 0.58, venue: 0.64 },
  // This artwork has a narrow upper writing panel above a crosswise ribbon.
  // Keep the complete invitation details inside that panel, clear of the ribbon.
  'split-suite': { left: 0.18, width: 0.64, intro: 0.10, title: 0.16, names: 0.23, message: 0.32, date: 0.39, venue: 0.435 },
  ornate: { left: 0.15, width: 0.70, intro: 0.23, title: 0.30, names: 0.39, message: 0.49, date: 0.59, venue: 0.67 },
};

const artwork: ImportedArt[] = [
  { slug: 'blue-gold-marble-wedding-invitation-background-3', title: 'Blue-Gold Marble Invitation', palette: 'ivoryNavy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'burgundy-and-gold-wedding-invitation-elegance', title: 'Burgundy Rose Envelope', palette: 'ivoryBurgundy', layout: 'envelope', aspectRatio: 'portrait-story' },
  { slug: 'burgundy-floral-arch-wedding-invitation', title: 'Burgundy Floral Arch', palette: 'ivoryBurgundy', layout: 'classic', aspectRatio: 'portrait-story' },
  { slug: 'elegant-burgundy-floral-wedding-invitation', title: 'Burgundy Embossed Roses', palette: 'ivoryBurgundy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'elegant-forest-green-floral-invitation-flat-lay', title: 'Forest Green & Ivory Blossoms', palette: 'emerald', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'elegant-teal-and-gold-floral-frame-1', title: 'Teal & Gold Floral Frame I', palette: 'teal', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'elegant-teal-and-gold-floral-frame', title: 'Teal Botanical Frame', palette: 'teal', layout: 'classic', aspectRatio: 'portrait-story' },
  { slug: 'embossed-burgundy-floral-wedding-invitation', title: 'Embossed Burgundy Heirloom', palette: 'ivoryBurgundy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'emerald-and-gold-invitation-flat-lay', title: 'Emerald Velvet Invitation', palette: 'emerald', layout: 'classic', aspectRatio: 'portrait-story' },
  { slug: 'emerald-and-gold-wedding-invitation-template', title: 'Emerald & Gold Invitation', palette: 'emerald', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'emerald-and-gold-wedding-stationery-flatlay', title: 'Emerald Wedding Stationery', palette: 'emerald', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'emerald-gold-arabesque-invitation', title: 'Emerald Arabesque', palette: 'emerald', layout: 'ornate', aspectRatio: 'portrait-classic' },
  { slug: 'emerald-gold-floral-invitation-flat-lay', title: 'Emerald Floral Invitation', palette: 'emerald', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'forest-green-floral-invitation-flat-lay', title: 'Forest Green Floral Frame', palette: 'emerald', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'lavender-floral-wedding-invitation-frame', title: 'Lavender Floral Frame', palette: 'ivoryPlum', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'lavender-gold-floral-invitation-frame', title: 'Lavender Gold Filigree', palette: 'ivoryPlum', layout: 'ornate', aspectRatio: 'portrait-classic' },
  { slug: 'luxurious-burgundy-nikah-invitation-backdrop', title: 'Burgundy Nikah Pavilion', palette: 'ivoryBurgundy', layout: 'scenic-left', aspectRatio: 'portrait-story' },
  { slug: 'luxurious-burgundy-wax-seal-invitation', title: 'Burgundy Wax Seal', palette: 'ivoryBurgundy', layout: 'envelope', aspectRatio: 'portrait-classic' },
  { slug: 'luxurious-ivory-rose-wedding-frame', title: 'Ivory Rose Heirloom Frame', palette: 'ivoryBurgundy', layout: 'classic', aspectRatio: 'portrait-story' },
  { slug: 'luxurious-navy-and-gold-wedding-invitation-2', title: 'Navy & Gold Marble Garden', palette: 'ivoryNavy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'luxurious-navy-and-gold-wedding-invitation', title: 'Navy Palace Invitation Suite', palette: 'ivoryNavy', layout: 'split-suite', aspectRatio: 'portrait-classic' },
  { slug: 'luxurious-navy-gold-arch-invitation-4', title: 'Navy & Gold Jharokha Arch', palette: 'ivoryNavy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'navy-gold-floral-marble-invitation-frame-6', title: 'Navy Floral Marble I', palette: 'ivoryNavy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'navy-gold-marble-wedding-frame-7', title: 'Navy Gold Marble Frame II', palette: 'ivoryNavy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'navy-gold-marble-wedding-invitation-template-5', title: 'Navy Marble Invitation III', palette: 'ivoryNavy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'navy-marble-and-gold-floral-wedding-frame-1', title: 'Navy Botanical Frame IV', palette: 'ivoryNavy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'olive-green-botanical-gold-invitation-frame', title: 'Olive Botanical Heirloom', palette: 'ivoryOlive', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'opulent-burgundy-wedding-invitation-scene', title: 'Burgundy Palace Scene', palette: 'ivoryBurgundy', layout: 'scenic-left', aspectRatio: 'portrait-story' },
  { slug: 'ornate-amethyst-gothic-invitation-frame', title: 'Amethyst Gothic Frame', palette: 'amethyst', layout: 'ornate', aspectRatio: 'portrait-classic' },
  { slug: 'ornate-black-and-gold-invitation-frame', title: 'Black & Gold Folio', palette: 'blackGold', layout: 'ornate', aspectRatio: 'portrait-classic' },
  { slug: 'ornate-burgundy-floral-wedding-invitation', title: 'Burgundy Floral Heirloom', palette: 'ivoryBurgundy', layout: 'classic', aspectRatio: 'portrait-classic' },
  { slug: 'ornate-burgundy-islamic-invitation-flat-lay', title: 'Burgundy Nikah Heirloom', palette: 'ivoryBurgundy', layout: 'classic', aspectRatio: 'portrait-story' },
  { slug: 'ornate-lavender-gold-invitation-frame', title: 'Lavender Gold Ornate Frame', palette: 'ivoryPlum', layout: 'ornate', aspectRatio: 'portrait-classic' },
  { slug: 'ornate-plum-velvet-floral-invitation-mockup', title: 'Plum Velvet Floral Mockup', palette: 'amethyst', layout: 'ornate', aspectRatio: 'portrait-classic' },
  { slug: 'ornate-purple-and-gold-wedding-frame', title: 'Purple & Gold Heirloom', palette: 'amethyst', layout: 'ornate', aspectRatio: 'portrait-classic' },
  { slug: 'ornate-purple-baroque-invitation-frame', title: 'Purple Baroque Heirloom', palette: 'amethyst', layout: 'ornate', aspectRatio: 'portrait-classic' },
  { slug: 'teal-and-gold-botanical-invitation-background', title: 'Teal & Gold Botanicals', palette: 'teal', layout: 'classic', aspectRatio: 'portrait-classic' },
];

function textLayer(
  id: string,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontFamily: string,
  fontSize: number,
  color: string,
  options: Partial<TextElement> = {},
): TextElement {
  return {
    id,
    type: 'text',
    text,
    fontFamily,
    fontSize,
    color,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'center',
    verticalAlign: 'middle',
    letterSpacing: 0,
    lineHeight: 1.15,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    zIndex: 3,
    ...options,
  };
}

function createTemplate(item: ImportedArt): CardTemplate {
  const id = `imported-wedding-${item.slug}`;
  const canvas = CANVAS_SIZES[item.aspectRatio];
  const palette = palettes[item.palette];
  const layout = layouts[item.layout];
  const scale = canvas.width / 500;
  const x = Math.round(canvas.width * layout.left);
  const width = Math.round(canvas.width * layout.width);
  const y = (position: number) => Math.round(canvas.height * position);
  const element = (suffix: string, value: string, position: number, height: number, font: string, size: number, color: string, options: Partial<TextElement> = {}) =>
    textLayer(`${id}-${suffix}`, value, x, y(position), width, Math.round(height * scale), font, Math.round(size * scale * 10) / 10, color, options);

  const background: ImageElement = {
    id: `${id}-artwork`,
    type: 'image',
    src: `/templates/imported-wedding/${item.slug}.webp`,
    alt: `${item.title} wedding invitation artwork`,
    altText: `${item.title} wedding invitation artwork`,
    mask: 'none',
    x: 0,
    y: 0,
    width: canvas.width,
    height: canvas.height,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    objectFit: 'contain',
    locked: true,
    ratioLocked: true,
  };

  const elements: CardTemplate['pages'][number]['elements'] = [
    background,
    element('families', 'TOGETHER WITH OUR FAMILIES', layout.intro, 22, "'Montserrat', sans-serif", 9, palette.accent, { fontWeight: '600', letterSpacing: 1.4, textTransform: 'uppercase' }),
    element('title', 'WEDDING INVITATION', layout.title, 30, "'Cinzel', serif", 17, palette.accent, { fontWeight: '600', letterSpacing: 1.3, textTransform: 'uppercase' }),
    element('names', 'Aarav & Meera', layout.names, 52, "'Great Vibes', cursive", 40, palette.ink, { fontWeight: 'normal' }),
    element('message', 'Joyfully invite you to celebrate their wedding', layout.message, 38, "'Cormorant Garamond', serif", 15, palette.ink, { fontStyle: 'italic' }),
    element('date-time', 'Saturday · 20 February 2027 · 6:30 PM', layout.date, 28, "'Montserrat', sans-serif", 10, palette.accent, { fontWeight: '600', letterSpacing: 0.25 }),
    element('venue', 'The Royal Courtyard · Jaipur', layout.venue, 30, "'Cormorant Garamond', serif", 14, palette.ink, { fontWeight: '500' }),
  ];

  return {
    id,
    title: `${item.title} Wedding Invitation`,
    category: 'wedding',
    aspectRatio: item.aspectRatio,
    tags: ['Shubh Vivah', item.title, item.aspectRatio === 'portrait-story' ? '9:16 Story' : '5:7 Print', 'Editable Text', 'New Collection'],
    thumbnailGradient: item.palette.startsWith('ivory') ? 'from-rose-950 via-amber-800 to-orange-50' : 'from-neutral-950 via-emerald-900 to-amber-600',
    pages: [{
      id: `${id}-page-1`,
      title: item.title,
      backgroundType: 'color',
      backgroundValue: palette.paper,
      elements,
    }],
  };
}

export const IMPORTED_WEDDING_TEMPLATES: CardTemplate[] = artwork.map(createTemplate);
