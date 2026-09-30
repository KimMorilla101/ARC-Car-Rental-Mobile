import { bookingApi } from '@/services/bookingApi';
import type { Id } from '@/types/api';
import type { BookingListFilter } from '@/types/booking';

import { useApiQuery } from './useApiQuery';

export function useBookings(filter: BookingListFilter) {
  return useApiQuery(`bookings:${filter}`, () => bookingApi.list(filter));
}

export function useBooking(id: Id | undefined) {
  return useApiQuery(`booking:${id}`, () => (id === undefined ? Promise.reject(new Error('Missing booking id')) : bookingApi.show(id)));
}
