import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  submit: { marginTop: 24 },
  terms: { color: palette.muted, fontSize: 12, lineHeight: 18, fontFamily: font.regular, textAlign: 'center', marginTop: 18 },
  termsLink: { color: palette.blue, fontFamily: font.semibold },
});
