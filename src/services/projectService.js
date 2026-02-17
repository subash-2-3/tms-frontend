import apiClient from './api';

const projectService = {
  getAll: () => apiClient.get('/projects').then(res => res.data),
  
  getById: (id) => apiClient.get(`/projects/${id}`).then(res => res.data),
  
  create: (data) => apiClient.post('/projects', data).then(res => res.data),
  
  update: (id, data) => apiClient.put(`/projects/${id}`, data).then(res => res.data),
  
  delete: (id) => apiClient.delete(`/projects/${id}`).then(res => res.data),
};

export default projectService;
