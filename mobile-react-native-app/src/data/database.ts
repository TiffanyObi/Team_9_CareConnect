import * as Crypto from 'expo-crypto';
import * as SQLite from 'expo-sqlite';
import { pbkdf2 } from '@noble/hashes/pbkdf2.js';
import { sha256 } from '@noble/hashes/sha2.js';
import { utf8ToBytes } from '@noble/hashes/utils.js';

const DATABASE_NAME = 'careconnect_safeview.db';
const HASH_ITERATIONS = 120_000;

let databasePromise: Promise<SQLite.SQLiteDatabase> | undefined;

export function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  databasePromise ??= openDatabase();
  return databasePromise;
}

async function openDatabase(): Promise<SQLite.SQLiteDatabase> {
  const database = await SQLite.openDatabaseAsync(DATABASE_NAME);
  await database.execAsync('PRAGMA journal_mode = WAL; PRAGMA foreign_keys = ON;');
  await database.withTransactionAsync(async () => {
    await database.execAsync(`
      CREATE TABLE IF NOT EXISTS users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_salt TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS medication_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        medication_id TEXT NOT NULL,
        medication_name TEXT NOT NULL,
        taken_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      CREATE TABLE IF NOT EXISTS health_logs(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        symptom TEXT NOT NULL,
        notes TEXT NOT NULL,
        recorded_at TEXT NOT NULL,
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
  });
  await seedOlivia(database);
  await migrateLogsToUserAccounts(database);
  return database;
}

async function migrateLogsToUserAccounts(database: SQLite.SQLiteDatabase): Promise<void> {
  const olivia = await database.getFirstAsync<{ id: number }>('SELECT id FROM users WHERE email = ? LIMIT 1', 'omartinez@careconnect.com');
  if (!olivia) throw new Error('The demonstration account could not be initialized.');
  const medicationColumns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(medication_logs)');
  const healthColumns = await database.getAllAsync<{ name: string }>('PRAGMA table_info(health_logs)');
  await database.withTransactionAsync(async () => {
    if (!medicationColumns.some(column => column.name === 'user_id')) {
      await database.execAsync('ALTER TABLE medication_logs ADD COLUMN user_id INTEGER;');
    }
    if (!healthColumns.some(column => column.name === 'user_id')) {
      await database.execAsync('ALTER TABLE health_logs ADD COLUMN user_id INTEGER;');
    }
    // Logs created before account scoping belonged to the original Olivia demo profile.
    await database.runAsync('UPDATE medication_logs SET user_id = ? WHERE user_id IS NULL', olivia.id);
    await database.runAsync('UPDATE health_logs SET user_id = ? WHERE user_id IS NULL', olivia.id);
    await database.execAsync('CREATE INDEX IF NOT EXISTS medication_logs_user_id ON medication_logs(user_id); CREATE INDEX IF NOT EXISTS health_logs_user_id ON health_logs(user_id); PRAGMA user_version = 2;');
  });
}

async function seedOlivia(database: SQLite.SQLiteDatabase): Promise<void> {
  const existing = await database.getFirstAsync<{ id: number }>(
    'SELECT id FROM users WHERE email = ? LIMIT 1',
    'omartinez@careconnect.com',
  );
  if (existing) return;
  const salt = await createSalt();
  const passwordHash = derivePasswordHash('password', salt);
  await database.runAsync(
    `INSERT INTO users(full_name, email, password_salt, password_hash, created_at)
     VALUES (?, ?, ?, ?, ?)`,
    'Olivia Martinez',
    'omartinez@careconnect.com',
    salt,
    passwordHash,
    '2026-09-08T00:00:00.000Z',
  );
}

export async function createSalt(): Promise<string> {
  return bytesToHex(await Crypto.getRandomBytesAsync(16));
}

export function derivePasswordHash(password: string, saltHex: string): string {
  const hash = pbkdf2(sha256, utf8ToBytes(password), hexToBytes(saltHex), {
    c: HASH_ITERATIONS,
    dkLen: 32,
  });
  return bytesToHex(hash);
}

export function constantTimeEqual(left: string, right: string): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(value: string): Uint8Array {
  return Uint8Array.from(value.match(/.{1,2}/g)?.map(byte => Number.parseInt(byte, 16)) ?? []);
}
