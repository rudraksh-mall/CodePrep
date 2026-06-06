import api from './axios';

export async function upsertProgress(problemId, status, timeSpentMinutes) {
  const res = await api.put('/progress', { problemId, status, timeSpentMinutes });
  return res.data.data;
}

export async function getProgressForProblem(problemId) {
  const res = await api.get(`/progress/${problemId}`);
  return res.data.data;
}

export async function getUserProgress() {
  const res = await api.get('/progress');
  return res.data.data;
}

export async function getAnalyticsSummary() {
  const res = await api.get('/progress/analytics-summary');
  return res.data.data;
}
