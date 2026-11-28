import React from 'react';

export type MonogramLayout =
  | 'interlocked'
  | 'inline-serif'
  | 'stacked'
  | 'diagonal-split'
  | 'orbital-crown';

export type MonogramTone = 'gold' | 'crimson' | 'ivory' | 'theme';

export interface MonogramStyleMeta {
  themeId: string;
  styleName: string;
  motifSummary: string;
  layout: MonogramLayout;
  fontClass: string;
  canvasFont: string;
  lightStroke: string;
  lightAccent: string;
  darkStroke: string;
  darkAccent: string;
  geometryKind:
    | 'jharokha'
    | 'lotus'
    | 'octagon'
    | 'wreath'
    | 'halo'
    | 'diamond-deco'
    | 'split-oval'
    | 'diya-arch'
    | 'hex-jaali'
    | 'gopuram'
    | 'rose-cameo'
    | 'candle-star'
    | 'gift-tag'
    | 'palna'
    | 'crescent'
    | 'flute-feather'
    | 'kalash'
    | 'rangoli'
    | 'payal-arch'
    | 'thali'
    | 'chhatri'
    | 'matki'
    | 'surya'
    | 'modak-arch'
    | 'signet'
    | 'shikhar'
    | 'bandhani-diamond'
    | 'kolam'
    | 'rub-el-hizb'
    | 'kalgi-oval'
    | 'olive-arch';
}

