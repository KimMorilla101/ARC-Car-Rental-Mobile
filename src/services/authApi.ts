import { apiConfig } from '@/constants/api';
import { ENDPOINTS } from '@/constants/endpoints';
import type { AuthResponse, ForgotPasswordPayload, LoginPayload, RegisterPayload, User } from '@/types/auth';

import { apiRequest, type Resource } from './api';
import { mockAuthApi } from './mock/mockAuthApi';

export interface AuthApi {
  login(payload: LoginPayload): Promise<AuthResponse>;
  register(payload: RegisterPayload): Promise<AuthResponse>;
  /** Revokes the current Sanctum token on the server. */
  logout(): Promise<void>;
  me(): Promise<User>;
  forgotPassword(payload: ForgotPasswordPayload): Promise<void>;
}

const httpAuthApi: AuthApi = {
  login: (payload) => apiRequest<AuthResponse>(ENDPOINTS.auth.login, { method: 'POST', body: payload }),
  register: (payload) => apiRequest<AuthResponse>(ENDPOINTS.auth.register, { method: 'POST', body: payload }),
  logout: () => apiRequest<void>(ENDPOINTS.auth.logout, { method: 'POST' }),
  me: async () => (await apiRequest<Resource<User>>(ENDPOINTS.auth.me)).data,
  forgotPassword: (payload) => apiRequest<void>(ENDPOINTS.auth.forgotPassword, { method: 'POST', body: payload }),
};

export const authApi: AuthApi = apiConfig.useMockApi ? mockAuthApi : httpAuthApi;
