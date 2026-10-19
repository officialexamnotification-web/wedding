import React, { useState, useRef } from 'react';
import {
  LayoutTemplate,
  Type,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  Palette,
  Plus,
  MapPin,
  MessageSquare,
  Search,
  Upload,
  X,
  Film,
  Play,
  Pause,
  CheckCircle2,
  Layers,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  Shapes,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Wand2,
  Crown,
  PenTool,
  Music,
  Ruler,
  Grid,
  Eraser,
  Shuffle,
  Volume2,
  CreditCard,
  Frame,
  Table2,
  BarChart3,
  LayoutGrid,
  Clock,
  Barcode,
  FolderKanban,
  Languages,
  Replace,
  Wifi,
  Calendar,
  Save,
  FolderOpen,
  RotateCcw,
} from 'lucide-react';
import {
  CardTemplate,
  CanvasItem,
  TextElement,
  ImageElement,
  StickerElement,
  QrElement,
  ShapeElement,
  TableElement,
  ChartElement,
  GridElement,
  CountdownElement,
  BarcodeElement,
  FrameElement,
  FormElement,
  SheetElement,
  MockupElement,
  Model3DElement,
  VideoElement,
  AudioElement,
  CardPage,
  AspectRatioType,
  CANVAS_SIZES,
  ShapeVariant,
  PhotoMask,
  BrandKit,
  AudioTrack,
  DrawBrushSettings,
  SavedProject,
  ChartVariant,
  GridLayoutVariant,
} from '../types/editor';
import { TEMPLATE_CATEGORIES, INITIAL_TEMPLATES } from '../data/templates';
import { STICKER_CATEGORIES, STICKERS, StickerDefinition } from '../data/stickers';
import { BACKGROUNDS } from '../data/backgrounds';
import { generateQrDataUrl } from '../utils/qrHelper';
import {
  getImageCssFilter,
  getImageMaskStyle,
  renderShapeVisual,
} from './Canvas';
import { ElementsLibraryPanel } from './ElementsLibraryPanel';

export type SidebarTab =
  | 'templates'
  | 'elements'
  | 'text'
  | 'brand'
  | 'photos'
  | 'tools'
  | 'projects'
  | 'apps'
  | 'audio'
  | 'backgrounds'
  | 'layers'
  | 'slides';

interface SidebarProps {
  aspectRatio: AspectRatioType;
  onSelectTemplate: (template: CardTemplate) => void;
  onAddElement: (elem: CanvasItem) => void;
  onSetBackground: (bgType: 'color' | 'gradient' | 'pattern' | 'image', bgValue: string) => void;
  activeBackground: string;
  onCloseSidebar?: () => void;
  pages: CardPage[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage?: (index: number) => void;
  onDeletePage: (index: number) => void;
  onMovePage?: (fromIndex: number, toIndex: number) => void;
  onOpenVideoPreview: () => void;
  onOpenAiCopy?: () => void;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasItem>, commitToHistory?: boolean) => void;
  onDeleteElementById: (id: string) => void;
  onDuplicateElementById: (id: string) => void;
  drawBrush?: DrawBrushSettings;
  onUpdateDrawBrush?: (updates: Partial<DrawBrushSettings>) => void;
  onClearDrawings?: () => void;
  onApplyBrandKit?: (kit: BrandKit) => void;
  activeAudioTrackId?: string;
  onSelectAudioTrack?: (track: AudioTrack) => void;
  savedProjects?: SavedProject[];
  onSaveProject?: () => void;
  onLoadProject?: (proj: SavedProject) => void;
  onDeleteProject?: (id: string) => void;
  onFindAndReplaceText?: (findStr: string, replaceStr: string) => number;
  onTranslateCard?: (targetLang: 'hindi' | 'english' | 'hinglish' | 'sanskrit') => void;
  onApplyPageLayout?: (layoutId: string) => void;
  showRulers?: boolean;
  onToggleRulers?: () => void;
  showSafeZones?: boolean;
  onToggleSafeZones?: () => void;
}

export const SHAPE_PRESETS: {
  shapeType: ShapeVariant;
  label: string;
  desc: string;
  category: 'frames' | 'shapes' | 'lines' | 'badges';
  width: number;
  height: number;
  strokeWidth: number;
  fillColor?: string;
  innerText?: string;
}[] = [
  {
    shapeType: 'gold-frame',
    label: 'Royal Corner Frame',
    desc: 'Full card gold border',
    category: 'frames',
    width: 410,
    height: 760,
    strokeWidth: 2,
  },
  {
    shapeType: 'ornate-border',
    label: 'Double Ornate Border',
    desc: 'Double line palace frame',
    category: 'frames',
    width: 390,
    height: 740,
    strokeWidth: 3,
  },
  {
    shapeType: 'arch-frame',
    label: 'Jharokha Arch Frame',
    desc: 'Rajasthani arch outline',
    category: 'frames',
    width: 220,
    height: 280,
    strokeWidth: 2,
  },
  {
    shapeType: 'octagon-frame',
    label: 'Octagon Jali Frame',
    desc: '8-corner heritage plaque',
    category: 'frames',
    width: 220,
    height: 220,
    strokeWidth: 2,
  },
  {
    shapeType: 'mandala-ring',
    label: 'Sacred Mandala Ring',
    desc: 'Intricate concentric ring',
    category: 'frames',
    width: 180,
    height: 180,
    strokeWidth: 2,
  },
  {
    shapeType: 'royal-badge',
    label: 'Royal Seal Medallion',
    desc: 'Starburst wedding seal',
    category: 'badges',
    width: 150,
    height: 150,
    strokeWidth: 2,
    fillColor: 'rgba(212, 175, 55, 0.16)',
    innerText: 'SHUBH VIVAH',
  },
  {
    shapeType: 'scallop-badge',
    label: 'Lotus Scallop Seal',
    desc: '12-petal royal emblem',
    category: 'badges',
    width: 150,
    height: 150,
    strokeWidth: 2,
    fillColor: 'rgba(196, 30, 58, 0.28)',
    innerText: 'SAVE THE DATE',
  },
  {
    shapeType: 'ribbon-banner',
    label: 'Royal Ribbon Banner',
    desc: 'Ceremony title scroll',
    category: 'badges',
    width: 280,
    height: 54,
    strokeWidth: 2,
    fillColor: 'rgba(99, 12, 29, 0.9)',
    innerText: 'GRAND RECEPTION',
  },
  {
    shapeType: 'pill-banner',
    label: 'Event Pill Banner',
    desc: 'Tag for dates & hashtags',
    category: 'badges',
    width: 240,
    height: 44,
    strokeWidth: 2,
    fillColor: 'rgba(26, 4, 8, 0.85)',
    innerText: '#SidKiAnanya',
  },
  {
    shapeType: 'shield-crest',
    label: 'Royal Crest Shield',
    desc: 'Heritage family coat of arms',
    category: 'badges',
    width: 140,
    height: 160,
    strokeWidth: 2,
    fillColor: 'rgba(212, 175, 55, 0.15)',
    innerText: 'S & A',
  },
  {
    shapeType: 'speech-bubble',
    label: 'Callout Quote Bubble',
    desc: 'Host message callout',
    category: 'badges',
    width: 200,
    height: 110,
    strokeWidth: 2,
    fillColor: 'rgba(45, 6, 16, 0.85)',
    innerText: 'Padharo Mhare Des!',
  },
  {
    shapeType: 'cloud-badge',
    label: 'Cloud Blessing Tag',
    desc: 'Soft scalloped cloud',
    category: 'badges',
    width: 190,
    height: 110,
    strokeWidth: 2,
    fillColor: 'rgba(212, 175, 55, 0.14)',
  },
  {
    shapeType: 'divider-line',
    label: 'Diamond Divider Line',
    desc: 'Section ornament rule',
    category: 'lines',
    width: 280,
    height: 24,
    strokeWidth: 2,
  },
  {
    shapeType: 'line-floral',
    label: 'Lotus Floral Divider',
    desc: 'Royal center motif rule',
    category: 'lines',
    width: 290,
    height: 28,
    strokeWidth: 2,
  },
  {
    shapeType: 'line-arrow-both',
    label: 'Double Arrow Connector',
    desc: 'Connector with arrowheads on both ends',
    category: 'lines',
    width: 260,
    height: 24,
    strokeWidth: 2,
  },
  {
    shapeType: 'line-dashed',
    label: 'Dashed Cut / Fold Line',
    desc: 'Coupon / RSVP tear line',
    category: 'lines',
    width: 280,
    height: 20,
    strokeWidth: 2,
  },
  {
    shapeType: 'arrow-right',
    label: 'Directional Pointer Arrow',
    desc: 'Venue route arrow',
    category: 'lines',
    width: 160,
    height: 55,
    strokeWidth: 2,
    fillColor: 'rgba(212, 175, 55, 0.25)',
  },
  {
    shapeType: 'rectangle',
    label: 'Gold Card Box',
    desc: 'Backdrop box for text',
    category: 'shapes',
    width: 320,
    height: 160,
    strokeWidth: 2,
    fillColor: 'rgba(20, 5, 10, 0.65)',
  },
  {
    shapeType: 'circle',
    label: 'Sacred Circle Ring',
    desc: 'Monogram / couple ring',
    category: 'shapes',
    width: 150,
    height: 150,
    strokeWidth: 2,
  },
  {
    shapeType: 'diamond',
    label: 'Royal Diamond Gem',
    desc: 'Rotated geometric gem',
    category: 'shapes',
    width: 150,
    height: 150,
    strokeWidth: 2,
  },
  {
    shapeType: 'star',
    label: 'Auspicious Starburst',
    desc: '5-point festive star',
    category: 'shapes',
    width: 130,
    height: 130,
    strokeWidth: 2,
    fillColor: 'rgba(212, 175, 55, 0.18)',
  },
  {
    shapeType: 'hexagon',
    label: 'Palace Hexagon',
    desc: '6-sided geometric badge',
    category: 'shapes',
    width: 140,
    height: 140,
    strokeWidth: 2,
  },
  {
    shapeType: 'pentagon',
    label: 'Royal Pentagon',
    desc: '5-sided crest polygon',
    category: 'shapes',
    width: 140,
    height: 140,
    strokeWidth: 2,
  },
  {
    shapeType: 'triangle',
    label: 'Sacred Pyramid Triangle',
    desc: 'Geometric triangle',
    category: 'shapes',
    width: 140,
    height: 130,
    strokeWidth: 2,
  },
  {
    shapeType: 'heart-shape',
    label: 'Wedding Couple Heart',
    desc: 'Romantic outline badge',
    category: 'shapes',
    width: 140,
    height: 130,
    strokeWidth: 2,
    fillColor: 'rgba(196, 30, 58, 0.25)',
  },
  {
    shapeType: 'parallelogram',
    label: 'Modern Slant Tag',
    desc: 'Angled banner box',
    category: 'shapes',
    width: 200,
    height: 70,
    strokeWidth: 2,
    fillColor: 'rgba(212, 175, 55, 0.15)',
  },
  {
    shapeType: 'trapezoid',
    label: 'Mandap Stage Trapezoid',
    desc: 'Architectural base shape',
    category: 'shapes',
    width: 220,
    height: 80,
    strokeWidth: 2,
  },
  {
    shapeType: 'cross-plus',
    label: 'Auspicious Plus Emblem',
    desc: 'Symmetric cross symbol',
    category: 'shapes',
    width: 110,
    height: 110,
    strokeWidth: 2,
  },
];

