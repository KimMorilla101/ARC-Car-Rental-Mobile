import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { bookingStatusTone } from '@/components/booking/bookingStatusTone';
import { RequirementRow } from '@/components/booking/RequirementRow';
import { TrustScoreCard } from '@/components/dashboard/TrustScoreCard';
import { ErrorMessage, ErrorState } from '@/components/common/ErrorMessage';
import { InfoRow } from '@/components/common/InfoRow';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { Pill } from '@/components/common/Pill';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { PaymentProofUploader } from '@/components/payment/PaymentProofUploader';
import { palette } from '@/constants/theme';
import { useRefetchOnFocus } from '@/hooks/useApiQuery';
import { useBooking } from '@/hooks/useBookings';
import { bookingApi } from '@/services/bookingApi';
import { paymentApi } from '@/services/paymentApi';
import type { BookingRequirement, RequirementType } from '@/types/booking';
import { getErrorMessage } from '@/utils/errorHandler';
import { pickImage } from '@/utils/filePicker';
import {
  bookingStatusLabel,
  deliveryMethodLabel,
  extensionStatusLabel,
  extensionTypeLabel,
  formatDateTime,
  formatPeso,
  paymentMethodLabel,
  paymentStatusLabel,
  requirementStatusLabel,
} from '@/utils/formatters';

const requirementTone = (status: BookingRequirement['status']) =>
  status === 'verified' ? 'done' : status === 'pending_verification' ? 'pending' : status === 'rejected' ? 'error' : 'missing';

