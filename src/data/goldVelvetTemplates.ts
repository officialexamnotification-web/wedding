import { CardTemplate, ImageElement, TextElement } from '../types/editor';
import { ensureTextContrast } from '../utils/colorContrast';

type VelvetDesign = {
  name: string;
  base: string;
  shade: string;
  textGold: string;
  accentFont: string;
  layout: number;
};

// Each entry points to its own generated, full-bleed artwork in public/images/24k-gold-velvet.
const designs: VelvetDesign[] = [
  { name: 'Mughal Jharokha', base: '#3A0714', shade: '#17040A', textGold: '#F5D77F', accentFont: "'Great Vibes', cursive", layout: 0 },
  { name: 'Peacock Teal Darbar', base: '#073B3C', shade: '#03191E', textGold: '#FFF1C5', accentFont: "'Great Vibes', cursive", layout: 1 },
  { name: 'Emerald Pichwai Lotus', base: '#0D3829', shade: '#041B15', textGold: '#FFF2C6', accentFont: "'Great Vibes', cursive", layout: 2 },
  { name: 'Midnight Sheesh Mahal Deco', base: '#09172B', shade: '#030812', textGold: '#FFF0C3', accentFont: "'Cormorant Garamond', serif", layout: 3 },
  { name: 'Aubergine Jaali Courtyard', base: '#2C1239', shade: '#100719', textGold: '#FFF1C4', accentFont: "'Cormorant Garamond', serif", layout: 4 },
  { name: 'Onyx Minimal Gold', base: '#171416', shade: '#050506', textGold: '#FFF0BC', accentFont: "'Cinzel', serif", layout: 0 },
  { name: 'Wine Rose Arch', base: '#4C1129', shade: '#1D0611', textGold: '#FFF0C2', accentFont: "'Great Vibes', cursive", layout: 1 },
  { name: 'Champagne Baroque Velvet', base: '#463321', shade: '#19110D', textGold: '#FFF4D3', accentFont: "'Cormorant Garamond', serif", layout: 2 },
  { name: 'Cobalt Palace Gateway', base: '#112A55', shade: '#050C22', textGold: '#FFF2C4', accentFont: "'Great Vibes', cursive", layout: 3 },
  { name: 'Forest Banyan Vows', base: '#183522', shade: '#07170F', textGold: '#FFF0C1', accentFont: "'Tangerine', cursive", layout: 4 },
  { name: 'Plum Celestial Soirée', base: '#321C46', shade: '#10091D', textGold: '#FFF0C7', accentFont: "'Cormorant Garamond', serif", layout: 0 },
  { name: 'Sapphire Paisley Promise', base: '#0A3150', shade: '#03101F', textGold: '#FFF0BD', accentFont: "'Great Vibes', cursive", layout: 1 },
  { name: 'Crimson Phool Toran', base: '#55151A', shade: '#22080C', textGold: '#FFF2C4', accentFont: "'Tangerine', cursive", layout: 2 },
  { name: 'Teal Mandala Darshan', base: '#0B3439', shade: '#041518', textGold: '#FFF1C5', accentFont: "'Cinzel', serif", layout: 3 },
  { name: 'Charcoal Antique Brocade', base: '#25201B', shade: '#090808', textGold: '#FFF1C6', accentFont: "'Cormorant Garamond', serif", layout: 4 },
  { name: 'Garnet Palace Garden', base: '#3B0B20', shade: '#15050C', textGold: '#FFF0C3', accentFont: "'Great Vibes', cursive", layout: 0 },
  { name: 'Jade Mughal Mehfil', base: '#143B32', shade: '#061A17', textGold: '#FFF1C7', accentFont: "'Tangerine', cursive", layout: 1 },
  { name: 'Indigo Moonlit Mandap', base: '#171D43', shade: '#070918', textGold: '#FFF0C2', accentFont: "'Cormorant Garamond', serif", layout: 2 },
  { name: 'Ruby Kundan Heirloom', base: '#500D1D', shade: '#21050D', textGold: '#FFF0C4', accentFont: "'Great Vibes', cursive", layout: 3 },
  { name: 'Burgundy Grand Durbar', base: '#4A1014', shade: '#1B0608', textGold: '#FFF2C6', accentFont: "'Great Vibes', cursive", layout: 4 },
  { name: 'Oxblood Mughal Jharokha', base: '#4B0715', shade: '#20050C', textGold: '#F8D98C', accentFont: "'Great Vibes', cursive", layout: 5 },
  { name: 'Vermilion Toran Heirloom', base: '#7B1018', shade: '#39070D', textGold: '#FFE9AA', accentFont: "'Cormorant Garamond', serif", layout: 6 },
  { name: 'Ruby Deco Sunburst', base: '#650B13', shade: '#29050A', textGold: '#FFE8A0', accentFont: "'Cinzel', serif", layout: 7 },
  { name: 'Maroon Lotus Paisley', base: '#4A0B1A', shade: '#1E050C', textGold: '#F5D58A', accentFont: "'Tangerine', cursive", layout: 8 },
];

