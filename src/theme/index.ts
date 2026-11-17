import { DarkTheme, DefaultTheme, Theme } from '@react-navigation/native';
import { makeTheme } from './themes';
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
      primary: '#167D78',
      background: '#F3F6F9',
      card: '#FFFFFF',
      text: '#172B3A',
      border: '#E2E8F0',
      notification: '#E6A23C',
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: '#5EC1B5',
      background: '#101C29',
      card: '#1B2B3A',
      text: '#F1F5F9',
      border: '#344658',
      notification: '#E6A23C',
    },
  },
};
export const lightTheme = makeTheme('light');
