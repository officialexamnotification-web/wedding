import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve('src/data/elements');
fs.mkdirSync(DATA_DIR, { recursive: true });

// ================= 120 PHOTOS =================
const BASE_LOCAL_IMAGES = [
  '/images/royal_mandap_cover.webp',
  '/images/royal_vivah_peacocks.webp',
  '/images/royal_ganesh_blessings.webp',
  '/images/royal_haldi_mehndi_sangeet.webp',
  '/images/royal_reception_velvet.webp',
  '/images/royal_palace_venue_rsvp.webp',
  '/images/wedding_couple_1791965341379.jpg',
  '/images/sangeet_haldi_1791965342768.jpg',
  '/images/griha_pravesh_1791965341528.jpg',
  '/images/baby_birthday_1791965343318.jpg',
  '/images/royal_mandap_decor_1791977898319.jpg',
  '/images/royal_sangeet_decor_1791977896632.jpg',
  '/images/royal_reception_decor_1791977898430.jpg',
  '/images/royal_cover_clean_1791975961383.jpg',
  '/images/royal_ending_clean_1791975962066.jpg',
  '/images/video_mandap_clean_1791975940608.jpg',
  '/wedding/Golden Mandap Wedding Invitation/Golden Mandap Wedding Invitation-1.webp',
  '/wedding/Golden Mandap Wedding Invitation/Golden Mandap Wedding Invitation-2.webp',
  '/wedding/Golden Mandap Wedding Invitation/Golden Mandap Wedding Invitation-3.webp',
  '/wedding/Royal Lakeside Wedding Invitation/Royal Lakeside Wedding Invitation-1.webp',
  '/wedding/Royal Lakeside Wedding Invitation/Royal Lakeside Wedding Invitation-2.webp',
  '/wedding/Royal Lakeside Wedding Invitation/Royal Lakeside Wedding Invitation-3.webp',
];

const PHOTO_CATEGORIES = [
  { sub: 'couples', label: 'Royal Couple Portrait', count: 20 },
  { sub: 'mandap', label: 'Palace Mandap & Stage', count: 20 },
  { sub: 'haldi-mehendi', label: 'Haldi & Mehendi Festive', count: 20 },
  { sub: 'sangeet-gala', label: 'Sangeet & Cocktail Night', count: 20 },
  { sub: 'palaces', label: 'Udaipur & Jaipur Palaces', count: 20 },
  { sub: 'florals-decor', label: 'Marigold, Lotus & Diya Decor', count: 20 },
];

const FILTER_VARS = [
  'none',
  'contrast(1.08) saturate(1.18)',
  'sepia(0.18) contrast(1.06) brightness(1.03)',
  'saturate(1.3) hue-rotate(-6deg)',
  'brightness(1.06) contrast(1.1)',
  'sepia(0.28) saturate(1.22)',
];

const photosManifest = [];
let pIdx = 0;
for (const group of PHOTO_CATEGORIES) {
  for (let i = 0; i < group.count; i++) {
    pIdx++;
    const num = String(pIdx).padStart(3, '0');
    const src = BASE_LOCAL_IMAGES[(pIdx - 1) % BASE_LOCAL_IMAGES.length];
    const filterCSS = FILTER_VARS[(pIdx - 1) % FILTER_VARS.length];
    const ratios = ['portrait', 'square', 'landscape'];
    photosManifest.push({
      id: `photo-${num}`,
      name: `${group.label} #${i + 1}`,
      category: 'photos',
      subcategory: group.sub,
      src,
      aspectRatio: ratios[pIdx % 3],
      filterCSS,
      tags: ['photo', 'image', group.sub, ...group.label.toLowerCase().split(/\s+/), 'wedding', 'royal'],
    });
  }
}

// ================= 40 PLAYABLE MOTION VIDEOS =================
const VIDEO_THEMES = [
  'gold-dust',
  'petals',
  'bokeh',
  'mandala-spin',
  'diya-flame',
  'fireworks',
  'light-rays',
  'particles',
];

const VIDEO_NAMES = [
  'Royal Gold Dust Shimmer', 'Rose Petal Shower Loop', 'Udaipur Palace Golden Bokeh', 'Spinning Surya Mandala',
  'Sacred Aarti Diya Flame', 'Baraat Celebration Fireworks', 'Heavenly Temple Light Rays', 'Floating Marigold Sparkles',
  'Sangeet Disco Neon Bokeh', 'Haldi Turmeric Petal Rain', 'Mehendi Emerald Shimmer', 'Crimson Velvet Gold Motes',
  'Midnight Starlight Galaxy', 'Champagne Fizz Bubbles', 'Rajwada Chandelier Glow', 'Lotus Pond Ripple Motion',
  'Vedic Agni Sacred Sparks', 'Peacock Feather Iridescence', 'Silver Zari Thread Wave', 'Kundan Jewel Twinkle',
  'Shehnai Musical Wave Loop', 'Dhol Beats Pulse Ring', 'Royal Ivory Silk Drape', 'Saffron Sunset Rays',
  'Palace Courtyard Fountain', 'Jasmine Mogra Falling', 'Bridal Dupatta Sparkle', 'Groom Entry Pyrotechnics',
  'Reception Stage Spotlight', 'Gatsby Art Deco Shimmer', 'Mandap Pillar Torchlight', 'Auspicious Kalash Aura',
  'Celestial Nakshatra Stars', 'Pink City Dawn Glow', 'Lake Pichola Moon Reflection', 'Amber Fort Torch Flicker',
  'Royal Seal Gold Foil Shine', 'Diamond Dust Cascade', 'Warm Candlelight Vigil', 'Eternal Blessings Halo'
];

