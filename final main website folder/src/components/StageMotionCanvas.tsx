import React, { useEffect, useRef } from 'react';

export type StageMotionMode =
  | 'akshata-cloth'
  | 'diya-sparks'
  | 'water-lotus'
  | 'marigold-shower'
  | 'rose-petals'
  | 'mirror-glints'
  | 'confetti-wish';

interface StageMotionCanvasProps {
  themeId?: string;
  mode: StageMotionMode;
  isOpened: boolean;
  bodyOpen: boolean;
  rippleCoords?: { x: number; y: number } | null;
}

type ParticleShape =
  | 'ember-up'          // 01 jharokha: rising diya embers with tail
  | 'lotus-glide'       // 02 kamal: horizontal floating lotus petals on water
  | 'peacock-eye'       // 03 pichwai: sacred mor-chandraka peacock eye + gold aura
  | 'gold-foil-flake'   // 04 ivory: polygonal gold-leaf flakes
  | 'mirror-prism'      // 05 sheesh-mahal: stationary 8-point thikri mirror flash
  | 'floating-diya'     // 06 deepotsav: miniature clay diya lamp drifting on river
  | 'genda-pompom'      // 07 mehndi-jhoola: ruffled marigold flower head + haldi puff
  | 'mogra-bud'         // 08 roshni: paired white jasmine bud with green calyx
  | 'mango-bell-wave'   // 09 temple: mango leaf + expanding temple bell soundwave
  | 'damask-rose'       // 10 gulab: heart-notched damask rose petal in wind
  | 'champagne-bubble'  // 11 jashn-birthday: rising pearlescent bubbles + spiral ribbon
  | 'paper-triangle'    // 12 confetti-garden: crisp geometric triangles & serpentine
  | 'baby-footprint'    // 13 nanhe-kadam: tiny golden baby footprints + pastel star
  | 'crescent-moon'     // 14 chanda-mama: crescent moons + twinkling 5-pt stars
  | 'mor-pankh-note'    // 15 baal-gopal: peacock feather + bansuri musical note
  | 'aarti-orbit'       // 16 shubh-aarti: clockwise circular panch-aarti flame orbit
  | 'rangoli-rosette'   // 17 rangoli-utsav: spinning 8-petal rangoli mandala flower
  | 'payal-ghungroo'    // 18 ladli-kanya: silver ghungroo bell bead + pink lotus
  | 'kumkum-gajra'      // 19 devi-kumkum: vermilion kumkum aura + mogra ring
  | 'pearl-latkan'      // 20 gulab-baisa: ruby-pearl latkan drop + jaipur rose
  | 'mishri-crystal'    // 21 kanha-makhan: crystalline rock-sugar cube + butter drop
  | 'surya-emblem'      // 22 veer-balak: 12-ray golden sun emblem + kesari flag
  | 'durva-modak'       // 23 ganesh-aashish: 3-blade durva grass + golden modak
  | 'akshata-zari'      // 24 paithani: haldi-white rice grain + zari diamond butti
  | 'kohinoor-gem'      // 25 kohinoor: faceted diamond gem with cross flare
  | 'parijat-firefly'   // 26 vrindavan: 5-petal white parijat with orange stem + firefly
  | 'bandhani-knot'     // 27 kesariya: tie-dye bandhani square knot with white center
  | 'kolam-zari'        // 28 pattu-zari: geometric white kolam star-knot + temple triangle
  | 'moti-pearl'        // 29 mehr: 3D shaded ivory pearl with specular highlight
  | 'kalgi-plume'       // 30 kalgi: emerald-gold sarpech plume + sarovar water bar
  | 'bougainvillea';    // 3-bract magenta bougainvillea + olive leaf

interface ThemeMotionProfile {
  shape: ParticleShape;
  colors: string[];
  secondaryColors: string[];
  motionStyle:
    | 'rise'
    | 'glide-horizontal'
    | 'stationary-twinkle'
    | 'circular-orbit'
    | 'breeze-diagonal'
    | 'gentle-fall'
    | 'float-hover';
  ambientCount: number;
  burstCount: number;
  stage2Count: number;
  hasWaterRipples?: boolean;
  hasSoundWaves?: boolean;
}

