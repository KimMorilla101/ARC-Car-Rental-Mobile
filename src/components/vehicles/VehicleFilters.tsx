import Slider from '@react-native-community/slider';
import { useState, type ReactNode } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/common/Button';
import { Checkbox } from '@/components/common/Checkbox';
import { ChoiceChip } from '@/components/common/ChoiceChip';
import { Icon } from '@/components/common/Icon';
import { palette, text } from '@/constants/theme';
import type { FuelType, Transmission, VehicleCategory, VehicleFilters as Filters, VehicleSort } from '@/types/vehicle';
import { formatPeso } from '@/utils/formatters';

import { categoryLabel } from './VehicleCard';
import { styles } from './VehicleFilters.styles';

const categories: VehicleCategory[] = ['Sedan', 'SUV', 'MPV', 'Pickup', 'Luxury', 'Hatchback'];
const transmissions: Transmission[] = ['Automatic', 'Manual'];
const fuels: FuelType[] = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
const seatOptions = [2, 4, 5, 7, 12];
const PRICE_MIN = 1000;
const PRICE_MAX = 8000;

export const sortOptions: { value: VehicleSort; label: string }[] = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

/** Horizontal category chips shown above the vehicle list. */
export function CategoryChips({ value, onChange }: { value: VehicleCategory | undefined; onChange: (category: VehicleCategory | undefined) => void }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}>
      <ChoiceChip label="All" active={!value} onPress={() => onChange(undefined)} />
      {categories.map((item) => (
        <ChoiceChip key={item} label={categoryLabel(item)} active={value === item} onPress={() => onChange(item)} />
      ))}
    </ScrollView>
  );
}

/** Number of sheet filters in use, for the Filters button badge. */
export function countAdvancedFilters(filters: Filters): number {
  return [filters.transmission, filters.fuel, filters.minSeats, filters.maxDailyRate, filters.availableOnly].filter(Boolean).length;
}

interface FilterSheetProps {
  visible: boolean;
  filters: Filters;
  onApply: (filters: Filters) => void;
  onClose: () => void;
}

/** Bottom sheet with availability, category, transmission, fuel, passengers and max price. */
export function VehicleFilterSheet({ visible, filters, onApply, onClose }: FilterSheetProps) {
  const [draft, setDraft] = useState<Filters>(filters);
  const set = <K extends keyof Filters>(key: K, value: Filters[K]) => setDraft((current) => ({ ...current, [key]: value }));

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose} onShow={() => setDraft(filters)}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel="Close filters" />
      <SafeAreaView edges={['bottom']} style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title}>Filters</Text>
          <Pressable onPress={onClose} hitSlop={10} accessibilityRole="button" accessibilityLabel="Close filters">
            <Icon name="x" size={22} color={palette.navy} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.body}>
          <Group title="Availability">
            <Checkbox label="Available only" checked={!!draft.availableOnly} onChange={(checked) => set('availableOnly', checked || undefined)} />
          </Group>
          <Group title="Category">
            <RadioList value={draft.category} options={categories.map((item) => ({ value: item, label: categoryLabel(item) }))} onChange={(value) => set('category', value)} />
          </Group>
          <Group title="Transmission">
            <RadioList value={draft.transmission} options={transmissions.map((item) => ({ value: item, label: item }))} onChange={(value) => set('transmission', value)} />
          </Group>
          <Group title="Fuel type">
            <RadioList value={draft.fuel} options={fuels.map((item) => ({ value: item, label: item }))} onChange={(value) => set('fuel', value)} />
          </Group>
          <Group title="Min. passengers">
            <View style={styles.wrap}>
              <ChoiceChip label="Any" active={!draft.minSeats} onPress={() => set('minSeats', undefined)} />
              {seatOptions.map((seats) => (
                <ChoiceChip key={seats} label={`${seats}+`} active={draft.minSeats === seats} onPress={() => set('minSeats', seats)} />
              ))}
            </View>
          </Group>
          <Group title="Max price/day" right={<Text style={styles.priceValue}>{formatPeso(draft.maxDailyRate ?? PRICE_MAX)}</Text>}>
            <Slider
              minimumValue={PRICE_MIN}
              maximumValue={PRICE_MAX}
              step={500}
              value={draft.maxDailyRate ?? PRICE_MAX}
              onValueChange={(value) => set('maxDailyRate', value >= PRICE_MAX ? undefined : value)}
              minimumTrackTintColor={palette.blue}
              maximumTrackTintColor={palette.line}
              thumbTintColor={palette.blue}
              accessibilityLabel="Maximum price per day"
            />
          </Group>
        </ScrollView>
        <View style={styles.footer}>
          <Button
            label="Reset"
            variant="outline"
            style={styles.footerButton}
            onPress={() => setDraft({ search: filters.search, sort: filters.sort, pickupAt: filters.pickupAt, returnAt: filters.returnAt })}
          />
          <Button
            label="Apply Filters"
            style={styles.footerButton}
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

function RadioList<T extends string>({ value, options, onChange }: { value: T | undefined; options: { value: T; label: string }[]; onChange: (value: T | undefined) => void }) {
  const all = [{ value: undefined, label: 'All' }, ...options];
  return (
    <View accessibilityRole="radiogroup">
      {all.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.label}
            onPress={() => onChange(option.value)}
            style={styles.radioRow}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}>
            <View style={[styles.radio, selected && styles.radioSelected]}>{selected && <View style={styles.radioDot} />}</View>
            <Text style={styles.radioLabel}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function Group({ title, right, children }: { title: string; right?: ReactNode; children: ReactNode }) {
  return (
    <View style={styles.group}>
      <View style={styles.groupHeader}>
        <Text style={text.label}>{title.toUpperCase()}</Text>
        {right}
      </View>
      {children}
    </View>
  );
}
