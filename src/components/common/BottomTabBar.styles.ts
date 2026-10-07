import { StyleSheet } from 'react-native';

import { palette, font, tabBarHeight } from '@/constants/theme';

export const styles = StyleSheet.create({
  bar: { minHeight: tabBarHeight, backgroundColor: palette.white, borderTopWidth: 1, borderTopColor: palette.border, flexDirection: 'row', paddingTop: 8 },
  item: { flex: 1, alignItems: 'center', gap: 3 },
  iconPill: { width: 46, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  iconPillActive: { backgroundColor: palette.blue },
  label: { color: palette.mutedLight, fontSize: 11, fontFamily: font.medium },
  labelActive: { color: palette.blue, fontFamily: font.bold },
  badge: { position: 'absolute', top: -4, right: 4, minWidth: 17, height: 17, borderRadius: 9, backgroundColor: palette.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: palette.white },
  badgeText: { color: palette.white, fontSize: 9, fontFamily: font.bold },
});
