import { StyleSheet } from 'react-native';

import { palette, font, radius, shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: radius.lg, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: palette.border, ...shadow.card },
  pressed: { opacity: 0.85 },
  row: { flexDirection: 'row', gap: 14 },
  image: { width: 84, height: 76, borderRadius: 12 },
  copy: { flex: 1, gap: 4 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 },
  reference: { color: palette.muted, fontSize: 12, fontFamily: font.medium, letterSpacing: 0.5, flexShrink: 1 },
  name: { color: palette.navy, fontSize: 17, fontFamily: font.bold },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  date: { color: palette.muted, fontSize: 12, fontFamily: font.regular },
  bottom: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 12 },
  total: { color: palette.blue, fontSize: 17, fontFamily: font.extrabold },
  spacer: { flex: 1 },
  view: { color: palette.blue, fontSize: 13, fontFamily: font.bold },
});
