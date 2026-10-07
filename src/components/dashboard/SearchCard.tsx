import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { DateTimeField } from '@/components/booking/DateTimeField';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Select } from '@/components/common/Select';
import { palette } from '@/constants/theme';
import { addDays, defaultPickup, startOfDay, withTimeOf } from '@/utils/bookingDates';

import { styles } from './SearchCard.styles';

const passengerOptions = [
  { value: '', label: 'Any' },
  { value: '2', label: '2+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
  { value: '7', label: '7+' },
  { value: '12', label: '12+' },
];

/** Search card that overlaps the Home hero; opens Browse filtered by availability and seats. */
export function SearchCard() {
  const router = useRouter();
  const [pickup, setPickup] = useState(defaultPickup);
  const [returnDate, setReturnDate] = useState(() => addDays(defaultPickup(), 3));
  const [passengers, setPassengers] = useState('');

  const onPickupChange = (date: Date) => {
    const next = withTimeOf(date, pickup);
    setPickup(next);
    if (startOfDay(returnDate) <= startOfDay(next)) setReturnDate(addDays(next, 1));
  };

  const onSearch = () => {
    router.push({
      pathname: '/browse',
      params: { pickupAt: pickup.toISOString(), returnAt: withTimeOf(returnDate, pickup).toISOString(), minSeats: passengers || undefined },
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>PICKUP LOCATION</Text>
      <View style={styles.location}>
        <Icon name="map-pin" size={16} color={palette.blue} />
        <Text style={styles.locationText}>Davao City</Text>
      </View>
      <DateTimeField label="Pickup date" mode="date" value={pickup} minimumDate={new Date()} onChange={onPickupChange} />
      <DateTimeField label="Return date" mode="date" value={returnDate} minimumDate={addDays(pickup, 1)} onChange={setReturnDate} />
      <Text style={[styles.label, styles.passengersLabel]}>PASSENGERS</Text>
      <View style={styles.row}>
        <View style={styles.flex}>
          <Select accessibilityLabel="Passengers" value={passengers} options={passengerOptions} onChange={setPassengers} />
        </View>
        <Button label="Search" icon="search" size="sm" onPress={onSearch} style={styles.search} />
      </View>
    </View>
  );
}