const videosManifest = VIDEO_NAMES.map((name, idx) => {
  const num = String(idx + 1).padStart(2, '0');
  const theme = VIDEO_THEMES[idx % VIDEO_THEMES.length];
  const palettes = [
    ['#F59E0B', '#FEF3C7', 'linear-gradient(135deg, #2a080c 0%, #4a1018 50%, #1a0508 100%)'],
    ['#F43F5E', '#FDE68A', 'linear-gradient(135deg, #3b0718 0%, #6b1028 50%, #1c040c 100%)'],
    ['#10B981', '#A7F3D0', 'linear-gradient(135deg, #062c22 0%, #0d4a3a 50%, #031812 100%)'],
    ['#8B5CF6', '#DDD6FE', 'linear-gradient(135deg, #1e1038 0%, #341a60 50%, #0f0720 100%)'],
    ['#D97706', '#FDE047', 'linear-gradient(135deg, #2e1a05 0%, #52300c 50%, #1a0e02 100%)'],
  ];
  const pal = palettes[idx % palettes.length];
  return {
    id: `video-${num}`,
    name,
    category: 'videos',
    subcategory: theme,
    visualTheme: theme,
    primaryColor: pal[0],
    secondaryColor: pal[1],
    bgGradient: pal[2],
    durationSec: 6 + (idx % 5) * 2,
    tags: ['video', 'motion', 'loop', theme, ...name.toLowerCase().split(/\s+/)],
  };
});

// ================= 60 PLAYABLE AUDIO TRACKS =================
const AUDIO_SPECS = [
  { sub: 'shehnai', label: 'Ustad Bismillah Style Shehnai', notes: [261.6, 293.7, 329.6, 392.0, 440.0, 523.3], tempo: 108, color: '#F59E0B' },
  { sub: 'sitar', label: 'Royal Darbari Sitar Alaap', notes: [220.0, 246.9, 277.2, 329.6, 370.0, 440.0], tempo: 120, color: '#FBBF24' },
  { sub: 'flute', label: 'Vrindavan Bansuri Raga Yaman', notes: [293.7, 329.6, 370.0, 440.0, 493.9, 587.3], tempo: 96, color: '#34D399' },
  { sub: 'dhol', label: 'Punjabi Baraat Dhol Tasha', notes: [110.0, 146.8, 164.8, 220.0, 146.8, 110.0], tempo: 148, color: '#F43F5E' },
  { sub: 'mantra', label: 'Vedic Mangalashtak Chants', notes: [196.0, 220.0, 246.9, 220.0, 196.0, 261.6], tempo: 84, color: '#FCD34D' },
  { sub: 'bollywood', label: 'Royal Sangeet Orchestra Strings', notes: [329.6, 392.0, 440.0, 493.9, 523.3, 659.3], tempo: 128, color: '#A78BFA' },
  { sub: 'ambient', label: 'Udaipur Palace Fountain & Santoor', notes: [349.2, 440.0, 523.3, 659.3, 523.3, 440.0], tempo: 90, color: '#38BDF8' },
  { sub: 'sfx', label: 'Temple Bell, Shankh & Applause', notes: [523.3, 659.3, 784.0, 1046.5, 784.0, 1046.5], tempo: 135, color: '#FB923C' },
];

const audioManifest = [];
for (let i = 0; i < 60; i++) {
  const num = String(i + 1).padStart(2, '0');
  const spec = AUDIO_SPECS[i % AUDIO_SPECS.length];
  const pitchShift = 1 + ((i % 5) - 2) * 0.04;
  const shiftedNotes = spec.notes.map((n) => +(n * pitchShift).toFixed(1));
  const variantNum = Math.floor(i / AUDIO_SPECS.length) + 1;
  audioManifest.push({
    id: `audio-${num}`,
    name: `${spec.label} Vol.${variantNum}`,
    category: 'audio',
    subcategory: spec.sub,
    ragaNotes: shiftedNotes,
    tempo: spec.tempo + ((i * 7) % 24) - 10,
    accentColor: spec.color,
    durationLabel: `0:${String(18 + (i % 35)).padStart(2, '0')}`,
    description: `WebAudio synthesized ${spec.sub} raga melody (${spec.tempo} BPM)`,
    tags: ['audio', 'music', 'sound', spec.sub, ...spec.label.toLowerCase().split(/\s+/)],
  });
}

// ================= 40 FUNCTIONAL ANIMATION PRESETS =================
const BASE_ANIM_TYPES = [
  'rise', 'pan', 'fade', 'pop', 'wipe', 'breathe', 'drift', 'tumble',
  'neon-pulse', 'typewriter', 'stomp', 'tectonic', 'baseline', 'scrapbook',
  'photo-zoom', 'photo-flow', 'float', 'heartbeat', 'spin-slow'
];

const ANIM_SUBS = ['entrance', 'emphasis', 'motion', 'celebration'];
const DIRECTIONS = ['up', 'down', 'left', 'right'];
const TIMINGS = ['both', 'enter', 'loop', 'exit'];

const animationsManifest = [];
for (let i = 0; i < 40; i++) {
  const num = String(i + 1).padStart(2, '0');
  const animType = BASE_ANIM_TYPES[i % BASE_ANIM_TYPES.length];
  const sub = ANIM_SUBS[i % ANIM_SUBS.length];
  const dir = DIRECTIONS[i % DIRECTIONS.length];
  const timing = TIMINGS[i % TIMINGS.length];
  const speed = +(0.6 + (i % 5) * 0.3).toFixed(1);
  const prettyType = animType.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  animationsManifest.push({
    id: `anim-${num}`,
    name: `${prettyType} (${dir.toUpperCase()} ${speed}x)`,
    category: 'animations',
    subcategory: sub,
    animationType: animType,
    speed,
    timing,
    direction: dir,
    description: `${sub.toUpperCase()} preset: ${prettyType} motion towards ${dir} at ${speed}x speed`,
    badge: `${speed}x ${timing}`,
    tags: ['animation', 'motion', 'effect', sub, animType, dir, timing],
  });
}

// ================= 20 EDITABLE CHARTS =================
const CHART_TYPES = [
  'bar', 'horizontal-bar', 'donut', 'pie', 'line', 'progress-rings',
  'area', 'radar', 'stacked-bar', 'gauge', 'funnel'
];

