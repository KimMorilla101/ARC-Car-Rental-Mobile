import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Pill, Screen, TopBar, palette } from '@/components/arc-ui';
import { cars } from '@/constants/mock-data';

export default function CarDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const car = cars.find((item) => item.id === id) ?? cars[0];
  return <Screen>
    <TopBar back title="Car details" />
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Image source={{ uri: car.image }} style={styles.image} contentFit="cover" />
      <View style={styles.headingRow}><View><Text style={styles.name}>{car.name}</Text><Text style={styles.category}>{car.category}  •  {car.seats} passengers</Text></View><Pill tone="green">Available</Pill></View>
      <View style={styles.ratingRow}><Text style={styles.rating}>★ {car.rating}</Text><Text style={styles.ratingLabel}>Excellent choice for your trip</Text></View>
      <View style={styles.specGrid}><Spec label="Transmission" value={car.transmission} /><Spec label="Fuel type" value={car.fuel} /><Spec label="Doors" value="4 doors" /><Spec label="Air conditioning" value="Included" /></View>
      <Text style={styles.section}>About this vehicle</Text><Text style={styles.description}>{car.description}</Text>
      <Text style={styles.section}>Included features</Text><View style={styles.features}>{car.features.map((feature) => <Text key={feature} style={styles.feature}>✓  {feature}</Text>)}</View>
      <View style={styles.priceCard}><View><Text style={styles.priceLabel}>Daily rate</Text><Text style={styles.price}>₱{car.price.toLocaleString()}<Text style={styles.perDay}> / day</Text></Text></View><Pressable style={styles.button} onPress={() => router.push({ pathname: '/booking' as never, params: { carId: car.id } })}><Text style={styles.buttonText}>Book this car  →</Text></Pressable></View>
    </ScrollView>
  </Screen>;
}

function Spec({ label, value }: { label: string; value: string }) { return <View style={styles.spec}><Text style={styles.specLabel}>{label}</Text><Text style={styles.specValue}>{value}</Text></View>; }

const styles = StyleSheet.create({ scroll: { paddingBottom: 35 }, image: { width: '100%', height: 245 }, headingRow: { paddingHorizontal: 20, marginTop: 19, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }, name: { color: palette.navy, fontSize: 27, fontWeight: '900' }, category: { color: palette.muted, fontSize: 13, marginTop: 5 }, ratingRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 14, alignItems: 'center' }, rating: { color: '#E69A24', fontWeight: '900' }, ratingLabel: { color: palette.muted, fontSize: 12 }, specGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: 20, padding: 15, backgroundColor: palette.white, borderRadius: 16, borderWidth: 1, borderColor: '#E8EDF4' }, spec: { width: '50%', paddingVertical: 9 }, specLabel: { color: palette.muted, fontSize: 11 }, specValue: { color: palette.navy, fontSize: 13, fontWeight: '800', marginTop: 4 }, section: { color: palette.navy, fontSize: 18, fontWeight: '800', marginHorizontal: 20, marginTop: 9, marginBottom: 9 }, description: { color: palette.muted, fontSize: 14, lineHeight: 22, marginHorizontal: 20 }, features: { marginHorizontal: 20, gap: 9 }, feature: { color: palette.ink, fontSize: 13 }, priceCard: { margin: 20, padding: 16, borderRadius: 18, backgroundColor: palette.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, priceLabel: { color: '#9BAEC8', fontSize: 11 }, price: { color: palette.white, fontSize: 22, fontWeight: '900', marginTop: 4 }, perDay: { color: '#B6C3D5', fontSize: 11, fontWeight: '500' }, button: { backgroundColor: palette.blue, paddingHorizontal: 15, paddingVertical: 13, borderRadius: 12 }, buttonText: { color: palette.white, fontWeight: '800', fontSize: 12 },
});
