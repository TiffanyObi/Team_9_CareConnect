import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import { Account, Settings, UserData } from '../types/models';
import { AppRepository, initialData, safeSettings } from '../storage/appRepository';
import { passwordHasher } from '../storage/passwords';
import { createSqliteStore } from '../storage/sqlite';
import { useDevicePreferences } from '../hooks/useDevicePreferences';
import { colors, darkColors } from '../utils/theme';

type AppState = {
  account: Account | null; userName: string; signedIn: boolean; busy: boolean;
  data: UserData; settings: Settings; palette: typeof colors; reducedMotion: boolean; today: string;
  signIn(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  signOut(): void; updateSettings(change: Partial<Settings>): void; resetSettings(): void;
  saveSettings(): Promise<void>; markDose(id: string, time: string): Promise<void>;
  addLog(symptom: string, notes: string): Promise<void>;
  addAppointment(title: string, date: string, location: string): Promise<void>;
  addMessage(subject: string, body: string): Promise<void>;
};
const Context = createContext<AppState | undefined>(undefined);
export function AppProvider({ children, repository }: { children: React.ReactNode; repository?: AppRepository }): React.JSX.Element {
  const [repo] = useState(() => repository ?? new AppRepository(createSqliteStore(), passwordHasher));
  const [account, setAccount] = useState<Account | null>(null);
  const [data, setData] = useState(initialData);
  const [settings, setSettings] = useState<Settings>({ ...safeSettings });
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const session = useRef(0);
  const device = useDevicePreferences(settings);
  const execute = useCallback(async (operation: () => Promise<void>) => {
    if (pending.current) throw new Error('Please wait for the current action to finish.');
    pending.current = true; setBusy(true);
    try { await operation(); } finally { pending.current = false; setBusy(false); }
  }, []);
  const openAccount = useCallback(async (operation: () => Promise<Account>) => execute(async () => {
    const token = session.current;
    const nextAccount = await operation();
    const next = await repo.load(nextAccount.email);
    if (token !== session.current) return;
    setData(next); setSettings(next.settings); setAccount(nextAccount);
  }), [execute, repo]);
  const mutate = useCallback(async (operation: (email: string) => Promise<UserData>) => execute(async () => {
    if (!account) throw new Error('Sign in to continue.');
    const token = session.current;
    const next = await operation(account.email);
    if (token !== session.current) return;
    setData(next);
    if (settings.hapticReminders) {
      // A missing haptic engine must not turn a successful save into a failed action.
      void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
    }
  }), [account, execute, settings.hapticReminders]);
  const signIn = useCallback((email: string, password: string) => openAccount(() => repo.authenticate(email, password)), [openAccount, repo]);
  const register = useCallback((name: string, email: string, password: string) => openAccount(() => repo.register(name, email, password)), [openAccount, repo]);
  const signOut = useCallback(() => {
    session.current += 1; setAccount(null); setData(initialData()); setSettings({ ...safeSettings });
  }, []);
  const updateSettings = useCallback((change: Partial<Settings>) => setSettings(old => ({ ...old, ...change })), []);
  const resetSettings = useCallback(() => setSettings({ ...safeSettings }), []);
  const saveSettings = useCallback(() => mutate(email => repo.saveSettings(email, settings)), [mutate, repo, settings]);
  const markDose = useCallback((id: string, time: string) => mutate(email => repo.markDose(email, id, time)), [mutate, repo]);
  const addLog = useCallback((symptom: string, notes: string) => mutate(email => repo.addLog(email, symptom, notes)), [mutate, repo]);
  const addAppointment = useCallback((title: string, date: string, location: string) => mutate(email => repo.addAppointment(email, title, date, location)), [mutate, repo]);
  const addMessage = useCallback((subject: string, body: string) => mutate(email => repo.addMessage(email, subject, body)), [mutate, repo]);
  const value = useMemo(() => ({
    account, userName: account?.fullName.split(/\s+/)[0] ?? '', signedIn: account !== null, busy,
    data, settings, palette: device.dark ? darkColors : colors, reducedMotion: device.reducedMotion, today: device.today,
    signIn, register, signOut, updateSettings, resetSettings, saveSettings, markDose, addLog, addAppointment, addMessage,
  }), [account, busy, data, settings, device.dark, device.reducedMotion, device.today, signIn, register, signOut, updateSettings, resetSettings, saveSettings, markDose, addLog, addAppointment, addMessage]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp(): AppState {
  const state = useContext(Context);
  if (!state) throw new Error('useApp must be used inside AppProvider');
  return state;
}
