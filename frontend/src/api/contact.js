import api, { unwrap } from './client';

export const contactApi = {
  submit: (body) => api.post('/contact', body).then(unwrap),
};
