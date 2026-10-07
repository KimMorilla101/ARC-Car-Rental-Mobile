import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  label: { color: palette.label, fontSize: 11, fontFamily: font.bold, letterSpacing: 1, marginTop: 22, marginBottom: 10 },
  types: { flexDirection: 'row', gap: 8 },
  type: { flex: 1, backgroundColor: palette.white, borderWidth: 1.5, borderColor: palette.line, borderRadius: radius.md, padding: 12 },
  typeActive: { backgroundColor: palette.blue, borderColor: palette.blue },
  typeTitle: { color: palette.navy, fontSize: 14, fontFamily: font.bold },
  typeFee: { color: palette.blue, fontSize: 16, fontFamily: font.extrabold, marginTop: 10 },
  typeUnit: { color: palette.muted, fontSize: 11, fontFamily: font.regular, marginTop: 2 },
  typeTextActive: { color: palette.white },
  typeUnitActive: { color: palette.blueTint },
  counter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: palette.white, borderRadius: radius.md, borderWidth: 1, borderColor: palette.line, padding: 8 },
  counterButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: palette.blueSoft, alignItems: 'center', justifyContent: 'center' },
  counterDisabled: { opacity: 0.4 },
  counterValue: { color: palette.navy, fontSize: 18, fontFamily: font.bold },
  summary: { marginTop: 20 },
  locked: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 4 },
  lockedText: { color: palette.muted, fontSize: 12, fontFamily: font.regular },
  divider: { height: 1, backgroundColor: palette.divider, marginVertical: 8 },
  note: { color: palette.muted, fontSize: 12, lineHeight: 18, fontFamily: font.regular, marginTop: 16 },
  submit: { marginTop: 20 },
  returnCard: { backgroundColor: palette.dangerSoft, borderWidth: 1, borderColor: '#FECACA', borderRadius: radius.lg, padding: 16, marginTop: 18 },
  returnHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  returnTitle: { color: palette.dangerText, fontSize: 17, fontFamily: font.bold },
  returnText: { color: '#7F1D1D', fontSize: 13, lineHeight: 20, fontFamily: font.regular, marginTop: 6 },
  returnFees: { backgroundColor: palette.white, borderRadius: radius.md, paddingHorizontal: 12, paddingVertical: 6, marginTop: 12 },
});
