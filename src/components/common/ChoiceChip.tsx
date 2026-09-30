import { Pressable, StyleSheet, Text } from 'react-native';

import { palette } from '@/constants/theme';

interface ChoiceChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  /** `pill` = rounded filter chip; `card` = full-width selectable option with a tick. */
  shape?: 'pill' | 'card';
}

export function ChoiceChip({ label, active, onPress, shape = 'pill' }: ChoiceChipProps) {
  const card = shape === 'card';
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={card ? 'radio' : 'button'}
      accessibilityState={card ? { checked: active } : { selected: active }}
      style={[card ? styles.card : styles.pill, active && (card ? styles.cardActive : styles.pillActive)]}>
      <Text style={[card ? styles.cardText : styles.pillText, active && (card ? styles.cardTextActive : styles.pillTextActive)]}>
        {card && active ? '✓ ' : ''}
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 9 },
  pillActive: { backgroundColor: palette.blue, borderColor: palette.blue },
  pillText: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  pillTextActive: { color: palette.white },
  card: { flex: 1, backgroundColor: palette.white, borderWidth: 1, borderColor: palette.line, borderRadius: 12, padding: 13 },
  cardActive: { backgroundColor: palette.blueSoft, borderColor: palette.blue },
  cardText: { color: palette.muted, fontSize: 12, fontWeight: '700' },
  cardTextActive: { color: palette.blue },
});
