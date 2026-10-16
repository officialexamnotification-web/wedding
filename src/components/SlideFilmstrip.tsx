import React, { useRef, useEffect } from 'react';
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
  ChevronUp
} from 'lucide-react';
import { CardPage, CanvasItem, ImageElement, TextElement } from '../types/editor';

interface SlideFilmstripProps {
  pages: CardPage[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage?: (index: number) => void;
  onDeletePage: (index: number) => void;
  onMovePage?: (fromIndex: number, toIndex: number) => void;
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
  onOpenVideoPreview,
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  const totalDuration = (pages.length * 4.5).toFixed(1);

  return (
    <div className="bg-neutral-900 border-t border-neutral-800 shadow-2xl z-20 flex flex-col select-none transition-all">
      {/* Top Header / Bar Controls */}
      <div className="px-4 py-2 border-b border-neutral-800/80 bg-neutral-950/70 flex items-center justify-between gap-3 text-xs">
        {/* Left: Info */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Film className="w-4 h-4 text-amber-400" />
            <span>Video Slides Timeline</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-neutral-400 text-[11px]">
            <span className="px-2 py-0.5 rounded-full bg-neutral-800 border border-neutral-700/60 font-mono text-neutral-300">
              {pages.length} Slides
            </span>
            <span className="flex items-center gap-1 text-neutral-400">
              <Clock className="w-3 h-3 text-amber-400/80" />
              <span>{totalDuration}s Sequence (4.5s/slide)</span>
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Play Video Preview Button */}
          <button
            onClick={onOpenVideoPreview}
            className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 text-neutral-950 font-bold text-xs rounded-lg shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
            title="Play full animated video sequence with traditional Shehnai music"
          >
            <Play className="w-3.5 h-3.5 fill-neutral-950 text-neutral-950" />
            <span>Play Video Preview</span>
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
          <div 
            ref={scrollContainerRef}
            className="flex items-stretch gap-3 min-w-max pb-1"
          >
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
                    <span className={`font-bold flex items-center gap-1 ${isActive ? 'text-amber-300' : 'text-neutral-300'}`}>
                      <span>Slide {index + 1}</span>
                      {isActive && <CheckCircle2 className="w-3 h-3 text-amber-400 fill-amber-400/20" />}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono">4.5s</span>
                  </div>

                  {/* Slide Visual Card Thumbnail (9:16 aspect preview) */}
                  <div
                    className="relative w-full h-36 rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-inner flex flex-col justify-between p-1.5"
                    style={{
                      background: page.backgroundValue || '#171717',
                    }}
                  >
                    {/* Background / Main Photo */}
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

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/60 pointer-events-none" />

                    {/* Mini Slide Header Badge */}
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

                    {/* Mini Slide Title at bottom */}
                    <div className="relative z-10 text-center">
                      <p className="text-[10px] font-semibold text-amber-100 truncate px-1 drop-shadow-md">
                        {page.title?.split('(')[0]?.trim() || headline}
                      </p>
                    </div>

                    {/* Hover Quick Reorder Controls */}
                    <div className="absolute inset-0 bg-neutral-950/75 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-20">
                      {/* Move Left */}
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

                      {/* Duplicate */}
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

                      {/* Delete */}
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

                      {/* Move Right */}
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
    </div>
  );
};
