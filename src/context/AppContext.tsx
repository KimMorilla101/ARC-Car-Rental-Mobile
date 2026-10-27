import { createContext, useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { AppState } from 'react-native';

import { useApiQuery, type ApiQuery } from '@/hooks/useApiQuery';
import { bookingApi } from '@/services/bookingApi';
import { notificationApi } from '@/services/notificationApi';
import type { Id } from '@/types/api';
import type { Booking } from '@/types/booking';
import type { AppNotification } from '@/types/notification';
import { countOpenBookings, countUnread } from '@/utils/badges';

export interface NotificationsContextValue extends ApiQuery<AppNotification[]> {
  unreadCount: number;
  markRead(id: Id): Promise<void>;
  markAllRead(): Promise<void>;
}

export interface BookingsContextValue extends ApiQuery<Booking[]> {
  /** Bookings that are not returned, completed or cancelled (the Bookings tab badge). */
  openCount: number;
}

export const NotificationsContext = createContext<NotificationsContextValue | null>(null);
export const BookingsContext = createContext<BookingsContextValue | null>(null);

// Coming back to the app more often than this reuses the counts already shown.
const FOREGROUND_REFRESH_MIN_MS = 10_000;

/**
 * Signed-in app state shared across tabs. Bookings and notifications live here so the tab-bar badges,
 * Home, My Bookings and Alerts use one request each and always agree on the counts.
 *
 * Everything here belongs to the signed-in renter: the provider is unmounted on logout and remounted
 * per user (see `(app)/_layout.tsx`), so counts never carry over to another account.
 */
export function AppProvider({ children }: { children: ReactNode }) {
  const notifications = useApiQuery('notifications', () => notificationApi.list());
  const bookings = useApiQuery('bookings:all', () => bookingApi.list('all'));
  const { data, setData, refetch: refetchNotifications } = notifications;
  const refetchBookings = bookings.refetch;

  // Refresh both badges when the renter returns to the app (one listener, throttled).
  const lastForegroundRefresh = useRef(0);
  useEffect(() => {
    let previous = AppState.currentState;
    const subscription = AppState.addEventListener('change', (next) => {
      const returned = previous !== 'active' && next === 'active';
      previous = next;
      if (!returned || Date.now() - lastForegroundRefresh.current < FOREGROUND_REFRESH_MIN_MS) return;
      lastForegroundRefresh.current = Date.now();
      refetchBookings();
      refetchNotifications();
    });
    return () => subscription.remove();
  }, [refetchBookings, refetchNotifications]);

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
    await refetchNotifications();
  }, [refetchNotifications]);

  const unreadCount = countUnread(data);
  const openCount = countOpenBookings(bookings.data);
  const notificationsValue = useMemo(() => ({ ...notifications, unreadCount, markRead, markAllRead }), [notifications, unreadCount, markRead, markAllRead]);
  const bookingsValue = useMemo(() => ({ ...bookings, openCount }), [bookings, openCount]);

  return (
    <BookingsContext.Provider value={bookingsValue}>
      <NotificationsContext.Provider value={notificationsValue}>{children}</NotificationsContext.Provider>
    </BookingsContext.Provider>
  );
}
