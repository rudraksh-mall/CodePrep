import api from './axios';

export async function getSummary() {
  const res = await api.get('/analytics/summary');
  return res.data.data;
}

export async function getByTopic() {
  const res = await api.get('/analytics/by-topic');
  return res.data.data;
}

export async function getByDifficulty() {
  const res = await api.get('/analytics/by-difficulty');
  return res.data.data;
}

export async function getOverTime(days = 30) {
  const res = await api.get('/analytics/over-time', { params: { days } });
  return res.data.data;
}

export async function getConsistency() {
  const res = await api.get('/analytics/consistency');
  return res.data.data;
}

export async function getMonthlyTrends() {
  const res = await api.get('/analytics/monthly-trends');
  return res.data.data;
}

export async function getTopicGrowth(days = 30) {
  const res = await api.get('/analytics/topic-growth', { params: { days } });
  return res.data.data;
}

export async function getTimeInvestment() {
  const res = await api.get('/analytics/time-investment');
  return res.data.data;
}

export async function getReadinessBreakdown() {
  const res = await api.get('/analytics/readiness-breakdown');
  return res.data.data;
}

export async function getTopicMastery() {
  const res = await api.get('/analytics/topic-mastery');
  return res.data.data;
}

export async function getWeakTopics() {
  const res = await api.get('/analytics/weak-topics');
  return res.data.data;
}
