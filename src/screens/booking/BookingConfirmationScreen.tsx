import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { bookingStatusTone } from '@/components/booking/bookingStatusTone';
import { ErrorState } from '@/components/common/ErrorMessage';
import { InfoRow } from '@/components/common/InfoRow';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { Pill } from '@/components/common/Pill';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { palette } from '@/constants/theme';
import { useBooking } from '@/hooks/useBookings';
import { bookingStatusLabel, formatDateTime, formatPeso } from '@/utils/formatters';

/**
 * Shown after the booking was created on the server. It reloads the booking so every status
 * shown here (including which uploads succeeded) is the backend's, not the form's.
 */
export default function BookingConfirmationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useBooking(id);
  const data = booking.data;
  const missing = data ? data.requirements.filter((item) => item.status === 'missing') : [];
  const proofMissing = data ? data.payment.method !== 'cash' && !data.payment.proofUrl : false;

  return (
    <Screen>
      <TopBar title="Booking submitted" />
      <ScrollView contentContainerStyle={screenStyles.stackScroll}>
        {booking.isLoading ? (
          <DetailSkeleton />
        ) : booking.error || !data ? (
          <ErrorState error={booking.error} onRetry={booking.refetch} />
        ) : (
          <>
            <View style={styles.success} accessibilityLiveRegion="polite">
              <Text style={styles.check}>✓</Text>
              <Text style={styles.successTitle}>Booking submitted</Text>
              <Text style={styles.successText}>Your reservation is awaiting verification. Uploaded proof never confirms a booking automatically.</Text>
            </View>
            <View style={screenStyles.card}>
              <View style={styles.head}>
                <Text style={styles.label}>BOOKING ID</Text>
                <Text style={styles.reference}>{data.reference}</Text>
              </View>
              <View style={styles.carRow}>
                <Image source={{ uri: data.vehicle.imageUrl }} style={styles.image} contentFit="cover" />
                <View style={styles.carCopy}>
                  <Text style={styles.carName}>{data.vehicle.name}</Text>
                  <Text style={styles.carMeta}>
                    {data.vehicle.category} • {data.vehicle.seats} seats
                  </Text>
                </View>
              </View>
              <Pill tone={bookingStatusTone(data.status)}>{bookingStatusLabel[data.status]}</Pill>
              <InfoRow label="Pickup" value={formatDateTime(data.pickupAt)} />
              <InfoRow label="Return (fixed)" value={formatDateTime(data.returnAt)} />
              <InfoRow label="Pickup location" value={data.pickupLocation} />
              <InfoRow label="Travel destination" value={data.destination} />
              <InfoRow label="Estimated total" value={formatPeso(data.pricing.total)} strong />
            </View>
            {missing.length > 0 || proofMissing ? (
              <View style={styles.warning} accessibilityRole="alert">
                <Text style={styles.warningTitle}>Some uploads did not go through</Text>
                <Text style={styles.warningText}>
                  {[...missing.map((item) => item.label), ...(proofMissing ? ['Payment proof'] : [])].join(', ')} still need to be uploaded. Open the booking to try again.
                </Text>
              </View>
            ) : (
              <View style={styles.notice}>
                <Text style={styles.noticeTitle}>Payment remains pending</Text>
                <Text style={styles.noticeText}>
                  ARC Car Rental must verify payment, the down payment, and required documents before the booking becomes confirmed.
                </Text>
              </View>
            )}
            <PrimaryButton label="View booking" onPress={() => router.replace({ pathname: '/booking/[id]', params: { id: String(data.id) } })} />
            <PrimaryButton label="Back to home" variant="ghost" onPress={() => router.dismissTo('/home')} style={styles.ghost} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  success: { alignItems: 'center', paddingVertical: 26 },
  check: { width: 58, height: 58, borderRadius: 29, backgroundColor: '#DDF7ED', color: palette.green, textAlign: 'center', lineHeight: 58, fontSize: 28, fontWeight: '900', overflow: 'hidden' },
  successTitle: { color: palette.navy, fontSize: 24, fontWeight: '900', marginTop: 14 },
  successText: { color: palette.muted, fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 19 },
  head: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { color: palette.muted, fontSize: 10, fontWeight: '800' },
  reference: { color: palette.blue, fontSize: 11, fontWeight: '900' },
  carRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 17 },
  carCopy: { flex: 1 },
  image: { width: 90, height: 65, borderRadius: 10, marginRight: 12 },
  carName: { color: palette.navy, fontSize: 17, fontWeight: '800' },
  carMeta: { color: palette.muted, fontSize: 12, marginTop: 5 },
  notice: { backgroundColor: palette.amberSoft, borderRadius: 15, padding: 15, marginTop: 16 },
  noticeTitle: { color: palette.amber, fontSize: 14, fontWeight: '900' },
  noticeText: { color: palette.amberText, fontSize: 12, lineHeight: 18, marginTop: 5 },
  warning: { backgroundColor: palette.dangerSoft, borderRadius: 15, padding: 15, marginTop: 16 },
  warningTitle: { color: '#B23A45', fontSize: 14, fontWeight: '900' },
  warningText: { color: '#8F3A42', fontSize: 12, lineHeight: 18, marginTop: 5 },
  ghost: { marginTop: 4 },
});
