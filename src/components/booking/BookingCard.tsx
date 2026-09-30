import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Pill } from '@/components/common/Pill';
import { palette } from '@/constants/theme';
import type { Booking } from '@/types/booking';
import { bookingStatusLabel, formatDateTime, formatPeso } from '@/utils/formatters';

import { bookingStatusTone } from './bookingStatusTone';

/** Booking list item used on the Bookings tab. */
export function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push({ pathname: '/booking/[id]', params: { id: String(booking.id) } })}
      accessibilityRole="button"
      accessibilityLabel={`${booking.vehicle.name}, ${bookingStatusLabel[booking.status]}`}>
      <Image source={{ uri: booking.vehicle.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
      <View style={styles.body}>
        <View style={styles.top}>
          <Text style={styles.reference}>{booking.reference}</Text>
          <Pill tone={bookingStatusTone(booking.status)}>{bookingStatusLabel[booking.status]}</Pill>
        </View>
        <Text style={styles.name}>{booking.vehicle.name}</Text>
        <Text style={styles.meta}>{formatDateTime(booking.pickupAt)}</Text>
        <Text style={styles.meta}>⌖ {booking.pickupLocation}</Text>
        <View style={styles.bottom}>
          <Text style={styles.total}>{formatPeso(booking.pricing.total)} total</Text>
          <Text style={styles.details}>Details ›</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: 18, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: palette.border },
  pressed: { opacity: 0.8 },
  image: { width: '100%', height: 150 },
  body: { padding: 15 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  reference: { color: palette.muted, fontSize: 10, fontWeight: '800' },
  name: { color: palette.navy, fontSize: 18, fontWeight: '900', marginTop: 11 },
  meta: { color: palette.muted, fontSize: 12, marginTop: 6 },
  bottom: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 15, paddingTop: 12, borderTopWidth: 1, borderTopColor: palette.divider },
  total: { color: palette.navy, fontWeight: '800', fontSize: 13 },
  details: { color: palette.blue, fontWeight: '800', fontSize: 12 },
});
