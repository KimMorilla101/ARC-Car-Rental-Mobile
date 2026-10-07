import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  heading: { color: palette.navy, fontSize: 30, fontFamily: font.display, textAlign: 'center', marginTop: 36 },
  subheading: { textAlign: 'center', marginTop: 4, marginBottom: 6 },
  card: { borderRadius: radius.lg, borderWidth: 1, padding: 18, marginTop: 12 },
  cardTitle: { color: palette.navy, fontSize: 17, fontFamily: font.bold, marginTop: 14 },
  cardBody: { color: palette.muted, fontSize: 14, lineHeight: 21, fontFamily: font.regular, marginTop: 6 },
  cta: { borderRadius: radius.xl, padding: 24, marginTop: 24, alignItems: 'center' },
  ctaPill: { borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.12)', paddingHorizontal: 14, paddingVertical: 6 },
  ctaPillText: { color: palette.white, fontSize: 12, fontFamily: font.semibold },
  ctaTitle: { color: palette.white, fontSize: 28, lineHeight: 34, fontFamily: font.display, textAlign: 'center', marginTop: 16 },
  ctaBody: { color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 21, fontFamily: font.regular, textAlign: 'center', marginTop: 10 },
  ctaButton: { marginTop: 20, paddingHorizontal: 8 },
});
