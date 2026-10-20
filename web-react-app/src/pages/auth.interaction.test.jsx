import { beforeEach, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderApp } from '../test/renderApp';

beforeEach(() => window.localStorage.clear());

it('rejects invalid credentials and signs Olivia into her personalized Dashboard', async () => {
  const user = userEvent.setup();
  renderApp('/login');
  await screen.findByRole('heading', { name: 'Log in' });
  await user.type(screen.getByLabelText('Email'), 'omartinez@careconnect.com');
  await user.type(screen.getByLabelText('Password'), 'wrong-password');
  await user.click(screen.getByRole('button', { name: 'Log in' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('incorrect');

  await user.clear(screen.getByLabelText('Password'));
  await user.type(screen.getByLabelText('Password'), 'password');
  await user.click(screen.getByRole('button', { name: 'Log in' }));
  expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  expect(screen.getByText("Olivia Martinez's care workspace · Demo information")).toBeInTheDocument();
  expect(screen.getByText(/2 current medications/)).toBeInTheDocument();
});
