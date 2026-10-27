import { beforeEach, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createAccount, signIn, updateAccount } from '../services/authRepository';
import { renderApp } from '../test/renderApp';

beforeEach(() => window.localStorage.clear());

it('presents appointments, health history, and emergency access from the Care hub', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  renderApp('/care');
  expect(await screen.findByRole('heading', { name: 'Care', exact: true })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Upcoming appointments' })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Open health log' })).toHaveAttribute('href', '/care/health-log');
  expect(screen.getByRole('link', { name: 'Emergency assistance' })).toHaveAttribute('href', '/care/emergency');
});

it('validates and saves a private health log for the signed-in user', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/care/health-log');
  await screen.findByRole('heading', { name: 'Health log' });
  await user.click(screen.getByRole('button', { name: 'Save health log' }));
  expect(screen.getByRole('alert')).toHaveTextContent('Choose a symptom');
  await user.selectOptions(screen.getByLabelText('Symptom'), 'Knee pain');
  await user.type(screen.getByLabelText(/Private notes/), 'Pain improved after physical therapy.');
  await user.click(screen.getByRole('button', { name: 'Save health log' }));
  expect(await screen.findByRole('status')).toHaveTextContent('Knee pain was added');
  expect(screen.getByText('Pain improved after physical therapy.')).toBeInTheDocument();
  const stored = JSON.parse(window.localStorage.getItem('careconnect-safeview-health-logs:olivia-martinez-demo'));
  expect(stored).toHaveLength(1);
  expect(stored[0]).toMatchObject({ symptom: 'Knee pain', shareWithCaregiver: false });
});

it('keeps health logs separate for each account', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  window.localStorage.setItem('careconnect-safeview-health-logs:olivia-martinez-demo', JSON.stringify([{ id: '1', symptom: 'Fatigue', notes: '', shareWithCaregiver: false, recordedAt: new Date().toISOString() }]));
  const account = await createAccount({ name: 'New Recipient', email: 'care@example.com', password: 'password123' });
  updateAccount(account.id, { onboardingComplete: true });
  renderApp('/care/health-log');
  expect(await screen.findByText('No symptoms logged yet.')).toBeInTheDocument();
  expect(screen.queryByText('Fatigue', { selector: 'strong' })).not.toBeInTheDocument();
});

it('shows an explicit no-call emergency confirmation and returns focus', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/care/emergency');
  const callButton = await screen.findByRole('button', { name: 'Call emergency services' });
  await user.click(callButton);
  const dialog = screen.getByRole('alertdialog', { name: 'Demo only — no call placed' });
  expect(dialog).toHaveTextContent('cannot call emergency services');
  await user.click(screen.getByRole('button', { name: 'Close' }));
  expect(dialog).not.toBeInTheDocument();
  expect(callButton).toHaveFocus();
});
