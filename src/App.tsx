/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { lazy, Suspense, useState, useEffect, useCallback, useRef } from 'react';
import {
  CardTemplate,
  CardPage,
  CanvasItem,
  AspectRatioType,
  CANVAS_SIZES,
  ImageElement,
  TextElement,
  ShapeElement,
  StickerElement,
  VideoElement,
  BrandKit,
  AudioTrack,
  AudioClipSettings,
  AudioTimelineClip,
  DrawBrushSettings,
  SavedProject,
} from './types/editor';
import { INITIAL_TEMPLATES } from './data/templates';
import { generateQrDataUrl } from './utils/qrHelper';
import { ensureTextContrastOnAll } from './utils/colorContrast';
import type { SidebarTab } from './components/Sidebar';
import { AUDIO_TRACKS } from './data/audioTracks';
import { Homepage } from './components/Homepage';
import type { BlankDesignOptions } from './components/CreateDesignModal';
import { mergeTemplateCatalog, EMPTY_SAVED_CATALOG, type SavedTemplateCatalog } from './utils/templateCatalog';

const Navbar = lazy(() => import('./components/Navbar').then((module) => ({ default: module.Navbar })));
const Toolbar = lazy(() => import('./components/Toolbar').then((module) => ({ default: module.Toolbar })));
const Sidebar = lazy(() => import('./components/Sidebar').then((module) => ({ default: module.Sidebar })));
const Canvas = lazy(() => import('./components/Canvas').then((module) => ({ default: module.Canvas })));
const PreviewModal = lazy(() => import('./components/PreviewModal').then((module) => ({ default: module.PreviewModal })));
const ExportModal = lazy(() => import('./components/ExportModal').then((module) => ({ default: module.ExportModal })));
const AnalysisModal = lazy(() => import('./components/AnalysisModal').then((module) => ({ default: module.AnalysisModal })));
const WordingModal = lazy(() => import('./components/WordingModal').then((module) => ({ default: module.WordingModal })));
const PhotoAdjustModal = lazy(() => import('./components/PhotoAdjustModal').then((module) => ({ default: module.PhotoAdjustModal })));
const VideoCardModal = lazy(() => import('./components/VideoCardModal').then((module) => ({ default: module.VideoCardModal })));
const SlideFilmstrip = lazy(() => import('./components/SlideFilmstrip').then((module) => ({ default: module.SlideFilmstrip })));