const CHART_THEMES = [
  { title: 'Guest RSVP Confirmation', data: [{ label: 'Attending', value: 240, color: '#D4AF37' }, { label: 'VIP Family', value: 85, color: '#F43F5E' }, { label: 'Awaiting', value: 45, color: '#60A5FA' }] },
  { title: 'Ceremony Attendance Breakdown', data: [{ label: 'Haldi', value: 150, color: '#FBBF24' }, { label: 'Sangeet', value: 280, color: '#A855F7' }, { label: 'Vivah', value: 350, color: '#EF4444' }, { label: 'Reception', value: 420, color: '#10B981' }] },
  { title: 'Royal Banquet Cuisine Preference', data: [{ label: 'Rajasthani Thali', value: 45, color: '#F59E0B' }, { label: 'North Indian', value: 30, color: '#EC4899' }, { label: 'Jain Menu', value: 15, color: '#34D399' }, { label: 'Continental', value: 10, color: '#38BDF8' }] },
  { title: 'Wedding Budget Allocation (Lakhs)', data: [{ label: 'Palace Venue', value: 38, color: '#D4AF37' }, { label: 'Catering', value: 24, color: '#F43F5E' }, { label: 'Decor & Florals', value: 18, color: '#10B981' }, { label: 'Photography', value: 12, color: '#8B5CF6' }] },
  { title: 'Outstation Guest Accommodation', data: [{ label: 'Heritage Wing', value: 64, color: '#F59E0B' }, { label: 'Lake View Suite', value: 42, color: '#38BDF8' }, { label: 'Garden Villa', value: 36, color: '#34D399' }] },
];

const chartsManifest = [];
for (let i = 0; i < 20; i++) {
  const num = String(i + 1).padStart(2, '0');
  const chartType = CHART_TYPES[i % CHART_TYPES.length];
  const theme = CHART_THEMES[i % CHART_THEMES.length];
  chartsManifest.push({
    id: `chart-${num}`,
    name: `${theme.title} (${chartType.toUpperCase()})`,
    category: 'charts',
    chartType,
    title: theme.title,
    data: theme.data.map((d, idx) => ({
      ...d,
      value: d.value + ((i * 5 + idx * 3) % 25),
    })),
    tags: ['chart', 'graph', 'stats', 'data', chartType, ...theme.title.toLowerCase().split(/\s+/)],
  });
}

// ================= 20 INTERACTIVE FORMS =================
const FORM_TEMPLATES = [
  {
    title: 'Royal RSVP Confirmation',
    sub: 'Kindly respond before 15th November',
    submit: 'Confirm Presence',
    fields: [
      { id: 'f1', label: 'Guest Full Name', fieldType: 'text', placeholder: 'Maharaj / Shrimati...', value: 'Aarav & Family' },
      { id: 'f2', label: 'Attending Events', fieldType: 'select', options: ['All Ceremonies', 'Vivah & Reception Only', 'Sangeet & Vivah', 'Regretfully Unable'], value: 'All Ceremonies' },
      { id: 'f3', label: 'Number of Guests', fieldType: 'number', value: '4' },
    ],
  },
  {
    title: 'Banquet Dietary Preference',
    sub: 'Help our Royal Khansamas serve you best',
    submit: 'Save Meal Choice',
    fields: [
      { id: 'f1', label: 'Cuisine Choice', fieldType: 'radio', options: ['Pure Vegetarian', 'Swaminarayan / Jain', 'Kids Mild Menu'], value: 'Pure Vegetarian' },
      { id: 'f2', label: 'Special Allergies / Notes', fieldType: 'text', placeholder: 'Nuts, dairy, etc.', value: 'No garlic' },
    ],
  },
  {
    title: 'Sangeet Night Song Request',
    sub: 'What track will get you on the dance floor?',
    submit: 'Send to DJ',
    fields: [
      { id: 'f1', label: 'Bollywood / Punjabi Track', fieldType: 'text', placeholder: 'e.g. Kesariya / London Thumakda', value: 'Kesariya Royal Mix' },
      { id: 'f2', label: 'Dedicated To', fieldType: 'select', options: ['Bride & Groom', 'Ladkiwale', 'Ladkewale'], value: 'Bride & Groom' },
    ],
  },
  {
    title: 'Airport & Palace Shuttle Desk',
    sub: 'Complimentary Royal Chauffeur Pickup',
    submit: 'Book Chauffeur',
    fields: [
      { id: 'f1', label: 'Flight / Train Number', fieldType: 'text', placeholder: 'AI-402 / Shatabdi', value: 'UK-819 (Udaipur)' },
      { id: 'f2', label: 'Arrival Time', fieldType: 'select', options: ['Morning (8AM-12PM)', 'Afternoon (12PM-4PM)', 'Evening (4PM-9PM)'], value: 'Morning (8AM-12PM)' },
    ],
  },
  {
    title: 'Ashirwad & Blessings Book',
    sub: 'Write a heartfelt note for the couple',
    submit: 'Post Blessing',
    fields: [
      { id: 'f1', label: 'Your Name & City', fieldType: 'text', value: 'Sharma Parivar, Jaipur' },
      { id: 'f2', label: 'Blessing Message', fieldType: 'textarea', value: 'May Lord Ganesha bless your union with eternal joy!' },
    ],
  },
];

const formsManifest = [];
for (let i = 0; i < 20; i++) {
  const num = String(i + 1).padStart(2, '0');
  const tpl = FORM_TEMPLATES[i % FORM_TEMPLATES.length];
  const accents = ['#D4AF37', '#F43F5E', '#10B981', '#A855F7', '#38BDF8'];
  formsManifest.push({
    id: `form-${num}`,
    name: `${tpl.title} #${Math.floor(i / 5) + 1}`,
    category: 'forms',
    subcategory: i % 2 === 0 ? 'rsvp' : 'survey',
    formTitle: tpl.title,
    formSubtitle: tpl.sub,
    fields: tpl.fields,
    submitLabel: tpl.submit,
    accentColor: accents[i % accents.length],
    backgroundColor: 'rgba(20, 10, 14, 0.92)',
    borderColor: accents[i % accents.length],
    tags: ['form', 'rsvp', 'poll', 'input', 'interactive', ...tpl.title.toLowerCase().split(/\s+/)],
  });
}

