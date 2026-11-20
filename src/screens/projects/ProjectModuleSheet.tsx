import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Modal, PanResponder, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Check, Layers3, RadioTower, TrainTrack, X, Zap, type LucideIcon } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../components/AppText';
import { useTheme } from '../../hooks/useTheme';
import { brandColors } from '../../theme/colors';
import type { DashboardProject } from '../../types/dashboard';

type ModuleOption = { key: string; title: string; description: string; icon: LucideIcon; color: string };

const moduleOptions: ModuleOption[] = [
  { key: 'civil', title: 'Rail Track Work', description: 'Track, bridges & stations', icon: TrainTrack, color: brandColors.railBlue },
  { key: 'signal_telecommunication', title: 'Signal & Telecommunication', description: 'Signals & communication', icon: RadioTower, color: '#268A79' },
  { key: 'electrical', title: 'Electrical', description: 'Power & overhead equipment', icon: Zap, color: '#C77B32' },
];

export function ProjectModuleSheet({ project, onClose }: { project: DashboardProject | null; onClose: () => void }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [presentedProject, setPresentedProject] = useState<DashboardProject | null>(null);
  const [selectedByProject, setSelectedByProject] = useState<Record<string, string>>({});
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
      if (gesture.dy > 110 || gesture.vy > 0.85) dismiss();
      else Animated.parallel([
        Animated.spring(translateY, { toValue: 0, damping: 24, stiffness: 240, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      ]).start();
    },
  }), [backdropOpacity, dismiss, height, translateY]);

  const activeProject = presentedProject;
  const selectedKey = activeProject ? selectedByProject[activeProject.id] : undefined;
  const rowColor = t.mode === 'dark' ? t.colors.background : '#F6F9FC';

  return (
    <Modal visible={!!activeProject} transparent animationType="none" onRequestClose={dismiss} statusBarTranslucent>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable accessibilityLabel="Close module chooser" onPress={dismiss} style={StyleSheet.absoluteFill} />
      </Animated.View>
      {activeProject ? <Animated.View style={[styles.sheet, { backgroundColor: t.colors.surface, maxHeight: height * 0.86, paddingBottom: Math.max(insets.bottom, 13), transform: [{ translateY }] }]}>
        <View style={styles.grabArea} {...panResponder.panHandlers}>
          <View style={[styles.handle, { backgroundColor: t.colors.border }]} />
        </View>
        <View style={styles.header}>
          <View style={[styles.headerIcon, { backgroundColor: t.colors.primary }]}><Layers3 color="#FFFFFF" size={22} strokeWidth={1.8} /></View>
          <View style={styles.heading}>
            <AppText variant="title" color={t.colors.text} style={styles.title}>Choose module</AppText>
            <AppText variant="caption" color={t.colors.secondaryText} numberOfLines={1}>{activeProject.name}</AppText>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="Close module chooser" hitSlop={8} onPress={dismiss}
            style={[styles.close, { backgroundColor: t.colors.background }]}><X color={t.colors.secondaryText} size={19} /></Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.options} showsVerticalScrollIndicator={false}>
          {moduleOptions.map((option) => {
            const Icon = option.icon;
            const selected = selectedKey === option.key;
            return <Pressable key={option.key} accessibilityRole="button" accessibilityLabel={option.title}
              accessibilityState={{ selected }} onPress={() => setSelectedByProject((current) => ({ ...current, [activeProject.id]: option.key }))}
              style={({ pressed }) => [styles.option, { backgroundColor: selected ? `${option.color}0D` : rowColor, borderColor: selected ? option.color : t.colors.border }, pressed && styles.pressed]}>
              <View style={[styles.optionIcon, { backgroundColor: `${option.color}18` }]}><Icon color={option.color} size={23} strokeWidth={1.8} /></View>
              <View style={styles.optionCopy}>
                <AppText variant="subtitle" color={t.colors.text} numberOfLines={1} style={styles.optionTitle}>{option.title}</AppText>
                <AppText variant="caption" color={t.colors.secondaryText} numberOfLines={1}>{option.description}</AppText>
              </View>
              <View style={[styles.selection, { borderColor: selected ? option.color : t.colors.border, backgroundColor: selected ? option.color : t.colors.surface }]}>
                {selected ? <Check color="#FFFFFF" size={14} strokeWidth={2.5} /> : null}
              </View>
            </Pressable>;
          })}
        </ScrollView>
      </Animated.View> : null}
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(5, 22, 38, 0.44)' },
  sheet: { position: 'absolute', bottom: 0, left: 0, right: 0, maxWidth: 620, alignSelf: 'center', width: '100%', borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: 'hidden' },
  grabArea: { height: 27, alignItems: 'center', paddingTop: 9 },
  handle: { width: 36, height: 4, borderRadius: 4 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 20, paddingTop: 6, paddingBottom: 18 },
  headerIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  heading: { flex: 1, gap: 2 },
  title: { fontWeight: '700' },
  close: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  options: { paddingHorizontal: 20, paddingBottom: 15, gap: 9 },
  option: { minHeight: 78, flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 12, paddingVertical: 11, borderWidth: StyleSheet.hairlineWidth, borderRadius: 17 },
  pressed: { opacity: 0.82 },
  optionIcon: { width: 47, height: 47, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  optionCopy: { flex: 1, gap: 2 },
  optionTitle: { fontWeight: '700' },
  selection: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
