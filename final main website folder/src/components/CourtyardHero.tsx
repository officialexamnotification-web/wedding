import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowDown, Users } from 'lucide-react';
import {
  COUPLE_DEFAULTS,
  FamilyGuestProfile,
  HERO_COURTYARD_IMAGE,
  Language,
  UI_COPY,
} from '../data/weddingData';
import { DiyaFlame, JharokhaCrest } from './JharokhaMotifs';

interface CourtyardHeroProps {
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  activeFamily: FamilyGuestProfile;
  families: FamilyGuestProfile[];
  onSelectFamily: (id: string) => void;
  groomName: string;
  brideName: string;
  groomNameHi: string;
  brideNameHi: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdown(): TimeRemaining {
  const target = new Date(COUPLE_DEFAULTS.targetIsoDate).getTime();
  if (Number.isNaN(target)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export const CourtyardHero: React.FC<CourtyardHeroProps> = ({
  language,
  onToggleLanguage,
  activeFamily,
  families,
  onSelectFamily,
  groomName,
  brideName,
  groomNameHi,
  brideNameHi,
}) => {
  const [countdown, setCountdown] = useState<TimeRemaining>(getCountdown);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCountdown(getCountdown());
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const groomInitial = (groomName.trim()[0] || 'A').toUpperCase();
  const brideInitial = (brideName.trim()[0] || 'M').toUpperCase();

  return (
    <section id="courtyard" className="relative bg-[#121629] text-[#FAF6EE]">
      {/* Full-bleed Twilight Courtyard Backdrop */}
      <div className="relative min-h-[680px] lg:min-h-[760px] flex flex-col justify-between overflow-hidden">
        <img
          src={HERO_COURTYARD_IMAGE}
          alt="Udaipur sandstone palace courtyard glowing with diyas at dusk"
          referrerPolicy="no-referrer"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        {/* Measured Contrast Scrim */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0E1120]/78 via-[#121629]/52 to-[#121629]/92" />

        {/* Center Hero Typography */}
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pt-28 pb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <p className="text-xs sm:text-sm tracking-[0.22em] text-[#E6B86A] font-hindi">
              {UI_COPY.hero.blessing[language]}
            </p>

            <div className="mt-5">
              <JharokhaCrest
                groomInitial={groomInitial}
                brideInitial={brideInitial}
                size="lg"
                tone="gold"
              />
            </div>

            <p className="mt-5 max-w-xl text-xs sm:text-sm tracking-wide text-[#E6D9C2]/90">
              {COUPLE_DEFAULTS.parentsLine[language]}
            </p>

            <h1 className="mt-5 font-display text-5xl sm:text-7xl lg:text-[5.25rem] font-semibold tracking-tight text-[#FAF6EE] leading-[1.03] text-balance">
              {language === 'en' ? (
                <>
                  {groomName}{' '}
                  <span className="italic font-normal text-[#E6B86A]">&amp;</span>{' '}
                  {brideName}
                </>
              ) : (
                <span className="font-hindi">
                  {groomNameHi}{' '}
                  <span className="font-normal text-[#E6B86A]">एवं</span>{' '}
                  {brideNameHi}
                </span>
              )}
            </h1>

            <p className="mt-4 text-sm sm:text-base text-[#FAF6EE]/90">
              {UI_COPY.hero.inviteLine[language]}
            </p>

            {/* Unboxed Editorial Date & Venue Metadata */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs sm:text-sm tracking-[0.16em] uppercase text-[#E6B86A]">
              <span>{COUPLE_DEFAULTS.weddingDates[language]}</span>
              <span aria-hidden="true">·</span>
              <span>{COUPLE_DEFAULTS.palaceName[language]}</span>
              <span aria-hidden="true">·</span>
              <span>{COUPLE_DEFAULTS.city[language]}</span>
            </div>

            {/* Live Shubh Muhurat Countdown (Tabular Numerals) */}
            <div className="mt-8 grid grid-cols-4 gap-4 sm:gap-8 border-y border-[#E6B86A]/30 py-4 px-6">
              {[
                { val: countdown.days, label: UI_COPY.hero.countdownLabels.days[language] },
                { val: countdown.hours, label: UI_COPY.hero.countdownLabels.hours[language] },
                { val: countdown.minutes, label: UI_COPY.hero.countdownLabels.mins[language] },
                { val: countdown.seconds, label: UI_COPY.hero.countdownLabels.secs[language] },
              ].map((slot) => (
                <div key={slot.label} className="flex flex-col items-center min-w-[54px]">
                  <span className="font-display text-2xl sm:text-4xl font-semibold tabular-nums text-[#FAF6EE]">
                    {String(slot.val).padStart(2, '0')}
                  </span>
                  <span className="mt-0.5 text-[11px] tracking-[0.18em] uppercase text-[#D6C5A9]">
                    {slot.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Primary Hero CTA */}
            <div className="mt-8 flex items-center gap-4">
              <a
                href="#ceremonies"
                className="inline-flex items-center gap-2.5 rounded-lg bg-[#9E2A2B] px-6 py-3 text-sm font-medium text-[#FAF6EE] transition-colors hover:bg-[#B23334] whitespace-nowrap shrink-0"
              >
                <span>{UI_COPY.hero.exploreCards[language]}</span>
                <ArrowDown className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* Diya flanking corners */}
        <div className="pointer-events-none absolute bottom-4 left-6 hidden md:block">
          <DiyaFlame />
        </div>
        <div className="pointer-events-none absolute bottom-4 right-6 hidden md:block">
          <DiyaFlame />
        </div>
      </div>

      {/* Clean Courtyard Utility Toolbar (Language & Custom Family Link Selector) */}
      <div className="border-t border-[#E6B86A]/20 bg-[#191E36] px-6 py-4">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Active Personalized Family Invite Greeting */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="inline-flex items-center gap-1.5 text-[#E6B86A]">
              <Users className="h-4 w-4" />
              <span>
                {language === 'en' ? 'Viewing Invite For:' : 'आमंत्रित परिवार:'}
              </span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {families.map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => onSelectFamily(fam.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    fam.id === activeFamily.id
                      ? 'bg-[#C88A2B] text-[#1A130D]'
                      : 'bg-[#232946] text-[#E6D9C2] hover:bg-[#2C3458]'
                  }`}
                >
                  {fam.familyName[language]}
                </button>
              ))}
            </div>
            <span className="text-xs text-[#D6C5A9]/80">
              — {activeFamily.greetingNote[language]}
            </span>
          </div>

          {/* Bilingual EN / हिन्दी Switcher */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-[#D6C5A9]/80">
              {language === 'en' ? 'Language:' : 'भाषा:'}
            </span>
            <div className="inline-flex items-center gap-1 rounded-md border border-[#E6B86A]/30 bg-[#121629] p-1">
              <button
                type="button"
                onClick={() => onToggleLanguage('en')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  language === 'en'
                    ? 'bg-[#FAF6EE] text-[#121629]'
                    : 'text-[#D6C5A9] hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => onToggleLanguage('hi')}
                className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer whitespace-nowrap shrink-0 font-hindi ${
                  language === 'hi'
                    ? 'bg-[#FAF6EE] text-[#121629]'
                    : 'text-[#D6C5A9] hover:text-white'
                }`}
              >
                हिन्दी
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
