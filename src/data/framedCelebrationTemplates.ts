import { CardTemplate, FrameElement, ImageElement, TextElement } from '../types/editor';
import { FRAMES_LIBRARY_ITEMS } from './elements/framesGridsManifest';
import { ensureTextContrast } from '../utils/colorContrast';

type Occasion = CardTemplate['category'];
type Palette = { background: string; ink: string; gold: string; soft: string };
type FrameSlot = { x: number; y: number; width: number; height: number; frameId: string; rotation?: number };
type Layout = { frames: FrameSlot[]; text: { introY: number; nameY: number; eventY: number; detailsY: number; venueY: number; nameSize?: number; } };

type Collection = {
  category: Occasion;
  label: string;
  titles: string[];
  palette: Palette[];
  photos: string[];
  motif: string;
  intro: string;
  names: string;
  event: string;
  details: string;
  venue: string;
};

const collections: Collection[] = [
  {
    category: 'wedding', label: 'Wedding',
    titles: ['Mughal Portrait Vows', 'Ivory Jharokha Story', 'The Wedding Album', 'Saffron Garden Portrait', 'Rosewater Polaroids', 'Peacock Cameo', 'Velvet Photo Journal', 'The Heirloom Collage', 'Mandap in Bloom', 'Golden Hour Together'],
    palette: [
      { background: '#F8F0E4', ink: '#4C2730', gold: '#B58B48', soft: '#8D684B' }, { background: '#F5F0E5', ink: '#27443B', gold: '#B59A62', soft: '#6D7661' },
      { background: '#F4EEE6', ink: '#473C38', gold: '#B78F68', soft: '#77685B' }, { background: '#F7EFE2', ink: '#6B3527', gold: '#C59B48', soft: '#86664B' },
      { background: '#F8ECEB', ink: '#633B4B', gold: '#BA8B73', soft: '#8A6670' }, { background: '#EEF0EB', ink: '#30483C', gold: '#B99B57', soft: '#687263' },
      { background: '#F1EDE8', ink: '#3E3438', gold: '#A9825E', soft: '#71615C' }, { background: '#F5F0E8', ink: '#4A3E35', gold: '#B6975B', soft: '#75685A' },
      { background: '#F9F1E2', ink: '#6B432A', gold: '#C99D46', soft: '#8A6E45' }, { background: '#F7F0E7', ink: '#584033', gold: '#C29A5A', soft: '#806A50' },
    ],
    photos: [
      '/images/frame-templates/wedding-01.png', '/images/frame-templates/wedding-02.png',
      '/images/frame-templates/wedding-03.png', '/images/frame-templates/wedding-04.png',
      '/images/frame-templates/wedding-05.png', '/images/frame-templates/wedding-06.png',
      '/images/frame-templates/wedding-07.png', '/images/frame-templates/wedding-08.png',
      '/images/frame-templates/wedding-couple.png',
    ],
    motif: 'lotus', intro: 'WITH THE BLESSINGS OF OUR FAMILIES', names: 'Aarav & Meera', event: 'THE WEDDING CEREMONY', details: 'SATURDAY · 21 FEBRUARY 2027 · 6:30 PM', venue: 'THE ROYAL COURTYARD · JAIPUR',
  },
  {
    category: 'housewarming', label: 'Griha Pravesh',
    titles: ['Aangan of Light', 'The New Home Story', 'Sacred Threshold', 'Mogra at the Door', 'Kalash & Courtyard', 'First Diya Portrait', 'Tulsi Garden Welcome', 'A Home in Bloom', 'Vastu Blessings', 'Our New Beginning'],
    palette: [
      { background: '#F7F1E2', ink: '#57402A', gold: '#B58A3E', soft: '#7B6948' }, { background: '#EFF2E8', ink: '#365143', gold: '#A88A4A', soft: '#617261' },
      { background: '#F8F0E5', ink: '#713C2E', gold: '#C29A4A', soft: '#88664D' }, { background: '#F4F0E7', ink: '#4A5140', gold: '#B99A5D', soft: '#6C725B' },
      { background: '#FFF3DD', ink: '#724326', gold: '#C38E32', soft: '#8B6A45' }, { background: '#F5F1E8', ink: '#504232', gold: '#B49451', soft: '#766B59' },
      { background: '#EEF2E9', ink: '#405842', gold: '#B2924E', soft: '#69765F' }, { background: '#FBF2E7', ink: '#70432E', gold: '#C1954A', soft: '#896B52' },
      { background: '#F5F0E4', ink: '#334F46', gold: '#B29455', soft: '#687368' }, { background: '#F7F1E5', ink: '#5F412E', gold: '#B99550', soft: '#7C6953' },
    ],
    photos: [
      '/images/frame-templates/griha-01.png', '/images/frame-templates/griha-02.png',
      '/images/frame-templates/griha-03.png', '/images/frame-templates/griha-04.png',
      '/images/frame-templates/griha-05.png', '/images/frame-templates/griha-06.png',
      '/images/frame-templates/griha-07.png', '/images/frame-templates/griha-08.png',
      '/images/frame-templates/griha-pravesh-family.png',
    ],
    motif: 'kalash', intro: 'WITH THE BLESSINGS OF OUR ELDERS', names: 'The Sharma Family', event: 'GRIHA PRAVESH & VASTU PUJA', details: 'SUNDAY · 15 NOVEMBER 2026 · 9:00 AM', venue: 'SHIVAM RESIDENCY · GURUGRAM',
  },
  {
    category: 'sangeet-mehendi', label: 'Sangeet & Haldi',
    titles: ['Genda Phool Party', 'Dhol & Dandiya', 'Mehendi Afterglow', 'The Haldi Album', 'Sangeet Social', 'Rang Barse Night', 'Marigold Memories', 'Dance Floor Diaries', 'Saffron Beats', 'Mehfil Under Lights'],
    palette: [
      { background: '#FFF1D8', ink: '#653B25', gold: '#C58B24', soft: '#936642' }, { background: '#F9EAE3', ink: '#713A4A', gold: '#C39A42', soft: '#90616A' },
      { background: '#F3EBDD', ink: '#3F563D', gold: '#BE9A3A', soft: '#6B7655' }, { background: '#FFF4DC', ink: '#714520', gold: '#D19A27', soft: '#946A36' },
      { background: '#F4E8E6', ink: '#64384C', gold: '#B99256', soft: '#896777' }, { background: '#F2E8D6', ink: '#623B2D', gold: '#C28F32', soft: '#826544' },
      { background: '#F8F0DC', ink: '#4E5634', gold: '#C39B36', soft: '#76764D' }, { background: '#F1EAF0', ink: '#523B5E', gold: '#BE9650', soft: '#79647E' },
      { background: '#FFF2E2', ink: '#704022', gold: '#CB8D2E', soft: '#916746' }, { background: '#EFE8E0', ink: '#523B37', gold: '#B99854', soft: '#75615A' },
    ],
    photos: [
      '/images/frame-templates/sangeet-01.png', '/images/frame-templates/sangeet-02.png',
      '/images/frame-templates/sangeet-03.png', '/images/frame-templates/sangeet-04.png',
      '/images/frame-templates/sangeet-05.png', '/images/frame-templates/sangeet-06.png',
      '/images/frame-templates/sangeet-07.png', '/images/frame-templates/sangeet-08.png',
      '/images/frame-templates/sangeet-celebration.png',
    ],
    motif: 'dhol', intro: 'A NIGHT OF MUSIC, COLOUR & CELEBRATION', names: 'Aarav & Meera', event: 'SANGEET & MEHENDI NIGHT', details: 'SATURDAY · 21 NOVEMBER 2026 · 7:30 PM', venue: 'THE MARIGOLD COURTYARD · JAIPUR',
  },
  {
    category: 'birthday', label: 'Birthday',
    titles: ['Little Star Portrait', 'Confetti Photo Club', 'Birthday Scrapbook', 'A Year in Bloom', 'Cake & Candles', 'The Birthday Edit', 'Golden Balloon Story', 'One Happy Day', 'Pastel Party Pages', 'A Star Is Celebrated'],
    palette: [
      { background: '#F2F0FB', ink: '#4B426E', gold: '#C19B55', soft: '#71698B' }, { background: '#FFF0E7', ink: '#794459', gold: '#C59A4E', soft: '#966B78' },
      { background: '#ECF5F0', ink: '#3C625D', gold: '#C69C50', soft: '#69837A' }, { background: '#FFF2EF', ink: '#75465D', gold: '#C78E83', soft: '#916979' },
      { background: '#F7F0E5', ink: '#684C34', gold: '#C69A4A', soft: '#8B7052' }, { background: '#EEF3F8', ink: '#405D75', gold: '#C3A05B', soft: '#6C7F90' },
      { background: '#F4EFF7', ink: '#57466A', gold: '#B89C60', soft: '#796A87' }, { background: '#FFF4E8', ink: '#805332', gold: '#D2A341', soft: '#9B774F' },
      { background: '#EFF4F8', ink: '#425A6C', gold: '#B99C65', soft: '#718393' }, { background: '#F7F0F4', ink: '#684C65', gold: '#C4A061', soft: '#8B7185' },
    ],
    photos: [
      '/images/frame-templates/birthday-01.png', '/images/frame-templates/birthday-02.png',
      '/images/frame-templates/birthday-03.png', '/images/frame-templates/birthday-04.png',
      '/images/frame-templates/birthday-05.png', '/images/frame-templates/birthday-06.png',
      '/images/frame-templates/birthday-07.png', '/images/frame-templates/birthday-celebration.png',
    ],
    motif: 'stars', intro: 'COME CELEBRATE A VERY SPECIAL DAY', names: 'Aarav Turns One', event: 'BIRTHDAY CELEBRATION', details: 'SATURDAY · 10 OCTOBER 2026 · 5:30 PM', venue: 'CLUB EMERALD · MUMBAI',
  },
  {
    category: 'baby-shower', label: 'Godh Bharai',
    titles: ['Little Moon Gathering', 'Blush Bloom Blessing', 'The Baby Shower Edit', 'A Sweet Arrival', 'Maa & Little One', 'Peach Petal Welcome', 'Tiny Toes Celebration', 'Cloud Nine Blessings', 'The Nesting Party', 'A New Bloom Begins'],
    palette: [
      { background: '#FFF1F0', ink: '#73495C', gold: '#C5A17B', soft: '#967684' }, { background: '#F4F1EA', ink: '#526057', gold: '#BDA27F', soft: '#7C857C' },
      { background: '#F7F0F8', ink: '#65516E', gold: '#C0A1B1', soft: '#897A92' }, { background: '#FFF3E9', ink: '#805746', gold: '#C8A077', soft: '#9B7866' },
      { background: '#EDF4F3', ink: '#44676A', gold: '#C2A77D', soft: '#708889' }, { background: '#FCF0F2', ink: '#805368', gold: '#C9A27E', soft: '#9C7788' },
      { background: '#F4F5EC', ink: '#5B6853', gold: '#BFA77F', soft: '#818A73' }, { background: '#F0F3FA', ink: '#4E5E7D', gold: '#C0A982', soft: '#78859D' },
      { background: '#FFF3F0', ink: '#815366', gold: '#C69F8C', soft: '#9D7987' }, { background: '#F4F1E8', ink: '#536154', gold: '#BBA37B', soft: '#7A8678' },
    ],
    photos: [
      '/images/frame-templates/godh-01.png', '/images/frame-templates/godh-02.png',
      '/images/frame-templates/godh-03.png', '/images/frame-templates/godh-04.png',
      '/images/frame-templates/godh-05.png', '/images/frame-templates/godh-06.png',
      '/images/frame-templates/godh-07.png', '/images/frame-templates/godh-bharai-family.png',
    ],
    motif: 'moon', intro: 'WITH JOYFUL HEARTS & LOVING BLESSINGS', names: 'A Little One Is on the Way', event: 'GODH BHARAI CELEBRATION', details: 'SUNDAY · 21 FEBRUARY 2027 · 11:00 AM', venue: 'THE BLOSSOM GARDEN · JAIPUR',
  },
  {
    category: 'anniversary', label: 'Anniversary',
    titles: ['Golden Years Together', 'Pearl Anniversary Album', 'Still in Bloom', 'The Love Story Edit', 'A Silver Chapter', 'Forever in Jaipur', 'Ruby Rose Evening', 'Our Years in Frames', 'Champagne & Memories', 'Timeless Together'],
    palette: [
      { background: '#F6F0E4', ink: '#5D472E', gold: '#C1A05A', soft: '#817050' }, { background: '#F1F0EC', ink: '#4D5965', gold: '#B8A17F', soft: '#747F87' },
      { background: '#F8EEEE', ink: '#74414C', gold: '#C29A69', soft: '#936E72' }, { background: '#EEF2EC', ink: '#405B4C', gold: '#B9A064', soft: '#708072' },
      { background: '#F2EFF5', ink: '#575269', gold: '#BBA67B', soft: '#79758C' }, { background: '#FFF3E5', ink: '#744C34', gold: '#C69D55', soft: '#936F4F' },
      { background: '#F7ECE9', ink: '#783F43', gold: '#C29A65', soft: '#94696A' }, { background: '#F3F1EB', ink: '#555146', gold: '#BCA56A', soft: '#7A7665' },
      { background: '#F9F0E7', ink: '#684A3A', gold: '#C7A36C', soft: '#8B705C' }, { background: '#EFF2F0', ink: '#405C52', gold: '#BBA36A', soft: '#708278' },
    ],
    photos: [
      '/images/frame-templates/anniversary-01.png', '/images/frame-templates/anniversary-02.png',
      '/images/frame-templates/anniversary-03.png', '/images/frame-templates/anniversary-04.png',
      '/images/frame-templates/anniversary-05.png', '/images/frame-templates/anniversary-06.png',
      '/images/frame-templates/anniversary-couple.png',
    ],
    motif: 'infinity', intro: 'A BEAUTIFUL STORY, STILL BEING WRITTEN', names: 'Vikram & Ananya', event: 'ANNIVERSARY CELEBRATION', details: 'SUNDAY · 21 FEBRUARY 2027 · 7:00 PM', venue: 'THE HERITAGE COURTYARD · JAIPUR',
  },
];

