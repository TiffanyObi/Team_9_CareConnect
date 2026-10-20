import { Link, Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="auth-shell">
      <a className="skip-link" href="#auth-content">Skip to main content</a>
      <header className="auth-header">
        <Link className="brand" to="/login" aria-label="CareConnect Safeview login">CareConnect Safeview</Link>
      </header>
      <main id="auth-content" className="auth-content" tabIndex="-1">
        <Outlet />
      </main>
    </div>
  );
}
