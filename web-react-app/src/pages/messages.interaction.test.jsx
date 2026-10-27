import { beforeEach, expect, it } from '@jest/globals';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { signIn } from '../services/authRepository';
import { renderApp } from '../test/renderApp';

beforeEach(() => window.localStorage.clear());

it('shows message details, switches conversations, and filters the inbox', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/messages');

  expect(await screen.findByRole('heading', { name: 'Messages' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Preparing for your medication review' })).toBeInTheDocument();
  expect(screen.getByText('For our medication review, please bring your current medication list and any questions you would like to discuss. You do not need to make any changes before we meet.')).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /Jordan Lee, PT/ }));
  expect(screen.getByRole('heading', { name: 'A note about your home exercises' })).toBeInTheDocument();
  expect(screen.getByText('Home exercise plan')).toBeInTheDocument();

  await user.type(screen.getByRole('searchbox', { name: 'Search messages' }), 'Morgan');
  expect(screen.getByRole('button', { name: /Morgan Patel/ })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /Jordan Lee, PT/ })).not.toBeInTheDocument();
});

it('sends a new local message and replies to an existing conversation', async () => {
  await signIn({ email: 'omartinez@careconnect.com', password: 'password' });
  const user = userEvent.setup();
  renderApp('/messages');
  await screen.findByRole('heading', { name: 'Messages' });

  await user.click(screen.getByRole('button', { name: 'New message' }));
  await user.selectOptions(screen.getByLabelText('Recipient'), 'Morgan Patel');
  await user.type(screen.getByLabelText('Subject'), 'Question about my visit');
  await user.type(screen.getByLabelText('Message'), 'Could you confirm the appointment time?');
  await user.click(screen.getByRole('button', { name: 'Send message' }));

  expect(screen.getByRole('heading', { name: 'Question about my visit' })).toBeInTheDocument();
  expect(screen.getAllByText('Could you confirm the appointment time?')).toHaveLength(2);
  expect(screen.getByRole('status')).toHaveTextContent('It was not delivered');

  await user.click(screen.getByRole('button', { name: /Dr\. Maya Chen/ }));
  await user.type(screen.getByLabelText('Reply to Dr. Maya Chen'), 'Thank you, I will bring my list.');
  await user.click(screen.getByRole('button', { name: 'Send reply' }));

  expect(screen.getAllByText('Thank you, I will bring my list.')).toHaveLength(2);
  expect(screen.getByRole('status')).toHaveTextContent('It was not delivered');
  const savedMessages = JSON.parse(window.localStorage.getItem('careconnect-safeview-messages:olivia-martinez-demo'));
  expect(savedMessages).toHaveLength(4);
  expect(savedMessages.find((conversation) => conversation.subject === 'Preparing for your medication review').messages).toHaveLength(2);
});
