import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './navigationTypes';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
const Stack = createNativeStackNavigator<AuthStackParamList>();
export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
