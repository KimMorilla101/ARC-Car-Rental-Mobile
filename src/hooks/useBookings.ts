import { use } from 'react';

import { BookingsContext, type BookingsContextValue } from '@/context/AppContext';
import { bookingApi } from '@/services/bookingApi';
import type { Id } from '@/types/api';

import { useApiQuery } from './useApiQuery';

/**
 * The renter's bookings, shared by the Bookings tab badge, Home and My Bookings (one request).
 * Only available inside the signed-in area.
 */
export function useBookings(): BookingsContextValue {
  const context = use(BookingsContext);
  if (!context) throw new Error('useBookings must be used inside <AppProvider>.');
  return context;
}

export function useBooking(id: Id | undefined) {
  return useApiQuery(`booking:${id}`, () => (id === undefined ? Promise.reject(new Error('Missing booking id')) : bookingApi.show(id)));
}