// ================= 15 LIVE FORMULA SHEETS =================
const SHEET_TEMPLATES = [
  {
    title: 'Royal Wedding Master Budget (₹ Lakhs)',
    cols: ['Category', 'Estimate', 'Actual', 'Status'],
    cells: [
      ['Palace Venue', 35, 38, 'Booked'],
      ['Royal Catering', 22, 20, 'Advance Paid'],
      ['Floral & Mandap', 15, 16, 'Confirmed'],
      ['Jewelry & Trousseau', 28, 26, 'Purchased'],
      ['TOTAL (Formula)', '=SUM(B1:B4)', '=SUM(C1:C4)', 'Active'],
    ],
  },
  {
    title: 'Guest Room & Suite Allocation Sheet',
    cols: ['Wing Name', 'Rooms', 'Guests', 'Occupancy'],
    cells: [
      ['Maharaja Wing', 18, 36, 'VIP Family'],
      ['Lake Pichola Wing', 24, 52, 'Relatives'],
      ['Garden Courtyard', 30, 68, 'Friends'],
      ['Heritage Suites', 12, 24, 'Elders'],
      ['TOTAL COUNT', '=SUM(B1:B4)', '=SUM(C1:C4)', 'Full'],
    ],
  },
  {
    title: 'Shagun & Gift Envelope Tracker',
    cols: ['Family Name', 'Amount (₹)', 'Silver Coin', 'Note'],
    cells: [
      ['Singhal Parivar', 51000, 2, 'Blessings'],
      ['Mehta Brothers', 21000, 1, 'Vivah Gift'],
      ['Rajputana Clan', 101000, 5, 'Kanyadaan'],
      ['Agarwal Uncle', 11000, 1, 'Reception'],
      ['AVERAGE / TOTAL', '=SUM(B1:B4)', '=SUM(C1:C4)', 'Verified'],
    ],
  },
];

const sheetsManifest = [];
for (let i = 0; i < 15; i++) {
  const num = String(i + 1).padStart(2, '0');
  const tpl = SHEET_TEMPLATES[i % SHEET_TEMPLATES.length];
  const headerColors = ['#78350F', '#881337', '#064E3B', '#312E81', '#701A75'];
  sheetsManifest.push({
    id: `sheet-${num}`,
    name: `${tpl.title} v${Math.floor(i / 3) + 1}`,
    category: 'sheets',
    subcategory: 'spreadsheet',
    sheetTitle: tpl.title,
    columns: tpl.cols,
    cells: tpl.cells,
    headerBgColor: headerColors[i % headerColors.length],
    accentColor: '#D4AF37',
    tags: ['sheet', 'spreadsheet', 'excel', 'formula', 'budget', 'tracker', ...tpl.title.toLowerCase().split(/\s+/)],
  });
}

// ================= 20 EDITABLE TABLES =================
const TABLE_TEMPLATES = [
  {
    name: 'Shubh Vivah 3-Day Itinerary',
    rows: [
      ['Ceremony', 'Date & Time', 'Venue Lawn', 'Dress Code'],
      ['Haldi & Mehendi', '12 Dec • 11:00 AM', 'Surya Courtyard', 'Yellow & Green'],
      ['Royal Sangeet Gala', '12 Dec • 7:30 PM', 'Sheesh Mahal Ballroom', 'Indo-Western Glam'],
      ['Baraat & Pheras', '13 Dec • 4:30 PM', 'Lakefront Mandap', 'Royal Traditional'],
      ['Grand Reception', '14 Dec • 8:00 PM', 'Durbar Hall', 'Black Tie / Velvet'],
    ],
  },
  {
    name: 'Chhappan Bhog Banquet Menu',
    rows: [
      ['Course', 'Royal Dish', 'Specialty', 'Service'],
      ['Welcome Drink', 'Kesar Badam Thandai', 'Saffron Infused', 'Silver Goblet'],
      ['Royal Starters', 'Paneer Tikka & Dahi Kebab', 'Live Angithi', 'Butler Pass'],
      ['Main Feast', 'Dal Bukhara & Shahi Kofta', '24-Hr Slow Cooked', 'Royal Thali'],
      ['Grand Dessert', 'Hot Jalebi & Rabri Malpua', 'Pure Desi Ghee', 'Live Counter'],
    ],
  },
  {
    name: 'VIP Family Seating Chart',
    rows: [
      ['Table No.', 'Family Group', 'Relation', 'Host Coordinator'],
      ['Table #1 (Gold)', 'Bride & Groom Parents', 'Immediate Family', 'Rohan (+91-98111)'],
      ['Table #2 (Ruby)', 'Nanihal & Mama Parivar', 'Maternal Side', 'Priya (+91-98222)'],
      ['Table #3 (Emerald)', 'Chacha & Bua Ji Family', 'Paternal Side', 'Vikram (+91-98333)'],
      ['Table #4 (Sapphire)', 'College & Corporate Friends', 'VIP Guests', 'Neha (+91-98444)'],
    ],
  },
  {
    name: 'Vedic Muhurat & Ritual Timings',
    rows: [
      ['Vedic Ritual', 'Auspicious Muhurat', 'Priest / Lead', 'Location'],
      ['Ganesh Sthapana', '09:15 AM Sharp', 'Acharya Shastri Ji', 'Mandap Sanctum'],
      ['Gauri Puja & Tel Baan', '11:30 AM', 'Bride Maternal Uncles', 'Maharani Suite'],
      ['Ghurchadhi & Baraat', '05:15 PM', 'Groom & Barat Party', 'Main Palace Gate'],
      ['Jaimala & Saptapadi', '08:42 PM (Abhijit)', 'Both Families', 'Lotus Mandap'],
    ],
  },
];

const tablesManifest = [];
for (let i = 0; i < 20; i++) {
  const num = String(i + 1).padStart(2, '0');
  const tpl = TABLE_TEMPLATES[i % TABLE_TEMPLATES.length];
  const themes = [
    { hBg: '#58111A', hTxt: '#FDE68A', cBg: 'rgba(30, 8, 12, 0.88)', altBg: 'rgba(60, 14, 22, 0.88)', border: '#D4AF37' },
    { hBg: '#064E3B', hTxt: '#A7F3D0', cBg: 'rgba(6, 36, 28, 0.88)', altBg: 'rgba(12, 58, 44, 0.88)', border: '#34D399' },
    { hBg: '#1E1B4B', hTxt: '#DDD6FE', cBg: 'rgba(18, 16, 48, 0.88)', altBg: 'rgba(32, 28, 76, 0.88)', border: '#A78BFA' },
    { hBg: '#78350F', hTxt: '#FEF3C7', cBg: 'rgba(38, 18, 6, 0.90)', altBg: 'rgba(64, 30, 10, 0.90)', border: '#F59E0B' },
  ];
  const th = themes[i % themes.length];
  tablesManifest.push({
    id: `table-${num}`,
    name: `${tpl.name} (Style ${Math.floor(i / 4) + 1})`,
    category: 'tables',
    subcategory: 'schedule',
    rows: tpl.rows,
    headerBgColor: th.hBg,
    headerTextColor: th.hTxt,
    cellBgColor: th.cBg,
    altRowBgColor: th.altBg,
    textColor: '#FFFBEB',
    borderColor: th.border,
    tags: ['table', 'schedule', 'itinerary', 'menu', 'seating', ...tpl.name.toLowerCase().split(/\s+/)],
  });
}

