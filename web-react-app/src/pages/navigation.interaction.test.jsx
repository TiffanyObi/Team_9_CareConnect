import { beforeEach, expect, it } from '@jest/globals';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from '../services/authRepository';
import { renderApp } from '../test/renderApp';

beforeEach(() => window.localStorage.clear());

it('opens the mobile navigation and routes to Messages', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/appointments');
  await screen.findByRole('heading', { name: 'Appointments' });

  await user.click(screen.getByRole('button', { name: 'Open navigation menu' }));
  const navigation = screen.getByRole('dialog', { name: 'Navigation' });
  expect(within(navigation).getByRole('link', { name: 'Messages' })).toBeInTheDocument();

  await user.click(within(navigation).getByRole('link', { name: 'Messages' }));
  expect(await screen.findByRole('heading', { name: 'Messages' })).toBeInTheDocument();
  expect(screen.queryByRole('dialog', { name: 'Navigation' })).not.toBeInTheDocument();
});
