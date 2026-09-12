import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { AppProvider } from '../context/AppContext';
import { CareConnect } from '../../App';
import { fixture } from './fixtures';

test('an account can enter the real navigator and open medication details', async () => {
  const { repository } = fixture();
  await repository.register('Test User', 'test@example.com', 'password123');
  render(<AppProvider repository={repository}><CareConnect /></AppProvider>);
  fireEvent.changeText(screen.getByLabelText('Email'), 'test@example.com');
  fireEvent.changeText(screen.getByLabelText('Password'), 'password123');
  fireEvent.press(screen.getByRole('button', { name: 'Sign in' }));
  fireEvent.press(await screen.findByLabelText('Medications tab'));
  fireEvent.press(await screen.findByRole('button', { name: 'View Levetiracetam' }));
  expect(await screen.findByRole('button', { name: 'Mark 08:00 dose as taken' })).toBeTruthy();
}, 30000);