// ================= 30 LIVE MOCKUPS (30 BESPOKE UNIQUE SVG FRAMES) =================
const MOCKUP_SPECS = [
  // 1-6: Core Royal Devices & Stationery
  { sub: 'phone', name: 'iPhone 16 Pro Gold WhatsApp Invite', rect: { x: 18, y: 10, w: 64, h: 80, rx: 8 }, frame: `<rect x="14" y="4" width="72" height="92" rx="12" fill="#111827" stroke="currentColor" stroke-width="3"/><rect x="38" y="7" width="24" height="4" rx="2" fill="currentColor"/><circle cx="58" cy="9" r="1.2" fill="#1E293B"/><line x1="36" y1="92" x2="64" y2="92" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>` },
  { sub: 'envelope', name: 'Royal Wax-Seal Velvet Envelope', rect: { x: 16, y: 8, w: 68, h: 64, rx: 4 }, frame: `<path d="M 8 36 L 50 64 L 92 36 V 94 H 8 Z" fill="#4A0E17" stroke="currentColor" stroke-width="2.5"/><path d="M 8 94 L 40 60 M 92 94 L 60 60" stroke="currentColor" stroke-width="1.2" opacity="0.6"/><circle cx="50" cy="64" r="9" fill="#D4AF37" stroke="#FEF3C7" stroke-width="1.5"/><polygon points="50,59 52,63 56,63 53,65 54,69 50,67 46,69 47,65 44,63 48,63" fill="#4A0E17"/>` },
  { sub: 'card', name: 'Arch Cut Deckle-Edge Print Card', rect: { x: 14, y: 10, w: 72, h: 80, rx: 28 }, frame: `<rect x="8" y="4" width="84" height="92" rx="6" fill="#1F1209" stroke="currentColor" stroke-width="2" stroke-dasharray="4 2"/><path d="M 12 8 H 24 M 12 8 V 20 M 88 8 H 76 M 88 8 V 20 M 12 92 H 24 M 12 92 V 80 M 88 92 H 76 M 88 92 V 80" stroke="currentColor" stroke-width="1.8"/>` },
  { sub: 'standee', name: 'Palatial Welcome Easel Standee', rect: { x: 20, y: 10, w: 60, h: 68, rx: 4 }, frame: `<path d="M 50 4 L 22 96 M 50 4 L 78 96 M 16 80 H 84 M 50 78 V 95" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><rect x="18" y="8" width="64" height="72" rx="4" fill="#111827" stroke="currentColor" stroke-width="2.5"/><circle cx="50" cy="4" r="2.5" fill="currentColor"/>` },
  { sub: 'laptop', name: 'MacBook Pro Wedding Website Preview', rect: { x: 14, y: 16, w: 72, h: 52, rx: 3 }, frame: `<rect x="10" y="12" width="80" height="60" rx="5" fill="#0F172A" stroke="currentColor" stroke-width="2.5"/><rect x="44" y="13" width="12" height="2.5" rx="1" fill="currentColor"/><path d="M 4 72 H 96 L 88 80 H 12 Z" fill="currentColor"/><rect x="42" y="73" width="16" height="2" rx="1" fill="#0F172A"/>` },
  { sub: 'tablet', name: 'iPad Pro Royal Digital Guestbook', rect: { x: 16, y: 12, w: 68, h: 76, rx: 6 }, frame: `<rect x="12" y="8" width="76" height="84" rx="9" fill="#1E293B" stroke="currentColor" stroke-width="3"/><circle cx="50" cy="10" r="1.2" fill="currentColor"/><line x1="42" y1="89" x2="58" y2="89" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>` },

  // 7-12: Heritage & Luxury Variants
  { sub: 'phone', name: 'Samsung Galaxy Fold Royal E-Invite', rect: { x: 14, y: 10, w: 72, h: 80, rx: 6 }, frame: `<rect x="10" y="6" width="80" height="88" rx="9" fill="#0F172A" stroke="currentColor" stroke-width="2.8"/><line x1="50" y1="6" x2="50" y2="94" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2" opacity="0.7"/><circle cx="30" cy="9" r="1.3" fill="currentColor"/><circle cx="70" cy="9" r="1.3" fill="currentColor"/>` },
  { sub: 'envelope', name: 'Mughal Jharokha Laser-Cut Pocket', rect: { x: 18, y: 10, w: 64, h: 66, rx: 16 }, frame: `<path d="M 10 32 Q 50 56 90 32 V 94 H 10 Z" fill="#3B0718" stroke="currentColor" stroke-width="2.5"/><path d="M 14 40 H 86 M 14 88 H 86" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/><polygon points="50,52 57,60 50,68 43,60" fill="currentColor"/>` },
  { sub: 'card', name: 'Gold Foil Beveled Acrylic Plaque', rect: { x: 16, y: 12, w: 68, h: 76, rx: 4 }, frame: `<polygon points="18,6 82,6 92,16 92,84 82,94 18,94 8,84 8,16" fill="#18120B" stroke="currentColor" stroke-width="2.6"/><polygon points="21,10 79,10 88,19 88,81 79,90 21,90 12,81 12,19" fill="none" stroke="currentColor" stroke-width="0.9" stroke-dasharray="3 2"/>` },
  { sub: 'standee', name: 'Royal Palace Arch Welcome Board', rect: { x: 20, y: 14, w: 60, h: 64, rx: 24 }, frame: `<path d="M 24 78 L 16 96 M 76 78 L 84 96 M 14 88 H 86" stroke="currentColor" stroke-width="3" stroke-linecap="round"/><path d="M 16 80 V 36 A 34 30 0 0 1 84 36 V 80 Z" fill="#111827" stroke="currentColor" stroke-width="2.8"/><circle cx="50" cy="5" r="2.5" fill="currentColor"/>` },
  { sub: 'laptop', name: 'iMac 24-Inch Studio Wedding Hub', rect: { x: 10, y: 10, w: 80, h: 54, rx: 3 }, frame: `<rect x="6" y="6" width="88" height="66" rx="5" fill="#0F172A" stroke="currentColor" stroke-width="2.6"/><circle cx="50" cy="68" r="2" fill="currentColor"/><path d="M 42 72 L 36 88 H 64 L 58 72 Z" fill="currentColor" fill-opacity="0.7" stroke="currentColor" stroke-width="2"/><line x1="28" y1="88" x2="72" y2="88" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>` },
  { sub: 'tablet', name: 'Landscape Digital Photo Frame', rect: { x: 12, y: 18, w: 76, h: 64, rx: 5 }, frame: `<rect x="6" y="12" width="88" height="76" rx="8" fill="#1E293B" stroke="currentColor" stroke-width="3"/><rect x="9" y="15" width="82" height="70" rx="6" fill="none" stroke="currentColor" stroke-width="0.9" stroke-dasharray="3 2"/><path d="M 36 88 L 42 95 H 58 L 64 88" fill="currentColor"/>` },

  // 13-18: Ornate Box, Scroll & Frame Mockups
  { sub: 'phone', name: 'Rose Gold Minimal Bezel Phone', rect: { x: 20, y: 8, w: 60, h: 84, rx: 10 }, frame: `<rect x="16" y="4" width="68" height="92" rx="14" fill="#1C1018" stroke="currentColor" stroke-width="2.8"/><circle cx="50" cy="7" r="1.8" fill="currentColor"/><rect x="84" y="24" width="2" height="12" rx="1" fill="currentColor"/><rect x="84" y="42" width="2" height="18" rx="1" fill="currentColor"/>` },
  { sub: 'envelope', name: 'Zari Tassel Ribbon Shagun Lifafa', rect: { x: 22, y: 8, w: 56, h: 78, rx: 4 }, frame: `<rect x="16" y="4" width="68" height="88" rx="6" fill="#58111A" stroke="currentColor" stroke-width="2.6"/><path d="M 16 26 L 50 48 L 84 26" fill="none" stroke="currentColor" stroke-width="2"/><line x1="16" y1="48" x2="84" y2="48" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 2"/><circle cx="50" cy="48" r="6" fill="currentColor"/>` },
  { sub: 'card', name: 'Royal Farmaan Silk Scroll Case', rect: { x: 18, y: 14, w: 64, h: 72, rx: 2 }, frame: `<rect x="10" y="8" width="80" height="6" rx="3" fill="currentColor"/><rect x="10" y="86" width="80" height="6" rx="3" fill="currentColor"/><circle cx="8" cy="11" r="4" fill="currentColor"/><circle cx="92" cy="11" r="4" fill="currentColor"/><circle cx="8" cy="89" r="4" fill="currentColor"/><circle cx="92" cy="89" r="4" fill="currentColor"/><rect x="16" y="14" width="68" height="72" fill="#1F1209" stroke="currentColor" stroke-width="2"/>` },
  { sub: 'standee', name: 'Golden Marigold Garland Easel', rect: { x: 20, y: 14, w: 60, h: 64, rx: 4 }, frame: `<path d="M 50 4 L 20 96 M 50 4 L 80 96 M 14 80 H 86" stroke="currentColor" stroke-width="3"/><rect x="18" y="12" width="64" height="68" rx="5" fill="#111827" stroke="currentColor" stroke-width="2.5"/><circle cx="22" cy="12" r="3.5" fill="currentColor"/><circle cx="36" cy="12" r="3.5" fill="currentColor"/><circle cx="50" cy="12" r="3.5" fill="currentColor"/><circle cx="64" cy="12" r="3.5" fill="currentColor"/><circle cx="78" cy="12" r="3.5" fill="currentColor"/>` },
  { sub: 'laptop', name: 'Dual-Screen Event Live Stream Desk', rect: { x: 12, y: 14, w: 76, h: 52, rx: 4 }, frame: `<rect x="8" y="10" width="84" height="60" rx="6" fill="#0F172A" stroke="currentColor" stroke-width="2.5"/><path d="M 2 70 H 98 L 90 78 H 10 Z" fill="currentColor" fill-opacity="0.85"/><line x1="34" y1="82" x2="66" y2="82" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>` },
  { sub: 'tablet', name: ' Brass Kiosk Touch Check-In Stand', rect: { x: 18, y: 10, w: 64, h: 64, rx: 6 }, frame: `<rect x="14" y="6" width="72" height="72" rx="9" fill="#1E293B" stroke="currentColor" stroke-width="3"/><path d="M 42 78 L 36 94 H 64 L 58 78 Z" fill="currentColor" fill-opacity="0.6" stroke="currentColor" stroke-width="2"/><rect x="24" y="92" width="52" height="4" rx="2" fill="currentColor"/>` },

  // 19-24: Couture Stationery & Display Suites
  { sub: 'phone', name: 'Curved Edge Luxury Titanium Phone', rect: { x: 18, y: 9, w: 64, h: 82, rx: 9 }, frame: `<rect x="14" y="5" width="72" height="90" rx="13" fill="#090D16" stroke="currentColor" stroke-width="3"/><rect x="16" y="7" width="68" height="86" rx="11" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 2"/><rect x="40" y="8" width="20" height="3.5" rx="1.7" fill="currentColor"/>` },
  { sub: 'envelope', name: 'Peacock Crest Lined Couture Envelope', rect: { x: 16, y: 8, w: 68, h: 62, rx: 4 }, frame: `<path d="M 8 34 L 50 62 L 92 34 V 94 H 8 Z" fill="#06392C" stroke="currentColor" stroke-width="2.5"/><path d="M 8 34 L 50 6 L 92 34" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="62" r="8" fill="currentColor"/><circle cx="50" cy="62" r="4" fill="#06392C"/>` },
  { sub: 'card', name: 'Scalloped Lotus Die-Cut Invitation', rect: { x: 16, y: 12, w: 68, h: 76, rx: 14 }, frame: `<rect x="10" y="6" width="80" height="88" rx="16" fill="#230C14" stroke="currentColor" stroke-width="2.8"/><circle cx="50" cy="6" r="4" fill="currentColor"/><circle cx="50" cy="94" r="4" fill="currentColor"/><circle cx="10" cy="50" r="4" fill="currentColor"/><circle cx="90" cy="50" r="4" fill="currentColor"/>` },
  { sub: 'standee', name: 'Ornate Hanging Banner Standee', rect: { x: 20, y: 14, w: 60, h: 68, rx: 3 }, frame: `<line x1="10" y1="8" x2="90" y2="8" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"/><line x1="24" y1="8" x2="24" y2="14" stroke="currentColor" stroke-width="2.5"/><line x1="76" y1="8" x2="76" y2="14" stroke="currentColor" stroke-width="2.5"/><rect x="18" y="12" width="64" height="72" rx="4" fill="#111827" stroke="currentColor" stroke-width="2.5"/><path d="M 30 84 L 22 95 M 70 84 L 78 95 M 50 84 V 96" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>` },
  { sub: 'laptop', name: 'Ultrabook Gold Slim Folio Preview', rect: { x: 14, y: 16, w: 72, h: 50, rx: 3 }, frame: `<rect x="11" y="13" width="78" height="56" rx="4" fill="#111827" stroke="currentColor" stroke-width="2.4"/><path d="M 3 69 H 97 L 93 74 H 7 Z" fill="currentColor"/><path d="M 16 74 H 84" stroke="currentColor" stroke-width="1.5"/>` },
  { sub: 'tablet', name: 'Ornate Filigree Brass Tablet Frame', rect: { x: 18, y: 14, w: 64, h: 72, rx: 6 }, frame: `<rect x="12" y="8" width="76" height="84" rx="10" fill="#1E1B4B" stroke="currentColor" stroke-width="3"/><polygon points="50,3 54,8 46,8" fill="currentColor"/><polygon points="50,97 54,92 46,92" fill="currentColor"/><polygon points="7,50 12,54 12,46" fill="currentColor"/><polygon points="93,50 88,54 88,46" fill="currentColor"/>` },

  // 25-30: Collectors Edition & Royal Keepsake Mockups
  { sub: 'phone', name: ' Maharani Jewel-Crust Phone Frame', rect: { x: 19, y: 10, w: 62, h: 80, rx: 8 }, frame: `<rect x="14" y="5" width="72" height="90" rx="12" fill="#2A0810" stroke="currentColor" stroke-width="3"/><circle cx="18" cy="9" r="2" fill="currentColor"/><circle cx="82" cy="9" r="2" fill="currentColor"/><circle cx="18" cy="91" r="2" fill="currentColor"/><circle cx="82" cy="91" r="2" fill="currentColor"/><rect x="38" y="7" width="24" height="3.5" rx="1.7" fill="currentColor"/>` },
  { sub: 'envelope', name: 'Velvet Box & Mithai Suite Envelope', rect: { x: 18, y: 10, w: 64, h: 64, rx: 4 }, frame: `<rect x="10" y="6" width="80" height="88" rx="6" fill="#3B0A14" stroke="currentColor" stroke-width="2.8"/><path d="M 10 42 L 50 68 L 90 42 V 94 H 10 Z" fill="#58111A" stroke="currentColor" stroke-width="2.2"/><polygon points="50,58 58,66 50,74 42,66" fill="currentColor" stroke="#FEF3C7" stroke-width="1.2"/>` },
  { sub: 'card', name: 'Tri-Fold Gatefold Palace Card', rect: { x: 20, y: 10, w: 60, h: 80, rx: 4 }, frame: `<path d="M 6 14 L 18 8 V 92 L 6 86 Z M 94 14 L 82 8 V 92 L 94 86 Z" fill="#2D1606" stroke="currentColor" stroke-width="2"/><rect x="18" y="8" width="64" height="84" rx="4" fill="#1F1209" stroke="currentColor" stroke-width="2.6"/>` },
  { sub: 'standee', name: 'Mandap Entrance Pillar Standee', rect: { x: 22, y: 14, w: 56, h: 68, rx: 4 }, frame: `<rect x="12" y="10" width="6" height="82" rx="2" fill="currentColor" fill-opacity="0.45" stroke="currentColor" stroke-width="1.8"/><rect x="82" y="10" width="6" height="82" rx="2" fill="currentColor" fill-opacity="0.45" stroke="currentColor" stroke-width="1.8"/><path d="M 8 10 Q 50 2 92 10" fill="none" stroke="currentColor" stroke-width="3"/><rect x="20" y="12" width="60" height="72" rx="4" fill="#111827" stroke="currentColor" stroke-width="2.4"/><line x1="8" y1="92" x2="92" y2="92" stroke="currentColor" stroke-width="3.5"/>` },
  { sub: 'laptop', name: 'Curved Ultrawide Cinema Showcase', rect: { x: 8, y: 16, w: 84, h: 48, rx: 4 }, frame: `<rect x="4" y="12" width="92" height="56" rx="6" fill="#0F172A" stroke="currentColor" stroke-width="2.6"/><path d="M 46 68 V 84 M 54 68 V 84 M 30 84 Q 50 78 70 84" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>` },
  { sub: 'tablet', name: 'Royal Pedestal Gallery Kiosk', rect: { x: 16, y: 10, w: 68, h: 68, rx: 8 }, frame: `<rect x="12" y="6" width="76" height="76" rx="11" fill="#1E293B" stroke="currentColor" stroke-width="2.8"/><circle cx="50" cy="79" r="1.8" fill="currentColor"/><path d="M 34 82 L 26 95 H 74 L 66 82" fill="currentColor" fill-opacity="0.4" stroke="currentColor" stroke-width="2"/>` },
];

