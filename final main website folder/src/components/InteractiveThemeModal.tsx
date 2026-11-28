import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { InviteTheme } from '../data/studioData';
import { JharokhaCrest, ScallopedCardBorder } from './JharokhaMotifs';

interface InteractiveThemeModalProps {
  theme: InviteTheme | null;
  onClose: () => void;
  groomName: string;
  brideName: string;
  onSwitchToJharokha: () => void;
}

export const InteractiveThemeModal: React.FC<InteractiveThemeModalProps> = ({
  theme,
  onClose,
  groomName,
  brideName,
  onSwitchToJharokha,
}) => {
  const [revealed, setRevealed] = useState(false);

  if (!theme) return null;

  const groomInitial = (groomName.trim()[0] || 'A').toUpperCase();
  const brideInitial = (brideName.trim()[0] || 'M').toUpperCase();

  return (
    <AnimatePresence>
      <motion.div
        key={theme.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#120D09]/85 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border border-[#C88A2B]/60 bg-[#FAF6EE] paper-grain p-6 sm:p-8 shadow-2xl"
        >
          <ScallopedCardBorder color={theme.accentHex} />

          <button
            type="button"
            onClick={() => {
              setRevealed(false);
              onClose();
            }}
            aria-label="Close theme preview"
            className="absolute right-4 top-4 z-20 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] text-[#231B15] hover:bg-[#F2EAD9] cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>

          {!revealed ? (
            <div className="relative z-10 text-center py-2">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#9E2A2B]">
                {theme.name} Interactive Opening
              </p>
              <div className="mt-4 mx-auto w-56 aspect-[3/4] overflow-hidden rounded-t-[110px] rounded-b-lg border border-[#C88A2B]/50 shadow-lg">
                <img
                  src={theme.image}
                  alt={theme.imageAlt}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover"
                />
              </div>

              <h3 className="mt-5 font-display text-3xl font-semibold text-[#231B15]">
                {groomName} &amp; {brideName}
              </h3>
              <p className="mt-1.5 text-xs text-[#5C4B3D]">{theme.gestureLabel}</p>

              <button
                type="button"
                onClick={() => setRevealed(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#9E2A2B] px-6 py-3 text-xs font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="h-4 w-4 text-[#FDE68A]" />
                <span>{theme.gestureLabel}</span>
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 text-center py-4 space-y-4"
            >
              <div className="flex justify-center">
                <JharokhaCrest
                  themeId={theme.id}
                  groomInitial={groomInitial}
                  brideInitial={brideInitial}
                  size="lg"
                  tone="theme"
                />
              </div>

              <p className="text-xs tracking-[0.2em] uppercase text-[#9E2A2B]">
                ॥ शुभ विवाह निमंत्रण ॥
              </p>

              <h3 className="font-display text-4xl font-semibold text-[#231B15]">
                {groomName} &amp; {brideName}
              </h3>

              <p className="text-sm text-[#4A3B2F] leading-relaxed">
                {theme.description}
              </p>

              <div className="border-y border-[#D8C8AA] py-3 text-xs text-[#6D5A49]">
                12 – 14 November 2026 · Udaipur · {theme.tier}
              </div>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setRevealed(false);
                    onClose();
                    onSwitchToJharokha();
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9E2A2B] px-5 py-3 text-xs font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer"
                >
                  <span>Experience Full Jharokha Haveli Doors Suite</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setRevealed(false)}
                  className="text-xs text-[#6D5A49] hover:text-[#231B15] cursor-pointer py-1"
                >
                  Replay {theme.name} Opening
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
