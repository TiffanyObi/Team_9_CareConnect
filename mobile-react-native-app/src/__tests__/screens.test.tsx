import React, { useEffect } from 'react';
import { Alert, Text } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AppProvider, useApp } from '../context/AppContext';
import { fixtures } from './fixtures';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { TodayScreen } from '../screens/TodayScreen';
import { CareScreen, AppointmentDetailScreen, HealthLogScreen, EmergencyScreen } from '../screens/CareScreens';
import { MedicationsScreen, MedicationDetailScreen } from '../screens/MedicationScreens';
import { MessagesScreen, MessageDetailScreen } from '../screens/MessageScreens';
import { medications, appointments, messages } from '../utils/data';
import { AppText, Button, Card } from '../components/UI';

// Screen unit tests provide only the navigation methods used by each screen.
// navigation.test.tsx also exercises the real navigator.
const nav = () => { const parent = { navigate: jest.fn() }; return { navigate: jest.fn(), getParent: () => parent }; };
function Gate({ children }: { children: React.ReactNode }) {
  const { signIn, sessionStage } = useApp();
  useEffect(() => { void signIn('olivia@example.com', 'password'); }, [signIn]);
  return sessionStage === 'signedIn' ? <>{children}</> : <Text>Loading fixture</Text>;
}
async function signed(ui: React.ReactNode, setup = fixtures()) {
  const result = render(<AppProvider repositories={setup.repositories}><Gate>{ui}</Gate></AppProvider>);
  await waitFor(() => expect(screen.queryByText('Loading fixture')).toBeNull());
  return { ...setup, ...result };
}
beforeEach(() => jest.spyOn(Alert, 'alert').mockImplementation(() => {}));
afterEach(() => jest.restoreAllMocks());

