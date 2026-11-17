import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AppButton } from '../../components/AppButton';
import { AppScreen } from '../../components/AppScreen';
import { AppHeader } from '../../components/AppHeader';
import { AppInput } from '../../components/AppInput';
import { useTheme } from '../../hooks/useTheme';
export function ForgotPasswordScreen() {
  const t = useTheme();
  const nav = useNavigation();
  const [email, setEmail] = useState('');
  return (
    <AppScreen>
      <View
        style={[
          styles.screen,
          {
            backgroundColor: t.colors.background,
            padding: t.spacing.xl,
            paddingTop: t.spacing.xl,
          },
        ]}
      >
        <AppHeader
          title="Reset password"
          subtitle="We’ll send reset instructions to your work email."
          onBack={() => nav.goBack()}
        />
        <AppInput
          label="Work email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholder="you@company.com"
        />
        <AppButton
          title="Send reset link"
          onPress={() => Alert.alert('Demo only', 'Password reset is not connected yet.')}
        />
      </View>
    </AppScreen>
  );
}
const styles = StyleSheet.create({ screen: { flex: 1, gap: 24 } });
