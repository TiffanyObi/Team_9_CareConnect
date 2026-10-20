const USERS_KEY = 'careconnect-safeview-users-v1';
const SESSION_KEY = 'careconnect-safeview-session-v1';
const HASH_ITERATIONS = 100_000;

export const defaultPreferences = {
  textScale: '100',
  highContrast: false,
  reducedMotion: true,
  appointmentReminders: true,
  emailUpdates: false,
  shareCareNotes: false,
};

function readUsers() {
  try {
    return JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeUsers(users) {
  window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function bytesToBase64(bytes) {
  return window.btoa(String.fromCharCode(...bytes));
}

function base64ToBytes(value) {
  return Uint8Array.from(window.atob(value), (character) => character.charCodeAt(0));
}

function createSalt() {
  const bytes = new Uint8Array(16);
  globalThis.crypto.getRandomValues(bytes);
  return bytesToBase64(bytes);
}

async function hashPassword(password, salt) {
  const passwordKey = await globalThis.crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await globalThis.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: base64ToBytes(salt),
      iterations: HASH_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    256,
  );
  return bytesToBase64(new Uint8Array(bits));
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash: _passwordHash, salt: _salt, ...safeUser } = user;
  return safeUser;
}

function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

async function ensureDemoAccount() {
  const users = readUsers();
  const demoEmail = 'omartinez@careconnect.com';
  if (users.some((user) => user.email === demoEmail)) return;

  const salt = createSalt();
  users.push({
    id: 'olivia-martinez-demo',
    name: 'Olivia Martinez',
    email: demoEmail,
    salt,
    passwordHash: await hashPassword('password', salt),
    preferences: { ...defaultPreferences },
    onboardingComplete: true,
    isDemo: true,
  });
  writeUsers(users);
}

export async function restoreSession() {
  await ensureDemoAccount();
  const sessionUserId = window.localStorage.getItem(SESSION_KEY);
  return publicUser(readUsers().find((user) => user.id === sessionUserId));
}

export async function signIn({ email, password }) {
  await ensureDemoAccount();
  const user = readUsers().find((candidate) => candidate.email === normalizeEmail(email));
  if (!user || await hashPassword(password, user.salt) !== user.passwordHash) {
    throw new Error('The email or password is incorrect.');
  }
  window.localStorage.setItem(SESSION_KEY, user.id);
  return publicUser(user);
}

export async function createAccount({ name, email, password }) {
  await ensureDemoAccount();
  const users = readUsers();
  const normalizedEmail = normalizeEmail(email);
  if (users.some((user) => user.email === normalizedEmail)) {
    throw new Error('An account already exists for this email address.');
  }

  const salt = createSalt();
  const user = {
    id: globalThis.crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    salt,
    passwordHash: await hashPassword(password, salt),
    preferences: { ...defaultPreferences },
    onboardingComplete: false,
    isDemo: false,
  };
  users.push(user);
  writeUsers(users);
  window.localStorage.setItem(SESSION_KEY, user.id);
  return publicUser(user);
}

export function signOut() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function updateAccount(userId, changes) {
  const users = readUsers();
  const index = users.findIndex((user) => user.id === userId);
  if (index < 0) throw new Error('The account could not be updated.');
  users[index] = {
    ...users[index],
    ...changes,
    preferences: changes.preferences
      ? { ...users[index].preferences, ...changes.preferences }
      : users[index].preferences,
  };
  writeUsers(users);
  return publicUser(users[index]);
}

export async function requestPasswordReset() {
  // A production service would send email through a backend. The demo always
  // returns the same result so it does not disclose whether an account exists.
  return { accepted: true };
}
