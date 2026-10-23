import { createHmac, createHash, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'nimantran_admin_session';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const LOGIN_MAX_ATTEMPTS = 8;
const loginAttempts = new Map();

export function sendJson(res, status, data, headers = {}) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
  res.end(JSON.stringify(data));
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  sendJson(res, 405, { error: 'Method not allowed.' });
}

export function credentialsReady() {
  return Boolean(
    process.env.ADMIN_USERNAME &&
    process.env.ADMIN_PASSWORD &&
    process.env.ADMIN_SESSION_SECRET &&
    process.env.ADMIN_SESSION_SECRET.length >= 32
  );
}

function constantTimeEqual(left, right) {
  const a = createHash('sha256').update(String(left)).digest();
  const b = createHash('sha256').update(String(right)).digest();
  return timingSafeEqual(a, b);
}

function sign(value) {
  return createHmac('sha256', process.env.ADMIN_SESSION_SECRET).update(value).digest('base64url');
}

export function issueSessionCookie(res) {
  const payload = Buffer.from(JSON.stringify({
    user: process.env.ADMIN_USERNAME,
    expires: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  })).toString('base64url');
  const value = `${payload}.${sign(payload)}`;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${value}; HttpOnly; Path=/api; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure}`);
}

export function clearSessionCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/api; SameSite=Strict; Max-Age=0${secure}`);
}

function readCookie(req) {
  const cookies = String(req.headers.cookie || '').split(';');
  const entry = cookies.map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  return entry ? entry.slice(COOKIE_NAME.length + 1) : '';
}

export function isAdminRequest(req) {
  if (!credentialsReady()) return false;
  const token = readCookie(req);
  const [payload, signature, extra] = token.split('.');
  if (!payload || !signature || extra) return false;
  if (!constantTimeEqual(signature, sign(payload))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return session.user === process.env.ADMIN_USERNAME && Number(session.expires) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

export function isSameOriginRequest(req) {
  const origin = req.headers.origin;
  if (!origin) return false;
  try {
    const parsed = new URL(origin);
    const host = String(req.headers.host || '').split(',')[0].trim();
    return parsed.host.toLowerCase() === host.toLowerCase();
  } catch {
    return false;
  }
}

function clientAddress(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

export function loginThrottle(req) {
  const now = Date.now();
  const key = clientAddress(req);
  const recent = (loginAttempts.get(key) || []).filter((timestamp) => now - timestamp < LOGIN_WINDOW_MS);
  loginAttempts.set(key, recent);
  for (const [address, timestamps] of loginAttempts) {
    if (!timestamps.length || now - timestamps[timestamps.length - 1] >= LOGIN_WINDOW_MS) loginAttempts.delete(address);
  }
  return recent.length >= LOGIN_MAX_ATTEMPTS
    ? Math.max(1, Math.ceil((LOGIN_WINDOW_MS - (now - recent[0])) / 1000))
    : 0;
}

export function recordLoginAttempt(req) {
  const key = clientAddress(req);
  loginAttempts.set(key, [...(loginAttempts.get(key) || []), Date.now()]);
}

export function clearLoginAttempts(req) {
  loginAttempts.delete(clientAddress(req));
}

export function verifyCredentials(username, password) {
  return credentialsReady() &&
    constantTimeEqual(username, process.env.ADMIN_USERNAME) &&
    constantTimeEqual(password, process.env.ADMIN_PASSWORD);
}

