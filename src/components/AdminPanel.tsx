import React, { startTransition, useCallback, useDeferredValue, useEffect, useMemo, useRef, useState } from 'react';
import { uploadPresigned } from '@vercel/blob/client';
import {
  ArrowLeft, AudioLines, BadgeCheck, ChevronRight, Clapperboard,
  Cloud, FileImage, FilePlus2, Film, FolderOpen, Gem, ImagePlus, LayoutTemplate, LockKeyhole,
  LogOut, Music2, Plus, Save, Search, Settings2, ShieldCheck, Trash2, Upload, X,
} from 'lucide-react';
import { INITIAL_TEMPLATES } from '../data/templates';
import { AUDIO_TRACKS } from '../data/audioTracks';
import type { AudioClipSettings, AudioTrack, CardPage, CardTemplate, CanvasItem, ImageElement, VideoElement } from '../types/editor';
import { CANVAS_SIZES } from '../types/editor';
import { Canvas } from './Canvas';
import { Toolbar } from './Toolbar';
import { Sidebar } from './Sidebar';
import { buildSavedCatalog, EMPTY_SAVED_CATALOG, mergeTemplateCatalog, type SavedTemplateCatalog } from '../utils/templateCatalog';

type AdminTab = 'templates' | 'media';
type UploadKind = 'image' | 'video' | 'audio';

const categories: Array<{ id: CardTemplate['category']; label: string }> = [
  { id: 'wedding', label: 'Wedding' },
  { id: 'housewarming', label: 'Griha Pravesh' },
  { id: 'sangeet-mehendi', label: 'Sangeet & Haldi' },
  { id: 'birthday', label: 'Birthday' },
  { id: 'baby-shower', label: 'Godh Bharai' },
  { id: 'anniversary', label: 'Anniversary' },
  { id: 'gold-velvet', label: '24K Gold Foil & Velvet' },
];
const templateSearchAliases: Record<string, string[]> = {
  'royal-marigold-hour-wedding-story': ['The Marigold Hour'],
  'royal-lakeside-wedding': ['Royal Lakeside Palace Suite'],
  'golden-mandap-wedding': ['Swarna Mandap Heritage Suite'],
  'royal-indian-video-wedding': ['Umaid Marwar Palace Vivah'],
  'grand-mandap-royal-video-wedding': ['Rajvilas Vedic Mandap Suite'],
  'royal-rajasthani-wedding': ['Rambagh Crimson Foil Card'],
  'emerald-luxury-wedding': ['Emerald Velvet Botanical Card'],
  'shubh-griha-pravesh': ['Manglik Kalash Griha Pravesh'],
  'sangeet-mehendi-festive': ['Mehfil-e-Sangeet & Mehendi'],
  'first-birthday-celebration': ['Celestial Star 1st Birthday'],
};
const templateSearchIndex = new WeakMap<CardTemplate, string>();
const normalizeSearchText = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ');
const getTemplateSearchText = (template: CardTemplate) => {
  const cached = templateSearchIndex.get(template);
  if (cached) return cached;
  const slideContent = template.pages.flatMap((page) => [
    page.title,
    ...page.elements.flatMap((element) => element.type === 'text' ? [element.text] : []),
  ]).join(' ');
  const searchText = normalizeSearchText(`${template.title} ${template.id} ${template.category} ${template.tags.join(' ')} ${(templateSearchAliases[template.id] || []).join(' ')} ${slideContent}`);
  templateSearchIndex.set(template, searchText);
  return searchText;
};

const transitions = ['none', 'fade', 'slide', 'zoom', 'royal-curtain', 'sparkle', 'push', 'wipe', 'flip', 'blur', 'rotate', 'stack', 'chop', 'match-move', 'iris', 'vertical-wipe', 'cross-zoom', 'page-turn', 'light-sweep', 'panorama'];
const safeFileName = (name: string) => name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(-100) || 'media';
const makeId = () => `custom-${crypto.randomUUID()}`;
const AdminTemplateList = React.memo(function AdminTemplateList({ templates, selectedTemplateId, onSelect }: {
  templates: CardTemplate[];
  selectedTemplateId: string;
  onSelect: (id: string) => void;
}) {
  return <>
    {templates.map((template) => <button key={template.id} title={template.title} onClick={() => onSelect(template.id)} className={`w-full rounded-lg px-3 py-2.5 text-left transition ${template.id === selectedTemplateId ? 'border border-amber-200/15 bg-amber-300/[0.08]' : 'border border-transparent hover:bg-white/[0.035]'}`}><span className="line-clamp-2 text-xs font-medium leading-4 max-md:hidden">{template.title}</span><span className={`block truncate text-[10px] capitalize max-md:hidden ${template.id === selectedTemplateId ? 'mt-1 text-amber-200/60' : 'mt-1 text-stone-600'}`}>{template.category.replace('-', ' ')}</span><span className="hidden text-[10px] text-amber-200 md:hidden">{template.title.slice(0, 2).toUpperCase()}</span></button>)}
  </>;
}, (previous, next) => previous.selectedTemplateId === next.selectedTemplateId
  && previous.onSelect === next.onSelect
  && previous.templates.length === next.templates.length
  && previous.templates.every((template, index) => template.id === next.templates[index].id
    && template.title === next.templates[index].title
    && template.category === next.templates[index].category));
const reflowAudioClips = (pages: CardPage[], clips: NonNullable<CardTemplate['audioClips']>) => clips.map((clip) => {
  if (clip.pageIndex === null) return clip;
  const index = Math.max(0, Math.min(clip.pageIndex, pages.length - 1));
  return { ...clip, pageIndex: index, timelineStartSec: pages.slice(0, index).reduce((sum, page) => sum + (page.duration || 4.5), 0) };
});

function makeTemplate(): CardTemplate {
  const id = makeId();
  return {
    id,
    title: 'New Wedding Invitation',
    category: 'wedding',
    aspectRatio: 'portrait-story',
    tags: ['New Design'],
    thumbnailGradient: 'from-amber-700 via-rose-900 to-neutral-950',
    pages: [{
      id: `${id}-page-1`, title: 'Invitation', backgroundType: 'gradient',
      backgroundValue: 'linear-gradient(155deg, #170b0e 0%, #4b2029 55%, #130b0d 100%)', duration: 5,
      transition: 'fade', elements: [{
        id: `${id}-title`, type: 'text', text: 'Your Invitation', fontFamily: "'Cormorant Garamond', serif",
        fontSize: 34, color: '#f5dfb0', fontWeight: '600', fontStyle: 'normal', textAlign: 'center',
        letterSpacing: 1, lineHeight: 1.15, x: 34, y: 300, width: 382, height: 72, rotation: 0, opacity: 1, zIndex: 3,
      }],
    }],
  };
}

