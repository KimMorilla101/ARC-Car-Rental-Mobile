import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12, paddingVertical: 7 },
  label: { color: palette.label, fontSize: 14, fontFamily: font.regular, flexShrink: 1 },
  labelStrong: { color: palette.navy, fontFamily: font.bold },
  value: { color: palette.navy, fontSize: 14, fontFamily: font.semibold, textAlign: 'right' },
  valueStrong: { color: palette.blue, fontSize: 20, fontFamily: font.extrabold },
  valueMuted: { color: palette.muted },
  detail: { flexBasis: '47%', flexGrow: 1, marginTop: 14 },
  detailLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  detailLabel: { color: palette.muted, fontSize: 12, fontFamily: font.regular },
  detailValue: { color: palette.navy, fontSize: 15, fontFamily: font.bold, marginTop: 3 },
});
