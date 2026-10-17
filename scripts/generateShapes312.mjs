import fs from 'fs';
import path from 'path';

const PUBLIC_SHAPES_DIR = path.resolve('public/assets/elements/shapes');
const DATA_DIR = path.resolve('src/data/elements');

fs.mkdirSync(PUBLIC_SHAPES_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

// Helper to create regular polygon or star points in 0..100 viewBox
function starPoints(cx, cy, spikes, outerR, innerR, rotDeg = -90) {
  const pts = [];
  const step = Math.PI / spikes;
  let angle = (rotDeg * Math.PI) / 180;
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const x = +(cx + Math.cos(angle) * r).toFixed(2);
    const y = +(cy + Math.sin(angle) * r).toFixed(2);
    pts.push(`${x},${y}`);
    angle += step;
  }
  return pts.join(' ');
}

function polyPoints(cx, cy, sides, r, rotDeg = -90) {
  const pts = [];
  const step = (Math.PI * 2) / sides;
  let angle = (rotDeg * Math.PI) / 180;
  for (let i = 0; i < sides; i++) {
    const x = +(cx + Math.cos(angle) * r).toFixed(2);
    const y = +(cy + Math.sin(angle) * r).toFixed(2);
    pts.push(`${x},${y}`);
    angle += step;
  }
  return pts.join(' ');
}

function blobPath(cx, cy, baseR, lobes, amp, phase) {
  const steps = 48;
  const coords = [];
  for (let i = 0; i < steps; i++) {
    const theta = (i / steps) * Math.PI * 2;
    const r =
      baseR +
      amp * Math.sin(lobes * theta + phase) +
      (amp * 0.45) * Math.cos((lobes + 2) * theta - phase * 0.7);
    const x = +(cx + r * Math.cos(theta)).toFixed(2);
    const y = +(cy + r * Math.sin(theta)).toFixed(2);
    coords.push([x, y]);
  }
  let d = `M ${coords[0][0]} ${coords[0][1]} `;
  for (let i = 1; i < coords.length; i++) {
    d += `L ${coords[i][0]} ${coords[i][1]} `;
  }
  return d + 'Z';
}

function gearPath(cx, cy, teeth, outerR, rootR, holeR) {
  const pts = [];
  const step = (Math.PI * 2) / (teeth * 2);
  for (let i = 0; i < teeth * 2; i++) {
    const a1 = i * step;
    const a2 = a1 + step * 0.45;
    const r = i % 2 === 0 ? outerR : rootR;
    pts.push(`${(cx + r * Math.cos(a1)).toFixed(1)},${(cy + r * Math.sin(a1)).toFixed(1)}`);
    pts.push(`${(cx + r * Math.cos(a2)).toFixed(1)},${(cy + r * Math.sin(a2)).toFixed(1)}`);
  }
  return `<path fill-rule="evenodd" d="M ${pts.join(' L ')} Z M ${cx + holeR} ${cy} A ${holeR} ${holeR} 0 1 0 ${cx - holeR} ${cy} A ${holeR} ${holeR} 0 1 0 ${cx + holeR} ${cy} Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>`;
}

const SUBCATEGORY_SPECS = [
  { id: 'lines', count: 20, label: 'Lines & Dividers' },
  { id: 'rectangles', count: 18, label: 'Rectangles & Cards' },
  { id: 'basic', count: 32, label: 'Basic & Polygons' },
  { id: 'arrows', count: 28, label: 'Directional Arrows' },
  { id: 'speech-bubbles', count: 20, label: 'Speech Bubbles' },
  { id: 'clouds', count: 14, label: 'Clouds & Thoughts' },
  { id: 'hearts', count: 16, label: 'Hearts & Romance' },
  { id: 'stars', count: 22, label: 'Stars & Sparkles' },
  { id: 'bursts', count: 16, label: 'Bursts & Seals' },
  { id: 'banners', count: 24, label: 'Banners & Ribbons' },
  { id: 'blobs', count: 20, label: 'Organic Blobs' },
  { id: 'gears', count: 14, label: 'Gears & Cogs' },
  { id: 'square-stars', count: 12, label: 'Mandalas & Square Stars' },
  { id: 'organic', count: 28, label: 'Botanical Leaves & Drops' },
  { id: 'abstract', count: 28, label: 'Abstract & Architectural' },
];

