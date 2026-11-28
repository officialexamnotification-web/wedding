import React, { useEffect, useState } from 'react';
import {
  Infinity as InfinityIcon,
  Maximize2,
  Pencil,
  Check,
  Minus,
  Plus,
  CalendarCheck2,
  MessageCircle,
  AlertCircle,
  SlidersHorizontal,
  Share2,
  Flame,
  Sparkles,
} from 'lucide-react';
import { InviteTheme, STUDIO_THEMES } from '../data/studioData';
import { CardCustomization, SITE_DOMAIN } from '../data/cardCustomization';
import {
  BABY_BIRTHDAY_CEREMONIES,
  BIRTHDAY_CEREMONIES,
  CEREMONIES,
  COUPLE_DEFAULTS,
  HINDU_BIRTHDAY_CEREMONIES,
  HINDU_GIRL_BIRTHDAY_CEREMONIES,
  HINDU_BOY_BIRTHDAY_CEREMONIES,
  PAITHANI_CEREMONIES,
  Language,
} from '../data/weddingData';
import { InteractiveInvitePhoneStage } from './InteractiveInvitePhoneStage';
import { StationeryPiece, StationeryPieceModal } from './StationeryPieceModal';
import { JharokhaCrest } from './JharokhaMotifs';
import { getMonogramMeta } from './TemplateMonograms';
import {
  validateGuestName,
  validateGuestContact,
  validateRsvpForm,
  normalizeIndianWhatsappDigits,
  RsvpValidationErrors,
} from '../utils/rsvpValidation';
import {
  AttendanceStatus,
  DietaryPreference,
  FamilySide,
  RsvpRecord,
  RsvpSubmissionInput,
  saveLocalRsvp,
} from '../utils/rsvpStore';

interface JharokhaInvitePageProps {
  activeTheme: InviteTheme;
  onSelectTheme: (theme: InviteTheme) => void;
  onNavigateInvitesCatalog: () => void;
  onOpenFullPreview: (lang: Language) => void;
  groomName: string;
  brideName: string;
  onChangeGroomName: (v: string) => void;
  onChangeBrideName: (v: string) => void;
  customization?: CardCustomization;
  onOpenCustomizer?: (theme: InviteTheme) => void;
  onOpenShareSuite?: (theme: InviteTheme) => void;
  rsvpCount?: number;
  guestFamilyGreeting?: string;
  allowedEventIds?: string[];
  onSubmitRsvp?: (input: RsvpSubmissionInput) => Promise<RsvpRecord>;
}

const MATCHING_PIECES: StationeryPiece[] = [
  {
    id: 'save',
    label: 'Save-the-date',
    dimensions: '1080×1350',
    aspectClass: 'aspect-[1080/1350]',
    image: '/assets/images/haveli_carved_doors_1794564897457.jpg',
  },
  {
    id: 'invite',
    label: 'The printed invitation',
    dimensions: '576×864',
    aspectClass: 'aspect-[576/864]',
    image: '/assets/images/mandap_pheras_courtyard_1794564899328.jpg',
  },
  {
    id: 'haldi',
    label: 'Haldi card',
    dimensions: '1080×1350',
    aspectClass: 'aspect-[1080/1350]',
    image: '/assets/images/mehendi_haldi_painting_1794564897730.jpg',
  },
  {
    id: 'sangeet',
    label: 'Sangeet card',
    dimensions: '1080×1350',
    aspectClass: 'aspect-[1080/1350]',
    image: '/assets/images/sangeet_palace_night_1794564898780.jpg',
  },
  {
    id: 'story',
    label: 'Instagram story',
    dimensions: '1080×1920',
    aspectClass: 'aspect-[1080/1920]',
    image: '/assets/images/jharokha_courtyard_dusk_1794564897495.jpg',
  },
];

