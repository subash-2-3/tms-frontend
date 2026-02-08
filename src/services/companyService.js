import apiClient from './api';

const companyService = {
  getAll: () => apiClient.get('/companies').then(res => res.data),
  
  getById: (id) => apiClient.get(`/companies/${id}`).then(res => res.data),
  
  create: (formData) => apiClient.post('/companies', formData).then(res => res.data),
  
  update: (id, formData) => apiClient.put(`/companies/${id}`, formData).then(res => res.data),
  
  delete: (id) => apiClient.delete(`/companies/${id}`).then(res => res.data),
};

export default companyService;