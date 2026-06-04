import api from './axios';

export async function getHint({ problemTitle, problemDescription, hintLevel }) {
  const res = await api.post('/ai/hint', { problemTitle, problemDescription, hintLevel });
  return res.data.data;
}

export async function uploadResume(file, onProgress) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await api.post('/ai/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress(progressEvent) {
      if (onProgress && progressEvent.total) {
        const pct = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        onProgress(pct);
      }
    },
  });

  return res.data.data;
}

export async function sendChatMessage({ message, chatHistory }) {
  const res = await api.post('/ai/chat', { message, chatHistory });
  return res.data.data;
}

export async function generateRoadmap(data) {
  const res = await api.post('/ai/roadmap', data);
  return res.data.data;
}

export async function getRoadmap() {
  const res = await api.get('/ai/roadmap');
  return res.data.data;
}

export async function generateQuestions(resumeId, { targetRole, questionCount }) {
  const res = await api.post(`/ai/resume/${resumeId}/questions`, {
    targetRole,
    questionCount,
  });
  return res.data.data;
}
