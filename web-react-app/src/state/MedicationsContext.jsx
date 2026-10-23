import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { demoMedications } from '../data/medications';
import { sortMedicationLogs } from '../utils/medications';
import { useAuth } from './AuthContext';

const MEDICATIONS_KEY_PREFIX = 'careconnect-safeview-medications:';
const LOGS_KEY_PREFIX = 'careconnect-safeview-medication-logs:';
const MedicationsContext = createContext(null);

function readStoredData(key, fallback) {
  try {
    const saved = window.localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function saveStoredData(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function MedicationsProvider({ children }) {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [logs, setLogs] = useState([]);
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    if (!user) {
      setMedications([]);
      setLogs([]);
      setStorageError('');
      return;
    }
    setMedications(readStoredData(
      `${MEDICATIONS_KEY_PREFIX}${user.id}`,
      user.isDemo ? demoMedications : [],
    ));
    setLogs(sortMedicationLogs(readStoredData(`${LOGS_KEY_PREFIX}${user.id}`, [])));
    setStorageError('');
  }, [user?.id]);

  const value = useMemo(() => ({
    medications,
    logs,
    storageError,
    clearStorageError() {
      setStorageError('');
    },
    getMedication(id) {
      return medications.find((medication) => medication.id === id);
    },
    addMedication(input) {
      if (!user) throw new Error('Sign in before adding medication.');
      const medication = {
        ...input,
        id: globalThis.crypto?.randomUUID?.() ?? `medication-${Date.now()}`,
      };
      const nextMedications = [...medications, medication];
      try {
        saveStoredData(`${MEDICATIONS_KEY_PREFIX}${user.id}`, nextMedications);
        setMedications(nextMedications);
        setStorageError('');
        return medication;
      } catch {
        setStorageError('The medication could not be saved on this device. Please try again.');
        return null;
      }
    },
    logMedicationTaken(medicationId, takenAt = new Date()) {
      if (!user) throw new Error('Sign in before logging medication.');
      const medication = medications.find((item) => item.id === medicationId);
      if (!medication) {
        setStorageError('That medication could not be found.');
        return null;
      }
      const log = {
        id: globalThis.crypto?.randomUUID?.() ?? `medication-log-${Date.now()}`,
        medicationId,
        medicationName: medication.name,
        dosage: medication.dosage,
        takenAt: new Date(takenAt).toISOString(),
      };
      const nextLogs = sortMedicationLogs([log, ...logs]);
      try {
        saveStoredData(`${LOGS_KEY_PREFIX}${user.id}`, nextLogs);
        setLogs(nextLogs);
        setStorageError('');
        return log;
      } catch {
        setStorageError('The dose could not be logged on this device. Please try again.');
        return null;
      }
    },
  }), [logs, medications, storageError, user]);

  return <MedicationsContext.Provider value={value}>{children}</MedicationsContext.Provider>;
}

export function useMedications() {
  const context = useContext(MedicationsContext);
  if (!context) throw new Error('useMedications must be used within MedicationsProvider');
  return context;
}
