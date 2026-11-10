import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import { useAuth } from './AuthContext';

const AppDataContext = createContext(null);
const EMPTY = { clubs: [], events: [], registrations: [], users: [] };

export function AppDataProvider({ children }) {
  const toast = useToast();
  const { user, ready } = useAuth();
  const [db, setDb] = useState(EMPTY);
  const dbRef = useRef(db);
  const [dataFor, setDataFor] = useState(null); // whose view of the data is loaded ('anon' or a user id)
  const [loadError, setLoadError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const who = user ? user.userId : 'anon';

  const store = (data) => { dbRef.current = data; setDb(data); };

  // (Re)load the data whenever the logged-in user changes, so nobody sees another role's data.
  useEffect(() => {
    if (!ready) return undefined;
    let cancelled = false;
    setLoadError(null);
    api.get('/data')
      .then((data) => { if (!cancelled) { store(data); setDataFor(who); } })
      .catch((err) => { if (!cancelled) setLoadError(err.message); });
    return () => { cancelled = true; };
  }, [ready, who, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const refresh = useCallback(async () => { store(await api.get('/data')); }, []);

  // Runs an API mutation: fn(db) => Promise<{ result }>. Server-side rule errors become toast messages.
  // After success the data is reloaded from the server. Returns { ok, result?, error? }.
  const act = useCallback(
    async (fn, successMessage, options = {}) => {
      try {
        const out = await fn(dbRef.current);
        await refresh();
        if (successMessage) toast.success(typeof successMessage === 'function' ? successMessage(out.result) : successMessage);
        return { ok: true, result: out.result };
      } catch (err) {
        if (!options.quiet && err.status !== 401) toast.error(err.message);
        return { ok: false, error: err.message };
      }
    },
    [refresh, toast]
  );

  const resetData = useCallback(async () => {
    try {
      await api.post('/admin/reset');
      await refresh();
      toast.success('Demo data restored to the original sample records.');
    } catch (err) {
      toast.error(err.message);
    }
  }, [refresh, toast]);

  const value = useMemo(() => ({ db, act, resetData, dataFor, loadError, retry }), [db, act, resetData, dataFor, loadError, retry]);
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export const useAppData = () => useContext(AppDataContext);
