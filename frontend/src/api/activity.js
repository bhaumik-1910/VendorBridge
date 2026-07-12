import api, { unwrap } from './client';

export const activityApi = {
  list: (params) => api.get('/activity', { params }).then((r) => ({
    items: r.data.data,
    pagination: r.data.pagination,
  })),
};
