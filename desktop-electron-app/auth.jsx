import React, {useEffect, useRef, useState} from 'react';

const ACCOUNTS = 'careconnect-demo-accounts-v1';
const SESSION = 'careconnect-demo-session-v1';
const SAMPLE = {id: 'sample', name: 'Olivia Reed', sample: true};
const hex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');

function accounts() {
  const raw = localStorage.getItem(ACCOUNTS);
  if (raw === null) return [];
  const data = JSON.parse(raw);
  if (!Array.isArray(data) || !data.every(a => a && typeof a.id === 'string' &&
      /^[\da-f-]{36}$/.test(a.id) && typeof a.name === 'string' && a.name.trim() &&
      typeof a.email === 'string' && typeof a.salt === 'string' && /^[\da-f]{32}$/.test(a.salt) &&
      typeof a.hash === 'string' && /^[\da-f]{64}$/.test(a.hash))) {
    throw new Error('Unreadable account data');
  }
  return data;
}

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bytes = Uint8Array.from(salt.match(/../g), value => parseInt(value, 16));
  return hex(new Uint8Array(await crypto.subtle.deriveBits({name: 'PBKDF2', salt: bytes, iterations: 100000, hash: 'SHA-256'}, key, 256)));
}

function restoreSession() {
  try {
    const id = sessionStorage.getItem(SESSION);
    if (id === 'sample') return SAMPLE;
    const account = id && accounts().find(a => a.id === id);
    return account ? {id: account.id, name: account.name} : null;
  } catch { return null; }
}

export function DemoSession({children}) {
  const [user, setUser] = useState(restoreSession);
  function enter(account) {
    sessionStorage.setItem(SESSION, account.id);
    setUser({id: account.id, name: account.name, sample: !!account.sample});
  }
  function logout() {
    try { sessionStorage.removeItem(SESSION); setUser(null); return ''; }
    catch { return 'Could not log out. Local session storage is unavailable. Try again.'; }
  }
  return user ? children(user, logout) : <AccountPages onEnter={enter}/>;
}

function AccountPages({onEnter}) {
  const [signup, setSignup] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const heading = useRef();
  const alert = useRef();
  const submitting = useRef(false);
  useEffect(() => { heading.current?.focus(); }, [signup]);
  useEffect(() => { if (error) alert.current?.focus(); }, [error]);

  function switchPage() {
    setSignup(value => !value); setError(''); setNotice(''); setPassword(''); setConfirm('');
  }
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    setError(''); setNotice('');
    const address = email.trim().toLowerCase();
    if ((signup && !name.trim()) || !address || !password || (signup && !confirm)) {
      setError('Complete all fields to continue.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setError('Enter an email address such as name@example.com.'); return;
    }
    if (signup && password.length < 8) { setError('Use at least 8 characters for your demo password.'); return; }
    if (signup && password !== confirm) { setError('The passwords do not match.'); return; }
    submitting.current = true; setBusy(true);
    try {
      const list = accounts();
      const account = list.find(a => a.email === address);
      if (signup) {
        if (account) { setError('A demo account with this email already exists. Log in instead.'); return; }
        const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
        const hash = await passwordHash(password, salt);
        localStorage.setItem(ACCOUNTS, JSON.stringify([...list, {id: crypto.randomUUID(), name: name.trim(), email: address, salt, hash}]));
        setSignup(false); setPassword(''); setConfirm('');
        setNotice('Demo account created. Log in with your email and password.');
      } else {
        if (!account || await passwordHash(password, account.salt) !== account.hash) {
          setError('Email or password is incorrect.'); return;
        }
        onEnter(account);
      }
    } catch {
      setError('Could not read or save local account data. Your existing data has not been reset. Try again.');
    } finally { submitting.current = false; setBusy(false); }
  }
  return <div className="auth-shell">
    <main className="auth-card" aria-labelledby="auth-title">
      <div className="brand"><span className="brand-mark" aria-hidden="true">+</span><div>CareConnect<small>SAFEVIEW DESKTOP</small></div></div>
      <p className="eyebrow">LOCAL DEMO ACCOUNT</p>
      <h1 id="auth-title" ref={heading} tabIndex="-1">{signup ? 'Create a demo account' : 'Log in'}</h1>
      <p>{signup ? 'Set up a sample account on this device.' : 'Welcome back. Open your local demo workspace.'}</p>
      <p className="auth-note">Demo only. Use a made-up email and a password you do not use elsewhere. Accounts stay on this device. This is not a secure service for patient data.</p>
      {notice ? <p role="status" className="auth-notice">{notice}</p> : null}
      {error ? <p ref={alert} tabIndex="-1" role="alert" className="error">{error}</p> : null}
      <form onSubmit={submit} noValidate aria-busy={busy}>
        {signup ? <label htmlFor="demo-name">Name<input id="demo-name" autoComplete="name" value={name} onChange={e=>setName(e.target.value)} maxLength={80} required disabled={busy}/></label> : null}
        <label htmlFor="demo-email">Email<input id="demo-email" type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} maxLength={254} required disabled={busy}/></label>
        <label htmlFor="demo-password">Password<input id="demo-password" type="password" autoComplete={signup ? 'new-password' : 'current-password'} value={password} onChange={e=>setPassword(e.target.value)} minLength={signup ? 8 : undefined} maxLength={128} required disabled={busy}/></label>
        {signup ? <label htmlFor="demo-confirm">Confirm password<input id="demo-confirm" type="password" autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} maxLength={128} required disabled={busy}/></label> : null}
        <button className="primary auth-submit" type="submit" disabled={busy}>{busy ? 'Please wait…' : signup ? 'Create account' : 'Log in'}</button>
      </form>
      <button className="auth-switch" type="button" onClick={switchPage} disabled={busy}>{signup ? 'Back to login' : 'Sign up'}</button>
      <div className="auth-sample"><p>Just showing the app? Open Olivia’s sample workspace. It keeps your existing demo notes and visits.</p>
        <button type="button" disabled={busy} onClick={()=>{try {onEnter(SAMPLE);} catch {setError('Could not open the sample session. Try again.');}}}>Open sample workspace</button>
      </div>
    </main>
  </div>;
}
