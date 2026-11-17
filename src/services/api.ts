import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '@env';
import { useAuthStore } from '../store/authStore';
export const api = axios.create({
  baseURL: API_BASE_URL ?? 'https://api.example.com',
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});
api.interceptors.request.use(async (config) => {
  const Keychain = await import('react-native-keychain');
  const credentials = await Keychain.getGenericPassword({ service: 'com.railgrid.auth' });
  if (credentials) config.headers.Authorization = `Bearer ${credentials.password}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401)
      useAuthStore
        .getState()
        .signOut()
        .catch(() => undefined);
    const message =
      error.response?.data?.message ?? error.message ?? 'The request could not be completed.';
    return Promise.reject(new Error(message));
  },
);
