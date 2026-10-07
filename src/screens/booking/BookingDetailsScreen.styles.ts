import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginTop: 6 },
  headerCopy: { flex: 1 },
  reference: { color: palette.muted, fontSize: 13, fontFamily: font.medium, letterSpacing: 0.5 },
  title: { color: palette.navy, fontSize: 28, fontFamily: font.display, marginTop: 2 },
  image: { width: '100%', height: 180, borderRadius: radius.lg, marginTop: 14, backgroundColor: palette.skeleton },
  returnBanner: { backgroundColor: palette.dangerSoft, borderWidth: 1, borderColor: '#FECACA', borderRadius: radius.lg, padding: 16, marginTop: 16 },
  returnHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  returnTitle: { color: palette.dangerText, fontSize: 17, fontFamily: font.bold },
  returnText: { color: '#7F1D1D', fontSize: 13, lineHeight: 20, fontFamily: font.regular, marginTop: 6 },
  bannerButton: { marginTop: 14 },
  section: { marginTop: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 12 },
  divider: { height: 1, backgroundColor: palette.divider, marginVertical: 12 },
  extensionText: { color: palette.muted, fontSize: 13, lineHeight: 20, fontFamily: font.regular, marginTop: 6 },
  cardButton: { marginTop: 12 },
  docCount: { color: palette.muted, fontSize: 12, fontFamily: font.semibold },
});
