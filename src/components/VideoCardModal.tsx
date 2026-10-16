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
} from '../types/editor';
import { getImageCssFilter, renderShapeVisual } from './Canvas';

interface VideoCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: CardPage[];
  title: string;
  aspectRatio: AspectRatioType;
  onCustomizeInEditor: (targetSlideIndex?: number) => void;
}

export const VideoCardModal: React.FC<VideoCardModalProps> = ({
  isOpen,
  onClose,
  pages,
  title,
  aspectRatio,
  onCustomizeInEditor,
}) => {
  if (!isOpen) return null;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [slideDuration] = useState(4500);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const currentSlide = pages[currentIndex] || pages[0];
  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];

  const playShehnaiNote = () => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const ragaFrequencies = [293.66, 329.63, 369.99, 440.0, 493.88, 587.33];
      const freq = ragaFrequencies[currentIndex % ragaFrequencies.length];

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 1.2);

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
    if (!isPlaying) return;

    startTimeRef.current = Date.now();

    const updateLoop = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const currentProg = Math.min(100, (elapsed / slideDuration) * 100);
      setProgress(currentProg);

      if (elapsed >= slideDuration) {
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
  }, [isPlaying, currentIndex, slideDuration, pages.length]);

  useEffect(() => {
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
  }, []);

  const handleShareWhatsApp = () => {
    const msg = `✨ *Watch Our Royal Digital Video Invitation Card* ✨\n\n${title}\n\n🎬 Watch the complete ${pages.length}-Page Celebration Sequence:\n1. Royal Cover Page\n2. Haldi & Sangeet Celebration\n3. Sacred Mandap & Vedic Pheras\n4. Grand Reception & Google Maps Venue QR\n5. Thank You & Warm Blessings\n\nWarm Regards & Blessings!`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center p-3 sm:p-6 z-50 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-700 rounded-3xl w-full max-w-4xl max-h-[96vh] flex flex-col overflow-hidden shadow-2xl relative">
        {/* Top Header Bar */}
        <div className="p-3.5 sm:p-4 border-b border-neutral-800 flex items-center justify-between z-20 bg-neutral-900/90 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gold-shimmer flex items-center justify-center text-neutral-950 font-bold">
              <Play className="w-4 h-4 fill-neutral-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-neutral-100">
                  Digital Video Invitation Sequence (ई-पत्रिका वीडियो)
                </h3>
                <span className="text-[10px] text-amber-300 bg-amber-500/15 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {pages.length} Slides Sequence
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Cover → Haldi & Sangeet → Mandap Pheras → Grand Reception → Thank You
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onCustomizeInEditor(currentIndex);
              }}
              className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition flex items-center gap-1.5 shadow"
            >
              <Palette className="w-3.5 h-3.5" />
              <span>Edit Slide #{currentIndex + 1} in Studio</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Stage */}
        <div className="flex-1 overflow-hidden bg-neutral-950 flex flex-col items-center justify-center p-4 relative">
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
            const frameWidth = 320;
            const scale = frameWidth / dimensions.width;
            const frameHeight = Math.round(dimensions.height * scale);
            return (
              <div
                className="relative rounded-[32px] overflow-hidden border-4 border-neutral-800 shadow-2xl ring-2 ring-amber-500/30 bg-neutral-900"
                style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}
              >
                <div
                  className="w-full h-full relative overflow-hidden transition-all duration-500"
                  style={{
                    background: currentSlide.backgroundValue,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
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
                              }}
                            >
                              {elem.type === 'text' && (
                                <div
                                  className="whitespace-pre-line break-words w-full h-full flex flex-col justify-center select-none"
                                  style={{
                                    fontFamily: (elem as TextElement).fontFamily,
                                    fontSize: `${(elem as TextElement).fontSize}px`,
                                    color: (elem as TextElement).color,
                                    textAlign: (elem as TextElement).textAlign,
                                    fontWeight: (elem as TextElement).fontWeight,
                                    fontStyle: (elem as TextElement).fontStyle,
                                    textDecoration:
                                      (elem as TextElement).textDecoration || 'none',
                                    letterSpacing: `${(elem as TextElement).letterSpacing}px`,
                                    lineHeight: (elem as TextElement).lineHeight,
                                    textTransform:
                                      (elem as TextElement).textTransform || 'none',
                                    textShadow: (elem as TextElement).shadow
                                      ? `${(elem as TextElement).shadow?.offsetX}px ${
                                          (elem as TextElement).shadow?.offsetY
                                        }px ${(elem as TextElement).shadow?.blur}px ${
                                          (elem as TextElement).shadow?.color
                                        }`
                                      : undefined,
                                  }}
                                >
                                  {(elem as TextElement).text}
                                </div>
                              )}
                              {elem.type === 'image' && (
                                <div
                                  className="w-full h-full overflow-hidden"
                                  style={{
                                    borderRadius:
                                      (elem as ImageElement).mask === 'circle'
                                        ? '9999px'
                                        : (elem as ImageElement).mask === 'arch'
                                        ? '9999px 9999px 12px 12px'
                                        : (elem as ImageElement).mask === 'rounded'
                                        ? `${(elem as ImageElement).borderRadius || 16}px`
                                        : '0px',
                                    borderWidth: `${(elem as ImageElement).borderWidth || 0}px`,
                                    borderColor: (elem as ImageElement).borderColor || '#D4AF37',
                                    borderStyle: 'solid',
                                    filter: getImageCssFilter(elem as ImageElement),
                                  }}
                                >
                                  <img
                                    src={(elem as ImageElement).src}
                                    alt="Slide Photo"
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                    style={{
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

          <div className="text-center mt-3 z-20">
            <span className="text-xs font-semibold text-amber-200">
              Slide {currentIndex + 1} of {pages.length}: {currentSlide.title}
            </span>
          </div>
        </div>

        {/* Bottom Playback & Thumbnail Controls */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 z-20">
          <div className="flex items-center gap-2">
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
              title={isMuted ? 'Unmute Shehnai Music' : 'Mute Music'}
            >
              {!isMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full">
            {pages.map((p, idx) => (
              <button
                key={p.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  setProgress(0);
                  startTimeRef.current = Date.now();
                }}
                className={`text-[11px] px-2.5 py-1 rounded-lg whitespace-nowrap transition ${
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
            onClick={handleShareWhatsApp}
            className="px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba59] text-neutral-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Video Invite</span>
          </button>
        </div>
      </div>
    </div>
  );
};
