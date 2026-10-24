import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { palette, text } from '@/constants/theme';
import { useAuth } from '@/hooks/useAuth';

import { Icon } from './Icon';
import { styles } from './PageHeader.styles';

/** Serif page title with optional subtitle and a right-side action, as on every Figma screen. */
export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={text.pageTitle} accessibilityRole="header">
          {title}
        </Text>
        {subtitle ? <Text style={[text.subtitle, styles.subtitle]}>{subtitle}</Text> : null}
      </View>
      {right}
    </View>
  );
}

/** "‹ Back" link used at the top of pushed screens instead of a navigation bar. */
export function BackLink({ label = 'Back', onPress }: { label?: string; onPress?: () => void }) {
  const router = useRouter();
  const { status } = useAuth();
  // With no screen to go back to (e.g. opened from a link), go to the right starting screen:
  // Home when signed in, Welcome otherwise.
  const fallback = status === 'signedIn' ? '/home' : '/';
  return (
    <Pressable
      onPress={onPress ?? (() => (router.canGoBack() ? router.back() : router.replace(fallback)))}
      hitSlop={10}
      style={styles.back}
      accessibilityRole="button"
      accessibilityLabel={label}>
      <Icon name="chevron-left" size={17} color={palette.blue} />
      <Text style={styles.backText}>{label}</Text>
    </Pressable>
  );
}
