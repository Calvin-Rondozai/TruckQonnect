import { Platform } from 'react-native';

/**
 * Django API base URL (no trailing slash).
 * - Android emulator: 10.0.2.2 → host machine
 * - iOS simulator: 127.0.0.1
 * - Physical device: set EXPO_PUBLIC_API_URL to http://<your-pc-lan-ip>:8000
 */
const defaultHost =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';

export const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL ?? defaultHost).replace(/\/$/, '');

export const AUTH_API_PREFIX = `${API_BASE_URL}/api/v1/auth`;
