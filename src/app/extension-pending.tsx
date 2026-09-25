import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen, palette } from '@/components/arc-ui';

export default function ExtensionPendingScreen() {
  const router = useRouter();
  return <Screen style={styles.screen}><View style={styles.icon}><Text style={styles.iconText}>✓</Text></View><Text style={styles.title}>Extension request pending</Text><Text style={styles.text}>We sent your request for one additional day. We will notify you once the vehicle availability is confirmed.</Text><View style={styles.summary}><Text style={styles.summaryTitle}>New requested return date</Text><Text style={styles.date}>October 02, 2026</Text></View><Pressable style={styles.button} onPress={() => router.replace('/bookings' as never)}><Text style={styles.buttonText}>Back to my bookings</Text></Pressable></Screen>;
}
const styles = StyleSheet.create({ screen: { padding: 25, alignItems: 'center', justifyContent: 'center' }, icon: { width: 66, height: 66, borderRadius: 33, backgroundColor: '#E3F8F0', alignItems: 'center', justifyContent: 'center' }, iconText: { color: palette.green, fontSize: 32, fontWeight: '900' }, title: { color: palette.navy, fontSize: 25, fontWeight: '900', textAlign: 'center', marginTop: 18 }, text: { color: palette.muted, textAlign: 'center', fontSize: 14, lineHeight: 22, marginTop: 9 }, summary: { backgroundColor: palette.white, borderRadius: 16, width: '100%', alignItems: 'center', padding: 18, marginTop: 24, borderWidth: 1, borderColor: '#E8EDF4' }, summaryTitle: { color: palette.muted, fontSize: 11 }, date: { color: palette.blue, fontSize: 20, fontWeight: '900', marginTop: 6 }, button: { backgroundColor: palette.blue, borderRadius: 14, paddingVertical: 17, alignItems: 'center', width: '100%', marginTop: 20 }, buttonText: { color: palette.white, fontWeight: '800' },
});
