import { useEffect, useRef, useState } from "react";

const ACCOUNTS = "careconnect-demo-accounts-v1";
const SESSION = "careconnect-demo-session-v1";
const SAMPLE = { id: "sample", name: "Olivia Reed", sample: true };
const hex = (bytes) =>
  Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

function accounts() {
  const raw = localStorage.getItem(ACCOUNTS);
  if (raw === null) return [];
  const data = JSON.parse(raw);
  if (
    !Array.isArray(data) ||
    !data.every(
      (account) =>
        account &&
        typeof account.id === "string" &&
        /^[\da-f-]{36}$/.test(account.id) &&
        typeof account.name === "string" &&
        account.name.trim() &&
        typeof account.email === "string" &&
        typeof account.salt === "string" &&
        /^[\da-f]{32}$/.test(account.salt) &&
        typeof account.hash === "string" &&
        /^[\da-f]{64}$/.test(account.hash),
    )
  ) {
    throw new Error("Unreadable account data");
  }
  return data;
}

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bytes = Uint8Array.from(salt.match(/../g), (value) =>
    parseInt(value, 16),
  );
  return hex(
    new Uint8Array(
      await crypto.subtle.deriveBits(
        { name: "PBKDF2", salt: bytes, iterations: 100000, hash: "SHA-256" },
        key,
        256,
      ),
    ),
  );
}

function restoreSession() {
  try {
    const id = sessionStorage.getItem(SESSION);
    if (id === "sample") return SAMPLE;
    const account = id && accounts().find((item) => item.id === id);
    return account ? { id: account.id, name: account.name } : null;
  } catch {
    return null;
  }
}

export function DemoSession({ children }) {
  const [user, setUser] = useState(restoreSession);
  function enter(account) {
    sessionStorage.setItem(SESSION, account.id);
    setUser({
      id: account.id,
      name: account.name,
      sample: Boolean(account.sample),
    });
  }
  function logout() {
    try {
      sessionStorage.removeItem(SESSION);
      setUser(null);
      return "";
    } catch {
      return "Could not log out. Local session storage is unavailable. Try again.";
    }
  }
  return user ? children(user, logout) : <AccountPages onEnter={enter} />;
}

function AccountFrame({
  heading,
  eyebrow = "LOCAL DEMO ACCOUNT",
  children,
  headingRef,
}) {
  return (
    <div className="auth-shell">
      <main className="auth-card" aria-labelledby="auth-title">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            +
          </span>
          <div>
            CareConnect<small>SAFEVIEW DESKTOP</small>
          </div>
        </div>
        <p className="eyebrow">{eyebrow}</p>
        <h1 id="auth-title" ref={headingRef} tabIndex="-1">
          {heading}
        </h1>
        {children}
      </main>
    </div>
  );
}

