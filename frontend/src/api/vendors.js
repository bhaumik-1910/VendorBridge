import api, { unwrap, unwrapList } from './client';
import { uploadFile } from '../utils/upload';
import { downloadBlob } from '../utils/download';

export const vendorsApi = {
  list: (params) => api.get('/vendors', { params }).then(unwrapList),
  get: (id) => api.get(`/vendors/${id}`).then((r) => r.data.data.vendor),
  create: (body) => api.post('/vendors', body).then((r) => r.data.data.vendor),
  update: (id, body) => api.put(`/vendors/${id}`, body).then((r) => r.data.data.vendor),
  remove: (id) => api.delete(`/vendors/${id}`).then(unwrap),
  getCategories: () => api.get('/vendors/categories').then((r) => r.data.data.categories),
  uploadDocument: (id, file) => uploadFile(`/vendors/${id}/documents`, file),
  downloadDocument: (vendorId, docId, filename) =>
    downloadBlob(`/vendors/${vendorId}/documents/${docId}/download`, filename),
  deleteDocument: (vendorId, docId) =>
    api.delete(`/vendors/${vendorId}/documents/${docId}`).then(unwrap),
};
