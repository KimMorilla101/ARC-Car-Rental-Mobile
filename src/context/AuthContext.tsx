import * as Device from 'expo-device';
import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Platform } from 'react-native';

import { ApiError, setUnauthorizedHandler } from '@/services/api';
import { authApi } from '@/services/authApi';
import { tokenStorage } from '@/services/tokenStorage';
import type { User } from '@/types/auth';

/**
 * restoring  - reading a remembered token and loading the user (splash screen stays up)
 * signedIn   - token and user are valid
 * signedOut  - no session; only public/auth routes are reachable
 * restoreFailed - a token exists but the server could not be reached; the renter can retry
 */
export type AuthStatus = 'restoring' | 'signedIn' | 'signedOut' | 'restoreFailed';

interface SignInInput {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  passwordConfirmation: string;
}

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  signIn(input: SignInInput): Promise<void>;
  register(input: RegisterInput): Promise<void>;
  signOut(): Promise<void>;
  /** Replace the cached user after a profile update. */
  updateUser(user: User): void;
  retryRestore(): Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

// Shown to the renter in Laravel's token list so they can recognise and revoke devices.
const deviceName = `ARC Ride ${Device.modelName ?? Platform.OS}`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('restoring');
  const [user, setUser] = useState<User | null>(null);

  const clearSession = useCallback(async () => {
    await tokenStorage.clear();
    setUser(null);
    setStatus('signedOut');
  }, []);

  /** Turns a remembered token (or none) into a session by loading the user from the API. */
  const resumeSession = useCallback(
    async (token: string | null) => {
      if (!token) {
        setStatus('signedOut');
        return;
      }
      try {
        setUser(await authApi.me());
        setStatus('signedIn');
      } catch (error) {
        // A rejected token ends the session; a network problem should not log the renter out.
        if (error instanceof ApiError && (error.kind === 'unauthorized' || error.kind === 'forbidden')) await clearSession();
        else setStatus('restoreFailed');
      }
    },
    [clearSession],
  );

  useEffect(() => {
    tokenStorage.load().then(resumeSession);
  }, [resumeSession]);

  // Any 401 on an authenticated request means the token is expired or revoked.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      clearSession();
    });
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const signIn = useCallback(async ({ email, password, remember }: SignInInput) => {
    const response = await authApi.login({ email: email.trim(), password, deviceName });
    await tokenStorage.save(response.token, remember);
    setUser(response.user);
    setStatus('signedIn');
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const response = await authApi.register({ ...input, email: input.email.trim(), name: input.name.trim(), deviceName });
    // New accounts stay signed in on this device, like "Remember me".
    await tokenStorage.save(response.token, true);
    setUser(response.user);
    setStatus('signedIn');
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Revoking on the server is best-effort; the local session is always cleared.
    }
    await clearSession();
  }, [clearSession]);

  const retryRestore = useCallback(async () => {
    setStatus('restoring');
    await resumeSession(await tokenStorage.load());
  }, [resumeSession]);

  const value = useMemo<AuthContextValue>(
    () => ({ status, user, signIn, register, signOut, updateUser: setUser, retryRestore }),
    [status, user, signIn, register, signOut, retryRestore],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
