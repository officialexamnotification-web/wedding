// Client-side media compression & IndexedDB audio storage for Saath Studio customizer

const DB_NAME = 'saath_studio_media_v1';
const AUDIO_STORE = 'audio_tracks';

const audioUrlCache = new Map<string, string>();

function openMediaDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB unavailable'));
      return;
    }
    const req = window.indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(AUDIO_STORE)) {
        db.createObjectStore(AUDIO_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('Failed to open media DB'));
  });
}

export async function compressImageToDataUrl(
  file: File,
  maxDim = 920,
  quality = 0.8
): Promise<string> {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose a valid image file (JPG, PNG, WEBP).');
  }

  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Could not read image'));
    };
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Could not decode image'));
    image.src = dataUrl;
  });

  const ratio = Math.min(1, maxDim / Math.max(img.width || 1, img.height || 1));
  const targetW = Math.max(1, Math.round(img.width * ratio));
  const targetH = Math.max(1, Math.round(img.height * ratio));

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0, targetW, targetH);

  // Prefer crisp compact WebP, fallback to JPEG
  const webp = canvas.toDataURL('image/webp', quality);
  if (webp.startsWith('data:image/webp')) {
    return webp;
  }
  return canvas.toDataURL('image/jpeg', quality);
}

export async function storeCustomAudio(
  themeId: string,
  file: File
): Promise<{ audioKey: string; blobUrl: string; fileName: string }> {
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('Audio file is over 20 MB. Please choose a shorter MP3/M4A clip.');
  }

  const audioKey = `audio-${themeId}`;
  const existing = audioUrlCache.get(audioKey);
  if (existing) {
    URL.revokeObjectURL(existing);
    audioUrlCache.delete(audioKey);
  }

  try {
    const db = await openMediaDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE, 'readwrite');
      const store = tx.objectStore(AUDIO_STORE);
      store.put(file, audioKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('Failed to store audio'));
    });
  } catch {
    // Even if IndexedDB fails in private mode, session blob URL works cleanly
  }

  const blobUrl = URL.createObjectURL(file);
  audioUrlCache.set(audioKey, blobUrl);
  return { audioKey, blobUrl, fileName: file.name };
}

export async function loadCustomAudioUrl(audioKey: string): Promise<string | null> {
  if (!audioKey) return null;
  const cached = audioUrlCache.get(audioKey);
  if (cached) return cached;

  try {
    const db = await openMediaDb();
    const blob = await new Promise<Blob | undefined>((resolve, reject) => {
      const tx = db.transaction(AUDIO_STORE, 'readonly');
      const store = tx.objectStore(AUDIO_STORE);
      const req = store.get(audioKey);
      req.onsuccess = () => resolve(req.result as Blob | undefined);
      req.onerror = () => reject(req.error);
    });
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    audioUrlCache.set(audioKey, url);
    return url;
  } catch {
    return null;
  }
}

export async function deleteCustomAudio(audioKey: string): Promise<void> {
  if (!audioKey) return;
  const cached = audioUrlCache.get(audioKey);
  if (cached) {
    URL.revokeObjectURL(cached);
    audioUrlCache.delete(audioKey);
  }
  try {
    const db = await openMediaDb();
    await new Promise<void>((resolve) => {
      const tx = db.transaction(AUDIO_STORE, 'readwrite');
      tx.objectStore(AUDIO_STORE).delete(audioKey);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    });
  } catch {
    // ignore
  }
}