// Every category alternates refined paper palettes with five richer, full-color
// stocks. Gold foil and high-contrast type keep the darker cards readable.
const coloredPalettes: Record<Occasion, Palette[]> = {
  wedding: [
    { background: '#3B1524', ink: '#FFF3E3', gold: '#E5C16C', soft: '#D4A2A9' }, { background: '#17382F', ink: '#F7F1DB', gold: '#D4B56A', soft: '#B5C7A8' },
    { background: '#1D2B49', ink: '#F9F3E6', gold: '#D8B966', soft: '#A9B4C8' }, { background: '#522437', ink: '#FFF0E6', gold: '#E5BE6C', soft: '#E3A7B8' },
    { background: '#643620', ink: '#FFF5E4', gold: '#F0C968', soft: '#E7BA8F' },
  ],
  housewarming: [
    { background: '#234638', ink: '#FFF8E8', gold: '#E3C46F', soft: '#BCD0A8' }, { background: '#69401F', ink: '#FFF4DF', gold: '#EBC467', soft: '#DAB68F' },
    { background: '#19464A', ink: '#F7F5E8', gold: '#D7BE73', soft: '#A9C6B8' }, { background: '#5B2921', ink: '#FFF5E6', gold: '#E7BD66', soft: '#E0A98E' },
    { background: '#343154', ink: '#F8F2E8', gold: '#D7C078', soft: '#C0B7D5' },
  ],
  'sangeet-mehendi': [
    { background: '#6A2850', ink: '#FFF2E7', gold: '#FFD06E', soft: '#F0A7BD' }, { background: '#174B48', ink: '#FFF5DE', gold: '#E7C65D', soft: '#A9D1B6' },
    { background: '#71391F', ink: '#FFF5E5', gold: '#FFD36A', soft: '#F0B080' }, { background: '#3D285B', ink: '#FFF3EB', gold: '#F1C96E', soft: '#D2A8DB' },
    { background: '#842F3B', ink: '#FFF4E5', gold: '#F8CF70', soft: '#F2A8A2' },
  ],
  birthday: [
    { background: '#493766', ink: '#FFF7ED', gold: '#F2CC72', soft: '#D8B5EA' }, { background: '#7B344B', ink: '#FFF4E8', gold: '#FFD070', soft: '#F2AFBD' },
    { background: '#14525A', ink: '#F4FBF7', gold: '#E9CC73', soft: '#A7D5D1' }, { background: '#314A78', ink: '#F8F5FF', gold: '#F3CE72', soft: '#B6C9F0' },
    { background: '#69404C', ink: '#FFF4EE', gold: '#F4CB77', soft: '#E7B9C8' },
  ],
  'baby-shower': [
    { background: '#6B4053', ink: '#FFF8F0', gold: '#E9C982', soft: '#E2B7C6' }, { background: '#35574C', ink: '#F8F7E9', gold: '#E0C58E', soft: '#B8D0B9' },
    { background: '#40536D', ink: '#FFF7EF', gold: '#E8C98D', soft: '#C1CDE2' }, { background: '#76513E', ink: '#FFF7EB', gold: '#EAC988', soft: '#E5C2A4' },
    { background: '#58446D', ink: '#FFF7F1', gold: '#E7C88D', soft: '#D1BDE3' },
  ],
  anniversary: [
    { background: '#4A2630', ink: '#FFF5E9', gold: '#E5C67E', soft: '#D5A8AB' }, { background: '#193A34', ink: '#F8F4E6', gold: '#D9C17A', soft: '#B4C7B5' },
    { background: '#26364F', ink: '#FFF7E9', gold: '#E1C582', soft: '#B3C0D2' }, { background: '#553047', ink: '#FFF4EE', gold: '#E9C27A', soft: '#D8ADC8' },
    { background: '#57412B', ink: '#FFF6E6', gold: '#E7C777', soft: '#D5C09D' },
  ],
};

