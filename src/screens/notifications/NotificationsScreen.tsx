import { useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { NotificationItem } from '@/components/dashboard/NotificationPreview';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorMessage, ErrorState } from '@/components/common/ErrorMessage';
import { NotificationListSkeleton } from '@/components/common/LoadingSkeleton';
import { Screen, screenStyles } from '@/components/common/Screen';
import { TopBar } from '@/components/common/TopBar';
import { palette } from '@/constants/theme';
import { useRefetchOnFocus } from '@/hooks/useApiQuery';
import { useNotifications } from '@/hooks/useNotifications';
import type { AppNotification } from '@/types/notification';
import { getErrorMessage } from '@/utils/errorHandler';

export default function NotificationsScreen() {
  const router = useRouter();
  const notifications = useNotifications();
  useRefetchOnFocus(notifications.refetch);
  const [actionError, setActionError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const open = async (item: AppNotification) => {
    setActionError(null);
    if (!item.readAt) {
      try {
        await notifications.markRead(item.id);
      } catch (error) {
        // Still open the booking; only the read state failed to sync.
        setActionError(getErrorMessage(error));
      }
    }
    if (item.bookingId !== null) router.push({ pathname: '/booking/[id]', params: { id: String(item.bookingId) } });
  };

  const markAll = async () => {
    setActionError(null);
    setMarkingAll(true);
    try {
      await notifications.markAllRead();
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setMarkingAll(false);
    }
  };

  return (
    <Screen edges={['top', 'left', 'right']}>
      <TopBar title="Notifications" />
      <FlatList
        data={notifications.error ? [] : (notifications.data ?? [])}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Pressable onPress={() => open(item)} accessibilityRole="button" accessibilityLabel={`${item.readAt ? '' : 'Unread. '}${item.title}. ${item.body}`}>
            <NotificationItem notification={item} />
          </Pressable>
        )}
        contentContainerStyle={screenStyles.tabScroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={notifications.isRefreshing} onRefresh={notifications.refresh} tintColor={palette.blue} />}
        ListHeaderComponent={
          <View>
            <View style={styles.headingRow}>
              <View style={styles.headingCopy}>
                <Text style={screenStyles.title}>Your updates</Text>
                <Text style={screenStyles.subtitle}>Booking, payment, rental, and extension updates.</Text>
              </View>
              {notifications.unreadCount > 0 && (
                <Pressable onPress={markAll} disabled={markingAll} hitSlop={8} accessibilityRole="button">
                  <Text style={[styles.markAll, markingAll && styles.disabled]}>{markingAll ? 'Marking…' : 'Mark all read'}</Text>
                </Pressable>
              )}
            </View>
            <ErrorMessage message={actionError} />
          </View>
        }
        ListEmptyComponent={
          notifications.isLoading ? (
            <NotificationListSkeleton />
          ) : notifications.error ? (
            <ErrorState error={notifications.error} onRetry={notifications.refetch} />
          ) : (
            <EmptyState title="You are all caught up" message="Booking, payment, and rental updates will appear here." />
          )
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  headingRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 10, marginBottom: 4 },
  headingCopy: { flex: 1 },
  markAll: { color: palette.blue, fontSize: 11, fontWeight: '800', marginBottom: 3 },
  disabled: { color: palette.disabled },
});
