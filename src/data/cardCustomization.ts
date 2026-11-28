import { InviteTheme, STUDIO_THEMES } from './studioData';
import {
  BABY_BIRTHDAY_CEREMONIES,
  BIRTHDAY_CEREMONIES,
  CEREMONIES,
  COUPLE_DEFAULTS,
  CeremonyItem,
  HINDU_BIRTHDAY_CEREMONIES,
  HINDU_BOY_BIRTHDAY_CEREMONIES,
  HINDU_GIRL_BIRTHDAY_CEREMONIES,
  PAITHANI_CEREMONIES,
  HERO_COURTYARD_IMAGE,
  HAVELI_DOORS_IMAGE,
  GENDA_COURTYARD_OPEN_IMAGE,
  ROSHNI_MANDAP_OPEN_IMAGE,
  TEMPLE_SANCTUM_OPEN_IMAGE,
  GULAB_GARDEN_OPEN_IMAGE,
  PAITHANI_COURTYARD_OPEN_IMAGE,
  BIRTHDAY_CAKE_LIT_IMAGE,
  BIRTHDAY_SOIREE_OPEN_IMAGE,
  BIRTHDAY_GARDEN_OPEN_IMAGE,
  INDIAN_BABY_COURTYARD_OPEN_IMAGE,
  SHUBH_AARTI_OPEN_IMAGE,
  LADLI_KANYA_OPEN_IMAGE,
  KANHA_MAKHAN_OPEN_IMAGE,
  KOHINOOR_OPEN_IMAGE,
  VRINDAVAN_OPEN_IMAGE,
  KESARIYA_OPEN_IMAGE,
  PATTU_MANDAP_OPEN_IMAGE,
  MEHR_OPEN_IMAGE,
  KALGI_OPEN_IMAGE,
  SAGE_BUNNY_OPEN_IMAGE,
  BURGUNDY_PAISLEY_OPEN_IMAGE,
  MAROON_RAJHANS_OPEN_IMAGE,
  PURPLE_FILIGREE_OPEN_IMAGE,
  NAVY_SILVER_OPEN_IMAGE,
} from './weddingData';

export type CardSectionKey =
  | 'note'
  | 'scratch'
  | 'formal'
  | 'timeline'
  | 'countdown'
  | 'map'
  | 'swatches'
  | 'elders'
  | 'song'
  | 'rsvp';

export interface CustomEventItem {
  id: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  dateEn: string;
  dateHi: string;
  time: string;
  venueEn: string;
  venueHi: string;
  attireEn: string;
  attireHi: string;
  accentHex: string;
  image: string;
  imageAlt: string;
  swatchColors: string[];
}

export type CardLanguageMode = 'both' | 'en' | 'hi';

export interface CardCustomization {
  themeId: string;
  primaryName: string;
  primaryNameHi?: string;
  partnerName: string;
  partnerNameHi?: string;
  milestoneLabel: string;
  milestoneLabelHi?: string;
  dateLabel: string;
  dateLabelHi?: string;
  targetIsoDate: string;
  cityLabel: string;
  cityLabelHi?: string;
  venueName: string;
  venueNameHi?: string;
  venueMapUrl?: string;
  directionsNote: string;
  directionsNoteHi?: string;
  personalNoteEn: string;
  personalNoteHi: string;
  parentsBlessingEn: string;
  parentsBlessingHi: string;
  groomParentsEn?: string;
  groomParentsHi?: string;
  brideParentsEn?: string;
  brideParentsHi?: string;
  weddingHashtag?: string;
  littleOnesLineEn?: string;
  littleOnesLineHi?: string;
  littleOnesNamesEn?: string;
  littleOnesNamesHi?: string;
  couplePhotoUrl?: string;
  songTitle: string;
  songAudioKey?: string;
  songUrl?: string;
  songFileName?: string;
  songPresetId?: 'default' | 'shehnai' | 'bansuri' | 'dholak' | 'temple' | 'lullaby';
  customCoverImage?: string;
  rsvpDeadline: string;
  rsvpDeadlineHi?: string;
  rsvpWhatsapp: string;
  shagunUpi?: string;
  familySide?: 'groom-first' | 'bride-first';
  cardLangMode?: CardLanguageMode;
  editorInputLang?: 'en' | 'hi';
  enabledSections: Record<CardSectionKey, boolean>;
  events: CustomEventItem[];
  updatedAt?: number;
}

export const SECTION_META: {
  key: CardSectionKey;
  label: string;
  labelHi: string;
  description: string;
}[] = [
  {
    key: 'note',
    label: 'Welcome Note & Quote',
    labelHi: 'स्वागत संदेश',
    description: 'Opening invitation prose & poetic blessing line',
  },
  {
    key: 'scratch',
    label: 'Gold Foil Scratch Date',
    labelHi: 'स्क्रैच तारीख कार्ड',
    description: 'Interactive coin/finger scratch-to-reveal date card',
  },
  {
    key: 'formal',
    label: 'Formal Arch / Monogram',
    labelHi: 'औपचारिक निमंत्रण पत्र',
    description: 'Traditional crest card with names, dates & city',
  },
  {
    key: 'timeline',
    label: 'Events & Functions List',
    labelHi: 'कार्यक्रम समय-सारणी',
    description: 'Ceremony photos, timings, venues & Add to Calendar (.ics)',
  },
  {
    key: 'countdown',
    label: 'Live Countdown Timer',
    labelHi: 'लाइव काउंटडाउन घड़ी',
    description: 'Days, hours, minutes & seconds ticking to your date',
  },
  {
    key: 'swatches',
    label: 'Wardrobe / Dress Palette',
    labelHi: 'परिधान रंग गाइड',
    description: 'Color swatches & dress code hints for each function',
  },
  {
    key: 'map',
    label: 'Venue & Travel Directions',
    labelHi: 'स्थल व मार्ग निर्देश',
    description: 'Address card, airport/landmark directions & Google Maps',
  },
  {
    key: 'elders',
    label: 'Family & Elders Blessings',
    labelHi: 'माता-पिता व बड़ों का आशीर्वाद',
    description: 'Parents, grandparents & host family blessing block',
  },
  {
    key: 'song',
    label: 'Ambient Music Player',
    labelHi: 'संगीत प्लेयर',
    description: 'Play/pause ceremonial chime & track banner',
  },
  {
    key: 'rsvp',
    label: 'Interactive Guest RSVP',
    labelHi: 'अतिथि RSVP फ़ॉर्म',
    description: 'Guest headcount, event selector & WhatsApp reply button',
  },
];

