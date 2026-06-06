import { useState, useEffect } from 'react';
import * as aiApi from '../api/ai.api';
import ResumeUploader from '../components/ai/ResumeUploader';
import QuestionCard from '../components/ai/QuestionCard';
import RoleSelect from '../components/ai/RoleSelect';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const categories = ['all', 'technical', 'behavioral', 'system design'];

export default function ResumeAnalyzerPage() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [resumeId, setResumeId] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [resumeInfo, setResumeInfo] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [resumeKey, setResumeKey] = useState(0);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await aiApi.getLatestResumeAnalysis();
        if (data) {
          setResumeId(data.resumeId);
          setExtractedSkills(data.extractedSkills || []);
          setResumeInfo({
            fileName: data.fileName,
            createdAt: data.createdAt,
            targetRole: data.targetRole,
            questionCount: data.questions?.length || 0,
            skillCount: data.extractedSkills?.length || 0,
          });
          if (data.questions?.length > 0) {
            setQuestions(data.questions);
            setTargetRole(data.targetRole || '');
            setStep(2);
          } else {
            if (data.targetRole) setTargetRole(data.targetRole);
          }
        }
      } catch {
        /* no analysis found */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const uploaderInitialResult =
    resumeId && extractedSkills.length > 0
      ? { resumeId, extractedData: { extractedSkills } }
      : null;

  function handleUploadComplete(data) {
    setResumeId(data.resumeId);
    setExtractedSkills(data.extractedData?.extractedSkills || []);
    setQuestions([]);
    setResumeInfo({
      fileName: data.fileName || null,
      createdAt: null,
      targetRole: null,
      questionCount: 0,
      skillCount: data.extractedData?.extractedSkills?.length || 0,
    });
  }

  function handleBackToStep1() {
    setStep(1);
    setResumeId(null);
    setQuestions([]);
    setExtractedSkills([]);
    setCategoryFilter('all');
    setResumeInfo(null);
  }

  function handleStartNew() {
    setStep(1);
    setResumeId(null);
    setTargetRole('');
    setQuestions([]);
    setExtractedSkills([]);
    setResumeInfo(null);
    setCategoryFilter('all');
    setError('');
    setRoleError('');
    setResumeKey((k) => k + 1);
  }

  async function handleGenerate() {
    if (!targetRole.trim()) {
      setRoleError('Please select a target role');
      return;
    }
    setRoleError('');
    setGenerating(true);
    setError('');

    try {
      const data = await aiApi.generateQuestions(resumeId, {
        targetRole: targetRole.trim(),
        questionCount: 15,
      });
      setQuestions(data.questions || []);
      setResumeInfo((prev) =>
        prev
          ? { ...prev, targetRole: targetRole.trim(), questionCount: data.questions?.length || 0 }
          : prev,
      );
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  }

  const filtered =
    categoryFilter === 'all'
      ? questions
      : questions.filter((q) => q.category === categoryFilter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner fullPage={false} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
        Resume Analyzer
      </h1>

      {resumeInfo && (
        <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-5">
          <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
            Last Resume Analysis
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-surface-400 dark:text-surface-500">Resume</p>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                {resumeInfo.fileName || 'Uploaded resume'}
              </p>
            </div>
            <div>
              <p className="text-xs text-surface-400 dark:text-surface-500">Target Role</p>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                {resumeInfo.targetRole || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-xs text-surface-400 dark:text-surface-500">Questions</p>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                {resumeInfo.questionCount}
              </p>
            </div>
            <div>
              <p className="text-xs text-surface-400 dark:text-surface-500">Skills</p>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                {resumeInfo.skillCount}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              size="sm"
              variant="primary"
              onClick={() => setStep(2)}
            >
              Continue Previous Analysis
            </Button>
            <Button size="sm" variant="secondary" onClick={handleStartNew}>
              Start New Analysis
            </Button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4">
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step >= 1 ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'}`}
        >
          <span
            className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold border-2 ${
              step >= 1
                ? 'border-primary-600 dark:border-primary-400 bg-primary-600 dark:bg-primary-400 text-white'
                : 'border-surface-300 dark:border-surface-600'
            }`}
          >
            1
          </span>
          Upload Resume
        </div>
        <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
        <div
          className={`flex items-center gap-2 text-sm font-medium ${step >= 2 ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'}`}
        >
          <span
            className={`flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold border-2 ${
              step >= 2
                ? 'border-primary-600 dark:border-primary-400 bg-primary-600 dark:bg-primary-400 text-white'
                : 'border-surface-300 dark:border-surface-600'
            }`}
          >
            2
          </span>
          Generate Questions
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <ResumeUploader
            key={resumeKey}
            onUploadComplete={handleUploadComplete}
            initialResult={uploaderInitialResult}
          />
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
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Upload Different Resume
          </button>

          <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-5 space-y-4">
            <RoleSelect
              label="Target Role"
              value={targetRole}
              onChange={(val) => {
                setTargetRole(val);
                setRoleError('');
              }}
              error={roleError}
            />
            <Button onClick={handleGenerate} loading={generating} disabled={!targetRole.trim()}>
              Generate Questions
            </Button>
            {error && <p className="text-sm text-red-500">{error}</p>}
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
