import React from 'react';

export interface DoorwayBounds {
  /** Left edge of the left door leaf in % of image width (0–100) */
  leftPct: number;
  /** Center seam between left and right door leaves in % of image width (0–100) */
  centerPct: number;
  /** Right edge of the right door leaf in % of image width (0–100) */
  rightPct: number;
  /** Top edge of the wooden doors in % of image height (0–100) */
  topPct: number;
  /** Bottom edge of the wooden doors in % of image height (0–100) */
  bottomPct: number;
}

export interface RoyalGate3DOpeningProps {
  closedImageSrc: string;
  closedImageAlt: string;
  openImageSrc: string;
  openImageAlt?: string;
  isOpened: boolean;
  /** Accent metallic trim color for subtle inner door edge bevel */
  brassHex?: string;
  /** Wood/stone shadow tint */
  frameTintHex?: string;
  showMauliRibbon?: boolean;
  mauliColorFrom?: string;
  mauliColorTo?: string;
  /** Optional custom doorway bounds in image coordinate percentages (0–100) */
  doorBounds?: DoorwayBounds;
  /** Aspect ratio of the closed gate image so percentages map 1:1 without object-cover crop drift */
  imageAspectRatio?: string;
}

const DEFAULT_DOOR_BOUNDS: DoorwayBounds = {
  leftPct: 29.5,
  centerPct: 50.2,
  rightPct: 71.0,
  topPct: 25.5,
  bottomPct: 83.6,
};

/**
 * Image-Coordinate-Locked 3D Double-Door Swing Engine:
 * - All layers live inside an aspect-locked stage (`aspectRatio: imageAspectRatio`, `height: '100%'`, `minWidth: '100%'`)
 *   so `clip-path` and `transform-origin` percentages match the exact wooden door boundaries in each card's artwork
 *   without any `object-cover` coordinate mismatch on narrow 9:16 / 390:844 phone screens.
 * - The outer architectural surround (carved pillars, arch, lanterns, and floor) stays 100% STATIC.
 * - The FULL left door (`leftPct` -> `centerPct`) and FULL right door (`centerPct` -> `rightPct`)
 *   swing wide open (`88deg` / `-88deg`) on their outer hinges (`leftPct` and `rightPct`).
 */
export const RoyalGate3DOpening: React.FC<RoyalGate3DOpeningProps> = ({
  closedImageSrc,
  closedImageAlt,
  openImageSrc,
  openImageAlt = '',
  isOpened,
  brassHex = '#E5B966',
  frameTintHex = '#160C08',
  doorBounds = DEFAULT_DOOR_BOUNDS,
  imageAspectRatio = '896 / 1200',
}) => {
  const { leftPct, centerPct, rightPct, topPct, bottomPct } = doorBounds;
  const midYPct = ((topPct + bottomPct) / 2).toFixed(2);

  const doorwayClipPath = `polygon(${leftPct}% ${topPct}%, ${rightPct}% ${topPct}%, ${rightPct}% ${bottomPct}%, ${leftPct}% ${bottomPct}%)`;
  const leftDoorClipPath = `polygon(${leftPct}% ${topPct}%, ${centerPct}% ${topPct}%, ${centerPct}% ${bottomPct}%, ${leftPct}% ${bottomPct}%)`;
  const rightDoorClipPath = `polygon(${centerPct}% ${topPct}%, ${rightPct}% ${topPct}%, ${rightPct}% ${bottomPct}%, ${centerPct}% ${bottomPct}%)`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {/* Image-Aspect-Locked Stage so percentages align 1:1 with the gate artwork */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          height: '100%',
          aspectRatio: imageAspectRatio,
          minWidth: '100%',
        }}
      >
        {/* 1. 100% STATIC ARCHITECTURAL SURROUND (Pillars, Arch, Lanterns & Floor never move) */}
        <img
          src={closedImageSrc}
          alt={closedImageAlt}
          referrerPolicy="no-referrer"
          className="absolute inset-0 z-[5] h-full w-full block select-none"
        />

        {/* 2. DOORWAY OPENING CAVITY (Revealed Courtyard + Full-Width 3D Hinged Doors) */}
        <div
          className="absolute inset-0 z-[10] overflow-hidden"
          style={{
            clipPath: doorwayClipPath,
            perspective: '1300px',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Static Courtyard Revealed Behind the Open Doors */}
          <img
            src={openImageSrc}
            alt={openImageAlt}
            referrerPolicy="no-referrer"
            className="absolute inset-0 h-full w-full object-cover object-center select-none"
          />

          {/* Subtle Warm Inner Doorway Frame Shadow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 50% 52%, rgba(255, 236, 179, 0.22) 0%, rgba(20, 10, 7, 0.45) 100%)',
            }}
          />

          {/* ==================== FULL LEFT DOOR PANEL ==================== */}
          <div
            className="absolute inset-0 z-[15] transition-transform duration-[1100ms]"
            style={{
              clipPath: leftDoorClipPath,
              transformOrigin: `${leftPct}% ${midYPct}%`,
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transform: isOpened ? 'rotateY(88deg)' : 'rotateY(0deg)',
            }}
          >
            <img
              src={closedImageSrc}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full block select-none"
            />

            {/* Natural 3D depth shading as the left door swings inward */}
            <div
              className="absolute inset-0 transition-opacity duration-[800ms]"
              style={{
                background: `linear-gradient(to right, ${frameTintHex}75 0%, ${frameTintHex}35 55%, ${brassHex}40 100%)`,
                opacity: isOpened ? 0.9 : 0,
              }}
            />
          </div>

          {/* ==================== FULL RIGHT DOOR PANEL ==================== */}
          <div
            className="absolute inset-0 z-[15] transition-transform duration-[1100ms]"
            style={{
              clipPath: rightDoorClipPath,
              transformOrigin: `${rightPct}% ${midYPct}%`,
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              transform: isOpened ? 'rotateY(-88deg)' : 'rotateY(0deg)',
            }}
          >
            <img
              src={closedImageSrc}
              alt=""
              referrerPolicy="no-referrer"
              className="h-full w-full block select-none"
            />

            {/* Natural 3D depth shading as the right door swings inward */}
            <div
              className="absolute inset-0 transition-opacity duration-[800ms]"
              style={{
                background: `linear-gradient(to left, ${frameTintHex}75 0%, ${frameTintHex}35 55%, ${brassHex}40 100%)`,
                opacity: isOpened ? 0.9 : 0,
              }}
            />
          </div>
        </div>

        {/* Seamless closed-state sheet before tap (prevents any subpixel hairline while closed) */}
        <img
          src={closedImageSrc}
          alt=""
          referrerPolicy="no-referrer"
          className={`pointer-events-none absolute inset-0 z-[18] h-full w-full block select-none transition-opacity duration-150 ${
            isOpened ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </div>
    </div>
  );
};
