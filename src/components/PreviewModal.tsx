import React, { useState } from 'react';
import { X, Smartphone, Monitor, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import {
  CardPage,
  AspectRatioType,
  CANVAS_SIZES,
  ImageElement,
  ShapeElement,
  StickerElement,
  TextElement,
  QrElement,
  DrawingElement,
  TableElement,
  ChartElement,
  GridElement,
  CountdownElement,
  BarcodeElement,
} from '../types/editor';
import {
  getElementAnimationStyle,
  getImageCssFilter,
  getImageMaskStyle,
  renderShapeVisual,
  renderTextVisual,
  renderTableVisual,
  renderChartVisual,
  renderGridVisual,
  renderCountdownVisual,
  renderBarcodeVisual,
} from './Canvas';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pages: CardPage[];
  aspectRatio: AspectRatioType;
  onOpenExport: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  pages,
  aspectRatio,
  onOpenExport,
}) => {
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [deviceMode, setDeviceMode] = useState<'mobile' | 'fullscreen'>('mobile');

  if (!isOpen) return null;

  const currentPage = pages[activePageIndex] || pages[0];
  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-neutral-100">{title} - Recipient Preview</h3>
            <div className="flex items-center bg-neutral-800 rounded-lg p-0.5 border border-neutral-700">
              <button
                onClick={() => setDeviceMode('mobile')}
                className={`p-1.5 rounded transition ${
                  deviceMode === 'mobile' ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-400'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
              <button
                onClick={() => setDeviceMode('fullscreen')}
                className={`p-1.5 rounded transition ${
                  deviceMode === 'fullscreen' ? 'bg-amber-500/20 text-amber-300' : 'text-neutral-400'
                }`}
                title="Artwork View"
              >
                <Monitor className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenExport();
              }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              Download / Share
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Center Preview Stage */}
        <div className="flex-1 overflow-auto bg-neutral-950 flex items-center justify-center p-6 relative">
          <div
            className={`transition-all duration-300 relative ${
              deviceMode === 'mobile'
                ? 'p-3 bg-neutral-900 border-4 border-neutral-800 rounded-[38px] shadow-2xl ring-1 ring-neutral-700/50'
                : 'rounded-xl overflow-hidden shadow-2xl'
            }`}
          >
            {deviceMode === 'mobile' && (
              <div className="w-32 h-4 bg-neutral-800 rounded-full mx-auto mb-2 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-neutral-900 mr-2" />
                <div className="w-8 h-1.5 rounded-full bg-neutral-900" />
              </div>
            )}

            {(() => {
              const targetWidth = Math.min(360, window.innerWidth * 0.75);
              const scale = targetWidth / dimensions.width;
              const targetHeight = Math.round(dimensions.height * scale);
              return (
                <div
                  className="relative overflow-hidden rounded-xl border border-amber-500/30"
                  style={{
                    width: `${targetWidth}px`,
                    height: `${targetHeight}px`,
                    background: currentPage.backgroundValue,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div
                    style={{
                      transform: `scale(${scale})`,
                      transformOrigin: 'top left',
                      width: `${dimensions.width}px`,
                      height: `${dimensions.height}px`,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                    }}
                  >
                    {[...currentPage.elements]
                      .filter((el) => !el.hidden)
                      .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1))
                      .map((elem) => {
                        const flipTransform = `${elem.flipX ? ' scaleX(-1)' : ''}${
                          elem.flipY ? ' scaleY(-1)' : ''
                        }`;
                        return (
                          <div
                            key={`${elem.id}-${activePageIndex}`}
                            style={{
                              position: 'absolute',
                              left: `${elem.x}px`,
                              top: `${elem.y}px`,
                              width: `${elem.width}px`,
                              height: `${elem.height}px`,
                              transform: `rotate(${elem.rotation || 0}deg)${flipTransform}`,
                              opacity: elem.opacity,
                              zIndex: elem.zIndex,
                              mixBlendMode: elem.blendMode || 'normal',
                            }}
                          >
                            <div className="w-full h-full" style={getElementAnimationStyle(elem)}>
                            {elem.type === 'text' && (
                              <div className="w-full h-full flex flex-col justify-center">
                                {renderTextVisual(elem as TextElement)}
                              </div>
                            )}
                            {elem.type === 'sticker' && (
                              <div
                                className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                                style={{ color: (elem as StickerElement).color }}
                                dangerouslySetInnerHTML={{
                                  __html: (elem as StickerElement).svgContent,
                                }}
                              />
                            )}
                            {elem.type === 'shape' && renderShapeVisual(elem as ShapeElement)}
                            {elem.type === 'table' && renderTableVisual(elem as TableElement)}
                            {elem.type === 'chart' && renderChartVisual(elem as ChartElement)}
                            {elem.type === 'grid' && renderGridVisual(elem as GridElement)}
                            {elem.type === 'countdown' &&
                              renderCountdownVisual(elem as CountdownElement)}
                            {elem.type === 'barcode' && renderBarcodeVisual(elem as BarcodeElement)}
                            {elem.type === 'drawing' && (
                              <svg
                                viewBox={`0 0 ${
                                  (elem as DrawingElement).viewBoxWidth || dimensions.width
                                } ${(elem as DrawingElement).viewBoxHeight || dimensions.height}`}
                                className="w-full h-full pointer-events-none overflow-visible"
                              >
                                {(elem as DrawingElement).paths.map((p, idx) => (
                                  <path
                                    key={idx}
                                    d={p.d}
                                    fill="none"
                                    stroke={p.color}
                                    strokeWidth={p.strokeWidth}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    opacity={p.opacity}
                                  />
                                ))}
                              </svg>
                            )}
                            {elem.type === 'image' && (
                              <div
                                className="w-full h-full overflow-hidden relative"
                                style={{
                                  ...getImageMaskStyle(elem as ImageElement),
                                  borderWidth: `${(elem as ImageElement).borderWidth || 0}px`,
                                  borderColor: (elem as ImageElement).borderColor || '#D4AF37',
                                  borderStyle: 'solid',
                                  filter: getImageCssFilter(elem as ImageElement),
                                }}
                              >
                                <img
                                  src={(elem as ImageElement).src}
                                  alt="Photo"
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                  style={{
                                    transform: `scale(${
                                      (elem as ImageElement).scale || 1
                                    }) translate(${(elem as ImageElement).offsetX || 0}%, ${
                                      (elem as ImageElement).offsetY || 0
                                    }%) rotate(${(elem as ImageElement).rotationInside || 0}deg)`,
                                  }}
                                />
                              </div>
                            )}
                            {elem.type === 'qr' && (
                              <div
                                className="w-full h-full p-1.5 rounded shadow-md border border-amber-500/30 flex items-center justify-center"
                                style={{
                                  backgroundColor:
                                    (elem as QrElement).backgroundColor || '#FFF4D6',
                                }}
                              >
                                {(elem as QrElement).dataUrl ? (
                                  <img
                                    src={(elem as QrElement).dataUrl}
                                    alt="QR Code"
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-contain"
                                  />
                                ) : null}
                              </div>
                            )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Multi-page footer pagination */}
        {pages.length > 1 && (
          <div className="p-3 border-t border-neutral-800 bg-neutral-900 flex items-center justify-between text-xs text-neutral-300">
            <button
              onClick={() => setActivePageIndex(Math.max(0, activePageIndex - 1))}
              disabled={activePageIndex === 0}
              className="flex items-center gap-1 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 rounded"
            >
              <ChevronLeft className="w-4 h-4" /> Previous Card
            </button>
            <span>
              Card Page {activePageIndex + 1} of {pages.length} ({currentPage.title})
            </span>
            <button
              onClick={() => setActivePageIndex(Math.min(pages.length - 1, activePageIndex + 1))}
              disabled={activePageIndex === pages.length - 1}
              className="flex items-center gap-1 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 rounded"
            >
              Next Card <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
