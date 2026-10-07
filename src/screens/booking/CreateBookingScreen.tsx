import { useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';

import { BookingForm } from '@/components/booking/BookingForm';
import { ErrorState } from '@/components/common/ErrorMessage';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { BackLink } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useVehicle } from '@/hooks/useVehicles';
import { bookingApi } from '@/services/bookingApi';
import { paymentApi } from '@/services/paymentApi';

/** Loads everything the booking form needs, then hands over to the four-step BookingForm. */
export default function CreateBookingScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const vehicle = useVehicle(vehicleId);
  const paymentMethods = useApiQuery('payment-methods', () => paymentApi.methods());
  const agreement = useApiQuery('rental-agreement', () => bookingApi.agreement());
  const locations = useApiQuery('booking-locations', () => bookingApi.locations());
  const queries = [vehicle, paymentMethods, agreement, locations];

  if (vehicle.data && paymentMethods.data && agreement.data && locations.data) {
    return (
      <Screen>
        <BookingForm vehicle={vehicle.data} agreement={agreement.data} paymentMethods={paymentMethods.data} locations={locations.data} />
      </Screen>
    );
  }

  const failed = queries.find((query) => query.error);
  return (
    <Screen>
      <ScrollView contentContainerStyle={screenStyles.stackScroll}>
        <BackLink />
        {failed ? <ErrorState error={failed.error} onRetry={() => queries.forEach((query) => query.error && query.refetch())} /> : <DetailSkeleton />}
      </ScrollView>
    </Screen>
  );
}

