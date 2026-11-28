import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  RotateCcw,
  Sparkles,
  MapPin,
  Maximize2,
  Check,
  MessageCircle,
  ChevronDown,
  Music,
  Volume2,
  VolumeX,
  Minus,
  Plus,
  CalendarPlus,
  Compass,
  AlertCircle,
  Heart,
  X,
  SlidersHorizontal,
  Gift,
  Copy,
} from 'lucide-react';
import { InviteTheme } from '../data/studioData';
import { buildDirectGoogleMapsUrl } from '../utils/locationParser';
import {
  CEREMONIES,
  BIRTHDAY_CEREMONIES,
  BIRTHDAY_SWATCHES,
  CeremonyId,
  CeremonyItem,
  COUPLE_DEFAULTS,
  GENDA_COURTYARD_OPEN_IMAGE,
  GENDA_CURTAIN_CLOSED_IMAGE,
  HAVELI_DOORS_IMAGE,
  HERO_COURTYARD_IMAGE,
  RAJWADA_AAGMAN_OPEN_IMAGE,
  IVORY_STATIONERY_HERO_IMAGE,
  DEEPOTSAV_OPEN_IMAGE,
  ROSHNI_JAALI_CLOSED_IMAGE,
  ROSHNI_MANDAP_OPEN_IMAGE,
  TEMPLE_GOPURAM_CLOSED_IMAGE,
  TEMPLE_SANCTUM_OPEN_IMAGE,
  GULAB_VEIL_CLOSED_IMAGE,
  GULAB_GARDEN_OPEN_IMAGE,
  BIRTHDAY_CAKE_LIT_IMAGE,
  BIRTHDAY_SOIREE_OPEN_IMAGE,
  BIRTHDAY_GIFT_CLOSED_IMAGE,
  BIRTHDAY_GARDEN_OPEN_IMAGE,
  BABY_BIRTHDAY_CEREMONIES,
  BABY_BIRTHDAY_SWATCHES,
  INDIAN_BABY_PALNA_CLOSED_IMAGE,
  INDIAN_BABY_COURTYARD_OPEN_IMAGE,
  CHANDA_MAMA_NIGHT_CLOSED_IMAGE,
  CHANDA_MAMA_COURTYARD_OPEN_IMAGE,
  HINDU_BIRTHDAY_CEREMONIES,
  HINDU_BIRTHDAY_SWATCHES,
  BAAL_GOPAL_CLOSED_IMAGE,
  BAAL_GOPAL_OPEN_IMAGE,
  SHUBH_AARTI_CLOSED_IMAGE,
  SHUBH_AARTI_OPEN_IMAGE,
  RANGOLI_UTSAV_CLOSED_IMAGE,
  RANGOLI_UTSAV_OPEN_IMAGE,
  HINDU_GIRL_BIRTHDAY_CEREMONIES,
  HINDU_GIRL_BIRTHDAY_SWATCHES,
  HINDU_BOY_BIRTHDAY_CEREMONIES,
  HINDU_BOY_BIRTHDAY_SWATCHES,
  LADLI_KANYA_CLOSED_IMAGE,
  LADLI_KANYA_OPEN_IMAGE,
  DEVI_KUMKUM_CLOSED_IMAGE,
  DEVI_KUMKUM_OPEN_IMAGE,
  GULAB_BAISA_CLOSED_IMAGE,
  GULAB_BAISA_OPEN_IMAGE,
  KANHA_MAKHAN_OPEN_IMAGE,
  VEER_BALAK_CLOSED_IMAGE,
  VEER_BALAK_OPEN_IMAGE,
  GANESH_AASHISH_CLOSED_IMAGE,
  GANESH_AASHISH_OPEN_IMAGE,
  PAITHANI_ANTARPAT_CLOSED_IMAGE,
  PAITHANI_COURTYARD_OPEN_IMAGE,
  PAITHANI_CEREMONIES,
  PAITHANI_SWATCHES,
  KOHINOOR_CLOSED_IMAGE,
  KOHINOOR_OPEN_IMAGE,
  VRINDAVAN_CLOSED_IMAGE,
  VRINDAVAN_OPEN_IMAGE,
  KESARIYA_CLOSED_IMAGE,
  KESARIYA_OPEN_IMAGE,
  PATTU_ZARI_CLOSED_IMAGE,
  PATTU_MANDAP_OPEN_IMAGE,
  MEHR_CLOSED_IMAGE,
  MEHR_OPEN_IMAGE,
  KALGI_CLOSED_IMAGE,
  KALGI_OPEN_IMAGE,
  SAGE_BUNNY_OPEN_IMAGE,
  BURGUNDY_PAISLEY_OPEN_IMAGE,
  MAROON_RAJHANS_OPEN_IMAGE,
  PURPLE_FILIGREE_OPEN_IMAGE,
  NAVY_SILVER_OPEN_IMAGE,
  SHEESH_MAHAL_UNLIT_DOME_IMAGE,
  SHEESH_MAHAL_PLUM_DOME_IMAGE,
  ROYAL_COUPLE_PORTRAIT_IMAGE,
  BIRTHDAY_STAR_PORTRAIT_IMAGE,
  Language,
} from '../data/weddingData';
import { DiyaFlame, JharokhaCrest } from './JharokhaMotifs';
import { JharokhaScratchDate } from './JharokhaScratchDate';
import { JharokhaArchCard } from './JharokhaArchCard';
import { LotusBloomNode } from './LotusBloomNode';
import { StageMotionCanvas, StageMotionMode } from './StageMotionCanvas';
import { LivingSceneMotionOverlay } from './LivingSceneMotionOverlay';
import { RoyalGate3DOpening } from './RoyalGate3DOpening';
import {
  validateGuestName,
  validateGuestContact,
  validateRsvpForm,
  normalizeIndianWhatsappDigits,
  RsvpValidationErrors,
} from '../utils/rsvpValidation';
import { CardCustomization, CardSectionKey } from '../data/cardCustomization';
import { loadCustomAudioUrl } from '../utils/mediaUpload';
import {
  AttendanceStatus,
  DietaryPreference,
  FamilySide,
  RsvpRecord,
  RsvpSubmissionInput,
  saveLocalRsvp,
} from '../utils/rsvpStore';

interface InteractiveInvitePhoneStageProps {
  theme: InviteTheme;
  lang: Language;
  groomName: string;
  brideName: string;
  weddingDateLabel?: string;
  cityLabel?: string;
  compact?: boolean;
  onOpenFullPreview?: () => void;
  onCloseInline?: () => void;
  externalOpenSignal?: number;
  customization?: CardCustomization;
  onOpenCustomizer?: () => void;
  guestFamilyGreeting?: string;
  allowedEventIds?: string[];
  onSubmitRsvp?: (input: RsvpSubmissionInput) => Promise<RsvpRecord>;
}

interface ThemeStageSkin {
  paperClass: string;
  paperHex: string;
  cardHex: string;
  altCardHex: string;
  inkHex: string;
  mutedInkHex: string;
  accentHex: string;
  goldHex: string;
  heroBgHex: string;
  isDark: boolean;
  scriptClass: string;
  displayClass: string;
  heroGreeting: { en: string; hi: string };
}

const THEME_SKINS: Record<string, ThemeStageSkin> = {
  jharokha: {
    paperClass: 'wasli-paper',
    paperHex: '#EFDEBF',
    cardHex: '#FAF0DE',
    altCardHex: '#F7EAD2',
    inkHex: '#2B1B17',
    mutedInkHex: '#5B3E42',
    accentHex: '#B3261E',
    goldHex: '#C2933F',
    heroBgHex: '#1D2347',
    isDark: false,
    scriptClass: 'font-pinyon',
    displayClass: 'font-bodoni',
    heroGreeting: { en: 'Padharo Mhare Des', hi: 'पधारो म्हारे देश' },
  },
  paithani: {
    paperClass: 'paithani-paper',
    paperHex: '#FBF4E4',
    cardHex: '#FFFFFF',
    altCardHex: '#F3E6CE',
    inkHex: '#2A102E',
    mutedInkHex: '#634257',
    accentHex: '#5A1668',
    goldHex: '#C9932A',
    heroBgHex: '#1D142B',
    isDark: false,
    scriptClass: 'font-pinyon',
    displayClass: 'font-cinzel',
    heroGreeting: { en: 'Maharashtrian Wada · Shubh Mangal', hi: 'शुभमंगल सावधान · पैठणी सोहळा' },
  },
  'mehndi-jhoola': {
    paperClass: 'genda-paper',
    paperHex: '#F9EAC6',
    cardHex: '#FFF6DE',
    altCardHex: '#EEF1DA',
    inkHex: '#24361F',
    mutedInkHex: '#52613A',
    accentHex: '#3F7D3A',
    goldHex: '#B8862A',
    heroBgHex: '#F9EAC6',
    isDark: false,
    scriptClass: 'font-pinyon',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Turmeric & Marigold Courtyard', hi: 'हल्दी और गेंदे का आँगन' },
  },
  'sheesh-mahal': {
    paperClass: 'obsidian-paper',
    paperHex: '#14111C',
    cardHex: '#1D1829',
    altCardHex: '#231D31',
    inkHex: '#F3EADB',
    mutedInkHex: '#C4B8A5',
    accentHex: '#D9B26A',
    goldHex: '#E2BC72',
    heroBgHex: '#0B0910',
    isDark: true,
    scriptClass: 'font-corinthia',
    displayClass: 'font-italiana',
    heroGreeting: { en: 'Chamber of a Thousand Mirrors', hi: 'शीश महल संध्या' },
  },
  ivory: {
    paperClass: 'ivory-paper',
    paperHex: '#F3EDE2',
    cardHex: '#FAF7F0',
    altCardHex: '#EAE1D2',
    inkHex: '#2A1E1B',
    mutedInkHex: '#69564E',
    accentHex: '#8C1D28',
    goldHex: '#B8924A',
    heroBgHex: '#D8C8B4',
    isDark: false,
    scriptClass: 'font-corinthia',
    displayClass: 'font-italiana',
    heroGreeting: { en: 'Shahi Mohar · Embossed Ivory Suite', hi: 'शाही मोहर · हस्तनिर्मित निमंत्रण' },
  },
  deepotsav: {
    paperClass: 'twilight-paper',
    paperHex: '#11182F',
    cardHex: '#192241',
    altCardHex: '#1F2A4D',
    inkHex: '#FAF0DE',
    mutedInkHex: '#C9C2B2',
    accentHex: '#E8891C',
    goldHex: '#F4B41A',
    heroBgHex: '#0B1120',
    isDark: true,
    scriptClass: 'font-pinyon',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Sacred Twilight Ghat', hi: 'पावन दीप संध्या घाट' },
  },
  roshni: {
    paperClass: 'roshni-paper',
    paperHex: '#FAF3E8',
    cardHex: '#FFF9F0',
    altCardHex: '#F3E5D0',
    inkHex: '#2A1215',
    mutedInkHex: '#693B40',
    accentHex: '#8C1622',
    goldHex: '#C99A42',
    heroBgHex: '#260A10',
    isDark: false,
    scriptClass: 'font-pinyon',
    displayClass: 'font-cinzel',
    heroGreeting: { en: 'Royal Ivory Jaali & Jasmine Mandap', hi: 'शाही जाली एवं मोगरा मंडप' },
  },
  temple: {
    paperClass: 'temple-paper',
    paperHex: '#F5E9D3',
    cardHex: '#FCF4E4',
    altCardHex: '#EEDBB9',
    inkHex: '#23160E',
    mutedInkHex: '#624834',
    accentHex: '#A62417',
    goldHex: '#C88A2B',
    heroBgHex: '#1E120A',
    isDark: false,
    scriptClass: 'font-script',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Sacred Temple Bells & Nilavilakku', hi: 'पावन मंदिर घंटे एवं दीप' },
  },
  gulab: {
    paperClass: 'gulab-paper',
    paperHex: '#FCEFF1',
    cardHex: '#FFF8F9',
    altCardHex: '#F5E0E5',
    inkHex: '#3A1923',
    mutedInkHex: '#6D4753',
    accentHex: '#9D2743',
    goldHex: '#B68550',
    heroBgHex: '#FCEFF1',
    isDark: false,
    scriptClass: 'font-corinthia',
    displayClass: 'font-bodoni',
    heroGreeting: { en: 'Charbagh Rose Garden Scroll', hi: 'चारबाग़ गुलाब उपवन' },
  },
  'jashn-birthday': {
    paperClass: 'velvet-plum-paper',
    paperHex: '#150E1E',
    cardHex: '#20162D',
    altCardHex: '#2A1D3A',
    inkHex: '#F5E9D6',
    mutedInkHex: '#CBB8CF',
    accentHex: '#E6B86A',
    goldHex: '#F2C97D',
    heroBgHex: '#0E0914',
    isDark: true,
    scriptClass: 'font-corinthia',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Candlelight Birthday Soirée', hi: 'जन्मदिन संध्या उत्सव' },
  },
  'confetti-garden': {
    paperClass: 'buttercream-paper',
    paperHex: '#FFF8EE',
    cardHex: '#FFFFFF',
    altCardHex: '#FBEBD6',
    inkHex: '#2B1F1B',
    mutedInkHex: '#6C544B',
    accentHex: '#D94F3D',
    goldHex: '#D49B38',
    heroBgHex: '#FFF8EE',
    isDark: false,
    scriptClass: 'font-pinyon',
    displayClass: 'font-bodoni',
    heroGreeting: { en: 'Sunlit Garden Birthday Feast', hi: 'उद्यान जन्मदिन उत्सव' },
  },
  'nanhe-kadam': {
    paperClass: 'sandalwood-nursery-paper',
    paperHex: '#FFF7EC',
    cardHex: '#FFFFFF',
    altCardHex: '#FCE8CD',
    inkHex: '#2D1A12',
    mutedInkHex: '#6D4B3B',
    accentHex: '#C4452B',
    goldHex: '#D98A1A',
    heroBgHex: '#FFF7EC',
    isDark: false,
    scriptClass: 'font-corinthia',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Bal Janmotsav · First Birthday', hi: 'बाल जन्मोत्सव · प्रथम जन्मदिन' },
  },
  'chanda-mama': {
    paperClass: 'chanda-night-paper',
    paperHex: '#101935',
    cardHex: '#18244A',
    altCardHex: '#213163',
    inkHex: '#F6EEDF',
    mutedInkHex: '#BFC9E3',
    accentHex: '#F2CB78',
    goldHex: '#F2CB78',
    heroBgHex: '#0A1024',
    isDark: true,
    scriptClass: 'font-script',
    displayClass: 'font-cinzel',
    heroGreeting: { en: 'Chanda Mama Starry 1st Birthday', hi: 'चंदा मामा शुभ प्रथम जन्मदिन' },
  },
  'baal-gopal': {
    paperClass: 'peacock-chandan-paper',
    paperHex: '#F6EFE0',
    cardHex: '#FFFFFF',
    altCardHex: '#E5F2EE',
    inkHex: '#153230',
    mutedInkHex: '#3F635E',
    accentHex: '#0F6B60',
    goldHex: '#C9932B',
    heroBgHex: '#0C3B38',
    isDark: false,
    scriptClass: 'font-corinthia',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Baal Gopal · Shubh Janmotsav', hi: 'बाल गोपाल · शुभ जन्मोत्सव' },
  },
  'shubh-aarti': {
    paperClass: 'sindoor-aarti-paper',
    paperHex: '#3E0B12',
    cardHex: '#52101A',
    altCardHex: '#631521',
    inkHex: '#FBF0D9',
    mutedInkHex: '#E7CFA3',
    accentHex: '#F4A324',
    goldHex: '#F7C96B',
    heroBgHex: '#28050A',
    isDark: true,
    scriptClass: 'font-pinyon',
    displayClass: 'font-cinzel',
    heroGreeting: { en: 'Panch-Aarti & Kalash Janmotsav', hi: 'पंचाआरती एवं कलश जन्मोत्सव' },
  },
  'rangoli-utsav': {
    paperClass: 'rangoli-turmeric-paper',
    paperHex: '#FFF8EB',
    cardHex: '#FFFFFF',
    altCardHex: '#FCE8CC',
    inkHex: '#331A10',
    mutedInkHex: '#6F4833',
    accentHex: '#D95D14',
    goldHex: '#C98A1A',
    heroBgHex: '#FFF8EB',
    isDark: false,
    scriptClass: 'font-script',
    displayClass: 'font-bodoni',
    heroGreeting: { en: 'Rangoli Courtyard Janmotsav', hi: 'रंगोली आँगन जन्मोत्सव' },
  },
  'ladli-kanya': {
    paperClass: 'ladli-rose-silk-paper',
    paperHex: '#FDF0F2',
    cardHex: '#FFFFFF',
    altCardHex: '#F9DFE5',
    inkHex: '#3A1121',
    mutedInkHex: '#753B4E',
    accentHex: '#B82952',
    goldHex: '#C99A3B',
    heroBgHex: '#FDF0F2',
    isDark: false,
    scriptClass: 'font-corinthia',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Ladli Kanya · Shubh Janmotsav', hi: 'लाड़ली कन्या · शुभ जन्मोत्सव' },
  },
  'devi-kumkum': {
    paperClass: 'devi-sindoor-silk-paper',
    paperHex: '#460D21',
    cardHex: '#58122B',
    altCardHex: '#691734',
    inkHex: '#FBF0DC',
    mutedInkHex: '#E5C6B8',
    accentHex: '#F4B844',
    goldHex: '#F4B844',
    heroBgHex: '#2B0713',
    isDark: true,
    scriptClass: 'font-pinyon',
    displayClass: 'font-cinzel',
    heroGreeting: { en: 'Devi Kumkum · Mandir Janmotsav', hi: 'देवी कुमकुम · मंदिर जन्मोत्सव' },
  },
  'gulab-baisa': {
    paperClass: 'jaipur-gulab-paper',
    paperHex: '#FFF2EE',
    cardHex: '#FFFFFF',
    altCardHex: '#FBE2DC',
    inkHex: '#3B1822',
    mutedInkHex: '#724451',
    accentHex: '#C7385B',
    goldHex: '#B88635',
    heroBgHex: '#FFF2EE',
    isDark: false,
    scriptClass: 'font-script',
    displayClass: 'font-bodoni',
    heroGreeting: { en: 'Gulab Baisa · Jaipur Courtyard', hi: 'गुलाब बाईसा · जयपुर आँगन' },
  },
  'kanha-makhan': {
    paperClass: 'kanha-vrindavan-paper',
    paperHex: '#11243E',
    cardHex: '#183254',
    altCardHex: '#21416B',
    inkHex: '#FAF1DF',
    mutedInkHex: '#C5D2E8',
    accentHex: '#F2B43A',
    goldHex: '#F2B43A',
    heroBgHex: '#0B182B',
    isDark: true,
    scriptClass: 'font-corinthia',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Kanha Makhan · Vrindavan Janmotsav', hi: 'कान्हा माखन · वृंदावन जन्मोत्सव' },
  },
  'veer-balak': {
    paperClass: 'veer-kesari-paper',
    paperHex: '#FDF3E2',
    cardHex: '#FFFFFF',
    altCardHex: '#F7E3C4',
    inkHex: '#2D160B',
    mutedInkHex: '#6D4832',
    accentHex: '#C94A14',
    goldHex: '#C48A1E',
    heroBgHex: '#FDF3E2',
    isDark: false,
    scriptClass: 'font-pinyon',
    displayClass: 'font-cinzel',
    heroGreeting: { en: 'Veer Balak · Surya Tilak Janmotsav', hi: 'वीर बालक · सूर्य तिलक जन्मोत्सव' },
  },
  'ganesh-aashish': {
    paperClass: 'ganesh-haldi-paper',
    paperHex: '#FFF7E4',
    cardHex: '#FFFFFF',
    altCardHex: '#F7E6C6',
    inkHex: '#2D150E',
    mutedInkHex: '#6B4635',
    accentHex: '#A8321A',
    goldHex: '#BD8319',
    heroBgHex: '#FFF7E4',
    isDark: false,
    scriptClass: 'font-script',
    displayClass: 'font-bodoni',
    heroGreeting: { en: 'Ganesha Aashish · Mandir Janmotsav', hi: 'गणेशा आशीष · मंदिर जन्मोत्सव' },
  },
  kohinoor: {
    paperClass: 'kohinoor-maroon-paper',
    paperHex: '#340912',
    cardHex: '#420D18',
    altCardHex: '#4F121F',
    inkHex: '#FAF0DD',
    mutedInkHex: '#E4C8A5',
    accentHex: '#E5B966',
    goldHex: '#E5B966',
    heroBgHex: '#21050B',
    isDark: true,
    scriptClass: 'font-pinyon',
    displayClass: 'font-bodoni',
    heroGreeting: { en: 'Mewar Royal Darbar · Udaipur', hi: 'मेवाड़ शाही दरबार · उदयपुर' },
  },
  vrindavan: {
    paperClass: 'vrindavan-braj-paper',
    paperHex: '#0E1C3D',
    cardHex: '#152754',
    altCardHex: '#1C3268',
    inkHex: '#FAF5EA',
    mutedInkHex: '#C9D3EC',
    accentHex: '#E6BC63',
    goldHex: '#E6BC63',
    heroBgHex: '#081229',
    isDark: true,
    scriptClass: 'font-corinthia',
    displayClass: 'font-cinzel',
    heroGreeting: { en: '॥ Shri Krishnah Sharanam Mama ॥', hi: '॥ श्री कृष्णः शरणं मम ॥' },
  },
  kesariya: {
    paperClass: 'kesariya-saffron-paper',
    paperHex: '#FFF3E0',
    cardHex: '#FFFFFF',
    altCardHex: '#FAE2BE',
    inkHex: '#2E140B',
    mutedInkHex: '#6D3E2B',
    accentHex: '#C83E1B',
    goldHex: '#E08B15',
    heroBgHex: '#FFF3E0',
    isDark: false,
    scriptClass: 'font-pinyon',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Jaipur Bandhani Terrace', hi: 'जयपुर केसरिया आँगन' },
  },
  'pattu-zari': {
    paperClass: 'pattu-zari-paper',
    paperHex: '#FAF4E6',
    cardHex: '#FFFFFF',
    altCardHex: '#F0E4C8',
    inkHex: '#16382C',
    mutedInkHex: '#4A6358',
    accentHex: '#1C4D3B',
    goldHex: '#C9962B',
    heroBgHex: '#FAF4E6',
    isDark: false,
    scriptClass: 'font-script',
    displayClass: 'font-italiana',
    heroGreeting: { en: 'Kanjeevaram Silk & Kolam Mandapam', hi: 'कांजीवरम रेशम एवं मंडपम' },
  },
  mehr: {
    paperClass: 'mehr-ivory-paper',
    paperHex: '#FAF6EE',
    cardHex: '#FFFFFF',
    altCardHex: '#F2E8D5',
    inkHex: '#1E2D24',
    mutedInkHex: '#526358',
    accentHex: '#1E3A2F',
    goldHex: '#C69C4E',
    heroBgHex: '#FAF6EE',
    isDark: false,
    scriptClass: 'font-corinthia',
    displayClass: 'font-cinzel',
    heroGreeting: { en: 'Charbagh Marble & Jaali Suite', hi: 'चारबाग़ संगमरमर एवं जाली' },
  },
  kalgi: {
    paperClass: 'kalgi-saffron-paper',
    paperHex: '#FFF6E8',
    cardHex: '#FFFFFF',
    altCardHex: '#F9E4C4',
    inkHex: '#2D160B',
    mutedInkHex: '#6E452F',
    accentHex: '#D65A14',
    goldHex: '#C4912A',
    heroBgHex: '#FFF6E8',
    isDark: false,
    scriptClass: 'font-pinyon',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Anand Karaj · Golden Sarovar', hi: 'आनंद कारज · स्वर्ण सरोवर' },
  },
  'shahi-badami': {
    paperClass: 'shahi-badami-paper',
    paperHex: '#2B080E',
    cardHex: '#3A0C15',
    altCardHex: '#4A101B',
    inkHex: '#FAF0DD',
    mutedInkHex: '#E5CAA4',
    accentHex: '#D4AF37',
    goldHex: '#E8C56B',
    heroBgHex: '#1D0409',
    isDark: true,
    scriptClass: 'font-pinyon',
    displayClass: 'font-bodoni',
    heroGreeting: { en: 'Shahi Badami · Kashmiri Paisley Darbar', hi: 'शाही बादामी · मेवाड़ मखमली दरबार' },
  },
  'van-upvan': {
    paperClass: 'van-upvan-sage-paper',
    paperHex: '#EFF4EE',
    cardHex: '#FFFFFF',
    altCardHex: '#E1EBE0',
    inkHex: '#1E3224',
    mutedInkHex: '#4A6351',
    accentHex: '#3B5944',
    goldHex: '#C59B38',
    heroBgHex: '#EFF4EE',
    isDark: false,
    scriptClass: 'font-corinthia',
    displayClass: 'font-playfair',
    heroGreeting: { en: 'Botanical Garden Birthday Pavilion', hi: 'वन उपवन जन्मोत्सव मंडप' },
  },
  'sindoori-rajhans': {
    paperClass: 'sindoori-rajhans-paper',
    paperHex: '#360709',
    cardHex: '#460B0E',
    altCardHex: '#561014',
    inkHex: '#FAF2E1',
    mutedInkHex: '#E6CFA6',
    accentHex: '#E0B252',
    goldHex: '#F0C76E',
    heroBgHex: '#240405',
    isDark: true,
    scriptClass: 'font-pinyon',
    displayClass: 'font-cinzel',
    heroGreeting: { en: 'Sindoori Rajhans · Royal Lotus Mandap', hi: 'सिंदूरी राजहंस · पावन कमल मंडप' },
  },
  'rajsi-baingani': {
    paperClass: 'rajsi-baingani-paper',
    paperHex: '#25081D',
    cardHex: '#340C29',
    altCardHex: '#431135',
    inkHex: '#FAF0F7',
    mutedInkHex: '#DFC2D6',
    accentHex: '#E5B95C',
    goldHex: '#F2CC78',
    heroBgHex: '#180412',
    isDark: true,
    scriptClass: 'font-corinthia',
    displayClass: 'font-bodoni',
    heroGreeting: { en: 'Rajsi Baingani · Imperial Marwar Palace', hi: 'राजसी बैंगनी · जोधपुर शाही महल' },
  },
  'neel-chandani': {
    paperClass: 'neel-chandani-paper',
    paperHex: '#0B162C',
    cardHex: '#122242',
    altCardHex: '#192E57',
    inkHex: '#F1F5F9',
    mutedInkHex: '#CBD5E1',
    accentHex: '#E2E8F0',
    goldHex: '#CBD5E1',
    heroBgHex: '#060D1C',
    isDark: true,
    scriptClass: 'font-pinyon',
    displayClass: 'font-italiana',
    heroGreeting: { en: 'Neel Chandani · Starlit Sangeet Pavilion', hi: 'नील चाँदनी · तारों भरी संगीत संध्या' },
  },
};

const CEREMONY_SWATCHES: Record<CeremonyId, { name: { en: string; hi: string }; colors: string[] }> = {
  haldi: {
    name: { en: 'Marigold & Haldi Silk', hi: 'गेंदा पीला व रेशम' },
    colors: ['#E8891C', '#F2B705', '#FAF0DE'],
  },
  mehendi: {
    name: { en: 'Emerald & Leheriya', hi: 'पन्ना हरा व लहरिया' },
    colors: ['#1E563B', '#4B8B5E', '#D4A84B'],
  },
  sangeet: {
    name: { en: 'Midnight Indigo & Gold', hi: 'रात्रि नीला व सुनहरा' },
    colors: ['#1D2347', '#C2933F', '#B3261E'],
  },
  pheras: {
    name: { en: 'Sindoor & Benarasi', hi: 'सिंदूरी लाल व बनारसी' },
    colors: ['#B3261E', '#D4A84B', '#EFDEBF'],
  },
};


function computeCountdown(targetIso: string) {
  const trimmed = (targetIso || '').trim();
  if (!trimmed) {
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  }
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  const targetMs = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3])).getTime()
    : new Date(trimmed).getTime();
  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, mins: 0, secs: 0 };
  }
  const diff = Math.max(0, targetMs - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);
  const secs = Math.floor((diff / 1000) % 60);
  return { days, hours, mins, secs };
}

const LiveCountdownGrid: React.FC<{
  targetIso: string;
  stageLang: Language;
  goldHex: string;
  accentHex: string;
  inkHex: string;
  mutedInkHex: string;
  cardBgHex: string;
  isDark: boolean;
}> = React.memo(({ targetIso, stageLang, goldHex, accentHex, inkHex, mutedInkHex, cardBgHex, isDark }) => {
  const [countdown, setCountdown] = useState(() => computeCountdown(targetIso));

  useEffect(() => {
    setCountdown(computeCountdown(targetIso));
    const timer = window.setInterval(() => {
      setCountdown(computeCountdown(targetIso));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [targetIso]);

  return (
    <div className="mt-3 grid grid-cols-4 gap-2">
      {[
        { val: countdown.days, label: stageLang === 'en' ? 'Days' : 'दिन' },
        { val: countdown.hours, label: stageLang === 'en' ? 'Hrs' : 'घंटे' },
        { val: countdown.mins, label: stageLang === 'en' ? 'Min' : 'मिनट' },
        { val: countdown.secs, label: stageLang === 'en' ? 'Sec' : 'सेकंड' },
      ].map((unit) => (
        <div
          key={unit.label}
          style={{
            borderColor: `${goldHex}80`,
            backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : cardBgHex,
          }}
          className="rounded-xl border py-2 px-1 shadow-2xs"
        >
          <p
            style={{ color: isDark ? goldHex : accentHex }}
            className="font-display text-xl sm:text-2xl font-semibold tabular-nums leading-none"
          >
            {String(unit.val).padStart(2, '0')}
          </p>
          <p
            style={{ color: isDark ? inkHex : mutedInkHex, opacity: isDark ? 0.82 : 1 }}
            className="mt-1 text-[9.5px] uppercase tracking-[0.12em]"
          >
            {unit.label}
          </p>
        </div>
      ))}
    </div>
  );
});

function parseCeremonyIcsWindow(
  ceremonyId: string,
  dateStr?: string,
  timeStr?: string
): { start: string; end: string } {
  const formatLocalCompact = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;
  };

  if (dateStr) {
    const cleanedDate = dateStr
      .replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),?\s*/i, '')
      .trim();
    const parsedDay = new Date(cleanedDate);
    if (!Number.isNaN(parsedDay.getTime())) {
      let hours = 18;
      let mins = 0;
      if (timeStr) {
        const m = /(\d{1,2}):(\d{2})\s*(AM|PM)?/i.exec(timeStr);
        if (m) {
          hours = Number(m[1]);
          mins = Number(m[2]);
          const mer = (m[3] || '').toUpperCase();
          if (mer === 'PM' && hours < 12) hours += 12;
          if (mer === 'AM' && hours === 12) hours = 0;
        }
      }
      const startDt = new Date(
        parsedDay.getFullYear(),
        parsedDay.getMonth(),
        parsedDay.getDate(),
        hours,
        mins,
        0
      );
      const endDt = new Date(startDt.getTime() + 3 * 60 * 60 * 1000);
      return {
        start: formatLocalCompact(startDt),
        end: formatLocalCompact(endDt),
      };
    }
  }

  const dateMap: Record<string, { start: string; end: string }> = {
    haldi: { start: '20270212T103000', end: '20270212T133000' },
    mehendi: { start: '20270212T163000', end: '20270212T193000' },
    sangeet: { start: '20270213T193000', end: '20270213T233000' },
    pheras: { start: '20270214T160000', end: '20270214T220000' },
  };
  return dateMap[ceremonyId] || { start: '20270214T170000', end: '20270214T210000' };
}

function downloadCeremonyIcs(
  ceremony: {
    id: string;
    title: { en: string; hi: string };
    subtitle: { en: string; hi: string };
    attire: { en: string; hi: string };
    venue: { en: string; hi: string };
    date?: { en: string; hi: string };
    time?: string;
  },
  groom: string,
  bride: string,
  cityFallback = 'Udaipur'
) {
  const slot = parseCeremonyIcsWindow(ceremony.id, ceremony.date?.en, ceremony.time);
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z');
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NIMANTRAN//Sacred Invite//EN',
    'BEGIN:VEVENT',
    `UID:${ceremony.id}-nimantran@invite`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${slot.start}`,
    `DTEND:${slot.end}`,
    `SUMMARY:${groom}${bride ? ` & ${bride}` : ''} — ${ceremony.title.en}`,
    `DESCRIPTION:${ceremony.subtitle.en}. Attire: ${ceremony.attire.en}`,
    `LOCATION:${ceremony.venue.en}, ${cityFallback}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${ceremony.id}-${groom.toLowerCase().replace(/\s+/g, '-')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export const InteractiveInvitePhoneStage: React.FC<InteractiveInvitePhoneStageProps> = ({
  theme,
  lang,
  groomName,
  brideName,
  weddingDateLabel,
  cityLabel,
  compact = false,
  onOpenFullPreview,
  onCloseInline,
  externalOpenSignal = 0,
  customization,
  onOpenCustomizer,
  guestFamilyGreeting,
  allowedEventIds,
  onSubmitRsvp,
}) => {
  const skin = THEME_SKINS[theme.id] || THEME_SKINS.jharokha;
  const isBirthday = theme.celebrationType === 'birthday';
  const isBabyBirthday = theme.birthdayFlavor === 'baby';
  const isHinduBirthday = theme.birthdayFlavor === 'hindu';
  const isGirlHindu = isHinduBirthday && theme.birthdayGender === 'girl';
  const isBoyHindu = isHinduBirthday && theme.birthdayGender === 'boy';
  const defaultEvents = isGirlHindu
    ? HINDU_GIRL_BIRTHDAY_CEREMONIES
    : isBoyHindu
      ? HINDU_BOY_BIRTHDAY_CEREMONIES
      : isHinduBirthday
        ? HINDU_BIRTHDAY_CEREMONIES
        : isBabyBirthday
          ? BABY_BIRTHDAY_CEREMONIES
          : isBirthday
            ? BIRTHDAY_CEREMONIES
            : theme.id === 'paithani'
              ? PAITHANI_CEREMONIES
              : CEREMONIES;
  const activeSwatches = isGirlHindu
    ? HINDU_GIRL_BIRTHDAY_SWATCHES
    : isBoyHindu
      ? HINDU_BOY_BIRTHDAY_SWATCHES
      : isHinduBirthday
        ? HINDU_BIRTHDAY_SWATCHES
        : isBabyBirthday
          ? BABY_BIRTHDAY_SWATCHES
          : isBirthday
            ? BIRTHDAY_SWATCHES
            : theme.id === 'paithani'
              ? PAITHANI_SWATCHES
              : CEREMONY_SWATCHES;

  const activeEvents = React.useMemo(() => {
    const baseList =
      customization && customization.events
        ? customization.events.map((ev) => ({
            id: ev.id,
            title: { en: ev.titleEn, hi: ev.titleHi || ev.titleEn },
            subtitle: { en: ev.subtitleEn, hi: ev.subtitleEn },
            date: { en: ev.dateEn, hi: ev.dateHi || ev.dateEn },
            time: ev.time,
            venue: { en: ev.venueEn, hi: ev.venueHi || ev.venueEn },
            attire: { en: ev.attireEn, hi: ev.attireHi || ev.attireEn },
            accentHex: ev.accentHex || skin.accentHex,
            image: ev.image,
            imageAlt: ev.imageAlt || ev.titleEn,
            swatchColors: ev.swatchColors,
          }))
        : defaultEvents.map((ev) => ({
            ...ev,
            swatchColors:
              (activeSwatches as Record<string, { name: { en: string; hi: string }; colors: string[] }>)[
                ev.id
              ]?.colors || ['#C88A2B', '#9E2A2B', '#FAF6EE'],
          }));

    if (allowedEventIds && allowedEventIds.length > 0) {
      const filtered = baseList.filter((ev) => allowedEventIds.includes(ev.id));
      if (filtered.length > 0) return filtered;
    }
    return baseList;
  }, [customization, defaultEvents, activeSwatches, skin.accentHex, allowedEventIds]);

  const isSectionEnabled = useCallback(
    (key: CardSectionKey) => (customization ? customization.enabledSections[key] !== false : true),
    [customization]
  );

  const effectiveTargetIso = customization?.targetIsoDate || COUPLE_DEFAULTS.targetIsoDate;

  const cardLangMode = customization?.cardLangMode || 'both';
  const [stageLang, setStageLang] = useState<Language>(
    cardLangMode === 'hi' ? 'hi' : cardLangMode === 'en' ? 'en' : lang
  );
  const [isOpened, setIsOpened] = useState(false);
  const [bodyOpen, setBodyOpen] = useState(false);
  const [sheeshVideoFinished, setSheeshVideoFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [songPlaying, setSongPlaying] = useState(false);
  const [resolvedAudioUrl, setResolvedAudioUrl] = useState<string>('');
  const [mapExpanded, setMapExpanded] = useState(false);
  const [hideFloatingBar, setHideFloatingBar] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  // RSVP State & India-First Client-Side Validation + Direct WhatsApp Reply
  const [rsvpName, setRsvpName] = useState(guestFamilyGreeting || '');
  const [rsvpContact, setRsvpContact] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<AttendanceStatus>('attending');
  const [rsvpGuestCount, setRsvpGuestCount] = useState(2);
  const [rsvpSide, setRsvpSide] = useState<FamilySide>(() =>
    customization?.familySide === 'bride-first' ? 'bride' : 'groom'
  );
  const [rsvpDiet, setRsvpDiet] = useState<DietaryPreference>('pure_veg');
  const [rsvpArrival, setRsvpArrival] = useState('');
  const [rsvpEvents, setRsvpEvents] = useState<string[]>(() => activeEvents.map((e) => e.id));
  const [rsvpNote, setRsvpNote] = useState('');
  const [rsvpErrors, setRsvpErrors] = useState<RsvpValidationErrors>({});
  const [rsvpSubmitError, setRsvpSubmitError] = useState<string | null>(null);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpTouched, setRsvpTouched] = useState<{ name?: boolean; contact?: boolean }>({});
  const [rsvpSent, setRsvpSent] = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const welcomeSectionRef = useRef<HTMLDivElement | null>(null);
  const rsvpSectionRef = useRef<HTMLDivElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const customAudioElRef = useRef<HTMLAudioElement | null>(null);
  const videoCoverRef = useRef<HTMLVideoElement | null>(null);
  const songIntervalRef = useRef<number | null>(null);
  const openTimerRef = useRef<number[]>([]);
  const sealNudgeTimerRef = useRef<number | null>(null);
  const [sealNudge, setSealNudge] = useState(false);
  const [ivoryCardExtracted, setIvoryCardExtracted] = useState(false);

  useEffect(() => {
    if (cardLangMode === 'hi') {
      setStageLang('hi');
    } else if (cardLangMode === 'en') {
      setStageLang('en');
    } else {
      setStageLang(lang);
    }
  }, [lang, cardLangMode]);

  useEffect(() => {
    if (guestFamilyGreeting && !rsvpTouched.name) {
      setRsvpName(guestFamilyGreeting);
    }
  }, [guestFamilyGreeting, rsvpTouched.name]);

  useEffect(() => {
    setRsvpEvents(activeEvents.map((e) => e.id));
  }, [theme.id, activeEvents.length]);

  // Resolve custom uploaded audio (IndexedDB) or external MP3 URL
  useEffect(() => {
    let active = true;
    const directUrl = customization?.songUrl?.trim() || '';
    if (directUrl) {
      setResolvedAudioUrl(directUrl);
      return;
    }
    if (customization?.songAudioKey) {
      loadCustomAudioUrl(customization.songAudioKey).then((url) => {
        if (active) setResolvedAudioUrl(url || '');
      });
    } else {
      setResolvedAudioUrl('');
    }
    return () => {
      active = false;
    };
  }, [customization?.songUrl, customization?.songAudioKey]);

  // Reset opening state when theme changes
  useEffect(() => {
    openTimerRef.current.forEach((id) => window.clearTimeout(id));
    openTimerRef.current = [];
    setIsOpened(false);
    setBodyOpen(false);
    setSongPlaying(false);
    setMapExpanded(false);
    setHideFloatingBar(false);
    setRsvpSent(false);
    setRsvpErrors({});
    setRsvpTouched({});
    setSealNudge(false);
    setIvoryCardExtracted(false);
    setSheeshVideoFinished(false);
    if (sealNudgeTimerRef.current) {
      window.clearTimeout(sealNudgeTimerRef.current);
      sealNudgeTimerRef.current = null;
    }
    if (customAudioElRef.current) {
      customAudioElRef.current.pause();
      customAudioElRef.current.currentTime = 0;
    }
    if (videoCoverRef.current && (theme.sealConfig || theme.id === 'sheesh-mahal')) {
      videoCoverRef.current.pause();
      try {
        videoCoverRef.current.currentTime = theme.sealConfig?.pauseAtSec ?? 0;
      } catch {
        // Ignore if metadata not loaded yet
      }
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [theme.id, theme.sealConfig, theme.coverVideoUrl]);

  // Subtle synthesized temple chime / water harp chord (supports custom preset)
  const playTempleChime = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const preset = customization?.songPresetId;
      const notes =
        preset === 'temple'
          ? [329.63, 440.0, 523.25, 659.25]
          : preset === 'bansuri'
            ? [392.0, 493.88, 587.33, 783.99]
            : preset === 'dholak'
              ? [349.23, 440.0, 523.25, 698.46]
              : preset === 'lullaby'
                ? [523.25, 587.33, 659.25, 783.99, 1046.5]
                : preset === 'shehnai'
                  ? [523.25, 659.25, 783.99, 1046.5]
                  : isGirlHindu
                    ? [523.25, 587.33, 659.25, 783.99, 1046.5]
                    : isBoyHindu || isHinduBirthday
                      ? [392.0, 440.0, 523.25, 659.25, 783.99]
                      : isBabyBirthday
                        ? [523.25, 523.25, 587.33, 523.25, 698.46, 659.25]
                        : isBirthday
                          ? [261.63, 261.63, 293.66, 261.63, 349.23, 329.63]
                          : theme.id === 'temple' || theme.id === 'pattu-zari' || theme.id === 'kalgi'
                            ? [329.63, 440.0, 523.25, 659.25]
                            : theme.id === 'paithani' || theme.id === 'kesariya'
                              ? [349.23, 440.0, 523.25, 698.46]
                              : theme.id === 'gulab' || theme.id === 'vrindavan' || theme.id === 'mehr'
                                ? [392.0, 493.88, 587.33, 783.99]
                                : [523.25, 659.25, 783.99, 1046.5];
      const step = isHinduBirthday ? 0.14 : isBirthday ? 0.19 : 0.09;
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = isHinduBirthday || isBabyBirthday ? 'sine' : isBirthday ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * step);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * step);
        gain.gain.exponentialRampToValueAtTime(0.04, ctx.currentTime + idx * step + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * step + 1.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * step);
        osc.stop(ctx.currentTime + idx * step + 1.1);
      });
    } catch {
      // Safe no-op if audio blocked
    }
  }, [
    soundEnabled,
    customization?.songPresetId,
    theme.id,
    isBirthday,
    isBabyBirthday,
    isHinduBirthday,
    isGirlHindu,
    isBoyHindu,
  ]);

  // Sync real uploaded/custom MP3 audio or fallback acoustic chime loop
  useEffect(() => {
    if (songIntervalRef.current) {
      window.clearInterval(songIntervalRef.current);
      songIntervalRef.current = null;
    }

    if (!songPlaying || !soundEnabled) {
      if (customAudioElRef.current) {
        customAudioElRef.current.pause();
      }
      return;
    }

    if (resolvedAudioUrl) {
      if (!customAudioElRef.current) {
        customAudioElRef.current = new Audio();
        customAudioElRef.current.loop = true;
      }
      if (customAudioElRef.current.src !== resolvedAudioUrl) {
        customAudioElRef.current.src = resolvedAudioUrl;
      }
      customAudioElRef.current.play().catch(() => {
        // Fallback softly to chime if autoplay/codec blocked
        playTempleChime();
      });
      return;
    }

    playTempleChime();
    songIntervalRef.current = window.setInterval(() => {
      playTempleChime();
    }, 3200);

    return () => {
      if (songIntervalRef.current) {
        window.clearInterval(songIntervalRef.current);
        songIntervalRef.current = null;
      }
    };
  }, [songPlaying, soundEnabled, resolvedAudioUrl, playTempleChime]);

  useEffect(() => {
    return () => {
      if (customAudioElRef.current) {
        customAudioElRef.current.pause();
        customAudioElRef.current = null;
      }
    };
  }, []);

  const triggerOpenGate = useCallback(
    (_clickEvent?: React.MouseEvent<HTMLElement>) => {
      if (isOpened) return;
      setIsOpened(true);
      setSealNudge(false);
      if (resolvedAudioUrl && soundEnabled) {
        setSongPlaying(true);
      } else {
        playTempleChime();
      }

      if (theme.id === 'sheesh-mahal' && theme.coverVideoUrl) {
        setSheeshVideoFinished(false);
        const video = videoCoverRef.current;
        if (video) {
          try {
            video.currentTime = 0;
          } catch {
            // The first frame is already the default before metadata has loaded.
          }
          video.play().catch(() => {
            setSheeshVideoFinished(true);
            const revealTimer = window.setTimeout(() => setBodyOpen(true), 1200);
            openTimerRef.current.push(revealTimer);
          });
        } else {
          setSheeshVideoFinished(true);
          const revealTimer = window.setTimeout(() => setBodyOpen(true), 1200);
          openTimerRef.current.push(revealTimer);
        }
        return;
      }

      if (theme.coverVideoUrl && theme.sealConfig) {
        const vid = videoCoverRef.current;
        if (vid) {
          try {
            if (vid.currentTime < theme.sealConfig.pauseAtSec - 0.15 || vid.currentTime > theme.sealConfig.pauseAtSec + 1.2) {
              vid.currentTime = theme.sealConfig.pauseAtSec;
            }
            vid.playbackRate =
              theme.id === 'ivory' ||
              theme.id === 'gulab' ||
              theme.id === 'confetti-garden' ||
              theme.id === 'jashn-birthday' ||
              theme.id === 'kanha-makhan' ||
              theme.id === 'devi-kumkum' ||
              theme.id === 'mehr' ||
              theme.id === 'roshni' ||
              theme.id === 'ladli-kanya' ||
              theme.id === 'shubh-aarti' ||
              theme.id === 'vrindavan' ||
              theme.id === 'rangoli-utsav' ||
              theme.id === 'veer-balak' ||
              theme.id === 'gulab-baisa' ||
              theme.id === 'temple' ||
              theme.id === 'jharokha' ||
              theme.id === 'pattu-zari' ||
              theme.id === 'baal-gopal' ||
              theme.id === 'kesariya' ||
              theme.id === 'kalgi' ||
              theme.id === 'deepotsav'
                ? 1.0
                : 1.05;
            vid.play().catch(() => {
              setIvoryCardExtracted(true);
              setBodyOpen(true);
            });
          } catch {
            // fallback timer handles reveal
          }
        }
        if (
          theme.id === 'ivory' ||
          theme.id === 'gulab' ||
          theme.id === 'confetti-garden' ||
          theme.id === 'jashn-birthday' ||
          theme.id === 'kanha-makhan' ||
          theme.id === 'devi-kumkum' ||
          theme.id === 'mehr' ||
          theme.id === 'roshni' ||
          theme.id === 'ladli-kanya' ||
          theme.id === 'shubh-aarti' ||
          theme.id === 'vrindavan' ||
          theme.id === 'veer-balak' ||
          theme.id === 'gulab-baisa' ||
          theme.id === 'temple' ||
          theme.id === 'jharokha' ||
          theme.id === 'pattu-zari' ||
          theme.id === 'baal-gopal' ||
          theme.id === 'kesariya' ||
          theme.id === 'kalgi' ||
          theme.id === 'deepotsav'
        ) {
          const extractDelayMs =
            theme.id === 'kanha-makhan'
              ? 6250
              : theme.id === 'roshni' || theme.id === 'baal-gopal'
                ? 5350
                : theme.id === 'mehr' || theme.id === 'temple'
                  ? 5150
                  : theme.id === 'kalgi'
                    ? 4950
                    : theme.id === 'shubh-aarti' || theme.id === 'vrindavan' || theme.id === 'jharokha'
                      ? 4900
                      : theme.id === 'confetti-garden' || theme.id === 'ladli-kanya'
                        ? 4850
                        : theme.id === 'veer-balak'
                          ? 4800
                          : theme.id === 'devi-kumkum' || theme.id === 'kesariya'
                            ? 4750
                            : theme.id === 'pattu-zari'
                              ? 4650
                              : theme.id === 'gulab-baisa'
                                ? 4500
                                : theme.id === 'gulab' || theme.id === 'jashn-birthday'
                                  ? 3850
                                  : theme.id === 'deepotsav'
                                    ? 3150
                                    : 3750;
          const tExtract = window.setTimeout(() => setIvoryCardExtracted(true), extractDelayMs);
          openTimerRef.current.push(tExtract);
        }
        const t = window.setTimeout(() => setBodyOpen(true), theme.sealConfig.openDurationMs);
        openTimerRef.current.push(t);
        return;
      }

      if (theme.id === 'paithani') {
        const t = window.setTimeout(() => setBodyOpen(true), 1250);
        openTimerRef.current.push(t);
        return;
      }

      if (theme.id === 'mehndi-jhoola') {
        // Step 1 (0–720ms): All marigold garlands part aside -> Step 2 (620–1670ms): Carved wooden gate opens fully -> Transition at 2050ms
        const t = window.setTimeout(() => setBodyOpen(true), 2050);
        openTimerRef.current.push(t);
        return;
      }

      if (
        theme.id === 'jharokha' ||
        theme.id === 'roshni' ||
        theme.id === 'temple' ||
        theme.id === 'nanhe-kadam' ||
        theme.id === 'baal-gopal' ||
        theme.id === 'ladli-kanya' ||
        theme.id === 'kanha-makhan' ||
        theme.id === 'veer-balak' ||
        theme.id === 'mehr'
      ) {
        const t = window.setTimeout(() => setBodyOpen(true), 1550);
        openTimerRef.current.push(t);
        return;
      }

      if (theme.id === 'sheesh-mahal') {
        const t = window.setTimeout(() => setBodyOpen(true), 1650);
        openTimerRef.current.push(t);
        return;
      }

      if (
        theme.id === 'deepotsav' ||
        theme.id === 'jashn-birthday' ||
        theme.id === 'chanda-mama' ||
        theme.id === 'shubh-aarti' ||
        theme.id === 'rangoli-utsav' ||
        theme.id === 'devi-kumkum' ||
        theme.id === 'gulab-baisa' ||
        theme.id === 'ganesh-aashish' ||
        theme.id === 'kohinoor' ||
        theme.id === 'vrindavan' ||
        theme.id === 'kesariya' ||
        theme.id === 'pattu-zari' ||
        theme.id === 'kalgi'
      ) {
        const t = window.setTimeout(() => setBodyOpen(true), 1150);
        openTimerRef.current.push(t);
        return;
      }

      if (theme.id === 'ivory' || theme.id === 'gulab' || theme.id === 'confetti-garden') {
        const t = window.setTimeout(() => setBodyOpen(true), 1080);
        openTimerRef.current.push(t);
        return;
      }

      // Default Haveli Doors / Panoramic Arch
      const t = window.setTimeout(() => setBodyOpen(true), 1300);
      openTimerRef.current.push(t);
    },
    [isOpened, playTempleChime, resolvedAudioUrl, soundEnabled, theme.id, theme.coverVideoUrl]
  );

  const handleReplay = useCallback(() => {
    openTimerRef.current.forEach((id) => window.clearTimeout(id));
    openTimerRef.current = [];
    setSongPlaying(false);
    setBodyOpen(false);
    setIsOpened(false);
    setHideFloatingBar(false);
    setSealNudge(false);
    setIvoryCardExtracted(false);
    setSheeshVideoFinished(false);
    if (videoCoverRef.current && (theme.sealConfig || theme.id === 'sheesh-mahal')) {
      videoCoverRef.current.pause();
      try {
        videoCoverRef.current.currentTime = theme.sealConfig?.pauseAtSec ?? 0;
      } catch {
        // Ignore
      }
    }
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [theme.id, theme.sealConfig]);

  const stageMotionMode: StageMotionMode =
    theme.id === 'paithani' || theme.id === 'pattu-zari' || theme.id === 'mehr'
      ? 'akshata-cloth'
      : theme.id === 'vrindavan'
        ? 'water-lotus'
        : theme.id === 'gulab' || theme.id === 'gulab-baisa' || theme.id === 'ladli-kanya'
          ? 'rose-petals'
          : theme.id === 'mehndi-jhoola' ||
              theme.id === 'kesariya' ||
              theme.id === 'kalgi' ||
              theme.id === 'rangoli-utsav' ||
              theme.id === 'ganesh-aashish' ||
              theme.id === 'baal-gopal' ||
              theme.id === 'kanha-makhan'
            ? 'marigold-shower'
            : theme.id === 'sheesh-mahal' || theme.id === 'chanda-mama'
              ? 'mirror-glints'
              : theme.id === 'ivory' ||
                  theme.id === 'jashn-birthday' ||
                  theme.id === 'confetti-garden' ||
                  theme.id === 'nanhe-kadam'
                ? 'confetti-wish'
                : 'diya-sparks';

  useEffect(() => {
    if (externalOpenSignal > 0) {
      triggerOpenGate();
    }
  }, [externalOpenSignal, triggerOpenGate]);

  // IntersectionObserver for `.jharokha-reveal` & RSVP floating bar hide
  useEffect(() => {
    if (!bodyOpen) return;
    const rootEl = scrollContainerRef.current;
    if (!rootEl) return;

    const revealNodes = Array.from(rootEl.querySelectorAll('.jharokha-reveal'));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { root: rootEl, threshold: 0.1, rootMargin: '0px 0px -16px 0px' }
    );
    revealNodes.forEach((el) => io.observe(el));

    let rsvpIo: IntersectionObserver | null = null;
    if (rsvpSectionRef.current) {
      rsvpIo = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setHideFloatingBar(entry.isIntersecting);
          });
        },
        { root: rootEl, threshold: 0.18 }
      );
      rsvpIo.observe(rsvpSectionRef.current);
    }

    return () => {
      io.disconnect();
      rsvpIo?.disconnect();
    };
  }, [bodyOpen, stageLang, theme.id]);

  const hasCustom = Boolean(customization);
  const rawGroom = hasCustom
    ? (isBirthday && !isGirlHindu ? customization?.primaryName : isBirthday ? groomName : customization?.primaryName)?.trim() ?? ''
    : (isBirthday && !isGirlHindu ? customization?.primaryName : isBirthday ? groomName : customization?.primaryName)?.trim() ||
      groomName.trim() ||
      'Aarav';
  const rawBride = hasCustom
    ? (isGirlHindu ? customization?.primaryName : customization?.partnerName)?.trim() ?? ''
    : (isGirlHindu ? customization?.primaryName : customization?.partnerName)?.trim() ||
      brideName.trim() ||
      'Meera';
  const rawGroomHi = (
    isBirthday && !isGirlHindu
      ? customization?.primaryNameHi
      : isBirthday
        ? ''
        : customization?.primaryNameHi
  )?.trim();
  const rawBrideHi = (
    isGirlHindu ? customization?.primaryNameHi : customization?.partnerNameHi
  )?.trim();
  const isBrideFirst = !isBirthday && customization?.familySide === 'bride-first';
  const cleanGroom = isBrideFirst ? rawBride : rawGroom;
  const cleanBride = isBrideFirst ? rawGroom : rawBride;
  const swappedGroomHi = isBrideFirst ? rawBrideHi : rawGroomHi;
  const swappedBrideHi = isBrideFirst ? rawGroomHi : rawBrideHi;
  const groomHi =
    swappedGroomHi ||
    (cleanGroom === COUPLE_DEFAULTS.groomEn
      ? COUPLE_DEFAULTS.groomHi
      : cleanGroom === COUPLE_DEFAULTS.brideEn
        ? COUPLE_DEFAULTS.brideHi
        : cleanGroom);
  const brideHi =
    swappedBrideHi ||
    (cleanBride === COUPLE_DEFAULTS.brideEn
      ? COUPLE_DEFAULTS.brideHi
      : cleanBride === COUPLE_DEFAULTS.groomEn
        ? COUPLE_DEFAULTS.groomHi
        : cleanBride);
  const groomInitial = (cleanGroom[0] || (hasCustom ? '✦' : 'A')).toUpperCase();
  const brideInitial = (cleanBride[0] || (hasCustom ? '✦' : 'M')).toUpperCase();
  const celebrantEn = hasCustom
    ? (customization?.primaryName ?? '').trim()
    : isGirlHindu
      ? (customization?.primaryName?.trim() || cleanBride)
      : (customization?.primaryName?.trim() || cleanGroom);
  const celebrantHi = hasCustom
    ? (customization?.primaryNameHi?.trim() ||
        (celebrantEn
          ? isGirlHindu
            ? (celebrantEn === COUPLE_DEFAULTS.brideEn ? COUPLE_DEFAULTS.brideHi : celebrantEn)
            : (celebrantEn === COUPLE_DEFAULTS.groomEn ? COUPLE_DEFAULTS.groomHi : celebrantEn)
          : ''))
    : customization?.primaryNameHi?.trim() ||
      (isGirlHindu
        ? (celebrantEn === COUPLE_DEFAULTS.brideEn ? COUPLE_DEFAULTS.brideHi : celebrantEn)
        : (celebrantEn === COUPLE_DEFAULTS.groomEn ? COUPLE_DEFAULTS.groomHi : celebrantEn));
  const celebrantInitial = (celebrantEn[0] || celebrantHi[0] || '★').toUpperCase();

  const cityDisplay = hasCustom
    ? (stageLang === 'hi'
        ? customization?.cityLabelHi?.trim() || customization?.cityLabel?.trim() || ''
        : customization?.cityLabel?.trim() || customization?.cityLabelHi?.trim() || '')
    : stageLang === 'hi'
      ? customization?.cityLabelHi?.trim() ||
        customization?.cityLabel?.trim() ||
        cityLabel ||
        COUPLE_DEFAULTS.city.hi
      : customization?.cityLabel?.trim() ||
        customization?.cityLabelHi?.trim() ||
        cityLabel ||
        COUPLE_DEFAULTS.city.en;
  const dateDisplay = hasCustom
    ? (stageLang === 'hi'
        ? customization?.dateLabelHi?.trim() || customization?.dateLabel?.trim() || ''
        : customization?.dateLabel?.trim() || customization?.dateLabelHi?.trim() || '')
    : stageLang === 'hi'
      ? customization?.dateLabelHi?.trim() ||
        customization?.dateLabel?.trim() ||
        weddingDateLabel ||
        COUPLE_DEFAULTS.weddingDates.hi
      : customization?.dateLabel?.trim() ||
        customization?.dateLabelHi?.trim() ||
        weddingDateLabel ||
        COUPLE_DEFAULTS.weddingDates.en;
  const venueDisplay = hasCustom
    ? (stageLang === 'hi'
        ? customization?.venueNameHi?.trim() || customization?.venueName?.trim() || ''
        : customization?.venueName?.trim() || customization?.venueNameHi?.trim() || '')
    : stageLang === 'hi'
      ? customization?.venueNameHi?.trim() ||
        customization?.venueName?.trim() ||
        COUPLE_DEFAULTS.palaceName.hi
      : customization?.venueName?.trim() ||
        customization?.venueNameHi?.trim() ||
        COUPLE_DEFAULTS.palaceName.en;
  const milestoneDisplay =
    stageLang === 'hi'
      ? customization?.milestoneLabelHi?.trim() || customization?.milestoneLabel?.trim() || ''
      : customization?.milestoneLabel?.trim() || customization?.milestoneLabelHi?.trim() || '';
  const directionsDisplay =
    stageLang === 'hi'
      ? customization?.directionsNoteHi?.trim() || customization?.directionsNote?.trim() || ''
      : customization?.directionsNote?.trim() || customization?.directionsNoteHi?.trim() || '';
  const rsvpDeadlineDisplay = hasCustom
    ? (stageLang === 'hi'
        ? customization?.rsvpDeadlineHi?.trim() || customization?.rsvpDeadline?.trim() || ''
        : customization?.rsvpDeadline?.trim() || customization?.rsvpDeadlineHi?.trim() || '')
    : stageLang === 'hi'
      ? customization?.rsvpDeadlineHi?.trim() || customization?.rsvpDeadline?.trim() || '01 फ़रवरी 2027'
      : customization?.rsvpDeadline?.trim() || customization?.rsvpDeadlineHi?.trim() || '01 Feb 2027';
  const whatsappDigits = normalizeIndianWhatsappDigits(customization?.rsvpWhatsapp);
  const dateCityLine = [dateDisplay, cityDisplay].filter(Boolean).join(' · ');
  const venueMapHref =
    customization?.venueMapUrl?.trim() ||
    buildDirectGoogleMapsUrl(
      customization?.venueName?.trim() || venueDisplay,
      customization?.directionsNote?.trim() || directionsDisplay,
      customization?.cityLabel?.trim() || cityDisplay
    );
  const activeBirthdayName = stageLang === 'hi' ? celebrantHi : celebrantEn;
  const activeBirthdayMilestone =
    milestoneDisplay ||
    (hasCustom
      ? ''
      : isHinduBirthday
        ? stageLang === 'hi'
          ? 'शुभ जन्मोत्सव'
          : 'Shubh Janmotsav'
        : isBabyBirthday
          ? stageLang === 'hi'
            ? 'प्रथम जन्मदिन'
            : '1st Birthday'
          : stageLang === 'hi'
            ? 'जन्मदिन उत्सव'
            : '25th Birthday');

  const renderBirthdayTitle = (opts: {
    as?: 'h2' | 'h3';
    enFontClass: string;
    nameClass?: string;
    nameStyle?: React.CSSProperties;
    milestoneClass?: string;
    milestoneStyle?: React.CSSProperties;
    compactOverride?: boolean;
  }) => {
    const Tag = opts.as || 'h2';
    const isCmp = opts.compactOverride ?? compact;
    const nameText = activeBirthdayName;
    const nameLen = nameText.length;
    const enSizeClass = isCmp
      ? nameLen > 14
        ? 'text-[clamp(22px,6.2vw,28px)]'
        : 'text-[clamp(28px,8vw,36px)]'
      : nameLen > 14
        ? 'text-[clamp(26px,7vw,34px)]'
        : 'text-[clamp(32px,8.8vw,44px)]';
    const hiSizeClass = isCmp
      ? nameLen > 14
        ? 'text-[20px]'
        : 'text-[26px]'
      : nameLen > 14
        ? 'text-[24px]'
        : 'text-[32px]';

    if (!nameText && !activeBirthdayMilestone) return null;

    return (
      <div className="mt-1.5 flex w-full max-w-full flex-col items-center gap-1.5 px-2 text-center">
        {nameText && (
          <Tag
            className={`block w-full max-w-full break-words leading-[1.18] ${
              stageLang === 'hi'
                ? `font-tiro font-semibold ${hiSizeClass}`
                : `${opts.enFontClass} ${enSizeClass}`
            } ${opts.nameClass || ''}`}
            style={opts.nameStyle}
          >
            {nameText}
          </Tag>
        )}
        {activeBirthdayMilestone && (
          <p
            className={`block w-full max-w-full break-words leading-[1.35] ${
              stageLang === 'hi'
                ? `font-tiro font-medium ${isCmp ? 'text-[12.5px]' : 'text-[14px]'}`
                : `font-display font-semibold uppercase tracking-[0.16em] ${isCmp ? 'text-[11px]' : 'text-[12.5px]'}`
            } ${opts.milestoneClass || ''}`}
            style={opts.milestoneStyle}
          >
            {activeBirthdayMilestone}
          </p>
        )}
      </div>
    );
  };

  const toggleRsvpEvent = (id: string) => {
    setRsvpEvents((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0 && rsvpErrors.events) {
        setRsvpErrors((err) => ({ ...err, events: undefined }));
      }
      return next;
    });
  };

  const handleStageRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpTouched({ name: true, contact: true });
    setRsvpSubmitError(null);
    const { isValid, errors } = validateRsvpForm({
      name: rsvpName,
      contact: rsvpContact,
      selectedEventsCount: rsvpEvents.length,
      attendanceStatus: rsvpStatus,
      lang: stageLang,
    });
    if (!isValid) {
      setRsvpErrors(errors);
      return;
    }
    setRsvpErrors({});
    setRsvpSubmitting(true);

    const payload: RsvpSubmissionInput = {
      guestName: rsvpName.trim(),
      guestPhone: rsvpContact.trim(),
      attendanceStatus: rsvpStatus,
      guestCount: rsvpStatus === 'attending' ? rsvpGuestCount : 0,
      side: rsvpSide,
      dietaryPreference: rsvpStatus === 'attending' ? rsvpDiet : 'no_preference',
      eventIds: rsvpStatus === 'attending' ? rsvpEvents : [],
      arrivalInfo: rsvpArrival.trim(),
      blessingNote: rsvpNote.trim(),
      source: 'guest_web',
    };

    try {
      if (onSubmitRsvp) {
        await onSubmitRsvp(payload);
      } else {
        saveLocalRsvp(theme.id, payload);
      }
      setRsvpSent(true);
    } catch (err) {
      setRsvpSubmitError(
        err instanceof Error
          ? err.message
          : stageLang === 'en'
            ? 'Could not save RSVP right now. Please try again.'
            : 'अभी RSVP सेव नहीं हो पाया, कृपया पुनः प्रयास करें।'
      );
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const selectedEventTitles = activeEvents
    .filter((c) => rsvpEvents.includes(c.id))
    .map((c) => c.title[stageLang])
    .join(', ');

  const dietLabel =
    rsvpDiet === 'jain'
      ? 'Jain (No Onion/Garlic)'
      : rsvpDiet === 'veg_nonveg'
        ? 'Veg + Non-Veg'
        : 'Pure Veg';
  const sideLabel =
    rsvpSide === 'bride'
      ? "Bride's Side (Ladkiwale)"
      : rsvpSide === 'both'
        ? 'Common Friends / Both'
        : "Groom's Side (Ladkewale)";

  const contactSuffix = rsvpContact.trim() ? `\nContact: ${rsvpContact.trim()}` : '';

  const whatsappReplyUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    rsvpStatus === 'declined'
      ? `Namaste! Sending warm blessings for ${isBirthday ? celebrantEn : `${cleanGroom} & ${cleanBride}`} (${theme.name}).\nGuest/Family: ${rsvpName.trim()}${contactSuffix}\nStatus: Regretfully unable to attend, sending Ashirwad.${
          rsvpNote.trim() ? `\nBlessing: ${rsvpNote.trim()}` : ''
        }`
      : isHinduBirthday
        ? `Namaste! Shubh Janmotsav RSVP for ${celebrantEn} (${theme.name}):\nGuest/Family: ${rsvpName.trim()}${contactSuffix}\nGuests Attending: ${rsvpGuestCount} (${dietLabel})\nJoining for: ${selectedEventTitles}${
            rsvpArrival.trim() ? `\nArrival/Stay: ${rsvpArrival.trim()}` : ''
          }${rsvpNote.trim() ? `\nAshirwad/Note: ${rsvpNote.trim()}` : ''}`
        : isBabyBirthday
          ? `Namaste! 1st Birthday RSVP for Baby ${celebrantEn} (${theme.name}):\nGuest/Family: ${rsvpName.trim()}${contactSuffix}\nGuests Attending: ${rsvpGuestCount} (${dietLabel})\nJoining for: ${selectedEventTitles}${
              rsvpArrival.trim() ? `\nArrival/Stay: ${rsvpArrival.trim()}` : ''
            }${rsvpNote.trim() ? `\nBlessing/Note: ${rsvpNote.trim()}` : ''}`
          : isBirthday
            ? `Hey! Birthday RSVP for ${celebrantEn}'s ${theme.name}:\nGuest: ${rsvpName.trim()}${contactSuffix}\nGuests Attending: ${rsvpGuestCount} (${dietLabel})\nJoining for: ${selectedEventTitles}${
                rsvpArrival.trim() ? `\nArrival/Stay: ${rsvpArrival.trim()}` : ''
              }${rsvpNote.trim() ? `\nWish/Note: ${rsvpNote.trim()}` : ''}`
            : `Namaste! RSVP for ${cleanGroom} & ${cleanBride}'s ${theme.name} Wedding:\nGuest/Family: ${rsvpName.trim()} (${sideLabel})${contactSuffix}\nGuests Attending: ${rsvpGuestCount} (${dietLabel})\nFunctions: ${selectedEventTitles}${
                rsvpArrival.trim() ? `\nArrival/Stay: ${rsvpArrival.trim()}` : ''
              }${rsvpNote.trim() ? `\nNote: ${rsvpNote.trim()}` : ''}`
  )}`;

  const isLightHero =
    theme.id === 'ivory' ||
    theme.id === 'mehndi-jhoola' ||
    theme.id === 'gulab' ||
    theme.id === 'confetti-garden' ||
    theme.id === 'nanhe-kadam' ||
    theme.id === 'baal-gopal' ||
    theme.id === 'rangoli-utsav' ||
    theme.id === 'ladli-kanya' ||
    theme.id === 'gulab-baisa' ||
    theme.id === 'veer-balak' ||
    theme.id === 'ganesh-aashish' ||
    theme.id === 'kesariya' ||
    theme.id === 'pattu-zari' ||
    theme.id === 'mehr' ||
    theme.id === 'kalgi' ||
    theme.id === 'van-upvan';

  const heroImageSrc =
    theme.id === 'jharokha'
      ? RAJWADA_AAGMAN_OPEN_IMAGE
      : theme.id === 'paithani'
        ? PAITHANI_COURTYARD_OPEN_IMAGE
        : theme.id === 'mehndi-jhoola'
          ? GENDA_COURTYARD_OPEN_IMAGE
          : theme.id === 'ivory'
            ? IVORY_STATIONERY_HERO_IMAGE
            : theme.id === 'deepotsav'
              ? DEEPOTSAV_OPEN_IMAGE
              : theme.id === 'roshni'
                ? ROSHNI_MANDAP_OPEN_IMAGE
                : theme.id === 'temple'
                  ? TEMPLE_SANCTUM_OPEN_IMAGE
                  : theme.id === 'gulab'
                    ? GULAB_GARDEN_OPEN_IMAGE
                    : theme.id === 'jashn-birthday'
                      ? BIRTHDAY_SOIREE_OPEN_IMAGE
                      : theme.id === 'confetti-garden'
                        ? BIRTHDAY_GARDEN_OPEN_IMAGE
                        : theme.id === 'nanhe-kadam'
                          ? INDIAN_BABY_COURTYARD_OPEN_IMAGE
                          : theme.id === 'chanda-mama'
                            ? CHANDA_MAMA_COURTYARD_OPEN_IMAGE
                            : theme.id === 'baal-gopal'
                              ? BAAL_GOPAL_OPEN_IMAGE
                              : theme.id === 'shubh-aarti'
                                ? SHUBH_AARTI_OPEN_IMAGE
                                : theme.id === 'rangoli-utsav'
                                  ? RANGOLI_UTSAV_OPEN_IMAGE
                                  : theme.id === 'ladli-kanya'
                                    ? LADLI_KANYA_OPEN_IMAGE
                                    : theme.id === 'devi-kumkum'
                                      ? DEVI_KUMKUM_OPEN_IMAGE
                                      : theme.id === 'gulab-baisa'
                                        ? GULAB_BAISA_OPEN_IMAGE
                                        : theme.id === 'kanha-makhan'
                                          ? KANHA_MAKHAN_OPEN_IMAGE
                                          : theme.id === 'veer-balak'
                                            ? VEER_BALAK_OPEN_IMAGE
                                            : theme.id === 'ganesh-aashish'
                                              ? GANESH_AASHISH_OPEN_IMAGE
                                              : theme.id === 'kohinoor'
                                                ? KOHINOOR_OPEN_IMAGE
                                                : theme.id === 'vrindavan'
                                                  ? VRINDAVAN_OPEN_IMAGE
                                                  : theme.id === 'kesariya'
                                                    ? KESARIYA_OPEN_IMAGE
                                                    : theme.id === 'pattu-zari'
                                                      ? PATTU_MANDAP_OPEN_IMAGE
                                                      : theme.id === 'mehr'
                                                        ? MEHR_OPEN_IMAGE
                                                        : theme.id === 'kalgi'
                                                          ? KALGI_OPEN_IMAGE
                                                          : theme.id === 'shahi-badami'
                                                              ? BURGUNDY_PAISLEY_OPEN_IMAGE
                                                              : theme.id === 'van-upvan'
                                                                ? SAGE_BUNNY_OPEN_IMAGE
                                                                : theme.id === 'sindoori-rajhans'
                                                                  ? MAROON_RAJHANS_OPEN_IMAGE
                                                                  : theme.id === 'rajsi-baingani'
                                                                    ? PURPLE_FILIGREE_OPEN_IMAGE
                                                                    : theme.id === 'neel-chandani'
                                                                      ? NAVY_SILVER_OPEN_IMAGE
                                                                      : theme.id === 'sheesh-mahal'
                                                                        ? SHEESH_MAHAL_PLUM_DOME_IMAGE
                                                                        : theme.image;
  const effectiveHeroImage = heroImageSrc;

  // ========== MODULAR PER-THEME STAGE 2 BODY BLOCKS ==========

  const noteBlock = (
    <section key="note" className="jharokha-reveal text-center pt-2">
      <p
        style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
      >
        {theme.id === 'paithani'
          ? stageLang === 'en'
            ? 'Goraj Muhurat · Shubh Mangal Savdhaan'
            : 'गोरज मुहूर्त · शुभमंगल सावधान'
          : theme.id === 'deepotsav'
          ? stageLang === 'en'
            ? 'Sacred Ghat Mangalashtak'
            : 'पावन दीप मंत्रोच्चार'
          : theme.id === 'sheesh-mahal'
            ? stageLang === 'en'
              ? 'An Evening Under A Thousand Mirrors'
              : 'शीश महल संध्या आमंत्रण'
            : theme.id === 'temple'
              ? stageLang === 'en'
                ? 'Vedic Muhurtham Blessing'
                : 'वैदिक शुभ मुहूर्त आशीर्वाद'
              : theme.id === 'gulab'
                ? stageLang === 'en'
                  ? 'From The Rose Garden'
                  : 'गुलज़ार आँगन से निवेदन'
                : theme.id === 'jashn-birthday'
                  ? stageLang === 'en'
                    ? 'A Midnight Birthday Toast'
                    : 'स्नेहिल जन्मोत्सव निमंत्रण'
                  : theme.id === 'confetti-garden'
                    ? stageLang === 'en'
                      ? 'From The Garden Table'
                      : 'उत्सव उपवन आमंत्रण'
                          : theme.id === 'nanhe-kadam'
                            ? stageLang === 'en'
                              ? 'Palna Ashirwad · Little Footsteps'
                              : 'पालना आशीर्वाद · प्रथम जन्मोत्सव'
                            : theme.id === 'chanda-mama'
                              ? stageLang === 'en'
                                ? 'Chandrani Raat Starlight Lullaby'
                                : 'चाँदनी रात शुभ आशीष'
                              : theme.id === 'baal-gopal'
                                ? stageLang === 'en'
                                  ? 'Murlidhar Leela · Vrindavan Ashirwad'
                                  : 'मुरलीधर लीला · स्नेहिल आशीर्वाद'
                                : theme.id === 'shubh-aarti'
                                  ? stageLang === 'en'
                                    ? '॥ Ayushman Bhava · Kalash Pravesh ॥'
                                    : '॥ आयुष्मान् भव · कलश प्रवेश ॥'
                                  : theme.id === 'rangoli-utsav'
                                    ? stageLang === 'en'
                                      ? 'Alpana Utsav · Parivar Celebrations'
                                      : 'अल्पना उत्सव · परिवार मंगल'
                                    : theme.id === 'ladli-kanya'
                                      ? stageLang === 'en'
                                        ? '॥ Shri Mahalakshmi · Nandini Jhula ॥'
                                        : '॥ श्री महालक्ष्मी · नंदिनी झूला ॥'
                                      : theme.id === 'devi-kumkum'
                                        ? stageLang === 'en'
                                          ? '॥ Devi Vandana · Kumkum Kanya ॥'
                                          : '॥ देवी वंदना · कुमकुम कन्या ॥'
                                        : theme.id === 'gulab-baisa'
                                          ? stageLang === 'en'
                                            ? 'Gulabi Garh · Jaipur Celebrations'
                                            : 'गुलाबी गढ़ · लाड़ली जन्मोत्सव'
                                          : theme.id === 'kanha-makhan'
                                            ? stageLang === 'en'
                                              ? '॥ Gokul Matki · Makhan Janmotsav ॥'
                                              : '॥ गोकुल मटकी · माखन जन्मोत्सव ॥'
                                            : theme.id === 'veer-balak'
                                              ? stageLang === 'en'
                                                ? '॥ Suryavanshi Tilak · Rajkumar Utsav ॥'
                                                : '॥ सूर्यवंशी तिलक · बालक जन्मोत्सव ॥'
                                              : theme.id === 'ganesh-aashish'
                                                ? stageLang === 'en'
                                                  ? '॥ Vighnaharta Mangal · Modak Utsav ॥'
                                                  : '॥ श्री गणेशाय नमः · विघ्नहर्ता मंगल ॥'
                                                : theme.id === 'kohinoor'
                                                  ? stageLang === 'en'
                                                    ? 'Sindoori Shagun · Udaipur Invitation'
                                                    : 'सिंदूरी शगुन · मेवाड़ दरबार निमंत्रण'
                                            : theme.id === 'vrindavan'
                                              ? stageLang === 'en'
                                                ? '॥ Shri Krishnah Sharanam Mama ॥'
                                                : '॥ श्री कृष्णः शरणं मम ॥'
                                              : theme.id === 'kesariya'
                                                ? stageLang === 'en'
                                                  ? 'Bandhani Saanjh · Jaipur Terrace'
                                                  : 'बांधनी साँझ · जयपुर उत्सव'
                                                : theme.id === 'pattu-zari'
                                                  ? stageLang === 'en'
                                                    ? 'Kanchi Kalyanam · Silk Muhurtham'
                                                    : 'कांची कल्याणम · शुभ मुहूर्त'
                                                  : stageLang === 'en'
                                                    ? 'A Personal Note'
                                                    : 'सस्नेह निवेदन'}
      </p>
      {(!hasCustom || customization?.personalNoteEn?.trim() || customization?.personalNoteHi?.trim()) && (
      <p
        style={{ color: skin.inkHex }}
        className={`mt-2 ${skin.displayClass} italic leading-relaxed ${
          compact ? 'text-[15.5px]' : 'text-[17px]'
        } ${stageLang === 'hi' ? 'font-tiro not-italic text-[14.5px]' : ''}`}
      >
        {stageLang === 'en' && (customization?.personalNoteEn?.trim() || customization?.personalNoteHi?.trim())
          ? `“${customization.personalNoteEn?.trim() || customization.personalNoteHi?.trim()}”`
          : stageLang === 'hi' && (customization?.personalNoteHi?.trim() || customization?.personalNoteEn?.trim())
            ? `“${customization.personalNoteHi?.trim() || customization.personalNoteEn?.trim()}”`
            : hasCustom
              ? ''
              : theme.id === 'paithani'
          ? stageLang === 'en'
            ? '“As Mangalashtak chants rise and white mogra & akshata shower across the wada courtyard, our families welcome your blessings on our Goraj Muhurat.”'
            : '“मंगलाष्टक के मधुर स्वर और मोगरा-अक्षता की पावन वर्षा के बीच, पैठणी मंडप में वर-वधू को शुभाशीष देने हेतु सपरिवार पधारें।”'
          : theme.id === 'ivory'
            ? stageLang === 'en'
              ? '“With understated warmth and family blessings, we request the honour of your company as we begin our life together in Udaipur.”'
              : '“सस्नेह एवं विनम्र निवेदन के साथ, उदयपुर में हमारे शुभ परिणय उत्सव में आपकी गरिमामयी उपस्थिति की अभिलाषा है।”'
            : theme.id === 'sheesh-mahal'
              ? stageLang === 'en'
                ? '“As one flame awakens a thousand hand-cut mirrors, join us after dusk for music, champagne toasts, and luminous celebrations.”'
                : '“संध्या की प्रथम ज्योति और हज़ारों दर्पणों के प्रकाश में, संगीत और उत्सव की इस रात में आपका स्वागत है।”'
              : theme.id === 'mehndi-jhoola'
                ? stageLang === 'en'
                  ? '“Strings of marigolds are hung, turmeric bowls are warm, and the swing awaits songs in the sunlit courtyard.”'
                  : '“गेंदे की लड़ियाँ सज चुकी हैं, हल्दी और लोकगीतों के बीच आँगन के झूले पर आपका हार्दिक स्वागत है।”'
                : theme.id === 'deepotsav'
                    ? stageLang === 'en'
                      ? '“Beside earthen diyas floating softly on sacred waters, we seek your blessings for three days of prayers, folk songs, and vows.”'
                      : '“पावन घाटों पर प्रज्वलित दीपों की साक्षी में, हम तीन दिवसीय मांगलिक उत्सव में आपका आशीर्वाद चाहते हैं।”'
                    : theme.id === 'roshni'
                      ? stageLang === 'en'
                        ? '“As ivory jaalis part under glowing brass lanterns and mogra garlands, step into our crimson mandap for three evenings of joy.”'
                        : '“हाथीदांत की जाली और मोगरा मालाओं के मध्य, शुभ दीपों की रोशनी में हमारे पावन परिणय उत्सव में पधारें।”'
                      : theme.id === 'temple'
                        ? stageLang === 'en'
                          ? '“To the auspicious chime of temple bells, nadaswaram melodies, and fresh mango leaves, we invite you to bless our sacred union.”'
                          : '“मंदिर की पावन घंटियों, मंगल वाद्य और आम्रपल्लव की छाया में, नव-दंपति को आशीर्वाद देने सादर आमंत्रण है।”'
                        : theme.id === 'gulab'
                          ? stageLang === 'en'
                            ? '“Scented with damask rose petals beside marble fountains, our families invite you to three days of poetry, music, and vows.”'
                            : '“गुलाब की पंखुड़ियों और श्वेत संगमरमर के चारबाग़ आँगन में, तीन दिवसीय उत्सव में आपका स्नेहिल स्वागत है।”'
                          : theme.id === 'jashn-birthday'
                            ? stageLang === 'en'
                              ? '“Raise a glass under velvet candlelight as we celebrate twenty-five luminous years with vinyl tunes, midnight cake, and the people who make every chapter unforgettable.”'
                              : '“मोमबत्तियों की सुनहरी रोशनी, मधुर संगीत और आत्मीय मित्रों संग पच्चीसवें जन्मोत्सव की इस अविस्मरणीय संध्या में पधारें।”'
                            : theme.id === 'confetti-garden'
                              ? stageLang === 'en'
                                ? '“Sunshine, chilled spritzers, and a long bougainvillea table set just for us—come unwrap an afternoon of laughter, cake, and birthday wishes.”'
                                : '“धूप खिले उपवन, सुमधुर हँसी और सजाए हुए उत्सव टेबल पर केक व स्नेह भरी शुभकामनाओं के साथ जन्मदिन मनाने अवश्य पधारें।”'
                              : theme.id === 'nanhe-kadam'
                                ? stageLang === 'en'
                                  ? '“Twelve months of tiny giggles, first steps, and endless blessings—join our courtyard for Tilak-Aarti, kathputli puppets, and Baby’s very first birthday cake!”'
                                  : '“नन्हे कदमों, मीठी किलकारियों और परिवार के आशीर्वाद से भरे एक वर्ष के पूर्ण होने पर, तिलक-आरती, कठपुतली और पहले केक उत्सव में सपरिवार सादर पधारें।”'
                                : theme.id === 'chanda-mama'
                                  ? stageLang === 'en'
                                    ? '“Under Chanda Mama’s silver crescent and fairy lights, our little star turns ONE—come shower your love, lullabies, and warm blessings.”'
                                    : '“चंदा मामा की सुनहरी चाँदनी और दीपों के बीच हमारे घर का नन्हा सितारा एक वर्ष का हो गया—आशीर्वाद व स्नेह लुटाने अवश्य पधारें।”'
                                  : theme.id === 'baal-gopal'
                                    ? stageLang === 'en'
                                      ? `“To the sweet melody of Bansuri flute and peacock feathers, join our courtyard jhula as we celebrate ${celebrantEn}’s auspicious Janmotsav with Ganesh Puja, Makhan-Mishri & family blessings.”`
                                      : `“बाँसुरी की मधुर तान और मोरपंख की छटा में, गणेश वंदना, माखन-मिश्री भोग व बड़े-बुजुर्गों के आशीर्वाद संग ${celebrantHi} के शुभ जन्मोत्सव में सपरिवार सादर पधारें।”`
                                    : theme.id === 'shubh-aarti'
                                      ? stageLang === 'en'
                                        ? `“With brass Panch-Aarti, sacred Purna Kalash, and Vedic chants of Dirghayu, our family warmly welcomes your presence and heartfelt blessings on ${celebrantEn}’s Janmotsav.”`
                                        : `“पावन पूर्ण कलश, पंच-आरती के मंगल प्रकाश और दीर्घायु मंत्रों के बीच, ${celebrantHi} के शुभ जन्मोत्सव पर आपका स्नेहिल स्वागत एवं आशीर्वाद प्रार्थनीय है।”`
                                      : theme.id === 'rangoli-utsav'
                                        ? stageLang === 'en'
                                          ? `“Fresh marigold rangoli, mango-leaf toran, and warm motichoor laddoos await in our courtyard—come bless ${celebrantEn} with joy, health, and endless prosperity.”`
                                          : `“आँगन में सजी गेंदे-गुलाब की रंगोली, आम्रपल्लव बंदनवार और मोतीचूर प्रसादम के बीच ${celebrantHi} को दीर्घायु का आशीर्वाद देने अवश्य पधारें।”`
                                        : theme.id === 'ladli-kanya'
                                          ? stageLang === 'en'
                                            ? `“With the sweet chime of silver payals, pink lotus garlands on our courtyard jhula, and Lakshmi Puja blessings, join us to celebrate our darling ${celebrantEn}’s Janmotsav.”`
                                            : `“चाँदी की पायल की मधुर झंकार, कमल-गेंदे के झूले और श्री लक्ष्मी पूजन के साथ हमारी लाड़ली ${celebrantHi} के शुभ जन्मोत्सव में सपरिवार सादर पधारें।”`
                                          : theme.id === 'devi-kumkum'
                                            ? stageLang === 'en'
                                              ? `“Fragrant mogra gajras, kumkum-haldi thali, and twilight Panch-Aarti await at our home mandir—come shower Devi blessings and kesar kheer joy upon ${celebrantEn}.”`
                                              : `“मोगरे के गजरे, हल्दी-कुमकुम थाली और संध्या पंच-आरती के पावन प्रकाश में लाड़ली ${celebrantHi} को सौभाग्य व दीर्घायु का आशीर्वाद देने पधारें।”`
                                            : theme.id === 'gulab-baisa'
                                              ? stageLang === 'en'
                                                ? `“Along pink Jaipur sandstone arches scented with damask rose petals and marble urlis, join our family afternoon of mehndi, music, and cake for ${celebrantEn}.”`
                                                : `“जयपुर के गुलाबी झरोखों, गुलकंद-गुलाब की महक और मधुर संगीत के बीच लाड़ली ${celebrantHi} के जन्मोत्सव आँगन में स्नेह भरा आमंत्रण।”`
                                              : theme.id === 'kanha-makhan'
                                                ? stageLang === 'en'
                                                  ? `“With joyful Vrindavan flute tunes, painted makhan handis, and mor pankh blessings, come celebrate our little prince ${celebrantEn}’s auspicious Janmotsav.”`
                                                  : `“बाँसुरी की मधुर तान, सजी माखन मटकी और मोरपंख के साथ हमारे नटखट कान्हा ${celebrantHi} के शुभ जन्मोत्सव में सपरिवार पधारें।”`
                                                : theme.id === 'veer-balak'
                                                  ? stageLang === 'en'
                                                    ? `“From sacred Surya Tilak and bandhani safa bandhai to dholak beats and motichoor laddoos, join our royal Mewar veranda as we bless ${celebrantEn} on his birthday.”`
                                                    : `“सूर्य तिलक, बंधेज साफा बंधाई, ढोलक की मंगल थाप और मोतीचूर लड्डुओं संग वीर बालक ${celebrantHi} को आशीर्वाद देने अवश्य पधारें।”`
                                                  : theme.id === 'ganesh-aashish'
                                                    ? stageLang === 'en'
                                                      ? `“To the chime of stone mandir bells, copper kalash prayers, and golden modak prashad, our family invites your warm blessings for ${celebrantEn}’s bright and blessed year ahead.”`
                                                      : `“मंदिर के पावन घंटानाद, पूर्ण कलश पूजन और गणपति मोदक प्रसाद के बीच बालक ${celebrantHi} को दीर्घायु व विद्या का आशीर्वाद देने सादर पधारें।”`
                                                    : stageLang === 'en'
                                                      ? '“With hearts full of gratitude and joy, our families welcome you to Udaipur for three days of turmeric, folk songs, and the sacred pheras.”'
                                                      : '“सपरिवार स्नेह और कृतज्ञता के साथ, उदयपुर में आयोजित तीन दिवसीय हल्दी, संगीत और पावन फेरों के मांगलिक उत्सव में आपका हार्दिक स्वागत है।”'}
      </p>
      )}
      <div className="mx-auto mt-4 flex items-center justify-center gap-2">
        <span className="h-px w-8" style={{ backgroundColor: `${skin.goldHex}99` }} />
        <span className="size-1.5 rotate-45" style={{ backgroundColor: skin.accentHex }} />
        <span className="h-px w-8" style={{ backgroundColor: `${skin.goldHex}99` }} />
      </div>
    </section>
  );

  const scratchDateBlock = (
    <section
      key="scratch"
      style={{
        backgroundColor: skin.cardHex,
        borderColor: `${skin.goldHex}73`,
      }}
      className="jharokha-reveal rounded-2xl border p-3.5 shadow-sm"
    >
      <JharokhaScratchDate
        lang={stageLang}
        compact={compact}
        onScratchReveal={playTempleChime}
        accentHex={skin.accentHex}
        goldHex={skin.goldHex}
        cardBgHex={skin.altCardHex}
        inkHex={skin.inkHex}
        isDark={skin.isDark}
        celebrationType={theme.celebrationType}
        isBaby={isBabyBirthday}
        isHindu={isHinduBirthday}
        customDateLabel={dateDisplay}
        customTargetIso={customization?.targetIsoDate}
        customCityLabel={cityDisplay}
        hasCustom={hasCustom}
      />
    </section>
  );

  const formalInviteBlock = (
    <section key="formal" className="jharokha-reveal">
      <JharokhaArchCard
        themeId={theme.id}
        lang={stageLang}
        cleanGroom={isBirthday ? celebrantEn : cleanGroom}
        cleanBride={cleanBride}
        groomHi={isBirthday ? celebrantHi : groomHi}
        brideHi={brideHi}
        cityDisplay={cityDisplay}
        venueDisplay={venueDisplay}
        compact={compact}
        accentHex={skin.accentHex}
        goldHex={skin.goldHex}
        inkHex={skin.inkHex}
        fillTopHex={skin.cardHex}
        fillBottomHex={skin.altCardHex}
        paperHex={skin.paperHex}
        isDark={skin.isDark}
        scriptClass={skin.scriptClass}
        parentsLineCustom={
          stageLang === 'hi'
            ? customization?.parentsBlessingHi?.trim() || customization?.parentsBlessingEn
            : customization?.parentsBlessingEn?.trim() || customization?.parentsBlessingHi
        }
        groomParentsCustomEn={customization?.groomParentsEn}
        groomParentsCustomHi={customization?.groomParentsHi}
        brideParentsCustomEn={customization?.brideParentsEn}
        brideParentsCustomHi={customization?.brideParentsHi}
        isBrideFirst={isBrideFirst}
        dateLabelCustom={dateDisplay}
        isBirthday={isBirthday}
        hasCustom={hasCustom}
      />
    </section>
  );

  const timelineBlock = (
      /* Centered 2-Column Alternating `.tl` Timeline (Lotus Bloom vs Deepotsav Diya vs Diamond) */
      <section key="timeline" className="jharokha-reveal">
        <div className="text-center mb-5">
          <p
            style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
            className="text-[10px] font-semibold uppercase tracking-[0.2em]"
          >
            {isHinduBirthday
              ? stageLang === 'en'
                ? 'Hindu Janmotsav'
                : 'शुभ जन्मोत्सव क्रम'
              : isBabyBirthday
                ? stageLang === 'en'
                  ? 'Bal Janmotsav'
                  : 'बाल जन्मोत्सव क्रम'
                : isBirthday
                  ? stageLang === 'en'
                    ? 'Party Flow'
                    : 'संध्या उत्सव क्रम'
                  : theme.id === 'sheesh-mahal'
                    ? stageLang === 'en'
                      ? 'Soiree Itinerary'
                      : 'संध्या उत्सव क्रम'
                    : stageLang === 'en'
                      ? 'The Celebrations'
                      : 'मांगलिक कार्यक्रम'}
          </p>
          <h3
            style={{ color: skin.inkHex }}
            className={`mt-1 ${skin.scriptClass} leading-tight ${
              compact ? 'text-[30px]' : 'text-[34px]'
            }`}
          >
            {isHinduBirthday
              ? stageLang === 'en'
                ? 'Puja, Aarti & Priti Bhoj'
                : 'पूजा, आरती एवं प्रीतिभोज'
              : isBabyBirthday
                ? stageLang === 'en'
                  ? 'First Birthday Joy'
                  : 'नन्हे कदमों का पहला उत्सव'
                : isBirthday
                  ? stageLang === 'en'
                    ? 'One Night to Remember'
                    : 'जन्मदिन की यादगार शाम'
                  : theme.id === 'mehndi-jhoola'
                    ? stageLang === 'en'
                      ? 'Courtyard Festivities'
                      : 'आँगन के उत्सव'
                    : stageLang === 'en'
                      ? 'Three Days in Mewar'
                      : 'मेवाड़ के तीन उत्सव दिवस'}
          </h3>
        </div>

        <div className="relative">
          {/* Centered Vertical 1px Hairline Spine */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-2 bottom-2 w-px -translate-x-1/2"
            style={{
              background: `linear-gradient(to bottom, transparent, ${skin.goldHex}BF, transparent)`,
            }}
          />

          <div className="space-y-3">
            {activeEvents.map((ceremony, idx) => {
              const rowBg = idx % 2 === 0 ? skin.cardHex : skin.altCardHex;
              const rowAccent = skin.isDark ? skin.goldHex : skin.accentHex;
              const isEven = idx % 2 === 0;

              const artBlock = (
                <div className={`flex ${isEven ? 'justify-end' : 'justify-start'}`}>
                  <div
                    style={{
                      borderColor: `${skin.goldHex}80`,
                      backgroundColor: rowBg,
                    }}
                    className="group relative aspect-square w-full max-w-[116px] overflow-hidden rounded-lg border shadow-sm p-1 transition-transform duration-500 hover:scale-[1.03]"
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-[5px]">
                      <img
                        src={ceremony.image}
                        alt={ceremony.imageAlt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover animate-ken-burns-slow"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/15 via-transparent to-[#FDE68A]/20"
                      />
                    </div>
                  </div>
                </div>
              );

              const isPastelBoxed =
                theme.id === 'sheesh-mahal' ||
                theme.id === 'deepotsav' ||
                theme.id === 'gulab';

              const infoBlock = (
                <div
                  style={{
                    backgroundColor: isPastelBoxed ? `${rowBg}CC` : 'transparent',
                    borderColor: isPastelBoxed ? `${skin.goldHex}4D` : 'transparent',
                  }}
                  className={`min-w-0 ${
                    isPastelBoxed ? 'rounded-xl border px-2.5 py-2' : 'py-1'
                  } ${isEven ? 'text-left' : 'text-right'}`}
                >
                  <p
                    style={{ color: rowAccent }}
                    className="text-[9.5px] font-semibold uppercase tracking-[0.11em]"
                  >
                    {ceremony.date[stageLang].split(',')[0]} · {ceremony.time}
                  </p>
                  <h4
                    style={{ color: skin.inkHex }}
                    className={`mt-0.5 ${skin.displayClass} font-semibold leading-tight ${
                      compact ? 'text-[15.5px]' : 'text-[17px]'
                    } ${stageLang === 'hi' ? 'font-tiro text-[14.5px]' : ''}`}
                  >
                    {ceremony.title[stageLang]}
                  </h4>
                  <p
                    style={{ color: skin.mutedInkHex }}
                    className="mt-0.5 text-[10px] leading-snug line-clamp-2"
                  >
                    {ceremony.venue[stageLang]}
                  </p>
                  <div className={`mt-1.5 flex ${isEven ? 'justify-start' : 'justify-end'}`}>
                    <button
                      type="button"
                      title="Add to Phone Calendar (.ics)"
                      onClick={() => downloadCeremonyIcs(ceremony, cleanGroom, isBirthday ? '' : cleanBride, cityDisplay)}
                      style={{
                        color: rowAccent,
                        borderColor: `${skin.goldHex}66`,
                        backgroundColor: skin.isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.75)',
                      }}
                      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[9.5px] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
                    >
                      <CalendarPlus className="h-2.5 w-2.5" />
                      <span>{stageLang === 'en' ? 'Save Date' : 'कैलेंडर'}</span>
                    </button>
                  </div>
                </div>
              );

              return (
                <article
                  key={ceremony.id}
                  className="relative grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-x-7 sm:gap-x-9 items-center py-1"
                >
                  {theme.id === 'gulab' || theme.id === 'ladli-kanya' || theme.id === 'gulab-baisa' || theme.id === 'vrindavan' ? (
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                      <LotusBloomNode
                        progress={0.88}
                        accentHex={rowAccent}
                        goldHex={skin.goldHex}
                      />
                    </div>
                  ) : theme.id === 'deepotsav' || theme.id === 'temple' || theme.id === 'shubh-aarti' || theme.id === 'devi-kumkum' || theme.id === 'ganesh-aashish' || theme.id === 'kohinoor' ? (
                    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 scale-[0.55]">
                      <DiyaFlame />
                    </div>
                  ) : (
                    <span
                      aria-hidden="true"
                      style={{
                        backgroundColor: rowAccent,
                        boxShadow: `0 0 0 2.5px ${skin.paperHex}`,
                      }}
                      className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 size-2.5 rotate-45 shadow-sm"
                    />
                  )}

                  {isEven ? (
                    <>
                      {artBlock}
                      {infoBlock}
                    </>
                  ) : (
                    <>
                      {infoBlock}
                      {artBlock}
                    </>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    );

  const countdownBlock = (
    <section
      key="countdown"
      style={{
        backgroundColor: skin.isDark ? skin.cardHex : skin.altCardHex,
        borderColor: `${skin.goldHex}8C`,
        color: skin.inkHex,
      }}
      className="jharokha-reveal rounded-2xl border p-4 text-center shadow-sm"
    >
      <p
        style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
        className="text-[10px] font-semibold uppercase tracking-[0.2em]"
      >
        {isHinduBirthday
          ? stageLang === 'en'
            ? 'Countdown To Shubh Janmotsav'
            : 'शुभ जन्मोत्सव की प्रतीक्षा'
          : isBabyBirthday
            ? stageLang === 'en'
              ? 'Countdown To Baby’s 1st Birthday'
              : 'प्रथम जन्मोत्सव की प्रतीक्षा'
            : isBirthday
              ? stageLang === 'en'
                ? 'Countdown To Birthday Night'
                : 'जन्मदिन संध्या की प्रतीक्षा'
              : theme.id === 'sheesh-mahal'
                ? stageLang === 'en'
                  ? 'Countdown To The Mirror Gala'
                  : 'उत्सव संध्या की प्रतीक्षा'
                : stageLang === 'en'
                  ? 'Counting Down To The Baraat'
                  : 'शुभ मुहूर्त की प्रतीक्षा'}
      </p>
      <LiveCountdownGrid
        targetIso={effectiveTargetIso}
        stageLang={stageLang}
        goldHex={skin.goldHex}
        accentHex={skin.accentHex}
        inkHex={skin.inkHex}
        mutedInkHex={skin.mutedInkHex}
        cardBgHex={skin.cardHex}
        isDark={skin.isDark}
      />
    </section>
  );

  const mapBlock = (
    <section
      key="map"
      style={{
        backgroundColor: skin.cardHex,
        borderColor: `${skin.goldHex}80`,
      }}
      className="jharokha-reveal rounded-2xl border p-4"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p
            style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
            className="text-[10px] font-semibold uppercase tracking-[0.18em]"
          >
            {theme.id === 'sheesh-mahal'
              ? stageLang === 'en'
                ? 'Chauffeur & Boat Concierge'
                : 'नौका व प्रवास व्यवस्था'
              : stageLang === 'en'
                ? 'Venue & Stay'
                : 'विवाह स्थल'}
          </p>
          {venueDisplay && (
            <h4
              style={{ color: skin.inkHex }}
              className={`mt-0.5 ${skin.displayClass} font-semibold ${
                compact ? 'text-[17px]' : 'text-[19px]'
              } ${stageLang === 'hi' ? 'font-tiro text-[16px]' : ''}`}
            >
              {venueDisplay}
            </h4>
          )}
          {cityDisplay && (
            <p style={{ color: skin.mutedInkHex }} className="mt-0.5 text-[11px]">
              {cityDisplay}
            </p>
          )}
        </div>
        <span
          style={{
            backgroundColor: `${skin.accentHex}1F`,
            color: skin.accentHex,
          }}
          className="grid size-9 shrink-0 place-items-center rounded-full"
        >
          <Compass className="h-4 w-4" />
        </span>
      </div>

      {(directionsDisplay || !hasCustom || venueMapHref) && (
        <button
          type="button"
          onClick={() => setMapExpanded((v) => !v)}
          aria-expanded={mapExpanded}
          style={{
            backgroundColor: skin.altCardHex,
            borderColor: `${skin.goldHex}80`,
            color: skin.inkHex,
          }}
          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-[11.5px] font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          <MapPin style={{ color: skin.accentHex }} className="h-3.5 w-3.5" />
          <span>
            {mapExpanded
              ? stageLang === 'en'
                ? 'Hide Travel & Venue Guide'
                : 'यात्रा मार्ग छुपाएँ'
              : stageLang === 'en'
                ? 'View Directions & Arrival Guide'
                : 'दिशा-निर्देश एवं प्रवास देखें'}
          </span>
        </button>
      )}

      {mapExpanded && (directionsDisplay || !hasCustom || venueMapHref) && (
        <div
          style={{
            borderColor: `${skin.goldHex}59`,
            backgroundColor: skin.isDark ? '#14111C' : '#FFFFFFCC',
            color: skin.mutedInkHex,
          }}
          className="mt-3 rounded-xl border p-3 text-[11px] space-y-1.5"
        >
          {(directionsDisplay || !hasCustom) && (
            <p>
              <strong style={{ color: skin.inkHex }}>
                {stageLang === 'en' ? 'Arrival & Parking:' : 'आगमन एवं मार्ग:'}
              </strong>{' '}
              {directionsDisplay ||
                (stageLang === 'en'
                  ? 'Maharana Pratap Airport (UDR), 35 mins by dedicated palace shuttle.'
                  : 'महाराणा प्रताप हवाई अड्डा, हवेली शटल द्वारा 35 मिनट।')}
            </p>
          )}
          {venueMapHref && (
            <a
              href={venueMapHref}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: skin.accentHex }}
              className="inline-flex items-center gap-1 pt-1 font-semibold hover:underline"
            >
              <MapPin className="h-3 w-3" />
              <span>{stageLang === 'en' ? 'Open in Google Maps ↗' : 'गूगल मैप्स में खोलें ↗'}</span>
            </a>
          )}
        </div>
      )}
    </section>
  );

  const swatchesBlock = (
    <section key="swatches" className="jharokha-reveal">
      <div className="text-center mb-3">
        <p
          style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
          className="text-[10px] font-semibold uppercase tracking-[0.2em]"
        >
          {theme.id === 'sheesh-mahal'
            ? stageLang === 'en'
              ? 'Evening Couture Lookbook'
              : 'रात्रि परिधान रंग'
            : stageLang === 'en'
              ? 'Wardrobe Palette'
              : 'परिधान रंग'}
        </p>
        <h4
          style={{ color: skin.inkHex }}
          className={`mt-0.5 ${skin.displayClass} font-semibold ${
            compact ? 'text-[18px]' : 'text-[20px]'
          }`}
        >
          {stageLang === 'en' ? 'What to Wear' : 'उत्सव परिधान'}
        </h4>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {activeEvents.map((ceremony) => {
          const swatch = (activeSwatches as Record<string, { name: { en: string; hi: string }; colors: string[] }>)[ceremony.id];
          const colors = swatch?.colors || ceremony.swatchColors || ['#C88A2B', '#9E2A2B', '#FAF6EE'];
          const swatchLabel = swatch ? swatch.name[stageLang] : ceremony.attire[stageLang];
          return (
            <div
              key={ceremony.id}
              style={{
                backgroundColor: skin.cardHex,
                borderColor: `${skin.goldHex}66`,
              }}
              className="rounded-xl border p-2.5 text-center"
            >
              <p style={{ color: skin.inkHex }} className="text-[10.5px] font-semibold truncate">
                {ceremony.title[stageLang]}
              </p>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                {colors.map((hex) => (
                  <span
                    key={hex}
                    style={{ backgroundColor: hex }}
                    aria-hidden="true"
                    className="size-4 rounded-full border border-black/20 shadow-xs"
                  />
                ))}
              </div>
              <p style={{ color: skin.mutedInkHex }} className="mt-1.5 text-[9.5px] truncate">
                {swatchLabel}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );

  const birthdayParentsDisplay = isBirthday
    ? hasCustom
      ? stageLang === 'hi'
        ? customization?.groomParentsHi?.trim() || customization?.groomParentsEn?.trim() || ''
        : customization?.groomParentsEn?.trim() || customization?.groomParentsHi?.trim() || ''
      : stageLang === 'hi'
        ? customization?.groomParentsHi?.trim() ||
          customization?.groomParentsEn?.trim() ||
          (isHinduBirthday || isBabyBirthday ? 'श्री विक्रमादित्य एवं श्रीमती गायत्री सिंघानिया' : '')
        : customization?.groomParentsEn?.trim() ||
          customization?.groomParentsHi?.trim() ||
          (isHinduBirthday || isBabyBirthday ? 'Vikramaditya & Gayatri Singhania' : '')
    : '';

  const birthdayGrandparentsDisplay = isBirthday
    ? hasCustom
      ? stageLang === 'hi'
        ? customization?.brideParentsHi?.trim() || customization?.brideParentsEn?.trim() || ''
        : customization?.brideParentsEn?.trim() || customization?.brideParentsHi?.trim() || ''
      : stageLang === 'hi'
        ? customization?.brideParentsHi?.trim() ||
          customization?.brideParentsEn?.trim() ||
          (isHinduBirthday || isBabyBirthday ? 'श्री राजेंद्र एवं श्रीमती वसुंधरा सिंघानिया' : '')
        : customization?.brideParentsEn?.trim() ||
          customization?.brideParentsHi?.trim() ||
          (isHinduBirthday || isBabyBirthday ? 'Rajendra & Vasundhara Singhania' : '')
    : '';

  const eldersBlessingText = (() => {
    const customBlessing =
      stageLang === 'en'
        ? customization?.parentsBlessingEn?.trim() || customization?.parentsBlessingHi?.trim() || ''
        : customization?.parentsBlessingHi?.trim() || customization?.parentsBlessingEn?.trim() || '';
    if (customBlessing) return customBlessing;
    if (hasCustom) return '';
    if (isGirlHindu) {
      return stageLang === 'en'
        ? `With Lakshmi Puja, Kumkum Tilak, and warm blessings from Dada-Dadi, Nana-Nani & family elders for our dear ${celebrantEn}’s radiant, joyful life.`
        : `दादा-दादी, नाना-नानी व समस्त परिवारजनों के स्नेहिल आशीर्वाद सहित, हमारी लाड़ली ${celebrantHi} के सौभाग्य व मंगलमय जीवन की कामना।`;
    }
    if (isHinduBirthday) {
      return stageLang === 'en'
        ? `With Ganesh Vandana, Tilak-Aarti, and warm blessings from Dada-Dadi, Nana-Nani & family elders for ${celebrantEn}’s long, joyful, and prosperous life.`
        : `दादा-दादी, नाना-नानी व समस्त परिवारजनों के स्नेहिल आशीर्वाद सहित, ${celebrantHi} के दीर्घायु व मंगलमय जीवन की कामना।`;
    }
    if (isBabyBirthday) {
      return stageLang === 'en'
        ? `Lovingly hosted by ${celebrantEn}’s parents, grandparents & family elders — your warm wishes and hugs are the sweetest gift.`
        : `दादा-दादी व नाना-नानी के आशीर्वाद सहित, नन्हे ${celebrantHi} के प्रथम जन्मदिन पर आपका स्नेह ही सबसे प्यारा उपहार है।`;
    }
    if (isBirthday) {
      return stageLang === 'en'
        ? `Hosted by ${celebrantEn}’s close circle, family & friends — just bring warm wishes and great energy.`
        : `${celebrantHi} के परिवार एवं मित्रों द्वारा स्नेहिल आमंत्रण — आपकी शुभकामनाएँ ही सबसे बड़ा उपहार हैं।`;
    }
    return COUPLE_DEFAULTS.parentsLine[stageLang];
  })();

  const hasBirthdayFamilyNames = Boolean(birthdayParentsDisplay || birthdayGrandparentsDisplay);

  const eldersCardBlock =
    !eldersBlessingText && !hasBirthdayFamilyNames ? null : (
    <section key="elders" className="jharokha-reveal">
      <div
        style={{
          backgroundColor: skin.cardHex,
          borderColor: `${skin.goldHex}73`,
        }}
        className="rounded-2xl border p-4 text-center space-y-3"
      >
        {eldersBlessingText && (
          <div>
            <p
              style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
            >
              {isHinduBirthday
                ? stageLang === 'en'
                  ? 'With Dada-Dadi, Family & Guru’s Ashirwad'
                  : 'बड़ों एवं परिवारजनों का मंगल आशीर्वाद'
                : isBabyBirthday
                  ? stageLang === 'en'
                    ? 'With Dada-Dadi & Nana-Nani’s Blessings'
                    : 'परिवारजनों का स्नेहिल आशीर्वाद'
                  : isBirthday
                    ? stageLang === 'en'
                      ? 'Hosted With Love'
                      : 'स्नेहिल निमंत्रण'
                    : stageLang === 'en'
                      ? 'With Elders’ Blessings'
                      : 'स्नेहिल आशीर्वाद'}
            </p>
            <p
              style={{ color: skin.mutedInkHex }}
              className={`mt-1.5 text-[11px] leading-relaxed whitespace-pre-line ${
                stageLang === 'hi' ? 'font-tiro text-[12px]' : ''
              }`}
            >
              {eldersBlessingText}
            </p>
          </div>
        )}

        {isBirthday && hasBirthdayFamilyNames && (
          <div
            style={{
              borderColor: eldersBlessingText ? `${skin.goldHex}4D` : 'transparent',
            }}
            className={`${eldersBlessingText ? 'border-t pt-3' : ''} space-y-3`}
          >
            {birthdayParentsDisplay && (
              <div className="space-y-1">
                <p
                  style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                  className={`text-[9.5px] font-bold uppercase ${
                    stageLang === 'hi' ? 'font-tiro tracking-[0.06em] text-[11px]' : 'tracking-[0.22em]'
                  }`}
                >
                  {stageLang === 'en' ? 'Proud Parents · Hosted By' : 'माता-पिता · निवेदक'}
                </p>
                <p
                  style={{ color: skin.inkHex }}
                  className={`whitespace-pre-line break-words leading-snug font-semibold ${
                    stageLang === 'hi'
                      ? 'font-tiro text-[13px]'
                      : 'font-display text-[12.5px] tracking-[0.04em]'
                  }`}
                >
                  {birthdayParentsDisplay}
                </p>
              </div>
            )}

            {birthdayParentsDisplay && birthdayGrandparentsDisplay && (
              <div className="flex items-center justify-center gap-2.5" aria-hidden="true">
                <span className="h-px w-10" style={{ backgroundColor: `${skin.goldHex}59` }} />
                <span style={{ color: skin.goldHex }} className="text-[10px] leading-none">
                  ✦
                </span>
                <span className="h-px w-10" style={{ backgroundColor: `${skin.goldHex}59` }} />
              </div>
            )}

            {birthdayGrandparentsDisplay && (
              <div className="space-y-1">
                <p
                  style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                  className={`text-[9.5px] font-bold uppercase ${
                    stageLang === 'hi' ? 'font-tiro tracking-[0.06em] text-[11px]' : 'tracking-[0.2em]'
                  }`}
                >
                  {stageLang === 'en'
                    ? 'With Blessings of Grandparents'
                    : 'दादा-दादी / नाना-नानी के शुभाशीष सहित'}
                </p>
                <p
                  style={{ color: skin.inkHex }}
                  className={`whitespace-pre-line break-words leading-snug font-semibold ${
                    stageLang === 'hi'
                      ? 'font-tiro text-[13px]'
                      : 'font-display text-[12.5px] tracking-[0.04em]'
                  }`}
                >
                  {birthdayGrandparentsDisplay}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );

  const songCardBlock = (
    <section key="song" className="jharokha-reveal">
      <div
        style={{
          backgroundColor: skin.cardHex,
          borderColor: `${skin.goldHex}73`,
          color: skin.inkHex,
        }}
        className="flex items-center justify-between gap-2.5 rounded-2xl border px-3.5 py-2.5 shadow-sm"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            style={{
              backgroundColor: skin.isDark ? `${skin.goldHex}26` : skin.accentHex,
              color: skin.isDark ? skin.goldHex : '#FAF6EE',
            }}
            className={`grid size-8 shrink-0 place-items-center rounded-full ${
              songPlaying ? 'animate-spin' : ''
            }`}
          >
            <Music className="h-3.5 w-3.5" />
          </div>
          <div className="min-w-0">
            <p
              style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
              className="text-[9.5px] font-semibold uppercase tracking-[0.16em]"
            >
              {isGirlHindu
                ? stageLang === 'en'
                  ? 'Payal & Santoor Janmotsav'
                  : 'पायल व संतूर मंगल धुन'
                : isHinduBirthday
                  ? stageLang === 'en'
                    ? 'Shubh Janmotsav Aarti'
                    : 'मंगल आरती व बाँसुरी धुन'
                  : isBabyBirthday
                    ? stageLang === 'en'
                      ? 'Bal Janmotsav Melody'
                      : 'लोरी व जन्मदिन धुन'
                    : isBirthday
                      ? stageLang === 'en'
                        ? 'Birthday Melody'
                        : 'जन्मदिन संगीत'
                      : stageLang === 'en'
                        ? 'Wedding Melody'
                        : 'मंगल ध्वनि'}
            </p>
            <p style={{ color: skin.inkHex }} className="text-[11.5px] font-medium truncate">
              {customization?.songTitle?.trim() ||
                (isGirlHindu
                  ? stageLang === 'en'
                    ? 'Payal Ghungroo & Santoor Janmotsav Chime'
                    : 'पायल घुंघरू व संतूर मंगल संगीत'
                  : isBoyHindu || isHinduBirthday
                    ? stageLang === 'en'
                      ? 'Bansuri & Temple Bell Aarti Chime'
                      : 'बाँसुरी व मंदिर आरती धुन'
                    : isBabyBirthday
                      ? stageLang === 'en'
                        ? 'Santoor & Ghungroo Happy Birthday Lullaby'
                        : 'संतूर व घुंघरू जन्मदिन संगीत'
                      : isBirthday
                        ? stageLang === 'en'
                          ? 'Happy Birthday Acoustic Vinyl Chime'
                          : 'जन्मदिन की मधुर संगीत धुन'
                        : theme.id === 'mehndi-jhoola'
                            ? stageLang === 'en'
                              ? 'Jaipur Dholak & Folk Song Chime'
                              : 'जयपुरी ढोलक व लोकगीत'
                            : theme.id === 'temple'
                              ? stageLang === 'en'
                                ? 'Nadaswaram & Temple Bell Chime'
                                : 'नादस्वरम एवं मंदिर घंटानाद'
                              : theme.id === 'gulab'
                                ? stageLang === 'en'
                                  ? 'Kashmiri Santoor & Sarangi'
                                  : 'कश्मीरी संतूर व सारंगी धुन'
                                : theme.id === 'paithani'
                                  ? stageLang === 'en'
                                    ? 'Sanai Choughada & Mangalashtak Chime'
                                    : 'सनई-चौघड़ा एवं मंगलाष्टक धुन'
                                  : theme.id === 'roshni'
                                    ? stageLang === 'en'
                                      ? 'Royal Shehnai & Sarod Chime'
                                      : 'शाही शहनाई व सरोद धुन'
                                    : stageLang === 'en'
                                      ? 'Mewar Shehnai & Santoor Chime'
                                      : 'मेवाड़ शहनाई व संतूर धुन')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            if (!soundEnabled) setSoundEnabled(true);
            setSongPlaying((p) => !p);
          }}
          style={{
            backgroundColor: skin.isDark ? skin.goldHex : skin.accentHex,
            color: skin.isDark ? '#1A110B' : '#FFFFFF',
          }}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[10.5px] font-semibold hover:opacity-90 shrink-0 cursor-pointer"
        >
          {songPlaying ? (stageLang === 'en' ? 'Pause' : 'रोकें') : stageLang === 'en' ? 'Play' : 'सुनें'}
        </button>
      </div>
    </section>
  );

  const eldersSongBlock = (
    <React.Fragment key="elders-song">
      {isSectionEnabled('elders') && eldersCardBlock}
      {isSectionEnabled('song') && songCardBlock}
    </React.Fragment>
  );

  const sectionOrderKeys: CardSectionKey[] = (() => {
    switch (theme.id) {
      case 'paithani':
        return ['note', 'scratch', 'formal', 'timeline', 'swatches', 'countdown', 'map', 'elders', 'song'];
      case 'ivory':
        return ['formal', 'timeline', 'scratch', 'swatches', 'map', 'note', 'elders', 'countdown', 'song'];
      case 'mehndi-jhoola':
        return ['note', 'swatches', 'timeline', 'scratch', 'elders', 'song', 'map', 'formal', 'countdown'];
      case 'sheesh-mahal':
        return ['countdown', 'swatches', 'note', 'timeline', 'map', 'elders', 'song', 'formal', 'scratch'];
      case 'deepotsav':
        return ['note', 'elders', 'song', 'timeline', 'scratch', 'countdown', 'map', 'swatches', 'formal'];
      case 'roshni':
        return ['formal', 'scratch', 'swatches', 'timeline', 'countdown', 'map', 'elders', 'song', 'note'];
      case 'temple':
        return ['elders', 'song', 'note', 'timeline', 'scratch', 'countdown', 'map', 'swatches', 'formal'];
      case 'gulab':
        return ['note', 'swatches', 'timeline', 'scratch', 'map', 'elders', 'song', 'formal', 'countdown'];
      case 'jashn-birthday':
        return ['note', 'countdown', 'timeline', 'swatches', 'scratch', 'map', 'elders', 'song', 'formal'];
      case 'confetti-garden':
        return ['note', 'swatches', 'timeline', 'scratch', 'elders', 'song', 'map', 'countdown', 'formal'];
      case 'nanhe-kadam':
        return ['note', 'scratch', 'timeline', 'swatches', 'countdown', 'elders', 'song', 'map', 'formal'];
      case 'chanda-mama':
        return ['note', 'countdown', 'elders', 'song', 'timeline', 'swatches', 'scratch', 'map', 'formal'];
      case 'baal-gopal':
        return ['note', 'elders', 'song', 'timeline', 'scratch', 'swatches', 'countdown', 'map', 'formal'];
      case 'shubh-aarti':
        return ['elders', 'song', 'note', 'scratch', 'timeline', 'countdown', 'swatches', 'map', 'formal'];
      case 'rangoli-utsav':
        return ['note', 'timeline', 'swatches', 'countdown', 'scratch', 'elders', 'song', 'map', 'formal'];
      case 'ladli-kanya':
        return ['note', 'scratch', 'timeline', 'swatches', 'elders', 'song', 'countdown', 'map', 'formal'];
      case 'devi-kumkum':
        return ['elders', 'song', 'note', 'countdown', 'timeline', 'scratch', 'swatches', 'map', 'formal'];
      case 'gulab-baisa':
        return ['note', 'swatches', 'timeline', 'elders', 'song', 'scratch', 'countdown', 'map', 'formal'];
      case 'kanha-makhan':
        return ['note', 'countdown', 'timeline', 'swatches', 'elders', 'song', 'scratch', 'map', 'formal'];
      case 'veer-balak':
        return ['countdown', 'note', 'timeline', 'scratch', 'swatches', 'elders', 'song', 'map', 'formal'];
      case 'ganesh-aashish':
        return ['elders', 'song', 'scratch', 'note', 'timeline', 'swatches', 'countdown', 'map', 'formal'];
      case 'kohinoor':
        return ['formal', 'note', 'scratch', 'timeline', 'countdown', 'swatches', 'elders', 'song', 'map'];
      case 'vrindavan':
        return ['elders', 'note', 'formal', 'timeline', 'scratch', 'song', 'countdown', 'swatches', 'map'];
      case 'kesariya':
        return ['note', 'swatches', 'timeline', 'formal', 'scratch', 'countdown', 'map', 'elders', 'song'];
      case 'pattu-zari':
        return ['elders', 'song', 'formal', 'note', 'timeline', 'scratch', 'swatches', 'countdown', 'map'];
      case 'mehr':
        return ['formal', 'note', 'timeline', 'scratch', 'elders', 'song', 'swatches', 'countdown', 'map'];
      case 'kalgi':
        return ['elders', 'formal', 'note', 'timeline', 'scratch', 'swatches', 'countdown', 'song', 'map'];
      case 'shahi-badami':
        return ['formal', 'note', 'scratch', 'timeline', 'countdown', 'swatches', 'elders', 'song', 'map'];
      case 'van-upvan':
        return ['note', 'scratch', 'timeline', 'countdown', 'swatches', 'elders', 'song', 'map', 'formal'];
      case 'sindoori-rajhans':
        return ['elders', 'formal', 'note', 'scratch', 'timeline', 'countdown', 'swatches', 'song', 'map'];
      case 'rajsi-baingani':
        return ['formal', 'scratch', 'note', 'timeline', 'swatches', 'countdown', 'elders', 'song', 'map'];
      case 'neel-chandani':
        return ['countdown', 'formal', 'note', 'timeline', 'swatches', 'scratch', 'elders', 'song', 'map'];
      case 'jharokha':
      default:
        return ['note', 'scratch', 'formal', 'timeline', 'countdown', 'map', 'swatches', 'elders', 'song'];
    }
  })();

  const sectionBlockByKey: Record<Exclude<CardSectionKey, 'rsvp'>, React.ReactNode> = {
    note: noteBlock,
    scratch: scratchDateBlock,
    formal: formalInviteBlock,
    timeline: activeEvents.length > 0 ? timelineBlock : null,
    countdown: countdownBlock,
    map: mapBlock,
    swatches: activeEvents.length > 0 ? swatchesBlock : null,
    elders: eldersCardBlock,
    song: songCardBlock,
  };

  // Preserve custom per-theme ordering while strictly honoring enabledSections toggles!
  const formatSections: React.ReactNode[] = sectionOrderKeys
    .filter(
      (key): key is Exclude<CardSectionKey, 'rsvp'> =>
        key !== 'rsvp' && key !== 'formal' && isSectionEnabled(key)
    )
    .map((key) => sectionBlockByKey[key])
    .filter(Boolean);
  void eldersSongBlock;

  const isExtractedVideoCard =
    theme.id === 'ivory' ||
    theme.id === 'gulab' ||
    theme.id === 'confetti-garden' ||
    theme.id === 'jashn-birthday' ||
    theme.id === 'kanha-makhan' ||
    theme.id === 'devi-kumkum' ||
    theme.id === 'mehr' ||
    theme.id === 'roshni' ||
    theme.id === 'ladli-kanya' ||
    theme.id === 'shubh-aarti' ||
    theme.id === 'vrindavan' ||
    theme.id === 'veer-balak' ||
    theme.id === 'gulab-baisa' ||
    theme.id === 'temple' ||
    theme.id === 'jharokha' ||
    theme.id === 'pattu-zari' ||
    theme.id === 'baal-gopal' ||
    theme.id === 'kesariya' ||
    theme.id === 'kalgi' ||
    theme.id === 'deepotsav';

  const shahiMoharExtractedCardWelcome = (
    <div className="absolute inset-x-[17%] top-[26.5%] bottom-[20.5%] z-20 flex flex-col items-center justify-between text-center">
      <div className="my-auto flex flex-col items-center">
        <p className="font-tiro text-[10.5px] tracking-[0.16em] text-[#8C1D28]">
          ॥ श्री गणेशाय नमः ॥
        </p>
        <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.22em] text-[#69564E]">
          {stageLang === 'en' ? 'Welcome to the wedding of' : 'शुभ विवाह निमंत्रण'}
        </p>
        <div className="mt-1.5 scale-90">
          <JharokhaCrest
            themeId={theme.id}
            groomInitial={groomInitial}
            brideInitial={brideInitial}
            size="sm"
            tone="theme"
          />
        </div>
        {stageLang === 'en' ? (
          <h2
            className={`mt-1 px-1 max-w-full break-words font-corinthia foil-gold-deep-text leading-[1.04] ${
              compact ? 'text-[clamp(27px,7.6vw,35px)]' : 'text-[clamp(30px,8.2vw,40px)]'
            }`}
          >
            {cleanGroom}{' '}
            <span className="text-[0.55em] align-middle opacity-85">&amp;</span>{' '}
            {cleanBride}
          </h2>
        ) : (
          <h2
            className={`mt-1 font-tiro font-semibold foil-gold-deep-text leading-tight ${
              compact ? 'text-[24px]' : 'text-[29px]'
            }`}
          >
            {groomHi} <span className="text-[18px]">एवं</span> {brideHi}
          </h2>
        )}
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-[#B8924A]/70" />
          <span className="size-1.5 rotate-45 bg-[#8C1D28]" />
          <span className="h-px w-8 bg-[#B8924A]/70" />
        </div>
        <p className="mt-2 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-[#3A2824]">
          {dateDisplay}
        </p>
        <p className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-[#69564E]">
          {cityDisplay}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer pt-1"
      >
        <span className="font-corinthia text-[20px] leading-none text-[#2A1E1B]">
          {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-[#8C1D28] animate-bob-chevron" />
      </button>
    </div>
  );

  const pushpVasantExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-x-[18%] top-[15%] bottom-[13.5%] z-20 flex flex-col items-center justify-between text-center">
      <div
        className="relative flex flex-col items-center px-3 py-1.5"
        style={{
          background:
            'radial-gradient(ellipse 82% 72% at 50% 48%, rgba(255, 251, 248, 0.78) 0%, rgba(255, 251, 248, 0.42) 62%, transparent 100%)',
        }}
      >
        <p
          className="font-tiro text-[10.5px] font-semibold tracking-[0.15em] text-[#8E1C38]"
          style={{ textShadow: '0 1px 2px rgba(255,255,255,0.98), 0 0 10px rgba(255,250,246,0.95)' }}
        >
          ॥ श्री गणेशाय नमः ॥
        </p>
        <p
          className="mt-0.5 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#2E111A]"
          style={{ textShadow: '0 1px 2px rgba(255,255,255,0.98), 0 0 10px rgba(255,250,246,0.95)' }}
        >
          {stageLang === 'en' ? 'Welcome to the wedding of' : 'शुभ विवाह निमंत्रण'}
        </p>
        <div className="mt-1 scale-90 drop-shadow-[0_1px_3px_rgba(255,255,255,0.95)]">
          <JharokhaCrest
            themeId={theme.id}
            groomInitial={groomInitial}
            brideInitial={brideInitial}
            size="sm"
            tone="theme"
          />
        </div>
        {stageLang === 'en' ? (
          <h2
            className={`mt-0.5 px-1 max-w-full break-words font-corinthia text-[#38141E] leading-[1.04] ${
              compact ? 'text-[clamp(27px,7.5vw,35px)]' : 'text-[clamp(30px,8.2vw,40px)]'
            }`}
            style={{
              textShadow:
                '0 1px 0 rgba(255,255,255,0.98), 0 2px 8px rgba(255,250,246,0.98), 0 0 16px rgba(255,250,246,0.92)',
            }}
          >
            {cleanGroom}{' '}
            <span className="text-[0.55em] align-middle opacity-85">&amp;</span>{' '}
            {cleanBride}
          </h2>
        ) : (
          <h2
            className={`mt-0.5 font-tiro font-semibold text-[#38141E] leading-tight ${
              compact ? 'text-[23px]' : 'text-[28px]'
            }`}
            style={{
              textShadow:
                '0 1px 0 rgba(255,255,255,0.98), 0 2px 8px rgba(255,250,246,0.98), 0 0 16px rgba(255,250,246,0.92)',
            }}
          >
            {groomHi} <span className="text-[17px]">एवं</span> {brideHi}
          </h2>
        )}
        <div className="mt-1.5 h-px w-12 bg-[#8E1C38]/65" />
        {dateCityLine && (
          <p
            className="mt-1.5 text-[9.5px] font-bold uppercase tracking-[0.18em] text-[#2E111A]"
            style={{ textShadow: '0 1px 2px rgba(255,255,255,0.98), 0 0 10px rgba(255,250,246,0.95)' }}
          >
            {dateCityLine}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
      >
        <span
          className="font-corinthia text-[21px] leading-none text-[#2E111A]"
          style={{ textShadow: '0 1px 3px rgba(255,255,255,0.98), 0 0 10px rgba(255,250,246,0.95)' }}
        >
          {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-[#8E1C38] animate-bob-chevron" />
      </button>
    </div>
  );

  const khushiyanPotliExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-x-[10%] top-[8.5%] bottom-[5%] z-20 flex flex-col items-center justify-between text-center">
      <div
        className="relative flex flex-col items-center px-3 py-1.5"
        style={{
          background:
            'radial-gradient(ellipse 84% 74% at 50% 46%, rgba(255, 249, 240, 0.82) 0%, rgba(255, 249, 240, 0.48) 64%, transparent 100%)',
        }}
      >
        <p
          className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#241713]"
          style={{ textShadow: '0 1px 2px rgba(255,250,242,0.98), 0 0 10px rgba(255,248,238,0.95)' }}
        >
          {stageLang === 'en' ? 'You are invited to celebrate' : 'जन्मदिन उत्सव में सादर आमंत्रण'}
        </p>
        <div className="mt-1.5 scale-90 drop-shadow-[0_1px_3px_rgba(255,248,238,0.95)]">
          <JharokhaCrest
            themeId={theme.id}
            groomInitial={celebrantInitial}
            brideInitial="★"
            size="sm"
            tone="theme"
          />
        </div>
        {renderBirthdayTitle({
          enFontClass: 'font-pinyon',
          nameClass: 'text-[#2B180A]',
          nameStyle: {
            textShadow:
              '0 1px 0 rgba(255,252,245,0.98), 0 2px 8px rgba(255,248,238,0.98), 0 0 16px rgba(255,248,238,0.92)',
          },
          milestoneClass: 'text-[#8C2D19]',
          milestoneStyle: {
            textShadow: '0 1px 2px rgba(255,250,242,0.98), 0 0 10px rgba(255,248,238,0.95)',
          },
        })}
        <div className="mt-1.5 h-px w-14 bg-[#C28622]/85" />
        {cityDisplay && (
          <p
            className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#241713]"
            style={{ textShadow: '0 1px 2px rgba(255,250,242,0.98), 0 0 10px rgba(255,248,238,0.95)' }}
          >
            {cityDisplay}
          </p>
        )}
      </div>

      <button
        type="button"
        onClick={() => {
          welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
      >
        <span
          className="font-pinyon text-[21px] leading-none text-[#241713]"
          style={{ textShadow: '0 1px 3px rgba(255,250,242,0.98), 0 0 10px rgba(255,248,238,0.95)' }}
        >
          {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-[#D94F3D] animate-bob-chevron" />
      </button>
    </div>
  );

  const shamaMahotsavExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Borderless top evening atmospheric vignette + soft radial lantern dimmer so unboxed text is 100% crystal clear */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[58%]"
        style={{
          background:
            'radial-gradient(ellipse 68% 58% at 50% 34%, rgba(8, 5, 12, 0.92) 0%, rgba(8, 5, 12, 0.78) 46%, rgba(8, 5, 12, 0.36) 76%, transparent 100%), linear-gradient(180deg, rgba(8, 5, 12, 0.90) 0%, rgba(8, 5, 12, 0.76) 38%, rgba(8, 5, 12, 0.42) 68%, transparent 100%)',
        }}
      />
      {/* Borderless bottom atmospheric scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%]"
        style={{
          background:
            'linear-gradient(to top, rgba(8, 5, 12, 0.86) 0%, rgba(8, 5, 12, 0.45) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[7%] pb-[5%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[7.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11.5px] font-semibold tracking-[0.2em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? 'You’re Invited to Celebrate' : 'जन्मदिन संध्या आमंत्रण'}
          </p>
          <div className="mt-1.5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={celebrantInitial}
              brideInitial="★"
              size="sm"
              tone="gold"
            />
          </div>
          {renderBirthdayTitle({
            enFontClass: 'font-corinthia',
            nameClass: 'text-[#FFF8E7]',
            nameStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(230,184,106,0.45)',
            },
            milestoneClass: 'text-[#FFE39E]',
            milestoneStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            },
          })}
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-[#E6B86A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-10 bg-[#E6B86A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          {cityDisplay && (
            <p
              className="mt-2 text-[11px] font-bold uppercase tracking-[0.24em] text-[#FFFFFF]"
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
              }}
            >
              {cityDisplay}
            </p>
          )}
          <p
            className={`mt-1 text-[12.5px] font-medium italic ${skin.displayClass} text-[#FFE5A3]`}
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {skin.heroGreeting[stageLang]}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-corinthia text-[23px] leading-none text-[#FFF8E7]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const gokulMatkiExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Borderless top peacock-navy atmospheric vignette over upper sandstone arches so unboxed text is 100% crisp while boy, cake & matkis below stay clear */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[48%]"
        style={{
          background:
            'radial-gradient(ellipse 74% 58% at 50% 28%, rgba(8, 19, 35, 0.92) 0%, rgba(8, 19, 35, 0.78) 46%, rgba(8, 19, 35, 0.36) 76%, transparent 100%), linear-gradient(180deg, rgba(8, 19, 35, 0.90) 0%, rgba(8, 19, 35, 0.76) 38%, rgba(8, 19, 35, 0.38) 68%, transparent 100%)',
        }}
      />
      {/* Borderless bottom atmospheric scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%]"
        style={{
          background:
            'linear-gradient(to top, rgba(8, 19, 35, 0.88) 0%, rgba(8, 19, 35, 0.46) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[7%] pb-[4.5%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[7%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.18em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Shri Krishnaya Namah · Shubh Janmotsav ॥' : '॥ श्री कृष्णाय नमः · शुभ जन्मोत्सव ॥'}
          </p>
          <div className="mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={celebrantInitial}
              brideInitial="★"
              size="sm"
              tone="gold"
            />
          </div>
          {renderBirthdayTitle({
            enFontClass: 'font-corinthia',
            nameClass: 'text-[#FFF8E7]',
            nameStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(242,180,58,0.45)',
            },
            milestoneClass: 'text-[#FFE39E]',
            milestoneStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            },
          })}
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-[#F2B43A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-10 bg-[#F2B43A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          {cityDisplay && (
            <p
              className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#FFFFFF]"
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
              }}
            >
              {cityDisplay}
            </p>
          )}
          <p
            className={`mt-0.5 text-[12px] font-medium italic ${skin.displayClass} text-[#FFE5A3]`}
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {skin.heroGreeting[stageLang]}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-corinthia text-[23px] leading-none text-[#FFF8E7]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const kumkumKanyaExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Borderless top sindoor-plum atmospheric vignette over upper courtyard pillars & hanging brass diyas */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[47%]"
        style={{
          background:
            'radial-gradient(ellipse 74% 58% at 50% 28%, rgba(43, 7, 19, 0.90) 0%, rgba(43, 7, 19, 0.74) 46%, rgba(43, 7, 19, 0.32) 76%, transparent 100%), linear-gradient(180deg, rgba(43, 7, 19, 0.88) 0%, rgba(43, 7, 19, 0.72) 38%, rgba(43, 7, 19, 0.34) 68%, transparent 100%)',
        }}
      />
      {/* Borderless bottom atmospheric scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[20%]"
        style={{
          background:
            'linear-gradient(to top, rgba(43, 7, 19, 0.88) 0%, rgba(43, 7, 19, 0.45) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[7%] pb-[4.5%] text-center ${
          compact ? 'pt-[11%]' : 'pt-[7%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.18em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Shri Mahalakshmyai Namah · Shubh Janmotsav ॥' : '॥ श्री महालक्ष्म्यै नमः · शुभ जन्मोत्सव ॥'}
          </p>
          <div className="mt-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={celebrantInitial}
              brideInitial="★"
              size="sm"
              tone="gold"
            />
          </div>
          {renderBirthdayTitle({
            enFontClass: 'font-pinyon',
            nameClass: 'text-[#FFF8EE]',
            nameStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(244,184,68,0.45)',
            },
            milestoneClass: 'text-[#FFE39E]',
            milestoneStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            },
          })}
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <span className="h-px w-10 bg-[#F4B844]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-10 bg-[#F4B844]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          {cityDisplay && (
            <p
              className="mt-1.5 text-[10.5px] font-bold uppercase tracking-[0.24em] text-[#FFFFFF]"
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
              }}
            >
              {cityDisplay}
            </p>
          )}
          <p
            className={`mt-0.5 text-[12px] font-medium italic ${skin.displayClass} text-[#FFE5A3]`}
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {skin.heroGreeting[stageLang]}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-pinyon text-[22px] leading-none text-[#FFF8EE]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const noorECharbaghExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft sunlit ivory-peach sky halo over upper Charbagh sunset sky (keeps glowing triple arches & floral pavilion crisp) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[36%]"
        style={{
          background:
            'radial-gradient(ellipse 76% 64% at 50% 24%, rgba(252, 247, 238, 0.88) 0%, rgba(252, 247, 238, 0.56) 54%, transparent 100%), linear-gradient(180deg, rgba(250, 246, 238, 0.82) 0%, rgba(250, 246, 238, 0.36) 52%, transparent 100%)',
        }}
      />
      {/* Gentle bottom marble scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%]"
        style={{
          background:
            'linear-gradient(to top, rgba(250, 246, 238, 0.92) 0%, rgba(250, 246, 238, 0.52) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[9%]' : 'pt-[5.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="text-[9.5px] font-bold uppercase tracking-[0.24em] text-[#1E3A2F]"
            style={{
              textShadow:
                '0 1px 2px rgba(255,253,248,0.98), 0 0 12px rgba(255,251,244,0.95)',
            }}
          >
            {stageLang === 'en' ? 'Bismillah · Noor-e-Charbagh' : 'नूर-ए-चारबाग़ · दावत-ए-निकाह'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_1px_4px_rgba(255,252,246,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              size="sm"
              tone="theme"
            />
          </div>
          {stageLang === 'en' ? (
            <h2
              className={`mt-0.5 px-2 max-w-full break-words font-corinthia text-[#182B22] leading-[1.02] ${
                compact ? 'text-[clamp(29px,8.2vw,39px)]' : 'text-[clamp(34px,9.2vw,46px)]'
              }`}
              style={{
                textShadow:
                  '0 1px 0 rgba(255,253,248,0.98), 0 2px 10px rgba(255,251,244,0.98), 0 0 20px rgba(255,250,242,0.94)',
              }}
            >
              {cleanGroom}{' '}
              <span className="text-[0.55em] align-middle text-[#9A7128]">&amp;</span>{' '}
              {cleanBride}
            </h2>
          ) : (
            <h2
              className={`mt-0.5 font-tiro font-semibold text-[#182B22] leading-tight ${
                compact ? 'text-[25px]' : 'text-[31px]'
              }`}
              style={{
                textShadow:
                  '0 1px 0 rgba(255,253,248,0.98), 0 2px 10px rgba(255,251,244,0.98), 0 0 20px rgba(255,250,242,0.94)',
              }}
            >
              {groomHi} <span className="text-[18px] text-[#9A7128]">एवं</span> {brideHi}
            </h2>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#B68A3A]/85" />
            <span className="size-1.5 rotate-45 bg-[#1E3A2F]" />
            <span className="h-px w-9 bg-[#B68A3A]/85" />
          </div>
          <p
            className="mt-1 text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#1E3A2F]"
            style={{
              textShadow:
                '0 1px 2px rgba(255,253,248,0.98), 0 0 12px rgba(255,251,244,0.95)',
            }}
          >
            {dateCityLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-corinthia text-[22px] leading-none text-[#182B22]"
            style={{
              textShadow:
                '0 1px 3px rgba(255,253,248,0.98), 0 0 12px rgba(255,251,244,0.95)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#1E3A2F] animate-bob-chevron" />
        </button>
      </div>
    </div>
  );

  const chiraagMandapExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft twilight-crimson atmospheric halo over the upper carved arch & starry sky (leaves crimson mandap & sacred fire unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[40%]"
        style={{
          background:
            'radial-gradient(ellipse 72% 62% at 50% 26%, rgba(36, 9, 16, 0.86) 0%, rgba(36, 9, 16, 0.62) 52%, transparent 100%), linear-gradient(180deg, rgba(36, 9, 16, 0.86) 0%, rgba(36, 9, 16, 0.56) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom stone-steps scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[18%]"
        style={{
          background:
            'linear-gradient(to top, rgba(36, 9, 16, 0.88) 0%, rgba(36, 9, 16, 0.45) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[11%]' : 'pt-[7%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.18em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Shree Ganeshaya Namah ॥' : '॥ श्री गणेशाय नमः ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              size="sm"
              tone="gold"
            />
          </div>
          {stageLang === 'en' ? (
            <h2
              className={`mt-0.5 px-2 max-w-full break-words font-pinyon text-[#FFF8EE] leading-[1.02] ${
                compact ? 'text-[clamp(28px,7.8vw,36px)]' : 'text-[clamp(32px,8.6vw,44px)]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(230,184,106,0.45)',
              }}
            >
              {cleanGroom}{' '}
              <span className="text-[0.6em] align-middle text-[#F5D68A]">&amp;</span>{' '}
              {cleanBride}
            </h2>
          ) : (
            <h2
              className={`mt-0.5 font-tiro font-semibold text-[#FFF8EE] leading-tight ${
                compact ? 'text-[24px]' : 'text-[30px]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(230,184,106,0.45)',
              }}
            >
              {groomHi} <span className="text-[18px] text-[#F5D68A]">एवं</span> {brideHi}
            </h2>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#E6B86A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#E6B86A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          <p
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {dateCityLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-pinyon text-[22px] leading-none text-[#FFF8EE]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const nandiniJhulaExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft rose-maroon top atmospheric vignette over sandstone arches (keeps lotus jhula, cake & diya lamp unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[39%]"
        style={{
          background:
            'radial-gradient(ellipse 76% 62% at 50% 24%, rgba(58, 17, 33, 0.86) 0%, rgba(58, 17, 33, 0.62) 52%, transparent 100%), linear-gradient(180deg, rgba(58, 17, 33, 0.86) 0%, rgba(58, 17, 33, 0.54) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom courtyard scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[17%]"
        style={{
          background:
            'linear-gradient(to top, rgba(58, 17, 33, 0.88) 0%, rgba(58, 17, 33, 0.44) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[10.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Shri Mahalakshmi · Nandini Jhula ॥' : '॥ श्री महालक्ष्मी · नंदिनी झूला ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={celebrantInitial}
              brideInitial="★"
              size="sm"
              tone="gold"
            />
          </div>
          {renderBirthdayTitle({
            enFontClass: 'font-corinthia',
            nameClass: 'text-[#FFF8FA]',
            nameStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(244,184,68,0.45)',
            },
            milestoneClass: 'text-[#FFE39E]',
            milestoneStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            },
          })}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#F4B844]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#F4B844]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          {dateCityLine && (
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
              }}
            >
              {dateCityLine}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-corinthia text-[22px] leading-none text-[#FFF8FA]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const kalashPraveshExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft sindoor-crimson top atmospheric vignette over mandir eaves & brass bells (keeps deity shrine, kalash, cake, Panch-Aarti & family unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[38%]"
        style={{
          background:
            'radial-gradient(ellipse 78% 64% at 50% 24%, rgba(40, 5, 10, 0.88) 0%, rgba(40, 5, 10, 0.64) 52%, transparent 100%), linear-gradient(180deg, rgba(40, 5, 10, 0.88) 0%, rgba(40, 5, 10, 0.56) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom veranda scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[17%]"
        style={{
          background:
            'linear-gradient(to top, rgba(40, 5, 10, 0.88) 0%, rgba(40, 5, 10, 0.44) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[10.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Ayushman Bhava · Kalash Pravesh ॥' : '॥ आयुष्मान् भव · कलश प्रवेश ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={celebrantInitial}
              brideInitial="★"
              size="sm"
              tone="gold"
            />
          </div>
          {renderBirthdayTitle({
            enFontClass: 'font-pinyon',
            nameClass: 'text-[#FFF8EE]',
            nameStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(244,163,36,0.45)',
            },
            milestoneClass: 'text-[#FFE39E]',
            milestoneStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            },
          })}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#F7C96B]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#F7C96B]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          {dateCityLine && (
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
              }}
            >
              {dateCityLine}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-pinyon text-[22px] leading-none text-[#FFF8EE]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const brajMadhurimaExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft Braj royal-indigo top atmospheric vignette over sandstone arch & sky (keeps Radha-Krishna sanctum & brass lotus urli 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[37%]"
        style={{
          background:
            'radial-gradient(ellipse 76% 64% at 50% 24%, rgba(8, 18, 41, 0.86) 0%, rgba(8, 18, 41, 0.62) 52%, transparent 100%), linear-gradient(180deg, rgba(8, 18, 41, 0.86) 0%, rgba(8, 18, 41, 0.54) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom courtyard scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%]"
        style={{
          background:
            'linear-gradient(to top, rgba(8, 18, 41, 0.88) 0%, rgba(8, 18, 41, 0.42) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[10.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Shri Krishnah Sharanam Mama ॥' : '॥ श्री कृष्णः शरणं मम ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              size="sm"
              tone="gold"
            />
          </div>
          {stageLang === 'en' ? (
            <h2
              className={`mt-0.5 px-2 max-w-full break-words font-corinthia text-[#FAF5EA] leading-[1.02] ${
                compact ? 'text-[clamp(29px,8vw,38px)]' : 'text-[clamp(33px,9vw,46px)]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(230,188,99,0.45)',
              }}
            >
              {cleanGroom} &amp; {cleanBride}
            </h2>
          ) : (
            <h2
              className={`mt-0.5 font-tiro font-semibold text-[#FAF5EA] leading-tight ${
                compact ? 'text-[25px]' : 'text-[31px]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(230,188,99,0.45)',
              }}
            >
              {groomHi} एवं {brideHi}
            </h2>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#E6BC63]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#E6BC63]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          <p
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {dateCityLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-corinthia text-[23px] leading-none text-[#FAF5EA]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const suryavanshiTilakExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Warm Mewar sandstone-umber top vignette over ceiling beams & lantern (keeps bandhani drapes, birthday cake, brass tilak/laddoo thali & dholak 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[37%]"
        style={{
          background:
            'radial-gradient(ellipse 76% 64% at 50% 24%, rgba(45, 22, 11, 0.88) 0%, rgba(45, 22, 11, 0.62) 52%, transparent 100%), linear-gradient(180deg, rgba(45, 22, 11, 0.88) 0%, rgba(45, 22, 11, 0.54) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom sandstone floor scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%]"
        style={{
          background:
            'linear-gradient(to top, rgba(45, 22, 11, 0.88) 0%, rgba(45, 22, 11, 0.42) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[10.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Suryavanshi Tilak · Shubh Janmotsav ॥' : '॥ सूर्यवंशी तिलक · शुभ जन्मोत्सव ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={celebrantInitial}
              brideInitial="★"
              size="sm"
              tone="gold"
            />
          </div>
          {renderBirthdayTitle({
            enFontClass: 'font-pinyon',
            nameClass: 'text-[#FFF8EB]',
            nameStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(242,169,0,0.48)',
            },
            milestoneClass: 'text-[#FFE39E]',
            milestoneStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            },
          })}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#F5C156]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#F5C156]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          {dateCityLine && (
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
              }}
            >
              {dateCityLine}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-pinyon text-[22px] leading-none text-[#FFF8EB]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const gulabiGarhExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft Jaipur damask-rose plum top vignette over sandstone arches (keeps rose cushions, cake, mithai platters & brass diya urli 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[37%]"
        style={{
          background:
            'radial-gradient(ellipse 76% 64% at 50% 24%, rgba(68, 18, 34, 0.86) 0%, rgba(68, 18, 34, 0.62) 52%, transparent 100%), linear-gradient(180deg, rgba(68, 18, 34, 0.86) 0%, rgba(68, 18, 34, 0.54) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom sandstone floor scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%]"
        style={{
          background:
            'linear-gradient(to top, rgba(68, 18, 34, 0.86) 0%, rgba(68, 18, 34, 0.42) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Gulabi Garh · Jaipur Utsav ॥' : '॥ गुलाबी गढ़ · जयपुर जन्मोत्सव ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={celebrantInitial}
              brideInitial="★"
              size="sm"
              tone="gold"
            />
          </div>
          {renderBirthdayTitle({
            enFontClass: 'font-corinthia',
            nameClass: 'text-[#FFF2EE]',
            nameStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(244,184,116,0.45)',
            },
            milestoneClass: 'text-[#FFE39E]',
            milestoneStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            },
          })}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#F5D08A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#F5D08A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          {dateCityLine && (
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
              }}
            >
              {dateCityLine}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-corinthia text-[23px] leading-none text-[#FFF2EE]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const devasthanKovilExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft temple-umber top vignette over carved mandapam ceiling (keeps sunlit inner sanctum, banana trees, pillar diyas & kolam 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[37%]"
        style={{
          background:
            'radial-gradient(ellipse 78% 64% at 50% 24%, rgba(30, 16, 8, 0.88) 0%, rgba(30, 16, 8, 0.64) 52%, transparent 100%), linear-gradient(180deg, rgba(30, 16, 8, 0.88) 0%, rgba(30, 16, 8, 0.56) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom sandstone floor scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%]"
        style={{
          background:
            'linear-gradient(to top, rgba(30, 16, 8, 0.88) 0%, rgba(30, 16, 8, 0.44) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Shubhamastu · Devasthan Kovil ॥' : '॥ शुभमस्तु · देवस्थान कोविल ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              size="sm"
              tone="gold"
            />
          </div>
          {stageLang === 'en' ? (
            <h2
              className={`mt-0.5 px-2 max-w-full break-words font-script text-[#FFF8EB] leading-[1.02] ${
                compact ? 'text-[clamp(29px,8vw,38px)]' : 'text-[clamp(33px,9vw,46px)]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(226,168,59,0.48)',
              }}
            >
              {cleanGroom} &amp; {cleanBride}
            </h2>
          ) : (
            <h2
              className={`mt-0.5 font-tiro font-semibold text-[#FFF8EB] leading-tight ${
                compact ? 'text-[25px]' : 'text-[31px]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(226,168,59,0.48)',
              }}
            >
              {groomHi} एवं {brideHi}
            </h2>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#E2A83B]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#E2A83B]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          <p
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {dateCityLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-script text-[22px] leading-none text-[#FFF8EB]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const rajwadaAagmanExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft Mewar twilight-indigo top atmospheric vignette in the dusk sky (keeps glowing palace domes, lit jharokhas, courtyard guests & diyas 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[36%]"
        style={{
          background:
            'radial-gradient(ellipse 78% 64% at 50% 22%, rgba(16, 24, 54, 0.8) 0%, rgba(16, 24, 54, 0.52) 52%, transparent 100%), linear-gradient(180deg, rgba(16, 24, 54, 0.8) 0%, rgba(16, 24, 54, 0.44) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom sandstone floor scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%]"
        style={{
          background:
            'linear-gradient(to top, rgba(24, 14, 12, 0.88) 0%, rgba(24, 14, 12, 0.42) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Padharo Mhare Des · Rajwada Aagman ॥' : '॥ पधारो म्हारे देश · राजवाड़ा आगमन ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              size="sm"
              tone="gold"
            />
          </div>
          {stageLang === 'en' ? (
            <h2
              className={`mt-0.5 px-2 max-w-full break-words font-pinyon text-[#FFF8EB] leading-[1.02] ${
                compact ? 'text-[clamp(28px,7.8vw,37px)]' : 'text-[clamp(32px,8.8vw,45px)]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(244,180,26,0.48)',
              }}
            >
              {cleanGroom} &amp; {cleanBride}
            </h2>
          ) : (
            <h2
              className={`mt-0.5 font-tiro font-semibold text-[#FFF8EB] leading-tight ${
                compact ? 'text-[25px]' : 'text-[31px]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(244,180,26,0.48)',
              }}
            >
              {groomHi} एवं {brideHi}
            </h2>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#F4B41A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#F4B41A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          <p
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {dateCityLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-pinyon text-[22px] leading-none text-[#FFF8EB]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const kanchiKalyanamExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft Kanjeevaram emerald-stone top vignette over carved granite mandapam ceiling (keeps mango-leaf toran, floral mandap, Ganesha altar, banana trees, brass lamps & white kolam 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[35%]"
        style={{
          background:
            'radial-gradient(ellipse 78% 64% at 50% 22%, rgba(14, 38, 29, 0.88) 0%, rgba(14, 38, 29, 0.62) 52%, transparent 100%), linear-gradient(180deg, rgba(14, 38, 29, 0.88) 0%, rgba(14, 38, 29, 0.54) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom granite floor scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%]"
        style={{
          background:
            'linear-gradient(to top, rgba(14, 38, 29, 0.88) 0%, rgba(14, 38, 29, 0.42) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Kanchi Kalyanam · Shubh Muhurtham ॥' : '॥ कांची कल्याणम · शुभ मुहूर्तम ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              size="sm"
              tone="gold"
            />
          </div>
          {stageLang === 'en' ? (
            <h2
              className={`mt-0.5 px-2 max-w-full break-words font-script text-[#FAF4E6] leading-[1.02] ${
                compact ? 'text-[clamp(29px,8vw,38px)]' : 'text-[clamp(33px,9vw,46px)]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(201,150,43,0.48)',
              }}
            >
              {cleanGroom} &amp; {cleanBride}
            </h2>
          ) : (
            <h2
              className={`mt-0.5 font-tiro font-semibold text-[#FAF4E6] leading-tight ${
                compact ? 'text-[25px]' : 'text-[31px]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(201,150,43,0.48)',
              }}
            >
              {groomHi} एवं {brideHi}
            </h2>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#E2B854]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#E2B854]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          <p
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {dateCityLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-script text-[22px] leading-none text-[#FAF4E6]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const murlidharLeelaExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Soft peacock-teal top vignette over carved sandstone arches (keeps marigold-morpankh jhula swing, Krishna cake, makhan-mishri bowl, flute & brass kalash 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[35%]"
        style={{
          background:
            'radial-gradient(ellipse 78% 64% at 50% 22%, rgba(7, 41, 38, 0.88) 0%, rgba(7, 41, 38, 0.62) 52%, transparent 100%), linear-gradient(180deg, rgba(7, 41, 38, 0.88) 0%, rgba(7, 41, 38, 0.54) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom sandstone floor scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%]"
        style={{
          background:
            'linear-gradient(to top, rgba(7, 41, 38, 0.88) 0%, rgba(7, 41, 38, 0.42) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Murlidhar Leela · Shubh Janmotsav ॥' : '॥ मुरलीधर लीला · शुभ जन्मोत्सव ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={celebrantInitial}
              brideInitial="★"
              size="sm"
              tone="gold"
            />
          </div>
          {renderBirthdayTitle({
            enFontClass: 'font-corinthia',
            nameClass: 'text-[#FFF8EB]',
            nameStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(247,201,107,0.48)',
            },
            milestoneClass: 'text-[#FFE39E]',
            milestoneStyle: {
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            },
          })}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#F7C96B]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#F7C96B]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          {dateCityLine && (
            <p
              className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
              }}
            >
              {dateCityLine}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-corinthia text-[23px] leading-none text-[#FFF8EB]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const bandhaniSaanjhExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Warm Marwari crimson-terracotta top atmospheric vignette over the golden Aravalli sunset sky (keeps Nahargarh fort, crimson-saffron mandap canopy, pink sandstone arches, seating & clay diyas 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[35%]"
        style={{
          background:
            'radial-gradient(ellipse 78% 64% at 50% 22%, rgba(54, 16, 10, 0.84) 0%, rgba(54, 16, 10, 0.56) 52%, transparent 100%), linear-gradient(180deg, rgba(54, 16, 10, 0.84) 0%, rgba(54, 16, 10, 0.48) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom sandstone floor scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%]"
        style={{
          background:
            'linear-gradient(to top, rgba(46, 20, 11, 0.88) 0%, rgba(46, 20, 11, 0.42) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Bandhani Saanjh · Jaipur Terrace ॥' : '॥ बांधनी साँझ · जयपुर आँगन ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              size="sm"
              tone="gold"
            />
          </div>
          {stageLang === 'en' ? (
            <h2
              className={`mt-0.5 px-2 max-w-full break-words font-pinyon text-[#FFF8EB] leading-[1.02] ${
                compact ? 'text-[clamp(28px,7.8vw,37px)]' : 'text-[clamp(32px,8.8vw,45px)]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(224,139,21,0.48)',
              }}
            >
              {cleanGroom} &amp; {cleanBride}
            </h2>
          ) : (
            <h2
              className={`mt-0.5 font-tiro font-semibold text-[#FFF8EB] leading-tight ${
                compact ? 'text-[25px]' : 'text-[31px]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(224,139,21,0.48)',
              }}
            >
              {groomHi} एवं {brideHi}
            </h2>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#F5C156]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#F5C156]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          <p
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {dateCityLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-pinyon text-[22px] leading-none text-[#FFF8EB]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const amritAnandExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Warm saffron-bronze top vignette over the marble archway sky (keeps the Golden Temple sarovar reflection, marigold torans, brass urli bowls, crimson curtains & marble walkway 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[35%]"
        style={{
          background:
            'radial-gradient(ellipse 78% 64% at 50% 22%, rgba(45, 22, 11, 0.86) 0%, rgba(45, 22, 11, 0.56) 52%, transparent 100%), linear-gradient(180deg, rgba(45, 22, 11, 0.86) 0%, rgba(45, 22, 11, 0.48) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom marble floor scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%]"
        style={{
          background:
            'linear-gradient(to top, rgba(42, 20, 10, 0.88) 0%, rgba(42, 20, 10, 0.42) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Ik Onkar · Amrit Anand ॥' : '॥ एक ओंकार · अमृत आनंद ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              size="sm"
              tone="gold"
            />
          </div>
          {stageLang === 'en' ? (
            <h2
              className={`mt-0.5 px-2 max-w-full break-words font-pinyon text-[#FFF8EB] leading-[1.02] ${
                compact ? 'text-[clamp(28px,7.8vw,37px)]' : 'text-[clamp(32px,8.8vw,45px)]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(214,90,20,0.48)',
              }}
            >
              {cleanGroom} &amp; {cleanBride}
            </h2>
          ) : (
            <h2
              className={`mt-0.5 font-tiro font-semibold text-[#FFF8EB] leading-tight ${
                compact ? 'text-[25px]' : 'text-[31px]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(214,90,20,0.48)',
              }}
            >
              {groomHi} एवं {brideHi}
            </h2>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#F5C156]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#F5C156]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          <p
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {dateCityLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-pinyon text-[22px] leading-none text-[#FFF8EB]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const ghatDeepmalaExtractedCardWelcome = (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Starry midnight-indigo twilight top wash tucked cleanly in the night sky above the chhatri & domes (keeps illuminated marble arches, guests, glowing diya rows & lake reflection 100% unobstructed) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[33%]"
        style={{
          background:
            'radial-gradient(ellipse 78% 64% at 50% 22%, rgba(11, 17, 32, 0.82) 0%, rgba(11, 17, 32, 0.48) 54%, transparent 100%), linear-gradient(180deg, rgba(11, 17, 32, 0.82) 0%, rgba(11, 17, 32, 0.42) 44%, transparent 100%)',
        }}
      />
      {/* Gentle bottom indigo-marble floor scrim behind Scroll down */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[15%]"
        style={{
          background:
            'linear-gradient(to top, rgba(11, 17, 32, 0.9) 0%, rgba(11, 17, 32, 0.45) 55%, transparent 100%)',
        }}
      />

      <div
        className={`relative z-10 flex h-full flex-col items-center justify-between px-[8%] pb-[4%] text-center ${
          compact ? 'pt-[11.5%]' : 'pt-[6.5%]'
        }`}
      >
        <div className="flex flex-col items-center">
          <p
            className="font-tiro text-[11px] font-semibold tracking-[0.16em] text-[#FFE39E]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 20px rgba(0,0,0,0.92)',
            }}
          >
            {stageLang === 'en' ? '॥ Ghat Deepmala · Shubh Vivah ॥' : '॥ घाट दीपमाला · शुभ विवाह ॥'}
          </p>
          <div className="mt-1 scale-90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            <JharokhaCrest
              themeId={theme.id}
              groomInitial={groomInitial}
              brideInitial={brideInitial}
              size="sm"
              tone="gold"
            />
          </div>
          {stageLang === 'en' ? (
            <h2
              className={`mt-0.5 px-2 max-w-full break-words font-pinyon text-[#FFF8EB] leading-[1.02] ${
                compact ? 'text-[clamp(28px,7.8vw,37px)]' : 'text-[clamp(32px,8.8vw,45px)]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(244,180,26,0.52)',
              }}
            >
              {cleanGroom} &amp; {cleanBride}
            </h2>
          ) : (
            <h2
              className={`mt-0.5 font-tiro font-semibold text-[#FFF8EB] leading-tight ${
                compact ? 'text-[25px]' : 'text-[31px]'
              }`}
              style={{
                textShadow:
                  '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(244,180,26,0.52)',
              }}
            >
              {groomHi} एवं {brideHi}
            </h2>
          )}
          <div className="mt-1 flex items-center justify-center gap-2">
            <span className="h-px w-9 bg-[#F4B41A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
            <span className="h-px w-9 bg-[#F4B41A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
          </div>
          <p
            className="mt-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#FFFFFF]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 14px rgba(0,0,0,0.98), 0 0 22px rgba(0,0,0,0.95)',
            }}
          >
            {dateCityLine}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
          className="pointer-events-auto group flex flex-col items-center gap-0.5 cursor-pointer"
        >
          <span
            className="font-pinyon text-[22px] leading-none text-[#FFF8EB]"
            style={{
              textShadow:
                '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
            }}
          >
            {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-[#FFE39E] animate-bob-chevron drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]" />
        </button>
      </div>
    </div>
  );

  const extractedCardWelcomeOverlay =
    theme.id === 'gulab'
      ? pushpVasantExtractedCardWelcome
      : theme.id === 'confetti-garden'
        ? khushiyanPotliExtractedCardWelcome
        : theme.id === 'jashn-birthday'
          ? shamaMahotsavExtractedCardWelcome
          : theme.id === 'kanha-makhan'
            ? gokulMatkiExtractedCardWelcome
            : theme.id === 'devi-kumkum'
              ? kumkumKanyaExtractedCardWelcome
              : theme.id === 'mehr'
                ? noorECharbaghExtractedCardWelcome
                : theme.id === 'roshni'
                  ? chiraagMandapExtractedCardWelcome
                  : theme.id === 'ladli-kanya'
                    ? nandiniJhulaExtractedCardWelcome
                    : theme.id === 'shubh-aarti'
                      ? kalashPraveshExtractedCardWelcome
                      : theme.id === 'vrindavan'
                        ? brajMadhurimaExtractedCardWelcome
                        : theme.id === 'veer-balak'
                          ? suryavanshiTilakExtractedCardWelcome
                          : theme.id === 'gulab-baisa'
                            ? gulabiGarhExtractedCardWelcome
                            : theme.id === 'temple'
                              ? devasthanKovilExtractedCardWelcome
                              : theme.id === 'jharokha'
                                ? rajwadaAagmanExtractedCardWelcome
                                : theme.id === 'pattu-zari'
                                  ? kanchiKalyanamExtractedCardWelcome
                                  : theme.id === 'baal-gopal'
                                    ? murlidharLeelaExtractedCardWelcome
                                    : theme.id === 'kesariya'
                                      ? bandhaniSaanjhExtractedCardWelcome
                                      : theme.id === 'kalgi'
                                        ? amritAnandExtractedCardWelcome
                                        : theme.id === 'deepotsav'
                                          ? ghatDeepmalaExtractedCardWelcome
                                          : shahiMoharExtractedCardWelcome;

  return (
    <div
      style={{ backgroundColor: skin.heroBgHex, color: skin.inkHex }}
      className="relative h-full w-full overflow-hidden select-none"
    >
      {/* ==================== STAGE 2: REVEALED SCROLLABLE THEME INVITATION ==================== */}
      <div
        ref={scrollContainerRef}
        className={`relative h-full w-full overflow-y-auto overflow-x-hidden no-scrollbar scroll-smooth ${
          bodyOpen ? 'pointer-events-auto' : 'pointer-events-none'
        } ${skin.paperClass}`}
      >
        {/* 0. WALK-IN HERO */}
        <section
          aria-label="Wedding Invitation Hero"
          style={{
            backgroundColor: skin.heroBgHex,
            color: isLightHero ? skin.inkHex : '#FAF6EE',
          }}
          className={`relative w-full overflow-hidden flex flex-col justify-between ${
            isExtractedVideoCard
              ? 'min-h-full h-full'
              : compact
                ? 'min-h-[86%] pt-10 pb-8 px-5'
                : 'min-h-[86%] pt-11 pb-10 px-6'
          }`}
        >
          {/* Walk-in Settle + Continuous 2.5D Living Gimbal Hero Art */}
          <img
            src={effectiveHeroImage}
            alt={theme.imageAlt}
            referrerPolicy="no-referrer"
            className={`absolute inset-0 h-full w-full object-cover object-center ${
              bodyOpen &&
              theme.id !== 'jharokha' &&
              theme.id !== 'mehndi-jhoola' &&
              !isExtractedVideoCard
                ? 'animate-ken-burns-slow'
                : ''
            } ${isExtractedVideoCard || !skin.isDark ? 'opacity-100' : 'opacity-76'}`}
          />

          {/* Multi-Layer 2.5D Swaying Garlands, Volumetric Sunbeams & Diya Shimmer in Stage 2 Hero */}
          {theme.id !== 'jharokha' && theme.id !== 'mehndi-jhoola' && !isExtractedVideoCard && (
            <LivingSceneMotionOverlay
              themeId={theme.id}
              compact={compact}
              showBottomDiyas={!isLightHero}
              intensity="rich"
            />
          )}

          {isExtractedVideoCard ? (
            <>
              {extractedCardWelcomeOverlay}
              {/* Subtle bottom 8% gradient melting into template paper */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[8%]"
                style={{
                  background: `linear-gradient(to bottom, transparent 0%, ${skin.paperHex} 100%)`,
                }}
              />
            </>
          ) : (
            <>
              {/* Protective Top Atmospheric Wash tailored to light vs dark theme art */}
              {isLightHero ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      theme.id === 'mehndi-jhoola'
                        ? 'linear-gradient(to bottom, rgba(249, 234, 198, 0.85) 0%, rgba(249, 234, 198, 0.35) 36%, transparent 65%)'
                          : theme.id === 'gulab'
                            ? 'radial-gradient(ellipse at 50% 24%, rgba(252, 239, 241, 0.84) 0%, rgba(252, 239, 241, 0.34) 52%, transparent 80%)'
                            : theme.id === 'confetti-garden' || theme.id === 'nanhe-kadam' || theme.id === 'rangoli-utsav'
                              ? 'linear-gradient(to bottom, rgba(255, 248, 238, 0.9) 0%, rgba(255, 248, 238, 0.45) 42%, transparent 72%)'
                              : theme.id === 'baal-gopal' || theme.id === 'veer-balak' || theme.id === 'ganesh-aashish'
                                ? 'linear-gradient(to bottom, rgba(246, 239, 224, 0.92) 0%, rgba(246, 239, 224, 0.48) 44%, transparent 74%)'
                                : theme.id === 'ladli-kanya' || theme.id === 'gulab-baisa'
                                  ? 'linear-gradient(to bottom, rgba(253, 240, 242, 0.9) 0%, rgba(253, 240, 242, 0.44) 44%, transparent 74%)'
                                  : theme.id === 'kesariya'
                                    ? 'linear-gradient(to bottom, rgba(255, 243, 224, 0.92) 0%, rgba(255, 243, 224, 0.48) 44%, transparent 74%)'
                                    : theme.id === 'pattu-zari'
                                      ? 'linear-gradient(to bottom, rgba(250, 244, 230, 0.9) 0%, rgba(250, 244, 230, 0.42) 44%, transparent 74%)'
                                      : theme.id === 'van-upvan'
                                        ? 'linear-gradient(to bottom, rgba(242, 246, 239, 0.88) 0%, rgba(242, 246, 239, 0.45) 32%, transparent 52%)'
                                        : 'radial-gradient(ellipse at 50% 42%, rgba(240, 238, 233, 0.55) 0%, transparent 74%)',
                  }}
                />
              ) : (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      theme.id === 'sheesh-mahal'
                        ? 'radial-gradient(ellipse at 50% 45%, rgba(11, 9, 16, 0.48) 0%, rgba(11, 9, 16, 0.78) 80%)'
                        : 'radial-gradient(ellipse at 50% 24%, rgba(16, 13, 28, 0.72) 0%, rgba(16, 13, 28, 0.32) 55%, rgba(16, 13, 28, 0.55) 100%)',
                  }}
                />
              )}

              {/* Subtle Inner Hairline Royal Foil Frame */}
              <div
                aria-hidden="true"
                style={{
                  borderColor: isLightHero ? `${skin.goldHex}47` : `${skin.goldHex}59`,
                }}
                className="pointer-events-none absolute inset-3 rounded-2xl border"
              />

              {/* Bottom 16% gradient melting seamlessly into theme paper hex */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[16%]"
                style={{
                  background: `linear-gradient(to bottom, transparent 0%, ${skin.paperHex}A6 55%, ${skin.paperHex} 100%)`,
                }}
              />

              {/* Hero Top Zone Copy */}
              <div
                className={`relative z-10 flex flex-col items-center text-center ${
                  theme.id === 'gulab'
                    ? 'pt-[11%]'
                    : theme.id === 'ivory'
                      ? 'pt-[24%]'
                      : theme.id === 'sheesh-mahal'
                    ? 'pt-[24%]'
                    : theme.id === 'mehndi-jhoola' ||
                        theme.id === 'confetti-garden' ||
                        theme.id === 'nanhe-kadam' ||
                        theme.id === 'baal-gopal' ||
                        theme.id === 'rangoli-utsav' ||
                        theme.id === 'ladli-kanya' ||
                        theme.id === 'gulab-baisa' ||
                        theme.id === 'veer-balak' ||
                        theme.id === 'ganesh-aashish' ||
                        theme.id === 'kesariya' ||
                        theme.id === 'pattu-zari'
                      ? 'pt-2'
                      : 'pt-1'
            }`}
          >
            {isLightHero ? (
              <div
                className={
                  theme.id === 'van-upvan'
                    ? 'flex flex-col items-center rounded-2xl border border-[#4E6E58]/25 bg-[#F7FAF5]/82 px-4 py-2.5 shadow-sm backdrop-blur-[3px]'
                    : 'flex flex-col items-center'
                }
              >
                <p
                  style={{ color: theme.id === 'van-upvan' ? '#1E3A2B' : skin.inkHex }}
                  className="text-[10.5px] font-bold uppercase tracking-[0.22em] drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]"
                >
                  {isGirlHindu
                    ? stageLang === 'en'
                      ? '॥ Shri Mahalakshmi · Kanya Janmotsav ॥'
                      : '॥ श्री महालक्ष्म्यै नमः · कन्या जन्मोत्सवः ॥'
                    : isBoyHindu
                      ? stageLang === 'en'
                        ? '॥ Ayushman Bhava · Balak Janmotsav ॥'
                        : '॥ आयुष्मान् भव · बालक जन्मोत्सवः ॥'
                      : isHinduBirthday
                        ? stageLang === 'en'
                          ? '॥ Ayushman Bhava · Shubh Janmotsav ॥'
                          : '॥ श्री गणेशाय नमः · शुभ जन्मोत्सवः ॥'
                        : isBabyBirthday
                          ? stageLang === 'en'
                            ? '॥ Bal Janmotsav · First Birthday ॥'
                            : '॥ श्री गणेशाय नमः · प्रथम जन्मोत्सव ॥'
                          : isBirthday
                            ? stageLang === 'en'
                              ? 'You are invited to celebrate'
                              : 'जन्मदिन उत्सव में सादर आमंत्रण'
                            : stageLang === 'en'
                              ? 'Welcome to the wedding of'
                              : 'शुभ विवाह निमंत्रण'}
                </p>
                <div className="mt-1.5">
                  <JharokhaCrest
                    themeId={theme.id}
                    groomInitial={
                      theme.celebrationType === 'birthday' ? celebrantInitial : groomInitial
                    }
                    brideInitial={isHinduBirthday ? 'ॐ' : isBirthday ? '★' : brideInitial}
                    size="sm"
                    tone="theme"
                  />
                </div>
                {isBirthday ? (
                  renderBirthdayTitle({
                    enFontClass: skin.scriptClass,
                    nameClass:
                      theme.id === 'van-upvan'
                        ? 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]'
                        : 'foil-gold-deep-text',
                    nameStyle: theme.id === 'van-upvan' ? { color: '#163020' } : undefined,
                    milestoneStyle: {
                      color: theme.id === 'van-upvan' ? '#2A4736' : skin.accentHex,
                    },
                  })
                ) : stageLang === 'en' ? (
                  (cleanGroom || cleanBride) && (
                    <h2
                      style={theme.id === 'van-upvan' ? { color: '#163020' } : undefined}
                      className={`mt-1.5 px-2 max-w-full break-words ${skin.scriptClass} ${
                        theme.id === 'van-upvan'
                          ? 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]'
                          : 'foil-gold-deep-text'
                      } leading-[1.08] ${
                        compact ? 'text-[clamp(28px,8vw,36px)]' : 'text-[clamp(30px,8.8vw,44px)]'
                      }`}
                    >
                      {cleanGroom}
                      {cleanGroom && cleanBride && (
                        <>
                          {' '}
                          <span className="text-[0.55em] align-middle opacity-85">&amp;</span>{' '}
                        </>
                      )}
                      {cleanBride}
                    </h2>
                  )
                ) : (
                  (groomHi || brideHi) && (
                    <h2
                      style={theme.id === 'van-upvan' ? { color: '#163020' } : undefined}
                      className={`mt-1.5 font-tiro font-semibold ${
                        theme.id === 'van-upvan'
                          ? 'drop-shadow-[0_1px_2px_rgba(255,255,255,0.95)]'
                          : 'foil-gold-deep-text'
                      } leading-tight ${
                        compact ? 'text-[28px]' : 'text-[34px]'
                      }`}
                    >
                      {groomHi}
                      {groomHi && brideHi && (
                        <>
                          {' '}
                          <span className="text-[20px]">एवं</span>{' '}
                        </>
                      )}
                      {brideHi}
                    </h2>
                  )
                )}
                <div
                  className="mt-2 h-px w-14"
                  style={{ backgroundColor: `${skin.goldHex}B3` }}
                />
                {cityDisplay && (
                  <p
                    style={{ color: theme.id === 'van-upvan' ? '#2A4736' : skin.mutedInkHex }}
                    className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em]"
                  >
                    {cityDisplay}
                  </p>
                )}
              </div>
            ) : (
              <>
                <p className="font-tiro text-[11px] tracking-[0.18em] text-[#F5D68A] drop-shadow">
                  {isGirlHindu
                    ? stageLang === 'en'
                      ? '॥ Shri Mahalakshmi · Kanya Janmotsav ॥'
                      : '॥ श्री महालक्ष्म्यै नमः · कन्या जन्मोत्सवः ॥'
                    : isBoyHindu
                      ? stageLang === 'en'
                        ? '॥ Ayushman Bhava · Balak Janmotsav ॥'
                        : '॥ आयुष्मान् भव · बालक जन्मोत्सवः ॥'
                      : isHinduBirthday
                        ? stageLang === 'en'
                          ? '॥ Ayushman Bhava · Shubh Janmotsav ॥'
                          : '॥ श्री गणेशाय नमः · शुभ जन्मोत्सवः ॥'
                        : isBabyBirthday
                          ? stageLang === 'en'
                            ? '॥ Bal Janmotsav · First Birthday ॥'
                            : '॥ श्री गणेशाय नमः · प्रथम जन्मोत्सव ॥'
                          : isBirthday
                            ? stageLang === 'en'
                              ? 'You’re Invited to Celebrate'
                              : 'जन्मदिन संध्या आमंत्रण'
                            : '॥ श्री गणेशाय नमः ॥'}
                </p>
                <div className="mt-2">
                  <JharokhaCrest
                    themeId={theme.id}
                    groomInitial={
                      theme.celebrationType === 'birthday' ? celebrantInitial : groomInitial
                    }
                    brideInitial={isHinduBirthday ? 'ॐ' : isBirthday ? '★' : brideInitial}
                    size="sm"
                    tone="gold"
                  />
                </div>

                {isBirthday ? (
                  renderBirthdayTitle({
                    enFontClass: skin.scriptClass,
                    nameClass: 'foil-gold-text drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]',
                    milestoneClass: 'text-[#F5D68A] drop-shadow',
                  })
                ) : stageLang === 'en' ? (
                  (cleanGroom || cleanBride) && (
                    <h2
                      className={`mt-2.5 px-2 max-w-full break-words ${skin.scriptClass} foil-gold-text leading-[1.08] drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] ${
                        compact ? 'text-[clamp(28px,8vw,38px)]' : 'text-[clamp(32px,9vw,46px)]'
                      }`}
                    >
                      {cleanGroom}
                      {cleanGroom && cleanBride && (
                        <>
                          {' '}
                          <span className="text-[0.55em] align-middle opacity-90">&amp;</span>{' '}
                        </>
                      )}
                      {cleanBride}
                    </h2>
                  )
                ) : (
                  (groomHi || brideHi) && (
                    <h2
                      className={`mt-2.5 font-tiro font-semibold foil-gold-text leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] ${
                        compact ? 'text-[30px]' : 'text-[36px]'
                      }`}
                    >
                      {groomHi}
                      {groomHi && brideHi && (
                        <>
                          {' '}
                          <span className="text-[20px]">एवं</span>{' '}
                        </>
                      )}
                      {brideHi}
                    </h2>
                  )
                )}

                {cityDisplay && (
                  <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.22em] text-[#F7E9CE]/95 drop-shadow">
                    {cityDisplay}
                  </p>
                )}
                <p className={`mt-0.5 text-[11px] italic ${skin.displayClass} text-[#F5D68A]/90`}>
                  {skin.heroGreeting[stageLang]}
                </p>
              </>
            )}
          </div>

          {/* Bottom Scroll Down Bobbing Prompt */}
          <div className="relative z-10 flex flex-col items-center pb-2">
            <button
              type="button"
              onClick={() => {
                welcomeSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              style={{ color: skin.inkHex }}
              className="group flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <span className={`${skin.scriptClass} text-[21px] leading-none`}>
                {stageLang === 'en' ? 'Scroll down' : 'आगे देखें'}
              </span>
              <ChevronDown
                style={{ color: skin.accentHex }}
                className="h-4 w-4 animate-bob-chevron"
              />
            </button>
          </div>
            </>
          )}
        </section>

        {/* SCROLLABLE THEME PAPER BODY (Per-Theme Bespoke Structural Sequencing!) */}
        <div
          ref={welcomeSectionRef}
          style={{ color: skin.inkHex }}
          className={`relative z-10 ${skin.paperClass} ${
            compact ? 'px-4 pt-3 pb-24 space-y-8' : 'px-5 sm:px-6 pt-4 pb-24 space-y-10'
          }`}
        >
          {guestFamilyGreeting && (
            <div
              style={{
                backgroundColor: skin.cardHex,
                borderColor: `${skin.goldHex}73`,
              }}
              className="rounded-xl border px-3.5 py-2.5 text-center shadow-xs"
            >
              <p
                style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                className="text-[9.5px] font-semibold uppercase tracking-[0.18em]"
              >
                {stageLang === 'en' ? 'Personal Family Invitation' : 'सपरिवार सादर निमंत्रण'}
              </p>
              <p style={{ color: skin.inkHex }} className="mt-0.5 font-display text-base font-semibold">
                {stageLang === 'en'
                  ? `Padharo, ${guestFamilyGreeting}`
                  : `पधारो, ${guestFamilyGreeting}`}
              </p>
            </div>
          )}

          {/* ==================== 1. ROYAL SCALLOPED JHAROKHA ARCH INVITATION CARD (Wedding Only) ==================== */}
          {!isBirthday && isSectionEnabled('formal') && formalInviteBlock}

          {/* ==================== 2. COUPLE FRAMED PORTRAIT CARD & LITTLE ONES' BAL MANUHAR ==================== */}
          <section className="jharokha-reveal pt-1 text-center space-y-4">
            {/* Top "THE ROYAL COUPLE" / "CELEBRATION PORTRAIT" Label */}
            <div className="inline-flex items-center justify-center">
              <span
                style={{
                  backgroundColor: skin.isDark ? `${skin.goldHex}24` : `${skin.accentHex}14`,
                  borderColor: `${skin.goldHex}66`,
                  color: skin.isDark ? skin.goldHex : skin.accentHex,
                }}
                className="rounded-full border px-4 py-1 text-[10px] font-bold uppercase tracking-[0.22em] shadow-xs"
              >
                {isBirthday
                  ? stageLang === 'en'
                    ? 'Birthday Portrait'
                    : 'शुभ जन्मोत्सव'
                  : stageLang === 'en'
                    ? 'The Bride & Groom'
                    : 'वर एवं वधू'}
              </span>
            </div>

            {/* Outer Dashed Frame + Lotus Crest Emblem + Rounded Portrait Frame */}
            <div
              style={{
                borderColor: `${skin.goldHex}80`,
                backgroundColor: skin.isDark ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.55)',
              }}
              className="relative mx-auto mt-3 max-w-[310px] rounded-[28px] border border-dashed p-2"
            >
              {/* Overlapping Top Circular Lotus Emblem */}
              <div
                style={{
                  borderColor: `${skin.goldHex}99`,
                  backgroundColor: skin.cardHex,
                  color: skin.isDark ? skin.goldHex : skin.accentHex,
                }}
                className="absolute -top-4 left-1/2 z-20 -translate-x-1/2 grid size-9 place-items-center rounded-full border border-dashed shadow-md"
              >
                <svg viewBox="0 0 24 24" fill="none" className="h-4.5 w-4.5" stroke="currentColor" strokeWidth="1.6">
                  <path d="M12 4C10 7.5 9 10.5 12 14C15 10.5 14 7.5 12 4Z" />
                  <path d="M12 14C8.5 13 6 10.5 5 7.5C8 8 10.5 10 12 14Z" />
                  <path d="M12 14C15.5 13 18 10.5 19 7.5C16 8 13.5 10 12 14Z" />
                  <path d="M4 16.5C7.5 15.5 16.5 15.5 20 16.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Inner Template-Tinted Portrait Card */}
              <div
                style={{
                  backgroundColor:
                    !skin.isDark && skin.cardHex.toUpperCase() === '#FFFFFF'
                      ? skin.paperHex
                      : skin.cardHex,
                  borderColor: `${skin.goldHex}66`,
                }}
                className="relative overflow-hidden rounded-[22px] border p-2 shadow-lg"
              >
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[16px]">
                  <img
                    src={
                      customization?.couplePhotoUrl?.trim() ||
                      (isBirthday ? BIRTHDAY_STAR_PORTRAIT_IMAGE : ROYAL_COUPLE_PORTRAIT_IMAGE)
                    }
                    alt={
                      isBirthday
                        ? `${celebrantEn} celebration portrait`
                        : `${cleanGroom} and ${cleanBride} portrait`
                    }
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                  />

                  {/* Top-Left Tilted Template-Styled Pill Badge */}
                  {(!isBirthday || activeBirthdayMilestone) && (
                    <div
                      style={{
                        backgroundColor: skin.isDark
                          ? `${skin.cardHex}F2`
                          : `${
                              skin.cardHex.toUpperCase() === '#FFFFFF' ? skin.paperHex : skin.cardHex
                            }F2`,
                        borderColor: `${skin.goldHex}80`,
                        color: skin.isDark ? skin.goldHex : skin.inkHex,
                      }}
                      className="pointer-events-none absolute left-2.5 top-3 -rotate-3 rounded-full border px-3.5 py-1 shadow-md backdrop-blur-xs"
                    >
                      <span className="text-[10px] font-bold uppercase tracking-[0.16em]">
                        {isBirthday
                          ? activeBirthdayMilestone
                          : theme.id === 'mehr'
                            ? stageLang === 'en'
                              ? 'Nikah Mubarak'
                              : 'निकाह मुबारक'
                            : theme.id === 'kalgi'
                              ? stageLang === 'en'
                                ? 'Anand Karaj'
                                : 'आनंद कारज'
                              : theme.id === 'temple' || theme.id === 'pattu-zari'
                                ? stageLang === 'en'
                                  ? 'Shubh Muhurtham'
                                  : 'शुभ मुहूर्तम्'
                                : stageLang === 'en'
                                  ? 'Shubh Vivah'
                                  : 'शुभ विवाह'}
                      </span>
                    </div>
                  )}

                  {/* Bottom-Right Tilted Template-Styled Pill Badge */}
                  <div
                    style={{
                      backgroundColor: skin.isDark ? skin.goldHex : skin.accentHex,
                      borderColor: `${skin.goldHex}99`,
                      color: skin.isDark ? '#1A110B' : '#FFFFFF',
                    }}
                    className="pointer-events-none absolute bottom-3 right-2.5 rotate-2 rounded-full border px-3.5 py-1 shadow-md"
                  >
                    <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                      {isBirthday
                        ? stageLang === 'en'
                          ? 'Blessed'
                          : 'चिरंजीवी'
                        : stageLang === 'en'
                          ? 'Forever'
                          : 'सदा सर्वदा'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Little Ones' Cute Invitation Callout ("बाल मनुहार" — Wedding Category Only) */}
            {!isBirthday &&
              (() => {
                const kidsLineText = (
                  stageLang === 'en'
                    ? customization?.littleOnesLineEn?.trim() ||
                      customization?.littleOnesLineHi?.trim() ||
                      (hasCustom ? '' : COUPLE_DEFAULTS.littleOnesLine.en)
                    : customization?.littleOnesLineHi?.trim() ||
                      customization?.littleOnesLineEn?.trim() ||
                      (hasCustom ? '' : COUPLE_DEFAULTS.littleOnesLine.hi)
                ).replace(/^#[^\s—–-]+\s*[—–-]?\s*/u, '');
                const kidsNamesText =
                  stageLang === 'en'
                    ? customization?.littleOnesNamesEn?.trim() ||
                      customization?.littleOnesNamesHi?.trim() ||
                      (hasCustom ? '' : COUPLE_DEFAULTS.littleOnesNames.en)
                    : customization?.littleOnesNamesHi?.trim() ||
                      customization?.littleOnesNamesEn?.trim() ||
                      (hasCustom ? '' : COUPLE_DEFAULTS.littleOnesNames.hi);
                if (!kidsLineText && !kidsNamesText) return null;
                return (
                  <div
                    style={{
                      backgroundColor: skin.altCardHex,
                      borderColor: `${skin.goldHex}73`,
                    }}
                    className="mx-auto rounded-2xl border border-dashed px-3.5 py-2.5 text-center shadow-2xs"
                  >
                    <p
                      style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                      className="text-[9.5px] font-bold uppercase tracking-[0.18em]"
                    >
                      {stageLang === 'en'
                        ? '✦ Little Ones’ Sweet Invite (बाल मनुहार) ✦'
                        : '✦ नन्हे बच्चों की प्यारी मनुहार ✦'}
                    </p>
                    {kidsLineText && (
                      <p
                        style={{ color: skin.inkHex }}
                        className={`mt-1 text-[11.5px] font-semibold leading-snug break-words ${
                          stageLang === 'hi' ? 'font-tiro' : ''
                        }`}
                      >
                        {kidsLineText}
                      </p>
                    )}
                    {kidsNamesText && (
                      <p
                        style={{ color: skin.mutedInkHex }}
                        className="mt-1 text-[10px] font-medium italic"
                      >
                        — {kidsNamesText}
                      </p>
                    )}
                  </div>
                );
              })()}

            {/* Ornate 4-Petal Star Divider */}
            <div className="flex items-center justify-center gap-3 pt-1">
              <span
                className="h-px w-16"
                style={{ backgroundColor: `${skin.goldHex}66` }}
              />
              <span
                style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                className="text-sm leading-none"
              >
                ✦
              </span>
              <span
                className="h-px w-16"
                style={{ backgroundColor: `${skin.goldHex}66` }}
              />
            </div>
          </section>

          {formatSections}

          {customization?.shagunUpi?.trim() && (
            <section
              style={{
                backgroundColor: skin.cardHex,
                borderColor: `${skin.goldHex}66`,
              }}
              className="jharokha-reveal rounded-2xl border p-4 text-center shadow-sm"
            >
              <div className="mx-auto grid size-8 place-items-center rounded-full border border-[#C88A2B]/40 text-[#C88A2B]">
                <Gift className="h-4 w-4" />
              </div>
              <p
                style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em]"
              >
                {stageLang === 'en' ? 'Blessings & Shagun by UPI' : 'आशीर्वाद व डिजिटल शगुन'}
              </p>
              <p style={{ color: skin.mutedInkHex }} className="mt-1 text-[11px] leading-snug">
                {stageLang === 'en'
                  ? 'Your presence is our greatest gift. For far-away elders wishing to send blessings:'
                  : 'आपका स्नेह व उपस्थिति ही सबसे बड़ा उपहार है।'}
              </p>
              <div className="mt-2.5 inline-flex items-center gap-2 rounded-lg border border-[#C88A2B]/45 bg-white/90 px-3 py-1.5 text-[11px] font-mono text-[#2A1316]">
                <span>{customization.shagunUpi.trim()}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(customization.shagunUpi!.trim());
                    setCopiedUpi(true);
                    window.setTimeout(() => setCopiedUpi(false), 1800);
                  }}
                  className="text-[#9E2A2B] hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  {copiedUpi ? <Check className="h-3 w-3 text-emerald-700" /> : <Copy className="h-3 w-3" />}
                  <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="mt-2">
                <a
                  href={`upi://pay?pa=${encodeURIComponent(customization.shagunUpi.trim())}&pn=${encodeURIComponent(
                    isBirthday ? celebrantEn : `${cleanGroom} & ${cleanBride}`
                  )}&tn=${encodeURIComponent('Shagun Blessings via NIMANTRAN')}&cu=INR`}
                  style={{ backgroundColor: skin.isDark ? '#C2933F' : skin.accentHex, color: skin.isDark ? '#1A110B' : '#FFFFFF' }}
                  className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold hover:opacity-90"
                >
                  <span>{stageLang === 'en' ? 'Send Shagun via UPI App →' : 'UPI से शगुन भेजें →'}</span>
                </a>
              </div>
            </section>
          )}

          {/* 9. VALIDATED INTERACTIVE RSVP FORM & CEREMONY STEPPER (#jharokha-rsvp-stage) */}
          {isSectionEnabled('rsvp') && (
          <section
            id="jharokha-rsvp-stage"
            ref={rsvpSectionRef}
            style={{
              backgroundColor: skin.cardHex,
              borderColor: `${skin.accentHex}59`,
            }}
            className="jharokha-reveal rounded-2xl border-2 p-4 shadow-md"
          >
            <div
              style={{ borderColor: `${skin.goldHex}4D` }}
              className="text-center pb-3 border-b"
            >
              <p
                style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                className="text-[10px] font-semibold uppercase tracking-[0.2em]"
              >
                {stageLang === 'en'
                  ? rsvpDeadlineDisplay
                    ? `Kindly Reply By ${rsvpDeadlineDisplay}`
                    : 'Kindly Reply'
                  : rsvpDeadlineDisplay
                    ? `कृपया ${rsvpDeadlineDisplay} तक उपस्थिति की पुष्टि करें`
                    : 'कृपया उपस्थिति की पुष्टि करें'}
              </p>
              <h4
                style={{ color: skin.inkHex }}
                className={`mt-0.5 ${skin.scriptClass} leading-tight ${
                  compact ? 'text-[28px]' : 'text-[32px]'
                }`}
              >
                {stageLang === 'en' ? 'Your Presence Matters' : 'आपकी उपस्थिति प्रार्थनीय'}
              </h4>
            </div>

            {rsvpSent ? (
              <div className="mt-4 rounded-xl border border-emerald-300 bg-emerald-50/95 p-3.5 text-center space-y-2 text-[#1A2E22]">
                <span className="mx-auto grid size-8 place-items-center rounded-full bg-emerald-600 text-white">
                  <Check className="h-4 w-4" />
                </span>
                <p className="font-display text-lg font-semibold text-emerald-950">
                  {rsvpStatus === 'declined'
                    ? stageLang === 'en'
                      ? 'Blessings Received'
                      : 'शुभकामनाएँ प्राप्त हुईं'
                    : stageLang === 'en'
                      ? 'Dhanyavaad! RSVP Saved'
                      : 'धन्यवाद! आपकी स्वीकृति दर्ज हुई'}
                </p>
                <p className="text-[11px] text-emerald-900 leading-snug">
                  <strong>{rsvpName.trim()}</strong>{' '}
                  {rsvpStatus === 'attending'
                    ? `(${rsvpGuestCount} ${stageLang === 'en' ? 'guests' : 'अतिथि'} · ${dietLabel})`
                    : stageLang === 'en'
                      ? '(With Warm Blessings)'
                      : '(सस्नेह आशीर्वाद)'}
                  {rsvpContact.trim() ? ` · ${rsvpContact.trim()}` : ''}
                </p>
                {rsvpStatus === 'attending' && selectedEventTitles && (
                  <p className="text-[10px] text-[#3E5C48]">{selectedEventTitles}</p>
                )}
                <p className="text-[10px] font-medium text-emerald-700">
                  {stageLang === 'en'
                    ? 'Tap below to send your reply directly on WhatsApp'
                    : 'नीचे दबाकर अपना उत्तर सीधे व्हाट्सएप पर भेजें'}
                </p>

                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={whatsappReplyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#1F6E4A] px-3 py-2 text-[11.5px] font-semibold text-white hover:bg-[#18583b]"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>
                      {stageLang === 'en' ? 'Send Reply on WhatsApp' : 'व्हाट्सएप पर भी भेजें'}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setRsvpSent(false)}
                    className="text-[11px] font-medium text-[#3E5C48] underline cursor-pointer"
                  >
                    {stageLang === 'en' ? 'Modify details' : 'विवरण बदलें'}
                  </button>
                </div>
              </div>
            ) : (
              <form noValidate onSubmit={handleStageRsvpSubmit} className="mt-3.5 space-y-2.5">
                {/* Attendance Status Toggle (Attending vs With Blessings) */}
                <div
                  style={{
                    backgroundColor: skin.altCardHex,
                    borderColor: `${skin.goldHex}59`,
                  }}
                  className="grid grid-cols-2 gap-1.5 rounded-xl p-1 border"
                >
                  <button
                    type="button"
                    onClick={() => setRsvpStatus('attending')}
                    style={
                      rsvpStatus === 'attending'
                        ? {
                            backgroundColor: skin.isDark ? skin.goldHex : skin.accentHex,
                            color: skin.isDark ? '#1A110B' : '#FFFFFF',
                          }
                        : { color: skin.mutedInkHex }
                    }
                    className="rounded-lg px-2 py-1.5 text-[10.5px] font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    {stageLang === 'en' ? 'Yes, Attending' : 'हाँ, आ रहे हैं'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setRsvpStatus('declined');
                      setRsvpErrors((prev) => ({ ...prev, events: undefined }));
                    }}
                    style={
                      rsvpStatus === 'declined'
                        ? {
                            backgroundColor: skin.inkHex,
                            color: skin.cardHex,
                          }
                        : { color: skin.mutedInkHex }
                    }
                    className="rounded-lg px-2 py-1.5 text-[10.5px] font-semibold transition-all cursor-pointer"
                  >
                    {stageLang === 'en' ? "Can't Make It" : 'नहीं आ पाएंगे'}
                  </button>
                </div>

                {/* Guest / Family Name */}
                <div>
                  <label
                    htmlFor={`stage-rsvp-name-${theme.id}`}
                    style={{ color: skin.inkHex }}
                    className="block text-[11px] font-semibold"
                  >
                    {stageLang === 'en' ? 'Guest / Family Name' : 'अतिथि / परिवार का नाम'}{' '}
                    <span style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}>*</span>
                  </label>
                  <input
                    id={`stage-rsvp-name-${theme.id}`}
                    type="text"
                    value={rsvpName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRsvpName(val);
                      if (rsvpTouched.name || rsvpErrors.name) {
                        const err = validateGuestName(val, stageLang);
                        setRsvpErrors((prev) => ({ ...prev, name: err || undefined }));
                      }
                    }}
                    onBlur={() => {
                      setRsvpTouched((t) => ({ ...t, name: true }));
                      const err = validateGuestName(rsvpName, stageLang);
                      setRsvpErrors((prev) => ({ ...prev, name: err || undefined }));
                    }}
                    aria-invalid={Boolean(rsvpErrors.name)}
                    placeholder={
                      stageLang === 'en' ? 'e.g. Sharma Family / Rohan' : 'जैसे शर्मा परिवार / रोहन'
                    }
                    className={`mt-1 w-full rounded-lg bg-white px-3 py-2 text-[12px] text-[#2B1B17] placeholder:text-[#896B6F] focus:outline-none border ${
                      rsvpErrors.name
                        ? 'border-[#B91C1C] ring-1 ring-red-400'
                        : 'border-[#C2933F]/50 focus:border-[#B3261E]'
                    }`}
                  />
                  {rsvpErrors.name && (
                    <p
                      role="alert"
                      className={`mt-1 flex items-center gap-1 text-[10.5px] ${
                        skin.isDark ? 'text-[#FCA5A5]' : 'text-[#DC2626]'
                      }`}
                    >
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{rsvpErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* WhatsApp / Phone Number (Optional — like nimantran.page & saath.studio) */}
                <div>
                  <label
                    htmlFor={`stage-rsvp-contact-${theme.id}`}
                    style={{ color: skin.inkHex }}
                    className="block text-[11px] font-semibold"
                  >
                    {stageLang === 'en'
                      ? 'WhatsApp / Mobile (Optional)'
                      : 'फ़ोन / व्हाट्सएप (वैकल्पिक)'}
                  </label>
                  <input
                    id={`stage-rsvp-contact-${theme.id}`}
                    type="tel"
                    inputMode="tel"
                    value={rsvpContact}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRsvpContact(val);
                      if (rsvpTouched.contact || rsvpErrors.contact) {
                        const err = validateGuestContact(val, stageLang);
                        setRsvpErrors((prev) => ({ ...prev, contact: err || undefined }));
                      }
                    }}
                    onBlur={() => {
                      setRsvpTouched((t) => ({ ...t, contact: true }));
                      const err = validateGuestContact(rsvpContact, stageLang);
                      setRsvpErrors((prev) => ({ ...prev, contact: err || undefined }));
                    }}
                    aria-invalid={Boolean(rsvpErrors.contact)}
                    placeholder={
                      stageLang === 'en'
                        ? '+91 98765 43210 (Optional)'
                        : '+91 98765 43210 (वैकल्पिक)'
                    }
                    className={`mt-1 w-full rounded-lg bg-white px-3 py-2 text-[12px] text-[#2B1B17] placeholder:text-[#896B6F] focus:outline-none border ${
                      rsvpErrors.contact
                        ? 'border-[#B91C1C] ring-1 ring-red-400'
                        : 'border-[#C2933F]/50 focus:border-[#B3261E]'
                    }`}
                  />
                  {rsvpErrors.contact && (
                    <p
                      role="alert"
                      className={`mt-1 flex items-center gap-1 text-[10.5px] ${
                        skin.isDark ? 'text-[#FCA5A5]' : 'text-[#DC2626]'
                      }`}
                    >
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      <span>{rsvpErrors.contact}</span>
                    </p>
                  )}
                </div>

                {/* Family Side Selector (Ladkewale / Ladkiwale / Friends) */}
                {!isBirthday && (
                  <div>
                    <span style={{ color: skin.inkHex }} className="block text-[11px] font-semibold mb-1">
                      {stageLang === 'en' ? 'Invited By Side' : 'परिवार पक्ष'}
                    </span>
                    <div className="grid grid-cols-3 gap-1">
                      {(
                        [
                          { id: 'groom', en: 'Ladkewale', hi: 'वर पक्ष' },
                          { id: 'bride', en: 'Ladkiwale', hi: 'वधू पक्ष' },
                          { id: 'both', en: 'Friends', hi: 'मित्रगण' },
                        ] as const
                      ).map((opt) => {
                        const isSelected = rsvpSide === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setRsvpSide(opt.id)}
                            style={
                              isSelected
                                ? {
                                    borderColor: skin.isDark ? skin.goldHex : skin.accentHex,
                                    backgroundColor: '#FFFFFF',
                                    color: skin.isDark ? '#1A110B' : skin.accentHex,
                                  }
                                : {
                                    borderColor: `${skin.goldHex}59`,
                                    backgroundColor: 'rgba(255,255,255,0.82)',
                                    color: '#4B3B39',
                                  }
                            }
                            className="rounded-lg border px-1.5 py-1.5 text-[10px] font-semibold transition-colors cursor-pointer"
                          >
                            {stageLang === 'en' ? opt.en : opt.hi}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {rsvpStatus === 'attending' && (
                  <>
                    {/* Guest Count Stepper (up to 15 family members) */}
                    <div
                      style={{ borderColor: `${skin.goldHex}66` }}
                      className="flex items-center justify-between rounded-lg border bg-white/95 px-3 py-1.5 text-[#2B1B17]"
                    >
                      <span className="text-[11px] font-semibold">
                        {stageLang === 'en' ? 'Guests Attending' : 'अतिथि संख्या'}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setRsvpGuestCount((c) => Math.max(1, c - 1))}
                          aria-label="Decrease guests"
                          style={{
                            backgroundColor: skin.isDark ? skin.goldHex : skin.altCardHex,
                            color: skin.isDark ? '#1A110B' : skin.inkHex,
                          }}
                          className="grid size-7 place-items-center rounded-md hover:opacity-90 cursor-pointer"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span
                          style={{ color: skin.isDark ? '#1A110B' : skin.accentHex }}
                          className="w-6 text-center font-display text-base font-bold tabular-nums"
                        >
                          {rsvpGuestCount}
                        </span>
                        <button
                          type="button"
                          onClick={() => setRsvpGuestCount((c) => Math.min(15, c + 1))}
                          aria-label="Increase guests"
                          style={{
                            backgroundColor: skin.isDark ? skin.goldHex : skin.altCardHex,
                            color: skin.isDark ? '#1A110B' : skin.inkHex,
                          }}
                          className="grid size-7 place-items-center rounded-md hover:opacity-90 cursor-pointer"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Indian Dietary / Food Preference */}
                    <div>
                      <span style={{ color: skin.inkHex }} className="block text-[11px] font-semibold mb-1">
                        {stageLang === 'en' ? 'Meal Preference (For Caterer)' : 'भोजन पसंद'}
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        {(
                          [
                            { id: 'pure_veg', en: 'Pure Veg', hi: 'शुद्ध शाकाहारी' },
                            { id: 'jain', en: 'Jain Food', hi: 'जैन भोजन' },
                            { id: 'veg_nonveg', en: 'Veg + Non-Veg', hi: 'वेज / नॉन-वेज' },
                          ] as const
                        ).map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setRsvpDiet(opt.id)}
                            className={`rounded-lg border px-1.5 py-1.5 text-[10px] font-semibold transition-colors cursor-pointer ${
                              rsvpDiet === opt.id
                                ? 'border-[#15803D] bg-white text-[#15803D]'
                                : 'border-[#C2933F]/35 bg-white/80 text-[#5B3E42]'
                            }`}
                          >
                            {stageLang === 'en' ? opt.en : opt.hi}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Ceremonies Checkboxes */}
                    <div>
                      <span style={{ color: skin.inkHex }} className="block text-[11px] font-semibold mb-1">
                        {stageLang === 'en' ? 'Joining us for' : 'कार्यक्रम चुनें'}{' '}
                        <span style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}>*</span>
                      </span>
                      <div className="grid grid-cols-2 gap-1.5">
                        {activeEvents.map((c) => {
                          const active = rsvpEvents.includes(c.id);
                          const activeColor = skin.isDark ? '#1A110B' : skin.accentHex;
                          const checkBg = skin.isDark ? skin.goldHex : skin.accentHex;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => toggleRsvpEvent(c.id)}
                              aria-pressed={active}
                              style={
                                active
                                  ? {
                                      borderColor: checkBg,
                                      backgroundColor: '#FFFFFF',
                                      color: activeColor,
                                    }
                                  : {
                                      borderColor: `${skin.goldHex}59`,
                                      backgroundColor: 'rgba(255,255,255,0.82)',
                                      color: '#4B3B39',
                                    }
                              }
                              className="flex items-center gap-1.5 rounded-lg border px-2 py-1.5 text-left text-[10.5px] font-medium transition-colors cursor-pointer"
                            >
                              <span
                                style={
                                  active
                                    ? {
                                        borderColor: checkBg,
                                        backgroundColor: checkBg,
                                        color: skin.isDark ? '#1A110B' : '#FFFFFF',
                                      }
                                    : {
                                        borderColor: '#896B6F',
                                        backgroundColor: '#FFFFFF',
                                      }
                                }
                                className="grid size-3.5 shrink-0 place-items-center rounded-xs border"
                              >
                                {active && <Check className="h-2.5 w-2.5" />}
                              </span>
                              <span className="truncate">{c.title[stageLang]}</span>
                            </button>
                          );
                        })}
                      </div>
                      {rsvpErrors.events && (
                        <p
                          role="alert"
                          className={`mt-1 flex items-center gap-1 text-[10.5px] ${
                            skin.isDark ? 'text-[#FCA5A5]' : 'text-[#DC2626]'
                          }`}
                        >
                          <AlertCircle className="h-3 w-3 shrink-0" />
                          <span>{rsvpErrors.events}</span>
                        </p>
                      )}
                    </div>

                    {/* Outstation Travel / Pickup Note */}
                    <input
                      type="text"
                      value={rsvpArrival}
                      onChange={(e) => setRsvpArrival(e.target.value)}
                      maxLength={120}
                      aria-label={stageLang === 'en' ? 'Travel or stay detail' : 'आगमन / ठहराव विवरण'}
                      placeholder={
                        stageLang === 'en'
                          ? 'Arrival train/flight or hotel stay needed? (Optional)'
                          : 'ट्रेन/फ़्लाइट आगमन या होटल आवश्यकता? (वैकल्पिक)'
                      }
                      className="w-full rounded-lg border border-[#C2933F]/45 bg-white px-3 py-1.5 text-[11px] text-[#2B1B17] placeholder:text-[#896B6F] focus:border-[#B3261E] focus:outline-none"
                    />
                  </>
                )}

                {/* Optional Blessing / Note */}
                <input
                  type="text"
                  value={rsvpNote}
                  onChange={(e) => setRsvpNote(e.target.value)}
                  maxLength={240}
                  aria-label={stageLang === 'en' ? 'Blessing or note' : 'शुभकामना संदेश'}
                  placeholder={
                    rsvpStatus === 'declined'
                      ? stageLang === 'en'
                        ? 'Send your Ashirwad / blessings to the couple...'
                        : 'वर-वधू को अपना सस्नेह आशीर्वाद लिखें...'
                      : isBirthday
                        ? stageLang === 'en'
                          ? 'Write a birthday wish or dietary note...'
                          : 'जन्मदिन की शुभकामना लिखें (वैकल्पिक)...'
                        : stageLang === 'en'
                          ? 'Optional blessing or family note...'
                          : 'शुभकामना या विशेष संदेश (वैकल्पिक)...'
                  }
                  className="w-full rounded-lg border border-[#C2933F]/45 bg-white px-3 py-1.5 text-[11px] text-[#2B1B17] placeholder:text-[#896B6F] focus:border-[#B3261E] focus:outline-none"
                />

                {rsvpSubmitError && (
                  <p role="alert" className="text-[10.5px] text-[#DC2626] flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    <span>{rsvpSubmitError}</span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={rsvpSubmitting}
                  style={{
                    backgroundColor: skin.isDark ? skin.goldHex : skin.accentHex,
                    color: skin.isDark ? '#1A110B' : '#FFFFFF',
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2.5 text-[12px] font-semibold shadow-md hover:opacity-92 active:scale-[0.98] disabled:opacity-60 transition-all cursor-pointer"
                >
                  <Heart className="h-3.5 w-3.5 fill-current" />
                  <span>
                    {rsvpSubmitting
                      ? stageLang === 'en'
                        ? 'Saving RSVP...'
                        : 'सेव हो रहा है...'
                      : rsvpStatus === 'declined'
                        ? stageLang === 'en'
                          ? 'Send Blessings'
                          : 'शुभकामनाएँ भेजें'
                        : stageLang === 'en'
                          ? 'Confirm RSVP'
                          : 'RSVP की पुष्टि करें'}
                  </span>
                </button>
              </form>
            )}
          </section>
          )}

          {/* 10. EDITORIAL SIGN-OFF FOOTER */}
          <footer className="jharokha-reveal pt-2 pb-4 text-center">
            {isBirthday ? (
              <div className="flex flex-col items-center gap-1">
                {activeBirthdayName && (
                  <p
                    style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                    className={
                      stageLang === 'hi'
                        ? 'font-tiro text-[22px] font-semibold leading-tight'
                        : `${skin.scriptClass} text-[28px] leading-tight`
                    }
                  >
                    {activeBirthdayName}
                  </p>
                )}
                {activeBirthdayMilestone && (
                  <p
                    style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                    className={
                      stageLang === 'hi'
                        ? 'font-tiro text-[12px] font-medium'
                        : 'text-[10.5px] font-semibold uppercase tracking-[0.18em]'
                    }
                  >
                    {activeBirthdayMilestone}
                  </p>
                )}
              </div>
            ) : (
              (stageLang === 'hi' ? groomHi || brideHi : cleanGroom || cleanBride) && (
                <p
                  style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                  className={
                    stageLang === 'hi'
                      ? 'font-tiro text-[22px] font-semibold'
                      : `${skin.scriptClass} text-[26px]`
                  }
                >
                  {stageLang === 'hi'
                    ? [groomHi, brideHi].filter(Boolean).join(' एवं ')
                    : [cleanGroom, cleanBride].filter(Boolean).join(' & ')}
                </p>
              )
            )}
            {cityDisplay && (
              <p
                style={{ color: skin.mutedInkHex }}
                className="mt-1 text-[10px] uppercase tracking-[0.18em]"
              >
                {isHinduBirthday
                  ? stageLang === 'en'
                    ? `Puja, Aarti & Family Blessings · ${cityDisplay}`
                    : `${cityDisplay} में शुभ जन्मोत्सव एवं आशीर्वाद`
                  : isBabyBirthday
                    ? stageLang === 'en'
                      ? `Shower Your Blessings in ${cityDisplay}`
                      : `${cityDisplay} में प्रथम जन्मोत्सव आशीर्वाद`
                    : isBirthday
                      ? stageLang === 'en'
                        ? `Let’s Celebrate in ${cityDisplay}`
                        : `${cityDisplay} में जन्मदिन उत्सव`
                      : stageLang === 'en'
                        ? `See you in ${cityDisplay}`
                        : `${cityDisplay} में आपकी प्रतीक्षा है`}
              </p>
            )}
          </footer>
        </div>
      </div>

      {/* ==================== AUTO-HIDING FLOATING CONTROLS (EN/HI, REPLAY, CUSTOMIZE, FULL) ==================== */}
      {bodyOpen && (
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-3 z-30 flex justify-center transition-all duration-300 ${
            hideFloatingBar ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
          }`}
        >
          <div className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-[#C2933F]/50 bg-[#1B120E]/88 px-2 py-1 text-[10.5px] font-medium text-[#FAF0DE] shadow-xl backdrop-blur-md">
            <button
              type="button"
              onClick={handleReplay}
              title="Replay opening effect"
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 hover:bg-white/10 text-[#F5D68A] cursor-pointer whitespace-nowrap"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{stageLang === 'en' ? 'Replay' : 'दोबारा'}</span>
            </button>
            {cardLangMode === 'both' && (
              <>
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                <button
                  type="button"
                  onClick={() => setStageLang((l) => (l === 'en' ? 'hi' : 'en'))}
                  className="rounded-full px-2.5 py-1 hover:bg-white/10 cursor-pointer whitespace-nowrap"
                >
                  {stageLang === 'en' ? 'हिन्दी' : 'EN'}
                </button>
              </>
            )}
            {onOpenCustomizer && (
              <>
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                <button
                  type="button"
                  onClick={onOpenCustomizer}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 hover:bg-white/10 text-[#FDE68A] cursor-pointer whitespace-nowrap"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>Edit</span>
                </button>
              </>
            )}
            {onOpenFullPreview && (
              <>
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                <button
                  type="button"
                  onClick={onOpenFullPreview}
                  className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 hover:bg-white/10 cursor-pointer whitespace-nowrap"
                >
                  <Maximize2 className="h-3 w-3" />
                  <span>Full</span>
                </button>
              </>
            )}
            {onCloseInline && (
              <>
                <span className="h-3 w-px bg-white/20" aria-hidden="true" />
                <button
                  type="button"
                  onClick={onCloseInline}
                  aria-label="Close card preview"
                  className="rounded-full p-1 hover:bg-white/10 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* ==================== STAGE 1: AUTHENTIC THEME-SPECIFIC OPENING MECHANISMS ==================== */}

      {/* 1. JHAROKHA: REAL 3D CARVED HAVELI DOUBLE GATE SWING + BRASS KUNDI + COURTYARD WALK-IN */}
      {theme.id === 'jharokha' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#160C08] transition-opacity duration-700 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <RoyalGate3DOpening
            closedImageSrc={HAVELI_DOORS_IMAGE}
            closedImageAlt="Carved Rajasthani haveli double doors"
            openImageSrc={HERO_COURTYARD_IMAGE}
            openImageAlt="Diya-lit Mewar palace courtyard at dusk"
            isOpened={isOpened}
            brassHex="#E5B966"
            frameTintHex="#140A07"
          />

          {/* Subtle Top Architectural Scrim for crisp gold calligraphy over sandstone arch */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[21] h-[38%]"
            style={{
              background:
                'linear-gradient(to bottom, rgba(16, 8, 5, 0.56) 0%, rgba(16, 8, 5, 0.22) 55%, transparent 100%)',
            }}
          />

          {/* Door Overlay Greeting & Hint */}
          <div
            className={`absolute inset-0 z-[22] flex flex-col justify-between transition-opacity duration-400 ${
              isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'
            } ${compact ? 'px-4 pt-9 pb-14' : 'px-6 pt-7 pb-10'}`}
          >
            <div className="flex items-center justify-end gap-1.5">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSoundEnabled((s) => !s);
                }}
                aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
                className="grid size-8 place-items-center rounded-full bg-black/45 text-[#F5D68A] backdrop-blur-sm hover:bg-black/65 cursor-pointer"
              >
                {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              </button>
              {onCloseInline && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCloseInline();
                  }}
                  aria-label="Close card preview"
                  className="grid size-8 place-items-center rounded-full bg-black/45 text-white backdrop-blur-sm hover:bg-black/65 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="mb-auto mt-1 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F5D68A] drop-shadow">
                {stageLang === 'en' ? 'You are invited' : 'सादर आमंत्रण'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-1 px-2 max-w-full break-words font-pinyon foil-gold-text leading-[1.06] drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] ${
                    compact ? 'text-[clamp(26px,8vw,36px)]' : 'text-[clamp(30px,9vw,42px)]'
                  }`}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-1 font-tiro font-semibold foil-gold-text leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] ${
                    compact ? 'text-[26px]' : 'text-[32px]'
                  }`}
                >
                  {groomHi} एवं {brideHi}
                </h3>
              )}
              <p className="mt-1 text-[10.5px] tracking-[0.14em] uppercase text-[#EFDEBF]/90 drop-shadow">
                {stageLang === 'en' ? 'Shubh Vivah · Udaipur' : 'शुभ विवाह · उदयपुर'}
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerOpenGate(e);
                }}
                className="rounded-lg border border-[#E6B86A]/70 ring-1 ring-inset ring-[#E6B86A]/25 bg-[#19110D]/88 px-5 py-2 text-[11.5px] font-medium tracking-[0.08em] text-[#FAF0DE] shadow-xl backdrop-blur-md hover:bg-[#B3261E] transition-colors cursor-pointer"
              >
                {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1B. GENDA & JHOOLA: 2-STEP OPENING — FIRST MARIGOLD GARLANDS PART ASIDE, THEN CARVED WOODEN DOUBLE GATE SWINGS OPEN */}
      {theme.id === 'mehndi-jhoola' && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#F9EAC6] transition-opacity duration-700 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Image-Aspect-Locked Stage (768x1376) so doorway & garland coordinates match 1:1 on all screens */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              height: '100%',
              aspectRatio: '768 / 1376',
              minWidth: '100%',
            }}
          >
            {/* 1. 100% STATIC HAVELI ARCHITECTURE SURROUND (Walls, Pillars, Balcony, Blue Window, Peacocks & Stone Steps never move) */}
            <img
              src={GENDA_CURTAIN_CLOSED_IMAGE}
              alt="Carved sandstone Jaipur haveli arch with marigold curtains"
              referrerPolicy="no-referrer"
              className="absolute inset-0 z-[5] h-full w-full block select-none"
            />

            {/* 2. DOORWAY OPENING CAVITY (left: 29.8% -> right: 71.0%, top: 47.6% -> bottom: 84.8%) */}
            <div
              className="absolute z-[10] overflow-hidden"
              style={{
                left: '29.8%',
                top: '47.6%',
                width: '41.2%',
                height: '37.2%',
                perspective: '1300px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Layer A: Clean Sunlit Haldi Courtyard & Wooden Jhoola Inside Open Gate (zero hanging top garland) */}
              <img
                src={GENDA_COURTYARD_OPEN_IMAGE}
                alt="Sunlit Jaipur haldi courtyard with wooden marigold jhoola revealed behind open gate"
                referrerPolicy="no-referrer"
                className="absolute max-w-none select-none"
                style={{
                  width: '326.80%',
                  height: '371.89%',
                  left: '-114.05%',
                  top: '-204.05%',
                }}
              />

              {/* Subtle warm inner doorway shadow */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse at 50% 52%, rgba(255, 244, 204, 0.12) 0%, rgba(44, 24, 10, 0.30) 100%)',
                }}
              />

              {/* Layer B (STEP 2 — 640ms delay): Pure Carved Wooden Double Gate Behind the Marigold Garlands (zero top garland) */}
              {/* Left Wooden Gate Leaf (0% -> 50% of doorway width) */}
              <div
                className="absolute inset-y-0 left-0 z-[12] w-1/2 overflow-hidden"
                style={{
                  transformOrigin: 'left center',
                  transitionProperty: 'transform',
                  transitionDuration: '1050ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: isOpened ? '640ms' : '0ms',
                  transform: isOpened ? 'rotateY(88deg)' : 'rotateY(0deg)',
                }}
              >
                <img
                  src={HAVELI_DOORS_IMAGE}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute max-w-none select-none"
                  style={{
                    width: '481.93%',
                    height: '211.19%',
                    left: '-142.17%',
                    top: '-76.56%',
                  }}
                />
                <div
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{
                    transitionDelay: isOpened ? '640ms' : '0ms',
                    background:
                      'linear-gradient(to right, rgba(24, 12, 6, 0.55) 0%, transparent 55%, rgba(229, 185, 102, 0.3) 100%)',
                    opacity: isOpened ? 0.9 : 0,
                  }}
                />
              </div>

              {/* Right Wooden Gate Leaf (50% -> 100% of doorway width) */}
              <div
                className="absolute inset-y-0 right-0 z-[12] w-1/2 overflow-hidden"
                style={{
                  transformOrigin: 'right center',
                  transitionProperty: 'transform',
                  transitionDuration: '1050ms',
                  transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
                  transitionDelay: isOpened ? '640ms' : '0ms',
                  transform: isOpened ? 'rotateY(-88deg)' : 'rotateY(0deg)',
                }}
              >
                <img
                  src={HAVELI_DOORS_IMAGE}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute max-w-none select-none"
                  style={{
                    width: '481.93%',
                    height: '211.19%',
                    left: '-242.17%',
                    top: '-76.56%',
                  }}
                />
                <div
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{
                    transitionDelay: isOpened ? '640ms' : '0ms',
                    background:
                      'linear-gradient(to left, rgba(24, 12, 6, 0.55) 0%, transparent 55%, rgba(229, 185, 102, 0.3) 100%)',
                    opacity: isOpened ? 0.9 : 0,
                  }}
                />
              </div>

              {/* Layer C (STEP 1 — 0ms -> 760ms): FULL MARIGOLD GARLAND CURTAINS (INCLUDING TOP LOOP & MANGO LEAVES) SLIDING COMPLETELY ASIDE */}
              {/* Left Marigold Curtain Half (slides completely off to the left pillar) */}
              <div
                className="absolute inset-y-0 left-0 z-[16] w-1/2 overflow-hidden"
                style={{
                  transformOrigin: 'left top',
                  transition: isOpened
                    ? 'transform 760ms cubic-bezier(0.22, 1, 0.36, 1) 0ms'
                    : 'transform 400ms ease',
                  transform: isOpened ? 'translateX(-102%) scaleX(0.35)' : 'translateX(0%) scaleX(1)',
                }}
              >
                <img
                  src={GENDA_CURTAIN_CLOSED_IMAGE}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute max-w-none select-none"
                  style={{
                    width: '485.44%',
                    height: '268.82%',
                    left: '-144.66%',
                    top: '-127.96%',
                  }}
                />
              </div>

              {/* Right Marigold Curtain Half (slides completely off to the right pillar) */}
              <div
                className="absolute inset-y-0 right-0 z-[16] w-1/2 overflow-hidden"
                style={{
                  transformOrigin: 'right top',
                  transition: isOpened
                    ? 'transform 760ms cubic-bezier(0.22, 1, 0.36, 1) 0ms'
                    : 'transform 400ms ease',
                  transform: isOpened ? 'translateX(102%) scaleX(0.35)' : 'translateX(0%) scaleX(1)',
                }}
              >
                <img
                  src={GENDA_CURTAIN_CLOSED_IMAGE}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute max-w-none select-none"
                  style={{
                    width: '485.44%',
                    height: '268.82%',
                    left: '-244.66%',
                    top: '-127.96%',
                  }}
                />
              </div>
            </div>

            {/* Seamless Closed Cover Before Tap */}
            <img
              src={GENDA_CURTAIN_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className={`pointer-events-none absolute inset-0 z-[20] h-full w-full block select-none transition-opacity duration-150 ${
                isOpened ? 'opacity-0' : 'opacity-100'
              }`}
            />
          </div>

          {/* Top Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle chime"
              className="grid size-8 place-items-center rounded-full bg-[#24361F]/70 text-[#FCEBB6] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full bg-[#24361F]/70 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Soft Turmeric Header Wash for Crisp Readability Over Marigolds */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[21] h-[34%] bg-gradient-to-b from-[#F9EAC6]/92 via-[#F9EAC6]/55 to-transparent"
          />

          {/* Sunlit Header Sky Greeting + Tap-to-Part Hint */}
          <div
            className={`absolute inset-0 z-[22] flex flex-col items-center justify-between text-center transition-opacity duration-500 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#3F7D3A]">
                {stageLang === 'en' ? 'Haldi & Mehndi Swing' : 'हल्दी एवं मेहंदी झूला'}
              </p>
              <h3 className={`mt-1 font-pinyon text-[#24361F] leading-none ${compact ? 'text-[36px]' : 'text-4xl'}`}>
                {stageLang === 'en' ? `${cleanGroom} & ${cleanBride}` : `${groomHi} एवं ${brideHi}`}
              </h3>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="rounded-lg border border-[#F29F05]/85 ring-1 ring-inset ring-[#FCEBB6]/25 bg-[#24361F]/92 px-5 py-2 text-[11.5px] font-medium tracking-[0.05em] text-[#FCEBB6] shadow-xl backdrop-blur-md hover:bg-[#3F7D3A] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 5. SHEESH MAHAL: CLEAN TOUCH-THE-DIYA COVER (NO TOP CORNER ORNAMENTS OR TINY SHAPES) */}
      {theme.id === 'sheesh-mahal' && (
        <div
          className={`absolute inset-0 z-20 overflow-hidden bg-[#120A18] transition-opacity duration-700 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {/* Base Unlit Moonlit Sheesh Mahal Dome (Zero Fire Initially) */}
          <img
            src={SHEESH_MAHAL_UNLIT_DOME_IMAGE}
            alt={theme.imageAlt}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-[1200ms] ease-out"
            style={{
              opacity: isOpened ? 0.15 : 0.84,
              filter: 'brightness(0.76) contrast(1.04)',
              transform: isOpened ? 'scale(1.03)' : 'scale(1)',
            }}
          />

          {theme.coverVideoUrl && (
            <video
              ref={videoCoverRef}
              src={theme.coverVideoUrl}
              poster={SHEESH_MAHAL_UNLIT_DOME_IMAGE}
              muted
              playsInline
              preload="auto"
              onEnded={() => {
                setSheeshVideoFinished(true);
                const revealTimer = window.setTimeout(() => setBodyOpen(true), 1350);
                openTimerRef.current.push(revealTimer);
              }}
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300"
              style={{ opacity: isOpened && !sheeshVideoFinished ? 1 : 0 }}
            />
          )}

          {/* Static illuminated palace image holds after the cover video finishes. */}
          <img
            src={SHEESH_MAHAL_PLUM_DOME_IMAGE}
            alt={theme.imageAlt}
            referrerPolicy="no-referrer"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-all duration-[1100ms] ease-out"
            style={{
              opacity: sheeshVideoFinished ? 0.98 : 0,
              filter: 'brightness(1.14) contrast(1.05)',
              transform: isOpened ? 'scale(1.03)' : 'scale(1)',
            }}
          />

          {/* Atmospheric Vignette: Cool Moonlight Before Tap -> Warm Candlelight Radial Glow After Tap */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-all duration-[1100ms]"
            style={{
              background: sheeshVideoFinished
                ? 'radial-gradient(circle at 50% 48%, rgba(243, 184, 96, 0.36) 0%, rgba(18, 10, 24, 0.52) 75%)'
                : isOpened
                  ? 'linear-gradient(to bottom, rgba(14, 10, 22, 0.18) 0%, rgba(18, 12, 28, 0.04) 48%, rgba(14, 10, 22, 0.18) 100%)'
                  : 'linear-gradient(to bottom, rgba(14, 10, 22, 0.68) 0%, rgba(18, 12, 28, 0.24) 48%, rgba(14, 10, 22, 0.78) 100%)',
            }}
          />

          {/* Top Sound & Close Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle sound"
              className="grid size-8 place-items-center rounded-full border border-[#E2BC72]/40 bg-[#120A18]/70 text-[#F5D68A] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close preview"
                className="grid size-8 place-items-center rounded-full border border-[#E2BC72]/40 bg-[#120A18]/70 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Center-Top Editorial Couple Title & Bottom Interactive Brass Diya */}
          <div
            className={`relative z-20 flex h-full flex-col items-center justify-between text-center ${
              compact ? 'px-5 pt-14 pb-12' : 'px-6 pt-14 pb-12'
            } transition-opacity duration-500 ${isOpened ? 'pointer-events-none opacity-0' : 'opacity-100'}`}
          >
            <div>
              <p className="font-tiro text-[11.5px] tracking-[0.14em] text-[#F5D68A] drop-shadow">
                ॥ श्री गणेशाय नमः ॥
              </p>
              <p className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#E2BC72]">
                {stageLang === 'en' ? 'Sheesh Mahal · Royal Invitation' : 'शीश महल · शाही निमंत्रण'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-1.5 font-corinthia foil-gold-text drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] leading-none ${
                    compact ? 'text-[44px]' : 'text-[52px]'
                  }`}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-2 font-tiro font-semibold foil-gold-text drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] ${
                    compact ? 'text-[28px]' : 'text-[34px]'
                  }`}
                >
                  {groomHi} एवं {brideHi}
                </h3>
              )}
              <p className="mt-1 text-[10.5px] uppercase tracking-[0.2em] text-[#F3EADB]/90 drop-shadow">
                {dateCityLine}
              </p>
            </div>

            {/* Interactive Brass Diya: Completely Unlit Initially -> Ignites on User Tap */}
            <div className="flex flex-col items-center pb-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerOpenGate(e);
                }}
                aria-label={
                  stageLang === 'en'
                    ? 'Touch the diya to light the Sheesh Mahal'
                    : 'शीश महल को आलोकित करने के लिए दीपक छुएँ'
                }
                className="group relative grid place-items-center rounded-full p-2 transition-transform duration-500 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none"
              >
                {!isOpened && (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-3 rounded-full border border-[#E2BC72]/40 animate-ping"
                  />
                )}
                <svg
                  viewBox="0 0 120 120"
                  aria-hidden="true"
                  className={`h-24 w-24 overflow-visible transition-all duration-700 ${
                    isOpened
                      ? 'drop-shadow-[0_8px_28px_rgba(243,184,96,0.75)]'
                      : 'drop-shadow-[0_6px_12px_rgba(0,0,0,0.7)]'
                  }`}
                >
                  <defs>
                    <radialGradient id="sheeshDiyaHalo" cx="50%" cy="38%" r="52%">
                      <stop offset="0%" stopColor="#fff4cf" stopOpacity="0.95" />
                      <stop offset="35%" stopColor="#f3b860" stopOpacity="0.58" />
                      <stop offset="70%" stopColor="#c97a40" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#c97a40" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="sheeshFlameOuter" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#d96b27" />
                      <stop offset="48%" stopColor="#f3b860" />
                      <stop offset="92%" stopColor="#fff4cf" />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                    <linearGradient id="sheeshBrassBody" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#d9ba86" />
                      <stop offset="28%" stopColor="#b08542" />
                      <stop offset="62%" stopColor="#754f1e" />
                      <stop offset="88%" stopColor="#9d7130" />
                      <stop offset="100%" stopColor="#4a2f0e" />
                    </linearGradient>
                    <linearGradient id="sheeshBrassRim" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#694518" />
                      <stop offset="35%" stopColor="#d7ba84" />
                      <stop offset="55%" stopColor="#efe0b8" />
                      <stop offset="80%" stopColor="#a37735" />
                      <stop offset="100%" stopColor="#5c3a12" />
                    </linearGradient>
                    <radialGradient id="sheeshOilPoolLit" cx="50%" cy="45%" r="55%">
                      <stop offset="0%" stopColor="#f3b860" stopOpacity="0.92" />
                      <stop offset="55%" stopColor="#8a4419" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#3c1908" />
                    </radialGradient>
                    <radialGradient id="sheeshOilPoolUnlit" cx="50%" cy="45%" r="55%">
                      <stop offset="0%" stopColor="#4c2b12" stopOpacity="0.95" />
                      <stop offset="65%" stopColor="#2c1608" stopOpacity="0.98" />
                      <stop offset="100%" stopColor="#180b04" />
                    </radialGradient>
                  </defs>

                  {/* Warm Ambient Halo (Hidden while unlit, blooms on tap) */}
                  <circle
                    cx="60"
                    cy="42"
                    r={isOpened ? 56 : 16}
                    fill="url(#sheeshDiyaHalo)"
                    style={{ opacity: isOpened ? 1 : 0 }}
                    className="transition-all duration-700"
                  />

                  {/* Rising Golden Sparks (Only after diya is lit) */}
                  {isOpened && (
                    <g className="animate-pulse">
                      <circle cx="55" cy="14" r="1.3" fill="#fff4cf" opacity="0.88" />
                      <circle cx="65" cy="10" r="1" fill="#f3b860" opacity="0.75" />
                      <circle cx="60" cy="6" r="0.9" fill="#fff4cf" opacity="0.65" />
                    </g>
                  )}

                  {/* 3-Layer Flickering Flame (Scales & Ignites ONLY when isOpened === true) */}
                  <g
                    style={{
                      opacity: isOpened ? 1 : 0,
                      transform: isOpened ? 'scale(1)' : 'scale(0.1)',
                      transition: 'opacity 360ms ease-out, transform 520ms cubic-bezier(0.22, 1, 0.36, 1)',
                      transformOrigin: '60px 56px',
                      animation: isOpened ? 'diyaFlicker 2.2s ease-in-out infinite alternate' : 'none',
                    }}
                  >
                    <path
                      d="M 60 15 C 51 28, 47 41, 52 51 C 55 56, 65 56, 68 51 C 73 41, 69 28, 60 15 Z"
                      fill="url(#sheeshFlameOuter)"
                    />
                    <path
                      d="M 60 23 C 54 33, 52 42, 55 49 C 57 53, 63 53, 65 49 C 68 42, 66 33, 60 23 Z"
                      fill="#ffe9ad"
                      opacity="0.92"
                    />
                    <path
                      d="M 60 32 C 57 38, 56 44, 58 49 C 59 51, 61 51, 62 49 C 64 44, 63 38, 60 32 Z"
                      fill="#ffffff"
                    />
                  </g>

                  {/* Cotton Wick (Dry Cream Cotton Before Tap -> Lit Glowing Wick After Tap) */}
                  <path
                    d="M 60 51 L 60 61"
                    stroke={isOpened ? '#3a1c0d' : '#cbbba0'}
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  {!isOpened && (
                    <circle cx="60" cy="51" r="1.4" fill="#ebe0cd" opacity="0.95" />
                  )}
                  {isOpened && <circle cx="60" cy="52" r="2.2" fill="#ff9838" />}

                  {/* Brass Diya Bowl & Oil Pool */}
                  <ellipse
                    cx="60"
                    cy="64"
                    rx="32"
                    ry="9.5"
                    fill={isOpened ? 'url(#sheeshOilPoolLit)' : 'url(#sheeshOilPoolUnlit)'}
                    stroke="url(#sheeshBrassRim)"
                    strokeWidth="2.2"
                  />
                  <ellipse
                    cx="60"
                    cy="62.5"
                    rx="14"
                    ry="4"
                    fill={isOpened ? '#ffd98e' : '#8c6947'}
                    opacity={isOpened ? 0.48 : 0.14}
                    className="transition-opacity duration-500"
                  />

                  {/* Carved Brass Body & Pedestal */}
                  <path
                    d="M 28 64 C 30 82, 44 90, 60 90 C 76 90, 90 82, 92 64 C 82 71, 38 71, 28 64 Z"
                    fill="url(#sheeshBrassBody)"
                    stroke="#5c3b12"
                    strokeWidth="0.9"
                  />
                  <path
                    d="M 35 72 Q 60 80 85 72"
                    fill="none"
                    stroke="#f7dfa8"
                    strokeWidth="0.9"
                    strokeDasharray="2 2.5"
                    opacity={isOpened ? 0.8 : 0.55}
                  />
                  <path
                    d="M 51 89 L 46 98 L 74 98 L 69 89 Z"
                    fill="url(#sheeshBrassBody)"
                  />
                  <ellipse
                    cx="60"
                    cy="99"
                    rx="18"
                    ry="3.8"
                    fill="url(#sheeshBrassRim)"
                    stroke="#5c3b12"
                    strokeWidth="0.8"
                  />
                </svg>
              </button>

              <div
                aria-hidden="true"
                className={`-mt-2 h-1.5 w-44 rounded-full bg-gradient-to-r from-transparent to-transparent transition-all duration-700 ${
                  isOpened
                    ? 'via-[#b48d5c]/85 shadow-[0_2px_14px_rgba(243,184,96,0.55)]'
                    : 'via-[#7d6876]/45 shadow-none'
                }`}
              />

              <div className="absolute left-1/2 top-[66%] flex -translate-x-1/2 flex-col items-center text-center">
                <p className="font-bodoni italic text-[19px] text-[#f6f2f7] drop-shadow-[0_0_12px_rgba(23,12,29,0.95)]">
                  {stageLang === 'en' ? 'Tap the diya to light the palace' : 'महल रोशन करने के लिए दीपक छुएँ'}
                </p>
                <span className="mt-0.5 text-[10px] uppercase tracking-[0.24em] text-[#e2b8a4]">
                  {stageLang === 'en'
                    ? 'Watch the mirrors awaken'
                    : 'दर्पणों को जगमगाते देखें'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. DEEPOTSAV: 5-WICK KUTHUVILAKKU LAMP -> TIER-BY-TIER GHAT RADIANCE & FLOATING DIYAS */}
      {theme.id === 'deepotsav' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#0B1120] transition-opacity duration-700 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <img
            src={theme.image}
            alt={theme.imageAlt}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover transition-all duration-[1600ms] ease-out"
            style={{
              opacity: isOpened ? 0.94 : 0.3,
              filter: isOpened ? 'brightness(1.1)' : 'brightness(0.55)',
            }}
          />

          {/* Ascending Tier-by-Tier Saffron Radiance on Ghat Steps */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-all duration-[1400ms]"
            style={{
              opacity: isOpened ? 0.9 : 0.15,
              background:
                'linear-gradient(to top, rgba(232, 137, 28, 0.55) 0%, rgba(244, 180, 26, 0.25) 45%, rgba(11, 17, 32, 0.72) 100%)',
            }}
          />

          {isOpened &&
            [18, 34, 50, 66, 82].map((leftPct, i) => (
              <div
                key={leftPct}
                style={{
                  left: `${leftPct}%`,
                  bottom: '18%',
                  animationDelay: `${i * 0.22}s`,
                }}
                className="pointer-events-none absolute -translate-x-1/2 animate-float-diya"
              >
                <DiyaFlame />
              </div>
            ))}

          <div
            className={`relative z-10 flex h-full flex-col items-center justify-between text-center transition-opacity duration-500 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-10 pb-14'
            } ${isOpened ? 'opacity-90' : 'opacity-100'}`}
          >
            <div>
              <p className="font-tiro text-[11px] tracking-[0.2em] text-[#F4B41A]">
                ॥ शुभ दीपोत्सव परिणय ॥
              </p>
              <h3 className="mt-1 font-pinyon text-4xl foil-gold-text drop-shadow">
                {cleanGroom} &amp; {cleanBride}
              </h3>
            </div>

            {!isOpened && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerOpenGate(e);
                }}
                className="animate-hint-float rounded-lg border border-[#FDE68A]/70 bg-[#E8891C] px-5 py-2 text-[11.5px] font-semibold tracking-[0.04em] text-[#11182F] shadow-lg hover:bg-[#f59c30] transition-colors cursor-pointer"
              >
                {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
              </button>
            )}

            <span className="text-[10.5px] uppercase tracking-[0.16em] text-[#F4B41A]/85">
              {cityDisplay}
            </span>
          </div>
        </div>
      )}

      {/* 7. ROSHNI: LANTERN IGNITION GLOW & 3D IVORY JAALI LATTICE DOORS SWING ONTO CRIMSON MANDAP */}
      {theme.id === 'roshni' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#260A10] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <RoyalGate3DOpening
            closedImageSrc={ROSHNI_JAALI_CLOSED_IMAGE}
            closedImageAlt="Carved ivory jaali lattice double doors"
            openImageSrc={ROSHNI_MANDAP_OPEN_IMAGE}
            openImageAlt="Crimson silk mandap draped in jasmine and white roses revealed behind open ivory jaali doors"
            isOpened={isOpened}
            brassHex="#D8AD56"
            frameTintHex="#260A10"
            imageAspectRatio="768 / 1376"
            doorBounds={{ leftPct: 20.4, centerPct: 50.0, rightPct: 79.6, topPct: 29.8, bottomPct: 89.2 }}
          />

          {/* Top Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle chime"
              className="grid size-8 place-items-center rounded-full bg-[#260A10]/70 text-[#F5D68A] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full bg-[#260A10]/70 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Greeting + Tap-to-Light Brass Lantern Trigger */}
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-500 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F5D68A] drop-shadow">
                {stageLang === 'en' ? 'Chiraag Mandap · Ivory Jaali' : 'चिराग़ मंडप · शाही निमंत्रण'}
              </p>
              <h3 className="mt-1 font-pinyon text-4xl foil-gold-text drop-shadow">
                {stageLang === 'en' ? `${cleanGroom} & ${cleanBride}` : `${groomHi} एवं ${brideHi}`}
              </h3>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#C99A42]/80 ring-1 ring-inset ring-[#C99A42]/25 bg-[#260A10]/90 px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FAF3E8] shadow-xl backdrop-blur-md hover:bg-[#3a121a] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 8. KOVIL TEMPLE: NILAVILAKKU LAMP SPARK, BELL RESONANCE & ROSEWOOD SANCTUM SWING */}
      {theme.id === 'temple' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#1E120A] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <RoyalGate3DOpening
            closedImageSrc={TEMPLE_GOPURAM_CLOSED_IMAGE}
            closedImageAlt="Carved rosewood temple sanctum double doors"
            openImageSrc={TEMPLE_SANCTUM_OPEN_IMAGE}
            openImageAlt="Carved temple mandapam illuminated with brass oil lamps and swaying bells"
            isOpened={isOpened}
            brassHex="#E2A83B"
            frameTintHex="#1E120A"
            imageAspectRatio="768 / 1376"
            doorBounds={{ leftPct: 29.8, centerPct: 50.0, rightPct: 70.2, topPct: 22.5, bottomPct: 80.2 }}
          />

          {/* Top Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle temple bell chime"
              className="grid size-8 place-items-center rounded-full bg-[#1E120A]/75 text-[#F5D68A] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full bg-[#1E120A]/75 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-500 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div>
              <p className="font-tiro text-[11px] tracking-[0.2em] text-[#F5D68A] drop-shadow">
                ॥ शुभ विवाह मुहूर्तम् ॥
              </p>
              <h3 className="mt-1 font-script text-4xl foil-gold-text drop-shadow">
                {stageLang === 'en' ? `${cleanGroom} & ${cleanBride}` : `${groomHi} एवं ${brideHi}`}
              </h3>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#C88A2B]/85 ring-1 ring-inset ring-[#F5D68A]/25 bg-[#1E120A]/90 px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF8EC] shadow-xl backdrop-blur-md hover:bg-[#A62417] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 12. NANHE KADAM (INDIAN BABY 1ST BIRTHDAY): MAULI THREAD UNTIE, SWAYING GHUNGROO BELLS & 3D SANKHEDA NURSERY DOORS */}
      {theme.id === 'nanhe-kadam' && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`perspective-1600 absolute inset-0 z-20 overflow-hidden bg-[#FFF7EC] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <RoyalGate3DOpening
            closedImageSrc={INDIAN_BABY_PALNA_CLOSED_IMAGE}
            closedImageAlt="Carved Sankheda wooden nursery double doors"
            openImageSrc={INDIAN_BABY_COURTYARD_OPEN_IMAGE}
            openImageAlt="Sunlit Indian haveli courtyard dressed with carved wooden palna cradle and marigold garlands"
            isOpened={isOpened}
            brassHex="#F2A900"
            frameTintHex="#2D1A12"
            showMauliRibbon={true}
            mauliColorFrom="#C4452B"
            mauliColorTo="#F2A900"
            imageAspectRatio="768 / 1376"
            doorBounds={{ leftPct: 14.5, centerPct: 50.0, rightPct: 86.0, topPct: 20.0, bottomPct: 98.5 }}
          />



          {/* Top Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle birthday melody"
              className="grid size-8 place-items-center rounded-full border border-[#D98A1A]/35 bg-[#FFF7EC]/90 text-[#2D1A12] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#D98A1A]/35 bg-[#FFF7EC]/90 text-[#2D1A12] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FFF7EC]/90 px-4 py-2 shadow-sm backdrop-blur-[2px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C4452B]">
                {stageLang === 'en' ? '॥ Bal Janmotsav · 1st Birthday ॥' : '॥ नन्हे कदम · प्रथम जन्मोत्सव ॥'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-corinthia',
                nameClass: 'text-[#2D1A12]',
                milestoneClass: 'text-[#C4452B]',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F2A900] ring-1 ring-inset ring-[#FFF3CF]/25 bg-[#C4452B] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF7EC] shadow-xl hover:bg-[#a23620] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 13. CHANDA MAMA (INDIAN LULLABY 1ST BIRTHDAY): GOLDEN MOON TASSEL PULL & STARRY PICHWAI CURTAINS */}
      {theme.id === 'chanda-mama' && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#101935] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Open Layer: Dreamy Twilight Courtyard with Fairy Lights, Moon Lanterns & Rocking Horse */}
          <img
            src={CHANDA_MAMA_COURTYARD_OPEN_IMAGE}
            alt="Twilight Indian palace veranda lit with golden fairy lights, paper moon lanterns and painted wooden rocking horse"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[2100ms] ease-out"
            style={{ transform: isOpened ? 'scale(1)' : 'scale(1.06)' }}
          />

          {/* Sliding Left & Right Pichwai Starry Night Tapestry Curtains */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-all duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isOpened ? 'translateX(-106%)' : 'translateX(0)',
              opacity: isOpened ? 0.1 : 1,
            }}
          >
            <img
              src={CHANDA_MAMA_NIGHT_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1024]/75 via-transparent to-[#0A1024]/80" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-all duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isOpened ? 'translateX(106%)' : 'translateX(0)',
              opacity: isOpened ? 0.1 : 1,
            }}
          >
            <img
              src={CHANDA_MAMA_NIGHT_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none -translate-x-1/2 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0A1024]/75 via-transparent to-[#0A1024]/80" />
          </div>

          {!isOpened && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[12] overflow-hidden"
            >
              <img
                src={CHANDA_MAMA_NIGHT_CLOSED_IMAGE}
                alt=""
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#0A1024]/75 via-transparent to-[#0A1024]/80" />
            </div>
          )}

          {/* Top Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle lullaby chime"
              className="grid size-8 place-items-center rounded-full bg-[#101935]/80 text-[#F2CB78] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full bg-[#101935]/80 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F2CB78] drop-shadow">
                {stageLang === 'en' ? 'Chandrani Raat · 1st Birthday' : 'चाँदनी रात · प्रथम जन्मोत्सव'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-script',
                nameClass: 'foil-gold-text drop-shadow',
                milestoneClass: 'text-[#F2CB78] drop-shadow',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F2CB78]/85 ring-1 ring-inset ring-[#F2CB78]/25 bg-[#101935]/92 px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#F6EEDF] shadow-xl backdrop-blur-md hover:bg-[#F2CB78] hover:text-[#101935] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 14. BAAL GOPAL (HINDU JANMOTSAV): GOLDEN BANSURI FLUTE UNLATCH, MOR PANKH & 3D PEACOCK-TEAL DOORS */}
      {theme.id === 'baal-gopal' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`perspective-1600 absolute inset-0 z-20 overflow-hidden bg-[#0C3B38] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <RoyalGate3DOpening
            closedImageSrc={BAAL_GOPAL_CLOSED_IMAGE}
            closedImageAlt="Carved peacock-teal haveli double doors"
            openImageSrc={BAAL_GOPAL_OPEN_IMAGE}
            openImageAlt="Sunlit Hindu haveli courtyard swing adorned with marigold garlands, brass urli and makhan-mishri"
            isOpened={isOpened}
            brassHex="#F7C96B"
            frameTintHex="#072926"
            imageAspectRatio="768 / 1376"
            doorBounds={{ leftPct: 17.2, centerPct: 50.2, rightPct: 82.8, topPct: 25.0, bottomPct: 89.8 }}
          />



          {/* Top Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle bansuri chime"
              className="grid size-8 place-items-center rounded-full border border-[#C9932B]/40 bg-[#072926]/80 text-[#F7C96B] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#C9932B]/40 bg-[#072926]/80 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#072926]/78 px-4 py-2 backdrop-blur-[2px] border border-[#C9932B]/35">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#F7C96B]">
                {stageLang === 'en' ? '॥ Murlidhar Leela · Janmotsav ॥' : '॥ मुरलीधर लीला · शुभ जन्मोत्सव ॥'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-corinthia',
                nameClass: 'foil-gold-text',
                milestoneClass: 'text-[#F7C96B]',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F7C96B] ring-1 ring-inset ring-[#F7C96B]/25 bg-[#0C3B38]/92 px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FAF0DE] shadow-xl backdrop-blur-md hover:bg-[#0F6B60] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 15. SHUBH AARTI (HINDU PUJA & KALASH): FIVE IGNITING PANCH-AARTI DIYAS & CRIMSON SILK CURTAIN */}
      {theme.id === 'shubh-aarti' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#28050A] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Open Layer: Illuminated Hindu Home Mandir with Panch-Aarti, Kalash & Prasad */}
          <img
            src={SHUBH_AARTI_OPEN_IMAGE}
            alt="Warmly illuminated Hindu mandir veranda with brass Panch-Aarti, copper kalash, temple bells and saffron birthday cake"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[2100ms] ease-out"
            style={{ transform: isOpened ? 'scale(1)' : 'scale(1.06)' }}
          />

          {/* Amber Panch-Aarti Radiance Bloom */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: isOpened ? 0.55 : 0,
              background: 'radial-gradient(circle at 50% 54%, rgba(255,214,120,0.9), rgba(244,163,36,0.35) 45%, transparent 72%)',
            }}
          />

          {/* Sliding Left & Right Crimson Purna Kalash Velvet Silk Curtains */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-all duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isOpened ? 'translateX(-106%)' : 'translateX(0)',
              opacity: isOpened ? 0.12 : 1,
            }}
          >
            <img
              src={SHUBH_AARTI_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#28050A]/75 via-transparent to-[#28050A]/80" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-all duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isOpened ? 'translateX(106%)' : 'translateX(0)',
              opacity: isOpened ? 0.12 : 1,
            }}
          >
            <img
              src={SHUBH_AARTI_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none -translate-x-1/2 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#28050A]/75 via-transparent to-[#28050A]/80" />
          </div>

          {!isOpened && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[12] overflow-hidden"
            >
              <img
                src={SHUBH_AARTI_CLOSED_IMAGE}
                alt=""
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#28050A]/75 via-transparent to-[#28050A]/80" />
            </div>
          )}

          {/* Top Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle aarti chime"
              className="grid size-8 place-items-center rounded-full border border-[#F7C96B]/35 bg-[#28050A]/80 text-[#F7C96B] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#F7C96B]/35 bg-[#28050A]/80 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div>
              <p className="font-tiro text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#F7C96B] drop-shadow">
                {stageLang === 'en' ? '॥ Ayushman Bhava · Kalash Pravesh ॥' : '॥ आयुष्मान् भव · कलश प्रवेश ॥'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-pinyon',
                nameClass: 'foil-gold-text drop-shadow',
                milestoneClass: 'text-[#F7C96B] drop-shadow',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F7C96B] ring-1 ring-inset ring-[#F7C96B]/25 bg-[#3E0B12]/92 px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FBF0D9] shadow-xl backdrop-blur-md hover:bg-[#F4A324] hover:text-[#28050A] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 16. RANGOLI UTSAV (MARIGOLD & ROSE MANDALA): CONCENTRIC SPIN-BLOOM & PETAL SHOWER */}
      {theme.id === 'rangoli-utsav' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#FFF8EB] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Open Layer: Courtyards Brass Urli, Mango Leaf Toran & Motichoor Laddoo Feast */}
          <img
            src={RANGOLI_UTSAV_OPEN_IMAGE}
            alt="Sunlit Indian home courtyard decorated with floating lotus brass urli, mango-leaf toran and motichoor laddoo thali"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[2100ms] ease-out"
            style={{ transform: isOpened ? 'scale(1)' : 'scale(1.06)' }}
          />

          {/* Overhead Marigold & Rose-Petal Circular Rangoli Mandala Cover (Spins & Blooms Outward) */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 overflow-hidden ${
              isOpened ? 'animate-rangoli-spin' : ''
            }`}
          >
            <img
              src={RANGOLI_UTSAV_CLOSED_IMAGE}
              alt="Intricate circular marigold, rose petal and rice-flour Hindu rangoli mandala surrounded by brass diyas"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#331A10]/62 via-transparent to-[#331A10]/55" />
          </div>

          {/* Top Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle festive chime"
              className="grid size-8 place-items-center rounded-full border border-[#C98A1A]/35 bg-[#FFF8EB]/90 text-[#331A10] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#C98A1A]/35 bg-[#FFF8EB]/90 text-[#331A10] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FFF8EB]/90 px-4 py-2 shadow-sm backdrop-blur-[2px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D95D14]">
                {stageLang === 'en' ? '॥ Shubh Janmotsav · Alpana Utsav ॥' : '॥ शुभ जन्मोत्सव · अल्पना उत्सव ॥'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-script',
                nameClass: 'text-[#331A10]',
                milestoneClass: 'text-[#D95D14]',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F2A900] ring-1 ring-inset ring-[#FFF3CF]/25 bg-[#D95D14] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF8EB] shadow-xl hover:bg-[#b54a0d] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 17. LADLI KANYA (GIRL HINDU BIRTHDAY): PAYAL MAULI UNTIE, SWAYING GHUNGROOS & 3D ROSE GOTA-PATTI DOORS */}
      {theme.id === 'ladli-kanya' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`perspective-1600 absolute inset-0 z-20 overflow-hidden bg-[#5C122D] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <RoyalGate3DOpening
            closedImageSrc={LADLI_KANYA_CLOSED_IMAGE}
            closedImageAlt="Carved rose gota-patti palace double doors"
            openImageSrc={LADLI_KANYA_OPEN_IMAGE}
            openImageAlt="Palace courtyard lotus and marigold jhula swing with brass diya"
            isOpened={isOpened}
            brassHex="#F4B844"
            frameTintHex="#3A1121"
            showMauliRibbon={true}
            mauliColorFrom="#B82952"
            mauliColorTo="#F4B844"
            imageAspectRatio="768 / 1376"
            doorBounds={{ leftPct: 24.8, centerPct: 50.0, rightPct: 75.2, topPct: 26.0, bottomPct: 91.2 }}
          />



          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle payal santoor chime"
              className="grid size-8 place-items-center rounded-full border border-[#C99A3B]/40 bg-[#FDF0F2]/90 text-[#3A1121] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#C99A3B]/40 bg-[#FDF0F2]/90 text-[#3A1121] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FDF0F2]/90 px-4 py-2 shadow-sm backdrop-blur-[2px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B82952]">
                {stageLang === 'en' ? '॥ Nandini Jhula · Janmotsav ॥' : '॥ नंदिनी झूला · शुभ जन्मोत्सव ॥'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-corinthia',
                nameClass: 'text-[#3A1121]',
                milestoneClass: 'text-[#B82952]',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F4B844] ring-1 ring-inset ring-white/25 bg-[#B82952] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF8FA] shadow-xl hover:bg-[#961f41] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 18. DEVI KUMKUM (GIRL HINDU BIRTHDAY): FALLBACK WHEN NO VIDEO COVER */}
      {theme.id === 'devi-kumkum' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#2B0713] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <img
            src={DEVI_KUMKUM_OPEN_IMAGE}
            alt="Evening Hindu mandapam glowing with hanging brass lamps, copper kalash, panch-aarti and kesar kheer"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[2100ms] ease-out"
            style={{ transform: isOpened ? 'scale(1)' : 'scale(1.06)' }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 transition-opacity duration-700"
            style={{
              opacity: isOpened ? 0.5 : 0,
              background: 'radial-gradient(circle at 50% 50%, rgba(244,184,68,0.85), rgba(184,41,82,0.3) 50%, transparent 75%)',
            }}
          />

          {/* Sliding Left & Right Deep Rani-Sindoor Banarasi Silk Curtains */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-all duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isOpened ? 'translateX(-106%)' : 'translateX(0)',
              opacity: isOpened ? 0.12 : 1,
            }}
          >
            <img
              src={DEVI_KUMKUM_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2B0713]/72 via-transparent to-[#2B0713]/78" />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-all duration-[1250ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isOpened ? 'translateX(106%)' : 'translateX(0)',
              opacity: isOpened ? 0.12 : 1,
            }}
          >
            <img
              src={DEVI_KUMKUM_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none -translate-x-1/2 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2B0713]/72 via-transparent to-[#2B0713]/78" />
          </div>

          {!isOpened && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[12] overflow-hidden"
            >
              <img
                src={DEVI_KUMKUM_CLOSED_IMAGE}
                alt=""
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#2B0713]/72 via-transparent to-[#2B0713]/78" />
            </div>
          )}

          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle temple chime"
              className="grid size-8 place-items-center rounded-full border border-[#F4B844]/35 bg-[#2B0713]/80 text-[#F4B844] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#F4B844]/35 bg-[#2B0713]/80 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div>
              <p className="font-tiro text-[10.5px] font-semibold uppercase tracking-[0.2em] text-[#F4B844] drop-shadow">
                {stageLang === 'en' ? '॥ Kumkum Kanya · Janmotsav ॥' : '॥ कुमकुम कन्या · शुभ जन्मोत्सव ॥'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-pinyon',
                nameClass: 'foil-gold-text drop-shadow',
                milestoneClass: 'text-[#F4B844] drop-shadow',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F4B844] ring-1 ring-inset ring-[#F4B844]/25 bg-[#460D21]/92 px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FBF0DC] shadow-xl backdrop-blur-md hover:bg-[#F4B844] hover:text-[#460D21] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 19. GULAB BAISA (GIRL HINDU BIRTHDAY): PARTING ROSE & PEARL LATKANS + 3D ROSE PETALS */}
      {theme.id === 'gulab-baisa' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#FFF2EE] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <img
            src={GULAB_BAISA_OPEN_IMAGE}
            alt="Jaipur pink sandstone terrace birthday setup with rose petal brass urli and pistachio rose cake"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[2100ms] ease-out"
            style={{ transform: isOpened ? 'scale(1)' : 'scale(1.06)' }}
          />

          {/* Left & Right Parting Rose-Pearl Garland Screens */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 overflow-hidden transition-all duration-[1350ms] ease-out"
            style={{
              transform: isOpened ? 'translateX(-105%) scaleX(0.4)' : 'translateX(0) scaleX(1)',
              opacity: isOpened ? 0.12 : 1,
            }}
          >
            <img
              src={GULAB_BAISA_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none object-cover object-center"
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 overflow-hidden transition-all duration-[1350ms] ease-out"
            style={{
              transform: isOpened ? 'translateX(105%) scaleX(0.4)' : 'translateX(0) scaleX(1)',
              opacity: isOpened ? 0.12 : 1,
            }}
          >
            <img
              src={GULAB_BAISA_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none -translate-x-1/2 object-cover object-center"
            />
          </div>

          {!isOpened && (
            <img
              src={GULAB_BAISA_CLOSED_IMAGE}
              alt=""
              aria-hidden="true"
              referrerPolicy="no-referrer"
              className="pointer-events-none absolute inset-0 z-[12] h-full w-full object-cover object-center"
            />
          )}

          {/* Fluttering 3D Damask Rose Petals */}
          {isOpened &&
            [12, 26, 40, 56, 72, 86].map((leftPct, i) => (
              <span
                key={leftPct}
                aria-hidden="true"
                style={{ left: `${leftPct}%`, top: '12%', animationDelay: `${i * 0.13}s` }}
                className="pointer-events-none absolute z-25 h-3 w-4 rounded-tl-full rounded-br-full bg-gradient-to-br from-[#F9A8D4] to-[#C7385B] shadow-sm animate-rose-drift"
              />
            ))}

          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle santoor melody"
              className="grid size-8 place-items-center rounded-full border border-[#B88635]/35 bg-[#FFF2EE]/90 text-[#3B1822] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#B88635]/35 bg-[#FFF2EE]/90 text-[#3B1822] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FFF2EE]/90 px-4 py-2 shadow-sm backdrop-blur-[2px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C7385B]">
                {stageLang === 'en' ? '॥ Gulabi Garh · Jaipur Utsav ॥' : '॥ गुलाबी गढ़ · जयपुर जन्मोत्सव ॥'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-script',
                nameClass: 'text-[#3B1822]',
                milestoneClass: 'text-[#C7385B]',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#B88635] ring-1 ring-inset ring-white/25 bg-[#C7385B] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF8F6] shadow-xl hover:bg-[#a62a49] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 21. VEER BALAK (BOY HINDU BIRTHDAY): PULSING SURYA SEAL, KALAWA UNTIE & 3D KESARI DOORS */}
      {theme.id === 'veer-balak' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`perspective-1600 absolute inset-0 z-20 overflow-hidden bg-[#4A1B08] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <RoyalGate3DOpening
            closedImageSrc={VEER_BALAK_CLOSED_IMAGE}
            closedImageAlt="Carved Mewar Kesari haveli double doors"
            openImageSrc={VEER_BALAK_OPEN_IMAGE}
            openImageAlt="Sunlit Rajasthani veranda dressed with bandhani cushions, dholak drum, tilak tray and laddoos"
            isOpened={isOpened}
            brassHex="#F2A900"
            frameTintHex="#2D160B"
            showMauliRibbon={true}
            mauliColorFrom="#B91C1C"
            mauliColorTo="#F2A900"
            imageAspectRatio="768 / 1376"
            doorBounds={{ leftPct: 19.6, centerPct: 50.2, rightPct: 80.8, topPct: 16.5, bottomPct: 86.2 }}
          />


          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle birthday chime"
              className="grid size-8 place-items-center rounded-full border border-[#C48A1E]/40 bg-[#FDF3E2]/90 text-[#2D160B] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#C48A1E]/40 bg-[#FDF3E2]/90 text-[#2D160B] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FDF3E2]/90 px-4 py-2 shadow-sm backdrop-blur-[2px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C94A14]">
                {stageLang === 'en' ? '॥ Suryavanshi Tilak · Janmotsav ॥' : '॥ सूर्यवंशी तिलक · शुभ जन्मोत्सव ॥'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-pinyon',
                nameClass: 'text-[#2D160B]',
                milestoneClass: 'text-[#C94A14]',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F2A900] ring-1 ring-inset ring-[#FDE68A]/25 bg-[#C94A14] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF9ED] shadow-xl hover:bg-[#a63a0e] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 22. GANESHA AASHISH (BOY HINDU BIRTHDAY): COPPER KALASH & MODAK MANDALA SPIN + TEMPLE BELLS */}
      {theme.id === 'ganesh-aashish' && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#FFF7E4] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <img
            src={GANESH_AASHISH_OPEN_IMAGE}
            alt="Carved stone Hindu mandir mandapam glowing with antique brass bells and traditional floor kolam"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[2100ms] ease-out"
            style={{ transform: isOpened ? 'scale(1)' : 'scale(1.06)' }}
          />

          {/* Spinning Copper Kalash & Modak Rangoli Cover */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 overflow-hidden ${
              isOpened ? 'animate-rangoli-spin' : ''
            }`}
          >
            <img
              src={GANESH_AASHISH_CLOSED_IMAGE}
              alt="Overhead marigold and kumkum rangoli mandala centered on copper Purna Kalash and golden modaks"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2D150E]/58 via-transparent to-[#2D150E]/55" />
          </div>

          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label="Toggle temple bell chime"
              className="grid size-8 place-items-center rounded-full border border-[#BD8319]/35 bg-[#FFF7E4]/90 text-[#2D150E] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#BD8319]/35 bg-[#FFF7E4]/90 text-[#2D150E] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FFF7E4]/92 px-4 py-2 shadow-sm backdrop-blur-[2px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A8321A]">
                {stageLang === 'en' ? '॥ Ganesha Aashish · Janmotsav ॥' : '॥ गणेशा आशीष · शुभ जन्मोत्सव ॥'}
              </p>
              {renderBirthdayTitle({
                as: 'h3',
                enFontClass: 'font-script',
                nameClass: 'text-[#2D150E]',
                milestoneClass: 'text-[#A8321A]',
              })}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F2A900] ring-1 ring-inset ring-[#FDE68A]/25 bg-[#A8321A] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF9ED] shadow-xl hover:bg-[#8a2814] transition-colors cursor-pointer"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 23. PAITHANI (BESPOKE MULTI-FOLD SILK ANTARPAT DROP + LIVE AKSHATA RAIN + COURTYARD GLIDE) */}
      {theme.id === 'paithani' && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#1D142B] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Open Courtyard Backdrop Revealed Behind the Falling Silk Antarpat */}
          <img
            src={PAITHANI_COURTYARD_OPEN_IMAGE}
            alt="Twilight Maharashtrian wada courtyard with carved mandap chairs, banana plants, brass samai lamps and rangoli"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-[2300ms] ease-out"
            style={{
              transform: isOpened ? 'scale(1)' : 'scale(1.1)',
              filter: isOpened ? 'brightness(1)' : 'brightness(0.74)',
            }}
          />

          {/* Outer Wada Frame Gallery (Dissolves Gently as Camera Glides Inward) */}
          <img
            src={PAITHANI_ANTARPAT_CLOSED_IMAGE}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center transition-all duration-[1500ms] ease-out"
            style={{
              opacity: isOpened ? 0 : 1,
              transform: isOpened ? 'scale(1.06)' : 'scale(1)',
            }}
          />

          {/* 3-Panel Woven Silk Antarpat Curtain With Staggered Gravity Fold & Specular Zari Sheen */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[10%] top-[44%] h-[42%] z-[16]"
            style={{ perspective: '1000px' }}
          >
            {[
              { left: '0%', width: '34%', imgLeft: '-37%', delay: '120ms', tilt: 'rotateY(5deg)' },
              { left: '33%', width: '34%', imgLeft: '-134%', delay: '0ms', tilt: 'rotateX(-38deg)' },
              { left: '66%', width: '34%', imgLeft: '-231%', delay: '95ms', tilt: 'rotateY(-5deg)' },
            ].map((panel, idx) => (
              <div
                key={idx}
                className="absolute top-0 h-full overflow-hidden shadow-[0_18px_36px_rgba(15,8,28,0.65)] transition-all duration-[1750ms]"
                style={{
                  left: panel.left,
                  width: panel.width,
                  transitionDelay: isOpened ? panel.delay : '0ms',
                  transitionTimingFunction: 'cubic-bezier(0.55, 0.04, 0.25, 1)',
                  transformOrigin: 'bottom center',
                  transform: isOpened
                    ? `translateY(145%) scaleY(0.24) ${panel.tilt}`
                    : 'translateY(0%) scaleY(1) rotateX(0deg)',
                  opacity: isOpened ? 0 : 1,
                }}
              >
                <img
                  src={PAITHANI_ANTARPAT_CLOSED_IMAGE}
                  alt=""
                  referrerPolicy="no-referrer"
                  className="absolute max-w-none object-cover object-center"
                  style={{
                    left: panel.imgLeft,
                    top: '-104%',
                    width: '368%',
                    height: '238%',
                  }}
                />
                {/* Moving Zari Silk Specular Highlight During Cloth Drop */}
                <div
                  className="pointer-events-none absolute inset-0 transition-opacity duration-700"
                  style={{
                    opacity: isOpened ? 0.55 : 0.08,
                    background:
                      'linear-gradient(125deg, transparent 20%, rgba(255, 240, 195, 0.45) 50%, transparent 80%)',
                  }}
                />
              </div>
            ))}
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[18] bg-gradient-to-b from-[#130C20]/68 via-transparent to-[#130C20]/58"
          />

          {/* Sound & Optional Inline Close Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
              className="grid size-8 place-items-center rounded-full border border-[#C9932A]/45 bg-[#1D142B]/75 text-[#F5D68A] backdrop-blur-sm hover:bg-[#1D142B]/90 cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#C9932A]/45 bg-[#1D142B]/75 text-white backdrop-blur-sm hover:bg-[#1D142B]/90 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Closed Antarpat Cover Title & Tap-to-Drop CTA */}
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-500 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#F5D68A] drop-shadow">
                {stageLang === 'en' ? '॥ Shubh Mangal Savdhaan ॥' : '॥ शुभमंगल सावधान ॥'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-1 font-pinyon foil-gold-text leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
                    compact ? 'text-[36px]' : 'text-[44px]'
                  }`}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-1 font-tiro font-semibold foil-gold-text leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
                    compact ? 'text-[26px]' : 'text-[32px]'
                  }`}
                >
                  {groomHi} आणि {brideHi}
                </h3>
              )}
              <p className="mt-1 text-[10px] tracking-[0.16em] uppercase text-[#F7E9CE]/90 drop-shadow">
                {stageLang === 'en' ? 'Antarpat Mangalam · Maharashtrian Wada' : 'अंतरपाट मंगलम · पारंपरिक लग्नपत्रिका'}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F5D68A]/80 ring-1 ring-inset ring-[#F5D68A]/25 bg-[#5A1668]/92 px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF8EC] shadow-xl backdrop-blur-sm hover:bg-[#461052] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 24. KOHINOOR: ANTIQUE GOLD WAX-CREST UNSEAL + SINDOORI VELVET SPLIT FOLIO REVEAL */}
      {theme.id === 'kohinoor' && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#21050B] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Revealed Candlelit Udaipur Palace Darbar Backdrop */}
          <img
            src={KOHINOOR_OPEN_IMAGE}
            alt="Opulent twilight courtyard of a Mewar heritage palace illuminated by brass diyas and chandeliers"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-[2000ms] ease-out"
            style={{
              transform: isOpened ? 'scale(1)' : 'scale(1.1)',
              filter: isOpened ? 'brightness(1)' : 'brightness(0.75)',
            }}
          />

          {/* Top Split Silk Folio Half */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-1/2 overflow-hidden shadow-[0_14px_30px_rgba(12,2,5,0.65)] transition-transform duration-[1450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: isOpened ? 'translate3d(0, -108%, 0)' : 'translate3d(0, 0, 0)' }}
          >
            <img
              src={KOHINOOR_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-[200%] w-full max-w-none object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A0308]/68 via-transparent to-[#2A060E]/35" />
            <div className="absolute inset-x-4 bottom-0 h-px bg-gradient-to-r from-transparent via-[#E5B966] to-transparent" />
          </div>

          {/* Bottom Split Silk Folio Half */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 overflow-hidden shadow-[0_-14px_30px_rgba(12,2,5,0.65)] transition-transform duration-[1450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: isOpened ? 'translate3d(0, 108%, 0)' : 'translate3d(0, 0, 0)' }}
          >
            <img
              src={KOHINOOR_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-[200%] w-full max-w-none -translate-y-1/2 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1A0308]/78 via-transparent to-[#2A060E]/35" />
            <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-[#E5B966] to-transparent" />
          </div>

          {!isOpened && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[12] overflow-hidden"
            >
              <img
                src={KOHINOOR_CLOSED_IMAGE}
                alt=""
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A0308]/68 via-transparent to-[#1A0308]/78" />
            </div>
          )}

          {/* Sound & Close Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
              className="grid size-8 place-items-center rounded-full border border-[#E5B966]/45 bg-[#26060D]/80 text-[#F5D68A] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#E5B966]/45 bg-[#26060D]/80 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Closed Cover Copy + Clean Tap-to-Open Button */}
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-450 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#F5D68A] drop-shadow">
                {stageLang === 'en' ? 'Royal Wedding Suite · Sindoori Shagun' : 'शाही परिणय निमंत्रण · सिंदूरी शगुन'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-1 font-pinyon foil-gold-text leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
                    compact ? 'text-[36px]' : 'text-[44px]'
                  }`}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-1 font-tiro font-semibold foil-gold-text leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
                    compact ? 'text-[26px]' : 'text-[32px]'
                  }`}
                >
                  {groomHi} एवं {brideHi}
                </h3>
              )}
              <p className="mt-1 text-[10px] tracking-[0.16em] uppercase text-[#FAF0DD]/90 drop-shadow">
                {stageLang === 'en' ? 'Mewar Darbar · Udaipur' : 'मेवाड़ दरबार · उदयपुर'}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#E5B966]/85 ring-1 ring-inset ring-[#FDE68A]/25 bg-[#3B0A14]/92 px-5 py-2 text-[11.5px] font-medium tracking-[0.06em] text-[#FAF0DD] shadow-xl backdrop-blur-sm hover:bg-[#52101D] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 25. VRINDAVAN: PARTING INDIGO PICHWAI VELVET CURTAIN + GOLDEN SANCTUM HALO */}
      {theme.id === 'vrindavan' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#081229] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Open Temple Urli Courtyard Revealed Behind Velvet Wings */}
          <img
            src={VRINDAVAN_OPEN_IMAGE}
            alt="Sunlit carved sandstone Vrindavan courtyard with blooming lotuses in brass urli"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-[2000ms] ease-out"
            style={{
              transform: isOpened ? 'scale(1)' : 'scale(1.09)',
              filter: isOpened ? 'brightness(1)' : 'brightness(0.75)',
            }}
          />

          {/* Golden Sanctum Radial Light Sweep on Open */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[13] transition-opacity duration-[1100ms]"
            style={{
              opacity: bodyOpen ? 0 : isOpened ? 0.85 : 0.12,
              background:
                'radial-gradient(circle at 50% 48%, rgba(255, 232, 168, 0.85) 0%, rgba(230, 188, 99, 0.32) 40%, transparent 72%)',
            }}
          />

          {/* Left Velvet Wing */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 z-[15] overflow-hidden shadow-[10px_0_28px_rgba(6,12,32,0.68)] transition-transform duration-[1450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: isOpened ? 'translate3d(-108%, 0, 0)' : 'translate3d(0, 0, 0)' }}
          >
            <img
              src={VRINDAVAN_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#081229]/72 via-transparent to-[#081229]/76" />
            <div className="absolute inset-y-4 right-0 w-px bg-gradient-to-b from-transparent via-[#E6BC63] to-transparent" />
          </div>

          {/* Right Velvet Wing */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 z-[15] overflow-hidden shadow-[-10px_0_28px_rgba(6,12,32,0.68)] transition-transform duration-[1450ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: isOpened ? 'translate3d(108%, 0, 0)' : 'translate3d(0, 0, 0)' }}
          >
            <img
              src={VRINDAVAN_CLOSED_IMAGE}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-[200%] max-w-none -translate-x-1/2 object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#081229]/72 via-transparent to-[#081229]/76" />
            <div className="absolute inset-y-4 left-0 w-px bg-gradient-to-b from-transparent via-[#E6BC63] to-transparent" />
          </div>

          {!isOpened && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-[18] overflow-hidden"
            >
              <img
                src={VRINDAVAN_CLOSED_IMAGE}
                alt=""
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#081229]/72 via-transparent to-[#081229]/76" />
            </div>
          )}

          {/* Sound & Close Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
              className="grid size-8 place-items-center rounded-full border border-[#E6BC63]/45 bg-[#0E1C3D]/82 text-[#F5D68A] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#E6BC63]/45 bg-[#0E1C3D]/82 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Cover Copy + Clean Tap-to-Open Button */}
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-450 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#081229]/75 px-4 py-2 backdrop-blur-[2px] border border-[#E6BC63]/35">
              <p className="text-[9.5px] font-semibold uppercase tracking-[0.2em] text-[#F4D58D]">
                {stageLang === 'en' ? '॥ Shri Krishnah Sharanam Mama ॥' : '॥ श्री कृष्णः शरणं मम ॥'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-1 font-corinthia foil-gold-text leading-none drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
                    compact ? 'text-[40px]' : 'text-[48px]'
                  }`}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-1 font-tiro font-semibold foil-gold-text leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.65)] ${
                    compact ? 'text-[26px]' : 'text-[32px]'
                  }`}
                >
                  {groomHi} एवं {brideHi}
                </h3>
              )}
              <p className="mt-0.5 text-[10px] tracking-[0.16em] uppercase text-[#FAF5EA]/90">
                {stageLang === 'en' ? 'Braj Madhurima · Sacred Union' : 'ब्रज मधुरिमा · पावन परिणय'}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#E6BC63]/85 ring-1 ring-inset ring-[#FDE68A]/25 bg-[#0E1C3D]/94 px-5 py-2 text-[11.5px] font-medium tracking-[0.06em] text-[#FAF5EA] shadow-xl backdrop-blur-sm hover:bg-[#192F63] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 26. KESARIYA: DIAGONAL BANDHANI LEHERIYA VEIL UNFURL + MARIGOLD SUNSET TERRACE */}
      {theme.id === 'kesariya' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#FFF3E0] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Open Jaipur Palace Sunset Terrace Backdrop */}
          <img
            src={KESARIYA_OPEN_IMAGE}
            alt="Golden hour Jaipur pink-sandstone palace terrace dressed with saffron canopies and marigold garlands"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[2100ms] ease-out"
            style={{ transform: isOpened ? 'scale(1)' : 'scale(1.08)' }}
          />

          {/* Bandhani & Gotta-Patti Veil Sliding Up-Right on Reveal */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[15] overflow-hidden shadow-[0_18px_40px_rgba(46,20,11,0.5)] transition-all duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isOpened
                ? 'translate3d(106%, -18%, 0) rotate(6deg) scale(1.04)'
                : 'translate3d(0, 0, 0) rotate(0deg) scale(1)',
              opacity: isOpened ? 0.15 : 1,
            }}
          >
            <img
              src={KESARIYA_CLOSED_IMAGE}
              alt="Vibrant Rajasthani saffron and crimson bandhani tie-dye invitation cover framed in gotta-patti"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2E140B]/58 via-transparent to-[#2E140B]/62" />
            <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#FDE68A] via-[#E08B15] to-[#FDE68A]" />
          </div>

          {/* Sound & Close Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
              className="grid size-8 place-items-center rounded-full border border-[#E08B15]/45 bg-[#FFF3E0]/92 text-[#2E140B] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#E08B15]/45 bg-[#FFF3E0]/92 text-[#2E140B] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Cover Copy + Clean Tap-to-Open Button */}
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FFF3E0]/92 px-4 py-2 shadow-sm backdrop-blur-[2px] border border-[#E08B15]/45">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C83E1B]">
                {stageLang === 'en' ? '॥ Padharo Saa · Jaipur ॥' : '॥ पधारो सा · जयपुर उत्सव ॥'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-0.5 font-pinyon text-[#2E140B] leading-none ${
                    compact ? 'text-[36px]' : 'text-[44px]'
                  }`}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-0.5 font-tiro font-semibold text-[#2E140B] leading-tight ${
                    compact ? 'text-[26px]' : 'text-[32px]'
                  }`}
                >
                  {groomHi} एवं {brideHi}
                </h3>
              )}
              <p className="mt-0.5 text-[10px] tracking-[0.14em] uppercase text-[#6D3E2B]">
                {stageLang === 'en' ? 'Bandhani Saanjh · Marwari Wedding' : 'बांधनी साँझ · मारवाड़ी परिणय'}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#FDE68A]/85 ring-1 ring-inset ring-[#FDE68A]/25 bg-[#C83E1B] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF8EE] shadow-xl hover:bg-[#a63114] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 27. PATTU ZARI: KANJEEVARAM SILK PALLU DRAPE LIFT + TEMPLE MANDAPAM REVEAL */}
      {theme.id === 'pattu-zari' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#FAF4E6] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Open South Indian Temple Mandapam & Kolam Courtyard */}
          <img
            src={PATTU_MANDAP_OPEN_IMAGE}
            alt="Sunlit South Indian stone temple mandapam with banana leaves, brass lamps and crisp white kolam"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[2100ms] ease-out"
            style={{ transform: isOpened ? 'scale(1)' : 'scale(1.07)' }}
          />

          {/* Ascending Ivory Kanjeevaram Zari Pallu Drape */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[15] overflow-hidden shadow-[0_20px_42px_rgba(22,56,44,0.45)] transition-all duration-[1550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isOpened ? 'translate3d(0, -108%, 0) scaleY(0.88)' : 'translate3d(0, 0, 0) scaleY(1)',
            }}
          >
            <img
              src={PATTU_ZARI_CLOSED_IMAGE}
              alt="Ivory Kanjeevaram pure silk saree drape with antique gold temple zari border and jasmine malli garland"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#16382C]/48 via-transparent to-[#16382C]/58" />
            <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-[#8E6518] via-[#F7DA87] to-[#8E6518]" />
          </div>

          {/* Sound & Close Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
              className="grid size-8 place-items-center rounded-full border border-[#C9962B]/45 bg-[#FAF4E6]/92 text-[#16382C] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#C9962B]/45 bg-[#FAF4E6]/92 text-[#16382C] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Cover Copy + Clean Tap-to-Open Button */}
          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-400 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FAF4E6]/92 px-4 py-2 shadow-sm backdrop-blur-[2px] border border-[#C9962B]/45">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1C4D3B]">
                {stageLang === 'en' ? '॥ Shubha Muhurtham ॥' : '॥ शुभ विवाह मुहूर्त ॥'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-0.5 font-italiana font-semibold text-[#16382C] leading-tight ${
                    compact ? 'text-[27px]' : 'text-[34px]'
                  }`}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-0.5 font-tiro font-semibold text-[#16382C] leading-tight ${
                    compact ? 'text-[25px]' : 'text-[31px]'
                  }`}
                >
                  {groomHi} एवं {brideHi}
                </h3>
              )}
              <p className="mt-0.5 text-[10px] tracking-[0.14em] uppercase text-[#4A6358]">
                {stageLang === 'en' ? 'Kanchi Kalyanam · Temple Mandapam' : 'कांची कल्याणम · मंदिर मंडपम'}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#F5D68A]/85 ring-1 ring-inset ring-[#F5D68A]/25 bg-[#1C4D3B] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FAF4E6] shadow-xl hover:bg-[#14392b] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 28. MEHR: 2.5D CARVED GOLD MUGHAL JAALI ARCH ZOOM + SWAYING PEARL-MOGRA TASSELS + CHARBAGH REVEAL */}
      {theme.id === 'mehr' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#FAF6EE] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          <RoyalGate3DOpening
            closedImageSrc={MEHR_CLOSED_IMAGE}
            closedImageAlt="Luxury ivory and champagne-gold carved Mughal jaali double doors"
            openImageSrc={MEHR_OPEN_IMAGE}
            openImageAlt="Serene golden-hour white marble Charbagh palace courtyard with Moroccan lanterns and water reflection"
            isOpened={isOpened}
            brassHex="#C69C4E"
            frameTintHex="#1E2D24"
            imageAspectRatio="768 / 1376"
            doorBounds={{ leftPct: 19.2, centerPct: 49.8, rightPct: 80.4, topPct: 26.8, bottomPct: 75.8 }}
          />

          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
              className="grid size-8 place-items-center rounded-full border border-[#C69C4E]/45 bg-[#FAF6EE]/92 text-[#1E2D24] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#C69C4E]/45 bg-[#FAF6EE]/92 text-[#1E2D24] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-450 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FAF6EE]/92 px-4 py-2 shadow-sm backdrop-blur-[2px] border border-[#C69C4E]/45">
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#1E3A2F]">
                {stageLang === 'en' ? 'Bismillah · Noor-e-Charbagh' : 'नूर-ए-चारबाग़ · स्नेह निमंत्रण'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-0.5 font-corinthia text-[#1E2D24] leading-none ${
                    compact ? 'text-[38px]' : 'text-[46px]'
                  }`}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-0.5 font-tiro font-semibold text-[#1E2D24] leading-tight ${
                    compact ? 'text-[26px]' : 'text-[32px]'
                  }`}
                >
                  {groomHi} एवं {brideHi}
                </h3>
              )}
              <p className="mt-0.5 text-[10px] tracking-[0.14em] uppercase text-[#526358]">
                {stageLang === 'en' ? 'Noor-e-Charbagh · Nikah & Walima' : 'नूर-ए-चारबाग़ · दावत-ए-वलीमा'}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#E6C77E]/85 ring-1 ring-inset ring-[#FDE68A]/25 bg-[#1E3A2F] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FAF6EE] shadow-xl hover:bg-[#152921] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 29. KALGI: JEWELLED SARPECH KALGI HALO + KESARI SILK FRAME UNVEIL + GOLDEN SAROVAR */}
      {theme.id === 'kalgi' && !theme.coverVideoUrl && (
        <div
          onClick={(e) => triggerOpenGate(e)}
          className={`absolute inset-0 z-20 overflow-hidden bg-[#FFF6E8] transition-opacity duration-800 ${
            bodyOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
          } ${!isOpened ? 'cursor-pointer' : 'pointer-events-none'}`}
        >
          {/* Open Golden Sarovar & Marble Courtyard */}
          <img
            src={KALGI_OPEN_IMAGE}
            alt="Sunlit heritage marble courtyard beside a golden sarovar pool draped with saffron marigolds"
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-[2100ms] ease-out"
            style={{
              transform: isOpened ? 'scale(1)' : 'scale(1.09)',
              filter: isOpened ? 'brightness(1)' : 'brightness(0.84)',
            }}
          />

          {/* Expanding Golden Sarovar Sunburst on Open */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[14] transition-opacity duration-[1100ms]"
            style={{
              opacity: bodyOpen ? 0 : isOpened ? 0.86 : 0.15,
              background:
                'radial-gradient(circle at 50% 48%, rgba(255, 232, 162, 0.9) 0%, rgba(214, 90, 20, 0.28) 42%, transparent 74%)',
            }}
          />

          {/* Kalgi Plume & Kesari Silk Cover Lifting & Expanding Outward */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[15] overflow-hidden transition-all duration-[1550ms] ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{
              transform: isOpened ? 'scale(1.34) translate3d(0, -14%, 0)' : 'scale(1) translate3d(0, 0, 0)',
              opacity: isOpened ? 0 : 1,
            }}
          >
            <img
              src={KALGI_CLOSED_IMAGE}
              alt="Royal ivory and kesari saffron wedding card with emerald-pearl Sarpech Kalgi motif"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover object-center animate-ken-burns-slow"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2D160B]/42 via-transparent to-[#2D160B]/58" />
          </div>

          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
              className="grid size-8 place-items-center rounded-full border border-[#C4912A]/45 bg-[#FFF6E8]/92 text-[#2D160B] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-[#C4912A]/45 bg-[#FFF6E8]/92 text-[#2D160B] backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div
            className={`absolute inset-0 z-20 flex flex-col items-center justify-between text-center transition-opacity duration-450 ${
              compact ? 'px-5 pt-14 pb-16' : 'px-6 pt-12 pb-10'
            } ${isOpened ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <div className="rounded-xl bg-[#FFF6E8]/92 px-4 py-2 shadow-sm backdrop-blur-[2px] border border-[#C4912A]/45">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D65A14]">
                {stageLang === 'en' ? '॥ Ik Onkar · Anand Karaj ॥' : '॥ एक ओंकार · आनंद कारज ॥'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-0.5 font-pinyon text-[#2D160B] leading-none ${
                    compact ? 'text-[36px]' : 'text-[44px]'
                  }`}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-0.5 font-tiro font-semibold text-[#2D160B] leading-tight ${
                    compact ? 'text-[26px]' : 'text-[32px]'
                  }`}
                >
                  {groomHi} एवं {brideHi}
                </h3>
              )}
              <p className="mt-0.5 text-[10px] tracking-[0.14em] uppercase text-[#6E452F]">
                {stageLang === 'en' ? 'Amrit Anand · Royal Saffron Suite' : 'अमृत आनंद · शाही केसरिया पत्रिका'}
              </p>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                triggerOpenGate(e);
              }}
              className="animate-hint-float rounded-lg border border-[#FDE68A]/85 ring-1 ring-inset ring-[#FDE68A]/25 bg-[#D65A14] px-5 py-2 text-[11.5px] font-medium tracking-[0.04em] text-[#FFF9F0] shadow-xl hover:bg-[#b5490e] transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {stageLang === 'en' ? 'Tap to open' : 'खोलने के लिए छुएँ'}
            </button>
          </div>
        </div>
      )}

      {/* 31–35. SEAL-ONLY INTERACTIVE VIDEO ENVELOPE COVERS (van-upvan, shahi-badami, sindoori-rajhans, rajsi-baingani, neel-chandani) */}
      {theme.coverVideoUrl && theme.sealConfig && (
        <div
          onClick={() => {
            if (isOpened) return;
            // STRICT RULE: Clicking outside the wax seal NEVER opens the card!
            setSealNudge(true);
            if (sealNudgeTimerRef.current) {
              window.clearTimeout(sealNudgeTimerRef.current);
            }
            sealNudgeTimerRef.current = window.setTimeout(() => {
              setSealNudge(false);
            }, 1300);
          }}
          className={`absolute inset-0 z-20 overflow-hidden ${
            theme.id === 'rangoli-utsav'
              ? 'transition-all duration-1000 ease-out'
              : 'transition-opacity duration-700'
          } ${
            bodyOpen
              ? theme.id === 'rangoli-utsav'
                ? 'opacity-0 scale-105 pointer-events-none'
                : 'opacity-0 pointer-events-none'
              : 'opacity-100 scale-100'
          } ${!isOpened ? 'cursor-default' : 'pointer-events-none'}`}
          style={{ backgroundColor: skin.heroBgHex }}
        >
          {/* Full-Bleed 9:16 Envelope Video Cover */}
          <video
            ref={videoCoverRef}
            src={theme.coverVideoUrl}
            poster={theme.image}
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={(e) => {
              const vid = e.currentTarget;
              if (!isOpened && theme.sealConfig) {
                try {
                  vid.currentTime = theme.sealConfig.pauseAtSec;
                  vid.pause();
                } catch {
                  // Ignore seek error before buffer
                }
              }
            }}
            onTimeUpdate={(e) => {
              const vid = e.currentTarget;
              if (!isOpened && theme.sealConfig && vid.currentTime >= theme.sealConfig.pauseAtSec) {
                vid.pause();
                vid.currentTime = theme.sealConfig.pauseAtSec;
                return;
              }
              const extractSec =
                theme.id === 'kanha-makhan'
                  ? 6.25
                  : theme.id === 'roshni' || theme.id === 'baal-gopal'
                    ? 5.35
                    : theme.id === 'mehr' || theme.id === 'temple'
                      ? 5.15
                      : theme.id === 'kalgi'
                        ? 4.95
                        : theme.id === 'shubh-aarti' || theme.id === 'vrindavan' || theme.id === 'jharokha'
                          ? 4.9
                          : theme.id === 'confetti-garden' || theme.id === 'ladli-kanya'
                            ? 4.85
                            : theme.id === 'veer-balak'
                              ? 4.8
                              : theme.id === 'devi-kumkum' || theme.id === 'kesariya'
                                ? 4.75
                                : theme.id === 'pattu-zari'
                                  ? 4.65
                                  : theme.id === 'gulab-baisa'
                                    ? 4.5
                                    : theme.id === 'gulab' || theme.id === 'jashn-birthday'
                                      ? 3.85
                                      : theme.id === 'ivory'
                                        ? 3.75
                                        : theme.id === 'deepotsav'
                                          ? 3.15
                                          : null;
              if (isOpened && extractSec !== null && vid.currentTime >= extractSec && !ivoryCardExtracted) {
                setIvoryCardExtracted(true);
              }
            }}
            onEnded={() => {
              if (isOpened) {
                if (isExtractedVideoCard) {
                  setIvoryCardExtracted(true);
                }
                setBodyOpen(true);
              }
            }}
            className={`absolute inset-0 h-full w-full object-cover ${
              theme.id === 'deepotsav' ? 'object-[10.5%_50%]' : 'object-center'
            }`}
          />

          {/* Frame-Locked Resting Envelope Poster while closed so the Wax Seal is 100% aligned before video seek */}
          {!isOpened && (
            <img
              src={theme.image}
              alt={theme.imageAlt}
              draggable={false}
              className={`pointer-events-none absolute inset-0 h-full w-full object-cover select-none ${
                theme.id === 'deepotsav' ? 'object-[10.5%_50%]' : 'object-center'
              }`}
            />
          )}

          {/* Synced Welcome Typography fading directly onto the extracted inner card before video end */}
          {isExtractedVideoCard && (
            <div
              className={`pointer-events-none absolute inset-0 z-25 transition-all duration-700 ease-out ${
                ivoryCardExtracted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1.5'
              }`}
            >
              {extractedCardWelcomeOverlay}
            </div>
          )}

          {/* Top Sound & Close Controls */}
          <div
            className={`absolute inset-x-0 top-0 z-30 flex items-center justify-end gap-1.5 px-4 ${
              compact ? 'pt-9' : 'pt-4'
            }`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSoundEnabled((s) => !s);
              }}
              aria-label={soundEnabled ? 'Mute chime' : 'Enable chime'}
              className="grid size-8 place-items-center rounded-full border border-white/30 bg-black/55 text-[#F5D68A] backdrop-blur-sm cursor-pointer"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            {onCloseInline && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseInline();
                }}
                aria-label="Close card preview"
                className="grid size-8 place-items-center rounded-full border border-white/30 bg-black/55 text-white backdrop-blur-sm cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Top Couple / Birthday Name Header Banner Adapted to Each Template Palette */}
          {(theme.id === 'jashn-birthday' ||
            theme.id === 'kanha-makhan' ||
            theme.id === 'devi-kumkum' ||
            theme.id === 'roshni' ||
            theme.id === 'shubh-aarti' ||
            theme.id === 'rangoli-utsav' ||
            theme.id === 'temple' ||
            theme.id === 'jharokha' ||
            theme.id === 'baal-gopal' ||
            theme.id === 'deepotsav') && (
            <div
              aria-hidden="true"
              className={`pointer-events-none absolute inset-x-0 top-0 z-24 ${
                theme.id === 'rangoli-utsav' ||
                theme.id === 'temple' ||
                theme.id === 'jharokha' ||
                theme.id === 'baal-gopal' ||
                theme.id === 'deepotsav'
                  ? 'h-[30%]'
                  : 'h-[35%]'
              } transition-opacity duration-350 ${
                isOpened ? 'opacity-0' : 'opacity-100'
              }`}
              style={{
                background:
                  theme.id === 'kanha-makhan'
                    ? 'radial-gradient(ellipse 74% 58% at 50% 24%, rgba(8, 19, 35, 0.88) 0%, rgba(8, 19, 35, 0.65) 52%, transparent 100%), linear-gradient(180deg, rgba(8, 19, 35, 0.86) 0%, rgba(8, 19, 35, 0.56) 48%, transparent 100%)'
                    : theme.id === 'shubh-aarti'
                      ? 'radial-gradient(ellipse 74% 58% at 50% 22%, rgba(40, 5, 10, 0.88) 0%, rgba(40, 5, 10, 0.64) 52%, transparent 100%), linear-gradient(180deg, rgba(40, 5, 10, 0.88) 0%, rgba(40, 5, 10, 0.54) 48%, transparent 100%)'
                      : theme.id === 'rangoli-utsav'
                        ? 'radial-gradient(ellipse 74% 64% at 50% 24%, rgba(44, 18, 9, 0.88) 0%, rgba(44, 18, 9, 0.62) 55%, transparent 100%), linear-gradient(180deg, rgba(44, 18, 9, 0.88) 0%, rgba(44, 18, 9, 0.54) 48%, transparent 100%)'
                        : theme.id === 'temple'
                          ? 'radial-gradient(ellipse 76% 64% at 50% 24%, rgba(16, 20, 36, 0.86) 0%, rgba(24, 16, 10, 0.6) 56%, transparent 100%), linear-gradient(180deg, rgba(16, 20, 36, 0.84) 0%, rgba(24, 16, 10, 0.48) 50%, transparent 100%)'
                          : theme.id === 'jharokha'
                            ? 'radial-gradient(ellipse 76% 64% at 50% 24%, rgba(36, 14, 12, 0.88) 0%, rgba(36, 14, 12, 0.62) 55%, transparent 100%), linear-gradient(180deg, rgba(36, 14, 12, 0.88) 0%, rgba(36, 14, 12, 0.52) 48%, transparent 100%)'
                            : theme.id === 'baal-gopal'
                              ? 'radial-gradient(ellipse 76% 64% at 50% 24%, rgba(7, 41, 38, 0.88) 0%, rgba(7, 41, 38, 0.62) 55%, transparent 100%), linear-gradient(180deg, rgba(7, 41, 38, 0.88) 0%, rgba(7, 41, 38, 0.52) 48%, transparent 100%)'
                              : theme.id === 'deepotsav'
                                ? 'radial-gradient(ellipse 76% 64% at 50% 22%, rgba(11, 17, 32, 0.82) 0%, rgba(11, 17, 32, 0.48) 55%, transparent 100%), linear-gradient(180deg, rgba(11, 17, 32, 0.82) 0%, rgba(11, 17, 32, 0.42) 48%, transparent 100%)'
                                : theme.id === 'devi-kumkum' || theme.id === 'roshni'
                                  ? 'radial-gradient(ellipse 74% 58% at 50% 22%, rgba(36, 6, 16, 0.88) 0%, rgba(36, 6, 16, 0.62) 52%, transparent 100%), linear-gradient(180deg, rgba(36, 6, 16, 0.88) 0%, rgba(36, 6, 16, 0.54) 48%, transparent 100%)'
                                  : 'radial-gradient(ellipse 72% 60% at 50% 28%, rgba(8, 5, 12, 0.88) 0%, rgba(8, 5, 12, 0.65) 52%, transparent 100%), linear-gradient(180deg, rgba(8, 5, 12, 0.86) 0%, rgba(8, 5, 12, 0.58) 48%, transparent 100%)',
              }}
            />
          )}
          {theme.id === 'vrindavan' ? (
            /* Printed directly inside the cobalt-indigo Pichwai velvet arch card on the flatlay cover */
            <div
              style={{
                left: '53.5%',
                top: '44%',
                width: '54%',
                transform: 'translate(-50%, -50%)',
              }}
              className={`pointer-events-none absolute z-25 flex flex-col items-center text-center transition-opacity duration-350 ${
                isOpened ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <p
                className={`font-tiro font-semibold text-[#FFE39E] leading-tight ${
                  compact ? 'text-[8px] tracking-[0.12em]' : 'text-[9.5px] tracking-[0.15em]'
                }`}
                style={{
                  textShadow:
                    '0 1px 4px rgba(4,10,24,0.95), 0 2px 10px rgba(4,10,24,0.88)',
                }}
              >
                {stageLang === 'en' ? '॥ Shri Krishnah Sharanam ॥' : '॥ श्री कृष्णः शरणं मम ॥'}
              </p>
              {stageLang === 'en' ? (
                <h3
                  className={`mt-1 px-1 max-w-full font-corinthia text-[#FAF5EA] leading-[0.96] ${
                    compact ? 'text-[25px]' : 'text-[31px]'
                  }`}
                  style={{
                    textShadow:
                      '0 2px 5px rgba(4,10,24,0.98), 0 0 18px rgba(230,188,99,0.52)',
                  }}
                >
                  {cleanGroom} &amp; {cleanBride}
                </h3>
              ) : (
                <h3
                  className={`mt-1 font-tiro font-semibold text-[#FAF5EA] leading-tight ${
                    compact ? 'text-[19px]' : 'text-[24px]'
                  }`}
                  style={{
                    textShadow:
                      '0 2px 5px rgba(4,10,24,0.98), 0 0 18px rgba(230,188,99,0.52)',
                  }}
                >
                  {groomHi} एवं {brideHi}
                </h3>
              )}
              <div className="mt-1.5 flex items-center justify-center gap-1.5">
                <span className="h-px w-6 bg-[#E6BC63]/85" />
                <span className="size-1 rotate-45 bg-[#FFE39E]" />
                <span className="h-px w-6 bg-[#E6BC63]/85" />
              </div>
              <p
                className={`mt-1.5 font-semibold uppercase text-[#E6D6B5] leading-tight ${
                  compact ? 'text-[7.5px] tracking-[0.14em]' : 'text-[8.5px] tracking-[0.16em]'
                }`}
                style={{
                  textShadow: '0 1px 4px rgba(4,10,24,0.95)',
                }}
              >
                {dateCityLine}
              </p>
            </div>
          ) : (
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 z-25 flex flex-col items-center text-center transition-opacity duration-350 ${
              theme.id === 'rangoli-utsav' ||
              theme.id === 'gulab-baisa' ||
              theme.id === 'veer-balak' ||
              theme.id === 'temple' ||
              theme.id === 'jharokha' ||
              theme.id === 'pattu-zari' ||
              theme.id === 'baal-gopal' ||
              theme.id === 'kesariya' ||
              theme.id === 'kalgi' ||
              theme.id === 'deepotsav' ||
              theme.id === 'jashn-birthday'
                ? compact
                  ? 'px-11 pt-12'
                  : 'px-12 pt-11'
                : compact
                  ? 'px-11 pt-10'
                  : 'px-12 pt-9'
            } ${isOpened ? 'opacity-0' : 'opacity-100'}`}
          >
            {theme.id === 'jashn-birthday' ||
            theme.id === 'kanha-makhan' ||
            theme.id === 'devi-kumkum' ||
            theme.id === 'roshni' ||
            theme.id === 'shubh-aarti' ||
            theme.id === 'rangoli-utsav' ||
            theme.id === 'temple' ||
            theme.id === 'jharokha' ||
            theme.id === 'baal-gopal' ||
            theme.id === 'deepotsav' ? (
              <div className="flex flex-col items-center max-w-full">
                <p
                  className={`font-bold uppercase text-[#FFE39E] leading-tight ${
                    compact
                      ? 'text-[8.5px] tracking-[0.13em]'
                      : 'text-[10px] tracking-[0.18em]'
                  }`}
                  style={{
                    textShadow:
                      '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
                  }}
                >
                  {theme.id === 'kanha-makhan'
                    ? stageLang === 'en'
                      ? '॥ Gokul Matki · Shubh Janmotsav ॥'
                      : '॥ गोकुल मटकी · शुभ जन्मोत्सव ॥'
                    : theme.id === 'devi-kumkum'
                      ? stageLang === 'en'
                        ? '॥ Kumkum Kanya · Shubh Janmotsav ॥'
                        : '॥ कुमकुम कन्या · शुभ जन्मोत्सव ॥'
                      : theme.id === 'roshni'
                        ? stageLang === 'en'
                          ? '॥ Chiraag Mandap · Ivory Jaali ॥'
                          : '॥ चिराग़ मंडप · शाही निमंत्रण ॥'
                        : theme.id === 'shubh-aarti'
                          ? stageLang === 'en'
                            ? '॥ Ayushman Bhava · Kalash Pravesh ॥'
                            : '॥ आयुष्मान् भव · कलश प्रवेश ॥'
                          : theme.id === 'rangoli-utsav'
                            ? stageLang === 'en'
                              ? '॥ Alpana Utsav · Shubh Janmotsav ॥'
                              : '॥ अल्पना उत्सव · शुभ जन्मोत्सव ॥'
                            : theme.id === 'temple'
                              ? stageLang === 'en'
                                ? '॥ Devasthan Kovil · Shubh Vivah ॥'
                                : '॥ देवस्थान कोविल · शुभ विवाह ॥'
                              : theme.id === 'jharokha'
                                ? stageLang === 'en'
                                  ? '॥ Padharo Mhare Des · Rajwada Aagman ॥'
                                  : '॥ पधारो म्हारे देश · राजवाड़ा आगमन ॥'
                                : theme.id === 'baal-gopal'
                                  ? stageLang === 'en'
                                    ? '॥ Murlidhar Leela · Shubh Janmotsav ॥'
                                    : '॥ मुरलीधर लीला · शुभ जन्मोत्सव ॥'
                                  : theme.id === 'deepotsav'
                                    ? stageLang === 'en'
                                      ? '॥ Ghat Deepmala · Shubh Vivah ॥'
                                      : '॥ घाट दीपमाला · शुभ विवाह ॥'
                                    : stageLang === 'en'
                                      ? 'Tap to Ignite the Candles'
                                      : 'मोमबत्तियाँ जलाने के लिए टैप करें'}
                </p>
                {theme.id === 'roshni' || theme.id === 'temple' || theme.id === 'jharokha' || theme.id === 'deepotsav' ? (
                  stageLang === 'en' ? (
                    (cleanGroom || cleanBride) && (
                      <h3
                        className={`mt-0.5 px-1 max-w-full ${
                          theme.id === 'roshni' || theme.id === 'jharokha' || theme.id === 'deepotsav'
                            ? 'font-pinyon'
                            : 'font-script'
                        } text-[#FFF8E7] leading-[0.98] ${
                          compact ? 'text-[25px]' : 'text-[32px]'
                        }`}
                        style={{
                          textShadow:
                            '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(230,184,106,0.45)',
                        }}
                      >
                        {[cleanGroom, cleanBride].filter(Boolean).join(' & ')}
                      </h3>
                    )
                  ) : (
                    (groomHi || brideHi) && (
                      <h3
                        className={`mt-0.5 font-tiro font-semibold text-[#FFF8E7] leading-tight ${
                          compact ? 'text-[22px]' : 'text-[28px]'
                        }`}
                        style={{
                          textShadow:
                            '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(230,184,106,0.45)',
                        }}
                      >
                        {[groomHi, brideHi].filter(Boolean).join(' एवं ')}
                      </h3>
                    )
                  )
                ) : (
                  renderBirthdayTitle({
                    as: 'h3',
                    enFontClass:
                      theme.id === 'devi-kumkum' || theme.id === 'shubh-aarti'
                        ? 'font-pinyon'
                        : 'font-corinthia',
                    nameClass: 'text-[#FFF8E7]',
                    nameStyle: {
                      textShadow:
                        '0 2px 4px rgba(0,0,0,1), 0 4px 16px rgba(0,0,0,0.98), 0 0 28px rgba(0,0,0,0.95), 0 0 14px rgba(230,184,106,0.45)',
                    },
                    milestoneClass: 'text-[#FFE39E]',
                    milestoneStyle: {
                      textShadow:
                        '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
                    },
                  })
                )}
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className="h-px w-8 bg-[#E6B86A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
                  <span className="size-1.5 rotate-45 bg-[#FFE39E] shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
                  <span className="h-px w-8 bg-[#E6B86A]/85 shadow-[0_1px_6px_rgba(0,0,0,0.95)]" />
                </div>
                {dateCityLine && (
                  <p
                    className={`mt-1 font-bold uppercase text-[#FFFFFF] leading-tight ${
                      compact
                        ? 'text-[8.5px] tracking-[0.14em]'
                        : 'text-[9.5px] tracking-[0.17em]'
                    }`}
                    style={{
                      textShadow:
                        '0 2px 4px rgba(0,0,0,1), 0 4px 12px rgba(0,0,0,0.96), 0 0 18px rgba(0,0,0,0.9)',
                    }}
                  >
                    {dateCityLine}
                  </p>
                )}
              </div>
            ) : (
              <div
                style={{
                  backgroundColor: `${skin.cardHex}EB`,
                  borderColor: `${skin.goldHex}80`,
                  color: skin.inkHex,
                }}
                className="rounded-2xl px-4 py-2 backdrop-blur-md border shadow-lg max-w-[92%]"
              >
                <p
                  style={{ color: skin.isDark ? skin.goldHex : skin.accentHex }}
                  className="text-[9.5px] font-semibold uppercase tracking-[0.2em]"
                >
                  {theme.id === 'ladli-kanya'
                    ? stageLang === 'en'
                      ? '॥ Nandini Jhula · Shubh Janmotsav ॥'
                      : '॥ नंदिनी झूला · शुभ जन्मोत्सव ॥'
                    : theme.id === 'veer-balak'
                      ? stageLang === 'en'
                        ? '॥ Suryavanshi Tilak · Shubh Janmotsav ॥'
                        : '॥ सूर्यवंशी तिलक · शुभ जन्मोत्सव ॥'
                      : theme.id === 'gulab-baisa'
                        ? stageLang === 'en'
                          ? '॥ Gulabi Garh · Jaipur Utsav ॥'
                          : '॥ गुलाबी गढ़ · जयपुर जन्मोत्सव ॥'
                        : isBirthday
                          ? stageLang === 'en'
                            ? 'You’re Invited · Birthday Celebration'
                            : 'जन्मदिन उत्सव · स्नेहिल आमंत्रण'
                          : theme.id === 'mehr'
                            ? stageLang === 'en'
                              ? 'Bismillah · Noor-e-Charbagh'
                              : 'नूर-ए-चारबाग़ · दावत-ए-निकाह'
                            : theme.id === 'pattu-zari'
                              ? stageLang === 'en'
                                ? '॥ Kanchi Kalyanam · Shubh Muhurtham ॥'
                                : '॥ कांची कल्याणम · शुभ मुहूर्तम ॥'
                              : theme.id === 'kesariya'
                                ? stageLang === 'en'
                                  ? '॥ Bandhani Saanjh · Shubh Vivah ॥'
                                  : '॥ बांधनी साँझ · शुभ विवाह ॥'
                                : theme.id === 'kalgi'
                                  ? stageLang === 'en'
                                    ? '॥ Ik Onkar · Amrit Anand ॥'
                                    : '॥ एक ओंकार · अमृत आनंद ॥'
                                  : stageLang === 'en'
                                    ? '॥ Shree Ganeshaya Namah ॥'
                                    : '॥ श्री गणेशाय नमः ॥'}
                </p>
                {isBirthday ? (
                  renderBirthdayTitle({
                    as: 'h3',
                    enFontClass: skin.scriptClass,
                    nameClass: skin.isDark ? 'foil-gold-text' : 'foil-gold-deep-text',
                    nameStyle: stageLang === 'hi' ? { color: skin.isDark ? skin.goldHex : skin.inkHex } : undefined,
                    milestoneStyle: { color: skin.isDark ? skin.goldHex : skin.accentHex },
                  })
                ) : stageLang === 'en' ? (
                  (cleanGroom || cleanBride) && (
                    <h3
                      className={`mt-0.5 px-1 max-w-full break-words ${skin.scriptClass} leading-[1.08] ${
                        skin.isDark ? 'foil-gold-text' : 'foil-gold-deep-text'
                      } ${compact ? 'text-[clamp(24px,7.2vw,32px)]' : 'text-[clamp(28px,8vw,38px)]'}`}
                    >
                      {[cleanGroom, cleanBride].filter(Boolean).join(' & ')}
                    </h3>
                  )
                ) : (
                  (groomHi || brideHi) && (
                    <h3
                      style={{ color: skin.isDark ? skin.goldHex : skin.inkHex }}
                      className={`mt-0.5 font-tiro font-semibold leading-tight ${
                        compact ? 'text-[22px]' : 'text-[27px]'
                      }`}
                    >
                      {[groomHi, brideHi].filter(Boolean).join(' एवं ')}
                    </h3>
                  )
                )}
                {dateCityLine && (
                  <p
                    style={{ color: skin.mutedInkHex }}
                    className="mt-0.5 text-[9.5px] uppercase tracking-[0.15em]"
                  >
                    {dateCityLine}
                  </p>
                )}
              </div>
            )}
          </div>
          )}

          {/* STRICT WAX-SEAL / BOW INTERACTIVE HOTSPOT */}
          {!isOpened && (
            <div
              style={{
                left: `${theme.sealConfig.leftPercent}%`,
                top: `${theme.sealConfig.topPercent}%`,
                width: `${theme.sealConfig.sizePercent}%`,
                transform: 'translate(-50%, -50%)',
              }}
              className={`absolute z-30 ${
                theme.id === 'deepotsav' ? 'aspect-[3/4]' : 'aspect-square'
              }`}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  triggerOpenGate(e);
                }}
                aria-label={
                  theme.id === 'deepotsav'
                    ? 'Tap to light the hanging lamp and open invitation'
                    : `Tap ${theme.sealConfig.sealNameEn} to unseal and open invitation`
                }
                className={`group/seal relative h-full w-full rounded-full cursor-pointer focus:outline-none transition-transform duration-200 hover:scale-105 active:scale-95 ${
                  sealNudge
                    ? 'ring-4 ring-[#FDE68A] bg-[#FDE68A]/25 scale-110 shadow-[0_0_38px_rgba(253,230,138,0.95)]'
                    : 'animate-wax-seal-beacon ring-2 ring-[#F5D68A]/85 hover:ring-[#FDE68A]'
                }`}
              >
                {/* Concentric pulsing aura */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-2 rounded-full border border-[#FDE68A]/60 animate-ping opacity-55"
                />
              </button>

              {/* Floating Seal/Bow Callout Pill anchored to the Hotspot */}
              <span
                className={`pointer-events-none absolute whitespace-nowrap rounded-full border px-3 py-1 text-[10px] font-semibold tracking-[0.06em] shadow-xl backdrop-blur-md transition-all duration-200 ${
                  theme.id === 'deepotsav'
                    ? 'left-[114%] top-1/2 -translate-y-1/2'
                    : 'left-1/2 top-[110%] -translate-x-1/2'
                } ${
                  sealNudge
                    ? 'border-[#FDE68A] bg-[#B3261E] text-white scale-105'
                    : theme.id === 'van-upvan'
                      ? 'border-[#C59B38]/80 bg-[#1E3224]/92 text-[#FAF6EE]'
                      : theme.id === 'ivory'
                        ? 'border-[#E8C56B]/85 bg-[#6E141E]/95 text-[#FAF6EE]'
                        : theme.id === 'gulab'
                          ? 'border-[#C98A95]/90 bg-[#7D1D34]/95 text-[#FFF8FA]'
                          : theme.id === 'confetti-garden'
                            ? 'border-[#E6B86A]/85 bg-[#9E2F20]/95 text-[#FFF8EE]'
                            : theme.id === 'jashn-birthday'
                              ? 'border-[#E6B86A]/90 bg-[#231433]/95 text-[#F5E9D6]'
                              : theme.id === 'kanha-makhan'
                                ? 'border-[#F2B43A]/90 bg-[#0D2138]/95 text-[#FFF8E7]'
                                : theme.id === 'devi-kumkum'
                                  ? 'border-[#F4B844]/90 bg-[#320917]/95 text-[#FBF0DC]'
                                  : theme.id === 'mehr'
                                    ? 'border-[#E6C77E]/90 bg-[#1E3A2F]/95 text-[#FAF6EE]'
                                    : theme.id === 'roshni'
                                      ? 'border-[#E6B86A]/90 bg-[#3B0A14]/95 text-[#FFF8EE]'
                                      : theme.id === 'ladli-kanya'
                                        ? 'border-[#F4B844]/90 bg-[#8E1B42]/95 text-[#FFF8FA]'
                                        : theme.id === 'shubh-aarti'
                                          ? 'border-[#F7C96B]/90 bg-[#3E0B12]/95 text-[#FBF0D9]'
                                          : theme.id === 'vrindavan'
                                            ? 'border-[#E6BC63]/90 bg-[#0E1C3D]/95 text-[#FAF5EA]'
                                            : theme.id === 'rangoli-utsav'
                                              ? 'border-[#F5C156]/90 bg-[#5C1A0E]/95 text-[#FFF8EB]'
                                              : theme.id === 'veer-balak'
                                                ? 'border-[#F5C156]/90 bg-[#7A2309]/95 text-[#FFF8EB]'
                                                : theme.id === 'gulab-baisa'
                                                  ? 'border-[#F5D08A]/90 bg-[#8F1F40]/95 text-[#FFF2EE]'
                                                  : theme.id === 'temple'
                                                    ? 'border-[#E2A83B]/90 bg-[#3B120C]/95 text-[#FFF8EB]'
                                                    : theme.id === 'jharokha'
                                                      ? 'border-[#F4B41A]/90 bg-[#6B1410]/95 text-[#FFF8EB]'
                                                      : theme.id === 'pattu-zari'
                                                        ? 'border-[#E2B854]/90 bg-[#163D2E]/95 text-[#FAF4E6]'
                                                        : theme.id === 'baal-gopal'
                                                          ? 'border-[#F7C96B]/90 bg-[#0B3B37]/95 text-[#FFF8EB]'
                                                          : theme.id === 'kesariya'
                                                            ? 'border-[#F5C156]/90 bg-[#8F1E14]/95 text-[#FFF8EB]'
                                                            : theme.id === 'kalgi'
                                                              ? 'border-[#F5D08A]/90 bg-[#8C2F0A]/95 text-[#FFF8EB]'
                                                              : theme.id === 'deepotsav'
                                                                ? 'border-[#F4B41A]/90 bg-[#11182F]/95 text-[#FFF8EB]'
                                                                : theme.id === 'neel-chandani'
                                                                  ? 'border-[#CBD5E1]/80 bg-[#0B162C]/92 text-[#F8FAFC]'
                                                                  : 'border-[#E8C56B]/85 bg-[#1B070B]/92 text-[#FAF0DD]'
                }`}
              >
                {theme.id === 'deepotsav'
                  ? sealNudge
                    ? stageLang === 'en'
                      ? '← Tap ONLY this Lamp to Light'
                      : '← सिर्फ इस दीप को जलाएँ'
                    : stageLang === 'en'
                      ? '← Tap to Light Lamp'
                      : '← यह दीप जलाएँ'
                  : sealNudge
                    ? stageLang === 'en'
                      ? `✦ Tap ONLY this ${theme.sealConfig.sealNameEn} to Open ✦`
                      : `✦ खोलने के लिए सिर्फ इस ${theme.sealConfig.sealNameHi} पर टैप करें ✦`
                    : stageLang === 'en'
                      ? `Tap ${theme.sealConfig.sealNameEn} to Open`
                      : `${theme.sealConfig.sealNameHi} पर टैप करें`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Unified 2.5D Swaying Garlands, Volumetric Sunbeams & Diya Shimmer Overlay on Stage 1 Cover */}
      {!bodyOpen &&
        !isOpened &&
        theme.id !== 'jharokha' &&
        theme.id !== 'mehndi-jhoola' &&
        theme.id !== 'sheesh-mahal' &&
        !isExtractedVideoCard &&
        theme.id !== 'roshni' &&
        theme.id !== 'temple' &&
        theme.id !== 'nanhe-kadam' &&
        theme.id !== 'baal-gopal' &&
        theme.id !== 'ladli-kanya' &&
        theme.id !== 'devi-kumkum' &&
        theme.id !== 'kanha-makhan' &&
        theme.id !== 'veer-balak' &&
        theme.id !== 'rangoli-utsav' &&
        theme.id !== 'mehr' && (
          <div className="pointer-events-none absolute inset-0 z-[21]">
            <LivingSceneMotionOverlay
              themeId={theme.id}
              compact={compact}
              showBottomDiyas={true}
              intensity="subtle"
            />
          </div>
        )}

      {/* Unified 60FPS Real-Time Bespoke Particle Engine Across All Cards */}
      {theme.id !== 'jharokha' &&
        theme.id !== 'mehndi-jhoola' &&
        theme.id !== 'sheesh-mahal' &&
        !isExtractedVideoCard && (
        <StageMotionCanvas
          themeId={theme.id}
          mode={stageMotionMode}
          isOpened={isOpened}
          bodyOpen={bodyOpen}
        />
      )}

      {/* Floating bottom Preview & Customize bar inside compact phone screen before opening */}
      {compact && !isOpened && (onOpenFullPreview || onOpenCustomizer) && (
        <div className="absolute bottom-[2.5%] left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
          {onOpenFullPreview && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenFullPreview();
              }}
              aria-label={`Preview ${theme.name}: try the opening`}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-[#E6B86A]/45 ring-1 ring-inset ring-white/10 bg-[#1a0b0d]/88 px-3 text-[11.5px] font-medium whitespace-nowrap shrink-0 text-white shadow-[0_6px_20px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-transform duration-150 active:scale-[0.96] cursor-pointer"
            >
              <Maximize2 className="h-3 w-3" />
              <span>Full Preview</span>
            </button>
          )}
          {onOpenCustomizer && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCustomizer();
              }}
              aria-label={`Customize ${theme.name}`}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-[#F5D68A]/55 ring-1 ring-inset ring-white/15 bg-[#9E2A2B]/94 px-3 text-[11.5px] font-medium whitespace-nowrap shrink-0 text-[#FAF6EE] shadow-[0_6px_20px_rgba(0,0,0,0.32)] backdrop-blur-sm transition-transform duration-150 active:scale-[0.96] cursor-pointer"
            >
              <SlidersHorizontal className="h-3 w-3" />
              <span>Customize</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
