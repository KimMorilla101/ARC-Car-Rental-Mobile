import { apiConfig } from '@/constants/api';
import { ENDPOINTS } from '@/constants/endpoints';
import type { Id } from '@/types/api';
import type { HomeFeed, Vehicle, VehicleFilters } from '@/types/vehicle';

import { apiRequest, type Resource } from './api';
import { mockVehicleApi } from './mock/mockVehicleApi';

export interface VehicleList {
  vehicles: Vehicle[];
  /** Size of the whole fleet, for "Showing 4 of 10 vehicles". */
  fleetSize: number;
}

export interface VehicleApi {
  list(filters: VehicleFilters): Promise<VehicleList>;
  show(id: Id): Promise<Vehicle>;
  homeFeed(): Promise<HomeFeed>;
}

const httpVehicleApi: VehicleApi = {
  list: async (filters) => {
    const response = await apiRequest<Resource<Vehicle[]> & { meta: { fleetSize: number } }>(ENDPOINTS.vehicles.list, { query: { ...filters } });
    return { vehicles: response.data, fleetSize: response.meta.fleetSize };
  },
  show: async (id) => (await apiRequest<Resource<Vehicle>>(ENDPOINTS.vehicles.show, { params: { id } })).data,
  homeFeed: async () => (await apiRequest<Resource<HomeFeed>>(ENDPOINTS.vehicles.homeFeed)).data,
};

export const vehicleApi: VehicleApi = apiConfig.useMockApi ? mockVehicleApi : httpVehicleApi;
