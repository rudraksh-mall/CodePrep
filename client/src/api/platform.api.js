import api from './axios';

export async function linkPlatform(platform, username) {
  const res = await api.post('/platforms', { platform, username });
  return res.data.data;
}

export async function getLinkedPlatforms() {
  const res = await api.get('/platforms');
  return res.data.data;
}

export async function unlinkPlatform(platform) {
  const res = await api.delete(`/platforms/${platform}`);
  return res.data.data;
}

export async function syncPlatforms() {
  const res = await api.post('/platforms/sync');
  return res.data.data;
}
