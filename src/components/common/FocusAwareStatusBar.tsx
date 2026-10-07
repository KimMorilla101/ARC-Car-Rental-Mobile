import { useIsFocused } from 'expo-router';
import { StatusBar, type StatusBarStyle } from 'expo-status-bar';

/**
 * Status bar style that only applies while its screen is focused. Tabs stay mounted in the
 * background, so a plain <StatusBar style="light" /> on Home would leave white status-bar text
 * on top of the white screens of the other tabs.
 */
export function FocusAwareStatusBar({ style }: { style: StatusBarStyle }) {
  const focused = useIsFocused();
  return focused ? <StatusBar style={style} /> : null;
}
