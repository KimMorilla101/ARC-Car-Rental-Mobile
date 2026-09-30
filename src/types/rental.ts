import type { Id, IsoDateTime } from './api';

export type ExtensionType = 'hourly' | 'daily' | 'monthly';

export type ExtensionStatus = 'pending' | 'approved' | 'declined';

export interface Extension {
  id: Id;
  type: ExtensionType;
  requestedReturnAt: IsoDateTime;
  fee: number;
  status: ExtensionStatus;
  createdAt: IsoDateTime;
}

/** One selectable extension, priced by the backend for a specific booking. */
export interface ExtensionOption {
  type: ExtensionType;
  durationLabel: string;
  fee: number;
  requestedReturnAt: IsoDateTime;
}

export interface ExtensionOptions {
  /** Last moment an extension can be requested (the current fixed return time). */
  deadline: IsoDateTime;
  currentReturnAt: IsoDateTime;
  options: ExtensionOption[];
}

export interface ExtensionRequestPayload {
  type: ExtensionType;
}

export interface ReturnSummary {
  scheduledReturnAt: IsoDateTime;
  delayedHours: number;
  lateFeePerHour: number;
  estimatedLateFee: number;
  shopAddress: string;
}
