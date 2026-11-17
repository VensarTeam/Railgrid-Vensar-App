import { ScrollView, StyleSheet, View } from 'react-native';
import { Activity, Building2, Construction, TrainFront, TriangleAlert } from 'lucide-react-native';
import { AppCard } from '../../components/AppCard';
import { AppScreen } from '../../components/AppScreen';
import { AppHeader } from '../../components/AppHeader';
import { AppText } from '../../components/AppText';
import { useTheme } from '../../hooks/useTheme';
const groups = [
  { label: 'Track segments', value: '124', icon: Activity },
  { label: 'Stations', value: '18', icon: Building2 },
  { label: 'Bridges & tunnels', value: '32', icon: Construction },
  { label: 'Rolling stock', value: '76', icon: TrainFront },
];
export function AssetsScreen() {
  const t = useTheme();
  return (
    <AppScreen>
      <ScrollView
        style={{ backgroundColor: t.colors.background }}
        contentContainerStyle={styles.content}
      >
        <AppHeader title="Assets" subtitle="Infrastructure inventory overview" />
        <View style={[styles.notice, { backgroundColor: `${t.colors.accent}20` }]}>
          <AppText variant="caption" color={t.colors.warning}>
            SAMPLE INVENTORY · DEMO DATA
          </AppText>
        </View>
        <View style={styles.grid}>
          {groups.map(({ label, value, icon: Icon }) => (
            <AppCard key={label} style={styles.asset}>
              <View style={[styles.icon, { backgroundColor: `${t.colors.secondary}18` }]}>
                <Icon size={20} color={t.colors.secondary} />
              </View>
              <AppText variant="heading">{value}</AppText>
              <AppText variant="bodySmall" color={t.colors.secondaryText}>
                {label}
              </AppText>
            </AppCard>
          ))}
        </View>
        <AppCard>
          <View style={styles.issue}>
            <TriangleAlert size={20} color={t.colors.warning} />
            <View style={styles.copy}>
              <AppText variant="subtitle">Maintenance due</AppText>
              <AppText variant="bodySmall" color={t.colors.secondaryText}>
                5 assets require scheduled inspection.
              </AppText>
            </View>
          </View>
        </AppCard>
      </ScrollView>
    </AppScreen>
  );
}
const styles = StyleSheet.create({
  content: { padding: 20, paddingTop: 28, paddingBottom: 32, gap: 16 },
  notice: { alignSelf: 'flex-start', padding: 10, borderRadius: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  asset: { width: '48%', gap: 6 },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  issue: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  copy: { flex: 1 },
});
