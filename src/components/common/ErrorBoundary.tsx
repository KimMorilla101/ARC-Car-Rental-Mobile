import { Component, type ErrorInfo, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import { PrimaryButton } from './PrimaryButton';

/** Friendly fallback for unexpected render errors. Never shows the raw error to the renter. */
export function CrashFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.icon}>
        <Text style={styles.iconText}>!</Text>
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>This screen ran into an unexpected problem. Your bookings and account are not affected.</Text>
      <PrimaryButton label="Try again" onPress={onRetry} style={styles.button} />
    </View>
  );
}

interface State {
  hasError: boolean;
}

/**
 * Catches render errors anywhere below it (including in providers) and shows CrashFallback.
 * Route-level errors are also caught by the `ErrorBoundary` export in app/_layout.tsx.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Hook a crash reporter (e.g. Sentry) in here. Only log in development.
    if (__DEV__) console.error('[ErrorBoundary]', error, info.componentStack);
  }

  private reset = () => this.setState({ hasError: false });

  render() {
    return this.state.hasError ? <CrashFallback onRetry={this.reset} /> : this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: palette.canvas, alignItems: 'center', justifyContent: 'center', padding: 28 },
  icon: { width: 60, height: 60, borderRadius: 30, backgroundColor: palette.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: palette.danger, fontSize: 28, fontWeight: '900' },
  title: { color: palette.navy, fontSize: 24, fontWeight: '900', marginTop: 16, textAlign: 'center' },
  message: { color: palette.muted, fontSize: 14, lineHeight: 21, marginTop: 8, textAlign: 'center' },
  button: { alignSelf: 'stretch', marginTop: 24 },
});
