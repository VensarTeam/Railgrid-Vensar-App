import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ArrowLeft, ShieldCheck } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppText } from '../../components/AppText';
import type { AuthStackParamList } from '../../navigation/navigationTypes';
import { authApi, authErrorMessage } from '../../services/authApi';
import { useAuthStore } from '../../store/authStore';
import { useAuthPalette } from './authPalette';
import { AuthActionButton } from './components/AuthActionButton';
import { AuthField } from './components/AuthField';
import { PhotoAuthLayout } from './components/PhotoAuthLayout';

const stationPhoto = require('../../../assets/images/station-platform.jpg');
const schema = z.object({ otp: z.string().regex(/^\d{6}$/, 'Enter the 6-digit code') });
type Values = z.infer<typeof schema>;

export function VerifyOtpScreen() {
  const c = useAuthPalette();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { params } = useRoute<RouteProp<AuthStackParamList, 'VerifyOtp'>>();
  const setSession = useAuthStore((state) => state.setSession);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [resending, setResending] = useState(false);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { otp: '' },
  });

  const submit = handleSubmit(async ({ otp }) => {
    setError('');
    if (Date.now() >= params.expiresAt) {
      setError('This sign-in attempt expired. Return to sign in and try again.');
      return;
    }
    try {
      const session = await authApi.verifyOtp(params.verificationToken, otp);
      await setSession(session);
    } catch (cause) {
      setError(authErrorMessage(cause));
    }
  });

  async function resend() {
    setError('');
    setNotice('');
    if (Date.now() >= params.expiresAt) {
      setError('This sign-in attempt expired. Return to sign in and try again.');
      return;
    }
    setResending(true);
    try {
      await authApi.resendOtp(params.verificationToken);
      setNotice('A new code is on its way to your email.');
    } catch (cause) {
      setError(authErrorMessage(cause));
    } finally {
      setResending(false);
    }
  }

  return (
    <PhotoAuthLayout
      image={stationPhoto}
      lightStatusBar
      heroCaption="A secure step forward"
      eyebrow="Verify your account"
      title="Check your inbox."
      subtitle={`Enter the six-digit code sent to ${params.maskedEmail}.`}
    >
      <Controller
        control={control}
        name="otp"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthField
            icon={ShieldCheck}
            label="Verification code"
            placeholder="6-digit code"
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoComplete="one-time-code"
            maxLength={6}
            onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
            onBlur={onBlur}
            value={value}
            error={errors.otp?.message}
          />
        )}
      />
      {notice ? <AppText variant="bodySmall" color={c.success}>{notice}</AppText> : null}
      {error ? (
        <View style={[styles.error, { backgroundColor: `${c.error}14` }]}>
          <AppText variant="bodySmall" color={c.error}>{error}</AppText>
        </View>
      ) : null}
      <AuthActionButton title="Verify and sign in" loading={isSubmitting} onPress={() => { submit().catch(() => undefined); }} />
      <View style={styles.links}>
        <AppText variant="bodySmall" color={c.muted}>Didn’t get the code?</AppText>
        <Pressable accessibilityRole="button" disabled={resending} onPress={() => { resend().catch(() => undefined); }}>
          <AppText variant="label" color={c.accent}>{resending ? 'Sending…' : 'Resend code'}</AppText>
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" onPress={() => navigation.goBack()} style={styles.back}>
        <ArrowLeft color={c.muted} size={16} />
        <AppText variant="label" color={c.muted}>Back to sign in</AppText>
      </Pressable>
    </PhotoAuthLayout>
  );
}

const styles = StyleSheet.create({
  error: { padding: 12, borderRadius: 11 },
  links: { flexDirection: 'row', gap: 6, justifyContent: 'center', flexWrap: 'wrap' },
  back: { alignSelf: 'center', flexDirection: 'row', gap: 7, alignItems: 'center', padding: 6 },
});
