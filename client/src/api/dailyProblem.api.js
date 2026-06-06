import api from './axios';

export async function getDailyProblem() {
  const res = await api.get('/daily-problem');
  return res.data.data;
}

export async function refreshDailyProblem() {
  const res = await api.post('/daily-problem/refresh');
  return res.data.data;
}
