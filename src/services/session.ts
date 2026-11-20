import * as Keychain from 'react-native-keychain';
import type { Session } from './authApi';

const service = 'com.railgrid.auth';

export async function readSession(): Promise<Session | null> {
  const credentials = await Keychain.getGenericPassword({ service });
  if (!credentials) return null;
  try {
    const session: Session = JSON.parse(credentials.password);
    return session.accessToken && session.refreshToken && session.user?.id ? session : null;
  } catch {
    return null;
  }
}

export async function writeSession(session: Session): Promise<void> {
  await Keychain.setGenericPassword('railgrid', JSON.stringify(session), { service });
}

export async function clearSession(): Promise<void> {
  await Keychain.resetGenericPassword({ service });
}
