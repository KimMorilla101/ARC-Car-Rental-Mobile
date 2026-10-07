import { StyleSheet } from 'react-native';

import { palette } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.canvas, alignItems: 'center', justifyContent: 'center', padding: 28 },
  icon: { width: 60, height: 60, borderRadius: 30, backgroundColor: palette.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: palette.danger, fontSize: 28, fontWeight: '900' },
  title: { color: palette.navy, fontSize: 24, fontWeight: '800', marginTop: 16, textAlign: 'center' },
  message: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  button: { alignSelf: 'stretch', marginTop: 24 },
});
