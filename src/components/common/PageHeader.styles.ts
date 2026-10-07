import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginTop: 12 },
  copy: { flex: 1 },
  subtitle: { marginTop: 4 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, alignSelf: 'flex-start', paddingVertical: 8 },
  backText: { color: palette.blue, fontSize: 14, fontFamily: font.bold },
});
