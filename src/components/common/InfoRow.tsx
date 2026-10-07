import { Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import { Icon, type IconName } from './Icon';
import { styles } from './InfoRow.styles';

interface InfoRowProps {
  label: string;
  value: string;
  /** Large blue value, used for totals. */
  strong?: boolean;
  /** Muted value, e.g. a deduction. */
  muted?: boolean;
}

/** "Label ........ value" line used in pricing summaries and detail cards. */
export function InfoRow({ label, value, strong, muted }: InfoRowProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, strong && styles.labelStrong]}>{label}</Text>
      <Text style={[styles.value, strong && styles.valueStrong, muted && styles.valueMuted]}>{value}</Text>
    </View>
  );
}

/** Icon + small label + value block, used in the booking summary grid. */
export function DetailItem({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.detail}>
      <View style={styles.detailLabelRow}>
        <Icon name={icon} size={13} color={palette.mutedLight} />
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}
