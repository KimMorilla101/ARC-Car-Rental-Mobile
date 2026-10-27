import { ENDPOINTS } from '@/constants/endpoints';

import { apiRequest } from './api';
import { devMocks } from './devMocks';

export interface ContactPayload {
  email: string;
  message: string;
}

export interface SupportApi {
  contact(payload: ContactPayload): Promise<void>;
}

const httpSupportApi: SupportApi = {
  contact: (payload) => apiRequest<void>(ENDPOINTS.support.contact, { method: 'POST', body: payload }),
};

export const supportApi: SupportApi = devMocks?.mockSupportApi ?? httpSupportApi;
