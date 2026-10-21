import React, { useState } from 'react';
import { Check, ChevronRight, Flower2, Heart, Monitor, Printer, RectangleHorizontal, Smartphone, Sparkles, Square, X } from 'lucide-react';
import { AspectRatioType, CANVAS_SIZES } from '../types/editor';

export interface BlankDesignOptions {
  aspectRatio: AspectRatioType;
  backgroundColor: string;
  occasion: string;
  themeName: string;
  initialSidebarTab?: 'apps' | 'text' | 'elements';
  initialElementSubTab?: 'frames' | 'tables';
}

interface CreateDesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (options: BlankDesignOptions) => void;
}

const formats: Array<{
  id: AspectRatioType;
  label: string;
  pixels: string;
  helper: string;
  icon: React.ElementType;
}> = [
  { id: 'portrait-story', label: 'Story invitation', pixels: '1080 × 1920 px', helper: 'WhatsApp Status · Instagram Story', icon: Smartphone },
  { id: 'portrait-classic', label: 'Classic portrait', pixels: '1500 × 2100 px', helper: '5 × 7 in · Printed invitation', icon: Printer },
  { id: 'square', label: 'Square invitation', pixels: '1080 × 1080 px', helper: 'Instagram post · WhatsApp', icon: Square },
  { id: 'landscape', label: 'Landscape card', pixels: '2100 × 1500 px', helper: '7 × 5 in · Email invitation', icon: RectangleHorizontal },
  { id: 'a4-print', label: 'A4 print', pixels: '2480 × 3508 px', helper: 'Large format · Print ready', icon: Printer },
  { id: 'whatsapp-banner', label: 'Wide video', pixels: '1920 × 1080 px', helper: '16:9 · YouTube · LED screen', icon: Monitor },
];

const occasions = [
  { id: 'wedding', label: 'Shubh Vivah', icon: Flower2 },
  { id: 'housewarming', label: 'Griha Pravesh', icon: Sparkles },
  { id: 'sangeet-mehendi', label: 'Sangeet & Haldi', icon: Sparkles },
  { id: 'birthday', label: 'Birthday', icon: Heart },
  { id: 'baby-shower', label: 'Godh Bharai', icon: Heart },
  { id: 'anniversary', label: 'Anniversary', icon: Flower2 },
];

const themes = [
  { name: 'Ivory & Gold', color: '#FFF8EA', accent: '#C6A257' },
  { name: 'Crimson Royal', color: '#3B0B16', accent: '#D5B45F' },
  { name: 'Emerald Garden', color: '#0B2C20', accent: '#C5A45C' },
  { name: 'Sapphire Night', color: '#111C35', accent: '#D9B86B' },
  { name: 'Marigold', color: '#FFF2D4', accent: '#B96A18' },
  { name: 'Blush Garden', color: '#F9EDF0', accent: '#B57683' },
  { name: 'Champagne & Sage', color: '#F4F1E7', accent: '#70836A' },
  { name: 'Dusty Rose & Wine', color: '#F3E4E6', accent: '#762F43' },
  { name: 'Terracotta & Sand', color: '#F2E3D5', accent: '#A6533C' },
  { name: 'Midnight & Champagne', color: '#171B2E', accent: '#D8C49A' },
  { name: 'Peacock Teal', color: '#0D3B3B', accent: '#D2A65A' },
  { name: 'Lavender & Silver', color: '#F0ECF6', accent: '#80718F' },
  { name: 'Peach Blossom', color: '#FFF0E8', accent: '#D87962' },
  { name: 'Plum & Antique Gold', color: '#302033', accent: '#C7A66A' },
  { name: 'Dusty Blue & Champagne', color: '#E8EEF4', accent: '#667F9B' },
  { name: 'Sage & Terracotta', color: '#E9EEE5', accent: '#A6533C' },
  { name: 'Olive & Cream', color: '#EAEBDD', accent: '#697246' },
  { name: 'Black Tie Gold', color: '#171513', accent: '#D2AF61' },
];

const previewRatio: Record<AspectRatioType, string> = {
  'portrait-story': '9 / 16',
  'portrait-classic': '5 / 7',
  square: '1 / 1',
  landscape: '7 / 5',
  'a4-print': '210 / 297',
  'whatsapp-banner': '16 / 9',
};

