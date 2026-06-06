import { useState, useRef, useEffect, useMemo } from 'react';

const CODING_ROLES = [
  'Software Engineer',
  'Frontend Developer',
  'Backend Developer',
  'Full Stack Developer',
  'MERN Stack Developer',
  'React Developer',
  'Node.js Developer',
  'Java Developer',
  'Python Developer',
  'C++ Developer',
  'Machine Learning Engineer',
  'AI Engineer',
  'Data Engineer',
  'Data Scientist',
  'DevOps Engineer',
  'Cloud Engineer',
  'SRE',
  'Mobile App Developer',
  'Android Developer',
  'iOS Developer',
  'Cybersecurity Engineer',
  'QA Engineer',
  'Platform Engineer',
];

export default function RoleSelect({ label, value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || '');
  const ref = useRef(null);

  const filtered = useMemo(
    () => CODING_ROLES.filter((r) => r.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  useEffect(() => {
    setSearch(value || '');
  }, [value]);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleSelect(role) {
    onChange(role);
    setSearch(role);
    setOpen(false);
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          {label}
        </label>
      )}
      <div ref={ref} className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search for a role..."
          className={`block w-full rounded-lg border bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 shadow-sm focus:outline-none focus:ring-2 ${
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-surface-300 dark:border-surface-600 focus:ring-primary-500'
          }`}
        />
        {open && (
          <div className="absolute z-10 mt-1 w-full rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shadow-lg max-h-48 overflow-y-auto">
            {filtered.length > 0 ? (
              filtered.map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleSelect(role)}
                  className={`w-full text-left px-3 py-2 text-sm transition ${
                    role === value
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700'
                  }`}
                >
                  {role}
                </button>
              ))
            ) : (
              <p className="p-3 text-sm text-surface-500 dark:text-surface-400 text-center">
                No roles found
              </p>
            )}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
