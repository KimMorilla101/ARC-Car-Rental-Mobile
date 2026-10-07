import { useRouter } from 'expo-router';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';

import { ErrorState } from '@/components/common/ErrorMessage';
import { FocusAwareStatusBar } from '@/components/common/FocusAwareStatusBar';
import { Icon } from '@/components/common/Icon';
import { Skeleton, VehicleCardSkeleton } from '@/components/common/LoadingSkeleton';
import { Screen } from '@/components/common/Screen';
import { SectionTitle } from '@/components/common/SectionTitle';
import { ActiveRentalCard } from '@/components/dashboard/ActiveRentalCard';
import { BookingRow } from '@/components/dashboard/BookingRow';
import { HomeHero } from '@/components/dashboard/HomeHero';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { SearchCard } from '@/components/dashboard/SearchCard';
import { WhyArcSection } from '@/components/dashboard/WhyArcSection';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { palette } from '@/constants/theme';
import { useRefetchOnFocus } from '@/hooks/useApiQuery';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useNotifications } from '@/hooks/useNotifications';
import { useHomeFeed } from '@/hooks/useVehicles';
import type { Booking } from '@/types/booking';

import { styles } from './HomeScreen.styles';

const UPCOMING: Booking['status'][] = ['pending', 'pending_verification', 'confirmed'];
const FINISHED: Booking['status'][] = ['returned', 'completed'];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const feed = useHomeFeed();
  const bookings = useBookings('all');
  const notifications = useNotifications();
  useRefetchOnFocus(bookings.refetch);

  if (!user) return null;

  const list = bookings.data ?? [];
  // Overdue rentals come first so "Return Vehicle" is impossible to miss.
  const active = list.find((item) => item.status === 'return_due') ?? list.find((item) => item.status === 'active');
  const upcoming = list.filter((item) => UPCOMING.includes(item.status)).sort((a, b) => a.pickupAt.localeCompare(b.pickupAt)).slice(0, 2);
  const recent = list.filter((item) => FINISHED.includes(item.status)).slice(0, 2);
  const firstName = user.name.split(' ')[0];

  const refreshAll = () => {
    feed.refresh();
    bookings.refresh();
    notifications.refresh();
  };

  return (
    <Screen edges={['left', 'right']}>
      <FocusAwareStatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={feed.isRefreshing || bookings.isRefreshing} onRefresh={refreshAll} tintColor={palette.white} />}>
        <HomeHero />
        <View style={styles.content}>
          <SearchCard />

          <Text style={styles.welcome}>Welcome back, {firstName}! 👋</Text>
          <Text style={styles.welcomeSub}>Your next adventure is one booking away.</Text>
          <View style={styles.shortcuts}>
            <Shortcut icon="truck" label="Browse Cars" primary onPress={() => router.push('/browse')} />
            <Shortcut icon="book-open" label="My Bookings" onPress={() => router.push('/bookings')} />
          </View>

          {bookings.isLoading ? (
            <Skeleton height={130} radius={18} style={styles.gap} />
          ) : bookings.error ? (
            <ErrorState error={bookings.error} onRetry={bookings.refetch} title="Could not load your bookings" />
          ) : (
            <>
              {active && <ActiveRentalCard booking={active} />}
              {upcoming.length > 0 && (
                <>
                  <SectionTitle title="Upcoming Bookings" action="View All" onPress={() => router.push('/bookings')} />
                  {upcoming.map((item) => (
                    <BookingRow key={item.id} booking={item} />
                  ))}
                </>
              )}
            </>
          )}

          <SectionTitle display title="Featured Vehicles" subtitle="Hand-picked from our premium fleet" action="Browse All" onPress={() => router.push('/browse')} />
          {feed.isLoading ? (
            <VehicleCardSkeleton />
          ) : feed.error ? (
            <ErrorState error={feed.error} onRetry={feed.refetch} title="Could not load cars" />
          ) : (
            feed.data?.featured.map((vehicle) => <VehicleCard key={vehicle.id} vehicle={vehicle} variant="featured" />)
          )}

          <QuickActions bookingCount={bookings.data ? bookings.data.length : null} />

          {recent.length > 0 && (
            <>
              <SectionTitle title="Recent Rentals" action="View All" onPress={() => router.push('/bookings')} />
              {recent.map((item) => (
                <BookingRow key={item.id} booking={item} showRange />
              ))}
            </>
          )}

          <WhyArcSection />
        </View>
      </ScrollView>
    </Screen>
  );
}

function Shortcut({ icon, label, primary = false, onPress }: { icon: 'truck' | 'book-open'; label: string; primary?: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.shortcut, primary && styles.shortcutPrimary, pressed && styles.pressed]} accessibilityRole="button">
      <Icon name={icon} size={16} color={primary ? palette.blue : palette.ink} />
      <Text style={[styles.shortcutText, primary && styles.shortcutTextPrimary]}>{label}</Text>
    </Pressable>
  );
}
