import RNDateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Modal, Platform, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { palette } from '@/constants/theme';
import { formatDate, formatTime } from '@/utils/formatters';

import { styles } from './DateTimeField.styles';

interface DateTimeFieldProps {
  label: string;
  value: Date;
  mode: 'date' | 'time';
  onChange: (date: Date) => void;
  minimumDate?: Date;
  /** Read-only fields (e.g. the fixed return time) are greyed out and never open a picker. */
  locked?: boolean;
  error?: string | null;
}

/**
 * Labelled date/time input that opens the native picker: the system dialog on Android, a bottom
 * sheet on iOS. Web has no native picker, so the field is display-only there.
 */
export function DateTimeField({ label, value, mode, onChange, minimumDate, locked = false, error }: DateTimeFieldProps) {
  const [iosOpen, setIosOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const display = mode === 'date' ? formatDate(value.toISOString()) : formatTime(value.toISOString());
  const interactive = !locked && Platform.OS !== 'web';

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value, mode, minimumDate, onValueChange: (_event, date) => onChange(date) });
      return;
    }
    setDraft(value);
    setIosOpen(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <Pressable
        onPress={open}
        disabled={!interactive}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${display}`}
        accessibilityHint={locked ? 'This value is fixed' : `Opens a ${mode} picker`}
        style={[styles.field, locked && styles.fieldLocked, error ? styles.fieldError : null]}>
        <Icon name={mode === 'date' ? 'calendar' : 'clock'} size={16} color={locked ? palette.mutedLight : palette.blue} />
        <Text style={[styles.value, locked && styles.valueLocked]}>{display}</Text>
        {locked && <Icon name="lock" size={14} color={palette.mutedLight} />}
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
            <Button
              label="Done"
              onPress={() => {
                onChange(draft);
                setIosOpen(false);
              }}
            />
          </SafeAreaView>
        </Modal>
      )}
    </View>
  );
}
