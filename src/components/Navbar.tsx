import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Eye,
  Download,
  Sparkles,
  Info,
  Play,
  MoreVertical,
  FileText,
  Wand2,
  Ruler,
  Grid,
  Save,
  Check,
  Languages,
  Maximize2,
  ChevronDown,
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
  showRulers?: boolean;
  onToggleRulers?: () => void;
  showSafeZones?: boolean;
  onToggleSafeZones?: () => void;
  onSaveProject?: () => void;
  onTranslateCard?: (lang: 'hindi' | 'english' | 'hinglish' | 'sanskrit') => void;
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
  onOpenPreview,
  onOpenExport,
  onOpenAnalysis,
  onOpenAiCopy,
  onBackToHome,
  onOpenVideoCard,
  onAddPage,
  showRulers = false,
  onToggleRulers,
  showSafeZones = true,
  onToggleSafeZones,
  onSaveProject,
  onTranslateCard,
}) => {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showMagicSwitch, setShowMagicSwitch] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleQuickSave = () => {
    if (onSaveProject) onSaveProject();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <header className="min-h-14 h-auto sm:h-15 bg-neutral-950 border-b border-neutral-800/90 px-2.5 py-1.5 sm:px-4 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-x-2 gap-y-1.5 sm:gap-y-0 text-neutral-200 select-none z-50 relative shadow-md">
      {/* Left: Brand, File Menu, Magic Switch & Editable Title */}
      <div className="flex min-w-0 basis-full items-center gap-1 sm:basis-auto sm:gap-2.5 sm:shrink-0">
        {/* Back to Home Button */}
        <button
          onClick={onBackToHome}
          className="flex shrink-0 items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-xs text-neutral-300 hover:text-amber-300 transition cursor-pointer"
          title="Return to Nimantran Royale Homepage"
        >
          <span>←</span>
          <span className="hidden sm:inline font-medium">Home</span>
        </button>

        {/* Brand Icon */}
        <div className="flex items-center gap-2">
          <div className="brand-logo-badge w-7 h-7 sm:w-8 sm:h-8 rounded-lg p-[1px] bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/20 shrink-0">
            <div className="w-full h-full rounded-[7px] bg-[#14070b] flex items-center justify-center">
              <span className="font-tiro brand-mark-shine inline-flex h-full w-full items-center justify-center text-[17px] font-bold leading-none">नि</span>
            </div>
          </div>
        </div>

        {/* Canva FILE Dropdown Menu */}
        <div className="relative">
          <button
            onClick={() => {
              setShowFileMenu(!showFileMenu);
              setShowMagicSwitch(false);
            }}
            className="px-2 py-1.5 sm:px-2.5 rounded-lg hover:bg-neutral-900 text-xs font-medium text-neutral-200 hover:text-amber-300 flex items-center gap-1 transition"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden min-[400px]:inline">File</span>
            <ChevronDown className="w-3 h-3 text-neutral-400" />
          </button>

          {showFileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowFileMenu(false)} />
              <div className="absolute left-0 top-full mt-1.5 w-60 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5">
                <div className="px-2.5 py-1.5 border-b border-neutral-800 text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  Studio File & View Settings
                </div>
                <button
                  onClick={() => {
                    onAddPage();
                    setShowFileMenu(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-lg hover:bg-neutral-800 text-left flex items-center justify-between"
                >
                  <span>+ Add New Slide / Page</span>
                </button>
                <button
                  onClick={() => {
                    handleQuickSave();
                    setShowFileMenu(false);
                  }}
                  className="w-full px-2.5 py-2 rounded-lg hover:bg-neutral-800 text-left flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Save className="w-3.5 h-3.5 text-amber-400" /> Save to My Projects
                  </span>
                  <span className="text-[10px] text-emerald-400">Local</span>
                </button>
                {onToggleRulers && (
                  <button
                    onClick={() => {
                      onToggleRulers();
                      setShowFileMenu(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg hover:bg-neutral-800 text-left flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Ruler className="w-3.5 h-3.5 text-amber-400" /> Show Rulers & Guides
                    </span>
                    {showRulers && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                )}
                {onToggleSafeZones && (
                  <button
                    onClick={() => {
                      onToggleSafeZones();
                      setShowFileMenu(false);
                    }}
                    className="w-full px-2.5 py-2 rounded-lg hover:bg-neutral-800 text-left flex items-center justify-between"
                  >
                    <span className="flex items-center gap-2">
                      <Grid className="w-3.5 h-3.5 text-amber-400" /> Show Print Bleed & Margins
                    </span>
                    {showSafeZones && <Check className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                )}
                <div className="border-t border-neutral-800 my-1" />
                <button
                  onClick={() => {
                    setShowFileMenu(false);
                    onOpenExport();
                  }}
                  className="w-full px-2.5 py-2 rounded-lg hover:bg-neutral-800 text-left flex items-center gap-2 text-amber-300 font-semibold"
                >
                  <Download className="w-3.5 h-3.5" /> Download High-Res PNG / PDF
                </button>
              </div>
            </>
          )}
        </div>

        {/* Canva Pro RESIZE & MAGIC SWITCH Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowMagicSwitch(!showMagicSwitch);
              setShowFileMenu(false);
            }}
            className="hidden sm:flex px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/15 to-purple-500/15 hover:from-amber-500/25 hover:to-purple-500/25 border border-amber-500/30 text-xs font-semibold text-amber-200 items-center gap-1.5 transition"
          >
            <Wand2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Format & Translate</span>
            <ChevronDown className="w-3 h-3 text-amber-300" />
          </button>

          {showMagicSwitch && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowMagicSwitch(false)} />
              <div className="absolute left-0 top-full mt-1.5 w-72 bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl p-3 z-50 text-xs space-y-3">
                <div className="font-bold text-amber-300 uppercase tracking-wider text-[11px] border-b border-neutral-800 pb-1.5 flex items-center justify-between">
                  <span>Suite Format & Language</span>
                  <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-neutral-400 block">
                    Resize Card Format (Smart Reflow):
                  </span>
                  {(Object.keys(CANVAS_SIZES) as AspectRatioType[]).map((rk) => {
                    const sz = CANVAS_SIZES[rk];
                    const active = aspectRatio === rk;
                    return (
                      <button
                        key={rk}
                        onClick={() => {
                          onAspectRatioChange(rk);
                          setShowMagicSwitch(false);
                        }}
                        className={`w-full p-2 rounded-lg border text-left flex items-center justify-between transition ${
                          active
                            ? 'bg-amber-500/20 border-amber-400 text-amber-200 font-bold'
                            : 'bg-neutral-800/80 hover:bg-neutral-800 border-neutral-700 text-neutral-200'
                        }`}
                      >
                        <div>
                          <div>{sz.name}</div>
                          <div className="text-[10px] text-neutral-400 font-mono">
                            {sz.width}×{sz.height}px ({sz.ratioLabel})
                          </div>
                        </div>
                        {active && <Check className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>

                {onTranslateCard && (
                  <div className="pt-2 border-t border-neutral-800 space-y-1.5">
                    <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5" /> Magic Translate Card Text:
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          onTranslateCard('hindi');
                          setShowMagicSwitch(false);
                        }}
                        className="py-1.5 px-2 rounded bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 font-semibold text-amber-200 border border-neutral-700 transition cursor-pointer"
                      >
                        शुद्ध हिंदी
                      </button>
                      <button
                        onClick={() => {
                          onTranslateCard('english');
                          setShowMagicSwitch(false);
                        }}
                        className="py-1.5 px-2 rounded bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 font-semibold text-amber-200 border border-neutral-700 transition cursor-pointer"
                      >
                        English
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-neutral-800 hidden md:block" />

        {/* Editable Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Invitation Title..."
          className="min-w-0 bg-neutral-900/80 hover:bg-neutral-900 focus:bg-neutral-950 text-xs font-medium text-neutral-100 px-2 py-1.5 sm:px-2.5 rounded-lg border border-neutral-800 focus:border-amber-500/60 outline-none w-20 min-[400px]:w-28 sm:w-44 md:w-52 truncate transition-colors"
          title="Click to rename invitation"
        />
      </div>

      {/* Center: Undo/Redo & Quick Save Status */}
      <div className="ml-0 flex shrink-0 items-center gap-1.5 sm:ml-auto sm:gap-2">
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

        <button
          onClick={handleQuickSave}
          className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-[11px] text-neutral-300 hover:text-amber-300 transition"
          title="Save Snapshot to My Projects"
        >
          {savedNotice ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-semibold">Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 text-amber-400" />
              <span>Save</span>
            </>
          )}
        </button>
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

        {/* Share / Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-neutral-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Download PNG, PDF or Share on WhatsApp"
        >
          <Download className="w-3.5 h-3.5 text-neutral-950" />
          <span className="hidden sm:inline">Share / Export</span>
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
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-neutral-900 border border-neutral-700/80 rounded-xl shadow-2xl p-1.5 z-50 flex flex-col gap-1 text-xs text-neutral-200 animate-in fade-in zoom-in-95 duration-100">
              <div className="p-2 border-b border-neutral-800">
                <span className="text-[10px] text-neutral-400 font-semibold uppercase block mb-1.5">
                  Card Aspect Ratio
                </span>
                <div className="grid grid-cols-3 gap-1">
                  {(Object.keys(CANVAS_SIZES) as AspectRatioType[]).map((ratioKey) => (
                    <button
                      key={ratioKey}
                      onClick={() => {
                        onAspectRatioChange(ratioKey);
                        setShowMoreMenu(false);
                      }}
                      className={`px-2 py-1 rounded text-[10px] font-medium transition ${
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

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenAiCopy();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-800 text-left transition text-amber-200"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Royal Wording & Shloka Assistant</span>
              </button>

              <button
                onClick={() => {
                  setShowMoreMenu(false);
                  onOpenPreview();
                }}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-800 text-left transition"
              >
                <Eye className="w-4 h-4 text-neutral-400" />
                <span>Full Invitation Preview</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
