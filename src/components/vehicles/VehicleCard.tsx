import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Pill } from '@/components/common/Pill';
import { palette } from '@/constants/theme';
import type { Vehicle } from '@/types/vehicle';
import { formatPeso } from '@/utils/formatters';

import { styles } from './VehicleCard.styles';

export const categoryLabel = (category: Vehicle['category']) => (category === 'MPV' ? 'Van/MPV' : category);

/**
 * Vehicle card from the Figma design.
 * `featured` (Home): price shown on the photo. `list` (Browse): price beside the name, plus description and spec chips.
 */
export function VehicleCard({ vehicle, variant = 'list' }: { vehicle: Vehicle; variant?: 'featured' | 'list' }) {
  const router = useRouter();
  const available = vehicle.availableUnits > 0;
  const id = String(vehicle.id);
  const openDetails = () => router.push({ pathname: '/vehicle/[id]', params: { id } });
  const book = () => router.push({ pathname: '/booking/new', params: { vehicleId: id } });
  const featured = variant === 'featured';

  return (
    <View style={styles.card}>
      <Pressable onPress={openDetails} accessibilityRole="imagebutton" accessibilityLabel={`${vehicle.name} details`}>
        <Image source={{ uri: vehicle.imageUrl }} style={styles.image} contentFit="cover" transition={200} />
        <View style={styles.badgeLeft}>
          {available ? <Pill tone="solidGreen">● Available</Pill> : <Pill tone="red">Fully booked</Pill>}
        </View>
        {vehicle.isPopular && (
          <View style={styles.badgeRight}>
            <Pill tone="solidBlue" icon="trending-up">Popular</Pill>
          </View>
        )}
        {featured && (
          <View style={styles.priceTag}>
            <Text style={styles.priceTagValue}>
              {formatPeso(vehicle.rates.daily)}
              <Text style={styles.priceTagUnit}>/day</Text>
            </Text>
          </View>
        )}
      </Pressable>

      <View style={styles.body}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {vehicle.name}
          </Text>
          {featured ? (
            vehicle.rating !== null && <Rating value={vehicle.rating} />
          ) : (
            <View style={styles.priceBlock}>
              <Text style={styles.price}>{formatPeso(vehicle.rates.daily)}</Text>
              <Text style={styles.perDay}>/day</Text>
            </View>
          )}
        </View>
        <Text style={styles.category}>{categoryLabel(vehicle.category)}</Text>

        {featured ? (
          <View style={styles.specLine}>
            <Icon name="users" size={13} color={palette.muted} />
            <Text style={styles.specText}>{vehicle.seats}</Text>
            <Text style={styles.specDivider}>|</Text>
            <Text style={styles.specText}>{vehicle.transmission}</Text>
            <Text style={styles.specDivider}>|</Text>
            <Text style={styles.specText}>{vehicle.fuel}</Text>
          </View>
        ) : (
          <>
            {vehicle.rating !== null && (
              <View style={styles.ratingRow}>
                <Rating value={vehicle.rating} />
                <Text style={styles.reviews}>({vehicle.reviewCount} reviews)</Text>
              </View>
            )}
            <Text style={styles.description} numberOfLines={2}>
              {vehicle.description}
            </Text>
            <View style={styles.chips}>
              <Text style={styles.chip}>{vehicle.seats} pax</Text>
              <Text style={styles.chip}>{vehicle.transmission}</Text>
              <Text style={styles.chip}>{vehicle.fuel}</Text>
            </View>
          </>
        )}

        <View style={styles.actions}>
          <Button label={featured ? 'Details' : 'View Details'} variant="outline" size="sm" onPress={openDetails} style={styles.action} />
          <Button label="Book Now" size="sm" onPress={book} disabled={!available} style={styles.action} />
        </View>
      </View>
    </View>
  );
}

function Rating({ value }: { value: number }) {
  return (
    <View style={styles.rating} accessibilityLabel={`Rated ${value.toFixed(1)} out of 5`}>
      <Icon name="star" size={13} color={palette.star} />
      <Text style={styles.ratingText}>{value.toFixed(1)}</Text>
    </View>
  );
}