// Occasion-specific frame treatments make the same photo layouts feel authored
// for their celebration instead of reusing one generic border everywhere.
const categoryFrameStyles: Record<Occasion, string[]> = {
  wedding: ['frame-01', 'frame-02', 'frame-05', 'frame-14', 'frame-11', 'frame-03', 'frame-12', 'frame-13', 'frame-16', 'frame-01'],
  housewarming: ['frame-02', 'frame-16', 'frame-14', 'frame-01', 'frame-05', 'frame-18', 'frame-03', 'frame-15', 'frame-17', 'frame-16'],
  'sangeet-mehendi': ['frame-11', 'frame-06', 'frame-13', 'frame-15', 'frame-20', 'frame-07', 'frame-04', 'frame-11', 'frame-08', 'frame-16'],
  birthday: ['frame-10', 'frame-11', 'frame-20', 'frame-12', 'frame-04', 'frame-09', 'frame-13', 'frame-05', 'frame-06', 'frame-10'],
  'baby-shower': ['frame-05', 'frame-15', 'frame-03', 'frame-16', 'frame-04', 'frame-09', 'frame-12', 'frame-17', 'frame-18', 'frame-03'],
  anniversary: ['frame-05', 'frame-04', 'frame-09', 'frame-11', 'frame-06', 'frame-19', 'frame-14', 'frame-18', 'frame-03', 'frame-07'],
};

