import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export function LoginPage() {
  const { user, login } = useAuth();
  const [values, setValues] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  if (user) return <Navigate to={user.onboardingComplete ? '/' : '/onboarding/accessibility'} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const signedInUser = await login(values);
      const requestedPath = location.state?.from?.pathname;
      navigate(signedInUser.onboardingComplete ? requestedPath || '/' : '/onboarding/accessibility', { replace: true });
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-card" aria-labelledby="login-title">
      <p className="eyebrow">Local demo account</p>
      <h1 id="login-title">Log in</h1>
      <p className="auth-intro">Welcome back. Open your personal CareConnect workspace.</p>
      <p className="demo-notice">Demo only. Do not enter real patient information or a password you use elsewhere.</p>
      {error && <p className="inline-alert" role="alert">{error}</p>}
      <form onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" autoComplete="email" required value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} />
        </div>
        <div className="form-field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" autoComplete="current-password" required value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} />
        </div>
        <button className="button button--primary button--full" type="submit" disabled={submitting}>{submitting ? 'Logging in…' : 'Log in'}</button>
      </form>
      <div className="auth-links">
        <Link to="/forgot-password">Forgot password?</Link>
        <Link to="/signup">Create a new account</Link>
      </div>
      <details className="demo-credentials">
        <summary>Sample account</summary>
        <p>Email: omartinez@careconnect.com</p>
        <p>Password: password</p>
      </details>
    </section>
  );
}
