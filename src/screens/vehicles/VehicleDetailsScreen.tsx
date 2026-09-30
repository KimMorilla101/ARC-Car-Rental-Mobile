import { useLocalSearchParams, useRouter } from 'expo-router';
import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '@/components/common/ErrorMessage';
import { VehicleDetailsSkeleton } from '@/components/common/LoadingSkeleton';
import { Pill } from '@/components/common/Pill';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { VehicleImageGallery } from '@/components/vehicles/VehicleImageGallery';
import { gutter, palette } from '@/constants/theme';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useVehicle } from '@/hooks/useVehicles';
import { bookingApi } from '@/services/bookingApi';
import { formatPeso } from '@/utils/formatters';

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicle = useVehicle(id);
  // Policies come from the same agreement the renter accepts when booking.
  const agreement = useApiQuery('rental-agreement', () => bookingApi.agreement());

  return (
    <Screen>
      <TopBar back title="Car details" />
      {vehicle.isLoading ? (
        <VehicleDetailsSkeleton />
      ) : vehicle.error || !vehicle.data ? (
        <ErrorState error={vehicle.error} onRetry={vehicle.refetch} />
      ) : (
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={vehicle.isRefreshing} onRefresh={vehicle.refresh} tintColor={palette.blue} />}>
          <VehicleImageGallery images={vehicle.data.gallery.length ? vehicle.data.gallery : [vehicle.data.imageUrl]} name={vehicle.data.name} />
          <View style={styles.headingRow}>
            <View style={styles.headingCopy}>
              <Text style={styles.name} accessibilityRole="header">
                {vehicle.data.name}
              </Text>
              <Text style={styles.category}>
                {vehicle.data.category} • {vehicle.data.seats} passengers
              </Text>
            </View>
            {vehicle.data.availableUnits > 0 ? (
              <Pill tone="green">{`${vehicle.data.availableUnits} available`}</Pill>
            ) : (
              <Pill tone="red">Fully booked</Pill>
            )}
          </View>
          {vehicle.data.rating !== null && (
            <View style={styles.ratingRow}>
              <Text style={styles.rating}>★ {vehicle.data.rating.toFixed(1)}</Text>
              <Text style={styles.ratingLabel}>Rated by ARC renters</Text>
            </View>
          )}
          <View style={styles.specGrid}>
            <Spec label="Transmission" value={vehicle.data.transmission} />
            <Spec label="Fuel type" value={vehicle.data.fuel} />
            <Spec label="Seats" value={`${vehicle.data.seats} seats`} />
            <Spec label="Doors" value={vehicle.data.doors ? `${vehicle.data.doors} doors` : '—'} />
          </View>

          <Text style={styles.section}>Rates</Text>
          <View style={styles.rates}>
            <Spec label="Hourly" value={formatPeso(vehicle.data.rates.hourly)} />
            <Spec label="Daily" value={formatPeso(vehicle.data.rates.daily)} />
            <Spec label="Monthly" value={formatPeso(vehicle.data.rates.monthly)} />
          </View>

          <Text style={styles.section}>About this vehicle</Text>
          <Text style={styles.description}>{vehicle.data.description}</Text>

          <Text style={styles.section}>Included features</Text>
          <View style={styles.list}>
            {vehicle.data.features.map((feature) => (
              <Text key={feature} style={styles.listItem}>
                ✓ {feature}
              </Text>
            ))}
          </View>

          {agreement.data && (
            <>
              <Text style={styles.section}>Rental policies</Text>
              <View style={styles.list}>
                {agreement.data.clauses.map((clause) => (
                  <Text key={clause} style={styles.policy}>
                    • {clause}
                  </Text>
                ))}
              </View>
            </>
          )}

          <View style={styles.priceCard}>
            <View>
              <Text style={styles.priceLabel}>Daily rate</Text>
              <Text style={styles.price}>
                {formatPeso(vehicle.data.rates.daily)}
                <Text style={styles.perDay}> / day</Text>
              </Text>
            </View>
            <PrimaryButton
              label={vehicle.data.availableUnits > 0 ? 'Book this car  →' : 'Fully booked'}
              disabled={vehicle.data.availableUnits === 0}
              onPress={() => router.push({ pathname: '/booking/new', params: { vehicleId: String(vehicle.data?.id) } })}
              style={styles.bookButton}
            />
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.spec}>
      <Text style={styles.specLabel}>{label}</Text>
      <Text style={styles.specValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingBottom: 35 },
  headingRow: { paddingHorizontal: gutter, marginTop: 19, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  headingCopy: { flex: 1 },
  name: { color: palette.navy, fontSize: 27, fontWeight: '900' },
  category: { color: palette.muted, fontSize: 13, marginTop: 5 },
  ratingRow: { flexDirection: 'row', gap: 10, paddingHorizontal: gutter, marginTop: 14, alignItems: 'center' },
  rating: { color: palette.star, fontWeight: '900' },
  ratingLabel: { color: palette.muted, fontSize: 12 },
  specGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: gutter, padding: 15, backgroundColor: palette.white, borderRadius: 16, borderWidth: 1, borderColor: palette.border },
  rates: { flexDirection: 'row', marginHorizontal: gutter, padding: 15, backgroundColor: palette.white, borderRadius: 16, borderWidth: 1, borderColor: palette.border },
  spec: { flexGrow: 1, flexBasis: '33%', minWidth: '45%', paddingVertical: 9 },
  specLabel: { color: palette.muted, fontSize: 11 },
  specValue: { color: palette.navy, fontSize: 13, fontWeight: '800', marginTop: 4 },
  section: { color: palette.navy, fontSize: 18, fontWeight: '800', marginHorizontal: gutter, marginTop: 20, marginBottom: 9 },
  description: { color: palette.muted, fontSize: 14, lineHeight: 22, marginHorizontal: gutter },
  list: { marginHorizontal: gutter, gap: 9 },
  listItem: { color: palette.ink, fontSize: 13 },
  policy: { color: palette.muted, fontSize: 12, lineHeight: 18 },
  priceCard: { margin: gutter, marginTop: 24, padding: 16, borderRadius: 18, backgroundColor: palette.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 10 },
  priceLabel: { color: '#9BAEC8', fontSize: 11 },
  price: { color: palette.white, fontSize: 22, fontWeight: '900', marginTop: 4 },
  perDay: { color: '#B6C3D5', fontSize: 11, fontWeight: '500' },
  bookButton: { marginTop: 0, minHeight: 44, flexShrink: 1 },
});
