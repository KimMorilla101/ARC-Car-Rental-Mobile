import { Pressable, Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { FormField } from '@/components/common/FormField';
import { Icon, type IconName } from '@/components/common/Icon';
import { palette } from '@/constants/theme';
import type { Id } from '@/types/api';
import type { BookingLocations, DeliveryMethod } from '@/types/booking';
import { formatPeso } from '@/utils/formatters';

import { styles } from './LocationSelector.styles';

interface LocationSelectorProps {
  locations: BookingLocations;
  method: DeliveryMethod;
  onMethodChange: (method: DeliveryMethod) => void;
  branchId: Id | null;
  onBranchChange: (id: Id) => void;
  zoneId: Id | null;
  onZoneChange: (id: Id) => void;
  address: string;
  onAddressChange: (address: string) => void;
  errors: { branchId?: string; deliveryZoneId?: string; deliveryAddress?: string };
}

/** "Pickup Option" card: shop pickup at a branch, or delivery with a zone-based fee. */
export function LocationSelector({ locations, method, onMethodChange, branchId, onBranchChange, zoneId, onZoneChange, address, onAddressChange, errors }: LocationSelectorProps) {
  return (
    <Card title="Pickup Option" icon="map-pin">
      <View style={styles.tiles} accessibilityRole="radiogroup">
        <MethodTile icon="home" title="Shop Pickup" caption="Free" active={method === 'shop_pickup'} onPress={() => onMethodChange('shop_pickup')} />
        <MethodTile icon="truck" title="Delivery" caption="Fee by area" active={method === 'delivery'} onPress={() => onMethodChange('delivery')} />
      </View>

      {method === 'shop_pickup' ? (
        <>
          <Text style={styles.label}>PICKUP BRANCH</Text>
          {locations.branches.map((branch) => (
            <RadioRow key={branch.id} title={branch.name} caption={branch.address} selected={branchId === branch.id} onPress={() => onBranchChange(branch.id)} />
          ))}
          {errors.branchId ? <Text style={styles.error}>{errors.branchId}</Text> : null}
        </>
      ) : (
        <>
          <Text style={styles.label}>DELIVERY AREA</Text>
          {locations.deliveryZones.map((zone) => (
            <RadioRow key={zone.id} title={zone.name} trailing={formatPeso(zone.fee)} selected={zoneId === zone.id} onPress={() => onZoneChange(zone.id)} />
          ))}
          {errors.deliveryZoneId ? <Text style={styles.error}>{errors.deliveryZoneId}</Text> : null}
          <FormField
            label="Delivery address"
            icon="map-pin"
            placeholder="House no., street, barangay, city"
            value={address}
            onChangeText={onAddressChange}
            error={errors.deliveryAddress}
            autoComplete="street-address"
            textContentType="fullStreetAddress"
          />
        </>
      )}
    </Card>
  );
}

function MethodTile({ icon, title, caption, active, onPress }: { icon: IconName; title: string; caption: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.tile, active && styles.tileActive]} accessibilityRole="radio" accessibilityState={{ checked: active }}>
      <Icon name={icon} size={22} color={active ? palette.blue : palette.muted} />
      <Text style={[styles.tileTitle, active && styles.tileTitleActive]}>{title}</Text>
      <Text style={styles.tileCaption}>{caption}</Text>
    </Pressable>
  );
}

function RadioRow({ title, caption, trailing, selected, onPress }: { title: string; caption?: string; trailing?: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.radioRow, selected && styles.radioRowSelected]} accessibilityRole="radio" accessibilityState={{ checked: selected }}>
      <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
      <View style={styles.radioCopy}>
        <Text style={styles.radioTitle}>{title}</Text>
        {caption ? <Text style={styles.radioCaption}>{caption}</Text> : null}
      </View>
      {trailing ? <Text style={styles.radioTrailing}>{trailing}</Text> : null}
    </Pressable>
  );
}
