import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { bookingStatusTone } from '@/components/booking/bookingStatusTone';
import { Pill } from '@/components/common/Pill';
import { palette } from '@/constants/theme';
import type { Booking } from '@/types/booking';
import { bookingStatusLabel, formatDateTime } from '@/utils/formatters';

/** Compact card for the renter's current or next booking on Home. */
export function CurrentBookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const returnDue = booking.status === 'return_due';
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/booking/[id]', params: { id: String(booking.id) } })}
      style={({ pressed }) => [styles.card, returnDue && styles.cardWarning, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${booking.vehicle.name}, ${bookingStatusLabel[booking.status]}`}>
      <Image source={{ uri: booking.vehicle.imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.info}>
        <View style={styles.top}>
          <Text style={styles.reference} numberOfLines={1}>
            {booking.reference}
          </Text>
          <Pill tone={bookingStatusTone(booking.status)}>{bookingStatusLabel[booking.status]}</Pill>
        </View>
        <Text style={styles.name} numberOfLines={1}>
          {booking.vehicle.name}
        </Text>
        <Text style={styles.meta}>
          {booking.status === 'active' || returnDue ? `Return by ${formatDateTime(booking.returnAt)}` : `Pickup ${formatDateTime(booking.pickupAt)}`}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          ⌖ Pickup: {booking.pickupLocation}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          → Travel: {booking.destination}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: 18, padding: 12, flexDirection: 'row', borderWidth: 1, borderColor: palette.border },
  cardWarning: { borderColor: palette.amberStrong },
  pressed: { opacity: 0.8 },
  image: { width: 105, height: 112, borderRadius: 13 },
  info: { flex: 1, marginLeft: 13, paddingVertical: 2 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 6 },
  reference: { color: palette.muted, fontSize: 10, fontWeight: '700', flexShrink: 1 },
  name: { color: palette.navy, fontSize: 17, fontWeight: '800', marginTop: 9 },
  meta: { color: palette.muted, fontSize: 11, marginTop: 5 },
});
