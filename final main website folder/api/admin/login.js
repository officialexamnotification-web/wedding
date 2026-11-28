import { clearLoginAttempts, credentialsReady, issueSessionCookie, isSameOriginRequest, loginThrottle, methodNotAllowed, recordLoginAttempt, sendJson, verifyCredentials } from '../../server/admin.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  if (!isSameOriginRequest(req)) return sendJson(res, 403, { error: 'Request origin is not allowed.' });
  if (!credentialsReady()) return sendJson(res, 503, { error: 'Admin environment variables are not configured yet.' });
  const retryAfter = loginThrottle(req);
  if (retryAfter) return sendJson(res, 429, { error: 'Too many sign-in attempts. Try again in 15 minutes.' }, { 'Retry-After': String(retryAfter) });
  const { username, password } = req.body || {};
  if (typeof username !== 'string' || typeof password !== 'string' || username.length > 160 || password.length > 512) {
    return sendJson(res, 400, { error: 'Enter your admin username and password.' });
  }
  if (!verifyCredentials(username, password)) {
    recordLoginAttempt(req);
    return sendJson(res, 401, { error: 'Username or password is incorrect.' });
  }
  clearLoginAttempts(req);
  issueSessionCookie(res);
  return sendJson(res, 200, { ok: true });
}

