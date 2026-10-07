import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  rows: { marginTop: 8 },
  placeholder: { color: palette.muted, fontSize: 13, fontFamily: font.regular, marginTop: 10 },
  error: { color: palette.dangerText, fontSize: 13, lineHeight: 19, fontFamily: font.medium, marginTop: 10 },
  divider: { height: 1, backgroundColor: palette.line, marginVertical: 8 },
  balance: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 },
  balanceLabel: { color: palette.navy, fontSize: 14, fontFamily: font.bold },
  balanceValue: { color: palette.navy, fontSize: 15, fontFamily: font.extrabold },
});
