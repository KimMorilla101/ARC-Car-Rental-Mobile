import { useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { CurrentBookingCard } from '@/components/dashboard/CurrentBookingCard';
import { NotificationItem } from '@/components/dashboard/NotificationPreview';
import { SearchCard } from '@/components/dashboard/SearchCard';
import { TrustScoreCard } from '@/components/dashboard/TrustScoreCard';
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorMessage';
import { Skeleton, VehicleCardSkeleton } from '@/components/common/LoadingSkeleton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { SectionTitle } from '@/components/common/SectionTitle';
import { TopBar } from '@/components/common/TopBar';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { gutter, palette } from '@/constants/theme';
import { useRefetchOnFocus } from '@/hooks/useApiQuery';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useNotifications } from '@/hooks/useNotifications';
import { useHomeFeed } from '@/hooks/useVehicles';
import type { Booking } from '@/types/booking';
import type { Vehicle } from '@/types/vehicle';

/** The booking to feature on Home: an overdue or active rental first, then the next upcoming one. */
function pickCurrentBooking(bookings: Booking[]): Booking | undefined {
  const byPriority = (statuses: Booking['status'][]) => bookings.find((item) => statuses.includes(item.status));
  const upcoming = bookings
    .filter((item) => ['pending', 'pending_verification', 'confirmed'].includes(item.status))
    .sort((a, b) => a.pickupAt.localeCompare(b.pickupAt));
  return byPriority(['return_due']) ?? byPriority(['active']) ?? upcoming[0];
}

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const feed = useHomeFeed();
  const bookings = useBookings('all');
  const notifications = useNotifications();
  useRefetchOnFocus(bookings.refetch);
  useRefetchOnFocus(notifications.refetch);

  if (!user) return null;

  const current = bookings.data ? pickCurrentBooking(bookings.data) : undefined;
  const unread = notifications.data?.filter((item) => !item.readAt).slice(0, 2) ?? [];
  const refreshing = feed.isRefreshing || bookings.isRefreshing || notifications.isRefreshing;
  const refreshAll = () => {
    feed.refresh();
    bookings.refresh();
    notifications.refresh();
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <TopBar
        action={
          <Pressable onPress={() => router.push('/notifications')} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Notifications, ${notifications.unreadCount} unread`}>
            <Text style={styles.bell}>◌</Text>
            {notifications.unreadCount > 0 && <View style={styles.badge} />}
          </Pressable>
        }
      />
      <ScrollView
        contentContainerStyle={screenStyles.tabScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refreshAll} tintColor={palette.blue} />}>
        <WelcomeHeader name={user.name} />
        <SearchCard />
        <TrustScoreCard score={user.trustScore} />

        <SectionTitle title="Your current rental" action="View all" onPress={() => router.push('/bookings')} />
        {bookings.isLoading ? (
          <Skeleton height={136} radius={18} />
        ) : bookings.error ? (
          <ErrorState error={bookings.error} onRetry={bookings.refetch} />
        ) : current ? (
          <CurrentBookingCard booking={current} />
        ) : (
          <EmptyState title="No upcoming trips" message="Book a car and your rental will show up here." actionLabel="Browse cars" onAction={() => router.push('/browse')} />
        )}

        {unread.length > 0 && (
          <>
            <SectionTitle title="Latest updates" action="See all" onPress={() => router.push('/notifications')} />
            {unread.map((item) => (
              <NotificationItem key={item.id} notification={item} />
            ))}
          </>
        )}

        {feed.isLoading ? (
          <>
            <SectionTitle title="Recommended for you" />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontal} contentContainerStyle={styles.horizontalContent}>
              <VehicleCardSkeleton compact />
              <VehicleCardSkeleton compact />
            </ScrollView>
          </>
        ) : feed.error ? (
          <ErrorState error={feed.error} onRetry={feed.refetch} title="Could not load cars" />
        ) : feed.data ? (
          <>
            <VehicleRow title="Recommended for you" vehicles={feed.data.recommended} onSeeAll={() => router.push({ pathname: '/browse', params: { sort: 'recommended' } })} />
            <VehicleRow title="Popular with renters" vehicles={feed.data.popular} onSeeAll={() => router.push({ pathname: '/browse', params: { sort: 'rating' } })} />
            <VehicleRow title="New in the fleet" vehicles={feed.data.newArrivals} onSeeAll={() => router.push('/browse')} />
          </>
        ) : null}

        <SectionTitle title="Quick actions" />
        <View style={styles.quickRow}>
          <QuickAction icon="⌕" label="Browse cars" onPress={() => router.push('/browse')} />
          <QuickAction icon="☆" label="Smart match" onPress={() => router.push({ pathname: '/browse', params: { sort: 'recommended' } })} />
          <QuickAction icon="?" label="Help center" onPress={() => router.push('/faq')} />
        </View>
      </ScrollView>
    </Screen>
  );
}

function VehicleRow({ title, vehicles, onSeeAll }: { title: string; vehicles: Vehicle[]; onSeeAll: () => void }) {
  if (vehicles.length === 0) return null;
  return (
    <>
      <SectionTitle title={title} action="See all" onPress={onSeeAll} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontal} contentContainerStyle={styles.horizontalContent}>
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.id} vehicle={vehicle} compact />
        ))}
      </ScrollView>
    </>
  );
}

function QuickAction({ icon, label, onPress }: { icon: string; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickItem, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={label}>
      <Text style={styles.quickIcon}>{icon}</Text>
      <Text style={styles.quickLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bell: { color: palette.navy, fontSize: 27 },
  badge: { position: 'absolute', top: 2, right: 0, width: 9, height: 9, borderRadius: 5, backgroundColor: palette.danger, borderWidth: 1.5, borderColor: palette.canvas },
  horizontal: { marginHorizontal: -gutter },
  horizontalContent: { paddingLeft: gutter, paddingRight: gutter - 14 },
  quickRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  quickItem: { flex: 1, backgroundColor: palette.white, borderRadius: 15, padding: 13, borderWidth: 1, borderColor: palette.border },
  quickIcon: { color: palette.blue, fontSize: 22 },
  quickLabel: { color: palette.navy, fontSize: 11, fontWeight: '800', marginTop: 12 },
  pressed: { opacity: 0.78 },
});
