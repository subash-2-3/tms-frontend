import apiClient from './api';

const roleService = {
  getAll: () => apiClient.get('/roles').then(res => res.data),
  
  getById: (id) => apiClient.get(`/roles/${id}`).then(res => res.data),
  
  create: (data) => apiClient.post('/roles', data).then(res => res.data),
  
  update: (id, data) => apiClient.put(`/roles/${id}`, data).then(res => res.data),
  
  delete: (id) => apiClient.delete(`/roles/${id}`).then(res => res.data),
};

export default roleService;