const THEME_PROFILES: Record<string, ThemeMotionProfile> = {
  jharokha: {
    shape: 'ember-up',
    colors: ['#FDE68A', '#F59E0B', '#FBBF24', '#FFFBEB'],
    secondaryColors: ['#E8891C', '#FDE68A'],
    motionStyle: 'rise',
    ambientCount: 10,
    burstCount: 34,
    stage2Count: 10,
  },
  ivory: {
    shape: 'gold-foil-flake',
    colors: ['#D4AF37', '#F3E5AB', '#C5A059', '#FFFDF5'],
    secondaryColors: ['#A8916B', '#E6D7B8'],
    motionStyle: 'breeze-diagonal',
    ambientCount: 14,
    burstCount: 36,
    stage2Count: 11,
  },
  'sheesh-mahal': {
    shape: 'mirror-prism',
    colors: ['#FFFBEB', '#FDE68A', '#E2BC72', '#FFFFFF'],
    secondaryColors: ['#F59E0B', '#FEF3C7'],
    motionStyle: 'stationary-twinkle',
    ambientCount: 20,
    burstCount: 44,
    stage2Count: 16,
  },
  deepotsav: {
    shape: 'floating-diya',
    colors: ['#F59E0B', '#FBBF24', '#FEF08A', '#EA580C'],
    secondaryColors: ['#9A3412', '#FDE68A'],
    motionStyle: 'glide-horizontal',
    ambientCount: 10,
    burstCount: 26,
    stage2Count: 9,
  },
  'mehndi-jhoola': {
    shape: 'genda-pompom',
    colors: ['#F59E0B', '#EA580C', '#FACC15', '#FB923C'],
    secondaryColors: ['#3F7D3A', '#FEF08A'],
    motionStyle: 'gentle-fall',
    ambientCount: 13,
    burstCount: 38,
    stage2Count: 11,
  },
  roshni: {
    shape: 'mogra-bud',
    colors: ['#FFFDF9', '#F8F1E1', '#FEFCE8', '#FFFFFF'],
    secondaryColors: ['#4D7C0F', '#C99A42'],
    motionStyle: 'gentle-fall',
    ambientCount: 14,
    burstCount: 38,
    stage2Count: 12,
  },
  temple: {
    shape: 'mango-bell-wave',
    colors: ['#15803D', '#166534', '#F5D68A', '#D97706'],
    secondaryColors: ['#DC2626', '#FBBF24'],
    motionStyle: 'float-hover',
    ambientCount: 11,
    burstCount: 30,
    stage2Count: 10,
    hasSoundWaves: true,
  },
  gulab: {
    shape: 'damask-rose',
    colors: ['#BE123C', '#E11D48', '#FB7185', '#FDA4AF'],
    secondaryColors: ['#FFE4E6', '#9D2743'],
    motionStyle: 'breeze-diagonal',
    ambientCount: 14,
    burstCount: 40,
    stage2Count: 12,
  },
  'jashn-birthday': {
    shape: 'champagne-bubble',
    colors: ['#FDE68A', '#FFFBEB', '#E6B86A', '#F3E8FF'],
    secondaryColors: ['#F472B6', '#C084FC'],
    motionStyle: 'rise',
    ambientCount: 16,
    burstCount: 44,
    stage2Count: 14,
  },
  'confetti-garden': {
    shape: 'paper-triangle',
    colors: ['#D94F3D', '#2563EB', '#16A34A', '#F59E0B', '#EC4899'],
    secondaryColors: ['#FACC15', '#14B8A6'],
    motionStyle: 'gentle-fall',
    ambientCount: 16,
    burstCount: 48,
    stage2Count: 13,
  },
  'nanhe-kadam': {
    shape: 'baby-footprint',
    colors: ['#D98A1A', '#C4452B', '#F59E0B', '#FB7185'],
    secondaryColors: ['#FDE68A', '#38BDF8'],
    motionStyle: 'float-hover',
    ambientCount: 11,
    burstCount: 30,
    stage2Count: 10,
  },
  'chanda-mama': {
    shape: 'crescent-moon',
    colors: ['#FDE68A', '#FEF08A', '#BAE6FD', '#FFFBEB'],
    secondaryColors: ['#93C5FD', '#F2CB78'],
    motionStyle: 'stationary-twinkle',
    ambientCount: 18,
    burstCount: 40,
    stage2Count: 14,
  },
  'baal-gopal': {
    shape: 'mor-pankh-note',
    colors: ['#0D9488', '#0284C7', '#F59E0B', '#10B981'],
    secondaryColors: ['#FDE68A', '#1E3A8A'],
    motionStyle: 'breeze-diagonal',
    ambientCount: 12,
    burstCount: 34,
    stage2Count: 10,
  },
  'shubh-aarti': {
    shape: 'aarti-orbit',
    colors: ['#FBBF24', '#F59E0B', '#FEF08A', '#EF4444'],
    secondaryColors: ['#FFFBEB', '#EA580C'],
    motionStyle: 'circular-orbit',
    ambientCount: 16,
    burstCount: 40,
    stage2Count: 14,
  },
  'rangoli-utsav': {
    shape: 'rangoli-rosette',
    colors: ['#EA580C', '#E11D48', '#FACC15', '#16A34A'],
    secondaryColors: ['#FFFBEB', '#F97316'],
    motionStyle: 'float-hover',
    ambientCount: 12,
    burstCount: 32,
    stage2Count: 10,
  },
  'ladli-kanya': {
    shape: 'payal-ghungroo',
    colors: ['#F472B6', '#FB7185', '#E2E8F0', '#F8FAFC'],
    secondaryColors: ['#F5D68A', '#BE185D'],
    motionStyle: 'gentle-fall',
    ambientCount: 13,
    burstCount: 36,
    stage2Count: 11,
    hasSoundWaves: true,
  },
  'devi-kumkum': {
    shape: 'kumkum-gajra',
    colors: ['#DC2626', '#FACC15', '#FFFDF9', '#F59E0B'],
    secondaryColors: ['#FECACA', '#FEF08A'],
    motionStyle: 'rise',
    ambientCount: 15,
    burstCount: 38,
    stage2Count: 12,
  },
  'gulab-baisa': {
    shape: 'pearl-latkan',
    colors: ['#FFF1F2', '#FB7185', '#E11D48', '#FDE68A'],
    secondaryColors: ['#FFFFFF', '#BE123C'],
    motionStyle: 'gentle-fall',
    ambientCount: 13,
    burstCount: 36,
    stage2Count: 11,
  },
  'kanha-makhan': {
    shape: 'mishri-crystal',
    colors: ['#FFFFFF', '#FEF9C3', '#38BDF8', '#F59E0B'],
    secondaryColors: ['#E0F2FE', '#FDE68A'],
    motionStyle: 'float-hover',
    ambientCount: 14,
    burstCount: 36,
    stage2Count: 11,
  },
  'veer-balak': {
    shape: 'surya-emblem',
    colors: ['#F59E0B', '#EA580C', '#FACC15', '#DC2626'],
    secondaryColors: ['#FEF08A', '#B91C1C'],
    motionStyle: 'rise',
    ambientCount: 12,
    burstCount: 32,
    stage2Count: 10,
  },
  'ganesh-aashish': {
    shape: 'durva-modak',
    colors: ['#F59E0B', '#15803D', '#FBBF24', '#DC2626'],
    secondaryColors: ['#FEF08A', '#22C55E'],
    motionStyle: 'gentle-fall',
    ambientCount: 13,
    burstCount: 34,
    stage2Count: 11,
    hasSoundWaves: true,
  },
  paithani: {
    shape: 'akshata-zari',
    colors: ['#FFFDF9', '#FDE047', '#F5D68A', '#F8FAFC'],
    secondaryColors: ['#C9932A', '#A855F7'],
    motionStyle: 'gentle-fall',
    ambientCount: 16,
    burstCount: 52,
    stage2Count: 13,
  },
  kohinoor: {
    shape: 'kohinoor-gem',
    colors: ['#FFFBEB', '#FDE68A', '#E5B966', '#FFFFFF'],
    secondaryColors: ['#FCA5A5', '#F59E0B'],
    motionStyle: 'stationary-twinkle',
    ambientCount: 16,
    burstCount: 42,
    stage2Count: 13,
  },
  vrindavan: {
    shape: 'parijat-firefly',
    colors: ['#FFFDF9', '#FDE047', '#FB923C', '#FEF08A'],
    secondaryColors: ['#EA580C', '#A7F3D0'],
    motionStyle: 'float-hover',
    ambientCount: 15,
    burstCount: 38,
    stage2Count: 12,
    hasWaterRipples: true,
  },
  kesariya: {
    shape: 'bandhani-knot',
    colors: ['#EA580C', '#DC2626', '#FACC15', '#F97316'],
    secondaryColors: ['#FFFFFF', '#FDE68A'],
    motionStyle: 'breeze-diagonal',
    ambientCount: 14,
    burstCount: 38,
    stage2Count: 11,
  },
  'pattu-zari': {
    shape: 'kolam-zari',
    colors: ['#FFFFFF', '#F5D68A', '#D97706', '#FFFBEB'],
    secondaryColors: ['#15803D', '#B91C1C'],
    motionStyle: 'float-hover',
    ambientCount: 12,
    burstCount: 32,
    stage2Count: 10,
  },
  mehr: {
    shape: 'moti-pearl',
    colors: ['#FFFDF9', '#F5F5F4', '#FDE68A', '#E7E5E4'],
    secondaryColors: ['#C69C4E', '#10B981'],
    motionStyle: 'gentle-fall',
    ambientCount: 14,
    burstCount: 36,
    stage2Count: 11,
  },
  kalgi: {
    shape: 'kalgi-plume',
    colors: ['#059669', '#F59E0B', '#EA580C', '#FDE68A'],
    secondaryColors: ['#10B981', '#FFFBEB'],
    motionStyle: 'breeze-diagonal',
    ambientCount: 13,
    burstCount: 36,
    stage2Count: 11,
    hasWaterRipples: true,
  },
  'shahi-badami': {
    shape: 'kohinoor-gem',
    colors: ['#FDE68A', '#F59E0B', '#FFFBEB', '#E5B966'],
    secondaryColors: ['#991B1B', '#FBBF24'],
    motionStyle: 'rise',
    ambientCount: 12,
    burstCount: 42,
    stage2Count: 13,
  },
  'van-upvan': {
    shape: 'gold-foil-flake',
    colors: ['#FDE68A', '#86EFAC', '#F3E5AB', '#FFFDF5'],
    secondaryColors: ['#4E6E58', '#C59B38'],
    motionStyle: 'breeze-diagonal',
    ambientCount: 13,
    burstCount: 44,
    stage2Count: 13,
  },
  'sindoori-rajhans': {
    shape: 'moti-pearl',
    colors: ['#FFFDF9', '#FDE68A', '#F59E0B', '#FEE2E2'],
    secondaryColors: ['#991B1B', '#D97706'],
    motionStyle: 'gentle-fall',
    ambientCount: 13,
    burstCount: 40,
    stage2Count: 12,
  },
  'rajsi-baingani': {
    shape: 'mirror-prism',
    colors: ['#FDE68A', '#F5D0FE', '#E5B966', '#FFFFFF'],
    secondaryColors: ['#A855F7', '#F59E0B'],
    motionStyle: 'stationary-twinkle',
    ambientCount: 16,
    burstCount: 44,
    stage2Count: 14,
  },
  'neel-chandani': {
    shape: 'crescent-moon',
    colors: ['#E2E8F0', '#F8FAFC', '#BAE6FD', '#CBD5E1'],
    secondaryColors: ['#93C5FD', '#FDE68A'],
    motionStyle: 'stationary-twinkle',
    ambientCount: 16,
    burstCount: 42,
    stage2Count: 14,
  },
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rot: number;
  vRot: number;
  swayPhase: number;
  swayFreq: number;
  swayAmp: number;
  tiltPhase: number;
  tiltSpeed: number;
  alpha: number;
  color: string;
  secondaryColor: string;
  variantIndex: number;
  orbitAngle: number;
  orbitRadius: number;
  orbitSpeed: number;
  depth: number;
}