export const TEMPLATE_MONOGRAM_REGISTRY: Record<string, MonogramStyleMeta> = {
  jharokha: {
    themeId: 'jharokha',
    styleName: 'Mewar Jharokha Portal',
    motifSummary: 'Twin-turret cusped palace arch with kalash finial & serif lockup',
    layout: 'inline-serif',
    fontClass: 'font-bodoni',
    canvasFont: '"Bodoni Moda", "Cormorant Garamond", Georgia, serif',
    lightStroke: '#B3261E',
    lightAccent: '#C2933F',
    darkStroke: '#F2CA74',
    darkAccent: '#FAF6EE',
    geometryKind: 'jharokha',
  },
  paithani: {
    themeId: 'paithani',
    styleName: 'Paithani Zari Octagon',
    motifSummary: 'Mirrored peacock plumes inside an authentic Maharashtrian zari frame',
    layout: 'interlocked',
    fontClass: 'font-bodoni',
    canvasFont: '"Bodoni Moda", Georgia, serif',
    lightStroke: '#5A1668',
    lightAccent: '#C9932A',
    darkStroke: '#E6B86A',
    darkAccent: '#F3D2EA',
    geometryKind: 'octagon',
  },
  'mehndi-jhoola': {
    themeId: 'mehndi-jhoola',
    styleName: 'Marigold & Mango Wreath',
    motifSummary: 'Hand-braided genda blossoms & tulsi leaves framing stacked initials',
    layout: 'stacked',
    fontClass: 'font-playfair',
    canvasFont: '"Playfair Display", Georgia, serif',
    lightStroke: '#3F7D3A',
    lightAccent: '#E08B15',
    darkStroke: '#F4B41A',
    darkAccent: '#A7E8A2',
    geometryKind: 'wreath',
  },
  'sheesh-mahal': {
    themeId: 'sheesh-mahal',
    styleName: 'Sheesh Cut-Mirror Star',
    motifSummary: 'Art-Deco 8-point faceted mirror diamond & geometric hairline glint',
    layout: 'diagonal-split',
    fontClass: 'font-italiana',
    canvasFont: '"Italiana", "Cormorant Garamond", Georgia, serif',
    lightStroke: '#7C5A22',
    lightAccent: '#B5893E',
    darkStroke: '#E8C57B',
    darkAccent: '#FAF6EE',
    geometryKind: 'diamond-deco',
  },
  ivory: {
    themeId: 'ivory',
    styleName: 'Alabaster Jasmine Split-Oval',
    motifSummary: 'Minimalist Swiss letterpress oval pierced by a single jasmine sprig',
    layout: 'diagonal-split',
    fontClass: 'font-italiana',
    canvasFont: '"Italiana", "Cormorant Garamond", serif',
    lightStroke: '#262838',
    lightAccent: '#A8916B',
    darkStroke: '#EFECE6',
    darkAccent: '#C9B38B',
    geometryKind: 'split-oval',
  },
  deepotsav: {
    themeId: 'deepotsav',
    styleName: 'Ghat Deepmala Crest',
    motifSummary: 'Twin crescent river arch crowned with an earthen brass diya flame',
    layout: 'orbital-crown',
    fontClass: 'font-corinthia',
    canvasFont: '"Cormorant Garamond", Georgia, serif',
    lightStroke: '#B85D14',
    lightAccent: '#1E2D59',
    darkStroke: '#F5B841',
    darkAccent: '#FFE9B8',
    geometryKind: 'diya-arch',
  },
  roshni: {
    themeId: 'roshni',
    styleName: 'Ivory Jaali Hex-Shield',
    motifSummary: 'Geometric Mughal lattice hexagon with hanging brass lantern drop',
    layout: 'interlocked',
    fontClass: 'font-bodoni',
    canvasFont: '"Bodoni Moda", Georgia, serif',
    lightStroke: '#8C1622',
    lightAccent: '#C99A42',
    darkStroke: '#E6B86A',
    darkAccent: '#FAF3E8',
    geometryKind: 'hex-jaali',
  },
  temple: {
    themeId: 'temple',
    styleName: 'Dravidian Gopuram Seal',
    motifSummary: 'Tiered South-Indian kalasam sanctum flanked by hanging temple bells',
    layout: 'inline-serif',
    fontClass: 'font-cinzel',
    canvasFont: '"Cinzel", Georgia, serif',
    lightStroke: '#A62417',
    lightAccent: '#C88A2B',
    darkStroke: '#F2C166',
    darkAccent: '#FAF0DE',
    geometryKind: 'gopuram',
  },
  gulab: {
    themeId: 'gulab',
    styleName: 'Damask Rose Ribbon Cameo',
    motifSummary: 'Blush vertical oval framed by rosebuds & a knotted silk satin bow',
    layout: 'stacked',
    fontClass: 'font-pinyon',
    canvasFont: '"Cormorant Garamond", Georgia, serif',
    lightStroke: '#9D2743',
    lightAccent: '#C98A95',
    darkStroke: '#F4BAC7',
    darkAccent: '#E6B86A',
    geometryKind: 'rose-cameo',
  },
  'jashn-birthday': {
    themeId: 'jashn-birthday',
    styleName: 'Candlelight Starburst Halo',
    motifSummary: 'Sunburst celebration ring crowned by a slender glowing taper flame',
    layout: 'orbital-crown',
    fontClass: 'font-playfair',
    canvasFont: '"Playfair Display", Georgia, serif',
    lightStroke: '#6D28D9',
    lightAccent: '#D99A2B',
    darkStroke: '#E6B86A',
    darkAccent: '#FDF3D7',
    geometryKind: 'candle-star',
  },
  'confetti-garden': {
    themeId: 'confetti-garden',
    styleName: 'Keepsake Tag & Confetti Seal',
    motifSummary: 'Chamfered boutique gift-tag emblem with brass eyelet & festive stars',
    layout: 'diagonal-split',
    fontClass: 'font-playfair',
    canvasFont: '"Playfair Display", Georgia, serif',
    lightStroke: '#D94F3D',
    lightAccent: '#C88A2B',
    darkStroke: '#F59E7B',
    darkAccent: '#FDE68A',
    geometryKind: 'gift-tag',
  },
  'nanhe-kadam': {
    themeId: 'nanhe-kadam',
    styleName: 'Sankheda Palna & Ghungroo Crest',
    motifSummary: 'Painted nursery arch adorned with mauli cord & twin brass ghungroos',
    layout: 'stacked',
    fontClass: 'font-display',
    canvasFont: '"Cormorant Garamond", Georgia, serif',
    lightStroke: '#C4452B',
    lightAccent: '#D98A1A',
    darkStroke: '#F5B864',
    darkAccent: '#FBE6D4',
    geometryKind: 'palna',
  },
  'chanda-mama': {
    themeId: 'chanda-mama',
    styleName: 'Chandrani Crescent & Stars',
    motifSummary: 'Celestial midnight arch cradling crescent moon & twinkling constellations',
    layout: 'orbital-crown',
    fontClass: 'font-cinzel',
    canvasFont: '"Cinzel", Georgia, serif',
    lightStroke: '#1E3A5F',
    lightAccent: '#C9962B',
    darkStroke: '#F2CB78',
    darkAccent: '#E2E8F0',
    geometryKind: 'crescent',
  },
  'baal-gopal': {
    themeId: 'baal-gopal',
    styleName: 'Murlidhar Bansuri & Morpankh',
    motifSummary: 'Iridescent peacock-feather eye crossed by a golden sculpted bansuri',
    layout: 'interlocked',
    fontClass: 'font-bodoni',
    canvasFont: '"Bodoni Moda", Georgia, serif',
    lightStroke: '#134E4A',
    lightAccent: '#D98A1A',
    darkStroke: '#F2C166',
    darkAccent: '#5EEAD4',
    geometryKind: 'flute-feather',
  },
  'shubh-aarti': {
    themeId: 'shubh-aarti',
    styleName: 'Purna Kalash Sanctum Seal',
    motifSummary: 'Sacred brass Purna Kalash crowned with mango leaves & coconut',
    layout: 'inline-serif',
    fontClass: 'font-cinzel',
    canvasFont: '"Cinzel", Georgia, serif',
    lightStroke: '#8C1622',
    lightAccent: '#C9962B',
    darkStroke: '#E6B86A',
    darkAccent: '#FCA5A5',
    geometryKind: 'kalash',
  },
  'rangoli-utsav': {
    themeId: 'rangoli-utsav',
    styleName: 'Alpana Floral Mandala Wheel',
    motifSummary: '12-petal dotted festive rangoli rosette circling the center',
    layout: 'orbital-crown',
    fontClass: 'font-playfair',
    canvasFont: '"Playfair Display", Georgia, serif',
    lightStroke: '#C83E2B',
    lightAccent: '#D98A1A',
    darkStroke: '#F59E6C',
    darkAccent: '#FCD34D',
    geometryKind: 'rangoli',
  },
  'ladli-kanya': {
    themeId: 'ladli-kanya',
    styleName: 'Nandini Payal & Gota Crest',
    motifSummary: 'Rose gota-patti filigree arch with delicate silver payal drops',
    layout: 'stacked',
    fontClass: 'font-pinyon',
    canvasFont: '"Cormorant Garamond", Georgia, serif',
    lightStroke: '#B82952',
    lightAccent: '#C99A3B',
    darkStroke: '#F9A8D4',
    darkAccent: '#FDE68A',
    geometryKind: 'payal-arch',
  },
  'devi-kumkum': {
    themeId: 'devi-kumkum',
    styleName: 'Mogra & Kumkum Thali Ring',
    motifSummary: 'Concentric Banarasi brass thali rim beaded with jasmine buds & tilak',
    layout: 'inline-serif',
    fontClass: 'font-cinzel',
    canvasFont: '"Cinzel", Georgia, serif',
    lightStroke: '#7A1632',
    lightAccent: '#D49A2A',
    darkStroke: '#F4B844',
    darkAccent: '#FBCFE8',
    geometryKind: 'thali',
  },
  'gulab-baisa': {
    themeId: 'gulab-baisa',
    styleName: 'Gulabi Garh Chhatri Seal',
    motifSummary: 'Jaipur pink-sandstone pavilion dome with dangling pearl latkans',
    layout: 'interlocked',
    fontClass: 'font-bodoni',
    canvasFont: '"Bodoni Moda", Georgia, serif',
    lightStroke: '#C7385B',
    lightAccent: '#B88635',
    darkStroke: '#F5B8C8',
    darkAccent: '#E6B86A',
    geometryKind: 'chhatri',
  },
  'kanha-makhan': {
    themeId: 'kanha-makhan',
    styleName: 'Gokul Makhan Handi Crest',
    motifSummary: 'Festooned earthen butter handi beneath a Vrindavan peacock arc',
    layout: 'orbital-crown',
    fontClass: 'font-playfair',
    canvasFont: '"Playfair Display", Georgia, serif',
    lightStroke: '#1D4ED8',
    lightAccent: '#D98A1A',
    darkStroke: '#F2B43A',
    darkAccent: '#93C5FD',
    geometryKind: 'matki',
  },
  'veer-balak': {
    themeId: 'veer-balak',
    styleName: 'Suryavanshi Solar Shield',
    motifSummary: '16-ray Rajputana brass Surya sunburst framing princely serif lockup',
    layout: 'inline-serif',
    fontClass: 'font-cinzel',
    canvasFont: '"Cinzel", Georgia, serif',
    lightStroke: '#C94A14',
    lightAccent: '#C48A1E',
    darkStroke: '#F59E0B',
    darkAccent: '#FDE68A',
    geometryKind: 'surya',
  },
  'ganesh-aashish': {
    themeId: 'ganesh-aashish',
    styleName: 'Vighnaharta Modak Toran',
    motifSummary: 'Stone-temple scalloped arch topped by golden modak & twin bells',
    layout: 'stacked',
    fontClass: 'font-display',
    canvasFont: '"Cormorant Garamond", Georgia, serif',
    lightStroke: '#A8321A',
    lightAccent: '#BD8319',
    darkStroke: '#F59E6C',
    darkAccent: '#FDE68A',
    geometryKind: 'modak-arch',
  },
  kohinoor: {
    themeId: 'kohinoor',
    styleName: 'Sindoori Royal Signet Crest',
    motifSummary: 'Faceted octagonal jewel rim crowned by an antique imperial crest',
    layout: 'interlocked',
    fontClass: 'font-bodoni',
    canvasFont: '"Bodoni Moda", Georgia, serif',
    lightStroke: '#7A1120',
    lightAccent: '#B88735',
    darkStroke: '#E5B966',
    darkAccent: '#FAF0DE',
    geometryKind: 'signet',
  },
  vrindavan: {
    themeId: 'vrindavan',
    styleName: 'Braj Shikhar & Mogra Arch',
    motifSummary: 'Cobalt double-cusped mandir silhouette with cascading jasmine buds',
    layout: 'inline-serif',
    fontClass: 'font-cinzel',
    canvasFont: '"Cinzel", Georgia, serif',
    lightStroke: '#17346E',
    lightAccent: '#C49A3C',
    darkStroke: '#E6BC63',
    darkAccent: '#DBEAFE',
    geometryKind: 'shikhar',
  },
  kesariya: {
    themeId: 'kesariya',
    styleName: 'Bandhani Leheriya Diamond',
    motifSummary: 'Tilted Rajasthani tie-dye bindu diamond with gotta-patti corners',
    layout: 'diagonal-split',
    fontClass: 'font-playfair',
    canvasFont: '"Playfair Display", Georgia, serif',
    lightStroke: '#C83E1B',
    lightAccent: '#E08B15',
    darkStroke: '#F59E42',
    darkAccent: '#FDE68A',
    geometryKind: 'bandhani-diamond',
  },
  'pattu-zari': {
    themeId: 'pattu-zari',
    styleName: 'Kanchi Kolam & Zari Frame',
    motifSummary: 'Interlaced rice-flour Kolam knot framed by temple-zari trim',
    layout: 'interlocked',
    fontClass: 'font-cinzel',
    canvasFont: '"Cinzel", Georgia, serif',
    lightStroke: '#1C4D3B',
    lightAccent: '#C9962B',
    darkStroke: '#E6B86A',
    darkAccent: '#A7F3D0',
    geometryKind: 'kolam',
  },
  mehr: {
    themeId: 'mehr',
    styleName: 'Charbagh Rub-el-Hizb Star',
    motifSummary: '8-point Mughal geometric star with hanging sky-lantern pearls',
    layout: 'orbital-crown',
    fontClass: 'font-italiana',
    canvasFont: '"Italiana", "Cormorant Garamond", Georgia, serif',
    lightStroke: '#8F6A24',
    lightAccent: '#B68A3A',
    darkStroke: '#E6C27A',
    darkAccent: '#FAF6EE',
    geometryKind: 'rub-el-hizb',
  },
  kalgi: {
    themeId: 'kalgi',
    styleName: 'Sovereign Sarpech Kalgi Oval',
    motifSummary: 'Jewelled emerald-pearl kalgi plume crowning an Anand Karaj oval',
    layout: 'interlocked',
    fontClass: 'font-bodoni',
    canvasFont: '"Bodoni Moda", Georgia, serif',
    lightStroke: '#D65A14',
    lightAccent: '#1B5E44',
    darkStroke: '#F5A642',
    darkAccent: '#6EE7B7',
    geometryKind: 'kalgi-oval',
  },
  'shahi-badami': {
    themeId: 'shahi-badami',
    styleName: 'Kashmiri Badami Crown Seal',
    motifSummary: 'Royal burgundy signet crest crowned with sovereign golden tiara & paisley',
    layout: 'interlocked',
    fontClass: 'font-bodoni',
    canvasFont: '"Bodoni Moda", Georgia, serif',
    lightStroke: '#8B1A2B',
    lightAccent: '#C59B38',
    darkStroke: '#F3CF7A',
    darkAccent: '#FAF0DE',
    geometryKind: 'signet',
  },
  'van-upvan': {
    themeId: 'van-upvan',
    styleName: 'Sage Botanical Meadow Wreath',
    motifSummary: 'Sunlit sage-green botanical wreath with wildflower blossoms & golden seal',
    layout: 'orbital-crown',
    fontClass: 'font-playfair',
    canvasFont: '"Playfair Display", Georgia, serif',
    lightStroke: '#3B5944',
    lightAccent: '#C59B38',
    darkStroke: '#E6C27A',
    darkAccent: '#E9EFE8',
    geometryKind: 'wreath',
  },
  'sindoori-rajhans': {
    themeId: 'sindoori-rajhans',
    styleName: 'Rajhans Swarn Kalash Seal',
    motifSummary: 'Opulent maroon temple sanctum crest with golden Rajhans & lotus motifs',
    layout: 'inline-serif',
    fontClass: 'font-cinzel',
    canvasFont: '"Cinzel", Georgia, serif',
    lightStroke: '#7B1113',
    lightAccent: '#D4A23F',
    darkStroke: '#F5D07E',
    darkAccent: '#FAF0DE',
    geometryKind: 'kalash',
  },
  'rajsi-baingani': {
    themeId: 'rajsi-baingani',
    styleName: 'Marwar Filigree Octagon Crest',
    motifSummary: 'Imperial mulberry-purple and 24k gold arabesque octagonal signet',
    layout: 'interlocked',
    fontClass: 'font-bodoni',
    canvasFont: '"Bodoni Moda", Georgia, serif',
    lightStroke: '#5E1B4C',
    lightAccent: '#D4A84B',
    darkStroke: '#F3CF7A',
    darkAccent: '#F7D9EE',
    geometryKind: 'octagon',
  },
  'neel-chandani': {
    themeId: 'neel-chandani',
    styleName: 'Neel Chandani Platinum Star',
    motifSummary: 'Midnight navy celestial crest with platinum-silver filigree & starlight',
    layout: 'diagonal-split',
    fontClass: 'font-italiana',
    canvasFont: '"Italiana", "Cormorant Garamond", Georgia, serif',
    lightStroke: '#1E3A6D',
    lightAccent: '#94A3B8',
    darkStroke: '#E2E8F0',
    darkAccent: '#93C5FD',
    geometryKind: 'diamond-deco',
  },
};

