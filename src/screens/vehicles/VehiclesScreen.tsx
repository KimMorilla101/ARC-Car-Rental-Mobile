import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorMessage';
import { Icon } from '@/components/common/Icon';
import { VehicleListSkeleton } from '@/components/common/LoadingSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { SearchField } from '@/components/common/SearchField';
import { Select } from '@/components/common/Select';
import { VehicleCard } from '@/components/vehicles/VehicleCard';
import { CategoryChips, countAdvancedFilters, sortOptions, VehicleFilterSheet } from '@/components/vehicles/VehicleFilters';
import { palette } from '@/constants/theme';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useVehicles } from '@/hooks/useVehicles';
import type { VehicleFilters, VehicleSort } from '@/types/vehicle';
import { formatDate } from '@/utils/formatters';

import { styles } from './VehiclesScreen.styles';

type Params = { search?: string; pickupAt?: string; returnAt?: string; sort?: VehicleSort; minSeats?: string };

const filtersFromParams = (params: Params): VehicleFilters => ({
  pickupAt: params.pickupAt,
  returnAt: params.returnAt,
  sort: params.sort ?? 'recommended',
  minSeats: params.minSeats ? Number(params.minSeats) : undefined,
  availableOnly: params.pickupAt ? true : undefined,
});

export default function VehiclesScreen() {
  const params = useLocalSearchParams<Params>();
  const [search, setSearch] = useState(params.search ?? '');
  const [filters, setFilters] = useState<VehicleFilters>(() => filtersFromParams(params));
  const [sheetOpen, setSheetOpen] = useState(false);

  // The tab stays mounted, so apply new params when Home opens Browse with a fresh search.
  const [appliedParams, setAppliedParams] = useState(params);
  const paramsKey = (value: Params) => [value.search, value.pickupAt, value.returnAt, value.sort, value.minSeats].join('|');
  if (paramsKey(params) !== paramsKey(appliedParams)) {
    setAppliedParams(params);
    setSearch(params.search ?? '');
    setFilters(filtersFromParams(params));
  }

  const debouncedSearch = useDebouncedValue(search.trim());
  const vehicles = useVehicles({ ...filters, search: debouncedSearch || undefined });
  const activeFilters = countAdvancedFilters(filters);
  const result = vehicles.data;

  const resetAll = () => {
    setSearch('');
    setFilters({ sort: 'recommended' });
  };

  const header = (
    <View>
      <PageHeader title="Browse Cars" subtitle={result ? `Explore our fleet of ${result.fleetSize} premium vehicles` : 'Explore our premium fleet'} />
      <View style={styles.searchRow}>
        <View style={styles.searchField}>
          <SearchField value={search} onChangeText={setSearch} placeholder="Search by name or type" />
        </View>
        <View style={styles.sortField}>
          <Select accessibilityLabel="Sort by" value={filters.sort ?? 'recommended'} options={sortOptions} onChange={(sort) => setFilters((current) => ({ ...current, sort }))} />
        </View>
      </View>
      <Pressable onPress={() => setSheetOpen(true)} style={styles.filterButton} accessibilityRole="button" accessibilityLabel={`Filters, ${activeFilters} active`}>
        <Icon name="sliders" size={16} color={palette.ink} />
        <Text style={styles.filterText}>Filters</Text>
        {activeFilters > 0 && (
          <View style={styles.filterBadge}>
            <Text style={styles.filterBadgeText}>{activeFilters}</Text>
          </View>
        )}
      </Pressable>
      {filters.pickupAt && filters.returnAt && (
        <View style={styles.dateBanner}>
          <Icon name="calendar" size={15} color={palette.blueDark} />
          <Text style={styles.dateText}>
            Available {formatDate(filters.pickupAt)} – {formatDate(filters.returnAt)}
          </Text>
          <Pressable onPress={() => setFilters((current) => ({ ...current, pickupAt: undefined, returnAt: undefined }))} hitSlop={8} accessibilityRole="button" accessibilityLabel="Clear dates">
            <Icon name="x" size={16} color={palette.blueDark} />
          </Pressable>
        </View>
      )}
      <View style={styles.chips}>
        <CategoryChips value={filters.category} onChange={(category) => setFilters((current) => ({ ...current, category }))} />
      </View>
      <Text style={styles.resultCount}>
        {result ? (
          <>
            Showing <Text style={styles.resultStrong}>{result.vehicles.length}</Text> of <Text style={styles.resultStrong}>{result.fleetSize}</Text> vehicles
          </>
        ) : (
          'Searching…'
        )}
      </Text>
    </View>
  );

  return (
    <Screen edges={['top', 'left', 'right']}>
      <FlatList
        data={vehicles.error ? [] : (result?.vehicles ?? [])}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={
          vehicles.isLoading ? (
            <VehicleListSkeleton />
          ) : vehicles.error ? (
            <ErrorState error={vehicles.error} onRetry={vehicles.refetch} />
          ) : (
            <EmptyState icon="search" title="No cars found" message="Try another search, category, or filter." actionLabel="Clear filters" onAction={resetAll} />
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
