import React, { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { COUPLE_DEFAULTS, Language } from './data/weddingData';
import { InviteTheme, STUDIO_THEMES } from './data/studioData';
import {
  CardCustomization,
  getTemplateCanonicalUrl,
  loadStoredCustomizations,
  mergeCustomization,
  resolveLocationState,
  saveStoredCustomizations,
  SITE_ORIGIN,
} from './data/cardCustomization';
import {
  deleteLocalRsvp,
  loadLocalRsvps,
  RsvpRecord,
  RsvpSubmissionInput,
  saveLocalRsvp,
} from './utils/rsvpStore';
import { SaathHeader, SaathFooter } from './components/SaathHeaderAndFooter';
import { InvifestHeroAndTemplates } from './components/InvifestHeroAndTemplates';
import { InvifestSectionsBelowFold } from './components/InvifestSectionsBelowFold';

const JharokhaInvitePage = lazy(() =>
  import('./components/JharokhaInvitePage').then((m) => ({ default: m.JharokhaInvitePage }))
);
const CardOpenPreviewModal = lazy(() =>
  import('./components/CardOpenPreviewModal').then((m) => ({ default: m.CardOpenPreviewModal }))
);
const CardCustomizerModal = lazy(() =>
  import('./components/CardCustomizerModal').then((m) => ({ default: m.CardCustomizerModal }))
);
const InviteShareSuitePage = lazy(() =>
  import('./components/InviteShareSuitePage').then((m) => ({ default: m.InviteShareSuitePage }))
);

export type AppRoute = 'jharokha-page' | 'studio-home' | 'share-suite';

function syncDocumentHead(route: AppRoute, theme: InviteTheme) {
  if (typeof document === 'undefined') return;
  let title = 'NIMANTRAN — Sacred Digital Invitations That Open Like Home';
  let canonicalUrl = `${SITE_ORIGIN}/`;

  if (route === 'jharokha-page') {
    title = `${theme.name} (${theme.nameHi}) — Free Digital Invite | NIMANTRAN`;
    canonicalUrl = getTemplateCanonicalUrl(theme, false);
  } else if (route === 'share-suite') {
    title = `Share ${theme.name} Invite & QR Code | NIMANTRAN`;
    canonicalUrl = getTemplateCanonicalUrl(theme, true);
  }

  document.title = title;
  const canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (canonicalEl) canonicalEl.href = canonicalUrl;
  const ogUrlEl = document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
  if (ogUrlEl) ogUrlEl.content = canonicalUrl;
}

function pushBrowserPath(route: AppRoute, theme: InviteTheme) {
  if (typeof window === 'undefined') return;
  const nextPath =
    route === 'studio-home'
      ? '/'
      : route === 'share-suite'
        ? `/${theme.slug}/share`
        : `/${theme.slug}`;
  if (window.location.pathname !== nextPath) {
    window.history.pushState({ route, themeId: theme.id }, '', nextPath);
  }
}

export default function App() {
  const initialLocation = useRef(resolveLocationState());

  const [activeRoute, setActiveRoute] = useState<AppRoute>(
    () => initialLocation.current?.route || 'studio-home'
  );
  const [pageTheme, setPageTheme] = useState<InviteTheme>(
    () => initialLocation.current?.theme || STUDIO_THEMES[0]
  );
  const [cardOnlyInvite, setCardOnlyInvite] = useState(
    () => initialLocation.current?.cardOnlyView || false
  );
  const [modalCardTheme, setModalCardTheme] = useState<InviteTheme | null>(null);
  const [customizerTheme, setCustomizerTheme] = useState<InviteTheme | null>(null);
  const [selectedCatalogCategory, setSelectedCatalogCategory] = useState<string>('All');
  const [modalLang, setModalLang] = useState<Language>('en');
  const [groomName, setGroomName] = useState(COUPLE_DEFAULTS.groomEn);
  const [brideName, setBrideName] = useState(COUPLE_DEFAULTS.brideEn);
  const [guestFamilyGreeting, setGuestFamilyGreeting] = useState<string | undefined>(
    () => initialLocation.current?.guestFamily
  );
  const [allowedEventIds, setAllowedEventIds] = useState<string[] | undefined>(
    () => initialLocation.current?.allowedEventIds
  );
  const [localRsvps, setLocalRsvps] = useState<RsvpRecord[]>(() =>
    loadLocalRsvps(initialLocation.current?.theme.id || STUDIO_THEMES[0].id)
  );

  const [storedCustomMap, setStoredCustomMap] = useState<
    Record<string, Partial<CardCustomization>>
  >(() => loadStoredCustomizations());

  // Hydrate shared card link (?custom=..., ?guest=..., ?events=..., /invites/<slug>) on mount
  useEffect(() => {
    const loc = initialLocation.current;
    if (!loc) return;
    if (loc.custom) {
      setStoredCustomMap((prev) => {
        const next = {
          ...prev,
          [loc.theme.id]: loc.hasExplicitCustomPayload
            ? loc.custom!
            : {
                ...prev[loc.theme.id],
                ...loc.custom,
              },
        };
        saveStoredCustomizations(next);
        return next;
      });
    }
    if (loc.openPreviewModal) {
      setModalCardTheme(loc.theme);
    }
  }, []);

  // Sync <title> and canonical link with current route & theme
  useEffect(() => {
    syncDocumentHead(activeRoute, pageTheme);
  }, [activeRoute, pageTheme]);

  // Listen to browser back / forward navigation across / and /invites/<slug>
  useEffect(() => {
    const handlePopState = () => {
      const resolved = resolveLocationState();
      if (!resolved) {
        setActiveRoute('studio-home');
        setCardOnlyInvite(false);
        setGuestFamilyGreeting(undefined);
        setAllowedEventIds(undefined);
        return;
      }
      setPageTheme(resolved.theme);
      setActiveRoute(resolved.route);
      setCardOnlyInvite(resolved.cardOnlyView);
      setGuestFamilyGreeting(resolved.guestFamily);
      setAllowedEventIds(resolved.allowedEventIds);
      if (resolved.custom) {
        setStoredCustomMap((prev) => ({
          ...prev,
          [resolved.theme.id]: resolved.hasExplicitCustomPayload
            ? resolved.custom!
            : {
                ...prev[resolved.theme.id],
                ...resolved.custom,
              },
        }));
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const getCustomization = useCallback(
    (theme: InviteTheme): { data: CardCustomization; isCustomized: boolean } => {
      const stored = storedCustomMap[theme.id];
      return {
        data: mergeCustomization(theme, stored, groomName, brideName),
        isCustomized: Boolean(stored),
      };
    },
    [storedCustomMap, groomName, brideName]
  );

  const saveTimerRef = useRef<number | null>(null);

  const handleUpdateCustomization = useCallback(
    (themeId: string, next: CardCustomization) => {
      setStoredCustomMap((prev) => {
        const updated = { ...prev, [themeId]: next };
        if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = window.setTimeout(() => {
          saveStoredCustomizations(updated);
        }, 350);
        return updated;
      });
    },
    []
  );

  const handleResetCustomization = useCallback((themeId: string) => {
    setStoredCustomMap((prev) => {
      const copy = { ...prev };
      delete copy[themeId];
      saveStoredCustomizations(copy);
      return copy;
    });
  }, []);

  const handleOpenCustomizer = useCallback((theme: InviteTheme) => {
    setModalCardTheme(null);
    setCustomizerTheme(theme);
  }, []);

  const handleNavigate = (route: AppRoute, sectionId?: string) => {
    setActiveRoute(route);
    pushBrowserPath(route, pageTheme);
    if (sectionId) {
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          const el = document.getElementById(sectionId);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 90);
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSelectHeaderCategory = (categoryId: string) => {
    setSelectedCatalogCategory(categoryId);
    handleNavigate('studio-home', 'templates');
  };

  const handleSelectThemePage = (theme: InviteTheme) => {
    setCardOnlyInvite(false);
    setGuestFamilyGreeting(undefined);
    setAllowedEventIds(undefined);
    setPageTheme(theme);
    setActiveRoute('jharokha-page');
    pushBrowserPath('jharokha-page', theme);
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleOpenShareSuite = (theme: InviteTheme) => {
    setCardOnlyInvite(false);
    setModalCardTheme(null);
    setCustomizerTheme(null);
    setPageTheme(theme);
    setActiveRoute('share-suite');
    pushBrowserPath('share-suite', theme);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCardModal = (theme: InviteTheme, lang: Language = 'en') => {
    setModalLang(lang);
    setModalCardTheme(theme);
  };

  const pageCustom = getCustomization(pageTheme);
  const modalCustom = modalCardTheme ? getCustomization(modalCardTheme) : null;
  const customizerState = customizerTheme ? getCustomization(customizerTheme) : null;

  // Refresh local WhatsApp RSVPs whenever theme switches
  useEffect(() => {
    setLocalRsvps(loadLocalRsvps(pageTheme.id));
  }, [pageTheme.id]);

  const handleSubmitRsvp = useCallback(
    async (themeId: string, input: RsvpSubmissionInput): Promise<RsvpRecord> => {
      const rec = saveLocalRsvp(themeId, input);
      if (themeId === pageTheme.id) {
        setLocalRsvps(loadLocalRsvps(themeId));
      }
      return rec;
    },
    [pageTheme.id]
  );

  const handleDeleteRsvp = useCallback(
    async (rsvpId: string) => {
      const next = deleteLocalRsvp(pageTheme.id, rsvpId);
      setLocalRsvps(next);
    },
    [pageTheme.id]
  );

  if (cardOnlyInvite) {
    return (
      <div className="min-h-dvh bg-[#110A0A]">
        <Suspense fallback={<div className="min-h-dvh bg-[#110A0A]" />}>
          <CardOpenPreviewModal
            theme={pageTheme}
            onClose={() => window.location.replace('/')}
            groomName={groomName}
            brideName={brideName}
            initialLang="en"
            customization={pageCustom.data}
            guestFamilyGreeting={guestFamilyGreeting}
            allowedEventIds={allowedEventIds}
            matchMainSiteCard
            onSubmitRsvp={(input) => handleSubmitRsvp(pageTheme.id, input)}
          />
        </Suspense>
      </div>
    );
  }

  return (
    <div id="top" className="min-h-dvh bg-[#fbfbfb] text-[#111315]">
      <SaathHeader
        activeRoute={activeRoute}
        onNavigate={handleNavigate}
        onSelectCategory={handleSelectHeaderCategory}
      />

      {activeRoute === 'share-suite' ? (
        <main className="bg-[#FAF6EE] text-[#2A1316]">
          <Suspense fallback={<div className="min-h-[60vh]" />}>
            <InviteShareSuitePage
              theme={pageTheme}
              customization={pageCustom.data}
              onUpdateCustomization={handleUpdateCustomization}
              onBackToThemePage={handleSelectThemePage}
              onSelectTheme={handleOpenShareSuite}
              onOpenCustomizer={handleOpenCustomizer}
              onOpenFullPreview={handleOpenCardModal}
              rsvpRecords={localRsvps}
              onSubmitRsvp={(input) => handleSubmitRsvp(pageTheme.id, input)}
              onDeleteRsvp={handleDeleteRsvp}
            />
          </Suspense>

          <div className="bg-[#fbf7f2] border-t border-[#efe7dc] px-5 sm:px-8 py-14 sm:py-16">
            <SaathFooter
              onSelectTheme={handleSelectThemePage}
              onNavigateStudioHome={(sectionId) => handleNavigate('studio-home', sectionId)}
            />
          </div>
        </main>
      ) : activeRoute === 'jharokha-page' ? (
        <main className="bg-[#FBF6F3] text-[#2A1316]">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-32">
            <Suspense fallback={<div className="min-h-[60vh]" />}>
              <JharokhaInvitePage
                activeTheme={pageTheme}
                onSelectTheme={handleSelectThemePage}
                onNavigateInvitesCatalog={() => handleNavigate('studio-home', 'templates')}
                onOpenFullPreview={(lang) => handleOpenCardModal(pageTheme, lang)}
                groomName={groomName}
                brideName={brideName}
                onChangeGroomName={setGroomName}
                onChangeBrideName={setBrideName}
                customization={pageCustom.data}
                onOpenCustomizer={handleOpenCustomizer}
                onOpenShareSuite={handleOpenShareSuite}
                rsvpCount={localRsvps.length}
                guestFamilyGreeting={guestFamilyGreeting}
                allowedEventIds={allowedEventIds}
                onSubmitRsvp={(input) => handleSubmitRsvp(pageTheme.id, input)}
              />
            </Suspense>

            <div className="mt-20 border-t border-[#EADFD8] pt-12">
              <SaathFooter
                onSelectTheme={handleSelectThemePage}
                onNavigateStudioHome={(sectionId) => handleNavigate('studio-home', sectionId)}
              />
            </div>
          </div>
        </main>
      ) : (
        <div className="min-h-screen bg-[#fbfbfb] text-[#111315]">
          <main>
            <InvifestHeroAndTemplates
              themes={STUDIO_THEMES}
              groomName={groomName}
              brideName={brideName}
              onChangeGroomName={setGroomName}
              onChangeBrideName={setBrideName}
              onLaunchPreview={(t) => handleOpenCardModal(t, 'en')}
              onSelectThemePage={handleSelectThemePage}
              getCustomization={getCustomization}
              onOpenCustomizer={handleOpenCustomizer}
              onOpenShareSuite={handleOpenShareSuite}
              activeCategory={selectedCatalogCategory}
              onChangeCategory={setSelectedCatalogCategory}
            />

            <InvifestSectionsBelowFold
              themes={STUDIO_THEMES}
              groomName={groomName}
              brideName={brideName}
              onLaunchPreview={(t) => handleOpenCardModal(t, 'en')}
              onSelectThemePage={handleSelectThemePage}
              onOpenCustomizer={handleOpenCustomizer}
            />
          </main>

          <div className="bg-[#fbf7f2] border-t border-[#efe7dc] px-5 sm:px-8 py-14 sm:py-16">
            <SaathFooter
              onSelectTheme={handleSelectThemePage}
              onNavigateStudioHome={(sectionId) => handleNavigate('studio-home', sectionId)}
            />
          </div>
        </div>
      )}

      {/* Full-Screen Interactive Card Stage Modal */}
      {modalCardTheme && (
        <Suspense fallback={null}>
          <CardOpenPreviewModal
            theme={modalCardTheme}
            onClose={() => setModalCardTheme(null)}
            groomName={groomName}
            brideName={brideName}
            initialLang={modalLang}
            customization={modalCustom?.data}
            onOpenCustomizer={handleOpenCustomizer}
            onOpenShareSuite={handleOpenShareSuite}
            guestFamilyGreeting={guestFamilyGreeting}
            allowedEventIds={allowedEventIds}
            onSubmitRsvp={(input) => handleSubmitRsvp(modalCardTheme.id, input)}
          />
        </Suspense>
      )}

      {/* Per-Card Full Customizer Modal */}
      {customizerTheme && (
        <Suspense fallback={null}>
          <CardCustomizerModal
            theme={customizerTheme}
            customization={customizerState?.data ?? null}
            hasCustomChanges={customizerState?.isCustomized ?? false}
            onUpdate={handleUpdateCustomization}
            onReset={handleResetCustomization}
            onClose={() => setCustomizerTheme(null)}
            onSaveAndPreview={(t) => {
              setCustomizerTheme(null);
              handleOpenCardModal(t, 'en');
            }}
            onOpenShareSuite={handleOpenShareSuite}
          />
        </Suspense>
      )}
    </div>
  );
}
