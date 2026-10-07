import type { Id, UploadFile } from '@/types/api';
import type { DeliveryMethod, RequirementType } from '@/types/booking';
import type { PaymentMethod } from '@/types/payment';

/** Everything the renter fills in across the four booking steps. */
export interface BookingDraft {
  pickup: Date;
  /** Only the date is used: the return time always equals the pickup time. */
  returnDate: Date;
  deliveryMethod: DeliveryMethod;
  branchId: Id | null;
  deliveryZoneId: Id | null;
  deliveryAddress: string;
  destination: string;
  documents: Partial<Record<RequirementType, UploadFile>>;
  paymentMethod: PaymentMethod | null;
  paymentProof: UploadFile | null;
  agreementAccepted: boolean;
}

export type DraftErrors = Partial<
  Record<'pickupAt' | 'returnAt' | 'branchId' | 'deliveryZoneId' | 'deliveryAddress' | 'destination' | 'documents' | 'paymentMethod' | 'paymentProof' | 'agreement' | 'vehicleId', string>
>;

export interface StepProps {
  draft: BookingDraft;
  update: (changes: Partial<BookingDraft>) => void;
  errors: DraftErrors;
}

export const BOOKING_STEPS = ['Dates & Delivery', 'Documents', 'Payment', 'Agreement'];
