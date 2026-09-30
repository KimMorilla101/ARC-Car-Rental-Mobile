import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { DateTimeField } from '@/components/booking/DateTimeField';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { SearchField } from '@/components/common/SearchField';
import { palette } from '@/constants/theme';
import { addDays, defaultPickup, startOfDay, withTimeOf } from '@/utils/bookingDates';

/** Home search: opens Browse filtered by name/type and by availability for the chosen dates. */
export function SearchCard() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [pickup, setPickup] = useState(defaultPickup);
  const [returnDate, setReturnDate] = useState(() => addDays(defaultPickup(), 3));

  const onPickupChange = (date: Date) => {
    const next = withTimeOf(date, pickup);
    setPickup(next);
    if (startOfDay(returnDate) <= startOfDay(next)) setReturnDate(addDays(next, 1));
  };

  const onSearch = () => {
    router.push({
      pathname: '/browse',
      params: { search: search.trim(), pickupAt: pickup.toISOString(), returnAt: withTimeOf(returnDate, pickup).toISOString() },
    });
  };

  return (
    <View style={styles.card}>
      <Text style={styles.label}>SEARCH AVAILABLE CARS</Text>
      <SearchField placeholder="Car name or type" value={search} onChangeText={setSearch} onSubmitEditing={onSearch} />
      <View style={styles.dates}>
        <DateTimeField tone="dark" label="Pickup" mode="date" value={pickup} minimumDate={new Date()} onChange={onPickupChange} />
        <DateTimeField tone="dark" label="Return" mode="date" value={returnDate} minimumDate={addDays(pickup, 1)} onChange={setReturnDate} />
      </View>
      <PrimaryButton label="Search cars  →" onPress={onSearch} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.navy, borderRadius: 20, padding: 18, marginTop: 22 },
  label: { color: '#91B9FF', fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 11 },
  dates: { flexDirection: 'row', gap: 10, marginTop: 10 },
  button: { minHeight: 44, borderRadius: 12, marginTop: 12 },
});
