import axios from 'axios';

// Debug: Log the environment variable
console.log('VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('All env vars:', import.meta.env);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

console.log('Computed API_URL:', API_URL);
console.log('Final baseURL:', `${API_URL}/api`);

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if 401 and not on auth endpoints
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    // Extract error message from response
    const message = error.response?.data?.message || error.response?.data?.error || error.message || 'An error occurred';
    error.message = message;
    
    return Promise.reject(error);
  }
);

export default api;
