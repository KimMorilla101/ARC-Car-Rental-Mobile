import { Tabs } from 'expo-router/js-tabs';

import { BottomTabBar } from '@/components/common/BottomTabBar';
import { useNotifications } from '@/hooks/useNotifications';

/** Main tabs with the custom ARC tab bar. Order here is the order shown in the bar. */
export default function TabsLayout() {
  const { unreadCount } = useNotifications();
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} unreadCount={unreadCount} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="browse" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
