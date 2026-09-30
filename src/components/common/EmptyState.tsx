import { StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import { PrimaryButton } from './PrimaryButton';

interface EmptyStateProps {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel && onAction && <PrimaryButton label={actionLabel} variant="outline" onPress={onAction} style={styles.action} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: 45, paddingHorizontal: 20 },
  title: { color: palette.navy, fontSize: 19, fontWeight: '800', textAlign: 'center' },
  message: { color: palette.muted, marginTop: 7, textAlign: 'center', lineHeight: 20 },
  action: { alignSelf: 'stretch' },
});
