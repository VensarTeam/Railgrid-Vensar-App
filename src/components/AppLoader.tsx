import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme';
export function AppLoader({ label = 'Loading' }: { label?: string }) {
  const t = useTheme();
  return (
    <View
      accessibilityRole="progressbar"
      style={[styles.container, { backgroundColor: t.colors.background }]}
    >
      <ActivityIndicator size="large" color={t.colors.secondary} />
      <AppText variant="bodySmall" color={t.colors.secondaryText}>
        {label}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
});
