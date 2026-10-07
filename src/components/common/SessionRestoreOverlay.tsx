import { View } from 'react-native';

import type { AuthStatus } from '@/context/AuthContext';
import { ApiError } from '@/services/api';

import { Button } from './Button';
import { ErrorState } from './ErrorMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { Screen } from './Screen';
import { styles } from './SessionRestoreOverlay.styles';

interface SessionRestoreOverlayProps {
  status: AuthStatus;
  onRetry: () => void;
  onSignOut: () => void;
}

/**
 * Drawn over the navigator while a saved session is being checked, or when the server could not
 * be reached to check it. Renders nothing once the session is resolved.
 */
export function SessionRestoreOverlay({ status, onRetry, onSignOut }: SessionRestoreOverlayProps) {
  if (status === 'restoring') {
    return (
      <View style={styles.overlay}>
        <LoadingSpinner fullScreen />
      </View>
    );
  }
  if (status === 'restoreFailed') {
    return (
      <Screen style={[styles.overlay, styles.centered]}>
        <ErrorState title="Can't reach ARC Ride" error={new ApiError('network', 'We could not check your session. Check your connection and try again.')} onRetry={onRetry} />
        <Button label="Sign out" variant="ghost" onPress={onSignOut} />
      </Screen>
    );
  }
  return null;
}
