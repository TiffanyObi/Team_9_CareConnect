import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../state/AuthContext';

const demoContacts = [
  { name: 'Dr. Maya Chen', role: 'Care provider' },
  { name: 'Morgan Patel', role: 'Care coordinator' },
  { name: 'Jordan Lee, PT', role: 'Physical therapist' },
];

const initialConversations = [
  {
    id: 'maya-chen',
    sender: 'Dr. Maya Chen',
    role: 'Care provider',
    subject: 'Preparing for your medication review',
    preview: 'Please bring your current medication list to our next visit.',
    received: 'Today · 9:15 AM',
    topic: 'Medication review',
    related: 'Upcoming appointment',
    body: 'Hello Olivia,\n\nFor our medication review, please bring your current medication list and any questions you would like to discuss. You do not need to make any changes before we meet.\n\nWe can review everything together during your visit.\n\nWarmly,\nDr. Maya Chen',
  },
  {
    id: 'morgan-patel',
    sender: 'Morgan Patel',
    role: 'Care coordinator',
    subject: 'Your appointment options',
    preview: 'I have added the available visit times to your care plan.',
    received: 'Yesterday · 2:40 PM',
    topic: 'Appointments',
    related: 'Care coordination',
    body: 'Hi Olivia,\n\nI have added the available visit times to your care plan. When you have a moment, review your appointments and let us know if you need help finding a time that works.\n\nTake care,\nMorgan',
  },
  {
    id: 'jordan-lee',
    sender: 'Jordan Lee, PT',
    role: 'Physical therapist',
    subject: 'A note about your home exercises',
    preview: 'It is okay to take a rest day if you feel uncomfortable.',
    received: 'Oct 20 · 11:05 AM',
    topic: 'Physical therapy',
    related: 'Home exercise plan',
    body: 'Hello Olivia,\n\nA quick reminder that it is okay to take a rest day if you feel uncomfortable during your home exercises. Please follow the plan we reviewed together, and contact the care team if you have questions before your next visit.\n\nBest,\nJordan Lee',
  },
];

const STORAGE_KEY_PREFIX = 'careconnect-safeview-messages:';

function createInitialConversations() {
  return initialConversations.map((conversation) => ({
    ...conversation,
    contactName: conversation.sender,
    messages: [{
      id: `initial-${conversation.id}`,
      sender: conversation.sender,
      role: conversation.role,
      direction: 'incoming',
      body: conversation.body,
      sentAt: conversation.received,
    }],
  }));
}

