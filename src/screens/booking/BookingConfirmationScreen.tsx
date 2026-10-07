import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { bookingStatusTone } from '@/components/booking/bookingStatusTone';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorMessage, ErrorState } from '@/components/common/ErrorMessage';
import { Icon } from '@/components/common/Icon';
import { DetailItem, InfoRow } from '@/components/common/InfoRow';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { Pill } from '@/components/common/Pill';
import { Screen, screenStyles } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { useBooking } from '@/hooks/useBookings';
import type { Booking } from '@/types/booking';
import { bookingStatusLabel, formatFullDate, formatPeso, formatTime, paymentMethodLabel, paymentStatusLabel, plural } from '@/utils/formatters';

import { styles } from './BookingConfirmationScreen.styles';

function nextSteps(booking: Booking): string[] {
  if (booking.payment.method === 'cash') {
    return [
      'Visit the ARC branch with your booking reference.',
      "Present your valid driver's license and one government ID.",
      'Pay the down payment in person at the counter.',
      'Your booking is confirmed once staff verify your payment and documents.',
    ];
  }
  return [
    'Our staff will check your payment proof and documents.',
    'You will get a notification once your booking is confirmed.',
    "Bring your driver's license and valid ID on pickup day.",
  ];
}

/**
 * Shown after the booking was created on the server. It reloads the booking so every status
 * shown here (including which uploads succeeded) is the backend's, not the form's.
 */
export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useBooking(id);
  const data = booking.data;

  if (booking.isLoading || booking.error || !data) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={screenStyles.stackScroll}>{booking.isLoading ? <DetailSkeleton /> : <ErrorState error={booking.error} onRetry={booking.refetch} />}</ScrollView>
      </Screen>
    );
  }

  const missing = data.requirements.filter((item) => item.status === 'missing').map((item) => item.label);
  if (data.payment.method !== 'cash' && !data.payment.proofUrl) missing.push('Payment proof');
  const statusText = `${bookingStatusLabel[data.status]} – ${paymentStatusLabel[data.payment.status]}`;

  return (
    <Screen>
      <ScrollView contentContainerStyle={screenStyles.stackScroll}>
        <View style={styles.hero} accessibilityLiveRegion="polite">
          <View style={styles.check}>
            <Icon name="check-circle" size={34} color={palette.green} />
          </View>
          <Text style={styles.title}>Booking Submitted!</Text>
          <Text style={styles.subtitle}>
            {data.payment.method === 'cash'
              ? 'Your reservation has been received. Please visit our branch to pay in person to confirm your booking.'
              : 'Your reservation has been received. We will confirm it once your payment and documents are verified.'}
          </Text>
        </View>

        <View style={styles.reference}>
          <Text style={styles.referenceLabel}>BOOKING REFERENCE</Text>
          <Text style={styles.referenceValue} selectable>
            {data.reference}
          </Text>
          <Pill tone={bookingStatusTone(data.status)} icon="clock">
            {statusText}
          </Pill>
        </View>

        {missing.length > 0 && <ErrorMessage message={`Some uploads did not go through: ${missing.join(', ')}. Open the booking to upload them again.`} />}

        <Card style={styles.card}>
          <View style={styles.vehicleRow}>
            <Image source={{ uri: data.vehicle.imageUrl }} style={styles.image} contentFit="cover" />
            <View style={styles.vehicleCopy}>
              <Text style={styles.small}>Vehicle</Text>
              <Text style={styles.vehicleName}>{data.vehicle.name}</Text>
              <Text style={styles.small}>
                {data.vehicle.category} · {data.vehicle.transmission}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.grid}>
            <DetailItem icon="calendar" label="Pickup Date" value={formatFullDate(data.pickupAt)} />
            <DetailItem icon="clock" label="Pickup Time" value={formatTime(data.pickupAt)} />
            <DetailItem icon="calendar" label="Return Date" value={formatFullDate(data.returnAt)} />
            <DetailItem icon="clock" label="Return Time" value={formatTime(data.returnAt)} />
          </View>
          <DetailItem icon="map-pin" label="Pickup Location" value={data.pickupLocation} />
          <DetailItem icon="navigation" label="Destination" value={data.destination} />
          <View style={styles.divider} />
          <InfoRow label="Rental Duration" value={plural(data.rentalDays, 'day')} />
          <InfoRow label="Rate" value={`${formatPeso(data.vehicle.rates.daily)}/day`} />
          <InfoRow label="Payment Method" value={paymentMethodLabel[data.payment.method]} />
          <View style={styles.divider} />
          <InfoRow label="Estimated Total" value={formatPeso(data.pricing.total)} strong />
        </Card>

        <View style={styles.steps}>
          <View style={styles.stepsHeader}>
            <Icon name="credit-card" size={17} color={palette.amber} />
            <Text style={styles.stepsTitle}>Next Steps</Text>
          </View>
          {nextSteps(data).map((step, index) => (
            <Text key={step} style={styles.stepText}>
              <Text style={styles.stepNumber}>{index + 1}. </Text>
              {step}
            </Text>
          ))}
        </View>

        <Button label="View My Bookings" icon="book-open" onPress={() => router.dismissTo('/bookings')} style={styles.primary} />
        <Button label="Back to Home" icon="home" variant="outline" onPress={() => router.dismissTo('/home')} style={styles.secondary} />
      </ScrollView>
    </Screen>
  );
}
