import type { CardTemplate, CardPage, ImageElement, TextElement, VideoElement } from '../types/editor';

const WIDTH = 450;
const HEIGHT = 800;

type SuitePageRole = 'cover' | 'invitation' | 'ceremony' | 'schedule' | 'reception' | 'gratitude';

interface SuiteDefinition {
  id: string;
  title: string;
  slug: string;
  pageFiles: string[];
  ink: string;
  accent: string;
  paper: string;
  deep: string;
  coverVideo?: string;
  videoIsCoverOnly?: boolean;
  coverPosterSrc?: string;
  tags: string[];
}

const suiteDefinitions: SuiteDefinition[] = [
  {
    id: 'elegant-navy-ganesha-story',
    title: 'Elegant Navy Ganesha · Wedding Story',
    slug: 'elegant-navy-ganesha',
    pageFiles: ['01', '02', '03', '04', '05'],
    ink: '#233C5B', accent: '#9A753A', paper: '#F5F0E6', deep: '#0E1A30',
    coverVideo: 'elegant-navy-ganesha-cover.mp4',
    videoIsCoverOnly: true,
    coverPosterSrc: '/templates/new-wedding/ganesha-suites/elegant-navy-ganesha-01.webp',
    tags: ['Navy & Ivory', 'Ganesha Blessings'],
  },
  {
    id: 'luxury-purple-gold-ganesha-story',
    title: 'Luxury Purple & Gold Ganesha · Wedding Story',
    slug: 'luxury-purple-gold-ganesha',
    pageFiles: ['01', '02', '03', '04', '05'],
    ink: '#512B57', accent: '#A47835', paper: '#F5EDE5', deep: '#2B1236',
    tags: ['Amethyst & Gold', 'Ganesha Blessings'],
  },
  {
    id: 'opulent-maroon-ganesha-story',
    title: 'Opulent Maroon Ganesha · Wedding Story',
    slug: 'opulent-maroon-ganesha',
    pageFiles: ['01', '02', '03', '04'],
    ink: '#FFF0D7', accent: '#E7C77C', paper: '#5A2027', deep: '#45151D',
    coverVideo: 'opulent-maroon-ganesha-cover.mp4',
    videoIsCoverOnly: true,
    coverPosterSrc: '/templates/new-wedding/single-cards/ornate-maroon-ganesha-wedding-cover.webp',
    tags: ['Maroon & Gold', 'Ganesha Blessings'],
  },
  {
    id: 'ornate-gold-ganesha-story',
    title: 'Ornate Gold Ganesha · Wedding Story',
    slug: 'ornate-gold-ganesha',
    pageFiles: ['01', '02', '03', '04'],
    ink: '#4B2C22', accent: '#A1732E', paper: '#F4EBDD', deep: '#281326',
    coverVideo: 'ornate-gold-ganesha-cover.mp4',
    videoIsCoverOnly: true,
    coverPosterSrc: '/templates/new-wedding/ganesha-suites/ornate-gold-ganesha-01.webp',
    tags: ['Purple & Antique Gold', 'Ganesha Blessings'],
  },
  {
    id: 'ornate-maroon-ganesha-story',
    title: 'Ornate Maroon Ganesha · Wedding Story',
    slug: 'ornate-maroon-ganesha',
    pageFiles: ['01', '02', '03', '04', '05'],
    ink: '#FFF0D9', accent: '#E5C276', paper: '#5A2027', deep: '#45151D',
    tags: ['Maroon & Gold', 'Elephant Motifs'],
  },
  {
    id: 'purple-gold-ganesha-story',
    title: 'Purple & Gold Ganesha · Wedding Story',
    slug: 'purple-gold-ganesha',
    pageFiles: ['01', '02', '03', '04'],
    ink: '#4A2855', accent: '#A47733', paper: '#F5EDE6', deep: '#2A1235',
    tags: ['Royal Purple', 'Ganesha Blessings'],
  },
];

