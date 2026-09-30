import type { VehicleApi } from '@/services/vehicleApi';
import type { Vehicle, VehicleFilters } from '@/types/vehicle';

import { mockVehicles } from './mockDb';
import { currentMockUser, mockDelay, mockNotFound } from './mockUtils';

// Sorting/filtering here only imitates what the Laravel query should do server-side.
const sorters: Record<NonNullable<VehicleFilters['sort']>, (a: Vehicle, b: Vehicle) => number> = {
  recommended: (a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0),
  price_asc: (a, b) => a.rates.daily - b.rates.daily,
  price_desc: (a, b) => b.rates.daily - a.rates.daily,
  rating: (a, b) => (b.rating ?? 0) - (a.rating ?? 0),
  seats: (a, b) => b.seats - a.seats,
};

function applyFilters(filters: VehicleFilters): Vehicle[] {
  const search = filters.search?.trim().toLowerCase();
  return mockVehicles
    .filter((car) => !search || car.name.toLowerCase().includes(search) || car.category.toLowerCase().includes(search))
    .filter((car) => !filters.category || car.category === filters.category)
    .filter((car) => !filters.transmission || car.transmission === filters.transmission)
    .filter((car) => !filters.fuel || car.fuel === filters.fuel)
    .filter((car) => !filters.minSeats || car.seats >= filters.minSeats)
    .filter((car) => !filters.maxDailyRate || car.rates.daily <= filters.maxDailyRate)
    .filter((car) => !filters.availableOnly || car.availableUnits > 0)
    .sort(sorters[filters.sort ?? 'recommended']);
}

export const mockVehicleApi: VehicleApi = {
  async list(filters) {
    currentMockUser();
    return mockDelay(applyFilters(filters));
  },

  async show(id) {
    currentMockUser();
    const vehicle = mockVehicles.find((item) => String(item.id) === String(id));
    if (!vehicle) throw mockNotFound();
    return mockDelay(vehicle);
  },

  async homeFeed() {
    currentMockUser();
    const available = mockVehicles.filter((car) => car.availableUnits > 0);
    return mockDelay({
      recommended: [...available].sort(sorters.recommended).slice(0, 4),
      popular: [...available].sort(sorters.rating).slice(0, 4),
      newArrivals: [...available].reverse().slice(0, 4),
    });
  },
};
