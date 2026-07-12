import api, { unwrap, unwrapList } from './client';
import { uploadFile } from '../utils/upload';
import { downloadBlob } from '../utils/download';

export const rfqsApi = {
  list: (params) => api.get('/rfqs', { params }).then(unwrapList),
  get: (id) => api.get(`/rfqs/${id}`).then((r) => r.data.data.rfq),
  create: (body) => api.post('/rfqs', body).then((r) => r.data.data),
  update: (id, body) => api.put(`/rfqs/${id}`, body).then((r) => r.data.data.rfq),
  remove: (id) => api.delete(`/rfqs/${id}`).then(unwrap),
  publish: (id) => api.patch(`/rfqs/${id}/publish`).then((r) => r.data.data.rfq),
  draft: (id) => api.patch(`/rfqs/${id}/draft`).then(unwrap),
  assignVendors: (id, vendorIds) => api.patch(`/rfqs/${id}/vendors`, { vendorIds }).then((r) => r.data.data.rfq),
  uploadAttachment: (id, file) => uploadFile(`/rfqs/${id}/attachments`, file),
  downloadAttachment: (rfqId, attachmentId, filename) =>
    downloadBlob(`/rfqs/${rfqId}/attachments/${attachmentId}/download`, filename),
  deleteAttachment: (rfqId, attachmentId) =>
    api.delete(`/rfqs/${rfqId}/attachments/${attachmentId}`).then(unwrap),
};
