import { Tabs, type BottomTabNavigationOptions } from 'expo-router/js-tabs';
import { Easing } from 'react-native';

import { BottomTabBar } from '@/components/common/BottomTabBar';
import { palette } from '@/constants/theme';
import { useNotifications } from '@/hooks/useNotifications';

// Short ease-out cross-fade between tabs. The canvas background keeps the fade from flashing white or black.
const screenOptions: BottomTabNavigationOptions = {
  headerShown: false,
  animation: 'fade',
  transitionSpec: { animation: 'timing', config: { duration: 200, easing: Easing.out(Easing.cubic) } },
  sceneStyle: { backgroundColor: palette.canvas },
};

/** Main tabs with the custom ARC tab bar. Order here is the order shown in the bar. */
export default function TabsLayout() {
  const { unreadCount } = useNotifications();
  return (
    <Tabs screenOptions={screenOptions} tabBar={(props) => <BottomTabBar {...props} unreadCount={unreadCount} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="browse" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
