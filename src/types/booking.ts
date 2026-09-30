import type { Id, IsoDateTime } from './api';
import type { BookingPayment, PaymentMethod } from './payment';
import type { Extension } from './rental';
import type { Vehicle } from './vehicle';

/**
 * Booking lifecycle, owned by Laravel. `return_due` means the fixed return time has passed while
 * the vehicle is still out ("Return Vehicle Mode").
 */
export type BookingStatus =
  | 'pending'
  | 'pending_verification'
  | 'confirmed'
  | 'active'
  | 'return_due'
  | 'returned'
  | 'completed'
  | 'cancelled';

export type DeliveryMethod = 'shop_pickup' | 'delivery';

export type RequirementType = 'drivers_license' | 'proof_of_billing' | 'valid_id' | 'down_payment';

export type RequirementStatus = 'missing' | 'pending_verification' | 'verified' | 'rejected';

export interface BookingRequirement {
  type: RequirementType;
  label: string;
  description: string;
  status: RequirementStatus;
  /** Staff note when a document is rejected. */
  rejectionReason: string | null;
}

export interface PriceBreakdown {
  rentalFee: number;
  deliveryFee: number;
  carWashFee: number;
  lateReturnFee: number;
  extensionFee: number;
  downPayment: number;
  total: number;
}

export interface Booking {
  id: Id;
  /** Human-readable code shown to the renter, e.g. "ARC-260924-08". */
  reference: string;
  vehicle: Vehicle;
  unitLabel: string | null;
  pickupAt: IsoDateTime;
  /** Always the same time of day as pickupAt; the renter cannot change it. */
  returnAt: IsoDateTime;
  deliveryMethod: DeliveryMethod;
  pickupLocation: string;
  deliveryAddress: string | null;
  destination: string;
  status: BookingStatus;
  payment: BookingPayment;
  pricing: PriceBreakdown;
  requirements: BookingRequirement[];
  extension: Extension | null;
  /** Server-computed: true while an extension may still be requested. */
  canRequestExtension: boolean;
  trustScore: number | null;
  createdAt: IsoDateTime;
}

export type BookingListFilter = 'all' | 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface BookingQuotePayload {
  vehicleId: Id;
  pickupAt: IsoDateTime;
  returnAt: IsoDateTime;
  deliveryMethod: DeliveryMethod;
  deliveryAddress: string | null;
}

export interface BookingQuote {
  rentalDays: number;
  pricing: PriceBreakdown;
  /** False when no unit is free for the requested window. */
  available: boolean;
  /** Documents the renter must upload for this booking. */
  requirements: Pick<BookingRequirement, 'type' | 'label' | 'description'>[];
}

export interface CreateBookingPayload extends BookingQuotePayload {
  destination: string;
  paymentMethod: PaymentMethod;
  agreementVersion: string;
  agreementAccepted: true;
}

export interface RentalAgreement {
  version: string;
  title: string;
  clauses: string[];
}