export function getMonogramMeta(themeId?: string): MonogramStyleMeta {
  if (themeId && TEMPLATE_MONOGRAM_REGISTRY[themeId]) {
    return TEMPLATE_MONOGRAM_REGISTRY[themeId];
  }
  return TEMPLATE_MONOGRAM_REGISTRY.jharokha;
}

interface TemplateMonogramProps {
  themeId?: string;
  groomInitial: string;
  brideInitial: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: MonogramTone;
  className?: string;
}

export const TemplateMonogram: React.FC<TemplateMonogramProps> = ({
  themeId = 'jharokha',
  groomInitial,
  brideInitial,
  size = 'md',
  tone = 'gold',
  className = '',
}) => {
  const meta = getMonogramMeta(themeId);

  const gChar = (groomInitial || 'A').trim().slice(0, 2).toUpperCase();
  const bChar = (brideInitial || 'M').trim().slice(0, 2);
  const isSymbolicSecond = bChar === '★' || bChar === 'ॐ';

  const dimensions =
    size === 'sm'
      ? 'w-14 h-16'
      : size === 'lg'
        ? 'w-24 h-28'
        : size === 'xl'
          ? 'w-32 h-36'
          : 'w-[72px] h-[84px]';

  // Resolve balanced palette so every tone maintains strong luxury contrast
  let primaryStroke = meta.lightStroke;
  let secondaryAccent = meta.lightAccent;
  let letterColor = meta.lightStroke;
  let ampersandColor = meta.lightAccent;

  if (tone === 'ivory') {
    primaryStroke = '#FAF6EE';
    secondaryAccent = '#E6B86A';
    letterColor = '#FAF6EE';
    ampersandColor = '#E6B86A';
  } else if (tone === 'gold') {
    primaryStroke = meta.darkStroke;
    secondaryAccent = meta.darkAccent;
    letterColor = '#FAF6EE';
    ampersandColor = meta.darkStroke;
  } else if (tone === 'crimson') {
    primaryStroke = meta.lightStroke;
    secondaryAccent = meta.lightAccent;
    letterColor = meta.lightStroke;
    ampersandColor = meta.lightAccent;
  } else if (tone === 'theme') {
    primaryStroke = meta.lightStroke;
    secondaryAccent = meta.lightAccent;
    letterColor = meta.lightStroke;
    ampersandColor = meta.lightAccent;
  }

  const renderFrameSvg = () => {
    switch (meta.geometryKind) {
      case 'lotus':
        return (
          <>
            {/* Blooming lotus petals above & cradling base */}
            <path
              d="M70 10C76 20 82 27 79 34C74 30 70 28 70 28C70 28 66 30 61 34C58 27 64 20 70 10Z"
              stroke={primaryStroke}
              strokeWidth="1.6"
              fill={secondaryAccent}
              fillOpacity="0.14"
            />
            <path
              d="M52 24C60 22 65 28 63 35C56 34 51 31 52 24ZM88 24C80 22 75 28 77 35C84 34 89 31 88 24Z"
              stroke={secondaryAccent}
              strokeWidth="1.4"
            />
            <circle cx="70" cy="74" r="42" stroke={primaryStroke} strokeWidth="1.5" strokeOpacity="0.88" />
            <circle cx="70" cy="74" r="36" stroke={secondaryAccent} strokeWidth="0.9" strokeDasharray="2 3" />
            {/* Bottom cupped lotus petals & pond ripples */}
            <path
              d="M32 108C44 118 56 121 70 121C84 121 96 118 108 108C98 122 85 127 70 127C55 127 42 122 32 108Z"
              stroke={primaryStroke}
              strokeWidth="1.4"
              fill={primaryStroke}
              fillOpacity="0.12"
            />
            <path
              d="M42 132H98M54 137H86"
              stroke={secondaryAccent}
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </>
        );

      case 'octagon':
        return (
          <>
            {/* Paithani Chamfered Zari Octagon + Peacock Plume Curls */}
            <polygon
              points="46,16 94,16 124,46 124,102 94,132 46,132 16,102 16,46"
              stroke={primaryStroke}
              strokeWidth="2"
            />
            <polygon
              points="49,22 91,22 118,49 118,99 91,126 49,126 22,99 22,49"
              stroke={secondaryAccent}
              strokeWidth="1"
              strokeOpacity="0.8"
            />
            {/* Top peacock crown plumes */}
            <path
              d="M70 6C74 11 72 16 70 16C68 16 66 11 70 6ZM56 13C52 8 44 10 46 16M84 13C88 8 96 10 94 16"
              stroke={secondaryAccent}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Corner zari dots */}
            <circle cx="70" cy="11" r="2" fill={secondaryAccent} />
            <circle cx="70" cy="136" r="2" fill={secondaryAccent} />
          </>
        );

      case 'wreath':
        return (
          <>
            {/* Haldi marigold ring & mango leaves */}
            <circle cx="70" cy="74" r="46" stroke={primaryStroke} strokeWidth="1.5" strokeOpacity="0.7" />
            <circle cx="70" cy="74" r="39" stroke={secondaryAccent} strokeWidth="0.9" strokeDasharray="3 4" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const cx = 70 + 46 * Math.cos(rad);
              const cy = 74 + 46 * Math.sin(rad);
              return (
                <g key={deg}>
                  <circle cx={cx} cy={cy} r={deg % 90 === 0 ? 5.2 : 3.6} fill={secondaryAccent} fillOpacity="0.88" />
                  <circle cx={cx} cy={cy} r={1.8} fill={primaryStroke} />
                </g>
              );
            })}
            <path d="M58 18L70 11L82 18" stroke={primaryStroke} strokeWidth="1.5" strokeLinecap="round" />
          </>
        );

      case 'halo':
        return (
          <>
            {/* Pichwai scalloped sun-lotus halo & pillars */}
            <circle cx="70" cy="70" r="48" stroke={secondaryAccent} strokeWidth="1.2" strokeDasharray="1.5 5" />
            <path
              d="M28 124V58C28 34 46 18 70 18C94 18 112 34 112 58V124"
              stroke={primaryStroke}
              strokeWidth="1.8"
            />
            <path
              d="M35 124V60C35 40 50 25 70 25C90 25 105 40 105 60V124"
              stroke={secondaryAccent}
              strokeWidth="1.1"
            />
            <line x1="22" y1="125" x2="118" y2="125" stroke={primaryStroke} strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="70" cy="12" r="3" fill={secondaryAccent} />
          </>
        );

      case 'diamond-deco':
        return (
          <>
            {/* Sheesh Mahal faceted Art-Deco mirror star */}
            <polygon
              points="70,8 128,70 70,132 12,70"
              stroke={primaryStroke}
              strokeWidth="1.7"
            />
            <rect
              x="31"
              y="31"
              width="78"
              height="78"
              stroke={secondaryAccent}
              strokeWidth="1.1"
              strokeOpacity="0.75"
            />
            <polygon
              points="70,18 118,70 70,122 22,70"
              stroke={secondaryAccent}
              strokeWidth="0.9"
              strokeOpacity="0.85"
            />
            {/* Mirror star glint dots */}
            <circle cx="70" cy="8" r="2.2" fill={secondaryAccent} />
            <circle cx="128" cy="70" r="2.2" fill={secondaryAccent} />
            <circle cx="70" cy="132" r="2.2" fill={secondaryAccent} />
            <circle cx="12" cy="70" r="2.2" fill={secondaryAccent} />
          </>
        );

      case 'split-oval':
        return (
          <>
            {/* Ivory Swiss letterpress vertical oval & delicate jasmine stem */}
            <ellipse cx="70" cy="70" rx="42" ry="54" stroke={primaryStroke} strokeWidth="1.4" />
            <ellipse
              cx="70"
              cy="70"
              rx="36"
              ry="48"
              stroke={secondaryAccent}
              strokeWidth="0.85"
              strokeOpacity="0.7"
            />
            {/* Botanical jasmine leaves top-right & bottom-left */}
            <path
              d="M96 28C104 22 111 24 113 30C106 33 100 32 96 28ZM44 112C36 118 29 116 27 110C34 107 40 108 44 112Z"
              stroke={secondaryAccent}
              strokeWidth="1.3"
              fill={secondaryAccent}
              fillOpacity="0.16"
            />
            <line x1="48" y1="92" x2="92" y2="48" stroke={secondaryAccent} strokeWidth="0.9" strokeOpacity="0.6" />
          </>
        );

      case 'diya-arch':
        return (
          <>
            {/* Ghat crescent twilight arch + top earthen diya flame */}
            <path
              d="M70 8C70 8 76 15 76 19C76 22.3 73.3 25 70 25C66.7 25 64 22.3 64 19C64 15 70 8 70 8Z"
              fill={primaryStroke}
            />
            <path d="M58 27H82C80 31 75 33 70 33C65 33 60 31 58 27Z" stroke={primaryStroke} strokeWidth="1.4" />
            <circle cx="70" cy="78" r="41" stroke={primaryStroke} strokeWidth="1.6" />
            <path
              d="M36 105C48 99 58 99 70 105C82 111 92 111 104 105"
              stroke={secondaryAccent}
              strokeWidth="1.2"
              strokeOpacity="0.8"
            />
            <path d="M44 128H96" stroke={primaryStroke} strokeWidth="1.2" strokeLinecap="round" />
          </>
        );

      case 'hex-jaali':
        return (
          <>
            {/* Roshni Hexagon Jaali Shield + Hanging Lantern */}
            <polygon
              points="70,18 116,44 116,96 70,122 24,96 24,44"
              stroke={primaryStroke}
              strokeWidth="1.8"
            />
            <polygon
              points="70,25 109,48 109,92 70,115 31,92 31,48"
              stroke={secondaryAccent}
              strokeWidth="1"
              strokeDasharray="3 2"
            />
            {/* Hanging brass lantern teardrop */}
            <line x1="70" y1="4" x2="70" y2="18" stroke={secondaryAccent} strokeWidth="1.3" />
            <circle cx="70" cy="129" r="3" stroke={secondaryAccent} strokeWidth="1.3" />
            <line x1="70" y1="122" x2="70" y2="126" stroke={secondaryAccent} strokeWidth="1.2" />
          </>
        );

      case 'gopuram':
        return (
          <>
            {/* South Indian tiered Gopuram arch & twin temple bells */}
            <path d="M52 24H88L95 34H45L52 24Z" stroke={secondaryAccent} strokeWidth="1.3" />
            <path d="M62 12H78L84 24H56L62 12Z" stroke={primaryStroke} strokeWidth="1.4" />
            <line x1="70" y1="5" x2="70" y2="12" stroke={secondaryAccent} strokeWidth="1.6" />
            <circle cx="70" cy="5" r="2" fill={primaryStroke} />
            <path
              d="M24 126V52C24 41 34 34 45 34H95C106 34 116 41 116 52V126H24Z"
              stroke={primaryStroke}
              strokeWidth="1.8"
            />
            <path
              d="M31 120V54C31 46 38 41 47 41H93C102 41 109 46 109 54V120"
              stroke={secondaryAccent}
              strokeWidth="0.95"
            />
            {/* Swinging bells */}
            <path d="M18 52V64M122 52V64" stroke={secondaryAccent} strokeWidth="1.2" />
            <circle cx="18" cy="67" r="3" fill={secondaryAccent} />
            <circle cx="122" cy="67" r="3" fill={secondaryAccent} />
          </>
        );

      case 'rose-cameo':
        return (
          <>
            {/* Gulab oval cameo with ribbon bow at base */}
            <ellipse cx="70" cy="66" rx="42" ry="48" stroke={primaryStroke} strokeWidth="1.6" />
            <ellipse cx="70" cy="66" rx="36" ry="42" stroke={secondaryAccent} strokeWidth="1" strokeDasharray="2 3" />
            {/* Top damask rose crest */}
            <circle cx="70" cy="18" r="6" fill={secondaryAccent} fillOpacity="0.25" stroke={primaryStroke} strokeWidth="1.3" />
            <circle cx="62" cy="21" r="3.5" stroke={secondaryAccent} strokeWidth="1.1" />
            <circle cx="78" cy="21" r="3.5" stroke={secondaryAccent} strokeWidth="1.1" />
            {/* Ribbon bow at bottom */}
            <path
              d="M70 118C59 112 50 116 52 123C54 129 63 125 70 118ZM70 118C81 112 90 116 88 123C86 129 77 125 70 118ZM66 121L59 135M74 121L81 135"
              stroke={primaryStroke}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </>
        );

      case 'candle-star':
        return (
          <>
            {/* Jashn candle flame atop sunburst halo */}
            <path
              d="M70 5C70 5 74 11 74 14C74 16.5 72.2 18 70 18C67.8 18 66 16.5 66 14C66 11 70 5 70 5Z"
              fill={primaryStroke}
            />
            <rect x="68" y="19" width="4" height="9" rx="1" stroke={secondaryAccent} strokeWidth="1.2" />
            <circle cx="70" cy="78" r="44" stroke={primaryStroke} strokeWidth="1.6" />
            <circle cx="70" cy="78" r="38" stroke={secondaryAccent} strokeWidth="0.9" />
            {[30, 90, 150, 210, 270, 330].map((deg) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 70 + 44 * Math.cos(rad);
              const y1 = 78 + 44 * Math.sin(rad);
              const x2 = 70 + 51 * Math.cos(rad);
              const y2 = 78 + 51 * Math.sin(rad);
              return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke={secondaryAccent} strokeWidth="1.4" strokeLinecap="round" />;
            })}
          </>
        );

      case 'gift-tag':
        return (
          <>
            {/* Keepsake Tag chamfered corners & grommet */}
            <polygon
              points="40,16 100,16 116,32 116,120 100,132 40,132 24,120 24,32"
              stroke={primaryStroke}
              strokeWidth="1.8"
            />
            <polygon
              points="43,22 97,22 110,35 110,117 97,126 43,126 30,117 30,35"
              stroke={secondaryAccent}
              strokeWidth="1"
            />
            <circle cx="70" cy="29" r="3.5" stroke={primaryStroke} strokeWidth="1.4" />
            <path d="M62 11C66 6 74 6 78 11" stroke={secondaryAccent} strokeWidth="1.3" strokeLinecap="round" />
          </>
        );

      case 'palna':
        return (
          <>
            {/* Painted Sankheda nursery arch & twin ghungroos */}
            <path
              d="M26 122V56C26 31 46 16 70 16C94 16 114 31 114 56V122"
              stroke={primaryStroke}
              strokeWidth="2"
            />
            <path
              d="M33 118V58C33 38 49 23 70 23C91 23 107 38 107 58V118"
              stroke={secondaryAccent}
              strokeWidth="1.1"
              strokeDasharray="3 2"
            />
            {/* Hanging cradle arc */}
            <path d="M40 123C55 133 85 133 100 123" stroke={primaryStroke} strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="48" cy="128" r="3" fill={secondaryAccent} />
            <circle cx="70" cy="131" r="3.5" fill={primaryStroke} />
            <circle cx="92" cy="128" r="3" fill={secondaryAccent} />
          </>
        );

      case 'crescent':
        return (
          <>
            {/* Chanda Mama Crescent Moon & Starry Ring */}
            <circle cx="70" cy="74" r="44" stroke={primaryStroke} strokeWidth="1.5" strokeOpacity="0.85" />
            <path
              d="M78 16C68 18 62 27 65 36C68 43 76 47 84 44C77 45 71 40 70 33C69 26 73 20 78 16Z"
              fill={primaryStroke}
            />
            {/* Constellations */}
            <path d="M32 34L34 39L39 41L34 43L32 48L30 43L25 41L30 39Z" fill={secondaryAccent} />
            <path d="M108 42L109.5 46L113.5 47.5L109.5 49L108 53L106.5 49L102.5 47.5L106.5 46Z" fill={primaryStroke} />
            <circle cx="70" cy="126" r="2.2" fill={secondaryAccent} />
            <path d="M44 123H96" stroke={secondaryAccent} strokeWidth="1" strokeOpacity="0.65" />
          </>
        );

      case 'flute-feather':
        return (
          <>
            {/* Baal Gopal Peacock Feather Oval + Diagonal Bansuri */}
            <ellipse cx="70" cy="70" rx="40" ry="50" stroke={primaryStroke} strokeWidth="1.6" />
            <ellipse cx="70" cy="70" rx="33" ry="43" stroke={secondaryAccent} strokeWidth="1" strokeOpacity="0.85" />
            {/* Peacock feather crown eye */}
            <ellipse cx="70" cy="22" rx="11" ry="7" stroke={secondaryAccent} strokeWidth="1.3" fill={primaryStroke} fillOpacity="0.16" />
            <circle cx="70" cy="22" r="3" fill={primaryStroke} />
            {/* Golden Bansuri across bottom */}
            <line x1="26" y1="122" x2="114" y2="110" stroke={secondaryAccent} strokeWidth="3.2" strokeLinecap="round" />
            <circle cx="54" cy="118" r="1.2" fill={primaryStroke} />
            <circle cx="66" cy="116.5" r="1.2" fill={primaryStroke} />
            <circle cx="78" cy="115" r="1.2" fill={primaryStroke} />
          </>
        );

      case 'kalash':
        return (
          <>
            {/* Shubh Aarti Purna Kalash frame */}
            <path d="M56 26C60 15 80 15 84 26" stroke={secondaryAccent} strokeWidth="1.6" />
            <path d="M48 25L60 31M92 25L80 31M70 10V22" stroke={primaryStroke} strokeWidth="1.5" strokeLinecap="round" />
            <path
              d="M52 34H88L82 44C98 52 110 70 106 94C102 116 86 128 70 128C54 128 38 116 34 94C30 70 42 52 58 44L52 34Z"
              stroke={primaryStroke}
              strokeWidth="1.8"
            />
            <path d="M44 132H96" stroke={secondaryAccent} strokeWidth="1.5" strokeLinecap="round" />
          </>
        );

      case 'rangoli':
        return (
          <>
            {/* 12-petal dotted Rangoli wheel */}
            <circle cx="70" cy="70" r="46" stroke={primaryStroke} strokeWidth="1.5" />
            <circle cx="70" cy="70" r="36" stroke={secondaryAccent} strokeWidth="1" />
            {[...Array(12)].map((_, i) => {
              const rad = ((i * 30) * Math.PI) / 180;
              const px = 70 + 52 * Math.cos(rad);
              const py = 70 + 52 * Math.sin(rad);
              return <circle key={i} cx={px} cy={py} r={i % 2 === 0 ? 3 : 2} fill={i % 2 === 0 ? primaryStroke : secondaryAccent} />;
            })}
          </>
        );

      case 'payal-arch':
        return (
          <>
            {/* Ladli Kanya gota diamond & hanging payal bells */}
            <path
              d="M28 116V58C28 36 48 20 70 12C92 20 112 36 112 58V116"
              stroke={primaryStroke}
              strokeWidth="1.7"
            />
            <path
              d="M35 112V60C35 42 52 28 70 21C88 28 105 42 105 60V112"
              stroke={secondaryAccent}
              strokeWidth="1"
            />
            {/* Hanging payal pearls */}
            <path d="M36 116C52 126 88 126 104 116" stroke={secondaryAccent} strokeWidth="1.3" />
            {[46, 58, 70, 82, 94].map((x, idx) => (
              <g key={x}>
                <line x1={x} y1="122" x2={x} y2={idx === 2 ? 131 : 128} stroke={secondaryAccent} strokeWidth="1" />
                <circle cx={x} cy={idx === 2 ? 133 : 129.5} r={idx === 2 ? 2.6 : 2} fill={primaryStroke} />
              </g>
            ))}
          </>
        );

      case 'thali':
        return (
          <>
            {/* Devi Kumkum Brass Thali Ring + Mogra Buds + Tilak */}
            <circle cx="70" cy="72" r="46" stroke={primaryStroke} strokeWidth="2.2" />
            <circle cx="70" cy="72" r="40" stroke={secondaryAccent} strokeWidth="1" />
            {[...Array(16)].map((_, i) => {
              const rad = ((i * 22.5) * Math.PI) / 180;
              const bx = 70 + 49 * Math.cos(rad);
              const by = 72 + 49 * Math.sin(rad);
              return <circle key={i} cx={bx} cy={by} r="1.8" fill={secondaryAccent} />;
            })}
            {/* Crimson Kumkum Tilak drop at crown */}
            <path d="M70 9C73 14 73 19 70 21C67 19 67 14 70 9Z" fill={primaryStroke} />
          </>
        );

      case 'chhatri':
        return (
          <>
            {/* Gulab Baisa Jaipur Chhatri Dome & Pearl Latkans */}
            <path
              d="M26 124V56C26 42 40 32 52 24C60 18 66 12 70 7C74 12 80 18 88 24C100 32 114 42 114 56V124"
              stroke={primaryStroke}
              strokeWidth="1.8"
            />
            <line x1="20" y1="54" x2="120" y2="54" stroke={secondaryAccent} strokeWidth="1.1" strokeOpacity="0.65" />
            <circle cx="24" cy="64" r="2.2" fill={secondaryAccent} />
            <circle cx="116" cy="64" r="2.2" fill={secondaryAccent} />
            <path d="M40 124H100" stroke={secondaryAccent} strokeWidth="1.4" />
          </>
        );

      case 'matki':
        return (
          <>
            {/* Kanha Makhan Handi Silhouette */}
            <path d="M40 18Q70 30 100 18" stroke={secondaryAccent} strokeWidth="1.5" />
            <path
              d="M54 34H86L81 42C98 48 108 66 106 88C104 110 88 124 70 124C52 124 36 110 34 88C32 66 42 48 59 42L54 34Z"
              stroke={primaryStroke}
              strokeWidth="1.9"
            />
            <path d="M36 86Q70 98 104 86" stroke={secondaryAccent} strokeWidth="1.1" strokeDasharray="3 3" />
          </>
        );

      case 'surya':
        return (
          <>
            {/* Veer Balak 16-Ray Surya Sunburst Shield */}
            <circle cx="70" cy="70" r="39" stroke={primaryStroke} strokeWidth="1.8" />
            <circle cx="70" cy="70" r="33" stroke={secondaryAccent} strokeWidth="1" />
            {[...Array(16)].map((_, i) => {
              const rad = ((i * 22.5) * Math.PI) / 180;
              const r1 = 41;
              const r2 = i % 2 === 0 ? 56 : 49;
              return (
                <line
                  key={i}
                  x1={70 + r1 * Math.cos(rad)}
                  y1={70 + r1 * Math.sin(rad)}
                  x2={70 + r2 * Math.cos(rad)}
                  y2={70 + r2 * Math.sin(rad)}
                  stroke={i % 2 === 0 ? primaryStroke : secondaryAccent}
                  strokeWidth={i % 2 === 0 ? '2' : '1.2'}
                  strokeLinecap="round"
                />
              );
            })}
          </>
        );

      case 'modak-arch':
        return (
          <>
            {/* Ganesh Aashish Modak Finial & Temple Bells Arch */}
            <path
              d="M70 7C75 14 80 20 80 24C80 28 75 30 70 30C65 30 60 28 60 24C60 20 65 14 70 7Z"
              stroke={secondaryAccent}
              strokeWidth="1.5"
              fill={secondaryAccent}
              fillOpacity="0.18"
            />
            <path
              d="M24 128V62C24 44 42 32 70 32C98 32 116 44 116 62V128H24Z"
              stroke={primaryStroke}
              strokeWidth="1.8"
            />
            <path d="M32 121V64C32 50 48 40 70 40C92 40 108 50 108 64V121" stroke={secondaryAccent} strokeWidth="1" />
          </>
        );

      case 'signet':
        return (
          <>
            {/* Kohinoor Imperial Bevelled Signet Crest */}
            <polygon
              points="46,20 94,20 120,46 120,96 94,124 46,124 20,96 20,46"
              stroke={secondaryAccent}
              strokeWidth="2.1"
            />
            <polygon
              points="49,26 91,26 113,49 113,93 91,118 49,118 27,93 27,49"
              stroke={primaryStroke}
              strokeWidth="1"
            />
            {/* Royal Crown 3-point Finial */}
            <path
              d="M54 18L60 8L70 14L80 8L86 18Z"
              stroke={secondaryAccent}
              strokeWidth="1.4"
              fill={secondaryAccent}
              fillOpacity="0.22"
            />
          </>
        );

      case 'shikhar':
        return (
          <>
            {/* Vrindavan Double-Cusp Braj Mandir & Jasmine Buds */}
            <path
              d="M24 128V60C24 46 36 42 40 32C46 22 60 19 70 10C80 19 94 22 100 32C104 42 116 46 116 60V128"
              stroke={primaryStroke}
              strokeWidth="1.9"
            />
            <path
              d="M32 128V62C32 51 42 48 46 39C51 30 62 28 70 20C78 28 89 30 94 39C98 48 108 51 108 62V128"
              stroke={secondaryAccent}
              strokeWidth="1"
            />
            <circle cx="70" cy="6" r="2.5" fill={secondaryAccent} />
            <circle cx="24" cy="131" r="2.5" fill={secondaryAccent} />
            <circle cx="116" cy="131" r="2.5" fill={secondaryAccent} />
          </>
        );

      case 'bandhani-diamond':
        return (
          <>
            {/* Kesariya Tilted Bandhani Diamond & Dotted Tie-Dye Border */}
            <polygon points="70,12 128,70 70,128 12,70" stroke={primaryStroke} strokeWidth="2" />
            <polygon
              points="70,22 118,70 70,118 22,70"
              stroke={secondaryAccent}
              strokeWidth="1.2"
              strokeDasharray="2 3"
            />
            {/* Corner Bandhani dots */}
            <circle cx="70" cy="12" r="3" fill={secondaryAccent} />
            <circle cx="128" cy="70" r="3" fill={secondaryAccent} />
            <circle cx="70" cy="128" r="3" fill={secondaryAccent} />
            <circle cx="12" cy="70" r="3" fill={secondaryAccent} />
          </>
        );

      case 'kolam':
        return (
          <>
            {/* Pattu Zari Interlaced Tamil Kolam Frame */}
            <rect x="26" y="26" width="88" height="88" rx="18" stroke={primaryStroke} strokeWidth="1.7" />
            <rect
              x="26"
              y="26"
              width="88"
              height="88"
              rx="18"
              transform="rotate(45 70 70)"
              stroke={secondaryAccent}
              strokeWidth="1.3"
            />
            <circle cx="70" cy="14" r="2.2" fill={primaryStroke} />
            <circle cx="70" cy="126" r="2.2" fill={primaryStroke} />
            <circle cx="14" cy="70" r="2.2" fill={primaryStroke} />
            <circle cx="126" cy="70" r="2.2" fill={primaryStroke} />
          </>
        );

      case 'rub-el-hizb':
        return (
          <>
            {/* Mehr 8-Point Rub-el-Hizb Geometric Star */}
            <rect x="30" y="30" width="80" height="80" stroke={primaryStroke} strokeWidth="1.6" />
            <rect
              x="30"
              y="30"
              width="80"
              height="80"
              transform="rotate(45 70 70)"
              stroke={secondaryAccent}
              strokeWidth="1.5"
            />
            <circle cx="70" cy="70" r="33" stroke={secondaryAccent} strokeWidth="0.9" strokeOpacity="0.65" />
            {/* Hanging pearl drop */}
            <line x1="70" y1="126" x2="70" y2="133" stroke={secondaryAccent} strokeWidth="1.2" />
            <circle cx="70" cy="135" r="2.2" fill={primaryStroke} />
          </>
        );

      case 'kalgi-oval':
        return (
          <>
            {/* Kalgi Sovereign Sarpech Plume & Anand Karaj Oval */}
            <path
              d="M70 4C79 9 84 19 77 26C73 22 70 20 70 20C70 20 67 22 63 26C56 19 61 9 70 4Z"
              stroke={secondaryAccent}
              strokeWidth="1.4"
              fill={secondaryAccent}
              fillOpacity="0.2"
            />
            <path d="M58 17C53 12 45 14 48 22M82 17C87 12 95 14 92 22" stroke={primaryStroke} strokeWidth="1.3" strokeLinecap="round" />
            <ellipse cx="70" cy="78" rx="42" ry="48" stroke={primaryStroke} strokeWidth="1.8" />
            <ellipse cx="70" cy="78" rx="35" ry="41" stroke={secondaryAccent} strokeWidth="1" />
          </>
        );

      case 'olive-arch':
        return (
          <>
            {/* Bellissimo Mediterranean Arch & Olive/Bougainvillea Sprig */}
            <path
              d="M28 126V60C28 36 46 20 70 20C94 20 112 36 112 60V126"
              stroke={primaryStroke}
              strokeWidth="1.5"
            />
            <path d="M22 126H118" stroke={secondaryAccent} strokeWidth="1.2" strokeLinecap="round" />
            {/* Olive leaf sprig on left arch */}
            <path
              d="M28 52C20 45 20 35 28 30C33 37 33 46 28 52ZM112 52C120 45 120 35 112 30C107 37 107 46 112 52Z"
              stroke={secondaryAccent}
              strokeWidth="1.3"
              fill={secondaryAccent}
              fillOpacity="0.2"
            />
            <circle cx="70" cy="14" r="3" fill={primaryStroke} />
          </>
        );

      case 'jharokha':
      default:
        return (
          <>
            {/* Classic Mewar Cusped Jharokha Portal */}
            <path
              d="M20 130V58C20 48 28 44 28 36C28 28 38 25 42 18C47 10 61 10 70 4C79 10 93 10 98 18C102 25 112 28 112 36C112 44 120 48 120 58V130H20Z"
              stroke={primaryStroke}
              strokeWidth="1.8"
            />
            <path
              d="M28 122V60C28 52 35 48 35 41C35 34 44 31 48 25C52 18 63 18 70 13C77 18 88 18 92 25C96 31 105 34 105 41C105 48 112 52 112 60V122H28Z"
              stroke={secondaryAccent}
              strokeWidth="0.95"
              strokeOpacity="0.75"
            />
            <circle cx="70" cy="4" r="2.4" fill={secondaryAccent} />
            <path d="M50 130H90M64 135H76" stroke={secondaryAccent} strokeWidth="1.3" strokeLinecap="round" />
          </>
        );
    }
  };

  // Typography composition customized per monogram layout (sized cleanly inside inner SVG frame)
  const mainTextSize =
    size === 'sm'
      ? 'text-[9.5px]'
      : size === 'xl'
        ? 'text-[24px]'
        : size === 'lg'
          ? 'text-[19px]'
          : 'text-[13px]';

  const stackedTextSize =
    size === 'sm'
      ? 'text-[9px]'
      : size === 'xl'
        ? 'text-[22px]'
        : size === 'lg'
          ? 'text-[17px]'
          : 'text-[11.5px]';

  const renderInitials = () => {
    // Celebrant + Om / Star layout (single primary celebrant monogram)
    if (isSymbolicSecond) {
      return (
        <div className="flex flex-col items-center justify-center leading-none pt-1">
          <span
            style={{ color: letterColor }}
            className={`${meta.fontClass} font-semibold tracking-wider ${
              size === 'sm'
                ? 'text-[14px]'
                : size === 'xl'
                  ? 'text-[34px]'
                  : size === 'lg'
                    ? 'text-[26px]'
                    : 'text-[18px]'
            }`}
          >
            {gChar}
          </span>
          <span
            style={{ color: ampersandColor }}
            className={`mt-0.5 ${
              size === 'sm' ? 'text-[8px]' : size === 'lg' || size === 'xl' ? 'text-[12px]' : 'text-[9.5px]'
            }`}
          >
            {bChar}
          </span>
        </div>
      );
    }

    switch (meta.layout) {
      case 'stacked':
        return (
          <div className={`flex flex-col items-center justify-center leading-[0.9] pt-1 ${meta.fontClass}`}>
            <span style={{ color: letterColor }} className={`${stackedTextSize} font-semibold`}>
              {gChar}
            </span>
            <span
              style={{ color: ampersandColor }}
              className={`italic my-[1px] ${
                size === 'sm' ? 'text-[7px]' : size === 'lg' || size === 'xl' ? 'text-[11px]' : 'text-[8.5px]'
              }`}
            >
              &amp;
            </span>
            <span style={{ color: letterColor }} className={`${stackedTextSize} font-semibold`}>
              {bChar}
            </span>
          </div>
        );

      case 'diagonal-split':
        return (
          <div className={`relative flex items-center justify-center ${meta.fontClass} pt-0.5`}>
            <span
              style={{ color: letterColor }}
              className={`${stackedTextSize} font-semibold -translate-y-1.5 -translate-x-0.5`}
            >
              {gChar}
            </span>
            <span
              style={{ color: ampersandColor }}
              className={`mx-0.5 opacity-80 ${
                size === 'sm' ? 'text-[10px]' : size === 'xl' ? 'text-[24px]' : size === 'lg' ? 'text-[19px]' : 'text-[13px]'
              }`}
            >
              /
            </span>
            <span
              style={{ color: letterColor }}
              className={`${stackedTextSize} font-semibold translate-y-1.5 translate-x-0.5`}
            >
              {bChar}
            </span>
          </div>
        );

      case 'interlocked':
        return (
          <div className={`relative flex items-center justify-center ${meta.fontClass} pt-1`}>
            <span
              style={{ color: letterColor }}
              className={`${mainTextSize} font-semibold -translate-y-0.5`}
            >
              {gChar}
            </span>
            <span
              style={{ color: ampersandColor }}
              className={`italic -mx-0.5 opacity-85 ${
                size === 'sm' ? 'text-[8px]' : size === 'xl' ? 'text-[15px]' : size === 'lg' ? 'text-[12px]' : 'text-[9px]'
              }`}
            >
              &amp;
            </span>
            <span
              style={{ color: letterColor }}
              className={`${mainTextSize} font-semibold translate-y-1`}
            >
              {bChar}
            </span>
          </div>
        );

      case 'orbital-crown':
        return (
          <div className={`flex items-baseline justify-center ${meta.fontClass} pt-1.5 tracking-wide`}>
            <span style={{ color: letterColor }} className={`${mainTextSize} font-semibold`}>
              {gChar}
            </span>
            <span
              style={{ color: ampersandColor }}
              className="mx-[2px] text-[0.7em] font-display italic opacity-90"
            >
              ·
            </span>
            <span style={{ color: letterColor }} className={`${mainTextSize} font-semibold`}>
              {bChar}
            </span>
          </div>
        );

      case 'inline-serif':
      default:
        return (
          <div className={`flex items-center justify-center ${meta.fontClass} pt-1.5 tracking-normal`}>
            <span style={{ color: letterColor }} className={`${mainTextSize} font-semibold leading-none`}>
              {gChar}
            </span>
            <span
              style={{ color: ampersandColor }}
              className="mx-[2px] text-[0.68em] opacity-85 font-display italic leading-none"
            >
              &amp;
            </span>
            <span style={{ color: letterColor }} className={`${mainTextSize} font-semibold leading-none`}>
              {bChar}
            </span>
          </div>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center ${dimensions} select-none ${className}`}
      title={meta.styleName}
    >
      <svg
        viewBox="0 0 140 140"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-hidden="true"
      >
        {renderFrameSvg()}
      </svg>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-[22%] pt-[6%]">
        {renderInitials()}
      </div>
    </div>
  );
};
