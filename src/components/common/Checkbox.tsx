import { Pressable, StyleSheet, Text, View } from 'react-native';

import { palette } from '@/constants/theme';

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <Pressable
      onPress={() => onChange(!checked)}
      hitSlop={8}
      style={styles.row}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}>
      <View style={[styles.box, checked && styles.boxChecked]}>{checked && <Text style={styles.tick}>✓</Text>}</View>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  box: { width: 18, height: 18, borderRadius: 5, borderWidth: 1.5, borderColor: palette.mutedLight, alignItems: 'center', justifyContent: 'center' },
  boxChecked: { backgroundColor: palette.blue, borderColor: palette.blue },
  tick: { color: palette.white, fontSize: 11, fontWeight: '900' },
  label: { color: '#6E7D91', fontSize: 13 },
});
