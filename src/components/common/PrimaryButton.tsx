import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { palette } from '@/constants/theme';

type Variant = 'primary' | 'outline' | 'ghost' | 'danger' | 'warning';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export function PrimaryButton({ label, onPress, variant = 'primary', loading = false, disabled = false, style }: PrimaryButtonProps) {
  const inactive = disabled || loading;
  const filled = variant === 'primary' || variant === 'warning';
  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        disabled && filled && styles.disabled,
        disabled && !filled && styles.disabledOutline,
        pressed && styles.pressed,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={filled ? palette.white : palette.blue} />
      ) : (
        <Text style={[styles.text, textStyles[variant], disabled && !filled && styles.disabledText]}>{label}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { borderRadius: 14, minHeight: 54, paddingHorizontal: 18, alignItems: 'center', justifyContent: 'center', marginTop: 18 },
  text: { fontSize: 15, fontWeight: '800' },
  disabled: { backgroundColor: palette.disabled },
  disabledOutline: { borderColor: palette.line },
  disabledText: { color: palette.disabled },
  pressed: { opacity: 0.78 },
});

const variantStyles = StyleSheet.create({
  primary: { backgroundColor: palette.blue },
  outline: { borderWidth: 1, borderColor: palette.blue },
  ghost: {},
  danger: {},
  warning: { backgroundColor: palette.amberStrong },
});

const textStyles = StyleSheet.create({
  primary: { color: palette.white },
  outline: { color: palette.blue },
  ghost: { color: palette.blue },
  danger: { color: palette.danger },
  warning: { color: palette.white },
});
