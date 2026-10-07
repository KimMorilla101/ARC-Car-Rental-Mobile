import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { bookingStatusTone } from '@/components/booking/bookingStatusTone';
import { Icon } from '@/components/common/Icon';
import { Pill } from '@/components/common/Pill';
import { palette } from '@/constants/theme';
import type { Booking } from '@/types/booking';
import { bookingStatusLabel, formatFullDate, formatMonthDay, formatPeso, plural } from '@/utils/formatters';

import { styles } from './BookingRow.styles';

/** Compact booking row used on Home ("Upcoming Bookings", "Recent Rentals"). */
export function BookingRow({ booking, showRange = false }: { booking: Booking; showRange?: boolean }) {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/booking/[id]', params: { id: String(booking.id) } })}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${booking.vehicle.name}, ${bookingStatusLabel[booking.status]}`}>
      <Image source={{ uri: booking.vehicle.imageUrl }} style={styles.image} contentFit="cover" />
      <View style={styles.copy}>
        <View style={styles.top}>
          <Text style={styles.name} numberOfLines={1}>
            {booking.vehicle.name}
          </Text>
          <Pill tone={bookingStatusTone(booking.status)}>{bookingStatusLabel[booking.status]}</Pill>
        </View>
        {showRange ? (
          <Text style={styles.meta}>
            {formatMonthDay(booking.pickupAt)} – {formatFullDate(booking.returnAt)} · {plural(booking.rentalDays, 'day')}
          </Text>
        ) : (
          <>
            <Text style={styles.reference}>{booking.reference}</Text>
            <View style={styles.dateRow}>
              <Icon name="calendar" size={12} color={palette.muted} />
              <Text style={styles.meta}>{formatFullDate(booking.pickupAt)}</Text>
            </View>
          </>
        )}
      </View>
      <Text style={styles.price}>{formatPeso(booking.pricing.total)}</Text>
    </Pressable>
  );
}
