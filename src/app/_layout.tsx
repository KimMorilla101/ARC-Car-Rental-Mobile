import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display';
import { Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold, Outfit_800ExtraBold } from '@expo-google-fonts/outfit';
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
  // Figma fonts: DM Serif Display for headings, Outfit for everything else.
  const [fontsLoaded, fontError] = useFonts({
    DMSerifDisplay_400Regular,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
    Outfit_700Bold,
    Outfit_800ExtraBold,
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
