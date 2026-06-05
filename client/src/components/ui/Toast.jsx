import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

const ToastContext = createContext(null);

const ICONS = {
  success: (
    <svg className="h-5 w-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" />
      <path d="M22 4L12 14.01l-3-3" strokeLinecap="round" />
    </svg>
  ),
  error: (
    <svg className="h-5 w-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M15 9l-6 6m0-6l6 6" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg className="h-5 w-5 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4m0-4h.01" strokeLinecap="round" />
    </svg>
  ),
};

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 4000);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border bg-white dark:bg-surface-800 px-4 py-3 shadow-lg animate-slide-up ${
        toast.type === 'success' ? 'border-green-200 dark:border-green-800' :
        toast.type === 'error' ? 'border-red-200 dark:border-red-800' :
        'border-blue-200 dark:border-blue-800'
      }`}
    >
      {ICONS[toast.type] || ICONS.info}
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-medium text-surface-900 dark:text-surface-100">{toast.title}</p>
        )}
        {toast.message && (
          <p className="text-xs text-surface-500 dark:text-surface-400">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 transition"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const showToast = useCallback(({ type = 'info', title, message, duration }) => {
    const id = ++nextId.current;
    setToasts((prev) => [...prev, { id, type, title, message, duration }]);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      {createPortal(
        <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onRemove={removeToast} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
