import { StyleSheet } from 'react-native';

import { palette, font, gutter } from '@/constants/theme';

export const styles = StyleSheet.create({
  hero: { paddingHorizontal: gutter, paddingBottom: 70, backgroundColor: palette.night },
  eyebrow: { color: '#93C5FD', fontSize: 11, fontFamily: font.bold, letterSpacing: 1.4 },
  title: { color: palette.white, fontSize: 40, lineHeight: 46, fontFamily: font.display, marginTop: 12 },
  titleMuted: { color: 'rgba(255,255,255,0.35)' },
  body: { color: palette.onDark, fontSize: 15, lineHeight: 23, fontFamily: font.regular, marginTop: 14 },
  buttons: { flexDirection: 'row', gap: 10, marginTop: 22 },
  button: { flex: 1 },
  stats: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 26 },
  stat: { alignItems: 'center', flex: 1 },
  statValue: { color: palette.white, fontSize: 20, fontFamily: font.display },
  statLabel: { color: palette.onDarkMuted, fontSize: 10, fontFamily: font.regular, textAlign: 'center', marginTop: 2 },
});
