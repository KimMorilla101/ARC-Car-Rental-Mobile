import type { AuthApi } from '@/services/authApi';
import type { ProfileApi } from '@/services/profileApi';
import type { User } from '@/types/auth';

import { MOCK_TOKEN_PREFIX, mockUsers } from './mockDb';
import { currentMockUser, mockDelay, mockValidationError, withoutPrivate } from './mockUtils';

const publicUser = (user: (typeof mockUsers)[number]): User => withoutPrivate(user);

export const mockAuthApi: AuthApi = {
  async login({ email, password }) {
    await mockDelay(null, 800);
    const user = mockUsers.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    // Same message for unknown email and wrong password, as Laravel does, to avoid account probing.
    if (!user || user.password !== password) throw mockValidationError('email', 'These credentials do not match our records.');
    return { token: `${MOCK_TOKEN_PREFIX}${user.id}`, user: publicUser(user) };
  },

  async register({ name, email, password }) {
    await mockDelay(null, 900);
    if (mockUsers.some((item) => item.email.toLowerCase() === email.trim().toLowerCase())) {
      throw mockValidationError('email', 'The email has already been taken.');
    }
    const user = { id: mockUsers.length + 1, name: name.trim(), email: email.trim(), password, phone: null, address: null, avatarUrl: null, trustScore: null };
    mockUsers.push(user);
    return { token: `${MOCK_TOKEN_PREFIX}${user.id}`, user: publicUser(user) };
  },

  async logout() {
    await mockDelay(null, 300);
  },

  async me() {
    await mockDelay(null, 400);
    return publicUser(currentMockUser());
  },

  async forgotPassword() {
    // Always succeeds, like Laravel's password broker response, so emails cannot be enumerated.
    await mockDelay(null, 800);
  },
};

export const mockProfileApi: ProfileApi = {
  async update(payload) {
    await mockDelay(null, 700);
    const user = currentMockUser();
    Object.assign(user, { name: payload.name.trim(), phone: payload.phone, address: payload.address });
    return publicUser(user);
  },

  async uploadAvatar(file) {
    await mockDelay(null, 900);
    const user = currentMockUser();
    user.avatarUrl = file.uri;
    return publicUser(user);
  },

  async changePassword({ currentPassword, password }) {
    await mockDelay(null, 800);
    const user = currentMockUser();
    if (user.password !== currentPassword) throw mockValidationError('currentPassword', 'The current password is incorrect.');
    user.password = password;
  },
};
