import { ActivityIndicator, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { InfoRow } from '@/components/common/InfoRow';
import { palette } from '@/constants/theme';
import type { PriceBreakdown } from '@/types/booking';
import { formatPeso } from '@/utils/formatters';

import { styles } from './BookingSummary.styles';

interface BookingSummaryProps {
  pricing: PriceBreakdown | undefined;
  rentalDays?: number;
  dailyRate?: number;
  loading?: boolean;
  /** Shown instead of prices when the quote failed. */
  error?: string | null;
  title?: string;
}

/** "Final Pricing Summary" card. Amounts always come from the backend quote/booking, never computed here. */
export function BookingSummary({ pricing, rentalDays, dailyRate, loading, error, title = 'Final Pricing Summary' }: BookingSummaryProps) {
  const rentalLabel = rentalDays && dailyRate ? `Rental Fee (${rentalDays}d × ${formatPeso(dailyRate)})` : 'Rental Fee';
  return (
    <Card title={title} icon="shield" right={loading ? <ActivityIndicator size="small" color={palette.blue} /> : undefined}>
      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : !pricing ? (
        <Text style={styles.placeholder}>Calculating your price…</Text>
      ) : (
        <View style={styles.rows}>
          <InfoRow label={rentalLabel} value={formatPeso(pricing.rentalFee)} />
          {pricing.deliveryFee > 0 && <InfoRow label="Delivery Fee" value={formatPeso(pricing.deliveryFee)} />}
          <InfoRow label="Fixed Car Wash Fee" value={formatPeso(pricing.carWashFee)} />
          <InfoRow label="Extension Fee" value={formatPeso(pricing.extensionFee)} />
          <InfoRow label="Late-Return Fee" value={formatPeso(pricing.lateReturnFee)} />
          <View style={styles.divider} />
          <InfoRow label="Total Amount Due" value={formatPeso(pricing.total)} strong />
          <InfoRow label={`Less: ${formatPeso(pricing.downPayment)} Down Payment`} value={`-${formatPeso(pricing.downPayment)}`} muted />
          <View style={styles.balance}>
            <Text style={styles.balanceLabel}>Remaining Balance</Text>
            <Text style={styles.balanceValue}>{formatPeso(pricing.balanceDue)}</Text>
          </View>
        </View>
      )}
    </Card>
  );
}
