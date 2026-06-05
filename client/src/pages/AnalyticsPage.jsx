import { PageLoader } from '../components/ui/Loader';
import Card from '../components/ui/Card';
import DifficultyPieChart from '../components/analytics/DifficultyPieChart';
import TopicBarChart from '../components/analytics/TopicBarChart';
import SolvedOverTimeChart from '../components/analytics/SolvedOverTimeChart';
import { useSummary, useByDifficulty, useByTopic, useOverTime } from '../hooks/useAnalytics';

function StatCard({ label, value, icon }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-sm text-surface-500 dark:text-surface-400">{label}</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{value}</p>
        </div>
      </div>
    </Card>
  );
}

export default function AnalyticsPage() {
  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: difficultyData = [] } = useByDifficulty();
  const { data: topicData = [] } = useByTopic();
  const { data: overTimeData = [] } = useOverTime(30);

  if (summaryLoading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Analytics</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Solved" value={summary?.totalSolved ?? 0} icon="✅" />
        <StatCard label="Total Attempted" value={summary?.totalAttempted ?? 0} icon="🔄" />
        <StatCard label="Current Streak" value={`${summary?.currentStreak ?? 0}d`} icon="🔥" />
        <StatCard label="Longest Streak" value={`${summary?.longestStreak ?? 0}d`} icon="🏆" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
            Solved by Difficulty
          </h2>
          <DifficultyPieChart data={difficultyData} />
        </Card>
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
            Solved Over Time
          </h2>
          <SolvedOverTimeChart data={overTimeData} />
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-surface-900 dark:text-surface-100">
          Top Topics
        </h2>
        <TopicBarChart data={topicData} />
      </Card>
    </div>
  );
}
