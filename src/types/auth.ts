import type { Id } from './api';

export interface User {
  id: Id;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  /** 0-100, managed by ARC staff. Null until the renter has rental history. */
  trustScore: number | null;
}

export interface LoginPayload {
  email: string;
  password: string;
  /** Sanctum token name, so the renter can see/revoke sessions per device. */
  deviceName: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
  deviceName: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface UpdateProfilePayload {
  name: string;
  phone: string | null;
  address: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}
