import api, { unwrap, unwrapList } from './client';

export const purchaseOrdersApi = {
  list: (params) => api.get('/purchase-orders', { params }).then(unwrapList),
  get: (id) => api.get(`/purchase-orders/${id}`).then(unwrap),
  create: (body) => api.post('/purchase-orders', body).then(unwrap),
  fromQuotation: (quotationId) => api.post(`/purchase-orders/from-quotation/${quotationId}`).then(unwrap),
};
