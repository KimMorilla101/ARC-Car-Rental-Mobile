import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import { Icon, type IconName } from './Icon';
import { styles } from './BottomTabBar.styles';

const tabs: Record<string, { label: string; icon: IconName }> = {
  home: { label: 'Home', icon: 'home' },
  browse: { label: 'Browse', icon: 'truck' },
  bookings: { label: 'Bookings', icon: 'book-open' },
  notifications: { label: 'Alerts', icon: 'bell' },
  profile: { label: 'Profile', icon: 'user' },
};

/** Tab bar from the Figma design: the active icon sits in a blue pill; Alerts shows an unread badge. */
export function BottomTabBar({ state, navigation, insets, unreadCount }: BottomTabBarProps & { unreadCount: number }) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const tab = tabs[route.name];
        if (!tab) return null;
        const focused = state.index === index;
        const badge = route.name === 'notifications' && unreadCount > 0 ? unreadCount : 0;
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
            accessibilityLabel={badge ? `${tab.label}, ${badge} unread` : tab.label}>
            <View style={[styles.iconPill, focused && styles.iconPillActive]}>
              <Icon name={tab.icon} size={19} color={focused ? palette.white : palette.mutedLight} />
              {badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.label, focused && styles.labelActive]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}
