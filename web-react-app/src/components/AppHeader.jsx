import { NavLink } from 'react-router-dom';

const headerLinks = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/appointments', label: 'Appointments' },
  { to: '/medications', label: 'Medications' },
  { to: '/messages', label: 'Messages' },
  { to: '/settings', label: 'Settings' },
  { to: '/help', label: 'Help' },
];

export function AppHeader({ menuButtonRef, menuOpen, onMenuToggle, onLogoutRequest, userName }) {
  return (
    <header className="app-header">
      <NavLink className="brand" to="/" aria-label="CareConnect Safeview dashboard">
        CareConnect Safeview
      </NavLink>
      <nav className="header-nav" aria-label="Primary navigation">
        {headerLinks.map((link) => (
          <NavLink
            key={link.to}
            className={({ isActive }) => `header-nav__link${isActive ? ' is-active' : ''}`}
            end={link.end}
            to={link.to}
          >
            {link.label}
          </NavLink>
        ))}
        <button className="header-logout" type="button" onClick={onLogoutRequest} aria-label={`Log out ${userName}`}>Log out</button>
      </nav>
      <button
        ref={menuButtonRef}
        className="menu-button"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="mobile-navigation"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        onClick={onMenuToggle}
      >
        <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
      </button>
    </header>
  );
}
