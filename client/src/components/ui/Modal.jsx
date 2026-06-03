import { useEffect } from 'react';

export default function Modal({ open, onClose, title, children, className = '' }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div
        className={`relative w-full max-w-lg rounded-xl border bg-white dark:bg-surface-900 shadow-xl animate-slide-up ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between border-b border-surface-200 dark:border-surface-700 px-6 py-4">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">{title}</h2>
            <button
              onClick={onClose}
              className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
}
