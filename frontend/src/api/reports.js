import api, { unwrap } from './client';

export const reportsApi = {
  get: (params) => api.get('/reports', { params }).then(unwrap),
  export: (type, params) => api.get(`/reports/export/${type}`, { params, responseType: 'blob' }),
};
