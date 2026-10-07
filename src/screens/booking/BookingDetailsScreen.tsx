import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { RefreshControl, ScrollView, Text, View } from 'react-native';

import { bookingStatusTone, paymentBadge } from '@/components/booking/bookingStatusTone';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { RequirementRow } from '@/components/booking/RequirementRow';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorMessage, ErrorState } from '@/components/common/ErrorMessage';
import { Icon } from '@/components/common/Icon';
import { DetailItem, InfoRow } from '@/components/common/InfoRow';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { BackLink } from '@/components/common/PageHeader';
import { Pill, type PillTone } from '@/components/common/Pill';
import { Screen, screenStyles } from '@/components/common/Screen';
import { PaymentProofUploader } from '@/components/payment/PaymentProofUploader';
import { TrustScoreBanner } from '@/components/profile/TrustScore';
import { palette } from '@/constants/theme';
import { useRefetchOnFocus } from '@/hooks/useApiQuery';
import { useBooking } from '@/hooks/useBookings';
import { bookingApi } from '@/services/bookingApi';
import { paymentApi } from '@/services/paymentApi';
import type { RequirementStatus, RequirementType } from '@/types/booking';
import { getErrorMessage } from '@/utils/errorHandler';
import { pickImage } from '@/utils/filePicker';
import {
  bookingStatusLabel,
  deliveryMethodLabel,
  extensionStatusLabel,
  extensionTypeLabel,
  formatDateTime,
  formatFullDate,
  formatPeso,
  formatTime,
  paymentMethodLabel,
  plural,
  requirementStatusLabel,
} from '@/utils/formatters';

import { styles } from './BookingDetailsScreen.styles';

