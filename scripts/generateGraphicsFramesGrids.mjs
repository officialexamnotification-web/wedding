import fs from 'fs';
import path from 'path';

const PUBLIC_GRAPHICS_DIR = path.resolve('public/assets/elements/graphics');
const PUBLIC_TORANS_DIR = path.resolve('public/assets/elements/torans');
const DATA_DIR = path.resolve('src/data/elements');

fs.mkdirSync(PUBLIC_GRAPHICS_DIR, { recursive: true });
fs.mkdirSync(PUBLIC_TORANS_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

function polar(cx, cy, r, deg) {
  const rad = (deg * Math.PI) / 180;
  return [+(cx + r * Math.cos(rad)).toFixed(2), +(cy + r * Math.sin(rad)).toFixed(2)];
}

function starPoints(cx, cy, spikes, outerR, innerR, rotDeg = -90) {
  const pts = [];
  const step = 180 / spikes;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const [x, y] = polar(cx, cy, r, rotDeg + i * step);
    pts.push(`${x},${y}`);
  }
  return pts.join(' ');
}

function polyPoints(cx, cy, sides, r, rotDeg = -90) {
  const pts = [];
  const step = 360 / sides;
  for (let i = 0; i < sides; i++) {
    const [x, y] = polar(cx, cy, r, rotDeg + i * step);
    pts.push(`${x},${y}`);
  }
  return pts.join(' ');
}

function scallopPath(cx, cy, baseR, bumps, amp, rotDeg = 0) {
  const steps = bumps * 10;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const rad = t + (rotDeg * Math.PI) / 180;
    const r = baseR + amp * Math.abs(Math.sin((bumps * t) / 2));
    const x = +(cx + r * Math.cos(rad)).toFixed(2);
    const y = +(cy + r * Math.sin(rad)).toFixed(2);
    d += i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
  }
  return d + 'Z';
}

// Ornamental corner & halo signature helper — guarantees every single item has a 100% unique ornamental signature
function buildRoyalAura(idx, variant = 0) {
  const mode = (idx + variant) % 10;
  const r = +(42.5 + (idx % 7) * 0.45 + variant * 0.12).toFixed(2);
  const d1 = +(1.8 + (idx % 6) * 0.55).toFixed(1);
  const d2 = +(1.2 + ((idx * 3 + variant) % 5) * 0.45).toFixed(1);
  const cOff = +(9 + (idx % 8) * 0.7).toFixed(1);
  const dotR = +(1.3 + (idx % 5) * 0.25).toFixed(2);

  if (mode === 0) {
    return `<circle cx="50" cy="50" r="${r}" stroke="currentColor" stroke-width="0.9" stroke-dasharray="${d1} ${d2}" opacity="0.45"/>`;
  }
  if (mode === 1) {
    return `<g opacity="0.5" fill="currentColor"><circle cx="${cOff}" cy="${cOff}" r="${dotR}"/><circle cx="${(100 - cOff).toFixed(1)}" cy="${cOff}" r="${dotR}"/><circle cx="${cOff}" cy="${(100 - cOff).toFixed(1)}" r="${dotR}"/><circle cx="${(100 - cOff).toFixed(1)}" cy="${(100 - cOff).toFixed(1)}" r="${dotR}"/></g>`;
  }
  if (mode === 2) {
    const L = +(15 + (idx % 9) * 0.85).toFixed(1);
    const pad = +(7 + (idx % 4) * 0.6).toFixed(1);
    const far = +(100 - pad).toFixed(1);
    const farL = +(100 - L).toFixed(1);
    return `<g stroke="currentColor" stroke-width="1" opacity="0.45" fill="none"><path d="M${pad} ${L} V${pad} H${L} M${farL} ${pad} H${far} V${L} M${pad} ${farL} V${far} H${L} M${farL} ${far} H${far} V${farL}"/></g>`;
  }
  if (mode === 3) {
    const tip = +(1.8 + (idx % 6) * 0.5).toFixed(1);
    const w = +(2.4 + (idx % 4) * 0.4).toFixed(1);
    return `<g fill="currentColor" opacity="0.5"><polygon points="50,${tip} ${50 + w},${+tip + 5} ${50 - w},${+tip + 5}"/><polygon points="50,${(100 - tip).toFixed(1)} ${50 + w},${(95 - tip).toFixed(1)} ${50 - w},${(95 - tip).toFixed(1)}"/><polygon points="${tip},50 ${+tip + 5},${50 + w} ${+tip + 5},${50 - w}"/><polygon points="${(100 - tip).toFixed(1)},50 ${(95 - tip).toFixed(1)},${50 + w} ${(95 - tip).toFixed(1)},${50 - w}"/></g>`;
  }
  if (mode === 4) {
    const xPad = +(12 + (idx % 11) * 0.9).toFixed(1);
    const yPad = +(6.5 + (idx % 4) * 0.5).toFixed(1);
    return `<path d="M${xPad} ${yPad} H${(100 - xPad).toFixed(1)} M${xPad} ${(100 - yPad).toFixed(1)} H${(100 - xPad).toFixed(1)}" stroke="currentColor" stroke-width="1" stroke-dasharray="${d1} ${d2}" opacity="0.45"/>`;
  }
  if (mode === 5) {
    const s = +(11 + (idx % 7) * 0.75).toFixed(1);
    const sp = +(4 + (idx % 4) * 0.5).toFixed(1);
    return `<g fill="currentColor" opacity="0.55"><path d="M${s} ${(+s - sp).toFixed(1)} Q${s} ${s} ${(+s + sp).toFixed(1)} ${s} Q${s} ${s} ${s} ${(+s + sp).toFixed(1)} Q${s} ${s} ${(+s - sp).toFixed(1)} ${s} Q${s} ${s} ${s} ${(+s - sp).toFixed(1)} Z"/><path d="M${(100 - s).toFixed(1)} ${(+s - sp).toFixed(1)} Q${(100 - s).toFixed(1)} ${s} ${(100 - s + +sp).toFixed(1)} ${s} Q${(100 - s).toFixed(1)} ${s} ${(100 - s).toFixed(1)} ${(+s + sp).toFixed(1)} Q${(100 - s).toFixed(1)} ${s} ${(100 - s - sp).toFixed(1)} ${s} Q${(100 - s).toFixed(1)} ${s} ${(100 - s).toFixed(1)} ${(+s - sp).toFixed(1)} Z"/></g>`;
  }
  if (mode === 6) {
    const p = +(2 + (idx % 7) * 0.45).toFixed(1);
    return `<polygon points="50,${p} ${(100 - p).toFixed(1)},50 50,${(100 - p).toFixed(1)} ${p},50" fill="none" stroke="currentColor" stroke-width="0.85" stroke-dasharray="${d1} ${d2}" opacity="0.4"/>`;
  }
  if (mode === 7) {
    const aR = +(14 + (idx % 8) * 0.85).toFixed(1);
    return `<g stroke="currentColor" stroke-width="1" opacity="0.45" fill="none"><path d="M6 ${(+aR + 6).toFixed(1)} A${aR} ${aR} 0 0 1 ${(+aR + 6).toFixed(1)} 6 M${(94 - aR).toFixed(1)} 6 A${aR} ${aR} 0 0 1 94 ${(+aR + 6).toFixed(1)} M6 ${(94 - aR).toFixed(1)} A${aR} ${aR} 0 0 0 ${(+aR + 6).toFixed(1)} 94 M${(94 - aR).toFixed(1)} 94 A${aR} ${aR} 0 0 0 94 ${(94 - aR).toFixed(1)}"/></g>`;
  }
  if (mode === 8) {
    return `<circle cx="50" cy="50" r="${r}" stroke="currentColor" stroke-width="0.8" opacity="0.35"/><circle cx="50" cy="${(50 - r).toFixed(1)}" r="${dotR}" fill="currentColor" opacity="0.6"/><circle cx="50" cy="${(50 + r).toFixed(1)}" r="${dotR}" fill="currentColor" opacity="0.6"/>`;
  }
  const off = +(3.5 + (idx % 7) * 0.55).toFixed(1);
  return `<g fill="currentColor" opacity="0.45"><circle cx="50" cy="${off}" r="${dotR}"/><circle cx="${(100 - off).toFixed(1)}" cy="50" r="${dotR}"/><circle cx="50" cy="${(100 - off).toFixed(1)}" r="${dotR}"/><circle cx="${off}" cy="50" r="${dotR}"/></g>`;
}

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

