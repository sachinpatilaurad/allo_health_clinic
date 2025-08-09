import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// This interceptor ensures every API call is sent with the auth token, if it exists.
api.interceptors.request.use(
  (config) => {
    // This check ensures localStorage is only accessed on the client-side
    if (typeof window !== 'undefined') {
      // --- THIS IS THE MAIN CHANGE ---
      // We are now looking for the key 'accessToken' to match the login page.
      const token = localStorage.getItem('accessToken'); 
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;