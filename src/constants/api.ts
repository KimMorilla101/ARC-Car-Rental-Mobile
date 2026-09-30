import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * API configuration.
 *
 * Resolution order for the Laravel base URL (it should include the `/api` prefix):
 *   1. EXPO_PUBLIC_API_BASE_URL, when set. Required for production (must be HTTPS), for Laragon
 *      virtual hosts, and for any setup where the automatic guess below is wrong.
 *   2. Development only: the machine that runs Metro, on EXPO_PUBLIC_API_PORT (default 8000).
 *      This covers physical Android/iPhone devices on the same Wi-Fi, provided Laravel listens on
 *      all interfaces: `php artisan serve --host=0.0.0.0 --port=8000`.
 *   3. Development fallback: 10.0.2.2 on the Android emulator (the host machine), localhost on the
 *      iOS simulator and web.
 *
 * EXPO_PUBLIC_* values are embedded in the app bundle and readable by anyone, so never put secrets
 * in them. Environment variables must be referenced as `process.env.EXPO_PUBLIC_X` for Expo to
 * inline them.
 */
const DEFAULT_DEV_PORT = process.env.EXPO_PUBLIC_API_PORT || '8000';

function devHostFromMetro(): string | null {
  // hostUri looks like "192.168.1.20:8081" and only exists while running from the dev server.
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (!host || host === 'localhost' || host === '127.0.0.1') return null;
  return host;
}

function resolveBaseUrl(): string {
  const configured = process.env.EXPO_PUBLIC_API_BASE_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');

  if (!__DEV__) return '';

  const metroHost = devHostFromMetro();
  if (metroHost) return `http://${metroHost}:${DEFAULT_DEV_PORT}/api`;
  const localHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  return `http://${localHost}:${DEFAULT_DEV_PORT}/api`;
}

function validateBaseUrl(url: string): string | null {
  if (!url) return 'EXPO_PUBLIC_API_BASE_URL is not set for this build.';
  if (!__DEV__ && !url.startsWith('https://')) return 'Production builds must use an HTTPS API URL.';
  return null;
}

const baseUrl = resolveBaseUrl();

export const apiConfig = {
  baseUrl,
  /** Non-null when the API cannot be used safely; every request fails with this message. */
  configError: validateBaseUrl(baseUrl),
  timeoutMs: 20_000,
  /**
   * Temporary in-memory mock services, used while the Laravel API is being built.
   * Only honoured in development builds so a release can never show fake data or fake success.
   */
  useMockApi: __DEV__ && process.env.EXPO_PUBLIC_USE_MOCK_API === 'true',
} as const;
