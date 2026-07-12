import api from '../api/client';

export async function uploadFile(url, file, onProgress) {
  const form = new FormData();
  form.append('file', file);
  const res = await api.post(url, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: onProgress
      ? (e) => onProgress(Math.round((e.loaded * 100) / (e.total || 1)))
      : undefined,
  });
  return res.data.data ?? res.data;
}
