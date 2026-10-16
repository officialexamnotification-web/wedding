import React, { useRef, useEffect, useState } from 'react';
import {
  Play,
  Plus,
  Copy,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Film,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  FileText,
  X,
} from 'lucide-react';
import { CardPage, ImageElement, TextElement, PageTransitionType } from '../types/editor';

interface SlideFilmstripProps {
  pages: CardPage[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage?: (index: number) => void;
  onDeletePage: (index: number) => void;
  onMovePage?: (fromIndex: number, toIndex: number) => void;
  onUpdatePage?: (index: number, updates: Partial<CardPage>) => void;
  onOpenVideoPreview: () => void;
}

export const SlideFilmstrip: React.FC<SlideFilmstripProps> = ({
  pages,
  currentPageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage,
  onUpdatePage,
  onOpenVideoPreview,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const currentPage = pages[currentPageIndex] || pages[0];

  // Auto-scroll the active slide into view when changed
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.children[currentPageIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentPageIndex]);

  // Helper to extract the primary image from a slide
  const getSlideImage = (page: CardPage): string | null => {
    const imgElem = page.elements.find((e) => e.type === 'image') as ImageElement | undefined;
    return imgElem?.src || null;
  };

  // Helper to extract headline text from a slide
  const getSlideHeadline = (page: CardPage): string => {
    if (page.title) return page.title;
    const textElem = page.elements.find((e) => e.type === 'text') as TextElement | undefined;
    return textElem?.text.slice(0, 25) || `Slide ${pages.indexOf(page) + 1}`;
  };

  const totalDuration = pages
    .reduce((sum, p) => sum + (p.duration || 4.5), 0)
    .toFixed(1);

  return (
    <div className="bg-neutral-900 border-t border-neutral-800 shadow-2xl z-20 flex flex-col select-none transition-all relative">
      {/* Speaker / Ceremony Notes Drawer */}
      {isNotesOpen && (
        <div className="p-3 bg-neutral-950 border-b border-neutral-800 flex items-center gap-3 text-xs">
          <span className="text-amber-300 font-semibold shrink-0 flex items-center gap-1">
            <FileText className="w-3.5 h-3.5" />
            Slide #{currentPageIndex + 1} Notes:
          </span>
          <input
            type="text"
            value={currentPage?.notes || ''}
            onChange={(e) =>
              onUpdatePage && onUpdatePage(currentPageIndex, { notes: e.target.value })
            }
            placeholder="Add event reminders, RSVP contact notes, or vendor instructions for this slide..."
            className="flex-1 bg-neutral-900 border border-neutral-700 focus:border-amber-400 rounded-lg px-3 py-1.5 text-neutral-200 outline-none"
          />
          <button
            onClick={() => setIsNotesOpen(false)}
            className="p-1 text-neutral-400 hover:text-white rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header / Bar Controls */}
      <div className="px-4 py-2 border-b border-neutral-800/80 bg-neutral-950/70 flex items-center justify-between gap-3 text-xs">
        {/* Left: Info & Per-Slide Timing / Transition Controls */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold shrink-0">
            <Film className="w-4 h-4 text-amber-400" />
            <span>Canva Pages & Video Timeline</span>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-neutral-400 text-[11px] shrink-0">
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700/60 font-mono text-neutral-300">
              {pages.length} Pages
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <Clock className="w-3 h-3 text-amber-400/80" />
              <span>Total: {totalDuration}s</span>
            </span>
          </div>

          {/* Active Slide Duration & Transition Selector */}
          {onUpdatePage && (
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-800 shrink-0">
              <div className="flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded-lg border border-neutral-800">
                <Clock className="w-3 h-3 text-amber-400" />
                <select
                  value={currentPage?.duration || 4.5}
                  onChange={(e) =>
                    onUpdatePage(currentPageIndex, { duration: parseFloat(e.target.value) })
                  }
                  className="bg-transparent text-[11px] text-amber-300 font-mono outline-none cursor-pointer"
                  title="Slide Duration in Video"
                >
                  <option value={3} className="bg-neutral-900">3.0s</option>
                  <option value={4.5} className="bg-neutral-900">4.5s</option>
                  <option value={6} className="bg-neutral-900">6.0s</option>
                  <option value={8} className="bg-neutral-900">8.0s</option>
                </select>
              </div>

              <div className="flex items-center gap-1 bg-neutral-900 px-2 py-0.5 rounded-lg border border-neutral-800">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <select
                  value={currentPage?.transition || 'fade'}
                  onChange={(e) =>
                    onUpdatePage(currentPageIndex, {
                      transition: e.target.value as PageTransitionType,
                    })
                  }
                  className="bg-transparent text-[11px] text-neutral-200 outline-none cursor-pointer"
                  title="Canva Page Transition Effect"
                >
                  <option value="fade" className="bg-neutral-900">Transition: Dissolve</option>
                  <option value="slide" className="bg-neutral-900">Transition: Slide</option>
                  <option value="zoom" className="bg-neutral-900">Transition: Royal Zoom</option>
                  <option value="royal-curtain" className="bg-neutral-900">Transition: Palace Curtain</option>
                  <option value="sparkle" className="bg-neutral-900">Transition: Gold Sparkle</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions (Notes, Grid View, Play Video, Add Slide, Collapse) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Canva Notes Toggle */}
          <button
            onClick={() => setIsNotesOpen(!isNotesOpen)}
            className={`px-2.5 py-1 rounded-lg border text-xs flex items-center gap-1 transition ${
              isNotesOpen
                ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-semibold'
                : 'bg-neutral-800 hover:bg-neutral-750 border-neutral-700 text-neutral-300'
            }`}
            title="Canva Ceremony Notes"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Notes</span>
          </button>

          {/* Canva Grid View Toggle */}
          <button
            onClick={() => setIsGridViewOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 text-neutral-300 hover:text-amber-300 text-xs flex items-center gap-1 transition"
            title="Canva Multi-Page Grid View"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Grid View</span>
          </button>

          {/* Play Video Preview Button */}
          <button
            onClick={onOpenVideoPreview}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-bold text-xs rounded-lg shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
            title="Play full animated video sequence with traditional Shehnai music"
          >
            <Play className="w-3.5 h-3.5 fill-neutral-950 text-neutral-950" />
            <span>Play Video</span>
          </button>

          {/* Add Slide Button */}
          <button
            onClick={onAddPage}
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-300 hover:text-amber-200 border border-neutral-700 rounded-lg text-xs font-medium transition"
            title="Add a new slide to the video sequence"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Slide</span>
          </button>

          {/* Collapse / Expand Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-neutral-400 hover:text-neutral-200 rounded hover:bg-neutral-800 transition"
            title={isCollapsed ? 'Expand Slide Timeline' : 'Collapse Slide Timeline'}
          >
            {isCollapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Slide Thumbnails Filmstrip Strip (Collapsible) */}
      {!isCollapsed && (
        <div className="p-3 bg-neutral-900/90 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700">
          <div ref={scrollContainerRef} className="flex items-stretch gap-3 min-w-max pb-1">
            {pages.map((page, index) => {
              const isActive = index === currentPageIndex;
              const slideImg = getSlideImage(page);
              const headline = getSlideHeadline(page);

              return (
                <div
                  key={page.id || index}
                  onClick={() => onSelectPage(index)}
                  className={`group relative flex flex-col items-center rounded-xl p-2 cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-950/40 border-2 border-amber-400 ring-2 ring-amber-400/30 shadow-xl shadow-amber-500/10'
                      : 'bg-neutral-800/60 border border-neutral-700/60 hover:border-neutral-500 hover:bg-neutral-800'
                  }`}
                  style={{ width: '136px' }}
                >
                  {/* Top Slide Header Label */}
                  <div className="w-full flex items-center justify-between text-[11px] mb-1.5 px-0.5">
                    <span
                      className={`font-bold flex items-center gap-1 ${
                        isActive ? 'text-amber-300' : 'text-neutral-300'
                      }`}
                    >
                      <span>Slide {index + 1}</span>
                      {isActive && (
                        <CheckCircle2 className="w-3 h-3 text-amber-400 fill-amber-400/20" />
                      )}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {page.duration || 4.5}s
                    </span>
                  </div>

                  {/* Slide Visual Card Thumbnail */}
                  <div
                    className="relative w-full h-36 rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-inner flex flex-col justify-between p-1.5"
                    style={{
                      background: page.backgroundValue || '#171717',
                    }}
                  >
                    {slideImg ? (
                      <img
                        src={slideImg}
                        alt={`Slide ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center p-2 text-center text-[10px] text-amber-200/60 font-serif">
                        {headline}
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

                    <div className="relative z-10 flex items-center justify-between text-[9px] text-amber-200/90 font-mono">
                      <span className="bg-black/60 px-1 py-0.5 rounded backdrop-blur-xs">
                        #{index + 1}
                      </span>
                      {index === 0 && (
                        <span className="bg-amber-500/80 text-neutral-950 font-bold px-1 py-0.5 rounded text-[8px] uppercase">
                          Cover
                        </span>
                      )}
                      {index === pages.length - 1 && index > 0 && (
                        <span className="bg-rose-500/80 text-white font-bold px-1 py-0.5 rounded text-[8px] uppercase">
                          Ending
                        </span>
                      )}
                    </div>

                    <div className="relative z-10 text-center">
                      <p className="text-[10px] font-semibold text-amber-100 truncate px-1 drop-shadow-md">
                        {page.title?.split('(')[0]?.trim() || headline}
                      </p>
                    </div>

                    {/* Hover Quick Reorder Controls */}
                    <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-20">
                      {onMovePage && index > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMovePage(index, index - 1);
                          }}
                          className="p-1 rounded bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 transition"
                          title="Move Slide Earlier"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {onDuplicatePage && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDuplicatePage(index);
                          }}
                          className="p-1 rounded bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 transition"
                          title="Duplicate Slide"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {pages.length > 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePage(index);
                          }}
                          className="p-1 rounded bg-neutral-800 hover:bg-rose-500 text-neutral-200 hover:text-white transition"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {onMovePage && index < pages.length - 1 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMovePage(index, index + 1);
                          }}
                          className="p-1 rounded bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 transition"
                          title="Move Slide Later"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Active Indicator Label */}
                  <div className="mt-1.5 text-center">
                    {isActive ? (
                      <span className="text-[10px] text-amber-300 font-semibold bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40">
                        Editing Slide
                      </span>
                    ) : (
                      <span className="text-[10px] text-neutral-400 group-hover:text-neutral-200 truncate max-w-[120px] block">
                        {page.title?.split('(')[0]?.trim() || `Slide ${index + 1}`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Quick Add Slide Card Button at End of Strip */}
            <div
              onClick={onAddPage}
              className="flex flex-col items-center justify-center rounded-xl p-3 border border-dashed border-neutral-700 hover:border-amber-400/60 bg-neutral-900/60 hover:bg-amber-950/20 text-neutral-400 hover:text-amber-300 cursor-pointer transition-all duration-200"
              style={{ width: '110px', height: '190px' }}
              title="Add New Slide / Page"
            >
              <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 transition">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-medium text-center">Add Slide</span>
              <span className="text-[10px] text-neutral-500 mt-1">New Page</span>
            </div>
          </div>
        </div>
      )}

      {/* Canva Full-Screen Multi-Page Grid View Modal */}
      {isGridViewOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col p-6 animate-fade-in">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <LayoutGrid className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-neutral-100">
                Canva Grid View ({pages.length} Pages)
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onAddPage}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Page
              </button>
              <button
                onClick={() => setIsGridViewOpen(false)}
                className="p-1.5 rounded-lg bg-neutral-800 text-neutral-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {pages.map((page, index) => {
              const isActive = index === currentPageIndex;
              const slideImg = getSlideImage(page);
              const headline = getSlideHeadline(page);
              return (
                <div
                  key={page.id || index}
                  onClick={() => {
                    onSelectPage(index);
                    setIsGridViewOpen(false);
                  }}
                  className={`rounded-2xl p-3 cursor-pointer border transition flex flex-col ${
                    isActive
                      ? 'bg-amber-950/30 border-2 border-amber-400 shadow-xl'
                      : 'bg-neutral-900 border-neutral-700 hover:border-amber-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-bold text-amber-300">Page {index + 1}</span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      {page.duration || 4.5}s
                    </span>
                  </div>
                  <div
                    className="h-52 rounded-xl overflow-hidden relative flex items-end p-2 border border-neutral-800"
                    style={{ background: page.backgroundValue }}
                  >
                    {slideImg && (
                      <img
                        src={slideImg}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30" />
                    <span className="relative z-10 text-xs font-semibold text-amber-100 truncate w-full text-center">
                      {page.title || headline}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
