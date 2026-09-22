import React, { useEffect } from 'react';
import { AccessibilityInfo, Alert, Modal, Platform, Text, View } from 'react-native';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { AppProvider, useApp } from '../context/AppContext';
import { fixtures } from './fixtures';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { CareScreen, HealthLogScreen } from '../screens/CareScreens';
import { MessagesScreen } from '../screens/MessageScreens';
import { MedicationsScreen } from '../screens/MedicationScreens';
import { medications, appointments, messages } from '../utils/data';

function Gate({ children }: { children: React.ReactNode }) {
  const { signIn, sessionStage } = useApp();
  useEffect(() => { void signIn('olivia@example.com', 'password'); }, [signIn]);
  return sessionStage === 'signedIn' ? <>{children}</> : <Text>Loading test account</Text>;
}
async function signed(ui: React.ReactNode, setup = fixtures()) {
  const view = render(<AppProvider repositories={setup.repositories}><Gate>{ui}</Gate></AppProvider>);
  await waitFor(() => expect(screen.queryByText('Loading test account')).toBeNull());
  return { ...setup, ...view };
}
const navigation = { navigate: jest.fn(), getParent: () => ({ navigate: jest.fn() }) };
beforeEach(() => { jest.spyOn(Alert, 'alert').mockImplementation(() => {}); jest.spyOn(AccessibilityInfo, 'announceForAccessibility').mockImplementation(() => {}); });
afterEach(() => jest.restoreAllMocks());

test('settings exposes selected themes, disabled bounds and each switch state without hidden-element queries', async () => {
  await signed(<SettingsScreen />);
  expect(screen.getByRole('button', { name: 'Smaller text' })).toBeDisabled();
  fireEvent.press(screen.getByRole('button', { name: 'Dark' }));
  expect(screen.getByRole('button', { name: 'Dark', selected: true })).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Light', selected: false })).toBeTruthy();
  for (const name of ['Reduced motion', 'Static visual alerts', 'Haptic reminders', 'Larger touch targets']) {
    const control = screen.getByRole('switch', { name });
    const old = control.props.value;
    expect(control.props.accessibilityState.checked).toBe(old);
    expect(control.props.accessibilityHint).toBeTruthy();
    fireEvent(control, 'valueChange', !old);
    expect(screen.getByRole('switch', { name, checked: !old })).toBeTruthy();
  }
});

test('save success is a live region only after persistence completes; failure stays an error', async () => {
  const setup = await signed(<SettingsScreen />);
  let finish!: () => void;
  setup.repositories.settings.save.mockImplementationOnce(() => new Promise<void>(resolve => { finish = resolve; }));
  fireEvent.press(screen.getByRole('button', { name: 'Save changes' }));
  expect(screen.queryByText(/✓ Accessibility settings saved/)).toBeNull();
  expect(screen.getByRole('button', { name: 'Saving…' })).toBeDisabled();
  await act(async () => finish());
  const success = await screen.findByText(/✓ Accessibility settings saved/);
  expect(success.props.accessibilityLiveRegion).toBe('polite');
  if (Platform.OS === 'ios') expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledWith(expect.stringContaining('Accessibility settings saved'));
  fireEvent.press(screen.getByRole('button', { name: 'Light' }));
  setup.repositories.settings.save.mockRejectedValueOnce(new Error('disk'));
  fireEvent.press(screen.getByRole('button', { name: 'Save changes' }));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Settings not saved', expect.stringContaining('try again')));
  expect(screen.queryByText(/✓ Accessibility settings saved/)).toBeNull();
});

test('sign-in and sign-up fields retain visible matching names, with native error text', async () => {
  render(<AppProvider repositories={fixtures().repositories}><SignInScreen /></AppProvider>);
  expect(screen.getByLabelText('Email').props.keyboardType).toBe('email-address');
  expect(screen.getByLabelText('Password').props.secureTextEntry).toBe(true);
  fireEvent.changeText(screen.getByLabelText('Email'), 'invalid');
  fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  expect(Alert.alert).toHaveBeenCalledWith('Check your details', expect.stringContaining('valid email'));
  fireEvent.press(screen.getByRole('button', { name: 'Create a new account' }));
  expect(screen.getByLabelText('Full name')).toBeTruthy();
  expect(screen.getByLabelText('Create password').props.secureTextEntry).toBe(true);
  await act(async () => {});
});

test('health form has named fields and meaningful missing-input and success alerts', async () => {
  await signed(<HealthLogScreen />);
  fireEvent.press(screen.getByRole('button', { name: 'Save today’s log' }));
  expect(Alert.alert).toHaveBeenCalledWith('Choose a symptom to continue.');
  fireEvent.changeText(screen.getByLabelText('Symptom'), 'Fatigue');
  fireEvent.changeText(screen.getByLabelText('Private notes (optional)'), 'Test note');
  fireEvent.press(screen.getByRole('button', { name: 'Save today’s log' }));
  await waitFor(() => expect(Alert.alert).toHaveBeenCalledWith('Health log saved.'));
});

test.each(['appointment', 'message'] as const)('%s modal hides background and restores it after cancel or native Back', async kind => {
  const ui = kind === 'appointment' ? <CareScreen {...({ navigation } as unknown as React.ComponentProps<typeof CareScreen>)} /> : <MessagesScreen {...({ navigation } as unknown as React.ComponentProps<typeof MessagesScreen>)} />;
  const view = await signed(ui);
  const trigger = kind === 'appointment' ? 'Add appointment' : 'New message';
  fireEvent.press(screen.getByRole('button', { name: trigger }));
  expect(screen.getByRole('header', { name: trigger })).toBeTruthy();
  expect(screen.getByRole('button', { name: kind === 'appointment' ? 'Save appointment' : 'Send' })).toBeDisabled();
  expect(screen.queryByRole('button', { name: trigger })).toBeNull();
  expect(view.UNSAFE_getAllByType(View).some(v => v.props.accessibilityViewIsModal === true)).toBe(true);
  expect(view.UNSAFE_getAllByType(View).some(v => v.props.importantForAccessibility === 'no-hide-descendants' && v.props.accessibilityElementsHidden)).toBe(true);
  fireEvent.press(screen.getByRole('button', { name: 'Cancel' }));
  expect(screen.getByRole('button', { name: trigger })).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: trigger }));
  fireEvent(view.UNSAFE_getByType(Modal), 'requestClose');
  expect(screen.getByRole('button', { name: trigger })).toBeTruthy();
});

test('repeated list actions identify their destination in the accessible name', async () => {
  const view = await signed(<MedicationsScreen {...({ navigation } as unknown as React.ComponentProps<typeof MedicationsScreen>)} />);
  for (const item of medications) expect(screen.getByRole('button', { name: `View details for ${item.name}` })).toBeTruthy();
  view.unmount();
  const care = await signed(<CareScreen {...({ navigation } as unknown as React.ComponentProps<typeof CareScreen>)} />);
  for (const item of appointments) expect(screen.getByRole('button', { name: `View appointment: ${item.title}` })).toBeTruthy();
  care.unmount();
  await signed(<MessagesScreen {...({ navigation } as unknown as React.ComponentProps<typeof MessagesScreen>)} />);
  for (const item of messages) expect(screen.getByRole('button', { name: `Open message: ${item.subject}, from ${item.sender}` })).toBeTruthy();
});
