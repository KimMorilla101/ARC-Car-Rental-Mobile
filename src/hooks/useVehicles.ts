import { vehicleApi } from '@/services/vehicleApi';
import type { Id } from '@/types/api';
import type { VehicleFilters } from '@/types/vehicle';

import { useApiQuery } from './useApiQuery';

export function useVehicles(filters: VehicleFilters) {
  return useApiQuery(`vehicles:${JSON.stringify(filters)}`, () => vehicleApi.list(filters));
}

export function useVehicle(id: Id | undefined) {
  return useApiQuery(`vehicle:${id}`, () => (id === undefined ? Promise.reject(new Error('Missing vehicle id')) : vehicleApi.show(id)));
}

export function useHomeFeed() {
  return useApiQuery('vehicles:home-feed', () => vehicleApi.homeFeed());
}
