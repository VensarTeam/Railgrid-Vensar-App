import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText } from '../../components/AppText';
import type { AuthStackParamList } from '../../navigation/navigationTypes';
import { authApi, authErrorMessage } from '../../services/authApi';
import { useAuthPalette } from './authPalette';
import { AuthActionButton } from './components/AuthActionButton';
import { AuthField } from './components/AuthField';
import { PhotoAuthLayout } from './components/PhotoAuthLayout';

const trainPhoto = require('../../../assets/images/dashboard-cover.jpg');

export function ForgotPasswordScreen() {
  const c = useAuthPalette();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function sendCode() {
    if (!identifier.trim()) {
      setError('Enter your mobile number, username, or email.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await authApi.forgotPassword(identifier.trim());
      setSent(true);
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword() {
    if (!/^\d{6}$/.test(otp)) {
      setError('Enter the 6-digit reset code.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Use a new password with at least 8 characters.');
      return;
    }
    setError('');
    setBusy(true);
    try {
      await authApi.resetPassword(identifier.trim(), otp, newPassword);
      Alert.alert('Password updated', 'Sign in with your new password.', [
        { text: 'Continue', onPress: () => navigation.popToTop() },
      ]);
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setBusy(false);
    }
  }

  return (
    <PhotoAuthLayout
      image={trainPhoto}
      heroFraction={0.35}
      imageFocalX={0.94}
      heroCaption="A fresh start, made simple"
      eyebrow="Account recovery"
      title={sent ? 'Set a new password.' : 'Forgot your password?'}
      subtitle={sent
        ? 'Use the code sent to your registered email, then choose a new password.'
        : 'Enter your account details and we’ll help you get back to work.'}
    >
      <AuthField
        icon={Mail}
        label="Mobile, username, or email"
        placeholder="Your account identifier"
        autoCapitalize="none"
        value={identifier}
        editable={!sent}
        onChangeText={setIdentifier}
      />
      {sent ? (
        <>
          <AuthField
            icon={ShieldCheck}
            label="Reset code"
            placeholder="6-digit code"
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/\D/g, ''))}
          />
          <AuthField
            icon={LockKeyhole}
            label="New password"
            placeholder="At least 8 characters"
            secureTextEntry={!showPassword}
            autoComplete="new-password"
            value={newPassword}
            onChangeText={setNewPassword}
            accessory={
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                onPress={() => setShowPassword((shown) => !shown)}
                hitSlop={8}
              >
                {showPassword ? <EyeOff color={c.muted} size={20} /> : <Eye color={c.muted} size={20} />}
              </Pressable>
            }
          />
          <Pressable accessibilityRole="button" disabled={busy} onPress={() => { sendCode().catch(() => undefined); }} style={styles.resend}>
            <AppText variant="label" color={c.accent}>Send another code</AppText>
          </Pressable>
        </>
      ) : (
        <AppText variant="bodySmall" color={c.muted} style={styles.note}>
          If your account has an email, we’ll send a one-time reset code there.
        </AppText>
      )}
      {error ? (
        <View style={[styles.error, { backgroundColor: `${c.error}14` }]}>
          <AppText variant="bodySmall" color={c.error}>{error}</AppText>
        </View>
      ) : null}
      <AuthActionButton
        title={sent ? 'Reset password' : 'Send reset code'}
        loading={busy}
        onPress={() => { (sent ? resetPassword() : sendCode()).catch(() => undefined); }}
      />
      <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
        <ArrowLeft color={c.muted} size={16} />
        <AppText variant="label" color={c.muted}>Back to sign in</AppText>
      </Pressable>
    </PhotoAuthLayout>
  );
}

const styles = StyleSheet.create({
  note: { lineHeight: 20 },
  resend: { alignSelf: 'flex-end', paddingVertical: 3 },
  error: { padding: 12, borderRadius: 11 },
  back: { alignSelf: 'center', flexDirection: 'row', gap: 7, alignItems: 'center', padding: 6 },
});
