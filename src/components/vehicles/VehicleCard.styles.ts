import { StyleSheet } from 'react-native';

import { palette, font, radius, shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: radius.lg, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: palette.border, ...shadow.card },
  image: { width: '100%', height: 180, backgroundColor: palette.skeleton },
  badgeLeft: { position: 'absolute', top: 12, left: 12 },
  badgeRight: { position: 'absolute', top: 12, right: 12 },
  priceTag: { position: 'absolute', right: 12, bottom: 12, backgroundColor: 'rgba(15,23,42,0.75)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  priceTagValue: { color: palette.white, fontSize: 15, fontFamily: font.extrabold },
  priceTagUnit: { fontSize: 11, fontFamily: font.regular },
  body: { padding: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  name: { color: palette.navy, fontSize: 17, fontFamily: font.bold, flex: 1 },
  priceBlock: { alignItems: 'flex-end' },
  price: { color: palette.blue, fontSize: 18, fontFamily: font.extrabold },
  perDay: { color: palette.muted, fontSize: 11, fontFamily: font.regular },
  category: { color: palette.blue, fontSize: 13, fontFamily: font.medium, marginTop: 2 },
  rating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { color: palette.navy, fontSize: 13, fontFamily: font.semibold },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  reviews: { color: palette.muted, fontSize: 12, fontFamily: font.regular },
  description: { color: palette.muted, fontSize: 13, lineHeight: 19, fontFamily: font.regular, marginTop: 8 },
  specLine: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  specText: { color: palette.muted, fontSize: 13, fontFamily: font.regular },
  specDivider: { color: palette.line },
  chips: { flexDirection: 'row', gap: 8, marginTop: 12 },
  chip: { flex: 1, textAlign: 'center', backgroundColor: palette.field, borderRadius: 8, paddingVertical: 7, color: palette.ink, fontSize: 12, fontFamily: font.medium, overflow: 'hidden' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 14 },
  action: { flex: 1 },
});
