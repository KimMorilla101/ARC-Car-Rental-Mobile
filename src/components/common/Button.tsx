import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { palette, shadow, gradients } from '@/constants/theme';

import { Icon, type IconName } from './Icon';
import { styles, variantStyles } from './Button.styles';

export type ButtonVariant = 'primary' | 'success' | 'purple' | 'warning' | 'outline' | 'ghost' | 'danger' | 'onDark' | 'onDarkOutline';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  icon?: IconName;
  /** Icon after the label, e.g. a chevron for "Continue ›". */
  trailingIcon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  size?: 'md' | 'sm';
  style?: StyleProp<ViewStyle>;
}

const gradientFor: Partial<Record<ButtonVariant, readonly [string, string, ...string[]]>> = {
  primary: gradients.blue,
  success: gradients.green,
  purple: gradients.purple,
};

const foreground: Record<ButtonVariant, string> = {
  primary: palette.white,
  success: palette.white,
  purple: palette.white,
  warning: palette.white,
  outline: palette.ink,
  ghost: palette.blue,
  danger: palette.danger,
  onDark: palette.blue,
  onDarkOutline: palette.white,
};

/** Main button. Filled variants use the Figma gradients; outline/ghost are for secondary actions. */
export function Button({ label, onPress, variant = 'primary', icon, trailingIcon, loading = false, disabled = false, size = 'md', style }: ButtonProps) {
  const inactive = disabled || loading;
  const colors = gradientFor[variant];
  const color = foreground[variant];
  const content = loading ? (
    <ActivityIndicator color={color} />
  ) : (
    <View style={styles.row}>
      {icon && <Icon name={icon} size={size === 'sm' ? 15 : 17} color={color} />}
      <Text style={[styles.label, size === 'sm' && styles.labelSmall, { color }]}>{label}</Text>
      {trailingIcon && <Icon name={trailingIcon} size={size === 'sm' ? 15 : 17} color={color} />}
    </View>
  );

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.small,
        colors && !disabled && shadow.button,
        variantStyles[variant],
        disabled && (colors || variant === 'warning' ? styles.disabledFilled : styles.disabledOutline),
        pressed && styles.pressed,
        style,
      ]}>
      {colors && !disabled ? (
        <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.fill, size === 'sm' && styles.small]}>
          {content}
        </LinearGradient>
      ) : (
        <View style={[styles.fill, size === 'sm' && styles.small]}>{content}</View>
      )}
    </Pressable>
  );
}
