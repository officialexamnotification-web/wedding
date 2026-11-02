import type { AudioTimelineClip, CardTemplate, FrameElement, ImageElement, TextElement, VideoElement } from '../types/editor';

const WIDTH = 500;
const HEIGHT = 700;
const ASSET_PATH = '/Sage%20Green%20Birthday%20Invitation/';
const PAPER = '#FFF8E8';
const SAGE = '#526332';
const GOLD = '#9B6D20';
const birthdayAudio: AudioTimelineClip[] = [{
  id: 'sage-green-birthday-music',
  trackId: 'toast-in-the-garden',
  pageIndex: null,
  timelineStartSec: 0,
  settings: {
    startSec: 0,
    durationSec: null,
    volume: 0.28,
    fadeInSec: 0.7,
    fadeOutSec: 1,
    loop: false,
  },
}];

function artwork(id: string, file: string, description: string): ImageElement {
  return {
    id,
    type: 'image',
    src: ASSET_PATH + file,
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
    letterSpacing: 0.2,
    lineHeight: 1.16,
    x,
    y,
    width,
    height,
    rotation: 0,
    opacity: 1,
    zIndex: 4,
    animation: 'fade',
    animationSpeed: 0.82,
    animationTiming: 'enter',
    ...options,
  };
}

function coverVideo(): VideoElement {
  const src = ASSET_PATH + 'Sage%20Green%20Birthday%20cover%20video.mp4';
  return {
    id: 'sage-green-birthday-cover-video',
    type: 'video',
    videoId: 'sage-green-birthday-cover-video',
    videoName: 'Sage Green Birthday cover',
    mediaSrc: src,
    posterSrc: ASSET_PATH + 'Sage%20Green%20Birthday%20Invitation%20Template-1.png',
    mediaLabelVisible: false,
    visualTheme: 'uploaded-video',
    primaryColor: '#8D963E',
    secondaryColor: '#D8AE52',
    bgGradient: 'linear-gradient(145deg, #48552C 0%, #A6A06C 55%, #F9F0D6 100%)',
    isPlaying: true,
    isMuted: true,
    loop: false,
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

const birthdayPhoto: FrameElement = {
  id: 'sage-green-birthday-photo',
  type: 'frame',
  frameId: 'birthday-square-photo',
  frameName: 'Birthday photo',
  clipPathSvg: '<rect x="0" y="0" width="100" height="100"/>',
  imageSrc: '/images/baby_birthday_1791965343318.jpg',
  imageScale: 1,
  imageOffsetX: 0,
  imageOffsetY: 0,
  naturalImageFit: true,
  borderColor: GOLD,
  borderWidth: 0,
  placeholderColor: PAPER,
  x: 194,
  y: 304,
  width: 112,
  height: 112,
  rotation: 0,
  opacity: 1,
  zIndex: 3,
};

const sageGreenBirthday: CardTemplate = {
  id: 'sage-green-birthday-invitation',
  title: 'Sage Green Birthday Invitation',
  category: 'birthday',
  aspectRatio: 'portrait-classic',
  tags: ['Birthday', 'Sage Green', 'Video Invitation', '4-Page Sequence', 'Editable Text', 'Photo Frame'],
  thumbnailGradient: 'from-emerald-100 via-amber-100 to-lime-800',
  audioClips: birthdayAudio,
  pages: [
    {
      id: 'sage-birthday-animated-cover',
      title: '01 · Animated Cover',
      backgroundType: 'color',
      backgroundValue: PAPER,
      duration: 6,
      transition: 'light-sweep',
      elements: [
        artwork('sage-birthday-cover-poster', 'Sage%20Green%20Birthday%20Invitation%20Template-1.png', 'Sage green birthday invitation cover'),
        coverVideo(),
      ],
    },
    {
      id: 'sage-birthday-invitation',
      title: '02 · Birthday Invitation',
      backgroundType: 'color',
      backgroundValue: PAPER,
      duration: 6,
      transition: 'sparkle',
      elements: [
        artwork('sage-birthday-invitation-artwork', 'Sage%20Green%20Birthday%20Invitation%20Template-1.png', 'Sage green birthday invitation artwork'),
        textLayer('sage-birthday-invitation-intro', 'COME CELEBRATE WITH US', 55, 155, 390, 22, 14, SAGE, {
          fontFamily: "'Montserrat', sans-serif", fontWeight: '600', letterSpacing: 1.15,
        }),
        textLayer('sage-birthday-invitation-title', 'Birthday Celebration', 45, 184, 410, 32, 28, GOLD, {
          fontFamily: "'Cormorant Garamond', serif", fontWeight: '600',
        }),
        textLayer('sage-birthday-invitation-name', "Aarav's First Birthday", 35, 220, 430, 52, 42, SAGE, {
          fontFamily: "'Great Vibes', cursive", fontWeight: 'normal',
        }),
        textLayer('sage-birthday-invitation-date', 'SUNDAY · 21 FEBRUARY 2027', 55, 290, 390, 22, 14, GOLD, {
          fontFamily: "'Montserrat', sans-serif", fontWeight: '600', letterSpacing: 0.6,
        }),
        textLayer('sage-birthday-invitation-time', '4:00 PM ONWARDS', 55, 319, 390, 20, 14, SAGE, {
          fontFamily: "'Montserrat', sans-serif", fontWeight: '600', letterSpacing: 0.8,
        }),
        textLayer('sage-birthday-invitation-venue', 'The Royal Garden · Jaipur', 60, 351, 380, 28, 18, SAGE),
        textLayer('sage-birthday-invitation-close', 'Cake, laughter & little moments await', 60, 389, 380, 24, 16, GOLD, {
          fontStyle: 'italic',
        }),
      ],
    },
    {
      id: 'sage-birthday-party-details',
      title: '03 · Party Details',
      backgroundType: 'color',
      backgroundValue: PAPER,
      duration: 6,
      transition: 'page-turn',
      elements: [
        artwork('sage-birthday-details-artwork', 'Sage%20Green%20Birthday%20Invitation%20Template-2.png', 'Sage green birthday party details artwork'),
        textLayer('sage-birthday-details-intro', 'YOU ARE INVITED TO', 80, 207, 340, 20, 14, SAGE, {
          fontFamily: "'Montserrat', sans-serif", fontWeight: '600', letterSpacing: 1.1,
        }),
        textLayer('sage-birthday-details-name', "Aarav's First Birthday", 65, 234, 370, 40, 38, SAGE, {
          fontFamily: "'Great Vibes', cursive", fontWeight: 'normal',
        }),
        textLayer('sage-birthday-details-message', 'Join us for an afternoon of cake,\ngames & happy memories.', 74, 276, 352, 48, 19, SAGE),
        textLayer('sage-birthday-details-date', 'SUNDAY · 21 FEBRUARY 2027', 60, 357, 380, 20, 14, GOLD, {
          fontFamily: "'Montserrat', sans-serif", fontWeight: '600', letterSpacing: 0.5,
        }),
        textLayer('sage-birthday-details-time', '4:00 PM – 7:00 PM', 60, 383, 380, 19, 14, SAGE, {
          fontFamily: "'Montserrat', sans-serif", fontWeight: '600', letterSpacing: 0.7,
        }),
        textLayer('sage-birthday-details-venue', 'The Royal Garden · Jaipur', 65, 409, 370, 26, 17, SAGE),
        textLayer('sage-birthday-details-rsvp', 'Kindly RSVP by 10 February', 65, 443, 370, 22, 15, GOLD, {
          fontStyle: 'italic',
        }),
      ],
    },
    {
      id: 'sage-birthday-thank-you',
      title: '04 · Thank You',
      backgroundType: 'color',
      backgroundValue: PAPER,
      duration: 6,
      transition: 'fade',
      elements: [
        artwork('sage-birthday-thank-you-artwork', 'Sage%20Green%20Birthday%20Invitation%20Template-3.png', 'Sage green birthday thank-you artwork'),
        textLayer('sage-birthday-thank-you-message', 'Your love made this day\nextra special.', 90, 202, 320, 55, 18, SAGE, {
          fontStyle: 'italic',
        }),
        birthdayPhoto,
      ],
    },
  ],
};

export const BIRTHDAY_TEMPLATES: CardTemplate[] = [sageGreenBirthday];
