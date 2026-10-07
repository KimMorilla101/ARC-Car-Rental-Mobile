import { StyleSheet } from 'react-native';

import { palette, font, gutter, tabBarHeight } from '@/constants/theme';

export const styles = StyleSheet.create({
  scroll: { paddingBottom: tabBarHeight / 2 },
  content: { paddingHorizontal: gutter },
  welcome: { color: palette.navy, fontSize: 26, fontFamily: font.display, marginTop: 28 },
  welcomeSub: { color: palette.muted, fontSize: 14, fontFamily: font.regular, marginTop: 4 },
  shortcuts: { flexDirection: 'row', gap: 10, marginTop: 14 },
  shortcut: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: palette.divider, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 11 },
  shortcutPrimary: { backgroundColor: palette.blueSoft },
  shortcutText: { color: palette.ink, fontSize: 14, fontFamily: font.semibold },
  shortcutTextPrimary: { color: palette.blue },
  pressed: { opacity: 0.8 },
  gap: { marginTop: 20 },
});
