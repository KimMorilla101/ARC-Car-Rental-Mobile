import { useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChoiceChip } from '@/components/common/ChoiceChip';
import { PrimaryButton } from '@/components/common/PrimaryButton';
import { gutter, palette } from '@/constants/theme';
import type { FuelType, Transmission, VehicleCategory, VehicleFilters as Filters, VehicleSort } from '@/types/vehicle';

const categories: VehicleCategory[] = ['Sedan', 'SUV', 'MPV', 'Hatchback', 'Pickup'];
const transmissions: Transmission[] = ['Automatic', 'Manual'];
const fuels: FuelType[] = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
const seatOptions = [4, 5, 7];
const priceOptions = [2000, 2500, 3000];

export const sortLabels: Record<VehicleSort, string> = {
  recommended: 'Recommended',
  price_asc: 'Price: low to high',
  price_desc: 'Price: high to low',
  rating: 'Top rated',
  seats: 'Most seats',
};

/** Horizontal category chips shown above the vehicle list. */
export function CategoryChips({ value, onChange }: { value: VehicleCategory | undefined; onChange: (category: VehicleCategory | undefined) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      <ChoiceChip label="All cars" active={!value} onPress={() => onChange(undefined)} />
      {categories.map((item) => (
        <ChoiceChip key={item} label={item} active={value === item} onPress={() => onChange(item)} />
      ))}
    </ScrollView>
  );
}

/** Number of advanced filters in use, for the filter button badge. */
export function countAdvancedFilters(filters: Filters): number {
  return [filters.transmission, filters.fuel, filters.minSeats, filters.maxDailyRate, filters.availableOnly].filter(Boolean).length;
}

interface FilterSheetProps {
  visible: boolean;
  filters: Filters;
  onApply: (filters: Filters) => void;
  onClose: () => void;
}

/** Bottom sheet for transmission, fuel, seating, price, availability and sort. */
export function VehicleFilterSheet({ visible, filters, onApply, onClose }: FilterSheetProps) {
  const [draft, setDraft] = useState<Filters>(filters);
  const toggle = <K extends keyof Filters>(key: K, value: Filters[K]) => setDraft((current) => ({ ...current, [key]: current[key] === value ? undefined : value }));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} onShow={() => setDraft(filters)}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filters" />
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Filter & sort</Text>
          <Pressable
            hitSlop={10}
            onPress={() => setDraft({ search: filters.search, category: filters.category, pickupAt: filters.pickupAt, returnAt: filters.returnAt })}>
            <Text style={styles.reset}>Reset</Text>
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.body}>
          <Group title="Sort by">
            {(Object.keys(sortLabels) as VehicleSort[]).map((sort) => (
              <ChoiceChip key={sort} label={sortLabels[sort]} active={(draft.sort ?? 'recommended') === sort} onPress={() => setDraft({ ...draft, sort })} />
            ))}
          </Group>
          <Group title="Transmission">
            {transmissions.map((item) => (
              <ChoiceChip key={item} label={item} active={draft.transmission === item} onPress={() => toggle('transmission', item)} />
            ))}
          </Group>
          <Group title="Fuel">
            {fuels.map((item) => (
              <ChoiceChip key={item} label={item} active={draft.fuel === item} onPress={() => toggle('fuel', item)} />
            ))}
          </Group>
          <Group title="Seats">
            {seatOptions.map((seats) => (
              <ChoiceChip key={seats} label={`${seats}+ seats`} active={draft.minSeats === seats} onPress={() => toggle('minSeats', seats)} />
            ))}
          </Group>
          <Group title="Daily price">
            {priceOptions.map((price) => (
              <ChoiceChip key={price} label={`Up to ₱${price.toLocaleString()}`} active={draft.maxDailyRate === price} onPress={() => toggle('maxDailyRate', price)} />
            ))}
          </Group>
          <Group title="Availability">
            <ChoiceChip label="Available units only" active={!!draft.availableOnly} onPress={() => toggle('availableOnly', true)} />
          </Group>
        </ScrollView>
        <View style={styles.footer}>
          <PrimaryButton
            label="Show vehicles"
            onPress={() => {
              onApply(draft);
              onClose();
            }}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.group}>
      <Text style={styles.groupTitle}>{title.toUpperCase()}</Text>
      <View style={styles.groupItems}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  chips: { gap: 8, paddingVertical: 18 },
  backdrop: { flex: 1, backgroundColor: 'rgba(4, 13, 24, 0.45)' },
  sheet: { backgroundColor: palette.canvas, borderTopLeftRadius: 22, borderTopRightRadius: 22, maxHeight: '85%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: gutter, paddingTop: 20 },
  title: { color: palette.navy, fontSize: 20, fontWeight: '900' },
  reset: { color: palette.blue, fontSize: 13, fontWeight: '800' },
  body: { paddingHorizontal: gutter, paddingBottom: 10 },
  group: { marginTop: 18 },
  groupTitle: { color: palette.label, fontSize: 10, fontWeight: '800', letterSpacing: 1.1, marginBottom: 9 },
  groupItems: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  footer: { paddingHorizontal: gutter, paddingBottom: 10 },
});
