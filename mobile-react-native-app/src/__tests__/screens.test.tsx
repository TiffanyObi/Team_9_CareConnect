import React, { useEffect } from 'react';
import { AccessibilityInfo, Linking, Text } from 'react-native';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AppProvider, useApp } from '../context/AppContext';
import { SignInScreen } from '../screens/SignInScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { HealthLogScreen, CareScreen, EmergencyScreen, AppointmentDetailScreen } from '../screens/CareScreens';
import { MedicationDetailScreen, MedicationsScreen } from '../screens/MedicationScreens';
import { MessagesScreen, MessageDetailScreen } from '../screens/MessageScreens';
import { TodayScreen } from '../screens/TodayScreen';
import { medications } from '../utils/data';
import { fixture } from './fixtures';
import { AppRepository } from '../storage/appRepository';
import { AppText, Button, Card } from '../components/UI';

beforeEach(() => { jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(false); });
afterEach(() => { jest.restoreAllMocks(); });
function Gate({ children }: { children: React.ReactNode }) {
  const { signedIn, signIn } = useApp();
  useEffect(() => { void signIn('olivia@example.com', 'password123'); }, [signIn]);
  return signedIn ? <>{children}</> : <Text>Loading test account</Text>;
}
async function signed(ui: React.ReactNode, repo?: AppRepository) {
  const setup = fixture(); const repository = repo ?? setup.repository;
  if (!repo) await repository.register('Olivia Martinez', 'olivia@example.com', 'password123');
  const result = render(<AppProvider repository={repository}><Gate>{ui}</Gate></AppProvider>);
  await waitFor(() => expect(screen.queryByText('Loading test account')).toBeNull());
  return { ...setup, repository, ...result };
}
test('registration and sign-in reject invalid data and create a real local account', async () => {
  const { repository } = fixture();
  function View() { const { signedIn, signOut } = useApp(); return signedIn ? <Button label="Log out" onPress={signOut} /> : <SignInScreen />; }
  render(<AppProvider repository={repository}><View /></AppProvider>);
  fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByText('Enter a valid email address.')).toBeTruthy();
  fireEvent.press(screen.getByText('Create a new account'));
  fireEvent.changeText(screen.getByLabelText('Full name'), 'Olivia Martinez');
  fireEvent.changeText(screen.getByLabelText('Email'), 'olivia@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
  fireEvent.press(screen.getByText('Create account and continue'));
  fireEvent.press(await screen.findByText('Log out'));
  fireEvent.changeText(screen.getByLabelText('Email'), 'olivia@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'wrong');
  fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByText('Email or password is incorrect.')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
  fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  expect(await screen.findByText('Log out')).toBeTruthy();
});
test('health log validates, saves, clears fields and shows the persisted record', async () => {
  const { repository } = await signed(<HealthLogScreen />);
  fireEvent.press(screen.getByText('Save today’s log'));
  expect(await screen.findByText(/Symptom is required/)).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Symptom'), 'Fatigue');
  fireEvent.changeText(screen.getByLabelText('Notes (optional)'), 'After walking');
  fireEvent.press(screen.getByText('Save today’s log'));
  expect(await screen.findByText('Health log saved on this device.')).toBeTruthy();
  expect(screen.getByText('After walking')).toBeTruthy();
  expect(screen.getByLabelText('Symptom').props.value).toBe('');
  expect((await repository.load('olivia@example.com')).logs).toHaveLength(1);
});
test('a failed save retains input and does not show success', async () => {
  const { store } = await signed(<HealthLogScreen />); store.fail = true;
  fireEvent.changeText(screen.getByLabelText('Symptom'), 'Headache');
  fireEvent.press(screen.getByText('Save today’s log'));
  expect(await screen.findByText('Storage unavailable')).toBeTruthy();
  expect(screen.queryByText('Health log saved on this device.')).toBeNull();
  expect(screen.getByLabelText('Symptom').props.value).toBe('Headache');
});
test('settings preview, limits, save, and reset behave honestly', async () => {
  const { repository } = await signed(<SettingsScreen />);
  for (let i = 0; i < 4; i++) fireEvent.press(screen.getByText('Larger text'));
  expect(screen.getByRole('button', { name: 'Larger text' })).toBeDisabled();
  expect(screen.getByText('Text size: 200%')).toBeTruthy();
  fireEvent.press(screen.getByText('Smaller text'));
  fireEvent.press(screen.getByRole('button', { name: 'Dark' }));
  fireEvent(screen.getByRole('switch', { name: 'Reduced motion' }), 'valueChange', false);
  fireEvent(screen.getByRole('switch', { name: 'Haptic feedback on successful saves' }), 'valueChange', true);
  fireEvent(screen.getByRole('switch', { name: 'Larger touch targets' }), 'valueChange', false);
  fireEvent.press(screen.getByText('Save changes'));
  expect(await screen.findByText('Settings saved for this account.')).toBeTruthy();
  expect((await repository.load('olivia@example.com')).settings).toMatchObject({ textScale: 1.75, theme: 'dark' });
  fireEvent.press(screen.getByText('Reset to recommended settings'));
  expect(screen.getByText('Text size: 100%')).toBeTruthy();
  expect(screen.queryByText('Settings saved for this account.')).toBeNull();
  expect((await repository.load('olivia@example.com')).settings.theme).toBe('dark');
  fireEvent.press(screen.getByRole('button', { name: 'Light' }));
  fireEvent.press(screen.getByRole('button', { name: 'Device' }));
});
test('medication detail logs separate doses and disables the logged action', async () => {
  const setup = fixture(); setup.clock.value = new Date();
  await setup.repository.register('Olivia', 'olivia@example.com', 'password123');
  await signed(<MedicationDetailScreen route={{ params: { medication: medications[0] } } as never} navigation={{} as never} />, setup.repository);
  fireEvent.press(screen.getByText('Mark 08:00 dose as taken'));
  expect(await screen.findByText('08:00 dose saved.')).toBeTruthy();
  expect(screen.getByRole('button', { name: '08:00 dose taken' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Mark 20:00 dose as taken' })).toBeEnabled();
});
test('appointment form saves a future appointment and routes selected details', async () => {
  const navigate = jest.fn();
  await signed(<CareScreen navigation={{ getParent: () => ({ navigate }) } as never} route={{} as never} />);
  fireEvent.press(screen.getByText('View Physical therapy'));
  expect(navigate).toHaveBeenCalledWith('AppointmentDetail', { appointment: expect.objectContaining({ id: 'physical-therapy' }) });
  fireEvent.press(screen.getByRole('button', { name: 'Add appointment' }));
  fireEvent.changeText(screen.getByLabelText('Appointment name'), 'Checkup');
  fireEvent.changeText(screen.getByLabelText('Local date and time (YYYY-MM-DD HH:mm)'), '2027-10-15 14:30');
  fireEvent.changeText(screen.getByLabelText('Location'), 'Clinic');
  fireEvent.press(screen.getByText('Save appointment'));
  expect(await screen.findByText('Appointment saved on this device.')).toBeTruthy();
  expect(screen.getByText('Checkup')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Add appointment' }));
  fireEvent.press(screen.getByText('Cancel appointment'));
  fireEvent.press(screen.getByText('Health log'));
  fireEvent.press(screen.getByText('Emergency assistance'));
  expect(navigate).toHaveBeenCalledWith('Emergency');
});
test('messages save a local draft without claiming it was sent', async () => {
  const navigate = jest.fn();
  await signed(<MessagesScreen navigation={{ getParent: () => ({ navigate }) } as never} route={{} as never} />);
  fireEvent.press(screen.getByText('New message'));
  fireEvent.press(screen.getByText('Save draft'));
  expect(await screen.findByText(/Subject is required/)).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Subject'), 'Visit question');
  fireEvent.changeText(screen.getByLabelText('Message'), 'Can we discuss my next visit?');
  fireEvent.press(screen.getByText('Save draft'));
  expect(await screen.findByText('Draft saved on this device. It has not been sent.')).toBeTruthy();
  fireEvent.press(screen.getByText('Open Visit question'));
  expect(navigate).toHaveBeenCalledWith('MessageDetail', { message: expect.objectContaining({ localOnly: true }) });
  fireEvent.press(screen.getByText('New message')); fireEvent.press(screen.getByText('Cancel draft'));
});
test('emergency flow supports cancel and unsupported phone without making a call', async () => {
  const canOpen = jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(false);
  const open = jest.spyOn(Linking, 'openURL').mockResolvedValue(undefined);
  await signed(<EmergencyScreen />);
  fireEvent.press(screen.getByText('Open phone app')); fireEvent.press(screen.getByText('Cancel'));
  expect(canOpen).not.toHaveBeenCalled();
  fireEvent.press(screen.getByText('Open phone app')); fireEvent.press(screen.getByText('Confirm open phone'));
  expect(await screen.findByText(/Phone dialing is unavailable/)).toBeTruthy();
  expect(open).not.toHaveBeenCalled();
});
test('emergency launcher only reports a phone-app request, and catches failure', async () => {
  jest.spyOn(Linking, 'canOpenURL').mockResolvedValue(true);
  const open = jest.spyOn(Linking, 'openURL').mockRejectedValueOnce(new Error('Cannot open phone')).mockResolvedValueOnce(undefined);
  await signed(<EmergencyScreen />);
  fireEvent.press(screen.getByText('Open phone app')); fireEvent.press(screen.getByText('Confirm open phone'));
  expect(await screen.findByText('Cannot open phone')).toBeTruthy();
  fireEvent.press(screen.getByText('Confirm open phone'));
  expect(await screen.findByText('Phone app requested. No call has been placed or confirmed by CareConnect.')).toBeTruthy();
  expect(open).toHaveBeenCalledWith('tel:');
});
test('dashboard and detail actions navigate to the right destinations', async () => {
  const navigate = jest.fn();
  const view = await signed(<TodayScreen navigation={{ navigate } as never} route={{} as never} />);
  fireEvent.press(screen.getByText('Log medication')); fireEvent.press(screen.getByText('View appointments'));
  expect(navigate.mock.calls).toEqual([['Medications'], ['Care']]); view.unmount();
  await signed(<AppointmentDetailScreen navigation={{ navigate } as never} route={{ params: { appointment: { title: 'Visit', dateAndTime: 'Tomorrow', location: 'Clinic' } } } as never} />);
  fireEvent.press(screen.getByText('Record a health note')); fireEvent.press(screen.getByText('Open messages'));
  expect(navigate).toHaveBeenCalledWith('Tabs', { screen: 'Messages' });
});
test('medication history renders saved time and message detail identifies local drafts', async () => {
  const setup = fixture(); await setup.repository.register('Olivia', 'olivia@example.com', 'password123');
  await setup.repository.markDose('olivia@example.com', 'levetiracetam', '08:00');
  const navigate = jest.fn();
  const view = await signed(<MedicationsScreen navigation={{ getParent: () => ({ navigate }) } as never} route={{} as never} />, setup.repository);
  expect(screen.getByText(/Recorded taken:/)).toBeTruthy(); fireEvent.press(screen.getByText('View Levetiracetam'));
  expect(navigate).toHaveBeenCalledWith('MedicationDetail', { medication: medications[0] }); view.unmount();
  await signed(<MessageDetailScreen navigation={{} as never} route={{ params: { message: { subject: 'Hello', sender: 'You', body: 'Local body', localOnly: true, createdAt: '2026-09-12T12:00:00Z' } } } as never} />);
  expect(screen.getByText('Local draft only. This message has not been sent.')).toBeTruthy();
});
test('shared controls keep nested buttons accessible and provide a stable snapshot', async () => {
  const onPress = jest.fn();
  const view = await signed(<Card><AppText heading>Reminder</AppText><Button label="Review reminder" onPress={onPress} /></Card>);
  fireEvent.press(screen.getByRole('button', { name: 'Review reminder' })); expect(onPress).toHaveBeenCalledTimes(1);
  expect(view.toJSON()).toMatchSnapshot();
});
