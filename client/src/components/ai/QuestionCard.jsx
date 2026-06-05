import { useState } from 'react';

const categoryColors = {
  technical: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  behavioral: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  'system design': 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300',
};

const difficultyColors = {
  easy: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400',
  medium: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
  hard: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

export default function QuestionCard({ question, category, difficulty, skill, guidance }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-sm">
      <div className="p-5 space-y-3">
        <p className="text-sm text-surface-900 dark:text-surface-100 leading-relaxed">
          {question}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {category && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${categoryColors[category] || 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}>
              {category}
            </span>
          )}
          {difficulty && (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${difficultyColors[difficulty] || 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400'}`}>
              {difficulty}
            </span>
          )}
          {skill && (
            <span className="inline-flex items-center rounded-full bg-surface-100 dark:bg-surface-800 px-2.5 py-0.5 text-xs font-medium text-surface-600 dark:text-surface-400">
              {skill}
            </span>
          )}
        </div>

        {guidance && guidance.length > 0 && (
          <div>
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="inline-flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 transition"
            >
              <svg
                className={`h-3.5 w-3.5 transition-transform ${expanded ? 'rotate-90' : ''}`}
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Guidance
            </button>

            {expanded && (
              <ul className="mt-2 space-y-1.5 pl-4 list-disc text-xs text-surface-600 dark:text-surface-400">
                {guidance.map((point, i) => (
                  <li key={i}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