const colorfulCategoryFrameStyles: Record<Occasion, string[]> = {
  wedding: ['frame-16', 'frame-23', 'frame-24', 'frame-25', 'frame-26', 'frame-27', 'frame-29', 'frame-21', 'frame-22', 'frame-28'],
  housewarming: ['frame-17', 'frame-18', 'frame-19', 'frame-25', 'frame-26', 'frame-29', 'frame-27', 'frame-21', 'frame-23', 'frame-28'],
  'sangeet-mehendi': ['frame-20', 'frame-22', 'frame-24', 'frame-26', 'frame-28', 'frame-30', 'frame-23', 'frame-27', 'frame-21', 'frame-25'],
  birthday: ['frame-10', 'frame-15', 'frame-18', 'frame-20', 'frame-22', 'frame-24', 'frame-26', 'frame-28', 'frame-30', 'frame-23'],
  'baby-shower': ['frame-17', 'frame-19', 'frame-21', 'frame-23', 'frame-25', 'frame-27', 'frame-29', 'frame-18', 'frame-22', 'frame-26'],
  anniversary: ['frame-16', 'frame-18', 'frame-20', 'frame-22', 'frame-24', 'frame-26', 'frame-28', 'frame-30', 'frame-23', 'frame-27'],
};

const colorStories: Palette[] = [
  { background: '#762642', ink: '#FFF7EA', gold: '#F3CE73', soft: '#F0A8B7' },
  { background: '#174F48', ink: '#FFF8E7', gold: '#E9C66C', soft: '#A9D5BF' },
  { background: '#263B72', ink: '#FFF7E8', gold: '#F0C96C', soft: '#AFC4F1' },
  { background: '#7C3B2C', ink: '#FFF6E9', gold: '#F2CC70', soft: '#F0A88F' },
  { background: '#512A61', ink: '#FFF5EB', gold: '#F0CA78', soft: '#D7B2E6' },
  { background: '#F9E8D2', ink: '#63382D', gold: '#B47B32', soft: '#EAA58C' },
  { background: '#E8E7F7', ink: '#433B6E', gold: '#AA8741', soft: '#B6B5E1' },
  { background: '#E0F0E7', ink: '#30574A', gold: '#A7843E', soft: '#A5D5B9' },
  { background: '#FFF0E4', ink: '#714635', gold: '#B98B40', soft: '#EAB4B7' },
  { background: '#DDEBF0', ink: '#2E5361', gold: '#9F803D', soft: '#96C9D1' },
];

const colorfulCollectionSpecs: Array<Omit<Collection, 'palette'> & { paletteOffset: number }> = [
  {
    category: 'wedding', label: 'Wedding', paletteOffset: 0,
    titles: ['The Marigold Vows', 'Palace Steps Portrait', 'Noor at the Mandap', 'Emerald Evening Vows', 'The Garden Ceremony', 'Saffron & Silk', 'Moonlit Courtyard', 'The Heirloom Portrait', 'Jharokha in Bloom', 'Vow & Velvet Album'],
    photos: Array.from({ length: 10 }, (_, i) => `/images/photo-library/wedding-${['jharokha-sunrise-01', 'palace-stairs-02', 'lotus-pond-03', 'mandap-vows-04', 'coastal-ceremony-05', 'mehendi-portrait-06', 'ivory-studio-07', 'night-terrace-08', 'floral-garden-09', 'sunset-terrace-10'][i]}.webp`),
    motif: 'peacock', intro: 'WITH THE BLESSINGS OF OUR FAMILIES', names: 'Aarav & Meera', event: 'THE WEDDING CEREMONY', details: 'SATURDAY · 20 FEBRUARY 2027 · 7:30 PM', venue: 'THE ROYAL PALACE · LUCKNOW',
  },
  {
    category: 'housewarming', label: 'Griha Pravesh', paletteOffset: 2,
    titles: ['First Diya at Home', 'Aangan Welcome', 'Mango Leaf Morning', 'The New Door', 'Home in the Hills', 'Vastu & Violets', 'Courtyard Gathering', 'The First Aarti'],
    photos: Array.from({ length: 8 }, (_, i) => `/images/photo-library/home-${['diya-entry-01', 'courtyard-kalash-02', 'first-breakfast-03', 'balcony-garden-04', 'vastu-puja-05', 'blue-door-06', 'family-haveli-07', 'sunset-terrace-08'][i]}.webp`),
    motif: 'diya', intro: 'WITH THE BLESSINGS OF OUR ELDERS', names: 'The Sharma Family', event: 'GRIHA PRAVESH & VASTU PUJA', details: 'SUNDAY · 15 NOVEMBER 2026 · 9:00 AM', venue: 'AANGAN RESIDENCY · JAIPUR',
  },
  {
    category: 'sangeet-mehendi', label: 'Sangeet & Haldi', paletteOffset: 3,
    titles: ['Rang Raas Portrait', 'The Dhol Edit', 'Marigold Mehfil', 'Dance in the Courtyard', 'Saffron Spark', 'The Mehendi Glow', 'Genda After Dark', 'Dandiya Lights', 'Raat of Celebration'],
    photos: ['/images/photo-library/sangeet-garden-dance-01.webp', ...Array.from({ length: 8 }, (_, i) => `/images/photo-library/sangeet-${['mirror-mehendi-02', 'dhol-courtyard-03', 'haldi-sunlight-04', 'raas-terrace-05', 'genda-evening-06', 'family-sangeet-07', 'dance-lanterns-08', 'mehfil-jewel-tones-09'][i]}.webp`)],
    motif: 'bandhani', intro: 'A NIGHT OF MUSIC, COLOUR & CELEBRATION', names: 'Aarav & Meera', event: 'SANGEET & MEHENDI NIGHT', details: 'SATURDAY · 21 NOVEMBER 2026 · 7:30 PM', venue: 'THE MARIGOLD COURTYARD · JAIPUR',
  },
  {
    category: 'birthday', label: 'Birthday', paletteOffset: 4,
    titles: ['Confetti Portraits', 'Cake Table Story', 'Golden Candlelight', 'One More Wish', 'Birthday Garden Club', 'Starry Night Celebration', 'The Party Polaroid', 'Balloons & Blooms'],
    photos: ['/images/photo-library/birthday-garden-brunch-01.webp', ...Array.from({ length: 7 }, (_, i) => `/images/photo-library/birthday-${['carnival-02', 'cake-candles-03', 'poolside-party-04', 'studio-confetti-05', 'family-garden-06', 'balloon-evening-07', 'little-star-08'][i]}.webp`)],
    motif: 'balloon', intro: 'COME CELEBRATE A VERY SPECIAL DAY', names: 'Aarav Turns One', event: 'BIRTHDAY CELEBRATION', details: 'SATURDAY · 10 OCTOBER 2026 · 5:30 PM', venue: 'THE GARDEN PAVILION · MUMBAI',
  },
  {
    category: 'baby-shower', label: 'Godh Bharai', paletteOffset: 6,
    titles: ['Little Bloom Portrait', 'Cradle Blessings', 'Moon & Mogra', 'Peach Petal Story', 'A Little Light', 'The Nesting Album', 'Golden Cradle', 'Welcome Little One'],
    photos: Array.from({ length: 8 }, (_, i) => `/images/photo-library/godh-${['bloom-portrait-01', 'cradle-blessings-02', 'moon-mogra-03', 'peach-petal-04', 'little-light-05', 'nesting-album-06', 'golden-cradle-07', 'welcome-one-08'][i]}.webp`),
    motif: 'cradle', intro: 'WITH JOYFUL HEARTS & LOVING BLESSINGS', names: 'A Little One Is on the Way', event: 'GODH BHARAI CELEBRATION', details: 'SUNDAY · 21 FEBRUARY 2027 · 11:00 AM', venue: 'THE BLOSSOM GARDEN · JAIPUR',
  },
  {
    category: 'anniversary', label: 'Anniversary', paletteOffset: 8,
    titles: ['Pearl & Petals', 'A Lifetime in Light', 'The Ruby Album', 'Golden Vow Portrait', 'Still Us', 'The Silver Soirée', 'Evergreen Together'],
    photos: Array.from({ length: 7 }, (_, i) => `/images/photo-library/anniversary-${['pearl-petals-01', 'lifetime-light-02', 'ruby-album-03', 'golden-vows-04', 'still-us-05', 'silver-soiree-06', 'evergreen-together-07'][i]}.webp`),
    motif: 'rings', intro: 'A BEAUTIFUL STORY, STILL BEING WRITTEN', names: 'Vikram & Ananya', event: 'ANNIVERSARY CELEBRATION', details: 'SUNDAY · 21 FEBRUARY 2027 · 7:00 PM', venue: 'THE HERITAGE COURTYARD · JAIPUR',
  },
];

