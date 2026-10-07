import type { Id, IsoDateTime } from './api';

export type VehicleCategory = 'Sedan' | 'SUV' | 'MPV' | 'Pickup' | 'Luxury' | 'Hatchback';
export type Transmission = 'Automatic' | 'Manual';
export type FuelType = 'Gasoline' | 'Diesel' | 'Hybrid' | 'Electric';

export interface VehicleRates {
  hourly: number;
  daily: number;
  monthly: number;
}

export interface Vehicle {
  id: Id;
  name: string;
  category: VehicleCategory;
  rates: VehicleRates;
  imageUrl: string;
  gallery: string[];
  seats: number;
  doors: number | null;
  transmission: Transmission;
  fuel: FuelType;
  rating: number | null;
  reviewCount: number;
  /** Shown as the "Popular" badge. */
  isPopular: boolean;
  description: string;
  features: string[];
  /** Units free for the requested window (or right now, when no window is given). */
  availableUnits: number;
  /** 0-100 match against the renter's history, when the backend provides recommendations. */
  matchScore: number | null;
}

export type VehicleSort = 'recommended' | 'price_asc' | 'price_desc' | 'popular' | 'rating';

export interface VehicleFilters {
  search?: string;
  category?: VehicleCategory;
  transmission?: Transmission;
  fuel?: FuelType;
  minSeats?: number;
  maxDailyRate?: number;
  availableOnly?: boolean;
  /** When both are set, availability is checked for this rental window. */
  pickupAt?: IsoDateTime;
  returnAt?: IsoDateTime;
  sort?: VehicleSort;
}

export interface HomeFeed {
  featured: Vehicle[];
  recommended: Vehicle[];
}