export const JharokhaInvitePage: React.FC<JharokhaInvitePageProps> = ({
  activeTheme,
  onSelectTheme,
  onNavigateInvitesCatalog,
  onOpenFullPreview,
  groomName,
  brideName,
  onChangeGroomName,
  onChangeBrideName,
  customization,
  onOpenCustomizer,
  onOpenShareSuite,
  rsvpCount = 0,
  guestFamilyGreeting,
  allowedEventIds,
  onSubmitRsvp,
}) => {
  const [phoneLang, setPhoneLang] = useState<Language>('en');
  const [weddingDateLabel, setWeddingDateLabel] = useState(COUPLE_DEFAULTS.weddingDates.en);
  const [cityLabel, setCityLabel] = useState(COUPLE_DEFAULTS.city.en);
  const [showCreateCustomizer, setShowCreateCustomizer] = useState(false);
  const [activePiece, setActivePiece] = useState<StationeryPiece | null>(null);
  const [savedToast, setSavedToast] = useState(false);

  // Jharokha India-First RSVP Form state & validation
  const [rsvpName, setRsvpName] = useState(guestFamilyGreeting || '');
  const [rsvpContact, setRsvpContact] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState<AttendanceStatus>('attending');
  const [rsvpGuestCount, setRsvpGuestCount] = useState(2);
  const [rsvpSide, setRsvpSide] = useState<FamilySide>(() =>
    customization?.familySide === 'bride-first' ? 'bride' : 'groom'
  );
  const [rsvpDiet, setRsvpDiet] = useState<DietaryPreference>('pure_veg');
  const [rsvpArrival, setRsvpArrival] = useState('');
  const [rsvpEvents, setRsvpEvents] = useState<string[]>(['haldi', 'mehendi', 'sangeet', 'pheras']);
  const [rsvpNote, setRsvpNote] = useState('');
  const [rsvpErrors, setRsvpErrors] = useState<RsvpValidationErrors>({});
  const [rsvpSubmitError, setRsvpSubmitError] = useState<string | null>(null);
  const [rsvpSubmitting, setRsvpSubmitting] = useState(false);
  const [rsvpTouched, setRsvpTouched] = useState<{ name?: boolean; contact?: boolean }>({});
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);

  const isBirthday = activeTheme.celebrationType === 'birthday';
  const isBabyBirthday = activeTheme.birthdayFlavor === 'baby';
  const isHinduBirthday = activeTheme.birthdayFlavor === 'hindu';
  const isGirlHindu = isHinduBirthday && activeTheme.birthdayGender === 'girl';
  const isBoyHindu = isHinduBirthday && activeTheme.birthdayGender === 'boy';
  const baseEvents = isGirlHindu
    ? HINDU_GIRL_BIRTHDAY_CEREMONIES
    : isBoyHindu
      ? HINDU_BOY_BIRTHDAY_CEREMONIES
      : isHinduBirthday
        ? HINDU_BIRTHDAY_CEREMONIES
        : isBabyBirthday
          ? BABY_BIRTHDAY_CEREMONIES
          : isBirthday
            ? BIRTHDAY_CEREMONIES
            : activeTheme.id === 'paithani'
              ? PAITHANI_CEREMONIES
              : CEREMONIES;

  const rawActiveEvents = customization?.events
    ? customization.events.map((ev) => ({
        id: ev.id,
        title: { en: ev.titleEn, hi: ev.titleHi || ev.titleEn },
        time: ev.time,
      }))
    : baseEvents;

  const activeEvents =
    allowedEventIds && allowedEventIds.length > 0
      ? rawActiveEvents.filter((ev) => allowedEventIds.includes(ev.id)).length > 0
        ? rawActiveEvents.filter((ev) => allowedEventIds.includes(ev.id))
        : rawActiveEvents
      : rawActiveEvents;

  useEffect(() => {
    if (guestFamilyGreeting && !rsvpTouched.name) {
      setRsvpName(guestFamilyGreeting);
    }
  }, [guestFamilyGreeting, rsvpTouched.name]);

  useEffect(() => {
    setRsvpEvents(activeEvents.map((ev) => ev.id));
  }, [activeTheme.id, customization?.events, allowedEventIds]);

  useEffect(() => {
    if (customization?.familySide) {
      setRsvpSide(customization.familySide === 'bride-first' ? 'bride' : 'groom');
    }
  }, [customization?.familySide]);

  const cleanGroom = (customization?.primaryName || groomName).trim() || 'Aarav';
  const cleanBride = (customization?.partnerName || brideName).trim() || 'Meera';
  const celebrantName = customization?.primaryName?.trim()
    ? customization.primaryName.trim()
    : isGirlHindu
      ? cleanBride
      : cleanGroom;
  const effectiveDateLabel = customization?.dateLabel || weddingDateLabel;
  const effectiveCityLabel = customization?.cityLabel || cityLabel;
  const groomInitial = cleanGroom[0].toUpperCase();
  const brideInitial = cleanBride[0].toUpperCase();
  const crestFirstInitial = isBirthday ? (celebrantName[0] || 'A').toUpperCase() : groomInitial;
  const crestSecondInitial = isHinduBirthday ? 'ॐ' : isBirthday ? '★' : brideInitial;
  const monogramMeta = getMonogramMeta(activeTheme.id);

  const otherThemes = STUDIO_THEMES.filter((t) => t.id !== activeTheme.id);

  const toggleRsvpEvent = (id: string) => {
    setRsvpEvents((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0 && rsvpErrors.events) {
        setRsvpErrors((err) => ({ ...err, events: undefined }));
      }
      return next;
    });
  };

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRsvpTouched({ name: true, contact: true });
    setRsvpSubmitError(null);
    const { isValid, errors } = validateRsvpForm({
      name: rsvpName,
      contact: rsvpContact,
      selectedEventsCount: rsvpEvents.length,
      attendanceStatus: rsvpStatus,
      lang: phoneLang,
    });
    if (!isValid) {
      setRsvpErrors(errors);
      return;
    }
    setRsvpErrors({});
    setRsvpSubmitting(true);

    const payload: RsvpSubmissionInput = {
      guestName: rsvpName.trim(),
      guestPhone: rsvpContact.trim(),
      attendanceStatus: rsvpStatus,
      guestCount: rsvpStatus === 'attending' ? rsvpGuestCount : 0,
      side: rsvpSide,
      dietaryPreference: rsvpStatus === 'attending' ? rsvpDiet : 'no_preference',
      eventIds: rsvpStatus === 'attending' ? rsvpEvents : [],
      arrivalInfo: rsvpArrival.trim(),
      blessingNote: rsvpNote.trim(),
      source: 'guest_web',
    };

    try {
      if (onSubmitRsvp) {
        await onSubmitRsvp(payload);
      } else {
        saveLocalRsvp(activeTheme.id, payload);
      }
      setRsvpSubmitted(true);
    } catch (err) {
      setRsvpSubmitError(
        err instanceof Error ? err.message : 'Unable to save RSVP right now.'
      );
    } finally {
      setRsvpSubmitting(false);
    }
  };

  const selectedEventTitles = activeEvents
    .filter((c) => rsvpEvents.includes(c.id))
    .map((c) => c.title[phoneLang])
    .join(', ');

  const hostWhatsappDigits = normalizeIndianWhatsappDigits(customization?.rsvpWhatsapp);
  const dietDisplay =
    rsvpDiet === 'jain'
      ? 'Jain Food (No Onion/Garlic)'
      : rsvpDiet === 'veg_nonveg'
        ? 'Veg + Non-Veg'
        : 'Pure Veg';
  const sideDisplay =
    rsvpSide === 'bride'
      ? "Bride's Side (Ladkiwale)"
      : rsvpSide === 'both'
        ? 'Friends / Common'
        : "Groom's Side (Ladkewale)";

  const contactSuffix = rsvpContact.trim() ? `\nContact: ${rsvpContact.trim()}` : '';

  const whatsappReplyText = encodeURIComponent(
    rsvpStatus === 'declined'
      ? `Namaste! Sending warm Ashirwad for ${isBirthday ? celebrantName : `${cleanGroom} & ${cleanBride}`} (${activeTheme.name}).\nGuest/Family: ${rsvpName.trim()}${contactSuffix}\nStatus: Unable to join in person, sending blessings.${
          rsvpNote.trim() ? `\nBlessing: ${rsvpNote.trim()}` : ''
        }`
      : isHinduBirthday
        ? `Namaste! Shubh Janmotsav RSVP for ${celebrantName} (${activeTheme.name}):\nGuest/Family: ${rsvpName.trim()}${contactSuffix}\nGuests Attending: ${rsvpGuestCount} (${dietDisplay})\nJoining for: ${selectedEventTitles}${
            rsvpArrival.trim() ? `\nArrival/Stay: ${rsvpArrival.trim()}` : ''
          }${rsvpNote.trim() ? `\nAshirwad/Note: ${rsvpNote.trim()}` : ''}`
        : isBirthday
          ? `Hey! Birthday RSVP for ${celebrantName}'s ${activeTheme.name}:\nGuest: ${rsvpName.trim()}${contactSuffix}\nGuests Attending: ${rsvpGuestCount} (${dietDisplay})\nJoining for: ${selectedEventTitles}${
              rsvpArrival.trim() ? `\nArrival/Stay: ${rsvpArrival.trim()}` : ''
            }${rsvpNote.trim() ? `\nWish/Note: ${rsvpNote.trim()}` : ''}`
          : `Namaste! RSVP for ${cleanGroom} & ${cleanBride}'s ${activeTheme.name} Invite:\nGuest/Family: ${rsvpName.trim()} (${sideDisplay})${contactSuffix}\nGuests Attending: ${rsvpGuestCount} (${dietDisplay})\nFunctions: ${selectedEventTitles}${
              rsvpArrival.trim() ? `\nArrival/Stay: ${rsvpArrival.trim()}` : ''
            }${rsvpNote.trim() ? `\nNote: ${rsvpNote.trim()}` : ''}`
  );

  const handleCreateInviteClick = () => {
    setShowCreateCustomizer(true);
    setSavedToast(false);
    const el = document.getElementById('customizer-panel');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <>
      {/* Breadcrumb + Quick Single-Card Switcher */}
      <nav aria-label="Breadcrumb" className="pt-5 sm:pt-6 text-[13.5px] text-[#896B6F] flex flex-wrap items-center justify-between gap-2">
        <div>
          <button
            type="button"
            onClick={onNavigateInvitesCatalog}
            className="hover:text-[#2A1316] cursor-pointer"
          >
            Templates
          </button>
          <span className="px-2" aria-hidden="true">
            /
          </span>
          <span className="text-[#5B3E42] font-medium">{activeTheme.name}</span>
          <span className="px-2" aria-hidden="true">
            ·
          </span>
          <span className="line-through opacity-75">{activeTheme.originalPrice}</span>
          <span className="ml-1.5 font-bold text-[#15803D]">FREE (₹0)</span>
        </div>

        <button
          type="button"
          onClick={onNavigateInvitesCatalog}
          className="text-xs font-medium text-[#A3122F] hover:underline cursor-pointer"
        >
          ← Browse all {STUDIO_THEMES.length} free templates
        </button>
      </nav>

      {/* Quick Horizontal Switcher for All Single-Card Pages */}
      <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-2 border-b border-[#EADFD8]">
        {STUDIO_THEMES.map((t) => {
          const isCurrent = t.id === activeTheme.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelectTheme(t)}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                isCurrent
                  ? 'bg-[#2A1316] text-[#FBF6F3]'
                  : 'bg-white/80 text-[#5B3E42] border border-[#EADFD8] hover:border-[#A3122F] hover:text-[#2A1316]'
              }`}
            >
              <span>{t.name}</span>
              <span className="line-through opacity-65 text-[10.5px]">{t.originalPrice}</span>
              <span className={isCurrent ? 'text-[#86EFAC] font-bold' : 'text-[#15803D] font-bold'}>
                FREE
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Hero Grid: Left Details + Right Sticky iPhone Mockup */}
      <section
        className="mt-3 grid gap-7 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_400px] lg:grid-rows-[auto_1fr] lg:gap-x-16 lg:gap-y-0"
        aria-labelledby="c-title"
      >
        {/* LEFT COLUMN ROW 1: Title, Tagline, Crossed-Out -> FREE Pricing Card, CTA */}
        <div className="max-w-[600px] lg:col-start-1 lg:row-start-1 lg:pt-6">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#896B6F] mb-2">
            <span>{activeTheme.indexLabel} · {activeTheme.regionLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="line-through">{activeTheme.originalPrice}</span>
            <span className="font-bold text-[#15803D]">100% FREE</span>
          </div>

          <div className="flex flex-wrap items-baseline gap-3">
            <h1 id="c-title" className="display text-[44px] sm:text-[60px]">
              {activeTheme.name}
            </h1>
            <span className="font-hindi text-2xl sm:text-3xl text-[#A3122F]">
              {activeTheme.nameHi}
            </span>
          </div>

          <p className="mt-2 text-[17px] leading-[1.55] text-[#5B3E42] sm:mt-3 sm:text-[19px]">
            {activeTheme.id === 'jharokha'
              ? 'Carved haveli doors swing open at dusk, onto a courtyard glowing with diyas and marigolds. Pure Rajasthani royalty.'
              : activeTheme.tagline}
          </p>

          {/* Crossed-Out Original Price -> FREE Lifetime Card */}
          <div className="mt-5 max-w-[30rem] rounded-[20px] bg-white p-4 shadow-[0_0_0_1.5px_#15803D,0_12px_28px_rgba(42,19,22,0.08)] sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#15803D]">
                <InfinityIcon className="h-4 w-4" strokeWidth={2} />
                Lifetime Validity · Unlimited Edits
              </span>
              <span className="text-xs font-medium text-[#896B6F] tabular-nums">
                Original Price Crossed Out
              </span>
            </div>

            <p className="mt-2.5 flex flex-wrap items-baseline gap-x-3">
              <span className="font-display text-[26px] leading-none text-[#896B6F] line-through tabular-nums">
                {activeTheme.originalPrice}
              </span>
              <span className="font-display text-[36px] leading-none font-bold text-[#15803D]">
                FREE
              </span>
              <span className="text-[15px] font-semibold text-[#2A1316]">
                (₹0 · Yours for life)
              </span>
            </p>
            <p className="mt-1 text-[13px] leading-snug text-[#15803D] font-medium">
              No payment required · Instant WhatsApp shareable link included
            </p>

            <p className="mt-2 text-[15px] leading-[1.5] text-[#5B3E42]">
              Your {activeTheme.name} interactive invitation website, printable invitation and 5
              matching cards, in your names, ready to customize and share for free.
            </p>

            <ul className="mt-3 space-y-1.5 border-t border-[#EADFD8] pt-3">
              {activeTheme.deliverables.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13.5px] text-[#2A1316]">
                  <Check className="h-4 w-4 shrink-0 text-[#15803D] mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 hidden lg:flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCreateInviteClick}
              className="btn btn-primary whitespace-nowrap shrink-0"
            >
              Create Free Invite (₹0)
            </button>
            {onOpenShareSuite && (
              <button
                type="button"
                onClick={() => onOpenShareSuite(activeTheme)}
                className="chip gap-1.5 !bg-[#1F6E4A] !text-white hover:!bg-[#18593c] whitespace-nowrap shrink-0"
              >
                <Share2 className="h-3.5 w-3.5" />
                <span>Publish &amp; Share Free →</span>
              </button>
            )}
            {onOpenCustomizer && (
              <button
                type="button"
                onClick={() => onOpenCustomizer(activeTheme)}
                className="chip gap-1.5 whitespace-nowrap shrink-0"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 text-[#A3122F]" />
                <span>Customize Sections &amp; Events</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowCreateCustomizer((v) => !v)}
              className="chip gap-1.5 whitespace-nowrap shrink-0"
            >
              <Pencil className="h-3.5 w-3.5 text-[#A3122F]" />
              <span>Quick Edit Names</span>
            </button>
          </div>

          {/* Inline Personalizer Drawer when Create invite / Personalize is toggled */}
          {showCreateCustomizer && (
            <div
              id="customizer-panel"
              className="mt-5 max-w-[30rem] rounded-[18px] border border-[#EADFD8] bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A3122F]">
                  Live Card Personalizer
                </p>
                <button
                  type="button"
                  onClick={() => setShowCreateCustomizer(false)}
                  className="text-xs text-[#896B6F] hover:text-[#2A1316] cursor-pointer"
                >
                  Done
                </button>
              </div>
              <p className="mt-1 text-xs text-[#5B3E42]">
                Changes update the interactive iPhone invite and all 5 matching cards below
                instantly.
              </p>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-[#5B3E42] mb-1">
                    {isGirlHindu
                      ? "Girl's Name"
                      : isBoyHindu
                        ? "Boy's Name"
                        : isBabyBirthday
                          ? "Baby's First Name"
                          : isBirthday
                            ? "Celebrant's Name"
                            : "Groom's Name"}
                  </label>
                  <input
                    type="text"
                    value={isGirlHindu ? brideName : groomName}
                    onChange={(e) =>
                      isGirlHindu
                        ? onChangeBrideName(e.target.value)
                        : onChangeGroomName(e.target.value)
                    }
                    placeholder={isGirlHindu ? 'Meera' : 'Aarav'}
                    className="w-full rounded-lg border border-[#EADFD8] bg-[#FBF6F3] px-3 py-2 text-sm text-[#2A1316] focus:border-[#A3122F] focus:outline-none"
                  />
                </div>
                {!isBirthday && (
                  <div>
                    <label className="block text-[11px] font-medium text-[#5B3E42] mb-1">
                      Bride&apos;s Name
                    </label>
                    <input
                      type="text"
                      value={brideName}
                      onChange={(e) => onChangeBrideName(e.target.value)}
                      placeholder="Meera"
                      className="w-full rounded-lg border border-[#EADFD8] bg-[#FBF6F3] px-3 py-2 text-sm text-[#2A1316] focus:border-[#A3122F] focus:outline-none"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-medium text-[#5B3E42] mb-1">
                    {isBirthday ? 'Birthday Date' : 'Wedding Dates'}
                  </label>
                  <input
                    type="text"
                    value={weddingDateLabel}
                    onChange={(e) => setWeddingDateLabel(e.target.value)}
                    placeholder={isBirthday ? '22 November 2026' : '12 – 14 November 2026'}
                    className="w-full rounded-lg border border-[#EADFD8] bg-[#FBF6F3] px-3 py-2 text-sm text-[#2A1316] focus:border-[#A3122F] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#5B3E42] mb-1">
                    City / Venue
                  </label>
                  <input
                    type="text"
                    value={cityLabel}
                    onChange={(e) => setCityLabel(e.target.value)}
                    placeholder="Udaipur, Rajasthan"
                    className="w-full rounded-lg border border-[#EADFD8] bg-[#FBF6F3] px-3 py-2 text-sm text-[#2A1316] focus:border-[#A3122F] focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSavedToast(true)}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#A3122F] px-4 py-2 text-xs font-semibold text-white hover:bg-[#880d26] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    {savedToast ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Applied to Suite</span>
                      </>
                    ) : (
                      <span>Apply to Phone &amp; Cards</span>
                    )}
                  </button>
                  {onOpenCustomizer && (
                    <button
                      type="button"
                      onClick={() => onOpenCustomizer(activeTheme)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#EADFD8] bg-[#FBF6F3] px-3.5 py-2 text-xs font-semibold text-[#2A1316] hover:border-[#A3122F] cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <SlidersHorizontal className="h-3.5 w-3.5 text-[#A3122F]" />
                      <span>Add/Remove Options</span>
                    </button>
                  )}
                </div>
                <span className="text-[11px] font-mono text-[#896B6F]">
                  {SITE_DOMAIN}/{activeTheme.slug}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: STICKY TITANIUM PHONE MOCKUP WITH LIVE TAP-TO-OPEN CARD */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:sticky lg:top-6 lg:self-start">
          <div className="mx-auto w-full max-w-[300px] sm:max-w-[380px]">
            {activeTheme.id === 'jashn-birthday' && (
              <div className="mb-3 lg:-mt-4 flex flex-col items-center">
                <div
                  className="relative inline-flex items-center gap-2 rounded-full border-2 border-[#F5C16C] bg-gradient-to-r from-[#2A1316] via-[#6B1D24] to-[#2A1316] px-4 py-1.5 text-[#FFF3C4] shadow-[0_0_0_3px_rgba(245,193,108,0.28),0_8px_24px_-4px_rgba(163,18,47,0.5)]"
                  role="note"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-1 rounded-full bg-gradient-to-r from-amber-400/25 via-yellow-300/35 to-amber-400/25 blur-md animate-pulse"
                  />
                  <Flame className="relative z-10 h-4 w-4 shrink-0 text-[#FCD34D] fill-[#F59E0B] animate-pulse" />
                  <span className="relative z-10 text-[11px] sm:text-xs font-extrabold tracking-[0.16em] uppercase text-[#FFF6D6] drop-shadow-[0_1px_2px_rgba(0,0,0,0.65)]">
                    {phoneLang === 'hi'
                      ? 'मोमबत्तियाँ जलाने के लिए टैप करें'
                      : 'TAP TO IGNITE THE CANDLES'}
                  </span>
                  <Sparkles className="relative z-10 h-3.5 w-3.5 shrink-0 text-[#FCD34D]" />
                </div>
                <span
                  aria-hidden="true"
                  className="mt-1 h-2.5 w-2.5 rotate-45 border-r-2 border-b-2 border-[#D97706] opacity-85"
                />
              </div>
            )}
            <div className="@container relative">
              {/* Outer Titanium Shell */}
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
                    {/* 390:844 Live Interactive Card Stage */}
                    <div
                      className="relative overflow-hidden bg-[#F3EAE3]"
                      style={{ aspectRatio: '390 / 844' }}
                    >
                      <InteractiveInvitePhoneStage
                        theme={activeTheme}
                        lang={phoneLang}
                        groomName={cleanGroom}
                        brideName={cleanBride}
                        weddingDateLabel={effectiveDateLabel}
                        cityLabel={effectiveCityLabel}
                        compact={true}
                        customization={customization}
                        guestFamilyGreeting={guestFamilyGreeting}
                        allowedEventIds={allowedEventIds}
                        onSubmitRsvp={onSubmitRsvp}
                        onOpenCustomizer={
                          onOpenCustomizer ? () => onOpenCustomizer(activeTheme) : undefined
                        }
                        onOpenFullPreview={() => onOpenFullPreview(phoneLang)}
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

            {/* Interactive Phone Gesture Caption */}
            <p className="mt-3 text-center text-[14px] text-[#896B6F]">
              {activeTheme.id === 'jharokha'
                ? 'Tap to open and glide into the diya-lit haveli courtyard.'
                : activeTheme.gestureLabel}
            </p>

            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2">
              {(!customization?.cardLangMode || customization.cardLangMode === 'both') ? (
                <div
                  role="radiogroup"
                  aria-label="Language"
                  className="inline-flex gap-1 rounded-full bg-[#F3EAE3] p-1"
                >
                  <button
                    type="button"
                    role="radio"
                    aria-checked={phoneLang === 'en'}
                    onClick={() => setPhoneLang('en')}
                    className={`min-h-9 rounded-full px-4 py-1.5 text-[14.5px] leading-tight font-medium transition-colors duration-150 cursor-pointer ${
                      phoneLang === 'en'
                        ? 'bg-[#2A1316] text-[#FBF6F3]'
                        : 'text-[#5B3E42] hover:text-[#2A1316]'
                    }`}
                  >
                    English
                  </button>
                  <button
                    type="button"
                    role="radio"
                    aria-checked={phoneLang === 'hi'}
                    onClick={() => setPhoneLang('hi')}
                    lang="hi"
                    className={`min-h-9 rounded-full px-4 py-1.5 text-[14.5px] leading-tight font-medium transition-colors duration-150 font-hindi cursor-pointer ${
                      phoneLang === 'hi'
                        ? 'bg-[#2A1316] text-[#FBF6F3]'
                        : 'text-[#5B3E42] hover:text-[#2A1316]'
                    }`}
                  >
                    हिन्दी
                  </button>
                </div>
              ) : (
                <span className="inline-flex min-h-9 items-center rounded-full bg-[#F3EAE3] px-4 py-1.5 text-[13.5px] font-medium text-[#5B3E42]">
                  {customization.cardLangMode === 'hi' ? 'हिन्दी Only Card' : 'English Only Card'}
                </span>
              )}

              <button
                type="button"
                onClick={() =>
                  onOpenFullPreview(
                    customization?.cardLangMode === 'hi'
                      ? 'hi'
                      : customization?.cardLangMode === 'en'
                        ? 'en'
                        : phoneLang
                  )
                }
                className="chip !h-11 gap-2"
              >
                <Maximize2 className="h-4 w-4" />
                <span>Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* LEFT COLUMN ROW 2: The story behind it */}
        <div className="max-w-[600px] lg:col-start-1 lg:row-start-2">
          <div className="mt-10 lg:mt-12">
            <h2 className="display text-[26px] sm:text-[30px]">The story behind it</h2>
            <div className="mt-3 grid gap-3 text-[16.5px] leading-[1.65] text-[#5B3E42]">
              {activeTheme.id === 'jharokha' ? (
                <>
                  <p>
                    A Rajasthani wedding begins at the door: the toran over the bride’s entrance,
                    the carved wooden doors, the courtyard lit with diyas. Rajwada Aagman opens
                    exactly like that, for every guest—painted in the warmth of heritage Mewar
                    miniatures in sindoor crimson, marigold saffron, and antique gold.
                  </p>
                  <p>
                    Made for couples who want their celebration to feel like a welcoming palace
                    from the very first tap.
                  </p>
                </>
              ) : activeTheme.id === 'paithani' ? (
                <>
                  <p>
                    A Maharashtrian Goraj Muhurat begins with the sacred handwoven Antarpat stretched
                    between bride and groom, framed by banana leaves, mango torans, and glowing brass
                    samai lamps in the twilight wada courtyard.
                  </p>
                  <p>
                    As Mangalashtak chants swell, white mogra &amp; akshata petals shower across the
                    screen and the Antarpat Mangalam silk veil drops cleanly into the illuminated
                    mandap—like opening an heirloom keepsake.
                  </p>
                </>
              ) : (
                <>
                  <p>{activeTheme.description}</p>
                  <p>
                    Designed in both English and warm, traditional Hindi so every generation in the
                    family opens it with ease.
                  </p>
                </>
              )}
            </div>

            {/* Bespoke Template Monogram Crest Showcase */}
            <div className="mt-7 flex items-center gap-5 border-t border-[#EADFD8] pt-6">
              <div className="shrink-0 rounded-2xl border border-[#EADFD8] bg-white px-4 py-3 shadow-xs">
                <JharokhaCrest
                  themeId={activeTheme.id}
                  groomInitial={crestFirstInitial}
                  brideInitial={crestSecondInitial}
                  size="lg"
                  tone="theme"
                />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#896B6F]">
                  Signature Template Monogram
                </p>
                <p className="mt-0.5 font-display text-2xl font-semibold text-[#2A1316]">
                  {monogramMeta.styleName}
                </p>
                <p className="mt-1 text-sm text-[#5B3E42] leading-snug">
                  {monogramMeta.motifSummary} — crafted in {crestFirstInitial}
                  {isBirthday ? '' : ` & ${crestSecondInitial}`}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 (#pieces): Everything that goes with it, in your names */}
      <section id="pieces" className="mt-20 scroll-mt-20" aria-labelledby="pieces-title">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="pieces-title" className="display text-[28px] sm:text-[36px]">
            Everything that goes with it, in your names
          </h2>
          <p className="hidden text-[15px] text-[#896B6F] sm:block">
            Change a date once and it changes everywhere
          </p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 lg:grid-cols-5">
          {MATCHING_PIECES.map((piece) => {
            const isDarkPiece = piece.id === 'sangeet' || piece.id === 'story';
            return (
              <figure key={piece.id} className="min-w-0">
                <div className="rounded-[14px] shadow-[0_10px_28px_rgba(42,19,22,0.14)]">
                  <div
                    onClick={() => setActivePiece(piece)}
                    className={`group/preview relative overflow-hidden rounded-[14px] cursor-pointer ${piece.aspectClass} ${
                      isDarkPiece ? 'bg-[#121629] text-[#FAF6EE]' : 'bg-[#FBF6F3] text-[#2A1316]'
                    }`}
                  >
                    <img
                      src={piece.image}
                      alt={piece.label}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className={`absolute inset-0 size-full object-cover object-top transition-transform duration-500 group-hover/preview:scale-105 ${
                        isDarkPiece ? 'opacity-65' : 'opacity-45'
                      }`}
                    />
                    <div
                      className={`absolute inset-0 ${
                        isDarkPiece
                          ? 'bg-gradient-to-t from-[#0E1120]/90 via-[#121629]/35 to-transparent'
                          : 'bg-gradient-to-t from-[#FBF6F3]/95 via-[#FBF6F3]/45 to-transparent'
                      }`}
                    />

                    {/* Live personalized typography inside thumbnail card */}
                    <div className="relative z-10 flex h-full flex-col justify-between p-3 text-center">
                      <div className="flex justify-center pt-1">
                        <JharokhaCrest
                          themeId={activeTheme.id}
                          groomInitial={crestFirstInitial}
                          brideInitial={crestSecondInitial}
                          size="sm"
                          tone={isDarkPiece ? 'gold' : 'theme'}
                        />
                      </div>

                      <div className="pb-9">
                        <p className="text-[9.5px] uppercase tracking-[0.16em] opacity-85">
                          {piece.label}
                        </p>
                        <p className="mt-0.5 font-display text-lg font-semibold leading-tight">
                          {isBirthday ? celebrantName : `${cleanGroom} & ${cleanBride}`}
                        </p>
                        <p className="mt-0.5 text-[10px] opacity-80 truncate">{effectiveDateLabel}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePiece(piece);
                      }}
                      aria-label={`Preview ${piece.label}`}
                      className="absolute inset-0 flex items-end justify-end p-2 cursor-pointer"
                    >
                      <span className="flex h-8 items-center gap-1.5 rounded-full bg-[#1a0b0d]/75 px-3 text-[13px] font-medium whitespace-nowrap text-white shadow-[0_6px_20px_rgba(0,0,0,0.25)] backdrop-blur-sm transition-transform duration-150 group-hover/preview:bg-[#A3122F] group-active/preview:scale-[0.96]">
                        <Maximize2 className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </span>
                    </button>
                  </div>
                </div>
                <figcaption className="mt-2.5 flex items-center justify-between gap-2 text-[14px] font-medium text-[#2A1316]">
                  <span>{piece.label}</span>
                  <span className="text-[11.5px] font-semibold">
                    <span className="line-through opacity-60 mr-1">
                      {piece.id === 'invite' ? '₹599' : piece.id === 'story' ? '₹499' : '₹399'}
                    </span>
                    <span className="text-[#15803D] font-bold">FREE</span>
                  </span>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </section>

      {/* SECTION 3 (#replies): Know who’s coming, without 200 phone calls */}
      <section id="replies" className="mt-20 scroll-mt-20" aria-labelledby="replies-title">
        <h2 id="replies-title" className="display text-[28px] sm:text-[36px]">
          Know who’s coming, without 200 phone calls
        </h2>

        <ol className="mt-6 grid gap-5 sm:grid-cols-3">
          <li className="rounded-[22px] bg-white/80 p-5 ring-1 ring-[#EADFD8]">
            <span className="grid size-10 place-items-center rounded-full bg-[#FBE7EB] font-display text-[19px] font-semibold text-[#A3122F]">
              1
            </span>
            <h3 className="mt-3 text-[17px] font-semibold text-[#2A1316]">
              Every family, greeted by name
            </h3>
            <p className="mt-1.5 text-[15px] leading-[1.55] text-[#5B3E42]">
              The Sharmas see their own name and only the functions they&apos;re invited to. Keep
              the haldi for close family.
            </p>
          </li>

          <li className="rounded-[22px] bg-white/80 p-5 ring-1 ring-[#EADFD8]">
            <span className="grid size-10 place-items-center rounded-full bg-[#FBE7EB] font-display text-[19px] font-semibold text-[#A3122F]">
              2
            </span>
            <h3 className="mt-3 text-[17px] font-semibold text-[#2A1316]">
              Replies land on your WhatsApp
            </h3>
            <p className="mt-1.5 text-[15px] leading-[1.55] text-[#5B3E42]">
              Guests tap how many are coming to each function, and their reply comes straight to
              you.
            </p>
          </li>

          <li className="rounded-[22px] bg-white/80 p-5 ring-1 ring-[#EADFD8]">
            <span className="grid size-10 place-items-center rounded-full bg-[#FBE7EB] font-display text-[19px] font-semibold text-[#A3122F]">
              3
            </span>
            <h3 className="mt-3 text-[17px] font-semibold text-[#2A1316]">
              Your headcount, done
            </h3>
            <p className="mt-1.5 text-[15px] leading-[1.55] text-[#5B3E42]">
              The RSVP manager counts every family&apos;s reply as it comes in, with the numbers
              for every function ready for the caterer.
            </p>
          </li>
        </ol>

        {/* Live India-First Direct WhatsApp Guest RSVP Form */}
        <div
          id="rsvp-form"
          className="mt-8 rounded-[24px] bg-white p-5 sm:p-8 shadow-[0_14px_34px_rgba(42,19,22,0.08)] ring-1 ring-[#EADFD8]"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-[#EADFD8]">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#A3122F]">
                {isBirthday
                  ? phoneLang === 'en'
                    ? `Birthday RSVP for ${celebrantName}`
                    : `${celebrantName} के जन्मोत्सव · RSVP`
                  : phoneLang === 'en'
                    ? `RSVP for ${cleanGroom} & ${cleanBride}`
                    : `${cleanGroom} एवं ${cleanBride} · RSVP`}
              </p>
              <h3 className="mt-1 font-display text-[26px] sm:text-[30px] font-semibold text-[#2A1316]">
                {phoneLang === 'en' ? 'Confirm Your Attendance' : 'अपनी उपस्थिति दर्ज करें'}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold bg-emerald-50 text-[#15803D] border border-emerald-200">
                {rsvpCount > 0 ? `WhatsApp RSVP · ${rsvpCount} Logged` : 'Direct WhatsApp RSVP'}
              </span>
              {onOpenShareSuite && (
                <button
                  type="button"
                  onClick={() => onOpenShareSuite(activeTheme)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#EADFD8] bg-[#FBF6F3] px-3 py-1.5 text-xs font-semibold text-[#A3122F] hover:border-[#A3122F] cursor-pointer"
                >
                  <span>Open Caterer RSVP Manager →</span>
                </button>
              )}
            </div>
          </div>

          {!rsvpSubmitted ? (
            <form noValidate onSubmit={handleRsvpSubmit} className="mt-6 space-y-6">
              {/* Attendance Status Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRsvpStatus('attending')}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all cursor-pointer ${
                    rsvpStatus === 'attending'
                      ? 'border-[#15803D] bg-emerald-50/60 text-[#14532D] ring-1 ring-[#15803D]'
                      : 'border-[#EADFD8] bg-[#FBF6F3] text-[#5B3E42]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {phoneLang === 'en' ? 'Yes, Joyfully Attending' : 'हाँ, सपरिवार आ रहे हैं'}
                    </p>
                    <p className="text-xs opacity-80">
                      {phoneLang === 'en'
                        ? 'Select functions, headcount & meal preference'
                        : 'कार्यक्रम, संख्या व भोजन चुनें'}
                    </p>
                  </div>
                  <Check
                    className={`h-4 w-4 ${rsvpStatus === 'attending' ? 'opacity-100' : 'opacity-20'}`}
                  />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRsvpStatus('declined');
                    setRsvpErrors((prev) => ({ ...prev, events: undefined }));
                  }}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all cursor-pointer ${
                    rsvpStatus === 'declined'
                      ? 'border-[#2A1316] bg-[#F3EAE3] text-[#2A1316] ring-1 ring-[#2A1316]'
                      : 'border-[#EADFD8] bg-[#FBF6F3] text-[#5B3E42]'
                  }`}
                >
                  <div>
                    <p className="text-sm font-semibold">
                      {phoneLang === 'en'
                        ? 'Sending Warm Blessings (Can’t Make It)'
                        : 'हार्दिक शुभकामनाएँ (नहीं आ पाएंगे)'}
                    </p>
                    <p className="text-xs opacity-80">
                      {phoneLang === 'en'
                        ? 'Let the family know & send your Ashirwad'
                        : 'परिवार को सस्नेह आशीर्वाद भेजें'}
                    </p>
                  </div>
                  <Check
                    className={`h-4 w-4 ${rsvpStatus === 'declined' ? 'opacity-100' : 'opacity-20'}`}
                  />
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-12">
                {/* Guest Name */}
                <div className="sm:col-span-5">
                  <label
                    htmlFor="jharokha-rsvp-name"
                    className="block text-[13px] font-medium text-[#2A1316]"
                  >
                    {phoneLang === 'en' ? 'Guest / Family Name' : 'अतिथि / परिवार का नाम'}{' '}
                    <span className="text-[#A3122F]">*</span>
                  </label>
                  <input
                    id="jharokha-rsvp-name"
                    type="text"
                    value={rsvpName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRsvpName(val);
                      if (rsvpTouched.name || rsvpErrors.name) {
                        const err = validateGuestName(val, phoneLang);
                        setRsvpErrors((prev) => ({ ...prev, name: err || undefined }));
                      }
                    }}
                    onBlur={() => {
                      setRsvpTouched((t) => ({ ...t, name: true }));
                      const err = validateGuestName(rsvpName, phoneLang);
                      setRsvpErrors((prev) => ({ ...prev, name: err || undefined }));
                    }}
                    aria-invalid={Boolean(rsvpErrors.name)}
                    aria-describedby={rsvpErrors.name ? 'jharokha-rsvp-name-err' : undefined}
                    placeholder={
                      phoneLang === 'en' ? 'e.g. Sharma Family / Ananya Verma' : 'जैसे शर्मा परिवार'
                    }
                    className={`mt-1.5 w-full rounded-xl bg-[#FBF6F3] px-3.5 py-2.5 text-[15px] text-[#2A1316] placeholder:text-[#896B6F] focus:outline-none border transition-colors ${
                      rsvpErrors.name
                        ? 'border-[#B91C1C] ring-1 ring-[#FCA5A5] focus:border-[#B91C1C]'
                        : 'border-[#EADFD8] focus:border-[#A3122F]'
                    }`}
                  />
                  {rsvpErrors.name && (
                    <p
                      id="jharokha-rsvp-name-err"
                      role="alert"
                      className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-[#B91C1C]"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{rsvpErrors.name}</span>
                    </p>
                  )}
                </div>

                {/* Contact / Phone Number (Optional — like nimantran.page & saath.studio) */}
                <div className={rsvpStatus === 'attending' ? 'sm:col-span-4' : 'sm:col-span-7'}>
                  <label
                    htmlFor="jharokha-rsvp-contact"
                    className="block text-[13px] font-medium text-[#2A1316]"
                  >
                    {phoneLang === 'en'
                      ? 'WhatsApp / Mobile (Optional)'
                      : 'व्हाट्सएप / फ़ोन (वैकल्पिक)'}
                  </label>
                  <input
                    id="jharokha-rsvp-contact"
                    type="tel"
                    inputMode="tel"
                    value={rsvpContact}
                    onChange={(e) => {
                      const val = e.target.value;
                      setRsvpContact(val);
                      if (rsvpTouched.contact || rsvpErrors.contact) {
                        const err = validateGuestContact(val, phoneLang);
                        setRsvpErrors((prev) => ({ ...prev, contact: err || undefined }));
                      }
                    }}
                    onBlur={() => {
                      setRsvpTouched((t) => ({ ...t, contact: true }));
                      const err = validateGuestContact(rsvpContact, phoneLang);
                      setRsvpErrors((prev) => ({ ...prev, contact: err || undefined }));
                    }}
                    aria-invalid={Boolean(rsvpErrors.contact)}
                    aria-describedby={rsvpErrors.contact ? 'jharokha-rsvp-contact-err' : undefined}
                    placeholder={
                      phoneLang === 'en'
                        ? '+91 98765 43210 (Optional)'
                        : '+91 98765 43210 (वैकल्पिक)'
                    }
                    className={`mt-1.5 w-full rounded-xl bg-[#FBF6F3] px-3.5 py-2.5 text-[15px] text-[#2A1316] placeholder:text-[#896B6F] focus:outline-none border transition-colors ${
                      rsvpErrors.contact
                        ? 'border-[#B91C1C] ring-1 ring-[#FCA5A5] focus:border-[#B91C1C]'
                        : 'border-[#EADFD8] focus:border-[#A3122F]'
                    }`}
                  />
                  {rsvpErrors.contact && (
                    <p
                      id="jharokha-rsvp-contact-err"
                      role="alert"
                      className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-[#B91C1C]"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{rsvpErrors.contact}</span>
                    </p>
                  )}
                </div>

                {/* Guests Attending Stepper (up to 15) */}
                {rsvpStatus === 'attending' && (
                  <div className="sm:col-span-3">
                    <span className="block text-[13px] font-medium text-[#2A1316]">
                      {phoneLang === 'en' ? 'Guests Attending' : 'अतिथि संख्या'}
                    </span>
                    <div className="mt-1.5 flex items-center justify-between rounded-xl border border-[#EADFD8] bg-[#FBF6F3] px-3 py-1.5">
                      <button
                        type="button"
                        onClick={() => setRsvpGuestCount((c) => Math.max(1, c - 1))}
                        aria-label="Decrease guest count"
                        className="grid size-8 place-items-center rounded-lg text-[#2A1316] hover:bg-[#EADFD8]/60 cursor-pointer"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="font-display text-2xl font-semibold tabular-nums text-[#2A1316]">
                        {rsvpGuestCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setRsvpGuestCount((c) => Math.min(15, c + 1))}
                        aria-label="Increase guest count"
                        className="grid size-8 place-items-center rounded-lg text-[#2A1316] hover:bg-[#EADFD8]/60 cursor-pointer"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Parivar Side + Indian Dietary Preference */}
              <div className="grid gap-5 sm:grid-cols-2">
                {!isBirthday && (
                  <div>
                    <span className="block text-[13px] font-medium text-[#2A1316] mb-1.5">
                      {phoneLang === 'en' ? 'Invited By Side' : 'परिवार पक्ष'}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: 'groom', en: 'Ladkewale', hi: 'वर पक्ष' },
                          { id: 'bride', en: 'Ladkiwale', hi: 'वधू पक्ष' },
                          { id: 'both', en: 'Friends', hi: 'मित्रगण' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setRsvpSide(opt.id)}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                            rsvpSide === opt.id
                              ? 'border-[#A3122F] bg-[#FBE7EB]/50 text-[#A3122F]'
                              : 'border-[#EADFD8] bg-[#FBF6F3] text-[#5B3E42]'
                          }`}
                        >
                          {phoneLang === 'en' ? opt.en : opt.hi}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {rsvpStatus === 'attending' && (
                  <div className={isBirthday ? 'sm:col-span-2' : ''}>
                    <span className="block text-[13px] font-medium text-[#2A1316] mb-1.5">
                      {phoneLang === 'en'
                        ? 'Meal Preference (For Caterer)'
                        : 'भोजन पसंद (कैटरर हेतु)'}
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {(
                        [
                          { id: 'pure_veg', en: 'Pure Veg', hi: 'शुद्ध शाकाहारी' },
                          { id: 'jain', en: 'Jain Food', hi: 'जैन (बिना प्याज-लहसुन)' },
                          { id: 'veg_nonveg', en: 'Veg + Non-Veg', hi: 'वेज / नॉन-वेज' },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setRsvpDiet(opt.id)}
                          className={`rounded-xl border px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                            rsvpDiet === opt.id
                              ? 'border-[#15803D] bg-emerald-50/70 text-[#15803D]'
                              : 'border-[#EADFD8] bg-[#FBF6F3] text-[#5B3E42]'
                          }`}
                        >
                          {phoneLang === 'en' ? opt.en : opt.hi}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Ceremonies Attending */}
              {rsvpStatus === 'attending' && (
                <div>
                  <span className="block text-[13px] font-medium text-[#2A1316]">
                    {phoneLang === 'en' ? 'Functions Attending' : 'सम्मिलित होने वाले कार्यक्रम'}{' '}
                    <span className="text-[#A3122F]">*</span>
                  </span>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {activeEvents.map((ceremony) => {
                      const checked = rsvpEvents.includes(ceremony.id);
                      return (
                        <button
                          key={ceremony.id}
                          type="button"
                          onClick={() => toggleRsvpEvent(ceremony.id)}
                          aria-pressed={checked}
                          className={`flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
                            checked
                              ? 'border-[#A3122F] bg-[#FBE7EB]/45 text-[#2A1316]'
                              : 'border-[#EADFD8] bg-[#FBF6F3] text-[#5B3E42] hover:border-[#C88A2B]'
                          }`}
                        >
                          <span
                            className={`grid size-4.5 shrink-0 place-items-center rounded border ${
                              checked
                                ? 'border-[#A3122F] bg-[#A3122F] text-white'
                                : 'border-[#B8A586] bg-white'
                            }`}
                          >
                            {checked && <Check className="h-3 w-3" />}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13.5px] font-semibold leading-tight truncate">
                              {ceremony.title[phoneLang]}
                            </p>
                            <p className="text-[11px] text-[#896B6F] truncate">{ceremony.time}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  {rsvpErrors.events && (
                    <p
                      role="alert"
                      className="mt-1.5 flex items-center gap-1.5 text-[12.5px] font-medium text-[#B91C1C]"
                    >
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      <span>{rsvpErrors.events}</span>
                    </p>
                  )}
                </div>
              )}

              {/* Outstation Arrival & Blessing Note + Submit */}
              <div className="grid gap-4 sm:grid-cols-12 items-end pt-2 border-t border-[#EADFD8]">
                {rsvpStatus === 'attending' && (
                  <div className="sm:col-span-5">
                    <label
                      htmlFor="jharokha-rsvp-arrival"
                      className="block text-[13px] font-medium text-[#2A1316]"
                    >
                      {phoneLang === 'en'
                        ? 'Arrival / Stay / Pickup (Optional)'
                        : 'आगमन / होटल / पिकअप (वैकल्पिक)'}
                    </label>
                    <input
                      id="jharokha-rsvp-arrival"
                      type="text"
                      value={rsvpArrival}
                      onChange={(e) => setRsvpArrival(e.target.value)}
                      maxLength={120}
                      placeholder={
                        phoneLang === 'en'
                          ? 'e.g. Arriving 12 Nov morning · 1 hotel room needed'
                          : 'जैसे 12 नवम्बर प्रातः आगमन · 1 कमरा चाहिए'
                      }
                      className="mt-1.5 w-full rounded-xl border border-[#EADFD8] bg-[#FBF6F3] px-3.5 py-2.5 text-[14.5px] text-[#2A1316] placeholder:text-[#896B6F] focus:border-[#A3122F] focus:outline-none"
                    />
                  </div>
                )}

                <div className={rsvpStatus === 'attending' ? 'sm:col-span-4' : 'sm:col-span-9'}>
                  <label
                    htmlFor="jharokha-rsvp-note"
                    className="block text-[13px] font-medium text-[#2A1316]"
                  >
                    {phoneLang === 'en' ? 'Ashirwad / Note (Optional)' : 'शुभकामना संदेश (वैकल्पिक)'}
                  </label>
                  <input
                    id="jharokha-rsvp-note"
                    type="text"
                    value={rsvpNote}
                    onChange={(e) => setRsvpNote(e.target.value)}
                    maxLength={240}
                    placeholder={
                      phoneLang === 'en'
                        ? 'Heartiest congratulations to both families!'
                        : 'दोनों परिवारों को हार्दिक बधाइयाँ!'
                    }
                    className="mt-1.5 w-full rounded-xl border border-[#EADFD8] bg-[#FBF6F3] px-3.5 py-2.5 text-[14.5px] text-[#2A1316] placeholder:text-[#896B6F] focus:border-[#A3122F] focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <button
                    type="submit"
                    disabled={rsvpSubmitting}
                    className="btn btn-primary w-full gap-2 disabled:opacity-60"
                  >
                    <CalendarCheck2 className="h-4 w-4" />
                    <span>
                      {rsvpSubmitting
                        ? phoneLang === 'en'
                          ? 'Saving...'
                          : 'सेव हो रहा है...'
                        : rsvpStatus === 'declined'
                          ? phoneLang === 'en'
                            ? 'Send Blessings'
                            : 'आशीर्वाद भेजें'
                          : phoneLang === 'en'
                            ? 'Confirm RSVP'
                            : 'RSVP की पुष्टि करें'}
                    </span>
                  </button>
                </div>
              </div>

              {rsvpSubmitError && (
                <p role="alert" className="text-sm font-medium text-[#B91C1C] flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{rsvpSubmitError}</span>
                </p>
              )}
            </form>
          ) : (
            <div className="mt-6 rounded-2xl border border-[#E0A100]/55 bg-[#FBF6F3] p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[12px] font-semibold text-emerald-800">
                      <Check className="h-3.5 w-3.5" />
                      <span>
                        {phoneLang === 'en'
                          ? 'Ready to Send on WhatsApp'
                          : 'व्हाट्सएप पर भेजने के लिए तैयार'}
                      </span>
                    </span>
                  </div>
                  <h4 className="mt-2 font-display text-[26px] font-semibold text-[#2A1316]">
                    {phoneLang === 'en'
                      ? `Thank you, ${rsvpName.trim()}!`
                      : `धन्यवाद, ${rsvpName.trim()}!`}
                  </h4>
                  <p className="mt-1 text-[14.5px] text-[#5B3E42]">
                    {rsvpStatus === 'declined'
                      ? phoneLang === 'en'
                        ? `Blessings recorded${rsvpContact.trim() ? ` · Contact: ${rsvpContact.trim()}` : ''}`
                        : `आशीर्वाद दर्ज${rsvpContact.trim() ? ` · संपर्क: ${rsvpContact.trim()}` : ''}`
                      : phoneLang === 'en'
                        ? `${rsvpGuestCount} guest(s) · ${dietDisplay} · ${sideDisplay} · Functions: ${selectedEventTitles}`
                        : `${rsvpGuestCount} अतिथि · ${dietDisplay} · कार्यक्रम: ${selectedEventTitles}`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <a
                    href={`https://wa.me/${hostWhatsappDigits}?text=${whatsappReplyText}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#2F6B4F] px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#25553E]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>
                      {phoneLang === 'en' ? 'Send on WhatsApp' : 'व्हाट्सएप पर भेजें'}
                    </span>
                  </a>
                  {onOpenShareSuite && (
                    <button
                      type="button"
                      onClick={() => onOpenShareSuite(activeTheme)}
                      className="chip"
                    >
                      View in RSVP Manager →
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setRsvpSubmitted(false)}
                    className="chip"
                  >
                    {phoneLang === 'en' ? 'Edit reply' : 'संशोधित करें'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: Mix and match across your functions */}
      <section className="mt-20" aria-labelledby="more-title">
        <h2 id="more-title" className="display text-[26px] sm:text-[30px]">
          Mix and match across your functions (All 100% Free)
        </h2>
        <p className="mt-2 max-w-[36rem] text-[16px] leading-[1.55] text-[#5B3E42]">
          A sunny Pichwai haldi, a Sheesh Mahal sangeet and a Jharokha wedding—every card has its price crossed out and is unlocked for ₹0.
        </p>

        <div className="no-scrollbar -mx-4 mt-5 flex snap-x gap-4 overflow-x-auto px-4 pb-2">
          {otherThemes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onSelectTheme(t);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="group w-[155px] shrink-0 snap-start text-left sm:w-[190px] cursor-pointer"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[16px] shadow-[0_10px_28px_rgba(42,19,22,0.14)]">
                <img
                  src={t.image}
                  alt={t.name}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/75 to-transparent flex items-end justify-between p-3">
                  <span className="text-[11px] font-medium text-white">Try live →</span>
                  <span className="text-[11px] font-semibold tabular-nums text-[#FDE68A]">
                    <span className="line-through opacity-75 mr-1">{t.originalPrice}</span>
                    FREE
                  </span>
                </div>
              </div>
              <span className="mt-2.5 block font-display text-[19px] font-semibold text-[#2A1316] group-hover:text-[#A3122F] truncate">
                {t.name}
              </span>
              <span className="block text-[12px] tabular-nums text-[#5B3E42]">
                <span className="line-through opacity-70 mr-1.5">{t.originalPrice}</span>
                <strong className="text-[#15803D]">FREE (₹0)</strong>
              </span>
              <span className="block text-[13px] leading-5 text-[#5B3E42] truncate">
                {t.gestureLabel}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Fixed Mobile Bottom Create & Share Invite Bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-[#FBF6F3] via-[#FBF6F3]/95 to-transparent px-4 pt-3 pb-safe lg:hidden">
        <div className="mx-auto max-w-[560px] flex items-center gap-2">
          <button
            type="button"
            onClick={handleCreateInviteClick}
            className="btn btn-primary flex-1 shadow-[0_10px_30px_rgba(163,18,47,0.3)]"
          >
            Create Free Invite (₹0)
          </button>
          {onOpenShareSuite && (
            <button
              type="button"
              onClick={() => onOpenShareSuite(activeTheme)}
              aria-label="Publish and Share Invite"
              className="inline-flex h-[52px] items-center gap-1.5 rounded-full bg-[#1F6E4A] px-4 text-sm font-semibold text-white shadow-lg cursor-pointer shrink-0"
            >
              <Share2 className="h-4 w-4" />
              <span>Share</span>
            </button>
          )}
        </div>
      </div>

      {/* Stationery Piece Preview Modal */}
      <StationeryPieceModal
        piece={activePiece}
        onClose={() => setActivePiece(null)}
        groomName={isBirthday ? celebrantName : cleanGroom}
        brideName={cleanBride}
        weddingDateLabel={effectiveDateLabel}
        cityLabel={effectiveCityLabel}
        lang={phoneLang}
        onToggleLang={() => setPhoneLang((l) => (l === 'en' ? 'hi' : 'en'))}
        themeId={activeTheme.id}
        themeName={activeTheme.name}
      />
    </>
  );
};
