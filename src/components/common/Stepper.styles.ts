import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 18 },
  line: { flex: 1, height: 2, backgroundColor: palette.line },
  lineDone: { backgroundColor: palette.blue },
  circle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, borderColor: palette.line, backgroundColor: palette.white, alignItems: 'center', justifyContent: 'center' },
  circleDone: { backgroundColor: palette.blue, borderColor: palette.blue },
  circleActive: { borderColor: palette.blue },
  number: { color: palette.mutedLight, fontSize: 13, fontFamily: font.bold },
  numberActive: { color: palette.blue },
  caption: { color: palette.navy, fontSize: 14, fontFamily: font.bold, marginTop: 10 },
  captionStep: { color: palette.blue },
});