const mockupsManifest = [];
for (let i = 0; i < 30; i++) {
  const num = String(i + 1).padStart(2, '0');
  const spec = MOCKUP_SPECS[i];
  const colors = ['#D4AF37', '#F43F5E', '#34D399', '#A78BFA', '#FBBF24', '#38BDF8'];
  mockupsManifest.push({
    id: `mockup-${num}`,
    name: spec.name,
    category: 'mockups',
    subcategory: spec.sub,
    frameSvg: spec.frame,
    screenRect: spec.rect,
    defaultCaption: `${spec.name.split(' ').slice(0, 3).join(' ')}`,
    accentColor: colors[i % colors.length],
    tags: ['mockup', 'device', 'stationery', spec.sub, ...spec.name.toLowerCase().split(/\s+/)],
  });
}

// ================= 30 INTERACTIVE 3D MODELS =================
const MODEL_GEOMETRIES = [
  { geo: 'kalash-3d', name: '3D Sacred Golden Kalash', sub: 'wedding' },
  { geo: 'lotus-3d', name: '3D Blooming Padma Lotus', sub: 'wedding' },
  { geo: 'ring-torus', name: '3D Solitaire Engagement Ring', sub: 'wedding' },
  { geo: 'royal-crown', name: '3D Rajputana Maharaja Crown', sub: 'royal' },
  { geo: 'diya-3d', name: '3D Illuminated Brass Diya', sub: 'wedding' },
  { geo: 'mandap-pillar', name: '3D Carved Temple Pillar', sub: 'royal' },
  { geo: 'diamond-gem', name: '3D Kohinoor Cut Diamond', sub: 'royal' },
  { geo: 'sphere-orb', name: '3D Surya Gold Orb', sub: 'celestial' },
  { geo: 'cube-matrix', name: '3D Sacred Havan Kund Cube', sub: 'geometric' },
  { geo: 'pyramid-prism', name: '3D Meru Shree Yantra Prism', sub: 'geometric' },
  { geo: 'star-poly', name: '3D Nakshatra Star Polyhedron', sub: 'celestial' },
  { geo: 'heart-crystal', name: '3D Rose Quartz Love Crystal', sub: 'wedding' },
  { geo: 'chandelier-3d', name: '3D Palace Crystal Chandelier', sub: 'royal' },
  { geo: 'drum-dhol', name: '3D Festive Punjabi Dhol', sub: 'wedding' },
  { geo: 'helix-spiral', name: '3D Golden DNA Swirl Sculpture', sub: 'abstract' },
];

