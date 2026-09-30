import { apiConfig } from '@/constants/api';
import type { Endpoint } from '@/constants/endpoints';
import type { ApiErrorKind, FieldErrors, Id, UploadFile } from '@/types/api';

import { camelKey, camelizeKeys, snakeKey, snakeizeKeys } from './caseConversion';
import { tokenStorage } from './tokenStorage';

/** Every failed request becomes an ApiError, so screens only handle one error shape. */
export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number | null;
  readonly fieldErrors: FieldErrors;

  constructor(kind: ApiErrorKind, message: string, status: number | null = null, fieldErrors: FieldErrors = {}) {
    super(message);
    this.name = 'ApiError';
    this.kind = kind;
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

/** Laravel API Resources wrap single models and collections in `{ data: ... }`. */
export interface Resource<T> {
  data: T;
}

type HttpMethod ='GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
type QueryValue = string | number | boolean | null | undefined;

interface RequestOptions {
  method?: HttpMethod;
  /** Plain objects are sent as JSON (snake_cased); FormData is sent as multipart as-is. */
  body?: unknown;
  query?: Record<string, QueryValue>;
  /** Values for `{name}` placeholders in the endpoint path. */
  params?: Record<string, Id>;
}

// Registered by AuthContext so an expired/revoked token logs the renter out everywhere.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

function buildUrl(endpoint: string, params: RequestOptions['params'], query: RequestOptions['query']): string {
  const path = endpoint.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params?.[name];
    if (value === undefined) throw new ApiError('unknown', `Missing path parameter "${name}".`);
    return encodeURIComponent(String(value));
  });
  const search = Object.entries(query ?? {})
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(snakeKey(key))}=${encodeURIComponent(String(value))}`)
    .join('&');
  return `${apiConfig.baseUrl}${path}${search ? `?${search}` : ''}`;
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function errorFromResponse(status: number, body: unknown): ApiError {
  const payload = (body ?? {}) as { message?: unknown; errors?: unknown };
  const serverMessage = typeof payload.message === 'string' ? payload.message : null;

  if (status === 422) {
    // Laravel validation format: { message, errors: { field_name: ["..."] } }
    const errors = (payload.errors ?? {}) as Record<string, string[]>;
    const fieldErrors = Object.fromEntries(Object.entries(errors).map(([key, messages]) => [camelKey(key), messages]));
    return new ApiError('validation', serverMessage ?? 'Please check the highlighted fields.', status, fieldErrors);
  }
  if (status === 401) return new ApiError('unauthorized', 'Your session has expired. Please sign in again.', status);
  if (status === 403) return new ApiError('forbidden', serverMessage ?? 'You are not allowed to do that.', status);
  if (status === 404) return new ApiError('not_found', serverMessage ?? 'We could not find what you were looking for.', status);
  if (status === 429) return new ApiError('rate_limited', 'Too many attempts. Please wait a moment and try again.', status);
  // Never surface raw 5xx messages; they can contain server internals.
  if (status >= 500) return new ApiError('server', 'ARC Ride is having trouble right now. Please try again shortly.', status);
  return new ApiError('unknown', serverMessage ?? 'Something went wrong. Please try again.', status);
}

/**
 * Sends one request to the Laravel API. Adds the bearer token, JSON headers, a timeout, and
 * converts keys between camelCase and snake_case. Resolves with the parsed response body.
 */
export async function apiRequest<T>(endpoint: Endpoint, options: RequestOptions = {}): Promise<T> {
  if (endpoint === null) {
    throw new ApiError('not_available', 'This feature is not available yet. The server endpoint has not been set up.');
  }
  if (apiConfig.configError) throw new ApiError('not_available', apiConfig.configError);

  const method = options.method ?? 'GET';
  const token = tokenStorage.get();
  const isMultipart = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined && !isMultipart) headers['Content-Type'] = 'application/json';

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), apiConfig.timeoutMs);

  let response: Response;
  try {
    response = await fetch(buildUrl(endpoint, options.params, options.query), {
      method,
      headers,
      body: options.body === undefined ? undefined : isMultipart ? (options.body as FormData) : JSON.stringify(snakeizeKeys(options.body)),
      signal: controller.signal,
    });
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (controller.signal.aborted) throw new ApiError('timeout', 'The server took too long to respond. Please try again.');
    throw new ApiError('network', 'Cannot reach ARC Ride. Check your internet connection and try again.');
  } finally {
    clearTimeout(timer);
  }

  // Log only method, route template and status: never bodies, tokens or query values.
  if (__DEV__) console.debug(`[api] ${method} ${endpoint} -> ${response.status}`);

  const body = await readJson(response);
  if (!response.ok) {
    const error = errorFromResponse(response.status, body);
    // Only a request that carried a token can prove the session is invalid.
    if (error.kind === 'unauthorized' && token) onUnauthorized?.();
    throw error;
  }
  return camelizeKeys(body) as T;
}

/** Builds multipart form data for a file upload plus optional extra fields. */
export function toFormData(fileField: string, file: UploadFile, fields: Record<string, string> = {}): FormData {
  const form = new FormData();
  Object.entries(fields).forEach(([key, value]) => form.append(snakeKey(key), value));
  // React Native's FormData accepts { uri, name, type } objects for files.
  form.append(snakeKey(fileField), { uri: file.uri, name: file.name, type: file.mimeType } as unknown as Blob);
  return form;
}
