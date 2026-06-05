import Card from "../components/ui/Card";
import { PageLoader } from "../components/ui/Loader";
import StreakCard from "../components/progress/StreakCard";
import TopicProgressBar from "../components/progress/TopicProgressBar";
import HeatmapCalendar from "../components/progress/HeatmapCalendar";
import { useSummary, useByTopic, useOverTime } from "../hooks/useAnalytics";

function StatCard({ label, value, icon }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {label}
          </p>
          <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            {value}
          </p>
        </div>
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useSummary();
  const { data: topics = [], isLoading: topicsLoading } = useByTopic();
  const { data: heatmapData = [] } = useOverTime(365);

  if (summaryLoading) return <PageLoader />;
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">
        Dashboard
      </h1>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Activity
        </h2>
        <HeatmapCalendar data={heatmapData} days={365} />
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Solved" value={summary?.totalSolved ?? 0} icon="✅" />
        <StatCard
          label="Attempted"
          value={summary?.totalAttempted ?? 0}
          icon="🔄"
        />
        <StreakCard
          current={summary?.currentStreak ?? 0}
          longest={summary?.longestStreak ?? 0}
        />
      </div>

      <Card className="p-6">
        <h2 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Progress by Topic
        </h2>
        {topicsLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-20 mb-2" />
                <div className="h-2 bg-surface-200 dark:bg-surface-700 rounded-full" />
              </div>
            ))}
          </div>
        ) : topics.length === 0 ? (
          <p className="text-sm text-surface-500 dark:text-surface-400">
            No progress yet. Start solving problems!
          </p>
        ) : (
          <div className="space-y-4">
            {topics.map((t) => (
              <TopicProgressBar
                key={t.topic}
                topic={t.topic}
                solved={t.solved}
                total={t.total}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
