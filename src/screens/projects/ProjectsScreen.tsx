import { ScrollView, StyleSheet, View } from 'react-native';
import { ClipboardList, MapPin } from 'lucide-react-native';
import { AppCard } from '../../components/AppCard';
import { AppScreen } from '../../components/AppScreen';
import { AppHeader } from '../../components/AppHeader';
import { AppText } from '../../components/AppText';
import { useTheme } from '../../hooks/useTheme';
import { demoProjects } from '../../constants/demoData';
export function ProjectsScreen() {
  const t = useTheme();
  return (
    <AppScreen>
      <ScrollView
        style={{ backgroundColor: t.colors.background }}
        contentContainerStyle={styles.content}
      >
        <AppHeader title="Projects" subtitle="Delivery progress across your network" />
        <View style={[styles.notice, { backgroundColor: `${t.colors.accent}20` }]}>
          <ClipboardList size={18} color={t.colors.warning} />
          <AppText variant="caption" color={t.colors.warning}>
            SAMPLE PROJECTS · DEMO DATA
          </AppText>
        </View>
        {demoProjects.map((p) => (
          <AppCard key={p.id}>
            <View style={styles.row}>
              <View style={[styles.icon, { backgroundColor: `${t.colors.secondary}18` }]}>
                <ClipboardList size={20} color={t.colors.secondary} />
              </View>
              <View style={styles.copy}>
                <AppText variant="subtitle">{p.name}</AppText>
                <View style={styles.location}>
                  <MapPin size={14} color={t.colors.secondaryText} />
                  <AppText variant="caption" color={t.colors.secondaryText}>
                    {p.location}
                  </AppText>
                </View>
              </View>
            </View>
            <View style={styles.row}>
              <AppText variant="caption" color={t.colors.secondaryText}>
                {p.status}
              </AppText>
              <AppText variant="label" color={t.colors.secondary}>
                {p.progress}% complete
              </AppText>
            </View>
            <View style={[styles.track, { backgroundColor: t.colors.border }]}>
              <View
                style={[
                  styles.fill,
                  { backgroundColor: t.colors.secondary, width: `${p.progress}%` },
                ]}
              />
            </View>
          </AppCard>
        ))}
      </ScrollView>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  content: { padding: 20, paddingTop: 28, paddingBottom: 32, gap: 16 },
  notice: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  icon: { width: 42, height: 42, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  copy: { flex: 1, gap: 6, marginBottom: 16 },
  location: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  track: { height: 7, borderRadius: 99, overflow: 'hidden', marginTop: 12 },
  fill: { height: '100%', borderRadius: 99 },
});
