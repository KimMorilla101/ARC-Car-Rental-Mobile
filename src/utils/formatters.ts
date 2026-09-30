import type { BookingStatus, DeliveryMethod, RequirementStatus } from '@/types/booking';
import type { PaymentMethod, PaymentStatus } from '@/types/payment';
import type { ExtensionStatus, ExtensionType } from '@/types/rental';

/** Rentals are in Davao City, so dates and money are shown in Philippine format. */
const LOCALE = 'en-PH';

export function formatPeso(amount: number): string {
  return `₱${amount.toLocaleString(LOCALE, { maximumFractionDigits: 2 })}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, { month: 'short', day: '2-digit', year: 'numeric' });
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString(LOCALE, { month: 'long', day: '2-digit', year: 'numeric' });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(LOCALE, { hour: '2-digit', minute: '2-digit', hour12: true });
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} • ${formatTime(iso)}`;
}

export function formatRelativeTime(iso: string, now = Date.now()): string {
  const minutes = Math.round((now - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  if (hours < 48) return 'Yesterday';
  return formatDate(iso);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export function greeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export const bookingStatusLabel: Record<BookingStatus, string> = {
  pending: 'Pending',
  pending_verification: 'Pending Verification',
  confirmed: 'Confirmed',
  active: 'Active Rental',
  return_due: 'Return Vehicle',
  returned: 'Returned',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  online: 'Online Payment',
  bank_transfer: 'Bank Transfer',
  cash: 'Cash In Person',
};

export const paymentStatusLabel: Record<PaymentStatus, string> = {
  awaiting_payment: 'Awaiting payment',
  pending_verification: 'Pending Verification',
  verified: 'Verified',
  paid: 'Paid',
  rejected: 'Rejected',
};

export const requirementStatusLabel: Record<RequirementStatus, string> = {
  missing: 'Missing',
  pending_verification: 'Pending Verification',
  verified: 'Verified',
  rejected: 'Rejected',
};

export const deliveryMethodLabel: Record<DeliveryMethod, string> = {
  shop_pickup: 'ARC shop pickup',
  delivery: 'Vehicle delivery',
};

export const extensionTypeLabel: Record<ExtensionType, string> = {
  hourly: 'Hourly',
  daily: 'Daily',
  monthly: 'Monthly',
};

export const extensionStatusLabel: Record<ExtensionStatus, string> = {
  pending: 'Extension pending approval',
  approved: 'Extension approved',
  declined: 'Extension declined',
};
