import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '@/constants/theme';

interface PaymentProofUploaderProps {
  /** Name of the selected/uploaded file, if any. */
  fileName: string | null;
  onPick: () => void;
  busy?: boolean;
  error?: string | null;
  /** Text shown once a file is attached, e.g. "Proof selected" or "Pending verification". */
  doneLabel?: string;
}

/** Receipt/screenshot picker for online and bank-transfer payments. */
export function PaymentProofUploader({ fileName, onPick, busy, error, doneLabel = 'Proof of payment selected' }: PaymentProofUploaderProps) {
  const done = !!fileName;
  return (
    <>
      <Pressable
        onPress={onPick}
        disabled={busy}
        accessibilityRole="button"
        accessibilityLabel={done ? 'Replace proof of payment' : 'Upload proof of payment'}
        style={[styles.button, done && styles.done, error ? styles.errorBorder : null]}>
        {busy ? (
          <ActivityIndicator color={palette.blue} />
        ) : (
          <>
            <Text style={[styles.text, done && styles.doneText]}>{done ? `✓ ${doneLabel}` : 'Upload payment screenshot / proof'}</Text>
            {done && <Text style={styles.fileName} numberOfLines={1}>{fileName} • Tap to replace</Text>}
          </>
        )}
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </>
  );
}

const styles = StyleSheet.create({
  button: { borderWidth: 1, borderColor: palette.blue, borderRadius: 12, padding: 14, alignItems: 'center', marginTop: 12, minHeight: 50, justifyContent: 'center' },
  done: { backgroundColor: palette.greenSoft, borderColor: '#B6EBD7' },
  errorBorder: { borderColor: palette.danger },
  text: { color: palette.blue, fontWeight: '800', fontSize: 12 },
  doneText: { color: palette.green },
  fileName: { color: palette.muted, fontSize: 11, marginTop: 4 },
  error: { color: palette.danger, fontSize: 12, fontWeight: '600', marginTop: 6 },
});
