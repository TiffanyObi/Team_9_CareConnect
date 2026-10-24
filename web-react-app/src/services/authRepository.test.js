import { beforeEach, describe, expect, it } from '@jest/globals';
import { createAccount, restoreSession, signIn, signOut, updateAccount } from './authRepository';

describe('authRepository', () => {
  beforeEach(() => window.localStorage.clear());

  it('creates, restores, and updates an account without exposing password data', async () => {
    const created = await createAccount({ name: 'Test Recipient', email: 'TEST@example.com', password: 'password123' });
    expect(created).toMatchObject({ name: 'Test Recipient', email: 'test@example.com', onboardingComplete: false });
    expect(created).not.toHaveProperty('passwordHash');
    expect(await restoreSession()).toMatchObject({ id: created.id });

    const updated = updateAccount(created.id, { onboardingComplete: true, preferences: { textScale: '150' } });
    expect(updated.onboardingComplete).toBe(true);
    expect(updated.preferences.textScale).toBe('150');
  });

  it('authenticates the seeded Olivia account and rejects an incorrect password', async () => {
    await expect(signIn({ email: 'omartinez@careconnect.com', password: 'incorrect' })).rejects.toThrow('incorrect');
    await expect(signIn({ email: 'omartinez@careconnect.com', password: 'password' })).resolves.toMatchObject({ name: 'Olivia Martinez' });
    signOut();
    expect(await restoreSession()).toBeNull();
  });
});
