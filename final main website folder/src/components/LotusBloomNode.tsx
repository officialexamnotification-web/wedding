import React from 'react';

interface LotusBloomNodeProps {
  /** Normalized scroll/visibility progress from 0 (bud) to 1 (full lotus bloom) */
  progress: number;
  accentHex?: string;
  goldHex?: string;
}

/**
 * Overhead Nathdwara lotus icon matching saath.studio/invites/kamal (`decor-lotus`):
 * transitions from tight closed crimson bud -> half-open lotus -> full golden-outlined 16-petal bloom
 * with subtle scale (0.86 -> 1.04) and gentle clockwise rotation (-14deg -> 0deg).
 */
export const LotusBloomNode: React.FC<LotusBloomNodeProps> = ({
  progress,
  accentHex = '#B4456A',
  goldHex = '#C2954A',
}) => {
  const p = Math.max(0, Math.min(1, progress));
  const ease = p * p * (3 - 2 * p);
  const scale = 0.86 + 0.18 * ease;
  const rot = -14 * (1 - ease);

  // Outer petals unfurl during the second half; inner petals begin opening early
  const outerSpread = Math.max(0, Math.min(1, (ease - 0.2) / 0.8));
  const innerSpread = Math.max(0, Math.min(1, ease / 0.65));

  return (
    <div
      aria-hidden="true"
      className="relative flex size-9 items-center justify-center transition-transform duration-150 will-change-transform"
      style={{
        transform: `scale(${scale.toFixed(3)}) rotate(${rot.toFixed(1)}deg)`,
        filter: 'drop-shadow(0 2px 4px rgba(38, 64, 59, 0.2))',
      }}
    >
      <svg viewBox="0 0 64 64" className="h-full w-full overflow-visible">
        {/* Soft Floating Lilypad Halo */}
        <circle
          cx="32"
          cy="32"
          r={18 + ease * 8}
          fill="#7FA67A"
          fillOpacity={0.18 + outerSpread * 0.16}
          stroke={goldHex}
          strokeWidth="0.7"
          strokeOpacity="0.4"
        />

        {/* Outer 8 Golden-Outlined Petals (unfurl radially as lotus opens) */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
          const tipOffset = 8 + outerSpread * 16;
          const petalWidth = 4.2 + outerSpread * 3.8;
          return (
            <g key={`outer-${angle}`} transform={`rotate(${angle} 32 32)`}>
              <path
                d={`M 32 32 C ${32 - petalWidth} ${32 - tipOffset * 0.55}, ${32 - petalWidth * 0.7} ${32 - tipOffset}, 32 ${32 - tipOffset - 4} C ${32 + petalWidth * 0.7} ${32 - tipOffset}, ${32 + petalWidth} ${32 - tipOffset * 0.55}, 32 32 Z`}
                fill="#F7C7D4"
                fillOpacity={0.35 + outerSpread * 0.62}
                stroke={goldHex}
                strokeWidth="0.95"
              />
            </g>
          );
        })}

        {/* Inner 8 Deep-Rose Petals */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((angle) => {
          const tipOffset = 5 + innerSpread * 12;
          const petalWidth = 3.2 + innerSpread * 2.8;
          return (
            <g key={`inner-${angle}`} transform={`rotate(${angle} 32 32)`}>
              <path
                d={`M 32 32 C ${32 - petalWidth} ${32 - tipOffset * 0.55}, ${32 - petalWidth * 0.65} ${32 - tipOffset}, 32 ${32 - tipOffset - 3} C ${32 + petalWidth * 0.65} ${32 - tipOffset}, ${32 + petalWidth} ${32 - tipOffset * 0.55}, 32 32 Z`}
                fill={accentHex}
                fillOpacity={0.78 + innerSpread * 0.2}
                stroke={goldHex}
                strokeWidth="0.85"
              />
            </g>
          );
        })}

        {/* Tight Center Bud Crown & Golden Seed Pod */}
        <circle
          cx="32"
          cy="32"
          r={4.2 + outerSpread * 2.2}
          fill="#F5D68A"
          stroke={goldHex}
          strokeWidth="1"
        />
        <circle cx="32" cy="32" r="2.1" fill={accentHex} fillOpacity={1 - outerSpread * 0.65} />
      </svg>
    </div>
  );
};

export const LilyPadWatermark: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 70"
    aria-hidden="true"
    className={`pointer-events-none select-none ${className}`}
  >
    <path
      d="M 55 34 L 94 22 C 88 10, 72 4, 54 6 C 28 8, 12 24, 14 42 C 16 58, 36 66, 62 64 C 84 62, 100 48, 98 30 L 55 34 Z"
      fill="#7FA67A"
      fillOpacity="0.22"
      stroke="#5C8558"
      strokeWidth="1.2"
      strokeOpacity="0.35"
    />
    <path
      d="M 55 34 L 22 36 M 55 34 L 36 16 M 55 34 L 40 54 M 55 34 L 74 52"
      stroke="#5C8558"
      strokeWidth="0.9"
      strokeOpacity="0.28"
    />
  </svg>
);
