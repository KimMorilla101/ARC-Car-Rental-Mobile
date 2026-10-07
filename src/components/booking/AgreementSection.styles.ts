import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  readState: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  readText: { color: palette.amberStrong, fontSize: 12, fontFamily: font.semibold },
  readDone: { color: palette.green },
  box: { height: 260, marginTop: 10, borderRadius: radius.md, borderWidth: 1, borderColor: palette.divider, backgroundColor: palette.field },
  boxContent: { padding: 14 },
  docTitle: { color: palette.navy, fontSize: 13, fontFamily: font.bold },
  docIntro: { color: palette.muted, fontSize: 13, lineHeight: 19, fontFamily: font.regular, marginTop: 8 },
  section: { marginTop: 14 },
  sectionTitle: { color: palette.navy, fontSize: 12, fontFamily: font.bold, letterSpacing: 0.4 },
  sectionBody: { color: palette.ink, fontSize: 13, lineHeight: 20, fontFamily: font.regular, marginTop: 4 },
  acceptCard: { backgroundColor: palette.white, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.border, padding: 16, marginTop: 16 },
  acceptError: { borderColor: palette.danger },
  acceptText: { color: palette.label, fontSize: 14, lineHeight: 21, fontFamily: font.regular },
  acceptStrong: { color: palette.navy, fontFamily: font.bold },
  hintRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, marginLeft: 28 },
  hint: { color: palette.amberStrong, fontSize: 12, fontFamily: font.medium, flex: 1 },
  error: { color: palette.dangerText, fontSize: 12, fontFamily: font.medium, marginTop: 8, marginLeft: 28 },
});
