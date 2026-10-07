import type { IconName } from '@/components/common/Icon';
import type { PillTone } from '@/components/common/Pill';
import type { BookingStatus } from '@/types/booking';
import type { PaymentStatus } from '@/types/payment';

export function bookingStatusTone(status: BookingStatus): PillTone {
  switch (status) {
    case 'confirmed':
      return 'blue';
    case 'active':
      return 'green';
    case 'pending':
    case 'pending_verification':
      return 'amber';
    case 'return_due':
    case 'cancelled':
      return 'red';
    default:
      return 'gray';
  }
}

/** Short payment badge shown on booking cards ("Paid", "Unpaid", "Verifying"). */
export const paymentBadge: Record<PaymentStatus, { label: string; tone: PillTone; icon: IconName }> = {
  awaiting_payment: { label: 'Unpaid', tone: 'amber', icon: 'clock' },
  pending_verification: { label: 'Verifying', tone: 'amber', icon: 'clock' },
  verified: { label: 'Paid', tone: 'green', icon: 'check' },
  paid: { label: 'Paid', tone: 'green', icon: 'check' },
  rejected: { label: 'Rejected', tone: 'red', icon: 'x' },
};
