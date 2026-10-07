import { Pressable, Text } from 'react-native';

import { styles } from './ChoiceChip.styles';

/** Rounded filter chip ("All", "Sedan", "Pending (1)"). The active chip is filled blue. */
export function ChoiceChip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected: active }} style={[styles.chip, active && styles.active]}>
      <Text style={[styles.text, active && styles.textActive]}>{label}</Text>
    </Pressable>
  );
}
