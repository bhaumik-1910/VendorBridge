import api, { unwrap } from './client';

export const authApi = {
  signup: (body) => api.post('/auth/signup', body).then(unwrap),
  login: (body) => api.post('/auth/login', body).then(unwrap),
  logout: () => api.post('/auth/logout').then(unwrap),
  refreshToken: (refreshToken) => api.post('/auth/refresh-token', { refreshToken }).then(unwrap),
  me: () => api.get('/auth/me').then(unwrap),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(unwrap),
  resetPassword: (body) => api.post('/auth/reset-password', body).then(unwrap),
  getProfile: () => api.get('/auth/profile').then((r) => r.data.data.user),
  updateProfile: (body) => api.put('/auth/profile', body).then((r) => r.data.data.user),
  changePassword: (body) => api.put('/auth/change-password', body).then(unwrap),
};
