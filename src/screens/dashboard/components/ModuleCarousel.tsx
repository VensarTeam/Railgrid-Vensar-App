import { useEffect, useRef, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, View, useWindowDimensions, type NativeScrollEvent, type NativeSyntheticEvent, type ScrollViewInstance } from 'react-native';
import { Building2, Cable, Construction, Factory, Gauge, Pause, Play, PlugZap, RadioTower, Signpost, TrainTrack, Zap, type LucideIcon } from 'lucide-react-native';
import { useIsFocused } from '@react-navigation/native';
import { AppText } from '../../../components/AppText';
import { PhotoShade } from '../../../components/PhotoShade';
import { useTheme } from '../../../hooks/useTheme';
import { brandColors } from '../../../theme/colors';
import type { DashboardProject } from '../../../types/dashboard';
import { aggregateQuantities, aggregateSignalMetrics, formatQuantityNumber, type Quantity } from '../dashboardModel';

const photos = {
  civil: require('../../../../assets/images/civil-module.jpg'),
  signal: require('../../../../assets/images/signal-module.jpg'),
  electrical: require('../../../../assets/images/electrical-module.jpg'),
};

type Metric = { label: string; icon: LucideIcon; color: string; quantity: Quantity };
type Slide = { key: string; title: string; icon: LucideIcon; image: number; accent: string; metrics: Metric[] };
const unavailable: Quantity = { completed: null, total: null };

function slidesFor(projects: DashboardProject[]): Slide[] {
  const civil = aggregateQuantities(projects);
  const signal = aggregateSignalMetrics(projects);
  return [
    {
      key: 'civil', title: 'Rail Track Work', icon: TrainTrack, image: photos.civil, accent: brandColors.railBlue,
      metrics: [
        { label: 'Major bridges', icon: Construction, color: '#277FB1', quantity: civil.majorBridges },
        { label: 'Minor bridges', icon: Construction, color: '#637BC6', quantity: civil.minorBridges },
        { label: 'RUBs', icon: Construction, color: '#278C76', quantity: civil.roadUnderBridges },
        { label: 'Level crossings', icon: Signpost, color: '#D27C32', quantity: civil.crossings },
        { label: 'FOBs', icon: Construction, color: '#8764C9', quantity: civil.footOverBridges },
        { label: 'Stations', icon: Building2, color: '#DB5A4B', quantity: civil.stations },
      ],
    },
    {
      key: 'signal_telecommunication', title: 'Signal & Telecommunication', icon: RadioTower, image: photos.signal, accent: '#268A79',
      metrics: [
        { label: 'Signals', icon: RadioTower, color: '#9364CB', quantity: signal.signals },
        { label: 'Point machines', icon: Gauge, color: '#D2774C', quantity: signal.points },
        { label: 'Axle counters', icon: Gauge, color: '#24A69F', quantity: signal.axleCounters },
        { label: 'EI locations', icon: Factory, color: '#339971', quantity: signal.eiLocations },
        { label: 'OFC length', icon: Cable, color: '#9569C7', quantity: signal.ofcLengthKm },
        { label: 'Telecom systems', icon: RadioTower, color: '#6E74C7', quantity: signal.telecomSystems },
      ],
    },
    {
      key: 'electrical', title: 'Electrical', icon: Zap, image: photos.electrical, accent: '#CA7B32',
      metrics: [
        { label: 'Traction power', icon: Zap, color: '#D87465', quantity: unavailable },
        { label: 'Substations', icon: Factory, color: '#278C76', quantity: unavailable },
        { label: 'OHE length', icon: Construction, color: '#518EC6', quantity: unavailable },
        { label: 'Feeders', icon: PlugZap, color: '#56A77D', quantity: unavailable },
        { label: 'Sectioning posts', icon: Signpost, color: '#D18A3C', quantity: unavailable },
        { label: 'Power supply', icon: Zap, color: '#4CA775', quantity: unavailable },
      ],
    },
  ];
}

function MetricValue({ quantity }: { quantity: Quantity }) {
  const t = useTheme();
  return (
    <AppText variant="label" color={t.colors.text} numberOfLines={1} style={styles.metricValue}>
      {formatQuantityNumber(quantity.completed, quantity.unit)}
      <AppText variant="caption" color={t.colors.secondaryText}> / {formatQuantityNumber(quantity.total, quantity.unit)}{quantity.unit ? ` ${quantity.unit}` : ''}</AppText>
    </AppText>
  );
}

function MetricTile({ metric }: { metric: Metric }) {
  const t = useTheme();
  const Icon = metric.icon;
  return (
    <View style={[styles.metricTile, { backgroundColor: t.colors.background, borderColor: t.colors.border }]}>
      <View style={styles.metricTop}>
        <Icon color={metric.color} size={17} strokeWidth={1.8} />
        <AppText variant="caption" color={t.colors.secondaryText} numberOfLines={1} style={styles.metricLabel}>{metric.label}</AppText>
      </View>
      <MetricValue quantity={metric.quantity} />
    </View>
  );
}

