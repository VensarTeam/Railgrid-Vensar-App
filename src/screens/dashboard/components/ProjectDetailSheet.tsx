import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, PanResponder, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Building2, Construction, Signpost, TrainTrack, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../../components/AppText';
import { useTheme } from '../../../hooks/useTheme';
import { brandColors } from '../../../theme/colors';
import type { DashboardProject } from '../../../types/dashboard';
import { formatProjectStatus, formatQuantity, progressOf, projectQuantities } from '../dashboardModel';
import { ModuleProgressList } from './ModuleProgressList';
import { QuantityTile } from './QuantityTile';

export function ProjectDetailSheet({ project, onClose }: { project: DashboardProject | null; onClose: () => void }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [presentedProject, setPresentedProject] = useState<DashboardProject | null>(null);
  const translateY = useRef(new Animated.Value(height)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const closing = useRef(false);

  useEffect(() => {
    if (!project) return;
    closing.current = false;
    translateY.setValue(height);
    backdropOpacity.setValue(0);
    setPresentedProject(project);
  }, [project, height, translateY, backdropOpacity]);

  useEffect(() => {
    if (!presentedProject || !project) return;
    Animated.parallel([
      Animated.spring(translateY, { toValue: 0, damping: 25, stiffness: 230, mass: 0.9, useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
    ]).start();
  }, [presentedProject, project, translateY, backdropOpacity]);

  const dismiss = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    Animated.parallel([
      Animated.timing(translateY, { toValue: height, duration: 260, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
      Animated.timing(backdropOpacity, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) {
        setPresentedProject(null);
        onClose();
      }
      closing.current = false;
    });
  }, [backdropOpacity, height, onClose, translateY]);

  const panResponder = useMemo(() => PanResponder.create({
    onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 6,
    onPanResponderMove: (_, gesture) => {
      translateY.setValue(Math.max(0, gesture.dy));
      backdropOpacity.setValue(Math.max(0, 1 - gesture.dy / Math.max(height, 1)));
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dy > 110 || gesture.vy > 0.85) {
        dismiss();
      } else {
        Animated.parallel([
          Animated.spring(translateY, { toValue: 0, damping: 24, stiffness: 240, useNativeDriver: true }),
          Animated.timing(backdropOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        ]).start();
      }
    },
  }), [backdropOpacity, dismiss, height, translateY]);

  const activeProject = presentedProject;
  const q = activeProject ? projectQuantities(activeProject) : null;
  const track = activeProject?.trackStatus;
  const percent = q?.track.total ? progressOf((q.track.completed ?? 0) / q.track.total * 100) : null;
  const trackCardColor = t.mode === 'dark' ? t.colors.background : '#F0F8FC';

  return (
    <Modal visible={!!activeProject} transparent animationType="none" onRequestClose={dismiss} statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable accessibilityLabel="Close project details" onPress={dismiss} style={StyleSheet.absoluteFill} />
      </Animated.View>
      {activeProject && q ? (
        <Animated.View style={[styles.sheet, { backgroundColor: t.colors.surface, maxHeight: height * 0.88, paddingBottom: Math.max(insets.bottom, 12), transform: [{ translateY }] }]}>
          <View style={styles.grabArea} {...panResponder.panHandlers}>
            <View style={[styles.handle, { backgroundColor: t.colors.border }]} />
          </View>
          <View style={styles.header}>
            <View style={[styles.headerIcon, { backgroundColor: t.mode === 'dark' ? t.colors.background : brandColors.skyBlueSoft }]}>
              <TrainTrack color={t.colors.secondary} size={23} strokeWidth={1.8} />
            </View>
            <View style={styles.heading}>
              <AppText variant="title" color={t.colors.text} numberOfLines={2} style={styles.projectName}>{activeProject.name}</AppText>
              <AppText variant="caption" color={t.colors.secondaryText}>
                {activeProject.packageCount ?? 0} packages{activeProject.status ? ` · ${formatProjectStatus(activeProject.status)}` : ''}
              </AppText>
            </View>
            <Pressable accessibilityRole="button" accessibilityLabel="Close project details" onPress={dismiss}
              style={[styles.close, { backgroundColor: t.colors.background }]}>
              <X color={t.colors.secondaryText} size={19} />
            </Pressable>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.body}>
            <View style={[styles.trackCard, { backgroundColor: trackCardColor, borderColor: t.colors.border }]}>
              <AppText variant="caption" color={t.colors.secondaryText} style={styles.trackLabel}>TRACK COMPLETED</AppText>
              <View style={styles.trackValueRow}>
                <AppText variant="heading" color={t.colors.text} style={styles.trackValue}>{formatQuantity(q.track.completed, 'km')}</AppText>
                <AppText variant="bodySmall" color={t.colors.secondaryText}>of {formatQuantity(q.track.total, 'km')}</AppText>
              </View>
              <View style={[styles.bar, { backgroundColor: t.colors.border }]}>
                {percent != null ? <View style={[styles.fill, { width: `${percent}%`, backgroundColor: t.colors.secondary }]} /> : null}
              </View>
              <View style={[styles.trackBreakdown, { borderTopColor: t.colors.border }]}>
                <View style={styles.breakdownItem}>
                  <AppText variant="caption" color={t.colors.secondaryText}>In progress</AppText>
                  <AppText variant="label" color={t.colors.text} style={styles.breakdownValue}>{formatQuantity(track?.inProgressKm ?? null, 'km')}</AppText>
                </View>
                <View style={[styles.breakdownDivider, { backgroundColor: t.colors.border }]} />
                <View style={styles.breakdownItem}>
                  <AppText variant="caption" color={t.colors.secondaryText}>Pending</AppText>
                  <AppText variant="label" color={t.colors.text} style={styles.breakdownValue}>{formatQuantity(track?.pendingKm ?? null, 'km')}</AppText>
                </View>
              </View>
            </View>
            <View style={styles.sectionHeader}>
              <AppText variant="subtitle" color={t.colors.text} style={styles.sectionTitle}>Structures</AppText>
              <AppText variant="caption" color={t.colors.secondaryText}>Completed / total</AppText>
            </View>
            <View style={styles.grid}>
              <QuantityTile label="Stations" icon={Building2} color="#DB5A4B" quantity={q.stations} />
              <QuantityTile label="Major bridges" icon={Construction} color={brandColors.railBlue} quantity={q.majorBridges} />
              <QuantityTile label="Minor bridges" icon={Construction} color="#637BC6" quantity={q.minorBridges} />
              <QuantityTile label="Road under bridges" icon={Construction} color="#278C76" quantity={q.roadUnderBridges} />
              <QuantityTile label="Foot over bridges" icon={Construction} color="#8764C9" quantity={q.footOverBridges} />
              <QuantityTile label="Level crossings" icon={Signpost} color={brandColors.saffron} quantity={q.crossings} />
            </View>
            <View style={styles.sectionHeader}>
              <AppText variant="subtitle" color={t.colors.text} style={styles.sectionTitle}>Work progress</AppText>
            </View>
            <ModuleProgressList modules={activeProject.modules ?? []} />
          </ScrollView>
        </Animated.View>
      ) : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(5, 22, 38, 0.44)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 620, alignSelf: 'center', width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  grabArea: { height: 27, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 9 },
  handle: { width: 36, height: 4, borderRadius: 4 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 5, paddingBottom: 18, gap: 11 },
  headerIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heading: { flex: 1, gap: 3 },
  projectName: { fontWeight: '700', lineHeight: 27 },
  close: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: 20, paddingBottom: 22 },
  trackCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 20, padding: 17 },
  trackLabel: { fontWeight: '700', letterSpacing: 0.6, fontSize: 11 },
  trackValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 7 },
  trackValue: { fontWeight: '700', fontSize: 30, lineHeight: 36 },
  bar: { height: 6, borderRadius: 6, overflow: 'hidden', marginTop: 13 },
  fill: { height: '100%', borderRadius: 6 },
  trackBreakdown: { flexDirection: 'row', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, marginTop: 15, paddingTop: 13 },
  breakdownItem: { flex: 1, gap: 3 },
  breakdownValue: { fontWeight: '700' },
  breakdownDivider: { width: StyleSheet.hairlineWidth, height: 29, marginHorizontal: 18 },
  sectionHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginTop: 22, marginBottom: 10 },
  sectionTitle: { fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 9 },
  codeRow: { borderTopWidth: StyleSheet.hairlineWidth, marginTop: 21, paddingTop: 15, gap: 4 },
  code: { fontWeight: '600' },
});

