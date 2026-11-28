import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Layers, LayoutGrid, PenLine, Check } from 'lucide-react';
import { CeremonyId, CeremonyItem, Language, UI_COPY } from '../data/weddingData';
import { CeremonyCard } from './CeremonyCard';

interface CeremonyDeckSectionProps {
  ceremonies: CeremonyItem[];
  language: Language;
  onRsvpCeremony: (ceremonyId: CeremonyId) => void;
  groomName: string;
  brideName: string;
  onUpdateCoupleNames: (groom: string, bride: string) => void;
}

export const CeremonyDeckSection: React.FC<CeremonyDeckSectionProps> = ({
  ceremonies,
  language,
  onRsvpCeremony,
  groomName,
  brideName,
  onUpdateCoupleNames,
}) => {
  const [viewMode, setViewMode] = useState<'deck' | 'grid'>('deck');
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedMap, setFlippedMap] = useState<Record<string, boolean>>({});
  const [showCustomize, setShowCustomize] = useState(false);
  const [draftGroom, setDraftGroom] = useState(groomName);
  const [draftBride, setDraftBride] = useState(brideName);

  // Keep activeIndex valid when family invite profile filters ceremonies
  useEffect(() => {
    if (activeIndex >= ceremonies.length) {
      setActiveIndex(0);
    }
  }, [ceremonies.length, activeIndex]);

  const toggleFlip = (id: string) => {
    setFlippedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % ceremonies.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + ceremonies.length) % ceremonies.length);
  };

  const handleSaveNames = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanGroom = draftGroom.trim() || 'Aarav';
    const cleanBride = draftBride.trim() || 'Meera';
    onUpdateCoupleNames(cleanGroom, cleanBride);
    setShowCustomize(false);
  };

  const groomInitial = (groomName.trim()[0] || 'A').toUpperCase();
  const brideInitial = (brideName.trim()[0] || 'M').toUpperCase();

  return (
    <section
      id="ceremonies"
      className="relative overflow-hidden bg-[#FAF6EE] py-20 sm:py-28 px-6 border-t border-[#D8C8AA]/60"
    >
      <div className="mx-auto max-w-6xl">
        {/* Editorial Section Header + View Mode Controls */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between border-b border-[#D8C8AA] pb-8">
          <div className="max-w-2xl">
            <p className="text-xs tracking-[0.22em] uppercase text-[#9E2A2B] font-medium">
              {UI_COPY.cardsSection.eyebrow[language]}
            </p>
            <h2 className="mt-2 font-display text-4xl sm:text-5xl font-semibold text-[#231B15] tracking-tight text-balance">
              {UI_COPY.cardsSection.heading[language]}
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#5C4B3D] leading-relaxed">
              {UI_COPY.cardsSection.description[language]}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Customize Couple Names Demo Button */}
            <button
              type="button"
              onClick={() => setShowCustomize((s) => !s)}
              className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                showCustomize
                  ? 'border-[#9E2A2B] bg-[#9E2A2B]/10 text-[#9E2A2B]'
                  : 'border-[#D8C8AA] bg-[#F2EAD9]/60 text-[#4A3B2F] hover:bg-[#F2EAD9]'
              }`}
            >
              <PenLine className="h-3.5 w-3.5" />
              <span>
                {language === 'en' ? 'Personalize Names' : 'नाम बदलें'}
              </span>
            </button>

            {/* Interactive Deck vs Grid Segmented Switcher */}
            <div className="inline-flex items-center gap-1 rounded-lg border border-[#D8C8AA] bg-[#F2EAD9] p-1">
              <button
                type="button"
                onClick={() => setViewMode('deck')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  viewMode === 'deck'
                    ? 'bg-[#231B15] text-[#FAF6EE] shadow-sm'
                    : 'text-[#5C4B3D] hover:text-[#231B15]'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{UI_COPY.cardsSection.deckMode[language]}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  viewMode === 'grid'
                    ? 'bg-[#231B15] text-[#FAF6EE] shadow-sm'
                    : 'text-[#5C4B3D] hover:text-[#231B15]'
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                <span>{UI_COPY.cardsSection.gridMode[language]}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Optional Inline Couple Name Customizer */}
        {showCustomize && (
          <form
            onSubmit={handleSaveNames}
            className="mt-6 flex flex-col sm:flex-row sm:items-end gap-4 rounded-xl border border-[#D8C8AA] bg-[#F2EAD9]/75 p-5"
          >
            <div className="flex-1">
              <label
                htmlFor="demo-groom"
                className="block text-xs font-medium tracking-wider uppercase text-[#5C4B3D]"
              >
                {language === 'en' ? 'Groom First Name' : 'वर का नाम'}
              </label>
              <input
                id="demo-groom"
                type="text"
                value={draftGroom}
                onChange={(e) => setDraftGroom(e.target.value)}
                maxLength={24}
                className="mt-1.5 w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3.5 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="demo-bride"
                className="block text-xs font-medium tracking-wider uppercase text-[#5C4B3D]"
              >
                {language === 'en' ? 'Bride First Name' : 'वधू का नाम'}
              </label>
              <input
                id="demo-bride"
                type="text"
                value={draftBride}
                onChange={(e) => setDraftBride(e.target.value)}
                maxLength={24}
                className="mt-1.5 w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3.5 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9E2A2B] px-5 py-2.5 text-xs font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0"
            >
              <Check className="h-3.5 w-3.5" />
              <span>{language === 'en' ? 'Apply to Invite' : 'लागू करें'}</span>
            </button>
          </form>
        )}

        {/* ==================== MODE 1: INTERACTIVE FANNED STACKED DECK ==================== */}
        {viewMode === 'deck' ? (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Ceremony Index Rail & Controls */}
            <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
              <div className="space-y-2">
                {ceremonies.map((item, idx) => {
                  const isCurrent = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      className={`w-full text-left rounded-lg px-4 py-3.5 transition-all cursor-pointer border ${
                        isCurrent
                          ? 'bg-[#F2EAD9] border-[#C88A2B]/65 shadow-sm'
                          : 'bg-transparent border-transparent hover:bg-[#F2EAD9]/45 hover:border-[#D8C8AA]/60'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-display text-xl sm:text-2xl font-semibold text-[#231B15]">
                          <span className="mr-2.5 text-sm font-sans tabular-nums text-[#9E2A2B]">
                            {item.indexLabel}.
                          </span>
                          {item.title[language]}
                        </span>
                        <span className="text-xs tabular-nums text-[#6D5A49] shrink-0">
                          {item.time}
                        </span>
                      </div>
                      <p className="mt-1 pl-7 text-xs text-[#6D5A49]">
                        {item.date[language]} · {item.venue[language]}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Deck Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-[#D8C8AA]">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label="Previous ceremony card"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#C8B493] bg-[#F2EAD9] text-[#231B15] transition-colors hover:bg-[#E7DAC0] cursor-pointer"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label="Next ceremony card"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[#C8B493] bg-[#F2EAD9] text-[#231B15] transition-colors hover:bg-[#E7DAC0] cursor-pointer"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <span className="text-xs tabular-nums tracking-[0.16em] uppercase text-[#6D5A49]">
                  {language === 'en' ? 'Card' : 'पत्र'} {activeIndex + 1} / {ceremonies.length}
                </span>
              </div>
            </div>

            {/* Right Column: Fanned 3D Interactive Card Stack */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center order-1 lg:order-2">
              <div className="relative w-full max-w-[360px] sm:max-w-[390px] h-[520px] sm:h-[550px]">
                {ceremonies.map((ceremony, idx) => {
                  const total = ceremonies.length;
                  const relativeOffset = (idx - activeIndex + total) % total;
                  const isFront = relativeOffset === 0;

                  // Fan cards cleanly to the right behind the front card
                  const translateX = isFront ? 0 : Math.min(relativeOffset, 3) * 28;
                  const translateY = isFront ? 0 : Math.min(relativeOffset, 3) * 10;
                  const rotateDeg = isFront ? 0 : Math.min(relativeOffset, 3) * 3.8;
                  const scale = isFront ? 1 : Math.max(0.84, 1 - relativeOffset * 0.055);
                  const zIndex = total - relativeOffset;
                  const opacity = isFront ? 1 : Math.max(0.55, 1 - relativeOffset * 0.14);

                  return (
                    <motion.div
                      key={ceremony.id}
                      style={{ zIndex }}
                      animate={{
                        x: translateX,
                        y: translateY,
                        rotate: rotateDeg,
                        scale,
                        opacity,
                      }}
                      transition={{
                        type: 'spring',
                        stiffness: 240,
                        damping: 26,
                      }}
                      drag={isFront ? 'x' : false}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.28}
                      onDragEnd={(_, info) => {
                        if (!isFront) return;
                        if (info.offset.x < -75 || info.velocity.x < -300) {
                          handleNext();
                        } else if (info.offset.x > 75 || info.velocity.x > 300) {
                          handlePrev();
                        }
                      }}
                      onClick={() => {
                        if (!isFront) setActiveIndex(idx);
                      }}
                      className={`absolute inset-0 ${
                        isFront
                          ? 'cursor-grab active:cursor-grabbing'
                          : 'cursor-pointer'
                      }`}
                    >
                      <CeremonyCard
                        ceremony={ceremony}
                        language={language}
                        isActive={isFront}
                        isFlipped={Boolean(flippedMap[ceremony.id])}
                        onToggleFlip={() => toggleFlip(ceremony.id)}
                        onRsvpCeremony={onRsvpCeremony}
                        groomInitial={groomInitial}
                        brideInitial={brideInitial}
                      />
                    </motion.div>
                  );
                })}
              </div>

              <p className="mt-5 text-xs text-[#6D5A49] text-center">
                {language === 'en'
                  ? 'Swipe the front card, click a peeking card edge, or turn a card over for full rituals.'
                  : 'कार्ड को स्वाइप करें, पीछे के कार्ड पर क्लिक करें, या विवरण देखने के लिए कार्ड पलटें।'}
              </p>
            </div>
          </div>
        ) : (
          /* ==================== MODE 2: ALL CARDS 3D GRID ==================== */
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {ceremonies.map((ceremony) => (
              <div key={ceremony.id} className="h-[530px] w-full">
                <CeremonyCard
                  ceremony={ceremony}
                  language={language}
                  isActive={true}
                  isFlipped={Boolean(flippedMap[ceremony.id])}
                  onToggleFlip={() => toggleFlip(ceremony.id)}
                  onRsvpCeremony={onRsvpCeremony}
                  groomInitial={groomInitial}
                  brideInitial={brideInitial}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