export const CURATED_EVENT_PHOTOS: { label: string; src: string }[] = [
  { label: 'Dusk Courtyard', src: HERO_COURTYARD_IMAGE },
  { label: 'Haveli Doors', src: HAVELI_DOORS_IMAGE },
  { label: 'Marigold Haldi', src: GENDA_COURTYARD_OPEN_IMAGE },
  { label: 'Paithani Wada', src: PAITHANI_COURTYARD_OPEN_IMAGE },
  { label: 'Jasmine Mandap', src: ROSHNI_MANDAP_OPEN_IMAGE },
  { label: 'Temple Sanctum', src: TEMPLE_SANCTUM_OPEN_IMAGE },
  { label: 'Rose Fountain', src: GULAB_GARDEN_OPEN_IMAGE },
  { label: 'Candle Cake', src: BIRTHDAY_CAKE_LIT_IMAGE },
  { label: 'Soiree Table', src: BIRTHDAY_SOIREE_OPEN_IMAGE },
  { label: 'Garden Party', src: BIRTHDAY_GARDEN_OPEN_IMAGE },
  { label: 'Baby Palna', src: INDIAN_BABY_COURTYARD_OPEN_IMAGE },
  { label: 'Mandir Aarti', src: SHUBH_AARTI_OPEN_IMAGE },
  { label: 'Lotus Jhula', src: LADLI_KANYA_OPEN_IMAGE },
  { label: 'Kanha Courtyard', src: KANHA_MAKHAN_OPEN_IMAGE },
  { label: 'Kohinoor Darbar', src: KOHINOOR_OPEN_IMAGE },
  { label: 'Vrindavan Mandir', src: VRINDAVAN_OPEN_IMAGE },
  { label: 'Jaipur Terrace', src: KESARIYA_OPEN_IMAGE },
  { label: 'Pattu Mandapam', src: PATTU_MANDAP_OPEN_IMAGE },
  { label: 'Mehr Charbagh', src: MEHR_OPEN_IMAGE },
  { label: 'Kalgi Sarovar', src: KALGI_OPEN_IMAGE },
  { label: 'Sage Garden Birthday', src: SAGE_BUNNY_OPEN_IMAGE },
  { label: 'Burgundy Paisley Darbar', src: BURGUNDY_PAISLEY_OPEN_IMAGE },
  { label: 'Maroon Rajhans Mandap', src: MAROON_RAJHANS_OPEN_IMAGE },
  { label: 'Purple Filigree Palace', src: PURPLE_FILIGREE_OPEN_IMAGE },
  { label: 'Navy Silver Sangeet', src: NAVY_SILVER_OPEN_IMAGE },
];

export function getBaseCeremoniesForTheme(theme: InviteTheme): CeremonyItem[] {
  const isBirthday = theme.celebrationType === 'birthday';
  const isBabyBirthday = theme.birthdayFlavor === 'baby';
  const isHinduBirthday = theme.birthdayFlavor === 'hindu';
  const isGirlHindu = isHinduBirthday && theme.birthdayGender === 'girl';
  const isBoyHindu = isHinduBirthday && theme.birthdayGender === 'boy';

  if (isGirlHindu) return HINDU_GIRL_BIRTHDAY_CEREMONIES;
  if (isBoyHindu) return HINDU_BOY_BIRTHDAY_CEREMONIES;
  if (isHinduBirthday) return HINDU_BIRTHDAY_CEREMONIES;
  if (isBabyBirthday) return BABY_BIRTHDAY_CEREMONIES;
  if (isBirthday) return BIRTHDAY_CEREMONIES;
  if (theme.id === 'paithani') return PAITHANI_CEREMONIES;
  return CEREMONIES;
}

function defaultSwatchForIndex(idx: number, accentHex: string): string[] {
  const palettes = [
    ['#E8891C', '#F2B705', '#FAF0DE'],
    ['#1E563B', '#4B8B5E', '#D4A84B'],
    ['#1D2347', '#C2933F', '#B3261E'],
    ['#B3261E', '#D4A84B', '#EFDEBF'],
  ];
  return palettes[idx % palettes.length] || [accentHex, '#C88A2B', '#FAF6EE'];
}

