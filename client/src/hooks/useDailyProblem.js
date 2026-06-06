import { useQuery } from '@tanstack/react-query';
import { getDailyProblem } from '../api/ai.api';

const now = new Date();
const midnight = new Date(now);
midnight.setHours(24, 0, 0, 0);
const msUntilMidnight = midnight - now;

export const useDailyProblem = () => useQuery({
  queryKey: ['daily-problem'],
  queryFn: getDailyProblem,
  staleTime: 60 * 60 * 1000,
  retry: 1,
  refetchInterval: msUntilMidnight,
  refetchIntervalInBackground: false,
});
