import { StyleSheet } from 'react-native';

import { palette, font, radius, shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  field: { height: 48, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: radius.md, paddingHorizontal: 14 },
  fieldOpen: { borderColor: palette.blue, borderWidth: 1.5 },
  value: { color: palette.navy, fontSize: 14, fontFamily: font.medium, flexShrink: 1 },
  backdrop: { flex: 1 },
  menu: { position: 'absolute', backgroundColor: palette.white, borderRadius: radius.sm, borderWidth: 1, borderColor: palette.line, paddingVertical: 4, ...shadow.card },
  option: { paddingHorizontal: 14, paddingVertical: 11 },
  optionSelected: { backgroundColor: palette.blue },
  optionText: { color: palette.navy, fontSize: 14, fontFamily: font.regular },
  optionTextSelected: { color: palette.white, fontFamily: font.semibold },
});
