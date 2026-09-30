import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { ErrorMessage, ErrorState } from '@/components/common/ErrorMessage';
import { InfoRow } from '@/components/common/InfoRow';
import { DetailSkeleton } from '@/components/common/LoadingSkeleton';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { palette } from '@/constants/theme';
import { useApiQuery } from '@/hooks/useApiQuery';
import { useSubmit } from '@/hooks/useSubmit';
import { rentalApi } from '@/services/rentalApi';
import type { ExtensionType } from '@/types/rental';
import { getErrorMessage } from '@/utils/errorHandler';
import { extensionTypeLabel, formatDateTime, formatLongDate, formatPeso, formatTime } from '@/utils/formatters';

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
  const { submit, isSubmitting, error } = useSubmit((type: ExtensionType) => rentalApi.requestExtension(id, { type }));

  const data = options.data;
  const choice = data?.options.find((item) => item.type === selected) ?? data?.options[0];
  const deadlinePassed = data?.deadlinePassed ?? false;

  const onSubmit = async () => {
    if (!choice) return;
    const result = await submit(choice.type);
    if (result.ok) router.replace({ pathname: '/booking/[id]/extension-pending', params: { id } });
  };

  return (
    <Screen>
      <TopBar back title="Extend rental" />
      <ScrollView contentContainerStyle={screenStyles.stackScroll}>
        {options.isLoading ? (
          <DetailSkeleton />
        ) : options.error || !data ? (
          <ErrorState error={options.error} onRetry={options.refetch} />
        ) : (
          <>
            <Text style={screenStyles.title}>Request more time</Text>
            <Text style={screenStyles.subtitle}>Extensions stay pending until ARC Car Rental approves the request.</Text>
            <View style={styles.deadline}>
              <Text style={styles.deadlineTitle}>
                {deadlinePassed ? 'Extension unavailable' : `Request before ${formatLongDate(data.deadline)} at ${formatTime(data.deadline)}`}
              </Text>
              <Text style={styles.deadlineText}>
                {deadlinePassed
                  ? 'The scheduled return deadline has passed. Return the vehicle first and create a new booking to rent again.'
                  : 'You can request an extension until your original return date and fixed return time.'}
              </Text>
            </View>

            <Text style={screenStyles.section}>Extension type</Text>
            <View style={styles.options} accessibilityRole="radiogroup">
              {data.options.map((item) => {
                const active = choice?.type === item.type;
                return (
                  <Pressable
                    key={item.type}
                    onPress={() => setSelected(item.type)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: active }}
                    style={[styles.option, active && styles.optionActive]}>
                    <Text style={[styles.optionTitle, active && styles.optionActiveText]}>{extensionTypeLabel[item.type]}</Text>
                    <Text style={[styles.optionCost, active && styles.optionActiveText]}>{formatPeso(item.fee)}</Text>
                    <Text style={[styles.optionDuration, active && styles.optionActiveText]}>{item.durationLabel}</Text>
                  </Pressable>
                );
              })}
            </View>

            {choice && (
              <View style={[screenStyles.card, styles.summary]}>
                <InfoRow label="CURRENT RETURN" value={formatDateTime(data.currentReturnAt)} />
                <InfoRow label="ADDITIONAL COST" value={formatPeso(choice.fee)} />
                <InfoRow label="NEW REQUESTED RETURN" value={formatDateTime(choice.requestedReturnAt)} strong />
              </View>
            )}
            <Text style={styles.note}>
              Vehicle availability must be checked for the requested extension. If another booking conflicts, ARC Car Rental may arrange an equivalent replacement vehicle at no extra charge.
            </Text>
            <ErrorMessage message={error ? getErrorMessage(error) : null} />
            <PrimaryButton
              label={deadlinePassed ? 'Return vehicle first' : 'Submit extension request'}
              onPress={onSubmit}
              loading={isSubmitting}
              disabled={deadlinePassed || !choice}
            />
          </>
        )}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  deadline: { backgroundColor: palette.amberSoft, borderRadius: 15, padding: 16, marginTop: 20 },
  deadlineTitle: { color: palette.amber, fontSize: 13, fontWeight: '900' },
  deadlineText: { color: palette.amberText, fontSize: 12, lineHeight: 18, marginTop: 5 },
  options: { flexDirection: 'row', gap: 8 },
  option: { flex: 1, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 13, padding: 12 },
  optionActive: { backgroundColor: palette.blue, borderColor: palette.blue },
  optionTitle: { color: palette.navy, fontSize: 13, fontWeight: '900' },
  optionCost: { color: palette.blue, fontSize: 14, fontWeight: '900', marginTop: 12 },
  optionDuration: { color: palette.muted, fontSize: 10, marginTop: 3 },
  optionActiveText: { color: palette.white },
  summary: { marginTop: 20 },
  note: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 16 },
});