function generateShapeInner(subId, idx) {
  const i = idx + 1;
  switch (subId) {
    case 'lines': {
      const y = 50;
      if (i === 1) return `<line x1="6" y1="${y}" x2="94" y2="${y}" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
      if (i === 2) return `<line x1="6" y1="${y}" x2="94" y2="${y}" stroke="currentColor" stroke-width="3" stroke-dasharray="6 4" stroke-linecap="round"/>`;
      if (i === 3) return `<line x1="6" y1="${y}" x2="94" y2="${y}" stroke="currentColor" stroke-width="4" stroke-dasharray="1 7" stroke-linecap="round"/>`;
      if (i === 4) return `<g stroke="currentColor" stroke-width="2"><line x1="6" y1="46" x2="94" y2="46"/><line x1="6" y1="54" x2="94" y2="54"/></g>`;
      if (i === 5) return `<g stroke="currentColor" fill="currentColor"><line x1="14" y1="50" x2="86" y2="50" stroke-width="2.5"/><polygon points="50,42 58,50 50,58 42,50"/><circle cx="10" cy="50" r="3.5"/><circle cx="90" cy="50" r="3.5"/></g>`;
      if (i === 6) return `<path d="M 6 50 Q 28 34 50 50 T 94 50" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>`;
      if (i === 7) return `<path d="M 6 50 L 18 40 L 30 60 L 42 40 L 54 60 L 66 40 L 78 60 L 94 50" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/>`;
      if (i === 8) return `<g stroke="currentColor" fill="currentColor"><line x1="8" y1="50" x2="40" y2="50" stroke-width="2"/><circle cx="50" cy="50" r="6" fill="none" stroke-width="2.5"/><circle cx="50" cy="50" r="2"/><line x1="60" y1="50" x2="92" y2="50" stroke-width="2"/></g>`;
      const waveAmp = 6 + (i % 7) * 2.5;
      const midR = 3 + (i % 5);
      return `<g stroke="currentColor" fill="currentColor"><path d="M 6 50 C 22 ${50 - waveAmp}, 34 ${50 + waveAmp}, 44 50" fill="none" stroke-width="2.2"/><polygon points="50,${50 - midR} ${50 + midR},50 50,${50 + midR} ${50 - midR},50"/><path d="M 56 50 C 66 ${50 - waveAmp}, 78 ${50 + waveAmp}, 94 50" fill="none" stroke-width="2.2"/><circle cx="8" cy="50" r="2.2"/><circle cx="92" cy="50" r="2.2"/></g>`;
    }
    case 'rectangles': {
      const rx = (idx * 3) % 24;
      const inset = 10 + (idx % 4) * 2;
      const w = 100 - inset * 2;
      const h = 76 - (idx % 3) * 6;
      const y = (100 - h) / 2;
      if (idx % 3 === 0) {
        return `<rect x="${inset}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="3"/>`;
      } else if (idx % 3 === 1) {
        return `<g stroke="currentColor" fill="currentColor"><rect x="${inset}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill-opacity="0.12" stroke-width="2.5"/><rect x="${inset + 5}" y="${y + 5}" width="${w - 10}" height="${h - 10}" rx="${Math.max(0, rx - 3)}" fill="none" stroke-width="1.2" stroke-dasharray="${idx % 2 === 0 ? '4 2' : 'none'}"/></g>`;
      } else {
        const cut = 8 + (idx % 4) * 3;
        return `<polygon points="${inset + cut},${y} ${inset + w - cut},${y} ${inset + w},${y + cut} ${inset + w},${y + h - cut} ${inset + w - cut},${y + h} ${inset + cut},${y + h} ${inset},${y + h - cut} ${inset},${y + cut}" fill="currentColor" fill-opacity="0.16" stroke="currentColor" stroke-width="2.8"/>`;
      }
    }
    case 'basic': {
      if (idx === 0) return `<circle cx="50" cy="50" r="40" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="3"/>`;
      if (idx === 1) return `<ellipse cx="50" cy="50" rx="42" ry="28" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="3"/>`;
      if (idx < 12) {
        const sides = 3 + idx;
        return `<polygon points="${polyPoints(50, 50, sides, 40, -90 + idx * 7)}" fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/>`;
      }
      if (idx < 22) {
        const archR = 25 + (idx - 12) * 1.8;
        return `<path d="M 16 88 L 16 ${48 - (idx % 4) * 3} A ${archR} ${archR} 0 0 1 84 ${48 - (idx % 4) * 3} L 84 88 Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="2.8"/>`;
      }
      const rIn = 14 + (idx - 22) * 2.2;
      return `<path fill-rule="evenodd" d="M 50 8 A 42 42 0 1 0 50 92 A 42 42 0 1 0 50 8 Z M 50 ${50 - rIn} A ${rIn} ${rIn} 0 1 1 50 ${50 + rIn} A ${rIn} ${rIn} 0 1 1 50 ${50 - rIn} Z" fill="currentColor" stroke="currentColor" stroke-width="1.5"/>`;
    }
    case 'arrows': {
      const rot = (idx * 15) % 360;
      const headW = 18 + (idx % 5) * 3;
      const shaftH = 8 + (idx % 4) * 4;
      return `<g transform="rotate(${rot} 50 50)"><polygon points="10,${50 - shaftH} ${60 - (idx % 3) * 4},${50 - shaftH} ${60 - (idx % 3) * 4},${50 - headW} 92,50 ${60 - (idx % 3) * 4},${50 + headW} ${60 - (idx % 3) * 4},${50 + shaftH} 10,${50 + shaftH}" fill="currentColor" fill-opacity="0.24" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></g>`;
    }
    case 'speech-bubbles': {
      const rx = 6 + (idx % 6) * 3;
      const tailX = 24 + (idx * 7) % 50;
      return `<path d="M 12 16 H 88 A ${rx} ${rx} 0 0 1 94 ${16 + rx} V ${64 - rx} A ${rx} ${rx} 0 0 1 88 64 H ${tailX + 12} L ${tailX} 86 L ${tailX - 4} 64 H 12 A ${rx} ${rx} 0 0 1 6 ${64 - rx} V ${16 + rx} A ${rx} ${rx} 0 0 1 12 16 Z" fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>`;
    }
    case 'clouds': {
      const r1 = 14 + (idx % 4) * 2;
      const r2 = 18 + (idx % 3) * 2;
      return `<g fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2.5"><path d="M 24 68 H 76 A 14 14 0 0 0 80 41 A ${r2} ${r2} 0 0 0 46 28 A ${r1} ${r1} 0 0 0 20 42 A 13 13 0 0 0 24 68 Z"/>${idx % 2 === 0 ? `<circle cx="${26 + idx}" cy="78" r="4"/><circle cx="${18 + idx}" cy="86" r="2.5"/>` : ''}</g>`;
    }
    case 'hearts': {
      const spread = 24 + (idx % 5) * 2.5;
      const dip = 26 + (idx % 4) * 3;
      return `<path d="M 50 ${86 - (idx % 3) * 2} C ${50 - spread * 1.6} 62, 10 ${dip + 12}, 26 ${dip - 6} C 36 ${dip - 14}, 46 ${dip - 4}, 50 ${dip + 4} C 54 ${dip - 4}, 64 ${dip - 14}, 74 ${dip - 6} C 90 ${dip + 12}, ${50 + spread * 1.6} 62, 50 ${86 - (idx % 3) * 2} Z" fill="currentColor" fill-opacity="${0.18 + (idx % 4) * 0.08}" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>`;
    }
    case 'stars': {
      const spikes = 4 + (idx % 9);
      const innerR = 12 + (idx % 5) * 4;
      return `<polygon points="${starPoints(50, 50, spikes, 42, innerR, -90 + idx * 5)}" fill="currentColor" fill-opacity="0.25" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>`;
    }
    case 'bursts': {
      const spikes = 12 + idx * 2;
      const innerR = 28 + (idx % 4) * 3;
      return `<polygon points="${starPoints(50, 50, spikes, 44, innerR, idx * 3)}" fill="currentColor" fill-opacity="0.22" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>`;
    }
    case 'banners': {
      const topY = 26 + (idx % 4) * 2;
      const botY = 74 - (idx % 4) * 2;
      const notch = 8 + (idx % 5) * 2.5;
      return `<g fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2.5" stroke-linejoin="round"><polygon points="8,${topY} 92,${topY} ${92 - notch},50 92,${botY} 8,${botY} ${8 + notch},50"/><line x1="18" y1="${topY + 5}" x2="82" y2="${topY + 5}" stroke-width="1.2"/><line x1="18" y1="${botY - 5}" x2="82" y2="${botY - 5}" stroke-width="1.2"/></g>`;
    }
    case 'blobs': {
      const lobes = 3 + (idx % 5);
      const amp = 5 + (idx % 4) * 2.2;
      return `<path d="${blobPath(50, 50, 33, lobes, amp, idx * 0.9)}" fill="currentColor" fill-opacity="0.24" stroke="currentColor" stroke-width="2.5"/>`;
    }
    case 'gears': {
      const teeth = 6 + idx;
      const holeR = 10 + (idx % 4) * 3;
      return gearPath(50, 50, teeth, 42, 33, holeR);
    }
    case 'square-stars': {
      const layers = 2 + (idx % 3);
      let paths = '';
      for (let l = 0; l < layers; l++) {
        const rot = l * (45 / layers) + idx * 7;
        const size = 56 - l * 6;
        const off = (100 - size) / 2;
        paths += `<rect x="${off}" y="${off}" width="${size}" height="${size}" rx="${idx % 3 * 2}" transform="rotate(${rot} 50 50)" fill="currentColor" fill-opacity="0.14" stroke="currentColor" stroke-width="2.2"/>`;
      }
      return `<g>${paths}<circle cx="50" cy="50" r="${8 + (idx % 4) * 2}" fill="none" stroke="currentColor" stroke-width="2"/></g>`;
    }
    case 'organic': {
      const lean = (idx % 7) * 4 - 12;
      const pinch = 16 + (idx % 5) * 5;
      return `<g fill="currentColor" fill-opacity="0.2" stroke="currentColor" stroke-width="2.4"><path d="M 50 90 C ${50 - pinch} 70, ${14 + idx % 8} 40, ${50 + lean} 10 C ${86 - idx % 8} 40, ${50 + pinch} 70, 50 90 Z"/><path d="M 50 88 Q ${50 + lean * 0.4} 50 ${50 + lean} 14" fill="none" stroke-width="1.8"/></g>`;
    }
    case 'abstract': {
      const archH = 32 + (idx % 6) * 4;
      const domeR = 20 + (idx % 5) * 3;
      return `<g fill="currentColor" fill-opacity="0.18" stroke="currentColor" stroke-width="2.4"><path d="M 14 88 V ${archH} Q 14 14 50 10 Q 86 14 86 ${archH} V 88 Z"/><circle cx="50" cy="${archH + 12}" r="${domeR * 0.55}" fill="none" stroke-width="1.8"/><path d="M 24 88 V ${archH + 6} Q 50 ${archH - 14} 76 ${archH + 6} V 88" fill="none" stroke-dasharray="${idx % 2 === 0 ? '3 3' : 'none'}"/></g>`;
    }
    default:
      return `<circle cx="50" cy="50" r="38" fill="currentColor" stroke="currentColor" stroke-width="2"/>`;
  }
}

