import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 28 },
  cell: { flexBasis: '48%', flexGrow: 1 },
  pressed: { opacity: 0.85 },
  tile: { borderRadius: radius.lg, padding: 16, minHeight: 112, justifyContent: 'space-between' },
  title: { color: palette.white, fontSize: 15, fontFamily: font.bold },
  caption: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontFamily: font.regular, marginTop: 2 },
});