export default function BookingDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useBooking(id);
  useRefetchOnFocus(booking.refetch);
  const [uploading, setUploading] = useState<RequirementType | 'proof' | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const data = booking.data;

  // Each upload replaces the booking with the server's response, so statuses shown are the backend's.
  const upload = async (target: RequirementType | 'proof') => {
    if (!data || uploading) return;
    setUploadError(null);
    const picked = await pickImage();
    if ('error' in picked) return setUploadError(picked.error);
    if (!('file' in picked)) return;
    setUploading(target);
    try {
      const updated = target === 'proof' ? await paymentApi.uploadProof(data.id, picked.file) : await bookingApi.uploadRequirement(data.id, target, picked.file);
      booking.setData(updated);
    } catch (error) {
      setUploadError(getErrorMessage(error));
    } finally {
      setUploading(null);
    }
  };

  if (booking.isLoading) {
    return (
      <Screen>
        <TopBar back title="Booking details" />
        <ScrollView contentContainerStyle={screenStyles.stackScroll}>
          <DetailSkeleton />
        </ScrollView>
      </Screen>
    );
  }

  if (booking.error || !data) {
    return (
      <Screen>
        <TopBar back title="Booking details" />
        <ErrorState error={booking.error} onRetry={booking.refetch} />
      </Screen>
    );
  }

  const finished = data.status === 'completed' || data.status === 'returned' || data.status === 'cancelled';
  const returnMode = data.status === 'return_due';
  const canUpload = data.status === 'pending' || data.status === 'pending_verification';
  const needsProof = data.payment.method !== 'cash';

  return (
    <Screen>
      <TopBar back title="Booking details" />
      <ScrollView
        contentContainerStyle={screenStyles.stackScroll}
        refreshControl={<RefreshControl refreshing={booking.isRefreshing} onRefresh={booking.refresh} tintColor={palette.blue} />}>
        <View style={styles.statusRow}>
          <View>
            <Text style={styles.label}>BOOKING ID</Text>
            <Text style={styles.reference}>{data.reference}</Text>
          </View>
          <Pill tone={bookingStatusTone(data.status)}>{bookingStatusLabel[data.status]}</Pill>
        </View>

        <View style={styles.vehicle}>
          <Image source={{ uri: data.vehicle.imageUrl }} style={styles.image} contentFit="cover" />
          <View style={styles.vehicleInfo}>
            <Text style={styles.name}>{data.vehicle.name}</Text>
            <Text style={styles.meta}>
              {data.unitLabel ?? 'Unit assigned at pickup'} • {data.vehicle.transmission}
            </Text>
          </View>
        </View>

        <TrustScoreCard score={data.trustScore} caption="Based on your rental history and performance" />

        {returnMode && (
          <View style={styles.returnCard} accessibilityRole="alert">
            <Text style={styles.returnTitle}>Return Vehicle Mode is active</Text>
            <Text style={styles.returnText}>
              Your scheduled return time has passed. Return the vehicle to ARC Car Rental first. Extensions are no longer available after the deadline.
            </Text>
            <PrimaryButton label="Return vehicle" variant="warning" onPress={() => router.push({ pathname: '/booking/[id]/return', params: { id: String(data.id) } })} />
          </View>
        )}

        {data.extension && (
          <View style={styles.extensionStatus}>
            <Text style={styles.extensionTitle}>{extensionStatusLabel[data.extension.status]}</Text>
            <Text style={styles.extensionText}>
              {extensionTypeLabel[data.extension.type]} extension to {formatDateTime(data.extension.requestedReturnAt)} • {formatPeso(data.extension.fee)}
            </Text>
          </View>
        )}

        {data.canRequestExtension && (
          <View style={styles.extension}>
            <Text style={styles.extensionTitle}>Need more time?</Text>
            <Text style={styles.extensionText}>Request an extension before your scheduled return date and fixed return time. Every request needs ARC approval.</Text>
            <Pressable onPress={() => router.push({ pathname: '/booking/[id]/extend', params: { id: String(data.id) } })} accessibilityRole="button">
              <Text style={styles.extensionLink}>Request rental extension →</Text>
            </Pressable>
          </View>
        )}

        <Text style={screenStyles.section}>Pickup & travel</Text>
        <View style={screenStyles.card}>
          <InfoRow label="Pickup date & time" value={formatDateTime(data.pickupAt)} />
          <InfoRow label="Return date & time (fixed)" value={formatDateTime(data.returnAt)} />
          <InfoRow label="Pickup method" value={deliveryMethodLabel[data.deliveryMethod]} />
          <InfoRow label="Pickup location" value={data.deliveryAddress ?? data.pickupLocation} />
          <InfoRow label="Travel destination" value={data.destination} />
        </View>

        <Text style={screenStyles.section}>Payment</Text>
        <View style={screenStyles.card}>
          <InfoRow label="Payment method" value={paymentMethodLabel[data.payment.method]} />
          <InfoRow label="Payment status" value={paymentStatusLabel[data.payment.status]} />
          <InfoRow label="Rental fee" value={formatPeso(data.pricing.rentalFee)} />
          <InfoRow label="Fixed car wash fee" value={formatPeso(data.pricing.carWashFee)} />
          {data.pricing.deliveryFee > 0 && <InfoRow label="Delivery fee" value={formatPeso(data.pricing.deliveryFee)} />}
          {data.pricing.extensionFee > 0 && <InfoRow label="Extension fee" value={formatPeso(data.pricing.extensionFee)} />}
          {data.pricing.lateReturnFee > 0 && <InfoRow label="Late-return fee" value={formatPeso(data.pricing.lateReturnFee)} />}
          <InfoRow label="Total amount due" value={formatPeso(data.pricing.total)} strong />
        </View>
        {needsProof && canUpload && (data.payment.status === 'awaiting_payment' || data.payment.status === 'rejected') && (
          <PaymentProofUploader
            fileName={data.payment.proofUrl ? 'Uploaded proof' : null}
            doneLabel={paymentStatusLabel[data.payment.status]}
            onPick={() => upload('proof')}
            busy={uploading === 'proof'}
          />
        )}

        <Text style={screenStyles.section}>Required documents</Text>
        {data.requirements.map((item) => {
          const replaceable = canUpload && (item.status === 'missing' || item.status === 'rejected');
          return (
            <RequirementRow
              key={item.type}
              label={item.label}
              description={item.rejectionReason ?? item.description}
              statusText={requirementStatusLabel[item.status]}
              statusTone={requirementTone(item.status)}
              actionLabel={replaceable ? 'Upload' : undefined}
              onAction={replaceable ? () => upload(item.type) : undefined}
              busy={uploading === item.type}
            />
          );
        })}
        <ErrorMessage message={uploadError} />

        {finished && (
          <PrimaryButton label="Book again  →" onPress={() => router.push({ pathname: '/booking/new', params: { vehicleId: String(data.vehicle.id) } })} />
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 15, gap: 10 },
  label: { color: palette.muted, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  reference: { color: palette.navy, fontSize: 15, fontWeight: '900', marginTop: 5 },
  vehicle: { backgroundColor: palette.white, borderRadius: 18, padding: 12, flexDirection: 'row', marginTop: 20, borderWidth: 1, borderColor: palette.border },
  image: { width: 110, height: 80, borderRadius: 12 },
  vehicleInfo: { padding: 12, flex: 1 },
  name: { color: palette.navy, fontSize: 18, fontWeight: '900' },
  meta: { color: palette.muted, fontSize: 12, marginTop: 6 },
  extension: { backgroundColor: palette.blueSoft, borderRadius: 16, padding: 16, marginTop: 16 },
  extensionStatus: { backgroundColor: palette.white, borderRadius: 16, padding: 16, marginTop: 16, borderWidth: 1, borderColor: palette.border },
  extensionTitle: { color: palette.navy, fontSize: 16, fontWeight: '900' },
  extensionText: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 5 },
  extensionLink: { color: palette.blue, fontSize: 13, fontWeight: '900', marginTop: 13 },
  returnCard: { backgroundColor: palette.amberSoft, borderRadius: 16, padding: 16, marginTop: 16 },
  returnTitle: { color: palette.amber, fontSize: 16, fontWeight: '900' },
  returnText: { color: palette.amberText, fontSize: 12, lineHeight: 18, marginTop: 6 },
});
