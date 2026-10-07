import { StyleSheet } from 'react-native';

import { palette, font } from '@/constants/theme';

export const styles = StyleSheet.create({
  container: { alignItems: 'center', marginTop: 16 },
  overlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 28, borderBottomLeftRadius: 44, borderBottomRightRadius: 44, backgroundColor: 'rgba(15,23,42,0.6)', alignItems: 'center', justifyContent: 'center' },
  overlayText: { color: palette.white, fontSize: 10, fontFamily: font.bold },
  initials: { backgroundColor: palette.blueSoft, alignItems: 'center', justifyContent: 'center' },
  initialsText: { color: palette.blue, fontFamily: font.display },
});
