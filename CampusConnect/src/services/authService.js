// DEMO AUTHENTICATION ONLY.
// Passwords are mock data stored in the browser's localStorage and compared in plain text.
// This is NOT secure and must never be used in production.
// Later replacement: POST /api/auth/login, POST /api/auth/register (JWT/session cookie).
import { makeId } from '../utils/formatters';
import { ROLES, USER_STATUS } from '../utils/constants';
import { setSessionUserId, clearSession } from './storage';

export function login(db, email, password) {
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').trim().toLowerCase());
  if (!user || user.password !== password) throw new Error('Incorrect email or password.');
  if (user.status === USER_STATUS.DISABLED) throw new Error('This account is disabled. Contact an administrator.');
  setSessionUserId(user.userId);
  return user;
}

export function registerStudent(db, { name, email, password }) {
  const clean = email.trim().toLowerCase();
  if (db.users.some((u) => u.email.toLowerCase() === clean))
    throw new Error('An account with this email already exists. Try logging in instead.');
  const user = {
    userId: makeId('u'),
    name: name.trim(),
    email: clean,
    password, // DEMO ONLY
    role: ROLES.STUDENT,
    status: USER_STATUS.ACTIVE,
  };
  return { db: { ...db, users: [...db.users, user] }, result: user };
}

export function logout() {
  clearSession();
}
