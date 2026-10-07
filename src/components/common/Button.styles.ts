import { StyleSheet } from 'react-native';

import { palette, font, radius } from '@/constants/theme';

export const styles = StyleSheet.create({
  base: { borderRadius: radius.md + 2, minHeight: 52, overflow: 'visible' },
  small: { minHeight: 42 },
  fill: { flex: 1, minHeight: 52, borderRadius: radius.md + 2, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontFamily: font.bold, fontSize: 15 },
  labelSmall: { fontSize: 13 },
  disabledFilled: { backgroundColor: palette.disabled },
  disabledOutline: { opacity: 0.5 },
  pressed: { opacity: 0.85, transform: [{ scale: 0.99 }] },
});

export const variantStyles = StyleSheet.create({
  primary: {},
  success: {},
  purple: {},
  warning: { backgroundColor: palette.amberStrong },
  outline: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line },
  ghost: {},
  danger: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.dangerSoft },
  onDark: { backgroundColor: palette.white },
  onDarkOutline: { borderWidth: 1, borderColor: 'rgba(255,255,255,0.45)' },
});
