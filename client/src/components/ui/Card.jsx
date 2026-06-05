export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-xl border bg-white dark:bg-surface-900 shadow-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`border-b border-surface-200 dark:border-surface-700 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }) {
  return <div className={`px-6 py-4 ${className}`}>{children}</div>;
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`border-t border-surface-200 dark:border-surface-700 px-6 py-4 ${className}`}>
      {children}
    </div>
  );
}
