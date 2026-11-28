export interface ResolvedLocationResult {
  label: string;
  venueName: string;
  cityLabel: string;
  fullAddress: string;
  mapUrl: string;
  lat?: number;
  lng?: number;
}

const PLUS_CODE_REGEX = /\b[23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3}\b/i;

const INDIAN_STATE_ABBR: Record<string, string> = {
  AP: 'Andhra Pradesh',
  AR: 'Arunachal Pradesh',
  AS: 'Assam',
  BR: 'Bihar',
  CG: 'Chhattisgarh',
  CH: 'Chandigarh',
  DL: 'Delhi',
  GA: 'Goa',
  GJ: 'Gujarat',
  HP: 'Himachal Pradesh',
  HR: 'Haryana',
  JH: 'Jharkhand',
  JK: 'Jammu and Kashmir',
  KA: 'Karnataka',
  KL: 'Kerala',
  MH: 'Maharashtra',
  MP: 'Madhya Pradesh',
  OD: 'Odisha',
  OR: 'Odisha',
  PB: 'Punjab',
  RJ: 'Rajasthan',
  TN: 'Tamil Nadu',
  TS: 'Telangana',
  UK: 'Uttarakhand',
  UP: 'Uttar Pradesh',
  WB: 'West Bengal',
};

export function isLikelyMapUrl(raw: string): boolean {
  const text = raw.trim();
  if (!text) return false;
  return /^(https?:\/\/)?(www\.)?(maps\.app\.goo\.gl|goo\.gl\/maps|maps\.google\.[a-z.]+|google\.[a-z.]+\/maps)/i.test(
    text
  );
}

