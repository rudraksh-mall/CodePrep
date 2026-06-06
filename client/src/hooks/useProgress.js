import { useQuery } from '@tanstack/react-query';
import { getUserProgress } from '../api/progress.api';

export const useProgress = () => useQuery({
  queryKey: ['progress'],
  queryFn: getUserProgress,
  staleTime: 300000,
});
