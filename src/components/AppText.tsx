import type { PropsWithChildren } from 'react';
import { Text, type TextProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import type { AppTheme } from '../theme';
type Variant = keyof AppTheme['typography']['variants'];
type Props = PropsWithChildren<TextProps & { variant?: Variant; color?: string }>;
export function AppText({
  variant = 'body',
  color,
  style,
  allowFontScaling = true,
  ...props
}: Props) {
  const theme = useTheme();
  return (
    <Text
      accessibilityRole="text"
      allowFontScaling={allowFontScaling}
      style={[
        theme.typography.variants[variant],
        { color: color ?? theme.colors.text, fontFamily: theme.typography.family.regular },
        style,
      ]}
      {...props}
    />
  );
}
