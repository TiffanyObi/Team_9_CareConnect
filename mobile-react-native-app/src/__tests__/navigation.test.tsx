import React from 'react';
import App from '../../App';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppProvider } from '../context/AppContext';
import { RootNavigator } from '../navigation/RootNavigator';
import { fixtures } from './fixtures';
test('real navigator goes from sign-in to tabs and medication detail', async () => {
  const { repositories } = fixtures();
  render(<AppProvider repositories={repositories}><NavigationContainer><RootNavigator /></NavigationContainer></AppProvider>);
  fireEvent.press(await screen.findByRole('button', { name: 'Sign in' }));
  fireEvent.press(await screen.findByLabelText('Medications tab'));
  fireEvent.press((await screen.findAllByText('View details', { includeHiddenElements: true }))[0]);
  expect(await screen.findByText('Mark as taken')).toBeTruthy();
  const app = render(<App />);
  await waitFor(() => expect(app.getByRole('button', { name: 'Sign in' })).toBeTruthy());
  jest.restoreAllMocks();
}, 30000);
