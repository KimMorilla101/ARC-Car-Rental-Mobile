import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  placeholder: { backgroundColor: palette.skeleton, alignItems: 'center', justifyContent: 'center', gap: 6 },
  label: { color: palette.muted, fontSize: 12, fontFamily: font.medium },
});
