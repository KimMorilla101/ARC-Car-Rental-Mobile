import { StyleSheet } from 'react-native';

import { palette, font, radius, text } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { marginTop: 16 },
  label: { ...text.label, marginBottom: 8 },
  box: {
    minHeight: 50,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: palette.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: 14,
  },
  boxMultiline: { alignItems: 'flex-start', paddingVertical: 12 },
  boxError: { borderColor: palette.danger, backgroundColor: '#FFFBFB' },
  boxReadOnly: { backgroundColor: palette.divider },
  iconTop: { marginTop: 2 },
  input: { flex: 1, paddingVertical: 13, color: palette.navy, fontSize: 15, fontFamily: font.regular },
  inputMultiline: { minHeight: 100, paddingVertical: 0, textAlignVertical: 'top' },
  inputReadOnly: { color: palette.muted },
  messageRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  error: { color: palette.dangerText, fontSize: 12, fontFamily: font.medium, flexShrink: 1 },
  helper: { ...text.caption, lineHeight: 17, marginTop: 6 },
});
