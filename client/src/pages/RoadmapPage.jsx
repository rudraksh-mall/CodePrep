import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as aiApi from '../api/ai.api';
import { getAnalyticsSummary } from '../api/progress.api';
import RoadmapCard from '../components/ai/RoadmapCard';
import RoleSelect from '../components/ai/RoleSelect';
import Button from '../components/ui/Button';
import { PageLoader } from '../components/ui/Loader';

const TOPIC_OPTIONS = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs',
  'Dynamic Programming', 'Sorting', 'Binary Search', 'Heaps',
  'Hash Tables', 'Recursion', 'Greedy', 'Sliding Window',
  'Two Pointers', 'Stack', 'Queue', 'Math', 'Backtracking',
];

const DURATIONS = [
  { value: 30, label: '30 days (4 weeks)' },
  { value: 60, label: '60 days (8 weeks)' },
  { value: 90, label: '90 days (12 weeks)' },
];

const LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

const MODES = [
  { value: 'manual', label: 'Manual', desc: 'You select weak areas' },
  { value: 'analytics', label: 'Analytics-Based', desc: 'Detected from your solved problems' },
  { value: 'hybrid', label: 'Hybrid', desc: 'Analytics + your input' },
];

function loadCompletedWeeks(roadmapId, weeks) {
  const completed = {};
  if (!roadmapId || !weeks) return completed;
  weeks.forEach((w) => {
    const val = localStorage.getItem(`roadmap_${roadmapId}_week_${w.weekNumber}`);
    if (val === 'true') completed[w.weekNumber] = true;
  });
  return completed;
}

