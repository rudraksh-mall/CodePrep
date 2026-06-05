import { useQuery } from '@tanstack/react-query';
import * as problemApi from '../api/problem.api';

export default function useProblems(filters) {
  const params = { page: filters.page || 1, limit: 10 };

  if (filters.search) params.search = filters.search;
  if (filters.difficulty) params.difficulty = filters.difficulty;
  if (filters.topics && filters.topics.length > 0) params.topics = filters.topics.join(',');

  return useQuery({
    queryKey: ['problems', params],
    queryFn: () => problemApi.getProblems(params),
    staleTime: 300000,
    placeholderData: (prev) => prev,
  });
}
