import * as SQLite from 'expo-sqlite';
import { getDatabase, derivePasswordHash, constantTimeEqual, createSalt } from '../data/database';
const db = { execAsync: jest.fn(async () => {}), runAsync: jest.fn(async () => ({ lastInsertRowId: 1 })), getFirstAsync: jest.fn(), getAllAsync: jest.fn(), withTransactionAsync: jest.fn(async (fn: () => Promise<void>) => fn()) };
test('database initialization migrates existing logs and caches the connection', async () => {
  jest.mocked(SQLite.openDatabaseAsync).mockResolvedValue(db as never);
  db.getFirstAsync.mockResolvedValueOnce(null).mockResolvedValue({ id: 1 });
  db.getAllAsync.mockResolvedValue([]);
  const result = await getDatabase();
  expect(result).toBe(db); expect(await getDatabase()).toBe(db);
  expect(SQLite.openDatabaseAsync).toHaveBeenCalledTimes(1);
  expect(db.execAsync).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE IF NOT EXISTS users'));
  expect(db.execAsync).toHaveBeenCalledWith('ALTER TABLE medication_logs ADD COLUMN user_id INTEGER;');
  expect(db.execAsync).toHaveBeenCalledWith('ALTER TABLE health_logs ADD COLUMN user_id INTEGER;');
  expect(db.runAsync).toHaveBeenCalledWith('UPDATE health_logs SET user_id = ? WHERE user_id IS NULL', 1);
  expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'), 'Olivia Martinez', 'omartinez@careconnect.com', expect.any(String), expect.stringMatching(/^[a-f0-9]{64}$/), expect.any(String));
}, 30000);
test('password hashing is repeatable, salt-sensitive and does not equal plaintext', async () => {
  const salt = await createSalt(); expect(salt).toHaveLength(32);
  const hash = derivePasswordHash('demo-secret', salt);
  expect(hash).toHaveLength(64); expect(hash).not.toContain('demo-secret');
  expect(derivePasswordHash('demo-secret', salt)).toBe(hash);
  expect(derivePasswordHash('demo-secret', '01'.repeat(16))).not.toBe(hash);
  expect(constantTimeEqual(hash, hash)).toBe(true);
  expect(constantTimeEqual(hash, '0'.repeat(64))).toBe(false);
  expect(constantTimeEqual(hash, '')).toBe(false);
}, 30000);
