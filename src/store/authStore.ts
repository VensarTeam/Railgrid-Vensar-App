import { create } from 'zustand';
import * as Keychain from 'react-native-keychain';
type AuthState = {
  authenticated: boolean;
  hydrated: boolean;
  setToken: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
  restore: () => Promise<void>;
};
export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  hydrated: false,
  setToken: async (token) => {
    await Keychain.setGenericPassword('railgrid', token, { service: 'com.railgrid.auth' });
    set({ authenticated: true });
  },
  signOut: async () => {
    await Keychain.resetGenericPassword({ service: 'com.railgrid.auth' });
    set({ authenticated: false });
  },
  restore: async () => {
    try {
      const credentials = await Keychain.getGenericPassword({ service: 'com.railgrid.auth' });
      set({ authenticated: Boolean(credentials) });
    } catch {
      set({ authenticated: false });
    } finally {
      set({ hydrated: true });
    }
  },
}));
