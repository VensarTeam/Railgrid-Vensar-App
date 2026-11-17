import { useColorScheme } from 'react-native';
import { useThemeStore } from '../store/themeStore';
import { makeTheme } from '../theme';
export const useTheme = () => {
  const scheme = useColorScheme();
  const preference = useThemeStore((state) => state.mode);
  return makeTheme(preference === 'system' ? scheme ?? 'light' : preference);
};
