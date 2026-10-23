import React, { useEffect, useMemo, useRef, useState } from 'react';
import { uploadPresigned } from '@vercel/blob/client';
import {
  ArrowLeft, AudioLines, BadgeCheck, ChevronRight, Clapperboard,
  Cloud, FileImage, FilePlus2, Film, FolderOpen, Gem, ImagePlus, LayoutTemplate, LockKeyhole,
  LogOut, Music2, Plus, Save, Search, Settings2, ShieldCheck, Trash2, Upload, X,
} from 'lucide-react';
import { INITIAL_TEMPLATES } from '../data/templates';
import { AUDIO_TRACKS } from '../data/audioTracks';
import type { AudioTrack, CardPage, CardTemplate, CanvasItem, ImageElement, VideoElement } from '../types/editor';
import { CANVAS_SIZES } from '../types/editor';
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

const transitions = ['none', 'fade', 'slide', 'zoom', 'royal-curtain', 'sparkle', 'push', 'wipe', 'flip', 'blur', 'rotate', 'stack', 'chop', 'match-move', 'iris', 'vertical-wipe', 'cross-zoom', 'page-turn', 'light-sweep', 'panorama'];
const safeFileName = (name: string) => name.normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '').slice(-100) || 'media';
const makeId = () => `custom-${crypto.randomUUID()}`;
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

