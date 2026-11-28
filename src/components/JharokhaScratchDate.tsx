import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Eye } from 'lucide-react';
import { Language } from '../data/weddingData';

interface JharokhaScratchDateProps {
  lang: Language;
  compact?: boolean;
  onScratchReveal?: () => void;
  accentHex?: string;
  goldHex?: string;
  cardBgHex?: string;
  inkHex?: string;
  isDark?: boolean;
  celebrationType?: 'wedding' | 'birthday';
  isBaby?: boolean;
  isHindu?: boolean;
  customDateLabel?: string;
  customTargetIso?: string;
  customCityLabel?: string;
  hasCustom?: boolean;
}

interface ScratchPanelConfig {
  id: 'day' | 'month' | 'year';
  label: { en: string; hi: string };
  value: { en: string; hi: string };
}

const WEDDING_PANELS: ScratchPanelConfig[] = [
  { id: 'day', label: { en: 'Day', hi: 'दिन' }, value: { en: '12', hi: '१२' } },
  { id: 'month', label: { en: 'Month', hi: 'माह' }, value: { en: 'Feb', hi: 'फ़रवरी' } },
  { id: 'year', label: { en: 'Year', hi: 'वर्ष' }, value: { en: '2027', hi: '२०२७' } },
];

const BIRTHDAY_PANELS: ScratchPanelConfig[] = [
  { id: 'day', label: { en: 'Day', hi: 'दिन' }, value: { en: '28', hi: '२८' } },
  { id: 'month', label: { en: 'Month', hi: 'माह' }, value: { en: 'Feb', hi: 'फ़रवरी' } },
  { id: 'year', label: { en: 'Year', hi: 'वर्ष' }, value: { en: '2027', hi: '२०२७' } },
];

interface FoilCanvasCardProps {
  panel: ScratchPanelConfig;
  lang: Language;
  compact?: boolean;
  isRevealed: boolean;
  onReveal: (id: 'day' | 'month' | 'year') => void;
  accentHex: string;
  goldHex: string;
  cardBgHex: string;
  mutedInkHex: string;
}

