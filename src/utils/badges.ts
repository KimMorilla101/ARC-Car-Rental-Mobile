import type { Booking, BookingStatus } from '@/types/booking';
import type { AppNotification } from '@/types/notification';

/**
 * Finished bookings are history, not something to act on. `returned` counts as finished, matching the
 * "Completed" tab on My Bookings and "Recent Rentals" on Home.
 */
const FINISHED: readonly BookingStatus[] = ['returned', 'completed', 'cancelled'];

/** Open bookings (pending → active/overdue), each booking counted once by id. */
export function countOpenBookings(bookings: readonly Booking[] | undefined): number {
  if (!bookings) return 0;
  return new Set(bookings.filter((item) => !FINISHED.includes(item.status)).map((item) => String(item.id))).size;
}

/** Unread notifications, each counted once by id. */
export function countUnread(notifications: readonly AppNotification[] | undefined): number {
  if (!notifications) return 0;
  return new Set(notifications.filter((item) => !item.readAt).map((item) => String(item.id))).size;
}

/** Text for a navbar badge: null hides it, above 99 shows "99+". */
export function badgeLabel(count: number): string | null {
  if (count <= 0) return null;
  return count > 99 ? '99+' : String(count);
}
