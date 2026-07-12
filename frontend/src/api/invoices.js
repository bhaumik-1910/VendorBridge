import api, { unwrap, unwrapList } from './client';
import { downloadBlob } from '../utils/download';

export const invoicesApi = {
  list: (params) => api.get('/invoices', { params }).then(unwrapList),
  get: (id) => api.get(`/invoices/${id}`).then((r) => r.data.data.invoice),
  create: (body) => api.post('/invoices', body).then(unwrap),
  fromPo: (poId) => api.post(`/invoices/from-po/${poId}`).then(unwrap),
  downloadPdf: (id, filename) => downloadBlob(`/invoices/${id}/pdf`, filename || `invoice-${id}.pdf`),
  email: (id) => api.post(`/invoices/${id}/email`).then(unwrap),
  markPaid: (id) => api.patch(`/invoices/${id}/paid`).then(unwrap),
};
