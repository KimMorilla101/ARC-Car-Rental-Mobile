import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { palette } from '@/constants/theme';

export function SearchField(props: Pick<TextInputProps, 'value' | 'onChangeText' | 'placeholder' | 'onSubmitEditing'>) {
  return (
    <View style={styles.field}>
      <Text style={styles.icon}>⌕</Text>
      <TextInput
        {...props}
        placeholderTextColor={palette.muted}
        style={styles.input}
        returnKeyType="search"
        autoCorrect={false}
        accessibilityLabel={props.placeholder}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 50,
    borderRadius: 13,
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  icon: { color: palette.blue, fontSize: 25, marginRight: 9 },
  input: { flex: 1, color: palette.ink, fontSize: 14 },
});
