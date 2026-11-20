import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { makeTheme } from './themes';
import { brandColors, palettes } from './colors';
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';
export * from './shadows';
export * from './themes';
export const navigationThemes: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: brandColors.railBlue,
      background: palettes.light.background,
      card: palettes.light.surface,
      text: palettes.light.text,
      border: palettes.light.border,
      notification: brandColors.saffron,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: palettes.dark.secondary,
      background: palettes.dark.background,
      card: palettes.dark.surface,
      text: palettes.dark.text,
      border: palettes.dark.border,
      notification: palettes.dark.accent,
    },
  },
};
export const lightTheme = makeTheme('light');
