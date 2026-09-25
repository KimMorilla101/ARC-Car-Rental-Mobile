import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Screen, TopBar, palette } from '@/components/arc-ui';

export default function AboutScreen() {
  const router = useRouter();
  return <Screen><TopBar back title="About ARC Ride" /><ScrollView contentContainerStyle={styles.scroll}><Image source={{ uri: 'https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=85' }} style={styles.hero} contentFit="cover" /><Text style={styles.title}>Drive with confidence.</Text><Text style={styles.text}>ARC Car Rental makes every journey easier with dependable vehicles, clear pricing, and customer-first support across Davao.</Text><Text style={styles.section}>Our mission</Text><Text style={styles.text}>To give every customer a safe, simple, and trustworthy way to move.</Text><Text style={styles.section}>Why customers choose us</Text><View style={styles.list}><Text style={styles.item}>✓ Clean, inspected vehicles</Text><Text style={styles.item}>✓ Transparent rental and fixed fees</Text><Text style={styles.item}>✓ Flexible pickup and delivery</Text><Text style={styles.item}>✓ Support before, during, and after every trip</Text></View><Pressable style={styles.button} onPress={() => router.push('/browse' as never)}><Text style={styles.buttonText}>Browse available cars</Text></Pressable></ScrollView></Screen>;
}
const styles = StyleSheet.create({ scroll: { paddingBottom: 35 }, hero: { width: '100%', height: 190 }, title: { color: palette.navy, fontSize: 28, fontWeight: '900', paddingHorizontal: 20, marginTop: 22 }, text: { color: palette.muted, fontSize: 14, lineHeight: 22, paddingHorizontal: 20, marginTop: 10 }, section: { color: palette.navy, fontSize: 19, fontWeight: '900', marginHorizontal: 20, marginTop: 26 }, list: { paddingHorizontal: 20, gap: 10, marginTop: 13 }, item: { color: palette.ink, fontSize: 14 }, button: { backgroundColor: palette.blue, borderRadius: 14, paddingVertical: 16, alignItems: 'center', margin: 20, marginTop: 28 }, buttonText: { color: palette.white, fontWeight: '800' },
});
