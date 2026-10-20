import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { PreferenceFields } from '../components/PreferenceFields';
import { useAuth } from '../state/AuthContext';

export function AccessibilityOnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const [preferences, setPreferences] = useState(user?.preferences);
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;
  if (user.onboardingComplete) return <Navigate to="/" replace />;

  const submit = (event) => {
    event.preventDefault();
    completeOnboarding(preferences);
    navigate('/', { replace: true });
  };

  return (
    <section className="auth-card auth-card--wide" aria-labelledby="accessibility-setup-title">
      <p className="eyebrow">Step 2 of 2</p>
      <h1 id="accessibility-setup-title">Set up your view</h1>
      <p className="auth-intro">Choose a comfortable, seizure-safe experience. You can change these settings later.</p>
      <form onSubmit={submit}>
        <PreferenceFields preferences={preferences} onChange={setPreferences} />
        <div className="form-actions"><button className="button button--primary" type="submit">Save and open Dashboard</button></div>
      </form>
    </section>
  );
}
