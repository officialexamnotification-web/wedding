import {
  MainElementCategoryId,
  UniversalElementItem,
  ShapeSubcategoryId,
  GraphicSubcategoryId,
} from '../../types/elements';
import {
  MAIN_ELEMENT_CATEGORIES,
  SHAPE_SUBCATEGORIES,
  GRAPHIC_SUBCATEGORIES,
  SEARCH_SYNONYMS,
} from './categories';
import { SHAPES_LIBRARY_ITEMS } from './shapesManifest';
import { GRAPHICS_LIBRARY_ITEMS } from './graphicsManifest';
import { CANVA_DECORATIVE_ITEMS } from './canvaDecorativeManifest';
import { FRAMES_LIBRARY_ITEMS, GRIDS_LIBRARY_ITEMS } from './framesGridsManifest';
import {
  PHOTOS_LIBRARY_ITEMS,
  VIDEOS_LIBRARY_ITEMS,
  AUDIO_LIBRARY_ITEMS,
  ANIMATIONS_LIBRARY_ITEMS,
  CHARTS_LIBRARY_ITEMS,
  FORMS_LIBRARY_ITEMS,
  SHEETS_LIBRARY_ITEMS,
  TABLES_LIBRARY_ITEMS,
  MOCKUPS_LIBRARY_ITEMS,
} from './mediaInteractiveManifest';
import { PREMIUM_WEDDING_ELEMENTS } from './premiumWedding';

export {
  MAIN_ELEMENT_CATEGORIES,
  SHAPE_SUBCATEGORIES,
  GRAPHIC_SUBCATEGORIES,
  SEARCH_SYNONYMS,
  SHAPES_LIBRARY_ITEMS,
  GRAPHICS_LIBRARY_ITEMS,
  CANVA_DECORATIVE_ITEMS,
  PREMIUM_WEDDING_ELEMENTS,
  FRAMES_LIBRARY_ITEMS,
  GRIDS_LIBRARY_ITEMS,
  PHOTOS_LIBRARY_ITEMS,
  VIDEOS_LIBRARY_ITEMS,
  AUDIO_LIBRARY_ITEMS,
  ANIMATIONS_LIBRARY_ITEMS,
  CHARTS_LIBRARY_ITEMS,
  FORMS_LIBRARY_ITEMS,
  SHEETS_LIBRARY_ITEMS,
  TABLES_LIBRARY_ITEMS,
  MOCKUPS_LIBRARY_ITEMS,
};

export const ALL_UNIVERSAL_ELEMENTS: UniversalElementItem[] = [
  ...PREMIUM_WEDDING_ELEMENTS,
  ...SHAPES_LIBRARY_ITEMS,
  ...GRAPHICS_LIBRARY_ITEMS,
  ...CANVA_DECORATIVE_ITEMS,
  ...PHOTOS_LIBRARY_ITEMS,
  ...FRAMES_LIBRARY_ITEMS,
  ...GRIDS_LIBRARY_ITEMS,
  ...CHARTS_LIBRARY_ITEMS,
  ...FORMS_LIBRARY_ITEMS,
  ...SHEETS_LIBRARY_ITEMS,
  ...TABLES_LIBRARY_ITEMS,
  ...ANIMATIONS_LIBRARY_ITEMS,
  ...MOCKUPS_LIBRARY_ITEMS,
];

export function getItemsByCategory(catId: MainElementCategoryId): UniversalElementItem[] {
  switch (catId) {
    case 'shapes':
      return SHAPES_LIBRARY_ITEMS;
    case 'graphics':
      return [...PREMIUM_WEDDING_ELEMENTS, ...GRAPHICS_LIBRARY_ITEMS, ...CANVA_DECORATIVE_ITEMS];
    case 'photos':
      return PHOTOS_LIBRARY_ITEMS;
    case 'videos':
      return [];
    case 'audio':
      return [];
    case 'frames':
      return FRAMES_LIBRARY_ITEMS;
    case 'grids':
      return GRIDS_LIBRARY_ITEMS;
    case 'charts':
      return CHARTS_LIBRARY_ITEMS;
    case 'forms':
      return FORMS_LIBRARY_ITEMS;
    case 'sheets':
      return SHEETS_LIBRARY_ITEMS;
    case 'tables':
      return TABLES_LIBRARY_ITEMS;
    case 'animations':
      return ANIMATIONS_LIBRARY_ITEMS;
    case 'mockups':
      return MOCKUPS_LIBRARY_ITEMS;
    default:
      return [];
  }
}

export function getShapesBySubcategory(subId: ShapeSubcategoryId) {
  return SHAPES_LIBRARY_ITEMS.filter((item) => item.subcategory === subId);
}

export function getGraphicsBySubcategory(subId: GraphicSubcategoryId) {
  return [
    ...PREMIUM_WEDDING_ELEMENTS.filter((item) => item.subcategory === subId),
    ...GRAPHICS_LIBRARY_ITEMS.filter((item) => item.subcategory === subId),
    ...CANVA_DECORATIVE_ITEMS.filter((item) => item.subcategory === subId),
  ];
}

// Smart search across the available library with synonym expansion
export function searchElementsCatalogue(
  rawQuery: string,
  filterCategory?: MainElementCategoryId | 'all'
): UniversalElementItem[] {
  const q = rawQuery.trim().toLowerCase();
  const pool =
    filterCategory && filterCategory !== 'all'
      ? getItemsByCategory(filterCategory)
      : ALL_UNIVERSAL_ELEMENTS;

  if (!q) return pool;

  const tokens = q.split(/\s+/).filter(Boolean);
  const expandedTokens = new Set<string>(tokens);

  for (const t of tokens) {
    if (SEARCH_SYNONYMS[t]) {
      SEARCH_SYNONYMS[t].forEach((syn) => expandedTokens.add(syn.toLowerCase()));
    }
    for (const [key, syns] of Object.entries(SEARCH_SYNONYMS)) {
      if (syns.includes(t)) {
        expandedTokens.add(key);
      }
    }
  }

  const termList = Array.from(expandedTokens);

  return pool.filter((item) => {
    const hay = `${item.name} ${item.category} ${(item as { subcategory?: string }).subcategory || ''} ${item.tags.join(' ')}`.toLowerCase();
    return termList.some((term) => hay.includes(term));
  });
}

export function validateCatalogueIntegrity() {
  const counts: Record<MainElementCategoryId, number> = {
    shapes: SHAPES_LIBRARY_ITEMS.length,
    graphics: GRAPHICS_LIBRARY_ITEMS.length + CANVA_DECORATIVE_ITEMS.length + PREMIUM_WEDDING_ELEMENTS.length,
    photos: PHOTOS_LIBRARY_ITEMS.length,
    videos: VIDEOS_LIBRARY_ITEMS.length,
    audio: AUDIO_LIBRARY_ITEMS.length,
    frames: FRAMES_LIBRARY_ITEMS.length,
    grids: GRIDS_LIBRARY_ITEMS.length,
    charts: CHARTS_LIBRARY_ITEMS.length,
    forms: FORMS_LIBRARY_ITEMS.length,
    sheets: SHEETS_LIBRARY_ITEMS.length,
    tables: TABLES_LIBRARY_ITEMS.length,
    animations: ANIMATIONS_LIBRARY_ITEMS.length,
    mockups: MOCKUPS_LIBRARY_ITEMS.length,
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return {
    counts,
    total,
    isValid: MAIN_ELEMENT_CATEGORIES.every(
      (cat) => counts[cat.id] >= cat.targetCount
    ),
  };
}
