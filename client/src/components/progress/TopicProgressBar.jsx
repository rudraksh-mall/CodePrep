export default function TopicProgressBar({ topic, solved, total }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
          {topic}
        </span>
        <span className="text-xs text-surface-500">
          {solved}/{total}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
