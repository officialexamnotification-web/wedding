import React, { useState } from 'react';
import {
  X,
  Download,
  Share2,
  FileText,
  Image as ImageIcon,
  Check,
  Copy,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  CardPage,
  AspectRatioType,
  CANVAS_SIZES,
  TextElement,
  ImageElement,
  StickerElement,
  QrElement,
  ShapeElement,
} from '../types/editor';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pages: CardPage[];
  currentPageIndex?: number;
  aspectRatio: AspectRatioType;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  pages,
  currentPageIndex = 0,
  aspectRatio,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [selectedExportPage, setSelectedExportPage] = useState<number>(currentPageIndex);
  const [copied, setCopied] = useState(false);
  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];

  if (!isOpen) return null;

  const sampleMessage = `✨ *You Are Cordially Invited!* ✨\n\n${title}\n\nJoin us in celebrating this joyous milestone with our loved ones.\n\n📅 Please find the complete invitation details on our digital card.\n📍 Venue & Google Maps Navigation included.\n\nWarm Regards & Blessings!`;

  // Render any CardPage accurately into high-res offscreen HTML5 Canvas
  const generateCanvasImage = async (
    page: CardPage,
    format: 'png' | 'jpeg' = 'png'
  ): Promise<string> => {
    const scale = 2; // 2x high resolution for retina / print
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width * scale;
    canvas.height = dimensions.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.scale(scale, scale);

    // 1. Draw Background
    if (
      page.backgroundType === 'image' ||
      page.backgroundValue.startsWith('http') ||
      page.backgroundValue.startsWith('/') ||
      page.backgroundValue.startsWith('data:image')
    ) {
      try {
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = page.backgroundValue;
        await new Promise((res) => {
          bgImg.onload = res;
          bgImg.onerror = res;
        });
        ctx.drawImage(bgImg, 0, 0, dimensions.width, dimensions.height);
      } catch {
        ctx.fillStyle = '#1c0308';
        ctx.fillRect(0, 0, dimensions.width, dimensions.height);
      }
    } else if (
      page.backgroundValue.startsWith('radial-gradient') ||
      page.backgroundValue.startsWith('linear-gradient')
    ) {
      const grad = ctx.createLinearGradient(0, 0, 0, dimensions.height);
      if (page.backgroundValue.includes('#0d3826') || page.backgroundValue.includes('emerald')) {
        grad.addColorStop(0, '#0d3826');
        grad.addColorStop(1, '#02120b');
      } else if (
        page.backgroundValue.includes('#630c1d') ||
        page.backgroundValue.includes('#5e0b1d') ||
        page.backgroundValue.includes('burgundy')
      ) {
        grad.addColorStop(0, '#630c1d');
        grad.addColorStop(1, '#1f0107');
      } else if (
        page.backgroundValue.includes('#132742') ||
        page.backgroundValue.includes('sapphire')
      ) {
        grad.addColorStop(0, '#132742');
        grad.addColorStop(1, '#040912');
      } else if (page.backgroundValue.includes('#fffdf8') || page.backgroundValue.includes('#fbf6ec')) {
        grad.addColorStop(0, '#fffdf8');
        grad.addColorStop(1, '#f4ebd7');
      } else if (page.backgroundValue.includes('#fed876')) {
        grad.addColorStop(0, '#fff7d6');
        grad.addColorStop(1, '#fca311');
      } else {
        grad.addColorStop(0, '#3d0510');
        grad.addColorStop(1, '#110307');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    } else {
      ctx.fillStyle = page.backgroundValue || '#171717';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }

    // 2. Draw Elements sorted by zIndex
    const sorted = [...page.elements]
      .filter((e) => !e.hidden)
      .sort((a, b) => (a.zIndex || 1) - (b.zIndex || 1));

    for (const elem of sorted) {
      ctx.save();
      ctx.globalAlpha = elem.opacity ?? 1;

      // Apply center rotation & flip transforms
      const cx = elem.x + elem.width / 2;
      const cy = elem.y + elem.height / 2;
      ctx.translate(cx, cy);
      if (elem.rotation) {
        ctx.rotate((elem.rotation * Math.PI) / 180);
      }
      if (elem.flipX || elem.flipY) {
        ctx.scale(elem.flipX ? -1 : 1, elem.flipY ? -1 : 1);
      }
      ctx.translate(-cx, -cy);

      // TEXT ELEMENT
      if (elem.type === 'text') {
        const t = elem as TextElement;
        if (t.backgroundColor) {
          ctx.fillStyle = t.backgroundColor;
          ctx.fillRect(t.x, t.y, t.width, t.height);
        }
        const fontName = t.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
        ctx.font = `${t.fontWeight === 'bold' ? 'bold ' : ''}${
          t.fontStyle === 'italic' ? 'italic ' : ''
        }${t.fontSize}px "${fontName}", serif`;
        ctx.fillStyle = t.color || '#FFF';
        ctx.textAlign = (t.textAlign as CanvasTextAlign) || 'center';

        if (t.shadow) {
          ctx.shadowColor = t.shadow.color || '#000';
          ctx.shadowBlur = t.shadow.blur || 6;
          ctx.shadowOffsetX = t.shadow.offsetX || 0;
          ctx.shadowOffsetY = t.shadow.offsetY || 2;
        }

        const rawText =
          t.textTransform === 'uppercase'
            ? (t.text || '').toUpperCase()
            : t.textTransform === 'lowercase'
            ? (t.text || '').toLowerCase()
            : t.text || '';

        const lines = rawText.split('\n');
        const lineHeight = t.fontSize * (t.lineHeight || 1.3);
        const totalTextH = lines.length * lineHeight;
        const startY = t.y + (t.height - totalTextH) / 2 + t.fontSize * 0.85;
        const xPos =
          t.textAlign === 'center'
            ? t.x + t.width / 2
            : t.textAlign === 'right'
            ? t.x + t.width
            : t.x;

        lines.forEach((line: string, i: number) => {
          const yPos = startY + i * lineHeight;
          if (t.strokeWidth && t.strokeWidth > 0) {
            ctx.strokeStyle = t.strokeColor || '#000';
            ctx.lineWidth = t.strokeWidth;
            ctx.strokeText(line, xPos, yPos);
          }
          ctx.fillText(line, xPos, yPos);
        });
      }

      // SHAPE ELEMENT
      else if (elem.type === 'shape') {
        const s = elem as ShapeElement;
        ctx.strokeStyle = s.strokeColor || '#D4AF37';
        ctx.lineWidth = s.strokeWidth || 2;
        if (s.fillColor && s.fillColor !== 'transparent') {
          ctx.fillStyle = s.fillColor;
          ctx.fillRect(s.x, s.y, s.width, s.height);
        }
        if (s.shapeType === 'divider-line') {
          ctx.beginPath();
          ctx.moveTo(s.x, s.y + s.height / 2);
          ctx.lineTo(s.x + s.width, s.y + s.height / 2);
          ctx.stroke();
        } else if (s.shapeType === 'circle' || s.shapeType === 'royal-badge') {
          ctx.beginPath();
          ctx.ellipse(
            s.x + s.width / 2,
            s.y + s.height / 2,
            s.width / 2,
            s.height / 2,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
        } else {
          ctx.strokeRect(s.x, s.y, s.width, s.height);
          if (s.shapeType === 'gold-frame' || s.shapeType === 'ornate-border') {
            ctx.strokeRect(s.x + 5, s.y + 5, s.width - 10, s.height - 10);
          }
        }
      }

      // STICKER ELEMENT (Render inline SVG to Image)
      else if (elem.type === 'sticker') {
        const st = elem as StickerElement;
        try {
          const coloredSvg = st.svgContent.replace(/currentColor/g, st.color || '#D4AF37');
          const svgBlob = new Blob([coloredSvg], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.src = url;
          await new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
          ctx.drawImage(img, st.x, st.y, st.width, st.height);
          URL.revokeObjectURL(url);
        } catch (e) {
          console.warn('Sticker draw err', e);
        }
      }

      // QR ELEMENT
      else if (elem.type === 'qr' && (elem as QrElement).dataUrl) {
        const qr = elem as QrElement;
        try {
          ctx.fillStyle = qr.backgroundColor || '#FFF4D6';
          ctx.fillRect(qr.x, qr.y, qr.width, qr.height);
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = qr.dataUrl;
          await new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
          ctx.drawImage(img, qr.x + 4, qr.y + 4, qr.width - 8, qr.height - 8);
        } catch (e) {
          console.warn('QR draw err', e);
        }
      }

      // IMAGE ELEMENT
      else if (elem.type === 'image' && (elem as ImageElement).src) {
        const im = elem as ImageElement;
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = im.src;
          await new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
          ctx.drawImage(img, im.x, im.y, im.width, im.height);
          if (im.borderWidth && im.borderWidth > 0) {
            ctx.strokeStyle = im.borderColor || '#D4AF37';
            ctx.lineWidth = im.borderWidth;
            ctx.strokeRect(im.x, im.y, im.width, im.height);
          }
        } catch (e) {
          console.warn('Image draw err', e);
        }
      }

      ctx.restore();
    }

    return canvas.toDataURL(format === 'png' ? 'image/png' : 'image/jpeg', 0.95);
  };

  // Handle Single Page Download
  const handleDownloadImage = async (format: 'png' | 'jpeg') => {
    setDownloading(true);
    try {
      const targetPage = pages[selectedExportPage] || pages[0];
      const dataUrl = await generateCanvasImage(targetPage, format);
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `${
          title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'invitation-card'
        }-page-${selectedExportPage + 1}.${format === 'png' ? 'png' : 'jpg'}`;
        link.href = dataUrl;
        link.click();

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#FFEAA7', '#FFD700', '#C41E3A'],
        });
      }
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setDownloading(false);
    }
  };

  // Handle Multi-Page PDF Print
  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const allDataUrls: string[] = [];
      for (const page of pages) {
        const url = await generateCanvasImage(page, 'png');
        if (url) allDataUrls.push(url);
      }

      const win = window.open('', '_blank');
      if (win) {
        win.document.write(`
          <html>
            <head>
              <title>${title} - All ${pages.length} Pages Print</title>
              <style>
                @page { size: auto; margin: 0mm; }
                body { margin: 0; background: #111; display: flex; flex-direction: column; align-items: center; gap: 16px; }
                .page { page-break-after: always; display: flex; align-items: center; justify-content: center; width: 100vw; height: 100vh; }
                img { max-width: 100%; max-height: 100vh; object-fit: contain; }
              </style>
            </head>
            <body>
              ${allDataUrls
                .map((u) => `<div class="page"><img src="${u}" /></div>`)
                .join('')}
              <script>window.onload = () => setTimeout(() => window.print(), 400);</script>
            </body>
          </html>
        `);
        win.document.close();
      }
    } catch (err) {
      console.error('PDF generation failed', err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(sampleMessage)}`;
    window.open(url, '_blank');
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(sampleMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in select-none">
      <div className="bg-neutral-900 border border-neutral-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gold-shimmer flex items-center justify-center text-neutral-950">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-100">Export & Share Invitation</h3>
              <p className="text-[11px] text-neutral-400">
                High-Resolution 2x Retina Downloads & Multi-Page PDF
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-neutral-400 hover:text-neutral-100 rounded-lg hover:bg-neutral-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Page Selector if multiple pages exist */}
          {pages.length > 1 && (
            <div className="flex items-center justify-between bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800 text-xs">
              <span className="text-neutral-300 font-medium">Select Page to Download:</span>
              <select
                value={selectedExportPage}
                onChange={(e) => setSelectedExportPage(parseInt(e.target.value))}
                className="bg-neutral-800 text-amber-300 font-semibold px-2.5 py-1 rounded-lg border border-neutral-700 outline-none"
              >
                {pages.map((p, idx) => (
                  <option key={p.id || idx} value={idx}>
                    Page {idx + 1}: {p.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Download Options */}
          <div className="grid grid-cols-2 gap-3">
            {/* PNG */}
            <button
              onClick={() => handleDownloadImage('png')}
              disabled={downloading}
              className="p-4 rounded-xl bg-neutral-800/80 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-500/50 text-left transition group flex flex-col justify-between h-28"
            >
              <div className="flex items-center justify-between">
                <ImageIcon className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono text-amber-300 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                  HD 300 DPI
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-100">
                  {downloading ? 'Rendering...' : 'Download PNG'}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Crystal-clear image for printing & web
                </div>
              </div>
            </button>

            {/* JPG */}
            <button
              onClick={() => handleDownloadImage('jpeg')}
              disabled={downloading}
              className="p-4 rounded-xl bg-neutral-800/80 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-500/50 text-left transition group flex flex-col justify-between h-28"
            >
              <div className="flex items-center justify-between">
                <ImageIcon className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-mono text-emerald-300 bg-emerald-400/10 px-1.5 py-0.5 rounded border border-emerald-400/20">
                  Fast & Light
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-100">
                  {downloading ? 'Rendering...' : 'Download JPG'}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Ideal for mobile & WhatsApp chats
                </div>
              </div>
            </button>
          </div>

          {/* PDF Print Option */}
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="w-full p-3.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-750 border border-neutral-700 hover:border-amber-500/50 flex items-center justify-between transition group"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <div className="text-sm font-semibold text-neutral-100">
                  Print / Export All {pages.length} Pages as PDF
                </div>
                <div className="text-[11px] text-neutral-400">
                  Full card deck ready for PDF save or print shop
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-amber-400" />
          </button>

          {/* WhatsApp Direct Share Section */}
          <div className="pt-2 border-t border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-neutral-200 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                Instant WhatsApp Share
              </span>
              <button
                onClick={handleCopyMessage}
                className="text-[11px] text-neutral-400 hover:text-amber-300 flex items-center gap-1 transition"
              >
                {copied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
                {copied ? 'Copied!' : 'Copy Text'}
              </button>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs text-neutral-300 font-mono whitespace-pre-line max-h-24 overflow-y-auto">
              {sampleMessage}
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="w-full mt-3 py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-neutral-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Open in WhatsApp & Share to Contacts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
