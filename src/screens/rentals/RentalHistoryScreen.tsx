import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, ScrollView, View } from 'react-native';

import { BookingCard } from '@/components/booking/BookingCard';
import { ChoiceChip } from '@/components/common/ChoiceChip';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorMessage';
import { BookingListSkeleton } from '@/components/common/LoadingSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { useRefetchOnFocus } from '@/hooks/useApiQuery';
import { useBookings } from '@/hooks/useBookings';
import type { BookingStatus } from '@/types/booking';
import { bookingStatusLabel } from '@/utils/formatters';

import { styles } from './RentalHistoryScreen.styles';

// Tab order from the Figma design. "Active" also covers rentals that are overdue for return.
const tabs: { key: string; label: string; statuses: BookingStatus[] }[] = [
  { key: 'pending', label: bookingStatusLabel.pending, statuses: ['pending'] },
  { key: 'pending_verification', label: bookingStatusLabel.pending_verification, statuses: ['pending_verification'] },
  { key: 'confirmed', label: bookingStatusLabel.confirmed, statuses: ['confirmed'] },
  { key: 'active', label: 'Active', statuses: ['active', 'return_due'] },
  { key: 'completed', label: bookingStatusLabel.completed, statuses: ['completed', 'returned'] },
  { key: 'cancelled', label: bookingStatusLabel.cancelled, statuses: ['cancelled'] },
];

/** "My Bookings" tab: every reservation, filterable by status with counts. */
export default function RentalHistoryScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('all');
  const bookings = useBookings('all');
  useRefetchOnFocus(bookings.refetch);

  const all = bookings.data ?? [];
  const current = tabs.find((item) => item.key === tab);
  const visible = current ? all.filter((item) => current.statuses.includes(item.status)) : all;
  const count = (statuses: BookingStatus[]) => all.filter((item) => statuses.includes(item.status)).length;

  return (
    <Screen edges={['top', 'left', 'right']}>
      <FlatList
        data={bookings.error ? [] : visible}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <BookingCard booking={item} />}
        contentContainerStyle={screenStyles.tabScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={bookings.isRefreshing} onRefresh={bookings.refresh} tintColor={palette.blue} />}
        ListHeaderComponent={
          <View>
            <PageHeader title="My Bookings" subtitle={bookings.data ? `${all.length} total reservation${all.length === 1 ? '' : 's'}` : 'Your reservations'} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabs}>
              <ChoiceChip label="All" active={tab === 'all'} onPress={() => setTab('all')} />
              {tabs.map((item) => {
                const total = count(item.statuses);
                // Hide empty statuses to keep the row short, but never hide the selected one.
                if (total === 0 && tab !== item.key) return null;
                return <ChoiceChip key={item.key} label={`${item.label} (${total})`} active={tab === item.key} onPress={() => setTab(item.key)} />;
              })}
            </ScrollView>
          </View>
        }
        ListEmptyComponent={
          bookings.isLoading ? (
            <BookingListSkeleton />
          ) : bookings.error ? (
            <ErrorState error={bookings.error} onRetry={bookings.refetch} />
          ) : (
            <EmptyState
              icon="book-open"
              title={current ? `No ${current.label.toLowerCase()} bookings` : 'No bookings yet'}
              message="When you book a car, it will show up here."
              actionLabel="Browse Cars"
              onAction={() => router.push('/browse')}
            />
          )
        }
      />
    </Screen>
  );
}
