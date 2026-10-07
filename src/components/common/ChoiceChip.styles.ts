import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  chip: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 999, paddingHorizontal: 15, paddingVertical: 8 },
  active: { backgroundColor: palette.blue, borderColor: palette.blue },
  text: { color: palette.ink, fontSize: 13, fontFamily: font.semibold },
  textActive: { color: palette.white },
});