// ================= 1. FLOWERS & BOTANICALS (60 BESPOKE DESIGNS) =================
function buildBotanicalSvg(idx) {
  const aura = buildRoyalAura(idx, 1);
  const motifs = [
    // 0: Royal Lotus Bloom (Multi-layered Padma with calyx and water ripples)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M50 12 C40 28 38 48 50 64 C62 48 60 28 50 12 Z" fill-opacity="0.38" stroke-width="2"/>
      <path d="M50 64 C32 48 24 30 32 18 C42 26 46 44 50 64 Z" fill-opacity="0.28" stroke-width="1.8"/>
      <path d="M50 64 C68 48 76 30 68 18 C58 26 54 44 50 64 Z" fill-opacity="0.28" stroke-width="1.8"/>
      <path d="M50 64 C24 58 10 42 16 28 C28 32 38 48 50 64 Z" fill-opacity="0.2" stroke-width="1.8"/>
      <path d="M50 64 C76 58 90 42 84 28 C72 32 62 48 50 64 Z" fill-opacity="0.2" stroke-width="1.8"/>
      <path d="M22 66 Q50 76 78 66 Q64 78 50 78 Q36 78 22 66 Z" fill-opacity="0.45" stroke-width="1.8"/>
      <line x1="50" y1="78" x2="50" y2="92" stroke-width="2.5"/>
      <path d="M26 86 Q50 92 74 86" fill="none" stroke-width="1.5"/>
      <circle cx="50" cy="28" r="2.5" fill="#FEF08A"/>
    </g>`,
    // 1: Sacred Kamal Bud (Closed pointed lotus bud on tall stem with twin leaves)
    `<g stroke="currentColor" fill="currentColor">
      <line x1="50" y1="54" x2="50" y2="92" stroke-width="2.6"/>
      <path d="M50 10 C36 24 36 44 50 56 C64 44 64 24 50 10 Z" fill-opacity="0.35" stroke-width="2.2"/>
      <path d="M50 18 C42 30 42 44 50 56 C58 44 58 30 50 18 Z" fill="none" stroke-width="1.4"/>
      <path d="M34 46 C38 54 44 56 50 56 C44 50 38 42 34 46 Z" fill-opacity="0.5"/>
      <path d="M66 46 C62 54 56 56 50 56 C56 50 62 42 66 46 Z" fill-opacity="0.5"/>
      <path d="M50 74 C34 68 20 72 24 82 C32 86 44 80 50 74 Z" fill-opacity="0.25" stroke-width="1.8"/>
      <path d="M50 74 C66 68 80 72 76 82 C68 86 56 80 50 74 Z" fill-opacity="0.25" stroke-width="1.8"/>
    </g>`,
    // 2: Marigold Garland (Draped Genda Phool mala with 7 ruffled blooms & tassel)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M12 20 Q50 86 88 20" fill="none" stroke-width="2.5" stroke-dasharray="3 2"/>
      ${[
        [14, 22, 9], [24, 38, 10], [36, 50, 11], [50, 56, 13], [64, 50, 11], [76, 38, 10], [86, 22, 9]
      ].map(([x, y, r]) => `<path d="${scallopPath(x, y, r * 0.7, 10, r * 0.3)}" fill-opacity="0.32" stroke-width="1.6"/><circle cx="${x}" cy="${y}" r="${r * 0.28}"/>`).join('')}
      <line x1="50" y1="68" x2="50" y2="86" stroke-width="2"/>
      <polygon points="50,82 55,90 50,95 45,90"/>
    </g>`,
    // 3: Jasmine Veni (Bridal hair gajra crescent of mogra buds and blossoms)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M14 58 A38 38 0 0 1 86 58" fill="none" stroke-width="3"/>
      ${[-70, -45, -22, 0, 22, 45, 70].map((deg) => {
        const [x, y] = polar(50, 62, 38, -90 + deg);
        return `<g transform="translate(${x},${y})"><polygon points="${starPoints(0, 0, 6, 8, 4)}" fill-opacity="0.35" stroke-width="1.4"/><circle cx="0" cy="0" r="2.2" fill="#FFFDF7"/></g>`;
      }).join('')}
      <path d="M14 58 L10 82 M18 60 L16 84 M86 58 L90 82 M82 60 L84 84" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="10" cy="84" r="2.5"/><circle cx="90" cy="84" r="2.5"/>
    </g>`,
    // 4: Rose Petal Cluster (Trio of spiral roses with serrated leaves)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M22 68 C10 60 12 46 26 52 M78 68 C90 60 88 46 74 52" fill-opacity="0.22" stroke-width="1.8"/>
      <g transform="translate(50,42)">
        <circle cx="0" cy="0" r="18" fill-opacity="0.26" stroke-width="2"/>
        <path d="M-8 -4 C-2 -12 10 -8 10 2 C10 10 -4 14 -10 6 C-14 -2 -4 -14 6 -12" fill="none" stroke-width="1.8" stroke-linecap="round"/>
      </g>
      <g transform="translate(32,64) scale(0.75)">
        <circle cx="0" cy="0" r="16" fill-opacity="0.24" stroke-width="2"/>
        <path d="M-6 -2 C0 -10 8 -6 8 2 C8 8 -4 10 -8 4" fill="none" stroke-width="1.8"/>
      </g>
      <g transform="translate(68,64) scale(0.75)">
        <circle cx="0" cy="0" r="16" fill-opacity="0.24" stroke-width="2"/>
        <path d="M-6 -2 C0 -10 8 -6 8 2 C8 8 -4 10 -8 4" fill="none" stroke-width="1.8"/>
      </g>
    </g>`,
    // 5: Peony Blossom (Lush multi-layered ruffled royal peony)
    `<g stroke="currentColor" fill="currentColor">
      <path d="${scallopPath(50, 50, 34, 12, 7)}" fill-opacity="0.18" stroke-width="2"/>
      <path d="${scallopPath(50, 50, 24, 10, 6, 18)}" fill-opacity="0.26" stroke-width="1.8"/>
      <path d="${scallopPath(50, 50, 14, 8, 4, 36)}" fill-opacity="0.36" stroke-width="1.6"/>
      <circle cx="50" cy="50" r="6"/>
      <circle cx="46" cy="46" r="1.5" fill="#FFFBEB"/><circle cx="54" cy="46" r="1.5" fill="#FFFBEB"/><circle cx="50" cy="54" r="1.5" fill="#FFFBEB"/>
    </g>`,
    // 6: Hibiscus Motif (5 broad tropical petals + protruding stamen pistil)
    `<g stroke="currentColor" fill="currentColor">
      ${[0, 72, 144, 216, 288].map((a) => `<path d="M50 50 C34 32 32 12 50 10 C68 12 66 32 50 50 Z" transform="rotate(${a} 50 50)" fill-opacity="0.24" stroke-width="1.8"/>`).join('')}
      <path d="M50 50 Q64 30 78 16" fill="none" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="78" cy="16" r="3.5"/><circle cx="72" cy="22" r="2.2"/><circle cx="76" cy="24" r="2.2"/><circle cx="68" cy="26" r="2"/>
      <circle cx="50" cy="50" r="5"/>
    </g>`,
    // 7: Ashoka Leaf Toran (Horizontal bar with 7 long veined pendulous Ashoka leaves)
    `<g stroke="currentColor" fill="currentColor">
      <rect x="8" y="16" width="84" height="6" rx="3" fill-opacity="0.4" stroke-width="1.8"/>
      ${[16, 27, 38, 50, 62, 73, 84].map((x, i) => {
        const h = i === 3 ? 64 : i % 2 === 0 ? 52 : 58;
        return `<path d="M${x} 22 C${x + 6} ${22 + h * 0.35} ${x + 5} ${22 + h * 0.75} ${x} ${22 + h} C${x - 5} ${22 + h * 0.75} ${x - 6} ${22 + h * 0.35} ${x} 22 Z" fill-opacity="0.28" stroke-width="1.5"/><line x1="${x}" y1="22" x2="${x}" y2="${20 + h}" stroke-width="1"/>`;
      }).join('')}
    </g>`,
    // 8: Mango Leaf Bandhanwar (Scallop marigold string + mango leaves + central bell)
    `<g stroke="currentColor" fill="currentColor">
      <line x1="8" y1="18" x2="92" y2="18" stroke-width="3"/>
      ${[18, 34, 50, 66, 82].map((x) => `<path d="M${x} 18 C${x + 7} 28 ${x + 6} 44 ${x} 54 C${x - 6} 44 ${x - 7} 28 ${x} 18 Z" fill-opacity="0.26" stroke-width="1.5"/><circle cx="${x}" cy="18" r="3.5"/>`).join('')}
      <path d="M10 20 Q30 48 50 20 Q70 48 90 20" fill="none" stroke-width="2" stroke-dasharray="3 2"/>
      <line x1="50" y1="54" x2="50" y2="72" stroke-width="1.8"/>
      <path d="M42 84 L45 72 H55 L58 84 Z" fill-opacity="0.4" stroke-width="1.6"/>
      <circle cx="50" cy="87" r="2.5"/>
    </g>`,
    // 9: Banyan Sacred Leaf (Broad cordate leaf with intricate venation network)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M50 10 C78 16 90 42 82 68 C74 86 58 88 50 82 C42 88 26 86 18 68 C10 42 22 16 50 10 Z" fill-opacity="0.22" stroke-width="2.4"/>
      <path d="M50 10 V94 M50 30 Q66 26 76 34 M50 46 Q68 42 80 52 M50 62 Q64 60 74 68 M50 30 Q34 26 24 34 M50 46 Q32 42 20 52 M50 62 Q36 60 26 68" fill="none" stroke-width="1.6" stroke-linecap="round"/>
    </g>`,
    // 10: Tulsi Sprig (Sacred Holy Basil with manjari blossom spike at top)
    `<g stroke="currentColor" fill="currentColor">
      <line x1="50" y1="20" x2="50" y2="92" stroke-width="2.4"/>
      ${[14, 20, 26].map((y) => `<circle cx="46" cy="${y}" r="2"/><circle cx="54" cy="${y}" r="2"/><circle cx="50" cy="${y - 3}" r="2"/>`).join('')}
      <path d="M50 46 C34 36 18 40 22 52 C28 60 42 54 50 46 Z" fill-opacity="0.28" stroke-width="1.8"/>
      <path d="M50 46 C66 36 82 40 78 52 C72 60 58 54 50 46 Z" fill-opacity="0.28" stroke-width="1.8"/>
      <path d="M50 68 C30 56 12 62 16 76 C24 84 40 78 50 68 Z" fill-opacity="0.28" stroke-width="1.8"/>
      <path d="M50 68 C70 56 88 62 84 76 C76 84 60 78 50 68 Z" fill-opacity="0.28" stroke-width="1.8"/>
    </g>`,
    // 11: Mughal Floral Vine (S-curve arabesque stem with 3 Pietra Dura blossoms)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M14 84 C20 52 44 62 50 46 C56 30 78 38 86 14" fill="none" stroke-width="2.5" stroke-linecap="round"/>
      <g transform="translate(26,64)"><path d="${scallopPath(0, 0, 9, 6, 3)}" fill-opacity="0.3" stroke-width="1.5"/><circle cx="0" cy="0" r="3"/></g>
      <g transform="translate(50,46)"><path d="${scallopPath(0, 0, 11, 8, 3.5)}" fill-opacity="0.35" stroke-width="1.6"/><circle cx="0" cy="0" r="3.5"/></g>
      <g transform="translate(74,28)"><path d="${scallopPath(0, 0, 9, 6, 3)}" fill-opacity="0.3" stroke-width="1.5"/><circle cx="0" cy="0" r="3"/></g>
      <path d="M38 38 C28 30 22 36 30 44 Z M62 58 C72 66 78 60 70 52 Z" fill-opacity="0.4"/>
    </g>`,
    // 12: Rajasthani Bel (Vertical climbing vine with alternating paisley buds and flowers)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M50 8 Q34 28 50 50 Q66 72 50 92" fill="none" stroke-width="2.4"/>
      <path d="M42 26 C26 20 20 32 32 38 C38 40 42 32 42 26 Z" fill-opacity="0.3" stroke-width="1.6"/>
      <path d="M58 48 C74 42 80 54 68 60 C62 62 58 54 58 48 Z" fill-opacity="0.3" stroke-width="1.6"/>
      <path d="M42 70 C26 64 20 76 32 82 C38 84 42 76 42 70 Z" fill-opacity="0.3" stroke-width="1.6"/>
      <circle cx="58" cy="24" r="5" fill-opacity="0.4"/><circle cx="40" cy="50" r="5" fill-opacity="0.4"/><circle cx="58" cy="74" r="5" fill-opacity="0.4"/>
    </g>`,
    // 13: Champa Flower (5-petal Frangipani Plumeria pinwheel with golden center)
    `<g stroke="currentColor" fill="currentColor">
      ${[0, 72, 144, 216, 288].map((a) => `<path d="M50 50 C44 32 52 12 66 18 C76 24 64 42 50 50 Z" transform="rotate(${a} 50 50)" fill-opacity="0.28" stroke-width="2"/>`).join('')}
      <circle cx="50" cy="50" r="8" fill-opacity="0.6"/>
      <circle cx="50" cy="50" r="3.5" fill="#FFFBEB"/>
    </g>`,
    // 14: Mogra Garland (Double concentric pearl-and-jasmine wedding mala)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M18 18 C18 68 82 68 82 18" fill="none" stroke-width="2"/>
      <path d="M8 18 C8 88 92 88 92 18" fill="none" stroke-width="2"/>
      ${[20, 35, 50, 65, 80].map((x) => {
        const y1 = 18 + Math.sin(((x - 18) / 64) * Math.PI) * 36;
        const y2 = 18 + Math.sin(((x - 8) / 84) * Math.PI) * 52;
        return `<circle cx="${x}" cy="${y1.toFixed(1)}" r="4.5" fill-opacity="0.35" stroke-width="1.5"/><circle cx="${x}" cy="${y2.toFixed(1)}" r="5.5" fill-opacity="0.35" stroke-width="1.5"/>`;
      }).join('')}
      <polygon points="50,74 56,84 50,94 44,84" fill-opacity="0.5" stroke-width="1.6"/>
    </g>`,
    // 15: Orchid Spray (Graceful arching stem with 3 exotic Phalaenopsis orchid blooms)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M16 88 Q28 42 82 16" fill="none" stroke-width="2.4" stroke-linecap="round"/>
      ${[[36, 56, 0.9], [56, 36, 0.8], [76, 22, 0.65]].map(([x, y, s]) => `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="-10" cy="-4" rx="10" ry="7" transform="rotate(-20)" fill-opacity="0.26" stroke-width="1.8"/><ellipse cx="10" cy="-4" rx="10" ry="7" transform="rotate(20)" fill-opacity="0.26" stroke-width="1.8"/><ellipse cx="0" cy="-12" rx="6" ry="10" fill-opacity="0.26" stroke-width="1.8"/><path d="M-6 2 L0 12 L6 2 Z" fill-opacity="0.6"/></g>`).join('')}
    </g>`,
    // 16: Lily Stem (Trumpet royal lily with curved reflexed petals and long anthers)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M50 56 V92 M50 76 L30 64 M50 82 L70 68" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M50 56 C32 46 16 26 24 16 C32 14 44 30 50 56 Z" fill-opacity="0.26" stroke-width="2"/>
      <path d="M50 56 C68 46 84 26 76 16 C68 14 56 30 50 56 Z" fill-opacity="0.26" stroke-width="2"/>
      <path d="M50 56 C40 36 40 12 50 8 C60 12 60 36 50 56 Z" fill-opacity="0.32" stroke-width="2"/>
      <path d="M50 46 L42 18 M50 46 L50 14 M50 46 L58 18" stroke-width="1.4"/>
      <ellipse cx="42" cy="16" rx="2.5" ry="1.5"/><ellipse cx="50" cy="12" rx="2.5" ry="1.5"/><ellipse cx="58" cy="16" rx="2.5" ry="1.5"/>
    </g>`,
    // 17: Sunflower Mandala (Radiant 16-ray surya mukhi with cross-hatched seed disk)
    `<g stroke="currentColor" fill="currentColor">
      <polygon points="${starPoints(50, 50, 16, 44, 24)}" fill-opacity="0.26" stroke-width="1.8" stroke-linejoin="round"/>
      <polygon points="${starPoints(50, 50, 16, 38, 24, 11.25)}" fill-opacity="0.18" stroke-width="1.4"/>
      <circle cx="50" cy="50" r="20" fill-opacity="0.35" stroke-width="2.2"/>
      <path d="M36 44 L56 64 M44 36 L64 56 M36 56 L56 36 M44 64 L64 44" stroke-width="1.2"/>
    </g>`,
    // 18: Dahlia Rosette (Concentric 3-tier quilted geometric petal dahlia)
    `<g stroke="currentColor" fill="currentColor">
      ${[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => `<path d="M50 50 C42 28 46 10 50 6 C54 10 58 28 50 50 Z" transform="rotate(${a} 50 50)" fill-opacity="0.18" stroke-width="1.5"/>`).join('')}
      ${[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((a) => `<path d="M50 50 C44 34 47 20 50 16 C53 20 56 34 50 50 Z" transform="rotate(${a} 50 50)" fill-opacity="0.28" stroke-width="1.5"/>`).join('')}
      <circle cx="50" cy="50" r="9"/>
    </g>`,
    // 19: Chrysanthemum Gold (Imperial 20-petal curved spoon-tip guldaudi)
    `<g stroke="currentColor" fill="currentColor">
      ${Array.from({ length: 18 }, (_, k) => `<ellipse cx="50" cy="24" rx="4" ry="18" transform="rotate(${k * 20} 50 50)" fill-opacity="0.2" stroke-width="1.4"/>`).join('')}
      <circle cx="50" cy="50" r="12" fill-opacity="0.5" stroke-width="2"/>
      <circle cx="50" cy="50" r="5" fill="#FFFBEB"/>
    </g>`,
  ];

  if (idx < motifs.length) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${aura}${motifs[idx]}</svg>`;
  }

  // Remaining 20..59: Rich specialized botanicals (corners, wreaths, arches, spices, garlands, trees)
  const subType = idx % 10;
  const variant = Math.floor(idx / 10);
  const rot = (idx * 17) % 360;
  let core = '';

  if (subType === 0) {
    // Botanical Wreath with varying leaf counts & top bow/lotus
    const leaves = 8 + variant * 2;
    const leafRing = Array.from({ length: leaves }, (_, k) => {
      const deg = (k * 360) / leaves;
      const [x, y] = polar(50, 50, 34, deg);
      return `<ellipse cx="${x}" cy="${y}" rx="7" ry="3.5" transform="rotate(${deg + 60} ${x} ${y})" fill="currentColor" fill-opacity="0.28" stroke="currentColor" stroke-width="1.4"/>`;
    }).join('');
    core = `<circle cx="50" cy="50" r="34" stroke="currentColor" stroke-width="1.8"/>${leafRing}<polygon points="${starPoints(50, 16, 6, 9, 4)}" fill="currentColor"/>`;
  } else if (subType === 1) {
    // Ornate Floral Corner Vine
    const flipX = variant % 2 === 0 ? 1 : -1;
    core = `<g transform="translate(50,50) scale(${flipX},1) translate(-50,-50)" stroke="currentColor" fill="currentColor">
      <path d="M14 86 V26 A12 12 0 0 1 26 14 H86" fill="none" stroke-width="2.6"/>
      <path d="M22 78 V30 A8 8 0 0 1 30 22 H78" fill="none" stroke-width="1.2" stroke-dasharray="3 2"/>
      <circle cx="24" cy="24" r="9" fill-opacity="0.3" stroke-width="1.8"/>
      <path d="M24 44 C36 40 40 50 28 54 Z M44 24 C40 36 50 40 54 28 Z" fill-opacity="0.35"/>
      <circle cx="14" cy="86" r="3"/><circle cx="86" cy="14" r="3"/>
    </g>`;
  } else if (subType === 2) {
    // Floral Arch Gate / Mandap Top
    core = `<g stroke="currentColor" fill="currentColor">
      <path d="M12 86 V44 A38 34 0 0 1 88 44 V86" fill="none" stroke-width="2.5"/>
      ${[-75, -45, -15, 15, 45, 75].map((d) => {
        const [x, y] = polar(50, 44, 38, -90 + d);
        return `<circle cx="${x}" cy="${y}" r="${5 + (variant % 3)}" fill-opacity="0.32" stroke-width="1.6"/>`;
      }).join('')}
      <polygon points="50,4 56,14 50,22 44,14" fill-opacity="0.5"/>
    </g>`;
  } else if (subType === 3) {
    // Blooming Royal Urn / Kalash Vase with Flowers
    core = `<g stroke="currentColor" fill="currentColor">
      <path d="M32 54 H68 L62 84 H38 Z" fill-opacity="0.26" stroke-width="2.2"/>
      <ellipse cx="50" cy="54" rx="20" ry="5" fill-opacity="0.35" stroke-width="2"/>
      <rect x="34" y="84" width="32" height="6" rx="2"/>
      <path d="M50 50 V22 M50 48 L30 28 M50 48 L70 28" stroke-width="2"/>
      <circle cx="50" cy="18" r="8" fill-opacity="0.35" stroke-width="1.8"/>
      <circle cx="28" cy="26" r="6" fill-opacity="0.35" stroke-width="1.8"/>
      <circle cx="72" cy="26" r="6" fill-opacity="0.35" stroke-width="1.8"/>
    </g>`;
  } else if (subType === 4) {
    // Varmala / Jaimala Thick Rose & Pearl Garland
    core = `<g stroke="currentColor" fill="currentColor">
      <ellipse cx="50" cy="48" rx="30" ry="36" fill="none" stroke-width="8" stroke-opacity="0.22"/>
      <ellipse cx="50" cy="48" rx="30" ry="36" fill="none" stroke-width="2" stroke-dasharray="4 3"/>
      <circle cx="20" cy="48" r="7" fill-opacity="0.4" stroke-width="1.8"/>
      <circle cx="80" cy="48" r="7" fill-opacity="0.4" stroke-width="1.8"/>
      <circle cx="50" cy="84" r="9" fill-opacity="0.45" stroke-width="2"/>
      <polygon points="50,90 54,97 46,97"/>
    </g>`;
  } else if (subType === 5) {
    // Zari Paisley Buta with internal floral lattice
    core = `<g stroke="currentColor" fill="currentColor">
      <path d="M54 10 C82 10 88 40 78 66 C68 88 40 92 24 78 C10 66 12 42 28 30 C40 20 44 10 54 10 Z" fill-opacity="0.2" stroke-width="2.4"/>
      <polygon points="${starPoints(48, 56, 6 + variant, 16, 7)}" fill-opacity="0.35" stroke-width="1.5"/>
      <circle cx="54" cy="24" r="3.5"/>
    </g>`;
  } else if (subType === 6) {
    // Kundan / Polki Floral Chandelier Brooch
    core = `<g stroke="currentColor" fill="currentColor">
      <polygon points="${starPoints(50, 42, 8, 28, 14, rot)}" fill-opacity="0.26" stroke-width="2"/>
      <circle cx="50" cy="42" r="9" fill-opacity="0.5"/>
      <line x1="34" y1="64" x2="34" y2="82" stroke-width="1.6"/>
      <line x1="50" y1="68" x2="50" y2="88" stroke-width="1.8"/>
      <line x1="66" y1="64" x2="66" y2="82" stroke-width="1.6"/>
      <circle cx="34" cy="85" r="3.5"/><circle cx="50" cy="91" r="4.5"/><circle cx="66" cy="85" r="3.5"/>
    </g>`;
  } else if (subType === 7) {
    // Spice & Sacred Seed Motif (Cardamom / Clove / Saffron / Betel)
    core = `<g stroke="currentColor" fill="currentColor">
      <path d="M50 12 C68 28 70 64 50 88 C30 64 32 28 50 12 Z" fill-opacity="0.22" stroke-width="2.2"/>
      <path d="M50 12 C82 24 88 58 50 88" fill="none" stroke-width="1.8" stroke-dasharray="3 2"/>
      <path d="M50 12 C18 24 12 58 50 88" fill="none" stroke-width="1.8" stroke-dasharray="3 2"/>
      <circle cx="50" cy="40" r="3.5"/><circle cx="50" cy="52" r="3.5"/><circle cx="50" cy="64" r="3.5"/>
    </g>`;
  } else if (subType === 8) {
    // Banana / Palm Auspicious Pillar Arch
    core = `<g stroke="currentColor" fill="currentColor">
      <path d="M20 90 V36 M80 90 V36" stroke-width="3.5"/>
      <path d="M20 42 C34 18 52 14 62 24 C46 28 32 36 20 42 Z" fill-opacity="0.28" stroke-width="1.8"/>
      <path d="M80 42 C66 18 48 14 38 24 C54 28 68 36 80 42 Z" fill-opacity="0.28" stroke-width="1.8"/>
      <path d="M20 58 C34 38 48 36 56 44 C42 46 30 52 20 58 Z" fill-opacity="0.22" stroke-width="1.6"/>
      <path d="M80 58 C66 38 52 36 44 44 C58 46 70 52 80 58 Z" fill-opacity="0.22" stroke-width="1.6"/>
    </g>`;
  } else {
    // Pietra Dura Mughal Symmetrical Arabesque Crest
    core = `<g stroke="currentColor" fill="currentColor">
      <polygon points="50,8 88,50 50,92 12,50" fill-opacity="0.14" stroke-width="2"/>
      <path d="M50 18 C40 34 40 46 50 50 C60 46 60 34 50 18 Z" fill-opacity="0.35"/>
      <path d="M50 82 C40 66 40 54 50 50 C60 54 60 66 50 82 Z" fill-opacity="0.35"/>
      <path d="M18 50 C34 40 46 40 50 50 C46 60 34 60 18 50 Z" fill-opacity="0.35"/>
      <path d="M82 50 C66 40 54 40 50 50 C54 60 66 60 82 50 Z" fill-opacity="0.35"/>
      <circle cx="50" cy="50" r="5" fill="#FFFBEB"/>
    </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${aura}${core}</svg>`;
}

// ================= 2. CELEBRATION & FESTIVE (60 BESPOKE DESIGNS) =================
function buildCelebrationSvg(idx) {
  const aura = buildRoyalAura(idx, 2);
  const templates = [
    // 0: Shubh Mangal Kalash (Coconut, 5 mango leaves, brass pot, Swastik)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M50 10 C43 16 42 26 50 32 C58 26 57 16 50 10 Z" fill-opacity="0.4" stroke-width="1.8"/>
      <path d="M44 30 C30 22 18 26 22 36 C30 40 40 36 46 32 Z" fill-opacity="0.28" stroke-width="1.5"/>
      <path d="M56 30 C70 22 82 26 78 36 C70 40 60 36 54 32 Z" fill-opacity="0.28" stroke-width="1.5"/>
      <rect x="36" y="32" width="28" height="6" rx="2" fill-opacity="0.5"/>
      <path d="M38 38 C22 46 20 72 34 84 H66 C80 72 78 46 62 38 Z" fill-opacity="0.24" stroke-width="2.2"/>
      <path d="M50 52 V68 M42 60 H58 M50 52 H58 M58 60 V68 M50 68 H42 M42 60 V52" fill="none" stroke-width="2" stroke-linecap="round"/>
      <rect x="30" y="84" width="40" height="6" rx="2"/>
    </g>`,
    // 1: Lord Ganesha Emblem (Crown, ears, curved trunk, Ekadanta tusk & modak)
    `<g stroke="currentColor" fill="currentColor">
      <polygon points="50,8 38,28 62,28" fill-opacity="0.38" stroke-width="2" stroke-linejoin="round"/>
      <rect x="34" y="28" width="32" height="5" rx="2"/>
      <path d="M36 36 C20 34 14 46 18 58 C22 68 32 68 38 62" fill-opacity="0.22" stroke-width="2.2"/>
      <path d="M64 36 C80 34 86 46 82 58 C78 68 68 68 62 62" fill-opacity="0.22" stroke-width="2.2"/>
      <path d="M44 42 Q50 46 56 42 M46 46 Q50 50 54 46" fill="none" stroke-width="1.8"/>
      <path d="M48 50 C48 64 46 78 38 84 C32 88 26 82 32 76 C36 74 38 78 35 80" fill="none" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="32" cy="76" r="3.5" fill="#FEF08A"/>
      <polygon points="56,58 64,56 57,62"/>
    </g>`,
    // 2: Om Sacred Symbol (Calligraphic Devanagari Om inside lotus chakra)
    `<g stroke="currentColor" fill="currentColor">
      <circle cx="50" cy="50" r="38" fill-opacity="0.14" stroke-width="2.2"/>
      <path d="M32 42 C32 30 48 30 48 40 C48 48 36 50 36 58 C36 68 52 70 56 58 C58 50 68 48 72 56 C76 64 68 74 58 70" fill="none" stroke-width="4" stroke-linecap="round"/>
      <path d="M52 26 Q62 32 72 26" fill="none" stroke-width="3" stroke-linecap="round"/>
      <circle cx="62" cy="20" r="3.5"/>
    </g>`,
    // 3: Swastik Auspicious (Vedic right-facing swastika with 4 bindu dots)
    `<g stroke="currentColor" fill="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 20 V80 M20 50 H80 M50 20 H76 M80 50 V76 M50 80 H24 M20 50 V24" fill="none"/>
      <circle cx="35" cy="35" r="3.5" stroke="none"/><circle cx="65" cy="35" r="3.5" stroke="none"/>
      <circle cx="35" cy="65" r="3.5" stroke="none"/><circle cx="65" cy="65" r="3.5" stroke="none"/>
    </g>`,
    // 4: Shubh Labh Seal (Octagonal plaque with twin auspicious lamps)
    `<g stroke="currentColor" fill="currentColor">
      <polygon points="28,12 72,12 88,28 88,72 72,88 28,88 12,72 12,28" fill-opacity="0.2" stroke-width="2.4"/>
      <text x="50" y="45" text-anchor="middle" font-size="11" font-family="serif" font-weight="bold" stroke="none">SHUBH</text>
      <line x1="26" y1="51" x2="74" y2="51" stroke-width="1.5"/>
      <text x="50" y="66" text-anchor="middle" font-size="11" font-family="serif" font-weight="bold" stroke="none">LABH</text>
    </g>`,
    // 5: Royal Shehnai Pair (Crossed wedding wind instruments with flared bells & garlands)
    `<g stroke="currentColor" fill="currentColor">
      <g transform="rotate(-35 50 50)"><polygon points="47,12 53,12 56,74 64,86 36,86 44,74" fill-opacity="0.28" stroke-width="2" stroke-linejoin="round"/></g>
      <g transform="rotate(35 50 50)"><polygon points="47,12 53,12 56,74 64,86 36,86 44,74" fill-opacity="0.28" stroke-width="2" stroke-linejoin="round"/></g>
      <circle cx="50" cy="48" r="6" fill="#FEF08A" stroke-width="1.8"/>
    </g>`,
    // 6: Punjabi Dhol Drum (Barrel drum with diagonal rope lacing and curved dagga/tilli sticks)
    `<g stroke="currentColor" fill="currentColor">
      <ellipse cx="24" cy="52" rx="8" ry="22" fill-opacity="0.35" stroke-width="2.2"/>
      <ellipse cx="76" cy="52" rx="8" ry="22" fill-opacity="0.25" stroke-width="2.2"/>
      <path d="M24 30 Q50 24 76 30 M24 74 Q50 80 76 74" fill="none" stroke-width="2.4"/>
      <path d="M30 30 L42 74 L54 30 L66 74" fill="none" stroke-width="1.8"/>
      <path d="M34 14 L56 26 M68 14 L46 26" stroke-width="2.8" stroke-linecap="round"/>
      <circle cx="56" cy="26" r="3"/><circle cx="46" cy="26" r="3"/>
    </g>`,
    // 7: Tabla Classical Pair (Dayan and Bayan drums with black syahi center)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M14 46 L20 82 H46 L52 46 Z" fill-opacity="0.24" stroke-width="2.2"/>
      <ellipse cx="33" cy="46" rx="19" ry="9" fill-opacity="0.3" stroke-width="2.2"/>
      <circle cx="35" cy="46" r="5"/>
      <path d="M56 50 L60 82 H82 L86 50 Z" fill-opacity="0.24" stroke-width="2.2"/>
      <ellipse cx="71" cy="50" rx="15" ry="7" fill-opacity="0.3" stroke-width="2.2"/>
      <circle cx="71" cy="50" r="4"/>
    </g>`,
    // 8: Sitar Royal Strings (Long fretted neck, gourd tumba, tuning pegs)
    `<g stroke="currentColor" fill="currentColor" transform="rotate(-35 50 50)">
      <circle cx="50" cy="72" r="18" fill-opacity="0.26" stroke-width="2.4"/>
      <rect x="45" y="10" width="10" height="46" rx="2" fill-opacity="0.3" stroke-width="2"/>
      <line x1="50" y1="12" x2="50" y2="82" stroke-width="1.2"/>
      <line x1="38" y1="16" x2="45" y2="16" stroke-width="2"/><line x1="38" y1="24" x2="45" y2="24" stroke-width="2"/>
      <line x1="55" y1="20" x2="62" y2="20" stroke-width="2"/><line x1="55" y1="28" x2="62" y2="28" stroke-width="2"/>
      <path d="M36 72 Q50 62 64 72" fill="none" stroke-width="1.8"/>
    </g>`,
    // 9: Deepak Clay Diya (Ornate carved lamp with glowing 3-layer flame)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M50 14 C40 28 40 40 50 48 C60 40 60 28 50 14 Z" fill-opacity="0.4" stroke-width="2"/>
      <path d="M50 24 C45 32 45 40 50 46 C55 40 55 32 50 24 Z" fill="#FEF08A"/>
      <path d="M16 52 Q50 62 84 52 C78 76 64 84 50 84 C36 84 22 76 16 52 Z" fill-opacity="0.26" stroke-width="2.4"/>
      <path d="M32 84 H68 L72 90 H28 Z"/>
    </g>`,
    // 10: Hanging Temple Bell (Brass ghanti on chain with clapper and sound waves)
    `<g stroke="currentColor" fill="currentColor">
      <line x1="50" y1="6" x2="50" y2="26" stroke-width="3" stroke-dasharray="4 2"/>
      <circle cx="50" cy="28" r="5" fill="none" stroke-width="2.2"/>
      <path d="M36 34 H64 C68 50 74 64 82 74 H18 C26 64 32 50 36 34 Z" fill-opacity="0.26" stroke-width="2.4" stroke-linejoin="round"/>
      <line x1="24" y1="66" x2="76" y2="66" stroke-width="1.6"/>
      <circle cx="50" cy="79" r="5.5"/>
    </g>`,
    // 11: Conch Shankh (Sacred spiral Dakshinavarti Shankh)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M50 10 C72 24 82 48 68 70 C58 84 44 88 36 92 C28 84 20 68 24 48 C28 28 40 20 50 10 Z" fill-opacity="0.24" stroke-width="2.4"/>
      <path d="M36 36 C48 30 62 38 58 52 C54 64 40 62 38 52 C36 44 46 42 50 48" fill="none" stroke-width="2" stroke-linecap="round"/>
    </g>`,
    // 12: Royal Palki Doli (Curved dome bridal palanquin on bamboo poles)
    `<g stroke="currentColor" fill="currentColor">
      <line x1="6" y1="54" x2="94" y2="54" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M24 54 V38 C24 22 38 16 50 14 C62 16 76 22 76 38 V54 Z" fill-opacity="0.26" stroke-width="2.2"/>
      <rect x="22" y="54" width="56" height="18" rx="3" fill-opacity="0.32" stroke-width="2.2"/>
      <path d="M24 38 Q37 52 50 38 Q63 52 76 38" fill="none" stroke-width="1.8"/>
      <circle cx="50" cy="11" r="3"/>
    </g>`,
    // 13: Baraat Horse (Caparisoned Ghodi with plume kalgi and royal saddle)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M24 84 V56 C24 44 34 42 56 42 L68 20 L78 24 L74 36 L66 36 L64 52 C74 56 76 68 74 84 M36 58 V84 M60 58 V84" fill-opacity="0.24" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="38" y="42" width="18" height="12" rx="2" fill-opacity="0.5"/>
      <path d="M70 20 Q74 10 66 8" fill="none" stroke-width="2.2"/>
    </g>`,
    // 14: Decorated Royal Elephant (Gajraj with ornamental howdah canopy and raised trunk)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M22 84 V54 C22 38 36 34 56 34 C70 34 78 42 78 54 C78 64 86 64 88 54" fill="none" stroke-width="2.6" stroke-linecap="round"/>
      <ellipse cx="48" cy="54" rx="24" ry="18" fill-opacity="0.24" stroke-width="2.2"/>
      <line x1="30" y1="68" x2="30" y2="86" stroke-width="4"/><line x1="42" y1="70" x2="42" y2="86" stroke-width="4"/>
      <line x1="56" y1="70" x2="56" y2="86" stroke-width="4"/><line x1="66" y1="68" x2="66" y2="86" stroke-width="4"/>
      <path d="M34 36 V20 Q48 10 62 20 V36 Z" fill-opacity="0.35" stroke-width="2"/>
    </g>`,
    // 15: Udaipur Peacock (Dancing Mayura with full fanned tail of feather eyes)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M14 68 A36 36 0 0 1 86 68 Z" fill-opacity="0.16" stroke-width="2"/>
      ${[-65, -40, -15, 15, 40, 65].map((d) => {
        const [x, y] = polar(50, 68, 28, -90 + d);
        return `<circle cx="${x}" cy="${y}" r="4.5" fill-opacity="0.4" stroke-width="1.4"/>`;
      }).join('')}
      <path d="M50 38 C44 46 42 62 50 74 C58 62 56 46 50 38 Z" fill-opacity="0.5" stroke-width="2"/>
      <circle cx="50" cy="34" r="4.5"/>
      <path d="M50 30 L47 22 M50 30 L53 22" stroke-width="1.5"/>
    </g>`,
    // 16: Twin Love Swans (Facing Hamsa pair forming a heart with their necks)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M50 34 C44 20 32 22 34 34 C36 46 46 54 46 64 H16 C14 50 24 44 34 48" fill-opacity="0.24" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M50 34 C56 20 68 22 66 34 C64 46 54 54 54 64 H84 C86 50 76 44 66 48" fill-opacity="0.24" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M12 72 Q50 78 88 72" fill="none" stroke-width="2"/>
    </g>`,
    // 17: Vedic Agni Kund (Stepped Havan brick altar with sacred rising fire)
    `<g stroke="currentColor" fill="currentColor">
      <rect x="26" y="56" width="48" height="10" fill-opacity="0.25" stroke-width="2"/>
      <rect x="20" y="66" width="60" height="10" fill-opacity="0.3" stroke-width="2"/>
      <rect x="14" y="76" width="72" height="10" fill-opacity="0.35" stroke-width="2"/>
      <path d="M50 14 C36 30 34 46 50 56 C66 46 64 30 50 14 Z" fill-opacity="0.35" stroke-width="2.2"/>
      <path d="M36 28 C28 38 30 48 42 56 M64 28 C72 38 70 48 58 56" fill="none" stroke-width="2"/>
    </g>`,
    // 18: Groom Safa Turban (Rajasthani pleated pagdi with jeweled kalgi feather)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M18 62 C14 38 32 24 52 26 C72 24 86 38 82 62 C70 68 30 68 18 62 Z" fill-opacity="0.26" stroke-width="2.4"/>
      <path d="M22 46 Q50 34 78 46 M20 54 Q50 42 80 54" fill="none" stroke-width="1.8"/>
      <path d="M50 32 C46 18 54 8 66 10 C62 20 56 28 50 32 Z" fill-opacity="0.45" stroke-width="1.8"/>
      <circle cx="50" cy="34" r="4.5" fill="#FEF08A"/>
      <path d="M68 62 L78 88 L62 84 Z" fill-opacity="0.3" stroke-width="1.8"/>
    </g>`,
    // 19: Wedding Rings Interlocked (Solitaire diamond ring + wedding band)
    `<g stroke="currentColor" fill="currentColor">
      <circle cx="38" cy="58" r="22" fill="none" stroke-width="4"/>
      <circle cx="62" cy="58" r="22" fill="none" stroke-width="4"/>
      <polygon points="38,36 30,24 34,18 42,18 46,24" fill-opacity="0.45" stroke-width="2" stroke-linejoin="round"/>
      <line x1="38" y1="8" x2="38" y2="14" stroke-width="2"/><line x1="24" y1="14" x2="28" y2="18" stroke-width="2"/><line x1="52" y1="14" x2="48" y2="18" stroke-width="2"/>
    </g>`,
  ];

  if (idx < templates.length) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${aura}${templates[idx]}</svg>`;
  }

  // Remaining 20..59: Distinct ceremonial objects (Kaleera, Talwar, Chandelier, Kandil, Cake, Palace Jharokha, Chhatri, Ittar, Ghunghroo, etc.)
  const kind = idx % 10;
  const v = Math.floor(idx / 10);
  let body = '';

  if (kind === 0) {
    // Bridal Kaleera / Chooda Umbrella Hangings
    body = `<g stroke="currentColor" fill="currentColor">
      <line x1="50" y1="8" x2="50" y2="88" stroke-width="2.2"/>
      <path d="M26 36 A24 18 0 0 1 74 36 Z" fill-opacity="0.3" stroke-width="2"/>
      <path d="M20 62 A30 20 0 0 1 80 62 Z" fill-opacity="0.3" stroke-width="2"/>
      ${[26, 38, 50, 62, 74].map((x) => `<circle cx="${x}" cy="${68 + (v % 3) * 2}" r="2.5"/>`).join('')}
    </g>`;
  } else if (kind === 1) {
    // Royal Curved Sword Talwar & Shield
    body = `<g stroke="currentColor" fill="currentColor">
      <circle cx="50" cy="52" r="${20 + (v % 3) * 2}" fill-opacity="0.22" stroke-width="2.2"/>
      <path d="M18 82 C42 64 68 38 82 14" fill="none" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M82 82 C58 64 32 38 18 14" fill="none" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="42" cy="46" r="3"/><circle cx="58" cy="46" r="3"/><circle cx="42" cy="58" r="3"/><circle cx="58" cy="58" r="3"/>
    </g>`;
  } else if (kind === 2) {
    // Sangeet Crystal Chandelier / Jhoomar
    body = `<g stroke="currentColor" fill="currentColor">
      <line x1="50" y1="6" x2="50" y2="24" stroke-width="2.5"/>
      <path d="M18 42 H82 L72 24 H28 Z" fill-opacity="0.26" stroke-width="2"/>
      <path d="M26 58 H74 L66 42 H34 Z" fill-opacity="0.32" stroke-width="2"/>
      <path d="M22 42 Q36 68 50 42 Q64 68 78 42" fill="none" stroke-width="1.5" stroke-dasharray="2 2"/>
      <polygon points="50,64 56,76 50,88 44,76" fill-opacity="0.45"/>
    </g>`;
  } else if (kind === 3) {
    // Festive Akash Kandil / Hanging Lantern
    body = `<g stroke="currentColor" fill="currentColor">
      <line x1="50" y1="6" x2="50" y2="18" stroke-width="2.4"/>
      <polygon points="34,18 66,18 82,44 66,70 34,70 18,44" fill-opacity="0.24" stroke-width="2.2"/>
      <polygon points="42,18 58,18 68,44 58,70 42,70 32,44" fill="none" stroke-width="1.4"/>
      <path d="M38 70 L34 90 M46 70 L45 92 M54 70 L55 92 M62 70 L66 90" stroke-width="2" stroke-linecap="round"/>
    </g>`;
  } else if (kind === 4) {
    // Rangoli / Alpana / Kolam Floor Mandala
    const petals = 8 + (v % 3) * 2;
    body = `<g stroke="currentColor" fill="currentColor">
      <polygon points="${starPoints(50, 50, petals, 42, 22)}" fill-opacity="0.2" stroke-width="2"/>
      <circle cx="50" cy="50" r="24" fill="none" stroke-width="1.8" stroke-dasharray="4 2"/>
      <polygon points="${starPoints(50, 50, 4, 16, 6)}" fill-opacity="0.4"/>
    </g>`;
  } else if (kind === 5) {
    // Tiered Wedding Cake / Champagne Toast
    body = `<g stroke="currentColor" fill="currentColor">
      <rect x="18" y="64" width="64" height="20" rx="3" fill-opacity="0.24" stroke-width="2.2"/>
      <rect x="28" y="44" width="44" height="20" rx="3" fill-opacity="0.28" stroke-width="2.2"/>
      <rect x="38" y="26" width="24" height="18" rx="3" fill-opacity="0.32" stroke-width="2.2"/>
      <path d="M18 72 Q34 80 50 72 Q66 80 82 72" fill="none" stroke-width="1.6"/>
      <path d="M50 22 C44 16 40 10 46 8 C50 6 50 12 50 12 C50 12 50 6 54 8 C60 10 56 16 50 22 Z"/>
    </g>`;
  } else if (kind === 6) {
    // Royal Wax Seal Shagun Envelope
    body = `<g stroke="currentColor" fill="currentColor">
      <rect x="12" y="22" width="76" height="56" rx="4" fill-opacity="0.18" stroke-width="2.4"/>
      <path d="M12 24 L50 54 L88 24" fill="none" stroke-width="2.4"/>
      <circle cx="50" cy="54" r="10" fill-opacity="0.5" stroke-width="2"/>
      <polygon points="${starPoints(50, 54, 6, 6, 3)}" fill="#FEF08A"/>
    </g>`;
  } else if (kind === 7) {
    // Palace Mandap Four-Pillar Canopy
    body = `<g stroke="currentColor" fill="currentColor">
      <path d="M12 34 C12 18 36 14 50 8 C64 14 88 18 88 34 Z" fill-opacity="0.28" stroke-width="2.2"/>
      <line x1="20" y1="34" x2="20" y2="84" stroke-width="3"/>
      <line x1="36" y1="34" x2="36" y2="84" stroke-width="2"/>
      <line x1="64" y1="34" x2="64" y2="84" stroke-width="2"/>
      <line x1="80" y1="34" x2="80" y2="84" stroke-width="3"/>
      <rect x="10" y="84" width="80" height="6" rx="2"/>
      <path d="M20 42 Q50 56 80 42" fill="none" stroke-width="1.8" stroke-dasharray="3 2"/>
    </g>`;
  } else if (kind === 8) {
    // Gulabdan Rosewater Sprinkler / Ittar Bottle
    body = `<g stroke="currentColor" fill="currentColor">
      <circle cx="50" cy="64" r="20" fill-opacity="0.26" stroke-width="2.2"/>
      <path d="M44 44 L47 16 H53 L56 44 Z" fill-opacity="0.35" stroke-width="2"/>
      <circle cx="50" cy="12" r="4"/>
      <rect x="34" y="84" width="32" height="6" rx="2"/>
      <polygon points="50,54 58,64 50,74 42,64" fill-opacity="0.4"/>
    </g>`;
  } else {
    // Ghunghroo Anklet / Manjira Cymbals
    body = `<g stroke="currentColor" fill="currentColor">
      <path d="M16 44 Q50 68 84 44" fill="none" stroke-width="3.5" stroke-linecap="round"/>
      ${[20, 32, 44, 56, 68, 80].map((x, k) => {
        const y = 48 + Math.sin(((k + 0.5) / 6) * Math.PI) * 18;
        return `<circle cx="${x}" cy="${y.toFixed(1)}" r="6" fill-opacity="0.35" stroke-width="1.8"/><circle cx="${x}" cy="${(y + 2).toFixed(1)}" r="1.5"/>`;
      }).join('')}
    </g>`;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${aura}${body}</svg>`;
}

