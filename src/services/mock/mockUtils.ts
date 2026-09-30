import { ApiError } from '@/services/api';
import { tokenStorage } from '@/services/tokenStorage';

import { MOCK_TOKEN_PREFIX, mockUsers } from './mockDb';

/** Simulated network latency so loading states and skeletons are visible during development. */
export function mockDelay<T>(value: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Mirrors how Laravel would reject a request without a valid Sanctum token. */
export function currentMockUser() {
  const token = tokenStorage.get();
  const user = token?.startsWith(MOCK_TOKEN_PREFIX) ? mockUsers.find((item) => `${MOCK_TOKEN_PREFIX}${item.id}` === token) : undefined;
  if (!user) throw new ApiError('unauthorized', 'Your session has expired. Please sign in again.', 401);
  return user;
}

export function mockValidationError(field: string, message: string): ApiError {
  return new ApiError('validation', message, 422, { [field]: [message] });
}

export function mockNotFound(): ApiError {
  return new ApiError('not_found', 'We could not find what you were looking for.', 404);
}

/** Strips mock-only fields (password, userId) before data reaches the UI. */
export function withoutPrivate<T extends object>(record: T): Omit<T, 'password' | 'userId'> {
  const { password: _password, userId: _userId, ...rest } = record as T & { password?: unknown; userId?: unknown };
  return rest;
}
