import React, { useState } from 'react';
import {
  X,
  ZoomIn,
  ZoomOut,
  Move,
  Minimize2,
  Crop,
  Check,
  Upload,
  Sparkles,
  Maximize,
  AlignCenter,
  Sun,
  RotateCcw,
} from 'lucide-react';
import {
  ImageElement,
  PhotoMask,
  ObjectFitType,
  CANVAS_SIZES,
  AspectRatioType,
  PhotoFilterPreset,
} from '../types/editor';
import { getImageCssFilter } from './Canvas';

interface PhotoAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageElement: ImageElement | null;
  onUpdateImage: (updates: Partial<ImageElement>) => void;
  aspectRatio: AspectRatioType;
}

export const PhotoAdjustModal: React.FC<PhotoAdjustModalProps> = ({
  isOpen,
  onClose,
  imageElement,
  onUpdateImage,
  aspectRatio,
}) => {
  if (!isOpen || !imageElement) return null;

  const [scale, setScale] = useState<number>(imageElement.scale || 1);
  const [offsetX, setOffsetX] = useState<number>(imageElement.offsetX || 0);
  const [offsetY, setOffsetY] = useState<number>(imageElement.offsetY || 0);
  const [rotationInside, setRotationInside] = useState<number>(imageElement.rotationInside || 0);
  const [objectFit, setObjectFit] = useState<ObjectFitType>(imageElement.objectFit || 'cover');
  const [mask, setMask] = useState<PhotoMask>(imageElement.mask || 'arch');
  const [borderWidth, setBorderWidth] = useState<number>(imageElement.borderWidth || 2);
  const [borderColor, setBorderColor] = useState<string>(imageElement.borderColor || '#D4AF37');
  const [filterPreset, setFilterPreset] = useState<PhotoFilterPreset>(
    imageElement.filterPreset || 'none'
  );
  const [brightness, setBrightness] = useState<number>(imageElement.brightness ?? 100);
  const [contrast, setContrast] = useState<number>(imageElement.contrast ?? 100);
  const [saturation, setSaturation] = useState<number>(imageElement.saturation ?? 100);

  const canvasDim = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];

  const handleApplyChanges = (newUpdates: Partial<ImageElement>) => {
    onUpdateImage(newUpdates);
  };

  // Preset: Focus Faces
  const handleFocusFaces = () => {
    const newY = 12;
    const newScale = Math.max(1.15, scale);
    setOffsetY(newY);
    setScale(newScale);
    handleApplyChanges({ offsetY: newY, scale: newScale });
  };

  // Preset: Center Reset
  const handleCenterFit = () => {
    setOffsetX(0);
    setOffsetY(0);
    setScale(1);
    setRotationInside(0);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setFilterPreset('none');
    setObjectFit('cover');
    handleApplyChanges({
      offsetX: 0,
      offsetY: 0,
      scale: 1,
      rotationInside: 0,
      brightness: 100,
      contrast: 100,
      saturation: 100,
      filterPreset: 'none',
      objectFit: 'cover',
    });
  };

  // Preset: Fit to Card Center
  const handleFitCenterCard = () => {
    const cardW = canvasDim.width;
    const newW = Math.min(cardW - 60, 260);
    const newH = Math.round(newW * 1.15);
    const newX = Math.round((cardW - newW) / 2);
    handleApplyChanges({
      x: newX,
      width: newW,
      height: newH,
    });
  };

  // Preset: Expand to Full Card Background
  const handleFitFullCard = () => {
    handleApplyChanges({
      x: 0,
      y: 0,
      width: canvasDim.width,
      height: canvasDim.height,
      mask: 'none',
      borderWidth: 0,
      zIndex: 1,
      opacity: 0.45,
      objectFit: 'cover',
    });
    setMask('none');
    setBorderWidth(0);
  };

  // Upload new photo
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleApplyChanges({ src: event.target.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const previewCssFilter = getImageCssFilter({
    ...imageElement,
    filterPreset,
    brightness,
    contrast,
    saturation,
  });

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gold-shimmer flex items-center justify-center text-neutral-950 font-bold">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-100">
                Canva Photo Studio: Crop, Filter & Frame (फ़ोटो फ़िटिंग टूल)
              </h3>
              <p className="text-[11px] text-neutral-400">
                Adjust position, zoom, brightness/contrast filters, or royal frames
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Top Preview Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-neutral-950 border border-neutral-800">
            {/* Live Visual Preview Frame */}
            <div className="relative flex items-center justify-center shrink-0 w-48 h-56 bg-neutral-900 rounded-xl border border-neutral-700 p-2 overflow-hidden">
              <div
                className={`w-full h-full overflow-hidden relative shadow-inner ${
                  mask === 'circle'
                    ? 'rounded-full'
                    : mask === 'arch'
                    ? 'rounded-t-[80px] rounded-b-lg'
                    : mask === 'rounded'
                    ? 'rounded-2xl'
                    : ''
                }`}
                style={{
                  borderWidth: `${borderWidth}px`,
                  borderColor: borderColor,
                  borderStyle: 'solid',
                  filter: previewCssFilter,
                  clipPath:
                    mask === 'heart'
                      ? 'polygon(50% 15%, 80% 0%, 100% 25%, 100% 60%, 50% 95%, 0% 60%, 0% 25%, 20% 0%)'
                      : mask === 'diamond'
                      ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                      : mask === 'octagon'
                      ? 'polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)'
                      : undefined,
                }}
              >
                <img
                  src={imageElement.src}
                  alt="Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full pointer-events-none transition-transform duration-75"
                  style={{
                    objectFit: objectFit,
                    transform: `scale(${scale}) translate(${offsetX}%, ${offsetY}%) rotate(${rotationInside}deg)`,
                  }}
                />
              </div>

              <div className="absolute inset-2 border border-amber-400/20 pointer-events-none rounded" />
            </div>

            {/* Quick 1-Click Action Buttons */}
            <div className="flex-1 space-y-2.5 w-full">
              <span className="text-xs font-semibold text-neutral-300 block">
                Quick Fit Presets (एक क्लिक में फ़िट करें):
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={handleFocusFaces}
                  className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400/60 text-neutral-200 flex items-center gap-2 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Focus Faces (चेहरा सेंटर)</span>
                </button>

                <button
                  onClick={handleCenterFit}
                  className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400/60 text-neutral-200 flex items-center gap-2 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                  <span>Reset All (रीसेट)</span>
                </button>

                <button
                  onClick={handleFitCenterCard}
                  className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400/60 text-neutral-200 flex items-center gap-2 transition"
                >
                  <AlignCenter className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Center on Card</span>
                </button>

                <button
                  onClick={handleFitFullCard}
                  className="p-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400/60 text-neutral-200 flex items-center gap-2 transition"
                >
                  <Maximize className="w-3.5 h-3.5 text-purple-400" />
                  <span>Set as Card Bg</span>
                </button>
              </div>

              <label className="w-full mt-2 py-2 px-3 bg-neutral-800 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-400/40 rounded-lg flex items-center justify-center gap-2 cursor-pointer text-xs font-medium text-amber-300 transition">
                <Upload className="w-3.5 h-3.5" />
                <span>Replace / Upload Another Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>

          {/* Controls Sliders */}
          <div className="space-y-4">
            {/* Zoom & Pan */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-300">Zoom</span>
                  <span className="font-mono text-amber-300">{Math.round(scale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.8"
                  step="0.05"
                  value={scale}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setScale(val);
                    handleApplyChanges({ scale: val });
                  }}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-300">Pan Left / Right</span>
                  <span className="font-mono text-neutral-400">{offsetX}%</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={offsetX}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setOffsetX(val);
                    handleApplyChanges({ offsetX: val });
                  }}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-neutral-300">Pan Up / Down</span>
                  <span className="font-mono text-neutral-400">{offsetY}%</span>
                </div>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={offsetY}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setOffsetY(val);
                    handleApplyChanges({ offsetY: val });
                  }}
                  className="w-full accent-amber-400"
                />
              </div>
            </div>

            {/* Color Adjustments (Brightness, Contrast, Saturation) */}
            <div className="pt-3 border-t border-neutral-800 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                <Sun className="w-3.5 h-3.5" />
                <span>Photo Color & Lighting Adjustments</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300">Brightness</span>
                    <span className="font-mono text-neutral-400">{brightness}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={brightness}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setBrightness(val);
                      handleApplyChanges({ brightness: val });
                    }}
                    className="w-full accent-amber-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300">Contrast</span>
                    <span className="font-mono text-neutral-400">{contrast}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={contrast}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setContrast(val);
                      handleApplyChanges({ contrast: val });
                    }}
                    className="w-full accent-amber-400"
                  />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-neutral-300">Saturation</span>
                    <span className="font-mono text-neutral-400">{saturation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={saturation}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      setSaturation(val);
                      handleApplyChanges({ saturation: val });
                    }}
                    className="w-full accent-amber-400"
                  />
                </div>
              </div>
            </div>

            {/* Frame Mask Shape */}
            <div className="space-y-2 pt-3 border-t border-neutral-800">
              <label className="text-xs text-neutral-300 font-medium block">
                Frame Mask Shape (फ़्रेम का आकार):
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {[
                  { id: 'arch', label: 'Royal Arch' },
                  { id: 'circle', label: 'Circle' },
                  { id: 'heart', label: 'Heart' },
                  { id: 'diamond', label: 'Diamond' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'none', label: 'Rectangle' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setMask(item.id as PhotoMask);
                      handleApplyChanges({ mask: item.id as PhotoMask });
                    }}
                    className={`py-2 px-1 text-center rounded-lg border text-[11px] font-medium transition ${
                      mask === item.id
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 font-bold'
                        : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-neutral-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gold Border Settings */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-neutral-800 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Border Thickness: {borderWidth}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={borderWidth}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setBorderWidth(val);
                    handleApplyChanges({ borderWidth: val });
                  }}
                  className="w-full accent-amber-400"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Border Tone (Royal Gold):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={borderColor}
                    onChange={(e) => {
                      setBorderColor(e.target.value);
                      handleApplyChanges({ borderColor: e.target.value });
                    }}
                    className="w-7 h-7 rounded border border-neutral-700 cursor-pointer bg-transparent"
                  />
                  <div className="flex items-center gap-1">
                    {['#D4AF37', '#FFF2C6', '#E6C665', '#FFFFFF', '#C41E3A'].map((c) => (
                      <button
                        key={c}
                        onClick={() => {
                          setBorderColor(c);
                          handleApplyChanges({ borderColor: c });
                        }}
                        className="w-4 h-4 rounded-full border border-neutral-600 hover:scale-125 transition"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <span className="text-[11px] text-neutral-400">
            Changes apply live on your invitation card canvas
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Done & Save Fit
          </button>
        </div>
      </div>
    </div>
  );
};