// ================= 3. FOOD & DRINKS (50 BESPOKE DESIGNS) =================
function buildFoodDrinkSvg(idx) {
  const aura = buildRoyalAura(idx, 3);
  const items = [
    // 0: Royal Silver Thali (Large round platter with 6 katori bowls, rice, naan)
    `<g stroke="currentColor" fill="currentColor">
      <circle cx="50" cy="50" r="38" fill-opacity="0.16" stroke-width="2.6"/>
      <circle cx="50" cy="50" r="33" fill="none" stroke-width="1" stroke-dasharray="3 2"/>
      ${[-130, -90, -50, -10, 30].map((deg) => {
        const [x, y] = polar(50, 50, 22, deg);
        return `<circle cx="${x}" cy="${y}" r="6.5" fill-opacity="0.35" stroke-width="1.6"/>`;
      }).join('')}
      <ellipse cx="42" cy="64" rx="14" ry="9" fill-opacity="0.28" stroke-width="1.8"/>
      <circle cx="50" cy="48" r="5" fill-opacity="0.4"/>
    </g>`,
    // 1: Motichoor Laddu Box (Pyramid of round textured laddus in ornate tray)
    `<g stroke="currentColor" fill="currentColor">
      <polygon points="14,64 86,64 76,82 24,82" fill-opacity="0.3" stroke-width="2.2"/>
      <circle cx="32" cy="56" r="9" fill-opacity="0.35" stroke-width="2"/><circle cx="50" cy="56" r="9" fill-opacity="0.35" stroke-width="2"/><circle cx="68" cy="56" r="9" fill-opacity="0.35" stroke-width="2"/>
      <circle cx="41" cy="42" r="9" fill-opacity="0.4" stroke-width="2"/><circle cx="59" cy="42" r="9" fill-opacity="0.4" stroke-width="2"/>
      <circle cx="50" cy="28" r="9" fill-opacity="0.45" stroke-width="2"/>
    </g>`,
    // 2: Kaju Katli Diamond (Overlapping diamond cashew fudge slices with silver vark)
    `<g stroke="currentColor" fill="currentColor">
      <polygon points="36,24 60,44 36,64 12,44" fill-opacity="0.24" stroke-width="2.2"/>
      <polygon points="64,24 88,44 64,64 40,44" fill-opacity="0.24" stroke-width="2.2"/>
      <polygon points="50,38 76,60 50,82 24,60" fill-opacity="0.36" stroke-width="2.4"/>
      <polygon points="50,48 62,58 50,68 38,58" fill="#FFFBEB" fill-opacity="0.6" stroke="none"/>
    </g>`,
    // 3: Jalebi Saffron Swirl (Crisp concentric pretzel spiral coils)
    `<g stroke="currentColor" fill="none" stroke-width="3.2" stroke-linecap="round">
      <path d="M50 50 C54 44 62 48 58 56 C52 66 36 62 38 48 C40 32 62 28 68 44 C76 62 56 78 36 70 C18 62 20 32 42 22 C64 12 84 32 80 56"/>
    </g>`,
    // 4: Kesar Pista Kulfi (Conical matka kulfi on wooden stick with pistachio garnish)
    `<g stroke="currentColor" fill="currentColor">
      <rect x="46" y="66" width="8" height="24" rx="4" fill-opacity="0.4" stroke-width="2"/>
      <path d="M30 66 L38 22 A12 12 0 0 1 62 22 L70 66 Z" fill-opacity="0.28" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M33 48 Q50 56 67 48" fill="none" stroke-width="1.8"/>
      <circle cx="46" cy="30" r="2"/><circle cx="54" cy="34" r="2"/><circle cx="48" cy="40" r="2"/>
    </g>`,
    // 5: Masala Chai Kulhad (Terracotta clay cup with rising aromatic steam)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M26 38 H74 L66 84 H34 Z" fill-opacity="0.26" stroke-width="2.4" stroke-linejoin="round"/>
      <ellipse cx="50" cy="38" rx="24" ry="6" fill-opacity="0.4" stroke-width="2.2"/>
      <path d="M29 52 H71 M31 66 H69" stroke-width="1.6"/>
      <path d="M40 26 Q44 18 40 10 M50 24 Q54 16 50 8 M60 26 Q64 18 60 10" fill="none" stroke-width="2.2" stroke-linecap="round"/>
    </g>`,
    // 6: Mughlai Biryani Handi (Domed copper degchi pot with dum seal & steam)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M24 44 H76 C84 56 80 78 64 84 H36 C20 78 16 56 24 44 Z" fill-opacity="0.26" stroke-width="2.4"/>
      <path d="M20 44 Q50 50 80 44" fill="none" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M28 42 C32 28 68 28 72 42 Z" fill-opacity="0.35" stroke-width="2"/>
      <circle cx="50" cy="26" r="4"/>
    </g>`,
    // 7: Samosa Platter (Two triangular crispy samosas with chutney bowl)
    `<g stroke="currentColor" fill="currentColor">
      <ellipse cx="50" cy="72" rx="38" ry="12" fill-opacity="0.18" stroke-width="2.2"/>
      <polygon points="36,26 58,68 16,68" fill-opacity="0.28" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="62,30 82,68 44,68" fill-opacity="0.34" stroke-width="2.2" stroke-linejoin="round"/>
      <circle cx="50" cy="72" r="8" fill-opacity="0.5" stroke-width="1.8"/>
    </g>`,
    // 8: Modak Auspicious (Pleated steamed dumpling sacred to Lord Ganesha)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M50 14 C56 30 80 46 76 68 C72 84 28 84 24 68 C20 46 44 30 50 14 Z" fill-opacity="0.26" stroke-width="2.4"/>
      <path d="M50 14 C40 40 36 62 40 80 M50 14 V82 M50 14 C60 40 64 62 60 80" fill="none" stroke-width="1.6"/>
    </g>`,
    // 9: Champagne Tower (3-tier stacked coupe glasses with sparkling bubbles)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M38 18 H62 C62 30 50 32 50 32 C50 32 38 30 38 18 Z M50 32 V44 M42 44 H58" fill-opacity="0.28" stroke-width="2"/>
      <path d="M24 44 H48 C48 56 36 58 36 58 C36 58 24 56 24 44 Z M36 58 V70 M28 70 H44" fill-opacity="0.28" stroke-width="2"/>
      <path d="M52 44 H76 C76 56 64 58 64 58 C64 58 52 56 52 44 Z M64 58 V70 M56 70 H72" fill-opacity="0.28" stroke-width="2"/>
      <line x1="14" y1="74" x2="86" y2="74" stroke-width="3" stroke-linecap="round"/>
      <circle cx="46" cy="12" r="2"/><circle cx="54" cy="10" r="2.5"/>
    </g>`,
  ];

  const baseIdx = idx % items.length;
  const tier = Math.floor(idx / items.length);
  if (tier === 0) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${aura}${items[baseIdx]}</svg>`;
  }

  // Distinct variations with custom garnishes, cloches, goblets, stands & platters for indices 10..49
  const garnish =
    tier === 1
      ? `<path d="M18 88 H82" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><circle cx="50" cy="10" r="2.5" fill="currentColor"/>`
      : tier === 2
      ? `<polygon points="${starPoints(20, 20, 4, 6, 2)}" fill="currentColor"/><polygon points="${starPoints(80, 20, 4, 6, 2)}" fill="currentColor"/>`
      : tier === 3
      ? `<path d="M12 50 C12 20 88 20 88 50" fill="none" stroke="currentColor" stroke-width="1.4" stroke-dasharray="4 2"/>`
      : `<rect x="10" y="10" width="80" height="80" rx="${6 + baseIdx}" fill="none" stroke="currentColor" stroke-width="1.2" opacity="0.5"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${aura}${garnish}<g transform="scale(${0.92 + (idx % 3) * 0.03}) translate(${3 - (idx % 3)}, ${3 - (idx % 3)})">${items[baseIdx]}</g></svg>`;
}

// ================= 4. PEOPLE & AVATARS (50 BESPOKE DESIGNS) =================
function buildPeopleAvatarSvg(idx) {
  const aura = buildRoyalAura(idx, 4);
  const archFrame = `<path d="M12 90 V42 C12 22 32 14 50 6 C68 14 88 22 88 42 V90 Z" stroke="currentColor" stroke-width="1.6" fill="currentColor" fill-opacity="0.07"/>`;

  const poses = [
    // 0: Royal Rajput Groom (Safa turban with kalgi, mustache, sherwani necklace)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M32 34 C30 20 42 14 54 16 C66 14 70 24 68 34 Z" fill-opacity="0.38" stroke-width="2"/>
      <path d="M52 18 Q58 8 66 10" fill="none" stroke-width="2.2"/>
      <circle cx="50" cy="40" r="11" fill-opacity="0.22" stroke-width="2"/>
      <path d="M43 43 Q50 40 57 43" fill="none" stroke-width="1.8"/>
      <path d="M24 88 C24 62 36 54 50 54 C64 54 76 62 76 88 Z" fill-opacity="0.28" stroke-width="2.2"/>
      <path d="M38 56 Q50 72 62 56 M36 62 Q50 80 64 62" fill="none" stroke-width="1.6" stroke-dasharray="2 2"/>
    </g>`,
    // 1: Maharani Bride Veil (Maang tikka, nath nose ring, draped dupatta & choker)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M22 88 C20 48 30 18 50 18 C70 18 80 48 78 88" fill-opacity="0.16" stroke-width="2"/>
      <circle cx="50" cy="40" r="11" fill-opacity="0.24" stroke-width="2"/>
      <circle cx="50" cy="30" r="2.5" fill="#FEF08A"/>
      <circle cx="55" cy="43" r="3" fill="none" stroke-width="1.4"/>
      <path d="M28 88 C28 64 38 56 50 56 C62 56 72 64 72 88 Z" fill-opacity="0.3" stroke-width="2"/>
      <path d="M40 56 Q50 64 60 56" fill="none" stroke-width="3"/>
    </g>`,
    // 2: Bride & Groom Varmala (Couple facing each other holding floral garland)
    `<g stroke="currentColor" fill="currentColor">
      <circle cx="36" cy="36" r="9" fill-opacity="0.26" stroke-width="2"/>
      <path d="M28 28 L36 20 L44 28" fill-opacity="0.4"/>
      <circle cx="64" cy="38" r="8.5" fill-opacity="0.26" stroke-width="2"/>
      <path d="M20 88 C20 62 48 62 48 88 Z" fill-opacity="0.25" stroke-width="2"/>
      <path d="M52 88 C52 64 80 64 80 88 Z" fill-opacity="0.25" stroke-width="2"/>
      <path d="M38 56 Q50 72 62 56" fill="none" stroke-width="3.5" stroke-dasharray="3 2" stroke-linecap="round"/>
    </g>`,
    // 3: Phera Walking Couple (Agni sacred fire in front, couple linked by gathbandhan)
    `<g stroke="currentColor" fill="currentColor">
      <circle cx="34" cy="34" r="8" fill-opacity="0.25" stroke-width="1.8"/>
      <circle cx="66" cy="36" r="8" fill-opacity="0.25" stroke-width="1.8"/>
      <path d="M22 84 C22 60 46 60 46 84 Z M54 84 C54 62 78 62 78 84 Z" fill-opacity="0.22" stroke-width="1.8"/>
      <path d="M42 58 Q50 64 58 58" fill="none" stroke-width="2"/>
      <path d="M50 66 C44 74 44 82 50 86 C56 82 56 74 50 66 Z" fill="#FEF08A" stroke-width="1.5"/>
    </g>`,
    // 4: Sangeet Dancing Couple (Raised arms in celebratory dance pose)
    `<g stroke="currentColor" fill="currentColor">
      <circle cx="36" cy="34" r="8" fill-opacity="0.26" stroke-width="2"/>
      <circle cx="64" cy="34" r="8" fill-opacity="0.26" stroke-width="2"/>
      <path d="M36 44 L20 24 M36 44 L50 38 M64 44 L80 24 M64 44 L50 38" stroke-width="2.5" stroke-linecap="round"/>
      <polygon points="24,86 36,46 48,86" fill-opacity="0.24" stroke-width="2"/>
      <polygon points="50,86 64,46 78,86" fill-opacity="0.3" stroke-width="2"/>
    </g>`,
    // 5: Mehendi Bride Hands (Two palms adorned with mandala henna patterns)
    `<g stroke="currentColor" fill="currentColor">
      <path d="M22 86 V48 C22 36 26 24 34 24 C42 24 46 36 46 48 V86 Z" fill-opacity="0.22" stroke-width="2.2"/>
      <path d="M54 86 V48 C54 36 58 24 66 24 C74 24 78 36 78 48 V86 Z" fill-opacity="0.22" stroke-width="2.2"/>
      <circle cx="34" cy="60" r="6" fill-opacity="0.4"/><circle cx="66" cy="60" r="6" fill-opacity="0.4"/>
      <line x1="22" y1="78" x2="46" y2="78" stroke-width="2.5"/><line x1="54" y1="78" x2="78" y2="78" stroke-width="2.5"/>
    </g>`,
    // 6: Garba Dandiya Pair (Crossed dandiya sticks above dancing figures)
    `<g stroke="currentColor" fill="currentColor">
      <line x1="28" y1="14" x2="54" y2="34" stroke-width="3" stroke-linecap="round"/>
      <line x1="72" y1="14" x2="46" y2="34" stroke-width="3" stroke-linecap="round"/>
      <circle cx="34" cy="42" r="7.5" fill-opacity="0.26" stroke-width="2"/>
      <circle cx="66" cy="42" r="7.5" fill-opacity="0.26" stroke-width="2"/>
      <polygon points="20,86 34,52 48,86" fill-opacity="0.26" stroke-width="2"/>
      <polygon points="52,86 66,52 80,86" fill-opacity="0.26" stroke-width="2"/>
    </g>`,
    // 7: Ghoomar Rajasthani Dancer (Twirling wide flared lehenga skirt with veil)
    `<g stroke="currentColor" fill="currentColor">
      <circle cx="50" cy="28" r="8" fill-opacity="0.28" stroke-width="2"/>
      <path d="M34 24 Q50 12 66 24" fill="none" stroke-width="2.4" stroke-linecap="round"/>
      <polygon points="14,84 44,44 56,44 86,84" fill-opacity="0.28" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M18 78 Q50 86 82 78" fill="none" stroke-width="2" stroke-dasharray="3 2"/>
    </g>`,
    // 8: Dhol Wala / Shehnai Musician Avatar
    `<g stroke="currentColor" fill="currentColor">
      <circle cx="50" cy="30" r="9" fill-opacity="0.26" stroke-width="2"/>
      <path d="M38 22 L50 14 L62 22" fill-opacity="0.4" stroke-width="1.8"/>
      <path d="M30 86 V44 H70 V86" fill-opacity="0.2" stroke-width="2"/>
      <rect x="28" y="54" width="44" height="22" rx="6" fill-opacity="0.4" stroke-width="2.2"/>
      <line x1="36" y1="54" x2="44" y2="76" stroke-width="1.6"/><line x1="56" y1="54" x2="64" y2="76" stroke-width="1.6"/>
    </g>`,
    // 9: Forever Together Monogram Crest (Couple silhouette inside royal wreath)
    `<g stroke="currentColor" fill="currentColor">
      <circle cx="50" cy="50" r="34" fill="none" stroke-width="2.2" stroke-dasharray="5 3"/>
      <circle cx="42" cy="40" r="7" fill-opacity="0.35"/>
      <circle cx="58" cy="42" r="6.5" fill-opacity="0.35"/>
      <path d="M30 74 C30 56 52 56 52 74 Z M48 74 C48 58 70 58 70 74 Z" fill-opacity="0.3"/>
      <path d="M50 26 C46 20 40 22 44 28 L50 32 L56 28 C60 22 54 20 50 26 Z"/>
    </g>`,
  ];

  const base = poses[idx % poses.length];
  const group = Math.floor(idx / poses.length);
  const crownTop =
    group === 1
      ? `<polygon points="42,14 46,6 50,12 54,6 58,14" fill="currentColor"/>`
      : group === 2
      ? `<circle cx="24" cy="24" r="3" fill="currentColor"/><circle cx="76" cy="24" r="3" fill="currentColor"/>`
      : group === 3
      ? `<path d="M20 88 H80" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`
      : group === 4
      ? `<polygon points="${starPoints(50, 12, 5, 6, 2.5)}" fill="currentColor"/>`
      : '';

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${aura}${archFrame}${crownTop}${base}</svg>`;
}

