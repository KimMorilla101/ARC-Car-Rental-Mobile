import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { palette } from '@/constants/theme';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string | null;
  helper?: string;
}

/** Labelled text input with inline validation message, in the ARC form style. */
export function FormField({ label, error, helper, multiline, ...inputProps }: FormFieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        {...inputProps}
        multiline={multiline}
        placeholderTextColor={palette.placeholder}
        accessibilityLabel={label}
        accessibilityHint={error ?? helper}
        style={[styles.input, multiline && styles.multiline, error ? styles.inputError : null, inputProps.editable === false && styles.readOnly]}
      />
      {error ? (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: { color: palette.label, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 9, marginTop: 17 },
  input: {
    backgroundColor: palette.white,
    borderRadius: 13,
    paddingHorizontal: 16,
    paddingVertical: 16,
    color: '#14243B',
    fontSize: 15,
    borderWidth: 1,
    borderColor: palette.line,
  },
  multiline: { minHeight: 120, textAlignVertical: 'top' },
  inputError: { borderColor: palette.danger, backgroundColor: '#FFFBFB' },
  readOnly: { backgroundColor: palette.divider, color: palette.muted },
  error: { color: palette.danger, fontSize: 12, fontWeight: '600', marginTop: 6 },
  helper: { color: palette.muted, fontSize: 11, lineHeight: 17, marginTop: 7 },
});
