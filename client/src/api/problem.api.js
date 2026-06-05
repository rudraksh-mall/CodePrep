import api from './axios';

export async function getProblems(params) {
  const res = await api.get('/problems', { params });
  return res.data.data;
}

export async function getTopics() {
  const res = await api.get('/problems/filters/topics');
  return res.data.data;
}

export async function getProblemBySlug(slug) {
  const res = await api.get(`/problems/${slug}`);
  return res.data.data;
}
