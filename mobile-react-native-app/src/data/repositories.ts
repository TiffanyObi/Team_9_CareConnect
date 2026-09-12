import AsyncStorage from '@react-native-async-storage/async-storage';
import { HealthLog, MedicationLog, PatientAccount, Settings } from '../types/models';
import { constantTimeEqual, createSalt, derivePasswordHash, getDatabase } from './database';

export type RegistrationResult = 'created' | 'emailAlreadyExists';

export interface AuthRepository {
  register(fullName: string, email: string, password: string): Promise<RegistrationResult>;
  authenticate(email: string, password: string): Promise<PatientAccount | null>;
}

type UserRow = { id: number; full_name: string; email: string; password_salt: string; password_hash: string };

export class SQLiteAuthRepository implements AuthRepository {
  async register(fullName: string, email: string, password: string): Promise<RegistrationResult> {
    const database = await getDatabase();
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await database.getFirstAsync<{ id: number }>('SELECT id FROM users WHERE email = ? LIMIT 1', normalizedEmail);
    if (existing) return 'emailAlreadyExists';
    const salt = await createSalt();
    await database.runAsync(
      `INSERT INTO users(full_name, email, password_salt, password_hash, created_at)
       VALUES (?, ?, ?, ?, ?)`,
      fullName.trim(), normalizedEmail, salt, derivePasswordHash(password, salt), new Date().toISOString(),
    );
    return 'created';
  }

  async authenticate(email: string, password: string): Promise<PatientAccount | null> {
    const database = await getDatabase();
    const row = await database.getFirstAsync<UserRow>(
      'SELECT id, full_name, email, password_salt, password_hash FROM users WHERE email = ? LIMIT 1',
      email.trim().toLowerCase(),
    );
    if (!row || !constantTimeEqual(row.password_hash, derivePasswordHash(password, row.password_salt))) return null;
    return { id: row.id, fullName: row.full_name, email: row.email };
  }
}

export interface MedicationLogRepository {
  loadLogs(userId: number): Promise<MedicationLog[]>;
  addLog(userId: number, medicationId: string, medicationName: string, takenAt: Date): Promise<MedicationLog>;
}

type MedicationLogRow = { id: number; medication_id: string; medication_name: string; taken_at: string };

export class SQLiteMedicationLogRepository implements MedicationLogRepository {
  async loadLogs(userId: number): Promise<MedicationLog[]> {
    const database = await getDatabase();
    const rows = await database.getAllAsync<MedicationLogRow>('SELECT * FROM medication_logs WHERE user_id = ? ORDER BY taken_at DESC', userId);
    return rows.map(row => ({ id: String(row.id), medicationId: row.medication_id, medicationName: row.medication_name, takenAt: new Date(row.taken_at) }));
  }

  async addLog(userId: number, medicationId: string, medicationName: string, takenAt: Date): Promise<MedicationLog> {
    const database = await getDatabase();
    const result = await database.runAsync(
      'INSERT INTO medication_logs(user_id, medication_id, medication_name, taken_at) VALUES (?, ?, ?, ?)',
      userId, medicationId, medicationName, takenAt.toISOString(),
    );
    return { id: String(result.lastInsertRowId), medicationId, medicationName, takenAt };
  }
}

export interface HealthLogRepository {
  loadLogs(userId: number): Promise<HealthLog[]>;
  addLog(userId: number, symptom: string, notes: string, recordedAt: Date): Promise<HealthLog>;
}

type HealthLogRow = { id: number; symptom: string; notes: string; recorded_at: string };

export class SQLiteHealthLogRepository implements HealthLogRepository {
  async loadLogs(userId: number): Promise<HealthLog[]> {
    const database = await getDatabase();
    const rows = await database.getAllAsync<HealthLogRow>('SELECT * FROM health_logs WHERE user_id = ? ORDER BY recorded_at DESC', userId);
    return rows.map(row => ({ id: String(row.id), symptom: row.symptom, notes: row.notes, recordedAt: new Date(row.recorded_at) }));
  }

  async addLog(userId: number, symptom: string, notes: string, recordedAt: Date): Promise<HealthLog> {
    const database = await getDatabase();
    const result = await database.runAsync(
      'INSERT INTO health_logs(user_id, symptom, notes, recorded_at) VALUES (?, ?, ?, ?)',
      userId, symptom, notes, recordedAt.toISOString(),
    );
    return { id: String(result.lastInsertRowId), symptom, notes, recordedAt };
  }
}

const SETTINGS_KEY_PREFIX = 'careconnect.accessibility-settings.v2';

export interface SettingsRepository {
  load(userId: number, fallback: Settings): Promise<Settings>;
  save(userId: number, settings: Settings): Promise<void>;
}

export class AsyncStorageSettingsRepository implements SettingsRepository {
  async load(userId: number, fallback: Settings): Promise<Settings> {
    const stored = await AsyncStorage.getItem(settingsKey(userId));
    if (!stored) return fallback;
    try {
      return { ...fallback, ...(JSON.parse(stored) as Partial<Settings>) };
    } catch {
      return fallback;
    }
  }

  async save(userId: number, settings: Settings): Promise<void> {
    await AsyncStorage.setItem(settingsKey(userId), JSON.stringify(settings));
  }
}

function settingsKey(userId: number): string {
  return `${SETTINGS_KEY_PREFIX}.${userId}`;
}
