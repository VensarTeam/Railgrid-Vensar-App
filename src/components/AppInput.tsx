import { useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import { AppText } from './AppText';
import { useTheme } from '../hooks/useTheme';
import { radius, spacing, typography } from '../theme';
type Props = TextInputProps & { label: string; error?: string };
export function AppInput({ label, error, style, onFocus, onBlur, ...props }: Props) {
  const t = useTheme();
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <AppText variant="label" style={styles.label}>
        {label}
      </AppText>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={t.colors.secondaryText}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        style={[
          styles.input,
          {
            height: t.componentHeights.input,
            color: t.colors.text,
            backgroundColor: t.colors.surface,
            borderColor: error ? t.colors.error : focused ? t.colors.secondary : t.colors.border,
          },
          style,
        ]}
        {...props}
      />
      {error ? (
        <AppText variant="caption" color={t.colors.error}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  wrap: { gap: spacing.xs + spacing.xxs },
  label: { marginLeft: spacing.xxs },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md + spacing.xs,
    fontSize: typography.variants.body.fontSize,
  },
});
