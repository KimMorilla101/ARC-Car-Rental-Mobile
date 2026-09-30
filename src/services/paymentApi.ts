import { apiConfig } from '@/constants/api';
import { ENDPOINTS } from '@/constants/endpoints';
import type { Id, UploadFile } from '@/types/api';
import type { Booking } from '@/types/booking';
import type { PaymentMethodOption } from '@/types/payment';

import { apiRequest, toFormData, type Resource } from './api';
import { mockPaymentApi } from './mock/mockBookingApi';

export interface PaymentApi {
  /** Payment methods ARC currently accepts, with any transfer instructions. */
  methods(): Promise<PaymentMethodOption[]>;
  /** Uploads a receipt; the payment stays "pending verification" until ARC staff approve it. */
  uploadProof(bookingId: Id, file: UploadFile): Promise<Booking>;
}

const httpPaymentApi: PaymentApi = {
  methods: async () => (await apiRequest<Resource<PaymentMethodOption[]>>(ENDPOINTS.payments.methods)).data,
  uploadProof: async (bookingId, file) =>
    (
      await apiRequest<Resource<Booking>>(ENDPOINTS.payments.uploadProof, {
        method: 'POST',
        params: { id: bookingId },
        body: toFormData('proof', file),
      })
    ).data,
};

export const paymentApi: PaymentApi = apiConfig.useMockApi ? mockPaymentApi : httpPaymentApi;