const inferInvitationCategory = (label: string): CardTemplate['category'] => {
  const value = label.toLowerCase();
  if (value.includes('birthday') || value.includes('janmadin')) return 'birthday';
  if (value.includes('griha') || value.includes('housewarming') || value.includes('vastu')) return 'housewarming';
  if (value.includes('godh') || value.includes('baby shower') || value.includes('naamkaran')) return 'baby-shower';
  if (value.includes('sangeet') || value.includes('mehendi') || value.includes('haldi')) return 'sangeet-mehendi';
  if (value.includes('anniversary') || value.includes('jubilee')) return 'anniversary';
  if (value.includes('gold') || value.includes('velvet')) return 'gold-velvet';
  return 'wedding';
};

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'editor'>('home');
  const [catalogTemplates, setCatalogTemplates] = useState<CardTemplate[]>(INITIAL_TEMPLATES);
  const [pendingSidebarTab, setPendingSidebarTab] = useState<SidebarTab>('templates');
  const [pendingElementSubTab, setPendingElementSubTab] = useState<'frames' | 'tables' | undefined>();
  const [title, setTitle] = useState<string>('Royal Heritage Shubh Vivah');
  const [invitationCategory, setInvitationCategory] = useState<CardTemplate['category']>(INITIAL_TEMPLATES[0].category);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('portrait-story');
  const [pages, setPages] = useState<CardPage[]>(INITIAL_TEMPLATES[0].pages);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [canvasFitRequest, setCanvasFitRequest] = useState(0);
  const [isFitScreenMode, setIsFitScreenMode] = useState(false);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(() => {
    if (window.innerWidth < 640) return 0.5;
    if (window.innerWidth < 1024) return 0.65;
    return 0.75;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => window.innerWidth >= 1024);
  const toggleFitScreenMode = () => {
    setIsFitScreenMode((current) => !current);
    setCanvasFitRequest((request) => request + 1);
  };

  // Canva Pro Studio States
  const [showRulers, setShowRulers] = useState<boolean>(false);
  const [showSafeZones, setShowSafeZones] = useState<boolean>(true);
  const [copiedStyle, setCopiedStyle] = useState<Partial<CanvasItem> | null>(null);
  const [activeAudioTrack, setActiveAudioTrack] = useState<AudioTrack>(AUDIO_TRACKS[0]);
  const [customAudioTracks, setCustomAudioTracks] = useState<AudioTrack[]>([]);
  const [customVideoUploads, setCustomVideoUploads] = useState<VideoElement[]>([]);
  const audioTracks = [...AUDIO_TRACKS, ...customAudioTracks];
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/catalog', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((catalog: Partial<SavedTemplateCatalog> | null) => {
        if (!catalog) return;
        setCatalogTemplates(mergeTemplateCatalog(INITIAL_TEMPLATES, catalog));
        setCustomAudioTracks(Array.isArray(catalog.customAudioTracks) ? catalog.customAudioTracks : []);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, []);
  const [audioClip, setAudioClip] = useState<AudioClipSettings>({
    startSec: 0,
    durationSec: null,
    volume: 0.45,
    fadeInSec: 0,
    fadeOutSec: 0,
    loop: true,
  });
  const [audioClips, setAudioClips] = useState<AudioTimelineClip[]>([]);
  const [selectedAudioClipId, setSelectedAudioClipId] = useState<string | null>(null);
  const handleUpdateAudioClipSettings = (updates: Partial<AudioClipSettings>) => {
    const next = { ...audioClip, ...updates };
    setAudioClip(next);
    setAudioClips((clips) => clips.map((clip) => clip.id === selectedAudioClipId ? { ...clip, settings: next } : clip));
  };
  const [drawBrush, setDrawBrush] = useState<DrawBrushSettings>({
    isEnabled: false,
    brushType: 'glow-gold',
    color: '#FFD700',
    strokeWidth: 4,
    opacity: 1,
  });

  // Saved Projects in localStorage
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>(() => {
    try {
      const raw = localStorage.getItem('imantran_saved_projects');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const handleSaveProject = () => {
    const newProj: SavedProject = {
      id: `proj-${Date.now()}`,
      title: title || 'Untitled Royal Invitation',
      updatedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aspectRatio,
      pages,
      audioTrackId: activeAudioTrack.id,
      audioClip,
      audioClips,
      customAudioTracks,
      customVideoUploads,
    };
    const next = [newProj, ...savedProjects.slice(0, 14)];
    setSavedProjects(next);
    try {
      localStorage.setItem('imantran_saved_projects', JSON.stringify(next));
    } catch {
      // ignore storage quota errors
    }
  };

  const handleLoadProject = (proj: SavedProject) => {
    setTitle(proj.title);
    setInvitationCategory(inferInvitationCategory(proj.title));
    setAspectRatio(proj.aspectRatio);
    const restoredCustomTracks = proj.customAudioTracks ?? [];
    setCustomAudioTracks(restoredCustomTracks);
    setCustomVideoUploads(proj.customVideoUploads ?? []);
    const restoredTrack = proj.audioTrackId
      ? [...AUDIO_TRACKS, ...restoredCustomTracks].find((track) => track.id === proj.audioTrackId)
      : undefined;
    if (restoredTrack) setActiveAudioTrack(restoredTrack);
    if (proj.audioClip) setAudioClip(proj.audioClip);
    const restoredAudioClips = proj.audioClips ?? (proj.audioTrackId ? [{
      id: `audio-legacy-${proj.id}`,
      trackId: proj.audioTrackId,
      pageIndex: null,
      timelineStartSec: 0,
      settings: proj.audioClip || { startSec: 0, durationSec: null, volume: 0.45, fadeInSec: 0, fadeOutSec: 0, loop: true },
    }] : []);
    setAudioClips(restoredAudioClips);
    setSelectedAudioClipId(restoredAudioClips[0]?.id || null);
    setCurrentPageIndex(0);
    setSelectedElementId(null);
    commitPages(proj.pages);
  };

  const handleDeleteProject = (id: string) => {
    const next = savedProjects.filter((p) => p.id !== id);
    setSavedProjects(next);
    try {
      localStorage.setItem('imantran_saved_projects', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // Undo / Redo history
  const [history, setHistory] = useState<CardPage[][]>([INITIAL_TEMPLATES[0].pages]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const latestPagesRef = useRef<CardPage[]>(pages);
  useEffect(() => {
    latestPagesRef.current = pages;
  }, [pages]);

  // Modals
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isAnalysisOpen, setIsAnalysisOpen] = useState<boolean>(false);
  const [isAiCopyOpen, setIsAiCopyOpen] = useState<boolean>(false);
  const [isPhotoAdjustOpen, setIsPhotoAdjustOpen] = useState<boolean>(false);
  const [adjustingImage, setAdjustingImage] = useState<ImageElement | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [videoModalTemplate, setVideoModalTemplate] = useState<CardTemplate | null>(null);

  // Helper to commit new pages state and push to history
  const commitPages = useCallback(
    (newPages: CardPage[]) => {
      setPages(newPages);
      latestPagesRef.current = newPages;
      setHistory((prev) => {
        const next = prev.slice(0, historyIndex + 1);
        return [...next, newPages];
      });
      setHistoryIndex((prev) => prev + 1);
    },
    [historyIndex]
  );

  // Commit current live pages state after drag/resize/rotate finishes
  const handleCommitCurrentState = useCallback(() => {
    const snapshot = latestPagesRef.current;
    setHistory((prev) => {
      const next = prev.slice(0, historyIndex + 1);
      return [...next, snapshot];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setPages(history[newIndex]);
      latestPagesRef.current = history[newIndex];
      setSelectedElementId(null);
    }
  }, [historyIndex, history]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPages(history[newIndex]);
      latestPagesRef.current = history[newIndex];
      setSelectedElementId(null);
    }
  }, [historyIndex, history]);

  // Current page
  const currentPage = pages[currentPageIndex] || pages[0];

  // Initialize QR data URLs if missing
  useEffect(() => {
    let changed = false;
    const processPages = async () => {
      const updatedPages = await Promise.all(
        pages.map(async (page) => {
          const updatedElems = await Promise.all(
            page.elements.map(async (elem) => {
              if (elem.type === 'qr' && !elem.dataUrl) {
                changed = true;
                const dataUrl = await generateQrDataUrl(
                  elem.targetValue,
                  elem.color,
                  elem.backgroundColor
                );
                return { ...elem, dataUrl };
              }
              return elem;
            })
          );
          return { ...page, elements: updatedElems };
        })
      );

      if (changed) {
        setPages(updatedPages);
        latestPagesRef.current = updatedPages;
      }
    };

    processPages();
  }, []);

  // Keyboard shortcut listener for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput =
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) {
            handleRedo();
          } else {
            handleUndo();
          }
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        if (!isInput) {
          e.preventDefault();
          handleRedo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Handle template selection
  const handleSelectTemplate = async (template: CardTemplate, targetSlideIndex: number = 0) => {
    setTitle(template.title);
    setInvitationCategory(template.category);
    setAspectRatio(template.aspectRatio);

    const templateAudioClips = template.audioClips ?? [];
    setAudioClips(templateAudioClips);
    const firstTemplateClip = templateAudioClips[0];
    setSelectedAudioClipId(firstTemplateClip?.id ?? null);
    if (firstTemplateClip) {
      const templateTrack = audioTracks.find((track) => track.id === firstTemplateClip.trackId);
      if (templateTrack) setActiveAudioTrack(templateTrack);
      setAudioClip(firstTemplateClip.settings);
    }

    const updatedPages = await Promise.all(
      template.pages.map(async (page) => {
        const updatedElems = await Promise.all(
          page.elements.map(async (elem) => {
            if (elem.type === 'qr' && !elem.dataUrl) {
              const dataUrl = await generateQrDataUrl(
                elem.targetValue,
                elem.color,
                elem.backgroundColor
              );
              return { ...elem, dataUrl };
            }
            return elem;
          })
        );
        return { ...page, elements: updatedElems };
      })
    );

    const safeIndex = Math.max(0, Math.min(targetSlideIndex, updatedPages.length - 1));
    setCurrentPageIndex(safeIndex);
    setSelectedElementId(null);
    commitPages(updatedPages);
    setCanvasFitRequest((request) => request + 1);
  };

  // Add new element to current page
  const handleAddElement = (elem: CanvasItem) => {
    const updated = pages.map((page, idx) => {
      if (idx !== currentPageIndex) return page;
      return {
        ...page,
        elements: [...page.elements, elem],
      };
    });
    commitPages(updated);
    setSelectedElementId(elem.id);
  };

  // Update specific element on current page
  const handleUpdateElement = (
    id: string,
    updates: Partial<CanvasItem>,
    commitToHistory: boolean = false
  ) => {
    const nextPages = latestPagesRef.current.map((page, idx) => {
      if (idx !== currentPageIndex) return page;
      return {
        ...page,
        elements: page.elements.map((el) => {
          if (el.id !== id) return el;
          return { ...el, ...updates } as CanvasItem;
        }),
      };
    });

    if (commitToHistory) {
      commitPages(nextPages);
    } else {
      setPages(nextPages);
      latestPagesRef.current = nextPages;
    }
  };

  // Animate all elements on the current slide with 1 click (Canva Page Animation Combo)
  const handleAnimateAllPageElements = (anim: CanvasItem['animation'], speed: number = 1) => {
    // First reset to 'none' briefly so entrance animations replay visibly on canvas
    const cleared = latestPagesRef.current.map((page, idx) => {
      if (idx !== currentPageIndex) return page;
      return {
        ...page,
        elements: page.elements.map((el) => ({ ...el, animation: 'none' as const })),
      };
    });
    setPages(cleared);
    latestPagesRef.current = cleared;

    setTimeout(() => {
      const updated = latestPagesRef.current.map((page, idx) => {
        if (idx !== currentPageIndex) return page;
        return {
          ...page,
          elements: page.elements.map((el) => ({
            ...el,
            animation: anim,
            animationSpeed: speed,
          })),
        };
      });
      commitPages(updated);
    }, 35);
  };

  // Update specific page properties (duration, transition, notes)
  const handleUpdatePage = (pageIdx: number, updates: Partial<CardPage>) => {
    const updated = pages.map((p, idx) => (idx === pageIdx ? { ...p, ...updates } : p));
    commitPages(updated);
    if (updates.duration !== undefined) {
      setAudioClips((clips) => clips.map((clip) => {
        if (clip.pageIndex === null) return clip;
        const timelineStartSec = updated.slice(0, clip.pageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0);
        const pageEndSec = timelineStartSec + (updated[clip.pageIndex]?.duration || 4.5);
        const start = Math.max(timelineStartSec, Math.min(clip.timelineStartSec ?? timelineStartSec, pageEndSec - 0.25));
        return { ...clip, timelineStartSec: start, settings: { ...clip.settings, durationSec: clip.settings.durationSec === null ? null : Math.min(clip.settings.durationSec, pageEndSec - start) } };
      }));
    }
  };

  // Canva Copy Style (Paint Roller)
  const handleCopyStyle = () => {
    if (!selectedElement) return;
    if (selectedElement.type === 'text') {
      const t = selectedElement as TextElement;
      setCopiedStyle({
        fontFamily: t.fontFamily,
        fontSize: t.fontSize,
        color: t.color,
        gradientText: t.gradientText,
        fontWeight: t.fontWeight,
        fontStyle: t.fontStyle,
        letterSpacing: t.letterSpacing,
        textTransform: t.textTransform,
        effectType: t.effectType,
        shadow: t.shadow,
        strokeColor: t.strokeColor,
        strokeWidth: t.strokeWidth,
        backgroundColor: t.backgroundColor,
        backgroundPadding: t.backgroundPadding,
        opacity: t.opacity,
      });
    } else if (selectedElement.type === 'shape') {
      const s = selectedElement as ShapeElement;
      setCopiedStyle({
        strokeColor: s.strokeColor,
        strokeWidth: s.strokeWidth,
        fillColor: s.fillColor,
        borderStyle: s.borderStyle,
        opacity: s.opacity,
      });
    } else if (selectedElement.type === 'sticker') {
      const st = selectedElement as StickerElement;
      setCopiedStyle({
        color: st.color,
        opacity: st.opacity,
      });
    } else if (selectedElement.type === 'image') {
      const im = selectedElement as ImageElement;
      setCopiedStyle({
        filterPreset: im.filterPreset,
        brightness: im.brightness,
        contrast: im.contrast,
        saturation: im.saturation,
        borderWidth: im.borderWidth,
        borderColor: im.borderColor,
        mask: im.mask,
        opacity: im.opacity,
      });
    }
  };

  const handleApplyCopiedStyle = (targetId: string) => {
    if (!copiedStyle) return;
    handleUpdateElement(targetId, copiedStyle, true);
    setCopiedStyle(null);
  };

  // Canva Brand Kit 1-Click Restyle
  const handleApplyBrandKit = (kit: BrandKit) => {
    const bgGrad = `radial-gradient(circle at 50% 25%, ${kit.primaryColors[1]} 0%, ${kit.primaryColors[0]} 100%)`;
    const brandBackgrounds = [kit.primaryColors[0], kit.primaryColors[1]];
    const readableHeading = ensureTextContrastOnAll(kit.primaryColors[3], brandBackgrounds);
    const readableBody = ensureTextContrastOnAll(kit.primaryColors[4] || '#FFFFFF', brandBackgrounds);
    const updated = pages.map((page, idx) => {
      if (idx !== currentPageIndex) return page;
      return {
        ...page,
        backgroundType: 'gradient' as const,
        backgroundValue: bgGrad,
        elements: page.elements.map((el) => {
          if (el.type === 'text') {
            const t = el as TextElement;
            const isLarge = t.fontSize >= 24;
            return {
              ...t,
              color: isLarge ? readableHeading : readableBody,
              fontFamily: isLarge ? kit.headingFont : kit.bodyFont,
            };
          }
          if (el.type === 'shape') {
            return {
              ...(el as ShapeElement),
              strokeColor: kit.primaryColors[2],
            };
          }
          if (el.type === 'sticker') {
            return {
              ...(el as StickerElement),
              color: kit.primaryColors[2],
            };
          }
          return el;
        }),
      };
    });
    commitPages(updated);
  };

  // Canva Find & Replace Text Across All Slides
  const handleFindAndReplaceText = (findStr: string, replaceStr: string): number => {
    let matches = 0;
    const regex = new RegExp(findStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    const updated = pages.map((page) => ({
      ...page,
      elements: page.elements.map((el) => {
        if (el.type === 'text') {
          const t = el as TextElement;
          if (regex.test(t.text)) {
            matches += 1;
            return { ...t, text: t.text.replace(regex, replaceStr) };
          }
        }
        return el;
      }),
    }));
    if (matches > 0) {
      commitPages(updated);
    }
    return matches;
  };

  // Canva Magic Translate Card Text
  const handleTranslateCard = (targetLang: 'hindi' | 'english' | 'hinglish' | 'sanskrit') => {
    const dictionary: Record<string, Record<string, string>> = {
      hindi: {
        'SHUBH VIVAH': '॥ शुभ विवाह ॥',
        'SAVE THE DATE': 'मांगलिक तिथि स्मरण',
        'Together with their families': 'दोनों परिवारों के स्नेहिल आशीर्वाद सहित',
        'weds': 'संग',
        'GRAND RECEPTION': 'भव्य स्वागत समारोह',
        'SANGEET & MEHENDI': 'संगीत एवं मेहंदी उत्सव',
      },
      english: {
        '॥ शुभ विवाह ॥': 'SHUBH VIVAH',
        'मांगलिक तिथि स्मरण': 'SAVE THE DATE',
        'संग': 'weds',
        'भव्य स्वागत समारोह': 'GRAND RECEPTION',
      },
      sanskrit: {
        'SHUBH VIVAH': '॥ शुभम् पाणिग्रहण संस्कारः ॥',
        'SAVE THE DATE': 'मंगल मुहूर्त आमंत्रणम्',
        'weds': 'परिणय सूत्रे',
      },
      hinglish: {
        'SHUBH VIVAH': 'Royal Shaadi Celebration ✨',
        'SAVE THE DATE': 'Block The Dates! 🗓️',
        'weds': 'Ki Shaadi With',
      },
    };

    const mapToUse = dictionary[targetLang] || {};
    const updated = pages.map((p, idx) => {
      if (idx !== currentPageIndex) return p;
      return {
        ...p,
        elements: p.elements.map((el) => {
          if (el.type !== 'text') return el;
          const t = el as TextElement;
          let nextText = t.text;
          Object.entries(mapToUse).forEach(([k, v]) => {
            nextText = nextText.replace(new RegExp(k, 'gi'), v);
          });
          return {
            ...t,
            text: nextText,
            fontFamily:
              targetLang === 'hindi' || targetLang === 'sanskrit'
                ? "'Tiro Devanagari Hindi', serif"
                : t.fontFamily,
          };
        }),
      };
    });
    commitPages(updated);
  };

  // Canva Space Evenly / Smart Tidy Up Elements on Current Page
  const handleDistributeElements = (axis: 'horizontal' | 'vertical' | 'tidy') => {
    const dim = CANVAS_SIZES[aspectRatio];
    let changed = false;
    const updated = pages.map((p, idx) => {
      if (idx !== currentPageIndex) return p;
      const unlocked = p.elements.filter((e) => !e.locked && e.type !== 'shape');
      if (unlocked.length < 2) return p;
      const posMap = new Map<string, { x: number; y: number }>();
      if (axis === 'tidy') {
        const sorted = [...unlocked].sort((a, b) => a.y - b.y);
        const totalHeight = sorted.reduce((sum, el) => sum + el.height, 0);
        const preferredGap = 16;
        const availableHeight = Math.max(0, dim.height - 120);
        const gap = totalHeight + preferredGap * (sorted.length - 1) <= availableHeight
          ? preferredGap
          : 0;
        const startY = Math.max(20, Math.round((dim.height - (totalHeight + gap * (sorted.length - 1))) / 2));
        let cursorY = startY;
        sorted.forEach((el) => {
          posMap.set(el.id, {
            x: Math.round((dim.width - el.width) / 2),
            y: Math.round(cursorY),
          });
          cursorY += el.height + gap;
        });
      } else {
        const horizontal = axis === 'horizontal';
        const sorted = [...unlocked].sort((a, b) => horizontal ? a.x - b.x : a.y - b.y);
        const sizeOf = (el: CanvasItem) => horizontal ? el.width : el.height;
        const start = horizontal ? sorted[0].x : sorted[0].y;
        const last = sorted[sorted.length - 1];
        const end = horizontal ? last.x + last.width : last.y + last.height;
        const totalSize = sorted.reduce((sum, el) => sum + sizeOf(el), 0);
        const gap = Math.max(0, (end - start - totalSize) / (sorted.length - 1));
        let cursor = start;
        sorted.forEach((el) => {
          posMap.set(el.id, horizontal
            ? { x: Math.round(cursor), y: el.y }
            : { x: el.x, y: Math.round(cursor) });
          cursor += sizeOf(el) + gap;
        });
      }

      return {
        ...p,
        elements: p.elements.map((el) => {
          const nextPos = posMap.get(el.id);
          if (!nextPos || (nextPos.x === el.x && nextPos.y === el.y)) return el;
          changed = true;
          return { ...el, ...nextPos };
        }),
      };
    });
    if (changed) commitPages(updated);
  };

  // Canva Smart Page Layouts
  const handleApplyPageLayout = (layoutId: string) => {
    const dim = CANVAS_SIZES[aspectRatio];
    let newElements: CanvasItem[] = [];

    if (layoutId === 'royal-cover') {
      newElements = [
        {
          id: `frame-${Date.now()}`,
          type: 'shape',
          shapeType: 'gold-frame',
          x: 20,
          y: 20,
          width: dim.width - 40,
          height: dim.height - 40,
          rotation: 0,
          opacity: 0.9,
          zIndex: 1,
          strokeColor: '#D4AF37',
          strokeWidth: 2,
        },
        {
          id: `shloka-${Date.now()}`,
          type: 'text',
          text: '॥ श्री गणेशाय नमः ॥',
          fontFamily: "'Tiro Devanagari Hindi', serif",
          fontSize: 16,
          color: '#FFEAA7',
          fontWeight: 'bold',
          fontStyle: 'normal',
          textAlign: 'center',
          letterSpacing: 2,
          lineHeight: 1.2,
          x: 40,
          y: 45,
          width: dim.width - 80,
          height: 36,
          rotation: 0,
          opacity: 1,
          zIndex: 3,
        },
        {
          id: `photo-${Date.now()}`,
          type: 'image',
          src: '/images/wedding_couple_1791965341379.jpg',
          mask: 'arch',
          borderWidth: 3,
          borderColor: '#D4AF37',
          x: Math.round((dim.width - 210) / 2),
          y: 95,
          width: 210,
          height: 250,
          rotation: 0,
          opacity: 1,
          zIndex: 4,
        },
        {
          id: `couple-${Date.now()}`,
          type: 'text',
          text: 'Siddharth & Ananya',
          fontFamily: "'Alex Brush', cursive",
          fontSize: 40,
          color: '#FFF2C6',
          fontWeight: 'normal',
          fontStyle: 'normal',
          textAlign: 'center',
          letterSpacing: 1,
          lineHeight: 1.2,
          x: 30,
          y: 370,
          width: dim.width - 60,
          height: 60,
          rotation: 0,
          opacity: 1,
          zIndex: 5,
        },
        {
          id: `date-${Date.now()}`,
          type: 'text',
          text: '18 DECEMBER 2026 • UDAIPUR PALACE',
          fontFamily: "'Cinzel', serif",
          fontSize: 14,
          color: '#D4AF37',
          fontWeight: 'bold',
          fontStyle: 'normal',
          textAlign: 'center',
          letterSpacing: 3,
          lineHeight: 1.3,
          x: 30,
          y: 445,
          width: dim.width - 60,
          height: 40,
          rotation: 0,
          opacity: 1,
          zIndex: 6,
        },
      ];
    } else if (layoutId === '3-events-schedule') {
      newElements = [
        {
          id: `frame-${Date.now()}`,
          type: 'shape',
          shapeType: 'ornate-border',
          x: 20,
          y: 20,
          width: dim.width - 40,
          height: dim.height - 40,
          rotation: 0,
          opacity: 0.9,
          zIndex: 1,
          strokeColor: '#D4AF37',
          strokeWidth: 3,
        },
        {
          id: `head-${Date.now()}`,
          type: 'text',
          text: 'WEDDING CELEBRATION ITINERARY',
          fontFamily: "'Cinzel', serif",
          fontSize: 20,
          color: '#FFEAA7',
          fontWeight: 'bold',
          fontStyle: 'normal',
          textAlign: 'center',
          letterSpacing: 2.5,
          lineHeight: 1.2,
          x: 40,
          y: 60,
          width: dim.width - 80,
          height: 45,
          rotation: 0,
          opacity: 1,
          zIndex: 3,
        },
        {
          id: `tbl-${Date.now()}`,
          type: 'table',
          rows: [
            ['CEREMONY', 'TIMING', 'PALACE VENUE'],
            ['Haldi & Mehendi', '10:30 AM', 'Lotus Courtyard'],
            ['Royal Sangeet', '07:30 PM', 'Grand Ballroom'],
            ['Shubh Vivah', '11:15 PM', 'Royal Mandap'],
            ['Reception Dinner', '08:00 PM', 'Palace Lawns'],
          ],
          headerBgColor: '#630c1d',
          headerTextColor: '#FFEAA7',
          cellBgColor: 'rgba(20,5,10,0.85)',
          altRowBgColor: 'rgba(45,10,20,0.75)',
          textColor: '#FFF2C6',
          borderColor: '#D4AF37',
          borderWidth: 1,
          fontSize: 11,
          fontFamily: "'Cinzel', serif",
          borderRadius: 12,
          x: 35,
          y: 140,
          width: dim.width - 70,
          height: 220,
          rotation: 0,
          opacity: 1,
          zIndex: 5,
        },
      ];
    } else {
      return;
    }

    const updated = pages.map((p, idx) =>
      idx === currentPageIndex ? { ...p, elements: newElements } : p
    );
    commitPages(updated);
  };

  // Clear all freehand drawings on current page
  const handleClearDrawings = () => {
    const updated = pages.map((page, idx) => {
      if (idx !== currentPageIndex) return page;
      return {
        ...page,
        elements: page.elements.filter((el) => el.type !== 'drawing'),
      };
    });
    commitPages(updated);
  };

  // Delete specific element by id
  const handleDeleteElementById = (id: string) => {
    const updated = pages.map((page, idx) => {
      if (idx !== currentPageIndex) return page;
      return {
        ...page,
        elements: page.elements.filter((el) => el.id !== id),
      };
    });
    commitPages(updated);
    if (selectedElementId === id) {
      setSelectedElementId(null);
    }
  };

  // Delete selected element
  const handleDeleteElement = () => {
    if (!selectedElementId) return;
    handleDeleteElementById(selectedElementId);
  };

  // Duplicate specific element by id
  const handleDuplicateElementById = (id: string) => {
    const currentElem = currentPage.elements.find((e) => e.id === id);
    if (!currentElem) return;

    const duplicated: CanvasItem = {
      ...currentElem,
      id: `${currentElem.type}-${Date.now()}`,
      x: currentElem.x + 18,
      y: currentElem.y + 18,
      zIndex: (currentElem.zIndex || 1) + 1,
      locked: false,
    };

    handleAddElement(duplicated);
  };

  // Duplicate selected element
  const handleDuplicateElement = () => {
    if (!selectedElementId) return;
    handleDuplicateElementById(selectedElementId);
  };

  // Bring forward
  const handleBringForward = () => {
    if (!selectedElementId) return;
    handleUpdateElement(
      selectedElementId,
      {
        zIndex: (selectedElement?.zIndex || 1) + 1,
      },
      true
    );
  };

  // Send backward
  const handleSendBackward = () => {
    if (!selectedElementId) return;
    handleUpdateElement(
      selectedElementId,
      {
        zIndex: Math.max(1, (selectedElement?.zIndex || 1) - 1),
      },
      true
    );
  };

  // Bring to front
  const handleBringToFront = () => {
    if (!selectedElementId) return;
    const maxZ = Math.max(1, ...currentPage.elements.map((e) => e.zIndex || 1));
    handleUpdateElement(selectedElementId, { zIndex: maxZ + 1 }, true);
  };

  // Send to back
  const handleSendToBack = () => {
    if (!selectedElementId) return;
    handleUpdateElement(selectedElementId, { zIndex: 1 }, true);
  };

  // Set background of current page
  const handleSetBackground = (
    bgType: 'color' | 'gradient' | 'pattern' | 'image',
    bgValue: string
  ) => {
    const updated = pages.map((page, idx) => {
      if (idx !== currentPageIndex) return page;
      return {
        ...page,
        backgroundType: bgType,
        backgroundValue: bgValue,
      };
    });
    commitPages(updated);
  };

  // Add new card page
  const handleAddPage = () => {
    const newPage: CardPage = {
      id: `page-${Date.now()}`,
      title: `Function / Day ${pages.length + 1}`,
      backgroundType: currentPage.backgroundType,
      backgroundValue: currentPage.backgroundValue,
      duration: 4.5,
      transition: 'fade',
      elements: [
        {
          id: `frame-${Date.now()}`,
          type: 'shape',
          shapeType: 'gold-frame',
          x: 20,
          y: 20,
          width: CANVAS_SIZES[aspectRatio].width - 40,
          height: CANVAS_SIZES[aspectRatio].height - 40,
          rotation: 0,
          opacity: 0.85,
          zIndex: 1,
          strokeColor: '#D4AF37',
          strokeWidth: 2,
        },
        {
          id: `title-${Date.now()}`,
          type: 'text',
          text: `DAY ${pages.length + 1} CELEBRATION`,
          fontFamily: "'Cinzel', serif",
          fontSize: 22,
          color: '#FFEAA7',
          fontWeight: 'bold',
          fontStyle: 'normal',
          textAlign: 'center',
          letterSpacing: 3,
          lineHeight: 1.2,
          x: 40,
          y: 70,
          width: CANVAS_SIZES[aspectRatio].width - 80,
          height: 40,
          rotation: 0,
          opacity: 1,
          zIndex: 2,
        },
      ],
    };

    const newPages = [...pages, newPage];
    commitPages(newPages);
    setCurrentPageIndex(newPages.length - 1);
  };

  // Delete current page
  const handleDeletePage = () => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, idx) => idx !== currentPageIndex);
    commitPages(newPages);
    setAudioClips((clips) => clips.flatMap((clip) => {
      if (clip.pageIndex === null) return [clip];
      if (clip.pageIndex === currentPageIndex) return [];
      const pageIndex = clip.pageIndex > currentPageIndex ? clip.pageIndex - 1 : clip.pageIndex;
      const timelineStartSec = newPages.slice(0, pageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0);
      return [{ ...clip, pageIndex, timelineStartSec }];
    }));
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  };

  // Delete specific page by index
  const handleDeletePageByIndex = (targetIndex: number) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, idx) => idx !== targetIndex);
    commitPages(newPages);
    setAudioClips((clips) => clips.flatMap((clip) => {
      if (clip.pageIndex === null) return [clip];
      if (clip.pageIndex === targetIndex) return [];
      const pageIndex = clip.pageIndex > targetIndex ? clip.pageIndex - 1 : clip.pageIndex;
      const timelineStartSec = newPages.slice(0, pageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0);
      return [{ ...clip, pageIndex, timelineStartSec }];
    }));
    if (currentPageIndex >= newPages.length) {
      setCurrentPageIndex(newPages.length - 1);
    } else if (targetIndex < currentPageIndex) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  // Duplicate slide/page
  const handleDuplicatePage = (index: number) => {
    const pageToDup = pages[index];
    if (!pageToDup) return;
    const duplicatedPage: CardPage = {
      ...pageToDup,
      id: `slide-${Date.now()}`,
      title: `${pageToDup.title || `Slide ${index + 1}`} (Copy)`,
      elements: pageToDup.elements.map((el) => ({
        ...el,
        id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      })),
    };
    const newPages = [...pages.slice(0, index + 1), duplicatedPage, ...pages.slice(index + 1)];
    commitPages(newPages);
    setAudioClips((clips) => clips.flatMap((clip) => {
      if (clip.pageIndex === null) return [clip];
      const pageIndex = clip.pageIndex > index ? clip.pageIndex + 1 : clip.pageIndex;
      const timelineStartSec = newPages.slice(0, pageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0);
      const shifted = { ...clip, pageIndex, timelineStartSec };
      if (clip.pageIndex !== index) return [shifted];
      const duplicatePageIndex = index + 1;
      const duplicateStartSec = newPages.slice(0, duplicatePageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0);
      return [shifted, { ...clip, id: `audio-copy-${Date.now()}-${clip.id}`, pageIndex: duplicatePageIndex, timelineStartSec: duplicateStartSec }];
    }));
    setCurrentPageIndex(index + 1);
  };

  // Move / Reorder slide
  const handleMovePage = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length || fromIndex === toIndex) return;
    const item = pages[fromIndex];
    const newPages = [...pages];
    newPages.splice(fromIndex, 1);
    newPages.splice(toIndex, 0, item);
    commitPages(newPages);
    const oldIndexes = pages.map((_, index) => index);
    const [movedIndex] = oldIndexes.splice(fromIndex, 1);
    oldIndexes.splice(toIndex, 0, movedIndex);
    const newIndexByOldIndex = new Map(oldIndexes.map((oldIndex, newIndex) => [oldIndex, newIndex]));
    setAudioClips((clips) => clips.map((clip) => {
      if (clip.pageIndex === null) return clip;
      const pageIndex = newIndexByOldIndex.get(clip.pageIndex) ?? clip.pageIndex;
      const timelineStartSec = newPages.slice(0, pageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0);
      return { ...clip, pageIndex, timelineStartSec };
    }));
    setCurrentPageIndex(toIndex);
  };

  // When user clicks template from homepage
  const handleOpenFromHome = async (template: CardTemplate, targetSlideIndex: number = 0) => {
    await handleSelectTemplate(template, targetSlideIndex);
    setCurrentView('editor');
  };

  const handleOpenBlankFromHome = ({ aspectRatio, backgroundColor, occasion, themeName, initialSidebarTab, initialElementSubTab }: BlankDesignOptions) => {
    const occasionNames: Record<string, string> = {
      wedding: 'Shubh Vivah',
      housewarming: 'Griha Pravesh',
      'sangeet-mehendi': 'Sangeet & Haldi',
      birthday: 'Birthday',
      'baby-shower': 'Godh Bharai',
      anniversary: 'Anniversary',
    };
    const pageTitle = `${CANVAS_SIZES[aspectRatio].name} · ${themeName}`;
    const blankPages: CardPage[] = [{
      id: `blank-design-${Date.now()}`,
      title: pageTitle,
      backgroundType: 'color',
      backgroundValue: backgroundColor,
      elements: [],
    }];
    setTitle(`Untitled ${occasionNames[occasion] || 'Invitation'}`);
    setInvitationCategory(occasion as CardTemplate['category']);
    setAspectRatio(aspectRatio);
    setCurrentPageIndex(0);
    setSelectedElementId(null);
    setPages(blankPages);
    latestPagesRef.current = blankPages;
    setHistory([blankPages]);
    setHistoryIndex(0);
    setCanvasFitRequest((request) => request + 1);
    setPendingSidebarTab(initialSidebarTab || 'templates');
    setPendingElementSubTab(initialElementSubTab);
    setCurrentView('editor');
  };

  const selectedElement = currentPage?.elements.find((e) => e.id === selectedElementId) || null;

  // 1. IF CURRENT VIEW IS HOMEPAGE:
  if (currentView === 'home') {
    return (
      <>
        <Homepage
          templates={catalogTemplates}
          onOpenEditorWithTemplate={handleOpenFromHome}
          onOpenBlankEditor={handleOpenBlankFromHome}
          onOpenPrintExport={async (template) => {
            await handleSelectTemplate(template);
            setCurrentView('editor');
            setIsExportOpen(true);
          }}
          onOpenAnalysis={() => setIsAnalysisOpen(true)}
          onOpenVideoCard={(template) => {
            setVideoModalTemplate(template || catalogTemplates[1] || catalogTemplates[0]);
            setIsVideoModalOpen(true);
          }}
        />
        <Suspense fallback={null}>
        {isAnalysisOpen && <AnalysisModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />}
        {isVideoModalOpen && <VideoCardModal
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false);
            setVideoModalTemplate(null);
          }}
          pages={
            videoModalTemplate
              ? videoModalTemplate.pages
              : (catalogTemplates[1] || catalogTemplates[0]).pages
          }
          title={
            videoModalTemplate
              ? videoModalTemplate.title
              : (catalogTemplates[1] || catalogTemplates[0]).title
          }
          aspectRatio={
            videoModalTemplate
              ? videoModalTemplate.aspectRatio
              : (catalogTemplates[1] || catalogTemplates[0]).aspectRatio
          }
          activeAudioTrack={
            videoModalTemplate?.audioClips?.[0]
              ? AUDIO_TRACKS.find((track) => track.id === videoModalTemplate.audioClips?.[0].trackId) || activeAudioTrack
              : activeAudioTrack
          }
          audioClip={videoModalTemplate?.audioClips?.[0]?.settings || audioClip}
          audioClips={videoModalTemplate?.audioClips ?? audioClips}
          onShareVideo={async () => {
            const targetTmpl = videoModalTemplate || catalogTemplates[1] || catalogTemplates[0];
            await handleSelectTemplate(targetTmpl);
            setCurrentView('editor');
            setIsVideoModalOpen(false);
            setIsExportOpen(true);
          }}
          onCustomizeInEditor={async (targetSlideIndex = 0) => {
            const targetTmpl = videoModalTemplate || catalogTemplates[1] || catalogTemplates[0];
            await handleSelectTemplate(targetTmpl, targetSlideIndex);
            setCurrentView('editor');
            setIsVideoModalOpen(false);
            setVideoModalTemplate(null);
          }}
        />}
        </Suspense>
      </>
    );
  }

  // 2. IF CURRENT VIEW IS TEMPLATE EDITOR:
  const handleOpenPhotoAdjust = (imageElem?: ImageElement) => {
    const target =
      imageElem ||
      (selectedElement?.type === 'image' ? (selectedElement as ImageElement) : null);
    if (target) {
      setAdjustingImage(target);
      setIsPhotoAdjustOpen(true);
    }
  };

  return (
    <Suspense fallback={<div className="flex h-dvh w-full items-center justify-center bg-neutral-950 text-neutral-300">Loading invitation studio…</div>}>
    <div className="flex h-dvh min-h-0 w-full flex-col overflow-hidden bg-neutral-950 font-sans text-neutral-100">
      {/* Top Studio Navbar */}
      <Navbar
        title={title}
        onTitleChange={setTitle}
        aspectRatio={aspectRatio}
        onAspectRatioChange={setAspectRatio}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
        zoom={zoom}
        onZoomChange={setZoom}
        onOpenPreview={() => setIsPreviewOpen(true)}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenAnalysis={() => setIsAnalysisOpen(true)}
        onOpenAiCopy={() => setIsAiCopyOpen(true)}
        onBackToHome={() => setCurrentView('home')}
        onOpenVideoCard={() => setIsVideoModalOpen(true)}
        pageCount={pages.length}
        currentPageIndex={currentPageIndex}
        onSelectPage={setCurrentPageIndex}
        onAddPage={handleAddPage}
        onDeletePage={handleDeletePage}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        showRulers={showRulers}
        onToggleRulers={() => setShowRulers((r) => !r)}
        showSafeZones={showSafeZones}
        onToggleSafeZones={() => setShowSafeZones((s) => !s)}
        onSaveProject={handleSaveProject}
        onTranslateCard={handleTranslateCard}
      />

      {/* Main Workspace Body */}
      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {/* Responsive Customization Studio (Desktop 12-Tab Left Rail + Flyout Drawer, Mobile Bottom Dock + Sheet) */}
        <Sidebar
          templates={catalogTemplates}
          initialActiveTab={pendingSidebarTab}
          initialElementSubTab={pendingElementSubTab}
          aspectRatio={aspectRatio}
          onSelectTemplate={handleSelectTemplate}
          onAddElement={handleAddElement}
          onSetBackground={handleSetBackground}
          activeBackground={currentPage?.backgroundValue || ''}
          onCloseSidebar={() => setIsSidebarOpen(false)}
          pages={pages}
          currentPageIndex={currentPageIndex}
          onSelectPage={setCurrentPageIndex}
          onAddPage={handleAddPage}
          onDuplicatePage={handleDuplicatePage}
          onDeletePage={handleDeletePageByIndex}
          onMovePage={handleMovePage}
          onOpenVideoPreview={() => setIsVideoModalOpen(true)}
          onOpenAiCopy={() => setIsAiCopyOpen(true)}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onDeleteElementById={handleDeleteElementById}
          onDuplicateElementById={handleDuplicateElementById}
          drawBrush={drawBrush}
          onUpdateDrawBrush={(updates) => setDrawBrush((prev) => ({ ...prev, ...updates }))}
          onClearDrawings={handleClearDrawings}
          onApplyBrandKit={handleApplyBrandKit}
          activeAudioTrackId={activeAudioTrack.id}
          availableAudioTracks={audioTracks}
          audioScopeDuration={(() => {
            const selectedClip = audioClips.find((clip) => clip.id === selectedAudioClipId);
            if (selectedClip?.pageIndex === null) return pages.reduce((sum, page) => sum + (page.duration || 4.5), 0);
            if (selectedClip?.pageIndex !== undefined) return pages[selectedClip.pageIndex]?.duration || 4.5;
            return pages[currentPageIndex]?.duration || 4.5;
          })()}
          onSelectAudioTrack={(track) => {
            setActiveAudioTrack(track);
            const id = `audio-${Date.now()}-${currentPageIndex}`;
            const settings = { ...audioClip, startSec: 0, sourceEndSec: null, durationSec: null };
            const timelineStartSec = pages.slice(0, currentPageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0);
            setAudioClip(settings);
            setAudioClips((clips) => {
              const allSlidesClip = clips.find((clip) => clip.pageIndex === null);
              const existing = clips.filter((clip) => clip.pageIndex !== null && clip.pageIndex !== currentPageIndex);
              const inherited = allSlidesClip
                ? pages.map((_, pageIndex) => pageIndex === currentPageIndex ? null : ({ id: `audio-${allSlidesClip.id}-${pageIndex}`, trackId: allSlidesClip.trackId, pageIndex, settings: allSlidesClip.settings })).filter((clip): clip is AudioTimelineClip => clip !== null)
                : [];
              return [...existing, ...inherited, { id, trackId: track.id, pageIndex: currentPageIndex, timelineStartSec, settings }];
            });
            setSelectedAudioClipId(id);
          }}
          onRegisterCustomAudioTrack={(track) => setCustomAudioTracks((tracks) => [...tracks.filter((item) => item.id !== track.id), track])}
          availableVideoUploads={customVideoUploads}
          onRegisterCustomVideoUpload={(video) => setCustomVideoUploads((videos) => [video, ...videos.filter((item) => item.id !== video.id)])}
          audioClip={audioClip}
          onUpdateAudioClip={handleUpdateAudioClipSettings}
          savedProjects={savedProjects}
          onSaveProject={handleSaveProject}
          onLoadProject={handleLoadProject}
          onDeleteProject={handleDeleteProject}
          onFindAndReplaceText={handleFindAndReplaceText}
          onTranslateCard={handleTranslateCard}
          onApplyPageLayout={handleApplyPageLayout}
          showRulers={showRulers}
          onToggleRulers={() => setShowRulers((r) => !r)}
          showSafeZones={showSafeZones}
          onToggleSafeZones={() => setShowSafeZones((s) => !s)}
        />

        {/* Center Canvas Area + Contextual Properties Toolbar + Bottom Filmstrip */}
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
          <Toolbar
            selectedElement={selectedElement}
            aspectRatio={aspectRatio}
            onUpdateElement={(updates, commitToHistory) => {
              if (selectedElementId) {
                handleUpdateElement(selectedElementId, updates, commitToHistory);
              }
            }}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
            onOpenPhotoAdjust={() => handleOpenPhotoAdjust()}
            copiedStyle={copiedStyle}
            onCopyStyle={handleCopyStyle}
            drawBrush={drawBrush}
            onExitDrawMode={() => setDrawBrush((prev) => ({ ...prev, isEnabled: false }))}
            onDistributeElements={handleDistributeElements}
            onAnimateAllPageElements={handleAnimateAllPageElements}
          />

          <Canvas
            aspectRatio={aspectRatio}
            fitRequest={canvasFitRequest}
            fitScreenMode={isFitScreenMode}
            onToggleFitScreenMode={toggleFitScreenMode}
            backgroundType={currentPage?.backgroundType || 'gradient'}
            backgroundValue={currentPage?.backgroundValue || '#171717'}
            elements={currentPage?.elements || []}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
            onAddElement={handleAddElement}
            onCommitCurrentState={handleCommitCurrentState}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            onBringToFront={handleBringToFront}
            onSendToBack={handleSendToBack}
            zoom={zoom}
            onZoomChange={setZoom}
            onOpenPhotoAdjust={(elem) => handleOpenPhotoAdjust(elem)}
            drawBrush={drawBrush}
            copiedStyle={copiedStyle}
            onApplyCopiedStyle={handleApplyCopiedStyle}
            onCopyStyle={handleCopyStyle}
            showRulers={showRulers}
            showSafeZones={showSafeZones}
          />

          {pages.length > 1 && !isFitScreenMode && (
            <div
              className="md:hidden absolute bottom-[calc(4rem+env(safe-area-inset-bottom)+0.65rem)] left-[calc(50%-1.5rem)] z-30 flex -translate-x-1/2 items-center gap-1 rounded-full border border-amber-300/25 bg-neutral-950/95 px-1 py-1 text-amber-100 shadow-xl shadow-black/40 backdrop-blur"
              aria-label="Invitation slide navigation"
            >
              <button
                type="button"
                onClick={() => setCurrentPageIndex((index) => Math.max(0, index - 1))}
                disabled={currentPageIndex === 0}
                aria-label="Previous slide"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-base transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-35"
              >
                ‹
              </button>
              <span className="min-w-[4rem] whitespace-nowrap text-center text-[11px] font-semibold tabular-nums" aria-live="polite">
                Slide {currentPageIndex + 1}/{pages.length}
              </span>
              <button
                type="button"
                onClick={() => setCurrentPageIndex((index) => Math.min(pages.length - 1, index + 1))}
                disabled={currentPageIndex === pages.length - 1}
                aria-label="Next slide"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-base transition hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-35"
              >
                ›
              </button>
            </div>
          )}

          {/* Bottom Canva-style Multi-Page / Video Slide Filmstrip */}
          {!isFitScreenMode && <div className="hidden md:block shrink-0 max-h-[72vh] overflow-y-auto overscroll-contain scrollbar-thin scrollbar-thumb-neutral-700">
            <SlideFilmstrip
              pages={pages}
              currentPageIndex={currentPageIndex}
              onSelectPage={setCurrentPageIndex}
              onAddPage={handleAddPage}
              onDuplicatePage={handleDuplicatePage}
              onDeletePage={handleDeletePageByIndex}
              onMovePage={handleMovePage}
              onUpdatePage={handleUpdatePage}
              onOpenVideoPreview={() => setIsVideoModalOpen(true)}
              activeAudioTrack={activeAudioTrack}
              audioClip={audioClip}
              audioClips={audioClips}
              audioTracks={audioTracks}
              selectedAudioClipId={selectedAudioClipId}
              onSelectAudioClip={(clip) => {
                setSelectedAudioClipId(clip.id);
                setAudioClip(clip.settings);
                const track = audioTracks.find((item) => item.id === clip.trackId);
                if (track) setActiveAudioTrack(track);
                if (clip.pageIndex !== null) setCurrentPageIndex(clip.pageIndex);
              }}
              onUpdateAudioClip={handleUpdateAudioClipSettings}
              onApplyAudioToAll={(selectedClip) => {
                const trackId = selectedClip.trackId;
                const id = `audio-all-${Date.now()}`;
                const settings = { ...selectedClip.settings, startSec: 0, sourceEndSec: null, durationSec: null };
                setAudioClips([{ id, trackId, pageIndex: null, timelineStartSec: 0, settings }]);
                setSelectedAudioClipId(id);
                setAudioClip(settings);
              }}
              onRemoveAudioClip={(clipId) => {
                setAudioClips((clips) => clips.filter((clip) => clip.id !== clipId));
                setSelectedAudioClipId((selected) => selected === clipId ? null : selected);
              }}
              onSplitAudioClip={(clipId, splitAt) => {
                const clip = audioClips.find((item) => item.id === clipId);
                if (!clip) return;
                const clipStart = clip.timelineStartSec ?? (clip.pageIndex === null ? 0 : pages.slice(0, clip.pageIndex).reduce((sum, page) => sum + (page.duration || 4.5), 0));
                const scopeEnd = clip.pageIndex === null ? pages.reduce((sum, page) => sum + (page.duration || 4.5), 0) : pages.slice(0, clip.pageIndex + 1).reduce((sum, page) => sum + (page.duration || 4.5), 0);
                const clipEnd = Math.min(clipStart + (clip.settings.durationSec ?? (scopeEnd - clipStart)), scopeEnd);
                if (!Number.isFinite(splitAt) || splitAt <= clipStart + 0.15 || splitAt >= clipEnd - 0.15) return;
                const firstLength = splitAt - clipStart;
                const secondLength = clipEnd - splitAt;
                const secondHalf: AudioTimelineClip = { ...clip, id: `audio-split-${Date.now()}`, timelineStartSec: splitAt, settings: { ...clip.settings, startSec: clip.settings.startSec + firstLength, durationSec: secondLength } };
                const firstHalf = { ...clip, timelineStartSec: clipStart, settings: { ...clip.settings, durationSec: firstLength } };
                setAudioClips((clips) => [...clips.filter((item) => item.id !== clipId), firstHalf, secondHalf]);
                setSelectedAudioClipId(secondHalf.id);
                setAudioClip(secondHalf.settings);
              }}
              onTrimAudioClip={(clipId, next) => {
                setAudioClips((clips) => clips.map((clip) => clip.id === clipId ? { ...clip, ...next } : clip));
                if (clipId === selectedAudioClipId && next.settings) setAudioClip(next.settings);
              }}
            />
          </div>}
        </div>
      </div>

      {/* Modals */}
      {isPreviewOpen && <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        pages={pages}
        aspectRatio={aspectRatio}
        onOpenExport={() => setIsExportOpen(true)}
      />}

      {isExportOpen && <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title={title}
        pages={pages}
        currentPageIndex={currentPageIndex}
        aspectRatio={aspectRatio}
        activeAudioTrack={activeAudioTrack}
        audioClip={audioClip}
        audioClips={audioClips}
        audioTracks={audioTracks}
        occasionCategory={invitationCategory}
      />}

      {isAnalysisOpen && <AnalysisModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />}

      {isPhotoAdjustOpen && <PhotoAdjustModal
        isOpen={isPhotoAdjustOpen}
        onClose={() => {
          setIsPhotoAdjustOpen(false);
          setAdjustingImage(null);
        }}
        imageElement={adjustingImage}
        onUpdateImage={(updates) => {
          if (adjustingImage) {
            handleUpdateElement(adjustingImage.id, updates, true);
            setAdjustingImage((prev) => (prev ? { ...prev, ...updates } : null));
          }
        }}
        aspectRatio={aspectRatio}
      />}

      {isVideoModalOpen && <VideoCardModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        pages={pages}
        title={title}
        aspectRatio={aspectRatio}
        activeAudioTrack={activeAudioTrack}
        audioClip={audioClip}
        audioClips={audioClips}
        onShareVideo={() => {
          setIsVideoModalOpen(false);
          setIsExportOpen(true);
        }}
        onCustomizeInEditor={(targetSlideIndex = 0) => {
          setIsVideoModalOpen(false);
          if (targetSlideIndex >= 0 && targetSlideIndex < pages.length) {
            setCurrentPageIndex(targetSlideIndex);
          }
        }}
      />}

      {isAiCopyOpen && <WordingModal
        isOpen={isAiCopyOpen}
        onClose={() => setIsAiCopyOpen(false)}
        onInsertText={(text, font, size) => {
          const newElem: CanvasItem = {
            id: `text-${Date.now()}`,
            type: 'text',
            text,
            fontFamily: font,
            fontSize: size,
            color: '#FFEAA7',
            fontWeight: 'normal',
            fontStyle: 'normal',
            textAlign: 'center',
            letterSpacing: 1.5,
            lineHeight: 1.4,
            x: 45,
            y: 200,
            width: CANVAS_SIZES[aspectRatio].width - 90,
            height: 90,
            rotation: 0,
            opacity: 1,
            zIndex: 10,
          };
          handleAddElement(newElem);
        }}
      />}
    </div>
    </Suspense>
  );
}