function ModuleSlide({ slide, width }: { slide: Slide; width: number }) {
  const t = useTheme();
  const Icon = slide.icon;
  return (
    <View style={[styles.page, { width }]}>
      <View style={[styles.card, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
        <ImageBackground source={slide.image} resizeMode="cover" style={styles.photo} imageStyle={styles.photoImage}>
          <PhotoShade id={`module-shade-${slide.key}`} topOpacity={0.04} bottomOpacity={0.55} />
          <View style={styles.photoHeader}>
            <View style={styles.titlePill}>
              <Icon color={brandColors.railBlue} size={17} strokeWidth={2} />
              <AppText variant="label" color={brandColors.railBlue} numberOfLines={1} style={styles.slideTitle}>{slide.title}</AppText>
            </View>
          </View>
        </ImageBackground>
        <View style={styles.metricGrid}>
          {slide.metrics.map((metric) => <MetricTile key={metric.label} metric={metric} />)}
        </View>
      </View>
    </View>
  );
}

export function ModuleCarousel({ projects }: { projects: DashboardProject[] }) {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const pageWidth = Math.min(width - 32, 520);
  const focused = useIsFocused();
  const scrollRef = useRef<ScrollViewInstance>(null);
  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [paused, setPaused] = useState(false);
  const slides = slidesFor(projects);

  useEffect(() => {
    if (!focused || dragging || paused) return;
    const timer = setTimeout(() => {
      scrollRef.current?.scrollTo({ x: (index + 1) * pageWidth, animated: true });
    }, 5000);
    return () => clearTimeout(timer);
  }, [focused, dragging, paused, index, pageWidth, slides.length]);

  function onScrollEnd(event: NativeSyntheticEvent<NativeScrollEvent>) {
    const page = Math.round(event.nativeEvent.contentOffset.x / pageWidth);
    if (page >= slides.length) {
      scrollRef.current?.scrollTo({ x: 0, animated: false });
      setIndex(0);
    } else {
      setIndex(Math.max(0, page));
    }
    setDragging(false);
  }

  function goTo(next: number) {
    scrollRef.current?.scrollTo({ x: next * pageWidth, animated: true });
    setIndex(next);
  }

  return (
    <View>
      <View style={styles.sectionHeader}>
        <AppText variant="subtitle" color={t.colors.text} style={styles.sectionTitle}>Modules</AppText>
        <View style={styles.controls}>
          <AppText variant="caption" color={t.colors.secondaryText}>{index + 1} / {slides.length}</AppText>
          <Pressable accessibilityRole="button" accessibilityLabel={paused ? 'Play module carousel' : 'Pause module carousel'}
            accessibilityState={{ selected: paused }} onPress={() => setPaused((current) => !current)}
            style={[styles.playButton, { backgroundColor: t.colors.surface, borderColor: t.colors.border }]}>
            {paused ? <Play color={t.colors.secondary} size={15} fill={t.colors.secondary} /> : <Pause color={t.colors.secondary} size={15} fill={t.colors.secondary} />}
            <AppText variant="caption" color={t.colors.secondary} style={styles.playLabel}>{paused ? 'Play' : 'Pause'}</AppText>
          </Pressable>
        </View>
      </View>
      <ScrollView ref={scrollRef} horizontal pagingEnabled showsHorizontalScrollIndicator={false} onMomentumScrollEnd={onScrollEnd}
        onScrollBeginDrag={() => setDragging(true)} onScrollEndDrag={() => setDragging(false)}
        accessibilityLabel="Modules carousel" style={[styles.carousel, { width: pageWidth }]}>
        {slides.map((slide) => <ModuleSlide key={slide.key} slide={slide} width={pageWidth} />)}
        <ModuleSlide key="civil-loop" slide={slides[0]!} width={pageWidth} />
      </ScrollView>
      <View style={styles.dots}>
        {slides.map((slide, dotIndex) => <Pressable key={slide.key} accessibilityRole="button" accessibilityLabel={`Show ${slide.title}`}
          accessibilityState={{ selected: dotIndex === index }} onPress={() => goTo(dotIndex)} hitSlop={9}
          style={[styles.dot, { backgroundColor: dotIndex === index ? slide.accent : t.colors.border }, dotIndex === index && styles.activeDot]} />)}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontWeight: '700' },
  controls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  playButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, minWidth: 70, minHeight: 32, borderWidth: StyleSheet.hairlineWidth, borderRadius: 10, paddingHorizontal: 8 },
  playLabel: { fontWeight: '700', fontSize: 11 },
  carousel: { borderRadius: 20, alignSelf: 'center' },
  page: { paddingRight: 1 },
  card: { borderWidth: StyleSheet.hairlineWidth, borderRadius: 20, overflow: 'hidden' },
  photo: { height: 126 },
  photoImage: { borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  photoHeader: { flexDirection: 'row', alignItems: 'flex-start', padding: 12 },
  titlePill: { flexDirection: 'row', alignItems: 'center', gap: 7, flexShrink: 1, backgroundColor: 'rgba(255,255,255,0.96)', borderRadius: 12, paddingHorizontal: 11, paddingVertical: 8 },
  slideTitle: { fontWeight: '700', fontSize: 13, flexShrink: 1 },
  metricGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 11 },
  metricTile: { width: '48%', flexGrow: 1, minHeight: 68, borderWidth: StyleSheet.hairlineWidth, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 9, justifyContent: 'space-between' },
  metricTop: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  metricLabel: { flex: 1, fontSize: 11 },
  metricValue: { fontSize: 17, lineHeight: 22, fontWeight: '700', marginLeft: 24 },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, height: 23 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  activeDot: { width: 18, borderRadius: 4 },
});