const colorfulCollections: Collection[] = colorfulCollectionSpecs.map(({ paletteOffset, ...collection }) => ({
  ...collection,
  palette: collection.titles.map((_, index) => colorStories[(index + paletteOffset) % colorStories.length]),
}));

const layouts: Layout[] = [
  { frames: [{ x: 158, y: 108, width: 184, height: 246, frameId: 'frame-01' }], text: { introY: 52, nameY: 384, eventY: 449, detailsY: 490, venueY: 562, nameSize: 38 } },
  { frames: [{ x: 58, y: 60, width: 384, height: 250, frameId: 'frame-12' }], text: { introY: 342, nameY: 377, eventY: 439, detailsY: 478, venueY: 547, nameSize: 38 } },
  { frames: [{ x: 62, y: 127, width: 166, height: 184, frameId: 'frame-05' }, { x: 272, y: 127, width: 166, height: 184, frameId: 'frame-04' }], text: { introY: 55, nameY: 355, eventY: 420, detailsY: 462, venueY: 540, nameSize: 35 } },
  { frames: [{ x: 45, y: 142, width: 205, height: 316, frameId: 'frame-02' }], text: { introY: 62, nameY: 206, eventY: 279, detailsY: 333, venueY: 528, nameSize: 31 } },
  { frames: [{ x: 58, y: 116, width: 176, height: 207, frameId: 'frame-11', rotation: -4 }, { x: 265, y: 142, width: 176, height: 207, frameId: 'frame-11', rotation: 4 }], text: { introY: 55, nameY: 386, eventY: 448, detailsY: 487, venueY: 557, nameSize: 35 } },
  { frames: [{ x: 164, y: 116, width: 172, height: 172, frameId: 'frame-04' }], text: { introY: 52, nameY: 318, eventY: 382, detailsY: 426, venueY: 521, nameSize: 39 } },
  { frames: [{ x: 48, y: 113, width: 124, height: 180, frameId: 'frame-12' }, { x: 188, y: 113, width: 124, height: 180, frameId: 'frame-12' }, { x: 328, y: 113, width: 124, height: 180, frameId: 'frame-12' }], text: { introY: 54, nameY: 336, eventY: 402, detailsY: 448, venueY: 535, nameSize: 36 } },
  { frames: [{ x: 63, y: 116, width: 160, height: 224, frameId: 'frame-13', rotation: -5 }, { x: 278, y: 152, width: 160, height: 224, frameId: 'frame-13', rotation: 5 }], text: { introY: 53, nameY: 403, eventY: 460, detailsY: 498, venueY: 567, nameSize: 34 } },
  { frames: [{ x: 76, y: 95, width: 348, height: 248, frameId: 'frame-14' }], text: { introY: 52, nameY: 385, eventY: 446, detailsY: 488, venueY: 557, nameSize: 38 } },
  { frames: [{ x: 63, y: 106, width: 164, height: 207, frameId: 'frame-01' }, { x: 273, y: 106, width: 164, height: 207, frameId: 'frame-01' }], text: { introY: 53, nameY: 354, eventY: 419, detailsY: 463, venueY: 543, nameSize: 35 } },
];

const colorfulLayouts: Layout[] = [
  { frames: [{ x: 159, y: 105, width: 182, height: 238, frameId: 'frame-14' }], text: { introY: 55, nameY: 365, eventY: 425, detailsY: 465, venueY: 535, nameSize: 39 } },
  { frames: [{ x: 56, y: 70, width: 388, height: 230, frameId: 'frame-11' }], text: { introY: 330, nameY: 369, eventY: 431, detailsY: 469, venueY: 538, nameSize: 37 } },
  { frames: [{ x: 55, y: 128, width: 172, height: 175, frameId: 'frame-05' }, { x: 273, y: 128, width: 172, height: 175, frameId: 'frame-04' }], text: { introY: 55, nameY: 337, eventY: 397, detailsY: 438, venueY: 510, nameSize: 36 } },
  { frames: [{ x: 44, y: 163, width: 202, height: 273, frameId: 'frame-02' }], text: { introY: 130, nameY: 198, eventY: 272, detailsY: 326, venueY: 399, nameSize: 29 } },
  { frames: [{ x: 54, y: 116, width: 174, height: 208, frameId: 'frame-12', rotation: -4 }, { x: 272, y: 116, width: 174, height: 208, frameId: 'frame-12', rotation: 4 }], text: { introY: 54, nameY: 365, eventY: 425, detailsY: 466, venueY: 536, nameSize: 36 } },
  { frames: [{ x: 166, y: 112, width: 168, height: 168, frameId: 'frame-04' }], text: { introY: 53, nameY: 311, eventY: 375, detailsY: 419, venueY: 505, nameSize: 40 } },
  { frames: [{ x: 38, y: 100, width: 132, height: 179, frameId: 'frame-12' }, { x: 184, y: 100, width: 132, height: 179, frameId: 'frame-12' }, { x: 330, y: 100, width: 132, height: 179, frameId: 'frame-12' }], text: { introY: 52, nameY: 321, eventY: 386, detailsY: 430, venueY: 512, nameSize: 36 } },
  { frames: [{ x: 68, y: 102, width: 364, height: 244, frameId: 'frame-03' }], text: { introY: 53, nameY: 386, eventY: 448, detailsY: 488, venueY: 555, nameSize: 38 } },
  { frames: [{ x: 113, y: 93, width: 274, height: 294, frameId: 'frame-01' }], text: { introY: 51, nameY: 414, eventY: 470, detailsY: 509, venueY: 571, nameSize: 38 } },
  { frames: [{ x: 76, y: 117, width: 151, height: 220, frameId: 'frame-14' }, { x: 273, y: 117, width: 151, height: 220, frameId: 'frame-13' }], text: { introY: 54, nameY: 376, eventY: 437, detailsY: 478, venueY: 546, nameSize: 36 } },
];

