import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCcw,
  Link2,
  Check,
  Plus,
  Trash2,
  SlidersHorizontal,
  Calendar,
  FileText,
  Layers,
  Eye,
  Play,
  Square,
  Globe2,
  ImagePlus,
  Music,
  Upload,
  Share2,
  Languages,
  RefreshCw,
  Loader2,
  AlertCircle,
  MapPin,
  Search,
  Navigation,
  WifiOff,
  ExternalLink,
} from 'lucide-react';
import { InviteTheme } from '../data/studioData';
import {
  BIRTHDAY_STAR_PORTRAIT_IMAGE,
  COUPLE_DEFAULTS,
  Language,
  ROYAL_COUPLE_PORTRAIT_IMAGE,
} from '../data/weddingData';
import {
  CardCustomization,
  CardLanguageMode,
  CardSectionKey,
  CURATED_EVENT_PHOTOS,
  CustomEventItem,
  encodeShareUrl,
  getDefaultCustomization,
  SECTION_META,
} from '../data/cardCustomization';
import {
  compressImageToDataUrl,
  deleteCustomAudio,
  loadCustomAudioUrl,
  storeCustomAudio,
} from '../utils/mediaUpload';
import {
  isBrowserOffline,
  offlineTranslateInviteFields,
  translateInviteFields,
} from '../utils/translateInvite';
import {
  buildDirectGoogleMapsUrl,
  isLikelyMapUrl,
  parseRawAddressOrPlusCodeLocally,
  ResolvedLocationResult,
  resolveLocationZeroApi,
} from '../utils/locationParser';
import { InteractiveInvitePhoneStage } from './InteractiveInvitePhoneStage';

interface CardCustomizerModalProps {
  theme: InviteTheme | null;
  customization: CardCustomization | null;
  hasCustomChanges: boolean;
  onUpdate: (themeId: string, next: CardCustomization) => void;
  onReset: (themeId: string) => void;
  onClose: () => void;
  onSaveAndPreview: (theme: InviteTheme) => void;
  onOpenShareSuite?: (theme: InviteTheme) => void;
}

type CustomizerTab = 'details' | 'sections' | 'events';

const WEDDING_QUICK_EVENT_PRESETS: Array<{
  label: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  time: string;
  attireEn: string;
  attireHi: string;
  accentHex: string;
  photoIndex: number;
}> = [
  {
    label: 'Haldi Ceremony',
    titleEn: 'Haldi Utsav',
    titleHi: 'शुभ हल्दी',
    subtitleEn: 'Turmeric & Marigold Petals',
    time: '10:30 AM',
    attireEn: 'Marigold Yellow Kurta & Saree',
    attireHi: 'पीला हल्दी परिधान',
    accentHex: '#E0A100',
    photoIndex: 2,
  },
  {
    label: 'Mehndi Night',
    titleEn: 'Mehndi & Dholki',
    titleHi: 'मेहंदी एवं संगीत',
    subtitleEn: 'Henna, Jhoola & Folk Songs',
    time: '04:00 PM',
    attireEn: 'Emerald & Moss Greens',
    attireHi: 'हरा मेहंदी परिधान',
    accentHex: '#2E6B47',
    photoIndex: 3,
  },
  {
    label: 'Roka Ceremony',
    titleEn: 'Roka & Tilak',
    titleHi: 'रोका एवं तिलक',
    subtitleEn: 'Auspicious Family Blessing',
    time: '11:30 AM',
    attireEn: 'Traditional Pastels',
    attireHi: 'पारंपरिक हल्के रंग',
    accentHex: '#C88A2B',
    photoIndex: 1,
  },
  {
    label: 'Sangeet Night',
    titleEn: 'Sangeet Gala',
    titleHi: 'संगीत संध्या',
    subtitleEn: 'Dance & Folk Music',
    time: '07:30 PM',
    attireEn: 'Indo-Western Glam',
    attireHi: 'उत्सव परिधान',
    accentHex: '#1D2347',
    photoIndex: 0,
  },
  {
    label: 'Reception',
    titleEn: 'Grand Reception',
    titleHi: 'आशीर्वाद व प्रीतिभोज',
    subtitleEn: 'Dinner & Celebrations',
    time: '08:00 PM',
    attireEn: 'Formal Silks & Suits',
    attireHi: 'औपचारिक पारंपरिक परिधान',
    accentHex: '#9E2A2B',
    photoIndex: 6,
  },
];

const BIRTHDAY_QUICK_EVENT_PRESETS: Array<{
  label: string;
  titleEn: string;
  titleHi: string;
  subtitleEn: string;
  time: string;
  attireEn: string;
  attireHi: string;
  accentHex: string;
  photoIndex: number;
}> = [
  {
    label: 'Tilak & Aarti',
    titleEn: 'Shubh Tilak & Aarti',
    titleHi: 'शुभ तिलक व आरती',
    subtitleEn: 'Sacred Family Blessings',
    time: '05:30 PM',
    attireEn: 'Festive Kurta & Ethnic',
    attireHi: 'पारंपरिक उत्सव परिधान',
    accentHex: '#D97706',
    photoIndex: 11,
  },
  {
    label: 'Havan & Puja',
    titleEn: 'Shubh Havan & Puja',
    titleHi: 'शुभ हवन व पूजन',
    subtitleEn: 'Vedic Chants & Prasad',
    time: '10:30 AM',
    attireEn: 'Yellow / Saffron Traditional',
    attireHi: 'पीला / केसरिया पारंपरिक वस्त्र',
    accentHex: '#C88A2B',
    photoIndex: 11,
  },
  {
    label: 'Cake Cutting',
    titleEn: 'Cake Cutting & Wishes',
    titleHi: 'केक कटिंग व शुभकामनाएँ',
    subtitleEn: 'Candles, Song & Treats',
    time: '07:30 PM',
    attireEn: 'Festive Party Attire',
    attireHi: 'उत्सव पोशाक',
    accentHex: '#DB2777',
    photoIndex: 7,
  },
  {
    label: 'Games & Magic',
    titleEn: 'Games, Magic & Music',
    titleHi: 'मनोरंजन, खेल व संगीत',
    subtitleEn: 'Kids & Family Fun Time',
    time: '06:30 PM',
    attireEn: 'Smart Festive Casual',
    attireHi: 'आरामदायक उत्सव वस्त्र',
    accentHex: '#2563EB',
    photoIndex: 9,
  },
  {
    label: 'Priti Bhoj / Dinner',
    titleEn: 'Swadisht Priti Bhoj',
    titleHi: 'स्नेहिल प्रीतिभोज',
    subtitleEn: 'Dinner & Return Gifts',
    time: '08:30 PM',
    attireEn: 'Ethnic & Festive',
    attireHi: 'उत्सव परिधान',
    accentHex: '#9E2A2B',
    photoIndex: 8,
  },
];

const SONG_PRESETS: Array<{
  id: NonNullable<CardCustomization['songPresetId']>;
  label: string;
  title: string;
}> = [
  { id: 'default', label: 'Theme Default', title: '' },
  { id: 'shehnai', label: 'Shehnai & Santoor', title: 'Mewar Shehnai & Santoor Chime' },
  { id: 'bansuri', label: 'Bansuri Raga', title: 'Raga Yaman Flute & Water Chime' },
  { id: 'dholak', label: 'Haldi Dholak', title: 'Jaipur Dholak & Folk Song Chime' },
  { id: 'temple', label: 'Temple Bells', title: 'Nadaswaram & Temple Bell Chime' },
  { id: 'lullaby', label: 'Janmotsav Chime', title: 'Santoor & Ghungroo Janmotsav Chime' },
];

