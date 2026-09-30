import { useCallback } from 'react';

import { notificationApi } from '@/services/notificationApi';
import type { Id } from '@/types/api';

import { useApiQuery } from './useApiQuery';

export function useNotifications() {
  const query = useApiQuery('notifications', () => notificationApi.list());
  const { data, setData } = query;

  // Not optimistic: the list only changes after the server confirms, then shows the server's state.
  const markRead = useCallback(
    async (id: Id) => {
      await notificationApi.markRead(id);
      if (data) setData(data.map((item) => (item.id === id ? { ...item, readAt: item.readAt ?? new Date().toISOString() } : item)));
    },
    [data, setData],
  );

  const markAllRead = useCallback(async () => {
    await notificationApi.markAllRead();
    await query.refetch();
  }, [query]);

  const unreadCount = data?.filter((item) => !item.readAt).length ?? 0;

  return { ...query, markRead, markAllRead, unreadCount };
}
