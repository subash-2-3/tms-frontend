import { useMutation } from '@tanstack/react-query';
import apiClient from '../services/api';
import useAuthStore from '../store/authStore';

export const useLogin = () => {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (credentials) => {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // data typically contains { user, accessToken, refreshToken }
      setAuth(data.user, data.accessToken, data.refreshToken);
    },
  });
};

export const useLogout = () => {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  return useMutation({
    mutationFn: async () => {
      // Notify backend about logout if necessary
      return apiClient.post('/auth/logout', { refreshToken });
    },
    onSettled: () => {
      // Always clear local auth regardless of API success
      clearAuth();
      window.location.href = '/login';
    },
  });
};