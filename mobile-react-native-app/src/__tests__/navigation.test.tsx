import React from 'react';
import App from '../../App';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { AppProvider } from '../context/AppContext';
import { RootNavigator, RootParams } from '../navigation/RootNavigator';
import { fixtures } from './fixtures';
test('real navigator goes from sign-in to tabs and medication detail', async () => {
  const { repositories } = fixtures();
  render(<AppProvider repositories={repositories}><NavigationContainer><RootNavigator /></NavigationContainer></AppProvider>);
  fireEvent.press(await screen.findByRole('button', { name: 'Sign in' }));
  const medicationsTab = await screen.findByLabelText('Medications tab');
  expect(screen.getByRole('button', { name: 'Medications tab', selected: false })).toBeTruthy();
  for (const tab of ['Today', 'Medications', 'Care', 'Messages', 'Settings']) {
    expect(screen.getByRole('button', { name: `${tab} tab` })).toBeTruthy();
  }
  expect(medicationsTab.props.accessibilityState.selected).toBe(false);
  fireEvent.press(medicationsTab);
  expect(screen.getByLabelText('Medications tab').props.accessibilityState.selected).toBe(true);
  fireEvent.press((await screen.findAllByText('View details', { includeHiddenElements: true }))[0]);
  expect(await screen.findByText('Mark as taken')).toBeTruthy();
  const app = render(<App />);
  await waitFor(() => expect(app.getByRole('button', { name: 'Sign in' })).toBeTruthy());
  jest.restoreAllMocks();
}, 30000);

// Ports the medication detail/Back flow from Flutter widget_test.dart.
test('Flutter widget: logging a dose then Back updates the medication list', async () => {
  const { repositories } = fixtures();
  const navigation = createNavigationContainerRef<RootParams>();
  render(<AppProvider repositories={repositories}><NavigationContainer ref={navigation}><RootNavigator /></NavigationContainer></AppProvider>);
  fireEvent.press(await screen.findByRole('button', { name: 'Sign in' }));
  for (const tab of ['Today', 'Medications', 'Care', 'Messages', 'Settings']) {
    expect(await screen.findByLabelText(`${tab} tab`)).toBeTruthy();
  }
  fireEvent.press(screen.getByLabelText('Medications tab'));
  fireEvent.press((await screen.findAllByText('View details', { includeHiddenElements: true }))[0]);
  fireEvent.press(await screen.findByText('Mark as taken'));
  expect(await screen.findByText('Logged today')).toBeTruthy();
  act(() => navigation.goBack());
  expect(await screen.findByText('Levetiracetam taken')).toBeTruthy();
  expect(screen.queryByText('Mark as taken')).toBeNull();
}, 30000);
