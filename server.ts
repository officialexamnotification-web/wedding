import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import catalogHandler from './api/catalog.js';
import adminCatalogHandler from './api/admin/catalog.js';
import adminLoginHandler from './api/admin/login.js';
import adminLogoutHandler from './api/admin/logout.js';
import adminSessionHandler from './api/admin/session.js';
import adminUploadHandler from './api/admin/upload.js';

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

  // Card Studio catalog and secured admin endpoints use the same handlers as
  // the deployment's serverless API routes, so local and deployed behavior match.
  app.all('/api/catalog', async (req, res) => { await catalogHandler(req, res); });
  app.all('/api/admin/catalog', async (req, res) => { await adminCatalogHandler(req, res); });
  app.all('/api/admin/login', async (req, res) => { await adminLoginHandler(req, res); });
  app.all('/api/admin/logout', async (req, res) => { await adminLogoutHandler(req, res); });
  app.all('/api/admin/session', async (req, res) => { await adminSessionHandler(req, res); });
  app.all('/api/admin/upload', async (req, res) => { await adminUploadHandler(req, res); });

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

      const properties: Record<string, { type: Type; description: string }> = {};
      const required: string[] = [];
      for (const [key] of entries) {
        properties[key] = {
          type: Type.STRING,
          description: `Converted ${targetLang === 'hi' ? 'Hindi (Devanagari)' : 'English'} text for "${key}".`,
        };
        required.push(key);
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
              `Convert every field value from ${directionLabel}.`,
              'Rules:',
              '1. Personal names, family names, cities, and venue names (keys like primaryName, partnerName, cityLabel, venueName, littleOnesNames, ev_*_venue): accurately transliterate into clean, natural Devanagari script with proper Indian matras (e.g., "Aarav" -> "आरव", "Aishwarya" -> "ऐश्वर्या", "Kshitij" -> "क्षितिज", "Udaipur, Rajasthan" -> "उदयपुर, राजस्थान").',
              '2. Parents fields (groomParents, brideParents): preserve exact names in Devanagari and use respectful Indian card phrasing like "श्री ... एवं श्रीमती ..." when appropriate, keeping newline breaks if present.',
              '3. Dates and RSVP deadlines (dateLabel, rsvpDeadline, ev_*_date): convert month/day names to clean Hindi (e.g., "12 – 14 February 2027" -> "12 – 14 फ़रवरी 2027", "Sunday, 28 Feb 2027" -> "रविवार, 28 फ़रवरी 2027"). Keep standard numerals (0-9) clear and readable.',
              '4. Invitation notes, elders blessings, directions, event titles, attire, milestone, and kids Bal Manuhar lines: translate naturally in warm, ceremonial Shuddh Hindi suitable for an Indian printed/digital invitation card. Keep kids Bal Manuhar cute and playful (e.g., "जलूल-जलूल आना!").',
              '5. Return ONLY a JSON object with the exact same keys as the input. Preserve any intentional line breaks (\\n). Never add extra commentary or markdown.',
            ].join('\n')
          : [
              `You are an expert Indian ${isBirthday ? 'birthday' : 'wedding'} invitation copywriter and transliterator.`,
              `Convert every field value from ${directionLabel}.`,
              'Rules:',
              '1. Personal names, family names, cities, and venue names (keys like primaryName, partnerName, cityLabel, venueName, littleOnesNames, ev_*_venue): accurately transliterate Devanagari into standard, elegant Indian English spelling (e.g., "आरव" -> "Aarav", "सिंघानिया" -> "Singhania", "उदयपुर, राजस्थान" -> "Udaipur, Rajasthan").',
              '2. Parents fields (groomParents, brideParents): render cleanly in elegant English card style (e.g., "Shri Rajesh & Smt. Sunita Sharma" or "Rajesh & Sunita Sharma"), preserving line breaks if present.',
              '3. Dates and RSVP deadlines (dateLabel, rsvpDeadline, ev_*_date): format naturally in English (e.g., "12 – 14 February 2027", "01 Feb 2027").',
              '4. Invitation notes, elders blessings, directions, event titles, attire, milestone, and kids Bal Manuhar lines: translate naturally in warm, graceful Indian-English invitation style. For cute kids Bal Manuhar lines, keep the playful Hinglish charm (e.g., "“Mele Chachu ki shaadi mein jalool-jalool aana!”").',
              '5. Return ONLY a JSON object with the exact same keys as the input. Preserve any intentional line breaks (\\n). Never add extra commentary or markdown.',
            ].join('\n');

      const response = await callGeminiWithRetry(() =>
        ai.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: `Convert the following invitation fields JSON into ${targetLang === 'hi' ? 'Hindi (Devanagari)' : 'English'}:\n${JSON.stringify(inputPayload)}`,
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties,
              required,
            },
            thinkingConfig: {
              thinkingLevel: ThinkingLevel.LOW,
            },
          },
        })
      );

      const rawText = (response.text ?? '{}').trim();
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
      const safeStatus = status >= 400 && status < 600 ? status : 500;
      res.status(safeStatus).json({ error: message });
    }
  });

  if (IS_PROD) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get(['/card-studio/admin', '/card-studio/admin/*', '/card-studio/jyotish-studio', '/card-studio/jyotish-studio/*'], (_req, res) => {
      res.sendFile(path.join(distDir, 'card-studio', 'index.html'));
    });
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
