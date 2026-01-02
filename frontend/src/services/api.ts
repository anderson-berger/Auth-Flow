import axios, { type AxiosInstance } from 'axios';
import AuthService from './AuthService';

interface AxiosRetryConfig {
  _retry?: boolean;
}

// Flag para evitar múltiplos redirects
let isRedirecting = false;

const api: AxiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!axios.isAxiosError(error)) {
      throw error instanceof Error ? error : new Error(String(error));
    }

    const originalRequest = error.config as AxiosRetryConfig;

    if (error.response?.status !== 401 || originalRequest._retry) {
      throw error;
    }

    if (isRefreshing) {
      throw error;
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      logout();
      throw new Error('Missing refresh token');
    }

    try {
      const { data } = await axios.post('/api/auth/refresh', {
        refreshToken,
      });

      localStorage.setItem('access_token', data.accessToken);
      localStorage.setItem('refresh_token', data.refreshToken);

      return api(originalRequest as any);
    } catch (err) {
      logout();
      throw err instanceof Error ? err : new Error('Token refresh failed');
    } finally {
      isRefreshing = false;
    }
  },
);

function logout() {
  if (isRedirecting) return;

  isRedirecting = true;
  AuthService.logout();

  // Usa window.location para garantir limpeza completa do estado da aplicação
  // Não podemos usar router aqui pois estamos em um interceptor
  window.location.href = '/auth';
}

export default api;
