import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  AsyncStorageSettingsRepository,
  AuthRepository,
  HealthLogRepository,
  MedicationLogRepository,
  SettingsRepository,
  SQLiteAuthRepository,
  SQLiteHealthLogRepository,
  SQLiteMedicationLogRepository,
} from '../data/repositories';
import { HealthLog, Medication, MedicationLog, PatientAccount, Settings } from '../types/models';

export type SessionStage = 'signedOut' | 'accessibilitySetup' | 'signedIn';
type AppState = {
  account: PatientAccount | null; userName: string; sessionStage: SessionStage; settings: Settings;
  medicationLogs: MedicationLog[]; logs: HealthLog[];
  isReady: boolean; isBusy: boolean;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (name: string, email: string, password: string) => Promise<string | null>;
  completeOnboarding: () => Promise<void>; signOut: () => void;
  markMedicationTaken: (medication: Medication) => Promise<void>;
  addLog: (symptom: string, notes: string) => Promise<void>;
  updateSettings: (change: Partial<Settings>) => void; resetSettings: () => void;
};
type AppProviderProps = { children: React.ReactNode; repositories?: Partial<{ auth: AuthRepository; medicationLogs: MedicationLogRepository; healthLogs: HealthLogRepository; settings: SettingsRepository }> };
export const safeSettings: Settings = { theme: 'system', textScale: 1, reducedMotion: true, staticAlerts: true, hapticReminders: true, largeTouchTargets: true };
const defaultRepositories = { auth: new SQLiteAuthRepository(), medicationLogs: new SQLiteMedicationLogRepository(), healthLogs: new SQLiteHealthLogRepository(), settings: new AsyncStorageSettingsRepository() };
const Context = createContext<AppState | undefined>(undefined);

export function AppProvider({ children, repositories }: AppProviderProps): React.JSX.Element {
  const services = useMemo(() => ({ ...defaultRepositories, ...repositories }), [repositories]);
  const [sessionStage, setSessionStage] = useState<SessionStage>('signedOut');
  const [account, setAccount] = useState<PatientAccount | null>(null);
  const [settings, setSettings] = useState(safeSettings);
  const [medicationLogs, setMedicationLogs] = useState<MedicationLog[]>([]);
  const [logs, setLogs] = useState<HealthLog[]>([]);
  const [isReady, setReady] = useState(false); const [isBusy, setBusy] = useState(false);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => { if (mounted) setReady(true); });
    return () => { mounted = false; };
  }, []);

  const loadAccountData = useCallback(async (userId: number) => {
    const [savedSettings, savedMedicationLogs, savedHealthLogs] = await Promise.all([
      services.settings.load(userId, safeSettings),
      services.medicationLogs.loadLogs(userId),
      services.healthLogs.loadLogs(userId),
    ]);
    setSettings(savedSettings);
    setMedicationLogs(savedMedicationLogs);
    setLogs(savedHealthLogs);
  }, [services]);

  const signIn = useCallback(async (email: string, password: string): Promise<string | null> => {
    setBusy(true);
    try { const authenticated = await services.auth.authenticate(email, password); if (!authenticated) return 'Email or password is incorrect.'; await loadAccountData(authenticated.id); setAccount(authenticated); setSessionStage('signedIn'); return null; }
    catch { return 'Sign in is unavailable right now. Please try again.'; } finally { setBusy(false); }
  }, [services, loadAccountData]);
  const signUp = useCallback(async (name: string, email: string, password: string): Promise<string | null> => {
    setBusy(true);
    try { const result = await services.auth.register(name, email, password); if (result === 'emailAlreadyExists') return 'An account already exists for this email.'; const created = await services.auth.authenticate(email, password); if (!created) return 'Your account was created, but sign in failed. Please sign in again.'; await services.settings.save(created.id, safeSettings); setSettings(safeSettings); setMedicationLogs([]); setLogs([]); setAccount(created); setSessionStage('accessibilitySetup'); return null; }
    catch { return 'Account creation is unavailable right now. Please try again.'; } finally { setBusy(false); }
  }, [services]);
  const updateSettings = useCallback((change: Partial<Settings>) => { setSettings(current => { const updated = { ...current, ...change }; if (account) void services.settings.save(account.id, updated); return updated; }); }, [account, services]);
  const resetSettings = useCallback(() => { setSettings(safeSettings); if (account) void services.settings.save(account.id, safeSettings); }, [account, services]);
  const markMedicationTaken = useCallback(async (medication: Medication) => { if (!account) throw new Error('A user must be signed in to log medication.'); const saved = await services.medicationLogs.addLog(account.id, medication.id, medication.name, new Date()); setMedicationLogs(current => [saved, ...current]); }, [account, services]);
  const addLog = useCallback(async (symptom: string, notes: string) => { if (!account) throw new Error('A user must be signed in to add a health log.'); const saved = await services.healthLogs.addLog(account.id, symptom, notes, new Date()); setLogs(current => [saved, ...current]); }, [account, services]);
  const value = useMemo<AppState>(() => ({
    account, userName: account?.fullName.split(/\s+/)[0] || 'Care recipient', sessionStage, settings, medicationLogs,
    logs, isReady, isBusy,
    signIn, signUp, completeOnboarding: async () => { if (!account) throw new Error('A user must be signed in to save settings.'); await services.settings.save(account.id, settings); setSessionStage('signedIn'); },
    signOut: () => { setAccount(null); setSettings(safeSettings); setMedicationLogs([]); setLogs([]); setSessionStage('signedOut'); }, markMedicationTaken, addLog, updateSettings, resetSettings,
  }), [account, sessionStage, settings, medicationLogs, logs, isReady, isBusy, signIn, signUp, services, markMedicationTaken, addLog, updateSettings, resetSettings]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useApp(): AppState {
  const value = useContext(Context);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}