function formatBytes(value: number) {
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

export const AdminPanel: React.FC = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [booting, setBooting] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [savedCatalog, setSavedCatalog] = useState<SavedTemplateCatalog>(EMPTY_SAVED_CATALOG);
  const [templates, setTemplates] = useState<CardTemplate[]>(INITIAL_TEMPLATES);
  const [selectedTemplateId, setSelectedTemplateId] = useState(INITIAL_TEMPLATES[0]?.id || '');
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedElementIds, setSelectedElementIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [showStudioTools, setShowStudioTools] = useState(false);
  const [canvasZoom, setCanvasZoom] = useState(0.55);
  const [pendingDelete, setPendingDelete] = useState<'slide' | 'template' | null>(null);
  const [tab, setTab] = useState<AdminTab>('templates');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [jsonDraft, setJsonDraft] = useState('');
  const [jsonError, setJsonError] = useState('');
  const importRef = useRef<HTMLInputElement>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const uploadKindRef = useRef<UploadKind>('image');

  const selectedTemplate = templates.find((item) => item.id === selectedTemplateId) || templates[0] || null;
  const selectedPage = selectedTemplate?.pages[selectedPageIndex] || selectedTemplate?.pages[0] || null;
  const selectedElement = selectedPage?.elements.find((item) => item.id === selectedElementId) || null;
  const selectedElements = selectedPage?.elements.filter((item) => selectedElementIds.includes(item.id)) || [];
  const selectedGroupId = selectedElement?.groupId;
  const isGroupedSelection = Boolean(selectedGroupId)
    && selectedElements.length > 0
    && selectedElements.every((item) => item.groupId === selectedGroupId);
  const canGroupSelection = selectedElements.length > 1
    && selectedElements.every((item) => item.type === 'text' && !item.locked && !item.groupId);
  const allTracks = useMemo(() => [...AUDIO_TRACKS, ...savedCatalog.customAudioTracks], [savedCatalog.customAudioTracks]);
  const queryTerms = useMemo(() => query.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().match(/[\p{L}\p{N}]+/gu) || [], [query]);
  const filteredTemplates = useMemo(() => templates.filter((template) => {
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    if (!matchesCategory) return false;
    if (queryTerms.length === 0) return true;
    const searchText = getTemplateSearchText(template);
    return queryTerms.every((term) => searchText.includes(term));
  }), [templates, queryTerms, categoryFilter]);
  const deferredFilteredTemplates = useDeferredValue(filteredTemplates);
  const handleSelectTemplate = useCallback((id: string) => {
    setSelectedTemplateId(id);
    setSelectedPageIndex(0);
    setSelectedElementId(null);
  }, []);
  const mediaAssets = useMemo(() => {
    if (tab !== 'media') return [];
    const rows: Array<{ id: string; kind: UploadKind; label: string; url: string; templateId: string; pageIndex: number; elementId?: string }> = [];
    for (const template of templates) {
      template.pages.forEach((page, pageIndex) => page.elements.forEach((element) => {
        if (element.type === 'image') rows.push({ id: element.id, kind: 'image', label: element.alt || template.title, url: element.src, templateId: template.id, pageIndex, elementId: element.id });
        if (element.type === 'video' && element.mediaSrc) rows.push({ id: element.id, kind: 'video', label: element.videoName || template.title, url: element.mediaSrc, templateId: template.id, pageIndex, elementId: element.id });
      }));
      for (const clip of template.audioClips || []) {
        const track = savedCatalog.customAudioTracks.find((item) => item.id === clip.trackId);
        if (track?.audioUrl) rows.push({ id: track.id, kind: 'audio', label: track.name, url: track.audioUrl, templateId: template.id, pageIndex: clip.pageIndex ?? 0 });
      }
    }
    return [...new Map(rows.map((row) => [row.url, row])).values()];
  }, [tab, templates, savedCatalog.customAudioTracks]);

  const reloadCatalog = async () => {
    const response = await fetch('/api/admin/catalog', { credentials: 'same-origin', cache: 'no-store' });
    const contentType = response.headers.get('content-type') || '';
    if (!response.ok || !contentType.includes('application/json')) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || 'Admin APIs are unavailable. Deploy on Vercel or run `vercel dev`.');
    }
    const data = await response.json() as SavedTemplateCatalog;
    const normalized = { ...EMPTY_SAVED_CATALOG, ...data };
    setSavedCatalog(normalized);
    setTemplates(mergeTemplateCatalog(INITIAL_TEMPLATES, normalized));
  };

  useEffect(() => {
    if (selectedElementId) return;
    setSelectedElementIds([]);
    setIsMultiSelectMode(false);
  }, [selectedElementId]);

  useEffect(() => {
    document.title = 'Nimantran Admin Studio';
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      document.head.appendChild(robots);
    }
    const previousRobots = robots.content;
    robots.content = 'noindex, nofollow, noarchive';
    fetch('/api/admin/session', { credentials: 'same-origin', cache: 'no-store' })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (response.ok && data.authenticated) {
          setAuthenticated(true);
          await reloadCatalog();
        } else if (response.status === 503) {
          setAuthError(data.error || 'Admin settings are missing in Vercel.');
        } else if (response.ok && typeof data.authenticated !== 'boolean') {
          setAuthError('Admin APIs are not available here. Deploy to Vercel or run `vercel dev` to use the secure panel.');
        } else if (!response.ok && response.status !== 401) {
          setAuthError(data.error || 'Admin service is not ready.');
        }
      })
      .catch(() => setAuthError('Admin APIs are not available here. Deploy to Vercel or run `vercel dev` to use the secure panel.'))
      .finally(() => setBooting(false));
    return () => { if (robots) robots.content = previousRobots; };
  }, []);

  useEffect(() => {
    if (selectedElement) setJsonDraft(JSON.stringify(selectedElement, null, 2));
    else setJsonDraft('');
    setJsonError('');
  }, [selectedElement]);

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setAuthError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Sign in failed.');
      await reloadCatalog();
      setAuthenticated(true);
      setPassword('');
    } catch (error) {
      setAuthError(error instanceof Error ? error.message : 'Sign in failed.');
    } finally {
      setBusy(false);
    }
  };

  const signOut = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => undefined);
    setAuthenticated(false);
    setNotice('Signed out securely.');
  };

  const updateTemplate = (patch: Partial<CardTemplate>) => {
    if (!selectedTemplate) return;
    setTemplates((items) => items.map((item) => item.id === selectedTemplate.id ? { ...item, ...patch } : item));
  };

  const changeAspectRatio = (nextRatio: CardTemplate['aspectRatio']) => {
    if (!selectedTemplate || selectedTemplate.aspectRatio === nextRatio) return;
    const currentSize = CANVAS_SIZES[selectedTemplate.aspectRatio];
    const nextSize = CANVAS_SIZES[nextRatio];
    const scaleX = nextSize.width / currentSize.width;
    const scaleY = nextSize.height / currentSize.height;
    const scaleType = Math.min(scaleX, scaleY);
    const pages = selectedTemplate.pages.map((page) => ({
      ...page,
      elements: page.elements.map((element) => {
        const scaled = {
          ...element,
          x: element.x * scaleX,
          y: element.y * scaleY,
          width: element.width * scaleX,
          height: element.height * scaleY,
        } as CanvasItem;
        if (scaled.type === 'text') {
          scaled.fontSize = Math.max(1, Math.round(scaled.fontSize * scaleType * 100) / 100);
          scaled.letterSpacing = (scaled.letterSpacing || 0) * scaleType;
        }
        if ('strokeWidth' in scaled && typeof scaled.strokeWidth === 'number') scaled.strokeWidth *= scaleType;
        if ('borderWidth' in scaled && typeof scaled.borderWidth === 'number') scaled.borderWidth *= scaleType;
        if ('borderRadius' in scaled && typeof scaled.borderRadius === 'number') scaled.borderRadius *= scaleType;
        return scaled;
      }),
    }));
    updateTemplate({ aspectRatio: nextRatio, pages });
    setNotice(`Canvas changed to ${CANVAS_SIZES[nextRatio].ratioLabel}; element positions and sizes were proportionally adjusted.`);
  };

  const updatePage = (patch: Partial<CardPage>) => {
    if (!selectedTemplate) return;
    const pages = selectedTemplate.pages.map((page, index) => index === selectedPageIndex ? { ...page, ...patch } : page);
    updateTemplate({ pages, audioClips: reflowAudioClips(pages, selectedTemplate.audioClips || []) });
  };

  const updateElement = (elementId: string, patch: Partial<CanvasItem>) => {
    if (!selectedTemplate) return;
    const templateId = selectedTemplate.id;
    const pageIndex = selectedPageIndex;
    setTemplates((items) => items.map((template) => template.id !== templateId ? template : {
      ...template,
      pages: template.pages.map((page, index) => index === pageIndex
        ? { ...page, elements: page.elements.map((element) => element.id === elementId ? { ...element, ...patch } as CanvasItem : element) }
        : page),
    }));
  };

  useEffect(() => {
    setSelectedElementId(null);
    setSelectedElementIds([]);
    setIsMultiSelectMode(false);
  }, [selectedTemplateId, selectedPageIndex]);

  const handleSelectElement = (id: string | null, additive = false) => {
    if (!id) {
      setSelectedElementId(null);
      setSelectedElementIds([]);
      return;
    }

    const clicked = selectedPage?.elements.find((element) => element.id === id);
    if (additive || isMultiSelectMode) {
      const nextIds = selectedElementIds.includes(id)
        ? selectedElementIds.filter((selectedId) => selectedId !== id)
        : [...selectedElementIds, id];
      setSelectedElementIds(nextIds);
      setSelectedElementId(nextIds.includes(id) ? id : nextIds[nextIds.length - 1] || null);
      return;
    }

    if (clicked?.groupId) {
      const groupIds = selectedPage?.elements
        .filter((element) => element.groupId === clicked.groupId)
        .map((element) => element.id) || [id];
      setSelectedElementId(id);
      setSelectedElementIds(groupIds);
      return;
    }

    if (selectedElementIds.length > 1 && selectedElementIds.includes(id)) {
      setSelectedElementId(id);
      return;
    }

    setSelectedElementId(id);
    setSelectedElementIds([id]);
  };

  const handleGroupSelection = () => {
    if (!canGroupSelection || !selectedPage) return;
    const groupId = `text-group-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
    updatePage({ elements: selectedPage.elements.map((element) => selectedElementIds.includes(element.id)
      ? { ...element, groupId } as CanvasItem
      : element) });
    setIsMultiSelectMode(false);
  };

  const handleUngroupSelection = () => {
    if (!selectedGroupId || !selectedElementId || !selectedPage) return;
    updatePage({ elements: selectedPage.elements.map((element) => element.groupId === selectedGroupId
      ? { ...element, groupId: undefined } as CanvasItem
      : element) });
    setSelectedElementIds([selectedElementId]);
    setIsMultiSelectMode(false);
  };

  const handleDeleteSelection = () => {
    if (!selectedPage) return;
    const idsToDelete = selectedElementIds.length > 1 ? selectedElementIds : selectedElementId ? [selectedElementId] : [];
    if (!idsToDelete.length) return;
    updatePage({ elements: selectedPage.elements.filter((element) => !idsToDelete.includes(element.id)) });
    setSelectedElementId(null);
  };

  const handleRemoveElement = (id: string) => {
    if (!selectedPage) return;
    updatePage({ elements: selectedPage.elements.filter((element) => element.id !== id) });
    if (selectedElementIds.includes(id)) {
      const remainingIds = selectedElementIds.filter((selectedId) => selectedId !== id);
      setSelectedElementIds(remainingIds);
      setSelectedElementId(remainingIds[remainingIds.length - 1] || null);
    }
  };

  const selectOnlyElement = (id: string) => {
    setSelectedElementId(id);
    setSelectedElementIds([id]);
    setIsMultiSelectMode(false);
  };

  const addTemplate = () => {
    const next = makeTemplate();
    setTemplates((items) => [next, ...items]);
    setSelectedTemplateId(next.id);
    setSelectedPageIndex(0);
    setSelectedElementId(null);
    setTab('templates');
    setNotice('New template draft created. Save it to publish.');
  };

  const duplicateTemplate = () => {
    if (!selectedTemplate) return;
    const id = makeId();
    const clone = structuredClone(selectedTemplate);
    clone.id = id;
    clone.title = `${selectedTemplate.title} — Copy`;
    clone.tags = [...new Set([...clone.tags, 'Custom'])];
    clone.pages = clone.pages.map((page, index) => ({
      ...page, id: `${id}-page-${index + 1}`,
      elements: page.elements.map((element, elIndex) => ({ ...element, id: `${id}-page-${index + 1}-element-${elIndex + 1}` } as CanvasItem)),
    }));
    setTemplates((items) => [clone, ...items]);
    setSelectedTemplateId(id);
    setSelectedPageIndex(0);
    setSelectedElementId(null);
    setNotice('Template duplicated. Edit and save to publish.');
  };

  const deleteTemplate = () => {
    if (!selectedTemplate) return;
    setPendingDelete('template');
  };

  const confirmDelete = () => {
    if (!selectedTemplate || !pendingDelete) return;
    if (pendingDelete === 'template') {
      const next = templates.filter((item) => item.id !== selectedTemplate.id);
      setTemplates(next);
      setSelectedTemplateId(next[0]?.id || '');
      setSelectedPageIndex(0);
      setSelectedElementId(null);
      setNotice('Template removed from this draft. Choose Save & publish to apply it to the website.');
    } else {
      if (selectedTemplate.pages.length <= 1 || !selectedPage) return;
      const nextPages = selectedTemplate.pages.filter((_, index) => index !== selectedPageIndex);
      const nextClips = (selectedTemplate.audioClips || []).flatMap((clip) => {
        if (clip.pageIndex === null || clip.pageIndex < selectedPageIndex) return [clip];
        if (clip.pageIndex === selectedPageIndex) return [];
        return [{ ...clip, pageIndex: clip.pageIndex - 1 }];
      });
      updateTemplate({ pages: nextPages, audioClips: reflowAudioClips(nextPages, nextClips) });
      setSelectedPageIndex(Math.max(0, selectedPageIndex - 1));
      setSelectedElementId(null);
      setNotice('Slide removed from this draft. Save & publish to apply it to the website.');
    }
    setPendingDelete(null);
  };

  const deletePage = () => {
    if (!selectedTemplate || selectedTemplate.pages.length <= 1) return;
    setPendingDelete('slide');
  };

  const saveCatalog = async () => {
    if (!selectedTemplate || !selectedTemplate.title.trim() || selectedTemplate.pages.length === 0) {
      setNotice('Add a title and at least one slide before saving.');
      return;
    }
    setBusy(true);
    setNotice('Saving updates to the live catalog…');
    try {
      const payload = buildSavedCatalog(INITIAL_TEMPLATES, templates, savedCatalog);
      const response = await fetch('/api/admin/catalog', {
        method: 'PUT', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseRevision: savedCatalog.revision, catalog: payload }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Could not save changes.');
      setSavedCatalog({ ...EMPTY_SAVED_CATALOG, ...data });
      setTemplates(mergeTemplateCatalog(INITIAL_TEMPLATES, data));
      setNotice('Saved. The public template catalog will show these changes after its next refresh.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not save changes.');
    } finally {
      setBusy(false);
    }
  };

  const addPage = () => {
    if (!selectedTemplate) return;
    const page: CardPage = {
      id: `${selectedTemplate.id}-page-${Date.now()}`, title: `Slide ${selectedTemplate.pages.length + 1}`,
      backgroundType: 'gradient', backgroundValue: 'linear-gradient(155deg, #170b0e 0%, #4b2029 55%, #130b0d 100%)',
      duration: 5, transition: 'fade', elements: [],
    };
    updateTemplate({ pages: [...selectedTemplate.pages, page] });
    setSelectedPageIndex(selectedTemplate.pages.length);
    setSelectedElementId(null);
  };

  const movePage = (offset: -1 | 1) => {
    if (!selectedTemplate) return;
    const destination = selectedPageIndex + offset;
    if (destination < 0 || destination >= selectedTemplate.pages.length) return;
    const pages = [...selectedTemplate.pages];
    [pages[selectedPageIndex], pages[destination]] = [pages[destination], pages[selectedPageIndex]];
    const order = selectedTemplate.pages.map((_, index) => index);
    [order[selectedPageIndex], order[destination]] = [order[destination], order[selectedPageIndex]];
    const nextIndexByOldIndex = new Map(order.map((oldIndex, newIndex) => [oldIndex, newIndex]));
    const clips = (selectedTemplate.audioClips || []).map((clip) => clip.pageIndex === null ? clip : {
      ...clip,
      pageIndex: nextIndexByOldIndex.get(clip.pageIndex) ?? clip.pageIndex,
    });
    updateTemplate({ pages, audioClips: reflowAudioClips(pages, clips) });
    setSelectedPageIndex(destination);
  };

  const duplicatePage = () => {
    if (!selectedTemplate || !selectedPage) return;
    const page = structuredClone(selectedPage);
    page.id = `${selectedTemplate.id}-page-${Date.now()}`;
    page.title = `${page.title} copy`;
    page.elements = page.elements.map((element) => ({ ...element, id: `${element.id}-copy-${Date.now()}` } as CanvasItem));
    const pages = [...selectedTemplate.pages];
    pages.splice(selectedPageIndex + 1, 0, page);
    const duplicateStart = pages.slice(0, selectedPageIndex + 1).reduce((sum, item) => sum + (item.duration || 4.5), 0);
    const clips = (selectedTemplate.audioClips || []).flatMap((clip) => {
      if (clip.pageIndex === null) return [clip];
      const pageIndex = clip.pageIndex > selectedPageIndex ? clip.pageIndex + 1 : clip.pageIndex;
      const moved = { ...clip, pageIndex };
      if (clip.pageIndex !== selectedPageIndex) return [moved];
      return [moved, { ...clip, id: `${clip.id}-copy-${Date.now()}`, pageIndex: selectedPageIndex + 1, timelineStartSec: duplicateStart }];
    });
    updateTemplate({ pages, audioClips: reflowAudioClips(pages, clips) });
    setSelectedPageIndex(selectedPageIndex + 1);
    setSelectedElementId(null);
  };

  const addText = () => {
    if (!selectedTemplate || !selectedPage) return;
    const id = `${selectedTemplate.id}-text-${Date.now()}`;
    const canvasSize = CANVAS_SIZES[selectedTemplate.aspectRatio];
    const text: CanvasItem = {
      id, type: 'text', text: 'Your invitation message', fontFamily: "'Cormorant Garamond', serif", fontSize: Math.round(canvasSize.width * 0.05),
      color: '#f5dfb0', fontWeight: '500', fontStyle: 'normal', textAlign: 'center', letterSpacing: 0,
      lineHeight: 1.2, x: canvasSize.width * 0.1, y: canvasSize.height * 0.45, width: canvasSize.width * 0.8, height: canvasSize.height * 0.1, rotation: 0, opacity: 1, zIndex: 4,
    };
    updatePage({ elements: [...selectedPage.elements, text] });
    selectOnlyElement(id);
  };

  const startUpload = (kind: UploadKind) => {
    uploadKindRef.current = kind;
    if (uploadRef.current) {
      uploadRef.current.accept = kind === 'image' ? 'image/jpeg,image/png,image/webp,image/avif' : kind === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'audio/mpeg,audio/mp4,audio/aac,audio/wav,audio/ogg,audio/webm';
      uploadRef.current.click();
    }
  };

  const processUpload = async (file: File) => {
    const kind = uploadKindRef.current;
    if (!selectedTemplate || !selectedPage) return;
    if (file.size > 250 * 1024 * 1024) {
      setNotice('Maximum upload size is 250 MB.');
      return;
    }
    setUploadProgress(0);
    setNotice(`Uploading ${file.name} securely to Vercel Blob…`);
    try {
      const pathname = `nimantran-media/${kind}/${Date.now()}-${safeFileName(file.name)}`;
      const result = await uploadPresigned(pathname, file, {
        access: 'public', handleUploadUrl: '/api/admin/upload',
        multipart: file.size > 5 * 1024 * 1024,
        clientPayload: JSON.stringify({ kind }),
        onUploadProgress: ({ percentage }) => setUploadProgress(percentage),
      });
      if (kind === 'image') {
        const id = `${selectedTemplate.id}-image-${Date.now()}`;
        const canvasSize = CANVAS_SIZES[selectedTemplate.aspectRatio];
        const image: ImageElement = {
          id, type: 'image', src: result.url, alt: file.name, altText: file.name, mask: 'none',
          x: canvasSize.width * 0.07, y: canvasSize.height * 0.12, width: canvasSize.width * 0.86, height: canvasSize.height * 0.72, rotation: 0, opacity: 1, zIndex: 2,
          objectFit: 'cover', scale: 1, offsetX: 0, offsetY: 0,
        };
        updatePage({ elements: [...selectedPage.elements, image] });
        selectOnlyElement(id);
      } else if (kind === 'video') {
        const id = `${selectedTemplate.id}-video-${Date.now()}`;
        const canvasSize = CANVAS_SIZES[selectedTemplate.aspectRatio];
        const video: VideoElement = {
          id, type: 'video', videoId: id, videoName: file.name, mediaSrc: result.url,
          visualTheme: 'custom-upload', primaryColor: '#d7b86a', secondaryColor: '#651c35',
          bgGradient: 'linear-gradient(135deg, #220c16, #6a203c)', isPlaying: true,
          isMuted: true, loop: true, playbackSpeed: 1, borderRadius: 18,
          borderColor: '#d7b86a', borderWidth: 1, x: canvasSize.width * 0.07, y: canvasSize.height * 0.12, width: canvasSize.width * 0.86, height: canvasSize.height * 0.72,
          rotation: 0, opacity: 1, zIndex: 2,
        };
        updatePage({ elements: [...selectedPage.elements, video] });
        selectOnlyElement(id);
      } else {
        const track: AudioTrack = {
          id: `custom-audio-${crypto.randomUUID()}`, name: file.name.replace(/\.[^.]+$/, ''),
          category: 'shehnai', ragaNotes: [], tempo: 90, description: 'Uploaded in Nimantran Admin Studio', audioUrl: result.url,
        };
        setSavedCatalog((current) => ({ ...current, customAudioTracks: [...current.customAudioTracks, track] }));
        const nextClip = {
          id: `admin-audio-${Date.now()}`, trackId: track.id, pageIndex: selectedPageIndex,
          timelineStartSec: selectedTemplate.pages.slice(0, selectedPageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0),
          settings: { startSec: 0, durationSec: selectedPage.duration || 5, volume: 0.42, fadeInSec: 0.25, fadeOutSec: 0.4, loop: false },
        };
        updateTemplate({ audioClips: [...(selectedTemplate.audioClips || []).filter((clip) => clip.pageIndex !== selectedPageIndex), nextClip] });
      }
      setNotice(`${file.name} uploaded and added to this draft. Save to publish it.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Upload failed. Check the Blob store setup and try again.');
    } finally {
      setUploadProgress(null);
      if (uploadRef.current) uploadRef.current.value = '';
    }
  };

  const assignTrack = (trackId: string) => {
    if (!selectedTemplate || !selectedPage || !trackId) return;
    const nextClip = {
      id: `admin-audio-${Date.now()}`, trackId, pageIndex: selectedPageIndex,
      timelineStartSec: selectedTemplate.pages.slice(0, selectedPageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0),
      settings: { startSec: 0, durationSec: selectedPage.duration || 5, volume: 0.42, fadeInSec: 0.25, fadeOutSec: 0.4, loop: false },
    };
    updateTemplate({ audioClips: [...(selectedTemplate.audioClips || []).filter((clip) => clip.pageIndex !== selectedPageIndex), nextClip] });
    setNotice('Music assigned to this slide. Save to publish.');
  };

  const applyElementJson = () => {
    if (!selectedElementId) return;
    try {
      const parsed = JSON.parse(jsonDraft) as CanvasItem;
      if (!parsed || parsed.id !== selectedElementId || !parsed.type) throw new Error('Keep the selected element ID and type unchanged.');
      updateElement(selectedElementId, parsed as Partial<CanvasItem>);
      setJsonError('');
      setNotice('Element settings applied to this draft. Save to publish.');
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'Invalid element JSON.');
    }
  };

  const exportBackup = () => {
    const payload = buildSavedCatalog(INITIAL_TEMPLATES, templates, savedCatalog);
    const blob = new Blob([JSON.stringify({ ...payload, revision: savedCatalog.revision }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `nimantran-template-catalog-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Catalog backup downloaded.');
  };

  const importBackup = async (file: File) => {
    try {
      const parsed = JSON.parse(await file.text()) as Partial<SavedTemplateCatalog>;
      if (!Array.isArray(parsed.added) || !Array.isArray(parsed.hiddenIds) || !Array.isArray(parsed.customAudioTracks) || !parsed.overrides) {
        throw new Error('This file is not a Nimantran catalog backup.');
      }
      const normalized = { ...EMPTY_SAVED_CATALOG, ...parsed, revision: savedCatalog.revision } as SavedTemplateCatalog;
      setSavedCatalog(normalized);
      setTemplates(mergeTemplateCatalog(INITIAL_TEMPLATES, normalized));
      setNotice('Backup loaded as a draft. Save changes to publish it.');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not import this backup.');
    }
  };

  if (booting) return <div className="min-h-screen bg-[#0b0809] text-amber-100 grid place-items-center"><div className="animate-pulse flex items-center gap-3"><Gem className="h-5 w-5 text-amber-300" /> Opening private studio…</div></div>;

  if (!authenticated) return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,#392018_0%,#130d0e_42%,#090809_100%)] text-stone-100 grid place-items-center px-5 py-12">
      <div className="w-full max-w-[470px] rounded-[28px] border border-amber-200/15 bg-[#120e0f]/90 p-8 shadow-[0_35px_100px_rgba(0,0,0,.6)] sm:p-10">
        <a href="/" className="mb-9 inline-flex items-center gap-2 text-sm text-stone-400 transition hover:text-amber-200"><ArrowLeft className="h-4 w-4" /> Back to website</a>
        <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-300/30 bg-amber-200/[0.07] text-amber-200"><ShieldCheck className="h-7 w-7" /></div>
        <p className="text-[11px] font-semibold uppercase tracking-[.28em] text-amber-300">Private access</p>
        <h1 className="mt-3 font-serif text-4xl text-[#fff3e1]">Nimantran Admin</h1>
        <p className="mt-3 text-sm leading-6 text-stone-400">Sign in to manage the live invitation catalog, artwork, video and music.</p>
        {authError && <div className="mt-6 rounded-xl border border-rose-300/20 bg-rose-950/30 px-4 py-3 text-sm leading-5 text-rose-200">{authError}</div>}
        <form onSubmit={signIn} className="mt-7 space-y-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">Username<input autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition focus:border-amber-300/50" /></label>
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300">Password<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-4 py-3.5 text-sm text-white outline-none transition focus:border-amber-300/50" /></label>
          <button disabled={busy} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-200 via-amber-300 to-yellow-500 px-4 py-3.5 font-semibold text-[#23140a] shadow-lg shadow-amber-950/30 transition hover:brightness-110 disabled:opacity-60"><LockKeyhole className="h-4 w-4" />{busy ? 'Checking access…' : 'Enter Admin Studio'}</button>
        </form>
        <div className="mt-6 flex items-start gap-2 border-t border-white/10 pt-5 text-xs leading-5 text-stone-500"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300/80" /> Login is verified on the server. Your password is not stored in this browser.</div>
      </div>
    </main>
  );

  const selectClasses = 'w-full rounded-lg border border-white/10 bg-[#110e10] px-3 py-2.5 text-sm text-stone-200 outline-none transition focus:border-amber-300/45';
  const inputClasses = 'w-full rounded-lg border border-white/10 bg-[#110e10] px-3 py-2.5 text-sm text-stone-100 outline-none transition placeholder:text-stone-600 focus:border-amber-300/45';
  const activeAudioClip = selectedTemplate?.audioClips?.find((clip) => clip.pageIndex === selectedPageIndex) || null;

  return (
    <div className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#0b090a] text-stone-100 selection:bg-amber-300/30">
      <header className="z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-amber-200/10 bg-[#100d0e]/95 px-5 shadow-lg shadow-black/20 md:px-8">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-200/20 bg-amber-300/[0.08] text-amber-200"><Gem className="h-5 w-5" /></div><div><p className="font-serif text-lg tracking-wide text-[#fff1db]">Nimantran <span className="text-amber-300">Admin</span></p><p className="hidden text-[10px] uppercase tracking-[.18em] text-stone-500 sm:block">Private template studio</p></div></div>
        <div className="flex items-center gap-2 sm:gap-3"><span className="hidden items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[11px] text-emerald-200/90 md:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Live catalog</span><button onClick={exportBackup} className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-300 hover:border-amber-200/30 hover:text-amber-100 sm:block">Export backup</button><button onClick={signOut} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-300 transition hover:border-rose-200/30 hover:text-rose-200"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></button><button onClick={saveCatalog} disabled={busy || uploadProgress !== null} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-200 to-yellow-500 px-3.5 py-2.5 text-xs font-bold text-[#211307] transition hover:brightness-110 disabled:opacity-50 sm:px-5"><Save className="h-4 w-4" />{busy ? 'Publishing…' : 'Save & publish'}</button></div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[270px] shrink-0 flex-col border-r border-white/[0.07] bg-[#100d0e] max-lg:w-[230px] max-md:w-[58px]">
          <div className="flex gap-1 border-b border-white/[0.07] p-3 max-md:flex-col">{([{ id: 'templates', label: 'Templates', icon: LayoutTemplate }, { id: 'media', label: 'Media library', icon: FolderOpen }] as const).map((item) => <button key={item.id} onClick={() => setTab(item.id)} title={item.label} className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs transition max-md:aspect-square max-md:p-0 ${tab === item.id ? 'bg-amber-300/10 text-amber-200' : 'text-stone-500 hover:bg-white/[0.04] hover:text-stone-200'}`}><item.icon className="h-4 w-4 shrink-0" /><span className="max-md:hidden">{item.label}</span></button>)}</div>
          {tab === 'templates' ? <>
            <div className="space-y-2 p-3 max-md:hidden"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a template" className="w-full rounded-lg border border-white/[0.08] bg-black/20 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-amber-300/40" /></div><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={`${selectClasses} py-2 text-xs`}><option value="all">All categories · {templates.length}</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}</select></div>
            <div className="flex items-center justify-between px-4 pb-2 pt-1 max-md:hidden"><span className="text-[10px] font-semibold uppercase tracking-[.18em] text-stone-600">Catalog</span><span className="text-[10px] text-stone-600">{filteredTemplates.length}</span></div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
              <button onClick={addTemplate} title="New template" className="mb-2 flex w-full items-center gap-2 rounded-lg border border-dashed border-amber-300/20 px-3 py-2.5 text-left text-xs text-amber-200 transition hover:bg-amber-300/[0.06]"><Plus className="h-4 w-4 shrink-0" /><span className="max-md:hidden">Create new template</span></button>
              <AdminTemplateList templates={deferredFilteredTemplates} selectedTemplateId={selectedTemplateId} onSelect={handleSelectTemplate} />
            </div>
          </> : <div className="space-y-3 overflow-y-auto p-3 max-md:hidden"><p className="px-1 text-[10px] font-semibold uppercase tracking-[.16em] text-stone-600">Upload to selected slide</p><button onClick={() => startUpload('image')} className="flex w-full items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2.5 text-left text-xs text-stone-300 hover:border-amber-200/20 hover:text-amber-100"><ImagePlus className="h-4 w-4 text-amber-200" /> Image / artwork</button><button onClick={() => startUpload('video')} className="flex w-full items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2.5 text-left text-xs text-stone-300 hover:border-amber-200/20 hover:text-amber-100"><Film className="h-4 w-4 text-amber-200" /> Video clip</button><button onClick={() => startUpload('audio')} className="flex w-full items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2.5 text-left text-xs text-stone-300 hover:border-amber-200/20 hover:text-amber-100"><Music2 className="h-4 w-4 text-amber-200" /> Music track</button><div className="rounded-xl border border-amber-200/10 bg-amber-200/[0.035] p-3 text-[11px] leading-5 text-stone-500">Uploaded assets are placed in Vercel Blob and linked to the selected template after saving.</div><div className="border-t border-white/[0.07] pt-3"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-stone-600">Catalog media · {mediaAssets.length}</p>{mediaAssets.map((asset) => <button key={asset.id} onClick={() => { setSelectedTemplateId(asset.templateId); setSelectedPageIndex(asset.pageIndex); setSelectedElementId(asset.elementId || null); setTab('templates'); }} className="flex w-full items-center gap-2 rounded-md border-b border-white/[0.04] py-2 text-left text-xs text-stone-400 hover:text-amber-100"><span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded bg-white/[0.04] text-amber-200/80">{asset.kind === 'image' ? <img src={asset.url} alt="" className="h-full w-full object-cover" /> : asset.kind === 'video' ? <Film className="h-3.5 w-3.5" /> : <AudioLines className="h-3.5 w-3.5" />}</span><span className="min-w-0"><span className="block truncate">{asset.label}</span><span className="mt-0.5 block text-[9px] capitalize text-stone-600">{asset.kind} · {templates.find((item) => item.id === asset.templateId)?.title}</span></span></button>)}</div><div className="border-t border-white/[0.07] pt-3"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-stone-600">Available music tracks · {allTracks.length}</p>{allTracks.slice(-12).map((track) => <div key={track.id} className="flex items-center gap-2 border-b border-white/[0.04] py-2 text-xs text-stone-400"><AudioLines className="h-3.5 w-3.5 text-amber-200/70" /><span className="truncate">{track.name}</span></div>)}</div></div>}
            <div className="border-t border-white/[0.07] p-3 max-md:hidden"><button onClick={() => importRef.current?.click()} className="w-full rounded-lg px-2 py-2 text-left text-xs text-stone-500 hover:text-stone-200"><Upload className="mr-2 inline h-3.5 w-3.5" />Import catalog backup</button><input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importBackup(file); event.currentTarget.value = ''; }} /></div>
        </aside>

        <main className={`min-w-0 flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_40%_0%,rgba(89,47,30,.14),transparent_50%)] ${showStudioTools ? 'lg:pl-[416px]' : ''}`}>
          {!selectedTemplate ? <div className="grid h-full place-items-center p-8 text-sm text-stone-500">No templates are in the current catalog. Create one to begin.</div> : <div className="mx-auto max-w-[1600px] p-4 md:p-7">
            <div className="mb-4 flex flex-col gap-3 2xl:flex-row 2xl:items-center 2xl:justify-between"><div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-amber-300/80">Template editor</p><h1 className="mt-1 max-w-full break-words font-serif text-2xl leading-tight text-[#fff1db] sm:text-3xl">{selectedTemplate.title}</h1><p className="mt-2 text-xs text-stone-500">{selectedTemplate.pages.length} slides · {CANVAS_SIZES[selectedTemplate.aspectRatio].ratioLabel}</p></div><div className="flex items-center gap-2"><button onClick={duplicateTemplate} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-300 hover:border-amber-200/25"><FilePlus2 className="mr-1.5 inline h-4 w-4" />Make a copy</button><button onClick={deleteTemplate} className="flex items-center gap-1.5 rounded-lg border border-rose-300/10 px-3 py-2 text-xs text-rose-200/75 hover:border-rose-300/35 hover:text-rose-100" title="Remove template"><Trash2 className="h-4 w-4" />Remove</button></div></div>

            {notice && <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-amber-200/10 bg-amber-200/[0.04] px-4 py-3 text-xs leading-5 text-amber-100/80"><span className="flex items-center gap-2"><Cloud className="h-4 w-4 shrink-0 text-amber-300" />{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X className="h-4 w-4 text-stone-600" /></button></div>}

            <section className="block">
              <div className="space-y-5">
                <details className="group rounded-2xl border border-white/[0.08] bg-[#131011]/90 shadow-2xl shadow-black/10">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-xs font-semibold text-stone-300 md:px-6"><span className="flex items-center gap-2"><Settings2 className="h-4 w-4 text-amber-300" />Template details <span className="hidden font-normal text-stone-600 sm:inline">· name, category, size and tags</span></span><ChevronRight className="h-4 w-4 shrink-0 text-stone-500 transition group-open:rotate-90" /></summary>
                  <div className="grid min-w-0 gap-4 border-t border-white/[0.07] p-5 md:grid-cols-2 md:p-6"><label className="min-w-0 text-[11px] text-stone-500">Template name<input value={selectedTemplate.title} onChange={(event) => updateTemplate({ title: event.target.value })} className={`${inputClasses} mt-1.5 block w-full min-w-0`} /></label><label className="min-w-0 text-[11px] text-stone-500">Category<select value={selectedTemplate.category} onChange={(event) => updateTemplate({ category: event.target.value as CardTemplate['category'] })} className={`${selectClasses} mt-1.5 block w-full min-w-0`}>{categories.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}</select></label><label className="min-w-0 text-[11px] text-stone-500">Canvas size<select value={selectedTemplate.aspectRatio} onChange={(event) => changeAspectRatio(event.target.value as CardTemplate['aspectRatio'])} className={`${selectClasses} mt-1.5 block w-full min-w-0`}><option value="portrait-story">Portrait story · 9:16</option><option value="portrait-classic">Print · 5:7</option><option value="a4-print">A4 print</option><option value="square">Square · 1:1</option><option value="landscape">Landscape · 7:5</option><option value="whatsapp-banner">Wide video · 16:9</option></select></label><label className="min-w-0 text-[11px] text-stone-500">Search tags<input value={selectedTemplate.tags.join(', ')} onChange={(event) => updateTemplate({ tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })} className={`${inputClasses} mt-1.5 block w-full min-w-0`} placeholder="Wedding, photo frame, maroon" /></label></div>
                </details>

                  <div className="flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#131011]/90 shadow-2xl shadow-black/10">
                  <div className="order-1 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3"><div><p className="text-xs font-semibold text-stone-200">Design your slides</p><p className="mt-1 text-[10px] text-stone-500">Select an item on the preview to edit it.</p></div><div className="flex flex-wrap items-center gap-2"><button onClick={() => setShowStudioTools((open) => !open)} aria-pressed={showStudioTools} className={`rounded-lg border px-3 py-2 text-[11px] transition ${showStudioTools ? 'border-amber-200/35 bg-amber-300/[0.12] text-amber-100' : 'border-amber-200/20 bg-amber-300/[0.06] text-amber-100 hover:bg-amber-300/[0.12]'}`}>{showStudioTools ? <X className="mr-1 inline h-3.5 w-3.5" /> : <Settings2 className="mr-1 inline h-3.5 w-3.5" />}{showStudioTools ? 'Close tools' : 'Design tools'}</button><button onClick={addText} className="rounded-lg border border-white/10 px-3 py-2 text-[11px] text-stone-300 hover:border-amber-200/25"><Plus className="mr-1 inline h-3.5 w-3.5" />Add text</button><button onClick={() => startUpload('image')} className="rounded-lg border border-white/10 px-3 py-2 text-[11px] text-stone-300 hover:border-amber-200/25"><ImagePlus className="mr-1 inline h-3.5 w-3.5" />Add photo</button><button onClick={addPage} className="rounded-lg bg-amber-300/[0.08] px-3 py-2 text-[11px] text-amber-200 hover:bg-amber-300/[0.14]"><Plus className="mr-1 inline h-3.5 w-3.5" />Add slide</button></div></div>
                  {selectedPage && <div className="order-2 grid gap-5 p-3 sm:p-5 2xl:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
                    <div className="min-w-0 space-y-4 max-2xl:order-2 2xl:col-start-1 2xl:row-start-1"><div className="grid gap-3 sm:grid-cols-2"><label className="text-[11px] text-stone-500">Slide title<input value={selectedPage.title} onChange={(event) => updatePage({ title: event.target.value })} className={`${inputClasses} mt-1.5`} /></label><label className="text-[11px] text-stone-500">Transition<select value={selectedPage.transition || 'fade'} onChange={(event) => updatePage({ transition: event.target.value as CardPage['transition'] })} className={`${selectClasses} mt-1.5`}>{transitions.map((transition) => <option key={transition} value={transition}>{transition}</option>)}</select></label><label className="text-[11px] text-stone-500">Background<select value={selectedPage.backgroundType} onChange={(event) => updatePage({ backgroundType: event.target.value as CardPage['backgroundType'] })} className={`${selectClasses} mt-1.5`}><option value="color">Solid color</option><option value="gradient">Gradient</option><option value="pattern">Pattern</option><option value="image">Image URL</option></select></label><label className="text-[11px] text-stone-500">Duration · seconds<input type="number" min="1" max="60" step="0.5" value={selectedPage.duration || 5} onChange={(event) => updatePage({ duration: Number(event.target.value) || 5 })} className={`${inputClasses} mt-1.5`} /></label></div><label className="block text-[11px] text-stone-500">Background value<input value={selectedPage.backgroundValue} onChange={(event) => updatePage({ backgroundValue: event.target.value })} className={`${inputClasses} mt-1.5`} placeholder="#1b0d11, CSS gradient or image URL" /></label>
                      <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Elements on this slide · {selectedPage.elements.length}</span><button onClick={() => startUpload('video')} className="text-[10px] text-amber-200/80 hover:text-amber-100"><Clapperboard className="mr-1 inline h-3.5 w-3.5" />Add video</button></div><div className="max-h-[300px] space-y-1 overflow-y-auto">{selectedPage.elements.map((element) => <div key={element.id} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${selectedElementIds.includes(element.id) ? 'border-amber-200/20 bg-amber-300/[0.06]' : 'border-transparent hover:bg-white/[0.035]'}`}><button onClick={() => handleSelectElement(element.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/[0.04] text-amber-200/70">{element.type === 'text' ? <span className="font-serif text-sm">T</span> : element.type === 'video' ? <Film className="h-3.5 w-3.5" /> : element.type === 'image' ? <FileImage className="h-3.5 w-3.5" /> : <LayoutTemplate className="h-3.5 w-3.5" />}</span><span className="min-w-0"><span className="block truncate text-[11px] text-stone-300">{element.type === 'text' ? (element as Extract<CanvasItem, { type: 'text' }>).text || 'Text' : element.type === 'image' ? (element as ImageElement).alt || 'Image' : element.type === 'video' ? (element as VideoElement).videoName || 'Video' : element.type}</span><span className="mt-0.5 block text-[9px] uppercase tracking-wider text-stone-600">{element.type}</span></span></button><button onClick={() => handleRemoveElement(element.id)} aria-label="Remove element" className="p-1 text-stone-600 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button></div>)}{selectedPage.elements.length === 0 && <p className="py-5 text-center text-[11px] text-stone-600">No design elements yet. Add text, artwork or a video.</p>}</div></div>
                    </div>
                    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#100d0e] shadow-xl shadow-black/20 max-2xl:order-1 2xl:col-start-2 2xl:row-start-1">
                      <div className="flex items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3">
                        <div><p className="text-xs font-semibold text-stone-200">Live design canvas</p><p className="mt-1 text-[10px] text-stone-500">Select text, then use its toolbar to select and group multiple boxes.</p></div>
                        <span className="shrink-0 rounded-full border border-amber-200/10 px-2.5 py-1 text-[10px] text-amber-100/70">Slide {selectedPageIndex + 1}</span>
                      </div>
                      <div className="flex h-[min(52vh,620px)] min-h-[300px] min-w-0 w-full">
                        <Canvas
                          aspectRatio={selectedTemplate.aspectRatio}
                          backgroundType={selectedPage.backgroundType}
                          backgroundValue={selectedPage.backgroundValue}
                          elements={selectedPage.elements}
                          selectedElementId={selectedElementId}
                          selectedElementIds={selectedElementIds}
                          multiSelectMode={isMultiSelectMode}
                          onSelectElement={handleSelectElement}
                          onUpdateElement={(id, updates) => updateElement(id, updates)}
                          onAddElement={(element) => { updatePage({ elements: [...selectedPage.elements, element] }); selectOnlyElement(element.id); }}
                          onDeleteElement={() => {
                            handleDeleteSelection();
                          }}
                          onDuplicateElement={() => {
                            const element = selectedPage.elements.find((item) => item.id === selectedElementId);
                            if (!element) return;
                            const copy = { ...structuredClone(element), id: `${element.id}-copy-${Date.now()}`, x: element.x + 16, y: element.y + 16 } as CanvasItem;
                            updatePage({ elements: [...selectedPage.elements, copy] });
                            selectOnlyElement(copy.id);
                          }}
                          onBringForward={() => {
                            const element = selectedPage.elements.find((item) => item.id === selectedElementId);
                            if (element) updateElement(element.id, { zIndex: Number(('zIndex' in element && element.zIndex) || 1) + 1 });
                          }}
                          onSendBackward={() => {
                            const element = selectedPage.elements.find((item) => item.id === selectedElementId);
                            if (element) updateElement(element.id, { zIndex: Math.max(1, Number(('zIndex' in element && element.zIndex) || 1) - 1) });
                          }}
                          onBringToFront={() => {
                            const element = selectedPage.elements.find((item) => item.id === selectedElementId);
                            if (element) updateElement(element.id, { zIndex: Math.max(...selectedPage.elements.map((item) => Number(('zIndex' in item && item.zIndex) || 1)), 0) + 1 });
                          }}
                          onSendToBack={() => {
                            const element = selectedPage.elements.find((item) => item.id === selectedElementId);
                            if (element) updateElement(element.id, { zIndex: 1 });
                          }}
                          zoom={canvasZoom}
                          onZoomChange={setCanvasZoom}
                          showRulers={false}
                          showSafeZones={false}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t border-white/[0.07] p-3">
                        <button onClick={() => startUpload('image')} className="rounded-lg border border-white/[0.08] py-2.5 text-xs text-stone-300 transition hover:border-amber-200/25 hover:text-amber-100"><ImagePlus className="mr-1.5 inline h-4 w-4" />Add photo</button>
                        <button onClick={() => startUpload('audio')} className="rounded-lg border border-white/[0.08] py-2.5 text-xs text-stone-300 transition hover:border-amber-200/25 hover:text-amber-100"><Music2 className="mr-1.5 inline h-4 w-4" />Add music</button>
                      </div>
                    </div>
                  </div>}
                  <div className="order-3 flex gap-2 overflow-x-auto border-y border-white/[0.07] px-4 py-3">{selectedTemplate.pages.map((page, index) => <button key={page.id} onClick={() => { setSelectedPageIndex(index); setSelectedElementId(null); }} className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left text-[11px] transition ${index === selectedPageIndex ? 'border-amber-200/25 bg-amber-300/[0.07] text-amber-100' : 'border-white/[0.07] text-stone-500 hover:text-stone-200'}`}><span className="grid h-5 w-5 place-items-center rounded bg-black/20 text-[9px]">{String(index + 1).padStart(2, '0')}</span><span className="max-w-36 truncate">{page.title}</span></button>)}</div>
                  <div className="order-4 flex flex-wrap items-center justify-end gap-2 px-4 py-2"><span className="mr-auto text-[10px] text-stone-600">Slide {selectedPageIndex + 1} of {selectedTemplate.pages.length}</span><button onClick={() => movePage(-1)} disabled={selectedPageIndex === 0} className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-stone-400 hover:text-amber-100 disabled:opacity-30">Move left</button><button onClick={duplicatePage} className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-stone-400 hover:text-amber-100">Duplicate slide</button><button onClick={() => movePage(1)} disabled={selectedPageIndex === selectedTemplate.pages.length - 1} className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-stone-400 hover:text-amber-100 disabled:opacity-30">Move right</button></div>
                </div>

                {selectedPage && <div className="rounded-2xl border border-white/[0.08] bg-[#131011]/90 p-5 shadow-2xl shadow-black/10 md:p-6"><div className="mb-4 flex items-center gap-2 text-xs font-semibold text-stone-300"><Music2 className="h-4 w-4 text-amber-300" />Music on this slide</div><div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><select onChange={(event) => assignTrack(event.target.value)} value="" className={selectClasses}><option value="" disabled>Choose a saved music track…</option>{allTracks.map((track) => <option value={track.id} key={track.id}>{track.name}</option>)}</select><button onClick={() => startUpload('audio')} className="rounded-lg border border-amber-200/15 px-3 py-2.5 text-xs text-amber-100 hover:bg-amber-300/[0.05]"><Upload className="mr-1.5 inline h-4 w-4" />Upload music</button></div><div className="mt-3 space-y-2">{(selectedTemplate.audioClips || []).filter((clip) => clip.pageIndex === selectedPageIndex || clip.pageIndex === null).map((clip) => { const track = allTracks.find((item) => item.id === clip.trackId); return <div key={clip.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] px-3 py-2 text-xs text-stone-400"><span className="flex min-w-0 items-center gap-2"><AudioLines className="h-4 w-4 shrink-0 text-amber-200/80" /><span className="truncate">{track?.name || clip.trackId}</span></span><button onClick={() => updateTemplate({ audioClips: (selectedTemplate.audioClips || []).filter((item) => item.id !== clip.id) })} className="text-stone-600 hover:text-rose-300" aria-label="Remove music"><X className="h-4 w-4" /></button></div>; })}</div></div>}

                {selectedElement && <div className="rounded-2xl border border-white/[0.08] bg-[#131011]/90 p-5 shadow-2xl shadow-black/10 md:p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div><div className="flex items-center gap-2 text-xs font-semibold text-stone-200"><LayoutTemplate className="h-4 w-4 text-amber-300" />Edit selected {selectedElement.type}</div><p className="mt-1 text-[10px] text-stone-600">Same editing controls as the design studio. Changes appear on the canvas immediately.</p></div>
                    <button onClick={() => setSelectedElementId(null)} className="text-stone-600 hover:text-stone-300" aria-label="Close element settings"><X className="h-4 w-4" /></button>
                  </div>
                  <Toolbar
                    selectedElement={selectedElement}
                    selectionCount={selectedElementIds.length}
                    canGroupSelection={canGroupSelection}
                    isGroupedSelection={isGroupedSelection}
                    isMultiSelectMode={isMultiSelectMode}
                    onToggleMultiSelect={() => setIsMultiSelectMode((active) => !active)}
                    onGroupSelection={handleGroupSelection}
                    onUngroupSelection={handleUngroupSelection}
                    aspectRatio={selectedTemplate.aspectRatio}
                    onUpdateElement={(patch) => {
                      const colorOnly = Object.keys(patch).every((key) => ['color', 'gradientText'].includes(key));
                      if (colorOnly) startTransition(() => updateElement(selectedElement.id, patch));
                      else updateElement(selectedElement.id, patch);
                    }}
                    onDeleteElement={handleDeleteSelection}
                    onDuplicateElement={() => {
                      const copy = { ...structuredClone(selectedElement), id: `${selectedElement.id}-copy-${Date.now()}`, x: selectedElement.x + 16, y: selectedElement.y + 16 } as CanvasItem;
                      updatePage({ elements: [...selectedPage.elements, copy] });
                      selectOnlyElement(copy.id);
                    }}
                    onBringForward={() => updateElement(selectedElement.id, { zIndex: Number(('zIndex' in selectedElement && selectedElement.zIndex) || 1) + 1 })}
                    onSendBackward={() => updateElement(selectedElement.id, { zIndex: Math.max(1, Number(('zIndex' in selectedElement && selectedElement.zIndex) || 1) - 1) })}
                    onBringToFront={() => updateElement(selectedElement.id, { zIndex: Math.max(...selectedPage.elements.map((item) => Number(('zIndex' in item && item.zIndex) || 1)), 0) + 1 })}
                    onSendToBack={() => updateElement(selectedElement.id, { zIndex: 1 })}
                  />
                </div>}
              </div>

              <aside className="mt-3"><div className="rounded-xl border border-white/[0.08] bg-[#131011]/70 p-3"><div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-stone-300"><span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-amber-300" />Live catalog</span><span className="text-[10px] font-normal text-stone-500">Revision {savedCatalog.revision} · {templates.length} templates</span></div><p className="mt-1.5 text-[10px] leading-4 text-stone-500">Save & publish updates the catalog visitors see on the website.</p></div>
              </aside>
            </section>
          </div>}
        </main>
      </div>
      {showStudioTools && selectedTemplate && selectedPage && <div className="fixed inset-y-[72px] left-[270px] z-[60] max-lg:left-[230px] max-md:inset-y-auto max-md:bottom-16 max-md:left-0">
        <div className="absolute inset-0 bg-black/45 xl:hidden" onClick={() => setShowStudioTools(false)} />
        <div className="relative h-full w-[min(416px,calc(100vw-270px))] shadow-2xl max-lg:w-[min(416px,calc(100vw-230px))] max-md:h-[min(75vh,640px)] max-md:w-screen">
          <Sidebar
            templates={templates}
            initialActiveTab="elements"
            aspectRatio={selectedTemplate.aspectRatio}
            onSelectTemplate={(source) => {
              setSelectedTemplateId(source.id);
              setSelectedPageIndex(0);
              setSelectedElementId(null);
              setNotice(`Editing “${source.title}”. Changes stay in draft until you publish.`);
            }}
            onAddElement={(element) => { updatePage({ elements: [...selectedPage.elements, element] }); selectOnlyElement(element.id); }}
            onSetBackground={(backgroundType, backgroundValue) => updatePage({ backgroundType, backgroundValue })}
            activeBackground={selectedPage.backgroundValue}
            pages={selectedTemplate.pages}
            currentPageIndex={selectedPageIndex}
            onSelectPage={(index) => { setSelectedPageIndex(index); setSelectedElementId(null); }}
            onAddPage={addPage}
            onDeletePage={deletePage}
            onOpenVideoPreview={() => setNotice('Select the video element on the canvas to edit or preview it.')}
            onCloseSidebar={() => setShowStudioTools(false)}
            selectedElementId={selectedElementId}
            onSelectElement={handleSelectElement}
            onUpdateElement={(id, patch) => updateElement(id, patch)}
            onDeleteElementById={handleRemoveElement}
            onDuplicateElementById={(id) => {
              const source = selectedPage.elements.find((element) => element.id === id);
              if (!source) return;
              const copy = { ...structuredClone(source), id: `${source.id}-copy-${Date.now()}`, x: source.x + 16, y: source.y + 16 } as CanvasItem;
              updatePage({ elements: [...selectedPage.elements, copy] });
              selectOnlyElement(copy.id);
            }}
            availableAudioTracks={allTracks}
            activeAudioTrackId={activeAudioClip?.trackId}
            onSelectAudioTrack={(track) => assignTrack(track.id)}
            onRegisterCustomAudioTrack={(track) => setSavedCatalog((current) => ({ ...current, customAudioTracks: [...current.customAudioTracks, track] }))}
            audioClip={activeAudioClip?.settings || { startSec: 0, durationSec: selectedPage.duration || 5, volume: 0.42, fadeInSec: 0.25, fadeOutSec: 0.4, loop: false }}
            onUpdateAudioClip={(patch: Partial<AudioClipSettings>) => {
              if (!activeAudioClip || !selectedTemplate) return;
              updateTemplate({ audioClips: (selectedTemplate.audioClips || []).map((clip) => clip.id === activeAudioClip.id ? { ...clip, settings: { ...clip.settings, ...patch } } : clip) });
            }}
            onFindAndReplaceText={(find, replace) => {
              let count = 0;
              updateTemplate({ pages: selectedTemplate.pages.map((page) => ({ ...page, elements: page.elements.map((element) => {
                if (element.type !== 'text' || !find || !element.text.includes(find)) return element;
                count += element.text.split(find).length - 1;
                return { ...element, text: element.text.split(find).join(replace) };
              }) })) });
              return count;
            }}
            onMovePage={(fromIndex, toIndex) => {
              if (fromIndex === toIndex || toIndex < 0 || toIndex >= selectedTemplate.pages.length) return;
              const pages = [...selectedTemplate.pages];
              const [page] = pages.splice(fromIndex, 1);
              pages.splice(toIndex, 0, page);
              const nextIndex = new Map(pages.map((item, index) => [item.id, index]));
              const clips = (selectedTemplate.audioClips || []).map((clip) => clip.pageIndex === null ? clip : { ...clip, pageIndex: nextIndex.get(selectedTemplate.pages[clip.pageIndex]?.id) ?? clip.pageIndex });
              updateTemplate({ pages, audioClips: reflowAudioClips(pages, clips) });
              setSelectedPageIndex(toIndex);
            }}
            onSaveProject={exportBackup}
            onApplyPageLayout={(layoutId) => setNotice(`Layout “${layoutId}” selected. Review the canvas and save to publish.`)}
          />
        </div>
      </div>}
      <input ref={uploadRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void processUpload(file); }} />
      {uploadProgress !== null && <div className="fixed inset-x-0 bottom-0 h-1.5 bg-white/5"><div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300" style={{ width: `${uploadProgress}%` }} /></div>}
      {pendingDelete && selectedTemplate && <div className="fixed inset-0 z-[100] grid place-items-center bg-black/75 p-4 backdrop-blur-sm" role="presentation"><section role="alertdialog" aria-modal="true" aria-labelledby="admin-delete-title" className="w-full max-w-md rounded-2xl border border-rose-200/15 bg-[#171113] p-6 shadow-2xl shadow-black/60"><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-rose-200/75">Confirm removal</p><h2 id="admin-delete-title" className="mt-2 font-serif text-2xl text-[#fff1db]">Remove this {pendingDelete}?</h2><p className="mt-3 text-sm leading-6 text-stone-400">{pendingDelete === 'slide' ? `“${selectedPage?.title || 'Selected slide'}” will be removed from this draft.` : `“${selectedTemplate.title}” will be removed from this draft.`} Your live website will only change after you choose Save &amp; publish.</p><div className="mt-6 flex justify-end gap-3"><button onClick={() => setPendingDelete(null)} className="rounded-lg border border-white/10 px-4 py-2.5 text-xs text-stone-300 hover:border-white/20">Keep it</button><button onClick={confirmDelete} className="rounded-lg bg-rose-300 px-4 py-2.5 text-xs font-semibold text-[#220d13] hover:bg-rose-200">Remove from draft</button></div></section></div>}
    </div>
  );
};

