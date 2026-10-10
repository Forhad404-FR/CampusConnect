// The ONLY file that touches localStorage. Everything is stored under namespaced keys,
// so "Reset Demo Data" never touches unrelated browser data.
import { buildInitialData, DATA_VERSION } from '../data/initialData';

export const STORAGE_KEY = 'campusconnect_demo_v1';
export const SESSION_KEY = 'campusconnect_session_v1';

const isValid = (d) =>
  d &&
  d.version === DATA_VERSION &&
  ['users', 'clubs', 'events', 'registrations'].every((k) => Array.isArray(d[k]));

export function saveDb(db) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
  } catch {
    /* storage full or blocked: the app keeps working in memory for this session */
  }
}

// Missing, corrupted or outdated data is replaced with fresh sample data.
export function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValid(parsed)) return parsed;
    }
  } catch {
    /* fall through to re-seed */
  }
  const fresh = buildInitialData();
  saveDb(fresh);
  return fresh;
}

export function resetDb() {
  const fresh = buildInitialData();
  saveDb(fresh);
  return fresh;
}

export function getSessionUserId() {
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}
export function setSessionUserId(id) {
  try {
    localStorage.setItem(SESSION_KEY, id);
  } catch {
    /* ignore */
  }
}
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
