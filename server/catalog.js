import { BlobPreconditionFailedError, get, put } from '@vercel/blob';

const CATALOG_PATH = 'nimantran/admin/catalog-v1.json';
const emptyCatalog = () => ({ version: 1, revision: 0, overrides: {}, added: [], hiddenIds: [], customAudioTracks: [] });

async function readText(stream) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

export async function readCatalog() {
  const result = await get(CATALOG_PATH, { access: 'private' });
  if (!result || result.statusCode !== 200 || !result.stream) {
    return { catalog: emptyCatalog(), etag: null };
  }
  try {
    const parsed = JSON.parse(await readText(result.stream));
    return {
      catalog: {
        version: 1,
        revision: Number.isInteger(parsed.revision) ? parsed.revision : 0,
        overrides: parsed.overrides && typeof parsed.overrides === 'object' && !Array.isArray(parsed.overrides) ? parsed.overrides : {},
        added: Array.isArray(parsed.added) ? parsed.added : [],
        hiddenIds: Array.isArray(parsed.hiddenIds) ? parsed.hiddenIds : [],
        customAudioTracks: Array.isArray(parsed.customAudioTracks) ? parsed.customAudioTracks : [],
      },
      etag: result.blob.etag,
    };
  } catch {
    throw new Error('The stored catalog could not be read.');
  }
}

export function validCatalog(value) {
  return Boolean(
    value && typeof value === 'object' &&
    value.overrides && typeof value.overrides === 'object' && !Array.isArray(value.overrides) &&
    Array.isArray(value.added) && Array.isArray(value.hiddenIds) && Array.isArray(value.customAudioTracks) &&
    value.added.length <= 1000 && Object.keys(value.overrides).length <= 1000 &&
    value.hiddenIds.length <= 1000 && value.customAudioTracks.length <= 500
  );
}

export async function writeCatalog(next, expectedRevision) {
  const current = await readCatalog();
  if (current.catalog.revision !== expectedRevision) {
    return { conflict: true, catalog: current.catalog };
  }
  const saved = {
    version: 1,
    revision: current.catalog.revision + 1,
    overrides: next.overrides,
    added: next.added,
    hiddenIds: next.hiddenIds,
    customAudioTracks: next.customAudioTracks,
  };
  try {
    await put(CATALOG_PATH, JSON.stringify(saved), {
      access: 'private',
      contentType: 'application/json; charset=utf-8',
      addRandomSuffix: false,
      allowOverwrite: true,
      ...(current.etag ? { ifMatch: current.etag } : {}),
    });
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError) {
      const latest = await readCatalog();
      return { conflict: true, catalog: latest.catalog };
    }
    throw error;
  }
  return { conflict: false, catalog: saved };
}

