import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  image: { height: 245, backgroundColor: palette.skeleton },
  placeholder: { alignItems: 'center', justifyContent: 'center', gap: 8 },
  placeholderText: { color: palette.muted, fontSize: 13, fontFamily: font.medium },
  dots: { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.55)' },
  dotActive: { backgroundColor: palette.white, width: 18 },
});
