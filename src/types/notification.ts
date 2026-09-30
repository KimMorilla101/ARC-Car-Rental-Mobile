import type { Id, IsoDateTime } from './api';

export type NotificationType = 'booking' | 'payment' | 'rental' | 'extension' | 'late_return' | 'general';

export interface AppNotification {
  id: Id;
  type: NotificationType;
  title: string;
  body: string;
  /** Booking the notification refers to, so tapping it can open the booking. */
  bookingId: Id | null;
  readAt: IsoDateTime | null;
  createdAt: IsoDateTime;
}
