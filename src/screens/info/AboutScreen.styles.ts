import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  hero: { width: '100%', height: 190, borderRadius: radius.lg, marginTop: 18 },
  title: { color: palette.navy, fontSize: 26, fontFamily: font.display, marginTop: 22 },
  text: { color: palette.muted, fontSize: 14, lineHeight: 22, fontFamily: font.regular, marginTop: 8 },
  heading: { color: palette.navy, fontSize: 18, fontFamily: font.bold, marginTop: 24 },
  reason: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  reasonText: { color: palette.ink, fontSize: 14, fontFamily: font.medium, flex: 1 },
  button: { marginTop: 28 },
});
