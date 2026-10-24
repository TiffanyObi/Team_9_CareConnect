import { afterEach, beforeEach, expect, it } from '@jest/globals';
import { fireEvent, screen } from '@testing-library/react';
import { signIn } from '../services/authRepository';
import { renderApp } from '../test/renderApp';

const originalPlatform = Object.getOwnPropertyDescriptor(navigator, 'platform');

beforeEach(() => window.localStorage.clear());

afterEach(() => {
  if (originalPlatform) Object.defineProperty(navigator, 'platform', originalPlatform);
});

it('shows Mac shortcuts and opens Help with F1', async () => {
  Object.defineProperty(navigator, 'platform', { configurable: true, value: 'MacIntel' });
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  renderApp('/appointments');

  expect(await screen.findByRole('heading', { name: 'Appointments' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'F1' });
  expect(await screen.findByRole('heading', { name: 'Help & shortcuts' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Mac keyboard shortcuts' })).toBeInTheDocument();
  expect(screen.getByText('⌘ Command + 1')).toBeInTheDocument();
});

it('uses Ctrl shortcuts to navigate and focuses visit search', async () => {
  Object.defineProperty(navigator, 'platform', { configurable: true, value: 'Win32' });
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  renderApp('/appointments');

  expect(await screen.findByRole('heading', { name: 'Appointments' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: '1', ctrlKey: true });
  expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: '2', ctrlKey: true });
  expect(await screen.findByRole('heading', { name: 'Appointments' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'n', ctrlKey: true });
  expect(await screen.findByRole('heading', { name: 'New appointment' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: ',', ctrlKey: true });
  expect(await screen.findByRole('heading', { name: 'Settings' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'F1' });
  expect(await screen.findByRole('heading', { name: 'Help & shortcuts' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Windows keyboard shortcuts' })).toBeInTheDocument();
  fireEvent.keyDown(document, { key: 'f', ctrlKey: true });

  expect(await screen.findByRole('heading', { name: 'Search visits' })).toBeInTheDocument();
  expect(screen.getByLabelText('Provider')).toHaveFocus();
  document.querySelector('.app-header a').focus();
  fireEvent.keyDown(document, { key: 'F6' });
  expect(document.querySelector('.side-rail a')).toHaveFocus();
});

it('submits the new appointment form with the save shortcut', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  renderApp('/appointments/new');
  await screen.findByRole('heading', { name: 'New appointment' });

  fireEvent.change(screen.getByLabelText(/Provider/), { target: { value: 'Dr. Maya Chen' } });
  fireEvent.change(screen.getByLabelText(/Appointment date/), { target: { value: '2035-06-15' } });
  fireEvent.change(screen.getByLabelText(/Start time/), { target: { value: '10:30' } });
  fireEvent.change(screen.getByLabelText(/Visit type/), { target: { value: 'Medication review' } });
  fireEvent.keyDown(screen.getByLabelText(/Start time/), { key: 's', ctrlKey: true });

  expect(await screen.findByRole('heading', { name: 'Appointment saved' })).toBeInTheDocument();
});
