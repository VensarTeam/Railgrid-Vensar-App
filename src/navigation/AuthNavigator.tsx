import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParamList } from './navigationTypes';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import { VerifyOtpScreen } from '../screens/auth/VerifyOtpScreen';
const Stack = createNativeStackNavigator<AuthStackParamList>();
export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="VerifyOtp" component={VerifyOtpScreen} options={{ animation: 'slide_from_bottom' }} />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
    </Stack.Navigator>
  );
}
