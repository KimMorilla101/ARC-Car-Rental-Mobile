import { StyleSheet } from 'react-native';

import { palette, font, text } from '@/constants/theme';

export const styles = StyleSheet.create({
  flex: { flex: 1 },
  success: { alignItems: 'center', paddingVertical: 30 },
  check: { width: 72, height: 72, borderRadius: 36, backgroundColor: palette.greenSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: palette.navy, fontSize: 28, fontFamily: font.display, marginTop: 16 },
  text: { ...text.subtitle, textAlign: 'center', marginTop: 6 },
  stretch: { alignSelf: 'stretch', marginTop: 22 },
});
