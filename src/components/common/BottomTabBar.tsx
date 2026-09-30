import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette, tabBarHeight } from '@/constants/theme';

// Glyph icons from the Figma-based prototype; swap for the final icon set when it is exported.
const tabs: Record<string, { label: string; icon: string }> = {
  home: { label: 'Home', icon: '⌂' },
  browse: { label: 'Browse', icon: '◫' },
  bookings: { label: 'Bookings', icon: '▣' },
  notifications: { label: 'Alerts', icon: '◌' },
  profile: { label: 'Profile', icon: '○' },
};

/** Custom tab bar matching the ARC Ride design, used by the (tabs) layout. */
export function BottomTabBar({ state, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const tab = tabs[route.name];
        if (!tab) return null;
        const focused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) navigation.navigate(route.name, route.params);
        };
        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={styles.item}
            accessibilityRole="tab"
            accessibilityState={{ selected: focused }}
            accessibilityLabel={tab.label}>
            <Text style={[styles.icon, focused && styles.active]}>{tab.icon}</Text>
            <Text style={[styles.label, focused && styles.active]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    minHeight: tabBarHeight,
    backgroundColor: palette.white,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  item: { alignItems: 'center', flex: 1 },
  icon: { color: palette.mutedLight, fontSize: 22, height: 28 },
  label: { color: palette.mutedLight, fontSize: 10, fontWeight: '700' },
  active: { color: palette.blue },
});
