import { apiConfig } from '@/constants/api';
import { ENDPOINTS } from '@/constants/endpoints';
import type { Id, UploadFile } from '@/types/api';
import type {
  Booking,
  BookingListFilter,
  BookingLocations,
  BookingQuote,
  BookingQuotePayload,
  CreateBookingPayload,
  RentalAgreement,
  RequirementType,
} from '@/types/booking';

import { apiRequest, toFormData, type Resource } from './api';
import { mockBookingApi } from './mock/mockBookingApi';

export interface BookingApi {
  list(filter: BookingListFilter): Promise<Booking[]>;
  show(id: Id): Promise<Booking>;
  /** ARC branches for shop pickup and delivery zones with their fees. */
  locations(): Promise<BookingLocations>;
  /** Server-side price and availability check; the app never computes the final price itself. */
  quote(payload: BookingQuotePayload): Promise<BookingQuote>;
  create(payload: CreateBookingPayload): Promise<Booking>;
  agreement(): Promise<RentalAgreement>;
  uploadRequirement(bookingId: Id, type: RequirementType, file: UploadFile): Promise<Booking>;
}

const httpBookingApi: BookingApi = {
  list: async (filter) =>
    (await apiRequest<Resource<Booking[]>>(ENDPOINTS.bookings.list, { query: { status: filter === 'all' ? undefined : filter } })).data,
  show: async (id) => (await apiRequest<Resource<Booking>>(ENDPOINTS.bookings.show, { params: { id } })).data,
  locations: async () => (await apiRequest<Resource<BookingLocations>>(ENDPOINTS.bookings.locations)).data,
  quote: async (payload) => (await apiRequest<Resource<BookingQuote>>(ENDPOINTS.bookings.quote, { method: 'POST', body: payload })).data,
  create: async (payload) => (await apiRequest<Resource<Booking>>(ENDPOINTS.bookings.create, { method: 'POST', body: payload })).data,
  agreement: async () => (await apiRequest<Resource<RentalAgreement>>(ENDPOINTS.bookings.agreement)).data,
  uploadRequirement: async (bookingId, type, file) =>
    (
      await apiRequest<Resource<Booking>>(ENDPOINTS.bookings.uploadRequirement, {
        method: 'POST',
        params: { id: bookingId },
        body: toFormData('file', file, { type }),
      })
    ).data,
};

export const bookingApi: BookingApi = apiConfig.useMockApi ? mockBookingApi : httpBookingApi;
