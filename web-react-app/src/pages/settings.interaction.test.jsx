import { beforeEach, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from '../services/authRepository';
import { renderApp } from '../test/renderApp';

beforeEach(() => window.localStorage.clear());

it('saves account-specific display and accessibility preferences', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/settings');
  await screen.findByRole('heading', { name: 'Settings' });
  await user.selectOptions(screen.getByLabelText('Text size'), '150');
  await user.click(screen.getByLabelText(/High contrast/));
  await user.click(screen.getByRole('button', { name: 'Save settings' }));

  expect(await screen.findByRole('status')).toHaveTextContent('saved for this account');
  expect(document.documentElement).toHaveAttribute('data-text-scale', '150');
  expect(document.documentElement).toHaveAttribute('data-high-contrast', 'true');
});
