import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  options: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  link: { color: palette.blue, fontSize: 14, fontFamily: font.bold },
  submit: { marginTop: 24 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 22 },
  footerText: { color: palette.muted, fontSize: 14, fontFamily: font.regular },
  demo: { backgroundColor: palette.blueSoft, borderWidth: 1, borderColor: palette.blueTint, borderRadius: 12, padding: 12, marginTop: 22 },
  demoText: { color: palette.blueDark, fontSize: 12, fontFamily: font.medium, textAlign: 'center' },
});
