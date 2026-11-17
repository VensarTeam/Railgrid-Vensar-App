import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './navigationTypes';
import { useAuthStore } from '../store/authStore';
const Stack = createNativeStackNavigator<RootStackParamList>();
export function RootNavigator() {
  const authenticated = useAuthStore((state) => state.authenticated);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen
        name={authenticated ? 'Main' : 'Auth'}
        component={authenticated ? MainNavigator : AuthNavigator}
      />
    </Stack.Navigator>
  );
}