export const CardCustomizerModal: React.FC<CardCustomizerModalProps> = ({
  theme,
  customization,
  hasCustomChanges,
  onUpdate,
  onReset,
  onClose,
  onSaveAndPreview,
  onOpenShareSuite,
}) => {
  const [activeTab, setActiveTab] = useState<CustomizerTab>('details');
  const [previewLang, setPreviewLang] = useState<Language>(
    customization?.cardLangMode === 'hi' ? 'hi' : 'en'
  );
  const [inputLang, setInputLang] = useState<Language>(customization?.editorInputLang || 'en');
  const [showBothManual, setShowBothManual] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translateStatus, setTranslateStatus] = useState<'idle' | 'synced' | 'offline' | 'error'>('idle');
  const [translateError, setTranslateError] = useState<string | null>(null);
  const [mobileShowPreview, setMobileShowPreview] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [shareUrlPreview, setShareUrlPreview] = useState<string | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const [mediaNotice, setMediaNotice] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingEventIdx, setUploadingEventIdx] = useState<number | null>(null);
  const [uploadingSong, setUploadingSong] = useState(false);
  const [testingSong, setTestingSong] = useState(false);
  const [locationQuery, setLocationQuery] = useState('');
  const [locationSuggestions, setLocationSuggestions] = useState<ResolvedLocationResult[]>([]);
  const [searchingLocations, setSearchingLocations] = useState(false);
  const [resolvingMapLink, setResolvingMapLink] = useState(false);
  const [locationFeedback, setLocationFeedback] = useState<{
    kind: 'success' | 'error';
    text: string;
  } | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);
  const latestCustomRef = useRef<CardCustomization | null>(customization);
  const latestThemeRef = useRef<InviteTheme | null>(theme);
  const pendingFieldsRef = useRef<Map<string, { sourceLang: Language; value: string }>>(new Map());
  const debounceTimerRef = useRef<number | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const locationTimerRef = useRef<number | null>(null);
  const locationAbortRef = useRef<AbortController | null>(null);

  latestCustomRef.current = customization;
  latestThemeRef.current = theme;

  useEffect(() => {
    setActiveTab('details');
    setMobileShowPreview(false);
    setCopiedLink(false);
    setShareUrlPreview(null);
    setMediaNotice(null);
    setTestingSong(false);
    setTranslateStatus('idle');
    setTranslateError(null);
    setLocationQuery('');
    setLocationSuggestions([]);
    setLocationFeedback(null);
    setShowLocationDropdown(false);
    setSearchingLocations(false);
    setResolvingMapLink(false);
    setInputLang(customization?.editorInputLang || 'en');
    setPreviewLang(customization?.cardLangMode === 'hi' ? 'hi' : 'en');
    pendingFieldsRef.current.clear();
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (locationTimerRef.current) {
      window.clearTimeout(locationTimerRef.current);
      locationTimerRef.current = null;
    }
    if (locationAbortRef.current) {
      locationAbortRef.current.abort();
      locationAbortRef.current = null;
    }
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      testAudioRef.current = null;
    }
    setExpandedEventId(customization?.events[0]?.id ?? null);
  }, [theme?.id]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (locationTimerRef.current) {
        window.clearTimeout(locationTimerRef.current);
      }
      if (locationAbortRef.current) {
        locationAbortRef.current.abort();
      }
      if (testAudioRef.current) {
        testAudioRef.current.pause();
        testAudioRef.current = null;
      }
    };
  }, []);

  const defaultCustomization = React.useMemo(
    () =>
      theme ? getDefaultCustomization(theme, COUPLE_DEFAULTS.groomEn, COUPLE_DEFAULTS.brideEn) : null,
    [theme]
  );

  if (!theme || !customization || !defaultCustomization) return null;

  const isBirthday = theme.celebrationType === 'birthday';
  const isGirlHindu = theme.birthdayFlavor === 'hindu' && theme.birthdayGender === 'girl';
  const isBoyHindu = theme.birthdayFlavor === 'hindu' && theme.birthdayGender === 'boy';
  const isBaby = theme.birthdayFlavor === 'baby';
  const cardLangMode: CardLanguageMode = customization.cardLangMode || 'both';
  const otherLang: Language = inputLang === 'en' ? 'hi' : 'en';

  const primaryNameLabelEn = isGirlHindu
    ? "Girl's Name"
    : isBoyHindu
      ? "Boy's Name"
      : isBaby
        ? "Baby's First Name"
        : isBirthday
          ? 'Celebrant Name'
          : 'Groom Name';
  const primaryNameLabelHi = isGirlHindu
    ? 'लड़की का नाम (हिन्दी)'
    : isBoyHindu
      ? 'लड़के का नाम (हिन्दी)'
      : isBaby
        ? 'शिशु का नाम (हिन्दी)'
        : isBirthday
          ? 'जन्मदिन नाम (हिन्दी)'
          : 'वर का नाम (हिन्दी)';

  const TOP_FIELD_PAIRS: Record<
    string,
    { en: keyof CardCustomization; hi: keyof CardCustomization }
  > = {
    primaryName: { en: 'primaryName', hi: 'primaryNameHi' },
    partnerName: { en: 'partnerName', hi: 'partnerNameHi' },
    milestoneLabel: { en: 'milestoneLabel', hi: 'milestoneLabelHi' },
    dateLabel: { en: 'dateLabel', hi: 'dateLabelHi' },
    cityLabel: { en: 'cityLabel', hi: 'cityLabelHi' },
    venueName: { en: 'venueName', hi: 'venueNameHi' },
    groomParents: { en: 'groomParentsEn', hi: 'groomParentsHi' },
    brideParents: { en: 'brideParentsEn', hi: 'brideParentsHi' },
    littleOnesLine: { en: 'littleOnesLineEn', hi: 'littleOnesLineHi' },
    littleOnesNames: { en: 'littleOnesNamesEn', hi: 'littleOnesNamesHi' },
    personalNote: { en: 'personalNoteEn', hi: 'personalNoteHi' },
    parentsBlessing: { en: 'parentsBlessingEn', hi: 'parentsBlessingHi' },
    directionsNote: { en: 'directionsNote', hi: 'directionsNoteHi' },
    rsvpDeadline: { en: 'rsvpDeadline', hi: 'rsvpDeadlineHi' },
  };

  const applyTranslatedMap = (
    targetLang: Language,
    translated: Record<string, string>,
    sentSnapshot: Map<string, string>
  ) => {
    const current = latestCustomRef.current;
    const currentTheme = latestThemeRef.current;
    if (!current || !currentTheme) return;

    let next: CardCustomization = { ...current };
    let eventsPatched = false;
    let nextEvents = current.events;

    for (const [key, convertedVal] of Object.entries(translated)) {
      if (!convertedVal) continue;
      if (key.startsWith('ev:')) {
        const parts = key.split(':');
        const evId = parts[1];
        const evField = parts[2] as 'title' | 'date' | 'venue' | 'attire';
        if (!evId || !evField) continue;
        if (!eventsPatched) {
          nextEvents = current.events.map((ev) => ({ ...ev }));
          eventsPatched = true;
        }
        const evIdx = nextEvents.findIndex((ev) => ev.id === evId);
        if (evIdx >= 0) {
          const propMap: Record<'title' | 'date' | 'venue' | 'attire', keyof CustomEventItem> =
            targetLang === 'hi'
              ? { title: 'titleHi', date: 'dateHi', venue: 'venueHi', attire: 'attireHi' }
              : { title: 'titleEn', date: 'dateEn', venue: 'venueEn', attire: 'attireEn' };
          (nextEvents[evIdx] as unknown as Record<string, unknown>)[propMap[evField]] = convertedVal;
        }
      } else if (TOP_FIELD_PAIRS[key]) {
        const targetProp = targetLang === 'hi' ? TOP_FIELD_PAIRS[key].hi : TOP_FIELD_PAIRS[key].en;
        (next as unknown as Record<string, unknown>)[targetProp] = convertedVal;
      }

      const pendingEntry = pendingFieldsRef.current.get(key);
      if (pendingEntry && pendingEntry.value === sentSnapshot.get(key)) {
        pendingFieldsRef.current.delete(key);
      }
    }

    if (eventsPatched) {
      next = { ...next, events: nextEvents };
    }
    next.updatedAt = Date.now();
    onUpdate(currentTheme.id, next);
  };

  const collectAllFieldsForSync = (current: CardCustomization, source: Language) => {
    const fieldsToConvert: Record<string, string> = {};
    const sentSnapshot = new Map<string, string>();
    for (const [pairKey, pair] of Object.entries(TOP_FIELD_PAIRS)) {
      if (isBirthday && (pairKey === 'partnerName' || pairKey === 'littleOnesLine' || pairKey === 'littleOnesNames')) {
        continue;
      }
      if (!isBirthday && pairKey === 'milestoneLabel') {
        continue;
      }
      const sourceProp = source === 'hi' ? pair.hi : pair.en;
      const val = String((current as unknown as Record<string, unknown>)[sourceProp] || '').trim();
      if (val) {
        fieldsToConvert[pairKey] = val;
        sentSnapshot.set(pairKey, val);
      }
    }

    current.events.forEach((ev) => {
      const pairs: Array<['title' | 'date' | 'venue' | 'attire', string]> =
        source === 'hi'
          ? [
              ['title', ev.titleHi],
              ['date', ev.dateHi],
              ['venue', ev.venueHi],
              ['attire', ev.attireHi],
            ]
          : [
              ['title', ev.titleEn],
              ['date', ev.dateEn],
              ['venue', ev.venueEn],
              ['attire', ev.attireEn],
            ];
      pairs.forEach(([field, val]) => {
        if (val?.trim()) {
          const k = `ev:${ev.id}:${field}`;
          fieldsToConvert[k] = val.trim();
          sentSnapshot.set(k, val.trim());
        }
      });
    });

    return { fieldsToConvert, sentSnapshot };
  };

  const flushPendingTranslations = async (explicitSource?: Language) => {
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }

    const current = latestCustomRef.current;
    const currentTheme = latestThemeRef.current;
    if (!current || !currentTheme) return;

    const mode = current.cardLangMode || 'both';
    const source = explicitSource || inputLang;
    const target: Language = source === 'en' ? 'hi' : 'en';

    // Skip work if the card is locked strictly to the exact language the user is typing in
    if ((mode === 'en' && source === 'en') || (mode === 'hi' && source === 'hi')) {
      pendingFieldsRef.current.clear();
      return;
    }

    const batch: Record<string, string> = {};
    const sentSnapshot = new Map<string, string>();
    pendingFieldsRef.current.forEach((entry, key) => {
      if (entry.sourceLang === source && entry.value.trim()) {
        batch[key] = entry.value;
        sentSnapshot.set(key, entry.value);
      }
    });

    if (Object.keys(batch).length === 0) return;

    // Instant deterministic local converter when browser is offline
    if (isBrowserOffline()) {
      const localConverted = offlineTranslateInviteFields({
        sourceLang: source,
        targetLang: target,
        fields: batch,
      });
      applyTranslatedMap(target, localConverted, sentSnapshot);
      setTranslateStatus('offline');
      setTranslateError(null);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setTranslating(true);
    setTranslateError(null);
    try {
      const translated = await translateInviteFields({
        sourceLang: source,
        targetLang: target,
        isBirthday: currentTheme.celebrationType === 'birthday',
        fields: batch,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      applyTranslatedMap(target, translated, sentSnapshot);
      setTranslateStatus('synced');
    } catch (err) {
      if (controller.signal.aborted) return;
      setTranslateStatus('error');
      setTranslateError(
        err instanceof Error ? err.message : 'Auto-conversion failed. Retry online or use Convert Offline.'
      );
    } finally {
      if (!controller.signal.aborted) {
        setTranslating(false);
      }
    }
  };

  const queueAutoTranslate = (key: string, sourceLang: Language, value: string) => {
    const mode = latestCustomRef.current?.cardLangMode || 'both';
    if ((mode === 'en' && sourceLang === 'en') || (mode === 'hi' && sourceLang === 'hi')) {
      return;
    }
    if (!value.trim()) {
      pendingFieldsRef.current.delete(key);
      return;
    }
    pendingFieldsRef.current.set(key, { sourceLang, value });
    setTranslateStatus('idle');
    setTranslateError(null);
    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = window.setTimeout(() => {
      void flushPendingTranslations(sourceLang);
    }, isBrowserOffline() ? 350 : 900);
  };

  const handleConvertOfflineNow = (sourceOverride?: Language) => {
    const current = latestCustomRef.current;
    if (!current) return;
    const source = sourceOverride || inputLang;
    const target: Language = source === 'en' ? 'hi' : 'en';
    const { fieldsToConvert, sentSnapshot } = collectAllFieldsForSync(current, source);
    if (Object.keys(fieldsToConvert).length === 0) return;

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    const converted = offlineTranslateInviteFields({
      sourceLang: source,
      targetLang: target,
      fields: fieldsToConvert,
    });
    applyTranslatedMap(target, converted, sentSnapshot);
    pendingFieldsRef.current.clear();
    setTranslating(false);
    setTranslateError(null);
    setTranslateStatus('offline');
  };

  const handleSyncAllNow = async (sourceOverride?: Language) => {
    const current = latestCustomRef.current;
    const currentTheme = latestThemeRef.current;
    if (!current || !currentTheme) return;

    const source = sourceOverride || inputLang;
    const target: Language = source === 'en' ? 'hi' : 'en';
    const { fieldsToConvert, sentSnapshot } = collectAllFieldsForSync(current, source);

    if (Object.keys(fieldsToConvert).length === 0) return;

    if (isBrowserOffline()) {
      handleConvertOfflineNow(source);
      return;
    }

    if (debounceTimerRef.current) {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = null;
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setTranslating(true);
    setTranslateError(null);
    try {
      const translated = await translateInviteFields({
        sourceLang: source,
        targetLang: target,
        isBirthday: currentTheme.celebrationType === 'birthday',
        fields: fieldsToConvert,
        signal: controller.signal,
      });
      if (controller.signal.aborted) return;
      applyTranslatedMap(target, translated, sentSnapshot);
      pendingFieldsRef.current.clear();
      setTranslateStatus('synced');
    } catch (err) {
      if (controller.signal.aborted) return;
      setTranslateStatus('error');
      setTranslateError(
        err instanceof Error
          ? err.message
          : 'Online sync failed. Click Retry Online or Convert Offline Now.'
      );
    } finally {
      if (!controller.signal.aborted) {
        setTranslating(false);
      }
    }
  };

  const applyResolvedLocation = (loc: ResolvedLocationResult) => {
    const current = latestCustomRef.current;
    const currentTheme = latestThemeRef.current;
    if (!current || !currentTheme) return;

    const nextVenue = loc.venueName?.trim() || current.venueName;
    const nextCity = loc.cityLabel?.trim() || current.cityLabel;
    const nextDirections = loc.fullAddress?.trim() || current.directionsNote;
    const nextMapUrl = loc.mapUrl?.trim() || current.venueMapUrl || '';

    const nextFields: Record<string, string> = {};
    if (nextVenue) nextFields.venueName = nextVenue;
    if (nextCity) nextFields.cityLabel = nextCity;
    if (nextDirections) nextFields.directionsNote = nextDirections;

    // Immediately convert Hindi counterparts locally so Hindi card updates without delay,
    // then also queue online refinement if online and bilingual/Hindi mode is active.
    const localHi = offlineTranslateInviteFields({
      sourceLang: 'en',
      targetLang: 'hi',
      fields: nextFields,
    });

    const nextCustom: CardCustomization = {
      ...current,
      venueName: nextVenue,
      cityLabel: nextCity,
      directionsNote: nextDirections,
      venueMapUrl: nextMapUrl,
      ...(localHi.venueName ? { venueNameHi: localHi.venueName } : {}),
      ...(localHi.cityLabel ? { cityLabelHi: localHi.cityLabel } : {}),
      ...(localHi.directionsNote ? { directionsNoteHi: localHi.directionsNote } : {}),
      updatedAt: Date.now(),
    };
    onUpdate(currentTheme.id, nextCustom);
    setLocationQuery(loc.label || loc.venueName || '');
    setLocationSuggestions([]);
    setShowLocationDropdown(false);
    setLocationFeedback({
      kind: 'success',
      text: `Auto-filled Venue${nextCity ? ', City' : ''}${nextDirections ? ', Address' : ''} & Map Pin!`,
    });

    if (!isBrowserOffline() && (current.cardLangMode || 'both') !== 'en') {
      Object.entries(nextFields).forEach(([k, v]) => {
        pendingFieldsRef.current.set(k, { sourceLang: 'en', value: v });
      });
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = window.setTimeout(() => {
        void flushPendingTranslations('en');
      }, 450);
    }
  };

  const handleSelectLocationSuggestion = (item: ResolvedLocationResult) => {
    setShowLocationDropdown(false);
    setLocationSuggestions([]);
    setLocationFeedback(null);
    applyResolvedLocation(item);
  };

  const runLocationSearchNow = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed) return;

    if (locationTimerRef.current) {
      window.clearTimeout(locationTimerRef.current);
      locationTimerRef.current = null;
    }
    if (locationAbortRef.current) {
      locationAbortRef.current.abort();
      locationAbortRef.current = null;
    }

    if (isLikelyMapUrl(trimmed)) {
      setShowLocationDropdown(false);
      setSearchingLocations(false);
      updateField('venueMapUrl', trimmed);
      void handleResolveMapLink(trimmed);
      return;
    }

    const localItem = parseRawAddressOrPlusCodeLocally(trimmed);
    setSearchingLocations(false);
    if (localItem) {
      setLocationSuggestions([localItem]);
      setShowLocationDropdown(true);
      setLocationFeedback(null);
    } else {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      setLocationFeedback({
        kind: 'error',
        text: 'Enter a venue name, colony/city address, Plus Code, or paste a Google Maps share link.',
      });
    }
  };

  const handleResolveMapLink = async (rawInput?: string) => {
    const targetUrl = (rawInput ?? customization.venueMapUrl ?? locationQuery).trim();
    if (!targetUrl) {
      setLocationFeedback({
        kind: 'error',
        text: 'Paste a Google Maps link or address first.',
      });
      return;
    }
    if (locationAbortRef.current) {
      locationAbortRef.current.abort();
    }
    const controller = new AbortController();
    locationAbortRef.current = controller;
    setResolvingMapLink(true);
    setLocationFeedback(null);
    try {
      const resolved = await resolveLocationZeroApi(targetUrl, controller.signal);
      if (controller.signal.aborted) return;
      applyResolvedLocation(resolved);
    } catch (err) {
      if (controller.signal.aborted) return;
      setLocationFeedback({
        kind: 'error',
        text:
          err instanceof Error
            ? err.message
            : 'Could not extract details from this map link. Try typing the full address instead.',
      });
    } finally {
      if (!controller.signal.aborted) {
        setResolvingMapLink(false);
      }
    }
  };

  const handleLocationQueryChange = (val: string) => {
    setLocationQuery(val);
    setLocationFeedback(null);

    if (locationTimerRef.current) {
      window.clearTimeout(locationTimerRef.current);
      locationTimerRef.current = null;
    }
    if (locationAbortRef.current) {
      locationAbortRef.current.abort();
      locationAbortRef.current = null;
    }

    const trimmed = val.trim();
    if (!trimmed) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      setSearchingLocations(false);
      return;
    }

    if (isLikelyMapUrl(trimmed)) {
      setShowLocationDropdown(false);
      updateField('venueMapUrl', trimmed);
      void handleResolveMapLink(trimmed);
      return;
    }

    if (trimmed.length < 2) {
      setLocationSuggestions([]);
      setShowLocationDropdown(false);
      setSearchingLocations(false);
      return;
    }

    const localItem = parseRawAddressOrPlusCodeLocally(trimmed);
    setLocationSuggestions(localItem ? [localItem] : []);
    setShowLocationDropdown(Boolean(localItem));
    setSearchingLocations(false);
  };

  const handleApplyVenueToAllEvents = () => {
    const current = latestCustomRef.current;
    if (!current || current.events.length === 0) return;
    const vEn = current.venueName.trim() || current.cityLabel.trim();
    const vHi = current.venueNameHi?.trim() || current.cityLabelHi?.trim() || vEn;
    if (!vEn) return;
    const nextEvents = current.events.map((ev) => ({
      ...ev,
      venueEn: vEn,
      venueHi: vHi,
    }));
    updateField('events', nextEvents);
    setLocationFeedback({
      kind: 'success',
      text: `Applied "${vEn}" to all ${nextEvents.length} events!`,
    });
  };

  const updateField = <K extends keyof CardCustomization>(
    field: K,
    value: CardCustomization[K]
  ) => {
    onUpdate(theme.id, {
      ...customization,
      [field]: value,
      updatedAt: Date.now(),
    });
  };

  const updateBilingualField = (pairKey: keyof typeof TOP_FIELD_PAIRS, lang: Language, value: string) => {
    const pair = TOP_FIELD_PAIRS[pairKey];
    const primaryProp = lang === 'hi' ? pair.hi : pair.en;
    const mirrorProp = lang === 'hi' ? pair.en : pair.hi;
    const patch: Partial<CardCustomization> = {
      [primaryProp]: value,
    };
    if (!value.trim()) {
      (patch as Record<string, unknown>)[mirrorProp] = '';
    }
    onUpdate(theme.id, {
      ...customization,
      ...patch,
      updatedAt: Date.now(),
    });
    if (lang === inputLang) {
      queueAutoTranslate(String(pairKey), lang, value);
    }
  };

  const handleChangeInputLang = (nextLang: Language) => {
    if (nextLang === inputLang) return;
    void flushPendingTranslations(inputLang);
    setInputLang(nextLang);
    updateField('editorInputLang', nextLang);
    if (cardLangMode === 'both') {
      setPreviewLang(nextLang);
    }
  };

  const handleChangeCardLangMode = (nextMode: CardLanguageMode) => {
    onUpdate(theme.id, {
      ...customization,
      cardLangMode: nextMode,
      updatedAt: Date.now(),
    });
    if (nextMode === 'hi') {
      setPreviewLang('hi');
      if (inputLang === 'en' && pendingFieldsRef.current.size > 0) {
        void flushPendingTranslations('en');
      }
    } else if (nextMode === 'en') {
      setPreviewLang('en');
      if (inputLang === 'hi' && pendingFieldsRef.current.size > 0) {
        void flushPendingTranslations('hi');
      }
    }
  };

  const toggleSection = (key: CardSectionKey) => {
    onUpdate(theme.id, {
      ...customization,
      enabledSections: {
        ...customization.enabledSections,
        [key]: !customization.enabledSections[key],
      },
      updatedAt: Date.now(),
    });
  };

  const defaultPortraitImage = isBirthday
    ? BIRTHDAY_STAR_PORTRAIT_IMAGE
    : ROYAL_COUPLE_PORTRAIT_IMAGE;

  const applySectionPreset = (preset: 'full' | 'essential' | 'minimal') => {
    const nextSections: Record<CardSectionKey, boolean> =
      preset === 'full'
        ? {
            note: true,
            scratch: true,
            formal: !isBirthday,
            timeline: true,
            countdown: true,
            map: true,
            swatches: true,
            elders: true,
            song: true,
            rsvp: true,
          }
        : preset === 'essential'
          ? {
              note: true,
              scratch: true,
              formal: !isBirthday,
              timeline: true,
              countdown: true,
              map: true,
              swatches: false,
              elders: true,
              song: false,
              rsvp: true,
            }
          : {
              note: true,
              scratch: true,
              formal: !isBirthday,
              timeline: false,
              countdown: false,
              map: true,
              swatches: false,
              elders: false,
              song: false,
              rsvp: true,
            };

    onUpdate(theme.id, {
      ...customization,
      enabledSections: nextSections,
      updatedAt: Date.now(),
    });
  };

  const updateEvent = (idx: number, patch: Partial<CustomEventItem>) => {
    const nextEvents = customization.events.map((ev, i) =>
      i === idx ? { ...ev, ...patch } : ev
    );
    updateField('events', nextEvents);
  };

  const updateEventBilingualField = (
    idx: number,
    evId: string,
    field: 'title' | 'date' | 'venue' | 'attire',
    lang: Language,
    value: string
  ) => {
    const propMap: Record<'title' | 'date' | 'venue' | 'attire', { en: keyof CustomEventItem; hi: keyof CustomEventItem }> = {
      title: { en: 'titleEn', hi: 'titleHi' },
      date: { en: 'dateEn', hi: 'dateHi' },
      venue: { en: 'venueEn', hi: 'venueHi' },
      attire: { en: 'attireEn', hi: 'attireHi' },
    };
    const primaryKey = lang === 'hi' ? propMap[field].hi : propMap[field].en;
    const mirrorKey = lang === 'hi' ? propMap[field].en : propMap[field].hi;
    const patch: Partial<CustomEventItem> = {
      [primaryKey]: value,
    };
    if (!value.trim()) {
      (patch as Record<string, unknown>)[mirrorKey] = '';
    }
    updateEvent(idx, patch);
    if (lang === inputLang) {
      queueAutoTranslate(`ev:${evId}:${field}`, lang, value);
    }
  };

  const removeEvent = (idx: number) => {
    const nextEvents = customization.events.filter((_, i) => i !== idx);
    updateField('events', nextEvents);
  };

  const addEvent = (preset?: (typeof WEDDING_QUICK_EVENT_PRESETS)[number]) => {
    const id = `custom-${Date.now().toString(36)}`;
    const photo = CURATED_EVENT_PHOTOS[preset?.photoIndex ?? 0] || CURATED_EVENT_PHOTOS[0];
    const newItem: CustomEventItem = {
      id,
      titleEn: preset ? preset.titleEn : 'Special Celebration',
      titleHi: preset ? preset.titleHi : 'विशेष कार्यक्रम',
      subtitleEn: preset ? preset.subtitleEn : 'Family Gathering',
      dateEn: customization.dateLabel || '12 Nov 2026',
      dateHi: customization.dateLabelHi || customization.dateLabel || '12 नवम्बर 2026',
      time: preset ? preset.time : '06:00 PM',
      venueEn: customization.venueName || 'Main Courtyard',
      venueHi: customization.venueNameHi || customization.venueName || 'मुख्य प्रांगण',
      attireEn: preset ? preset.attireEn : 'Festive Traditional',
      attireHi: preset ? preset.attireHi : 'पारंपरिक उत्सव परिधान',
      accentHex: preset ? preset.accentHex : theme.accentHex,
      image: photo.src,
      imageAlt: `${preset ? preset.titleEn : 'Event'} artwork`,
      swatchColors: [preset?.accentHex || theme.accentHex, '#C88A2B', '#FAF6EE'],
    };
    const nextEvents = [...customization.events, newItem];
    updateField('events', nextEvents);
    setExpandedEventId(id);
    if (!customization.enabledSections.timeline) {
      onUpdate(theme.id, {
        ...customization,
        events: nextEvents,
        enabledSections: {
          ...customization.enabledSections,
          timeline: true,
        },
        updatedAt: Date.now(),
      });
    }
  };

  const handleCopyShareLink = async () => {
    if (pendingFieldsRef.current.size > 0) {
      await flushPendingTranslations(inputLang);
    }
    const url = encodeShareUrl(theme, latestCustomRef.current || customization);
    setShareUrlPreview(url);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingCover(true);
    setMediaNotice(null);
    try {
      const dataUrl = await compressImageToDataUrl(file, 960, 0.8);
      onUpdate(theme.id, {
        ...customization,
        couplePhotoUrl: dataUrl,
        customCoverImage: '',
        updatedAt: Date.now(),
      });
      setMediaNotice('Framed Portrait Photo updated inside your card!');
    } catch (err) {
      setMediaNotice(err instanceof Error ? err.message : 'Could not upload portrait photo.');
    } finally {
      setUploadingCover(false);
    }
  };

  const handleEventPhotoUpload = async (
    idx: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingEventIdx(idx);
    setMediaNotice(null);
    try {
      const dataUrl = await compressImageToDataUrl(file, 720, 0.78);
      updateEvent(idx, { image: dataUrl });
      setMediaNotice('Event photo updated.');
    } catch (err) {
      setMediaNotice(err instanceof Error ? err.message : 'Could not upload ceremony photo.');
    } finally {
      setUploadingEventIdx(null);
    }
  };

  const handleSongUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setUploadingSong(true);
    setMediaNotice(null);
    try {
      const { audioKey, fileName } = await storeCustomAudio(theme.id, file);
      const cleanTrackName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]+/g, ' ');
      onUpdate(theme.id, {
        ...customization,
        songAudioKey: audioKey,
        songFileName: fileName,
        songUrl: '',
        songTitle: cleanTrackName || customization.songTitle,
        enabledSections: {
          ...customization.enabledSections,
          song: true,
        },
        updatedAt: Date.now(),
      });
      setMediaNotice(`Song "${fileName}" uploaded and enabled on this card.`);
    } catch (err) {
      setMediaNotice(err instanceof Error ? err.message : 'Could not upload audio track.');
    } finally {
      setUploadingSong(false);
    }
  };

  const handleRemoveSong = async () => {
    if (testAudioRef.current) {
      testAudioRef.current.pause();
      testAudioRef.current = null;
      setTestingSong(false);
    }
    if (customization.songAudioKey) {
      await deleteCustomAudio(customization.songAudioKey);
    }
    onUpdate(theme.id, {
      ...customization,
      songAudioKey: undefined,
      songFileName: '',
      songUrl: '',
      updatedAt: Date.now(),
    });
  };

  const handleToggleTestSong = async () => {
    if (testingSong && testAudioRef.current) {
      testAudioRef.current.pause();
      setTestingSong(false);
      return;
    }
    let src = customization.songUrl?.trim() || '';
    if (!src && customization.songAudioKey) {
      src = (await loadCustomAudioUrl(customization.songAudioKey)) || '';
    }
    if (!src) {
      setMediaNotice('Upload an MP3/M4A file or paste a direct audio URL first.');
      return;
    }
    try {
      if (!testAudioRef.current) {
        testAudioRef.current = new Audio();
      }
      testAudioRef.current.src = src;
      testAudioRef.current.onended = () => setTestingSong(false);
      await testAudioRef.current.play();
      setTestingSong(true);
    } catch {
      setMediaNotice('Browser could not play this audio link directly.');
      setTestingSong(false);
    }
  };

  const applicableSections = SECTION_META.filter(
    (sec) => !(isBirthday && sec.key === 'formal')
  );
  const totalSectionsCount = applicableSections.length;
  const enabledCount = applicableSections.filter(
    (sec) => customization.enabledSections[sec.key] !== false
  ).length;
  const activeQuickPresets = isBirthday
    ? BIRTHDAY_QUICK_EVENT_PRESETS
    : WEDDING_QUICK_EVENT_PRESETS;

  return (
    <AnimatePresence>
      <motion.div
        key={`customizer-${theme.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#120D0A]/80 p-2 sm:p-5 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.96, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.96, opacity: 0, y: 14 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="customizer-modal-title"
          className="relative flex h-[92dvh] max-h-[820px] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#C88A2B]/45 bg-[#FAF6EE] text-[#231B15] shadow-[0_32px_90px_rgba(0,0,0,0.65)]"
        >
          {/* Top Modal Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D8C8AA] bg-[#F2EAD9] px-4 py-3 sm:px-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[#6D5A49]">
                <span className="font-semibold text-[#9E2A2B]">{theme.indexLabel}</span>
                <span aria-hidden="true">·</span>
                <span>{hasCustomChanges ? 'Saved to this card' : 'Card Studio Customizer'}</span>
              </div>
              <h2
                id="customizer-modal-title"
                className="font-display text-xl sm:text-2xl font-semibold leading-tight text-[#231B15] truncate"
              >
                Customize {theme.name}{' '}
                <span className="font-hindi text-base sm:text-lg text-[#9E2A2B]">
                  ({theme.nameHi})
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setMobileShowPreview((v) => !v)}
                className="inline-flex lg:hidden items-center gap-1.5 min-h-10 rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-1.5 text-xs font-medium text-[#231B15] cursor-pointer whitespace-nowrap shrink-0"
              >
                <Eye className="h-3.5 w-3.5 text-[#9E2A2B]" />
                <span>{mobileShowPreview ? 'Edit Fields' : 'Live Preview'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyShareLink}
                className="inline-flex items-center gap-1.5 min-h-10 rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-1.5 text-xs font-medium text-[#231B15] hover:bg-[#EDE2CE] cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                    <span>Link Copied</span>
                  </>
                ) : (
                  <>
                    <Link2 className="h-3.5 w-3.5 text-[#9E2A2B]" />
                    <span className="hidden sm:inline">Copy Custom Link</span>
                    <span className="sm:hidden">Share</span>
                  </>
                )}
              </button>

              {hasCustomChanges && (
                <button
                  type="button"
                  onClick={() => onReset(theme.id)}
                  title="Reset this card to default"
                  className="inline-flex items-center gap-1 min-h-10 rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs font-medium text-[#6D5A49] hover:text-[#9E2A2B] cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Reset</span>
                </button>
              )}

              <button
                type="button"
                onClick={onClose}
                aria-label="Close card customizer"
                className="grid size-10 place-items-center rounded-lg border border-[#C8B493] bg-[#FAF6EE] text-[#231B15] hover:bg-[#9E2A2B] hover:text-white cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {shareUrlPreview && copiedLink && (
            <div className="border-b border-[#D8C8AA] bg-emerald-50 px-4 py-2 text-xs text-emerald-900 flex items-center justify-between gap-3">
              <span className="truncate">
                Compact shareable URL copied:{' '}
                <span className="font-mono text-[11px] underline">{shareUrlPreview}</span>
              </span>
            </div>
          )}

          {/* Split Body: Left Editor + Right Live Interactive Card */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_355px] overflow-hidden">
            {/* LEFT: Tabs & Editor Controls */}
            <div
              className={`${
                mobileShowPreview ? 'hidden lg:flex' : 'flex'
              } flex-col min-h-0 overflow-hidden bg-[#FAF6EE]`}
            >
              {/* Segmented Navigation Tabs */}
              <div className="border-b border-[#D8C8AA] bg-[#F7F1E5] px-4 py-2.5 sm:px-6">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                  {[
                    {
                      id: 'details' as CustomizerTab,
                      label: '1. Names & Details',
                      icon: FileText,
                    },
                    {
                      id: 'sections' as CustomizerTab,
                      label: `2. Add / Remove Options (${enabledCount}/${totalSectionsCount})`,
                      icon: Layers,
                    },
                    {
                      id: 'events' as CustomizerTab,
                      label: `3. Events (${customization.events.length})`,
                      icon: Calendar,
                    },
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`inline-flex items-center gap-1.5 min-h-10 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#9E2A2B] text-[#FAF6EE] shadow-sm'
                            : 'bg-[#FAF6EE] border border-[#D8C8AA] text-[#4A3B2F] hover:text-[#231B15]'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Scrollable Tab Content */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
                {mediaNotice && (
                  <div className="rounded-xl border border-[#C88A2B]/50 bg-[#FDF5E4] px-3.5 py-2 text-xs text-[#3A271B] flex items-center justify-between gap-2">
                    <span>{mediaNotice}</span>
                    <button
                      type="button"
                      onClick={() => setMediaNotice(null)}
                      className="text-[11px] font-semibold text-[#9E2A2B] cursor-pointer shrink-0"
                    >
                      OK
                    </button>
                  </div>
                )}

                {(activeTab === 'details' || activeTab === 'events') && (
                  <div className="rounded-xl border border-[#C88A2B]/55 bg-[#FFFDF8] p-3.5 space-y-2.5 shadow-2xs">
                    <div className="flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9E2A2B]">
                          <Languages className="h-3.5 w-3.5" />
                          <span>Fill Form In:</span>
                        </span>
                        <div className="inline-flex rounded-lg border border-[#D8C8AA] bg-[#F5EFE2] p-0.5">
                          <button
                            type="button"
                            onClick={() => handleChangeInputLang('en')}
                            className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                              inputLang === 'en'
                                ? 'bg-[#9E2A2B] text-[#FAF6EE] shadow-xs'
                                : 'text-[#4A3B2F] hover:text-[#231B15]'
                            }`}
                          >
                            English
                          </button>
                          <button
                            type="button"
                            onClick={() => handleChangeInputLang('hi')}
                            className={`font-hindi rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors cursor-pointer ${
                              inputLang === 'hi'
                                ? 'bg-[#9E2A2B] text-[#FAF6EE] shadow-xs'
                                : 'text-[#4A3B2F] hover:text-[#231B15]'
                            }`}
                          >
                            हिन्दी
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[11px] font-medium text-[#5C4B3D]">Card View:</span>
                        <div className="inline-flex rounded-lg border border-[#D8C8AA] bg-[#F5EFE2] p-0.5">
                          {(
                            [
                              { id: 'both', label: 'EN + हिन्दी' },
                              { id: 'en', label: 'EN Only' },
                              { id: 'hi', label: 'हिन्दी Only' },
                            ] as const
                          ).map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleChangeCardLangMode(opt.id)}
                              className={`rounded-md px-2 py-1 text-[10.5px] font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                                cardLangMode === opt.id
                                  ? 'bg-[#231B15] text-[#FAF6EE]'
                                  : 'text-[#5C4B3D] hover:text-[#231B15]'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#EFE5D3]">
                      <div className="flex items-center gap-2 text-[11px] text-[#5C4B3D] min-w-0">
                        {translating ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-[#9E2A2B]">
                            <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
                            <span>
                              {otherLang === 'hi'
                                ? 'Converting details to शुद्ध हिन्दी...'
                                : 'Converting details to English...'}
                            </span>
                          </span>
                        ) : translateStatus === 'synced' ? (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                            <Check className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {otherLang === 'hi'
                                ? 'शुद्ध हिन्दी auto-synced across names, dates, venue & events'
                                : 'English auto-synced across names, dates, venue & events'}
                            </span>
                          </span>
                        ) : translateStatus === 'offline' ? (
                          <span className="inline-flex items-center gap-1 font-medium text-amber-800">
                            <WifiOff className="h-3.5 w-3.5 shrink-0" />
                            <span>
                              {otherLang === 'hi'
                                ? 'Converted offline locally to शुद्ध हिन्दी (works without internet)'
                                : 'Converted offline locally to English (works without internet)'}
                            </span>
                          </span>
                        ) : (
                          <span>
                            {cardLangMode === inputLang
                              ? inputLang === 'en'
                                ? 'Card locked to English Only — single-language editing active.'
                                : 'कार्ड केवल हिन्दी मोड में है — सीधे हिन्दी में भरें।'
                              : inputLang === 'en'
                                ? 'Type once in English — शुद्ध हिन्दी auto-converts automatically (works online & offline).'
                                : 'सिर्फ़ हिन्दी में लिखें — English अपने-आप तैयार हो जाएगी (ऑनलाइन व ऑफलाइन दोनों में)।'}
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                        {cardLangMode !== inputLang && (
                          <>
                            <button
                              type="button"
                              disabled={translating}
                              onClick={() => void handleSyncAllNow(inputLang)}
                              className="inline-flex items-center gap-1 rounded-md border border-[#C88A2B]/60 bg-[#FDF5E4] px-2.5 py-1 text-[11px] font-semibold text-[#7A4C10] hover:bg-[#F7E7C6] disabled:opacity-60 cursor-pointer whitespace-nowrap"
                            >
                              <RefreshCw className={`h-3 w-3 ${translating ? 'animate-spin' : ''}`} />
                              <span>
                                {otherLang === 'hi' ? 'Sync to हिन्दी' : 'Sync to English'}
                              </span>
                            </button>
                            <button
                              type="button"
                              disabled={translating}
                              onClick={() => handleConvertOfflineNow(inputLang)}
                              title="Instant local offline conversion without internet"
                              className="inline-flex items-center gap-1 rounded-md border border-[#D8C8AA] bg-[#FAF6EE] px-2 py-1 text-[10.5px] font-medium text-[#5C4B3D] hover:bg-[#EDE2CE] disabled:opacity-60 cursor-pointer whitespace-nowrap"
                            >
                              <WifiOff className="h-3 w-3" />
                              <span>Offline Convert</span>
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => setShowBothManual((v) => !v)}
                          className={`rounded-md border px-2.5 py-1 text-[11px] font-medium cursor-pointer whitespace-nowrap transition-colors ${
                            showBothManual
                              ? 'border-[#9E2A2B] bg-[#FBE7EB] text-[#9E2A2B]'
                              : 'border-[#D8C8AA] bg-white text-[#4A3B2F] hover:bg-[#F5EFE2]'
                          }`}
                        >
                          {showBothManual ? 'Single-Language View' : 'Review / Edit Both'}
                        </button>
                      </div>
                    </div>

                    {translateError && (
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[11px] text-red-800">
                        <span className="inline-flex items-center gap-1.5">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{translateError}</span>
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => void handleSyncAllNow(inputLang)}
                            className="font-semibold text-red-900 underline cursor-pointer"
                          >
                            Retry Online
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConvertOfflineNow(inputLang)}
                            className="rounded-md bg-[#9E2A2B] px-2 py-0.5 text-[10.5px] font-semibold text-white hover:bg-[#7f2021] cursor-pointer"
                          >
                            Convert Offline Now
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'details' && (
                  <>
                    {/* 1. Framed Portrait Photo Upload (ONLY customizable portrait slot) */}
                    <div className="rounded-xl border border-[#D8C8AA] bg-white p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E2A2B]">
                            1. Framed Portrait Photo (अपना पोर्ट्रेट फोटो लगाएं)
                          </h3>
                          <p className="text-[11px] text-[#5C4B3D] mt-0.5">
                            Replaces the default photo inside the rounded portrait frame. Cover &amp; background template artwork are inbuilt and cannot be changed.
                          </p>
                        </div>
                        {customization.couplePhotoUrl && (
                          <button
                            type="button"
                            onClick={() =>
                              onUpdate(theme.id, {
                                ...customization,
                                couplePhotoUrl: '',
                                customCoverImage: '',
                                updatedAt: Date.now(),
                              })
                            }
                            className="inline-flex items-center gap-1 rounded-lg border border-[#9E2A2B]/40 bg-[#FBE7EB] px-2.5 py-1.5 text-[11px] font-semibold text-[#9E2A2B] hover:bg-[#f6d0d8] cursor-pointer whitespace-nowrap"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Reset Default Portrait</span>
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5">
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-xl border border-[#C88A2B]/60 bg-[#F2EAD9]">
                          <img
                            src={customization.couplePhotoUrl?.trim() || defaultPortraitImage}
                            alt="Framed Portrait Preview"
                            className="h-full w-full object-cover object-top"
                          />
                        </div>

                        <div className="flex-1 w-full space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <label className="inline-flex items-center gap-1.5 min-h-9 rounded-lg bg-[#9E2A2B] px-3.5 py-1.5 text-xs font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0">
                              <ImagePlus className="h-3.5 w-3.5" />
                              <span>{uploadingCover ? 'Optimizing Photo...' : 'Upload Portrait Photo'}</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleCoverUpload}
                                className="hidden"
                              />
                            </label>
                            <span className="text-[11px] text-[#6D5A49]">
                              Only updates the framed portrait card inside your invite
                            </span>
                          </div>

                          <input
                            type="url"
                            value={
                              customization.couplePhotoUrl?.startsWith('data:')
                                ? ''
                                : customization.couplePhotoUrl || ''
                            }
                            onChange={(e) => updateField('couplePhotoUrl', e.target.value)}
                            placeholder="Or paste your portrait photo URL (https://...)"
                            className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-1.5 text-xs text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                          />

                          {customization.events.length > 0 && (
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#EFE5D3]">
                              <span className="text-[11px] text-[#6D5A49]">
                                Want to customize Event / Ceremony photos, timings or venues?
                              </span>
                              <button
                                type="button"
                                onClick={() => setActiveTab('events')}
                                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#9E2A2B] hover:underline cursor-pointer whitespace-nowrap"
                              >
                                <Calendar className="h-3 w-3" />
                                <span>Open 3. Events ({customization.events.length}) →</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Names & Milestone */}
                    <div className="rounded-xl border border-[#D8C8AA] bg-white p-4 space-y-3.5">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E2A2B]">
                          {inputLang === 'hi' && !showBothManual
                            ? 'नाम, तारीख एवं आयोजन स्थल (हिन्दी)'
                            : 'Names & Celebration Date'}
                        </h3>
                        <span className="text-[11px] text-[#6D5A49]">Updates cover &amp; inner card</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {(showBothManual || inputLang === 'en') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              {primaryNameLabelEn} {showBothManual ? '(EN)' : ''}
                            </label>
                            <input
                              type="text"
                              value={customization.primaryName}
                              onChange={(e) =>
                                updateBilingualField('primaryName', 'en', e.target.value)
                              }
                              maxLength={28}
                              className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                        {(showBothManual || inputLang === 'hi') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              {primaryNameLabelHi}
                            </label>
                            <input
                              type="text"
                              value={customization.primaryNameHi ?? ''}
                              onChange={(e) =>
                                updateBilingualField('primaryName', 'hi', e.target.value)
                              }
                              placeholder="उदा. आरव"
                              maxLength={32}
                              className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}

                        {!isBirthday ? (
                          <>
                            {(showBothManual || inputLang === 'en') && (
                              <div>
                                <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                                  Bride Name {showBothManual ? '(EN)' : ''}
                                </label>
                                <input
                                  type="text"
                                  value={customization.partnerName}
                                  onChange={(e) =>
                                    updateBilingualField('partnerName', 'en', e.target.value)
                                  }
                                  maxLength={28}
                                  className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                                />
                              </div>
                            )}
                            {(showBothManual || inputLang === 'hi') && (
                              <div>
                                <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                                  वधू का नाम (हिन्दी)
                                </label>
                                <input
                                  type="text"
                                  value={customization.partnerNameHi ?? ''}
                                  onChange={(e) =>
                                    updateBilingualField('partnerName', 'hi', e.target.value)
                                  }
                                  placeholder="उदा. मीरा"
                                  maxLength={32}
                                  className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            {(showBothManual || inputLang === 'en') && (
                              <div>
                                <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                                  Birthday Milestone / Title {showBothManual ? '(EN)' : ''}
                                </label>
                                <input
                                  type="text"
                                  value={customization.milestoneLabel}
                                  onChange={(e) =>
                                    updateBilingualField('milestoneLabel', 'en', e.target.value)
                                  }
                                  placeholder="e.g. 1st Birthday / 5th Janmotsav"
                                  maxLength={36}
                                  className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                                />
                              </div>
                            )}
                            {(showBothManual || inputLang === 'hi') && (
                              <div>
                                <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                                  जन्मोत्सव शीर्षक (हिन्दी)
                                </label>
                                <input
                                  type="text"
                                  value={customization.milestoneLabelHi ?? ''}
                                  onChange={(e) =>
                                    updateBilingualField('milestoneLabel', 'hi', e.target.value)
                                  }
                                  placeholder="उदा. प्रथम जन्मदिन / शुभ जन्मोत्सव"
                                  maxLength={40}
                                  className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                                />
                              </div>
                            )}
                          </>
                        )}

                        {(showBothManual || inputLang === 'en') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              Display Date Text {showBothManual ? '(EN)' : ''}
                            </label>
                            <input
                              type="text"
                              value={customization.dateLabel}
                              onChange={(e) =>
                                updateBilingualField('dateLabel', 'en', e.target.value)
                              }
                              placeholder="12 – 14 February 2027"
                              className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                        {(showBothManual || inputLang === 'hi') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              दिनांक / तिथि (हिन्दी)
                            </label>
                            <input
                              type="text"
                              value={customization.dateLabelHi ?? ''}
                              onChange={(e) =>
                                updateBilingualField('dateLabel', 'hi', e.target.value)
                              }
                              placeholder="12 – 14 फ़रवरी 2027"
                              className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                            {inputLang === 'hi' && !showBothManual
                              ? 'काउंटडाउन व स्क्रैच तारीख/समय'
                              : 'Countdown & Scratch Date/Time'}
                          </label>
                          <input
                            type="datetime-local"
                            value={customization.targetIsoDate}
                            onChange={(e) => updateField('targetIsoDate', e.target.value)}
                            className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                          />
                        </div>

                        {/* Smart Venue & Google Maps Link Auto-Fill */}
                        <div className="sm:col-span-2 rounded-xl border border-[#C88A2B]/50 bg-[#FDF8EC] p-3.5 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9E2A2B]">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>Smart Venue &amp; Google Maps Auto-Fill</span>
                            </span>
                            {customization.events.length > 0 && (customization.venueName.trim() || customization.cityLabel.trim()) && (
                              <button
                                type="button"
                                onClick={handleApplyVenueToAllEvents}
                                className="inline-flex items-center gap-1 rounded-md border border-[#C88A2B]/60 bg-white px-2.5 py-1 text-[10.5px] font-semibold text-[#7A4C10] hover:bg-[#F7E7C6] cursor-pointer whitespace-nowrap"
                              >
                                <Navigation className="h-3 w-3" />
                                <span>Apply venue to all {customization.events.length} events</span>
                              </button>
                            )}
                          </div>

                          <div className="relative">
                            <div className="relative flex items-center">
                              <Search className="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[#8A7562]" />
                              <input
                                type="text"
                                value={locationQuery}
                                onChange={(e) => handleLocationQueryChange(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    if (locationSuggestions.length > 0 && showLocationDropdown) {
                                      void handleSelectLocationSuggestion(locationSuggestions[0]);
                                    } else if (locationQuery.trim().length >= 2) {
                                      void runLocationSearchNow(locationQuery);
                                    }
                                  }
                                }}
                                onFocus={() => {
                                  if (locationSuggestions.length > 0) setShowLocationDropdown(true);
                                }}
                                placeholder="Search hotel, banquet, colony, Plus Code (e.g. C976+5FM...) or Google Maps link..."
                                className="w-full rounded-lg border border-[#C8B493] bg-white pl-8 pr-9 py-2 text-xs text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                              />
                              {(searchingLocations || resolvingMapLink) && (
                                <Loader2 className="absolute right-2.5 h-3.5 w-3.5 animate-spin text-[#9E2A2B]" />
                              )}
                            </div>

                            {showLocationDropdown && locationSuggestions.length > 0 && (
                              <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto rounded-xl border border-[#C8B493] bg-white shadow-xl divide-y divide-[#F0E6D6]">
                                {locationSuggestions.map((item, idx) => (
                                  <button
                                    key={`${item.label}-${idx}`}
                                    type="button"
                                    onClick={() => handleSelectLocationSuggestion(item)}
                                    className="flex w-full items-start gap-2 px-3 py-2 text-left hover:bg-[#FDF5E4] transition-colors cursor-pointer"
                                  >
                                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#9E2A2B]" />
                                    <div className="min-w-0">
                                      <p className="text-xs font-semibold text-[#231B15] truncate">
                                        {`Use address: ${item.venueName}`}
                                      </p>
                                      <p className="text-[11px] text-[#6D5A49] line-clamp-1">
                                        {`${item.cityLabel ? `${item.cityLabel} · ` : ''}Opens directly in Google Maps`}
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="url"
                              value={customization.venueMapUrl || ''}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateField('venueMapUrl', val);
                                if (isLikelyMapUrl(val)) {
                                  void handleResolveMapLink(val);
                                }
                              }}
                              placeholder="Google Maps Link (maps.app.goo.gl/...) or paste any address / Plus Code"
                              className="flex-1 rounded-lg border border-[#C8B493] bg-white px-3 py-1.5 text-xs text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                            <button
                              type="button"
                              disabled={resolvingMapLink}
                              onClick={() => void handleResolveMapLink()}
                              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#9E2A2B] px-3.5 py-1.5 text-xs font-semibold text-[#FAF6EE] hover:bg-[#822021] disabled:opacity-60 cursor-pointer whitespace-nowrap shrink-0"
                            >
                              {resolvingMapLink ? (
                                <>
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  <span>Reading Pin...</span>
                                </>
                              ) : (
                                <>
                                  <MapPin className="h-3.5 w-3.5" />
                                  <span>Auto-Fill Location</span>
                                </>
                              )}
                            </button>
                          </div>

                          {(() => {
                            const previewMapHref =
                              customization.venueMapUrl?.trim() ||
                              buildDirectGoogleMapsUrl(
                                customization.venueName,
                                customization.directionsNote,
                                customization.cityLabel
                              );
                            if (!previewMapHref) return null;
                            return (
                              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5 text-[11px] text-[#6D5A49]">
                                <span>Guests tap &ldquo;Open in Google Maps&rdquo; on the card — 100% free direct redirect.</span>
                                <a
                                  href={previewMapHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 font-semibold text-[#9E2A2B] hover:underline whitespace-nowrap"
                                >
                                  <span>Test in Google Maps</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              </div>
                            );
                          })()}

                          {locationFeedback && (
                            <p
                              className={`text-[11px] font-medium ${
                                locationFeedback.kind === 'success'
                                  ? 'text-emerald-700'
                                  : 'text-red-700'
                              }`}
                            >
                              {locationFeedback.text}
                            </p>
                          )}
                        </div>

                        {(showBothManual || inputLang === 'en') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              City / Region {showBothManual ? '(EN)' : ''}
                            </label>
                            <input
                              type="text"
                              value={customization.cityLabel}
                              onChange={(e) =>
                                updateBilingualField('cityLabel', 'en', e.target.value)
                              }
                              placeholder="Udaipur, Rajasthan"
                              className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                        {(showBothManual || inputLang === 'hi') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              शहर / राज्य (हिन्दी)
                            </label>
                            <input
                              type="text"
                              value={customization.cityLabelHi ?? ''}
                              onChange={(e) =>
                                updateBilingualField('cityLabel', 'hi', e.target.value)
                              }
                              placeholder="उदयपुर, राजस्थान"
                              className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}

                        {(showBothManual || inputLang === 'en') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              Primary Venue Name {showBothManual ? '(EN)' : ''}
                            </label>
                            <input
                              type="text"
                              value={customization.venueName}
                              onChange={(e) =>
                                updateBilingualField('venueName', 'en', e.target.value)
                              }
                              placeholder="e.g. City Palace Courtyard"
                              className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                        {(showBothManual || inputLang === 'hi') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              मुख्य आयोजन स्थल (हिन्दी)
                            </label>
                            <input
                              type="text"
                              value={customization.venueNameHi ?? ''}
                              onChange={(e) =>
                                updateBilingualField('venueName', 'hi', e.target.value)
                              }
                              placeholder="उदा. सिटी पैलेस प्रांगण"
                              className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Side-by-Side Family Parents ("Son of | Daughter of" for Weddings; Parents & Grandparents for Birthdays) */}
                    <div className="rounded-xl border border-[#D8C8AA] bg-white p-4 space-y-4">
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E2A2B]">
                          {isBirthday
                            ? 'Parents & Grandparents (Optional · माता-पिता व दादा-दादी / नाना-नानी)'
                            : 'Family Parents Card (Son of / Daughter of) & Kids’ Bal Manuhar'}
                        </h3>
                        <p className="text-[11px] text-[#5C4B3D] mt-0.5">
                          {isBirthday
                            ? 'Optional: Leave blank if not needed — empty names and their headings automatically hide from the card.'
                            : 'Fill once in your chosen language — the other language converts automatically.'}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {(showBothManual || inputLang === 'en') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              {isBirthday ? 'Proud Parents / Hosted By (Optional)' : 'Son of — Groom’s Parents'}{' '}
                              {showBothManual ? '(EN)' : ''}
                            </label>
                            <textarea
                              rows={2}
                              value={customization.groomParentsEn || ''}
                              onChange={(e) =>
                                updateBilingualField('groomParents', 'en', e.target.value)
                              }
                              placeholder={
                                isBirthday
                                  ? 'Shri Rajesh Sharma\n& Smt. Sunita Sharma (leave blank to hide)'
                                  : 'Mahesh Singhania\n& Kavita Singhania'
                              }
                              className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-1.5 text-xs text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}

                        {(showBothManual || inputLang === 'en') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              {isBirthday
                                ? 'Grandparents — Dada-Dadi / Nana-Nani (Optional)'
                                : 'Daughter of — Bride’s Parents'}{' '}
                              {showBothManual ? '(EN)' : ''}
                            </label>
                            <textarea
                              rows={2}
                              value={customization.brideParentsEn || ''}
                              onChange={(e) =>
                                updateBilingualField('brideParents', 'en', e.target.value)
                              }
                              placeholder={
                                isBirthday
                                  ? 'Shri Ramprasad Sharma\n& Smt. Savitri Devi (leave blank to hide)'
                                  : 'Alok Rathore\n& Rekha Rathore'
                              }
                              className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-1.5 text-xs text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}

                        {(showBothManual || inputLang === 'hi') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              {isBirthday
                                ? 'माता-पिता / निवेदक (वैकल्पिक)'
                                : 'सुपुत्र — वर के माता-पिता (हिन्दी)'}
                            </label>
                            <textarea
                              rows={2}
                              value={customization.groomParentsHi || ''}
                              onChange={(e) =>
                                updateBilingualField('groomParents', 'hi', e.target.value)
                              }
                              placeholder={
                                isBirthday
                                  ? 'श्री राजेश शर्मा एवं श्रीमती सुनीता शर्मा (न चाहिए तो खाली छोड़ें)'
                                  : 'श्री महेश सिंघानिया एवं श्रीमती कविता सिंघानिया'
                              }
                              className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-1.5 text-xs text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}

                        {(showBothManual || inputLang === 'hi') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              {isBirthday
                                ? 'दादा-दादी / नाना-नानी का नाम (वैकल्पिक)'
                                : 'सुपुत्री — वधू के माता-पिता (हिन्दी)'}
                            </label>
                            <textarea
                              rows={2}
                              value={customization.brideParentsHi || ''}
                              onChange={(e) =>
                                updateBilingualField('brideParents', 'hi', e.target.value)
                              }
                              placeholder={
                                isBirthday
                                  ? 'श्री रामप्रसाद शर्मा एवं श्रीमती सावित्री देवी (न चाहिए तो खाली छोड़ें)'
                                  : 'श्री आलोक राठौड़ एवं श्रीमती रेखा राठौड़'
                              }
                              className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-1.5 text-xs text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                      </div>

                      {/* Little Ones' Cute Invite ("भतीजा / भांजी की बाल मनुहार" — Wedding Only) */}
                      {!isBirthday && (
                        <div className="rounded-lg border border-[#E5D7BF] bg-[#FAF6EE] p-3 space-y-2.5">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-xs font-semibold text-[#9E2A2B]">
                              Little Ones’ Sweet Message (भतीजा / भांजी / छोटे बच्चों की बाल मनुहार)
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {[
                                {
                                  label: 'Chachu (भतीजा/भतीजी)',
                                  en: '“Mele Chachu ki shaadi mein jalool-jalool aana!”',
                                  hi: '“मेले चाचू की शादी में जलूल-जलूल आना!”',
                                },
                                {
                                  label: 'Mama (भांजा/भांजी)',
                                  en: '“Mele Mama ki shaadi mein jalool-jalool aana!”',
                                  hi: '“मेले मामा की शादी में जलूल-जलूल आना!”',
                                },
                                {
                                  label: 'Bua (भतीजा/भतीजी)',
                                  en: '“Meli Bua ki shaadi mein jalool-jalool aana!”',
                                  hi: '“मेली बुआ की शादी में जलूल-जलूल आना!”',
                                },
                                {
                                  label: 'Masi (भांजा/भांजी)',
                                  en: '“Meli Masi ki shaadi mein jalool-jalool aana!”',
                                  hi: '“मेली मासी की शादी में जलूल-जलूल आना!”',
                                },
                              ].map((preset) => (
                                <button
                                  key={preset.label}
                                  type="button"
                                  onClick={() =>
                                    onUpdate(theme.id, {
                                      ...customization,
                                      littleOnesLineEn: preset.en,
                                      littleOnesLineHi: preset.hi,
                                      updatedAt: Date.now(),
                                    })
                                  }
                                  className="rounded-md border border-[#C8B493] bg-white px-2 py-1 text-[10.5px] font-medium text-[#231B15] hover:bg-[#9E2A2B] hover:text-white cursor-pointer transition-colors"
                                >
                                  {preset.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            {(showBothManual || inputLang === 'en') && (
                              <div>
                                <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                  Kids’ Sweet Message {showBothManual ? '(English)' : ''}
                                </label>
                                <input
                                  type="text"
                                  value={(customization.littleOnesLineEn || '').replace(/^#[^\s—–-]+\s*[—–-]?\s*/u, '')}
                                  onChange={(e) =>
                                    updateBilingualField('littleOnesLine', 'en', e.target.value)
                                  }
                                  placeholder="“Mele Chachu ki shaadi mein jalool-jalool aana!”"
                                  className="w-full rounded-lg border border-[#C8B493] bg-white px-2.5 py-1.5 text-xs text-[#231B15]"
                                />
                              </div>
                            )}
                            {(showBothManual || inputLang === 'hi') && (
                              <div>
                                <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                  बच्चों की मनुहार लाइन (हिन्दी)
                                </label>
                                <input
                                  type="text"
                                  value={(customization.littleOnesLineHi || '').replace(/^#[^\s—–-]+\s*[—–-]?\s*/u, '')}
                                  onChange={(e) =>
                                    updateBilingualField('littleOnesLine', 'hi', e.target.value)
                                  }
                                  placeholder="“मेले चाचू की शादी में जलूल-जलूल आना!”"
                                  className="font-hindi w-full rounded-lg border border-[#C8B493] bg-white px-2.5 py-1.5 text-xs text-[#231B15]"
                                />
                              </div>
                            )}
                            {(showBothManual || inputLang === 'en') && (
                              <div>
                                <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                  Little Ones’ Names {showBothManual ? '(EN)' : '(e.g. Nephew & Niece)'}
                                </label>
                                <input
                                  type="text"
                                  value={customization.littleOnesNamesEn || ''}
                                  onChange={(e) =>
                                    updateBilingualField('littleOnesNames', 'en', e.target.value)
                                  }
                                  placeholder="Advik & Ananya (Nephew & Niece)"
                                  className="w-full rounded-lg border border-[#C8B493] bg-white px-2.5 py-1.5 text-xs text-[#231B15]"
                                />
                              </div>
                            )}
                            {(showBothManual || inputLang === 'hi') && (
                              <div>
                                <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                  नन्हे बच्चों के नाम (हिन्दी — भतीजा / भांजी)
                                </label>
                                <input
                                  type="text"
                                  value={customization.littleOnesNamesHi || ''}
                                  onChange={(e) =>
                                    updateBilingualField('littleOnesNames', 'hi', e.target.value)
                                  }
                                  placeholder="नन्हे अद्विक एवं अनन्या (भतीजा व भांजी)"
                                  className="font-hindi w-full rounded-lg border border-[#C8B493] bg-white px-2.5 py-1.5 text-xs text-[#231B15]"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Story, Elders & Directions */}
                    <div className="rounded-xl border border-[#D8C8AA] bg-white p-4 space-y-3.5">
                      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E2A2B]">
                        {inputLang === 'hi' && !showBothManual
                          ? 'निमंत्रण संदेश, बड़ों का आशीर्वाद एवं मार्ग निर्देश'
                          : 'Invitation Quote, Elders & Venue Directions'}
                      </h3>

                      {(showBothManual || inputLang === 'en') && (
                        <div>
                          <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                            Personal Invitation Note {showBothManual ? '(English)' : ''}
                          </label>
                          <textarea
                            rows={2}
                            value={customization.personalNoteEn}
                            onChange={(e) =>
                              updateBilingualField('personalNote', 'en', e.target.value)
                            }
                            className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                          />
                        </div>
                      )}

                      {(showBothManual || inputLang === 'hi') && (
                        <div>
                          <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                            निमंत्रण संदेश (हिन्दी)
                          </label>
                          <textarea
                            rows={2}
                            value={customization.personalNoteHi}
                            onChange={(e) =>
                              updateBilingualField('personalNote', 'hi', e.target.value)
                            }
                            className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                          />
                        </div>
                      )}

                      <div className={`grid grid-cols-1 ${showBothManual ? 'sm:grid-cols-2' : ''} gap-3.5`}>
                        {(showBothManual || inputLang === 'en') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              Parents &amp; Elders Line {showBothManual ? '(EN)' : ''}
                            </label>
                            <input
                              type="text"
                              value={customization.parentsBlessingEn}
                              onChange={(e) =>
                                updateBilingualField('parentsBlessing', 'en', e.target.value)
                              }
                              className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                        {(showBothManual || inputLang === 'hi') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              माता-पिता व बड़ों का आशीर्वाद (हिन्दी)
                            </label>
                            <input
                              type="text"
                              value={customization.parentsBlessingHi}
                              onChange={(e) =>
                                updateBilingualField('parentsBlessing', 'hi', e.target.value)
                              }
                              className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                      </div>

                      <div className={`grid grid-cols-1 ${showBothManual ? 'sm:grid-cols-2' : ''} gap-3.5`}>
                        {(showBothManual || inputLang === 'en') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              Travel / Airport / Parking Directions {showBothManual ? '(EN)' : ''}
                            </label>
                            <input
                              type="text"
                              value={customization.directionsNote}
                              onChange={(e) =>
                                updateBilingualField('directionsNote', 'en', e.target.value)
                              }
                              className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                        {(showBothManual || inputLang === 'hi') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              आगमन, पार्किंग व मार्ग निर्देश (हिन्दी)
                            </label>
                            <input
                              type="text"
                              value={customization.directionsNoteHi ?? ''}
                              onChange={(e) =>
                                updateBilingualField('directionsNote', 'hi', e.target.value)
                              }
                              placeholder="उदा. मुख्य द्वार पर पार्किंग उपलब्ध..."
                              className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Custom Song / Audio Upload & WhatsApp RSVP */}
                    <div className="rounded-xl border border-[#D8C8AA] bg-white p-4 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#9E2A2B]">
                            Your Song &amp; Background Music (अपना गाना लगाएं)
                          </h3>
                          <p className="text-[11px] text-[#5C4B3D] mt-0.5">
                            Upload any MP3/M4A/WAV song or paste an audio URL — plays live when guests open the card.
                          </p>
                        </div>
                        {(customization.songAudioKey || customization.songUrl) && (
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={handleToggleTestSong}
                              className="inline-flex items-center gap-1 rounded-lg border border-[#C88A2B] bg-[#FDF5E4] px-2.5 py-1.5 text-[11px] font-medium text-[#231B15] hover:bg-[#F5E6C4] cursor-pointer whitespace-nowrap"
                            >
                              {testingSong ? (
                                <>
                                  <Square className="h-3 w-3 fill-current text-[#9E2A2B]" />
                                  <span>Stop Test</span>
                                </>
                              ) : (
                                <>
                                  <Play className="h-3 w-3 fill-current text-[#9E2A2B]" />
                                  <span>Test Song</span>
                                </>
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveSong}
                              className="inline-flex items-center gap-1 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-[11px] font-medium text-red-700 hover:bg-red-100 cursor-pointer whitespace-nowrap"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Remove</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="rounded-lg border border-[#E5D7BF] bg-[#FAF6EE] p-3 space-y-2.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex items-center gap-1.5 min-h-9 rounded-lg bg-[#9E2A2B] px-3.5 py-1.5 text-xs font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0">
                            <Upload className="h-3.5 w-3.5" />
                            <span>
                              {uploadingSong
                                ? 'Saving Audio...'
                                : customization.songFileName
                                  ? 'Change MP3 / Audio'
                                  : 'Upload MP3 / Audio Song'}
                            </span>
                            <input
                              type="file"
                              accept="audio/*"
                              onChange={handleSongUpload}
                              className="hidden"
                            />
                          </label>

                          {customization.songFileName && (
                            <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-900 max-w-full truncate">
                              <Music className="h-3 w-3 shrink-0" />
                              <span className="truncate">{customization.songFileName}</span>
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                              Track Title Displayed on Card
                            </label>
                            <input
                              type="text"
                              value={customization.songTitle}
                              onChange={(e) => updateField('songTitle', e.target.value)}
                              className="w-full rounded-lg border border-[#C8B493] bg-white px-3 py-1.5 text-xs text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                              Or Paste Direct Audio URL (.mp3)
                            </label>
                            <input
                              type="url"
                              value={customization.songUrl || ''}
                              onChange={(e) =>
                                onUpdate(theme.id, {
                                  ...customization,
                                  songUrl: e.target.value,
                                  songAudioKey: e.target.value ? undefined : customization.songAudioKey,
                                  songFileName: e.target.value ? '' : customization.songFileName,
                                  enabledSections: e.target.value
                                    ? { ...customization.enabledSections, song: true }
                                    : customization.enabledSections,
                                  updatedAt: Date.now(),
                                })
                              }
                              placeholder="https://example.com/wedding-song.mp3"
                              className="w-full rounded-lg border border-[#C8B493] bg-white px-3 py-1.5 text-xs text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        </div>

                        {!customization.songAudioKey && !customization.songUrl && (
                          <div className="pt-1">
                            <span className="block text-[11px] font-medium text-[#6D5A49] mb-1.5">
                              Or choose a built-in acoustic chime style:
                            </span>
                            <div className="flex flex-wrap gap-1.5">
                              {SONG_PRESETS.map((preset) => {
                                const active = (customization.songPresetId || 'default') === preset.id;
                                return (
                                  <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() =>
                                      onUpdate(theme.id, {
                                        ...customization,
                                        songPresetId: preset.id,
                                        songTitle: preset.title || customization.songTitle,
                                        enabledSections: {
                                          ...customization.enabledSections,
                                          song: true,
                                        },
                                        updatedAt: Date.now(),
                                      })
                                    }
                                    className={`rounded-md border px-2.5 py-1 text-[11px] font-medium cursor-pointer transition-colors whitespace-nowrap ${
                                      active
                                        ? 'border-[#9E2A2B] bg-[#9E2A2B] text-[#FAF6EE]'
                                        : 'border-[#C8B493] bg-white text-[#231B15] hover:bg-[#F2EAD9]'
                                    }`}
                                  >
                                    {preset.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1 border-t border-[#EFE5D3]">
                        {(showBothManual || inputLang === 'en') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              RSVP Deadline {showBothManual ? '(EN)' : ''}
                            </label>
                            <input
                              type="text"
                              value={customization.rsvpDeadline}
                              onChange={(e) =>
                                updateBilingualField('rsvpDeadline', 'en', e.target.value)
                              }
                              placeholder="25 Oct 2026"
                              className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}
                        {(showBothManual || inputLang === 'hi') && (
                          <div>
                            <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                              RSVP अंतिम तिथि (हिन्दी)
                            </label>
                            <input
                              type="text"
                              value={customization.rsvpDeadlineHi ?? ''}
                              onChange={(e) =>
                                updateBilingualField('rsvpDeadline', 'hi', e.target.value)
                              }
                              placeholder="01 फ़रवरी 2027"
                              className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                            Host WhatsApp No. (Optional)
                          </label>
                          <input
                            type="tel"
                            value={customization.rsvpWhatsapp}
                            onChange={(e) => updateField('rsvpWhatsapp', e.target.value)}
                            placeholder="919876543210"
                            className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-[#4A3B2F] mb-1">
                            Shagun by UPI ID (Optional — displays digital blessings card inside invite)
                          </label>
                          <input
                            type="text"
                            value={customization.shagunUpi || ''}
                            onChange={(e) => updateField('shagunUpi', e.target.value)}
                            placeholder="e.g. aarav@okaxis or meera@ybl"
                            className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-3 py-2 text-sm font-mono text-[#231B15] focus:border-[#9E2A2B] focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'sections' && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-[#D8C8AA] bg-white p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold text-[#231B15]">
                            Card Sections &amp; Options ({enabledCount} of {totalSectionsCount} Active)
                          </h3>
                          <p className="text-xs text-[#5C4B3D] mt-0.5">
                            Turn any card option ON or OFF individually for{' '}
                            <span className="font-semibold">{theme.name}</span>.
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => applySectionPreset('full')}
                            className="rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-[11px] font-medium text-[#231B15] hover:bg-[#F2EAD9] cursor-pointer whitespace-nowrap shrink-0"
                          >
                            All {totalSectionsCount} ON
                          </button>
                          <button
                            type="button"
                            onClick={() => applySectionPreset('essential')}
                            className="rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-[11px] font-medium text-[#231B15] hover:bg-[#F2EAD9] cursor-pointer whitespace-nowrap shrink-0"
                          >
                            Essential Suite
                          </button>
                          <button
                            type="button"
                            onClick={() => applySectionPreset('minimal')}
                            className="rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-[11px] font-medium text-[#231B15] hover:bg-[#F2EAD9] cursor-pointer whitespace-nowrap shrink-0"
                          >
                            Minimal Save-Date
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {applicableSections.map((sec) => {
                        const isOn = customization.enabledSections[sec.key];
                        return (
                          <button
                            key={sec.key}
                            type="button"
                            role="switch"
                            aria-checked={isOn}
                            onClick={() => toggleSection(sec.key)}
                            className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition-colors cursor-pointer ${
                              isOn
                                ? 'border-[#9E2A2B]/60 bg-white shadow-sm'
                                : 'border-[#D8C8AA] bg-[#F4EDE0]/65 opacity-80'
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-[#231B15] leading-snug">
                                {sec.label}
                              </p>
                              <p className="font-hindi text-[11px] text-[#9E2A2B] mt-0.5">
                                {sec.labelHi}
                              </p>
                              <p className="text-xs text-[#5C4B3D] mt-1 leading-relaxed">
                                {sec.description}
                              </p>
                            </div>

                            <div className="shrink-0 flex flex-col items-end gap-1 pt-0.5">
                              <span
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                  isOn ? 'bg-[#9E2A2B]' : 'bg-[#C8B493]'
                                }`}
                              >
                                <span
                                  className={`inline-block size-4.5 transform rounded-full bg-white shadow transition-transform ${
                                    isOn ? 'translate-x-5.5' : 'translate-x-1'
                                  }`}
                                />
                              </span>
                              <span
                                className={`text-[10px] font-semibold uppercase tracking-wider ${
                                  isOn ? 'text-[#9E2A2B]' : 'text-[#6D5A49]'
                                }`}
                              >
                                {isOn ? 'Added' : 'Removed'}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {activeTab === 'events' && (
                  <div className="space-y-4">
                    {customization.enabledSections.timeline === false && (
                      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-2.5 text-xs text-amber-950">
                        <span>
                          <strong>Events Timeline</strong> is currently turned OFF in Tab 2 (&ldquo;Add / Remove Options&rdquo;).
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleSection('timeline')}
                          className="rounded-lg bg-[#9E2A2B] px-3 py-1.5 text-[11px] font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap"
                        >
                          Turn Events ON
                        </button>
                      </div>
                    )}
                    {/* Quick Add Presets */}
                    <div className="rounded-xl border border-[#D8C8AA] bg-white p-4 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="text-sm font-semibold text-[#231B15]">
                            Customize Events, Timings &amp; Ceremony Photos
                          </h3>
                          <p className="text-xs text-[#5C4B3D] mt-0.5">
                            Replace default ceremony images with your own photos, edit timings &amp; venues, or add/remove functions — updates the inner Timeline &amp; RSVP automatically.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => addEvent()}
                          className="inline-flex items-center gap-1.5 min-h-9 rounded-lg bg-[#9E2A2B] px-3 py-1.5 text-xs font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Add Custom Event</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] font-medium text-[#6D5A49] mr-1">
                          Quick add:
                        </span>
                        {activeQuickPresets.map((preset) => (
                          <button
                            key={preset.label}
                            type="button"
                            onClick={() => addEvent(preset)}
                            className="inline-flex items-center gap-1 rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-[11px] font-medium text-[#231B15] hover:bg-[#F2EAD9] cursor-pointer whitespace-nowrap shrink-0"
                          >
                            <Plus className="h-3 w-3 text-[#9E2A2B]" />
                            <span>{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Event Editor List */}
                    {customization.events.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-[#C8B493] bg-white p-8 text-center">
                        <p className="font-display text-lg font-semibold text-[#231B15]">
                          No events on this card yet
                        </p>
                        <p className="mt-1 text-xs text-[#5C4B3D]">
                          Click &ldquo;Add Custom Event&rdquo; or a preset above to add functions.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {customization.events.map((ev, idx) => {
                          const isOpen = expandedEventId === ev.id;
                          const defaultEvImg =
                            defaultCustomization.events[idx]?.image ||
                            defaultCustomization.events.find((d) => d.id === ev.id)?.image ||
                            CURATED_EVENT_PHOTOS[idx % CURATED_EVENT_PHOTOS.length].src;
                          const isCustomEvImg = Boolean(ev.image && ev.image !== defaultEvImg);

                          return (
                            <div
                              key={ev.id}
                              className="rounded-xl border border-[#D8C8AA] bg-white overflow-hidden"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2.5 px-4 py-3 bg-[#F7F1E5]/60">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setExpandedEventId(isOpen ? null : ev.id)
                                  }
                                  className="flex flex-1 items-center gap-3 text-left min-w-0 cursor-pointer"
                                >
                                  <img
                                    src={ev.image || defaultEvImg}
                                    alt={ev.titleEn}
                                    className="size-11 rounded-lg object-cover border border-[#C88A2B]/60 shrink-0 bg-white"
                                  />
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-[#231B15] truncate">
                                      {idx + 1}. {ev.titleEn || 'Untitled Event'}{' '}
                                      <span className="font-hindi text-xs font-normal text-[#9E2A2B]">
                                        {ev.titleHi}
                                      </span>
                                    </p>
                                    <p className="text-xs text-[#5C4B3D] truncate">
                                      {ev.dateEn} · {ev.time} · {ev.venueEn}
                                    </p>
                                  </div>
                                </button>

                                <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                                  <label className="inline-flex items-center gap-1 rounded-lg bg-[#9E2A2B] px-2.5 py-1.5 text-[11px] font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap">
                                    <ImagePlus className="h-3.5 w-3.5" />
                                    <span>
                                      {uploadingEventIdx === idx ? 'Uploading...' : 'Change Photo'}
                                    </span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleEventPhotoUpload(idx, e)}
                                      className="hidden"
                                    />
                                  </label>

                                  {isCustomEvImg && (
                                    <button
                                      type="button"
                                      onClick={() => updateEvent(idx, { image: defaultEvImg })}
                                      className="inline-flex items-center gap-1 rounded-lg border border-[#9E2A2B]/40 bg-[#FBE7EB] px-2 py-1.5 text-[11px] font-semibold text-[#9E2A2B] hover:bg-[#f6d0d8] cursor-pointer whitespace-nowrap"
                                    >
                                      <RotateCcw className="h-3 w-3" />
                                      <span>Default</span>
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setExpandedEventId(isOpen ? null : ev.id)
                                    }
                                    className="rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-[11px] font-medium text-[#231B15] hover:bg-[#EDE2CE] cursor-pointer whitespace-nowrap"
                                  >
                                    {isOpen ? 'Done' : 'Edit Details'}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => removeEvent(idx)}
                                    aria-label={`Remove ${ev.titleEn}`}
                                    className="grid size-8 place-items-center rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-600 hover:text-white cursor-pointer"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </div>

                              {isOpen && (
                                <div className="p-4 border-t border-[#E6DAC2] grid grid-cols-1 sm:grid-cols-2 gap-3">
                                  {(showBothManual || inputLang === 'en') && (
                                    <div>
                                      <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                        Event Name {showBothManual ? '(EN)' : ''}
                                      </label>
                                      <input
                                        type="text"
                                        value={ev.titleEn}
                                        onChange={(e) =>
                                          updateEventBilingualField(idx, ev.id, 'title', 'en', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                      />
                                    </div>
                                  )}
                                  {(showBothManual || inputLang === 'hi') && (
                                    <div>
                                      <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                        कार्यक्रम नाम (हिन्दी)
                                      </label>
                                      <input
                                        type="text"
                                        value={ev.titleHi}
                                        onChange={(e) =>
                                          updateEventBilingualField(idx, ev.id, 'title', 'hi', e.target.value)
                                        }
                                        className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                      />
                                    </div>
                                  )}
                                  {(showBothManual || inputLang === 'en') && (
                                    <div>
                                      <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                        Date {showBothManual ? '(EN)' : '(e.g. 12 Nov 2026)'}
                                      </label>
                                      <input
                                        type="text"
                                        value={ev.dateEn}
                                        onChange={(e) =>
                                          updateEventBilingualField(idx, ev.id, 'date', 'en', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                      />
                                    </div>
                                  )}
                                  {(showBothManual || inputLang === 'hi') && (
                                    <div>
                                      <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                        दिनांक (हिन्दी — उदा. 12 नवम्बर 2026)
                                      </label>
                                      <input
                                        type="text"
                                        value={ev.dateHi}
                                        onChange={(e) =>
                                          updateEventBilingualField(idx, ev.id, 'date', 'hi', e.target.value)
                                        }
                                        className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                      {inputLang === 'hi' && !showBothManual
                                        ? 'समय (उदा. 05:30 PM)'
                                        : 'Time (e.g. 05:30 PM)'}
                                    </label>
                                    <input
                                      type="text"
                                      value={ev.time}
                                      onChange={(e) =>
                                        updateEvent(idx, { time: e.target.value })
                                      }
                                      className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                    />
                                  </div>
                                  {(showBothManual || inputLang === 'en') && (
                                    <div>
                                      <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                        Venue / Lawn {showBothManual ? '(EN)' : ''}
                                      </label>
                                      <input
                                        type="text"
                                        value={ev.venueEn}
                                        onChange={(e) =>
                                          updateEventBilingualField(idx, ev.id, 'venue', 'en', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                      />
                                    </div>
                                  )}
                                  {(showBothManual || inputLang === 'hi') && (
                                    <div>
                                      <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                        कार्यक्रम स्थल (हिन्दी)
                                      </label>
                                      <input
                                        type="text"
                                        value={ev.venueHi}
                                        onChange={(e) =>
                                          updateEventBilingualField(idx, ev.id, 'venue', 'hi', e.target.value)
                                        }
                                        className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                      />
                                    </div>
                                  )}
                                  {(showBothManual || inputLang === 'en') && (
                                    <div>
                                      <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                        Dress Code / Attire {showBothManual ? '(EN)' : ''}
                                      </label>
                                      <input
                                        type="text"
                                        value={ev.attireEn}
                                        onChange={(e) =>
                                          updateEventBilingualField(idx, ev.id, 'attire', 'en', e.target.value)
                                        }
                                        className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                      />
                                    </div>
                                  )}
                                  {(showBothManual || inputLang === 'hi') && (
                                    <div>
                                      <label className="block text-[11px] font-medium text-[#4A3B2F] mb-1">
                                        परिधान / ड्रेस कोड (हिन्दी)
                                      </label>
                                      <input
                                        type="text"
                                        value={ev.attireHi}
                                        onChange={(e) =>
                                          updateEventBilingualField(idx, ev.id, 'attire', 'hi', e.target.value)
                                        }
                                        className="font-hindi w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                      />
                                    </div>
                                  )}
                                  <div className="sm:col-span-2 space-y-2 pt-2 border-t border-[#EFE5D3]">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <div>
                                        <label className="block text-[11px] font-semibold text-[#4A3B2F]">
                                          Event / Ceremony Photo (कार्यक्रम की फोटो बदलें)
                                        </label>
                                        <p className="text-[10.5px] text-[#6D5A49]">
                                          Upload your own photo or paste an image URL to replace this event&apos;s default artwork.
                                        </p>
                                      </div>
                                      <div className="flex flex-wrap items-center gap-1.5">
                                        {isCustomEvImg && (
                                          <button
                                            type="button"
                                            onClick={() =>
                                              updateEvent(idx, { image: defaultEvImg })
                                            }
                                            className="inline-flex items-center gap-1 rounded-lg border border-[#9E2A2B]/40 bg-[#FBE7EB] px-2.5 py-1.5 text-[11px] font-semibold text-[#9E2A2B] hover:bg-[#f6d0d8] cursor-pointer whitespace-nowrap"
                                          >
                                            <RotateCcw className="h-3 w-3" />
                                            <span>Reset Default Photo</span>
                                          </button>
                                        )}
                                        <label className="inline-flex items-center gap-1.5 rounded-lg bg-[#9E2A2B] px-3 py-1.5 text-[11px] font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0">
                                          <ImagePlus className="h-3.5 w-3.5" />
                                          <span>
                                            {uploadingEventIdx === idx
                                              ? 'Uploading...'
                                              : 'Upload Your Photo'}
                                          </span>
                                          <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleEventPhotoUpload(idx, e)}
                                            className="hidden"
                                          />
                                        </label>
                                      </div>
                                    </div>

                                    <input
                                      type="url"
                                      value={
                                        ev.image.startsWith('data:') || ev.image === defaultEvImg
                                          ? ''
                                          : ev.image
                                      }
                                      onChange={(e) =>
                                        updateEvent(idx, {
                                          image: e.target.value || defaultEvImg,
                                        })
                                      }
                                      placeholder="Or paste your custom photo URL (https://...)"
                                      className="w-full rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-2.5 py-1.5 text-xs text-[#231B15]"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Live Interactive Phone Stage Preview */}
            <div
              className={`${
                mobileShowPreview ? 'flex' : 'hidden lg:flex'
              } flex-col items-center justify-between border-l border-[#D8C8AA] bg-[#1F1712] p-4 overflow-hidden`}
            >
              <div className="flex w-full items-center justify-between text-xs text-[#E6C994] mb-2.5">
                <span className="inline-flex items-center gap-1.5 font-medium">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span>Live Interactive Card</span>
                </span>
                {cardLangMode === 'both' ? (
                  <button
                    type="button"
                    onClick={() => {
                      const nextLang: Language = previewLang === 'en' ? 'hi' : 'en';
                      if (pendingFieldsRef.current.size > 0) {
                        void flushPendingTranslations(inputLang);
                      }
                      setPreviewLang(nextLang);
                    }}
                    className="inline-flex items-center gap-1 rounded-full border border-[#E6B86A]/40 bg-[#2C211A] px-2.5 py-1 text-[11px] text-[#FAF6EE] hover:bg-[#3A2B22] cursor-pointer whitespace-nowrap"
                  >
                    <Globe2 className="h-3 w-3" />
                    <span>{previewLang === 'en' ? 'हिन्दी देखें' : 'English'}</span>
                  </button>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#E6B86A]/35 bg-[#2C211A] px-2.5 py-1 text-[10.5px] text-[#E6C994] whitespace-nowrap">
                    <Globe2 className="h-3 w-3" />
                    <span>{cardLangMode === 'hi' ? 'हिन्दी Only' : 'English Only'}</span>
                  </span>
                )}
              </div>

              <div className="relative flex-1 w-full max-w-[306px] min-h-0 flex items-center justify-center">
                <div
                  className="relative h-full max-h-[620px] w-full rounded-[38px] p-[3px]"
                  style={{
                    background:
                      'linear-gradient(160deg, #6b6b70 0%, #3a3a3d 18%, #1d1d20 46%, #3a3a3d 70%, #6b6b70 100%)',
                    boxShadow:
                      'inset 0 0 0 1px rgba(107,107,112,0.4), 0 24px 60px rgba(0,0,0,0.65)',
                  }}
                >
                  <div className="relative h-full w-full rounded-[35px] bg-black p-[6px]">
                    <div className="relative h-full w-full overflow-hidden rounded-[29px] bg-[#140F0B]">
                      <InteractiveInvitePhoneStage
                        theme={theme}
                        lang={cardLangMode === 'hi' ? 'hi' : cardLangMode === 'en' ? 'en' : previewLang}
                        groomName={customization.primaryName}
                        brideName={customization.partnerName || customization.primaryName}
                        weddingDateLabel={customization.dateLabel}
                        cityLabel={customization.cityLabel}
                        compact={true}
                        customization={customization}
                      />
                      {/* Dynamic Island Notch */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute top-2 left-1/2 z-40 h-[18px] w-[76px] -translate-x-1/2 rounded-full bg-black"
                      >
                        <span className="absolute top-1/2 right-2 size-[6px] -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_35%_35%,#2c3a55,#0b0f18_60%)]" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="mt-2.5 text-center text-[11px] text-[#C8B493]">
                Tap/interact with the card above to test opening &amp; toggled sections live.
              </p>
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#D8C8AA] bg-[#F2EAD9] px-4 py-3 sm:px-6">
            <p className="text-xs text-[#5C4B3D]">
              Changes save automatically per card and stay isolated from other themes.
            </p>
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={async () => {
                  if (pendingFieldsRef.current.size > 0) {
                    await flushPendingTranslations(inputLang);
                  }
                  onClose();
                }}
                className="min-h-10 rounded-lg border border-[#C8B493] bg-[#FAF6EE] px-4 py-2 text-xs font-medium text-[#231B15] hover:bg-[#EDE2CE] cursor-pointer whitespace-nowrap shrink-0"
              >
                Done Editing
              </button>
              {onOpenShareSuite && (
                <button
                  type="button"
                  onClick={async () => {
                    if (pendingFieldsRef.current.size > 0) {
                      await flushPendingTranslations(inputLang);
                    }
                    onOpenShareSuite(theme);
                  }}
                  className="inline-flex items-center gap-1.5 min-h-10 rounded-lg bg-[#1F6E4A] px-4 py-2 text-xs font-medium text-white hover:bg-[#18593c] cursor-pointer whitespace-nowrap shrink-0"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Publish &amp; Share Free</span>
                </button>
              )}
              <button
                type="button"
                onClick={async () => {
                  if (pendingFieldsRef.current.size > 0) {
                    await flushPendingTranslations(inputLang);
                  }
                  onSaveAndPreview(theme);
                }}
                className="inline-flex items-center gap-1.5 min-h-10 rounded-lg bg-[#9E2A2B] px-4 py-2 text-xs font-medium text-[#FAF6EE] hover:bg-[#822021] cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Done &amp; Preview Full Card</span>
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
