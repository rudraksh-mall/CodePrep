import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as problemApi from '../../api/problem.api';

export default function ProblemFilters({ filters, onFilterChange }) {
  const [search, setSearch] = useState(filters.search || '');

  const { data: topics = [] } = useQuery({
    queryKey: ['topics'],
    queryFn: problemApi.getTopics,
    staleTime: 300000,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange((prev) => ({ ...prev, search, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, onFilterChange]);

  function handleDifficultyChange(e) {
    onFilterChange((prev) => ({ ...prev, difficulty: e.target.value, page: 1 }));
  }

  function handleTopicToggle(topic) {
    onFilterChange((prev) => {
      const current = prev.topics || [];
      const next = current.includes(topic)
        ? current.filter((t) => t !== topic)
        : [...current, topic];
      return { ...prev, topics: next, page: 1 };
    });
  }

  function handleClear() {
    setSearch('');
    onFilterChange({ search: '', difficulty: '', topics: [], page: 1 });
  }

  const hasFilters = filters.search || filters.difficulty || (filters.topics && filters.topics.length > 0);

  return (
    <div className="space-y-4 rounded-xl border bg-white dark:bg-surface-900 p-4 shadow-sm">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Search</label>
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>

        <div className="w-40">
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Difficulty</label>
          <select
            value={filters.difficulty || ''}
            onChange={handleDifficultyChange}
            className="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        {hasFilters && (
          <div className="flex items-end">
            <button
              onClick={handleClear}
              className="rounded-lg border border-surface-300 dark:border-surface-600 px-3 py-2 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {topics.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Topics</label>
          <div className="flex flex-wrap gap-2">
            {topics.map((topic) => {
              const active = filters.topics?.includes(topic);
              return (
                <button
                  key={topic}
                  onClick={() => handleTopicToggle(topic)}
                  className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                    active
                      ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700'
                      : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700'
                  }`}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
