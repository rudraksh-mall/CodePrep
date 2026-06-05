import { useState } from 'react';
import * as aiApi from '../../api/ai.api';

const LEVELS = [
  {
    level: 1,
    label: 'Conceptual Nudge',
    subtitle: 'What category of approach?',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 1a1 1 0 011 1v1.5a1 1 0 11-2 0V2a1 1 0 011-1zM4.5 4.5a1 1 0 011.414 0l1.06 1.06a1 1 0 11-1.414 1.414L4.5 5.914a1 1 0 010-1.414zm11 0a1 1 0 010 1.414l-1.06 1.06a1 1 0 11-1.414-1.414l1.06-1.06a1 1 0 011.414 0zM10 6a4 4 0 00-3.75 5.292c.27.724.54 1.448.704 2.208H13.046c.164-.76.435-1.484.704-2.208A4 4 0 0010 6zm-3.962 9.5a1 1 0 011-1h5.924a1 1 0 010 2H7.038a1 1 0 01-1-1z" />
      </svg>
    ),
    colors: {
      buttonBg: 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-800 text-teal-700 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/30',
      buttonRevealed: 'bg-teal-100 dark:bg-teal-900/40 text-teal-400 dark:text-teal-600 border-teal-200 dark:border-teal-800',
      calloutBg: 'bg-teal-50 dark:bg-teal-900/15 border-teal-200 dark:border-teal-800',
      accent: 'text-teal-600 dark:text-teal-400',
    },
  },
  {
    level: 2,
    label: 'Algorithmic Approach',
    subtitle: 'Which pattern or data structure?',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
      </svg>
    ),
    colors: {
      buttonBg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/30',
      buttonRevealed: 'bg-blue-100 dark:bg-blue-900/40 text-blue-400 dark:text-blue-600 border-blue-200 dark:border-blue-800',
      calloutBg: 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-800',
      accent: 'text-blue-600 dark:text-blue-400',
    },
  },
  {
    level: 3,
    label: 'Detailed Guidance',
    subtitle: 'Step-by-step walkthrough',
    icon: (
      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
      </svg>
    ),
    colors: {
      buttonBg: 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30',
      buttonRevealed: 'bg-purple-100 dark:bg-purple-900/40 text-purple-400 dark:text-purple-600 border-purple-200 dark:border-purple-800',
      calloutBg: 'bg-purple-50 dark:bg-purple-900/15 border-purple-200 dark:border-purple-800',
      accent: 'text-purple-600 dark:text-purple-400',
    },
  },
];

export default function HintPanel({ problemTitle, problemDescription }) {
  const [hints, setHints] = useState({});
  const [loading, setLoading] = useState({});

  async function handleReveal(level) {
    if (hints[level] || loading[level]) return;

    setLoading((prev) => ({ ...prev, [level]: true }));

    try {
      const result = await aiApi.getHint({ problemTitle, problemDescription, hintLevel: level });
      setHints((prev) => ({ ...prev, [level]: result.hint }));
    } catch {
      setHints((prev) => ({ ...prev, [level]: 'Failed to generate hint. Please try again.' }));
    } finally {
      setLoading((prev) => ({ ...prev, [level]: false }));
    }
  }

  const revealedCount = Object.keys(hints).length;

  return (
    <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-3 border-b border-surface-100 dark:border-surface-800">
        <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Hints</h3>
        <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
          {revealedCount === 0
            ? 'Reveal hints one at a time'
            : `${revealedCount} of ${LEVELS.length} hints revealed`}
        </p>
      </div>

      {revealedCount > 0 && (
        <div className="mx-4 mt-3 flex items-start gap-2 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/15 px-3 py-2.5">
          <svg className="h-4 w-4 mt-0.5 shrink-0 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
            Using hints affects your learning — try solving first!
          </p>
        </div>
      )}

      <div className="p-4 space-y-3">
        {LEVELS.map(({ level, label, subtitle, icon, colors }) => {
          const isLoading = loading[level];
          const isRevealed = Boolean(hints[level]);
          const isLocked = level > 1 && !hints[level - 1] && !hints[level];

          return (
            <div key={level}>
              <button
                onClick={() => handleReveal(level)}
                disabled={isRevealed || isLoading || isLocked}
                className={`w-full text-left rounded-lg border px-3.5 py-3 text-sm font-medium transition-all flex items-start gap-3 ${
                  isRevealed
                    ? `${colors.buttonRevealed} cursor-default`
                    : isLocked
                      ? 'bg-surface-50 dark:bg-surface-800/50 text-surface-300 dark:text-surface-600 border-surface-200 dark:border-surface-700 cursor-not-allowed'
                      : `${colors.buttonBg} shadow-sm hover:shadow`
                }`}
              >
                <span className={`mt-0.5 shrink-0 ${isRevealed ? colors.accent : isLocked ? 'text-surface-300 dark:text-surface-600' : colors.accent}`}>
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                  ) : isLocked ? (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  ) : isRevealed ? (
                    <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    icon
                  )}
                </span>
                <span className="flex-1 min-w-0">
                  <span className={`block text-sm font-semibold ${
                    isRevealed ? colors.accent : isLocked ? 'text-surface-300 dark:text-surface-600' : 'text-surface-900 dark:text-surface-100'
                  }`}>
                    {label}
                  </span>
                  <span className={`block text-xs mt-0.5 ${
                    isRevealed ? 'text-teal-500 dark:text-teal-600' : isLocked ? 'text-surface-300 dark:text-surface-600' : 'text-surface-400 dark:text-surface-500'
                  }`}>
                    {isRevealed ? 'Revealed' : isLocked ? 'Reveal previous hint first' : subtitle}
                  </span>
                </span>
                {!isRevealed && !isLocked && !isLoading && (
                  <svg className="h-4 w-4 mt-0.5 shrink-0 text-surface-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>

              {isRevealed && (
                <div className={`mt-2 rounded-lg border ${colors.calloutBg} px-3.5 py-3`}>
                  <div className="flex items-start gap-2">
                    <span className={`mt-0.5 shrink-0 ${colors.accent}`}>{icon}</span>
                    <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
                      {hints[level]}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
