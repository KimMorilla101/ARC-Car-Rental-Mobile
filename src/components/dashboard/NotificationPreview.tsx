import { Text, View } from 'react-native';

import { type IconName } from '@/components/common/Icon';
import { IconTile } from '@/components/common/IconTile';
import { palette } from '@/constants/theme';
import type { AppNotification, NotificationType } from '@/types/notification';
import { formatRelativeTime } from '@/utils/formatters';

import { styles } from './NotificationPreview.styles';

const typeStyle: Record<NotificationType, { icon: IconName; color: string; background: string }> = {
  booking: { icon: 'check-circle', color: palette.green, background: palette.greenSoft },
  payment: { icon: 'credit-card', color: palette.green, background: palette.greenSoft },
  rental: { icon: 'truck', color: palette.blue, background: palette.blueTint },
  extension: { icon: 'alert-circle', color: palette.purple, background: palette.purpleSoft },
  late_return: { icon: 'bell', color: palette.amberStrong, background: palette.amberSoft },
  general: { icon: 'info', color: palette.blue, background: palette.blueTint },
};

/** Notification card with a coloured icon per type, as on the Figma Notifications screen. */
export function NotificationItem({ notification }: { notification: AppNotification }) {
  const unread = !notification.readAt;
  const style = typeStyle[notification.type];
  return (
    <View style={[styles.card, unread && styles.unread]}>
      <IconTile name={style.icon} color={style.color} background={style.background} size={40} />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.title} numberOfLines={2}>
            {notification.title}
          </Text>
          <View style={styles.timeRow}>
            {unread && <View style={styles.dot} />}
            <Text style={styles.time}>{formatRelativeTime(notification.createdAt)}</Text>
          </View>
        </View>
        <Text style={styles.text}>{notification.body}</Text>
      </View>
    </View>
  );
}
