import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Share2,
  Palette,
  Music,
} from 'lucide-react';
import {
  CardPage,
  AspectRatioType,
  CANVAS_SIZES,
  ImageElement,
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
  FrameElement,
  FormElement,
  SheetElement,
  MockupElement,
  Model3DElement,
  VideoElement,
  AudioElement,
  AudioTrack,
  AudioClipSettings,
  AudioTimelineClip,
} from '../types/editor';
import {
  getElementAnimationStyle,
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
  renderFormVisual,
  renderSheetVisual,
  renderMockupVisual,
  renderModel3DVisual,
  renderVideoVisual,
  renderAudioVisual,
} from './Canvas';
import { AUDIO_TRACKS } from '../data/audioTracks';

interface VideoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: CardPage[];
  title: string;
  aspectRatio: AspectRatioType;
  activeAudioTrack?: AudioTrack;
  audioClip?: AudioClipSettings;
  audioClips?: AudioTimelineClip[];
  onCustomizeInEditor: (targetSlideIndex?: number) => void;
  onShareVideo?: () => void;
}

export const VideoCardModal: React.FC<VideoCardModalProps> = ({
  isOpen,
  onClose,
  pages,
  title,
  aspectRatio,
  activeAudioTrack,
  audioClip = { startSec: 0, durationSec: null, volume: 0.45, fadeInSec: 0, fadeOutSec: 0, loop: true },
  audioClips = [],
  onCustomizeInEditor,
  onShareVideo,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [audioCycle, setAudioCycle] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const trackAudioRef = useRef<HTMLAudioElement | null>(null);
  const clipTimerRef = useRef<number | null>(null);
  const clipElapsedRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentSlide = pages[currentIndex] || pages[0];
  const slideDurationMs = (currentSlide?.duration || 4.5) * 1000;
  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];
  const invitationDurationSec = pages.reduce((sum, page) => sum + (page.duration || 4.5), 0);
  const currentPageDurationSec = currentSlide?.duration || 4.5;
  const pageStartSec = pages.slice(0, currentIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0);
  const timelineCursorSec = pageStartSec + (progress / 100) * currentPageDurationSec;
  const isMobileViewport = window.matchMedia('(max-width: 767px)').matches;
  const mobileAllSlidesClip = isMobileViewport
    ? audioClips.find((clip) => clip.pageIndex === null)
    : undefined;
  const allSlidesTimelineClip = audioClips.find((clip) => {
    if (clip.pageIndex !== null) return false;
    const start = clip.timelineStartSec ?? 0;
    const end = start + Math.min(clip.settings.durationSec ?? invitationDurationSec, invitationDurationSec);
    return timelineCursorSec >= start && timelineCursorSec < end;
  });
  const pageTimelineClip = audioClips.find((clip) => {
    if (clip.pageIndex !== currentIndex) return false;
    const start = clip.timelineStartSec ?? pageStartSec;
    const end = start + Math.min(clip.settings.durationSec ?? currentPageDurationSec, currentPageDurationSec);
    return timelineCursorSec >= start && timelineCursorSec < end;
  });
  // Older projects can contain a separate copy of the same song on every
  // slide. Treat matching, full-slide clips as one continuous sequence so the
  // audio element does not pause and seek at each page boundary.
  const pageAudioClips = pages.map((page, index) => {
    const pageClip = audioClips.find((clip) => clip.pageIndex === index);
    const sharedClip = audioClips.find((clip) => clip.pageIndex === null);
    return isMobileViewport ? sharedClip || pageClip : pageClip || sharedClip;
  });
  const firstSequenceClip = pageAudioClips[0];
  const continuousPageSequenceClip = firstSequenceClip && pages.length > 1 && pageAudioClips.every((clip, index) => {
    if (!clip || clip.trackId !== firstSequenceClip.trackId) return false;
    const settings = clip.settings;
    const first = firstSequenceClip.settings;
    const pageDuration = pages[index]?.duration || 4.5;
    const clipCoversPage = settings.durationSec === null || settings.durationSec === undefined || settings.durationSec >= pageDuration - 0.05;
    return clipCoversPage
      && settings.startSec === first.startSec
      && settings.sourceEndSec === first.sourceEndSec
      && settings.volume === first.volume
      && settings.fadeInSec === first.fadeInSec
      && settings.fadeOutSec === first.fadeOutSec
      && settings.loop === first.loop;
  })
    ? {
        ...firstSequenceClip,
        id: `audio-sequence-${firstSequenceClip.trackId}`,
        pageIndex: null,
        timelineStartSec: 0,
        settings: { ...firstSequenceClip.settings, durationSec: null },
      }
    : undefined;

  // Shared clips and identical full-slide copies must not restart when the
  // visual sequence changes pages in either viewport.
  const timelineClip = isMobileViewport
    ? mobileAllSlidesClip || continuousPageSequenceClip || allSlidesTimelineClip || pageTimelineClip
    : continuousPageSequenceClip || pageTimelineClip || allSlidesTimelineClip;
  const track = (timelineClip && AUDIO_TRACKS.find((item) => item.id === timelineClip.trackId)) || activeAudioTrack || AUDIO_TRACKS[0];
  const currentAudioClip = timelineClip?.settings || audioClip;
  const clipTimelineStartSec = timelineClip?.timelineStartSec ?? (timelineClip?.pageIndex === null ? 0 : pageStartSec);
  const audioScopeEndSec = timelineClip?.pageIndex === null ? invitationDurationSec : pageStartSec + currentPageDurationSec;
  const musicDurationSec = Math.max(0.25, Math.min(currentAudioClip.durationSec ?? (audioScopeEndSec - clipTimelineStartSec), audioScopeEndSec - clipTimelineStartSec));
  const isContinuousAllSlidesAudio = timelineClip?.pageIndex === null;
  const continuousPlaybackConfigRef = useRef({ clip: currentAudioClip, durationSec: musicDurationSec });
  continuousPlaybackConfigRef.current = { clip: currentAudioClip, durationSec: musicDurationSec };
  // Keep one audio element alive as the video advances. Page-scoped clips with
  // different tracks/settings still switch at their own page boundaries.
  const audioPlaybackPageKey = timelineClip?.pageIndex === null
    ? 'all-slides'
    : currentIndex;
  const pageTransition = currentSlide?.transition || 'fade';
  const transitionAnimations: Record<string, string | undefined> = {
    none: undefined,
    fade: 'invitation-page-fade 550ms ease-out both',
    slide: 'invitation-page-slide 720ms cubic-bezier(.22,1,.36,1) both',
    zoom: 'invitation-page-zoom 720ms cubic-bezier(.22,1,.36,1) both',
    'royal-curtain': 'invitation-page-curtain 850ms cubic-bezier(.22,1,.36,1) both',
    sparkle: 'invitation-page-sparkle 900ms ease-out both',
    push: 'invitation-page-push 720ms cubic-bezier(.22,1,.36,1) both',
    wipe: 'invitation-page-wipe 780ms cubic-bezier(.22,1,.36,1) both',
    flip: 'invitation-page-flip 760ms cubic-bezier(.22,1,.36,1) both',
    blur: 'invitation-page-blur 760ms ease-out both',
    rotate: 'invitation-page-rotate 780ms cubic-bezier(.22,1,.36,1) both',
    stack: 'invitation-page-stack 720ms cubic-bezier(.22,1,.36,1) both',
    chop: 'invitation-page-chop 800ms cubic-bezier(.22,1,.36,1) both',
    'match-move': 'invitation-page-match 760ms cubic-bezier(.22,1,.36,1) both',
    iris: 'invitation-page-iris 820ms cubic-bezier(.22,1,.36,1) both',
    'vertical-wipe': 'invitation-page-vertical-wipe 780ms cubic-bezier(.22,1,.36,1) both',
    'cross-zoom': 'invitation-page-cross-zoom 820ms cubic-bezier(.22,1,.36,1) both',
    'page-turn': 'invitation-page-turn 850ms cubic-bezier(.22,1,.36,1) both',
    'light-sweep': 'invitation-page-light-sweep 900ms ease-out both',
    panorama: 'invitation-page-panorama 850ms cubic-bezier(.22,1,.36,1) both',
  };
  const pageTransitionAnimation = transitionAnimations[pageTransition] ?? transitionAnimations.fade;

  useEffect(() => {
    clipElapsedRef.current = 0;
  }, [isOpen, track.audioUrl, timelineClip?.id]);

  useEffect(() => {
    if (!isOpen) return;
    // Shared sequences use the stable audio clock below in both viewports.
    if (isContinuousAllSlidesAudio) return;
    const audio = trackAudioRef.current;
    if (!audio || !track.audioUrl || !timelineClip) {
      audio?.pause();
      return;
    }
    audio.volume = currentAudioClip.volume;
    audio.muted = isMuted;
    if (isPlaying && !isMuted) {
      let elapsedSec = clipElapsedRef.current >= musicDurationSec ? 0 : clipElapsedRef.current;
      let lastTick = performance.now();
      const sourceStartSec = Math.max(0, currentAudioClip.startSec);
      const sourceEndSec = Number.isFinite(audio.duration)
        ? Math.max(sourceStartSec + 0.05, Math.min(currentAudioClip.sourceEndSec ?? audio.duration, audio.duration))
        : Number.POSITIVE_INFINITY;
      audio.loop = false;
      const sourceLength = Number.isFinite(audio.duration) ? Math.max(0.05, sourceEndSec - sourceStartSec) : 0;
      const sourceOffset = currentAudioClip.loop && sourceLength > 0
        ? elapsedSec % sourceLength
        : Math.min(elapsedSec, sourceLength || elapsedSec);
      audio.currentTime = Number.isFinite(audio.duration)
        ? Math.min(sourceStartSec + sourceOffset, Math.max(0, audio.duration - 0.05))
        : sourceStartSec + sourceOffset;
      void audio.play().catch(() => undefined);
      clipTimerRef.current = window.setInterval(() => {
        const now = performance.now();
        elapsedSec += (now - lastTick) / 1000;
        lastTick = now;
        clipElapsedRef.current = elapsedSec;

        if (elapsedSec >= musicDurationSec) {
          audio.pause();
          audio.volume = currentAudioClip.volume;
          if (clipTimerRef.current !== null) window.clearInterval(clipTimerRef.current);
          clipTimerRef.current = null;
          return;
        }

        if (Number.isFinite(audio.duration) && audio.currentTime >= sourceEndSec - 0.03) {
          if (currentAudioClip.loop) audio.currentTime = Math.min(sourceStartSec, Math.max(0, audio.duration - 0.05));
          else {
            audio.pause();
            return;
          }
        }

        let fade = 1;
        if (currentAudioClip.fadeInSec > 0 && elapsedSec < currentAudioClip.fadeInSec) {
          fade = elapsedSec / currentAudioClip.fadeInSec;
        }
        if (currentAudioClip.fadeOutSec > 0 && elapsedSec > musicDurationSec - currentAudioClip.fadeOutSec) {
          fade = Math.min(fade, Math.max(0, (musicDurationSec - elapsedSec) / currentAudioClip.fadeOutSec));
        }
        audio.volume = Math.max(0, Math.min(1, currentAudioClip.volume * fade));
      }, 40);
    } else {
      audio.pause();
    }
    return () => {
      audio.pause();
      audio.volume = currentAudioClip.volume;
      if (clipTimerRef.current !== null) window.clearInterval(clipTimerRef.current);
      clipTimerRef.current = null;
    };
  }, [isOpen, track.audioUrl, isPlaying, isMuted, audioCycle, currentAudioClip.startSec, currentAudioClip.sourceEndSec, currentAudioClip.durationSec, currentAudioClip.volume, currentAudioClip.fadeInSec, currentAudioClip.fadeOutSec, currentAudioClip.loop, musicDurationSec, timelineClip?.id, audioPlaybackPageKey, isContinuousAllSlidesAudio]);

  useEffect(() => {
    if (!isOpen || !isContinuousAllSlidesAudio) return;
    const audio = trackAudioRef.current;
    if (!audio || !track.audioUrl || !timelineClip) return;

    if (!isPlaying || isMuted) {
      audio.pause();
      return;
    }

    let elapsedSec = clipElapsedRef.current;
    let lastTick = performance.now();
    let disposed = false;
    const getBounds = () => {
      const { clip } = continuousPlaybackConfigRef.current;
      const sourceStartSec = Math.max(0, clip.startSec);
      const sourceEndSec = Number.isFinite(audio.duration)
        ? Math.max(sourceStartSec + 0.05, Math.min(clip.sourceEndSec ?? audio.duration, audio.duration))
        : Number.POSITIVE_INFINITY;
      return { clip, sourceStartSec, sourceEndSec };
    };

    const startPlayback = () => {
      if (disposed) return;
      const { clip, sourceStartSec, sourceEndSec } = getBounds();
      const sourceLength = Number.isFinite(sourceEndSec) ? Math.max(0.05, sourceEndSec - sourceStartSec) : 0;
      const sourceOffset = clip.loop && sourceLength > 0
        ? elapsedSec % sourceLength
        : Math.min(elapsedSec, sourceLength || elapsedSec);
      if (Number.isFinite(audio.duration)) {
        audio.currentTime = Math.min(sourceStartSec + sourceOffset, Math.max(0, audio.duration - 0.05));
      }
      audio.volume = clip.volume;
      audio.muted = false;
      void audio.play().catch(() => undefined);
    };

    audio.loop = false;
    if (Number.isFinite(audio.duration)) {
      startPlayback();
    } else {
      audio.addEventListener('loadedmetadata', startPlayback, { once: true });
      // Start fetching/playing immediately; loadedmetadata restores the saved
      // source offset once the browser knows the track duration.
      void audio.play().catch(() => undefined);
    }

    clipTimerRef.current = window.setInterval(() => {
      const now = performance.now();
      elapsedSec += (now - lastTick) / 1000;
      lastTick = now;
      clipElapsedRef.current = elapsedSec;

      const { clip, sourceStartSec, sourceEndSec } = getBounds();
      const { durationSec } = continuousPlaybackConfigRef.current;
      if (elapsedSec >= durationSec) {
        audio.pause();
        audio.volume = clip.volume;
        if (clipTimerRef.current !== null) window.clearInterval(clipTimerRef.current);
        clipTimerRef.current = null;
        return;
      }

      if (Number.isFinite(audio.duration) && audio.currentTime >= sourceEndSec - 0.03) {
        if (clip.loop) audio.currentTime = Math.min(sourceStartSec, Math.max(0, audio.duration - 0.05));
        else {
          audio.pause();
          return;
        }
      }

      let fade = 1;
      if (clip.fadeInSec > 0 && elapsedSec < clip.fadeInSec) fade = elapsedSec / clip.fadeInSec;
      if (clip.fadeOutSec > 0 && elapsedSec > durationSec - clip.fadeOutSec) {
        fade = Math.min(fade, Math.max(0, (durationSec - elapsedSec) / clip.fadeOutSec));
      }
      audio.volume = Math.max(0, Math.min(1, clip.volume * fade));
    }, 40);

    return () => {
      disposed = true;
      audio.removeEventListener('loadedmetadata', startPlayback);
      audio.pause();
      audio.volume = continuousPlaybackConfigRef.current.clip.volume;
      if (clipTimerRef.current !== null) window.clearInterval(clipTimerRef.current);
      clipTimerRef.current = null;
    };
  }, [isOpen, isContinuousAllSlidesAudio, track.audioUrl, isPlaying, isMuted, audioCycle, timelineClip?.id]);

  const playShehnaiNote = () => {
    if (isMuted || track.audioUrl || !timelineClip) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const ragaFrequencies = track.ragaNotes;
      const freq = ragaFrequencies[currentIndex % ragaFrequencies.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = track.category === 'flute' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.4, ctx.currentTime + 1.2);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.6);
    } catch {
      // Audio autoplay restriction fallback
    }
  };

  const handleNext = () => {
    if (currentIndex === pages.length - 1 && (isContinuousAllSlidesAudio || audioClip.durationSec === null || audioClip.durationSec >= invitationDurationSec - 0.05)) {
      clipElapsedRef.current = 0;
      setAudioCycle((cycle) => cycle + 1);
    }
    setCurrentIndex((prev) => (prev + 1) % pages.length);
    setProgress(0);
    startTimeRef.current = Date.now();
    playShehnaiNote();
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + pages.length) % pages.length);
    setProgress(0);
    startTimeRef.current = Date.now();
    playShehnaiNote();
  };

  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    startTimeRef.current = Date.now();

    const updateLoop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProg = Math.min(100, (elapsed / slideDurationMs) * 100);
      setProgress(currentProg);

      if (elapsed >= slideDurationMs) {
        if (currentIndex === pages.length - 1 && (isContinuousAllSlidesAudio || audioClip.durationSec === null || audioClip.durationSec >= invitationDurationSec - 0.05)) {
          clipElapsedRef.current = 0;
          setAudioCycle((cycle) => cycle + 1);
        }
        setCurrentIndex((prev) => (prev + 1) % pages.length);
        setProgress(0);
        startTimeRef.current = Date.now();
        playShehnaiNote();
      } else {
        animFrameRef.current = requestAnimationFrame(updateLoop);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isOpen, isPlaying, currentIndex, slideDurationMs, pages.length, audioClip.durationSec, invitationDurationSec, isContinuousAllSlidesAudio]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 max-md:items-start max-md:px-2 max-md:pt-[max(0.5rem,env(safe-area-inset-top))] max-md:pb-[max(0.5rem,env(safe-area-inset-bottom))] z-50 animate-fade-in select-none">
      {track.audioUrl && <audio ref={trackAudioRef} src={track.audioUrl} preload="metadata" />}
      <div className="bg-neutral-900 border border-neutral-700 rounded-3xl max-md:rounded-2xl w-full max-w-4xl max-h-[96vh] max-md:max-h-[calc(100dvh-env(safe-area-inset-top)-env(safe-area-inset-bottom)-1rem)] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 max-md:px-3 max-md:py-2.5 border-b border-neutral-800 flex items-center justify-between gap-2 z-20 bg-neutral-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5 max-md:min-w-0 max-md:flex-1 max-md:gap-2">
            <div className="w-8 h-8 max-md:w-7 max-md:h-7 shrink-0 rounded-lg gold-shimmer flex items-center justify-center text-neutral-950 font-bold">
              <Play className="w-4 h-4 fill-neutral-950" />
            </div>
            <div className="max-md:min-w-0 max-md:flex-1">
              <div className="flex items-center gap-2 max-md:min-w-0 max-md:gap-1.5">
                <h3 className="text-sm font-bold text-neutral-100 max-md:min-w-0 max-md:truncate max-md:text-xs">
                  {title || 'Digital Video Invitation'}
                </h3>
                <span title={track.name} className="max-w-[38%] shrink-0 truncate text-[10px] text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-1 max-md:max-w-[34%] max-md:px-1.5">
                  <Music className="w-3 h-3 shrink-0" /> <span className="truncate">{track.name}</span>
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 max-md:hidden">
                {pages.map((page) => page.title.replace(/^Page\s+\d+\s*[—-]\s*/i, '')).join('  →  ')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 max-md:shrink-0 max-md:gap-1.5">
            <button
              onClick={() => {
                onClose();
                onCustomizeInEditor(currentIndex);
              }}
              className="px-3 py-1.5 max-md:p-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
              aria-label={`Edit slide ${currentIndex + 1} in Studio`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="max-md:hidden">Edit Slide #{currentIndex + 1} in Studio</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close video preview"
              className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Stage */}
        <div className="flex-1 overflow-hidden bg-neutral-950 flex flex-col items-center justify-center p-4 max-md:min-h-0 max-md:p-2 relative">
          {/* Top Stories Progress Bar Segments */}
          <div className="w-full max-w-sm flex items-center gap-1.5 mb-3 px-2 z-20">
            {pages.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  setCurrentIndex(i);
                  setProgress(0);
                  startTimeRef.current = Date.now();
                }}
                className="flex-1 h-1 bg-neutral-700/60 rounded-full overflow-hidden cursor-pointer"
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-amber-300 transition-all duration-75"
                  style={{
                    width:
                      i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Phone Frame for Video Story with Ken Burns effect */}
          {(() => {
            const frameWidth = Math.min(
              320,
              Math.floor(window.innerHeight * 0.58 * (dimensions.width / dimensions.height))
            );
            const scale = frameWidth / dimensions.width;
            const frameHeight = Math.round(dimensions.height * scale);
            return (
              <div
                className="relative rounded-[32px] overflow-hidden border-4 border-neutral-800 shadow-2xl ring-2 ring-amber-500/30 bg-neutral-900"
                style={{ width: `${frameWidth}px`, height: `${frameHeight}px`, maxWidth: '100%', maxHeight: '100%' }}
              >
                <div
                  key={`page-transition-${currentIndex}-${pageTransition}`}
                  className="w-full h-full relative overflow-hidden transition-all duration-500"
                  style={{
                    background: currentSlide.backgroundValue,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    animation: pageTransitionAnimation,
                  }}
                >
                  <div
                    className="w-full h-full relative transition-transform duration-1000 ease-out"
                    style={{
                      transform: isPlaying ? 'scale(1.03)' : 'scale(1)',
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
                      {[...currentSlide.elements]
                        .filter((el) => !el.hidden)
                        .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
                        .map((elem, elementIndex) => {
                          const flipTransform = `${elem.flipX ? ' scaleX(-1)' : ''}${
                            elem.flipY ? ' scaleY(-1)' : ''
                          }`;
                          return (
                            <div
                              key={`${elem.id}-${currentIndex}`}
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
                              <div className="w-full h-full" style={{
                                ...getElementAnimationStyle(elem),
                                animationDelay: elem.animation && elem.animation !== 'none'
                                  ? `${Math.min(elementIndex * 0.13, 0.9)}s`
                                  : undefined,
                                animationDuration: elem.animation && elem.animation !== 'none'
                                  ? `${1.35 / Math.max(0.6, elem.animationSpeed || 1)}s`
                                  : undefined,
                              }}>
                              {elem.type === 'text' && (
                                <div className="w-full h-full flex flex-col justify-center select-none">
                                  {renderTextVisual(elem as TextElement)}
                                </div>
                              )}
                              {elem.type === 'image' && (
                                <div
                                  className="w-full h-full overflow-hidden relative"
                                  style={{
                                    ...getImageMaskStyle(elem as ImageElement),
                                    backgroundColor: '#2b111a',
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
                                    alt="Slide Photo"
                                    className="w-full h-full"
                                    referrerPolicy="no-referrer"
                                    style={{
                                      objectFit: (elem as ImageElement).objectFit || 'cover',
                                      transform: `scale(${
                                        (elem as ImageElement).scale || 1
                                      }) translate(${(elem as ImageElement).offsetX || 0}%, ${
                                        (elem as ImageElement).offsetY || 0
                                      }%) rotate(${
                                        (elem as ImageElement).rotationInside || 0
                                      }deg)`,
                                    }}
                                  />
                                </div>
                              )}
                              {elem.type === 'sticker' && (
                                <div
                                  className="w-full h-full flex items-center justify-center pointer-events-none [&>svg]:w-full [&>svg]:h-full"
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
                              {elem.type === 'countdown' &&
                                renderCountdownVisual(elem as CountdownElement)}
                              {elem.type === 'barcode' && renderBarcodeVisual(elem as BarcodeElement)}
                              {elem.type === 'frame' && renderFrameVisual(elem as FrameElement)}
                              {elem.type === 'form' && renderFormVisual(elem as FormElement)}
                              {elem.type === 'sheet' && renderSheetVisual(elem as SheetElement)}
                              {elem.type === 'mockup' && renderMockupVisual(elem as MockupElement)}
                              {elem.type === 'model3d' && renderModel3DVisual(elem as Model3DElement)}
                              {elem.type === 'video' && renderVideoVisual(elem as VideoElement)}
                              {elem.type === 'audio' && renderAudioVisual(elem as AudioElement)}
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
                              {elem.type === 'qr' && (
                                <div
                                  className="w-full h-full p-1.5 rounded shadow-md border border-amber-500/30 flex items-center justify-center"
                                  style={{
                                    backgroundColor:
                                      (elem as QrElement).backgroundColor || '#FFF4D6',
                                  }}
                                >
                                  {(elem as QrElement).dataUrl ? (
                                    <img
                                      src={(elem as QrElement).dataUrl}
                                      alt="QR Code"
                                      className="w-full h-full object-contain"
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : null}
                                </div>
                              )}
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div
                  onClick={handlePrev}
                  className="absolute left-0 top-12 bottom-12 w-1/3 cursor-w-resize z-30"
                  title="Previous Slide"
                />
                <div
                  onClick={handleNext}
                  className="absolute right-0 top-12 bottom-12 w-1/3 cursor-e-resize z-30"
                  title="Next Slide"
                />
              </div>
            );
          })()}

          <div className="text-center mt-3 max-md:mt-2 z-20 max-w-full px-2">
            <span className="text-xs font-semibold text-amber-200 max-md:block max-md:truncate max-md:text-[11px]">
              Slide {currentIndex + 1} of {pages.length}: {currentSlide.title} (
              {currentSlide.duration || 4.5}s)
            </span>
          </div>
        </div>

        {/* Bottom Playback & Thumbnail Controls */}
        <div className="p-4 max-md:p-3 border-t border-neutral-800 bg-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 max-md:gap-2.5 z-20">
          <div className="flex items-center justify-center gap-2 max-md:w-full">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              title="Previous Slide"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying((p) => !p)}
              className="p-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold shadow-lg"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-neutral-950" />
              ) : (
                <Play className="w-4 h-4 fill-neutral-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
              title="Next Slide"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setIsMuted((m) => !m);
                if (isMuted) playShehnaiNote();
              }}
              className={`p-2 rounded-lg transition ${
                !isMuted ? 'bg-amber-500/20 text-amber-300' : 'bg-neutral-800 text-neutral-500'
              }`}
              title={isMuted ? 'Unmute Music' : 'Mute Music'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-start gap-1.5 overflow-x-auto max-w-full max-md:w-full max-md:pb-0.5">
            {pages.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setProgress(0);
                  startTimeRef.current = Date.now();
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition max-md:shrink-0 max-md:px-2 max-md:py-1.5 ${
                  currentIndex === idx
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                    : 'bg-neutral-800 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {idx + 1}. {p.title.split(' ')[0]}
              </button>
            ))}
          </div>

          <button
            onClick={onShareVideo}
            disabled={!onShareVideo}
            className="px-3.5 py-2 max-md:w-full max-md:py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-neutral-950 font-bold text-xs rounded-xl shadow transition flex items-center justify-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="sm:hidden">Share video</span>
            <span className="hidden sm:inline">Export & Share Video</span>
          </button>
        </div>
      </div>
    </div>
  );
};
