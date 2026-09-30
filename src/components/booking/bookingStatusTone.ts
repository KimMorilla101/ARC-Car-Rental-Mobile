import type { PillTone } from '@/components/common/Pill';
import type { BookingStatus } from '@/types/booking';

export function bookingStatusTone(status: BookingStatus): PillTone {
  switch (status) {
    case 'confirmed':
    case 'active':
      return 'green';
    case 'pending':
    case 'pending_verification':
      return 'blue';
    case 'return_due':
      return 'amber';
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
}
