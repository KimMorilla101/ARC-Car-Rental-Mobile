import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Icon } from '@/components/common/Icon';
import { palette, gradients } from '@/constants/theme';
import type { Booking } from '@/types/booking';
import { formatFullDate, formatTime } from '@/utils/formatters';

import { styles } from './ActiveRentalCard.styles';

/** Green "Currently Active" card on Home; turns red when the return deadline has passed. */
export function ActiveRentalCard({ booking }: { booking: Booking }) {
  const router = useRouter();
  const overdue = booking.status === 'return_due';
  return (
    <LinearGradient colors={overdue ? ['#EF4444', '#B91C1C'] : gradients.green} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: booking.vehicle.imageUrl }} style={styles.image} contentFit="cover" />
        <View style={styles.copy}>
          <View style={styles.statusRow}>
            <View style={styles.dot} />
            <Text style={styles.status}>{overdue ? 'RETURN OVERDUE' : 'CURRENTLY ACTIVE'}</Text>
          </View>
          <Text style={styles.name} numberOfLines={1}>
            {booking.vehicle.name}
          </Text>
          <View style={styles.returnRow}>
            <Icon name="clock" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.returnText}>
              Return: {formatFullDate(booking.returnAt)}, {formatTime(booking.returnAt)}
            </Text>
          </View>
        </View>
      </View>
      <Pressable
        onPress={() => router.push({ pathname: '/booking/[id]', params: { id: String(booking.id) } })}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
        accessibilityRole="button">
        <Text style={styles.buttonText}>{overdue ? 'Return Vehicle' : 'View Details'}</Text>
        <Icon name="chevron-right" size={16} color={palette.white} />
      </Pressable>
    </LinearGradient>
  );
}
