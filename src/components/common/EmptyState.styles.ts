import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  icon: { width: 56, height: 56, borderRadius: 18, backgroundColor: palette.blueSoft, alignItems: 'center', justifyContent: 'center' },
  title: { color: palette.navy, fontSize: 18, fontFamily: font.bold, textAlign: 'center', marginTop: 14 },
  message: { textAlign: 'center', marginTop: 6 },
  action: { alignSelf: 'stretch', marginTop: 18 },
});
