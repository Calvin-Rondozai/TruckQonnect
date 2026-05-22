import AsyncStorage from '@react-native-async-storage/async-storage';

/** Legacy keys from when intro was skipped after first run — safe to clear in dev. */
const LEGACY_KEYS = [
  '@truckq_flow_splash',
  '@truckq_flow_intro',
  '@truckq_flow_welcome',
  '@truckq_onboarding_complete',
];

export async function clearLegacyFlowFlags(): Promise<void> {
  await AsyncStorage.multiRemove(LEGACY_KEYS);
}
