function parseHexColor(hex: string): [number, number, number] | null {
  const match = hex.trim().match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
  return match ? [parseInt(match[1], 16), parseInt(match[2], 16), parseInt(match[3], 16)] : null;
}

function luminance(color: [number, number, number]): number {
  const [red, green, blue] = color.map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrastRatio(first: [number, number, number], second: [number, number, number]): number {
  const firstLuminance = luminance(first);
  const secondLuminance = luminance(second);
  return (Math.max(firstLuminance, secondLuminance) + 0.05) / (Math.min(firstLuminance, secondLuminance) + 0.05);
}

function mixColors(first: [number, number, number], second: [number, number, number], amount: number): [number, number, number] {
  return first.map((channel, index) => Math.round(channel + (second[index] - channel) * amount)) as [number, number, number];
}

function toHex(color: [number, number, number]): string {
  return `#${color.map((channel) => channel.toString(16).padStart(2, '0')).join('')}`;
}

/** Preserve a palette color, moving it toward black or white only as far as needed for readable text. */
export function ensureTextContrast(color: string, background: string, minimum = 4.5): string {
  const original = parseHexColor(color);
  const backdrop = parseHexColor(background);
  if (!original || !backdrop || contrastRatio(original, backdrop) >= minimum) return color;

  const target: [number, number, number] = luminance(backdrop) > 0.179 ? [0, 0, 0] : [255, 255, 255];
  for (let step = 1; step <= 100; step += 1) {
    const candidate = mixColors(original, target, step / 100);
    if (contrastRatio(candidate, backdrop) >= minimum) {
      return toHex(candidate);
    }
  }
  return target[0] === 0 ? '#000000' : '#ffffff';
}

/** Pick the smallest readable adjustment that works over every color in a gradient. */
export function ensureTextContrastOnAll(color: string, backgrounds: string[], minimum = 4.5): string {
  const original = parseHexColor(color);
  const backdrops = backgrounds.map(parseHexColor).filter((value): value is [number, number, number] => value !== null);
  if (!original || backdrops.length === 0) return color;
  const minimumContrast = (candidate: [number, number, number]) =>
    Math.min(...backdrops.map((backdrop) => contrastRatio(candidate, backdrop)));
  if (minimumContrast(original) >= minimum) return color;

  const options = ([[0, 0, 0], [255, 255, 255]] as [number, number, number][]).map((target) => {
    for (let step = 1; step <= 100; step += 1) {
      const candidate = mixColors(original, target, step / 100);
      if (minimumContrast(candidate) >= minimum) return { color: candidate, amount: step };
    }
    return { color: target, amount: 101 };
  });
  const readable = options.filter((option) => minimumContrast(option.color) >= minimum);
  const best = (readable.length ? readable : options).sort((first, second) => first.amount - second.amount)[0];
  return toHex(best.color);
}
