import QRCode from 'qrcode';

export async function generateQrDataUrl(
  text: string,
  color: string = '#000000',
  backgroundColor: string = '#ffffff'
): Promise<string> {
  try {
    const value = typeof text === 'string' ? text.trim() : '';
    if (!value) return '';

    const dataUrl = await QRCode.toDataURL(value, {
      width: 512,
      // QR readers rely on a clear four-module quiet zone around the symbol.
      margin: 4,
      color: {
        dark: hasReadableContrast(color, backgroundColor) ? color : '#111111',
        light: backgroundColor,
      },
      errorCorrectionLevel: 'Q',
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

function hasReadableContrast(foreground: string, background: string): boolean {
  const luminance = (value: string) => {
    const normalized = value.trim().replace(/^#/, '');
    if (!/^(?:[\da-f]{3}|[\da-f]{6})$/i.test(normalized)) return 0;
    const expanded = normalized.length === 3
      ? normalized.split('').map((channel) => channel + channel).join('')
      : normalized;
    const channels = [0, 2, 4].map((offset) => {
      const channel = parseInt(expanded.slice(offset, offset + 2), 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  };

  const dark = luminance(foreground);
  const light = luminance(background);
  return (Math.max(dark, light) + 0.05) / (Math.min(dark, light) + 0.05) >= 4.5;
}
