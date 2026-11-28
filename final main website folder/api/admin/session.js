import { credentialsReady, isAdminRequest, methodNotAllowed, sendJson } from '../../server/admin.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  if (!credentialsReady()) return sendJson(res, 503, { authenticated: false, error: 'Admin environment variables are not configured yet.' });
  return sendJson(res, 200, { authenticated: isAdminRequest(req) });
}

