import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export function SignUpPage() {
  const { user, signup } = useAuth();
  const [values, setValues] = useState({ name: '', email: '', password: '', confirmation: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  if (user) return <Navigate to={user.onboardingComplete ? '/' : '/onboarding/accessibility'} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (values.password.length < 8) {
      setError('Create a password with at least 8 characters.');
      return;
    }
    if (values.password !== values.confirmation) {
      setError('The passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await signup(values);
      navigate('/onboarding/accessibility', { replace: true });
    } catch (nextError) {
      setError(nextError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-card" aria-labelledby="signup-title">
      <p className="eyebrow">Create your workspace</p>
      <h1 id="signup-title">Sign up</h1>
      <p className="auth-intro">Your accessibility setup is the next step after account creation.</p>
      <p className="demo-notice">Demo only. Account information stays in this browser and is not suitable for real patient data.</p>
      {error && <p className="inline-alert" role="alert">{error}</p>}
      <form onSubmit={submit}>
        <div className="form-field"><label htmlFor="signup-name">Full name</label><input id="signup-name" autoComplete="name" required value={values.name} onChange={(event) => setValues({ ...values, name: event.target.value })} /></div>
        <div className="form-field"><label htmlFor="signup-email">Email</label><input id="signup-email" type="email" autoComplete="email" required value={values.email} onChange={(event) => setValues({ ...values, email: event.target.value })} /></div>
        <div className="form-field"><label htmlFor="signup-password">Password</label><input id="signup-password" type="password" autoComplete="new-password" minLength="8" required aria-describedby="password-help" value={values.password} onChange={(event) => setValues({ ...values, password: event.target.value })} /><p id="password-help" className="field-help">Use at least 8 characters and do not reuse a real password.</p></div>
        <div className="form-field"><label htmlFor="signup-confirmation">Confirm password</label><input id="signup-confirmation" type="password" autoComplete="new-password" required value={values.confirmation} onChange={(event) => setValues({ ...values, confirmation: event.target.value })} /></div>
        <button className="button button--primary button--full" type="submit" disabled={submitting}>{submitting ? 'Creating account…' : 'Create account'}</button>
      </form>
      <p className="auth-switch">Already have an account? <Link to="/login">Log in</Link></p>
    </section>
  );
}
