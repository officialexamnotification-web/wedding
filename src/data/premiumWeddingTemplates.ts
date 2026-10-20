import { CardTemplate, ImageElement, TextElement } from '../types/editor';

type WeddingPalette = {
  ink: string;
  accent: string;
  soft: string;
  background: string;
};

const makeText = (
  id: string,
  text: string,
  y: number,
  height: number,
  fontFamily: string,
  fontSize: number,
  color: string,
  letterSpacing = 0,
  fontWeight: TextElement['fontWeight'] = 'normal',
): TextElement => ({
  id,
  type: 'text',
  text,
  fontFamily,
  fontSize,
  color,
  fontWeight,
  fontStyle: 'normal',
  textAlign: 'center',
  letterSpacing,
  lineHeight: 1.2,
  x: 48,
  y,
  width: 404,
  height,
  rotation: 0,
  opacity: 1,
  zIndex: 3,
});

function createWeddingTemplate(input: {
  id: string;
  title: string;
  subtitle: string;
  artwork: string;
  palette: WeddingPalette;
  accentFont?: string;
  names?: string;
  ceremony?: string;
  category?: CardTemplate['category'];
  thumbnailGradient: string;
}): CardTemplate {
  const image: ImageElement = {
    id: `${input.id}-artwork`,
    type: 'image',
    src: input.artwork,
    alt: `${input.title} invitation background artwork`,
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

  return {
    id: input.id,
    title: input.title,
    category: input.category || 'wedding',
    aspectRatio: 'portrait-classic',
    tags: ['Wedding', 'Premium', 'Original artwork', input.subtitle],
    thumbnailGradient: input.thumbnailGradient,
    pages: [
      {
        id: `${input.id}-page-1`,
        title: 'Wedding Invitation',
        backgroundType: 'color',
        backgroundValue: input.palette.background,
        elements: [
          image,
          makeText(`${input.id}-blessing`, 'WITH THE BLESSINGS OF OUR FAMILIES', 151, 22, "'Cinzel', serif", 10, input.palette.accent, 2.1, '600'),
          makeText(`${input.id}-invite-line`, 'joyfully invite you to celebrate the wedding of', 208, 26, "'Cormorant Garamond', serif", 17, input.palette.ink),
          makeText(`${input.id}-names`, input.names || 'Aarav & Meera', 245, 58, input.accentFont || "'Great Vibes', cursive", 40, input.palette.ink),
          makeText(`${input.id}-ceremony`, input.ceremony || 'THE WEDDING CEREMONY', 322, 26, "'Cinzel', serif", 13, input.palette.accent, 1.6, '600'),
          makeText(`${input.id}-date`, 'SATURDAY  ·  21 FEBRUARY 2027', 370, 24, "'Montserrat', sans-serif", 11, input.palette.ink, 1.3, '600'),
          makeText(`${input.id}-time`, 'Ceremony at 6:30 in the evening', 403, 24, "'Cormorant Garamond', serif", 17, input.palette.ink),
          makeText(`${input.id}-venue`, 'THE ROYAL COURTYARD  ·  JAIPUR', 454, 24, "'Cinzel', serif", 10, input.palette.accent, 1.1, '600'),
          makeText(`${input.id}-rsvp`, 'Kindly reply by 10 February 2027', 565, 22, "'Cormorant Garamond', serif", 15, input.palette.soft),
        ],
      },
    ],
  };
}

/** Original, text-editable wedding cards built around newly commissioned artwork. */
export const PREMIUM_WEDDING_TEMPLATES: CardTemplate[] = [
  createWeddingTemplate({
    id: 'blush-botanical-wedding',
    title: 'Blush Botanical Wedding',
    subtitle: 'Rose garden',
    artwork: '/images/curated-wedding/blush-botanical.webp',
    palette: { ink: '#5D3C3D', accent: '#9C6A4F', soft: '#765351', background: '#F8EFEB' },
    thumbnailGradient: 'from-rose-100 via-pink-50 to-amber-100',
  }),
  createWeddingTemplate({
    id: 'emerald-heritage-wedding',
    title: 'Emerald Heritage Wedding',
    subtitle: 'Palace garden',
    artwork: '/images/curated-wedding/emerald-heritage.webp',
    palette: { ink: '#59482C', accent: '#A6813E', soft: '#6B593D', background: '#F7F1E3' },
    thumbnailGradient: 'from-emerald-950 via-emerald-800 to-amber-700',
  }),
  createWeddingTemplate({
    id: 'indigo-peacock-wedding',
    title: 'Indigo Peacock Wedding',
    subtitle: 'Evening celebration',
    artwork: '/images/curated-wedding/indigo-peacock.webp',
    palette: { ink: '#F5E9C9', accent: '#D9B65B', soft: '#D9D0B8', background: '#07162F' },
    thumbnailGradient: 'from-slate-950 via-blue-950 to-cyan-900',
  }),
  createWeddingTemplate({
    id: 'sage-botanical-wedding',
    title: 'Sage Botanical Wedding',
    subtitle: 'Modern garden',
    artwork: '/images/curated-wedding/sage-minimal.webp',
    palette: { ink: '#485246', accent: '#897349', soft: '#646B5A', background: '#F4F1E8' },
    thumbnailGradient: 'from-lime-50 via-stone-100 to-amber-100',
  }),
  createWeddingTemplate({
    id: 'lavender-garden-wedding',
    title: 'Lavender Garden Wedding',
    subtitle: 'Wisteria garden',
    artwork: '/images/curated-wedding/lavender-botanical.webp',
    palette: { ink: '#57445A', accent: '#92734F', soft: '#69566B', background: '#F5F0F3' },
    thumbnailGradient: 'from-violet-100 via-stone-50 to-rose-100',
  }),
  createWeddingTemplate({
    id: 'maroon-mughal-wedding',
    title: 'Maroon Mughal Wedding',
    subtitle: 'Royal evening',
    artwork: '/images/curated-wedding/maroon-mughal.webp',
    palette: { ink: '#F8EAC8', accent: '#D6AD64', soft: '#E8D5B0', background: '#35100D' },
    thumbnailGradient: 'from-amber-950 via-red-950 to-stone-950',
  }),
  createWeddingTemplate({
    id: 'marigold-sangeet-haldi',
    title: 'Marigold Sangeet & Haldi',
    subtitle: 'Haldi and sangeet',
    category: 'sangeet-mehendi',
    ceremony: 'HALDI & SANGEET',
    artwork: '/images/curated-wedding/marigold-sangeet.webp',
    palette: { ink: '#5D4528', accent: '#9C5E2B', soft: '#765334', background: '#F9F1DA' },
    thumbnailGradient: 'from-yellow-200 via-amber-100 to-orange-100',
  }),
  createWeddingTemplate({
    id: 'terracotta-modern-wedding',
    title: 'Terracotta Modern Wedding',
    subtitle: 'Modern arch',
    artwork: '/images/curated-wedding/terracotta-modern.webp',
    palette: { ink: '#5D473E', accent: '#A7644E', soft: '#73594D', background: '#F7F0E6' },
    thumbnailGradient: 'from-orange-100 via-stone-100 to-rose-100',
  }),
];
