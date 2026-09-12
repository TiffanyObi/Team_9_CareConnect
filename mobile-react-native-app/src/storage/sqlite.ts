import { openDatabaseAsync } from 'expo-sqlite';
export interface KeyValueStore {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
}
// Fictional coursework data only. This local database is not a healthcare backend.
export function createSqliteStore(): KeyValueStore {
  let pending: ReturnType<typeof openDatabaseAsync> | undefined;
  const database = () => {
    if (!pending) pending = openDatabaseAsync('careconnect-rn-v1.db').then(async db => {
      await db.execAsync('CREATE TABLE IF NOT EXISTS app_values (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL)');
      return db;
    }).catch(error => { pending = undefined; throw error; });
    return pending;
  };
  return {
    async get(key) {
      const row = await (await database()).getFirstAsync<{ value: string }>('SELECT value FROM app_values WHERE key = ?', key);
      return row?.value ?? null;
    },
    async set(key, value) {
      await (await database()).runAsync('INSERT OR REPLACE INTO app_values (key, value) VALUES (?, ?)', key, value);
    },
  };
}
