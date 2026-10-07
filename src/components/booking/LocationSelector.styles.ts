import { StyleSheet } from 'react-native';

import { palette, font, radius, text } from '@/constants/theme';

export const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', gap: 10, marginTop: 10 },
  tile: { flex: 1, alignItems: 'center', gap: 4, borderRadius: radius.md, borderWidth: 1.5, borderColor: palette.line, paddingVertical: 16 },
  tileActive: { borderColor: palette.blue, backgroundColor: palette.blueSoft },
  tileTitle: { color: palette.ink, fontSize: 14, fontFamily: font.bold },
  tileTitleActive: { color: palette.blue },
  tileCaption: { color: palette.muted, fontSize: 12, fontFamily: font.regular },
  label: { ...text.label, marginTop: 18, marginBottom: 8 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: radius.md, borderWidth: 1, borderColor: palette.line, padding: 12, marginBottom: 8 },
  radioRowSelected: { borderColor: palette.blue, backgroundColor: palette.blueSoft },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: palette.mutedLight, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: palette.blue },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: palette.blue },
  radioCopy: { flex: 1 },
  radioTitle: { color: palette.navy, fontSize: 14, fontFamily: font.semibold },
  radioCaption: { color: palette.muted, fontSize: 12, fontFamily: font.regular, marginTop: 2 },
  radioTrailing: { color: palette.blue, fontSize: 14, fontFamily: font.bold },
  error: { color: palette.dangerText, fontSize: 12, fontFamily: font.medium, marginTop: 2 },
});
