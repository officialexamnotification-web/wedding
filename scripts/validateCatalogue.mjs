import fs from 'fs';
import path from 'path';

// Comprehensive integration & catalogue verification script
const SHAPES_DIR = path.resolve('public/assets/elements/shapes');
const GRAPHICS_DIR = path.resolve('public/assets/elements/graphics');

function countSvgFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(countSvgFiles(full));
    } else if (entry.name.endsWith('.svg')) {
      results.push(full);
    }
  }
  return results;
}

const shapeFiles = countSvgFiles(SHAPES_DIR);
const graphicFiles = countSvgFiles(GRAPHICS_DIR);

let invalidSvgCount = 0;
for (const f of [...shapeFiles, ...graphicFiles]) {
  const content = fs.readFileSync(f, 'utf-8');
  if (!content.includes('<svg') || !content.includes('viewBox="0 0 100 100"') || !content.includes('</svg>')) {
    invalidSvgCount++;
    console.error('Invalid SVG:', f);
  }
}

// Verify manifest item counts by parsing JSON arrays inside generated manifests
const shapesTs = fs.readFileSync(path.resolve('src/data/elements/shapesManifest.ts'), 'utf8');
const graphicsTs = fs.readFileSync(path.resolve('src/data/elements/graphicsManifest.ts'), 'utf8');
const framesGridsTs = fs.readFileSync(path.resolve('src/data/elements/framesGridsManifest.ts'), 'utf8');
const mediaTs = fs.readFileSync(path.resolve('src/data/elements/mediaInteractiveManifest.ts'), 'utf8');

const countIds = (src, prefix) => (src.match(new RegExp(`"id":\\s*"${prefix}-`, 'g')) || []).length;

const counts = {
  shapes: countIds(shapesTs, 'shape'),
  graphics: countIds(graphicsTs, 'graphic'),
  frames: countIds(framesGridsTs, 'frame'),
  grids: countIds(framesGridsTs, 'grid'),
  photos: countIds(mediaTs, 'photo'),
  videos: countIds(mediaTs, 'video'),
  audio: countIds(mediaTs, 'audio'),
  animations: countIds(mediaTs, 'anim'),
  charts: countIds(mediaTs, 'chart'),
  forms: countIds(mediaTs, 'form'),
  sheets: countIds(mediaTs, 'sheet'),
  tables: countIds(mediaTs, 'table'),
  mockups: countIds(mediaTs, 'mockup'),
  models3d: countIds(mediaTs, 'model3d'),
};

const totalItems = Object.values(counts).reduce((a, b) => a + b, 0);

console.log('=== FULL 14-CATEGORY CATALOGUE & DISK REPORT ===');
console.log('Category Breakdown:', counts);
console.log(`Total Manifest Items: ${totalItems} (Required: 1117)`);
console.log(`Static SVG Shape files on disk: ${shapeFiles.length} (Required: 312)`);
console.log(`Static SVG Graphic files on disk: ${graphicFiles.length} (Required: 360)`);
console.log(`Invalid SVG files count: ${invalidSvgCount} (Required: 0)`);

if (
  totalItems < 1117 ||
  shapeFiles.length < 312 ||
  graphicFiles.length < 360 ||
  invalidSvgCount > 0
) {
  process.exit(1);
}
console.log('ALL 1,117 ELEMENTS & 672 STATIC SVG FILES VALIDATED SUCCESSFULLY!');
