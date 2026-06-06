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
    </div>
  );
}
