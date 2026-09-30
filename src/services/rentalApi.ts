import { apiConfig } from '@/constants/api';
import { ENDPOINTS } from '@/constants/endpoints';
import type { Id } from '@/types/api';
import type { Booking } from '@/types/booking';
import type { ExtensionOptions, ExtensionRequestPayload, ReturnSummary } from '@/types/rental';

import { apiRequest, type Resource } from './api';
import { mockRentalApi } from './mock/mockBookingApi';

export interface RentalApi {
  /** Priced extension choices for a booking; the deadline check is enforced by the server. */
  extensionOptions(bookingId: Id): Promise<ExtensionOptions>;
  requestExtension(bookingId: Id, payload: ExtensionRequestPayload): Promise<Booking>;
  returnSummary(bookingId: Id): Promise<ReturnSummary>;
}

const httpRentalApi: RentalApi = {
  extensionOptions: async (bookingId) =>
    (await apiRequest<Resource<ExtensionOptions>>(ENDPOINTS.rentals.extensionOptions, { params: { id: bookingId } })).data,
  requestExtension: async (bookingId, payload) =>
    (await apiRequest<Resource<Booking>>(ENDPOINTS.rentals.requestExtension, { method: 'POST', params: { id: bookingId }, body: payload })).data,
  returnSummary: async (bookingId) =>
    (await apiRequest<Resource<ReturnSummary>>(ENDPOINTS.rentals.returnSummary, { params: { id: bookingId } })).data,
};

export const rentalApi: RentalApi = apiConfig.useMockApi ? mockRentalApi : httpRentalApi;
