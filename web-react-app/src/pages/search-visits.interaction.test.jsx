import { beforeEach, expect, it } from '@jest/globals';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from '../services/authRepository';
import { renderApp } from '../test/renderApp';

beforeEach(() => window.localStorage.clear());

it('applies provider, specialty, date, time, and subject filters only after search', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/search');
  await screen.findByRole('heading', { name: 'Search visits' });

  expect(screen.queryByRole('heading', { name: 'Search results' })).not.toBeInTheDocument();
  await user.selectOptions(screen.getByLabelText('Provider'), 'Dr. Maya Chen');
  await user.selectOptions(screen.getByLabelText('Provider specialty'), 'Rehabilitation');
  await user.type(screen.getByLabelText('Date from'), '2026-11-01');
  await user.type(screen.getByLabelText('Date to'), '2026-11-30');
  await user.type(screen.getByLabelText('Time from'), '10:00');
  await user.type(screen.getByLabelText('Time to'), '11:00');
  await user.type(screen.getByPlaceholderText('Search visit subject'), 'physical');
  await user.click(screen.getByRole('button', { name: 'Search', exact: true }));

  const results = screen.getByRole('region', { name: 'Search results' });
  expect(within(results).getByText('1 visit found')).toBeInTheDocument();
  expect(within(results).getByRole('link', { name: /Physical therapy follow-up/ })).toBeInTheDocument();
  expect(within(results).queryByText('Primary care check-in')).not.toBeInTheDocument();
});

it('clears filters and results and shows an empty state for unmatched searches', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/search');
  await screen.findByRole('heading', { name: 'Search visits' });

  await user.type(screen.getByPlaceholderText('Search visit subject'), 'no matching visit');
  await user.click(screen.getByRole('button', { name: 'Search', exact: true }));
  expect(screen.getByText('No visits match these filters. Adjust your criteria and search again.')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Clear filters' }));
  expect(screen.queryByRole('heading', { name: 'Search results' })).not.toBeInTheDocument();
  expect(screen.getByText('Choose any filters, then select Search to display matching visits.')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Search', exact: true }));
  const results = screen.getByRole('region', { name: 'Search results' });
  expect(within(results).getByText('2 visits found')).toBeInTheDocument();
});

it('reports invalid date or time ranges instead of showing misleading results', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/search');
  await screen.findByRole('heading', { name: 'Search visits' });

  await user.type(screen.getByLabelText('Date from'), '2026-12-01');
  await user.type(screen.getByLabelText('Date to'), '2026-11-01');
  await user.click(screen.getByRole('button', { name: 'Search', exact: true }));

  expect(screen.getByRole('alert')).toHaveTextContent('The start date must be on or before the end date.');
  expect(screen.queryByRole('heading', { name: 'Search results' })).not.toBeInTheDocument();
});
