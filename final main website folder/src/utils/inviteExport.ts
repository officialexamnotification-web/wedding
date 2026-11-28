import QRCode from 'qrcode';
import { InviteTheme } from '../data/studioData';
import { CardCustomization } from '../data/cardCustomization';
import { getMonogramMeta, MonogramStyleMeta } from '../components/TemplateMonograms';

export async function generateInviteQrDataUrl(
  url: string,
  darkHex = '#2A1316',
  lightHex = '#FAF6EE'
): Promise<string> {
  return QRCode.toDataURL(url, {
    width: 360,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: darkHex,
      light: lightHex,
    },
  });
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function triggerCanvasDownload(canvas: HTMLCanvasElement, filename: string) {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export interface StationeryExportInput {
  theme: InviteTheme;
  custom: CardCustomization;
  shareUrl: string;
  primaryName: string;
  partnerName: string;
  isBirthday: boolean;
}

function drawTemplateMonogramOnCanvas(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  meta: MonogramStyleMeta,
  firstInitial: string,
  secondInitial: string,
  darkMode = false
) {
  const stroke = darkMode ? meta.darkStroke : meta.lightStroke;
  const accent = darkMode ? meta.darkAccent : meta.lightAccent;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = stroke;
  ctx.fillStyle = stroke;
  ctx.lineWidth = Math.max(2, radius * 0.036);

  const kind = meta.geometryKind;
  if (kind === 'octagon' || kind === 'signet') {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + Math.PI / 8;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1.2, radius * 0.018);
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + Math.PI / 8;
      const x = Math.cos(a) * (radius * 0.86);
      const y = Math.sin(a) * (radius * 0.86);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  } else if (kind === 'diamond-deco' || kind === 'bandhani-diamond') {
    ctx.beginPath();
    ctx.moveTo(0, -radius * 1.06);
    ctx.lineTo(radius * 1.06, 0);
    ctx.lineTo(0, radius * 1.06);
    ctx.lineTo(-radius * 1.06, 0);
    ctx.closePath();
    ctx.stroke();

    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1.2, radius * 0.02);
    ctx.strokeRect(-radius * 0.68, -radius * 0.68, radius * 1.36, radius * 1.36);
  } else if (kind === 'rub-el-hizb' || kind === 'kolam') {
    const s = radius * 0.72;
    ctx.strokeRect(-s, -s, s * 2, s * 2);
    ctx.save();
    ctx.rotate(Math.PI / 4);
    ctx.strokeStyle = accent;
    ctx.strokeRect(-s, -s, s * 2, s * 2);
    ctx.restore();
  } else if (kind === 'hex-jaali') {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1.2, radius * 0.018);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 2;
      const x = Math.cos(a) * (radius * 0.85);
      const y = Math.sin(a) * (radius * 0.85);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
  } else if (kind === 'surya' || kind === 'candle-star' || kind === 'rangoli') {
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.82, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1.2, radius * 0.02);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.68, 0, Math.PI * 2);
    ctx.stroke();
    const rays = kind === 'rangoli' ? 12 : 16;
    for (let i = 0; i < rays; i++) {
      const a = (i * Math.PI * 2) / rays;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (radius * 0.87), Math.sin(a) * (radius * 0.87));
      ctx.lineTo(
        Math.cos(a) * (radius * (i % 2 === 0 ? 1.08 : 0.96)),
        Math.sin(a) * (radius * (i % 2 === 0 ? 1.08 : 0.96))
      );
      ctx.stroke();
    }
  } else if (kind === 'split-oval' || kind === 'rose-cameo' || kind === 'kalgi-oval') {
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.82, radius * 1.04, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1.2, radius * 0.018);
    ctx.beginPath();
    ctx.ellipse(0, 0, radius * 0.7, radius * 0.91, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    // Arches, lotus seals, gopurams, palna & jharokha frames
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = accent;
    ctx.lineWidth = Math.max(1.2, radius * 0.018);
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.78, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Initials Typography
  const isSymbolic = secondInitial === '★' || secondInitial === 'ॐ';
  const fontSize = Math.round(radius * (isSymbolic ? 0.66 : 0.44));
  ctx.fillStyle = stroke;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `600 ${fontSize}px ${meta.canvasFont}`;
  const label = isSymbolic
    ? firstInitial
    : meta.layout === 'diagonal-split'
      ? `${firstInitial} / ${secondInitial}`
      : `${firstInitial} & ${secondInitial}`;
  ctx.fillText(label, 0, isSymbolic ? -radius * 0.05 : 0);

  if (isSymbolic) {
    ctx.fillStyle = accent;
    ctx.font = `600 ${Math.round(radius * 0.28)}px sans-serif`;
    ctx.fillText(secondInitial, 0, radius * 0.36);
  }
  ctx.restore();
}

