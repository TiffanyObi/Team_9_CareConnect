import { passwordHasher } from '../storage/passwords';
test('password hashing verifies the correct password and rejects another', async () => {
  const record = await passwordHasher.create('correct password');
  expect(record.hash).toMatch(/^[a-f0-9]{64}$/); expect(record.hash).not.toContain('password');
  expect(await passwordHasher.verify('correct password', record)).toBe(true);
  expect(await passwordHasher.verify('wrong password', record)).toBe(false);
  expect(await passwordHasher.verify('correct password', { ...record, hash: 'short' })).toBe(false);
}, 30000);