function getDefaultNote(theme: InviteTheme): { en: string; hi: string } {
  if (theme.id === 'paithani') {
    return {
      en: 'As Mangalashtak chants rise and white mogra & akshata shower across the wada courtyard, our families welcome your blessings on our Goraj Muhurat.',
      hi: 'मंगलाष्टक के मधुर स्वर और मोगरा-अक्षता की पावन वर्षा के बीच, पैठणी मंडप में वर-वधू को शुभाशीष देने हेतु सपरिवार पधारें।',
    };
  }
  if (theme.id === 'kohinoor') {
    return {
      en: 'Beneath crystal chandeliers and candlelit Mewar arches, our families warmly invite you to witness royal heritage vows and celebrations in Udaipur.',
      hi: 'दीपों की सुनहरी आभा और मेवाड़ के राजसी झरोखों तले, हमारे परिवार सस्नेह आपको इस पावन परिणय उत्सव में आमंत्रित करते हैं।',
    };
  }
  if (theme.id === 'vrindavan') {
    return {
      en: 'With Shri Krishnah Sharanam Mama and fragrant mogra garlands gracing the temple courtyard, come bless our union with love and devotional joy.',
      hi: 'श्री कृष्णः शरणं मम के पावन आशीर्वाद एवं मोगरे की सुगंध के मध्य, वृंदावन आँगन में नवदंपति को शुभाशीष देने सपरिवार पधारें।',
    };
  }
  if (theme.id === 'kesariya') {
    return {
      en: 'To the festive beat of Marwari dholak, vibrant bandhani drapes, and marigold showers over Jaipur terraces, celebrate three joyful days with us.',
      hi: 'केसरिया साफे, ढोलक की मंगल थाप और गेंदे की सुगंधित वर्षा के संग जयपुर के आँगन में आपका सपरिवार हार्दिक स्वागत है।',
    };
  }
  if (theme.id === 'pattu-zari') {
    return {
      en: 'Adorned with handwoven Kanjeevaram silk, fresh jasmine malli, and sacred Vedic chants beside temple lamps, we seek your warm blessings on our Muhurtham.',
      hi: 'कांजीवरम रेशम, ताज़े मोगरे के गजरे और मंदिर के पावन दीपों की साक्षी में, शुभ मुहूर्त पर आपका स्नेहिल आशीर्वाद प्रार्थनीय है।',
    };
  }
  if (theme.id === 'mehr') {
    return {
      en: 'With gratitude and grace under carved marble arches and fragrant mogra lanterns, our families request the honour of your presence and duas as we begin our journey together.',
      hi: 'संगमरमर के झरोखों और मोगरे की महक के बीच, हमारे परिवार आपकी गरिमामयी उपस्थिति और दुआओं की सस्नेह कामना करते हैं।',
    };
  }
  if (theme.id === 'kalgi') {
    return {
      en: 'In the serene golden light of the morning sarovar and sacred hymns of Anand Karaj, our families warmly invite you to bless our union.',
      hi: 'पावन सरोवर की सुनहरी आभा और आनंद कारज के शुभ शबद के मध्य, नव-दंपति को आशीर्वाद देने हेतु सपरिवार सादर पधारें।',
    };
  }
  if (theme.id === 'shahi-badami') {
    return {
      en: 'As the golden crown wax seal breaks upon crimson Kashmiri paisley velvet, our families warmly invite you into our candlelit Mewar darbar for three days of royal celebrations.',
      hi: 'स्वर्ण मुकुट की शाही मुहर खुलते ही, कश्मीरी बादामी मखमल और दीपों से सजे मेवाड़ दरबार में हमारे परिवार आपका सपरिवार हार्दिक स्वागत करते हैं।',
    };
  }
  if (theme.id === 'van-upvan') {
    return {
      en: 'Unseal the golden bunny emblem and step into our sunlit sage-green botanical garden for an unforgettable birthday feast filled with wildflowers, cake, and acoustic music.',
      hi: 'सुनहरी मुहर खोलकर हमारे हरे-भरे उपवन में पधारें—जहाँ फूलों, केक, मधुर संगीत और आत्मीय मित्रों के साथ जन्मदिन का आनंदमय उत्सव सजा है।',
    };
  }
  if (theme.id === 'sindoori-rajhans') {
    return {
      en: 'With the blessings of Lord Ganesha and the golden Rajhans seal, our families invite you to witness sacred Vedic vows beneath a lotus-draped maroon silk mandap.',
      hi: 'श्री गणेशजी के आशीर्वाद और स्वर्ण राजहंस मुहर की साक्षी में, कमल व सिंदूरी रेशम से सजे पावन मंडप में वर-वधू को आशीर्वाद देने सपरिवार पधारें।',
    };
  }
  if (theme.id === 'rajsi-baingani') {
    return {
      en: 'Beneath crystal chandeliers and imperial mulberry-gold arches, our families request the honour of your presence and blessings as we celebrate our royal union.',
      hi: 'राजसी बैंगनी और स्वर्ण नक्काशीदार महल के झूमरों तले, हमारे पावन परिणय उत्सव में आपकी गरिमामयी उपस्थिति और आशीर्वाद सादर प्रार्थनीय है।',
    };
  }
  if (theme.id === 'neel-chandani') {
    return {
      en: 'Under a canopy of midnight stars and silver lanterns reflecting across Lake Pichola, join us for an enchanting evening of Sangeet melodies, vows, and celebration.',
      hi: 'नील गगन के तारों और चाँदी की झिलमिल लालटेनों की छाँव में, झील किनारे सजे इस पावन परिणय एवं संगीत उत्सव में सपरिवार पधारें।',
    };
  }
  if (theme.celebrationType === 'birthday') {
    if (theme.birthdayFlavor === 'baby') {
      return {
        en: 'Twelve months of tiny giggles, first steps, and endless blessings—join our courtyard for Tilak-Aarti and Baby’s very first birthday cake!',
        hi: 'नन्हे कदमों, मीठी किलकारियों और परिवार के आशीर्वाद से भरे प्रथम जन्मोत्सव में सपरिवार सादर पधारें।',
      };
    }
    if (theme.birthdayFlavor === 'hindu') {
      return {
        en: 'With Ganesh Vandana, Tilak-Aarti, and elders’ blessings, our family warmly welcomes you to celebrate this auspicious Janmotsav.',
        hi: 'श्री गणेश वंदना, तिलक-आरती और बड़ों के आशीर्वाद सहित शुभ जन्मोत्सव में सपरिवार सादर पधारें।',
      };
    }
    return {
      en: 'Raise a glass under warm lights as we celebrate with music, birthday cake, and the people who make every chapter unforgettable.',
      hi: 'मधुर संगीत, केक और आत्मीय मित्रों संग जन्मदिन की इस अविस्मरणीय संध्या में पधारें।',
    };
  }
  return {
    en: 'With hearts full of gratitude and joy, our families welcome you for days of rituals, folk music, and sacred celebrations.',
    hi: 'सपरिवार स्नेह और कृतज्ञता के साथ, इस पावन मांगलिक उत्सव में आपका हार्दिक स्वागत है।',
  };
}