// ================= 5. BUSINESS, VENUE & MAP ICONS (50 BESPOKE DESIGNS) =================
function buildVenueMarketingSvg(idx) {
  const aura = buildRoyalAura(idx, 5);
  const frameRadius = 10 + (idx % 5) * 4;
  const badgeFrame = `<rect x="12" y="12" width="76" height="76" rx="${frameRadius}" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-width="2"/>`;

  const icons = [
    // 0: Palace Venue Pin
    `<g stroke="currentColor" fill="currentColor"><path d="M50 18 C34 18 24 30 24 44 C24 62 50 82 50 82 C50 82 76 62 76 44 C76 30 66 18 50 18 Z" fill-opacity="0.26" stroke-width="2.4"/><path d="M40 50 V38 L50 30 L60 38 V50 Z" fill="#FEF08A"/></g>`,
    // 1: Royal Carriage / Valet Car
    `<g stroke="currentColor" fill="currentColor"><path d="M20 56 L28 38 H72 L80 56 H86 V70 H14 V56 Z" fill-opacity="0.26" stroke-width="2.2" stroke-linejoin="round"/><circle cx="28" cy="70" r="7"/><circle cx="72" cy="70" r="7"/></g>`,
    // 2: Airport Pickup Plane
    `<g stroke="currentColor" fill="currentColor"><path d="M50 18 L56 42 L84 52 L84 58 L56 52 L54 74 L64 80 V84 L50 80 L36 84 V80 L46 74 L44 52 L16 58 L16 52 L44 42 Z" fill-opacity="0.3" stroke-width="2" stroke-linejoin="round"/></g>`,
    // 3: Luxury Heritage Hotel
    `<g stroke="currentColor" fill="currentColor"><rect x="24" y="34" width="52" height="48" fill-opacity="0.22" stroke-width="2.2"/><path d="M24 34 Q50 16 76 34 Z" fill-opacity="0.35" stroke-width="2.2"/><rect x="44" y="64" width="12" height="18"/><rect x="32" y="42" width="8" height="8"/><rect x="60" y="42" width="8" height="8"/><rect x="32" y="54" width="8" height="8"/><rect x="60" y="54" width="8" height="8"/></g>`,
    // 4: Date Calendar Page
    `<g stroke="currentColor" fill="currentColor"><rect x="22" y="26" width="56" height="54" rx="5" fill-opacity="0.22" stroke-width="2.2"/><line x1="22" y1="40" x2="78" y2="40" stroke-width="2.2"/><line x1="34" y1="20" x2="34" y2="30" stroke-width="3" stroke-linecap="round"/><line x1="66" y1="20" x2="66" y2="30" stroke-width="3" stroke-linecap="round"/><path d="M50 68 C42 60 38 52 44 48 C48 45 50 50 50 50 C50 50 52 45 56 48 C62 52 58 60 50 68 Z"/></g>`,
    // 5: Auspicious Muhurat Clock
    `<g stroke="currentColor" fill="currentColor"><circle cx="50" cy="50" r="28" fill-opacity="0.22" stroke-width="2.4"/><polyline points="50,32 50,50 64,56" fill="none" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="3"/></g>`,
    // 6: RSVP Phone / WhatsApp
    `<g stroke="currentColor" fill="currentColor"><path d="M30 24 H42 L46 36 L38 42 A26 26 0 0 0 58 62 L64 54 L76 58 V70 C76 76 68 80 60 78 C38 72 28 62 22 40 C20 32 24 24 30 24 Z" fill-opacity="0.28" stroke-width="2.2" stroke-linejoin="round"/></g>`,
    // 7: QR Scan Frame Icon
    `<g stroke="currentColor" fill="currentColor"><rect x="24" y="24" width="18" height="18" fill-opacity="0.3" stroke-width="2.2"/><rect x="58" y="24" width="18" height="18" fill-opacity="0.3" stroke-width="2.2"/><rect x="24" y="58" width="18" height="18" fill-opacity="0.3" stroke-width="2.2"/><rect x="58" y="58" width="8" height="8"/><rect x="68" y="68" width="8" height="8"/><rect x="58" y="68" width="6" height="6"/></g>`,
    // 8: Live Stream Camera / Photography
    `<g stroke="currentColor" fill="currentColor"><rect x="20" y="34" width="60" height="42" rx="6" fill-opacity="0.24" stroke-width="2.2"/><path d="M36 34 L42 24 H58 L64 34" fill-opacity="0.35" stroke-width="2"/><circle cx="50" cy="55" r="12" fill="none" stroke-width="2.4"/><circle cx="50" cy="55" r="5"/></g>`,
    // 9: Blessings Only / Namaste Hands
    `<g stroke="currentColor" fill="currentColor"><path d="M50 20 C42 34 32 52 36 74 L50 68 Z" fill-opacity="0.28" stroke-width="2.2" stroke-linejoin="round"/><path d="M50 20 C58 34 68 52 64 74 L50 68 Z" fill-opacity="0.28" stroke-width="2.2" stroke-linejoin="round"/><path d="M30 78 H70" stroke-width="2.5" stroke-linecap="round"/></g>`,
  ];

  const icon = icons[idx % icons.length];
  const tier = Math.floor(idx / icons.length);
  const cornerMarks =
    tier === 0
      ? `<polygon points="50,6 54,11 50,16 46,11" fill="currentColor"/>`
      : tier === 1
      ? `<circle cx="20" cy="20" r="2.2" fill="currentColor"/><circle cx="80" cy="20" r="2.2" fill="currentColor"/><circle cx="20" cy="80" r="2.2" fill="currentColor"/><circle cx="80" cy="80" r="2.2" fill="currentColor"/>`
      : tier === 2
      ? `<polygon points="50,6 54,11 50,16 46,11" fill="currentColor"/><polygon points="50,84 54,89 50,94 46,89" fill="currentColor"/>`
      : tier === 3
      ? `<rect x="16" y="16" width="68" height="68" rx="${Math.max(4, frameRadius - 4)}" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="3 2"/>`
      : `<circle cx="50" cy="12" r="3" fill="currentColor"/><circle cx="50" cy="88" r="3" fill="currentColor"/><circle cx="12" cy="50" r="3" fill="currentColor"/><circle cx="88" cy="50" r="3" fill="currentColor"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${aura}${badgeFrame}${cornerMarks}${icon}</svg>`;
}

