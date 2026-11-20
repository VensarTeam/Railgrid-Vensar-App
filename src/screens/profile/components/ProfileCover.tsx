import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '../../../components/AppText';
import { PhotoShade } from '../../../components/PhotoShade';
import { apiBaseUrl, type AuthUser } from '../../../services/authApi';
import { brandColors } from '../../../theme/colors';

const coverPhoto = require('../../../../assets/images/dashboard-cover.jpg');

function profileImageUrl(value: string | null): string | null {
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return `${apiBaseUrl.replace(/\/v1\/?$/, '')}${value}`;
  return null;
}

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((part) => part.charAt(0)).join('').toUpperCase() || 'RG';
}

function roleLabel(role: string): string {
  return role.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function ProfileCover({ user }: { user: AuthUser | null }) {
  const insets = useSafeAreaInsets();
  const [coverSize, setCoverSize] = useState({ width: 0, height: 0 });
  const [imageFailed, setImageFailed] = useState(false);
  const imageUri = profileImageUrl(user?.profileUrl ?? null);
  const name = user?.username?.trim() || 'RailGrid user';

  return (
    <View style={[styles.cover, { paddingTop: insets.top + 11 }]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setCoverSize((current) => current.width === width && current.height === height ? current : { width, height });
      }}>
      {coverSize.height > 0 ? <Image source={coverPhoto} resizeMode="cover"
        style={[styles.coverImage, { width: Math.max(coverSize.width, coverSize.height * 2.5), height: coverSize.height }]} /> : null}
      <PhotoShade id="profile-cover-shade" topOpacity={0.55} bottomOpacity={0.94} />
      <AppText variant="heading" color="#FFFFFF" style={styles.heading}>Profile</AppText>
      <View style={styles.glass}>
        <View style={styles.avatar}>
          {imageUri && !imageFailed ? <Image source={{ uri: imageUri }} onError={() => setImageFailed(true)} style={styles.avatarImage} />
            : <AppText variant="title" color="#FFFFFF" style={styles.initials}>{initials(name)}</AppText>}
        </View>
        <View style={styles.identity}>
          <AppText variant="title" color="#FFFFFF" numberOfLines={2} style={styles.name}>{name}</AppText>
          {user?.designation ? <AppText variant="bodySmall" color="#D8EAF5" numberOfLines={1}>{roleLabel(user.designation)}</AppText> : null}
          {user?.role ? <View style={styles.rolePill}><AppText variant="caption" color="#FFFFFF" style={styles.roleText}>{roleLabel(user.role)}</AppText></View> : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { width: '100%', minHeight: 285, paddingHorizontal: 17, paddingBottom: 21, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, overflow: 'hidden', backgroundColor: brandColors.navy900 },
  coverImage: { position: 'absolute', top: 0, right: 0 },
  heading: { fontSize: 24, lineHeight: 30, marginBottom: 19 },
  glass: { minHeight: 132, flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, borderRadius: 22, backgroundColor: 'rgba(12,48,73,0.56)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.42)', shadowColor: '#061C2D', shadowOpacity: 0.16, shadowOffset: { width: 0, height: 8 }, shadowRadius: 18 },
  avatar: { width: 66, height: 66, borderRadius: 21, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.20)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.42)' },
  avatarImage: { width: '100%', height: '100%' },
  initials: { fontSize: 25, lineHeight: 30, fontWeight: '700' },
  identity: { flex: 1, alignItems: 'flex-start', gap: 3 },
  name: { fontWeight: '700', lineHeight: 25 },
  rolePill: { marginTop: 6, backgroundColor: 'rgba(255,255,255,0.16)', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 4 },
  roleText: { fontWeight: '700', fontSize: 11 },
});
