import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  Play,
  Share2,
  SlidersHorizontal,
} from 'lucide-react';
import { InviteTheme } from '../data/studioData';
import { CardCustomization } from '../data/cardCustomization';
import { LivingSceneMotionOverlay } from './LivingSceneMotionOverlay';

interface InvifestHeroAndTemplatesProps {
  themes: InviteTheme[];
  groomName: string;
  brideName: string;
  onChangeGroomName: (val: string) => void;
  onChangeBrideName: (val: string) => void;
  onLaunchPreview: (theme: InviteTheme) => void;
  onSelectThemePage: (theme: InviteTheme) => void;
  getCustomization: (theme: InviteTheme) => { data: CardCustomization; isCustomized: boolean };
  onOpenCustomizer: (theme: InviteTheme) => void;
  onOpenShareSuite: (theme: InviteTheme) => void;
  activeCategory?: string;
  onChangeCategory?: (categoryId: string) => void;
}

interface CategoryStyle {
  id: string;
  label: string;
  shortLabel: string;
  sub: string;
  acc: string;
  accDeep: string;
  rgb: string;
}

const INVIFEST_CATEGORIES: CategoryStyle[] = [
  {
    id: 'All',
    label: 'All',
    shortLabel: 'All',
    sub: 'Every occasion · 100% Free',
    acc: '#111315',
    accDeep: '#0b0d0f',
    rgb: '17, 19, 21',
  },
  {
    id: 'Hindu Weddings',
    label: 'Hindu Weddings',
    shortLabel: 'Hindu Weddings',
    sub: 'Pheras, haldi, sangeet & more',
    acc: '#c8372d',
    accDeep: '#8f1f17',
    rgb: '200, 55, 45',
  },
  {
    id: 'Sikh Weddings',
    label: 'Sikh Weddings',
    shortLabel: 'Sikh Weddings',
    sub: 'Anand Karaj & celebrations',
    acc: '#d4781f',
    accDeep: '#974f0b',
    rgb: '212, 120, 31',
  },
  {
    id: 'Muslim Weddings',
    label: 'Muslim Weddings',
    shortLabel: 'Muslim Weddings',
    sub: 'Nikah, walima & mehndi',
    acc: '#0f6b4a',
    accDeep: '#084832',
    rgb: '15, 107, 74',
  },
  {
    id: 'South Indian Weddings',
    label: 'South Indian Weddings',
    shortLabel: 'South Indian Weddings',
    sub: 'Muhurtham, oonjal & sadhya',
    acc: '#b84a1c',
    accDeep: '#7d2f0e',
    rgb: '184, 74, 28',
  },
  {
    id: 'Engagement',
    label: 'Engagement',
    shortLabel: 'Engagement',
    sub: 'Ring ceremony & roka',
    acc: '#b8577a',
    accDeep: '#823653',
    rgb: '184, 87, 122',
  },
  {
    id: 'Birthday',
    label: 'Birthday',
    shortLabel: 'Birthday',
    sub: 'First birthdays to milestone years',
    acc: '#8b4ab8',
    accDeep: '#5e2d82',
    rgb: '139, 74, 184',
  },
  {
    id: 'Girl Janmotsav',
    label: 'Girl Janmotsav',
    shortLabel: 'Girl Janmotsav',
    sub: 'Ladli & Rajkumari birthday suites',
    acc: '#be185d',
    accDeep: '#831843',
    rgb: '190, 24, 93',
  },
  {
    id: 'Boy Janmotsav',
    label: 'Boy Janmotsav',
    shortLabel: 'Boy Janmotsav',
    sub: 'Kanha & Yuvraj birthday suites',
    acc: '#1d4ed8',
    accDeep: '#1e3a8a',
    rgb: '29, 78, 216',
  },
];

