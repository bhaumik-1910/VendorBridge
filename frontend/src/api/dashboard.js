import api, { unwrap } from './client';

export const dashboardApi = {
  get: () => api.get('/dashboard').then(unwrap),
};
