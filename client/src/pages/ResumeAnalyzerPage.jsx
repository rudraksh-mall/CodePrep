import { useState } from 'react';
import * as aiApi from '../api/ai.api';
import ResumeUploader from '../components/ai/ResumeUploader';
import QuestionCard from '../components/ai/QuestionCard';
import Button from '../components/ui/Button';

const categories = ['all', 'technical', 'behavioral', 'system design'];

export default function ResumeAnalyzerPage() {
  const [step, setStep] = useState(1);
  const [resumeId, setResumeId] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  function handleUploadComplete(data) {
    setResumeId(data.resumeId);
  }

  function handleBackToStep1() {
    setStep(1);
    setResumeId(null);
    setQuestions([]);
    setCategoryFilter('all');
  }

  async function handleGenerate() {
    if (!targetRole.trim()) return;

    setGenerating(true);
    setError('');

    try {
      const data = await aiApi.generateQuestions(resumeId, {
        targetRole: targetRole.trim(),
        questionCount: 15,
      });
      setQuestions(data.questions || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  }

  const filtered = categoryFilter === 'all'
    ? questions
    : questions.filter((q) => q.category === categoryFilter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-8">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
        Resume Analyzer
      </h1>

      <div className="flex items-center gap-4">
        <div className={`flex items-center gap-2 text-sm font-medium ${step >= 1 ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'}`}>
          <span className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold border-2 ${
            step >= 1 ? 'border-primary-600 dark:border-primary-400 bg-primary-600 dark:bg-primary-400 text-white' : 'border-surface-300 dark:border-surface-600'
          }`}>1</span>
          Upload Resume
        </div>
        <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
        <div className={`flex items-center gap-2 text-sm font-medium ${step >= 2 ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'}`}>
          <span className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold border-2 ${
            step >= 2 ? 'border-primary-600 dark:border-primary-400 bg-primary-600 dark:bg-primary-400 text-white' : 'border-surface-300 dark:border-surface-600'
          }`}>2</span>
          Generate Questions
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <ResumeUploader onUploadComplete={handleUploadComplete} />
          {resumeId && (
            <div className="flex justify-center">
              <Button onClick={() => setStep(2)} size="lg">
                Continue → Generate Interview Questions
              </Button>
            </div>
          )}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <button
            onClick={handleBackToStep1}
            className="inline-flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 transition"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
            Upload Different Resume
          </button>

          <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-5">
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Target Role
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="block flex-1 rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button onClick={handleGenerate} loading={generating} disabled={!targetRole.trim()}>
                Generate Questions
              </Button>
            </div>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          </div>

          {questions.length > 0 && (
            <>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
                      categoryFilter === cat
                        ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700'
                        : 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((q, i) => (
                  <QuestionCard
                    key={i}
                    question={q.question}
                    category={q.category}
                    difficulty={q.difficulty}
                    skill={q.skill}
                    guidance={q.guidance}
                  />
                ))}
              </div>

              {filtered.length === 0 && (
                <p className="text-sm text-surface-500 dark:text-surface-400 text-center py-8">
                  No questions match the selected category.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
