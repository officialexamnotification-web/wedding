import { Language } from '../data/weddingData';
export { offlineTranslateInviteFields } from './offlineTranslate';

export interface TranslateInviteResponse {
  translated: Record<string, string>;
}

export function isBrowserOffline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine === false;
}

export async function translateInviteFields(params: {
  sourceLang: Language;
  targetLang: Language;
  isBirthday: boolean;
  fields: Record<string, string>;
  signal?: AbortSignal;
}): Promise<Record<string, string>> {
  const nonEmptyEntries = Object.entries(params.fields).filter(
    ([, val]) => typeof val === 'string' && val.trim().length > 0
  );
  if (nonEmptyEntries.length === 0 || params.sourceLang === params.targetLang) {
    return {};
  }

  const timeoutController = new AbortController();
  const timeoutId = window.setTimeout(() => timeoutController.abort(), 14000);
  const onParentAbort = () => timeoutController.abort();
  params.signal?.addEventListener('abort', onParentAbort, { once: true });

  try {
    const res = await fetch('/api/translate-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceLang: params.sourceLang,
        targetLang: params.targetLang,
        isBirthday: params.isBirthday,
        fields: Object.fromEntries(nonEmptyEntries),
      }),
      signal: timeoutController.signal,
    });

    const data = (await res.json().catch(() => ({}))) as Partial<TranslateInviteResponse> & {
      error?: string;
    };

    if (!res.ok) {
      throw new Error(data.error || `Translation failed (${res.status}).`);
    }

    return data.translated && typeof data.translated === 'object' ? data.translated : {};
  } catch (err) {
    if (params.signal?.aborted) {
      throw err;
    }
    if (timeoutController.signal.aborted) {
      throw new Error('Online translation timed out. You can Retry or use Convert Offline.');
    }
    throw err instanceof Error
      ? err
      : new Error('Network unavailable. You can Retry or use Convert Offline.');
  } finally {
    window.clearTimeout(timeoutId);
    params.signal?.removeEventListener('abort', onParentAbort);
  }
}
