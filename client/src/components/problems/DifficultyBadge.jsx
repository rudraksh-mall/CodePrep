const colors = {
  Easy: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  Medium: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
  Hard: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function DifficultyBadge({ difficulty }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[difficulty] || 'bg-surface-100 text-surface-600'}`}>
      {difficulty}
    </span>
  );
}
