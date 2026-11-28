import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, DoorOpen, ArrowDown, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { InviteTheme } from '../data/studioData';
import { CardCustomization } from '../data/cardCustomization';
import { ThemeShowcaseCard } from './ThemeShowcaseCard';

interface StudioHeroWithDeckProps {
  themes: InviteTheme[];
  groomName: string;
  brideName: string;
  onChangeGroomName: (val: string) => void;
  onChangeBrideName: (val: string) => void;
  onLaunchPreview: (theme: InviteTheme) => void;
  onSelectThemePage?: (theme: InviteTheme) => void;
  getCustomization: (theme: InviteTheme) => { data: CardCustomization; isCustomized: boolean };
  onOpenCustomizer: (theme: InviteTheme) => void;
}

export const StudioHeroWithDeck: React.FC<StudioHeroWithDeckProps> = ({
  themes,
  groomName,
  brideName,
  onChangeGroomName,
  onChangeBrideName,
  onLaunchPreview,
  onSelectThemePage,
  getCustomization,
  onOpenCustomizer,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});
  const wasDraggedRef = React.useRef(false);

  const toggleFlip = (id: string) => {
    setFlippedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % themes.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + themes.length) % themes.length);
  };

  const handleSafeOpen = (theme: InviteTheme) => {
    if (wasDraggedRef.current) return;
    onLaunchPreview(theme);
  };

  const activeTheme = themes[activeIndex] || themes[0];

  return (
    <section className="relative overflow-hidden bg-[#FAF6EE] paper-grain pt-12 pb-20 sm:pt-16 sm:pb-28 px-6 border-b border-[#D8C8AA]">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          {/* Left Column: Studio Proposition + Live Couple Name Customizer */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs tracking-[0.16em] uppercase text-[#9E2A2B] font-medium">
              <span>Indian Digital Wedding &amp; Celebration Studio</span>
              <span aria-hidden="true">·</span>
              <span className="line-through opacity-75 text-[#6D5A49]">₹2,499 – ₹10,300</span>
              <span aria-hidden="true">→</span>
              <span className="font-bold text-[#15803D]">100% FREE</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.75rem] font-semibold text-[#231B15] leading-[1.06] tracking-tight text-balance">
              Invitations as beautiful as the moment.
            </h1>

            <p className="text-base text-[#4A3B2F] leading-relaxed max-w-xl">
              One WhatsApp link that opens in seconds on any phone—3D haveli gates, Paithani silk threads, wax-sealed envelopes, Qandeel sky lanterns, scratch-to-reveal dates, and Aangan family links. Every card is now unlocked for ₹0.
            </p>

            {/* Live Couple Name Sandbox */}
            <div className="rounded-xl border border-[#D8C8AA] bg-[#F2EAD9]/65 p-4 sm:p-5 max-w-xl">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium tracking-[0.14em] uppercase text-[#6D5A49]">
                  Preview all 31+ live cards with your names
                </p>
                <span className="text-xs tabular-nums">
                  <span className="line-through text-[#6D5A49] mr-1.5">{activeTheme.originalPrice}</span>
                  <span className="font-bold text-[#15803D]">FREE</span>
                </span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="hero-groom" className="block text-[11px] text-[#5C4B3D]">
                    Groom / Celebrant Name
                  </label>
                  <input
                    id="hero-groom"
                    type="text"
                    value={groomName}
                    onChange={(e) => onChangeGroomName(e.target.value)}
                    maxLength={20}
                    className="mt-1 w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="hero-bride" className="block text-[11px] text-[#5C4B3D]">
                    Bride / Partner Name
                  </label>
                  <input
                    id="hero-bride"
                    type="text"
                    value={brideName}
                    onChange={(e) => onChangeBrideName(e.target.value)}
                    maxLength={20}
                    className="mt-1 w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => onLaunchPreview(activeTheme)}
                className="inline-flex items-center gap-2 rounded-lg bg-[#9E2A2B] px-5 py-3 text-sm font-medium text-[#FAF6EE] transition-colors hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0"
              >
                <DoorOpen className="h-4 w-4 text-[#FDE68A]" />
                <span>Open {activeTheme.name} Live</span>
              </button>

              {onSelectThemePage && (
                <button
                  type="button"
                  onClick={() => onSelectThemePage(activeTheme)}
                  className="inline-flex items-center gap-2 rounded-lg border border-[#C8B493] bg-[#F2EAD9] px-4 py-3 text-sm font-medium text-[#231B15] transition-colors hover:bg-[#E8DBC2] cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>{activeTheme.name} Card Page</span>
                  <ArrowUpRight className="h-4 w-4 text-[#9E2A2B]" />
                </button>
              )}

              <button
                type="button"
                onClick={() => onOpenCustomizer(activeTheme)}
                className="inline-flex items-center gap-2 rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-4 py-3 text-sm font-medium text-[#231B15] transition-colors hover:bg-[#F2EAD9] cursor-pointer whitespace-nowrap shrink-0"
              >
                <SlidersHorizontal className="h-4 w-4 text-[#9E2A2B]" />
                <span>Customize Free</span>
              </button>

              <a
                href="#themes"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3.5 py-3 text-sm font-medium text-[#231B15] transition-colors hover:bg-[#F2EAD9] whitespace-nowrap shrink-0"
              >
                <span>All 31+ Cards</span>
                <ArrowDown className="h-4 w-4 text-[#9E2A2B]" />
              </a>
            </div>

            {/* Quiet Unboxed Studio Proof Strip */}
            <div className="pt-4 border-t border-[#D8C8AA] flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#6D5A49]">
              <span>
                <span className="line-through opacity-75 mr-1">₹2,499–₹10,300</span>
                <strong className="text-[#15803D]">FREE (₹0 Forever)</strong>
              </span>
              <span aria-hidden="true">·</span>
              <span>Aangan Guest Links Included</span>
              <span aria-hidden="true">·</span>
              <span>English &amp; हिन्दी Bilingual</span>
            </div>
          </div>

          {/* Right Column: Interactive 3D Fanned Card Deck */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-[350px] sm:max-w-[390px] h-[520px] sm:h-[550px]">
              {themes.map((theme, idx) => {
                const total = themes.length;
                const relativeOffset = (idx - activeIndex + total) % total;
                if (relativeOffset > 3 && relativeOffset !== total - 1) return null;

                const isFront = relativeOffset === 0;
                const isLeavingBehind = relativeOffset === total - 1;

                const translateX = isFront ? 0 : isLeavingBehind ? -18 : relativeOffset * 24;
                const translateY = isFront ? 0 : isLeavingBehind ? 6 : relativeOffset * 10;
                const rotateDeg = isFront ? 0 : isLeavingBehind ? -2 : relativeOffset * 3.5;
                const scale = isFront ? 1 : isLeavingBehind ? 0.92 : Math.max(0.84, 1 - relativeOffset * 0.055);
                const zIndex = isLeavingBehind ? 0 : total - relativeOffset;
                const opacity = isFront
                  ? 1
                  : isLeavingBehind
                    ? 0
                    : Math.max(0.45, 1 - relativeOffset * 0.16);

                return (
                  <motion.div
                    key={theme.id}
                    style={{ zIndex, pointerEvents: isFront || relativeOffset <= 3 ? 'auto' : 'none' }}
                    initial={false}
                    animate={{
                      x: translateX,
                      y: translateY,
                      rotate: rotateDeg,
                      scale,
                      opacity,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 26,
                    }}
                    drag={isFront ? 'x' : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.28}
                    onDragStart={() => {
                      wasDraggedRef.current = true;
                    }}
                    onDragEnd={(_, info) => {
                      window.setTimeout(() => {
                        wasDraggedRef.current = false;
                      }, 100);
                      if (!isFront) return;
                      if (info.offset.x < -70 || info.velocity.x < -300) {
                        handleNext();
                      } else if (info.offset.x > 70 || info.velocity.x > 300) {
                        handlePrev();
                      }
                    }}
                    onClick={() => {
                      if (!isFront && relativeOffset <= 3) setActiveIndex(idx);
                    }}
                    className={`absolute inset-0 ${
                      isFront ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'
                    }`}
                  >
                    <ThemeShowcaseCard
                      theme={theme}
                      isActive={isFront}
                      isFlipped={Boolean(flippedMap[theme.id])}
                      onToggleFlip={() => toggleFlip(theme.id)}
                      onLaunchPreview={handleSafeOpen}
                      onSelectThemePage={onSelectThemePage}
                      groomName={groomName || 'Aarav'}
                      brideName={brideName || 'Meera'}
                      customization={getCustomization(theme).data}
                      isCustomized={getCustomization(theme).isCustomized}
                      onOpenCustomizer={(t) => {
                        if (!wasDraggedRef.current) onOpenCustomizer(t);
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* Deck Controls Under Stack */}
            <div className="mt-6 flex w-full max-w-[390px] items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Previous invite card"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#C8B493] bg-[#F2EAD9] text-[#231B15] transition-colors hover:bg-[#E7DAC0] cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Next invite card"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#C8B493] bg-[#F2EAD9] text-[#231B15] transition-colors hover:bg-[#E7DAC0] cursor-pointer"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <span className="text-xs tabular-nums tracking-[0.14em] uppercase text-[#6D5A49]">
                {activeTheme.name} · <span className="line-through opacity-75">{activeTheme.originalPrice}</span>{' '}
                <strong className="text-[#15803D]">FREE</strong> · {activeIndex + 1}/{themes.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