function getDefaultSongTitle(theme: InviteTheme): string {
  if (theme.id === 'paithani') return 'Sanai Choughada & Mangalashtak Chime';
  if (theme.id === 'kohinoor') return 'Royal Darbar Shehnai & Santoor Chime';
  if (theme.id === 'vrindavan') return 'Vrindavan Bansuri & Temple Bell Chime';
  if (theme.id === 'kesariya') return 'Kesariya Balam Folk Sarangi Chime';
  if (theme.id === 'pattu-zari') return 'Kanjeevaram Nadaswaram & Veena Chime';
  if (theme.id === 'mehr') return 'Charbagh Santoor & Rabab Serenade';
  if (theme.id === 'kalgi') return 'Golden Sarovar Dilruba & Sitar Chime';
  if (theme.id === 'shahi-badami') return 'Shahi Darbar Shehnai & Santoor Chime';
  if (theme.id === 'van-upvan') return 'Botanical Garden Harp & Birthday Chime';
  if (theme.id === 'sindoori-rajhans') return 'Rajhans Mandir Veena & Bell Chime';
  if (theme.id === 'rajsi-baingani') return 'Imperial Jodhpur Sarod & Shehnai Chime';
  if (theme.id === 'neel-chandani') return 'Moonlit Sangeet Sitar & Flute Chime';
  if (theme.id === 'temple') return 'Nadaswaram & Temple Bell Chime';
  if (theme.id === 'gulab') return 'Kashmiri Santoor & Sarangi';
  if (theme.id === 'mehndi-jhoola') return 'Jaipur Dholak & Folk Song Chime';
  if (theme.birthdayGender === 'girl') return 'Payal Ghungroo & Santoor Janmotsav Chime';
  if (theme.birthdayFlavor === 'hindu') return 'Bansuri & Temple Bell Aarti Chime';
  if (theme.birthdayFlavor === 'baby') return 'Santoor & Ghungroo Happy Birthday Lullaby';
  if (theme.celebrationType === 'birthday') return 'Happy Birthday Acoustic Vinyl Chime';
  return 'Mewar Shehnai & Santoor Chime';
}

export function getDefaultCustomization(
  theme: InviteTheme,
  globalGroom = COUPLE_DEFAULTS.groomEn,
  globalBride = COUPLE_DEFAULTS.brideEn
): CardCustomization {
  const isBirthday = theme.celebrationType === 'birthday';
  const isGirlHindu = theme.birthdayFlavor === 'hindu' && theme.birthdayGender === 'girl';
  const isBaby = theme.birthdayFlavor === 'baby';
  const isHindu = theme.birthdayFlavor === 'hindu';

  const baseCeremonies = getBaseCeremoniesForTheme(theme);
  const note = getDefaultNote(theme);

  const primaryName = isGirlHindu
    ? globalBride || COUPLE_DEFAULTS.brideEn
    : globalGroom || COUPLE_DEFAULTS.groomEn;
  const partnerName = isBirthday ? '' : globalBride || COUPLE_DEFAULTS.brideEn;

  const milestoneLabel = isBaby
    ? '1st Birthday'
    : isHindu
      ? 'Shubh Janmotsav'
      : isBirthday
        ? '25th Birthday'
        : '';

  const dateLabel = isBirthday ? 'Sunday, 28 February 2027' : COUPLE_DEFAULTS.weddingDates.en;

  const enabledSections: Record<CardSectionKey, boolean> = {
    note: true,
    scratch: true,
    formal: !isBirthday,
    timeline: true,
    countdown: true,
    map: true,
    swatches: !isBaby && !isHindu,
    elders: true,
    song: true,
    rsvp: true,
  };

  const primaryNameHi =
    primaryName === COUPLE_DEFAULTS.groomEn
      ? COUPLE_DEFAULTS.groomHi
      : primaryName === COUPLE_DEFAULTS.brideEn
        ? COUPLE_DEFAULTS.brideHi
        : primaryName;
  const partnerNameHi = isBirthday
    ? ''
    : partnerName === COUPLE_DEFAULTS.brideEn
      ? COUPLE_DEFAULTS.brideHi
      : partnerName === COUPLE_DEFAULTS.groomEn
        ? COUPLE_DEFAULTS.groomHi
        : partnerName;
  const milestoneLabelHi = isBaby
    ? 'प्रथम जन्मदिन'
    : isHindu
      ? 'शुभ जन्मोत्सव'
      : isBirthday
        ? '25वाँ जन्मदिन'
        : '';
  const dateLabelHi = isBirthday ? 'रविवार, 28 फ़रवरी 2027' : COUPLE_DEFAULTS.weddingDates.hi;

  return {
    themeId: theme.id,
    primaryName,
    primaryNameHi,
    partnerName,
    partnerNameHi,
    milestoneLabel,
    milestoneLabelHi,
    dateLabel,
    dateLabelHi,
    targetIsoDate: isBirthday ? '2027-02-28T17:30' : '2027-02-12T16:30',
    cityLabel: COUPLE_DEFAULTS.city.en,
    cityLabelHi: COUPLE_DEFAULTS.city.hi,
    venueName: isBirthday ? 'Kamal Heritage Courtyard, Udaipur' : COUPLE_DEFAULTS.palaceName.en,
    venueNameHi: isBirthday ? 'कमल हेरिटेज प्रांगण, उदयपुर' : COUPLE_DEFAULTS.palaceName.hi,
    venueMapUrl: '',
    directionsNote: isBirthday
      ? 'Valet parking available at Main Courtyard Gate. 30 mins from Udaipur Airport.'
      : 'Maharana Pratap Airport (UDR), 35 mins by dedicated palace shuttle.',
    directionsNoteHi: isBirthday
      ? 'मुख्य प्रांगण द्वार पर वैलेट पार्किंग उपलब्ध। उदयपुर हवाई अड्डे से 30 मिनट।'
      : 'महाराणा प्रताप हवाई अड्डा (UDR), विशेष हवेली शटल द्वारा 35 मिनट।',
    personalNoteEn: note.en,
    personalNoteHi: note.hi,
    parentsBlessingEn: isBirthday
      ? 'With warm blessings from Dada-Dadi, Nana-Nani, Parents & Family Elders'
      : COUPLE_DEFAULTS.parentsLine.en,
    parentsBlessingHi: isBirthday
      ? 'दादा-दादी, नाना-नानी एवं समस्त परिवारजनों के स्नेहिल आशीर्वाद सहित'
      : COUPLE_DEFAULTS.parentsLine.hi,
    groomParentsEn: isBirthday
      ? isHindu || isBaby
        ? 'Vikramaditya & Gayatri Singhania'
        : ''
      : COUPLE_DEFAULTS.groomParents.en,
    groomParentsHi: isBirthday
      ? isHindu || isBaby
        ? 'श्री विक्रमादित्य एवं श्रीमती गायत्री सिंघानिया'
        : ''
      : COUPLE_DEFAULTS.groomParents.hi,
    brideParentsEn: isBirthday
      ? isHindu || isBaby
        ? 'Rajendra & Vasundhara Singhania'
        : ''
      : COUPLE_DEFAULTS.brideParents.en,
    brideParentsHi: isBirthday
      ? isHindu || isBaby
        ? 'श्री राजेंद्र एवं श्रीमती वसुंधरा सिंघानिया'
        : ''
      : COUPLE_DEFAULTS.brideParents.hi,
    littleOnesLineEn: isBirthday
      ? '“Mele Bhaiya/Didi ke Birthday mein jalool-jalool aana!”'
      : COUPLE_DEFAULTS.littleOnesLine.en,
    littleOnesLineHi: isBirthday
      ? '“मेले भैया/दीदी के बर्थडे में जलूल-जलूल आना!”'
      : COUPLE_DEFAULTS.littleOnesLine.hi,
    littleOnesNamesEn: COUPLE_DEFAULTS.littleOnesNames.en,
    littleOnesNamesHi: COUPLE_DEFAULTS.littleOnesNames.hi,
    couplePhotoUrl: '',
    songTitle: getDefaultSongTitle(theme),
    songAudioKey: undefined,
    songUrl: '',
    songFileName: '',
    songPresetId: 'default',
    customCoverImage: '',
    rsvpDeadline: '01 Feb 2027',
    rsvpDeadlineHi: '01 फ़रवरी 2027',
    rsvpWhatsapp: '',
    shagunUpi: '',
    familySide: 'groom-first',
    cardLangMode: 'both',
    editorInputLang: 'en',
    enabledSections,
    events: baseCeremonies.map((c, idx) => ({
      id: c.id,
      titleEn: c.title.en,
      titleHi: c.title.hi,
      subtitleEn: c.subtitle.en,
      dateEn: c.date.en,
      dateHi: c.date.hi,
      time: c.time,
      venueEn: c.venue.en,
      venueHi: c.venue.hi,
      attireEn: c.attire.en,
      attireHi: c.attire.hi,
      accentHex: c.accentHex,
      image: c.image,
      imageAlt: c.imageAlt,
      swatchColors: defaultSwatchForIndex(idx, c.accentHex),
    })),
  };
}

