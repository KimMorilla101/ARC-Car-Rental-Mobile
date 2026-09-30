import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { gutter, palette } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

const reasons = ['Clean, inspected vehicles', 'Transparent rental and fixed fees', 'Flexible pickup and delivery', 'Support before, during, and after every trip'];

export default function AboutScreen() {
  const router = useRouter();
  const { status } = useAuth();
  return (
    <Screen>
      <TopBar back title="About ARC Ride" />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Image source={{ uri: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=85' }} style={styles.hero} contentFit="cover" />
        <Text style={styles.title}>Drive with confidence.</Text>
        <Text style={styles.text}>ARC Car Rental makes every journey easier with dependable vehicles, clear pricing, and customer-first support across Davao.</Text>
        <Text style={styles.section}>Our mission</Text>
        <Text style={styles.text}>To give every customer a safe, simple, and trustworthy way to move.</Text>
        <Text style={styles.section}>Why customers choose us</Text>
        <View style={styles.list}>
          {reasons.map((reason) => (
            <Text key={reason} style={styles.item}>
              ✓ {reason}
            </Text>
          ))}
        </View>
        <PrimaryButton
          label={status === 'signedIn' ? 'Browse available cars' : 'Create an account'}
          onPress={() => router.push(status === 'signedIn' ? '/browse' : '/register')}
          style={styles.button}
        />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 35 },
  hero: { width: '100%', height: 190 },
  title: { color: palette.navy, fontSize: 28, fontWeight: '900', paddingHorizontal: gutter, marginTop: 22 },
  text: { color: palette.muted, fontSize: 14, lineHeight: 22, paddingHorizontal: gutter, marginTop: 10 },
  section: { color: palette.navy, fontSize: 19, fontWeight: '900', marginHorizontal: gutter, marginTop: 26 },
  list: { paddingHorizontal: gutter, gap: 10, marginTop: 13 },
  item: { color: palette.ink, fontSize: 14 },
  button: { marginHorizontal: gutter, marginTop: 28 },
});
