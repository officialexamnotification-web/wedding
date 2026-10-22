import React, { useEffect, useState } from 'react';
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
  Music,
  Film,
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
  AudioTrack,
  AudioClipSettings,
  AudioTimelineClip,
  CardTemplate,
} from '../types/editor';
import { evaluateSheetCell } from './Canvas';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  pages: CardPage[];
  currentPageIndex?: number;
  aspectRatio: AspectRatioType;
  activeAudioTrack?: AudioTrack;
  audioClip?: AudioClipSettings;
  audioClips?: AudioTimelineClip[];
  audioTracks?: AudioTrack[];
  occasionCategory?: CardTemplate['category'];
}

type GreetingLanguage = 'en' | 'hi';
type VideoQuality = '1080p' | '4k';

const tracePhotoMask = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  mask: ImageElement['mask'],
  radius = 18,
) => {
  context.beginPath();
  if (mask === 'circle') {
    context.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  } else if (mask === 'arch') {
    context.moveTo(x, y + height);
    context.lineTo(x, y + height * 0.52);
    context.bezierCurveTo(x, y + height * 0.22, x + width * 0.19, y, x + width / 2, y);
    context.bezierCurveTo(x + width * 0.81, y, x + width, y + height * 0.22, x + width, y + height * 0.52);
    context.lineTo(x + width, y + height);
    context.closePath();
  } else if (mask === 'diamond') {
    context.moveTo(x + width / 2, y);
    context.lineTo(x + width, y + height / 2);
    context.lineTo(x + width / 2, y + height);
    context.lineTo(x, y + height / 2);
    context.closePath();
  } else if (mask === 'heart') {
    context.moveTo(x + width / 2, y + height * 0.96);
    context.bezierCurveTo(x + width * 0.38, y + height * 0.82, x, y + height * 0.56, x, y + height * 0.3);
    context.bezierCurveTo(x, y - height * 0.02, x + width * 0.38, y - height * 0.03, x + width / 2, y + height * 0.2);
    context.bezierCurveTo(x + width * 0.62, y - height * 0.03, x + width, y - height * 0.02, x + width, y + height * 0.3);
    context.bezierCurveTo(x + width, y + height * 0.56, x + width * 0.62, y + height * 0.82, x + width / 2, y + height * 0.96);
    context.closePath();
  } else if (mask === 'octagon' || mask === 'hexagon') {
    const inset = mask === 'hexagon' ? width * 0.25 : width * 0.29;
    context.moveTo(x + inset, y);
    context.lineTo(x + width - inset, y);
    context.lineTo(x + width, y + height / 2);
    context.lineTo(x + width - inset, y + height);
    context.lineTo(x + inset, y + height);
    context.lineTo(x, y + height / 2);
    context.closePath();
  } else if (mask === 'rounded' || mask === 'polaroid') {
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    context.moveTo(x + r, y);
    context.lineTo(x + width - r, y);
    context.quadraticCurveTo(x + width, y, x + width, y + r);
    context.lineTo(x + width, y + height - r);
    context.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
    context.lineTo(x + r, y + height);
    context.quadraticCurveTo(x, y + height, x, y + height - r);
    context.lineTo(x, y + r);
    context.quadraticCurveTo(x, y, x + r, y);
    context.closePath();
  } else {
    context.rect(x, y, width, height);
  }
};

