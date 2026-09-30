import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BookingCard } from '@/components/booking/BookingCard';
import { ChoiceChip } from '@/components/common/ChoiceChip';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorMessage';
import { BookingListSkeleton } from '@/components/common/LoadingSkeleton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { palette } from '@/constants/theme';
import { useRefetchOnFocus } from '@/hooks/useApiQuery';
import { useBookings } from '@/hooks/useBookings';
import type { BookingListFilter } from '@/types/booking';

const filters: { value: BookingListFilter; label: string; empty: string }[] = [
  { value: 'all', label: 'All', empty: 'You have not booked a car yet.' },
  { value: 'upcoming', label: 'Upcoming', empty: 'No upcoming bookings.' },
  { value: 'active', label: 'Active', empty: 'You have no car out right now.' },
  { value: 'completed', label: 'Completed', empty: 'No completed rentals yet.' },
  { value: 'cancelled', label: 'Cancelled', empty: 'No cancelled bookings.' },
];

/** "My bookings" tab: upcoming, active, completed and cancelled rentals. */
export default function RentalHistoryScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<BookingListFilter>('all');
  const bookings = useBookings(filter);
  useRefetchOnFocus(bookings.refetch);
  const current = filters.find((item) => item.value === filter) ?? filters[0];

  return (
    <Screen edges={['top', 'left', 'right']}>
      <TopBar title="My bookings" />
      <FlatList
        data={bookings.error ? [] : (bookings.data ?? [])}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={screenStyles.tabScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={bookings.isRefreshing} onRefresh={bookings.refresh} tintColor={palette.blue} />}
        ListHeaderComponent={
          <View>
            <Text style={screenStyles.title}>Your reservations</Text>
            <Text style={screenStyles.subtitle}>Keep track of every ARC Ride journey.</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filters}>
              {filters.map((item) => (
                <ChoiceChip key={item.value} label={item.label} active={filter === item.value} onPress={() => setFilter(item.value)} />
              ))}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          bookings.isLoading ? (
            <BookingListSkeleton />
          ) : bookings.error ? (
            <ErrorState error={bookings.error} onRetry={bookings.refetch} />
          ) : (
            <EmptyState title="Nothing here yet" message={current.empty} actionLabel="Browse cars" onAction={() => router.push('/browse')} />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filters: { gap: 8, paddingVertical: 19 },
});
