import { apiConfig } from '@/constants/api';
import { ENDPOINTS } from '@/constants/endpoints';
import type { UploadFile } from '@/types/api';
import type { ChangePasswordPayload, UpdateProfilePayload, User } from '@/types/auth';

import { apiRequest, toFormData, type Resource } from './api';
import { mockProfileApi } from './mock/mockAuthApi';

export interface ProfileApi {
  update(payload: UpdateProfilePayload): Promise<User>;
  uploadAvatar(file: UploadFile): Promise<User>;
  changePassword(payload: ChangePasswordPayload): Promise<void>;
}

const httpProfileApi: ProfileApi = {
  update: async (payload) => (await apiRequest<Resource<User>>(ENDPOINTS.profile.update, { method: 'PUT', body: payload })).data,
  uploadAvatar: async (file) =>
    (await apiRequest<Resource<User>>(ENDPOINTS.profile.avatar, { method: 'POST', body: toFormData('avatar', file) })).data,
  changePassword: (payload) => apiRequest<void>(ENDPOINTS.profile.password, { method: 'PUT', body: payload }),
};

export const profileApi: ProfileApi = apiConfig.useMockApi ? mockProfileApi : httpProfileApi;
