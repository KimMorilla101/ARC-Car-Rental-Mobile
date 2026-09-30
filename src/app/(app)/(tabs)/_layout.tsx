import { Tabs } from 'expo-router/js-tabs';

import { BottomTabBar } from '@/components/common/BottomTabBar';

/** Main tabs with the custom ARC tab bar. Order here is the order shown in the bar. */
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <BottomTabBar {...props} />}>
      <Tabs.Screen name="home" />
      <Tabs.Screen name="browse" />
      <Tabs.Screen name="bookings" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
