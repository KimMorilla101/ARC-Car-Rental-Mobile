import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  search: { marginTop: 18 },
  empty: { color: palette.muted, fontSize: 14, fontFamily: font.regular, textAlign: 'center', marginTop: 30 },
  section: { marginTop: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  sectionTitle: { color: palette.navy, fontSize: 18, fontFamily: font.bold },
  item: { backgroundColor: palette.white, borderRadius: radius.md, padding: 15, marginTop: 8, borderWidth: 1, borderColor: palette.border },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 10 },
  question: { color: palette.navy, fontSize: 14, fontFamily: font.semibold, flex: 1 },
  answer: { color: palette.muted, fontSize: 13, lineHeight: 20, fontFamily: font.regular, marginTop: 10 },
});
