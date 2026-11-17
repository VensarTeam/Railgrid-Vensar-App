import { Platform } from 'react-native';
export const shadows = {
  card: Platform.select({
    ios: {
      shadowColor: '#142B45',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.07,
      shadowRadius: 12,
    },
    android: { elevation: 2 },
    default: {},
  }),
};