function AccountPages({ onEnter }) {
  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const heading = useRef();
  const alert = useRef();
  const submitting = useRef(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const signup = page === "signup";

  useEffect(() => {
    heading.current?.focus();
  }, [page]);
  useEffect(() => {
    if (error) {
      if (fieldErrors.confirm === "The passwords do not match.")
        document.getElementById("demo-confirm")?.focus();
      else alert.current?.focus();
    }
  }, [error, fieldErrors]);

  function openPage(next, { keepEmail = true } = {}) {
    setPage(next);
    setError("");
    setFieldErrors({});
    setPassword("");
    setConfirm("");
    if (!keepEmail) setEmail("");
  }

  function validateAddress() {
    const address = email.trim().toLowerCase();
    if (!address) {
      setFieldErrors({ email: "Enter your email address to continue." });
      setError("Enter your email address to continue.");
      return null;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setFieldErrors({
        email: "Enter an email address such as name@example.com.",
      });
      setError("Enter an email address such as name@example.com.");
      return null;
    }
    return address;
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    setError("");
    setFieldErrors({});
    const address = email.trim().toLowerCase();
    if (
      (signup && !name.trim()) ||
      !address ||
      !password ||
      (signup && !confirm)
    ) {
      setFieldErrors(
        Object.fromEntries(
          [
            ["name", signup ? name : "unused"],
            ["email", address],
            ["password", password],
            ["confirm", signup ? confirm : "unused"],
          ]
            .filter(([, value]) => !value.trim())
            .map(([key]) => [
              key,
              `Enter ${key === "confirm" ? "password confirmation" : key}.`,
            ]),
        ),
      );
      setError("Complete all fields to continue.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(address)) {
      setFieldErrors({
        email: "Enter an email address such as name@example.com.",
      });
      setError("Enter an email address such as name@example.com.");
      return;
    }
    if (signup && password.length < 8) {
      setFieldErrors({
        password: "Use at least 8 characters for your demo password.",
      });
      setError("Use at least 8 characters for your demo password.");
      return;
    }
    if (signup && password !== confirm) {
      setFieldErrors({ confirm: "The passwords do not match." });
      setError("The passwords do not match.");
      return;
    }
    submitting.current = true;
    setBusy(true);
    try {
      const list = accounts();
      const account = list.find((item) => item.email === address);
      if (signup) {
        if (account) {
          setError(
            "A demo account with this email already exists. Log in instead.",
          );
          return;
        }
        const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
        const hash = await passwordHash(password, salt);
        localStorage.setItem(
          ACCOUNTS,
          JSON.stringify([
            ...list,
            {
              id: crypto.randomUUID(),
              name: name.trim(),
              email: address,
              salt,
              hash,
            },
          ]),
        );
        openPage("account-created");
      } else {
        if (
          !account ||
          (await passwordHash(password, account.salt)) !== account.hash
        ) {
          setError("Email or password is incorrect.");
          return;
        }
        onEnter(account);
      }
    } catch {
      setError(
        "Could not read or save local account data. Your existing data has not been reset. Try again.",
      );
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  }

  function requestReset(event) {
    event.preventDefault();
    setError("");
    setFieldErrors({});
    if (validateAddress()) setPage("reset-sent");
  }

  if (page === "account-created") {
    return (
      <AccountFrame
        heading="Account created"
        eyebrow="WELCOME TO CARECONNECT"
        headingRef={heading}
      >
        <p role="status" className="auth-notice">
          Your local demo account is ready. Sign in with the email and password
          you just created.
        </p>
        <button
          className="primary auth-submit"
          type="button"
          onClick={() => openPage("login")}
        >
          Go to sign in
        </button>
      </AccountFrame>
    );
  }

  if (page === "reset-sent") {
    return (
      <AccountFrame
        heading="Reset link sent"
        eyebrow="PASSWORD RECOVERY"
        headingRef={heading}
      >
        <p role="status" className="auth-notice">
          If a demo account is associated with that email, password-reset
          instructions would be sent. This local prototype does not send email.
        </p>
        <p>
          For privacy, CareConnect shows the same confirmation whether or not
          the address is registered.
        </p>
        <button
          className="primary auth-submit"
          type="button"
          onClick={() => openPage("login")}
        >
          Back to sign in
        </button>
        <button
          className="auth-switch"
          type="button"
          onClick={() => openPage("forgot")}
        >
          Try another email address
        </button>
      </AccountFrame>
    );
  }

  if (page === "forgot") {
    return (
      <AccountFrame
        heading="Forgot password"
        eyebrow="PASSWORD RECOVERY"
        headingRef={heading}
      >
        <p>
          Enter your account email. The confirmation will not reveal whether the
          address is registered.
        </p>
        <p className="auth-note">
          Demo only. This local prototype does not send email or change stored
          passwords.
        </p>
        {error ? (
          <p
            id="auth-error-summary"
            ref={alert}
            tabIndex="-1"
            role="alert"
            className="error"
          >
            {error}
          </p>
        ) : null}
        <form onSubmit={requestReset} noValidate>
          <div>
            <label htmlFor="recovery-email">
              Email
              <input
                aria-label="Email"
                id="recovery-email"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={
                  fieldErrors.email ? "recovery-email-error" : undefined
                }
                type="email"
                autoComplete="username"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                maxLength={254}
                required
              />
            </label>
            {fieldErrors.email ? (
              <span id="recovery-email-error" className="field-error">
                {fieldErrors.email}
              </span>
            ) : null}
          </div>
          <button className="primary auth-submit" type="submit">
            Send reset link
          </button>
        </form>
        <button
          className="auth-switch"
          type="button"
          onClick={() => openPage("login")}
        >
          Back to sign in
        </button>
      </AccountFrame>
    );
  }

  return (
    <AccountFrame
      heading={signup ? "Create a demo account" : "Log in"}
      headingRef={heading}
    >
      <p>
        {signup
          ? "Set up a sample account on this device."
          : "Welcome back. Open your local demo workspace."}
      </p>
      <p className="auth-note">
        Demo only. Use a made-up email and a password you do not use elsewhere.
        Accounts stay on this device. This is not a secure service for patient
        data.
      </p>
      {error ? (
        <p
          id="auth-error-summary"
          ref={alert}
          tabIndex="-1"
          role="alert"
          className="error"
        >
          {error}
        </p>
      ) : null}
      <form onSubmit={submit} noValidate aria-busy={busy}>
        {signup ? (
          <div>
            <label htmlFor="demo-name">
              Name
              <input
                aria-label="Name"
                id="demo-name"
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={
                  fieldErrors.name ? "demo-name-error" : undefined
                }
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                required
                disabled={busy}
              />
            </label>
            {fieldErrors.name ? (
              <span id="demo-name-error" className="field-error">
                {fieldErrors.name}
              </span>
            ) : null}
          </div>
        ) : null}
        <div>
          <label htmlFor="demo-email">
            Email
            <input
              aria-label="Email"
              id="demo-email"
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={
                fieldErrors.email ? "demo-email-error" : undefined
              }
              type="email"
              autoComplete="username"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              required
              disabled={busy}
            />
          </label>
          {fieldErrors.email ? (
            <span id="demo-email-error" className="field-error">
              {fieldErrors.email}
            </span>
          ) : null}
        </div>
        <div>
          <label htmlFor="demo-password">
            Password
            <input
              aria-label="Password"
              id="demo-password"
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={
                fieldErrors.password ? "demo-password-error" : undefined
              }
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={signup ? 8 : undefined}
              maxLength={128}
              required
              disabled={busy}
            />
          </label>
          {fieldErrors.password ? (
            <span id="demo-password-error" className="field-error">
              {fieldErrors.password}
            </span>
          ) : null}
        </div>
        {signup ? (
          <div>
            <label htmlFor="demo-confirm">
              Confirm password
              <input
                aria-label="Confirm password"
                id="demo-confirm"
                aria-invalid={Boolean(fieldErrors.confirm)}
                aria-describedby={
                  fieldErrors.confirm ? "demo-confirm-error" : undefined
                }
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                maxLength={128}
                required
                disabled={busy}
              />
            </label>
            {fieldErrors.confirm ? (
              <span id="demo-confirm-error" className="field-error">
                {fieldErrors.confirm}
              </span>
            ) : null}
          </div>
        ) : null}
        <button className="primary auth-submit" type="submit" disabled={busy}>
          {busy ? "Please wait…" : signup ? "Create account" : "Log in"}
        </button>
      </form>
      {!signup ? (
        <button
          className="auth-switch"
          type="button"
          onClick={() => openPage("forgot")}
          disabled={busy}
        >
          Forgot password?
        </button>
      ) : null}
      <button
        className="auth-switch"
        type="button"
        onClick={() => openPage(signup ? "login" : "signup")}
        disabled={busy}
      >
        {signup ? "Back to login" : "Sign up"}
      </button>
      {!signup ? (
        <div className="auth-sample">
          <p>
            Just showing the app? Open Olivia’s sample workspace. It keeps your
            existing demo notes and visits.
          </p>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              try {
                onEnter(SAMPLE);
              } catch {
                setError("Could not open the sample session. Try again.");
              }
            }}
          >
            Open sample workspace
          </button>
        </div>
      ) : null}
    </AccountFrame>
  );
}
