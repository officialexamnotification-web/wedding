import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe2, Calendar, MapPin } from 'lucide-react';
import { CEREMONIES, COUPLE_DEFAULTS, Language } from '../data/weddingData';
import { JharokhaCrest, ScallopedCardBorder } from './JharokhaMotifs';

export interface StationeryPiece {
  id: 'save' | 'invite' | 'haldi' | 'sangeet' | 'story';
  label: string;
  dimensions: string;
  aspectClass: string;
  image: string;
}

interface StationeryPieceModalProps {
  piece: StationeryPiece | null;
  onClose: () => void;
  groomName: string;
  brideName: string;
  weddingDateLabel: string;
  cityLabel: string;
  lang: Language;
  onToggleLang: () => void;
  themeId?: string;
  themeName?: string;
}

export const StationeryPieceModal: React.FC<StationeryPieceModalProps> = ({
  piece,
  onClose,
  groomName,
  brideName,
  weddingDateLabel,
  cityLabel,
  lang,
  onToggleLang,
  themeId = 'jharokha',
  themeName = 'NIMANTRAN Suite',
}) => {
  if (!piece) return null;

  const cleanGroom = groomName.trim() || 'Aarav';
  const cleanBride = brideName.trim() || 'Meera';
  const groomHi =
    cleanGroom === COUPLE_DEFAULTS.groomEn ? COUPLE_DEFAULTS.groomHi : cleanGroom;
  const brideHi =
    cleanBride === COUPLE_DEFAULTS.brideEn ? COUPLE_DEFAULTS.brideHi : cleanBride;

  const groomInitial = cleanGroom[0].toUpperCase();
  const brideInitial = cleanBride[0].toUpperCase();

  const haldi = CEREMONIES[0];
  const sangeet = CEREMONIES[2];
  const pheras = CEREMONIES[3];

  const isDarkPiece = piece.id === 'sangeet' || piece.id === 'story';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#180C0E]/85 p-4 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0, y: 12 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative flex w-full max-w-[420px] flex-col overflow-hidden rounded-[24px] border border-[#E6B86A]/45 bg-[#19130E] shadow-2xl"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white">
            <div>
              <p className="text-[11px] tracking-[0.14em] uppercase text-[#E6B86A]">
                {themeName} · {piece.dimensions}
              </p>
              <p className="font-display text-lg font-semibold leading-tight">{piece.label}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onToggleLang}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white hover:bg-white/20 cursor-pointer"
              >
                <Globe2 className="h-3.5 w-3.5" />
                <span>{lang === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close card"
                className="grid size-8 place-items-center rounded-full bg-white/10 text-white hover:bg-[#A3122F] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Card Artwork Stage */}
          <div className="p-4 sm:p-5 flex justify-center bg-[#120D0A]">
            <div
              className={`relative w-full overflow-hidden rounded-[16px] shadow-2xl ${
                piece.id === 'story' ? 'max-w-[300px] aspect-[9/16]' : 'aspect-[4/5]'
              } ${isDarkPiece ? 'bg-[#121629] text-[#FAF6EE]' : 'bg-[#FAF6EE] text-[#2A1316]'} paper-grain`}
            >
              <img
                src={piece.image}
                alt={piece.label}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 h-full w-full object-cover ${
                  isDarkPiece ? 'opacity-45' : 'opacity-20'
                }`}
              />
              {!isDarkPiece && <ScallopedCardBorder color="#A3122F" />}
              {isDarkPiece && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#0E1120]/70 via-[#121629]/60 to-[#0E1120]/90" />
              )}

              <div className="relative z-10 flex h-full flex-col justify-between p-6 text-center">
                <div className="flex flex-col items-center">
                  <span
                    className={`text-[11px] tracking-[0.2em] uppercase ${
                      isDarkPiece ? 'text-[#E6B86A]' : 'text-[#A3122F]'
                    }`}
                  >
                    {piece.id === 'save'
                      ? lang === 'en'
                        ? 'Save the Date'
                        : 'शुभ तिथि सुरक्षित रखें'
                      : piece.id === 'haldi'
                        ? haldi.title[lang]
                        : piece.id === 'sangeet'
                          ? sangeet.title[lang]
                          : lang === 'en'
                            ? '॥ Shree Ganeshaya Namah ॥'
                            : '॥ श्री गणेशाय नमः ॥'}
                  </span>
                  <div className="mt-3">
                    <JharokhaCrest
                      themeId={themeId}
                      groomInitial={groomInitial}
                      brideInitial={brideInitial}
                      size="md"
                      tone={isDarkPiece ? 'gold' : 'theme'}
                    />
                  </div>
                </div>

                <div className="my-auto py-4">
                  <h4 className="font-display text-4xl font-semibold leading-tight">
                    {lang === 'en' ? (
                      <>
                        {cleanGroom}{' '}
                        <span className="italic font-normal text-[#E0A100]">&amp;</span>{' '}
                        {cleanBride}
                      </>
                    ) : (
                      <span className="font-hindi">
                        {groomHi} <span className="text-[#E0A100]">एवं</span> {brideHi}
                      </span>
                    )}
                  </h4>

                  <p
                    className={`mt-3 text-xs leading-relaxed ${
                      isDarkPiece ? 'text-[#E6D9C2]' : 'text-[#5B3E42]'
                    }`}
                  >
                    {piece.id === 'haldi'
                      ? haldi.subtitle[lang]
                      : piece.id === 'sangeet'
                        ? sangeet.subtitle[lang]
                        : piece.id === 'invite'
                          ? pheras.subtitle[lang]
                          : lang === 'en'
                            ? 'Joyfully invite you to celebrate their royal wedding festivities'
                            : 'अपने शुभ विवाह महोत्सव में आपको सादर आमंत्रित करते हैं'}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-3.5 text-left ${
                    isDarkPiece
                      ? 'border-[#E6B86A]/35 bg-black/40 backdrop-blur-sm'
                      : 'border-[#C88A2B]/40 bg-white/80 backdrop-blur-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Calendar
                      className={`h-3.5 w-3.5 shrink-0 ${
                        isDarkPiece ? 'text-[#E6B86A]' : 'text-[#A3122F]'
                      }`}
                    />
                    <span>
                      {piece.id === 'haldi'
                        ? `${haldi.date[lang]} · ${haldi.time}`
                        : piece.id === 'sangeet'
                          ? `${sangeet.date[lang]} · ${sangeet.time}`
                          : weddingDateLabel}
                    </span>
                  </div>
                  <div className="mt-1.5 flex items-start gap-2 text-xs opacity-90">
                    <MapPin
                      className={`h-3.5 w-3.5 shrink-0 mt-0.5 ${
                        isDarkPiece ? 'text-[#E6B86A]' : 'text-[#C88A2B]'
                      }`}
                    />
                    <span>
                      {piece.id === 'haldi'
                        ? haldi.venue[lang]
                        : piece.id === 'sangeet'
                          ? sangeet.venue[lang]
                          : cityLabel}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
