import type { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import { Icon } from './Icon';
import { styles } from './Checkbox.styles';

interface CheckboxProps {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export function Checkbox({ label, checked, onChange, disabled = false, accessibilityLabel }: CheckboxProps) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      disabled={disabled}
      hitSlop={8}
      style={[styles.row, disabled && styles.disabled]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={accessibilityLabel ?? (typeof label === 'string' ? label : undefined)}>
      <View style={[styles.box, checked && styles.boxChecked]}>{checked && <Icon name="check" size={12} color={palette.white} />}</View>
      {typeof label === 'string' ? <Text style={styles.label}>{label}</Text> : <View style={styles.custom}>{label}</View>}
    </Pressable>
  );
}
