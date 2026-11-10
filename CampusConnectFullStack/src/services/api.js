// Small fetch wrapper: adds the login token, parses JSON and turns errors into readable messages.
import { API_BASE_URL } from './apiConfig';

const TOKEN_KEY = 'campusconnect_token_v2';

export function getToken() {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
}
export function setToken(token) {
  try { localStorage.setItem(TOKEN_KEY, token); } catch { /* ignore */ }
}
export function clearToken() {
  try { localStorage.removeItem(TOKEN_KEY); } catch { /* ignore */ }
}

let onUnauthorized = () => {};
export function setUnauthorizedHandler(fn) { onUnauthorized = fn; }

async function request(method, path, body) {
  const token = getToken();
  let res;
  try {
    res = await fetch(API_BASE_URL + path, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    const err = new Error('Cannot reach the server. Check your connection and try again.');
    err.network = true;
    throw err;
  }
  let data = null;
  try { data = await res.json(); } catch { /* empty body */ }
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status}).`);
    err.status = res.status;
    if (res.status === 401 && token && !path.startsWith('/auth/')) onUnauthorized();
    throw err;
  }
  return data;
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body = {}) => request('POST', path, body),
  put: (path, body = {}) => request('PUT', path, body),
  patch: (path, body = {}) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
};
