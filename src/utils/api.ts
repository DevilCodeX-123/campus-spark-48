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

// Response interceptor for error handling and auto-retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    
    // Auto-retry once if it's a network error (no response)
    if (!response && !config._retry) {
      config._retry = true;
      console.warn('🔄 Backend unreachable. Retrying in 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      return api(config);
    }

    const message = response?.data?.message || 'Something went wrong';
    
    // Don't show toast for 404s on optional data (like college list during loading)
    if (response?.status !== 404) {
      toast.error(message);
    }

    if (response?.status === 401) {
      localStorage.removeItem('cc_user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;
