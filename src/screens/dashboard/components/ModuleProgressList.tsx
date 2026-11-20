import { StyleSheet, View } from 'react-native';
import { RadioTower, TrainTrack, Zap, type LucideIcon } from 'lucide-react-native';
import { AppCard } from '../../../components/AppCard';
import { AppText } from '../../../components/AppText';
import { useTheme } from '../../../hooks/useTheme';
import { brandColors } from '../../../theme/colors';
import type { DashboardModule } from '../../../types/dashboard';
import { progressOf } from '../dashboardModel';

const rows: { key: string; label: string; icon: LucideIcon; color: string }[] = [
  { key: 'civil', label: 'Civil works', icon: TrainTrack, color: brandColors.railBlue },
  { key: 'signal_telecommunication', label: 'S&T', icon: RadioTower, color: '#268A79' },
  { key: 'electrical', label: 'Electrical', icon: Zap, color: '#CA7B32' },
];

export function ModuleProgressList({ modules, compact = false }: { modules: DashboardModule[]; compact?: boolean }) {
  const t = useTheme();
  return (
    <AppCard style={[styles.card, compact && styles.compactCard]}>
      {rows.filter((row) => row.key !== 'electrical' || modules.some((item) => item.moduleKey === 'electrical' && (item.workPackages ?? 0) > 0)).map(({ key, label, icon: Icon, color }, index) => {
        const module = modules.find((item) => item.moduleKey === key);
        const progress = progressOf(module?.progress ?? module?.averageProgress);
        return (
          <View key={key} style={[styles.row, compact && styles.compactRow, index > 0 && { borderTopColor: t.colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
            <View style={styles.main}>
              <View style={[styles.icon, compact && styles.compactIcon, { backgroundColor: `${color}16` }]}><Icon color={color} size={compact ? 17 : 19} /></View>
              <View style={styles.copy}>
                <AppText variant="label" color={t.colors.text} style={styles.name}>{label}</AppText>
                <AppText variant="caption" color={t.colors.secondaryText}>
                  {module ? `${module.workPackages ?? 0} packages` : 'Not configured'}
                </AppText>
              </View>
              <AppText variant="subtitle" color={progress == null ? t.colors.secondaryText : color}>
                {progress == null ? '—' : `${progress}%`}
              </AppText>
            </View>
            <View style={[styles.track, compact && styles.compactTrack, { backgroundColor: t.colors.border }]}>
              {progress != null ? <View style={[styles.fill, { width: `${progress}%`, backgroundColor: color }]} /> : null}
            </View>
          </View>
        );
      })}
    </AppCard>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 18, paddingHorizontal: 15, paddingVertical: 2 },
  compactCard: { paddingHorizontal: 13, paddingVertical: 0 },
  row: { paddingVertical: 13 },
  compactRow: { paddingVertical: 10 },
  main: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { width: 37, height: 37, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  compactIcon: { width: 31, height: 31, borderRadius: 9 },
  copy: { flex: 1, gap: 2 },
  name: { fontWeight: '700' },
  track: { height: 5, borderRadius: 5, overflow: 'hidden', marginTop: 10 },
  compactTrack: { height: 4, marginTop: 7 },
  fill: { height: '100%', borderRadius: 5 },
});