// ================= 6. ORNATE DOODLES & FLOURISHES (40 BESPOKE DESIGNS) =================
function buildDoodleFlourishSvg(idx) {
  const aura = buildRoyalAura(idx, 6);
  const wave = 8 + (idx % 7) * 3;
  const styles = [
    // 0: Royal Filigree Flourish
    `<g stroke="currentColor" fill="none" stroke-width="2.2" stroke-linecap="round">
      <path d="M8 50 C22 ${50 - wave} 36 ${50 + wave} 50 50 C64 ${50 - wave} 78 ${50 + wave} 92 50"/>
      <path d="M24 44 C18 32 30 26 34 36 M76 56 C82 68 70 74 66 64"/>
      <polygon points="50,36 56,50 50,64 44,50" fill="currentColor"/>
    </g>`,
    // 1: Calligraphic Under-swash
    `<g stroke="currentColor" fill="none" stroke-width="2.4" stroke-linecap="round">
      <path d="M10 44 Q50 68 90 44"/>
      <path d="M22 56 Q50 76 78 56" stroke-width="1.4"/>
      <circle cx="50" cy="64" r="3.5" fill="currentColor"/>
    </g>`,
    // 2: Ornate Frame Corner Flourish
    `<g stroke="currentColor" fill="currentColor" transform="rotate(${(idx % 4) * 90} 50 50)">
      <path d="M16 84 V24 A8 8 0 0 1 24 16 H84" fill="none" stroke-width="3"/>
      <path d="M24 68 V32 A8 8 0 0 1 32 24 H68" fill="none" stroke-width="1.6"/>
      <polygon points="24,24 38,28 28,38"/>
      <circle cx="16" cy="84" r="3"/><circle cx="84" cy="16" r="3"/>
    </g>`,
    // 3: Looping Heart Arrow Doodle
    `<g stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round">
      <path d="M10 62 C28 62 42 36 50 28 C58 36 72 62 88 46"/>
      <path d="M50 48 C42 40 36 30 44 24 C48 20 50 26 50 26 C50 26 52 20 56 24 C64 30 58 40 50 48 Z" fill="currentColor" fill-opacity="0.3"/>
      <polygon points="92,42 78,42 86,52" fill="currentColor"/>
    </g>`,
    // 4: Chandelier Jhumka Drop
    `<g stroke="currentColor" fill="currentColor">
      <line x1="50" y1="10" x2="50" y2="34" stroke-width="2.2"/>
      <path d="M28 54 A22 20 0 0 1 72 54 Z" fill-opacity="0.3" stroke-width="2.2"/>
      ${[30, 40, 50, 60, 70].map((x) => `<line x1="${x}" y1="54" x2="${x}" y2="74" stroke-width="1.5"/><circle cx="${x}" cy="77" r="2.8"/>`).join('')}
    </g>`,
    // 5: Festive Bunting Flags String
    `<g stroke="currentColor" fill="currentColor">
      <path d="M8 26 Q50 44 92 26" fill="none" stroke-width="2.4"/>
      <polygon points="14,28 28,32 21,54" fill-opacity="0.28" stroke-width="1.8"/>
      <polygon points="32,33 46,35 39,58" fill-opacity="0.35" stroke-width="1.8"/>
      <polygon points="54,35 68,33 61,58" fill-opacity="0.28" stroke-width="1.8"/>
      <polygon points="72,32 86,28 79,54" fill-opacity="0.35" stroke-width="1.8"/>
    </g>`,
    // 6: Sunburst Ray Divider
    `<g stroke="currentColor" fill="currentColor">
      <line x1="8" y1="62" x2="92" y2="62" stroke-width="2.5"/>
      <path d="M30 62 A20 20 0 0 1 70 62 Z" fill-opacity="0.28" stroke-width="2"/>
      ${[-70, -45, -20, 0, 20, 45, 70].map((d) => {
        const [x1, y1] = polar(50, 62, 22, -90 + d);
        const [x2, y2] = polar(50, 62, 36, -90 + d);
        return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="1.8"/>`;
      }).join('')}
    </g>`,
    // 7: Pearl String Swag & Tassels
    `<g stroke="currentColor" fill="currentColor">
      <path d="M10 24 Q30 56 50 24 Q70 56 90 24" fill="none" stroke-width="2" stroke-dasharray="3 3"/>
      <path d="M10 24 Q30 72 50 24 Q70 72 90 24" fill="none" stroke-width="1.5"/>
      <polygon points="50,24 55,44 50,52 45,44" fill-opacity="0.4"/>
      <circle cx="30" cy="54" r="3.5"/><circle cx="70" cy="54" r="3.5"/>
    </g>`,
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${aura}${styles[idx % styles.length]}</svg>`;
}

