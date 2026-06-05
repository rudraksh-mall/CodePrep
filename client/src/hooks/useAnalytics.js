import { useQuery } from '@tanstack/react-query';
import * as analyticsApi from '../api/analytics.api';

export function useSummary() {
  return useQuery({
    queryKey: ['analytics', 'summary'],
    queryFn: analyticsApi.getSummary,
    staleTime: 300000,
  });
}

export function useByTopic() {
  return useQuery({
    queryKey: ['analytics', 'by-topic'],
    queryFn: analyticsApi.getByTopic,
    staleTime: 300000,
  });
}

export function useByDifficulty() {
  return useQuery({
    queryKey: ['analytics', 'by-difficulty'],
    queryFn: analyticsApi.getByDifficulty,
    staleTime: 300000,
  });
}

export function useOverTime(days = 30) {
  return useQuery({
    queryKey: ['analytics', 'over-time', days],
    queryFn: () => analyticsApi.getOverTime(days),
    staleTime: 300000,
    refetchOnMount: true,
  });
}
