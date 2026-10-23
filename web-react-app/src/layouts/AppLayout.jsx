import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { DesktopSidebar } from '../components/DesktopSidebar';
import { LogoutDialog } from '../components/LogoutDialog';
import { MobileMenu } from '../components/MobileMenu';
import { useAuth } from '../state/AuthContext';

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const closeMenu = ({ restoreFocus = false } = {}) => {
    setMenuOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (logoutOpen || menuOpen || event.altKey) return;

      const target = event.target;
      const editingText = target instanceof Element
        && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
      const key = event.key.toLowerCase();

      if (event.key === 'F6' && !editingText) {
        const header = document.querySelector('.app-header');
        const sideNavigation = document.querySelector('.side-rail nav');
        const main = document.querySelector('#main-content');
        const panes = [
          {
            element: header,
            focus() { header?.querySelector('a[href], button:not([disabled])')?.focus(); },
          },
          ...(sideNavigation && window.getComputedStyle(sideNavigation.closest('.side-rail')).display !== 'none'
            ? [{ element: sideNavigation, focus() { sideNavigation.querySelector('a[href], button:not([disabled])')?.focus(); } }]
            : []),
          { element: main, focus() { main?.focus(); } },
        ].filter((pane) => pane.element);
        const currentPane = panes.findIndex((pane) => pane.element.contains(document.activeElement));
        const nextIndex = (currentPane + (event.shiftKey ? -1 : 1) + panes.length) % panes.length;
        event.preventDefault();
        panes[nextIndex].focus();
        return;
      }

      if (event.key === 'F1' && !editingText) {
        event.preventDefault();
        navigate('/help');
        return;
      }

      if (!(event.ctrlKey || event.metaKey) || event.shiftKey) return;
      if (key === 's' && location.pathname === '/appointments/new') {
        const appointmentForm = document.querySelector('.appointment-form');
        if (appointmentForm) {
          event.preventDefault();
          appointmentForm.requestSubmit();
        }
        return;
      }
      if (editingText) return;

      const destinations = {
        '1': '/',
        '2': '/appointments',
        n: '/appointments/new',
        f: '/search',
        ',': '/settings',
      };
      const destination = destinations[key];
      if (!destination) return;

      event.preventDefault();
      if (key === 'f') navigate(destination, { state: { focusSearch: true } });
      else navigate(destination);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname, logoutOpen, menuOpen, navigate]);

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <AppHeader
        menuButtonRef={menuButtonRef}
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((open) => !open)}
        onLogoutRequest={() => setLogoutOpen(true)}
        userName={user.name}
      />
      <DesktopSidebar />
      <MobileMenu open={menuOpen} onClose={closeMenu} onLogoutRequest={() => { setMenuOpen(false); setLogoutOpen(true); }} />
      <main id="main-content" className="page-content" tabIndex="-1">
        <Outlet />
      </main>
      <LogoutDialog
        open={logoutOpen}
        onCancel={() => setLogoutOpen(false)}
        onConfirm={() => { logout(); navigate('/login', { replace: true }); }}
      />
    </div>
  );
}
