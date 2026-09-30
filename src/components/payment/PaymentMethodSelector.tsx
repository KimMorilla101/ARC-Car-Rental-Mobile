import { StyleSheet, Text, View } from 'react-native';

import { ChoiceChip } from '@/components/common/ChoiceChip';
import { palette } from '@/constants/theme';
import type { PaymentMethod, PaymentMethodOption } from '@/types/payment';

interface PaymentMethodSelectorProps {
  options: PaymentMethodOption[];
  value: PaymentMethod | null;
  onChange: (method: PaymentMethod) => void;
  error?: string | null;
}

/** Payment choices come from the backend so ARC can enable/disable methods without an app update. */
export function PaymentMethodSelector({ options, value, onChange, error }: PaymentMethodSelectorProps) {
  const selected = options.find((option) => option.method === value);
  return (
    <View accessibilityRole="radiogroup">
      <View style={styles.list}>
        {options.map((option) => (
          <ChoiceChip key={option.method} shape="card" label={option.label} active={value === option.method} onPress={() => onChange(option.method)} />
        ))}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {selected && (
        <View style={selected.requiresProof ? styles.info : styles.cashNotice}>
          <Text style={selected.requiresProof ? styles.infoTitle : styles.cashTitle}>{selected.label}</Text>
          <Text style={selected.requiresProof ? styles.infoText : styles.cashText}>{selected.description}</Text>
          {selected.instructions && <Text style={styles.infoText}>{selected.instructions}</Text>}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 8 },
  error: { color: palette.danger, fontSize: 12, fontWeight: '600', marginTop: 6 },
  info: { backgroundColor: palette.blueSoft, borderRadius: 13, padding: 14, marginTop: 12 },
  infoTitle: { color: palette.blue, fontSize: 13, fontWeight: '900' },
  infoText: { color: palette.ink, fontSize: 11, lineHeight: 17, marginTop: 4 },
  cashNotice: { backgroundColor: palette.amberSoft, borderRadius: 13, padding: 14, marginTop: 12 },
  cashTitle: { color: palette.amber, fontSize: 13, fontWeight: '900' },
  cashText: { color: palette.amberText, fontSize: 11, lineHeight: 17, marginTop: 4 },
});
