import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext';

export function RequireAuth({ requireOnboarding = false }) {
  const { loading, user } = useAuth();
  const location = useLocation();

  if (loading) return <main className="route-loading" aria-live="polite">Loading your workspace…</main>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (requireOnboarding && !user.onboardingComplete) {
    return <Navigate to="/onboarding/accessibility" replace />;
  }
  return <Outlet />;
}
