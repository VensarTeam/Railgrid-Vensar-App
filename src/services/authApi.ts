import axios from 'axios';
import { API_BASE_URL, AUTH_LOGIN_CHANNEL } from '@env';

const baseUrl = (API_BASE_URL || 'https://api.example.com').replace(/\/+$/, '');
export const apiBaseUrl = baseUrl.endsWith('/v1') ? baseUrl : `${baseUrl}/v1`;

const authClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15_000,
  headers: { Accept: 'application/json' },
});

type Envelope<T> = { success: true; data: T };

export type AuthUser = {
  id: string;
  username: string;
  mobile: string;
  email: string | null;
  designation: string | null;
  role: string;
  profileUrl: string | null;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  sessionExpiresAt: number;
  user: AuthUser;
};

export type LoginChallenge = {
  verificationToken: string;
  verificationExpiresIn: number;
  requiredVerification: 'email_otp' | 'face';
  maskedEmail?: string;
};

export const authApi = {
  async login(mobile: string, password: string): Promise<LoginChallenge> {
    const response = await authClient.post<Envelope<LoginChallenge>>(
      '/auth/login',
      { mobile, password },
      { headers: { 'x-login-channel': AUTH_LOGIN_CHANNEL === 'web' ? 'web' : 'mobile-otp' } },
    );
    return response.data.data;
  },
  async verifyOtp(verificationToken: string, otp: string): Promise<Session> {
    const response = await authClient.post<Envelope<Session>>(
      '/auth/email-otp/verify',
      { otp },
      { headers: { Authorization: `Bearer ${verificationToken}` } },
    );
    return response.data.data;
  },
  async resendOtp(verificationToken: string): Promise<void> {
    await authClient.post('/auth/email-otp/resend', {}, {
      headers: { Authorization: `Bearer ${verificationToken}` },
    });
  },
  async refresh(refreshToken: string): Promise<Session> {
    const response = await authClient.post<Envelope<Session>>('/auth/token/refresh', { refreshToken });
    return response.data.data;
  },
  async logout(refreshToken: string): Promise<void> {
    await authClient.post('/auth/logout', { refreshToken });
  },
  async forgotPassword(identifier: string): Promise<void> {
    await authClient.post('/auth/password/forgot', { identifier });
  },
  async resetPassword(identifier: string, otp: string, newPassword: string): Promise<void> {
    await authClient.post('/auth/password/reset', { identifier, otp, newPassword });
  },
};

export function authErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) return 'Could not reach RailGrid. Check your connection and API address.';
    const message = error.response.data?.error?.message ?? error.response.data?.message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join('\n');
  }
  return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}
