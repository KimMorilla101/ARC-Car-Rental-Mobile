import { use } from 'react';

import { AuthContext, type AuthContextValue } from '@/context/AuthContext';

/**
 * Note: `user` can briefly be null inside signed-in screens while sign-out redirects away,
 * so screens should render nothing for a null user rather than assume it exists.
 */
export function useAuth(): AuthContextValue {
  const context = use(AuthContext);
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>.');
  return context;
}
