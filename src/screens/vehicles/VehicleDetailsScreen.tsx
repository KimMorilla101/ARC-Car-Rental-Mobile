import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorState } from '@/components/common/ErrorMessage';
import { Icon, type IconName } from '@/components/common/Icon';
import { VehicleDetailsSkeleton } from '@/components/common/LoadingSkeleton';
import { BackLink } from '@/components/common/PageHeader';
import { Pill } from '@/components/common/Pill';
import { Screen } from '@/components/common/Screen';
import { categoryLabel } from '@/components/vehicles/VehicleCard';
import { VehicleImageGallery } from '@/components/vehicles/VehicleImageGallery';
import { palette } from '@/constants/theme';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useVehicle } from '@/hooks/useVehicles';
import { bookingApi } from '@/services/bookingApi';
import { formatPeso } from '@/utils/formatters';

import { styles } from './VehicleDetailsScreen.styles';

export default function VehicleDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const vehicle = useVehicle(id);
  // Policies come from the same agreement the renter accepts when booking.
  const agreement = useApiQuery('rental-agreement', () => bookingApi.agreement());
  const data = vehicle.data;

  if (vehicle.isLoading || vehicle.error || !data) {
    return (
      <Screen>
        <View style={styles.padded}>
          <BackLink />
        </View>
        {vehicle.isLoading ? <VehicleDetailsSkeleton /> : <ErrorState error={vehicle.error} onRetry={vehicle.refetch} />}
      </Screen>
    );
  }

  const available = data.availableUnits > 0;

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={vehicle.isRefreshing} onRefresh={vehicle.refresh} tintColor={palette.blue} />}>
        <View>
          <VehicleImageGallery images={data.gallery.length ? data.gallery : [data.imageUrl]} name={data.name} />
          <Pressable onPress={() => router.back()} style={[styles.backButton, { top: insets.top + 10 }]} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back">
            <Icon name="chevron-left" size={22} color={palette.navy} />
          </Pressable>
        </View>

        <View style={styles.padded}>
          <View style={styles.badges}>
            {available ? <Pill tone="green">{`● ${data.availableUnits} available`}</Pill> : <Pill tone="red">Fully booked</Pill>}
            {data.isPopular && (
              <Pill tone="blue" icon="trending-up">
                Popular
              </Pill>
            )}
          </View>
          <Text style={styles.name} accessibilityRole="header">
            {data.name}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.category}>{categoryLabel(data.category)}</Text>
            {data.rating !== null && (
              <View style={styles.rating}>
                <Icon name="star" size={14} color={palette.star} />
                <Text style={styles.ratingText}>{data.rating.toFixed(1)}</Text>
                <Text style={styles.reviews}>({data.reviewCount} reviews)</Text>
              </View>
            )}
          </View>

          <View style={styles.specGrid}>
            <Spec icon="users" label="Passengers" value={`${data.seats} pax`} />
            <Spec icon="settings" label="Transmission" value={data.transmission} />
            <Spec icon="droplet" label="Fuel" value={data.fuel} />
            <Spec icon="square" label="Doors" value={data.doors ? String(data.doors) : '—'} />
          </View>

          <Card title="Rates" icon="tag" style={styles.section}>
            <View style={styles.rates}>
              <Rate label="Hourly" value={formatPeso(data.rates.hourly)} />
              <Rate label="Daily" value={formatPeso(data.rates.daily)} highlight />
              <Rate label="Monthly" value={formatPeso(data.rates.monthly)} />
            </View>
          </Card>

          <Text style={styles.heading}>About this vehicle</Text>
          <Text style={styles.paragraph}>{data.description}</Text>

          <Text style={styles.heading}>Included features</Text>
          {data.features.map((feature) => (
            <View key={feature} style={styles.feature}>
              <Icon name="check-circle" size={16} color={palette.green} />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}

          {agreement.data && (
            <>
              <Text style={styles.heading}>Rental policies</Text>
              {agreement.data.sections.slice(0, 7).map((section) => (
                <View key={section.title} style={styles.feature}>
                  <Icon name="info" size={15} color={palette.blue} />
                  <Text style={styles.policy}>{section.body}</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.footerLabel}>Daily rate</Text>
          <Text style={styles.footerPrice}>
            {formatPeso(data.rates.daily)}
            <Text style={styles.footerUnit}>/day</Text>
          </Text>
        </View>
        <Button
          label={available ? 'Book Now' : 'Fully booked'}
          trailingIcon={available ? 'arrow-right' : undefined}
          disabled={!available}
          onPress={() => router.push({ pathname: '/booking/new', params: { vehicleId: String(data.id) } })}
          style={styles.bookButton}
        />
      </View>
    </Screen>
  );
}

function Spec({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.spec}>
      <Icon name={icon} size={18} color={palette.blue} />
      <Text style={styles.specValue}>{value}</Text>
      <Text style={styles.specLabel}>{label}</Text>
    </View>
  );
}

function Rate({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <View style={[styles.rate, highlight && styles.rateHighlight]}>
      <Text style={[styles.rateLabel, highlight && styles.rateLabelHighlight]}>{label}</Text>
      <Text style={[styles.rateValue, highlight && styles.rateValueHighlight]}>{value}</Text>
    </View>
  );
}
