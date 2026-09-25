import { ImageBackground } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={{ uri: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85' }}
      style={styles.background}
      contentFit="cover">
      <View style={styles.overlay} />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.mark}><Text style={styles.markText}>A</Text></View>
          <Text style={styles.logo}>ARC <Text style={styles.logoAccent}>RIDE</Text></Text>
          <Text style={styles.headerLabel}>PREMIUM RENTALS</Text>
        </View>
        <View style={styles.content}>
          <View style={styles.eyebrow}><View style={styles.dot} /><Text style={styles.eyebrowText}>DAVAO CITY&apos;S TRUSTED CAR RENTAL</Text></View>
          <Text style={styles.title}>Your journey.{ '\n' }Your way.</Text>
          <Text style={styles.subtitle}>Premium cars, transparent pricing, and a smoother way to get where you are going.</Text>
          <View style={styles.featureRow}>
            <View><Text style={styles.featureValue}>50+</Text><Text style={styles.featureLabel}>Premium cars</Text></View>
            <View><Text style={styles.featureValue}>4.8</Text><Text style={styles.featureLabel}>Average rating</Text></View>
            <View><Text style={styles.featureValue}>24/7</Text><Text style={styles.featureLabel}>Road support</Text></View>
          </View>
          <Pressable style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} onPress={() => router.push('/login')}>
            <Text style={styles.primaryButtonText}>Start your ride</Text><Text style={styles.arrow}>→</Text>
          </Pressable>
          <Pressable style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]} onPress={() => router.push('/register' as never)}>
            <Text style={styles.secondaryButtonText}>Create an account</Text>
          </Pressable>
        </View>
        <Text style={styles.footer}>PAY IN PERSON  •  NO HIDDEN FEES</Text>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#07101B' },
  overlay: { flex: 1, position: 'absolute', width: '100%', height: '100%', backgroundColor: 'rgba(4, 13, 24, 0.72)' },
  safeArea: { flex: 1, paddingHorizontal: 28, justifyContent: 'space-between' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 12 },
  mark: { width: 36, height: 36, borderRadius: 11, backgroundColor: '#2F7CF6', justifyContent: 'center', alignItems: 'center' },
  markText: { color: '#FFFFFF', fontSize: 22, fontWeight: '900' },
  logo: { color: '#FFFFFF', fontSize: 18, fontWeight: '800', letterSpacing: 1, marginLeft: 10 },
  logoAccent: { color: '#6AA4FF' },
  headerLabel: { color: '#AAB6C7', fontSize: 9, letterSpacing: 1.5, marginLeft: 'auto' },
  content: { paddingBottom: 26 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#4C91FF', marginRight: 8 },
  eyebrowText: { color: '#86B4FF', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#FFFFFF', fontSize: 52, lineHeight: 56, fontWeight: '800', letterSpacing: -1.5 },
  subtitle: { color: '#C7D3E4', fontSize: 16, lineHeight: 25, marginTop: 18, maxWidth: 340 },
  featureRow: { flexDirection: 'row', gap: 28, marginTop: 30, marginBottom: 30 },
  featureValue: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  featureLabel: { color: '#94A5BB', fontSize: 11, marginTop: 4 },
  primaryButton: { height: 56, borderRadius: 16, backgroundColor: '#347FF5', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 12 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFFFFF', fontSize: 22 },
  secondaryButton: { height: 54, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.28)', justifyContent: 'center', alignItems: 'center', marginTop: 12 },
  secondaryButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
  footer: { color: '#8292A8', fontSize: 10, letterSpacing: 1.4, textAlign: 'center', paddingBottom: 12 },
  pressed: { opacity: 0.78 },
});
