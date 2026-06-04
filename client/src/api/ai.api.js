import api from './axios';

export async function getHint({ problemTitle, problemDescription, hintLevel }) {
  const res = await api.post('/ai/hint', { problemTitle, problemDescription, hintLevel });
  return res.data.data;
}
