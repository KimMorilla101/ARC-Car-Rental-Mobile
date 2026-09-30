import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';
import { ApiError } from '@/services/api';
import { getErrorMessage } from '@/utils/errorHandler';

import { PrimaryButton } from './PrimaryButton';

/** Full-section error with a retry action, used when a screen's data failed to load. */
export function ErrorState({ error, onRetry, title }: { error: unknown; onRetry?: () => void; title?: string }) {
  const notAvailable = error instanceof ApiError && error.kind === 'not_available';
  return (
    <View style={styles.state} accessibilityRole="alert">
      <View style={styles.icon}>
        <Text style={styles.iconText}>!</Text>
      </View>
      <Text style={styles.title}>{title ?? (notAvailable ? 'Not available yet' : 'Could not load this')}</Text>
      <Text style={styles.message}>{getErrorMessage(error)}</Text>
      {onRetry && !notAvailable && <PrimaryButton label="Try again" variant="outline" onPress={onRetry} style={styles.retry} />}
    </View>
  );
}

/** Compact banner for form submission errors. */
export function ErrorMessage({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: 'center', paddingVertical: 40, paddingHorizontal: 20 },
  icon: { width: 48, height: 48, borderRadius: 24, backgroundColor: palette.dangerSoft, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: palette.danger, fontSize: 22, fontWeight: '900' },
  title: { color: palette.navy, fontSize: 18, fontWeight: '800', marginTop: 14, textAlign: 'center' },
  message: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 6, textAlign: 'center' },
  retry: { alignSelf: 'stretch' },
  banner: { backgroundColor: palette.dangerSoft, borderRadius: 12, padding: 13, marginTop: 16 },
  bannerText: { color: '#B23A45', fontSize: 13, lineHeight: 19, fontWeight: '600' },
});
