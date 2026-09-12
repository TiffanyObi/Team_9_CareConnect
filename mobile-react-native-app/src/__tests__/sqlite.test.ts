import { openDatabaseAsync } from 'expo-sqlite';
import { createSqliteStore } from '../storage/sqlite';
test('creates the schema once and binds keys and values as parameters', async () => {
  const db = { execAsync: jest.fn(), getFirstAsync: jest.fn().mockResolvedValueOnce(null).mockResolvedValueOnce({ value: 'saved' }), runAsync: jest.fn() };
  (openDatabaseAsync as jest.Mock).mockResolvedValue(db);
  const store = createSqliteStore();
  expect(await store.get('key')).toBeNull();
  await store.set("key'; DROP TABLE app_values;", 'value');
  expect(await store.get('key')).toBe('saved');
  expect(db.execAsync).toHaveBeenCalledTimes(1);
  expect(db.runAsync).toHaveBeenCalledWith(expect.stringContaining('VALUES (?, ?)'), "key'; DROP TABLE app_values;", 'value');
});
test('can retry after a failed database open', async () => {
  (openDatabaseAsync as jest.Mock).mockRejectedValueOnce(new Error('open failed')).mockResolvedValueOnce({ execAsync: jest.fn(), getFirstAsync: jest.fn() });
  const store = createSqliteStore(); await expect(store.get('x')).rejects.toThrow('open failed');
  expect(await store.get('x')).toBeNull();
});
