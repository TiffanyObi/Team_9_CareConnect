import { beforeEach, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
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
