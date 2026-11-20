import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { apiBaseUrl, authApi, authErrorMessage, type Session } from './authApi';
import { clearSession, readSession, writeSession } from './session';
import { useAuthStore } from '../store/authStore';
type RetryConfig = InternalAxiosRequestConfig & { _retried?: boolean };
let refreshPromise: Promise<Session> | null = null;
export const api = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});
api.interceptors.request.use(async (config) => {
  const session = await readSession();
  if (session) config.headers.Authorization = `Bearer ${session.accessToken}`;
  return config;
});
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const request = error.config as RetryConfig | undefined;
    if (error.response?.status === 401 && request?._retried) {
      await clearSession();
      useAuthStore.setState({ authenticated: false, user: null });
    } else if (error.response?.status === 401 && request) {
      request._retried = true;
      const session = await readSession();
      if (session) {
        try {
          if (request.headers.Authorization !== `Bearer ${session.accessToken}`) {
            request.headers.Authorization = `Bearer ${session.accessToken}`;
            return api(request);
          }
          refreshPromise ??= authApi.refresh(session.refreshToken).then(async (next) => {
            const current = await readSession();
            if (current?.refreshToken !== session.refreshToken) {
              throw new Error('Session changed during refresh');
            }
            await writeSession(next);
            useAuthStore.setState({ authenticated: true, user: next.user });
            return next;
          }).finally(() => { refreshPromise = null; });
          const next = await refreshPromise;
          request.headers.Authorization = `Bearer ${next.accessToken}`;
          return api(request);
        } catch (cause) {
          if (axios.isAxiosError(cause) && cause.response?.status === 401) {
            await clearSession();
            useAuthStore.setState({ authenticated: false, user: null });
          }
          return Promise.reject(new Error(authErrorMessage(cause)));
        }
      }
    }
    return Promise.reject(new Error(authErrorMessage(error)));
  },
);
