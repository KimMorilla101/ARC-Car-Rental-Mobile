import { StyleSheet } from 'react-native';

import { palette, font, gutter } from '@/constants/theme';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { paddingHorizontal: gutter, paddingBottom: 40 },
  body: { marginTop: 20 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 22 },
  back: { flex: 0.6 },
  primary: { flex: 1 },
  progress: { color: palette.muted, fontSize: 12, fontFamily: font.regular, textAlign: 'center', marginTop: 10 },
});
