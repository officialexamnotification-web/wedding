import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

function createGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

interface TranslateRequestBody {
  sourceLang?: 'en' | 'hi';
  targetLang?: 'en' | 'hi';
  isBirthday?: boolean;
  fields?: Record<string, string>;
}

const MAX_FIELDS = 64;
const MAX_FIELD_LEN = 800;

async function callGeminiWithRetry<T>(fn: () => Promise<T>, maxAttempts = 2): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastErr = err;
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status?: unknown }).status)
          : 0;
      const isTransient = status === 429 || status >= 500 || status === 0;
      if (!isTransient || attempt === maxAttempts) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, 450 * attempt));
    }
  }
  throw lastErr;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.post('/api/translate-invite', async (req: Request, res: Response) => {
    try {
      const body = (req.body || {}) as TranslateRequestBody;
      const sourceLang = body.sourceLang === 'hi' ? 'hi' : 'en';
      const targetLang = body.targetLang === 'hi' ? 'hi' : 'en';
      const isBirthday = Boolean(body.isBirthday);
      const rawFields = body.fields;

      if (!rawFields || typeof rawFields !== 'object' || Array.isArray(rawFields)) {
        res.status(400).json({ error: 'Invalid fields payload.' });
        return;
      }

      const entries = Object.entries(rawFields)
        .filter(([, value]) => typeof value === 'string' && value.trim().length > 0)
        .slice(0, MAX_FIELDS)
        .map(([key, value]) => [key, value.slice(0, MAX_FIELD_LEN)] as const);

      if (entries.length === 0) {
        res.json({ translated: {} });
        return;
      }

      if (sourceLang === targetLang) {
        res.json({ translated: Object.fromEntries(entries) });
        return;
      }

      const ai = createGeminiClient();
      if (!ai) {
        res.status(503).json({
          error:
            'Auto-translation service is not configured. Please check GEMINI_API_KEY in Settings > Secrets.',
        });
        return;
      }

      const inputPayload = Object.fromEntries(entries);
      const directionLabel =
        targetLang === 'hi'
          ? 'English (or Hinglish) to pure, authentic Devanagari Hindi'
          : 'Hindi (Devanagari or Hinglish) to graceful, natural English';

      const systemInstruction =
        targetLang === 'hi'
          ? [
              `You are an expert Indian ${isBirthday ? 'birthday (Janmotsav)' : 'wedding (Shubh Vivah)'} invitation copywriter and phonetic transliterator.`,
              `Convert every JSON field value from ${directionLabel}.`,
              'Rules:',
              '1. Personal names, family names, cities, and venue names: accurately transliterate into clean, natural Devanagari script with proper Indian matras (e.g., "Aarav" -> "आरव", "Aishwarya" -> "ऐश्वर्या", "Udaipur, Rajasthan" -> "उदयपुर, राजस्थान").',
              '2. Parents fields: preserve exact names in Devanagari and use respectful Indian card phrasing like "श्री ... एवं श्रीमती ..." when appropriate, keeping newline breaks if present.',
              '3. Dates and RSVP deadlines: convert month/day names to clean Hindi (e.g., "12 – 14 February 2027" -> "12 – 14 फ़रवरी 2027"). Keep standard digits (0-9).',
              '4. Invitation notes, elders blessings, directions, event titles, attire, milestone, and kids Bal Manuhar lines: translate naturally in warm, ceremonial Shuddh Hindi.',
              '5. Return ONLY a valid JSON object with the EXACT same keys as the input JSON. Preserve \\n line breaks. No markdown fences or commentary.',
            ].join('\n')
          : [
              `You are an expert Indian ${isBirthday ? 'birthday' : 'wedding'} invitation copywriter and transliterator.`,
              `Convert every JSON field value from ${directionLabel}.`,
              'Rules:',
              '1. Personal names, family names, cities, and venue names: accurately transliterate Devanagari into standard, elegant Indian English spelling (e.g., "आरव" -> "Aarav", "उदयपुर, राजस्थान" -> "Udaipur, Rajasthan").',
              '2. Parents fields: render cleanly in elegant English card style, preserving line breaks if present.',
              '3. Dates and RSVP deadlines: format naturally in English.',
              '4. Invitation notes, elders blessings, directions, event titles, attire, milestone, and kids Bal Manuhar lines: translate naturally in warm, graceful Indian-English invitation style.',
              '5. Return ONLY a valid JSON object with the EXACT same keys as the input JSON. Preserve \\n line breaks. No markdown fences or commentary.',
            ].join('\n');

      const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
        new Promise<T>((resolve, reject) => {
          const timer = setTimeout(() => {
            reject(Object.assign(new Error('Translation service timed out. Please retry.'), { status: 504 }));
          }, ms);
          promise.then(
            (val) => {
              clearTimeout(timer);
              resolve(val);
            },
            (err) => {
              clearTimeout(timer);
              reject(err);
            }
          );
        });

      const response = await callGeminiWithRetry(() =>
        withTimeout(
          ai.models.generateContent({
            model: 'gemini-3.1-flash-lite',
            contents: `Convert this JSON object into ${targetLang === 'hi' ? 'Hindi (Devanagari)' : 'English'} keeping the exact keys:\n${JSON.stringify(inputPayload)}`,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              thinkingConfig: {
                thinkingLevel: ThinkingLevel.MINIMAL,
              },
            },
          }),
          11000
        )
      );

      let rawText = (response.text ?? '{}').trim();
      if (rawText.startsWith('```')) {
        rawText = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
      }
      const parsed = JSON.parse(rawText) as Record<string, unknown>;
      const translated: Record<string, string> = {};
      for (const [key] of entries) {
        const val = parsed[key];
        if (typeof val === 'string' && val.trim().length > 0) {
          translated[key] = val.trim();
        }
      }

      res.json({ translated });
    } catch (err: unknown) {
      const status =
        typeof err === 'object' && err !== null && 'status' in err
          ? Number((err as { status?: unknown }).status)
          : 500;
      const message =
        err instanceof Error ? err.message : 'Translation request failed. Please try again.';
      console.error('[/api/translate-invite] error:', status, message);
      const safeStatus = status >= 400 && status < 600 ? status : 500;
      res.status(safeStatus).json({ error: message });
    }
  });

  // Zero-API Google Maps short-link redirect resolver & Plus Code / address parser (100% free, no API keys)
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

  function normalizeStatePart(segment: string): string {
    const cleaned = segment.replace(/\b\d{5,6}\b/g, '').trim();
    if (!cleaned) return '';
    return INDIAN_STATE_ABBR[cleaned.toUpperCase()] || cleaned;
  }

  function parseAddressLocallyOnServer(rawText: string, explicitMapUrl?: string) {
    const trimmed = rawText.trim();
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

    const cleanParts = expandedParts.filter(
      (p) => !PLUS_CODE_REGEX.test(p) && !/^(india|भारत|usa|united states|uk|united kingdom|\d{5,6})$/i.test(p)
    );

    let venueName = '';
    let cityLabel = '';

    if (cleanParts.length >= 4) {
      const statePart = normalizeStatePart(cleanParts[cleanParts.length - 1]);
      const cityPart = normalizeStatePart(cleanParts[cleanParts.length - 2]);
      cityLabel = [cityPart, statePart]
        .filter((p, idx, arr) => Boolean(p) && arr.indexOf(p) === idx)
        .join(', ');
      const leading = cleanParts.slice(0, cleanParts.length - 2);
      venueName = PLUS_CODE_REGEX.test(trimmed) ? leading.slice(0, 2).join(', ') : leading[0] || cleanParts[0];
    } else if (cleanParts.length === 3) {
      venueName = cleanParts[0];
      const cityPart = normalizeStatePart(cleanParts[1]);
      const statePart = normalizeStatePart(cleanParts[2]);
      cityLabel = [cityPart, statePart]
        .filter((p, idx, arr) => Boolean(p) && arr.indexOf(p) === idx)
        .join(', ');
    } else if (cleanParts.length === 2) {
      venueName = cleanParts[0];
      cityLabel = normalizeStatePart(cleanParts[1]);
    } else {
      venueName = cleanParts[0] || trimmed;
    }

    return {
      label: trimmed,
      venueName: venueName || trimmed,
      cityLabel,
      fullAddress: trimmed,
      mapUrl:
        explicitMapUrl ||
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(trimmed)}`,
    };
  }

  app.post('/api/resolve-map-link', async (req: Request, res: Response) => {
    try {
      const rawUrl = String((req.body as { url?: unknown })?.url || '').trim();
      if (!rawUrl) {
        res.status(400).json({ error: 'Please paste a Google Maps link or address first.' });
        return;
      }

      const looksLikeUrl =
        /^(https?:\/\/)?(www\.)?(google\.[a-z.]+|maps\.google\.[a-z.]+|goo\.gl|maps\.app\.goo\.gl)/i.test(
          rawUrl
        );

      if (!looksLikeUrl) {
        res.json({ location: parseAddressLocallyOnServer(rawUrl) });
        return;
      }

      const normalized = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
      let parsed: URL;
      try {
        parsed = new URL(normalized);
      } catch {
        res.status(400).json({ error: 'Invalid URL format.' });
        return;
      }

      const allowedHost = /(^|\.)(google\.[a-z.]+|goo\.gl|maps\.app\.goo\.gl)$/i.test(parsed.hostname);
      if (!allowedHost) {
        res.status(400).json({
          error: 'Please paste a Google Maps share link (maps.app.goo.gl or google.com/maps).',
        });
        return;
      }

      let finalUrl = normalized;
      if (/(^|\.)(goo\.gl|maps\.app\.goo\.gl)$/i.test(parsed.hostname)) {
        try {
          const resp = await fetch(normalized, {
            method: 'GET',
            redirect: 'follow',
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NimantranMapResolver/1.0)' },
            signal: AbortSignal.timeout(7000),
          });
          if (resp.url) {
            finalUrl = resp.url;
          }
        } catch {
          // Proceed with original URL if redirect fetch fails
        }
      }

      const finalParsed = new URL(finalUrl);
      const fullStr = `${finalParsed.pathname}${finalParsed.search}${finalParsed.hash}`;
      let extractedPlace = '';
      const placeMatch =
        /\/maps\/place\/([^/@?]+)/i.exec(finalParsed.pathname) ||
        /\/maps\/search\/([^/@?]+)/i.exec(finalParsed.pathname);
      if (placeMatch?.[1]) {
        extractedPlace = decodeURIComponent(placeMatch[1].replace(/\+/g, ' ')).trim();
      }
      if (!extractedPlace) {
        const qParam =
          finalParsed.searchParams.get('q') ||
          finalParsed.searchParams.get('query') ||
          finalParsed.searchParams.get('destination');
        if (qParam && !/^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/.test(qParam.trim())) {
          extractedPlace = decodeURIComponent(qParam.replace(/\+/g, ' ')).trim();
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
          (finalParsed.searchParams.get('q') || finalParsed.searchParams.get('query') || '').trim()
        );
        if (qCoords) {
          lat = Number(qCoords[1]);
          lng = Number(qCoords[2]);
        }
      }

      if (extractedPlace) {
        res.json({
          location: {
            ...parseAddressLocallyOnServer(extractedPlace, normalized),
            lat,
            lng,
          },
        });
        return;
      }

      if (lat !== undefined && lng !== undefined) {
        res.json({
          location: {
            label: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
            venueName: '',
            cityLabel: '',
            fullAddress: '',
            mapUrl: normalized,
            lat,
            lng,
          },
        });
        return;
      }

      // Even if a short link didn't expose text in URL, still preserve it as a working direct Maps link!
      res.json({
        location: {
          label: normalized,
          venueName: '',
          cityLabel: '',
          fullAddress: '',
          mapUrl: normalized,
        },
      });
    } catch (err) {
      console.error('[/api/resolve-map-link] error:', err instanceof Error ? err.message : err);
      res.status(500).json({ error: 'Could not read map link right now.' });
    }
  });

  if (IS_PROD) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
