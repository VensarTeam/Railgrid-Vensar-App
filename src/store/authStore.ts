import { create } from 'zustand';
import { authApi, type AuthUser, type Session } from '../services/authApi';
import { clearSession, readSession, writeSession } from '../services/session';
type AuthState = {
  authenticated: boolean;
  hydrated: boolean;
  user: AuthUser | null;
  setSession: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
  restore: () => Promise<void>;
};
export const useAuthStore = create<AuthState>((set) => ({
  authenticated: false,
  hydrated: false,
  user: null,
  setSession: async (session) => {
    await writeSession(session);
    set({ authenticated: true, user: session.user });
  },
  signOut: async () => {
    const session = await readSession();
    await clearSession();
    set({ authenticated: false, user: null });
    if (session) authApi.logout(session.refreshToken).catch(() => undefined);
  },
  restore: async () => {
    try {
      const session = await readSession();
      if (session && session.sessionExpiresAt > Date.now()) {
        set({ authenticated: true, user: session.user });
      } else {
        await clearSession();
        set({ authenticated: false, user: null });
      }
    } catch {
      set({ authenticated: false, user: null });
    } finally {
      set({ hydrated: true });
    }
  },
}));
