import api, { unwrap, unwrapList } from './client';
import { uploadFile } from '../utils/upload';
import { downloadBlob } from '../utils/download';

export const quotationsApi = {
  list: (params) => api.get('/quotations', { params }).then(unwrapList),
  get: (id) => api.get(`/quotations/${id}`).then((r) => r.data.data.quotation),
  compare: (rfqId) => api.get(`/quotations/compare/${rfqId}`).then(unwrap),
  create: (body) => api.post('/quotations', body).then((r) => r.data.data.quotation),
  select: (id) => api.patch(`/quotations/${id}/select`).then((r) => r.data.data.quotation),
  uploadAttachment: (id, file) => uploadFile(`/quotations/${id}/attachments`, file),
  downloadAttachment: (quotationId, attachmentId, filename) =>
    downloadBlob(`/quotations/${quotationId}/attachments/${attachmentId}/download`, filename),
};
