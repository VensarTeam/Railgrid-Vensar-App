import { palettes } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { radius } from './radius';
import { shadows } from './shadows';
export type ThemeMode = 'light' | 'dark' | 'system';
export type ResolvedThemeMode = 'light' | 'dark';
export const makeTheme = (mode: ResolvedThemeMode) => ({
  mode,
  colors: palettes[mode],
  spacing,
  typography,
  radius,
  shadows,
  screenPadding: spacing.xl,
  componentHeights: { input: 52, button: 52, tabBar: 64 },
  iconSizes: { sm: 16, md: 20, lg: 24, xl: 32 },
});
export type AppTheme = ReturnType<typeof makeTheme>;
