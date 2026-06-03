import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import useProblem from '../hooks/useProblem';
import DifficultyBadge from '../components/problems/DifficultyBadge';
import Button from '../components/ui/Button';
import { PageLoader } from '../components/ui/Loader';

function ExampleCard({ example, index }) {
  return (
    <div className="rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50 p-4 space-y-2">
      <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase">Example {index + 1}</p>
      <div>
        <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Input:</p>
        <pre className="rounded bg-surface-200 dark:bg-surface-700 px-3 py-2 text-sm font-mono text-surface-900 dark:text-surface-100 overflow-x-auto">{example.input}</pre>
      </div>
      <div>
        <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Output:</p>
        <pre className="rounded bg-surface-200 dark:bg-surface-700 px-3 py-2 text-sm font-mono text-surface-900 dark:text-surface-100 overflow-x-auto">{example.output}</pre>
      </div>
      {example.explanation && (
        <div>
          <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Explanation:</p>
          <p className="text-sm text-surface-700 dark:text-surface-300">{example.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default function ProblemDetailPage() {
  const { slug } = useParams();
  const { data: problem, isLoading } = useProblem(slug);
  const [progress, setProgress] = useState(null);

  if (isLoading) return <PageLoader />;
  if (!problem) return null;

  const examples = problem.examples || [];
  const constraints = problem.constraints || '';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <Link
        to="/problems"
        className="inline-flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 mb-4 transition"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
        Back to problems
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-3">{problem.title}</h1>
            <div className="flex flex-wrap items-center gap-3">
              <DifficultyBadge difficulty={problem.difficulty} />
              {problem.topics?.map((topic) => (
                <span key={topic} className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/40 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300">
                  {topic}
                </span>
              ))}
            </div>
            {problem.companies?.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Companies:</span>
                {problem.companies.map((c) => (
                  <span key={c} className="inline-flex items-center rounded-md bg-surface-100 dark:bg-surface-800 px-2 py-0.5 text-xs font-medium text-surface-600 dark:text-surface-400">
                    {c}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {problem.description}
            </ReactMarkdown>
          </div>

          {examples.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100">Examples</h2>
              {examples.map((ex, i) => (
                <ExampleCard key={i} example={ex} index={i} />
              ))}
            </div>
          )}

          {constraints && (
            <div>
              <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-2">Constraints</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {constraints}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 space-y-4">
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Progress</h3>
            <div className="flex gap-2">
              <Button
                variant={progress === 'solved' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setProgress(progress === 'solved' ? null : 'solved')}
              >
                Solved
              </Button>
              <Button
                variant={progress === 'attempted' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setProgress(progress === 'attempted' ? null : 'attempted')}
              >
                Attempted
              </Button>
            </div>
          </div>

          <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Hints</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400">Hints will be available here.</p>
          </div>

          <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-2">Notes</h3>
            <textarea
              rows={4}
              placeholder="Write your notes here..."
              className="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
