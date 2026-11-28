import { isAdminRequest, isSameOriginRequest, methodNotAllowed, sendJson } from '../../server/admin.js';
import { readCatalog, validCatalog, writeCatalog } from '../../server/catalog.js';

export default async function handler(req, res) {
  if (!['GET', 'PUT'].includes(req.method)) return methodNotAllowed(res, ['GET', 'PUT']);
  if (!isAdminRequest(req)) return sendJson(res, 401, { error: 'Please sign in to manage templates.' });
  if (req.method === 'GET') {
    try {
      const { catalog } = await readCatalog();
      return sendJson(res, 200, catalog);
    } catch {
      return sendJson(res, 503, { error: 'The template catalog is temporarily unavailable.' });
    }
  }
  if (!isSameOriginRequest(req)) return sendJson(res, 403, { error: 'Request origin is not allowed.' });
  const { catalog, baseRevision } = req.body || {};
  if (!Number.isInteger(baseRevision) || !validCatalog(catalog)) {
    return sendJson(res, 400, { error: 'The catalog payload is invalid.' });
  }
  try {
    const result = await writeCatalog(catalog, baseRevision);
    if (result.conflict) return sendJson(res, 409, { error: 'Another save happened first. Reload the latest catalog before saving again.', catalog: result.catalog });
    return sendJson(res, 200, result.catalog);
  } catch {
    return sendJson(res, 503, { error: 'Could not save the catalog. Check the Vercel Blob store configuration.' });
  }
}

