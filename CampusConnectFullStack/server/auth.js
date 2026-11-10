// Password hashing (scrypt) and signed tokens (HS256 JWT) using only Node's built-in crypto.
import crypto from 'node:crypto';

const DEV_SECRET = 'dev-only-secret-change-me';
const SECRET = process.env.JWT_SECRET || DEV_SECRET;
if (process.env.NODE_ENV === 'production' && SECRET === DEV_SECRET) {
  throw new Error('JWT_SECRET must be set in production (any long random string).');
}

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  return `scrypt$${salt}$${crypto.scryptSync(password, salt, 64).toString('hex')}`;
}

export function verifyPassword(password, stored) {
  const [alg, salt, hash] = String(stored).split('$');
  if (alg !== 'scrypt' || !salt || !hash) return false;
  const expected = Buffer.from(hash, 'hex');
  const actual = crypto.scryptSync(password, salt, 64);
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
}

const b64 = (input) => Buffer.from(input).toString('base64url');
const sign = (data) => crypto.createHmac('sha256', SECRET).update(data).digest('base64url');

export function signToken(userId, seconds = 7 * 24 * 3600) {
  const head = b64(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + seconds }));
  return `${head}.${body}.${sign(`${head}.${body}`)}`;
}

export function verifyToken(token) {
  const parts = String(token).split('.');
  if (parts.length !== 3) return null;
  const expected = Buffer.from(sign(`${parts[0]}.${parts[1]}`));
  const given = Buffer.from(parts[2]);
  if (expected.length !== given.length || !crypto.timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}
