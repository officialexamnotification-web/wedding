import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  MapPin, 
  Share2, 
  QrCode, 
  Palette, 
  Star, 
  Heart, 
  ArrowRight, 
  Printer, 
  ShieldCheck, 
  HelpCircle,
  Maximize2,
  Play,
  Edit3,
  LayoutTemplate,
  Send,
  Crown,
  Check,
  Gem,
  Compass,
  Award,
  Layers,
  Wand2,
  Languages,
  Music,
  Film,
  Image as ImageIcon,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Eye
} from 'lucide-react';
import {
  CardTemplate,
  CardPage,
  CANVAS_SIZES,
  ImageElement,
  FrameElement,
  ShapeElement,
  StickerElement,
  TextElement,
  QrElement,
  DrawingElement,
  TableElement,
  ChartElement,
  GridElement,
  CountdownElement,
  BarcodeElement,
} from '../types/editor';
import { INITIAL_TEMPLATES, TEMPLATE_CATEGORIES } from '../data/templates';
import { BlankDesignOptions, CreateDesignModal } from './CreateDesignModal';
import {
  getImageCssFilter,
  getImageMaskStyle,
  renderShapeVisual,
  renderTextVisual,
  renderTableVisual,
  renderChartVisual,
  renderGridVisual,
  renderCountdownVisual,
  renderBarcodeVisual,
  renderFrameVisual,
} from './Canvas';

interface HomepageProps {
  onOpenEditorWithTemplate: (template: CardTemplate, targetSlideIndex?: number) => void;
  onOpenBlankEditor: (options: BlankDesignOptions) => void;
  onOpenPrintExport: (template: CardTemplate) => void;
  onOpenAnalysis?: () => void;
  onOpenVideoCard: (template?: CardTemplate) => void;
}

/* Bespoke Royal Gold SVG Icons for Luxury Aesthetic */
const RoyalDiyaIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2C10.5 4.5 9.5 6.5 9.5 8.2C9.5 9.8 10.6 11 12 11C13.4 11 14.5 9.8 14.5 8.2C14.5 6.5 13.5 4.5 12 2Z" />
    <path d="M4 14H20C19.2 18.2 16 21 12 21C8 21 4.8 18.2 4 14Z" />
    <path d="M2 14H22" />
  </svg>
);

const RoyalKalashIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 2C13.5 4 14 5.5 12 7C10 5.5 10.5 4 12 2Z" />
    <path d="M7 8C7 6.5 9.5 6 12 6C14.5 6 17 6.5 17 8C17 9 15 10 15 10H9C9 10 7 9 7 8Z" />
    <path d="M8.5 10C6.5 12 6 15.5 7.5 18.5C8.5 20.2 10 21 12 21C14 21 15.5 20.2 16.5 18.5C18 15.5 17.5 12 15.5 10" />
    <path d="M8 21H16" />
  </svg>
);

const RoyalArchIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 21V11C4 6.5 7.8 3 12 2C16.2 3 20 6.5 20 11V21" />
    <path d="M8 21V12C8 9.2 9.8 7 12 6.2C14.2 7 16 9.2 16 12V21" />
    <path d="M2 21H22" />
  </svg>
);

const RoyalLotusIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 4C9.5 7.5 8.5 11.5 12 16C15.5 11.5 14.5 7.5 12 4Z" />
    <path d="M12 16C8 15 5 12 4 8C7.5 8.5 10 11 12 16Z" />
    <path d="M12 16C16 15 19 12 20 8C16.5 8.5 14 11 12 16Z" />
    <path d="M5 19C8.5 17.5 15.5 17.5 19 19" />
  </svg>
);

/* Curated Luxury Metadata for each Signature Suite */
const SUITE_SHOWCASE_META: Record<
  string,
  {
    cleanTitle: string;
    hindiSubtitle: string;
    editionTag: string;
    coupleOrHighlight: string;
    venueOrDetail: string;
    palette: string[];
  }
> = {
  'royal-marigold-hour-wedding-story': {
    cleanTitle: 'The Marigold Hour',
    hindiSubtitle: 'राजसी पाँच-पृष्ठ विवाह कहानी',
    editionTag: '5-Slide Music Story',
    coupleOrHighlight: 'Aarav & Meera',
    venueOrDetail: 'Five distinct instrumental cues',
    palette: ['#501326', '#D5B263', '#FFF3D5', '#17070D'],
  },
  'royal-lakeside-wedding': {
    cleanTitle: 'Royal Lakeside Palace Suite',
    hindiSubtitle: 'शाही उदयपुर लेक पैलेस विवाह निमंत्रण',
    editionTag: '5-Slide Royal Suite',
    coupleOrHighlight: 'Siddharth & Ananya',
    venueOrDetail: 'The Jagmandir Island Palace, Udaipur',
    palette: ['#5A0E1A', '#D4AF37', '#FDFBF7', '#0F1424'],
  },
  'golden-mandap-wedding': {
    cleanTitle: 'Swarna Mandap Heritage Suite',
    hindiSubtitle: 'स्वर्ण मंडप एवं राजसी विवाह समारोह',
    editionTag: '5-Slide Royal Suite',
    coupleOrHighlight: 'Aarav & Meera',
    venueOrDetail: 'The Leela Palace, Udaipur',
    palette: ['#7C1926', '#E5C158', '#FDF8EE', '#3B2314'],
  },
  'royal-indian-video-wedding': {
    cleanTitle: 'Umaid Marwar Palace Vivah',
    hindiSubtitle: 'जोधपुर राजवाड़ा शाही विवाह निमंत्रण',
    editionTag: '5-Slide Video Suite',
    coupleOrHighlight: 'Sumaiya & Kabir',
    venueOrDetail: 'Umaid Bhawan Palace, Jodhpur',
    palette: ['#260309', '#F5D77F', '#800020', '#3D1F05'],
  },
  'grand-mandap-royal-video-wedding': {
    cleanTitle: 'Rajvilas Vedic Mandap Suite',
    hindiSubtitle: 'वैदिक मंत्रोच्चार एवं सप्तपदी विवाह',
    editionTag: '6-Slide Grand Suite',
    coupleOrHighlight: 'Kabir & Sumaiya',
    venueOrDetail: 'The Oberoi Rajvilas Palace, Jaipur',
    palette: ['#380A0F', '#FFD700', '#5E0B15', '#FFF4D6'],
  },
  'royal-rajasthani-wedding': {
    cleanTitle: 'Rambagh Crimson Foil Card',
    hindiSubtitle: 'पारंपरिक राजस्थानी शुभ विवाह पत्रिका',
    editionTag: 'Heirloom Print & Digital',
    coupleOrHighlight: 'Vikramaditya & Ananya',
    venueOrDetail: 'The Rambagh Palace, Jaipur',
    palette: ['#630C1D', '#D4AF37', '#1F0107', '#FFF3A8'],
  },
  'emerald-luxury-wedding': {
    cleanTitle: 'Emerald Velvet Botanical Card',
    hindiSubtitle: 'पन्ना मखमली शाही विवाह निमंत्रण',
    editionTag: 'Couture Portrait Edition',
    coupleOrHighlight: 'Arjun & Meera',
    venueOrDetail: 'Taj Falaknuma Palace, Hyderabad',
    palette: ['#0D3826', '#D4AF37', '#02120B', '#F5E6C8'],
  },
  'shubh-griha-pravesh': {
    cleanTitle: 'Manglik Kalash Griha Pravesh',
    hindiSubtitle: 'शुभ गृह प्रवेश एवं वास्तु शांति पूजा',
    editionTag: 'Sacred Pooja Edition',
    coupleOrHighlight: 'Shivam Residency • Sharma Family',
    venueOrDetail: 'Vastu Puja, Havan & Swaruchiabhoj',
    palette: ['#451A03', '#F59E0B', '#150601', '#FEF3C7'],
  },
  'sangeet-mehendi-festive': {
    cleanTitle: 'Mehfil-e-Sangeet & Mehendi',
    hindiSubtitle: 'संगीत संध्या, ढोल एवं मेहंदी उत्सव',
    editionTag: 'Festive Gala Card',
    coupleOrHighlight: 'Rohan & Simran',
    venueOrDetail: 'Mehendi Rasam & Royal Sangeet Night',
    palette: ['#663D00', '#FFD700', '#1F1200', '#FDE68A'],
  },
  'first-birthday-celebration': {
    cleanTitle: 'Celestial Star 1st Birthday',
    hindiSubtitle: 'प्रथम जन्मदिन उत्सव निमंत्रण',
    editionTag: 'Milestone Celebration',
    coupleOrHighlight: "Aarav's 1st Birthday Gala",
    venueOrDetail: 'Evening Cake, Music & Grand Feast',
    palette: ['#1E1B4B', '#FBBF24', '#0F172A', '#E0E7FF'],
  },
};

