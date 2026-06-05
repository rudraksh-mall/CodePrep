import { useQuery } from '@tanstack/react-query';
import * as problemApi from '../api/problem.api';

export default function useProblem(slug) {
  return useQuery({
    queryKey: ['problem', slug],
    queryFn: () => problemApi.getProblemBySlug(slug),
    staleTime: 300000,
    enabled: Boolean(slug),
  });
}
