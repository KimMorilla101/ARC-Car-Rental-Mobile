import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/common/PrimaryButton';
import { gutter, palette } from '@/constants/theme';
import { formatDate, formatTime } from '@/utils/formatters';

interface DateTimeFieldProps {
  label: string;
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
  minimumDate?: Date;
  /** Read-only fields (e.g. the fixed return time) show a lock hint instead of opening a picker. */
  locked?: boolean;
  error?: string | null;
  /** `dark` for the navy search card on Home. */
  tone?: 'light' | 'dark';
}

/**
 * Tappable field that opens the native picker: the system dialog on Android, a bottom sheet on
 * iOS. Web has no native picker, so the field is display-only there.
 */
export function DateTimeField({ label, value, mode, onChange, minimumDate, locked = false, error, tone = 'light' }: DateTimeFieldProps) {
  const [iosOpen, setIosOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const text = mode === 'date' ? formatDate(value.toISOString()) : formatTime(value.toISOString());
  const interactive = !locked && Platform.OS !== 'web';
  const dark = tone === 'dark';

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value, mode, minimumDate, onValueChange: (_event, date) => onChange(date) });
      return;
    }
    setDraft(value);
    setIosOpen(true);
  };

  return (
    <>
      <Pressable
        onPress={open}
        disabled={!interactive}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${text}`}
        accessibilityHint={locked ? 'This value is fixed' : `Opens a ${mode} picker`}
        style={[dark ? styles.fieldDark : styles.field, error ? styles.fieldError : null]}>
        <Text style={dark ? styles.labelDark : styles.label}>{label.toUpperCase()}</Text>
        <Text style={dark ? styles.valueDark : styles.value}>
          {text}
          {locked ? '  🔒' : ''}
        </Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {Platform.OS === 'ios' && (
        <Modal visible={iosOpen} transparent animationType="slide" onRequestClose={() => setIosOpen(false)}>
          <Pressable style={styles.backdrop} onPress={() => setIosOpen(false)} accessibilityLabel="Close picker" />
          <SafeAreaView edges={['bottom']} style={styles.sheet}>
            <Text style={styles.sheetTitle}>{label}</Text>
            <RNDateTimePicker
              value={draft}
              mode={mode}
              display={mode === 'date' ? 'inline' : 'spinner'}
              minimumDate={minimumDate}
              minuteInterval={mode === 'time' ? 15 : undefined}
              accentColor={palette.blue}
              onValueChange={(_event, date) => setDraft(date)}
            />
            <PrimaryButton
              label="Done"
              onPress={() => {
                onChange(draft);
                setIosOpen(false);
              }}
            />
          </SafeAreaView>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  field: { flex: 1, backgroundColor: palette.white, borderRadius: 13, borderWidth: 1, borderColor: palette.line, padding: 14, marginTop: 10 },
  fieldDark: { flex: 1, borderRadius: 12, backgroundColor: palette.navySoft, padding: 12 },
  fieldError: { borderColor: palette.danger },
  label: { color: palette.label, fontSize: 10, fontWeight: '800', letterSpacing: 1.1 },
  labelDark: { color: '#98A9C0', fontSize: 10, fontWeight: '800' },
  value: { color: palette.navy, fontSize: 14, fontWeight: '700', marginTop: 4 },
  valueDark: { color: palette.white, fontSize: 13, fontWeight: '700', marginTop: 6 },
  error: { color: palette.danger, fontSize: 12, fontWeight: '600', marginTop: 6 },
  backdrop: { flex: 1, backgroundColor: 'rgba(4, 13, 24, 0.45)' },
  sheet: { backgroundColor: palette.white, borderTopLeftRadius: 22, borderTopRightRadius: 22, paddingHorizontal: gutter, paddingTop: 18, paddingBottom: 12 },
  sheetTitle: { color: palette.navy, fontSize: 18, fontWeight: '900', marginBottom: 8 },
});
