import { AppRepository, initialData, parseUserData, safeSettings, validateSettings } from '../storage/appRepository';
import { fixture, testHasher } from './fixtures';

const email = 'olivia@example.com';
describe('accounts and durable records', () => {
  test('registers a normalized account, stores no plaintext password, and authenticates after restart', async () => {
    const { store, repository } = fixture();
    await expect(repository.register(' Olivia Martinez ', ' Olivia@Example.com ', 'password123')).resolves.toEqual({ fullName: 'Olivia Martinez', email });
    expect(store.values.get('accounts-v1')).not.toContain('password123');
    const reopened = new AppRepository(store, testHasher);
    await expect(reopened.authenticate('OLIVIA@example.com', 'password123')).resolves.toEqual({ fullName: 'Olivia Martinez', email });
    await expect(reopened.authenticate(email, 'incorrect')).rejects.toThrow('incorrect');
    await expect(reopened.authenticate('missing@example.com', 'password123')).rejects.toThrow('incorrect');
    await expect(reopened.authenticate(email, '')).rejects.toThrow('password');
    await expect(reopened.authenticate('bad', 'password123')).rejects.toThrow('valid email');
  });
  test('serializes duplicate registration and prevents overwrites', async () => {
    const { repository } = fixture();
    const results = await Promise.allSettled([repository.register('Olivia', email, 'password123'), repository.register('Other', email, 'password123')]);
    expect(results.map(x => x.status)).toEqual(['fulfilled', 'rejected']);
    await expect(repository.authenticate(email, 'password123')).resolves.toMatchObject({ fullName: 'Olivia' });
  });
  test.each([['', email, 'password123'], ['Name', 'invalid', 'password123'], ['Name', email, 'short'], ['Name', email, 'a'.repeat(129)]])('rejects invalid account fields (%s)', async (name, mail, password) => {
    await expect(fixture().repository.register(name, mail, password)).rejects.toThrow();
  });
  test('rejects damaged stored accounts without replacing them', async () => {
    const { repository, store } = fixture(); store.values.set('accounts-v1', '[{}]');
    await expect(repository.authenticate(email, 'password123')).rejects.toThrow('Saved accounts');
    expect(store.values.get('accounts-v1')).toBe('[{}]');
  });
  test('saves settings across repository instances and isolates accounts', async () => {
    const { repository, store } = fixture();
    await repository.saveSettings(email, { ...safeSettings, theme: 'dark', textScale: 2 });
    expect((await new AppRepository(store, testHasher).load(email)).settings).toMatchObject({ theme: 'dark', textScale: 2 });
    expect((await repository.load('another@example.com')).settings).toEqual(safeSettings);
  });
  test('save failure is reported and previously saved values remain intact', async () => {
    const { repository, store } = fixture(); await repository.saveSettings(email, safeSettings); store.fail = true;
    await expect(repository.saveSettings(email, { ...safeSettings, theme: 'dark' })).rejects.toThrow('Storage unavailable');
    store.fail = false;
    expect((await repository.load(email)).settings.theme).toBe('system');
    await expect(repository.saveSettings(email, { ...safeSettings, theme: 'dark' })).resolves.toBeDefined();
  });
  test('records each dose with its original timestamp and allows the next day', async () => {
    const { repository, clock } = fixture(); const originalTime = clock.value.toISOString();
    await repository.markDose(email, 'levetiracetam', '08:00');
    await expect(repository.markDose(email, 'levetiracetam', '08:00')).rejects.toThrow('already logged');
    await repository.markDose(email, 'levetiracetam', '20:00');
    clock.value = new Date(2026, 8, 13, 9);
    const next = await repository.markDose(email, 'levetiracetam', '08:00');
    expect(next.doses).toHaveLength(3); expect(next.doses[2].takenAt).toBe(originalTime);
    expect(next.doses[0].date).toBe('2026-09-13');
    await expect(repository.markDose(email, 'missing', '08:00')).rejects.toThrow('scheduled dose');
    await expect(repository.markDose(email, 'vitamin-d3', '20:00')).rejects.toThrow('scheduled dose');
  });
  test('rapid taps create only one dose', async () => {
    const { repository } = fixture();
    const result = await Promise.allSettled([repository.markDose(email, 'levetiracetam', '08:00'), repository.markDose(email, 'levetiracetam', '08:00')]);
    expect(result.filter(x => x.status === 'fulfilled')).toHaveLength(1);
    expect((await repository.load(email)).doses).toHaveLength(1);
  });
  test('saves health logs, appointments and local drafts without lost concurrent writes', async () => {
    const { repository, store } = fixture();
    await Promise.all([repository.addLog(email, ' Fatigue ', ' Some notes '), repository.addAppointment(email, ' Checkup ', '2026-10-15 14:30', ' Clinic '), repository.addMessage(email, ' Question ', ' Saved locally ')]);
    const data = await new AppRepository(store, testHasher).load(email);
    expect(data.logs[0]).toMatchObject({ symptom: 'Fatigue', notes: 'Some notes' });
    expect(data.appointments[2]).toMatchObject({ title: 'Checkup', location: 'Clinic' });
    expect(data.messages[0]).toMatchObject({ subject: 'Question', body: 'Saved locally', localOnly: true });
    expect((await repository.load('other@example.com')).logs).toHaveLength(0);
  });
  test.each(['2026-02-30 12:00', '2026-10-15 25:00', 'yesterday', '2026-01-01 10:00'])('rejects invalid appointment date %s', async date => {
    await expect(fixture().repository.addAppointment(email, 'Visit', date, 'Clinic')).rejects.toThrow('future local date');
  });
  test('rejects blank and overlong entries', async () => {
    const { repository } = fixture();
    expect(() => repository.addLog(email, ' ', '')).toThrow('Symptom');
    await expect(repository.addLog(email, 'Fatigue', 'x'.repeat(2001))).rejects.toThrow('2,000');
    expect(() => repository.addAppointment(email, '', '2026-10-15 14:30', 'Clinic')).toThrow('Appointment name');
    expect(() => repository.addAppointment(email, 'Visit', '2026-10-15 14:30', '')).toThrow('Location');
    expect(() => repository.addMessage(email, '', 'hello')).toThrow('Subject');
    expect(() => repository.addMessage(email, 'Hello', '')).toThrow('Message');
  });
  test('damaged JSON is preserved and cannot be silently overwritten by a save', async () => {
    const { repository, store } = fixture(); store.values.set('user-v1:' + email, '{broken');
    await expect(repository.saveSettings(email, safeSettings)).rejects.toThrow();
    expect(store.values.get('user-v1:' + email)).toBe('{broken');
  });
});
describe('stored-data validation', () => {
  test('reads complete valid records', () => expect(parseUserData(JSON.stringify(initialData()))).toEqual(initialData()));
  test.each([{ ...safeSettings, textScale: 0 }, { ...safeSettings, textScale: 3 }, { ...safeSettings, theme: 'unknown' }, { ...safeSettings, reducedMotion: 'yes' }, null])('rejects invalid settings', value => {
    expect(() => validateSettings(value as never)).toThrow('settings');
  });
  test.each([{ version: 9 }, { ...initialData(), doses: [{}] }, { ...initialData(), logs: [{}] }, { ...initialData(), appointments: [{}] }, { ...initialData(), messages: [{}] }, null])('rejects invalid record shapes', data => {
    expect(() => parseUserData(JSON.stringify(data))).toThrow('Saved data');
  });
});
