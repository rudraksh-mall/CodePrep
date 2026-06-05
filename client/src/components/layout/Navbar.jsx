import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMe } from '../../api/auth.api';

const links = [
  { to: '/problems', label: 'Problems' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/assistant', label: 'Assistant' },
  { to: '/resume', label: 'Resume' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/analytics', label: 'Analytics' },
];

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!user?.name) {
      getMe().then(setProfile).catch(() => {});
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const displayName = user?.name || profile?.name || 'User';
  const displayEmail = user?.email || profile?.email || '';
  const initials = getInitials(displayName);

  return (
    <nav className="sticky top-0 z-40 border-b bg-white dark:bg-surface-900 shadow-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden rounded-lg p-2 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>

          <Link to="/dashboard" className="text-lg font-bold text-primary-600 dark:text-primary-400">
            CodePrep AI
          </Link>
        </div>

        <div className="hidden lg:flex items-center gap-1">
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

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-surface-500 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
            aria-label="User menu"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-xs font-bold text-primary-700 dark:text-primary-300">
              {initials}
            </span>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1 w-56 rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-lg py-2">
              <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                  {displayName}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
                  {displayEmail}
                </p>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 flex flex-col h-full w-64 border-r bg-white dark:bg-surface-900 shadow-xl transition-transform duration-200 dark:border-surface-800 lg:hidden ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-700 px-4 h-14 shrink-0">
          <span className="font-semibold text-surface-700 dark:text-surface-300">Menu</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="rounded-lg p-1.5 text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 border-b border-surface-200 dark:border-surface-700 px-4 py-3 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-xs font-bold text-primary-700 dark:text-primary-300">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
              {displayName}
            </p>
            <p className="text-xs text-surface-500 dark:text-surface-400 truncate">
              {displayEmail}
            </p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col p-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const active = pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setDrawerOpen(false)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'
                    : 'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-surface-200 dark:border-surface-700 p-3 mt-auto">
          <button
            onClick={() => { logout(); setDrawerOpen(false); }}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Logout
          </button>
        </div>
      </aside>
    </nav>
  );
}
