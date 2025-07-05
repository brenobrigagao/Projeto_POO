import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'https://localhost:5191/api',
  withCredentials: true
});

api.interceptors.request.use(config => {
  const stored = localStorage.getItem('auth');
  if (stored && config.headers) {
    try {
      const { token } = JSON.parse(stored);
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
    }
  }
  return config;
});

export default api;
