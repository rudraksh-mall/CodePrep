import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/problems', label: 'Problems', icon: '📝' },
  { to: '/assistant', label: 'Assistant', icon: '🤖' },
  { to: '/resume', label: 'Resume', icon: '📄' },
  { to: '/roadmap', label: 'Roadmap', icon: '🗺️' },
  { to: '/analytics', label: 'Analytics', icon: '📈' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex flex-col w-56 border-r bg-white dark:bg-surface-900 min-h-[calc(100vh-3.5rem)]">
      <nav className="flex-1 space-y-1 p-3">
        {links.map((link) => {
          const active = pathname.startsWith(link.to);
          return (
            <Link
              key={link.to}
              to={link.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                active
                  ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                  : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-surface-200 dark:border-surface-700 p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
        >
          <span>🚪</span>
          Logout
        </button>
      </div>
    </aside>
  );
}
