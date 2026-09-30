import { apiConfig } from '@/constants/api';
import { ENDPOINTS } from '@/constants/endpoints';
import type { Id } from '@/types/api';
import type { AppNotification } from '@/types/notification';

import { apiRequest, type Resource } from './api';
import { mockNotificationApi } from './mock/mockNotificationApi';

export interface NotificationApi {
  list(): Promise<AppNotification[]>;
  markRead(id: Id): Promise<void>;
  markAllRead(): Promise<void>;
}

const httpNotificationApi: NotificationApi = {
  list: async () => (await apiRequest<Resource<AppNotification[]>>(ENDPOINTS.notifications.list)).data,
  markRead: (id) => apiRequest<void>(ENDPOINTS.notifications.markRead, { method: 'POST', params: { id } }),
  markAllRead: () => apiRequest<void>(ENDPOINTS.notifications.markAllRead, { method: 'POST' }),
};

export const notificationApi: NotificationApi = apiConfig.useMockApi ? mockNotificationApi : httpNotificationApi;
