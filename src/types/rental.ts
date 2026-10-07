import type { Id, IsoDateTime } from './api';

export type ExtensionType = 'hourly' | 'daily' | 'monthly';

export type ExtensionStatus = 'pending' | 'approved' | 'declined';

export interface Extension {
  id: Id;
  type: ExtensionType;
  quantity: number;
  requestedReturnAt: IsoDateTime;
  fee: number;
  status: ExtensionStatus;
  createdAt: IsoDateTime;
}

/** One extension type with its rate for this booking's vehicle. */
export interface ExtensionOption {
  type: ExtensionType;
  /** Price of one unit (one hour, day or month). */
  unitFee: number;
  /** "hour", "day" or "month", for labels like "2 days". */
  unitLabel: string;
  maxQuantity: number;
}

export interface ExtensionOptions {
  /** Last moment an extension can be requested (the current fixed return time). */
  deadline: IsoDateTime;
  currentReturnAt: IsoDateTime;
  options: ExtensionOption[];
}

export interface ExtensionRequestPayload {
  type: ExtensionType;
  quantity: number;
}

export interface ReturnSummary {
  scheduledReturnAt: IsoDateTime;
  delayedHours: number;
  lateFeePerHour: number;
  estimatedLateFee: number;
  returnLocation: string;
}
