import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Eye, EyeOff, LockKeyhole, Phone } from 'lucide-react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { z } from 'zod';
import { AppText } from '../../components/AppText';
import type { AuthStackParamList } from '../../navigation/navigationTypes';
import { authApi, authErrorMessage } from '../../services/authApi';
import { useAuthPalette } from './authPalette';
import { AuthActionButton } from './components/AuthActionButton';
import { AuthField } from './components/AuthField';
import { PhotoAuthLayout } from './components/PhotoAuthLayout';

const trainPhoto = require('../../../assets/images/dashboard-cover.jpg');

const schema = z.object({
  mobile: z.string().regex(/^\d{10}$/, 'Enter your 10-digit mobile number'),
  password: z.string().min(6, 'Enter your password'),
});
type Values = z.infer<typeof schema>;

export function LoginScreen() {
  const c = useAuthPalette();
  const navigation = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { mobile: '', password: '' },
  });

  const submit = handleSubmit(async ({ mobile, password }) => {
    setError('');
    try {
      const challenge = await authApi.login(mobile, password);
      if (challenge.requiredVerification !== 'email_otp') {
        throw new Error('This account requires face verification, which is not available in this app yet.');
      }
      navigation.navigate('VerifyOtp', {
        verificationToken: challenge.verificationToken,
        maskedEmail: challenge.maskedEmail ?? 'your registered email',
        expiresAt: Date.now() + challenge.verificationExpiresIn * 1000,
      });
    } catch (cause) {
      setError(authErrorMessage(cause));
    }
  });

  return (
    <PhotoAuthLayout
      image={trainPhoto}
      imageFocalX={0.94}
      title="Welcome back."
      subtitle="Sign in with your registered mobile number to continue your work."
    >
      <Controller
        control={control}
        name="mobile"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthField
            icon={Phone}
            label="Mobile number"
            placeholder="10-digit mobile number"
            keyboardType="number-pad"
            textContentType="telephoneNumber"
            autoComplete="tel"
            maxLength={10}
            onChangeText={(text) => onChange(text.replace(/\D/g, ''))}
            onBlur={onBlur}
            value={value}
            error={errors.mobile?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <AuthField
            icon={LockKeyhole}
            label="Password"
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoComplete="password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={() => { submit().catch(() => undefined); }}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            error={errors.password?.message}
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
        )}
      />
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.navigate('ForgotPassword')}
        style={styles.forgot}
      >
        <AppText variant="label" color={c.accent}>Forgot password?</AppText>
      </Pressable>
      {error ? (
        <View style={[styles.error, { backgroundColor: `${c.error}14` }]}>
          <AppText variant="bodySmall" color={c.error}>{error}</AppText>
        </View>
      ) : null}
      <AuthActionButton title="Continue" loading={isSubmitting} onPress={() => { submit().catch(() => undefined); }} />
      <AppText variant="caption" color={c.muted} style={styles.helper}>
        A verification code will be sent to your registered email.
      </AppText>
    </PhotoAuthLayout>
  );
}

const styles = StyleSheet.create({
  forgot: { alignSelf: 'flex-end', paddingVertical: 4, marginTop: -4 },
  error: { padding: 12, borderRadius: 11 },
  helper: { textAlign: 'center', lineHeight: 18, marginTop: -3 },
});
