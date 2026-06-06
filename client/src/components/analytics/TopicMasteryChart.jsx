import Card from '../ui/Card';

function getMasteryColor(pct) {
  if (pct >= 70) return 'bg-green-500';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function TopicMasteryChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-surface-400">
        Solve problems to see topic mastery
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {data.map((t) => (
        <div key={t.topic}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              {t.topic}
            </span>
            <span className="text-xs text-surface-500">
              {t.solved}/{t.total} ({t.mastery}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getMasteryColor(t.mastery)}`}
              style={{ width: `${t.mastery}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
