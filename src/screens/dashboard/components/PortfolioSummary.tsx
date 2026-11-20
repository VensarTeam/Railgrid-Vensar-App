import { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { UserRound } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../../components/AppText';
import { PhotoShade } from '../../../components/PhotoShade';
import { brandColors } from '../../../theme/colors';
import type { DashboardProject } from '../../../types/dashboard';
import { aggregateQuantities, aggregateTrackStatus, formatQuantity, progressOf } from '../dashboardModel';

const coverPhoto = require('../../../../assets/images/dashboard-cover.jpg');

export function PortfolioSummary({ projects, packages, openNcrs, onProfile }: {
  projects: DashboardProject[];
  packages: number;
  openNcrs: number;
  onProfile: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [coverSize, setCoverSize] = useState({ width: 0, height: 0 });
  const q = aggregateQuantities(projects);
  const status = aggregateTrackStatus(projects);
  const total = q.track.total;
  const complete = q.track.completed;
  const completePercent = total && complete != null ? progressOf(complete / total * 100) : null;
  const activePercent = total && status.inProgressKm != null ? progressOf(status.inProgressKm / total * 100) : null;
  return (
    <View style={[styles.cover, { paddingTop: insets.top + 11 }, !projects.length && styles.coverEmpty]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setCoverSize((current) => current.width === width && current.height === height ? current : { width, height });
      }}>
      {coverSize.height > 0 ? <Image source={coverPhoto} resizeMode="cover"
        style={[styles.coverImage, { width: Math.max(coverSize.width, coverSize.height * 2.5), height: coverSize.height }]} /> : null}
      <PhotoShade id="dashboard-cover-shade" topOpacity={0.46} bottomOpacity={0.92} />
      <View style={styles.header}>
        <View>
          <AppText variant="heading" color="#FFFFFF" style={styles.heading}>Dashboard</AppText>
          <AppText variant="caption" color="#D9EAF4">All assigned projects</AppText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel="Open profile" onPress={onProfile} hitSlop={8} style={styles.avatar}>
          <UserRound color="#FFFFFF" size={20} />
        </Pressable>
      </View>
      {projects.length ? (
        <View style={styles.glass}>
          <View style={styles.trackTop}>
            <AppText variant="caption" color="#E5F2FA" style={styles.overline}>TRACK PROGRESS</AppText>
            <View style={styles.percent}><AppText variant="label" color="#FFFFFF">{completePercent == null ? '—' : `${completePercent}%`}</AppText></View>
          </View>
          <View style={styles.figure}>
            <AppText variant="heading" color="#FFFFFF" style={styles.completed}>{formatQuantity(complete, 'km')}</AppText>
            <AppText variant="bodySmall" color="#D9EAF4">of {formatQuantity(total, 'km')}</AppText>
          </View>
          <View style={styles.bar}>
            {completePercent != null ? <View style={[styles.completeFill, { width: `${completePercent}%` }]} /> : null}
            {activePercent != null ? <View style={[styles.activeFill, { width: `${activePercent}%` }]} /> : null}
          </View>
          <View style={styles.trackFooter}>
            <AppText variant="caption" color="#E5F2FA">In progress  {formatQuantity(status.inProgressKm, 'km')}</AppText>
            <AppText variant="caption" color="#E5F2FA">Pending  {formatQuantity(status.pendingKm, 'km')}</AppText>
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}><AppText variant="subtitle" color="#FFFFFF" style={styles.statValue}>{projects.length}</AppText><AppText variant="caption" color="#D9EAF4">Projects</AppText></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><AppText variant="subtitle" color="#FFFFFF" style={styles.statValue}>{packages}</AppText><AppText variant="caption" color="#D9EAF4">Packages</AppText></View>
            <View style={styles.statDivider} />
            <View style={styles.stat}><AppText variant="subtitle" color="#FFFFFF" style={styles.statValue}>{openNcrs}</AppText><AppText variant="caption" color="#D9EAF4">Open NCRs</AppText></View>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { width: '100%', paddingHorizontal: 16, paddingBottom: 19, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden', backgroundColor: brandColors.navy900 },
  coverEmpty: { paddingBottom: 36 },
  coverImage: { position: 'absolute', top: 0, right: 0 },
  header: { minHeight: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  heading: { fontSize: 24, lineHeight: 30 },
  avatar: { width: 40, height: 40, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.38)', alignItems: 'center', justifyContent: 'center' },
  glass: { marginTop: 18, paddingHorizontal: 15, paddingTop: 11, paddingBottom: 10, borderRadius: 20, backgroundColor: 'rgba(12,48,73,0.53)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.43)', shadowColor: '#061C2D', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 8 }, shadowRadius: 18 },
  trackTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  overline: { fontWeight: '700', letterSpacing: 1.1, fontSize: 10 },
  percent: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 9, paddingHorizontal: 9, paddingVertical: 3 },
  figure: { flexDirection: 'row', alignItems: 'baseline', gap: 7, marginTop: 1 },
  completed: { fontSize: 25, lineHeight: 30 },
  bar: { height: 5, borderRadius: 5, overflow: 'hidden', flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.28)', marginTop: 7 },
  completeFill: { height: '100%', backgroundColor: '#64D699' },
  activeFill: { height: '100%', backgroundColor: brandColors.saffron },
  trackFooter: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 7, marginTop: 7 },
  stats: { flexDirection: 'row', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.38)', marginTop: 9, paddingTop: 8 },
  stat: { flex: 1, alignItems: 'center', gap: 0 },
  statValue: { fontWeight: '700', lineHeight: 20 },
  statDivider: { height: 26, width: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.3)' },
});
