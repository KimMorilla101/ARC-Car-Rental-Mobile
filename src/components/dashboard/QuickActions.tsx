import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/common/Icon';
import { palette, gradients } from '@/constants/theme';

import { styles } from './QuickActions.styles';

interface Tile {
  title: string;
  caption: string;
  icon: IconName;
  colors: readonly [string, string, ...string[]];
  href: Href;
}

/** 2×2 coloured shortcut tiles on Home. */
export function QuickActions({ bookingCount }: { bookingCount: number | null }) {
  const router = useRouter();
  const tiles: Tile[] = [
    { title: 'Smart Match', caption: 'Find your ideal car', icon: 'star', colors: gradients.blue, href: { pathname: '/browse', params: { sort: 'recommended' } } },
    { title: 'My Bookings', caption: bookingCount === null ? 'Your reservations' : `${bookingCount} reservation${bookingCount === 1 ? '' : 's'}`, icon: 'book-open', colors: gradients.dark, href: '/bookings' },
    { title: 'Quick Book', caption: 'Book in 2 minutes', icon: 'zap', colors: gradients.green, href: '/browse' },
    { title: 'Support', caption: '24/7 assistance', icon: 'headphones', colors: gradients.purple, href: '/contact' },
  ];

  return (
    <View style={styles.grid}>
      {tiles.map((tile) => (
        <Pressable key={tile.title} onPress={() => router.push(tile.href)} style={({ pressed }) => [styles.cell, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={tile.title}>
          <LinearGradient colors={tile.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.tile}>
            <Icon name={tile.icon} size={22} color={palette.white} />
            <View>
              <Text style={styles.title}>{tile.title}</Text>
              <Text style={styles.caption}>{tile.caption}</Text>
            </View>
          </LinearGradient>
        </Pressable>
      ))}
    </View>
  );
}
