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
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import {
  CardPage,
  AspectRatioType,
  CANVAS_SIZES,
  TextElement,
  ImageElement,
  StickerElement,
  QrElement,
  ShapeElement,
  DrawingElement,
  TableElement,
  ChartElement,
  GridElement,
  CountdownElement,
  BarcodeElement,
  FrameElement,
  FormElement,
  SheetElement,
  MockupElement,
  Model3DElement,
  VideoElement,
  AudioElement,
} from '../types/editor';
import { evaluateSheetCell } from './Canvas';

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
  const [exportScale, setExportScale] = useState<number>(2); // 1x, 2x Retina, 3x Ultra Print
  const [copied, setCopied] = useState(false);
  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];

  if (!isOpen) return null;

  const sampleMessage = `✨ *You Are Cordially Invited!* ✨\n\n${title}\n\nJoin us in celebrating this joyous milestone with our loved ones.\n\n📅 Please find the complete invitation details on our digital card.\n📍 Venue & Google Maps Navigation included.\n\nWarm Regards & Blessings!`;

  // Render any CardPage accurately into high-res offscreen HTML5 Canvas
  const generateCanvasImage = async (
    page: CardPage,
    format: 'png' | 'jpeg' = 'png',
    scaleFactor: number = exportScale
  ): Promise<string> => {
    const scale = scaleFactor;
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
      } else if (
        page.backgroundValue.includes('#fffdf8') ||
        page.backgroundValue.includes('#fbf6ec')
      ) {
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
        ctx.fillStyle = t.effectType === 'hollow' ? 'transparent' : t.color || '#FFF';
        ctx.textAlign =
          t.textAlign === 'justify' ? 'center' : (t.textAlign as CanvasTextAlign) || 'center';

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
          t.textAlign === 'center' || t.textAlign === 'justify'
            ? t.x + t.width / 2
            : t.textAlign === 'right'
            ? t.x + t.width
            : t.x;

        lines.forEach((line: string, i: number) => {
          const yPos = startY + i * lineHeight;
          if ((t.strokeWidth && t.strokeWidth > 0) || t.effectType === 'hollow') {
            ctx.strokeStyle = t.strokeColor || t.color || '#000';
            ctx.lineWidth = t.strokeWidth || 1.5;
            ctx.strokeText(line, xPos, yPos);
          }
          if (t.effectType !== 'hollow') {
            ctx.fillText(line, xPos, yPos);
          }
        });
      }

      // SHAPE ELEMENT
      else if (elem.type === 'shape') {
        const s = elem as ShapeElement;
        if (s.svgPath && s.svgPath.includes("<svg")) {
          try {
            const coloredSvg = s.svgPath.replace(
              /currentColor/g,
              s.fillColor && s.fillColor !== "transparent" ? s.fillColor : s.strokeColor || "#D4AF37"
            );
            const svgBlob = new Blob([coloredSvg], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);
            const img = new Image();
            img.src = url;
            await new Promise((res) => {
              img.onload = res;
              img.onerror = res;
            });
            ctx.drawImage(img, s.x, s.y, s.width, s.height);
            URL.revokeObjectURL(url);
          } catch {
            // fallback
          }
        } else
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
        } else if (
          s.shapeType === 'circle' ||
          s.shapeType === 'royal-badge' ||
          s.shapeType === 'scallop-badge' ||
          s.shapeType === 'mandala-ring'
        ) {
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
        if (s.innerText) {
          ctx.fillStyle = s.innerTextColor || '#FFF2C6';
          ctx.font = `bold ${s.innerFontSize || 13}px Cinzel, serif`;
          ctx.textAlign = 'center';
          ctx.fillText(s.innerText, s.x + s.width / 2, s.y + s.height / 2 + 4);
        }
      }

      // DRAWING ELEMENT
      else if (elem.type === 'drawing') {
        const dr = elem as DrawingElement;
        try {
          const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${
            dr.viewBoxWidth || dimensions.width
          } ${dr.viewBoxHeight || dimensions.height}">${dr.paths
            .map(
              (p) =>
                `<path d="${p.d}" fill="none" stroke="${p.color}" stroke-width="${p.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" opacity="${p.opacity}" />`
            )
            .join('')}</svg>`;
          const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(svgBlob);
          const img = new Image();
          img.src = url;
          await new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
          ctx.drawImage(img, dr.x, dr.y, dr.width, dr.height);
          URL.revokeObjectURL(url);
        } catch (e) {
          console.warn('Drawing render err', e);
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

      // TABLE ELEMENT
      else if (elem.type === 'table') {
        const tb = elem as TableElement;
        const rowCount = Math.max(1, tb.rows.length);
        const colCount = Math.max(1, tb.rows[0]?.length || 3);
        const rowH = tb.height / rowCount;
        const colW = tb.width / colCount;
        tb.rows.forEach((row, rIdx) => {
          ctx.fillStyle =
            rIdx === 0
              ? tb.headerBgColor || '#630c1d'
              : rIdx % 2 === 1
              ? tb.cellBgColor || 'rgba(20,5,10,0.85)'
              : tb.altRowBgColor || 'rgba(45,10,20,0.75)';
          ctx.fillRect(tb.x, tb.y + rIdx * rowH, tb.width, rowH);
          ctx.fillStyle = rIdx === 0 ? tb.headerTextColor || '#FFEAA7' : tb.textColor || '#FFF2C6';
          ctx.font = `${rIdx === 0 ? 'bold ' : ''}${tb.fontSize || 11}px Cinzel, serif`;
          ctx.textAlign = 'center';
          row.forEach((cell, cIdx) => {
            ctx.fillText(
              cell,
              tb.x + cIdx * colW + colW / 2,
              tb.y + rIdx * rowH + rowH / 2 + 4
            );
          });
        });
        ctx.strokeStyle = tb.borderColor || '#D4AF37';
        ctx.lineWidth = tb.borderWidth || 1;
        ctx.strokeRect(tb.x, tb.y, tb.width, tb.height);
      }

      // CHART ELEMENT
      else if (elem.type === 'chart') {
        const ch = elem as ChartElement;
        ctx.fillStyle = ch.backgroundColor || 'rgba(20, 5, 10, 0.85)';
        ctx.fillRect(ch.x, ch.y, ch.width, ch.height);
        ctx.strokeStyle = ch.borderColor || '#D4AF37';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(ch.x, ch.y, ch.width, ch.height);
        ctx.fillStyle = ch.textColor || '#FFEAA7';
        ctx.font = 'bold 11px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.fillText(ch.title, ch.x + ch.width / 2, ch.y + 18);

        const maxVal = Math.max(1, ...ch.data.map((d) => d.value));
        const barAreaY = ch.y + 28;
        const barAreaH = ch.height - 46;
        const slotW = (ch.width - 20) / Math.max(1, ch.data.length);
        ch.data.forEach((dp, idx) => {
          const barH = Math.max(8, (dp.value / maxVal) * barAreaH);
          const bx = ch.x + 10 + idx * slotW + slotW * 0.15;
          const bw = slotW * 0.7;
          const by = barAreaY + (barAreaH - barH);
          ctx.fillStyle = dp.color || '#D4AF37';
          ctx.fillRect(bx, by, bw, barH);
          ctx.fillStyle = ch.textColor || '#FFEAA7';
          ctx.font = '9px sans-serif';
          ctx.fillText(dp.label.slice(0, 8), bx + bw / 2, ch.y + ch.height - 6);
        });
      }

      // COUNTDOWN ELEMENT
      else if (elem.type === 'countdown') {
        const cd = elem as CountdownElement;
        ctx.fillStyle = cd.backgroundColor || 'rgba(20, 5, 10, 0.88)';
        ctx.fillRect(cd.x, cd.y, cd.width, cd.height);
        ctx.strokeStyle = cd.borderColor || '#D4AF37';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cd.x, cd.y, cd.width, cd.height);
        ctx.fillStyle = cd.primaryColor || '#D4AF37';
        ctx.font = 'bold 10px Cinzel, serif';
        ctx.textAlign = 'center';
        ctx.fillText(cd.eventLabel, cd.x + cd.width / 2, cd.y + 18);

        const diff = Math.max(0, new Date(cd.targetDate).getTime() - Date.now());
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);
        const secs = Math.floor((diff / 1000) % 60);
        const units = [
          { v: days, l: 'DAYS' },
          { v: hours, l: 'HRS' },
          { v: mins, l: 'MIN' },
          { v: secs, l: 'SEC' },
        ];
        const uw = (cd.width - 16) / 4;
        units.forEach((u, i) => {
          const ux = cd.x + 8 + i * uw + uw / 2;
          ctx.fillStyle = cd.primaryColor || '#FFEAA7';
          ctx.font = 'bold 16px Cinzel, serif';
          ctx.fillText(String(u.v).padStart(2, '0'), ux, cd.y + cd.height / 2 + 8);
          ctx.fillStyle = cd.primaryColor || '#D4AF37';
          ctx.font = '8px sans-serif';
          ctx.fillText(u.l, ux, cd.y + cd.height - 10);
        });
      }

      // BARCODE ELEMENT
      else if (elem.type === 'barcode') {
        const bc = elem as BarcodeElement;
        ctx.fillStyle = bc.backgroundColor || '#FFFDF7';
        ctx.fillRect(bc.x, bc.y, bc.width, bc.height);
        ctx.strokeStyle = bc.color || '#1c050a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bc.x, bc.y, bc.width, bc.height);
        ctx.fillStyle = bc.color || '#1c050a';
        ctx.font = 'bold 9px monospace';
        ctx.textAlign = 'center';
        if (bc.label) {
          ctx.fillText(bc.label, bc.x + bc.width / 2, bc.y + 13);
        }
        const barStartX = bc.x + 12;
        const barW = bc.width - 24;
        for (let b = 0; b < 32; b++) {
          if (b % 2 === 0) {
            const w = ((b * 7) % 3) + 1.5;
            ctx.fillRect(barStartX + (b / 32) * barW, bc.y + 18, w, bc.height - 34);
          }
        }
        ctx.fillText(bc.codeValue, bc.x + bc.width / 2, bc.y + bc.height - 5);
      }

      // PHOTO COLLAGE GRID ELEMENT
      else if (elem.type === 'grid') {
        const gr = elem as GridElement;
        ctx.fillStyle = gr.backgroundColor || 'rgba(20, 5, 10, 0.7)';
        ctx.fillRect(gr.x, gr.y, gr.width, gr.height);
        const imgs = gr.images || [];
        if (gr.slots && gr.slots.length > 0) {
          for (let i = 0; i < gr.slots.length; i++) {
            const slot = gr.slots[i];
            const sx = gr.x + (slot.x / 100) * gr.width + 2;
            const sy = gr.y + (slot.y / 100) * gr.height + 2;
            const sw = (slot.w / 100) * gr.width - 4;
            const sh = (slot.h / 100) * gr.height - 4;
            const imgUrl = imgs[i % Math.max(1, imgs.length)];
            if (imgUrl) {
              try {
                const gImg = new Image();
                gImg.crossOrigin = 'anonymous';
                gImg.src = imgUrl;
                await new Promise((res) => {
                  gImg.onload = res;
                  gImg.onerror = res;
                });
                ctx.drawImage(gImg, sx, sy, sw, sh);
              } catch {
                // ignore
              }
            }
          }
        } else {
          const cols = 2;
          const rowsCount = gr.gridLayout === '2-col' ? 1 : 2;
          const cw = gr.width / cols;
          const ch = gr.height / rowsCount;
          for (let i = 0; i < imgs.length; i++) {
            const cellUrl = imgs[i];
            const r = Math.floor(i / cols);
            const c = i % cols;
            const cxPos = gr.x + c * cw + 2;
            const cyPos = gr.y + r * ch + 2;
            if (cellUrl) {
              try {
                const gImg = new Image();
                gImg.crossOrigin = 'anonymous';
                gImg.src = cellUrl;
                await new Promise((res) => {
                  gImg.onload = res;
                  gImg.onerror = res;
                });
                ctx.drawImage(gImg, cxPos, cyPos, cw - 4, ch - 4);
              } catch {
                // ignore
              }
            }
          }
        }
        ctx.strokeStyle = gr.borderColor || '#D4AF37';
        ctx.lineWidth = gr.borderWidth || 1.5;
        ctx.strokeRect(gr.x, gr.y, gr.width, gr.height);
      }

      // CLIPPING FRAME ELEMENT
      else if (elem.type === 'frame') {
        const fr = elem as FrameElement;
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = fr.imageSrc || '/images/wedding_couple_1791965341379.jpg';
          await new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
          ctx.drawImage(img, fr.x, fr.y, fr.width, fr.height);
          ctx.strokeStyle = fr.borderColor || '#D4AF37';
          ctx.lineWidth = fr.borderWidth || 2;
          ctx.strokeRect(fr.x, fr.y, fr.width, fr.height);
        } catch {
          // ignore
        }
      }

      // INTERACTIVE FORM ELEMENT
      else if (elem.type === 'form') {
        const fm = elem as FormElement;
        ctx.fillStyle = fm.backgroundColor || 'rgba(20, 14, 10, 0.94)';
        ctx.fillRect(fm.x, fm.y, fm.width, fm.height);
        ctx.strokeStyle = fm.borderColor || '#D4AF37';
        ctx.lineWidth = 2;
        ctx.strokeRect(fm.x, fm.y, fm.width, fm.height);
        ctx.fillStyle = fm.accentColor || '#D4AF37';
        ctx.font = 'bold 12px Cinzel, serif';
        ctx.textAlign = 'left';
        ctx.fillText(fm.formTitle || 'R.S.V.P.', fm.x + 12, fm.y + 22);
        ctx.fillStyle = fm.accentColor || '#D4AF37';
        ctx.fillRect(fm.x + 12, fm.y + fm.height - 32, fm.width - 24, 22);
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.font = 'bold 10px Cinzel, serif';
        ctx.fillText(fm.submitLabel || 'Confirm RSVP', fm.x + fm.width / 2, fm.y + fm.height - 17);
      }

      // LIVE FORMULA SPREADSHEET ELEMENT
      else if (elem.type === 'sheet') {
        const sh = elem as SheetElement;
        ctx.fillStyle = sh.backgroundColor || 'rgba(15, 23, 42, 0.94)';
        ctx.fillRect(sh.x, sh.y, sh.width, sh.height);
        ctx.fillStyle = sh.headerBgColor || '#78350F';
        ctx.fillRect(sh.x, sh.y, sh.width, 24);
        ctx.fillStyle = '#FEF3C7';
        ctx.font = 'bold 10px Cinzel, serif';
        ctx.textAlign = 'left';
        ctx.fillText(sh.sheetTitle || 'Wedding Sheet', sh.x + 8, sh.y + 16);
        const rows = sh.cells || [];
        const rowH = (sh.height - 28) / Math.max(1, rows.length);
        const colW = sh.width / Math.max(1, sh.columns?.length || 4);
        ctx.fillStyle = sh.textColor || '#F3F4F6';
        ctx.font = '9px sans-serif';
        rows.forEach((r, rIdx) => {
          r.forEach((cell, cIdx) => {
            const val = String(evaluateSheetCell(cell, rows));
            ctx.fillText(val, sh.x + cIdx * colW + 6, sh.y + 38 + rIdx * rowH);
          });
        });
        ctx.strokeStyle = sh.borderColor || '#D4AF37';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sh.x, sh.y, sh.width, sh.height);
      }

      // DEVICE / CARD MOCKUP ELEMENT
      else if (elem.type === 'mockup') {
        const mk = elem as MockupElement;
        try {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = mk.contentImageSrc || '/images/wedding_couple_1791965341379.jpg';
          await new Promise((res) => {
            img.onload = res;
            img.onerror = res;
          });
          const sr = mk.screenRect || { x: 14, y: 10, w: 72, h: 80 };
          ctx.drawImage(
            img,
            mk.x + (sr.x / 100) * mk.width,
            mk.y + (sr.y / 100) * mk.height,
            (sr.w / 100) * mk.width,
            (sr.h / 100) * mk.height
          );
          ctx.strokeStyle = mk.accentColor || '#D4AF37';
          ctx.lineWidth = 3;
          ctx.strokeRect(mk.x, mk.y, mk.width, mk.height);
        } catch {
          // ignore
        }
      }

      // 3D MODEL / VIDEO / AUDIO ELEMENTS
      else if (elem.type === 'model3d' || elem.type === 'video' || elem.type === 'audio') {
        ctx.fillStyle = 'rgba(24, 16, 8, 0.85)';
        ctx.fillRect(elem.x, elem.y, elem.width, elem.height);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.strokeRect(elem.x, elem.y, elem.width, elem.height);
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 11px Cinzel, serif';
        ctx.textAlign = 'center';
        const label =
          elem.type === 'model3d'
            ? (elem as Model3DElement).modelName
            : elem.type === 'video'
            ? (elem as VideoElement).videoName
            : (elem as AudioElement).trackName;
        ctx.fillText(label || elem.type.toUpperCase(), elem.x + elem.width / 2, elem.y + elem.height / 2 + 4);
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
      const dataUrl = await generateCanvasImage(targetPage, format, exportScale);
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

  // Download the full card deck as a multipage PDF.
  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      if (pages.length === 0) return;

      // Keep the design's aspect ratio and physical page size (96 CSS px = 72 pt).
      const pageWidth = (dimensions.width * 72) / 96;
      const pageHeight = (dimensions.height * 72) / 96;
      const orientation = pageWidth > pageHeight ? 'landscape' : 'portrait';
      const pdf = new jsPDF({
        orientation,
        unit: 'pt',
        format: [pageWidth, pageHeight],
        compress: true,
      });

      for (const [index, page] of pages.entries()) {
        const image = await generateCanvasImage(page, 'png', exportScale);
        if (!image) throw new Error(`Could not render page ${index + 1}.`);
        if (index > 0) pdf.addPage([pageWidth, pageHeight], orientation);
        pdf.addImage(image, 'PNG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }

      const safeTitle = title.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'invitation';
      pdf.save(`${safeTitle}-invitation.pdf`);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#D4AF37', '#FFEAA7', '#FFD700', '#C41E3A'] });
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
              <h3 className="text-sm font-bold text-neutral-100">
                Canva Pro Export & Share Studio
              </h3>
              <p className="text-[11px] text-neutral-400">
                High-Resolution 1x/2x/3x Retina Downloads & Multi-Page PDF
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
          {/* Page & Resolution Quality Selector */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            {pages.length > 1 && (
              <div className="flex items-center justify-between bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800">
                <span className="text-neutral-300 font-medium">Page:</span>
                <select
                  value={selectedExportPage}
                  onChange={(e) => setSelectedExportPage(parseInt(e.target.value))}
                  className="bg-neutral-800 text-amber-300 font-semibold px-2 py-1 rounded-lg border border-neutral-700 outline-none"
                >
                  {pages.map((p, idx) => (
                    <option key={p.id || idx} value={idx}>
                      Page {idx + 1}: {p.title.slice(0, 14)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="flex items-center justify-between bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-800">
              <span className="text-neutral-300 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quality:
              </span>
              <select
                value={exportScale}
                onChange={(e) => setExportScale(parseInt(e.target.value))}
                className="bg-neutral-800 text-amber-300 font-semibold px-2 py-1 rounded-lg border border-neutral-700 outline-none"
              >
                <option value={1}>1x Standard Web</option>
                <option value={2}>2x Retina HD (300 DPI)</option>
                <option value={3}>3x Ultra Print Studio</option>
              </select>
            </div>
          </div>

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
                  {exportScale}x HD PNG
                </span>
              </div>
              <div>
                <div className="text-sm font-semibold text-neutral-100">
                  {downloading ? 'Rendering...' : 'Download PNG'}
                </div>
                <div className="text-[11px] text-neutral-400">
                  Lossless print & crisp typography
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
                  Fast WhatsApp
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
                  Download All {pages.length} Pages as PDF
                </div>
                <div className="text-[11px] text-neutral-400">
                  Direct multipage PDF download at {exportScale}x resolution
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
