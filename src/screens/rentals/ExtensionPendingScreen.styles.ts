import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  screen: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  icon: { width: 76, height: 76, borderRadius: 38, backgroundColor: palette.purpleSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: palette.navy, fontSize: 30, fontFamily: font.display, textAlign: 'center', marginTop: 18 },
  text: { color: palette.muted, fontSize: 14, lineHeight: 21, fontFamily: font.regular, textAlign: 'center', marginTop: 8 },
  card: { alignSelf: 'stretch', marginTop: 22 },
  button: { alignSelf: 'stretch', marginTop: 20 },
});
