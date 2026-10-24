import { beforeEach, expect, it } from '@jest/globals';
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

it('creates an account and saves accessibility preferences during onboarding', async () => {
  const user = userEvent.setup();
  renderApp('/signup');
  await screen.findByRole('heading', { name: 'Sign up' });

  await user.type(screen.getByLabelText('Full name'), 'Morgan Rivera');
  await user.type(screen.getByLabelText('Email'), 'mrivera@careconnect.com');
  await user.type(screen.getByLabelText('Password'), 'safe-password');
  await user.type(screen.getByLabelText('Confirm password'), 'safe-password');
  await user.click(screen.getByRole('button', { name: 'Create account' }));

  expect(await screen.findByRole('heading', { name: 'Set up your view' })).toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText('Text size'), '150');
  await user.click(screen.getByLabelText(/High contrast/));
  await user.click(screen.getByRole('button', { name: 'Save and open Dashboard' }));

  expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
  expect(screen.getByText("Morgan Rivera's care workspace · Demo information")).toBeInTheDocument();
  expect(document.documentElement).toHaveAttribute('data-text-scale', '150');
  expect(document.documentElement).toHaveAttribute('data-high-contrast', 'true');
});

it('shows the privacy-preserving password-reset confirmation', async () => {
  const user = userEvent.setup();
  renderApp('/forgot-password');
  await screen.findByRole('heading', { name: 'Forgot password?' });

  await user.type(screen.getByLabelText('Email'), 'omartinez@careconnect.com');
  await user.click(screen.getByRole('button', { name: 'Request reset' }));

  expect(await screen.findByRole('heading', { name: 'Check your email' })).toBeInTheDocument();
  expect(screen.getByRole('status')).toHaveTextContent('If an account exists for that address');
});
