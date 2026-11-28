import React, { useEffect, useId, useRef, useState } from 'react';
import { COUPLE_DEFAULTS, Language } from '../data/weddingData';

export interface JharokhaArchCardProps {
  lang: Language;
  cleanGroom: string;
  cleanBride: string;
  groomHi: string;
  brideHi: string;
  cityDisplay: string;
  venueDisplay?: string;
  compact?: boolean;
  accentHex?: string;
  goldHex?: string;
  inkHex?: string;
  fillTopHex?: string;
  fillBottomHex?: string;
  paperHex?: string;
  isDark?: boolean;
  scriptClass?: string;
  parentsLineCustom?: string;
  groomParentsCustomEn?: string;
  groomParentsCustomHi?: string;
  brideParentsCustomEn?: string;
  brideParentsCustomHi?: string;
  isBrideFirst?: boolean;
  dateLabelCustom?: string;
  isBirthday?: boolean;
  themeId?: string;
  hasCustom?: boolean;
}

function extractLastWordSurname(parentsLine: string, fallback: string): string {
  const cleaned = parentsLine
    .replace(/[.,&|]/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const last = cleaned[cleaned.length - 1];
  if (!last || last.length < 2) return fallback;
  return last.charAt(0).toUpperCase() + last.slice(1).toLowerCase();
}

function formatFullCoupleNameEn(firstName: string, parentsEn: string, defaultSurname: string): string {
  const trimmed = firstName.trim();
  if (!trimmed) return '';
  if (trimmed.includes(' ')) return trimmed;
  const surname = parentsEn.trim() ? extractLastWordSurname(parentsEn, defaultSurname) : defaultSurname;
  return surname ? `${trimmed} ${surname}` : trimmed;
}

function formatFullCoupleNameHi(firstNameHi: string, parentsHi: string, defaultSurnameHi: string): string {
  const trimmed = firstNameHi.trim();
  if (!trimmed) return '';
  if (trimmed.includes(' ')) return trimmed;
  const tokens = parentsHi.trim().split(/\s+/).filter(Boolean);
  const last = tokens[tokens.length - 1] || defaultSurnameHi;
  return last && last !== trimmed ? `${trimmed} ${last}` : trimmed;
}

function normalizeFormalParentsLines(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return '';
  if (trimmed.includes('\n')) return trimmed;
  const ampSplit = trimmed.split(/\s*&\s*/);
  if (ampSplit.length === 2) {
    return `${ampSplit[0].trim()} &\n${ampSplit[1].trim()}`;
  }
  return trimmed;
}

function getSacredInvocationForTheme(themeId: string | undefined, lang: Language, isBirthday: boolean): string {
  if (isBirthday) {
    return lang === 'en' ? '✦ Shubh Janmotsav Nimantran ✦' : '॥ श्री गणेशाय नमः · शुभ जन्मोत्सवः ॥';
  }
  if (themeId === 'mehr') {
    return lang === 'en'
      ? 'بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ'
      : '॥ बिस्मिल्लाहिर रहमानिर रहीम ॥';
  }
  if (themeId === 'kalgi') {
    return lang === 'en' ? 'ੴ ਸਤਿ ਨਾਮੁ · आनंद कारज' : '॥ ੴ सति नामु · आनंद कारज ॥';
  }
  if (themeId === 'vrindavan') {
    return '॥ श्री कृष्णः शरणं मम ॥';
  }
  if (themeId === 'paithani') {
    return '॥ श्री गणेशाय नमः · शुभमंगल सावधान ॥';
  }
  if (themeId === 'temple' || themeId === 'pattu-zari') {
    return '॥ श्री गणेशाय नमः · शुभ मुहूर्तम् ॥';
  }
  return '॥ श्री गणेशाय नमः ॥';
}

export const JharokhaArchCard: React.FC<JharokhaArchCardProps> = ({
  lang,
  cleanGroom,
  cleanBride,
  groomHi,
  brideHi,
  cityDisplay,
  venueDisplay,
  compact = false,
  accentHex = '#9E2A2B',
  goldHex = '#C89D42',
  inkHex = '#3E2C1E',
  fillTopHex = '#FCF7EB',
  fillBottomHex = '#F1E4C9',
  paperHex,
  isDark = false,
  scriptClass = 'font-script',
  parentsLineCustom,
  groomParentsCustomEn,
  groomParentsCustomHi,
  brideParentsCustomEn,
  brideParentsCustomHi,
  isBrideFirst = false,
  dateLabelCustom,
  isBirthday = false,
  themeId,
  hasCustom = false,
}) => {
  const uid = useId().replace(/:/g, '');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [svgH, setSvgH] = useState<number>(640);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        const proportionalH = Math.round((rect.height / rect.width) * 380);
        setSvgH(Math.max(540, Math.min(980, proportionalH)));
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [lang, cleanGroom, cleanBride, groomParentsCustomEn, brideParentsCustomEn, isBrideFirst, compact]);

  const groomParentsEn = normalizeFormalParentsLines(
    hasCustom
      ? groomParentsCustomEn?.trim() || groomParentsCustomHi?.trim() || ''
      : groomParentsCustomEn?.trim() || groomParentsCustomHi?.trim() || COUPLE_DEFAULTS.groomParents.en
  );
  const groomParentsHi = hasCustom
    ? groomParentsCustomHi?.trim() || groomParentsCustomEn?.trim() || ''
    : groomParentsCustomHi?.trim() || groomParentsCustomEn?.trim() || COUPLE_DEFAULTS.groomParents.hi;
  const brideParentsEn = normalizeFormalParentsLines(
    hasCustom
      ? brideParentsCustomEn?.trim() || brideParentsCustomHi?.trim() || ''
      : brideParentsCustomEn?.trim() || brideParentsCustomHi?.trim() || COUPLE_DEFAULTS.brideParents.en
  );
  const brideParentsHi = hasCustom
    ? brideParentsCustomHi?.trim() || brideParentsCustomEn?.trim() || ''
    : brideParentsCustomHi?.trim() || brideParentsCustomEn?.trim() || COUPLE_DEFAULTS.brideParents.hi;

  const groomFullEn = formatFullCoupleNameEn(cleanGroom, groomParentsEn, hasCustom ? '' : 'Singhania');
  const brideFullEn = formatFullCoupleNameEn(cleanBride, brideParentsEn, hasCustom ? '' : 'Rathore');
  const groomFullHi = formatFullCoupleNameHi(groomHi, groomParentsHi, hasCustom ? '' : 'सिंघानिया');
  const brideFullHi = formatFullCoupleNameHi(brideHi, brideParentsHi, hasCustom ? '' : 'राठौड़');

  const firstPersonEn = isBrideFirst ? brideFullEn : groomFullEn;
  const secondPersonEn = isBrideFirst ? groomFullEn : brideFullEn;
  const firstPersonHi = isBrideFirst ? brideFullHi : groomFullHi;
  const secondPersonHi = isBrideFirst ? groomFullHi : brideFullHi;

  const firstLineageLabel = isBirthday
    ? lang === 'en'
      ? 'PROUD PARENTS · HOSTED BY'
      : 'माता-पिता · निवेदक'
    : isBrideFirst
      ? lang === 'en'
        ? 'DAUGHTER OF'
        : 'सुपुत्री'
      : lang === 'en'
        ? 'SON OF'
        : 'सुपुत्र';

  const secondLineageLabel = isBrideFirst
    ? lang === 'en'
      ? 'SON OF'
      : 'सुपुत्र'
    : lang === 'en'
      ? 'DAUGHTER OF'
      : 'सुपुत्री';

  const firstParentsText = isBrideFirst
    ? lang === 'en'
      ? brideParentsEn
      : brideParentsHi
    : lang === 'en'
      ? groomParentsEn
      : groomParentsHi;

  const secondParentsText = isBrideFirst
    ? lang === 'en'
      ? groomParentsEn
      : groomParentsHi
    : lang === 'en'
      ? brideParentsEn
      : brideParentsHi;

  const firstInitial = ((isBrideFirst ? cleanBride : cleanGroom)[0] || 'A').toUpperCase();
  const secondInitial = isBirthday
    ? '★'
    : ((isBrideFirst ? cleanGroom : cleanBride)[0] || 'N').toUpperCase();

  const bottomY = svgH - 18;
  const innerBottomY = svgH - 24;

  // 9-Cusp Scalloped Mughal Jharokha Arch Path in 380x(svgH) coordinate space (true 1:1 aspect ratio)
  const mainArchPath = `
    M 28 ${bottomY}
    L 28 210
    C 18 198, 22 176, 44 174
    C 40 148, 56 132, 80 134
    C 78 108, 98 94, 122 98
    C 122 76, 142 64, 164 70
    C 164 50, 177 38, 190 30
    C 203 38, 216 50, 216 70
    C 238 64, 258 76, 258 98
    C 282 94, 302 108, 300 134
    C 324 132, 340 148, 336 174
    C 358 176, 362 198, 352 210
    L 352 ${bottomY}
    Z
  `;

  const resolvedDate = hasCustom
    ? dateLabelCustom?.trim() || ''
    : dateLabelCustom?.trim() ||
      (lang === 'en' ? 'Sunday, 14 February 2027' : COUPLE_DEFAULTS.weddingDates.hi);

  const venueParts = hasCustom
    ? [venueDisplay?.trim(), cityDisplay?.trim()].filter(Boolean)
    : [venueDisplay?.trim() || COUPLE_DEFAULTS.palaceName[lang], cityDisplay?.trim()].filter(Boolean);
  const resolvedVenueLine = venueParts.join(', ');

  // Per-template adaptive palette (avoiding stark generic white when fillTopHex is #FFFFFF)
  const effectiveTopHex =
    !isDark && fillTopHex.toUpperCase() === '#FFFFFF' && paperHex
      ? paperHex
      : fillTopHex;
  const matStrokeColor = isDark
    ? fillBottomHex
    : paperHex && fillTopHex.toUpperCase() !== '#FFFFFF'
      ? paperHex
      : fillBottomHex;
  const crestRingColor = isDark ? goldHex : accentHex;
  const crestTextColor = isDark ? goldHex : inkHex;
  const coupleNameColor = isDark ? goldHex : accentHex;
  const sacredHeaderColor = isDark ? goldHex : accentHex;
  const sacredInvocation = getSacredInvocationForTheme(themeId, lang, isBirthday);

  return (
    <div
      ref={containerRef}
      style={{
        background: `radial-gradient(ellipse at 50% 18%, ${effectiveTopHex} 0%, ${fillBottomHex} 100%)`,
        boxShadow: isDark
          ? `0 18px 42px -18px rgba(0, 0, 0, 0.72), 0 0 0 1px ${goldHex}66`
          : `0 18px 42px -18px rgba(42, 26, 14, 0.22), 0 0 0 1px ${goldHex}60`,
        color: inkHex,
      }}
      className="relative mx-auto w-full max-w-[368px] overflow-hidden rounded-[22px] select-none"
    >
      {/* Subtle Handmade Paper / Velvet Grain Overlay */}
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `radial-gradient(${goldHex}1C 1px, transparent 0), radial-gradient(${accentHex}14 1px, transparent 0)`,
          backgroundSize: '24px 24px',
          backgroundPosition: '0 0, 12px 12px',
        }}
        className="pointer-events-none absolute inset-0"
      />

      {/* Multi-Layered Scalloped Mughal Jharokha Arch SVG Frame (1:1 Non-Distorting Aspect Ratio) */}
      <svg
        viewBox={`0 0 380 ${svgH}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`parchmentFill-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={effectiveTopHex} />
            <stop offset="55%" stopColor={effectiveTopHex} />
            <stop offset="100%" stopColor={fillBottomHex} />
          </linearGradient>
          <linearGradient id={`goldFoil-${uid}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={goldHex} />
            <stop offset="50%" stopColor={isDark ? '#F5D68A' : accentHex} stopOpacity="0.88" />
            <stop offset="100%" stopColor={goldHex} />
          </linearGradient>
          <filter id={`archDrop-${uid}`} x="-8%" y="-4%" width="116%" height="108%">
            <feDropShadow
              dx="0"
              dy="2"
              stdDeviation="3.5"
              floodColor={isDark ? '#000000' : goldHex}
              floodOpacity={isDark ? '0.45' : '0.22'}
            />
          </filter>
        </defs>

        {/* Top Hollow Gold Lotus-Bud Finial (◊) above the Apex */}
        <path
          d="M 190 7 C 194.2 12.2, 194.2 17.8, 190 23 C 185.8 17.8, 185.8 12.2, 190 7 Z"
          fill={effectiveTopHex}
          stroke={`url(#goldFoil-${uid})`}
          strokeWidth="1.2"
        />

        {/* Layer 1: Outer Gold-Tinted Rim of the Scalloped Mat */}
        <path
          d={mainArchPath}
          fill="none"
          stroke={goldHex}
          strokeOpacity={isDark ? '0.35' : '0.42'}
          strokeWidth="15"
          strokeLinejoin="round"
          filter={`url(#archDrop-${uid})`}
        />

        {/* Layer 2: Wide Scalloped Plaster Mat Rim Adapting to Template Card Surface */}
        <path
          d={mainArchPath}
          fill="none"
          stroke={matStrokeColor}
          strokeOpacity={isDark ? '0.94' : '0.88'}
          strokeWidth="12.5"
          strokeLinejoin="round"
        />

        {/* Subtle Secondary Apex Ogee Echo Line on the Mat */}
        <path
          d="M 167 62 C 169 44, 179 33, 190 25 C 201 33, 211 44, 213 62"
          fill="none"
          stroke={goldHex}
          strokeWidth="0.85"
          opacity="0.65"
        />

        {/* Layer 3: Inner Fill + Crisp 1.3px Gold Scalloped Arch */}
        <path
          d={mainArchPath}
          fill={`url(#parchmentFill-${uid})`}
          stroke={`url(#goldFoil-${uid})`}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />

        {/* Layer 4: Inner Double-Border Vertical & Bottom Gold Hairlines */}
        <path
          d={`M 34 212 L 34 ${innerBottomY} L 346 ${innerBottomY} L 346 212`}
          fill="none"
          stroke={`url(#goldFoil-${uid})`}
          strokeWidth="0.75"
          opacity="0.68"
        />

        {/* Outer Vertical & Bottom Hairline Accent along the Mat Edge */}
        <path
          d={`M 21.5 210 L 21.5 ${bottomY + 6} L 358.5 ${bottomY + 6} L 358.5 210`}
          fill="none"
          stroke={goldHex}
          strokeWidth="0.85"
          opacity="0.52"
        />

        {/* Delicate Corner Micro-Diamonds at the Base */}
        <polygon
          points={`34,${innerBottomY - 4} 37,${innerBottomY} 34,${innerBottomY + 4} 31,${innerBottomY}`}
          fill={goldHex}
          opacity="0.65"
        />
        <polygon
          points={`346,${innerBottomY - 4} 349,${innerBottomY} 346,${innerBottomY + 4} 343,${innerBottomY}`}
          fill={goldHex}
          opacity="0.65"
        />
      </svg>

      {/* ==================== ARCH INTERIOR EDITORIAL CONTENT ==================== */}
      <div
        className={`relative z-10 flex flex-col items-center text-center ${
          compact ? 'px-9 pt-14 pb-9' : 'px-10 pt-16 pb-11'
        }`}
      >
        {/* 1. Double-Ring Circular Royal Monogram Medallion */}
        <div className="relative grid size-[72px] place-items-center">
          <svg viewBox="0 0 76 76" className="h-full w-full overflow-visible">
            <circle
              cx="38"
              cy="38"
              r="34"
              fill={effectiveTopHex}
              fillOpacity="0.86"
              stroke={crestRingColor}
              strokeWidth="1.35"
            />
            <circle
              cx="38"
              cy="38"
              r="30.8"
              fill="none"
              stroke={goldHex}
              strokeWidth="0.75"
              strokeOpacity="0.82"
            />
            {isBirthday ? (
              <text
                x="38"
                y="46"
                textAnchor="middle"
                fill={crestTextColor}
                className="font-display text-[26px] font-medium"
              >
                {firstInitial}
              </text>
            ) : (
              <g fill={crestTextColor} className="font-display font-medium">
                <text x="31" y="42" textAnchor="middle" fontSize="26" letterSpacing="-0.03em">
                  {firstInitial}
                </text>
                <text x="45" y="48" textAnchor="middle" fontSize="26" letterSpacing="-0.03em">
                  {secondInitial}
                </text>
              </g>
            )}
          </svg>
        </div>

        {/* 2. Sacred Invocation Adapted to Tradition & Template */}
        <p
          style={{ color: sacredHeaderColor }}
          className="mt-3.5 font-tiro text-[13.5px] tracking-[0.08em]"
        >
          {sacredInvocation}
        </p>

        {/* 3. Jeweled Meenakari Kundan Garland Divider Adapted to Template Accent & Gold */}
        <div className="mt-2 mb-3.5 flex items-center justify-center" aria-hidden="true">
          <svg viewBox="0 0 180 24" className="h-[20px] w-[154px] overflow-visible">
            {/* Tapered Gold Filigree Thread */}
            <line x1="10" y1="12" x2="170" y2="12" stroke={goldHex} strokeWidth="1.1" />
            <circle cx="10" cy="12" r="1.6" fill={goldHex} />
            <circle cx="20" cy="12" r="2.1" fill={goldHex} />
            <circle cx="160" cy="12" r="2.1" fill={goldHex} />
            <circle cx="170" cy="12" r="1.6" fill={goldHex} />

            {/* Outer Small Diamond Florets (x=36, x=144) */}
            {[36, 144].map((cx) => (
              <g key={cx} transform={`translate(${cx}, 12)`}>
                <polygon
                  points="0,-4.8 4.8,0 0,4.8 -4.8,0"
                  fill={accentHex}
                  stroke={goldHex}
                  strokeWidth="0.9"
                />
                <circle cx="0" cy="0" r="1.3" fill={goldHex} />
              </g>
            ))}

            {/* Inner Medium Diamond Florets (x=60, x=120) */}
            {[60, 120].map((cx) => (
              <g key={cx} transform={`translate(${cx}, 12)`}>
                <polygon
                  points="0,-6.5 6.5,0 0,6.5 -6.5,0"
                  fill={accentHex}
                  stroke={goldHex}
                  strokeWidth="1"
                />
                <polygon points="0,-3.2 3.2,0 0,3.2 -3.2,0" fill={goldHex} />
                <circle cx="0" cy="0" r="1.1" fill={accentHex} />
                <circle cx="0" cy="-7.8" r="1" fill={goldHex} />
                <circle cx="0" cy="7.8" r="1" fill={goldHex} />
              </g>
            ))}

            {/* Central Royal Meenakari 8-Point Diamond Medallion (x=90) */}
            <g transform="translate(90, 12)">
              <polygon
                points="0,-9.8 9.8,0 0,9.8 -9.8,0"
                fill={accentHex}
                stroke={goldHex}
                strokeWidth="1.15"
              />
              <polygon
                points="0,-6.2 6.2,0 0,6.2 -6.2,0"
                fill={goldHex}
                stroke={accentHex}
                strokeWidth="0.5"
              />
              <circle cx="0" cy="0" r="2.2" fill={accentHex} />
              <circle cx="0" cy="0" r="0.9" fill={effectiveTopHex} />
              {/* Gold Pearl Buds around Centerpiece */}
              <circle cx="0" cy="-11.2" r="1.2" fill={goldHex} />
              <circle cx="0" cy="11.2" r="1.2" fill={goldHex} />
              <circle cx="-13" cy="-3.5" r="1" fill={goldHex} />
              <circle cx="-13" cy="3.5" r="1" fill={goldHex} />
              <circle cx="13" cy="-3.5" r="1" fill={goldHex} />
              <circle cx="13" cy="3.5" r="1" fill={goldHex} />
            </g>
          </svg>
        </div>

        {/* 4. Elder Blessings Poetic Intro */}
        {parentsLineCustom?.trim() ? (
          <p
            style={{ color: inkHex, opacity: isDark ? 0.88 : 0.78 }}
            className={`max-w-[270px] font-display italic leading-[1.52] ${
              compact ? 'text-[14.5px]' : 'text-[16px]'
            } ${lang === 'hi' ? 'font-tiro not-italic text-[14px]' : ''}`}
          >
            {parentsLineCustom}
          </p>
        ) : hasCustom ? null : (
          <p
            style={{ color: inkHex, opacity: isDark ? 0.88 : 0.78 }}
            className={`font-display italic leading-[1.52] ${
              compact ? 'text-[15px]' : 'text-[16.5px]'
            } ${lang === 'hi' ? 'font-tiro not-italic text-[14px] leading-[1.65]' : ''}`}
          >
            {isBirthday ? (
              lang === 'en' ? (
                <>
                  With the blessings of our elders,
                  <br />
                  you are invited to celebrate
                </>
              ) : (
                <>
                  बड़े-बुजुर्गों के शुभाशीष के साथ,
                  <br />
                  शुभ जन्मोत्सव में सादर आमंत्रण
                </>
              )
            ) : themeId === 'mehr' ? (
              lang === 'en' ? (
                <>
                  With the prayers of our elders,
                  <br />
                  you are invited to the Nikah of
                </>
              ) : (
                <>
                  बुज़ुर्गों की दुआओं और नेक तमन्नाओं के साथ,
                  <br />
                  जश्न-ए-निकाह में सादर आमंत्रण
                </>
              )
            ) : themeId === 'kalgi' ? (
              lang === 'en' ? (
                <>
                  With Waheguru’s grace &amp; elders’ blessings,
                  <br />
                  you are invited to the Anand Karaj of
                </>
              ) : (
                <>
                  वाहेगुरु जी की कृपा एवं बड़ों के आशीर्वाद से,
                  <br />
                  आनंद कारज संस्कार में सादर आमंत्रण
                </>
              )
            ) : lang === 'en' ? (
              <>
                With the blessings of our elders,
                <br />
                you are invited to the wedding of
              </>
            ) : (
              <>
                बड़े-बुजुर्गों के शुभाशीष के साथ,
                <br />
                हमारे बच्चों के शुभ विवाह में सादर आमंत्रण
              </>
            )}
          </p>
        )}

        {/* 5. First Name (Bride or Groom) + Lineage + Parents */}
        {((lang === 'en' ? firstPersonEn : firstPersonHi) || firstParentsText) && (
          <div className="mt-4 flex flex-col items-center">
            {(lang === 'en' ? firstPersonEn : firstPersonHi) && (
              <h3
                style={{ color: coupleNameColor }}
                className={`${
                  lang === 'hi'
                    ? 'font-tiro font-semibold text-[27px] leading-snug'
                    : `${scriptClass || 'font-script'} ${compact ? 'text-[34px]' : 'text-[39px]'} leading-[1.12]`
                } ${isDark ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]' : 'drop-shadow-[0_1px_0_rgba(255,255,255,0.75)]'}`}
              >
                {lang === 'en' ? firstPersonEn : firstPersonHi}
              </h3>
            )}

            {firstParentsText && (
              <>
                <p
                  style={{ color: isDark ? goldHex : inkHex, opacity: 0.72 }}
                  className="mt-2.5 font-display text-[10px] font-semibold uppercase tracking-[0.28em]"
                >
                  {firstLineageLabel}
                </p>

                <p
                  style={{ color: inkHex, opacity: 0.92 }}
                  className={`mt-1.5 whitespace-pre-line font-display font-medium uppercase tracking-[0.13em] leading-[1.65] ${
                    compact ? 'text-[12px]' : 'text-[13px]'
                  } ${lang === 'hi' ? 'font-tiro text-[13px] tracking-normal' : ''}`}
                >
                  {firstParentsText}
                </p>
              </>
            )}

            {isBirthday && secondParentsText && (
              <>
                <p
                  style={{ color: isDark ? goldHex : inkHex, opacity: 0.72 }}
                  className="mt-3.5 font-display text-[10px] font-semibold uppercase tracking-[0.22em]"
                >
                  {lang === 'en'
                    ? 'WITH BLESSINGS OF GRANDPARENTS'
                    : 'दादा-दादी / नाना-नानी के शुभाशीष सहित'}
                </p>

                <p
                  style={{ color: inkHex, opacity: 0.92 }}
                  className={`mt-1.5 whitespace-pre-line font-display font-medium uppercase tracking-[0.13em] leading-[1.65] ${
                    compact ? 'text-[12px]' : 'text-[13px]'
                  } ${lang === 'hi' ? 'font-tiro text-[13px] tracking-normal' : ''}`}
                >
                  {secondParentsText}
                </p>
              </>
            )}
          </div>
        )}

        {/* 6. Calligraphic Connector ("with" / "संग") + Second Name & Parents */}
        {!isBirthday && ((lang === 'en' ? secondPersonEn : secondPersonHi) || secondParentsText) && (
          <>
            {(lang === 'en' ? firstPersonEn : firstPersonHi) && (lang === 'en' ? secondPersonEn : secondPersonHi) && (
              <p
                style={{ color: coupleNameColor }}
                className={`my-3 ${
                  lang === 'hi'
                    ? 'font-tiro text-[16px]'
                    : `${scriptClass || 'font-script'} text-[26px] leading-none`
                }`}
              >
                {lang === 'en' ? 'with' : 'संग'}
              </p>
            )}

            <div className="flex flex-col items-center">
              {(lang === 'en' ? secondPersonEn : secondPersonHi) && (
                <h3
                  style={{ color: coupleNameColor }}
                  className={`${
                    lang === 'hi'
                      ? 'font-tiro font-semibold text-[27px] leading-snug'
                      : `${scriptClass || 'font-script'} ${compact ? 'text-[34px]' : 'text-[39px]'} leading-[1.12]`
                  } ${isDark ? 'drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]' : 'drop-shadow-[0_1px_0_rgba(255,255,255,0.75)]'}`}
                >
                  {lang === 'en' ? secondPersonEn : secondPersonHi}
                </h3>
              )}

              {secondParentsText && (
                <>
                  <p
                    style={{ color: isDark ? goldHex : inkHex, opacity: 0.72 }}
                    className="mt-2.5 font-display text-[10px] font-semibold uppercase tracking-[0.28em]"
                  >
                    {secondLineageLabel}
                  </p>

                  <p
                    style={{ color: inkHex, opacity: 0.92 }}
                    className={`mt-1.5 whitespace-pre-line font-display font-medium uppercase tracking-[0.13em] leading-[1.65] ${
                      compact ? 'text-[12px]' : 'text-[13px]'
                    } ${lang === 'hi' ? 'font-tiro text-[13px] tracking-normal' : ''}`}
                  >
                    {secondParentsText}
                  </p>
                </>
              )}
            </div>
          </>
        )}

        {/* 7. Bottom Wedding Date & Venue Footer Inside the Arch */}
        {(resolvedDate || resolvedVenueLine) && (
          <div className="mt-6 pt-1 flex flex-col items-center">
            {resolvedDate && (
              <p
                style={{ color: isDark ? goldHex : inkHex }}
                className={`font-display font-semibold tracking-[0.02em] ${
                  compact ? 'text-[15.5px]' : 'text-[17px]'
                } ${lang === 'hi' ? 'font-tiro text-[15.5px]' : ''}`}
              >
                {resolvedDate}
              </p>
            )}
            {resolvedVenueLine && (
              <p
                style={{ color: inkHex, opacity: isDark ? 0.8 : 0.72 }}
                className={`mt-1 font-display italic ${
                  compact ? 'text-[13.5px]' : 'text-[14.5px]'
                } ${lang === 'hi' ? 'font-tiro not-italic text-[13px]' : ''}`}
              >
                {resolvedVenueLine}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
