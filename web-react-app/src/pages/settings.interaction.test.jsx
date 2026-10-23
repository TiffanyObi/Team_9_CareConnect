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
  const users = JSON.parse(window.localStorage.getItem('careconnect-safeview-users-v1'));
  expect(users.find((account) => account.email === 'omartinez@careconnect.com').preferences).toMatchObject({
    textScale: '150',
    highContrast: true,
  });
});

it('restores saved accessibility preferences when returning to settings', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  const { router } = renderApp('/settings');
  await screen.findByRole('heading', { name: 'Settings' });
  await user.selectOptions(screen.getByLabelText('Text size'), '125');
  await user.click(screen.getByRole('button', { name: 'Save settings' }));
  await router.navigate('/');
  await router.navigate('/settings');

  expect(await screen.findByRole('combobox', { name: 'Text size' })).toHaveValue('125');
});
