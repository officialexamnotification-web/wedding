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
  { id: 'all', label: 'All Motifs' },
  { id: 'religious', label: 'Sacred & Religious' },
  { id: 'wedding', label: 'Wedding & Vivah' },
  { id: 'festive', label: 'Festive & Celebration' },
  { id: 'borders', label: 'Frames & Borders' },
  { id: 'dividers', label: 'Dividers & Mandalas' },
] as const;

export const STICKERS: StickerDefinition[] = [
  // 1. Lord Ganesha (Authentic Indian Wedding Silhouette with Mukut, Tilak, Trunk, Modak)
  {
    id: 'ganesha-royal',
    name: 'Lord Ganesha (श्री गणेश)',
    category: 'religious',
    defaultWidth: 76,
    defaultHeight: 82,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 110" fill="currentColor" stroke="none">
      <!-- Ornate Mukut (Crown) -->
      <path d="M50 4 C48 8 46 14 43 18 L57 18 C54 14 52 8 50 4 Z" />
      <circle cx="50" cy="3" r="2" />
      <path d="M38 18 C38 18 43 23 50 23 C57 23 62 18 62 18 L65 24 C59 27 55 27 50 27 C45 27 41 27 35 24 Z" />
      <!-- Ears & Head Shape -->
      <!-- Left Ear -->
      <path d="M37 27 C28 27 18 31 16 42 C14 53 22 61 30 63 C33 63 36 60 38 56 C33 54 26 49 26 42 C26 35 32 30 38 29 Z" />
      <!-- Right Ear -->
      <path d="M63 27 C72 27 82 31 84 42 C86 53 78 61 70 63 C67 63 64 60 62 56 C67 54 74 49 74 42 C74 35 68 30 62 29 Z" />
      <!-- Forehead & Tilak -->
      <ellipse cx="50" cy="36" rx="12" ry="8" opacity="0.3" />
      <!-- Sacred Trishul / Tilak -->
      <path d="M50 26 L50 40 M46 30 Q50 33 54 30" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <circle cx="50" cy="27" r="2" />
      <!-- Eye -->
      <circle cx="43" cy="39" r="1.8" />
      <circle cx="57" cy="39" r="1.8" />
      <!-- Right Tusk (Ekadanta) -->
      <path d="M60 48 L67 48 L60 52 Z" />
      <!-- Trunk (Vakratunda) curving gracefully to the left with Modak -->
      <path d="M52 44 C52 52 50 62 48 72 C46 82 43 90 35 94 C29 97 22 93 21 86 C20 80 25 75 31 77 C35 78 36 82 34 85 C33 87 31 88 29 87 C28 86 28 84 30 83 C29 82 27 84 27 87 C28 90 33 91 36 88 C41 84 43 76 44 68 C46 58 48 49 48 44 Z" />
      <!-- Modak (Sweet) in Trunk -->
      <path d="M22 84 C22 80 26 77 29 79 C32 81 31 85 28 86 C25 87 22 86 22 84 Z" opacity="0.9" />
      <!-- Little Crown & Jewels -->
      <circle cx="36" cy="48" r="2" />
      <circle cx="64" cy="48" r="2" />
      <!-- Lotus Base (Padmasana) -->
      <path d="M50 94 C42 94 36 97 30 102 C38 104 45 104 50 102 C55 104 62 104 70 102 C64 97 58 94 50 94 Z" />
      <path d="M50 98 C46 98 42 100 37 105 C44 107 50 107 50 107 C50 107 56 107 63 105 C58 100 54 98 50 98 Z" opacity="0.6" />
    </svg>`,
  },

  // 2. Manglik Kalash (Ceremonial Pot with Coconut, Mango Leaves, Swastik & Kalawa)
  {
    id: 'manglik-kalash',
    name: 'Manglik Kalash (मंगल कलश)',
    category: 'religious',
    defaultWidth: 74,
    defaultHeight: 82,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 110" fill="currentColor" stroke="none">
      <!-- Coconut (Shriphal) on Top -->
      <path d="M50 8 C44 8 40 16 41 26 C43 32 47 36 50 38 C53 36 57 32 59 26 C60 16 56 8 50 8 Z" />
      <path d="M50 5 L50 9 M48 8 L52 8" stroke="currentColor" stroke-width="2" />
      <!-- Mango Leaves (Amra Pallav) Fanning Outward -->
      <!-- Left Leaf 1 -->
      <path d="M46 36 C38 30 26 26 14 30 C20 38 32 44 44 41 Z" />
      <!-- Right Leaf 1 -->
      <path d="M54 36 C62 30 74 26 86 30 C80 38 68 44 56 41 Z" />
      <!-- Left Leaf 2 -->
      <path d="M47 33 C42 22 32 15 22 14 C22 25 32 32 44 36 Z" />
      <!-- Right Leaf 2 -->
      <path d="M53 33 C58 22 68 15 78 14 C78 25 68 32 56 36 Z" />
      <!-- Center Upright Leaf -->
      <path d="M50 32 C47 22 47 16 50 12 C53 16 53 22 50 32 Z" opacity="0.9" />
      <!-- Kalash Rim / Mouth with sacred thread Kalawa coiling -->
      <path d="M30 42 C30 39 70 39 70 42 C70 45 30 45 30 42 Z" />
      <path d="M34 44 C34 43 66 43 66 44 L64 49 L36 49 Z" opacity="0.8" />
      <!-- Pot Belly (Round Indian Clay/Brass Lota Shape) -->
      <path d="M36 49 C26 55 20 68 22 80 C24 92 35 98 50 98 C65 98 76 92 78 80 C80 68 74 55 64 49 Z" />
      <!-- Sacred Swastik on Kalash Belly -->
      <g stroke="#1a0408" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none">
        <path d="M50 63 L50 81" />
        <path d="M41 72 L59 72" />
        <path d="M50 63 L59 63" />
        <path d="M59 72 L59 81" />
        <path d="M50 81 L41 81" />
        <path d="M41 72 L41 63" />
      </g>
      <!-- Dots in Swastik quadrants -->
      <circle cx="45" cy="67" r="1.3" fill="#1a0408" />
      <circle cx="55" cy="67" r="1.3" fill="#1a0408" />
      <circle cx="45" cy="77" r="1.3" fill="#1a0408" />
      <circle cx="55" cy="77" r="1.3" fill="#1a0408" />
      <!-- Pedestal Stand of Kalash -->
      <path d="M36 98 L64 98 L66 104 L34 104 Z" />
    </svg>`,
  },

  // 3. Sacred Om (ॐ) with Lotus Base
  {
    id: 'sacred-om',
    name: 'Sacred Om (ॐकार)',
    category: 'religious',
    defaultWidth: 70,
    defaultHeight: 70,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor" stroke="none">
      <!-- Main Upper Left Curve (3 top) -->
      <path d="M34 32 C34 22 44 16 54 18 C64 20 68 28 66 36 C64 43 57 48 48 50 C58 52 68 58 68 70 C68 83 55 90 41 88 C30 86 24 76 25 68 C25 64 29 63 32 65 C34 67 35 73 40 76 C46 78 54 77 56 69 C57 62 50 56 42 56 L38 56 L38 50 L43 50 C50 50 55 45 54 38 C53 32 48 28 42 27 C37 26 33 29 33 33 Z" />
      <!-- Tail Curve Right -->
      <path d="M51 49 C60 45 74 48 80 58 C84 65 83 75 78 84 C76 87 72 85 73 82 C76 75 77 67 73 62 C69 55 58 53 50 55 Z" />
      <!-- Upper Crescent (Chandrabindu Crescent) -->
      <path d="M56 22 C64 18 74 19 82 23 C76 26 64 26 56 22 Z" />
      <!-- Bindu Dot -->
      <circle cx="70" cy="12" r="4.5" />
      <!-- Small Lotus Pedestal Accent -->
      <path d="M32 94 C38 90 45 92 50 96 C55 92 62 90 68 94 C60 97 40 97 32 94 Z" opacity="0.6" />
    </svg>`,
  },

  // 4. Shubh Swastik (Vedic Auspicious Swastik)
  {
    id: 'sacred-swastik',
    name: 'Shubh Swastik (शुभ स्वस्तिक)',
    category: 'religious',
    defaultWidth: 64,
    defaultHeight: 64,
    defaultColor: '#C41E3A',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor" stroke="none">
      <!-- Main Swastik Cross Bars -->
      <!-- Vertical Stem -->
      <rect x="46" y="16" width="8" height="68" rx="2" />
      <!-- Horizontal Stem -->
      <rect x="16" y="46" width="68" height="8" rx="2" />
      <!-- Top-Right Arm -->
      <rect x="52" y="16" width="30" height="8" rx="2" />
      <!-- Bottom-Left Arm -->
      <rect x="18" y="76" width="30" height="8" rx="2" />
      <!-- Right-Down Arm -->
      <rect x="76" y="52" width="8" height="30" rx="2" />
      <!-- Left-Up Arm -->
      <rect x="16" y="18" width="8" height="30" rx="2" />
      <!-- 4 Auspicious Dots (Bindus) -->
      <circle cx="34" cy="34" r="4.5" />
      <circle cx="66" cy="34" r="4.5" />
      <circle cx="34" cy="66" r="4.5" />
      <circle cx="66" cy="66" r="4.5" />
    </svg>`,
  },

  // 5. Mangal Diya (Deepam with Sacred Flame & Petal Base)
  {
    id: 'festive-diya',
    name: 'Mangal Deepam (मंगल दीप)',
    category: 'festive',
    defaultWidth: 70,
    defaultHeight: 70,
    defaultColor: '#E6A117',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor" stroke="none">
      <!-- Radiant Flame (Jyoti) -->
      <!-- Outer Flame -->
      <path d="M50 10 C46 24 38 34 44 48 C47 54 53 54 56 48 C62 34 54 24 50 10 Z" opacity="0.9" />
      <!-- Inner Glowing Core Flame -->
      <path d="M50 24 C48 32 44 38 48 46 C50 49 52 49 53 46 C56 38 52 32 50 24 Z" fill="#FFF4D6" />
      <!-- Diya Clay / Brass Oil Basin -->
      <path d="M14 56 C20 74 80 74 86 56 C88 51 80 49 50 49 C20 49 12 51 14 56 Z" />
      <!-- Ornamental Lip & Carving -->
      <ellipse cx="50" cy="53" rx="34" ry="5" opacity="0.25" />
      <circle cx="50" cy="48" r="2.5" fill="#FFF4D6" />
      <!-- Pedestal Stand -->
      <path d="M42 70 L58 70 L62 82 L38 82 Z" />
      <!-- Base Plate with Lotus Petals -->
      <path d="M26 82 C34 79 66 79 74 82 C78 85 74 90 50 90 C26 90 22 85 26 82 Z" />
      <!-- Little Dangling Beads / Ghungroo -->
      <circle cx="36" cy="88" r="2" />
      <circle cx="50" cy="93" r="2.5" />
      <circle cx="64" cy="88" r="2" />
    </svg>`,
  },

  // 6. Royal Doli / Palanquin (शाही डोली)
  {
    id: 'royal-doli',
    name: 'Royal Doli (शाही डोली)',
    category: 'wedding',
    defaultWidth: 96,
    defaultHeight: 70,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 120 90" fill="currentColor" stroke="none">
      <!-- Main Horizontal Carrying Poles -->
      <rect x="4" y="38" width="112" height="5" rx="2.5" />
      <!-- Pole Finials (Decorative Ornate Ends) -->
      <circle cx="4" cy="40.5" r="4" />
      <circle cx="116" cy="40.5" r="4" />
      <!-- Palanquin Dome (Chhatra / Mughal Arch Roof) -->
      <path d="M34 38 C34 20 46 12 60 12 C74 12 86 20 86 38 Z" />
      <!-- Kalash Finial on Doli Roof -->
      <path d="M58 12 L62 12 L60 4 Z" />
      <circle cx="60" cy="4" r="2" />
      <!-- Scalloped Pelmet / Toran Border along roof edge -->
      <path d="M34 38 Q40 43 46 38 Q52 43 60 38 Q68 43 74 38 Q80 43 86 38" stroke="currentColor" stroke-width="2" fill="none" />
      <!-- Main Carriage Body -->
      <path d="M36 43 L38 72 C38 78 46 80 60 80 C74 80 82 78 82 72 L84 43 Z" opacity="0.9" />
      <!-- Curtains / Window Opening (Arched Screen) -->
      <path d="M46 45 C46 56 52 62 60 62 C68 62 74 56 74 45 Z" fill="#171717" />
      <!-- Draped Silk Curtain Swag -->
      <path d="M46 45 Q53 58 60 47 Q67 58 74 45" stroke="currentColor" stroke-width="2" fill="none" />
      <!-- Hanging Tassels & Little Bells at Bottom -->
      <circle cx="44" cy="84" r="2" />
      <circle cx="52" cy="85" r="2" />
      <circle cx="60" cy="86" r="2.5" />
      <circle cx="68" cy="85" r="2" />
      <circle cx="76" cy="84" r="2" />
    </svg>`,
  },

  // 7. Shehnai & Musical Swaras (विवाह शहनाई)
  {
    id: 'wedding-shehnai',
    name: 'Wedding Shehnai (शहनाई)',
    category: 'wedding',
    defaultWidth: 78,
    defaultHeight: 78,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor" stroke="none">
      <!-- Flared Shehnai Pipe -->
      <!-- Narrow Reed Mouthpiece to Mid Pipe -->
      <path d="M18 18 L24 14 L56 46 L50 50 Z" />
      <!-- Widening Pipe Body -->
      <path d="M50 50 L56 46 L74 64 L68 70 Z" />
      <!-- Flared Golden Bell / Flare Horn -->
      <path d="M68 70 L74 64 C80 66 90 76 92 84 C88 92 78 92 70 86 C64 80 66 74 68 70 Z" />
      <!-- Bell Rim Ellipse -->
      <ellipse cx="82" cy="82" rx="10" ry="6" transform="rotate(-45 82 82)" opacity="0.3" />
      <!-- Finger Tone Holes -->
      <circle cx="36" cy="32" r="1.5" fill="#171717" />
      <circle cx="44" cy="40" r="1.5" fill="#171717" />
      <circle cx="52" cy="48" r="1.5" fill="#171717" />
      <circle cx="60" cy="56" r="1.5" fill="#171717" />
      <!-- Marigold Garland Ribbon Tied around Pipe -->
      <path d="M38 28 Q44 38 48 34" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round" />
      <circle cx="46" cy="38" r="3" />
      <circle cx="40" cy="42" r="2.5" />
      <!-- Auspicious Musical Swara Notes (Sur & Taal) -->
      <path d="M66 22 C66 16 74 14 78 18 C82 22 80 28 74 27" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <circle cx="75" cy="27" r="3" />
      <path d="M82 34 C82 30 88 28 92 32 C94 36 92 40 88 39" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
      <circle cx="88" cy="39" r="2.5" />
    </svg>`,
  },

  // 8. Sangeet Dholak (ढोलक)
  {
    id: 'sangeet-dholak',
    name: 'Sangeet Dholak (ढोलक)',
    category: 'wedding',
    defaultWidth: 86,
    defaultHeight: 66,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 110 80" fill="currentColor" stroke="none">
      <!-- Barrel Shaped Drum Body -->
      <path d="M22 18 C55 10 65 10 90 18 L90 62 C65 70 55 70 22 62 Z" />
      <!-- Left Drum Head (Bass Puri) -->
      <ellipse cx="22" cy="40" rx="9" ry="22" fill="#FFEAA7" stroke="currentColor" stroke-width="2" />
      <ellipse cx="22" cy="40" rx="4" ry="10" fill="#171717" />
      <!-- Right Drum Head (Treble Puri) -->
      <ellipse cx="90" cy="40" rx="9" ry="22" fill="#FFEAA7" stroke="currentColor" stroke-width="2" />
      <ellipse cx="90" cy="40" rx="4" ry="10" fill="#171717" />
      <!-- Diagonal Cotton Rope Lacings (Woven V-Pattern) -->
      <g stroke="#171717" stroke-width="2" fill="none">
        <path d="M24 22 L45 40 L24 58" />
        <path d="M45 40 L66 16 L88 34" />
        <path d="M45 40 L66 64 L88 46" />
        <path d="M66 16 L66 64" stroke-dasharray="2 2" />
      </g>
      <!-- Tuning Metal Rings (Chhalla) on ropes -->
      <circle cx="45" cy="40" r="3.5" fill="currentColor" />
      <circle cx="66" cy="30" r="3" fill="currentColor" />
      <circle cx="66" cy="50" r="3" fill="currentColor" />
      <!-- Drum Sticks (Danka & Chhadi) -->
      <line x1="94" y1="18" x2="108" y2="8" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" />
      <circle cx="108" cy="8" r="2.5" />
    </svg>`,
  },

  // 9. Royal Indian Peacock (राजसी मयूर)
  {
    id: 'royal-peacock',
    name: 'Royal Peacock (राजसी मयूर)',
    category: 'wedding',
    defaultWidth: 84,
    defaultHeight: 90,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 110" fill="currentColor" stroke="none">
      <!-- Crest (Kalgi Feather Crown) -->
      <path d="M54 12 L50 20 M58 10 L54 20 M62 12 L56 21" stroke="currentColor" stroke-width="2" />
      <circle cx="54" cy="10" r="2" />
      <circle cx="58" cy="8" r="2" />
      <circle cx="63" cy="10" r="2" />
      <!-- Head & Beak -->
      <path d="M48 20 C48 16 56 16 58 20 C58 24 52 26 50 28 L43 24 Z" />
      <!-- Eye -->
      <circle cx="53" cy="20" r="1.5" fill="#171717" />
      <!-- Graceful S-Curved Neck & Chest -->
      <path d="M50 28 C46 34 46 42 50 48 C54 54 58 60 56 68 C54 74 46 76 40 74 C36 72 34 66 36 60 C38 52 46 46 48 38 Z" />
      <!-- Wing with Scalloped Feather Rows -->
      <path d="M54 52 C62 52 68 58 66 68 C64 78 54 84 46 84 C42 84 44 76 48 70 C52 64 56 58 54 52 Z" opacity="0.9" />
      <!-- Grand Ornate Feather Plumage (Tail Fan) -->
      <path d="M60 48 C72 40 84 44 90 56 C96 68 90 84 78 94 C68 102 54 104 42 102 C50 96 60 92 68 84 C76 76 80 66 74 58 C70 52 64 50 60 48 Z" />
      <!-- Peacock Eye Spots (Chandrika) -->
      <circle cx="82" cy="62" r="3.5" fill="#171717" />
      <circle cx="82" cy="62" r="2" fill="#D4AF37" />
      <circle cx="78" cy="78" r="3.5" fill="#171717" />
      <circle cx="78" cy="78" r="2" fill="#D4AF37" />
      <circle cx="64" cy="90" r="3.5" fill="#171717" />
      <circle cx="64" cy="90" r="2" fill="#D4AF37" />
      <!-- Feet & Perch -->
      <path d="M44 84 L42 96 M48 84 L48 96 M38 96 L52 96" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" />
    </svg>`,
  },

  // 10. Royal Ceremonial Elephant (शुभ गजराज / ऐरावत)
  {
    id: 'royal-elephant',
    name: 'Royal Elephant (शुभ गजराज)',
    category: 'wedding',
    defaultWidth: 92,
    defaultHeight: 82,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 110 100" fill="currentColor" stroke="none">
      <!-- Head with Nettipattam (Golden Headplate) -->
      <path d="M34 26 C42 22 52 24 58 32 C62 38 60 46 54 50 C48 54 38 52 32 46 C28 40 28 32 34 26 Z" />
      <!-- Eye -->
      <circle cx="44" cy="34" r="2" fill="#171717" />
      <!-- Tusk (Ivory Danta) -->
      <path d="M42 50 C48 54 54 54 60 48 C56 56 46 56 40 52 Z" />
      <!-- Trunk Raised High in Blessing (Ashtalakshmi Gaja) Holding Lotus -->
      <path d="M36 44 C34 54 36 64 42 74 C48 84 56 90 64 88 C70 86 72 78 68 74 C64 70 56 72 58 78 C59 80 62 80 62 78 C60 76 64 74 66 76 C66 78 63 82 58 82 C52 82 46 76 42 68 C38 60 38 50 40 44 Z" />
      <!-- Lotus Flower in Trunk Tip -->
      <path d="M66 68 C64 64 68 60 72 62 C74 64 74 68 70 70 Z" />
      <path d="M72 62 C76 60 80 64 78 68 Z" />
      <!-- Elephant Massive Body -->
      <path d="M48 34 C60 28 80 28 92 40 C98 46 98 64 96 78 L84 78 L84 64 C80 64 76 64 72 64 L72 78 L58 78 L58 54 C54 50 50 44 48 34 Z" />
      <!-- Back Leg & Tail -->
      <path d="M96 52 C100 58 100 68 98 74" stroke="currentColor" stroke-width="2" fill="none" />
      <circle cx="98" cy="76" r="2" />
      <!-- Royal Embroidered Saddle Cloth (Jhool) with Fringe -->
      <path d="M58 36 L88 36 L84 58 L54 58 Z" fill="#171717" stroke="currentColor" stroke-width="2" />
      <path d="M54 58 Q60 63 66 58 Q72 63 78 58 Q84 63 88 58" stroke="currentColor" stroke-width="2" fill="none" />
      <!-- Little Howdah Canopy Top -->
      <path d="M64 26 C64 22 72 18 78 18 C84 18 88 22 88 26 Z" />
      <circle cx="78" cy="16" r="2.5" />
    </svg>`,
  },

  // 11. Royal Chhatri Vivah Mandap (विवाह मंडप व पवित्र अग्नि)
  {
    id: 'royal-mandap',
    name: 'Vivah Mandap (विवाह मंडप)',
    category: 'wedding',
    defaultWidth: 88,
    defaultHeight: 88,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor" stroke="none">
      <!-- Ornate Mughal Dome (Chhatra) -->
      <path d="M18 36 C18 18 34 10 50 10 C66 10 82 18 82 36 Z" />
      <!-- Dome Finial (Kalash & Kalgi) -->
      <path d="M48 10 L52 10 L50 2 Z" />
      <circle cx="50" cy="2" r="2.5" />
      <!-- Scalloped Toran Garland under Dome -->
      <path d="M18 36 Q34 44 50 36 Q66 44 82 36" stroke="currentColor" stroke-width="2.5" fill="none" />
      <!-- 4 Carved Pillars with Flower Garlands -->
      <!-- Left Outer Pillar -->
      <rect x="22" y="36" width="5" height="46" rx="1.5" />
      <!-- Right Outer Pillar -->
      <rect x="73" y="36" width="5" height="46" rx="1.5" />
      <!-- Left Inner Pillar -->
      <rect x="36" y="38" width="3.5" height="44" opacity="0.6" />
      <!-- Right Inner Pillar -->
      <rect x="60.5" y="38" width="3.5" height="44" opacity="0.6" />
      <!-- Sacred Havan Kund (Fire Altar in center) -->
      <path d="M40 76 L60 76 L56 82 L44 82 Z" fill="#FFEAA7" />
      <!-- Sacred Agni Flames -->
      <path d="M50 64 C47 70 44 74 48 76 C52 76 54 70 50 64 Z" fill="#C41E3A" />
      <path d="M52 66 C55 70 56 74 53 76 Z" fill="#E6A117" />
      <!-- Base Steps of Mandap -->
      <rect x="12" y="82" width="76" height="5" rx="2" />
      <rect x="8" y="87" width="84" height="4" rx="2" opacity="0.8" />
    </svg>`,
  },

  // 12. Namaste / Pranam Welcome (शुभ स्वागतम)
  {
    id: 'namaste-welcome',
    name: 'Pranam Hands (शुभ स्वागतम)',
    category: 'wedding',
    defaultWidth: 72,
    defaultHeight: 76,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor" stroke="none">
      <!-- Folded Palms (Anjali Mudra / Namaste) -->
      <!-- Left Hand -->
      <path d="M49 14 C47 24 43 38 38 48 C34 54 30 62 30 70 L48 70 L49 14 Z" />
      <!-- Right Hand -->
      <path d="M51 14 C53 24 57 38 62 48 C66 54 70 62 70 70 L52 70 L51 14 Z" />
      <!-- Thumb Profiles -->
      <path d="M38 52 C32 56 34 66 38 70 Z" opacity="0.8" />
      <path d="M62 52 C68 56 66 66 62 70 Z" opacity="0.8" />
      <!-- Bridal Bangles (Chuda & Kangan) at Wrists -->
      <rect x="28" y="72" width="44" height="4" rx="2" fill="#C41E3A" stroke="currentColor" stroke-width="1" />
      <rect x="26" y="78" width="48" height="4" rx="2" fill="currentColor" />
      <rect x="28" y="84" width="44" height="4" rx="2" fill="#C41E3A" stroke="currentColor" stroke-width="1" />
      <!-- Floral Garland (Gajra / Mala) draping under hands -->
      <circle cx="34" cy="92" r="3" />
      <circle cx="42" cy="94" r="3.5" />
      <circle cx="50" cy="95" r="4" />
      <circle cx="58" cy="94" r="3.5" />
      <circle cx="66" cy="92" r="3" />
    </svg>`,
  },

  // 13. Royal Hanging Bells (स्वर्ण घंटियाँ)
  {
    id: 'hanging-bells',
    name: 'Royal Brass Bells (स्वर्ण घंटियाँ)',
    category: 'festive',
    defaultWidth: 76,
    defaultHeight: 86,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 110" fill="currentColor" stroke="none">
      <!-- Left Bell Assembly -->
      <!-- Chain Links -->
      <line x1="36" y1="4" x2="36" y2="34" stroke="currentColor" stroke-width="2.5" stroke-dasharray="3 3" />
      <!-- Bell Canopy / Bow Ribbon -->
      <path d="M30 34 C30 30 42 30 42 34 Z" />
      <!-- Bell Dome Body -->
      <path d="M24 54 C24 38 48 38 48 54 C50 62 52 66 54 68 L18 68 C20 66 22 62 24 54 Z" />
      <!-- Bell Rim -->
      <ellipse cx="36" cy="68" rx="18" ry="3.5" opacity="0.3" />
      <!-- Clapper Ball & Tongue -->
      <line x1="36" y1="68" x2="36" y2="76" stroke="currentColor" stroke-width="2" />
      <circle cx="36" cy="78" r="3.5" />

      <!-- Right Bell Assembly (Slightly Lower for Dynamic Cascade) -->
      <!-- Chain Links -->
      <line x1="68" y1="4" x2="68" y2="46" stroke="currentColor" stroke-width="2.5" stroke-dasharray="3 3" />
      <!-- Bell Canopy -->
      <path d="M62 46 C62 42 74 42 74 46 Z" />
      <!-- Bell Dome Body -->
      <path d="M56 66 C56 50 80 50 80 66 C82 74 84 78 86 80 L50 80 C52 78 54 74 56 66 Z" />
      <!-- Bell Rim -->
      <ellipse cx="68" cy="80" rx="18" ry="3.5" opacity="0.3" />
      <!-- Clapper Ball & Tongue -->
      <line x1="68" y1="80" x2="68" y2="88" stroke="currentColor" stroke-width="2" />
      <circle cx="68" cy="90" r="3.5" />
    </svg>`,
  },

  // 14. Marigold Festive Toran (गेंदा पुष्प तोरण)
  {
    id: 'festive-toran',
    name: 'Marigold Toran (गेंदा तोरण)',
    category: 'festive',
    defaultWidth: 190,
    defaultHeight: 46,
    defaultColor: '#E6A117',
    svg: `<svg viewBox="0 0 200 48" fill="currentColor" stroke="none">
      <!-- Main Swag Garland Cord -->
      <path d="M0 8 Q50 26 100 8 Q150 26 200 8" stroke="currentColor" stroke-width="2.5" fill="none" />
      <!-- Layered Marigold Blossoms along Swag -->
      <circle cx="20" cy="15" r="7" />
      <circle cx="20" cy="15" r="4.5" fill="#C41E3A" />
      <circle cx="45" cy="20" r="8" />
      <circle cx="45" cy="20" r="5" fill="#FFEAA7" />
      <circle cx="75" cy="17" r="7" />
      <circle cx="75" cy="17" r="4.5" fill="#C41E3A" />
      <circle cx="100" cy="10" r="9" />
      <circle cx="100" cy="10" r="6" fill="#FFEAA7" />
      <circle cx="125" cy="17" r="7" />
      <circle cx="125" cy="17" r="4.5" fill="#C41E3A" />
      <circle cx="155" cy="20" r="8" />
      <circle cx="155" cy="20" r="5" fill="#FFEAA7" />
      <circle cx="180" cy="15" r="7" />
      <circle cx="180" cy="15" r="4.5" fill="#C41E3A" />
      <!-- Mango Leaf Drops with Pointed Tips -->
      <path d="M45 28 C42 34 45 44 45 46 C45 44 48 34 45 28 Z" fill="#2d6a4f" stroke="currentColor" stroke-width="1" />
      <path d="M100 19 C97 28 100 40 100 44 C100 40 103 28 100 19 Z" fill="#2d6a4f" stroke="currentColor" stroke-width="1" />
      <path d="M155 28 C152 34 155 44 155 46 C155 44 158 34 155 28 Z" fill="#2d6a4f" stroke="currentColor" stroke-width="1" />
    </svg>`,
  },

  // 15. Ornate Indian Paisley / Kalka (शाही केरी / बूटा)
  {
    id: 'royal-paisley',
    name: 'Royal Paisley (शाही बूटा)',
    category: 'dividers',
    defaultWidth: 76,
    defaultHeight: 90,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 110" fill="currentColor" stroke="none">
      <!-- Main Teardrop Paisley Silhouette with Curved Feather Tip -->
      <path d="M44 14 C32 20 20 36 20 54 C20 74 34 94 54 94 C74 94 84 76 82 58 C80 44 72 32 64 24 C58 18 52 10 50 4 C48 10 46 12 44 14 Z" />
      <!-- Internal Negative Space / Filigree Carving -->
      <path d="M46 26 C38 32 30 44 30 56 C30 70 40 84 54 84 C68 84 74 72 72 58 C70 48 64 38 56 32 C54 28 52 22 50 18 C48 22 47 24 46 26 Z" fill="#171717" />
      <!-- Inner Blooming Lotus Floret inside Paisley -->
      <path d="M52 48 C48 54 44 64 48 72 C52 76 56 76 60 72 C64 64 60 54 52 48 Z" fill="currentColor" />
      <circle cx="54" cy="62" r="3" fill="#171717" />
      <!-- Outer Beaded Perimeter Droplets -->
      <circle cx="18" cy="50" r="2.5" />
      <circle cx="22" cy="70" r="2.5" />
      <circle cx="34" cy="86" r="2.5" />
      <circle cx="54" cy="98" r="3" />
      <circle cx="74" cy="86" r="2.5" />
      <circle cx="84" cy="70" r="2.5" />
      <circle cx="82" cy="50" r="2.5" />
    </svg>`,
  },

  // 16. Grand Sacred Mandala (अल्पना / चक्र रंगोली)
  {
    id: 'ornate-mandala',
    name: 'Sacred Mandala (राजसी चक्र)',
    category: 'dividers',
    defaultWidth: 94,
    defaultHeight: 94,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor" stroke="none">
      <!-- Center Core & Bindu -->
      <circle cx="50" cy="50" r="6" />
      <circle cx="50" cy="50" r="3" fill="#171717" />
      <!-- Inner Ring of 8 Lotus Petals -->
      <!-- 0 deg -->
      <path d="M50 40 C46 44 46 48 50 50 C54 48 54 44 50 40 Z" />
      <!-- 180 deg -->
      <path d="M50 60 C46 56 46 52 50 50 C54 52 54 56 50 60 Z" />
      <!-- 90 deg -->
      <path d="M60 50 C56 46 52 46 50 50 C52 54 56 54 60 50 Z" />
      <!-- 270 deg -->
      <path d="M40 50 C44 46 48 46 50 50 C48 54 44 54 40 50 Z" />
      <!-- Middle Ring of Geometric Stars -->
      <circle cx="50" cy="50" r="22" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="2 3" />
      <!-- 8 Outer Elaborate Lotus Petals with Pointed Tips -->
      <path d="M50 14 C44 26 44 32 50 36 C56 32 56 26 50 14 Z" />
      <path d="M50 86 C44 74 44 68 50 64 C56 68 56 74 50 86 Z" />
      <path d="M14 50 C26 44 32 44 36 50 C32 56 26 56 14 50 Z" />
      <path d="M86 50 C74 44 68 44 64 50 C68 56 74 56 86 50 Z" />
      <!-- Diagonal Petals -->
      <path d="M24 24 C34 32 36 36 40 40 C36 36 32 34 24 24 Z" />
      <path d="M76 76 C66 68 64 64 60 60 C64 64 68 66 76 76 Z" />
      <path d="M76 24 C68 34 64 36 60 40 C64 36 66 32 76 24 Z" />
      <path d="M24 76 C32 66 36 64 40 60 C36 64 34 68 24 76 Z" />
      <!-- Outer Beaded Circle -->
      <circle cx="50" cy="50" r="44" stroke="currentColor" stroke-width="1.5" fill="none" />
      <circle cx="50" cy="6" r="2" />
      <circle cx="50" cy="94" r="2" />
      <circle cx="6" cy="50" r="2" />
      <circle cx="94" cy="50" r="2" />
    </svg>`,
  },

  // 17. Royal Filigree Divider (शाही स्वर्ण डिवाइडर)
  {
    id: 'gold-divider',
    name: 'Filigree Divider (पुष्प डिवाइडर)',
    category: 'dividers',
    defaultWidth: 180,
    defaultHeight: 34,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 200 40" fill="currentColor" stroke="none">
      <!-- Center Royal Lotus Rosette -->
      <ellipse cx="100" cy="20" rx="8" ry="10" />
      <circle cx="100" cy="20" r="3.5" fill="#171717" />
      <!-- Flanking Lotus Petals -->
      <path d="M92 20 C88 12 84 14 86 20 C84 26 88 28 92 20 Z" />
      <path d="M108 20 C112 12 116 14 114 20 C116 26 112 28 108 20 Z" />
      <!-- Left Swirling Acanthus Vine -->
      <path d="M84 20 C76 12 66 12 58 20 C50 28 42 22 36 18 C32 14 24 16 18 20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <!-- Left Leaf Tendrils -->
      <path d="M72 16 C68 10 60 12 64 18 Z" />
      <path d="M46 22 C42 28 34 26 38 20 Z" />
      <circle cx="14" cy="20" r="3.5" />

      <!-- Right Swirling Acanthus Vine -->
      <path d="M116 20 C124 12 134 12 142 20 C150 28 158 22 164 18 C168 14 176 16 182 20" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <!-- Right Leaf Tendrils -->
      <path d="M128 16 C132 10 140 12 136 18 Z" />
      <path d="M154 22 C158 28 166 26 162 20 Z" />
      <circle cx="186" cy="20" r="3.5" />
    </svg>`,
  },

  // 18. Royal Floral Corner Accent (शाही कोना बॉर्डर)
  {
    id: 'floral-corner',
    name: 'Royal Corner (शाही कोना)',
    category: 'borders',
    defaultWidth: 76,
    defaultHeight: 76,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 100" fill="currentColor" stroke="none">
      <!-- Main Corner Floral Knot -->
      <circle cx="20" cy="20" r="6" />
      <circle cx="20" cy="20" r="2.5" fill="#171717" />
      <!-- Outer Framing Right-Angle Guidelines -->
      <path d="M6 6 L6 88 M6 6 L88 6" stroke="currentColor" stroke-width="2.5" fill="none" />
      <!-- Inner Thin Parallel Line -->
      <path d="M14 14 L14 74 M14 14 L74 14" stroke="currentColor" stroke-width="1.5" fill="none" stroke-dasharray="2 3" />
      <!-- Baroque Acanthus Flourish inside Corner -->
      <path d="M24 24 C36 20 48 24 54 36 C50 36 44 32 38 34 C32 36 32 44 34 50 C24 46 20 36 24 24 Z" />
      <path d="M24 24 C20 36 24 48 36 54 C36 50 32 44 34 38 C36 32 44 32 50 34 C46 24 36 20 24 24 Z" opacity="0.8" />
      <!-- Floral Terminal Drops -->
      <circle cx="6" cy="94" r="3" />
      <circle cx="94" cy="6" r="3" />
      <circle cx="36" cy="36" r="4" />
      <circle cx="36" cy="36" r="1.5" fill="#171717" />
    </svg>`,
  },

  // 19. Royal Mughal Arch Frame (शाही मेहराब बॉर्डर)
  {
    id: 'royal-arch-frame',
    name: 'Mughal Arch (मेहराब फ्रेम)',
    category: 'borders',
    defaultWidth: 200,
    defaultHeight: 270,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 200 280" fill="currentColor" stroke="none">
      <!-- Outer Double Border Lines -->
      <rect x="6" y="6" width="188" height="268" rx="6" stroke="currentColor" stroke-width="2" fill="none" />
      <rect x="14" y="14" width="172" height="252" rx="4" stroke="currentColor" stroke-width="1" stroke-dasharray="3 3" fill="none" />
      <!-- Cusped Royal Mughal Arch Profile -->
      <path d="M22 100 C22 65 44 48 70 48 C84 48 94 40 100 32 C106 40 116 48 130 48 C156 48 178 65 178 100" stroke="currentColor" stroke-width="3" fill="none" />
      <!-- Spire Finial above Arch -->
      <path d="M98 32 L102 32 L100 18 Z" />
      <circle cx="100" cy="18" r="2.5" />
      <!-- Scalloped Drops on Arch Archway -->
      <circle cx="44" cy="68" r="2.5" />
      <circle cx="70" cy="48" r="3" />
      <circle cx="100" cy="32" r="3.5" />
      <circle cx="130" cy="48" r="3" />
      <circle cx="156" cy="68" r="2.5" />
      <!-- 4 Corner Rosette Ornaments -->
      <circle cx="22" cy="22" r="4" />
      <circle cx="178" cy="22" r="4" />
      <circle cx="22" cy="258" r="4" />
      <circle cx="178" cy="258" r="4" />
    </svg>`,
  },

  // 20. Sacred Indian Lotus Bloom (पवित्र कमल पुष्प)
  {
    id: 'sacred-lotus',
    name: 'Sacred Lotus (कमल पुष्प)',
    category: 'religious',
    defaultWidth: 72,
    defaultHeight: 62,
    defaultColor: '#D4AF37',
    svg: `<svg viewBox="0 0 100 90" fill="currentColor" stroke="none">
      <!-- Center Upright Petal -->
      <path d="M50 10 C44 26 44 46 50 64 C56 46 56 26 50 10 Z" />
      <!-- Inner Left Petal -->
      <path d="M49 24 C38 34 34 50 44 66 C48 54 48 38 49 24 Z" opacity="0.9" />
      <!-- Inner Right Petal -->
      <path d="M51 24 C62 34 66 50 56 66 C52 54 52 38 51 24 Z" opacity="0.9" />
      <!-- Outer Left Petal -->
      <path d="M42 36 C24 46 18 62 34 72 C38 62 40 48 42 36 Z" />
      <!-- Outer Right Petal -->
      <path d="M58 36 C76 46 82 62 66 72 C62 62 60 48 58 36 Z" />
      <!-- Base Horizontal Calyx Leaves -->
      <path d="M30 72 C16 74 12 80 24 82 C34 82 42 76 50 72 Z" opacity="0.8" />
      <path d="M70 72 C84 74 88 80 76 82 C66 82 58 76 50 72 Z" opacity="0.8" />
      <!-- Seed Pod Center Accent -->
      <circle cx="50" cy="54" r="3" fill="#171717" />
    </svg>`,
  },
];
