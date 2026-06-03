export default function StreakCard({ current, longest }) {
  return (
    <div className="rounded-xl border bg-white dark:bg-surface-900 shadow-sm p-6">
      <div className="flex items-center gap-4">
        <span className="text-4xl">🔥</span>
        <div>
          <p className="text-sm text-surface-500 dark:text-surface-400">Current Streak</p>
          <p className="text-3xl font-bold text-surface-900 dark:text-surface-100">
            {current}
            <span className="text-sm font-normal text-surface-400 ml-1">days</span>
          </p>
          <p className="text-xs text-surface-400 mt-1">
            Longest: {longest} day{longest !== 1 ? 's' : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