export const BRAND_KITS: BrandKit[] = [
  {
    id: 'udaipur-crimson',
    name: 'Udaipur Crimson & Gold',
    primaryColors: ['#4A0404', '#800020', '#D4AF37', '#FFEAA7', '#FFFFFF'],
    headingFont: "'Cinzel', serif",
    subheadingFont: "'Alex Brush', cursive",
    bodyFont: "'Playfair Display', serif",
  },
  {
    id: 'royal-emerald',
    name: 'Panna Emerald & Champagne',
    primaryColors: ['#051A11', '#0D5C3A', '#D4AF37', '#FFF2C6', '#E6C665'],
    headingFont: "'Rozha One', serif",
    subheadingFont: "'Great Vibes', cursive",
    bodyFont: "'Cormorant Garamond', serif",
  },
  {
    id: 'jodhpur-sapphire',
    name: 'Jodhpur Midnight Sapphire',
    primaryColors: ['#08121F', '#1B2A4A', '#FFD700', '#F5D77F', '#FFFFFF'],
    headingFont: "'Cinzel', serif",
    subheadingFont: "'Tangerine', cursive",
    bodyFont: "'Montserrat', sans-serif",
  },
  {
    id: 'haldi-marigold',
    name: 'Sangeet & Haldi Marigold',
    primaryColors: ['#7C2D12', '#F59E0B', '#FEF08A', '#FFFBEB', '#BE123C'],
    headingFont: "'Rozha One', serif",
    subheadingFont: "'Kalam', cursive",
    bodyFont: "'Playfair Display', serif",
  },
  {
    id: 'jaipur-rose',
    name: 'Jaipur Pink Palace Velvet',
    primaryColors: ['#500724', '#9D174D', '#FDE047', '#FCE7F3', '#FFFFFF'],
    headingFont: "'Playfair Display', serif",
    subheadingFont: "'Alex Brush', cursive",
    bodyFont: "'Cormorant Garamond', serif",
  },
  {
    id: 'mysore-ivory',
    name: 'Mysore Silk Ivory & Temple Gold',
    primaryColors: ['#2C1810', '#5C2E14', '#D4AF37', '#FFFDF7', '#F5E6C8'],
    headingFont: "'Cinzel', serif",
    subheadingFont: "'Great Vibes', cursive",
    bodyFont: "'Playfair Display', serif",
  },
];

export const AUDIO_TRACKS: AudioTrack[] = [
  {
    id: 'royal-shehnai',
    name: 'Ustad Bismillah Royal Shehnai',
    category: 'shehnai',
    ragaNotes: [293.66, 329.63, 369.99, 440.0, 493.88, 587.33],
    tempo: 1.2,
    description: 'Auspicious Manglik Wedding Raga Malkauns',
  },
  {
    id: 'udaipur-sitar',
    name: 'Lake Palace Classical Sitar',
    category: 'sitar',
    ragaNotes: [261.63, 293.66, 329.63, 392.0, 440.0, 523.25],
    tempo: 1.0,
    description: 'Serene evening Raga Yaman plucked strings',
  },
  {
    id: 'vrindavan-flute',
    name: 'Divine Bansuri Flute Serenade',
    category: 'flute',
    ragaNotes: [329.63, 369.99, 440.0, 493.88, 554.37, 659.25],
    tempo: 1.4,
    description: 'Soulful bamboo flute melody for Pheras',
  },
  {
    id: 'punjabi-dhol',
    name: 'Baraat & Sangeet Festive Beats',
    category: 'dhol',
    ragaNotes: [146.83, 196.0, 220.0, 293.66, 329.63, 392.0],
    tempo: 0.8,
    description: 'Upbeat celebratory rhythm for Haldi & Sangeet',
  },
  {
    id: 'vedic-mantra',
    name: 'Sacred Ganesh & Vivah Chants',
    category: 'mantra',
    ragaNotes: [220.0, 246.94, 277.18, 329.63, 369.99, 440.0],
    tempo: 1.6,
    description: 'Spiritual temple bells and Vedic resonance',
  },
  {
    id: 'bollywood-royal',
    name: 'Jashn-e-Bahara Orchestra Strings',
    category: 'bollywood',
    ragaNotes: [261.63, 329.63, 392.0, 493.88, 523.25, 659.25],
    tempo: 1.1,
    description: 'Romantic royal bridal entry symphony',
  },
];

