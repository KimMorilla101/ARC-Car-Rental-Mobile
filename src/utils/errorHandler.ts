import { ApiError } from '@/services/api';

/** Turns any thrown value into a message that is safe to show the renter. */
export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return 'Something went wrong. Please try again.';
}

/**
 * Picks the first Laravel validation message for each form field, so server-side 422 errors
 * appear under the same inputs as client-side validation.
 */
export function getFieldErrors<T extends string>(error: unknown, fields: readonly T[]): Partial<Record<T, string>> {
  if (!(error instanceof ApiError) || error.kind !== 'validation') return {};
  const result: Partial<Record<T, string>> = {};
  for (const field of fields) {
    const message = error.fieldErrors[field]?.[0];
    if (message) result[field] = message;
  }
  return result;
}

/**
 * Message for the form-level banner. Hidden when every validation message is already shown
 * under a field, to avoid repeating it.
 */
export function getFormError(error: unknown, fields: readonly string[]): string | null {
  if (!error) return null;
  if (error instanceof ApiError && error.kind === 'validation') {
    const unmatched = Object.keys(error.fieldErrors).filter((key) => !fields.includes(key));
    if (Object.keys(error.fieldErrors).length > 0 && unmatched.length === 0) return null;
    return unmatched.length ? error.fieldErrors[unmatched[0]][0] : error.message;
  }
  return getErrorMessage(error);
}
