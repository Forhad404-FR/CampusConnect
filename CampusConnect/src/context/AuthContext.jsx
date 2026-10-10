import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useAppData } from './AppDataContext';
import * as authService from '../services/authService';
import { getSessionUserId, setSessionUserId } from '../services/storage';
import { USER_STATUS } from '../utils/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { db, act } = useAppData();
  const [userId, setUserId] = useState(() => getSessionUserId());

  // Derived from live data, so a deleted/disabled account is logged out automatically.
  const user = useMemo(
    () => db.users.find((u) => u.userId === userId && u.status !== USER_STATUS.DISABLED) || null,
    [db.users, userId]
  );

  const login = useCallback(
    (email, password) => {
      const u = authService.login(db, email, password); // throws a readable Error on failure
      setUserId(u.userId);
      return u;
    },
    [db]
  );

  const register = useCallback(
    (form) => {
      const res = act((d) => authService.registerStudent(d, form), null, { quiet: true });
      if (!res.ok) throw new Error(res.error);
      setSessionUserId(res.result.userId);
      setUserId(res.result.userId);
      return res.result;
    },
    [act]
  );

  const logout = useCallback(() => {
    authService.logout();
    setUserId(null);
  }, []);

  const value = useMemo(() => ({ user, login, register, logout }), [user, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
