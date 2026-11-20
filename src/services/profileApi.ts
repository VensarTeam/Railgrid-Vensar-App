import { api } from './api';
import type { AuthUser } from './authApi';

export type ProfileProjectScope = {
  projectId: string;
  code: string;
  name: string;
  modules: string[];
  packages: { id: string; sequenceNo: number }[];
};

export type UserProfile = AuthUser & {
  isActive: boolean;
  verifyFaceRegistered: boolean;
  permissions: string[];
  accessScope: ProfileProjectScope[];
};

type Envelope<T> = { success: true; data: T };

export const profileApi = {
  async me(): Promise<UserProfile> {
    const response = await api.get<Envelope<UserProfile>>('/auth/me');
    if (!response.data?.success || !response.data.data?.id) {
      throw new Error('Profile data is unavailable right now.');
    }
    return response.data.data;
  },
};
