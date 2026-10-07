import { Text, View } from 'react-native';

import { Card } from '@/components/common/Card';
import { FormField } from '@/components/common/FormField';
import { Icon } from '@/components/common/Icon';
import { palette } from '@/constants/theme';
import type { BookingLocations } from '@/types/booking';
import { addDays, startOfDay, withTimeOf } from '@/utils/bookingDates';

import { DateTimeField } from '../DateTimeField';
import { LocationSelector } from '../LocationSelector';
import type { StepProps } from './bookingDraft';
import { styles } from './DatesStep.styles';

/** Step 1: rental period (fixed return time), pickup option and travel destination. */
export function DatesStep({ draft, update, errors, locations }: StepProps & { locations: BookingLocations }) {
  const returnAt = withTimeOf(draft.returnDate, draft.pickup);

  const onPickupDate = (date: Date) => {
    const pickup = withTimeOf(date, draft.pickup);
    // Keep at least one day between pickup and return.
    const returnDate = startOfDay(draft.returnDate) <= startOfDay(pickup) ? addDays(pickup, 1) : draft.returnDate;
    update({ pickup, returnDate });
  };

  return (
    <View style={styles.stack}>
      <Card title="Rental Period" icon="calendar">
        <DateTimeField label="Pickup date" mode="date" value={draft.pickup} minimumDate={new Date()} onChange={onPickupDate} error={errors.pickupAt} />
        <DateTimeField label="Pickup time" mode="time" value={draft.pickup} onChange={(time) => update({ pickup: withTimeOf(draft.pickup, time) })} />
        <DateTimeField label="Return date" mode="date" value={draft.returnDate} minimumDate={addDays(draft.pickup, 1)} onChange={(returnDate) => update({ returnDate })} error={errors.returnAt} />
        <DateTimeField label="Return time" mode="time" value={returnAt} onChange={() => undefined} locked />
        <View style={styles.hint}>
          <Icon name="info" size={13} color={palette.muted} />
          <Text style={styles.hintText}>Return time is fixed to your pickup time.</Text>
        </View>
      </Card>

      <LocationSelector
        locations={locations}
        method={draft.deliveryMethod}
        onMethodChange={(deliveryMethod) => update({ deliveryMethod })}
        branchId={draft.branchId}
        onBranchChange={(branchId) => update({ branchId })}
        zoneId={draft.deliveryZoneId}
        onZoneChange={(deliveryZoneId) => update({ deliveryZoneId })}
        address={draft.deliveryAddress}
        onAddressChange={(deliveryAddress) => update({ deliveryAddress })}
        errors={errors}
      />

      <Card title="Trip Details" icon="navigation">
        <FormField
          label="Travel destination"
          icon="navigation"
          placeholder="Where do you intend to travel?"
          value={draft.destination}
          onChangeText={(destination) => update({ destination })}
          error={errors.destination}
          helper="This is separate from your pickup or delivery location."
        />
      </Card>
    </View>
  );
}
