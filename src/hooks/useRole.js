import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';

const roleService = {
  getAll: () => apiClient.get('/roles').then((res) => res.data),
  create: (data) => apiClient.post('/roles', data).then((res) => res.data),
  update: (id, data) => apiClient.put(`/roles/${id}`, data).then((res) => res.data),
  delete: (id) => apiClient.delete(`/roles/${id}`).then((res) => res.data),
};

export const useRoles = () => useQuery({ queryKey: ['roles'], queryFn: roleService.getAll });

export const useCreateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roleService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => roleService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: roleService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
};