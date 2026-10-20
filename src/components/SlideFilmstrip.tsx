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
  Music,
  Volume2,
  Scissors,
  Pause,
} from 'lucide-react';
import { AudioClipSettings, AudioTimelineClip, AudioTrack, CardPage, ImageElement, TextElement, PageTransitionType } from '../types/editor';

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
  activeAudioTrack?: AudioTrack;
  audioClip?: AudioClipSettings;
  onUpdateAudioClip?: (updates: Partial<AudioClipSettings>) => void;
  audioClips?: AudioTimelineClip[];
  audioTracks?: AudioTrack[];
  selectedAudioClipId?: string | null;
  onSelectAudioClip?: (clip: AudioTimelineClip) => void;
  onApplyAudioToAll?: (clip: AudioTimelineClip) => void;
  onRemoveAudioClip?: (clipId: string) => void;
  onSplitAudioClip?: (clipId: string, splitAtSec: number) => void;
  onTrimAudioClip?: (clipId: string, updates: Partial<AudioTimelineClip>) => void;
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
  activeAudioTrack,
  audioClip,
  onUpdateAudioClip,
  audioClips = [],
  audioTracks = [],
  selectedAudioClipId,
  onSelectAudioClip,
  onApplyAudioToAll,
  onRemoveAudioClip,
  onSplitAudioClip,
  onTrimAudioClip,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isGridViewOpen, setIsGridViewOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isAudioAdvancedOpen, setIsAudioAdvancedOpen] = useState(false);
  const [isSourceTrimOpen, setIsSourceTrimOpen] = useState(false);
  const [playheadSec, setPlayheadSec] = useState(0);
  const [previewingClipId, setPreviewingClipId] = useState<string | null>(null);
  const [durationDraft, setDurationDraft] = useState('4.5');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const audioPreviewRef = useRef<HTMLAudioElement>(null);
  const audioPreviewTimerRef = useRef<number | null>(null);
  const previewRequestRef = useRef(0);
  const trimRef = useRef<{ clipId: string; edge: 'front' | 'end'; pointerX: number; laneWidth: number; sourceDuration: number; sourceStart: number; sourceEnd: number; settings: AudioClipSettings } | null>(null);
  const [audioSourceDurations, setAudioSourceDurations] = useState<Record<string, number>>({});
  const [audioSourceErrors, setAudioSourceErrors] = useState<Record<string, boolean>>({});
  const audioMetadataElementsRef = useRef<Record<string, HTMLAudioElement>>({});
  const audioScrollContainerRef = useRef<HTMLDivElement>(null);

  const currentPage = pages[currentPageIndex] || pages[0];

  useEffect(() => {
    setDurationDraft(String(currentPage?.duration || 4.5));
  }, [currentPage?.id, currentPage?.duration, currentPageIndex]);

  const commitCustomDuration = () => {
    const parsed = Number(durationDraft);
    if (!Number.isFinite(parsed) || parsed < 0.25) {
      setDurationDraft(String(currentPage?.duration || 4.5));
      return;
    }
    const duration = Math.min(600, Math.round(parsed * 10) / 10);
    setDurationDraft(String(duration));
    onUpdatePage?.(currentPageIndex, { duration });
  };

  // Auto-scroll the active slide into view when changed
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeElement = scrollContainerRef.current.children[currentPageIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentPageIndex]);

  useEffect(() => {
    if (!audioScrollContainerRef.current) return;
    const activeCell = audioScrollContainerRef.current.children[currentPageIndex] as HTMLElement | undefined;
    activeCell?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
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
  const invitationDuration = Math.max(Number(totalDuration), 0.1);
  const selectedAudioTimelineClip = audioClips.find((clip) => clip.id === selectedAudioClipId);
  const referencedTrackIds = Array.from(new Set(audioClips.map((clip) => clip.trackId))).sort().join('|');
  useEffect(() => {
    const tracks = referencedTrackIds.split('|').filter(Boolean)
      .map((id) => audioTracks.find((track) => track.id === id) || (activeAudioTrack?.id === id ? activeAudioTrack : undefined))
      .filter((track): track is AudioTrack => Boolean(track?.audioUrl));
    tracks.forEach((track) => {
      // Keep the media element alive and load each distinct source once. The old
      // effect cancelled every pending metadata request whenever any song was
      // added, which could leave the newly-added track showing "loading" forever.
      if (audioMetadataElementsRef.current[track.id] || audioSourceDurations[track.id] || audioSourceErrors[track.id]) return;
      const audio = new Audio();
      audio.preload = 'metadata';
      audioMetadataElementsRef.current[track.id] = audio;
      const updateDuration = () => {
        if (Number.isFinite(audio.duration) && audio.duration > 0) {
          setAudioSourceDurations((durations) => ({ ...durations, [track.id]: audio.duration }));
          setAudioSourceErrors((errors) => ({ ...errors, [track.id]: false }));
          audio.removeEventListener('loadedmetadata', updateDuration);
          audio.removeEventListener('durationchange', updateDuration);
          audio.removeEventListener('error', markError);
        }
      };
      const markError = () => {
        setAudioSourceErrors((errors) => ({ ...errors, [track.id]: true }));
        delete audioMetadataElementsRef.current[track.id];
      };
      audio.addEventListener('loadedmetadata', updateDuration);
      audio.addEventListener('durationchange', updateDuration);
      audio.addEventListener('error', markError);
      audio.src = new URL(track.audioUrl!, window.location.href).href;
      audio.load();
    });
  }, [referencedTrackIds, audioTracks, activeAudioTrack, audioSourceDurations, audioSourceErrors]);
  const selectedClipTimelineStart = selectedAudioTimelineClip?.timelineStartSec ?? (selectedAudioTimelineClip?.pageIndex === null || !selectedAudioTimelineClip ? 0 : pages.slice(0, selectedAudioTimelineClip.pageIndex).reduce((sum, p) => sum + (p.duration || 4.5), 0));
  const selectedClipScopeEnd = !selectedAudioTimelineClip || selectedAudioTimelineClip.pageIndex === null
    ? invitationDuration
    : pages.slice(0, selectedAudioTimelineClip.pageIndex + 1).reduce((sum, p) => sum + (p.duration || 4.5), 0);
  const selectedClipMaxDuration = Math.max(0.25, selectedClipScopeEnd - selectedClipTimelineStart);
  // Show the complete source track in the audio lane. The page timeline controls
  // playback length separately, so a short invitation must not crop the song view.
  const selectAudioClip = (clip: AudioTimelineClip) => {
    previewRequestRef.current += 1;
    audioPreviewRef.current?.pause();
    if (previewingClipId) {
      if (audioPreviewTimerRef.current !== null) window.clearInterval(audioPreviewTimerRef.current);
      audioPreviewTimerRef.current = null;
      setPreviewingClipId(null);
    }
    if (clip.timelineStartSec !== undefined) setPlayheadSec(clip.timelineStartSec);
    else if (clip.pageIndex !== null) setPlayheadSec(pages.slice(0, clip.pageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0));
    onSelectAudioClip?.(clip);
  };

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      const drag = trimRef.current;
      if (!drag || !onTrimAudioClip) return;
      const delta = ((event.clientX - drag.pointerX) / Math.max(1, drag.laneWidth)) * drag.sourceDuration;
      if (drag.edge === 'front') {
        const nextStart = Math.max(0, Math.min(drag.sourceEnd - 0.25, drag.sourceStart + delta));
        onTrimAudioClip(drag.clipId, { settings: { ...drag.settings, startSec: nextStart } });
      } else {
        const nextEnd = Math.max(drag.sourceStart + 0.25, Math.min(drag.sourceDuration, drag.sourceEnd + delta));
        onTrimAudioClip(drag.clipId, { settings: { ...drag.settings, sourceEndSec: nextEnd } });
      }
    };
    const onPointerUp = () => { trimRef.current = null; };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    return () => { window.removeEventListener('pointermove', onPointerMove); window.removeEventListener('pointerup', onPointerUp); };
  }, [onTrimAudioClip]);

  useEffect(() => () => {
    if (audioPreviewTimerRef.current !== null) window.clearInterval(audioPreviewTimerRef.current);
    audioPreviewRef.current?.pause();
  }, []);

  const toggleAudioPreview = async (clip: AudioTimelineClip) => {
    const audio = audioPreviewRef.current;
    const track = audioTracks.find((item) => item.id === clip.trackId);
    if (!audio || !track?.audioUrl) return;
    if (previewingClipId === clip.id) {
      previewRequestRef.current += 1;
      audio.pause();
      if (audioPreviewTimerRef.current !== null) window.clearInterval(audioPreviewTimerRef.current);
      audioPreviewTimerRef.current = null;
      setPreviewingClipId(null);
      return;
    }
    const requestId = ++previewRequestRef.current;
    if (audioPreviewTimerRef.current !== null) window.clearInterval(audioPreviewTimerRef.current);
    setPreviewingClipId(null);
    audio.pause();
    audio.src = track.audioUrl;
    audio.load();
    const scopeDuration = clip.pageIndex === null ? invitationDuration : (pages[clip.pageIndex]?.duration || 4.5);
    const duration = Math.min(clip.settings.durationSec ?? scopeDuration, scopeDuration);
    // Wait for metadata before seeking. Setting currentTime immediately after load()
    // is race-prone and can make the preview begin at the start of the song.
    if (audio.readyState < HTMLMediaElement.HAVE_METADATA) {
      await new Promise<void>((resolve, reject) => {
        const onMetadata = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error('Could not load audio metadata')); };
        const cleanup = () => {
          audio.removeEventListener('loadedmetadata', onMetadata);
          audio.removeEventListener('error', onError);
        };
        audio.addEventListener('loadedmetadata', onMetadata, { once: true });
        audio.addEventListener('error', onError, { once: true });
      }).catch(() => undefined);
    }
    if (requestId !== previewRequestRef.current || !Number.isFinite(audio.duration)) return;
    const elapsedStart = performance.now();
    const sourceStart = Math.max(0, Math.min(clip.settings.startSec, Math.max(0, audio.duration - 0.05)));
    const sourceEnd = Math.max(sourceStart + 0.05, Math.min(clip.settings.sourceEndSec ?? audio.duration, audio.duration));
    audio.currentTime = sourceStart;
    audio.volume = clip.settings.fadeInSec > 0 ? 0 : clip.settings.volume;
    audio.loop = false;
    try { await audio.play(); } catch { setPreviewingClipId(null); return; }
    setPreviewingClipId(clip.id);
    audioPreviewTimerRef.current = window.setInterval(() => {
      const elapsed = (performance.now() - elapsedStart) / 1000;
      if (elapsed >= duration) {
        audio.pause();
        audio.volume = clip.settings.volume;
        if (audioPreviewTimerRef.current !== null) window.clearInterval(audioPreviewTimerRef.current);
        audioPreviewTimerRef.current = null;
        setPreviewingClipId(null);
        return;
      }
      if (audio.currentTime >= sourceEnd - 0.03) {
        if (clip.settings.loop) audio.currentTime = sourceStart;
        else {
          audio.pause();
          if (audioPreviewTimerRef.current !== null) window.clearInterval(audioPreviewTimerRef.current);
          audioPreviewTimerRef.current = null;
          setPreviewingClipId(null);
          return;
        }
      }
      let fade = 1;
      if (clip.settings.fadeInSec > 0 && elapsed < clip.settings.fadeInSec) fade = elapsed / clip.settings.fadeInSec;
      if (clip.settings.fadeOutSec > 0 && elapsed > duration - clip.settings.fadeOutSec) fade = Math.min(fade, (duration - elapsed) / clip.settings.fadeOutSec);
      audio.volume = Math.max(0, Math.min(1, clip.settings.volume * fade));
    }, 40);
  };

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
      <div className="px-4 py-1.5 border-b border-neutral-800/80 bg-neutral-950/70 flex items-center justify-between gap-3 text-xs">
        {/* Left: Info & Per-Slide Timing / Transition Controls */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-amber-300 font-cinzel font-bold shrink-0 tracking-wide">
            <Film className="w-4 h-4 text-amber-400" />
            <span>Suite Pages & Video Timeline</span>
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
                  onChange={(e) => {
                    const duration = parseFloat(e.target.value);
                    setDurationDraft(String(duration));
                    onUpdatePage(currentPageIndex, { duration });
                  }}
                  className="bg-transparent text-[11px] text-amber-300 font-mono outline-none cursor-pointer"
                  title="Choose a common slide duration"
                >
                  <option value={3} className="bg-neutral-900">3.0s</option>
                  <option value={4.5} className="bg-neutral-900">4.5s</option>
                  <option value={6} className="bg-neutral-900">6.0s</option>
                  <option value={8} className="bg-neutral-900">8.0s</option>
                </select>
                <span className="text-[9px] text-neutral-500">Custom</span>
                <input
                  type="number"
                  min={0.25}
                  max={600}
                  step={0.1}
                  value={durationDraft}
                  onChange={(event) => setDurationDraft(event.target.value)}
                  onBlur={commitCustomDuration}
                  onKeyDown={(event) => { if (event.key === 'Enter') event.currentTarget.blur(); }}
                  className="w-[58px] bg-neutral-950 text-[11px] text-neutral-100 font-mono text-center outline-none border border-neutral-700 rounded px-1 py-0.5 focus:border-amber-400"
                  aria-label="Custom slide duration in seconds"
                  title="Enter a custom slide duration from 0.25 to 600 seconds"
                />
                <span className="text-[10px] text-neutral-500">s</span>
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
        <div className="p-2 bg-neutral-900/90 overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700">
          <div ref={scrollContainerRef} className="flex items-stretch gap-3 min-w-max pb-1">
            {pages.map((page, index) => {
              const isActive = index === currentPageIndex;
              const slideImg = getSlideImage(page);
              const headline = getSlideHeadline(page);

              return (
                <div
                  key={page.id || index}
                  onClick={() => { onSelectPage(index); setPlayheadSec(pages.slice(0, index).reduce((sum, p) => sum + (p.duration || 4.5), 0)); }}
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
                    className="relative w-full h-28 rounded-lg overflow-hidden border border-neutral-700/80 bg-neutral-950 shadow-inner flex flex-col justify-between p-1.5"
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
              style={{ width: '110px', height: '160px' }}
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

      {/* Canva-style music track: clips sit at their real position in the invitation timeline. */}
      {!isCollapsed && audioClips.length > 0 && (
        <div className="px-4 py-2 bg-neutral-950/90 border-t border-neutral-800 space-y-2" aria-label="Invitation music timeline">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <Music className="w-4 h-4 shrink-0 text-violet-300" />
              <span className="text-[11px] font-semibold text-neutral-100">Music track</span>
              <span className="hidden sm:inline text-[10px] text-neutral-500">Select a clip to edit · each clip sits under its slide time</span>
            </div>
            {selectedAudioTimelineClip && <button type="button" onClick={() => onApplyAudioToAll?.(selectedAudioTimelineClip)} className="shrink-0 rounded-md border border-violet-400/40 bg-violet-500/10 px-2.5 py-1 text-[10px] font-semibold text-violet-200 hover:bg-violet-500/20">Use on all slides</button>}
          </div>
          <audio ref={audioPreviewRef} preload="metadata" className="hidden" />
          {selectedAudioTimelineClip && <div className="flex flex-wrap items-center gap-x-3 gap-y-1 rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5" role="toolbar" aria-label="Selected music clip controls">
            <span className="max-w-40 truncate text-[10px] font-semibold text-violet-200">{audioTracks.find((item) => item.id === selectedAudioTimelineClip.trackId)?.name || selectedAudioTimelineClip.trackId}</span>
            <button type="button" onClick={() => void toggleAudioPreview(selectedAudioTimelineClip)} className="flex items-center gap-1 rounded px-1.5 py-1 text-[10px] text-neutral-200 hover:bg-neutral-800">{previewingClipId === selectedAudioTimelineClip.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}{previewingClipId === selectedAudioTimelineClip.id ? 'Stop' : 'Preview'}</button>
            <button type="button" onClick={() => setIsSourceTrimOpen((open) => !open)} className={`rounded px-2 py-1 text-[10px] ${isSourceTrimOpen ? 'bg-violet-500/20 text-violet-200' : 'text-neutral-200 hover:bg-neutral-800'}`}>{isSourceTrimOpen ? 'Done trimming' : 'Choose song part'}</button>
            <label className="flex items-center gap-1.5 text-[10px] text-neutral-300"><Volume2 className="w-3.5 h-3.5 text-violet-200" /><input aria-label="Selected music clip volume" type="range" min={0} max={1} step={0.01} value={audioClip?.volume ?? 0.45} onChange={(event) => onUpdateAudioClip?.({ volume: Number(event.target.value) })} className="w-16 accent-violet-400" /><span>{Math.round((audioClip?.volume ?? 0.45) * 100)}%</span></label>
            <label className="flex items-center gap-1.5 text-[10px] text-neutral-300">Plays for <input aria-label="How long music plays on this slide" type="range" min={0.25} max={selectedClipMaxDuration} step={0.1} value={Math.min(audioClip?.durationSec ?? selectedClipMaxDuration, selectedClipMaxDuration)} onChange={(event) => onUpdateAudioClip?.({ durationSec: Number(event.target.value) })} className="w-20 accent-violet-400" /><span className="w-8 text-violet-200">{Math.min(audioClip?.durationSec ?? selectedClipMaxDuration, selectedClipMaxDuration).toFixed(1)}s</span></label>
            <button type="button" onClick={() => setIsAudioAdvancedOpen((open) => !open)} className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-neutral-300 hover:bg-neutral-800">More {isAudioAdvancedOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}</button>
            {isAudioAdvancedOpen && <>
              <button type="button" onClick={() => { const enabled = (audioClip?.fadeInSec || 0) > 0 || (audioClip?.fadeOutSec || 0) > 0; onUpdateAudioClip?.({ fadeInSec: enabled ? 0 : Math.min(0.8, selectedClipMaxDuration / 3), fadeOutSec: enabled ? 0 : Math.min(0.8, selectedClipMaxDuration / 3) }); }} className={`rounded px-2 py-1 text-[10px] ${audioClip?.fadeInSec || audioClip?.fadeOutSec ? 'bg-violet-500/20 text-violet-200' : 'text-neutral-300 hover:bg-neutral-800'}`}>Fade</button>
              <button type="button" onClick={() => { const track = audioTracks.find((item) => item.id === selectedAudioTimelineClip.trackId) || activeAudioTrack; const declaredBpm = Number(track?.tempo); const beatSec = 60 / (declaredBpm >= 40 && declaredBpm <= 240 ? declaredBpm : 120); const enabled = !audioClip?.beatSync; onUpdateAudioClip?.({ beatSync: enabled, startSec: enabled ? Math.round((audioClip?.startSec || 0) / beatSec) * beatSec : (audioClip?.startSec || 0), loop: enabled ? true : audioClip?.loop }); }} className={`rounded px-2 py-1 text-[10px] ${audioClip?.beatSync ? 'bg-violet-500/20 text-violet-200' : 'text-neutral-300 hover:bg-neutral-800'}`}>Beat Sync</button>
              <button type="button" onClick={() => onSplitAudioClip?.(selectedAudioTimelineClip.id, playheadSec)} disabled={playheadSec <= selectedClipTimelineStart + 0.15 || playheadSec >= selectedClipTimelineStart + Math.min(selectedAudioTimelineClip.settings.durationSec ?? selectedClipMaxDuration, selectedClipMaxDuration) - 0.15} className="flex items-center gap-1 rounded px-2 py-1 text-[10px] text-neutral-300 hover:bg-neutral-800 disabled:opacity-35 disabled:cursor-not-allowed" title="Move the playhead inside the selected music clip, then split"> <Scissors className="w-3.5 h-3.5" /> Split</button>
              <button type="button" onClick={() => onRemoveAudioClip?.(selectedAudioTimelineClip.id)} title="Remove music clip" className="flex items-center gap-1 rounded px-1.5 py-1 text-[10px] text-neutral-400 hover:bg-red-500/10 hover:text-red-300"><Trash2 className="w-3.5 h-3.5" /> Remove</button>
            </>}
          </div>}
          <div className="flex items-center gap-2 px-1 text-[9px] font-mono text-neutral-500"><span>00:00</span><input aria-label="Video timeline playhead" type="range" min={0} max={invitationDuration} step={0.05} value={playheadSec} onChange={(event) => { const time = Number(event.target.value); setPlayheadSec(time); let cursor = 0; const pageIndex = pages.findIndex((page) => { const end = cursor + (page.duration || 4.5); const matches = time < end; cursor = end; return matches; }); if (pageIndex >= 0 && pageIndex !== currentPageIndex) onSelectPage(pageIndex); }} className="h-1 flex-1 accent-violet-400" /><span>{playheadSec.toFixed(1)}s / {totalDuration}s</span></div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-neutral-700" aria-label="Music clips aligned beneath their slides">
            <div ref={audioScrollContainerRef} className="relative flex w-max items-stretch gap-3">
              {pages.map((page, pageIndex) => {
                const pageStart = pages.slice(0, pageIndex).reduce((sum, item) => sum + (item.duration || 4.5), 0);
                const pageDuration = page.duration || 4.5;
                const clipsForPage = audioClips.filter((clip) => clip.pageIndex === pageIndex);
                return <div key={page.id || pageIndex} className="relative h-10 w-[136px] shrink-0 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-800/80" aria-label={`Slide ${pageIndex + 1} music`}>
                  {clipsForPage.map((clip) => {
                    const track = audioTracks.find((item) => item.id === clip.trackId) || (clip.trackId === activeAudioTrack?.id ? activeAudioTrack : undefined);
                    const timelineStart = Math.max(pageStart, clip.timelineStartSec ?? pageStart);
                    const duration = Math.max(0.25, Math.min(clip.settings.durationSec ?? (pageStart + pageDuration - timelineStart), pageStart + pageDuration - timelineStart));
                    const selected = selectedAudioClipId === clip.id;
                    return <button key={clip.id} type="button" onClick={() => selectAudioClip(clip)} title={`Slide ${pageIndex + 1} · ${track?.name || clip.trackId} · ${duration.toFixed(1)}s`} className={`absolute inset-y-0.5 overflow-hidden rounded-md border text-left ${selected ? 'border-violet-200 bg-violet-500/75 ring-1 ring-violet-200/70 z-10' : 'border-violet-400/40 bg-violet-600/50 hover:bg-violet-500/60'}`} style={{ left: `${((timelineStart - pageStart) / pageDuration) * 100}%`, width: `${Math.max((duration / pageDuration) * 100, 10)}%` }}>
                      <span className="absolute inset-0 flex items-center justify-center gap-[2px] px-1 opacity-60" aria-hidden="true">{Array.from({ length: 24 }, (_, i) => <i key={i} className="w-[2px] rounded-full bg-violet-100" style={{ height: `${5 + ((i * 17 + i * i * 7) % 22)}px` }} />)}</span>
                      <span className="relative z-10 block truncate px-2 text-[9px] font-semibold text-white">♫ {track?.name || clip.trackId}</span>
                    </button>;
                  })}
                  {clipsForPage.length === 0 && <span className="flex h-full items-center justify-center text-[9px] text-neutral-600">Slide {pageIndex + 1} · no music</span>}
                </div>;
              })}
              {audioClips.filter((clip) => clip.pageIndex === null).map((clip) => {
                const track = audioTracks.find((item) => item.id === clip.trackId) || (clip.trackId === activeAudioTrack?.id ? activeAudioTrack : undefined);
                const duration = Math.max(0.25, Math.min(clip.settings.durationSec ?? invitationDuration, invitationDuration));
                const timelineStart = Math.max(0, clip.timelineStartSec ?? 0);
                const selected = selectedAudioClipId === clip.id;
                const slideCellSpan = pages.length * 136 + Math.max(0, pages.length - 1) * 12;
                return <button key={clip.id} type="button" onClick={() => selectAudioClip(clip)} title={`All slides · ${track?.name || clip.trackId} · ${duration.toFixed(1)}s`} className={`absolute inset-y-0.5 overflow-hidden rounded-md border text-left ${selected ? 'border-violet-200 bg-violet-500/75 ring-1 ring-violet-200/70 z-10' : 'border-violet-400/40 bg-violet-600/50 hover:bg-violet-500/60'}`} style={{ left: `${(timelineStart / invitationDuration) * slideCellSpan}px`, width: `${Math.max((duration / invitationDuration) * slideCellSpan, 32)}px` }}>
                  <span className="absolute inset-0 flex items-center justify-center gap-[2px] px-1 opacity-60" aria-hidden="true">{Array.from({ length: 36 }, (_, i) => <i key={i} className="w-[2px] rounded-full bg-violet-100" style={{ height: `${5 + ((i * 17 + i * i * 7) % 22)}px` }} />)}</span>
                  <span className="relative z-10 block truncate px-2 text-[9px] font-semibold text-white">♫ {track?.name || clip.trackId} · all slides</span>
                </button>;
              })}
            </div>
          </div>
          {isSourceTrimOpen && selectedAudioTimelineClip && (() => {
            const clip = selectedAudioTimelineClip;
            const sourceDurationLoaded = Boolean(audioSourceDurations[clip.trackId]);
            const sourceDurationFailed = Boolean(audioSourceErrors[clip.trackId]);
            const sourceDuration = audioSourceDurations[clip.trackId] || Math.max(clip.settings.sourceEndSec || 30, 30);
            const sourceStart = Math.max(0, Math.min(clip.settings.startSec, sourceDuration - 0.25));
            const sourceEnd = Math.max(sourceStart + 0.25, Math.min(clip.settings.sourceEndSec ?? sourceDuration, sourceDuration));
            const sourceLeft = (sourceStart / sourceDuration) * 100;
            const sourceWidth = ((sourceEnd - sourceStart) / sourceDuration) * 100;
            const track = audioTracks.find((item) => item.id === clip.trackId);
            return <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-neutral-400"><span>Choose a part of {track?.name || clip.trackId} · drag either handle</span><span>{sourceDurationLoaded ? `${sourceDuration.toFixed(1)}s full song` : sourceDurationFailed ? `Duration unavailable · trimming first ${sourceDuration.toFixed(0)}s` : `Loading duration · drag to trim (${sourceDuration.toFixed(0)}s view)`}</span></div>
              <div className="h-9 relative overflow-hidden rounded-md border border-neutral-700 bg-neutral-800">
                <div className="absolute inset-0 flex items-center justify-center gap-[2px] px-1 pointer-events-none">{Array.from({ length: 64 }, (_, i) => <i key={i} className={`w-[2px] rounded-full ${i / 64 >= sourceStart / sourceDuration && i / 64 <= sourceEnd / sourceDuration ? 'bg-violet-200' : 'bg-neutral-500'}`} style={{ height: `${5 + ((i * 17 + i * i * 7) % 22)}px` }} />)}</div>
                <div className="absolute inset-y-0 bg-violet-500/25 border-x border-violet-200" style={{ left: `${sourceLeft}%`, width: `${sourceWidth}%` }} />
                <span role="slider" tabIndex={0} aria-label="Start of chosen song part" aria-valuenow={sourceStart} onClick={(event) => event.stopPropagation()} onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); const lane = event.currentTarget.parentElement; if (lane) trimRef.current = { clipId: clip.id, edge: 'front', pointerX: event.clientX, laneWidth: lane.clientWidth, sourceDuration, sourceStart, sourceEnd, settings: clip.settings }; }} className="absolute inset-y-0 w-4 -translate-x-1/2 border border-violet-950 z-10 cursor-ew-resize touch-none bg-violet-100 shadow-[0_0_0_1px_rgba(139,92,246,0.55)]" style={{ left: `${sourceLeft}%` }} />
                <span role="slider" tabIndex={0} aria-label="End of chosen song part" aria-valuenow={sourceEnd} onClick={(event) => event.stopPropagation()} onPointerDown={(event) => { event.preventDefault(); event.stopPropagation(); const lane = event.currentTarget.parentElement; if (lane) trimRef.current = { clipId: clip.id, edge: 'end', pointerX: event.clientX, laneWidth: lane.clientWidth, sourceDuration, sourceStart, sourceEnd, settings: clip.settings }; }} className="absolute inset-y-0 w-4 -translate-x-1/2 border border-violet-950 z-10 cursor-ew-resize touch-none bg-violet-100 shadow-[0_0_0_1px_rgba(139,92,246,0.55)]" style={{ left: `${sourceLeft + sourceWidth}%` }} />
              </div>
              <div className="text-right text-[9px] text-violet-200">Using {sourceStart.toFixed(1)}–{sourceEnd.toFixed(1)}s</div>
            </div>;
          })()}
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
