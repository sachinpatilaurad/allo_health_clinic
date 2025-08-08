// frontend/src/lib/api.ts

import axios from 'axios';

const api = axios.create({
  // --- The simple, hardcoded URL for your local backend ---
  baseURL: 'http://localhost:3001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// The interceptor stays the same, it's needed for both local and deployed apps.
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;