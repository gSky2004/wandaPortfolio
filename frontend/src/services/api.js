import axios from 'axios';

export const API_UNREACHABLE_EVENT = 'wanda:api-unreachable';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: Number(import.meta.env.VITE_API_TIMEOUT_MS) || 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isNetworkError = !error.response;

    if (isNetworkError) {
      error.friendlyMessage =
        error.code === 'ECONNABORTED'
          ? 'The server took too long to respond.'
          : 'Cannot reach the server. Is the backend running?';
      window.dispatchEvent(new CustomEvent(API_UNREACHABLE_EVENT, { detail: error.friendlyMessage }));
    } else {
      error.friendlyMessage = error.response.data?.message || `Request failed (${error.response.status})`;
    }

    return Promise.reject(error);
  }
);

export const getErrorMessage = (err, fallback = 'Something went wrong') =>
  err?.friendlyMessage || err?.response?.data?.message || err?.message || fallback;

export default api;
