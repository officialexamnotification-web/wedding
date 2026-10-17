import fs from 'fs';
import path from 'path';

const PUBLIC_GRAPHICS_DIR = path.resolve('public/assets/elements/graphics');
const DATA_DIR = path.resolve('src/data/elements');

fs.mkdirSync(PUBLIC_GRAPHICS_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

const GRAPHIC_SPECS = [
  {
    id: 'flowers-botanicals',
    count: 60,
    label: 'Flowers & Botanicals',
    color: '#D4AF37',
    names: [
      'Royal Lotus Bloom', 'Sacred Kamal Bud', 'Marigold Garland', 'Jasmine Veni', 'Rose Petal Cluster',
      'Peony Blossom', 'Hibiscus Motifs', 'Ashoka Leaf Toran', 'Mango Leaf Bandhanwar', 'Banyan Sacred Leaf',
      'Tulsi Sprig', 'Mughal Floral Vine', 'Rajasthani Bel', 'Champa Flower', 'Mogra Garland',
      'Orchid Spray', 'Lily Stem', 'Sunflower Mandala', 'Dahlia Rosette', 'Chrysanthemum Gold',
      'Bougainvillea Branch', 'Palm Frond Royal', 'Eucalyptus Wreath', 'Olive Branch Crest', 'Fern Filigree',
      'Bamboo Shoot', 'Pomegranate Motif', 'Fig Leaf Ornate', 'Vine Corner Left', 'Vine Corner Right',
      'Floral Arch Top', 'Botanical Divider', 'Petal Shower', 'Blooming Urn', 'Gajra Bracelet',
      'Varmala Garland', 'Jaimala Rose Ring', 'Lotus Pond Motif', 'Twin Lotus Stem', 'Mandala Petal Ring',
      'Henna Paisley Flower', 'Mehendi vine', 'Zari Floral Buta', 'Kundan Flower Brooch', 'Polki Floral Drop',
      'Saffron Crocus', 'Cardamom Pod', 'Clove Spice Star', 'Cinnamon Scroll', 'Betel Leaf Paan',
      'Sacred Coconut Leaf', 'Banana Tree Arch', 'Roses & Pearls', 'Golden Wheat Stalk', 'Wildflower Bouquet',
      'Royal Garden Wreath', 'Creeping Ivy Border', 'Symmetrical Arabesque', 'Pietra Dura Inlay', 'Palace Garden Crest'
    ],
  },
  {
    id: 'celebration-festive',
    count: 60,
    label: 'Celebration & Wedding',
    color: '#F59E0B',
    names: [
      'Shubh Mangal Kalash', 'Lord Ganesha Emblem', 'Om Sacred Symbol', 'Swastik Auspicious', 'Shubh Labh Seal',
      'Royal Shehnai Pair', 'Punjabi Dhol Drum', 'Tabla Classical', 'Sitar Royal Strings', 'Veena Saraswati',
      'Bansuri Flute', 'Deepak Clay Diya', 'Panch Aarti Lamp', 'Hanging Temple Bell', 'Conch Shankh',
      'Royal Palki Dolli', 'Baraat Horse', 'Decorated Royal Elephant', 'Udaipur Peacock', 'Twin Love Swans',
      'Vedic Agni Kund', 'Saptapadi Seven Steps', 'Sindoor Dan Box', 'Mangalsutra Pendant', 'Chooda Bangles',
      'Kaleera Hanging', 'Groom Safa Turban', 'Kalgi Feather Jewel', 'Royal Sword Talwar', 'Mehendi Hand Motif',
      'Haldi Bowl & Brush', 'Sangeet Mic & Notes', 'Cocktail Chandelier', 'Fireworks Sparkle', 'Confetti Popper',
      'Lantern Kandil', 'Toran Door Hanging', 'Rangoli Floor Star', 'Alpana Bengal Motif', 'Kolam South Indian',
      'Wedding Rings Interlocked', 'Heart Padlock', 'Champagne Flute Toast', 'Tiered Wedding Cake', 'Gift Shagun Box',
      'Royal Wax Seal Envelope', 'Scroll Farman', 'Palace Jharokha', 'Chhatri Dome Pavilion', 'Mandap Four Pillars',
      'Baraat Umbrella Chhatra', 'Royal Chamar Fan', 'Rose Water Gulabdan', 'Ittar Perfume Bottle', 'Paan Daan Silver',
      'Nagara Kettle Drum', 'Manjira Cymbals', 'Ghunghroo Anklet', 'Kathak Mudra', 'Auspicious Kalash Coconut'
    ],
  },
  {
    id: 'food-drinks',
    count: 50,
    label: 'Royal Feast & Drinks',
    color: '#FBBF24',
    names: [
      'Royal Silver Thali', 'Motichoor Laddu Box', 'Kaju Katli Diamond', 'Rasgulla Bowl', 'Gulab Jamun Pot',
      'Jalebi Saffron Swirl', 'Kesar Pista Kulfi', 'Badam Milk Goblet', 'Masala Chai Kulhad', 'Filter Coffee Dabara',
      'Mughlai Biryani Handi', 'Shahi Paneer Bowl', 'Butter Naan Basket', 'Samosa Platter', 'Rajbhog Sweet',
      'Ghevar Rajasthani', 'Modak Auspicious', 'Peda Mathura', 'Barfi Silver Leaf', 'Halwa Bowl',
      'Pani Puri Golgappa', 'Dahi Bhalla Plate', 'Chaat Royal Cart', 'Tandoori Kebabs', 'Dal Makhani Pot',
      'Pulao Saffron', 'Raita Boondi', 'Papad Crispy', 'Pickle Achar Jar', 'Chutney Trio',
      'Thandai Festive Glass', 'Rose Sharbat Pitcher', 'Mango Lassi Tall', 'Coconut Water Fresh', 'Jaljeera Cooler',
      'Mocktail Flamingo', 'Champagne Tower', 'Wine Carafe Royal', 'Espresso Cup', 'Tiered Dessert Stand',
      'Macaron Tower', 'Chocolate Fountain', 'Fruit Carving Platter', 'Dry Fruit Gift Box', 'Almond Badam Bowl',
      'Cashew Kaju Dish', 'Pistachio Pista', 'Raisin Kishmish', 'Paan Gilori Silver', 'Mukhwas Fennel Bowl'
    ],
  },
  {
    id: 'people-avatars',
    count: 50,
    label: 'Bride, Groom & Guests',
    color: '#F472B6',
    names: [
      'Royal Rajput Groom', 'Maharani Bride Veil', 'Bride & Groom Varmala', 'Phera Walking Couple', 'Sangeet Dancing Couple',
      'Haldi Smiling Bride', 'Mehendi Bride Hands', 'Groom onghodi Horse', 'South Indian Bride', 'South Indian Groom',
      'Sikh Anand Karaj Couple', 'Bengali Topor Couple', 'Maharashtrian Mundavalya', 'Gujarati Panetar Bride', 'Kashmiri Pheran Couple',
      'Punjabi Bhangra Dancer', 'Garba Dandiya Pair', 'Ghoomar Rajasthani Dancer', 'Classical Kathak Dancer', 'Bharatanatyam Pose',
      'Shehnai Player Avatar', 'Dhol Wala Drummer', 'Sitar Maestro', 'Bridesmaid Sakhi', 'Groomsman Yaar',
      'Father of Bride Blessing', 'Mother with Aarti Thali', 'Grandparents Ashirwad', 'Little Flower Girl', 'Ring Bearer Boy',
      'Pandit Ji Vedic', 'Wedding Photographer', 'DJ Sangeet Mixer', 'Royal Darban Guard', 'Chhatra Holder Attendant',
      'Couple Silhouette Arch', 'Bride Portrait Jharokha', 'Groom Portrait Crest', 'Romantic Gazebo Couple', 'Reception Waltz Pair',
      'Modern Tuxedo Groom', 'Lehenga Twirl Bride', 'Saree Drape Silhouette', 'Sherwani Royal Crest', 'Pagdi Tying Ceremony',
      'Chooda Ceremony Uncle', 'Vidaai Emotional Hug', 'Griha Pravesh Couple', 'First Dance Spotlight', 'Forever Together Monogram'
    ],
  },
  {
    id: 'business-marketing',
    count: 50,
    label: 'Venue, Map & Icons',
    color: '#60A5FA',
    names: [
      'Palace Venue Pin', 'Google Maps Marker', 'Valet Parking Car', 'Royal Carriage Route', 'Airport Pickup Plane',
      'Train Station Junction', 'Luxury Hotel Heritage', 'Resort Poolside Icon', 'Banquet Hall Crest', 'Lawns & Gardens',
      'Date Calendar Page', 'Auspicious Muhurat Clock', 'RSVP Phone Call', 'WhatsApp Confirm Icon', 'Email Envelope Seal',
      'QR Scan Frame Icon', 'Live Stream Camera', 'Wedding Hashtag Sign', 'Wi-Fi Guest Zone', 'Gift Registry QR',
      'No Boxed Gifts Icon', 'Blessings Only Folded Hands', 'Dress Code Traditional', 'Dress Code Black Tie', 'Haldi Yellow Attire',
      'Mehendi Green Attire', 'Sangeet Glam Attire', 'Weather Sunny Icon', 'Winter Shawl Advisory', 'Umbrella Monsoon',
      'Medical First Aid', 'Wheelchair Accessible', 'Kids Play Zone', 'Pet Friendly Venue', 'Security Gate Pass',
      'VIP Lounge Star', 'Stage Backdrop Icon', 'Dining Area Fork Spoon', 'Bar Counter Glass', 'Photo Booth Frame',
      'Drone Photography Notice', 'Unplugged Ceremony Phone Off', 'Fire Exit Route', 'Washroom Restroom', 'Cloakroom Coat',
      'Concierge Help Desk', 'Shuttle Bus Timing', 'Room Key Card', 'Welcome Hamper Basket', 'Thank You Favor Bag'
    ],
  },
  {
    id: 'arrows-doodles',
    count: 40,
    label: 'Ornate Doodles & Flourishes',
    color: '#FCD34D',
    names: [
      'Royal Filigree Flourish', 'Mughal Scroll Divider', 'Victorian Gold Swirl', 'Calligraphy Under-swash', 'Lotus Center Rule',
      'Peacock Feather Divider', 'Diamond Lattice Strip', 'Zari Scallop Trim', 'Temple Gopuram Border', 'Mehendi Arch Corner',
      'Curly Pointer Right', 'Curly Pointer Left', 'Looping Heart Arrow', 'Sparkle Trail Curve', 'Starry Swoosh',
      'Crown Top Flourish', 'Bottom Chandelier Drop', 'Side Bracket Left', 'Side Bracket Right', 'Ornate Frame Corner TL',
      'Ornate Frame Corner TR', 'Ornate Frame Corner BL', 'Ornate Frame Corner BR', 'Double Wave Ribbon', 'Triple Dot Diamond',
      'Sunburst Ray Divider', 'Crescent Moon Swirl', 'Paisley Kairi Chain', 'Elephant Parade Strip', 'Doli Procession Line',
      'Musical Swirl Notes', 'Dotted Route Path', 'Hand-drawn Heart Loop', 'Infinity Love Knot', 'Celtic Royal Braid',
      'Tassel Latkan Drop', 'Pearl String Swag', 'Jhumka Chandelier Hang', 'Marigold String Toran', 'Festive Bunting Flags'
    ],
  },
  {
    id: 'stickers-badges',
    count: 50,
    label: 'Royal Seals & Badges',
    color: '#F59E0B',
    names: [
      'Shubh Vivah Gold Seal', 'Save The Date Rosette', 'Royal Invitation Crest', 'Nimantran Patrika Stamp', 'You Are Invited Ribbon',
      'Bride Side Team Badge', 'Groom Side Team Badge', 'Ladkiwale Royal Crest', 'Ladkewale Royal Crest', 'VIP Guest Pass Seal',
      'Haldi Rasam Sticker', 'Mehendi Night Badge', 'Sangeet Sandhya Seal', 'Baraat Swagat Stamp', 'Subh Muhurat Crest',
      'Reception Gala Badge', 'Cocktail Night Neon', 'After Party Pass', 'Griha Pravesh Seal', 'Satyanarayan Katha Stamp',
      'Happy Anniversary Seal', '1st Birthday Royal Badge', 'Baby Shower Godh Bharai', 'Naamkaran Ceremony Seal', 'Mundan Sanskar Badge',
      'Roka Ceremony Stamp', 'Sagai Engagement Ring Seal', 'Tilak Ceremony Crest', 'Bhaat Myra Badge', 'Chooda Rasam Seal',
      'Royal Wax Stamp Red', 'Gold Foil Emboss Seal', 'Kundan Studded Brooch', 'Mayura Peacock Crest', 'Surya Vanshi Sun Seal',
      'Chandra Vanshi Moon', 'Rajwada Heritage Stamp', 'Udaipur Palace Crest', 'Jaipur Pink City Seal', 'Jodhpur Blue Sun Badge',
      'Jaisalmer Golden Fort', 'Bikaner Royal Emblem', '100% Auspicious Stamp', 'Made in Heaven Badge', 'Two Souls One Heart',
      'Happily Ever After Seal', 'RSVP Requested Stamp', 'With Best Compliments', 'Awaiting Your Presence', 'Shubh Ashirwad Seal'
    ],
  },
];

function createGraphicSvg(subId, idx, name) {
  const seed = idx + 1;
  const petals = 6 + (seed % 7);
  const rOut = 34 + (seed % 8);
  const rIn = 14 + (seed % 6);

  if (subId === 'flowers-botanicals') {
    let petalPaths = '';
    for (let p = 0; p < petals; p++) {
      const ang = (p * 360) / petals;
      petalPaths += `<path d="M 50 50 C ${42 - (seed % 4)} 30, ${44 - (seed % 3)} 14, 50 ${50 - rOut} C ${56 + (seed % 3)} 14, ${58 + (seed % 4)} 30, 50 50 Z" transform="rotate(${ang} 50 50)" fill="currentColor" fill-opacity="0.24" stroke="currentColor" stroke-width="1.8"/>`;
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${petalPaths}<circle cx="50" cy="50" r="${rIn * 0.55}" fill="currentColor" stroke="currentColor" stroke-width="2"/><circle cx="50" cy="50" r="${rOut + 4}" stroke="currentColor" stroke-width="1" stroke-dasharray="2 3"/></svg>`;
  }

  if (subId === 'celebration-festive') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="42" stroke="currentColor" stroke-width="1.5" stroke-dasharray="${seed % 2 === 0 ? '4 2' : 'none'}"/>
      <path d="M 30 ${68 - (seed % 6)} C 24 48, 34 32, 50 28 C 66 32, 76 48, 70 ${68 - (seed % 6)} Z" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="2.2"/>
      <path d="M 50 12 C 44 20, 44 26, 50 28 C 56 26, 56 20, 50 12 Z" fill="currentColor"/>
      <path d="M 22 72 H 78 M 28 78 H 72" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="50" cy="50" r="${5 + (seed % 4)}" fill="currentColor" fill-opacity="0.5"/>
    </svg>`;
  }

  if (subId === 'food-drinks') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="70" rx="${34 + (seed % 6)}" ry="12" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2.2"/>
      <path d="M 22 54 C 22 76, 78 76, 78 54 Z" fill="currentColor" fill-opacity="0.26" stroke="currentColor" stroke-width="2.2"/>
      <circle cx="38" cy="48" r="6" fill="currentColor" fill-opacity="0.4" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="50" cy="44" r="6.5" fill="currentColor" fill-opacity="0.4" stroke="currentColor" stroke-width="1.6"/>
      <circle cx="62" cy="48" r="6" fill="currentColor" fill-opacity="0.4" stroke="currentColor" stroke-width="1.6"/>
      <path d="M 42 28 Q 46 20 42 14 M 56 26 Q 60 18 56 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    </svg>`;
  }

  if (subId === 'people-avatars') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <path d="M 14 88 V 44 A 36 36 0 0 1 86 44 V 88 Z" stroke="currentColor" stroke-width="1.8" fill="currentColor" fill-opacity="0.08"/>
      <circle cx="${seed % 2 === 0 ? 40 : 50}" cy="38" r="10" fill="currentColor" fill-opacity="0.28" stroke="currentColor" stroke-width="2.2"/>
      ${seed % 2 === 0 ? `<circle cx="62" cy="40" r="9" fill="currentColor" fill-opacity="0.28" stroke="currentColor" stroke-width="2.2"/>` : ''}
      <path d="M 24 84 C 24 62, 56 62, 56 84 Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>
      ${seed % 2 === 0 ? `<path d="M 46 84 C 46 64, 76 64, 76 84 Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2"/>` : ''}
      <path d="M 34 26 L 40 18 L 46 26" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  }

  if (subId === 'business-marketing') {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <rect x="14" y="14" width="72" height="72" rx="${8 + (seed % 14)}" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="2.2"/>
      <path d="M 50 24 C 36 24, 28 34, 28 46 C 28 62, 50 78, 50 78 C 50 78, 72 62, 72 46 C 72 34, 64 24, 50 24 Z" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2.2"/>
      <circle cx="50" cy="45" r="${7 + (seed % 4)}" fill="currentColor"/>
    </svg>`;
  }

  if (subId === 'arrows-doodles') {
    const wave = 10 + (seed % 14);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
      <path d="M 8 50 C 26 ${50 - wave}, 38 ${50 + wave}, 50 50 C 62 ${50 - wave}, 74 ${50 + wave}, 92 50" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M 22 50 C 30 ${36 - (seed % 6)}, 42 36, 50 50 C 58 64, 70 ${64 + (seed % 6)}, 78 50" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 2"/>
      <polygon points="50,38 56,50 50,62 44,50" fill="currentColor"/>
      <circle cx="12" cy="50" r="3" fill="currentColor"/>
      <circle cx="88" cy="50" r="3" fill="currentColor"/>
    </svg>`;
  }

  // stickers-badges
  const pts = [];
  const spikes = 16 + (seed % 8) * 2;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? 44 : 38;
    const a = (i * Math.PI) / spikes;
    pts.push(`${(50 + r * Math.cos(a)).toFixed(1)},${(50 + r * Math.sin(a)).toFixed(1)}`);
  }
  const shortText = name.split(' ').slice(0, 2).join(' ').toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    <polygon points="${pts.join(' ')}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>
    <circle cx="50" cy="50" r="31" stroke="currentColor" stroke-width="1.4" stroke-dasharray="3 2"/>
    <path d="M 36 36 L 50 24 L 64 36" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <text x="50" y="54" text-anchor="middle" fill="currentColor" font-family="Cinzel, serif" font-size="7.5" font-weight="bold">${shortText}</text>
    <circle cx="50" cy="68" r="3" fill="currentColor"/>
  </svg>`;
}

const graphics = [];
for (const spec of GRAPHIC_SPECS) {
  const subDir = path.join(PUBLIC_GRAPHICS_DIR, spec.id);
  fs.mkdirSync(subDir, { recursive: true });
  for (let i = 0; i < spec.count; i++) {
    const num = String(i + 1).padStart(2, '0');
    const id = `graphic-${spec.id}-${num}`;
    const name = spec.names[i] || `${spec.label} ${i + 1}`;
    const svg = createGraphicSvg(spec.id, i, name);
    const fileName = `${id}.svg`;
    fs.writeFileSync(path.join(subDir, fileName), svg, 'utf-8');
    graphics.push({
      id,
      name,
      category: 'graphics',
      subcategory: spec.id,
      svgContent: svg,
      filePath: `/assets/elements/graphics/${spec.id}/${fileName}`,
      defaultColor: spec.color,
      tags: [
        spec.id,
        ...name.toLowerCase().split(/\s+/),
        'graphic',
        'indian',
        'wedding',
        'royal',
      ],
    });
  }
}

// ================= 30 FUNCTIONAL CLIPPING FRAMES =================
const FRAME_SPECS = [
  { id: 'frame-01', name: 'Royal Mughal Jharokha Arch', sub: 'royal-arch', clip: `<path d="M 10 96 V 38 C 10 20, 32 12, 50 4 C 68 12, 90 20, 90 38 V 96 Z"/>`, border: `<path d="M 10 96 V 38 C 10 20, 32 12, 50 4 C 68 12, 90 20, 90 38 V 96 Z" fill="none" stroke="currentColor" stroke-width="3"/>` },
  { id: 'frame-02', name: 'Udaipur Scalloped Palace Arch', sub: 'royal-arch', clip: `<path d="M 12 95 V 42 Q 12 24 28 18 Q 38 8 50 4 Q 62 8 72 18 Q 88 24 88 42 V 95 Z"/>` },
  { id: 'frame-03', name: 'Sacred Lotus Petal Frame', sub: 'floral', clip: `<path d="M 50 4 C 72 18, 92 38, 86 66 C 80 86, 66 96, 50 96 C 34 96, 20 86, 14 66 C 8 38, 28 18, 50 4 Z"/>` },
  { id: 'frame-04', name: 'Golden Circle Medallion', sub: 'geometric', clip: `<circle cx="50" cy="50" r="45"/>` },
  { id: 'frame-05', name: 'Royal Oval Portrait', sub: 'classic', clip: `<ellipse cx="50" cy="50" rx="38" ry="46"/>` },
  { id: 'frame-06', name: 'Diamond Rajwada Frame', sub: 'geometric', clip: `<polygon points="50,4 96,50 50,96 4,50"/>` },
  { id: 'frame-07', name: 'Octagon Heritage Crest', sub: 'geometric', clip: `<polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30"/>` },
  { id: 'frame-08', name: 'Hexagon Honeycomb Mask', sub: 'geometric', clip: `<polygon points="50,4 93,27 93,73 50,96 7,73 7,27"/>` },
  { id: 'frame-09', name: 'Romantic Heart Locket', sub: 'wedding', clip: `<path d="M 50 92 C 18 68, 4 42, 20 22 C 32 8, 46 16, 50 26 C 54 16, 68 8, 80 22 C 96 42, 82 68, 50 92 Z"/>` },
  { id: 'frame-10', name: '12-Point Starburst Seal', sub: 'stars', clip: `<polygon points="50,3 61,16 78,10 80,27 95,33 87,49 95,65 80,71 78,88 61,82 50,95 39,82 22,88 20,71 5,65 13,49 5,33 20,27 22,10 39,16"/>` },
  { id: 'frame-11', name: 'Polaroid Vintage Instant', sub: 'stationery', clip: `<rect x="8" y="6" width="84" height="74" rx="4"/>`, border: `<rect x="4" y="3" width="92" height="94" rx="5" fill="none" stroke="currentColor" stroke-width="3"/>` },
  { id: 'frame-12', name: 'Rounded Luxury Card', sub: 'classic', clip: `<rect x="6" y="6" width="88" height="88" rx="18"/>` },
  { id: 'frame-13', name: 'Pill Capsule Vertical', sub: 'classic', clip: `<rect x="16" y="4" width="68" height="92" rx="34"/>` },
  { id: 'frame-14', name: 'jaipur Temple Dome Arch', sub: 'royal-arch', clip: `<path d="M 8 96 V 48 C 8 28, 22 24, 34 16 C 44 10, 48 4, 50 2 C 52 4, 56 10, 66 16 C 78 24, 92 28, 92 48 V 96 Z"/>` },
  { id: 'frame-15', name: '4-Leaf Clover Quatrefoil', sub: 'floral', clip: `<path d="M 50 6 A 22 22 0 0 1 72 28 A 22 22 0 0 1 94 50 A 22 22 0 0 1 72 72 A 22 22 0 0 1 50 94 A 22 22 0 0 1 28 72 A 22 22 0 0 1 6 50 A 22 22 0 0 1 28 28 A 22 22 0 0 1 50 6 Z"/>` },
  { id: 'frame-16', name: 'Moroccan Trellis Tile', sub: 'royal-arch', clip: `<path d="M 50 4 L 68 20 H 86 V 38 L 96 50 L 86 62 V 80 H 68 L 50 96 L 32 80 H 14 V 62 L 4 50 L 14 38 V 20 H 32 Z"/>` },
  { id: 'frame-17', name: 'Royal Shield Coat of Arms', sub: 'royal', clip: `<path d="M 12 10 H 88 V 48 C 88 72, 68 88, 50 96 C 32 88, 12 72, 12 48 Z"/>` },
  { id: 'frame-18', name: 'Paisley Kairi Mango Mask', sub: 'floral', clip: `<path d="M 54 8 C 82 8, 92 36, 84 64 C 76 88, 48 96, 26 86 C 8 76, 8 48, 24 32 C 36 20, 44 8, 54 8 Z"/>` },
  { id: 'frame-19', name: 'Teardrop Kundan Gem', sub: 'wedding', clip: `<path d="M 50 4 C 68 28, 88 52, 88 68 A 38 28 0 1 1 12 68 C 12 52, 32 28, 50 4 Z"/>` },
  { id: 'frame-20', name: 'Postage Stamp Perforated', sub: 'stationery', clip: `<rect x="12" y="12" width="76" height="76" rx="2"/>`, border: `<rect x="8" y="8" width="84" height="84" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="4 4"/>` },
  { id: 'frame-21', name: 'Cut-Corner Chamfer Plaque', sub: 'geometric', clip: `<polygon points="20,6 80,6 94,20 94,80 80,94 20,94 6,80 6,20"/>` },
  { id: 'frame-22', name: 'Concave Ticket Stub', sub: 'stationery', clip: `<path d="M 18 6 H 82 A 12 12 0 0 0 94 18 V 82 A 12 12 0 0 0 82 94 H 18 A 12 12 0 0 0 6 82 V 18 A 12 12 0 0 0 18 6 Z"/>` },
  { id: 'frame-23', name: 'Organic Pebble Blob', sub: 'organic', clip: `<path d="M 54 8 C 78 10, 94 26, 92 52 C 90 78, 72 94, 46 92 C 20 90, 6 74, 8 48 C 10 22, 30 6, 54 8 Z"/>` },
  { id: 'frame-24', name: '8-Point Surya Mandala Star', sub: 'stars', clip: `<polygon points="50,4 63,24 85,15 76,37 96,50 76,63 85,85 63,76 50,96 37,76 15,85 24,63 4,50 24,37 15,15 37,24"/>` },
  { id: 'frame-25', name: 'Pentagon Royal Crest', sub: 'geometric', clip: `<polygon points="50,5 95,38 78,92 22,92 5,38"/>` },
  { id: 'frame-26', name: 'Twin Arch Jharokha Window', sub: 'royal-arch', clip: `<path d="M 8 94 V 38 A 20 24 0 0 1 48 38 V 94 Z M 52 94 V 38 A 20 24 0 0 1 92 38 V 94 Z"/>` },
  { id: 'frame-27', name: 'Diagonal SplitDuo Mask', sub: 'geometric', clip: `<path d="M 6 6 H 88 L 6 88 Z M 94 12 V 94 H 12 Z"/>` },
  { id: 'frame-28', name: 'Film Strip Cinema Frame', sub: 'stationery', clip: `<rect x="16" y="8" width="68" height="84" rx="3"/>`, border: `<g stroke="currentColor" stroke-width="2" fill="none"><rect x="6" y="4" width="88" height="92" rx="4"/><line x1="14" y1="4" x2="14" y2="96" stroke-dasharray="6 4"/><line x1="86" y1="4" x2="86" y2="96" stroke-dasharray="6 4"/></g>` },
  { id: 'frame-29', name: 'Smartphone Screen Frame', sub: 'device', clip: `<rect x="20" y="6" width="60" height="88" rx="10"/>`, border: `<rect x="18" y="4" width="64" height="92" rx="12" fill="none" stroke="currentColor" stroke-width="2.5"/>` },
  { id: 'frame-30', name: 'Sunburst Scallop Medallion', sub: 'stars', clip: `<circle cx="50" cy="50" r="42"/>`, border: `<circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="5 3"/>` },
];

