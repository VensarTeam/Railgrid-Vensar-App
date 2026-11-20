import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../hooks/useTheme';
import { radius, spacing } from '../theme';
type Props = Omit<PressableProps, 'children'> & {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
};
export function AppButton({
  title,
  variant = 'primary',
  loading = false,
  disabled,
  style,
  ...props
}: Props) {
  const t = useTheme();
  const muted = variant === 'secondary';
  const outline = variant === 'outline';
  const backgroundColor = outline ? 'transparent' : muted ? t.colors.surface : t.colors.secondary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={disabled || loading}
      style={(state) => [
        styles.base,
        {
          height: t.componentHeights.button,
          backgroundColor,
          borderColor: t.colors.border,
          opacity: disabled ? 0.55 : state.pressed ? 0.82 : 1,
        },
        (outline || muted) && styles.outlined,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={outline || muted ? t.colors.secondary : t.colors.onPrimary} />
      ) : (
        <AppText
          variant="button"
          color={outline ? t.colors.secondary : muted ? t.colors.text : t.colors.onPrimary}
        >
          {title}
        </AppText>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  outlined: { borderWidth: 1 },
});
