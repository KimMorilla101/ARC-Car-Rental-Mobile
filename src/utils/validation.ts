/**
 * Client-side validation for fast feedback only. Laravel repeats every check and its 422 errors
 * are shown on the same fields, so these rules must never be treated as the security boundary.
 */
export type Validator = (value: string) => string | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Philippine mobile numbers: 09XXXXXXXXX or +639XXXXXXXXX.
const PH_MOBILE = /^(\+63|0)9\d{9}$/;

export const MIN_PASSWORD_LENGTH = 8;

export const rules = {
  required:
    (label: string): Validator =>
    (value) =>
      value.trim() ? null : `${label} is required.`,
  email: (): Validator => (value) => (EMAIL.test(value.trim()) ? null : 'Enter a valid email address.'),
  minLength:
    (label: string, min: number): Validator =>
    (value) =>
      value.trim().length >= min ? null : `${label} must be at least ${min} characters.`,
  password: (): Validator => (value) =>
    value.length >= MIN_PASSWORD_LENGTH ? null : `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
  matches:
    (other: () => string, message: string): Validator =>
    (value) =>
      value === other() ? null : message,
  phPhone: (): Validator => (value) =>
    !value.trim() || PH_MOBILE.test(value.replace(/[\s-]/g, '')) ? null : 'Enter a valid mobile number, e.g. 09171234567.',
};

/** Runs the validators for each field in order and returns the first message per field. */
export function validate<T extends Record<string, string>>(
  values: T,
  schema: Partial<Record<keyof T, Validator[]>>,
): Partial<Record<keyof T, string>> {
  const errors: Partial<Record<keyof T, string>> = {};
  for (const field of Object.keys(schema) as (keyof T)[]) {
    for (const check of schema[field] ?? []) {
      const message = check(values[field] ?? '');
      if (message) {
        errors[field] = message;
        break;
      }
    }
  }
  return errors;
}

export const hasErrors = (errors: object) => Object.values(errors).some(Boolean);
