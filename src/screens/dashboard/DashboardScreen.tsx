import { ScrollView, StyleSheet, View } from 'react-native';
import { Bell, ChevronRight, CircleAlert, MapPinned, TrainTrack } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppCard } from '../../components/AppCard';
import { AppScreen } from '../../components/AppScreen';
import { AppText } from '../../components/AppText';
import { useTheme } from '../../hooks/useTheme';
import { demoMetrics, demoProjects, demoUpdates } from '../../constants/demoData';
import type { MainTabParamList } from '../../navigation/navigationTypes';
function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof TrainTrack;
}) {
  const t = useTheme();
  return (
    <AppCard style={styles.metric}>
      <View style={[styles.metricIcon, { backgroundColor: `${t.colors.secondary}18` }]}>
        <Icon size={18} color={t.colors.secondary} />
      </View>
      <AppText variant="heading">{value}</AppText>
      <AppText variant="caption" color={t.colors.secondaryText}>
        {label}
      </AppText>
    </AppCard>
  );
}
export function DashboardScreen() {
  const t = useTheme();
  const nav = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  return (
    <AppScreen>
      <ScrollView
        style={{ backgroundColor: t.colors.background }}
        contentContainerStyle={[styles.content, { paddingTop: t.spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <AppText variant="caption" color={t.colors.secondary}>
              RAILGRID · FIELD OPERATIONS
            </AppText>
            <AppText variant="heading">Good morning, Alex</AppText>
            <AppText variant="bodySmall" color={t.colors.secondaryText}>
              Here’s your network at a glance.
            </AppText>
          </View>
          <View
            style={[
              styles.bell,
              { backgroundColor: t.colors.surface, borderColor: t.colors.border },
            ]}
          >
            <Bell size={20} color={t.colors.text} />
          </View>
        </View>
        <View style={[styles.demoTag, { backgroundColor: `${t.colors.accent}20` }]}>
          <AppText variant="caption" color={t.colors.warning}>
            SAMPLE DATA · DEMO
          </AppText>
        </View>
        <View style={styles.metrics}>
          <Metric
            label="Active projects"
            value={`${demoMetrics.activeProjects}`}
            icon={TrainTrack}
          />
          <Metric label="Total sites" value={`${demoMetrics.totalSites}`} icon={MapPinned} />
        </View>
        <AppCard>
          <View style={styles.row}>
            <View>
              <AppText variant="subtitle">Network progress</AppText>
              <AppText variant="bodySmall" color={t.colors.secondaryText}>
                Across all active work sites
              </AppText>
            </View>
            <AppText variant="title" color={t.colors.secondary}>
              {demoMetrics.workProgress}%
            </AppText>
          </View>
          <View style={[styles.track, { backgroundColor: t.colors.border }]}>
            <View
              style={[
                styles.fill,
                { width: `${demoMetrics.workProgress}%`, backgroundColor: t.colors.secondary },
              ]}
            />
          </View>
          <View style={styles.row}>
            <AppText variant="caption" color={t.colors.secondaryText}>
              Overall completion
            </AppText>
            <AppText variant="caption" color={t.colors.secondaryText}>
              Updated today
            </AppText>
          </View>
        </AppCard>
        <AppCard>
          <View style={styles.issue}>
            <CircleAlert size={22} color={t.colors.warning} />
            <View style={styles.issueText}>
              <AppText variant="subtitle">Pending issues</AppText>
              <AppText variant="bodySmall" color={t.colors.secondaryText}>
                Items needing a site team update
              </AppText>
            </View>
            <AppText variant="title" color={t.colors.warning}>
              {demoMetrics.pendingIssues}
            </AppText>
          </View>
        </AppCard>
        <View style={styles.sectionHeader}>
          <AppText variant="title">Active projects</AppText>
          <AppText
            variant="label"
            color={t.colors.secondary}
            onPress={() => nav.navigate('Projects')}
          >
            See all
          </AppText>
        </View>
        {demoProjects.slice(0, 2).map((project) => (
          <AppCard key={project.id}>
            <View style={styles.projectRow}>
              <View style={styles.projectCopy}>
                <AppText variant="subtitle">{project.name}</AppText>
                <AppText variant="bodySmall" color={t.colors.secondaryText}>
                  {project.location}
                </AppText>
              </View>
              <ChevronRight size={20} color={t.colors.secondaryText} />
            </View>
            <View style={styles.row}>
              <AppText variant="caption" color={t.colors.secondaryText}>
                {project.status}
              </AppText>
              <AppText variant="caption" color={t.colors.secondary}>
                {project.progress}%
              </AppText>
            </View>
            <View style={[styles.track, { backgroundColor: t.colors.border }]}>
              <View
                style={[
                  styles.fill,
                  { width: `${project.progress}%`, backgroundColor: t.colors.secondary },
                ]}
              />
            </View>
          </AppCard>
        ))}
        <View style={styles.sectionHeader}>
          <AppText variant="title">Recent updates</AppText>
        </View>
        <AppCard>
          {demoUpdates.map((update, i) => (
            <View
              key={update.id}
              style={[
                styles.update,
                i > 0 && {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: t.colors.border,
                },
              ]}
            >
              <View style={[styles.dot, { backgroundColor: t.colors.secondary }]} />
              <View style={styles.projectCopy}>
                <AppText variant="label">{update.title}</AppText>
                <AppText variant="caption" color={t.colors.secondaryText}>
                  {update.detail}
                </AppText>
              </View>
            </View>
          ))}
        </AppCard>
      </ScrollView>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingBottom: 32, gap: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bell: {
    width: 44,
    height: 44,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  demoTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  metrics: { flexDirection: 'row', gap: 12 },
  metric: { flex: 1, gap: 5 },
  metricIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  track: { height: 7, borderRadius: 99, overflow: 'hidden', marginVertical: 12 },
  fill: { height: '100%', borderRadius: 99 },
  issue: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  issueText: { flex: 1 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  projectRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  projectCopy: { flex: 1, gap: 3 },
  update: { flexDirection: 'row', gap: 12, paddingVertical: 12, alignItems: 'center' },
  dot: { width: 8, height: 8, borderRadius: 8 },
});