export function mergeCustomization(
  theme: InviteTheme,
  stored: Partial<CardCustomization> | undefined,
  globalGroom: string,
  globalBride: string
): CardCustomization {
  const base = getDefaultCustomization(theme, globalGroom, globalBride);
  if (!stored) return base;
  return {
    ...base,
    ...stored,
    themeId: theme.id,
    enabledSections: {
      ...base.enabledSections,
      ...(stored.enabledSections || {}),
    },
    events: Array.isArray(stored.events) && stored.events.length > 0 ? stored.events : stored.events ?? base.events,
  };
}

export const STORAGE_KEY = 'saath_card_customizations_v1';
const COVER_RESET_MIGRATION_KEY = 'nimantran_cover_reset_v3';

function stripCustomCoverImages(
  map: Record<string, Partial<CardCustomization>>,
  resetEnabledSections = false
): Record<string, Partial<CardCustomization>> {
  const cleaned: Record<string, Partial<CardCustomization>> = {};
  for (const [key, value] of Object.entries(map)) {
    if (!value || typeof value !== 'object') continue;
    const {
      customCoverImage: _ignored,
      enabledSections: existingSections,
      ...rest
    } = value;
    cleaned[key] = resetEnabledSections ? rest : { ...rest, enabledSections: existingSections };
  }
  return cleaned;
}

export function loadStoredCustomizations(): Record<string, Partial<CardCustomization>> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    const map = parsed as Record<string, Partial<CardCustomization>>;
    if (window.localStorage.getItem(COVER_RESET_MIGRATION_KEY) !== '1') {
      const cleaned = stripCustomCoverImages(map, true);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned));
      window.localStorage.setItem(COVER_RESET_MIGRATION_KEY, '1');
      return cleaned;
    }
    return stripCustomCoverImages(map, false);
  } catch {
    return {};
  }
}

export function saveStoredCustomizations(map: Record<string, Partial<CardCustomization>>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stripCustomCoverImages(map)));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export const SITE_ORIGIN = 'https://www.invitationcards.site';
export const SITE_DOMAIN = 'invitationcards.site';

