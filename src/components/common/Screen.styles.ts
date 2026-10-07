import { StyleSheet } from 'react-native';

import { palette, gutter, tabBarHeight } from '@/constants/theme';

export const screenStyles = StyleSheet.create({
  /** Scroll content for tab screens (leaves room above the tab bar). */
  tabScroll: { paddingHorizontal: gutter, paddingBottom: tabBarHeight / 2 },
  /** Gap between stacked cards/sections. */
  gap: { marginTop: 16 },
  /** Scroll content for stacked detail/form screens. */
  stackScroll: { padding: gutter, paddingBottom: 40 },
});

export const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
});
