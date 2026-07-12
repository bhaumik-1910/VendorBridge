import api, { unwrap, unwrapList } from './client';

export const approvalsApi = {
  list: (params) => api.get('/approvals', { params }).then(unwrapList),
  approve: (id, body) => api.patch(`/approvals/${id}/approve`, body).then(unwrap),
  reject: (id, body) => api.patch(`/approvals/${id}/reject`, body).then(unwrap),
};
