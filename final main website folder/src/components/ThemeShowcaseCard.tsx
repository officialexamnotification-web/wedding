import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, Sparkles, Play, Check, SlidersHorizontal } from 'lucide-react';
import { InviteTheme } from '../data/studioData';
import { CardCustomization } from '../data/cardCustomization';
import { JharokhaCrest, ScallopedCardBorder } from './JharokhaMotifs';
import { InteractiveInvitePhoneStage } from './InteractiveInvitePhoneStage';
import { LivingSceneMotionOverlay } from './LivingSceneMotionOverlay';

interface ThemeShowcaseCardProps {
  theme: InviteTheme;
  isActive?: boolean;
  isFlipped: boolean;
  onToggleFlip: () => void;
  onLaunchPreview: (theme: InviteTheme) => void;
  onSelectThemePage?: (theme: InviteTheme) => void;
  groomName: string;
  brideName: string;
  customization?: CardCustomization;
  isCustomized?: boolean;
  onOpenCustomizer?: (theme: InviteTheme) => void;
}

interface CoverProfile {
  cardBg: string;
  backBg: string;
  inkColor: string;
  mutedColor: string;
  borderColor: string;
  ctaBg: string;
  ctaText: string;
  secondaryBg: string;
  isDark: boolean;
  borderStyle: 'scalloped' | 'double-hairline' | 'chikankari' | 'lotus-corners';
  titleFont: string;
  crestTone: 'crimson' | 'gold';
  imgRounding: string;
}

