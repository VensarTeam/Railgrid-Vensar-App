import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';
import type { RootStackParamList } from './navigationTypes';
import { useAuthStore } from '../store/authStore';
import { useOnboardingStore } from '../store/onboardingStore';
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();
export function RootNavigator() {
  const authenticated = useAuthStore((state) => state.authenticated);
  const hasSeenWelcome = useOnboardingStore((state) => state.hasSeenWelcome);
  const screen = authenticated ? 'Main' : hasSeenWelcome ? 'Auth' : 'Welcome';
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {screen === 'Main' ? <Stack.Screen name="Main" component={MainNavigator} /> : null}
      {screen === 'Auth' ? <Stack.Screen name="Auth" component={AuthNavigator} /> : null}
      {screen === 'Welcome' ? <Stack.Screen name="Welcome" component={WelcomeScreen} /> : null}
    </Stack.Navigator>
  );
}
