import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  ringCard: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: palette.white, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.border, padding: 16 },
  ring: { width: 96, height: 96 },
  ringCenter: { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, alignItems: 'center', justifyContent: 'center' },
  ringValue: { color: palette.navy, fontSize: 24, fontFamily: font.display },
  ringCopy: { flex: 1 },
  ringTitle: { color: palette.navy, fontSize: 17, fontFamily: font.bold },
  ringCaption: { color: palette.muted, fontSize: 13, lineHeight: 19, fontFamily: font.regular, marginTop: 4 },
  readOnly: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 8 },
  readOnlyText: { color: palette.muted, fontSize: 11, fontFamily: font.medium },
  banner: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: radius.lg, padding: 18, marginTop: 16 },
  bannerCopy: { flex: 1 },
  bannerLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bannerLabel: { color: '#C7D2FE', fontSize: 11, fontFamily: font.bold, letterSpacing: 1 },
  bannerCaption: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: font.regular, marginTop: 4 },
  bannerValue: { color: palette.white, fontSize: 32, fontFamily: font.display },
});
