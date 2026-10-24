import { beforeEach, expect, it } from '@jest/globals';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from '../services/authRepository';
import { renderApp } from '../test/renderApp';

beforeEach(() => window.localStorage.clear());

it('validates required appointment fields and saves a complete visit', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/appointments/new');
  await screen.findByRole('heading', { name: 'New appointment' });
  await user.click(screen.getByRole('button', { name: 'Save appointment' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Select a provider');

  await user.selectOptions(screen.getByLabelText(/Provider/), 'Dr. Maya Chen');
  await user.type(screen.getByLabelText(/Appointment date/), '2030-06-15');
  await user.type(screen.getByLabelText(/Start time/), '10:30');
  await user.selectOptions(screen.getByLabelText(/Visit type/), 'Medication review');
  await user.click(screen.getByRole('button', { name: 'Save appointment' }));
  expect(await screen.findByRole('heading', { name: 'Appointment saved' })).toBeInTheDocument();
  expect(screen.getByText('Medication review')).toBeInTheDocument();
});

it('separates upcoming and past visits and opens appointment details', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/appointments');
  await screen.findByRole('heading', { name: 'Appointments' });

  const upcoming = screen.getByRole('heading', { name: 'Upcoming appointments' }).closest('section');
  const past = screen.getByRole('heading', { name: 'Past appointments' }).closest('section');
  expect(await within(upcoming).findByText('Physical therapy follow-up')).toBeInTheDocument();
  expect(within(upcoming).getByText('Physical therapy follow-up')).toBeInTheDocument();
  expect(within(past).getByText('Primary care check-in')).toBeInTheDocument();

  await user.click(within(upcoming).getByRole('link', { name: /Physical therapy follow-up/ }));
  expect(await screen.findByRole('heading', { name: 'Appointment details' })).toBeInTheDocument();
  expect(screen.getByText('Review knee mobility exercises and current pain level.')).toBeInTheDocument();
});

it('checks in for an appointment and shows the saved confirmation banner', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/appointments/visit-pt-follow-up');
  await screen.findByRole('heading', { name: 'Appointment details' });

  expect(screen.queryByRole('link', { name: 'Edit appointment' })).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Check-in' }));

  expect(await screen.findByRole('status')).toHaveTextContent('You have been checked in');
  expect(screen.queryByRole('button', { name: 'Check-in' })).not.toBeInTheDocument();
  const appointmentsKey = Array.from({ length: window.localStorage.length }, (_, index) => (
    window.localStorage.key(index)
  )).find((key) => key.startsWith('careconnect-safeview-appointments:'));
  expect(appointmentsKey).toBeDefined();
  const savedAppointments = window.localStorage.getItem(appointmentsKey);
  expect(JSON.parse(savedAppointments).find(({ id }) => id === 'visit-pt-follow-up').checkedIn).toBe(true);
});