export function isShortMapUrl(raw: string): boolean {
  const text = raw.trim();
  if (!text) return false;
  return /^(https?:\/\/)?(www\.)?(maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(text);
}

/**
 * Builds a 100% free, zero-API direct Google Maps redirect URL that opens
 * straight inside the Google Maps app / browser on any guest's phone.
 */
export function buildDirectGoogleMapsUrl(
  venue?: string,
  address?: string,
  city?: string
): string {
  const v = (venue || '').trim();
  const a = (address || '').trim();
  const c = (city || '').trim();

  const segments: string[] = [];
  if (a) {
    const aLower = a.toLowerCase();
    if (v && !aLower.includes(v.toLowerCase())) {
      segments.push(v);
    }
    segments.push(a);
    if (c && !aLower.includes(c.split(',')[0].trim().toLowerCase())) {
      segments.push(c);
    }
  } else {
    if (v) segments.push(v);
    if (c && !v.toLowerCase().includes(c.split(',')[0].trim().toLowerCase())) {
      segments.push(c);
    }
  }

  const query = segments.join(', ').trim();
  if (!query) return '';
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function normalizeStateToken(rawSegment: string): string {
  const withoutPin = rawSegment.replace(/\b\d{5,6}\b/g, '').trim();
  if (!withoutPin) return '';
  const upper = withoutPin.toUpperCase();
  return INDIAN_STATE_ABBR[upper] || withoutPin;
}

/**
 * Deterministic zero-API local parser for Google Maps Plus Codes,
 * full Indian/international addresses, and raw lat/lng coordinates.
 */
export function parseRawAddressOrPlusCodeLocally(rawText: string): ResolvedLocationResult | null {
  const trimmed = rawText.trim();
  if (!trimmed || trimmed.length < 2) return null;

  // 1. Direct lat, lng coordinates
  const coordMatch = /^(-?\d{1,2}\.\d+)\s*,\s*(-?\d{1,3}\.\d+)$/.exec(trimmed);
  if (coordMatch) {
    const lat = Number(coordMatch[1]);
    const lng = Number(coordMatch[2]);
    return {
      label: trimmed,
      venueName: `Pinned Venue (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      cityLabel: '',
      fullAddress: trimmed,
      mapUrl: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      lat,
      lng,
    };
  }

  // 2. Split comma-separated parts and clean Plus Codes / country / PINs
  const rawParts = trimmed
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const expandedParts: string[] = [];
  for (const part of rawParts) {
    const plusPrefix = /^([23456789CFGHJMPQRVWX]{4,8}\+[23456789CFGHJMPQRVWX]{2,3})\s+(.+)$/i.exec(part);
    if (plusPrefix) {
      expandedParts.push(plusPrefix[1].trim(), plusPrefix[2].trim());
    } else {
      expandedParts.push(part);
    }
  }

  const nonCodeParts = expandedParts.filter(
    (p) => !PLUS_CODE_REGEX.test(p) && !/^(india|भारत|usa|united states|uk|united kingdom|\d{5,6})$/i.test(p)
  );

  let venueName = '';
  let cityLabel = '';

  if (nonCodeParts.length >= 4) {
    const statePart = normalizeStateToken(nonCodeParts[nonCodeParts.length - 1]);
    const cityPart = normalizeStateToken(nonCodeParts[nonCodeParts.length - 2]);
    cityLabel = [cityPart, statePart]
      .filter((p, idx, arr) => Boolean(p) && arr.indexOf(p) === idx)
      .join(', ');
    const leading = nonCodeParts.slice(0, nonCodeParts.length - 2);
    venueName = PLUS_CODE_REGEX.test(trimmed)
      ? leading.slice(0, 2).join(', ')
      : leading[0] || nonCodeParts[0];
  } else if (nonCodeParts.length === 3) {
    venueName = nonCodeParts[0];
    const cityPart = normalizeStateToken(nonCodeParts[1]);
    const statePart = normalizeStateToken(nonCodeParts[2]);
    cityLabel = [cityPart, statePart]
      .filter((p, idx, arr) => Boolean(p) && arr.indexOf(p) === idx)
      .join(', ');
  } else if (nonCodeParts.length === 2) {
    venueName = nonCodeParts[0];
    cityLabel = normalizeStateToken(nonCodeParts[1]);
  } else {
    venueName = nonCodeParts[0] || trimmed;
    cityLabel = '';
  }

  return {
    label: trimmed,
    venueName: venueName || trimmed,
    cityLabel,
    fullAddress: trimmed,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`,
  };
}

function cleanDecodedPlace(raw: string): string {
  try {
    return decodeURIComponent(raw.replace(/\+/g, ' ')).trim();
  } catch {
    return raw.replace(/\+/g, ' ').trim();
  }
}

export function parseGoogleMapsUrlLocally(rawUrl: string): ResolvedLocationResult | null {
  const trimmed = rawUrl.trim();
  if (!trimmed) return null;

  let normalizedUrl = trimmed;
  if (!/^https?:\/\//i.test(normalizedUrl)) {
    normalizedUrl = `https://${normalizedUrl}`;
  }

  try {
    const parsed = new URL(normalizedUrl);
    const fullStr = `${parsed.pathname}${parsed.search}${parsed.hash}`;

    let rawPlace = '';
    const placeMatch =
      /\/maps\/place\/([^/@?]+)/i.exec(parsed.pathname) ||
      /\/maps\/search\/([^/@?]+)/i.exec(parsed.pathname);
    if (placeMatch?.[1]) {
      rawPlace = cleanDecodedPlace(placeMatch[1]);
    }

    if (!rawPlace) {
      const qParam =
        parsed.searchParams.get('q') ||
        parsed.searchParams.get('query') ||
        parsed.searchParams.get('destination');
      if (qParam && !/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(qParam.trim())) {
        rawPlace = cleanDecodedPlace(qParam);
      }
    }

    let lat: number | undefined;
    let lng: number | undefined;
    const coordMatch =
      /!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/.exec(fullStr) ||
      /@(-?\d+\.\d+),(-?\d+\.\d+)/.exec(fullStr);
    if (coordMatch) {
      lat = Number(coordMatch[1]);
      lng = Number(coordMatch[2]);
    } else {
      const qCoords = /^(-?\d+\.\d+),\s*(-?\d+\.\d+)$/.exec(
        (parsed.searchParams.get('q') || parsed.searchParams.get('query') || '').trim()
      );
      if (qCoords) {
        lat = Number(qCoords[1]);
        lng = Number(qCoords[2]);
      }
    }

    if (rawPlace) {
      const parsedAddr = parseRawAddressOrPlusCodeLocally(rawPlace);
      if (parsedAddr) {
        return {
          ...parsedAddr,
          mapUrl: normalizedUrl,
          lat,
          lng,
        };
      }
    }

    if (lat !== undefined && lng !== undefined) {
      return {
        label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        venueName: '',
        cityLabel: '',
        fullAddress: '',
        mapUrl: normalizedUrl,
        lat,
        lng,
      };
    }

    return {
      label: normalizedUrl,
      venueName: '',
      cityLabel: '',
      fullAddress: '',
      mapUrl: normalizedUrl,
    };
  } catch {
    return null;
  }
}

/**
 * Resolves any pasted address, Plus Code, or Google Maps link with ZERO paid APIs.
 * - Regular addresses, Plus Codes, and full google.com/maps URLs resolve instantly in-browser.
 * - Short maps.app.goo.gl / goo.gl links follow HTTP redirect via our lightweight server route.
 */
export async function resolveLocationZeroApi(
  rawInput: string,
  signal?: AbortSignal
): Promise<ResolvedLocationResult> {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error('Paste a Google Maps link or address first.');
  }

  // Short share links need server-side redirect expansion so we can read the full place name
  if (isShortMapUrl(trimmed)) {
    try {
      const res = await fetch('/api/resolve-map-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
        signal,
      });
      const data = (await res.json().catch(() => ({}))) as {
        location?: ResolvedLocationResult;
        error?: string;
      };
      if (res.ok && data.location) {
        return data.location;
      }
    } catch {
      // Fall back to direct URL link preservation if offline
    }
    const localUrl = parseGoogleMapsUrlLocally(trimmed);
    if (localUrl) return localUrl;
  }

  if (isLikelyMapUrl(trimmed)) {
    const parsedUrl = parseGoogleMapsUrlLocally(trimmed);
    if (parsedUrl) return parsedUrl;
  }

  const parsedAddr = parseRawAddressOrPlusCodeLocally(trimmed);
  if (parsedAddr) return parsedAddr;

  throw new Error('Enter a valid venue address, Plus Code, or Google Maps link.');
}
