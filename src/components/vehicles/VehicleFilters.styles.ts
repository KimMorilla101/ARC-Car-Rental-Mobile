import { StyleSheet } from 'react-native';

import { palette, font, gutter } from '@/constants/theme';

export const styles = StyleSheet.create({
  chips: { gap: 8, paddingVertical: 4 },
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)' },
  sheet: { backgroundColor: palette.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '88%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: gutter, paddingTop: 20, paddingBottom: 6 },
  title: { color: palette.navy, fontSize: 24, fontFamily: font.display },
  body: { paddingHorizontal: gutter, paddingBottom: 12 },
  group: { marginTop: 18 },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 6 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: palette.mutedLight, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: palette.blue },
  radioDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: palette.blue },
  radioLabel: { color: palette.ink, fontSize: 14, fontFamily: font.regular },
  priceValue: { color: palette.blue, fontSize: 15, fontFamily: font.extrabold },
  footer: { flexDirection: 'row', gap: 10, paddingHorizontal: gutter, paddingTop: 10, paddingBottom: 10, borderTopWidth: 1, borderTopColor: palette.divider },
  footerButton: { flex: 1 },
});
