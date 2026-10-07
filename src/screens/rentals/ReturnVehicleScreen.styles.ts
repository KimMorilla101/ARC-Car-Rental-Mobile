import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  alert: { flexDirection: 'row', gap: 12, backgroundColor: palette.dangerSoft, borderWidth: 1, borderColor: '#FECACA', borderRadius: radius.lg, padding: 16, marginTop: 18 },
  alertText: { color: '#7F1D1D', fontSize: 14, lineHeight: 21, fontFamily: font.regular, flex: 1 },
  section: { marginTop: 16 },
  location: { color: palette.navy, fontSize: 15, fontFamily: font.semibold, marginTop: 6 },
  step: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 10 },
  stepNumber: { width: 26, height: 26, borderRadius: 13, backgroundColor: palette.blueSoft, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { color: palette.blue, fontSize: 13, fontFamily: font.bold },
  stepText: { color: palette.ink, fontSize: 14, lineHeight: 20, fontFamily: font.regular, flex: 1 },
  divider: { height: 1, backgroundColor: palette.divider, marginVertical: 8 },
  note: { color: palette.muted, fontSize: 12, lineHeight: 18, fontFamily: font.regular, marginTop: 14 },
});
