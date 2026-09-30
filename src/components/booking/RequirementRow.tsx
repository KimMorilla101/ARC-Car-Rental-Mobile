import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

interface RequirementRowProps {
  label: string;
  description: string;
  statusText: string;
  statusTone: 'missing' | 'pending' | 'done' | 'error';
  actionLabel?: string;
  onAction?: () => void;
  busy?: boolean;
}

/** One required document with its status and an upload/replace action. */
export function RequirementRow({ label, description, statusText, statusTone, actionLabel, onAction, busy }: RequirementRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.description}>{description}</Text>
        <Text style={[styles.status, toneStyles[statusTone]]}>{statusText}</Text>
      </View>
      {actionLabel && onAction && (
        <Pressable
          onPress={onAction}
          disabled={busy}
          accessibilityRole="button"
          accessibilityLabel={`${actionLabel} ${label}`}
          style={[styles.action, statusTone === 'done' && styles.actionDone]}>
          {busy ? <ActivityIndicator size="small" color={palette.blue} /> : <Text style={styles.actionText}>{actionLabel}</Text>}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { backgroundColor: palette.white, borderRadius: 13, borderWidth: 1, borderColor: palette.border, padding: 13, marginTop: 8, flexDirection: 'row', alignItems: 'center', gap: 10 },
  copy: { flex: 1 },
  label: { color: palette.navy, fontSize: 13, fontWeight: '800' },
  description: { color: palette.muted, fontSize: 11, marginTop: 4 },
  status: { fontSize: 10, fontWeight: '800', marginTop: 5 },
  action: { backgroundColor: palette.blueSoft, borderRadius: 9, paddingHorizontal: 12, paddingVertical: 9, minWidth: 72, alignItems: 'center' },
  actionDone: { backgroundColor: palette.greenSoft },
  actionText: { color: palette.blue, fontSize: 11, fontWeight: '800' },
});

const toneStyles = StyleSheet.create({
  missing: { color: '#C06B23' },
  pending: { color: palette.blue },
  done: { color: palette.green },
  error: { color: palette.danger },
});
