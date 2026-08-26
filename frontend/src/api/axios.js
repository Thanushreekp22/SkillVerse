import axios from 'axios';

// In production (Vercel), set VITE_API_URL to the Render backend URL, e.g.
//   VITE_API_URL=https://skillverse-api.onrender.com/api
// Locally it falls back to '/api' which the Vite dev server proxies.
const API_BASE = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request when available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;