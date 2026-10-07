import { createContext, useCallback, useMemo, type ReactNode } from 'react';

import { useApiQuery, type ApiQuery } from '@/hooks/useApiQuery';
import { notificationApi } from '@/services/notificationApi';
import type { Id } from '@/types/api';
import type { AppNotification } from '@/types/notification';

export interface NotificationsContextValue extends ApiQuery<AppNotification[]> {
  unreadCount: number;
  markRead(id: Id): Promise<void>;
  markAllRead(): Promise<void>;
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null);

/**
 * Signed-in app state shared across tabs. Notifications live here so the tab-bar badge, Home and
 * the Alerts screen use one request and always agree on the unread count.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const query = useApiQuery('notifications', () => notificationApi.list());
  const { data, setData, refetch } = query;

  // Not optimistic: the list only changes after the server confirms the update.
  const markRead = useCallback(
    async (id: Id) => {
      await notificationApi.markRead(id);
      if (data) setData(data.map((item) => (item.id === id ? { ...item, readAt: item.readAt ?? new Date().toISOString() } : item)));
    },
    [data, setData],
  );

  const markAllRead = useCallback(async () => {
    await notificationApi.markAllRead();
    await refetch();
  }, [refetch]);

  const unreadCount = data?.filter((item) => !item.readAt).length ?? 0;
  const value = useMemo(() => ({ ...query, unreadCount, markRead, markAllRead }), [query, unreadCount, markRead, markAllRead]);

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}
