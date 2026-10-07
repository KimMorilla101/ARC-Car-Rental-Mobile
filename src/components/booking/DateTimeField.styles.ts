import { StyleSheet } from 'react-native';

import { palette, font, radius, gutter, text } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 14 },
  label: { ...text.label, marginBottom: 8 },
  field: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.field, borderRadius: radius.md, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 14 },
  fieldLocked: { backgroundColor: palette.divider },
  fieldError: { borderColor: palette.danger },
  value: { flex: 1, color: palette.navy, fontSize: 15, fontFamily: font.medium },
  valueLocked: { color: palette.muted },
  error: { color: palette.dangerText, fontSize: 12, fontFamily: font.medium, marginTop: 6 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)' },
  sheet: { backgroundColor: palette.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: gutter, paddingTop: 18, paddingBottom: 12, gap: 8 },
  sheetTitle: { color: palette.navy, fontSize: 20, fontFamily: font.display },
});
