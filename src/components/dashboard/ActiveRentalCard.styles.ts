import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: { borderRadius: radius.lg + 2, padding: 16, marginTop: 20 },
  row: { flexDirection: 'row', gap: 14, alignItems: 'center' },
  image: { width: 64, height: 64, borderRadius: 12 },
  copy: { flex: 1 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#86EFAC', borderWidth: 2, borderColor: palette.white },
  status: { color: palette.white, fontSize: 11, fontFamily: font.bold, letterSpacing: 1 },
  name: { color: palette.white, fontSize: 19, fontFamily: font.bold, marginTop: 4 },
  returnRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  returnText: { color: 'rgba(255,255,255,0.9)', fontSize: 13, fontFamily: font.regular },
  button: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255,255,255,0.35)', backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 14, paddingVertical: 10 },
  buttonText: { color: palette.white, fontSize: 14, fontFamily: font.bold },
  pressed: { opacity: 0.8 },
});