export const CreateDesignModal: React.FC<CreateDesignModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('portrait-story');
  const [occasion, setOccasion] = useState('wedding');
  const [themeName, setThemeName] = useState(themes[0].name);
  const [backgroundColor, setBackgroundColor] = useState(themes[0].color);

  if (!isOpen) return null;

  const selectedFormat = formats.find((format) => format.id === aspectRatio) || formats[0];
  const selectedTheme = themes.find((theme) => theme.name === themeName);
  const occasionLabel = occasions.find((item) => item.id === occasion)?.label || 'Invitation';
  const canvasDimensions = CANVAS_SIZES[aspectRatio];

  const selectTheme = (theme: (typeof themes)[number]) => {
    setThemeName(theme.name);
    setBackgroundColor(theme.color);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-3 backdrop-blur-md sm:p-6" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="create-design-title" className="flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-[26px] border border-amber-400/20 bg-[#100c0d] shadow-[0_30px_120px_rgba(0,0,0,.8)]">
        <header className="flex items-center justify-between border-b border-white/10 px-5 py-4 sm:px-7">
          <div>
            <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.22em] text-amber-300/80"><Sparkles className="h-3.5 w-3.5" /> Nimantran Atelier</div>
            <h2 id="create-design-title" className="font-cinzel text-xl font-bold text-white sm:text-2xl">Create a blank invitation</h2>
            <p className="mt-1 text-xs text-neutral-400 sm:text-sm">Choose a format and a starting color. Add your own text, photos and elements in the studio.</p>
          </div>
          <button type="button" onClick={() => onCreate({ aspectRatio, backgroundColor, occasion, themeName })} aria-label="Close and open design studio" title="Close and open Design Studio" className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-neutral-300 transition hover:border-amber-300/40 hover:text-white"><X className="h-4 w-4" /></button>
        </header>

        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1fr_310px]">
          <div className="space-y-7 p-5 sm:p-7">
            <section>
              <div className="mb-3 flex items-end justify-between gap-2">
                <div><h3 className="text-sm font-bold text-white">Choose a format</h3><p className="mt-1 text-[11px] text-neutral-500">Your invitation will open at this size.</p></div>
                <span className="rounded-full border border-amber-400/20 bg-amber-400/5 px-2.5 py-1 text-[10px] font-semibold text-amber-200">6 formats</span>
              </div>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
                {formats.map((format) => {
                  const Icon = format.icon;
                  const active = aspectRatio === format.id;
                  return (
                    <button key={format.id} type="button" onClick={() => setAspectRatio(format.id)} aria-pressed={active} className={`group flex items-center gap-3 rounded-2xl border p-3 text-left transition ${active ? 'border-amber-300/70 bg-amber-300/[.09] shadow-[0_0_24px_rgba(216,169,69,.08)]' : 'border-white/[.08] bg-white/[.025] hover:border-white/20 hover:bg-white/[.05]'}`}>
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${active ? 'bg-amber-300 text-[#241605]' : 'bg-white/[.06] text-neutral-400 group-hover:text-amber-200'}`}><Icon className="h-5 w-5" /></span>
                      <span className="min-w-0 flex-1"><span className="block text-xs font-bold text-neutral-100">{format.label}</span><span className="mt-1 block text-[10px] font-medium text-amber-200/80">{format.pixels}</span><span className="mt-0.5 block truncate text-[10px] text-neutral-500">{format.helper}</span></span>
                      {active && <Check className="h-4 w-4 shrink-0 text-amber-300" />}
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-bold text-white">What are you celebrating?</h3>
              <p className="mt-1 text-[11px] text-neutral-500">Sets the project name (for example, “Untitled Shubh Vivah”). It does not add artwork or animation; your canvas stays blank.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {occasions.map((item) => {
                  const Icon = item.icon;
                  const active = occasion === item.id;
                  return <button type="button" key={item.id} onClick={() => setOccasion(item.id)} aria-pressed={active} className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] font-semibold transition ${active ? 'border-amber-300/70 bg-amber-300/10 text-amber-100' : 'border-white/10 bg-white/[.025] text-neutral-400 hover:border-white/20 hover:text-neutral-200'}`}><Icon className="h-3.5 w-3.5" />{item.label}</button>;
                })}
              </div>
            </section>

            <section>
              <div className="flex items-end justify-between gap-3">
                <div><h3 className="text-sm font-bold text-white">Pick a color direction</h3><p className="mt-1 text-[11px] text-neutral-500">Sets the blank canvas background. The small accent swatch is a preview cue; you can add matching details in the editor.</p></div>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/[.035] px-3 py-2 text-[10px] font-semibold text-neutral-300 hover:border-amber-300/40 hover:text-white"><span className="h-4 w-4 rounded-full border border-white/30" style={{ backgroundColor }} /><span>Custom color</span><input type="color" value={backgroundColor} onChange={(event) => { setBackgroundColor(event.target.value); setThemeName('Custom color'); }} className="sr-only" /></label>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {themes.map((theme) => {
                  const active = themeName === theme.name;
                  return <button key={theme.name} type="button" onClick={() => selectTheme(theme)} aria-pressed={active} className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition ${active ? 'border-amber-300/60 bg-amber-300/[.06]' : 'border-white/[.08] bg-white/[.02] hover:border-white/20'}`}><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15" style={{ backgroundColor: theme.color }}><span className="h-2 w-2 rounded-full" style={{ backgroundColor: theme.accent }} /></span><span className="truncate text-[10px] font-semibold text-neutral-200">{theme.name}</span>{active && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-amber-300" />}</button>;
                })}
              </div>
            </section>
          </div>

          <aside className="flex flex-col border-t border-white/10 bg-black/20 p-5 sm:p-7 lg:border-l lg:border-t-0">
            <div className="mb-4 flex items-center justify-between"><div><div className="text-[10px] font-semibold uppercase tracking-[.16em] text-neutral-500">Live preview</div><div className="mt-1 text-sm font-bold text-white">{selectedFormat.label}</div></div><span className="rounded-md bg-white/[.06] px-2 py-1 text-[10px] font-semibold text-neutral-300">{CANVAS_SIZES[aspectRatio].ratioLabel}</span></div>
            <div className="flex min-h-[190px] flex-1 items-center justify-center rounded-2xl border border-white/[.07] bg-[#080708] p-5">
              <div className="relative max-h-[290px] w-full max-w-[200px] border border-amber-300/25 shadow-[0_18px_48px_rgba(0,0,0,.6)] transition-all duration-300" style={{ aspectRatio: previewRatio[aspectRatio], backgroundColor, maxWidth: aspectRatio === 'whatsapp-banner' || aspectRatio === 'landscape' ? '240px' : '175px' }}>
                <div className="absolute inset-[5%] border" style={{ borderColor: `${selectedTheme?.accent || '#C6A257'}55` }} />
                <div className="absolute inset-x-[14%] top-[16%] flex justify-center"><div className="h-px w-1/3" style={{ backgroundColor: selectedTheme?.accent || '#C6A257' }} /></div>
                <div className="absolute bottom-[16%] left-1/2 flex -translate-x-1/2 items-center gap-1"><span className="h-1 w-1 rounded-full" style={{ backgroundColor: selectedTheme?.accent || '#C6A257' }} /><span className="h-px w-8" style={{ backgroundColor: selectedTheme?.accent || '#C6A257' }} /><span className="h-1 w-1 rounded-full" style={{ backgroundColor: selectedTheme?.accent || '#C6A257' }} /></div>
              </div>
            </div>
            <div className="mt-4 space-y-2 rounded-2xl border border-white/[.07] bg-white/[.025] p-3.5">
              <div className="flex items-center justify-between text-[11px]"><span className="text-neutral-500">Occasion</span><span className="font-semibold text-neutral-200">{occasionLabel}</span></div>
              <div className="flex items-center justify-between text-[11px]"><span className="text-neutral-500">Canvas</span><span className="font-semibold text-neutral-200">{canvasDimensions.width} × {canvasDimensions.height}</span></div>
              <div className="flex items-center justify-between text-[11px]"><span className="text-neutral-500">Color theme</span><span className="font-semibold text-neutral-200">{themeName}</span></div>
            </div>
            <div className="mt-3 flex items-start gap-2 text-[10px] leading-relaxed text-neutral-500"><Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300/70" />The canvas starts blank. Add editable text, photos, motifs, shapes, QR codes and more in Design Studio.</div>
          </aside>
        </div>

        <footer className="flex flex-col-reverse gap-2 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <button type="button" onClick={onClose} className="rounded-xl px-4 py-3 text-xs font-semibold text-neutral-400 transition hover:bg-white/[.05] hover:text-white">Cancel</button>
          <button type="button" onClick={() => onCreate({ aspectRatio, backgroundColor, occasion, themeName })} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 px-5 py-3 text-xs font-extrabold text-[#1e1407] shadow-lg shadow-amber-500/15 transition hover:brightness-110">Create blank design <ChevronRight className="h-4 w-4" /></button>
        </footer>
      </section>
    </div>
  );
};
