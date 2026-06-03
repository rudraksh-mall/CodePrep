const variants = {
  primary:
    'bg-primary-600 text-white hover:bg-primary-500 focus-visible:ring-primary-500 shadow-sm',
  secondary:
    'bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-700 border border-surface-300 dark:border-surface-600',
  ghost:
    'text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800',
  danger:
    'bg-red-600 text-white hover:bg-red-500 focus-visible:ring-red-500 shadow-sm',
};

const sizes = {
  sm: 'px-2.5 py-1.5 text-xs rounded-md',
  md: 'px-4 py-2 text-sm rounded-lg',
  lg: 'px-5 py-2.5 text-base rounded-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className = '',
  ...props
}) {
  return (
    <button
      disabled={loading || disabled}
      className={`inline-flex items-center justify-center gap-2 font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-surface-900 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      )}
      {children}
    </button>
  );
}