const COVER_PROFILES: Record<string, CoverProfile> = {
  jharokha: {
    cardBg: '#FAF6EE',
    backBg: '#F7F1E3',
    inkColor: '#231B15',
    mutedColor: '#6D5A49',
    borderColor: '#C88A2B',
    ctaBg: '#9E2A2B',
    ctaText: '#FAF6EE',
    secondaryBg: '#F2EAD9',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-bodoni',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  paithani: {
    cardBg: '#FBF4E4',
    backBg: '#F3E7CC',
    inkColor: '#2A102E',
    mutedColor: '#634257',
    borderColor: '#C9932A',
    ctaBg: '#5A1668',
    ctaText: '#FFF8EC',
    secondaryBg: '#EFE1C8',
    isDark: false,
    borderStyle: 'double-hairline',
    titleFont: 'font-cinzel',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[110px] rounded-b-lg',
  },
  'mehndi-jhoola': {
    cardBg: '#F9EAC6',
    backBg: '#F5E0B0',
    inkColor: '#24361F',
    mutedColor: '#566436',
    borderColor: '#F29F05',
    ctaBg: '#3F7D3A',
    ctaText: '#FFF9EC',
    secondaryBg: '#FCEBB6',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-playfair',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[110px] rounded-b-lg',
  },
  'sheesh-mahal': {
    cardBg: '#14111C',
    backBg: '#1B1626',
    inkColor: '#F3EADB',
    mutedColor: '#C4B8A5',
    borderColor: '#D9B26A',
    ctaBg: '#D9B26A',
    ctaText: '#14111C',
    secondaryBg: '#231D30',
    isDark: true,
    borderStyle: 'double-hairline',
    titleFont: 'font-italiana',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  ivory: {
    cardBg: '#F0EEE9',
    backBg: '#E9E5DD',
    inkColor: '#262838',
    mutedColor: '#5D5E6B',
    borderColor: '#B8995A',
    ctaBg: '#262838',
    ctaText: '#F0EEE9',
    secondaryBg: '#E4DFD5',
    isDark: false,
    borderStyle: 'chikankari',
    titleFont: 'font-italiana',
    crestTone: 'gold',
    imgRounding: 'rounded-sm',
  },
  deepotsav: {
    cardBg: '#11182F',
    backBg: '#17203D',
    inkColor: '#FAF0DE',
    mutedColor: '#C9C2B2',
    borderColor: '#F4B41A',
    ctaBg: '#E8891C',
    ctaText: '#11182F',
    secondaryBg: '#1F2A4D',
    isDark: true,
    borderStyle: 'double-hairline',
    titleFont: 'font-playfair',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[90px] rounded-b-lg',
  },
  roshni: {
    cardBg: '#FAF3E8',
    backBg: '#F4E8D5',
    inkColor: '#2A1215',
    mutedColor: '#693B40',
    borderColor: '#C99A42',
    ctaBg: '#8C1622',
    ctaText: '#FAF3E8',
    secondaryBg: '#F2DFC6',
    isDark: false,
    borderStyle: 'double-hairline',
    titleFont: 'font-cinzel',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  temple: {
    cardBg: '#F5E9D3',
    backBg: '#EDE0C4',
    inkColor: '#23160E',
    mutedColor: '#624834',
    borderColor: '#C88A2B',
    ctaBg: '#A62417',
    ctaText: '#FFF8EC',
    secondaryBg: '#EAD6B3',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-playfair',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[60px] rounded-b-lg',
  },
  gulab: {
    cardBg: '#FCEFF1',
    backBg: '#F7E1E6',
    inkColor: '#3A1923',
    mutedColor: '#6D4753',
    borderColor: '#C98A95',
    ctaBg: '#9D2743',
    ctaText: '#FFF8FA',
    secondaryBg: '#F4D8DF',
    isDark: false,
    borderStyle: 'lotus-corners',
    titleFont: 'font-bodoni',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[110px] rounded-b-lg',
  },
  'jashn-birthday': {
    cardBg: '#150E1E',
    backBg: '#1D1429',
    inkColor: '#F5E9D6',
    mutedColor: '#CBB8CF',
    borderColor: '#E6B86A',
    ctaBg: '#E6B86A',
    ctaText: '#150E1E',
    secondaryBg: '#261A35',
    isDark: true,
    borderStyle: 'double-hairline',
    titleFont: 'font-playfair',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  'confetti-garden': {
    cardBg: '#FFF8EE',
    backBg: '#F9ECDC',
    inkColor: '#2B1F1B',
    mutedColor: '#6C544B',
    borderColor: '#D94F3D',
    ctaBg: '#D94F3D',
    ctaText: '#FFF8EE',
    secondaryBg: '#F5DEC9',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-bodoni',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-2xl rounded-b-lg',
  },
  'nanhe-kadam': {
    cardBg: '#FFF7EC',
    backBg: '#F9ECD9',
    inkColor: '#2D1A12',
    mutedColor: '#6D4B3B',
    borderColor: '#D98A1A',
    ctaBg: '#C4452B',
    ctaText: '#FFF7EC',
    secondaryBg: '#FCE5C2',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-playfair',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  'chanda-mama': {
    cardBg: '#101935',
    backBg: '#162247',
    inkColor: '#F6EEDF',
    mutedColor: '#BFC9E3',
    borderColor: '#F2CB78',
    ctaBg: '#F2CB78',
    ctaText: '#101935',
    secondaryBg: '#1D2B54',
    isDark: true,
    borderStyle: 'double-hairline',
    titleFont: 'font-cinzel',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[120px] rounded-b-lg',
  },
  'baal-gopal': {
    cardBg: '#F6EFE0',
    backBg: '#EDE2C9',
    inkColor: '#133C3D',
    mutedColor: '#48605C',
    borderColor: '#D98A1A',
    ctaBg: '#134E4A',
    ctaText: '#FFF9ED',
    secondaryBg: '#E6DBC2',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-playfair',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  'shubh-aarti': {
    cardBg: '#3E0B12',
    backBg: '#4C1018',
    inkColor: '#FAF0DD',
    mutedColor: '#E5CBB5',
    borderColor: '#E6B86A',
    ctaBg: '#E6B86A',
    ctaText: '#3E0B12',
    secondaryBg: '#5A161F',
    isDark: true,
    borderStyle: 'double-hairline',
    titleFont: 'font-cinzel',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[110px] rounded-b-lg',
  },
  'rangoli-utsav': {
    cardBg: '#FFF8EB',
    backBg: '#FAECD4',
    inkColor: '#2E1A14',
    mutedColor: '#6D4B3B',
    borderColor: '#C83E2B',
    ctaBg: '#C83E2B',
    ctaText: '#FFF8EB',
    secondaryBg: '#F6DFC0',
    isDark: false,
    borderStyle: 'lotus-corners',
    titleFont: 'font-bodoni',
    crestTone: 'crimson',
    imgRounding: 'rounded-2xl',
  },
  'ladli-kanya': {
    cardBg: '#FDF0F2',
    backBg: '#F8DFE5',
    inkColor: '#3A1121',
    mutedColor: '#753B4E',
    borderColor: '#C99A3B',
    ctaBg: '#B82952',
    ctaText: '#FFF8FA',
    secondaryBg: '#F6D4DE',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-playfair',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  'devi-kumkum': {
    cardBg: '#460D21',
    backBg: '#57122A',
    inkColor: '#FBF0DC',
    mutedColor: '#E5C6B8',
    borderColor: '#F4B844',
    ctaBg: '#F4B844',
    ctaText: '#460D21',
    secondaryBg: '#661632',
    isDark: true,
    borderStyle: 'double-hairline',
    titleFont: 'font-cinzel',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[110px] rounded-b-lg',
  },
  'gulab-baisa': {
    cardBg: '#FFF2EE',
    backBg: '#FBE3DD',
    inkColor: '#3B1822',
    mutedColor: '#724451',
    borderColor: '#B88635',
    ctaBg: '#C7385B',
    ctaText: '#FFF8F6',
    secondaryBg: '#F7D7D0',
    isDark: false,
    borderStyle: 'lotus-corners',
    titleFont: 'font-bodoni',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[120px] rounded-b-lg',
  },
  'kanha-makhan': {
    cardBg: '#11243E',
    backBg: '#173052',
    inkColor: '#FAF1DF',
    mutedColor: '#C5D2E8',
    borderColor: '#F2B43A',
    ctaBg: '#F2B43A',
    ctaText: '#11243E',
    secondaryBg: '#1E3C66',
    isDark: true,
    borderStyle: 'double-hairline',
    titleFont: 'font-playfair',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  'veer-balak': {
    cardBg: '#FDF3E2',
    backBg: '#F7E5C8',
    inkColor: '#2D160B',
    mutedColor: '#6D4832',
    borderColor: '#C48A1E',
    ctaBg: '#C94A14',
    ctaText: '#FFF9ED',
    secondaryBg: '#F3D9B3',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-cinzel',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[125px] rounded-b-lg',
  },
  'ganesh-aashish': {
    cardBg: '#FFF7E4',
    backBg: '#F9EACE',
    inkColor: '#2D150E',
    mutedColor: '#6B4635',
    borderColor: '#BD8319',
    ctaBg: '#A8321A',
    ctaText: '#FFF9ED',
    secondaryBg: '#F4DFBC',
    isDark: false,
    borderStyle: 'lotus-corners',
    titleFont: 'font-bodoni',
    crestTone: 'crimson',
    imgRounding: 'rounded-2xl',
  },
  kohinoor: {
    cardBg: '#340912',
    backBg: '#420C18',
    inkColor: '#FAF0DD',
    mutedColor: '#E4C8A5',
    borderColor: '#E5B966',
    ctaBg: '#E5B966',
    ctaText: '#340912',
    secondaryBg: '#4F111F',
    isDark: true,
    borderStyle: 'double-hairline',
    titleFont: 'font-bodoni',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  vrindavan: {
    cardBg: '#0E1C3D',
    backBg: '#142652',
    inkColor: '#FAF5EA',
    mutedColor: '#C9D3EC',
    borderColor: '#E6BC63',
    ctaBg: '#E6BC63',
    ctaText: '#0E1C3D',
    secondaryBg: '#1B3166',
    isDark: true,
    borderStyle: 'double-hairline',
    titleFont: 'font-cinzel',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  kesariya: {
    cardBg: '#FFF3E0',
    backBg: '#FAE6C8',
    inkColor: '#2E140B',
    mutedColor: '#6D3E2B',
    borderColor: '#E08B15',
    ctaBg: '#C83E1B',
    ctaText: '#FFF8EE',
    secondaryBg: '#F9DFB8',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-playfair',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[110px] rounded-b-lg',
  },
  'pattu-zari': {
    cardBg: '#FAF4E6',
    backBg: '#F2E8D2',
    inkColor: '#16382C',
    mutedColor: '#4A6358',
    borderColor: '#C9962B',
    ctaBg: '#1C4D3B',
    ctaText: '#FAF4E6',
    secondaryBg: '#ECE1C8',
    isDark: false,
    borderStyle: 'lotus-corners',
    titleFont: 'font-italiana',
    crestTone: 'gold',
    imgRounding: 'rounded-t-2xl rounded-b-lg',
  },
  mehr: {
    cardBg: '#FAF6EE',
    backBg: '#F2EBD9',
    inkColor: '#1E2D24',
    mutedColor: '#526358',
    borderColor: '#C69C4E',
    ctaBg: '#1E3A2F',
    ctaText: '#FAF6EE',
    secondaryBg: '#EFE6D2',
    isDark: false,
    borderStyle: 'double-hairline',
    titleFont: 'font-cinzel',
    crestTone: 'gold',
    imgRounding: 'rounded-t-[135px] rounded-b-lg',
  },
  kalgi: {
    cardBg: '#FFF6E8',
    backBg: '#F8E8CE',
    inkColor: '#2D160B',
    mutedColor: '#6E452F',
    borderColor: '#C4912A',
    ctaBg: '#D65A14',
    ctaText: '#FFF9F0',
    secondaryBg: '#F6E0BF',
    isDark: false,
    borderStyle: 'scalloped',
    titleFont: 'font-playfair',
    crestTone: 'crimson',
    imgRounding: 'rounded-t-[125px] rounded-b-lg',
  },
};

const ThemeShowcaseCardInner: React.FC<ThemeShowcaseCardProps> = ({
  theme,
  isActive = true,
  isFlipped,
  onToggleFlip,
  onLaunchPreview,
  onSelectThemePage,
  groomName,
  brideName,
  customization,
  isCustomized = false,
  onOpenCustomizer,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltWrapperRef = useRef<HTMLDivElement>(null);
  const foilRef = useRef<HTMLDivElement>(null);
  const [imgError, setImgError] = useState(false);
  const [isPlayingInline, setIsPlayingInline] = useState(false);

  const profile = COVER_PROFILES[theme.id] || COVER_PROFILES.jharokha;
  const coverPhotoSrc = theme.image;

  useEffect(() => {
    setImgError(false);
  }, [coverPhotoSrc]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isActive || isPlayingInline || e.pointerType === 'touch') return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect || !tiltWrapperRef.current) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = ((0.5 - py) * 7).toFixed(2);
    const ry = ((px - 0.5) * 9).toFixed(2);
    tiltWrapperRef.current.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    if (foilRef.current) {
      foilRef.current.style.opacity = '0.46';
      foilRef.current.style.background = `radial-gradient(circle at ${Math.round(px * 100)}% ${Math.round(py * 100)}%, rgba(230, 184, 106, 0.28), transparent 58%)`;
    }
  };

  const handlePointerLeave = () => {
    if (tiltWrapperRef.current) {
      tiltWrapperRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    }
    if (foilRef.current) {
      foilRef.current.style.opacity = '0.14';
    }
  };

  const displayGroom = customization?.primaryName?.trim() || groomName;
  const displayBride = customization?.partnerName?.trim() || brideName;
  const groomInitial = (displayGroom.trim()[0] || 'A').toUpperCase();
  const brideInitial = (displayBride.trim()[0] || 'M').toUpperCase();
  const celebrantName = customization?.primaryName?.trim()
    ? customization.primaryName.trim()
    : theme.birthdayGender === 'girl'
      ? brideName
      : groomName;
  const celebrantInitial = (celebrantName.trim()[0] || (theme.birthdayGender === 'girl' ? brideInitial : groomInitial)).toUpperCase();

  const renderFrameDecoration = () => {
    if (profile.borderStyle === 'scalloped') {
      return <ScallopedCardBorder color={theme.accentHex} />;
    }
    if (profile.borderStyle === 'chikankari') {
      return (
        <div
          aria-hidden="true"
          style={{ borderColor: `${profile.borderColor}66` }}
          className="pointer-events-none absolute inset-3 rounded-[4px] border border-dashed"
        />
      );
    }
    if (profile.borderStyle === 'lotus-corners') {
      return (
        <div
          aria-hidden="true"
          style={{ borderColor: `${profile.borderColor}73` }}
          className="pointer-events-none absolute inset-2.5 rounded-lg border"
        >
          <span
            style={{ backgroundColor: theme.accentHex }}
            className="absolute -top-1 -left-1 size-2 rounded-full opacity-75"
          />
          <span
            style={{ backgroundColor: theme.accentHex }}
            className="absolute -top-1 -right-1 size-2 rounded-full opacity-75"
          />
          <span
            style={{ backgroundColor: theme.accentHex }}
            className="absolute -bottom-1 -left-1 size-2 rounded-full opacity-75"
          />
          <span
            style={{ backgroundColor: theme.accentHex }}
            className="absolute -bottom-1 -right-1 size-2 rounded-full opacity-75"
          />
        </div>
      );
    }
    return (
      <>
        <div
          aria-hidden="true"
          style={{ borderColor: `${profile.borderColor}88` }}
          className="pointer-events-none absolute inset-2.5 rounded-md border"
        />
        <div
          aria-hidden="true"
          style={{ borderColor: `${profile.borderColor}40` }}
          className="pointer-events-none absolute inset-3.5 rounded-sm border"
        />
      </>
    );
  };

  return (
    <div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full h-full perspective-1200 select-none"
    >
      {/* Lightweight CSS 3D Pointer Tilt Wrapper */}
      <div
        ref={tiltWrapperRef}
        className="relative w-full h-full preserve-3d transition-transform duration-200 ease-out"
      >
        {/* 3D Flip Wrapper (Front Artwork <-> Back Studio Inclusions) */}
        <div
          style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          className="relative w-full h-full preserve-3d transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        >
          {/* ==================== FRONT FACE ==================== */}
          <div
            onClick={() => {
              if (isActive && !isFlipped && !isPlayingInline) {
                setIsPlayingInline(true);
              }
            }}
            style={{
              backgroundColor: profile.cardBg,
              borderColor: `${profile.borderColor}88`,
              color: profile.inkColor,
            }}
            className="absolute inset-0 backface-hidden overflow-hidden rounded-xl border paper-grain shadow-[0_18px_42px_-16px_rgba(35,27,21,0.22)] flex flex-col justify-between cursor-pointer"
          >
            {isPlayingInline ? (
              <div className="relative w-full h-full">
                <InteractiveInvitePhoneStage
                  theme={theme}
                  lang="en"
                  groomName={displayGroom}
                  brideName={displayBride}
                  weddingDateLabel={customization?.dateLabel}
                  cityLabel={customization?.cityLabel}
                  compact={true}
                  customization={customization}
                  onOpenCustomizer={onOpenCustomizer ? () => onOpenCustomizer(theme) : undefined}
                  onOpenFullPreview={() => onLaunchPreview(theme)}
                  onCloseInline={() => setIsPlayingInline(false)}
                />
              </div>
            ) : (
              <div className="relative flex-1 flex flex-col justify-between p-5 sm:p-6">
                {renderFrameDecoration()}

                {/* Moving antique-gold foil specular highlight */}
                <div
                  ref={foilRef}
                  className="pointer-events-none absolute inset-0 transition-opacity duration-300"
                  style={{
                    opacity: 0.14,
                    background: 'radial-gradient(circle at 50% 35%, rgba(230, 184, 106, 0.28), transparent 58%)',
                  }}
                />

                {/* Top Unboxed Metadata Row with Crossed-Out Price -> FREE */}
                <div
                  style={{ color: profile.mutedColor }}
                  className="relative z-10 flex items-center justify-between pt-2 px-1 text-[10.5px] tracking-[0.14em] uppercase"
                >
                  <div className="flex items-center gap-1.5 tabular-nums font-medium truncate pr-2">
                    <span>{theme.indexLabel}</span>
                    <span aria-hidden="true">·</span>
                    <span className="line-through opacity-75">{theme.originalPrice}</span>
                    <span aria-hidden="true">→</span>
                    <span
                      style={{ color: profile.isDark ? '#86EFAC' : '#15803D' }}
                      className="font-bold tracking-[0.12em]"
                    >
                      FREE
                    </span>
                    {isCustomized ? <span>· Edited</span> : null}
                  </div>
                  <JharokhaCrest
                    themeId={theme.id}
                    groomInitial={
                      theme.celebrationType === 'birthday' ? celebrantInitial : groomInitial
                    }
                    brideInitial={
                      theme.birthdayFlavor === 'hindu'
                        ? 'ॐ'
                        : theme.celebrationType === 'birthday'
                          ? '★'
                          : brideInitial
                    }
                    size="sm"
                    tone={profile.crestTone}
                  />
                </div>

                {/* Theme-Specific Artwork Aperture with Continuous 2.5D Living Video Motion */}
                <div
                  style={{
                    borderColor: `${profile.borderColor}70`,
                    backgroundColor: profile.secondaryBg,
                  }}
                  className={`relative z-10 my-2.5 mx-auto w-full overflow-hidden border aspect-[4/3] ${profile.imgRounding}`}
                >
                  {!imgError ? (
                    <>
                      <img
                        src={coverPhotoSrc}
                        alt={theme.imageAlt}
                        loading={isActive ? 'eager' : 'lazy'}
                        decoding="async"
                        referrerPolicy="no-referrer"
                        onError={() => setImgError(true)}
                        className="h-full w-full object-cover animate-ken-burns-slow"
                      />
                      <LivingSceneMotionOverlay
                        themeId={theme.id}
                        compact={true}
                        showBottomDiyas={true}
                        intensity="subtle"
                      />
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                      <Sparkles style={{ color: theme.accentHex }} className="h-6 w-6" />
                      <p className="mt-2 font-display text-lg">{theme.name}</p>
                    </div>
                  )}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 via-black/25 to-transparent z-[15]" />
                  <div className="pointer-events-none absolute bottom-2.5 left-3 right-3 z-[16] flex items-center justify-between text-[#FAF6EE]">
                    <span className="text-[11px] tracking-[0.1em] uppercase opacity-95 truncate">
                      {theme.gestureLabel}
                    </span>
                    <span className="text-[10.5px] font-semibold tabular-nums text-[#FDE68A] shrink-0 ml-2">
                      <span className="line-through opacity-75 mr-1">{theme.originalPrice}</span>
                      FREE
                    </span>
                  </div>
                </div>

                {/* Theme Title & Typography Pairing */}
                <div className="relative z-10 text-center px-1">
                  <div className="flex items-baseline justify-center gap-2">
                    <h3
                      onClick={(e) => {
                        if (onSelectThemePage) {
                          e.stopPropagation();
                          onSelectThemePage(theme);
                        }
                      }}
                      style={{ color: profile.inkColor }}
                      className={`${profile.titleFont} text-2xl sm:text-3xl font-semibold leading-tight hover:underline`}
                    >
                      {theme.name}
                    </h3>
                    <span style={{ color: profile.isDark ? '#F4D58D' : theme.accentHex }} className="font-hindi text-base">
                      {theme.nameHi}
                    </span>
                  </div>
                  <p
                    style={{ color: profile.mutedColor }}
                    className="mt-1 text-xs line-clamp-2 leading-relaxed"
                  >
                    {theme.tagline}
                  </p>
                  <p
                    style={{ color: profile.borderColor }}
                    className="mt-2 text-[11px] tracking-[0.12em] uppercase truncate"
                  >
                    {theme.celebrationType === 'birthday'
                      ? theme.birthdayFlavor === 'baby'
                        ? `Baby ${celebrantName}'s ${customization?.milestoneLabel || '1st'} · ${customization?.cityLabel || theme.regionLabel}`
                        : theme.birthdayFlavor === 'hindu'
                          ? theme.birthdayGender === 'girl'
                            ? `Ladli Janmotsav · ${celebrantName}`
                            : theme.birthdayGender === 'boy'
                              ? `Balak Janmotsav · ${celebrantName}`
                              : `Shubh Janmotsav · ${celebrantName}`
                          : `Celebrating ${celebrantName} · ${customization?.cityLabel || theme.regionLabel}`
                      : `${displayGroom} & ${displayBride} · ${customization?.cityLabel || theme.regionLabel}`}
                  </p>
                </div>

                {/* Action Row: Open Card Effect Inline + Customize + Single Card Page / Details */}
                <div className="relative z-10 mt-3 flex items-center justify-center gap-1.5 pb-1">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsPlayingInline(true);
                    }}
                    style={{ backgroundColor: profile.ctaBg, color: profile.ctaText }}
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2.5 text-[11.5px] font-medium transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <Play className="h-3 w-3 fill-current" />
                    <span>Open Card</span>
                  </button>
                  {onSelectThemePage && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectThemePage(theme);
                      }}
                      style={{
                        backgroundColor: profile.secondaryBg,
                        borderColor: `${profile.borderColor}73`,
                        color: profile.inkColor,
                      }}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border px-2.5 py-2.5 text-[11.5px] font-medium transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <span>Card Page</span>
                    </button>
                  )}
                  {onOpenCustomizer && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenCustomizer(theme);
                      }}
                      aria-label={`Customize ${theme.name} card`}
                      style={{
                        backgroundColor: profile.secondaryBg,
                        borderColor: `${profile.borderColor}73`,
                        color: profile.inkColor,
                      }}
                      className="inline-flex items-center justify-center gap-1 rounded-lg border px-2.5 py-2.5 text-[11.5px] font-medium transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <SlidersHorizontal
                        style={{ color: profile.isDark ? '#F4D58D' : theme.accentHex }}
                        className="h-3 w-3"
                      />
                      <span>Edit</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFlip();
                    }}
                    aria-label={`Flip ${theme.name} card for inclusions`}
                    style={{
                      backgroundColor: profile.secondaryBg,
                      borderColor: `${profile.borderColor}73`,
                      color: profile.inkColor,
                    }}
                    className="inline-flex items-center justify-center gap-1 rounded-lg border px-2 py-2.5 text-[11.5px] font-medium transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <RotateCw
                      style={{ color: profile.isDark ? '#F4D58D' : theme.accentHex }}
                      className="h-3 w-3"
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ==================== BACK FACE ==================== */}
          <div
            style={{
              backgroundColor: profile.backBg,
              borderColor: `${profile.borderColor}88`,
              color: profile.inkColor,
            }}
            className="absolute inset-0 backface-hidden rotate-y-180 overflow-hidden rounded-xl border paper-grain shadow-[0_18px_42px_-16px_rgba(35,27,21,0.24)] flex flex-col justify-between p-6"
          >
            {renderFrameDecoration()}

            <div
              className="pointer-events-none absolute inset-0"
              style={{
                opacity: 0.12,
                background: 'radial-gradient(circle at 50% 35%, rgba(200, 138, 43, 0.22), transparent 60%)',
              }}
            />

            <div className="relative z-10 pt-2">
              <div
                style={{ color: profile.mutedColor }}
                className="flex items-center justify-between text-[11px] tracking-[0.16em] uppercase"
              >
                <span>invitationcards.site/{theme.slug}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFlip();
                  }}
                  style={{ color: profile.isDark ? '#F4D58D' : theme.accentHex }}
                  className="inline-flex items-center gap-1.5 text-xs font-medium hover:underline cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Front</span>
                </button>
              </div>

              <h3 className={`mt-3 ${profile.titleFont} text-3xl font-semibold`}>
                {theme.name}
              </h3>
              <p className="mt-1 flex items-center gap-2 text-xs font-semibold tabular-nums">
                <span style={{ color: profile.mutedColor }} className="line-through">
                  {theme.originalPrice}
                </span>
                <span style={{ color: profile.isDark ? '#86EFAC' : '#15803D' }}>
                  FREE (₹0 · 100% Free Forever)
                </span>
              </p>
              <p
                style={{ color: profile.mutedColor }}
                className="mt-2.5 text-xs sm:text-sm leading-relaxed"
              >
                {theme.description}
              </p>

              {/* Deliverables List */}
              <div
                style={{ borderColor: `${profile.borderColor}4D` }}
                className="mt-4 border-t pt-3.5 space-y-2"
              >
                {theme.deliverables.map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-xs">
                    <Check
                      style={{ color: profile.isDark ? '#F4D58D' : theme.accentHex }}
                      className="h-3.5 w-3.5 shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pb-1 pt-3 flex items-center gap-2">
              {onSelectThemePage && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectThemePage(theme);
                  }}
                  style={{
                    backgroundColor: profile.secondaryBg,
                    borderColor: `${profile.borderColor}73`,
                    color: profile.inkColor,
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2.5 text-xs font-medium transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Full Card Page</span>
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLaunchPreview(theme);
                }}
                style={{ backgroundColor: profile.ctaBg, color: profile.ctaText }}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-3.5 py-2.5 text-xs font-medium transition-opacity hover:opacity-90 cursor-pointer whitespace-nowrap shrink-0"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Play Full Card</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ThemeShowcaseCard = React.memo(ThemeShowcaseCardInner, (prev, next) => {
  return (
    prev.theme.id === next.theme.id &&
    prev.isActive === next.isActive &&
    prev.isFlipped === next.isFlipped &&
    prev.groomName === next.groomName &&
    prev.brideName === next.brideName &&
    prev.isCustomized === next.isCustomized &&
    prev.customization?.updatedAt === next.customization?.updatedAt &&
    prev.customization?.couplePhotoUrl === next.customization?.couplePhotoUrl &&
    prev.customization?.primaryName === next.customization?.primaryName &&
    prev.customization?.partnerName === next.customization?.partnerName &&
    prev.customization?.dateLabel === next.customization?.dateLabel &&
    prev.customization?.cityLabel === next.customization?.cityLabel
  );
});
