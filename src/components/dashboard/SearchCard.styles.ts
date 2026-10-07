import { StyleSheet } from 'react-native';

import { palette, font, radius, shadow, text } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: radius.xl, padding: 18, marginTop: -48, borderWidth: 1, borderColor: palette.border, ...shadow.card },
  label: { ...text.label },
  passengersLabel: { marginTop: 14, marginBottom: 8 },
  location: { height: 48, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: palette.field, borderRadius: radius.md, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 14, marginTop: 8 },
  locationText: { color: palette.navy, fontSize: 15, fontFamily: font.medium },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  flex: { flex: 1 },
  search: { minWidth: 110 },
});
