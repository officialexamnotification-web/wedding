import React, { useState } from 'react';
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
} from 'lucide-react';
import {
  CardTemplate,
  CanvasItem,
  TextElement,
  ImageElement,
  StickerElement,
  QrElement,
  ShapeElement,
  CardPage,
  AspectRatioType,
  CANVAS_SIZES,
  ShapeVariant,
} from '../types/editor';
import { TEMPLATE_CATEGORIES, INITIAL_TEMPLATES } from '../data/templates';
import { STICKER_CATEGORIES, STICKERS, StickerDefinition } from '../data/stickers';
import { BACKGROUNDS } from '../data/backgrounds';
import { generateQrDataUrl } from '../utils/qrHelper';

export type SidebarTab =
  | 'templates'
  | 'elements'
  | 'text'
  | 'photos'
  | 'backgrounds'
  | 'layers'
  | 'qr'
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
}

const SHAPE_PRESETS: {
  shapeType: ShapeVariant;
  label: string;
  desc: string;
  width: number;
  height: number;
  strokeWidth: number;
  fillColor?: string;
}[] = [
  {
    shapeType: 'gold-frame',
    label: 'Royal Corner Frame',
    desc: 'Full card gold border',
    width: 410,
    height: 760,
    strokeWidth: 2,
  },
  {
    shapeType: 'ornate-border',
    label: 'Double Ornate Border',
    desc: 'Double line palace frame',
    width: 390,
    height: 740,
    strokeWidth: 3,
  },
  {
    shapeType: 'divider-line',
    label: 'Diamond Divider Line',
    desc: 'Section ornament rule',
    width: 280,
    height: 24,
    strokeWidth: 2,
  },
  {
    shapeType: 'arch-frame',
    label: 'Jharokha Arch Frame',
    desc: 'Rajasthani arch outline',
    width: 220,
    height: 280,
    strokeWidth: 2,
  },
  {
    shapeType: 'royal-badge',
    label: 'Royal Seal Medallion',
    desc: 'Starburst wedding seal',
    width: 140,
    height: 140,
    strokeWidth: 2,
    fillColor: 'rgba(212, 175, 55, 0.14)',
  },
  {
    shapeType: 'pill-banner',
    label: 'Event Pill Banner',
    desc: 'Tag for dates & hashtags',
    width: 240,
    height: 44,
    strokeWidth: 2,
    fillColor: 'rgba(26, 4, 8, 0.75)',
  },
  {
    shapeType: 'rectangle',
    label: 'Gold Card Box',
    desc: 'Backdrop box for text',
    width: 320,
    height: 160,
    strokeWidth: 2,
    fillColor: 'rgba(20, 5, 10, 0.65)',
  },
  {
    shapeType: 'circle',
    label: 'Sacred Circle Ring',
    desc: 'Monogram / couple ring',
    width: 150,
    height: 150,
    strokeWidth: 2,
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
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('templates');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [templateCategory, setTemplateCategory] = useState<string>('all');
  const [stickerCategory, setStickerCategory] = useState<string>('all');
  const [stickerSearch, setStickerSearch] = useState<string>('');
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([]);

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

  const totalDuration = (pages.length * 4.5).toFixed(1);

  // QR state
  const [qrType, setQrType] = useState<'maps' | 'rsvp' | 'custom'>('maps');
  const [mapsLocation, setMapsLocation] = useState<string>(
    'The Leela Palace, Chanakyapuri, New Delhi'
  );
  const [rsvpPhone, setRsvpPhone] = useState<string>('+91 98765 43210');
  const [rsvpMessage, setRsvpMessage] = useState<string>(
    'Attending the wedding! Count us in for 2 guests.'
  );
  const [customQrUrl, setCustomQrUrl] = useState<string>('https://invitationbazaar.com');
  const [qrColor, setQrColor] = useState<string>('#1a0408');
  const [qrBgColor, setQrBgColor] = useState<string>('#FFF4D6');

  // Photo URL / Upload
  const [customPhotoUrl, setCustomPhotoUrl] = useState<string>('');
  const [customSolidBg, setCustomSolidBg] = useState<string>('#3d0510');

  const handleTabClick = (tab: SidebarTab) => {
    if (activeTab === tab && isDrawerOpen) {
      setIsDrawerOpen(false);
    } else {
      setActiveTab(tab);
      setIsDrawerOpen(true);
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
    color = '#F5D77F'
  ) => {
    const width = Math.min(dimensions.width - 60, 360);
    const newText: TextElement = {
      id: `text-${Date.now()}`,
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
      height: Math.max(42, Math.round(fontSize * 2.2)),
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 5,
    };
    onAddElement(newText);
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
  const handleAddPhoto = (url: string, mask: ImageElement['mask'] = 'arch') => {
    const newImg: ImageElement = {
      id: `img-${Date.now()}`,
      type: 'image',
      src: url,
      mask,
      borderWidth: 2,
      borderColor: '#D4AF37',
      borderRadius: mask === 'rounded' ? 16 : 0,
      x: Math.round((dimensions.width - 190) / 2),
      y: Math.round(dimensions.height * 0.25),
      width: 190,
      height: 210,
      rotation: 0,
      opacity: 1,
      zIndex: (currentPage?.elements.length || 5) + 4,
    };
    onAddElement(newImg);
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
    { id: 'templates' as SidebarTab, label: 'Templates', icon: LayoutTemplate },
    { id: 'elements' as SidebarTab, label: 'Elements', icon: Shapes },
    { id: 'text' as SidebarTab, label: 'Text', icon: Type },
    { id: 'photos' as SidebarTab, label: 'Uploads', icon: ImageIcon },
    { id: 'backgrounds' as SidebarTab, label: 'Bg / Paper', icon: Palette },
    { id: 'layers' as SidebarTab, label: 'Layers', icon: Layers },
    { id: 'qr' as SidebarTab, label: 'QR Code', icon: QrCode },
    { id: 'slides' as SidebarTab, label: 'Slides', icon: Film },
  ];

  // Get readable element summary for Layers panel
  const getElementLabel = (el: CanvasItem): string => {
    if (el.type === 'text') return (el as TextElement).text.slice(0, 26) || 'Text Box';
    if (el.type === 'sticker') return (el as StickerElement).name;
    if (el.type === 'image') return `Photo (${(el as ImageElement).mask})`;
    if (el.type === 'qr') return `QR: ${(el as QrElement).label}`;
    if (el.type === 'shape') return `Shape: ${(el as ShapeElement).shapeType}`;
    return 'Element';
  };

  return (
    <>
      {/* ================= DESKTOP DOCK & FLYOUT DRAWER (md:flex) ================= */}
      <div className="hidden md:flex h-full select-none shrink-0 z-40 relative">
        {/* Far-Left Activity Rail (Canva Style) */}
        <div className="w-18 bg-neutral-950 border-r border-neutral-800/80 flex flex-col items-center py-2.5 gap-1 z-20 shrink-0 overflow-y-auto">
          {TABS_CONFIG.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id && isDrawerOpen;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`w-15 py-2 px-1 rounded-xl flex flex-col items-center gap-1 transition-all group ${
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
          <aside className="w-80 sm:w-84 bg-neutral-900 border-r border-neutral-800 flex flex-col h-full shadow-2xl relative shrink-0">
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
      <div className="md:hidden fixed bottom-0 inset-x-0 h-16 bg-neutral-950 border-t border-neutral-800/90 flex items-center justify-around px-1 z-40 select-none shadow-2xl overflow-x-auto">
        {TABS_CONFIG.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && isDrawerOpen;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsDrawerOpen(true);
              }}
              className={`flex-1 min-w-[52px] py-1 flex flex-col items-center justify-center gap-0.5 rounded-lg transition-colors ${
                isActive ? 'text-amber-300 font-bold' : 'text-neutral-400 hover:text-neutral-200'
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
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  {TABS_CONFIG.find((t) => t.id === activeTab)?.label}
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
        {/* ================= 1. TEMPLATES TAB ================= */}
        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Ready Card Templates</h3>
              <p className="text-xs text-neutral-400">Click any design to load all pages in editor</p>
            </div>

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
                      <span className="text-[11px] text-amber-400 font-semibold group-hover:underline shrink-0">
                        Use Template →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= 2. ELEMENTS (SHAPES, FRAMES & MOTIFS) TAB ================= */}
        {activeTab === 'elements' && (
          <div className="space-y-5">
            {/* Shapes & Frames Section */}
            <div className="space-y-2.5">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Canva Shapes, Borders & Frames
                </h3>
                <p className="text-xs text-neutral-400">
                  Add royal borders, arches, badges, dividers & text boxes
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {SHAPE_PRESETS.map((preset) => (
                  <button
                    key={preset.shapeType}
                    onClick={() => handleAddShape(preset)}
                    className="p-2.5 rounded-xl border border-neutral-700/80 hover:border-amber-400 bg-neutral-800/70 hover:bg-neutral-800 text-left transition flex flex-col justify-between group"
                  >
                    <span className="text-xs font-semibold text-amber-300 group-hover:text-amber-200">
                      + {preset.label}
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-0.5">{preset.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Traditional Indian Motifs & Stickers */}
            <div className="space-y-3 pt-3 border-t border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Indian Royal Motifs & Stickers
                </h3>
                <p className="text-xs text-neutral-400">
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

              <div className="grid grid-cols-3 gap-2">
                {filteredStickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() => handleAddSticker(sticker)}
                    className="p-2.5 rounded-xl border border-neutral-700/80 hover:border-amber-400 bg-neutral-800/80 hover:bg-neutral-800 flex flex-col items-center justify-center gap-1.5 group transition"
                    title={`Add ${sticker.name}`}
                  >
                    <div
                      className="w-10 h-10 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform [&>svg]:w-full [&>svg]:h-full"
                      dangerouslySetInnerHTML={{ __html: sticker.svg }}
                    />
                    <span className="text-[10px] text-neutral-300 text-center truncate w-full">
                      {sticker.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. TEXT & SHLOKAS TAB ================= */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-neutral-100">
                  Typography & Sanskrit Shlokas
                </h3>
                <p className="text-xs text-neutral-400">Click any style to add to your card</p>
              </div>
            </div>

            {onOpenAiCopy && (
              <button
                onClick={onOpenAiCopy}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
              >
                <Wand2 className="w-4 h-4" />
                <span>AI Wedding Copywriter & Shloka Generator</span>
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
                    'Cordially invite you to grace the auspicious celebration',
                    "'Playfair Display', serif",
                    15,
                    'normal',
                    '#E6C665'
                  )
                }
                className="w-full py-2 px-3 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400 rounded-xl text-left transition font-playfair text-sm text-neutral-200"
              >
                + Add Subheading / Invitation Line
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
                + Add Date, Time & Venue Details
              </button>
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
                    label: 'Griha Pravesh Shloka',
                    text: '॥ शुभ गृह प्रवेशाय नमः ॥',
                    font: "'Rozha One', serif",
                    size: 18,
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

        {/* ================= 4. PHOTOS & UPLOADS TAB ================= */}
        {activeTab === 'photos' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Uploads & Celebration Photos</h3>
              <p className="text-xs text-neutral-400">
                Upload from device or add with royal arch, heart, or circle frames
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

        {/* ================= 5. BACKGROUNDS & PAPER TAB ================= */}
        {activeTab === 'backgrounds' && (
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

        {/* ================= 6. CANVA LAYERS & POSITION TAB ================= */}
        {activeTab === 'layers' && (
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
                        {/* Move Layer Up */}
                        <button
                          onClick={() =>
                            onUpdateElement(el.id, { zIndex: (el.zIndex || 1) + 1 }, true)
                          }
                          className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
                          title="Bring Forward"
                        >
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        {/* Move Layer Down */}
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
                        {/* Lock/Unlock */}
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
                        {/* Show/Hide */}
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
                        {/* Duplicate */}
                        <button
                          onClick={() => onDuplicateElementById(el.id)}
                          className="p-1 hover:bg-neutral-700 rounded text-neutral-400 hover:text-white"
                          title="Duplicate Layer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {/* Delete */}
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

        {/* ================= 7. QR CODES TAB ================= */}
        {activeTab === 'qr' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-neutral-100">Event QR Code Generator</h3>
              <p className="text-xs text-neutral-400">
                Generate scannable Google Maps venue, WhatsApp RSVP, or custom URL QR
              </p>
            </div>

            <div className="grid grid-cols-3 rounded-lg bg-neutral-800 p-1 border border-neutral-700 gap-1">
              <button
                onClick={() => setQrType('maps')}
                className={`py-1.5 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition ${
                  qrType === 'maps'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>Maps</span>
              </button>
              <button
                onClick={() => setQrType('rsvp')}
                className={`py-1.5 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition ${
                  qrType === 'rsvp'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <MessageSquare className="w-3 h-3" />
                <span>RSVP</span>
              </button>
              <button
                onClick={() => setQrType('custom')}
                className={`py-1.5 rounded-md text-[11px] font-medium flex items-center justify-center gap-1 transition ${
                  qrType === 'custom'
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <QrCode className="w-3 h-3" />
                <span>Website</span>
              </button>
            </div>

            {qrType === 'maps' && (
              <div className="space-y-2">
                <label className="text-xs text-neutral-300 font-medium">
                  Venue Name or Google Maps Link:
                </label>
                <input
                  type="text"
                  value={mapsLocation}
                  onChange={(e) => setMapsLocation(e.target.value)}
                  placeholder="e.g. The Taj Mahal Palace, Mumbai"
                  className="w-full bg-neutral-800 text-xs px-3 py-2 rounded-lg border border-neutral-700 focus:border-amber-500 outline-none text-neutral-200"
                />
              </div>
            )}

            {qrType === 'rsvp' && (
              <div className="space-y-2">
                <div>
                  <label className="text-xs text-neutral-300 font-medium">
                    WhatsApp Number (with Country Code):
                  </label>
                  <input
                    type="text"
                    value={rsvpPhone}
                    onChange={(e) => setRsvpPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-neutral-800 text-xs px-3 py-2 rounded-lg border border-neutral-700 focus:border-amber-500 outline-none text-neutral-200"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-300 font-medium">RSVP Message:</label>
                  <textarea
                    rows={2}
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    className="w-full bg-neutral-800 text-xs px-3 py-2 rounded-lg border border-neutral-700 focus:border-amber-500 outline-none text-neutral-200"
                  />
                </div>
              </div>
            )}

            {qrType === 'custom' && (
              <div className="space-y-2">
                <label className="text-xs text-neutral-300 font-medium">Website / Video Link:</label>
                <input
                  type="text"
                  value={customQrUrl}
                  onChange={(e) => setCustomQrUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full bg-neutral-800 text-xs px-3 py-2 rounded-lg border border-neutral-700 focus:border-amber-500 outline-none text-neutral-200"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">QR Color:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={qrColor}
                    onChange={(e) => setQrColor(e.target.value)}
                    className="w-7 h-7 rounded border border-neutral-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-neutral-300">{qrColor}</span>
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Background:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={qrBgColor}
                    onChange={(e) => setQrBgColor(e.target.value)}
                    className="w-7 h-7 rounded border border-neutral-700 cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-mono text-neutral-300">{qrBgColor}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleAddQr}
              className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold text-xs rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Generate & Insert QR Code
            </button>
          </div>
        )}

        {/* ================= 8. VIDEO SLIDES TIMELINE TAB ================= */}
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
                        4.5s
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
