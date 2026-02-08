import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';

const userService = {
  // GET all users
  getAll: () => apiClient.get('/users').then((res) => res.data),

  // GET a single user by ID
  getById: (id) => apiClient.get(`/users/${id}`).then((res) => res.data),

  // POST create a new user (formData for profile image)
  create: (formData) => apiClient.post('/users', formData).then((res) => res.data),

  // PUT update existing user (formData for optional profile image)
  update: (id, formData) => apiClient.put(`/users/${id}`, formData).then((res) => res.data),

  // DELETE a user (soft delete)
  delete: (id) => apiClient.delete(`/users/${id}`).then((res) => res.data),
};

// --- Hooks for Components ---

export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: userService.getAll,
  });
};

export const useUserById = (id) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id, // Only run query if id is provided
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => {
      // Refresh the user list after a new one is created
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userService.update(id, data),
    onSuccess: () => {
      // Refresh both the list and the specific user cache
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};