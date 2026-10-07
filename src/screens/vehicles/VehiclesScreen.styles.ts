import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', gap: 10, marginTop: 18 },
  searchField: { flex: 1.3 },
  sortField: { flex: 1 },
  filterButton: { flexDirection: 'row', alignItems: 'center', gap: 8, alignSelf: 'flex-start', height: 44, paddingHorizontal: 14, marginTop: 10, borderRadius: radius.md, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.white },
  filterText: { color: palette.ink, fontSize: 14, fontFamily: font.semibold },
  filterBadge: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: palette.blue, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  filterBadgeText: { color: palette.white, fontSize: 10, fontFamily: font.bold },
  dateBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: palette.blueSoft, borderRadius: radius.md, padding: 12, marginTop: 12 },
  dateText: { color: palette.blueDark, fontSize: 13, fontFamily: font.semibold, flex: 1 },
  chips: { marginTop: 16 },
  resultCount: { color: palette.muted, fontSize: 14, fontFamily: font.regular, marginTop: 16, marginBottom: 14 },
  resultStrong: { color: palette.navy, fontFamily: font.bold },
});
