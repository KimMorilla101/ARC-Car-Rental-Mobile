/**
 * Laravel uses snake_case JSON keys; the app uses camelCase. The API client converts request
 * bodies/query strings to snake_case and responses to camelCase, so screens and types never deal
 * with snake_case. Values are left untouched.
 */
const toCamel = (key: string) => key.replace(/_([a-z0-9])/g, (_, char: string) => char.toUpperCase());
const toSnake = (key: string) => key.replace(/[A-Z]/g, (char) => `_${char.toLowerCase()}`);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && Object.getPrototypeOf(value) === Object.prototype;
}

function convertKeys(value: unknown, convert: (key: string) => string): unknown {
  if (Array.isArray(value)) return value.map((item) => convertKeys(item, convert));
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [convert(key), convertKeys(item, convert)]));
}

export const camelizeKeys = (value: unknown) => convertKeys(value, toCamel);
export const snakeizeKeys = (value: unknown) => convertKeys(value, toSnake);
export const snakeKey = toSnake;
export const camelKey = toCamel;
