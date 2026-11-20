import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { AppText } from '../../../components/AppText';
import { useAuthPalette } from '../authPalette';

type Props = { title: string; loading?: boolean; disabled?: boolean; onPress: () => void };

export function AuthActionButton({ title, loading = false, disabled = false, onPress }: Props) {
  const c = useAuthPalette();
  const [buttonWidth, setButtonWidth] = useState(0);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      disabled={loading || disabled}
      onPress={onPress}
      onLayout={(event) => setButtonWidth(event.nativeEvent.layout.width)}
      style={({ pressed }) => [styles.button, { backgroundColor: c.buttonStart, opacity: disabled ? 0.5 : pressed ? 0.87 : 1 }]}
    >
      {buttonWidth > 0 ? <Svg width={buttonWidth} height={60} style={StyleSheet.absoluteFill}>
        <Defs>
          <LinearGradient id="buttonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={c.buttonStart} />
            <Stop offset="100%" stopColor={c.buttonEnd} />
          </LinearGradient>
        </Defs>
        <Rect width={buttonWidth} height={60} fill="url(#buttonGradient)" />
      </Svg> : null}
      <View pointerEvents="none" style={styles.labelWrap}>
        <AppText variant="button" color={c.buttonText} style={styles.label}>{title}</AppText>
      </View>
      <View style={[styles.iconCircle, { backgroundColor: c.buttonText }]}>
        {loading ? <ActivityIndicator size="small" color={c.buttonStart} /> : <ArrowRight color={c.buttonStart} size={18} strokeWidth={2.3} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { height: 60, borderRadius: 18, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  labelWrap: { position: 'absolute', left: 56, right: 56, alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '700', textAlign: 'center' },
  iconCircle: { position: 'absolute', right: 12, width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
});
