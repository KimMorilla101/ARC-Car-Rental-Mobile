import { useLocalSearchParams, useRouter } from 'expo-router';
import { Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorState } from '@/components/common/ErrorMessage';
import { Icon } from '@/components/common/Icon';
import { InfoRow } from '@/components/common/InfoRow';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Screen } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { useBooking } from '@/hooks/useBookings';
import { extensionTypeLabel, formatDateTime, formatPeso, plural } from '@/utils/formatters';

import { styles } from './ExtensionPendingScreen.styles';

/** Confirmation after an extension request; details are reloaded from the server's booking. */
export default function ExtensionPendingScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const booking = useBooking(id);
  const extension = booking.data?.extension;

  if (booking.isLoading) return <LoadingSpinner fullScreen label="Loading your request…" />;
  if (booking.error || !extension) {
    return (
      <Screen style={styles.screen}>
        <ErrorState error={booking.error} onRetry={booking.refetch} />
      </Screen>
    );
  }

  return (
    <Screen style={styles.screen}>
      <View style={styles.icon}>
        <Icon name="clock" size={32} color={palette.purple} />
      </View>
      <Text style={styles.title}>Extension Requested</Text>
      <Text style={styles.text}>We will notify you once ARC confirms vehicle availability and approves your request.</Text>
      <Card style={styles.card}>
        <InfoRow label="Type" value={`${extensionTypeLabel[extension.type]} · ${plural(extension.quantity, extension.type === 'hourly' ? 'hour' : extension.type === 'daily' ? 'day' : 'month')}`} />
        <InfoRow label="New requested return" value={formatDateTime(extension.requestedReturnAt)} />
        <InfoRow label="Extension fee" value={formatPeso(extension.fee)} strong />
      </Card>
      <Button label="Back to Booking" icon="chevron-left" onPress={() => router.back()} style={styles.button} />
    </Screen>
  );
}