// ================= 7. ROYAL SEALS & BADGES (50 BESPOKE DESIGNS) =================
function buildStickerBadgeSvg(idx, name) {
  const words = name.replace(/[^a-zA-Z0-9 ]/g, '').split(/\s+/).filter(Boolean);
  const line1 = (words[0] || 'ROYAL').toUpperCase().slice(0, 10);
  const line2 = (words[1] || 'VIVAH').toUpperCase().slice(0, 10);
  const shapeMode = idx % 5;
  const spikes = 14 + (idx % 7) * 2;

  let outerFrame = '';
  if (shapeMode === 0) {
    outerFrame = `<polygon points="${starPoints(50, 50, spikes, 45, 38, idx * 5)}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>`;
  } else if (shapeMode === 1) {
    outerFrame = `<path d="${scallopPath(50, 50, 38, 12 + (idx % 6), 6)}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2"/>`;
  } else if (shapeMode === 2) {
    outerFrame = `<polygon points="${polyPoints(50, 50, 8, 44, 22.5)}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2.4"/>`;
  } else if (shapeMode === 3) {
    outerFrame = `<path d="M16 14 H84 V52 C84 74 68 88 50 94 C32 88 16 74 16 52 Z" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2.4"/>`;
  } else {
    outerFrame = `<g stroke="currentColor" fill="currentColor"><polygon points="34,70 24,94 36,88 44,96 46,72" fill-opacity="0.35" stroke-width="1.6"/><polygon points="66,70 76,94 64,88 56,96 54,72" fill-opacity="0.35" stroke-width="1.6"/><circle cx="50" cy="46" r="36" fill-opacity="0.22" stroke-width="2.4"/></g>`;
  }

  const cy = shapeMode === 4 ? 46 : 50;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">
    ${outerFrame}
    <circle cx="50" cy="${cy}" r="30" stroke="currentColor" stroke-width="1.3" stroke-dasharray="3 2"/>
    <polygon points="42,${cy - 18} 45,${cy - 24} 50,${cy - 20} 55,${cy - 24} 58,${cy - 18}" fill="currentColor"/>
    <text x="50" y="${cy - 2}" text-anchor="middle" fill="currentColor" font-family="Cinzel, serif" font-size="8" font-weight="bold">${line1}</text>
    <text x="50" y="${cy + 9}" text-anchor="middle" fill="currentColor" font-family="Cinzel, serif" font-size="7.2" font-weight="bold">${line2}</text>
    <polygon points="50,${cy + 14} 54,${cy + 18} 50,${cy + 22} 46,${cy + 18}" fill="currentColor"/>
  </svg>`;
}

// Load the 10 Royal Wedding Torans from src/data/elements/torans10.json
let existingTorans10 = [];
const toransJsonPath = path.join(DATA_DIR, 'torans10.json');
if (fs.existsSync(toransJsonPath)) {
  try {
    existingTorans10 = JSON.parse(fs.readFileSync(toransJsonPath, 'utf-8'));
  } catch (e) {
    console.warn('Could not parse torans10.json:', e.message);
  }
}

const graphics = [];

for (const spec of GRAPHIC_SPECS) {
  const subDir = path.join(PUBLIC_GRAPHICS_DIR, spec.id);
  fs.mkdirSync(subDir, { recursive: true });
  for (let i = 0; i < spec.count; i++) {
    const num = String(i + 1).padStart(2, '0');
    const id = `graphic-${spec.id}-${num}`;
    const name = spec.names[i] || `${spec.label} ${i + 1}`;
    let svg = '';

    if (spec.id === 'flowers-botanicals') {
      svg = buildBotanicalSvg(i);
    } else if (spec.id === 'celebration-festive') {
      svg = buildCelebrationSvg(i);
    } else if (spec.id === 'food-drinks') {
      svg = buildFoodDrinkSvg(i);
    } else if (spec.id === 'people-avatars') {
      svg = buildPeopleAvatarSvg(i);
    } else if (spec.id === 'business-marketing') {
      svg = buildVenueMarketingSvg(i);
    } else if (spec.id === 'arrows-doodles') {
      svg = buildDoodleFlourishSvg(i);
    } else {
      svg = buildStickerBadgeSvg(i, name);
    }

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

// Append the 10 Royal Wedding Torans and write their SVG files to public/assets/elements/torans/
for (const toran of existingTorans10) {
  const fileName = `${toran.id}.svg`;
  fs.writeFileSync(path.join(PUBLIC_TORANS_DIR, fileName), toran.svgContent, 'utf-8');
  graphics.push(toran);
}

// ================= 30 FUNCTIONAL CLIPPING FRAMES WITH ORNATE FILIGREE BORDERS =================
const FRAME_SPECS = [
  { id: 'frame-01', name: 'Royal Mughal Jharokha Arch', sub: 'royal-arch', clip: `<path d="M 10 96 V 38 C 10 20, 32 12, 50 4 C 68 12, 90 20, 90 38 V 96 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 10 96 V 38 C 10 20, 32 12, 50 4 C 68 12, 90 20, 90 38 V 96 Z" stroke-width="3"/><path d="M 14 92 V 40 C 14 24, 34 16, 50 9 C 66 16, 86 24, 86 40 V 92 Z" stroke-width="1" stroke-dasharray="3 2"/><circle cx="50" cy="4" r="3" fill="currentColor"/><circle cx="10" cy="38" r="2" fill="currentColor"/><circle cx="90" cy="38" r="2" fill="currentColor"/></g>` },
  { id: 'frame-02', name: 'Udaipur Scalloped Palace Arch', sub: 'royal-arch', clip: `<path d="M 12 95 V 42 Q 12 24 28 18 Q 38 8 50 4 Q 62 8 72 18 Q 88 24 88 42 V 95 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 12 95 V 42 Q 12 24 28 18 Q 38 8 50 4 Q 62 8 72 18 Q 88 24 88 42 V 95 Z" stroke-width="3"/><path d="M 16 91 V 44 Q 16 28 30 22 Q 40 12 50 8 Q 60 12 70 22 Q 84 28 84 44 V 91 Z" stroke-width="1" stroke-dasharray="2 2"/><line x1="8" y1="95" x2="92" y2="95" stroke-width="4"/><polygon points="50,1 53,6 47,6" fill="currentColor"/></g>` },
  { id: 'frame-03', name: 'Sacred Lotus Petal Frame', sub: 'floral', clip: `<path d="M 50 4 C 72 18, 92 38, 86 66 C 80 86, 66 96, 50 96 C 34 96, 20 86, 14 66 C 8 38, 28 18, 50 4 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 50 4 C 72 18, 92 38, 86 66 C 80 86, 66 96, 50 96 C 34 96, 20 86, 14 66 C 8 38, 28 18, 50 4 Z" stroke-width="3"/><path d="M 50 9 C 69 21, 87 39, 82 64 C 77 82, 64 91, 50 91 C 36 91, 23 82, 18 64 C 13 39, 31 21, 50 9 Z" stroke-width="1" stroke-dasharray="3 2"/><circle cx="50" cy="4" r="2.8" fill="currentColor"/><circle cx="50" cy="96" r="2.8" fill="currentColor"/></g>` },
  { id: 'frame-04', name: 'Golden Circle Medallion', sub: 'geometric', clip: `<circle cx="50" cy="50" r="42"/>`, border: `<g stroke="currentColor" fill="none"><circle cx="50" cy="50" r="42" stroke-width="3"/><circle cx="50" cy="50" r="46" stroke-width="1.2" stroke-dasharray="4 3"/><circle cx="50" cy="4" r="2.5" fill="currentColor"/><circle cx="50" cy="96" r="2.5" fill="currentColor"/><circle cx="4" cy="50" r="2.5" fill="currentColor"/><circle cx="96" cy="50" r="2.5" fill="currentColor"/></g>` },
  { id: 'frame-05', name: 'Royal Oval Portrait Cameo', sub: 'classic', clip: `<ellipse cx="50" cy="50" rx="38" ry="45"/>`, border: `<g stroke="currentColor" fill="none"><ellipse cx="50" cy="50" rx="38" ry="45" stroke-width="3"/><ellipse cx="50" cy="50" rx="42" ry="48" stroke-width="1" stroke-dasharray="3 2"/><polygon points="50,1 54,6 50,9 46,6" fill="currentColor"/><polygon points="50,99 54,94 50,91 46,94" fill="currentColor"/><circle cx="10" cy="50" r="2.5" fill="currentColor"/><circle cx="90" cy="50" r="2.5" fill="currentColor"/></g>` },
  { id: 'frame-06', name: 'Diamond Rajwada Frame', sub: 'geometric', clip: `<polygon points="50,6 94,50 50,94 6,50"/>`, border: `<g stroke="currentColor" fill="none"><polygon points="50,6 94,50 50,94 6,50" stroke-width="3"/><polygon points="50,11 89,50 50,89 11,50" stroke-width="1" stroke-dasharray="3 2"/><circle cx="50" cy="4" r="2.8" fill="currentColor"/><circle cx="96" cy="50" r="2.8" fill="currentColor"/><circle cx="50" cy="96" r="2.8" fill="currentColor"/><circle cx="4" cy="50" r="2.8" fill="currentColor"/></g>` },
  { id: 'frame-07', name: 'Octagon Heritage Crest', sub: 'geometric', clip: `<polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30"/>`, border: `<g stroke="currentColor" fill="none"><polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" stroke-width="3"/><polygon points="32,9 68,9 91,32 91,68 68,91 32,91 9,68 9,32" stroke-width="1" stroke-dasharray="4 2"/><circle cx="30" cy="5" r="2" fill="currentColor"/><circle cx="70" cy="5" r="2" fill="currentColor"/><circle cx="95" cy="30" r="2" fill="currentColor"/><circle cx="95" cy="70" r="2" fill="currentColor"/><circle cx="70" cy="95" r="2" fill="currentColor"/><circle cx="30" cy="95" r="2" fill="currentColor"/><circle cx="5" cy="70" r="2" fill="currentColor"/><circle cx="5" cy="30" r="2" fill="currentColor"/></g>` },
  { id: 'frame-08', name: 'Hexagon Honeycomb Mask', sub: 'geometric', clip: `<polygon points="50,4 93,27 93,73 50,96 7,73 7,27"/>`, border: `<g stroke="currentColor" fill="none"><polygon points="50,4 93,27 93,73 50,96 7,73 7,27" stroke-width="3"/><polygon points="50,9 88,29 88,71 50,91 12,71 12,29" stroke-width="1" stroke-dasharray="3 2"/><circle cx="50" cy="4" r="2.5" fill="currentColor"/><circle cx="50" cy="96" r="2.5" fill="currentColor"/></g>` },
  { id: 'frame-09', name: 'Romantic Heart Locket', sub: 'wedding', clip: `<path d="M 50 92 C 18 68, 4 42, 20 22 C 32 8, 46 16, 50 26 C 54 16, 68 8, 80 22 C 96 42, 82 68, 50 92 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 50 92 C 18 68, 4 42, 20 22 C 32 8, 46 16, 50 26 C 54 16, 68 8, 80 22 C 96 42, 82 68, 50 92 Z" stroke-width="3"/><path d="M 50 86 C 23 65, 10 42, 24 25 C 34 14, 46 20, 50 29 C 54 20, 66 14, 76 25 C 90 42, 77 65, 50 86 Z" stroke-width="1" stroke-dasharray="3 2"/><circle cx="50" cy="14" r="3" fill="currentColor"/><circle cx="50" cy="93" r="2.5" fill="currentColor"/></g>` },
  { id: 'frame-10', name: '12-Point Starburst Seal', sub: 'stars', clip: `<polygon points="50,4 61,16 78,10 80,27 95,33 87,49 95,65 80,71 78,88 61,82 50,95 39,82 22,88 20,71 5,65 13,49 5,33 20,27 22,10 39,16"/>`, border: `<g stroke="currentColor" fill="none"><polygon points="50,4 61,16 78,10 80,27 95,33 87,49 95,65 80,71 78,88 61,82 50,95 39,82 22,88 20,71 5,65 13,49 5,33 20,27 22,10 39,16" stroke-width="2.5" stroke-linejoin="round"/><circle cx="50" cy="50" r="34" stroke-width="1" stroke-dasharray="3 2"/></g>` },
  { id: 'frame-11', name: 'Polaroid Vintage Instant', sub: 'stationery', clip: `<rect x="10" y="8" width="80" height="70" rx="3"/>`, border: `<g stroke="currentColor" fill="none"><rect x="4" y="3" width="92" height="94" rx="5" stroke-width="3"/><rect x="10" y="8" width="80" height="70" rx="3" stroke-width="1.5"/><line x1="30" y1="86" x2="70" y2="86" stroke-width="2" stroke-linecap="round"/><circle cx="50" cy="91" r="1.5" fill="currentColor"/></g>` },
  { id: 'frame-12', name: 'Rounded Luxury Card', sub: 'classic', clip: `<rect x="7" y="7" width="86" height="86" rx="18"/>`, border: `<g stroke="currentColor" fill="none"><rect x="7" y="7" width="86" height="86" rx="18" stroke-width="3"/><rect x="11" y="11" width="78" height="78" rx="14" stroke-width="1" stroke-dasharray="4 2"/><circle cx="14" cy="14" r="2" fill="currentColor"/><circle cx="86" cy="14" r="2" fill="currentColor"/><circle cx="14" cy="86" r="2" fill="currentColor"/><circle cx="86" cy="86" r="2" fill="currentColor"/></g>` },
  { id: 'frame-13', name: 'Pill Capsule Vertical', sub: 'classic', clip: `<rect x="16" y="4" width="68" height="92" rx="34"/>`, border: `<g stroke="currentColor" fill="none"><rect x="16" y="4" width="68" height="92" rx="34" stroke-width="3"/><rect x="20" y="8" width="60" height="84" rx="30" stroke-width="1" stroke-dasharray="3 2"/><circle cx="50" cy="4" r="2.5" fill="currentColor"/><circle cx="50" cy="96" r="2.5" fill="currentColor"/></g>` },
  { id: 'frame-14', name: 'Jaipur Temple Dome Arch', sub: 'royal-arch', clip: `<path d="M 8 96 V 48 C 8 28, 22 24, 34 16 C 44 10, 48 4, 50 2 C 52 4, 56 10, 66 16 C 78 24, 92 28, 92 48 V 96 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 8 96 V 48 C 8 28, 22 24, 34 16 C 44 10, 48 4, 50 2 C 52 4, 56 10, 66 16 C 78 24, 92 28, 92 48 V 96 Z" stroke-width="3"/><path d="M 12 92 V 49 C 12 31, 25 27, 36 20 C 45 14, 48 9, 50 6 C 52 9, 55 14, 64 20 C 75 27, 88 31, 88 49 V 92 Z" stroke-width="1" stroke-dasharray="3 2"/><circle cx="50" cy="2" r="2.5" fill="currentColor"/></g>` },
  { id: 'frame-15', name: '4-Leaf Clover Quatrefoil', sub: 'floral', clip: `<path d="M 50 6 A 22 22 0 0 1 72 28 A 22 22 0 0 1 94 50 A 22 22 0 0 1 72 72 A 22 22 0 0 1 50 94 A 22 22 0 0 1 28 72 A 22 22 0 0 1 6 50 A 22 22 0 0 1 28 28 A 22 22 0 0 1 50 6 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 50 6 A 22 22 0 0 1 72 28 A 22 22 0 0 1 94 50 A 22 22 0 0 1 72 72 A 22 22 0 0 1 50 94 A 22 22 0 0 1 28 72 A 22 22 0 0 1 6 50 A 22 22 0 0 1 28 28 A 22 22 0 0 1 50 6 Z" stroke-width="3"/><circle cx="50" cy="6" r="2.2" fill="currentColor"/><circle cx="94" cy="50" r="2.2" fill="currentColor"/><circle cx="50" cy="94" r="2.2" fill="currentColor"/><circle cx="6" cy="50" r="2.2" fill="currentColor"/></g>` },
  { id: 'frame-16', name: 'Moroccan Trellis Tile', sub: 'royal-arch', clip: `<path d="M 50 4 L 68 20 H 86 V 38 L 96 50 L 86 62 V 80 H 68 L 50 96 L 32 80 H 14 V 62 L 4 50 L 14 38 V 20 H 32 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 50 4 L 68 20 H 86 V 38 L 96 50 L 86 62 V 80 H 68 L 50 96 L 32 80 H 14 V 62 L 4 50 L 14 38 V 20 H 32 Z" stroke-width="3" stroke-linejoin="round"/><polygon points="50,10 65,24 81,24 81,40 90,50 81,60 81,76 65,76 50,90 35,76 19,76 19,60 10,50 19,40 19,24 35,24" stroke-width="1" stroke-dasharray="3 2"/></g>` },
  { id: 'frame-17', name: 'Royal Shield Coat of Arms', sub: 'royal', clip: `<path d="M 12 10 H 88 V 48 C 88 72, 68 88, 50 96 C 32 88, 12 72, 12 48 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 12 10 H 88 V 48 C 88 72, 68 88, 50 96 C 32 88, 12 72, 12 48 Z" stroke-width="3"/><path d="M 16 14 H 84 V 47 C 84 68, 66 83, 50 91 C 34 83, 16 68, 16 47 Z" stroke-width="1" stroke-dasharray="4 2"/><polygon points="44,10 47,4 50,8 53,4 56,10" fill="currentColor"/></g>` },
  { id: 'frame-18', name: 'Paisley Kairi Mango Mask', sub: 'floral', clip: `<path d="M 54 8 C 82 8, 92 36, 84 64 C 76 88, 48 96, 26 86 C 8 76, 8 48, 24 32 C 36 20, 44 8, 54 8 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 54 8 C 82 8, 92 36, 84 64 C 76 88, 48 96, 26 86 C 8 76, 8 48, 24 32 C 36 20, 44 8, 54 8 Z" stroke-width="3"/><circle cx="54" cy="8" r="3" fill="currentColor"/><circle cx="44" cy="14" r="2" fill="currentColor"/></g>` },
  { id: 'frame-19', name: 'Teardrop Kundan Gem', sub: 'wedding', clip: `<path d="M 50 5 C 68 28, 88 52, 88 68 A 38 28 0 1 1 12 68 C 12 52, 32 28, 50 5 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 50 5 C 68 28, 88 52, 88 68 A 38 28 0 1 1 12 68 C 12 52, 32 28, 50 5 Z" stroke-width="3"/><path d="M 50 11 C 65 31, 83 52, 83 67 A 33 24 0 1 1 17 67 C 17 52, 35 31, 50 11 Z" stroke-width="1" stroke-dasharray="3 2"/><polygon points="50,1 53,6 47,6" fill="currentColor"/></g>` },
  { id: 'frame-20', name: 'Postage Stamp Perforated', sub: 'stationery', clip: `<rect x="14" y="14" width="72" height="72" rx="2"/>`, border: `<g stroke="currentColor" fill="none"><rect x="8" y="8" width="84" height="84" stroke-width="3.5" stroke-dasharray="3 4"/><rect x="14" y="14" width="72" height="72" rx="2" stroke-width="1.5"/></g>` },
  { id: 'frame-21', name: 'Cut-Corner Chamfer Plaque', sub: 'geometric', clip: `<polygon points="20,6 80,6 94,20 94,80 80,94 20,94 6,80 6,20"/>`, border: `<g stroke="currentColor" fill="none"><polygon points="20,6 80,6 94,20 94,80 80,94 20,94 6,80 6,20" stroke-width="3"/><polygon points="22,10 78,10 90,22 90,78 78,90 22,90 10,78 10,22" stroke-width="1" stroke-dasharray="3 2"/><circle cx="13" cy="13" r="2" fill="currentColor"/><circle cx="87" cy="13" r="2" fill="currentColor"/><circle cx="13" cy="87" r="2" fill="currentColor"/><circle cx="87" cy="87" r="2" fill="currentColor"/></g>` },
  { id: 'frame-22', name: 'Concave Ticket Stub', sub: 'stationery', clip: `<path d="M 18 6 H 82 A 12 12 0 0 0 94 18 V 82 A 12 12 0 0 0 82 94 H 18 A 12 12 0 0 0 6 82 V 18 A 12 12 0 0 0 18 6 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 18 6 H 82 A 12 12 0 0 0 94 18 V 82 A 12 12 0 0 0 82 94 H 18 A 12 12 0 0 0 6 82 V 18 A 12 12 0 0 0 18 6 Z" stroke-width="3"/><rect x="16" y="16" width="68" height="68" rx="4" stroke-width="1" stroke-dasharray="3 2"/></g>` },
  { id: 'frame-23', name: 'Organic Pebble Blob', sub: 'organic', clip: `<path d="M 54 8 C 78 10, 94 26, 92 52 C 90 78, 72 94, 46 92 C 20 90, 6 74, 8 48 C 10 22, 30 6, 54 8 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 54 8 C 78 10, 94 26, 92 52 C 90 78, 72 94, 46 92 C 20 90, 6 74, 8 48 C 10 22, 30 6, 54 8 Z" stroke-width="3"/><path d="M 53 12 C 75 14, 89 28, 88 52 C 86 75, 70 89, 47 88 C 23 86, 11 72, 12 48 C 14 25, 32 10, 53 12 Z" stroke-width="1" stroke-dasharray="4 2"/></g>` },
  { id: 'frame-24', name: '8-Point Surya Mandala Star', sub: 'stars', clip: `<polygon points="50,4 63,24 85,15 76,37 96,50 76,63 85,85 63,76 50,96 37,76 15,85 24,63 4,50 24,37 15,15 37,24"/>`, border: `<g stroke="currentColor" fill="none"><polygon points="50,4 63,24 85,15 76,37 96,50 76,63 85,85 63,76 50,96 37,76 15,85 24,63 4,50 24,37 15,15 37,24" stroke-width="2.6" stroke-linejoin="round"/><circle cx="50" cy="50" r="28" stroke-width="1" stroke-dasharray="3 2"/></g>` },
  { id: 'frame-25', name: 'Pentagon Royal Crest', sub: 'geometric', clip: `<polygon points="50,5 95,38 78,92 22,92 5,38"/>`, border: `<g stroke="currentColor" fill="none"><polygon points="50,5 95,38 78,92 22,92 5,38" stroke-width="3" stroke-linejoin="round"/><polygon points="50,11 89,40 74,87 26,87 11,40" stroke-width="1" stroke-dasharray="3 2"/><circle cx="50" cy="5" r="2.5" fill="currentColor"/></g>` },
  { id: 'frame-26', name: 'Twin Arch Jharokha Window', sub: 'royal-arch', clip: `<path d="M 8 94 V 38 A 20 24 0 0 1 48 38 V 94 Z M 52 94 V 38 A 20 24 0 0 1 92 38 V 94 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 8 94 V 38 A 20 24 0 0 1 48 38 V 94 Z M 52 94 V 38 A 20 24 0 0 1 92 38 V 94 Z" stroke-width="2.8"/><circle cx="28" cy="14" r="2.2" fill="currentColor"/><circle cx="72" cy="14" r="2.2" fill="currentColor"/><line x1="4" y1="94" x2="96" y2="94" stroke-width="3.5"/></g>` },
  { id: 'frame-27', name: 'Diagonal Split Duo Mask', sub: 'geometric', clip: `<path d="M 6 6 H 88 L 6 88 Z M 94 12 V 94 H 12 Z"/>`, border: `<g stroke="currentColor" fill="none"><path d="M 6 6 H 88 L 6 88 Z M 94 12 V 94 H 12 Z" stroke-width="2.8" stroke-linejoin="round"/><circle cx="6" cy="6" r="2.2" fill="currentColor"/><circle cx="94" cy="94" r="2.2" fill="currentColor"/></g>` },
  { id: 'frame-28', name: 'Film Strip Cinema Frame', sub: 'stationery', clip: `<rect x="16" y="8" width="68" height="84" rx="3"/>`, border: `<g stroke="currentColor" stroke-width="2" fill="none"><rect x="6" y="4" width="88" height="92" rx="4"/><rect x="16" y="8" width="68" height="84" rx="3" stroke-width="1.5"/><line x1="11" y1="6" x2="11" y2="94" stroke-dasharray="5 4" stroke-width="3"/><line x1="89" y1="6" x2="89" y2="94" stroke-dasharray="5 4" stroke-width="3"/></g>` },
  { id: 'frame-29', name: 'Smartphone Screen Frame', sub: 'device', clip: `<rect x="20" y="6" width="60" height="88" rx="10"/>`, border: `<g stroke="currentColor" fill="none"><rect x="18" y="4" width="64" height="92" rx="12" stroke-width="2.8"/><line x1="42" y1="8" x2="58" y2="8" stroke-width="2.5" stroke-linecap="round"/><circle cx="50" cy="91" r="2" fill="currentColor"/></g>` },
  { id: 'frame-30', name: 'Sunburst Scallop Medallion', sub: 'stars', clip: `<circle cx="50" cy="50" r="40"/>`, border: `<g stroke="currentColor" fill="none"><circle cx="50" cy="50" r="40" stroke-width="2.5"/><circle cx="50" cy="50" r="45" stroke-width="3" stroke-dasharray="4 3"/><circle cx="50" cy="50" r="48" stroke-width="0.9"/></g>` },
];

const framesManifest = FRAME_SPECS.map((f) => ({
  id: f.id,
  name: f.name,
  category: 'frames',
  subcategory: f.sub,
  clipPathSvg: f.clip,
  borderSvg:
    f.border ||
    `${f.clip.replace('/>', ' fill="none" stroke="currentColor" stroke-width="2.8"/>')}`,
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
  `// AUTO-GENERATED GRAPHICS MANIFEST (360 Bespoke Graphics + 10 Royal Torans = 370 Items)
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
  `Successfully generated ${graphics.length} unique Graphics (including ${existingTorans10.length} Torans), ${framesManifest.length} Frames, and ${gridsManifest.length} Grids.`
);
