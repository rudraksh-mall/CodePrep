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

export async function generateQuestions(resumeId, { targetRole, questionCount }) {
  const res = await api.post(`/ai/resume/${resumeId}/questions`, {
    targetRole,
    questionCount,
  });
  return res.data.data;
}
