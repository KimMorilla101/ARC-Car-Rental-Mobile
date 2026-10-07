import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', gap: 10, marginTop: 28, marginBottom: 12 },
  copy: { flex: 1 },
  display: { fontFamily: font.display, fontSize: 26, color: palette.navy },
  subtitle: { marginTop: 3 },
  action: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  actionText: { color: palette.blue, fontSize: 13, fontFamily: font.bold },
});
