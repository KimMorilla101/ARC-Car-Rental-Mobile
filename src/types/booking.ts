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

export type RequirementType = 'drivers_license' | 'valid_id' | 'proof_of_billing' | 'down_payment';

export type RequirementStatus = 'missing' | 'pending_verification' | 'verified' | 'rejected';

export interface BookingRequirement {
  type: RequirementType;
  label: string;
  description: string;
  status: RequirementStatus;
  /** Staff note when a document is rejected. */
  rejectionReason: string | null;
}

/** An ARC branch where the renter can pick up and return a car. */
export interface Branch {
  id: Id;
  name: string;
  address: string;
}

/** Delivery area with its fixed delivery fee. */
export interface DeliveryZone {
  id: Id;
  name: string;
  fee: number;
}

export interface BookingLocations {
  branches: Branch[];
  deliveryZones: DeliveryZone[];
}

export interface PriceBreakdown {
  rentalFee: number;
  deliveryFee: number;
  carWashFee: number;
  lateReturnFee: number;
  extensionFee: number;
  total: number;
  downPayment: number;
  /** total minus the down payment. */
  balanceDue: number;
}

export interface Booking {
  id: Id;
  /** Human-readable code shown to the renter, e.g. "BK-2026-0891". */
  reference: string;
  vehicle: Vehicle;
  unitLabel: string | null;
  pickupAt: IsoDateTime;
  /** Always the same time of day as pickupAt; the renter cannot change it. */
  returnAt: IsoDateTime;
  rentalDays: number;
  deliveryMethod: DeliveryMethod;
  /** Branch name for shop pickup, or the delivery address. */
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
  /** Required for shop pickup. */
  branchId: Id | null;
  /** Required for delivery. */
  deliveryZoneId: Id | null;
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

export interface AgreementSection {
  title: string;
  body: string;
}

export interface RentalAgreement {
  version: string;
  title: string;
  sections: AgreementSection[];
}
