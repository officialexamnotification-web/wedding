/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  CardTemplate,
  CardPage,
  CanvasItem,
  AspectRatioType,
  CANVAS_SIZES,
  ImageElement,
} from './types/editor';
import { INITIAL_TEMPLATES } from './data/templates';
import { generateQrDataUrl } from './utils/qrHelper';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas';
import { PreviewModal } from './components/PreviewModal';
import { ExportModal } from './components/ExportModal';
import { AnalysisModal } from './components/AnalysisModal';
import { AiCopyModal } from './components/AiCopyModal';
import { Homepage } from './components/Homepage';
import { PhotoAdjustModal } from './components/PhotoAdjustModal';
import { VideoCardModal } from './components/VideoCardModal';
import { SlideFilmstrip } from './components/SlideFilmstrip';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'editor'>('home');
  const [title, setTitle] = useState<string>('Royal Heritage Shubh Vivah');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('portrait-story');
  const [pages, setPages] = useState<CardPage[]>(INITIAL_TEMPLATES[0].pages);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(() => {
    if (window.innerWidth < 640) return 0.5;
    if (window.innerWidth < 1024) return 0.65;
    return 0.75;
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => window.innerWidth >= 1024);

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
      setSelectedElementId(null);
    }
  }, [historyIndex, history]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setPages(history[newIndex]);
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
    setAspectRatio(template.aspectRatio);

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
    setCurrentPageIndex(Math.max(0, currentPageIndex - 1));
  };

  // Delete specific page by index
  const handleDeletePageByIndex = (targetIndex: number) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, idx) => idx !== targetIndex);
    commitPages(newPages);
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
    setCurrentPageIndex(toIndex);
  };

  // When user clicks template from homepage
  const handleOpenFromHome = async (template: CardTemplate) => {
    await handleSelectTemplate(template);
    setCurrentView('editor');
  };

  const handleOpenBlankFromHome = () => {
    setCurrentView('editor');
  };

  const selectedElement = currentPage?.elements.find((e) => e.id === selectedElementId) || null;

  // 1. IF CURRENT VIEW IS HOMEPAGE:
  if (currentView === 'home') {
    return (
      <>
        <Homepage
          onOpenEditorWithTemplate={handleOpenFromHome}
          onOpenBlankEditor={handleOpenBlankFromHome}
          onOpenAnalysis={() => setIsAnalysisOpen(true)}
          onOpenVideoCard={(template) => {
            setVideoModalTemplate(template || INITIAL_TEMPLATES[1] || INITIAL_TEMPLATES[0]);
            setIsVideoModalOpen(true);
          }}
        />
        <AnalysisModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />
        <VideoCardModal
          isOpen={isVideoModalOpen}
          onClose={() => {
            setIsVideoModalOpen(false);
            setVideoModalTemplate(null);
          }}
          pages={
            videoModalTemplate
              ? videoModalTemplate.pages
              : (INITIAL_TEMPLATES[1] || INITIAL_TEMPLATES[0]).pages
          }
          title={
            videoModalTemplate
              ? videoModalTemplate.title
              : (INITIAL_TEMPLATES[1] || INITIAL_TEMPLATES[0]).title
          }
          aspectRatio={
            videoModalTemplate
              ? videoModalTemplate.aspectRatio
              : (INITIAL_TEMPLATES[1] || INITIAL_TEMPLATES[0]).aspectRatio
          }
          onCustomizeInEditor={async (targetSlideIndex = 0) => {
            const targetTmpl = videoModalTemplate || INITIAL_TEMPLATES[1] || INITIAL_TEMPLATES[0];
            await handleSelectTemplate(targetTmpl, targetSlideIndex);
            setCurrentView('editor');
            setIsVideoModalOpen(false);
            setVideoModalTemplate(null);
          }}
        />
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
    <div className="flex flex-col h-screen w-screen bg-neutral-950 text-neutral-100 overflow-hidden font-sans">
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
      />

      {/* Main Workspace Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Responsive Customization Studio (Desktop Left Rail + Flyout Drawer, Mobile Bottom Dock + Bottom Sheet) */}
        <Sidebar
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
        />

        {/* Center Canvas Area + Contextual Properties Toolbar + Bottom Filmstrip */}
        <div className="flex-1 flex flex-col h-full overflow-hidden pb-16 md:pb-0 relative min-w-0">
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
          />

          <Canvas
            aspectRatio={aspectRatio}
            backgroundType={currentPage?.backgroundType || 'gradient'}
            backgroundValue={currentPage?.backgroundValue || '#171717'}
            elements={currentPage?.elements || []}
            selectedElementId={selectedElementId}
            onSelectElement={setSelectedElementId}
            onUpdateElement={handleUpdateElement}
            onCommitCurrentState={handleCommitCurrentState}
            onDeleteElement={handleDeleteElement}
            onDuplicateElement={handleDuplicateElement}
            onBringForward={handleBringForward}
            onSendBackward={handleSendBackward}
            zoom={zoom}
            onZoomChange={setZoom}
            onOpenPhotoAdjust={(elem) => handleOpenPhotoAdjust(elem)}
          />

          {/* Bottom Canva-style Multi-Page / Video Slide Filmstrip */}
          <div className="hidden md:block">
            <SlideFilmstrip
              pages={pages}
              currentPageIndex={currentPageIndex}
              onSelectPage={setCurrentPageIndex}
              onAddPage={handleAddPage}
              onDuplicatePage={handleDuplicatePage}
              onDeletePage={handleDeletePageByIndex}
              onMovePage={handleMovePage}
              onOpenVideoPreview={() => setIsVideoModalOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={title}
        pages={pages}
        aspectRatio={aspectRatio}
        onOpenExport={() => setIsExportOpen(true)}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        title={title}
        pages={pages}
        currentPageIndex={currentPageIndex}
        aspectRatio={aspectRatio}
      />

      <AnalysisModal isOpen={isAnalysisOpen} onClose={() => setIsAnalysisOpen(false)} />

      <PhotoAdjustModal
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
      />

      <VideoCardModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        pages={pages}
        title={title}
        aspectRatio={aspectRatio}
        onCustomizeInEditor={(targetSlideIndex = 0) => {
          setIsVideoModalOpen(false);
          if (targetSlideIndex >= 0 && targetSlideIndex < pages.length) {
            setCurrentPageIndex(targetSlideIndex);
          }
        }}
      />

      <AiCopyModal
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
      />
    </div>
  );
}