function loadConversations(userId) {
  try {
    const saved = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${userId}`);
    if (!saved) return { conversations: createInitialConversations(), error: '' };

    const conversations = JSON.parse(saved);
    if (!Array.isArray(conversations) || !conversations.every((conversation) => (
      typeof conversation.id === 'string'
      && typeof conversation.contactName === 'string'
      && typeof conversation.subject === 'string'
      && Array.isArray(conversation.messages)
    ))) {
      throw new Error('Saved messages have an unexpected format.');
    }
    return { conversations, error: '' };
  } catch {
    return {
      conversations: createInitialConversations(),
      error: 'Saved messages could not be read from this device. Existing demo messages are shown.',
    };
  }
}

function createMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function MessagesPage() {
  const { user } = useAuth();
  const [initialState] = useState(() => loadConversations(user.id));
  const [conversations, setConversations] = useState(initialState.conversations);
  const [storageError, setStorageError] = useState(initialState.error);
  const [announcement, setAnnouncement] = useState('');
  const [selectedId, setSelectedId] = useState(initialState.conversations[0]?.id ?? '');
  const [query, setQuery] = useState('');
  const [reply, setReply] = useState('');
  const [composeOpen, setComposeOpen] = useState(false);
  const [showingDetailsOnMobile, setShowingDetailsOnMobile] = useState(false);
  const [draft, setDraft] = useState({ recipient: demoContacts[0].name, subject: '', body: '' });
  const selected = conversations.find((conversation) => conversation.id === selectedId);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return conversations;
    return conversations.filter((conversation) => (
      `${conversation.contactName} ${conversation.role} ${conversation.subject} ${conversation.preview}`
        .toLowerCase()
        .includes(normalizedQuery)
    ));
  }, [conversations, query]);

  const persistConversations = (nextConversations) => {
    try {
      window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${user.id}`, JSON.stringify(nextConversations));
      setConversations(nextConversations);
      setStorageError('');
      return true;
    } catch {
      setStorageError('Your message could not be saved on this device. Please try again.');
      setAnnouncement('');
      return false;
    }
  };

  const selectConversation = (id) => {
    setSelectedId(id);
    setComposeOpen(false);
    setShowingDetailsOnMobile(true);
    setAnnouncement('');
  };

  const startNewMessage = () => {
    setDraft({ recipient: demoContacts[0].name, subject: '', body: '' });
    setComposeOpen(true);
    setShowingDetailsOnMobile(true);
    setAnnouncement('');
  };

  const sendNewMessage = (event) => {
    event.preventDefault();
    const contact = demoContacts.find((item) => item.name === draft.recipient);
    if (!contact) return;
    const message = {
      id: createMessageId(),
      sender: user.name,
      role: 'You',
      direction: 'outgoing',
      body: draft.body.trim(),
      sentAt: 'Just now',
    };
    const conversation = {
      id: createMessageId(),
      contactName: contact.name,
      sender: contact.name,
      role: contact.role,
      subject: draft.subject.trim(),
      preview: message.body,
      received: 'Just now',
      topic: 'Care message',
      related: 'New conversation',
      messages: [message],
    };
    const nextConversations = [conversation, ...conversations];
    if (!persistConversations(nextConversations)) return;
    setSelectedId(conversation.id);
    setComposeOpen(false);
    setDraft({ recipient: demoContacts[0].name, subject: '', body: '' });
    setAnnouncement('Message saved on this device. It was not delivered to the recipient.');
  };

  const sendReply = (event) => {
    event.preventDefault();
    if (!selected || !reply.trim()) return;
    const message = {
      id: createMessageId(),
      sender: user.name,
      role: 'You',
      direction: 'outgoing',
      body: reply.trim(),
      sentAt: 'Just now',
    };
    const nextConversations = conversations.map((conversation) => (
      conversation.id === selected.id
        ? {
          ...conversation,
          preview: message.body,
          received: 'Just now',
          messages: [...conversation.messages, message],
        }
        : conversation
    ));
    if (!persistConversations(nextConversations)) return;
    setReply('');
    setAnnouncement('Reply saved on this device. It was not delivered to the recipient.');
  };

  const renderMessageBody = (body, messageId) => body.split('\n\n').map((paragraph, index) => (
    <p key={`${messageId}-${index}`}>{paragraph}</p>
  ));

  return (
    <>
      <PageHeader title="Messages" description="Your care workspace · Demo information" />
      {storageError && <p className="inline-alert" role="alert">{storageError}</p>}
      {announcement && <p className="settings-status" role="status">{announcement}</p>}
      <section className={`messages-workspace${showingDetailsOnMobile ? ' messages-workspace--show-details' : ''}`} aria-label="Messages">
        <div className="messages-inbox">
          <div className="messages-inbox__heading">
            <div className="messages-inbox__title">
              <h2 id="conversation-list-heading">Inbox</h2>
              <button className="button button--primary" type="button" onClick={startNewMessage}>New message</button>
            </div>
            <label className="messages-search">
              <span>Search messages</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                aria-label="Search messages"
                placeholder="Name or topic"
              />
            </label>
          </div>
          <ul className="conversation-list" aria-labelledby="conversation-list-heading">
            {filteredConversations.map((conversation) => (
              <li key={conversation.id}>
                <button
                  className={`conversation-item${selectedId === conversation.id ? ' is-selected' : ''}`}
                  type="button"
                  aria-pressed={selectedId === conversation.id}
                  onClick={() => selectConversation(conversation.id)}
                >
                  <span className="conversation-item__topline">
                    <strong>{conversation.contactName}</strong>
                    <time>{conversation.received}</time>
                  </span>
                  <span className="conversation-item__subject">{conversation.subject}</span>
                  <span className="conversation-item__preview">{conversation.preview}</span>
                </button>
              </li>
            ))}
            {!filteredConversations.length && (
              <li className="conversation-empty" role="status">No messages match your search.</li>
            )}
          </ul>
        </div>

        <section className="message-details" aria-label={composeOpen ? 'New message' : 'Message details'} aria-live="polite">
          <button
            className="message-back-button"
            type="button"
            onClick={() => setShowingDetailsOnMobile(false)}
          >
            Back to inbox
          </button>
          {composeOpen ? (
            <form className="message-compose" onSubmit={sendNewMessage}>
              <h2>New message</h2>
              <label>
                Recipient
                <select
                  value={draft.recipient}
                  onChange={(event) => setDraft((current) => ({ ...current, recipient: event.target.value }))}
                >
                  {demoContacts.map((contact) => <option key={contact.name} value={contact.name}>{contact.name} · {contact.role}</option>)}
                </select>
              </label>
              <label>
                Subject
                <input
                  type="text"
                  value={draft.subject}
                  maxLength="120"
                  required
                  onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))}
                />
              </label>
              <label>
                Message
                <textarea
                  value={draft.body}
                  rows="7"
                  maxLength="2000"
                  required
                  onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value }))}
                />
              </label>
              <p className="messages-demo-note">Demo only: messages are saved on this device and are not delivered to care providers.</p>
              <div className="message-form-actions">
                <button className="button button--secondary" type="button" onClick={() => setComposeOpen(false)}>Cancel</button>
                <button className="button button--primary" type="submit">Send message</button>
              </div>
            </form>
          ) : selected ? (
            <>
              <div className="message-details__heading">
                <p className="message-details__eyebrow">{selected.role} · {selected.received}</p>
                <h2>{selected.subject}</h2>
              </div>
              <div className="message-meta">
                <p><strong>Conversation with</strong><span>{selected.contactName}</span></p>
                <p><strong>Topic</strong><span>{selected.topic}</span></p>
                <p><strong>Related to</strong><span>{selected.related}</span></p>
              </div>
              <div className="message-thread" aria-label="Conversation">
                {selected.messages.map((message) => (
                  <article className={`thread-message thread-message--${message.direction}`} key={message.id}>
                    <div className="thread-message__heading">
                      <strong>{message.sender}</strong>
                      <time>{message.sentAt}</time>
                    </div>
                    <div className="message-body">{renderMessageBody(message.body, message.id)}</div>
                  </article>
                ))}
              </div>
              <form className="message-reply" onSubmit={sendReply}>
                <label htmlFor="message-reply">Reply to {selected.contactName}</label>
                <textarea
                  id="message-reply"
                  value={reply}
                  rows="3"
                  maxLength="2000"
                  required
                  onChange={(event) => setReply(event.target.value)}
                />
                <p className="messages-demo-note">Demo only: replies are saved on this device and are not delivered.</p>
                <button className="button button--primary" type="submit">Send reply</button>
              </form>
            </>
          ) : (
            <div className="message-details__empty">
              <h2>Select a message</h2>
              <p>Choose a conversation from your inbox to read its details.</p>
            </div>
          )}
        </section>
      </section>
    </>
  );
}
