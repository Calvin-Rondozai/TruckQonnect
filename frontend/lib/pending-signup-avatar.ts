import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@truckq_pending_signup_avatar';

type PendingAvatar = {
  uri: string;
  mimeType: string;
};

export async function setPendingSignupAvatar(uri: string, mimeType: string): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify({ uri, mimeType }));
}

export async function consumePendingSignupAvatar(): Promise<PendingAvatar | null> {
  const raw = await AsyncStorage.getItem(KEY);
  await AsyncStorage.removeItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as PendingAvatar;
  } catch {
    return null;
  }
}

export async function clearPendingSignupAvatar(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
