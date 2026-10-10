import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { loadDb, saveDb, resetDb } from '../services/storage';
import { useToast } from '../components/Toast';

const AppDataContext = createContext(null);

export function AppDataProvider({ children }) {
  const toast = useToast();
  const [db, setDb] = useState(() => loadDb());
  const dbRef = useRef(db); // always holds the latest data, even between renders

  // Runs a service mutation: fn(db) => { db, result }. Errors thrown by the service rules
  // become readable toast messages. Returns { ok, result?, error? }.
  const act = useCallback(
    (fn, successMessage, options = {}) => {
      try {
        const out = fn(dbRef.current);
        dbRef.current = out.db;
        setDb(out.db);
        saveDb(out.db);
        if (successMessage) toast.success(typeof successMessage === 'function' ? successMessage(out.result) : successMessage);
        return { ok: true, result: out.result };
      } catch (err) {
        if (!options.quiet) toast.error(err.message);
        return { ok: false, error: err.message };
      }
    },
    [toast]
  );

  const resetData = useCallback(() => {
    const fresh = resetDb();
    dbRef.current = fresh;
    setDb(fresh);
    toast.success('Demo data restored to the original sample records.');
  }, [toast]);

  const value = useMemo(() => ({ db, act, resetData }), [db, act, resetData]);
  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export const useAppData = () => useContext(AppDataContext);
