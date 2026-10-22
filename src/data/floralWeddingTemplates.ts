import type { CardTemplate, ImageElement, TextElement } from '../types/editor';

type FloralDesign = {
  id: string;
  title: string;
  artwork: string;
  background: string;
  ink: string;
  accent: string;
  gradient: string;
  layout: 'center' | 'right' | 'split';
  offset?: number;
};

const designs: FloralDesign[] = [
  { id: 'blush-peony-velvet', title: 'Charcoal Blush Peony Wedding', artwork: 'wedding-floral-01.webp', background: '#171717', ink: '#FFF8EE', accent: '#E8C987', gradient: 'from-neutral-950 via-stone-900 to-amber-200', layout: 'right', offset: 0 },
  { id: 'lavender-jharokha-bloom', title: 'Lavender Jharokha Bloom Wedding', artwork: 'wedding-floral-02.webp', background: '#E9DDE8', ink: '#573B59', accent: '#947044', gradient: 'from-violet-200 via-fuchsia-100 to-amber-100', layout: 'center', offset: 16 },
  { id: 'lavender-peony-border', title: 'Lavender Peony Border Wedding', artwork: 'wedding-floral-03.webp', background: '#F5EDF0', ink: '#593652', accent: '#99734C', gradient: 'from-violet-100 via-stone-100 to-fuchsia-200', layout: 'center', offset: 4 },
  { id: 'midnight-dahlia-velvet', title: 'Midnight Dahlia Velvet Wedding', artwork: 'wedding-floral-04.webp', background: '#151515', ink: '#FFF7EA', accent: '#E8C987', gradient: 'from-neutral-950 via-stone-900 to-amber-200', layout: 'center', offset: 0 },
  { id: 'charcoal-ivory-garden', title: 'Charcoal & Ivory Garden Wedding', artwork: 'wedding-floral-05.webp', background: '#171717', ink: '#FFF8EE', accent: '#E8C987', gradient: 'from-neutral-950 via-stone-900 to-amber-200', layout: 'center', offset: 0 },
  { id: 'burgundy-ivory-garden', title: 'Burgundy & Ivory Garden Wedding', artwork: 'wedding-floral-06.webp', background: '#560F1B', ink: '#FFF5E6', accent: '#EDD18D', gradient: 'from-red-950 via-rose-900 to-stone-100', layout: 'split' },
  { id: 'charcoal-blush-heirloom', title: 'Charcoal Blush Heirloom Wedding', artwork: 'wedding-floral-07.webp', background: '#151515', ink: '#FFF7EA', accent: '#E8C987', gradient: 'from-neutral-950 via-stone-900 to-amber-200', layout: 'right', offset: 0 },
  { id: 'plum-gold-botanical-oval', title: 'Plum Gold Botanical Oval Wedding', artwork: 'wedding-floral-08.webp', background: '#3C192A', ink: '#FFF5E8', accent: '#E9C77B', gradient: 'from-fuchsia-950 via-rose-950 to-amber-800', layout: 'center', offset: 42 },
  { id: 'ruby-magnolia-cameo', title: 'Ruby Magnolia Cameo Wedding', artwork: 'wedding-floral-09.webp', background: '#6B111D', ink: '#56252B', accent: '#8F5D2C', gradient: 'from-red-950 via-rose-900 to-amber-100', layout: 'center', offset: -2 },
  { id: 'plum-rose-atelier', title: 'Plum Rose Atelier Wedding', artwork: 'wedding-floral-10.webp', background: '#4E263D', ink: '#4A2A3A', accent: '#926B45', gradient: 'from-violet-950 via-fuchsia-900 to-amber-100', layout: 'center', offset: 28 },
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
    letterSpacing: 0.35,
    lineHeight: 1.2,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    zIndex: 4,
    ...options,
  };
}

function centerLayout(design: FloralDesign, id: string): TextElement[] {
  const shift = design.offset ?? 0;
  const left = 66;
  const width = 368;
  const y = (value: number) => value + shift;
  return [
    textLayer(`${id}-intro`, 'TOGETHER WITH OUR FAMILIES', left, y(178), width, 22, "'Cinzel', serif", 11, design.accent, { fontWeight: '600', letterSpacing: 1.5 }),
    textLayer(`${id}-heading`, 'THE WEDDING OF', left, y(208), width, 28, "'Cinzel', serif", 17, design.ink, { fontWeight: '600', letterSpacing: 1.15 }),
    textLayer(`${id}-names`, 'Aarav & Meera', left, y(244), width, 58, "'Great Vibes', cursive", 34, design.ink, { fontWeight: 'normal', letterSpacing: 0 }),
    textLayer(`${id}-invite`, 'Joyfully invite you to celebrate their wedding', left + 10, y(310), width - 20, 38, "'Cormorant Garamond', serif", 16, design.ink, { fontWeight: '500', letterSpacing: 0.1 }),
    textLayer(`${id}-date`, 'SATURDAY · 20 FEBRUARY 2027', left + 8, y(372), width - 16, 24, "'Cinzel', serif", 12, design.accent, { fontWeight: '600', letterSpacing: 0.7 }),
    textLayer(`${id}-venue`, 'THE ROYAL PALACE · LUCKNOW', left + 10, y(406), width - 20, 26, "'Cinzel', serif", 12, design.ink, { fontWeight: '600', letterSpacing: 0.55 }),
    textLayer(`${id}-closing`, 'We look forward to celebrating with you', left + 14, y(444), width - 28, 34, "'Cormorant Garamond', serif", 14, design.ink, { fontStyle: 'italic', letterSpacing: 0 }),
  ];
}

