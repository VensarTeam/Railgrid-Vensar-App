import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const KEY = 'railgrid.welcome_seen.v1';

type OnboardingState = {
  hydrated: boolean;
  hasSeenWelcome: boolean;
  hydrate: () => Promise<void>;
  complete: () => Promise<void>;
};

export const useOnboardingStore = create<OnboardingState>((set) => ({
  hydrated: false,
  hasSeenWelcome: false,
  hydrate: async () => {
    try {
      set({ hasSeenWelcome: (await AsyncStorage.getItem(KEY)) === 'true' });
    } catch {
      set({ hasSeenWelcome: false });
    } finally {
      set({ hydrated: true });
    }
  },
  complete: async () => {
    set({ hasSeenWelcome: true });
    try {
      await AsyncStorage.setItem(KEY, 'true');
    } catch {
      // Continue into sign-in even if local preferences are unavailable.
    }
  },
}));
