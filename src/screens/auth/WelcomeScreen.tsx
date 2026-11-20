import { StyleSheet, View } from 'react-native';
import { AppText } from '../../components/AppText';
import { useOnboardingStore } from '../../store/onboardingStore';
import { useAuthPalette } from './authPalette';
import { AuthActionButton } from './components/AuthActionButton';
import { PhotoAuthLayout } from './components/PhotoAuthLayout';

const stationPhoto = require('../../../assets/images/station-platform.jpg');

export function WelcomeScreen() {
  const c = useAuthPalette();
  const complete = useOnboardingStore((state) => state.complete);

  return (
    <PhotoAuthLayout
      image={stationPhoto}
      heroFraction={0.55}
      lightStatusBar
      heroCaption="Where progress meets the ground"
      eyebrow="Welcome to RailGrid"
      title={'Smarter railways.\nBetter fieldwork.'}
      subtitle="Track work, complete site checklists, and keep every project moving from wherever you are."
    >
      <AuthActionButton title="Get started" onPress={() => { complete().catch(() => undefined); }} />
      <View style={styles.footer}>
        <View style={[styles.dot, { backgroundColor: c.accent }]} />
        <AppText variant="caption" color={c.muted}>
          Built for the people moving rail projects forward
        </AppText>
      </View>
    </PhotoAuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: { flexDirection: 'row', alignItems: 'center', gap: 8, justifyContent: 'center', marginTop: 2 },
  dot: { width: 5, height: 5, borderRadius: 3 },
});
