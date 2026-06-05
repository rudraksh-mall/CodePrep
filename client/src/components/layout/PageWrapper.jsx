export default function PageWrapper({ children, title }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {title && (
        <h1 className="mb-6 text-2xl font-bold text-surface-900 dark:text-surface-100">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
}
