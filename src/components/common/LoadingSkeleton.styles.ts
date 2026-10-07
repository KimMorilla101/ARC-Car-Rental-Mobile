import { StyleSheet } from 'react-native';

import { palette, gutter } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: 18, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: palette.border },
  compactCard: { width: 260, marginRight: 14 },
  cardBody: { padding: 15 },
  padded: { padding: gutter },
  gap: { marginTop: 8 },
  gapLarge: { marginTop: 16 },
  section: { marginTop: 28, marginBottom: 12 },
});
