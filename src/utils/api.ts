import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Request interceptor for token
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('cc_user') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    
    // Don't show toast for 404s on optional data (like college list during loading)
    if (error.response?.status !== 404) {
      toast.error(message);
    }

    if (error.response?.status === 401) {
      localStorage.removeItem('cc_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
