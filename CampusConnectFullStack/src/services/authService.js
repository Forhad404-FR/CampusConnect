// Authentication via the REST API. The server hashes passwords and issues a signed token.
import { api, setToken, clearToken } from './api';

export async function login(email, password) {
  const res = await api.post('/auth/login', { email, password });
  setToken(res.token);
  return res.user;
}

export async function registerAccount({ name, email, password, confirmPassword, role }) {
  const res = await api.post('/auth/register', { name, email, password, confirmPassword, role });
  setToken(res.token);
  return res.user;
}

export const logout = () => clearToken();
export async function fetchMe() {
  return (await api.get('/me')).user;
}
