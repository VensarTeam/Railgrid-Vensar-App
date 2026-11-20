import { useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { ChevronRight, FolderKanban, Info, Layers3, LogOut, Mail, Monitor, Moon, Phone, RotateCw, ShieldCheck, Sun, type LucideIcon } from 'lucide-react-native';
import { AppScreen } from '../../components/AppScreen';
import { AppText } from '../../components/AppText';
import { useProfileQuery } from '../../hooks/useProfileQuery';
import { useTheme } from '../../hooks/useTheme';
import type { MainTabParamList } from '../../navigation/navigationTypes';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import type { ThemeMode } from '../../theme';
import { ProfileCover } from './components/ProfileCover';

const appearanceOptions: { mode: ThemeMode; label: string; icon: LucideIcon }[] = [
  { mode: 'system', label: 'System', icon: Monitor },
  { mode: 'light', label: 'Light', icon: Sun },
  { mode: 'dark', label: 'Dark', icon: Moon },
];

function DetailRow({ label, value, icon: Icon, last = false }: { label: string; value: string; icon: LucideIcon; last?: boolean }) {
  const t = useTheme();
  return (
    <View style={[styles.detailRow, !last && { borderBottomColor: t.colors.border, borderBottomWidth: StyleSheet.hairlineWidth }]}>
      <View style={[styles.detailIcon, { backgroundColor: t.colors.background }]}><Icon color={t.colors.secondary} size={19} strokeWidth={1.8} /></View>
      <View style={styles.detailCopy}>
        <AppText variant="caption" color={t.colors.secondaryText}>{label}</AppText>
        <AppText variant="body" color={t.colors.text} numberOfLines={2} style={styles.detailValue}>{value}</AppText>
      </View>
    </View>
  );
}

export function ProfileScreen() {
  const t = useTheme();
  const isFocused = useIsFocused();
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParamList>>();
  const sessionUser = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const mode = useThemeStore((state) => state.mode);
  const setMode = useThemeStore((state) => state.setMode);
  const query = useProfileQuery(sessionUser?.id);
  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [actionError, setActionError] = useState('');
  const [coverHeight, setCoverHeight] = useState(285);
  const [scrolledPastCover, setScrolledPastCover] = useState(false);
  const user = query.data ?? sessionUser;
  const accessScope = query.data?.accessScope;
  const packageCount = accessScope ? accessScope.reduce((count, project) => count + (project.packages?.length ?? 0), 0) : null;

  async function refresh() {
    setRefreshing(true);
    try { await query.refetch(); } finally { setRefreshing(false); }
  }

  async function handleSignOut() {
    if (signingOut) return;
    setActionError('');
    setSigningOut(true);
    try { await signOut(); }
    catch { setActionError('Could not sign out. Please try again.'); }
    finally { setSigningOut(false); }
  }

  return (
    <AppScreen edges={[]}>
      {isFocused ? <StatusBar barStyle={scrolledPastCover && t.mode !== 'dark' ? 'dark-content' : 'light-content'} /> : null}
      <ScrollView style={[styles.scroll, { backgroundColor: t.colors.background }]}
        contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}
        scrollEventThrottle={80}
        onScroll={(event) => {
          const past = event.nativeEvent.contentOffset.y > coverHeight - 55;
          setScrolledPastCover((current) => current === past ? current : past);
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { refresh().catch(() => undefined); }} tintColor={t.colors.secondary} />}>
        <View onLayout={(event) => setCoverHeight(event.nativeEvent.layout.height)}>
          <ProfileCover key={user?.profileUrl ?? user?.id ?? 'profile'} user={user} />
        </View>

        <View style={styles.body}>
          {query.isError ? <View style={[styles.retryBanner, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
            <Info color={t.colors.secondaryText} size={18} />
            <AppText variant="bodySmall" color={t.colors.secondaryText} style={styles.retryText}>Profile could not refresh.</AppText>
            <Pressable accessibilityRole="button" accessibilityLabel="Retry profile" onPress={() => { query.refetch().catch(() => undefined); }} hitSlop={8}>
              <RotateCw color={t.colors.secondary} size={18} />
            </Pressable>
          </View> : null}

          <AppText variant="subtitle" color={t.colors.text} style={styles.sectionTitle}>Account</AppText>
          <View style={[styles.group, { backgroundColor: t.colors.surface, borderColor: t.colors.border }, t.shadows.card]}>
            {user?.mobile ? <DetailRow label="Mobile number" value={user.mobile} icon={Phone} /> : null}
            {user?.email ? <DetailRow label="Email address" value={user.email} icon={Mail} last={!user?.role} /> : null}
            {user?.role ? <DetailRow label="Role" value={user.role.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase())} icon={ShieldCheck} last /> : null}
          </View>

          <AppText variant="subtitle" color={t.colors.text} style={styles.sectionTitle}>Workspace</AppText>
          <Pressable accessibilityRole="button" accessibilityLabel="View projects" onPress={() => navigation.navigate('Projects')}
            style={[styles.workspaceCard, { backgroundColor: t.colors.surface, borderColor: t.colors.border }, t.shadows.card]}>
            <View style={styles.workspaceTop}>
              <View style={[styles.workspaceIcon, { backgroundColor: t.colors.background }]}><FolderKanban color={t.colors.secondary} size={21} strokeWidth={1.8} /></View>
              <View style={styles.workspaceCopy}>
                <AppText variant="label" color={t.colors.text} style={styles.workspaceTitle}>Your access</AppText>
                <AppText variant="caption" color={t.colors.secondaryText}>Projects and packages</AppText>
              </View>
              <ChevronRight color={t.colors.secondaryText} size={20} />
            </View>
            <View style={[styles.workspaceStats, { borderTopColor: t.colors.border }]}>
              <View style={styles.workspaceStat}>
                <AppText variant="title" color={t.colors.text} style={styles.statValue}>{accessScope ? accessScope.length : '—'}</AppText>
                <AppText variant="caption" color={t.colors.secondaryText}>Projects</AppText>
              </View>
              <View style={[styles.statDivider, { backgroundColor: t.colors.border }]} />
              <View style={styles.workspaceStat}>
                <AppText variant="title" color={t.colors.text} style={styles.statValue}>{packageCount ?? '—'}</AppText>
                <AppText variant="caption" color={t.colors.secondaryText}>Packages</AppText>
              </View>
              <Layers3 color={t.colors.secondary} size={19} style={styles.statAccent} />
            </View>
          </Pressable>

          <AppText variant="subtitle" color={t.colors.text} style={styles.sectionTitle}>Appearance</AppText>
          <View style={[styles.appearanceCard, { backgroundColor: t.colors.surface, borderColor: t.colors.border }, t.shadows.card]}>
            <View style={styles.appearanceHeader}>
              <View style={[styles.appearanceIcon, { backgroundColor: t.colors.background }]}><Sun color={t.colors.secondary} size={19} strokeWidth={1.8} /></View>
              <AppText variant="label" color={t.colors.text} style={styles.appearanceName}>Theme</AppText>
            </View>
            <View style={[styles.segmented, { backgroundColor: t.colors.background }]}>
              {appearanceOptions.map(({ mode: option, label, icon: Icon }) => {
                const selected = mode === option;
                return <Pressable key={option} accessibilityRole="button" accessibilityLabel={`${label} theme`}
                  accessibilityState={{ selected }} onPress={() => { setMode(option).catch(() => undefined); }}
                  style={[styles.segment, selected && { backgroundColor: t.colors.surface, borderColor: t.colors.border, borderWidth: StyleSheet.hairlineWidth }]}>
                  <Icon color={selected ? t.colors.secondary : t.colors.secondaryText} size={16} />
                  <AppText variant="caption" color={selected ? t.colors.text : t.colors.secondaryText} style={selected && styles.segmentSelected}>{label}</AppText>
                </Pressable>;
              })}
            </View>
          </View>

          <Pressable accessibilityRole="button" accessibilityLabel="Sign out" disabled={signingOut}
            onPress={() => { handleSignOut().catch(() => undefined); }}
            style={[styles.signOut, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
            <LogOut color={t.colors.error} size={19} />
            <AppText variant="label" color={t.colors.error} style={styles.signOutLabel}>Sign out</AppText>
            {signingOut ? <ActivityIndicator color={t.colors.error} size="small" /> : <ChevronRight color={t.colors.secondaryText} size={18} />}
          </Pressable>
          {actionError ? <AppText variant="caption" color={t.colors.error} style={styles.actionError}>{actionError}</AppText> : null}
          <AppText variant="caption" color={t.colors.secondaryText} style={styles.footer}>RailGrid by Vensar · v1.0.0</AppText>
        </View>
      </ScrollView>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingBottom: 24 },
  body: { paddingHorizontal: 16, paddingTop: 18, gap: 10 },
  sectionTitle: { fontWeight: '700', marginTop: 5, marginBottom: 1 },
  group: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 19, paddingHorizontal: 15 },
  detailRow: { minHeight: 67, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11 },
  detailIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  detailCopy: { flex: 1, gap: 1 },
  detailValue: { fontWeight: '600', lineHeight: 20 },
  workspaceCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 19, padding: 15 },
  workspaceTop: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  workspaceIcon: { width: 41, height: 41, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  workspaceCopy: { flex: 1, gap: 1 },
  workspaceTitle: { fontWeight: '700' },
  workspaceStats: { flexDirection: 'row', alignItems: 'center', borderTopWidth: StyleSheet.hairlineWidth, marginTop: 14, paddingTop: 12 },
  workspaceStat: { flex: 1, gap: 2 },
  statValue: { fontWeight: '700', lineHeight: 24 },
  statDivider: { height: 28, width: StyleSheet.hairlineWidth, marginRight: 15 },
  statAccent: { opacity: 0.7, marginRight: 4 },
  appearanceCard: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 19, padding: 14 },
  appearanceHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 13 },
  appearanceIcon: { width: 36, height: 36, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  appearanceName: { fontWeight: '700' },
  segmented: { flexDirection: 'row', borderRadius: 13, padding: 4 },
  segment: { flex: 1, minHeight: 36, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderRadius: 10 },
  segmentSelected: { fontWeight: '700' },
  signOut: { flexDirection: 'row', alignItems: 'center', minHeight: 53, gap: 11, borderWidth: StyleSheet.hairlineWidth, borderRadius: 16, paddingHorizontal: 15, marginTop: 8 },
  signOutLabel: { flex: 1, fontWeight: '700' },
  retryBanner: { flexDirection: 'row', alignItems: 'center', gap: 9, borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9 },
  retryText: { flex: 1 },
  actionError: { textAlign: 'center' },
  footer: { textAlign: 'center', marginTop: 6 },
});
