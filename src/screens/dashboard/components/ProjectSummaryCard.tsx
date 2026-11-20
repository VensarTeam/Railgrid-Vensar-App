import { Pressable, StyleSheet, View } from 'react-native';
import { Info, TrainTrack } from 'lucide-react-native';
import { AppCard } from '../../../components/AppCard';
import { AppText } from '../../../components/AppText';
import { useTheme } from '../../../hooks/useTheme';
import { brandColors } from '../../../theme/colors';
import type { DashboardProject } from '../../../types/dashboard';
import { formatProjectStatus, formatQuantity, progressOf } from '../dashboardModel';

export function ProjectSummaryCard({ project, onOpen, onInfo, compact = false }: { project: DashboardProject; onOpen: () => void; onInfo: () => void; compact?: boolean }) {
  const t = useTheme();
  const track = project.trackStatus;
  const total = track?.totalKm ?? project.trackLengthKm;
  const completed = track?.completedKm ?? null;
  const percent = total ? progressOf((completed ?? 0) / total * 100) : null;
  const progressPanelColor = t.mode === 'dark' ? `${brandColors.railBlue}18` : '#F1F8FC';
  const statusColor = ['active', 'published', 'in_progress'].includes(project.status?.toLowerCase() ?? '') ? t.colors.success : t.colors.secondaryText;

  return (
    <AppCard style={[styles.card, compact && styles.compactCard]}>
      <View style={styles.top}>
        <Pressable accessibilityRole="button" accessibilityLabel={`Choose module for ${project.name}`} onPress={onOpen}
          style={({ pressed }) => [styles.topMain, pressed && styles.pressed]}>
          <View style={[styles.icon, { backgroundColor: t.colors.primary }]}><TrainTrack color="#FFFFFF" size={22} strokeWidth={1.8} /></View>
          <View style={styles.copy}>
            <AppText variant="subtitle" color={t.colors.text} numberOfLines={2} style={styles.name}>{project.name}</AppText>
            <View style={styles.meta}>
              {project.status ? <View style={[styles.statusDot, { backgroundColor: statusColor }]} /> : null}
              <AppText variant="caption" color={t.colors.secondaryText} numberOfLines={1} style={styles.metaText}>
                {project.status ? `${formatProjectStatus(project.status)} · ` : ''}{project.packageCount ?? 0} packages
              </AppText>
            </View>
          </View>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={`Project details for ${project.name}`} hitSlop={8}
          onPress={onInfo}
          style={[styles.info, { backgroundColor: t.colors.background, borderColor: t.colors.border }]}>
          <Info color={t.colors.secondary} size={19} strokeWidth={2} />
        </Pressable>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Choose module for ${project.name}`} onPress={onOpen}
        style={({ pressed }) => [styles.progressPanel, compact && styles.compactProgressPanel, { backgroundColor: progressPanelColor }, pressed && styles.pressed]}>
        <View style={styles.progressHeading}>
          <AppText variant="caption" color={t.colors.secondaryText}>Track completed</AppText>
          <AppText variant="label" color={t.colors.text} style={styles.progressValue}>
            {formatQuantity(completed, 'km')} <AppText variant="caption" color={t.colors.secondaryText}>/ {formatQuantity(total, 'km')}</AppText>
          </AppText>
        </View>
        <View style={[styles.bar, { backgroundColor: t.colors.border }]}>
          {percent != null ? <View style={[styles.fill, { width: `${percent}%`, backgroundColor: t.colors.secondary }]} /> : null}
        </View>
      </Pressable>
    </AppCard>
  );
}

const styles = StyleSheet.create({
  pressed: { opacity: 0.9, transform: [{ scale: 0.995 }] },
  card: { padding: 15, borderRadius: 22 },
  compactCard: { padding: 13, borderRadius: 19 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  topMain: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 11 },
  icon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 4 },
  name: { fontWeight: '700', lineHeight: 22 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { flexShrink: 1 },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  info: { width: 34, height: 34, borderRadius: 12, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
  progressPanel: { borderRadius: 14, marginTop: 15, paddingHorizontal: 12, paddingVertical: 11 },
  compactProgressPanel: { marginTop: 12, paddingVertical: 9 },
  progressHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  progressValue: { fontWeight: '700', fontSize: 13 },
  bar: { height: 5, borderRadius: 5, overflow: 'hidden', marginTop: 10 },
  fill: { height: '100%', borderRadius: 5 },
});

