import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import { AppText } from './AppText';
import { useTheme } from '../hooks/useTheme';
import { spacing } from '../theme';
type Props = { title: string; subtitle?: string; onBack?: () => void };
export function AppHeader({ title, subtitle, onBack }: Props) {
  const t = useTheme();
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={onBack}
          style={styles.back}
        >
          <ChevronLeft size={22} color={t.colors.text} />
        </Pressable>
      ) : null}
      <View style={styles.copy}>
        <AppText variant="title">{title}</AppText>
        {subtitle ? (
          <AppText variant="bodySmall" color={t.colors.secondaryText}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: spacing.xxs },
});
