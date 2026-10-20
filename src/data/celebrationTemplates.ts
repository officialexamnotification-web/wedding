import { CardTemplate, ImageElement, TextElement } from '../types/editor';
import { ensureTextContrast } from '../utils/colorContrast';

type Occasion = 'wedding' | 'housewarming' | 'sangeet-mehendi' | 'birthday' | 'baby-shower' | 'anniversary';

type Collection = {
  category: Occasion;
  label: string;
  count: number;
  names: string[];
  palette: [string, string, string][];
  motif: string;
  blessing: string;
  inviteLine: string;
  eventName: string;
  titleFont: string;
  titleSize: number;
};

const collections: Collection[] = [
  {
    category: 'wedding', label: 'Wedding', count: 17,
    names: ['Mughal Garden Vows', 'Ivory Palace Arch', 'Peacock Jharokha', 'Sage Botanical Vows', 'Marigold Mandap', 'Indigo Twilight', 'Blush Lotus Ceremony', 'Kundan Pearl Invitation', 'Rosewood Haveli', 'Monsoon Mogra Vows', 'Saffron Sunset Pheras', 'Jade Palace Garden', 'Temple Bell Blessings', 'Pichwai Elephant Procession', 'Champagne Shehnai', 'Ruby Rajwada', 'Moonlit Mandap'],
    palette: [['#6E1728','#C49A47','#FFF7EA'],['#183E35','#BE9B58','#F7F1E4'],['#23375B','#C7A65D','#F7F2E8'],['#9A4B54','#D0A95F','#FFF5EC'],['#713A22','#C99745','#FFF4D9'],['#2B294A','#C3A268','#F8F3EB'],['#88485C','#B89B70','#FFF7F2']],
    motif: 'lotus', blessing: '॥ श्री गणेशाय नमः ॥', inviteLine: 'Together with their families, invite you to celebrate', eventName: 'THE WEDDING CEREMONY', titleFont: "'Great Vibes', cursive", titleSize: 38,
  },
  {
    category: 'sangeet-mehendi', label: 'Sangeet & Haldi', count: 28,
    names: ['Marigold Mehendi', 'Dhol & Dhamaka', 'Mango Leaf Sangeet', 'Raas Garba Night', 'Haldi Sunshine', 'Royal Mehfil', 'Henna Garden', 'Genda Phool Fiesta', 'Indigo Folk Dance', 'Saffron Celebration', 'The Sangeet Social', 'Mehendi Courtyard', 'Folk Art Festive', 'Sunset Dholki', 'Phulkari Beats', 'Turmeric & Tunes', 'Mogra Music Night', 'Jashn-e-Sangeet', 'Gulabi Dandiya', 'Neon Mehendi Beats', 'Genda Garden Soiree', 'Sitar & Shimmer', 'Rang Barse Sangeet', 'The Golden Dhol', 'Mehfil Under the Stars', 'Marwari Folk Night', 'Kesar Haldi Brunch', 'Mogra & Mirchi'],
    palette: [['#9B4C20','#D5A42F','#FFF4D8'],['#74314B','#D59C3F','#FFF3E8'],['#315D42','#B4933D','#FBF2D9'],['#5F387E','#D5A343','#FBF0E5'],['#C27A1D','#D1A62D','#FFF7DD'],['#843D28','#C99A53','#FFF0DC'],['#8A4960','#BEAA5D','#FCF0E1'],['#9B5B21','#C9A33D','#FFF6DB']],
    motif: 'dhol', blessing: 'A night of music, colour & celebration', inviteLine: 'Come celebrate with music, dance and all our loved ones', eventName: 'SANGEET & MEHENDI NIGHT', titleFont: "'Rozha One', serif", titleSize: 32,
  },
  {
    category: 'housewarming', label: 'Griha Pravesh', count: 29,
    names: ['Manglik Kalash', 'Shubh Vastu Pooja', 'Lotus Toran', 'Ganesh Blessings', 'Aangan of Marigold', 'Sacred Threshold', 'Vastu Shanti', 'Mango Leaf Toran', 'Ivory Mandir', 'New Beginnings', 'Saffron Swastik', 'Kalash & Kanku', 'Mogra Courtyard', 'Sunlit Aangan', 'Pichwai Welcome', 'Tulsi Blessings', 'Golden Griha', 'The First Diya', 'Mangal Pravesh', 'Bandhanwar Welcome', 'Rangoli at the Door', 'Auspicious Aangan', 'Peacock Kalash', 'The Vastu Mandala', 'Shankh & Swastik', 'Mango Toran Blessing', 'New Home, New Light', 'Sacred Brass Diya', 'Rangrez Griha Pravesh'],
    palette: [['#8C3A25','#C99B43','#FFF4DD'],['#416447','#B79645','#F8F2E3'],['#A54C36','#CBA24D','#FFF5E2'],['#6D3B66','#C2A14F','#FAF2E7'],['#9C6B24','#C49D45','#FFF6DC'],['#285B52','#B79653','#F5F1E3'],['#8F4A32','#C7A04B','#FFF5E8'],['#52633D','#C4A150','#FBF5E7']],
    motif: 'kalash', blessing: '॥ श्री गणेशाय नमः ॥', inviteLine: 'With the blessings of our family, join us for', eventName: 'GRIHA PRAVESH & VASTU PUJA', titleFont: "'Tiro Devanagari Hindi', serif", titleSize: 31,
  },
  {
    category: 'birthday', label: 'Birthday', count: 29,
    names: ['Little Star Celebration', 'Golden Balloon Gala', 'Confetti Garden', 'First Birthday Blooms', 'Enchanted Cake Day', 'Pastel Party Parade', 'Celestial Birthday', 'Wildflower Wishes', 'Rainbow Sprinkle', 'Royal Birthday Soiree', 'Daisy & Cupcakes', 'Midnight Celebration', 'Storybook Birthday', 'Citrus Sunshine', 'Teddy Bear Tea', 'Little Prince Party', 'Little Princess Gala', 'The Cake Atelier', 'Birthday in Bloom', 'Disco Ball Birthday', 'Garden Tea Party', 'Superstar in Gold', 'Blue Cloud Birthday', 'Candy Stripe Carnival', 'Moon & Stars Party', 'Tiny Explorer Bash', 'Pearl Balloon Soiree', 'The Birthday Brunch', 'Buttercream Dreams'],
    palette: [['#5A588D','#D6A86D','#F8F3FF'],['#8D4E67','#D7AD55','#FFF3E8'],['#477F78','#D7A951','#F2FBF6'],['#975E7A','#D2AA6D','#FFF5F0'],['#77548B','#D7A960','#FCF4E9'],['#49708B','#D5AB64','#F4F8FF'],['#546C9A','#CBA75D','#F6F4FF'],['#A46255','#D9B770','#FFF6E9']],
    motif: 'cake', blessing: 'A little more sparkle, a lot more joy', inviteLine: 'You are invited to celebrate the birthday of', eventName: 'BIRTHDAY CELEBRATION', titleFont: "'Great Vibes', cursive", titleSize: 36,
  },
  {
    category: 'baby-shower', label: 'Godh Bharai', count: 30,
    names: ['Maa & Little Moon', 'Blush Lotus Godh Bharai', 'Little One on the Way', 'Pastel Peacock Blessing', 'Chandni Baby Shower', 'Mogra & Moonlight', 'The Nesting Ceremony', 'A Blessing for Baby', 'Peach Petal Celebration', 'Gulabi Godh Bharai', 'Little Star Naamkaran', 'Ivory Heirloom Blessing', 'Garden of New Beginnings', 'Cloud Nine Celebration', 'Soft Sage Godh Bharai', 'Silver Moon Ceremony', 'Rosewater & Ribbons', 'Tiny Toes Gathering', 'Noor-e-Baby', 'A New Little Bloom', 'Bashful Blossom Blessing', 'Little Lotus Arrival', 'Moonstone Naamkaran', 'Aangan for Baby', 'The Baby Blessing Brunch', 'Peach Moon Celebration', 'Tiny Peacock Party', 'Genda & Gulab Godh Bharai', 'Sweet Pea Soiree', 'Naamkaran Garden'],
    palette: [['#A85C78','#D5B27A','#FFF5F1'],['#657C7A','#CEAA86','#F5F7F2'],['#8976A5','#D9B7A6','#FBF5FC'],['#8D6F77','#C9AA79','#FFF7F1'],['#558087','#D8BA8C','#F3FAFA'],['#A17491','#D8B99A','#FFF5F8'],['#6D826B','#C9AD7A','#F8F7EC'],['#9B7587','#D1B9A1','#FFF7F4']],
    motif: 'moon', blessing: 'A little one, already loved beyond measure', inviteLine: 'With joy and blessings, we invite you to celebrate', eventName: 'GODH BHARAI & BABY BLESSING', titleFont: "'Cormorant Garamond', serif", titleSize: 35,
  },
  {
    category: 'anniversary', label: 'Anniversary', count: 30,
    names: ['Golden Jubilee', 'Pearl Anniversary', 'Ruby Rose Celebration', 'Emerald Years', 'Silver Vows', 'Forever & Always', 'A Decade of Us', 'Velvet Evening', 'Ivory Vow Renewal', 'Champagne & Roses', 'The Anniversary Ball', 'Vintage Love Story', 'Sapphire Celebration', 'Blush & Bronze', 'Timeless Together', 'Jade Jubilee', 'Midnight Vows', 'A Golden Evening', 'Ruby Heirloom', 'Twenty Five & Thriving', 'Golden Hour Together', 'A Love in Bloom', 'The Pearl Soiree', 'Our Silver Chapter', 'Ruby Garden Dinner', 'Vows Beneath the Stars', 'Champagne Jubilee', 'The Heirloom Dance', 'Thirty Years of Us', 'Forever in Jaipur'],
    palette: [['#7B5329','#C9A65A','#FFF7E8'],['#596B7E','#C5A58A','#F7F4EF'],['#833D4A','#CDA86A','#FFF5EF'],['#365A4D','#BEA467','#F7F4E7'],['#55536C','#B9A77C','#F8F5EE'],['#785260','#C9A46A','#FFF4EE'],['#5C6472','#C6A96F','#F7F6F1'],['#6A3C35','#C7A06B','#FBF4EA']],
    motif: 'infinity', blessing: 'A beautiful story, still being written', inviteLine: 'Together with our families, celebrate the years of love of', eventName: 'ANNIVERSARY CELEBRATION', titleFont: "'Cormorant Garamond', serif", titleSize: 36,
  },
];

