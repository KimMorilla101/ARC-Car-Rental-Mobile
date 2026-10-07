import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  list: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.white, borderRadius: radius.lg, borderWidth: 1.5, borderColor: palette.line, padding: 14 },
  optionActive: { borderColor: palette.blue, backgroundColor: palette.blueSoft },
  icon: { width: 40, height: 40, borderRadius: 12, backgroundColor: palette.blueSoft, alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: palette.blue },
  copy: { flex: 1 },
  label: { color: palette.navy, fontSize: 15, fontFamily: font.bold },
  description: { color: palette.muted, fontSize: 12, lineHeight: 17, fontFamily: font.regular, marginTop: 2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: palette.mutedLight, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: palette.blue },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: palette.blue },
  error: { color: palette.dangerText, fontSize: 12, fontFamily: font.medium, marginTop: 8 },
  accounts: { backgroundColor: palette.white, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.border, padding: 16, marginTop: 14, gap: 10 },
  account: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: palette.field, borderRadius: radius.md, padding: 12 },
  provider: { width: 56, color: palette.blue, fontSize: 13, fontFamily: font.extrabold },
  accountCopy: { flex: 1 },
  accountNumber: { color: palette.navy, fontSize: 15, fontFamily: font.bold, letterSpacing: 0.5 },
  accountName: { color: palette.muted, fontSize: 12, fontFamily: font.regular, marginTop: 1 },
});
