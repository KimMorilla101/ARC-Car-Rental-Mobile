import { StyleSheet } from 'react-native';

import { palette, font, radius, shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  card: { backgroundColor: palette.white, borderRadius: radius.lg, padding: 16, borderWidth: 1, borderColor: palette.border, ...shadow.card },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  title: { color: palette.navy, fontSize: 17, fontFamily: font.bold },
  spacer: { flex: 1 },
});