const FoilCanvasCard: React.FC<FoilCanvasCardProps> = ({
  panel,
  lang,
  compact,
  isRevealed,
  onReveal,
  accentHex,
  goldHex,
  cardBgHex,
  mutedInkHex,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const strokeCountRef = useRef(0);

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(rect.width || 96, 80);
    const h = Math.max(rect.height || 96, 80);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    // Metallic champagne-gold diagonal gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#E9CA7C');
    grad.addColorStop(0.28, '#F9E6AC');
    grad.addColorStop(0.55, '#C2933F');
    grad.addColorStop(0.82, '#EED286');
    grad.addColorStop(1, '#B8832E');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Fine brushed foil cross-hatch texture
    ctx.strokeStyle = 'rgba(255, 250, 232, 0.22)';
    ctx.lineWidth = 0.8;
    for (let i = -h; i < w + h; i += 6) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h * 0.55, h);
      ctx.stroke();
    }

    // Subtle recessed inner hairline border
    ctx.strokeStyle = 'rgba(130, 86, 22, 0.45)';
    ctx.lineWidth = 1;
    ctx.strokeRect(4, 4, w - 8, h - 8);

    // Center foil sparkle diamond + prompt
    ctx.save();
    ctx.translate(w / 2, h / 2 - 6);
    ctx.rotate(Math.PI / 4);
    ctx.fillStyle = 'rgba(255, 248, 224, 0.7)';
    ctx.fillRect(-5, -5, 10, 10);
    ctx.restore();

    ctx.fillStyle = 'rgba(67, 42, 12, 0.85)';
    ctx.font = `600 ${compact ? 9.5 : 10.5}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(lang === 'en' ? 'SCRATCH' : 'खुरचें', w / 2, h / 2 + 16);
  }, [compact, lang]);

  useEffect(() => {
    if (!isRevealed) {
      strokeCountRef.current = 0;
      paintFoil();
    }
  }, [isRevealed, paintFoil]);

  const checkScratchProgress = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    try {
      const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
      let cleared = 0;
      let total = 0;
      for (let i = 3; i < data.length; i += 16) {
        total++;
        if (data[i] < 40) cleared++;
      }
      if (total > 0 && cleared / total > 0.42) {
        onReveal(panel.id);
      }
    } catch {
      // Fallback if getImageData fails in restricted environments
    }
  }, [isRevealed, onReveal, panel.id]);

  const scratchAt = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = compact ? 22 : 26;

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, compact ? 11 : 13, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x, y };
    strokeCountRef.current += 1;
    if (strokeCountRef.current % 6 === 0) {
      checkScratchProgress();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        style={{
          backgroundColor: cardBgHex,
          borderColor: `${goldHex}BF`,
        }}
        className={`relative w-full aspect-square overflow-hidden rounded-xl border shadow-[inset_0_2px_8px_rgba(0,0,0,0.08)] flex flex-col items-center justify-center select-none ${
          compact ? 'min-h-[78px]' : 'min-h-[96px]'
        }`}
      >
        {/* Revealed Parchment Date Numeral */}
        <span
          style={{ color: mutedInkHex }}
          className="text-[9.5px] uppercase tracking-[0.16em]"
        >
          {panel.label[lang]}
        </span>
        <span
          style={{ color: accentHex }}
          className={`mt-0.5 font-display font-bold tabular-nums leading-none ${
            panel.id === 'month'
              ? compact
                ? 'text-xl'
                : 'text-2xl'
              : compact
                ? 'text-2xl'
                : 'text-3xl'
          } ${lang === 'hi' ? 'font-tiro' : ''}`}
        >
          {panel.value[lang]}
        </span>

        {/* Gold Foil Scratch Canvas */}
        <canvas
          ref={canvasRef}
          aria-label={
            lang === 'en'
              ? `Scratch foil to reveal wedding ${panel.label.en}`
              : `विवाह का ${panel.label.hi} देखने के लिए खुरचें`
          }
          onPointerDown={(e) => {
            if (isRevealed) return;
            drawingRef.current = true;
            lastPointRef.current = null;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratchAt(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!drawingRef.current || isRevealed) return;
            scratchAt(e.clientX, e.clientY);
          }}
          onPointerUp={() => {
            drawingRef.current = false;
            lastPointRef.current = null;
            checkScratchProgress();
          }}
          onPointerCancel={() => {
            drawingRef.current = false;
            lastPointRef.current = null;
          }}
          style={{ touchAction: 'none' }}
          className={`absolute inset-0 h-full w-full cursor-crosshair transition-opacity duration-500 ${
            isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        />
      </div>
    </div>
  );
};

