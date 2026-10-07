import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { ErrorMessage, ErrorState, NoticeBox } from '@/components/common/ErrorMessage';
import { Icon } from '@/components/common/Icon';
import { InfoRow } from '@/components/common/InfoRow';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { BackLink, PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { palette } from '@/constants/theme';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useSubmit } from '@/hooks/useSubmit';
import { rentalApi } from '@/services/rentalApi';
import type { ExtensionOption, ExtensionType } from '@/types/rental';
import { getErrorMessage } from '@/utils/errorHandler';
import { extensionTypeLabel, formatDateTime, formatPeso, plural } from '@/utils/formatters';

import { styles } from './ExtensionScreen.styles';

/** Preview of the new return time. The server computes the real one when it records the request. */
function previewReturn(iso: string, type: ExtensionType, quantity: number): string {
  const date = new Date(iso);
  if (type === 'hourly') date.setHours(date.getHours() + quantity);
  if (type === 'daily') date.setDate(date.getDate() + quantity);
  if (type === 'monthly') date.setMonth(date.getMonth() + quantity);
  return date.toISOString();
}

export default function ExtensionScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  // The deadline check is a display hint computed when the options load; the server rejects late
  // requests regardless of the device clock.
  const options = useApiQuery(`extension-options:${id}`, async () => {
    const result = await rentalApi.extensionOptions(id);
    return { ...result, deadlinePassed: Date.now() >= new Date(result.deadline).getTime() };
  });
  const [selected, setSelected] = useState<ExtensionType>('daily');
  const [quantity, setQuantity] = useState(1);
  const { submit, isSubmitting, error } = useSubmit((type: ExtensionType, count: number) => rentalApi.requestExtension(id, { type, quantity: count }));
  const data = options.data;

  if (options.isLoading || options.error || !data) {
    return (
      <Screen>
        <ScrollView contentContainerStyle={screenStyles.stackScroll}>
          <BackLink />
          {options.isLoading ? <DetailSkeleton /> : <ErrorState error={options.error} onRetry={options.refetch} />}
        </ScrollView>
      </Screen>
    );
  }

  if (data.deadlinePassed) return <ReturnModeNotice bookingId={id} />;

  const choice = data.options.find((item) => item.type === selected) ?? data.options[0];
  const count = Math.min(quantity, choice.maxQuantity);
  const estimatedFee = choice.unitFee * count;

  const selectType = (option: ExtensionOption) => {
    setSelected(option.type);
    setQuantity(1);
  };

  const onSubmit = async () => {
    const result = await submit(choice.type, count);
    if (result.ok) router.replace({ pathname: '/booking/[id]/extension-pending', params: { id } });
  };

  return (
    <Screen>
      <ScrollView contentContainerStyle={screenStyles.stackScroll}>
        <BackLink />
        <PageHeader title="Request Extension" subtitle="Extensions stay pending until ARC Car Rental approves them." />

        <NoticeBox title="Request before your deadline">{`You can request an extension until ${formatDateTime(data.deadline)}. After that, Return Vehicle Mode starts and late-return fees apply.`}</NoticeBox>

        <Text style={styles.label}>EXTENSION TYPE</Text>
        <View style={styles.types} accessibilityRole="radiogroup">
          {data.options.map((option) => {
            const active = option.type === choice.type;
            return (
              <Pressable key={option.type} onPress={() => selectType(option)} style={[styles.type, active && styles.typeActive]} accessibilityRole="radio" accessibilityState={{ checked: active }}>
                <Text style={[styles.typeTitle, active && styles.typeTextActive]}>{extensionTypeLabel[option.type]}</Text>
                <Text style={[styles.typeFee, active && styles.typeTextActive]}>{formatPeso(option.unitFee)}</Text>
                <Text style={[styles.typeUnit, active && styles.typeUnitActive]}>per {option.unitLabel}</Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.label}>DURATION</Text>
        <View style={styles.counter}>
          <Pressable onPress={() => setQuantity(Math.max(1, count - 1))} disabled={count <= 1} style={[styles.counterButton, count <= 1 && styles.counterDisabled]} accessibilityRole="button" accessibilityLabel="Decrease duration">
            <Icon name="minus" size={18} color={palette.blue} />
          </Pressable>
          <Text style={styles.counterValue} accessibilityLiveRegion="polite">
            {plural(count, choice.unitLabel)}
          </Text>
          <Pressable
            onPress={() => setQuantity(Math.min(choice.maxQuantity, count + 1))}
            disabled={count >= choice.maxQuantity}
            style={[styles.counterButton, count >= choice.maxQuantity && styles.counterDisabled]}
            accessibilityRole="button"
            accessibilityLabel="Increase duration">
            <Icon name="plus" size={18} color={palette.blue} />
          </Pressable>
        </View>

        <Card title="Summary" icon="file-text" style={styles.summary}>
          <InfoRow label="Current return" value={formatDateTime(data.currentReturnAt)} />
          <View style={styles.locked}>
            <Icon name="lock" size={12} color={palette.muted} />
            <Text style={styles.lockedText}>The return time stays fixed to your pickup time.</Text>
          </View>
          <InfoRow label="New requested return" value={formatDateTime(previewReturn(data.currentReturnAt, choice.type, count))} />
          <View style={styles.divider} />
          <InfoRow label="Estimated extension fee" value={formatPeso(estimatedFee)} strong />
        </Card>

        <Text style={styles.note}>
          ARC checks vehicle availability for every request. If another booking conflicts, ARC may arrange an equivalent replacement vehicle at no extra charge. The final fee is
          confirmed when your request is approved.
        </Text>
        <ErrorMessage message={error ? getErrorMessage(error) : null} />
        <Button label="Submit Extension Request" icon="send" onPress={onSubmit} loading={isSubmitting} style={styles.submit} />
      </ScrollView>
    </Screen>
  );
}

/** Past the deadline, extensions are closed: show Return Vehicle Mode with the late-fee estimate. */
function ReturnModeNotice({ bookingId }: { bookingId: string }) {
  const router = useRouter();
  const summary = useApiQuery(`return-summary:${bookingId}`, () => rentalApi.returnSummary(bookingId));
  return (
    <Screen>
      <ScrollView contentContainerStyle={screenStyles.stackScroll}>
        <BackLink />
        <PageHeader title="Extension Unavailable" subtitle="Your scheduled return time has passed." />
        <View style={styles.returnCard} accessibilityRole="alert">
          <View style={styles.returnHeader}>
            <Icon name="alert-triangle" size={18} color={palette.dangerText} />
            <Text style={styles.returnTitle}>Return Vehicle Mode</Text>
          </View>
          <Text style={styles.returnText}>Expired rentals cannot be extended. Return the vehicle first, then create a new booking if you want to rent again.</Text>
          {summary.data && (
            <View style={styles.returnFees}>
              <InfoRow label="Hours late" value={plural(summary.data.delayedHours, 'hour')} />
              <InfoRow label="Late-return fee" value={`${formatPeso(summary.data.lateFeePerHour)}/hour`} />
              <InfoRow label="Estimated so far" value={formatPeso(summary.data.estimatedLateFee)} strong />
            </View>
          )}
        </View>
        <Button label="Return Vehicle" icon="corner-down-left" variant="warning" onPress={() => router.replace({ pathname: '/booking/[id]/return', params: { id: bookingId } })} style={styles.submit} />
      </ScrollView>
    </Screen>
  );
}
