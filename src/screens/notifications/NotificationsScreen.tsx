import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, SectionList, Text, View } from 'react-native';

import { EmptyState } from '@/components/common/EmptyState';
import { ErrorMessage, ErrorState } from '@/components/common/ErrorMessage';
import { NotificationListSkeleton } from '@/components/common/LoadingSkeleton';
import { PageHeader } from '@/components/common/PageHeader';
import { Screen, screenStyles } from '@/components/common/Screen';
import { NotificationItem } from '@/components/dashboard/NotificationPreview';
import { palette } from '@/constants/theme';
import { useNotifications } from '@/hooks/useNotifications';
import type { AppNotification } from '@/types/notification';
import { getErrorMessage } from '@/utils/errorHandler';

import { styles } from './NotificationsScreen.styles';

export default function NotificationsScreen() {
  const router = useRouter();
  const notifications = useNotifications();
  const [actionError, setActionError] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);

  const list = notifications.error ? [] : (notifications.data ?? []);
  const sections = [
    { title: 'NEW', data: list.filter((item) => !item.readAt) },
    { title: 'EARLIER', data: list.filter((item) => item.readAt) },
  ].filter((section) => section.data.length > 0);

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
      <SectionList
        sections={sections}
        keyExtractor={(item) => String(item.id)}
        stickySectionHeadersEnabled={false}
        renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
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
            <PageHeader
              title="Notifications"
              subtitle={notifications.data ? `${notifications.unreadCount} unread` : undefined}
              right={
                notifications.unreadCount > 0 ? (
                  <Pressable onPress={markAll} disabled={markingAll} hitSlop={8} accessibilityRole="button">
                    <Text style={[styles.markAll, markingAll && styles.disabled]}>{markingAll ? 'Marking…' : 'Mark all read'}</Text>
                  </Pressable>
                ) : null
              }
            />
            <ErrorMessage message={actionError} />
          </View>
        }
        ListEmptyComponent={
          notifications.isLoading ? (
            <NotificationListSkeleton />
          ) : notifications.error ? (
            <ErrorState error={notifications.error} onRetry={notifications.refetch} />
          ) : (
            <EmptyState icon="bell" title="You're all caught up" message="Booking, payment, rental, and extension updates will appear here." />
          )
        }
      />
    </Screen>
  );
}
