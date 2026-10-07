import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: palette.night },
  safeArea: { flex: 1, paddingHorizontal: 24, width: '100%', maxWidth: 560, alignSelf: 'center' },
  skip: { alignSelf: 'flex-end', paddingTop: 8 },
  skipText: { color: palette.onDark, fontSize: 14, fontFamily: font.semibold },
  content: { flex: 1, justifyContent: 'flex-end', paddingBottom: 12 },
  iconTile: { width: 52, height: 52, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  eyebrow: { fontSize: 12, fontFamily: font.bold, letterSpacing: 1.6, marginTop: 22 },
  title: { color: palette.white, fontSize: 44, lineHeight: 50, fontFamily: font.display, marginTop: 10 },
  body: { color: palette.onDark, fontSize: 15, lineHeight: 24, fontFamily: font.regular, marginTop: 14 },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 28, marginBottom: 28 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.3)' },
  dotActive: { width: 24 },
  registerLink: { alignSelf: 'center', marginTop: 16 },
  registerText: { color: palette.onDarkMuted, fontSize: 13, fontFamily: font.regular },
  registerAccent: { color: palette.white, fontFamily: font.bold },
});
