import api, { unwrap } from './client';

export const notificationsApi = {
  list: (params) => api.get('/notifications', { params }).then(unwrap),
  markRead: (id) => api.patch(`/notifications/${id}/read`).then(unwrap),
  markAllRead: () => api.patch('/notifications/read-all').then(unwrap),
};
