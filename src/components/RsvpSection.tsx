import React, { useEffect, useState } from 'react';
import { Check, Minus, Plus, MessageCircle, CalendarCheck2, AlertCircle } from 'lucide-react';
import {
  CeremonyId,
  CeremonyItem,
  FamilyGuestProfile,
  Language,
} from '../data/weddingData';
import { JharokhaCrest } from './JharokhaMotifs';
import {
  validateGuestName,
  validateGuestContact,
  validateRsvpForm,
  RsvpValidationErrors,
} from '../utils/rsvpValidation';

interface RsvpSectionProps {
  language: Language;
  activeFamily: FamilyGuestProfile;
  invitedCeremonies: CeremonyItem[];
  preselectedCeremonyId: CeremonyId | null;
  groomName: string;
  brideName: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  language,
  activeFamily,
  invitedCeremonies,
  preselectedCeremonyId,
  groomName,
  brideName,
}) => {
  const [guestName, setGuestName] = useState(activeFamily.familyName.en);
  const [guestContact, setGuestContact] = useState('');
  const [guestCount, setGuestCount] = useState(activeFamily.defaultGuests);
  const [selectedEvents, setSelectedEvents] = useState<CeremonyId[]>(
    activeFamily.invitedCeremonies,
  );
  const [dietary, setDietary] = useState<'veg' | 'jain' | 'banquet'>('veg');
  const [arrivalNote, setArrivalNote] = useState('');
  const [blessingNote, setBlessingNote] = useState('');
  const [errors, setErrors] = useState<RsvpValidationErrors>({});
  const [touched, setTouched] = useState<{ name?: boolean; contact?: boolean }>({});
  const [submitted, setSubmitted] = useState(false);

  // Sync defaults when family profile changes
  useEffect(() => {
    setGuestName(activeFamily.familyName[language]);
    setGuestCount(activeFamily.defaultGuests);
    setSelectedEvents(activeFamily.invitedCeremonies);
    setErrors({});
    setSubmitted(false);
  }, [activeFamily, language]);

  // Ensure clicked ceremony from card back is checked
  useEffect(() => {
    if (preselectedCeremonyId && !selectedEvents.includes(preselectedCeremonyId)) {
      setSelectedEvents((prev) => [...prev, preselectedCeremonyId]);
    }
  }, [preselectedCeremonyId, selectedEvents]);

  const toggleEvent = (id: CeremonyId) => {
    setSelectedEvents((prev) => {
      const next = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
      if (next.length > 0 && errors.events) {
        setErrors((err) => ({ ...err, events: undefined }));
      }
      return next;
    });
  };

  const runValidation = () => {
    setTouched({ name: true, contact: true });
    const result = validateRsvpForm({
      name: guestName,
      contact: guestContact,
      selectedEventsCount: selectedEvents.length,
      lang: language,
    });
    setErrors(result.errors);
    return result.isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!runValidation()) return;
    setSubmitted(true);
  };

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!runValidation()) {
      e.preventDefault();
    }
  };

  const selectedTitles = invitedCeremonies
    .filter((c) => selectedEvents.includes(c.id))
    .map((c) => c.title[language])
    .join(', ');

  const whatsappMessage = encodeURIComponent(
    `Namaste! RSVP for ${groomName} & ${brideName}'s Wedding:\nFamily/Guest: ${guestName.trim()}\nContact: ${guestContact.trim()}\nGuests Attending: ${guestCount}\nFunctions: ${selectedTitles || 'None'}\nDietary: ${dietary.toUpperCase()}${
      arrivalNote ? `\nArrival: ${arrivalNote}` : ''
    }${blessingNote ? `\nBlessings: ${blessingNote}` : ''}`,
  );

  const groomInitial = (groomName.trim()[0] || 'A').toUpperCase();
  const brideInitial = (brideName.trim()[0] || 'M').toUpperCase();

  return (
    <section
      id="rsvp"
      className="bg-[#FAF6EE] py-20 sm:py-28 px-6 border-t border-[#D8C8AA]"
    >
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <p className="text-xs tracking-[0.22em] uppercase text-[#9E2A2B] font-medium">
            {language === 'en' ? 'Kindly Reply · By 25 October 2026' : 'कृपया उत्तर दें · 25 अक्टूबर 2026 तक'}
          </p>
          <h2 className="mt-2 font-display text-4xl sm:text-5xl font-semibold text-[#231B15]">
            {language === 'en' ? 'Confirm Your Presence' : 'अपनी उपस्थिति की पुष्टि करें'}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#5C4B3D] max-w-xl mx-auto">
            {language === 'en'
              ? 'Select the ceremonies your family will attend, or send your confirmation directly to our wedding concierge on WhatsApp.'
              : 'कृपया उन कार्यक्रमों का चयन करें जिनमें आप सम्मिलित होंगे, अथवा सीधे व्हाट्सएप पर अपनी स्वीकृति भेजें।'}
          </p>
        </div>

        {!submitted ? (
          <form
            noValidate
            onSubmit={handleSubmit}
            className="mt-10 rounded-xl border border-[#C88A2B]/50 bg-[#F7F1E3] paper-grain p-6 sm:p-10 shadow-sm space-y-8"
          >
            {/* Guest Name, Contact Number & Headcount Stepper */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
              <div className="sm:col-span-5">
                <label
                  htmlFor="rsvp-name"
                  className="block text-xs font-medium tracking-wider uppercase text-[#5C4B3D]"
                >
                  {language === 'en' ? 'Guest / Family Name' : 'अतिथि / परिवार का नाम'}{' '}
                  <span className="text-[#9E2A2B]">*</span>
                </label>
                <input
                  id="rsvp-name"
                  type="text"
                  value={guestName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGuestName(val);
                    if (touched.name || errors.name) {
                      const err = validateGuestName(val, language);
                      setErrors((prev) => ({ ...prev, name: err || undefined }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, name: true }));
                    const err = validateGuestName(guestName, language);
                    setErrors((prev) => ({ ...prev, name: err || undefined }));
                  }}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? 'rsvp-name-error' : undefined}
                  placeholder={language === 'en' ? 'e.g. Kapoor Family' : 'जैसे कपूर परिवार'}
                  className={`mt-2 w-full rounded-lg border bg-[#FAF6EE] px-4 py-3 text-sm text-[#231B15] focus:outline-none ${
                    errors.name
                      ? 'border-[#B91C1C] ring-1 ring-[#FCA5A5] focus:border-[#B91C1C]'
                      : 'border-[#C8B493] focus:border-[#9E2A2B]'
                  }`}
                />
                {errors.name && (
                  <p
                    id="rsvp-name-error"
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#B91C1C]"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.name}</span>
                  </p>
                )}
              </div>

              <div className="sm:col-span-4">
                <label
                  htmlFor="rsvp-contact"
                  className="block text-xs font-medium tracking-wider uppercase text-[#5C4B3D]"
                >
                  {language === 'en'
                    ? 'Contact / WhatsApp Number'
                    : 'संपर्क / व्हाट्सएप नंबर'}{' '}
                  <span className="text-[#9E2A2B]">*</span>
                </label>
                <input
                  id="rsvp-contact"
                  type="tel"
                  inputMode="tel"
                  value={guestContact}
                  onChange={(e) => {
                    const val = e.target.value;
                    setGuestContact(val);
                    if (touched.contact || errors.contact) {
                      const err = validateGuestContact(val, language);
                      setErrors((prev) => ({ ...prev, contact: err || undefined }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((t) => ({ ...t, contact: true }));
                    const err = validateGuestContact(guestContact, language);
                    setErrors((prev) => ({ ...prev, contact: err || undefined }));
                  }}
                  aria-invalid={Boolean(errors.contact)}
                  aria-describedby={errors.contact ? 'rsvp-contact-error' : undefined}
                  placeholder="+91 98765 43210"
                  className={`mt-2 w-full rounded-lg border bg-[#FAF6EE] px-4 py-3 text-sm text-[#231B15] placeholder:text-[#9D8B74] focus:outline-none ${
                    errors.contact
                      ? 'border-[#B91C1C] ring-1 ring-[#FCA5A5] focus:border-[#B91C1C]'
                      : 'border-[#C8B493] focus:border-[#9E2A2B]'
                  }`}
                />
                {errors.contact && (
                  <p
                    id="rsvp-contact-error"
                    role="alert"
                    className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#B91C1C]"
                  >
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.contact}</span>
                  </p>
                )}
              </div>

              <div className="sm:col-span-3">
                <span className="block text-xs font-medium tracking-wider uppercase text-[#5C4B3D]">
                  {language === 'en' ? 'Guests Attending' : 'कुल अतिथि संख्या'}
                </span>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2">
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                    aria-label="Decrease guests"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md text-[#231B15] hover:bg-[#F2EAD9] cursor-pointer"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-display text-2xl font-semibold tabular-nums text-[#231B15]">
                    {guestCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestCount((c) => Math.min(8, c + 1))}
                    aria-label="Increase guests"
                    className="h-8 w-8 inline-flex items-center justify-center rounded-md text-[#231B15] hover:bg-[#F2EAD9] cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Function-by-Function Ceremony Selection */}
            <div className="border-t border-[#D8C8AA] pt-6">
              <span className="block text-xs font-medium tracking-wider uppercase text-[#5C4B3D]">
                {language === 'en'
                  ? `Invited Ceremonies (${activeFamily.familyName.en})`
                  : `आमंत्रित कार्यक्रम (${activeFamily.familyName.hi})`}
              </span>
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {invitedCeremonies.map((ceremony) => {
                  const checked = selectedEvents.includes(ceremony.id);
                  return (
                    <button
                      key={ceremony.id}
                      type="button"
                      onClick={() => toggleEvent(ceremony.id)}
                      className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors cursor-pointer ${
                        checked
                          ? 'border-[#9E2A2B] bg-[#FAF6EE]'
                          : 'border-[#D8C8AA] bg-[#FAF6EE]/50 hover:bg-[#FAF6EE]'
                      }`}
                    >
                      <span
                        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                          checked
                            ? 'border-[#9E2A2B] bg-[#9E2A2B] text-[#FAF6EE]'
                            : 'border-[#B8A586] bg-white'
                        }`}
                      >
                        {checked && <Check className="h-3.5 w-3.5" />}
                      </span>
                      <div>
                        <p className="font-display text-lg font-semibold text-[#231B15] leading-snug">
                          {ceremony.title[language]}
                        </p>
                        <p className="mt-0.5 text-xs text-[#6D5A49]">
                          {ceremony.date[language]} · {ceremony.time}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              {errors.events && (
                <p
                  role="alert"
                  className="mt-2 flex items-center gap-1.5 text-xs font-medium text-[#B91C1C]"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  <span>{errors.events}</span>
                </p>
              )}
            </div>

            {/* Dietary & Arrival Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-[#D8C8AA] pt-6">
              <div>
                <span className="block text-xs font-medium tracking-wider uppercase text-[#5C4B3D]">
                  {language === 'en' ? 'Dining Preference' : 'भोजन प्राथमिकता'}
                </span>
                <div className="mt-2 inline-flex w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] p-1">
                  {[
                    { id: 'veg', label: { en: 'Pure Veg', hi: 'शाकाहारी' } },
                    { id: 'jain', label: { en: 'Jain', hi: 'जैन' } },
                    { id: 'banquet', label: { en: 'Royal Feast', hi: 'राजसी भोज' } },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setDietary(opt.id as 'veg' | 'jain' | 'banquet')}
                      className={`flex-1 rounded-md py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap ${
                        dietary === opt.id
                          ? 'bg-[#231B15] text-[#FAF6EE]'
                          : 'text-[#5C4B3D] hover:text-[#231B15]'
                      }`}
                    >
                      {opt.label[language]}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="rsvp-arrival"
                  className="block text-xs font-medium tracking-wider uppercase text-[#5C4B3D]"
                >
                  {language === 'en'
                    ? 'Flight / Arrival Time (Optional)'
                    : 'उड़ान / आगमन समय (वैकल्पिक)'}
                </label>
                <input
                  id="rsvp-arrival"
                  type="text"
                  value={arrivalNote}
                  onChange={(e) => setArrivalNote(e.target.value)}
                  placeholder={
                    language === 'en' ? 'e.g. 12 Nov, 9:30 AM Indigo' : 'जैसे 12 नवम्बर, प्रातः 9:30'
                  }
                  className="mt-2 w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-4 py-2.5 text-sm text-[#231B15] placeholder:text-[#9D8B74] focus:border-[#9E2A2B] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="rsvp-blessing"
                className="block text-xs font-medium tracking-wider uppercase text-[#5C4B3D]"
              >
                {language === 'en'
                  ? 'Blessings or Note for the Couple'
                  : 'वर-वधू के लिए आशीर्वचन'}
              </label>
              <textarea
                id="rsvp-blessing"
                rows={2}
                value={blessingNote}
                onChange={(e) => setBlessingNote(e.target.value)}
                placeholder={
                  language === 'en'
                    ? 'Wishing you a lifetime of joy and togetherness...'
                    : 'सुखमय एवं मंगलमय दांपत्य जीवन की शुभकामनाएँ...'
                }
                className="mt-2 w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-4 py-2.5 text-sm text-[#231B15] placeholder:text-[#9D8B74] focus:border-[#9E2A2B] focus:outline-none"
              />
            </div>

            {/* Submit & Direct WhatsApp Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-t border-[#D8C8AA] pt-6">
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#9E2A2B] px-7 py-3 text-sm font-medium text-[#FAF6EE] transition-colors hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0"
              >
                <CalendarCheck2 className="h-4 w-4" />
                <span>
                  {language === 'en' ? 'Confirm Invitation RSVP' : 'उपस्थिति की पुष्टि करें'}
                </span>
              </button>

              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleWhatsAppClick}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#2F6B4F]/45 bg-[#FAF6EE] px-5 py-3 text-sm font-medium text-[#2F6B4F] transition-colors hover:bg-[#2F6B4F] hover:text-white whitespace-nowrap shrink-0"
              >
                <MessageCircle className="h-4 w-4" />
                <span>
                  {language === 'en' ? 'Send via WhatsApp' : 'व्हाट्सएप पर भेजें'}
                </span>
              </a>
            </div>
          </form>
        ) : (
          /* Engraved Digital Keepsake Pass Confirmation */
          <div className="mt-10 rounded-xl border border-[#C88A2B] bg-[#F7F1E3] paper-grain p-8 sm:p-10 text-center shadow-md">
            <div className="flex justify-center">
              <JharokhaCrest
                groomInitial={groomInitial}
                brideInitial={brideInitial}
                size="md"
                tone="crimson"
              />
            </div>
            <p className="mt-3 text-xs tracking-[0.2em] uppercase text-[#9E2A2B]">
              {language === 'en' ? 'RSVP Recorded · Udaipur 2026' : 'स्वीकृति प्राप्त · उदयपुर 2026'}
            </p>
            <h3 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-[#231B15]">
              {language === 'en'
                ? `We await your arrival, ${guestName.trim()}`
                : `${guestName.trim()}, आपके स्वागत हेतु हम उत्सुक हैं`}
            </h3>
            <p className="mt-3 text-sm text-[#5C4B3D] max-w-lg mx-auto">
              {language === 'en'
                ? `Confirmed for ${guestCount} guest(s) (${guestContact.trim()}) attending: ${selectedTitles}.`
                : `${guestCount} अतिथियों (${guestContact.trim()}) हेतु पुष्टि: ${selectedTitles}।`}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#2F6B4F] px-5 py-2.5 text-xs font-medium text-white hover:bg-[#25553E] whitespace-nowrap shrink-0"
              >
                <MessageCircle className="h-4 w-4" />
                <span>
                  {language === 'en' ? 'Share Confirmation on WhatsApp' : 'व्हाट्सएप पर साझा करें'}
                </span>
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-5 py-2.5 text-xs font-medium text-[#231B15] hover:bg-[#EFE6D5] cursor-pointer whitespace-nowrap shrink-0"
              >
                {language === 'en' ? 'Edit RSVP Details' : 'विवरण संशोधित करें'}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
