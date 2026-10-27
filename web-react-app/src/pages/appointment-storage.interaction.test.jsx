import { beforeEach, expect, it, jest } from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from '../services/authRepository';
import { renderApp } from '../test/renderApp';

beforeEach(() => { jest.restoreAllMocks(); window.localStorage.clear(); });

it('keeps appointment fields on a failed write and saves once after retry', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup(); renderApp('/appointments/new');
  await screen.findByRole('heading', { name: 'New appointment' });
  await user.selectOptions(screen.getByLabelText(/Provider/), 'Dr. Maya Chen');
  await user.type(screen.getByLabelText(/Appointment date/), '2035-06-15');
  await user.type(screen.getByLabelText(/Start time/), '10:30');
  await user.selectOptions(screen.getByLabelText(/Visit type/), 'Medication review');
  await user.type(screen.getByLabelText(/Notes/), 'Retain this appointment note');
  const write = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('Quota exceeded'); });
  await user.click(screen.getByRole('button', { name: 'Save appointment' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Appointment not saved');
  expect(screen.getByLabelText(/Notes/)).toHaveValue('Retain this appointment note');
  expect(screen.getByRole('heading', { name: 'New appointment' })).toBeInTheDocument();
  write.mockRestore();
  await user.click(screen.getByRole('button', { name: 'Save appointment' }));
  await screen.findByRole('heading', { name: 'Appointment saved' });
  const saved = JSON.parse(localStorage.getItem('careconnect-safeview-appointments:olivia-martinez-demo'));
  expect(saved.filter((visit) => visit.notes === 'Retain this appointment note')).toHaveLength(1);
});