const roleTitles: SuitePageRole[] = ['cover', 'invitation', 'schedule', 'reception', 'gratitude'];
const coverFirstSlideRoles: SuitePageRole[] = ['invitation', 'ceremony', 'schedule', 'reception', 'gratitude'];
const pageNames: Record<SuitePageRole, string> = {
  cover: '01 · Wedding Invitation',
  invitation: '02 · The Invitation',
  ceremony: '03 · Wedding Ceremony',
  schedule: '03 · Wedding Celebrations',
  reception: '04 · Reception Details',
  gratitude: '05 · With Gratitude',
};

function textLayer(
  id: string,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  fontSize: number,
  color: string,
  options: Partial<TextElement> = {},
): TextElement {
  return {
    id,
    type: 'text',
    text,
    fontFamily: "'Cormorant Garamond', serif",
    fontSize,
    color,
    fontWeight: '500',
    fontStyle: 'normal',
    textAlign: 'center',
    verticalAlign: 'middle',
    letterSpacing: 0.15,
    lineHeight: 1.18,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    zIndex: 4,
    ...options,
  };
}

function backgroundImage(id: string, src: string, description: string): ImageElement {
  return {
    id,
    type: 'image',
    src,
    alt: description,
    altText: description,
    mask: 'none',
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT,
    rotation: 0,
    opacity: 1,
    zIndex: 1,
    objectFit: 'contain',
    locked: true,
    ratioLocked: true,
  };
}

function coverVideo(id: string, slug: string, src: string, posterSrc?: string): VideoElement {
  return {
    id,
    type: 'video',
    videoId: id,
    videoName: slug.replaceAll('-', ' ') + ' cover',
    mediaSrc: src,
    posterSrc,
    mediaLabelVisible: false,
    visualTheme: 'uploaded-video',
    primaryColor: '#D6B45D',
    secondaryColor: '#F7ECD1',
    bgGradient: 'linear-gradient(145deg, #20101e 0%, #563041 55%, #160d15 100%)',
    isPlaying: true,
    isMuted: true,
    loop: true,
    playbackSpeed: 1,
    borderRadius: 0,
    borderWidth: 0,
    x: 0,
    y: 0,
    width: WIDTH,
    height: HEIGHT,
    rotation: 0,
    opacity: 1,
    zIndex: 2,
  };
}

