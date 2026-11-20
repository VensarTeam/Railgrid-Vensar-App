import { useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { CircleAlert, RotateCw } from 'lucide-react-native';
import { AppCard } from '../../components/AppCard';
import { AppScreen } from '../../components/AppScreen';
import { AppText } from '../../components/AppText';
import { useDashboardQuery } from '../../hooks/useDashboardQuery';
import { useTheme } from '../../hooks/useTheme';
import type { MainTabParamList } from '../../navigation/navigationTypes';
import type { DashboardActivity, DashboardProject } from '../../types/dashboard';
import { activityDate, activityTitle } from './dashboardModel';
import { ModuleProgressList } from './components/ModuleProgressList';
import { ModuleCarousel } from './components/ModuleCarousel';
import { PortfolioSummary } from './components/PortfolioSummary';
import { ProjectDetailSheet } from './components/ProjectDetailSheet';
import { ProjectSummaryCard } from './components/ProjectSummaryCard';
import { ProjectModuleSheet } from '../projects/ProjectModuleSheet';

function RecentActivity({ items }: { items: DashboardActivity[] }) {
  const t = useTheme();
  if (!items.length) return null;
  return (
    <>
      <AppText variant="subtitle" color={t.colors.text} style={styles.sectionTitle}>Recent activity</AppText>
      <AppCard style={styles.activityCard}>
        {items.slice(0, 3).map((item, index) => (
          <View key={item.id} style={[styles.activityRow, index > 0 && { borderTopColor: t.colors.border, borderTopWidth: StyleSheet.hairlineWidth }]}>
            <View style={[styles.activityDot, { backgroundColor: t.colors.secondary }]} />
            <View style={styles.activityCopy}>
              <AppText variant="label" color={t.colors.text} numberOfLines={1}>{activityTitle(item.action)}</AppText>
              <AppText variant="caption" color={t.colors.secondaryText} numberOfLines={1}>
                {item.projectName ? `${item.projectName} · ` : ''}{activityDate(item.createdAt)}
              </AppText>
            </View>
          </View>
        ))}
      </AppCard>
    </>
  );
}

export function DashboardScreen() {
  const t = useTheme();
  const isFocused = useIsFocused();
  const nav = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const query = useDashboardQuery();
  const [detailProject, setDetailProject] = useState<DashboardProject | null>(null);
  const [moduleProject, setModuleProject] = useState<DashboardProject | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [coverHeight, setCoverHeight] = useState(310);
  const [scrolledPastCover, setScrolledPastCover] = useState(false);
  const projects = query.data?.projects ?? [];
  async function refresh() {
    setRefreshing(true);
    try { await query.refetch(); } finally { setRefreshing(false); }
  }

  return (
    <AppScreen edges={[]}>
      {isFocused ? <StatusBar barStyle={scrolledPastCover && t.mode !== 'dark' ? 'dark-content' : 'light-content'} /> : null}
      <ScrollView
        style={[styles.scroll, { backgroundColor: t.colors.background }]}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={80}
        onScroll={(event) => {
          const past = event.nativeEvent.contentOffset.y > coverHeight - 55;
          setScrolledPastCover((current) => current === past ? current : past);
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { refresh().catch(() => undefined); }} tintColor={t.colors.secondary} />}
      >
        <View onLayout={(event) => setCoverHeight(event.nativeEvent.layout.height)}>
          <PortfolioSummary projects={projects} packages={query.data?.kpis.packages.total ?? 0}
            openNcrs={query.data?.kpis.openNcrs ?? 0} onProfile={() => nav.navigate('Profile')} />
        </View>
        <View style={styles.body}>
        {query.isPending ? (
          <View style={styles.state}>
            <ActivityIndicator color={t.colors.secondary} size="large" />
            <AppText variant="bodySmall" color={t.colors.secondaryText}>Loading dashboard…</AppText>
          </View>
        ) : query.isError && !query.data ? (
          <AppCard style={styles.state}>
            <CircleAlert color={t.colors.warning} size={25} />
            <AppText variant="subtitle" color={t.colors.text}>Dashboard unavailable</AppText>
            <AppText variant="bodySmall" color={t.colors.secondaryText} style={styles.stateMessage}>
              {query.error instanceof Error ? query.error.message : 'Check your connection.'}
            </AppText>
            <Pressable accessibilityRole="button" onPress={() => { query.refetch().catch(() => undefined); }}
              style={[styles.retry, { backgroundColor: t.colors.primary }]}>
              <RotateCw color="#FFFFFF" size={16} />
              <AppText variant="label" color="#FFFFFF">Retry</AppText>
            </Pressable>
          </AppCard>
        ) : !projects.length ? (
          <AppCard style={styles.state}>
            <AppText variant="subtitle" color={t.colors.text}>No projects assigned</AppText>
            <AppText variant="bodySmall" color={t.colors.secondaryText} style={styles.stateMessage}>
              Your dashboard will appear when a project is assigned to your account.
            </AppText>
          </AppCard>
        ) : (
          <>
            {query.isError ? <AppText variant="caption" color={t.colors.warning}>Showing saved data. Pull down to retry.</AppText> : null}
            <ModuleCarousel projects={projects} />
            <View style={styles.sectionHeader}>
              <AppText variant="subtitle" color={t.colors.text} style={styles.sectionTitle}>Work progress</AppText>
              <AppText variant="caption" color={t.colors.secondaryText}>Project average</AppText>
            </View>
            <ModuleProgressList compact modules={query.data?.moduleRollup ?? []} />
            <View style={styles.sectionHeader}>
              <AppText variant="subtitle" color={t.colors.text} style={styles.sectionTitle}>Projects</AppText>
              <AppText variant="caption" color={t.colors.secondaryText}>{projects.length} assigned</AppText>
            </View>
            {projects.map((project) => <ProjectSummaryCard compact key={project.id} project={project} onOpen={() => setModuleProject(project)} onInfo={() => setDetailProject(project)} />)}
            <RecentActivity items={query.data?.recentActivity ?? []} />
          </>
        )}
        </View>
      </ScrollView>
      <ProjectDetailSheet project={detailProject} onClose={() => setDetailProject(null)} />
      <ProjectModuleSheet project={moduleProject} onClose={() => setModuleProject(null)} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingBottom: 28 },
  body: { paddingHorizontal: 16, paddingTop: 15, gap: 10 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginTop: 7 },
  sectionTitle: { fontWeight: '700', marginTop: 5 },
  activityCard: { paddingHorizontal: 13, paddingVertical: 1, borderRadius: 16 },
  activityRow: { flexDirection: 'row', alignItems: 'center', minHeight: 53, gap: 10 },
  activityDot: { width: 8, height: 8, borderRadius: 4 },
  activityCopy: { flex: 1, gap: 1 },
  state: { minHeight: 210, alignItems: 'center', justifyContent: 'center', gap: 9, padding: 20 },
  stateMessage: { textAlign: 'center' },
  retry: { flexDirection: 'row', alignItems: 'center', gap: 7, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginTop: 4 },
});
