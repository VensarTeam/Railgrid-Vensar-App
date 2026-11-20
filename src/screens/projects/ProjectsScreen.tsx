import { useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, TextInput, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Search, X } from 'lucide-react-native';
import { AppCard } from '../../components/AppCard';
import { AppScreen } from '../../components/AppScreen';
import { AppText } from '../../components/AppText';
import { useDashboardQuery } from '../../hooks/useDashboardQuery';
import { useTheme } from '../../hooks/useTheme';
import type { DashboardProject } from '../../types/dashboard';
import { ProjectDetailSheet } from '../dashboard/components/ProjectDetailSheet';
import { ProjectSummaryCard } from '../dashboard/components/ProjectSummaryCard';
import { ProjectModuleSheet } from './ProjectModuleSheet';

export function ProjectsScreen() {
  const t = useTheme();
  const isFocused = useIsFocused();
  const query = useDashboardQuery();
  const [detailProject, setDetailProject] = useState<DashboardProject | null>(null);
  const [moduleProject, setModuleProject] = useState<DashboardProject | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const projects = query.data?.projects ?? [];
  const searchTerm = search.trim().toLocaleLowerCase();
  const visibleProjects = searchTerm
    ? projects.filter((project) => `${project.name} ${project.code}`.toLocaleLowerCase().includes(searchTerm))
    : projects;
  async function refresh() {
    setRefreshing(true);
    try { await query.refetch(); } finally { setRefreshing(false); }
  }
  return (
    <AppScreen>
      {isFocused ? <StatusBar barStyle={t.mode === 'dark' ? 'light-content' : 'dark-content'} /> : null}
      <ScrollView style={[styles.scroll, { backgroundColor: t.colors.background }]} contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { refresh().catch(() => undefined); }} tintColor={t.colors.secondary} />}>
        <View style={styles.header}>
          <AppText variant="heading" color={t.colors.text} style={styles.title}>Projects</AppText>
          {query.data ? <View style={[styles.count, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
            <AppText variant="caption" color={t.colors.secondaryText}>
              {searchTerm ? `${visibleProjects.length} found` : `${projects.length} assigned`}
            </AppText>
          </View> : null}
        </View>
        <View style={[styles.search, {
          backgroundColor: t.colors.surface,
          borderColor: searchFocused ? t.colors.secondary : t.colors.border,
        }, t.shadows.card]}>
          <View style={[styles.searchIcon, { backgroundColor: t.colors.background }]}>
            <Search color={t.colors.secondary} size={19} strokeWidth={2.1} />
          </View>
          <TextInput
            accessibilityLabel="Search projects"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            placeholder="Search by name or code"
            placeholderTextColor={t.colors.secondaryText}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            selectionColor={t.colors.secondary}
            style={[styles.searchInput, { color: t.colors.text }]}
          />
          {search.length > 0 ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Clear search" hitSlop={8}
              onPress={() => setSearch('')}
              style={[styles.clearSearch, { backgroundColor: t.colors.background }]}>
              <X color={t.colors.secondaryText} size={16} strokeWidth={2.2} />
            </Pressable>
          ) : null}
        </View>
        {query.isPending ? (
          <View style={styles.state}><ActivityIndicator color={t.colors.secondary} /><AppText variant="bodySmall" color={t.colors.secondaryText}>Loading projects…</AppText></View>
        ) : query.isError && !query.data ? (
          <AppCard style={styles.state}>
            <AppText variant="subtitle" color={t.colors.text}>Projects unavailable</AppText>
            <Pressable accessibilityRole="button" onPress={() => { query.refetch().catch(() => undefined); }}><AppText variant="label" color={t.colors.secondary}>Retry</AppText></Pressable>
          </AppCard>
        ) : projects.length === 0 ? (
          <AppCard style={styles.state}><AppText variant="subtitle" color={t.colors.text}>No projects assigned</AppText></AppCard>
        ) : visibleProjects.length === 0 ? (
          <AppCard style={styles.state}>
            <Search color={t.colors.secondaryText} size={25} strokeWidth={1.7} />
            <AppText variant="subtitle" color={t.colors.text}>No matching projects</AppText>
            <AppText variant="bodySmall" color={t.colors.secondaryText}>Try another name or project code.</AppText>
          </AppCard>
        ) : visibleProjects.map((project) => (
          <ProjectSummaryCard key={project.id} project={project} onOpen={() => setModuleProject(project)} onInfo={() => setDetailProject(project)} />
        ))}
      </ScrollView>
      <ProjectDetailSheet project={detailProject} onClose={() => setDetailProject(null)} />
      <ProjectModuleSheet project={moduleProject} onClose={() => setModuleProject(null)} />
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 18, paddingTop: 19, paddingBottom: 30, gap: 13 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  title: { fontWeight: '700' },
  count: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 20, paddingHorizontal: 11, paddingVertical: 6 },
  search: { minHeight: 56, borderWidth: 1, borderRadius: 18, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 9, gap: 10 },
  searchIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  searchInput: { flex: 1, minWidth: 0, paddingVertical: 0, fontSize: 15 },
  clearSearch: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 3 },
  state: { minHeight: 190, alignItems: 'center', justifyContent: 'center', gap: 10 },
});