function suiteText(role: SuitePageRole, id: string, ink: string, accent: string, animated: boolean): TextElement[] {
  const motion = (animation: TextElement['animation'] = 'rise') => animated
    ? { animation, animationSpeed: 0.85, animationTiming: 'enter' as const }
    : { animation: 'none' as const };
  const serif = "'Cormorant Garamond', serif";
  const script = "'Great Vibes', cursive";
  const sans = "'Montserrat', sans-serif";

  if (role === 'cover') {
    return [
      textLayer(id + '-families', 'TOGETHER WITH OUR FAMILIES', 38, 390, 374, 23, 10, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase', ...motion('fade') }),
      textLayer(id + '-names', 'Aarav & Meera', 28, 418, 394, 58, 39, ink, { fontFamily: script, fontWeight: 'normal', ...motion() }),
      textLayer(id + '-invite', 'joyfully invite you to celebrate their wedding', 48, 479, 354, 35, 16, ink, { fontFamily: serif, fontStyle: 'italic', ...motion('fade') }),
      textLayer(id + '-date', 'SATURDAY · 20 FEBRUARY 2027 · 6:30 PM', 43, 526, 364, 25, 10, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 0.55, ...motion('wipe') }),
      textLayer(id + '-venue', 'The Royal Courtyard · Jaipur', 50, 557, 350, 29, 14, ink, { fontFamily: serif, ...motion('fade') }),
    ];
  }

  if (role === 'invitation') {
    return [
      textLayer(id + '-intro', 'WITH THE BLESSINGS OF OUR FAMILIES', 48, 289, 354, 24, 10, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 1.15, ...motion('fade') }),
      textLayer(id + '-names', 'Aarav & Meera', 40, 322, 370, 58, 38, ink, { fontFamily: script, fontWeight: 'normal', ...motion() }),
      textLayer(id + '-copy', 'invite you to join them as they begin their life together', 62, 384, 326, 43, 16, ink, { fontFamily: serif, ...motion('fade') }),
      textLayer(id + '-date', '20 FEBRUARY 2027  ·  6:30 PM', 54, 440, 342, 24, 11, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 0.55, ...motion('wipe') }),
      textLayer(id + '-venue', 'The Royal Courtyard · Jaipur', 56, 471, 338, 28, 14, ink, { ...motion('fade') }),
    ];
  }

  if (role === 'schedule') {
    return [
      textLayer(id + '-date', '19–20 FEBRUARY 2027', 55, 294, 340, 27, 11, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 1.1, ...motion('fade') }),
      textLayer(id + '-event-1', 'Ganesh Puja  ·  19 Feb, 11:00 AM', 54, 344, 342, 33, 15, ink, { ...motion() }),
      textLayer(id + '-event-2', 'Mehendi  ·  19 Feb, 4:00 PM', 54, 390, 342, 33, 15, ink, { ...motion() }),
      textLayer(id + '-event-3', 'Sangeet  ·  19 Feb, 7:00 PM', 54, 436, 342, 33, 15, ink, { ...motion() }),
      textLayer(id + '-event-4', 'Wedding Ceremony  ·  20 Feb, 6:30 PM', 48, 482, 354, 36, 14, ink, { ...motion() }),
      textLayer(id + '-venue', 'Jaipur, Rajasthan', 65, 530, 320, 26, 13, accent, { fontFamily: sans, fontWeight: '500', ...motion('fade') }),
    ];
  }

  if (role === 'ceremony') {
    return [
      textLayer(id + '-ceremony-label', 'THE WEDDING CEREMONY', 48, 350, 354, 26, 11, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 1.25, ...motion('fade') }),
      textLayer(id + '-ceremony-names', 'Aarav & Meera', 36, 389, 378, 56, 36, ink, { fontFamily: script, fontWeight: 'normal', ...motion() }),
      textLayer(id + '-ceremony-date', 'SATURDAY · 20 FEBRUARY 2027', 50, 452, 350, 23, 11, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 0.5, ...motion('wipe') }),
      textLayer(id + '-ceremony-time', 'The ceremony begins at 6:30 PM', 56, 484, 338, 29, 15, ink, { ...motion('fade') }),
      textLayer(id + '-ceremony-venue', 'The Royal Courtyard · Jaipur', 56, 521, 338, 29, 14, ink, { ...motion('fade') }),
    ];
  }

  if (role === 'reception') {
    return [
      textLayer(id + '-reception', 'PLEASE JOIN US FOR THE RECEPTION', 46, 388, 358, 28, 11, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 1.15, ...motion('fade') }),
      textLayer(id + '-names', 'Aarav & Meera', 36, 424, 378, 56, 36, ink, { fontFamily: script, fontWeight: 'normal', ...motion() }),
      textLayer(id + '-date', '20 FEBRUARY 2027  ·  8:00 PM', 48, 489, 354, 25, 11, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 0.45, ...motion('wipe') }),
      textLayer(id + '-venue', 'The Royal Courtyard\nJaipur, Rajasthan', 58, 520, 334, 48, 14, ink, { lineHeight: 1.25, ...motion('fade') }),
      textLayer(id + '-rsvp', 'Kindly reply to the family', 65, 580, 320, 24, 13, ink, { fontStyle: 'italic', ...motion('fade') }),
    ];
  }

  return [
    textLayer(id + '-message', 'We look forward to celebrating this special day with you.', 52, 419, 346, 58, 19, ink, { fontFamily: serif, fontStyle: 'italic', ...motion('fade') }),
    textLayer(id + '-names', 'With love, Aarav & Meera', 60, 491, 330, 38, 17, accent, { fontFamily: serif, fontWeight: '600', ...motion() }),
  ];
}

