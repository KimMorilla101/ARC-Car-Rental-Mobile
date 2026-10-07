import { use } from 'react';

import { NotificationsContext, type NotificationsContextValue } from '@/context/AppContext';

/** Shared notifications state (list, unread count, mark read). Only available inside the signed-in area. */
export function useNotifications(): NotificationsContextValue {
  const context = use(NotificationsContext);
  if (!context) throw new Error('useNotifications must be used inside <AppProvider>.');
  return context;
}
