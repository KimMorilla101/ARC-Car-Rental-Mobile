import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Text, View } from 'react-native';

import { Button } from './Button';
import { styles } from './ErrorBoundary.styles';

/**
 * Friendly fallback for unexpected render errors. Never shows the raw error to the renter.
 * Uses system fonts on purpose: it must still render if the custom fonts failed to load.
 */
export function CrashFallback({ onRetry }: { onRetry: () => void }) {
  return (
    <View style={styles.container} accessibilityRole="alert">
      <View style={styles.icon}>
        <Text style={styles.iconText}>!</Text>
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>This screen ran into an unexpected problem. Your bookings and account are not affected.</Text>
      <Button label="Try again" onPress={onRetry} style={styles.button} />
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
