import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  X,
  ChevronRight,
  ChevronLeft,
  Star,
  Clock,
  Play,
  Square,
  Sparkles,
  Check,
  Filter,
  Volume2,
  Box,
  Layers,
} from 'lucide-react';
import {
  MainElementCategoryId,
  ShapeSubcategoryId,
  GraphicSubcategoryId,
  UniversalElementItem,
  ShapeAssetItem,
  GraphicAssetItem,
  PhotoAssetItem,
  VideoAssetItem,
  AudioAssetItem,
  FrameAssetItem,
  GridAssetItem,
  ChartAssetItem,
  FormAssetItem,
  SheetAssetItem,
  TableAssetItem,
  AnimationAssetItem,
  MockupAssetItem,
  Model3DAssetItem,
} from '../types/elements';
import {
  MAIN_ELEMENT_CATEGORIES,
  SHAPE_SUBCATEGORIES,
  GRAPHIC_SUBCATEGORIES,
  ALL_UNIVERSAL_ELEMENTS,
  SHAPES_LIBRARY_ITEMS,
  GRAPHICS_LIBRARY_ITEMS,
  getItemsByCategory,
  getShapesBySubcategory,
  getGraphicsBySubcategory,
  searchElementsCatalogue,
} from '../data/elements';
import {
  CanvasItem,
  CanvasDimensions,
  FrameElement,
  GridElement,
  MockupElement,
} from '../types/editor';

interface ElementsLibraryPanelProps {
  dimensions: CanvasDimensions;
  onAddElement: (item: CanvasItem) => void;
  selectedElement?: CanvasItem | null;
  onUpdateElement?: (id: string, updates: Partial<CanvasItem>) => void;
}