export async function downloadPrintedQrCardPng(input: StationeryExportInput) {
  const { theme, custom, shareUrl, primaryName, partnerName, isBirthday } = input;
  const w = 1080;
  const h = 1520;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Background paper fill
  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, w, h);

  // Outer gold border
  ctx.strokeStyle = '#C88A2B';
  ctx.lineWidth = 6;
  ctx.strokeRect(42, 42, w - 84, h - 84);
  ctx.lineWidth = 2;
  ctx.strokeRect(60, 60, w - 120, h - 120);

  // Header mantra
  ctx.fillStyle = '#9E2A2B';
  ctx.textAlign = 'center';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isBirthday ? 'SHUBH JANMOTSAV · NIMANTRAN' : '॥ SHRI GANESHAYA NAMAH · NIMANTRAN ॥',
    w / 2,
    132
  );

  // Template cover medallion (inbuilt template artwork)
  const coverImg = await loadImage(theme.image);
  if (coverImg) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(w / 2 - 220, 175, 440, 320, [220, 220, 24, 24]);
    ctx.clip();
    const scale = Math.max(440 / coverImg.width, 320 / coverImg.height);
    const dw = coverImg.width * scale;
    const dh = coverImg.height * scale;
    ctx.drawImage(coverImg, w / 2 - dw / 2, 175 + (320 - dh) / 2, dw, dh);
    ctx.restore();
    ctx.strokeStyle = '#C88A2B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(w / 2 - 220, 175, 440, 320, [220, 220, 24, 24]);
    ctx.stroke();
  }

  // Template-specific Monogram Crest
  const meta = getMonogramMeta(theme.id);
  const firstInitial = (primaryName[0] || 'A').toUpperCase();
  const secondInitial = isBirthday ? '★' : (partnerName[0] || 'M').toUpperCase();
  drawTemplateMonogramOnCanvas(ctx, w / 2, 545, 52, meta, firstInitial, secondInitial, false);

  // Heading Names
  ctx.fillStyle = '#2A1316';
  ctx.font = '600 72px "Cormorant Garamond", Georgia, serif';
  const titleLine = isBirthday ? primaryName : `${primaryName} & ${partnerName}`;
  ctx.fillText(titleLine, w / 2, 680);

  // Theme & Date & Venue
  ctx.fillStyle = '#9E2A2B';
  ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(theme.name.toUpperCase(), w / 2, 738);

  ctx.fillStyle = '#3B2C22';
  ctx.font = '500 34px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(custom.dateLabel, w / 2, 810);

  ctx.fillStyle = '#5C4B3D';
  ctx.font = '400 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${custom.venueName} · ${custom.cityLabel}`, w / 2, 858);

  // Blessing line
  ctx.fillStyle = '#6D5A49';
  ctx.font = 'italic 26px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(custom.parentsBlessingEn.slice(0, 72), w / 2, 922);

  // Scannable QR Box
  const qrDataUrl = await generateInviteQrDataUrl(shareUrl, '#2A1316', '#FFFFFF');
  const qrImg = await loadImage(qrDataUrl);
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#C88A2B';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.roundRect(w / 2 - 175, 975, 350, 350, 24);
  ctx.fill();
  ctx.stroke();

  if (qrImg) {
    ctx.drawImage(qrImg, w / 2 - 145, 1005, 290, 290);
  }

  ctx.fillStyle = '#2A1316';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SCAN FOR FULL INTERACTIVE INVITE & RSVP', w / 2, 1378);

  ctx.fillStyle = '#9E2A2B';
  ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`invitationcards.site/${theme.slug}`, w / 2, 1418);

  const safeSlug = theme.slug.replace('invites/', '');
  triggerCanvasDownload(canvas, `nimantran-${safeSlug}-qr-invite.png`);
}

