import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import type { AppNotification } from '@/types/notification';
import { formatRelativeTime } from '@/utils/formatters';

/** Single notification row, used on Home (preview) and the Notifications tab. */
export function NotificationItem({ notification }: { notification: AppNotification }) {
  const unread = !notification.readAt;
  return (
    <View style={[styles.card, unread && styles.unread]}>
      <View style={[styles.dot, !unread && styles.dotRead]} />
      <View style={styles.body}>
        <View style={styles.row}>
          <Text style={styles.title}>{notification.title}</Text>
          <Text style={styles.time}>{formatRelativeTime(notification.createdAt)}</Text>
        </View>
        <Text style={styles.text}>{notification.body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: 16, padding: 16, flexDirection: 'row', marginTop: 12, borderWidth: 1, borderColor: palette.border },
  unread: { backgroundColor: palette.blueTint, borderColor: '#D8E8FF' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.blue, marginTop: 4, marginRight: 11 },
  dotRead: { backgroundColor: '#C4CFDD' },
  body: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  title: { color: palette.navy, fontSize: 14, fontWeight: '900', flexShrink: 1 },
  time: { color: palette.muted, fontSize: 10 },
  text: { color: palette.muted, fontSize: 12, lineHeight: 18, marginTop: 6 },
});
