import { AppRepository } from '../storage/appRepository';
import { KeyValueStore } from '../storage/sqlite';
import { PasswordHasher } from '../storage/passwords';

export class MemoryStore implements KeyValueStore {
  values = new Map<string, string>(); fail = false;
  async get(key: string) { if (this.fail) throw new Error('Storage unavailable'); return this.values.get(key) ?? null; }
  async set(key: string, value: string) { if (this.fail) throw new Error('Storage unavailable'); this.values.set(key, value); }
}
const testHash = (value: string) => Array.from(value).map(x => x.charCodeAt(0).toString(16)).join('').padEnd(64, '0').slice(0, 64);
export const testHasher: PasswordHasher = {
  create: async password => ({ salt: '0'.repeat(32), hash: testHash(password) }),
  verify: async (password, record) => record.hash === testHash(password),
};
export function fixture() {
  const store = new MemoryStore();
  const clock = { value: new Date(2026, 8, 12, 10, 15) };
  const repository = new AppRepository(store, testHasher, () => clock.value);
  return { store, clock, repository };
}
