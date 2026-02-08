import apiClient from './api';

const userService = {
  getAll: () => apiClient.get('/users').then(res => res.data),
  
  getById: (id) => apiClient.get(`/users/${id}`).then(res => res.data),
  
  create: (formData) => apiClient.post('/users', formData).then(res => res.data),
  
  update: (id, formData) => apiClient.put(`/users/${id}`, formData).then(res => res.data),
  
  delete: (id) => apiClient.delete(`/users/${id}`).then(res => res.data),
};

export default userService;