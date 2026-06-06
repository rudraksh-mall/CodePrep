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

export async function sendChatMessageStream({ message, chatHistory }) {
  const token = localStorage.getItem('token');

  const response = await fetch(`${import.meta.env.VITE_API_URL}/ai/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, chatHistory }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    let errorMessage;
    try {
      errorMessage = JSON.parse(errorBody).message;
    } catch {
      errorMessage = `Request failed with status ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  return { reader, decoder };
}

export async function generateRoadmap(data) {
  const res = await api.post('/ai/roadmap', data);
  return res.data.data;
}

export async function getRoadmap() {
  const res = await api.get('/ai/roadmap');
  return res.data.data;
}

export async function getLatestResumeAnalysis() {
  const res = await api.get('/ai/resume/latest');
  return res.data.data;
}

export async function generateQuestions(resumeId, { targetRole, questionCount }) {
  const res = await api.post(`/ai/resume/${resumeId}/questions`, {
    targetRole,
    questionCount,
  });
  return res.data.data;
}


