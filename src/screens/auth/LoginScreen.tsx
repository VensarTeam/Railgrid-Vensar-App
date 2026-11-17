import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Pressable, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppButton } from '../../components/AppButton';
import { AppScreen } from '../../components/AppScreen';
import { AppInput } from '../../components/AppInput';
import { AppText } from '../../components/AppText';
import { useTheme } from '../../hooks/useTheme';
import type { AuthStackParamList } from '../../navigation/navigationTypes';
import { useAuthStore } from '../../store/authStore';
const schema = z.object({
  email: z.string().email('Enter a valid work email'),
  password: z.string().min(8, 'Use at least 8 characters'),
});
type Values = z.infer<typeof schema>;
export function LoginScreen() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  });
  const signIn = useAuthStore((state) => state.setToken);
  return (
    <AppScreen>
      <View
        style={[
          styles.screen,
          {
            backgroundColor: t.colors.background,
            paddingTop: t.spacing.section,
            paddingBottom: insets.bottom + t.spacing.xl,
          },
        ]}
      >
        <View style={styles.brand}>
          <View style={[styles.mark, { backgroundColor: t.colors.secondary }]}>
            <AppText variant="title" color={t.colors.onPrimary}>
              R
            </AppText>
          </View>
          <AppText variant="title">RailGrid</AppText>
        </View>
        <View style={styles.heading}>
          <AppText variant="heading">Welcome back</AppText>
          <AppText variant="body" color={t.colors.secondaryText}>
            Sign in to manage your railway infrastructure projects.
          </AppText>
        </View>
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Work email"
                placeholder="you@company.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                {...(errors.email?.message ? { error: errors.email.message } : {})}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <AppInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                {...(errors.password?.message ? { error: errors.password.message } : {})}
              />
            )}
          />
          <Pressable
            accessibilityRole="button"
            onPress={() => nav.navigate('ForgotPassword')}
            style={styles.forgot}
          >
            <AppText variant="label" color={t.colors.secondary}>
              Forgot password?
            </AppText>
          </Pressable>
          <AppButton
            title="Sign in"
            loading={isSubmitting}
            onPress={() => {
              handleSubmit(async () => signIn('demo-session-token'))().catch(() => undefined);
            }}
          />
        </View>
        <View style={styles.demo}>
          <AppText variant="caption" color={t.colors.secondaryText}>
            DEMO PREVIEW
          </AppText>
          <AppText variant="bodySmall" color={t.colors.secondaryText}>
            Use any valid email and password (8+ characters) to explore sample RailGrid data.
          </AppText>
        </View>
      </View>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 24, justifyContent: 'center', gap: 32 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mark: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  heading: { gap: 8 },
  form: { gap: 18 },
  forgot: { alignSelf: 'flex-end', marginTop: -6 },
  demo: { gap: 6 },
});
