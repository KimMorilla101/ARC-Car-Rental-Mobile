import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: 30 },
  fullScreen: { flex: 1, backgroundColor: palette.canvas },
  label: { color: palette.muted, fontSize: 13, fontFamily: font.regular, marginTop: 12 },
});
