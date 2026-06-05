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
