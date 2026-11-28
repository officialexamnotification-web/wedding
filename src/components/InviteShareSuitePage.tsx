import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  ExternalLink,
  Globe2,
  HeartHandshake,
  Link2,
  MapPin,
  Maximize2,
  MessageCircle,
  Minus,
  Music,
  Plus,
  QrCode,
  Search,
  Share2,
  SlidersHorizontal,
  Star,
  Trash2,
  UserPlus,
  Users,
  Utensils,
} from 'lucide-react';
import { InviteTheme, STUDIO_THEMES } from '../data/studioData';
import {
  BIRTHDAY_STAR_PORTRAIT_IMAGE,
  Language,
  ROYAL_COUPLE_PORTRAIT_IMAGE,
} from '../data/weddingData';
import {
  CardCustomization,
  encodeShareUrl,
  getTemplateCanonicalUrl,
  SITE_DOMAIN,
} from '../data/cardCustomization';
import {
  downloadMonogramPng,
  downloadPrintedQrCardPng,
  downloadSaveTheDatePng,
  downloadWelcomeBoardPng,
  generateInviteQrDataUrl,
} from '../utils/inviteExport';
import {
  AttendanceStatus,
  DietaryPreference,
  FamilySide,
  RsvpRecord,
  RsvpSubmissionInput,
} from '../utils/rsvpStore';
import {
  normalizeIndianWhatsappDigits,
  validateRsvpForm,
} from '../utils/rsvpValidation';
import { InteractiveInvitePhoneStage } from './InteractiveInvitePhoneStage';
import { JharokhaCrest } from './JharokhaMotifs';
import { getMonogramMeta } from './TemplateMonograms';

interface InviteShareSuitePageProps {
  theme: InviteTheme;
  customization: CardCustomization;
  onUpdateCustomization: (themeId: string, next: CardCustomization) => void;
  onBackToThemePage: (theme: InviteTheme) => void;
  onSelectTheme: (theme: InviteTheme) => void;
  onOpenCustomizer: (theme: InviteTheme) => void;
  onOpenFullPreview: (theme: InviteTheme, lang: Language) => void;
  rsvpRecords?: RsvpRecord[];
  onSubmitRsvp?: (input: RsvpSubmissionInput) => Promise<RsvpRecord>;
  onDeleteRsvp?: (rsvpId: string) => Promise<void>;
}

