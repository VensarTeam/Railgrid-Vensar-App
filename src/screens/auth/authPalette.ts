import { useTheme } from '../../hooks/useTheme';
import { brandColors } from '../../theme/colors';

const light = {
  sheet: '#F7FBFE',
  field: '#FFFFFF',
  iconTile: '#EAF4FA',
  iconTileFocused: '#DDF0FA',
  placeholder: '#8296A8',
  ink: brandColors.ink,
  muted: brandColors.muted,
  border: '#D7E5EF',
  accent: brandColors.railBlue,
  brandAccent: brandColors.saffron,
  buttonStart: brandColors.navy900,
  buttonEnd: brandColors.skyBlue,
  buttonText: '#FFFFFF',
  error: brandColors.danger,
  success: '#16803E',
} as const;

const dark = {
  sheet: brandColors.navy950,
  field: '#102B43',
  iconTile: '#193C56',
  iconTileFocused: '#1E5273',
  placeholder: '#91A9BC',
  ink: '#F3F8FC',
  muted: '#B4C7D7',
  border: '#2D4D66',
  accent: '#72C2E9',
  brandAccent: '#F6AA57',
  buttonStart: brandColors.railBlue,
  buttonEnd: brandColors.skyBlue,
  buttonText: '#FFFFFF',
  error: '#FF8B80',
  success: '#64CE8B',
} as const;

export function useAuthPalette() {
  return useTheme().mode === 'dark' ? dark : light;
}