function rightLayout(design: FloralDesign, id: string): TextElement[] {
  const left = 232;
  const width = 250;
  return [
    textLayer(`${id}-intro`, 'TOGETHER WITH OUR FAMILIES', left, 176, width, 24, "'Cinzel', serif", 9, design.accent, { fontWeight: '600', letterSpacing: 0.9 }),
    textLayer(`${id}-heading`, 'THE WEDDING OF', left, 207, width, 30, "'Cinzel', serif", 14, design.ink, { fontWeight: '600', letterSpacing: 1 }),
    textLayer(`${id}-names`, 'Aarav & Meera', left, 241, width, 64, "'Great Vibes', cursive", 30, design.ink, { fontWeight: 'normal', letterSpacing: 0 }),
    textLayer(`${id}-invite`, 'Joyfully invite you to celebrate their wedding', left + 5, 314, width - 10, 44, "'Cormorant Garamond', serif", 14, design.ink, { letterSpacing: 0.1 }),
    textLayer(`${id}-date`, 'SATURDAY · 20 FEBRUARY 2027', left + 2, 368, width - 4, 30, "'Cinzel', serif", 10, design.accent, { fontWeight: '600', letterSpacing: 0.15 }),
    textLayer(`${id}-venue`, 'THE ROYAL PALACE · LUCKNOW', left + 6, 405, width - 12, 34, "'Cinzel', serif", 10, design.ink, { fontWeight: '600', letterSpacing: 0.15 }),
    textLayer(`${id}-closing`, 'We look forward to celebrating with you', left + 8, 447, width - 16, 36, "'Cormorant Garamond', serif", 12, design.ink, { fontStyle: 'italic', letterSpacing: 0 }),
  ];
}

function splitLayout(design: FloralDesign, id: string): TextElement[] {
  return [
    textLayer(`${id}-intro`, 'TOGETHER WITH OUR FAMILIES', 34, 250, 282, 28, "'Cinzel', serif", 11, design.accent, { fontWeight: '600', letterSpacing: 1.1 }),
    textLayer(`${id}-heading`, 'THE WEDDING OF', 34, 284, 282, 30, "'Cinzel', serif", 17, design.ink, { fontWeight: '600', letterSpacing: 1.1 }),
    textLayer(`${id}-names`, 'Aarav & Meera', 32, 320, 286, 64, "'Great Vibes', cursive", 30, design.ink, { fontWeight: 'normal', letterSpacing: 0 }),
    textLayer(`${id}-invite`, 'Joyfully invite you to celebrate', 45, 394, 260, 42, "'Cormorant Garamond', serif", 14, design.ink, { letterSpacing: 0 }),
    textLayer(`${id}-date`, 'SATURDAY\n20 FEBRUARY 2027', 338, 240, 145, 54, "'Cinzel', serif", 12, '#54252B', { fontWeight: '600', letterSpacing: 0.35 }),
    textLayer(`${id}-time`, '7:30 PM ONWARDS', 338, 305, 145, 30, "'Cinzel', serif", 11, '#54252B', { fontWeight: '600', letterSpacing: 0.3 }),
    textLayer(`${id}-venue`, 'THE ROYAL PALACE\nLUCKNOW', 333, 351, 155, 54, "'Cormorant Garamond', serif", 14, '#54252B', { fontWeight: '600', letterSpacing: 0 }),
    textLayer(`${id}-closing`, 'With love & blessings', 337, 416, 147, 34, "'Cormorant Garamond', serif", 13, '#54252B', { fontStyle: 'italic', letterSpacing: 0 }),
  ];
}

function createFloralTemplate(design: FloralDesign): CardTemplate {
  const id = `floral-wedding-${design.id}`;
  const artwork: ImageElement = {
    id: `${id}-artwork`,
    type: 'image',
    src: `/templates/generated-assets/${design.artwork}`,
    alt: `${design.title} original floral wedding stationery artwork`,
    altText: `${design.title} original floral wedding stationery artwork`,
    mask: 'none',
    objectFit: 'fill',
    x: 0,
    y: 0,
    width: 500,
    height: 700,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    locked: true,
  };
  const text = design.layout === 'split'
    ? splitLayout(design, id)
    : design.layout === 'right'
      ? rightLayout(design, id)
      : centerLayout(design, id);

  return {
    id,
    title: design.title,
    category: 'wedding',
    aspectRatio: 'portrait-classic',
    tags: ['Wedding', 'Floral', '5:7 Print', 'Editable text', 'Original artwork'],
    thumbnailGradient: design.gradient,
    pages: [{
      id: `${id}-page-1`,
      title: 'Wedding Invitation',
      backgroundType: 'color',
      backgroundValue: design.background,
      elements: [artwork, ...text],
    }],
  };
}

export const FLORAL_WEDDING_TEMPLATES: CardTemplate[] = designs.map(createFloralTemplate);
