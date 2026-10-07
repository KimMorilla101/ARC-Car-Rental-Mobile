import { TextInput, View, type TextInputProps } from 'react-native';

import { palette } from '@/constants/theme';

import { Icon } from './Icon';
import { styles } from './SearchField.styles';

export function SearchField(props: Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'onSubmitEditing'>) {
  return (
    <View style={styles.field}>
      <Icon name="search" size={17} color={palette.mutedLight} />
      <TextInput
        {...props}
        placeholderTextColor={palette.placeholder}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel={props.placeholder}
      />
    </View>
  );
}
