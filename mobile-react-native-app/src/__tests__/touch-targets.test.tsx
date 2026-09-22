import React from 'react';
import { StyleSheet } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { Button, minimumTouchTarget, preferredTouchTarget } from '../components/UI';
import { SettingsScreen } from '../screens/SettingsScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { safeSettings, useApp } from '../context/AppContext';

jest.mock('../context/AppContext', () => ({
  ...jest.requireActual('../context/AppContext'),
  useApp: jest.fn(),
}));

const appState = {
  settings: safeSettings,
  updateSettings: jest.fn(),
  resetSettings: jest.fn(),
  saveSettings: jest.fn(async () => undefined),
  completeOnboarding: jest.fn(async () => undefined),
  isBusy: false,
  signIn: jest.fn(async () => null),
  signUp: jest.fn(async () => null),
};

beforeEach(() => {
  jest.mocked(useApp).mockReturnValue(
    appState as unknown as ReturnType<typeof useApp>,
  );
});

function flattenedStyle(element: ReturnType<typeof screen.getByLabelText>) {
  const value = typeof element.props.style === 'function'
    ? element.props.style({ pressed: false })
    : element.props.style;
  return StyleSheet.flatten(value);
}

test('shared buttons guarantee at least a 44 point target', () => {
  render(<Button label="Accessible action" onPress={jest.fn()} />);
  const style = flattenedStyle(screen.getByLabelText('Accessible action'));
  expect(minimumTouchTarget).toBe(44);
  expect(style.minWidth).toBeGreaterThanOrEqual(minimumTouchTarget);
  expect(style.minHeight).toBeGreaterThanOrEqual(preferredTouchTarget);
  expect(screen.getByLabelText('Accessible action').props.focusable).toBe(true);
});

test('disabled shared buttons leave keyboard traversal', () => {
  render(<Button label="Unavailable action" disabled />);
  expect(screen.getByLabelText('Unavailable action').props.focusable).toBe(false);
});

test('settings switches guarantee at least a 44 by 44 point target', () => {
  render(<SettingsScreen />);
  for (const label of [
    'Reduced motion',
    'Static visual alerts',
    'Haptic reminders',
    'Larger touch targets',
  ]) {
    const style = flattenedStyle(screen.getByLabelText(label));
    expect(style.minWidth).toBeGreaterThanOrEqual(minimumTouchTarget);
    expect(style.minHeight).toBeGreaterThanOrEqual(minimumTouchTarget);
  }
});

test('authentication fields meet the preferred touch-target height', () => {
  render(<SignInScreen />);
  for (const label of ['Email', 'Password']) {
    const style = flattenedStyle(screen.getByLabelText(label));
    expect(style.minHeight).toBeGreaterThanOrEqual(preferredTouchTarget);
  }
});