export function getTemplateSlugKey(theme: InviteTheme): string {
  return theme.slug.replace(/^\/?invites\//, '').replace(/\/$/, '');
}

export function getTemplateCanonicalUrl(theme: InviteTheme, isSharePage = false): string {
  const cleanSlug = theme.slug.replace(/^\/+/, '');
  return `${SITE_ORIGIN}/${cleanSlug}${isSharePage ? '/share' : ''}`;
}

export function findThemeBySlugOrId(rawSlugOrId: string | null | undefined): InviteTheme | null {
  if (!rawSlugOrId) return null;
  const normalized = rawSlugOrId
    .trim()
    .toLowerCase()
    .replace(/^\/?invites\//, '')
    .replace(/\/(share)?$/, '');
  if (!normalized) return null;

  return (
    STUDIO_THEMES.find((t) => getTemplateSlugKey(t) === normalized) ||
    STUDIO_THEMES.find((t) => t.id === normalized) ||
    (normalized === 'genda' ? STUDIO_THEMES.find((t) => t.id === 'mehndi-jhoola') || null : null) ||
    (normalized === 'confetti-box' ? STUDIO_THEMES.find((t) => t.id === 'confetti-garden') || null : null)
  );
}

export interface ShareUrlOptions {
  side?: 'groom' | 'bride';
  guestFamily?: string;
  allowedEventIds?: string[];
  includeCustomData?: boolean;
  useProductionOrigin?: boolean;
  isSharePage?: boolean;
}

export function encodeShareUrl(
  theme: InviteTheme,
  custom: CardCustomization,
  options: ShareUrlOptions = {}
): string {
  const {
    side,
    guestFamily,
    allowedEventIds,
    includeCustomData = true,
    useProductionOrigin = true,
    isSharePage = false,
  } = options;

  try {
    const origin = useProductionOrigin ? SITE_ORIGIN : window.location.origin;
    const basePath = `/${theme.slug.replace(/^\/+/, '')}${isSharePage ? '/share' : ''}`;
    const url = new URL(`${origin}${basePath}`);

    if (includeCustomData) {
      const base = getDefaultCustomization(theme, COUPLE_DEFAULTS.groomEn, COUPLE_DEFAULTS.brideEn);
      const diff: Record<string, unknown> = {};

      const assignIfChanged = (key: string, curr: string | undefined, defVal: string | undefined) => {
        const cVal = curr ?? '';
        const dVal = defVal ?? '';
        if (cVal !== dVal) {
          diff[key] = cVal;
        }
      };

      const safeCouplePhoto =
        custom.couplePhotoUrl && !custom.couplePhotoUrl.startsWith('data:')
          ? custom.couplePhotoUrl
          : '';

      assignIfChanged('p', custom.primaryName, base.primaryName);
      assignIfChanged('phn', custom.primaryNameHi, base.primaryNameHi);
      assignIfChanged('b', custom.partnerName, base.partnerName);
      assignIfChanged('bhn', custom.partnerNameHi, base.partnerNameHi);
      assignIfChanged('m', custom.milestoneLabel, base.milestoneLabel);
      assignIfChanged('mh', custom.milestoneLabelHi, base.milestoneLabelHi);
      assignIfChanged('d', custom.dateLabel, base.dateLabel);
      assignIfChanged('dh', custom.dateLabelHi, base.dateLabelHi);
      assignIfChanged('iso', custom.targetIsoDate, base.targetIsoDate);
      assignIfChanged('c', custom.cityLabel, base.cityLabel);
      assignIfChanged('ch', custom.cityLabelHi, base.cityLabelHi);
      assignIfChanged('v', custom.venueName, base.venueName);
      assignIfChanged('vh', custom.venueNameHi, base.venueNameHi);
      assignIfChanged('mu', custom.venueMapUrl, base.venueMapUrl);
      assignIfChanged('dn', custom.directionsNote, base.directionsNote);
      assignIfChanged('dnh', custom.directionsNoteHi, base.directionsNoteHi);
      assignIfChanged('ne', custom.personalNoteEn, base.personalNoteEn);
      assignIfChanged('nh', custom.personalNoteHi, base.personalNoteHi);
      assignIfChanged('pe', custom.parentsBlessingEn, base.parentsBlessingEn);
      assignIfChanged('ph', custom.parentsBlessingHi, base.parentsBlessingHi);
      assignIfChanged('gpe', custom.groomParentsEn, base.groomParentsEn);
      assignIfChanged('gph', custom.groomParentsHi, base.groomParentsHi);
      assignIfChanged('bpe', custom.brideParentsEn, base.brideParentsEn);
      assignIfChanged('bph', custom.brideParentsHi, base.brideParentsHi);
      assignIfChanged('ht', custom.weddingHashtag, base.weddingHashtag);
      assignIfChanged('k1e', custom.littleOnesLineEn, base.littleOnesLineEn);
      assignIfChanged('k1h', custom.littleOnesLineHi, base.littleOnesLineHi);
      assignIfChanged('k2e', custom.littleOnesNamesEn, base.littleOnesNamesEn);
      assignIfChanged('k2h', custom.littleOnesNamesHi, base.littleOnesNamesHi);
      assignIfChanged('cp', safeCouplePhoto, base.couplePhotoUrl);
      assignIfChanged('sg', custom.songTitle, base.songTitle);
      assignIfChanged('sgu', custom.songUrl, base.songUrl);
      assignIfChanged('sgp', custom.songPresetId, base.songPresetId);
      assignIfChanged('rd', custom.rsvpDeadline, base.rsvpDeadline);
      assignIfChanged('rdh', custom.rsvpDeadlineHi, base.rsvpDeadlineHi);
      assignIfChanged('wa', custom.rsvpWhatsapp, base.rsvpWhatsapp);
      assignIfChanged('upi', custom.shagunUpi, base.shagunUpi);
      assignIfChanged('lm', custom.cardLangMode, base.cardLangMode);

      const secDiff: Partial<Record<CardSectionKey, boolean>> = {};
      (Object.keys(base.enabledSections) as CardSectionKey[]).forEach((k) => {
        const currEnabled = Boolean(custom.enabledSections?.[k] ?? base.enabledSections[k]);
        const baseEnabled = Boolean(base.enabledSections[k]);
        if (currEnabled !== baseEnabled) {
          secDiff[k] = currEnabled;
        }
      });
      if (Object.keys(secDiff).length > 0) {
        diff.sec = secDiff;
      }

      const baseEvById = new Map(base.events.map((ev) => [ev.id, ev]));
      const eventsChanged =
        custom.events.length !== base.events.length ||
        custom.events.some((ev, idx) => {
          const b = base.events[idx];
          if (!b) return true;
          const safeImg = ev.image.startsWith('data:') ? '' : ev.image;
          return (
            ev.id !== b.id ||
            ev.titleEn !== b.titleEn ||
            ev.titleHi !== b.titleHi ||
            ev.subtitleEn !== b.subtitleEn ||
            ev.dateEn !== b.dateEn ||
            ev.dateHi !== b.dateHi ||
            ev.time !== b.time ||
            ev.venueEn !== b.venueEn ||
            ev.venueHi !== b.venueHi ||
            ev.attireEn !== b.attireEn ||
            ev.attireHi !== b.attireHi ||
            ev.accentHex !== b.accentHex ||
            safeImg !== b.image ||
            JSON.stringify(ev.swatchColors) !== JSON.stringify(b.swatchColors)
          );
        });

      if (eventsChanged) {
        diff.ev = custom.events.map((ev) => {
          const b = baseEvById.get(ev.id);
          const patch: Record<string, unknown> = { id: ev.id };
          const safeImg = ev.image.startsWith('data:') ? '' : ev.image;
          if (!b || ev.titleEn !== b.titleEn) patch.te = ev.titleEn;
          if (!b || ev.titleHi !== b.titleHi) patch.th = ev.titleHi;
          if (!b || ev.subtitleEn !== b.subtitleEn) patch.se = ev.subtitleEn;
          if (!b || ev.dateEn !== b.dateEn) patch.de = ev.dateEn;
          if (!b || ev.dateHi !== b.dateHi) patch.dh = ev.dateHi;
          if (!b || ev.time !== b.time) patch.tm = ev.time;
          if (!b || ev.venueEn !== b.venueEn) patch.ve = ev.venueEn;
          if (!b || ev.venueHi !== b.venueHi) patch.vh = ev.venueHi;
          if (!b || ev.attireEn !== b.attireEn) patch.ae = ev.attireEn;
          if (!b || ev.attireHi !== b.attireHi) patch.ah = ev.attireHi;
          if (!b || ev.accentHex !== b.accentHex) patch.ac = ev.accentHex;
          if (safeImg && (!b || safeImg !== b.image)) patch.im = safeImg;
          if (!b || JSON.stringify(ev.swatchColors) !== JSON.stringify(b.swatchColors)) {
            patch.sw = ev.swatchColors;
          }
          return patch;
        });
      }

      if (Object.keys(diff).length > 0) {
        const json = JSON.stringify(diff);
        const bytes = new TextEncoder().encode(json);
        let bin = '';
        bytes.forEach((b) => {
          bin += String.fromCharCode(b);
        });
        const b64 = btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
        url.searchParams.set('d', b64);
      }
    }

    if (side === 'bride') {
      url.searchParams.set('side', 'bride');
    } else if (side === 'groom') {
      url.searchParams.set('side', 'groom');
    }
    if (guestFamily?.trim()) {
      url.searchParams.set('guest', guestFamily.trim());
    }
    if (allowedEventIds && allowedEventIds.length > 0 && allowedEventIds.length < custom.events.length) {
      url.searchParams.set('events', allowedEventIds.join(','));
    }
    // Guest-facing share links land on the invitation only, without the site
    // header, footer, or Card Studio catalog.
    url.searchParams.set('view', 'card');
    return url.toString();
  } catch {
    return getTemplateCanonicalUrl(theme, isSharePage);
  }
}

export interface DecodedLocationState {
  route: 'studio-home' | 'jharokha-page' | 'share-suite';
  theme: InviteTheme;
  custom: Partial<CardCustomization> | null;
  hasExplicitCustomPayload: boolean;
  cardOnlyView: boolean;
  side?: 'groom' | 'bride';
  guestFamily?: string;
  allowedEventIds?: string[];
  openPreviewModal: boolean;
}

export function resolveLocationState(): DecodedLocationState | null {
  try {
    const pathname = window.location.pathname || '/';
    const params = new URLSearchParams(window.location.search);

    let route: 'studio-home' | 'jharokha-page' | 'share-suite' = 'studio-home';
    let pathTheme: InviteTheme | null = null;

    if (pathname.startsWith('/invites/')) {
      const isSharePath = pathname.endsWith('/share') || pathname.endsWith('/share/');
      const rawSeg = pathname
        .replace(/^\/invites\//, '')
        .replace(/\/(share)?\/?$/, '');
      pathTheme = findThemeBySlugOrId(rawSeg);
      if (pathTheme) {
        route = isSharePath ? 'share-suite' : 'jharokha-page';
      }
    }

    const cardParam = params.get('card');
    const queryTheme = cardParam ? findThemeBySlugOrId(cardParam) : null;
    const resolvedTheme = pathTheme || queryTheme;

    if (!resolvedTheme) {
      return null;
    }

    if (!pathTheme && queryTheme) {
      route = params.get('mode') === 'share' ? 'share-suite' : 'jharokha-page';
    }

    const encoded = params.get('d') || params.get('custom');
    const sideParam = params.get('side');
    const side = sideParam === 'bride' ? 'bride' : sideParam === 'groom' ? 'groom' : undefined;
    const guestFamily = params.get('guest')?.trim() || undefined;
    const eventsRaw = params.get('events')?.trim();
    const allowedEventIds = eventsRaw
      ? eventsRaw.split(',').map((s) => s.trim()).filter(Boolean)
      : undefined;

    let custom: Partial<CardCustomization> | null = null;
    if (encoded) {
      const pad = encoded.replace(/-/g, '+').replace(/_/g, '/');
      const bin = atob(pad);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      const json = new TextDecoder().decode(bytes);
      const data = JSON.parse(json);
      const base = getDefaultCustomization(resolvedTheme, COUPLE_DEFAULTS.groomEn, COUPLE_DEFAULTS.brideEn);
      const baseEvById = new Map(base.events.map((ev) => [ev.id, ev]));

      const decodedCustom: Partial<CardCustomization> = {
        themeId: resolvedTheme.id,
        familySide: side === 'bride' ? 'bride-first' : 'groom-first',
        updatedAt: Date.now(),
      };

      if (data.p !== undefined) decodedCustom.primaryName = data.p;
      if (data.phn !== undefined) decodedCustom.primaryNameHi = data.phn;
      if (data.b !== undefined) decodedCustom.partnerName = data.b;
      if (data.bhn !== undefined) decodedCustom.partnerNameHi = data.bhn;
      if (data.m !== undefined) decodedCustom.milestoneLabel = data.m;
      if (data.mh !== undefined) decodedCustom.milestoneLabelHi = data.mh;
      if (data.d !== undefined) decodedCustom.dateLabel = data.d;
      if (data.dh !== undefined) decodedCustom.dateLabelHi = data.dh;
      if (data.iso !== undefined) decodedCustom.targetIsoDate = data.iso;
      if (data.c !== undefined) decodedCustom.cityLabel = data.c;
      if (data.ch !== undefined) decodedCustom.cityLabelHi = data.ch;
      if (data.v !== undefined) decodedCustom.venueName = data.v;
      if (data.vh !== undefined) decodedCustom.venueNameHi = data.vh;
      if (data.mu !== undefined) decodedCustom.venueMapUrl = data.mu;
      if (data.dn !== undefined) decodedCustom.directionsNote = data.dn;
      if (data.dnh !== undefined) decodedCustom.directionsNoteHi = data.dnh;
      if (data.ne !== undefined) decodedCustom.personalNoteEn = data.ne;
      if (data.nh !== undefined) decodedCustom.personalNoteHi = data.nh;
      if (data.pe !== undefined) decodedCustom.parentsBlessingEn = data.pe;
      if (data.ph !== undefined) decodedCustom.parentsBlessingHi = data.ph;
      if (data.gpe !== undefined) decodedCustom.groomParentsEn = data.gpe;
      if (data.gph !== undefined) decodedCustom.groomParentsHi = data.gph;
      if (data.bpe !== undefined) decodedCustom.brideParentsEn = data.bpe;
      if (data.bph !== undefined) decodedCustom.brideParentsHi = data.bph;
      if (data.ht !== undefined) decodedCustom.weddingHashtag = data.ht;
      if (data.k1e !== undefined) decodedCustom.littleOnesLineEn = data.k1e;
      if (data.k1h !== undefined) decodedCustom.littleOnesLineHi = data.k1h;
      if (data.k2e !== undefined) decodedCustom.littleOnesNamesEn = data.k2e;
      if (data.k2h !== undefined) decodedCustom.littleOnesNamesHi = data.k2h;
      if (data.cp !== undefined) decodedCustom.couplePhotoUrl = data.cp;
      if (data.sg !== undefined) decodedCustom.songTitle = data.sg;
      if (data.sgu !== undefined) decodedCustom.songUrl = data.sgu;
      if (data.sgp !== undefined) decodedCustom.songPresetId = data.sgp;
      if (data.rd !== undefined) decodedCustom.rsvpDeadline = data.rd;
      if (data.rdh !== undefined) decodedCustom.rsvpDeadlineHi = data.rdh;
      if (data.wa !== undefined) decodedCustom.rsvpWhatsapp = data.wa;
      if (data.upi !== undefined) decodedCustom.shagunUpi = data.upi;
      if (data.lm === 'en' || data.lm === 'hi' || data.lm === 'both') {
        decodedCustom.cardLangMode = data.lm;
      }
      if (data.sec && typeof data.sec === 'object') {
        decodedCustom.enabledSections = {
          ...base.enabledSections,
          ...data.sec,
        };
      }
      if (Array.isArray(data.ev)) {
        decodedCustom.events = data.ev.map((rawEv: Record<string, unknown>, idx: number) => {
          const evId = typeof rawEv.id === 'string' ? rawEv.id : `ev-${idx + 1}`;
          const baseEv = baseEvById.get(evId) || base.events[idx];
          const fallbackImg = baseEv?.image || HERO_COURTYARD_IMAGE;
          const fallbackAccent = baseEv?.accentHex || resolvedTheme.accentHex;
          return {
            id: evId,
            titleEn: (rawEv.te ?? rawEv.titleEn ?? baseEv?.titleEn ?? 'Celebration') as string,
            titleHi: (rawEv.th ?? rawEv.titleHi ?? baseEv?.titleHi ?? 'उत्सव') as string,
            subtitleEn: (rawEv.se ?? rawEv.subtitleEn ?? baseEv?.subtitleEn ?? '') as string,
            dateEn: (rawEv.de ?? rawEv.dateEn ?? baseEv?.dateEn ?? base.dateLabel) as string,
            dateHi: (rawEv.dh ?? rawEv.dateHi ?? baseEv?.dateHi ?? base.dateLabel) as string,
            time: (rawEv.tm ?? rawEv.time ?? baseEv?.time ?? '06:00 PM') as string,
            venueEn: (rawEv.ve ?? rawEv.venueEn ?? baseEv?.venueEn ?? base.venueName) as string,
            venueHi: (rawEv.vh ?? rawEv.venueHi ?? baseEv?.venueHi ?? base.venueName) as string,
            attireEn: (rawEv.ae ?? rawEv.attireEn ?? baseEv?.attireEn ?? 'Festive Traditional') as string,
            attireHi: (rawEv.ah ?? rawEv.attireHi ?? baseEv?.attireHi ?? 'पारंपरिक परिधान') as string,
            accentHex: (rawEv.ac ?? rawEv.accentHex ?? fallbackAccent) as string,
            image: (rawEv.im || rawEv.image || fallbackImg) as string,
            imageAlt: (rawEv.ia ?? rawEv.imageAlt ?? baseEv?.imageAlt ?? 'Celebration artwork') as string,
            swatchColors: Array.isArray(rawEv.sw)
              ? (rawEv.sw as string[])
              : Array.isArray(rawEv.swatchColors)
                ? (rawEv.swatchColors as string[])
                : baseEv?.swatchColors || [fallbackAccent, '#C88A2B', '#FAF6EE'],
          };
        });
      }
      custom = decodedCustom;
    } else if (side) {
      custom = {
        themeId: resolvedTheme.id,
        familySide: side === 'bride' ? 'bride-first' : 'groom-first',
      };
    }

    return {
      route,
      theme: resolvedTheme,
      custom,
      hasExplicitCustomPayload: Boolean(encoded),
      cardOnlyView: params.get('view') === 'card',
      side,
      guestFamily,
      allowedEventIds,
      openPreviewModal: Boolean(encoded || guestFamily),
    };
  } catch {
    return null;
  }
}

export function decodeShareFromUrl(): {
  theme: InviteTheme;
  custom: Partial<CardCustomization>;
} | null {
  const res = resolveLocationState();
  if (!res || !res.custom) return null;
  return { theme: res.theme, custom: res.custom };
}

