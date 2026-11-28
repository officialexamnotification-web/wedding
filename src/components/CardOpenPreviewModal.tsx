import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { InviteTheme } from '../data/studioData';
import { Language } from '../data/weddingData';
import { CardCustomization } from '../data/cardCustomization';
import { InteractiveInvitePhoneStage } from './InteractiveInvitePhoneStage';
import { RsvpRecord, RsvpSubmissionInput } from '../utils/rsvpStore';

interface CardOpenPreviewModalProps {
  theme: InviteTheme | null;
  onClose: () => void;
  groomName: string;
  brideName: string;
  weddingDateLabel?: string;
  cityLabel?: string;
  initialLang?: Language;
  customization?: CardCustomization;
  onOpenCustomizer?: (theme: InviteTheme) => void;
  onOpenShareSuite?: (theme: InviteTheme) => void;
  guestFamilyGreeting?: string;
  allowedEventIds?: string[];
  onSubmitRsvp?: (input: RsvpSubmissionInput) => Promise<RsvpRecord>;
  matchMainSiteCard?: boolean;
}

export const CardOpenPreviewModal: React.FC<CardOpenPreviewModalProps> = ({
  theme,
  onClose,
  groomName,
  brideName,
  weddingDateLabel,
  cityLabel,
  initialLang = 'en',
  customization,
  guestFamilyGreeting,
  allowedEventIds,
  onSubmitRsvp,
  matchMainSiteCard = true,
}) => {
  const [lang, setLang] = useState<Language>(initialLang);

  useEffect(() => {
    setLang(initialLang);
  }, [theme?.id, initialLang]);

  useEffect(() => {
    if (!theme) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [theme, onClose]);

  if (!theme) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={theme.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-[radial-gradient(circle_at_center,#251917_0%,#110A0A_78%)] p-3 sm:p-5 backdrop-blur-sm"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close card preview"
          className="fixed top-3.5 right-3.5 sm:top-5 sm:right-5 z-[110] grid size-9 sm:size-10 place-items-center rounded-full bg-[#160E0A]/75 sm:bg-white/10 text-[#F5D68A] sm:text-white/90 border border-[#E6B86A]/35 sm:border-white/15 backdrop-blur-md hover:bg-[#9E2A2B] hover:text-white transition-colors cursor-pointer shadow-lg"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Use the same 300px mobile / 380px desktop phone chassis as the template page. */}
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 14 }}
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[min(300px,calc(90dvh*0.445),90vw)] sm:w-[min(380px,calc(90dvh*0.445),90vw)]"
        >
          <div className="@container relative w-full">
            <div
              className="relative rounded-[15.8cqw] p-[0.85cqw]"
              style={{
                background:
                  'linear-gradient(160deg, #6b6b70 0%, #3a3a3d 18%, #1d1d20 46%, #3a3a3d 70%, #6b6b70 100%)',
                boxShadow:
                  'inset 0 0 0 0.2cqw #6b6b7066, inset 0 0.35cqw 0.5cqw rgba(255,255,255,0.18), 0 2.2cqw 4.5cqw -1cqw rgba(42,19,22,0.42), 0 7cqw 14cqw -3cqw rgba(42,19,22,0.28)',
              }}
            >
              {/* Side Hardware Buttons */}
              <span
                aria-hidden="true"
                className="absolute w-[0.75cqw] left-[-0.6cqw] rounded-l-[0.5cqw]"
                style={{
                  top: '30cqw',
                  height: '10cqw',
                  background:
                    'linear-gradient(90deg, #6b6b70 0%, #3a3a3d 18%, #1d1d20 46%, #3a3a3d 70%, #6b6b70 100%)',
                }}
              />
              <span
                aria-hidden="true"
                className="absolute w-[0.75cqw] left-[-0.6cqw] rounded-l-[0.5cqw]"
                style={{
                  top: '47cqw',
                  height: '15.5cqw',
                  background:
                    'linear-gradient(90deg, #6b6b70 0%, #3a3a3d 18%, #1d1d20 46%, #3a3a3d 70%, #6b6b70 100%)',
                }}
              />
              <span
                aria-hidden="true"
                className="absolute w-[0.75cqw] left-[-0.6cqw] rounded-l-[0.5cqw]"
                style={{
                  top: '66cqw',
                  height: '15.5cqw',
                  background:
                    'linear-gradient(90deg, #6b6b70 0%, #3a3a3d 18%, #1d1d20 46%, #3a3a3d 70%, #6b6b70 100%)',
                }}
              />
              <span
                aria-hidden="true"
                className="absolute w-[0.75cqw] right-[-0.6cqw] rounded-r-[0.5cqw]"
                style={{
                  top: '52cqw',
                  height: '24cqw',
                  background:
                    'linear-gradient(270deg, #6b6b70 0%, #3a3a3d 18%, #1d1d20 46%, #3a3a3d 70%, #6b6b70 100%)',
                }}
              />
              <span
                aria-hidden="true"
                className="absolute w-[0.75cqw] right-[-0.6cqw] rounded-r-[0.5cqw]"
                style={{
                  top: '122cqw',
                  height: '17cqw',
                  background:
                    'linear-gradient(270deg, #6b6b70 0%, #3a3a3d 18%, #1d1d20 46%, #3a3a3d 70%, #6b6b70 100%)',
                }}
              />

              {/* Black Inner Bezel */}
              <div className="rounded-[14.95cqw] bg-black p-[1.75cqw] shadow-[inset_0_0_0_0.15cqw_rgba(255,255,255,0.07)]">
                <div className="relative overflow-hidden rounded-[13.2cqw] bg-black">
                  {/* Exact 390:844 Live Interactive Phone Screen */}
                  <div
                    className={`relative overflow-hidden ${
                      matchMainSiteCard ? 'bg-[#F3EAE3]' : 'bg-[#120D0A]'
                    }`}
                    style={{ aspectRatio: '390 / 844' }}
                  >
                    <InteractiveInvitePhoneStage
                      theme={theme}
                      lang={lang}
                      groomName={customization?.primaryName || groomName}
                      brideName={customization?.partnerName || brideName}
                      weddingDateLabel={customization?.dateLabel || weddingDateLabel}
                      cityLabel={customization?.cityLabel || cityLabel}
                      compact={matchMainSiteCard}
                      fullPreview={theme.id === 'sheesh-mahal'}
                      customization={customization}
                      guestFamilyGreeting={guestFamilyGreeting}
                      allowedEventIds={allowedEventIds}
                      onSubmitRsvp={onSubmitRsvp}
                    />
                  </div>

                  {/* Dynamic Island Notch */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-[2.6cqw] left-1/2 z-40 h-[8.7cqw] w-[29.3cqw] -translate-x-1/2 rounded-full bg-black"
                  >
                    <span className="absolute top-1/2 right-[2.6cqw] size-[2.9cqw] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#2c3a55,#0b0f18_60%)]" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
