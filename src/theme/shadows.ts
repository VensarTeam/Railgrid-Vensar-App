import { Platform } from 'react-native';
import { brandColors } from './colors';
export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: brandColors.navy900,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
    },
    android: { elevation: 2 },
    default: {},
  }),
};
