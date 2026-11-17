import { StyleSheet, View, type ViewProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { radius, spacing } from '../theme';
type Props = ViewProps & { padded?: boolean };
export function AppCard({ children, padded = true, style, ...props }: Props) {
  const t = useTheme();
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: t.colors.surface,
          borderColor: t.colors.border,
        },
        padded ? styles.padded : styles.unpadded,
        t.shadows.card,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: radius.lg, overflow: 'hidden' },
  padded: { padding: spacing.lg },
  unpadded: { padding: spacing.none },
});