export const InvifestHeroAndTemplates: React.FC<InvifestHeroAndTemplatesProps> = ({
  themes,
  groomName,
  brideName,
  onChangeGroomName,
  onChangeBrideName,
  onLaunchPreview,
  onSelectThemePage,
  getCustomization,
  onOpenCustomizer,
  onOpenShareSuite,
  activeCategory,
  onChangeCategory,
}) => {
  const [internalCat, setInternalCat] = useState<string>('All');
  const activeCat = activeCategory ?? internalCat;
  const setActiveCat = (catId: string) => {
    setInternalCat(catId);
    onChangeCategory?.(catId);
  };
  const [showAllCards, setShowAllCards] = useState<boolean>(false);
  const [viralPoppedIdx, setViralPoppedIdx] = useState<number>(3);
  const [heroInView, setHeroInView] = useState<boolean>(true);
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const wallGridRef = useRef<HTMLDivElement | null>(null);
  const pointerRafRef = useRef<number | null>(null);

  const activeCategoryStyle = useMemo(
    () => INVIFEST_CATEGORIES.find((c) => c.id === activeCat) || INVIFEST_CATEGORIES[0],
    [activeCat]
  );

  // Build 5 lightweight columns (3 unique cards × 2 = 6 per col) for the 3D Hero Card Wall
  const wallColumns = useMemo(() => {
    const cols: InviteTheme[][] = [[], [], [], [], []];
    themes.slice(0, 15).forEach((theme, idx) => {
      cols[idx % 5].push(theme);
    });
    return cols;
  }, [themes]);

  // Pause 3D hero wall animation automatically when scrolled out of view
  useEffect(() => {
    const el = heroSectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        setHeroInView(Boolean(entries[0]?.isIntersecting));
      },
      { threshold: 0.01 }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      if (pointerRafRef.current) window.cancelAnimationFrame(pointerRafRef.current);
    };
  }, []);

  const handleHeroPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch' || !wallGridRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    if (pointerRafRef.current) return;
    pointerRafRef.current = window.requestAnimationFrame(() => {
      pointerRafRef.current = null;
      if (!wallGridRef.current) return;
      wallGridRef.current.style.setProperty('--wall-rx', `${(12 - ny * 4).toFixed(2)}deg`);
      wallGridRef.current.style.setProperty('--wall-rz', `${(-12 + nx * 4).toFixed(2)}deg`);
    });
  };

  const handleHeroPointerLeave = () => {
    if (pointerRafRef.current) {
      window.cancelAnimationFrame(pointerRafRef.current);
      pointerRafRef.current = null;
    }
    if (!wallGridRef.current) return;
    wallGridRef.current.style.setProperty('--wall-rx', '12deg');
    wallGridRef.current.style.setProperty('--wall-rz', '-12deg');
  };

  const filteredThemes = useMemo(() => {
    if (activeCat === 'All') return themes;
    if (activeCat === 'Hindu Weddings') {
      return themes.filter((t) => t.tradition === 'hindu' && t.celebrationType !== 'birthday');
    }
    if (activeCat === 'Sikh Weddings') {
      return themes.filter((t) => t.tradition === 'sikh');
    }
    if (activeCat === 'Muslim Weddings') {
      return themes.filter((t) => t.tradition === 'muslim');
    }
    if (activeCat === 'South Indian Weddings') {
      return themes.filter((t) => t.tradition === 'south-indian');
    }
    if (activeCat === 'Engagement') {
      return themes.filter(
        (t) =>
          t.category === 'minimal' ||
          t.id === 'raabta' ||
          t.id === 'sitaara' ||
          t.id === 'gulzar' ||
          t.id === 'sheesh-mahal'
      );
    }
    if (activeCat === 'Birthday') {
      return themes.filter((t) => t.celebrationType === 'birthday');
    }
    if (activeCat === 'Girl Janmotsav') {
      return themes.filter(
        (t) => t.birthdayFlavor === 'hindu' && t.birthdayGender === 'girl'
      );
    }
    if (activeCat === 'Boy Janmotsav') {
      return themes.filter(
        (t) => t.birthdayFlavor === 'hindu' && t.birthdayGender === 'boy'
      );
    }
    return themes;
  }, [themes, activeCat]);

  const INITIAL_VISIBLE_COUNT = 12;
  const hasMoreCards = filteredThemes.length > INITIAL_VISIBLE_COUNT;
  const visibleThemes = useMemo(
    () => (showAllCards ? filteredThemes : filteredThemes.slice(0, INITIAL_VISIBLE_COUNT)),
    [filteredThemes, showAllCards]
  );

  const sindooriTheme = useMemo(
    () => themes.find((t) => t.id === 'paithani' || t.id === 'jharokha') || themes[0],
    [themes]
  );
  const palaceTheme = useMemo(
    () => themes.find((t) => t.id === 'jharokha') || themes[0],
    [themes]
  );

  return (
    <>
      {/* ====================================================================
          SECTION 1: INVIFEST HERO + TOP NAVBAR + 3D PERSPECTIVE CARD WALL
          ==================================================================== */}
      <section
        ref={heroSectionRef}
        onPointerMove={handleHeroPointerMove}
        onPointerLeave={handleHeroPointerLeave}
        className="relative overflow-hidden bg-[#fbfbfb] min-h-[780px] sm:min-h-[920px]"
      >
        {/* Centered Hero Copy */}
        <div className="relative z-20 max-w-[820px] mx-auto px-5 pt-10 sm:pt-14 text-center">
          <div className="font-dancing text-[22px] sm:text-[26px] text-[#9E2A2B] mb-1">
            Pehla Sneh · Warmth in every invite
          </div>

          <h1 className="text-[30px] sm:text-[58px] leading-[1.08] font-semibold tracking-[-0.03em] text-[#0b0d0f] font-sans">
            Sacred Nimantran for
            <br />
            Weddings &amp; Celebrations
          </h1>

          <p className="mt-4 text-[#80858c] text-[15.5px] sm:text-[18px] leading-[1.5] max-w-[680px] mx-auto">
            Handcrafted 3D palace doors, silk weaves &amp; Hindi–English warmth
            <br className="hidden sm:inline" /> for your entire family —{' '}
            <span className="line-through text-[#a0a5ad] whitespace-nowrap">₹499–₹2,000</span>{' '}
            <span className="font-semibold text-[#15803D] whitespace-nowrap">100% FREE (₹0).</span>
          </p>

          {/* Primary CTA + Quick Personalizer Bar */}
          <div className="mt-7 flex flex-col items-center gap-3.5">
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href="#templates"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-[#111315] text-white h-[52px] px-7 text-[15.5px] font-medium shadow-[0_18px_36px_-15px_rgba(15,17,20,0.55)] hover:bg-[#23272b] transition-all"
              >
                <span>Choose a template</span>
                <ArrowRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                onClick={() => onLaunchPreview(palaceTheme)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#dcdcdc] bg-white/90 backdrop-blur-sm text-[#111315] h-[52px] px-6 text-[14.5px] font-medium hover:border-[#111315] transition-all cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current text-[#c8372d]" />
                <span>Try 3D Gate Live Demo</span>
              </button>
            </div>

            {/* Instant Couple Name Preview Bar */}
            <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-[#e8e8e8] bg-white/90 backdrop-blur-md px-4 py-1.5 text-[12.5px] text-[#565656] shadow-sm">
              <span className="font-medium text-[#111315]">Live Names on All {themes.length} Cards:</span>
              <input
                type="text"
                value={groomName}
                onChange={(e) => onChangeGroomName(e.target.value)}
                aria-label="Groom or Celebrant Name"
                placeholder="Groom"
                className="w-24 rounded-full border border-[#e2e2e2] bg-[#fafafa] px-2.5 py-0.5 text-center font-semibold text-[#111315] focus:border-[#111315] focus:outline-none"
              />
              <span className="text-[#a0a5ad]">&amp;</span>
              <input
                type="text"
                value={brideName}
                onChange={(e) => onChangeBrideName(e.target.value)}
                aria-label="Bride Name"
                placeholder="Bride"
                className="w-24 rounded-full border border-[#e2e2e2] bg-[#fafafa] px-2.5 py-0.5 text-center font-semibold text-[#111315] focus:border-[#111315] focus:outline-none"
              />
              <span className="hidden sm:inline text-[11px] font-semibold text-[#15803D] bg-[#dcfce7] px-2 py-0.5 rounded-full">
                <s>₹499–₹2,000</s> FREE
              </span>
            </div>
          </div>
        </div>

        {/* 3D PERSPECTIVE HERO CARD WALL (.hero-wall — auto-pauses when off-screen) */}
        <div className={`hero-wall ${heroInView ? '' : 'is-paused'}`}>
          <div className="hero-wall-perspective">
            <div ref={wallGridRef} className="hero-wall-grid">
              {wallColumns.map((col, colIdx) => {
                const doubled = [...col, ...col];
                return (
                  <div
                    key={colIdx}
                    className={`hero-wall-col ${colIdx % 2 === 0 ? 'up' : 'down'}`}
                  >
                    {doubled.map((theme, cardIdx) => (
                      <div
                        key={`${theme.id}-${colIdx}-${cardIdx}`}
                        onClick={() => onLaunchPreview(theme)}
                        title={`Click to open ${theme.name} live interactive demo (FREE)`}
                        className="hero-wall-card group"
                      >
                        <img
                          src={theme.image}
                          alt={theme.name}
                          loading={cardIdx < 3 ? 'eager' : 'lazy'}
                          decoding="async"
                          draggable={false}
                          referrerPolicy="no-referrer"
                          className="absolute inset-0 h-full w-full object-cover object-center select-none pointer-events-none"
                        />
                        {/* Subtle Bottom Vignette with Title + Crossed-Out Price -> FREE */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/88 via-black/45 to-transparent p-3 pt-8 flex items-end justify-between text-white">
                          <div className="min-w-0 pr-1">
                            <div className="text-[13px] font-semibold leading-tight truncate">
                              {theme.name}
                            </div>
                            <div className="text-[10px] text-white/75 truncate">
                              {theme.regionLabel.split('·')[0].trim()}
                            </div>
                          </div>
                          <span className="rounded-full bg-black/85 px-2 py-0.5 text-[10px] font-semibold shrink-0">
                            <s className="opacity-65 mr-1">{theme.originalPrice}</s>
                            <span className="text-[#4ade80] font-bold">FREE</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="hero-wall-fade hero-wall-fade-top" />
          <div className="hero-wall-fade hero-wall-fade-bottom" />
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: VIRAL REELS SECTION (#viral — ViralReels-CnsCizD3.js)
          ==================================================================== */}
      <section
        id="viral"
        className="relative overflow-hidden bg-white py-16 sm:py-[96px] border-t border-[#f0f0f0] scroll-mt-4"
      >
        <div className="max-w-[1180px] mx-auto px-5 sm:px-8 grid grid-cols-[1.05fr_0.95fr] gap-14 items-center max-[920px]:grid-cols-1 max-[920px]:gap-12 max-[920px]:justify-items-center">
          {/* Left Copy */}
          <div className="w-full max-w-[460px] max-[920px]:max-w-[420px] max-[920px]:mx-auto max-[920px]:text-center max-[920px]:order-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ececec] bg-[#fafafa] px-3.5 py-1.5 text-[12.5px] font-medium text-[#565656]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e11d2a] opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e11d2a]" />
              </span>
              <span>Loved across families · 10M+ views</span>
            </div>

            <h2 className="mt-5 text-[28px] sm:text-[44px] leading-[1.13] font-semibold text-[#141619] font-sans">
              The Nimantran that turned every tap into a celebration.
            </h2>

            <p className="mt-5 text-[#767676] text-[15.5px] leading-[1.62] max-w-[430px] max-[920px]:mx-auto">
              <span className="font-semibold text-[#141619]">{sindooriTheme.name}</span> &amp;{' '}
              <span className="font-semibold text-[#141619]">{palaceTheme.name}</span>, our heirloom
              silk &amp; royal courtyard wedding invites, became an instant favourite among modern
              Indian families. Watch them open, then make them yours —{' '}
              <s className="text-[#999]">{sindooriTheme.originalPrice}</s>{' '}
              <span className="font-bold text-[#15803D]">100% FREE</span>.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3.5 max-[920px]:justify-center">
              <button
                type="button"
                onClick={() => onSelectThemePage(sindooriTheme)}
                className="inline-flex items-center gap-2 rounded-full bg-[#111315] text-white px-6 py-3 text-[14px] font-medium shadow-[0_16px_32px_-12px_rgba(17,19,21,0.45)] hover:bg-[#25282c] transition-all cursor-pointer"
              >
                <span>See the {sindooriTheme.name} invitation</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={() => onLaunchPreview(sindooriTheme)}
                className="inline-flex items-center gap-2 rounded-full border border-[#dcdcdc] bg-white text-[#141619] px-5 py-3 text-[14px] font-medium hover:border-[#141619] transition-all cursor-pointer"
              >
                <Play className="h-3.5 w-3.5 fill-current text-[#e11d2a]" />
                <span>Open Live Motion Demo</span>
              </button>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4 max-[920px]:justify-center">
              <div>
                <div className="text-[22px] font-semibold text-[#141619] leading-none">10M+</div>
                <div className="mt-1 text-[12.5px] text-[#8a8a8a]">Reel views</div>
              </div>
              <span className="h-8 w-px bg-[#ececec]" />
              <div>
                <div className="text-[22px] font-semibold text-[#141619] leading-none">4.9★</div>
                <div className="mt-1 text-[12.5px] text-[#8a8a8a]">On Google</div>
              </div>
              <span className="h-8 w-px bg-[#ececec]" />
              <div>
                <div className="text-[22px] font-semibold text-[#15803D] leading-none">
                  <s className="text-[14px] text-[#999] font-normal mr-1.5">₹1,999</s>FREE
                </div>
                <div className="mt-1 text-[12.5px] text-[#8a8a8a]">Every template ₹0</div>
              </div>
            </div>
          </div>

          {/* Right Interactive Fanned Phone Deck (Click any phone to pop it upward — zero top clipping!) */}
          <div className="relative mx-auto w-full max-w-[540px] h-[440px] sm:h-[490px] pt-8 pb-4 rounded-[28px] bg-[#F3ECE1] border border-[#e6dccf] flex items-center justify-center overflow-hidden justify-self-center max-[920px]:order-1 shadow-[0_24px_60px_-28px_rgba(32,22,12,0.18)]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 w-12 z-30 bg-gradient-to-r from-[#F3ECE1] to-transparent"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 w-12 z-30 bg-gradient-to-l from-[#F3ECE1] to-transparent"
            />

            {themes.slice(0, 7).map((fanTheme, idx) => {
              const slot = idx - 3; // -3, -2, -1, 0, +1, +2, +3
              const absSlot = Math.abs(slot);
              const isPopped = viralPoppedIdx === idx;
              const tx = slot * 50;
              const ty = 12 + absSlot * absSlot * 4.5 + (isPopped ? -24 : 0);
              const rot = slot * 4.2;
              const sc = (1 - absSlot * 0.075) * (isPopped ? 1.06 : 1);
              const zIdx = isPopped ? 40 : 30 - absSlot * 4;

              return (
                <div
                  key={fanTheme.id}
                  onClick={() => {
                    if (viralPoppedIdx === idx) {
                      onLaunchPreview(fanTheme);
                    } else {
                      setViralPoppedIdx(idx);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (viralPoppedIdx === idx) onLaunchPreview(fanTheme);
                      else setViralPoppedIdx(idx);
                    }
                  }}
                  style={{
                    transform: `translate3d(${tx}px, ${ty}px, 0) rotate(${rot}deg) scale(${sc})`,
                    zIndex: zIdx,
                    opacity: isPopped ? 1 : absSlot === 3 ? 0.45 : absSlot === 2 ? 0.8 : 1,
                    transition:
                      'transform 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease',
                  }}
                  className="group/vphone absolute cursor-pointer origin-bottom"
                >
                  <div className="transition-transform duration-300 group-hover/vphone:-translate-y-2">
                    <div
                      className={`w-[144px] sm:w-[162px] aspect-[9/19.2] rounded-[30px] bg-[#161618] p-[5px] ${
                        isPopped
                          ? 'ring-2 ring-[#c9a34e] shadow-[0_34px_68px_-14px_rgba(0,0,0,0.62)]'
                          : 'ring-1 ring-black/15 shadow-[0_22px_45px_-16px_rgba(0,0,0,0.42)]'
                      }`}
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-[26.5px] bg-[#FAF4EC]">
                        <img
                          src={fanTheme.image}
                          alt={fanTheme.imageAlt}
                          loading="lazy"
                          decoding="async"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                        {isPopped && (
                          <LivingSceneMotionOverlay
                            themeId={fanTheme.id}
                            compact={true}
                            showBottomDiyas={true}
                            intensity="rich"
                          />
                        )}
                        {/* Dynamic Island */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-12 rounded-full bg-black z-20"
                        />
                        {/* Hindi Pill */}
                        {slot >= 1 && (
                          <span
                            aria-hidden="true"
                            className="pointer-events-none absolute top-2.5 right-2.5 z-20 rounded-full bg-white/85 px-1.5 py-0.5 text-[7.5px] font-semibold text-[#2a1810]"
                          >
                            हिन्दी
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: TEMPLATES BROWSER (#templates — TemplatesBrowser-DMufcnB1.js)
          ==================================================================== */}
      <section
        id="templates"
        style={
          {
            '--acc': activeCategoryStyle.acc,
            '--acc-deep': activeCategoryStyle.accDeep,
            '--acc-rgb': activeCategoryStyle.rgb,
          } as React.CSSProperties
        }
        className="tpl-section relative overflow-hidden py-16 sm:py-[110px]"
      >
        <div id="themes" className="absolute -top-12" />
        <div className="tpl-wash" aria-hidden="true" />
        <div className="tpl-glow" aria-hidden="true" />

        <div className="relative z-10 max-w-[1180px] mx-auto px-5 sm:px-8">
          {/* Heading */}
          <div className="text-center max-w-[760px] mx-auto">
            <div
              className="font-dancing text-[24px] sm:text-[28px] transition-colors duration-500"
              style={{ color: 'var(--acc)' }}
            >
              Nimantran Collection
            </div>
            <h2 className="mt-1 text-[26px] sm:text-[44px] leading-[1.15] font-semibold text-[#141619] font-sans">
              Crafted for your sacred day. Built by hand. Sent in a single tap.
            </h2>
            <p className="mt-3 text-[#838383] text-[15px] sm:text-[16px]">
              Tap any design to open its single-card page or explore the live interactive demo
              before you choose — every template is now{' '}
              <span className="line-through">₹499–₹2,000</span>{' '}
              <span className="font-semibold text-[#15803D]">FREE (₹0)</span>.
            </p>
          </div>

          {/* Dynamic Category Pills (Matching TemplatesBrowser) */}
          <div className="mt-8 sm:mt-11 flex items-center justify-start sm:justify-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap pb-1">
            {INVIFEST_CATEGORIES.map((cat) => {
              const isSelected = activeCat === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setActiveCat(cat.id);
                    setShowAllCards(false);
                  }}
                  style={
                    isSelected
                      ? {
                          backgroundColor: cat.acc,
                          borderColor: cat.acc,
                          boxShadow: `0 12px 26px -10px rgba(${cat.rgb}, 0.55)`,
                        }
                      : undefined
                  }
                  className={`shrink-0 px-4 py-2 rounded-full text-[13.5px] font-medium transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? 'text-white'
                      : 'bg-white/85 text-[#565656] border border-[#e3e3e3] hover:border-[#bdbdbd]'
                  }`}
                >
                  {cat.shortLabel}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => onOpenCustomizer(themes[0])}
              className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[13.5px] font-medium transition-all border border-dashed border-[#b89b5e] bg-[#fdfaf2] text-[#6b5320] hover:bg-[#f9f1de] hover:border-[#9a7c3c] cursor-pointer"
            >
              <span aria-hidden="true" className="text-[#b89b5e]">
                ✦
              </span>
              <span>Something Else</span>
            </button>
          </div>

          {/* Live Template Count */}
          <div className="mt-6 flex items-center justify-center max-w-[1140px] mx-auto">
            <div className="flex items-center gap-2 text-[13px] text-[#6b6b6b]">
              <span
                className="inline-block w-2 h-2 rounded-full transition-colors duration-500"
                style={{
                  backgroundColor: 'var(--acc)',
                  boxShadow: '0 0 0 4px rgba(var(--acc-rgb), 0.16)',
                }}
              />
              <span>
                Showing {visibleThemes.length} of {filteredThemes.length} live{' '}
                {filteredThemes.length === 1 ? 'demo' : 'demos'}{' '}
                {activeCat === 'All' ? 'across every occasion' : `in ${activeCat}`} ·{' '}
                <strong className="text-[#15803D]">All 100% Free</strong>
              </span>
            </div>
          </div>

          {/* Authentic Invifest .tpl-card Grid */}
          <div className="mt-9 grid grid-cols-3 max-[960px]:grid-cols-2 max-[620px]:grid-cols-1 gap-[26px]">
            {visibleThemes.map((theme) => {
                const custom = getCustomization(theme);
                const coverSrc = theme.image;
                const cleanGroom = custom.data.primaryName?.trim() || groomName || 'Aarav';
                const cleanBride = custom.data.partnerName?.trim() || brideName || 'Meera';
                const catLabel =
                  theme.tradition === 'muslim'
                    ? 'Muslim Weddings'
                    : theme.tradition === 'sikh'
                    ? 'Sikh Weddings'
                    : theme.tradition === 'south-indian'
                    ? 'South Indian Weddings'
                    : theme.celebrationType === 'birthday'
                    ? 'Birthday & Baby'
                    : 'Hindu Weddings';

                return (
                  <div key={theme.id} className="group block">
                    <div className="tpl-card">
                      {/* .tpl-stage: Hand-Held Phone Stage (hand me phone pakde) */}
                      <div
                        onClick={() => onSelectThemePage(theme)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelectThemePage(theme);
                          }
                        }}
                        className="tpl-stage cursor-pointer"
                      >
                        {/* Ambient Botanical / Silk Halo */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-40"
                          style={{
                            background: `radial-gradient(circle at 50% 38%, ${theme.accentHex}33, transparent 70%)`,
                          }}
                        />

                        {/* Center Smartphone Chassis */}
                        <div className="absolute left-1/2 top-[13%] z-10 w-[53%] aspect-[9/19] -translate-x-1/2 rounded-[26px] bg-[#141416] p-[5px] shadow-[0_24px_48px_-14px_rgba(20,14,10,0.58)] ring-1 ring-black/15 transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:scale-[1.02]">
                          <div className="relative h-full w-full overflow-hidden rounded-[21px] bg-[#1a1210]">
                            <img
                              src={coverSrc}
                              alt={`${theme.name} — ${catLabel} invitation website template`}
                              loading="lazy"
                              decoding="async"
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            />
                            {/* Dynamic Island */}
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 h-2 w-11 rounded-full bg-black/85 z-20"
                            />
                            {/* Bottom Couple Overlay Inside Phone */}
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-2.5 pt-8 text-center text-white z-20">
                              <p className="font-display text-[14px] font-semibold leading-tight truncate">
                                {theme.celebrationType === 'birthday'
                                  ? cleanGroom
                                  : `${cleanGroom} & ${cleanBride}`}
                              </p>
                              <p className="mt-0.5 text-[8.5px] uppercase tracking-[0.14em] text-[#fde68a] truncate">
                                {theme.gestureLabel}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Top-Left Wax Seal Video Badge when template has coverVideoUrl */}
                        {theme.coverVideoUrl && (
                          <span className="pointer-events-none absolute top-2.5 left-2 z-30 inline-flex items-center gap-1 rounded-full border border-[#D8C8AA] bg-[#9E2A2B]/95 px-2.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#FAF6EE] shadow-[0_4px_12px_rgba(35,27,21,0.16)]">
                            <span className="text-[#F2D899]">✦</span>
                            <span>{theme.id === 'sheesh-mahal' ? 'Diya-Lit Video' : 'Seal-Only Video'}</span>
                          </span>
                        )}

                        {/* Top-Right Quick Live Demo Floating Pill */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onLaunchPreview(theme);
                          }}
                          className="absolute top-2.5 right-2 z-30 inline-flex items-center gap-1 rounded-full border border-[#D8C8AA] bg-[#FAF6EE]/95 px-2.5 py-1 text-[10.5px] font-medium text-[#231B15] shadow-[0_4px_12px_rgba(35,27,21,0.12)] transition-colors hover:bg-[#F2EAD9] cursor-pointer whitespace-nowrap"
                        >
                          <Play className="h-2.5 w-2.5 fill-current text-[#9E2A2B]" />
                          <span>Live Demo</span>
                        </button>
                      </div>

                      {/* Card Footer (Matching Invifest .tpl-card bottom metadata) */}
                      <div className="px-1.5 pt-[18px]">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="text-[20px] font-semibold text-[#141619] leading-tight truncate">
                              {theme.name}{' '}
                              <span className="font-hindi text-[14px] font-normal text-[#838383]">
                                {theme.nameHi}
                              </span>
                            </h3>
                          </div>
                          <span className="tpl-pricepill">
                            <s className="opacity-55 font-normal mr-1.5 text-[12px]">
                              {theme.originalPrice}
                            </s>
                            <span className="text-[#4ade80] font-bold">FREE</span>
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <span className="tpl-chip">{catLabel}</span>
                          <div className="mt-[14px] inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => onOpenShareSuite(theme)}
                              aria-label={`Publish & share ${theme.name}`}
                              title="Publish & Share URL / QR"
                              className="inline-flex items-center justify-center rounded-full border border-[#dcdcdc] bg-white p-1.5 text-[#1f7a4c] hover:text-[#14532d] hover:border-[#1f7a4c] transition-colors cursor-pointer"
                            >
                              <Share2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenCustomizer(theme)}
                              aria-label={`Customize ${theme.name}`}
                              className="inline-flex items-center justify-center rounded-full border border-[#dcdcdc] bg-white p-1.5 text-[#565656] hover:text-[#141619] hover:border-[#141619] transition-colors cursor-pointer"
                            >
                              <SlidersHorizontal className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectThemePage(theme)}
                              className="inline-flex items-center gap-1 text-[13px] font-medium text-[#565656] group-hover:text-[#141619] transition-colors cursor-pointer"
                            >
                              <span>View template</span>
                              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
            })}
          </div>

          {/* Standard Website "See More Designs" Bar when more than 12 cards exist */}
          {hasMoreCards && (
            <div className="mt-12 sm:mt-14 flex flex-col items-center gap-3.5 text-center">
              <div className="w-full max-w-[320px] space-y-2">
                <p className="text-[12.5px] font-medium text-[#6b6b6b] tabular-nums">
                  Showing <span className="text-[#141619] font-semibold">{visibleThemes.length}</span> of{' '}
                  <span className="text-[#141619] font-semibold">{filteredThemes.length}</span> handcrafted
                  designs
                </p>
                <div className="h-1 w-full rounded-full bg-[#e6e1d8] overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round((visibleThemes.length / filteredThemes.length) * 100)}%`,
                      backgroundColor: 'var(--acc)',
                    }}
                  />
                </div>
              </div>

              {!showAllCards ? (
                <button
                  type="button"
                  onClick={() => setShowAllCards(true)}
                  className="group inline-flex items-center gap-2.5 rounded-full bg-[#111315] text-white px-7 py-3.5 text-[14.5px] font-medium shadow-[0_18px_36px_-15px_rgba(17,19,21,0.5)] hover:bg-[#23272b] hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <span>
                    See more designs (+{filteredThemes.length - visibleThemes.length})
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setShowAllCards(false);
                    document.getElementById('templates')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d6d0c6] bg-white px-6 py-3 text-[14px] font-medium text-[#141619] hover:border-[#141619] transition-all cursor-pointer"
                >
                  <span>Show fewer (12)</span>
                  <ChevronDown className="h-4 w-4 rotate-180" />
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
