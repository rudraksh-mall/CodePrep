import { useState } from 'react';

export default function RoadmapCard({ roadmapId, week, defaultExpanded, checked, onToggle }) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`rounded-xl border shadow-sm transition ${
      checked
        ? 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
        : 'border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900'
    }`}>
      <button
        onClick={() => setExpanded((prev) => !prev)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <div
          onClick={(e) => { e.stopPropagation(); onToggle(week.weekNumber); }}
          className={`flex items-center justify-center h-5 w-5 rounded border-2 shrink-0 transition cursor-pointer ${
            checked
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800'
          }`}
        >
          {checked && (
            <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase shrink-0">
              Week {week.weekNumber}
            </span>
            {checked && (
              <span className="text-xs text-green-600 dark:text-green-400 font-medium">Done</span>
            )}
          </div>
          <p className={`text-sm font-medium mt-0.5 ${checked ? 'text-green-800 dark:text-green-200 line-through' : 'text-surface-900 dark:text-surface-100'}`}>
            {week.theme}
          </p>
        </div>

        <svg
          className={`h-4 w-4 text-surface-400 shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-surface-100 dark:border-surface-800 pt-4">
          {week.topics && week.topics.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">Topics</p>
              <div className="flex flex-wrap gap-1.5">
                {week.topics.map((topic) => (
                  <span
                    key={topic}
                    className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/40 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          )}

          {week.goals && week.goals.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">Goals</p>
              <ul className="space-y-1">
                {week.goals.map((goal, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                    <span className="text-primary-500 mt-0.5">&#8226;</span>
                    {goal}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {week.checkpoints && week.checkpoints.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-2">Checkpoints</p>
              <ul className="space-y-1">
                {week.checkpoints.map((cp, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-surface-700 dark:text-surface-300">
                    <span className="text-amber-500 mt-0.5">&#9655;</span>
                    {cp}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