/* True Scaled Miniature Artwork Renderer — Renders the actual invitation slide with real fonts, shlokas, frames, and QR */
const MiniCardArtwork: React.FC<{
  page: CardPage;
  aspectRatio: CardTemplate['aspectRatio'];
  targetWidth?: number;
  maxHeight?: number;
}> = ({ page, aspectRatio, targetWidth = 240, maxHeight = 280 }) => {
  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];
  const scale = Math.min(targetWidth / dimensions.width, maxHeight / dimensions.height);
  const renderedWidth = Math.round(dimensions.width * scale);
  const targetHeight = Math.round(dimensions.height * scale);

  return (
    <div
      className="relative overflow-hidden rounded-[18px] shadow-[0_20px_50px_rgba(0,0,0,0.85)] border border-amber-400/40 select-none pointer-events-none shrink-0"
      style={{
        width: `${renderedWidth}px`,
        height: `${targetHeight}px`,
        background: page.backgroundValue,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        {[...page.elements]
          .filter((el) => !el.hidden)
          .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
          .map((elem) => {
            const flipTransform = `${elem.flipX ? ' scaleX(-1)' : ''}${
              elem.flipY ? ' scaleY(-1)' : ''
            }`;
            return (
              <div
                key={elem.id}
                style={{
                  position: 'absolute',
                  left: `${elem.x}px`,
                  top: `${elem.y}px`,
                  width: `${elem.width}px`,
                  height: `${elem.height}px`,
                  transform: `rotate(${elem.rotation || 0}deg)${flipTransform}`,
                  opacity: elem.opacity,
                  zIndex: elem.zIndex,
                  mixBlendMode: elem.blendMode || 'normal',
                }}
              >
                {elem.type === 'text' && (
                  <div className="w-full h-full flex flex-col justify-center">
                    {renderTextVisual(elem as TextElement)}
                  </div>
                )}
                {elem.type === 'sticker' && (
                  <div
                    className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                    style={{ color: (elem as StickerElement).color }}
                    dangerouslySetInnerHTML={{
                      __html: (elem as StickerElement).svgContent,
                    }}
                  />
                )}
                {elem.type === 'shape' && renderShapeVisual(elem as ShapeElement)}
                {elem.type === 'table' && renderTableVisual(elem as TableElement)}
                {elem.type === 'chart' && renderChartVisual(elem as ChartElement)}
                {elem.type === 'grid' && renderGridVisual(elem as GridElement)}
                {elem.type === 'countdown' && renderCountdownVisual(elem as CountdownElement)}
                {elem.type === 'barcode' && renderBarcodeVisual(elem as BarcodeElement)}
                {elem.type === 'drawing' && (
                  <svg
                    viewBox={`0 0 ${
                      (elem as DrawingElement).viewBoxWidth || dimensions.width
                    } ${(elem as DrawingElement).viewBoxHeight || dimensions.height}`}
                    className="w-full h-full pointer-events-none overflow-visible"
                  >
                    {(elem as DrawingElement).paths.map((p, idx) => (
                      <path
                        key={idx}
                        d={p.d}
                        fill="none"
                        stroke={p.color}
                        strokeWidth={p.strokeWidth}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        opacity={p.opacity}
                      />
                    ))}
                  </svg>
                )}
                {elem.type === 'frame' && renderFrameVisual(elem as FrameElement)}
                {elem.type === 'image' && (
                  <div
                    className="w-full h-full overflow-hidden relative"
                    style={{
                      ...getImageMaskStyle(elem as ImageElement),
                backgroundColor: (elem as ImageElement).objectFit === 'contain' ? '#2b111a' : undefined,
                      borderWidth: `${(elem as ImageElement).borderWidth || 0}px`,
                      borderColor: (elem as ImageElement).borderColor || '#D4AF37',
                      borderStyle: 'solid',
                      filter: getImageCssFilter(elem as ImageElement),
                    }}
                  >
                    {(elem as ImageElement).objectFit === 'contain' && (
                      <img
                        src={(elem as ImageElement).src}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-0 w-full h-full pointer-events-none"
                        style={{ objectFit: 'cover', filter: 'blur(14px) brightness(0.62)', transform: 'scale(1.08)' }}
                      />
                    )}
                    <img
                      src={(elem as ImageElement).src}
                      alt={(elem as ImageElement).alt || 'Invitation Artwork'}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                      style={{
                        objectFit: (elem as ImageElement).objectFit || 'cover',
                        transform: `scale(${
                          (elem as ImageElement).scale || 1
                        }) translate(${(elem as ImageElement).offsetX || 0}%, ${
                          (elem as ImageElement).offsetY || 0
                        }%) rotate(${(elem as ImageElement).rotationInside || 0}deg)`,
                      }}
                    />
                  </div>
                )}
                {elem.type === 'qr' && (
                  <div
                    className="w-full h-full p-2 rounded-lg shadow-md border border-amber-500/50 flex flex-col items-center justify-center"
                    style={{
                      backgroundColor: (elem as QrElement).backgroundColor || '#FFF4D6',
                    }}
                  >
                    {(elem as QrElement).dataUrl ? (
                      <img
                        src={(elem as QrElement).dataUrl}
                        alt="QR Code"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <QrCode
                        className="w-full h-full"
                        style={{ color: (elem as QrElement).color || '#1c0308' }}
                      />
                    )}
                  </div>
                )}
              </div>
            );
          })}
      </div>
      {/* Subtle 24K Gold Inner Hairline on Card */}
      <div className="absolute inset-1.5 rounded-[13px] border border-amber-300/25 pointer-events-none z-30" />
    </div>
  );
};

const HOMEPAGE_FEATURED_COUNT = 12;
type StudioIntent = Pick<BlankDesignOptions, 'initialSidebarTab' | 'initialElementSubTab'>;

export const Homepage: React.FC<HomepageProps> = ({
  onOpenEditorWithTemplate,
  onOpenBlankEditor,
  onOpenPrintExport,
  onOpenVideoCard,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<CardTemplate | null>(null);
  const [previewSlideIdx, setPreviewSlideIdx] = useState<number>(0);
  const [isCreateDesignOpen, setIsCreateDesignOpen] = useState(false);
  const [studioIntent, setStudioIntent] = useState<StudioIntent>({});
  // Per-card active slide index in the Signature Collection grid
  const [activeCardSlides, setActiveCardSlides] = useState<Record<string, number>>({});

  const openCreateDesign = (intent: StudioIntent = {}) => {
    setStudioIntent(intent);
    setIsCreateDesignOpen(true);
  };
  const createBlankDesign = (options: BlankDesignOptions) => {
    setIsCreateDesignOpen(false);
    onOpenBlankEditor({ ...options, ...studioIntent });
    setStudioIntent({});
  };
  const openAtelierFeature = (intent: StudioIntent) => {
    onOpenBlankEditor({
      aspectRatio: 'portrait-story',
      backgroundColor: '#FFF8EA',
      occasion: 'wedding',
      themeName: 'Ivory & Gold',
      ...intent,
    });
  };

  // Circular Categories with real event photography & bespoke vector icons
  const HOME_CATEGORIES = [
    { 
      id: 'wedding', 
      name: 'Shubh Vivah', 
      hindi: 'शुभ विवाह निमंत्रण',
      icon: Crown, 
      image: '/images/photo-library/wedding-palace-stairs-02.webp',
      count: `${INITIAL_TEMPLATES.filter((template) => template.category === 'wedding').length} Royal Designs`,
    },
    { 
      id: 'housewarming', 
      name: 'Griha Pravesh', 
      hindi: 'गृह प्रवेश एवं वास्तु पूजा',
      icon: RoyalKalashIcon, 
      image: '/images/photo-library/home-courtyard-kalash-02.webp',
      count: `${INITIAL_TEMPLATES.filter((template) => template.category === 'housewarming').length} Sacred Designs`,
    },
    { 
      id: 'sangeet-mehendi', 
      name: 'Sangeet & Haldi', 
      hindi: 'संगीत, हल्दी व मेहंदी',
      icon: Music, 
      image: '/images/photo-library/sangeet-genda-evening-06.webp',
      count: `${INITIAL_TEMPLATES.filter((template) => template.category === 'sangeet-mehendi').length} Festive Designs`,
    },
    { 
      id: 'birthday', 
      name: 'Birthday Celebration', 
      hindi: 'जन्मदिन उत्सव',
      icon: Sparkles, 
      image: '/images/photo-library/birthday-little-star-08.webp',
      count: `${INITIAL_TEMPLATES.filter((template) => template.category === 'birthday').length} Luxe Designs`,
    },
    { 
      id: 'baby-shower', 
      name: 'Godh Bharai', 
      hindi: 'गोद भराई एवं नामकरण',
      icon: Heart, 
      image: '/images/photo-library/godh-bloom-portrait-01.webp',
      count: `${INITIAL_TEMPLATES.filter((template) => template.category === 'baby-shower').length} Pastel Designs`,
    },
    { 
      id: 'anniversary', 
      name: 'Royal Anniversary', 
      hindi: 'विवाह वर्षगांठ',
      icon: Gem, 
      image: '/images/photo-library/anniversary-evergreen-together-07.webp',
      count: `${INITIAL_TEMPLATES.filter((template) => template.category === 'anniversary').length} Jubilee Designs`,
    },
  ];

  // Filter templates
  const filteredTemplates = INITIAL_TEMPLATES.filter((t) => {
    const isPhotoFrame = t.tags.some((tag) => tag.toLowerCase().includes('photo frame'));
    const matchesCat = selectedCategory === 'all'
      || (selectedCategory === 'photo-frames' ? isPhotoFrame : t.category === selectedCategory);
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });
  const isFeaturedHomeView = selectedCategory === 'all' && !searchQuery.trim() && !showAllTemplates;
  const visibleTemplates = isFeaturedHomeView
    ? filteredTemplates.slice(0, HOMEPAGE_FEATURED_COUNT)
    : filteredTemplates;

  const scrollToCatalog = (category?: string) => {
    if (category) setSelectedCategory(category);
    const elem = document.getElementById('template-catalog');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080608] text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* 1. TOP IMPERIAL RIBBON BAR */}
      <div className="bg-gradient-to-r from-[#1a070c] via-[#2c0c15] to-[#1a070c] text-amber-200/90 text-[11px] py-2 px-4 text-center border-b border-amber-500/25 flex items-center justify-center gap-2.5 tracking-wide">
        <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-cinzel font-bold text-amber-300 tracking-wider uppercase">
          NIMANTRAN ATELIER
        </span>
        <span className="text-amber-500/50">•</span>
        <span className="hidden sm:inline text-neutral-300">
          Bespoke Indian Digital Invitations & Multi-Slide Video Suites • High-Resolution Digital Exports
        </span>
        <span className="sm:hidden text-neutral-300">
          Royal Digital Cards & Multi-Slide Video Suites
        </span>
      </div>

      {/* 2. HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#0b080b]/90 backdrop-blur-xl border-b border-amber-500/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand Crest & Logo */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="brand-logo-badge w-11 h-11 rounded-xl p-[1.5px] bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-[10px] bg-[#14070b] flex items-center justify-center overflow-visible">
                <span className="font-tiro brand-mark-shine inline-flex h-full w-full items-center justify-center text-[24px] font-bold leading-none translate-y-px">नि</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-cinzel font-bold text-amber-100 text-lg sm:text-xl tracking-[0.14em]">
                  NIMANTRAN
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[9px] text-amber-300 font-semibold tracking-widest uppercase px-2 py-0.5 bg-amber-500/10 rounded-full border border-amber-400/30">
                  <Gem className="w-2.5 h-2.5 text-amber-400" />
                  ROYALE
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 tracking-wider uppercase font-medium">
                Couture Digital Invitations
              </p>
            </div>
          </div>

          {/* Search bar in header */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <Search className="w-4 h-4 text-amber-400/70 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Palace Vivah, Griha Pravesh, Sangeet, Birthday..."
              className="w-full bg-neutral-900/90 text-xs pl-10 pr-4 py-2.5 rounded-full border border-neutral-800 hover:border-amber-500/40 focus:border-amber-400 outline-none text-neutral-100 placeholder:text-neutral-500 transition"
            />
          </div>

          {/* Navigation Links & Action */}
          <div className="flex items-center gap-3">
            <nav className="hidden lg:flex items-center gap-6 text-xs text-neutral-300 font-medium">
              <button 
                onClick={() => scrollToCatalog('wedding')}
                className="hover:text-amber-300 transition cursor-pointer"
              >
                Shubh Vivah
              </button>
              <button 
                onClick={() => scrollToCatalog('housewarming')}
                className="hover:text-amber-300 transition cursor-pointer"
              >
                Griha Pravesh
              </button>
              <button 
                onClick={() => scrollToCatalog('sangeet-mehendi')}
                className="hover:text-amber-300 transition cursor-pointer"
              >
                Sangeet & Haldi
              </button>
              <button 
                onClick={() => onOpenVideoCard(INITIAL_TEMPLATES[0])}
                className="text-amber-300/90 hover:text-amber-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>Video Suites</span>
              </button>
            </nav>

            <button
              onClick={() => openCreateDesign()}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center gap-2 cursor-pointer"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Design Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 bg-gradient-to-b from-[#13090e] via-[#090709] to-[#080608] border-b border-amber-500/15">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Hero Left Copy */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <RoyalLotusIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>भारत का प्रीमियम राजसी डिजिटल निमंत्रण स्टूडियो</span>
            </div>

            <h1 className="max-w-2xl mx-auto lg:mx-0 font-cinzel text-4xl sm:text-5xl lg:text-[3.45rem] font-semibold text-neutral-100 tracking-wide leading-[1.18]">
              A Royal Invitation<br />
              <span className="gold-text-gradient">Made Timeless</span>
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Thoughtfully designed for your most cherished celebrations. Personalize in Hindi or English, add a <strong className="text-amber-300">Google Maps venue QR</strong>, and share a beautifully finished invitation with family and friends.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onOpenVideoCard(INITIAL_TEMPLATES[0])}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-neutral-950 text-neutral-950" />
                <span>Play 5-Slide Royal Video Suite</span>
              </button>

              <button
                onClick={() => scrollToCatalog()}
                className="w-full sm:w-auto px-5 py-3.5 bg-neutral-900 hover:bg-neutral-800 border border-amber-500/30 hover:border-amber-400/70 text-amber-100 font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Explore Collection</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>

              <button
                onClick={() => openCreateDesign()}
                className="w-full sm:w-auto px-5 py-3.5 bg-neutral-900/70 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-medium text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Custom Canvas</span>
              </button>
            </div>

            {/* Social Proof */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-4 text-xs text-neutral-400 border-t border-neutral-800/80">
              <div className="flex items-center text-amber-400 gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <span><strong className="text-neutral-200">4.9/5 Rating</strong> • Trusted by 250,000+ Families Across India & Abroad</span>
            </div>
          </div>

          {/* Hero Right Visual: Real Photograph & Interactive Invitation Card */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none flex flex-col sm:flex-row items-center justify-center gap-4 relative">
            {/* Real Photograph Flatlay Card */}
            <div className="hidden sm:block w-64 h-[420px] rounded-3xl overflow-hidden border border-amber-500/25 shadow-2xl relative group rotate-[-3deg] hover:rotate-0 transition-transform duration-300 will-change-transform">
              <img
                src="/images/invitation_hero_1791965343981.jpg"
                alt="Luxury Royal Indian Invitation Cards Flatlay"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4">
                <span className="text-[11px] font-medium text-amber-200 flex items-center gap-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-400" />
                  <span>24K Gold Foil & Velvet Aesthetics</span>
                </span>
              </div>
            </div>

            {/* Interactive Customizable Card */}
            <div 
              onClick={() => onOpenEditorWithTemplate(INITIAL_TEMPLATES[0])}
              className="cursor-pointer group relative w-72 sm:w-80 h-[460px] rounded-3xl p-5 shadow-2xl border-2 border-amber-500/50 rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-10 overflow-hidden will-change-transform"
              style={{ background: INITIAL_TEMPLATES[0].pages[0].backgroundValue }}
            >
              {/* Background Cover Image (WebP) */}
              <img
                src="/wedding/Royal Lakeside Wedding Invitation/Royal Lakeside Wedding Invitation-1.webp"
                alt="Royal Lakeside Wedding Invitation Cover"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60 pointer-events-none" />

              {/* Gold foil edge glow */}
              <div className="absolute inset-2.5 border border-amber-400/40 rounded-2xl pointer-events-none z-10" />

              <div className="h-full flex flex-col justify-between text-center relative z-10">
                <div>
                  <div className="font-tiro text-amber-200 text-sm tracking-widest">
                    || श्री गणेशाय नमः ||
                  </div>
                  <div className="font-playfair italic text-neutral-300 text-xs mt-2 uppercase tracking-widest">
                    Together with their families
                  </div>
                  <div className="font-rozha text-amber-100 text-3xl font-bold mt-2">
                    Vikramaditya
                  </div>
                  <div className="font-alex-brush text-amber-400 text-2xl">
                    weds
                  </div>
                  <div className="font-rozha text-amber-100 text-3xl font-bold">
                    Ananya
                  </div>
                </div>

                <div className="py-2">
                  <div className="font-cinzel text-amber-200 text-xs font-bold tracking-widest">
                    FRIDAY, 18 DECEMBER 2026
                  </div>
                  <div className="text-[11px] text-neutral-300 mt-1">
                    The Rambagh Palace, Jaipur
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-18 h-18 p-1.5 bg-[#FFF4D6] rounded-lg shadow-lg border border-amber-500/50 flex items-center justify-center">
                    <QrCode className="w-full h-full text-neutral-900" />
                  </div>
                  <span className="text-[9px] text-amber-300 font-semibold tracking-wider mt-1">
                    SCAN FOR GOOGLE MAPS VENUE
                  </span>
                </div>

                {/* Hover button overlay */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 bg-black/65 rounded-3xl backdrop-blur-xs flex items-center justify-center p-4">
                  <span className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 font-bold text-xs rounded-xl shadow-xl flex items-center gap-1.5">
                    <Palette className="w-4 h-4" />
                    Personalize This Suite →
                  </span>
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute top-3 right-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1 z-20">
                <Crown className="w-2.5 h-2.5 fill-neutral-950" />
                <span>Royal Edition</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ROYAL CELEBRATION SUITES (Categories Grid with Luxury Icons) */}
      <section className="py-14 px-4 sm:px-6 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 text-[11px] font-cinzel font-bold text-amber-400 tracking-[0.2em] uppercase">
            <Gem className="w-3.5 h-3.5" />
            <span>Curated Collections</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-neutral-100">
            Explore Royal Celebration Suites
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Handcrafted templates tailored for sacred Indian traditions & grand festivities
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {HOME_CATEGORIES.map((cat) => {
            const IconComponent = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => scrollToCatalog(cat.id)}
                className={`p-4 rounded-2xl border transition-all text-center group flex flex-col items-center gap-3 hover:-translate-y-1 cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-gradient-to-b from-amber-500/15 to-neutral-900 shadow-lg shadow-amber-500/10'
                    : 'bg-neutral-900/70 border-neutral-800/90 hover:border-amber-500/40'
                }`}
              >
                <div className="w-16 h-16 rounded-full p-[1.5px] bg-gradient-to-br from-amber-300 via-amber-500 to-amber-800 relative shadow-md group-hover:scale-105 transition-transform">
                  <div className="w-full h-full rounded-full overflow-hidden relative">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#14070b] border border-amber-400/60 flex items-center justify-center text-amber-300 shadow-md">
                    <IconComponent className="w-3 h-3" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-neutral-100 group-hover:text-amber-300 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] font-tiro text-amber-400/80 block mt-0.5">{cat.hindi}</span>
                  <span className="text-[10px] text-neutral-500 block mt-0.5">{cat.count}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 5. SIGNATURE INVITATION COLLECTION (Bespoke Luxury Showcase) */}
      <section id="template-catalog" className="py-16 px-4 sm:px-6 max-w-7xl mx-auto w-full flex-1 relative">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-72 bg-amber-500/5 blur-[130px] pointer-events-none rounded-full" />

        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-amber-500/20">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-cinzel font-bold tracking-[0.18em] uppercase">
              <Crown className="w-3 h-3 text-amber-400" />
              <span>Royal Atelier Archive • राजसी निमंत्रण संग्रह</span>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold gold-text-gradient tracking-wide">
                Signature Invitation Collection
              </h2>
              <span className="text-[11px] font-cinzel text-amber-200 font-bold bg-[#17090e] px-3 py-1 rounded-full border border-amber-400/35 shadow-inner">
                {isFeaturedHomeView
                  ? `${visibleTemplates.length} Featured • ${filteredTemplates.length} Total`
                  : `${filteredTemplates.length} Couture Suites`}
              </span>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-2xl">
              Choose a celebration, compare original artwork styles, then open any card to edit its names, dates and venue. Select slide numbers on video suites to browse each ceremony page.
            </p>
          </div>

          {/* Luxury Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    if (cat.id !== 'all') setShowAllTemplates(false);
                  }}
                  className={`text-xs whitespace-nowrap px-4 py-2 rounded-full font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20 scale-[1.02]'
                      : 'bg-[#12090d] text-neutral-400 hover:text-amber-200 hover:border-amber-500/40 border border-neutral-800/90'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Luxury Showcase Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleTemplates.map((template) => {
            const frameTitle = template.tags.some((tag) => tag.toLowerCase().includes('photo frame'))
              ? template.title.replace(/\s+(Wedding|Griha Pravesh|Sangeet & Haldi|Birthday|Godh Bharai|Anniversary) Photo Frame Invitation$/i, '')
              : null;
            const meta = SUITE_SHOWCASE_META[template.id] || {
              cleanTitle: frameTitle || template.title.replace(/\s*\(.*?\)\s*/g, ''),
              hindiSubtitle: frameTitle ? 'फोटो फ्रेम निमंत्रण' : 'शाही डिजिटल निमंत्रण पत्र',
              editionTag: template.pages.length > 1 ? `${template.pages.length}-Slide Video Suite` : 'Royal Card Suite',
              coupleOrHighlight: template.title,
              venueOrDetail: 'Custom Venue & Google Maps QR',
              palette: ['#5A0E1A', '#D4AF37', '#FDFBF7'],
            };

            const activeSlideIdx = activeCardSlides[template.id] || 0;
            const currentPage = template.pages[activeSlideIdx] || template.pages[0];
            const isMultiSlide = template.pages.length > 1;
            const hasQr = template.pages.some((p) => p.elements.some((e) => e.type === 'qr'));
            const audioClipCount = template.audioClips?.length ?? 0;

            return (
              <div
                key={template.id}
                className="group relative rounded-3xl bg-gradient-to-b from-[#150a0f] via-[#0e080b] to-[#0a0608] border border-amber-500/25 hover:border-amber-400/75 shadow-[0_15px_45px_rgba(0,0,0,0.75)] hover:shadow-[0_20px_60px_rgba(212,175,55,0.14)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Top Ornamental Gold Shimmer Hairline */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-amber-400/70 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                {/* 1. CARD STAGE: Velvet Pedestal + Real Scaled Miniature Invitation */}
                <div className="relative h-[300px] px-4 flex flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_35%,rgba(212,175,55,0.12)_0%,rgba(20,7,11,0.6)_60%,rgba(8,6,8,0.95)_100%)] border-b border-amber-500/15">
                  {/* Decorative Corner Filigree Accents */}
                  <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-amber-400/35 rounded-tl pointer-events-none" />
                  <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-amber-400/35 rounded-tr pointer-events-none" />

                  {/* Top Floating Suite Badges */}
                  <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2 z-20 px-1">
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/65 backdrop-blur-md border border-amber-400/30 text-[9px] font-cinzel font-bold text-amber-200 tracking-wider uppercase">
                      <Crown className="w-2.5 h-2.5 text-amber-400" />
                      <span>{meta.editionTag}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      {audioClipCount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-400/25 text-[9px] font-medium text-emerald-200">
                          <Music className="w-2.5 h-2.5 text-emerald-300" />
                          <span>{audioClipCount} original cues</span>
                        </span>
                      )}
                      {hasQr && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 border border-amber-400/30 text-[9px] font-medium text-amber-300">
                          <QrCode className="w-2.5 h-2.5 text-amber-400" />
                          <span>Live GPS QR</span>
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Authentic Miniature Invitation Frame */}
                  <div
                    onClick={() => onOpenEditorWithTemplate(template, activeSlideIdx)}
                    className="relative cursor-pointer group/card transition-transform duration-500 group-hover:scale-[1.03]"
                    title="Click to personalize this slide in Studio"
                  >
                    <MiniCardArtwork
                      page={currentPage}
                      aspectRatio={template.aspectRatio}
                      targetWidth={190}
                      maxHeight={208}
                    />

                    {/* Subtle Hover Action Pill Over Artwork */}
                    <div className="opacity-0 group-hover/card:opacity-100 transition-all duration-200 absolute inset-0 rounded-[18px] bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 p-4 z-40 pointer-events-auto">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenEditorWithTemplate(template, activeSlideIdx);
                        }}
                        className="w-full py-2.5 px-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-neutral-950 font-bold text-xs rounded-xl shadow-xl flex items-center justify-center gap-1.5 cursor-pointer hover:brightness-110"
                      >
                        <Palette className="w-3.5 h-3.5" />
                        <span>Edit Slide #{activeSlideIdx + 1}</span>
                      </button>

                      {isMultiSlide && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenVideoCard(template);
                          }}
                          className="w-full py-2 px-3.5 bg-neutral-900/95 hover:bg-neutral-800 text-amber-200 border border-amber-400/50 font-semibold text-xs rounded-xl shadow-lg flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Play className="w-3 h-3 fill-amber-300 text-amber-300" />
                          <span>Play {template.pages.length}-Slide Video</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewTemplate(template);
                          setPreviewSlideIdx(activeSlideIdx);
                        }}
                        className="w-full py-1.5 px-3 bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Full Size</span>
                      </button>
                    </div>
                  </div>

                  {/* Interactive Multi-Slide Story Switcher Bar (for 5-Slide & 6-Slide Suites) */}
                  {isMultiSlide ? (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/70 px-2 py-1 rounded-full border border-amber-500/25 z-20">
                      <span className="text-[9px] font-cinzel text-amber-300/90 uppercase tracking-wider mr-1">
                        Slides:
                      </span>
                      {template.pages.map((pg, sIdx) => {
                        const isSlideActive = activeSlideIdx === sIdx;
                        return (
                          <button
                            key={pg.id || sIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveCardSlides((prev) => ({
                                ...prev,
                                [template.id]: sIdx,
                              }));
                            }}
                            className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isSlideActive
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-neutral-950 shadow-md shadow-amber-500/30 scale-105'
                                : 'bg-neutral-900/90 text-neutral-400 hover:text-amber-200 border border-neutral-700/70'
                            }`}
                            title={pg.title || `Slide ${sIdx + 1}`}
                          >
                            {sIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-neutral-800 text-[9px] text-neutral-400 whitespace-nowrap">
                      <RoyalLotusIcon className="w-3 h-3 text-amber-400" />
                      <span>Single-Page Heirloom Card • High-Resolution Export</span>
                    </div>
                  )}
                </div>

                {/* 2. EDITORIAL METADATA & DIRECT ACTION BAR */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-[#12090d] to-[#0b0609]">
                  <div className="space-y-2">
                    {/* Hindi Subtitle + Palette Swatches */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-tiro text-amber-400/95 tracking-wide">
                        {meta.hindiSubtitle}
                      </span>
                      <div className="flex items-center -space-x-1" title="Suite Color Palette">
                        {meta.palette.map((hex, pIdx) => (
                          <span
                            key={pIdx}
                            className="w-3.5 h-3.5 rounded-full border border-amber-200/40 shadow-xs"
                            style={{ backgroundColor: hex }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Clean Royal Suite Title */}
                    <h3
                      onClick={() => onOpenEditorWithTemplate(template, activeSlideIdx)}
                      className="font-cinzel text-base sm:text-lg font-bold text-amber-100 group-hover:text-amber-300 transition-colors cursor-pointer leading-snug"
                    >
                      {meta.cleanTitle}
                    </h3>

                    {/* Featured Couple / Venue Info */}
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-0.5">
                      <span className="font-medium text-neutral-300 truncate">
                        {meta.coupleOrHighlight}
                      </span>
                      <span className="text-amber-500/40 mx-1.5">•</span>
                      <span className="truncate text-neutral-400">
                        {meta.venueOrDetail}
                      </span>
                    </div>
                  </div>

                  {/* Direct Action Buttons Row (Always Visible & Effortless) */}
                  <div className="pt-3 border-t border-neutral-800/80 flex items-center gap-2">
                    <button
                      onClick={() => onOpenEditorWithTemplate(template, activeSlideIdx)}
                      className="flex-1 py-2.5 px-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-bold text-xs rounded-xl shadow-md shadow-amber-500/15 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Palette className="w-3.5 h-3.5" />
                      <span>Customize Suite</span>
                    </button>

                    {isMultiSlide && (
                      <button
                        onClick={() => onOpenVideoCard(template)}
                        className="py-2.5 px-3 bg-neutral-900 hover:bg-neutral-800 text-amber-200 border border-amber-500/35 hover:border-amber-400 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Play Animated Video Invitation with Shehnai Music"
                      >
                        <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                        <span>Video</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setPreviewTemplate(template);
                        setPreviewSlideIdx(activeSlideIdx);
                      }}
                      className="p-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-amber-200 border border-neutral-800 hover:border-amber-500/30 rounded-xl transition cursor-pointer"
                      title="Full-Size Suite Preview"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isFeaturedHomeView && filteredTemplates.length > visibleTemplates.length && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <span className="text-xs text-neutral-400">
              Showing {visibleTemplates.length} featured designs from the full collection
            </span>
            <button
              onClick={() => setShowAllTemplates(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-400/50 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 px-5 py-3 text-sm font-bold text-neutral-950 shadow-lg shadow-amber-500/15 transition hover:brightness-110"
            >
              View all {filteredTemplates.length} templates
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {showAllTemplates && selectedCategory === 'all' && !searchQuery.trim() && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => {
                setShowAllTemplates(false);
                document.getElementById('template-catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="rounded-full border border-neutral-700 px-4 py-2 text-xs text-neutral-300 transition hover:border-amber-400/50 hover:text-amber-200"
            >
              Show featured designs
            </button>
          </div>
        )}
      </section>

      {/* 6. HOW IT WORKS (Ultra-Luxe Royal 4-Step Process) */}
      <section className="py-20 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#080608] via-[#12080c] to-[#080608] border-t border-b border-amber-500/20">
        {/* Ambient golden glow behind section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-96 bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-widest uppercase">
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>राजसी निमंत्रण निर्माण • Effortless 4-Step Craft</span>
            </div>

            <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-black gold-text-gradient tracking-wide">
              How To Create Your Royal Invitation
            </h2>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              No graphic design experience needed — personalize an heirloom-quality invitation in under 5 minutes.
            </p>
          </div>

          {/* Connected Steps Grid */}
          <div className="relative">
            {/* Desktop Golden Connecting Line */}
            <div className="hidden lg:block absolute top-[72px] left-16 right-16 h-[1px] bg-gradient-to-r from-amber-500/20 via-amber-400/70 to-amber-500/20 z-0" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
              {[
                {
                  step: '01',
                  hindi: 'प्रथम चरण • चयन',
                  title: 'Select a Royal Suite',
                  desc: 'Choose from curated Palace Vivah, Griha Pravesh, Sangeet, or Milestone designs.',
                  icon: LayoutTemplate,
                  highlights: ['180+ Palace & Mandap Suites', 'Multi-Slide Video & Card Formats'],
                },
                {
                  step: '02',
                  hindi: 'द्वितीय चरण • संपादन',
                  title: 'Personalize Details',
                  desc: 'Edit names, auspicious Muhurat dates, family lineage, and sacred Sanskrit shlokas.',
                  icon: Edit3,
                  highlights: ['Authentic Vedic Shlokas', 'Devanagari & English Calligraphy'],
                },
                {
                  step: '03',
                  hindi: 'तृतीय चरण • लोकेशन क्यूआर',
                  title: 'Embed Venue Maps QR',
                  desc: 'Generate a live scannable QR code so guests can navigate straight to your venue.',
                  icon: QrCode,
                  highlights: ['1-Scan Google Maps GPS', 'Seamless Guest Arrival'],
                },
                {
                  step: '04',
                  hindi: 'चतुर्थ चरण • साझा करें',
                  title: 'Export HD & Share',
                  desc: 'Download a high-resolution PDF or PNG, or share directly with guests on WhatsApp.',
                  icon: Send,
                  highlights: ['100% Watermark-Free Export', 'WhatsApp 9:16 Fullscreen HD'],
                },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div
                    key={i}
                    className="group relative rounded-3xl bg-neutral-900/90 border border-amber-500/25 hover:border-amber-400/80 transition-all duration-300 p-6 flex flex-col justify-between shadow-xl hover:-translate-y-1.5"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        {/* Metallic Gold Disc */}
                        <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-500 to-amber-700 p-[1.5px] shadow-md shadow-amber-500/20">
                          <div className="w-full h-full rounded-[14px] bg-[#12070a] flex flex-col items-center justify-center">
                            <span className="font-cinzel font-black text-sm text-amber-300 tracking-wider">
                              {step.step}
                            </span>
                            <span className="text-[8px] font-semibold text-neutral-400 uppercase">
                              STEP
                            </span>
                          </div>
                        </div>

                        {/* Royal Icon Box */}
                        <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 group-hover:text-amber-200 group-hover:border-amber-400 transition-all">
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="text-[10px] font-semibold font-tiro text-amber-400 tracking-wider mb-1">
                        {step.hindi}
                      </div>

                      <h3 className="font-cinzel text-lg font-bold text-neutral-100 group-hover:text-amber-200 transition-colors">
                        {step.title}
                      </h3>

                      <p className="text-xs text-neutral-400 leading-relaxed mt-2">
                        {step.desc}
                      </p>
                    </div>

                    {/* Micro Features Badge List */}
                    <div className="pt-4 mt-5 border-t border-neutral-800/80 space-y-2">
                      {step.highlights.map((hl, hIdx) => (
                        <div key={hIdx} className="flex items-center gap-2 text-[11px] text-neutral-300">
                          <div className="w-4 h-4 rounded-full bg-amber-500/15 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                          <span className="font-medium">{hl}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE NIMANTRAN ROYALE? */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Gem className="w-3.5 h-3.5 text-amber-400" />
            <span>The Royal Standard</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-4xl font-extrabold text-neutral-100">
            Designed for Sacred Celebrations
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm">
            Combining traditional Indian artistry with modern digital convenience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: MapPin,
              title: 'Live Google Maps Venue QR',
              hindi: 'सटीक वेन्यू नेविगेशन',
              desc: 'Guests simply point their smartphone camera at your invitation card to launch turn-by-turn GPS directions to the wedding venue.',
              badge: 'Smart GPS QR',
            },
            {
              icon: Share2,
              title: 'WhatsApp 9:16 Fullscreen HD',
              hindi: 'व्हाट्सएप स्टेटस एवं संदेश',
              desc: 'Engineered for crystal-clear mobile viewing with one-click WhatsApp sharing and ceremonial invitation wording.',
              badge: 'Mobile First',
            },
            {
              icon: RoyalLotusIcon,
              title: 'Sacred Motifs & Vedic Shlokas',
              hindi: 'पारंपरिक मांगलिक प्रतीक',
              desc: 'Curated library of Lord Ganesha crests, Manglik Kalash, Royal Jharokhas, Mandap arches, and auspicious Sanskrit blessings.',
              badge: 'Pure Heritage',
            },
            {
              icon: Languages,
              title: 'Devanagari & Fine Calligraphy',
              hindi: 'राजसी हिंदी एवं अंग्रेजी फॉन्ट्स',
              desc: 'Compose your invitation in Shuddha Hindi, Sanskrit, or English with Rozha One, Tiro Devanagari, Cinzel, and Great Vibes.',
              badge: 'Bilingual Typography',
            },
            {
              icon: Printer,
              title: 'High-Resolution Export',
              hindi: 'हाई-डेफिनिशन प्रिंट क्वालिटी',
              desc: 'Export a high-resolution PDF or PNG. Confirm final size and print suitability with your print provider.',
              badge: 'Press Ready',
            },
            {
              icon: ShieldCheck,
              title: '100% Watermark-Free Dignity',
              hindi: 'पूर्णतः वाटरमार्क मुक्त',
              desc: 'Your family celebration deserves pure elegance — every invitation downloads without third-party logos or watermarks.',
              badge: 'Zero Watermark',
            },
          ].map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-3xl bg-neutral-900/60 border border-neutral-800/90 hover:border-amber-500/45 transition-all duration-300 group hover:shadow-xl hover:shadow-amber-500/5 hover:-translate-y-1 relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/15 to-yellow-500/5 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 group-hover:border-amber-400 transition-all">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-neutral-950 border border-amber-500/25 text-amber-300">
                      {feat.badge}
                    </span>
                  </div>

                  <div className="text-[10px] font-tiro text-amber-400/90 mb-1">{feat.hindi}</div>
                  <h3 className="font-cinzel text-base font-bold text-neutral-100 group-hover:text-amber-200 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed mt-2.5">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. TESTIMONIALS (Royal Vivah & Griha Pravesh Stories) */}
      <section className="py-20 px-4 sm:px-6 bg-[#0d080b] border-t border-b border-amber-500/15 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-widest">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>Patron Reflections • 4.9 / 5 Rating</span>
            </div>
            <h2 className="font-cinzel text-2xl sm:text-4xl font-bold text-neutral-100">
              Loved by Families Worldwide
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Discover how couples and families crafted their bespoke digital invitations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The Google Maps QR code on our Udaipur wedding invitation was effortless. Every relative navigated straight to the palace venue, and the Royal Lakeside 5-slide suite looked extraordinary on WhatsApp.",
                author: "Ananya & Siddharth Rathore",
                event: "Royal Shubh Vivah • The Jagmandir Island Palace",
                city: "Udaipur, Rajasthan",
              },
              {
                quote: "We personalized our Griha Pravesh invitation in five minutes with authentic Manglik Kalash motifs and Sanskrit shlokas. The Devanagari typography and zero-watermark PDF print quality are unmatched.",
                author: "Anoop & Kavita Sharma",
                event: "Griha Pravesh & Vastu Shanti Puja",
                city: "New Delhi",
              },
              {
                quote: "Playing the 5-slide animated invitation with classical Shehnai music for our Sangeet and Anand Karaj left all our guests mesmerized. Truly feels like a luxury couture studio.",
                author: "Rohan & Simran Kapoor",
                event: "Sangeet & Royal Reception",
                city: "Mumbai, Maharashtra",
              },
            ].map((testi, i) => (
              <div
                key={i}
                className="p-7 rounded-3xl bg-neutral-900/80 border border-neutral-800/90 hover:border-amber-500/40 transition-all duration-300 flex flex-col justify-between shadow-xl"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-amber-400 gap-0.5">
                      {[...Array(5)].map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-amber-300 font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5 text-amber-400" />
                      Verified Celebration
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed font-playfair">
                    "{testi.quote}"
                  </p>
                </div>

                <div className="pt-5 border-t border-neutral-800/80 mt-6 flex items-center justify-between">
                  <div>
                    <div className="font-cinzel text-xs font-bold text-amber-200">
                      {testi.author}
                    </div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      {testi.event}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-amber-400/80">
                    <MapPin className="w-3 h-3" />
                    <span>{testi.city}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Concierge Guide</span>
          </div>
          <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-neutral-100">
            Frequently Asked Questions
          </h2>
          <p className="text-neutral-400 text-xs">Everything you need to know about personalizing and sharing your invitation</p>
        </div>

        <div className="space-y-3.5">
          {[
            {
              q: 'How does the Google Maps QR code work on the invitation card?',
              a: 'When personalizing your card in the Studio, paste your venue address or Google Maps link. The editor generates a high-contrast scannable QR code right on the invitation. Guests can scan it with any phone camera to get direct GPS navigation.',
            },
            {
              q: 'Can I customize the text in Hindi, Sanskrit, or English?',
              a: 'Yes. Our Studio includes authentic Devanagari and English calligraphy fonts along with a curated library of auspicious Sanskrit shlokas and bilingual wedding wordings.',
            },
            {
              q: 'Are downloaded invitations completely free of watermarks?',
              a: 'Exports are created without an added Nimantran watermark. Check the selected format and preview before sharing or printing.',
            },
            {
              q: 'What is the 5-Slide Royal Video Invitation Suite?',
              a: 'Signature suites like Royal Lakeside and Golden Mandap feature 5 coordinated slides (Cover, Shubh Vivah, Haldi & Sangeet, Reception, and RSVP) that play with traditional Shehnai music and animated petal effects.',
            },
          ].map((faq, i) => (
            <div key={i} className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800/90 hover:border-amber-500/35 transition">
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-100 mb-2 flex items-center gap-2.5">
                <Gem className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs text-neutral-400 pl-6 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 10. BESPOKE IMPERIAL HERITAGE FOOTER */}
      <footer className="mt-auto bg-gradient-to-b from-[#0a0608] via-[#070406] to-[#040203] border-t border-amber-500/30 text-neutral-400 text-xs relative overflow-hidden">
        {/* Top Ornamental Gold Line */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />

        {/* Subtle Ambient Palace Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-3/4 h-56 bg-amber-500/8 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-10 relative z-10">
          {/* TOP ROYAL CALLOUT CARD */}
          <div className="p-7 sm:p-10 rounded-3xl bg-gradient-to-r from-[#1a070d] via-[#12080c] to-[#1a070d] border border-amber-500/35 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 mb-14 relative overflow-hidden">
            {/* Inner Gold Hairline Frame */}
            <div className="absolute inset-2 border border-amber-400/15 rounded-2xl pointer-events-none" />

            <div className="space-y-2.5 text-center lg:text-left max-w-xl relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/30 text-amber-300 text-[10px] font-cinzel font-bold tracking-[0.18em] uppercase">
                <Crown className="w-3 h-3 text-amber-400" />
                <span>Bespoke Digital Invitation Atelier</span>
              </div>
              <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-amber-100 tracking-wide">
                Begin Crafting Your Family’s Royal Invitation
              </h3>
              <p className="text-xs sm:text-sm text-neutral-300/90 leading-relaxed">
                Select a signature multi-slide suite or open the blank studio canvas with Devanagari calligraphy, sacred motifs, and live Google Maps QR.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto relative z-10">
              <button
                onClick={() => openCreateDesign()}
                className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Palette className="w-4 h-4" />
                <span>Launch Design Studio</span>
              </button>
              <button
                onClick={() => onOpenVideoCard(INITIAL_TEMPLATES[0])}
                className="w-full sm:w-auto px-5 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 border border-amber-500/40 text-amber-200 font-semibold text-xs uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>Preview 5-Slide Video</span>
              </button>
            </div>
          </div>

          {/* 4-PILLAR ROYAL ASSURANCE STRIP (Custom Luxury Gold Vector Medallions) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pb-14 border-b border-neutral-800/80">
            {[
              {
                icon: ShieldCheck,
                title: '100% Watermark-Free',
                sub: 'Uncompromised dignity on every export',
              },
              {
                icon: Printer,
                title: 'High-Resolution Downloads',
                sub: 'Lossless PDF, PNG & WhatsApp Story HD',
              },
              {
                icon: Compass,
                title: 'Live Venue GPS QR',
                sub: 'Scannable turn-by-turn Google Maps',
              },
              {
                icon: Award,
                title: 'Authentic Vedic Artistry',
                sub: 'Handcrafted motifs & Sanskrit shlokas',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-neutral-900/40 border border-amber-500/15 hover:border-amber-500/35 transition flex items-center gap-3.5 group"
                >
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400/15 via-amber-500/10 to-transparent border border-amber-400/35 flex items-center justify-center text-amber-300 shrink-0 group-hover:border-amber-300 transition-colors shadow-inner">
                    <Icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <div>
                    <h4 className="font-cinzel text-xs font-bold text-amber-100 tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
                      {item.sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* MAIN 4-COLUMN LUXURY DIRECTORY (Clean, Relevant, Fine Vector Icons) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-14 border-b border-neutral-800/80">
            {/* Brand Column (5 cols on desktop) */}
            <div className="lg:col-span-5 space-y-5 pr-0 lg:pr-8">
              <div className="flex items-center gap-3.5">
                <div className="brand-logo-badge w-11 h-11 rounded-xl p-[1.5px] bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/20">
                  <div className="w-full h-full rounded-[10px] bg-[#14070b] flex items-center justify-center">
                    <span className="font-tiro brand-mark-shine inline-flex h-full w-full items-center justify-center text-xl font-bold leading-none">नि</span>
                  </div>
                </div>
                <div>
                  <span className="font-cinzel font-bold text-amber-100 text-lg tracking-[0.16em] block">
                    NIMANTRAN ROYALE
                  </span>
                  <span className="text-[10px] text-amber-400/90 font-medium tracking-[0.2em] uppercase">
                    Fine Indian Digital Invitations
                  </span>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-neutral-400">
                Celebrating the timeless grandeur of Indian hospitality. Each invitation suite blends regal palace architecture, Devanagari calligraphy, and modern smart conveniences for your most sacred family milestones.
              </p>

              {/* Sacred Sanskrit Invocation Card */}
              <div className="p-3.5 rounded-2xl bg-[#12080c]/90 border border-amber-500/20 flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
                  <RoyalDiyaIcon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-tiro text-amber-200 text-xs tracking-wide">
                    ॥ वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ ॥
                  </div>
                  <p className="text-[10px] text-neutral-400 mt-0.5">
                    Auspicious beginnings crafted with reverence & precision
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Royal Collections (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-cinzel text-[11px] font-bold text-amber-200 uppercase tracking-[0.18em] flex items-center gap-2">
                <Crown className="w-3.5 h-3.5 text-amber-400" />
                <span>Collections</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                {[
                  { id: 'wedding', label: 'Royal Shubh Vivah', icon: Crown },
                  { id: 'housewarming', label: 'Griha Pravesh Puja', icon: RoyalKalashIcon },
                  { id: 'sangeet-mehendi', label: 'Sangeet & Haldi', icon: Music },
                  { id: 'birthday', label: 'Milestone Birthday', icon: Sparkles },
                  { id: 'baby-shower', label: 'Godh Bharai Suite', icon: Heart },
                  { id: 'anniversary', label: 'Jubilee Anniversary', icon: Gem },
                  { id: 'gold-velvet', label: '24K Gold Foil & Velvet', icon: Gem },
                ].map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => scrollToCatalog(item.id)}
                        className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group"
                      >
                        <ItemIcon className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 transition-colors shrink-0" />
                        <span>{item.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Column 3: Signature Suites (3 cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h4 className="font-cinzel text-[11px] font-bold text-amber-200 uppercase tracking-[0.18em] flex items-center gap-2">
                <RoyalArchIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>Signature Suites</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <button
                    onClick={() => onOpenEditorWithTemplate(INITIAL_TEMPLATES[0])}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <Film className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>Royal Lakeside 5-Slide Suite</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenEditorWithTemplate(INITIAL_TEMPLATES[1] || INITIAL_TEMPLATES[0])}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <Film className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>Golden Mandap 5-Slide Suite</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenVideoCard(INITIAL_TEMPLATES[0])}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <Play className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>Interactive Video Story Player</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToCatalog('wedding')}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <RoyalLotusIcon className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>Rajasthani Rajwada Editions</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => scrollToCatalog('housewarming')}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <RoyalDiyaIcon className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>Vastu Shanti & Sacred Pooja</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Studio Capabilities (2 cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h4 className="font-cinzel text-[11px] font-bold text-amber-200 uppercase tracking-[0.18em] flex items-center gap-2">
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Atelier Craft</span>
              </h4>
              <ul className="space-y-2.5 text-xs text-neutral-400">
                <li>
                  <button
                    onClick={() => openAtelierFeature({ initialSidebarTab: 'apps' })}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>Google Maps Venue QR</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openAtelierFeature({ initialSidebarTab: 'text' })}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <Languages className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>Hindi & Sanskrit Shlokas</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openAtelierFeature({ initialSidebarTab: 'elements', initialElementSubTab: 'frames' })}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>Portrait Frame Studio</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => openAtelierFeature({ initialSidebarTab: 'elements', initialElementSubTab: 'tables' })}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <Calendar className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>Ceremony Itinerary</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => onOpenPrintExport(INITIAL_TEMPLATES[0])}
                    className="hover:text-amber-300 transition flex items-center gap-2.5 cursor-pointer group text-left"
                  >
                    <Printer className="w-3.5 h-3.5 text-amber-400/70 group-hover:text-amber-300 shrink-0" />
                    <span>High-Resolution Export</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* BOTTOM ROYAL SIGNATURE & COPYRIGHT BAR */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <span className="font-cinzel text-amber-200/90 font-semibold tracking-wider">
                © {new Date().getFullYear()} NIMANTRAN ROYALE
              </span>
              <span className="text-neutral-700">•</span>
              <span className="text-neutral-400">
                Handcrafted for Indian Celebrations Worldwide
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-amber-500/20 text-[11px] text-amber-300/90">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>Watermark-Free Guarantee</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900/90 border border-amber-500/20 text-[11px] text-neutral-300">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>9:16 Story • 5:7 Print • 1:1 Square</span>
              </span>
            </div>
          </div>

          <nav aria-label="Company and policy pages" className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-amber-500/15 pt-5 text-[11px] font-medium tracking-[0.12em] text-neutral-300 sm:text-xs">
            <a href="/about/" className="font-cinzel transition-colors duration-200 hover:text-amber-300 focus-visible:text-amber-300">About</a>
            <a href="/contact/" className="font-cinzel transition-colors duration-200 hover:text-amber-300 focus-visible:text-amber-300">Contact</a>
            <a href="/privacy/" className="font-cinzel transition-colors duration-200 hover:text-amber-300 focus-visible:text-amber-300">Privacy</a>
            <a href="/terms/" className="font-cinzel transition-colors duration-200 hover:text-amber-300 focus-visible:text-amber-300">Terms</a>
          </nav>
        </div>
      </footer>

      {/* FULL-FIDELITY MULTI-SLIDE QUICK PREVIEW MODAL */}
      {previewTemplate && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#11080c] border border-amber-500/35 rounded-3xl p-6 max-w-lg w-full text-center space-y-5 shadow-2xl relative">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3.5">
              <div className="text-left">
                <span className="text-[10px] font-tiro text-amber-400 block">
                  {SUITE_SHOWCASE_META[previewTemplate.id]?.hindiSubtitle || 'शाही निमंत्रण'}
                </span>
                <h3 className="font-cinzel text-base sm:text-lg font-bold text-amber-100">
                  {SUITE_SHOWCASE_META[previewTemplate.id]?.cleanTitle || previewTemplate.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Center Full Scaled Card */}
            <div className="flex flex-col items-center justify-center py-2 relative">
              <MiniCardArtwork
                page={previewTemplate.pages[previewSlideIdx] || previewTemplate.pages[0]}
                aspectRatio={previewTemplate.aspectRatio}
                targetWidth={260}
              />

              {/* Prev / Next Slide Controls if Multi-Slide */}
              {previewTemplate.pages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setPreviewSlideIdx((prev) =>
                        prev > 0 ? prev - 1 : previewTemplate.pages.length - 1
                      )
                    }
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/75 hover:bg-amber-500 text-amber-200 hover:text-neutral-950 border border-amber-400/40 flex items-center justify-center transition cursor-pointer shadow-lg"
                    title="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setPreviewSlideIdx((prev) =>
                        prev < previewTemplate.pages.length - 1 ? prev + 1 : 0
                      )
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/75 hover:bg-amber-500 text-amber-200 hover:text-neutral-950 border border-amber-400/40 flex items-center justify-center transition cursor-pointer shadow-lg"
                    title="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {/* Slide Selector Pills in Modal */}
            {previewTemplate.pages.length > 1 && (
              <div className="flex items-center justify-center gap-1.5">
                {previewTemplate.pages.map((pg, idx) => (
                  <button
                    key={pg.id || idx}
                    onClick={() => setPreviewSlideIdx(idx)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold transition cursor-pointer ${
                      previewSlideIdx === idx
                        ? 'bg-amber-400 text-neutral-950'
                        : 'bg-neutral-900 text-neutral-400 hover:text-amber-200 border border-neutral-800'
                    }`}
                  >
                    Slide {idx + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Modal Footer Actions */}
            <div className="flex gap-2.5 pt-2 border-t border-neutral-800/80">
              {previewTemplate.pages.length > 1 && (
                <button
                  onClick={() => {
                    const t = previewTemplate;
                    setPreviewTemplate(null);
                    onOpenVideoCard(t);
                  }}
                  className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-amber-200 border border-amber-500/40 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition"
                >
                  <Play className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  <span>Play Video Suite</span>
                </button>
              )}
              <button
                onClick={() => {
                  const t = previewTemplate;
                  const sIdx = previewSlideIdx;
                  setPreviewTemplate(null);
                  onOpenEditorWithTemplate(t, sIdx);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 hover:brightness-110 text-neutral-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition shadow-lg shadow-amber-500/20"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Customize Slide #{previewSlideIdx + 1} →</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <CreateDesignModal
        isOpen={isCreateDesignOpen}
        onClose={() => {
          setIsCreateDesignOpen(false);
          setStudioIntent({});
        }}
        onCreate={createBlankDesign}
      />
    </div>
  );
};
