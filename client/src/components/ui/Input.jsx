export default function Input({ label, error, type = 'text', className = '', ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`block w-full rounded-lg border bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 shadow-sm focus:outline-none focus:ring-2 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-surface-300 dark:border-surface-600 focus:ring-primary-500'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
