import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';
import { getToken, clearToken, setUnauthorizedHandler } from '../services/api';
import { useToast } from '../components/Toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const toast = useToast();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false); // false until we know whether the saved token is still valid
  const [authError, setAuthError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setAuthError(null);
    if (!getToken()) {
      setReady(true);
      return undefined;
    }
    authService
      .fetchMe()
      .then((u) => { if (!cancelled) { setUser(u); setReady(true); } })
      .catch((err) => {
        if (cancelled) return;
        if (err.status === 401) { clearToken(); setUser(null); setReady(true); }
        else setAuthError(err.message);
      });
    return () => { cancelled = true; };
  }, [attempt]);

  // If the server says our token is no longer valid (expired, account disabled or deleted), log out.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearToken();
      setUser(null);
      toast.info('Your session has ended. Please log in again.');
    });
  }, [toast]);

  const login = useCallback(async (email, password) => {
    const u = await authService.login(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (form) => {
    const u = await authService.registerAccount(form);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const retryAuth = useCallback(() => setAttempt((n) => n + 1), []);
  const value = useMemo(() => ({ user, ready, authError, retryAuth, login, register, logout }), [user, ready, authError, retryAuth, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