const CANVA_FONT_COMBINATIONS = [
  {
    title: 'THE ROYAL WEDDING',
    subtitle: 'Siddharth & Ananya',
    caption: '18 DECEMBER 2026 • UDAIPUR',
    titleFont: "'Cinzel', serif",
    subFont: "'Alex Brush', cursive",
    color: '#FFEAA7',
  },
  {
    title: '॥ शुभ विवाह निमंत्रण ॥',
    subtitle: 'चि. सिद्धार्थ संग सौ. अनन्या',
    caption: 'मंगल परिणय उत्सव में आपका स्वागत है',
    titleFont: "'Rozha One', serif",
    subFont: "'Tiro Devanagari Hindi', serif",
    color: '#FFD700',
  },
  {
    title: 'SAVE THE DATE',
    subtitle: 'For Our Grand Celebration',
    caption: 'THE LEELA PALACE, NEW DELHI',
    titleFont: "'Playfair Display', serif",
    subFont: "'Great Vibes', cursive",
    color: '#FFF2C6',
  },
  {
    title: 'SANGEET & MEHENDI',
    subtitle: 'An Evening of Music & Dance',
    caption: '7:00 PM ONWARDS',
    titleFont: "'Montserrat', sans-serif",
    subFont: "'Cormorant Garamond', serif",
    color: '#F5D77F',
  },
  {
    title: '॥ शुभ गृह प्रवेश ॥',
    subtitle: 'नूतन गृह एवं वास्तु शांति पूजन',
    caption: 'शर्मा परिवार आपका हार्दिक स्वागत करता है',
    titleFont: "'Rozha One', serif",
    subFont: "'Kalam', cursive",
    color: '#FDE047',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  aspectRatio,
  onSelectTemplate,
  onAddElement,
  onSetBackground,
  activeBackground,
  pages,
  currentPageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
  onOpenVideoPreview,
  onOpenAiCopy,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onDeleteElementById,
  onDuplicateElementById,
  drawBrush,
  onUpdateDrawBrush,
  onClearDrawings,
  onApplyBrandKit,
  activeAudioTrackId = 'royal-shehnai',
  onSelectAudioTrack,
  savedProjects = [],
  onSaveProject,
  onLoadProject,
  onDeleteProject,
  onFindAndReplaceText,
  onTranslateCard,
  onApplyPageLayout,
  showRulers = false,
  onToggleRulers,
  showSafeZones = false,
  onToggleSafeZones,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('templates');
  const [activeToolTab, setActiveToolTab] = useState<
    'draw' | 'audio' | 'backgrounds' | 'layers' | 'guides'
  >('backgrounds');
  const [designSubTab, setDesignSubTab] = useState<'templates' | 'layouts' | 'styles'>('templates');
  const [elementSubTab, setElementSubTab] = useState<
    'all' | 'shapes' | 'frames' | 'grids' | 'tables' | 'charts' | 'stickers'
  >('all');
  // Keep the first workspace view focused on the invitation; the rail still
  // opens any tool panel on demand.
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [templateCategory, setTemplateCategory] = useState<string>('all');
  const [stickerCategory, setStickerCategory] = useState<string>('all');
  const [stickerSearch, setStickerSearch] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);
  const [playingTrackId, setPlayingTrackId] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Apps State
  const [qrType, setQrType] = useState<'maps' | 'rsvp' | 'custom' | 'upi' | 'wifi' | 'calendar'>(
    'maps'
  );
  const [mapsLocation, setMapsLocation] = useState<string>(
    'The Leela Palace, Chanakyapuri, New Delhi'
  );
  const [rsvpPhone, setRsvpPhone] = useState<string>('+91 98765 43210');
  const [rsvpMessage, setRsvpMessage] = useState<string>(
    'Attending the wedding! Count us in for 2 guests.'
  );
  const [customQrUrl, setCustomQrUrl] = useState<string>('https://invitationbazaar.com');
  const [upiId, setUpiId] = useState<string>('sharmafamily@okicici');
  const [upiPayee, setUpiPayee] = useState<string>('Sharma Family Wedding Shagun');
  const [wifiSsid, setWifiSsid] = useState<string>('RoyalPalace_Guest_WiFi');
  const [wifiPass, setWifiPass] = useState<string>('ShubhVivah2026');
  const [qrColor, setQrColor] = useState<string>('#1a0408');
  const [qrBgColor, setQrBgColor] = useState<string>('#FFF4D6');

  // Find & Replace State
  const [findText, setFindText] = useState<string>('');
  const [replaceText, setReplaceText] = useState<string>('');
  const [replaceFeedback, setReplaceFeedback] = useState<string>('');

  // Barcode / Pass State
  const [barcodeCode, setBarcodeCode] = useState<string>('VIP-VIVAH-2026-089');
  const [barcodeLabel, setBarcodeLabel] = useState<string>('ROYAL ENTRY PASS • GATE 1');

  // Countdown State
  const [countdownDate, setCountdownDate] = useState<string>('2026-12-18T19:00');
  const [countdownLabel, setCountdownLabel] = useState<string>('COUNTDOWN TO SHUBH MUHURAT');

  // Brand Kit Custom Builder State
  const [customBrandName, setCustomBrandName] = useState<string>('My Family Royal Kit');
  const [customBrandColor1, setCustomBrandColor1] = useState<string>('#3d0510');
  const [customBrandColor2, setCustomBrandColor2] = useState<string>('#D4AF37');
  const [customBrandColor3, setCustomBrandColor3] = useState<string>('#FFEAA7');

  // Photo URL / Upload
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [customSolidBg, setCustomSolidBg] = useState<string>('#3d0510');

  const currentPage = pages[currentPageIndex] || pages[0];
  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];

  // Slide helpers
  const getSlideImage = (page: CardPage): string | null => {
    const imgElem = page.elements.find((e) => e.type === 'image') as ImageElement | undefined;
    return imgElem?.src || null;
  };

  const getSlideHeadline = (page: CardPage): string => {
    if (page.title) return page.title;
    const textElem = page.elements.find((e) => e.type === 'text') as TextElement | undefined;
    return textElem?.text.slice(0, 25) || `Slide ${pages.indexOf(page) + 1}`;
  };

  const totalDuration = pages
    .reduce((sum, p) => sum + (p.duration || 4.5), 0)
    .toFixed(1);

  const handleTabClick = (tab: SidebarTab) => {
    if (activeTab === tab && isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setActiveTab(tab);
      setIsDrawerOpen(true);
      if (tab !== 'tools' && drawBrush?.isEnabled && onUpdateDrawBrush) {
        onUpdateDrawBrush({ isEnabled: false });
      }
    }
  };

  // Preview audio track in Sidebar
  const previewTrackAudio = (track: AudioTrack) => {
    if (playingTrackId === track.id) {
      setPlayingTrackId(null);
      return;
    }
    setPlayingTrackId(track.id);
    if (onSelectAudioTrack) onSelectAudioTrack(track);

    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      track.ragaNotes.slice(0, 4).forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = track.category === 'flute' ? 'sine' : 'triangle';
        const startT = ctx.currentTime + idx * 0.35;
        osc.frequency.setValueAtTime(freq, startT);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.25, startT + 0.3);
        gain.gain.setValueAtTime(0.08, startT);
        gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.34);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startT);
        osc.stop(startT + 0.35);
      });

      setTimeout(() => setPlayingTrackId(null), 1500);
    } catch {
      setPlayingTrackId(null);
    }
  };

  // Add QR handler
  const handleAddQr = async () => {
    let target = '';
    let label = '';
    if (qrType === 'maps') {
      target = mapsLocation.startsWith('http')
        ? mapsLocation
        : `https://maps.google.com/?q=${encodeURIComponent(mapsLocation)}`;
      label = 'Scan for Venue Location';
    } else if (qrType === 'rsvp') {
      target = `https://wa.me/${rsvpPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
        rsvpMessage
      )}`;
      label = 'Scan to RSVP via WhatsApp';
    } else if (qrType === 'upi') {
      target = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
        upiPayee
      )}&cu=INR`;
      label = 'Scan for Blessing / Shagun';
    } else if (qrType === 'wifi') {
      target = `WIFI:T:WPA;S:${wifiSsid};P:${wifiPass};;`;
      label = `Wi-Fi: ${wifiSsid}`;
    } else if (qrType === 'calendar') {
      target = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
        'Royal Wedding Celebration'
      )}&location=${encodeURIComponent(mapsLocation)}`;
      label = 'Scan to Save Event in Calendar';
    } else {
      target = customQrUrl || 'https://example.com';
      label = 'Scan QR Code';
    }

    const dataUrl = await generateQrDataUrl(target, qrColor, qrBgColor);

    const newQr: QrElement = {
      id: `qr-${Date.now()}`,
      type: 'qr',
      qrType,
      targetValue: target,
      label,
      color: qrColor,
      backgroundColor: qrBgColor,
      dataUrl,
      x: Math.round((dimensions.width - 105) / 2),
      y: Math.round(dimensions.height * 0.65),
      width: 105,
      height: 105,
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 5,
    };

    onAddElement(newQr);
  };

  // Add text element helper
  const handleAddText = (
    text: string,
    fontFamily: string,
    fontSize: number,
    fontWeight: 'normal' | 'bold' | '600' | '700' | '900' = 'normal',
    color = '#F5D77F',
    extra?: Partial<TextElement>
  ) => {
    const width = Math.min(dimensions.width - 60, 360);
    const newText: TextElement = {
      id: `text-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      type: 'text',
      text,
      fontFamily,
      fontSize,
      fontWeight,
      fontStyle: 'normal',
      textAlign: 'center',
      letterSpacing: 1.5,
      lineHeight: 1.3,
      color,
      x: Math.round((dimensions.width - width) / 2),
      y: Math.round(dimensions.height * 0.35),
      width,
      height: Math.max(46, Math.round(fontSize * 2.2)),
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 5,
      ...extra,
    };
    onAddElement(newText);
  };

  // Add Canva Font Combination Group
  const handleAddFontCombo = (combo: (typeof CANVA_FONT_COMBINATIONS)[0]) => {
    const baseText = `${combo.title}\n${combo.subtitle}\n${combo.caption}`;
    handleAddText(baseText, combo.titleFont, 20, 'bold', combo.color);
  };

  // Add shape element helper
  const handleAddShape = (preset: (typeof SHAPE_PRESETS)[0]) => {
    const w =
      preset.shapeType === 'gold-frame' || preset.shapeType === 'ornate-border'
        ? dimensions.width - 36
        : Math.min(preset.width, dimensions.width - 40);
    const h =
      preset.shapeType === 'gold-frame' || preset.shapeType === 'ornate-border'
        ? dimensions.height - 36
        : preset.height;

    const newShape: ShapeElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      shapeType: preset.shapeType,
      strokeColor: '#D4AF37',
      strokeWidth: preset.strokeWidth,
      fillColor: preset.fillColor || 'transparent',
      innerText: preset.innerText || '',
      innerTextColor: '#FFEAA7',
      innerFontSize: 13,
      innerFontFamily: "'Cinzel', serif",
      x: Math.round((dimensions.width - w) / 2),
      y:
        preset.shapeType === 'gold-frame' || preset.shapeType === 'ornate-border'
          ? 18
          : Math.round((dimensions.height - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 0.95,
      zIndex:
        preset.shapeType === 'gold-frame' || preset.shapeType === 'ornate-border'
          ? 2
          : (currentPage?.elements.length || 5) + 3,
    };
    onAddElement(newShape);
  };

  // Add sticker element helper
  const handleAddSticker = (sticker: StickerDefinition) => {
    const newSticker: StickerElement = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      stickerId: sticker.id,
      name: sticker.name,
      category: sticker.category,
      svgContent: sticker.svg,
      color: sticker.defaultColor,
      x: Math.round((dimensions.width - sticker.defaultWidth) / 2),
      y: Math.round(dimensions.height * 0.25),
      width: sticker.defaultWidth,
      height: sticker.defaultHeight,
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 5,
    };
    onAddElement(newSticker);
  };

  // Add photo helper
  const handleAddPhoto = (url: string, mask: PhotoMask = 'arch', caption?: string) => {
    const newImg: ImageElement = {
      id: `img-${Date.now()}`,
      type: 'image',
      src: url,
      mask,
      caption,
      borderWidth: 2,
      borderColor: '#D4AF37',
      borderRadius: mask === 'rounded' ? 16 : 0,
      x: Math.round((dimensions.width - 190) / 2),
      y: Math.round(dimensions.height * 0.25),
      width: 190,
      height: 220,
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 4,
    };
    onAddElement(newImg);
  };

  // Add Canva Table Element (Wedding Itinerary / Menu / Seating)
  const handleAddTable = (presetType: 'itinerary' | 'menu' | 'seating') => {
    let rows: string[][] = [];
    if (presetType === 'itinerary') {
      rows = [
        ['CEREMONY', 'TIME', 'VENUE HALL'],
        ['Haldi & Mehendi', '10:00 AM', 'Poolside Lawn'],
        ['Royal Sangeet', '07:30 PM', 'Durbar Ballroom'],
        ['Shubh Muhurat', '11:15 PM', 'Lotus Mandap'],
        ['Grand Reception', '08:00 PM', 'Royal Gardens'],
      ];
    } else if (presetType === 'menu') {
      rows = [
        ['ROYAL DAAWAT', 'SPECIALTY', 'COUNTER'],
        ['Welcome Drinks', 'Kesar Thandai', 'Foyer'],
        ['Royal Main Course', 'Rajasthani Thali', 'East Wing'],
        ['Mithai Mahal', 'Ghevar & Rabri', 'Dessert Lounge'],
      ];
    } else {
      rows = [
        ['TABLE NO.', 'FAMILY / GROUP', 'ZONE'],
        ['Table #01', 'Bride & Groom Family', 'Stage Front'],
        ['Table #02', 'Close Relatives', 'VIP Royal'],
        ['Table #03', 'Friends & Colleagues', 'Central Hall'],
      ];
    }

    const w = Math.min(dimensions.width - 44, 380);
    const h = rows.length * 36 + 12;
    const newTable: TableElement = {
      id: `table-${Date.now()}`,
      type: 'table',
      rows,
      headerBgColor: '#630c1d',
      headerTextColor: '#FFEAA7',
      cellBgColor: 'rgba(20, 5, 10, 0.85)',
      altRowBgColor: 'rgba(45, 10, 20, 0.75)',
      textColor: '#FFF2C6',
      borderColor: '#D4AF37',
      borderWidth: 1,
      fontSize: 11,
      fontFamily: "'Cinzel', serif",
      borderRadius: 10,
      cellPadding: 6,
      x: Math.round((dimensions.width - w) / 2),
      y: Math.round((dimensions.height - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 6,
    };
    onAddElement(newTable);
  };

  // Add Canva Chart / Infographic Element
  const handleAddChart = (chartType: ChartVariant) => {
    const w = Math.min(dimensions.width - 60, 330);
    const h = 210;
    const newChart: ChartElement = {
      id: `chart-${Date.now()}`,
      type: 'chart',
      chartType,
      title:
        chartType === 'progress-rings'
          ? 'GUEST RSVP CONFIRMATION'
          : 'CELEBRATION EVENTS TIMELINE',
      data: [
        { label: 'Haldi', value: 85, color: '#F59E0B' },
        { label: 'Sangeet', value: 95, color: '#EC4899' },
        { label: 'Vivah', value: 100, color: '#D4AF37' },
        { label: 'Reception', value: 90, color: '#10B981' },
      ],
      showLegend: true,
      showValues: true,
      textColor: '#FFEAA7',
      backgroundColor: 'rgba(20, 5, 10, 0.82)',
      borderColor: '#D4AF37',
      x: Math.round((dimensions.width - w) / 2),
      y: Math.round((dimensions.height - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 6,
    };
    onAddElement(newChart);
  };

  // Add Canva Photo Collage Grid Element
  const handleAddGrid = (gridLayout: GridLayoutVariant) => {
    const w = Math.min(dimensions.width - 50, 340);
    const h = 250;
    const defaultImgs = [
      '/images/wedding_couple_1791965341379.jpg',
      '/images/sangeet_haldi_1791965342768.jpg',
      '/images/royal_mandap_cover.webp',
      '/images/royal_vivah_peacocks.webp',
    ];
    const newGrid: GridElement = {
      id: `grid-${Date.now()}`,
      type: 'grid',
      gridLayout,
      images: defaultImgs,
      gap: 6,
      borderRadius: 12,
      borderColor: '#D4AF37',
      borderWidth: 2,
      backgroundColor: 'rgba(212, 175, 55, 0.12)',
      x: Math.round((dimensions.width - w) / 2),
      y: Math.round((dimensions.height - h) / 2),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 5,
    };
    onAddElement(newGrid);
  };

  // Add Canva Live Countdown Timer Element
  const handleAddCountdown = (
    styleVariant: CountdownElement['styleVariant'] = 'royal-gold'
  ) => {
    const w = Math.min(dimensions.width - 50, 340);
    const h = 96;
    const newCountdown: CountdownElement = {
      id: `countdown-${Date.now()}`,
      type: 'countdown',
      targetDate: countdownDate || '2026-12-18T19:00',
      eventLabel: countdownLabel || 'SHUBH VIVAH MUHURAT IN',
      styleVariant,
      primaryColor: '#FFEAA7',
      backgroundColor: 'rgba(45, 6, 16, 0.88)',
      borderColor: '#D4AF37',
      showSeconds: true,
      x: Math.round((dimensions.width - w) / 2),
      y: Math.round(dimensions.height * 0.72),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 6,
    };
    onAddElement(newCountdown);
  };

  // Add Canva Barcode / Royal Entry Pass Element
  const handleAddBarcode = () => {
    const w = 260;
    const h = 84;
    const newBarcode: BarcodeElement = {
      id: `barcode-${Date.now()}`,
      type: 'barcode',
      codeValue: barcodeCode || 'VIP-VIVAH-2026-089',
      label: barcodeLabel || 'ROYAL VENUE ENTRY PASS',
      color: '#1a0408',
      backgroundColor: '#FFF4D6',
      borderColor: '#D4AF37',
      showText: true,
      x: Math.round((dimensions.width - w) / 2),
      y: Math.round(dimensions.height * 0.75),
      width: w,
      height: h,
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 6,
    };
    onAddElement(newBarcode);
  };

  // Filter templates
  const filteredTemplates = INITIAL_TEMPLATES.filter((t) =>
    templateCategory === 'all' ? true : t.category === templateCategory
  );

  // Filter stickers
  const filteredStickers = STICKERS.filter((s) => {
    const matchesCat = stickerCategory === 'all' || s.category === stickerCategory;
    const matchesSearch = s.name.toLowerCase().includes(stickerSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const TABS_CONFIG = [
    { id: 'templates' as SidebarTab, label: 'Design', icon: LayoutTemplate },
    { id: 'elements' as SidebarTab, label: 'Elements', icon: Shapes },
    { id: 'text' as SidebarTab, label: 'Text', icon: Type },
    { id: 'brand' as SidebarTab, label: 'Brand', icon: Crown },
    { id: 'photos' as SidebarTab, label: 'Uploads', icon: ImageIcon },
    { id: 'tools' as SidebarTab, label: 'Tools', icon: Wand2 },
    { id: 'projects' as SidebarTab, label: 'Projects', icon: FolderKanban },
    { id: 'apps' as SidebarTab, label: 'Apps', icon: QrCode },
    { id: 'slides' as SidebarTab, label: 'Pages', icon: Film },
  ];

  // Get readable element summary for Layers panel
  const getElementLabel = (el: CanvasItem): string => {
    if (el.type === 'text') return (el as TextElement).text.slice(0, 26) || 'Text Box';
    if (el.type === 'sticker') return (el as StickerElement).name;
    if (el.type === 'image') return `Photo (${(el as ImageElement).mask})`;
    if (el.type === 'qr') return `QR: ${(el as QrElement).label}`;
    if (el.type === 'shape') return `Shape: ${(el as ShapeElement).shapeType}`;
    if (el.type === 'drawing') return 'Freehand Brush Stroke';
    if (el.type === 'table') return `Table (${(el as TableElement).rows.length} rows)`;
    if (el.type === 'chart') return `Chart: ${(el as ChartElement).title}`;
    if (el.type === 'grid') return `Collage Grid (${(el as GridElement).gridLayout})`;
    if (el.type === 'countdown') return `Countdown: ${(el as CountdownElement).eventLabel}`;
    if (el.type === 'barcode') return `Entry Pass: ${(el as BarcodeElement).codeValue}`;
    if (el.type === 'frame') return `Frame: ${(el as FrameElement).frameName}`;
    if (el.type === 'form') return `Form: ${(el as FormElement).formTitle}`;
    if (el.type === 'sheet') return `Sheet: ${(el as SheetElement).sheetTitle}`;
    if (el.type === 'mockup') return `Mockup: ${(el as MockupElement).mockupName}`;
    if (el.type === 'model3d') return `3D: ${(el as Model3DElement).modelName}`;
    if (el.type === 'video') return `Video: ${(el as VideoElement).videoName}`;
    if (el.type === 'audio') return `Audio: ${(el as AudioElement).trackName}`;
    return 'Element';
  };

  return (
    <>
      {/* ================= DESKTOP DOCK & FLYOUT DRAWER (md:flex) ================= */}
      <div className="hidden md:flex h-full select-none shrink-0 z-40 relative">
        {/* Far-Left Activity Rail (Canva Pro 12-Tab Dock) */}
        <div className="w-18 bg-neutral-950 border-r border-neutral-800/80 flex flex-col items-center py-2 gap-1 z-20 shrink-0 overflow-y-auto no-scrollbar">
          {TABS_CONFIG.filter((tab) => tab.id !== 'slides').map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && isDrawerOpen;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-15 py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all group shrink-0 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 font-semibold shadow-inner border border-amber-500/40'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
                title={tab.label}
              >
                <Icon
                  className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-amber-400' : 'text-neutral-400'
                  }`}
                />
                <span className="text-[10px] tracking-tight truncate w-full text-center">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Expandable Content Drawer */}
        {isDrawerOpen && (
          <aside className="w-80 sm:w-86 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full shadow-2xl relative shrink-0">
            {/* Drawer Header */}
            <div className="h-11 border-b border-neutral-800/80 px-4 flex items-center justify-between bg-neutral-950/60 shrink-0">
              <span className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                {TABS_CONFIG.find((t) => t.id === activeTab)?.label} Studio
              </span>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-200 rounded-lg hover:bg-neutral-800 transition"
                title="Collapse Panel (Expand Canvas)"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-neutral-700">
              {renderTabContent()}
            </div>
          </aside>
        )}
      </div>

      {/* ================= MOBILE BOTTOM NAVIGATION DOCK (< md) ================= */}
      <div className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-neutral-950 border-t border-neutral-800/90 flex items-center justify-start px-2 gap-1 z-40 select-none shadow-2xl overflow-x-auto no-scrollbar">
        {TABS_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && isDrawerOpen;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsDrawerOpen(true);
                if (tab.id !== 'tools' && drawBrush?.isEnabled && onUpdateDrawBrush) {
                  onUpdateDrawBrush({ isEnabled: false });
                }
              }}
              className={`min-w-[58px] py-1.5 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-colors shrink-0 ${
                isActive
                  ? 'text-amber-300 font-bold bg-amber-500/10'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= MOBILE BOTTOM SHEET DRAWER (< md) ================= */}
      {isDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end pointer-events-none">
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs pointer-events-auto transition-opacity"
          />

          <div className="relative bg-neutral-900 border-t border-neutral-700/80 rounded-t-3xl max-h-[75vh] flex flex-col shadow-2xl z-50 pointer-events-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex flex-col items-center pt-2.5 pb-2 px-4 border-b border-neutral-800">
              <div className="w-10 h-1 bg-neutral-600 rounded-full mb-2" />
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold text-amber-200 uppercase tracking-wider flex items-center gap-1.5">
                  {TABS_CONFIG.find((t) => t.id === activeTab)?.label} Studio
                </span>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 rounded-full bg-neutral-800 text-neutral-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-4">
              {renderTabContent()}
            </div>
          </div>
        </div>
      )}

    </>
  );

  function renderTabContent() {
    return (
      <>
        {activeTab === 'tools' && (
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-neutral-950 p-1 border border-neutral-800" role="tablist" aria-label="Editor tools">
            {([
              { id: 'backgrounds', label: 'Background', icon: Palette },
              { id: 'layers', label: 'Layers', icon: Layers },
              { id: 'draw', label: 'Draw', icon: PenTool },
              { id: 'audio', label: 'Audio', icon: Music },
              { id: 'guides', label: 'Guides', icon: Ruler },
            ] as const).map((tool) => {
              const Icon = tool.icon;
              const isActive = activeToolTab === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveToolTab(tool.id);
                    if (tool.id === 'draw' && onUpdateDrawBrush) {
                      onUpdateDrawBrush({ isEnabled: true });
                    } else if (drawBrush?.isEnabled && onUpdateDrawBrush) {
                      onUpdateDrawBrush({ isEnabled: false });
                    }
                  }}
                  className={`min-w-0 rounded-lg px-1 py-2 flex flex-col items-center gap-1 text-[10px] transition ${isActive ? 'bg-amber-500 text-neutral-950 font-semibold shadow' : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate w-full text-center">{tool.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* ================= 1. DESIGN (TEMPLATES, LAYOUTS & STYLES) TAB ================= */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            {/* Canva 3 Sub-Tabs: Templates | Layouts | Styles */}
            <div className="grid grid-cols-3 rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs">
              {(
                [
                  { id: 'templates', label: 'Templates' },
                  { id: 'layouts', label: 'Layouts' },
                  { id: 'styles', label: 'Styles' },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  onClick={() => setDesignSubTab(st.id)}
                  className={`py-1.5 rounded-lg font-semibold transition ${
                    designSubTab === st.id
                      ? 'bg-amber-500 text-neutral-950 shadow'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {designSubTab === 'templates' && (
              <>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {TEMPLATE_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setTemplateCategory(cat.id)}
                      className={`text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg font-medium transition ${
                        templateCategory === cat.id
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-3">
                  {filteredTemplates.map((template) => {
                    const firstPage = template.pages[0];
                    return (
                      <div
                        key={template.id}
                        onClick={() => onSelectTemplate(template)}
                        className="group cursor-pointer rounded-xl overflow-hidden border border-neutral-700/80 hover:border-amber-400 bg-neutral-800/80 hover:bg-neutral-800 transition duration-200 shadow-md flex flex-col"
                      >
                        <div
                          className="h-28 w-full p-2 relative flex flex-col justify-between overflow-hidden"
                          style={{ background: firstPage?.backgroundValue }}
                        >
                          {(() => {
                            const img = firstPage?.elements.find((e) => e.type === 'image') as any;
                            if (!img?.src) return null;
                            return (
                              <img
                                src={img.src}
                                alt=""
                                referrerPolicy="no-referrer"
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover opacity-65 group-hover:scale-105 transition duration-300"
                              />
                            );
                          })()}

                          <div className="flex items-center justify-between text-[10px] text-amber-200 z-10 font-mono">
                            <span className="bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-xs">
                              {template.aspectRatio}
                            </span>
                            <span className="bg-black/60 px-1.5 py-0.5 rounded capitalize">
                              {template.category}
                            </span>
                          </div>

                          <div className="text-center z-10 px-1">
                            <p className="font-tiro text-amber-200 text-xs drop-shadow font-semibold">
                              {template.title}
                            </p>
                          </div>

                          <div className="text-right z-10">
                            <span className="text-[9px] text-amber-300/80 bg-black/60 px-1.5 py-0.5 rounded">
                              {template.pages.length} Pages
                            </span>
                          </div>
                        </div>

                        <div className="p-2.5 flex items-center justify-between bg-neutral-900/90">
                          <span className="text-xs font-medium text-neutral-200 truncate flex-1 pr-2">
                            {template.title}
                          </span>
                          <span className="text-[11px] text-amber-400 font-semibold group-hover:underline shrink-0">Apply All →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {designSubTab === 'layouts' && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-400">
                  Invitation page layouts
                </p>
                {[
                  {
                    id: 'royal-cover',
                    name: 'Royal Cover Arch + Couple Title',
                    desc: 'Centered Jharokha portrait with गणेश वंदना & names',
                  },
                  {
                    id: '3-events-schedule',
                    name: '3-Function Wedding Itinerary',
                    desc: 'Structured Haldi, Sangeet & Reception timeline blocks',
                  },
                  {
                    id: 'rsvp-qr-venue',
                    name: 'Venue GPS QR + RSVP Card',
                    desc: 'Large scannable Google Maps QR with family hosts list',
                  },
                  {
                    id: 'couple-story-quote',
                    name: 'Shloka & Couple Monogram Seal',
                    desc: 'Sacred Sanskrit verse with ornate gold border & badge',
                  },
                ].map((lay) => (
                  <button
                    key={lay.id}
                    onClick={() => onApplyPageLayout && onApplyPageLayout(lay.id)}
                    className="w-full p-3 rounded-xl border border-neutral-700 hover:border-amber-400 bg-neutral-800/70 hover:bg-neutral-800 text-left transition space-y-1 group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-200 group-hover:text-amber-300">
                        {lay.name}
                      </span>
                      <span className="text-[10px] text-amber-400 font-semibold">+ Apply</span>
                    </div>
                    <p className="text-[11px] text-neutral-400">{lay.desc}</p>
                  </button>
                ))}
              </div>
            )}

            {designSubTab === 'styles' && (
              <div className="space-y-3">
                <p className="text-xs text-neutral-400">
                  Royal color and font pairings
                </p>
                {BRAND_KITS.map((kit) => (
                  <div
                    key={kit.id}
                    onClick={() => onApplyBrandKit && onApplyBrandKit(kit)}
                    className="p-3 rounded-xl border border-neutral-700 hover:border-amber-400 bg-neutral-800/70 hover:bg-neutral-800 cursor-pointer transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-200">{kit.name}</span>
                      <Shuffle className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="flex h-6 rounded-lg overflow-hidden border border-neutral-700">
                      {kit.primaryColors.map((c, idx) => (
                        <div key={idx} className="flex-1 h-full" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================= 2. ELEMENTS (14-CATEGORY LIBRARY + CLASSIC PRESETS) TAB ================= */}
        {activeTab === 'elements' && (
          <div className="space-y-4">
            <ElementsLibraryPanel
              dimensions={dimensions}
              onAddElement={onAddElement}
              selectedElement={
                currentPage?.elements.find((e) => e.id === selectedElementId) || null
              }
              onUpdateElement={(id, updates) => onUpdateElement(id, updates, true)}
            />

            <details className="group pt-2 border-t border-neutral-800">
              <summary className="cursor-pointer list-none flex items-center justify-between text-xs font-bold text-amber-300/90 py-1.5 px-2.5 rounded-lg bg-neutral-900/80 border border-neutral-800 hover:border-amber-500/40">
                <span>Quick Classic Royal Presets & Countdown</span>
                <ChevronDown className="w-3.5 h-3.5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="space-y-4 pt-3">
            {/* Category Pills inside Elements */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
              {(
                [
                  { id: 'all', label: 'All' },
                  { id: 'shapes', label: 'Shapes & Lines' },
                  { id: 'frames', label: 'Frames' },
                  { id: 'grids', label: 'Grids' },
                  { id: 'tables', label: 'Tables' },
                  { id: 'charts', label: 'Charts' },
                  { id: 'stickers', label: 'Motifs' },
                ] as const
              ).map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setElementSubTab(pill.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                    elementSubTab === pill.id
                      ? 'bg-amber-500 text-neutral-950 shadow'
                      : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* 2A. CANVA PHOTO FRAMES & MOCKUPS */}
            {(elementSubTab === 'all' || elementSubTab === 'frames') && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Frame className="w-3.5 h-3.5" />
                    <span>Photo frames & mockups</span>
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { mask: 'arch', label: 'Royal Arch' },
                      { mask: 'circle', label: 'Circle Ring' },
                      { mask: 'heart', label: 'Couple Heart' },
                      { mask: 'lotus', label: 'Lotus Petal' },
                      { mask: 'star', label: 'Star Badge' },
                      { mask: 'diamond', label: 'Diamond Gem' },
                      { mask: 'octagon', label: 'Octagon Jali' },
                      { mask: 'polaroid', label: 'Polaroid Card' },
                      { mask: 'phone-mockup', label: 'Phone Mockup' },
                    ] as { mask: PhotoMask; label: string }[]
                  ).map((item) => (
                    <button
                      key={item.mask}
                      onClick={() =>
                        handleAddPhoto(
                          '/images/wedding_couple_1791965341379.jpg',
                          item.mask,
                          item.mask === 'polaroid' ? 'Siddharth & Ananya' : undefined
                        )
                      }
                      className="p-2 rounded-xl border border-neutral-700/80 hover:border-amber-400 bg-neutral-800/70 hover:bg-neutral-800 flex flex-col items-center gap-1.5 transition group cursor-pointer"
                    >
                      <div
                        className="w-14 h-14 overflow-hidden relative shadow-md group-hover:scale-105 transition border border-amber-400/70 bg-neutral-950"
                        style={getImageMaskStyle({
                          id: 'preview',
                          type: 'image',
                          src: '/images/wedding_couple_1791965341379.jpg',
                          mask: item.mask,
                          x: 0,
                          y: 0,
                          width: 56,
                          height: 56,
                          rotation: 0,
                          opacity: 1,
                          zIndex: 1,
                        })}
                      >
                        <img
                          src="/images/wedding_couple_1791965341379.jpg"
                          alt={item.label}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-[10px] text-neutral-200 font-medium truncate w-full text-center">
                        {item.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2B. CANVA PHOTO COLLAGE GRIDS */}
            {(elementSubTab === 'all' || elementSubTab === 'grids') && (
              <div className="space-y-2.5 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Photo collages</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: '2-col', label: '2-Column Side-by-Side', desc: 'Couple + Venue split' },
                      { id: '2-row', label: '2-Row Vertical Split', desc: 'Top & bottom collage' },
                      { id: '3-collage', label: '3-Photo Asymmetric', desc: '1 Hero + 2 side photos' },
                      { id: '4-quad', label: '4-Photo Royal Grid', desc: '2×2 Pre-wedding gallery' },
                      { id: 'polaroid-trio', label: '3 Polaroid Memories', desc: 'Framed story strip' },
                      { id: 'hero-split', label: 'Palace Banner Grid', desc: 'Wide top + 2 bottom' },
                    ] as { id: GridLayoutVariant; label: string; desc: string }[]
                  ).map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleAddGrid(g.id)}
                      className="p-2.5 rounded-xl border border-neutral-700 hover:border-amber-400 bg-neutral-800/70 hover:bg-neutral-800 text-left transition flex flex-col justify-between"
                    >
                      <span className="text-xs font-semibold text-amber-200">+ {g.label}</span>
                      <span className="text-[10px] text-neutral-400 mt-0.5">{g.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2C. CANVA TABLES (ITINERARY / MENU / SEATING) */}
            {(elementSubTab === 'all' || elementSubTab === 'tables') && (
              <div className="space-y-2.5 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Table2 className="w-3.5 h-3.5" />
                  <span>Tables & schedules</span>
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Insert editable tables for wedding ceremonies, dining menu, or guest seating:
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => handleAddTable('itinerary')}
                    className="w-full p-2.5 rounded-xl border border-neutral-700 hover:border-amber-400 bg-neutral-800/80 hover:bg-neutral-800 text-left flex items-center justify-between transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-200">
                        + Wedding Events Schedule Table
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        5×3 Grid: Ceremony, Time & Venue Hall
                      </div>
                    </div>
                    <Table2 className="w-4 h-4 text-amber-400" />
                  </button>
                  <button
                    onClick={() => handleAddTable('menu')}
                    className="w-full p-2.5 rounded-xl border border-neutral-700 hover:border-amber-400 bg-neutral-800/80 hover:bg-neutral-800 text-left flex items-center justify-between transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-200">
                        + Royal Feast / Daawat Menu Table
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        4×3 Grid: Course, Specialty & Lounge
                      </div>
                    </div>
                    <Table2 className="w-4 h-4 text-amber-400" />
                  </button>
                  <button
                    onClick={() => handleAddTable('seating')}
                    className="w-full p-2.5 rounded-xl border border-neutral-700 hover:border-amber-400 bg-neutral-800/80 hover:bg-neutral-800 text-left flex items-center justify-between transition"
                  >
                    <div>
                      <div className="text-xs font-bold text-amber-200">
                        + VIP Guest Seating Chart Table
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        4×3 Grid: Table No., Family & Zone
                      </div>
                    </div>
                    <Table2 className="w-4 h-4 text-amber-400" />
                  </button>
                </div>
              </div>
            )}

            {/* 2D. CANVA CHARTS & LIVE COUNTDOWN */}
            {(elementSubTab === 'all' || elementSubTab === 'charts') && (
              <div className="space-y-2.5 pt-3 border-t border-neutral-800">
                <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Charts & countdowns</span>
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {(
                    [
                      { id: 'bar', label: 'Vertical Bar Chart' },
                      { id: 'horizontal-bar', label: 'Horizontal Bars' },
                      { id: 'donut', label: 'Donut Ring Chart' },
                      { id: 'pie', label: 'Pie Breakdown' },
                      { id: 'line', label: 'Timeline Trend' },
                      { id: 'progress-rings', label: 'Radial Progress' },
                    ] as { id: ChartVariant; label: string }[]
                  ).map((ch) => (
                    <button
                      key={ch.id}
                      onClick={() => handleAddChart(ch.id)}
                      className="p-2.5 rounded-xl border border-neutral-700 hover:border-amber-400 bg-neutral-800/70 hover:bg-neutral-800 text-left text-xs font-semibold text-amber-200 transition"
                    >
                      + {ch.label}
                    </button>
                  ))}
                </div>

                {/* Live Countdown Widget Quick Insert */}
                <button
                  onClick={() => handleAddCountdown('royal-gold')}
                  className="w-full p-2.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-900/30 border border-amber-400/50 hover:border-amber-400 text-left flex items-center justify-between transition"
                >
                  <div>
                    <div className="text-xs font-bold text-amber-200">
                      + Live Wedding Countdown Timer
                    </div>
                    <div className="text-[10px] text-neutral-300">
                      Days • Hours • Mins • Secs Stamp
                    </div>
                  </div>
                  <Clock className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            )}

            {/* 2E. SHAPES, LINES, BORDERS & SEALS (28+ Presets) */}
            {(elementSubTab === 'all' || elementSubTab === 'shapes') && (
              <div className="space-y-2.5 pt-3 border-t border-neutral-800">
                <div>
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Shapes, lines, banners & seals
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Double-click any shape or banner on canvas to type text inside it!
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {SHAPE_PRESETS.map((preset) => (
                    <button
                      key={preset.shapeType}
                      onClick={() => handleAddShape(preset)}
                      className="p-2.5 rounded-xl border border-neutral-700/80 hover:border-amber-400 bg-neutral-900/90 hover:bg-neutral-800 text-left transition flex flex-col items-center justify-between gap-2 group cursor-pointer"
                    >
                      <div className="w-full h-14 flex items-center justify-center p-1.5 bg-[#12060a] rounded-lg border border-amber-500/15 group-hover:border-amber-400/40 overflow-hidden">
                        <div className="w-20 h-10 flex items-center justify-center">
                          {renderShapeVisual({
                            id: `prev-${preset.shapeType}`,
                            type: 'shape',
                            shapeType: preset.shapeType,
                            strokeColor: '#D4AF37',
                            strokeWidth: 2,
                            fillColor: preset.fillColor || 'transparent',
                            x: 0,
                            y: 0,
                            width: 80,
                            height: 40,
                            rotation: 0,
                            opacity: 1,
                            zIndex: 1,
                          })}
                        </div>
                      </div>
                      <div className="w-full text-center">
                        <span className="text-[11px] font-bold text-amber-200 group-hover:text-amber-300 block truncate">
                          {preset.label}
                        </span>
                        <span className="text-[9px] text-neutral-400 block truncate">{preset.desc}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2F. TRADITIONAL INDIAN MOTIFS & STICKERS */}
            {(elementSubTab === 'all' || elementSubTab === 'stickers') && (
              <div className="space-y-3 pt-3 border-t border-neutral-800">
                <div>
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                    Indian Royal Motifs & Stickers
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Ganesha, Kalash, Dhol, Shehnai, Lotus & Mandap
                  </p>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={stickerSearch}
                    onChange={(e) => setStickerSearch(e.target.value)}
                    placeholder="Search Ganesha, Kalash, Diya, Lotus..."
                    className="w-full bg-neutral-800 text-xs pl-9 pr-3 py-2 rounded-lg border border-neutral-700 focus:border-amber-500 outline-none text-neutral-200 placeholder:text-neutral-500"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {STICKER_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setStickerCategory(cat.id)}
                      className={`text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg font-medium transition ${
                        stickerCategory === cat.id
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {filteredStickers.map((sticker) => (
                    <button
                      key={sticker.id}
                      onClick={() => handleAddSticker(sticker)}
                      className="p-3 rounded-xl border border-neutral-700/80 hover:border-amber-400 bg-[#12070b] hover:bg-neutral-800 flex flex-col items-center justify-center gap-2 group transition cursor-pointer shadow-md"
                      title={`Add ${sticker.name}`}
                    >
                      <div
                        className="w-14 h-14 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform [&>svg]:w-full [&>svg]:h-full drop-shadow-[0_2px_8px_rgba(212,175,55,0.25)]"
                        style={{ color: sticker.defaultColor || '#D4AF37' }}
                        dangerouslySetInnerHTML={{ __html: sticker.svg }}
                      />
                      <span className="text-[10px] font-medium text-amber-100/90 text-center truncate w-full">
                        {sticker.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
              </div>
            </details>
          </div>
        )}

        {/* ================= 3. TEXT & FONT COMBINATIONS TAB ================= */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                Invitation typography
              </h3>
              <p className="text-xs text-neutral-400">
                Add headings, curved badges, metallic gold text & Sanskrit shlokas
              </p>
            </div>

            {onOpenAiCopy && (
              <button
                onClick={onOpenAiCopy}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 via-fuchsia-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI wording & shloka</span>
              </button>
            )}

            <div className="space-y-2">
              <button
                onClick={() =>
                  handleAddText('Add a Royal Heading', "'Rozha One', serif", 30, 'bold', '#F5D77F')
                }
                className="w-full py-2.5 px-3 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-xl text-left transition font-rozha text-base text-amber-200"
              >
                + Add a Royal Heading (शीर्षक)
              </button>
              <button
                onClick={() =>
                  handleAddText('Siddharth & Ananya', "'Alex Brush', cursive", 34, 'normal', '#FFFFFF')
                }
                className="w-full py-2.5 px-3 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-xl text-left transition font-alex-brush text-xl text-neutral-100"
              >
                + Add Couple Calligraphy (वर-वधू नाम)
              </button>
              <button
                onClick={() =>
                  handleAddText(
                    'Friday, 18 December 2026 • 7:00 PM Onwards\nThe Leela Palace, Chanakyapuri, New Delhi',
                    "'Cinzel', serif",
                    12,
                    'bold',
                    '#FFF2C6'
                  )
                }
                className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-xl text-left transition text-xs text-neutral-300"
              >
                + Add Body Text / Venue Details
              </button>

              {/* Quick Curved Arch Text & Neon Glow Text Presets */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() =>
                    handleAddText('SHUBH VIVAH CEREMONY', "'Cinzel', serif", 18, 'bold', '#FFEAA7', {
                      curveRadius: 55,
                    })
                  }
                  className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 text-xs font-semibold text-amber-300 text-center"
                >
                  ⌒ Curved Arch Text
                </button>
                <button
                  onClick={() =>
                    handleAddText('ROYAL CELEBRATION', "'Cinzel', serif", 20, 'bold', '#FFF9DB', {
                      effectType: 'neon',
                      shadow: { color: '#FFD700', blur: 16, offsetX: 0, offsetY: 0 },
                    })
                  }
                  className="p-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 text-xs font-semibold text-amber-200 text-center"
                >
                  ✨ Gold Neon Text
                </button>
              </div>
            </div>

            {/* Canva Curated Font Combinations */}
            <div className="pt-2 border-t border-neutral-800 space-y-2.5">
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                Royal font pairings
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {CANVA_FONT_COMBINATIONS.map((combo, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAddFontCombo(combo)}
                    className="p-3 rounded-xl border border-neutral-700 hover:border-amber-400 bg-neutral-800/70 hover:bg-neutral-800 text-center transition space-y-0.5 group"
                  >
                    <div
                      className="text-xs font-bold tracking-widest text-amber-200"
                      style={{ fontFamily: combo.titleFont }}
                    >
                      {combo.title}
                    </div>
                    <div
                      className="text-base text-white"
                      style={{ fontFamily: combo.subFont }}
                    >
                      {combo.subtitle}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono">{combo.caption}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800">
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Traditional Auspicious Shlokas
              </h4>
              <div className="space-y-2">
                {[
                  {
                    label: 'Ganesh Vandana',
                    text: '॥ श्री गणेशाय नमः ॥',
                    font: "'Tiro Devanagari Hindi', serif",
                    size: 18,
                  },
                  {
                    label: 'Vakratunda Mahakaya',
                    text: 'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
                    font: "'Tiro Devanagari Hindi', serif",
                    size: 14,
                  },
                  {
                    label: 'Mangalam Bhagwan Vishnu',
                    text: 'मंगलम् भगवान विष्णुः मंगलम् गरुड़ध्वजः।\nमंगलम् पुण्डरीकाक्षः मंगलाय तनो हरिः॥',
                    font: "'Tiro Devanagari Hindi', serif",
                    size: 14,
                  },
                  {
                    label: 'Urdu / Royal Shayari',
                    text: 'जश्न-ए-मोहब्बत में आपकी शिरकत हमारे लिए बायस-ए-मसर्रत होगी',
                    font: "'Tiro Devanagari Hindi', serif",
                    size: 14,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      handleAddText(item.text, item.font, item.size, 'bold', '#FFEAA7')
                    }
                    className="p-2.5 rounded-xl border border-neutral-700 hover:border-amber-400 bg-neutral-800/60 hover:bg-neutral-800 cursor-pointer transition"
                  >
                    <div className="flex items-center justify-between text-[10px] text-amber-400 mb-1">
                      <span>{item.label}</span>
                      <span className="text-neutral-400">+ Click to Add</span>
                    </div>
                    <p className="text-xs text-neutral-200 whitespace-pre-line font-tiro leading-relaxed">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. CANVA BRAND HUB & CUSTOM PALETTE BUILDER TAB ================= */}
        {activeTab === 'brand' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                <span>Brand colors & fonts</span>
              </h3>
              <p className="text-xs text-neutral-400">
                1-click restyle your entire invitation card or create your family wedding monogram kit
              </p>
            </div>

            {/* Custom Family Brand Kit Builder */}
            <div className="p-3 rounded-xl bg-neutral-800/80 border border-amber-500/30 space-y-2.5 text-xs">
              <div className="font-bold text-amber-300 text-[11px] uppercase tracking-wider">
                Create Custom Family Brand Kit
              </div>
              <input
                type="text"
                value={customBrandName}
                onChange={(e) => setCustomBrandName(e.target.value)}
                placeholder="Family Brand Kit Name..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-neutral-200 outline-none"
              />
              <div className="flex items-center justify-between gap-2">
                <label className="text-[11px] text-neutral-400">Colors:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customBrandColor1}
                    onChange={(e) => setCustomBrandColor1(e.target.value)}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                    title="Primary Background"
                  />
                  <input
                    type="color"
                    value={customBrandColor2}
                    onChange={(e) => setCustomBrandColor2(e.target.value)}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                    title="Gold / Border Accent"
                  />
                  <input
                    type="color"
                    value={customBrandColor3}
                    onChange={(e) => setCustomBrandColor3(e.target.value)}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                    title="Heading Text Color"
                  />
                </div>
                <button
                  onClick={() =>
                    onApplyBrandKit &&
                    onApplyBrandKit({
                      id: `custom-${Date.now()}`,
                      name: customBrandName,
                      primaryColors: [
                        customBrandColor1,
                        customBrandColor1,
                        customBrandColor2,
                        customBrandColor3,
                        '#FFFFFF',
                      ],
                      headingFont: "'Cinzel', serif",
                      subheadingFont: "'Alex Brush', cursive",
                      bodyFont: "'Playfair Display', serif",
                    })
                  }
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-[11px]"
                >
                  Apply Custom
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {BRAND_KITS.map((kit) => (
                <div
                  key={kit.id}
                  onClick={() => onApplyBrandKit && onApplyBrandKit(kit)}
                  className="p-3 rounded-xl border border-neutral-700/80 hover:border-amber-400 bg-neutral-800/70 hover:bg-neutral-800 cursor-pointer transition space-y-2.5 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-200 group-hover:text-amber-300">
                      {kit.name}
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Shuffle className="w-3 h-3" /> Apply Theme
                    </span>
                  </div>

                  {/* Color Palette Strip */}
                  <div className="flex items-center h-7 rounded-lg overflow-hidden border border-neutral-700">
                    {kit.primaryColors.map((hex, i) => (
                      <div
                        key={i}
                        className="flex-1 h-full"
                        style={{ backgroundColor: hex }}
                        title={hex}
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-neutral-400">
                    <span style={{ fontFamily: kit.headingFont }}>
                      Heading: {kit.headingFont.split(',')[0]}
                    </span>
                    <span style={{ fontFamily: kit.subheadingFont }}>
                      Script: {kit.subheadingFont.split(',')[0]}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 5. PHOTOS & UPLOADS TAB ================= */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Uploads & Celebration Photos</h3>
              <p className="text-xs text-neutral-400">
                Upload from device or add with royal arch, heart, polaroid or circle frames
              </p>
            </div>

            <div className="space-y-2.5">
              {/* File upload */}
              <label className="w-full py-4 border-2 border-dashed border-amber-500/40 hover:border-amber-400 rounded-xl flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-amber-500/5 hover:bg-amber-500/10 transition">
                <Upload className="w-5 h-5 text-amber-400" />
                <span className="text-xs font-bold text-amber-200">Upload Photo from Device</span>
                <span className="text-[10px] text-neutral-400">Supports PNG, JPG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target?.result) {
                          const dataUrl = event.target.result as string;
                          setUploadedPhotos((prev) => [dataUrl, ...prev]);
                          handleAddPhoto(dataUrl, 'arch');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              {/* Paste URL */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customPhotoUrl}
                  onChange={(e) => setCustomPhotoUrl(e.target.value)}
                  placeholder="Or paste direct image URL..."
                  className="flex-1 bg-neutral-800 text-xs px-3 py-2 rounded-lg border border-neutral-700 focus:border-amber-500 outline-none text-neutral-200"
                />
                <button
                  onClick={() => {
                    if (customPhotoUrl) {
                      handleAddPhoto(customPhotoUrl, 'arch');
                      setCustomPhotoUrl('');
                    }
                  }}
                  className="px-3 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Uploaded Photos Gallery */}
            {uploadedPhotos.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
                  Your Uploaded Photos
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {uploadedPhotos.map((src, i) => (
                    <div
                      key={i}
                      onClick={() => handleAddPhoto(src, 'arch')}
                      className="cursor-pointer rounded-lg overflow-hidden border border-amber-500/40 hover:border-amber-400 bg-neutral-800"
                    >
                      <img src={src} alt="Uploaded" className="w-full h-24 object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sample Celebration Photos */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Royal Stock Photos & Backdrops
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    url: '/images/wedding_couple_1791965341379.jpg',
                    label: 'Wedding Couple',
                    mask: 'arch' as const,
                  },
                  {
                    url: '/images/sangeet_haldi_1791965342768.jpg',
                    label: 'Haldi & Sangeet',
                    mask: 'heart' as const,
                  },
                  {
                    url: '/images/griha_pravesh_1791965341528.jpg',
                    label: 'Griha Pravesh',
                    mask: 'rounded' as const,
                  },
                  {
                    url: '/images/baby_birthday_1791965343318.jpg',
                    label: 'Birthday Celebration',
                    mask: 'circle' as const,
                  },
                  {
                    url: '/images/royal_mandap_cover.webp',
                    label: 'Royal Mandap Art',
                    mask: 'arch' as const,
                  },
                  {
                    url: '/images/royal_vivah_peacocks.webp',
                    label: 'Peacock Palace',
                    mask: 'rounded' as const,
                  },
                ].map((sample, i) => (
                  <div
                    key={i}
                    onClick={() => handleAddPhoto(sample.url, sample.mask)}
                    className="group cursor-pointer rounded-lg overflow-hidden border border-neutral-700 hover:border-amber-400 bg-neutral-800 transition"
                  >
                    <img
                      src={sample.url}
                      alt={sample.label}
                      referrerPolicy="no-referrer"
                      className="w-full h-24 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="p-1.5 text-center text-[10px] text-neutral-300 font-medium">
                      + {sample.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 6. CANVA DRAW (FREEHAND BRUSH STUDIO) TAB ================= */}
        {activeTab === 'tools' && activeToolTab === 'draw' && drawBrush && onUpdateDrawBrush && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                  <PenTool className="w-4 h-4 text-amber-400" />
                <span>Draw (फ्रीहैंड ब्रश)</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Draw custom signatures, golden sparkles or calligraphy directly on your card
                </p>
              </div>
            </div>

            {/* Enable / Disable Draw Mode Toggle */}
            <button
              onClick={() => onUpdateDrawBrush({ isEnabled: !drawBrush.isEnabled })}
              className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md ${
                drawBrush.isEnabled
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-800 hover:bg-neutral-750 text-amber-300 border border-amber-500/40'
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>
                {drawBrush.isEnabled
                  ? 'Drawing Active on Canvas (Click to Exit)'
                  : 'Start Drawing on Card'}
              </span>
            </button>

            {/* Brush Pens Selection */}
            <div className="space-y-2">
              <span className="text-xs text-neutral-300 font-medium block">Select Brush Tool:</span>
              <div className="grid grid-cols-2 gap-2">
                {(
                  [
                    { id: 'pen', label: 'Fine Ink Pen', width: 3, opacity: 1 },
                    { id: 'glow-gold', label: 'Golden Sparkle', width: 5, opacity: 1 },
                    { id: 'calligraphy', label: 'Royal Calligraphy', width: 6, opacity: 0.95 },
                    { id: 'marker', label: 'Bold Marker', width: 10, opacity: 0.9 },
                    { id: 'highlighter', label: 'Chisel Highlighter', width: 18, opacity: 0.45 },
                    { id: 'eraser', label: 'Stroke Eraser', width: 16, opacity: 1 },
                  ] as const
                ).map((b) => (
                  <button
                    key={b.id}
                    onClick={() =>
                      onUpdateDrawBrush({
                        isEnabled: true,
                        brushType: b.id,
                        strokeWidth: b.width,
                        opacity: b.opacity,
                      })
                    }
                    className={`p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                      drawBrush.brushType === b.id
                        ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                        : 'bg-neutral-800/80 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="text-xs">{b.label}</span>
                    {b.id === 'eraser' && <Eraser className="w-3.5 h-3.5 text-rose-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Brush Color & Thickness */}
            <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300">Ink Color:</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={drawBrush.color}
                    onChange={(e) => onUpdateDrawBrush({ color: e.target.value })}
                    className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                  />
                  {['#FFD700', '#FFEAA7', '#FFFFFF', '#C41E3A', '#10B981'].map((c) => (
                    <button
                      key={c}
                      onClick={() => onUpdateDrawBrush({ color: c })}
                      className="w-5 h-5 rounded-full border border-neutral-600"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-300">Brush Size</span>
                  <span className="font-mono text-amber-300">{drawBrush.strokeWidth}px</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="32"
                  value={drawBrush.strokeWidth}
                  onChange={(e) => onUpdateDrawBrush({ strokeWidth: parseInt(e.target.value) })}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-neutral-300">Ink Opacity</span>
                  <span className="font-mono text-amber-300">
                    {Math.round(drawBrush.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={drawBrush.opacity}
                  onChange={(e) => onUpdateDrawBrush({ opacity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>

            {onClearDrawings && (
              <button
                onClick={onClearDrawings}
                className="w-full py-2 px-3 bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Drawings on Current Page</span>
              </button>
            )}
          </div>
        )}

        {/* ================= 7. CANVA PROJECTS (SAVED DESIGNS & WORKSPACE) TAB ================= */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                <FolderKanban className="w-4 h-4 text-amber-400" />
                <span>Saved projects</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Save snapshots of your invitation cards locally and switch between versions anytime
              </p>
            </div>

            {onSaveProject && (
              <button
                onClick={onSaveProject}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:brightness-110 text-neutral-950 font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
              >
                <Save className="w-4 h-4" />
                <span>Save Current Card to My Projects</span>
              </button>
            )}

            <div className="space-y-2.5">
              {savedProjects.length === 0 ? (
                <div className="p-6 rounded-xl bg-neutral-800/50 border border-neutral-800 text-center space-y-2">
                  <FolderOpen className="w-7 h-7 text-neutral-500 mx-auto" />
                  <p className="text-xs text-neutral-300 font-medium">No Saved Projects Yet</p>
                  <p className="text-[11px] text-neutral-500">
                    Click "Save Current Card to My Projects" above to store your work in browser storage.
                  </p>
                </div>
              ) : (
                savedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700 hover:border-amber-400/60 transition space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-amber-200">{proj.title}</div>
                        <div className="text-[10px] text-neutral-400 font-mono">
                          {proj.pages.length} Slides • {proj.aspectRatio} • {proj.updatedAt}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {onLoadProject && (
                          <button
                            onClick={() => onLoadProject(proj)}
                            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-lg text-[11px]"
                          >
                            Open
                          </button>
                        )}
                        {onDeleteProject && (
                          <button
                            onClick={() => onDeleteProject(proj.id)}
                            className="p-1.5 bg-neutral-900 hover:bg-rose-950 text-rose-400 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ================= 8. CANVA APPS & MAGIC STUDIO TAB ================= */}
        {activeTab === 'apps' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">
                Apps, QR & widgets
              </h3>
              <p className="text-xs text-neutral-400">
                Smart wedding tools: QR Generator, Magic Translate, Find & Replace, Countdown & Entry Pass
              </p>
            </div>

            {/* APP 1: SMART QR CODE GENERATOR (6 Modes) */}
            <div className="p-3 rounded-xl bg-neutral-800/70 border border-neutral-700 space-y-3">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <QrCode className="w-3.5 h-3.5" />
                <span>1. Smart QR Code Generator (6 Modes)</span>
              </div>

              <div className="grid grid-cols-3 rounded-lg bg-neutral-900 p-1 border border-neutral-700 gap-1">
                {(
                  [
                    { id: 'maps', label: 'Maps', icon: MapPin },
                    { id: 'rsvp', label: 'RSVP', icon: MessageSquare },
                    { id: 'upi', label: 'Shagun', icon: CreditCard },
                    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
                    { id: 'calendar', label: 'Calendar', icon: Calendar },
                    { id: 'custom', label: 'URL', icon: QrCode },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setQrType(item.id)}
                      className={`py-1.5 rounded-md text-[10px] font-medium flex items-center justify-center gap-1 transition ${
                        qrType === item.id
                          ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                          : 'text-neutral-400 hover:text-neutral-200'
                      }`}
                    >
                      <Icon className="w-3 h-3" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {qrType === 'maps' && (
                <input
                  type="text"
                  value={mapsLocation}
                  onChange={(e) => setMapsLocation(e.target.value)}
                  placeholder="Venue Name or Google Maps Link..."
                  className="w-full bg-neutral-900 text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-200"
                />
              )}

              {qrType === 'rsvp' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={rsvpPhone}
                    onChange={(e) => setRsvpPhone(e.target.value)}
                    placeholder="WhatsApp Number (+91...)"
                    className="w-full bg-neutral-900 text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-200"
                  />
                  <input
                    type="text"
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    placeholder="RSVP pre-filled message..."
                    className="w-full bg-neutral-900 text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-200"
                  />
                </div>
              )}

              {qrType === 'upi' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="UPI ID (e.g. family@okicici)"
                    className="w-full bg-neutral-900 text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-200"
                  />
                  <input
                    type="text"
                    value={upiPayee}
                    onChange={(e) => setUpiPayee(e.target.value)}
                    placeholder="Payee Family Name"
                    className="w-full bg-neutral-900 text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-200"
                  />
                </div>
              )}

              {qrType === 'wifi' && (
                <div className="space-y-2">
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Venue Wi-Fi Network Name (SSID)"
                    className="w-full bg-neutral-900 text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-200"
                  />
                  <input
                    type="text"
                    value={wifiPass}
                    onChange={(e) => setWifiPass(e.target.value)}
                    placeholder="Wi-Fi Password"
                    className="w-full bg-neutral-900 text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-200"
                  />
                </div>
              )}

              {qrType === 'calendar' && (
                <input
                  type="text"
                  value={mapsLocation}
                  onChange={(e) => setMapsLocation(e.target.value)}
                  placeholder="Event Venue for Google Calendar..."
                  className="w-full bg-neutral-900 text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-200"
                />
              )}

              {qrType === 'custom' && (
                <input
                  type="text"
                  value={customQrUrl}
                  onChange={(e) => setCustomQrUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-neutral-900 text-xs px-3 py-2 rounded-lg border border-neutral-700 text-neutral-200"
                />
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-neutral-400">Ink:</span>
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-neutral-400">Card:</span>
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-6 h-6 rounded border-0 bg-transparent cursor-pointer"
                  />
                </div>
              </div>

              <button
                onClick={handleAddQr}
                className="w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-neutral-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Generate & Insert QR Code</span>
              </button>
            </div>

            {/* APP 2: CANVA MAGIC TRANSLATE (1-Click Language Switcher) */}
            {onTranslateCard && (
              <div className="p-3 rounded-xl bg-neutral-800/70 border border-neutral-700 space-y-2.5">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" />
                  <span>Translate invitation</span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Translate common wedding phrases on the current slide into Hindi, English, or Sanskrit:
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => onTranslateCard('hindi')}
                    className="py-1.5 px-2 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-amber-200 border border-neutral-700 rounded-lg text-xs font-semibold transition"
                  >
                    🇮🇳 शुद्ध हिंदी (Hindi)
                  </button>
                  <button
                    onClick={() => onTranslateCard('english')}
                    className="py-1.5 px-2 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-amber-200 border border-neutral-700 rounded-lg text-xs font-semibold transition"
                  >
                    🇬🇧 Royal English
                  </button>
                  <button
                    onClick={() => onTranslateCard('sanskrit')}
                    className="py-1.5 px-2 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-amber-200 border border-neutral-700 rounded-lg text-xs font-semibold transition"
                  >
                    🕉️ वैदिक संस्कृत
                  </button>
                  <button
                    onClick={() => onTranslateCard('hinglish')}
                    className="py-1.5 px-2 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-amber-200 border border-neutral-700 rounded-lg text-xs font-semibold transition"
                  >
                    ✨ Modern Hinglish
                  </button>
                </div>
              </div>
            )}

            {/* APP 3: CANVA FIND & REPLACE TEXT ACROSS ALL SLIDES */}
            {onFindAndReplaceText && (
              <div className="p-3 rounded-xl bg-neutral-800/70 border border-neutral-700 space-y-2.5">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Replace className="w-3.5 h-3.5" />
                  <span>3. Find & Replace Text (All Slides)</span>
                </div>
                <input
                  type="text"
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  placeholder="Find name/word (e.g. Vikramaditya)..."
                  className="w-full bg-neutral-900 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-200"
                />
                <input
                  type="text"
                  value={replaceText}
                  onChange={(e) => setReplaceText(e.target.value)}
                  placeholder="Replace with (e.g. Siddharth)..."
                  className="w-full bg-neutral-900 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-200"
                />
                <button
                  onClick={() => {
                    if (!findText.trim()) return;
                    const count = onFindAndReplaceText(findText, replaceText);
                    setReplaceFeedback(`Updated ${count} text element(s) across all slides!`);
                    setTimeout(() => setReplaceFeedback(''), 3500);
                  }}
                  className="w-full py-1.5 px-3 bg-neutral-900 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-bold text-xs rounded-lg border border-amber-500/40 transition"
                >
                  Replace All Across {pages.length} Slides
                </button>
                {replaceFeedback && (
                  <p className="text-[11px] text-emerald-400 font-medium">{replaceFeedback}</p>
                )}
              </div>
            )}

            {/* APP 4: LIVE EVENT COUNTDOWN WIDGET */}
            <div className="p-3 rounded-xl bg-neutral-800/70 border border-neutral-700 space-y-2.5">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>4. Live Muhurat Countdown Clock</span>
              </div>
              <input
                type="text"
                value={countdownLabel}
                onChange={(e) => setCountdownLabel(e.target.value)}
                placeholder="Countdown Header Label..."
                className="w-full bg-neutral-900 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-200"
              />
              <input
                type="datetime-local"
                value={countdownDate}
                onChange={(e) => setCountdownDate(e.target.value)}
                className="w-full bg-neutral-900 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-200"
              />
              <button
                onClick={() => handleAddCountdown('royal-gold')}
                className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-bold text-xs rounded-lg border border-amber-500/40 transition"
              >
                + Insert Countdown Clock on Card
              </button>
            </div>

            {/* APP 5: BARCODE / VIP VENUE PASS GENERATOR */}
            <div className="p-3 rounded-xl bg-neutral-800/70 border border-neutral-700 space-y-2.5">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Barcode className="w-3.5 h-3.5" />
                <span>5. Royal Venue Entry Pass Barcode</span>
              </div>
              <input
                type="text"
                value={barcodeCode}
                onChange={(e) => setBarcodeCode(e.target.value)}
                placeholder="Pass Code (e.g. VIP-VIVAH-2026)"
                className="w-full bg-neutral-900 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-200"
              />
              <input
                type="text"
                value={barcodeLabel}
                onChange={(e) => setBarcodeLabel(e.target.value)}
                placeholder="Gate / Pass Label"
                className="w-full bg-neutral-900 text-xs px-3 py-1.5 rounded-lg border border-neutral-700 text-neutral-200"
              />
              <button
                onClick={handleAddBarcode}
                className="w-full py-2 px-3 bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 font-bold text-xs rounded-lg border border-amber-500/40 transition"
              >
                + Insert Scannable Venue Pass Barcode
              </button>
            </div>
          </div>
        )}

        {/* ================= 9. CANVA AUDIO & WEDDING MUSIC TAB ================= */}
        {activeTab === 'tools' && activeToolTab === 'audio' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-400" />
                <span>Wedding audio</span>
              </h3>
              <p className="text-xs text-neutral-400">
                Choose the background instrumental raga for your animated video invitation
              </p>
            </div>

            <div className="space-y-2.5">
              {AUDIO_TRACKS.map((track) => {
                const isSelected = activeAudioTrackId === track.id;
                const isPlayingThis = playingTrackId === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => onSelectAudioTrack && onSelectAudioTrack(track)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-amber-200'
                        : 'bg-neutral-800/70 border-neutral-700 hover:border-neutral-500 text-neutral-200'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold truncate">{track.name}</span>
                        {isSelected && (
                          <span className="text-[9px] bg-amber-500 text-neutral-950 font-bold px-1.5 py-0.2 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{track.description}</p>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        previewTrackAudio(track);
                      }}
                      className="p-2 rounded-full bg-neutral-900 hover:bg-amber-500 text-amber-300 hover:text-neutral-950 border border-neutral-700 transition shrink-0"
                      title="Preview Audio Raga"
                    >
                      {isPlayingThis ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Volume2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 10. BACKGROUNDS & PAPER TAB ================= */}
        {activeTab === 'tools' && activeToolTab === 'backgrounds' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Card Background & Paper</h3>
              <p className="text-xs text-neutral-400">
                Custom solid color, luxury gradients, or upload full-page background
              </p>
            </div>

            {/* Custom Solid Color & Upload Background Image */}
            <div className="p-3 rounded-xl bg-neutral-800/80 border border-neutral-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-neutral-200">Custom Solid Color:</span>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customSolidBg}
                    onChange={(e) => {
                      setCustomSolidBg(e.target.value);
                      onSetBackground('color', e.target.value);
                    }}
                    className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
                  />
                  <span className="text-xs font-mono text-amber-300">{customSolidBg}</span>
                </div>
              </div>

              <label className="w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-850 border border-neutral-700 hover:border-amber-400 rounded-lg flex items-center justify-center gap-2 cursor-pointer text-xs font-medium text-amber-300 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Custom Background Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        if (ev.target?.result) {
                          onSetBackground('image', ev.target.result as string);
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>

            {/* Curated Gradients */}
            <div>
              <h4 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Royal Gradients & Velvet Papers
              </h4>
              <div className="grid grid-cols-2 gap-2.5">
                {BACKGROUNDS.map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => onSetBackground(bg.type, bg.value)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between h-20 relative overflow-hidden group ${
                      activeBackground === bg.value
                        ? 'border-amber-400 ring-2 ring-amber-400/30'
                        : 'border-neutral-700/80 hover:border-neutral-500'
                    }`}
                    style={{ background: bg.value }}
                  >
                    <span className="text-[11px] font-semibold text-neutral-100 drop-shadow-md z-10">
                      {bg.name}
                    </span>
                    <span className="text-[9px] text-amber-200/90 font-mono capitalize z-10">
                      {bg.category}
                    </span>
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tools' && activeToolTab === 'guides' && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Canvas guides</h3>
              <p className="text-xs text-neutral-400">Optional alignment and print-safe overlays</p>
            </div>
            <button
              type="button"
              onClick={onToggleRulers}
              className={`w-full rounded-xl border p-3 text-left flex items-center justify-between gap-3 transition ${showRulers ? 'border-amber-400/60 bg-amber-500/10 text-amber-200' : 'border-neutral-700 bg-neutral-800/70 text-neutral-200 hover:border-neutral-500'}`}
            >
              <span className="flex items-center gap-2 text-xs font-medium"><Ruler className="w-4 h-4 text-amber-400" />Rulers and alignment lines</span>
              <span className="text-[10px] text-neutral-400">{showRulers ? 'On' : 'Off'}</span>
            </button>
            <button
              type="button"
              onClick={onToggleSafeZones}
              className={`w-full rounded-xl border p-3 text-left flex items-center justify-between gap-3 transition ${showSafeZones ? 'border-amber-400/60 bg-amber-500/10 text-amber-200' : 'border-neutral-700 bg-neutral-800/70 text-neutral-200 hover:border-neutral-500'}`}
            >
              <span className="flex items-center gap-2 text-xs font-medium"><Grid className="w-4 h-4 text-amber-400" />Print-safe margins</span>
              <span className="text-[10px] text-neutral-400">{showSafeZones ? 'On' : 'Off'}</span>
            </button>
          </div>
        )}

        {/* ================= 11. CANVA LAYERS & POSITION TAB ================= */}
        {activeTab === 'tools' && activeToolTab === 'layers' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-400" />
                  <span>Canvas Layers ({currentPage?.elements.length || 0})</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  Select, reorder, lock, hide or delete any layer
                </p>
              </div>
            </div>

            <div className="space-y-2">
              {[...(currentPage?.elements || [])]
                .sort((a, b) => (b.zIndex || 1) - (a.zIndex || 1))
                .map((el) => {
                  const isSelected = el.id === selectedElementId;
                  return (
                    <div
                      key={el.id}
                      onClick={() => onSelectElement(el.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-400 text-amber-200'
                          : 'bg-neutral-800/70 border-neutral-700/70 hover:border-neutral-600 text-neutral-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-neutral-900 text-amber-400 border border-neutral-700 shrink-0">
                          {el.type}
                        </span>
                        <span
                          className={`text-xs truncate ${
                            el.hidden ? 'line-through text-neutral-500' : ''
                          }`}
                        >
                          {getElementLabel(el)}
                        </span>
                      </div>

                      <div
                        className="flex items-center gap-1 shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() =>
                            onUpdateElement(el.id, { zIndex: (el.zIndex || 1) + 1 }, true)
                          }
                          className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
                          title="Bring Forward"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() =>
                            onUpdateElement(
                              el.id,
                              { zIndex: Math.max(1, (el.zIndex || 1) - 1) },
                              true
                            )
                          }
                          className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
                          title="Send Backward"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onUpdateElement(el.id, { locked: !el.locked }, true)}
                          className={`p-1 rounded ${
                            el.locked
                              ? 'text-rose-400 bg-rose-500/10'
                              : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                          }`}
                          title={el.locked ? 'Unlock Layer' : 'Lock Layer'}
                        >
                          {el.locked ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onUpdateElement(el.id, { hidden: !el.hidden }, true)}
                          className={`p-1 rounded ${
                            el.hidden
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-neutral-400 hover:text-white hover:bg-neutral-700'
                          }`}
                          title={el.hidden ? 'Show Layer' : 'Hide Layer'}
                        >
                          {el.hidden ? (
                            <EyeOff className="w-3.5 h-3.5" />
                          ) : (
                            <Eye className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => onDuplicateElementById(el.id)}
                          className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
                          title="Duplicate Layer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteElementById(el.id)}
                          className="p-1 hover:bg-rose-950 rounded text-rose-400"
                          title="Delete Layer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* ================= 12. VIDEO SLIDES TIMELINE TAB ================= */}
        {activeTab === 'slides' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-amber-400" />
                  <span>Multi-Page / Video Slides</span>
                </h3>
                <p className="text-xs text-neutral-400">
                  {pages.length} Slides ({totalDuration}s Video Sequence)
                </p>
              </div>

              <button
                onClick={onAddPage}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 rounded-lg text-xs font-medium transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Page</span>
              </button>
            </div>

            <button
              onClick={onOpenVideoPreview}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all"
            >
              <Play className="w-4 h-4 fill-neutral-950 text-neutral-950" />
              <span>Play Animated Video Sequence</span>
            </button>

            <div className="space-y-3 pt-2">
              {pages.map((page, index) => {
                const isActive = index === currentPageIndex;
                const slideImg = getSlideImage(page);
                const headline = getSlideHeadline(page);

                return (
                  <div
                    key={page.id || index}
                    onClick={() => onSelectPage(index)}
                    className={`group relative flex flex-col rounded-xl p-3 cursor-pointer transition-all duration-200 ${
                      isActive
                        ? 'bg-amber-950/40 border-2 border-amber-400 ring-2 ring-amber-400/30 shadow-xl'
                        : 'bg-neutral-800/60 border border-neutral-700/60 hover:border-neutral-500 hover:bg-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span
                        className={`font-bold flex items-center gap-1.5 ${
                          isActive ? 'text-amber-300' : 'text-neutral-200'
                        }`}
                      >
                        <span>Page {index + 1}</span>
                        {isActive && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
                        )}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400 bg-neutral-900/80 px-2 py-0.5 rounded border border-neutral-700/50">
                        {page.duration || 4.5}s
                      </span>
                    </div>

                    <div
                      className="relative w-full h-28 rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-inner flex flex-col justify-between p-2"
                      style={{ background: page.backgroundValue || '#171717' }}
                    >
                      {slideImg ? (
                        <img
                          src={slideImg}
                          alt={`Slide ${index + 1}`}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-xs text-amber-200/70 font-serif">
                          {headline}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />
                      <div className="relative z-10 text-center mt-auto">
                        <p className="text-xs font-semibold text-amber-100 truncate px-1 drop-shadow-md">
                          {page.title || headline}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-neutral-700/50 text-xs">
                      <div className="flex items-center gap-1">
                        {onMovePage && index > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMovePage(index, index - 1);
                            }}
                            className="p-1 rounded bg-neutral-800 hover:bg-amber-500 text-neutral-300 hover:text-neutral-950 transition"
                            title="Move Slide Up"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {onMovePage && index < pages.length - 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onMovePage(index, index + 1);
                            }}
                            className="p-1 rounded bg-neutral-800 hover:bg-amber-500 text-neutral-300 hover:text-neutral-950 transition"
                            title="Move Slide Down"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        {onDuplicatePage && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicatePage(index);
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 hover:bg-amber-500 text-neutral-300 hover:text-neutral-950 transition text-[11px]"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </button>
                        )}

                        {pages.length > 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeletePage(index);
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-neutral-800 hover:bg-rose-500 text-neutral-300 hover:text-white transition text-[11px]"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>
    );
  }
};
