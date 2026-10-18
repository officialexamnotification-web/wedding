import fs from 'fs';
import path from 'path';

const PUBLIC_SHAPES_DIR = path.resolve('public/assets/elements/shapes');
const DATA_DIR = path.resolve('src/data/elements');

fs.mkdirSync(PUBLIC_SHAPES_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

// Helper functions for geometric & ornamental SVG construction
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

function scallopCirclePath(cx, cy, baseR, bumps, amp, rotDeg = 0) {
  const steps = bumps * 12;
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

function smoothBlobPath(cx, cy, baseR, lobes, amp1, amp2, phase1, phase2) {
  const steps = 64;
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const r =
      baseR +
      amp1 * Math.sin(lobes * theta + phase1) +
      amp2 * Math.cos((lobes + 1) * theta - phase2) +
      (amp2 * 0.4) * Math.sin((lobes * 2 - 1) * theta + phase1 * 0.5);
    const x = +(cx + r * Math.cos(theta)).toFixed(2);
    const y = +(cy + r * Math.sin(theta)).toFixed(2);
    d += i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
  }
  return d + 'Z';
}

const SUBCATEGORY_SPECS = [
  {
    id: 'lines',
    count: 20,
    label: 'Lines & Dividers',
    names: [
      'Royal Lotus Filigree Rule',
      'Mughal Diamond Center Divider',
      'Zari Scallop Wave Rule',
      'Rajwada Spearhead Line',
      'Double Gold Temple Border',
      'Peacock Feather Crest Rule',
      'Kundan Pearl Beaded Chain',
      'Victorian Scroll Flourish Line',
      'Surya Medallion Center Rule',
      'Mehendi Vine Paisley Divider',
      'Triple Tiered Shahi Rule',
      'infinity Knot Filigree Line',
      'Crescent & Star Royal Rule',
      'Arrowhead Tassel Divider',
      'Chandelier Drop Center Line',
      'Celtic Zari Braid Rule',
      'Rose & Leaf Garland Line',
      'Geometric Art Deco Divider',
      'Palace Jali Lattice Strip',
      'Crown & Scepter Royal Rule',
    ],
  },
  {
    id: 'rectangles',
    count: 18,
    label: 'Rectangles & Cards',
    names: [
      'Filigree Corner Royal Plaque',
      'Chamfered Octagon Gold Card',
      'Concave Scallop Corner Frame',
      'Double Zari Inlay Rectangle',
      'Mughal Arch-Topped Card',
      'Art Deco Stepped Corner Plaque',
      'Royal Ticket Stub Notched Card',
      'Floral Corner Medallion Frame',
      'Beveled Gem Faceted Rectangle',
      'Perforated Shagun Stamp Card',
      'Rajasthani Jharokha Sill Card',
      'Rounded Velvet Cushion Frame',
      'Ornamental Bracketed Card',
      'Diamond Studded Border Plaque',
      'Scroll-Rolled Farman Rectangle',
      'Hexagonal Elongated Cartouche',
      'Triple-Line Heritage Plaque',
      'Palace Gate Pillar Frame',
    ],
  },
  {
    id: 'basic',
    count: 32,
    label: 'Basic & Polygons',
    names: [
      'Royal Sunburst Circle Medallion',
      'Ornate Oval Cameo Brooch',
      'Sacred Yantra Triangle',
      'Tilted Kundan Diamond Rhombus',
      'Rajputana Shield Pentagon',
      'Honeycomb Filigree Hexagon',
      'Saptapadi Heptagon Seal',
      'Mughalashtami Octagon Star',
      'Navratna Nonagon Gem',
      'Dashavatara Decagon Wheel',
      'Dodecagon Zodiac Medallion',
      'Classic Mughal Cusped Arch',
      'Udaipur Scalloped Jharokha Arch',
      'Pointed Islamic Dome Arch',
      'Lotus Petal Ogee Arch',
      'Horseshoe Moorish Royal Arch',
      'Shouldered Haveli Archway',
      'Trefoil Three-Cusp Arch',
      'Cinquefoil Five-Cusp Arch',
      'Stepwell Baori Pyramid Arch',
      'Concentric Chakra Ring',
      'Crescent Chandra Moon',
      'Semicircle Sun Fan',
      'Cross Pattee Royal Emblem',
      'Quatrefoil Four-Leaf Clover',
      'Sexfoil Six-Petal Rosette',
      'Octafoil Eight-Petal Mandala',
      'Keystone Trapezoid Plaque',
      'Parallelogram Zari Banner',
      ' Hourglass Damaru Shape',
      'Teardrop Kundan Pendant',
      'Vesica Piscis Sacred Almond',
    ],
  },
  {
    id: 'arrows',
    count: 28,
    label: 'Directional Arrows',
    names: [
      'Royal Spearhead Right Arrow',
      'Ornate Feather Fletched Arrow',
      'Curved Swooping Pointer Right',
      'Double-Headed Axis Arrow',
      'Chevron Triple Direction Strip',
      'Block Banner Arrow Right',
      'Notched Swallowtail Arrow',
      'Loop-de-Loop Swirl Arrow',
      'U-Turn Return Route Arrow',
      'S-Curve Serpentine Pointer',
      'Circular Clockwise Refresh Arrow',
      'Four-Way Compass Cross Arrows',
      'Bow & Kamdev Floral Arrow',
      'Dotted Treasure Trail Arrow',
      'Upward Growth Stepping Arrow',
      'Corner Bend 90-Degree Arrow',
      'Split Forked Two-Way Arrow',
      'Converging Merge Pointer',
      'Hand-Drawn Calligraphic Arrow',
      'Lightning Bolt Dynamic Arrow',
      'Ribbon Folded 3D Arrow',
      'Target Bullseye Dart Arrow',
      'Ornate Filigree Pointer Left',
      'Royal Mace Gada Finial Arrow',
      'Trident Trishul Tip Arrow',
      'Heart-Tipped Cupid Arrow',
      'Star-Crowned Magic Wand Arrow',
      'Diamond-Shafted Heritage Pointer',
    ],
  },
  {
    id: 'speech-bubbles',
    count: 20,
    label: 'Speech Bubbles',
    names: [
      'Rounded Royal Dialogue Bubble',
      'Ornate Scroll Speech Cartouche',
      'Cloud Thought Dream Bubble',
      'Starburst Shout Exclamation Bubble',
      'Heart-Shaped Love Note Bubble',
      'Double Conversation Chat Pair',
      ' Rectangular Quote Frame Bubble',
      'Scalloped Edge Announcement Bubble',
      'Whisper Dashed Outline Bubble',
      'Banner Header Speech Box',
      'Octagonal Heritage Callout',
      'Pointed Comic Action Burst',
      'Oval Cameo Dialogue Frame',
      'Pill Capsule Chat Tag',
      'Triple-Tail Group Chorus Bubble',
      'Top-Pointer Tooltip Callout',
      'Left-Pointer Side Note Bubble',
      'Right-Pointer Side Note Bubble',
      'Ornate Bracketed Quote Box',
      'Royal Megaphone Callout Bubble',
    ],
  },
  {
    id: 'clouds',
    count: 14,
    label: 'Clouds & Thoughts',
    names: [
      'Cumulus Royal Fluffy Cloud',
      'Chinese Auspicious Ruyi Cloud',
      'Mughal Miniature Painting Cloud',
      'Golden Lining Sunbeam Cloud',
      'Crescent Moon & Star Night Cloud',
      'Dreamy Thought Trail Cloud',
      'Rain-Shower Monsoon Megh Cloud',
      'Lightning Thunder Indradhanush Cloud',
      'Layered Horizon Sunset Clouds',
      'Symmetric Scallop Cloud Plaque',
      'Winged Celestial Cloud Frame',
      'Swirling Wind Breeze Cloud',
      'Double Overlapping Sky Clouds',
      'Starry Heaven Canopy Cloud',
    ],
  },
  {
    id: 'hearts',
    count: 16,
    label: 'Hearts & Romance',
    names: [
      'Classic Velvet Royal Heart',
      'Twin Interlocked Soulmate Hearts',
      'Filigree Lace Ornamental Heart',
      'Arrow-Pierced Cupid Heart',
      'Winged Angelic Love Heart',
      'Crowned Maharani Queen Heart',
      'Padlock Keyhole Forever Heart',
      'Faceted Ruby Gem Heart',
      'Scalloped Doily Border Heart',
      'Ribbon-Wrapped Gift Heart',
      'Infinity Loop Eternal Heart',
      'Floral Vine Blooming Heart',
      'Sparkling Starburst Heart',
      'Hand-Drawn Calligraphic Swirl Heart',
      'Concentric Layered Target Heart',
      'Hamsa Love Palm Heart',
    ],
  },
  {
    id: 'stars',
    count: 22,
    label: 'Stars & Sparkles',
    names: [
      'Four-Point Diamond Sparkle',
      'Five-Point Classic Gold Star',
      'Six-Point Shatkona Sacred Star',
      'Seven-Point Mystic Septagram',
      'Eight-Point Lakshmi Ashtalakshmi Star',
      'Nine-Point Navgraha Star',
      'Ten-Point Dashamaha Star',
      'Twelve-Point Surya Dwadasha Star',
      'Sixteen-Point Shodashi Sunburst',
      'Faceted 3D Beveled Nautical Star',
      'Curved Four-Point Twinkle Cluster',
      'Triple Magic Sparkle Constellation',
      'Shooting Comet Trail Star',
      'Crescent Moon & Star Emblem',
      'Dotted Halo Mandala Star',
      'Floral Petal Center Starburst',
      'Compass Rose Directional Star',
      'Concentric Double-Ring Star',
      'Long-Ray Celestial Bethlehem Star',
      ' Ornate Filigree Tip Star',
      'Atomic Orbiting Sparkle Star',
      'Diamond-Inlaid Rajwada Star',
    ],
  },
  {
    id: 'bursts',
    count: 16,
    label: 'Bursts & Seals',
    names: [
      '24-Point Royal Gold Foil Seal',
      'Scalloped Rosette Wax Stamp',
      'Sunburst Long-Ray Explosion',
      'wavy-Edge Certificate Seal',
      'Double-Ring Serrated Medallion',
      'Firework Sparkler Celebration Burst',
      'Lotus-Edge 16-Petal Seal',
      'Cog-Toothed Heritage Stamp',
      'Star-Cut Diamond Burst',
      'Ribbon-Tailed Award Rosette',
      'Concentric Ripple Wave Burst',
      'Pointed Dahlia Mandala Seal',
      'Octagonal Starburst Shield',
      'Dotted Perimeter Halo Burst',
      'Asymmetric Comic Pow Burst',
      'Imperial Crowned Wax Seal',
    ],
  },
  {
    id: 'banners',
    count: 24,
    label: 'Banners & Ribbons',
    names: [
      'Classic Curved Ribbon Scroll',
      'Arch-Upward Festive Banner',
      'Wave-Flowing S-Curve Ribbon',
      'Double-Fold 3D Swallowtail Banner',
      'Royal Farman Vertical Scroll',
      'Shield & Ribbon Crest Banner',
      'Triple-Tiered Title Ribbon',
      'Pointed Pennant Bunting Flag',
      'Diagonal Corner Sash Ribbon',
      'Laurel Wreath & Ribbon Scroll',
      'Ornate Filigree-Capped Banner',
      'Notched Ticket Label Ribbon',
      'Circular Ring Wrapping Banner',
      'Heart-Center Romantic Ribbon',
      'Crown-Topped Imperial Banner',
      'Hanging Tassel Curtain Banner',
      'Hexagonal Plaque with Side Ribbons',
      'Asymmetric Modern Sweep Banner',
      'Zari Scallop-Trimmed Scroll',
      'Folded Origami Step Ribbon',
      'Double-Ended Fishtail Tag',
      'Docked Pillar Scroll Banner',
      'Star-Studded Gala Marquee Ribbon',
      'Palace Gate Archway Banner',
    ],
  },
  {
    id: 'blobs',
    count: 20,
    label: 'Organic Blobs',
    names: [
      'Smooth Pebble Organic Blob',
      'Three-Lobe Clover Fluid Shape',
      'Four-Lobe Cloud Splash Blob',
      'Five-Lobe Floral Amoeba Blob',
      'Asymmetric Watercolor Wash Blob',
      'Double-Layered Offset Duo Blob',
      'Dotted Outline Accent Blob',
      'Elongated River Stone Blob',
      'Heart-Inflected Soft Blob',
      'Star-Wave Undulating Blob',
      'Crescent Bean Organic Shape',
      'Splatter Ink Drop Blob',
      'Concentric Topographic Ring Blob',
      'Leaf-Biomorphic Botanical Blob',
      'Spiral Shell Nautilus Blob',
      'Twin Connected Droplet Blob',
      'Sparkle-Accented Magic Blob',
      'Framed Line-Art Overlay Blob',
      'Wave-Crested Ocean Foam Blob',
      'Royal Paisley-Curved Blob',
    ],
  },
  {
    id: 'gears',
    count: 14,
    label: 'Gears & Cogs',
    names: [
      'Six-Tooth Classic Chakra Wheel',
      'Eight-Spoke Dharma Chakra Cog',
      'Ten-Tooth Precision Watch Gear',
      'Twelve-Tooth Sun Dial Wheel',
      'Sixteen-Tooth Fine Filigree Gear',
      'Konark Sun Temple Chariot Wheel',
      'Three-Spoke Turbine Rotor Gear',
      'Four-Cross Industrial Sprocket',
      'Double Intermeshing Twin Gears',
      'Star-Center Ornamental Cog',
      'Hex-Nut Core Heavy Gear',
      'Curved-Tooth Sawblade Wheel',
      'Concentric Ring Planetary Gear',
      'Heart-Core Clockwork Romance Gear',
    ],
  },
  {
    id: 'square-stars',
    count: 12,
    label: 'Mandalas & Square Stars',
    names: [
      'Rub el Hizb Eight-Pointed Star',
      'Triple Rotated Square Yantra',
      'Sixteen-Pointed Mughal Star',
      'Rounded-Corner Square Rosette',
      'Nested Concentric Diamond Mandala',
      'Lotus-Inlaid Ashtakona Star',
      'Jali Lattice Geometric Star',
      'Four-Direction Compass Square Star',
      'Scalloped-Inner Square Mandala',
      'Twelve-Pointed Hexagonal Yantra',
      'Dotted Bindu Shree Chakra Star',
      'Palace Floor Inlay Pietra Dura Star',
    ],
  },
  {
    id: 'organic',
    count: 28,
    label: 'Botanical Leaves & Drops',
    names: [
      'Sacred Peepal Bodhi Heart Leaf',
      'Auspicious Mango Amra Leaf',
      'Rajasthani Paisley Kairi Motif',
      'Tropical Monstera Split Leaf',
      'Royal Palm Frond Fan Leaf',
      'Ashoka Long Pendulous Leaf',
      'Lotus Padma Single Petal',
      'Eucalyptus Dollar Silver Branch',
      'Olive Peace Wreath Sprig',
      'Fern Woodland Frond Leaf',
      'Ginkgo Biloba Fan Twin Leaf',
      'Banana Plantain Broad Leaf',
      'Betel Paan Auspicious Leaf',
      'Tulsi Sacred Basil Sprig',
      'Maple Five-Point Autumn Leaf',
      'Oak Lobed Heritage Leaf',
      'Acorn & Oak Botanical Duo',
      'Falling Raindrop Teardrop',
      'Triple Dewdrop Splash Cluster',
      'Peacock Morpankh Eye Feather',
      'Swirling Rosebud Spiral',
      'Wheat Golden Harvest Stalk',
      'Bamboo Jointed Zen Stem',
      'Pomegranate Anar Fruit Motif',
      'Lotus Seed Pod & Stem',
      'Curved Tendril Climbing Vine',
      'Four-Leaf Lucky Shamrock',
      'Blooming Magnolia Branch',
    ],
  },
  {
    id: 'abstract',
    count: 28,
    label: 'Abstract & Architectural',
    names: [
      'Udaipur Palace Jharokha Balcony',
      'Mughal Taj Onion Dome Pavilion',
      'Rajasthani Chhatri Cenotaph',
      'Temple Shikhar Gopuram Tower',
      'Carved Mandap Fluted Pillar',
      'Baori Stepwell Geometric Stairs',
      'Hawa Mahal Honeycomb Facade',
      'Islamic Mihrab Prayer Niche',
      'Torana Buddhist Gateway Arch',
      'Moroccan Zellige Star Tile',
      'Art Deco Sunburst Fan Arch',
      'Bauhaus Geometric Circle & Arch',
      'Infinity Mobius Strip Loop',
      'Impossible Penrose Triangle',
      'Golden Ratio Fibonacci Spiral',
      'Concentric Maze Labyrinth',
      'Origami Crane Geometric Bird',
      'Sacred Merkaba Star Tetrahedron',
      'Flower of Life Overlapping Circles',
      'Metatron Cube Sacred Geometry',
      'Yin Yang Dual Harmony Swirl',
      'Triple Interlocked Borromean Rings',
      'Wave Interference Moire Pattern',
      'Isometric 3D Stacked Cubes',
      'Sun & Moon Eclipse Alignment',
      'Eye of Providence Mystic Rays',
      'Hourglass Sands of Time',
      'Royal Toran Swag Valance',
    ],
  },
];

function generateShapeInner(subId, idx) {
  const n = idx + 1;
  switch (subId) {
    case 'lines': {
      const variants = [
        // 1: Royal Lotus Filigree Rule
        `<g stroke="currentColor" fill="currentColor"><line x1="4" y1="50" x2="36" y2="50" stroke-width="2"/><line x1="64" y1="50" x2="96" y2="50" stroke-width="2"/><path d="M50 34 C45 42 45 48 50 50 C55 48 55 42 50 34 Z" fill-opacity="0.35" stroke-width="1.5"/><path d="M50 50 C42 43 38 45 40 50 C43 52 47 51 50 50 Z" fill-opacity="0.3"/><path d="M50 50 C58 43 62 45 60 50 C57 52 53 51 50 50 Z" fill-opacity="0.3"/><circle cx="50" cy="54" r="2.5"/><circle cx="10" cy="50" r="2.5"/><circle cx="90" cy="50" r="2.5"/></g>`,
        // 2: Mughal Diamond Center Divider
        `<g stroke="currentColor" fill="currentColor"><line x1="6" y1="50" x2="34" y2="50" stroke-width="2.2"/><line x1="66" y1="50" x2="94" y2="50" stroke-width="2.2"/><polygon points="50,38 62,50 50,62 38,50" fill-opacity="0.2" stroke-width="2"/><polygon points="50,43 57,50 50,57 43,50"/><polygon points="34,46 38,50 34,54 30,50"/><polygon points="66,46 70,50 66,54 62,50"/><circle cx="6" cy="50" r="2.5"/><circle cx="94" cy="50" r="2.5"/></g>`,
        // 3: Zari Scallop Wave Rule
        `<g stroke="currentColor" fill="none" stroke-width="2"><path d="M6 48 Q17 36 28 48 T50 48 T72 48 T94 48"/><path d="M6 54 Q17 42 28 54 T50 54 T72 54 T94 54" stroke-width="1" stroke-dasharray="2 2"/><circle cx="17" cy="48" r="2" fill="currentColor"/><circle cx="39" cy="48" r="2" fill="currentColor"/><circle cx="61" cy="48" r="2" fill="currentColor"/><circle cx="83" cy="48" r="2" fill="currentColor"/></g>`,
        // 4: Rajwada Spearhead Line
        `<g stroke="currentColor" fill="currentColor"><line x1="16" y1="50" x2="84" y2="50" stroke-width="2.5"/><polygon points="4,50 16,43 13,50 16,57"/><polygon points="96,50 84,43 87,50 84,57"/><circle cx="50" cy="50" r="5" fill-opacity="0.25" stroke-width="2"/><circle cx="50" cy="50" r="2"/></g>`,
        // 5: Double Gold Temple Border
        `<g stroke="currentColor" fill="currentColor"><line x1="6" y1="44" x2="94" y2="44" stroke-width="2.2"/><line x1="6" y1="56" x2="94" y2="56" stroke-width="2.2"/><path d="M12 44 L18 56 L24 44 L30 56 L36 44 L42 56 L48 44 L54 56 L60 44 L66 56 L72 44 L78 56 L84 44" fill="none" stroke-width="1.3"/></g>`,
        // 6: Peacock Feather Crest Rule
        `<g stroke="currentColor" fill="currentColor"><path d="M6 52 Q26 52 40 46" fill="none" stroke-width="2"/><path d="M94 52 Q74 52 60 46" fill="none" stroke-width="2"/><ellipse cx="50" cy="46" rx="8" ry="12" fill-opacity="0.2" stroke-width="1.8"/><circle cx="50" cy="44" r="4"/><path d="M40 58 Q50 52 60 58" fill="none" stroke-width="1.5"/></g>`,
        // 7: Kundan Pearl Beaded Chain
        `<g stroke="currentColor" fill="currentColor">${Array.from({ length: 11 }, (_, k) => `<circle cx="${10 + k * 8}" cy="50" r="${k === 5 ? 5.5 : k % 2 === 0 ? 3.5 : 2}" fill-opacity="${k % 2 === 0 ? 0.35 : 1}" stroke-width="1.4"/>`).join('')}</g>`,
        // 8: Victorian Scroll Flourish Line
        `<g stroke="currentColor" fill="none" stroke-width="2" stroke-linecap="round"><path d="M8 50 C18 34, 30 34, 36 46 C40 54, 32 58, 28 52"/><path d="M92 50 C82 34, 70 34, 64 46 C60 54, 68 58, 72 52"/><line x1="36" y1="50" x2="64" y2="50"/><polygon points="50,41 55,50 50,59 45,50" fill="currentColor"/></g>`,
        // 9: Surya Medallion Center Rule
        `<g stroke="currentColor" fill="currentColor"><line x1="6" y1="50" x2="35" y2="50" stroke-width="2"/><line x1="65" y1="50" x2="94" y2="50" stroke-width="2"/><polygon points="${starPoints(50, 50, 12, 13, 8)}" fill-opacity="0.28" stroke-width="1.4"/><circle cx="50" cy="50" r="4"/></g>`,
        // 10: Mehendi Vine Paisley Divider
        `<g stroke="currentColor" fill="none" stroke-width="1.8"><path d="M6 50 C20 38, 32 62, 50 50 C68 38, 80 62, 94 50"/><path d="M22 44 C18 36, 26 32, 28 40 Z" fill="currentColor" fill-opacity="0.3"/><path d="M50 44 C46 34, 54 34, 50 44 Z" fill="currentColor"/><path d="M78 56 C74 64, 82 68, 84 60 Z" fill="currentColor" fill-opacity="0.3"/></g>`,
        // 11: Triple Tiered Shahi Rule
        `<g stroke="currentColor" fill="currentColor"><line x1="18" y1="42" x2="82" y2="42" stroke-width="1.4"/><line x1="6" y1="50" x2="94" y2="50" stroke-width="3"/><line x1="18" y1="58" x2="82" y2="58" stroke-width="1.4"/><polygon points="50,36 56,50 50,64 44,50"/></g>`,
        // 12: Infinity Knot Filigree Line
        `<g stroke="currentColor" fill="none" stroke-width="2.2"><line x1="6" y1="50" x2="32" y2="50"/><line x1="68" y1="50" x2="94" y2="50"/><path d="M32 50 C32 38, 46 38, 50 50 C54 62, 68 62, 68 50 C68 38, 54 38, 50 50 C46 62, 32 62, 32 50 Z" fill="currentColor" fill-opacity="0.16"/></g>`,
        // 13: Crescent & Star Royal Rule
        `<g stroke="currentColor" fill="currentColor"><line x1="6" y1="50" x2="36" y2="50" stroke-width="2"/><line x1="64" y1="50" x2="94" y2="50" stroke-width="2"/><path d="M46 38 A12 12 0 1 0 58 58 A9 9 0 1 1 46 38 Z"/><polygon points="${starPoints(55, 45, 5, 6, 2.5)}"/></g>`,
        // 14: Arrowhead Tassel Divider
        `<g stroke="currentColor" fill="currentColor"><line x1="12" y1="46" x2="88" y2="46" stroke-width="2.2"/><polygon points="6,46 14,41 14,51"/><polygon points="94,46 86,41 86,51"/><path d="M30 46 V56 M50 46 V62 M70 46 V56" stroke-width="1.6"/><circle cx="30" cy="58" r="2.5"/><polygon points="50,58 54,64 50,68 46,64"/><circle cx="70" cy="58" r="2.5"/></g>`,
        // 15: Chandelier Drop Center Line
        `<g stroke="currentColor" fill="none" stroke-width="1.8"><line x1="6" y1="42" x2="94" y2="42" stroke-width="2.4"/><path d="M20 42 Q35 58 50 42 Q65 58 80 42"/><line x1="50" y1="42" x2="50" y2="62"/><polygon points="50,60 55,67 50,74 45,67" fill="currentColor"/><circle cx="35" cy="53" r="2.5" fill="currentColor"/><circle cx="65" cy="53" r="2.5" fill="currentColor"/></g>`,
        // 16: Celtic Zari Braid Rule
        `<g stroke="currentColor" fill="none" stroke-width="2"><path d="M6 46 C18 46, 18 54, 30 54 C42 54, 42 46, 54 46 C66 46, 66 54, 78 54 C86 54, 88 48, 94 48"/><path d="M6 54 C18 54, 18 46, 30 46 C42 46, 42 54, 54 54 C66 54, 66 46, 78 46 C86 46, 88 52, 94 52"/></g>`,
        // 17: Rose & Leaf Garland Line
        `<g stroke="currentColor" fill="currentColor"><path d="M6 50 Q28 42 50 50 T94 50" fill="none" stroke-width="2"/><circle cx="50" cy="50" r="7" fill-opacity="0.3" stroke-width="1.8"/><circle cx="50" cy="50" r="3"/><path d="M36 48 C30 42 24 44 28 50 Z" fill-opacity="0.5"/><path d="M64 52 C70 58 76 56 72 50 Z" fill-opacity="0.5"/></g>`,
        // 18: Geometric Art Deco Divider
        `<g stroke="currentColor" fill="none" stroke-width="1.8"><line x1="6" y1="50" x2="30" y2="50"/><line x1="70" y1="50" x2="94" y2="50"/><rect x="36" y="42" width="28" height="16" stroke-width="2"/><polygon points="50,36 62,50 50,64 38,50" fill="currentColor" fill-opacity="0.2"/><line x1="22" y1="45" x2="30" y2="45"/><line x1="22" y1="55" x2="30" y2="55"/><line x1="70" y1="45" x2="78" y2="45"/><line x1="70" y1="55" x2="78" y2="55"/></g>`,
        // 19: Palace Jali Lattice Strip
        `<g stroke="currentColor" fill="currentColor" stroke-width="1.5"><line x1="6" y1="43" x2="94" y2="43"/><line x1="6" y1="57" x2="94" y2="57"/>${[16, 33, 50, 67, 84].map((x) => `<polygon points="${x},43 ${x + 7},50 ${x},57 ${x - 7},50" fill-opacity="0.22"/>`).join('')}</g>`,
        // 20: Crown & Scepter Royal Rule
        `<g stroke="currentColor" fill="currentColor"><line x1="8" y1="56" x2="92" y2="56" stroke-width="2.4"/><path d="M36 52 L39 38 L45 46 L50 34 L55 46 L61 38 L64 52 Z" fill-opacity="0.3" stroke-width="1.8" stroke-linejoin="round"/><circle cx="50" cy="31" r="2"/><circle cx="39" cy="35" r="1.5"/><circle cx="61" cy="35" r="1.5"/><circle cx="8" cy="56" r="3"/><circle cx="92" cy="56" r="3"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'rectangles': {
      const variants = [
        // 1: Filigree Corner Royal Plaque
        `<g stroke="currentColor" fill="currentColor"><rect x="10" y="16" width="80" height="68" rx="6" fill-opacity="0.14" stroke-width="2.5"/><rect x="15" y="21" width="70" height="58" rx="3" fill="none" stroke-width="1"/><path d="M10 28 A12 12 0 0 0 22 16 M90 28 A12 12 0 0 1 78 16 M10 72 A12 12 0 0 1 22 84 M90 72 A12 12 0 0 0 78 84" fill="none" stroke-width="2.2"/></g>`,
        // 2: Chamfered Octagon Gold Card
        `<g stroke="currentColor" fill="currentColor"><polygon points="22,14 78,14 90,26 90,74 78,86 22,86 10,74 10,26" fill-opacity="0.16" stroke-width="2.6"/><polygon points="25,19 75,19 85,29 85,71 75,81 25,81 15,71 15,29" fill="none" stroke-width="1.2" stroke-dasharray="4 2"/></g>`,
        // 3: Concave Scallop Corner Frame
        `<g stroke="currentColor" fill="currentColor"><path d="M22 14 H78 A12 12 0 0 0 90 26 V74 A12 12 0 0 0 78 86 H22 A12 12 0 0 0 10 74 V26 A12 12 0 0 0 22 14 Z" fill-opacity="0.16" stroke-width="2.5"/><rect x="18" y="22" width="64" height="56" fill="none" stroke-width="1"/></g>`,
        // 4: Double Zari Inlay Rectangle
        `<g stroke="currentColor" fill="none"><rect x="8" y="14" width="84" height="72" stroke-width="2.8" fill="currentColor" fill-opacity="0.12"/><rect x="14" y="20" width="72" height="60" stroke-width="1.6"/><circle cx="14" cy="20" r="2.5" fill="currentColor"/><circle cx="86" cy="20" r="2.5" fill="currentColor"/><circle cx="14" cy="80" r="2.5" fill="currentColor"/><circle cx="86" cy="80" r="2.5" fill="currentColor"/></g>`,
        // 5: Mughal Arch-Topped Card
        `<g stroke="currentColor" fill="currentColor"><path d="M12 86 V36 C12 22, 34 18, 50 10 C66 18, 88 22, 88 36 V86 Z" fill-opacity="0.16" stroke-width="2.5"/><path d="M18 81 V38 C18 26, 36 22, 50 16 C64 22, 82 26, 82 38 V81 Z" fill="none" stroke-width="1.2"/></g>`,
        // 6: Art Deco Stepped Corner Plaque
        `<g stroke="currentColor" fill="currentColor"><polygon points="22,14 78,14 78,20 84,20 84,26 90,26 90,74 84,74 84,80 78,80 78,86 22,86 22,80 16,80 16,74 10,74 10,26 16,26 16,20 22,20" fill-opacity="0.16" stroke-width="2.4"/></g>`,
        // 7: Royal Ticket Stub Notched Card
        `<g stroke="currentColor" fill="currentColor"><path d="M10 18 H90 V40 A10 10 0 0 0 90 60 V82 H10 V60 A10 10 0 0 0 10 40 Z" fill-opacity="0.16" stroke-width="2.5"/><line x1="24" y1="18" x2="24" y2="82" stroke-width="1.5" stroke-dasharray="4 3"/><line x1="76" y1="18" x2="76" y2="82" stroke-width="1.5" stroke-dasharray="4 3"/></g>`,
        // 8: Floral Corner Medallion Frame
        `<g stroke="currentColor" fill="currentColor"><rect x="12" y="16" width="76" height="68" rx="4" fill-opacity="0.14" stroke-width="2.2"/><circle cx="12" cy="16" r="5"/><circle cx="88" cy="16" r="5"/><circle cx="12" cy="84" r="5"/><circle cx="88" cy="84" r="5"/><polygon points="50,11 55,16 50,21 45,16"/><polygon points="50,79 55,84 50,89 45,84"/></g>`,
        // 9: Beveled Gem Faceted Rectangle
        `<g stroke="currentColor" fill="currentColor"><polygon points="18,14 82,14 92,24 92,76 82,86 18,86 8,76 8,24" fill-opacity="0.14" stroke-width="2.4"/><rect x="22" y="26" width="56" height="48" fill-opacity="0.18" stroke-width="1.8"/><line x1="18" y1="14" x2="22" y2="26" stroke-width="1.5"/><line x1="82" y1="14" x2="78" y2="26" stroke-width="1.5"/><line x1="92" y1="24" x2="78" y2="26" stroke-width="1.5"/><line x1="8" y1="24" x2="22" y2="26" stroke-width="1.5"/><line x1="18" y1="86" x2="22" y2="74" stroke-width="1.5"/><line x1="82" y1="86" x2="78" y2="74" stroke-width="1.5"/></g>`,
        // 10: Perforated Shagun Stamp Card
        `<g stroke="currentColor" fill="currentColor"><rect x="10" y="14" width="80" height="72" fill-opacity="0.1" stroke-width="3" stroke-dasharray="3 5"/><rect x="18" y="22" width="64" height="56" rx="3" fill-opacity="0.16" stroke-width="2"/></g>`,
        // 11: Rajasthani Jharokha Sill Card
        `<g stroke="currentColor" fill="currentColor"><rect x="14" y="16" width="72" height="62" rx="4" fill-opacity="0.15" stroke-width="2.4"/><path d="M8 78 H92 L86 86 H14 Z" stroke-width="2"/><path d="M22 86 V92 M50 86 V92 M78 86 V92" stroke-width="2.5" stroke-linecap="round"/></g>`,
        // 12: Rounded Velvet Cushion Frame
        `<g stroke="currentColor" fill="currentColor"><rect x="8" y="14" width="84" height="72" rx="22" fill-opacity="0.18" stroke-width="2.8"/><rect x="15" y="21" width="70" height="58" rx="16" fill="none" stroke-width="1.4" stroke-dasharray="6 3"/></g>`,
        // 13: Ornamental Bracketed Card
        `<g stroke="currentColor" fill="currentColor"><path d="M12 24 C12 16, 20 14, 30 14 H44 L50 8 L56 14 H70 C80 14, 88 16, 88 24 V76 C88 84, 80 86, 70 86 H56 L50 92 L44 86 H30 C20 86, 12 84, 12 76 Z" fill-opacity="0.16" stroke-width="2.4"/></g>`,
        // 14: Diamond Studded Border Plaque
        `<g stroke="currentColor" fill="currentColor"><rect x="12" y="16" width="76" height="68" rx="6" fill-opacity="0.15" stroke-width="2.4"/>${[26, 50, 74].map((x) => `<polygon points="${x},12 ${x + 4},16 ${x},20 ${x - 4},16"/><polygon points="${x},80 ${x + 4},84 ${x},88 ${x - 4},84"/>`).join('')}</g>`,
        // 15: Scroll-Rolled Farman Rectangle
        `<g stroke="currentColor" fill="currentColor"><rect x="14" y="16" width="72" height="68" fill-opacity="0.15" stroke-width="2.2"/><rect x="8" y="10" width="84" height="8" rx="4" stroke-width="2.2"/><rect x="8" y="82" width="84" height="8" rx="4" stroke-width="2.2"/></g>`,
        // 16: Hexagonal Elongated Cartouche
        `<g stroke="currentColor" fill="currentColor"><polygon points="24,16 76,16 94,50 76,84 24,84 6,50" fill-opacity="0.17" stroke-width="2.5"/><polygon points="28,22 72,22 87,50 72,78 28,78 13,50" fill="none" stroke-width="1.2"/></g>`,
        // 17: Triple-Line Heritage Plaque
        `<g stroke="currentColor" fill="none"><rect x="6" y="12" width="88" height="76" rx="4" stroke-width="2.5"/><rect x="11" y="17" width="78" height="66" rx="2" stroke-width="1"/><rect x="16" y="22" width="68" height="56" fill="currentColor" fill-opacity="0.14" stroke-width="2"/></g>`,
        // 18: Palace Gate Pillar Frame
        `<g stroke="currentColor" fill="currentColor"><rect x="10" y="12" width="10" height="76" rx="2" stroke-width="2"/><rect x="80" y="12" width="10" height="76" rx="2" stroke-width="2"/><rect x="20" y="18" width="60" height="64" fill-opacity="0.14" stroke-width="2"/><polygon points="15,6 22,12 8,12"/><polygon points="85,6 92,12 78,12"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'basic': {
      const variants = [
        // 1: Sunburst Circle Medallion
        `<g stroke="currentColor" fill="currentColor"><circle cx="50" cy="50" r="40" fill-opacity="0.18" stroke-width="2.6"/><circle cx="50" cy="50" r="33" fill="none" stroke-width="1.3" stroke-dasharray="4 3"/><circle cx="50" cy="50" r="6"/></g>`,
        // 2: Ornate Oval Cameo Brooch
        `<g stroke="currentColor" fill="currentColor"><ellipse cx="50" cy="50" rx="34" ry="44" fill-opacity="0.18" stroke-width="2.6"/><ellipse cx="50" cy="50" rx="28" ry="38" fill="none" stroke-width="1.2"/><circle cx="50" cy="6" r="3"/><circle cx="50" cy="94" r="3"/><circle cx="16" cy="50" r="3"/><circle cx="84" cy="50" r="3"/></g>`,
        // 3: Sacred Yantra Triangle
        `<g stroke="currentColor" fill="currentColor"><polygon points="${polyPoints(50, 56, 3, 42, -90)}" fill-opacity="0.18" stroke-width="2.6" stroke-linejoin="round"/><polygon points="${polyPoints(50, 56, 3, 30, -90)}" fill="none" stroke-width="1.3"/><circle cx="50" cy="56" r="4"/></g>`,
        // 4: Tilted Kundan Diamond Rhombus
        `<g stroke="currentColor" fill="currentColor"><polygon points="50,6 94,50 50,94 6,50" fill-opacity="0.18" stroke-width="2.6"/><polygon points="50,16 84,50 50,84 16,50" fill="none" stroke-width="1.3"/><polygon points="50,38 62,50 50,62 38,50"/></g>`,
        // 5..11: Polygons 5 to 12 sides with inner filigree
        `<g stroke="currentColor" fill="currentColor"><polygon points="${polyPoints(50, 52, 5, 42)}" fill-opacity="0.18" stroke-width="2.6"/><polygon points="${polyPoints(50, 52, 5, 32)}" fill="none" stroke-width="1.2"/></g>`,
        `<g stroke="currentColor" fill="currentColor"><polygon points="${polyPoints(50, 50, 6, 42)}" fill-opacity="0.18" stroke-width="2.6"/><polygon points="${polyPoints(50, 50, 6, 32)}" fill="none" stroke-width="1.2"/><circle cx="50" cy="50" r="5"/></g>`,
        `<g stroke="currentColor" fill="currentColor"><polygon points="${polyPoints(50, 50, 7, 42)}" fill-opacity="0.18" stroke-width="2.5"/><polygon points="${polyPoints(50, 50, 7, 32)}" fill="none" stroke-width="1.2" stroke-dasharray="3 2"/></g>`,
        `<g stroke="currentColor" fill="currentColor"><polygon points="${polyPoints(50, 50, 8, 42, 22.5)}" fill-opacity="0.18" stroke-width="2.6"/><polygon points="${polyPoints(50, 50, 8, 33, 22.5)}" fill="none" stroke-width="1.3"/></g>`,
        `<g stroke="currentColor" fill="currentColor"><polygon points="${polyPoints(50, 50, 9, 42)}" fill-opacity="0.18" stroke-width="2.4"/><circle cx="50" cy="50" r="30" fill="none" stroke-width="1.2"/></g>`,
        `<g stroke="currentColor" fill="currentColor"><polygon points="${polyPoints(50, 50, 10, 42)}" fill-opacity="0.18" stroke-width="2.4"/><polygon points="${polyPoints(50, 50, 10, 32, 18)}" fill="none" stroke-width="1.2"/></g>`,
        `<g stroke="currentColor" fill="currentColor"><polygon points="${polyPoints(50, 50, 12, 42)}" fill-opacity="0.18" stroke-width="2.4"/><circle cx="50" cy="50" r="31" fill="none" stroke-width="1.2" stroke-dasharray="4 2"/></g>`,
        // 12: Classic Mughal Cusped Arch
        `<g stroke="currentColor" fill="currentColor"><path d="M14 90 V42 C14 24, 34 16, 50 6 C66 16, 86 24, 86 42 V90 Z" fill-opacity="0.18" stroke-width="2.6"/><path d="M20 84 V44 C20 29, 36 22, 50 13 C64 22, 80 29, 80 44 V84 Z" fill="none" stroke-width="1.2"/></g>`,
        // 13: Udaipur Scalloped Jharokha Arch
        `<g stroke="currentColor" fill="currentColor"><path d="M12 90 V46 Q12 32 24 28 Q30 16 42 14 Q50 4 58 14 Q70 16 76 28 Q88 32 88 46 V90 Z" fill-opacity="0.18" stroke-width="2.5"/><line x1="8" y1="90" x2="92" y2="90" stroke-width="3.5"/></g>`,
        // 14: Pointed Islamic Dome Arch
        `<g stroke="currentColor" fill="currentColor"><path d="M16 90 V50 C16 26, 42 18, 50 6 C58 18, 84 26, 84 50 V90 Z" fill-opacity="0.18" stroke-width="2.5"/><circle cx="50" cy="4" r="2.5"/></g>`,
        // 15: Lotus Petal Ogee Arch
        `<g stroke="currentColor" fill="currentColor"><path d="M14 90 V54 C14 34, 28 32, 38 22 C46 14, 48 8, 50 4 C52 8, 54 14, 62 22 C72 32, 86 34, 86 54 V90 Z" fill-opacity="0.18" stroke-width="2.5"/></g>`,
        // 16: Horseshoe Moorish Royal Arch
        `<g stroke="currentColor" fill="currentColor"><path d="M22 90 V62 C10 50, 12 12, 50 12 C88 12, 90 50, 78 62 V90 Z" fill-opacity="0.18" stroke-width="2.5"/></g>`,
        // 17: Shouldered Haveli Archway
        `<g stroke="currentColor" fill="currentColor"><path d="M14 90 V38 H26 A24 24 0 0 1 74 38 H86 V90 Z" fill-opacity="0.18" stroke-width="2.5"/></g>`,
        // 18: Trefoil Three-Cusp Arch
        `<g stroke="currentColor" fill="currentColor"><path d="M14 90 V50 A18 18 0 0 1 32 32 A18 18 0 0 1 68 32 A18 18 0 0 1 86 50 V90 Z" fill-opacity="0.18" stroke-width="2.5"/></g>`,
        // 19: Cinquefoil Five-Cusp Arch
        `<g stroke="currentColor" fill="currentColor"><path d="M12 90 V54 A12 12 0 0 1 22 36 A12 12 0 0 1 38 22 A14 14 0 0 1 62 22 A12 12 0 0 1 78 36 A12 12 0 0 1 88 54 V90 Z" fill-opacity="0.18" stroke-width="2.5"/></g>`,
        // 20: Stepwell Baori Pyramid Arch
        `<g stroke="currentColor" fill="currentColor"><polygon points="10,90 10,54 20,54 20,38 30,38 30,24 40,24 40,12 60,12 60,24 70,24 70,38 80,38 80,54 90,54 90,90" fill-opacity="0.18" stroke-width="2.4"/></g>`,
        // 21: Concentric Chakra Ring
        `<g stroke="currentColor" fill="currentColor"><path fill-rule="evenodd" d="M50 8 A42 42 0 1 0 50 92 A42 42 0 1 0 50 8 Z M50 26 A24 24 0 1 1 50 74 A24 24 0 1 1 50 26 Z" fill-opacity="0.22" stroke-width="2"/><circle cx="50" cy="50" r="8"/></g>`,
        // 22: Crescent Chandra Moon
        `<g stroke="currentColor" fill="currentColor"><path d="M62 12 A40 40 0 1 0 86 72 A32 32 0 1 1 62 12 Z" fill-opacity="0.22" stroke-width="2.5"/><polygon points="${starPoints(68, 36, 5, 10, 4)}"/></g>`,
        // 23: Semicircle Sun Fan
        `<g stroke="currentColor" fill="currentColor"><path d="M8 74 A42 42 0 0 1 92 74 Z" fill-opacity="0.18" stroke-width="2.5"/><path d="M20 74 A30 30 0 0 1 80 74" fill="none" stroke-width="1.3" stroke-dasharray="3 2"/><line x1="50" y1="74" x2="50" y2="32" stroke-width="1.4"/><line x1="50" y1="74" x2="22" y2="44" stroke-width="1.4"/><line x1="50" y1="74" x2="78" y2="44" stroke-width="1.4"/></g>`,
        // 24: Cross Pattee Royal Emblem
        `<g stroke="currentColor" fill="currentColor"><path d="M36 10 H64 L56 38 L88 34 V66 L56 62 L64 90 H36 L44 62 L12 66 V34 L44 38 Z" fill-opacity="0.2" stroke-width="2.4" stroke-linejoin="round"/><circle cx="50" cy="50" r="7"/></g>`,
        // 25: Quatrefoil Four-Leaf Clover
        `<g stroke="currentColor" fill="currentColor"><path d="M50 8 A21 21 0 0 1 71 29 A21 21 0 0 1 92 50 A21 21 0 0 1 71 71 A21 21 0 0 1 50 92 A21 21 0 0 1 29 71 A21 21 0 0 1 8 50 A21 21 0 0 1 29 29 A21 21 0 0 1 50 8 Z" fill-opacity="0.18" stroke-width="2.5"/></g>`,
        // 26: Sexfoil Six-Petal Rosette
        `<g stroke="currentColor" fill="currentColor"><path d="${scallopCirclePath(50, 50, 30, 6, 12)}" fill-opacity="0.2" stroke-width="2.4"/><circle cx="50" cy="50" r="10" fill="none" stroke-width="1.5"/></g>`,
        // 27: Octafoil Eight-Petal Mandala
        `<g stroke="currentColor" fill="currentColor"><path d="${scallopCirclePath(50, 50, 30, 8, 12)}" fill-opacity="0.2" stroke-width="2.4"/><polygon points="50,36 64,50 50,64 36,50" fill="none" stroke-width="1.5"/></g>`,
        // 28: Keystone Trapezoid Plaque
        `<g stroke="currentColor" fill="currentColor"><polygon points="22,14 78,14 92,86 8,86" fill-opacity="0.18" stroke-width="2.5"/><polygon points="27,22 73,22 84,78 16,78" fill="none" stroke-width="1.2"/></g>`,
        // 29: Parallelogram Zari Banner
        `<g stroke="currentColor" fill="currentColor"><polygon points="24,20 92,20 76,80 8,80" fill-opacity="0.18" stroke-width="2.5"/><line x1="28" y1="28" x2="84" y2="28" stroke-width="1.2"/><line x1="16" y1="72" x2="72" y2="72" stroke-width="1.2"/></g>`,
        // 30: Hourglass Damaru Shape
        `<g stroke="currentColor" fill="currentColor"><polygon points="18,12 82,12 56,50 82,88 18,88 44,50" fill-opacity="0.2" stroke-width="2.5" stroke-linejoin="round"/><line x1="36" y1="50" x2="64" y2="50" stroke-width="3"/><circle cx="28" cy="58" r="3"/><circle cx="72" cy="58" r="3"/></g>`,
        // 31: Teardrop Kundan Pendant
        `<g stroke="currentColor" fill="currentColor"><path d="M50 8 C68 32, 86 52, 86 68 A36 24 0 1 1 14 68 C14 52, 32 32, 50 8 Z" fill-opacity="0.2" stroke-width="2.5"/><path d="M50 20 C62 38, 76 54, 76 66 A26 17 0 1 1 24 66 C24 54, 38 38, 50 20 Z" fill="none" stroke-width="1.2"/></g>`,
        // 32: Vesica Piscis Sacred Almond
        `<g stroke="currentColor" fill="currentColor"><path d="M50 6 C80 26, 80 74, 50 94 C20 74, 20 26, 50 6 Z" fill-opacity="0.2" stroke-width="2.5"/><circle cx="50" cy="50" r="14" fill="none" stroke-width="1.6"/><circle cx="50" cy="50" r="4"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'arrows': {
      const variants = [
        // 1: Royal Spearhead Right Arrow
        `<g stroke="currentColor" fill="currentColor"><line x1="10" y1="50" x2="72" y2="50" stroke-width="3.5"/><polygon points="94,50 64,34 72,50 64,66" stroke-width="2" stroke-linejoin="round"/><polygon points="10,50 22,42 18,50 22,58"/><circle cx="44" cy="50" r="4"/></g>`,
        // 2: Ornate Feather Fletched Arrow
        `<g stroke="currentColor" fill="currentColor" stroke-width="2"><line x1="14" y1="50" x2="78" y2="50" stroke-width="2.8"/><polygon points="92,50 74,40 78,50 74,60"/><path d="M10 40 L22 50 L10 60 M18 40 L30 50 L18 60 M26 40 L38 50 L26 60" fill="none"/></g>`,
        // 3: Curved Swooping Pointer Right
        `<g stroke="currentColor" fill="currentColor"><path d="M12 74 C18 34, 48 26, 78 44" fill="none" stroke-width="4" stroke-linecap="round"/><polygon points="92,52 70,32 76,45 64,54" stroke-width="1.8" stroke-linejoin="round"/></g>`,
        // 4: Double-Headed Axis Arrow
        `<g stroke="currentColor" fill="currentColor"><line x1="22" y1="50" x2="78" y2="50" stroke-width="3.5"/><polygon points="6,50 26,38 22,50 26,62"/><polygon points="94,50 74,38 78,50 74,62"/><polygon points="50,40 58,50 50,60 42,50"/></g>`,
        // 5: Chevron Triple Direction Strip
        `<g stroke="currentColor" fill="currentColor"><polygon points="12,26 32,26 52,50 32,74 12,74 32,50" fill-opacity="0.18" stroke-width="2.2"/><polygon points="38,26 58,26 78,50 58,74 38,74 58,50" fill-opacity="0.3" stroke-width="2.2"/><polygon points="64,26 80,26 94,50 80,74 64,74 80,50" fill-opacity="0.5" stroke-width="2.2"/></g>`,
        // 6: Block Banner Arrow Right
        `<g stroke="currentColor" fill="currentColor"><polygon points="8,32 62,32 62,18 94,50 62,82 62,68 8,68" fill-opacity="0.2" stroke-width="2.6" stroke-linejoin="round"/><line x1="16" y1="40" x2="58" y2="40" stroke-width="1.3"/><line x1="16" y1="60" x2="58" y2="60" stroke-width="1.3"/></g>`,
        // 7: Notched Swallowtail Arrow
        `<g stroke="currentColor" fill="currentColor"><polygon points="8,30 60,30 60,16 94,50 60,84 60,70 8,70 22,50" fill-opacity="0.22" stroke-width="2.5" stroke-linejoin="round"/></g>`,
        // 8: Loop-de-Loop Swirl Arrow
        `<g stroke="currentColor" fill="none" stroke-width="3" stroke-linecap="round"><path d="M10 64 C32 64, 58 56, 56 36 C54 20, 34 22, 36 40 C38 60, 64 62, 84 48"/><polygon points="94,42 76,42 83,49 82,58" fill="currentColor" stroke-width="1.5"/></g>`,
        // 9: U-Turn Return Route Arrow
        `<g stroke="currentColor" fill="none" stroke-width="4" stroke-linecap="round"><path d="M24 82 V38 A22 22 0 0 1 68 38 V66"/><polygon points="68,84 54,62 68,67 82,62" fill="currentColor" stroke-width="1.8"/></g>`,
        // 10: S-Curve Serpentine Pointer
        `<g stroke="currentColor" fill="none" stroke-width="3.5" stroke-linecap="round"><path d="M12 76 C36 76, 26 24, 50 24 C74 24, 62 68, 82 52"/><polygon points="92,44 74,44 81,52 82,62" fill="currentColor" stroke-width="1.5"/></g>`,
        // 11: Circular Clockwise Refresh Arrow
        `<g stroke="currentColor" fill="none" stroke-width="3.5" stroke-linecap="round"><path d="M78 36 A32 32 0 1 0 82 62"/><polygon points="86,44 86,22 66,34" fill="currentColor" stroke-width="1.8"/></g>`,
        // 12: Four-Way Compass Cross Arrows
        `<g stroke="currentColor" fill="currentColor" stroke-width="1.8"><line x1="50" y1="16" x2="50" y2="84" stroke-width="2.5"/><line x1="16" y1="50" x2="84" y2="50" stroke-width="2.5"/><polygon points="50,6 42,20 58,20"/><polygon points="50,94 42,80 58,80"/><polygon points="6,50 20,42 20,58"/><polygon points="94,50 80,42 80,58"/><circle cx="50" cy="50" r="6"/></g>`,
        // 13: Bow & Kamdev Floral Arrow
        `<g stroke="currentColor" fill="none" stroke-width="2.4"><path d="M32 14 C62 32, 62 68, 32 86"/><line x1="32" y1="14" x2="32" y2="86" stroke-width="1.2"/><line x1="14" y1="50" x2="82" y2="50" stroke-width="2.8"/><polygon points="92,50 76,41 80,50 76,59" fill="currentColor"/></g>`,
        // 14: Dotted Treasure Trail Arrow
        `<g stroke="currentColor" fill="none" stroke-width="3.2" stroke-linecap="round"><path d="M10 74 Q32 24 54 54 T84 32" stroke-dasharray="4 6"/><polygon points="92,22 74,28 83,33 86,42" fill="currentColor" stroke-dasharray="none" stroke-width="1.5"/></g>`,
        // 15: Upward Growth Stepping Arrow
        `<g stroke="currentColor" fill="none" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"><path d="M12 80 H32 V60 H52 V40 H72 V24"/><polygon points="88,14 66,18 74,25 76,36" fill="currentColor" stroke-width="1.5"/></g>`,
        // 16: Corner Bend 90-Degree Arrow
        `<g stroke="currentColor" fill="currentColor"><path d="M18 86 V42 A14 14 0 0 1 32 28 H72" fill="none" stroke-width="6" stroke-linecap="round"/><polygon points="90,28 68,14 72,28 68,42"/></g>`,
        // 17: Split Forked Two-Way Arrow
        `<g stroke="currentColor" fill="none" stroke-width="3.5" stroke-linecap="round"><path d="M12 50 H44 C56 50, 58 28, 76 28"/><path d="M44 50 C56 50, 58 72, 76 72"/><polygon points="90,28 72,18 76,28 72,38" fill="currentColor" stroke-width="1.5"/><polygon points="90,72 72,62 76,72 72,82" fill="currentColor" stroke-width="1.5"/></g>`,
        // 18: Converging Merge Pointer
        `<g stroke="currentColor" fill="none" stroke-width="3.5" stroke-linecap="round"><path d="M14 26 C34 26, 38 50, 56 50 H78"/><path d="M14 74 C34 74, 38 50, 56 50"/><polygon points="92,50 74,38 78,50 74,62" fill="currentColor" stroke-width="1.5"/></g>`,
        // 19: Hand-Drawn Calligraphic Arrow
        `<g stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round"><path d="M10 56 C28 42, 56 44, 84 48"/><path d="M14 62 C32 50, 58 52, 80 52" stroke-width="1.2"/><path d="M68 34 C76 42, 84 46, 90 48 C84 52, 74 58, 66 64"/></g>`,
        // 20: Lightning Bolt Dynamic Arrow
        `<g stroke="currentColor" fill="currentColor"><polygon points="10,64 46,32 42,50 76,26 70,38 92,22 64,62 68,44 36,68 40,50" fill-opacity="0.28" stroke-width="2.2" stroke-linejoin="round"/></g>`,
        // 21: Ribbon Folded 3D Arrow
        `<g stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="10,60 40,30 40,46 10,76" fill-opacity="0.4"/><polygon points="40,30 70,54 70,70 40,46" fill-opacity="0.18"/><polygon points="46,66 76,36 70,26 92,28 88,50 82,42 52,72" fill-opacity="0.3"/></g>`,
        // 22: Target Bullseye Dart Arrow
        `<g stroke="currentColor" fill="none" stroke-width="2.2"><circle cx="38" cy="58" r="24"/><circle cx="38" cy="58" r="14"/><circle cx="38" cy="58" r="5" fill="currentColor"/><line x1="38" y1="58" x2="86" y2="14" stroke-width="3"/><polygon points="86,14 76,14 86,24" fill="currentColor"/></g>`,
        // 23: Ornate Filigree Pointer Left
        `<g stroke="currentColor" fill="currentColor"><line x1="26" y1="50" x2="90" y2="50" stroke-width="3"/><polygon points="6,50 32,36 26,50 32,64" stroke-width="2"/><path d="M46 50 C46 38, 58 38, 58 46 C58 52, 50 52, 50 48" fill="none" stroke-width="1.8"/><path d="M46 50 C46 62, 58 62, 58 54 C58 48, 50 48, 50 52" fill="none" stroke-width="1.8"/></g>`,
        // 24: Royal Mace Gada Finial Arrow
        `<g stroke="currentColor" fill="currentColor"><line x1="10" y1="50" x2="62" y2="50" stroke-width="3.5"/><circle cx="72" cy="50" r="10" fill-opacity="0.28" stroke-width="2.2"/><polygon points="94,50 82,43 82,57"/><circle cx="10" cy="50" r="3.5"/></g>`,
        // 25: Trident Trishul Tip Arrow
        `<g stroke="currentColor" fill="none" stroke-width="2.6" stroke-linecap="round"><line x1="10" y1="50" x2="86" y2="50"/><polygon points="94,50 80,43 83,50 80,57" fill="currentColor" stroke-width="1.5"/><path d="M64 50 C64 34, 76 30, 84 36"/><path d="M64 50 C64 66, 76 70, 84 64"/></g>`,
        // 26: Heart-Tipped Cupid Arrow
        `<g stroke="currentColor" fill="currentColor"><line x1="12" y1="50" x2="72" y2="50" stroke-width="2.8"/><path d="M92 50 C80 36, 66 32, 66 42 C66 47, 72 50, 74 50 C72 50, 66 53, 66 58 C66 68, 80 64, 92 50 Z" fill-opacity="0.35" stroke-width="2"/><path d="M12 40 L22 50 L12 60 M20 40 L30 50 L20 60" fill="none" stroke-width="2"/></g>`,
        // 27: Star-Crowned Magic Wand Arrow
        `<g stroke="currentColor" fill="currentColor"><line x1="12" y1="78" x2="68" y2="34" stroke-width="3" stroke-linecap="round"/><polygon points="${starPoints(76, 26, 5, 16, 7)}" fill-opacity="0.3" stroke-width="2"/><circle cx="24" cy="52" r="2"/><circle cx="46" cy="68" r="2.5"/><circle cx="48" cy="24" r="2"/></g>`,
        // 28: Diamond-Shafted Heritage Pointer
        `<g stroke="currentColor" fill="currentColor"><polygon points="8,50 18,43 28,50 18,57" fill-opacity="0.3" stroke-width="1.8"/><polygon points="28,50 38,43 48,50 38,57" fill-opacity="0.3" stroke-width="1.8"/><polygon points="48,50 58,43 68,50 58,57" fill-opacity="0.3" stroke-width="1.8"/><polygon points="94,50 66,34 72,50 66,66" stroke-width="2"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'speech-bubbles': {
      const variants = [
        // 1: Rounded Royal Dialogue Bubble
        `<g stroke="currentColor" fill="currentColor"><path d="M14 16 H86 A8 8 0 0 1 94 24 V60 A8 8 0 0 1 86 68 H44 L24 88 L28 68 H14 A8 8 0 0 1 6 60 V24 A8 8 0 0 1 14 16 Z" fill-opacity="0.18" stroke-width="2.5" stroke-linejoin="round"/><line x1="22" y1="36" x2="78" y2="36" stroke-width="2" stroke-linecap="round"/><line x1="22" y1="48" x2="62" y2="48" stroke-width="2" stroke-linecap="round"/></g>`,
        // 2: Ornate Scroll Speech Cartouche
        `<g stroke="currentColor" fill="currentColor"><path d="M18 16 H82 C90 16, 92 24, 92 42 C92 60, 90 68, 82 68 H56 L46 86 L42 68 H18 C10 68, 8 60, 8 42 C8 24, 10 16, 18 16 Z" fill-opacity="0.18" stroke-width="2.5"/><rect x="15" y="22" width="70" height="40" rx="4" fill="none" stroke-width="1" stroke-dasharray="3 2"/></g>`,
        // 3: Cloud Thought Dream Bubble
        `<g stroke="currentColor" fill="currentColor"><path d="M26 64 H74 A14 14 0 0 0 82 38 A18 18 0 0 0 50 22 A16 16 0 0 0 22 36 A14 14 0 0 0 26 64 Z" fill-opacity="0.2" stroke-width="2.5"/><circle cx="32" cy="76" r="5" fill-opacity="0.25" stroke-width="2"/><circle cx="22" cy="86" r="3" fill-opacity="0.3" stroke-width="1.8"/></g>`,
        // 4: Starburst Shout Exclamation Bubble
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 48, 14, 44, 30)}" fill-opacity="0.2" stroke-width="2.2" stroke-linejoin="round"/></g>`,
        // 5: Heart-Shaped Love Note Bubble
        `<g stroke="currentColor" fill="currentColor"><path d="M50 82 L36 70 C16 54, 8 36, 20 22 C30 10, 44 16, 50 26 C56 16, 70 10, 80 22 C92 36, 84 54, 64 70 L56 76 L58 90 Z" fill-opacity="0.2" stroke-width="2.5" stroke-linejoin="round"/></g>`,
        // 6: Double Conversation Chat Pair
        `<g stroke="currentColor" fill="currentColor"><path d="M10 16 H64 A6 6 0 0 1 70 22 V48 A6 6 0 0 1 64 54 H30 L16 66 L18 54 H10 A6 6 0 0 1 4 48 V22 A6 6 0 0 1 10 16 Z" fill-opacity="0.22" stroke-width="2.2"/><path d="M36 42 H88 A6 6 0 0 1 94 48 V72 A6 6 0 0 1 88 78 H80 L84 90 L68 78 H36 A6 6 0 0 1 30 72 V48 A6 6 0 0 1 36 42 Z" fill-opacity="0.14" stroke-width="2.2"/></g>`,
        // 7: Rectangular Quote Frame Bubble
        `<g stroke="currentColor" fill="currentColor"><polygon points="8,16 92,16 92,68 64,68 50,88 50,68 8,68" fill-opacity="0.18" stroke-width="2.5" stroke-linejoin="round"/><text x="24" y="48" font-size="28" font-family="serif">“</text><text x="68" y="56" font-size="28" font-family="serif">”</text></g>`,
        // 8: Scalloped Edge Announcement Bubble
        `<g stroke="currentColor" fill="currentColor"><path d="${scallopCirclePath(50, 46, 32, 12, 5)}" fill-opacity="0.18" stroke-width="2.2"/><polygon points="38,74 26,92 48,76" stroke-width="2" stroke-linejoin="round"/></g>`,
        // 9: Whisper Dashed Outline Bubble
        `<g stroke="currentColor" fill="currentColor"><path d="M16 18 H84 A10 10 0 0 1 94 28 V60 A10 10 0 0 1 84 70 H42 L24 88 L28 70 H16 A10 10 0 0 1 6 60 V28 A10 10 0 0 1 16 18 Z" fill-opacity="0.1" stroke-width="2.5" stroke-dasharray="5 4"/></g>`,
        // 10: Banner Header Speech Box
        `<g stroke="currentColor" fill="currentColor"><path d="M10 22 H90 V68 H58 L50 86 L42 68 H10 Z" fill-opacity="0.16" stroke-width="2.4"/><rect x="6" y="14" width="88" height="12" rx="3" fill-opacity="0.4" stroke-width="2"/></g>`,
        // 11: Octagonal Heritage Callout
        `<g stroke="currentColor" fill="currentColor"><polygon points="22,14 78,14 92,28 92,58 78,72 56,72 42,90 44,72 22,72 8,58 8,28" fill-opacity="0.18" stroke-width="2.4" stroke-linejoin="round"/></g>`,
        // 12: Pointed Comic Action Burst
        `<g stroke="currentColor" fill="currentColor"><polygon points="50,8 62,24 84,14 76,34 96,44 78,56 90,76 68,70 58,92 44,72 20,86 28,62 6,54 24,40 12,18 36,26" fill-opacity="0.2" stroke-width="2.2" stroke-linejoin="round"/></g>`,
        // 13: Oval Cameo Dialogue Frame
        `<g stroke="currentColor" fill="currentColor"><path d="M50 14 C76 14, 94 28, 94 46 C94 64, 76 76, 54 76 L38 92 L42 75 C20 73, 6 61, 6 46 C6 28, 24 14, 50 14 Z" fill-opacity="0.18" stroke-width="2.5"/><ellipse cx="50" cy="45" rx="36" ry="24" fill="none" stroke-width="1" stroke-dasharray="3 2"/></g>`,
        // 14: Pill Capsule Chat Tag
        `<g stroke="currentColor" fill="currentColor"><path d="M30 22 H70 A22 22 0 0 1 92 44 A22 22 0 0 1 70 66 H46 L30 84 L32 66 H30 A22 22 0 0 1 8 44 A22 22 0 0 1 30 22 Z" fill-opacity="0.2" stroke-width="2.5"/><circle cx="34" cy="44" r="3.5"/><circle cx="50" cy="44" r="3.5"/><circle cx="66" cy="44" r="3.5"/></g>`,
        // 15: Triple-Tail Group Chorus Bubble
        `<g stroke="currentColor" fill="currentColor"><path d="M12 16 H88 A6 6 0 0 1 94 22 V62 A6 6 0 0 1 88 68 H74 L80 86 L64 68 H54 L50 88 L46 68 H36 L20 86 L26 68 H12 A6 6 0 0 1 6 62 V22 A6 6 0 0 1 12 16 Z" fill-opacity="0.18" stroke-width="2.4" stroke-linejoin="round"/></g>`,
        // 16: Top-Pointer Tooltip Callout
        `<g stroke="currentColor" fill="currentColor"><path d="M50 10 L60 26 H86 A6 6 0 0 1 92 32 V78 A6 6 0 0 1 86 84 H14 A6 6 0 0 1 8 78 V32 A6 6 0 0 1 14 26 H40 Z" fill-opacity="0.18" stroke-width="2.5" stroke-linejoin="round"/></g>`,
        // 17: Left-Pointer Side Note Bubble
        `<g stroke="currentColor" fill="currentColor"><path d="M8 50 L24 38 V20 A6 6 0 0 1 30 14 H86 A6 6 0 0 1 92 20 V80 A6 6 0 0 1 86 86 H30 A6 6 0 0 1 24 80 V62 Z" fill-opacity="0.18" stroke-width="2.5" stroke-linejoin="round"/></g>`,
        // 18: Right-Pointer Side Note Bubble
        `<g stroke="currentColor" fill="currentColor"><path d="M92 50 L76 38 V20 A6 6 0 0 0 70 14 H14 A6 6 0 0 0 8 20 V80 A6 6 0 0 0 14 86 H70 A6 6 0 0 0 76 80 V62 Z" fill-opacity="0.18" stroke-width="2.5" stroke-linejoin="round"/></g>`,
        // 19: Ornate Bracketed Quote Box
        `<g stroke="currentColor" fill="none" stroke-width="2.6"><path d="M28 16 H12 V68 H32 L24 86 L46 68"/><path d="M72 16 H88 V68 H64"/><polygon points="50,10 56,16 50,22 44,16" fill="currentColor"/></g>`,
        // 20: Royal Megaphone Callout Bubble
        `<g stroke="currentColor" fill="currentColor"><path d="M28 20 H84 A8 8 0 0 1 92 28 V64 A8 8 0 0 1 84 72 H28 L8 84 V46 Z" fill-opacity="0.2" stroke-width="2.5" stroke-linejoin="round"/><circle cx="58" cy="46" r="10" fill="none" stroke-width="1.8"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'clouds': {
      const variants = [
        // 1: Cumulus Royal Fluffy Cloud
        `<g stroke="currentColor" fill="currentColor"><path d="M22 72 H78 A16 16 0 0 0 82 40 A22 22 0 0 0 42 26 A18 18 0 0 0 16 44 A14 14 0 0 0 22 72 Z" fill-opacity="0.2" stroke-width="2.6" stroke-linejoin="round"/><path d="M28 64 H72" stroke-width="1.4" stroke-linecap="round"/></g>`,
        // 2: Chinese Auspicious Ruyi Cloud
        `<g stroke="currentColor" fill="currentColor"><path d="M18 62 C8 62, 6 46, 18 44 C16 30, 34 22, 46 32 C56 18, 78 24, 76 42 C90 42, 92 62, 78 62 Z" fill-opacity="0.2" stroke-width="2.5"/><path d="M28 54 C24 48, 32 42, 38 48 C42 52, 36 58, 32 54 M62 52 C58 46, 66 40, 72 46" fill="none" stroke-width="2" stroke-linecap="round"/></g>`,
        // 3: Mughal Miniature Painting Cloud
        `<g stroke="currentColor" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M10 64 Q22 52 34 62 Q50 44 66 62 Q78 52 90 64" fill="currentColor" fill-opacity="0.18"/><path d="M18 46 Q34 28 50 42 Q66 28 82 46"/><circle cx="34" cy="36" r="2.5" fill="currentColor"/><circle cx="66" cy="36" r="2.5" fill="currentColor"/></g>`,
        // 4: Golden Lining Sunbeam Cloud
        `<g stroke="currentColor" fill="currentColor"><path d="M50 10 V22 M26 18 L34 26 M74 18 L66 26 M12 36 L22 40 M88 36 L78 40" stroke-width="2.4" stroke-linecap="round"/><path d="M24 76 H76 A14 14 0 0 0 80 48 A20 20 0 0 0 44 36 A16 16 0 0 0 20 50 A13 13 0 0 0 24 76 Z" fill-opacity="0.22" stroke-width="2.5"/></g>`,
        // 5: Crescent Moon & Star Night Cloud
        `<g stroke="currentColor" fill="currentColor"><path d="M62 12 A20 20 0 1 0 82 42 A15 15 0 1 1 62 12 Z" fill-opacity="0.3" stroke-width="2"/><path d="M18 76 H70 A13 13 0 0 0 74 50 A18 18 0 0 0 42 38 A14 14 0 0 0 18 52 A12 12 0 0 0 18 76 Z" fill-opacity="0.2" stroke-width="2.4"/><polygon points="${starPoints(26, 24, 4, 7, 2.5)}"/></g>`,
        // 6: Dreamy Thought Trail Cloud
        `<g stroke="currentColor" fill="currentColor"><path d="M26 60 H76 A14 14 0 0 0 80 34 A19 19 0 0 0 46 20 A16 16 0 0 0 22 34 A13 13 0 0 0 26 60 Z" fill-opacity="0.2" stroke-width="2.5"/><circle cx="38" cy="72" r="5.5" fill-opacity="0.25" stroke-width="2"/><circle cx="26" cy="82" r="3.8" fill-opacity="0.25" stroke-width="1.8"/><circle cx="16" cy="90" r="2.2"/></g>`,
        // 7: Rain-Shower Monsoon Megh Cloud
        `<g stroke="currentColor" fill="currentColor"><path d="M22 58 H78 A14 14 0 0 0 82 32 A20 20 0 0 0 46 18 A16 16 0 0 0 20 34 A13 13 0 0 0 22 58 Z" fill-opacity="0.22" stroke-width="2.5"/><path d="M30 66 L24 82 M46 66 L40 86 M62 66 L56 82 M76 66 L70 86" stroke-width="2.4" stroke-linecap="round"/></g>`,
        // 8: Lightning Thunder Cloud
        `<g stroke="currentColor" fill="currentColor"><path d="M22 56 H78 A14 14 0 0 0 82 30 A20 20 0 0 0 46 16 A16 16 0 0 0 20 32 A13 13 0 0 0 22 56 Z" fill-opacity="0.22" stroke-width="2.5"/><polygon points="52,56 38,74 50,74 42,92 64,68 52,68" stroke-width="1.8" stroke-linejoin="round"/></g>`,
        // 9: Layered Horizon Sunset Clouds
        `<g stroke="currentColor" fill="currentColor"><path d="M32 52 H86 A11 11 0 0 0 88 30 A16 16 0 0 0 58 20 A13 13 0 0 0 34 32 A10 10 0 0 0 32 52 Z" fill-opacity="0.14" stroke-width="2"/><path d="M14 76 H72 A13 13 0 0 0 76 50 A18 18 0 0 0 42 38 A15 15 0 0 0 18 52 A12 12 0 0 0 14 76 Z" fill-opacity="0.24" stroke-width="2.5"/></g>`,
        // 10: Symmetric Scallop Cloud Plaque
        `<g stroke="currentColor" fill="currentColor"><path d="M24 30 A14 14 0 0 1 50 22 A14 14 0 0 1 76 30 A14 14 0 0 1 86 50 A14 14 0 0 1 76 70 A14 14 0 0 1 50 78 A14 14 0 0 1 24 70 A14 14 0 0 1 14 50 A14 14 0 0 1 24 30 Z" fill-opacity="0.2" stroke-width="2.5"/><ellipse cx="50" cy="50" rx="26" ry="16" fill="none" stroke-width="1.2" stroke-dasharray="3 2"/></g>`,
        // 11: Winged Celestial Cloud Frame
        `<g stroke="currentColor" fill="currentColor"><path d="M26 68 H74 C88 68, 94 52, 82 44 C92 34, 82 22, 68 28 C62 14, 38 14, 32 28 C18 22, 8 34, 18 44 C6 52, 12 68, 26 68 Z" fill-opacity="0.2" stroke-width="2.4"/></g>`,
        // 12: Swirling Wind Breeze Cloud
        `<g stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round"><path d="M18 54 A16 16 0 0 1 42 34 A20 20 0 0 1 78 42 A14 14 0 0 1 76 68 H12"/><path d="M22 76 H68 C76 76, 80 84, 72 86 C66 88, 62 82, 66 78"/><path d="M10 62 H48 C54 62, 56 54, 50 52"/></g>`,
        // 13: Double Overlapping Sky Clouds
        `<g stroke="currentColor" fill="currentColor"><path d="M10 62 H58 A10 10 0 0 0 60 42 A14 14 0 0 0 34 32 A12 12 0 0 0 12 44 A9 9 0 0 0 10 62 Z" fill-opacity="0.2" stroke-width="2.2"/><path d="M40 76 H88 A10 10 0 0 0 90 56 A14 14 0 0 0 64 46 A12 12 0 0 0 42 58 A9 9 0 0 0 40 76 Z" fill-opacity="0.24" stroke-width="2.2"/></g>`,
        // 14: Starry Heaven Canopy Cloud
        `<g stroke="currentColor" fill="currentColor"><path d="M16 56 H84 A12 12 0 0 0 88 32 A18 18 0 0 0 58 20 A20 20 0 0 0 28 24 A14 14 0 0 0 16 56 Z" fill-opacity="0.2" stroke-width="2.4"/><line x1="28" y1="56" x2="28" y2="74" stroke-width="1.5"/><line x1="50" y1="56" x2="50" y2="82" stroke-width="1.5"/><line x1="72" y1="56" x2="72" y2="74" stroke-width="1.5"/><polygon points="${starPoints(28, 78, 4, 6, 2)}"/><polygon points="${starPoints(50, 86, 5, 7, 3)}"/><polygon points="${starPoints(72, 78, 4, 6, 2)}"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'hearts': {
      const variants = [
        // 1: Classic Velvet Royal Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M50 88 C18 64, 6 40, 20 22 C32 8, 46 16, 50 28 C54 16, 68 8, 80 22 C94 40, 82 64, 50 88 Z" fill-opacity="0.24" stroke-width="2.6" stroke-linejoin="round"/><path d="M26 28 C32 20, 40 22, 44 28" fill="none" stroke-width="2" stroke-linecap="round"/></g>`,
        // 2: Twin Interlocked Soulmate Hearts
        `<g stroke="currentColor" fill="currentColor"><path d="M38 78 C14 58, 6 38, 18 24 C26 14, 36 20, 38 28 C40 20, 50 14, 58 24 C70 38, 62 58, 38 78 Z" fill-opacity="0.22" stroke-width="2.3"/><path d="M62 84 C38 64, 30 44, 42 30 C50 20, 60 26, 62 34 C64 26, 74 20, 82 30 C94 44, 86 64, 62 84 Z" fill-opacity="0.22" stroke-width="2.3"/></g>`,
        // 3: Filigree Lace Ornamental Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M50 88 C18 64, 6 40, 20 22 C32 8, 46 16, 50 28 C54 16, 68 8, 80 22 C94 40, 82 64, 50 88 Z" fill-opacity="0.16" stroke-width="2.4"/><path d="M50 78 C24 58, 14 40, 26 26 C34 16, 46 22, 50 32 C54 22, 66 16, 74 26 C86 40, 76 58, 50 78 Z" fill="none" stroke-width="1.3" stroke-dasharray="3 2"/><circle cx="50" cy="52" r="5"/></g>`,
        // 4: Arrow-Pierced Cupid Heart
        `<g stroke="currentColor" fill="currentColor"><line x1="10" y1="78" x2="88" y2="20" stroke-width="2.8"/><polygon points="92,16 76,20 84,24 86,32"/><path d="M50 86 C20 64, 10 40, 22 24 C32 10, 46 18, 50 28 C54 18, 68 10, 78 24 C90 40, 80 64, 50 86 Z" fill-opacity="0.24" stroke-width="2.5"/></g>`,
        // 5: Winged Angelic Love Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M28 42 C14 32, 4 36, 8 46 C12 54, 22 54, 28 52 C16 56, 12 64, 20 68 C26 70, 32 64, 34 60" fill-opacity="0.18" stroke-width="2"/><path d="M72 42 C86 32, 96 36, 92 46 C88 54, 78 54, 72 52 C84 56, 88 64, 80 68 C74 70, 68 64, 66 60" fill-opacity="0.18" stroke-width="2"/><path d="M50 82 C30 64, 22 46, 32 34 C40 24, 48 30, 50 36 C52 30, 60 24, 68 34 C78 46, 70 64, 50 82 Z" fill-opacity="0.28" stroke-width="2.4"/></g>`,
        // 6: Crowned Maharani Queen Heart
        `<g stroke="currentColor" fill="currentColor"><polygon points="32,24 36,10 44,18 50,8 56,18 64,10 68,24" fill-opacity="0.35" stroke-width="2" stroke-linejoin="round"/><path d="M50 90 C20 68, 10 46, 22 30 C32 18, 46 24, 50 34 C54 24, 68 18, 78 30 C90 46, 80 68, 50 90 Z" fill-opacity="0.22" stroke-width="2.5"/></g>`,
        // 7: Padlock Keyhole Forever Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M36 30 V20 A14 14 0 0 1 64 20 V30" fill="none" stroke-width="3.5"/><path d="M50 90 C20 68, 10 46, 22 32 C32 20, 46 26, 50 36 C54 26, 68 20, 78 32 C90 46, 80 68, 50 90 Z" fill-opacity="0.22" stroke-width="2.5"/><circle cx="50" cy="52" r="5"/><polygon points="48,54 52,54 54,68 46,68"/></g>`,
        // 8: Faceted Ruby Gem Heart
        `<g stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="50,26 68,14 86,28 84,52 50,88 16,52 14,28 32,14" fill-opacity="0.2"/><polygon points="50,36 64,26 72,38 50,70 28,38 36,26" fill="none"/><line x1="50" y1="26" x2="50" y2="36"/><line x1="86" y1="28" x2="72" y2="38"/><line x1="14" y1="28" x2="28" y2="38"/><line x1="50" y1="70" x2="50" y2="88"/></g>`,
        // 9: Scalloped Doily Border Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M50 90 C16 66, 4 40, 18 20 C30 6, 46 14, 50 26 C54 14, 70 6, 82 20 C96 40, 84 66, 50 90 Z" fill="none" stroke-width="3" stroke-dasharray="2 5" stroke-linecap="round"/><path d="M50 82 C22 62, 12 40, 24 26 C34 14, 46 20, 50 30 C54 20, 66 14, 76 26 C88 40, 78 62, 50 82 Z" fill-opacity="0.24" stroke-width="2"/></g>`,
        // 10: Ribbon-Wrapped Gift Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M50 88 C18 64, 6 40, 20 22 C32 8, 46 16, 50 28 C54 16, 68 8, 80 22 C94 40, 82 64, 50 88 Z" fill-opacity="0.18" stroke-width="2.5"/><path d="M14 44 H86 M50 28 V88" stroke-width="4"/><path d="M50 44 C38 32, 34 40, 50 44 C66 40, 62 32, 50 44 Z" stroke-width="2.2"/></g>`,
        // 11: Infinity Loop Eternal Heart
        `<g stroke="currentColor" fill="none" stroke-width="2.6"><path d="M50 86 C18 62, 8 38, 22 22 C32 10, 46 18, 50 28 C54 18, 68 10, 78 22 C92 38, 82 62, 50 86 Z" fill="currentColor" fill-opacity="0.16"/><path d="M22 52 C22 38, 42 38, 50 52 C58 66, 78 66, 78 52 C78 38, 58 38, 50 52 C42 66, 22 66, 22 52 Z"/></g>`,
        // 12: Floral Vine Blooming Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M50 88 C18 64, 6 40, 20 22 C32 8, 46 16, 50 28 C54 16, 68 8, 80 22 C94 40, 82 64, 50 88 Z" fill-opacity="0.16" stroke-width="2.2"/><circle cx="24" cy="28" r="5"/><circle cx="76" cy="28" r="5"/><circle cx="50" cy="84" r="4"/><path d="M36 52 C44 44, 56 44, 64 52 C56 60, 44 60, 36 52 Z" fill-opacity="0.4"/></g>`,
        // 13: Sparkling Starburst Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M50 86 C20 64, 10 40, 22 24 C32 10, 46 18, 50 28 C54 18, 68 10, 78 24 C90 40, 80 64, 50 86 Z" fill-opacity="0.22" stroke-width="2.5"/><polygon points="${starPoints(50, 50, 4, 14, 4)}"/><polygon points="${starPoints(20, 14, 4, 6, 2)}"/><polygon points="${starPoints(82, 16, 4, 6, 2)}"/></g>`,
        // 14: Hand-Drawn Calligraphic Swirl Heart
        `<g stroke="currentColor" fill="none" stroke-width="2.6" stroke-linecap="round"><path d="M50 32 C44 16, 24 12, 16 28 C8 46, 26 68, 50 86 C74 68, 92 46, 84 28 C76 12, 56 16, 46 36 C40 48, 52 56, 58 46"/></g>`,
        // 15: Concentric Layered Target Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M50 90 C16 64, 4 38, 18 20 C30 6, 46 14, 50 26 C54 14, 70 6, 82 20 C96 38, 84 64, 50 90 Z" fill-opacity="0.14" stroke-width="2.4"/><path d="M50 76 C26 56, 18 38, 28 26 C36 16, 46 22, 50 30 C54 22, 64 16, 72 26 C82 38, 74 56, 50 76 Z" fill-opacity="0.22" stroke-width="2"/><path d="M50 62 C36 50, 32 40, 38 32 C42 26, 48 30, 50 34 C52 30, 58 26, 62 32 C68 40, 64 50, 50 62 Z" fill-opacity="0.4" stroke-width="1.6"/></g>`,
        // 16: Hamsa Love Palm Heart
        `<g stroke="currentColor" fill="currentColor"><path d="M50 88 C18 64, 6 40, 20 22 C32 8, 46 16, 50 28 C54 16, 68 8, 80 22 C94 40, 82 64, 50 88 Z" fill-opacity="0.2" stroke-width="2.5"/><path d="M32 50 Q50 36 68 50 Q50 64 32 50 Z" fill="none" stroke-width="2"/><circle cx="50" cy="50" r="5"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'stars': {
      const variants = [
        // 1: Four-Point Diamond Sparkle
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 4, 44, 12)}" fill-opacity="0.24" stroke-width="2.4"/><circle cx="50" cy="50" r="4"/></g>`,
        // 2: Five-Point Classic Gold Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 52, 5, 44, 18)}" fill-opacity="0.24" stroke-width="2.4" stroke-linejoin="round"/><polygon points="${starPoints(50, 52, 5, 24, 10)}" fill="none" stroke-width="1.2"/></g>`,
        // 3: Six-Point Shatkona Sacred Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${polyPoints(50, 50, 3, 42, -90)}" fill-opacity="0.16" stroke-width="2.4"/><polygon points="${polyPoints(50, 50, 3, 42, 90)}" fill-opacity="0.16" stroke-width="2.4"/><circle cx="50" cy="50" r="6"/></g>`,
        // 4: Seven-Point Mystic Septagram
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 7, 44, 20)}" fill-opacity="0.22" stroke-width="2.2"/><circle cx="50" cy="50" r="10" fill="none" stroke-width="1.5"/></g>`,
        // 5: Eight-Point Ashtalakshmi Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 8, 44, 20)}" fill-opacity="0.24" stroke-width="2.2"/><circle cx="50" cy="50" r="12" fill="none" stroke-width="1.5"/><circle cx="50" cy="50" r="4"/></g>`,
        // 6: Nine-Point Navgraha Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 9, 44, 22)}" fill-opacity="0.22" stroke-width="2"/><polygon points="${starPoints(50, 50, 9, 26, 12, -70)}" fill="none" stroke-width="1.2"/></g>`,
        // 7: Ten-Point Dashamaha Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 10, 44, 22)}" fill-opacity="0.22" stroke-width="2"/><circle cx="50" cy="50" r="8"/></g>`,
        // 8: Twelve-Point Surya Dwadasha Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 12, 44, 24)}" fill-opacity="0.22" stroke-width="2"/><circle cx="50" cy="50" r="14" fill="none" stroke-width="1.6" stroke-dasharray="3 2"/></g>`,
        // 9: Sixteen-Point Shodashi Sunburst
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 16, 44, 26)}" fill-opacity="0.22" stroke-width="1.8"/><circle cx="50" cy="50" r="10"/></g>`,
        // 10: Faceted 3D Beveled Nautical Star
        `<g stroke="currentColor" fill="currentColor" stroke-width="1.8"><polygon points="${starPoints(50, 50, 5, 44, 18)}" fill-opacity="0.2"/><line x1="50" y1="6" x2="50" y2="50"/><line x1="92" y1="36" x2="50" y2="50"/><line x1="76" y1="86" x2="50" y2="50"/><line x1="24" y1="86" x2="50" y2="50"/><line x1="8" y1="36" x2="50" y2="50"/></g>`,
        // 11: Curved Four-Point Twinkle Cluster
        `<g stroke="currentColor" fill="currentColor"><path d="M50 6 Q50 50 94 50 Q50 50 50 94 Q50 50 6 50 Q50 50 50 6 Z" fill-opacity="0.28" stroke-width="2.2"/><circle cx="22" cy="22" r="3"/><circle cx="78" cy="22" r="3"/><circle cx="22" cy="78" r="3"/><circle cx="78" cy="78" r="3"/></g>`,
        // 12: Triple Magic Sparkle Constellation
        `<g stroke="currentColor" fill="currentColor"><path d="M36 12 Q36 42 66 42 Q36 42 36 72 Q36 42 6 42 Q36 42 36 12 Z" fill-opacity="0.26" stroke-width="2.2"/><path d="M74 10 Q74 26 90 26 Q74 26 74 42 Q74 26 58 26 Q74 26 74 10 Z" fill-opacity="0.3" stroke-width="1.8"/><path d="M70 54 Q70 72 88 72 Q70 72 70 90 Q70 72 52 72 Q70 72 70 54 Z" fill-opacity="0.3" stroke-width="1.8"/></g>`,
        // 13: Shooting Comet Trail Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(70, 32, 5, 22, 9)}" fill-opacity="0.28" stroke-width="2.2"/><path d="M54 44 Q28 56 8 82 M60 52 Q38 66 18 88 M46 36 Q24 46 8 66" fill="none" stroke-width="2.2" stroke-linecap="round"/></g>`,
        // 14: Crescent Moon & Star Emblem
        `<g stroke="currentColor" fill="currentColor"><path d="M56 10 A38 38 0 1 0 84 72 A30 30 0 1 1 56 10 Z" fill-opacity="0.22" stroke-width="2.4"/><polygon points="${starPoints(66, 38, 5, 16, 6.5)}" fill-opacity="0.35" stroke-width="2"/></g>`,
        // 15: Dotted Halo Mandala Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 8, 36, 16)}" fill-opacity="0.24" stroke-width="2"/><circle cx="50" cy="50" r="43" fill="none" stroke-width="2" stroke-dasharray="2 5" stroke-linecap="round"/></g>`,
        // 16: Floral Petal Center Starburst
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 12, 44, 18)}" fill-opacity="0.18" stroke-width="1.8"/><path d="${scallopCirclePath(50, 50, 14, 6, 5)}" fill-opacity="0.4" stroke-width="1.8"/></g>`,
        // 17: Compass Rose Directional Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 4, 44, 10, -45)}" fill-opacity="0.18" stroke-width="1.8"/><polygon points="${starPoints(50, 50, 4, 46, 11, -90)}" fill-opacity="0.3" stroke-width="2.2"/><circle cx="50" cy="50" r="6"/></g>`,
        // 18: Concentric Double-Ring Star
        `<g stroke="currentColor" fill="currentColor"><circle cx="50" cy="50" r="42" fill="none" stroke-width="2"/><polygon points="${starPoints(50, 50, 6, 40, 18)}" fill-opacity="0.24" stroke-width="2"/><circle cx="50" cy="50" r="18" fill="none" stroke-width="1.6"/></g>`,
        // 19: Long-Ray Celestial Bethlehem Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="50,2 56,42 94,50 56,58 50,98 44,58 6,50 44,42" fill-opacity="0.28" stroke-width="2.2"/><polygon points="22,22 45,45 50,50 45,55 22,78 45,50" fill="none" stroke-width="1.5"/><line x1="22" y1="22" x2="78" y2="78" stroke-width="2"/><line x1="78" y1="22" x2="22" y2="78" stroke-width="2"/></g>`,
        // 20: Ornate Filigree Tip Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 6, 36, 16)}" fill-opacity="0.22" stroke-width="2.2"/>${Array.from({ length: 6 }, (_, k) => { const [x, y] = polar(50, 50, 41, -90 + k * 60); return `<circle cx="${x}" cy="${y}" r="3.5"/>`; }).join('')}</g>`,
        // 21: Atomic Orbiting Sparkle Star
        `<g stroke="currentColor" fill="none" stroke-width="1.8"><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(30 50 50)"/><ellipse cx="50" cy="50" rx="42" ry="16" transform="rotate(-30 50 50)"/><polygon points="${starPoints(50, 50, 4, 18, 6)}" fill="currentColor"/></g>`,
        // 22: Diamond-Inlaid Rajwada Star
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 8, 44, 24)}" fill-opacity="0.2" stroke-width="2.2"/><polygon points="50,28 72,50 50,72 28,50" fill="none" stroke-width="1.8"/><polygon points="50,38 62,50 50,62 38,50"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'bursts': {
      const variants = [
        // 1: 24-Point Royal Gold Foil Seal
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 24, 45, 38)}" fill-opacity="0.22" stroke-width="2"/><circle cx="50" cy="50" r="32" fill="none" stroke-width="1.5" stroke-dasharray="3 2"/></g>`,
        // 2: Scalloped Rosette Wax Stamp
        `<g stroke="currentColor" fill="currentColor"><path d="${scallopCirclePath(50, 50, 37, 16, 6)}" fill-opacity="0.22" stroke-width="2.2"/><circle cx="50" cy="50" r="30" fill="none" stroke-width="2"/></g>`,
        // 3: Sunburst Long-Ray Explosion
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 18, 46, 18)}" fill-opacity="0.24" stroke-width="1.8"/><circle cx="50" cy="50" r="14"/></g>`,
        // 4: Wavy-Edge Certificate Seal
        `<g stroke="currentColor" fill="currentColor"><path d="${scallopCirclePath(50, 50, 39, 24, 4)}" fill-opacity="0.2" stroke-width="2"/><circle cx="50" cy="50" r="34" fill="none" stroke-width="1.2"/><circle cx="50" cy="50" r="28" fill="none" stroke-width="1.2" stroke-dasharray="4 2"/></g>`,
        // 5: Double-Ring Serrated Medallion
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 30, 45, 40)}" fill-opacity="0.2" stroke-width="1.8"/><polygon points="${starPoints(50, 50, 16, 30, 24)}" fill="none" stroke-width="1.5"/></g>`,
        // 6: Firework Sparkler Celebration Burst
        `<g stroke="currentColor" fill="none" stroke-width="2.2" stroke-linecap="round">${Array.from({ length: 16 }, (_, k) => { const [x1, y1] = polar(50, 50, 12, k * 22.5); const [x2, y2] = polar(50, 50, k % 2 === 0 ? 44 : 32, k * 22.5); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><circle cx="${x2}" cy="${y2}" r="2" fill="currentColor"/>`; }).join('')}</g>`,
        // 7: Lotus-Edge 16-Petal Seal
        `<g stroke="currentColor" fill="currentColor"><path d="${scallopCirclePath(50, 50, 34, 12, 9)}" fill-opacity="0.22" stroke-width="2.2"/><circle cx="50" cy="50" r="24" fill="none" stroke-width="1.5"/><polygon points="${starPoints(50, 50, 8, 16, 7)}"/></g>`,
        // 8: Cog-Toothed Heritage Stamp
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 20, 44, 36)}" fill-opacity="0.2" stroke-width="2.2" stroke-linejoin="bevel"/><circle cx="50" cy="50" r="28" fill="none" stroke-width="2"/></g>`,
        // 9: Star-Cut Diamond Burst
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 12, 46, 26)}" fill-opacity="0.2" stroke-width="2"/><polygon points="${starPoints(50, 50, 12, 34, 18, 15)}" fill-opacity="0.2" stroke-width="1.4"/></g>`,
        // 10: Ribbon-Tailed Award Rosette
        `<g stroke="currentColor" fill="currentColor"><polygon points="36,64 24,94 36,88 44,96 48,68" fill-opacity="0.3" stroke-width="2"/><polygon points="64,64 76,94 64,88 56,96 52,68" fill-opacity="0.3" stroke-width="2"/><path d="${scallopCirclePath(50, 42, 28, 16, 5)}" fill-opacity="0.24" stroke-width="2.2"/><circle cx="50" cy="42" r="20" fill="none" stroke-width="1.5"/></g>`,
        // 11: Concentric Ripple Wave Burst
        `<g stroke="currentColor" fill="none" stroke-width="2"><path d="${scallopCirclePath(50, 50, 40, 14, 4)}" fill="currentColor" fill-opacity="0.15"/><path d="${scallopCirclePath(50, 50, 28, 14, 3)}"/><path d="${scallopCirclePath(50, 50, 16, 14, 2)}" fill="currentColor" fill-opacity="0.3"/></g>`,
        // 12: Pointed Dahlia Mandala Seal
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 16, 45, 32)}" fill-opacity="0.18" stroke-width="2"/><polygon points="${starPoints(50, 50, 16, 35, 22, 11.25)}" fill-opacity="0.22" stroke-width="1.6"/><circle cx="50" cy="50" r="12"/></g>`,
        // 13: Octagonal Starburst Shield
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 8, 45, 35)}" fill-opacity="0.2" stroke-width="2.4"/><polygon points="${polyPoints(50, 50, 8, 30, 22.5)}" fill="none" stroke-width="1.5"/></g>`,
        // 14: Dotted Perimeter Halo Burst
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 20, 38, 28)}" fill-opacity="0.24" stroke-width="2"/><circle cx="50" cy="50" r="45" fill="none" stroke-width="2.5" stroke-dasharray="1 6" stroke-linecap="round"/></g>`,
        // 15: Asymmetric Comic Pow Burst
        `<g stroke="currentColor" fill="currentColor"><polygon points="50,6 62,24 84,12 74,34 96,42 76,54 92,76 68,68 60,94 46,72 22,88 30,62 6,58 26,42 12,20 38,26" fill-opacity="0.24" stroke-width="2.2" stroke-linejoin="round"/></g>`,
        // 16: Imperial Crowned Wax Seal
        `<g stroke="currentColor" fill="currentColor"><path d="${scallopCirclePath(50, 54, 34, 18, 4)}" fill-opacity="0.22" stroke-width="2.2"/><polygon points="34,22 38,8 46,16 50,6 54,16 62,8 66,22" fill-opacity="0.4" stroke-width="2" stroke-linejoin="round"/><circle cx="50" cy="54" r="24" fill="none" stroke-width="1.4" stroke-dasharray="3 2"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'banners': {
      const variants = [
        // 1: Classic Curved Ribbon Scroll
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2" stroke-linejoin="round"><polygon points="6,42 22,42 18,54 22,66 6,66 14,54" fill-opacity="0.35"/><polygon points="94,42 78,42 82,54 78,66 94,66 86,54" fill-opacity="0.35"/><path d="M18 32 Q50 22 82 32 V58 Q50 48 18 58 Z" fill-opacity="0.2"/></g>`,
        // 2: Arch-Upward Festive Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><path d="M8 62 Q50 26 92 62 L84 78 Q50 44 16 78 Z" fill-opacity="0.22"/><path d="M14 66 Q50 34 86 66" fill="none" stroke-width="1.2" stroke-dasharray="4 2"/></g>`,
        // 3: Wave-Flowing S-Curve Ribbon
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><path d="M6 38 C28 20, 42 54, 64 38 C76 28, 86 32, 94 38 L88 62 C78 56, 68 52, 58 62 C36 78, 22 44, 12 62 Z" fill-opacity="0.22"/></g>`,
        // 4: Double-Fold 3D Swallowtail Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2" stroke-linejoin="round"><polygon points="4,46 24,46 24,70 4,70 14,58" fill-opacity="0.35"/><polygon points="96,46 76,46 76,70 96,70 86,58" fill-opacity="0.35"/><rect x="18" y="30" width="64" height="32" rx="3" fill-opacity="0.2"/><line x1="18" y1="62" x2="24" y2="70"/><line x1="82" y1="62" x2="76" y2="70"/></g>`,
        // 5: Royal Farman Vertical Scroll
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><rect x="22" y="16" width="56" height="68" fill-opacity="0.18"/><rect x="14" y="10" width="72" height="8" rx="4" fill-opacity="0.4"/><rect x="14" y="82" width="72" height="8" rx="4" fill-opacity="0.4"/><circle cx="14" cy="14" r="2"/><circle cx="86" cy="14" r="2"/><circle cx="14" cy="86" r="2"/><circle cx="86" cy="86" r="2"/></g>`,
        // 6: Shield & Ribbon Crest Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><path d="M26 14 H74 V44 C74 64, 50 76, 50 76 C50 76, 26 64, 26 44 Z" fill-opacity="0.2"/><path d="M10 68 Q50 82 90 68 L84 84 Q50 96 16 84 Z" fill-opacity="0.32"/></g>`,
        // 7: Triple-Tiered Title Ribbon
        `<g stroke="currentColor" fill="currentColor" stroke-width="2"><polygon points="14,18 86,18 80,34 20,34" fill-opacity="0.2"/><polygon points="8,42 92,42 86,58 14,58" fill-opacity="0.28"/><polygon points="18,66 82,66 76,82 24,82" fill-opacity="0.2"/></g>`,
        // 8: Pointed Pennant Bunting Flag
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.4" stroke-linejoin="round"><line x1="12" y1="14" x2="88" y2="14" stroke-width="3"/><polygon points="20,14 80,14 80,62 50,88 20,62" fill-opacity="0.22"/><polygon points="28,20 72,20 72,58 50,78 28,58" fill="none" stroke-width="1.2" stroke-dasharray="3 2"/></g>`,
        // 9: Diagonal Corner Sash Ribbon
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><polygon points="10,64 64,10 90,10 10,90" fill-opacity="0.24"/><line x1="10" y1="72" x2="72" y2="10" stroke-width="1.2" stroke-dasharray="4 2"/></g>`,
        // 10: Laurel Wreath & Ribbon Scroll
        `<g stroke="currentColor" fill="currentColor" stroke-width="2"><path d="M26 64 C12 48, 16 22, 38 14 M74 64 C88 48, 84 22, 62 14" fill="none" stroke-width="2.5"/><rect x="12" y="62" width="76" height="20" rx="4" fill-opacity="0.25"/></g>`,
        // 11: Ornate Filigree-Capped Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><rect x="16" y="32" width="68" height="36" rx="4" fill-opacity="0.2"/><polygon points="6,50 16,36 16,64" fill-opacity="0.4"/><polygon points="94,50 84,36 84,64" fill-opacity="0.4"/><path d="M36 32 Q50 18 64 32 M36 68 Q50 82 64 68" fill="none"/></g>`,
        // 12: Notched Ticket Label Ribbon
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.4"><polygon points="8,28 92,28 80,50 92,72 8,72 20,50" fill-opacity="0.2" stroke-linejoin="round"/><line x1="24" y1="35" x2="76" y2="35" stroke-width="1.2"/><line x1="24" y1="65" x2="76" y2="65" stroke-width="1.2"/></g>`,
        // 13: Circular Ring Wrapping Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><circle cx="50" cy="50" r="34" fill="none" stroke-width="2.5"/><path d="M6 40 H94 L88 60 H12 Z" fill-opacity="0.28"/></g>`,
        // 14: Heart-Center Romantic Ribbon
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><polygon points="6,42 36,42 36,62 6,62 14,52" fill-opacity="0.24"/><polygon points="94,42 64,42 64,62 94,62 86,52" fill-opacity="0.24"/><path d="M50 76 C30 58, 24 40, 34 28 C40 20, 48 26, 50 32 C52 26, 60 20, 66 28 C76 40, 70 58, 50 76 Z" fill-opacity="0.3"/></g>`,
        // 15: Crown-Topped Imperial Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><polygon points="32,34 36,16 45,26 50,12 55,26 64,16 68,34" fill-opacity="0.35" stroke-linejoin="round"/><path d="M10 38 H90 L82 54 L90 70 H10 L18 54 Z" fill-opacity="0.22"/></g>`,
        // 16: Hanging Tassel Curtain Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><rect x="10" y="20" width="80" height="36" rx="4" fill-opacity="0.2"/><path d="M10 56 Q20 68 30 56 Q40 68 50 56 Q60 68 70 56 Q80 68 90 56" fill="none"/><circle cx="20" cy="70" r="2.5"/><circle cx="40" cy="70" r="2.5"/><circle cx="60" cy="70" r="2.5"/><circle cx="80" cy="70" r="2.5"/></g>`,
        // 17: Hexagonal Plaque with Side Ribbons
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><polygon points="6,44 24,44 24,64 6,64 14,54" fill-opacity="0.3"/><polygon points="94,44 76,44 76,64 94,64 86,54" fill-opacity="0.3"/><polygon points="28,26 72,26 84,50 72,74 28,74 16,50" fill-opacity="0.2"/></g>`,
        // 18: Asymmetric Modern Sweep Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><path d="M8 34 L92 24 L82 66 L14 74 Z" fill-opacity="0.22"/><line x1="16" y1="42" x2="82" y2="34" stroke-width="1.3"/></g>`,
        // 19: Zari Scallop-Trimmed Scroll
        `<g stroke="currentColor" fill="currentColor" stroke-width="2"><rect x="12" y="30" width="76" height="40" rx="4" fill-opacity="0.2"/><path d="M12 30 Q20 22 28 30 T44 30 T60 30 T76 30 T88 30" fill="none"/><path d="M12 70 Q20 78 28 70 T44 70 T60 70 T76 70 T88 70" fill="none"/></g>`,
        // 20: Folded Origami Step Ribbon
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2" stroke-linejoin="round"><polygon points="6,56 28,56 28,36 6,36 14,46" fill-opacity="0.28"/><polygon points="28,36 72,36 72,64 28,64" fill-opacity="0.18"/><polygon points="72,44 94,44 86,54 94,64 72,64" fill-opacity="0.28"/></g>`,
        // 21: Double-Ended Fishtail Tag
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.4"><polygon points="18,26 82,26 94,50 82,74 18,74 6,50" fill-opacity="0.2"/><circle cx="20" cy="50" r="3.5"/><circle cx="80" cy="50" r="3.5"/></g>`,
        // 22: Docked Pillar Scroll Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><rect x="10" y="20" width="8" height="60" rx="4" fill-opacity="0.4"/><rect x="82" y="20" width="8" height="60" rx="4" fill-opacity="0.4"/><rect x="18" y="28" width="64" height="44" fill-opacity="0.18"/><line x1="26" y1="36" x2="74" y2="36" stroke-width="1.2"/><line x1="26" y1="64" x2="74" y2="64" stroke-width="1.2"/></g>`,
        // 23: Star-Studded Gala Marquee Ribbon
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><path d="M8 30 H92 L84 50 L92 70 H8 L16 50 Z" fill-opacity="0.2"/><polygon points="${starPoints(28, 50, 5, 7, 3)}"/><polygon points="${starPoints(50, 50, 5, 9, 4)}"/><polygon points="${starPoints(72, 50, 5, 7, 3)}"/></g>`,
        // 24: Palace Gate Archway Banner
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><path d="M8 68 V38 C8 22, 32 14, 50 14 C68 14, 92 22, 92 38 V68 L78 58 C78 42, 64 34, 50 34 C36 34, 22 42, 22 58 Z" fill-opacity="0.22"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'blobs': {
      const lobes = 3 + (idx % 6);
      const amp1 = 5 + (idx % 4) * 2.2;
      const amp2 = 3 + ((idx * 3) % 5) * 1.4;
      const p1 = idx * 1.1;
      const p2 = idx * 0.7;
      const mainD = smoothBlobPath(50, 50, 32, lobes, amp1, amp2, p1, p2);
      const innerD = smoothBlobPath(50, 50, 22, lobes, amp1 * 0.6, amp2 * 0.6, p1 + 0.5, p2);
      if (idx % 3 === 0) {
        return `<g stroke="currentColor" fill="currentColor"><path d="${mainD}" fill-opacity="0.22" stroke-width="2.4"/><path d="${innerD}" fill="none" stroke-width="1.2" stroke-dasharray="4 3"/></g>`;
      }
      if (idx % 3 === 1) {
        return `<g stroke="currentColor" fill="currentColor"><path d="${mainD}" fill-opacity="0.18" stroke-width="2.4"/><path d="${innerD}" fill-opacity="0.25" stroke-width="1.5"/><circle cx="78" cy="22" r="3.5"/><circle cx="20" cy="78" r="2.5"/></g>`;
      }
      return `<g stroke="currentColor" fill="currentColor"><path d="${mainD}" fill-opacity="0.24" stroke-width="2.2"/><g transform="translate(4,-3)"><path d="${mainD}" fill="none" stroke-width="1.2" stroke-dasharray="3 2"/></g></g>`;
    }

    case 'gears': {
      const variants = [
        // 1..14 distinct gear & wheel designs
        ...Array.from({ length: 14 }, (_, k) => {
          const teeth = 6 + k * 2;
          const outerR = 43;
          const rootR = 34 - (k % 3) * 2;
          const holeR = 10 + (k % 4) * 3;
          const pts = [];
          const step = (Math.PI * 2) / (teeth * 2);
          for (let i = 0; i < teeth * 2; i++) {
            const a1 = i * step;
            const a2 = a1 + step * 0.48;
            const r = i % 2 === 0 ? outerR : rootR;
            pts.push(`${(50 + r * Math.cos(a1)).toFixed(1)},${(50 + r * Math.sin(a1)).toFixed(1)}`);
            pts.push(`${(50 + r * Math.cos(a2)).toFixed(1)},${(50 + r * Math.sin(a2)).toFixed(1)}`);
          }
          const spokes = 4 + (k % 5) * 2;
          const spokeLines = Array.from({ length: spokes }, (__, s) => {
            const [x1, y1] = polar(50, 50, holeR, (s * 360) / spokes);
            const [x2, y2] = polar(50, 50, rootR - 4, (s * 360) / spokes);
            return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="currentColor" stroke-width="2"/>`;
          }).join('');
          return `<g stroke="currentColor" fill="currentColor"><path fill-rule="evenodd" d="M ${pts.join(' L ')} Z M ${50 + (rootR - 4)} 50 A ${rootR - 4} ${rootR - 4} 0 1 0 ${50 - (rootR - 4)} 50 A ${rootR - 4} ${rootR - 4} 0 1 0 ${50 + (rootR - 4)} 50 Z" fill-opacity="0.24" stroke-width="1.8"/>${spokeLines}<circle cx="50" cy="50" r="${holeR}" fill="none" stroke-width="2.2"/><circle cx="50" cy="50" r="3.5"/></g>`;
        }),
      ];
      return variants[idx % variants.length];
    }

    case 'square-stars': {
      const layers = 2 + (idx % 4);
      const rx = (idx % 3) * 3;
      let rects = '';
      for (let l = 0; l < layers; l++) {
        const rot = (l * 90) / layers + idx * 7.5;
        const size = 60 - (idx % 2) * 4;
        const off = (100 - size) / 2;
        rects += `<rect x="${off}" y="${off}" width="${size}" height="${size}" rx="${rx}" transform="rotate(${rot.toFixed(1)} 50 50)" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="2"/>`;
      }
      const centerPetal = `<polygon points="${starPoints(50, 50, 8, 18, 8, idx * 15)}" fill="currentColor" fill-opacity="0.3" stroke="currentColor" stroke-width="1.5"/>`;
      return `<g>${rects}${centerPetal}<circle cx="50" cy="50" r="4" fill="currentColor"/></g>`;
    }

    case 'organic': {
      const variants = [
        // 1: Sacred Peepal Bodhi Heart Leaf
        `<g stroke="currentColor" fill="currentColor"><path d="M50 6 C54 20, 88 34, 84 62 C80 82, 62 86, 50 76 C38 86, 20 82, 16 62 C12 34, 46 20, 50 6 Z" fill-opacity="0.2" stroke-width="2.4"/><path d="M50 12 V94 M50 40 L72 30 M50 54 L76 44 M50 66 L70 58 M50 40 L28 30 M50 54 L24 44 M50 66 L30 58" fill="none" stroke-width="1.6" stroke-linecap="round"/></g>`,
        // 2: Auspicious Mango Amra Leaf
        `<g stroke="currentColor" fill="currentColor"><path d="M50 8 C72 24, 74 62, 50 92 C26 62, 28 24, 50 8 Z" fill-opacity="0.22" stroke-width="2.4"/><path d="M50 8 V92 M50 28 L64 20 M50 44 L66 34 M50 60 L64 50 M50 74 L60 66 M50 28 L36 20 M50 44 L34 34 M50 60 L36 50 M50 74 L40 66" fill="none" stroke-width="1.5"/></g>`,
        // 3: Rajasthani Paisley Kairi Motif
        `<g stroke="currentColor" fill="currentColor"><path d="M56 10 C82 10, 90 38, 80 64 C70 88, 42 94, 24 80 C10 68, 12 44, 28 32 C40 22, 46 10, 56 10 Z" fill-opacity="0.2" stroke-width="2.5"/><path d="M54 20 C72 20, 78 40, 70 60 C62 78, 42 82, 30 72 C20 62, 22 46, 34 36" fill="none" stroke-width="1.4" stroke-dasharray="3 2"/><circle cx="48" cy="56" r="6"/></g>`,
        // 4: Tropical Monstera Split Leaf
        `<g stroke="currentColor" fill="currentColor"><path d="M50 10 C78 16, 90 44, 78 72 C68 88, 56 92, 50 92 C44 92, 32 88, 22 72 C10 44, 22 16, 50 10 Z" fill-opacity="0.22" stroke-width="2.4"/><path d="M50 12 V92 M22 36 H42 M78 36 H58 M18 54 H40 M82 54 H60 M26 72 H42 M74 72 H58" stroke-width="2.5" stroke-linecap="round"/></g>`,
        // 5: Royal Palm Frond Fan Leaf
        `<g stroke="currentColor" fill="none" stroke-width="2.2" stroke-linecap="round"><line x1="50" y1="92" x2="50" y2="12"/><path d="M50 24 Q28 18 16 28 M50 36 Q22 30 10 42 M50 48 Q20 44 10 58 M50 60 Q24 58 16 72 M50 72 Q30 70 24 82"/><path d="M50 24 Q72 18 84 28 M50 36 Q78 30 90 42 M50 48 Q80 44 90 58 M50 60 Q76 58 84 72 M50 72 Q70 70 76 82"/></g>`,
        // 6: Ashoka Long Pendulous Leaf
        `<g stroke="currentColor" fill="currentColor"><path d="M50 6 C64 26, 62 66, 50 94 C38 66, 36 26, 50 6 Z" fill-opacity="0.22" stroke-width="2.2"/><line x1="50" y1="6" x2="50" y2="94" stroke-width="1.8"/></g>`,
        // 7: Lotus Padma Single Petal
        `<g stroke="currentColor" fill="currentColor"><path d="M50 8 C78 32, 84 68, 50 90 C16 68, 22 32, 50 8 Z" fill-opacity="0.22" stroke-width="2.5"/><path d="M50 14 V88 M50 88 C36 66, 36 38, 50 14 C64 38, 64 66, 50 88 Z" fill="none" stroke-width="1.3"/></g>`,
        // 8: Eucalyptus Dollar Silver Branch
        `<g stroke="currentColor" fill="currentColor" stroke-width="2"><path d="M24 90 Q46 50 72 12" fill="none" stroke-width="2.4"/><circle cx="72" cy="14" r="8" fill-opacity="0.24"/><circle cx="48" cy="28" r="10" fill-opacity="0.24"/><circle cx="68" cy="40" r="10" fill-opacity="0.24"/><circle cx="34" cy="52" r="11" fill-opacity="0.24"/><circle cx="56" cy="64" r="11" fill-opacity="0.24"/><circle cx="24" cy="76" r="10" fill-opacity="0.24"/></g>`,
        // 9: Olive Peace Wreath Sprig
        `<g stroke="currentColor" fill="currentColor" stroke-width="1.8"><path d="M26 86 C10 62, 14 28, 42 14 M74 86 C90 62, 86 28, 58 14" fill="none" stroke-width="2.4"/><ellipse cx="18" cy="62" rx="8" ry="4" transform="rotate(-30 18 62)" fill-opacity="0.3"/><ellipse cx="18" cy="42" rx="8" ry="4" transform="rotate(-15 18 42)" fill-opacity="0.3"/><ellipse cx="28" cy="24" rx="8" ry="4" transform="rotate(15 28 24)" fill-opacity="0.3"/><ellipse cx="82" cy="62" rx="8" ry="4" transform="rotate(30 82 62)" fill-opacity="0.3"/><ellipse cx="82" cy="42" rx="8" ry="4" transform="rotate(15 82 42)" fill-opacity="0.3"/><ellipse cx="72" cy="24" rx="8" ry="4" transform="rotate(-15 72 24)" fill-opacity="0.3"/></g>`,
        // 10: Fern Woodland Frond Leaf
        `<g stroke="currentColor" fill="currentColor"><path d="M50 92 V10" stroke-width="2.4"/><ellipse cx="36" cy="72" rx="14" ry="5" transform="rotate(-20 36 72)" fill-opacity="0.25"/><ellipse cx="64" cy="72" rx="14" ry="5" transform="rotate(20 64 72)" fill-opacity="0.25"/><ellipse cx="36" cy="54" rx="13" ry="4.5" transform="rotate(-20 36 54)" fill-opacity="0.25"/><ellipse cx="64" cy="54" rx="13" ry="4.5" transform="rotate(20 64 54)" fill-opacity="0.25"/><ellipse cx="38" cy="36" rx="11" ry="4" transform="rotate(-20 38 36)" fill-opacity="0.25"/><ellipse cx="62" cy="36" rx="11" ry="4" transform="rotate(20 62 36)" fill-opacity="0.25"/><ellipse cx="42" cy="20" rx="8" ry="3.5" transform="rotate(-20 42 20)" fill-opacity="0.25"/><ellipse cx="58" cy="20" rx="8" ry="3.5" transform="rotate(20 58 20)" fill-opacity="0.25"/></g>`,
        // 11: Ginkgo Biloba Fan Twin Leaf
        `<g stroke="currentColor" fill="currentColor"><path d="M50 92 V56 M50 60 C24 52, 8 34, 18 18 C28 10, 44 18, 50 32 C56 18, 72 10, 82 18 C92 34, 76 52, 50 60 Z" fill-opacity="0.22" stroke-width="2.4"/></g>`,
        // 12: Banana Plantain Broad Leaf
        `<g stroke="currentColor" fill="currentColor"><path d="M18 86 C16 44, 44 14, 84 12 C82 52, 54 84, 18 86 Z" fill-opacity="0.22" stroke-width="2.4"/><line x1="14" y1="90" x2="84" y2="12" stroke-width="2.2"/><line x1="36" y1="66" x2="22" y2="52" stroke-width="1.5"/><line x1="52" y1="48" x2="36" y2="32" stroke-width="1.5"/><line x1="68" y1="30" x2="54" y2="18" stroke-width="1.5"/></g>`,
        // 13: Betel Paan Auspicious Leaf
        `<g stroke="currentColor" fill="currentColor"><path d="M50 8 C70 28, 92 48, 80 72 C70 88, 54 82, 50 74 C46 82, 30 88, 20 72 C8 48, 30 28, 50 8 Z" fill-opacity="0.24" stroke-width="2.4"/><line x1="50" y1="8" x2="50" y2="94" stroke-width="2.4"/></g>`,
        // 14: Tulsi Sacred Basil Sprig
        `<g stroke="currentColor" fill="currentColor"><line x1="50" y1="92" x2="50" y2="18" stroke-width="2.4"/><ellipse cx="50" cy="16" rx="6" ry="10" fill-opacity="0.3"/><ellipse cx="32" cy="40" rx="14" ry="7" transform="rotate(-25 32 40)" fill-opacity="0.24"/><ellipse cx="68" cy="40" rx="14" ry="7" transform="rotate(25 68 40)" fill-opacity="0.24"/><ellipse cx="30" cy="66" rx="16" ry="8" transform="rotate(-25 30 66)" fill-opacity="0.24"/><ellipse cx="70" cy="66" rx="16" ry="8" transform="rotate(25 70 66)" fill-opacity="0.24"/></g>`,
        // 15: Maple Five-Point Autumn Leaf
        `<g stroke="currentColor" fill="currentColor"><polygon points="50,8 58,28 76,20 68,40 90,44 72,58 78,72 56,68 50,92 44,68 22,72 28,58 10,44 32,40 24,20 42,28" fill-opacity="0.22" stroke-width="2.2" stroke-linejoin="round"/></g>`,
        // 16: Oak Lobed Heritage Leaf
        `<g stroke="currentColor" fill="currentColor"><path d="M50 92 V76 C34 76, 26 66, 36 58 C20 56, 18 40, 34 38 C24 28, 32 14, 46 20 C50 8, 50 8, 54 20 C68 14, 76 28, 66 38 C82 40, 80 56, 64 58 C74 66, 66 76, 50 76" fill-opacity="0.22" stroke-width="2.2"/><line x1="50" y1="18" x2="50" y2="92" stroke-width="2"/></g>`,
        // 17: Acorn & Oak Botanical Duo
        `<g stroke="currentColor" fill="currentColor"><path d="M28 42 H72 C74 68, 62 84, 50 90 C38 84, 26 68, 28 42 Z" fill-opacity="0.22" stroke-width="2.4"/><path d="M22 42 C22 24, 78 24, 78 42 Z" fill-opacity="0.4" stroke-width="2.4"/><path d="M50 26 V12" stroke-width="3" stroke-linecap="round"/></g>`,
        // 18: Falling Raindrop Teardrop
        `<g stroke="currentColor" fill="currentColor"><path d="M50 8 C66 32, 84 52, 84 68 A34 24 0 1 1 16 68 C16 52, 34 32, 50 8 Z" fill-opacity="0.22" stroke-width="2.5"/><path d="M32 62 C30 72, 38 80, 48 80" fill="none" stroke-width="2.2" stroke-linecap="round"/></g>`,
        // 19: Triple Dewdrop Splash Cluster
        `<g stroke="currentColor" fill="currentColor"><path d="M50 22 C62 42, 72 56, 72 68 A22 18 0 1 1 28 68 C28 56, 38 42, 50 22 Z" fill-opacity="0.22" stroke-width="2.2"/><path d="M22 14 C28 24, 32 30, 32 36 A10 8 0 1 1 12 36 C12 30, 16 24, 22 14 Z" fill-opacity="0.3" stroke-width="1.8"/><path d="M78 18 C84 28, 88 34, 88 40 A10 8 0 1 1 68 40 C68 34, 72 28, 78 18 Z" fill-opacity="0.3" stroke-width="1.8"/></g>`,
        // 20: Peacock Morpankh Eye Feather
        `<g stroke="currentColor" fill="currentColor"><path d="M50 92 V18" stroke-width="2.2"/><ellipse cx="50" cy="38" rx="26" ry="30" fill-opacity="0.16" stroke-width="2" stroke-dasharray="4 2"/><ellipse cx="50" cy="36" rx="16" ry="20" fill-opacity="0.24" stroke-width="2"/><circle cx="50" cy="34" r="8"/></g>`,
        // 21: Swirling Rosebud Spiral
        `<g stroke="currentColor" fill="currentColor"><path d="M50 72 V94 M36 84 L50 78 L64 84" fill="none" stroke-width="2.2"/><path d="M50 14 C72 14, 82 32, 74 52 C66 68, 34 68, 26 52 C18 32, 28 14, 50 14 Z" fill-opacity="0.22" stroke-width="2.4"/><path d="M36 32 C46 22, 58 24, 62 34 C66 44, 52 52, 42 44 C36 38, 42 30, 50 34" fill="none" stroke-width="2"/></g>`,
        // 22: Wheat Golden Harvest Stalk
        `<g stroke="currentColor" fill="currentColor" stroke-width="1.8"><line x1="50" y1="94" x2="50" y2="10" stroke-width="2.2"/>${[26, 40, 54, 68, 80].map((y) => `<ellipse cx="40" cy="${y}" rx="9" ry="4" transform="rotate(-35 40 ${y})" fill-opacity="0.3"/><ellipse cx="60" cy="${y}" rx="9" ry="4" transform="rotate(35 60 ${y})" fill-opacity="0.3"/>`).join('')}</g>`,
        // 23: Bamboo Jointed Zen Stem
        `<g stroke="currentColor" fill="currentColor"><rect x="44" y="10" width="12" height="24" rx="2" fill-opacity="0.22" stroke-width="2"/><rect x="44" y="38" width="12" height="24" rx="2" fill-opacity="0.22" stroke-width="2"/><rect x="44" y="66" width="12" height="24" rx="2" fill-opacity="0.22" stroke-width="2"/><path d="M56 36 C70 28, 84 28, 88 36 C76 42, 64 40, 56 36 Z" fill-opacity="0.3"/><path d="M44 64 C30 56, 16 56, 12 64 C24 70, 36 68, 44 64 Z" fill-opacity="0.3"/></g>`,
        // 24: Pomegranate Anar Fruit Motif
        `<g stroke="currentColor" fill="currentColor"><polygon points="40,22 44,10 50,18 56,10 60,22" fill-opacity="0.35" stroke-width="2"/><circle cx="50" cy="56" r="32" fill-opacity="0.2" stroke-width="2.4"/><circle cx="42" cy="50" r="3"/><circle cx="50" cy="46" r="3"/><circle cx="58" cy="50" r="3"/><circle cx="45" cy="60" r="3"/><circle cx="55" cy="60" r="3"/></g>`,
        // 25: Lotus Seed Pod & Stem
        `<g stroke="currentColor" fill="currentColor"><path d="M50 56 V92" stroke-width="2.5"/><ellipse cx="50" cy="32" rx="28" ry="12" fill-opacity="0.3" stroke-width="2.2"/><path d="M22 32 L36 58 H64 L78 32" fill-opacity="0.18" stroke-width="2.2"/><circle cx="40" cy="32" r="2.5"/><circle cx="50" cy="30" r="2.5"/><circle cx="60" cy="32" r="2.5"/><circle cx="46" cy="36" r="2.5"/><circle cx="54" cy="36" r="2.5"/></g>`,
        // 26: Curved Tendril Climbing Vine
        `<g stroke="currentColor" fill="none" stroke-width="2.4" stroke-linecap="round"><path d="M20 88 C24 58, 48 64, 52 44 C56 24, 74 28, 78 12"/><path d="M38 62 C24 58, 20 42, 32 38 C40 36, 42 46, 34 48"/><path d="M58 38 C72 42, 78 56, 66 60 C58 62, 56 52, 64 50"/></g>`,
        // 27: Four-Leaf Lucky Shamrock
        `<g stroke="currentColor" fill="currentColor"><path d="M50 46 C36 26, 22 14, 36 10 C46 8, 50 18, 50 26 C50 18, 54 8, 64 10 C78 14, 64 26, 50 46 Z" fill-opacity="0.22" stroke-width="2"/><path d="M50 54 C36 74, 22 86, 36 90 C46 92, 50 82, 50 74 C50 82, 54 92, 64 90 C78 86, 64 74, 50 54 Z" fill-opacity="0.22" stroke-width="2"/><path d="M46 50 C26 36, 14 22, 10 36 C8 46, 18 50, 26 50 C18 50, 8 54, 10 64 C14 78, 26 64, 46 50 Z" fill-opacity="0.22" stroke-width="2"/><path d="M54 50 C74 36, 86 22, 90 36 C92 46, 82 50, 74 50 C82 50, 92 54, 90 64 C86 78, 74 64, 54 50 Z" fill-opacity="0.22" stroke-width="2"/></g>`,
        // 28: Blooming Magnolia Branch
        `<g stroke="currentColor" fill="currentColor"><path d="M12 84 Q46 64 88 26" fill="none" stroke-width="2.8" stroke-linecap="round"/><path d="M48 54 C36 36, 44 18, 56 26 C64 16, 74 32, 58 48 Z" fill-opacity="0.28" stroke-width="2"/><path d="M26 74 C16 60, 22 46, 32 52 C38 44, 46 56, 34 68 Z" fill-opacity="0.24" stroke-width="1.8"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    case 'abstract': {
      const variants = [
        // 1: Udaipur Palace Jharokha Balcony
        `<g stroke="currentColor" fill="currentColor"><path d="M18 82 V38 C18 22, 36 16, 50 6 C64 16, 82 22, 82 38 V82 Z" fill-opacity="0.18" stroke-width="2.5"/><rect x="10" y="82" width="80" height="8" rx="2" stroke-width="2"/><path d="M24 90 V96 M50 90 V96 M76 90 V96" stroke-width="2.5"/></g>`,
        // 2: Mughal Taj Onion Dome Pavilion
        `<g stroke="currentColor" fill="currentColor"><path d="M50 6 V14 M22 54 C14 36, 36 22, 50 14 C64 22, 86 36, 78 54 Z" fill-opacity="0.24" stroke-width="2.4"/><line x1="24" y1="54" x2="24" y2="88" stroke-width="3"/><line x1="76" y1="54" x2="76" y2="88" stroke-width="3"/><line x1="12" y1="88" x2="88" y2="88" stroke-width="3"/></g>`,
        // 3: Rajasthani Chhatri Cenotaph
        `<g stroke="currentColor" fill="currentColor"><path d="M14 44 A36 32 0 0 1 86 44 Z" fill-opacity="0.22" stroke-width="2.4"/><line x1="50" y1="6" x2="50" y2="12" stroke-width="2.5"/><rect x="8" y="44" width="84" height="6" rx="2"/><line x1="22" y1="50" x2="22" y2="86" stroke-width="2.5"/><line x1="40" y1="50" x2="40" y2="86" stroke-width="2.5"/><line x1="60" y1="50" x2="60" y2="86" stroke-width="2.5"/><line x1="78" y1="50" x2="78" y2="86" stroke-width="2.5"/><rect x="10" y="86" width="80" height="6" rx="2"/></g>`,
        // 4: Temple Shikhar Gopuram Tower
        `<g stroke="currentColor" fill="currentColor"><polygon points="36,16 64,16 70,34 30,34" fill-opacity="0.2" stroke-width="2"/><polygon points="28,34 72,34 78,56 22,56" fill-opacity="0.2" stroke-width="2"/><polygon points="20,56 80,56 88,88 12,88" fill-opacity="0.2" stroke-width="2"/><path d="M40 88 V68 A10 10 0 0 1 60 68 V88" fill="none" stroke-width="2"/><circle cx="50" cy="10" r="4"/></g>`,
        // 5: Carved Mandap Fluted Pillar
        `<g stroke="currentColor" fill="currentColor"><rect x="24" y="10" width="52" height="10" rx="3" fill-opacity="0.3" stroke-width="2.2"/><path d="M28 20 L34 30 H66 L72 20 Z" fill-opacity="0.2"/><rect x="36" y="30" width="28" height="48" fill-opacity="0.16" stroke-width="2.2"/><line x1="45" y1="30" x2="45" y2="78" stroke-width="1.4"/><line x1="55" y1="30" x2="55" y2="78" stroke-width="1.4"/><rect x="24" y="78" width="52" height="12" rx="3" fill-opacity="0.3" stroke-width="2.2"/></g>`,
        // 6: Baori Stepwell Geometric Stairs
        `<g stroke="currentColor" fill="none" stroke-width="2.2"><rect x="8" y="8" width="84" height="84"/><rect x="20" y="20" width="60" height="60"/><rect x="32" y="32" width="36" height="36"/><rect x="42" y="42" width="16" height="16" fill="currentColor" fill-opacity="0.3"/><line x1="8" y1="8" x2="42" y2="42"/><line x1="92" y1="8" x2="58" y2="42"/><line x1="8" y1="92" x2="42" y2="58"/><line x1="92" y1="92" x2="58" y2="58"/></g>`,
        // 7: Hawa Mahal Honeycomb Facade
        `<g stroke="currentColor" fill="currentColor" stroke-width="1.8"><path d="M34 34 V20 Q50 8 66 20 V34 Z" fill-opacity="0.22"/><path d="M18 60 V42 Q34 30 50 42 V60 Z M50 60 V42 Q66 30 82 42 V60 Z" fill-opacity="0.22"/><path d="M8 88 V68 Q22 56 36 68 V88 Z M36 88 V68 Q50 56 64 68 V88 Z M64 88 V68 Q78 56 92 68 V88 Z" fill-opacity="0.22"/></g>`,
        // 8: Islamic Mihrab Prayer Niche
        `<g stroke="currentColor" fill="currentColor"><rect x="12" y="8" width="76" height="84" fill="none" stroke-width="2.4"/><path d="M22 92 V46 C22 28, 38 22, 50 14 C62 22, 78 28, 78 46 V92 Z" fill-opacity="0.2" stroke-width="2.2"/><line x1="50" y1="14" x2="50" y2="38" stroke-width="1.6"/><polygon points="50,36 56,44 50,52 44,44"/></g>`,
        // 9: Torana Buddhist Gateway Arch
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><path d="M8 22 Q50 12 92 22 M12 36 Q50 28 88 36 M16 50 Q50 44 84 50" fill="none" stroke-width="3.5" stroke-linecap="round"/><rect x="24" y="20" width="8" height="72" fill-opacity="0.25"/><rect x="68" y="20" width="8" height="72" fill-opacity="0.25"/></g>`,
        // 10: Moroccan Zellige Star Tile
        `<g stroke="currentColor" fill="currentColor"><polygon points="${starPoints(50, 50, 8, 36, 20)}" fill-opacity="0.22" stroke-width="2.2"/><path d="M50 6 L60 20 H80 V40 L94 50 L80 60 V80 H60 L50 94 L40 80 H20 V60 L6 50 L20 40 V20 H40 Z" fill="none" stroke-width="1.8"/></g>`,
        // 11: Art Deco Sunburst Fan Arch
        `<g stroke="currentColor" fill="currentColor"><path d="M10 86 A40 40 0 0 1 90 86 Z" fill-opacity="0.16" stroke-width="2.4"/><path d="M24 86 A26 26 0 0 1 76 86 Z" fill-opacity="0.2" stroke-width="1.8"/><line x1="50" y1="86" x2="50" y2="14" stroke-width="2"/><line x1="50" y1="86" x2="20" y2="30" stroke-width="2"/><line x1="50" y1="86" x2="80" y2="30" stroke-width="2"/><line x1="50" y1="86" x2="8" y2="56" stroke-width="2"/><line x1="50" y1="86" x2="92" y2="56" stroke-width="2"/></g>`,
        // 12: Bauhaus Geometric Circle & Arch
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><path d="M16 90 V50 A34 34 0 0 1 84 50 V90 Z" fill-opacity="0.14"/><circle cx="50" cy="36" r="18" fill-opacity="0.3"/><rect x="28" y="62" width="44" height="28" fill-opacity="0.2"/></g>`,
        // 13: Infinity Mobius Strip Loop
        `<g stroke="currentColor" fill="none" stroke-width="3"><path d="M26 32 C8 32, 8 68, 26 68 C40 68, 60 32, 74 32 C92 32, 92 68, 74 68 C60 68, 40 32, 26 32 Z" fill="currentColor" fill-opacity="0.18"/><path d="M26 38 C14 38, 14 62, 26 62 C38 62, 62 38, 74 38 C86 38, 86 62, 74 62" stroke-width="1.4" stroke-dasharray="3 2"/></g>`,
        // 14: Impossible Penrose Triangle
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2" stroke-linejoin="round"><polygon points="50,10 90,80 76,88 50,42 24,88 10,80" fill-opacity="0.2"/><polygon points="50,26 78,76 22,76" fill="none"/><line x1="50" y1="10" x2="50" y2="26"/><line x1="90" y1="80" x2="22" y2="76"/></g>`,
        // 15: Golden Ratio Fibonacci Spiral
        `<g stroke="currentColor" fill="none" stroke-width="2.2"><rect x="10" y="18" width="80" height="64" rx="2" fill="currentColor" fill-opacity="0.12"/><line x1="60" y1="18" x2="60" y2="82"/><line x1="60" y1="56" x2="90" y2="56"/><line x1="72" y1="56" x2="72" y2="82"/><path d="M10 82 A50 50 0 0 1 60 18 A30 30 0 0 1 90 56 A18 18 0 0 1 72 82 A12 12 0 0 1 60 70" stroke-width="2.8"/></g>`,
        // 16: Concentric Maze Labyrinth
        `<g stroke="currentColor" fill="none" stroke-width="2.4" stroke-linecap="square"><path d="M12 12 H88 V88 H12 V26 H74 V74 H26 V40 H60 V60 H40 V50"/></g>`,
        // 17: Origami Crane Geometric Bird
        `<g stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="50,44 10,16 36,56" fill-opacity="0.28"/><polygon points="50,44 90,16 64,56" fill-opacity="0.2"/><polygon points="36,56 64,56 50,74" fill-opacity="0.35"/><polygon points="50,44 58,20 72,22 62,28 64,56" fill-opacity="0.25"/><polygon points="36,56 18,86 44,68" fill-opacity="0.25"/></g>`,
        // 18: Sacred Merkaba Star Tetrahedron
        `<g stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="50,8 88,74 12,74" fill-opacity="0.16"/><polygon points="50,92 88,26 12,26" fill-opacity="0.16"/><line x1="50" y1="8" x2="50" y2="92" stroke-dasharray="3 2"/><circle cx="50" cy="50" r="6"/></g>`,
        // 19: Flower of Life Overlapping Circles
        `<g stroke="currentColor" fill="none" stroke-width="1.8"><circle cx="50" cy="50" r="42" stroke-width="2.4"/><circle cx="50" cy="50" r="20"/>${Array.from({ length: 6 }, (_, k) => { const [x, y] = polar(50, 50, 20, k * 60); return `<circle cx="${x}" cy="${y}" r="20"/>`; }).join('')}</g>`,
        // 20: Metatron Cube Sacred Geometry
        `<g stroke="currentColor" fill="none" stroke-width="1.5"><polygon points="${polyPoints(50, 50, 6, 40)}" stroke-width="2"/><polygon points="${polyPoints(50, 50, 3, 40, -90)}"/><polygon points="${polyPoints(50, 50, 3, 40, 90)}"/><circle cx="50" cy="50" r="10" fill="currentColor" fill-opacity="0.25"/>${Array.from({ length: 6 }, (_, k) => { const [x, y] = polar(50, 50, 32, -90 + k * 60); return `<circle cx="${x}" cy="${y}" r="7" fill="currentColor" fill-opacity="0.2"/>`; }).join('')}</g>`,
        // 21: Yin Yang Dual Harmony Swirl
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.4"><circle cx="50" cy="50" r="42" fill="none"/><path d="M50 8 A21 21 0 0 1 50 50 A21 21 0 0 0 50 92 A42 42 0 0 1 50 8 Z" fill-opacity="0.3"/><circle cx="50" cy="29" r="5"/><circle cx="50" cy="71" r="5" fill="none"/></g>`,
        // 22: Triple Interlocked Borromean Rings
        `<g stroke="currentColor" fill="currentColor" fill-opacity="0.12" stroke-width="2.4"><circle cx="50" cy="36" r="22"/><circle cx="36" cy="60" r="22"/><circle cx="64" cy="60" r="22"/></g>`,
        // 23: Wave Interference Moire Pattern
        `<g stroke="currentColor" fill="none" stroke-width="1.8">${[20, 32, 44, 56, 68, 80].map((y) => `<path d="M8 ${y} Q29 ${y - 12} 50 ${y} T92 ${y}"/>`).join('')}</g>`,
        // 24: Isometric 3D Stacked Cubes
        `<g stroke="currentColor" fill="currentColor" stroke-width="2" stroke-linejoin="round"><polygon points="50,10 86,30 50,50 14,30" fill-opacity="0.35"/><polygon points="14,30 50,50 50,90 14,70" fill-opacity="0.2"/><polygon points="86,30 50,50 50,90 86,70" fill-opacity="0.1"/></g>`,
        // 25: Sun & Moon Eclipse Alignment
        `<g stroke="currentColor" fill="currentColor"><circle cx="50" cy="50" r="30" fill-opacity="0.2" stroke-width="2.4"/><path d="M56 20 A30 30 0 1 0 56 80 A24 24 0 1 1 56 20 Z" fill-opacity="0.4"/>${Array.from({ length: 12 }, (_, k) => { const [x1, y1] = polar(50, 50, 34, k * 30); const [x2, y2] = polar(50, 50, 42, k * 30); return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="2"/>`; }).join('')}</g>`,
        // 26: Eye of Providence Mystic Rays
        `<g stroke="currentColor" fill="currentColor"><polygon points="50,10 92,84 8,84" fill-opacity="0.16" stroke-width="2.4" stroke-linejoin="round"/><path d="M26 58 Q50 40 74 58 Q50 76 26 58 Z" fill-opacity="0.28" stroke-width="2"/><circle cx="50" cy="58" r="7"/></g>`,
        // 27: Hourglass Sands of Time
        `<g stroke="currentColor" fill="currentColor" stroke-width="2.2"><rect x="20" y="8" width="60" height="6" rx="2"/><rect x="20" y="86" width="60" height="6" rx="2"/><path d="M26 14 C26 38, 46 44, 50 50 C54 44, 74 38, 74 14 Z" fill-opacity="0.16"/><path d="M50 50 C46 56, 26 62, 26 86 H74 C74 62, 54 56, 50 50 Z" fill-opacity="0.24"/><polygon points="34,86 50,68 66,86" fill-opacity="0.5"/></g>`,
        // 28: Royal Toran Swag Valance
        `<g stroke="currentColor" fill="currentColor"><rect x="6" y="18" width="88" height="10" rx="4" fill-opacity="0.35" stroke-width="2"/><path d="M10 28 Q23 58 36 28 Q50 64 64 28 Q77 58 90 28" fill="none" stroke-width="2.4"/><line x1="36" y1="28" x2="36" y2="76" stroke-width="1.8"/><line x1="64" y1="28" x2="64" y2="76" stroke-width="1.8"/><polygon points="36,72 42,80 36,88 30,80"/><polygon points="64,72 70,80 64,88 58,80"/></g>`,
      ];
      return variants[idx % variants.length];
    }

    default:
      return `<circle cx="50" cy="50" r="38" fill="currentColor" stroke="currentColor" stroke-width="2"/>`;
  }
}

const manifestItems = [];
let totalWritten = 0;
const countsBySub = {};

for (const sub of SUBCATEGORY_SPECS) {
  const subDir = path.join(PUBLIC_SHAPES_DIR, sub.id);
  fs.mkdirSync(subDir, { recursive: true });
  countsBySub[sub.id] = 0;

  for (let idx = 0; idx < sub.count; idx++) {
    const num = String(idx + 1).padStart(2, '0');
    const id = `shape-${sub.id}-${num}`;
    const fileName = `${id}.svg`;
    const inner = generateShapeInner(sub.id, idx);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${inner}</svg>`;

    const diskPath = path.join(subDir, fileName);
    fs.writeFileSync(diskPath, svg, 'utf-8');

    const webPath = `/assets/elements/shapes/${sub.id}/${fileName}`;
    const readableSub = sub.label.replace(/&/g, 'and');
    const itemName = sub.names?.[idx] || `${sub.label.split(' ')[0]} ${idx + 1}`;

    manifestItems.push({
      id,
      name: itemName,
      category: 'shapes',
      subcategory: sub.id,
      svgPath: svg,
      filePath: webPath,
      defaultFill: idx % 2 === 0 ? '#D4AF37' : '#F59E0B',
      defaultStroke: '#FDE68A',
      tags: [
        sub.id,
        readableSub.toLowerCase(),
        ...itemName.toLowerCase().split(/\s+/),
        'shape',
        'vector',
        'royal',
        'gold',
        `shape-${idx + 1}`,
      ],
    });
    totalWritten++;
    countsBySub[sub.id]++;
  }
}

const tsManifest = `// AUTO-GENERATED 312 SHAPES MANIFEST across 15 subcategories
import { ShapeAssetItem } from '../../types/elements';

export const SHAPES_LIBRARY_ITEMS: ShapeAssetItem[] = ${JSON.stringify(manifestItems, null, 2)};
`;

fs.writeFileSync(path.join(DATA_DIR, 'shapesManifest.ts'), tsManifest, 'utf-8');

console.log(`Successfully generated ${totalWritten} unique decorative SVG shape files.`);
console.log('Subcategory counts:', countsBySub);
