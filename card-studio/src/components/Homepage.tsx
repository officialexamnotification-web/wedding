import React, { useEffect, useRef, useState } from 'react';
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
  Eye,
  MoonStar
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
  VideoElement,
} from '../types/editor';
import { TEMPLATE_CATEGORIES } from '../data/templates';
import { SaathFooter, SaathHeader } from '../../../src/components/SaathHeaderAndFooter';
import {
  INVITATION_PHONE_FRAME_CLASS,
  INVITATION_PHONE_NOTCH_CLASS,
  INVITATION_PHONE_SCREEN_CLASS,
} from '../../../src/components/invitationPhoneStyles';
import { BlankDesignOptions, CreateDesignModal } from './CreateDesignModal';
import { QrCodeImage } from './QrCodeImage';
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
  templates: CardTemplate[];
  onOpenEditorWithTemplate: (template: CardTemplate, targetSlideIndex?: number) => void;
  onOpenBlankEditor: (options: BlankDesignOptions) => void;
  onOpenPrintExport: (template: CardTemplate) => void;
  onOpenAnalysis?: () => void;
  onOpenVideoCard: (template?: CardTemplate) => void;
  onOpenAstrology: () => void;
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
const HOME_PREVIEW_IMAGES: Record<string, string> = {
  '/card-studio-assets/images/wedding_couple_1791965341379.jpg': '/card-studio-assets/images/home-preview/wedding-couple.webp',
  '/card-studio-assets/templates/new-wedding/ganesha-suites/ornate-gold-ganesha-01.webp': '/card-studio-assets/images/home-preview/ornate-gold-ganesha.webp',
  '/card-studio-assets/images/photo-library/wedding-palace-couple-editorial-01.webp': '/card-studio-assets/images/home-preview/wedding-palace-couple.webp',
  '/card-studio-assets/images/photo-library/wedding-jharokha-sunrise-01.webp': '/card-studio-assets/images/home-preview/wedding-jharokha.webp',
  '/card-studio-assets/templates/new-wedding/ganesha-suites/ornate-maroon-ganesha-01.webp': '/card-studio-assets/images/home-preview/ornate-maroon-ganesha.webp',
  '/card-studio-assets/templates/new-wedding/single-cards/ornate-maroon-ganesha-wedding-cover.webp': '/card-studio-assets/images/home-preview/ornate-maroon-cover.webp',
  '/card-studio-assets/templates/new-wedding/ganesha-suites/luxury-purple-gold-ganesha-01.webp': '/card-studio-assets/images/home-preview/purple-gold-ganesha.webp',
  '/card-studio-assets/templates/new-wedding/ganesha-suites/elegant-navy-ganesha-01.webp': '/card-studio-assets/images/home-preview/navy-ganesha.webp',
  '/card-studio-assets/templates/user-added-ganesha/golden-ganesha-maroon-01.webp': '/card-studio-assets/images/home-preview/user-ganesha.webp',
  '/card-studio-assets/wedding/Royal Lakeside Wedding Invitation/Royal Lakeside Wedding Invitation-1-card-640.webp': '/card-studio-assets/images/home-preview/royal-lakeside-cover.webp',
};

function getHomePreviewPage(page: CardPage): CardPage {
  return {
    ...page,
    elements: page.elements.map((element) => {
      if (element.type === 'image') {
        const preview = HOME_PREVIEW_IMAGES[(element as ImageElement).src];
        return preview ? { ...element, src: preview } : element;
      }
      if (element.type === 'frame') {
        const preview = HOME_PREVIEW_IMAGES[(element as FrameElement).imageSrc];
        return preview ? { ...element, imageSrc: preview } : element;
      }
      if (element.type === 'video') {
        const video = element as VideoElement;
        const preview = video.posterSrc ? HOME_PREVIEW_IMAGES[video.posterSrc] : undefined;
        return preview ? { ...element, posterSrc: preview } : element;
      }
      return element;
    }),
  };
}