const manifestItems = [];
let totalWritten = 0;
const countsBySub = {};

for (const sub of SUBCATEGORY_SPECS) {
  const subDir = path.join(PUBLIC_SHAPES_DIR, sub.id);
  fs.mkdirSync(subDir, { recursive: true });
  countsBySub[sub.id] = 0;

  for (let idx = 0; idx < sub.count; idx++) {
    const num = String(idx + 1).padStart(2, '0');
    const id = `shape-${sub.id}-${num}`;
    const fileName = `${id}.svg`;
    const inner = generateShapeInner(sub.id, idx);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none">${inner}</svg>`;

    const diskPath = path.join(subDir, fileName);
    fs.writeFileSync(diskPath, svg, 'utf-8');

    const webPath = `/assets/elements/shapes/${sub.id}/${fileName}`;
    const readableSub = sub.label.replace(/&/g, 'and');
    manifestItems.push({
      id,
      name: `${sub.label.split(' ')[0]} ${idx + 1}`,
      category: 'shapes',
      subcategory: sub.id,
      svgPath: svg,
      filePath: webPath,
      defaultFill: idx % 2 === 0 ? '#D4AF37' : '#F59E0B',
      defaultStroke: '#FDE68A',
      tags: [
        sub.id,
        readableSub.toLowerCase(),
        'shape',
        'vector',
        'royal',
        'gold',
        `shape-${idx + 1}`,
      ],
    });
    totalWritten++;
    countsBySub[sub.id]++;
  }
}

const tsManifest = `// AUTO-GENERATED 312 SHAPES MANIFEST across 15 subcategories
import { ShapeAssetItem } from '../../types/elements';

export const SHAPES_LIBRARY_ITEMS: ShapeAssetItem[] = ${JSON.stringify(manifestItems, null, 2)};
`;

fs.writeFileSync(path.join(DATA_DIR, 'shapesManifest.ts'), tsManifest, 'utf-8');

console.log(`Successfully generated ${totalWritten} SVG shape files.`);
console.log('Subcategory counts:', countsBySub);