const requirementTone: Record<RequirementStatus, PillTone> = {
  missing: 'red',
  pending_verification: 'amber',
  verified: 'green',
  rejected: 'red',
};

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

  if (booking.isLoading || booking.error || !data) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={screenStyles.stackScroll}>
          <BackLink />
          {booking.isLoading ? <DetailSkeleton /> : <ErrorState error={booking.error} onRetry={booking.refetch} />}
        </ScrollView>
      </Screen>
    );
  }

  const finished = data.status === 'completed' || data.status === 'returned';
  const returnMode = data.status === 'return_due';
  const canUpload = data.status === 'pending' || data.status === 'pending_verification';
  const needsProof = data.payment.method !== 'cash';
  const payment = paymentBadge[data.payment.status];
  const verifiedDocs = data.requirements.filter((item) => item.status === 'verified').length;

  return (
    <Screen>
      <ScrollView
        contentContainerStyle={screenStyles.stackScroll}
        refreshControl={<RefreshControl refreshing={booking.isRefreshing} onRefresh={booking.refresh} tintColor={palette.blue} />}>
        <BackLink label="My Bookings" />

        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.reference}>{data.reference}</Text>
            <Text style={styles.title}>{data.vehicle.name}</Text>
          </View>
          <Pill tone={bookingStatusTone(data.status)}>{bookingStatusLabel[data.status]}</Pill>
        </View>

        <Image source={{ uri: data.vehicle.imageUrl }} style={styles.image} contentFit="cover" />

        {returnMode && (
          <View style={styles.returnBanner} accessibilityRole="alert">
            <View style={styles.returnHeader}>
              <Icon name="alert-triangle" size={18} color={palette.dangerText} />
              <Text style={styles.returnTitle}>Return Vehicle Mode</Text>
            </View>
            <Text style={styles.returnText}>Your return deadline has passed. Extensions are closed. Return the vehicle as soon as possible to stop late-return fees.</Text>
            <Button label="Return Vehicle" icon="corner-down-left" variant="warning" onPress={() => router.push({ pathname: '/booking/[id]/return', params: { id: String(data.id) } })} style={styles.bannerButton} />
          </View>
        )}

        <TrustScoreBanner score={data.trustScore} />

        <Card title="Rental Details" icon="calendar" style={styles.section}>
          <View style={styles.grid}>
            <DetailItem icon="calendar" label="Pickup" value={formatFullDate(data.pickupAt)} />
            <DetailItem icon="clock" label="Pickup Time" value={formatTime(data.pickupAt)} />
            <DetailItem icon="calendar" label="Return" value={formatFullDate(data.returnAt)} />
            <DetailItem icon="lock" label="Return Time (fixed)" value={formatTime(data.returnAt)} />
          </View>
          <DetailItem icon={data.deliveryMethod === 'delivery' ? 'truck' : 'home'} label={deliveryMethodLabel[data.deliveryMethod]} value={data.deliveryAddress ?? data.pickupLocation} />
          <DetailItem icon="navigation" label="Destination" value={data.destination} />
          <View style={styles.divider} />
          <InfoRow label="Rental Duration" value={plural(data.rentalDays, 'day')} />
          <InfoRow label="Unit" value={data.unitLabel ?? 'Assigned at pickup'} />
        </Card>

        {(data.extension || data.canRequestExtension) && (
          <Card title="Extension" icon="clock" style={styles.section}>
            {data.extension ? (
              <>
                <Pill tone={data.extension.status === 'approved' ? 'green' : data.extension.status === 'declined' ? 'red' : 'amber'}>{extensionStatusLabel[data.extension.status]}</Pill>
                <InfoRow label="Type" value={`${extensionTypeLabel[data.extension.type]} · ${data.extension.quantity}`} />
                <InfoRow label="New return" value={formatDateTime(data.extension.requestedReturnAt)} />
                <InfoRow label="Extension fee" value={formatPeso(data.extension.fee)} />
              </>
            ) : (
              <Text style={styles.extensionText}>Need more time? Request an extension before your fixed return time. Every request needs ARC approval.</Text>
            )}
            {data.canRequestExtension && (
              <Button label="Request Extension" icon="plus-circle" variant="outline" size="sm" onPress={() => router.push({ pathname: '/booking/[id]/extend', params: { id: String(data.id) } })} style={styles.cardButton} />
            )}
          </Card>
        )}

        <Card
          title="Documents"
          icon="file-text"
          right={<Text style={styles.docCount}>{`${verifiedDocs}/${data.requirements.length} verified`}</Text>}
          style={styles.section}>
          {data.requirements.map((item) => {
            const replaceable = canUpload && (item.status === 'missing' || item.status === 'rejected');
            return (
              <RequirementRow
                key={item.type}
                label={item.label}
                description={item.rejectionReason ?? item.description}
                badge={{ label: requirementStatusLabel[item.status], tone: requirementTone[item.status] }}
                onUpload={replaceable ? () => upload(item.type) : undefined}
                busy={uploading === item.type}
              />
            );
          })}
        </Card>

        <Card title="Payment" icon="credit-card" right={<Pill tone={payment.tone}>{payment.label}</Pill>} style={styles.section}>
          <InfoRow label="Method" value={paymentMethodLabel[data.payment.method]} />
          {needsProof && canUpload && (data.payment.status === 'awaiting_payment' || data.payment.status === 'rejected') && (
            <PaymentProofUploader fileName={data.payment.proofUrl ? 'Uploaded proof' : null} onPick={() => upload('proof')} busy={uploading === 'proof'} />
          )}
        </Card>
        <ErrorMessage message={uploadError} />

        <View style={styles.section}>
          <BookingSummary title="Pricing Breakdown" pricing={data.pricing} rentalDays={data.rentalDays} dailyRate={data.vehicle.rates.daily} />
        </View>

        {finished && (
          <Button label="Book Again" icon="repeat" onPress={() => router.push({ pathname: '/booking/new', params: { vehicleId: String(data.vehicle.id) } })} style={styles.section} />
        )}
      </ScrollView>
    </Screen>
  );
}
