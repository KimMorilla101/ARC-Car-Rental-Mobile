import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Holds the Sanctum bearer token.
 *
 * Native: persisted in the iOS Keychain / Android Keystore through expo-secure-store, and only
 * when the renter chose "Remember me". Web has no secure storage, so the token stays in memory
 * and the session ends on reload; never fall back to localStorage for tokens.
 *
 * Only the token is stored. Passwords are never persisted.
 */
const TOKEN_KEY = 'arc_ride.auth_token';
const canPersist = Platform.OS !== 'web';

let cachedToken: string | null = null;

export const tokenStorage = {
  /** Synchronous read used by the API client on every request. */
  get(): string | null {
    return cachedToken;
  },

  /** Restores a remembered token at app start. */
  async load(): Promise<string | null> {
    if (!canPersist) return cachedToken;
    try {
      cachedToken = await SecureStore.getItemAsync(TOKEN_KEY);
    } catch {
      // A corrupted keychain entry must not block startup; treat it as logged out.
      cachedToken = null;
    }
    return cachedToken;
  },

  async save(token: string, remember: boolean): Promise<void> {
    cachedToken = token;
    if (!canPersist) return;
    if (remember) await SecureStore.setItemAsync(TOKEN_KEY, token);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  },

  async clear(): Promise<void> {
    cachedToken = null;
    if (!canPersist) return;
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    } catch {
      // Nothing else to do; the in-memory token is already gone.
    }
  },
};
