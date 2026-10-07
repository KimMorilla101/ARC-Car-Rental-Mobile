import { useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

import { Icon } from './Icon';
import { styles } from './Select.styles';

interface SelectProps<T extends string> {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  accessibilityLabel: string;
}

/** Dropdown field (e.g. the sort menu on Browse). The menu opens right under the field. */
export function Select<T extends string>({ value, options, onChange, accessibilityLabel }: SelectProps<T>) {
  const fieldRef = useRef<View>(null);
  const [menu, setMenu] = useState<{ top: number; left: number; width: number } | null>(null);
  const current = options.find((option) => option.value === value);

  const open = () => {
    fieldRef.current?.measureInWindow((x, y, width, height) => setMenu({ top: y + height + 4, left: x, width }));
  };

  return (
    <>
      <Pressable
        ref={fieldRef}
        onPress={open}
        style={[styles.field, menu && styles.fieldOpen]}
        accessibilityRole="button"
        accessibilityLabel={`${accessibilityLabel}: ${current?.label}`}>
        <Text style={styles.value} numberOfLines={1}>
          {current?.label}
        </Text>
        <Icon name="chevron-down" size={16} color={palette.muted} />
      </Pressable>
      <Modal visible={!!menu} transparent statusBarTranslucent animationType="fade" onRequestClose={() => setMenu(null)}>
        <Pressable style={styles.backdrop} onPress={() => setMenu(null)} accessibilityLabel="Close menu" />
        {menu && (
          <View style={[styles.menu, { top: menu.top, left: menu.left, width: Math.max(menu.width, 180) }]} accessibilityRole="menu">
            {options.map((option) => {
              const selected = option.value === value;
              return (
                <Pressable
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setMenu(null);
                  }}
                  style={[styles.option, selected && styles.optionSelected]}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected }}>
                  <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        )}
      </Modal>
    </>
  );
}