interface RippleRing {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
}

export const StageMotionCanvas: React.FC<StageMotionCanvasProps> = ({
  themeId = 'jharokha',
  mode,
  isOpened,
  bodyOpen,
  rippleCoords,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<RippleRing[]>([]);
  const burstSpawnedRef = useRef(false);
  const pointerRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -999,
    y: -999,
    active: false,
  });

  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const profile = THEME_PROFILES[themeId] || THEME_PROFILES.jharokha;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cachedW = Math.max(1, canvas.clientWidth || 320);
    let cachedH = Math.max(1, canvas.clientHeight || 480);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      cachedW = Math.max(1, rect.width || 320);
      cachedH = Math.max(1, rect.height || 480);
      canvas.width = Math.max(1, Math.round(cachedW * dpr));
      canvas.height = Math.max(1, Math.round(cachedH * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const w = () => cachedW;
    const h = () => cachedH;

    const createParticle = (burst: boolean, idx = 0): Particle => {
      const cw = w();
      const ch = h();
      const color = profile.colors[Math.floor(Math.random() * profile.colors.length)];
      const secondaryColor =
        profile.secondaryColors[Math.floor(Math.random() * profile.secondaryColors.length)];
      const depth = 0.65 + Math.random() * 0.65;

      let x = Math.random() * cw;
      let y = Math.random() * ch;
      let vx = (Math.random() - 0.5) * 0.35;
      let vy = (0.45 + Math.random() * 0.55) * depth;

      if (profile.motionStyle === 'rise') {
        y = burst ? ch * (0.45 + Math.random() * 0.55) : Math.random() * ch;
        vy = -(0.55 + Math.random() * (burst ? 1.45 : 0.75)) * depth;
        vx = (Math.random() - 0.5) * 0.45;
      } else if (profile.motionStyle === 'glide-horizontal') {
        y = ch * (0.52 + Math.random() * 0.42);
        vx = (0.35 + Math.random() * (burst ? 0.85 : 0.45)) * (idx % 2 === 0 ? 1 : -1);
        vy = (Math.random() - 0.5) * 0.14;
      } else if (profile.motionStyle === 'stationary-twinkle') {
        vx = (Math.random() - 0.5) * 0.08;
        vy = (Math.random() - 0.5) * 0.08;
      } else if (profile.motionStyle === 'circular-orbit') {
        vx = 0;
        vy = 0;
      } else if (profile.motionStyle === 'breeze-diagonal') {
        x = burst ? Math.random() * cw : Math.random() * cw;
        y = burst ? -16 - Math.random() * (ch * 0.45) : Math.random() * ch;
        vx = (0.55 + Math.random() * (burst ? 1.1 : 0.55)) * depth;
        vy = (0.55 + Math.random() * (burst ? 1.25 : 0.6)) * depth;
      } else if (profile.motionStyle === 'float-hover') {
        vx = (Math.random() - 0.5) * 0.32;
        vy = (Math.random() - 0.5) * 0.28;
      } else {
        // gentle-fall
        y = burst ? -14 - Math.random() * (ch * 0.5) : Math.random() * ch;
        vy = (burst ? 1.25 + Math.random() * 1.65 : 0.42 + Math.random() * 0.48) * depth;
        vx = (Math.random() - 0.5) * (burst ? 0.75 : 0.32);
      }

      const baseSize = (5.2 + Math.random() * 4.5) * depth;
      const ambientScale = !burst && !isOpened && !bodyOpen ? 0.58 : 1;

      return {
        x,
        y,
        vx,
        vy,
        size: baseSize * ambientScale,
        rot: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.05,
        swayPhase: Math.random() * Math.PI * 2,
        swayFreq: 0.025 + Math.random() * 0.03,
        swayAmp: burst ? 0.55 : 0.32,
        tiltPhase: Math.random() * Math.PI * 2,
        tiltSpeed: 0.04 + Math.random() * 0.05,
        alpha: burst
          ? 0.85 + Math.random() * 0.15
          : !isOpened && !bodyOpen
            ? 0.28 + Math.random() * 0.22
            : 0.48 + Math.random() * 0.3,
        color,
        secondaryColor,
        variantIndex: idx % 3,
        orbitAngle: (idx / Math.max(1, profile.ambientCount)) * Math.PI * 2 + Math.random() * 0.4,
        orbitRadius: Math.min(cw, ch) * (0.16 + (idx % 4) * 0.075),
        orbitSpeed: (0.014 + (idx % 3) * 0.006) * (idx % 2 === 0 ? 1 : -1),
        depth,
      };
    };

    if (!isOpened && !bodyOpen) {
      burstSpawnedRef.current = false;
      particlesRef.current = Array.from({ length: profile.ambientCount }, (_, i) =>
        createParticle(false, i)
      );
      ripplesRef.current = [];
    } else if (isOpened && !bodyOpen && !burstSpawnedRef.current) {
      burstSpawnedRef.current = true;
      particlesRef.current = [
        ...particlesRef.current,
        ...Array.from({ length: profile.burstCount }, (_, i) => createParticle(true, i)),
      ];

      if (profile.hasWaterRipples || profile.hasSoundWaves) {
        const cx = ((rippleCoords?.x ?? 50) / 100) * w();
        const cy =
          profile.hasSoundWaves
            ? h() * 0.18
            : ((rippleCoords?.y ?? 62) / 100) * h();
        const ringColor = profile.hasSoundWaves ? '245, 214, 138' : '255, 244, 214';
        ripplesRef.current = [
          { x: cx, y: cy, radius: 8, maxRadius: Math.max(w(), h()) * 0.72, alpha: 0.85, color: ringColor },
          { x: cx, y: cy, radius: 2, maxRadius: Math.max(w(), h()) * 0.54, alpha: 0.65, color: ringColor },
          { x: cx, y: cy, radius: 0, maxRadius: Math.max(w(), h()) * 0.38, alpha: 0.5, color: ringColor },
        ];
      }
    } else if (bodyOpen) {
      const targetCount = profile.stage2Count;
      if (particlesRef.current.length > targetCount) {
        particlesRef.current = particlesRef.current.slice(0, targetCount).map((p) => ({
          ...p,
          alpha: Math.min(p.alpha, 0.64),
        }));
      } else if (particlesRef.current.length === 0) {
        particlesRef.current = Array.from({ length: targetCount }, (_, i) =>
          createParticle(false, i)
        );
      }
    }

    const parentEl = canvas.parentElement;
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    };
    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };
    if (parentEl) {
      parentEl.addEventListener('pointermove', onPointerMove, { passive: true });
      parentEl.addEventListener('pointerleave', onPointerLeave, { passive: true });
    }

    let rafId = 0;
    let tick = 0;
    let isVisible = true;

    const drawParticleShape = (p: Particle, tickVal: number) => {
      const r = p.size;
      switch (profile.shape) {
        case 'ember-up': {
          // Soft warm golden diya bokeh mote (no harsh comet tails)
          const pulse = 0.45 + 0.55 * Math.pow(Math.sin(tickVal * 0.045 + p.swayPhase), 2);
          ctx.globalAlpha = p.alpha * pulse;
          const glowR = r * 1.35;
          const glowGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, glowR);
          glowGrad.addColorStop(0, 'rgba(255, 248, 220, 0.95)');
          glowGrad.addColorStop(0.35, 'rgba(246, 200, 100, 0.55)');
          glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(0, 0, glowR, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#FFFDF5';
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1.1, r * 0.22), 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'lotus-glide': {
          // Boat-shaped cupped pink lotus petal on water with gold rim
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(-r * 1.15, 0);
          ctx.quadraticCurveTo(0, -r * 0.85, r * 1.15, 0);
          ctx.quadraticCurveTo(0, r * 0.55, -r * 1.15, 0);
          ctx.fill();
          ctx.strokeStyle = p.secondaryColor;
          ctx.lineWidth = 0.8;
          ctx.stroke();
          break;
        }

        case 'peacock-eye': {
          // Sacred Mor-Chandraka concentric peacock eye
          ctx.fillStyle = '#F5D68A';
          ctx.beginPath();
          ctx.ellipse(0, 0, r * 0.85, r * 1.1, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#0D9488';
          ctx.beginPath();
          ctx.ellipse(0, r * 0.08, r * 0.58, r * 0.76, 0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#1E3A8A';
          ctx.beginPath();
          ctx.arc(0, r * 0.18, r * 0.32, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'gold-foil-flake': {
          // Faceted polygonal gold-leaf flake
          const shimmer = 0.65 + 0.35 * Math.sin(tickVal * 0.08 + p.swayPhase);
          ctx.globalAlpha = p.alpha * shimmer;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.85);
          ctx.lineTo(r * 0.72, -r * 0.2);
          ctx.lineTo(r * 0.38, r * 0.82);
          ctx.lineTo(-r * 0.64, r * 0.45);
          ctx.lineTo(-r * 0.55, -r * 0.45);
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'mirror-prism': {
          // Stationary twinkling 8-point Thikri mirror star
          const pulse = 0.25 + 0.75 * Math.pow(Math.sin(tickVal * 0.045 + p.swayPhase), 2);
          ctx.globalAlpha = p.alpha * pulse;
          const sr = r * (0.8 + pulse * 0.55);
          ctx.fillStyle = p.color;
          for (let k = 0; k < 2; k += 1) {
            ctx.save();
            ctx.rotate((k * Math.PI) / 4);
            ctx.beginPath();
            ctx.moveTo(0, -sr);
            ctx.quadraticCurveTo(sr * 0.12, -sr * 0.12, sr, 0);
            ctx.quadraticCurveTo(sr * 0.12, sr * 0.12, 0, sr);
            ctx.quadraticCurveTo(-sr * 0.12, sr * 0.12, -sr, 0);
            ctx.quadraticCurveTo(-sr * 0.12, -sr * 0.12, 0, -sr);
            ctx.fill();
            ctx.restore();
          }
          break;
        }

        case 'floating-diya': {
          // Miniature clay diya boat with upright flickering flame
          ctx.rotate(-p.rot); // keep diya upright on water
          ctx.fillStyle = '#B45309';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.85, 0, Math.PI, false);
          ctx.closePath();
          ctx.fill();

          const flicker = 0.85 + 0.2 * Math.sin(tickVal * 0.2 + p.swayPhase);
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.moveTo(0, -r * 1.15 * flicker);
          ctx.quadraticCurveTo(r * 0.42, -r * 0.35, 0, 0);
          ctx.quadraticCurveTo(-r * 0.42, -r * 0.35, 0, -r * 1.15 * flicker);
          ctx.fill();
          break;
        }

        case 'genda-pompom': {
          // Ruffled multi-petal marigold blossom head
          ctx.fillStyle = p.color;
          const petals = 8;
          for (let k = 0; k < petals; k += 1) {
            const ang = (k / petals) * Math.PI * 2;
            ctx.beginPath();
            ctx.arc(Math.cos(ang) * r * 0.42, Math.sin(ang) * r * 0.42, r * 0.42, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.fillStyle = '#EA580C';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.32, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'mogra-bud': {
          // Pearl-white jasmine mogra bud with green stem calyx
          ctx.fillStyle = '#FFFDF9';
          ctx.beginPath();
          ctx.ellipse(0, -r * 0.18, r * 0.48, r * 0.72, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#4D7C0F';
          ctx.beginPath();
          ctx.arc(0, r * 0.48, r * 0.28, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'mango-bell-wave': {
          // Auspicious green mango leaf with golden tip
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -r * 1.1);
          ctx.quadraticCurveTo(r * 0.65, 0, 0, r * 1.1);
          ctx.quadraticCurveTo(-r * 0.65, 0, 0, -r * 1.1);
          ctx.fill();
          ctx.strokeStyle = '#F5D68A';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.9);
          ctx.lineTo(0, r * 0.9);
          ctx.stroke();
          break;
        }

        case 'damask-rose': {
          // Heart-notched velvet damask rose petal
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, r * 0.75);
          ctx.bezierCurveTo(r * 0.95, r * 0.35, r * 0.95, -r * 0.75, r * 0.28, -r * 0.65);
          ctx.lineTo(0, -r * 0.35);
          ctx.lineTo(-r * 0.28, -r * 0.65);
          ctx.bezierCurveTo(-r * 0.95, -r * 0.75, -r * 0.95, r * 0.35, 0, r * 0.75);
          ctx.fill();
          break;
        }

        case 'champagne-bubble': {
          // Hollow pearlescent champagne bubble with specular glint
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.75, 0, Math.PI * 2);
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-r * 0.26, -r * 0.26, r * 0.18, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'paper-triangle': {
          // Crisp geometric triangle pennant or serpentine wave
          ctx.fillStyle = p.color;
          if (p.variantIndex === 0) {
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.85);
            ctx.lineTo(r * 0.78, r * 0.65);
            ctx.lineTo(-r * 0.78, r * 0.65);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-r, -r * 0.3);
            ctx.quadraticCurveTo(-r * 0.3, r * 0.5, 0, 0);
            ctx.quadraticCurveTo(r * 0.3, -r * 0.5, r, r * 0.3);
            ctx.stroke();
          }
          break;
        }

        case 'baby-footprint': {
          // Tiny golden baby sole + 4 little toes
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.ellipse(0, r * 0.15, r * 0.42, r * 0.68, 0, 0, Math.PI * 2);
          ctx.fill();
          for (let t = -1.5; t <= 1.5; t += 1) {
            ctx.beginPath();
            ctx.arc(t * r * 0.25, -r * 0.68 + Math.abs(t) * r * 0.06, r * 0.13, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case 'crescent-moon': {
          // Silver-gold crescent moon or 5-point lullaby star
          ctx.fillStyle = p.color;
          if (p.variantIndex === 0) {
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.85, 0.25 * Math.PI, 1.75 * Math.PI, false);
            ctx.arc(r * 0.35, -r * 0.1, r * 0.68, 1.65 * Math.PI, 0.35 * Math.PI, true);
            ctx.closePath();
            ctx.fill();
          } else {
            ctx.beginPath();
            for (let k = 0; k < 5; k += 1) {
              const outerAng = (k * 2 * Math.PI) / 5 - Math.PI / 2;
              const innerAng = outerAng + Math.PI / 5;
              if (k === 0) ctx.moveTo(Math.cos(outerAng) * r * 0.8, Math.sin(outerAng) * r * 0.8);
              else ctx.lineTo(Math.cos(outerAng) * r * 0.8, Math.sin(outerAng) * r * 0.8);
              ctx.lineTo(Math.cos(innerAng) * r * 0.35, Math.sin(innerAng) * r * 0.35);
            }
            ctx.closePath();
            ctx.fill();
          }
          break;
        }

        case 'mor-pankh-note': {
          // Musical note or peacock plume barb
          if (p.variantIndex === 0) {
            ctx.fillStyle = '#F59E0B';
            ctx.beginPath();
            ctx.ellipse(-r * 0.2, r * 0.4, r * 0.38, r * 0.26, -0.3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#F59E0B';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.moveTo(r * 0.1, r * 0.4);
            ctx.lineTo(r * 0.1, -r * 0.65);
            ctx.lineTo(r * 0.55, -r * 0.45);
            ctx.stroke();
          } else {
            ctx.fillStyle = '#0D9488';
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 0.5, r * 0.9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FDE68A';
            ctx.beginPath();
            ctx.arc(0, -r * 0.2, r * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case 'aarti-orbit': {
          // Glowing Panch-Aarti flame teardrop with golden halo
          ctx.fillStyle = 'rgba(251, 191, 36, 0.28)';
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.95);
          ctx.quadraticCurveTo(r * 0.55, 0, 0, r * 0.65);
          ctx.quadraticCurveTo(-r * 0.55, 0, 0, -r * 0.95);
          ctx.fill();
          break;
        }

        case 'rangoli-rosette': {
          // 6-petal geometric rangoli mandala flower with white center
          ctx.fillStyle = p.color;
          for (let k = 0; k < 6; k += 1) {
            const ang = (k / 6) * Math.PI * 2;
            ctx.beginPath();
            ctx.ellipse(
              Math.cos(ang) * r * 0.48,
              Math.sin(ang) * r * 0.48,
              r * 0.34,
              r * 0.2,
              ang,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
          ctx.fillStyle = '#FFFBEB';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'payal-ghungroo': {
          // Metallic silver ghungroo bell with slit & sound ring
          ctx.fillStyle = p.variantIndex === 0 ? '#E2E8F0' : '#F472B6';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.62, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.moveTo(-r * 0.35, r * 0.15);
          ctx.lineTo(r * 0.35, r * 0.15);
          ctx.stroke();
          break;
        }

        case 'kumkum-gajra': {
          // Circular mogra gajra ring or glowing vermilion kumkum bindu
          if (p.variantIndex === 0) {
            ctx.strokeStyle = '#FFFDF9';
            ctx.lineWidth = 2.2;
            ctx.setLineDash([2.5, 2]);
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.72, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
          } else {
            ctx.fillStyle = '#DC2626';
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.58, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#FACC15';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
          break;
        }

        case 'pearl-latkan': {
          // 3-bead vertical pearl & ruby latkan tassel
          ctx.rotate(-p.rot);
          ctx.fillStyle = '#FFF1F2';
          ctx.beginPath();
          ctx.arc(0, -r * 0.6, r * 0.3, 0, Math.PI * 2);
          ctx.arc(0, 0, r * 0.36, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#E11D48';
          ctx.beginPath();
          ctx.moveTo(0, r * 0.3);
          ctx.lineTo(r * 0.42, r * 0.85);
          ctx.lineTo(0, r * 1.15);
          ctx.lineTo(-r * 0.42, r * 0.85);
          ctx.closePath();
          ctx.fill();
          break;
        }

        case 'mishri-crystal': {
          // Diamond-cut white rock-sugar (Mishri) crystal cube
          ctx.fillStyle = '#FFFFFF';
          ctx.strokeStyle = '#BAE6FD';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.rect(-r * 0.5, -r * 0.5, r, r);
          ctx.fill();
          ctx.stroke();
          break;
        }

        case 'surya-emblem': {
          // 8-ray golden sun crest
          ctx.fillStyle = '#F59E0B';
          for (let k = 0; k < 8; k += 1) {
            ctx.save();
            ctx.rotate((k * Math.PI) / 4);
            ctx.beginPath();
            ctx.moveTo(-r * 0.22, -r * 0.35);
            ctx.lineTo(0, -r * 0.95);
            ctx.lineTo(r * 0.22, -r * 0.35);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }
          ctx.fillStyle = '#FEF08A';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'durva-modak': {
          // Pleated golden modak or 3-blade green durva grass
          if (p.variantIndex === 0) {
            ctx.fillStyle = '#FBBF24';
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.9);
            ctx.bezierCurveTo(r * 0.85, -r * 0.2, r * 0.75, r * 0.75, 0, r * 0.75);
            ctx.bezierCurveTo(-r * 0.75, r * 0.75, -r * 0.85, -r * 0.2, 0, -r * 0.9);
            ctx.fill();
          } else {
            ctx.strokeStyle = '#16A34A';
            ctx.lineWidth = 1.5;
            for (const ang of [-0.35, 0, 0.35]) {
              ctx.beginPath();
              ctx.moveTo(0, r * 0.6);
              ctx.lineTo(Math.sin(ang) * r * 0.9, -r * 0.65);
              ctx.stroke();
            }
          }
          break;
        }

        case 'akshata-zari': {
          // Slender haldi-white rice grain or woven gold Paithani diamond butti
          if (p.variantIndex !== 0) {
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 0.32, r * 0.95, 0, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.strokeStyle = '#F5D68A';
            ctx.lineWidth = 1.3;
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.75);
            ctx.lineTo(r * 0.65, 0);
            ctx.lineTo(0, r * 0.75);
            ctx.lineTo(-r * 0.65, 0);
            ctx.closePath();
            ctx.stroke();
          }
          break;
        }

        case 'kohinoor-gem': {
          // Faceted diamond hexagon with bright cross-flare
          const glint = 0.4 + 0.6 * Math.pow(Math.sin(tickVal * 0.06 + p.swayPhase), 2);
          ctx.globalAlpha = p.alpha * glint;
          ctx.fillStyle = '#FFFBEB';
          ctx.strokeStyle = '#E5B966';
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          for (let k = 0; k < 6; k += 1) {
            const ang = (k * Math.PI) / 3;
            if (k === 0) ctx.moveTo(Math.cos(ang) * r * 0.72, Math.sin(ang) * r * 0.72);
            else ctx.lineTo(Math.cos(ang) * r * 0.72, Math.sin(ang) * r * 0.72);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;
        }

        case 'parijat-firefly': {
          // 5-petal white Parijat night-jasmine with coral-orange center tube!
          if (p.variantIndex === 0) {
            ctx.fillStyle = '#FFFDF9';
            for (let k = 0; k < 5; k += 1) {
              const ang = (k * 2 * Math.PI) / 5;
              ctx.beginPath();
              ctx.ellipse(
                Math.cos(ang) * r * 0.48,
                Math.sin(ang) * r * 0.48,
                r * 0.36,
                r * 0.22,
                ang,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
            ctx.fillStyle = '#EA580C';
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.24, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Bioluminescent Braj firefly
            const glow = 0.35 + 0.65 * Math.pow(Math.sin(tickVal * 0.07 + p.swayPhase), 2);
            ctx.globalAlpha = p.alpha * glow;
            ctx.fillStyle = 'rgba(253, 224, 71, 0.35)';
            ctx.beginPath();
            ctx.arc(0, 0, r * 1.35, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FEF08A';
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.42, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }

        case 'bandhani-knot': {
          // Rajasthani Bandhani tie-dye diamond knot with hollow white dot center
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -r * 0.82);
          ctx.lineTo(r * 0.82, 0);
          ctx.lineTo(0, r * 0.82);
          ctx.lineTo(-r * 0.82, 0);
          ctx.closePath();
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.25, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'kolam-zari': {
          // Interlocking white rice-flour Kolam loop or gold temple triangle
          if (p.variantIndex === 0) {
            ctx.strokeStyle = '#FFFFFF';
            ctx.lineWidth = 1.2;
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 0.8, r * 0.38, Math.PI / 4, 0, Math.PI * 2);
            ctx.ellipse(0, 0, r * 0.8, r * 0.38, -Math.PI / 4, 0, Math.PI * 2);
            ctx.stroke();
          } else {
            ctx.fillStyle = '#D97706';
            ctx.beginPath();
            ctx.moveTo(0, -r * 0.8);
            ctx.lineTo(r * 0.72, r * 0.65);
            ctx.lineTo(-r * 0.72, r * 0.65);
            ctx.closePath();
            ctx.fill();
          }
          break;
        }

        case 'moti-pearl': {
          // Lustrous 3D ivory pearl with soft champagne rim & specular pinpoint
          ctx.fillStyle = '#FFFDF9';
          ctx.strokeStyle = '#C69C4E';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(0, 0, r * 0.64, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(-r * 0.2, -r * 0.2, r * 0.2, 0, Math.PI * 2);
          ctx.fill();
          break;
        }

        case 'kalgi-plume': {
          // Curved emerald & gold Sarpech plume feather
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, r * 0.95);
          ctx.quadraticCurveTo(r * 0.85, 0, r * 0.25, -r * 0.95);
          ctx.quadraticCurveTo(-r * 0.55, -r * 0.2, 0, r * 0.95);
          ctx.fill();
          ctx.strokeStyle = '#FDE68A';
          ctx.lineWidth = 0.9;
          ctx.stroke();
          break;
        }

        case 'bougainvillea':
        default: {
          // 3-bract papery magenta bougainvillea blossom or silver-green olive leaf
          if (p.variantIndex !== 0) {
            ctx.fillStyle = p.color;
            for (let k = 0; k < 3; k += 1) {
              const ang = (k * 2 * Math.PI) / 3;
              ctx.beginPath();
              ctx.ellipse(
                Math.cos(ang) * r * 0.35,
                Math.sin(ang) * r * 0.35,
                r * 0.48,
                r * 0.3,
                ang,
                0,
                Math.PI * 2
              );
              ctx.fill();
            }
            ctx.fillStyle = '#FEF08A';
            ctx.beginPath();
            ctx.arc(0, 0, r * 0.14, 0, Math.PI * 2);
            ctx.fill();
          } else {
            ctx.fillStyle = '#4D7C0F';
            ctx.beginPath();
            ctx.ellipse(0, 0, r * 0.32, r * 0.95, 0, 0, Math.PI * 2);
            ctx.fill();
          }
          break;
        }
      }
    };

    const render = () => {
      if (!isVisible || document.hidden) {
        rafId = 0;
        return;
      }

      tick += 1;
      const cw = w();
      const ch = h();
      ctx.clearRect(0, 0, cw, ch);

      // Expanding water ripples or temple bell soundwaves
      if (ripplesRef.current.length > 0) {
        for (let i = 0; i < ripplesRef.current.length; i += 1) {
          const ring = ripplesRef.current[i];
          ring.radius += 2.2 - i * 0.3;
          ring.alpha = Math.max(0, 0.8 * (1 - ring.radius / ring.maxRadius));
          if (ring.alpha > 0.01) {
            ctx.beginPath();
            const aspect = profile.hasSoundWaves ? 1 : 0.72;
            ctx.ellipse(ring.x, ring.y, ring.radius, ring.radius * aspect, 0, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(${ring.color}, ${ring.alpha})`;
            ctx.lineWidth = 1.5;
            ctx.stroke();
          }
        }
      }

      const ptr = pointerRef.current;
      const list = particlesRef.current;
      for (let i = 0; i < list.length; i += 1) {
        const p = list[i];
        p.swayPhase += p.swayFreq;
        p.tiltPhase += p.tiltSpeed;

        if (profile.motionStyle === 'circular-orbit') {
          p.orbitAngle += p.orbitSpeed;
          p.x = cw * 0.5 + Math.cos(p.orbitAngle) * p.orbitRadius;
          p.y = ch * 0.48 + Math.sin(p.orbitAngle) * p.orbitRadius * 0.82;
        } else {
          if (ptr.active) {
            const dx = p.x - ptr.x;
            const dy = p.y - ptr.y;
            const distSq = dx * dx + dy * dy;
            if (distSq < 5600 && distSq > 4) {
              const force = (1 - distSq / 5600) * 0.42;
              p.x += (dx / Math.sqrt(distSq)) * force;
              p.y += (dy / Math.sqrt(distSq)) * force * 0.5;
            }
          }

          p.x += p.vx + Math.sin(p.swayPhase) * p.swayAmp;
          p.y += p.vy + (profile.motionStyle === 'float-hover' ? Math.cos(p.swayPhase) * 0.22 : 0);
          p.rot += p.vRot;

          if (p.y > ch + 18) {
            p.y = -14;
            p.x = Math.random() * cw;
          } else if (p.y < -18) {
            p.y = ch + 14;
            p.x = Math.random() * cw;
          }

          if (p.x > cw + 20) p.x = -16;
          if (p.x < -20) p.x = cw + 16;
        }

        const scaleX =
          profile.motionStyle === 'stationary-twinkle' ||
          profile.shape === 'floating-diya' ||
          profile.shape === 'ember-up'
            ? 1
            : 0.55 + 0.45 * Math.abs(Math.cos(p.tiltPhase));

        // Attenuate closed-cover particles gently across upper center typography safe-zone
        let safeZoneMult = 1;
        if (!isOpened && !bodyOpen) {
          const inTextBandY = p.y > ch * 0.1 && p.y < ch * 0.44;
          const inTextBandX = p.x > cw * 0.16 && p.x < cw * 0.84;
          if (inTextBandY && inTextBandX) {
            safeZoneMult = 0.08;
          }
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        if (profile.shape !== 'ember-up') {
          ctx.rotate(p.rot);
        }
        ctx.scale(scaleX, 1);
        ctx.globalAlpha = p.alpha * safeZoneMult;
        drawParticleShape(p, tick);
        ctx.restore();
      }

      rafId = window.requestAnimationFrame(render);
    };

    const startLoop = () => {
      if (!rafId && isVisible && !document.hidden) {
        rafId = window.requestAnimationFrame(render);
      }
    };

    const observer =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              isVisible = Boolean(entry?.isIntersecting);
              if (isVisible) startLoop();
              else if (rafId) {
                window.cancelAnimationFrame(rafId);
                rafId = 0;
              }
            },
            { threshold: 0.02 }
          )
        : null;

    if (observer) observer.observe(canvas);
    const onVisibility = () => {
      if (!document.hidden && isVisible) startLoop();
    };
    document.addEventListener('visibilitychange', onVisibility);

    startLoop();
    window.addEventListener('resize', resize);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
      if (parentEl) {
        parentEl.removeEventListener('pointermove', onPointerMove);
        parentEl.removeEventListener('pointerleave', onPointerLeave);
      }
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('resize', resize);
    };
  }, [themeId, mode, isOpened, bodyOpen, rippleCoords]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[26] h-full w-full"
    />
  );
};
