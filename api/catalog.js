import { readCatalog } from '../server/catalog.js';
import { sendJson, methodNotAllowed } from '../server/admin.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const { catalog } = await readCatalog();
    return sendJson(res, 200, catalog, { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' });
  } catch {
    return sendJson(res, 503, { error: 'The template catalog is temporarily unavailable.' });
  }
}

