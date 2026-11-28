import React, { useMemo, useState } from 'react';
import { Smartphone, LayoutGrid, Play, SlidersHorizontal, ArrowUpRight } from 'lucide-react';
import { InviteTheme, ThemeCategory } from '../data/studioData';
import { CardCustomization } from '../data/cardCustomization';
import { ThemeShowcaseCard } from './ThemeShowcaseCard';
import { LivingSceneMotionOverlay } from './LivingSceneMotionOverlay';

interface ThemesGridSectionProps {
  themes: InviteTheme[];
  groomName: string;
  brideName: string;
  onLaunchPreview: (theme: InviteTheme) => void;
  onSelectThemePage?: (theme: InviteTheme) => void;
  getCustomization: (theme: InviteTheme) => { data: CardCustomization; isCustomized: boolean };
  onOpenCustomizer: (theme: InviteTheme) => void;
}

export const ThemesGridSection: React.FC<ThemesGridSectionProps> = ({
  themes,
  groomName,
  brideName,
  onLaunchPreview,
  onSelectThemePage,
  getCustomization,
  onOpenCustomizer,
}) => {
  const [filter, setFilter] = useState<ThemeCategory>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'phone-hand'>('cards');
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});

  const filteredThemes = useMemo(() => {
    if (filter === 'all') return themes;
    if (filter === 'hindu') {
      return themes.filter((t) => t.tradition === 'hindu' && t.celebrationType !== 'birthday');
    }
    if (filter === 'muslim') {
      return themes.filter((t) => t.tradition === 'muslim');
    }
    if (filter === 'sikh') {
      return themes.filter((t) => t.tradition === 'sikh');
    }
    if (filter === 'south-indian') {
      return themes.filter((t) => t.tradition === 'south-indian');
    }
    if (filter === 'hindu-girl') {
      return themes.filter(
        (t) => t.birthdayFlavor === 'hindu' && t.birthdayGender === 'girl'
      );
    }
    if (filter === 'hindu-boy') {
      return themes.filter(
        (t) => t.birthdayFlavor === 'hindu' && t.birthdayGender === 'boy'
      );
    }
    return themes.filter((t) => t.category === filter);
  }, [themes, filter]);

  const toggleFlip = (id: string) => {
    setFlippedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="themes"
      className="bg-[#F2EAD9]/55 py-20 sm:py-28 px-6 border-b border-[#D8C8AA]"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header + View Mode Switcher */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[#D8C8AA] pb-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#9E2A2B] font-medium">
              <span>NIMANTRAN Complete Template Collection</span>
              <span aria-hidden="true">·</span>
              <span className="line-through opacity-75 text-[#6D5A49]">₹499 – ₹2,000</span>
              <span aria-hidden="true">→</span>
              <span className="font-bold text-[#15803D]">100% FREE (₹0)</span>
            </div>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-semibold text-[#231B15] text-balance">
              Every Tradition, Every Card — Now Free
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5C4B3D] leading-relaxed">
              From Antarpat Mangalam silk and Rajwada Aagman haveli doors to Noor-e-Charbagh sky lanterns, Amrit Anand, and Janmotsav suites—every design is unlocked for ₹0 with live opening motion.
            </p>
          </div>

          {/* Interactive View Switcher: 3D Cards vs Phone Stage Showcase */}
          <div className="inline-flex items-center gap-1 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] p-1 self-start lg:self-auto">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'cards'
                  ? 'bg-[#231B15] text-[#FAF6EE]'
                  : 'text-[#5C4B3D] hover:text-[#231B15]'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>3D Interactive Cards</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('phone-hand')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                viewMode === 'phone-hand'
                  ? 'bg-[#231B15] text-[#FAF6EE]'
                  : 'text-[#5C4B3D] hover:text-[#231B15]'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Phone Stage Showcase</span>
            </button>
          </div>
        </div>

        {/* Tradition & Occasion Filter Tabs (Matching Invifest /templates/ taxonomy) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex flex-wrap items-center gap-1 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] p-1">
            {[
              { id: 'all', label: `All Designs (${themes.length})` },
              { id: 'hindu', label: 'Hindu Weddings' },
              { id: 'muslim', label: 'Muslim & Nikah' },
              { id: 'sikh', label: 'Sikh Anand Karaj' },
              { id: 'south-indian', label: 'South Indian' },
              { id: 'birthday', label: 'Birthdays & Baby' },
              { id: 'hindu-girl', label: 'Girl Janmotsav' },
              { id: 'hindu-boy', label: 'Boy Janmotsav' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as ThemeCategory)}
                className={`px-3.5 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  filter === tab.id
                    ? 'bg-[#9E2A2B] text-[#FAF6EE]'
                    : 'text-[#5C4B3D] hover:text-[#231B15]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-[#5C4B3D] tabular-nums">
            <span>Showing {filteredThemes.length} designs</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span className="line-through opacity-70">₹2,499–₹10,300</span>
            <span className="ml-1.5 font-semibold text-[#15803D]">FREE (₹0)</span>
          </div>
        </div>

        {/* MODE 1: 3D Tiltable & Flippable Card Grid */}
        {viewMode === 'cards' ? (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredThemes.map((theme) => {
              const custom = getCustomization(theme);
              return (
                <div
                  key={theme.id}
                  style={{ contentVisibility: 'auto', containIntrinsicSize: '360px 530px' }}
                  className="h-[530px] w-full"
                >
                  <ThemeShowcaseCard
                    theme={theme}
                    isActive={true}
                    isFlipped={Boolean(flippedMap[theme.id])}
                    onToggleFlip={() => toggleFlip(theme.id)}
                    onLaunchPreview={onLaunchPreview}
                    onSelectThemePage={onSelectThemePage}
                    groomName={groomName || 'Aarav'}
                    brideName={brideName || 'Meera'}
                    customization={custom.data}
                    isCustomized={custom.isCustomized}
                    onOpenCustomizer={onOpenCustomizer}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          /* MODE 2: Invifest-Style Phone Mockup Showcase Grid */
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7">
            {filteredThemes.map((theme) => {
              const custom = getCustomization(theme);
              const coverSrc = theme.image;
              const cleanGroom = custom.data.primaryName?.trim() || groomName || 'Aarav';
              const cleanBride = custom.data.partnerName?.trim() || brideName || 'Meera';
              return (
                <article
                  key={theme.id}
                  className="group rounded-2xl border border-[#D8C8AA] bg-[#FAF6EE] p-5 transition-all hover:border-[#9E2A2B] flex flex-col justify-between"
                >
                  <div>
                    {/* Top Index + Crossed-Out Price -> FREE */}
                    <div className="flex items-center justify-between text-xs text-[#6D5A49] tabular-nums mb-3">
                      <span>{theme.indexLabel} · {theme.regionLabel.split('·')[0].trim()}</span>
                      <span className="font-semibold">
                        <span className="line-through opacity-70 mr-1.5">{theme.originalPrice}</span>
                        <span className="text-[#15803D] font-bold">FREE</span>
                      </span>
                    </div>

                    {/* Realistic Smartphone Frame with Live Motion Preview */}
                    <div
                      onClick={() => onLaunchPreview(theme)}
                      className="relative mx-auto w-[215px] aspect-[9/18.5] rounded-[34px] bg-[#1D1D20] p-[7px] shadow-[0_18px_38px_-12px_rgba(35,27,21,0.38)] cursor-pointer transition-transform duration-300 group-hover:-translate-y-1"
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-[27px] bg-black">
                        <img
                          src={coverSrc}
                          alt={theme.imageAlt}
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover animate-ken-burns-slow"
                        />
                        <LivingSceneMotionOverlay
                          themeId={theme.id}
                          compact={true}
                          showBottomDiyas={true}
                          intensity="subtle"
                        />
                        {/* Dynamic Island */}
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute top-2 left-1/2 -translate-x-1/2 h-3.5 w-16 rounded-full bg-black z-20"
                        />
                        {/* Bottom Overlay Inside Phone */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3.5 pt-10 text-center text-[#FAF6EE] z-20">
                          <p className="font-display text-lg font-semibold leading-tight">
                            {theme.celebrationType === 'birthday'
                              ? cleanGroom
                              : `${cleanGroom} & ${cleanBride}`}
                          </p>
                          <p className="mt-0.5 text-[10px] tracking-[0.12em] uppercase text-[#FDE68A]">
                            {theme.gestureLabel}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Card Name, Hindi Title & Description */}
                    <div className="mt-4 text-center">
                      <div className="flex items-baseline justify-center gap-2">
                        <h3 className="font-display text-2xl font-semibold text-[#231B15]">
                          {theme.name}
                        </h3>
                        <span className="font-hindi text-sm text-[#9E2A2B]">{theme.nameHi}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#5C4B3D] line-clamp-2 leading-relaxed">
                        {theme.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-[#D8C8AA]/70 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => onLaunchPreview(theme)}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#9E2A2B] px-3 py-2 text-xs font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <Play className="h-3 w-3 fill-current" />
                      <span>Try Live Demo</span>
                    </button>
                    {onSelectThemePage && (
                      <button
                        type="button"
                        onClick={() => onSelectThemePage(theme)}
                        className="inline-flex items-center justify-center gap-1 rounded-lg border border-[#C8B493] bg-[#F2EAD9] px-2.5 py-2 text-xs font-medium text-[#231B15] hover:bg-[#E7DAC0] cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <span>Page</span>
                        <ArrowUpRight className="h-3 w-3" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onOpenCustomizer(theme)}
                      aria-label={`Customize ${theme.name}`}
                      className="inline-flex items-center justify-center rounded-lg border border-[#C8B493] bg-[#FAF6EE] p-2 text-xs font-medium text-[#231B15] hover:bg-[#F2EAD9] cursor-pointer shrink-0"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 text-[#9E2A2B]" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