function createSuite(definition: SuiteDefinition): CardTemplate {
  const basePath = '/templates/new-wedding/ganesha-suites/';
  const sourcePageNumbers = definition.pageFiles;
  let pages: CardPage[];

  if (definition.coverVideo && definition.videoIsCoverOnly) {
    const coverId = definition.id + '-page-1';
    const coverElements: CardPage['elements'] = [];
    if (definition.coverPosterSrc) {
      coverElements.push(backgroundImage(coverId + '-poster', definition.coverPosterSrc, definition.title + ' animated cover poster'));
    }
    coverElements.push(coverVideo(definition.id + '-cover-video', definition.slug, basePath + definition.coverVideo, definition.coverPosterSrc));
    const videoPage: CardPage = {
      id: coverId,
      title: '01 · Animated Cover',
      backgroundType: 'color',
      backgroundValue: definition.paper,
      duration: 7,
      transition: 'light-sweep',
      elements: coverElements,
    };
    const imagePages = sourcePageNumbers.map((fileNumber, index) => {
      const role = coverFirstSlideRoles[Math.min(index, coverFirstSlideRoles.length - 1)];
      const id = definition.id + '-page-' + (index + 2);
      return {
        id,
        title: String(index + 2).padStart(2, '0') + ' · ' + pageNames[role].split(' · ')[1],
        backgroundType: 'color' as const,
        backgroundValue: definition.paper,
        duration: 6,
        transition: index % 2 === 0 ? 'royal-curtain' as const : 'sparkle' as const,
        elements: [
          backgroundImage(id + '-artwork', basePath + definition.slug + '-' + fileNumber + '.webp', definition.title + ' slide ' + (index + 2)),
          ...suiteText(role, id, definition.ink, definition.accent, true),
        ],
      };
    });
    pages = [videoPage, ...imagePages];
  } else {
    pages = sourcePageNumbers.map((fileNumber, index) => {
      const role = roleTitles[Math.min(index, roleTitles.length - 1)];
      const id = definition.id + '-page-' + (index + 1);
      const elements: CardPage['elements'] = [backgroundImage(id + '-artwork', basePath + definition.slug + '-' + fileNumber + '.webp', definition.title + ' slide ' + (index + 1))];
      if (index === 0 && definition.coverVideo) {
        elements.push(coverVideo(definition.id + '-cover-video', definition.slug, basePath + definition.coverVideo, definition.coverPosterSrc));
      }
      elements.push(...suiteText(role, id, definition.ink, definition.accent, true));
      return {
        id,
        title: pageNames[role],
        backgroundType: 'color',
        backgroundValue: definition.paper,
        duration: 6,
        transition: index === 0 ? 'light-sweep' : index % 2 === 0 ? 'page-turn' : 'royal-curtain',
        elements,
      };
    });
  }

  const pageCount = pages.length;
  return {
    id: definition.id,
    title: definition.title + ' (' + pageCount + '-Page Sequence)',
    category: 'wedding',
    aspectRatio: 'portrait-story',
    tags: ['Video Invitation', '9:16 Story', pageCount + '-Page Sequence', 'Editable Text', 'New Ganesha Collection', ...definition.tags],
    thumbnailGradient: 'linear-gradient(145deg, ' + definition.deep + ' 0%, ' + definition.accent + ' 60%, ' + definition.paper + ' 100%)',
    pages,
  };
}

interface SingleCardDefinition {
  id: string;
  title: string;
  asset: string;
  type: 'wedding' | 'schedule' | 'reception' | 'cover' | 'thank-you';
  ink: string;
  accent: string;
  paper: string;
}

