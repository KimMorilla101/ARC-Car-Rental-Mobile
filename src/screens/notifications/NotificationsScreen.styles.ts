import { StyleSheet } from 'react-native';

import { palette, font, text } from '@/constants/theme';

export const styles = StyleSheet.create({
  sectionHeader: { ...text.label, color: palette.muted, marginTop: 20, marginBottom: 10 },
  markAll: { color: palette.blue, fontSize: 14, fontFamily: font.bold, marginBottom: 6 },
  disabled: { color: palette.disabledGray },
});
