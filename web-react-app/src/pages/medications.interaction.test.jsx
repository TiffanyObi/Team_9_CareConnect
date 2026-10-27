import { beforeEach, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAccount, signIn, updateAccount } from '../services/authRepository';
import { renderApp } from '../test/renderApp';

beforeEach(() => window.localStorage.clear());

it('logs multiple doses of Olivia’s medication with timestamped history', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/medications/levetiracetam');
  await screen.findByRole('heading', { name: 'Levetiracetam' });
  const logButton = screen.getByRole('button', { name: 'Log as taken' });
  await user.click(logButton);
  await user.click(logButton);
  expect(await screen.findByText('2 doses logged today')).toBeInTheDocument();
  expect(screen.getAllByText('Levetiracetam taken')).toHaveLength(2);
  expect(JSON.parse(window.localStorage.getItem('careconnect-safeview-medication-logs:olivia-martinez-demo'))).toHaveLength(2);
});

it('starts a new user empty and lets that user add a medication', async () => {
  const account = await createAccount({ name: 'New Recipient', email: 'new@example.com', password: 'password123' });
  updateAccount(account.id, { onboardingComplete: true });
  const user = userEvent.setup();
  renderApp('/medications');
  expect(await screen.findByRole('heading', { name: 'No medications added' })).toBeInTheDocument();
  await user.click(screen.getByRole('link', { name: 'Add your first medication' }));
  const medicationName = await screen.findByLabelText(/Medication name/);
  await user.type(medicationName, 'Demo medicine');
  await user.type(screen.getByLabelText(/Dosage/), '10 mg');
  await user.type(screen.getByLabelText(/Schedule/), 'At bedtime');
  await user.type(screen.getByLabelText(/Instructions/), 'Take with water');
  await user.click(screen.getByRole('button', { name: 'Save medication' }));
  expect(await screen.findByRole('heading', { name: 'Demo medicine' })).toBeInTheDocument();
  expect(JSON.parse(window.localStorage.getItem(`careconnect-safeview-medications:${account.id}`))).toHaveLength(1);
  expect(window.localStorage.getItem('careconnect-safeview-medications:olivia-martinez-demo')).toBeNull();
});
