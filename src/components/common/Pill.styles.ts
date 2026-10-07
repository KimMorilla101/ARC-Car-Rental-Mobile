import { StyleSheet } from 'react-native';

import { font } from '@/constants/theme';

export const styles = StyleSheet.create({
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, borderWidth: 1, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontFamily: font.bold },
});
