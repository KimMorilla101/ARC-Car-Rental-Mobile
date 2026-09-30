import { StyleSheet, Text, View } from 'react-native';

import { ChoiceChip } from '@/components/common/ChoiceChip';
import { FormField } from '@/components/common/FormField';
import { palette } from '@/constants/theme';
import type { DeliveryMethod } from '@/types/booking';

interface LocationSelectorProps {
  method: DeliveryMethod;
  onMethodChange: (method: DeliveryMethod) => void;
  address: string;
  onAddressChange: (address: string) => void;
  addressError?: string | null;
}

/** Shop pickup vs. delivery. The delivery fee is priced by the backend quote, not here. */
export function LocationSelector({ method, onMethodChange, address, onAddressChange, addressError }: LocationSelectorProps) {
  return (
    <View>
      <Text style={styles.label}>PICKUP METHOD</Text>
      <View style={styles.row} accessibilityRole="radiogroup">
        <ChoiceChip shape="card" label="ARC shop pickup" active={method === 'shop_pickup'} onPress={() => onMethodChange('shop_pickup')} />
        <ChoiceChip shape="card" label="Vehicle delivery" active={method === 'delivery'} onPress={() => onMethodChange('delivery')} />
      </View>
      {method === 'delivery' ? (
        <FormField
          label="Delivery address"
          placeholder="House no., street, barangay, city"
          value={address}
          onChangeText={onAddressChange}
          error={addressError}
          helper="The delivery fee depends on distance and is shown in the pricing summary."
          autoComplete="street-address"
          textContentType="fullStreetAddress"
        />
      ) : (
        <View style={styles.shop}>
          <Text style={styles.shopLabel}>PICKUP LOCATION</Text>
          <Text style={styles.shopValue}>ARC Car Rental shop, Davao City</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: palette.label, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, marginTop: 14, marginBottom: 6 },
  row: { flexDirection: 'row', gap: 8 },
  shop: { backgroundColor: palette.white, borderRadius: 13, borderWidth: 1, borderColor: palette.line, padding: 14, marginTop: 10 },
  shopLabel: { color: palette.label, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  shopValue: { color: palette.navy, fontSize: 14, fontWeight: '700', marginTop: 4 },
});