const text = (
  id: string,
  value: string,
  y: number,
  height: number,
  family: string,
  size: number,
  color: string,
  weight: TextElement['fontWeight'] = 'normal',
  spacing = 0,
): TextElement => ({
  id,
  type: 'text',
  text: value,
  fontFamily: family,
  fontSize: size,
  color,
  fontWeight: weight,
  fontStyle: 'normal',
  textAlign: 'center',
  letterSpacing: spacing,
  lineHeight: 1.15,
  x: 54,
  y,
  width: 392,
  height,
  rotation: 0,
  opacity: 1,
  zIndex: 3,
});

function makeTemplate(design: VelvetDesign, index: number): CardTemplate {
  const id = `24k-velvet-${String(index + 1).padStart(2, '0')}`;
  const image: ImageElement = {
    id: `${id}-artwork`,
    type: 'image',
    src: `/images/24k-gold-velvet/velvet-${String(index + 1).padStart(2, '0')}.webp`,
    alt: `${design.name} 24K gold foil on velvet invitation artwork`,
    mask: 'none',
    x: 0,
    y: 0,
    width: 500,
    height: 700,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    objectFit: 'cover',
    locked: true,
  };

  const idColor = ensureTextContrast(design.textGold, design.shade);
  const layouts = [
    { top: 117, intro: 204, names: 248, event: 326, date: 375, venue: 454 },
    { top: 106, intro: 190, names: 235, event: 313, date: 362, venue: 444 },
    { top: 132, intro: 217, names: 262, event: 340, date: 389, venue: 466 },
    { top: 120, intro: 207, names: 251, event: 329, date: 378, venue: 457 },
    { top: 126, intro: 212, names: 256, event: 334, date: 383, venue: 461 },
    { top: 113, intro: 199, names: 246, event: 329, date: 378, venue: 457 },
    { top: 145, intro: 219, names: 263, event: 342, date: 389, venue: 468 },
    { top: 99, intro: 187, names: 241, event: 322, date: 371, venue: 450 },
    { top: 130, intro: 216, names: 259, event: 338, date: 386, venue: 465 },
  ];
  const layout = layouts[design.layout];
  const elements = [
    image,
    text(`${id}-blessing`, '॥ श्री गणेशाय नमः ॥', 77, 23, "'Tiro Devanagari Hindi', serif", 14, idColor, '600', 0.8),
    text(`${id}-families`, 'TOGETHER WITH OUR FAMILIES', layout.top, 22, "'Cinzel', serif", 10, idColor, '600', 1.8),
    text(`${id}-intro`, 'joyfully invite you to celebrate the wedding of', layout.intro, 28, "'Cormorant Garamond', serif", 16, idColor),
    text(`${id}-names`, 'Aarav & Meera', layout.names, 60, design.accentFont, 40, idColor, '600'),
    text(`${id}-event`, 'THE WEDDING CELEBRATION', layout.event, 24, "'Cinzel', serif", 12, idColor, '600', 1.4),
    text(`${id}-date`, 'SATURDAY  ·  21 FEBRUARY 2027', layout.date, 22, "'Montserrat', sans-serif", 11, idColor, '600', 0.8),
    text(`${id}-time`, 'Ceremony at half past six in the evening', layout.date + 29, 25, "'Cormorant Garamond', serif", 16, idColor),
    text(`${id}-venue`, 'THE ROYAL COURTYARD  ·  JAIPUR', layout.venue, 22, "'Cinzel', serif", 10, idColor, '600', 1),
    text(`${id}-closing`, 'With love, we look forward to celebrating with you', 520, 34, "'Cormorant Garamond', serif", 14, idColor),
  ];

  return {
    id,
    title: `${design.name} · 24K Gold Foil Wedding`,
    category: 'gold-velvet',
    aspectRatio: 'portrait-classic',
    tags: ['24K Gold Foil & Velvet Aesthetics', 'Wedding', 'Royal', 'Editable Text', design.name],
    thumbnailGradient: 'from-amber-950 via-neutral-950 to-yellow-700',
    pages: [{
      id: `${id}-page`,
      title: 'Wedding Invitation',
      backgroundType: 'color',
      backgroundValue: design.shade,
      elements,
    }],
  };
}

export const GOLD_VELVET_TEMPLATES: CardTemplate[] = designs.map(makeTemplate);