const singleCardDefinitions: SingleCardDefinition[] = [
  { id: 'elegant-navy-ganesha-wedding-single', title: 'Elegant Navy Ganesha · Wedding Events', asset: 'elegant-navy-ganesha-wedding.webp', type: 'schedule', ink: '#263E5A', accent: '#956F35', paper: '#F5F0E8' },
  { id: 'luxury-purple-gold-ganesha-wedding-single', title: 'Luxury Purple & Gold Ganesha · Wedding Events', asset: 'luxury-purple-gold-ganesha-wedding.webp', type: 'schedule', ink: '#4C2B56', accent: '#A17433', paper: '#F3EADF' },
  { id: 'navy-silver-reception-single', title: 'Navy & Silver · Reception Invitation', asset: 'navy-silver-reception-invitation.webp', type: 'reception', ink: '#263E5A', accent: '#8D744F', paper: '#F2EFE8' },
  { id: 'ornate-maroon-gold-reception-single', title: 'Ornate Maroon & Gold · Reception', asset: 'ornate-maroon-gold-reception-invitation.webp', type: 'reception', ink: '#FFF0D8', accent: '#E5C276', paper: '#5A2027' },
  { id: 'ornate-maroon-ganesha-wedding-single', title: 'Ornate Maroon Ganesha · Wedding Cover', asset: 'ornate-maroon-ganesha-wedding-cover.webp', type: 'cover', ink: '#FFF0D8', accent: '#E5C276', paper: '#5A2027' },
  { id: 'regal-purple-gold-reception-single', title: 'Regal Purple & Gold · Reception', asset: 'regal-purple-gold-reception-invitation.webp', type: 'reception', ink: '#4C2B56', accent: '#A17433', paper: '#F4EBDD' },
  { id: 'elegant-navy-ivory-thank-you-single', title: 'Elegant Navy & Ivory · Thank You', asset: 'elegant-navy-ivory-thank-you-card.webp', type: 'thank-you', ink: '#263E5A', accent: '#956F35', paper: '#F5F0E8' },
];

