import React, { useState } from 'react';
import { Play, ArrowUpRight, SlidersHorizontal } from 'lucide-react';
import { InviteTheme } from '../data/studioData';
import { CardCustomization } from '../data/cardCustomization';
import { LivingSceneMotionOverlay } from './LivingSceneMotionOverlay';

interface FannedPhoneDeckShowcaseProps {
  themes: InviteTheme[];
  groomName: string;
  brideName: string;
  onLaunchPreview: (theme: InviteTheme) => void;
  onSelectThemePage: (theme: InviteTheme) => void;
  getCustomization: (theme: InviteTheme) => { data: CardCustomization; isCustomized: boolean };
  onOpenCustomizer: (theme: InviteTheme) => void;
  compact?: boolean;
}

const SLOTS = [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5];

export const FannedPhoneDeckShowcase: React.FC<FannedPhoneDeckShowcaseProps> = ({
  themes,
  onLaunchPreview,
  onSelectThemePage,
  getCustomization,
  onOpenCustomizer,
  compact = false,
}) => {
  // Track which slot is currently "popped up" (lifted upward on click)
  const [poppedSlot, setPoppedSlot] = useState<number | null>(null);

  const total = themes.length;
  // Center the fan so slot 0 is a flagship cream/gold card (e.g. Mehr / Jharokha / Paithani)
  const baseCenterIdx = 0;

  const getThemeForSlot = (slot: number): InviteTheme => {
    const idx = (baseCenterIdx + slot + total * 10) % total;
    return themes[idx] || themes[0];
  };

  const activePoppedTheme =
    poppedSlot !== null ? getThemeForSlot(poppedSlot) : getThemeForSlot(0);

  const handlePhoneClick = (slot: number, theme: InviteTheme) => {
    if (poppedSlot === slot) {
      // Clicking the already popped-up phone opens its live interactive preview
      onLaunchPreview(theme);
    } else {
      // Pop this phone upward!
      setPoppedSlot(slot);
    }
  };

  return (
    <div className="relative w-full select-none">
      {/* Warm Ivory-Cream Stage matching Screenshot_2026-11-16_211120 (#F3ECE1) */}
      <div
        className={`relative mx-auto w-full rounded-[32px] bg-[#F3ECE1] border border-[#e7ddd0] overflow-hidden flex flex-col items-center justify-center shadow-[0_24px_60px_-28px_rgba(32,22,12,0.14)] ${
          compact ? 'h-[400px] sm:h-[460px]' : 'h-[440px] sm:h-[560px]'
        }`}
      >
        {/* Left & Right Soft Edge Fade Masks (outer phones fading into warm cream) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 w-14 sm:w-32 z-30 bg-gradient-to-r from-[#F3ECE1] via-[#F3ECE1]/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-14 sm:w-32 z-30 bg-gradient-to-l from-[#F3ECE1] via-[#F3ECE1]/75 to-transparent"
        />

        {/* Fanned 11-Phone Arc Container */}
        <div className="relative w-full max-w-[1280px] h-full flex items-center justify-center pt-4">
          {SLOTS.map((slot) => {
            const theme = getThemeForSlot(slot);
            if (!theme) return null;

            const custom = getCustomization(theme);
            const coverSrc = theme.image;

            const absSlot = Math.abs(slot);
            const isCenter = slot === 0;
            const isPopped = poppedSlot === slot;

            // Exact geometric fan coordinates matching Screenshot_2026-11-16_211120
            const xSpread = compact ? 74 : 106;
            const translateX = slot * xSpread * (1 - absSlot * 0.032);
            const baseTranslateY = absSlot * absSlot * (compact ? 3.2 : 4.1);
            // When clicked, the phone pops upward (-30px) smoothly like top websites
            const popLiftY = isPopped ? -30 : 0;
            const translateY = baseTranslateY + popLiftY;

            const rotateDeg = slot * 3.35;
            const baseScale = Math.max(0.62, 1 - absSlot * 0.066);
            const scale = isPopped ? baseScale * 1.06 : baseScale;

            const zIndex = isPopped ? 45 : 30 - absSlot * 4;
            const opacity =
               isPopped
                ? 1
                : absSlot === 5
                ? 0.26
                : absSlot === 4
                ? 0.56
                : absSlot === 3
                ? 0.86
                : 1;
            const blurPx = isPopped ? 0 : absSlot === 5 ? 2.2 : absSlot === 4 ? 1.0 : 0;

            return (
              <div
                key={`${theme.id}-slot-${slot}`}
                onClick={() => handlePhoneClick(slot, theme)}
                role="button"
                tabIndex={absSlot <= 3 ? 0 : -1}
                aria-label={`${theme.name} invitation — click to pop up`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handlePhoneClick(slot, theme);
                  }
                }}
                style={{
                  transform: `translate3d(${translateX}px, ${translateY}px, 0) rotate(${rotateDeg}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                  filter: blurPx > 0 ? `blur(${blurPx}px)` : undefined,
                  transition:
                    'transform 480ms cubic-bezier(0.22, 1, 0.36, 1), opacity 380ms ease, filter 380ms ease, box-shadow 380ms ease',
                }}
                className={`group/phone absolute cursor-pointer origin-bottom ${
                  absSlot >= 4 ? 'hidden md:block' : absSlot >= 3 ? 'hidden sm:block' : 'block'
                }`}
              >
                {/* Hover & Pop-Up Lift Wrapper */}
                <div
                  className={`relative transition-transform duration-300 ease-out ${
                    isPopped
                      ? '-translate-y-2'
                      : 'group-hover/phone:-translate-y-3 group-hover/phone:scale-[1.02]'
                  }`}
                >
                  {/* Realistic Black iPhone Bezel matching Screenshot_2026-11-16_211120 */}
                  <div
                    className={`${
                      compact
                        ? 'w-[178px] sm:w-[208px] aspect-[9/19.2]'
                        : 'w-[204px] sm:w-[248px] aspect-[9/19.2]'
                    } rounded-[34px] sm:rounded-[40px] bg-[#161618] p-[6px] sm:p-[7px] transition-shadow duration-300 ${
                      isPopped
                        ? 'ring-2 ring-[#c9a34e] shadow-[0_38px_80px_-14px_rgba(20,14,10,0.62)]'
                        : isCenter
                        ? 'ring-1 ring-black/25 shadow-[0_28px_60px_-18px_rgba(20,14,10,0.46)]'
                        : 'ring-1 ring-black/15 shadow-[0_20px_44px_-18px_rgba(20,14,10,0.36)]'
                    }`}
                  >
                    {/* Clean Un-Obscured Invitation Screen */}
                    <div className="relative h-full w-full overflow-hidden rounded-[28px] sm:rounded-[33px] bg-[#FAF4EC]">
                      <img
                        src={coverSrc}
                        alt={theme.imageAlt}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover/phone:scale-105"
                      />

                      {absSlot <= 1 && (
                        <LivingSceneMotionOverlay
                          themeId={theme.id}
                          compact={true}
                          showBottomDiyas={true}
                          intensity={isCenter || isPopped ? 'rich' : 'subtle'}
                        />
                      )}

                      {/* Top Dynamic Island Pill (matching Screenshot_2026-11-16_211120) */}
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute top-2.5 left-1/2 -translate-x-1/2 h-[14px] sm:h-[16px] w-[52px] sm:w-[62px] rounded-full bg-black z-30"
                      />

                      {/* Top-Right Hindi Badge (हिन्दी) seen in Screenshot_2026-11-16_211120 */}
                      {slot >= 1 && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute top-3 right-3 z-20 rounded-full bg-white/85 backdrop-blur-xs border border-black/10 px-2 py-0.5 text-[8.5px] font-semibold text-[#2a1810] shadow-2xs"
                        >
                          हिन्दी
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subtle Action Pill Below Fan for Currently Selected / Popped Phone */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 px-4">
        <div className="inline-flex flex-wrap items-center gap-2.5 rounded-full border border-[#e2d8c9] bg-white px-4 py-1.5 text-[12.5px] shadow-xs">
          <span className="font-semibold text-[#141619]">{activePoppedTheme.name}</span>
          <span className="text-[#8a7e70] font-hindi text-[12px]">{activePoppedTheme.nameHi}</span>
          <span className="rounded-full bg-[#131113] text-white px-2.5 py-0.5 text-[11px] font-semibold">
            <s className="opacity-60 mr-1 font-normal">{activePoppedTheme.originalPrice}</s>
            <span className="text-[#4ade80] font-bold">FREE</span>
          </span>
          <button
            type="button"
            onClick={() => onLaunchPreview(activePoppedTheme)}
            className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#c8372d] hover:underline cursor-pointer"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Open Live Demo</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectThemePage(activePoppedTheme)}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#565656] hover:text-[#111315] cursor-pointer"
          >
            <span>Card Page</span>
            <ArrowUpRight className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => onOpenCustomizer(activePoppedTheme)}
            className="inline-flex items-center gap-1 text-[12px] font-medium text-[#565656] hover:text-[#111315] cursor-pointer"
          >
            <SlidersHorizontal className="h-3 w-3" />
            <span>Customize</span>
          </button>
        </div>
      </div>
    </div>
  );
};
