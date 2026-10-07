import { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';

import { palette } from '@/constants/theme';

import { Icon, type IconName } from './Icon';
import { styles } from './FormField.styles';

interface FormFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  icon?: IconName;
  error?: string | null;
  helper?: string;
}

/** Labelled input with a leading icon, inline validation message and a show/hide toggle for passwords. */
export function FormField({ label, icon, error, helper, multiline, secureTextEntry, editable, ...inputProps }: FormFieldProps) {
  const [hidden, setHidden] = useState(true);
  const readOnly = editable === false;
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <View style={[styles.box, multiline && styles.boxMultiline, error ? styles.boxError : null, readOnly && styles.boxReadOnly]}>
        {icon && (
          <View style={multiline ? styles.iconTop : undefined}>
            <Icon name={icon} size={17} color={palette.mutedLight} />
          </View>
        )}
        <TextInput
          {...inputProps}
          editable={editable}
          multiline={multiline}
          secureTextEntry={secureTextEntry && hidden}
          placeholderTextColor={palette.placeholder}
          accessibilityLabel={label}
          accessibilityHint={error ?? helper}
          style={[styles.input, multiline && styles.inputMultiline, readOnly && styles.inputReadOnly]}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={10} accessibilityRole="button" accessibilityLabel={hidden ? 'Show password' : 'Hide password'}>
            <Icon name={hidden ? 'eye' : 'eye-off'} size={17} color={palette.mutedLight} />
          </Pressable>
        )}
      </View>
      {error ? (
        <View style={styles.messageRow} accessibilityLiveRegion="polite">
          <Icon name="alert-circle" size={13} color={palette.danger} />
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : helper ? (
        <Text style={styles.helper}>{helper}</Text>
      ) : null}
    </View>
  );
}
