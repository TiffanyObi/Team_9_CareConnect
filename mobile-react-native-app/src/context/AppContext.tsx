import React, { createContext, useContext, useMemo, useState } from 'react';
import { HealthLog, Settings } from '../types/models';
type AppState = { userName: string; signedIn: boolean; settings: Settings; takenMedicationIds: string[]; logs: HealthLog[]; signIn: (name?: string) => void; signOut: () => void; toggleTaken: (id: string) => void; addLog: (symptom: string, notes: string) => void; updateSettings: (change: Partial<Settings>) => void; resetSettings: () => void };
const safeSettings: Settings = { theme: 'system', textScale: 1, reducedMotion: true, staticAlerts: true, hapticReminders: true, largeTouchTargets: true };
const Context = createContext<AppState | undefined>(undefined);
export function AppProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [signedIn, setSignedIn] = useState(false); const [userName, setUserName] = useState('Olivia'); const [settings, setSettings] = useState(safeSettings); const [takenMedicationIds, setTaken] = useState<string[]>([]); const [logs, setLogs] = useState<HealthLog[]>([]);
  const value = useMemo(() => ({ userName, signedIn, settings, takenMedicationIds, logs, signIn: (name?: string) => { setUserName(name?.trim() || 'Olivia'); setSignedIn(true); }, signOut: () => setSignedIn(false), toggleTaken: (id: string) => setTaken(old => old.includes(id) ? old : [...old, id]), addLog: (symptom: string, notes: string) => setLogs(old => [{ id: String(Date.now()), symptom, notes, recordedAt: new Date() }, ...old]), updateSettings: (change: Partial<Settings>) => setSettings(old => ({ ...old, ...change })), resetSettings: () => setSettings(safeSettings) }), [userName, signedIn, settings, takenMedicationIds, logs]);
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useApp(): AppState { const value = useContext(Context); if (!value) throw new Error('useApp must be used inside AppProvider'); return value; }
