import { StyleSheet, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { AppText } from '../../../components/AppText';
import { useTheme } from '../../../hooks/useTheme';
import { formatQuantityNumber, type Quantity } from '../dashboardModel';

type Props = { label: string; icon: LucideIcon; color: string; quantity: Quantity };

export function QuantityTile({ label, icon: Icon, color, quantity }: Props) {
  const t = useTheme();
  const tileColor = t.mode === 'dark' ? t.colors.background : '#F7FAFC';
  return (
    <View style={[styles.tile, { backgroundColor: tileColor, borderColor: t.colors.border }]}>
      <View style={styles.top}>
        <View style={[styles.icon, { backgroundColor: `${color}15` }]}><Icon color={color} size={17} strokeWidth={1.8} /></View>
        <AppText variant="caption" color={t.colors.secondaryText} numberOfLines={2} style={styles.label}>{label}</AppText>
      </View>
      <AppText variant="label" color={t.colors.text} style={styles.value}>
        {formatQuantityNumber(quantity.completed, quantity.unit)}
        <AppText variant="caption" color={t.colors.secondaryText}> / {formatQuantityNumber(quantity.total, quantity.unit)}{quantity.unit ? ` ${quantity.unit}` : ''}</AppText>
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { width: '47%', flexGrow: 1, minHeight: 84, borderWidth: StyleSheet.hairlineWidth, borderRadius: 15, paddingHorizontal: 11, paddingVertical: 10, justifyContent: 'space-between' },
  top: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  icon: { width: 27, height: 27, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1, fontSize: 11, lineHeight: 14 },
  value: { fontSize: 18, lineHeight: 23, fontWeight: '700', marginLeft: 34 },
});

