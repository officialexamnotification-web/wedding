import React, { useState } from 'react';
import { 
  Undo2, 
  Redo2, 
  Eye, 
  Download, 
  Share2, 
  Sparkles, 
  Info, 
  Play, 
  MoreVertical,
  ChevronDown
} from 'lucide-react';
import { AspectRatioType, CANVAS_SIZES } from '../types/editor';

interface NavbarProps {
  title: string;
  onTitleChange: (newTitle: string) => void;
  aspectRatio: AspectRatioType;
  onAspectRatioChange: (newRatio: AspectRatioType) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onOpenPreview: () => void;
  onOpenExport: () => void;
  onOpenAnalysis: () => void;
  onOpenAiCopy: () => void;
  onBackToHome: () => void;
  onOpenVideoCard: () => void;
  pageCount: number;
  currentPageIndex: number;
  onSelectPage: (idx: number) => void;
  onAddPage: () => void;
  onDeletePage: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  title,
  onTitleChange,
  aspectRatio,
  onAspectRatioChange,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomChange,
  onOpenPreview,
  onOpenExport,
  onOpenAnalysis,
  onOpenAiCopy,
  onBackToHome,
  onOpenVideoCard,
  pageCount,
  currentPageIndex,
  onSelectPage,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <header className="h-14 sm:h-16 bg-neutral-950 border-b border-neutral-800/90 px-3 sm:px-4 flex items-center justify-between text-neutral-200 select-none z-30 relative shadow-md">
      {/* Left: Brand & Editable Title */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-amber-300 transition"
          title="Return to InvitationBazaar Homepage"
        >
          <span>←</span>
          <span className="hidden sm:inline font-medium">Home</span>
        </button>

        {/* Brand Icon */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg gold-shimmer flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
            <span className="font-cinzel text-neutral-950 font-black text-sm sm:text-base">नि</span>
          </div>
          <div className="hidden lg:block">
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel font-bold text-amber-200 tracking-wider text-xs">
                IMANTRAN CARD
              </span>
              <span className="text-[9px] text-amber-400 font-medium px-1.5 py-0.2 bg-amber-400/10 rounded border border-amber-400/20">
                PRO
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-neutral-800 hidden md:block" />

        {/* Editable Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Invitation Title..."
          className="bg-neutral-900/80 hover:bg-neutral-900 focus:bg-neutral-950 text-xs sm:text-sm font-medium text-neutral-100 px-2.5 py-1 sm:py-1.5 rounded-lg border border-neutral-800 focus:border-amber-500/60 outline-none w-28 sm:w-48 md:w-56 truncate transition-colors"
          title="Click to rename invitation"
        />
      </div>

      {/* Center: Aspect Ratio & Undo/Redo */}
      <div className="flex items-center gap-1 sm:gap-3">
        {/* Aspect Ratio Selector (Desktop segmented pills) */}
        <div className="hidden md:flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-xs">
          {(Object.keys(CANVAS_SIZES) as AspectRatioType[]).map((ratioKey) => {
            const size = CANVAS_SIZES[ratioKey];
            const isActive = aspectRatio === ratioKey;
            return (
              <button
                key={ratioKey}
                onClick={() => onAspectRatioChange(ratioKey)}
                className={`px-2 py-1 rounded font-medium transition-all ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
                title={`${size.name} (${size.ratioLabel})`}
              >
                {size.ratioLabel}
              </button>
            );
          })}
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center bg-neutral-900 rounded-lg p-0.5 border border-neutral-800">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-1.5 rounded hover:bg-neutral-800 transition ${
              canUndo ? 'text-neutral-200' : 'text-neutral-600 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-1.5 rounded hover:bg-neutral-800 transition ${
              canRedo ? 'text-neutral-200' : 'text-neutral-600 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Right: High-Priority Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {/* Play Animated Video Sequence Button */}
        <button
          onClick={onOpenVideoCard}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:brightness-110 rounded-lg shadow-md transition-all shadow-amber-500/20 hover:scale-[1.02] active:scale-[0.98]"
          title="Play 5-Slide Animated Video Invitation Sequence"
        >
          <Play className="w-3.5 h-3.5 fill-neutral-950 text-neutral-950" />
          <span className="hidden sm:inline">Play Video</span>
        </button>

        {/* Preview Button */}
        <button
          onClick={onOpenPreview}
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg transition-colors"
          title="Full Preview"
        >
          <Eye className="w-3.5 h-3.5 text-neutral-400" />
          <span>Preview</span>
        </button>

        {/* Download & Share Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Download PNG, PDF or Share on WhatsApp"
        >
          <Download className="w-3.5 h-3.5 text-neutral-950" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Extra More Menu Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-amber-300 transition"
            title="More Options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {showMoreMenu && (
            <div 
              onClick={() => setShowMoreMenu(false)}
              className="fixed inset-0 z-40"
            />
          )}

          {showMoreMenu && (
            <div className="absolute right-0 top-full mt-1.5 w-52 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-xs text-neutral-200 animate-in fade-in zoom-in-95 duration-100">
              {/* Aspect Ratio picker for mobile */}
              <div className="md:hidden p-2 border-b border-neutral-800">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase block mb-1.5">Card Aspect Ratio</span>
                <div className="grid grid-cols-2 gap-1">
                  {(Object.keys(CANVAS_SIZES) as AspectRatioType[]).map((ratioKey) => (
                    <button
                      key={ratioKey}
                      onClick={() => {
                        onAspectRatioChange(ratioKey);
                        setShowMoreMenu(false);
                      }}
                      className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                        aspectRatio === ratioKey
                          ? 'bg-amber-500 text-neutral-950 font-bold'
                          : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      }`}
                    >
                      {CANVAS_SIZES[ratioKey].ratioLabel}
                    </button>
                  ))}
                </div>
              </div>

              {/* AI Wording */}
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenAiCopy();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-800 text-left transition text-purple-300"
              >
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>AI Sanskrit & Wedding Copy</span>
              </button>

              {/* Preview on Mobile */}
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenPreview();
                }}
                className="md:hidden flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-800 text-left transition"
              >
                <Eye className="w-4 h-4 text-neutral-400" />
                <span>Full Card Preview</span>
              </button>

              {/* System Analysis */}
              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenAnalysis();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-800 text-left transition text-neutral-300"
              >
                <Info className="w-4 h-4 text-amber-400" />
                <span>Editor Architecture Audit</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
