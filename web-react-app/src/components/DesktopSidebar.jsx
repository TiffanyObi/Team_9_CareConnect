import { NavLink } from 'react-router-dom';

const navigation = [
  { to: '/', label: 'Overview', symbol: '⌂', end: true },
  { to: '/appointments', label: 'Appointments', symbol: '▦' },
  { to: '/medications', label: 'Medications', symbol: '✚' },
  { to: '/care', label: 'Care', symbol: '♥' },
  { to: '/messages', label: 'Messages', symbol: '✉' },
  { to: '/search', label: 'Search', symbol: '⌕' },
  { to: '/settings', label: 'Settings', symbol: '⚙' },
  { to: '/help', label: 'Help', symbol: '?' },
];

export function DesktopSidebar() {
  return (
    <aside className="side-rail">
      <nav aria-label="Workspace navigation">
        <ul className="side-rail__list">
          {navigation.map((item) => (
            <li key={item.to}>
              <NavLink
                className={({ isActive }) => `side-rail__link${isActive ? ' is-active' : ''}`}
                end={item.end}
                to={item.to}
              >
                <span className="side-rail__symbol" aria-hidden="true">{item.symbol}</span>
                <span className="side-rail__label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
