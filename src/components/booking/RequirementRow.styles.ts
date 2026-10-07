import { StyleSheet } from 'react-native';

import { palette, font, radius, shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: radius.lg, borderWidth: 1, borderColor: palette.border, padding: 16, marginTop: 12, ...shadow.card },
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  copy: { flex: 1 },
  label: { color: palette.navy, fontSize: 15, fontFamily: font.bold },
  description: { color: palette.muted, fontSize: 12, fontFamily: font.regular, marginTop: 3 },
  upload: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 50, borderRadius: radius.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: palette.line, marginTop: 14, paddingHorizontal: 12 },
  uploadDone: { borderStyle: 'solid', borderColor: '#A7F3D0', backgroundColor: '#ECFDF5', justifyContent: 'flex-start' },
  uploadText: { color: palette.muted, fontSize: 14, fontFamily: font.semibold },
  uploadDoneText: { color: palette.greenDark, fontSize: 13, fontFamily: font.semibold, flex: 1 },
  replace: { color: palette.blue, fontSize: 12, fontFamily: font.bold },
  pressed: { opacity: 0.8 },
});
