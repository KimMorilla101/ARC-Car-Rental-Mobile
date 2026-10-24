import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';

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
        return <TabItem key={route.key} label={tab.label} icon={tab.icon} focused={focused} badge={badge} onPress={onPress} />;
      })}
    </View>
  );
}

interface TabItemProps {
  label: string;
  icon: IconName;
  focused: boolean;
  badge: number;
  onPress: () => void;
}

/** One tab button. The blue pill fades and grows in, and the grey and white icons cross-fade. */
function TabItem({ label, icon, focused, badge, onPress }: TabItemProps) {
  // 0 = inactive, 1 = active. Starts at the current state so nothing animates on first render.
  const [progress] = useState(() => new Animated.Value(focused ? 1 : 0));

  useEffect(() => {
    Animated.timing(progress, { toValue: focused ? 1 : 0, duration: 180, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [focused, progress]);

  const pillScale = progress.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] });
  const inactiveOpacity = progress.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.itemPressed]}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={badge ? `${label}, ${badge} unread` : label}>
      <View style={styles.iconPill}>
        <Animated.View style={[styles.pillFill, { opacity: progress, transform: [{ scale: pillScale }] }]} />
        <Animated.View style={{ opacity: inactiveOpacity }}>
          <Icon name={icon} size={19} color={palette.mutedLight} />
        </Animated.View>
        <Animated.View style={[styles.iconOverlay, { opacity: progress }]}>
          <Icon name={icon} size={19} color={palette.white} />
        </Animated.View>
        {badge > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{badge > 9 ? '9+' : badge}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </Pressable>
  );
}
