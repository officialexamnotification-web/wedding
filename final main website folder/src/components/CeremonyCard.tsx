import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';
import { RotateCw, MapPin, Clock, Sparkles, ArrowRight } from 'lucide-react';
import { CeremonyItem, Language, UI_COPY } from '../data/weddingData';
import { ScallopedCardBorder, JharokhaCrest } from './JharokhaMotifs';

interface CeremonyCardProps {
  ceremony: CeremonyItem;
  language: Language;
  isActive?: boolean;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onRsvpCeremony: (ceremonyId: CeremonyItem['id']) => void;
  groomInitial: string;
  brideInitial: string;
}

export const CeremonyCard: React.FC<CeremonyCardProps> = ({
  ceremony,
  language,
  isActive = true,
  isFlipped,
  onToggleFlip,
  onRsvpCeremony,
  groomInitial,
  brideInitial,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 35, hovering: false });
  const [imgError, setImgError] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive || e.pointerType === 'touch') return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const ry = (px - 0.5) * 12; // subtle ±6 deg tilt
    const rx = (0.5 - py) * 10;
    setTilt({
      rx,
      ry,
      gx: Math.round(px * 100),
      gy: Math.round(py * 100),
      hovering: true,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rx: 0, ry: 0, gx: 50, gy: 35, hovering: false });
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full perspective-1200 select-none"
    >
      {/* 3D Pointer Tilt Wrapper */}
      <motion.div
        animate={{
          rotateX: isActive ? tilt.rx : 0,
          rotateY: isActive ? tilt.ry : 0,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* 3D Flip Wrapper (Front Artwork <-> Back Ceremonial Details) */}
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full h-full preserve-3d"
        >
          {/* ==================== FRONT FACE ==================== */}
          <div
            className="absolute inset-0 backface-hidden overflow-hidden rounded-xl border border-[#C88A2B]/45 bg-[#FAF6EE] paper-grain shadow-[0_24px_60px_-15px_rgba(35,27,21,0.22)] flex flex-col justify-between p-5 sm:p-6"
          >
            <ScallopedCardBorder color={ceremony.accentHex} />

            {/* Moving antique-gold foil specular highlight */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: tilt.hovering ? 0.55 : 0.15,
                background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(230, 184, 106, 0.28), transparent 58%)`,
              }}
            />

            {/* Top unboxed metadata header */}
            <div className="relative z-10 flex items-center justify-between pt-2 px-1 text-xs tracking-[0.16em] uppercase text-[#6D5A49]">
              <span className="tabular-nums font-medium">
                {ceremony.indexLabel} · {ceremony.time}
              </span>
              <JharokhaCrest
                themeId="jharokha"
                groomInitial={groomInitial}
                brideInitial={brideInitial}
                size="sm"
                tone="theme"
              />
            </div>

            {/* Scalloped Jharokha Arch Framed Artwork */}
            <div className="relative z-10 my-3 mx-auto w-full overflow-hidden rounded-t-[130px] rounded-b-lg border border-[#C88A2B]/40 aspect-[4/3] bg-[#EBE2D0]">
              {!imgError ? (
                <img
                  src={ceremony.image}
                  alt={ceremony.imageAlt}
                  referrerPolicy="no-referrer"
                  onError={() => setImgError(true)}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#EFE6D5] to-[#DFCFAF] p-4 text-center">
                  <Sparkles className="h-6 w-6 text-[#9E2A2B]" />
                  <p className="mt-2 font-display text-lg text-[#231B15]">
                    {ceremony.title[language]}
                  </p>
                </div>
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />
              <p className="pointer-events-none absolute bottom-2.5 left-3 right-3 text-[11px] tracking-[0.14em] uppercase text-[#FAF6EE]/95">
                {ceremony.muhurat[language]}
              </p>
            </div>

            {/* Ceremony Title, Date & Venue */}
            <div className="relative z-10 text-center px-2">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#231B15] leading-tight">
                {ceremony.title[language]}
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#6D5A49] line-clamp-1">
                {ceremony.subtitle[language]}
              </p>

              <div className="mt-3 pt-3 border-t border-[#D8C8AA]/70 flex flex-col gap-1 text-xs text-[#4A3B2F]">
                <span className="font-medium">{ceremony.date[language]}</span>
                <span className="text-[#6D5A49] truncate">{ceremony.venue[language]}</span>
              </div>
            </div>

            {/* Flip Trigger Button */}
            <div className="relative z-10 mt-3 flex justify-center pb-1">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFlip();
                }}
                className="inline-flex items-center gap-2 rounded-md border border-[#C88A2B]/55 bg-[#F2EAD9]/90 px-4 py-2 text-xs font-medium text-[#231B15] transition-colors hover:bg-[#E7DAC0] cursor-pointer whitespace-nowrap shrink-0"
              >
                <RotateCw className="h-3.5 w-3.5 text-[#9E2A2B]" />
                <span>{UI_COPY.cardsSection.flipToDetails[language]}</span>
              </button>
            </div>
          </div>

          {/* ==================== BACK FACE ==================== */}
          <div
            className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-xl border border-[#C88A2B]/55 bg-[#F7F1E3] paper-grain shadow-[0_24px_60px_-15px_rgba(35,27,21,0.25)] flex flex-col justify-between p-6"
          >
            <ScallopedCardBorder color={ceremony.accentHex} />

            {/* Moving antique-gold foil highlight on back */}
            <div
              className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              style={{
                opacity: tilt.hovering ? 0.45 : 0.1,
                background: `radial-gradient(circle at ${tilt.gx}% ${tilt.gy}%, rgba(200, 138, 43, 0.22), transparent 60%)`,
              }}
            />

            <div className="relative z-10 pt-2">
              <div className="flex items-center justify-between text-xs tracking-[0.16em] uppercase text-[#6D5A49]">
                <span className="tabular-nums">{ceremony.indexLabel} · Itinerary</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFlip();
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9E2A2B] hover:underline cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>{UI_COPY.cardsSection.flipToFront[language]}</span>
                </button>
              </div>

              <h3 className="mt-3 font-display text-2xl sm:text-3xl font-semibold text-[#231B15]">
                {ceremony.title[language]}
              </h3>
              <p className="mt-1 text-xs font-medium text-[#9E2A2B]">
                {ceremony.date[language]} · {ceremony.muhurat[language]}
              </p>

              {/* Chronological Rituals */}
              <div className="mt-4 border-t border-[#D8C8AA] pt-3 space-y-2.5">
                {ceremony.rituals.map((ritual, idx) => (
                  <div key={idx} className="flex items-baseline gap-3 text-xs sm:text-sm">
                    <span className="w-16 shrink-0 font-medium tabular-nums text-[#9E2A2B]">
                      {ritual.time}
                    </span>
                    <span className="text-[#231B15] leading-snug">
                      {ritual.label[language]}
                    </span>
                  </div>
                ))}
              </div>

              {/* Venue & Dress Code */}
              <div className="mt-4 border-t border-[#D8C8AA] pt-3 space-y-2 text-xs text-[#4A3B2F]">
                <div className="flex items-start gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-[#9E2A2B] mt-0.5" />
                  <span>{ceremony.venue[language]}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-3.5 w-3.5 shrink-0 text-[#C88A2B] mt-0.5" />
                  <span>
                    <strong className="font-semibold text-[#231B15]">
                      {language === 'en' ? 'Attire: ' : 'परिधान: '}
                    </strong>
                    {ceremony.attire[language]}
                  </span>
                </div>
              </div>

              <p className="mt-3 text-xs italic text-[#6D5A49] leading-relaxed">
                “{ceremony.hostNote[language]}”
              </p>
            </div>

            <div className="relative z-10 pb-1 pt-2 flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRsvpCeremony(ceremony.id);
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#9E2A2B] px-4 py-2.5 text-xs font-medium text-[#FAF6EE] transition-colors hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>{UI_COPY.cardsSection.rsvpThis[language]}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
