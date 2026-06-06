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
    staleTime: 0,
  });
}

export function useConsistency() {
  return useQuery({
    queryKey: ['analytics', 'consistency'],
    queryFn: analyticsApi.getConsistency,
    staleTime: 300000,
  });
}

export function useMonthlyTrends() {
  return useQuery({
    queryKey: ['analytics', 'monthly-trends'],
    queryFn: analyticsApi.getMonthlyTrends,
    staleTime: 300000,
  });
}

export function useTopicGrowth(days = 30) {
  return useQuery({
    queryKey: ['analytics', 'topic-growth', days],
    queryFn: () => analyticsApi.getTopicGrowth(days),
    staleTime: 300000,
  });
}

export function useTimeInvestment() {
  return useQuery({
    queryKey: ['analytics', 'time-investment'],
    queryFn: analyticsApi.getTimeInvestment,
    staleTime: 300000,
  });
}

export function useReadinessBreakdown() {
  return useQuery({
    queryKey: ['analytics', 'readiness-breakdown'],
    queryFn: analyticsApi.getReadinessBreakdown,
    staleTime: 300000,
  });
}

export function useTopicMastery() {
  return useQuery({
    queryKey: ['analytics', 'topic-mastery'],
    queryFn: analyticsApi.getTopicMastery,
    staleTime: 300000,
  });
}