function TopicChip({ topic, active, onClick, tone = 'primary' }) {
  const activeStyles = tone === 'primary'
    ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 border-primary-300 dark:border-primary-700'
    : 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700';

  const inactiveStyles = 'bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border-surface-300 dark:border-surface-600 hover:bg-surface-50 dark:hover:bg-surface-700';

  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium border transition ${
        active ? activeStyles : inactiveStyles
      }`}
    >
      {topic}
    </button>
  );
}

export default function RoadmapPage() {
  const { data: existingRoadmap, isLoading: loadingRoadmap } = useQuery({
    queryKey: ['roadmap'],
    queryFn: aiApi.getRoadmap,
    staleTime: 300000,
  });

  const [roadmap, setRoadmap] = useState(null);
  const [completedWeeks, setCompletedWeeks] = useState({});
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const [weakTopics, setWeakTopics] = useState([]);
  const [strongTopics, setStrongTopics] = useState([]);
  const [targetRole, setTargetRole] = useState('');
  const [duration, setDuration] = useState(30);
  const [currentLevel, setCurrentLevel] = useState('intermediate');
  const [mode, setMode] = useState('manual');

  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (existingRoadmap) {
      setRoadmap(existingRoadmap);
      setCompletedWeeks(loadCompletedWeeks(existingRoadmap._id, existingRoadmap.weeks));
    }
  }, [existingRoadmap]);

  useEffect(() => {
    if (mode === 'manual') {
      setAnalyticsData(null);
      return;
    }

    let cancelled = false;
    setAnalyticsLoading(true);

    getAnalyticsSummary()
      .then((data) => {
        if (!cancelled) {
          setAnalyticsData(data);
          setAnalyticsLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAnalyticsData(null);
          setAnalyticsLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [mode]);

  const handleWeekToggle = useCallback((weekNumber) => {
    setCompletedWeeks((prev) => {
      const next = { ...prev, [weekNumber]: !prev[weekNumber] };
      const key = `roadmap_${roadmap._id}_week_${weekNumber}`;
      localStorage.setItem(key, next[weekNumber]);
      return next;
    });
  }, [roadmap]);

  const handleTopicToggle = useCallback((topic) => {
    setWeakTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  }, []);

  const handleStrongTopicToggle = useCallback((topic) => {
    setStrongTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  }, []);

  const analyticsUsable = analyticsData && analyticsData.totalSolved >= 20;
  const effectiveMode = (mode === 'analytics' || mode === 'hybrid') && !analyticsUsable ? 'manual' : mode;

  async function handleGenerate() {
    if (!targetRole.trim()) return;

    setGenerating(true);
    setError('');

    try {
      const data = await aiApi.generateRoadmap({
        weakTopics,
        strongTopics,
        mode: effectiveMode,
        targetRole: targetRole.trim(),
        duration,
        currentLevel,
      });
      setRoadmap(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to generate roadmap');
    } finally {
      setGenerating(false);
    }
  }

  function handleReset() {
    setRoadmap(null);
    setWeakTopics([]);
    setStrongTopics([]);
    setTargetRole('');
    setDuration(30);
    setCurrentLevel('intermediate');
    setMode('manual');
    setAnalyticsData(null);
  }

  if (loadingRoadmap) return <PageLoader />;

  if (!roadmap) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Learning Roadmap
        </h1>

        <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-6 space-y-5">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Generate a personalized weekly study plan based on your goals and weak areas.
          </p>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Mode
            </label>
            <div className="grid gap-2 sm:grid-cols-3">
              {MODES.map((m) => {
                const analyticsDisabled = (m.value === 'analytics' || m.value === 'hybrid') && analyticsData !== null && !analyticsUsable && !analyticsLoading;
                return (
                  <button
                    key={m.value}
                    onClick={() => {
                      if (analyticsDisabled && !analyticsLoading) return;
                      setMode(m.value);
                    }}
                    disabled={analyticsDisabled && !analyticsLoading}
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition ${
                      mode === m.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                        : 'border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700'
                    } ${analyticsDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span className="font-medium block">{m.label}</span>
                    <span className="text-xs text-surface-400 dark:text-surface-500">{m.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {mode !== 'manual' && analyticsLoading && (
            <p className="text-xs text-surface-400">Loading analytics...</p>
          )}

          {mode !== 'manual' && !analyticsLoading && analyticsData && !analyticsUsable && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              Solve at least 20 problems to unlock analytics-based insights. Falling back to manual mode.
            </p>
          )}

          <RoleSelect
            label="Target Role"
            value={targetRole}
            onChange={(val) => setTargetRole(val)}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Duration
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {DURATIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Current Level
              </label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                className="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {LEVELS.map((l) => (
                  <option key={l.value} value={l.value}>{l.label}</option>
                ))}
              </select>
            </div>
          </div>

          {(effectiveMode === 'hybrid' || effectiveMode === 'analytics') && analyticsUsable && (
            <div>
              <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
                Strong Topics <span className="text-xs text-surface-400 font-normal">(topics to de-emphasize)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {TOPIC_OPTIONS.map((topic) => (
                  <TopicChip
                    key={topic}
                    topic={topic}
                    active={strongTopics.includes(topic)}
                    onClick={() => handleStrongTopicToggle(topic)}
                    tone="green"
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Weak Topics <span className="text-xs text-surface-400 font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPIC_OPTIONS.map((topic) => {
                const active = weakTopics.includes(topic);
                return (
                  <TopicChip
                    key={topic}
                    topic={topic}
                    active={active}
                    onClick={() => handleTopicToggle(topic)}
                  />
                );
              })}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button onClick={handleGenerate} loading={generating} disabled={!targetRole.trim()}>
            Generate Roadmap
          </Button>
        </div>
      </div>
    );
  }

  const totalWeeks = roadmap.weeks?.length || 0;
  const doneCount = roadmap.weeks?.filter((w) => completedWeeks[w.weekNumber]).length || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Learning Roadmap
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            {roadmap.targetRole} &middot; {roadmap.duration} days &middot; {roadmap.currentLevel}
            {roadmap.mode && (
              <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-primary-100 dark:bg-primary-900/40 px-2 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300">
                {MODES.find((m) => m.value === roadmap.mode)?.label || roadmap.mode}
              </span>
            )}
          </p>
          {roadmap.strongTopics?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-xs text-surface-400 font-medium mr-1 self-center">Strong:</span>
              {roadmap.strongTopics.map((t) => (
                <span key={t} className="rounded-full bg-green-100 dark:bg-green-900/40 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-300">
                  {t}
                </span>
              ))}
            </div>
          )}
          {roadmap.weakTopics?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              <span className="text-xs text-surface-400 font-medium mr-1 self-center">Focus:</span>
              {roadmap.weakTopics.map((t) => (
                <span key={t} className="rounded-full bg-amber-100 dark:bg-amber-900/40 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-300">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <Button variant="secondary" onClick={handleReset}>
          Generate New Roadmap
        </Button>
      </div>

      {totalWeeks > 0 && (
        <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-surface-600 dark:text-surface-400 font-medium">Progress</span>
            <span className="text-surface-500 dark:text-surface-400">{doneCount} / {totalWeeks} weeks</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-500 transition-all duration-500"
              style={{ width: `${totalWeeks > 0 ? (doneCount / totalWeeks) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {roadmap.weeks?.map((week) => (
          <RoadmapCard
            key={week.weekNumber}
            roadmapId={roadmap._id}
            week={week}
            defaultExpanded={week.weekNumber === 1}
            checked={!!completedWeeks[week.weekNumber]}
            onToggle={handleWeekToggle}
          />
        ))}
      </div>
    </div>
  );
}