export const InviteShareSuitePage: React.FC<InviteShareSuitePageProps> = ({
  theme,
  customization,
  onUpdateCustomization,
  onBackToThemePage,
  onSelectTheme,
  onOpenCustomizer,
  onOpenFullPreview,
  rsvpRecords = [],
  onSubmitRsvp,
  onDeleteRsvp,
}) => {
  const [phoneLang, setPhoneLang] = useState<Language>('en');
  const [previewSide, setPreviewSide] = useState<'groom' | 'bride'>(
    customization.familySide === 'bride-first' ? 'bride' : 'groom'
  );
  const [guestFamilyInput, setGuestFamilyInput] = useState('Sharma Parivar');
  const [selectedEventIds, setSelectedEventIds] = useState<string[]>(() =>
    customization.events.map((e) => e.id)
  );
  const [applyParivarToPhone, setApplyParivarToPhone] = useState(false);

  const [copiedTarget, setCopiedTarget] = useState<string | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [exportingAsset, setExportingAsset] = useState<string | null>(null);
  const [showUrlDirectory, setShowUrlDirectory] = useState(false);
  const [urlSearch, setUrlSearch] = useState('');

  // Live RSVP Manager Filter & Manual Elder Entry State
  const [rsvpFilter, setRsvpFilter] = useState<'all' | 'attending' | 'declined' | 'jain' | 'arrival'>('all');
  const [rsvpSearch, setRsvpSearch] = useState('');
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualStatus, setManualStatus] = useState<AttendanceStatus>('attending');
  const [manualCount, setManualCount] = useState(2);
  const [manualSide, setManualSide] = useState<FamilySide>('groom');
  const [manualDiet, setManualDiet] = useState<DietaryPreference>('pure_veg');
  const [manualEvents, setManualEvents] = useState<string[]>(() =>
    customization.events.map((e) => e.id)
  );
  const [manualArrival, setManualArrival] = useState('');
  const [manualNote, setManualNote] = useState('');
  const [manualError, setManualError] = useState<string | null>(null);
  const [manualSaving, setManualSaving] = useState(false);

  const isBirthday = theme.celebrationType === 'birthday';
  const rawGroom = customization.primaryName?.trim() || 'Aarav';
  const rawBride = customization.partnerName?.trim() || 'Meera';
  const groomFirstLabel = isBirthday ? rawGroom : `${rawGroom} & ${rawBride}`;
  const brideFirstLabel = isBirthday ? rawGroom : `${rawBride} & ${rawGroom}`;

  const groomInitial = rawGroom[0]?.toUpperCase() || 'A';
  const brideInitial = rawBride[0]?.toUpperCase() || 'M';
  const activeFirstInitial = !isBirthday && previewSide === 'bride' ? brideInitial : groomInitial;
  const activeSecondInitial = isBirthday
    ? '★'
    : previewSide === 'bride'
      ? groomInitial
      : brideInitial;
  const monogramMeta = useMemo(() => getMonogramMeta(theme.id), [theme.id]);

  // Keep event checkboxes synced when theme switches
  useEffect(() => {
    const allIds = customization.events.map((e) => e.id);
    setSelectedEventIds(allIds);
    setManualEvents(allIds);
    setPreviewSide(customization.familySide === 'bride-first' ? 'bride' : 'groom');
  }, [theme.id, customization.events, customization.familySide]);

  // Build clean URLs (Zero-login personalized invite URLs)
  const cleanTemplateUrl = useMemo(() => getTemplateCanonicalUrl(theme, false), [theme]);

  const personalizedMainUrl = useMemo(
    () =>
      encodeShareUrl(theme, customization, {
        side: isBirthday ? undefined : previewSide,
        useProductionOrigin: true,
      }),
    [theme, customization, previewSide, isBirthday]
  );

  const groomSideUrl = useMemo(
    () =>
      encodeShareUrl(theme, customization, {
        side: 'groom',
        useProductionOrigin: true,
      }),
    [theme, customization]
  );

  const brideSideUrl = useMemo(
    () =>
      encodeShareUrl(theme, customization, {
        side: 'bride',
        useProductionOrigin: true,
      }),
    [theme, customization]
  );

  const parivarUrl = useMemo(
    () =>
      encodeShareUrl(theme, customization, {
        side: isBirthday ? undefined : previewSide,
        guestFamily: guestFamilyInput.trim() || undefined,
        allowedEventIds: selectedEventIds,
        useProductionOrigin: true,
      }),
    [
      theme,
      customization,
      previewSide,
      guestFamilyInput,
      selectedEventIds,
      isBirthday,
    ]
  );

  // Scannable QR Code synced to current canonical/personalized URL
  useEffect(() => {
    let active = true;
    generateInviteQrDataUrl(personalizedMainUrl, '#2A1316', '#FFFFFF')
      .then((dataUrl) => {
        if (active) setQrDataUrl(dataUrl);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [personalizedMainUrl]);

  const effectivePhoneCustomization = useMemo<CardCustomization>(() => {
    return {
      ...customization,
      familySide: previewSide === 'bride' ? 'bride-first' : 'groom-first',
    };
  }, [customization, previewSide]);

  const firstEvent = customization.events[0];

  const handleCopy = async (text: string, targetId: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback ignored if clipboard permissions are tight
    }
    setCopiedTarget(targetId);
    window.setTimeout(() => {
      setCopiedTarget((curr) => (curr === targetId ? null : curr));
    }, 2200);
  };

  const buildWhatsappHref = (url: string, headerLabel: string, guestNote?: string) => {
    const line1 = isBirthday
      ? `Namaste! You are warmly invited to ${rawGroom}'s celebration (${theme.name}).`
      : `Namaste! You are warmly invited to the wedding of ${headerLabel}.`;
    const line2 = guestNote ? `\nPersonal invitation for: ${guestNote}` : '';
    const line3 = `\nDates: ${customization.dateLabel} · ${customization.cityLabel}`;
    const line4 = `\nTap to open your interactive NIMANTRAN invite:\n${url}`;
    return `https://wa.me/?text=${encodeURIComponent(`${line1}${line2}${line3}${line4}`)}`;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${groomFirstLabel} — NIMANTRAN`,
          text: isBirthday
            ? `You're invited to ${rawGroom}'s celebration on ${customization.dateLabel}`
            : `You're warmly invited to the wedding of ${groomFirstLabel} (${customization.dateLabel})`,
          url: personalizedMainUrl,
        });
        return;
      } catch {
        // User dismissed native share or unsupported; fall back to copy
      }
    }
    handleCopy(personalizedMainUrl, 'main-link');
  };

  const toggleParivarEvent = (eventId: string) => {
    setSelectedEventIds((prev) =>
      prev.includes(eventId)
        ? prev.length > 1
          ? prev.filter((id) => id !== eventId)
          : prev
        : [...prev, eventId]
    );
  };

  const handleDownloadAsset = async (
    kind: 'monogram' | 'qr-card' | 'save-date' | 'welcome-board'
  ) => {
    setExportingAsset(kind);
    try {
      const payload = {
        theme,
        custom: effectivePhoneCustomization,
        shareUrl: personalizedMainUrl,
        primaryName: previewSide === 'bride' && !isBirthday ? rawBride : rawGroom,
        partnerName: previewSide === 'bride' && !isBirthday ? rawGroom : rawBride,
        isBirthday,
      };
      if (kind === 'monogram') {
        await downloadMonogramPng(payload);
      } else if (kind === 'qr-card') {
        await downloadPrintedQrCardPng(payload);
      } else if (kind === 'save-date') {
        await downloadSaveTheDatePng(payload);
      } else {
        await downloadWelcomeBoardPng(payload);
      }
    } finally {
      setExportingAsset(null);
    }
  };

  const filteredDirectoryThemes = useMemo(() => {
    const q = urlSearch.trim().toLowerCase();
    if (!q) return STUDIO_THEMES;
    return STUDIO_THEMES.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.regionLabel.toLowerCase().includes(q)
    );
  }, [urlSearch]);

  // Real RSVP & Caterer Headcount Calculations
  const rsvpMetrics = useMemo(() => {
    const attendingRows = rsvpRecords.filter((r) => r.attendanceStatus === 'attending');
    const declinedRows = rsvpRecords.filter((r) => r.attendanceStatus === 'declined');
    const totalPlates = attendingRows.reduce((acc, r) => acc + (r.guestCount || 0), 0);

    const dietCounts = { pure_veg: 0, jain: 0, veg_nonveg: 0 };
    const sideCounts = { groom: 0, bride: 0, both: 0 };
    const eventCounts: Record<string, number> = {};
    customization.events.forEach((ev) => {
      eventCounts[ev.id] = 0;
    });

    attendingRows.forEach((r) => {
      const n = r.guestCount || 0;
      if (r.dietaryPreference === 'jain') dietCounts.jain += n;
      else if (r.dietaryPreference === 'veg_nonveg') dietCounts.veg_nonveg += n;
      else dietCounts.pure_veg += n;

      if (r.side === 'bride') sideCounts.bride += n;
      else if (r.side === 'both') sideCounts.both += n;
      else sideCounts.groom += n;

      r.eventIds.forEach((eid) => {
        eventCounts[eid] = (eventCounts[eid] || 0) + n;
      });
    });

    return {
      attendingFamilies: attendingRows.length,
      declinedFamilies: declinedRows.length,
      totalPlates,
      dietCounts,
      sideCounts,
      eventCounts,
    };
  }, [rsvpRecords, customization.events]);

  const filteredRsvps = useMemo(() => {
    const q = rsvpSearch.trim().toLowerCase();
    return rsvpRecords.filter((row) => {
      if (rsvpFilter === 'attending' && row.attendanceStatus !== 'attending') return false;
      if (rsvpFilter === 'declined' && row.attendanceStatus !== 'declined') return false;
      if (rsvpFilter === 'jain' && row.dietaryPreference !== 'jain') return false;
      if (rsvpFilter === 'arrival' && !row.arrivalInfo.trim()) return false;
      if (q) {
        return (
          row.guestName.toLowerCase().includes(q) ||
          row.guestPhone.toLowerCase().includes(q) ||
          row.arrivalInfo.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [rsvpRecords, rsvpFilter, rsvpSearch]);

  const handleSaveManualRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmitRsvp) return;
    setManualError(null);
    const { isValid, errors } = validateRsvpForm({
      name: manualName,
      contact: manualPhone,
      selectedEventsCount: manualEvents.length,
      attendanceStatus: manualStatus,
      lang: 'en',
    });
    if (!isValid) {
      setManualError(errors.name || errors.contact || errors.events || 'Please check details.');
      return;
    }
    setManualSaving(true);
    try {
      await onSubmitRsvp({
        guestName: manualName.trim(),
        guestPhone: manualPhone.trim(),
        attendanceStatus: manualStatus,
        guestCount: manualStatus === 'attending' ? manualCount : 0,
        side: manualSide,
        dietaryPreference: manualStatus === 'attending' ? manualDiet : 'no_preference',
        eventIds: manualStatus === 'attending' ? manualEvents : [],
        arrivalInfo: manualArrival.trim(),
        blessingNote: manualNote.trim(),
        source: 'host_manual',
      });
      setManualName('');
      setManualPhone('');
      setManualArrival('');
      setManualNote('');
      setShowManualForm(false);
    } catch (err) {
      setManualError(err instanceof Error ? err.message : 'Unable to add guest entry.');
    } finally {
      setManualSaving(false);
    }
  };

  const buildCatererSummaryText = () => {
    const title = isBirthday ? `${rawGroom}'s Celebration` : `${groomFirstLabel} Wedding`;
    const eventLines = customization.events
      .map((ev) => `• ${ev.titleEn}: ${rsvpMetrics.eventCounts[ev.id] || 0} plates`)
      .join('\n');
    return `NIMANTRAN Caterer & Guest Tally — ${title} (${customization.dateLabel}):\nTotal Confirmed Guests: ${rsvpMetrics.totalPlates} (${rsvpMetrics.attendingFamilies} families)\nPure Veg: ${rsvpMetrics.dietCounts.pure_veg} | Jain: ${rsvpMetrics.dietCounts.jain} | Veg+Non-Veg: ${rsvpMetrics.dietCounts.veg_nonveg}\nLadkewale: ${rsvpMetrics.sideCounts.groom} | Ladkiwale: ${rsvpMetrics.sideCounts.bride}\n\nFunction-wise Plates:\n${eventLines}`;
  };

  const handleDownloadRsvpCsv = () => {
    const headers = [
      'Guest/Family Name',
      'WhatsApp/Phone',
      'Status',
      'Guest Count',
      'Side',
      'Meal Preference',
      'Functions',
      'Arrival/Stay',
      'Blessing/Note',
    ];
    const escapeCsv = (val: string | number) =>
      `"${String(val).replace(/"/g, '""')}"`;
    const rows = rsvpRecords.map((r) => {
      const fnNames = customization.events
        .filter((ev) => r.eventIds.includes(ev.id))
        .map((ev) => ev.titleEn)
        .join(' | ');
      return [
        r.guestName,
        r.guestPhone,
        r.attendanceStatus === 'attending' ? 'Attending' : 'Blessings Only',
        r.guestCount,
        r.side,
        r.dietaryPreference,
        fnNames,
        r.arrivalInfo,
        r.blessingNote,
      ]
        .map(escapeCsv)
        .join(',');
    });
    const csv = [headers.map(escapeCsv).join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${theme.id}-rsvp-guest-list.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const rsvpPreviewRows =
    rsvpRecords.length > 0
      ? rsvpRecords.slice(0, 3).map((r) => ({
          name: r.guestName,
          count: r.attendanceStatus === 'attending' ? r.guestCount : 0,
        }))
      : [
          { name: 'No replies yet', count: 0 },
        ];

  return (
    <div className="bg-[#FAF6EE] text-[#2A1316] min-h-[calc(100dvh-64px)]">
      <div className="mx-auto max-w-[1220px] px-4 sm:px-6 pt-5 pb-24">
        {/* Top Back Navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#EADFD8]">
          <button
            type="button"
            onClick={() => onBackToThemePage(theme)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#5B3E42] hover:text-[#2A1316] cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to {theme.name}</span>
          </button>

          <div className="flex flex-wrap items-center gap-2 text-xs text-[#6D5A49]">
            <span className="font-mono text-[#2A1316]">{SITE_DOMAIN}/{theme.slug}</span>
            <span aria-hidden="true">·</span>
            <span className="font-semibold text-[#15803D]">100% Free Forever (₹0)</span>
          </div>
        </div>

        {/* Split Two-Column Publish & Share Workspace */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)] xl:grid-cols-[390px_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
          {/* LEFT COLUMN: STICKY TITANIUM IPHONE PREVIEW */}
          <aside className="lg:sticky lg:top-6 w-full max-w-[360px] mx-auto lg:max-w-none">
            <div className="@container relative">
              <div
                className="relative rounded-[15.8cqw] p-[0.85cqw]"
                style={{
                  background:
                    'linear-gradient(160deg, #6b6b70 0%, #3a3a3d 18%, #1d1d20 46%, #3a3a3d 70%, #6b6b70 100%)',
                  boxShadow:
                    'inset 0 0 0 0.2cqw #6b6b7066, inset 0 0.35cqw 0.5cqw rgba(255,255,255,0.18), 0 2.2cqw 4.5cqw -1cqw rgba(42,19,22,0.36)',
                }}
              >
                <div className="rounded-[14.95cqw] bg-black p-[1.75cqw]">
                  <div className="relative overflow-hidden rounded-[13.2cqw] bg-[#140F0B]">
                    {/* Announcement Strip matching Screenshot ("Today: Haldi at 10:30 am") */}
                    <div className="relative z-30 bg-[#92763A] px-4 pt-10 pb-1.5 text-center text-[10px] font-medium text-white truncate">
                      {firstEvent
                        ? `Today: ${firstEvent.titleEn} at ${firstEvent.time}`
                        : `${customization.dateLabel} · ${customization.cityLabel}`}
                    </div>

                    <div className="relative overflow-hidden" style={{ aspectRatio: '390 / 790' }}>
                      <InteractiveInvitePhoneStage
                        theme={theme}
                        lang={phoneLang}
                        groomName={rawGroom}
                        brideName={rawBride}
                        weddingDateLabel={customization.dateLabel}
                        cityLabel={customization.cityLabel}
                        compact={true}
                        customization={effectivePhoneCustomization}
                        guestFamilyGreeting={
                          applyParivarToPhone && guestFamilyInput.trim()
                            ? guestFamilyInput.trim()
                            : undefined
                        }
                        allowedEventIds={applyParivarToPhone ? selectedEventIds : undefined}
                        onSubmitRsvp={onSubmitRsvp}
                        onOpenCustomizer={() => onOpenCustomizer(theme)}
                        onOpenFullPreview={() => onOpenFullPreview(theme, phoneLang)}
                      />
                    </div>

                    {/* Dynamic Island Notch */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-[2cqw] left-1/2 z-40 h-[7.2cqw] w-[26cqw] -translate-x-1/2 rounded-full bg-black"
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-[13px] text-[#896B6F]">
              Tap doors or scroll inside to test guest view &amp; functions.
            </p>

            {/* Phone Controls: EN/HI + Side Toggle + Full Screen */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex gap-1 rounded-full bg-[#F3EAE3] p-1">
                <button
                  type="button"
                  onClick={() => setPhoneLang('en')}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium cursor-pointer transition-colors ${
                    phoneLang === 'en' ? 'bg-[#2A1316] text-white' : 'text-[#5B3E42]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setPhoneLang('hi')}
                  className={`rounded-full px-3.5 py-1 text-xs font-medium font-hindi cursor-pointer transition-colors ${
                    phoneLang === 'hi' ? 'bg-[#2A1316] text-white' : 'text-[#5B3E42]'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              <button
                type="button"
                onClick={() => onOpenFullPreview(theme, phoneLang)}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#EADFD8] bg-white px-3.5 py-1.5 text-xs font-medium text-[#2A1316] hover:border-[#A3122F] cursor-pointer"
              >
                <Maximize2 className="h-3.5 w-3.5 text-[#A3122F]" />
                <span>See it full screen</span>
              </button>
            </div>
          </aside>

          {/* RIGHT COLUMN: READY TO SHARE SUITE + DELIVERABLES BENTO */}
          <div className="min-w-0 space-y-8">
            {/* 1. Personalized Header & Social Proof */}
            <div>
              <h1 className="font-display text-[36px] sm:text-[46px] font-semibold leading-[1.06] tracking-tight text-[#2A1316]">
                {previewSide === 'bride' && !isBirthday ? brideFirstLabel : groomFirstLabel},
                <br />
                your Nimantran is ready
              </h1>
              <p className="mt-2.5 text-[15.5px] leading-relaxed text-[#5B3E42] max-w-[540px]">
                Every card, WhatsApp invite, scannable QR card, and RSVP manager is live in{' '}
                <span className="font-semibold text-[#2A1316]">{theme.name}</span> on{' '}
                <span className="font-mono text-[13.5px] text-[#9E2A2B]">invitationcards.site</span>.
              </p>

              {/* Subtle Overlapping Theme Avatars + 4.9 Rating */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex -space-x-2">
                  {STUDIO_THEMES.slice(0, 4).map((t) => (
                    <img
                      key={t.id}
                      src={t.image}
                      alt={t.name}
                      className="size-8 rounded-full object-cover ring-2 ring-[#FAF6EE]"
                    />
                  ))}
                </div>
                <div className="text-[13px] text-[#5B3E42]">
                  <span className="inline-flex items-center gap-0.5 text-[#D97706] mr-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </span>
                  <strong className="text-[#2A1316]">4.9</strong> · 5,000+ happy couples
                </div>
              </div>
            </div>

            {/* 2. Primary Share Box (100% Free — ₹0 Forever) */}
            <section className="rounded-2xl border border-[#EADFD8] bg-white p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#2A1316]">
                    Share your free invite link
                  </h2>
                  <p className="text-xs text-[#6D5A49] mt-0.5">
                    Includes all your names, ceremonies, music &amp; live WhatsApp RSVP ·{' '}
                    <span className="line-through opacity-75">{theme.originalPrice}</span>{' '}
                    <strong className="text-[#15803D]">FREE (₹0 Forever)</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenCustomizer(theme)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#EADFD8] bg-[#FAF6EE] px-3 py-1.5 text-xs font-medium text-[#2A1316] hover:border-[#A3122F] cursor-pointer whitespace-nowrap"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#A3122F]" />
                  <span>Edit Names, Photos &amp; Music</span>
                </button>
              </div>

              {/* Clean Template Canonical URL + Copy Personalized */}
              <div className="space-y-2.5">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 rounded-xl border border-[#EADFD8] bg-[#FAF6EE] px-3.5 py-2.5">
                  <div className="min-w-0 flex-1">
                    <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#896B6F]">
                      Dedicated Template URL ({theme.name})
                    </span>
                    <p className="font-mono text-[13px] text-[#2A1316] truncate">
                      {cleanTemplateUrl}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(cleanTemplateUrl, 'canonical-url')}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8C8AA] bg-white px-3 py-1.5 text-xs font-medium text-[#2A1316] hover:border-[#A3122F] cursor-pointer"
                    >
                      {copiedTarget === 'canonical-url' ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-[#15803D]" />
                          <span className="text-[#15803D]">Copied URL</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-[#A3122F]" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => onBackToThemePage(theme)}
                      className="inline-flex items-center gap-1 rounded-lg bg-[#2A1316] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#3f1e22] cursor-pointer"
                    >
                      <span>Open Page</span>
                      <ExternalLink className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                {/* Primary Share CTAs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <a
                    href={buildWhatsappHref(
                      personalizedMainUrl,
                      previewSide === 'bride' ? brideFirstLabel : groomFirstLabel
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1F6E4A] px-4 py-3 text-sm font-semibold text-white hover:bg-[#18593c] transition-colors whitespace-nowrap"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>Share on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopy(personalizedMainUrl, 'main-link')}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#9E2A2B] px-4 py-3 text-sm font-semibold text-white hover:bg-[#822021] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {copiedTarget === 'main-link' ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Custom Link Copied</span>
                      </>
                    ) : (
                      <>
                        <Link2 className="h-4 w-4" />
                        <span>Copy Personalized Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleNativeShare}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#D8C8AA] bg-[#FAF6EE] px-4 py-3 text-sm font-medium text-[#2A1316] hover:border-[#2A1316] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    <Share2 className="h-4 w-4 text-[#9E2A2B]" />
                    <span>Share Anywhere</span>
                  </button>
                </div>
              </div>

              {/* Shagun by UPI Quick Input */}
              <div className="pt-4 border-t border-[#F0E6DC] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-semibold text-[#2A1316] block">
                    Shagun by UPI (Optional)
                  </span>
                  <span className="text-[11.5px] text-[#6D5A49]">
                    Add your UPI ID so elders &amp; far-away guests can send digital blessings inside your invite.
                  </span>
                </div>
                <input
                  type="text"
                  value={customization.shagunUpi || ''}
                  onChange={(e) =>
                    onUpdateCustomization(theme.id, {
                      ...customization,
                      shagunUpi: e.target.value,
                      updatedAt: Date.now(),
                    })
                  }
                  placeholder="e.g. aarav@okaxis"
                  className="sm:w-56 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] px-3 py-2 text-xs font-mono text-[#2A1316] placeholder:text-[#896B6F] focus:border-[#9E2A2B] focus:outline-none"
                />
              </div>
            </section>

            {/* 2B. WHATSAPP RSVP & CATERER MANAGER (100% ZERO-LOGIN · NIMANTRAN.PAGE FLOW) */}
            <section className="rounded-2xl border border-[#EADFD8] bg-white p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#EADFD8]">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-0.5 text-[11px] font-semibold bg-emerald-50 text-[#15803D] border border-emerald-200">
                      Direct WhatsApp RSVP · Zero Login Required
                    </span>
                  </div>
                  <h2 className="mt-1.5 font-display text-2xl font-semibold text-[#2A1316]">
                    WhatsApp RSVP &amp; Caterer Manager
                  </h2>
                  <p className="text-xs text-[#6D5A49] mt-0.5">
                    Guests tap their family name, guest count &amp; functions — their reply opens straight in your WhatsApp. Log replies here anytime for your caterer plate count.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateCustomization(theme.id, {
                        ...customization,
                        enabledSections: {
                          ...customization.enabledSections,
                          rsvp: customization.enabledSections.rsvp === false ? true : false,
                        },
                        updatedAt: Date.now(),
                      })
                    }
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold cursor-pointer ${
                      customization.enabledSections.rsvp !== false
                        ? 'border-emerald-300 bg-emerald-50 text-[#15803D]'
                        : 'border-[#EADFD8] bg-[#FAF6EE] text-[#896B6F]'
                    }`}
                  >
                    {customization.enabledSections.rsvp !== false
                      ? 'RSVP on Card: ON ✓'
                      : 'RSVP on Card: OFF'}
                  </button>
                </div>
              </div>

              {/* Host WhatsApp Number + Reply-By Date Quick Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-[#EFE5D3] bg-[#FAF6EE]/80 p-3.5">
                <div>
                  <label className="text-[11px] font-semibold text-[#2A1316] block">
                    Your WhatsApp Number for Guest Replies
                  </label>
                  <span className="text-[11px] text-[#6D5A49] block mb-1.5">
                    Guest replies open directly in your WhatsApp (+91 auto-formatted).
                  </span>
                  <input
                    type="tel"
                    value={customization.rsvpWhatsapp || ''}
                    onChange={(e) =>
                      onUpdateCustomization(theme.id, {
                        ...customization,
                        rsvpWhatsapp: e.target.value,
                        updatedAt: Date.now(),
                      })
                    }
                    placeholder="e.g. 98765 43210"
                    className="w-full rounded-lg border border-[#D8C8AA] bg-white px-3 py-1.5 text-xs text-[#2A1316] placeholder:text-[#896B6F] focus:border-[#9E2A2B] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#2A1316] block">
                    Reply-By Date Shown on Card
                  </label>
                  <span className="text-[11px] text-[#6D5A49] block mb-1.5">
                    Displayed above the RSVP section (e.g. Kindly Reply By 25 Oct).
                  </span>
                  <input
                    type="text"
                    value={customization.rsvpDeadline || ''}
                    onChange={(e) =>
                      onUpdateCustomization(theme.id, {
                        ...customization,
                        rsvpDeadline: e.target.value,
                        updatedAt: Date.now(),
                      })
                    }
                    placeholder="e.g. 25 Oct"
                    className="w-full rounded-lg border border-[#D8C8AA] bg-white px-3 py-1.5 text-xs text-[#2A1316] placeholder:text-[#896B6F] focus:border-[#9E2A2B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Live Caterer KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-xl border border-[#EADFD8] bg-[#FAF6EE] p-3">
                  <span className="text-[11px] font-medium text-[#6D5A49] block">
                    Total Confirmed Plates
                  </span>
                  <span className="mt-1 block font-display text-3xl font-bold tabular-nums text-[#2A1316]">
                    {rsvpMetrics.totalPlates}
                  </span>
                  <span className="text-[11px] text-[#15803D] font-medium">
                    {rsvpMetrics.attendingFamilies} families attending
                  </span>
                </div>

                <div className="rounded-xl border border-[#EADFD8] bg-[#FAF6EE] p-3">
                  <span className="text-[11px] font-medium text-[#6D5A49] block">
                    Meal Split (Caterer)
                  </span>
                  <div className="mt-1.5 space-y-0.5 text-xs text-[#2A1316]">
                    <p className="flex justify-between">
                      <span>Pure Veg</span>
                      <strong className="tabular-nums">{rsvpMetrics.dietCounts.pure_veg}</strong>
                    </p>
                    <p className="flex justify-between text-[#A3122F]">
                      <span>Jain (No Onion/Garlic)</span>
                      <strong className="tabular-nums">{rsvpMetrics.dietCounts.jain}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Veg + Non-Veg</span>
                      <strong className="tabular-nums">{rsvpMetrics.dietCounts.veg_nonveg}</strong>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#EADFD8] bg-[#FAF6EE] p-3">
                  <span className="text-[11px] font-medium text-[#6D5A49] block">
                    Parivar Breakdown
                  </span>
                  <div className="mt-1.5 space-y-0.5 text-xs text-[#2A1316]">
                    <p className="flex justify-between">
                      <span>Ladkewale</span>
                      <strong className="tabular-nums">{rsvpMetrics.sideCounts.groom}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Ladkiwale</span>
                      <strong className="tabular-nums">{rsvpMetrics.sideCounts.bride}</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>Friends / Both</span>
                      <strong className="tabular-nums">{rsvpMetrics.sideCounts.both}</strong>
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#EADFD8] bg-[#FAF6EE] p-3">
                  <span className="text-[11px] font-medium text-[#6D5A49] block">
                    Warm Blessings Only
                  </span>
                  <span className="mt-1 block font-display text-3xl font-bold tabular-nums text-[#5B3E42]">
                    {rsvpMetrics.declinedFamilies}
                  </span>
                  <span className="text-[11px] text-[#896B6F]">
                    Unable to attend
                  </span>
                </div>
              </div>

              {/* Function-wise Plate Count Strip */}
              <div className="rounded-xl border border-[#EFE5D3] bg-[#FAF6EE] p-3.5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#896B6F] mb-2">
                  Ceremony-Wise Caterer Headcount
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {customization.events.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-lg bg-white border border-[#EADFD8] px-3 py-2 flex items-center justify-between gap-2"
                    >
                      <span className="text-xs font-medium text-[#2A1316] truncate">
                        {ev.titleEn}
                      </span>
                      <span className="font-display text-lg font-bold tabular-nums text-[#A3122F] shrink-0">
                        {rsvpMetrics.eventCounts[ev.id] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Toolbar: Add Elder Phone Reply + Copy Caterer Summary + Download CSV */}
              <div className="flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowManualForm((v) => !v)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#2A1316] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#3f1e22] cursor-pointer"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    <span>{showManualForm ? 'Close Manual Form' : '+ Log Phone / Elder Reply'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleCopy(buildCatererSummaryText(), 'caterer-summary')}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] px-3.5 py-2 text-xs font-semibold text-[#2A1316] hover:border-[#1F6E4A] cursor-pointer"
                  >
                    {copiedTarget === 'caterer-summary' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#15803D]" />
                        <span className="text-[#15803D]">Caterer Tally Copied</span>
                      </>
                    ) : (
                      <>
                        <Utensils className="h-3.5 w-3.5 text-[#1F6E4A]" />
                        <span>Copy Caterer Summary</span>
                      </>
                    )}
                  </button>

                  {rsvpRecords.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDownloadRsvpCsv}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8C8AA] bg-white px-3.5 py-2 text-xs font-semibold text-[#2A1316] hover:border-[#9E2A2B] cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5 text-[#9E2A2B]" />
                      <span>Download Excel CSV</span>
                    </button>
                  )}
                </div>

                <div className="relative w-full sm:w-56">
                  <Search className="h-3.5 w-3.5 text-[#896B6F] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={rsvpSearch}
                    onChange={(e) => setRsvpSearch(e.target.value)}
                    placeholder="Search guest or phone..."
                    className="w-full rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] pl-8 pr-2.5 py-1.5 text-xs text-[#2A1316] focus:border-[#9E2A2B] focus:outline-none"
                  />
                </div>
              </div>

              {/* Manual Phone/Elder RSVP Form */}
              {showManualForm && (
                <form
                  onSubmit={handleSaveManualRsvp}
                  className="rounded-xl border border-[#D8C8AA] bg-[#FAF6EE] p-4 space-y-3"
                >
                  <p className="text-xs font-semibold text-[#2A1316]">
                    Add Guest Reply Received on Call / WhatsApp (For Dadi, Mama &amp; Elders)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input
                      type="text"
                      value={manualName}
                      onChange={(e) => setManualName(e.target.value)}
                      placeholder="Family / Guest Name *"
                      className="rounded-lg border border-[#D8C8AA] bg-white px-3 py-2 text-xs text-[#2A1316]"
                    />
                    <input
                      type="tel"
                      value={manualPhone}
                      onChange={(e) => setManualPhone(e.target.value)}
                      placeholder="Mobile / WhatsApp (Optional)"
                      className="rounded-lg border border-[#D8C8AA] bg-white px-3 py-2 text-xs text-[#2A1316]"
                    />
                    <div className="flex items-center gap-1.5">
                      <select
                        value={manualStatus}
                        onChange={(e) => setManualStatus(e.target.value as AttendanceStatus)}
                        className="flex-1 rounded-lg border border-[#D8C8AA] bg-white px-2.5 py-2 text-xs text-[#2A1316]"
                      >
                        <option value="attending">Attending</option>
                        <option value="declined">Can&apos;t Make It</option>
                      </select>
                      {manualStatus === 'attending' && (
                        <div className="flex items-center gap-1 rounded-lg border border-[#D8C8AA] bg-white px-2 py-1">
                          <button
                            type="button"
                            onClick={() => setManualCount((c) => Math.max(1, c - 1))}
                            className="p-1 text-[#2A1316] cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-bold tabular-nums">
                            {manualCount}
                          </span>
                          <button
                            type="button"
                            onClick={() => setManualCount((c) => Math.min(15, c + 1))}
                            className="p-1 text-[#2A1316] cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {manualStatus === 'attending' && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <select
                        value={manualSide}
                        onChange={(e) => setManualSide(e.target.value as FamilySide)}
                        className="rounded-lg border border-[#D8C8AA] bg-white px-2.5 py-2 text-xs text-[#2A1316]"
                      >
                        <option value="groom">Ladkewale (Groom Side)</option>
                        <option value="bride">Ladkiwale (Bride Side)</option>
                        <option value="both">Friends / Common</option>
                      </select>
                      <select
                        value={manualDiet}
                        onChange={(e) => setManualDiet(e.target.value as DietaryPreference)}
                        className="rounded-lg border border-[#D8C8AA] bg-white px-2.5 py-2 text-xs text-[#2A1316]"
                      >
                        <option value="pure_veg">Pure Veg</option>
                        <option value="jain">Jain (No Onion/Garlic)</option>
                        <option value="veg_nonveg">Veg + Non-Veg</option>
                      </select>
                      <input
                        type="text"
                        value={manualArrival}
                        onChange={(e) => setManualArrival(e.target.value)}
                        placeholder="Arrival / Hotel Stay Note"
                        className="rounded-lg border border-[#D8C8AA] bg-white px-3 py-2 text-xs text-[#2A1316]"
                      />
                    </div>
                  )}

                  {manualStatus === 'attending' && (
                    <div className="flex flex-wrap gap-1.5">
                      {customization.events.map((ev) => {
                        const checked = manualEvents.includes(ev.id);
                        return (
                          <button
                            key={ev.id}
                            type="button"
                            onClick={() =>
                              setManualEvents((prev) =>
                                prev.includes(ev.id)
                                  ? prev.filter((id) => id !== ev.id)
                                  : [...prev, ev.id]
                              )
                            }
                            className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium cursor-pointer ${
                              checked
                                ? 'border-[#9E2A2B] bg-white text-[#9E2A2B]'
                                : 'border-[#D8C8AA] bg-white/60 text-[#6D5A49]'
                            }`}
                          >
                            {checked ? '✓ ' : ''}
                            {ev.titleEn}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <input
                      type="text"
                      value={manualNote}
                      onChange={(e) => setManualNote(e.target.value)}
                      placeholder="Optional note or blessing..."
                      className="flex-1 min-w-[200px] rounded-lg border border-[#D8C8AA] bg-white px-3 py-2 text-xs text-[#2A1316]"
                    />
                    <button
                      type="submit"
                      disabled={manualSaving}
                      className="rounded-lg bg-[#9E2A2B] px-4 py-2 text-xs font-semibold text-white hover:bg-[#822021] disabled:opacity-60 cursor-pointer"
                    >
                      {manualSaving ? 'Saving...' : 'Save Guest Entry'}
                    </button>
                  </div>
                  {manualError && <p className="text-xs text-[#B91C1C] font-medium">{manualError}</p>}
                </form>
              )}

              {/* Filter Tabs */}
              <div className="flex flex-wrap items-center gap-1.5 border-b border-[#F0E6DC] pb-3">
                {(
                  [
                    { id: 'all', label: `All (${rsvpRecords.length})` },
                    { id: 'attending', label: `Attending (${rsvpMetrics.attendingFamilies})` },
                    { id: 'declined', label: `Blessings (${rsvpMetrics.declinedFamilies})` },
                    { id: 'jain', label: 'Jain Meal' },
                    { id: 'arrival', label: 'Needs Travel/Stay' },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRsvpFilter(tab.id)}
                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold cursor-pointer ${
                      rsvpFilter === tab.id
                        ? 'bg-[#2A1316] text-white'
                        : 'bg-[#FAF6EE] text-[#5B3E42] hover:text-[#2A1316]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Guest List */}
              {filteredRsvps.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#D8C8AA] bg-[#FAF6EE]/60 p-6 text-center">
                  <p className="text-sm font-medium text-[#2A1316]">
                    No guest RSVPs recorded yet
                  </p>
                  <p className="mt-1 text-xs text-[#6D5A49]">
                    Test submitting an RSVP inside the live phone preview on the left, or click &ldquo;+ Log Phone / Elder Reply&rdquo; above.
                  </p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                  {filteredRsvps.map((row) => {
                    const waDigits = normalizeIndianWhatsappDigits(row.guestPhone);
                    const eventNames = customization.events
                      .filter((ev) => row.eventIds.includes(ev.id))
                      .map((ev) => ev.titleEn)
                      .join(', ');
                    return (
                      <div
                        key={row.rsvpId}
                        className="rounded-xl border border-[#EADFD8] bg-[#FAF6EE]/65 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm text-[#2A1316]">
                              {row.guestName}
                            </span>
                            <span
                              className={`rounded px-2 py-0.5 text-[10.5px] font-semibold ${
                                row.attendanceStatus === 'attending'
                                  ? 'bg-emerald-100 text-[#15803D]'
                                  : 'bg-[#EFE5D3] text-[#5B3E42]'
                              }`}
                            >
                              {row.attendanceStatus === 'attending'
                                ? `${row.guestCount} Guests`
                                : 'Blessings Only'}
                            </span>
                            {row.attendanceStatus === 'attending' && (
                              <span className="rounded bg-white border border-[#EADFD8] px-2 py-0.5 text-[10.5px] font-medium text-[#5B3E42]">
                                {row.dietaryPreference === 'jain'
                                  ? 'Jain Food'
                                  : row.dietaryPreference === 'veg_nonveg'
                                    ? 'Veg + Non-Veg'
                                    : 'Pure Veg'}
                              </span>
                            )}
                            {!isBirthday && (
                              <span className="text-[11px] text-[#896B6F]">
                                · {row.side === 'bride' ? 'Ladkiwale' : row.side === 'both' ? 'Friends' : 'Ladkewale'}
                              </span>
                            )}
                          </div>
                          { (row.guestPhone || eventNames) && (
                            <p className="text-xs text-[#5B3E42]">
                              {row.guestPhone}
                              {row.guestPhone && eventNames ? ' · ' : ''}
                              {eventNames || ''}
                            </p>
                          )}
                          {(row.arrivalInfo || row.blessingNote) && (
                            <p className="text-[11.5px] text-[#6D5A49]">
                              {row.arrivalInfo ? `Travel/Stay: ${row.arrivalInfo}` : ''}
                              {row.arrivalInfo && row.blessingNote ? ' · ' : ''}
                              {row.blessingNote ? `"${row.blessingNote}"` : ''}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {waDigits && (
                            <a
                              href={`https://wa.me/${waDigits}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-lg bg-[#1F6E4A] px-2.5 py-1.5 text-[11px] font-semibold text-white hover:bg-[#18583b]"
                            >
                              <MessageCircle className="h-3 w-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}
                          {onDeleteRsvp && (
                            <button
                              type="button"
                              onClick={() => onDeleteRsvp(row.rsvpId)}
                              title="Remove RSVP entry"
                              className="grid size-7 place-items-center rounded-lg border border-[#EADFD8] bg-white text-[#896B6F] hover:text-[#B91C1C] hover:border-red-200 cursor-pointer"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* 3. Dual-Family Architecture: Two Invites, One for Each Family */}
            {!isBirthday && (
              <section className="rounded-2xl border border-[#EADFD8] bg-white p-5 sm:p-6 space-y-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#2A1316]">
                    Two invites, one for each family
                  </h2>
                  <p className="text-xs text-[#6D5A49] mt-0.5">
                    {rawBride}&apos;s name first for the bride&apos;s family, {rawGroom}&apos;s name first for the groom&apos;s family — each at its own link.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Groom Side Card */}
                  <div
                    className={`rounded-xl border p-4 transition-colors ${
                      previewSide === 'groom'
                        ? 'border-[#9E2A2B] bg-[#FBF6F3]'
                        : 'border-[#EADFD8] bg-[#FAF6EE]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9E2A2B]">
                        {rawGroom}&apos;s Family
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewSide('groom')}
                        className="text-[11px] font-medium text-[#5B3E42] hover:text-[#2A1316] underline cursor-pointer"
                      >
                        {previewSide === 'groom' ? 'Showing in Phone' : 'Preview'}
                      </button>
                    </div>
                    <p className="mt-1.5 font-display text-2xl font-semibold text-[#2A1316]">
                      {groomFirstLabel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(groomSideUrl, 'groom-side')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8C8AA] bg-white px-3 py-1.5 text-xs font-medium text-[#2A1316] hover:border-[#9E2A2B] cursor-pointer"
                      >
                        {copiedTarget === 'groom-side' ? (
                          <Check className="h-3.5 w-3.5 text-[#15803D]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-[#9E2A2B]" />
                        )}
                        <span>{copiedTarget === 'groom-side' ? 'Copied' : 'Copy Link'}</span>
                      </button>
                      <a
                        href={buildWhatsappHref(groomSideUrl, groomFirstLabel)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1F6E4A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#18593c]"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Bride Side Card */}
                  <div
                    className={`rounded-xl border p-4 transition-colors ${
                      previewSide === 'bride'
                        ? 'border-[#9E2A2B] bg-[#FBF6F3]'
                        : 'border-[#EADFD8] bg-[#FAF6EE]/50'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#9E2A2B]">
                        {rawBride}&apos;s Family
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreviewSide('bride')}
                        className="text-[11px] font-medium text-[#5B3E42] hover:text-[#2A1316] underline cursor-pointer"
                      >
                        {previewSide === 'bride' ? 'Showing in Phone' : 'Preview'}
                      </button>
                    </div>
                    <p className="mt-1.5 font-display text-2xl font-semibold text-[#2A1316]">
                      {brideFirstLabel}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopy(brideSideUrl, 'bride-side')}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8C8AA] bg-white px-3 py-1.5 text-xs font-medium text-[#2A1316] hover:border-[#9E2A2B] cursor-pointer"
                      >
                        {copiedTarget === 'bride-side' ? (
                          <Check className="h-3.5 w-3.5 text-[#15803D]" />
                        ) : (
                          <Copy className="h-3.5 w-3.5 text-[#9E2A2B]" />
                        )}
                        <span>{copiedTarget === 'bride-side' ? 'Copied' : 'Copy Link'}</span>
                      </button>
                      <a
                        href={buildWhatsappHref(brideSideUrl, brideFirstLabel)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1F6E4A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#18593c]"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 4. Parivar Per-Family Guest Filter Link Builder */}
            <section className="rounded-2xl border border-[#EADFD8] bg-white p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#2A1316]">
                    Parivar personal guest link
                  </h2>
                  <p className="text-xs text-[#6D5A49] mt-0.5">
                    Greet each household by name (&ldquo;Padharo, Sharma Parivar&rdquo;) and show only the ceremonies they are invited to.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setApplyParivarToPhone((v) => !v)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                    applyParivarToPhone
                      ? 'border-[#15803D] bg-[#dcfce7] text-[#15803D]'
                      : 'border-[#EADFD8] bg-[#FAF6EE] text-[#5B3E42] hover:border-[#9E2A2B]'
                  }`}
                >
                  {applyParivarToPhone ? 'Testing Family View in Phone ✓' : 'Test Family View in Phone'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-3 items-end">
                <div>
                  <label className="block text-xs font-medium text-[#5B3E42] mb-1">
                    Guest Household / Parivar Name
                  </label>
                  <input
                    type="text"
                    value={guestFamilyInput}
                    onChange={(e) => setGuestFamilyInput(e.target.value)}
                    placeholder="e.g. Sharma Parivar / Kapoor Family"
                    className="w-full rounded-xl border border-[#D8C8AA] bg-[#FAF6EE] px-3.5 py-2.5 text-sm text-[#2A1316] focus:border-[#9E2A2B] focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(parivarUrl, 'parivar-link')}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#2A1316] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#3f1e22] cursor-pointer whitespace-nowrap"
                  >
                    {copiedTarget === 'parivar-link' ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-[#86EFAC]" />
                        <span>Copied Parivar Link</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" />
                        <span>Copy Family Link</span>
                      </>
                    )}
                  </button>
                  <a
                    href={buildWhatsappHref(
                      parivarUrl,
                      previewSide === 'bride' ? brideFirstLabel : groomFirstLabel,
                      guestFamilyInput.trim()
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1F6E4A] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#18593c] whitespace-nowrap"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>WhatsApp Family</span>
                  </a>
                </div>
              </div>

              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-[0.14em] text-[#6D5A49] mb-2">
                  Functions visible to {guestFamilyInput.trim() || 'this guest'} ({selectedEventIds.length} of{' '}
                  {customization.events.length})
                </span>
                <div className="flex flex-wrap gap-2">
                  {customization.events.map((ev) => {
                    const checked = selectedEventIds.includes(ev.id);
                    return (
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => toggleParivarEvent(ev.id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
                          checked
                            ? 'border-[#9E2A2B] bg-[#FBE7EB]/50 text-[#2A1316]'
                            : 'border-[#EADFD8] bg-[#FAF6EE] text-[#896B6F] line-through'
                        }`}
                      >
                        <Check className={`h-3 w-3 ${checked ? 'text-[#9E2A2B]' : 'opacity-30'}`} />
                        <span>{ev.titleEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* 5. Everything Included — 9-Card Visual Deliverables Bento Grid (100% Free) */}
            <section className="space-y-4">
              <div>
                <h2 className="font-display text-3xl font-semibold text-[#2A1316]">
                  Everything included — 100% Free (₹0)
                </h2>
                <p className="text-sm text-[#5B3E42] mt-1">
                  Everything to make your celebration look cohesive, from the first Save-the-Date to gate welcome boards — in your names and your theme.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Card 1: Your Wedding Monogram */}
                <div className="rounded-2xl border border-[#EADFD8] bg-white p-4 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-xl bg-[#FAF6EE] border border-[#EFE5D3] flex flex-col items-center justify-center p-3">
                    <JharokhaCrest
                      themeId={theme.id}
                      groomInitial={activeFirstInitial}
                      brideInitial={activeSecondInitial}
                      size="lg"
                      tone="theme"
                    />
                    <span className="mt-1.5 font-display text-sm font-semibold text-[#2A1316]">
                      {isBirthday
                        ? rawGroom
                        : previewSide === 'bride'
                          ? brideFirstLabel
                          : groomFirstLabel}
                    </span>
                    <span className="text-[10px] tracking-[0.12em] uppercase text-[#896B6F]">
                      {monogramMeta.styleName}
                    </span>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#2A1316]">
                        Your wedding monogram
                      </h3>
                      <p className="text-xs text-[#6D5A49] mt-0.5 leading-relaxed">
                        {monogramMeta.motifSummary}. Updates live with your initials ({activeFirstInitial}
                        {isBirthday ? '' : ` & ${activeSecondInitial}`}).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadAsset('monogram')}
                      disabled={exportingAsset === 'monogram'}
                      title="Download Bespoke Monogram PNG"
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] px-2.5 py-1.5 text-[11px] font-semibold text-[#2A1316] hover:border-[#9E2A2B] cursor-pointer"
                    >
                      <Download className="h-3 w-3 text-[#9E2A2B]" />
                      <span>{exportingAsset === 'monogram' ? '...' : 'PNG'}</span>
                    </button>
                  </div>
                </div>

                {/* Card 2: The Printed Invitation + Scannable QR Code */}
                <div className="rounded-2xl border border-[#EADFD8] bg-white p-4 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-xl bg-[#181214] text-[#FAF6EE] p-3 flex items-center justify-between gap-2 overflow-hidden">
                    <div className="min-w-0">
                      <p className="text-[9px] uppercase tracking-[0.16em] text-[#E6B86A]">
                        Scan QR Invite
                      </p>
                      <p className="font-display text-base font-semibold leading-tight mt-0.5 truncate">
                        {isBirthday ? rawGroom : groomFirstLabel}
                      </p>
                      <p className="text-[10px] text-[#C8B493] mt-0.5 truncate">
                        {customization.dateLabel}
                      </p>
                    </div>
                    {qrDataUrl ? (
                      <img
                        src={qrDataUrl}
                        alt={`QR Code for ${cleanTemplateUrl}`}
                        className="size-20 rounded-lg bg-white p-1 shrink-0"
                      />
                    ) : (
                      <QrCode className="size-16 text-[#E6B86A] shrink-0" />
                    )}
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#2A1316]">The printed invitation + QR</h3>
                      <p className="text-xs text-[#6D5A49] mt-0.5 leading-relaxed">
                        Printable card with a real scannable QR code to your live website.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadAsset('qr-card')}
                      disabled={exportingAsset === 'qr-card'}
                      title="Download Printable QR Invitation PNG"
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] px-2.5 py-1.5 text-[11px] font-semibold text-[#2A1316] hover:border-[#9E2A2B] cursor-pointer"
                    >
                      <Download className="h-3 w-3 text-[#9E2A2B]" />
                      <span>{exportingAsset === 'qr-card' ? '...' : 'PNG'}</span>
                    </button>
                  </div>
                </div>

                {/* Card 3: Welcome Boards */}
                <div className="rounded-2xl border border-[#EADFD8] bg-white p-4 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-xl overflow-hidden relative border border-[#EADFD8] bg-[#FBF6F3] flex items-center justify-center p-3">
                    <img
                      src={theme.image}
                      alt="Welcome board preview"
                      className="absolute inset-0 h-full w-full object-cover opacity-25"
                    />
                    <div className="relative z-10 w-full max-w-[140px] rounded-lg border border-[#C88A2B] bg-white/95 px-3 py-3 text-center shadow-sm">
                      <p className="text-[8px] uppercase tracking-[0.18em] text-[#9E2A2B]">
                        Padharo
                      </p>
                      <p className="font-display text-sm font-semibold text-[#2A1316] leading-tight mt-0.5">
                        {isBirthday ? rawGroom : groomFirstLabel}
                      </p>
                      <p className="text-[9px] text-[#6D5A49] mt-0.5 truncate">
                        {customization.cityLabel}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#2A1316]">Welcome boards</h3>
                      <p className="text-xs text-[#6D5A49] mt-0.5 leading-relaxed">
                        Your names at the venue gate, matching your theme palette.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadAsset('welcome-board')}
                      disabled={exportingAsset === 'welcome-board'}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] px-2.5 py-1.5 text-[11px] font-semibold text-[#2A1316] hover:border-[#9E2A2B] cursor-pointer"
                    >
                      <Download className="h-3 w-3 text-[#9E2A2B]" />
                      <span>{exportingAsset === 'welcome-board' ? '...' : 'PNG'}</span>
                    </button>
                  </div>
                </div>

                {/* Card 4: A Card for Every Function */}
                <div className="rounded-2xl border border-[#EADFD8] bg-white p-4 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-xl bg-[#FAF6EE] border border-[#EFE5D3] p-2.5 grid grid-cols-2 gap-1.5 overflow-hidden">
                    {customization.events.slice(0, 4).map((ev) => (
                      <div
                        key={ev.id}
                        className="rounded-lg bg-white border border-[#EADFD8] p-2 flex flex-col justify-between"
                      >
                        <span
                          className="h-1.5 w-6 rounded-full"
                          style={{ backgroundColor: ev.accentHex }}
                        />
                        <div className="min-w-0">
                          <p className="text-[10.5px] font-semibold text-[#2A1316] truncate">
                            {ev.titleEn}
                          </p>
                          <p className="text-[9px] text-[#6D5A49] truncate">{ev.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-[#2A1316]">A card for every function</h3>
                    <p className="text-xs text-[#6D5A49] mt-0.5 leading-relaxed">
                      Haldi to Reception — ready to share on family WhatsApp groups.
                    </p>
                  </div>
                </div>

                {/* Card 5: Save-the-Date Card */}
                <div className="rounded-2xl border border-[#EADFD8] bg-white p-4 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-xl bg-[#19130E] text-[#FAF6EE] p-3 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <img
                      src={theme.image}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover opacity-35"
                    />
                    <div className="relative z-10">
                      <p className="text-[8.5px] uppercase tracking-[0.2em] text-[#F5D68A]">
                        Save the Date
                      </p>
                      <p className="font-display text-lg font-semibold mt-0.5">
                        {isBirthday ? rawGroom : groomFirstLabel}
                      </p>
                      <p className="text-[10px] text-[#E6C994] mt-0.5">{customization.dateLabel}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-semibold text-[#2A1316]">Save-the-date</h3>
                      <p className="text-xs text-[#6D5A49] mt-0.5 leading-relaxed">
                        Send to family the moment your celebration dates are finalized.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownloadAsset('save-date')}
                      disabled={exportingAsset === 'save-date'}
                      className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] px-2.5 py-1.5 text-[11px] font-semibold text-[#2A1316] hover:border-[#9E2A2B] cursor-pointer"
                    >
                      <Download className="h-3 w-3 text-[#9E2A2B]" />
                      <span>{exportingAsset === 'save-date' ? '...' : 'PNG'}</span>
                    </button>
                  </div>
                </div>

                {/* Card 6: Mood Boards */}
                <div className="rounded-2xl border border-[#EADFD8] bg-white p-4 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-xl bg-[#FAF6EE] border border-[#EFE5D3] p-2.5 grid grid-cols-3 gap-1.5">
                    <div className="col-span-2 rounded-lg overflow-hidden relative">
                      <img
                        src={customization.events[0]?.image || theme.image}
                        alt="Ceremony moodboard"
                        className="h-full w-full object-cover"
                      />
                      <span className="absolute bottom-1.5 left-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] font-medium text-white">
                        {customization.events[0]?.titleEn || 'Haldi'}
                      </span>
                    </div>
                    <div className="grid grid-rows-3 gap-1.5">
                      {(customization.events[0]?.swatchColors || ['#E0A100', '#FAF0DE', '#4B8B5E']).map(
                        (hex) => (
                          <div key={hex} className="rounded-md" style={{ backgroundColor: hex }} />
                        )
                      )}
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-[#2A1316]">Mood boards</h3>
                    <p className="text-xs text-[#6D5A49] mt-0.5 leading-relaxed">
                      The colours and atmosphere of every function, curated in one place.
                    </p>
                  </div>
                </div>

                {/* Card 7: Looks for Every Function */}
                <div className="rounded-2xl border border-[#EADFD8] bg-white p-4 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-xl bg-[#FAF6EE] border border-[#EFE5D3] p-3 flex flex-col justify-center space-y-2">
                    {customization.events.slice(0, 3).map((ev) => (
                      <div key={ev.id} className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold text-[#2A1316] truncate">
                            {ev.titleEn}
                          </span>
                          <div className="flex items-center gap-1 shrink-0">
                            {ev.swatchColors.slice(0, 3).map((hex) => (
                              <span
                                key={hex}
                                style={{ backgroundColor: hex }}
                                className="size-2.5 rounded-full border border-black/15"
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[10px] text-[#6D5A49] truncate">{ev.attireEn}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-[#2A1316]">Looks for every function</h3>
                    <p className="text-xs text-[#6D5A49] mt-0.5 leading-relaxed">
                      Clear dress-code palette hints so guests know what to wear.
                    </p>
                  </div>
                </div>

                {/* Card 8: The RSVP Manager */}
                <div className="rounded-2xl border border-[#EADFD8] bg-white p-4 flex flex-col justify-between">
                  <div className="aspect-[4/3] rounded-xl bg-[#FAF6EE] border border-[#EFE5D3] p-2.5 flex flex-col justify-center space-y-1.5">
                    {rsvpPreviewRows.map((row, idx) => (
                      <div
                        key={`${row.name}-${idx}`}
                        className="flex items-center justify-between rounded-lg bg-white border border-[#EADFD8] px-2.5 py-1.5 text-xs"
                      >
                        <span className="inline-flex items-center gap-1.5 font-medium text-[#2A1316] truncate">
                          <Check className="h-3.5 w-3.5 text-[#15803D] shrink-0" />
                          <span className="truncate">{row.name}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold tabular-nums text-[#5B3E42] shrink-0">
                          <Users className="h-3 w-3" />
                          <span>{row.count}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-[#2A1316]">The RSVP manager</h3>
                    <p className="text-xs text-[#6D5A49] mt-0.5 leading-relaxed">
                      Every family&apos;s reply, counted and ready for your caterer &amp; WhatsApp.
                    </p>
                  </div>
                </div>

                {/* Card 9: Pre-Wedding Photos & Music */}
                <div
                  onClick={() => onOpenCustomizer(theme)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onOpenCustomizer(theme);
                    }
                  }}
                  className="rounded-2xl border border-[#EADFD8] bg-white p-4 flex flex-col justify-between cursor-pointer hover:border-[#9E2A2B] transition-colors"
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden relative">
                    <img
                      src={
                        customization.couplePhotoUrl?.trim() ||
                        (isBirthday ? BIRTHDAY_STAR_PORTRAIT_IMAGE : ROYAL_COUPLE_PORTRAIT_IMAGE)
                      }
                      alt={theme.name}
                      className="h-full w-full object-cover object-top"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5 flex items-center justify-between text-white text-[10px]">
                      <span className="inline-flex items-center gap-1 truncate">
                        <Music className="h-3 w-3 text-[#F5D68A]" />
                        <span className="truncate">{customization.songTitle}</span>
                      </span>
                      <span className="font-semibold text-[#FDE68A] shrink-0">Edit →</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-sm font-semibold text-[#2A1316]">Custom photos &amp; song</h3>
                    <p className="text-xs text-[#6D5A49] mt-0.5 leading-relaxed">
                      Upload your own couple photos and MP3 track — plays as guests open the card.
                    </p>
                  </div>
                </div>
              </div>

              {/* Clean Feature Strip without Pilled Clutter */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 border-t border-[#EADFD8] text-xs font-medium text-[#5B3E42]">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-[#9E2A2B]" />
                  <span>Venue map &amp; travel</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Music className="h-3.5 w-3.5 text-[#9E2A2B]" />
                  <span>Your song playing</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <HeartHandshake className="h-3.5 w-3.5 text-[#9E2A2B]" />
                  <span>Shagun by UPI</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 className="h-3.5 w-3.5 text-[#9E2A2B]" />
                  <span>Hindi &amp; English</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <SlidersHorizontal className="h-3.5 w-3.5 text-[#9E2A2B]" />
                  <span>Change anything, anytime</span>
                </span>
              </div>
            </section>

            {/* 6. Dedicated URL Directory for All 31 Templates on invitationcards.site */}
            <section className="rounded-2xl border border-[#EADFD8] bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-semibold text-[#2A1316]">
                    All {STUDIO_THEMES.length} Template URLs on {SITE_DOMAIN}
                  </h2>
                  <p className="text-xs text-[#6D5A49] mt-0.5">
                    Every NIMANTRAN template has its own clean, permanent route ready for sharing or bookmarking.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowUrlDirectory((v) => !v)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] px-3.5 py-2 text-xs font-semibold text-[#2A1316] hover:border-[#9E2A2B] cursor-pointer"
                >
                  <span>{showUrlDirectory ? 'Hide URL List' : `View All ${STUDIO_THEMES.length} URLs`}</span>
                </button>
              </div>

              {showUrlDirectory && (
                <div className="mt-4 space-y-3 border-t border-[#EADFD8] pt-4">
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-[#896B6F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={urlSearch}
                      onChange={(e) => setUrlSearch(e.target.value)}
                      placeholder="Filter by template name or slug (e.g. rajwada, antarpat, haldi)..."
                      className="w-full rounded-lg border border-[#D8C8AA] bg-[#FAF6EE] pl-8 pr-3 py-2 text-xs text-[#2A1316] focus:border-[#9E2A2B] focus:outline-none"
                    />
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-[#F0E6DC] pr-1">
                    {filteredDirectoryThemes.map((t) => {
                      const tUrl = getTemplateCanonicalUrl(t, false);
                      const isCurrent = t.id === theme.id;
                      return (
                        <div
                          key={t.id}
                          className={`py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs ${
                            isCurrent ? 'bg-[#FBF6F3] px-2 rounded-lg' : ''
                          }`}
                        >
                          <div className="min-w-0">
                            <span className="font-semibold text-[#2A1316]">
                              {t.indexLabel}. {t.name}
                            </span>
                            <span className="ml-2 font-mono text-[11px] text-[#9E2A2B]">
                              /{t.slug}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleCopy(tUrl, `dir-${t.id}`)}
                              className="inline-flex items-center gap-1 rounded border border-[#D8C8AA] bg-white px-2.5 py-1 text-[11px] font-medium text-[#2A1316] hover:border-[#9E2A2B] cursor-pointer"
                            >
                              {copiedTarget === `dir-${t.id}` ? (
                                <>
                                  <Check className="h-3 w-3 text-[#15803D]" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-3 w-3" />
                                  <span>Copy URL</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => onSelectTheme(t)}
                              className="rounded bg-[#2A1316] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#3f1e22] cursor-pointer"
                            >
                              Switch
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
