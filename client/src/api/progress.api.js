import api from './axios';

export async function upsertProgress(problemId, status, { timeSpentMinutes, hintsUsed, attempts } = {}) {
  const res = await api.put('/progress', { problemId, status, timeSpentMinutes, hintsUsed, attempts });
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
