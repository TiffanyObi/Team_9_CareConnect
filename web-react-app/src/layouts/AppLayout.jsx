import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate, useNavigation } from 'react-router-dom';
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
  const navigation = useNavigation();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
    document.getElementById('main-content')?.focus();
  }, [location.pathname]);

  const closeMenu = ({ restoreFocus = false } = {}) => {
    setMenuOpen(false);
    if (restoreFocus) requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

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
        {navigation.state !== 'idle' && <p role="status">Loading page…</p>}
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