export async function downloadSaveTheDatePng(input: StationeryExportInput) {
  const { theme, custom, primaryName, partnerName, isBirthday } = input;
  const w = 1080;
  const h = 1350;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#181113';
  ctx.fillRect(0, 0, w, h);

  const bgImg = await loadImage(theme.image);
  if (bgImg) {
    ctx.save();
    ctx.globalAlpha = 0.42;
    const scale = Math.max(w / bgImg.width, h / bgImg.height);
    const dw = bgImg.width * scale;
    const dh = bgImg.height * scale;
    ctx.drawImage(bgImg, (w - dw) / 2, (h - dh) / 2, dw, dh);
    ctx.restore();
  }

  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(18, 12, 14, 0.52)');
  grad.addColorStop(0.5, 'rgba(18, 12, 14, 0.34)');
  grad.addColorStop(1, 'rgba(18, 12, 14, 0.92)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = 'rgba(230, 184, 106, 0.72)';
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, w - 96, h - 96);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#F5D68A';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('SAVE THE DATE', w / 2, 150);

  ctx.fillStyle = '#FAF6EE';
  ctx.font = '600 92px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(isBirthday ? primaryName : `${primaryName} & ${partnerName}`, w / 2, 760);

  ctx.fillStyle = '#F5D68A';
  ctx.font = '600 42px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(custom.dateLabel, w / 2, 860);

  ctx.fillStyle = '#E6D6BC';
  ctx.font = '400 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${custom.venueName} · ${custom.cityLabel}`, w / 2, 920);

  ctx.fillStyle = '#C8B493';
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Formal Invitation at invitationcards.site/${theme.slug}`, w / 2, 1230);

  const safeSlug = theme.slug.replace('invites/', '');
  triggerCanvasDownload(canvas, `nimantran-${safeSlug}-save-the-date.png`);
}

export async function downloadWelcomeBoardPng(input: StationeryExportInput) {
  const { theme, custom, shareUrl, primaryName, partnerName, isBirthday } = input;
  const w = 1200;
  const h = 1600;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = theme.accentHex || '#9E2A2B';
  ctx.lineWidth = 10;
  ctx.strokeRect(44, 44, w - 88, h - 88);
  ctx.strokeStyle = '#C88A2B';
  ctx.lineWidth = 3;
  ctx.strokeRect(66, 66, w - 132, h - 132);

  ctx.textAlign = 'center';
  ctx.fillStyle = theme.accentHex || '#9E2A2B';
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    isBirthday ? 'WELCOME TO THE CELEBRATION OF' : 'PADHARO · WELCOME TO THE WEDDING OF',
    w / 2,
    190
  );

  ctx.fillStyle = '#2A1316';
  ctx.font = '600 96px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(isBirthday ? primaryName : `${primaryName} & ${partnerName}`, w / 2, 330);

  ctx.fillStyle = '#5C4B3D';
  ctx.font = '500 38px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`${custom.dateLabel} · ${custom.cityLabel}`, w / 2, 410);

  const heroImg = await loadImage(theme.image);
  if (heroImg) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(170, 480, w - 340, 620, [320, 320, 28, 28]);
    ctx.clip();
    const scale = Math.max((w - 340) / heroImg.width, 620 / heroImg.height);
    const dw = heroImg.width * scale;
    const dh = heroImg.height * scale;
    ctx.drawImage(heroImg, w / 2 - dw / 2, 480 + (620 - dh) / 2, dw, dh);
    ctx.restore();
    ctx.strokeStyle = '#C88A2B';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(170, 480, w - 340, 620, [320, 320, 28, 28]);
    ctx.stroke();
  }

  const qrDataUrl = await generateInviteQrDataUrl(shareUrl, '#2A1316', '#FFFFFF');
  const qrImg = await loadImage(qrDataUrl);
  if (qrImg) {
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.roundRect(w / 2 - 125, 1170, 250, 250, 20);
    ctx.fill();
    ctx.strokeStyle = '#C88A2B';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.drawImage(qrImg, w / 2 - 105, 1190, 210, 210);
  }

  ctx.fillStyle = '#2A1316';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Scan for Live Schedule & Map · invitationcards.site/${theme.slug}`, w / 2, 1480);

  const safeSlug = theme.slug.replace('invites/', '');
  triggerCanvasDownload(canvas, `nimantran-${safeSlug}-welcome-board.png`);
}

export async function downloadMonogramPng(input: StationeryExportInput) {
  const { theme, custom, primaryName, partnerName, isBirthday } = input;
  const meta = getMonogramMeta(theme.id);
  const w = 1024;
  const h = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Cotton ivory fine-paper background
  ctx.fillStyle = '#FAF6EE';
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = meta.lightAccent;
  ctx.lineWidth = 4;
  ctx.strokeRect(48, 48, w - 96, h - 96);
  ctx.strokeStyle = meta.lightStroke;
  ctx.lineWidth = 1.5;
  ctx.strokeRect(66, 66, w - 132, h - 132);

  // Template-bespoke crest artwork + initials centered
  const firstInitial = (primaryName[0] || 'A').toUpperCase();
  const secondInitial = isBirthday ? '★' : (partnerName[0] || 'M').toUpperCase();
  drawTemplateMonogramOnCanvas(ctx, w / 2, 430, 225, meta, firstInitial, secondInitial, false);

  // Couple Name & Style Caption below crest
  ctx.textAlign = 'center';
  ctx.fillStyle = meta.lightStroke;
  ctx.font = `600 56px ${meta.canvasFont}`;
  ctx.fillText(isBirthday ? primaryName : `${primaryName} & ${partnerName}`, w / 2, 765);

  ctx.fillStyle = '#5C4B3D';
  ctx.font = '500 26px "Cormorant Garamond", Georgia, serif';
  ctx.fillText(`${custom.dateLabel} · ${custom.cityLabel}`, w / 2, 825);

  ctx.fillStyle = meta.lightAccent;
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${meta.styleName.toUpperCase()} · NIMANTRAN`, w / 2, 888);

  const safeSlug = theme.slug.replace('invites/', '');
  triggerCanvasDownload(canvas, `nimantran-${safeSlug}-monogram.png`);
}