const framesManifest = FRAME_SPECS.map((f) => ({
  id: f.id,
  name: f.name,
  category: 'frames',
  subcategory: f.sub,
  clipPathSvg: f.clip,
  borderSvg:
    f.border ||
    `${f.clip.replace('/>', ' fill="none" stroke="currentColor" stroke-width="2.5"/>')}`,
  defaultBorderColor: '#D4AF37',
  tags: ['frame', 'mask', 'clip', 'photo', f.sub, ...f.name.toLowerCase().split(/\s+/)],
}));

// ================= 20 FUNCTIONAL MULTI-SLOT GRIDS =================
const GRID_SPECS = [
  { id: 'grid-01', name: '2-Column Side Split', sub: '2-slot', slots: [{ x: 2, y: 2, w: 47, h: 96 }, { x: 51, y: 2, w: 47, h: 96 }] },
  { id: 'grid-02', name: '2-Row Horizontal Split', sub: '2-slot', slots: [{ x: 2, y: 2, w: 96, h: 47 }, { x: 2, y: 51, w: 96, h: 47 }] },
  { id: 'grid-03', name: 'Asymmetric Golden Ratio 70/30', sub: '2-slot', slots: [{ x: 2, y: 2, w: 66, h: 96 }, { x: 70, y: 2, w: 28, h: 96 }] },
  { id: 'grid-04', name: '3-Column Classic Trio', sub: '3-slot', slots: [{ x: 2, y: 2, w: 30, h: 96 }, { x: 35, y: 2, w: 30, h: 96 }, { x: 68, y: 2, w: 30, h: 96 }] },
  { id: 'grid-05', name: '3-Row Stacked Trio', sub: '3-slot', slots: [{ x: 2, y: 2, w: 96, h: 30 }, { x: 2, y: 35, w: 96, h: 30 }, { x: 2, y: 68, w: 96, h: 30 }] },
  { id: 'grid-06', name: 'Hero Left + 2 Right Stack', sub: '3-slot', slots: [{ x: 2, y: 2, w: 56, h: 96 }, { x: 60, y: 2, w: 38, h: 47 }, { x: 60, y: 51, w: 38, h: 47 }] },
  { id: 'grid-07', name: 'Hero Top + 2 Bottom Duo', sub: '3-slot', slots: [{ x: 2, y: 2, w: 96, h: 56 }, { x: 2, y: 60, w: 47, h: 38 }, { x: 51, y: 60, w: 47, h: 38 }] },
  { id: 'grid-08', name: '2 Bottom + Hero Right', sub: '3-slot', slots: [{ x: 2, y: 2, w: 38, h: 47 }, { x: 2, y: 51, w: 38, h: 47 }, { x: 42, y: 2, w: 56, h: 96 }] },
  { id: 'grid-09', name: '2x2 Royal Quad Collage', sub: '4-slot', slots: [{ x: 2, y: 2, w: 47, h: 47 }, { x: 51, y: 2, w: 47, h: 47 }, { x: 2, y: 51, w: 47, h: 47 }, { x: 51, y: 51, w: 47, h: 47 }] },
  { id: 'grid-10', name: 'Hero Top + 3 Bottom Strip', sub: '4-slot', slots: [{ x: 2, y: 2, w: 96, h: 62 }, { x: 2, y: 66, w: 30, h: 32 }, { x: 35, y: 66, w: 30, h: 32 }, { x: 68, y: 66, w: 30, h: 32 }] },
  { id: 'grid-11', name: 'Hero Left + 3 Right Column', sub: '4-slot', slots: [{ x: 2, y: 2, w: 62, h: 96 }, { x: 66, y: 2, w: 32, h: 30 }, { x: 66, y: 35, w: 32, h: 30 }, { x: 66, y: 68, w: 32, h: 30 }] },
  { id: 'grid-12', name: '4-Column Editorial Strip', sub: '4-slot', slots: [{ x: 2, y: 2, w: 22.5, h: 96 }, { x: 26.5, y: 2, w: 22.5, h: 96 }, { x: 51, y: 2, w: 22.5, h: 96 }, { x: 75.5, y: 2, w: 22.5, h: 96 }] },
  { id: 'grid-13', name: '5-Photo Editorial Bento', sub: '5-slot', slots: [{ x: 2, y: 2, w: 58, h: 58 }, { x: 62, y: 2, w: 36, h: 28 }, { x: 62, y: 32, w: 36, h: 28 }, { x: 2, y: 62, w: 47, h: 36 }, { x: 51, y: 62, w: 47, h: 36 }] },
  { id: 'grid-14', name: 'Center Spotlight + 4 Corners', sub: '5-slot', slots: [{ x: 2, y: 2, w: 47, h: 30 }, { x: 51, y: 2, w: 47, h: 30 }, { x: 18, y: 34, w: 64, h: 32 }, { x: 2, y: 68, w: 47, h: 30 }, { x: 51, y: 68, w: 47, h: 30 }] },
  { id: 'grid-15', name: '2 Top + 3 Bottom Collage', sub: '5-slot', slots: [{ x: 2, y: 2, w: 47, h: 48 }, { x: 51, y: 2, w: 47, h: 48 }, { x: 2, y: 52, w: 30, h: 46 }, { x: 35, y: 52, w: 30, h: 46 }, { x: 68, y: 52, w: 30, h: 46 }] },
  { id: 'grid-16', name: '3x2 Six-Photo Gallery', sub: '6-slot', slots: [{ x: 2, y: 2, w: 30, h: 47 }, { x: 35, y: 2, w: 30, h: 47 }, { x: 68, y: 2, w: 30, h: 47 }, { x: 2, y: 51, w: 30, h: 47 }, { x: 35, y: 51, w: 30, h: 47 }, { x: 68, y: 51, w: 30, h: 47 }] },
  { id: 'grid-17', name: '2x3 Portrait Six Grid', sub: '6-slot', slots: [{ x: 2, y: 2, w: 47, h: 30 }, { x: 51, y: 2, w: 47, h: 30 }, { x: 2, y: 35, w: 47, h: 30 }, { x: 51, y: 35, w: 47, h: 30 }, { x: 2, y: 68, w: 47, h: 30 }, { x: 51, y: 68, w: 47, h: 30 }] },
  { id: 'grid-18', name: 'Masonry 6-Tile Storyboard', sub: '6-slot', slots: [{ x: 2, y: 2, w: 62, h: 46 }, { x: 66, y: 2, w: 32, h: 46 }, { x: 2, y: 50, w: 30, h: 22 }, { x: 2, y: 74, w: 30, h: 24 }, { x: 34, y: 50, w: 32, h: 48 }, { x: 68, y: 50, w: 30, h: 48 }] },
  { id: 'grid-19', name: '7-Photo Wedding Story Mosaic', sub: '7-slot', slots: [{ x: 2, y: 2, w: 96, h: 36 }, { x: 2, y: 40, w: 30, h: 28 }, { x: 35, y: 40, w: 30, h: 28 }, { x: 68, y: 40, w: 30, h: 28 }, { x: 2, y: 70, w: 30, h: 28 }, { x: 35, y: 70, w: 30, h: 28 }, { x: 68, y: 70, w: 30, h: 28 }] },
  { id: 'grid-20', name: '3x3 Instagram Nine-Grid', sub: '9-slot', slots: [
    { x: 2, y: 2, w: 30, h: 30 }, { x: 35, y: 2, w: 30, h: 30 }, { x: 68, y: 2, w: 30, h: 30 },
    { x: 2, y: 35, w: 30, h: 30 }, { x: 35, y: 35, w: 30, h: 30 }, { x: 68, y: 35, w: 30, h: 30 },
    { x: 2, y: 68, w: 30, h: 30 }, { x: 35, y: 68, w: 30, h: 30 }, { x: 68, y: 68, w: 30, h: 30 }
  ] },
];

