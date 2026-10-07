import type { ReactNode } from 'react';
import { type StyleProp, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { screenStyles, styles } from './Screen.styles';

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

export { screenStyles };
