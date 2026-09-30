import { DefaultTheme, Stack, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import { CrashFallback, ErrorBoundary as AppErrorBoundary } from '@/components/common/ErrorBoundary';
import { ErrorState } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/services/api';

// Keep the native splash screen up until the saved session has been checked.
SplashScreen.preventAutoHideAsync();

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: palette.canvas } };

/** Expo Router calls this for render errors inside any route. */
export function ErrorBoundary({ retry }: ErrorBoundaryProps) {
  return <CrashFallback onRetry={retry} />;
}

export default function RootLayout() {
  return (
    <AppErrorBoundary>
      <ThemeProvider value={theme}>
        <AuthProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </AuthProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}

/**
 * Route guards. Signed-out users can only reach (auth) and the public info pages; signed-in users
 * can only reach (app). When the session changes (sign-in, sign-out, or a 401 from the API),
 * Expo Router removes the screens that are no longer allowed and redirects automatically.
 * These guards are for UX only: Laravel must authorize every request.
 */
function RootNavigator() {
  const { status, retryRestore, signOut } = useAuth();

  useEffect(() => {
    if (status !== 'restoring') SplashScreen.hideAsync();
  }, [status]);

  const signedIn = status === 'signedIn';
  // The navigator stays mounted so deep links resolve; restore states are drawn on top of it.
  return (
    <>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.canvas } }}>
        <Stack.Protected guard={signedIn}>
          <Stack.Screen name="(app)" />
        </Stack.Protected>
        <Stack.Protected guard={!signedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
        <Stack.Screen name="about" />
        <Stack.Screen name="contact" />
        <Stack.Screen name="faq" />
      </Stack>
      {status === 'restoring' && (
        <View style={styles.overlay}>
          <LoadingSpinner fullScreen />
        </View>
      )}
      {status === 'restoreFailed' && (
        <Screen style={[styles.overlay, styles.centered]}>
          <ErrorState
            title="Can't reach ARC Ride"
            error={new ApiError('network', 'We could not check your session. Check your connection and try again.')}
            onRetry={retryRestore}
          />
          <PrimaryButton label="Sign out" variant="ghost" onPress={signOut} />
        </Screen>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 },
  centered: { justifyContent: 'center', padding: 20 },
});
