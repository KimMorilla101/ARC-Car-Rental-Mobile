import { StyleSheet } from 'react-native';

import { palette, font, text } from '@/constants/theme';

export const styles = StyleSheet.create({
  submit: { marginTop: 24 },
  success: { alignItems: 'center', paddingVertical: 20 },
  check: { width: 64, height: 64, borderRadius: 32, backgroundColor: palette.greenSoft, alignItems: 'center', justifyContent: 'center' },
  successTitle: { color: palette.navy, fontSize: 24, fontFamily: font.display, marginTop: 14 },
  successText: { ...text.subtitle, textAlign: 'center', marginTop: 8 },
  stretch: { alignSelf: 'stretch', marginTop: 22 },
});
