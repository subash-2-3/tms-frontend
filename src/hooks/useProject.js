import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/api';

export const useProjects = () => {
    return useQuery({
        queryKey: ['projects'],
        queryFn: () => apiClient.get('/projects').then((res) => res.data),
    });
};

export const useProjectById = (id) => {
    return useQuery({
        queryKey: ['projects', id],
        queryFn: () => apiClient.get(`/projects/${id}`).then((res) => res.data),
        enabled: !!id,
    });
};

export const useCreateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => apiClient.post('/projects', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useUpdateProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }) => apiClient.put(`/projects/${id}`, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};

export const useDeleteProject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => apiClient.delete(`/projects/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
        },
    });
};
