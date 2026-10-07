import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorState } from '@/components/common/ErrorMessage';
import { Icon } from '@/components/common/Icon';
import { InfoRow } from '@/components/common/InfoRow';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { BackLink, PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { useApiQuery } from '@/hooks/useApiQuery';
import { rentalApi } from '@/services/rentalApi';
import { formatDateTime, formatPeso, plural } from '@/utils/formatters';

import { styles } from './ReturnVehicleScreen.styles';

const steps = ['Bring the vehicle to the return branch below.', 'Keep the keys and vehicle documents ready.', 'A staff member will inspect the vehicle and record the return.'];

/**
 * Return Vehicle Mode. The late fee shown is the backend's estimate; the final amount is recorded
 * by ARC staff when they verify the return, so this screen never marks anything as returned.
 */
export default function ReturnVehicleScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const summary = useApiQuery(`return-summary:${id}`, () => rentalApi.returnSummary(id));
  const data = summary.data;

  return (
    <Screen>
      <ScrollView contentContainerStyle={screenStyles.stackScroll}>
        <BackLink />
        {summary.isLoading ? (
          <DetailSkeleton />
        ) : summary.error || !data ? (
          <ErrorState error={summary.error} onRetry={summary.refetch} />
        ) : (
          <>
            <PageHeader title="Return Vehicle" subtitle="Your return deadline has been reached." />
            <View style={styles.alert} accessibilityRole="alert">
              <Icon name="alert-triangle" size={22} color={palette.dangerText} />
              <Text style={styles.alertText}>Please return the vehicle to ARC Car Rental as soon as possible. Late-return fees apply for every hour of delay.</Text>
            </View>

            <Card title="Return to" icon="map-pin" style={styles.section}>
              <Text style={styles.location}>{data.returnLocation}</Text>
            </Card>

            <Card title="How to return" icon="list" style={styles.section}>
              {steps.map((step, index) => (
                <View key={step} style={styles.step}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </Card>

            <Card title="Late-return estimate" icon="clock" style={styles.section}>
              <InfoRow label="Scheduled return" value={formatDateTime(data.scheduledReturnAt)} />
              <InfoRow label="Hours late so far" value={plural(data.delayedHours, 'hour')} />
              <InfoRow label="Late-return fee" value={`${formatPeso(data.lateFeePerHour)}/hour`} />
              <View style={styles.divider} />
              <InfoRow label="Estimated late fee" value={formatPeso(data.estimatedLateFee)} strong />
            </Card>
            <Text style={styles.note}>The final late-return fee is recorded after ARC staff verify the return. An expired rental cannot be extended.</Text>
            <Button label="Back to Booking" icon="chevron-left" variant="outline" onPress={() => router.back()} style={styles.section} />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
