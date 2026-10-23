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

export function mergeTemplateCatalog(base: CardTemplate[], saved: Partial<SavedTemplateCatalog> | null | undefined): CardTemplate[] {
  if (!saved) return base;
  const hidden = new Set(saved.hiddenIds || []);
  const overrides = saved.overrides || {};
  const baseIds = new Set(base.map((template) => template.id));
  const mergedBase = base
    .filter((template) => !hidden.has(template.id))
    .map((template) => overrides[template.id] || template);
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