const models3dManifest = [];
for (let i = 0; i < 30; i++) {
  const num = String(i + 1).padStart(2, '0');
  const spec = MODEL_GEOMETRIES[i % MODEL_GEOMETRIES.length];
  const variant = Math.floor(i / MODEL_GEOMETRIES.length) + 1;
  const palettes = [
    ['#F59E0B', '#78350F'],
    ['#F43F5E', '#881337'],
    ['#10B981', '#064E3B'],
    ['#A855F7', '#3B0764'],
    ['#38BDF8', '#0C4A6E'],
  ];
  const pal = palettes[i % palettes.length];
  models3dManifest.push({
    id: `model3d-${num}`,
    name: `${spec.name} ${variant === 1 ? '(24K Gold)' : '(Royal Jewel)'}`,
    category: '3d',
    subcategory: spec.sub,
    geometryType: spec.geo,
    primaryColor: pal[0],
    secondaryColor: pal[1],
    metalness: 0.85,
    roughness: 0.2,
    defaultPitch: 15 + (i % 4) * 8,
    defaultYaw: (i * 25) % 360 - 180,
    tags: ['3d', 'model', 'webgl', 'rotate', spec.sub, spec.geo, ...spec.name.toLowerCase().split(/\s+/)],
  });
}

fs.writeFileSync(
  path.join(DATA_DIR, 'mediaInteractiveManifest.ts'),
  `// AUTO-GENERATED MEDIA & INTERACTIVE ELEMENTS MANIFEST
// 120 Photos + 40 Videos + 60 Audio + 40 Animations + 20 Charts + 20 Forms + 15 Sheets + 20 Tables + 30 Mockups + 30 3D = 395 Items
import {
  PhotoAssetItem,
  VideoAssetItem,
  AudioAssetItem,
  AnimationAssetItem,
  ChartAssetItem,
  FormAssetItem,
  SheetAssetItem,
  TableAssetItem,
  MockupAssetItem,
  Model3DAssetItem,
} from '../../types/elements';

export const PHOTOS_LIBRARY_ITEMS: PhotoAssetItem[] = ${JSON.stringify(photosManifest, null, 2)};
export const VIDEOS_LIBRARY_ITEMS: VideoAssetItem[] = ${JSON.stringify(videosManifest, null, 2)};
export const AUDIO_LIBRARY_ITEMS: AudioAssetItem[] = ${JSON.stringify(audioManifest, null, 2)};
export const ANIMATIONS_LIBRARY_ITEMS: AnimationAssetItem[] = ${JSON.stringify(animationsManifest, null, 2)};
export const CHARTS_LIBRARY_ITEMS: ChartAssetItem[] = ${JSON.stringify(chartsManifest, null, 2)};
export const FORMS_LIBRARY_ITEMS: FormAssetItem[] = ${JSON.stringify(formsManifest, null, 2)};
export const SHEETS_LIBRARY_ITEMS: SheetAssetItem[] = ${JSON.stringify(sheetsManifest, null, 2)};
export const TABLES_LIBRARY_ITEMS: TableAssetItem[] = ${JSON.stringify(tablesManifest, null, 2)};
export const MOCKUPS_LIBRARY_ITEMS: MockupAssetItem[] = ${JSON.stringify(mockupsManifest, null, 2)};
export const MODELS3D_LIBRARY_ITEMS: Model3DAssetItem[] = ${JSON.stringify(models3dManifest, null, 2)};
`,
  'utf-8'
);

console.log('Generated Interactive & Media Manifests:', {
  photos: photosManifest.length,
  videos: videosManifest.length,
  audio: audioManifest.length,
  animations: animationsManifest.length,
  charts: chartsManifest.length,
  forms: formsManifest.length,
  sheets: sheetsManifest.length,
  tables: tablesManifest.length,
  mockups: mockupsManifest.length,
  models3d: models3dManifest.length,
});