export const JharokhaScratchDate: React.FC<JharokhaScratchDateProps> = ({
  lang,
  compact = false,
  onScratchReveal,
  accentHex = '#B3261E',
  goldHex = '#C2933F',
  cardBgHex = '#FAF0DE',
  inkHex = '#2B1B17',
  isDark = false,
  celebrationType = 'wedding',
  isBaby = false,
  isHindu = false,
  customDateLabel,
  customTargetIso,
  customCityLabel,
  hasCustom = false,
}) => {
  const panels = React.useMemo<ScratchPanelConfig[]>(() => {
    if (customTargetIso) {
      const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(customTargetIso.trim());
      const parsed = dateOnly
        ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
        : new Date(customTargetIso);
      if (!Number.isNaN(parsed.getTime())) {
        const dayStr = String(parsed.getDate());
        const monthStr = parsed.toLocaleString('en-US', { month: 'short' });
        const monthHi = parsed.toLocaleString('hi-IN', { month: 'long' });
        const yearStr = String(parsed.getFullYear());
        return [
          { id: 'day', label: { en: 'Day', hi: 'दिन' }, value: { en: dayStr, hi: dayStr } },
          { id: 'month', label: { en: 'Month', hi: 'माह' }, value: { en: monthStr, hi: monthHi } },
          { id: 'year', label: { en: 'Year', hi: 'वर्ष' }, value: { en: yearStr, hi: yearStr } },
        ];
      }
    }
    return celebrationType === 'birthday' ? BIRTHDAY_PANELS : WEDDING_PANELS;
  }, [customTargetIso, celebrationType]);
  const [revealed, setRevealed] = useState<Record<'day' | 'month' | 'year', boolean>>({
    day: false,
    month: false,
    year: false,
  });

  const allRevealed = revealed.day && revealed.month && revealed.year;
  const mutedHex = isDark ? 'rgba(243,234,219,0.72)' : '#7D635B';

  const handlePanelReveal = useCallback(
    (id: 'day' | 'month' | 'year') => {
      setRevealed((prev) => {
        if (prev[id]) return prev;
        return { ...prev, [id]: true };
      });
      onScratchReveal?.();
    },
    [onScratchReveal]
  );

  const handleRevealAll = () => {
    setRevealed({ day: true, month: true, year: true });
    onScratchReveal?.();
  };

  return (
    <div className="text-center">
      <p
        style={{ color: isDark ? goldHex : accentHex }}
        className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em]"
      >
        <Sparkles className="h-3 w-3" style={{ color: goldHex }} />
        <span>
          {celebrationType === 'birthday'
            ? isHindu
              ? lang === 'en'
                ? 'Shubh Janmotsav Date'
                : 'शुभ जन्मोत्सव तिथि'
              : isBaby
                ? lang === 'en'
                  ? 'Save 1st Birthday'
                  : 'प्रथम जन्मोत्सव तिथि'
                : lang === 'en'
                  ? 'Save The Birthday'
                  : 'जन्मदिन की शुभ तिथि'
            : lang === 'en'
              ? 'Save The Date'
              : 'शुभ विवाह तिथि'}
        </span>
      </p>
      <p
        style={{ color: inkHex }}
        className={`mt-1 font-display ${
          compact ? 'text-[17px]' : 'text-[20px]'
        } ${lang === 'hi' ? 'font-tiro' : 'italic'}`}
      >
        {allRevealed
          ? customDateLabel?.trim()
            ? customDateLabel
            : hasCustom
              ? ''
              : celebrationType === 'birthday'
                ? lang === 'en'
                  ? 'Sunday, 22 November 2026'
                  : 'रविवार, २२ नवम्बर २०२६'
                : lang === 'en'
                  ? 'Saturday, 14 November 2026'
                  : 'शनिवार, १४ नवम्बर २०२६'
          : lang === 'en'
            ? 'Scratch the gold foil to reveal the day'
            : 'शुभ तिथि देखने हेतु सुनहरी पन्नी खुरचें'}
      </p>

      <div className={`mt-3 grid grid-cols-3 ${compact ? 'gap-2' : 'gap-3'}`}>
        {panels.map((panel) => (
          <FoilCanvasCard
            key={panel.id}
            panel={panel}
            lang={lang}
            compact={compact}
            isRevealed={revealed[panel.id]}
            onReveal={handlePanelReveal}
            accentHex={isDark ? goldHex : accentHex}
            goldHex={goldHex}
            cardBgHex={cardBgHex}
            mutedInkHex={mutedHex}
          />
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center min-h-[28px]">
        {!allRevealed ? (
          <button
            type="button"
            onClick={handleRevealAll}
            style={{
              backgroundColor: cardBgHex,
              borderColor: `${goldHex}88`,
              color: inkHex,
            }}
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            <Eye className="h-3 w-3" />
            <span>{lang === 'en' ? 'Tap to reveal date' : 'तिथि खोलें'}</span>
          </button>
        ) : (
          <p
            style={{ color: isDark ? goldHex : accentHex }}
            className="text-[11px] font-medium tracking-[0.06em]"
          >
            {customCityLabel?.trim()
              ? `${celebrationType === 'birthday' ? (lang === 'en' ? 'Celebration' : 'शुभ जन्मोत्सव') : lang === 'en' ? 'Godhuli Muhurat' : 'गोधूलि मुहूर्त'} · ${customCityLabel}`
              : hasCustom
                ? ''
                : celebrationType === 'birthday'
                  ? isHindu
                    ? lang === 'en'
                      ? 'Aarti & Janmotsav · 04:30 PM · Udaipur'
                      : 'आरती व जन्मोत्सव · सायं ४:३० बजे · उदयपुर'
                    : isBaby
                      ? lang === 'en'
                        ? 'Tilak & 1st Birthday · 04:30 PM · Udaipur'
                        : 'तिलक व प्रथम जन्मोत्सव · सायं ४:३० बजे · उदयपुर'
                      : lang === 'en'
                        ? 'Candlelight Toast · 07:30 PM · Udaipur'
                        : 'संध्या उत्सव · सायं ७:३० बजे · उदयपुर'
                  : lang === 'en'
                    ? 'Godhuli Muhurat · 06:15 PM · Udaipur'
                    : 'गोधूलि मुहूर्त · सायं ६:१५ बजे · उदयपुर'}
          </p>
        )}
      </div>
    </div>
  );
};
