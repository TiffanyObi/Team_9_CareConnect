import AsyncStorage from '@react-native-async-storage/async-storage';
import { getDatabase, createSalt, derivePasswordHash, constantTimeEqual } from '../data/database';
import { SQLiteAuthRepository, SQLiteHealthLogRepository, SQLiteMedicationLogRepository, AsyncStorageSettingsRepository } from '../data/repositories';
import { safeSettings } from '../context/AppContext';
jest.mock('../data/database', () => ({ getDatabase: jest.fn(), createSalt: jest.fn(async () => 'salt'), derivePasswordHash: jest.fn((password: string) => 'hash:' + password), constantTimeEqual: jest.fn((a, b) => a === b) }));
const db = { getFirstAsync: jest.fn(), getAllAsync: jest.fn(), runAsync: jest.fn() };
beforeEach(() => { jest.clearAllMocks(); jest.mocked(getDatabase).mockResolvedValue(db as never); });
test('registration normalizes email, hashes passwords and uses bound SQL', async () => {
  db.getFirstAsync.mockResolvedValue(null);
  expect(await new SQLiteAuthRepository().register(' Test User ', ' TEST@EXAMPLE.COM ', 'secret')).toBe('created');
  expect(createSalt).toHaveBeenCalled(); expect(derivePasswordHash).toHaveBeenCalledWith('secret', 'salt');
  expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining('VALUES (?, ?, ?, ?, ?)'), 'Test User', 'test@example.com', 'salt', 'hash:secret', expect.any(String));
});
test('duplicate registration does not write', async () => {
  db.getFirstAsync.mockResolvedValue({ id: 1 });
  expect(await new SQLiteAuthRepository().register('Test', 'a@example.com', 'pw')).toBe('emailAlreadyExists');
  expect(db.runAsync).not.toHaveBeenCalled();
});
test('authentication rejects unknown or wrong passwords and exposes no hash', async () => {
  const repo = new SQLiteAuthRepository(); db.getFirstAsync.mockResolvedValueOnce(null);
  expect(await repo.authenticate('A@EXAMPLE.COM', 'pw')).toBeNull();
  db.getFirstAsync.mockResolvedValue({ id: 2, full_name: 'Test', email: 'a@example.com', password_salt: 'salt', password_hash: 'hash:pw' });
  expect(await repo.authenticate('A@EXAMPLE.COM', 'wrong')).toBeNull();
  expect(await repo.authenticate('A@EXAMPLE.COM', 'pw')).toEqual({ id: 2, fullName: 'Test', email: 'a@example.com' });
  expect(constantTimeEqual).toHaveBeenCalled();
});
test('database failures propagate instead of claiming successful writes', async () => {
  db.runAsync.mockRejectedValueOnce(new Error('full'));
  await expect(new SQLiteHealthLogRepository().addLog(3, 'test', 'note', new Date())).rejects.toThrow('full');
});
test('health records are mapped and queried for the signed-in user', async () => {
  const date = new Date('2026-09-13T00:00:00Z');
  db.getAllAsync.mockResolvedValue([{ id: 7, symptom: 'test', notes: 'note', recorded_at: date.toISOString() }]);
  const repo = new SQLiteHealthLogRepository();
  expect(await repo.loadLogs(3)).toEqual([{ id: '7', symptom: 'test', notes: 'note', recordedAt: date }]);
  expect(db.getAllAsync).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = ?'), 3);
  db.runAsync.mockResolvedValue({ lastInsertRowId: 8 });
  expect(await repo.addLog(3, 'test', 'note', date)).toEqual({ id: '8', symptom: 'test', notes: 'note', recordedAt: date });
  expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining('VALUES (?, ?, ?, ?)'), 3, 'test', 'note', date.toISOString());
});
test('medication records preserve names and actual timestamps per account', async () => {
  const date = new Date('2026-09-13T00:00:00Z'); const repo = new SQLiteMedicationLogRepository();
  db.getAllAsync.mockResolvedValue([{ id: 4, medication_id: 'm1', medication_name: 'Demo', taken_at: date.toISOString() }]);
  expect(await repo.loadLogs(9)).toEqual([{ id: '4', medicationId: 'm1', medicationName: 'Demo', takenAt: date }]);
  expect(db.getAllAsync).toHaveBeenCalledWith(expect.stringContaining('WHERE user_id = ?'), 9);
  db.runAsync.mockResolvedValue({ lastInsertRowId: 5 });
  expect(await repo.addLog(9, 'm1', 'Demo', date)).toEqual({ id: '5', medicationId: 'm1', medicationName: 'Demo', takenAt: date });
});
test('preferences survive repository recreation and stay scoped by account', async () => {
  await AsyncStorage.clear(); const repo = new AsyncStorageSettingsRepository();
  expect(await repo.load(1, safeSettings)).toEqual(safeSettings);
  await repo.save(1, { ...safeSettings, theme: 'dark' });
  expect((await new AsyncStorageSettingsRepository().load(1, safeSettings)).theme).toBe('dark');
  expect((await repo.load(2, safeSettings)).theme).toBe('system');
});
test('corrupt JSON falls back; failed storage writes propagate', async () => {
  jest.mocked(AsyncStorage.getItem).mockResolvedValueOnce('{broken');
  expect(await new AsyncStorageSettingsRepository().load(3, safeSettings)).toEqual(safeSettings);
  jest.mocked(AsyncStorage.setItem).mockRejectedValueOnce(new Error('disk'));
  await expect(new AsyncStorageSettingsRepository().save(3, safeSettings)).rejects.toThrow('disk');
});