const getGreetingMessage = (occasion: string, language: GreetingLanguage) => {
  const messages: Record<GreetingLanguage, Record<string, string>> = {
    en: {
      wedding: `✨ You’re invited! ✨\n\nTwo hearts, one beautiful journey. With love and blessings, we invite you to join us in celebrating the beginning of our forever.`,
      housewarming: `✨ You’re invited! ✨\n\nWith hearts full of gratitude, we invite you to bless our new home and make this auspicious beginning even more special with your presence.`,
      birthday: `✨ You’re invited! ✨\n\nA little more sparkle, a lot more joy, and memories to cherish forever. Join us as we celebrate a special day filled with love and laughter.`,
      baby: `✨ You’re invited! ✨\n\nA little miracle is on the way, bringing a world of love and joy. Join us as we celebrate the beautiful journey of motherhood and shower the mother-to-be with blessings.`,
      festive: `✨ You’re invited! ✨\n\nAn evening of music, colours, laughter, and love awaits. Join us as we celebrate the beautiful moments leading to a lifetime of togetherness.`,
      anniversary: `✨ You’re invited! ✨\n\nCelebrating a love that grows more beautiful with every passing year. Join us for an elegant gathering filled with cherished memories, heartfelt moments, and everlasting love.`,
    },
    hi: {
      wedding: `✨ You’re invited! ✨\n\nदो दिल, एक खूबसूरत सफ़र। प्रेम और आशीर्वाद के साथ, हम आपको अपने नए जीवन की शुरुआत के इस शुभ अवसर पर सादर आमंत्रित करते हैं।`,
      housewarming: `✨ You’re invited! ✨\n\nकृतज्ञता और प्रसन्नता से भरे हृदय के साथ, हम आपको अपने नए घर के शुभ प्रवेश पर पधारकर इस मंगलमय शुरुआत को और भी खास बनाने हेतु सादर आमंत्रित करते हैं।`,
      birthday: `✨ You’re invited! ✨\n\nथोड़ी और चमक, ढेर सारी खुशियाँ और हमेशा याद रहने वाले पल। प्रेम और मुस्कान से सजे इस खास दिन के जश्न में शामिल होने के लिए सादर आमंत्रित हैं।`,
      baby: `✨ You’re invited! ✨\n\nनन्हा-सा चमत्कार हमारे जीवन में खुशियाँ और प्रेम लेकर आने वाला है। मातृत्व की इस खूबसूरत यात्रा का जश्न मनाने और होने वाली माँ को आशीर्वाद देने के लिए सादर आमंत्रित हैं।`,
      festive: `✨ You’re invited! ✨\n\nसंगीत की धुनों, रंगों, हँसी और प्रेम से सजी एक शाम आपका इंतज़ार कर रही है। आइए, जीवनभर के साथ की खूबसूरत शुरुआत से पहले इन यादगार पलों का हिस्सा बनें।`,
      anniversary: `✨ You’re invited! ✨\n\nउस प्रेम का उत्सव, जो हर गुजरते साल के साथ और भी खूबसूरत होता जाता है। यादगार लम्हों, आत्मीय पलों और अटूट प्रेम से सजी इस खास महफ़िल में आप सादर आमंत्रित हैं।`,
    },
  };

  return messages[language][occasion] || messages[language].wedding;
};

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  title,
  pages,
  currentPageIndex = 0,
  aspectRatio,
  activeAudioTrack,
  audioClip = { startSec: 0, durationSec: null, volume: 0.45, fadeInSec: 0, fadeOutSec: 0, loop: true },
  audioClips = [],
  audioTracks = [],
  occasionCategory,
}) => {
  const [downloading, setDownloading] = useState(false);
  const [selectedExportPage, setSelectedExportPage] = useState<number>(currentPageIndex);
  const [exportScale, setExportScale] = useState<number>(2); // 1x, 2x Retina, 3x Ultra Print
  const [copied, setCopied] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const [preparedVideo, setPreparedVideo] = useState<File | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [greetingMessage, setGreetingMessage] = useState('');
  const [greetingLanguage, setGreetingLanguage] = useState<GreetingLanguage>('en');
  const [videoQuality, setVideoQuality] = useState<VideoQuality>('1080p');
  const dimensions = CANVAS_SIZES[aspectRatio] || CANVAS_SIZES['portrait-story'];
  const videoShortEdge = videoQuality === '4k' ? 2160 : 1080;
  const videoOutputScale = videoShortEdge / Math.min(dimensions.width, dimensions.height);
  const videoOutputWidth = Math.round(dimensions.width * videoOutputScale / 2) * 2;
  const videoOutputHeight = Math.round(dimensions.height * videoOutputScale / 2) * 2;

  const invitationTitle = title
    .replace(/\s*\((?:\d+\s*[- ]?\s*(?:page|slide)s?\s*(?:sequence|suite)?|sequence|suite)[^)]*\)\s*$/i, '')
    .replace(/\s*[-–—]\s*\d+\s*[- ]?\s*(?:page|slide)s?\s*(?:sequence|suite)?\s*$/i, '')
    .trim();
  const normalizedTitle = title.toLowerCase();
  const inferredOccasion = normalizedTitle.includes('birthday') || normalizedTitle.includes('janmadin')
    ? 'birthday'
    : normalizedTitle.includes('griha') || normalizedTitle.includes('housewarming') || normalizedTitle.includes('vastu')
      ? 'housewarming'
      : normalizedTitle.includes('godh') || normalizedTitle.includes('baby shower') || normalizedTitle.includes('naamkaran')
        ? 'baby'
        : normalizedTitle.includes('sangeet') || normalizedTitle.includes('mehendi') || normalizedTitle.includes('haldi')
          ? 'festive'
          : normalizedTitle.includes('anniversary') || normalizedTitle.includes('jubilee')
            ? 'anniversary'
            : 'wedding';
  const occasion = occasionCategory === 'birthday' ? 'birthday'
    : occasionCategory === 'housewarming' ? 'housewarming'
      : occasionCategory === 'baby-shower' ? 'baby'
        : occasionCategory === 'sangeet-mehendi' ? 'festive'
          : occasionCategory === 'anniversary' ? 'anniversary'
            : occasionCategory ? 'wedding' : inferredOccasion;
  const defaultMessage = getGreetingMessage(occasion, greetingLanguage);

  useEffect(() => {
    setGreetingMessage(defaultMessage);
    setPreparedVideo(null);
    setShareStatus(null);
  }, [title, occasion, greetingLanguage]);

  if (!isOpen) return null;

  const sampleMessage = greetingMessage || defaultMessage;

  // Render any CardPage accurately into high-res offscreen HTML5 Canvas
  const generateCanvasImage = async (
    page: CardPage,
    format: 'png' | 'jpeg' = 'png',
    scaleFactor: number = exportScale,
    renderMode: 'all' | 'page' | 'transparent' = 'all'
  ): Promise<string> => {
    const scale = scaleFactor;
    const canvas = document.createElement('canvas');
    canvas.width = dimensions.width * scale;
    canvas.height = dimensions.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    ctx.scale(scale, scale);

    // 1. Draw Background
    if (renderMode !== 'transparent' && (
      page.backgroundType === 'image' ||
      page.backgroundValue.startsWith('http') ||
      page.backgroundValue.startsWith('/') ||
      page.backgroundValue.startsWith('data:image')
    )) {
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
    } else if (renderMode !== 'transparent' && (
      page.backgroundValue.startsWith('radial-gradient') ||
      page.backgroundValue.startsWith('linear-gradient')
    )) {
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
    } else if (renderMode !== 'transparent') {
      ctx.fillStyle = page.backgroundValue || '#171717';
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);
    }

    // 2. Draw Elements sorted by zIndex
    const sorted = [...page.elements]
      .filter((e) => !e.hidden)
      .filter((e) => renderMode === 'all' || (renderMode === 'page' ? e.type !== 'text' : e.type === 'text'))
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
        const fontWeight = t.fontWeight === 'bold' ? 'bold' : t.fontWeight || '500';
        ctx.font = `${fontWeight} ${
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
        } else {
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

          const centerX = im.x + im.width / 2;
          const centerY = im.y + im.height / 2;
          const fit = im.objectFit || 'cover';
          const baseScale = fit === 'contain'
            ? Math.min(im.width / img.width, im.height / img.height)
            : Math.max(im.width / img.width, im.height / img.height);
          const drawImageAtFit = (requestedFit: 'cover' | 'contain' | 'fill', zoom = 1) => {
            const fitScale = requestedFit === 'contain'
              ? Math.min(im.width / img.width, im.height / img.height)
              : Math.max(im.width / img.width, im.height / img.height);
            const drawWidth = requestedFit === 'fill' ? im.width : img.width * fitScale * zoom;
            const drawHeight = requestedFit === 'fill' ? im.height : img.height * fitScale * zoom;
            const x = centerX - drawWidth / 2 + (im.offsetX || 0) * im.width / 100;
            const y = centerY - drawHeight / 2 + (im.offsetY || 0) * im.height / 100;
            ctx.drawImage(img, x, y, drawWidth, drawHeight);
          };

          ctx.save();
          tracePhotoMask(ctx, im.x, im.y, im.width, im.height, im.mask, im.borderRadius);
          ctx.clip();

          if (fit === 'contain') {
            ctx.save();
            ctx.filter = 'blur(12px) brightness(0.62)';
            ctx.globalAlpha *= 0.9;
            drawImageAtFit('cover', 1.08);
            ctx.restore();
          }

          const imageScale = Math.max(0.1, im.scale || 1);
          const drawWidth = fit === 'fill' ? im.width * imageScale : img.width * baseScale * imageScale;
          const drawHeight = fit === 'fill' ? im.height * imageScale : img.height * baseScale * imageScale;
          const x = centerX - drawWidth / 2 + (im.offsetX || 0) * im.width / 100;
          const y = centerY - drawHeight / 2 + (im.offsetY || 0) * im.height / 100;
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(((im.rotationInside || 0) * Math.PI) / 180);
          ctx.translate(-centerX, -centerY);
          ctx.drawImage(img, x, y, drawWidth, drawHeight);
          ctx.restore();

          if ((im.vignette || 0) > 0) {
            const vignette = ctx.createRadialGradient(centerX, centerY, Math.min(im.width, im.height) * 0.15, centerX, centerY, Math.max(im.width, im.height) * 0.72);
            vignette.addColorStop(0, 'rgba(0,0,0,0)');
            vignette.addColorStop(1, `rgba(0,0,0,${Math.min(0.9, (im.vignette || 0) / 100)})`);
            ctx.fillStyle = vignette;
            ctx.fillRect(im.x, im.y, im.width, im.height);
          }
          ctx.restore();

          if (im.borderWidth && im.borderWidth > 0 && im.mask !== 'arch') {
            tracePhotoMask(ctx, im.x, im.y, im.width, im.height, im.mask, im.borderRadius);
            ctx.strokeStyle = im.borderColor || '#D4AF37';
            ctx.lineWidth = im.borderWidth;
            ctx.stroke();
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

      // Render selected 3D models to transparent artwork for the final card export.
      else if (elem.type === 'model3d') {
        try {
          const { renderModel3DToDataUrl } = await import('./RealisticModel3D');
          const modelImage = new Image();
          modelImage.src = renderModel3DToDataUrl(elem as Model3DElement, Math.max(320, Math.min(1024, Math.round(Math.max(elem.width, elem.height) * scale))));
          await new Promise<void>((resolve, reject) => {
            modelImage.onload = () => resolve();
            modelImage.onerror = () => reject(new Error('3D artwork could not be rendered'));
          });
          ctx.drawImage(modelImage, elem.x, elem.y, elem.width, elem.height);
        } catch {
          ctx.fillStyle = 'rgba(24, 16, 8, 0.85)';
          ctx.fillRect(elem.x, elem.y, elem.width, elem.height);
          ctx.fillStyle = '#FDE68A';
          ctx.font = 'bold 11px Cinzel, serif';
          ctx.textAlign = 'center';
          ctx.fillText((elem as Model3DElement).modelName || '3D Object', elem.x + elem.width / 2, elem.y + elem.height / 2 + 4);
        }
      }

      // Uploaded video layers export their current decoded frame in still images.
      else if (elem.type === 'video' && (elem as VideoElement).mediaSrc) {
        const video = document.createElement('video');
        video.src = (elem as VideoElement).mediaSrc!;
        video.muted = true;
        video.playsInline = true;
        video.preload = 'auto';
        await new Promise<void>((resolve) => {
          video.onloadeddata = () => resolve();
          video.onerror = () => resolve();
          window.setTimeout(resolve, 4000);
        });
        try {
          ctx.save();
          ctx.beginPath();
          const videoElem = elem as VideoElement;
          const radius = Math.max(0, videoElem.borderRadius ?? 10);
          ctx.roundRect(elem.x, elem.y, elem.width, elem.height, radius);
          ctx.clip();
          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) ctx.drawImage(video, elem.x, elem.y, elem.width, elem.height);
          ctx.restore();
          ctx.strokeStyle = videoElem.borderColor || '#D4AF37';
          ctx.lineWidth = videoElem.borderWidth || 1;
          ctx.strokeRect(elem.x, elem.y, elem.width, elem.height);
        } catch { /* retain the rest of the card if the browser cannot decode this video */ }
      }

      // VIDEO / AUDIO ELEMENTS
      else if (elem.type === 'video' || elem.type === 'audio') {
        ctx.fillStyle = 'rgba(24, 16, 8, 0.85)';
        ctx.fillRect(elem.x, elem.y, elem.width, elem.height);
        ctx.strokeStyle = '#D4AF37';
        ctx.lineWidth = 2;
        ctx.strokeRect(elem.x, elem.y, elem.width, elem.height);
        ctx.fillStyle = '#FDE68A';
        ctx.font = 'bold 11px Cinzel, serif';
        ctx.textAlign = 'center';
        const label =
          elem.type === 'video'
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

  const handleDownloadVideo = async (prepareForShare = false) => {
    if (!pages.length) return;
    setDownloading(true);
    setExportError(null);
    setShareStatus(null);
    let audioContext: AudioContext | null = null;
    const sources: AudioBufferSourceNode[] = [];
    const mediaAudioSources: MediaElementAudioSourceNode[] = [];
    let recorder: MediaRecorder | null = null;
    let stream: MediaStream | null = null;

    try {
      if (!HTMLCanvasElement.prototype.captureStream || typeof MediaRecorder === 'undefined') {
        throw new Error('Video export is not supported in this browser. Please use the latest Chrome or Edge.');
      }

      // Keep 1080p as the share-friendly default. 4K keeps the original ratio
      // and uses a 3x source render to avoid allocating a full 4K bitmap for
      // every animated text layer before encoding the final 4K frames.
      const outputScale = videoOutputScale;
      const renderScale = videoQuality === '4k' ? Math.min(outputScale, 3) : outputScale;
      const outputWidth = videoOutputWidth;
      const outputHeight = videoOutputHeight;
      const loadRender = async (page: CardPage, mode: 'page' | 'transparent') => {
        const dataUrl = await generateCanvasImage(page, 'png', renderScale, mode);
        if (!dataUrl) throw new Error(`Could not render “${page.title}”.`);
        const image = new Image();
        image.src = dataUrl;
        await new Promise<void>((resolve, reject) => {
          image.onload = () => resolve();
          image.onerror = () => reject(new Error(`Could not load “${page.title}” for video export.`));
        });
        return image;
      };
      const renderedPages = await Promise.all(pages.map(async (page) => ({
        base: await loadRender(page, 'page'),
        text: await Promise.all(page.elements
          .filter((element): element is TextElement => element.type === 'text' && !element.hidden)
          .map(async (element, order) => ({
            element,
            order,
            image: await loadRender({ ...page, elements: [element] }, 'transparent'),
          }))),
      })));
      const videoLayers = await Promise.all(pages.map(async (page) => {
        const layers = page.elements.filter((element): element is VideoElement => element.type === 'video' && !!element.mediaSrc && !element.hidden);
        return Promise.all(layers.map(async (element) => {
          const video = document.createElement('video');
          video.src = element.mediaSrc!;
          video.muted = element.isMuted ?? true;
          video.loop = element.loop ?? true;
          video.playsInline = true;
          video.preload = 'auto';
          await new Promise<void>((resolve) => {
            video.onloadeddata = () => resolve();
            video.onerror = () => resolve();
            window.setTimeout(resolve, 5000);
          });
          if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) void video.play().catch(() => undefined);
          return { element, video };
        }));
      }));

      const canvas = document.createElement('canvas');
      canvas.width = outputWidth;
      canvas.height = outputHeight;
      if (canvas.width !== outputWidth || canvas.height !== outputHeight) {
        throw new Error('This browser cannot allocate the selected video size. Choose 1080p / 60 FPS and try again.');
      }
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Could not initialize the video renderer. Try 1080p / 60 FPS on this device.');

      const videoStream = canvas.captureStream(60);
      stream = videoStream;
      const audioDurationSec = pages.reduce((sum, page) => sum + (page.duration || 4.5), 0);
      let audioDestination: MediaStreamAudioDestinationNode | null = null;

      if (audioClips.length > 0 || videoLayers.some((pageLayers) => pageLayers.some(({ element }) => !element.isMuted))) {
        audioContext = new AudioContext();
        await audioContext.resume();
        audioDestination = audioContext.createMediaStreamDestination();
        const clipsToRender = audioClips;
        const pageStarts = pages.map((_, index) => pages.slice(0, index).reduce((sum, page) => sum + (page.duration || 4.5), 0));
        for (const clip of clipsToRender) {
          const track = audioTracks.find((item) => item.id === clip.trackId) || (clip.trackId === activeAudioTrack?.id ? activeAudioTrack : undefined);
          if (!track?.audioUrl) continue;
          const response = await fetch(track.audioUrl);
          if (!response.ok) throw new Error(`Could not load the “${track.name}” music track.`);
          const audioBuffer = await audioContext.decodeAudioData(await response.arrayBuffer());
          const settings = clip.settings;
          const defaultStart = clip.pageIndex === null ? 0 : pageStarts[clip.pageIndex] ?? 0;
          const timelineStart = clip.timelineStartSec ?? defaultStart;
          const scopeEnd = clip.pageIndex === null ? audioDurationSec : defaultStart + (pages[clip.pageIndex]?.duration || 4.5);
          const scopeDuration = Math.max(0.25, scopeEnd - timelineStart);
          const musicDuration = Math.max(0.25, Math.min(settings.durationSec ?? scopeDuration, scopeDuration));
          const startAt = audioContext.currentTime + timelineStart;
          const safeSourceStart = Math.min(Math.max(0, settings.startSec), Math.max(0, audioBuffer.duration - 0.05));
          const safeSourceEnd = Math.max(safeSourceStart + 0.05, Math.min(settings.sourceEndSec ?? audioBuffer.duration, audioBuffer.duration));
          const selectedSourceDuration = safeSourceEnd - safeSourceStart;
          const audibleDuration = settings.loop ? musicDuration : Math.min(musicDuration, selectedSourceDuration);
          const sourceNode = audioContext.createBufferSource();
          sourceNode.buffer = audioBuffer;
          if (settings.loop && safeSourceStart < audioBuffer.duration) {
            sourceNode.loop = true;
            sourceNode.loopStart = safeSourceStart;
            sourceNode.loopEnd = safeSourceEnd;
          }
          const gain = audioContext.createGain();
          const fadeIn = Math.min(settings.fadeInSec, audibleDuration / 2);
          const fadeOut = Math.min(settings.fadeOutSec, audibleDuration / 2);
          gain.gain.setValueAtTime(fadeIn > 0 ? 0 : settings.volume, startAt);
          if (fadeIn > 0) gain.gain.linearRampToValueAtTime(settings.volume, startAt + fadeIn);
          if (fadeOut > 0) {
            gain.gain.setValueAtTime(settings.volume, startAt + Math.max(fadeIn, audibleDuration - fadeOut));
            gain.gain.linearRampToValueAtTime(0, startAt + audibleDuration);
          }
          sourceNode.connect(gain);
          gain.connect(audioDestination);
          sources.push(sourceNode);
          sourceNode.start(startAt, safeSourceStart);
          sourceNode.stop(startAt + audibleDuration);
        }
        for (const pageLayers of videoLayers) {
          for (const { element, video } of pageLayers) {
            if (element.isMuted ?? true) continue;
            const mediaSource = audioContext.createMediaElementSource(video);
            mediaSource.connect(audioDestination);
            mediaAudioSources.push(mediaSource);
          }
        }
        for (const track of audioDestination.stream.getAudioTracks()) videoStream.addTrack(track);
      }

      // Prefer a codec that can handle high resolutions. The old AVC level
      // hint was capped too low for 1080p60 and 4K60 on some encoders.
      const mimeCandidates = videoQuality === '4k'
        ? ['video/webm;codecs=vp9,opus', 'video/mp4', 'video/webm;codecs=vp8,opus', 'video/webm']
        : ['video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm', 'video/mp4;codecs="avc1.42E01E,mp4a.40.2"'];
      const mimeType = mimeCandidates
        .find((candidate) => MediaRecorder.isTypeSupported(candidate));
      if (!mimeType) throw new Error('This browser cannot encode an invitation video. Please use an updated browser.');

      const chunks: BlobPart[] = [];
      recorder = new MediaRecorder(videoStream, {
        mimeType,
        videoBitsPerSecond: videoQuality === '4k' ? 35_000_000 : 12_000_000,
        audioBitsPerSecond: 192_000,
      });
      const recording = new Promise<Blob>((resolve, reject) => {
        recorder!.ondataavailable = (event) => { if (event.data.size > 0) chunks.push(event.data); };
        recorder!.onerror = () => reject(new Error(videoQuality === '4k'
          ? '4K / 60 FPS encoding failed on this device. Switch to 1080p / 60 FPS and try again.'
          : 'Video recording failed. Please try again.'));
        recorder!.onstop = () => resolve(new Blob(chunks, { type: mimeType }));
      });

      const pageDurations = pages.map((page) => page.duration || 4.5);
      const totalDurationSec = pageDurations.reduce((sum, duration) => sum + duration, 0);
      const frameCanvas = document.createElement('canvas');
      frameCanvas.width = canvas.width;
      frameCanvas.height = canvas.height;
      const frameContext = frameCanvas.getContext('2d');
      if (!frameContext) throw new Error('Could not initialize the animation renderer.');

      const drawPage = (target: CanvasRenderingContext2D, index: number, elapsedSec: number) => {
        const rendered = renderedPages[index];
        target.clearRect(0, 0, canvas.width, canvas.height);
        target.drawImage(rendered.base, 0, 0, canvas.width, canvas.height);
        for (const { element, video } of videoLayers[index]) {
          if (video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) continue;
          target.save();
          target.globalAlpha = element.opacity ?? 1;
          const centerX = (element.x + element.width / 2) * outputScale;
          const centerY = (element.y + element.height / 2) * outputScale;
          target.translate(centerX, centerY);
          target.rotate(((element.rotation || 0) * Math.PI) / 180);
          target.beginPath();
          target.roundRect(-element.width * outputScale / 2, -element.height * outputScale / 2, element.width * outputScale, element.height * outputScale, (element.borderRadius ?? 10) * outputScale);
          target.clip();
          target.drawImage(video, -element.width * outputScale / 2, -element.height * outputScale / 2, element.width * outputScale, element.height * outputScale);
          target.restore();
        }
        for (const layer of rendered.text) {
          const { element, order, image } = layer;
          const kind = element.animation || 'none';
          const stagger = Math.min(0.9, order * 0.13);
          const duration = 1.35 / Math.max(0.6, element.animationSpeed || 1);
          const progress = kind === 'none' ? 1 : Math.max(0, Math.min(1, (elapsedSec - stagger) / duration));
          if (progress <= 0) continue;
          const alpha = kind === 'fade' || kind === 'rise' || kind === 'pan' || kind === 'wipe' || kind === 'typewriter' ? progress : 1;
          const translateY = kind === 'rise' ? (1 - progress) * element.height * 0.45 : 0;
          const translateX = kind === 'pan' ? (1 - progress) * -element.width * 0.45 : 0;
          const scale = kind === 'pop' ? 0.86 + progress * 0.14 : 1;
          target.save();
          target.globalAlpha = alpha;
          if (kind === 'wipe') {
            target.beginPath();
            target.rect(element.x * outputScale, element.y * outputScale, element.width * outputScale * progress, element.height * outputScale);
            target.clip();
          }
          const cx = (element.x + element.width / 2) * outputScale;
          const cy = (element.y + element.height / 2) * outputScale;
          target.translate(cx + translateX * outputScale, cy + translateY * outputScale);
          target.scale(scale, scale);
          target.drawImage(image, -cx, -cy, canvas.width, canvas.height);
          target.restore();
        }
      };

      const drawPageTransition = (pageIndex: number, pageProgress: number, pageElapsed: number) => {
        drawPage(frameContext, pageIndex, pageElapsed);
        const transition = pages[pageIndex].transition || 'fade';
        const t = Math.max(0, Math.min(1, pageProgress));
        context.clearRect(0, 0, canvas.width, canvas.height);
        if (t >= 1 || transition === 'none') {
          context.drawImage(frameCanvas, 0, 0);
          return;
        }
        context.fillStyle = '#100b12';
        context.fillRect(0, 0, canvas.width, canvas.height);
        if (pageIndex > 0) drawPage(context, pageIndex - 1, pages[pageIndex - 1].duration || 6);
        if (transition === 'slide' || transition === 'push') {
          if (transition === 'push' && pageIndex > 0) {
            context.drawImage(renderedPages[pageIndex - 1].base, -canvas.width * t, 0, canvas.width, canvas.height);
          }
          context.drawImage(frameCanvas, canvas.width * (1 - t), 0, canvas.width, canvas.height);
        } else if (transition === 'zoom') {
          context.globalAlpha = t;
          const zoom = 0.92 + t * 0.08;
          const w = canvas.width * zoom;
          const h = canvas.height * zoom;
          context.drawImage(frameCanvas, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
          context.globalAlpha = 1;
        } else if (transition === 'royal-curtain') {
          context.save();
          context.beginPath();
          const half = canvas.width * t / 2;
          context.rect(canvas.width / 2 - half, 0, half * 2, canvas.height);
          context.clip();
          context.drawImage(frameCanvas, 0, 0);
          context.restore();
        } else if (transition === 'wipe') {
          context.save();
          context.beginPath();
          context.rect(0, 0, canvas.width * t, canvas.height);
          context.clip();
          context.drawImage(frameCanvas, 0, 0);
          context.restore();
        } else if (transition === 'flip') {
          if (pageIndex > 0 && t < 0.5) {
            context.save();
            const scaleX = Math.max(0.01, 1 - t * 2);
            context.translate(canvas.width / 2, 0);
            context.scale(scaleX, 1);
            context.drawImage(renderedPages[pageIndex - 1].base, -canvas.width / 2, 0, canvas.width, canvas.height);
            context.restore();
          } else {
            context.save();
            const scaleX = Math.max(0.01, (t - 0.5) * 2);
            context.translate(canvas.width / 2, 0);
            context.scale(scaleX, 1);
            context.drawImage(frameCanvas, -canvas.width / 2, 0, canvas.width, canvas.height);
            context.restore();
          }
        } else if (transition === 'blur') {
          context.save();
          context.globalAlpha = t;
          context.filter = `blur(${(1 - t) * 14}px)`;
          context.drawImage(frameCanvas, 0, 0);
          context.restore();
        } else if (transition === 'rotate') {
          context.save();
          context.globalAlpha = t;
          const scale = 0.88 + 0.12 * t;
          context.translate(canvas.width / 2, canvas.height / 2);
          context.rotate((1 - t) * -0.12);
          context.scale(scale, scale);
          context.drawImage(frameCanvas, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
          context.restore();
        } else if (transition === 'stack' || transition === 'match-move') {
          context.save();
          context.globalAlpha = transition === 'stack' ? Math.min(1, t * 1.35) : t;
          const scale = transition === 'stack' ? 0.88 + 0.12 * t : 1.06 - 0.06 * t;
          const offsetY = transition === 'stack' ? (1 - t) * canvas.height * 0.035 : (1 - t) * canvas.height * 0.015;
          const width = canvas.width * scale;
          const height = canvas.height * scale;
          context.drawImage(frameCanvas, (canvas.width - width) / 2, (canvas.height - height) / 2 + offsetY, width, height);
          context.restore();
        } else if (transition === 'chop') {
          context.save();
          const strips = 8;
          const stripWidth = canvas.width / strips;
          for (let strip = 0; strip < strips; strip++) {
            const local = Math.max(0, Math.min(1, (t - (strip % 2) * 0.09) / 0.91));
            const revealHeight = canvas.height * local;
            if (revealHeight <= 0) continue;
            const y = strip % 2 === 0 ? 0 : canvas.height - revealHeight;
            context.drawImage(frameCanvas, strip * stripWidth, y, stripWidth + 1, revealHeight, strip * stripWidth, y, stripWidth + 1, revealHeight);
          }
          context.restore();
        } else if (transition === 'iris') {
          context.save();
          context.beginPath();
          context.arc(canvas.width / 2, canvas.height / 2, Math.hypot(canvas.width, canvas.height) * t * 0.52, 0, Math.PI * 2);
          context.clip();
          context.drawImage(frameCanvas, 0, 0);
          context.restore();
        } else if (transition === 'vertical-wipe') {
          context.save();
          context.beginPath();
          context.rect(0, canvas.height * (1 - t), canvas.width, canvas.height * t);
          context.clip();
          context.drawImage(frameCanvas, 0, 0);
          context.restore();
        } else if (transition === 'cross-zoom') {
          context.save();
          context.globalAlpha = t;
          context.filter = `blur(${(1 - t) * 8}px)`;
          const scale = 1.16 - 0.16 * t;
          const width = canvas.width * scale;
          const height = canvas.height * scale;
          context.drawImage(frameCanvas, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
          context.restore();
        } else if (transition === 'page-turn') {
          context.save();
          const revealWidth = Math.max(1, canvas.width * t);
          context.beginPath();
          context.rect(0, 0, revealWidth, canvas.height);
          context.clip();
          context.drawImage(frameCanvas, 0, 0);
          context.restore();
          if (t < 1) {
            const foldX = canvas.width * t;
            const shadeWidth = Math.max(1, canvas.width * 0.055);
            const fold = context.createLinearGradient(foldX - shadeWidth, 0, foldX + shadeWidth, 0);
            fold.addColorStop(0, 'rgba(18,10,7,0)');
            fold.addColorStop(0.48, `rgba(18,10,7,${0.28 * (1 - t)})`);
            fold.addColorStop(1, 'rgba(255,240,205,0)');
            context.fillStyle = fold;
            context.fillRect(foldX - shadeWidth, 0, shadeWidth * 2, canvas.height);
          }
        } else if (transition === 'light-sweep') {
          context.save();
          context.globalAlpha = t;
          context.drawImage(frameCanvas, 0, 0);
          const centerX = canvas.width * (t * 1.35 - 0.15);
          const halfWidth = canvas.width * 0.13;
          const sweep = context.createLinearGradient(centerX - halfWidth, 0, centerX + halfWidth, 0);
          const glow = Math.max(0, 0.52 * (1 - Math.abs(t - 0.55) / 0.55));
          sweep.addColorStop(0, 'rgba(255,230,160,0)');
          sweep.addColorStop(0.5, `rgba(255,239,190,${glow})`);
          sweep.addColorStop(1, 'rgba(255,230,160,0)');
          context.globalAlpha = 1;
          context.fillStyle = sweep;
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.restore();
        } else if (transition === 'panorama') {
          context.save();
          context.globalAlpha = t;
          const scale = 1.08 - 0.08 * t;
          const width = canvas.width * scale;
          const height = canvas.height * scale;
          const x = (canvas.width - width) / 2 + canvas.width * 0.1 * (1 - t);
          context.drawImage(frameCanvas, x, (canvas.height - height) / 2, width, height);
          context.restore();
        } else {
          context.globalAlpha = t;
          context.drawImage(frameCanvas, 0, 0);
          context.globalAlpha = 1;
          if (transition === 'sparkle' && t < 1) {
            context.save();
            context.globalCompositeOperation = 'lighter';
            const sparkleCount = 22;
            for (let i = 0; i < sparkleCount; i++) {
              const phase = (t * 1.7 + i / sparkleCount) % 1;
              const x = ((i * 137.5) % canvas.width);
              const y = ((i * 83.7 + phase * canvas.height) % canvas.height);
              const radius = (2 + (i % 3)) * (1 - phase * 0.45);
              context.globalAlpha = (1 - phase) * 0.8;
              context.fillStyle = i % 4 === 0 ? '#FFF2B2' : '#E7B944';
              context.beginPath();
              context.arc(x, y, radius, 0, Math.PI * 2);
              context.fill();
            }
            context.restore();
          }
        }
      };

      const drawFrame = (elapsedSec: number) => {
        let pageIndex = 0;
        let pageStart = 0;
        while (pageIndex < pageDurations.length - 1 && elapsedSec >= pageStart + pageDurations[pageIndex]) {
          pageStart += pageDurations[pageIndex];
          pageIndex += 1;
        }
        const pageDuration = pageDurations[pageIndex];
        const progress = Math.max(0, Math.min(1, (elapsedSec - pageStart) / pageDuration));
        const page = pages[pageIndex];
        const transitionDuration = Math.min(0.55, pageDuration * 0.2);
        const transitionProgress = page.transition === 'none' ? 1 : Math.min(1, progress * pageDuration / transitionDuration);
        drawPageTransition(pageIndex, transitionProgress, elapsedSec - pageStart);
      };

      drawFrame(0);
      recorder.start(250);
      const startedAt = performance.now();
      await new Promise<void>((resolve) => {
        const render = () => {
          const elapsed = (performance.now() - startedAt) / 1000;
          drawFrame(Math.min(elapsed, totalDurationSec - 0.001));
          if (elapsed >= totalDurationSec) {
            recorder?.stop();
            resolve();
          } else requestAnimationFrame(render);
        };
        requestAnimationFrame(render);
      });
      const blob = await recording;
      const safeTitle = title.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'invitation';
      const extension = mimeType.startsWith('video/mp4') ? 'mp4' : 'webm';
      const fileName = `${safeTitle}-invitation.${extension}`;
      const videoFile = new File([blob], fileName, { type: mimeType.split(';')[0] });
      setPreparedVideo(videoFile);
      if (prepareForShare) {
        setShareStatus('Video is ready. Tap “Share video file” and choose WhatsApp in your device share menu.');
        return;
      }
      setShareStatus('Your video is ready. Click “Save Animated Video” below to download it.');
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: ['#D4AF37', '#FFEAA7', '#FFD700', '#C41E3A'] });
    } catch (error) {
      console.error('Video export failed', error);
      const message = error instanceof Error ? error.message : 'Video export failed. Please try again.';
      setExportError(videoQuality === '4k' && !message.includes('1080p / 60 FPS')
        ? `${message} If this device cannot finish 4K encoding, switch to 1080p / 60 FPS.`
        : message);
    } finally {
      if (recorder?.state === 'recording') recorder.stop();
      sources.forEach((sourceNode) => { try { sourceNode.stop(); } catch { /* already stopped */ } });
      mediaAudioSources.forEach((sourceNode) => sourceNode.disconnect());
      stream?.getTracks().forEach((track) => track.stop());
      if (audioContext && audioContext.state !== 'closed') await audioContext.close();
      setDownloading(false);
    }
  };

  const handleDownloadPreparedVideo = () => {
    if (!preparedVideo) return;
    const downloadUrl = URL.createObjectURL(preparedVideo);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = preparedVideo.name;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 60_000);
    setShareStatus('Download started. Check your browser downloads for the invitation video.');
  };

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(sampleMessage)}`;
    window.open(url, '_blank');
  };

  const handleShareVideoFile = async () => {
    if (!preparedVideo) return;
    const shareData: ShareData = {
      title,
      text: sampleMessage,
      files: [preparedVideo],
    };

    if (!navigator.share || !navigator.canShare?.({ files: [preparedVideo] })) {
      const downloadUrl = URL.createObjectURL(preparedVideo);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = preparedVideo.name;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 30_000);
      setShareStatus('This browser cannot attach files directly. The video was downloaded; attach it in WhatsApp.');
      return;
    }

    try {
      await navigator.share(shareData);
      setShareStatus('Share menu opened. Choose WhatsApp to send the video and invitation message.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setShareStatus('Sharing was cancelled. Your prepared video is still ready.');
        return;
      }
      setExportError(error instanceof Error ? error.message : 'Could not share the video file.');
    }
  };

  const handleShareCardImage = async () => {
    const page = pages[selectedExportPage] || pages[0];
    if (!page) return;
    setShareStatus(null);
    setExportError(null);
    setDownloading(true);
    try {
      const dataUrl = await generateCanvasImage(page, 'png', exportScale, 'all');
      const imageBlob = await (await fetch(dataUrl)).blob();
      const safeTitle = title.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'invitation';
      const file = new File([imageBlob], `${safeTitle}-card.png`, { type: 'image/png' });
      const shareData: ShareData = { title, text: sampleMessage, files: [file] };

      if (!navigator.share || !navigator.canShare?.({ files: [file] })) {
        const downloadUrl = URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = file.name;
        link.click();
        window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 30_000);
        setShareStatus('This browser cannot attach an image directly. The card was downloaded; attach it in WhatsApp with the greeting.');
        return;
      }

      await navigator.share(shareData);
      setShareStatus('Share menu opened. Choose WhatsApp to send the card image with its greeting.');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        setShareStatus('Sharing was cancelled. Your card is unchanged.');
      } else {
        setExportError(error instanceof Error ? error.message : 'Could not prepare the card image.');
      }
    } finally {
      setDownloading(false);
    }
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(sampleMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 z-50 animate-fade-in">
      <div className="bg-[#111110] border border-white/10 rounded-2xl w-full max-w-xl max-h-[88vh] overflow-hidden shadow-[0_28px_100px_rgba(0,0,0,0.65)]">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 shadow-lg shadow-amber-950/30">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold tracking-tight text-neutral-100">
                Export & share
              </h3>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Choose how you want to save or send your invitation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close export and share"
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-3.5 overflow-y-auto max-h-[calc(88vh-66px)]">
          {/* Export settings */}
          <section className="rounded-xl border border-white/10 bg-white/[0.025] p-3">
            <div className="mb-2">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300">Export settings</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
            {pages.length > 1 && (
              <label className="min-w-0 space-y-1.5">
                <span className="block text-[10px] font-medium text-neutral-400">Image page</span>
                <select
                  value={selectedExportPage}
                  onChange={(e) => setSelectedExportPage(parseInt(e.target.value))}
                  className="w-full min-w-0 bg-neutral-950 text-neutral-100 font-medium px-2.5 py-2 rounded-lg border border-white/10 outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
                >
                  {pages.map((p, idx) => (
                    <option key={p.id || idx} value={idx}>
                      Page {idx + 1}{p.title ? ` · ${p.title.slice(0, 32)}` : ''}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="min-w-0 space-y-1.5">
              <span className="flex items-center gap-1.5 text-[10px] font-medium text-neutral-400">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Image quality
              </span>
              <select
                value={exportScale}
                onChange={(e) => setExportScale(parseInt(e.target.value))}
                className="w-full min-w-0 bg-neutral-950 text-neutral-100 font-medium px-2.5 py-2 rounded-lg border border-white/10 outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/10"
              >
                <option value={1}>1x Standard Web</option>
                <option value={2}>2× High Resolution</option>
                <option value={3}>3x Ultra Print Studio</option>
              </select>
            </label>
            </div>
          </section>

          {/* Image downloads */}
          <section>
            <div className="mb-3">
              <h4 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300">Download image</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* PNG */}
            <button
              onClick={() => handleDownloadImage('png')}
              disabled={downloading}
              className="min-w-0 p-3 rounded-xl bg-[#191918] hover:bg-[#20201e] border border-white/10 hover:border-amber-400/40 text-left transition group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-400/10 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-amber-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-100">{downloading ? 'Rendering PNG…' : 'Download PNG'}</span>
                    <span className="text-[9px] text-amber-200 bg-amber-400/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">{exportScale}× HD</span>
                  </div>
                  <span className="block mt-1 text-[10px] text-neutral-500">Lossless, crisp details</span>
                </div>
              </div>
            </button>

            {/* JPG */}
            <button
              onClick={() => handleDownloadImage('jpeg')}
              disabled={downloading}
              className="min-w-0 p-3 rounded-xl bg-[#191918] hover:bg-[#20201e] border border-white/10 hover:border-emerald-400/40 text-left transition group disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                  <ImageIcon className="w-4 h-4 text-emerald-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-neutral-100">{downloading ? 'Rendering JPG…' : 'Download JPG'}</span>
                    <span className="text-[9px] text-emerald-200 bg-emerald-400/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">Smaller file</span>
                  </div>
                  <span className="block mt-1 text-[10px] text-neutral-500">Easy to send in chats</span>
                </div>
              </div>
            </button>
            </div>
          </section>

          {/* Video download */}
          <section>
            <div className="mb-3">
              <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300">Animated invitation</h4>
            </div>
          <div className="mb-2.5 rounded-xl border border-white/10 bg-[#141312] p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium text-neutral-300">Video resolution · 60 FPS</span>
              <span className="text-[9px] text-neutral-500">{videoOutputWidth} × {videoOutputHeight}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {([
                { value: '1080p', title: '1080p · 60 FPS', detail: 'Recommended for sharing' },
                { value: '4k', title: '4K · 60 FPS', detail: 'High resolution · large file' },
              ] as const).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={videoQuality === option.value}
                  disabled={downloading}
                  onClick={() => {
                    setVideoQuality(option.value);
                    setPreparedVideo(null);
                    setShareStatus(null);
                    setExportError(null);
                  }}
                  className={`rounded-lg border px-2.5 py-2 text-left transition disabled:opacity-50 ${videoQuality === option.value ? 'border-amber-300/50 bg-amber-300/10 text-amber-100' : 'border-white/10 bg-black/20 text-neutral-300 hover:border-white/20'}`}
                >
                  <span className="block text-[10px] font-semibold">{option.title}</span>
                  <span className="mt-0.5 block text-[9px] text-neutral-500">{option.detail}</span>
                </button>
              ))}
            </div>
            {videoQuality === '4k' && <p className="mt-2 text-[9px] leading-relaxed text-amber-100/70">4K rendering needs more memory and may take longer. A recent desktop browser is recommended.</p>}
          </div>
          <button
            onClick={() => preparedVideo ? handleDownloadPreparedVideo() : void handleDownloadVideo()}
            disabled={downloading}
            className="group w-full p-3 rounded-xl bg-gradient-to-r from-amber-400/10 to-amber-200/[0.03] hover:from-amber-400/15 hover:to-amber-200/[0.06] border border-amber-300/20 hover:border-amber-300/40 text-left transition flex items-center justify-between gap-3 disabled:opacity-60"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-400/15 border border-amber-400/20 flex items-center justify-center">
                <Film className="w-4 h-4 text-amber-300" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-neutral-100">
                  {downloading ? 'Rendering invitation video…' : preparedVideo ? 'Save Animated Video' : 'Download Animated Video'}
                </div>
                <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                  <Music className="w-3 h-3 text-amber-300" />
                  <span className="truncate">{activeAudioTrack?.name || 'No music'} · {videoQuality === '4k' ? '4K' : '1080p'} · 60 FPS · MP4/WebM</span>
                </div>
              </div>
            </div>
            <Download className="w-4 h-4 shrink-0 text-amber-300 group-hover:translate-y-0.5 transition-transform" />
          </button>
          {exportError && (
            <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-[11px] text-red-200">{exportError}</p>
          )}
          </section>

          {/* PDF Print Option */}
          <section>
            <div className="mb-3">
              <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-neutral-300">Multiple pages</h4>
            </div>
          <button
            onClick={handleDownloadPdf}
            disabled={downloading}
            className="group w-full p-3 rounded-xl bg-[#191918] hover:bg-[#20201e] border border-white/10 hover:border-amber-400/30 flex items-center justify-between transition disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-amber-400" />
              <div className="text-left">
                <div className="text-xs font-semibold text-neutral-100">
                  Download all {pages.length} pages as PDF
                </div>
                <div className="text-[10px] text-neutral-400">
                  Direct multipage PDF download at {exportScale}x resolution
                </div>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-amber-400" />
          </button>
          </section>

          {/* WhatsApp Direct Share Section */}
          <section className="rounded-xl border border-emerald-400/20 bg-emerald-400/[0.035] p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 shrink-0 rounded-lg bg-emerald-400/10 flex items-center justify-center">
                  <Share2 className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-neutral-100">Send the invitation video</h4>
                  <p className="mt-0.5 text-[10px] text-neutral-400">Prepare the video, then choose WhatsApp from your device’s share menu.</p>
                </div>
              </div>
              <button
                onClick={() => preparedVideo ? void handleShareVideoFile() : void handleDownloadVideo(true)}
                disabled={downloading}
                className="shrink-0 py-2 px-3 bg-[#25D366] hover:bg-[#20ba59] disabled:opacity-60 text-neutral-950 font-semibold text-[11px] rounded-lg transition flex items-center justify-center gap-2"
              >
                {preparedVideo ? <Share2 className="w-4 h-4" /> : <Film className="w-4 h-4" />}
                {downloading ? 'Preparing video…' : preparedVideo ? 'Share video file' : 'Prepare video to share'}
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-2 rounded-lg border border-white/10 bg-black/20 p-2.5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="mb-1.5 text-[10px] font-medium text-neutral-300">Greeting language</p>
                <div className="inline-flex rounded-md border border-white/10 bg-neutral-950 p-0.5" aria-label="Choose greeting language">
                  {([['en', 'English'], ['hi', 'हिन्दी']] as const).map(([language, label]) => (
                    <button
                      key={language}
                      type="button"
                      aria-pressed={greetingLanguage === language}
                      onClick={() => {
                        setGreetingLanguage(language);
                        setGreetingMessage(getGreetingMessage(occasion, language));
                      }}
                      className={`rounded px-3 py-1 text-[10px] font-medium transition ${greetingLanguage === language ? 'bg-amber-300 text-neutral-950' : 'text-neutral-400 hover:text-neutral-100'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="line-clamp-2 whitespace-pre-line text-[10px] leading-relaxed text-neutral-400 sm:max-w-[62%]" lang={greetingLanguage === 'hi' ? 'hi' : 'en'}>
                {sampleMessage.split('\n').filter(Boolean).slice(0, 2).join('\n')}
              </p>
            </div>
            {shareStatus && <p role="status" className="mt-2 text-[10px] text-emerald-200">{shareStatus}</p>}
            <p className="mt-1.5 text-[10px] text-neutral-500">Choose WhatsApp from your device’s share menu when file sharing is supported. Otherwise, download the video and attach it in WhatsApp.</p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-white/10 pt-3">
              <button
                onClick={() => void handleShareCardImage()}
                disabled={downloading || !pages.length}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-[11px] font-semibold text-neutral-100 hover:border-amber-300/40 disabled:opacity-50"
              >
                <span className="flex items-center gap-2"><ImageIcon className="h-4 w-4 text-amber-300" /> Share selected card + greeting</span>
                <span className="mt-1 block pl-6 text-[10px] font-normal text-neutral-400">Sends the chosen page as an image, without video.</span>
              </button>
              <button
                onClick={handleShareWhatsApp}
                className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5 text-left text-[11px] font-semibold text-neutral-100 hover:border-emerald-300/40"
              >
                <span className="flex items-center gap-2"><Share2 className="h-4 w-4 text-emerald-300" /> Send greeting only</span>
                <span className="mt-1 block pl-6 text-[10px] font-normal text-neutral-400">Opens WhatsApp with the invitation message, no attachment.</span>
              </button>
            </div>
            <details className="mt-2 group">
              <summary className="cursor-pointer select-none text-[10px] text-neutral-400 hover:text-neutral-200">Edit or copy the {occasion} greeting</summary>
              <textarea
                value={sampleMessage}
                onChange={(event) => setGreetingMessage(event.target.value)}
                aria-label="Invitation greeting message"
                rows={5}
                className="mt-2 w-full resize-y rounded-lg border border-white/10 bg-neutral-950 p-2.5 text-[11px] leading-relaxed text-neutral-200 outline-none focus:border-amber-400/50"
              />
              <div className="mt-1.5 flex items-center justify-end">
                <button
                  onClick={handleCopyMessage}
                  className="text-[10px] text-neutral-400 hover:text-amber-300 flex items-center gap-1 transition"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied!' : 'Copy message'}
                </button>
              </div>
            </details>
          </section>
        </div>
      </div>
    </div>
  );
};
