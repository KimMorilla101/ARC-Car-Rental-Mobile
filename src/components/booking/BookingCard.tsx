import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/common/Icon';
import { Pill } from '@/components/common/Pill';
import { palette } from '@/constants/theme';
import type { Booking } from '@/types/booking';
import { bookingStatusLabel, formatFullDate, formatPeso, plural } from '@/utils/formatters';

import { bookingStatusTone, paymentBadge } from './bookingStatusTone';
import { styles } from './BookingCard.styles';

/** Booking card on the My Bookings tab. */
export function BookingCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const payment = paymentBadge[booking.payment.status];
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push({ pathname: '/booking/[id]', params: { id: String(booking.id) } })}
      accessibilityRole="button"
      accessibilityLabel={`${booking.vehicle.name}, ${bookingStatusLabel[booking.status]}`}>
      <View style={styles.row}>
        <Image source={{ uri: booking.vehicle.imageUrl }} style={styles.image} contentFit="cover" />
        <View style={styles.copy}>
          <View style={styles.top}>
            <Text style={styles.reference}>{booking.reference}</Text>
            <Pill tone={bookingStatusTone(booking.status)}>{bookingStatusLabel[booking.status]}</Pill>
          </View>
          <Text style={styles.name}>{booking.vehicle.name}</Text>
          <View style={styles.dateRow}>
            <Icon name="calendar" size={12} color={palette.muted} />
            <Text style={styles.date}>{formatFullDate(booking.pickupAt)}</Text>
            <Icon name="arrow-right" size={12} color={palette.mutedLight} />
          </View>
          <View style={styles.dateRow}>
            <Icon name="calendar" size={12} color={palette.muted} />
            <Text style={styles.date}>{formatFullDate(booking.returnAt)}</Text>
            <Icon name="truck" size={12} color={palette.muted} />
            <Text style={styles.date}>{plural(booking.rentalDays, 'day')}</Text>
          </View>
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.total}>{formatPeso(booking.pricing.total)}</Text>
        <Pill tone={payment.tone}>{payment.label}</Pill>
        <View style={styles.spacer} />
        <Text style={styles.view}>View</Text>
        <Icon name="chevron-right" size={15} color={palette.blue} />
      </View>
    </Pressable>
  );
}
