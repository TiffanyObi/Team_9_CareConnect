import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AppProvider, useApp } from '../context/AppContext';
import { HealthLog, MedicationLog } from '../types/models';
import { medications, messages } from '../utils/data';
import { fixtures } from './fixtures';

// Behavioral ports of mobile-flutter-app/test tests; no Flutter code is executed here.
function mount(setup = fixtures()) {
  return renderHook(() => useApp(), {
    wrapper: ({ children }: { children: React.ReactNode }) =>
      <AppProvider repositories={setup.repositories}>{children}</AppProvider>,
  });
}

test('Flutter medication_test: fictional schedule contains the expected medication', () => {
  expect(medications).toHaveLength(2);
  expect(medications[0]).toMatchObject({ name: 'Levetiracetam', instructions: 'Take with water.' });
  for (const item of medications) {
    for (const value of Object.values(item)) expect(value.trim().length).toBeGreaterThan(0);
  }
});

test('Flutter domain_and_state: fictional messages contain required fields', () => {
  expect(messages).toHaveLength(2);
  for (const item of messages) {
    for (const value of Object.values(item)) expect(value.trim().length).toBeGreaterThan(0);
  }
});

test('Flutter provider_repository: register, finish onboarding, log out and sign in again', async () => {
  const setup = fixtures();
  const hook = mount(setup);
  await waitFor(() => expect(hook.result.current.isReady).toBe(true));
  await act(async () => expect(await hook.result.current.signUp('Olivia Martinez', 'olivia@example.com', 'password')).toBeNull());
  expect(hook.result.current.sessionStage).toBe('accessibilitySetup');
  await act(async () => hook.result.current.completeOnboarding());
  expect(hook.result.current.sessionStage).toBe('signedIn');
  act(() => hook.result.current.signOut());
  expect(hook.result.current.account).toBeNull();
  await act(async () => expect(await hook.result.current.signIn('olivia@example.com', 'password')).toBeNull());
  expect(hook.result.current.account?.email).toBe('olivia@example.com');
  act(() => hook.result.current.signOut());
  setup.repositories.auth.authenticate.mockResolvedValueOnce(null);
  await act(async () => expect(await hook.result.current.signIn('olivia@example.com', 'wrong')).not.toBeNull());
  expect(hook.result.current.sessionStage).toBe('signedOut');
});

test('Flutter provider_repository: medication logs are newest first and survive provider recreation', async () => {
  const setup = fixtures();
  const saved: MedicationLog[] = [];
  setup.repositories.medicationLogs.addLog.mockImplementation(async (_id, medicationId, medicationName, takenAt) => {
    const entry = { id: String(saved.length + 1), medicationId, medicationName, takenAt };
    saved.unshift(entry); return entry;
  });
  setup.repositories.medicationLogs.loadLogs.mockImplementation(async () => [...saved]);
  const hook = mount(setup);
  await act(async () => { await hook.result.current.signIn('olivia@example.com', 'password'); });
  await act(async () => hook.result.current.markMedicationTaken(medications[0]));
  await act(async () => hook.result.current.markMedicationTaken(medications[1]));
  expect(hook.result.current.medicationLogs.map(log => log.medicationName)).toEqual([medications[1].name, medications[0].name]);
  hook.unmount();
  const reloaded = mount(setup);
  await act(async () => { await reloaded.result.current.signIn('olivia@example.com', 'password'); });
  expect(reloaded.result.current.medicationLogs).toEqual(saved);
  expect(reloaded.result.current.medicationLogs).toHaveLength(2);
});

test('Flutter provider_repository: health symptom and optional notes survive provider recreation', async () => {
  const setup = fixtures();
  const saved: HealthLog[] = [];
  setup.repositories.healthLogs.addLog.mockImplementation(async (_id, symptom, notes, recordedAt) => {
    const entry = { id: String(saved.length + 1), symptom, notes, recordedAt };
    saved.unshift(entry); return entry;
  });
  setup.repositories.healthLogs.loadLogs.mockImplementation(async () => [...saved]);
  const hook = mount(setup);
  await act(async () => { await hook.result.current.signIn('olivia@example.com', 'password'); });
  await act(async () => hook.result.current.addLog('Knee pain', 'After walking'));
  await act(async () => hook.result.current.addLog('Fatigue', ''));
  hook.unmount();
  const reloaded = mount(setup);
  await act(async () => { await reloaded.result.current.signIn('olivia@example.com', 'password'); });
  expect(reloaded.result.current.logs).toEqual([
    expect.objectContaining({ symptom: 'Fatigue', notes: '' }),
    expect.objectContaining({ symptom: 'Knee pain', notes: 'After walking' }),
  ]);
});
