import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from './AuthContext';

const STORAGE_KEY_PREFIX = 'careconnect-safeview-health-logs:';
const HealthLogsContext = createContext(null);

function readHealthLogs(userId) {
  if (!userId) return { logs: [], error: '' };
  try {
    const stored = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (!stored) return { logs: [], error: '' };
    const logs = JSON.parse(stored);
    if (!Array.isArray(logs)) throw new Error('Invalid health-log data');
    return { logs, error: '' };
  } catch {
    return { logs: [], error: 'Saved health logs could not be read from this device.' };
  }
}

export function HealthLogsProvider({ children }) {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [storageError, setStorageError] = useState('');
  const currentLogs = useRef([]);

  useEffect(() => {
    const loaded = readHealthLogs(user?.id);
    currentLogs.current = loaded.logs;
    setLogs(loaded.logs);
    setStorageError(loaded.error);
  }, [user?.id]);

  const value = useMemo(() => ({
    logs,
    storageError,
    clearStorageError() {
      setStorageError('');
    },
    addHealthLog(input) {
      if (!user) throw new Error('Sign in before saving a health log.');
      const healthLog = {
        ...input,
        id: globalThis.crypto?.randomUUID?.() ?? `health-log-${Date.now()}`,
        recordedAt: new Date().toISOString(),
      };
      const nextLogs = [healthLog, ...currentLogs.current];
      try {
        window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${user.id}`, JSON.stringify(nextLogs));
        currentLogs.current = nextLogs;
        setLogs(nextLogs);
        setStorageError('');
        return healthLog;
      } catch {
        setStorageError('Your health log could not be saved on this device. Please try again.');
        return null;
      }
    },
  }), [logs, storageError, user]);

  return <HealthLogsContext.Provider value={value}>{children}</HealthLogsContext.Provider>;
}

export function useHealthLogs() {
  const context = useContext(HealthLogsContext);
  if (!context) throw new Error('useHealthLogs must be used within HealthLogsProvider');
  return context;
}
