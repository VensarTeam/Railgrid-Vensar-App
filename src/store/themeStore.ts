import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import type { ThemeMode } from '../theme';
const KEY = 'railgrid.theme';
type ThemeState = {
  mode: ThemeMode;
  hydrated: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  hydrate: () => Promise<void>;
};
export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',
  hydrated: false,
  setMode: async (mode) => {
    set({ mode });
    await AsyncStorage.setItem(KEY, mode);
  },
  hydrate: async () => {
    try {
      const saved = await AsyncStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') set({ mode: saved });
    } catch {
      set({ mode: 'system' });
    } finally {
      set({ hydrated: true });
    }
  },
}));
