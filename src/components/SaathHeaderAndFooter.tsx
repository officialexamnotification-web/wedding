import React, { useEffect, useState } from 'react';
import { ArrowUpRight, ChevronDown, Menu, X } from 'lucide-react';
import { STUDIO_THEMES, InviteTheme } from '../data/studioData';

export interface HeaderCategoryItem {
  id: string;
  label: string;
  sub: string;
}

const HEADER_TEMPLATE_CATEGORIES: HeaderCategoryItem[] = [
  { id: 'Hindu Weddings', label: 'Hindu Weddings', sub: 'Pheras, haldi, sangeet & royal havelis' },
  { id: 'Muslim Weddings', label: 'Muslim & Nikah', sub: 'Nikah, walima & charbagh arches' },
  { id: 'Sikh Weddings', label: 'Sikh Weddings', sub: 'Anand Karaj & golden sarovar' },
  { id: 'South Indian Weddings', label: 'South Indian', sub: 'Kanjeevaram silk & temple kovil' },
  { id: 'Engagement', label: 'Engagement', sub: 'Ring ceremony & modern botanicals' },
  { id: 'Birthday', label: 'Birthdays & Janmotsav', sub: 'Milestone soirees & baby celebrations' },
];

const NimantranCrest: React.FC<{ className?: string }> = ({ className = 'h-7 w-7' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    className={className}
  >
    <rect x="1.5" y="1.5" width="29" height="29" rx="7" fill="#8F1D21" stroke="#C89B4F" strokeWidth="1.2" />
    <text x="16" y="16.5" textAnchor="middle" dominantBaseline="central" fill="#FFF6E8" fontFamily="Tiro Devanagari Hindi, Nirmala UI, serif" fontSize="18" fontWeight="700">नि</text>
  </svg>
);

interface SaathHeaderProps {
  activeRoute: 'jharokha-page' | 'studio-home' | 'share-suite';
  onNavigate: (route: 'jharokha-page' | 'studio-home' | 'share-suite', sectionId?: string) => void;
  onSelectCategory?: (categoryId: string) => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
  studioLinkHref?: string;
  studioLinkLabel?: string;
}

export const SaathHeader: React.FC<SaathHeaderProps> = ({
  activeRoute,
  onNavigate,
  onSelectCategory,
  primaryActionLabel = 'Publish & Share',
  onPrimaryAction,
  studioLinkHref = '/card-studio/',
  studioLinkLabel = 'Card Studio',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (route: 'jharokha-page' | 'studio-home' | 'share-suite', sectionId?: string) => {
    setMobileMenuOpen(false);
    setTemplatesOpen(false);
    onNavigate(route, sectionId);
  };

  const handlePickCategory = (categoryId: string) => {
    setMobileMenuOpen(false);
    setTemplatesOpen(false);
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    } else {
      onNavigate('studio-home', 'templates');
    }
  };

  const navLinkBase =
    'relative inline-flex items-center gap-1 py-2 text-[14px] font-medium tracking-[0.01em] transition-colors whitespace-nowrap shrink-0 cursor-pointer after:content-[""] after:absolute after:inset-x-0 after:bottom-0.5 after:h-[1.5px] after:rounded-full after:transition-transform after:duration-200 after:origin-center';

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b transition-all duration-200 ${
        scrolled
          ? 'bg-[#FCF9F4]/95 backdrop-blur-md border-[#E4D5BE] shadow-[0_10px_30px_-20px_rgba(36,20,22,0.22)]'
          : 'bg-[#FCF9F4]/90 backdrop-blur-sm border-[#EAE0D0]'
      }`}
    >
      {/* Subtle heritage antique-gold top hairline */}
      <div
        aria-hidden="true"
        className="h-[2px] w-full bg-gradient-to-r from-[#8F1D21]/85 via-[#C89B4F] to-[#8F1D21]/85"
      />

      {/* Strict 3-Zone Top Bar Contract */}
      <div className="mx-auto flex h-[66px] sm:h-[70px] max-w-[1280px] items-center justify-between gap-8 px-5 sm:px-8">
        {/* Zone 1: Brand Wordmark (single-line, zero clutter) */}
        <button
          type="button"
          onClick={() => handleNav('studio-home')}
          className="group inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8F1D21]/40 rounded-lg py-1"
        >
          <NimantranCrest className="h-7 w-7 shrink-0 transition-transform duration-200 group-hover:scale-105" />
          <span className="inline-flex items-center gap-2">
            <span className="font-display text-[19px] sm:text-[21px] font-semibold tracking-[0.13em] text-[#231416] leading-none">
              NIMANTRAN
            </span>
            <span aria-hidden="true" className="h-3.5 w-px bg-[#D7C3A3]" />
            <span className="font-hindi text-[14.5px] sm:text-[15.5px] font-normal text-[#8F1D21] leading-none">
              निमंत्रण
            </span>
          </span>
        </button>

        {/* Zone 2: 5 Clean Single-Line Navigation Links */}
        <nav
          aria-label="Primary"
          onMouseLeave={() => setTemplatesOpen(false)}
          className="hidden xl:flex items-center gap-4"
        >
          {/* Templates + Editorial Category Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setTemplatesOpen(true)}
          >
            <button
              type="button"
              onClick={() => handleNav('studio-home', 'templates')}
              aria-expanded={templatesOpen}
              className={`${navLinkBase} ${
                activeRoute === 'studio-home'
                  ? 'text-[#231416] after:bg-[#8F1D21] after:scale-x-100'
                  : 'text-[#5C4649] hover:text-[#231416] after:bg-[#C89B4F] after:scale-x-0 hover:after:scale-x-100'
              }`}
            >
              <span>Templates</span>
              <ChevronDown
                className={`h-3.5 w-3.5 text-[#8A7068] transition-transform duration-200 ${
                  templatesOpen ? 'rotate-180 text-[#8F1D21]' : ''
                }`}
              />
            </button>

            {templatesOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50 w-[520px]">
                <div className="rounded-2xl bg-[#FFFDF9] border border-[#E6D9C4] shadow-[0_24px_56px_-18px_rgba(35,20,22,0.2)] p-3">
                  <div className="grid grid-cols-2 gap-1">
                    {HEADER_TEMPLATE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handlePickCategory(cat.id)}
                        className="group rounded-xl px-3.5 py-2.5 text-left hover:bg-[#F7EFE3] transition-colors cursor-pointer"
                      >
                        <div className="text-[13.5px] font-semibold text-[#231416] group-hover:text-[#8F1D21] transition-colors">
                          {cat.label}
                        </div>
                        <div className="mt-0.5 text-[12px] text-[#7A6660] leading-snug">
                          {cat.sub}
                        </div>
                      </button>
                    ))}
                  </div>
                  <div className="mt-2.5 pt-2.5 border-t border-[#EFE5D6] flex items-center justify-between px-3.5 py-1">
                    <span className="text-[12px] text-[#7A6660] tabular-nums">
                      {STUDIO_THEMES.length} interactive suites · Free forever
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePickCategory('All')}
                      className="text-[12.5px] font-semibold text-[#8F1D21] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                    >
                      View all templates →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleNav('jharokha-page')}
            className={`${navLinkBase} ${
              activeRoute === 'jharokha-page'
                ? 'text-[#8F1D21] font-semibold after:bg-[#8F1D21] after:scale-x-100'
                : 'text-[#5C4649] hover:text-[#231416] after:bg-[#C89B4F] after:scale-x-0 hover:after:scale-x-100'
            }`}
          >
            Live Showcase
          </button>

          <button
            type="button"
            onClick={() => handleNav('studio-home', 'what-we-make')}
            className={`${navLinkBase} text-[#5C4649] hover:text-[#231416] after:bg-[#C89B4F] after:scale-x-0 hover:after:scale-x-100`}
          >
            Parivar Links
          </button>

          <button
            type="button"
            onClick={() => handleNav('studio-home', 'testimonials')}
            className={`${navLinkBase} text-[#5C4649] hover:text-[#231416] after:bg-[#C89B4F] after:scale-x-0 hover:after:scale-x-100`}
          >
            Reviews
          </button>

          <button
            type="button"
            onClick={() => handleNav('studio-home', 'faq')}
            className={`${navLinkBase} text-[#5C4649] hover:text-[#231416] after:bg-[#C89B4F] after:scale-x-0 hover:after:scale-x-100`}
          >
            FAQ
          </button>

          <a
            href={studioLinkHref}
            className={`${navLinkBase} text-[#5C4649] hover:text-[#231416] after:bg-[#C89B4F] after:scale-x-0 hover:after:scale-x-100`}
          >
            {studioLinkLabel}
          </a>

          <a
            href="/card-studio/jyotish-studio/"
            className={`${navLinkBase} text-[#5C4649] hover:text-[#231416] after:bg-[#C89B4F] after:scale-x-0 hover:after:scale-x-100`}
          >
            Vedic Astrology
          </a>
        </nav>

        {/* Zone 3: Single Primary Action + Mobile Menu Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onPrimaryAction ? onPrimaryAction() : handleNav('share-suite')}
            className={`hidden sm:inline-flex items-center justify-center gap-1.5 rounded-full bg-[#8F1D21] px-5 py-2.5 text-[13.5px] font-medium text-[#FAF6EE] shadow-[0_10px_22px_-12px_rgba(143,29,33,0.75)] hover:bg-[#731418] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C89B4F] ${
              activeRoute === 'share-suite'
                ? 'ring-2 ring-[#C89B4F]/80 ring-offset-2 ring-offset-[#FCF9F4]'
                : ''
            }`}
          >
            <span>{primaryActionLabel}</span>
            <ArrowUpRight className="h-3.5 w-3.5 opacity-90" />
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((v) => !v)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="grid size-10 place-items-center rounded-full border border-[#E2D3BC] bg-white/85 text-[#231416] hover:border-[#8F1D21]/45 transition-colors xl:hidden cursor-pointer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-[#EAE0D0] bg-[#FCF9F4]/98 backdrop-blur-lg shadow-[0_24px_48px_-16px_rgba(35,20,22,0.2)] xl:hidden">
          <div className="mx-auto max-w-[1280px] px-5 py-4 space-y-4">
            <div className="flex flex-col gap-1 text-[15px] font-medium text-[#231416]">
              <button
                type="button"
                onClick={() => handleNav('studio-home', 'templates')}
                className="flex min-h-[44px] items-center justify-between rounded-xl px-3.5 py-2.5 text-left hover:bg-[#F3E9DB] transition-colors cursor-pointer"
              >
                <span>All Templates</span>
                <span className="text-xs text-[#7A6660] tabular-nums">{STUDIO_THEMES.length} suites</span>
              </button>
              <button
                type="button"
                onClick={() => handleNav('jharokha-page')}
                className={`flex min-h-[44px] items-center rounded-xl px-3.5 py-2.5 text-left hover:bg-[#F3E9DB] transition-colors cursor-pointer ${
                  activeRoute === 'jharokha-page' ? 'bg-[#F3E9DB]/80 text-[#8F1D21] font-semibold' : ''
                }`}
              >
                Live Showcase
              </button>
              <button
                type="button"
                onClick={() => handleNav('studio-home', 'what-we-make')}
                className="flex min-h-[44px] items-center rounded-xl px-3.5 py-2.5 text-left hover:bg-[#F3E9DB] transition-colors cursor-pointer"
              >
                Parivar Links
              </button>
              <button
                type="button"
                onClick={() => handleNav('studio-home', 'testimonials')}
                className="flex min-h-[44px] items-center rounded-xl px-3.5 py-2.5 text-left hover:bg-[#F3E9DB] transition-colors cursor-pointer"
              >
                Reviews
              </button>
              <button
                type="button"
                onClick={() => handleNav('studio-home', 'faq')}
                className="flex min-h-[44px] items-center rounded-xl px-3.5 py-2.5 text-left hover:bg-[#F3E9DB] transition-colors cursor-pointer"
              >
                FAQ
              </button>
              <a
                href={studioLinkHref}
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3.5 py-2.5 hover:bg-[#F3E9DB] transition-colors"
              >
                {studioLinkLabel}
              </a>
              <a
                href="/card-studio/jyotish-studio/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[44px] items-center rounded-xl px-3.5 py-2.5 hover:bg-[#F3E9DB] transition-colors"
              >
                Vedic Astrology
              </a>
            </div>

            <div className="border-t border-[#EAE0D0] pt-3">
              <p className="px-3.5 pb-2 text-[11.5px] font-medium tracking-[0.06em] uppercase text-[#8A7068]">
                Browse by Occasion
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {HEADER_TEMPLATE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handlePickCategory(cat.id)}
                    className="min-h-[40px] rounded-xl px-3 py-2 text-left text-[13px] font-medium text-[#4A3538] hover:bg-[#F3E9DB] hover:text-[#8F1D21] transition-colors cursor-pointer"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-[#EAE0D0] pt-3">
              <button
                type="button"
                onClick={() => onPrimaryAction ? onPrimaryAction() : handleNav('share-suite')}
                className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-[#8F1D21] px-5 py-2.5 text-[14px] font-medium text-[#FAF6EE] hover:bg-[#731418] transition-colors cursor-pointer"
              >
                <span>{primaryActionLabel}{primaryActionLabel === 'Publish & Share' ? ' Free' : ''}</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

interface SaathFooterProps {
  onSelectTheme: (theme: InviteTheme) => void;
  onNavigateStudioHome: (sectionId?: string) => void;
  variant?: 'main' | 'card-studio';
  onCreateBlank?: () => void;
  onOpenAstrology?: () => void;
  onOpenVideoSuite?: () => void;
}

export const SaathFooter: React.FC<SaathFooterProps> = ({
  onSelectTheme,
  onNavigateStudioHome,
  variant = 'main',
  onCreateBlank,
  onOpenAstrology,
  onOpenVideoSuite,
}) => {
  const isCardStudio = variant === 'card-studio';
  const handlePickDesignId = (themeId: string) => {
    const matched = STUDIO_THEMES.find((t) => t.id === themeId) || STUDIO_THEMES[0];
    onSelectTheme(matched);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJumpSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      onNavigateStudioHome(sectionId);
    }
  };

  return (
    <footer className="mx-auto max-w-[1180px] text-[#5B3E42]">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        {/* Brand Column */}
        <div className="max-w-[300px]">
          <button
            type="button"
            onClick={() => onNavigateStudioHome()}
            className="inline-flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <NimantranCrest className="h-7 w-7 shrink-0 transition-transform duration-200 group-hover:scale-105" />
            <span className="inline-flex items-center gap-2">
              <span className="font-display text-xl font-semibold tracking-[0.12em] text-[#231416]">
                NIMANTRAN
              </span>
              <span aria-hidden="true" className="h-3.5 w-px bg-[#D7C3A3]" />
              <span className="font-hindi text-sm font-normal text-[#8F1D21]">
                निमंत्रण
              </span>
            </span>
          </button>
          <p className="mt-3.5 text-[14px] leading-relaxed text-[#6b5a50]">
            {isCardStudio
              ? 'Design, personalize, animate, and export invitation cards for weddings and every family celebration.'
              : 'Sacred digital invitations crafted for Indian weddings, pujas, and milestone celebrations — interactive, bilingual, and free to share.'}
          </p>
        </div>

        {/* Column 2: Collections */}
        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#2A1316]">
            Collections
          </h3>
          <ul className="mt-3.5 space-y-2.5 text-[14px]">
            {(isCardStudio
              ? [
                  { label: 'Wedding Invitations', category: 'wedding' },
                  { label: 'Sangeet & Haldi', category: 'sangeet-mehendi' },
                  { label: 'Griha Pravesh', category: 'housewarming' },
                  { label: 'Birthday Invitations', category: 'birthday' },
                  { label: 'Baby Shower & Naamkaran', category: 'baby-shower' },
                  { label: 'Anniversary Invitations', category: 'anniversary' },
                ]
              : [
              { label: 'Hindu Weddings', pick: 'paithani' },
              { label: 'Muslim & Nikah', pick: 'mehr' },
              { label: 'Sikh Anand Karaj', pick: 'kalgi' },
              { label: 'South Indian Weddings', pick: 'pattu-zari' },
              { label: 'Birthday Celebrations', pick: 'confetti-garden' },
            ]).map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => ('category' in item
                    ? onNavigateStudioHome(`category:${item.category}`)
                    : handlePickDesignId(item.pick))}
                  className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Features */}
        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#2A1316]">
            Features
          </h3>
          <ul className="mt-3.5 space-y-2.5 text-[14px]">
            {(isCardStudio
              ? [
                  { label: 'All Invitation Templates', section: 'templates' },
                  { label: 'Customize a Card', section: 'templates' },
                  { label: 'Custom Canvas', action: onCreateBlank },
                  { label: 'Vedic Astrology Studio', action: onOpenAstrology },
                  { label: 'Print & Export', section: 'features' },
                ]
              : [
              { label: 'All 31+ Templates', section: 'templates' },
              { label: 'Parivar Family Links', section: 'what-we-make' },
              { label: 'Why Nimantran', section: 'features' },
              { label: 'How It Works', section: 'how-it-works' },
              { label: 'Compare vs Cards', section: 'comparison' },
            ]).map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => ('action' in item && item.action
                    ? item.action()
                    : handleJumpSection('section' in item ? item.section : 'templates'))}
                  className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Resources */}
        <div>
          <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#2A1316]">
            Explore
          </h3>
          <ul className="mt-3.5 space-y-2.5 text-[14px]">
            {isCardStudio ? (
              <>
                <li><button type="button" onClick={() => handleJumpSection('how-it-works')} className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer">How Card Studio Works</button></li>
                <li><button type="button" onClick={() => onOpenVideoSuite?.()} className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer">Video Invitation Studio</button></li>
                <li><button type="button" onClick={() => handleJumpSection('testimonials')} className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer">Family Reviews</button></li>
                <li><button type="button" onClick={() => handleJumpSection('faq')} className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer">Studio FAQs</button></li>
              </>
            ) : <>
            <li>
              <button
                type="button"
                onClick={() => handlePickDesignId('jharokha')}
                className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer"
              >
                Rajwada Aagman Demo
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handlePickDesignId('paithani')}
                className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer"
              >
                Antarpat Mangalam Demo
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleJumpSection('testimonials')}
                className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer"
              >
                Family Reviews
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleJumpSection('blog')}
                className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer"
              >
                Nimantran Journal
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleJumpSection('faq')}
                className="text-left text-[#6b5a50] hover:text-[#111315] transition-colors cursor-pointer"
              >
                FAQ
              </button>
            </li>
            </>}
          </ul>
        </div>
      </div>

      {/* Standard Bottom Bar */}
      <div className="mt-10 flex flex-col gap-3 border-t border-[#e5dacb] pt-6 text-[13px] text-[#7c6c61] sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} NIMANTRAN. All rights reserved.</p>
        <div className="flex flex-wrap items-center gap-6">
          <button
            type="button"
            onClick={() => handleJumpSection('templates')}
            className="hover:text-[#111315] transition-colors cursor-pointer"
          >
            Templates
          </button>
          <button
            type="button"
            onClick={() => handleJumpSection(isCardStudio ? 'how-it-works' : 'faq')}
            className="hover:text-[#111315] transition-colors cursor-pointer"
          >
            {isCardStudio ? 'How It Works' : 'FAQ'}
          </button>
          <button
            type="button"
            onClick={() => isCardStudio ? handleJumpSection('features') : onNavigateStudioHome()}
            className="hover:text-[#111315] transition-colors cursor-pointer"
          >
            {isCardStudio ? 'Studio Features' : 'Privacy'}
          </button>
          <button
            type="button"
            onClick={() => isCardStudio ? handleJumpSection('faq') : onNavigateStudioHome()}
            className="hover:text-[#111315] transition-colors cursor-pointer"
          >
            {isCardStudio ? 'FAQs' : 'Terms'}
          </button>
        </div>
      </div>
    </footer>
  );
};
