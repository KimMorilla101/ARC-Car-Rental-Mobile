import { Stack } from 'expo-router';

import { palette } from '@/constants/theme';
import { AppProvider } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';

// Deep links into a detail screen still get the tabs underneath, so "back" has somewhere to go.
export const unstable_settings = { anchor: '(tabs)' };

/** Signed-in area: the tab bar plus detail and form screens pushed on top of it. */
export default function AppLayout() {
  const { user } = useAuth();
  return (
    // Keyed by user: a different account always starts with fresh bookings, notifications and badge counts.
    <AppProvider key={user ? String(user.id) : 'signed-out'}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: palette.canvas } }} />
    </AppProvider>
  );
}
