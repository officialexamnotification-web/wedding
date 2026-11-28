import React, { useEffect, useState } from 'react';
import { QrCode } from 'lucide-react';
import { generateQrDataUrl } from '../utils/qrHelper';

interface QrCodeImageProps {
  targetValue: string;
  color?: string;
  backgroundColor?: string;
  label?: string;
  className?: string;
}

/** Renders saved QR artwork or generates a real scannable QR for catalog previews. */
export function QrCodeImage({
  targetValue,
  color,
  backgroundColor,
  label = 'QR code',
  className = 'w-full h-full object-contain',
}: QrCodeImageProps) {
  const [generatedUrl, setGeneratedUrl] = useState('');

  useEffect(() => {
    let cancelled = false;
    setGeneratedUrl('');
    generateQrDataUrl(targetValue, color, backgroundColor).then((url) => {
      if (!cancelled) setGeneratedUrl(url);
    });
    return () => { cancelled = true; };
  }, [targetValue, color, backgroundColor]);

  if (!generatedUrl) {
    return (
      <span
        className="flex h-full w-full items-center justify-center"
        style={{ backgroundColor: backgroundColor || '#FFF4D6', color: color || '#111111' }}
        aria-label={`Preparing ${label}`}
      >
        <QrCode className="h-2/3 w-2/3 opacity-70" aria-hidden="true" />
      </span>
    );
  }

  return (
    <img
      src={generatedUrl}
      alt={label}
      className={className}
      draggable={false}
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
