/** Laravel usually returns numeric IDs; route params arrive as strings. Accept both. */
export type Id = string | number;

/** ISO-8601 date-time string, e.g. "2026-10-01T09:00:00+08:00". */
export type IsoDateTime = string;

export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'not_found'
  | 'validation'
  | 'rate_limited'
  | 'server'
  | 'not_available'
  | 'unknown';

/** Laravel validation errors (HTTP 422), keyed by camelCase field name. */
export type FieldErrors = Record<string, string[]>;

/** A file picked on the device, ready to be sent as multipart/form-data. */
export interface UploadFile {
  uri: string;
  name: string;
  mimeType: string;
}
