export type PaymentMethod = 'online' | 'bank_transfer' | 'cash';

export type PaymentStatus = 'awaiting_payment' | 'pending_verification' | 'verified' | 'paid' | 'rejected';

/** Where the renter sends money for online/bank payments, e.g. a GCash or BPI account. */
export interface PaymentAccount {
  provider: string;
  accountName: string;
  accountNumber: string;
}

export interface PaymentMethodOption {
  method: PaymentMethod;
  label: string;
  description: string;
  /** Online and bank-transfer payments need a screenshot/receipt that ARC staff verify. */
  requiresProof: boolean;
  accounts: PaymentAccount[];
}

export interface BookingPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  proofUrl: string | null;
}