test('settings updates persist current preferences and reset the displayed save notice', async () => {
  const setup = await signed(<SettingsScreen />);
  fireEvent.press(screen.getByText('Dark'));
  fireEvent.press(screen.getByText('Larger text'));
  expect(setup.repositories.settings.save).not.toHaveBeenCalled();
  fireEvent.press(screen.getByText('Save changes'));
  expect(await screen.findByText(/✓ Accessibility settings saved/)).toBeTruthy();
  expect(setup.repositories.settings.save).toHaveBeenCalledWith(1, expect.objectContaining({ theme: 'dark', textScale: 1.25 }));
  fireEvent.press(screen.getByText('Light'));
  expect(screen.queryByText(/✓ Accessibility settings saved/)).toBeNull();
});
test('settings controls honor bounds, reset and switch values', async () => {
  await signed(<SettingsScreen />);
  for (let n = 0; n < 5; n++) fireEvent.press(screen.getByText('Larger text'));
  expect(screen.getByText('Text size: 200%')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Larger text' })).toBeDisabled();
  fireEvent.press(screen.getByText('Smaller text'));
  fireEvent.press(screen.getByText('Device'));
  // The switch is nested within an accessibility group in this UI.
  fireEvent(screen.getByLabelText('Reduced motion', { includeHiddenElements: true }), 'valueChange', false);
  fireEvent(screen.getByLabelText('Static visual alerts', { includeHiddenElements: true }), 'valueChange', false);
  fireEvent(screen.getByLabelText('Haptic reminders', { includeHiddenElements: true }), 'valueChange', false);
  fireEvent(screen.getByLabelText('Larger touch targets', { includeHiddenElements: true }), 'valueChange', false);
  fireEvent.press(screen.getByText('Reset to recommended safe settings'));
  expect(screen.getByText('Text size: 100%')).toBeTruthy();
});
test('health logs validate input, retain it on failure and clear only after success', async () => {
  const { repositories } = await signed(<HealthLogScreen />);
  fireEvent.press(screen.getByText('Save today’s log'));
  expect(Alert.alert).toHaveBeenCalledWith('Choose a symptom to continue.');
  fireEvent.changeText(screen.getByLabelText('Symptom'), 'Test fatigue');
  fireEvent.changeText(screen.getByLabelText('Private notes (optional)'), 'Demo note');
  repositories.healthLogs.addLog.mockRejectedValueOnce(new Error('disk'));
  fireEvent.press(screen.getByText('Save today’s log'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Health log not saved', 'Please try again.'));
  expect(screen.getByLabelText('Symptom').props.value).toBe('Test fatigue');
  fireEvent.press(screen.getByText('Save today’s log'));
  expect(await screen.findByText('Test fatigue')).toBeTruthy();
  expect(screen.getByLabelText('Symptom').props.value).toBe('');
});
test('medication save errors do not create records; success shows the real log', async () => {
  const { repositories } = await signed(<MedicationDetailScreen {...({ route: { params: { medication: medications[0] } } } as unknown as React.ComponentProps<typeof MedicationDetailScreen>)} />);
  expect(screen.getByText('No previous doses logged')).toBeTruthy();
  repositories.medicationLogs.addLog.mockRejectedValueOnce(new Error('disk'));
  fireEvent.press(screen.getByText('Mark as taken'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Medication not logged', 'Please try again.'));
  fireEvent.press(screen.getByText('Mark as taken'));
  expect(await screen.findByText('Logged today')).toBeTruthy();
  expect(screen.getByText(/Last taken/)).toBeTruthy();
});
test('lists show saved logs and route to medication details', async () => {
  const setup = fixtures(); const navigation = nav();
  setup.repositories.medicationLogs.loadLogs.mockResolvedValue([{ id: '1', medicationId: 'm1', medicationName: 'Demo medication', takenAt: new Date() }]);
  await signed(<MedicationsScreen {...({ navigation } as unknown as React.ComponentProps<typeof MedicationsScreen>)} />, setup);
  expect(screen.getByText('Demo medication taken')).toBeTruthy();
  fireEvent.press(screen.getAllByText('View details', { includeHiddenElements: true })[0]);
  expect(navigation.getParent().navigate).toHaveBeenCalledWith('MedicationDetail', { medication: medications[0] });
});
test('care routes and appointment placeholder do not claim to save', async () => {
  const navigation = nav(); await signed(<CareScreen {...({ navigation } as unknown as React.ComponentProps<typeof CareScreen>)} />);
  fireEvent.press(screen.getAllByText('View appointment')[0]);
  expect(navigation.getParent().navigate).toHaveBeenCalledWith('AppointmentDetail', { appointment: appointments[0] });
  fireEvent.press(screen.getByText('Health log')); fireEvent.press(screen.getByText('Emergency assistance'));
  expect(navigation.getParent().navigate).toHaveBeenCalledWith('Emergency');
  fireEvent.press(screen.getByText('Add appointment'));
  expect(screen.getByRole('button', { name: 'Save appointment' })).toBeDisabled();
  fireEvent.press(screen.getByText('Cancel'));
});
test('appointment details route to health logs and messages', async () => {
  const navigation = nav(); await signed(<AppointmentDetailScreen {...({ navigation, route: { params: { appointment: appointments[0] } } } as unknown as React.ComponentProps<typeof AppointmentDetailScreen>)} />);
  fireEvent.press(screen.getByText('Check in')); fireEvent.press(screen.getByText('Message caregiver'));
  expect(navigation.navigate).toHaveBeenCalledWith('HealthLog');
  expect(navigation.navigate).toHaveBeenCalledWith('Tabs', { screen: 'Messages' });
});
test('message list opens details but cannot send a message', async () => {
  const navigation = nav(); await signed(<MessagesScreen {...({ navigation } as unknown as React.ComponentProps<typeof MessagesScreen>)} />);
  fireEvent.press(screen.getAllByText('Open message')[0]);
  expect(navigation.getParent().navigate).toHaveBeenCalledWith('MessageDetail', { message: messages[0] });
  fireEvent.press(screen.getByText('New message'));
  expect(screen.getByRole('button', { name: 'Send' })).toBeDisabled();
  fireEvent.press(screen.getByText('Cancel'));
});
test('message detail displays the supplied body', async () => {
  await signed(<MessageDetailScreen {...({ route: { params: { message: messages[0] } } } as unknown as React.ComponentProps<typeof MessageDetailScreen>)} />);
  expect(screen.getByText(messages[0].body)).toBeTruthy();
});
test('emergency screen exposes the current placeholder and disabled caregiver action', async () => {
  await signed(<EmergencyScreen />);
  expect(screen.getByRole('button', { name: 'Alert caregiver' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Call emergency services' })).toBeTruthy();
});
test('emergency demo says no call was placed', async () => {
  await signed(<EmergencyScreen />);
  fireEvent.press(screen.getByRole('button', { name: 'Call emergency services' }));
  expect(Alert.alert).toHaveBeenCalledWith('Demo only — no call placed', expect.stringContaining('cannot call'));
});
test('settings confirmation waits for storage and failed writes can be retried', async () => {
  const setup = await signed(<SettingsScreen />);
  let finish!: () => void;
  setup.repositories.settings.save.mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve; }));
  fireEvent.press(screen.getByText('Save changes'));
  expect(screen.queryByText(/✓ Accessibility settings saved/)).toBeNull();
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
  await act(async () => finish());
  expect(await screen.findByText(/✓ Accessibility settings saved/)).toBeTruthy();
  fireEvent.press(screen.getByText('Dark'));
  setup.repositories.settings.save.mockRejectedValueOnce(new Error('disk full'));
  fireEvent.press(screen.getByText('Save changes'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Settings not saved', expect.any(String)));
  expect(screen.queryByText(/✓ Accessibility settings saved/)).toBeNull();
  fireEvent.press(screen.getByText('Save changes'));
  expect(await screen.findByText(/✓ Accessibility settings saved/)).toBeTruthy();
});

test('today asks before logout and exposes the medication route', async () => {
  const navigation = nav(); await signed(<TodayScreen {...({ navigation } as unknown as React.ComponentProps<typeof TodayScreen>)} />);
  fireEvent.press(screen.getByText('Log medication'));
  expect(navigation.navigate).toHaveBeenCalledWith('Medications');
  fireEvent.press(screen.getByText('Log out'));
  expect(Alert.alert).toHaveBeenCalledWith('Log out?', expect.any(String), expect.any(Array));
  const buttons = jest.mocked(Alert.alert).mock.calls.at(-1)?.[2];
  act(() => buttons?.[1].onPress?.());
  expect(screen.getByText('Loading fixture')).toBeTruthy();
});
test('shared components have a stable accessibility snapshot', async () => {
  const { toJSON } = await signed(<Card><AppText heading>Saved record</AppText><Button label="Open record" secondary selected /><Button label="Unavailable" disabled /></Card>);
  expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
  expect(toJSON()).toMatchSnapshot();
});
function Session() { const { sessionStage, signOut } = useApp(); return sessionStage === 'signedOut' ? <SignInScreen /> : sessionStage === 'accessibilitySetup' ? <SettingsScreen onboarding /> : <Button label="Exit test account" onPress={signOut} />; }
test('sign-in errors and account creation flow reach onboarding then logout', async () => {
  const { repositories } = fixtures();
  render(<AppProvider repositories={repositories}><Session /></AppProvider>);
  fireEvent.changeText(screen.getByLabelText('Email'), 'bad');
  fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  expect(Alert.alert).toHaveBeenCalledWith('Check your details', expect.any(String));
  fireEvent.changeText(screen.getByLabelText('Email'), 'olivia@example.com');
  repositories.auth.authenticate.mockResolvedValueOnce(null);
  fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Sign in failed', 'Email or password is incorrect.'));
  repositories.auth.authenticate.mockRejectedValueOnce(new Error('db'));
  fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Sign in failed', expect.stringContaining('unavailable')));
  fireEvent.press(screen.getByText('Create a new account'));
  fireEvent.changeText(screen.getByLabelText('Full name'), 'New User');
  repositories.auth.register.mockResolvedValueOnce('emailAlreadyExists');
  fireEvent.press(screen.getByText('Create account and continue'));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Account not created', expect.stringContaining('already exists')));
  fireEvent.press(screen.getByText('Create account and continue'));
  expect(await screen.findByText('Make Safeview comfortable')).toBeTruthy();
  fireEvent.press(screen.getByText('Save my preferences'));
  fireEvent.press(await screen.findByText('Exit test account'));
  expect(screen.getByRole('button', { name: 'Sign in' })).toBeTruthy();
});
