import type { AudioTimelineClip, BarcodeElement, CardTemplate, ImageElement, TextElement } from '../types/editor';

const WIDTH = 500;
const HEIGHT = 700;
const ASSET_PATH = '/card-studio-assets/Sage%20Green%20Birthday%20Invitation/';
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

const birthdayBarcode: BarcodeElement = {
  id: 'sage-green-birthday-barcode',
  type: 'barcode',
  codeValue: 'SAGE-BDAY-2027',
  label: 'BIRTHDAY PASS',
  color: SAGE,
  backgroundColor: '#FFF8E8',
  borderColor: GOLD,
  showText: true,
  x: 199,
  y: 309,
  width: 102,
  height: 102,
  rotation: 0,
  opacity: 1,
  zIndex: 3,
};

const sageGreenBirthday: CardTemplate = {
  id: 'sage-green-birthday-invitation',
  title: 'Sage Green Birthday Invitation',
  category: 'birthday',
  aspectRatio: 'portrait-classic',
  tags: ['Birthday', 'Sage Green', 'Video Invitation', '3-Page Sequence', 'Editable Text', 'Photo Frame'],
  thumbnailGradient: 'from-emerald-100 via-amber-100 to-lime-800',
  audioClips: birthdayAudio,
  pages: [
    {
      id: 'sage-birthday-invitation',
      title: '01 · Birthday Invitation',
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
      title: '02 · Party Details',
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
      title: '03 · Thank You',
      backgroundType: 'color',
      backgroundValue: PAPER,
      duration: 6,
      transition: 'fade',
      elements: [
        artwork('sage-birthday-thank-you-artwork', 'Sage%20Green%20Birthday%20Invitation%20Template-3.png', 'Sage green birthday thank-you artwork'),
        textLayer('sage-birthday-thank-you-message', 'Your love made this day\nextra special.', 90, 202, 320, 55, 18, SAGE, {
          fontStyle: 'italic',
        }),
        birthdayBarcode,
      ],
    },
  ],
};

export const BIRTHDAY_TEMPLATES: CardTemplate[] = [sageGreenBirthday];

