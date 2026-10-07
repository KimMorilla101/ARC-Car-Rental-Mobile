import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  details: { gap: 10, marginTop: 18 },
  detail: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.white, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.border, padding: 12 },
  detailCopy: { flex: 1 },
  detailLabel: { color: palette.muted, fontSize: 12, fontFamily: font.regular },
  detailValue: { color: palette.navy, fontSize: 15, fontFamily: font.semibold, marginTop: 1 },
  card: { marginTop: 20 },
  success: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: palette.greenSoft, borderRadius: 12, padding: 12, marginTop: 10 },
  successText: { color: palette.greenDark, fontSize: 13, fontFamily: font.semibold, flex: 1 },
  submit: { marginTop: 20 },
});
