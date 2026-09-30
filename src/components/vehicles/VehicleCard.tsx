import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import type { Vehicle } from '@/types/vehicle';
import { formatPeso } from '@/utils/formatters';

export function VehicleCard({ vehicle, compact = false }: { vehicle: Vehicle; compact?: boolean }) {
  const router = useRouter();
  const available = vehicle.availableUnits > 0;
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/vehicle/[id]', params: { id: String(vehicle.id) } })}
      accessibilityRole="button"
      accessibilityLabel={`${vehicle.name}, ${formatPeso(vehicle.rates.daily)} per day`}
      style={({ pressed }) => [styles.card, compact && styles.compact, pressed && styles.pressed]}>
      <Image source={{ uri: vehicle.imageUrl }} style={compact ? styles.imageCompact : styles.image} contentFit="cover" transition={200} />
      <View style={styles.body}>
        <View style={styles.nameRow}>
          <View style={styles.nameColumn}>
            <Text style={styles.name} numberOfLines={1}>
              {vehicle.name}
            </Text>
            <Text style={styles.category}>
              {vehicle.category} • {vehicle.seats} seats
            </Text>
            <Text style={[styles.availability, !available && styles.unavailable]}>
              {available ? `${vehicle.availableUnits} unit${vehicle.availableUnits === 1 ? '' : 's'} available` : 'Fully booked'}
            </Text>
          </View>
          {vehicle.rating !== null && <Text style={styles.rating}>★ {vehicle.rating.toFixed(1)}</Text>}
        </View>
        {!compact && (
          <View style={styles.specRow}>
            <Text style={styles.spec}>A {vehicle.transmission}</Text>
            <Text style={styles.spec}>● {vehicle.fuel}</Text>
          </View>
        )}
        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>
              {formatPeso(vehicle.rates.daily)}
              <Text style={styles.perDay}> / day</Text>
            </Text>
            {vehicle.matchScore !== null && <Text style={styles.match}>{vehicle.matchScore}% match</Text>}
          </View>
          <Text style={styles.viewLink}>View details ›</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: 18, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: palette.border },
  compact: { width: 260, marginRight: 14 },
  pressed: { opacity: 0.78 },
  image: { width: '100%', height: 170 },
  imageCompact: { width: '100%', height: 135 },
  body: { padding: 15 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  nameColumn: { flex: 1 },
  name: { color: palette.navy, fontSize: 17, fontWeight: '800' },
  category: { color: palette.muted, fontSize: 12, marginTop: 4 },
  availability: { color: palette.green, fontSize: 10, fontWeight: '800', marginTop: 4 },
  unavailable: { color: palette.danger },
  rating: { color: palette.star, fontSize: 12, fontWeight: '800' },
  specRow: { flexDirection: 'row', gap: 18, marginTop: 16 },
  spec: { color: palette.muted, fontSize: 11 },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 15 },
  price: { color: palette.navy, fontSize: 18, fontWeight: '900' },
  perDay: { color: palette.muted, fontSize: 11, fontWeight: '500' },
  match: { color: palette.green, fontSize: 11, fontWeight: '800', marginTop: 3 },
  viewLink: { color: palette.blue, fontSize: 12, fontWeight: '800' },
});