const thumbnailGradients = [
  'from-rose-100 via-pink-50 to-amber-100',
  'from-emerald-950 via-emerald-800 to-amber-700',
  'from-slate-950 via-blue-950 to-cyan-900',
  'from-lime-50 via-stone-100 to-amber-100',
  'from-violet-100 via-stone-50 to-rose-100',
  'from-amber-950 via-red-950 to-stone-950',
  'from-yellow-200 via-amber-100 to-orange-100',
  'from-orange-100 via-stone-100 to-rose-100',
  'from-sky-900 via-indigo-950 to-purple-950',
  'from-teal-100 via-emerald-50 to-amber-100',
];

const motifs: Record<string, string> = {
  lotus: '<path d="M250 83c-30 21-31 45 0 70 31-25 30-49 0-70Zm0 70c-38-7-57-29-52-59 27 8 43 25 52 59Zm0 0c38-7 57-29 52-59-27 8-43 25-52 59Z"/><path d="M196 169c31-15 77-15 108 0"/>',
  kalash: '<path d="M250 78c-17 22-12 37 0 41 12-4 17-19 0-41Zm-40 47h80m-70 0c4 20 13 36 30 46 17-10 26-26 30-46m-56 17h52m-44 18h36"/>',
  dhol: '<path d="M218 113h64l17 19v45l-17 19h-64l-17-19v-45l17-19Zm0 0v83m64-83v83m-81-61 81 39m-81 0 81-39"/>',
  stars: '<path d="m250 78 10 23 25 2-19 17 6 24-22-13-22 13 6-24-19-17 25-2 10-23Zm-77 81 5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1 5-12Zm154 0 5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1 5-12Z"/>',
  moon: '<path d="M264 82c-38 12-48 64-16 88 20 15 49 10 63-9-36 6-66-31-47-79Zm-16 99h-42m84 0h-42m-39-68 4 9 10 1-8 6 3 10-9-5-8 5 3-10-8-6 10-1 3-9Z"/>',
  infinity: '<path d="M250 134c-25-40-67-40-77-9-9 30 22 53 46 34l62-51c24-19 56 4 47 34-10 31-52 31-78-8Zm-91 67h182"/>',
  peacock: '<path d="M250 202c-38-22-52-62-34-104 8 33 20 52 34 57 14-5 26-24 34-57 18 42 4 82-34 104Zm0-17c-18-12-25-31-17-52 5 17 11 25 17 28 6-3 12-11 17-28 8 21 1 40-17 52Zm-58 20h116m-97 18h78"/>',
  diya: '<path d="M190 161q60 30 120 0l-16 38h-88l-16-38Zm60-80c20 23 17 39 0 49-17-10-20-26 0-49Zm-16 122v16m32-16v16m-57 0h82"/>',
  bandhani: '<path d="M250 78 270 98 250 118 230 98 250 78Zm-58 54 16 16-16 16-16-16 16-16Zm116 0 16 16-16 16-16-16 16-16Zm-58 54 16 16-16 16-16-16 16-16Zm-58 0 10 10-10 10-10-10 10-10Zm116 0 10 10-10 10-10-10 10-10Z"/>',
  balloon: '<path d="M210 135c0-31 18-53 40-53s40 22 40 53-18 51-40 51-40-20-40-51Zm40 51v20l-10 8m50-61c0-26 14-43 32-43s32 17 32 43-14 41-32 41-32-15-32-41Zm32 41v20l-8 7"/>',
  cradle: '<path d="M180 142h140c-4 43-30 70-70 70s-66-27-70-70Zm-9 0h158m-122 0v-27m36 27v-27m36 27v-27m-70 98h74m-47-127c0-18 12-29 25-29s25 11 25 29"/>',
  rings: '<circle cx="226" cy="143" r="42"/><circle cx="274" cy="143" r="42"/><path d="m226 101 9-14 13 11 13-11 13 14M184 201h132"/>',
};

