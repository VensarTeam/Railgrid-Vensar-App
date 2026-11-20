import { useState, type ReactNode } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { AppText } from '../../../components/AppText';
import { useAuthPalette } from '../authPalette';

type Props = TextInputProps & {
  label: string;
  icon: LucideIcon;
  error?: string | undefined;
  accessory?: ReactNode;
};

export function AuthField({ label, icon: Icon, error, accessory, onFocus, onBlur, style, ...props }: Props) {
  const c = useAuthPalette();
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.wrap}>
      <AppText variant="label" color={c.ink} style={styles.label}>{label}</AppText>
      <View style={[styles.field, { backgroundColor: c.field, borderColor: error ? c.error : focused ? c.accent : c.border, shadowColor: c.ink }, focused && styles.fieldFocused, error && styles.fieldError]}>
        <View style={[styles.iconTile, { backgroundColor: focused ? c.iconTileFocused : c.iconTile }]}>
          <Icon color={c.accent} size={19} strokeWidth={1.9} />
        </View>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={c.placeholder}
          selectionColor={c.accent}
          autoCorrect={false}
          onFocus={(event) => { setFocused(true); onFocus?.(event); }}
          onBlur={(event) => { setFocused(false); onBlur?.(event); }}
          style={[styles.input, { color: c.ink }, style]}
          {...props}
        />
        {accessory}
      </View>
      {error ? <AppText variant="caption" color={c.error}>{error}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 9 },
  label: { fontWeight: '600', fontSize: 13, letterSpacing: 0.2, marginLeft: 3 },
  field: { height: 62, borderWidth: 1, borderRadius: 19, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 12, shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.035, shadowRadius: 13, elevation: 1 },
  fieldFocused: { borderWidth: 1.5, shadowOpacity: 0.1 },
  fieldError: { borderWidth: 1.5 },
  iconTile: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  input: { flex: 1, fontSize: 16, fontFamily: 'Inter', paddingVertical: 0, minWidth: 0, letterSpacing: 0.1 },
});
