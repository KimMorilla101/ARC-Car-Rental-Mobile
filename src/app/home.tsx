import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { BottomNav, CarCard, Pill, Screen, SearchField, SectionTitle, TopBar, palette, styles as ui } from '@/components/arc-ui';
import { bookings, cars } from '@/constants/mock-data';

export default function HomeScreen() {
  const router = useRouter();
  const upcoming = bookings[0];
  return <Screen>
    <TopBar action={<Text style={styles.bell}>◌</Text>} />
    <ScrollView contentContainerStyle={ui.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.greeting}>Good morning, Juan</Text>
      <Text style={styles.heading}>Where will you go next?</Text>
      <Text style={styles.subheading}>Find a car that fits the journey.</Text>
      <View style={styles.searchCard}>
        <Text style={styles.searchLabel}>SEARCH AVAILABLE CARS</Text>
        <SearchField placeholder="Pickup location" />
        <View style={styles.dateRow}><View style={styles.dateBox}><Text style={styles.dateLabel}>PICKUP</Text><Text style={styles.dateText}>Sep 28, 2026</Text></View><View style={styles.dateBox}><Text style={styles.dateLabel}>RETURN</Text><Text style={styles.dateText}>Oct 01, 2026</Text></View></View>
        <View style={styles.searchButton}><Text style={styles.searchButtonText} onPress={() => router.push('/browse' as never)}>Search cars  →</Text></View>
      </View>
      <View style={styles.trustCard}><View><Text style={styles.trustLabel}>YOUR ARC TRUST SCORE</Text><Text style={styles.trustCopy}>Visible to you, managed by ARC Car Rental</Text></View><Text style={styles.trustValue}>{upcoming.trustScore}%</Text></View>
      <SectionTitle title="Your current rental" action="View all" onPress={() => router.push('/bookings' as never)} />
      <View style={styles.bookingCard}>
        <Image source={{ uri: upcoming.car.image }} style={styles.bookingImage} contentFit="cover" />
        <View style={styles.bookingInfo}><View style={styles.bookingTop}><Text style={styles.bookingId}>{upcoming.id}</Text><Pill tone="green">{upcoming.status}</Pill></View><Text style={styles.bookingCar}>{upcoming.car.name}</Text><Text style={styles.bookingDate}>{upcoming.pickup} • {upcoming.pickupTime}</Text><Text style={styles.bookingLocation}>⌖  Pickup: {upcoming.location}</Text><Text style={styles.bookingLocation}>→  Travel: {upcoming.destination}</Text></View>
      </View>
      <SectionTitle title="Recommended for you" action="See all" onPress={() => router.push('/browse' as never)} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontal}><CarCard car={cars[0]} compact /><CarCard car={cars[1]} compact /></ScrollView>
      <SectionTitle title="Quick actions" />
      <View style={styles.quickRow}><View style={styles.quickItem}><Text style={styles.quickIcon}>⌕</Text><Text style={styles.quickLabel}>Browse cars</Text></View><View style={styles.quickItem}><Text style={styles.quickIcon}>☆</Text><Text style={styles.quickLabel}>Smart match</Text></View><View style={styles.quickItem}><Text style={styles.quickIcon}>?</Text><Text style={styles.quickLabel}>Help center</Text></View></View>
    </ScrollView>
    <BottomNav active="home" />
  </Screen>;
}

const styles = StyleSheet.create({
  greeting: { color: palette.blue, fontSize: 13, fontWeight: '800', marginTop: 8 }, heading: { color: palette.navy, fontSize: 30, fontWeight: '900', letterSpacing: -0.8, marginTop: 5 }, subheading: { color: palette.muted, fontSize: 14, marginTop: 6 },
  searchCard: { backgroundColor: palette.navy, borderRadius: 20, padding: 18, marginTop: 22 }, searchLabel: { color: '#91B9FF', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 11 }, dateRow: { flexDirection: 'row', gap: 10, marginTop: 10 }, dateBox: { flex: 1, borderRadius: 12, backgroundColor: '#1E3150', padding: 12 }, dateLabel: { color: '#98A9C0', fontSize: 10, fontWeight: '800' }, dateText: { color: palette.white, fontSize: 13, fontWeight: '700', marginTop: 6 }, searchButton: { height: 44, borderRadius: 12, backgroundColor: palette.blue, alignItems: 'center', justifyContent: 'center', marginTop: 12 }, searchButtonText: { color: palette.white, fontSize: 14, fontWeight: '800' },
  trustCard: { backgroundColor: palette.navy, borderRadius: 16, padding: 16, marginTop: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, trustLabel: { color: '#93B9F5', fontSize: 10, fontWeight: '800', letterSpacing: 1 }, trustCopy: { color: '#A9B7CA', fontSize: 11, marginTop: 5 }, trustValue: { color: palette.white, fontSize: 27, fontWeight: '900' }, bookingCard: { backgroundColor: palette.white, borderRadius: 18, padding: 12, flexDirection: 'row', borderWidth: 1, borderColor: '#E8EDF4' }, bookingImage: { width: 105, height: 112, borderRadius: 13 }, bookingInfo: { flex: 1, marginLeft: 13, paddingVertical: 2 }, bookingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, bookingId: { color: palette.muted, fontSize: 10, fontWeight: '700' }, bookingCar: { color: palette.navy, fontSize: 17, fontWeight: '800', marginTop: 9 }, bookingDate: { color: palette.muted, fontSize: 11, marginTop: 7 }, bookingLocation: { color: palette.muted, fontSize: 11, marginTop: 5 }, horizontal: { marginHorizontal: -20, paddingLeft: 20 }, bell: { color: palette.navy, fontSize: 27 }, quickRow: { flexDirection: 'row', gap: 10, marginBottom: 10 }, quickItem: { flex: 1, backgroundColor: palette.white, borderRadius: 15, padding: 13, borderWidth: 1, borderColor: '#E8EDF4' }, quickIcon: { color: palette.blue, fontSize: 22 }, quickLabel: { color: palette.navy, fontSize: 11, fontWeight: '800', marginTop: 12 },
});
