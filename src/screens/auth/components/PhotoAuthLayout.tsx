import type { PropsWithChildren } from 'react';
import { Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, View, useWindowDimensions, type ImageSourcePropType } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../../components/AppText';
import { useAuthPalette } from '../authPalette';

const railGridLogo = require('../../../../assets/images/railgrid-logo.png');

type Props = PropsWithChildren<{
  image: ImageSourcePropType;
  title: string;
  subtitle: string;
  eyebrow?: string;
  heroCaption?: string;
  heroFraction?: number;
  imageFocalX?: number;
  lightStatusBar?: boolean;
}>;

export function PhotoAuthLayout({
  image,
  title,
  subtitle,
  eyebrow,
  heroCaption,
  heroFraction = 0.42,
  imageFocalX = 0.5,
  lightStatusBar = false,
  children,
}: Props) {
  const c = useAuthPalette();
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const wide = width >= 700;
  const heroHeight = Math.max(240, Math.min(height * heroFraction, wide ? 510 : 530));
  const photoHeight = Math.max(heroHeight + 120, height * 0.72);
  const imageSize = Image.resolveAssetSource(image);
  const imageAspect = imageSize?.width && imageSize?.height ? imageSize.width / imageSize.height : 1;
  const renderedImageWidth = Math.max(width, photoHeight * imageAspect);
  const imageOffset = -(renderedImageWidth - width) * Math.max(0, Math.min(1, imageFocalX));

  return (
    <View style={[styles.root, { backgroundColor: c.sheet }]}>
      <StatusBar
        barStyle={lightStatusBar ? 'light-content' : 'dark-content'}
      />
      <View style={[styles.photo, { height: photoHeight }]} pointerEvents="none">
        <Image
          source={image}
          resizeMode="stretch"
          style={[styles.photoImage, { left: imageOffset, width: renderedImageWidth, height: photoHeight }]}
          accessibilityIgnoresInvertColors
        />
        <Svg width="100%" height="100%" style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="photoFade" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor={c.sheet} stopOpacity={0} />
              <Stop offset="30%" stopColor={c.sheet} stopOpacity={0} />
              <Stop offset="53%" stopColor={c.sheet} stopOpacity={0.66} />
              <Stop offset="69%" stopColor={c.sheet} stopOpacity={1} />
              <Stop offset="100%" stopColor={c.sheet} stopOpacity={1} />
            </LinearGradient>
          </Defs>
          <Rect width="100%" height="100%" fill="url(#photoFade)" />
        </Svg>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          bounces={false}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={[styles.hero, { height: heroHeight, paddingTop: insets.top + 18 }]}>
            <View style={styles.brandPill}>
              <Image source={railGridLogo} resizeMode="contain" style={styles.brandImage} accessibilityLabel="RailGrid by Vensar" />
            </View>
            {heroCaption ? (
              <View style={[styles.heroCaptionPill, { top: heroHeight * 0.69 }]}>
                <AppText variant="caption" color="#FFFFFF" style={styles.heroCaption}>
                  {heroCaption.toUpperCase()}
                </AppText>
              </View>
            ) : null}
          </View>

          <View style={[styles.sheet, { minHeight: height - heroHeight, paddingBottom: Math.max(insets.bottom + 20, 32) }, wide && styles.wideSheet]}>
            <View style={styles.copy}>
              {eyebrow ? (
                <>
                  <View style={[styles.accentRule, { backgroundColor: c.brandAccent }]} />
                  <AppText variant="label" color={c.accent} style={styles.eyebrow}>
                    {eyebrow.toUpperCase()}
                  </AppText>
                </>
              ) : null}
              <AppText variant="display" color={c.ink} style={[styles.title, wide && styles.wideTitle]}>
                {title}
              </AppText>
              <AppText variant="body" color={c.muted} style={styles.subtitle}>
                {subtitle}
              </AppText>
            </View>
            <View style={styles.body}>{children}</View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  content: { flexGrow: 1 },
  photo: { position: 'absolute', top: 0, left: 0, right: 0, overflow: 'hidden' },
  photoImage: { position: 'absolute', top: 0 },
  hero: { width: '100%', paddingHorizontal: 24 },
  brandPill: { alignSelf: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 15, backgroundColor: 'rgba(255, 255, 255, 0.88)' },
  brandImage: { width: 156, height: 43 },
  heroCaptionPill: { position: 'absolute', left: 24, alignSelf: 'flex-start', paddingHorizontal: 13, paddingVertical: 9, borderRadius: 12, backgroundColor: 'rgba(7, 27, 45, 0.78)' },
  heroCaption: { letterSpacing: 1.35, fontWeight: '700', fontSize: 10 },
  sheet: { paddingHorizontal: 26, paddingTop: 12, flexGrow: 1 },
  wideSheet: { width: '100%', maxWidth: 650, alignSelf: 'center' },
  copy: { gap: 9 },
  accentRule: { width: 38, height: 3, borderRadius: 2, marginBottom: 10 },
  eyebrow: { letterSpacing: 1.8, fontSize: 11, fontWeight: '700' },
  title: { fontSize: 31, lineHeight: 38, fontWeight: '700', letterSpacing: -0.8 },
  wideTitle: { fontSize: 38, lineHeight: 46 },
  subtitle: { lineHeight: 23, maxWidth: 480 },
  body: { marginTop: 27, gap: 17 },
});
