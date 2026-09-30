export type PaymentMethod = 'online' | 'bank_transfer' | 'cash';

export type PaymentStatus = 'awaiting_payment' | 'pending_verification' | 'verified' | 'paid' | 'rejected';

export interface PaymentMethodOption {
  method: PaymentMethod;
  label: string;
  description: string;
  /** Online and bank-transfer payments need a screenshot/receipt that ARC staff verify. */
  requiresProof: boolean;
  /** Where to send the money (account name/number), shown to the renter. Null for cash. */
  instructions: string | null;
}

export interface BookingPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  proofUrl: string | null;
}
