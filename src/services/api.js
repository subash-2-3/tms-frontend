import axios from 'axios';
import useAuthStore from '../store/authStore';

const apiClient = axios.create({
  baseURL: 'http://localhost:3000/api', // Match your backend port
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request Interceptor ---
// Automatically adds the Bearer token to every request if the user is logged in
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If we are sending FormData (for images), let the browser set the Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
// Handles global errors like 401 Unauthorized (token expired)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const { clearAuth } = useAuthStore.getState();

    if (error.response?.status === 401) {
      // Token is invalid or expired - log the user out
      clearAuth();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;