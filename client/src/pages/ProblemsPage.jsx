import { useState } from 'react';
import { Link } from 'react-router-dom';
import useProblems from '../hooks/useProblems';
import ProblemFilters from '../components/problems/ProblemFilters';
import DifficultyBadge from '../components/problems/DifficultyBadge';

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4"><div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-48" /></td>
      <td className="px-6 py-4"><div className="h-5 bg-surface-200 dark:bg-surface-700 rounded w-16" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-32" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-24" /></td>
    </tr>
  );
}

export default function ProblemsPage() {
  const [filters, setFilters] = useState({ search: '', difficulty: '', topics: [], page: 1 });
  const { data, isLoading, isFetching } = useProblems(filters);

  const problems = data?.problems || [];
  const totalPages = data?.pages || 1;
  const currentPage = data?.currentPage || 1;

  function handlePageChange(page) {
    setFilters((prev) => ({ ...prev, page }));
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6">Problems</h1>

      <ProblemFilters filters={filters} onFilterChange={setFilters} />

      <div className={`mt-6 overflow-x-auto rounded-xl border shadow-sm ${isFetching && !isLoading ? 'opacity-60 transition-opacity' : ''}`}>
        <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
          <thead className="bg-surface-50 dark:bg-surface-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Difficulty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Topics</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">Companies</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-surface-900 divide-y divide-surface-200 dark:divide-surface-700">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : problems.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-sm text-surface-500 dark:text-surface-400">
                  No problems found matching your filters.
                </td>
              </tr>
            ) : (
              problems.map((problem) => (
                <tr key={problem._id} className="hover:bg-surface-50 dark:hover:bg-surface-800/50 transition">
                  <td className="px-6 py-4">
                    <Link
                      to={`/problems/${problem.slug}`}
                      className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500"
                    >
                      {problem.title}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {problem.topics?.slice(0, 3).map((topic) => (
                        <span key={topic} className="inline-flex items-center rounded-full bg-surface-100 dark:bg-surface-800 px-2 py-0.5 text-xs font-medium text-surface-600 dark:text-surface-400">
                          {topic}
                        </span>
                      ))}
                      {problem.topics?.length > 3 && (
                        <span className="text-xs text-surface-400">+{problem.topics.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-surface-500 dark:text-surface-400">
                    {problem.companies?.slice(0, 2).join(', ')}
                    {problem.companies?.length > 2 && (
                      <span className="text-xs text-surface-400"> +{problem.companies.length - 2}</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="rounded-lg border border-surface-300 dark:border-surface-600 px-3 py-2 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`rounded-lg px-3 py-2 text-sm font-medium border transition ${
                page === currentPage
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'text-surface-600 dark:text-surface-400 border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-800'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="rounded-lg border border-surface-300 dark:border-surface-600 px-3 py-2 text-sm text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
