import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  stack: { gap: 16 },
  hint: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  hintText: { color: palette.muted, fontSize: 12, fontFamily: font.regular },
});
