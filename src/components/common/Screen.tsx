import type { ReactNode } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { gutter, palette, tabBarHeight } from '@/constants/theme';

interface ScreenProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Tab screens leave the bottom edge to the tab bar. */
  edges?: Edge[];
}

/** Page container: canvas background plus safe-area padding for notches and home indicators. */
export function Screen({ children, style, edges = ['top', 'left', 'right', 'bottom'] }: ScreenProps) {
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      {children}
    </SafeAreaView>
  );
}

export const screenStyles = StyleSheet.create({
  /** Scroll content for tab screens (leaves room above the tab bar). */
  tabScroll: { paddingHorizontal: gutter, paddingBottom: tabBarHeight / 2 },
  /** Scroll content for stacked detail/form screens. */
  stackScroll: { padding: gutter, paddingBottom: 40 },
  title: { color: palette.navy, fontSize: 28, fontWeight: '900', marginTop: 12 },
  subtitle: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 6 },
  section: { color: palette.navy, fontSize: 18, fontWeight: '800', marginTop: 24, marginBottom: 10 },
  card: { backgroundColor: palette.white, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: palette.border },
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: palette.canvas },
});
