import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [complete, setComplete] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    await requestPasswordReset(email);
    setComplete(true);
  };

  return (
    <section className="auth-card" aria-labelledby="reset-title">
      <p className="eyebrow">Account recovery</p>
      <h1 id="reset-title">Forgot password?</h1>
      {complete ? (
        <div className="success-message" role="status">
          <h2>Check your email</h2>
          <p>If an account exists for that address, password reset instructions have been requested.</p>
          <p>This local demo does not send real email.</p>
        </div>
      ) : (
        <>
          <p className="auth-intro">Enter your email to request password reset instructions.</p>
          <form onSubmit={submit}>
            <div className="form-field"><label htmlFor="reset-email">Email</label><input id="reset-email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></div>
            <button className="button button--primary button--full" type="submit">Request reset</button>
          </form>
        </>
      )}
      <p className="auth-switch"><Link to="/login">Return to login</Link></p>
    </section>
  );
}