const motifs: Record<string, string> = {
  lotus: '<path d="M250 188c-34-24-33-57 0-84 33 27 34 60 0 84Zm0 0c-42-7-63-33-58-67 30 9 49 28 58 67Zm0 0c42-7 63-33 58-67-30 9-49 28-58 67Zm-48 13c28-15 68-15 96 0M250 98V85"/>',
  kalash: '<path d="M250 88c-17 22-12 38 0 42 12-4 17-20 0-42Zm-40 47h80m-70 0c4 15 9 29 30 42 21-13 26-27 30-42m-55 3h50m-55 26h60m-50 13h40M198 127c-12-15-12-28-8-41 15 5 27 16 31 31m49 0c4-15 16-26 31-31 4 13 4 26-8 41"/>',
  dhol: '<path d="m215 119 70 0 18 24v55l-18 22h-70l-18-22v-55l18-24Zm0 0v100m70-100v100m-88-76 88 52m-88 0 88-52M190 99l-28-17m146 17 28-17"/><path d="M236 105v-26m28 26V79"/>',
  cake: '<path d="M190 177h120v55H190zM205 148h90v29h-90zM250 148v-35m0 0c-15-19-3-31 0-39 4 9 15 21 0 39Zm-35 0v-18m0 0c-11-13-3-22 0-28 3 7 11 15 0 28Zm70 0v-18m0 0c-11-13-3-22 0-28 3 7 11 15 0 28Z"/><path d="M190 197c15-13 30 13 45 0s30 13 45 0 20-4 30 0"/>',
  moon: '<path d="M269 91c-42 13-53 70-18 96 22 16 54 10 69-10-39 6-72-34-51-86Zm-19 105c-15 17-33 25-54 25m108-1c-15-14-25-25-31-43m-70 51h95"/><path d="m193 116 4 10 11 1-8 7 3 11-10-6-9 6 3-11-8-7 11-1 3-10Zm109 4 3 8 9 1-7 5 3 8-8-5-8 5 3-8-7-5 9-1 3-8Z"/>',
  infinity: '<path d="M250 154c-27-43-73-43-83-9-10 33 24 58 50 37l66-55c26-21 60 4 50 37-10 34-56 34-83-10Zm-81 68h162M212 202h76"/><circle cx="250" cy="154" r="58" opacity=".16"/>',
};

