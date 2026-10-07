import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingTop: 20 },
  check: { width: 76, height: 76, borderRadius: 38, backgroundColor: palette.greenSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: palette.navy, fontSize: 30, fontFamily: font.display, marginTop: 16 },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21, fontFamily: font.regular, textAlign: 'center', marginTop: 6 },
  reference: { alignItems: 'center', gap: 6, backgroundColor: palette.blueSoft, borderWidth: 1, borderColor: palette.blueTint, borderRadius: radius.lg, padding: 18, marginTop: 22 },
  referenceLabel: { color: palette.blue, fontSize: 11, fontFamily: font.bold, letterSpacing: 1.2 },
  referenceValue: { color: palette.blueDark, fontSize: 28, fontFamily: font.extrabold, letterSpacing: 0.5 },
  card: { marginTop: 18 },
  vehicleRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  image: { width: 68, height: 68, borderRadius: 12 },
  vehicleCopy: { flex: 1 },
  small: { color: palette.muted, fontSize: 12, fontFamily: font.regular },
  vehicleName: { color: palette.navy, fontSize: 17, fontFamily: font.bold, marginVertical: 2 },
  divider: { height: 1, backgroundColor: palette.divider, marginVertical: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12 },
  steps: { backgroundColor: palette.amberSoft, borderWidth: 1, borderColor: palette.amberBorder, borderRadius: radius.lg, padding: 16, marginTop: 18, gap: 6 },
  stepsHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  stepsTitle: { color: palette.amber, fontSize: 16, fontFamily: font.bold },
  stepText: { color: palette.amberText, fontSize: 14, lineHeight: 21, fontFamily: font.regular },
  stepNumber: { fontFamily: font.bold },
  primary: { marginTop: 22 },
  secondary: { marginTop: 10 },
});
