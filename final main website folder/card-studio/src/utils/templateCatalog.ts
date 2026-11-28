import type { AudioTrack, CardTemplate } from '../types/editor';

export interface SavedTemplateCatalog {
  version: 1;
  revision: number;
  overrides: Record<string, CardTemplate>;
  added: CardTemplate[];
  hiddenIds: string[];
  customAudioTracks: AudioTrack[];
}

export const EMPTY_SAVED_CATALOG: SavedTemplateCatalog = {
  version: 1,
  revision: 0,
  overrides: {},
  added: [],
  hiddenIds: [],
  customAudioTracks: [],
};

const SLIDES_ONLY_TEMPLATE_IDS = new Set([
  'sage-green-birthday-invitation',
  'burgundy-gold-ganesha-story',
  'elegant-navy-ganesha-story',
  'opulent-maroon-ganesha-story',
  'ornate-gold-ganesha-story',
]);

export function removeOpeningCoverVideos(templates: CardTemplate[]): CardTemplate[] {
  return templates.map((template) => {
    if (!SLIDES_ONLY_TEMPLATE_IDS.has(template.id)) return template;

    const firstPage = template.pages[0];
    const hasOpeningVideo = firstPage?.elements.some(
      (element) => element.type === 'video' && Boolean(element.mediaSrc),
    );
    if (!hasOpeningVideo) return template;

    const pages = template.pages.filter((_, index) => index !== 0).map((page, index) => ({
      ...page,
      title: page.title.replace(/^\s*\d+/, String(index + 1).padStart(2, '0')),
    }));
    return { ...template, pages };
  });
}

export function mergeTemplateCatalog(base: CardTemplate[], saved: Partial<SavedTemplateCatalog> | null | undefined): CardTemplate[] {
  if (!saved) return base;
  const hidden = new Set(saved.hiddenIds || []);
  const overrides = saved.overrides || {};
  const baseIds = new Set(base.map((template) => template.id));
  const mergedBase = base
    .filter((template) => !hidden.has(template.id))
    .map((template) => {
      const override = overrides[template.id];
      if (!override) return template;
      if (template.id !== 'sage-green-birthday-invitation') return override;

      // Older saved catalogs can still contain the pre-public-folder artwork URLs.
      // Keep user text edits, while restoring any missing Sage Green page artwork.
      return {
        ...override,
        pages: override.pages.map((page, index) => {
          const basePage = template.pages.find((candidate) => candidate.id === page.id) || template.pages[index];
          if (!basePage) return page;
          const baseArtwork = basePage.elements.filter((element) =>
            element.type === 'image' && element.id.startsWith('sage-birthday-'),
          );
          const birthdayBarcode = basePage.elements.find((element) => element.id === 'sage-green-birthday-barcode');
          const elements = page.elements.filter((element) =>
            page.id !== 'sage-birthday-thank-you' || element.id !== 'sage-green-birthday-photo',
          ).map((element) => {
            if (element.type !== 'image' || !element.id.startsWith('sage-birthday-')) return element;
            const canonicalArtwork = baseArtwork.find((artwork) => artwork.id === element.id);
            return canonicalArtwork ? { ...element, src: canonicalArtwork.src, alt: canonicalArtwork.alt } : element;
          });
          for (const artwork of baseArtwork) {
            if (!elements.some((element) => element.id === artwork.id)) elements.push(artwork);
          }
          if (page.id === 'sage-birthday-thank-you' && birthdayBarcode) {
            const barcodeIndex = elements.findIndex((element) => element.id === birthdayBarcode.id);
            if (barcodeIndex >= 0) elements[barcodeIndex] = birthdayBarcode;
            else elements.push(birthdayBarcode);
          }
          return { ...page, elements };
        }),
      };
    });
  const added = (saved.added || []).filter((template) => !hidden.has(template.id) && !baseIds.has(template.id));
  return [...mergedBase, ...added];
}

export function buildSavedCatalog(
  base: CardTemplate[],
  effective: CardTemplate[],
  previous: SavedTemplateCatalog,
): Omit<SavedTemplateCatalog, 'revision'> & { revision?: number } {
  const baseMap = new Map(base.map((template) => [template.id, template]));
  const effectiveMap = new Map(effective.map((template) => [template.id, template]));
  const overrides: Record<string, CardTemplate> = {};
  const added: CardTemplate[] = [];
  for (const template of effective) {
    const original = baseMap.get(template.id);
    if (!original) added.push(template);
    else if (JSON.stringify(original) !== JSON.stringify(template)) overrides[template.id] = template;
  }
  const visibleIds = new Set(effective.map((template) => template.id));
  const hiddenIds = [...new Set([
    ...(previous.hiddenIds || []),
    ...base.filter((template) => !visibleIds.has(template.id)).map((template) => template.id),
  ])].filter((id) => !visibleIds.has(id));
  return {
    version: 1,
    overrides,
    added,
    hiddenIds,
    customAudioTracks: previous.customAudioTracks || [],
  };
}

