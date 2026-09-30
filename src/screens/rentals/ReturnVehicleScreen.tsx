import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorState } from '@/components/common/ErrorMessage';
import { InfoRow } from '@/components/common/InfoRow';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { palette } from '@/constants/theme';
import { useApiQuery } from '@/hooks/useApiQuery';
import { rentalApi } from '@/services/rentalApi';
import { formatDateTime, formatPeso } from '@/utils/formatters';

/**
 * Return Vehicle Mode. The late fee is the backend's estimate; the final amount is recorded by
 * ARC staff when they verify the return, so this screen does not mark anything as returned.
 */
export default function ReturnVehicleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const summary = useApiQuery(`return-summary:${id}`, () => rentalApi.returnSummary(id));
  const data = summary.data;

  return (
    <Screen>
      <TopBar back title="Return vehicle" />
      <ScrollView contentContainerStyle={screenStyles.stackScroll}>
        {summary.isLoading ? (
          <DetailSkeleton />
        ) : summary.error || !data ? (
          <ErrorState error={summary.error} onRetry={summary.refetch} />
        ) : (
          <>
            <View style={styles.alert} accessibilityRole="alert">
              <Text style={styles.alertIcon}>!</Text>
              <Text style={styles.alertTitle}>Return Vehicle Mode</Text>
              <Text style={styles.alertText}>Your return deadline has been reached. Please return the vehicle to ARC Car Rental as soon as possible.</Text>
            </View>
            <Text style={screenStyles.section}>Return instructions</Text>
            <View style={screenStyles.card}>
              <Text style={styles.instruction}>1. Bring the vehicle to {data.shopAddress}.</Text>
              <Text style={styles.instruction}>2. Keep your keys and documents ready.</Text>
              <Text style={styles.instruction}>3. A staff member will inspect and verify the return.</Text>
            </View>
            <Text style={screenStyles.section}>Late-return estimate</Text>
            <View style={styles.feeCard}>
              <InfoRow tone="dark" layout="inline" label="Scheduled return" value={formatDateTime(data.scheduledReturnAt)} />
              <InfoRow tone="dark" layout="inline" label="Delayed hours so far" value={`${data.delayedHours} hour${data.delayedHours === 1 ? '' : 's'}`} />
              <InfoRow tone="dark" layout="inline" label="Late-return fee per hour" value={formatPeso(data.lateFeePerHour)} />
              <InfoRow tone="dark" layout="inline" label="Estimated late-return fee" value={formatPeso(data.estimatedLateFee)} strong />
            </View>
            <Text style={styles.note}>
              The final late-return fee is recorded after the vehicle is returned and verified. An expired rental cannot be extended; create a new booking after return.
            </Text>
            <PrimaryButton label="Back to booking" onPress={() => router.back()} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  alert: { backgroundColor: palette.amberSoft, borderRadius: 17, padding: 18, alignItems: 'center', marginTop: 15 },
  alertIcon: { color: palette.white, backgroundColor: palette.amberStrong, width: 34, height: 34, borderRadius: 17, lineHeight: 34, textAlign: 'center', fontSize: 20, fontWeight: '900', overflow: 'hidden' },
  alertTitle: { color: palette.amber, fontSize: 20, fontWeight: '900', marginTop: 11 },
  alertText: { color: palette.amberText, fontSize: 13, lineHeight: 19, textAlign: 'center', marginTop: 5 },
  instruction: { color: palette.ink, fontSize: 13, lineHeight: 21, marginBottom: 9 },
  feeCard: { backgroundColor: palette.navy, borderRadius: 16, padding: 17 },
  note: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 16 },
});
