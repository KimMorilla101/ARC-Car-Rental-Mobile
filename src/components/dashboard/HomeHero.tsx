import { ImageBackground } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/common/Button';
import { gradients } from '@/constants/theme';

import { styles } from './HomeHero.styles';

// Marketing figures from the Figma design. Confirm the real numbers with ARC before release.
const stats = [
  { value: '500+', label: 'Satisfied Customers' },
  { value: '50+', label: 'Premium Vehicles' },
  { value: '4.8★', label: 'Average Rating' },
  { value: '8 yrs', label: 'In Business' },
];

/** Dark photo hero at the top of Home. */
export function HomeHero() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80' }}
      style={[styles.hero, { paddingTop: insets.top + 24 }]}
      contentFit="cover">
      <LinearGradient colors={gradients.heroOverlay} locations={[0, 0.6, 1]} style={StyleSheet.absoluteFill} />
      <Text style={styles.eyebrow}>● DAVAO CITY&apos;S TRUSTED CAR RENTAL</Text>
      <Text style={styles.title} accessibilityRole="header">
        Drive Your Way.{'\n'}
        <Text style={styles.titleMuted}>Your Rules.</Text>
      </Text>
      <Text style={styles.body}>Choose from our premium vehicles. Transparent pricing, zero hidden fees, and genuine personal service.</Text>
      <View style={styles.buttons}>
        <Button label="Browse Cars" icon="truck" trailingIcon="arrow-right" size="sm" onPress={() => router.push('/browse')} style={styles.button} />
        <Button label="Smart Match" icon="star" variant="onDarkOutline" size="sm" onPress={() => router.push({ pathname: '/browse', params: { sort: 'recommended' } })} style={styles.button} />
      </View>
      <View style={styles.stats}>
        {stats.map((item) => (
          <View key={item.label} style={styles.stat}>
            <Text style={styles.statValue}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </ImageBackground>
  );
}
