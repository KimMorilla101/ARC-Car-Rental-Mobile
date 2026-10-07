import { StyleSheet } from 'react-native';

import { palette, font, radius, shadow, text } from '@/constants/theme';

export const styles = StyleSheet.create({
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: palette.white, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.border, padding: 16, marginTop: 18, ...shadow.card },
  profileCopy: { flex: 1 },
  name: { color: palette.navy, fontSize: 19, fontFamily: font.bold },
  detail: { color: palette.muted, fontSize: 13, fontFamily: font.regular, marginTop: 2 },
  edit: { width: 38, height: 38, borderRadius: 19, backgroundColor: palette.blueSoft, alignItems: 'center', justifyContent: 'center' },
  group: { ...text.label, color: palette.muted, marginTop: 24, marginBottom: 10 },
  menu: { backgroundColor: palette.white, borderRadius: radius.lg, paddingHorizontal: 14, borderWidth: 1, borderColor: palette.border },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: palette.divider },
  rowLast: { borderBottomWidth: 0 },
  pressed: { opacity: 0.7 },
  rowCopy: { flex: 1 },
  rowLabel: { color: palette.navy, fontSize: 15, fontFamily: font.semibold },
  rowDetail: { color: palette.muted, fontSize: 12, fontFamily: font.regular, marginTop: 2 },
  logout: { marginTop: 24 },
  confirm: { backgroundColor: palette.white, borderRadius: radius.lg, padding: 16, marginTop: 24, borderWidth: 1, borderColor: palette.border },
  confirmText: { color: palette.navy, fontSize: 15, fontFamily: font.bold, textAlign: 'center' },
  confirmRow: { flexDirection: 'row', gap: 10, marginTop: 14 },
  confirmButton: { flex: 1 },
  demo: { color: palette.muted, fontSize: 12, fontFamily: font.regular, textAlign: 'center', marginTop: 16 },
});
