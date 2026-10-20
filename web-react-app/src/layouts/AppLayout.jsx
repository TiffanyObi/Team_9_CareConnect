import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AppHeader } from '../components/AppHeader';
import { DesktopSidebar } from '../components/DesktopSidebar';
import { MobileMenu } from '../components/MobileMenu';

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
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
      />
      <DesktopSidebar />
      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <main id="main-content" className="page-content" tabIndex="-1">
        <Outlet />
      </main>
    </div>
  );
}
