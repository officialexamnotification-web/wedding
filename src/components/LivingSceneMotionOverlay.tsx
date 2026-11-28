import React from 'react';

export type LivingMotionVariant =
  | 'marigold-toran'
  | 'mogra-chandelier'
  | 'royal-darbar'
  | 'vrindavan-bansuri'
  | 'bougainvillea-breeze'
  | 'kalgi-sarovar'
  | 'lotus-pond'
  | 'mirror-night'
  | 'mango-kovil'
  | 'pearl-chikankari';

interface LivingSceneMotionOverlayProps {
  themeId: string;
  compact?: boolean;
  showBottomDiyas?: boolean;
  intensity?: 'subtle' | 'rich';
}

export function resolveLivingVariant(themeId: string): LivingMotionVariant {
  switch (themeId) {
    case 'kohinoor':
    case 'jharokha':
    case 'shubh-aarti':
    case 'devi-kumkum':
      return 'royal-darbar';
    case 'vrindavan':
    case 'kanha-makhan':
    case 'baal-gopal':
      return 'vrindavan-bansuri';
    case 'kesariya':
    case 'mehndi-jhoola':
    case 'rangoli-utsav':
    case 'veer-balak':
    case 'nanhe-kadam':
      return 'marigold-toran';
    case 'pattu-zari':
    case 'temple':
    case 'ganesh-aashish':
      return 'mango-kovil';
    case 'paithani':
    case 'roshni':
      return 'mogra-chandelier';
    case 'mehr':
    case 'ivory':
      return 'pearl-chikankari';
    case 'kalgi':
      return 'kalgi-sarovar';
    case 'gulab':
    case 'gulab-baisa':
    case 'ladli-kanya':
    case 'confetti-garden':
      return 'bougainvillea-breeze';
    case 'sheesh-mahal':
    case 'deepotsav':
    case 'chanda-mama':
    case 'jashn-birthday':
    default:
      return 'mirror-night';
  }
}

export const LivingSceneMotionOverlay: React.FC<LivingSceneMotionOverlayProps> = React.memo(
  ({ themeId }) => {
    const variant = resolveLivingVariant(themeId);

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden select-none z-[4]"
      >
        {/* Pure Volumetric Golden God-Rays / Sunbeams / Candlelight Halo (Zero extra icons) */}
        <div
          className="absolute -inset-x-10 -top-12 h-[54%] animate-sunbeam-sweep"
          style={{
            background:
              variant === 'vrindavan-bansuri' || variant === 'mirror-night'
                ? 'radial-gradient(ellipse at 35% 15%, rgba(246, 212, 126, 0.2) 0%, rgba(230, 184, 106, 0.05) 48%, transparent 75%)'
                : variant === 'bougainvillea-breeze' || variant === 'lotus-pond'
                  ? 'linear-gradient(125deg, rgba(255, 246, 224, 0.24) 0%, rgba(255, 198, 218, 0.09) 42%, transparent 72%)'
                  : 'linear-gradient(125deg, rgba(255, 234, 172, 0.22) 0%, rgba(242, 168, 59, 0.07) 45%, transparent 74%)',
          }}
        />
      </div>
    );
  }
);
