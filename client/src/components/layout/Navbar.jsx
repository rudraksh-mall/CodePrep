import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/problems', label: 'Problems' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/assistant', label: 'Assistant' },
  { to: '/resume', label: 'Resume' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/analytics', label: 'Analytics' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-40 border-b bg-white dark:bg-surface-900 shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/dashboard" className="text-lg font-bold text-primary-600 dark:text-primary-400">
          CodePrep AI
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => {
            const active = pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  active
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={logout}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
