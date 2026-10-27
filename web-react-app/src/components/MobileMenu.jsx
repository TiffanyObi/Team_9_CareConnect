import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/appointments', label: 'Appointments' },
  { to: '/medications', label: 'Medications' },
  { to: '/messages', label: 'Messages' },
  { to: '/search', label: 'Search visits' },
  { to: '/settings', label: 'Settings' },
  { to: '/help', label: 'Help & shortcuts' },
];

export function MobileMenu({ open, onClose, onLogoutRequest }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const dialog = dialogRef.current;
    const focusable = dialog?.querySelectorAll('a[href], button:not([disabled])');
    focusable?.[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose({ restoreFocus: true });
        return;
      }

      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="mobile-menu-layer">
      <button
        className="mobile-menu-backdrop"
        type="button"
        aria-label="Close navigation menu"
        onClick={() => onClose({ restoreFocus: true })}
      />
      <div
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        <div className="mobile-menu__heading">
          <h2 id="mobile-menu-title">Navigation</h2>
          <button
            className="icon-button"
            type="button"
            aria-label="Close navigation menu"
            onClick={() => onClose({ restoreFocus: true })}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <nav aria-label="Mobile navigation">
          <ul className="mobile-menu__list">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  className={({ isActive }) => `mobile-menu__link${isActive ? ' is-active' : ''}`}
                  end={link.end}
                  onClick={() => onClose()}
                  to={link.to}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <button className="button button--secondary mobile-menu__logout" type="button" onClick={onLogoutRequest}>Log out</button>
      </div>
    </div>
  );
}
