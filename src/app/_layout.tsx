// Per-weight imports: the package's main entry would bundle every weight and italic (~6 MB).
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display/400Regular';
import { Inter_400Regular } from '@expo-google-fonts/inter/400Regular';
import { Inter_500Medium } from '@expo-google-fonts/inter/500Medium';
import { Inter_600SemiBold } from '@expo-google-fonts/inter/600SemiBold';
import { Inter_700Bold } from '@expo-google-fonts/inter/700Bold';
import { useFonts } from 'expo-font';
import { DefaultTheme, Stack, ThemeProvider, type ErrorBoundaryProps } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { CrashFallback, ErrorBoundary as AppErrorBoundary } from '@/components/common/ErrorBoundary';
import { SessionRestoreOverlay } from '@/components/common/SessionRestoreOverlay';
import { palette } from '@/constants/theme';
import { AuthProvider } from '@/context/AuthContext';
import { useAuth } from '@/hooks/useAuth';

// Keep the native splash screen up until the fonts are loaded and the saved session has been checked.
SplashScreen.preventAutoHideAsync();

const theme = { ...DefaultTheme, colors: { ...DefaultTheme.colors, background: palette.canvas } };
const screenOptions = { headerShown: false, contentStyle: { backgroundColor: palette.canvas } };

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
  // DM Serif Display for large titles, Inter for everything else (see `font` in constants/theme.ts).
  const [fontsLoaded, fontError] = useFonts({
    DMSerifDisplay_400Regular,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  // If the fonts fail to load, carry on with system fonts rather than block the app.
  const fontsReady = fontsLoaded || !!fontError;

  useEffect(() => {
    if (status !== 'restoring' && fontsReady) SplashScreen.hideAsync();
  }, [status, fontsReady]);

  // Rendering text before the fonts exist would flash system fonts; the splash screen covers this.
  if (!fontsReady) return null;

  const signedIn = status === 'signedIn';
  // The navigator stays mounted so deep links resolve; restore states are drawn on top of it.
  return (
    <>
      <Stack screenOptions={screenOptions}>
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
      <SessionRestoreOverlay status={status} onRetry={retryRestore} onSignOut={signOut} />
    </>
  );
}
