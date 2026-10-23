import { clearSessionCookie, isSameOriginRequest, methodNotAllowed, sendJson } from '../../server/admin.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!isSameOriginRequest(req)) return sendJson(res, 403, { error: 'Request origin is not allowed.' });
  clearSessionCookie(res);
  return sendJson(res, 200, { ok: true });
}