const MiniCardArtwork: React.FC<{
  page: CardPage;
  aspectRatio: CardTemplate['aspectRatio'];
  targetWidth?: number;
  maxHeight?: number;
  playVideoPreview?: boolean;
  fitPhoneScreen?: boolean;
}> = ({ page, aspectRatio, targetWidth = 240, maxHeight = 280, playVideoPreview = false, fitPhoneScreen = false }) => {
  const artworkRef = useRef<HTMLDivElement>(null);
  const [phoneScreenSize, setPhoneScreenSize] = useState({ width: 0, height: 0 });
  useEffect(() => {
    if (!fitPhoneScreen) return;
    const screen = artworkRef.current?.parentElement;
    if (!screen) return;
    const measure = () => setPhoneScreenSize({ width: screen.clientWidth, height: screen.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(screen);
    return () => observer.disconnect();
  }, [fitPhoneScreen]);
  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];
  const fittedWidth = fitPhoneScreen && phoneScreenSize.width > 0 ? phoneScreenSize.width : targetWidth;
  const fittedHeight = fitPhoneScreen && phoneScreenSize.height > 0 ? phoneScreenSize.height : maxHeight;
  // Fill the phone viewport like the main site phone showcase. Keep the card artwork
  // proportional and crop only the overflow when a template uses a different ratio.
  const scale = (fitPhoneScreen ? Math.max : Math.min)(
    fittedWidth / dimensions.width,
    fittedHeight / dimensions.height,
  );
  const renderedWidth = Math.round(dimensions.width * scale);
  const targetHeight = Math.round(dimensions.height * scale);
  const artworkLeft = fitPhoneScreen ? Math.round((fittedWidth - renderedWidth) / 2) : 0;
  const artworkTop = fitPhoneScreen ? Math.round((fittedHeight - targetHeight) / 2) : 0;

  return (
    <div
      ref={artworkRef}
      className={`relative overflow-hidden ${fitPhoneScreen ? 'rounded-none border-0 shadow-none' : 'rounded-[20px] shadow-[0_8px_20px_rgba(35,20,22,0.14)] border border-white/70'} select-none pointer-events-none shrink-0`}
      style={{
        width: `${fitPhoneScreen ? fittedWidth : renderedWidth}px`,
        height: `${fitPhoneScreen ? fittedHeight : targetHeight}px`,
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
          top: `${artworkTop}px`,
          left: `${artworkLeft}px`,
        }}
      >
        {[...page.elements]
          .filter((el) => !el.hidden && !(playVideoPreview && el.type === 'text'))
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
                {elem.type === 'video' && playVideoPreview && (elem as VideoElement).mediaSrc && (
                  <video
                    src={(elem as VideoElement).mediaSrc}
                    poster={(elem as VideoElement).posterSrc}
                    className="h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    aria-label="Muted invitation cover video preview"
                  />
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
                    <QrCodeImage
                      targetValue={(elem as QrElement).targetValue}
                      color={(elem as QrElement).color}
                      backgroundColor={(elem as QrElement).backgroundColor}
                      label={(elem as QrElement).label}
                    />
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
  templates,
  onOpenEditorWithTemplate,
  onOpenBlankEditor,
  onOpenPrintExport,
  onOpenVideoCard,
  onOpenAstrology,
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
  const [activeVideoPreviewId, setActiveVideoPreviewId] = useState<string | null>(null);
  const [videoPreviewSequenceIndex, setVideoPreviewSequenceIndex] = useState(0);

  // A cover preview is a short story: play its cover clip, then show the next two slides.
  useEffect(() => {
    if (!activeVideoPreviewId) return;
    const template = templates.find((item) => item.id === activeVideoPreviewId);
    if (!template || template.pages.length < 2) return;

    const sequenceLength = Math.min(3, template.pages.length);
    const delay = videoPreviewSequenceIndex === 0 ? 5000 : 2300;
    const timeout = window.setTimeout(() => {
      setVideoPreviewSequenceIndex((current) => (current + 1) % sequenceLength);
    }, delay);

    return () => window.clearTimeout(timeout);
  }, [activeVideoPreviewId, templates, videoPreviewSequenceIndex]);

  const startCoverStoryPreview = (templateId: string) => {
    setVideoPreviewSequenceIndex(0);
    setActiveVideoPreviewId(templateId);
  };

  const stopCoverStoryPreview = (templateId?: string) => {
    setActiveVideoPreviewId((activeId) => !templateId || activeId === templateId ? null : activeId);
    setVideoPreviewSequenceIndex(0);
  };

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
      image: '/card-studio-assets/images/photo-library/wedding-palace-couple-editorial-01.webp',
      count: `${templates.filter((template) => template.category === 'wedding').length} Royal Designs`,
    },
    { 
      id: 'housewarming', 
      name: 'Griha Pravesh', 
      hindi: 'गृह प्रवेश एवं वास्तु पूजा',
      icon: RoyalKalashIcon, 
      image: '/card-studio-assets/images/home-category/home-courtyard-kalash-02.webp',
      count: `${templates.filter((template) => template.category === 'housewarming').length} Sacred Designs`,
    },
    { 
      id: 'sangeet-mehendi', 
      name: 'Sangeet & Haldi', 
      hindi: 'संगीत, हल्दी व मेहंदी',
      icon: Music, 
      image: '/card-studio-assets/images/home-category/sangeet-genda-evening-06.webp',
      count: `${templates.filter((template) => template.category === 'sangeet-mehendi').length} Festive Designs`,
    },
    { 
      id: 'birthday', 
      name: 'Birthday Celebration', 
      hindi: 'जन्मदिन उत्सव',
      icon: Sparkles, 
      image: '/card-studio-assets/images/home-category/birthday-little-star-08.webp',
      count: `${templates.filter((template) => template.category === 'birthday').length} Luxe Designs`,
    },
    { 
      id: 'baby-shower', 
      name: 'Godh Bharai', 
      hindi: 'गोद भराई एवं नामकरण',
      icon: Heart, 
      image: '/card-studio-assets/images/photo-library/godh-blush-home-portrait-14.webp',
      count: `${templates.filter((template) => template.category === 'baby-shower').length} Pastel Designs`,
    },
    { 
      id: 'anniversary', 
      name: 'Royal Anniversary', 
      hindi: 'विवाह वर्षगांठ',
      icon: Gem, 
      image: '/card-studio-assets/images/home-category/anniversary-evergreen-together-07.webp',
      count: `${templates.filter((template) => template.category === 'anniversary').length} Jubilee Designs`,
    },
  ];

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    const isPhotoFrame = t.tags.some((tag) => tag.toLowerCase().includes('photo frame'));
    const matchesCat = selectedCategory === 'all'
      || (selectedCategory === 'photo-frames' ? isPhotoFrame : t.category === selectedCategory);
    const matchesSearch = 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });
  const prioritizeNewGanesha = selectedCategory === 'wedding' || searchQuery.toLowerCase().includes('ganesha');
  const hasVideoCover = (template: CardTemplate) =>
    template.pages[0]?.elements.some((element) => element.type === 'video' && Boolean(element.mediaSrc)) ?? false;
  const isVideoInvitationTemplate = (template: CardTemplate) =>
    template.tags.some((tag) => tag.toLowerCase().includes('video invitation'))
    || template.pages.length > 1;
  const orderedTemplates = selectedCategory === 'photo-frames'
    ? [...filteredTemplates].reverse()
    : selectedCategory === 'all' || selectedCategory === 'birthday'
      ? [
          ...filteredTemplates.filter(hasVideoCover),
          ...filteredTemplates.filter((template) => !hasVideoCover(template) && isVideoInvitationTemplate(template)),
          ...filteredTemplates.filter((template) => !isVideoInvitationTemplate(template))
        ]
      : prioritizeNewGanesha
        ? [...filteredTemplates].sort((a, b) => Number(b.tags.includes('New Ganesha Collection')) - Number(a.tags.includes('New Ganesha Collection')))
        : filteredTemplates;
  const isFeaturedHomeView = selectedCategory === 'all' && !searchQuery.trim() && !showAllTemplates;
  const visibleTemplates = isFeaturedHomeView
    ? orderedTemplates.slice(0, HOMEPAGE_FEATURED_COUNT)
    : orderedTemplates;

  const scrollToCatalog = (category?: string) => {
    if (category) setSelectedCategory(category);
    const elem = document.getElementById('template-catalog');
    elem?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToSiteSection = (sectionId?: string) => {
    if (!sectionId) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (sectionId.startsWith('category:')) {
      setSelectedCategory(sectionId.slice('category:'.length));
      document.getElementById('template-catalog')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const targets: Record<string, string> = {
      templates: 'template-catalog',
      'what-we-make': 'how-it-works',
      features: 'royal-standard',
      'how-it-works': 'how-it-works',
      comparison: 'royal-standard',
      testimonials: 'studio-testimonials',
      faq: 'studio-faq',
      blog: 'template-catalog',
    };
    document.getElementById(targets[sectionId] || sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  const openBlankInvitation = () => onOpenBlankEditor({
    aspectRatio: 'portrait-story',
    backgroundColor: '#FBF6F3',
    occasion: 'wedding',
    themeName: 'NIMANTRAN Invitation',
  });

  const pickHeaderCategory = (categoryId: string) => {
    const category = categoryId === 'Birthday' ? 'birthday' : 'wedding';
    setSelectedCategory(category);
    setShowAllTemplates(false);
    scrollToCatalog();
  };

  return (
    <div className="min-h-screen bg-[#FBF6F3] text-[#2A1316] flex flex-col font-sans selection:bg-[#f2d9db] selection:text-[#5e161c]">
      <SaathHeader
        activeRoute="studio-home"
        primaryActionLabel="Create Invitation"
        onPrimaryAction={openBlankInvitation}
        studioLinkHref="/"
        studioLinkLabel="Main Website"
        onSelectCategory={pickHeaderCategory}
        onNavigate={(route, sectionId) => {
          if (route === 'jharokha-page') {
            onOpenVideoCard(templates[0]);
            return;
          }
          if (route === 'share-suite') {
            openBlankInvitation();
            return;
          }
          scrollToSiteSection(sectionId);
        }}
      />

      <main id="main-content">
      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-6 bg-[#FBF6F3] border-b border-[#EADFD8]">
        {/* Ambient background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 relative z-10">
          {/* Hero Left Copy */}
          <div className="flex-1 text-center lg:text-left space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
              <RoyalLotusIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>भारत का प्रीमियम राजसी डिजिटल निमंत्रण स्टूडियो</span>
            </div>

            <h1 className="max-w-2xl mx-auto lg:mx-0 font-sans text-4xl sm:text-5xl lg:text-[3.45rem] font-semibold text-[#231416] tracking-[-0.035em] leading-[1.12]">
              A Royal Invitation<br />
              <span className="gold-text-gradient">Made Timeless</span>
            </h1>

            <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Thoughtfully designed for your most cherished celebrations. Personalize in Hindi or English, add a <strong className="text-amber-300">Google Maps venue QR</strong>, and share a beautifully finished invitation with family and friends.
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={() => onOpenVideoCard(templates[0])}
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
              <button
                onClick={onOpenAstrology}
                className="w-full sm:w-auto px-5 py-3.5 bg-neutral-900/70 hover:bg-neutral-800 border border-amber-500/20 text-amber-100/90 font-medium text-sm rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MoonStar className="w-4 h-4 text-amber-300" />
                <span>Vedic Astrology</span>
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
                alt="Luxury Royal Indian Invitation Cards Flatlay"
                referrerPolicy="no-referrer"
                loading="lazy"
                decoding="async"
                width={768}
                height={429}
                fetchPriority="low"
                srcSet="/card-studio-assets/images/invitation_hero_card.webp 768w"
                sizes="256px"
                src="/card-studio-assets/images/invitation_hero_card.webp"
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
              onClick={() => onOpenEditorWithTemplate(templates[0])}
              className="cursor-pointer group relative w-72 sm:w-80 h-[460px] rounded-3xl p-5 shadow-2xl border-2 border-amber-500/50 rotate-[2deg] hover:rotate-0 hover:scale-105 transition-all duration-300 z-10 overflow-hidden will-change-transform"
              style={{ background: templates[0].pages[0].backgroundValue }}
            >
              {/* Background Cover Image (WebP) */}
              <img
                src="/card-studio-assets/images/home-preview/royal-lakeside-hero.webp"
                alt="Royal Lakeside Wedding Invitation Cover"
                referrerPolicy="no-referrer"
                loading="eager"
                decoding="async"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/60 pointer-events-none" />

              {/* Gold foil edge glow */}
              <div className="absolute inset-2.5 border border-amber-400/40 rounded-2xl pointer-events-none z-10" />

              <div className="h-full flex flex-col justify-end pb-1 text-center relative z-10">
                <div className="flex flex-col items-center">
                  <div className="w-18 h-18 p-1.5 bg-[#FFF4D6] rounded-lg shadow-lg border border-amber-500/50 flex items-center justify-center">
                    <QrCode className="w-full h-full text-neutral-900" />
                  </div>
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
                      width={192}
                      height={192}
                      className={`w-full h-full object-cover transition duration-500 ${cat.id === 'wedding' || cat.id === 'baby-shower' ? '' : 'group-hover:scale-105'}`}
                      style={cat.id === 'wedding' ? { objectPosition: 'center 18%' } : cat.id === 'baby-shower' ? { objectPosition: 'center 6%' } : undefined}
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
      <section id="template-catalog" className="py-16 px-4 sm:px-6 max-w-[1180px] mx-auto w-full flex-1 relative">
        {/* Subtle Ambient Gold Glow */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-2/3 h-72 bg-amber-500/5 blur-[130px] pointer-events-none rounded-full" />

        {/* Same centered heading, category strip and count hierarchy as NIMANTRAN. */}
        <div className="mx-auto max-w-[760px] text-center">
          <div className="font-great-vibes text-2xl sm:text-[28px] text-[#8f1d21]">Nimantran Collection</div>
          <h2 className="mt-1 text-[26px] sm:text-[44px] leading-[1.15] font-semibold text-[#141619] font-sans">
            Crafted for your sacred day. Built by hand. Sent in a single tap.
          </h2>
          <p className="mt-3 text-[#838383] text-[15px] sm:text-base">
            Choose a design, preview it on a phone, then personalize the names, dates and venue.
          </p>
        </div>

        <div className="relative mx-auto mt-6 max-w-md">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8F1D21]" />
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search invitation designs"
            aria-label="Search invitation designs"
            className="w-full rounded-full border border-[#E4D5BE] bg-white px-11 py-3 text-sm text-[#231416] shadow-sm outline-none transition placeholder:text-[#8A7771] focus:border-[#8F1D21] focus:ring-2 focus:ring-[#C89B4F]/25"
          />
        </div>

        <div className="mt-8 sm:mt-11 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto max-w-full pb-1">
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
                    ? 'bg-[#8f1d21] text-[#faf6ee] font-medium shadow-sm'
                      : 'bg-white/85 text-[#565656] hover:text-[#231416] hover:border-[#bdbdbd] border border-[#e3e3e3]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

        <div className="mt-6 flex items-center justify-center text-[13px] text-[#6b6b6b]">
          <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#8f1d21]" />
          Showing {visibleTemplates.length} of {filteredTemplates.length} templates
        </div>

        {/* Gallery layout matches the original site at Android, tablet and desktop widths. */}
        <div className="mt-9 grid grid-cols-3 max-[960px]:grid-cols-2 max-[620px]:grid-cols-1 gap-[26px]">
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
            const galleryCategoryLabel = template.category === 'wedding'
              ? 'Hindu Weddings'
              : TEMPLATE_CATEGORIES.find((category) => category.id === template.category)?.label || 'Celebration';

            const activeSlideIdx = activeCardSlides[template.id] || 0;
            const isMultiSlide = template.pages.length > 1;
            const coverVideo = template.pages[0]?.elements.find(
              (element): element is VideoElement => element.type === 'video' && Boolean(element.mediaSrc),
            );
            const isVideoStoryPreviewing = Boolean(coverVideo) && activeVideoPreviewId === template.id;
            const isCoverVideoPreviewing = isVideoStoryPreviewing && videoPreviewSequenceIndex === 0;
            const displayedSlideIdx = isVideoStoryPreviewing
              ? Math.min(videoPreviewSequenceIndex, template.pages.length - 1)
              : activeSlideIdx;
            const currentPage = template.pages[displayedSlideIdx] || template.pages[0];
            const hasQr = template.pages.some((p) => p.elements.some((e) => e.type === 'qr'));
            const audioClipCount = template.audioClips?.length ?? 0;

            return (
              <div
                key={template.id}
                onMouseEnter={() => {
                  // Touch browsers may synthesize mouseenter/mouseleave around a tap.
                  // Keep tap-controlled previews alive on phones; hover previews are desktop-only.
                  if (coverVideo && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                    startCoverStoryPreview(template.id);
                  }
                }}
                onMouseLeave={() => {
                  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
                    stopCoverStoryPreview(template.id);
                  }
                }}
                className="group relative overflow-hidden rounded-3xl border border-[#eaeaea] bg-gradient-to-b from-[#f5f5f5] to-[#ececec] p-3.5 pb-5 shadow-[0_14px_30px_-24px_rgba(0,0,0,0.38)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c89b4f]/60 hover:shadow-[0_18px_34px_-22px_rgba(35,20,22,0.24)] flex flex-col justify-between"
              >
                {/* Same soft phone stage and card proportions as the NIMANTRAN gallery. */}
                <div className="tpl-stage relative aspect-[472/720] w-full overflow-hidden rounded-2xl bg-gradient-to-b from-[#fbf4ee] to-[#f2e5da]">

                  {/* Top Floating Suite Badges */}
                  <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between gap-2 z-20 px-1">
                    <span className="inline-flex max-w-[58%] items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 border border-[#e5ddd6] text-[9px] font-semibold text-[#5c4649] tracking-wide uppercase shadow-sm truncate">
                      <Crown className="w-2.5 h-2.5 text-[#c89b4f]" />
                      <span>{meta.editionTag}</span>
                    </span>

                    <span className="flex items-center gap-1.5">
                      {audioClipCount > 0 && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 border border-[#eadfd8] text-[9px] font-medium text-[#5c4649] shadow-sm">
                          <Music className="w-2.5 h-2.5 text-[#8f1d21]" />
                          <span>{audioClipCount} original cues</span>
                        </span>
                      )}
                      {hasQr && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 border border-[#eadfd8] text-[9px] font-medium text-[#5c4649] shadow-sm">
                          <QrCode className="w-2.5 h-2.5 text-[#c89b4f]" />
                          <span>Live GPS QR</span>
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Authentic Miniature Invitation Frame */}
                  <div
                    onClick={() => {
                      // On phones, tapping a template should enter the editor directly.
                      // The explicit “Play cover preview” control remains available for video.
                      const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
                      if (!isMobileViewport && coverVideo && (activeSlideIdx === 0 || isVideoStoryPreviewing)) {
                        if (isVideoStoryPreviewing) stopCoverStoryPreview(template.id);
                        else startCoverStoryPreview(template.id);
                        return;
                      }
                      onOpenEditorWithTemplate(template, displayedSlideIdx);
                    }}
                    className={`${INVITATION_PHONE_FRAME_CLASS} !absolute !inset-x-0 !left-0 !right-0 !top-[8%] z-10 !mx-auto !translate-x-0 cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]`} style={{ position: "absolute", left: 0, right: 0, top: "8%", marginLeft: "auto", marginRight: "auto", transform: "none" }}
                    title={coverVideo && (activeSlideIdx === 0 || isVideoStoryPreviewing) ? 'Tap to play or pause the cover and slide preview' : 'Click to personalize this slide in Studio'}
                  >
                    <div className={`${INVITATION_PHONE_SCREEN_CLASS} flex items-center justify-center`}>
                      <MiniCardArtwork
                        page={getHomePreviewPage(currentPage)}
                        aspectRatio={template.aspectRatio}
                        targetWidth={230}
                        maxHeight={460}
                        fitPhoneScreen
                        playVideoPreview={isCoverVideoPreviewing}
                      />
                      <span aria-hidden="true" className={INVITATION_PHONE_NOTCH_CLASS} />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-black/90 via-black/45 to-transparent px-2.5 pb-2.5 pt-8 text-center text-[#fffaf5]">
                        <p className="truncate font-serif text-xs font-semibold leading-tight text-[#fffaf5]">{meta.coupleOrHighlight}</p>
                        <p className="mt-0.5 truncate text-[8px] font-semibold uppercase tracking-[.12em] text-[#e8c979]">Tap to customize</p>
                      </div>
                    </div>

                    {coverVideo && activeSlideIdx === 0 && !isVideoStoryPreviewing && (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          startCoverStoryPreview(template.id);
                        }}
                        aria-label="Play cover video and next two slides"
                        aria-pressed={false}
                        className="absolute bottom-2.5 left-1/2 z-50 inline-flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-amber-200/50 bg-black/80 px-3 py-1.5 text-[10px] font-semibold text-amber-100 shadow-lg backdrop-blur-md transition-colors hover:bg-black"
                      >
                        <Play className="h-3 w-3 fill-amber-300 text-amber-300" aria-hidden="true" />
                        <span>Play story preview</span>
                      </button>
                    )}

                    {/* Subtle Hover Action Pill Over Artwork */}
                    <div className={`${isVideoStoryPreviewing ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-0 group-hover/card:opacity-100'} transition-all duration-200 absolute inset-0 rounded-[18px] bg-black/55 backdrop-blur-[2px] flex flex-col items-center justify-center gap-2 p-4 z-40`}>
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
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white/95 px-2.5 py-1.5 rounded-full border border-[#eadfd8] shadow-sm z-20">
                      <span className="text-[9px] font-semibold text-[#5c4649] uppercase tracking-wider mr-1">
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
                              stopCoverStoryPreview(template.id);
                            }}
                            className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all cursor-pointer flex items-center justify-center ${
                              isSlideActive
                                ? 'bg-[#8f1d21] text-white shadow-sm scale-105'
                                : 'bg-[#f3eae3] text-[#5c4649] hover:text-[#8f1d21] border border-[#eadfd8]'
                            }`}
                            title={pg.title || `Slide ${sIdx + 1}`}
                          >
                            {sIdx + 1}
                          </button>
                        );
                      })}
                    </div>
                  ) : null}
                </div>

                {/* Match NIMANTRAN's title/price row and category/action row. */}
                <div className="px-1.5 pt-[18px]">
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      onClick={() => onOpenEditorWithTemplate(template, activeSlideIdx)}
                      className="min-w-0 truncate font-serif text-[20px] font-semibold leading-tight text-[#231416] cursor-pointer"
                    >
                      {meta.cleanTitle}{' '}
                      <span className="font-tiro text-[14px] font-normal text-[#838383]">{meta.hindiSubtitle}</span>
                    </h3>
                    <span className="shrink-0 rounded-full bg-[#131113] px-4 py-2 text-[13px] font-semibold text-[#fffaf5]">
                      <span className="font-bold text-[#4ade80]">FREE</span>
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <span className="mt-[14px] inline-block max-w-[45%] truncate rounded-full border border-[#d8c8aa] bg-[#f2ead9]/60 px-3.5 py-1.5 text-xs text-[#4a3b2f]">
                      {galleryCategoryLabel}
                    </span>
                    <div className="mt-[14px] inline-flex shrink-0 items-center gap-2">
                      {isMultiSlide && (
                        <button
                          onClick={() => onOpenVideoCard(template)}
                          aria-label={`Play ${template.pages.length}-slide video suite`}
                          title="Play animated video invitation"
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dcdcdc] bg-white text-[#8f1d21] hover:border-[#8f1d21] transition-colors cursor-pointer"
                        >
                          <Play className="h-4 w-4 fill-current" />
                        </button>
                      )}
                      <button
                        onClick={() => onOpenEditorWithTemplate(template, activeSlideIdx)}
                        aria-label={`Customize ${meta.cleanTitle}`}
                        title="Customize this suite"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#dcdcdc] bg-white text-[#565656] hover:border-[#8f1d21] hover:text-[#8f1d21] transition-colors cursor-pointer"
                      >
                        <Palette className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setPreviewTemplate(template);
                          setPreviewSlideIdx(activeSlideIdx);
                        }}
                        className="inline-flex items-center gap-1 text-[13px] font-medium text-[#565656] hover:text-[#231416] transition-colors cursor-pointer whitespace-nowrap"
                        title="Open template preview"
                      >
                        <span>View template</span>
                        <ArrowRight className="h-4 w-4 -rotate-45" />
                      </button>
                    </div>
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
      <section id="how-it-works" className="py-20 px-4 sm:px-6 relative overflow-hidden bg-[#FBF6F3] border-t border-b border-[#EADFD8]">
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
      <section id="royal-standard" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto w-full relative">
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
      <section id="studio-testimonials" className="py-20 px-4 sm:px-6 bg-[#FBF6F3] border-t border-b border-[#EADFD8] relative">
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
      <section id="studio-faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto w-full">
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
      </main>

      <div className="mt-auto border-t border-[#EFE7DC] bg-[#FBF7F2] px-5 py-14 sm:px-8 sm:py-16">
        <SaathFooter
          onSelectTheme={(theme) => window.location.assign(`/${theme.slug}`)}
          onNavigateStudioHome={scrollToSiteSection}
          variant="card-studio"
          onCreateBlank={openBlankInvitation}
          onOpenAstrology={onOpenAstrology}
          onOpenVideoSuite={() => onOpenVideoCard()}
        />
      </div>

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


