import type { ReactNode } from 'react';
import { Text, View } from 'react-native';

import { palette, text } from '@/constants/theme';
import { ApiError } from '@/services/api';
import { getErrorMessage } from '@/utils/errorHandler';

import { Button } from './Button';
import { Icon } from './Icon';
import { styles } from './ErrorMessage.styles';

/** Full-section error with a retry action, used when a screen's data failed to load. */
export function ErrorState({ error, onRetry, title }: { error: unknown; onRetry?: () => void; title?: string }) {
  const notAvailable = error instanceof ApiError && error.kind === 'not_available';
  return (
    <View style={styles.state} accessibilityRole="alert">
      <View style={styles.icon}>
        <Icon name={notAvailable ? 'clock' : 'wifi-off'} size={24} color={palette.danger} />
      </View>
      <Text style={styles.title}>{title ?? (notAvailable ? 'Not available yet' : 'Could not load this')}</Text>
      <Text style={[text.subtitle, styles.message]}>{getErrorMessage(error)}</Text>
      {onRetry && !notAvailable && <Button label="Try again" icon="refresh-cw" variant="outline" onPress={onRetry} style={styles.retry} />}
    </View>
  );
}

/** Compact banner for form submission errors. */
export function ErrorMessage({ message }: { message: string | null | undefined }) {
  if (!message) return null;
  return (
    <View style={styles.banner} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <Icon name="alert-circle" size={16} color={palette.dangerText} />
      <Text style={styles.bannerText}>{message}</Text>
    </View>
  );
}

/** Amber notice box ("All four documents below are mandatory…", "Next Steps"). */
export function NoticeBox({ title, children, tone = 'amber' }: { title?: string; children: ReactNode; tone?: 'amber' | 'blue' }) {
  const blue = tone === 'blue';
  return (
    <View style={[styles.notice, blue && styles.noticeBlue]}>
      <Icon name={blue ? 'info' : 'alert-circle'} size={17} color={blue ? palette.blue : palette.amber} />
      <View style={styles.noticeCopy}>
        {title ? <Text style={[styles.noticeTitle, blue && styles.noticeTitleBlue]}>{title}</Text> : null}
        {typeof children === 'string' ? <Text style={[styles.noticeText, blue && styles.noticeTextBlue]}>{children}</Text> : children}
      </View>
    </View>
  );
}