function previewImage(page: CardPage): string | null {
  const candidates = page.elements.filter((element) => element.type === 'image' || element.type === 'video');
  const first = candidates[0] as ImageElement | VideoElement | undefined;
  if (!first) return null;
  return first.type === 'image' ? first.src : first.posterSrc || first.mediaSrc || null;
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
  const previewSize = CANVAS_SIZES[selectedTemplate?.aspectRatio || 'portrait-story'];
  const selectedElement = selectedPage?.elements.find((item) => item.id === selectedElementId) || null;
  const allTracks = useMemo(() => [...AUDIO_TRACKS, ...savedCatalog.customAudioTracks], [savedCatalog.customAudioTracks]);
  const filteredTemplates = useMemo(() => templates.filter((template) => {
    const matchesText = `${template.title} ${template.category} ${template.tags.join(' ')}`.toLowerCase().includes(query.trim().toLowerCase());
    return matchesText && (categoryFilter === 'all' || template.category === categoryFilter);
  }), [templates, query, categoryFilter]);
  const mediaAssets = useMemo(() => {
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
  }, [templates, savedCatalog.customAudioTracks]);

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
    if (!selectedTemplate || !selectedPage) return;
    updateTemplate({ pages: selectedTemplate.pages.map((page, index) => index === selectedPageIndex
      ? { ...page, elements: page.elements.map((element) => element.id === elementId ? { ...element, ...patch } as CanvasItem : element) }
      : page) });
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
    if (!selectedTemplate || !window.confirm(`Remove “${selectedTemplate.title}” from the live template catalog?`)) return;
    const next = templates.filter((item) => item.id !== selectedTemplate.id);
    setTemplates(next);
    setSelectedTemplateId(next[0]?.id || '');
    setSelectedPageIndex(0);
    setSelectedElementId(null);
    setNotice('Template removed from the draft catalog. Save to publish this change.');
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

  const deletePage = () => {
    if (!selectedTemplate || selectedTemplate.pages.length <= 1 || !window.confirm('Delete this slide?')) return;
    const nextPages = selectedTemplate.pages.filter((_, index) => index !== selectedPageIndex);
    const nextClips = (selectedTemplate.audioClips || []).flatMap((clip) => {
      if (clip.pageIndex === null || clip.pageIndex < selectedPageIndex) return [clip];
      if (clip.pageIndex === selectedPageIndex) return [];
      return [{ ...clip, pageIndex: clip.pageIndex - 1 }];
    });
    updateTemplate({ pages: nextPages, audioClips: reflowAudioClips(nextPages, nextClips) });
    setSelectedPageIndex(Math.max(0, selectedPageIndex - 1));
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
    setSelectedElementId(id);
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
        setSelectedElementId(id);
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
        setSelectedElementId(id);
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

  return (
    <div className="flex h-screen min-h-[680px] flex-col overflow-hidden bg-[#0b090a] text-stone-100 selection:bg-amber-300/30">
      <header className="z-10 flex h-[72px] shrink-0 items-center justify-between border-b border-amber-200/10 bg-[#100d0e]/95 px-5 shadow-lg shadow-black/20 md:px-8">
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl border border-amber-200/20 bg-amber-300/[0.08] text-amber-200"><Gem className="h-5 w-5" /></div><div><p className="font-serif text-lg tracking-wide text-[#fff1db]">Nimantran <span className="text-amber-300">Admin</span></p><p className="hidden text-[10px] uppercase tracking-[.18em] text-stone-500 sm:block">Private template studio</p></div></div>
        <div className="flex items-center gap-2 sm:gap-3"><span className="hidden items-center gap-1.5 rounded-full border border-emerald-300/15 bg-emerald-300/[0.06] px-3 py-1.5 text-[11px] text-emerald-200/90 md:flex"><span className="h-1.5 w-1.5 rounded-full bg-emerald-300" /> Live catalog</span><button onClick={exportBackup} className="hidden rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-300 hover:border-amber-200/30 hover:text-amber-100 sm:block">Export backup</button><button onClick={signOut} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-300 transition hover:border-rose-200/30 hover:text-rose-200"><LogOut className="h-4 w-4" /><span className="hidden sm:inline">Sign out</span></button><button onClick={saveCatalog} disabled={busy || uploadProgress !== null} className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-amber-200 to-yellow-500 px-3.5 py-2.5 text-xs font-bold text-[#211307] transition hover:brightness-110 disabled:opacity-50 sm:px-5"><Save className="h-4 w-4" />{busy ? 'Saving…' : 'Save changes'}</button></div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="flex w-[270px] shrink-0 flex-col border-r border-white/[0.07] bg-[#100d0e] max-lg:w-[230px] max-md:w-[58px]">
          <div className="flex gap-1 border-b border-white/[0.07] p-3 max-md:flex-col">{([{ id: 'templates', label: 'Templates', icon: LayoutTemplate }, { id: 'media', label: 'Media library', icon: FolderOpen }] as const).map((item) => <button key={item.id} onClick={() => setTab(item.id)} title={item.label} className={`flex min-w-0 flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs transition max-md:aspect-square max-md:p-0 ${tab === item.id ? 'bg-amber-300/10 text-amber-200' : 'text-stone-500 hover:bg-white/[0.04] hover:text-stone-200'}`}><item.icon className="h-4 w-4 shrink-0" /><span className="max-md:hidden">{item.label}</span></button>)}</div>
          {tab === 'templates' ? <>
            <div className="space-y-2 p-3 max-md:hidden"><div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a template" className="w-full rounded-lg border border-white/[0.08] bg-black/20 py-2.5 pl-9 pr-3 text-xs outline-none focus:border-amber-300/40" /></div><select value={categoryFilter} onChange={(event) => setCategoryFilter(event.target.value)} className={`${selectClasses} py-2 text-xs`}><option value="all">All categories · {templates.length}</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}</select></div>
            <div className="flex items-center justify-between px-4 pb-2 pt-1 max-md:hidden"><span className="text-[10px] font-semibold uppercase tracking-[.18em] text-stone-600">Catalog</span><span className="text-[10px] text-stone-600">{filteredTemplates.length}</span></div>
            <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
              <button onClick={addTemplate} title="New template" className="mb-2 flex w-full items-center gap-2 rounded-lg border border-dashed border-amber-300/20 px-3 py-2.5 text-left text-xs text-amber-200 transition hover:bg-amber-300/[0.06]"><Plus className="h-4 w-4 shrink-0" /><span className="max-md:hidden">Create new template</span></button>
              {filteredTemplates.map((template) => <button key={template.id} title={template.title} onClick={() => { setSelectedTemplateId(template.id); setSelectedPageIndex(0); setSelectedElementId(null); }} className={`w-full rounded-lg px-3 py-2.5 text-left transition ${template.id === selectedTemplateId ? 'border border-amber-200/15 bg-amber-300/[0.08]' : 'border border-transparent hover:bg-white/[0.035]'}`}><span className="block truncate text-xs font-medium max-md:hidden">{template.title}</span><span className={`block truncate text-[10px] capitalize max-md:hidden ${template.id === selectedTemplateId ? 'mt-1 text-amber-200/60' : 'mt-1 text-stone-600'}`}>{template.category.replace('-', ' ')}</span><span className="hidden text-[10px] text-amber-200 md:hidden">{template.title.slice(0, 2).toUpperCase()}</span></button>)}
            </div>
          </> : <div className="space-y-3 overflow-y-auto p-3 max-md:hidden"><p className="px-1 text-[10px] font-semibold uppercase tracking-[.16em] text-stone-600">Upload to selected slide</p><button onClick={() => startUpload('image')} className="flex w-full items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2.5 text-left text-xs text-stone-300 hover:border-amber-200/20 hover:text-amber-100"><ImagePlus className="h-4 w-4 text-amber-200" /> Image / artwork</button><button onClick={() => startUpload('video')} className="flex w-full items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2.5 text-left text-xs text-stone-300 hover:border-amber-200/20 hover:text-amber-100"><Film className="h-4 w-4 text-amber-200" /> Video clip</button><button onClick={() => startUpload('audio')} className="flex w-full items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2.5 text-left text-xs text-stone-300 hover:border-amber-200/20 hover:text-amber-100"><Music2 className="h-4 w-4 text-amber-200" /> Music track</button><div className="rounded-xl border border-amber-200/10 bg-amber-200/[0.035] p-3 text-[11px] leading-5 text-stone-500">Uploaded assets are placed in Vercel Blob and linked to the selected template after saving.</div><div className="border-t border-white/[0.07] pt-3"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-stone-600">Catalog media · {mediaAssets.length}</p>{mediaAssets.map((asset) => <button key={asset.id} onClick={() => { setSelectedTemplateId(asset.templateId); setSelectedPageIndex(asset.pageIndex); setSelectedElementId(asset.elementId || null); setTab('templates'); }} className="flex w-full items-center gap-2 rounded-md border-b border-white/[0.04] py-2 text-left text-xs text-stone-400 hover:text-amber-100"><span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded bg-white/[0.04] text-amber-200/80">{asset.kind === 'image' ? <img src={asset.url} alt="" className="h-full w-full object-cover" /> : asset.kind === 'video' ? <Film className="h-3.5 w-3.5" /> : <AudioLines className="h-3.5 w-3.5" />}</span><span className="min-w-0"><span className="block truncate">{asset.label}</span><span className="mt-0.5 block text-[9px] capitalize text-stone-600">{asset.kind} · {templates.find((item) => item.id === asset.templateId)?.title}</span></span></button>)}</div><div className="border-t border-white/[0.07] pt-3"><p className="mb-2 text-[10px] font-semibold uppercase tracking-[.16em] text-stone-600">Available music tracks · {allTracks.length}</p>{allTracks.slice(-12).map((track) => <div key={track.id} className="flex items-center gap-2 border-b border-white/[0.04] py-2 text-xs text-stone-400"><AudioLines className="h-3.5 w-3.5 text-amber-200/70" /><span className="truncate">{track.name}</span></div>)}</div></div>}
            <div className="border-t border-white/[0.07] p-3 max-md:hidden"><button onClick={() => importRef.current?.click()} className="w-full rounded-lg px-2 py-2 text-left text-xs text-stone-500 hover:text-stone-200"><Upload className="mr-2 inline h-3.5 w-3.5" />Import catalog backup</button><input ref={importRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void importBackup(file); event.currentTarget.value = ''; }} /></div>
        </aside>

        <main className="min-w-0 flex-1 overflow-y-auto bg-[radial-gradient(ellipse_at_40%_0%,rgba(89,47,30,.14),transparent_50%)]">
          {!selectedTemplate ? <div className="grid h-full place-items-center p-8 text-sm text-stone-500">No templates are in the current catalog. Create one to begin.</div> : <div className="mx-auto max-w-[1080px] p-5 md:p-8">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-semibold uppercase tracking-[.2em] text-amber-300/80">Template editor</p><h1 className="mt-1 max-w-[680px] truncate font-serif text-3xl text-[#fff1db] md:text-[38px]">{selectedTemplate.title}</h1><p className="mt-2 text-xs text-stone-500">Editing catalog item · {selectedTemplate.pages.length} slides · {selectedTemplate.aspectRatio}</p></div><div className="flex items-center gap-2"><button onClick={duplicateTemplate} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-stone-300 hover:border-amber-200/25"><FilePlus2 className="mr-1.5 inline h-4 w-4" />Duplicate</button><button onClick={deleteTemplate} className="rounded-lg border border-rose-300/10 p-2 text-rose-300/70 hover:border-rose-300/35 hover:text-rose-200" title="Remove template"><Trash2 className="h-4 w-4" /></button></div></div>

            {notice && <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-amber-200/10 bg-amber-200/[0.04] px-4 py-3 text-xs leading-5 text-amber-100/80"><span className="flex items-center gap-2"><Cloud className="h-4 w-4 shrink-0 text-amber-300" />{notice}</span><button onClick={() => setNotice('')} aria-label="Dismiss"><X className="h-4 w-4 text-stone-600" /></button></div>}

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
              <div className="space-y-5">
                <div className="rounded-2xl border border-white/[0.08] bg-[#131011]/90 p-5 shadow-2xl shadow-black/10 md:p-6">
                  <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-stone-300"><Settings2 className="h-4 w-4 text-amber-300" />Template details</div>
                  <div className="grid gap-4 md:grid-cols-2"><label className="text-[11px] text-stone-500">Template name<input value={selectedTemplate.title} onChange={(event) => updateTemplate({ title: event.target.value })} className={`${inputClasses} mt-1.5`} /></label><label className="text-[11px] text-stone-500">Category<select value={selectedTemplate.category} onChange={(event) => updateTemplate({ category: event.target.value as CardTemplate['category'] })} className={`${selectClasses} mt-1.5`}>{categories.map((category) => <option value={category.id} key={category.id}>{category.label}</option>)}</select></label><label className="text-[11px] text-stone-500">Canvas size<select value={selectedTemplate.aspectRatio} onChange={(event) => changeAspectRatio(event.target.value as CardTemplate['aspectRatio'])} className={`${selectClasses} mt-1.5`}><option value="portrait-story">Portrait story · 9:16</option><option value="portrait-classic">Print · 5:7</option><option value="a4-print">A4 print</option><option value="square">Square · 1:1</option><option value="landscape">Landscape · 7:5</option><option value="whatsapp-banner">Wide video · 16:9</option></select></label><label className="text-[11px] text-stone-500">Search tags<input value={selectedTemplate.tags.join(', ')} onChange={(event) => updateTemplate({ tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) })} className={`${inputClasses} mt-1.5`} placeholder="Wedding, photo frame, maroon" /></label></div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#131011]/90 shadow-2xl shadow-black/10">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4"><div><p className="text-xs font-semibold text-stone-200">Slides & design elements</p><p className="mt-1 text-[10px] text-stone-600">Edit each slide and every element in the template.</p></div><div className="flex items-center gap-2"><button onClick={addText} className="rounded-lg border border-white/10 px-3 py-2 text-[11px] text-stone-300 hover:border-amber-200/25"><Plus className="mr-1 inline h-3.5 w-3.5" />Text</button><button onClick={() => startUpload('image')} className="rounded-lg border border-white/10 px-3 py-2 text-[11px] text-stone-300 hover:border-amber-200/25"><ImagePlus className="mr-1 inline h-3.5 w-3.5" />Image</button><button onClick={addPage} className="rounded-lg bg-amber-300/[0.08] px-3 py-2 text-[11px] text-amber-200 hover:bg-amber-300/[0.14]"><Plus className="mr-1 inline h-3.5 w-3.5" />Slide</button></div></div>
                  <div className="flex gap-2 overflow-x-auto border-b border-white/[0.07] px-4 py-3">{selectedTemplate.pages.map((page, index) => <button key={page.id} onClick={() => { setSelectedPageIndex(index); setSelectedElementId(null); }} className={`flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left text-[11px] transition ${index === selectedPageIndex ? 'border-amber-200/25 bg-amber-300/[0.07] text-amber-100' : 'border-white/[0.07] text-stone-500 hover:text-stone-200'}`}><span className="grid h-5 w-5 place-items-center rounded bg-black/20 text-[9px]">{String(index + 1).padStart(2, '0')}</span><span className="max-w-36 truncate">{page.title}</span></button>)}</div>
                  <div className="flex flex-wrap items-center justify-end gap-2 border-b border-white/[0.07] px-4 py-2"><span className="mr-auto text-[10px] text-stone-600">Slide {selectedPageIndex + 1} of {selectedTemplate.pages.length}</span><button onClick={() => movePage(-1)} disabled={selectedPageIndex === 0} className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-stone-400 hover:text-amber-100 disabled:opacity-30">Move left</button><button onClick={duplicatePage} className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-stone-400 hover:text-amber-100">Duplicate slide</button><button onClick={() => movePage(1)} disabled={selectedPageIndex === selectedTemplate.pages.length - 1} className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[10px] text-stone-400 hover:text-amber-100 disabled:opacity-30">Move right</button></div>
                  {selectedPage && <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_210px]">
                    <div className="space-y-4"><div className="grid gap-3 sm:grid-cols-2"><label className="text-[11px] text-stone-500">Slide title<input value={selectedPage.title} onChange={(event) => updatePage({ title: event.target.value })} className={`${inputClasses} mt-1.5`} /></label><label className="text-[11px] text-stone-500">Transition<select value={selectedPage.transition || 'fade'} onChange={(event) => updatePage({ transition: event.target.value as CardPage['transition'] })} className={`${selectClasses} mt-1.5`}>{transitions.map((transition) => <option key={transition} value={transition}>{transition}</option>)}</select></label><label className="text-[11px] text-stone-500">Background<select value={selectedPage.backgroundType} onChange={(event) => updatePage({ backgroundType: event.target.value as CardPage['backgroundType'] })} className={`${selectClasses} mt-1.5`}><option value="color">Solid color</option><option value="gradient">Gradient</option><option value="pattern">Pattern</option><option value="image">Image URL</option></select></label><label className="text-[11px] text-stone-500">Duration · seconds<input type="number" min="1" max="60" step="0.5" value={selectedPage.duration || 5} onChange={(event) => updatePage({ duration: Number(event.target.value) || 5 })} className={`${inputClasses} mt-1.5`} /></label></div><label className="block text-[11px] text-stone-500">Background value<input value={selectedPage.backgroundValue} onChange={(event) => updatePage({ backgroundValue: event.target.value })} className={`${inputClasses} mt-1.5`} placeholder="#1b0d11, CSS gradient or image URL" /></label>
                      <div className="rounded-xl border border-white/[0.07] bg-black/15 p-3"><div className="mb-2 flex items-center justify-between"><span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">Elements on this slide · {selectedPage.elements.length}</span><button onClick={() => startUpload('video')} className="text-[10px] text-amber-200/80 hover:text-amber-100"><Clapperboard className="mr-1 inline h-3.5 w-3.5" />Add video</button></div><div className="max-h-[300px] space-y-1 overflow-y-auto">{selectedPage.elements.map((element) => <div key={element.id} className={`flex items-center gap-2 rounded-lg border px-2.5 py-2 ${element.id === selectedElementId ? 'border-amber-200/20 bg-amber-300/[0.06]' : 'border-transparent hover:bg-white/[0.035]'}`}><button onClick={() => setSelectedElementId(element.id)} className="flex min-w-0 flex-1 items-center gap-2 text-left"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/[0.04] text-amber-200/70">{element.type === 'text' ? <span className="font-serif text-sm">T</span> : element.type === 'video' ? <Film className="h-3.5 w-3.5" /> : element.type === 'image' ? <FileImage className="h-3.5 w-3.5" /> : <LayoutTemplate className="h-3.5 w-3.5" />}</span><span className="min-w-0"><span className="block truncate text-[11px] text-stone-300">{element.type === 'text' ? (element as Extract<CanvasItem, { type: 'text' }>).text || 'Text' : element.type === 'image' ? (element as ImageElement).alt || 'Image' : element.type === 'video' ? (element as VideoElement).videoName || 'Video' : element.type}</span><span className="mt-0.5 block text-[9px] uppercase tracking-wider text-stone-600">{element.type}</span></span></button><button onClick={() => { setSelectedElementId(element.id); updatePage({ elements: selectedPage.elements.filter((item) => item.id !== element.id) }); }} aria-label="Remove element" className="p-1 text-stone-600 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button></div>)}{selectedPage.elements.length === 0 && <p className="py-5 text-center text-[11px] text-stone-600">No design elements yet. Add text, artwork or a video.</p>}</div></div>
                    </div>
                    <div className="flex flex-col items-center justify-start gap-3"><div className={`relative w-full max-w-[190px] overflow-hidden rounded-[18px] border border-amber-200/25 shadow-xl shadow-black/30 ${selectedTemplate.aspectRatio === 'square' ? 'aspect-square' : selectedTemplate.aspectRatio === 'landscape' ? 'aspect-[7/5]' : selectedTemplate.aspectRatio === 'whatsapp-banner' ? 'aspect-video' : selectedTemplate.aspectRatio === 'portrait-classic' ? 'aspect-[5/7]' : selectedTemplate.aspectRatio === 'a4-print' ? 'aspect-[520/735]' : 'aspect-[9/16]'}`} style={{ background: selectedPage.backgroundType === 'color' || selectedPage.backgroundType === 'gradient' ? selectedPage.backgroundValue : '#25161a' }}>{selectedPage.backgroundType === 'image' && <img src={selectedPage.backgroundValue} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />}{previewImage(selectedPage) && <img src={previewImage(selectedPage) || undefined} alt="Selected template slide preview" className="absolute inset-0 h-full w-full object-cover opacity-70" />}{selectedPage.elements.filter((element) => element.type === 'text').slice(0, 5).map((element) => { const text = element as Extract<CanvasItem, { type: 'text' }>; return <div key={text.id} className="absolute flex items-center justify-center overflow-hidden px-2 text-center" style={{ left: `${(text.x / previewSize.width) * 100}%`, top: `${(text.y / previewSize.height) * 100}%`, width: `${(text.width / previewSize.width) * 100}%`, height: `${(text.height / previewSize.height) * 100}%`, color: text.color, fontFamily: text.fontFamily, fontSize: `${Math.max(7, (text.fontSize / previewSize.width) * 190)}px`, lineHeight: text.lineHeight, fontWeight: text.fontWeight, fontStyle: text.fontStyle, textAlign: text.textAlign, opacity: text.opacity }}>{text.text}</div>; })}<span className="absolute inset-x-2 bottom-2 rounded-full border border-white/10 bg-black/50 px-2 py-1 text-center text-[8px] text-stone-200">Slide {selectedPageIndex + 1} preview</span></div><div className="flex w-full flex-col gap-2"><button onClick={() => startUpload('image')} className="rounded-lg border border-white/[0.08] py-2 text-[10px] text-stone-400 hover:text-amber-100"><ImagePlus className="mr-1 inline h-3.5 w-3.5" />Upload image</button><button onClick={() => startUpload('audio')} className="rounded-lg border border-white/[0.08] py-2 text-[10px] text-stone-400 hover:text-amber-100"><Music2 className="mr-1 inline h-3.5 w-3.5" />Upload music</button><button onClick={deletePage} disabled={selectedTemplate.pages.length <= 1} className="rounded-lg border border-rose-300/10 py-2 text-[10px] text-rose-200/60 hover:border-rose-300/30 disabled:opacity-30"><Trash2 className="mr-1 inline h-3.5 w-3.5" />Delete slide</button></div></div>
                  </div>}
                </div>

                {selectedPage && <div className="rounded-2xl border border-white/[0.08] bg-[#131011]/90 p-5 shadow-2xl shadow-black/10 md:p-6"><div className="mb-4 flex items-center gap-2 text-xs font-semibold text-stone-300"><Music2 className="h-4 w-4 text-amber-300" />Music on this slide</div><div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]"><select onChange={(event) => assignTrack(event.target.value)} value="" className={selectClasses}><option value="" disabled>Choose a saved music track…</option>{allTracks.map((track) => <option value={track.id} key={track.id}>{track.name}</option>)}</select><button onClick={() => startUpload('audio')} className="rounded-lg border border-amber-200/15 px-3 py-2.5 text-xs text-amber-100 hover:bg-amber-300/[0.05]"><Upload className="mr-1.5 inline h-4 w-4" />Upload music</button></div><div className="mt-3 space-y-2">{(selectedTemplate.audioClips || []).filter((clip) => clip.pageIndex === selectedPageIndex || clip.pageIndex === null).map((clip) => { const track = allTracks.find((item) => item.id === clip.trackId); return <div key={clip.id} className="flex items-center justify-between rounded-lg border border-white/[0.06] px-3 py-2 text-xs text-stone-400"><span className="flex min-w-0 items-center gap-2"><AudioLines className="h-4 w-4 shrink-0 text-amber-200/80" /><span className="truncate">{track?.name || clip.trackId}</span></span><button onClick={() => updateTemplate({ audioClips: (selectedTemplate.audioClips || []).filter((item) => item.id !== clip.id) })} className="text-stone-600 hover:text-rose-300" aria-label="Remove music"><X className="h-4 w-4" /></button></div>; })}</div></div>}

                {selectedElement && <div className="rounded-2xl border border-white/[0.08] bg-[#131011]/90 p-5 shadow-2xl shadow-black/10 md:p-6"><div className="mb-4 flex items-center justify-between"><div><div className="flex items-center gap-2 text-xs font-semibold text-stone-200"><LayoutTemplate className="h-4 w-4 text-amber-300" />Element properties</div><p className="mt-1 text-[10px] text-stone-600">{selectedElement.type} · {selectedElement.id}</p></div><button onClick={() => setSelectedElementId(null)} className="text-stone-600 hover:text-stone-300"><X className="h-4 w-4" /></button></div>{selectedElement.type === 'text' && <div className="mb-4 grid gap-3 sm:grid-cols-2"><label className="text-[10px] text-stone-500 sm:col-span-2">Text content<textarea value={selectedElement.text} onChange={(event) => updateElement(selectedElement.id, { text: event.target.value })} rows={3} className={`${inputClasses} mt-1.5 resize-y`} /></label><label className="text-[10px] text-stone-500">Font size<input type="number" min="1" max="240" value={selectedElement.fontSize} onChange={(event) => updateElement(selectedElement.id, { fontSize: Number(event.target.value) })} className={`${inputClasses} mt-1.5`} /></label><label className="text-[10px] text-stone-500">Text color<input type="color" value={/^#[0-9a-f]{6}$/i.test(selectedElement.color) ? selectedElement.color : '#f5dfb0'} onChange={(event) => updateElement(selectedElement.id, { color: event.target.value })} className={`${inputClasses} mt-1.5 h-10 p-1`} /></label></div>}{(selectedElement.type === 'image' || selectedElement.type === 'video') && <div className="mb-4 grid gap-3 sm:grid-cols-2"><label className="text-[10px] text-stone-500 sm:col-span-2">Media URL<input value={selectedElement.type === 'image' ? selectedElement.src : selectedElement.mediaSrc || ''} onChange={(event) => updateElement(selectedElement.id, selectedElement.type === 'image' ? { src: event.target.value } : { mediaSrc: event.target.value })} className={`${inputClasses} mt-1.5`} /></label>{selectedElement.type === 'image' && <label className="text-[10px] text-stone-500">Image fit<select value={selectedElement.objectFit || 'cover'} onChange={(event) => updateElement(selectedElement.id, { objectFit: event.target.value as ImageElement['objectFit'] })} className={`${selectClasses} mt-1.5`}><option value="cover">Cover</option><option value="contain">Contain</option><option value="fill">Stretch / Fill</option></select></label>}</div>}<label className="block text-[10px] text-stone-500">Full element JSON <span className="text-stone-600">(all geometry, font, frame and animation settings)</span><textarea value={jsonDraft} onChange={(event) => setJsonDraft(event.target.value)} rows={12} spellCheck={false} className="mt-1.5 w-full rounded-lg border border-white/10 bg-[#0a0809] p-3 font-mono text-[10px] leading-5 text-amber-100/80 outline-none focus:border-amber-300/45" /></label>{jsonError && <p className="mt-2 text-xs text-rose-300">{jsonError}</p>}<button onClick={applyElementJson} className="mt-3 rounded-lg border border-amber-200/15 px-3 py-2 text-[11px] text-amber-100 hover:bg-amber-300/[0.05]">Apply element settings</button></div>}
              </div>

              <aside className="space-y-5"><div className="rounded-2xl border border-white/[0.08] bg-[#131011]/90 p-5"><div className="mb-4 flex items-center gap-2 text-xs font-semibold text-stone-300"><BadgeCheck className="h-4 w-4 text-amber-300" />Publish status</div><div className="rounded-xl border border-emerald-200/10 bg-emerald-300/[0.04] p-3"><p className="text-xs font-medium text-emerald-100">Live website catalog</p><p className="mt-1 text-[10px] leading-5 text-stone-500">Saving publishes template edits, new slides and attached media to the shared catalog used by website visitors.</p></div><div className="mt-4 flex justify-between border-b border-white/[0.06] pb-3 text-[11px]"><span className="text-stone-600">Catalog revision</span><span className="text-stone-300">{savedCatalog.revision}</span></div><div className="mt-3 flex justify-between text-[11px]"><span className="text-stone-600">Visible templates</span><span className="text-stone-300">{templates.length}</span></div><button onClick={saveCatalog} disabled={busy || uploadProgress !== null} className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-200 to-yellow-500 px-4 py-3 text-xs font-bold text-[#211307] transition hover:brightness-110 disabled:opacity-50"><Save className="h-4 w-4" />{busy ? 'Saving…' : 'Save & publish'}</button></div>
                <div className="rounded-2xl border border-white/[0.08] bg-[#131011]/90 p-5"><div className="mb-3 flex items-center gap-2 text-xs font-semibold text-stone-300"><FileImage className="h-4 w-4 text-amber-300" />Artwork, video & music</div><p className="mb-4 text-[10px] leading-5 text-stone-500">Add assets to the selected slide. Uploads are limited to 250 MB each.</p><div className="space-y-2"><button onClick={() => startUpload('image')} className="flex w-full items-center justify-between rounded-lg border border-white/[0.07] px-3 py-2.5 text-xs text-stone-300 hover:border-amber-200/25"><span><ImagePlus className="mr-2 inline h-4 w-4 text-amber-200" />Upload image</span><ChevronRight className="h-3.5 w-3.5 text-stone-600" /></button><button onClick={() => startUpload('video')} className="flex w-full items-center justify-between rounded-lg border border-white/[0.07] px-3 py-2.5 text-xs text-stone-300 hover:border-amber-200/25"><span><Film className="mr-2 inline h-4 w-4 text-amber-200" />Upload video</span><ChevronRight className="h-3.5 w-3.5 text-stone-600" /></button><button onClick={() => startUpload('audio')} className="flex w-full items-center justify-between rounded-lg border border-white/[0.07] px-3 py-2.5 text-xs text-stone-300 hover:border-amber-200/25"><span><Music2 className="mr-2 inline h-4 w-4 text-amber-200" />Upload music</span><ChevronRight className="h-3.5 w-3.5 text-stone-600" /></button></div>{uploadProgress !== null && <div className="mt-4"><div className="mb-2 flex justify-between text-[10px] text-stone-500"><span>Uploading asset…</span><span>{Math.round(uploadProgress)}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]"><div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-yellow-500 transition-all" style={{ width: `${uploadProgress}%` }} /></div></div>}</div>
                <div className="rounded-2xl border border-white/[0.08] bg-[#131011]/90 p-5"><div className="mb-3 flex items-center gap-2 text-xs font-semibold text-stone-300"><ShieldCheck className="h-4 w-4 text-emerald-200" />Security</div><ul className="space-y-2 text-[10px] leading-5 text-stone-500"><li>• Admin pages do not appear in public navigation or search indexing.</li><li>• Login uses a signed, HTTP-only session cookie.</li><li>• Template catalog is stored privately; media is served from CDN.</li><li>• Set secrets in Vercel Environment Variables only.</li></ul></div>
              </aside>
            </section>
          </div>}
        </main>
      </div>
      <input ref={uploadRef} type="file" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void processUpload(file); }} />
      {uploadProgress !== null && <div className="fixed inset-x-0 bottom-0 h-1.5 bg-white/5"><div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300" style={{ width: `${uploadProgress}%` }} /></div>}
    </div>
  );
};

