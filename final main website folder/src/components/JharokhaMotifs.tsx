import React from 'react';
import { MonogramTone, TemplateMonogram } from './TemplateMonograms';

interface CrestProps {
  groomInitial: string;
  brideInitial: string;
  themeId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  tone?: MonogramTone;
  className?: string;
}

export const JharokhaCrest: React.FC<CrestProps> = ({
  groomInitial,
  brideInitial,
  themeId = 'jharokha',
  size = 'md',
  tone = 'gold',
  className = '',
}) => (
  <TemplateMonogram
    themeId={themeId}
    groomInitial={groomInitial}
    brideInitial={brideInitial}
    size={size}
    tone={tone}
    className={className}
  />
);

export const ScallopedCardBorder: React.FC<{ color?: string }> = ({ color = '#C88A2B' }) => (
  <svg
    viewBox="0 0 400 540"
    preserveAspectRatio="none"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="pointer-events-none absolute inset-0 w-full h-full"
    aria-hidden="true"
  >
    {/* Outer rectangular foil border */}
    <rect
      x="10"
      y="10"
      width="380"
      height="520"
      rx="6"
      stroke={color}
      strokeOpacity="0.55"
      strokeWidth="1.2"
    />
    {/* Inner Mewar scalloped top arch silhouette */}
    <path
      d="M22 520V82C22 68 38 64 42 52C46 40 66 38 76 28C86 18 112 24 134 20C156 16 182 18 200 12C218 18 244 16 266 20C288 24 314 18 324 28C334 38 354 40 358 52C362 64 378 68 378 82V520H22Z"
      stroke={color}
      strokeOpacity="0.45"
      strokeWidth="1"
    />
    {/* Corner floral rosettes */}
    <circle cx="24" cy="24" r="3" fill={color} fillOpacity="0.45" />
    <circle cx="376" cy="24" r="3" fill={color} fillOpacity="0.45" />
    <circle cx="24" cy="516" r="3" fill={color} fillOpacity="0.45" />
    <circle cx="376" cy="516" r="3" fill={color} fillOpacity="0.45" />
  </svg>
);

export const MarigoldToran: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 800 110"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Hanging strings & swags */}
    <path
      d="M0 10 Q133 78 266 14 Q400 84 534 14 Q667 78 800 10"
      stroke="#1F4D2E"
      strokeWidth="3.5"
      fill="none"
    />
    <path
      d="M0 16 Q133 90 266 20 Q400 96 534 20 Q667 90 800 16"
      stroke="#D97706"
      strokeWidth="2"
      strokeDasharray="2 8"
      fill="none"
    />
    {/* Marigold blossoms along the swag */}
    {[
      [42, 30, '#EA580C'],
      [88, 46, '#F59E0B'],
      [133, 52, '#EA580C'],
      [178, 46, '#F59E0B'],
      [224, 30, '#EA580C'],
      [266, 16, '#9E2A2B'],
      [310, 32, '#F59E0B'],
      [355, 48, '#EA580C'],
      [400, 56, '#9E2A2B'],
      [445, 48, '#EA580C'],
      [490, 32, '#F59E0B'],
      [534, 16, '#9E2A2B'],
      [576, 30, '#EA580C'],
      [622, 46, '#F59E0B'],
      [667, 52, '#EA580C'],
      [712, 46, '#F59E0B'],
      [758, 30, '#EA580C'],
    ].map(([cx, cy, fill], idx) => (
      <g key={idx}>
        <circle cx={cx as number} cy={cy as number} r="10.5" fill={fill as string} />
        <circle
          cx={cx as number}
          cy={cy as number}
          r="5"
          fill="#FDE68A"
          fillOpacity="0.45"
        />
      </g>
    ))}
    {/* Center & side hanging marigold tassels */}
    {[266, 400, 534].map((x, idx) => (
      <g key={`tassel-${idx}`}>
        <line x1={x} y1={idx === 1 ? 56 : 16} x2={x} y2={idx === 1 ? 98 : 66} stroke="#1F4D2E" strokeWidth="2" />
        <circle cx={x} cy={idx === 1 ? 74 : 38} r="7" fill="#F59E0B" />
        <circle cx={x} cy={idx === 1 ? 90 : 54} r="8" fill="#EA580C" />
        <circle cx={x} cy={idx === 1 ? 102 : 68} r="5" fill="#9E2A2B" />
      </g>
    ))}
  </svg>
);

export const DiyaFlame: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative inline-flex flex-col items-center ${className}`} aria-hidden="true">
    <div className="w-6 h-6 rounded-full bg-amber-400/30 blur-md animate-diya -mb-3" />
    <svg viewBox="0 0 36 28" className="w-7 h-5" fill="none">
      {/* Flame */}
      <path
        d="M18 2C18 2 22 7.5 22 10.5C22 12.8 20.2 14.5 18 14.5C15.8 14.5 14 12.8 14 10.5C14 7.5 18 2 18 2Z"
        fill="#FBBF24"
      />
      <path
        d="M18 5.5C18 5.5 20 8.5 20 10.2C20 11.4 19.1 12.3 18 12.3C16.9 12.3 16 11.4 16 10.2C16 8.5 18 5.5 18 5.5Z"
        fill="#FEF3C7"
      />
      {/* Brass Diya bowl */}
      <path
        d="M5 16H31C29.5 21.5 24.5 25 18 25C11.5 25 6.5 21.5 5 16Z"
        fill="#B45309"
        stroke="#F59E0B"
        strokeWidth="1"
      />
    </svg>
  </div>
);
