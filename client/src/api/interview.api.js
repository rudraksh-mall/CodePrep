import api from './axios';

export async function startInterview({ type, duration }) {
  const res = await api.post('/interview/start', { type, duration });
  return res.data.data;
}

export async function answerInterview({ sessionId, answer }) {
  const res = await api.post('/interview/answer', { sessionId, answer });
  return res.data.data;
}

export async function endInterview({ sessionId }) {
  const res = await api.post('/interview/end', { sessionId });
  return res.data.data;
}
