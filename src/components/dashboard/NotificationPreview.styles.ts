import { StyleSheet } from 'react-native';

import { palette, font, radius, shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, backgroundColor: palette.white, borderRadius: radius.lg, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: palette.border, ...shadow.card },
  unread: { borderColor: palette.blueTint },
  body: { flex: 1 },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  title: { color: palette.navy, fontSize: 15, fontFamily: font.bold, flexShrink: 1 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: palette.blue },
  time: { color: palette.muted, fontSize: 11, fontFamily: font.regular },
  text: { color: palette.muted, fontSize: 13, lineHeight: 19, fontFamily: font.regular, marginTop: 4 },
});
