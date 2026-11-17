import { ScrollView, StyleSheet, View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { AppButton } from '../../components/AppButton';
import { AppCard } from '../../components/AppCard';
import { AppScreen } from '../../components/AppScreen';
import { AppHeader } from '../../components/AppHeader';
import { AppText } from '../../components/AppText';
import { useTheme } from '../../hooks/useTheme';
import type { ThemeMode } from '../../theme';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
export function ProfileScreen() {
  const t = useTheme();
  const mode = useThemeStore((s) => s.mode);
  const setMode = useThemeStore((s) => s.setMode);
  const signOut = useAuthStore((s) => s.signOut);
  const options: { mode: ThemeMode; label: string }[] = [
    { mode: 'system', label: 'System' },
    { mode: 'light', label: 'Light' },
    { mode: 'dark', label: 'Dark' },
  ];
  return (
    <AppScreen>
      <ScrollView
        style={{ backgroundColor: t.colors.background }}
        contentContainerStyle={styles.content}
      >
        <AppHeader title="Profile" subtitle="Account and app preferences" />
        <AppCard>
          <View style={styles.person}>
            <View style={[styles.avatar, { backgroundColor: `${t.colors.secondary}20` }]}>
              <UserRound color={t.colors.secondary} size={26} />
            </View>
            <View>
              <AppText variant="subtitle">Alex Morgan</AppText>
              <AppText variant="bodySmall" color={t.colors.secondaryText}>
                Project operations · Demo user
              </AppText>
            </View>
          </View>
        </AppCard>
        <AppText variant="title">Appearance</AppText>
        <AppCard>
          <AppText variant="bodySmall" color={t.colors.secondaryText}>
            Choose how RailGrid looks on this device.
          </AppText>
          <View style={styles.options}>
            {options.map(({ mode: option, label }) => (
              <AppButton
                key={option}
                title={label}
                variant={mode === option ? 'primary' : 'outline'}
                onPress={() => setMode(option).catch(() => undefined)}
                style={styles.option}
              />
            ))}
          </View>
        </AppCard>
        <AppCard>
          <View style={styles.person}>
            <View style={styles.about}>
              <AppText variant="subtitle">About RailGrid</AppText>
              <AppText variant="bodySmall" color={t.colors.secondaryText}>
                Infrastructure operations workspace
              </AppText>
            </View>
            <AppText variant="caption" color={t.colors.secondaryText}>
              v1.0.0
            </AppText>
          </View>
        </AppCard>
        <AppButton
          title="Sign out"
          variant="outline"
          onPress={() => signOut().catch(() => undefined)}
        />
      </ScrollView>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  content: { padding: 20, paddingTop: 28, paddingBottom: 32, gap: 16 },
  person: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: { flexDirection: 'row', gap: 8, marginTop: 12 },
  option: { flex: 1, flexDirection: 'row', gap: 6 },
  about: { flex: 1 },
});