const thumbnailGradients = [
  'from-rose-950 via-amber-800 to-orange-50',
  'from-emerald-950 via-amber-700 to-emerald-50',
  'from-indigo-950 via-amber-700 to-indigo-50',
  'from-fuchsia-950 via-rose-700 to-rose-50',
  'from-orange-950 via-amber-600 to-yellow-50',
  'from-slate-950 via-violet-800 to-indigo-50',
  'from-pink-950 via-rose-700 to-pink-50',
];

function artwork(palette: [string, string, string], motif: string, seed: number): string {
  const [ink, gold, paper] = palette;
  const doubleFrame = seed % 3 !== 1;
  const scallops = Array.from({ length: 9 }, (_, i) => `<circle cx="${102 + i * 37}" cy="${38 + (i % 2) * 5}" r="2"/>`).join('');
  const corners = [[42,42],[458,42],[42,658],[458,658]].map(([x,y], i) => `<g transform="translate(${x} ${y}) rotate(${i===1||i===2?90:0})"><path d="M0 28V0h28M5 22V5h17M0 9c8 0 13-4 14-9M9 28c0-8 4-13 9-14"/><circle cx="14" cy="14" r="2"/></g>`).join('');
  const arch = seed % 4 === 0
    ? '<path d="M112 320V178c0-78 58-129 138-129s138 51 138 129v142"/><path d="M126 320V181c0-68 51-114 124-114s124 46 124 114v139"/>'
    : seed % 4 === 1
      ? '<path d="M92 310V115h316v195M107 294V130h286v164"/><path d="m92 116 38-38 38 38 41-39 41 39 40-39 39 39 39-38 40 38"/>'
      : seed % 4 === 2
        ? '<ellipse cx="250" cy="233" rx="170" ry="170"/><ellipse cx="250" cy="233" rx="156" ry="156" stroke-dasharray="2 7"/>'
        : '<path d="M95 112h310v210H95zM110 127h280v180H110z"/><path d="M110 127 390 307M390 127 110 307" opacity=".24"/>';
  const mark = motifs[motif];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700"><defs><linearGradient id="p" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${paper}"/><stop offset="1" stop-color="${paper}" stop-opacity=".84"/></linearGradient><radialGradient id="glow"><stop stop-color="${gold}" stop-opacity=".12"/><stop offset="1" stop-color="${gold}" stop-opacity="0"/></radialGradient></defs><rect width="500" height="700" fill="url(#p)"/><rect width="500" height="700" fill="url(#glow)"/><g fill="none" stroke="${gold}" stroke-width="1.4">${doubleFrame?'<rect x="22" y="22" width="456" height="656" rx="2"/><rect x="31" y="31" width="438" height="638" rx="1"/>':'<rect x="27" y="27" width="446" height="646" rx="2"/>'}${corners}<path d="M107 78h286" stroke-dasharray="1 4"/><path d="M107 622h286" stroke-dasharray="1 4"/><g fill="${gold}" stroke="none">${scallops}</g></g><g fill="none" stroke="${ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".16">${arch}</g><g fill="none" stroke="${gold}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity=".24" transform="translate(0 ${seed%2?8:0})">${mark}</g><g fill="${gold}" opacity=".72"><circle cx="76" cy="350" r="2"/><circle cx="424" cy="350" r="2"/><circle cx="82" cy="366" r="1"/><circle cx="418" cy="366" r="1"/></g></svg>`;
}

function textLayer(id: string, text: string, y: number, height: number, fontFamily: string, fontSize: number, color: string, weight: TextElement['fontWeight'] = 'normal', spacing = 0): TextElement {
  return { id, type: 'text', text, fontFamily, fontSize, color, fontWeight: weight, fontStyle: 'normal', textAlign: 'center', letterSpacing: spacing, lineHeight: 1.2, x: 55, y, width: 390, height, rotation: 0, opacity: 1, zIndex: 3 };
}

function createCard(collection: Collection, name: string, index: number): CardTemplate {
  const id = `${collection.category}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const palette = collection.palette[index % collection.palette.length];
  const ink = ensureTextContrast(palette[0], palette[2]);
  const accentInk = ensureTextContrast(palette[1], palette[2]);
  const title = collection.category === 'wedding' ? 'Wedding Invitation'
    : collection.category === 'housewarming' ? 'Griha Pravesh'
      : collection.category === 'sangeet-mehendi' ? 'Sangeet & Haldi'
        : collection.category === 'birthday' ? 'Birthday Invitation'
          : collection.category === 'baby-shower' ? 'Godh Bharai'
            : 'Anniversary Invitation';
  const background: ImageElement = {
    id: `${id}-artwork`, type: 'image', src: `/templates/generated-assets/${collection.category}-${String(index + 1).padStart(2, '0')}.jpg`,
    alt: `${name} original invitation artwork`, mask: 'none', x: 0, y: 0, width: 500, height: 700, rotation: 0, opacity: 1, zIndex: 1, objectFit: 'cover', locked: true,
  };
  const topY = 76;
  const titleY = 252;
  const displayName = collection.category === 'birthday' ? 'Aarav turns One'
    : collection.category === 'baby-shower' ? 'A little one is on the way'
      : collection.category === 'anniversary' ? 'Vikram & Ananya'
        : collection.category === 'housewarming' ? 'The Sharma Family'
          : 'Aarav & Meera';
  const eventDetail = collection.category === 'wedding' ? 'SATURDAY · 21 FEBRUARY 2027'
    : collection.category === 'housewarming' ? 'SUNDAY · 21 FEBRUARY 2027'
      : collection.category === 'sangeet-mehendi' ? 'SATURDAY · 21 NOVEMBER 2026'
        : collection.category === 'birthday' ? 'SUNDAY · 21 FEBRUARY 2027'
          : collection.category === 'baby-shower' ? 'SUNDAY · 21 FEBRUARY 2027'
            : 'SATURDAY · 21 FEBRUARY 2027';
  const elements: CardTemplate['pages'][number]['elements'] = [
    background,
    textLayer(`${id}-blessing`, collection.blessing, topY, 28, "'Tiro Devanagari Hindi', serif", 13, accentInk, '600', 0.6),
    textLayer(`${id}-title`, title, topY + 38, 48, "'Cinzel', serif", 22, accentInk, '600', 0.8),
    textLayer(`${id}-intro`, collection.inviteLine, titleY - 34, 36, "'Cormorant Garamond', serif", 15, ink),
    textLayer(`${id}-names`, displayName, titleY + 4, 60, collection.titleFont, collection.titleSize, ink, '600'),
    textLayer(`${id}-event`, collection.eventName, titleY + 70, 34, "'Cinzel', serif", 14, accentInk, '600', 0.6),
    textLayer(`${id}-date`, eventDetail, titleY + 112, 32, "'Montserrat', sans-serif", 13, ink, '600', 0.4),
    textLayer(`${id}-venue`, 'THE ROYAL COURTYARD  ·  JAIPUR', 440, 34, "'Cinzel', serif", 12, accentInk, '600', 0.5),
    textLayer(`${id}-rsvp`, 'With love, we look forward to celebrating with you', 486, 40, "'Cormorant Garamond', serif", 14, ink),
  ];
  return {
    id, title: `${name} ${collection.label} Invitation`, category: collection.category,
    aspectRatio: 'portrait-classic', tags: [collection.label, name, 'Editable text', 'Original artwork'],
    thumbnailGradient: thumbnailGradients[index % thumbnailGradients.length],
    pages: [{ id: `${id}-page-1`, title, backgroundType: 'color', backgroundValue: palette[2], elements }],
  };
}

export const CELEBRATION_TEMPLATES: CardTemplate[] = collections.flatMap((collection) =>
  collection.names.slice(0, collection.count).map((name, index) => createCard(collection, name, index)),
);

