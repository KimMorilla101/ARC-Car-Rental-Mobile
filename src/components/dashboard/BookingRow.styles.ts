import { StyleSheet } from 'react-native';

import { palette, font, radius, shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.white, borderRadius: radius.lg, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: palette.border, ...shadow.card },
  pressed: { opacity: 0.85 },
  image: { width: 64, height: 56, borderRadius: 10 },
  copy: { flex: 1, gap: 3 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { color: palette.navy, fontSize: 15, fontFamily: font.bold, flexShrink: 1 },
  reference: { color: palette.muted, fontSize: 12, fontFamily: font.medium, letterSpacing: 0.5 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  meta: { color: palette.muted, fontSize: 12, fontFamily: font.regular },
  price: { color: palette.blue, fontSize: 15, fontFamily: font.extrabold, alignSelf: 'flex-end' },
});