function svgData(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function backgroundArtwork(collection: Collection, palette: Palette, index: number, eventY: number, colorful = false) {
  const motif = motifs[collection.motif];
  const categoryIndex = collections.findIndex((item) => item.category === collection.category);
  const inset = 20 + ((index + categoryIndex) % 3) * 4;
  const pattern = (index + categoryIndex * 2) % 4;
  const foilId = `foil-${colorful ? 'color' : 'classic'}-${collection.category}-${index}`;
  const colorWash = colorful
    ? `<path d="M0 0h500v34Q250 88 0 34Z" fill="${palette.soft}" fill-opacity=".2"/><path d="M0 666Q250 612 500 666v34H0Z" fill="${palette.soft}" fill-opacity=".18"/><circle cx="250" cy="350" r="190" fill="${palette.soft}" fill-opacity=".045"/>`
    : '';
  const cornerFlourish = `
    <g stroke-linecap="round" stroke-linejoin="round">
      <path d="M${inset + 3} 158 C${inset + 14} 111 34 79 100 48 C79 35 61 25 ${inset + 5} ${inset + 2}" fill="none" stroke="url(#${foilId})" stroke-width="2.1"/>
      <path d="M${inset + 12} 124 C39 109 46 88 48 75 C62 83 66 103 ${inset + 12} 124Z M${inset + 25} 98 C52 85 62 66 62 53 C77 64 78 83 ${inset + 25} 98Z M${inset + 42} 73 C70 60 79 45 78 33 C92 44 94 59 ${inset + 42} 73Z M${inset + 30} 112 C49 116 37 129 35 142 C23 131 24 117 ${inset + 30} 112Z" fill="${palette.soft}" fill-opacity=".4" stroke="${palette.soft}" stroke-opacity=".86" stroke-width="1.15"/>
      <path d="M${inset + 17} 142 C${inset + 39} 106 59 84 90 62 M${inset + 27} 119 C46 106 56 88 59 72 M${inset + 42} 96 C61 83 71 66 75 51" fill="none" stroke="url(#${foilId})" stroke-width=".9" opacity=".88"/>
      <g transform="translate(${inset + 79} ${inset + 39})" stroke="url(#${foilId})" stroke-width="1.15">
        <g fill="${palette.soft}" fill-opacity=".42"><ellipse cy="-8" rx="4.4" ry="8.2"/><ellipse cy="-8" rx="4.4" ry="8.2" transform="rotate(45)"/><ellipse cy="-8" rx="4.4" ry="8.2" transform="rotate(90)"/><ellipse cy="-8" rx="4.4" ry="8.2" transform="rotate(135)"/></g>
        <circle r="4" fill="${palette.gold}" fill-opacity=".92" stroke="${palette.background}" stroke-width=".8"/>
        <circle r="1.4" fill="${palette.background}" stroke="none"/>
      </g>
      <g transform="translate(${inset + 43} ${inset + 69}) scale(.58)" stroke="url(#${foilId})" stroke-width="1">
        <g fill="${palette.soft}" fill-opacity=".4"><ellipse cy="-8" rx="4.4" ry="8.2"/><ellipse cy="-8" rx="4.4" ry="8.2" transform="rotate(45)"/><ellipse cy="-8" rx="4.4" ry="8.2" transform="rotate(90)"/><ellipse cy="-8" rx="4.4" ry="8.2" transform="rotate(135)"/></g><circle r="3.2" fill="${palette.gold}" fill-opacity=".9" stroke="none"/>
      </g>
      <g fill="${palette.gold}" fill-opacity=".62"><circle cx="${inset + 95}" cy="${inset + 77}" r="1.6"/><circle cx="${inset + 102}" cy="${inset + 88}" r="1.1"/><circle cx="${inset + 64}" cy="${inset + 26}" r="1.4"/><circle cx="${inset + 33}" cy="${inset + 50}" r="1.2"/></g>
    </g>`;
  const mirroredFlourishes = [
    `<g>${cornerFlourish}</g>`,
    `<g transform="translate(500 0) scale(-1 1)">${cornerFlourish}</g>`,
    `<g transform="translate(0 700) scale(1 -1)">${cornerFlourish}</g>`,
    `<g transform="translate(500 700) scale(-1 -1)">${cornerFlourish}</g>`,
  ].join('');
  const dividerY = Math.min(642, eventY + 34);
  const dividerCenter = index === 3 ? 362 : 250;
  const dividerHalf = index === 3 ? 42 : 67;
  const titleDivider = `<g fill="none" stroke="url(#${foilId})" stroke-linecap="round" stroke-linejoin="round" opacity=".96">
    <path d="M${dividerCenter-dividerHalf} ${dividerY}h${dividerHalf-12} M${dividerCenter+12} ${dividerY}h${dividerHalf-12}" stroke-width="1.7"/>
    <path d="M${dividerCenter} ${dividerY-6}l6 6-6 6-6-6 6-6Z M${dividerCenter-9} ${dividerY}l3 3 3-3-3-3-3 3Z M${dividerCenter+9} ${dividerY}l3 3 3-3-3-3-3 3Z" stroke-width="1.35"/>
    <circle cx="${dividerCenter-dividerHalf}" cy="${dividerY}" r="1.5" fill="${palette.gold}"/><circle cx="${dividerCenter+dividerHalf}" cy="${dividerY}" r="1.5" fill="${palette.gold}"/>
  </g>`;
  const ornament = pattern === 0
    ? `<path d="M${inset} 120 Q${inset} ${inset} 120 ${inset} M380 ${inset} Q${500-inset} ${inset} ${500-inset} 120 M${inset} 580 Q${inset} ${700-inset} 120 ${700-inset} M380 ${700-inset} Q${500-inset} ${700-inset} ${500-inset} 580"/>`
    : pattern === 1
      ? `<path d="M${inset} ${inset+20}h84m248 0h84M${inset} ${680-inset}h84m248 0h84"/><circle cx="250" cy="${inset+24}" r="9"/><circle cx="250" cy="${676-inset}" r="9"/>`
      : pattern === 2
        ? `<path d="M${inset} 180V${inset}h115M${500-inset} 180V${inset}H385M${inset} 520v${700-inset-520}h115M${500-inset} 520v${700-inset-520}H385"/><path d="M${inset+10} 190v${700-inset-200}M${500-inset-10} 190v${700-inset-200}" opacity=".35"/>`
        : `<path d="M${inset} ${inset+38} Q250 ${inset-18} ${500-inset} ${inset+38} M${inset} ${662-inset} Q250 ${718-inset} ${500-inset} ${662-inset}"/><circle cx="${inset+15}" cy="350" r="3"/><circle cx="${500-inset-15}" cy="350" r="3"/>`;
  return svgData(`<svg xmlns="http://www.w3.org/2000/svg" width="500" height="700" viewBox="0 0 500 700">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.background}"/><stop offset=".48" stop-color="${colorful ? palette.soft : palette.background}" stop-opacity="${colorful ? '.22' : '1'}"/><stop offset="1" stop-color="${palette.background}" stop-opacity=".96"/></linearGradient>
      <linearGradient id="${foilId}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${palette.gold}" stop-opacity=".55"/><stop offset=".32" stop-color="#fff4d2" stop-opacity=".92"/><stop offset=".56" stop-color="${palette.gold}"/><stop offset="1" stop-color="${palette.gold}" stop-opacity=".68"/></linearGradient>
      <radialGradient id="wash"><stop stop-color="${palette.gold}" stop-opacity=".13"/><stop offset="1" stop-color="${palette.gold}" stop-opacity="0"/></radialGradient>
      <pattern id="paper" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 1.5h1M4 5.5h1" stroke="${palette.soft}" stroke-opacity=".08" stroke-width=".45"/><circle cx="5.5" cy="2" r=".35" fill="${palette.gold}" fill-opacity=".16"/></pattern>
    </defs>
    <rect width="500" height="700" fill="url(#bg)"/>${colorWash}<rect width="500" height="700" fill="url(#paper)"/>
    <ellipse cx="250" cy="310" rx="270" ry="260" fill="url(#wash)"/>
    <g fill="none" stroke="url(#${foilId})" stroke-linejoin="round">
      <rect x="8" y="8" width="484" height="684" rx="5" stroke-width="5" opacity=".26"/>
      <rect x="${inset}" y="${inset}" width="${500-inset*2}" height="${700-inset*2}" rx="4" stroke-width="1.45" opacity=".95"/>
      <rect x="${inset+7}" y="${inset+7}" width="${500-inset*2-14}" height="${700-inset*2-14}" rx="3" stroke-width=".8" opacity=".72"/>
      <path d="M${inset+4} ${inset+88}V${inset+22}Q${inset+4} ${inset+4} ${inset+22} ${inset+4}h66 M${500-inset-4} ${inset+88}V${inset+22}Q${500-inset-4} ${inset+4} ${500-inset-22} ${inset+4}h-66 M${inset+4} ${700-inset-88}v66q0 18 18 18h66 M${500-inset-4} ${700-inset-88}v66q0 18-18 18h-66" stroke-width="1.25" opacity=".8"/>
      ${ornament}
    </g>
    <g opacity=".92">${mirroredFlourishes}</g>
    ${titleDivider}
    <g fill="none" stroke="${palette.gold}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity=".52">${motif}</g>
    <g fill="${palette.gold}" opacity=".78"><circle cx="${inset+2}" cy="${inset+2}" r="3"/><circle cx="${500-inset-2}" cy="${inset+2}" r="3"/><circle cx="${inset+2}" cy="${700-inset-2}" r="3"/><circle cx="${500-inset-2}" cy="${700-inset-2}" r="3"/></g>
  </svg>`);
}

function textElement(id: string, text: string, x: number, y: number, width: number, height: number, size: number, color: string, font: string, weight: TextElement['fontWeight'] = 'normal', spacing = 0): TextElement {
  return { id, type: 'text', text, fontFamily: font, fontSize: size, color, fontWeight: weight, fontStyle: 'normal', textAlign: 'center', letterSpacing: spacing, lineHeight: 1.16, x, y, width, height, rotation: 0, opacity: 1, zIndex: 5 };
}

function createFramedTemplate(collection: Collection, index: number, colorful = false): CardTemplate {
  const name = collection.titles[index];
  const id = `${colorful ? 'colorful-framed' : 'framed'}-${collection.category}-${index + 1}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
  const palette = colorful ? collection.palette[index] : index % 2 === 1 ? coloredPalettes[collection.category][Math.floor(index / 2)] : collection.palette[index];
  const layout = colorful ? colorfulLayouts[index] : layouts[index];
  const ink = ensureTextContrast(palette.ink, palette.background);
  const gold = ensureTextContrast(palette.gold, palette.background);
  const frameById = new Map(FRAMES_LIBRARY_ITEMS.map((frame) => [frame.id, frame]));
  const elements: CardTemplate['pages'][number]['elements'] = [
    {
      id: `${id}-artwork`, type: 'image', src: backgroundArtwork(collection, palette, index, layout.text.eventY, colorful), alt: `${name} ornamental invitation background`,
      mask: 'none', x: 0, y: 0, width: 500, height: 700, rotation: 0, opacity: 1, zIndex: 1, objectFit: 'cover', locked: true,
    } as ImageElement,
  ];

  layout.frames.forEach((slot, frameIndex) => {
    const frameId = colorful ? colorfulCategoryFrameStyles[collection.category][index] : categoryFrameStyles[collection.category][index];
    const definition = frameById.get(frameId) || frameById.get(slot.frameId) || frameById.get('frame-01')!;
    const frame: FrameElement = {
      id: `${id}-photo-${frameIndex + 1}`, type: 'frame', frameId: definition.id, frameName: definition.name,
      clipPathSvg: definition.clipPathSvg, borderSvg: definition.borderSvg,
      imageSrc: collection.photos[(index + frameIndex) % collection.photos.length], imageScale: 1, imageOffsetX: 0, imageOffsetY: 0,
      naturalImageFit: true,
      borderColor: palette.gold, borderWidth: 2.5, placeholderColor: palette.background,
      x: slot.x, y: slot.y, width: slot.width, height: slot.height, rotation: slot.rotation || 0, opacity: 1, zIndex: 3 + frameIndex,
    };
    elements.push(frame);
  });

  const l = layout.text;
  const split = index === 3;
  const x = split ? 265 : 45;
  const width = split ? 195 : 410;
  const centered = !split;
  elements.push(
    textElement(`${id}-intro`, collection.intro, x, l.introY, width, 28, 10, gold, "'Montserrat', sans-serif", '600', 1.3),
    textElement(`${id}-names`, collection.names, x, l.nameY, width, 58, l.nameSize || 36, ink, collection.category === 'wedding' || collection.category === 'anniversary' ? "'Great Vibes', cursive" : "'Cormorant Garamond', serif", '600'),
    textElement(`${id}-event`, collection.event, x, l.eventY, width, 30, 12, gold, "'Cinzel', serif", '700', 1.4),
    textElement(`${id}-details`, collection.details, x, l.detailsY, width, 36, 10, ink, "'Montserrat', sans-serif", '600', .55),
    textElement(`${id}-venue`, collection.venue, x, l.venueY, width, 30, 9, gold, "'Cinzel', serif", '600', .8),
  );
  if (centered) {
    const footerY = Math.min(622, l.venueY + 38);
    elements.push(textElement(`${id}-footer`, collection.category === 'wedding' ? 'WE LOOK FORWARD TO CELEBRATING WITH YOU' : 'WITH LOVE & BLESSINGS', 48, footerY, 404, 24, 8, ink, "'Montserrat', sans-serif", '500', 1));
  }

  return {
    id,
    title: `${name} ${collection.label} Photo Frame Invitation`,
    category: collection.category,
    aspectRatio: 'portrait-classic',
    tags: [collection.label, 'Photo frame', 'Single-page', 'Editable photo', name],
    thumbnailGradient: colorful
      ? ['from-rose-950 via-fuchsia-900 to-amber-600', 'from-emerald-950 via-teal-800 to-amber-500', 'from-indigo-950 via-blue-900 to-sky-500', 'from-orange-950 via-red-800 to-amber-500', 'from-violet-950 via-purple-800 to-pink-500', 'from-rose-100 via-orange-100 to-amber-200', 'from-indigo-100 via-violet-100 to-sky-200', 'from-emerald-100 via-teal-100 to-lime-100', 'from-orange-100 via-rose-100 to-amber-200', 'from-sky-100 via-cyan-100 to-blue-200'][index]
      : thumbnailGradients[index],
    pages: [{ id: `${id}-page`, title: `${name} Invitation`, backgroundType: 'color', backgroundValue: palette.background, elements }],
  };
}

export const FRAMED_CELEBRATION_TEMPLATES: CardTemplate[] = collections.flatMap((collection) =>
  collection.titles.map((_, index) => createFramedTemplate(collection, index)),
).concat(colorfulCollections.flatMap((collection) =>
  collection.titles.map((_, index) => createFramedTemplate(collection, index, true)),
));
