import { HealthLog, MedicationLog, PatientAccount, Settings } from '../types/models';
import { safeSettings } from '../context/AppContext';
export function fixtures() {
  const account: PatientAccount = { id: 1, fullName: 'Olivia Martinez', email: 'olivia@example.com' };
  const stored = new Map<number, Settings>();
  const repositories = {
    auth: { authenticate: jest.fn(async () => account as PatientAccount | null), register: jest.fn(async () => 'created' as 'created' | 'emailAlreadyExists') },
    settings: { load: jest.fn(async (id: number) => stored.get(id) ?? { ...safeSettings }), save: jest.fn(async (id: number, value: Settings) => { stored.set(id, { ...value }); }) },
    healthLogs: { loadLogs: jest.fn(async () => [] as HealthLog[]), addLog: jest.fn(async (_id: number, symptom: string, notes: string, recordedAt: Date) => ({ id: 'h1', symptom, notes, recordedAt })) },
    medicationLogs: { loadLogs: jest.fn(async () => [] as MedicationLog[]), addLog: jest.fn(async (_id: number, medicationId: string, medicationName: string, takenAt: Date) => ({ id: 'm1', medicationId, medicationName, takenAt })) },
  };
  return { account, stored, repositories };
}