const gridsManifest = GRID_SPECS.map((g) => ({
  id: g.id,
  name: g.name,
  category: 'grids',
  subcategory: g.sub,
  slotCount: g.slots.length,
  slots: g.slots,
  defaultGap: 4,
  defaultRadius: 8,
  tags: ['grid', 'collage', 'layout', `${g.slots.length}-photo`, g.sub, ...g.name.toLowerCase().split(/\s+/)],
}));

fs.writeFileSync(
  path.join(DATA_DIR, 'graphicsManifest.ts'),
  `// AUTO-GENERATED 360 GRAPHICS MANIFEST across 7 subcategories
import { GraphicAssetItem } from '../../types/elements';

export const GRAPHICS_LIBRARY_ITEMS: GraphicAssetItem[] = ${JSON.stringify(graphics, null, 2)};
`,
  'utf-8'
);

fs.writeFileSync(
  path.join(DATA_DIR, 'framesGridsManifest.ts'),
  `// AUTO-GENERATED 30 FRAMES & 20 GRIDS MANIFEST
import { FrameAssetItem, GridAssetItem } from '../../types/elements';

export const FRAMES_LIBRARY_ITEMS: FrameAssetItem[] = ${JSON.stringify(framesManifest, null, 2)};

export const GRIDS_LIBRARY_ITEMS: GridAssetItem[] = ${JSON.stringify(gridsManifest, null, 2)};
`,
  'utf-8'
);

console.log(
  `Successfully generated ${graphics.length} Graphics, ${framesManifest.length} Frames, and ${gridsManifest.length} Grids.`
);
