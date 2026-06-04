import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as aiApi from '../api/ai.api';
import RoadmapCard from '../components/ai/RoadmapCard';
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

function loadCompletedWeeks(roadmapId, weeks) {
  const completed = {};
  if (!roadmapId || !weeks) return completed;
  weeks.forEach((w) => {
    const val = localStorage.getItem(`roadmap_${roadmapId}_week_${w.weekNumber}`);
    if (val === 'true') completed[w.weekNumber] = true;
  });
  return completed;
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
  const [targetRole, setTargetRole] = useState('');
  const [duration, setDuration] = useState(30);
  const [currentLevel, setCurrentLevel] = useState('intermediate');

  useEffect(() => {
    if (existingRoadmap) {
      setRoadmap(existingRoadmap);
      setCompletedWeeks(loadCompletedWeeks(existingRoadmap._id, existingRoadmap.weeks));
    }
  }, [existingRoadmap]);

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

  async function handleGenerate() {
    if (!targetRole.trim()) return;

    setGenerating(true);
    setError('');

    try {
      const data = await aiApi.generateRoadmap({
        weakTopics,
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
    setTargetRole('');
    setDuration(30);
    setCurrentLevel('intermediate');
  }

  if (loadingRoadmap) return <PageLoader />;

  if (!roadmap) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 space-y-8">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Learning Roadmap
        </h1>

        <div className="rounded-xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-6 space-y-5">
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Generate a personalized weekly study plan based on your goals and weak areas.
          </p>

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Target Role
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Software Engineer at FAANG"
              className="block w-full rounded-lg border border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 px-3 py-2 text-sm text-surface-900 dark:text-surface-100 placeholder-surface-400 dark:placeholder-surface-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

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

          <div>
            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
              Weak Topics <span className="text-xs text-surface-400 font-normal">(select all that apply)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPIC_OPTIONS.map((topic) => {
                const active = weakTopics.includes(topic);
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
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Learning Roadmap
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            {roadmap.targetRole} &middot; {roadmap.duration} days &middot; {roadmap.currentLevel}
          </p>
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
