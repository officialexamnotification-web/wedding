import QRCode from 'qrcode';

export async function generateQrDataUrl(
  text: string,
  color: string = '#000000',
  backgroundColor: string = '#ffffff'
): Promise<string> {
  try {
    const dataUrl = await QRCode.toDataURL(text || 'https://maps.google.com', {
      width: 400,
      margin: 1.5,
      color: {
        dark: color,
        light: backgroundColor,
      },
      errorCorrectionLevel: 'M',
    });
    return dataUrl;
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}
