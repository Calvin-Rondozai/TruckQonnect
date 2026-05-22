import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = '@truckq_onboarding_complete';

export async function getOnboardingComplete(): Promise<boolean> {
  try {
    const v = await AsyncStorage.getItem(KEY);
    return v === '1';
  } catch {
    return false;
  }
}

export async function setOnboardingComplete(): Promise<void> {
  await AsyncStorage.setItem(KEY, '1');
}

/** Dev / testing — call to show the welcome screen again on next launch. */
export async function clearOnboardingComplete(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}
