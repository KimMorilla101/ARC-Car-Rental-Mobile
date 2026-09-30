import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorMessage';
import { VehicleListSkeleton } from '@/components/common/LoadingSkeleton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { SearchField } from '@/components/common/SearchField';
import { TopBar } from '@/components/common/TopBar';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { CategoryChips, countAdvancedFilters, sortLabels, VehicleFilterSheet } from '@/components/vehicles/VehicleFilters';
import { palette } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useVehicles } from '@/hooks/useVehicles';
import type { VehicleFilters, VehicleSort } from '@/types/vehicle';
import { formatDate } from '@/utils/formatters';

type Params = { search?: string; pickupAt?: string; returnAt?: string; sort?: VehicleSort };

export default function VehiclesScreen() {
  const params = useLocalSearchParams<Params>();
  const [search, setSearch] = useState(params.search ?? '');
  const [filters, setFilters] = useState<VehicleFilters>({
    pickupAt: params.pickupAt,
    returnAt: params.returnAt,
    sort: params.sort ?? 'recommended',
    availableOnly: params.pickupAt ? true : undefined,
  });
  const [sheetOpen, setSheetOpen] = useState(false);

  // The tab stays mounted, so apply new params when Home opens Browse with a fresh search.
  const [appliedParams, setAppliedParams] = useState(params);
  if (params.search !== appliedParams.search || params.pickupAt !== appliedParams.pickupAt || params.returnAt !== appliedParams.returnAt || params.sort !== appliedParams.sort) {
    setAppliedParams(params);
    setSearch(params.search ?? '');
    setFilters({ pickupAt: params.pickupAt, returnAt: params.returnAt, sort: params.sort ?? 'recommended', availableOnly: params.pickupAt ? true : undefined });
  }

  const debouncedSearch = useDebouncedValue(search.trim());
  const vehicles = useVehicles({ ...filters, search: debouncedSearch || undefined });
  const activeFilters = countAdvancedFilters(filters);

  const clearDates = () => setFilters((current) => ({ ...current, pickupAt: undefined, returnAt: undefined }));
  const resetAll = () => {
    setSearch('');
    setFilters({ sort: 'recommended' });
  };

  const header = (
    <View>
      <Text style={screenStyles.title}>Find your next ride</Text>
      <Text style={screenStyles.subtitle}>Choose from our collection of clean, reliable vehicles.</Text>
      <View style={styles.search}>
        <SearchField value={search} onChangeText={setSearch} placeholder="Search by car name or type" />
      </View>
      {filters.pickupAt && filters.returnAt && (
        <View style={styles.dateBanner}>
          <Text style={styles.dateText}>
            Available {formatDate(filters.pickupAt)} – {formatDate(filters.returnAt)}
          </Text>
          <Pressable onPress={clearDates} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear dates">
            <Text style={styles.clear}>Clear</Text>
          </Pressable>
        </View>
      )}
      <CategoryChips value={filters.category} onChange={(category) => setFilters((current) => ({ ...current, category }))} />
      <View style={styles.resultRow}>
        <Text style={styles.resultCount}>{vehicles.data ? `${vehicles.data.length} vehicle${vehicles.data.length === 1 ? '' : 's'}` : 'Searching…'}</Text>
        <Pressable onPress={() => setSheetOpen(true)} hitSlop={8} accessibilityRole="button">
          <Text style={styles.sort}>{sortLabels[filters.sort ?? 'recommended']} ˅</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <Screen edges={['top', 'left', 'right']}>
      <TopBar
        title="Browse cars"
        action={
          <Pressable onPress={() => setSheetOpen(true)} hitSlop={10} accessibilityRole="button" accessibilityLabel={`Filters, ${activeFilters} active`}>
            <Text style={styles.filterIcon}>≡</Text>
            {activeFilters > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilters}</Text>
              </View>
            )}
          </Pressable>
        }
      />
      <FlatList
        data={vehicles.error ? [] : (vehicles.data ?? [])}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          vehicles.isLoading ? (
            <VehicleListSkeleton />
          ) : vehicles.error ? (
            <ErrorState error={vehicles.error} onRetry={vehicles.refetch} />
          ) : (
            <EmptyState title="No cars found" message="Try another search, category, or date range." actionLabel="Clear filters" onAction={resetAll} />
          )
        }
        contentContainerStyle={screenStyles.tabScroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={vehicles.isRefreshing} onRefresh={vehicles.refresh} tintColor={palette.blue} />}
      />
      <VehicleFilterSheet visible={sheetOpen} filters={filters} onApply={setFilters} onClose={() => setSheetOpen(false)} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  filterIcon: { color: palette.navy, fontSize: 26 },
  filterBadge: { position: 'absolute', top: -2, right: -8, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: palette.blue, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  filterBadgeText: { color: palette.white, fontSize: 9, fontWeight: '900' },
  search: { marginTop: 20 },
  dateBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: palette.blueSoft, borderRadius: 12, padding: 12, marginTop: 12 },
  dateText: { color: palette.blue, fontSize: 12, fontWeight: '800', flexShrink: 1 },
  clear: { color: palette.blue, fontSize: 12, fontWeight: '800', textDecorationLine: 'underline' },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 13 },
  resultCount: { color: palette.navy, fontSize: 13, fontWeight: '800' },
  sort: { color: palette.blue, fontSize: 11, fontWeight: '800' },
});