function singleCardText(definition: SingleCardDefinition, id: string): TextElement[] {
  const { ink, accent } = definition;
  const sans = "'Montserrat', sans-serif";
  const script = "'Great Vibes', cursive";
  const serif = "'Cormorant Garamond', serif";
  if (definition.type === 'schedule') {
    const eventRows = [
      { top: 231, date: '19 February 2027', time: '11:00 AM', venue: 'Jaipur, Rajasthan' },
      { top: 347, date: '20 February 2027', time: '6:30 PM', venue: 'Jaipur, Rajasthan' },
      { top: 462, date: '19 February 2027', time: '4:00 PM', venue: 'Jaipur, Rajasthan' },
      { top: 576, date: '20 February 2027', time: '8:00 PM', venue: 'Jaipur, Rajasthan' },
    ];
    return eventRows.flatMap((row, index) => [
      textLayer(id + '-event-' + (index + 1) + '-date', row.date, 220, row.top, 192, 18, 8.5, ink, { fontFamily: sans, textAlign: 'left' }),
      textLayer(id + '-event-' + (index + 1) + '-time', row.time, 220, row.top + 20, 192, 18, 8.5, ink, { fontFamily: sans, textAlign: 'left' }),
      textLayer(id + '-event-' + (index + 1) + '-venue', row.venue, 220, row.top + 40, 192, 18, 8.5, ink, { fontFamily: sans, textAlign: 'left' }),
    ]);
  }
  if (definition.type === 'wedding') {
    return [
      textLayer(id + '-families', 'TOGETHER WITH THEIR FAMILIES', 54, 432, 342, 22, 10, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 1.15 }),
      textLayer(id + '-names', 'Aarav & Meera', 34, 461, 382, 54, 36, ink, { fontFamily: script, fontWeight: 'normal' }),
      textLayer(id + '-invite', 'joyfully invite you to celebrate their wedding', 56, 521, 338, 34, 15, ink, { fontStyle: 'italic' }),
      textLayer(id + '-date', '20 FEBRUARY 2027  ·  6:30 PM', 54, 565, 342, 22, 10, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 0.3 }),
      textLayer(id + '-venue', 'The Royal Courtyard · Jaipur', 56, 592, 338, 26, 13, ink),
    ];
  }
  if (definition.type === 'cover') {
    return [
      textLayer(id + '-families', 'TOGETHER WITH OUR FAMILIES', 45, 410, 360, 23, 10, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 1.1 }),
      textLayer(id + '-names', 'Aarav & Meera', 32, 443, 386, 60, 40, ink, { fontFamily: script, fontWeight: 'normal' }),
      textLayer(id + '-date', '20 FEBRUARY 2027  ·  6:30 PM', 52, 515, 346, 25, 11, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 0.35 }),
      textLayer(id + '-venue', 'The Royal Courtyard · Jaipur', 55, 546, 340, 29, 14, ink),
    ];
  }
  if (definition.type === 'thank-you') {
    return [
      textLayer(id + '-message', 'Thank you for sharing in our celebration. Your love and blessings mean so much to us.', 54, 378, 342, 76, 18, ink, { fontFamily: serif, fontStyle: 'italic' }),
      textLayer(id + '-signature', 'With love, Aarav & Meera', 56, 467, 338, 36, 17, accent, { fontFamily: serif, fontWeight: '600' }),
    ];
  }
  const contentTop = id.startsWith('ornate-maroon-gold') ? 330 : id.startsWith('regal-purple-gold') ? 410 : 390;
  return [
    textLayer(id + '-families', 'TOGETHER WITH OUR FAMILIES', 50, contentTop, 350, 22, 10, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 1.1 }),
    textLayer(id + '-names', 'Aarav & Meera', 34, contentTop + 31, 382, 56, 37, ink, { fontFamily: script, fontWeight: 'normal' }),
    textLayer(id + '-invite', 'invite you to celebrate their wedding', 58, contentTop + 95, 334, 34, 15, ink, { fontStyle: 'italic' }),
    textLayer(id + '-date', '20 FEBRUARY 2027  ·  8:00 PM', 55, contentTop + 143, 340, 23, 10, accent, { fontFamily: sans, fontWeight: '600', letterSpacing: 0.3 }),
    textLayer(id + '-venue', 'The Royal Courtyard\nJaipur, Rajasthan', 64, contentTop + 175, 322, 48, 14, ink),
    textLayer(id + '-rsvp', 'Kindly reply to the family', 70, contentTop + 235, 310, 24, 13, ink, { fontStyle: 'italic' }),
  ];
}

function createSingleCard(definition: SingleCardDefinition): CardTemplate {
  const id = definition.id;
  const image = backgroundImage(
    id + '-artwork',
    '/templates/new-wedding/single-cards/' + definition.asset,
    definition.title + ' editable invitation artwork',
  );
  const page: CardPage = {
    id: id + '-page-1',
    title: definition.title,
    backgroundType: 'color',
    backgroundValue: definition.paper,
    elements: [image, ...singleCardText(definition, id)],
  };
  return {
    id,
    title: definition.title,
    category: 'wedding',
    aspectRatio: 'portrait-story',
    tags: ['Shubh Vivah', 'Single Page', '9:16 Story', 'Editable Text', 'New Ganesha Collection', definition.type === 'reception' ? 'Reception Invitation' : 'Ganesha Wedding'],
    thumbnailGradient: 'linear-gradient(145deg, ' + definition.paper + ' 0%, ' + definition.accent + ' 100%)',
    pages: [page],
  };
}

export const NEW_GANESHA_WEDDING_TEMPLATES: CardTemplate[] = [
  ...suiteDefinitions.map(createSuite),
  ...singleCardDefinitions.map(createSingleCard),
];
