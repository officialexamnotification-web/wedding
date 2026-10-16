export interface StickerDefinition {
  id: string;
  name: string;
  category: 'religious' | 'wedding' | 'festive' | 'borders' | 'dividers';
  svg: string;
  defaultWidth: number;
  defaultHeight: number;
  defaultColor: string;
}

export const STICKER_CATEGORIES = [
  { id: 'all', label: 'All Graphics' },
  { id: 'religious', label: 'Sacred & Vedic' },
  { id: 'wedding', label: 'Shubh Vivah' },
  { id: 'festive', label: 'Festive & Music' },
  { id: 'borders', label: 'Frames & Corners' },
  { id: 'dividers', label: 'Mandalas & Dividers' },
] as const;

export const STICKERS: StickerDefinition[] = [
  // 1. Shri Ganesha Royal Seal (Detailed Multi-Layered Temple Crest)
  {
    id: 'ganesha-royal',
    name: 'Shri Ganesha Crest (श्री गणेश)',
    category: 'religious',
    defaultWidth: 96,
    defaultHeight: 104,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 120 130" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Sacred Aura Ring -->
      <circle cx="60" cy="62" r="52" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3" opacity="0.55" />
      <circle cx="60" cy="62" r="46" stroke="currentColor" stroke-width="1.8" opacity="0.85" />
      <!-- 8 Aura Petals around Halo -->
      <path d="M60 4 L64 12 L56 12 Z" fill="currentColor" />
      <path d="M116 62 L108 66 L108 58 Z" fill="currentColor" />
      <path d="M4 62 L12 66 L12 58 Z" fill="currentColor" />
      <!-- Royal Mukut (Three-Tiered Crown) -->
      <path d="M60 14 L51 30 H69 L60 14 Z" fill="currentColor" />
      <path d="M46 31 C46 27 74 27 74 31 L77 37 H43 L46 31 Z" fill="currentColor" />
      <circle cx="60" cy="12" r="2.8" fill="#FFF3A8" />
      <circle cx="60" cy="24" r="2.2" fill="#800020" />
      <circle cx="52" cy="34" r="1.8" fill="#FFF3A8" />
      <circle cx="60" cy="34" r="2.2" fill="#FFF3A8" />
      <circle cx="68" cy="34" r="1.8" fill="#FFF3A8" />
      <!-- Auspicious Ears -->
      <path d="M42 40 C26 38 19 48 22 61 C24 70 34 73 41 68 C36 63 32 56 33 49 C34 43 38 41 42 40 Z" fill="currentColor" opacity="0.92" />
      <path d="M78 40 C94 38 101 48 98 61 C96 70 86 73 79 68 C84 63 88 56 87 49 C86 43 82 41 78 40 Z" fill="currentColor" opacity="0.92" />
      <!-- Forehead Tilak & Trishul -->
      <path d="M52 45 Q60 49 68 45" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M54 49 Q60 53 66 49" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <circle cx="60" cy="43" r="2.5" fill="#C41E3A" />
      <!-- Serene Eyes -->
      <path d="M45 54 Q49 51 53 54" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M67 54 Q71 51 75 54" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <!-- Graceful Vakratunda Trunk & Ekadanta Tusk -->
      <path d="M68 64 L76 62 L69 68 Z" fill="#FFF3A8" />
      <path d="M55 56 C55 68 53 80 48 90 C44 98 35 100 31 94 C28 89 32 83 38 85 C41 86 41 90 38 91" stroke="currentColor" stroke-width="5.5" stroke-linecap="round" fill="none" />
      <!-- Golden Laddu / Modak -->
      <circle cx="35" cy="86" r="4.5" fill="#FFD700" stroke="#800020" stroke-width="1" />
      <!-- Padmasana Lotus Base -->
      <path d="M60 102 C53 108 46 114 60 122 C74 114 67 108 60 102 Z" fill="currentColor" />
      <path d="M58 108 C44 106 34 112 42 120 C48 122 55 121 59 120 Z" fill="currentColor" opacity="0.85" />
      <path d="M62 108 C76 106 86 112 78 120 C72 122 65 121 61 120 Z" fill="currentColor" opacity="0.85" />
      <path d="M26 122 Q60 128 94 122" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
    </svg>`,
  },

  // 2. Manglik Purnakumbha Kalash (Detailed Brass Pot, Coconut, Mango Leaves & Swastik)
  {
    id: 'manglik-kalash',
    name: 'Manglik Kalash (मंगल कलश)',
    category: 'religious',
    defaultWidth: 88,
    defaultHeight: 100,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 110 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Sacred Shriphal Coconut -->
      <path d="M55 8 C47 12 43 22 45 32 C47 38 51 42 55 44 C59 42 63 38 65 32 C67 22 63 12 55 8 Z" fill="currentColor" />
      <path d="M55 3 L55 9 M51 6 L59 6" stroke="#FFF3A8" stroke-width="2" stroke-linecap="round" />
      <!-- 5 Auspicious Mango Leaves (Panch Pallav) -->
      <path d="M48 39 C36 30 20 26 10 34 C18 44 34 48 47 44 Z" fill="currentColor" opacity="0.9" />
      <path d="M62 39 C74 30 90 26 100 34 C92 44 76 48 63 44 Z" fill="currentColor" opacity="0.9" />
      <path d="M50 36 C42 22 30 16 18 18 C22 30 34 38 48 41 Z" fill="currentColor" opacity="0.75" />
      <path d="M60 36 C68 22 80 16 92 18 C88 30 76 38 62 41 Z" fill="currentColor" opacity="0.75" />
      <!-- Kalash Neck & Sacred Red Thread (Moli) -->
      <rect x="35" y="42" width="40" height="6" rx="3" fill="#FFF3A8" stroke="currentColor" stroke-width="1.5" />
      <path d="M39 48 H71 L68 55 H42 L39 48 Z" fill="#C41E3A" />
      <!-- Engraved Brass Kalash Body -->
      <path d="M40 55 C24 62 18 78 22 92 C26 104 38 110 55 110 C72 110 84 104 88 92 C92 78 86 62 70 55 H40 Z" fill="currentColor" />
      <!-- Decorative Carvings on Pot -->
      <path d="M25 72 Q55 80 85 72" stroke="#1a0408" stroke-width="1.5" opacity="0.5" />
      <path d="M25 92 Q55 100 85 92" stroke="#1a0408" stroke-width="1.5" opacity="0.5" />
      <!-- Auspicious Kumkum Swastik on Belly -->
      <g stroke="#800020" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
        <path d="M55 72 V92 M45 82 H65" />
        <path d="M55 72 H65 M65 82 V92 M55 92 H45 M45 82 V72" />
      </g>
      <circle cx="50" cy="77" r="1.5" fill="#800020" />
      <circle cx="60" cy="77" r="1.5" fill="#800020" />
      <circle cx="50" cy="87" r="1.5" fill="#800020" />
      <circle cx="60" cy="87" r="1.5" fill="#800020" />
      <!-- Lotus Pedestal Base -->
      <path d="M34 110 H76 L80 116 H30 L34 110 Z" fill="#FFF3A8" stroke="currentColor" stroke-width="1.2" />
    </svg>`,
  },

  // 3. Sacred Om Mandala Medallion (ॐकार चक्र)
  {
    id: 'sacred-om',
    name: 'Sacred Om Medallion (ॐकार)',
    category: 'religious',
    defaultWidth: 84,
    defaultHeight: 84,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Sunburst Medallion Ring -->
      <circle cx="55" cy="55" r="49" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 3" />
      <circle cx="55" cy="55" r="43" stroke="currentColor" stroke-width="2" />
      <circle cx="55" cy="55" r="39" stroke="currentColor" stroke-width="0.8" opacity="0.6" />
      <!-- Fine Devanagari Om Calligraphy -->
      <path d="M38 40 C38 30 47 25 56 27 C64 29 68 36 65 43 C63 49 57 52 50 54 C60 55 69 61 68 72 C67 83 56 89 44 86 C34 84 29 75 31 68 C32 64 36 64 38 67 C40 70 43 76 49 77 C56 78 60 73 60 68 C60 61 53 58 45 58 H42 V52 H46 C53 52 58 48 57 42 C56 36 51 33 45 34 C41 35 38 38 38 40 Z" fill="currentColor" />
      <path d="M56 53 C65 50 77 53 81 62 C85 70 82 80 76 86 C73 88 70 85 72 82 C76 77 77 69 74 63 C70 57 62 56 55 58 Z" fill="currentColor" />
      <path d="M56 26 C64 29 73 29 80 24 C74 33 62 33 56 26 Z" fill="currentColor" />
      <circle cx="69" cy="19" r="4" fill="#FFF3A8" stroke="currentColor" stroke-width="1.5" />
    </svg>`,
  },

  // 4. Shubh Swastik Royal Crest (शुभ स्वस्तिक)
  {
    id: 'sacred-swastik',
    name: 'Shubh Swastik Seal (शुभ स्वस्तिक)',
    category: 'religious',
    defaultWidth: 78,
    defaultHeight: 78,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Octagonal Gold Frame -->
      <polygon points="30,6 70,6 94,30 94,70 70,94 30,94 6,70 6,30" stroke="currentColor" stroke-width="2" fill="rgba(212,175,55,0.08)" />
      <polygon points="33,11 67,11 89,33 89,67 67,89 33,89 11,67 11,33" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2" opacity="0.7" />
      <!-- Curved Calligraphic Swastik -->
      <path d="M50 22 V78 M22 50 H78" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" />
      <path d="M50 22 H76 M78 50 V76 M50 78 H24 M22 50 V24" stroke="currentColor" stroke-width="6.5" stroke-linecap="round" />
      <!-- 4 Auspicious Bindus -->
      <circle cx="36" cy="36" r="4" fill="#FFF3A8" />
      <circle cx="64" cy="36" r="4" fill="#FFF3A8" />
      <circle cx="36" cy="64" r="4" fill="#FFF3A8" />
      <circle cx="64" cy="64" r="4" fill="#FFF3A8" />
    </svg>`,
  },

  // 5. Royal Jharokha Palace Arch (राजस्थानी झरोखा मेहराब)
  {
    id: 'royal-arch-frame',
    name: 'Rajasthani Jharokha Arch (झरोखा)',
    category: 'borders',
    defaultWidth: 230,
    defaultHeight: 300,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 220 290" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Palace Frame -->
      <rect x="6" y="6" width="208" height="278" rx="10" stroke="currentColor" stroke-width="2.5" />
      <rect x="13" y="13" width="194" height="264" rx="7" stroke="currentColor" stroke-width="1" stroke-dasharray="4 3" opacity="0.75" />
      <!-- Multi-foil Cusped Mughal/Rajput Arch -->
      <path d="M22 270 V115 C22 92 38 78 52 72 C56 54 74 44 90 40 C98 28 106 20 110 14 C114 20 122 28 130 40 C146 44 164 54 168 72 C182 78 198 92 198 115 V270" stroke="currentColor" stroke-width="3" />
      <!-- Inner Parallel Arch Line -->
      <path d="M29 266 V118 C29 98 43 85 57 79 C61 62 77 52 93 48 C100 37 107 30 110 25 C113 30 120 37 127 48 C143 52 159 62 163 79 C177 85 191 98 191 118 V266" stroke="currentColor" stroke-width="1.2" opacity="0.75" />
      <!-- Carved Spandrel Lotus Rosettes in Top Corners -->
      <circle cx="42" cy="42" r="12" stroke="currentColor" stroke-width="1.5" />
      <circle cx="42" cy="42" r="5" fill="currentColor" />
      <circle cx="178" cy="42" r="12" stroke="currentColor" stroke-width="1.5" />
      <circle cx="178" cy="42" r="5" fill="currentColor" />
      <!-- Hanging Jhumka Lanterns from Arch Cusps -->
      <line x1="110" y1="25" x2="110" y2="48" stroke="currentColor" stroke-width="1.5" />
      <path d="M104 48 H116 L113 55 H107 Z" fill="currentColor" />
      <circle cx="110" cy="59" r="2.5" fill="#FFF3A8" />
      <!-- Pillar Bases -->
      <rect x="18" y="266" width="16" height="8" rx="2" fill="currentColor" />
      <rect x="186" y="266" width="16" height="8" rx="2" fill="currentColor" />
    </svg>`,
  },

  // 6. Grand Suryavanshi Mandala Medallion (सूर्यवंशी राजसी चक्र)
  {
    id: 'ornate-mandala',
    name: 'Royal Palace Mandala (राजसी चक्र)',
    category: 'dividers',
    defaultWidth: 120,
    defaultHeight: 120,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Beaded Ring -->
      <circle cx="70" cy="70" r="64" stroke="currentColor" stroke-width="1.2" stroke-dasharray="2 4" />
      <circle cx="70" cy="70" r="58" stroke="currentColor" stroke-width="2" />
      <!-- 12 Lotus Petals Ring -->
      <g stroke="currentColor" stroke-width="1.6" fill="rgba(212,175,55,0.12)">
        <path d="M70 12 C62 26 62 38 70 46 C78 38 78 26 70 12 Z" />
        <path d="M70 128 C62 114 62 102 70 94 C78 102 78 114 70 128 Z" />
        <path d="M12 70 C26 62 38 62 46 70 C38 78 26 78 12 70 Z" />
        <path d="M128 70 C114 62 102 62 94 70 C102 78 114 78 128 70 Z" />
        <path d="M29 29 C36 43 44 50 53 53 C50 44 43 36 29 29 Z" />
        <path d="M111 111 C104 97 96 90 87 87 C90 96 97 104 111 111 Z" />
        <path d="M111 29 C97 36 90 44 87 53 C96 50 104 43 111 29 Z" />
        <path d="M29 111 C43 104 50 96 53 87 C44 90 36 97 29 111 Z" />
      </g>
      <!-- Inner Filigree Rings -->
      <circle cx="70" cy="70" r="36" stroke="currentColor" stroke-width="1.8" />
      <circle cx="70" cy="70" r="28" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" />
      <circle cx="70" cy="70" r="18" stroke="currentColor" stroke-width="2" fill="rgba(212,175,55,0.2)" />
      <circle cx="70" cy="70" r="7" fill="currentColor" />
      <circle cx="70" cy="70" r="3" fill="#FFF3A8" />
    </svg>`,
  },

  // 7. Royal Filigree Chandelier Divider (शाही झूमर डिवाइडर)
  {
    id: 'gold-divider',
    name: 'Royal Lotus Divider (शाही डिवाइडर)',
    category: 'dividers',
    defaultWidth: 240,
    defaultHeight: 42,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 260 46" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Main Horizontal Tapering Lines -->
      <path d="M6 23 H98 M162 23 H254" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
      <path d="M24 18 H90 M170 18 H236" stroke="currentColor" stroke-width="1" opacity="0.65" />
      <path d="M24 28 H90 M170 28 H236" stroke="currentColor" stroke-width="1" opacity="0.65" />
      <!-- Center Lotus & Diamond Medallion -->
      <path d="M130 5 L144 23 L130 41 L116 23 Z" fill="currentColor" />
      <path d="M130 10 L139 23 L130 36 L121 23 Z" fill="#1a0408" />
      <circle cx="130" cy="23" r="4" fill="#FFF3A8" />
      <!-- Side Scroll Curls -->
      <path d="M114 23 C106 11 94 11 90 19 C87 25 93 30 98 26" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <path d="M146 23 C154 11 166 11 170 19 C173 25 167 30 162 26" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <!-- End Finial Diamonds -->
      <polygon points="6,23 13,18 20,23 13,28" fill="currentColor" />
      <polygon points="254,23 247,18 240,23 247,28" fill="currentColor" />
    </svg>`,
  },

  // 8. Royal Baroque Corner Filigree (शाही कोना नक्काशी)
  {
    id: 'floral-corner',
    name: 'Palace Corner Ornament (शाही कोना)',
    category: 'borders',
    defaultWidth: 92,
    defaultHeight: 92,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Outer Double Corner Framing Rules -->
      <path d="M8 102 V8 H102" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <path d="M15 90 V15 H90" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 3" />
      <!-- Corner Medallion Jewel -->
      <polygon points="8,8 26,8 26,26 8,26" fill="currentColor" />
      <circle cx="17" cy="17" r="4.5" fill="#1a0408" />
      <!-- Intricate Scrollwork Tendrils -->
      <path d="M26 17 C46 17 58 28 52 42 C48 50 36 48 36 39 C36 33 43 32 46 36" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
      <path d="M17 26 C17 46 28 58 42 52 C50 48 48 36 39 36" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
      <!-- Diagonal Lotus Petal -->
      <path d="M26 26 C38 28 48 38 54 54 C38 48 28 38 26 26 Z" fill="currentColor" opacity="0.85" />
      <!-- Terminal Finials -->
      <circle cx="8" cy="104" r="3.5" fill="currentColor" />
      <circle cx="104" cy="8" r="3.5" fill="currentColor" />
    </svg>`,
  },

  // 9. Sacred Padma Lotus Bloom (पवित्र कमल पुष्प)
  {
    id: 'sacred-lotus',
    name: 'Padma Lotus Bloom (कमल पुष्प)',
    category: 'religious',
    defaultWidth: 92,
    defaultHeight: 74,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Back Halo Rays -->
      <circle cx="60" cy="54" r="36" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3" opacity="0.5" />
      <!-- Outer Lower Petals -->
      <path d="M52 68 C26 68 10 56 8 42 C24 40 42 48 54 64 Z" fill="currentColor" opacity="0.7" />
      <path d="M68 68 C94 68 110 56 112 42 C96 40 78 48 66 64 Z" fill="currentColor" opacity="0.7" />
      <!-- Mid Layer Petals -->
      <path d="M55 66 C34 54 24 34 28 18 C44 24 54 42 58 64 Z" fill="currentColor" opacity="0.88" />
      <path d="M65 66 C86 54 96 34 92 18 C76 24 66 42 62 64 Z" fill="currentColor" opacity="0.88" />
      <!-- Center Crown Petal -->
      <path d="M60 8 C46 26 46 50 60 68 C74 50 74 26 60 8 Z" fill="currentColor" stroke="#FFF3A8" stroke-width="1.2" />
      <!-- Inner Detail Lines on Center Petal -->
      <path d="M60 16 V62" stroke="#1a0408" stroke-width="1.2" opacity="0.45" />
      <!-- Base Inverted Calyx & Stem Jewel -->
      <path d="M36 72 Q60 82 84 72 Q60 76 36 72 Z" fill="#FFF3A8" />
      <circle cx="60" cy="84" r="3.5" fill="currentColor" />
    </svg>`,
  },

  // 10. Royal Morpankh Peacock Crest (राजसी मयूर)
  {
    id: 'royal-peacock',
    name: 'Rajwada Peacock (राजसी मयूर)',
    category: 'wedding',
    defaultWidth: 96,
    defaultHeight: 102,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 120 125" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Ornate Tail Feather Fan -->
      <path d="M58 58 C82 32 112 42 114 72 C116 98 92 118 62 116" stroke="currentColor" stroke-width="2" fill="rgba(212,175,55,0.12)" />
      <!-- Feather Eye Spots (Morpankh Chandrika) -->
      <circle cx="92" cy="58" r="8" stroke="currentColor" stroke-width="1.8" fill="#0d3826" />
      <circle cx="92" cy="58" r="3.5" fill="currentColor" />
      <circle cx="98" cy="80" r="8" stroke="currentColor" stroke-width="1.8" fill="#0d3826" />
      <circle cx="98" cy="80" r="3.5" fill="currentColor" />
      <circle cx="84" cy="100" r="8" stroke="currentColor" stroke-width="1.8" fill="#0d3826" />
      <circle cx="84" cy="100" r="3.5" fill="currentColor" />
      <!--Kalgi Crown Plumes -->
      <path d="M46 18 L42 8 M50 17 L50 6 M54 18 L58 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
      <circle cx="42" cy="7" r="2" fill="#FFF3A8" />
      <circle cx="50" cy="5" r="2" fill="#FFF3A8" />
      <circle cx="58" cy="7" r="2" fill="#FFF3A8" />
      <!-- Graceful Peacock Neck & Body -->
      <path d="M44 22 C44 17 53 17 55 22 L62 25 L54 28 C50 38 50 48 56 56 C64 66 64 82 52 90 C40 96 26 88 28 74 C30 62 42 54 44 38 C45 30 44 25 44 22 Z" fill="currentColor" />
      <circle cx="49" cy="22" r="1.6" fill="#1a0408" />
      <!-- Wing Carvings -->
      <path d="M36 66 C48 64 54 72 48 84 C40 86 34 78 36 66 Z" fill="#1a0408" opacity="0.35" />
      <!-- Royal Perch Branch -->
      <path d="M16 106 H76" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
      <path d="M44 90 V106 M52 90 V106" stroke="currentColor" stroke-width="2.2" />
    </svg>`,
  },

  // 11. Royal Gajaraj Ceremonial Elephant (शाही गजराज)
  {
    id: 'royal-elephant',
    name: 'Royal Gajaraj (शाही गजराज)',
    category: 'wedding',
    defaultWidth: 106,
    defaultHeight: 92,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 130 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Royal Howdah Canopy (Ambari) on Back -->
      <path d="M62 24 C62 12 94 12 94 24 Z" fill="currentColor" />
      <line x1="66" y1="24" x2="66" y2="38" stroke="currentColor" stroke-width="2.2" />
      <line x1="90" y1="24" x2="90" y2="38" stroke="currentColor" stroke-width="2.2" />
      <circle cx="78" cy="10" r="3" fill="#FFF3A8" />
      <!-- Elephant Body & Raised Blessing Trunk -->
      <path d="M42 36 C56 30 96 32 108 46 C114 54 114 74 110 94 H96 V72 H64 V94 H50 V62 C44 58 38 50 38 42 Z" fill="currentColor" />
      <path d="M44 36 C32 34 24 42 22 54 C20 66 12 72 8 64 C6 58 12 54 16 58" stroke="currentColor" stroke-width="7" stroke-linecap="round" />
      <!-- Ivory Tusk -->
      <path d="M36 52 Q24 58 20 50" stroke="#FFF3A8" stroke-width="3.5" stroke-linecap="round" />
      <!-- Embroidered Saddle Caparison (Jhool) -->
      <rect x="60" y="40" width="38" height="26" rx="4" fill="#800020" stroke="#FFF3A8" stroke-width="1.8" />
      <circle cx="79" cy="53" r="6" fill="currentColor" />
      <!-- Ground Pedestal Line -->
      <line x1="36" y1="95" x2="118" y2="95" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
    </svg>`,
  },

  // 12. Wedding Shehnai & Marigold Garland (मंगल शहनाई)
  {
    id: 'wedding-shehnai',
    name: 'Mangal ShehnaiPair (शहनाई)',
    category: 'wedding',
    defaultWidth: 94,
    defaultHeight: 86,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 120 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Crossed Twin Royal Shehnais -->
      <!-- Shehnai 1 (Left to Right) -->
      <path d="M18 22 L23 17 L82 72 C90 78 98 82 104 80 L86 98 C88 92 84 84 78 76 L18 22 Z" fill="currentColor" />
      <!-- Shehnai 2 (Right to Left) -->
      <path d="M102 22 L97 17 L38 72 C30 78 22 82 16 80 L34 98 C32 92 36 84 42 76 L102 22 Z" fill="currentColor" opacity="0.9" />
      <!-- Center Tied Ribbon & Hanging Jaimala Beads -->
      <circle cx="60" cy="54" r="8" fill="#800020" stroke="#FFF3A8" stroke-width="2" />
      <path d="M52 60 Q60 82 68 60" stroke="currentColor" stroke-width="2.5" stroke-dasharray="3 3" />
      <circle cx="60" cy="76" r="3.5" fill="#FFF3A8" />
    </svg>`,
  },

  // 13. Royal Bride Palanquin Doli (शाही डोली)
  {
    id: 'royal-doli',
    name: 'Royal Bridal Doli (शाही डोली)',
    category: 'wedding',
    defaultWidth: 112,
    defaultHeight: 80,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 130 92" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Curved Bamboo Carrying Poles -->
      <path d="M4 44 Q24 44 38 40 H92 Q106 44 126 44" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" />
      <circle cx="4" cy="44" r="4" fill="#FFF3A8" />
      <circle cx="126" cy="44" r="4" fill="#FFF3A8" />
      <!-- Mughal Dome Roof -->
      <path d="M36 40 C36 18 50 10 65 10 C80 10 94 18 94 40 Z" fill="currentColor" />
      <path d="M65 2 L62 10 H68 L65 2 Z" fill="#FFF3A8" />
      <!-- Carriage Cabin with Arched Jharokha Window -->
      <path d="M38 40 H92 L88 74 H42 L38 40 Z" fill="#800020" stroke="currentColor" stroke-width="2.5" />
      <path d="M52 74 V54 C52 46 78 46 78 54 V74 Z" fill="#1a0408" stroke="#FFF3A8" stroke-width="1.5" />
      <!-- Hanging Gold Jhumkas under Doli -->
      <circle cx="46" cy="80" r="2.5" fill="currentColor" />
      <circle cx="58" cy="82" r="2.5" fill="currentColor" />
      <circle cx="65" cy="83" r="3" fill="#FFF3A8" />
      <circle cx="72" cy="82" r="2.5" fill="currentColor" />
      <circle cx="84" cy="80" r="2.5" fill="currentColor" />
    </svg>`,
  },

  // 14. Sangeet Dhol & Taal (संगीत ढोलक)
  {
    id: 'sangeet-dholak',
    name: 'Royal Sangeet Dhol (संगीत ढोल)',
    category: 'festive',
    defaultWidth: 96,
    defaultHeight: 76,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 120 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Barrel Drum Body -->
      <path d="M24 20 C52 10 68 10 96 20 V70 C68 80 52 80 24 70 V20 Z" fill="#800020" stroke="currentColor" stroke-width="2.5" />
      <!-- Left & Right Drum Heads -->
      <ellipse cx="24" cy="45" rx="9" ry="25" fill="#FFF3A8" stroke="currentColor" stroke-width="2.5" />
      <ellipse cx="96" cy="45" rx="9" ry="25" fill="#FFF3A8" stroke="currentColor" stroke-width="2.5" />
      <ellipse cx="24" cy="45" rx="4" ry="11" fill="#1a0408" />
      <ellipse cx="96" cy="45" rx="4" ry="11" fill="#1a0408" />
      <!-- Golden Criss-Cross Rope Lacing -->
      <path d="M32 22 L48 68 L64 20 L80 68 L88 22" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
      <path d="M32 68 L48 22 L64 70 L80 22 L88 68" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
      <!-- Tuning Rings -->
      <circle cx="40" cy="45" r="3.5" fill="#FFF3A8" />
      <circle cx="56" cy="45" r="3.5" fill="#FFF3A8" />
      <circle cx="72" cy="45" r="3.5" fill="#FFF3A8" />
    </svg>`,
  },

  // 15. Sacred Vivah Mandap & Agni (वैदिक विवाह मंडप)
  {
    id: 'royal-mandap',
    name: 'Vedic Vivah Mandap (विवाह मंडप)',
    category: 'wedding',
    defaultWidth: 98,
    defaultHeight: 98,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Palace Chhatri Dome -->
      <path d="M18 38 C18 18 36 10 55 10 C74 10 92 18 92 38 H18 Z" fill="currentColor" />
      <path d="M55 2 L51 10 H59 L55 2 Z" fill="#FFF3A8" />
      <!-- Scalloped Bandhanwar Toran -->
      <path d="M18 38 Q30 47 42 38 Q55 48 68 38 Q80 47 92 38" stroke="#FFF3A8" stroke-width="2.2" fill="none" />
      <!-- 4 Carved Pillars -->
      <rect x="22" y="38" width="6" height="50" rx="2" fill="currentColor" />
      <rect x="82" y="38" width="6" height="50" rx="2" fill="currentColor" />
      <rect x="36" y="40" width="4" height="48" fill="currentColor" opacity="0.6" />
      <rect x="70" y="40" width="4" height="48" fill="currentColor" opacity="0.6" />
      <!-- Sacred Havan Kund & Vedic Agni -->
      <path d="M43 80 H67 L63 88 H47 L43 80 Z" fill="#FFF3A8" />
      <path d="M55 62 C50 69 49 75 55 79 C61 75 60 69 55 62 Z" fill="#F59E0B" />
      <!-- Pedestal Steps -->
      <rect x="14" y="88" width="82" height="5" rx="2" fill="currentColor" />
      <rect x="10" y="94" width="90" height="4" rx="2" fill="currentColor" opacity="0.75" />
    </svg>`,
  },

  // 16. Mangal Deepam Diya (मंगल ज्योति दीप)
  {
    id: 'festive-diya',
    name: 'Mangal Deepam (मंगल दीप)',
    category: 'festive',
    defaultWidth: 82,
    defaultHeight: 82,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Radiant Flame Halo -->
      <circle cx="50" cy="28" r="18" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3" opacity="0.6" />
      <!-- Outer & InnerJyoti Flame -->
      <path d="M50 8 C42 20 39 31 50 42 C61 31 58 20 50 8 Z" fill="currentColor" />
      <path d="M50 18 C46 25 45 32 50 38 C55 32 54 25 50 18 Z" fill="#FFF3A8" />
      <!-- Carved Brass Diya Bowl -->
      <path d="M14 50 H86 C82 70 68 80 50 80 C32 80 18 70 14 50 Z" fill="currentColor" />
      <path d="M10 50 H90" stroke="#FFF3A8" stroke-width="3" stroke-linecap="round" />
      <!-- Lotus Pedestal Stand -->
      <path d="M40 80 H60 L66 90 H34 L40 80 Z" fill="currentColor" opacity="0.88" />
    </svg>`,
  },

  // 17. Marigold & Mango Leaf Bandhanwar Toran (गेंदा तोरण)
  {
    id: 'festive-toran',
    name: 'Bandhanwar Toran (मंगल तोरण)',
    category: 'festive',
    defaultWidth: 260,
    defaultHeight: 54,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 280 58" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Top Gold Rod -->
      <rect x="4" y="4" width="272" height="5" rx="2.5" fill="currentColor" />
      <!-- 3 Lush Garland Swags -->
      <path d="M10 9 Q55 38 100 9 Q140 38 180 9 Q225 38 270 9" stroke="currentColor" stroke-width="3" fill="none" />
      <!-- Marigold Rosettes -->
      <circle cx="10" cy="11" r="6" fill="#F59E0B" stroke="#FFF3A8" stroke-width="1.5" />
      <circle cx="55" cy="24" r="6" fill="#C41E3A" stroke="#FFF3A8" stroke-width="1.5" />
      <circle cx="100" cy="11" r="7" fill="#F59E0B" stroke="#FFF3A8" stroke-width="1.5" />
      <circle cx="140" cy="24" r="7" fill="#C41E3A" stroke="#FFF3A8" stroke-width="1.5" />
      <circle cx="180" cy="11" r="7" fill="#F59E0B" stroke="#FFF3A8" stroke-width="1.5" />
      <circle cx="225" cy="24" r="6" fill="#C41E3A" stroke="#FFF3A8" stroke-width="1.5" />
      <circle cx="270" cy="11" r="6" fill="#F59E0B" stroke="#FFF3A8" stroke-width="1.5" />
      <!-- Hanging Temple Bells / Tassels -->
      <line x1="55" y1="30" x2="55" y2="45" stroke="currentColor" stroke-width="1.8" />
      <circle cx="55" cy="48" r="3.5" fill="currentColor" />
      <line x1="140" y1="31" x2="140" y2="48" stroke="currentColor" stroke-width="1.8" />
      <circle cx="140" cy="51" r="4" fill="#FFF3A8" />
      <line x1="225" y1="30" x2="225" y2="45" stroke="currentColor" stroke-width="1.8" />
      <circle cx="225" cy="48" r="3.5" fill="currentColor" />
    </svg>`,
  },

  // 18. Temple Hanging Ghanti Bells (स्वर्ण मंदिर घंटियाँ)
  {
    id: 'hanging-bells',
    name: 'Temple Brass Bells (स्वर्ण घंटियाँ)',
    category: 'festive',
    defaultWidth: 82,
    defaultHeight: 98,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Twin Hanging Chains -->
      <line x1="34" y1="2" x2="34" y2="38" stroke="currentColor" stroke-width="2.2" stroke-dasharray="4 3" />
      <line x1="68" y1="2" x2="68" y2="52" stroke="currentColor" stroke-width="2.2" stroke-dasharray="4 3" />
      <!-- Left Bell -->
      <path d="M22 58 C22 42 46 42 46 58 L52 70 H16 L22 58 Z" fill="currentColor" />
      <circle cx="34" cy="75" r="4" fill="#FFF3A8" />
      <!-- Right Bell -->
      <path d="M56 72 C56 56 80 56 80 72 L86 84 H50 L56 72 Z" fill="currentColor" />
      <circle cx="68" cy="89" r="4" fill="#FFF3A8" />
    </svg>`,
  },

  // 19. Royal Kalka Paisley Motif (शाही कैरी बूटा)
  {
    id: 'royal-paisley',
    name: 'Kalka Paisley Motif (शाही बूटा)',
    category: 'dividers',
    defaultWidth: 82,
    defaultHeight: 96,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M52 10 C32 16 18 38 20 62 C22 86 38 102 58 100 C78 98 88 80 84 58 C80 40 66 28 60 16 C58 10 64 6 68 10" stroke="currentColor" stroke-width="3" fill="rgba(212,175,55,0.12)" stroke-linecap="round" />
      <path d="M52 24 C38 30 28 46 30 62 C32 78 42 90 56 88 C70 86 76 72 72 58 C69 44 58 34 52 24 Z" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" />
      <circle cx="52" cy="60" r="10" fill="currentColor" />
      <circle cx="52" cy="60" r="4" fill="#1a0408" />
    </svg>`,
  },

  // 20. Royal Couple Hastmelap / Jaimala Seal (हस्तमिलाप एवं वरमाला)
  {
    id: 'namaste-welcome',
    name: 'Royal Swagatam Seal (शुभ स्वागतम)',
    category: 'wedding',
    defaultWidth: 88,
    defaultHeight: 88,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="55" cy="55" r="48" stroke="currentColor" stroke-width="2" fill="rgba(212,175,55,0.1)" />
      <circle cx="55" cy="55" r="42" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" />
      <!-- Folded Anjali Mudra Hands -->
      <path d="M54 20 C48 34 40 48 38 64 H54 V20 Z" fill="currentColor" />
      <path d="M56 20 C62 34 70 48 72 64 H56 V20 Z" fill="currentColor" opacity="0.9" />
      <!-- Chuda Bangles -->
      <rect x="35" y="67" width="40" height="5" rx="2.5" fill="#C41E3A" stroke="currentColor" stroke-width="1.2" />
      <rect x="33" y="74" width="44" height="5" rx="2.5" fill="#FFF3A8" />
      <!-- Lotus Petal Cradle -->
      <path d="M28 84 Q55 94 82 84" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
    </svg>`,
  },

  // 21. Royal Wax Monogram Crest (शाही राजमुद्रा)
  {
    id: 'royal-wax-crest',
    name: 'Royal Rajmudra Crest (राजमुद्रा)',
    category: 'borders',
    defaultWidth: 96,
    defaultHeight: 96,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- 16-Pointed Starburst Seal -->
      <polygon points="60,4 71,18 88,11 91,29 109,32 102,49 116,60 102,71 109,88 91,91 88,109 71,102 60,116 49,102 32,109 29,91 11,88 18,71 4,60 18,49 11,32 29,29 32,11 49,18" fill="rgba(128,0,32,0.85)" stroke="currentColor" stroke-width="2.5" />
      <circle cx="60" cy="60" r="38" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3" />
      <circle cx="60" cy="60" r="32" stroke="#FFF3A8" stroke-width="1.2" />
      <!-- Crown Icon in Center -->
      <path d="M42 66 L46 48 L54 56 L60 44 L66 56 L74 48 L78 66 Z" fill="currentColor" />
      <rect x="42" y="69" width="36" height="4" rx="2" fill="#FFF3A8" />
    </svg>`,
  },

  // 22. Royal Chhatri Pavilion (राजस्थानी छतरी)
  {
    id: 'royal-chhatri-dome',
    name: 'Palace Chhatri Dome (शाही छतरी)',
    category: 'wedding',
    defaultWidth: 94,
    defaultHeight: 96,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 110 115" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Ribbed Rajput Chhatri Dome -->
      <path d="M16 46 C16 20 35 12 55 12 C75 12 94 20 94 46 Z" fill="currentColor" />
      <path d="M55 12 V46 M36 16 C32 26 32 36 34 46 M74 16 C78 26 78 36 76 46" stroke="#1a0408" stroke-width="1.4" opacity="0.45" />
      <!-- Spire Kalash -->
      <path d="M55 2 L52 12 H58 L55 2 Z" fill="#FFF3A8" />
      <!-- Eaves Chhajja Overhang -->
      <path d="M10 46 H100 L94 52 H16 L10 46 Z" fill="#FFF3A8" />
      <!-- Cusped Arches & Slender Columns -->
      <path d="M24 52 V96 M44 52 V96 M66 52 V96 M86 52 V96" stroke="currentColor" stroke-width="3" />
      <path d="M24 66 Q34 56 44 66 Q55 54 66 66 Q76 56 86 66" stroke="currentColor" stroke-width="2" fill="none" />
      <rect x="14" y="96" width="82" height="6" rx="2" fill="currentColor" />
    </svg>`,
  },
];
