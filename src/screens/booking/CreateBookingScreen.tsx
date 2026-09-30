import { useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import { BookingForm } from '@/components/booking/BookingForm';
import { ErrorState } from '@/components/common/ErrorMessage';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useVehicle } from '@/hooks/useVehicles';
import { bookingApi } from '@/services/bookingApi';
import { paymentApi } from '@/services/paymentApi';

export default function CreateBookingScreen() {
  const { vehicleId } = useLocalSearchParams<{ vehicleId: string }>();
  const vehicle = useVehicle(vehicleId);
  const paymentMethods = useApiQuery('payment-methods', () => paymentApi.methods());
  const agreement = useApiQuery('rental-agreement', () => bookingApi.agreement());

  const loading = vehicle.isLoading || paymentMethods.isLoading;
  const error = vehicle.error ?? paymentMethods.error;

  return (
    <Screen>
      <TopBar back title="Book your car" />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={screenStyles.stackScroll} keyboardShouldPersistTaps="handled">
          {loading ? (
            <DetailSkeleton />
          ) : error || !vehicle.data || !paymentMethods.data ? (
            <ErrorState
              error={error}
              onRetry={() => {
                vehicle.refetch();
                paymentMethods.refetch();
              }}
            />
          ) : (
            <BookingForm vehicle={vehicle.data} agreement={agreement.data} paymentMethods={paymentMethods.data} />
          )}
          {agreement.error && !loading ? <ErrorState error={agreement.error} onRetry={agreement.refetch} title="Could not load the rental agreement" /> : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
