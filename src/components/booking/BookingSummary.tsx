import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { InfoRow } from '@/components/common/InfoRow';
import { palette } from '@/constants/theme';
import type { PriceBreakdown } from '@/types/booking';
import { formatPeso } from '@/utils/formatters';

interface BookingSummaryProps {
  pricing: PriceBreakdown | undefined;
  rentalDays?: number;
  loading?: boolean;
  /** Shown instead of prices when the quote failed. */
  error?: string | null;
  title?: string;
}

/** Navy pricing card. Amounts always come from the backend quote/booking, never computed here. */
export function BookingSummary({ pricing, rentalDays, loading, error, title = 'Pricing summary' }: BookingSummaryProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {loading && <ActivityIndicator size="small" color={palette.white} />}
      </View>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : !pricing ? (
        <Text style={styles.placeholder}>Calculating your price…</Text>
      ) : (
        <>
          <InfoRow tone="dark" layout="inline" label={rentalDays ? `Rental fee (${rentalDays} day${rentalDays === 1 ? '' : 's'})` : 'Rental fee'} value={formatPeso(pricing.rentalFee)} />
          <InfoRow tone="dark" layout="inline" label="Fixed car wash fee" value={formatPeso(pricing.carWashFee)} />
          <InfoRow tone="dark" layout="inline" label="Pickup / delivery fee" value={formatPeso(pricing.deliveryFee)} />
          {pricing.extensionFee > 0 && <InfoRow tone="dark" layout="inline" label="Extension fee" value={formatPeso(pricing.extensionFee)} />}
          <InfoRow tone="dark" layout="inline" label="Late-return fee" value={formatPeso(pricing.lateReturnFee)} />
          <InfoRow tone="dark" layout="inline" label={`${formatPeso(pricing.downPayment)} down payment`} value="Required to reserve" muted />
          <View style={styles.divider} />
          <InfoRow tone="dark" layout="inline" label="Total amount due" value={formatPeso(pricing.total)} strong />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.navy, borderRadius: 18, padding: 18, marginTop: 23 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  title: { color: palette.white, fontSize: 17, fontWeight: '800' },
  placeholder: { color: palette.onNavyMuted, fontSize: 12, marginTop: 8 },
  error: { color: '#FFB4B9', fontSize: 12, lineHeight: 18, marginTop: 8 },
  divider: { borderTopWidth: 1, borderTopColor: palette.navyLine, marginTop: 16 },
});
