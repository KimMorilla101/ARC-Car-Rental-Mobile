import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { useEffect, useState } from 'react';
import { Animated, Easing, Pressable, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import { badgeLabel } from '@/utils/badges';

import { Icon, type IconName } from './Icon';
import { styles } from './BottomTabBar.styles';

type BadgeKind = 'bookings' | 'notifications';

const tabs: Record<string, { label: string; icon: IconName; badge?: BadgeKind }> = {
  home: { label: 'Home', icon: 'home' },
  browse: { label: 'Browse', icon: 'truck' },
  bookings: { label: 'Bookings', icon: 'book-open', badge: 'bookings' },
  notifications: { label: 'Alerts', icon: 'bell', badge: 'notifications' },
  profile: { label: 'Profile', icon: 'user' },
};

// What the badge number means, for screen readers.
const badgeMeaning: Record<BadgeKind, string> = { bookings: 'open bookings', notifications: 'unread' };

/** Tab bar from the Figma design: the active icon sits in a blue pill; Bookings and Alerts show count badges. */
export function BottomTabBar({ state, navigation, insets, counts }: BottomTabBarProps & { counts: Record<BadgeKind, number> }) {
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} accessibilityRole="tablist">
      {state.routes.map((route, index) => {
        const tab = tabs[route.name];
        if (!tab) return null;
        const focused = state.index === index;
        const count = tab.badge ? counts[tab.badge] : 0;
        const badge = tab.badge ? { text: badgeLabel(count), spoken: `${count} ${badgeMeaning[tab.badge]}` } : null;
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
  /** Badge text ("1", "99+") and its spoken meaning; text is null when the count is zero. */
  badge: { text: string | null; spoken: string } | null;
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
      accessibilityLabel={badge?.text ? `${label}, ${badge.spoken}` : label}>
      <View style={styles.iconPill}>
        <Animated.View style={[styles.pillFill, { opacity: progress, transform: [{ scale: pillScale }] }]} />
        <Animated.View style={{ opacity: inactiveOpacity }}>
          <Icon name={icon} size={19} color={palette.mutedLight} />
        </Animated.View>
        <Animated.View style={[styles.iconOverlay, { opacity: progress }]}>
          <Icon name={icon} size={19} color={palette.white} />
        </Animated.View>
        {badge?.text ? (
          <View style={styles.badge} pointerEvents="none">
            <Text style={styles.badgeText} numberOfLines={1}>
              {badge.text}
            </Text>
          </View>
        ) : null}
      </View>
      <Text style={[styles.label, focused && styles.labelActive]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}
