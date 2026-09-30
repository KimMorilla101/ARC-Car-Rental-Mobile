import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '@/components/common/ErrorMessage';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { useBooking } from '@/hooks/useBookings';
import { extensionTypeLabel, formatDateTime, formatPeso } from '@/utils/formatters';

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
        <Text style={styles.iconText}>✓</Text>
      </View>
      <Text style={styles.title}>Extension request pending</Text>
      <Text style={styles.text}>
        We sent your {extensionTypeLabel[extension.type].toLowerCase()} extension request. We will notify you once vehicle availability is confirmed.
      </Text>
      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>New requested return</Text>
        <Text style={styles.date}>{formatDateTime(extension.requestedReturnAt)}</Text>
        <Text style={styles.fee}>Additional cost {formatPeso(extension.fee)}</Text>
      </View>
      <PrimaryButton label="Back to booking" onPress={() => router.back()} style={styles.button} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: { padding: 25, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 66, height: 66, borderRadius: 33, backgroundColor: palette.greenSoft, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: palette.green, fontSize: 32, fontWeight: '900' },
  title: { color: palette.navy, fontSize: 25, fontWeight: '900', textAlign: 'center', marginTop: 18 },
  text: { color: palette.muted, textAlign: 'center', fontSize: 14, lineHeight: 22, marginTop: 9 },
  summary: { backgroundColor: palette.white, borderRadius: 16, width: '100%', alignItems: 'center', padding: 18, marginTop: 24, borderWidth: 1, borderColor: palette.border },
  summaryTitle: { color: palette.muted, fontSize: 11 },
  date: { color: palette.blue, fontSize: 20, fontWeight: '900', marginTop: 6, textAlign: 'center' },
  fee: { color: palette.muted, fontSize: 12, marginTop: 6 },
  button: { alignSelf: 'stretch' },
});
