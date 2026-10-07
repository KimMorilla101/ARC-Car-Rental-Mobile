import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  field: { height: 48, borderRadius: radius.md, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, flexDirection: 'row', alignItems: 'center', gap: 9, paddingHorizontal: 14 },
  input: { flex: 1, color: palette.navy, fontSize: 14, fontFamily: font.regular },
});
