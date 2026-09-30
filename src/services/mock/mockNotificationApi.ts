import type { NotificationApi } from '@/services/notificationApi';
import type { SupportApi } from '@/services/supportApi';

import { mockNotifications } from './mockDb';
import { currentMockUser, mockDelay, withoutPrivate } from './mockUtils';

export const mockNotificationApi: NotificationApi = {
  async list() {
    const user = currentMockUser();
    const own = mockNotifications.filter((item) => item.userId === user.id).map(withoutPrivate);
    return mockDelay(own.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },

  async markRead(id) {
    const user = currentMockUser();
    const item = mockNotifications.find((entry) => String(entry.id) === String(id) && entry.userId === user.id);
    if (item && !item.readAt) item.readAt = new Date().toISOString();
    await mockDelay(null, 200);
  },

  async markAllRead() {
    const user = currentMockUser();
    const now = new Date().toISOString();
    mockNotifications.forEach((item) => {
      if (item.userId === user.id && !item.readAt) item.readAt = now;
    });
    await mockDelay(null, 400);
  },
};

export const mockSupportApi: SupportApi = {
  async contact() {
    await mockDelay(null, 900);
  },
};
