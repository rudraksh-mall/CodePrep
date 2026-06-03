import api from './axios';

export async function getNote(problemId) {
  const res = await api.get(`/notes/${problemId}`);
  return res.data.data;
}

export async function upsertNote(problemId, content) {
  const res = await api.put('/notes', { problemId, content });
  return res.data.data;
}