export const ElementsLibraryPanel: React.FC<ElementsLibraryPanelProps> = ({
  dimensions,
  onAddElement,
  selectedElement,
  onUpdateElement,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<MainElementCategoryId | 'home'>('home');
  const [activeShapeSub, setActiveShapeSub] = useState<ShapeSubcategoryId | 'all'>('all');
  const [activeGraphicSub, setActiveGraphicSub] = useState<GraphicSubcategoryId | 'all'>('all');
  const [recentIds, setRecentIds] = useState<string[]>([
    'shape-lines-05',
    'graphic-celebration-festive-01',
    'frame-01',
    'model3d-01',
  ]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([
    'graphic-flowers-botanicals-01',
    'frame-03',
  ]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioTimerRef = useRef<number | null>(null);

  const trackRecent = (id: string) => {
    setRecentIds((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, 16));
  };

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [id, ...prev]
    );
  };

  const stopAudioPreview = () => {
    if (audioTimerRef.current) {
      window.clearInterval(audioTimerRef.current);
      audioTimerRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setPlayingAudioId(null);
  };

  const playAudioPreview = (e: React.MouseEvent, item: AudioAssetItem) => {
    e.stopPropagation();
    if (playingAudioId === item.id) {
      stopAudioPreview();
      return;
    }
    stopAudioPreview();
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      setPlayingAudioId(item.id);
      let step = 0;
      const playNote = () => {
        if (!audioCtxRef.current) return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type =
          item.subcategory === 'shehnai'
            ? 'sawtooth'
            : item.subcategory === 'flute'
            ? 'sine'
            : 'triangle';
        const freq = item.ragaNotes[step % item.ragaNotes.length] || 330;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.36);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.38);
        step++;
        if (step > 12) stopAudioPreview();
      };
      playNote();
      const intervalMs = Math.max(180, Math.round((60 / (item.tempo || 110)) * 450));
      audioTimerRef.current = window.setInterval(playNote, intervalMs);
    } catch {
      setPlayingAudioId(null);
    }
  };

  // Insert any of the 1,117 items onto the active Canvas page
  const handleInsertItem = (item: UniversalElementItem) => {
    trackRecent(item.id);
    const uid = `${item.category}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const cx = Math.round(dimensions.width / 2);
    const cy = Math.round(dimensions.height / 2);

    switch (item.category) {
      case 'shapes': {
        const s = item as ShapeAssetItem;
        const isLine = s.subcategory === 'lines';
        const w = isLine ? 240 : 130;
        const h = isLine ? 44 : 130;
        onAddElement({
          id: uid,
          type: 'shape',
          shapeType: s.id,
          shapeName: s.name,
          svgPath: s.svgPath,
          svgFilePath: s.filePath,
          x: cx - Math.round(w / 2),
          y: cy - Math.round(h / 2),
          width: w,
          height: h,
          rotation: 0,
          opacity: 1,
          zIndex: 30,
          strokeColor: s.defaultStroke || '#D4AF37',
          strokeWidth: 2,
          fillColor: s.defaultFill || '#D4AF37',
        });
        break;
      }

      case 'graphics': {
        const g = item as GraphicAssetItem;
        const isToran = g.subcategory === 'torans-bandhanwar' || g.id.startsWith('toran-') || g.name.toLowerCase().includes('toran') || g.name.toLowerCase().includes('bandhanwar');
        const w = isToran ? Math.min(dimensions.width - 24, 380) : 110;
        const h = isToran ? Math.round(w * 0.31) : 110;
        onAddElement({
          id: uid,
          type: 'sticker',
          stickerId: g.id,
          name: g.name,
          category: isToran ? 'torans' : 'wedding',
          svgContent: g.svgContent,
          color: g.defaultColor || '#D4AF37',
          x: cx - Math.round(w / 2),
          y: isToran ? 14 : cy - 55,
          width: w,
          height: h,
          rotation: 0,
          opacity: 1,
          zIndex: 35,
        });
        break;
      }

      case 'photos': {
        const p = item as PhotoAssetItem;
        // If user currently has a Frame, Grid, or Mockup selected on canvas, drop the photo straight into it!
        if (selectedElement && onUpdateElement) {
          if (selectedElement.type === 'frame') {
            onUpdateElement(selectedElement.id, { imageSrc: p.src } as Partial<FrameElement>);
            return;
          }
          if (selectedElement.type === 'mockup') {
            onUpdateElement(selectedElement.id, { contentImageSrc: p.src } as Partial<MockupElement>);
            return;
          }
          if (selectedElement.type === 'grid') {
            const gr = selectedElement as GridElement;
            const nextImgs = [...(gr.images || [])];
            nextImgs.unshift(p.src);
            onUpdateElement(selectedElement.id, { images: nextImgs.slice(0, 9) } as Partial<GridElement>);
            return;
          }
        }
        const w = p.aspectRatio === 'landscape' ? 240 : 180;
        const h = p.aspectRatio === 'portrait' ? 230 : 180;
        onAddElement({
          id: uid,
          type: 'image',
          src: p.src,
          alt: p.name,
          mask: 'rounded',
          borderRadius: 12,
          borderWidth: 2,
          borderColor: '#D4AF37',
          filter: p.filterCSS && p.filterCSS !== 'none' ? p.filterCSS : undefined,
          x: cx - Math.round(w / 2),
          y: cy - Math.round(h / 2),
          width: w,
          height: h,
          rotation: 0,
          opacity: 1,
          zIndex: 25,
        });
        break;
      }

      case 'videos': {
        const v = item as VideoAssetItem;
        onAddElement({
          id: uid,
          type: 'video',
          videoId: v.id,
          videoName: v.name,
          visualTheme: v.visualTheme,
          primaryColor: v.primaryColor,
          secondaryColor: v.secondaryColor,
          bgGradient: v.bgGradient,
          isPlaying: true,
          isMuted: true,
          loop: true,
          playbackSpeed: 1,
          borderRadius: 14,
          borderColor: '#D4AF37',
          borderWidth: 2,
          x: cx - 120,
          y: cy - 85,
          width: 240,
          height: 170,
          rotation: 0,
          opacity: 1,
          zIndex: 26,
        });
        break;
      }

      case 'audio': {
        const a = item as AudioAssetItem;
        onAddElement({
          id: uid,
          type: 'audio',
          audioId: a.id,
          trackName: a.name,
          category: a.subcategory,
          ragaNotes: a.ragaNotes,
          tempo: a.tempo,
          accentColor: a.accentColor,
          backgroundColor: 'rgba(20, 8, 12, 0.92)',
          isPlaying: false,
          volume: 0.8,
          x: cx - 135,
          y: cy - 34,
          width: 270,
          height: 68,
          rotation: 0,
          opacity: 1,
          zIndex: 42,
        });
        break;
      }

      case 'frames': {
        const f = item as FrameAssetItem;
        onAddElement({
          id: uid,
          type: 'frame',
          frameId: f.id,
          frameName: f.name,
          clipPathSvg: f.clipPathSvg,
          borderSvg: f.borderSvg,
          imageSrc: '/images/wedding_couple_1791965341379.jpg',
          imageScale: 1,
          imageOffsetX: 0,
          imageOffsetY: 0,
          borderColor: f.defaultBorderColor || '#D4AF37',
          borderWidth: 2.5,
          x: cx - 105,
          y: cy - 115,
          width: 210,
          height: 230,
          rotation: 0,
          opacity: 1,
          zIndex: 28,
        });
        break;
      }

      case 'grids': {
        const gr = item as GridAssetItem;
        const samplePool = [
          '/images/wedding_couple_1791965341379.jpg',
          '/images/sangeet_haldi_1791965342768.jpg',
          '/images/royal_mandap_decor_1791977898319.jpg',
          '/images/royal_sangeet_decor_1791977896632.jpg',
          '/images/royal_reception_decor_1791977898430.jpg',
          '/images/griha_pravesh_1791965341528.jpg',
          '/images/royal_mandap_cover.webp',
          '/images/royal_vivah_peacocks.webp',
          '/images/royal_ganesh_blessings.webp',
        ];
        onAddElement({
          id: uid,
          type: 'grid',
          gridLayout: gr.id,
          gridName: gr.name,
          slots: gr.slots,
          images: gr.slots.map((_, i) => samplePool[i % samplePool.length]),
          gap: gr.defaultGap,
          borderRadius: gr.defaultRadius,
          borderColor: '#D4AF37',
          borderWidth: 1.5,
          backgroundColor: 'rgba(212,175,55,0.08)',
          x: cx - 140,
          y: cy - 125,
          width: 280,
          height: 250,
          rotation: 0,
          opacity: 1,
          zIndex: 27,
        });
        break;
      }

      case 'charts': {
        const ch = item as ChartAssetItem;
        onAddElement({
          id: uid,
          type: 'chart',
          chartType: ch.chartType,
          title: ch.title,
          data: ch.data.map((d) => ({ ...d })),
          showLegend: true,
          showValues: true,
          textColor: '#FDE68A',
          backgroundColor: 'rgba(22, 6, 10, 0.90)',
          borderColor: '#D4AF37',
          x: cx - 150,
          y: cy - 105,
          width: 300,
          height: 210,
          rotation: 0,
          opacity: 1,
          zIndex: 32,
        });
        break;
      }

      case 'forms': {
        const fm = item as FormAssetItem;
        onAddElement({
          id: uid,
          type: 'form',
          formId: fm.id,
          formTitle: fm.formTitle,
          formSubtitle: fm.formSubtitle,
          fields: fm.fields.map((f) => ({ ...f })),
          submitLabel: fm.submitLabel,
          accentColor: fm.accentColor,
          backgroundColor: fm.backgroundColor,
          borderColor: fm.borderColor,
          textColor: '#FFFBEB',
          submittedCount: 1,
          x: cx - 145,
          y: cy - 130,
          width: 290,
          height: 260,
          rotation: 0,
          opacity: 1,
          zIndex: 36,
        });
        break;
      }

      case 'sheets': {
        const sh = item as SheetAssetItem;
        onAddElement({
          id: uid,
          type: 'sheet',
          sheetId: sh.id,
          sheetTitle: sh.sheetTitle,
          columns: [...sh.columns],
          cells: sh.cells.map((r) => [...r]),
          headerBgColor: sh.headerBgColor,
          accentColor: sh.accentColor,
          textColor: '#FFFBEB',
          backgroundColor: 'rgba(18, 8, 12, 0.94)',
          borderColor: '#D4AF37',
          showFormulas: false,
          x: cx - 165,
          y: cy - 110,
          width: 330,
          height: 220,
          rotation: 0,
          opacity: 1,
          zIndex: 34,
        });
        break;
      }

      case 'tables': {
        const tb = item as TableAssetItem;
        onAddElement({
          id: uid,
          type: 'table',
          rows: tb.rows.map((r) => [...r]),
          headerBgColor: tb.headerBgColor,
          headerTextColor: tb.headerTextColor,
          cellBgColor: tb.cellBgColor,
          altRowBgColor: tb.altRowBgColor,
          textColor: tb.textColor,
          borderColor: tb.borderColor,
          borderWidth: 1,
          fontSize: 11,
          fontFamily: "'Cinzel', serif",
          borderRadius: 10,
          cellPadding: 6,
          x: cx - 170,
          y: cy - 105,
          width: 340,
          height: 210,
          rotation: 0,
          opacity: 1,
          zIndex: 33,
        });
        break;
      }

      case 'animations': {
        const an = item as AnimationAssetItem;
        if (selectedElement && onUpdateElement) {
          onUpdateElement(selectedElement.id, {
            animation: an.animationType,
            animationSpeed: an.speed,
            animationTiming: an.timing,
            animationDirection: an.direction,
          });
        } else {
          // Insert an animated royal celebratory badge element if no element is currently selected
          onAddElement({
            id: uid,
            type: 'text',
            text: `✨ ${an.name} ✨`,
            fontFamily: "'Cinzel', serif",
            fontSize: 22,
            color: '#FDE68A',
            fontWeight: 'bold',
            fontStyle: 'normal',
            textAlign: 'center',
            letterSpacing: 2,
            lineHeight: 1.3,
            animation: an.animationType,
            animationSpeed: an.speed,
            animationTiming: an.timing,
            animationDirection: an.direction,
            x: cx - 140,
            y: cy - 30,
            width: 280,
            height: 60,
            rotation: 0,
            opacity: 1,
            zIndex: 40,
          });
        }
        break;
      }

      case 'mockups': {
        const mk = item as MockupAssetItem;
        onAddElement({
          id: uid,
          type: 'mockup',
          mockupId: mk.id,
          mockupName: mk.name,
          subcategory: mk.subcategory,
          frameSvg: mk.frameSvg,
          screenRect: { ...mk.screenRect },
          contentImageSrc: '/images/royal_mandap_cover.webp',
          caption: mk.defaultCaption,
          accentColor: mk.accentColor,
          imageScale: 1,
          x: cx - 115,
          y: cy - 135,
          width: 230,
          height: 270,
          rotation: 0,
          opacity: 1,
          zIndex: 31,
        });
        break;
      }

      case '3d': {
        const m3 = item as Model3DAssetItem;
        onAddElement({
          id: uid,
          type: 'model3d',
          modelId: m3.id,
          modelName: m3.name,
          geometryType: m3.geometryType,
          primaryColor: m3.primaryColor,
          secondaryColor: m3.secondaryColor,
          metalness: m3.metalness,
          roughness: m3.roughness,
          pitch: m3.defaultPitch,
          yaw: m3.defaultYaw,
          roll: 0,
          autoRotate: true,
          x: cx - 95,
          y: cy - 95,
          width: 190,
          height: 190,
          rotation: 0,
          opacity: 1,
          zIndex: 38,
        });
        break;
      }
    }
  };

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim() && !showFavoritesOnly) return [];
    let list = searchElementsCatalogue(
      searchQuery,
      activeCategory === 'home' ? 'all' : activeCategory
    );
    if (showFavoritesOnly) {
      list = list.filter((it) => favoriteIds.includes(it.id));
    }
    return list;
  }, [searchQuery, activeCategory, showFavoritesOnly, favoriteIds]);

  const recentItems = useMemo(
    () =>
      recentIds
        .map((id) => ALL_UNIVERSAL_ELEMENTS.find((x) => x.id === id))
        .filter((x): x is UniversalElementItem => Boolean(x)),
    [recentIds]
  );

  // Render thumbnail card for any universal element item
  const renderItemCard = (item: UniversalElementItem, compact = false) => {
    const isFav = favoriteIds.includes(item.id);

    return (
      <div
        key={item.id}
        onClick={() => handleInsertItem(item)}
        title={`${item.name} — Click to add to canvas`}
        className={`group relative rounded-xl border border-neutral-700/80 hover:border-amber-400 bg-neutral-800/70 hover:bg-neutral-800 transition-all cursor-pointer flex flex-col items-center justify-between overflow-hidden ${
          compact ? 'p-2 min-h-[78px]' : 'p-2.5 min-h-[96px]'
        }`}
      >
        {/* Favorite Star Toggle */}
        <button
          type="button"
          onClick={(e) => toggleFavorite(e, item.id)}
          className={`absolute top-1.5 right-1.5 z-10 p-1 rounded-full transition ${
            isFav
              ? 'text-amber-400 bg-neutral-900/80 opacity-100'
              : 'text-neutral-400 bg-neutral-900/60 opacity-0 group-hover:opacity-100 hover:text-amber-300'
          }`}
          title={isFav ? 'Remove from Favorites' : 'Save to Favorites'}
        >
          <Star className="w-3 h-3 fill-current" />
        </button>

        {/* Visual Preview Area */}
        <div className="w-full flex-1 flex items-center justify-center py-1">
          {item.category === 'shapes' && (
            <div
              className="w-11 h-11 text-amber-300 group-hover:scale-110 transition-transform [&>svg]:w-full [&>svg]:h-full"
              dangerouslySetInnerHTML={{ __html: (item as ShapeAssetItem).svgPath }}
            />
          )}

          {item.category === 'graphics' && (
            <div
              className={`${
                (item as GraphicAssetItem).subcategory === 'torans-bandhanwar'
                  ? 'w-full h-14 px-1'
                  : 'w-11 h-11'
              } group-hover:scale-105 transition-transform flex items-center justify-center [&>svg]:w-full [&>svg]:h-full`}
              style={{ color: (item as GraphicAssetItem).defaultColor || '#D4AF37' }}
              dangerouslySetInnerHTML={{ __html: (item as GraphicAssetItem).svgContent }}
            />
          )}

          {item.category === 'photos' && (
            <img
              src={(item as PhotoAssetItem).src}
              alt={item.name}
              loading="lazy"
              style={{ filter: (item as PhotoAssetItem).filterCSS }}
              className="w-full h-14 object-cover rounded-lg border border-amber-500/30"
            />
          )}

          {item.category === 'videos' && (
            <div
              className="w-full h-14 rounded-lg relative overflow-hidden flex items-center justify-center border border-purple-400/40"
              style={{ background: (item as VideoAssetItem).bgGradient }}
            >
              <div className="w-6 h-6 rounded-full bg-black/50 border border-amber-300/60 flex items-center justify-center">
                <Play className="w-3 h-3 text-amber-300 fill-amber-300 ml-0.5" />
              </div>
              <span className="absolute bottom-1 right-1 text-[8px] px-1 rounded bg-black/70 text-amber-200 font-mono">
                {(item as VideoAssetItem).durationSec}s
              </span>
            </div>
          )}

          {item.category === 'audio' && (
            <div className="w-full flex items-center justify-between gap-1.5 px-1">
              <button
                type="button"
                onClick={(e) => playAudioPreview(e, item as AudioAssetItem)}
                className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-300 hover:bg-amber-500/30 shrink-0"
                title="Preview WebAudio Raga"
              >
                {playingAudioId === item.id ? (
                  <Square className="w-3.5 h-3.5 fill-current" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
              </button>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-semibold text-amber-100 truncate">
                  {item.name}
                </div>
                <div className="text-[9px] text-neutral-400">
                  {(item as AudioAssetItem).tempo} BPM • {(item as AudioAssetItem).durationLabel}
                </div>
              </div>
            </div>
          )}

          {item.category === 'frames' && (
            <svg viewBox="0 0 100 100" className="w-12 h-12 text-amber-300">
              <defs>
                <clipPath id={`prev-clip-${item.id}`}>
                  <g
                    dangerouslySetInnerHTML={{
                      __html: (item as FrameAssetItem).clipPathSvg,
                    }}
                  />
                </clipPath>
              </defs>
              <g clipPath={`url(#prev-clip-${item.id})`}>
                <rect width="100" height="100" fill="url(#frameGrad)" />
                <circle cx="35" cy="32" r="10" fill="#FDE68A" opacity="0.8" />
                <path d="M 0 85 Q 35 52 65 78 T 100 65 V 100 H 0 Z" fill="#D97706" opacity="0.7" />
              </g>
              <linearGradient id="frameGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#31102F" />
                <stop offset="100%" stopColor="#78350F" />
              </linearGradient>
              <g
                dangerouslySetInnerHTML={{
                  __html: (item as FrameAssetItem).borderSvg || '',
                }}
              />
            </svg>
          )}

          {item.category === 'grids' && (
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              {(item as GridAssetItem).slots.map((s, idx) => (
                <rect
                  key={idx}
                  x={s.x}
                  y={s.y}
                  width={s.w}
                  height={s.h}
                  rx={3}
                  fill={idx % 2 === 0 ? 'rgba(212,175,55,0.35)' : 'rgba(244,63,94,0.3)'}
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                />
              ))}
            </svg>
          )}

          {item.category === 'charts' && (
            <div className="w-full h-12 flex items-end justify-center gap-1 px-2 pt-2">
              {(item as ChartAssetItem).data.map((d, i) => (
                <div
                  key={i}
                  className="w-3 rounded-t"
                  style={{
                    height: `${Math.max(25, Math.min(100, (d.value / 350) * 100))}%`,
                    backgroundColor: d.color,
                  }}
                />
              ))}
            </div>
          )}

          {item.category === 'forms' && (
            <div className="w-full px-2 py-1 rounded bg-neutral-900/90 border border-fuchsia-500/30 text-left space-y-1">
              <div className="text-[9px] font-bold text-amber-300 truncate">
                {(item as FormAssetItem).formTitle}
              </div>
              <div className="h-2 rounded bg-neutral-800 border border-neutral-700" />
              <div
                className="text-[8px] text-center py-0.5 rounded font-bold text-neutral-950"
                style={{ backgroundColor: (item as FormAssetItem).accentColor }}
              >
                {(item as FormAssetItem).submitLabel}
              </div>
            </div>
          )}

          {item.category === 'sheets' && (
            <div className="w-full px-1.5 py-1 rounded bg-neutral-900 border border-emerald-500/30 text-[8px] font-mono">
              <div
                className="px-1 py-0.5 rounded-t text-amber-200 font-bold truncate"
                style={{ backgroundColor: (item as SheetAssetItem).headerBgColor }}
              >
                fx {(item as SheetAssetItem).sheetTitle}
              </div>
              <div className="grid grid-cols-3 gap-0.5 pt-0.5 text-neutral-300">
                <span className="bg-neutral-800 px-1 truncate">Venue</span>
                <span className="bg-neutral-800 px-1">35L</span>
                <span className="bg-emerald-950/80 text-emerald-300 px-1">=SUM</span>
              </div>
            </div>
          )}

          {item.category === 'tables' && (
            <div className="w-full px-1.5 py-1 rounded bg-neutral-900 border border-amber-500/30 text-[8px]">
              <div
                className="px-1 py-0.5 rounded-t font-bold truncate"
                style={{
                  backgroundColor: (item as TableAssetItem).headerBgColor,
                  color: (item as TableAssetItem).headerTextColor,
                }}
              >
                {(item as TableAssetItem).rows[0]?.[0]} • {(item as TableAssetItem).rows[0]?.[1]}
              </div>
              <div className="text-neutral-300 truncate px-1 pt-0.5">
                {(item as TableAssetItem).rows[1]?.[0]} — {(item as TableAssetItem).rows[1]?.[1]}
              </div>
            </div>
          )}

          {item.category === 'animations' && (
            <div className="flex flex-col items-center justify-center py-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600/40 to-amber-500/30 border border-amber-400/50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>
              <span className="text-[8px] text-violet-300 mt-1 font-mono">
                {(item as AnimationAssetItem).badge}
              </span>
            </div>
          )}

          {item.category === 'mockups' && (
            <svg
              viewBox="0 0 100 100"
              className="w-12 h-12"
              style={{ color: (item as MockupAssetItem).accentColor }}
            >
              <g dangerouslySetInnerHTML={{ __html: (item as MockupAssetItem).frameSvg }} />
              <rect
                x={(item as MockupAssetItem).screenRect.x}
                y={(item as MockupAssetItem).screenRect.y}
                width={(item as MockupAssetItem).screenRect.w}
                height={(item as MockupAssetItem).screenRect.h}
                rx={(item as MockupAssetItem).screenRect.rx}
                fill="rgba(212,175,55,0.28)"
              />
            </svg>
          )}

          {item.category === '3d' && (() => {
            const m3 = item as Model3DAssetItem;
            const gId = `prev-3d-${m3.id}`;
            return (
              <svg viewBox="0 0 100 100" className="w-12 h-12 transition-transform group-hover:rotate-6 group-hover:scale-110 drop-shadow">
                <defs>
                  <radialGradient id={gId} cx="35%" cy="30%" r="70%">
                    <stop offset="0%" stopColor="#FFFBEB" />
                    <stop offset="45%" stopColor={m3.primaryColor} />
                    <stop offset="100%" stopColor={m3.secondaryColor} />
                  </radialGradient>
                </defs>
                {m3.geometryType === 'ring-torus' ? (
                  <g>
                    <ellipse cx="50" cy="58" rx="32" ry="20" fill="none" stroke={`url(#${gId})`} strokeWidth="9" />
                    <polygon points="50,14 62,28 50,38 38,28" fill="#E0F2FE" stroke={m3.primaryColor} strokeWidth="2" />
                  </g>
                ) : m3.geometryType === 'lotus-3d' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.2">
                    <path d="M 50 80 C 18 72, 10 44, 24 26 C 35 38, 40 56, 50 80 Z" opacity="0.88" />
                    <path d="M 50 80 C 82 72, 90 44, 76 26 C 65 38, 60 56, 50 80 Z" opacity="0.88" />
                    <path d="M 50 14 C 34 32, 32 60, 50 80 C 68 60, 66 32, 50 14 Z" />
                  </g>
                ) : m3.geometryType === 'royal-crown' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.4">
                    <polygon points="14,74 10,32 32,50 50,18 68,50 90,32 86,74" />
                    <rect x="14" y="74" width="72" height="10" rx="3" />
                    <circle cx="50" cy="14" r="4" fill="#FEF08A" />
                  </g>
                ) : m3.geometryType === 'diya-3d' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.3">
                    <path d="M 50 12 C 60 26, 64 38, 50 48 C 36 38, 40 26, 50 12 Z" fill="#FDE047" />
                    <path d="M 14 54 Q 50 64 86 54 C 82 78, 66 86, 50 86 C 34 86, 18 78, 14 54 Z" />
                  </g>
                ) : m3.geometryType === 'mandap-pillar' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.3">
                    <rect x="24" y="12" width="52" height="10" rx="3" />
                    <rect x="35" y="24" width="30" height="50" rx="2" />
                    <path d="M 24 74 H 76 L 82 88 H 18 Z" />
                  </g>
                ) : m3.geometryType === 'diamond-gem' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.4" strokeLinejoin="round">
                    <polygon points="28,22 72,22 90,42 50,88 10,42" />
                    <polyline points="10,42 90,42 M28,22 38,42 50,88 62,42 72,22" fill="none" />
                  </g>
                ) : m3.geometryType === 'sphere-orb' ? (
                  <g>
                    <circle cx="50" cy="50" r="36" fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.4" />
                    <ellipse cx="50" cy="50" rx="36" ry="13" fill="none" stroke="#FEF3C7" strokeWidth="1" strokeDasharray="3 2" />
                    <circle cx="38" cy="36" r="5" fill="#FFFBEB" opacity="0.65" />
                  </g>
                ) : m3.geometryType === 'cube-matrix' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.4" strokeLinejoin="round">
                    <polygon points="50,12 86,32 50,52 14,32" />
                    <polygon points="14,32 50,52 50,88 14,68" opacity="0.88" />
                    <polygon points="86,32 50,52 50,88 86,68" opacity="0.72" />
                  </g>
                ) : m3.geometryType === 'pyramid-prism' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.4" strokeLinejoin="round">
                    <polygon points="50,10 12,74 50,88" />
                    <polygon points="50,10 88,74 50,88" opacity="0.78" />
                  </g>
                ) : m3.geometryType === 'star-poly' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.3" strokeLinejoin="round">
                    <polygon points="50,8 61,35 90,38 68,57 75,86 50,70 25,86 32,57 10,38 39,35" />
                    <circle cx="50" cy="50" r="6" fill="#FFFBEB" />
                  </g>
                ) : m3.geometryType === 'heart-crystal' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.4">
                    <path d="M 50 86 C 18 64, 8 38, 22 22 C 34 10, 46 18, 50 28 C 54 18, 66 10, 78 22 C 92 38, 82 64, 50 86 Z" />
                  </g>
                ) : m3.geometryType === 'chandelier-3d' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.3">
                    <line x1="50" y1="8" x2="50" y2="24" strokeWidth="2.5" />
                    <ellipse cx="50" cy="28" rx="18" ry="5" />
                    <ellipse cx="50" cy="46" rx="32" ry="8" />
                    <ellipse cx="50" cy="64" rx="20" ry="5" />
                    <polygon points="50,70 55,80 50,90 45,80" fill="#FEF08A" />
                  </g>
                ) : m3.geometryType === 'drum-dhol' ? (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.4">
                    <path d="M 24 24 C 40 16, 60 16, 76 24 L 76 76 C 60 84, 40 84, 24 76 Z" />
                    <ellipse cx="24" cy="50" rx="7" ry="26" fill="#FEF3C7" />
                    <polyline points="28,28 72,42 28,56 72,70" fill="none" stroke="#FEF08A" strokeWidth="1.4" />
                  </g>
                ) : m3.geometryType === 'helix-spiral' ? (
                  <g fill="none" stroke={`url(#${gId})`} strokeWidth="4.5" strokeLinecap="round">
                    <path d="M 26 14 C 74 28, 26 52, 74 66 C 26 78, 74 88, 50 92" />
                    <path d="M 74 14 C 26 28, 74 52, 26 66 C 74 78, 26 88, 50 92" stroke="#FEF3C7" strokeWidth="1.8" strokeDasharray="3 2" />
                  </g>
                ) : (
                  <g fill={`url(#${gId})`} stroke="#FEF3C7" strokeWidth="1.3">
                    <ellipse cx="50" cy="82" rx="22" ry="6" />
                    <path d="M 26 58 C 20 38, 36 28, 50 28 C 64 28, 80 38, 74 58 C 68 76, 32 76, 26 58 Z" />
                    <circle cx="50" cy="16" r="7" />
                  </g>
                )}
              </svg>
            );
          })()}
        </div>

        {/* Item Label */}
        {item.category !== 'audio' && (
          <span className="text-[10px] font-medium text-neutral-200 group-hover:text-amber-200 text-center truncate w-full mt-1">
            {item.name}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      {/* Header Banner */}
      <div className="p-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-purple-500/15 border border-amber-500/30 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            Canva Elements Library
          </h3>
          <p className="text-[10px] text-neutral-400">
            1,117 Assets • 14 Categories • 312 Shapes • 360 Graphics
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className={`px-2 py-1 rounded-lg text-[10px] font-semibold border flex items-center gap-1 transition ${
            showFavoritesOnly
              ? 'bg-amber-500 text-neutral-950 border-amber-300'
              : 'bg-neutral-900/80 text-amber-300 border-neutral-700 hover:border-amber-400'
          }`}
          title="Filter Starred Favorites"
        >
          <Star className="w-3 h-3 fill-current" />
          {favoriteIds.length}
        </button>
      </div>

      {/* Universal Search Input with Synonym Expansion */}
      <div className="relative">
        <Search className="w-3.5 h-3.5 text-amber-400/80 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search 1,117 elements (e.g. kalash, lotus, arch, rsvp, 3d)..."
          className="w-full bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-xl pl-8 pr-8 py-2 text-xs text-amber-100 placeholder-neutral-500 outline-none"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Quick Category Filter Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveCategory('home')}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
            activeCategory === 'home'
              ? 'bg-amber-500 text-neutral-950 shadow'
              : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
          }`}
        >
          All 14 Categories
        </button>
        {MAIN_ELEMENT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1 ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-neutral-950 shadow'
                : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <span>{cat.label}</span>
            <span className="text-[9px] opacity-75">({cat.targetCount})</span>
          </button>
        ))}
      </div>

      {/* Contextual Hint when a Frame, Grid, or Mockup is selected */}
      {selectedElement &&
        (selectedElement.type === 'frame' ||
          selectedElement.type === 'grid' ||
          selectedElement.type === 'mockup') && (
          <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-[11px] text-emerald-200 flex items-center justify-between">
            <span>
              <Check className="w-3.5 h-3.5 inline mr-1 text-emerald-400" />
              <strong>{selectedElement.type.toUpperCase()} selected:</strong> Click any Photo to drop it inside!
            </span>
            {activeCategory !== 'photos' && (
              <button
                type="button"
                onClick={() => setActiveCategory('photos')}
                className="px-2 py-0.5 rounded bg-emerald-500 text-neutral-950 font-bold text-[10px]"
              >
                Open Photos
              </button>
            )}
          </div>
        )}

      {/* ================= 1. SEARCH OR FAVORITES VIEW ================= */}
      {(searchQuery.trim() !== '' || showFavoritesOnly) && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>
              Found <strong className="text-amber-300">{searchResults.length}</strong> matching elements
            </span>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setShowFavoritesOnly(false);
              }}
              className="text-[11px] text-amber-400 hover:underline"
            >
              Reset Filter
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 max-h-[480px] overflow-y-auto pr-1">
            {searchResults.slice(0, 90).map((it) => renderItemCard(it, true))}
          </div>
        </div>
      )}

      {/* ================= 2. HOME OVERVIEW (14 CATEGORY TILES + RECENTLY USED) ================= */}
      {!searchQuery.trim() && !showFavoritesOnly && activeCategory === 'home' && (
        <div className="space-y-4">
          {/* Recently Used Horizontal Strip */}
          {recentItems.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-neutral-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  Recently Used
                </span>
                <button
                  type="button"
                  onClick={() => setRecentIds([])}
                  className="text-[10px] text-neutral-500 hover:text-neutral-300"
                >
                  Clear
                </button>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {recentItems.slice(0, 4).map((it) => renderItemCard(it, true))}
              </div>
            </div>
          )}

          {/* 14 Main Category Tiles Grid */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              Browse 14 Element Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {MAIN_ELEMENT_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`p-2.5 rounded-xl border border-neutral-700/80 hover:border-amber-400 bg-gradient-to-br ${cat.accentGradient} text-left transition group flex flex-col justify-between min-h-[74px]`}
                >
                  <div className="flex items-start justify-between w-full">
                    <div>
                      <div className="text-xs font-bold text-amber-100 group-hover:text-amber-300">
                        {cat.label}
                      </div>
                      <div className="text-[10px] text-amber-200/70">{cat.hindiSub}</div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-amber-300 border border-amber-500/30">
                      {cat.badgeText}
                    </span>
                  </div>
                  <div className="text-[9px] text-neutral-300/90 line-clamp-1 mt-1 flex items-center justify-between">
                    <span className="truncate">{cat.description}</span>
                    <ChevronRight className="w-3 h-3 text-amber-300 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. SHAPES BROWSER (16 SUBCATEGORY SECTIONS + SEE ALL) ================= */}
      {!searchQuery.trim() && !showFavoritesOnly && activeCategory === 'shapes' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (activeShapeSub !== 'all') setActiveShapeSub('all');
                else setActiveCategory('home');
              }}
              className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {activeShapeSub === 'all' ? 'Back to Categories' : 'All 15 Shape Sections'}
            </button>
            <span className="text-[10px] text-neutral-400 font-mono">
              {SHAPES_LIBRARY_ITEMS.length} SVG Shapes
            </span>
          </div>

          {/* Subcategory Pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveShapeSub('all')}
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap ${
                activeShapeSub === 'all'
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              All Sections (15)
            </button>
            {SHAPE_SUBCATEGORIES.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveShapeSub(sub.id)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap ${
                  activeShapeSub === sub.id
                    ? 'bg-amber-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {sub.label} ({sub.targetCount})
              </button>
            ))}
          </div>

          {activeShapeSub === 'all' ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {SHAPE_SUBCATEGORIES.map((sub) => {
                const subItems = getShapesBySubcategory(sub.id);
                return (
                  <div key={sub.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-200">
                        {sub.label}{' '}
                        <span className="text-[10px] text-neutral-400 font-normal">
                          ({subItems.length})
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveShapeSub(sub.id)}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                      >
                        See all ({subItems.length}) <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {subItems.slice(0, 4).map((it) => renderItemCard(it, true))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
              {getShapesBySubcategory(activeShapeSub).map((it) => renderItemCard(it))}
            </div>
          )}
        </div>
      )}

      {/* ================= 4. GRAPHICS BROWSER (7 SUBCATEGORIES + SEE ALL) ================= */}
      {!searchQuery.trim() && !showFavoritesOnly && activeCategory === 'graphics' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (activeGraphicSub !== 'all') setActiveGraphicSub('all');
                else setActiveCategory('home');
              }}
              className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-semibold"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              {activeGraphicSub === 'all' ? 'Back to Categories' : 'All 7 Graphic Collections'}
            </button>
            <span className="text-[10px] text-neutral-400 font-mono">
              {GRAPHICS_LIBRARY_ITEMS.length} Royal Graphics
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
            <button
              type="button"
              onClick={() => setActiveGraphicSub('all')}
              className={`px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap ${
                activeGraphicSub === 'all'
                  ? 'bg-amber-500 text-neutral-950'
                  : 'bg-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              All 7 Collections
            </button>
            {GRAPHIC_SUBCATEGORIES.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setActiveGraphicSub(sub.id)}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold whitespace-nowrap ${
                  activeGraphicSub === sub.id
                    ? 'bg-amber-500 text-neutral-950'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {sub.label} ({sub.targetCount})
              </button>
            ))}
          </div>

          {activeGraphicSub === 'all' ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {GRAPHIC_SUBCATEGORIES.map((sub) => {
                const items = getGraphicsBySubcategory(sub.id);
                return (
                  <div key={sub.id} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-200">
                        {sub.label}{' '}
                        <span className="text-[10px] text-neutral-400 font-normal">
                          ({items.length})
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveGraphicSub(sub.id)}
                        className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5"
                      >
                        See all ({items.length}) <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      {items.slice(0, 4).map((it) => renderItemCard(it, true))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-[500px] overflow-y-auto pr-1">
              {getGraphicsBySubcategory(activeGraphicSub).map((it) => renderItemCard(it))}
            </div>
          )}
        </div>
      )}

      {/* ================= 5. ALL OTHER 12 CATEGORIES FULL GRID VIEW ================= */}
      {!searchQuery.trim() &&
        !showFavoritesOnly &&
        activeCategory !== 'home' &&
        activeCategory !== 'shapes' &&
        activeCategory !== 'graphics' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setActiveCategory('home')}
                className="text-xs text-amber-300 hover:underline flex items-center gap-1 font-semibold"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                Back to All Categories
              </button>
              <span className="text-[10px] text-neutral-400 font-mono">
                {getItemsByCategory(activeCategory).length} Items
              </span>
            </div>

            <div
              className={`grid ${
                activeCategory === 'audio' ||
                activeCategory === 'forms' ||
                activeCategory === 'sheets' ||
                activeCategory === 'tables'
                  ? 'grid-cols-2'
                  : 'grid-cols-3'
              } gap-2 max-h-[500px] overflow-y-auto pr-1`}
            >
              {getItemsByCategory(activeCategory).map((it) => renderItemCard(it))}
            </div>
          </div>
        )}
    </div>
  );
};
