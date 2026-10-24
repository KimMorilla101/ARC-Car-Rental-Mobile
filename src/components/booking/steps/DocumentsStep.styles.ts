import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  notice: { color: palette.amberText, fontSize: 13, lineHeight: 20, fontFamily: font.regular },
  noticeStrong: { fontFamily: font.bold },
  retry: { marginTop: 12 },
  error: { color: palette.dangerText, fontSize: 13, fontFamily: font.medium, marginTop: 10 },
});
