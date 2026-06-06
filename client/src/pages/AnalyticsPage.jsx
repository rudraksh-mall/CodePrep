import { PageLoader } from '../components/ui/Loader';
import Card from '../components/ui/Card';
import DifficultyPieChart from '../components/analytics/DifficultyPieChart';
import SolvedOverTimeChart from '../components/analytics/SolvedOverTimeChart';
import TopicMasteryChart from '../components/analytics/TopicMasteryChart';
import ConsistencyMetrics from '../components/analytics/ConsistencyMetrics';
import MonthlyTrendsChart from '../components/analytics/MonthlyTrendsChart';
import TopicGrowthChart from '../components/analytics/TopicGrowthChart';
import TimeInvestmentCard from '../components/analytics/TimeInvestmentCard';
import ReadinessBreakdownChart from '../components/analytics/ReadinessBreakdownChart';
import {
  useByDifficulty,
  useOverTime,
  useConsistency,
  useMonthlyTrends,
  useTopicGrowth,
  useTimeInvestment,
  useReadinessBreakdown,
  useTopicMastery,
  useWeakTopics,
} from '../hooks/useAnalytics';

export default function AnalyticsPage() {
  const { data: difficultyData = [], isLoading: diffLoading } = useByDifficulty();
  const { data: overTimeData = [] } = useOverTime(365);
  const { data: consistency, isLoading: consLoading } = useConsistency();
  const { data: monthlyTrends = [] } = useMonthlyTrends();
  const { data: topicGrowth = [] } = useTopicGrowth(30);
  const { data: timeInvestment } = useTimeInvestment();
  const { data: readinessBreakdown = [] } = useReadinessBreakdown();
  const { data: topicMastery = [] } = useTopicMastery();
  const { data: weakTopics = [] } = useWeakTopics();

  if (diffLoading || consLoading) return <PageLoader />;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100">Analytics</h1>

      {/* Consistency Metrics */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Consistency
        </h2>
        <ConsistencyMetrics data={consistency} />
      </Card>

      {/* Solved by Difficulty + Monthly Trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Solved by Difficulty
          </h2>
          <DifficultyPieChart data={difficultyData} />
        </Card>
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Monthly Solving Trends
          </h2>
          <MonthlyTrendsChart data={monthlyTrends} />
        </Card>
      </div>

      {/* Solved Over Time - Cumulative */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Solved Over Time
        </h2>
        <SolvedOverTimeChart data={overTimeData} />
      </Card>

      {/* Topic Mastery + Topic Growth */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Topic Mastery
          </h2>
          <TopicMasteryChart data={topicMastery} />
        </Card>
        <Card className="p-6">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Topic Growth (Last 30 Days)
          </h2>
          <TopicGrowthChart data={topicGrowth} />
        </Card>
      </div>

      {/* Time Investment */}
      <TimeInvestmentCard data={timeInvestment} />

      {/* Interview Readiness - Category Breakdown */}
      <ReadinessBreakdownChart data={readinessBreakdown} />

      {/* Weak Topics */}
      <Card className="p-6">
        <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-4">
          Weak Topics
        </h2>
        {weakTopics.length === 0 ? (
          <p className="text-sm text-surface-500 dark:text-surface-400 text-center py-6">
            No weak topics identified yet. Start solving problems to see analysis.
          </p>
        ) : (
          <div className="space-y-3">
            {weakTopics.filter((t) => t.weaknessPct > 0).slice(0, 10).map((t) => (
              <div key={t.topic}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-surface-900 dark:text-surface-100">{t.topic}</span>
                  <span className="text-xs text-surface-500 dark:text-surface-400">
                    {t.solved}/{t.attempted} solved
                  </span>
                </div>
                <div className="h-2 rounded-full bg-surface-200 dark:bg-surface-700 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      t.weaknessPct >= 70 ? 'bg-red-500' : t.weaknessPct >= 40 ? 'bg-amber-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${t.weaknessPct}%` }}
                  />
                </div>
                <p className="text-2xs text-surface-400 dark:text-surface-500 mt-0.5">
                  {t.weaknessPct}% weak
                </p>
              </div>
            ))}
            {weakTopics.filter((t) => t.weaknessPct > 0).length === 0 && (
              <p className="text-sm text-green-600 dark:text-green-400 text-center py-2">
                No weak spots — you've solved every attempted topic!
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
