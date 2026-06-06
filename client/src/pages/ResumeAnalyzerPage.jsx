import { useState, useEffect } from 'react';
import * as aiApi from '../api/ai.api';
import ResumeUploader from '../components/ai/ResumeUploader';
import QuestionCard from '../components/ai/QuestionCard';
import RoleSelect from '../components/ai/RoleSelect';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const categories = ['all', 'technical', 'behavioral', 'system design'];

export default function ResumeAnalyzerPage() {
  const [phase, setPhase] = useState('loading');
  const [resumeId, setResumeId] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [questions, setQuestions] = useState([]);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [resumeFileName, setResumeFileName] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [resumeKey, setResumeKey] = useState(0);
  const [roleError, setRoleError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await aiApi.getLatestResumeAnalysis();
        if (data?.questions?.length > 0) {
          setResumeId(data.resumeId);
          setExtractedSkills(data.extractedSkills || []);
          setTargetRole(data.targetRole || '');
          setQuestions(data.questions);
          setResumeFileName(data.fileName);
          setPhase('previous');
          return;
        }
        if (data) {
          setResumeId(data.resumeId);
          setExtractedSkills(data.extractedSkills || []);
          setTargetRole(data.targetRole || '');
          setResumeFileName(data.fileName);
        }
      } catch {
        /* no analysis found */
      }
      setPhase('upload');
    }
    load();
  }, []);

  function startNewAnalysis() {
    setPhase('upload');
    setResumeId(null);
    setTargetRole('');
    setQuestions([]);
    setExtractedSkills([]);
    setResumeFileName(null);
    setCategoryFilter('all');
    setError('');
    setRoleError('');
    setResumeKey((k) => k + 1);
  }

  function continuePreviousAnalysis() {
    setPhase('workspace');
  }

  function handleUploadComplete(data) {
    setResumeId(data.resumeId);
    setExtractedSkills(data.extractedData?.extractedSkills || []);
    setResumeFileName(data.fileName || null);
    setQuestions([]);
    setPhase('analyze');
  }

  function handleBackToUpload() {
    setPhase('upload');
    setResumeId(null);
    setQuestions([]);
    setExtractedSkills([]);
    setResumeFileName(null);
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
      setPhase('workspace');
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate questions');
    } finally {
      setGenerating(false);
    }
  }

  function handleGenerateNew() {
    setQuestions([]);
    setCategoryFilter('all');
    setPhase('analyze');
  }

  const filtered =
    categoryFilter === 'all'
      ? questions
      : questions.filter((q) => q.category === categoryFilter);

  if (phase === 'loading') {
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

      {phase === 'previous' && (
        <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-6">
          <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
            Resume Analysis Summary
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div>
              <p className="text-xs text-surface-400 dark:text-surface-500">Resume</p>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                {resumeFileName || 'Uploaded resume'}
              </p>
            </div>
            <div>
              <p className="text-xs text-surface-400 dark:text-surface-500">Target Role</p>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                {targetRole || 'Not set'}
              </p>
            </div>
            <div>
              <p className="text-xs text-surface-400 dark:text-surface-500">Questions</p>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                {questions.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-surface-400 dark:text-surface-500">Skills</p>
              <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                {extractedSkills.length}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button size="sm" variant="primary" onClick={continuePreviousAnalysis}>
              Continue Previous Analysis
            </Button>
            <Button size="sm" variant="secondary" onClick={startNewAnalysis}>
              Start New Analysis
            </Button>
          </div>
        </div>
      )}

      {phase === 'upload' && (
        <div className="space-y-6">
          <ResumeUploader
            key={resumeKey}
            onUploadComplete={handleUploadComplete}
          />
        </div>
      )}

      {phase === 'analyze' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                Resume Analysis
              </h3>
              <button
                onClick={handleBackToUpload}
                className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-500"
              >
                Upload different resume
              </button>
            </div>

            {extractedSkills.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider">
                  Extracted Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {extractedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center rounded-full bg-primary-100 dark:bg-primary-900/40 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
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
          </div>
        </div>
      )}

      {phase === 'workspace' && (
        <div className="space-y-6">
          <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-5">
            <p className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
              Resume Analysis Summary
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-surface-400 dark:text-surface-500">Resume</p>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100 truncate">
                  {resumeFileName || 'Uploaded resume'}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-400 dark:text-surface-500">Target Role</p>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                  {targetRole}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-400 dark:text-surface-500">Questions</p>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                  {questions.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-surface-400 dark:text-surface-500">Skills</p>
                <p className="text-sm font-medium text-surface-900 dark:text-surface-100">
                  {extractedSkills.length}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button size="sm" variant="secondary" onClick={handleGenerateNew}>
                Generate New Question Set
              </Button>
              <Button size="sm" variant="ghost" onClick={startNewAnalysis}>
                Upload New Resume
              </Button>
            </div>
          </div>

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
        </div>
      )}
    </div>
  );
}
